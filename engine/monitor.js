// Weekly SEO monitoring: stores a compact snapshot of each check in KV (binding STATE) and
// renders a private dashboard per monitored site at /monitor/<id>. The cron runs one due check
// per invocation (a check uses up to ~40 subrequests; the free plan allows 50).
import { runCheck, normaliseUrl } from "./checker.js";

export const OWN_SITES = ["https://icework.co.uk/", "https://teslachargers.co.uk/", "https://pubg.uk/", "https://polarisapartments.co.uk/", "https://bizenergy.co.uk/", "https://rockfactory.uk/"];
const WEEK = 7 * 86_400_000, DAY = 86_400_000, MAX_MONITORS = 200, MAX_HISTORY = 60;
const ownId = (u) => "own-" + new URL(u).hostname.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
const randomId = () => { const b = crypto.getRandomValues(new Uint8Array(12)); return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
export const validId = (id) => /^(own-[a-z0-9-]{3,80}|[A-Za-z0-9_-]{16})$/.test(id || "");

/** Compact snapshot of a full report: scores plus the status of every scored check. */
export function snapshot(r, t = Date.now()) {
  const checks = {};
  for (const c of r.categories) for (const k of c.checks) if (k.status !== "info") checks[`${c.name} › ${k.name}`] = k.status;
  return { t, score: r.score, ai: r.aiScore, cats: Object.fromEntries(r.categories.filter((c) => !c.info).map((c) => [c.name, c.score])), checks, ms: r.facts.ms, words: r.facts.words, title: (r.facts.title || "").slice(0, 120) };
}

/** What changed between two snapshots. */
export function diff(prev, cur) {
  if (!prev || !cur || prev.error || cur.error) return { worse: [], better: [] };
  const rank = { pass: 0, warn: 1, fail: 2 };
  const worse = [], better = [];
  for (const [k, s] of Object.entries(cur.checks || {})) { const p = (prev.checks || {})[k]; if (p == null) continue; if (rank[s] > rank[p]) worse.push([k, p, s]); else if (rank[s] < rank[p]) better.push([k, p, s]); }
  return { worse, better };
}

async function getIndex(env) { return (await env.STATE.get("mon:index", "json")) || []; }
async function putIndex(env, idx) { await env.STATE.put("mon:index", JSON.stringify(idx)); }
export async function getMonitor(env, id) { return validId(id) ? await env.STATE.get("mon:" + id, "json") : null; }

/** Create (or return the existing) monitor for a URL. */
export async function createMonitor(env, input) {
  const u = normaliseUrl(input);
  const idx = await getIndex(env);
  const existing = idx.find((m) => m.url === u.href);
  if (existing) return existing.id;
  if (idx.length >= MAX_MONITORS) throw new Error("Monitoring is full right now. Please try again in a few days.");
  const id = OWN_SITES.includes(u.href) ? ownId(u.href) : randomId();
  const now = Date.now();
  await env.STATE.put("mon:" + id, JSON.stringify({ id, url: u.href, host: u.hostname, created: now, history: [] }));
  idx.push({ id, url: u.href, next: now }); await putIndex(env, idx);
  return id;
}

/** Run one check now for a monitor and store the snapshot. */
export async function runMonitor(env, id, fetchImpl) {
  const m = await getMonitor(env, id); if (!m) return null;
  let snap;
  try { snap = snapshot(await runCheck(m.url, fetchImpl)); } catch (e) { snap = { t: Date.now(), error: (e && e.message || "Check failed").slice(0, 200) }; }
  m.history = [...(m.history || []), snap].slice(-MAX_HISTORY); m.lastRun = snap.t;
  await env.STATE.put("mon:" + id, JSON.stringify(m));
  const idx = await getIndex(env); const row = idx.find((x) => x.id === id);
  if (row) { row.next = snap.t + (snap.error ? DAY : WEEK); await putIndex(env, idx); }
  return m;
}

/** Cron: make sure your own sites are monitored, then run the single most overdue check. */
export async function runDueMonitors(env, fetchImpl, own = OWN_SITES) {
  if (!env || !env.STATE) return "no KV";
  let idx = await getIndex(env);
  const missing = own.filter((u) => !idx.some((m) => m.url === u));
  if (missing.length) { for (const u of missing) await createMonitor(env, u); idx = await getIndex(env); }
  const due = idx.filter((m) => m.next <= Date.now()).sort((a, b) => a.next - b.next)[0];
  if (!due) return "nothing due";
  const m = await runMonitor(env, due.id, fetchImpl);
  return m ? `checked ${m.url}: ${m.history.at(-1).error ? "error" : m.history.at(-1).score}` : "missing";
}

// ---------------- dashboard
const colour = (s) => (s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e");
const fmt = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function chart(esc, hist) {
  const pts = hist.filter((h) => !h.error);
  if (pts.length < 2) return `<p class="small">The history graph appears after the second weekly check.</p>`;
  const W = 640, H = 220, L = 34, R = 10, T = 12, B = 28;
  const x = (i) => L + (i * (W - L - R)) / (pts.length - 1), y = (v) => T + ((100 - v) * (H - T - B)) / 100;
  const line = (key, cls) => `<polyline class="${cls}" fill="none" stroke-width="3" points="${pts.map((p, i) => `${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ")}"/>` + pts.map((p, i) => `<circle class="${cls}" cx="${x(i).toFixed(1)}" cy="${y(p[key]).toFixed(1)}" r="3.5"><title>${esc(fmt(p.t))}: ${p[key]}</title></circle>`).join("");
  const grid = [0, 50, 70, 90, 100].map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="mg"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="mt">${v}</text>`).join("");
  const labels = [0, pts.length - 1].map((i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="${i ? "end" : "start"}" class="mt">${esc(fmt(pts[i].t))}</text>`).join("");
  return `<svg class="mchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Score history: overall from ${pts[0].score} to ${pts.at(-1).score}">${grid}${labels}${line("ai", "ml2")}${line("score", "ml1")}</svg><p class="small"><span class="key k1"></span> Overall score <span class="key k2"></span> AI readiness</p>`;
}

export const MONITOR_CSS = `.mchart{width:100%;height:auto;margin:8px 0}.mchart .mg{stroke:var(--line)}.mchart .mt{fill:var(--mute);font-size:12px}.ml1{stroke:var(--brand);fill:var(--brand)}.ml2{stroke:#2f6fb3;fill:#2f6fb3}.mchart polyline{fill:none}.key{display:inline-block;width:14px;height:4px;border-radius:2px;vertical-align:middle;margin:0 4px 0 10px}.k1{background:var(--brand)}.k2{background:#2f6fb3}
.mtable td,.mtable th{white-space:nowrap}.chg{list-style:none;padding:0;margin:8px 0}.chg li{padding:8px 0;border-bottom:1px solid var(--line)}`;

export function dashboard(esc, m) {
  const hist = m.history || [], last = hist.filter((h) => !h.error).at(-1), prevOk = hist.filter((h) => !h.error).at(-2);
  const lastAny = hist.at(-1);
  const { worse, better } = diff(prevOk, last);
  const next = lastAny ? lastAny.t + (lastAny.error ? DAY : WEEK) : Date.now();
  const head = `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">SEO monitoring</span><h1>Weekly SEO monitor: ${esc(m.host)}</h1><p class="small" style="overflow-wrap:anywhere">${esc(m.url)} · monitoring since ${esc(fmt(m.created))} · next check around ${esc(fmt(next))}</p><p class="small">Bookmark this page – it's your private dashboard. Anyone with the link can view it.</p></div>`;
  if (!last) return head + `<section style="padding-top:0"><div class="wrap prose"><div class="card"><p class="ct">${lastAny ? "The last check couldn't reach the site" : "First check queued"}</p><p>${lastAny ? esc(lastAny.error) + " – we'll try again within a day." : "The first check runs within the next few hours. You can also run it now."}</p><form method="post" action="/api/monitor/${esc(m.id)}/run"><button class="btn" type="submit">Run a check now</button></form></div></div></section>`;
  const cats = Object.entries(last.cats).map(([n, s]) => { const p = prevOk && prevOk.cats[n]; const d = p != null ? s - p : 0; return `<div class="bar"><span>${esc(n)}</span><i><span style="width:${s}%;background:${colour(s)}"></span></i><b>${s}%${d ? ` <small class="${d > 0 ? "s-pass" : "s-fail"}">${d > 0 ? "▲" : "▼"}${Math.abs(d)}</small>` : ""}</b></div>`; }).join("");
  const change = (list, cls, word) => list.map(([k, a, b]) => `<li><span class="${cls}">${word}</span> ${esc(k)} <span class="small">(${a} → ${b})</span></li>`).join("");
  return head + `<section style="padding-top:0"><div class="wrap prose">
<div class="ck-head"><div class="ring" style="--p:${last.score};--c:${colour(last.score)}" role="img" aria-label="Latest score ${last.score}"><div><span><b>${last.score}</b><small>latest score</small></span></div></div>
<div><div class="ck-stats"><span class="pill">AI readiness ${last.ai}%</span><span class="pill">Checked ${esc(fmt(last.t))}</span>${prevOk ? (last.score === prevOk.score ? `<span class="pill">No change since ${esc(fmt(prevOk.t))}</span>` : `<span class="pill ${last.score > prevOk.score ? "s-pass" : "s-fail"}">${last.score > prevOk.score ? "▲" : "▼"} ${Math.abs(last.score - prevOk.score)} since ${esc(fmt(prevOk.t))}</span>`) : ""}</div><div class="bars">${cats}</div></div></div>
<h2>Score history</h2>${chart(esc, hist)}
<h2>What changed since the previous check</h2>${prevOk ? (worse.length || better.length ? `<ul class="chg">${change(worse, "s-fail", "New problem:")}${change(better, "s-pass", "Fixed:")}</ul>` : "<p>No changes – everything that passed still passes.</p>") : "<p>Changes will show here after the second check.</p>"}
<div class="row noprint" style="margin:20px 0"><a class="btn" href="/seo-checker?url=${encodeURIComponent(m.url)}">See the full report</a><form method="post" action="/api/monitor/${esc(m.id)}/run" style="display:inline"><button class="btn ghost" type="submit">Run a check now</button></form></div>
<h2>Check history</h2><div class="tablewrap"><table class="mtable"><thead><tr><th>Date</th><th>Score</th><th>AI</th><th>Response</th><th>Words</th></tr></thead><tbody>${hist.slice().reverse().map((h) => h.error ? `<tr><td>${esc(fmt(h.t))}</td><td colspan="4" class="s-fail">${esc(h.error)}</td></tr>` : `<tr><td>${esc(fmt(h.t))}</td><td style="color:${colour(h.score)}"><b>${h.score}</b></td><td>${h.ai}%</td><td>${h.ms} ms</td><td>${h.words}</td></tr>`).join("")}</tbody></table></div>
<p class="small">Checks run automatically once a week. Scores are a guide, not a guarantee of rankings.</p></div></section>`;
}

export function ownOverview(esc, rows) {
  return `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">SEO monitoring</span><h1>Your monitored websites</h1><p class="lead">Weekly automatic checks of your own sites.</p></div><section style="padding-top:0"><div class="wrap"><div class="tablewrap"><table class="mtable"><thead><tr><th>Site</th><th>Latest</th><th>Change</th><th>AI</th><th>Last checked</th></tr></thead><tbody>${rows.map(({ m }) => { const ok = (m.history || []).filter((h) => !h.error); const l = ok.at(-1), p = ok.at(-2); return `<tr><td><a href="/monitor/${esc(m.id)}">${esc(m.host)}</a></td><td>${l ? `<b style="color:${colour(l.score)}">${l.score}</b>` : "–"}</td><td>${l && p ? (l.score === p.score ? "no change" : `<span class="${l.score > p.score ? "s-pass" : "s-fail"}">${l.score > p.score ? "▲" : "▼"}${Math.abs(l.score - p.score)}</span>`) : "–"}</td><td>${l ? l.ai + "%" : "–"}</td><td>${m.lastRun ? esc(fmt(m.lastRun)) : "queued"}</td></tr>`; }).join("")}</tbody></table></div></div></section>`;
}
