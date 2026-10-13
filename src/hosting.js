// Website hosting checker ("who is hosting this website?"): the site's IP addresses from DNS, who
// owns each address (RDAP from the regional internet registries, found through IANA's bootstrap
// files), reverse DNS, and the CDN or platform seen in the page's headers and code. A CDN such as
// Cloudflare hides the real host, and we say so rather than guess.
// Tests pass env.WHOIS_FETCH (RDAP) and env.DNS_FETCH (DNS).
import { normaliseUrl } from "../engine/checker.js";
import { dnsName, query } from "./dns.js";
import { getPage, detectTech } from "./tech.js";

const BOOT = { 4: "https://data.iana.org/rdap/ipv4.json", 6: "https://data.iana.org/rdap/ipv6.json" };
const UA = { "user-agent": "XKeyHostingChecker/1.0 (+https://xkey.co.uk/website-hosting-checker)", accept: "application/rdap+json, application/json" };
// Platforms that host every site built with them, and CDNs that hide the server behind them
const HOSTED = ["Shopify", "Wix", "Squarespace", "Webflow", "GoDaddy Website Builder", "Weebly / Square Online", "Duda", "HubSpot CMS", "Jimdo", "Strikingly", "Framer", "Hostinger Website Builder", "Blogger", "Substack", "Carrd", "BigCommerce", "Big Cartel"];
const HOSTS = ["WP Engine", "Kinsta", "WordPress.com / VIP", "Pantheon", "Hostinger", "Vercel", "Netlify", "GitHub Pages", "Render", "Fly.io", "Heroku"];
const PROXIES = [["Cloudflare", /cloudflare/i], ["Fastly", /fastly/i], ["Akamai", /akamai/i], ["Amazon CloudFront", /amazon|aws/i], ["Sucuri", /sucuri|godaddy/i], ["Imperva", /imperva|incapsula/i], ["Bunny CDN", /bunny|datacamp/i]];

async function timed(env, url, ms = 8000) {
  const f = env.WHOIS_FETCH || fetch;
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
  try { return await f(url, { headers: UA, signal: ac.signal }); } finally { clearTimeout(t); }
}

const v4num = (ip) => ip.split(".").reduce((n, x) => n * 256 + Number(x), 0);
export function v6big(ip) {
  let [a, b = ""] = ip.toLowerCase().split("::");
  const A = a ? a.split(":") : [], B = b ? b.split(":") : [];
  const parts = ip.includes("::") ? [...A, ...Array(8 - A.length - B.length).fill("0"), ...B] : A;
  return parts.reduce((n, h) => (n << 16n) + BigInt(parseInt(h || "0", 16)), 0n);
}
/** Is ip inside cidr? */
export function inCidr(ip, cidr) {
  const [base, bits] = cidr.split("/"), n = Number(bits);
  if (ip.includes(":") !== base.includes(":")) return false;
  if (!ip.includes(":")) { const m = n === 0 ? 0 : (~0 << (32 - n)) >>> 0; return ((v4num(ip) & m) >>> 0) === ((v4num(base) & m) >>> 0); }
  const shift = BigInt(128 - n); return (v6big(ip) >> shift) === (v6big(base) >> shift);
}

const boots = {};
async function rdapBase(env, ip) {
  const v = ip.includes(":") ? 6 : 4;
  if (!boots[v]) { const r = await timed(env, BOOT[v]); if (!r.ok) throw new Error("bootstrap"); boots[v] = (await r.json()).services || []; }
  let best = null, bestBits = -1;
  for (const [cidrs, urls] of boots[v]) for (const c of cidrs) { const bits = Number(c.split("/")[1]); if (bits > bestBits && inCidr(ip, c)) { best = (urls.find((u) => u.startsWith("https://")) || urls[0]); bestBits = bits; } }
  return best;
}

const fn = (e) => { const v = ((e.vcardArray || [])[1] || []).find((x) => x[0] === "fn"); return v ? String(v[3]).trim() : ""; };
/** The useful parts of an RDAP IP network record. */
export function parseIpRdap(j) {
  const ents = [], walk = (list) => { for (const e of list || []) { ents.push(e); walk(e.entities); } };
  walk(j.entities);
  const pick = (role) => { const e = ents.find((x) => (x.roles || []).includes(role) && fn(x)); return e ? fn(e) : ""; };
  const org = pick("registrant") || pick("administrative") || pick("technical") || "";
  const range = j.startAddress && j.endAddress ? `${j.startAddress} – ${j.endAddress}` : j.handle || "";
  return { org, network: j.name || "", country: j.country || "", range };
}

