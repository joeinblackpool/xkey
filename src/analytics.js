// Website traffic analytics (/website-analytics): a cookie-free tracking script (/a.js) that sites add,
// a beacon endpoint (POST /api/a) and a private live dashboard (/analytics/<secret>).
// Storage: D1 binding ANALYTICS (database xkey-analytics). Aggregated counts only – no IP addresses,
// no cookies; a visitor is a daily-salted hash of IP + browser + site that can't be reversed and
// changes every day (the same approach as Plausible).
//   sites(key, secret, host, created)         – key is public (in the script tag), secret opens the dashboard
//   totals(key, day, n)                        – pageviews per day, also the daily cap counter
//   hits(key, day, path, ref, country, device, n)
//   visitors(key, day, h, m)                   – one row per visitor per day, m = last minute seen (live count)
//   events(key, day, kind, name, n)            – kind: g = goal/conversion, o = outbound click

export const MAX_SITES = 100, DAY_CAP = 5000;
const DAY = 86_400_000;
const SCHEMA = [
  "CREATE TABLE IF NOT EXISTS sites (key TEXT PRIMARY KEY, secret TEXT UNIQUE NOT NULL, host TEXT NOT NULL, created INTEGER NOT NULL)",
  "CREATE TABLE IF NOT EXISTS totals (key TEXT, day INTEGER, n INTEGER, PRIMARY KEY (key, day))",
  "CREATE TABLE IF NOT EXISTS hits (key TEXT, day INTEGER, path TEXT, ref TEXT, country TEXT, device TEXT, n INTEGER, PRIMARY KEY (key, day, path, ref, country, device))",
  "CREATE TABLE IF NOT EXISTS visitors (key TEXT, day INTEGER, h TEXT, m INTEGER, PRIMARY KEY (key, day, h))",
  "CREATE TABLE IF NOT EXISTS events (key TEXT, day INTEGER, kind TEXT, name TEXT, n INTEGER, PRIMARY KEY (key, day, kind, name))",
];
const ready = new WeakMap(); // tables are created once per database binding per isolate
const db = async (env) => {
  const d = env.ANALYTICS;
  if (!ready.has(d)) ready.set(d, d.batch(SCHEMA.map((s) => d.prepare(s))).catch((e) => { ready.delete(d); throw e; }));
  await ready.get(d);
  return d;
};
const token = (n) => { const b = crypto.getRandomValues(new Uint8Array(n)); return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "").slice(0, n); };
export const validSecret = (s) => /^[A-Za-z0-9_-]{16}$/.test(s || "");
const validKey = (s) => /^[A-Za-z0-9_-]{10}$/.test(s || "");
const today = (t = Date.now()) => Math.floor(t / DAY);

