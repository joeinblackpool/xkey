// Pages for the IceWork SEO Checker: the landing page (indexable) and the report (noindex).
import { runCheck, runVitals, normaliseUrl, crawlStart, crawlBatch, fetchRobots } from "./checker.js";
import { auditApp } from "./audit-client.js";

export const AUDIT_JS = `(${auditApp.toString()})();`;
export const REPORT_JS = `(${reportApp.toString()})();`;
export const AUDIT_MAX = 250;
import { compareApp } from "./compare-client.js";
export const COMPARE_JS = `(${compareApp.toString()})();`;

export const CHECKER_CSS = `.ck-form{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 6px}.ck-form input{flex:1 1 260px;min-height:52px;font:inherit;font-size:18px;padding:12px 16px;border:2px solid var(--line);border-radius:14px;background:var(--card);color:var(--fg)}.ck-form input:focus{outline:none;border-color:var(--brand)}.ck-form button{min-height:52px;border:0;cursor:pointer;font:inherit;font-size:17px}
.ck-head{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;margin-top:18px}@media(max-width:640px){.ck-head{grid-template-columns:1fr;justify-items:start}}
.ring{--p:0;--c:var(--brand);width:150px;height:150px;border-radius:50%;background:conic-gradient(var(--c) calc(var(--p)*1%),var(--line) 0);display:grid;place-items:center}.ring>div{width:118px;height:118px;border-radius:50%;background:var(--bg);display:grid;place-items:center;text-align:center;line-height:1.1}.ring b{font-size:40px;letter-spacing:-.02em}.ring small{display:block;color:var(--mute);font-size:13px}
.ck-stats{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}.pill{display:inline-flex;gap:6px;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--line);font-size:14px;font-weight:600}
.s-info{color:var(--mute)}.s-pass{color:#1a7f37}.s-warn{color:#9a6700}.s-fail{color:#cf222e}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .s-pass{color:#3fb950}:root:not([data-theme=light]) .s-warn{color:#d29922}:root:not([data-theme=light]) .s-fail{color:#ff7b72}}
.bars{display:grid;gap:10px;margin:14px 0}.bar{display:grid;grid-template-columns:minmax(150px,240px) 1fr 44px;gap:12px;align-items:center;font-size:15px}.bar a{color:inherit;text-decoration:none;padding:6px 0}.bar i{display:block;height:10px;border-radius:999px;background:var(--line);overflow:hidden}.bar i span{display:block;height:100%;border-radius:999px}@media(max-width:520px){.bar{grid-template-columns:1fr 44px}.bar i{grid-column:1/3;order:3}}
.fixes{counter-reset:f;list-style:none;padding:0;display:grid;gap:10px}.fixes li{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px}.fixes li::before{counter-increment:f;content:counter(f);display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--brand);color:var(--brand-ink);font-weight:700;font-size:14px;margin-right:8px}.fixes p{margin:6px 0 0;color:var(--mute)}
.imp{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:6px;border:1px solid var(--line);color:var(--mute);margin-left:6px;vertical-align:middle}
.chk{list-style:none;padding:0;margin:0}.chk li{display:grid;grid-template-columns:28px 1fr;gap:6px 10px;padding:14px 0;border-bottom:1px solid var(--line)}.chk .ic{font-weight:800;font-size:18px;line-height:1.4}.chk h4{margin:0;font-size:16px}.chk p{margin:4px 0 0;color:var(--mute);font-size:15px;overflow-wrap:anywhere}.chk .fix{color:var(--fg)}
.catsec{margin-top:34px}.catsec h3{display:flex;justify-content:space-between;gap:12px;font-size:22px;margin:0}.catsec .blurb{color:var(--mute);margin:4px 0 6px}
.vit{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}.vit div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px}.vit b{display:block;font-size:24px}.vit small{color:var(--mute)}
.cmp-form{align-items:flex-end}.cmp-l{flex:1 1 220px;display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:600;color:var(--mute)}.cmp-l input{width:100%;flex:none}
#compare .vit b{font-size:18px;overflow-wrap:anywhere}.hero h1{overflow-wrap:anywhere}.cmp{min-width:420px}.cmp th,.cmp td{text-align:center}.cmp th[scope=row]{text-align:left}.cmp-best{font-weight:800;color:#1a7f37}
.au-bar{height:10px;border-radius:999px;background:var(--line);overflow:hidden;margin:10px 0}.au-bar span{display:block;height:100%;width:0;background:var(--brand);transition:width .3s}
.au-issue{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:4px 16px;margin:10px 0}.au-issue summary{padding:12px 0;font-weight:600}.au-issue .fix{margin:0 0 8px}
.au-urls{margin:0 0 12px;padding-left:18px}.au-urls li{margin:4px 0;overflow-wrap:anywhere}.au-urls a{display:inline-block;padding:4px 0}
.sev-critical{color:#cf222e;border-color:currentColor}.sev-high{color:#bc4c00;border-color:currentColor}.sev-medium{color:#9a6700;border-color:currentColor}.sev-low{color:var(--mute)}
.au-table{font-size:14px}.au-table td{overflow-wrap:anywhere}.au-table a{display:inline-block;padding:6px 0}.print-only{display:none}
@media print{header.top,footer,.ck-form,.cta,.noprint,.crumbs{display:none!important}.print-only{display:block;margin-bottom:12px;font-size:14px}body{background:#fff;color:#000}.au-issue,.card{break-inside:avoid}a{color:#000}}`;

