// SSL checker: does the site load securely, does http:// redirect to https://, is HSTS on, does the
// page load anything insecure (mixed content), and the certificate's issuer and dates from public
// Certificate Transparency logs (crt.sh). Workers can't read the certificate a server presents, so
// we say where the dates come from. Tests pass env.CT_FETCH(url) -> Response.
import { dnsName } from "./dns.js";
import { traceRedirects } from "./redirects.js";
import { getPage } from "./tech.js";
import { normaliseUrl } from "../engine/checker.js";

const DAY = 86_400_000;

/** Insecure http:// resources on an https page: [{ url, tag, active }] (active = blocked by browsers) */
export function mixedContent(html) {
  const out = new Map();
  const body = String(html || "").slice(0, 1_500_000).replace(/<!--[\s\S]*?-->/g, "");
  const add = (url, tag, active) => { if (!out.has(url) && out.size < 100) out.set(url, { url, tag, active }); };
  for (const m of body.matchAll(/<(script|iframe|img|audio|video|source|embed|object|link|form)\b[^>]*>/gi)) {
    const tag = m[1].toLowerCase(), t = m[0];
    if (tag === "link" && !/rel\s*=\s*["']?(stylesheet|preload|icon|manifest)/i.test(t)) continue;
    const attr = tag === "link" ? "href" : tag === "object" ? "data" : tag === "form" ? "action" : "src";
    const v = (t.match(new RegExp(`\\s${attr}\\s*=\\s*["']?(http:\\/\\/[^"'\\s>]+)`, "i")) || [])[1];
    if (v) add(v, tag, /^(script|iframe|link|embed|object|form)$/.test(tag));
    const set = (t.match(/\ssrcset\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (set) for (const s of set.split(",")) { const u = s.trim().split(/\s+/)[0]; if (/^http:\/\//i.test(u)) add(u, tag, false); }
  }
  return [...out.values()];
}

const covers = (pattern, name) => { pattern = pattern.toLowerCase().trim(); return pattern === name || (pattern.startsWith("*.") && name.endsWith(pattern.slice(1)) && name.split(".").length === pattern.split(".").length); };
const orgOf = (issuer) => (String(issuer).match(/(?:^|,\s*)O=("?)([^,"]+)\1/) || [])[2] || (String(issuer).match(/CN=([^,]+)/) || [])[1] || String(issuer);

/** The newest unexpired certificate for name in the CT logs (crt.sh), or null. A wildcard
 *  certificate is listed under its parent name, so www.example.co.uk also tries example.co.uk. */
export async function ctLookup(env, name) {
  const first = await ctSearch(env, name, name);
  const parent = name.split(".").slice(1).join(".");
  if (first !== null || parent.split(".").length < 2 || /^(?:co|org|me|ltd|plc|net|ac|gov|nhs|sch|com|edu|gen)\.[a-z]{2}$/.test(parent)) return first;
  return ctSearch(env, parent, name);
}

async function ctSearch(env, q, name) {
  const f = env.CT_FETCH || fetch;
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), 9000);
  try {
    const r = await f(`https://crt.sh/?q=${encodeURIComponent(q)}&output=json&exclude=expired`, { headers: { accept: "application/json", "user-agent": "XKeySSLChecker/1.0 (+https://xkey.co.uk/ssl-checker)" }, signal: ac.signal });
    if (!r.ok) return { error: true };
    const list = await r.json();
    const now = Date.now();
    const certs = (Array.isArray(list) ? list : []).filter((c) => String(c.name_value || "").split(/\n/).some((n) => covers(n, name)) && Date.parse(c.not_after) > now && Date.parse(c.not_before) <= now);
    if (!certs.length) return null;
    certs.sort((a, b) => Date.parse(b.not_before) - Date.parse(a.not_before) || b.id - a.id);
    const c = certs[0];
    return { issuer: orgOf(c.issuer_name), from: c.not_before.slice(0, 10), to: c.not_after.slice(0, 10), daysLeft: Math.floor((Date.parse(c.not_after) - now) / DAY), names: [...new Set(String(c.name_value).split(/\n/).map((s) => s.trim().toLowerCase()))].slice(0, 50), id: c.id };
  } catch { return { error: true }; } finally { clearTimeout(t); }
}

/** GET /api/ssl?d=example.co.uk */
export async function sslApi(env, params, fetchImpl) {
  let name; try { name = dnsName(params.get("d")); normaliseUrl("https://" + name); } catch (e) { return { status: 400, body: { error: e.message } }; }
  const [https, http, cert] = await Promise.all([
    traceRedirects("https://" + name + "/", fetchImpl, "desktop", true),
    traceRedirects("http://" + name + "/", fetchImpl),
    ctLookup(env, name),
  ]);
  const first = https.hops && https.hops[0];
  const secure = !!first && first.status > 0;
  const checks = [], add = (level, text) => checks.push({ level, text });
  if (!secure) add("fail", `We couldn't make a secure (https) connection to ${name}${first && first.text ? ` (${first.text.toLowerCase()})` : ""}. The certificate may be missing, expired or for a different name, or the server may not accept https at all.`);
  else add("ok", `${name} loads over https, with a certificate browsers trust.`);
  if (secure && https.final && https.final.startsWith("http:")) add("fail", "The https address redirects back to insecure http.");
  const httpEnd = http.final || "";
  if (http.hops && http.hops[0] && http.hops[0].status) {
    if (httpEnd.startsWith("https:") && http.status >= 200 && http.status < 400) add("ok", `http://${name} redirects to https.`);
    else add("warn", `http://${name} doesn't redirect to https, so some visitors (and links) will land on the insecure version.`);
  }
  let mixed = [], hsts = null;
  if (secure && https.status === 200 && https.final.startsWith("https:")) {
    const last = https.hops[https.hops.length - 1];
    hsts = ((last.headers || []).find(([k]) => k.toLowerCase() === "strict-transport-security") || [])[1] || null;
    if (hsts) add("ok", `HSTS is on (${hsts}), so browsers only ever use https for this site.`); else add("info", "No HSTS header. Adding Strict-Transport-Security stops browsers trying http first.");
    try { const p = await getPage(normaliseUrl(https.final), fetchImpl); mixed = mixedContent(p.html); } catch {}
    const active = mixed.filter((m) => m.active).length;
    if (active) add("fail", `${active} insecure script, stylesheet or frame${active > 1 ? "s" : ""} (http://) on the page. Browsers block these, which can break the page.`);
    if (mixed.length - active) add("warn", `${mixed.length - active} insecure image${mixed.length - active > 1 ? "s" : ""} or media file${mixed.length - active > 1 ? "s" : ""} (http://). Browsers may block them or mark the page "Not secure".`);
    if (!mixed.length) add("ok", "No mixed content: everything on the home page loads over https.");
  }
  if (cert && !cert.error) {
    if (cert.daysLeft < 7) add("fail", `The newest certificate in the public logs expires in ${cert.daysLeft} day${cert.daysLeft === 1 ? "" : "s"} (${cert.to}). Renew it now.`);
    else if (cert.daysLeft < 21) add("warn", `The newest certificate in the public logs expires in ${cert.daysLeft} days (${cert.to}). Check auto-renewal is working.`);
    else add("ok", `The newest certificate in the public logs is valid until ${cert.to} (${cert.daysLeft} days).`);
  }
  return { status: 200, body: { name, secure, final: https.final || null, httpFinal: httpEnd || null, hsts, cert: cert && !cert.error ? cert : null, ctError: !!(cert && cert.error), mixed, checks } };
}
