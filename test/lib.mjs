// Shared helpers for XKey's tests.
// - serve(): runs the Worker locally on a port with stand-ins for Cloudflare's Cache API, KV and
//   Workers AI, so every page, API and tool works offline. Checks of xkey.co.uk itself run
//   in-process (the Worker never fetches its own domain), so full SEO checks, audits and
//   comparisons can be tested without the internet.
// - need(name): loads a dev tool (playwright, esbuild) from the project, the global npm folder
//   or a known tools folder, with a clear message if it's missing.
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";

export async function need(name) {
  const tries = [];
  try { return await import(name); } catch (e) { tries.push(e.code || e.message); }
  const roots = [];
  try { roots.push(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim()); } catch {}
  roots.push("/opt/npm-tools/node_modules", "/usr/local/lib/node_modules", "/usr/lib/node_modules");
  for (const root of roots) {
    try {
      const req = createRequire(path.join(root, "noop.js"));
      const m = await import(pathToFileURL(req.resolve(name)).href);
      return m.default && typeof m.default === "object" ? { ...m.default, ...m } : m; // CommonJS packages put their exports on .default
    } catch {}
  }
  console.error(`\n${name} is needed for this test. Install it with:  npm i -g ${name}${name === "playwright" ? " && npx playwright install chromium" : ""}\n`);
  process.exit(2);
}

/** Start the Worker on `port`. Returns { url, close, env }. */
export async function serve(port = 8789, workerPath = "../src/index.js") {
  const store = new Map();
  globalThis.caches = { default: {
    async match(k) { const v = store.get(typeof k === "string" ? k : k.url); return v ? new Response(v.body, { status: v.status, headers: v.headers }) : undefined; },
    async put(k, r) { store.set(typeof k === "string" ? k : k.url, { body: await r.clone().arrayBuffer(), status: r.status, headers: [...r.headers] }); },
    async delete(k) { return store.delete(typeof k === "string" ? k : k.url); },
  } };
  const kv = new Map();
  const STATE = {
    get: async (k, t) => { const v = kv.get(k); return v == null ? null : t === "json" ? JSON.parse(v) : v; },
    put: async (k, v) => { kv.set(k, String(v)); }, delete: async (k) => { kv.delete(k); },
    list: async ({ prefix = "" } = {}) => ({ keys: [...kv.keys()].filter((n) => n.startsWith(prefix)).map((name) => ({ name })), list_complete: true }),
  };
  const AI = { run: async () => ({ response: JSON.stringify({
    titles: ["Emergency Plumber in Preston | 24/7, No Call-Out Fee", "Preston Plumber – Fixed Prices, Gas Safe", "24 Hour Plumber Preston | Fast Local Help"],
    descriptions: ["Emergency plumber in Preston for leaks, boilers and blocked drains. Gas Safe engineers, fixed prices and no call-out fee. Call today.", "Local Preston plumbers, 24 hours a day. Fixed prices and friendly, tidy engineers – get a free quote now.", "Fast, fixed-price plumbing across Preston and Lancashire. Leaks, boilers and drains sorted today."],
  }) }) };
  // Backlink index stand-in: the files build.py publishes (format 2), from test/fixtures/backlinks.
  const BL_DATA = blData("backlinks");
  const env = { STATE, AI, BL_DATA, ANALYTICS: await d1StandIn(), ...whoisStandIns(), DNS_FETCH: dnsStandIn(), CT_FETCH: ctStandIn() };
  const worker = (await import(new URL(workerPath, import.meta.url).href)).default;
  const server = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks);
    try {
      const r = await worker.fetch(new Request("https://xkey.co.uk" + req.url, { method: req.method, headers: req.headers, body }), env, { waitUntil() {}, passThroughOnException() {} });
      const h = Object.fromEntries(r.headers);
      if (h.location) h.location = h.location.replace("https://xkey.co.uk", "");
      res.writeHead(r.status, h); res.end(Buffer.from(await r.arrayBuffer()));
    } catch (e) { console.error("worker error on", req.url, e); res.writeHead(500); res.end(String(e && e.stack)); }
  });
  await new Promise((ok) => server.listen(port, ok));
  return { url: `http://localhost:${port}`, env, close: () => new Promise((ok) => server.close(ok)) };
}

/** Stand-in for the published backlink index: env.BL_DATA = { manifest(), file(name, [start, end]?) } (see src/backlinks.js). */
export function blData(dir) {
  const base = new URL(`./fixtures/${dir}/`, import.meta.url);
  const m = JSON.parse(fs.readFileSync(new URL("manifest.json", base), "utf8"));
  return { manifest: () => m, file: (name, r) => { const b = fs.readFileSync(new URL(name, base)); return new Uint8Array(r ? b.subarray(r[0], r[1] + 1) : b); } };
}

