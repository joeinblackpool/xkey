// The State of UK Websites study (runs on a GitHub runner, see .github/workflows/uk-study.yml).
// 1. Picks two groups of .uk websites from Common Crawl's domain ranks (harmonic centrality):
//    the most-linked .uk sites ("top"), and a seeded random sample of everyday .uk sites ranked between
//    500,000 and 5,000,000 on the whole web ("everyday" – mostly small businesses, clubs and charities).
// 2. Runs XKey's own SEO check on each home page, plus DNS email records, AI crawler rules and the builder/CMS.
// 3. Writes the aggregates to src/study-data.js (served on /uk-website-study) and one row per site to study/rows.json (a run artifact, not committed).
// Polite: one site at a time per worker, our own user agent, robots.txt obeyed for the home page.
// Run: node study/run.mjs [--top 500] [--sample 1000] [--release cc-main-2026-jul-aug-sep] [--workers 12]
import fs from "node:fs";
import { runCheck, robotsAllows } from "../engine/checker.js";
import { detectTech } from "../src/tech.js";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const TOP = +arg("top", 500), SAMPLE = +arg("sample", 1000), WORKERS = +arg("workers", 12);
const RELEASE = arg("release", "cc-main-2026-jul-aug-sep");
const RANKS = `https://data.commoncrawl.org/projects/hyperlinkgraph/${RELEASE}/domain/${RELEASE}-domain-ranks.txt.gz`;
const UA = "Mozilla/5.0 (compatible; XKeyResearch/1.0; +https://xkey.co.uk/uk-website-study)", TOKEN = "xkeyresearch";
const LO = 500_000, HI = 5_000_000;
const UK_SECOND = new Set(["co", "org", "ac", "gov", "ltd", "plc", "me", "net", "nhs", "sch", "police", "mod", "nic"]);
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "Applebot-Extended", "Bytespider"];

// ---- 1. the sample
let seed = 20261012; const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
async function pick() {
  const res = await fetch(RANKS);
  if (!res.ok) throw new Error("ranks file: HTTP " + res.status);
  const reader = res.body.pipeThrough(new DecompressionStream("gzip")).pipeThrough(new TextDecoderStream()).getReader();
  const top = [], pool = []; let buf = "", seen = 0, pos = 0, done = false;
  while (!done) {
    const { value, done: end } = await reader.read(); if (end) break;
    buf += value; const lines = buf.split("\n"); buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const f = line.split("\t"); pos = +f[0]; const rev = f[4] || "";
      if (pos > HI) { done = true; break; }
      if (!rev.startsWith("uk.")) continue;
      const labels = rev.split(".").reverse(); // bbc.co.uk
      if (labels.length < 2 || (labels.length === 2 && UK_SECOND.has(labels[0]))) continue;
      if (labels.length === 3 && !UK_SECOND.has(labels[1])) continue; // a.b.uk where b isn't a second-level suffix
      const d = labels.join(".");
      if (top.length < TOP) top.push([d, pos]);
      else if (pos >= LO) { seen++; if (pool.length < SAMPLE) pool.push([d, pos]); else { const j = Math.floor(rand() * seen); if (j < SAMPLE) pool[j] = [d, pos]; } }
    }
  }
  reader.cancel().catch(() => {});
  console.log(`picked ${top.length} top and ${pool.length} everyday .uk sites (from ${seen} between #${LO} and #${HI})`);
  return { top, everyday: pool.sort((a, b) => a[1] - b[1]) };
}

// ---- 2. per site
const withUA = (input, init = {}) => fetch(input, { ...init, headers: { ...(init.headers || {}), "user-agent": UA } });
const timed = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]);
async function txt(url, ms = 10_000) {
  try { const r = await timed(withUA(url, { redirect: "follow" }), ms); const t = r.ok ? (await r.text()).slice(0, 500_000) : ""; return { status: r.status, text: t, type: r.headers.get("content-type") || "", url: r.url, headers: r.headers }; }
  catch { return { status: 0, text: "", type: "" }; }
}
async function doh(name, type) {
  try { const r = await timed(fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, { headers: { accept: "application/dns-json" } }), 8000); const j = await r.json(); return (j.Answer || []).filter((a) => a.type === { TXT: 16, MX: 15 }[type]).map((a) => String(a.data).replace(/^"|"$/g, "").replace(/" "/g, "")); }
  catch { return null; }
}
async function site(d) {
  const row = { d };
  const [mx, txtRecs, dmarc, robots] = await Promise.all([doh(d, "MX"), doh(d, "TXT"), doh("_dmarc." + d, "TXT"), txt(`https://${d}/robots.txt`)]);
  const spf = (txtRecs || []).filter((t) => /^v=spf1/i.test(t));
  row.mx = mx ? mx.length > 0 : null;
  row.spf = txtRecs ? (spf.length === 1 ? (/[+]all\b/.test(spf[0]) ? "open" : "ok") : spf.length > 1 ? "multiple" : "none") : null;
  const dm = (dmarc || []).find((t) => /^v=DMARC1/i.test(t));
  row.dmarc = dmarc ? (dm ? ((dm.match(/;\s*p=(\w+)/i) || [, "invalid"])[1].toLowerCase()) : "missing") : null;
  const rob = robots.status === 200 && !/html/i.test(robots.type) ? robots.text : "";
  row.robots = !!rob;
  row.aiBlocked = AI_BOTS.filter((b) => rob && !robotsAllows(rob, b.toLowerCase(), "/"));
  if (rob && !robotsAllows(rob, TOKEN, "/")) { row.skipped = "robots.txt asks bots like ours not to visit"; return row; }
  try {
    const r = await timed(runCheck(`https://${d}/`, withUA), 60_000);
    row.score = r.score; row.ai = r.aiScore;
    row.checks = Object.fromEntries(r.categories.flatMap((c) => c.checks.map((k) => [k.name, k.status])));
  } catch (e) { row.error = String(e && e.message || e).slice(0, 120); }
  const home = await txt(`https://${d}/`, 15_000);
  if (home.status === 200 && /html/i.test(home.type)) {
    const tech = detectTech(home.text, (k) => home.headers.get(k));
    row.cms = (tech.find((t) => t.cat === "cms" || t.cat === "shop") || {}).name || null;
    row.analytics = tech.filter((t) => t.cat === "analytics").map((t) => t.name);
    row.consent = tech.some((t) => t.cat === "consent");
    row.https = home.url.startsWith("https:");
  }
  return row;
}

