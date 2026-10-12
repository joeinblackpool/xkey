// DNS lookup: a domain's A, AAAA, CNAME, MX, NS, TXT, CAA and SOA records from public DNS-over-HTTPS
// (Cloudflare 1.1.1.1, Google as a fallback), plus checks people actually need: does the site and its
// www version resolve, can it receive email, and are SPF and DMARC set up.
// Tests pass env.DNS_FETCH(url, init) -> Response.

export const DNS_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "CAA", "SOA"];
const CODE = { 1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 15: "MX", 16: "TXT", 28: "AAAA", 257: "CAA" };
const RESOLVERS = ["https://cloudflare-dns.com/dns-query", "https://dns.google/resolve"];

/** "https://www.Example.co.uk/page" -> "www.example.co.uk" */
export function dnsName(input) {
  let s = String(input || "").trim().toLowerCase();
  if (!s) throw new Error("Enter a domain name.");
  if (!/^[a-z]+:\/\//.test(s)) s = "http://" + s;
  let h; try { h = new URL(s).hostname.replace(/\.$/, ""); } catch { throw new Error("That doesn't look like a domain name."); }
  if (!/^([a-z0-9_]([a-z0-9_-]{0,61}[a-z0-9])?\.)+(xn--[a-z0-9-]+|[a-z]{2,63})$/.test(h) || h.length > 253) throw new Error("That doesn't look like a domain name.");
  return h;
}

async function query(env, name, type) {
  const f = env.DNS_FETCH || fetch;
  let last;
  for (const base of RESOLVERS) {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), 5000);
    try {
      const r = await f(`${base}?name=${encodeURIComponent(name)}&type=${type}&do=1`, { headers: { accept: "application/dns-json" }, signal: ac.signal });
      if (!r.ok) { last = new Error(`HTTP ${r.status}`); continue; }
      const j = await r.json();
      if (j.Status !== 0 && j.Status !== 3) { last = new Error(`DNS status ${j.Status}`); continue; } // 3 = name doesn't exist
      return { nx: j.Status === 3, ad: !!j.AD, answers: (j.Answer || []).map((a) => ({ name: String(a.name || "").replace(/\.$/, ""), type: CODE[a.type] || String(a.type), ttl: a.TTL, data: String(a.data || "") })) };
    } catch (e) { last = e; } finally { clearTimeout(t); }
  }
  throw last || new Error("No resolver answered");
}

const unquote = (s) => s.replace(/^"|"$/g, "").replace(/"\s+"/g, "");

/** Plain-English checks: [{ level: "fail"|"warn"|"ok"|"info", text }] */
export function dnsChecks(name, rec, www, dmarc) {
  const out = [], add = (level, text) => out.push({ level, text });
  const ofType = (t) => (rec[t] || []).filter((a) => a.type === t || (t === "A" && a.type === "CNAME"));
  const hasIp = (rec.A || []).some((a) => a.type === "A") || (rec.AAAA || []).some((a) => a.type === "AAAA");
  if (!hasIp) add("fail", `${name} has no A or AAAA record, so the website won't load at this address.`);
  else add("ok", `${name} points to a server, so the website can load.`);
  if (www) {
    if (!www.ok) add("warn", `${www.name} doesn't resolve. People who type www will get an error – add a record for it and redirect it to your main address.`);
    else add("ok", `${www.name} resolves too.`);
  }
  if (hasIp && !(rec.AAAA || []).some((a) => a.type === "AAAA")) add("info", "No IPv6 (AAAA) record. Not a problem for SEO, but some mobile networks prefer IPv6.");
  const mx = (rec.MX || []).filter((a) => a.type === "MX");
  if (!mx.length) add("info", "No MX records, so this domain can't receive email.");
  else if (mx.length === 1 && /^0\s+\.?$/.test(mx[0].data)) add("info", "A null MX record says this domain doesn't receive email.");
  else add("ok", `Receives email through ${mx.map((a) => a.data.split(/\s+/)[1] || a.data).map((h) => h.replace(/\.$/, "")).slice(0, 3).join(", ")}.`);
  const spf = (rec.TXT || []).filter((a) => a.type === "TXT").map((a) => unquote(a.data)).filter((t) => /^v=spf1\b/i.test(t));
  if (spf.length > 1) add("fail", `${spf.length} SPF records found. There must be only one, or receiving servers treat SPF as broken – merge them.`);
  else if (spf.length === 1) {
    if (/[+?]all\b|\sall\b/i.test(" " + spf[0]) && !/[-~]all\b/i.test(spf[0])) add("fail", "The SPF record allows any server to send email as you (+all or ?all). Use ~all or -all.");
    else add("ok", "SPF is set up: receiving servers can check who may send your email.");
  } else if (mx.length) add("warn", "No SPF record. Without one, your emails are more likely to land in spam and others can fake your address more easily.");
  const dm = dmarc ? dmarc.map(unquote).find((t) => /^v=DMARC1\b/i.test(t)) : null;
  if (dm) {
    const p = ((dm.match(/;\s*p\s*=\s*(\w+)/i) || [])[1] || "").toLowerCase();
    add(p === "none" ? "info" : "ok", p === "none" ? "DMARC is set to p=none: it reports problems but doesn't stop fake emails yet." : `DMARC is set up (p=${p || "?"}).`);
  } else if (mx.length || spf.length) add("warn", "No DMARC record at _dmarc." + name + ". Gmail and Yahoo expect one from anyone sending email in bulk.");
  if ((rec.CAA || []).some((a) => a.type === "CAA")) add("info", "CAA records limit which companies may issue SSL certificates for this domain.");
  return out;
}

/** GET /api/dns?d=example.co.uk */
export async function dnsApi(env, params) {
  let name; try { name = dnsName(params.get("d")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  try {
    const res = await Promise.all(DNS_TYPES.map((t) => query(env, name, t)));
    const rec = {}; DNS_TYPES.forEach((t, i) => { rec[t] = res[i].answers; });
    const nx = res.every((r) => r.nx);
    const ad = res.some((r) => r.ad);
    let www = null;
    if (!nx && !name.startsWith("www.")) { const w = await query(env, "www." + name, "A"); www = { name: "www." + name, ok: w.answers.length > 0, answers: w.answers }; }
    const dm = nx ? null : (await query(env, "_dmarc." + name, "TXT")).answers.filter((a) => a.type === "TXT").map((a) => a.data);
    return { status: 200, body: { name, exists: !nx, dnssec: ad, records: rec, www, dmarc: dm, checks: nx ? [{ level: "fail", text: `${name} doesn't exist in DNS. Check the spelling, or the domain may not be registered.` }] : dnsChecks(name, rec, www, dm) } };
  } catch (e) { return { status: 502, body: { error: "The DNS servers didn't answer – please try again." } }; }
}