const ICON = { pass: "✓", warn: "!", fail: "✗", info: "i" };
const LABEL = { pass: "Passed", warn: "Warnings", fail: "Failed", info: "For information" };
const colour = (s) => (s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const form = (esc, value = "") => `<form class="ck-form" action="/seo-checker" method="get" role="search"><label for="ck-url" class="sr">Website address</label><input id="ck-url" name="url" type="text" inputmode="url" autocomplete="url" placeholder="yourwebsite.co.uk" value="${esc(value)}" required><button class="btn" type="submit">Check my site</button></form>`;

export function checkerLanding(esc, BUSINESS) {
  return `<div class="wrap hero"><span class="eyebrow">Free tool · No sign-up</span><h1>Free SEO checker for UK businesses</h1><p class="lead">See how your website scores in about 20 seconds: Google rankings, AI search readiness, real-world speed, security and local SEO, with a clear list of what to fix first.</p>${form(esc)}<p class="small">Checks one page in detail. For the whole website, run our <a href="/site-audit">free full-site audit</a>. We fetch the page like a search engine would and never store your content.</p></div>
<section style="padding-top:0"><div class="wrap"><h2>What the ${BUSINESS.name} SEO checker tests</h2><div class="grid">
<div class="card"><h3>Indexing &amp; crawling</h3><p>Status codes, noindex, robots.txt rules, XML sitemap, canonical tags, redirect chains and www consistency.</p></div>
<div class="card"><h3>AI search readiness</h3><p>Whether ChatGPT, Claude, Perplexity and Google AI Overviews can crawl, understand and cite your site: AI crawler access, llms.txt, entity markup and question-led content.</p></div>
<div class="card"><h3>Real-world speed</h3><p>Core Web Vitals (LCP, INP, CLS) from Google's Chrome user data where available, plus a Lighthouse lab test and server response time.</p></div>
<div class="card"><h3>Content quality</h3><p>Word count, readability score, topic focus against your title, H1 and heading structure.</p></div>
<div class="card"><h3>Snippets &amp; sharing</h3><p>Title and description measured in pixels like Google, Open Graph and social cards.</p></div>
<div class="card"><h3>Structured data</h3><p>JSON-LD validity, business and page types, required properties and breadcrumbs.</p></div>
<div class="card"><h3>Links</h3><p>Internal linking, anchor text quality and a live broken-link check on a sample of your links.</p></div>
<div class="card"><h3>Security, mobile &amp; local</h3><p>HTTPS, security headers, mobile viewport, accessibility basics, tap-to-contact and LocalBusiness signals.</p></div>
</div></div></section>
<section><div class="wrap prose"><h2>Why check AI search readiness?</h2><p>More and more people ask AI assistants for recommendations instead of scrolling search results. Those tools can only recommend businesses they can read and understand. A site that blocks AI crawlers, hides its business details or never answers questions directly is invisible to them, even if it ranks on Google.</p>
<h2>How the score works</h2><p>Each check is weighted by how much it affects rankings, from <strong>critical</strong> (such as being indexable at all) down to <strong>low</strong>. Passes earn full marks, warnings half. Your fix list is sorted so the changes with the biggest effect come first.</p>
<h2>More free SEO tools</h2><p>We also run <a href="https://xkey.co.uk/">XKey</a>, a free SEO toolkit with no sign-up: meta tag, sitemap, robots.txt and schema generators, a keyword difficulty checker, a plagiarism checker and more.</p>
<h2>Want it fixed for you?</h2><p>Every website ${BUSINESS.name} builds is designed to pass these checks. See our <a href="/pricing">£${BUSINESS.price} website package</a> or our <a href="/seo">SEO service in ${BUSINESS.town}</a>.</p></div></section>`;
}

export function checkerReport(esc, BUSINESS, r) {
  const fixes = r.fixes.slice(0, 8);
  return `<div class="wrap hero" style="padding-bottom:20px"><span class="eyebrow">SEO report</span><h1>SEO report for ${esc(new URL(r.url).hostname)}</h1>
<p class="small" style="overflow-wrap:anywhere">${esc(r.url)} · checked ${esc(new Date().toUTCString().replace(/:\d\d GMT/, " GMT"))}</p>
<div class="ck-head"><div class="ring" style="--p:${r.score};--c:${colour(r.score)}" role="img" aria-label="Overall score ${r.score} out of 100"><div><span><b>${r.score}</b><small>out of 100</small></span></div></div>
<div><div class="ck-stats">${["pass", "warn", "fail"].map((s) => `<span class="pill s-${s}">${ICON[s]} ${r.counts[s]} ${LABEL[s]}</span>`).join("")}<span class="pill">AI readiness ${r.aiScore}%</span></div>
<div class="bars">${r.categories.filter((c) => !c.info).map((c) => `<div class="bar"><a href="#${slug(c.name)}">${esc(c.name)}</a><i><span style="width:${c.score}%;background:${colour(c.score)}"></span></i><b>${c.score}%</b></div>`).join("")}</div></div></div>
${form(esc, r.url)}</div>
<section style="padding-top:0"><div class="wrap prose"><h2>Fix these first</h2>${fixes.length ? `<ol class="fixes">${fixes.map((k) => `<li><strong>${esc(k.name)}</strong><span class="imp">${k.impact}</span><p>${esc(k.fix || k.notes[0] || "")}</p></li>`).join("")}</ol>` : "<p>Nothing important to fix – excellent work.</p>"}
<div class="card noprint" style="margin:24px 0"><p class="ct">Check the whole website</p><p>This report covers one page. The full-site audit crawls up to ${AUDIT_MAX} pages to find broken links, duplicate titles, orphan pages and more.</p><a class="btn" href="/site-audit?url=${encodeURIComponent(r.url)}">Run a full-site audit</a></div>
<div class="grid noprint" style="margin:0 0 24px"><div class="card"><p class="ct">Monitor this site weekly</p><p>We'll re-check it every week and track the score, with a history graph and a list of anything that breaks.</p><form method="post" action="/api/monitor"><input type="hidden" name="url" value="${esc(r.url)}"><button class="btn" type="submit">Start free monitoring</button></form></div><div class="card"><p class="ct">Compare with competitors</p><p>See how this page scores against up to two competitors, side by side, and where they beat you.</p><a class="btn ghost" href="/seo-compare?u=${encodeURIComponent(r.url)}">Compare sites</a></div></div>
<div id="vitals" class="catsec" data-url="${esc(r.url)}"><h3>Real-world speed <span class="small">Google PageSpeed</span></h3><p class="blurb">Loading Core Web Vitals from Google… this can take up to 30 seconds.</p></div>
${r.categories.map((c) => `<div class="catsec" id="${slug(c.name)}"><h3>${esc(c.name)} ${c.info ? '<span class="small">not scored</span>' : `<span style="color:${colour(c.score)}">${c.score}%</span>`}</h3><p class="blurb">${esc(c.blurb)}</p><ul class="chk">${c.checks.map((k) => `<li><span class="ic s-${k.status}" aria-label="${LABEL[k.status]}">${ICON[k.status]}</span><div><h4>${esc(k.name)}<span class="imp">${k.impact}</span></h4>${k.notes.map((n) => `<p>${esc(n)}</p>`).join("")}${k.fix ? `<p class="fix"><strong>Fix:</strong> ${esc(k.fix)}</p>` : ""}</div></li>`).join("")}</ul></div>`).join("")}
<p class="small noprint" style="margin-top:28px">This report checks one page. Scores are a guide, not a guarantee of rankings. <a href="/seo-checker">Check another page</a> · <a href="#" id="ck-print">Print or save as PDF</a></p></div></section>
<script src="/assets/report.js" defer></script>`;
}

export function auditLanding(esc, BUSINESS) {
  const f = `<form class="ck-form" action="/site-audit" method="get" role="search"><label for="au-url" class="sr">Website address</label><input id="au-url" name="url" type="text" inputmode="url" autocomplete="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Audit my whole site</button></form>`;
  return `<div class="wrap hero"><span class="eyebrow">Free tool · No sign-up</span><h1>Free full-site SEO audit</h1><p class="lead">We crawl up to ${AUDIT_MAX} pages of your website, just like Google does, and show every broken link, duplicate title, orphan page and indexing problem, ranked by impact. Download the results as a PDF report or CSV.</p>${f}<p class="small">Takes 1–3 minutes. We follow your robots.txt and only read publicly available pages. For a deep check of a single page, including AI search readiness and real-world speed, use the <a href="/seo-checker">SEO checker</a>.</p></div>
<section style="padding-top:0"><div class="wrap"><h2>What the site audit finds</h2><div class="grid">
<div class="card"><p class="ct">Broken pages &amp; redirects</p><p>Every 404 and server error with the pages that link to it, internal links that hit redirects, and redirect chains.</p></div>
<div class="card"><p class="ct">Duplicate &amp; missing tags</p><p>Duplicate or missing titles and descriptions, titles too long for Google, missing or multiple H1s.</p></div>
<div class="card"><p class="ct">Indexing problems</p><p>Noindex pages, canonicals pointing elsewhere, noindex pages in the sitemap and indexable pages missing from it.</p></div>
<div class="card"><p class="ct">Site structure</p><p>Orphan pages nobody links to, pages buried 4+ clicks deep, thin content and slow responses.</p></div>
</div></div></section>
<section><div class="wrap prose"><h2>Why audit the whole site?</h2><p>A single page can look perfect while problems elsewhere hold the whole site back: a broken link on every page, dozens of identical titles from a template, or important pages that nothing links to. A crawl finds these in minutes, where checking by hand could take days.</p><p>Every site ${BUSINESS.name} builds is crawled with this audit before launch. See our <a href="/pricing">£${BUSINESS.price} website package</a> or <a href="/seo">SEO services in ${BUSINESS.town}</a>.</p></div></section>`;
}

// ---------- browser script for the single-page report (served as /assets/report.js, so report
// pages can run under a strict Content-Security-Policy with no inline script)
function reportApp() {
  "use strict";
  var pr = document.getElementById("ck-print");
  if (pr) pr.onclick = function (ev) { ev.preventDefault(); window.print(); };
  var fo = (location.search.match(/[?&]focus=([a-z-]{2,40})(&|$)/) || [])[1], fe = fo && document.getElementById(fo);
  if (fe && !location.hash) fe.scrollIntoView();
  // remember this report on the visitor's own device (no account, nothing sent to us)
  try {
    var ring = document.querySelector(".ck-head .ring"), sc = ring && (ring.getAttribute("aria-label") || "").match(/\d+/), vb = document.getElementById("vitals");
    if (sc && vb) {
      var list = JSON.parse(localStorage.getItem("seo_recent") || "[]").filter(function (x) { return x.u !== vb.getAttribute("data-url"); });
      list.unshift({ u: vb.getAttribute("data-url"), s: +sc[0], t: Date.now() });
      localStorage.setItem("seo_recent", JSON.stringify(list.slice(0, 12)));
    }
  } catch (e) {}
  var box = document.getElementById("vitals"); if (!box) return;
  var e = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var cat = { FAST: ["Good", "s-pass"], AVERAGE: ["Needs work", "s-warn"], SLOW: ["Poor", "s-fail"] };
  var col = function (p) { return p >= 90 ? "#1a7f37" : p >= 50 ? "#9a6700" : "#cf222e"; };
  var num = function (x) { return typeof x === "number" && isFinite(x); };
  function tile(n, v, c) { var k = cat[c]; return "<div><small>" + e(n) + '</small><b class="' + (k ? k[1] : "") + '">' + e(v || "–") + "</b>" + (k ? "<small>" + k[0] + "</small>" : "") + "</div>"; }
  fetch("/api/vitals?url=" + encodeURIComponent(box.getAttribute("data-url"))).then(function (r) { return r.json().catch(function () { return { error: "HTTP " + r.status }; }); }).then(function (j) {
    if (j.error) { var er = new Error(j.error); er.quota = j.quota; throw er; }
    var f = j.field || {}, perf = num(j.performance) ? Math.round(j.performance) : null, lab = j.lab || {};
    var h = "<h3>Real-world speed " + (perf != null ? '<span style="color:' + col(perf) + '">' + perf + "%</span>" : "") + '</h3><p class="blurb">Mobile Lighthouse score from Google PageSpeed Insights' + (f.source ? ", with real Chrome user data for " + e(f.source) + " (75th percentile, last 28 days)." : ". Not enough real-user traffic for Chrome field data yet, so only the lab test is shown.") + "</p>";
    if (f.source) {
      if (f.cwv === true || f.cwv === false) h += '<p><span class="pill ' + (f.cwv ? "s-pass" : "s-fail") + '">Core Web Vitals assessment: ' + (f.cwv ? "Passed" : "Failed") + '</span> <span class="small">Good means LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1.</span></p>';
      var m = function (x) { return x && num(x.p75) ? x : null; }, lcp = m(f.lcp), inp = m(f.inp), cls = m(f.cls), ttfb = m(f.ttfb);
      h += '<div class="vit">' + tile("LCP (loading)", lcp && (lcp.p75 / 1000).toFixed(1) + " s", lcp && lcp.cat) + tile("INP (response)", inp && Math.round(inp.p75) + " ms", inp && inp.cat) + tile("CLS (stability)", cls && (cls.p75 / 100).toFixed(2), cls && cls.cat) + tile("TTFB", ttfb && (ttfb.p75 / 1000).toFixed(2) + " s", ttfb && ttfb.cat) + "</div>";
    }
    h += '<div class="vit">' + tile("LCP (lab)", lab.lcp) + tile("Total blocking time (lab)", lab.tbt) + tile("CLS (lab)", lab.cls) + tile("First paint (lab)", lab.fcp) + "</div>";
    if (j.opportunities && j.opportunities.length) h += '<ul class="chk">' + j.opportunities.map(function (o) { return '<li><span class="ic s-warn">!</span><div><h4>' + e(o.title) + "</h4>" + (o.savings ? "<p>Could save about " + e(o.savings) + "</p>" : "") + "</div></li>"; }).join("") + "</ul>";
    box.innerHTML = h;
  }).catch(function (err) {
    var psi = "https://pagespeed.web.dev/analysis?url=" + encodeURIComponent(box.getAttribute("data-url"));
    box.innerHTML = "<h3>Real-world speed</h3>" + (err.quota
      ? '<p class="blurb">Real-world speed data isn\'t available from this tool today: ' + e(err.message) + ' You can run the same test free on <a href="' + e(psi) + '" target="_blank" rel="noopener">Google PageSpeed Insights</a>.</p>'
      : '<p class="blurb">Google PageSpeed couldn\'t be reached (' + e(err.message) + '). Reload the page to try again, or use <a href="' + e(psi) + '" target="_blank" rel="noopener">Google PageSpeed Insights</a> directly.</p>');
  });
}

export const cmpForm = (esc, vals = []) => `<form class="ck-form cmp-form" action="/seo-compare" method="get"><label class="cmp-l">Your website<input name="u" type="text" inputmode="url" placeholder="yourwebsite.co.uk" value="${esc(vals[0] || "")}" required></label><label class="cmp-l">Competitor 1<input name="u" type="text" inputmode="url" placeholder="competitor.co.uk" value="${esc(vals[1] || "")}" required></label><label class="cmp-l">Competitor 2 (optional)<input name="u" type="text" inputmode="url" placeholder="another-competitor.co.uk" value="${esc(vals[2] || "")}"></label><button class="btn" type="submit">Compare</button></form>`;
export function compareLanding(esc, BUSINESS) {
  return `<div class="wrap hero"><span class="eyebrow">Free tool · No sign-up</span><h1>Compare your SEO with your competitors</h1><p class="lead">Put your website side by side with up to two competitors. See who scores higher on Google readiness, AI search, speed, content and local SEO – and exactly where they beat you.</p>${cmpForm(esc)}<p class="small">Compare like with like: your home page against theirs, or your service page against theirs.</p></div>
<section style="padding-top:0"><div class="wrap prose"><h2>Why compare against competitors?</h2><p>Google ranks pages against each other, not against a perfect score. Knowing exactly where a competitor is ahead – faster pages, better structured data, clearer answers for AI search – tells you which fixes will actually move you above them.</p><p>Every check uses the same engine as our <a href="/seo-checker">free SEO checker</a>. Want us to close the gap for you? See our <a href="/seo">SEO services in ${BUSINESS.town}</a>.</p></div></section>`;
}
export function comparePage(esc, urls) {
  return `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">Competitor comparison</span><h1>SEO comparison</h1><p class="lead" style="overflow-wrap:anywhere">${urls.map((u) => { const x = new URL(u); return `<strong>${esc(x.hostname.replace(/^www\./, "") + (x.pathname !== "/" ? x.pathname.replace(/\/$/, "") : ""))}</strong>`; }).join(" vs ")}</p></div><section style="padding-top:0"><div class="wrap prose"><div id="compare" data-urls="${esc(JSON.stringify(urls))}"></div><noscript><p>The comparison needs JavaScript.</p></noscript>${cmpForm(esc, urls)}</div></section><script src="/assets/compare.js" defer></script>`;
}

// ---------- request handlers
const HOUR = () => Math.floor(Date.now() / 3_600_000);
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
const withCsp = (res) => { try { res.headers.set("content-security-policy", CSP); } catch {} return res; };
const SELF_UA = /IceWorkSEOChecker/i;

/** Client key for rate limits: the IP, or its /64 for IPv6 (one household gets a whole /64, so per-address limits are trivial to dodge). */
export function ipKey(request) {
  const ip = (request.headers.get("cf-connecting-ip") || "anon").toLowerCase();
  if (!ip.includes(":") || ip.includes(".")) return ip;
  const [a, b = ""] = ip.split("::"); const L = a ? a.split(":") : [], R = b ? b.split(":") : [];
  const full = ip.includes("::") ? [...L, ...Array(Math.max(0, 8 - L.length - R.length)).fill("0"), ...R] : L;
  return full.slice(0, 4).map((x) => x.replace(/^0+(?=.)/, "")).join(":") + "::/64";
}
/** Counter in the edge cache (free, no storage writes). Per data centre and not atomic – fine for abuse control. True once `limit` is reached. */
export async function over(name, limit, ttl = 3700) {
  if (typeof caches === "undefined") return false;
  const key = new Request(`https://ratelimit.icework/${encodeURIComponent(name)}`);
  const hit = await caches.default.match(key);
  const n = hit ? +(await hit.text()) || 0 : 0;
  if (n >= limit) return true;
  await caches.default.put(key, new Response(String(n + 1), { headers: { "cache-control": `max-age=${ttl}` } }));
  return false;
}
/** Rough per-client hourly limit. */
export const rateLimited = (request, bucket, limit) => over(`${bucket}/${ipKey(request)}/${HOUR()}`, limit);
/** True if `name` has already been used this hour (one-per-hour actions such as "run monitor now"). */
export const overOnce = (name) => over(`${name}/${HOUR()}`, 1);

// Signed audit tokens: /api/audit/batch only fetches sites that /api/audit/start validated in the last hour,
// so the batch endpoint can't be pointed at arbitrary third-party sites as a free crawler / load generator.
const te = new TextEncoder();
const b64u = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const keys = new Map();
async function hmac(secret, msg) {
  let k = keys.get(secret);
  if (!k) { k = await crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); keys.set(secret, k); }
  return b64u(await crypto.subtle.sign("HMAC", k, te.encode(msg)));
}
// Token signing secret: AUDIT_SECRET if set; otherwise a random secret generated once and kept in KV
// (one write, ever); a fixed fallback only applies in tests with no KV binding.
let generatedSecret = null;
async function secretOf(env) {
  if (env && env.AUDIT_SECRET) return env.AUDIT_SECRET;
  if (generatedSecret) return generatedSecret;
  if (env && env.STATE) {
    let s = await env.STATE.get("audit_secret");
    if (!s) { s = b64u(crypto.getRandomValues(new Uint8Array(32))); await env.STATE.put("audit_secret", s); }
    return (generatedSecret = s);
  }
  return "icework-audit-test-only";
}
export async function signAudit(secret, origin, now = Date.now()) {
  const p = b64u(te.encode(JSON.stringify({ o: origin, e: Math.floor(now / 1000) + 3600, n: Math.random().toString(36).slice(2, 10) })));
  return `${p}.${await hmac(secret, p)}`;
}
export async function verifyAudit(secret, token, now = Date.now()) {
  const [p, sig] = String(token || "").split(".");
  if (!p || !sig || p.length > 400) return null;
  const good = await hmac(secret, p);
  if (good.length !== sig.length) return null;
  let diff = 0; for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff) return null;
  try { const j = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/"))); return j && typeof j.o === "string" && j.e * 1000 > now ? { ...j, sig } : null; } catch { return null; }
}
/** robots.txt for the batch endpoint, cached at the edge for 10 minutes so each batch doesn't refetch it. */
async function cachedRobots(origin, fetchImpl, ctx) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://cache.icework/robots?o=${encodeURIComponent(origin)}`);
  const hit = cache && (await cache.match(key));
  if (hit) return hit.headers.get("x-ok") === "1" ? await hit.text() : null;
  const r = await fetchRobots(origin, fetchImpl);
  if (cache) ctx.waitUntil(cache.put(key, new Response(r.text || "", { headers: { "cache-control": "max-age=600", "x-ok": r.text != null ? "1" : "0" } })));
  return r.text;
}

