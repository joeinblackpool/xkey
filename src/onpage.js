// One page's headings, images, structured data and indexing signals, for the schema markup validator,
// heading checker, alt text checker and canonical checker. The browser does the checking; this only
// fetches and parses.
import { normaliseUrl } from "../engine/checker.js";
import { getPage } from "./tech.js";
import { headTags } from "./meta.js";
import { decode } from "./page-parse.js";

const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[1] ?? m[2] ?? m[3] ?? "").trim() : null; };
const text = (s) => decode(s.replace(/<img\b[^>]*>/gi, (t) => " " + (attr(t, "alt") || "") + " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

/** { headings, images, jsonld, microdata, canonicals, robots } from a page's HTML */
export function onPage(html, pageUrl) {
  html = String(html || "").slice(0, 1_500_000);
  const clean = html.replace(/<!--[\s\S]*?-->/g, " ");
  const body = clean.replace(/<head\b[\s\S]*?<\/head>/i, " ").replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, " ");
  const headings = [];
  for (const m of body.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi)) {
    if (headings.length >= 300) break;
    headings.push({ l: +m[1], t: text(m[3]).slice(0, 300), hidden: /\bhidden\b|display\s*:\s*none/i.test(m[2]) || undefined });
  }
  const images = [], links = [];
  for (const m of body.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)) links.push([m.index, m.index + m[0].length, text(m[0].replace(/<img\b[^>]*>/gi, ""))]);
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) {
    if (images.length >= 400) break;
    const t = m[0], raw = attr(t, "src") || attr(t, "data-src") || attr(t, "data-lazy-src") || (attr(t, "srcset") || "").split(/\s+/)[0];
    let src = ""; try { if (raw && !/^data:/i.test(raw)) src = new URL(raw, pageUrl).href; else if (raw) src = "data:"; } catch {}
    const link = links.find(([a, b]) => m.index >= a && m.index < b);
    images.push({ src, alt: attr(t, "alt"), w: attr(t, "width") || undefined, h: attr(t, "height") || undefined, role: attr(t, "role") || undefined, hidden: attr(t, "aria-hidden") === "true" || undefined, link: link ? (link[2] ? "text" : "only") : undefined });
  }
  const jsonld = [];
  for (const m of clean.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (jsonld.length >= 30) break;
    const raw = m[1].trim();
    try { jsonld.push({ data: JSON.parse(raw) }); } catch (e) { jsonld.push({ error: String(e.message || "Invalid JSON").slice(0, 200), raw: raw.slice(0, 2000) }); }
  }
  const microdata = [...new Set([...clean.matchAll(/\sitemtype\s*=\s*["']?([^"'\s>]+)/gi)].map((m) => m[1].replace(/^https?:\/\/schema\.org\//i, "")))].slice(0, 30);
  const rdfa = [...new Set([...clean.matchAll(/\stypeof\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]))].slice(0, 30);
  // canonicals and robots tags outside <head> are ignored by Google, so report where each one is
  const headEnd = (clean.match(/<\/head>|<body[\s>]/i) || { index: clean.length }).index;
  const canonicals = [], robots = [];
  for (const m of clean.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']?[^"'>]*\bcanonical\b/i.test(m[0])) continue;
    const raw = attr(m[0], "href"); let href = null; try { href = raw ? new URL(raw, pageUrl).href : null; } catch {}
    canonicals.push({ raw, href, inBody: m.index > headEnd || undefined });
  }
  for (const m of clean.matchAll(/<meta\b[^>]*>/gi)) {
    const name = (attr(m[0], "name") || "").toLowerCase();
    if (/^(robots|googlebot|googlebot-news|bingbot)$/.test(name)) robots.push({ name, content: attr(m[0], "content") || "", inBody: m.index > headEnd || undefined });
  }
  return { headings, images, jsonld, microdata, rdfa, canonicals, robots };
}

/** GET /api/onpage?url=… */
export async function onPageApi(params, fetchImpl) {
  let u; try { u = normaliseUrl(params.get("url")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let page; try { page = await getPage(u, fetchImpl); } catch (e) { return { status: 200, body: { start: u.href, url: u.href, status: 0, error: e.name === "AbortError" ? "The page didn't answer in time." : "We couldn't connect to that page." } }; }
  const link = String(page.H("link") || ""), hdrCanon = (link.match(/<([^>]+)>\s*;[^,]*rel\s*=\s*"?canonical/i) || [])[1];
  const { title, lang } = headTags(page.html, page.url);
  return { status: 200, body: { start: u.href, url: page.url, status: page.status, ...(page.error ? { error: page.error } : {}), title, lang, xRobots: page.H("x-robots-tag") || "", linkCanonical: hdrCanon ? new URL(hdrCanon, page.url).href : "", ...onPage(page.html, page.url) } };
}
