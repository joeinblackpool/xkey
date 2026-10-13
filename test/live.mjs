// Checks against the real internet (not part of test/all.mjs, which runs offline):
//   node test/live.mjs registries   – src/whois.js against real registries (RDAP, and WHOIS on port 43 via node:net)
//   node test/live.mjs dns          – src/propagation.js and src/ptr.js against real DNS services and name servers
//   node test/live.mjs site         – the live xkey.co.uk APIs (backlinks … ssl, email, whois) and every sitemap page
// Run by .github/workflows/live-check.yml. Exits 1 if anything looks wrong.
import net from "node:net";
import { whoisApi } from "../src/whois.js";
import { propagationApi } from "../src/propagation.js";
import { ptrApi } from "../src/ptr.js";

const fails = [];
const check = (name, ok, info) => { console.log(`${ok ? " ok " : "FAIL"}  ${name}${info ? "  " + info : ""}`); if (!ok) fails.push(name); };

const tcp = (host, query) => new Promise((ok, no) => {
  let out = ""; const s = net.connect(43, host, () => s.write(query + "\r\n"));
  s.setTimeout(10000, () => { s.destroy(); no(new Error("timeout")); });
  s.on("data", (d) => { out += d; }); s.on("end", () => ok(out)); s.on("error", no);
});

if (process.argv.includes("registries")) {
  const env = { WHOIS_TCP: tcp }, ctx = { waitUntil() {} };
  const get = async (d) => (await whoisApi(env, ctx, new URLSearchParams({ d }))).body.results;
  const rows = [
    ...(await get("bbc.co.uk,github.com,wikipedia.org,google.com.au,nominet.uk,python.org,google.ai,shop.app")),
    ...(await get("google.de,rte.ie,repubblica.it,europa.eu,nic.io,google.co,google.us,microsoft.nl")),
    ...(await get("this-domain-is-not-registered-xkey-12345.co.uk,this-domain-is-not-registered-xkey-12345.com,this-domain-is-not-registered-xkey-12345.ie")),
  ];
  for (const r of rows) console.log(JSON.stringify(r).slice(0, 400));
  const by = Object.fromEntries(rows.map((r) => [r.domain || r.input, r]));
  check("bbc.co.uk registered 1996 (Nominet RDAP)", /^199/.test(by["bbc.co.uk"].created || ""), by["bbc.co.uk"].created);
  check("github.com 2007 with registrar (Verisign RDAP)", /^2007/.test(by["github.com"].created || "") && !!by["github.com"].registrar, by["github.com"].registrar);
  check("wikipedia.org created", !!by["wikipedia.org"].created);
  check("rte.ie created (WHOIS fallback or RDAP)", !!(by["rte.ie"] && by["rte.ie"].created), by["rte.ie"] && (by["rte.ie"].source + " " + by["rte.ie"].created));
  check("google.de registered", by["google.de"] && by["google.de"].registered === true, by["google.de"] && by["google.de"].source);
  for (const d of ["this-domain-is-not-registered-xkey-12345.co.uk", "this-domain-is-not-registered-xkey-12345.com", "this-domain-is-not-registered-xkey-12345.ie"]) check(`${d} not registered`, by[d] && by[d].registered === false, by[d] && (by[d].error || ""));
  check("most lookups answered", rows.filter((r) => !r.error).length >= rows.length - 3, rows.filter((r) => r.error).map((r) => r.domain + ": " + r.error).join("; "));
}

