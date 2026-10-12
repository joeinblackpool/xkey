// Website uptime & server monitor (/uptime-monitor): checks each site from the 15-minute cron, records
// response time, spots crashes (5xx, timeouts, connection failures), database errors and slowdowns,
// and alerts by push notification (ntfy.sh), Slack, Discord or Teams.
// KV layout (keeps writes to about one per cron run however many sites are watched):
//   up:all        – { mons: { id: Monitor } } – written once per run
//   up:new:<id>   – a new monitor (with its first check) until the next run merges it
//   up:del:<id>   – a stop request, applied by the next run
// Monitor = { url, alert, created, state, last, ms: [last 96 ms, -1 = down], inc: [{ s, e, why }], days: { "YYYY-MM-DD": [checks, up, msSum] } }

const MAX_MONITORS = 200, KEEP_MS = 96, KEEP_DAYS = 31, KEEP_INC = 30, TIMEOUT = 10_000, SLOW_MS = 4000;
export const UA = "Mozilla/5.0 (compatible; XKeyUptime/1.0; +https://xkey.co.uk/uptime-monitor)";
const randomId = () => { const b = crypto.getRandomValues(new Uint8Array(12)); return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
export const validUptimeId = (id) => /^[A-Za-z0-9_-]{16}$/.test(id || "");

// Error pages that still answer 200: the database is down or PHP crashed.
const BROKEN = [
  [/Error establishing a database connection/i, "Database connection error (WordPress)"],
  [/SQLSTATE\[|Too many connections|could not connect to (the )?(database|server)|mysqli?_connect|Database Error/i, "Database connection error"],
  [/There has been a critical error on this website/i, "Critical error (WordPress)"],
  [/<b>Fatal error<\/b>:|PHP Fatal error|Allowed memory size of \d+ bytes exhausted/i, "PHP fatal error"],
  [/Bandwidth Limit Exceeded|Account Suspended|This Account has been suspended/i, "Hosting account suspended"],
  [/Error 52[0-6]|Web server is down|Origin is unreachable|Connection timed out/i, "Cloudflare can't reach the server"],
];

/** Alert target: ntfy topic, or a Slack/Discord/Teams webhook. Anything else is refused (no fetching arbitrary hosts). */
export function parseAlert(input) {
  const s = String(input || "").trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{6,64}$/.test(s)) return { type: "ntfy", to: s };
  const m = s.match(/^https:\/\/ntfy\.sh\/([A-Za-z0-9_-]{6,64})$/);
  if (m) return { type: "ntfy", to: m[1] };
  let u; try { u = new URL(s); } catch { throw new Error("The alert must be an ntfy topic name, or a Slack, Discord or Microsoft Teams webhook address."); }
  if (u.protocol === "https:" && u.hostname === "hooks.slack.com") return { type: "slack", to: u.href };
  if (u.protocol === "https:" && /^(discord\.com|discordapp\.com)$/.test(u.hostname) && u.pathname.startsWith("/api/webhooks/")) return { type: "discord", to: u.href };
  if (u.protocol === "https:" && /\.(webhook\.office\.com|logic\.azure\.com)$/.test(u.hostname)) return { type: "teams", to: u.href };
  throw new Error("The alert must be an ntfy topic name, or a Slack, Discord or Microsoft Teams webhook address.");
}

export function siteUrl(input) {
  let s = String(input || "").trim();
  if (!s) throw new Error("Enter the address of the site to watch.");
  if (!/^[a-z]+:\/\//i.test(s)) s = "https://" + s;
  let u; try { u = new URL(s); } catch { throw new Error("That doesn't look like a website address."); }
  if (!/^https?:$/.test(u.protocol) || !/^[a-z0-9.-]+\.[a-z0-9-]{2,}$/i.test(u.hostname) || /^[\d.]+$/.test(u.hostname) || /(^|\.)(localhost|local|internal)$/i.test(u.hostname) || u.port) throw new Error("That doesn't look like a public website address.");
  u.hash = "";
  return u.href;
}

/** One check: { t, status, ms, ok, slow, why } */
export async function checkSite(url, fetchImpl = fetch) {
  const t = Date.now(), start = performance.now();
  try {
    const r = await fetchImpl(url, { headers: { "user-agent": UA, accept: "text/html,*/*" }, redirect: "follow", signal: AbortSignal.timeout(TIMEOUT) });
    let body = "";
    if (/text|html|json/i.test(r.headers.get("content-type") || "")) {
      const reader = r.body && r.body.getReader(), dec = new TextDecoder();
      if (reader) { while (body.length < 65_536) { const { done, value } = await reader.read(); if (done) break; body += dec.decode(value, { stream: true }); } try { await reader.cancel(); } catch {} }
    } else { try { await r.body?.cancel(); } catch {} }
    const ms = Math.round(performance.now() - start);
    if (r.status >= 500) return { t, status: r.status, ms, ok: false, why: `Server error (HTTP ${r.status})` };
    if (r.status === 404 || r.status === 410) return { t, status: r.status, ms, ok: false, why: `Page not found (HTTP ${r.status})` };
    const broken = BROKEN.find(([re]) => re.test(body));
    if (broken) return { t, status: r.status, ms, ok: false, why: broken[1] };
    // 401/403/429: the server is up but refused our checker – counted as up, noted on the dashboard
    return { t, status: r.status, ms, ok: true, slow: ms > SLOW_MS, why: r.status >= 400 ? `Answered HTTP ${r.status} (the site may be blocking monitors)` : "" };
  } catch (e) {
    const ms = Math.round(performance.now() - start);
    return { t, status: 0, ms, ok: false, why: e && (e.name === "TimeoutError" || e.name === "AbortError") ? `No answer within ${TIMEOUT / 1000} seconds` : "Couldn't connect (server down, DNS or certificate problem)" };
  }
}

const stateOf = (c) => (!c.ok ? "down" : c.slow ? "slow" : "up");
const dayKey = (t) => new Date(t).toISOString().slice(0, 10);

/** Fold a check into a monitor; returns the alert text when the state changed, else null. */
export function record(m, c) {
  m.last = c;
  m.ms = [...(m.ms || []), c.ok ? c.ms : -1].slice(-KEEP_MS);
  const d = dayKey(c.t), days = m.days || (m.days = {});
  const row = days[d] || (days[d] = [0, 0, 0]);
  row[0]++; if (c.ok) { row[1]++; row[2] += c.ms; }
  for (const k of Object.keys(days).sort().slice(0, -KEEP_DAYS)) delete days[k];
  const prev = m.state || "up", now = stateOf(c);
  const inc = m.inc || (m.inc = []), open = inc.at(-1) && !inc.at(-1).e ? inc.at(-1) : null;
  if (now === "down" && !open) inc.push({ s: c.t, why: c.why });
  if (now !== "down" && open) open.e = c.t;
  m.inc = inc.slice(-KEEP_INC);
  m.state = now;
  if (now === prev) return null;
  const host = new URL(m.url).hostname;
  if (now === "down") return `🔴 ${host} is DOWN: ${c.why}.`;
  if (prev === "down") return `🟢 ${host} is back up (${c.ms} ms)${open ? ` after ${mins(c.t - open.s)}` : ""}.`;
  if (now === "slow") return `🟠 ${host} is slow: ${(c.ms / 1000).toFixed(1)} seconds to answer.`;
  return `🟢 ${host} is fast again (${c.ms} ms).`;
}
const mins = (ms) => { const m = Math.max(1, Math.round(ms / 60_000)); return m < 90 ? `${m} min` : `${Math.round(m / 60)} h`; };

export async function sendAlert(alert, text, id, fetchImpl = fetch) {
  if (!alert) return;
  const link = `https://xkey.co.uk/uptime/${id}`;
  try {
    if (alert.type === "ntfy") await fetchImpl(`https://ntfy.sh/${alert.to}`, { method: "POST", body: text, headers: { title: "XKey uptime monitor", click: link, tags: "warning" } });
    else await fetchImpl(alert.to, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(alert.type === "discord" ? { content: `${text} ${link}` } : { text: `${text} ${link}` }) });
  } catch (e) { console.log("uptime alert failed:", e && e.message); }
}

const getAll = async (env) => (await env.STATE.get("up:all", "json")) || { mons: {} };

export async function createUptime(env, form, fetchImpl) {
  const url = siteUrl(form.get("url")), alert = parseAlert(form.get("alert"));
  const all = await getAll(env);
  if (Object.keys(all.mons).length >= MAX_MONITORS) throw new Error("Free uptime monitoring is full right now – please try again in a few days.");
  const id = randomId(), m = { url, alert, created: Date.now() };
  const c = await checkSite(url, fetchImpl);
  record(m, c);
  await env.STATE.put("up:new:" + id, JSON.stringify(m), { expirationTtl: 86_400 });
  if (alert) await sendAlert(alert, `✅ XKey is now watching ${new URL(url).hostname} – it's ${c.ok ? "up" : "DOWN: " + c.why}. You'll get a message here when that changes.`, id, fetchImpl);
  return id;
}

export async function getUptime(env, id) {
  if (!validUptimeId(id)) return null;
  const all = await env.STATE.get("up:all", { type: "json", cacheTtl: 60 });
  return (all && all.mons[id]) || (await env.STATE.get("up:new:" + id, "json"));
}

export async function stopUptime(env, id) {
  if (!validUptimeId(id) || !(await getUptime(env, id))) return false;
  await env.STATE.put("up:del:" + id, "1", { expirationTtl: 86_400 });
  return true;
}

/** Cron: merge new monitors, apply stops, check sites (oldest-checked first), alert on changes, save once. */
export async function runUptime(env, fetchImpl = fetch, perRun = 30) {
  if (!env || !env.STATE) return "no KV";
  const all = await getAll(env);
  const [news, dels] = await Promise.all(["up:new:", "up:del:"].map((prefix) => env.STATE.list({ prefix })));
  for (const { name } of news.keys) { const m = await env.STATE.get(name, "json"); if (m) all.mons[name.slice(7)] = m; }
  for (const { name } of dels.keys) delete all.mons[name.slice(7)];
  const due = Object.entries(all.mons).sort((a, b) => ((a[1].last && a[1].last.t) || 0) - ((b[1].last && b[1].last.t) || 0)).slice(0, perRun);
  let alerts = 0;
  for (let i = 0; i < due.length; i += 8) {
    await Promise.all(due.slice(i, i + 8).map(async ([id, m]) => {
      let c = await checkSite(m.url, fetchImpl);
      if (!c.ok || c.slow) { await new Promise((r) => setTimeout(r, 3000)); c = await checkSite(m.url, fetchImpl); } // confirm before alerting
      const text = record(m, c);
      if (text && m.alert) { alerts++; await sendAlert(m.alert, text, id, fetchImpl); }
    }));
  }
  await env.STATE.put("up:all", JSON.stringify(all));
  await Promise.all([...news.keys, ...dels.keys].map(({ name }) => env.STATE.delete(name)));
  return `checked ${due.length} of ${Object.keys(all.mons).length}, ${alerts} alerts`;
}

// ---------------- dashboard
const pct = (up, n) => (n ? (Math.floor((up / n) * 10000) / 100).toFixed(2) + "%" : "–");
const when = (t) => new Date(t).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

function spark(esc, ms) {
  if (ms.length < 2) return `<p class="small">The response-time graph fills in as checks run (every 15 minutes).</p>`;
  const W = 640, H = 140, max = Math.max(1000, ...ms) * 1.1, x = (i) => (i * W) / (ms.length - 1), y = (v) => H - 16 - (v / max) * (H - 24);
  const pts = ms.map((v, i) => (v < 0 ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`));
  const downs = ms.map((v, i) => (v < 0 ? `<rect x="${(x(i) - 3).toFixed(1)}" y="0" width="6" height="${H - 16}" class="udn"/>` : "")).join("");
  const ok = ms.filter((v) => v >= 0), avg = ok.length ? Math.round(ok.reduce((a, b) => a + b, 0) / ok.length) : 0;
  return `<svg class="mchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Response time over the last ${ms.length} checks, average ${avg} ms">${downs}<polyline class="ml1" fill="none" stroke-width="2" points="${pts.filter(Boolean).join(" ")}"/><text x="0" y="${H - 2}" class="mt">${ms.length} checks ago</text><text x="${W}" y="${H - 2}" text-anchor="end" class="mt">now</text><text x="0" y="12" class="mt">${esc(Math.round(max))} ms</text></svg><p class="small">Average ${avg} ms. Red bars are checks where the site was down.</p>`;
}

export const UPTIME_CSS = `.ubig{font-size:28px;font-weight:700}.uup{color:#1a7f37}.udown{color:#cf222e}.uslow{color:#9a6700}.udn{fill:#cf222e;opacity:.35}`;

export function uptimeDashboard(esc, id, m) {
  const days = m.days || {}, keys = Object.keys(days).sort(), sum = (ks) => ks.reduce((a, k) => [a[0] + days[k][0], a[1] + days[k][1], a[2] + days[k][2]], [0, 0, 0]);
  const d1 = sum(keys.slice(-1)), d7 = sum(keys.slice(-7)), d30 = sum(keys.slice(-30));
  const c = m.last || {}, st = m.state || "up", label = { up: "Up", slow: "Slow", down: "Down" }[st];
  const alert = m.alert ? { ntfy: `push notifications to ntfy topic <code>${esc(m.alert.to)}</code>`, slack: "Slack", discord: "Discord", teams: "Microsoft Teams" }[m.alert.type] : null;
  return `<style>${UPTIME_CSS}</style><div class="wrap hero"><h1>Uptime: ${esc(new URL(m.url).hostname)}</h1><p class="lead">Watching <a href="${esc(m.url)}" rel="nofollow noopener">${esc(m.url)}</a> every 15 minutes. Bookmark this page – it's your private dashboard.</p></div>
<section style="padding-top:0"><div class="wrap prose">
<p class="ubig u${st === "up" ? "up" : st === "down" ? "down" : "slow"}">${label}</p>
<p>${c.t ? `Last checked ${esc(when(c.t))}: ${c.ok ? `answered in ${c.ms} ms (HTTP ${c.status})` : esc(c.why)}${c.ok && c.why ? ` – ${esc(c.why)}` : ""}.` : "Not checked yet."}</p>
<div class="tablewrap"><table class="mtable"><thead><tr><th>Uptime</th><th>Today</th><th>7 days</th><th>30 days</th></tr></thead><tbody><tr><td>Up</td><td>${pct(d1[1], d1[0])}</td><td>${pct(d7[1], d7[0])}</td><td>${pct(d30[1], d30[0])}</td></tr><tr><td>Average response</td><td>${d1[1] ? Math.round(d1[2] / d1[1]) + " ms" : "–"}</td><td>${d7[1] ? Math.round(d7[2] / d7[1]) + " ms" : "–"}</td><td>${d30[1] ? Math.round(d30[2] / d30[1]) + " ms" : "–"}</td></tr></tbody></table></div>
<h2>Response time</h2>${spark(esc, m.ms || [])}
<h2>Incidents</h2>${(m.inc || []).length ? `<ul class="chg">${[...m.inc].reverse().map((i) => `<li><strong>${esc(when(i.s))}</strong> – ${esc(i.why)}${i.e ? ` · back up after ${mins(i.e - i.s)}` : " · <strong>still down</strong>"}</li>`).join("")}</ul>` : "<p>No downtime recorded. 🎉</p>"}
<h2>Alerts</h2><p>${alert ? `Alerts go to ${alert} when the site goes down, slows down (over ${SLOW_MS / 1000} seconds) or recovers.` : "No alerts set up. To get a phone notification, start a new monitor with an ntfy topic name (free app, no account) or a Slack, Discord or Teams webhook."}</p>
<form method="post" action="/api/uptime/${esc(id)}/stop" onsubmit="return confirm('Stop monitoring this site?')"><button class="btn" type="submit" style="background:#cf222e">Stop monitoring</button></form>
<p class="small">Want to watch another site? <a href="/uptime-monitor">Start another free monitor</a>. Problems with speed or SEO? <a href="/seo-checker?url=${encodeURIComponent(m.url)}">Run a full SEO check</a>.</p>
</div></section>`;
}