/** Stand-ins for the domain registries (see src/whois.js): RDAP over HTTPS for .com and .uk,
 *  WHOIS on port 43 for .de and .ie. `soon.co.uk` always expires in 20 days. */
export function whoisStandIns() {
  const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString();
  const rdap = {
    "example.com": { ldhName: "EXAMPLE.COM", status: ["client delete prohibited", "client transfer prohibited"], events: [{ eventAction: "registration", eventDate: "1995-08-14T04:00:00Z" }, { eventAction: "expiration", eventDate: "2027-08-13T04:00:00Z" }, { eventAction: "last changed", eventDate: "2026-08-14T07:01:39Z" }],
      entities: [{ roles: ["registrar"], publicIds: [{ type: "IANA Registrar ID", identifier: "376" }], vcardArray: ["vcard", [["version", {}, "text", "4.0"], ["fn", {}, "text", "RESERVED-Internet Assigned Numbers Authority"]]] }],
      nameservers: [{ ldhName: "A.IANA-SERVERS.NET" }, { ldhName: "B.IANA-SERVERS.NET" }], secureDNS: { delegationSigned: true } },
    "smithplumbing.co.uk": { events: [{ eventAction: "registration", eventDate: "2009-03-02T00:00:00Z" }, { eventAction: "expiration", eventDate: "2027-03-02T00:00:00Z" }],
      entities: [{ roles: ["registrant"], entities: [{ roles: ["registrar"], vcardArray: ["vcard", [["fn", {}, "text", "Tucows Inc"]]] }] }], nameservers: [{ ldhName: "ns1.example-host.co.uk" }], status: ["active"] },
    "xkey.co.uk": { events: [{ eventAction: "registration", eventDate: "2016-05-20T00:00:00Z" }, { eventAction: "expiration", eventDate: "2030-05-20T00:00:00Z" }], entities: [{ roles: ["registrar"], vcardArray: ["vcard", [["fn", {}, "text", "Test Registrar"]]] }] },
    "soon.co.uk": { events: [{ eventAction: "registration", eventDate: "2024-01-10T00:00:00Z" }, { eventAction: "expiration", eventDate: day(20) }], entities: [{ roles: ["registrar"], vcardArray: ["vcard", [["fn", {}, "text", "123 Reg"]]] }] },
  };
  const ipRdap = {
    "192.0.2.10": { handle: "NET-192-0-2-0-1", name: "KRYSTAL-UK", country: "GB", startAddress: "192.0.2.0", endAddress: "192.0.2.255", entities: [{ roles: ["abuse"], vcardArray: ["vcard", [["fn", {}, "text", "Abuse Desk"]]] }, { roles: ["registrant"], vcardArray: ["vcard", [["fn", {}, "text", "Krystal Hosting Ltd"]]] }] },
    "192.0.2.30": { handle: "NET-192-0-2-30", name: "CLOUDFLARENET", country: "US", startAddress: "192.0.2.0", endAddress: "192.0.2.255", entities: [{ roles: ["registrant"], vcardArray: ["vcard", [["fn", {}, "text", "Cloudflare, Inc."]]] }] },
    "2001:db8::10": { handle: "KRYSTAL-V6", name: "KRYSTAL-V6", country: "GB", startAddress: "2001:db8::", endAddress: "2001:db8:ffff:ffff:ffff:ffff:ffff:ffff", entities: [{ roles: ["administrative"], entities: [{ roles: ["registrant"], vcardArray: ["vcard", [["fn", {}, "text", "Krystal Hosting Ltd"]]] }] }] },
  };
  const WHOIS_FETCH = async (url) => {
    if (url === "https://data.iana.org/rdap/ipv4.json") return Response.json({ services: [[["192.0.0.0/8"], ["https://rdap.arin.net/registry/"]], [["198.51.0.0/16"], ["https://rdap.db.ripe.net/"]]] });
    if (url === "https://data.iana.org/rdap/ipv6.json") return Response.json({ services: [[["2001:db8::/32"], ["https://rdap.db.ripe.net/"]]] });
    const ip = url.split("/ip/")[1];
    if (ip) return ipRdap[ip] ? Response.json(ipRdap[ip]) : new Response("{}", { status: 404 });
    if (url === "https://data.iana.org/rdap/dns.json") return Response.json({ services: [[["com", "net"], ["https://rdap.verisign.com/com/v1/"]], [["uk"], ["https://rdap.nominet.uk/uk/"]]] });
    const d = url.split("/domain/")[1];
    return rdap[d] ? new Response(JSON.stringify(rdap[d]), { headers: { "content-type": "application/rdap+json" } }) : new Response("{}", { status: 404 });
  };
  const servers = { de: "whois.denic.de", ie: "whois.weare.ie" };
  const WHOIS_TCP = async (host, q) => {
    if (host === "whois.iana.org") return servers[q] ? `domain: ${q.toUpperCase()}\nwhois: ${servers[q]}\n` : `domain: ${q.toUpperCase()}\n`;
    if (host === "whois.denic.de") return q.endsWith("beispiel.de") ? "Domain: beispiel.de\nNserver: ns1.beispiel.de\nStatus: connect\nChanged: 2020-01-01T10:00:00+01:00\n" : "Domain: x.de\nStatus: free\n";
    if (host === "whois.weare.ie") return q === "smith.ie" ? "Domain Name: smith.ie\nRegistrar: Blacknight Solutions\nCreation Date: 12-March-2001\nRegistry Expiry Date: 2027-03-12T00:00:00Z\nName Server: ns1.blacknight.com\n" : "% No entries found for the selected source(s).\n";
    throw new Error("unexpected whois server " + host);
  };
  return { WHOIS_FETCH, WHOIS_TCP };
}

