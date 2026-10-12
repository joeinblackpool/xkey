// DNS propagation: ask big public DNS services (DNS-over-HTTPS, RFC 8484 wire format) and the domain's own
// name server (DNS over TCP, port 53) for one record type, and say which answers match.
// Tests pass env.DOH_FETCH(url, init) -> Response and env.DNS_TCP(host, queryBytes) -> responseBytes.
import { dnsName, query } from "./dns.js";

export const PROP_TYPES = { A: 1, AAAA: 28, CNAME: 5, MX: 15, NS: 2, TXT: 16 };
const NAMES = Object.fromEntries(Object.entries(PROP_TYPES).map(([k, v]) => [v, k]));
export const RESOLVERS = [
  ["Cloudflare (1.1.1.1)", "United States", "https://cloudflare-dns.com/dns-query"],
  ["Google (8.8.8.8)", "United States", "https://dns.google/dns-query"],
  ["Quad9 (9.9.9.9)", "Switzerland", "https://dns.quad9.net/dns-query"],
  ["OpenDNS (Cisco)", "United States", "https://doh.opendns.com/dns-query"],
  ["AdGuard DNS", "Cyprus", "https://dns.adguard-dns.com/dns-query"],
  ["Mullvad DNS", "Sweden", "https://dns.mullvad.net/dns-query"],
  ["CIRA Canadian Shield", "Canada", "https://private.canadianshield.cira.ca/dns-query"],
  ["Control D", "Canada", "https://freedns.controld.com/p0"],
  ["DNS.SB", "Germany", "https://doh.dns.sb/dns-query"],
  ["AliDNS (Alibaba)", "China", "https://dns.alidns.com/dns-query"],
];

/** DNS query message for name/type; rd = recursion desired */
export function encodeQuery(name, type, rd = true) {
  const labels = name.split(".").filter(Boolean), out = [0, 0, rd ? 1 : 0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
  for (const l of labels) { const b = new TextEncoder().encode(l); out.push(b.length, ...b); }
  out.push(0, 0, PROP_TYPES[type] || 1, 0, 1);
  return new Uint8Array(out);
}

// eight 16-bit groups -> "2001:db8::1" (longest run of two or more zero groups shortened)
const v6text = (g) => {
  let best = [-1, 0];
  for (let i = 0; i < 8; i++) { let j = i; while (j < 8 && g[j] === 0) j++; if (j - i > best[1]) best = [i, j - i]; if (j > i) i = j; }
  const h = g.map((x) => x.toString(16));
  return best[1] < 2 ? h.join(":") : h.slice(0, best[0]).join(":") + "::" + h.slice(best[0] + best[1]).join(":");
};

/** { rcode, aa, answers: [{ type, ttl, data }] } from a DNS response message */
export function decodeAnswers(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf), v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (b.length < 12) throw new Error("short DNS answer");
  const name = (p) => { const parts = []; let jumps = 0; for (;;) { const n = b[p]; if (n === undefined) throw new Error("bad name"); if (n === 0) { p++; break; } if ((n & 0xc0) === 0xc0) { if (++jumps > 20) throw new Error("loop"); const q = ((n & 0x3f) << 8) | b[p + 1]; return [parts.concat(name(q)[0]).filter(Boolean).join("."), p + 2]; } parts.push(new TextDecoder().decode(b.subarray(p + 1, p + 1 + n))); p += n + 1; } return [parts.join("."), p]; };
  const flags = v.getUint16(2), qd = v.getUint16(4), an = v.getUint16(6);
  let p = 12;
  for (let i = 0; i < qd; i++) p = name(p)[1] + 4;
  const answers = [];
  for (let i = 0; i < an; i++) {
    p = name(p)[1];
    const type = v.getUint16(p), ttl = v.getUint32(p + 4), len = v.getUint16(p + 8), d = p + 10;
    let data = null;
    if (type === 1) data = [...b.subarray(d, d + 4)].join(".");
    else if (type === 28) data = v6text(Array.from({ length: 8 }, (_, k) => v.getUint16(d + 2 * k)));
    else if (type === 5 || type === 2) data = name(d)[0];
    else if (type === 15) data = v.getUint16(d) + " " + name(d + 2)[0];
    else if (type === 16) { const t = []; for (let q = d; q < d + len; q += b[q] + 1) t.push(new TextDecoder().decode(b.subarray(q + 1, q + 1 + b[q]))); data = t.join(""); }
    if (data !== null) answers.push({ type: NAMES[type] || String(type), ttl, data });
    p = d + len;
  }
  return { rcode: flags & 15, aa: !!(flags & 0x400), answers };
}

