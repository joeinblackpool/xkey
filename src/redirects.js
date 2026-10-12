// Redirect checker: follows each address hop by hop (no automatic redirects), recording every
// status code and Location, plus meta refresh redirects on the final page. Each hop is re-validated
// with the engine's normaliseUrl, so only public websites on standard ports are ever fetched.
import { normaliseUrl } from "../engine/checker.js";

export const REDIRECT_BATCH = 10;
const MAX_HOPS = 10, TIMEOUT_MS = 10_000, PEEK = 65_536;
const AGENTS = {
  desktop: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36 XKeyRedirectChecker/1.0 (+https://xkey.co.uk/redirect-checker)",
  mobile: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1 XKeyRedirectChecker/1.0 (+https://xkey.co.uk/redirect-checker)",
};
const TEXT = { 200: "OK", 201: "Created", 204: "No Content", 301: "Moved Permanently", 302: "Found", 303: "See Other", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 410: "Gone", 429: "Too Many Requests", 451: "Unavailable For Legal Reasons", 500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout" };

/** The target of a <meta http-equiv="refresh"> tag in the page's <head>, or null. */
export function metaRefresh(html) {
  const head = String(html || "").slice(0, PEEK).split(/<body[\s>]/i)[0];
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/http-equiv\s*=\s*["']?refresh/i.test(tag)) continue;
    const c = (tag.match(/content\s*=\s*"([^"]*)"/i) || tag.match(/content\s*=\s*'([^']*)'/i) || [])[1];
    const u = c && c.match(/^\s*(\d+(?:\.\d+)?)\s*[;,]\s*(?:url\s*=\s*)?['"]?([^'"]+?)['"]?\s*$/i);
    if (u) return { delay: Number(u[1]), url: u[2].trim() };
  }
  return null;
}

async function peek(res) {
  if (!res.body || !res.body.getReader) return (await res.text()).slice(0, PEEK);
  const rd = res.body.getReader(), parts = []; let n = 0;
  while (n < PEEK) { const { done, value } = await rd.read(); if (done) break; parts.push(value); n += value.length; }
  try { await rd.cancel(); } catch {}
  const buf = new Uint8Array(Math.min(n, PEEK)); let o = 0; for (const p of parts) { const take = Math.min(p.length, buf.length - o); buf.set(p.subarray(0, take), o); o += take; }
  return new TextDecoder().decode(buf);
}

/** Follow one address: { input, hops: [{ url, status, text, location, type, ms }], final, problems } */
export async function traceRedirects(input, fetchImpl = fetch, agent = "desktop", withHeaders = false) {
  let u; try { u = normaliseUrl(input); } catch (e) { return { input, error: e.message }; }
  const ua = AGENTS[agent] || AGENTS.desktop, hops = [], seen = new Set();
  let problem = "";
  for (let i = 0; ; i++) {
    if (seen.has(u.href)) { problem = "loop"; break; }
    if (i > MAX_HOPS) { problem = "too many"; break; }
    seen.add(u.href);
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), TIMEOUT_MS), t0 = Date.now();
    let r;
    try { r = await fetchImpl(u.href, { redirect: "manual", signal: ctl.signal, headers: { "user-agent": ua, accept: "text/html,application/xhtml+xml,*/*;q=0.8", "accept-encoding": "br, gzip" } }); }
    catch (e) { clearTimeout(t); hops.push({ url: u.href, status: 0, text: e.budget ? "budget" : e.name === "AbortError" ? "Timed out" : "Couldn't connect", ms: Date.now() - t0 }); break; }
    const hop = { url: u.href, status: r.status, text: TEXT[r.status] || "", ms: Date.now() - t0 };
    if (withHeaders) hop.headers = [...r.headers].slice(0, 80).map(([k, v]) => [k, String(v).slice(0, 1000)]);
    hops.push(hop);
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) {
      try { await r.body?.cancel(); } catch {}
      clearTimeout(t);
      let next; try { next = new URL(loc, u); hop.location = next.href; next = normaliseUrl(next.href); } catch (e) { hop.location = loc; problem = "bad location"; break; }
      hop.type = "header"; u = next; continue;
    }
    let html = "";
    if (r.status === 200 && /html/i.test(r.headers.get("content-type") || "")) { try { html = await peek(r); } catch {} }
    else { try { await r.body?.cancel(); } catch {} }
    clearTimeout(t);
    const mr = html && metaRefresh(html);
    if (mr && mr.delay <= 10) {
      let next; try { next = new URL(mr.url, u); } catch { break; }
      if (next.href === u.href) break; // a page that just reloads itself
      hop.location = next.href; hop.type = "meta"; hop.delay = mr.delay;
      try { u = normaliseUrl(next.href); } catch { problem = "bad location"; break; }
      continue;
    }
    break;
  }
  const last = hops[hops.length - 1], redirects = hops.filter((h) => h.location);
  const problems = [];
  if (problem === "loop") problems.push("Redirect loop: the chain comes back to an address it already visited, so the page never loads.");
  if (problem === "too many") problems.push(`More than ${MAX_HOPS} redirects – browsers and Google give up long before this.`);
  if (problem === "bad location") problems.push("A redirect points to an address that can't be followed.");
  if (!problem && last.status === 0) problems.push(`The last address didn't respond (${last.text.toLowerCase()}).`);
  else if (!problem && last.status >= 400) problems.push(`The chain ends in an error (HTTP ${last.status}).`);
  if (redirects.length > 1) problems.push(`${redirects.length} redirects in a row. Point the first address straight at the final one.`);
  if (redirects.some((h) => h.status === 302 || h.status === 307 || h.status === 303)) problems.push("Uses a temporary redirect (302/307). If the move is permanent, a 301 or 308 is clearer for search engines.");
  if (redirects.some((h) => h.type === "meta")) problems.push("Uses a meta refresh. A server-side 301 is faster and clearer for search engines.");
  if (redirects.some((h) => h.url.startsWith("https:") && h.location && h.location.startsWith("http:"))) problems.push("Redirects from https to insecure http.");
  if (!problem && last.status === 200 && last.url.startsWith("http:")) problems.push("Ends on an insecure http:// page.");
  return { input, start: hops[0].url, final: last.url, status: last.status, redirects: redirects.length, hops, problems, ok: !problem && last.status >= 200 && last.status < 300 };
}

/** GET /api/redirects?u=a&u=b… (up to REDIRECT_BATCH) [&agent=mobile] */
export async function redirectsApi(params, fetchImpl) {
  const list = params.getAll("u").flatMap((x) => String(x).split(/[\s,]+/)).map((x) => x.trim()).filter(Boolean);
  if (!list.length) return { status: 400, body: { error: "Enter at least one web address." } };
  if (list.length > REDIRECT_BATCH) return { status: 400, body: { error: `Up to ${REDIRECT_BATCH} addresses per request.` } };
  const agent = params.get("agent") === "mobile" ? "mobile" : "desktop";
  // A Worker may make only so many subrequests per request (50 on the free plan): share a budget.
  let left = 45;
  const f = (...a) => (left-- > 0 ? fetchImpl(...a) : Promise.reject(Object.assign(new Error("budget"), { budget: true })));
  const results = await Promise.all(list.map((u) => traceRedirects(u, f, agent).catch(() => ({ input: u, error: "Couldn't check that address." }))));
  for (const r of results) if (r.hops && r.hops.some((h) => h.status === 0 && h.text === "budget")) Object.assign(r, { error: "Too many redirects to follow in one go – check this address on its own." });
  return { status: 200, body: { results, agent } };
}
