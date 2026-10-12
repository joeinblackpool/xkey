// Email DNS checks for the MX lookup, SPF checker, DMARC checker and DKIM checker: one domain's MX
// servers (and their providers), its SPF record followed through every include with the DNS-lookup
// count, its DMARC policy tag by tag, and DKIM keys under the selector given or the common ones.
// DNS only: we can't see whether a particular email passes, only what the domain publishes.
// Tests pass env.DNS_FETCH (dnsStandIn() in test/lib.mjs).
import { dnsName, query } from "./dns.js";
import { emailProvider, spfSender } from "./tech.js";

const unquote = (s) => String(s).replace(/^"|"$/g, "").replace(/"\s*"/g, "");
const txts = async (env, name) => { const r = await query(env, name, "TXT"); return { nx: r.nx, list: r.answers.filter((a) => a.type === "TXT").map((a) => unquote(a.data)) }; };
const PUBLIC2 = /^(?:co|org|me|ltd|plc|net|ac|gov|nhs|sch|com|edu|gen)\.[a-z]{2}$/;
const parentOf = (name) => { const p = name.split(".").slice(1).join("."); return p.includes(".") && !PUBLIC2.test(p) ? p : null; };

// ---- MX
async function mxCheck(env, name) {
  const r = await query(env, name, "MX");
  const records = r.answers.filter((a) => a.type === "MX").map((a) => { const [pref, host = ""] = a.data.split(/\s+/); return { pref: Number(pref), host: host.replace(/\.$/, "").toLowerCase(), ttl: a.ttl }; }).sort((a, b) => a.pref - b.pref);
  const checks = [], add = (level, text) => checks.push({ level, text });
  if (records.length === 1 && (records[0].host === "" || records[0].host === ".")) { add("info", "A null MX record (0 .) says this domain doesn't receive email."); return { records: [], nullMx: true, checks }; }
  await Promise.all(records.slice(0, 5).map(async (m) => {
    m.provider = emailProvider(m.host);
    if (/^\d+\.\d+\.\d+\.\d+$/.test(m.host)) { m.resolves = false; return; }
    try {
      let ips = (await query(env, m.host, "A")).answers.filter((x) => x.type === "A");
      if (!ips.length) ips = (await query(env, m.host, "AAAA")).answers.filter((x) => x.type === "AAAA");
      m.ips = ips.map((x) => x.data).slice(0, 4); m.resolves = m.ips.length > 0;
    } catch { m.resolves = null; }
  }));
  if (!records.length) add(r.nx ? "fail" : "warn", r.nx ? `${name} doesn't exist in DNS.` : `No MX records, so ${name} can't receive email. If it should, add the MX records your email provider gives you.`);
  else {
    const providers = [...new Set(records.map((m) => m.provider).filter(Boolean))];
    add("ok", `${records.length} mail server${records.length > 1 ? "s" : ""}${providers.length ? ` (${providers.join(", ")})` : ""}, so ${name} can receive email.`);
    for (const m of records) {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(m.host)) add("fail", `The MX record points at an IP address (${m.host}). MX records must name a server, such as mail.${name}.`);
      else if (m.resolves === false) add("fail", `${m.host} doesn't resolve to an IP address, so email sent to it will fail.`);
    }
    if (records.length === 1 && !records[0].provider) add("info", "Only one mail server. If it goes down, senders retry for a while, but a backup MX (or a big provider) is safer.");
  }
  return { records, checks };
}

// ---- SPF
const DESC = { all: "everything else", include: "servers listed in this domain's SPF", a: "the domain's own A/AAAA address", mx: "the domain's mail servers", ip4: "this IPv4 address or range", ip6: "this IPv6 address or range", exists: "a custom DNS test", ptr: "reverse DNS (deprecated)", redirect: "use this domain's SPF instead", exp: "explanation text" };
const QUAL = { "+": "pass", "-": "fail", "~": "softfail", "?": "neutral" };

