// Whole-site broken link checker. The browser drives the crawl (like the website audit):
//   GET /api/links/page?url=…   – one page of the site (robots.txt respected): its links and images, with anchor text
//   GET /api/links/check?u=…&u=… – the status of up to LINK_BATCH links (internal or external), following redirects
// Every address is validated with the engine's normaliseUrl, so only public websites are fetched.
import { normaliseUrl, fetchRobots, robotsAllows } from "../engine/checker.js";

export const LINK_BATCH = 10;
const UA = "Mozilla/5.0 (compatible; XKeyLinkChecker/1.0; +https://xkey.co.uk/broken-link-checker)";
const AGENT = ["xkeylinkchecker"]; // robots.txt token; falls back to the * group
const TIMEOUT_MS = 10_000, PAGE_CAP = 1_500_000, MAX_LINKS = 1000;

const cacheGet = async (key) => { try { return typeof caches !== "undefined" ? await caches.default.match(key) : null; } catch { return null; } };
const cachePut = (ctx, key, body, ttl) => { try { if (typeof caches !== "undefined") ctx.waitUntil(caches.default.put(key, new Response(typeof body === "string" ? body : JSON.stringify(body), { headers: { "cache-control": `public, max-age=${ttl}` } }))); } catch {} };

async function timed(fetchImpl, url, init) {
  const ac = new AbortController(), t = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try { return await fetchImpl(url, { ...init, redirect: "manual", signal: ac.signal, headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8", ...(init && init.headers) } }); }
  finally { clearTimeout(t); }
}
async function readText(res, cap) {
  if (!res.body || !res.body.getReader) return (await res.text()).slice(0, cap);
  const rd = res.body.getReader(), parts = []; let n = 0;
  for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); n += value.length; if (n > cap) { try { await rd.cancel(); } catch {} break; } }
  const buf = new Uint8Array(Math.min(n, cap)); let o = 0; for (const p of parts) { const take = Math.min(p.length, buf.length - o); buf.set(p.subarray(0, take), o); o += take; if (o >= buf.length) break; }
  return new TextDecoder().decode(buf);
}
const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[1] ?? m[2] ?? m[3]).trim() : null; };
const sameSite = (a, b) => a.replace(/^www\./, "") === b.replace(/^www\./, "");