// ---- 3. aggregate
const pct = (n, of) => (of ? Math.round((1000 * n) / of) / 10 : 0);
function summarise(rows) {
  const checked = rows.filter((r) => r.score != null), all = rows.length;
  const count = (f, set = rows) => set.filter(f).length;
  const checkNames = [...new Set(checked.flatMap((r) => Object.keys(r.checks || {})))];
  const checks = Object.fromEntries(checkNames.map((n) => { const s = checked.filter((r) => r.checks[n]); return [n, { n: s.length, pass: pct(count((r) => r.checks[n] === "pass", s), s.length), warn: pct(count((r) => r.checks[n] === "warn", s), s.length), fail: pct(count((r) => r.checks[n] === "fail", s), s.length) }]; }));
  const tally = (key) => { const m = {}; for (const r of rows) { const v = r[key]; for (const x of [].concat(v == null ? [] : v)) m[x] = (m[x] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  const withRobots = rows.filter((r) => r.robots), dns = rows.filter((r) => r.dmarc != null), cmsKnown = rows.filter((r) => "cms" in r);
  const scores = checked.map((r) => r.score).sort((a, b) => a - b), ai = checked.map((r) => r.ai).sort((a, b) => a - b);
  const med = (a) => (a.length ? a[Math.floor(a.length / 2)] : 0), avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  return {
    sites: all, checked: checked.length, skippedByRobots: count((r) => r.skipped), unreachable: count((r) => r.error),
    score: { average: avg(scores), median: med(scores), over90: pct(count((s) => s >= 90, scores), scores.length), under50: pct(count((s) => s < 50, scores), scores.length) },
    aiScore: { average: avg(ai), median: med(ai) },
    checks,
    email: { sites: dns.length, dmarc: Object.fromEntries(["missing", "none", "quarantine", "reject", "invalid"].map((p) => [p, pct(count((r) => r.dmarc === p, dns), dns.length)])), spfNone: pct(count((r) => r.spf === "none", dns), dns.length), spfMultiple: pct(count((r) => r.spf === "multiple", dns), dns.length), spfOpen: pct(count((r) => r.spf === "open", dns), dns.length), noMx: pct(count((r) => r.mx === false, dns), dns.length) },
    ai: { robots: withRobots.length, blocksAny: pct(count((r) => r.aiBlocked.length > 0, rows), all), byBot: Object.fromEntries(AI_BOTS.map((b) => [b, pct(count((r) => r.aiBlocked.includes(b), rows), all)])) },
    cms: { sites: cmsKnown.length, top: tally("cms").slice(0, 12).map(([k, v]) => [k, pct(v, cmsKnown.length)]), none: pct(count((r) => !r.cms, cmsKnown), cmsKnown.length) },
    analytics: { none: pct(count((r) => r.analytics && !r.analytics.length, cmsKnown), cmsKnown.length), top: tally("analytics").slice(0, 8).map(([k, v]) => [k, pct(v, cmsKnown.length)]) },
    consent: pct(count((r) => r.consent, cmsKnown), cmsKnown.length),
  };
}

const { top, everyday } = await pick();
const all = [...top.map(([d, p]) => ({ d, p, g: "top" })), ...everyday.map(([d, p]) => ({ d, p, g: "everyday" }))];
const rows = new Array(all.length); let next = 0, finished = 0;
await Promise.all(Array.from({ length: WORKERS }, async () => {
  while (next < all.length) {
    const i = next++, s = all[i];
    try { rows[i] = { ...(await timed(site(s.d), 120_000)), g: s.g, rank: s.p }; } catch (e) { rows[i] = { d: s.d, g: s.g, rank: s.p, error: "timeout" }; }
    if (++finished % 50 === 0) console.log(`${finished}/${all.length}`);
  }
}));
const out = { generated: new Date().toISOString().slice(0, 10), release: RELEASE, top: summarise(rows.filter((r) => r.g === "top")), everyday: summarise(rows.filter((r) => r.g === "everyday")) };
fs.writeFileSync(new URL("./rows.json", import.meta.url), JSON.stringify(rows));
fs.writeFileSync(new URL("../src/study-data.js", import.meta.url), `// Generated by study/run.mjs on ${out.generated} – don't edit by hand.\nexport const STUDY = ${JSON.stringify(out, null, 1)};\n`);
console.log(JSON.stringify({ top: { sites: out.top.sites, checked: out.top.checked, score: out.top.score }, everyday: { sites: out.everyday.sites, checked: out.everyday.checked, score: out.everyday.score } }));
