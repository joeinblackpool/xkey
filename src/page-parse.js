// Lightweight page summary for the anchor text, plagiarism and keyword difficulty tools.
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", pound: "£" };
export const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m);
const strip = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[1] ?? m[2] ?? m[3] ?? "") : null; };

export function summarisePage(html, pageUrl) {
  html = html.slice(0, 1_000_000);
  const page = new URL(pageUrl);
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [""])[0];
  const title = strip((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || ["", ""])[1]);
  const descTag = (head.match(/<meta\b[^>]*name\s*=\s*["']?description["']?[^>]*>/i) || [""])[0];
  const body = html.replace(/<head\b[\s\S]*?<\/head>/i, "").replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1])).filter(Boolean).slice(0, 3);
  const mainHtml = (body.match(/<main\b[\s\S]*?<\/main>/i) || body.match(/<article\b[\s\S]*?<\/article>/i) || [body.replace(/<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi, " ")])[0];
  const text = strip(mainHtml.replace(/<\/(p|div|li|h[1-6]|section|article|br|td|tr)>/gi, ". ").replace(/<br\s*\/?>/gi, ". ")).replace(/(\.\s*){2,}/g, ". ").replace(/^\.\s*/, "");
  const words = (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  const links = [];
  const ranges = [...body.matchAll(/<(nav|header|footer)\b[\s\S]*?<\/\1>/gi)].map((m) => [m.index, m.index + m[0].length]);
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], "href"); if (href == null || /^(javascript:|mailto:|tel:|#)/i.test(href.trim())) continue;
    let u; try { u = new URL(href.trim(), page); u.hash = ""; } catch { continue; }
    if (!/^https?:$/.test(u.protocol)) continue;
    const img = (m[2].match(/<img\b[^>]*>/i) || [null])[0];
    const t = strip(m[2]) || (img ? attr(img, "alt") || "" : "") || attr(m[1], "aria-label") || attr(m[1], "title") || "";
    links.push({ h: u.href, t: t.slice(0, 200), rel: (attr(m[1], "rel") || "").toLowerCase(), img: !!img && !strip(m[2]), int: u.hostname.replace(/^www\./, "") === page.hostname.replace(/^www\./, ""), nav: ranges.some(([a, b]) => m.index >= a && m.index < b) });
    if (links.length >= 600) break;
  }
  const ld = [];
  for (const m of html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const walk = (o) => { if (Array.isArray(o)) return o.forEach(walk); if (o && typeof o === "object") { if (o["@type"]) ld.push(...[].concat(o["@type"])); if (o["@graph"]) walk(o["@graph"]); } }; walk(JSON.parse(m[1])); } catch {}
  }
  return { url: page.href, host: page.hostname.replace(/^www\./, ""), https: page.protocol === "https:", title, desc: attr(descTag, "content") || "", h1, words, text: text.slice(0, 60_000), links, ld: [...new Set(ld)].slice(0, 20) };
}
