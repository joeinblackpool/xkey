// HTTP header checker: the response headers of an address and of every redirect on the way, with
// plain-English notes on the ones that matter for search engines, speed and security.
import { traceRedirects } from "./redirects.js";

/** Notes on one response's headers: [{ level: "fail"|"warn"|"ok"|"info", text }] */
export function headerNotes(headers, url, status) {
  const h = {}; for (const [k, v] of headers || []) h[k.toLowerCase()] = h[k.toLowerCase()] ? h[k.toLowerCase()] + ", " + v : v;
  const notes = [], add = (level, text) => notes.push({ level, text });
  const html = /html/i.test(h["content-type"] || ""), https = String(url).startsWith("https:");
  const xr = (h["x-robots-tag"] || "").toLowerCase();
  if (/\b(noindex|none)\b/.test(xr)) add("fail", "X-Robots-Tag tells search engines not to index this address – it won't appear in Google.");
  else if (/\bnofollow\b/.test(xr)) add("warn", "X-Robots-Tag tells search engines not to follow the links on this page.");
  else if (xr) add("info", `X-Robots-Tag: ${h["x-robots-tag"]}`);
  const canon = (h.link || "").match(/<([^>]+)>\s*;[^,]*rel\s*=\s*"?canonical/i);
  if (canon) add("info", `Canonical address set in the Link header: ${canon[1]}`);
  if (status === 200 && html) {
    if (!/charset=/i.test(h["content-type"] || "")) add("warn", "Content-Type doesn't say which character set the page uses (e.g. charset=utf-8).");
    if (h["content-encoding"]) add("ok", `Compressed with ${h["content-encoding"]}.`);
    else add("warn", "No Content-Encoding header: the page may be sent without compression (gzip or brotli), which makes it slower.");
    const cc = (h["cache-control"] || "").toLowerCase();
    if (!cc) add("info", "No Cache-Control header, so browsers and CDNs guess how long to keep the page.");
    else add("info", `Cache-Control: ${h["cache-control"]}`);
  }
  if (https) {
    if (h["strict-transport-security"]) add("ok", "HSTS is on: browsers will only use https for this site.");
    else if (status < 300 || status >= 400) add("warn", "No Strict-Transport-Security (HSTS) header, so browsers may still try insecure http first.");
  }
  if (status === 200 && html && !h["x-content-type-options"]) add("info", "No X-Content-Type-Options: nosniff header (a small security hardening).");
  const ver = [h.server, h["x-powered-by"]].filter((x) => x && /\d/.test(x));
  if (ver.length) add("info", `Your server shows its software version (${ver.join(", ")}). Hiding it gives attackers less to go on.`);
  if (h["retry-after"]) add("info", `Retry-After: ${h["retry-after"]}`);
  return notes;
}

/** GET /api/headers?url=…[&agent=mobile] */
export async function headersApi(params, fetchImpl) {
  const input = String(params.get("url") || "").trim();
  if (!input) return { status: 400, body: { error: "Enter a web address." } };
  const r = await traceRedirects(input, fetchImpl, params.get("agent") === "mobile" ? "mobile" : "desktop", true);
  if (r.error) return { status: 400, body: { error: r.error } };
  for (const hop of r.hops) {
    // xkey.co.uk's own pages are fetched in-process (no edge compression); drop the internal marker
    const internal = (hop.headers || []).some(([k]) => k === "x-checker-internal");
    hop.headers = (hop.headers || []).filter(([k]) => k !== "x-checker-internal");
    hop.notes = hop.status ? headerNotes(hop.headers, hop.url, hop.status).filter((n) => !(internal && /Content-Encoding/.test(n.text))) : [];
  }
  return { status: 200, body: r };
}
