// Click-through test of every XKey tool, run against the site built the way Cloudflare builds it.
//   node test/tools.mjs            (needs playwright + esbuild; see test/lib.mjs)
//   node test/tools.mjs audit      (only scenarios whose name matches)
// For each tool it fills the form like a visitor, presses the button, waits for the result and
// fails on: a browser error (e.g. a script crashing on load), a missing/empty result, or a result
// without the expected text. Checks run on xkey.co.uk itself, which the Worker handles
// in-process, so no internet is needed.
import { need, serve, blData, whoisStandIns, dnsStandIn, ctStandIn } from "./lib.mjs";
import { whoisApi, whoisDate, parseWhois } from "../src/whois.js";
import { traceRedirects, metaRefresh, redirectsApi } from "../src/redirects.js";
import { extractLinks, linkStatus, linksCheckApi } from "../src/linkcheck.js";
import { headerNotes } from "../src/headers.js";
import { dnsApi, dnsName } from "../src/dns.js";
import { techApi, detectTech } from "../src/tech.js";
import { sslApi, mixedContent, ctLookup } from "../src/ssl.js";
import { backlinksApi, authorityApi, crc32 } from "../src/backlinks.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

const here = path.dirname(fileURLToPath(import.meta.url));
const only = process.argv[2] ? new RegExp(process.argv[2], "i") : null;