const b64url = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function viaDoh(env, url, name, type) {
  const f = env.DOH_FETCH || fetch, ac = new AbortController(), t = setTimeout(() => ac.abort(), 4000);
  try {
    const r = await f(`${url}?dns=${b64url(encodeQuery(name, type))}`, { headers: { accept: "application/dns-message" }, signal: ac.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return decodeAnswers(new Uint8Array(await r.arrayBuffer()));
  } finally { clearTimeout(t); }
}

async function viaTcp(env, host, name, type) {
  const q = encodeQuery(name, type, false);
  if (env.DNS_TCP) return decodeAnswers(await env.DNS_TCP(host, q));
  const { connect } = await import("cloudflare:sockets");
  const sock = connect({ hostname: host, port: 53 });
  const timer = new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 4000));
  const talk = (async () => {
    const w = sock.writable.getWriter(); const msg = new Uint8Array(q.length + 2); msg.set([q.length >> 8, q.length & 255]); msg.set(q, 2); await w.write(msg); w.releaseLock();
    const rd = sock.readable.getReader(); let got = new Uint8Array(0);
    for (;;) { const { value, done } = await rd.read(); if (value) { const n = new Uint8Array(got.length + value.length); n.set(got); n.set(value, got.length); got = n; } if (got.length >= 2 && got.length >= 2 + ((got[0] << 8) | got[1])) break; if (done) throw new Error("closed"); }
    return decodeAnswers(got.subarray(2, 2 + ((got[0] << 8) | got[1])));
  })();
  try { return await Promise.race([talk, timer]); } finally { try { sock.close(); } catch {} }
}

/** The domain's own name servers: NS of the name, or of its parent zones */
async function zoneServers(env, name) {
  const labels = name.split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    const zone = labels.slice(i).join("."), r = await query(env, zone, "NS").catch(() => null);
    const ns = r ? r.answers.filter((a) => a.type === "NS").map((a) => a.data.replace(/\.$/, "").toLowerCase()) : [];
    if (ns.length) return { zone, ns: ns.sort() };
  }
  return { zone: null, ns: [] };
}

const key = (answers, type) => answers.filter((a) => a.type === type).map((a) => a.data.toLowerCase().replace(/\.$/, "")).sort().join("\n");

/** GET /api/propagation?d=example.co.uk&t=A */
export async function propagationApi(env, params) {
  let name; try { name = dnsName(params.get("d")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  const type = (params.get("t") || "A").toUpperCase();
  if (!PROP_TYPES[type]) return { status: 400, body: { error: "Pick A, AAAA, CNAME, MX, NS or TXT." } };
  const run = async (fn) => { const t0 = Date.now(); try { const r = await fn(); return { ok: true, nx: r.rcode === 3, rcode: r.rcode, answers: r.answers, ms: Date.now() - t0 }; } catch (e) { return { ok: false, error: e.name === "AbortError" ? "No answer in time" : "No answer", ms: Date.now() - t0 }; } };
  const [pub, auth] = await Promise.all([
    Promise.all(RESOLVERS.map(([label, country, url]) => run(() => viaDoh(env, url, name, type)).then((r) => ({ label, country, ...r })))),
    (async () => {
      const { zone, ns } = await zoneServers(env, name);
      for (const host of ns.slice(0, 2)) {
        const ip = await query(env, host, "A").then((r) => (r.answers.find((a) => a.type === "A") || {}).data).catch(() => null);
        if (!ip) continue;
        const r = await run(() => viaTcp(env, ip, name, type));
        if (r.ok && r.rcode !== 5) return { label: host, zone, ...r };
      }
      return ns.length ? { label: ns[0], zone, ok: false, error: "The name server didn't answer us" } : null;
    })(),
  ]);
  for (const r of [...pub, auth].filter(Boolean)) if (r.ok) r.key = r.nx ? "(does not exist)" : key(r.answers, type) || "(no record)";
  const counts = {}; pub.filter((r) => r.ok).forEach((r) => { counts[r.key] = (counts[r.key] || 0) + 1; });
  const expected = auth && auth.ok ? auth.key : Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
  for (const r of pub) r.match = r.ok ? r.key === expected : null;
  return { status: 200, body: { name, type, expected, fromAuthority: !!(auth && auth.ok), authority: auth, resolvers: pub } };
}