/** Stand-in for DNS-over-HTTPS (see src/dns.js): a tiny zone, answered in Cloudflare's JSON format. */
export function dnsStandIn() {
  const T = { A: 1, NS: 2, CNAME: 5, SOA: 6, PTR: 12, MX: 15, TXT: 16, AAAA: 28, CAA: 257 };
  const zone = {
    "smithplumbing.co.uk": { A: ["192.0.2.10"], AAAA: ["2001:db8::10"], MX: ["10 mail.smithplumbing.co.uk."], TXT: ['"v=spf1 include:_spf.google.com ~all"', '"google-site-verification=abc123"'], NS: ["ns1.host.co.uk."], SOA: ["ns1.host.co.uk. admin.host.co.uk. 2026101201 3600 600 604800 300"] },
    "www.smithplumbing.co.uk": { A: ["192.0.2.10"] },
    "_dmarc.smithplumbing.co.uk": { TXT: ['"v=DMARC1; p=none; rua=mailto:d@smithplumbing.co.uk"'] },
    "10.2.0.192.in-addr.arpa": { PTR: ["server12.krystal.uk."] },
    "xkey.co.uk": { A: ["192.0.2.30"], MX: ["1 smtp.google.com."], NS: ["ada.ns.cloudflare.com.", "bob.ns.cloudflare.com."], TXT: ['"v=spf1 include:_spf.google.com ~all"', '"google-site-verification=xyz789"'] },
    "badmail.co.uk": { A: ["192.0.2.20"], MX: ["10 mx.badmail.co.uk."], TXT: ['"v=spf1 a mx ~all"', '"v=spf1 include:sendgrid.net -all"'] },
    // email checks (src/email.js): SPF includes, DMARC on the parent, DKIM keys of 2048 and 1024 bits
    "mail.smithplumbing.co.uk": { A: ["192.0.2.11"] },
    "smtp.google.com": { A: ["192.0.2.40"] },
    "_spf.google.com": { TXT: ['"v=spf1 include:_netblocks.google.com ~all"'] },
    "_netblocks.google.com": { TXT: ['"v=spf1 ip4:192.0.2.0/24 ip6:2001:db8::/32 ~all"'] },
    "google._domainkey.smithplumbing.co.uk": { TXT: ['"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8Q/pvx6XZeQ0mhWPMBXv7R4HLmw5QxdeuSZdzHsPtuSPXR8HYeXPusGAJaENDayv4YFOktOtODGS0xndrA8tZeCQCnuJrtKfXY27bJGmvwbpH6Yjwd5of+IC5dTFxEGt67nxau87XDFneFFIZ/EwrCNlqruN" "8zMSkmCd/EeyyRPz0HndKhzcEiAprDWP3fVylYEWvUIpWjZQnVm8/PhGqWWnhrfcsue7ZPpgKMI6i4Kc+sUsn/Mv5TBHbieei1aHU+AgzyCsl+aoT7BDcn2Pl3CWVZr3gHDfczrVpw2W5FkbMVuXo8GAYGNXVwaiSqZxkMX6ZFA0d0rybJnNLjqI5wIDAQAB"'] },
    "selector1._domainkey.xkey.co.uk": { TXT: ['"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOX7sVgs/e+VlJDigQRLh2egsUg5KiSj6f+LTIyCtqZnRsfs7+JexoE/dCDWbWXDYb4l7tn4Q+3/PnuBQ31TlvkY2JLa+9uht4px8FLAvzcnB9u1wB59HiZC5kIvbCQ7X5+L2boYPoyxYQN7XsRM8dqdEDPShElDYC53f9V4GmPwIDAQAB"'] },
    "_dmarc.xkey.co.uk": { TXT: ['"v=DMARC1; p=reject; sp=quarantine; rua=mailto:dmarc@xkey.co.uk"'] },
    "shop.xkey.co.uk": { A: ["192.0.2.30"] },
    "toomany.co.uk": { MX: ["0 ."], TXT: ['"v=spf1 include:s1.toomany.co.uk include:s2.toomany.co.uk include:s3.toomany.co.uk include:s4.toomany.co.uk include:s5.toomany.co.uk include:s6.toomany.co.uk include:s7.toomany.co.uk include:s8.toomany.co.uk include:s9.toomany.co.uk include:s10.toomany.co.uk include:s11.toomany.co.uk +all"'] },
    "s1.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.1 -all"'] },
    "s2.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.2 -all"'] },
    "s3.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.3 -all"'] },
    "s4.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.4 -all"'] },
    "s5.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.5 -all"'] },
    "s6.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.6 -all"'] },
    "s7.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.7 -all"'] },
    "s8.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.8 -all"'] },
    "s9.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.9 -all"'] },
    "s10.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.10 -all"'] },
    "s11.toomany.co.uk": { TXT: ['"v=spf1 ip4:192.0.2.11 -all"'] },
  };
  return async (url) => {
    const u = new URL(url), name = u.searchParams.get("name"), type = u.searchParams.get("type");
    if (!zone[name] && !Object.keys(zone).some((k) => k.endsWith("." + name))) return Response.json({ Status: 3, AD: false });
    const data = (zone[name] && zone[name][type]) || [];
    return Response.json({ Status: 0, AD: name.startsWith("smith"), Answer: data.map((d) => ({ name: name + ".", type: T[type], TTL: 300, data: d })) });
  };
}

