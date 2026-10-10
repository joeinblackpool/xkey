// Click-through test of every XKey tool, run against the site built the way Cloudflare builds it.
//   node test/tools.mjs            (needs playwright + esbuild; see test/lib.mjs)
//   node test/tools.mjs audit      (only scenarios whose name matches)
// For each tool it fills the form like a visitor, presses the button, waits for the result and
// fails on: a browser error (e.g. a script crashing on load), a missing/empty result, or a result
// without the expected text. Checks run on xkey.co.uk itself, which the Worker handles
// in-process, so no internet is needed.
import { need, serve } from "./lib.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const here = path.dirname(fileURLToPath(import.meta.url));
const only = process.argv[2] ? new RegExp(process.argv[2], "i") : null;

// 1) Build like Wrangler does (esbuild, ESM, keep-names on – Wrangler's default).
const esbuild = await need("esbuild");
const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "xkey-build-")), "worker.mjs");
await (esbuild.build || esbuild.default.build)({
  entryPoints: [path.join(here, "../src/index.js")], bundle: true, format: "esm", platform: "neutral",
  target: "es2022", keepNames: true, outfile, logLevel: "error", mainFields: ["module", "main"],
});
const site = await serve(8790, outfile);
const { chromium } = await need("playwright");

// 2) Scenarios. fill: [id, value]; click: id; expect: [selector, /regex/] checked after waiting.
const S = [
  { name: "SEO check → report", path: "/", fill: [["ck-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/seo-checker/, expect: ["main", /SEO score|score/i], wait: "main .score, main [class*=score]" },
  { name: "AI SEO checker", path: "/ai-seo-checker", fill: [["ck-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/seo-checker/, expect: ["main", /AI/i] },
  { name: "Website audit", path: "/website-audit", fill: [["au-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/site-audit/, expect: ["main", /pages? (crawled|checked)|broken|issues/i], timeout: 90000, wait: "#au-done, .au-done, [data-done], #au-report" },
  { name: "Competitor comparison", path: "/seo-comparison", fill: [["main form input[name=u] >> nth=0", "xkey.co.uk"], ["main form input[name=u] >> nth=1", "xkey.co.uk/guides"]], click: "button[type=submit]", nav: /\/seo-compare/, expect: ["main", /\b\d{1,3}\b/], timeout: 60000 },
  { name: "SEO monitoring", path: "/seo-monitoring", fill: [["mo-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/monitor\//, expect: ["main", /score|history|week/i], timeout: 60000 },
  { name: "Title tag checker", path: "/title-tag-checker", fill: [["tt-title", "Emergency Plumber in Preston | 24/7, No Call-Out Fee"], ["tt-desc", "Emergency plumber in Preston for leaks, boilers and blocked drains. Gas Safe engineers, fixed prices and no call-out fee. Call today."]], expect: ["#tt-serp", /Emergency Plumber in Preston/] },
  { name: "robots.txt tester", path: "/robots-txt-tester", fill: [["rt-robots", "User-agent: *\nDisallow: /admin/\n"], ["rt-url", "https://example.co.uk/admin/page"]], click: "#rt-form button[type=submit]", expect: ["#rt-out", /block|disallow|not allowed/i] },
  { name: "llms.txt generator", path: "/llms-txt-generator", fill: [["lt-name", "Smith Plumbing"], ["lt-site", "https://smithplumbing.co.uk"], ["lt-sum", "Emergency plumbers in Preston."]], expect: ["#lt-out", /# Smith Plumbing/] },
  { name: "Meta tag generator", path: "/meta-tag-generator", fill: [["mt-title", "Emergency Plumber Preston"], ["mt-desc", "Fast local plumbers in Preston."], ["mt-url", "https://smithplumbing.co.uk/"]], expect: ["#mt-out", /<title>Emergency Plumber Preston<\/title>/] },
  { name: "Open Graph generator", path: "/open-graph-generator", fill: [["og-title", "Emergency Plumber Preston"], ["og-desc", "Fast local plumbers."], ["og-url", "https://smithplumbing.co.uk/"]], expect: ["#og-out", /og:title/] },
  { name: "XML sitemap generator", path: "/xml-sitemap-generator", fill: [["sm-site", "xkey.co.uk"]], click: "#sm-find", expect: ["#sm-out", /<urlset[\s\S]*xkey\.co\.uk/], timeout: 30000 },
  { name: "Word counter", path: "/word-counter", fill: [["wc-text", "Emergency plumber in Preston. We fix leaks, boilers and blocked drains every day of the week."]], expect: ["#wc-stats", /1[0-9]\b|words/i] },
  { name: "Long-tail keyword generator", path: "/keyword-generator", fill: [["kw-seed", "emergency plumber"], ["kw-town", "Preston"]], expect: ["#kw-out", /emergency plumber/i] },
  { name: "Blog title generator", path: "/blog-title-generator", fill: [["bt-kw", "boiler repair"]], expect: ["#bt-out", /boiler repair/i] },
  { name: "robots.txt generator", path: "/robots-txt-generator", fill: [["rg-site", "https://smithplumbing.co.uk"]], expect: ["#rg-out", /User-agent/] },
  { name: "Local business schema generator", path: "/schema-generator", fill: [["sg-name", "Smith Plumbing"], ["sg-url", "https://smithplumbing.co.uk"], ["sg-town", "Preston"]], expect: ["#sg-out", /"@type"[\s\S]*Smith Plumbing/] },
  { name: "Anchor text checker", path: "/anchor-text-checker", fill: [["ac-url", "xkey.co.uk"]], click: "#ac-form button[type=submit]", expect: ["#ac-out", /anchor|link/i], timeout: 30000 },
  { name: "Anchor text generator", path: "/anchor-text-checker", fill: [["ag-kw", "emergency plumber"], ["ag-brand", "Smith Plumbing"]], expect: ["#ag-out", /emergency plumber/i] },
  { name: "Plagiarism checker", path: "/plagiarism-checker", fill: [["pg-text", "Type in any web address and get a full SEO report in about 20 seconds – no account, no email, no daily limit."], ["pg-url", "xkey.co.uk"]], click: "#pg-form button[type=submit]", expect: ["#pg-out", /%|match|similar/i], timeout: 30000 },
  { name: "Keyword difficulty checker", path: "/keyword-difficulty-checker", fill: [["kd-kw", "free seo check"], ["kd-urls", "https://xkey.co.uk/\nhttps://xkey.co.uk/guides\nhttps://xkey.co.uk/seo-tools"]], click: "#kd-form button[type=submit]", expect: ["#kd-out", /difficult|easy|hard|score/i], timeout: 60000 },
  { name: "Local search checker", path: "/local-search-checker", fill: [["ls-q", "plumber"], ["ls-town", "Preston"]], expect: ["#ls-go", null], attr: ["#ls-go", "href", /google\.[a-z.]+\/search/] },
  { name: "AI title & description writer", path: "/ai-meta-description-generator", fill: [["ai-about", "Emergency plumbers in Preston, Gas Safe, fixed prices."], ["ai-kw", "emergency plumber"], ["ai-town", "Preston"]], click: "#ai-form button[type=submit]", expect: ["#ai-out", /Preston/], timeout: 30000 },
  { name: "Bulk SEO checker", path: "/bulk-seo-checker", fill: [["bk-urls", "xkey.co.uk\nxkey.co.uk/guides"]], click: "#bk-form button[type=submit]", expect: ["#bk-out", /xkey\.co\.uk[\s\S]*\d/], timeout: 90000 },
  { name: "SEO score badge", path: "/seo-badge", fill: [["bd-site", "xkey.co.uk"]], expect: ["#bd-code", /badge\.svg\?site=xkey\.co\.uk/] },
];

const browser = await chromium.launch();
let failed = 0;
const RUN = S.filter((x) => !only || only.test(x.name) || only.test(x.path));
for (const s of RUN) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("script error: " + e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|ERR_TUNNEL|ERR_NAME|net::ERR_|Failed to load resource/.test(m.text())) errors.push("console: " + m.text()); });
  page.on("dialog", (d) => { errors.push("unexpected dialog: " + d.message()); d.dismiss(); });
  const timeout = s.timeout || 8000;
  let problem = "";
  try {
    await page.goto(site.url + s.path, { waitUntil: "load" });
    for (const [id, value] of s.fill || []) {
      const el = page.locator(/[\s\[>#.=]/.test(id) ? id : "#" + id).first();
      if (!(await el.count())) { problem = `field ${id} not found`; break; }
      await el.fill(value);
    }
    if (!problem && s.click) {
      const btn = page.locator(s.click.split(",").map((x) => x.trim().startsWith("#") || x.trim().startsWith("main") ? x : `main form:first-of-type ${x}`).join(", ")).first();
      if (!(await btn.count())) problem = `button ${s.click} not found`;
      else await Promise.all([s.nav ? page.waitForURL(s.nav, { timeout }).catch(() => { problem = `didn't open ${s.nav}`; }) : null, btn.click()]);
    }
    if (!problem && s.expect && s.expect[1]) {
      const [sel, re] = s.expect;
      await page.waitForFunction(([sel, src, flags]) => { const el = document.querySelector(sel); return el && new RegExp(src, flags).test(el.innerText); }, [sel, re.source, re.flags], { timeout }).catch(() => {});
      const txt = await page.locator(sel).first().innerText().catch(() => "");
      if (!re.test(txt)) problem = `${sel} didn't show ${re} (got: ${JSON.stringify(txt.replace(/\s+/g, " ").slice(0, 160))})`;
    }
    if (!problem && s.attr) {
      const [sel, name, re] = s.attr;
      const v = await page.locator(sel).first().getAttribute(name).catch(() => "");
      if (!re.test(v || "")) problem = `${sel} ${name} was ${JSON.stringify(v)}`;
    }
  } catch (e) { problem = "crashed: " + e.message.split("\n")[0]; }
  if (errors.length) problem = (problem ? problem + "; " : "") + [...new Set(errors)].slice(0, 3).join("; ");
  if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, s.name.replace(/\W+/g, "_") + ".png"), fullPage: true }).catch(() => {});
  console.log(`${problem ? "FAIL" : " ok "}  ${s.name.padEnd(34)} ${problem}`);
  if (problem) failed++;
  await page.context().close();
}
await browser.close(); await site.close();
console.log(`\n${RUN.length} tool scenarios, ${failed} failed`);
process.exit(failed ? 1 : 0);
