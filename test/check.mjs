// Pre-deploy checks for XKey: every page 200, unique titles within Google's width, valid JSON-LD,
// no broken internal links, redirects, tools API, and the XKey engine's own score for every page.
// Run: node xkey/test/check.mjs
import worker, { PAGES, HTML, robotsTest, submitIndexNow } from "../src/index.js";
import { pageDates } from "../src/site.js";
import { pixelWidth, runCheck } from "../engine/checker.js";
import { DATES } from "../src/page-dates.js";
import { pageHash } from "../src/site.js";
const O = "https://xkey.co.uk";
const get = (u, init = {}) => worker.fetch(new Request(u.startsWith("http") ? u : O + u, { redirect: "manual", ...init }), {}, { waitUntil() {} });
let bad = 0; const fail = (m) => { bad++; console.log("FAIL", m); };
const titles = new Set(), links = new Set();
for (const p of PAGES) {
  const r = await get(p.path), html = await r.text();
  if (r.status !== 200) fail(`${p.path} status ${r.status}`);
  const title = html.match(/<title>(.*?)<\/title>/)[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  if (titles.has(title)) fail(`duplicate title ${title}`); titles.add(title);
  const tpx = pixelWidth(title, 20); if (tpx > 580 || tpx < 200) fail(`${p.path} title ${tpx}px`);
  const desc = html.match(/name="description" content="(.*?)"/)[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'");
  const dpx = pixelWidth(desc, 14); if (dpx > 990 || dpx < 500) fail(`${p.path} description ${dpx}px`);
  if ((html.match(/<h1/g) || []).length !== 1) fail(`${p.path} h1 count`);
  const left = html.match(/\$\{[^}]*\}|\{\{\w+\}\}|undefined|\[object/); if (left) fail(`${p.path} leftover ${left[0]}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { fail(`${p.path} JSON-LD`); } }
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) links.add(m[1]);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]); const dup = ids.find((x, i) => ids.indexOf(x) !== i); if (dup) fail(`${p.path} duplicate id ${dup}`);
  const words = html.replace(/<style>[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  console.log(`${r.status} ${p.path.padEnd(34)} ${String(tpx).padStart(3)}px ${String(words).padStart(4)}w  ${title}`);
}
for (const l of links) { const r = await get(l); if (r.status !== 200) fail(`link ${l} -> ${r.status}`); }
const expect = async (u, status, loc) => { const r = await get(u); if (r.status !== status || (loc && r.headers.get("location") !== loc)) fail(`${u} -> ${r.status} ${r.headers.get("location")}`); };
await expect("http://xkey.co.uk/seo-tools", 301, `${O}/seo-tools`);
await expect("https://www.xkey.co.uk/about", 301, `${O}/about`);
await expect("/about/", 301, `${O}/about`);
await expect("/seo-checker", 301, `${O}/`);
await expect("/site-audit", 301, `${O}/website-audit`);
await expect("/seo-compare", 301, `${O}/seo-comparison`);
await expect("/seo-compare?u=example.com", 200);
await expect("/nope", 404);
for (const f of ["/og.png", "/favicon.svg", "/robots.txt", "/llms.txt", "/sitemap.xml", "/assets/tools.js", "/assets/report.js", "/assets/audit.js", "/assets/compare.js", "/site.webmanifest"]) await expect(f, 200);
new Function((await (await get("/assets/tools.js")).text())); // parses
const sm = await (await get("/sitemap.xml")).text(), locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length || locs.length !== PAGES.length) fail("sitemap URLs");
// sitemap lastmod = each page's own last-changed date; FAQ markup matches the questions on the page
for (const p of PAGES) {
  if (!sm.includes(`<loc>${O}${p.path}</loc><lastmod>${pageDates(p).modified}</lastmod>`)) fail(`${p.path} sitemap lastmod`);
  const ld = JSON.parse(HTML[p.path].match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])["@graph"];
  const faq = ld.find((x) => x["@type"] === "FAQPage");
  if ((p.faqs || []).length !== (faq ? faq.mainEntity.length : 0)) fail(`${p.path} FAQPage markup`);
}
// every guide is linked from the main content of at least 2 other pages (Related guides does most of this)
const inbound = {};
for (const p of PAGES) { const h = HTML[p.path]; for (const m of h.slice(h.indexOf("<main>"), h.indexOf("</main>")).matchAll(/href="(\/guides\/[^"#?]*)"/g)) if (m[1] !== p.path) (inbound[m[1]] ||= new Set()).add(p.path); }
for (const p of PAGES) if (p.path.startsWith("/guides/") && (inbound[p.path] || new Set()).size < 2) fail(`${p.path} linked from only ${(inbound[p.path] || new Set()).size} page(s)`);
// IndexNow: first run sends every page, the next run nothing, a changed page only that page
const kv = new Map(), sentLists = [];
const env = { STATE: { get: async (k, t) => kv.has(k) ? (t === "json" ? JSON.parse(kv.get(k)) : kv.get(k)) : null, put: async (k, v) => kv.set(k, v) }, INDEXNOW_FETCH: async (u, init) => { sentLists.push(JSON.parse(init.body).urlList); return new Response("", { status: 202 }); } };
await submitIndexNow(env); if (sentLists.length !== 1 || sentLists[0].length !== PAGES.filter((p) => !p.noindex).length) fail("IndexNow first submission");
if ((await submitIndexNow(env)) !== "already submitted") fail("IndexNow repeat");
kv.set("indexnow", "old"); const pages = JSON.parse(kv.get("indexnow-pages")); pages["/about"] = "x"; kv.set("indexnow-pages", JSON.stringify(pages));
await submitIndexNow(env); if (sentLists.length !== 2 || sentLists[1].join() !== `${O}/about`) fail("IndexNow changed pages " + JSON.stringify(sentLists[1]));
// robots tester
const rt = robotsTest({ robots: "User-agent: *\nDisallow: /admin/\n\nUser-agent: GPTBot\nDisallow: /\n", url: "https://a.co.uk/admin/x", agent: "googlebot" });
if (rt.allowed || rt.all.find((a) => a.name === "GPTBot").allowed || !robotsTest({ robots: "User-agent: GPTBot\nDisallow: /", url: "/", agent: "oai-searchbot" }).allowed) fail("robots tester " + JSON.stringify(rt));
const api = await get("/api/robots-test", { method: "POST", body: JSON.stringify({ robots: "User-agent: *\nDisallow: /", url: "/x", agent: "bingbot" }) });
if ((await api.json()).allowed !== false) fail("robots API");
// XKey checks itself (in-process; other hosts answer 404 so the run is offline)
const fetchImpl = async (inp, init = {}) => { const u = new URL(typeof inp === "string" ? inp : inp.url); if (u.hostname !== "xkey.co.uk") return new Response("", { status: 404 }); const { signal, ...rest } = init; const r = await worker.fetch(new Request(u.href, { ...rest, redirect: "manual" }), {}, { waitUntil() {} }); const h = new Headers(r.headers); h.set("x-checker-internal", "1"); return new Response(r.body, { status: r.status, headers: h }); };
const low = [];
const undated = PAGES.filter((p) => !DATES[p.path] || DATES[p.path][2] !== pageHash(p)).length;
if (undated) console.log(`note: ${undated} page(s) new or changed since src/page-dates.js was written – run node test/dates.mjs and commit it`);
for (const p of PAGES) {
  const r = await runCheck(O + p.path, fetchImpl);
  const issues = r.categories.flatMap((c) => c.checks.filter((k) => k.status === "fail" || k.status === "warn").map((k) => `${k.status} ${c.name} › ${k.name}`));
  low.push([p.path, r.score, r.aiScore, issues]);
}
for (const [p, s, ai, iss] of low) console.log(`${String(s).padStart(3)} ai${String(ai).padStart(3)} ${p}${iss.length ? "\n      " + iss.join("\n      ") : ""}`);
console.log(`\n${PAGES.length} pages, ${links.size} internal links, ${locs.length} sitemap URLs, ${bad} problems`);
process.exit(bad ? 1 : 0);