export function siteHost(input) {
  let s = String(input || "").trim().toLowerCase();
  if (!s) throw new Error("Enter your website address.");
  if (!/^[a-z]+:\/\//.test(s)) s = "https://" + s;
  let h; try { h = new URL(s).hostname; } catch { throw new Error("That doesn't look like a website address."); }
  if (!/^[a-z0-9.-]+\.[a-z0-9-]{2,}$/.test(h) || /^[\d.]+$/.test(h)) throw new Error("That doesn't look like a website address.");
  return h.replace(/^www\./, "");
}

/** POST /api/analytics (form: url) -> secret of the new dashboard */
export async function createSite(env, url) {
  const host = siteHost(url), d = await db(env);
  const { n } = await d.prepare("SELECT COUNT(*) AS n FROM sites").first();
  if (n >= MAX_SITES) throw new Error("Free analytics is full right now – please try again in a few days.");
  const key = token(10), secret = token(16);
  await d.prepare("INSERT INTO sites (key, secret, host, created) VALUES (?, ?, ?, ?)").bind(key, secret, host, Date.now()).run();
  return secret;
}

const siteCache = new Map();
async function siteByKey(env, key) {
  if (siteCache.has(key)) return siteCache.get(key);
  const row = await (await db(env)).prepare("SELECT key, host FROM sites WHERE key = ?").bind(key).first();
  if (siteCache.size > 500) siteCache.clear();
  siteCache.set(key, row || null);
  return row || null;
}
export async function siteBySecret(env, secret) {
  return validSecret(secret) ? (await db(env)).prepare("SELECT key, secret, host, created FROM sites WHERE secret = ?").bind(secret).first() : null;
}

const BOTS = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|java\/|go-http|axios|node-fetch/i;
const sameSite = (h, host) => h === host || h.endsWith("." + host) || host.endsWith("." + h);
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

let salt = null;
async function dailySalt(env, day) {
  if (salt && salt.day === day) return salt.v;
  let v = env.STATE ? await env.STATE.get("an:salt:" + day) : null;
  if (!v) { v = token(24); if (env.STATE) await env.STATE.put("an:salt:" + day, v, { expirationTtl: 2 * 86_400 }); }
  salt = { day, v };
  return v;
}
async function visitorHash(env, day, ip, ua, key) {
  const data = new TextEncoder().encode(`${await dailySalt(env, day)}|${ip}|${ua}|${key}`);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** POST /api/a – one pageview (e:"v"), goal (e:"g") or outbound click (e:"o"). Always answers 204. */
export async function beacon(request, env) {
  try {
    if (!env.ANALYTICS) return;
    const ua = request.headers.get("user-agent") || "";
    if (!ua || BOTS.test(ua)) return;
    let b; try { b = JSON.parse((await request.text()).slice(0, 4000)); } catch { return; }
    if (!b || !validKey(b.k)) return;
    const site = await siteByKey(env, b.k);
    if (!site) return;
    const origin = hostOf(request.headers.get("origin") || request.headers.get("referer") || "");
    if (origin && !sameSite(origin, site.host)) return; // only count visits on the site itself
    const d = await db(env), day = today(), key = site.key;
    if (b.e === "g" || b.e === "o") {
      const name = String(b.n || "").replace(/\s+/g, " ").trim().slice(0, 80);
      if (!name) return;
      await d.prepare("INSERT INTO events (key, day, kind, name, n) VALUES (?, ?, ?, ?, 1) ON CONFLICT DO UPDATE SET n = n + 1").bind(key, day, b.e, name).run();
      return;
    }
    const tot = await d.prepare("INSERT INTO totals (key, day, n) VALUES (?, ?, 1) ON CONFLICT DO UPDATE SET n = n + 1 RETURNING n").bind(key, day).first();
    if (tot && tot.n > DAY_CAP) return;
    const path = String(b.p || "/").split(/[?#]/)[0].slice(0, 200) || "/";
    const rh = hostOf(b.r || ""), ref = rh && !sameSite(rh, site.host) ? rh : "";
    const w = +b.w || 0, device = w && w < 768 ? "Mobile" : w && w < 1100 ? "Tablet" : "Desktop";
    const country = String((request.cf && request.cf.country) || "").slice(0, 2).toUpperCase() || "??";
    const h = await visitorHash(env, day, request.headers.get("cf-connecting-ip") || "", ua, key);
    await d.batch([
      d.prepare("INSERT INTO hits (key, day, path, ref, country, device, n) VALUES (?, ?, ?, ?, ?, ?, 1) ON CONFLICT DO UPDATE SET n = n + 1").bind(key, day, path, ref, country, device),
      d.prepare("INSERT INTO visitors (key, day, h, m) VALUES (?, ?, ?, ?) ON CONFLICT DO UPDATE SET m = excluded.m").bind(key, day, h, Math.floor(Date.now() / 60_000)),
    ]);
  } catch (e) { console.log("analytics beacon:", e && e.message); }
}

/** GET /api/analytics/<secret>?days=1|7|30 */
export async function statsApi(env, secret, params) {
  if (!env.ANALYTICS) return { status: 503, body: { error: "Analytics isn't available here." } };
  const site = await siteBySecret(env, secret);
  if (!site) return { status: 404, body: { error: "Dashboard not found." } };
  const days = [1, 7, 30, 90].includes(+params.get("days")) ? +params.get("days") : 7;
  const d = await db(env), to = today(), from = to - days + 1, k = site.key;
  const q = (sql, ...a) => d.prepare(sql).bind(k, from, ...a);
  const [daily, uniq, pages, refs, countries, devices, events, live] = (await d.batch([
    q("SELECT day, n FROM totals WHERE key = ? AND day >= ? ORDER BY day"),
    q("SELECT day, COUNT(*) AS n FROM visitors WHERE key = ? AND day >= ? GROUP BY day ORDER BY day"),
    q("SELECT path AS name, SUM(n) AS n FROM hits WHERE key = ? AND day >= ? GROUP BY path ORDER BY n DESC LIMIT 20"),
    q("SELECT ref AS name, SUM(n) AS n FROM hits WHERE key = ? AND day >= ? AND ref != '' GROUP BY ref ORDER BY n DESC LIMIT 20"),
    q("SELECT country AS name, SUM(n) AS n FROM hits WHERE key = ? AND day >= ? GROUP BY country ORDER BY n DESC LIMIT 20"),
    q("SELECT device AS name, SUM(n) AS n FROM hits WHERE key = ? AND day >= ? GROUP BY device ORDER BY n DESC"),
    q("SELECT kind, name, SUM(n) AS n FROM events WHERE key = ? AND day >= ? GROUP BY kind, name ORDER BY n DESC LIMIT 40"),
    d.prepare("SELECT COUNT(*) AS n FROM visitors WHERE key = ? AND day >= ? AND m >= ?").bind(k, to - 1, Math.floor(Date.now() / 60_000) - 30),
  ])).map((r) => r.results || []);
  const views = daily.reduce((s, r) => s + Math.min(r.n, DAY_CAP), 0), visitors = uniq.reduce((s, r) => s + r.n, 0);
  const goals = events.filter((e) => e.kind === "g"), conversions = goals.reduce((s, e) => s + e.n, 0);
  return { status: 200, body: {
    host: site.host, key: k, days, live: (live[0] && live[0].n) || 0, views, visitors,
    conversions, conversionRate: visitors ? Math.round((conversions / visitors) * 1000) / 10 : 0,
    capped: daily.some((r) => r.n > DAY_CAP), cap: DAY_CAP,
    series: Array.from({ length: days }, (_, i) => { const day = from + i; return { day: new Date(day * DAY).toISOString().slice(0, 10), views: Math.min((daily.find((r) => r.day === day) || { n: 0 }).n, DAY_CAP), visitors: (uniq.find((r) => r.day === day) || { n: 0 }).n }; }),
    pages, refs, countries, devices, goals: goals.map(({ name, n }) => ({ name, n })), outbound: events.filter((e) => e.kind === "o").map(({ name, n }) => ({ name, n })),
  } };
}

/** Daily clean-up (from the cron): visitor hashes are kept 31 days, everything else 400. */
export async function pruneAnalytics(env) {
  if (!env.ANALYTICS) return "no D1";
  const d = await db(env), t = today();
  await d.batch([
    d.prepare("DELETE FROM visitors WHERE day < ?").bind(t - 31),
    ...["totals", "hits", "events"].map((tb) => d.prepare(`DELETE FROM ${tb} WHERE day < ?`).bind(t - 400)),
  ]);
  return "pruned";
}

// The tracking script sites add: <script defer data-site="KEY" src="https://xkey.co.uk/a.js"></script>
// Under 1 kB, no cookies, no storage. Counts pageviews (including single-page-app navigation),
// outbound link clicks, tel:/mailto: clicks and anything marked data-xkey-goal="Name".
export const TRACKER_JS = `(function(){var s=document.currentScript,k=s&&s.getAttribute("data-site");if(!k||navigator.webdriver||/^(localhost|127\\.)/.test(location.hostname))return;var u=(s.src.match(/^https?:\\/\\/[^/]+/)||[""])[0]+"/api/a",l="";function send(e,n){var d=JSON.stringify({k:k,e:e,n:n||"",p:location.pathname,r:document.referrer,w:window.innerWidth});if(navigator.sendBeacon)navigator.sendBeacon(u,d);else fetch(u,{method:"POST",body:d,keepalive:true})}function view(){if(l===location.pathname)return;l=location.pathname;send("v")}view();var p=history.pushState;if(p){history.pushState=function(){p.apply(this,arguments);view()};addEventListener("popstate",view)}document.addEventListener("click",function(ev){var a=ev.target&&ev.target.closest&&ev.target.closest("a,[data-xkey-goal]");if(!a)return;var g=a.getAttribute("data-xkey-goal");if(g)return send("g",g);var h=a.href||"";if(/^tel:/.test(h))send("g","Phone call click");else if(/^mailto:/.test(h))send("g","Email click");else if(a.host&&a.host!==location.host&&/^https?:/.test(h))send("o",a.host)},true)})();`;