/** Stand-in for crt.sh's JSON (see src/ssl.js): a current and an expired certificate for xkey.co.uk,
 *  a wildcard one for smithplumbing.co.uk that expires in 5 days, slowlogs.co.uk only from Cert Spotter, and an error for down.co.uk. */
export function ctStandIn() {
  const day = (n) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 19);
  const certs = {
    "xkey.co.uk": [{ id: 2, issuer_name: "C=US, O=Google Trust Services, CN=WE1", name_value: "xkey.co.uk\n*.xkey.co.uk", not_before: day(-30), not_after: day(60) }, { id: 1, issuer_name: "C=US, O=Let's Encrypt, CN=R3", name_value: "xkey.co.uk", not_before: day(-120), not_after: day(-30) }],
    "smithplumbing.co.uk": [{ id: 3, issuer_name: "C=US, O=Let's Encrypt, CN=R11", name_value: "*.co.uk\nsmithplumbing.co.uk", not_before: day(-85), not_after: day(5) }],
  };
  // Cert Spotter (the fallback) knows slowlogs.co.uk, which crt.sh is too busy to answer for
  const spotter = { "slowlogs.co.uk": [{ id: "77", dns_names: ["slowlogs.co.uk", "www.slowlogs.co.uk"], issuer: { name: "C=US, O=Let's Encrypt, CN=E6" }, not_before: day(-10), not_after: day(80) }] };
  return async (url) => {
    const u = new URL(url);
    if (u.hostname === "api.certspotter.com") { const d = u.searchParams.get("domain"); return d === "down.co.uk" ? new Response("busy", { status: 503 }) : Response.json(spotter[d] || []); }
    const q = u.searchParams.get("q"); if (q === "down.co.uk" || q === "slowlogs.co.uk") return new Response("busy", { status: 502 }); return Response.json(certs[q] || []);
  };
}

/** Cloudflare D1 stand-in on Node's built-in SQLite (in memory): prepare/bind/first/all/run and batch. */
export async function d1StandIn() {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    all: async () => ({ results: db.prepare(sql).all(...args), success: true }),
    first: async () => db.prepare(sql).get(...args) ?? null,
    run: async () => { const p = db.prepare(sql); if (/\breturning\b/i.test(sql)) return { results: p.all(...args), success: true }; p.run(...args); return { results: [], success: true }; },
    _exec: () => (/^\s*(select|with)\b|\breturning\b/i.test(sql) ? { results: db.prepare(sql).all(...args) } : (db.prepare(sql).run(...args), { results: [] })),
  });
  return { prepare: (sql) => stmt(sql), batch: async (list) => { db.exec("BEGIN"); try { const r = list.map((s) => s._exec()); db.exec("COMMIT"); return r; } catch (e) { db.exec("ROLLBACK"); throw e; } } };
}
