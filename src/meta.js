// Head tags of one page – every <meta>, <link> and the <title> – for the Open Graph checker and the
// hreflang checker. The browser does the checking; this only fetches and parses.
import { normaliseUrl } from "../engine/checker.js";
import { getPage } from "./tech.js";

const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[1] ?? m[2] ?? m[3]).trim() : null; };

/** { title, metas: [{ key, content }], links: [{ rel, href, hreflang?, type?, sizes? }], lang } from a page's HTML */
export function headTags(html, pageUrl) {
  html = String(html || "").slice(0, 1_000_000);
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [html.split(/<body[\s>]/i)[0]])[0].replace(/<!--[\s\S]*?-->/g, "");
  const title = decode((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).replace(/\s+/g, " ").trim();
  const metas = [], links = [];
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const key = attr(m[0], "property") || attr(m[0], "name") || attr(m[0], "itemprop") || attr(m[0], "http-equiv");
    const content = attr(m[0], "content");
    if (key && content != null && metas.length < 200) metas.push({ key: key.toLowerCase(), content: content.slice(0, 1000) });
  }
  for (const m of head.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (attr(m[0], "rel") || "").toLowerCase(), raw = attr(m[0], "href");
    if (!rel || !raw || links.length >= 300) continue;
    let href; try { href = new URL(raw, pageUrl).href; } catch { continue; }
    const l = { rel, href }; for (const k of ["hreflang", "type", "sizes"]) { const v = attr(m[0], k); if (v) l[k] = v; }
    links.push(l);
  }
  const lang = attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang") || "";
  return { title, metas, links, lang };
}

/** GET /api/meta?url=… */
export async function metaApi(params, fetchImpl) {
  let u; try { u = normaliseUrl(params.get("url")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let page; try { page = await getPage(u, fetchImpl); } catch (e) { return { status: 200, body: { start: u.href, url: u.href, status: 0, error: e.name === "AbortError" ? "The page didn't answer in time." : "We couldn't connect to that page." } }; }
  // hreflang can also be sent as a Link header
  const header = String(page.H("link") || "");
  const hdrLinks = [...header.matchAll(/<([^>]+)>\s*;([^,]*hreflang\s*=\s*"?([\w-]+)"?[^,]*)/gi)].map((m) => ({ rel: "alternate", href: new URL(m[1], page.url).href, hreflang: m[3], header: true }));
  const t = headTags(page.html, page.url);
  return { status: 200, body: { start: u.href, url: page.url, status: page.status, ...(page.error ? { error: page.error } : {}), ...t, links: [...t.links, ...hdrLinks] } };
}
