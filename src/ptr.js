// Reverse DNS: the PTR (hostname) record of IP addresses, checked forward (does that hostname point back
// to the same IP?). A domain name is looked up first and each of its addresses checked.
import { dnsName, query } from "./dns.js";
import { ptrName, v6big } from "./hosting.js";

const V4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const isV6 = (s) => /^[0-9a-f:]+$/i.test(s) && s.includes(":") && (() => { try { new URL(`http://[${s}]/`); return true; } catch { return false; } })();
const same = (a, b) => a.includes(":") && b.includes(":") ? v6big(a) === v6big(b) : a === b;

async function lookup(env, ip) {
  const out = { ip, version: ip.includes(":") ? 6 : 4, ptr: [], confirmed: false };
  const r = await query(env, ptrName(ip), "PTR");
  out.ptr = r.answers.filter((a) => a.type === "PTR").map((a) => a.data.replace(/\.$/, "").toLowerCase()).slice(0, 5);
  for (const host of out.ptr) {
    const f = await query(env, host, out.version === 6 ? "AAAA" : "A").catch(() => null);
    const ips = f ? f.answers.filter((a) => a.type === (out.version === 6 ? "AAAA" : "A")).map((a) => a.data) : [];
    if (ips.some((x) => same(x, ip))) { out.confirmed = true; out.confirmedBy = host; break; }
    out.forward = ips.slice(0, 4);
  }
  return out;
}

/** GET /api/ptr?q=192.0.2.10&q=example.co.uk (≤10 entries, ≤20 addresses) */
export async function ptrApi(env, params) {
  const inputs = params.getAll("q").flatMap((x) => x.split(/[\s,]+/)).map((x) => x.trim().replace(/^\[|\]$/g, "")).filter(Boolean).slice(0, 10);
  if (!inputs.length) return { status: 400, body: { error: "Enter an IP address or a domain name." } };
  const results = [];
  try {
    for (const inp of inputs) {
      if (V4.test(inp) || isV6(inp.toLowerCase())) { results.push(await lookup(env, inp.toLowerCase())); continue; }
      let name; try { name = dnsName(inp); } catch { results.push({ input: inp, error: "That isn't an IP address or a domain name." }); continue; }
      const [a, aaaa] = await Promise.all([query(env, name, "A"), query(env, name, "AAAA")]);
      const ips = [...a.answers.filter((x) => x.type === "A").slice(0, 3), ...aaaa.answers.filter((x) => x.type === "AAAA").slice(0, 1)].map((x) => x.data);
      if (!ips.length) { results.push({ input: inp, domain: name, error: a.nx ? "That domain doesn't exist." : "That domain has no IP address." }); continue; }
      for (const ip of ips) { if (results.length >= 20) break; results.push({ ...(await lookup(env, ip)), domain: name }); }
    }
  } catch { return { status: 502, body: { error: "The DNS servers didn't answer – please try again." } }; }
  return { status: 200, body: { results } };
}