/** Handles /seo-checker (landing or report), /site-audit, /api/vitals and /api/audit/*. Returns a Response or null. */
export async function handleChecker(request, env, ctx, { layout, esc, BUSINESS, page, send, fetchImpl = fetch }) {
  const url = new URL(request.url);
  // Our own checker fetching our own tool pages (e.g. /seo-checker?url=…/seo-checker?url=…) would recurse.
  if (SELF_UA.test(request.headers.get("user-agent") || "")) return Response.json({ error: "The checker doesn't check its own tool pages." }, { status: 403 });
  if (url.pathname === "/api/vitals") {
    let target; try { target = normaliseUrl(url.searchParams.get("url")); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
    const cache = typeof caches !== "undefined" ? caches.default : null;
    const key = new Request(`https://cache.icework/vitals?u=${encodeURIComponent(target.href)}`);
    const hit = cache && (await cache.match(key)); if (hit) return hit;
    if (await rateLimited(request, "vitals", 60)) return Response.json({ error: "Too many speed tests from your connection this hour" }, { status: 429 });
    try {
      // PageSpeed always goes over the network: Google fetches the live page itself.
      const res = Response.json(await runVitals(target.href, env && env.PSI_KEY), { headers: { "cache-control": "public, max-age=21600" } });
      if (cache) ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    } catch (e) { return Response.json({ error: e.message || "PageSpeed unavailable", quota: !!e.quota }, { status: e.quota ? 503 : 502, headers: { "cache-control": "no-store" } }); } // failures are never cached
  }
  if (url.pathname === "/api/audit/start") {
    if (await rateLimited(request, "audit", 40)) return Response.json({ error: "You've started a lot of audits this hour. Please try again later." }, { status: 429 });
    try {
      const s = await crawlStart(url.searchParams.get("url"), fetchImpl);
      return Response.json({ ...s, token: await signAudit(await secretOf(env), s.origin) }, { headers: { "cache-control": "no-store" } });
    } catch (e) { return Response.json({ error: e.name === "AbortError" ? "The site took too long to respond." : e.message }, { status: 400 }); }
  }
  if (url.pathname === "/api/audit/batch") {
    const urls = url.searchParams.getAll("u").slice(0, 6);
    if (!urls.length) return Response.json({ error: "Nothing to check" }, { status: 400 });
    const tok = await verifyAudit(await secretOf(env), url.searchParams.get("t"));
    if (!tok) return Response.json({ error: "This audit session has expired – reload the page to start again.", expired: true }, { status: 403 });
    let origin; try { origin = normaliseUrl(tok.o); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
    if (await rateLimited(request, "batch", 2000)) return Response.json({ error: "Hourly crawl limit reached" }, { status: 429 });
    // one audit = at most ~250 pages in batches of 6; a little headroom for retries
    if (await over(`tok/${tok.sig}`, 70)) return Response.json({ error: "This audit has reached its page limit." }, { status: 429 });
    if (await over(`host/${origin.hostname}/${HOUR()}`, 400)) return Response.json({ error: "This website is being audited a lot right now – please try again later." }, { status: 429 });
    const robots = await cachedRobots(origin.origin, fetchImpl, ctx);
    return Response.json(await crawlBatch(origin.hostname, urls, fetchImpl, robots), { headers: { "cache-control": "no-store" } });
  }
  if (url.pathname === "/api/check") {
    let target; try { target = normaliseUrl(url.searchParams.get("url")); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
    const cache = typeof caches !== "undefined" ? caches.default : null;
    const key = new Request(`https://cache.icework/checkjson?u=${encodeURIComponent(target.href)}`);
    const hit = cache && (await cache.match(key)); if (hit) return hit;
    if (await rateLimited(request, "check", 120)) return Response.json({ error: "Too many checks this hour" }, { status: 429 });
    if (await over(`check-host/${target.hostname}/${HOUR()}`, 60)) return Response.json({ error: "That site has been checked a lot this hour" }, { status: 429 });
    try {
      const r = await runCheck(target.href, fetchImpl);
      const checks = {}; for (const c of r.categories) for (const k of c.checks) if (k.status !== "info") checks[`${c.name} › ${k.name}`] = k.status;
      const res = Response.json({ url: r.url, score: r.score, aiScore: r.aiScore, counts: r.counts, categories: r.categories.map((c) => ({ name: c.name, score: c.score, info: !!c.info })), facts: r.facts, checks }, { headers: { "cache-control": "public, max-age=3600" } });
      if (cache) ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    } catch (e) { return Response.json({ error: e.name === "AbortError" ? "Took too long to respond" : (e.message || "Couldn't be reached").slice(0, 160) }, { status: 502 }); }
  }
  if (url.pathname === "/seo-compare") {
    const us = []; for (const v of url.searchParams.getAll("u").slice(0, 3)) { if (!v.trim()) continue; try { us.push(normaliseUrl(v).href); } catch (e) { return null; } }
    if (us.length < 2) return null;
    return withCsp(send(layout({ ...page("compare"), noindex: true, title: `SEO comparison: ${us.map((u) => new URL(u).hostname).join(" vs ")}`, body: comparePage(esc, [...new Set(us)]) }), "text/html; charset=utf-8", 200, "no-store"));
  }
  if (url.pathname === "/site-audit") {
    const q = url.searchParams.get("url");
    let target; try { target = normaliseUrl(q); } catch (e) { return null; }
    const host = target.hostname;
    return withCsp(send(layout({ ...page("audit"), noindex: true, title: `Full-site SEO audit: ${host}`, body: `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">Site audit</span><h1>Full-site audit for ${esc(host)}</h1><p class="small" style="overflow-wrap:anywhere">${esc(target.href)} · up to ${AUDIT_MAX} pages</p></div><section style="padding-top:0"><div class="wrap"><div id="audit" data-url="${esc(target.href)}" data-max="${AUDIT_MAX}" data-brand="${esc(BUSINESS.fullName)} · ${esc(BUSINESS.domain)}"></div><noscript><p>The site audit needs JavaScript. You can still use the <a href="/seo-checker?url=${encodeURIComponent(target.href)}">single-page SEO checker</a>.</p></noscript></div></section><script src="/assets/audit.js" defer></script>` }), "text/html; charset=utf-8", 200, "no-store"));
  }
  if (url.pathname !== "/seo-checker") return null;
  const q = url.searchParams.get("url");
  if (!q) return send(layout(page("landing")), "text/html; charset=utf-8");
  const errPage = (msg, status) => withCsp(send(layout({ ...page("landing"), noindex: true, body: `<div class="wrap hero"><span class="eyebrow">SEO checker</span><h1>We couldn't check that page</h1><p class="lead">${esc(msg)}</p>${form(esc, q.slice(0, 300))}</div>` }), "text/html; charset=utf-8", status, "no-store"));
  let target; try { target = normaliseUrl(q); } catch (e) { return errPage(e.message, 400); }
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://cache.icework/report?u=${encodeURIComponent(target.href)}`);
  const hit = cache && (await cache.match(key)); if (hit) return hit;
  if (await rateLimited(request, "check", 120)) return errPage("You've run a lot of checks this hour. Please try again a little later.", 429);
  // stop the checker being used to hammer one site from many addresses (each check makes ~20 requests to it)
  if (await over(`check-host/${target.hostname}/${HOUR()}`, 60)) return errPage("That website has been checked a lot in the last hour. Please try again later.", 429);
  let report; try { report = await runCheck(target.href, fetchImpl); } catch (e) { return errPage(e.name === "AbortError" ? "The site took too long to respond (over 10 seconds)." : e.message || "The site could not be reached.", 502); }
  const res = withCsp(send(layout({ ...page("report"), noindex: true, title: `SEO report: ${new URL(report.url).hostname} scores ${report.score}/100`, body: checkerReport(esc, BUSINESS, report) }), "text/html; charset=utf-8", 200, "public, max-age=3600"));
  if (cache) ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}