/** Parse one SPF record into terms: [{ q, type, value }] */
export function parseSpf(rec) {
  return rec.trim().split(/\s+/).slice(1).filter(Boolean).map((t) => {
    const m = t.match(/^([+\-~?]?)([a-z0-9]+)(?:[:=](.*))?$/i) || [, "", t, ""];
    let type = m[2].toLowerCase(), value = m[3] || "";
    if (!m[3] && /^(a|mx)\//i.test(t)) { type = t.split("/")[0].toLowerCase(); value = "/" + t.split("/").slice(1).join("/"); }
    return { q: m[1] || "+", type, value, known: type in DESC };
  });
}

async function spfCheck(env, name, budget = 14) {
  const errors = [];
  let lookups = 0;
  const walk = async (domain, depth, seen) => {
    const node = { domain, record: null, terms: [] };
    if (seen.has(domain)) { node.loop = true; errors.push(`${domain} is included more than once in a loop.`); return node; }
    seen = new Set(seen).add(domain);
    if (budget-- <= 0) { node.skipped = true; return node; }
    let t; try { t = await txts(env, domain); } catch { node.error = "DNS didn't answer"; return node; }
    const spf = t.list.filter((x) => /^v=spf1(\s|$)/i.test(x));
    node.count = spf.length;
    if (!spf.length) { node.missing = true; return node; }
    node.record = spf[0];
    node.terms = parseSpf(spf[0]);
    for (const term of node.terms) {
      if (/^(include|a|mx|ptr|exists|redirect)$/.test(term.type)) lookups++;
      term.sender = term.type === "include" ? spfSender(term.value) : null;
    }
    if (depth < 6) await Promise.all(node.terms.filter((x) => x.type === "include" || x.type === "redirect").map(async (x) => { if (x.value && !/%\{/.test(x.value)) x.child = await walk(x.value.toLowerCase().replace(/\.$/, ""), depth + 1, seen); }));
    return node;
  };
  const root = await walk(name, 0, new Set());
  const checks = [], add = (level, text) => checks.push({ level, text });
  if (root.error) { add("warn", "The DNS servers didn't answer – please try again."); return { root, lookups, checks }; }
  if (root.missing) { add("warn", `No SPF record on ${name}. Without one, your emails are more likely to land in spam and others can fake your address more easily. Your email provider gives you the record to add, starting v=spf1.`); return { root, lookups, checks }; }
  if (root.count > 1) add("fail", `${root.count} SPF records found. There must be only one, or receiving servers treat SPF as broken (permerror). Merge them into a single record.`);
  const all = root.terms.find((x) => x.type === "all"), redirect = root.terms.find((x) => x.type === "redirect");
  if (all && (all.q === "+" || all.q === "?")) add("fail", `The record ends in ${all.q === "+" ? "+all" : "?all"}, which lets any server in the world send email as ${name}. Use ~all or -all.`);
  else if (all && all.q === "~") add("ok", "Ends in ~all (softfail): email from servers not listed is accepted but marked suspicious. Fine, and -all is stricter once you're sure every sender is listed.");
  else if (all && all.q === "-") add("ok", "Ends in -all: email from servers not listed should be rejected. The strongest setting.");
  else if (!redirect) add("warn", "The record has no 'all' at the end, so servers not listed get a neutral result. Finish it with ~all or -all.");
  if (lookups > 10) add("fail", `${lookups} DNS lookups. SPF allows at most 10, so receiving servers stop checking and SPF fails (permerror). Remove senders you no longer use, or replace includes with ip4: ranges.`);
  else add(lookups >= 9 ? "warn" : "ok", `${lookups} of the 10 DNS lookups SPF allows${lookups >= 9 ? " – close to the limit, so adding one more sender could break it" : ""}.`);
  const bad = [], walkErr = (n) => { for (const x of n.terms) { if (x.child) { if (x.child.missing) bad.push(x.value); walkErr(x.child); } } };
  walkErr(root);
  if (bad.length) add("fail", `${bad.slice(0, 3).join(", ")} ${bad.length > 1 ? "have" : "has"} no SPF record, so the include fails and SPF breaks (permerror). Remove it or fix the address.`);
  for (const e of errors.slice(0, 2)) add("fail", e);
  if (root.terms.some((x) => x.type === "ptr")) add("warn", "The record uses ptr, which is slow and deprecated. Many receivers ignore it – list the servers with ip4:, ip6: or include: instead.");
  const unknown = root.terms.filter((x) => !x.known);
  if (unknown.length) add("warn", `Unknown term${unknown.length > 1 ? "s" : ""}: ${unknown.map((x) => x.type).slice(0, 3).join(", ")}. Check for typos – a mistake can make the whole record invalid.`);
  if (root.record.length > 450) add("info", `The record is ${root.record.length} characters long. Long records must be split into strings of 255 characters or fewer inside the TXT record.`);
  return { root, lookups, checks };
}

// ---- DMARC
/** "v=DMARC1; p=reject; rua=mailto:a@b" -> { v, p, rua, ... } */
export function parseDmarc(rec) {
  const tags = {};
  for (const part of rec.split(";")) { const m = part.trim().match(/^([a-z]+)\s*=\s*(.*)$/i); if (m) tags[m[1].toLowerCase()] = m[2].trim(); }
  return tags;
}

async function dmarcCheck(env, name) {
  let at = name, t = await txts(env, "_dmarc." + name);
  let recs = t.list.filter((x) => /^v=DMARC1\s*(;|$)/i.test(x));
  const parent = parentOf(name);
  if (!recs.length && parent) { const p = await txts(env, "_dmarc." + parent); const pr = p.list.filter((x) => /^v=DMARC1\s*(;|$)/i.test(x)); if (pr.length) { recs = pr; at = parent; } }
  const checks = [], add = (level, text) => checks.push({ level, text });
  if (!recs.length) { add("warn", `No DMARC record at _dmarc.${name}. Gmail and Yahoo expect one from anyone sending email in bulk, and without it nothing stops others sending fake email as you. Start with: v=DMARC1; p=none; rua=mailto:dmarc@${name}`); return { record: null, tags: null, at: null, checks }; }
  if (recs.length > 1) add("fail", `${recs.length} DMARC records found. There must be only one, or receivers ignore DMARC altogether.`);
  const record = recs[0], tags = parseDmarc(record);
  if (at !== name) add("info", `${name} has no DMARC record of its own, so the one on ${at} applies${tags.sp ? ` (its sp=${tags.sp} policy for subdomains)` : ""}.`);
  const p = (tags.p || "").toLowerCase(), sub = at !== name && /^(none|quarantine|reject)$/i.test(tags.sp || "");
  const eff = sub ? tags.sp.toLowerCase() : p, tag = sub ? "sp" : "p";
  if (!["none", "quarantine", "reject"].includes(p)) add("fail", `The policy (p=) is ${tags.p ? `"${tags.p}", which isn't valid` : "missing"}. It must be none, quarantine or reject, or the record is ignored.`);
  else if (eff === "none") add("warn", `${tag}=none: DMARC only reports problems; fake email using your domain is still delivered. Once your reports show your own email passing, move to quarantine, then reject.`);
  else if (eff === "quarantine") add("ok", `${tag}=quarantine: email that fails DMARC goes to spam. reject is the strongest setting.`);
  else add("ok", `${tag}=reject: email that fails DMARC is refused. The strongest protection.`);
  if (tags.sp && !["none", "quarantine", "reject"].includes(tags.sp.toLowerCase())) add("fail", `sp=${tags.sp} isn't valid. Use none, quarantine or reject.`);
  if (tags.pct && Number(tags.pct) < 100) add("info", `pct=${tags.pct}: the policy is applied to only ${tags.pct}% of failing email.`);
  if (!tags.rua) add("info", "No rua= address, so you won't receive the daily reports that show who is sending email as you. Add rua=mailto:you@yourdomain.");
  else if (!/^mailto:/i.test(tags.rua.split(",")[0].trim())) add("fail", "The rua= address must start with mailto:.");
  else add("ok", `Reports go to ${tags.rua.split(",").map((s) => s.trim().replace(/^mailto:/i, "")).slice(0, 3).join(", ")}.`);
  return { record, tags, at, checks };
}

// ---- DKIM
export const SELECTORS = ["google", "selector1", "selector2", "default", "k1", "k2", "s1", "s2", "dkim", "mail", "smtp", "zoho", "protonmail", "fm1", "mandrill", "mxvault", "sig1", "everlytickey1"];

/** Rough key size from the base64 public key: RSA keys of 1024/2048/4096 bits, or ed25519. */
export function keyBits(k, p) {
  if (/ed25519/i.test(k || "")) return 256;
  const bytes = Math.floor(String(p).replace(/[^A-Za-z0-9+/]/g, "").length * 3 / 4);
  if (!bytes) return 0;
  const est = (bytes - 38) * 8;
  return [512, 768, 1024, 1536, 2048, 3072, 4096].reduce((a, b) => Math.abs(b - est) < Math.abs(a - est) ? b : a);
}

async function dkimCheck(env, name, wanted) {
  const list = wanted ? [wanted] : SELECTORS;
  const found = [];
  await Promise.all(list.map(async (sel) => {
    try {
      const t = await txts(env, `${sel}._domainkey.${name}`);
      const rec = t.list.find((x) => /(^|;)\s*p\s*=/i.test(x) || /^v=DKIM1/i.test(x));
      if (!rec) return;
      const tags = parseDmarc(rec);
      found.push({ selector: sel, record: rec.slice(0, 1200), k: (tags.k || "rsa").toLowerCase(), revoked: tags.p === "" || tags.p === undefined, bits: tags.p ? keyBits(tags.k, tags.p) : 0, testing: /\by\b/.test(tags.t || "") });
    } catch {}
  }));
  found.sort((a, b) => list.indexOf(a.selector) - list.indexOf(b.selector));
  const checks = [], add = (level, text) => checks.push({ level, text });
  if (!found.length) add(wanted ? "fail" : "info", wanted ? `No DKIM key at ${wanted}._domainkey.${name}. Check the selector with your email provider – it's in the DKIM-Signature header (s=) of an email you've sent.` : `No DKIM key under the ${SELECTORS.length} common selectors we tried. That doesn't mean DKIM is off: your provider may use its own selector. Find it in the s= part of the DKIM-Signature header of an email you've sent, and enter it above.`);
  for (const f of found) {
    if (f.revoked) add("warn", `${f.selector}: the key is empty (p=), meaning it has been revoked. Email signed with this selector will fail DKIM.`);
    else if (f.k === "rsa" && f.bits && f.bits < 1024) add("fail", `${f.selector}: a ${f.bits}-bit key is too weak and many receivers reject it. Create a 2048-bit key.`);
    else if (f.k === "rsa" && f.bits === 1024) add("warn", `${f.selector}: a 1024-bit key works, but 2048-bit is now recommended. Ask your provider to rotate to a 2048-bit key.`);
    else add("ok", `${f.selector}: DKIM key found (${f.k === "ed25519" ? "ed25519" : `${f.bits}-bit RSA`}).`);
    if (f.testing) add("info", `${f.selector}: t=y marks the key as in testing, so some receivers treat failures leniently.`);
  }
  return { selectors: list, found, checks };
}

/** GET /api/email?d=example.co.uk[&t=mx|spf|dmarc|dkim][&s=selector] */
export async function emailApi(env, params) {
  let name; try { name = dnsName(params.get("d")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  const t = params.get("t") || "all";
  let sel = (params.get("s") || "").trim().toLowerCase().replace(/\._domainkey.*$/, "");
  if (sel && !/^[a-z0-9_-]+(\.[a-z0-9_-]+)*$/.test(sel)) return { status: 400, body: { error: "That doesn't look like a DKIM selector – it's usually one word, such as google or selector1." } };
  try {
    const [mx, spf, dmarc, dkim] = await Promise.all([mxCheck(env, name), spfCheck(env, name, t === "dkim" ? 10 : 14), dmarcCheck(env, name), t === "dkim" ? dkimCheck(env, name, sel) : null]);
    return { status: 200, body: { name, mx, spf, dmarc, ...(dkim ? { dkim } : {}) } };
  } catch { return { status: 502, body: { error: "The DNS servers didn't answer – please try again." } }; }
}
