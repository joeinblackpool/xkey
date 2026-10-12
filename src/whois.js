// Domain age checker and WHOIS lookup. Registration data comes from each registry's RDAP service
// (the modern, JSON replacement for WHOIS), found through IANA's public bootstrap file. Endings
// whose registry has no RDAP (.de, .eu, .ie, .it …) fall back to classic WHOIS on port 43, with the
// registry's server found by asking whois.iana.org.
// Tests pass env.WHOIS_FETCH(url, init) -> Response and env.WHOIS_TCP(host, query) -> text.
import { siteDomain } from "./backlinks.js";

const BOOTSTRAP = "https://data.iana.org/rdap/dns.json";
export const WHOIS_BATCH = 10;
const UA = { "user-agent": "xkey.co.uk domain age checker (+https://xkey.co.uk/domain-age-checker)" };

const cacheGet = async (key) => { try { return typeof caches !== "undefined" ? await caches.default.match(key) : null; } catch { return null; } };
const cachePut = (ctx, key, body, ttl) => { try { if (typeof caches !== "undefined") ctx.waitUntil(caches.default.put(key, new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": `public, max-age=${ttl}` } }))); } catch {} };

async function timed(env, url, init, ms = 8000) {
  const f = env.WHOIS_FETCH || fetch;
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  try { return await f(url, { ...init, signal: ac.signal }); } finally { clearTimeout(t); }
}

// TLD -> RDAP base URL, from IANA (kept in memory and at the edge for a day)
let BOOT = null, BOOT_AT = 0;
async function bootstrap(env, ctx) {
  if (BOOT && Date.now() - BOOT_AT < 86_400_000) return BOOT;
  const key = new Request("https://xkey.co.uk/__whois/bootstrap");
  let j = null; const hit = await cacheGet(key);
  if (hit) j = await hit.json();
  else {
    const r = await timed(env, BOOTSTRAP, { headers: UA });
    if (!r.ok) throw new Error("The registry directory couldn't be reached – please try again in a minute.");
    const raw = await r.json(); j = {};
    for (const [tlds, urls] of raw.services || []) { const u = (urls || []).find((x) => x.startsWith("https://")) || urls[0]; for (const t of tlds) j[t.toLowerCase()] = u; }
    cachePut(ctx, key, j, 86_400);
  }
  BOOT = j; BOOT_AT = Date.now(); return j;
}

const isoDay = (d) => { const t = d instanceof Date ? d : new Date(d); return isNaN(t) ? null : t.toISOString().slice(0, 10); };

/** Turn the date formats registries use in WHOIS text into YYYY-MM-DD (null if unreadable). */
export function whoisDate(s) {
  s = String(s || "").trim().replace(/\s+\(.*\)$/, "");
  if (!s) return null;
  const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const ymd = (y, m, d) => (y > 1980 && y < 2200 && m >= 1 && m <= 12 && d >= 1 && d <= 31 ? `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null);
  let m;
  if ((m = s.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/))) return ymd(+m[1], +m[2], +m[3]);
  if ((m = s.match(/^(\d{1,2})[-./ ]([a-z]{3})[a-z]*[-./ ,]+(\d{4})/i)) && MON[m[2].toLowerCase()]) return ymd(+m[3], MON[m[2].toLowerCase()], +m[1]);
  if ((m = s.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})/))) return ymd(+m[3], +m[2], +m[1]); // day first, as registries outside the US write it
  if ((m = s.match(/^(\d{4})(\d{2})(\d{2})\b/))) return ymd(+m[1], +m[2], +m[3]);
  if (!/^(\d|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|mon|tue|wed|thu|fri|sat|sun)[a-z]*\b)/i.test(s)) return null;
  return isoDay(s.replace(/^[a-z]{3}\s+(?=[a-z]{3}\s)/i, ""));
}

// "clientTransferProhibited" (EPP style, used in WHOIS) -> "client transfer prohibited" (RDAP style)
const statusText = (x) => String(x).replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
const nsName = (x) => String(x || "").toLowerCase().replace(/\.$/, "");

/** Pick the useful fields out of a registry's WHOIS text. */
export function parseWhois(text) {
  const t = String(text || "");
  const field = (re) => { const m = t.match(re); return m ? m[1].trim() : ""; };
  const notFound = /^[\s%#>]*(no match|not found|no entries found|no data found|no object found|nothing found|domain not found|status:\s*(free|available))/im.test(t) || /\bis available for registration\b/i.test(t);
  const created = whoisDate(field(/^\s*(?:creation date|created(?: on| date)?|registered(?: on| date)?|registration (?:time|date)|domain (?:record activated|registration date)|commencement date|registered)\s*[:.]+\s*(.+)$/im));
  const expires = whoisDate(field(/^\s*(?:registry expiry date|registrar registration expiration date|expir\w*(?: date| on)?|paid-till|renewal date|valid until)\s*[:.]+\s*(.+)$/im));
  const updated = whoisDate(field(/^\s*(?:updated date|last updated(?: on)?|last modified|changed|modified)\s*[:.]+\s*(.+)$/im));
  const registrar = field(/^\s*(?:registrar(?: name)?|sponsoring registrar|registrar organization)\s*:\s*(\S.*)$/im).replace(/\s*\[.*$/, "").replace(/^(name|organi[sz]ation):\s*/i, "");
  const ns = [...t.matchAll(/^\s*(?:name server|nserver|nameservers?|ns\d?)\s*:\s*([a-z0-9.-]+\.[a-z]{2,})/gim)].map((m) => nsName(m[1]));
  const status = [...t.matchAll(/^\s*(?:domain )?status\s*:\s*([a-z][\w -]*)/gim)].map((m) => statusText(m[1].trim().replace(/\s+https?$/i, "")));
  return { notFound: notFound && !created, created, expires, updated, registrar, nameservers: [...new Set(ns)].slice(0, 13), status: [...new Set(status)].slice(0, 10) };
}

/** Pick the useful fields out of an RDAP domain response (RFC 9083). */
export function parseRdap(j) {
  const ev = {}; for (const e of j.events || []) if (e.eventAction && e.eventDate && !ev[e.eventAction]) ev[e.eventAction] = e.eventDate;
  const fn = (ent) => { const v = (ent.vcardArray && ent.vcardArray[1]) || []; const f = v.find((x) => x[0] === "fn" || x[0] === "org"); return (f && String(f[3]).trim()) || ""; };
  const ents = []; const walk = (list) => { for (const e of list || []) { ents.push(e); walk(e.entities); } }; walk(j.entities);
  const reg = ents.find((e) => (e.roles || []).includes("registrar"));
  let registrar = reg ? fn(reg) || (reg.publicIds && reg.publicIds[0] && `IANA ${reg.publicIds[0].identifier}`) || reg.handle || "" : "";
  return {
    created: isoDay(ev.registration || ""), expires: isoDay(ev.expiration || ""), updated: isoDay(ev["last changed"] || ""),
    registrar: String(registrar || ""), nameservers: (j.nameservers || []).map((n) => nsName(n.ldhName)).filter(Boolean).slice(0, 13),
    status: (j.status || []).slice(0, 10).map(statusText), dnssec: j.secureDNS ? !!j.secureDNS.delegationSigned : null,
  };
}

async function tcpWhois(env, host, query) {
  if (env.WHOIS_TCP) return env.WHOIS_TCP(host, query);
  const { connect } = await import("cloudflare:sockets");
  const sock = connect({ hostname: host, port: 43 });
  const timer = new Promise((_, no) => setTimeout(() => no(new Error("timeout")), 8000));
  const talk = (async () => {
    const w = sock.writable.getWriter(); await w.write(new TextEncoder().encode(query + "\r\n")); w.releaseLock();
    const rd = sock.readable.getReader(), dec = new TextDecoder(); let out = "";
    for (;;) { const { value, done } = await rd.read(); if (done) break; out += dec.decode(value, { stream: true }); if (out.length > 60_000) break; }
    return out;
  })();
  try { return await Promise.race([talk, timer]); } finally { try { sock.close(); } catch {} }
}

const SERVERS = {};
async function whoisServer(env, tld) {
  if (tld in SERVERS) return SERVERS[tld];
  const t = await tcpWhois(env, "whois.iana.org", tld);
  const m = t.match(/^whois:\s*(\S+)/im);
  return (SERVERS[tld] = m ? m[1].toLowerCase() : "");
}

/** Look one registered domain up: RDAP if the registry has it, otherwise WHOIS. */
export async function lookupDomain(env, ctx, domain) {
  const key = new Request(`https://xkey.co.uk/__whois/d/${domain}`);
  const hit = await cacheGet(key); if (hit) return hit.json();
  const labels = domain.split("."), boot = await bootstrap(env, ctx);
  const base = boot[labels.slice(-2).join(".")] || boot[labels[labels.length - 1]];
  let out;
  if (base) {
    const url = base.replace(/\/?$/, "/") + "domain/" + domain;
    let r;
    try { r = await timed(env, url, { headers: { ...UA, accept: "application/rdap+json, application/json" }, redirect: "follow" }); }
    catch { return { domain, error: "The registry didn't answer in time – please try again." }; }
    if (r.status === 404) out = { domain, registered: false, source: "rdap" };
    else if (r.status === 429) return { domain, error: "The registry is limiting lookups right now – please try again in a minute." };
    else if (!r.ok) return { domain, error: `The registry returned an error (HTTP ${r.status}).` };
    else { let j; try { j = await r.json(); } catch { return { domain, error: "The registry sent a reply we couldn't read." }; } out = { domain, registered: true, source: "rdap", rdap: url, ...parseRdap(j) }; }
  } else {
    let text = "", server = "";
    try {
      server = await whoisServer(env, labels[labels.length - 1]);
      if (!server) return { domain, error: `Registration data isn't published for .${labels[labels.length - 1]} websites.` };
      text = await tcpWhois(env, server, server === "whois.denic.de" ? `-T dn,ace ${domain}` : domain);
    } catch { return { domain, error: "The registry's WHOIS server didn't answer – please try again." }; }
    const p = parseWhois(text);
    if (!p.notFound && !p.created && !p.registrar && !p.nameservers.length && /limit|exceeded|too many|quota/i.test(text)) return { domain, error: "The registry is limiting lookups right now – please try again later." };
    const { notFound, ...fields } = p;
    out = notFound ? { domain, registered: false, source: "whois", server } : { domain, registered: true, source: "whois", server, ...fields, dnssec: null, raw: text.slice(0, 20_000) };
  }
  cachePut(ctx, key, out, out.registered ? 43_200 : 3_600);
  return out;
}

/** GET /api/whois?d=a.com,b.co.uk (up to WHOIS_BATCH; the page sends longer lists in batches).
 *  `raw` (the registry's WHOIS text) is only included when one domain is asked for. */
export async function whoisApi(env, ctx, params) {
  const raw = String(params.get("d") || "").split(/[\s,]+/).map((x) => x.trim()).filter(Boolean);
  if (!raw.length) return { status: 400, body: { error: "Enter at least one domain." } };
  if (raw.length > WHOIS_BATCH) return { status: 400, body: { error: `Up to ${WHOIS_BATCH} domains per request.` } };
  try { await bootstrap(env, ctx); } catch (e) { return { status: 503, body: { error: e.message } }; }
  const results = await Promise.all(raw.map(async (input) => {
    let site; try { site = siteDomain(input); } catch (e) { return { input, error: e.message }; }
    try { const r = await lookupDomain(env, ctx, site.domain); if (raw.length > 1) delete r.raw; return { input, ...r }; }
    catch (e) { return { input, domain: site.domain, error: "Couldn't look that domain up – please try again." }; }
  }));
  return { status: 200, body: { results, checked: new Date().toISOString().slice(0, 10) } };
}