/** Every link (<a href>) and image (<img src>) on a page: [{ url, text, kind: "link"|"image", internal, nofollow }] */
export function extractLinks(html, pageUrl) {
  const page = new URL(pageUrl), out = new Map();
  const body = String(html).replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, "");
  const base = attr((body.match(/<base\b[^>]*>/i) || [""])[0], "href");
  let from = page; try { if (base) from = new URL(base, page); } catch {}
  const add = (raw, text, kind, tag) => {
    if (!raw || /^(mailto|tel|javascript|data|sms|whatsapp|ftp|file|about|blob):/i.test(raw) || raw.startsWith("#")) return;
    let u; try { u = new URL(raw, from); } catch { return; }
    if (!/^https?:$/.test(u.protocol)) return;
    u.hash = "";
    const k = u.href;
    if (!out.has(k) && out.size < MAX_LINKS) out.set(k, { url: k, text: text.slice(0, 100), kind, internal: sameSite(u.hostname, page.hostname), nofollow: /\brel\s*=\s*["'][^"']*nofollow/i.test(tag) });
  };
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(" " + m[1], "href"); if (href === null) continue;
    let text = decode(m[2].replace(/<img\b[^>]*>/gi, (t) => " " + (attr(t, "alt") || "") + " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!text) text = attr(" " + m[1], "aria-label") || attr(" " + m[1], "title") || "";
    add(href, text, "link", m[1]);
  }
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) add(attr(m[0], "src"), attr(m[0], "alt") || "", "image", m[0]);
  return [...out.values()];
}

async function robotsFor(origin, fetchImpl, ctx) {
  const key = new Request(`https://xkey.co.uk/__links/robots?o=${encodeURIComponent(origin)}`);
  const hit = await cacheGet(key); if (hit) return hit.text();
  const r = await fetchRobots(origin, fetchImpl);
  cachePut(ctx, key, r.text || "", 600);
  return r.text || "";
}

/** GET /api/links/page?url=… -> { url, status, final?, links: [...] } (one page; redirects are followed within the site) */
export async function linksPageApi(params, fetchImpl, ctx) {
  let u; try { u = normaliseUrl(params.get("url")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  const host = u.hostname, start = u.href;
  const done = (b) => ({ status: 200, body: { start, ...b } });
  try {
    for (let i = 0; ; i++) {
      const robots = await robotsFor(u.origin, fetchImpl, ctx);
      if (!robotsAllows(robots, AGENT, u.pathname + u.search)) return done({ url: u.href, blocked: true, links: [] });
      const r = await timed(fetchImpl, u.href);
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400 && loc) {
        try { await r.body?.cancel(); } catch {}
        let next; try { next = normaliseUrl(new URL(loc, u).href); } catch { return done({ url: u.href, status: r.status, links: [] }); }
        if (i >= 5 || !sameSite(next.hostname, host)) return done({ url: u.href, status: r.status, redirect: next.href, links: [] });
        u = next; continue;
      }
      const type = r.headers.get("content-type") || "";
      if (r.status !== 200 || !/html/i.test(type)) { try { await r.body?.cancel(); } catch {} return done({ url: u.href, status: r.status, links: [] }); }
      const html = await readText(r, PAGE_CAP);
      const title = decode((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).replace(/\s+/g, " ").trim().slice(0, 120);
      return done({ url: u.href, status: 200, title, links: extractLinks(html, u.href) });
    }
  } catch (e) { return done({ url: u.href, status: 0, error: e.name === "AbortError" ? "Timed out" : "Couldn't connect", links: [] }); }
}

/** Status of one link: HEAD first (GET if the server won't answer HEAD), following up to 5 redirects. */
export async function linkStatus(input, fetchImpl) {
  let u; try { u = normaliseUrl(input); } catch (e) { return { url: String(input).slice(0, 500), status: 0, verdict: "skipped", note: "Not a public web address" }; }
  const start = u.href; let hops = 0;
  try {
    for (;;) {
      let r = await timed(fetchImpl, u.href, { method: "HEAD" });
      if ([400, 403, 404, 405, 429, 500, 501, 502, 503].includes(r.status)) { try { await r.body?.cancel(); } catch {} r = await timed(fetchImpl, u.href); }
      try { await r.body?.cancel(); } catch {}
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400 && loc) {
        if (++hops > 5) return { url: start, status: r.status, verdict: "broken", note: "Too many redirects", final: u.href };
        try { u = normaliseUrl(new URL(loc, u).href); } catch { return { url: start, status: r.status, verdict: "broken", note: "Redirects somewhere that can't be opened", final: loc }; }
        continue;
      }
      const s = r.status;
      const verdict = s >= 200 && s < 300 ? (hops ? "redirect" : "ok") : s === 401 || s === 403 || s === 429 || s === 999 ? "blocked" : "broken";
      return { url: start, status: s, verdict, ...(hops ? { final: u.href, hops } : {}) };
    }
  } catch (e) {
    if (e.budget) return { url: start, status: 0, verdict: "later" };
    return { url: start, status: 0, verdict: "broken", note: e.name === "AbortError" ? "No response (timed out)" : "No response (site unreachable)" };
  }
}

/** GET /api/links/check?u=…&u=… (up to LINK_BATCH). Results are cached for an hour per link. */
export async function linksCheckApi(params, fetchImpl, ctx) {
  const list = [...new Set(params.getAll("u").map((x) => String(x).trim()).filter(Boolean))];
  if (!list.length) return { status: 400, body: { error: "Nothing to check." } };
  if (list.length > LINK_BATCH) return { status: 400, body: { error: `Up to ${LINK_BATCH} links per request.` } };
  let left = 45; // a Worker may make only so many subrequests per request
  const f = (...a) => (left-- > 0 ? fetchImpl(...a) : Promise.reject(Object.assign(new Error("budget"), { budget: true })));
  const results = await Promise.all(list.map(async (l) => {
    const key = new Request(`https://xkey.co.uk/__links/s?u=${encodeURIComponent(l)}`);
    const hit = await cacheGet(key); if (hit) return hit.json();
    const r = await linkStatus(l, f);
    if (r.verdict !== "later" && r.verdict !== "skipped") cachePut(ctx, key, r, r.verdict === "broken" ? 900 : 3600);
    return r;
  }));
  return { status: 200, body: { results } };
}