if (process.argv.includes("dns")) {
  // DNS over TCP the way cloudflare:sockets does it on Workers
  const DNS_TCP = (host, q) => new Promise((ok, no) => {
    let got = Buffer.alloc(0); const s = net.connect(53, host, () => s.write(Buffer.concat([Buffer.from([q.length >> 8, q.length & 255]), Buffer.from(q)])));
    s.setTimeout(5000, () => { s.destroy(); no(new Error("timeout")); });
    s.on("data", (d) => { got = Buffer.concat([got, d]); if (got.length >= 2 && got.length >= 2 + got.readUInt16BE(0)) { s.destroy(); ok(new Uint8Array(got.subarray(2, 2 + got.readUInt16BE(0)))); } }); s.on("error", no);
  });
  const env = { DNS_TCP };
  for (const [d, t] of [["bbc.co.uk", "A"], ["github.com", "MX"], ["google.com", "TXT"], ["www.gov.uk", "CNAME"], ["this-domain-is-not-registered-xkey-12345.co.uk", "A"]]) {
    const r = (await propagationApi(env, new URLSearchParams({ d, t }))).body;
    console.log(d, t, JSON.stringify(r.expected), "authority:", r.authority && (r.authority.ok ? r.authority.label : r.authority.error));
    for (const x of r.resolvers) console.log("   ", x.label.padEnd(24), x.ok ? (x.match ? "same" : "DIFF " + x.key.replace(/\n/g, " | ")) : x.error + " (" + x.why + ")", x.ms + "ms");
    const ok = r.resolvers.filter((x) => x.ok);
    check(`propagation: ${d} ${t} – most services answer and agree`, ok.length >= 7 && ok.filter((x) => x.match).length >= ok.length - 2, `${ok.length} answered, ${ok.filter((x) => x.match).length} same`);
    if (t !== "CNAME") check(`propagation: ${d} – own name server answers`, !!(r.authority && r.authority.ok), r.authority ? r.authority.label + " " + (r.authority.error || "") : "none");
  }
  const p = (await ptrApi({}, new URLSearchParams({ q: "8.8.8.8 2001:4860:4860::8888 1.1.1.1" }))).body.results;
  console.log(JSON.stringify(p));
  check("ptr: 8.8.8.8 is dns.google and points back", p[0].ptr[0] === "dns.google" && p[0].confirmed);
  check("ptr: IPv6 2001:4860:4860::8888 is dns.google", p[1].ptr[0] === "dns.google" && p[1].confirmed);
}