export const ptrName = (ip) => {
  if (!ip.includes(":")) return ip.split(".").reverse().join(".") + ".in-addr.arpa";
  return v6big(ip).toString(16).padStart(32, "0").split("").reverse().join(".") + ".ip6.arpa";
};

async function ipInfo(env, ip) {
  const out = { ip, version: ip.includes(":") ? 6 : 4 };
  await Promise.all([
    (async () => { try { const base = await rdapBase(env, ip); if (!base) return; const r = await timed(env, base.replace(/\/?$/, "/") + "ip/" + ip); if (r.ok) Object.assign(out, parseIpRdap(await r.json())); } catch {} })(),
    (async () => { try { const r = await query(env, ptrName(ip), "PTR"); const p = r.answers.find((a) => a.type === "PTR"); if (p) out.ptr = p.data.replace(/\.$/, ""); } catch {} })(),
  ]);
  return out;
}

/** GET /api/hosting?d=example.co.uk (a domain or a web address) */
export async function hostingApi(env, params, fetchImpl) {
  let name; try { name = dnsName(params.get("d")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let start; try { start = normaliseUrl(name); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let a, aaaa;
  try { [a, aaaa] = await Promise.all(["A", "AAAA"].map((t) => query(env, name, t))); } catch { return { status: 502, body: { error: "The DNS servers didn't answer – please try again." } }; }
  if (a.nx && aaaa.nx) return { status: 200, body: { name, exists: false, ips: [], notes: [{ level: "fail", text: `${name} doesn't exist in DNS. Check the spelling, or the domain may not be registered.` }] } };
  const v4 = a.answers.filter((x) => x.type === "A").map((x) => x.data), v6 = aaaa.answers.filter((x) => x.type === "AAAA").map((x) => x.data);
  const cname = a.answers.filter((x) => x.type === "CNAME").map((x) => x.data.replace(/\.$/, ""));
  const [ips, page] = await Promise.all([
    Promise.all([...v4.slice(0, 2), ...v6.slice(0, 1)].map((ip) => ipInfo(env, ip))),
    getPage(start, fetchImpl).catch(() => null),
  ]);
  const tech = page ? detectTech(page.html, page.H) : [];
  const platform = tech.find((t) => HOSTED.includes(t.name) && (t.cat === "cms" || t.cat === "shop"));
  const host = tech.find((t) => t.cat === "cdn" && HOSTS.includes(t.name));
  const cdn = tech.filter((t) => t.cat === "cdn" || t.cat === "security").map((t) => t.name);
  const orgs = [...new Set(ips.map((i) => i.org || i.network).filter(Boolean))];
  const proxy = PROXIES.find(([n, r]) => cdn.includes(n) && orgs.some((o) => r.test(o)));
  let provider, how;
  if (platform) { provider = platform.name.replace(/ \/.*$/, ""); how = `The site is built with ${platform.name}, which hosts every site made with it.`; }
  else if (host) { provider = host.name; how = `${host.name}'s own headers are on the page.`; }
  else if (proxy) { provider = null; how = `The site sits behind ${proxy[0]}, so its IP addresses belong to ${proxy[0]} and the real hosting company is hidden. Only the site owner (or ${proxy[0]}) can see where it's hosted.`; }
  else if (orgs.length) { provider = orgs[0]; how = "From the owner of the site's IP address in the internet registry."; }
  else { provider = null; how = "The registries didn't say who owns the site's IP address."; }
  const notes = [];
  if (!v4.length && !v6.length) notes.push({ level: "fail", text: `${name} has no A or AAAA record, so the website won't load at this address.` });
  if (!v6.length && v4.length) notes.push({ level: "info", text: "No IPv6 address. Not a problem for SEO." });
  if (page && page.status >= 500) notes.push({ level: "warn", text: `The site answered with HTTP ${page.status} – the server may be down or overloaded.` });
  if (ips.some((i) => i.country) && !proxy) notes.push({ level: "info", text: "The country is where the IP address is registered, which is usually, but not always, where the server is." });
  return { status: 200, body: { name, exists: true, provider, how, cdn, cname, platform: platform ? platform.name : null, ips, status: page ? page.status : 0, notes } };
}
