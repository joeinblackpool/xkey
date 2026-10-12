// Redirect checker: follows one address hop by hop (never automatically) and reports every
// status code, where each hop points, the headers that matter for SEO and a plain verdict.
import { normaliseUrl, UA } from "../engine/checker.js";

const MAX_HOPS = 10, TIMEOUT_MS = 8000;
const KEEP = ["content-type", "cache-control", "x-robots-tag", "strict-transport-security", "server", "last-modified", "content-length", "link", "vary", "x-frame-options", "content-security-policy"];
const NAMES = { 200: "OK", 301: "Moved permanently", 302: "Found (temporary)", 303: "See other", 304: "Not modified", 307: "Temporary redirect", 308: "Permanent redirect", 400: "Bad request", 401: "Login required", 403: "Forbidden", 404: "Not found", 410: "Gone", 429: "Too many requests", 451: "Unavailable for legal reasons", 500: "Server error", 502: "Bad gateway", 503: "Unavailable", 504: "Gateway timeout" };
const PERMANENT = new Set([301, 308]), TEMPORARY = new Set([302, 303, 307]);

async function hop(u, fetchImpl) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), TIMEOUT_MS), t0 = Date.now();
  try {
    const r = await fetchImpl(u.href, { method: "GET", redirect: "manual", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,*/*;q=0.8" } });
    try { await r.body?.cancel(); } catch {}
    const headers = {}; for (const k of KEEP) { const v = r.headers.get(k); if (v) headers[k] = v.slice(0, 300); }
    return { url: u.href, status: r.status, name: NAMES[r.status] || "", ms: Date.now() - t0, location: r.headers.get("location"), headers };
  } catch (e) { return { url: u.href, status: 0, name: e.name === "AbortError" ? "Timed out" : "Couldn't connect", ms: Date.now() - t0, headers: {} }; }
  finally { clearTimeout(t); }
}

/** Follow `input` to its end. Returns { input, hops, final, verdict: [level, text][] }. */
export async function traceRedirects(input, fetchImpl = fetch) {
  let u = normaliseUrl(input);
  const hops = [], seen = new Set();
  let loop = false, bad = null;
  for (;;) {
    if (seen.has(u.href)) { loop = true; break; }
    seen.add(u.href);
    const h = await hop(u, fetchImpl); hops.push(h);
    if (h.status < 300 || h.status >= 400 || !h.location) break;
    if (hops.length > MAX_HOPS) break;
    let next; try { next = normaliseUrl(new URL(h.location, u).href); } catch (e) { bad = e.message; break; }
    h.to = next.href; u = next;
  }
  const last = hops[hops.length - 1], redirects = hops.filter((h) => h.to), v = [];
  const start = new URL(hops[0].url), end = new URL(last.url);
  if (loop) v.push(["fail", "Redirect loop: the address sends visitors round in a circle, so nobody (and no search engine) can reach the page."]);
  else if (hops.length > MAX_HOPS) v.push(["fail", `More than ${MAX_HOPS} redirects – browsers and Google give up long before the end.`]);
  else if (bad) v.push(["fail", `A redirect points somewhere that can't be reached (${bad})`]);
  else if (!last.status) v.push(["fail", `The last address didn't respond (${last.name.toLowerCase()}).`]);
  else if (last.status >= 400) v.push(["fail", `Ends on an error: HTTP ${last.status} ${last.name}. Point the address (and any links to it) at a working page.`]);
  else if (last.status >= 300) v.push(["warn", `HTTP ${last.status} without a place to go – visitors see a blank page.`]);
  if (redirects.length === 0 && last.status === 200) v.push(["pass", "No redirect: the address loads directly."]);
  if (redirects.length > 1) v.push(["warn", `${redirects.length} redirects in a row. Each one slows the page and wastes Google's time – redirect straight to ${last.url}.`]);
  const temp = redirects.filter((h) => TEMPORARY.has(h.status));
  if (temp.length) v.push(["warn", `Uses a temporary redirect (${[...new Set(temp.map((h) => h.status))].join(", ")}). If the move is for good, use a 301 so Google moves the old page's rankings to the new one.`]);
  if (redirects.length && redirects.every((h) => PERMANENT.has(h.status)) && last.status === 200) v.push(["pass", `Permanent redirect${redirects.length > 1 ? "s" : ""} (${[...new Set(redirects.map((h) => h.status))].join(", ")}) – rankings pass to the final page.`]);
  if (start.protocol === "http:" && end.protocol === "http:" && last.status === 200) v.push(["fail", "Stays on http:// – it should redirect to the secure https:// address."]);
  if (start.protocol === "https:" && hops.some((h) => h.url.startsWith("http:"))) v.push(["warn", "The chain drops to insecure http:// part-way through."]);
  const xr = last.headers["x-robots-tag"];
  if (xr && /noindex/i.test(xr)) v.push(["warn", `The final page sends X-Robots-Tag: ${xr} – Google won't index it.`]);
  return { input, hops, final: last.url, status: last.status, redirects: redirects.length, verdict: v };
}

/** All four versions of a domain's home page (http/https × www/bare), to see whether they all end up at one address. */
export const variants = (host) => { const bare = host.replace(/^www\./, ""); return [`http://${bare}/`, `http://www.${bare}/`, `https://${bare}/`, `https://www.${bare}/`]; };
