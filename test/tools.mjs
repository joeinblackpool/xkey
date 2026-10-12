// Click-through test of every XKey tool, run against the site built the way Cloudflare builds it.
//   node test/tools.mjs            (needs playwright + esbuild; see test/lib.mjs)
//   node test/tools.mjs audit      (only scenarios whose name matches)
// For each tool it fills the form like a visitor, presses the button, waits for the result and
// fails on: a browser error (e.g. a script crashing on load), a missing/empty result, or a result
// without the expected text. Checks run on xkey.co.uk itself, which the Worker handles
// in-process, so no internet is needed.
import { need, serve, blData, whoisStandIns, dnsStandIn, ctStandIn, GSD_FIXTURE, dohStandIn } from "./lib.mjs";
import { a11yCheck } from "../src/a11y.js";
import { parseIncidents, updatesHtml } from "../src/google-updates.js";
import { propagationApi, encodeQuery, decodeAnswers } from "../src/propagation.js";
import { ptrApi } from "../src/ptr.js";
import { whoisApi, whoisDate, parseWhois } from "../src/whois.js";
import { traceRedirects, metaRefresh, redirectsApi } from "../src/redirects.js";
import { extractLinks, linkStatus, linksCheckApi } from "../src/linkcheck.js";
import { headerNotes } from "../src/headers.js";
import { dnsApi, dnsName } from "../src/dns.js";
import { techApi, detectTech } from "../src/tech.js";
import { hostingApi, inCidr, parseIpRdap } from "../src/hosting.js";
import { headTags, metaApi } from "../src/meta.js";
import { sslApi, mixedContent, ctLookup } from "../src/ssl.js";
import { emailApi, parseSpf, keyBits } from "../src/email.js";
import { backlinksApi, authorityApi, crc32 } from "../src/backlinks.js";
import { redirectPairs, redirectRules } from "../src/tools-more.js";
import { qrMatrix } from "../src/tools-extra.js";
import { OG_PNG } from "../src/og.js";
import { indexable } from "../src/site-report.js";
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
    "https://xkey.co.uk/": [200, "<html><head><title>x</title></head></html>", { server: "cloudflare", "cf-ray": "3-LHR" }],
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
    ["hosting: owner from RDAP (IPv4 and nested IPv6), reverse DNS, country", async () => { const r = (await hostingApi({ DNS_FETCH: dnsStandIn(), ...whoisStandIns() }, new URLSearchParams({ d: "https://smithplumbing.co.uk/contact" }), techFetch)).body; const [a, b] = r.ips;
      return r.exists && r.provider === "Krystal Hosting Ltd" && a.ip === "192.0.2.10" && a.ptr === "server12.krystal.uk" && a.country === "GB" && a.network === "KRYSTAL-UK" && b.version === 6 && b.org === "Krystal Hosting Ltd" && !r.notes.some((n) => /IPv6/.test(n.text)); }],
    ["hosting: Cloudflare hides the host; missing domain; bad input", async () => { const env = { DNS_FETCH: dnsStandIn(), ...whoisStandIns() }; const r = (await hostingApi(env, new URLSearchParams({ d: "xkey.co.uk" }), techFetch)).body; const n = (await hostingApi(env, new URLSearchParams({ d: "nothing-here.co.uk" }), techFetch)).body; const bad = await hostingApi(env, new URLSearchParams({ d: "not a site" }), techFetch);
      return r.provider === null && /behind Cloudflare/.test(r.how) && r.ips[0].org === "Cloudflare, Inc." && n.exists === false && bad.status === 400; }],
    ["redirect map: parsing and rules", () => { const p = redirectPairs("old,new\n/a.html\t/a\nhttps://x.co.uk/b?id=2 -> /b\n/a.html /dup\n\n# note"); const h = redirectRules(p, "htaccess"), n = redirectRules(p, "nginx"), c = redirectRules(p, "cloudflare", "https://x.co.uk");
      return p.length === 2 && p[1].fromPath === "/b?id=2" && /RewriteRule \^a\\\.html\$ \/a \[R=301,L\]/.test(h) && /RewriteCond %\{QUERY_STRING\} \^id=2\$\nRewriteRule \^b\$ \/b \[R=301,L,QSD\]/.test(h) && /location = \/a\.html \{ return 301 \/a; \}/.test(n) && /https:\/\/x\.co\.uk\/a\.html,https:\/\/x\.co\.uk\/a,301/.test(c); }],
    ["qr: versions, finder patterns, too-long text", () => { const a = qrMatrix("https://xkey.co.uk", "M"), b = qrMatrix("x".repeat(150), "Q"), f = (m, x, y) => [0, 1, 2, 3, 4, 5, 6].every((i) => m[y][x + i] && m[y + 6][x + i] && m[y + i][x] && m[y + i][x + 6]) && m[y + 3][x + 3] && !m[y + 1][x + 1];
      return a.length === 25 && b.length === 57 && f(a, 0, 0) && f(a, 18, 0) && f(a, 0, 18) && f(b, 50, 0) && qrMatrix("y".repeat(3000), "H") === null && qrMatrix("£ café", "L").length === 21; }],
    ["site report: only strong sites are indexable", () => indexable({ found: true, rank: 5000, refDomains: 120 }) && !indexable({ found: true, rank: 2_000_000, refDomains: 500 }) && !indexable({ found: true, rank: 10, refDomains: 3 }) && !indexable({ found: true, rank: 0, refDomains: 900 }) && !indexable({ found: false })],
    ["hosting: CIDR matching and RDAP parsing", () => inCidr("192.0.2.10", "192.0.0.0/8") && !inCidr("193.0.2.10", "192.0.0.0/8") && inCidr("2001:db8::10", "2001:db8::/32") && !inCidr("2001:db9::1", "2001:db8::/32") && !inCidr("192.0.2.1", "2001:db8::/32") && parseIpRdap({ name: "N", entities: [{ roles: ["technical"], vcardArray: ["vcard", [["fn", {}, "text", "T Ltd"]]] }] }).org === "T Ltd"],
    ["meta: head tags, hreflang in <head> and Link header, after a redirect", async () => { const t = headTags(`<html lang="en-GB"><head><title>T &amp; Co</title><meta property="og:title" content="OG"><meta name="description" content='D'><link rel="alternate" hreflang="en-GB" href="/en-gb/"><link rel="canonical" href="https://a.co.uk/"><!-- <meta property="og:image" content="x"> --></head><body><meta property="og:image" content="late"></body></html>`, "https://a.co.uk/");
      const r = (await metaApi(new URLSearchParams({ url: "smithplumbing.co.uk" }), async (u) => u === "https://smithplumbing.co.uk/" ? new Response(null, { status: 301, headers: { location: "https://www.smithplumbing.co.uk/" } }) : new Response("<html><head><title>W</title></head></html>", { headers: { "content-type": "text/html", link: '<https://www.smithplumbing.ie/>; rel="alternate"; hreflang="en-IE"' } }))).body;
      return t.title === "T & Co" && t.lang === "en-GB" && t.metas.length === 2 && t.metas[0].key === "og:title" && t.links[0].href === "https://a.co.uk/en-gb/" && t.links[0].hreflang === "en-GB" && r.url === "https://www.smithplumbing.co.uk/" && r.title === "W" && r.links.some((l) => l.header && l.hreflang === "en-IE"); }],
    ["propagation: own name server, one resolver behind, one down; bad input", async () => { const env = { DNS_FETCH: dnsStandIn(), ...dohStandIn() }; const r = (await propagationApi(env, new URLSearchParams({ d: "xkey.co.uk", t: "a" }))).body; const q = r.resolvers.find((x) => /NextDNS/.test(x.label)), ali = r.resolvers.find((x) => /Ali/.test(x.label));
      const mx = (await propagationApi(env, new URLSearchParams({ d: "https://smithplumbing.co.uk/x", t: "MX" }))).body, nx = (await propagationApi(env, new URLSearchParams({ d: "nothing-xkey-12345.co.uk" }))).body, bad = await propagationApi(env, new URLSearchParams({ d: "xkey.co.uk", t: "SOA" }));
      const v6 = decodeAnswers(encodeQuery("a.b", "AAAA")); // a query has no answers
      return r.fromAuthority && r.authority.label === "ada.ns.cloudflare.com" && r.expected === "192.0.2.30" && q.key === "192.0.2.99" && q.match === false && !ali.ok && r.resolvers.filter((x) => x.match).length === 8
        && mx.expected === "10 mail.smithplumbing.co.uk" && !mx.fromAuthority && nx.expected === "(does not exist)" && bad.status === 400 && v6.answers.length === 0; }],
    ["ptr: IP, domain, IPv6, forward check, bad input", async () => { const r = (await ptrApi({ DNS_FETCH: dnsStandIn() }, new URLSearchParams({ q: "192.0.2.10, smithplumbing.co.uk 2001:DB8::10 999.1.1.1" }))).body.results; const none = await ptrApi({}, new URLSearchParams({ q: " " }));
      return r[0].ptr[0] === "server12.krystal.uk" && r[0].confirmed && r[1].domain === "smithplumbing.co.uk" && r[1].confirmed && r[2].ip === "2001:db8::10" && r[2].domain && r[3].ip === "2001:db8::10" && !r[3].domain && r[4].error && none.status === 400; }],
    ["ssl: secure site, http redirect, HSTS, mixed content, certificate expiring soon", async () => {
      const page = '<html><body><img src="http://cdn.smithplumbing.co.uk/a.jpg"><script src="http://old.example.com/x.js"></script><img src="https://ok/b.png" srcset="http://cdn.x/c.jpg 2x"><a href="http://fine.example.com/">link</a></body></html>';
      const f = async (u) => u === "http://smithplumbing.co.uk/" ? new Response(null, { status: 301, headers: { location: "https://smithplumbing.co.uk/" } }) : u === "https://smithplumbing.co.uk/" ? new Response(page, { headers: { "content-type": "text/html", "strict-transport-security": "max-age=31536000" } }) : new Response("", { status: 404 });
      const r = (await sslApi({ CT_FETCH: ctStandIn() }, new URLSearchParams({ d: "https://SmithPlumbing.co.uk/contact" }), f)).body; const t = r.checks.map((c) => c.level + ":" + c.text).join("|");
      return r.secure && r.hsts === "max-age=31536000" && /ok:http:\/\/smithplumbing\.co\.uk redirects to https/.test(t) && /fail:1 insecure script/.test(t) && /warn:2 insecure image/.test(t) && /fail:.*expires in [45] days/.test(t) && r.cert.issuer === "Let's Encrypt" && r.mixed.length === 3; }],
    ["ssl: no https, no redirect; CT newest certificate and errors", async () => {
      const f = async (u) => { if (u.startsWith("https:")) throw new TypeError("TLS handshake failed"); return new Response("<html></html>", { headers: { "content-type": "text/html" } }); };
      const r = (await sslApi({ CT_FETCH: ctStandIn() }, new URLSearchParams({ d: "down.co.uk" }), f)).body; const t = r.checks.map((c) => c.level + ":" + c.text).join("|");
      const x = await ctLookup({ CT_FETCH: ctStandIn() }, "xkey.co.uk"), w = await ctLookup({ CT_FETCH: ctStandIn() }, "www.xkey.co.uk"), none = await ctLookup({ CT_FETCH: ctStandIn() }, "nothing.co.uk"), sp = await ctLookup({ CT_FETCH: ctStandIn() }, "slowlogs.co.uk");
      return !r.secure && /fail:We couldn't make a secure/.test(t) && /warn:http:\/\/down\.co\.uk doesn't redirect/.test(t) && r.ctError && x.issuer === "Google Trust Services" && x.daysLeft >= 59 && w && w.id === 2 && none === null && sp.issuer === "Let's Encrypt" && sp.id === "77" && sp.daysLeft >= 79 && mixedContent('<link rel="canonical" href="http://a/">').length === 0; }],
    ["email: MX provider, SPF includes and lookups, DMARC on the parent, DKIM key sizes", async () => {
      const eq = async (d, t, sel) => (await emailApi({ DNS_FETCH: dnsStandIn() }, new URLSearchParams({ d, ...(t ? { t } : {}), ...(sel ? { s: sel } : {}) }))).body;
      const lv = (part, re) => part.checks.some((c) => re.test(c.level + ":" + c.text));
      const [x, sp, bad, many, sub, nosel, err] = await Promise.all([eq("xkey.co.uk", "dkim", "selector1"), eq("smithplumbing.co.uk", "dkim"), eq("badmail.co.uk"), eq("toomany.co.uk"), eq("shop.xkey.co.uk"), eq("xkey.co.uk", "dkim"), eq("xkey.co.uk", "dkim", "bad selector!")]);
      return x.mx.records[0].provider === "Google Workspace" && x.spf.lookups === 2 && x.spf.root.terms[0].sender === "Google Workspace" && x.spf.root.terms[0].child.terms[0].child.terms[0].type === "ip4" && lv(x.dmarc, /^ok:p=reject/) && x.dkim.found[0].bits === 1024 && lv(x.dkim, /^warn:selector1: a 1024-bit/)
        && sp.dkim.found[0].selector === "google" && sp.dkim.found[0].bits === 2048 && lv(sp.dmarc, /^warn:p=none/) && sp.mx.records[0].ips[0] === "192.0.2.11"
        && lv(bad.spf, /^fail:2 SPF records/) && lv(bad.mx, /^fail:mx\.badmail\.co\.uk doesn't resolve/) && lv(bad.dmarc, /^warn:No DMARC/) && !bad.dkim
        && many.spf.lookups === 11 && lv(many.spf, /^fail:11 DNS lookups/) && lv(many.spf, /^fail:The record ends in \+all/) && many.mx.nullMx
        && sub.dmarc.at === "xkey.co.uk" && lv(sub.dmarc, /^ok:sp=quarantine/) && lv(sub.spf, /^warn:No SPF/) && nosel.dkim.found[0].selector === "selector1" && err.error
        && parseSpf("v=spf1 a/24 mx:m.example.com -all")[0].type === "a" && keyBits("rsa", "") === 0; }],
    ["a11y: finds missing alt, labels, link names, blocked zoom and heading jumps", () => {
      const st = (h) => Object.fromEntries(a11yCheck(h).map((c) => [c.id, c.status]));
      const bad = st('<html><head><meta name="viewport" content="width=device-width, user-scalable=no"></head><body><h1>A</h1><h3>B</h3><img src="/a.jpg"><img src="/b.jpg" alt="IMG_2041.jpg"><a href="/x"><i class="icon"></i></a><a href="/y">Read more</a><button><svg></svg></button><input name="email" placeholder="Email"><iframe src="https://maps.example/"></iframe></body></html>');
      const good = st('<html lang="en-GB"><head><title>Hi</title></head><body><a href="#main">Skip to content</a><main id="main"><h1>A</h1><h2>B</h2><img src="/a.jpg" alt="Our van"><label for="e">Email</label><input id="e"><button aria-label="Open menu"></button></main></body></html>');
      return bad.lang === "fail" && bad.title === "fail" && bad.zoom === "fail" && bad.alt === "fail" && bad.altq === "warn" && bad.linkname === "fail" && bad.vague === "warn" && bad.button === "fail" && bad.labels === "fail" && bad.headings === "warn" && bad.iframe === "fail"
        && ["lang", "title", "zoom", "alt", "linkname", "button", "labels", "headings", "main", "skip"].every((k) => good[k] === "pass") && !good.altq && !good.vague; }],
    ["google updates: rolling-out banner, durations, other problems; honest fallback", () => {
      const p = parseIncidents(GSD_FIXTURE), h = updatesHtml(p, Date.parse("2026-10-12T12:00:00Z"));
      return p.ranking.length === 2 && p.ranking[0].kind === "Core update" && p.ranking[1].days === 14 && p.other[0].service === "Indexing"
        && /Rolling out now:<\/strong> October 2026 core update/.test(h) && /Still rolling out/.test(h) && /Delays indexing/.test(h) && /couldn't read/.test(updatesHtml(null)) && /couldn't read/.test(updatesHtml(parseIncidents("nonsense"))); }],
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
  { name: "Rank tracker – sample data", path: "/rank-tracker", click: "#rk-demo", expect: ["#rk-out", /page two[\s\S]*emergency plumber blackpool[\s\S]*▲/i] },
  { name: "Rank tracker – pasted table", path: "/rank-tracker", fill: [["rk-paste", "Top queries\tClicks\tImpressions\tCTR\tPosition\nboiler service preston\t4\t300\t1.3%\t12.4"], ["rk-site", "test.co.uk"]], click: "#rk-go", expect: ["#rk-out", /boiler service preston[\s\S]*12\.4/] },
  { name: "SEO content editor", path: "/seo-content-editor", fill: [["ce-kw", "free seo check"], ["ce-comp", "xkey.co.uk\nxkey.co.uk/website-audit"], ["ce-title", "Free SEO Check for UK Small Businesses"], ["#ce-ed", "A free SEO check shows what to fix. Run a free seo check today and see your score."]], click: "#ce-load", expect: ["#ce-out", /Content score[\s\S]*Related terms/], timeout: 30000 },
  { name: "Toxic backlink checker", path: "/toxic-backlink-checker", fill: [["ba-url", "smithplumbing.co.uk"]], click: "#ba-form button[type=submit]", expect: ["#ba-out", /Backlink audit[\s\S]*bbc\.co\.uk[\s\S]*Disavow/] },
  { name: "Competitor ad checker", path: "/competitor-ads-checker", fill: [["ad-url", "xkey.co.uk"]], click: "#ad-form button[type=submit]", expect: ["#ad-out", /advertising tags|Transparency Centre/], timeout: 30000 },
  { name: "Brand monitoring", path: "/brand-monitoring", fill: [["bm-brand", "XKey"], ["bm-site", "xkey.co.uk"]], click: "#bm-form button[type=submit]", expect: ["#bm-out", /Google Alert[\s\S]*Audit the sites/] },
  { name: "Uptime monitor", path: "/uptime-monitor", fill: [["up-url", "xkey.co.uk"]], click: "button[type=submit]", nav: /\/uptime\//, expect: ["main", /\bUp\b[\s\S]*Last checked[\s\S]*ms/], timeout: 30000 },
  { name: "Website analytics", path: "/website-analytics", fill: [["an-url", "shop.co.uk"]], click: "button[type=submit]", nav: /\/analytics\//, expect: ["#an-dash", /Live now[\s\S]*Top pages/], timeout: 15000 },
  { name: "WordPress plugin download", path: "/wordpress-seo-plugin", attr: ["a[download]", "href", /xkey-seo-fixer\.zip$/] },
  { name: "UK business directories – live authority", path: "/uk-business-directories", routes: [[/\/api\/authority/, (u) => ({ results: u.searchParams.get("d").split(",").map((d) => ({ input: d, domain: d, found: d === "yell.com", authority: 61 })) })]], expect: ["td[data-d='yell.com']", /^61$/] },
  { name: "Redirect map generator", path: "/redirect-map-generator", fill: [["rm-in", "/old-page.html\t/new-page\n/new-page\t/final"]], expect: ["#rm-out", /RewriteRule \^old-page\\\.html\$ \/new-page \[R=301,L\]/] },
  { name: "Redirect map – chain warning", path: "/redirect-map-generator", fill: [["rm-in", "/a\t/b\n/b\t/c"]], expect: ["#rm-notes", /chain/] },
  { name: "SEO ROI calculator", path: "/seo-roi-calculator", fill: [["roi-vol", "1000"], ["roi-now", "0"], ["roi-pos", "1"], ["roi-conv", "5"], ["roi-close", "50"], ["roi-val", "100"], ["roi-cost", "100"]], expect: ["#roi-out", /280[\s\S]*extra visits[\s\S]*14\.0[\s\S]*£700[\s\S]*600%/] },
  { name: "QR code generator", path: "/qr-code-generator", fill: [["qr-text", "https://smithplumbing.co.uk/contact"]], expect: ["#qr-out", /Download PNG[\s\S]*Download SVG/], attr: ["#qr-out svg path", "d", /^M\d+ \d+h1v1h-1z(M\d+ \d+h1v1h-1z){200,}$/] },
  { name: "Google review link generator", path: "/google-review-link-generator", fill: [["rv-id", "ChIJN1t_tDeuEmsRUsoyG83frY4"], ["rv-name", "Smith Plumbing"]], expect: ["#rv-out", /Smith Plumbing[\s\S]*Please leave us a Google review[\s\S]*Download QR code/], attr: ["#rv-link", "value", /^https:\/\/search\.google\.com\/local\/writereview\?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4$/] },
  { name: "Google review link – bad input", path: "/google-review-link-generator", fill: [["rv-id", "my shop"]], expect: ["#rv-out", /doesn't look like a Place ID/] },
  { name: "Image compressor – PNG to WebP", path: "/image-compressor", files: [["ic-file", { name: "banner.png", mimeType: "image/png", buffer: Buffer.from(OG_PNG, "base64") }]], expect: ["#ic-out", /banner\.png[\s\S]*1200×630[\s\S]*Download/], attr: ["#ic-out a[download]", "download", /^banner(-min\.webp|\.png)$/] },
  { name: "Privacy policy generator", path: "/privacy-policy-generator", fill: [["pp-name", "Smith Plumbing Ltd"], ["pp-email", "hello@smithplumbing.co.uk"]], expect: ["#pp-preview", /Smith Plumbing Ltd is the controller[\s\S]*hello@smithplumbing\.co\.uk[\s\S]*Information Commissioner/] },
  { name: "Website report – search to report", path: "/website-report", fill: [["sr-d", "https://www.example.com/about"]], click: "main form button[type=submit]", nav: /\/site\/example\.com$/, expect: ["main", /authority[\s\S]*3[\s\S]*websites link to it[\s\S]*wikipedia\.org[\s\S]*registered on 14 August 1995/i] },
  { name: "Website report – hosting and technology on request", path: "/site/smithplumbing.co.uk", click: "#sr-live", routes: [[/\/api\/hosting/, () => ({ name: "smithplumbing.co.uk", exists: true, provider: "Krystal Hosting Ltd", how: "From the owner of the site's IP address in the internet registry.", ips: [] })], [/\/api\/tech/, () => ({ tech: [{ name: "WordPress", cat: "cms" }, { name: "Google Analytics 4", cat: "analytics" }], groups: [["cms", "Website builder or CMS"], ["analytics", "Analytics"]], notes: [] })]], expect: ["#sr-out", /Krystal Hosting Ltd[\s\S]*WordPress[\s\S]*Google Analytics 4/] },
  { name: "Backlink checker – links to the website report", path: "/backlink-checker", fill: [["bl-d", "smithplumbing.co.uk"]], click: "#bl-form button[type=submit]", expect: ["#bl-out a[href='/site/smithplumbing.co.uk']", /Full website report/] },
  { name: "Backlink checker", path: "/backlink-checker", fill: [["bl-d", "https://www.smithplumbing.co.uk/contact"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /3[\s\S]*websites link to it[\s\S]*bbc\.co\.uk/] },
  { name: "Backlink checker – link gap", path: "/backlink-checker", fill: [["bl-d", "smithplumbing.co.uk"], ["bl-vs", "rival.co.uk"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /2 websites link to rival\.co\.uk but not to you[\s\S]*wikipedia\.org[\s\S]*localpaper\.co\.uk/] },
  { name: "Backlink checker – .com", path: "/backlink-checker", fill: [["bl-d", "https://www.example.com/about"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /example\.com[\s\S]*3[\s\S]*websites link to it[\s\S]*wikipedia\.org/] },
  { name: "Backlink checker – .com.au vs .co.uk", path: "/backlink-checker", fill: [["bl-d", "blog.shop.com.au"], ["bl-vs", "smithplumbing.co.uk"]], click: "#bl-form button[type=submit]", expect: ["#bl-out", /shop\.com\.au[\s\S]*2 websites link to smithplumbing\.co\.uk but not to you[\s\S]*bbc\.co\.uk/] },
  { name: "Backlink checker – opened from a link", path: "/backlink-checker?d=rival.co.uk", expect: ["#bl-out", /rival\.co\.uk[\s\S]*4[\s\S]*websites link to it/] },
  { name: "Domain authority checker", path: "/domain-authority-checker", fill: [["da-urls", "smithplumbing.co.uk\nhttps://www.wikipedia.org/\nnothing.co.uk"]], click: "#da-form button[type=submit]", expect: ["#da-out", /smithplumbing\.co\.uk[\s\S]*33[\s\S]*#5[\s\S]*wikipedia\.org[\s\S]*100[\s\S]*#1[\s\S]*No links found[\s\S]*Download CSV/] },
  { name: "Domain authority checker – 25 sites in batches", path: "/domain-authority-checker", fill: [["da-urls", Array.from({ length: 24 }, (_, i) => `site${i}.co.uk`).concat("bbc.co.uk").join("\n")]], click: "#da-form button[type=submit]", expect: ["#da-out", /bbc\.co\.uk[\s\S]*#2[\s\S]*Sort by authority/] },
  { name: "Broken link checker – whole site", path: "/broken-link-checker", fill: [["lk-url", "xkey.co.uk"]], select: [["lk-max", "50"], ["lk-ext", "0"]], click: "#lk-form button[type=submit]", expect: ["#lk-out", /Finished\. Crawled 50 pages[\s\S]*No broken links found/], timeout: 120000 },
  { name: "DNS lookup", path: "/dns-lookup", fill: [["dn-d", "smithplumbing.co.uk"]], click: "#dn-form button[type=submit]", expect: ["#dn-out", /smithplumbing\.co\.uk[\s\S]*DNSSEC signed[\s\S]*SPF is set up[\s\S]*MX[\s\S]*10 mail\.smithplumbing\.co\.uk[\s\S]*_dmarc\.smithplumbing\.co\.uk[\s\S]*v=DMARC1/] },
  { name: "Website down checker", path: "/website-down-checker", fill: [["ud-url", "xkey.co.uk"]], click: "#ud-form button[type=submit]", expect: ["#ud-out", /It's up[\s\S]*Status 200/] },
  { name: "Website down checker – a 404 page", path: "/website-down-checker?url=https://xkey.co.uk/no-such-page", expect: ["#ud-out", /this page isn't[\s\S]*404/] },
  { name: "Open Graph checker", path: "/open-graph-checker", fill: [["oc-url", "xkey.co.uk"]], click: "#oc-form button[type=submit]", expect: ["#oc-out", /XKEY\.CO\.UK[\s\S]*og:title is set[\s\S]*og:title/] },
  { name: "Open Graph checker – missing tags", path: "/open-graph-checker?url=example.co.uk", routes: [[/\/api\/meta/, () => ({ url: "https://example.co.uk/", status: 200, title: "Example", metas: [{ key: "description", content: "Hi" }], links: [] })]], expect: ["#oc-out", /No og:image[\s\S]*No Open Graph/] },
  { name: "Hreflang checker – none", path: "/hreflang-checker", fill: [["hl-url", "xkey.co.uk"]], click: "#hl-form button[type=submit]", expect: ["#hl-out", /No hreflang tags/] },
  { name: "Hreflang checker – codes and return links", path: "/hreflang-checker?url=shop.example.com/en-gb/", timeout: 12000, routes: [[/\/api\/meta/, (u) => {
      const at = u.searchParams.get("url"), L = (h, x) => ({ rel: "alternate", hreflang: h, href: "https://shop.example.com/" + x });
      if (/en-gb/.test(at)) return { url: "https://shop.example.com/en-gb/", status: 200, title: "GB", metas: [], links: [L("en-GB", "en-gb/"), L("en-UK", "uk/"), L("fr-FR", "fr/"), L("de", "de/")] };
      if (/\/fr/.test(at)) return { url: "https://shop.example.com/fr/", status: 200, metas: [], links: [L("fr-FR", "fr/"), L("en-GB", "en-gb/")] };
      if (/\/de/.test(at)) return { url: "https://shop.example.com/de/", status: 200, metas: [], links: [L("de", "de/")] };
      return { url: "https://shop.example.com" + new URL("https://" + at).pathname, status: 404, metas: [], links: [] }; }]],
    expect: ["#hl-out", /UK, but the country code[\s\S]*No x-default[\s\S]*2 of 3 alternate pages[\s\S]*fr-FR[\s\S]*Yes[\s\S]*de[\s\S]*No – add a tag/] },
  { name: "DNS propagation checker", path: "/dns-propagation-checker", fill: [["dp-d", "xkey.co.uk"]], click: "#dp-form button[type=submit]", expect: ["#dp-out", /8 of 9 DNS services[\s\S]*Your name server[\s\S]*ada\.ns\.cloudflare\.com[\s\S]*192\.0\.2\.30[\s\S]*NextDNS[\s\S]*192\.0\.2\.99[\s\S]*Different[\s\S]*AliDNS[\s\S]*No answer/] },
  { name: "DNS propagation checker – MX from a link", path: "/dns-propagation-checker?d=smithplumbing.co.uk&t=mx", expect: ["#dp-out", /MX records for smithplumbing\.co\.uk[\s\S]*All 9 DNS services[\s\S]*10 mail\.smithplumbing\.co\.uk/] },
  { name: "Reverse DNS lookup", path: "/reverse-dns-lookup", fill: [["pt-q", "192.0.2.10 xkey.co.uk"]], click: "#pt-form button[type=submit]", expect: ["#pt-out", /1 address has no reverse DNS[\s\S]*1 address has a reverse DNS name[\s\S]*server12\.krystal\.uk[\s\S]*Yes[\s\S]*192\.0\.2\.30[\s\S]*xkey\.co\.uk[\s\S]*none/] },
  { name: "Meta tag checker", path: "/meta-tag-checker", fill: [["mc-url", "xkey.co.uk"]], click: "#mc-form button[type=submit]", expect: ["#mc-out", /xkey\.co\.uk[\s\S]*Title: \d+ characters[\s\S]*Every meta tag[\s\S]*viewport/] },
  { name: "Meta tag checker – problems", path: "/meta-tag-checker?url=example.co.uk", routes: [[/\/api\/meta/, () => ({ url: "https://example.co.uk/", status: 200, title: "Home", lang: "", metas: [{ key: "robots", content: "noindex, nofollow" }, { key: "keywords", content: "a,b" }, { key: "description", content: "One" }, { key: "description", content: "Two" }], links: [] })]], expect: ["#mc-out", /Home[\s\S]*title is short[\s\S]*2 meta descriptions[\s\S]*noindex[\s\S]*No viewport[\s\S]*No canonical[\s\S]*No language[\s\S]*meta keywords/] },
  { name: "Website hosting checker", path: "/website-hosting-checker", fill: [["ho-d", "xkey.co.uk"]], click: "#ho-form button[type=submit]", expect: ["#ho-out", /Hosted by Cloudflare[\s\S]*192\.0\.2\.30[\s\S]*CLOUDFLARENET/] },
  { name: "Website hosting checker – opened from a link", path: "/website-hosting-checker?d=xkey.co.uk", expect: ["#ho-out", /192\.0\.2\.30/] },
  { name: "Accessibility checker", path: "/accessibility-checker", fill: [["a11-url", "xkey.co.uk"]], click: "#a11-form button[type=submit]", expect: ["#a11-out", /out of 100[\s\S]*passed[\s\S]*Page language/] },
  { name: "Google algorithm updates – live list", path: "/google-algorithm-updates", expect: ["main", /Rolling out now:[\s\S]*October 2026 core update[\s\S]*September 2026 spam update[\s\S]*14 days/] },
  { name: "SEO course – ticks are saved", path: "/learn-seo", click: "main .ls-tasks input", expect: ["#ls-progress", /1 of \d+ tasks done/] },
  { name: "Website technology checker", path: "/website-technology-checker", fill: [["tc-url", "xkey.co.uk"]], click: "#tc-form button[type=submit]", expect: ["#tc-out", /technolog[\s\S]*Email provider[\s\S]*Google Workspace[\s\S]*DNS provider[\s\S]*Cloudflare[\s\S]*Google Search Console/] },
  { name: "Website technology checker – opened from a link", path: "/website-technology-checker?url=xkey.co.uk", expect: ["#tc-out", /Cloudflare/] },
  { name: "SSL checker", path: "/ssl-checker", fill: [["sl-d", "xkey.co.uk"]], click: "#sl-form button[type=submit]", expect: ["#sl-out", /Secure[\s\S]*loads over https[\s\S]*Google Trust Services[\s\S]*\*\.xkey\.co\.uk/] },
  { name: "MX lookup", path: "/mx-lookup", fill: [["em-d", "xkey.co.uk"]], click: "#em-form button[type=submit]", expect: ["#em-out", /1 mail server[\s\S]*smtp\.google\.com[\s\S]*Google Workspace[\s\S]*SPF:[\s\S]*SPF checker/] },
  { name: "SPF checker", path: "/spf-checker?d=toomany.co.uk", expect: ["#em-out", /SPF has problems[\s\S]*11 DNS lookups[\s\S]*11 \/ 10[\s\S]*s11\.toomany\.co\.uk/] },
  { name: "DMARC checker", path: "/dmarc-checker", fill: [["em-d", "https://shop.xkey.co.uk/basket"]], click: "#em-form button[type=submit]", expect: ["#em-out", /DMARC is set up[\s\S]*the one on xkey\.co\.uk applies[\s\S]*Policy for subdomains/] },
  { name: "DKIM checker – common selectors", path: "/dkim-checker", fill: [["em-d", "smithplumbing.co.uk"]], click: "#em-form button[type=submit]", expect: ["#em-out", /1 DKIM key found[\s\S]*2048-bit RSA[\s\S]*Selectors tried/] },
  { name: "DKIM checker – with a selector, from a link", path: "/dkim-checker?d=xkey.co.uk&s=selector1", expect: ["#em-out", /1024-bit RSA/] },
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
    // routes: [[RegExp, (url) => json]] answers API calls in the browser with fake data (for pages we can't host locally)
    for (const [re, fn] of s.routes || []) await page.route(re, (r) => r.fulfill({ json: fn(new URL(r.request().url())) }));
    await page.goto(site.url + s.path, { waitUntil: "load" });
    for (const [id, value] of s.fill || []) {
      const el = page.locator(/[\s\[>#.=]/.test(id) ? id : "#" + id).first();
      if (!(await el.count())) { problem = `field ${id} not found`; break; }
      await el.fill(value);
    }
    for (const [id, value] of s.select || []) await page.selectOption("#" + id, value);
    for (const [id, file] of s.files || []) await page.setInputFiles("#" + id, file);
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