if (process.argv.includes("site")) {
  const api = async (p) => { const r = await fetch("https://xkey.co.uk" + p, { headers: { "user-agent": "xkey live check" } }); return [r.status, await r.json().catch(() => ({}))]; };
  let [s, j] = await api("/api/backlinks?d=github.com");
  check("backlinks: github.com (.com)", s === 200 && j.you && j.you.found && j.you.refDomains > 100000, `${s} ${j.you && j.you.refDomains}`);
  [s, j] = await api("/api/backlinks?d=bbc.co.uk&vs=itv.com");
  check("backlinks: bbc.co.uk vs itv.com", s === 200 && j.you && j.you.found && j.them && j.them.found, String(s));
  [s, j] = await api("/api/authority?d=bbc.co.uk,github.com,nothing-xkey-12345.co.uk");
  const a = (j.results || []);
  check("authority: scores and global rank", s === 200 && j.ranks && a[0].authority > 50 && a[0].rank > 0 && a[1].rank > 0 && a[2].authority === 0, `${s} ${a.map((x) => x.authority + "/#" + x.rank).join(" ")}`);
  [s, j] = await api("/api/redirects?u=http://github.com&u=https://www.bbc.co.uk/news");
  const rr = j.results || [];
  check("redirects: http to https, and a normal page", s === 200 && rr[0] && rr[0].redirects >= 1 && rr[0].final.startsWith("https://github.com") && rr[1] && rr[1].status === 200, rr.map((r) => r.error || `${r.redirects} -> ${r.status} ${r.final}`).join("; "));
  [s, j] = await api("/api/headers?url=github.com");
  const last = j.hops ? j.hops[j.hops.length - 1] : {};
  check("headers: github.com", s === 200 && last.status === 200 && (last.headers || []).some(([k]) => k === "content-type"), `${s} ${last.status}`);
  [s, j] = await api("/api/links/page?url=https://www.bbc.co.uk/");
  check("links: reads a page's links", s === 200 && j.status === 200 && (j.links || []).length > 20, `${s} ${j.status} ${(j.links || []).length} links`);
  [s, j] = await api("/api/links/check?u=https://www.bbc.co.uk/&u=https://www.bbc.co.uk/this-page-does-not-exist-xkey");
  const lc = j.results || [];
  check("links: ok and 404", s === 200 && lc[0] && /ok|redirect/.test(lc[0].verdict) && lc[1] && lc[1].verdict === "broken", lc.map((r) => r.verdict + " " + r.status).join("; "));
  [s, j] = await api("/api/dns?d=bbc.co.uk");
  check("dns: bbc.co.uk records", s === 200 && j.exists && (j.records.A || []).length > 0 && (j.records.MX || []).length > 0 && (j.records.NS || []).length > 0, `${s} ${j.error || ""}`);
  [s, j] = await api("/api/tech?url=wordpress.org");
  const tk = (j.tech || []).map((t) => t.cat + ":" + t.name);
  check("tech: wordpress.org is WordPress, with DNS details", s === 200 && tk.includes("cms:WordPress") && tk.some((t) => t.startsWith("dns:")), `${s} ${j.error || ""} ${tk.join(", ")}`);
  [s, j] = await api("/api/hosting?d=bbc.co.uk");
  check("hosting: bbc.co.uk has IPs with owners", s === 200 && j.exists && (j.ips || []).length > 0 && j.ips.some((i) => i.org || i.network), `${s} ${j.error || ""} ${(j.ips || []).map((i) => i.ip + " " + (i.org || i.network)).join("; ")}`);
  [s, j] = await api("/api/meta?url=https://www.bbc.co.uk/");
  check("meta: bbc.co.uk has Open Graph tags", s === 200 && j.status === 200 && (j.metas || []).some((m) => m.key === "og:title"), `${s} ${j.status} ${j.error || ""}`);
  [s, j] = await api("/api/ssl?d=bbc.co.uk");
  check("ssl: bbc.co.uk is secure and redirects to https", s === 200 && j.secure && (j.checks || []).some((c) => /redirects to https/.test(c.text)), `${s} ${j.error || ""} cert ${j.cert ? j.cert.issuer + " " + j.cert.to : j.ctError ? "CT error" : "none"}`);
  [s, j] = await api("/api/propagation?d=bbc.co.uk&t=A");
  check("propagation: bbc.co.uk A from the live site", s === 200 && (j.resolvers || []).filter((x) => x.ok).length >= 7, `${s} ${j.error || ""} ${(j.resolvers || []).map((x) => x.ok ? (x.match ? "=" : "x") : "!").join("")} auth ${j.authority && j.authority.ok}`);
  [s, j] = await api("/api/ptr?q=8.8.8.8");
  check("ptr: 8.8.8.8 from the live site", s === 200 && j.results && j.results[0].confirmed, `${s} ${JSON.stringify(j).slice(0, 200)}`);
  [s, j] = await api("/api/onpage?url=https://www.bbc.co.uk/");
  check("onpage: bbc.co.uk headings, images and JSON-LD", s === 200 && j.status === 200 && (j.headings || []).length > 3 && (j.images || []).length > 3 && (j.jsonld || []).length > 0, `${s} ${j.status} ${j.error || ""} h ${(j.headings || []).length} img ${(j.images || []).length} ld ${(j.jsonld || []).length}`);
  [s, j] = await api("/api/email?d=bbc.co.uk");
  check("email: bbc.co.uk MX, SPF and DMARC", s === 200 && j.mx && j.mx.records.length > 0 && j.spf && j.spf.root && !j.spf.root.missing && j.dmarc && !!j.dmarc.record, `${s} ${j.error || ""} mx ${j.mx && j.mx.records.length} dmarc ${j.dmarc && j.dmarc.record}`);
  // every page in the sitemap loads with a title
  const sm = await (await fetch("https://xkey.co.uk/sitemap.xml")).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const bad = [];
  for (let i = 0; i < urls.length; i += 8) await Promise.all(urls.slice(i, i + 8).map(async (u) => { const r = await fetch(u, { headers: { "user-agent": "xkey live check" } }).catch(() => null); const h = r ? await r.text() : ""; if (!r || r.status !== 200 || !/<title>[^<]{10,}<\/title>/.test(h)) bad.push(`${u} ${r ? r.status : "no answer"}`); }));
  check(`pages: all ${urls.length} sitemap pages load with a title`, urls.length > 50 && !bad.length, bad.slice(0, 10).join("; "));
  [s, j] = await api("/api/whois?d=bbc.co.uk,github.com,rte.ie,google.de");
  const w = j.results || [];
  for (const r of w) console.log(JSON.stringify(r).slice(0, 300));
  check("whois: bbc.co.uk + github.com dates", s === 200 && /^199/.test(w[0].created || "") && /^2007/.test(w[1].created || ""), String(s));
  check("whois: WHOIS fallback on Cloudflare (rte.ie, google.de)", w[2] && !w[2].error && w[3] && !w[3].error, w.slice(2).map((r) => r.source + " " + (r.error || r.created)).join("; "));
}

console.log(fails.length ? `\n${fails.length} failed` : "\nAll live checks passed.");
process.exit(fails.length ? 1 : 0);