// 0) Backlink lookups straight against the index files: format 2 (all domains) and the older
//    format 1 (.uk only), which the site must keep reading until a format-2 release is published.
let apiFailed = 0;
if (!only || only.test("backlink") || only.test("whois") || only.test("redirect") || only.test("link") || only.test("header") || only.test("dns")) {
  const bl = async (dir, d, vs) => (await backlinksApi({ BL_DATA: blData(dir) }, { waitUntil() {} }, new URLSearchParams(vs ? { d, vs } : { d }))).body;
  const da = async (dir, d) => (await authorityApi({ BL_DATA: blData(dir) }, { waitUntil() {} }, new URLSearchParams({ d }))).body;
  const checks = [
    ["crc32 matches Python's zlib.crc32", () => crc32("smithplumbing.co.uk") === 1290027534 && crc32("example.com") === 3069857465],
    ["format 2: .co.uk", async () => (await bl("backlinks", "smithplumbing.co.uk")).you.refDomains === 3],
    ["format 2: subdomain of a .com", async () => (await bl("backlinks", "https://shop.example.com/x")).you.domain === "example.com"],
    ["format 2: example.com.au, not com.au", async () => { const r = await bl("backlinks", "nothing.com.au"); return r.you.domain === "nothing.com.au" && !r.you.found; }],
    ["format 2: link gap", async () => (await bl("backlinks", "smithplumbing.co.uk", "rival.co.uk")).gap.map((x) => x[0]).join() === "wikipedia.org,localpaper.co.uk"],
    ["format 1: .co.uk", async () => { const r = await bl("backlinks-v1", "smithplumbing.co.uk", "rival.co.uk"); return r.you.refDomains === 3 && r.gap.length === 2; }],
    ["format 1: .com refused (UK-only index)", async () => /UK websites/.test((await bl("backlinks-v1", "example.com")).error)],
    ["authority: rank-based scores and order kept", async () => { const r = await da("backlinks", "smithplumbing.co.uk,https://www.wikipedia.org/wiki/x,nothing.co.uk,not a site"); const [s, w, n, x] = r.results; return r.ranks && r.ranked === 11 && s.rank === 5 && s.authority === 33 && s.refDomains === 3 && w.authority === 100 && w.rank === 1 && !n.found && n.authority === 0 && !!x.error; }],
    ["authority: more than 10 refused", async () => /Up to 10/.test((await da("backlinks", Array.from({ length: 11 }, (_, i) => `s${i}.com`).join(","))).error)],
    ["authority: falls back to link strength without ranks", async () => { const r = await da("backlinks-v1", "smithplumbing.co.uk example.com"); return !r.ranks && r.results[0].authority === r.results[0].strength && r.results[0].authority > 0 && /\.uk/.test(r.results[1].error); }],
  ];
  const wh = async (d) => (await whoisApi(whoisStandIns(), { waitUntil() {} }, new URLSearchParams({ d }))).body;
  checks.push(
    ["whois: RDAP .com and .co.uk, nested registrar, not registered", async () => { const [e, s, n] = (await wh("https://www.example.com/x,smithplumbing.co.uk,nothing-here.co.uk")).results; return e.registered && e.created === "1995-08-14" && e.expires === "2027-08-13" && e.dnssec === true && /Assigned Numbers/.test(e.registrar) && e.nameservers[0] === "a.iana-servers.net" && s.registrar === "Tucows Inc" && s.created === "2009-03-02" && n.registered === false && !e.raw; }],
    ["whois: WHOIS fallback (.ie dates, .de without dates, free .ie)", async () => { const [i, d, f] = (await wh("smith.ie,beispiel.de,free.ie")).results; return i.source === "whois" && i.created === "2001-03-12" && i.expires === "2027-03-12" && i.registrar === "Blacknight Solutions" && d.registered && !d.created && d.nameservers[0] === "ns1.beispiel.de" && f.registered === false; }],
    ["whois: raw WHOIS text only for single lookups", async () => /Blacknight/.test((await wh("smith.ie")).results[0].raw)],
    ["whois: ending without a registry server", async () => /isn't published/.test((await wh("thing.zz")).results[0].error)],
    ["whois: more than 10 refused", async () => /Up to 10/.test((await wh(Array.from({ length: 11 }, (_, i) => `s${i}.com`).join(","))).error)],
    ["whois: date formats", () => whoisDate("12-Mar-2001") === "2001-03-12" && whoisDate("2001.03.12 10:00:00") === "2001-03-12" && whoisDate("12/03/2001") === "2001-03-12" && whoisDate("20010312") === "2001-03-12" && whoisDate("before Aug-1996") === null && parseWhois("Registered on: 05-Jun-1996\n").created === "1996-06-05"],
    ["whois: tidy status, name servers and EURid registrar", () => { const p = parseWhois("Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited\nName Server: NS1.X.COM.\nRegistrar:\n        Name: ClearMedia NV\n"); return p.status[0] === "client transfer prohibited" && p.nameservers[0] === "ns1.x.com" && p.registrar === "ClearMedia NV"; }],
  );
  // a fake web for the redirect checker: path -> [status, location or html]
  const web = { "/a": [301, "/b"], "/b": [302, "https://site.co.uk/c"], "/c": [200, '<html><head><meta http-equiv="refresh" content="0; URL=\'/d\'"></head><body>x</body></html>'], "/d": [200, "<html><body>done</body></html>"],
    "/loop1": [301, "/loop2"], "/loop2": [301, "/loop1"], "/gone": [301, "/missing"], "/missing": [404, ""], "/private": [301, "http://127.0.0.1/admin"], "/insecure": [301, "http://site.co.uk/d"] };
  let calls = 0;
  const fakeFetch = async (u) => { calls++; const [st, v] = web[new URL(u).pathname] || [404, ""]; return st >= 300 && st < 400 ? new Response(null, { status: st, headers: { location: v } }) : new Response(v, { status: st, headers: { "content-type": "text/html" } }); };
  checks.push(
    ["redirects: 301 + 302 + meta refresh chain", async () => { const r = await traceRedirects("https://site.co.uk/a", fakeFetch); return r.redirects === 3 && r.final === "https://site.co.uk/d" && r.status === 200 && r.ok && r.hops[2].type === "meta" && r.problems.some((p) => /3 redirects/.test(p)) && r.problems.some((p) => /302/.test(p)) && r.problems.some((p) => /meta refresh/.test(p)); }],
    ["redirects: loop, 404 end, private target, https to http", async () => { const [l, g, p, i] = await Promise.all(["site.co.uk/loop1", "https://site.co.uk/gone", "https://site.co.uk/private", "https://site.co.uk/insecure"].map((u) => traceRedirects(u, fakeFetch))); return !l.ok && /loop/i.test(l.problems[0]) && !g.ok && g.status === 404 && !p.ok && /can't be followed/.test(p.problems.join()) && p.hops.length === 1 && i.problems.some((x) => /insecure http/.test(x)); }],
    ["redirects: meta refresh parsing", () => metaRefresh('<meta content="5;url=https://x.co.uk/" http-equiv="Refresh">').url === "https://x.co.uk/" && metaRefresh("<meta http-equiv=refresh content='0'>") === null && metaRefresh("<head></head><body><meta http-equiv=\"refresh\" content=\"0;url=/x\"></body>") === null],
    ["redirects: subrequest budget and batch limit", async () => { calls = 0; const r = (await redirectsApi(new URLSearchParams(Array.from({ length: 10 }, () => ["u", "site.co.uk/loop1"])), fakeFetch)).body; const big = (await redirectsApi(new URLSearchParams(Array.from({ length: 11 }, (_, i) => ["u", `s${i}.co.uk`])), fakeFetch)).body; return calls <= 45 && r.results.length === 10 && /Up to 10/.test(big.error); }],
  );
  const lweb = { "/ok": [200], "/gone": [404], "/moved": [301, "/ok"], "/nohead": [405, null, 200], "/linkedin": [403, null, 403], "/err": [500] };
  const lfetch = async (u, init) => { const [st, loc, get] = lweb[new URL(u).pathname] || [404]; const s = init && init.method === "HEAD" ? st : get || st; return new Response(null, { status: s, headers: loc ? { location: loc } : {} }); };
  checks.push(
    ["links: extract links, images, anchor text, skip mailto/js/#", () => { const l = extractLinks('<base href="https://site.co.uk/dir/"><a href="page">Our <b>page</b></a><a href="/x#top" rel="nofollow"><img src="/i.png" alt="Logo"></a><a href="mailto:a@b.co">m</a><a href="#top">t</a><a href="javascript:void(0)">j</a><a href="https://other.com/">Other</a><!-- <a href="/hidden">h</a> --><script>"<a href=/s>"</script>', "https://www.site.co.uk/"); const by = Object.fromEntries(l.map((x) => [x.url, x])); return l.length === 4 && by["https://site.co.uk/dir/page"].text === "Our page" && by["https://site.co.uk/dir/page"].internal && by["https://site.co.uk/x"].text === "Logo" && by["https://site.co.uk/x"].nofollow && by["https://site.co.uk/i.png"].kind === "image" && !by["https://other.com/"].internal; }],
    ["links: statuses (ok, 404, redirect, HEAD refused, blocked, 500)", async () => { const r = await Promise.all(["/ok", "/gone", "/moved", "/nohead", "/linkedin", "/err"].map((p) => linkStatus("https://site.co.uk" + p, lfetch))); return r.map((x) => x.verdict).join() === "ok,broken,redirect,ok,blocked,broken" && r[2].final === "https://site.co.uk/ok" && r[1].status === 404; }],
    ["links: private addresses skipped, batch limit", async () => (await linkStatus("http://localhost/x", lfetch)).verdict === "skipped" && /Up to 10/.test((await linksCheckApi(new URLSearchParams(Array.from({ length: 11 }, (_, i) => ["u", `https://s.co.uk/${i}`])), lfetch, { waitUntil() {} })).body.error)],
  );
  checks.push(
    ["headers: noindex, compression, HSTS, version notes", () => { const n = headerNotes([["Content-Type", "text/html"], ["X-Robots-Tag", "noindex"], ["Server", "Apache/2.4.1"], ["Link", '<https://site.co.uk/a>; rel="canonical"']], "https://site.co.uk/", 200); const t = n.map((x) => x.level + ":" + x.text).join("|"); return /fail:X-Robots-Tag tells/.test(t) && /warn:Content-Type doesn't say/.test(t) && /warn:No Content-Encoding/.test(t) && /warn:No Strict-Transport/.test(t) && /Apache\/2\.4\.1/.test(t) && /Canonical address .*site\.co\.uk\/a/.test(t); }],
    ["headers: a well-set-up page", () => headerNotes([["content-type", "text/html; charset=utf-8"], ["content-encoding", "br"], ["strict-transport-security", "max-age=31536000"], ["cache-control", "max-age=60"], ["x-content-type-options", "nosniff"]], "https://site.co.uk/", 200).every((x) => x.level === "ok" || x.level === "info")],
  );
  const dq = async (d) => (await dnsApi({ DNS_FETCH: dnsStandIn() }, new URLSearchParams({ d }))).body;
  checks.push(
    ["dns: records and good set-up", async () => { const r = await dq("https://www.SmithPlumbing.co.uk/x".replace("www.", "")); const t = r.checks.map((c) => c.level + ":" + c.text).join("|"); return r.exists && r.dnssec && r.records.MX[0].data.startsWith("10 mail") && /ok:SPF is set up/.test(t) && /info:DMARC is set to p=none/.test(t) && /ok:www\.smithplumbing\.co\.uk resolves/.test(t) && !/fail|warn:/.test(t); }],
    ["dns: two SPF records, no www, no DMARC", async () => { const t = (await dq("badmail.co.uk")).checks.map((c) => c.level + ":" + c.text).join("|"); return /fail:2 SPF records/.test(t) && /warn:www\.badmail/.test(t) && /warn:No DMARC/.test(t); }],
    ["dns: missing domain, bad input", async () => { const r = await dq("nothing-here.co.uk"); let bad = false; try { dnsName("not a domain"); } catch { bad = true; } return r.exists === false && /doesn't exist/.test(r.checks[0].text) && bad && dnsName("https://Shop.Example.com/x") === "shop.example.com"; }],
  );
  // a fake web for the technology checker: a WordPress shop, a Shopify store, a blocked site and a redirect
  const wpPage = `<html><head><title>Smith Plumbing</title><meta name="generator" content="WordPress 6.6.2"><meta name="generator" content="Powered by Slider Revolution 6.7"><link rel="stylesheet" href="/wp-content/themes/astra/style.css"><link rel="stylesheet" href="/wp-content/plugins/elementor/assets/css/frontend.min.css"><script src="/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"></script><script src="https://www.google-analytics.com/analytics.js"></script><script src="https://connect.facebook.net/en_GB/fbevents.js"></script><!-- This site is optimized with the Yoast SEO plugin v23.5 - https://yoast.com/ --></head><body class="woocommerce-page"><a href="https://wa.me/447700900000">WhatsApp</a></body></html>`;
  const techWeb = {
    "https://smithplumbing.co.uk/": [301, "https://www.smithplumbing.co.uk/"],
    "https://www.smithplumbing.co.uk/": [200, wpPage, { server: "nginx/1.24.0", "x-powered-by": "PHP/8.2.10", "set-cookie": "woocommerce_items_in_cart=0" }],
    "https://shop.example.com/": [200, `<html><head><script>Shopify.theme = {"name":"Dawn","id":1};</script><script src="//cdn.shopify.com/s/files/x.js"></script><script src="https://consent.cookiebot.com/uc.js"></script><script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123"></script></head><body><div id="___gatsby"></div></body></html>`, { server: "cloudflare", "cf-ray": "1-LHR", "x-shopid": "1" }],
    "https://blocked.co.uk/": [403, "<html>Access denied</html>", { server: "cloudflare", "cf-ray": "2-LHR" }],
  };
  const techFetch = async (u) => { const [st, body, h = {}] = techWeb[u] || [404, ""]; return st >= 300 && st < 400 ? new Response(null, { status: st, headers: { location: body } }) : new Response(body, { status: st, headers: { "content-type": "text/html; charset=utf-8", ...h } }); };
  const tq = async (url) => (await techApi({ DNS_FETCH: dnsStandIn() }, new URLSearchParams({ url }), techFetch)).body;
  const names = (r) => r.tech.map((t) => `${t.cat}:${t.name}${t.version ? " " + t.version : ""}`).join("|");
  checks.push(
    ["tech: WordPress site after a redirect, with theme, plugins, versions, server, email and DNS", async () => { const r = await tq("smithplumbing.co.uk"); const n = names(r);
      return r.url === "https://www.smithplumbing.co.uk/" && r.title === "Smith Plumbing" && /cms:WordPress 6\.6\.2/.test(n) && /theme:Astra \(WordPress theme\)/.test(n) && /builder:Elementor/.test(n) && /seo:Yoast SEO 23\.5/.test(n) && /shop:WooCommerce/.test(n) && /wp:Slider Revolution 6\.7/.test(n) && /lib:jQuery 3\.7\.1/.test(n) && /lang:PHP 8\.2\.10/.test(n) && /server:nginx 1\.24\.0/.test(n) && /ads:Meta \(Facebook\) Pixel/.test(n) && /email:Own or other mail server \(mail\.smithplumbing\.co\.uk\)/.test(n) && /dns:Other \(ns1\.host\.co\.uk\)/.test(n) && /sending:Google Workspace/.test(n) && /verified:Google Search Console/.test(n) && /chat:WhatsApp/.test(n)
        && r.notes.some((x) => /Universal Analytics/.test(x.text)) && r.notes.some((x) => /no known cookie banner/.test(x.text)) && r.guide && r.guide.name === "WordPress"; }],
    ["tech: Shopify with theme, consent banner and CDN; no duplicate hosting or React", async () => { const r = await tq("https://shop.example.com/"); const n = names(r);
      return /shop:Shopify/.test(n) && /theme:Dawn \(Shopify theme\)/.test(n) && /consent:Cookiebot/.test(n) && /cdn:Cloudflare/.test(n) && /analytics:Google Analytics 4/.test(n) && /js:Gatsby/.test(n) && !/Shopify hosting|js:React/.test(n) && !r.notes.some((x) => /cookie banner|No analytics/.test(x.text)); }],
    ["tech: blocked site still shows hosting; bad input", async () => { const r = await tq("blocked.co.uk"); const bad = (await techApi({}, new URLSearchParams({ url: "http://localhost/" }), techFetch)); return r.status === 403 && /bot protection/.test(r.notes[0].text) && /cdn:Cloudflare/.test(names(r)) && bad.status === 400; }],
    ["ssl: secure site, http redirect, HSTS, mixed content, certificate expiring soon", async () => {
      const page = '<html><body><img src="http://cdn.smithplumbing.co.uk/a.jpg"><script src="http://old.example.com/x.js"></script><img src="https://ok/b.png" srcset="http://cdn.x/c.jpg 2x"><a href="http://fine.example.com/">link</a></body></html>';
      const f = async (u) => u === "http://smithplumbing.co.uk/" ? new Response(null, { status: 301, headers: { location: "https://smithplumbing.co.uk/" } }) : u === "https://smithplumbing.co.uk/" ? new Response(page, { headers: { "content-type": "text/html", "strict-transport-security": "max-age=31536000" } }) : new Response("", { status: 404 });
      const r = (await sslApi({ CT_FETCH: ctStandIn() }, new URLSearchParams({ d: "https://SmithPlumbing.co.uk/contact" }), f)).body; const t = r.checks.map((c) => c.level + ":" + c.text).join("|");
      return r.secure && r.hsts === "max-age=31536000" && /ok:http:\/\/smithplumbing\.co\.uk redirects to https/.test(t) && /fail:1 insecure script/.test(t) && /warn:2 insecure image/.test(t) && /fail:.*expires in [45] days/.test(t) && r.cert.issuer === "Let's Encrypt" && r.mixed.length === 3; }],
    ["ssl: no https, no redirect; CT newest certificate and errors", async () => {
      const f = async (u) => { if (u.startsWith("https:")) throw new TypeError("TLS handshake failed"); return new Response("<html></html>", { headers: { "content-type": "text/html" } }); };
      const r = (await sslApi({ CT_FETCH: ctStandIn() }, new URLSearchParams({ d: "down.co.uk" }), f)).body; const t = r.checks.map((c) => c.level + ":" + c.text).join("|");
      const x = await ctLookup({ CT_FETCH: ctStandIn() }, "xkey.co.uk"), w = await ctLookup({ CT_FETCH: ctStandIn() }, "www.xkey.co.uk"), none = await ctLookup({ CT_FETCH: ctStandIn() }, "nothing.co.uk");
      return !r.secure && /fail:We couldn't make a secure/.test(t) && /warn:http:\/\/down\.co\.uk doesn't redirect/.test(t) && r.ctError && x.issuer === "Google Trust Services" && x.daysLeft >= 59 && w && w.id === 2 && none === null && mixedContent('<link rel="canonical" href="http://a/">').length === 0; }],
    ["tech: no WordPress plugins without WordPress", () => { const t = detectTech('<div class="wpcf7 wp-block-group"></div>'); return !t.length; }],
  );
  for (let [name, fn] of checks) {
    let ok = false; try { ok = await fn(); } catch (e) { name += " – " + e.message; }
    console.log(`${ok ? " ok " : "FAIL"}  ${name}`);
    if (!ok) apiFailed++;
  }
}

// 1) Build like Wrangler does (esbuild, ESM, keep-names on – Wrangler's default).
const esbuild = await need("esbuild");
const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "xkey-build-")), "worker.mjs");
await (esbuild.build || esbuild.default.build)({
  entryPoints: [path.join(here, "../src/index.js")], bundle: true, format: "esm", platform: "neutral",
  target: "es2022", keepNames: true, outfile, external: ["cloudflare:*"], logLevel: "error", mainFields: ["module", "main"],
});
const site = await serve(8790, outfile);
const { chromium } = await need("playwright");

// 2) Scenarios. fill: [id, value]; click: id; expect: [selector, /regex/] checked after waiting.
const S = [
  { name: "SEO check → report", path: "/", fill: [["ck-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/seo-checker/, expect: ["main", /SEO score|score/i], wait: "main .score, main [class*=score]" },
  { name: "SEO report – authority & backlinks", path: "/seo-checker?url=xkey.co.uk", expect: ["#offsite", /Authority[\s\S]*Websites linking to it[\s\S]*Domain age[\s\S]*since 20 May 2016[\s\S]*See every linking website/], timeout: 30000 },
  { name: "SEO report – links to our tools", path: "/seo-checker?url=xkey.co.uk", expect: ["main", /keyword generator|schema generator|word counter|title tag checker/i], timeout: 30000 },
  { name: "SEO report – links to our guides", path: "/seo-checker?url=xkey.co.uk", expect: ["main", /Read the guide: /], timeout: 30000 },
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
  { name: "Backlink checker", path: "/backlink-checker", fill: [["bl-d", "https://www.smithplumbing.co.uk/contact"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /3[\s\S]*websites link to it[\s\S]*bbc\.co\.uk/] },
  { name: "Backlink checker – link gap", path: "/backlink-checker", fill: [["bl-d", "smithplumbing.co.uk"], ["bl-vs", "rival.co.uk"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /2 websites link to rival\.co\.uk but not to you[\s\S]*wikipedia\.org[\s\S]*localpaper\.co\.uk/] },
  { name: "Backlink checker – .com", path: "/backlink-checker", fill: [["bl-d", "https://www.example.com/about"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /example\.com[\s\S]*3[\s\S]*websites link to it[\s\S]*wikipedia\.org/] },
  { name: "Backlink checker – .com.au vs .co.uk", path: "/backlink-checker", fill: [["bl-d", "blog.shop.com.au"], ["bl-vs", "smithplumbing.co.uk"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /shop\.com\.au[\s\S]*2 websites link to smithplumbing\.co\.uk but not to you[\s\S]*bbc\.co\.uk/] },
  { name: "Backlink checker – opened from a link", path: "/backlink-checker?d=rival.co.uk", expect: ["#bl-out", /rival\.co\.uk[\s\S]*4[\s\S]*websites link to it/] },
  { name: "Domain authority checker", path: "/domain-authority-checker", fill: [["da-urls", "smithplumbing.co.uk\nhttps://www.wikipedia.org/\nnothing.co.uk"]], click: "#da-form button[type=submit]", expect: ["#da-out", /smithplumbing\.co\.uk[\s\S]*33[\s\S]*#5[\s\S]*wikipedia\.org[\s\S]*100[\s\S]*#1[\s\S]*No links found[\s\S]*Download CSV/] },
  { name: "Domain authority checker – 25 sites in batches", path: "/domain-authority-checker", fill: [["da-urls", Array.from({ length: 24 }, (_, i) => `site${i}.co.uk`).concat("bbc.co.uk").join("\n")]], click: "#da-form button[type=submit]", expect: ["#da-out", /bbc\.co\.uk[\s\S]*#2[\s\S]*Sort by authority/] },
  { name: "Broken link checker – whole site", path: "/broken-link-checker", fill: [["lk-url", "xkey.co.uk"]], select: [["lk-max", "50"], ["lk-ext", "0"]], click: "#lk-form button[type=submit]", expect: ["#lk-out", /Finished\. Crawled 50 pages[\s\S]*No broken links found/], timeout: 120000 },
  { name: "DNS lookup", path: "/dns-lookup", fill: [["dn-d", "smithplumbing.co.uk"]], click: "#dn-form button[type=submit]", expect: ["#dn-out", /smithplumbing\.co\.uk[\s\S]*DNSSEC signed[\s\S]*SPF is set up[\s\S]*MX[\s\S]*10 mail\.smithplumbing\.co\.uk[\s\S]*_dmarc\.smithplumbing\.co\.uk[\s\S]*v=DMARC1/] },
  { name: "Website technology checker", path: "/website-technology-checker", fill: [["tc-url", "xkey.co.uk"]], click: "#tc-form button[type=submit]", expect: ["#tc-out", /technolog[\s\S]*Email provider[\s\S]*Google Workspace[\s\S]*DNS provider[\s\S]*Cloudflare[\s\S]*Google Search Console/] },
  { name: "Website technology checker – opened from a link", path: "/website-technology-checker?url=xkey.co.uk", expect: ["#tc-out", /Cloudflare/] },
  { name: "SSL checker", path: "/ssl-checker", fill: [["sl-d", "xkey.co.uk"]], click: "#sl-form button[type=submit]", expect: ["#sl-out", /Secure[\s\S]*loads over https[\s\S]*Google Trust Services[\s\S]*\*\.xkey\.co\.uk/] },
  { name: "SSL checker – opened from a link", path: "/ssl-checker?d=xkey.co.uk", expect: ["#sl-out", /Expires/] },
  { name: "UTM builder", path: "/utm-builder", fill: [["ut-campaign", "Spring Sale 2026"]], expect: ["#ut-out", /^https:\/\/smithplumbing\.co\.uk\/boiler-service\?utm_source=facebook&utm_medium=social&utm_campaign=spring-sale-2026$/] },
  { name: "URL slug generator", path: "/url-slug-generator", fill: [["us-in", "Café & Bistro – Blackpool's Finest!\nThe 10 Best Boiler Brands in the UK (2026 Guide) for Homes and Small Businesses"]], expect: ["#us-out", /^cafe-and-bistro-blackpools-finest\s+the-10-best-boiler-brands-in-the-uk-2026-guide-for-homes-and$/] },
  { name: "Case converter", path: "/case-converter", fill: [["cc-in", "the lord of the rings and i"]], click: "#cc-btns button[data-c=title]", expect: ["#cc-hidden", /^The Lord of the Rings and I$/] },
  { name: "DNS lookup – problems, opened from a link", path: "/dns-lookup?d=badmail.co.uk", expect: ["#dn-out", /www\.badmail\.co\.uk doesn't resolve[\s\S]*2 SPF records/] },
  { name: "HTTP header checker", path: "/http-header-checker", fill: [["hd-url", "http://www.xkey.co.uk/about"]], click: "#hd-form button[type=submit]", expect: ["#hd-out", /Step 1: http:\/\/www\.xkey\.co\.uk\/about[\s\S]*301[\s\S]*location[\s\S]*Step 2: https:\/\/xkey\.co\.uk\/about[\s\S]*200[\s\S]*content-type[\s\S]*text\/html/] },
  { name: "HTTP header checker – opened from a link", path: "/http-header-checker?url=xkey.co.uk", expect: ["#hd-out", /https:\/\/xkey\.co\.uk\/[\s\S]*200[\s\S]*content-type/] },
  { name: "Redirect checker", path: "/redirect-checker", fill: [["rd-urls", "http://www.xkey.co.uk/seo-checker"]], click: "#rd-form button[type=submit]", expect: ["#rd-out", /http:\/\/www\.xkey\.co\.uk\/seo-checker[\s\S]*2 redirects, ends 200[\s\S]*301[\s\S]*301[\s\S]*200[\s\S]*Final address: https:\/\/xkey\.co\.uk\/[\s\S]*2 redirects in a row[\s\S]*Download CSV/] },
  { name: "Redirect checker – http/https/www versions", path: "/redirect-checker", fill: [["rd-urls", "xkey.co.uk"]], click: "#rd-four", expect: ["#rd-out", /http:\/\/xkey\.co\.uk\/[\s\S]*1 redirect,[\s\S]*http:\/\/www\.xkey\.co\.uk[\s\S]*https:\/\/xkey\.co\.uk\/ – 0 redirects, ends 200[\s\S]*https:\/\/www\.xkey\.co\.uk[\s\S]*Download CSV/] },
  { name: "Redirect checker – one secure address", path: "/redirect-checker", fill: [["rd-urls", "xkey.co.uk"]], click: "#rd-four", expect: ["#rd-out", /All 4 versions of xkey\.co\.uk end at https:\/\/xkey\.co\.uk\/ – exactly right/], timeout: 30000 },
  { name: "Domain age checker", path: "/domain-age-checker", fill: [["dg-urls", "example.com\nsmithplumbing.co.uk\nnothing-here.co.uk\nsoon.co.uk\nbeispiel.de"]], click: "#dg-form button[type=submit]", expect: ["#dg-out", /example\.com[\s\S]*\d+ years[\s\S]*14 Aug 1995[\s\S]*smithplumbing\.co\.uk[\s\S]*Tucows[\s\S]*Not registered[\s\S]*\d+ days left[\s\S]*beispiel\.de[\s\S]*Not published[\s\S]*Download CSV/] },
  { name: "Domain age checker – 25 in batches", path: "/domain-age-checker", fill: [["dg-urls", Array.from({ length: 24 }, (_, i) => `free${i}.co.uk`).concat("example.com").join("\n")]], click: "#dg-form button[type=submit]", expect: ["#dg-out", /example\.com[\s\S]*Oldest first/] },
  { name: "WHOIS lookup", path: "/whois-lookup", fill: [["wh-d", "https://www.example.com/page"]], click: "#wh-form button[type=submit]", expect: ["#wh-out", /example\.com[\s\S]*\d+ years[\s\S]*Assigned Numbers[\s\S]*a\.iana-servers\.net[\s\S]*client transfer prohibited[\s\S]*Signed/] },
  { name: "WHOIS lookup – WHOIS fallback, opened from a link", path: "/whois-lookup?d=smith.ie", expect: ["#wh-out", /smith\.ie[\s\S]*Blacknight[\s\S]*Registry WHOIS record[\s\S]*whois\.weare\.ie/] },
  { name: "WHOIS lookup – not registered", path: "/whois-lookup", fill: [["wh-d", "nothing-here.co.uk"]], click: "#wh-form button[type=submit]", expect: ["#wh-out", /isn't registered/] },
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
    for (const [id, value] of s.select || []) await page.selectOption("#" + id, value);
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
console.log(`\n${RUN.length} tool scenarios, ${failed} failed` + (apiFailed ? `; ${apiFailed} backlink lookup checks failed` : ""));
process.exit(failed || apiFailed ? 1 : 0);
