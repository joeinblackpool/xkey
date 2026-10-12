// Website accessibility checker: the WCAG 2.2 problems that can be found in a page's HTML – missing
// alt text, unlabelled form fields, empty links and buttons, zoom blocked, missing language, heading
// jumps and more. Colour contrast, keyboard use and screen-reader flow need a real browser and a person,
// and the page says so.
import { normaliseUrl } from "../engine/checker.js";
import { getPage } from "./tech.js";

const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[1] ?? m[2] ?? m[3]).trim() : null; };
const has = (tag, name) => new RegExp(`\\s${name}(\\s|=|>|/)`, "i").test(tag);
const text = (h) => decode(String(h).replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ").replace(/<img\b[^>]*>/gi, (t) => " " + (attr(t, "alt") || "") + " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const short = (s, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const VAGUE = /^(click here|here|read more|more|learn more|find out more|more info|more information|this|link|this link|go|continue|details)\.?$/i;

/** Pure: checks from the HTML. Returns [{ id, name, status: pass|warn|fail|info, wcag, detail, items?, fix }] */
export function a11yCheck(html) {
  html = String(html || "").slice(0, 1_500_000).replace(/<!--[\s\S]*?-->/g, "");
  const body = html.replace(/<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, " ");
  const out = [], add = (id, name, status, wcag, detail, fix, items) => out.push({ id, name, status, wcag, detail, fix, ...(items && items.length ? { items: items.slice(0, 15) } : {}) });

  const lang = attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang");
  add("lang", "Page language", lang ? "pass" : "fail", "3.1.1", lang ? `The page says it's in "${lang}".` : "The <html> tag has no lang attribute, so screen readers may read the page in the wrong accent or language.", 'Add lang="en-GB" to the <html> tag.');

  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);
  add("title", "Page title", title ? "pass" : "fail", "2.4.2", title ? `"${short(title)}"` : "The page has no title. It's the first thing a screen reader announces.", "Give every page a unique, descriptive <title>.");

  const vp = (html.match(/<meta\b[^>]*name\s*=\s*["']?viewport[^>]*>/i) || [""])[0], vpc = (attr(vp, "content") || "").toLowerCase();
  const max = +((vpc.match(/maximum-scale\s*=\s*([\d.]+)/) || [])[1] || 0);
  const noZoom = /user-scalable\s*=\s*(no|0)/.test(vpc) || (max && max < 2);
  add("zoom", "Zooming allowed", noZoom ? "fail" : "pass", "1.4.4", noZoom ? `The viewport tag stops people zooming in (${short(vpc, 80)}). People with low vision need to pinch-zoom.` : "People can pinch-zoom the page on phones.", "Remove user-scalable=no and maximum-scale from the viewport meta tag.");

  // images
  const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]).filter((t) => !/aria-hidden\s*=\s*["']?true|role\s*=\s*["']?(presentation|none)/i.test(t));
  const noAlt = imgs.filter((t) => !has(t, "alt")), fileAlt = imgs.filter((t) => { const a = attr(t, "alt"); return a && (/\.(jpe?g|png|gif|webp|svg|avif)$/i.test(a) || /^(img|image|photo|picture|graphic|logo|banner|dsc|img_)\s*[\d_-]*$/i.test(a)); });
  const src = (t) => short((attr(t, "src") || attr(t, "data-src") || "(no src)").replace(/^https?:\/\/[^/]+/, ""), 80);
  add("alt", "Images have alt text", !imgs.length ? "info" : noAlt.length ? "fail" : "pass", "1.1.1", !imgs.length ? "No images found in the page's HTML." : noAlt.length ? `${noAlt.length} of ${imgs.length} images have no alt attribute.` : `All ${imgs.length} images have an alt attribute.`, 'Describe each meaningful image in its alt text; use alt="" for purely decorative images.', noAlt.map(src));
  if (fileAlt.length) add("altq", "Alt text is meaningful", "warn", "1.1.1", `${fileAlt.length} image${fileAlt.length > 1 ? "s have" : " has"} alt text that looks like a file name or a placeholder.`, "Write what the image shows, as you'd describe it on the phone.", fileAlt.map((t) => `${src(t)} – alt="${short(attr(t, "alt"), 40)}"`));

  // links
  const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].filter((m) => /\shref\s*=/i.test(" " + m[1]));
  const label = (open, inner) => attr("<x " + open, "aria-label") || attr("<x " + open, "title") || text(inner);
  const empty = links.filter((m) => !label(m[1], m[2]) && !/aria-labelledby/i.test(m[1]));
  const vague = links.filter((m) => VAGUE.test(label(m[1], m[2])));
  add("linkname", "Links have text", empty.length ? "fail" : "pass", "2.4.4", empty.length ? `${empty.length} link${empty.length > 1 ? "s have" : " has"} no text a screen reader can announce – often icon or image links.` : `All ${links.length} links have text.`, "Add visible text, an aria-label, or alt text on the image inside the link.", empty.map((m) => short((attr("<a " + m[1], "href") || "").replace(/^https?:\/\/[^/]+/, "") || "(no href)", 80)));
  if (vague.length) add("vague", "Link text makes sense on its own", "warn", "2.4.4", `${vague.length} link${vague.length > 1 ? "s say" : " says"} things like "click here" or "read more". Screen reader users often list links out of context.`, 'Say where the link goes: "Read our boiler servicing prices" rather than "Read more".', [...new Set(vague.map((m) => `"${label(m[1], m[2])}" → ${short((attr("<a " + m[1], "href") || "").replace(/^https?:\/\/[^/]+/, ""), 60)}`))]);

  // buttons
  const buttons = [...body.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
  const noName = buttons.filter((m) => !label(m[1], m[2]) && !/aria-labelledby/i.test(m[1]));
  add("button", "Buttons have names", !buttons.length ? "info" : noName.length ? "fail" : "pass", "4.1.2", !buttons.length ? "No buttons found." : noName.length ? `${noName.length} button${noName.length > 1 ? "s have" : " has"} no name – usually icon-only buttons such as menus or search.` : `All ${buttons.length} buttons have names.`, 'Add text or aria-label="Open menu" to icon-only buttons.', noName.map((m) => short((attr("<x " + m[1], "class") || attr("<x " + m[1], "id") || "button").replace(/\s+/g, " "), 60)));

  // form fields
  const labelsFor = new Set([...body.matchAll(/<label\b[^>]*>/gi)].map((m) => attr(m[0], "for")).filter(Boolean));
  const wrapped = [...body.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)].map((m) => m[0]);
  const fields = [...body.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((m) => m[0]).filter((t) => !/type\s*=\s*["']?(hidden|submit|button|reset|image)\b/i.test(t));
  const unlabelled = fields.filter((t) => { const id = attr(t, "id"); return !(id && labelsFor.has(id)) && !attr(t, "aria-label") && !/aria-labelledby/i.test(t) && !attr(t, "title") && !wrapped.some((w) => w.includes(t)); });
  add("labels", "Form fields have labels", !fields.length ? "info" : unlabelled.length ? "fail" : "pass", "1.3.1, 4.1.2", !fields.length ? "No form fields found." : unlabelled.length ? `${unlabelled.length} of ${fields.length} form fields have no label. Placeholder text disappears when you type and isn't a label.` : `All ${fields.length} form fields have labels.`, "Give each field a <label for=\"…\"> (it can be visually hidden), or an aria-label.", unlabelled.map((t) => short(`${t.match(/<(\w+)/)[1]}${attr(t, "name") ? ` name="${attr(t, "name")}"` : ""}${attr(t, "placeholder") ? ` placeholder="${attr(t, "placeholder")}"` : ""}`, 80)));

  // headings
  const hs = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => [+m[1], text(m[2])]);
  const h1 = hs.filter(([l]) => l === 1).length, jumps = [];
  for (let i = 1; i < hs.length; i++) if (hs[i][0] > hs[i - 1][0] + 1) jumps.push(`h${hs[i - 1][0]} → h${hs[i][0]} "${short(hs[i][1], 50)}"`);
  const emptyH = hs.filter(([, t]) => !t);
  add("headings", "Headings are in order", !hs.length ? "fail" : jumps.length || h1 !== 1 || emptyH.length ? "warn" : "pass", "1.3.1, 2.4.6", !hs.length ? "The page has no headings, so screen reader users can't jump between sections." : [h1 !== 1 ? `${h1} main (h1) headings – one is best.` : "", jumps.length ? `${jumps.length} heading level${jumps.length > 1 ? "s are" : " is"} skipped.` : "", emptyH.length ? `${emptyH.length} empty heading${emptyH.length > 1 ? "s" : ""}.` : ""].filter(Boolean).join(" ") || `${hs.length} headings, in a sensible order.`, "Use one h1, then h2 for sections and h3 inside them, without skipping levels.", jumps);

  const main = /<main\b|role\s*=\s*["']?main/i.test(body);
  add("main", "Main content landmark", main ? "pass" : "warn", "1.3.1, 2.4.1", main ? "The page marks its main content with <main>." : "No <main> element, so screen reader users can't jump straight to the content.", "Wrap the main content in <main>.");
  const skip = /<a\b[^>]*href\s*=\s*["']#(main|content|maincontent|main-content|skip)[^"']*["']/i.test(body.slice(0, 40000));
  add("skip", "Skip to content link", skip ? "pass" : "info", "2.4.1", skip ? "There's a link to skip past the menu." : "No 'skip to content' link found near the top. Helpful for keyboard users on pages with long menus.", 'Add <a href="#main" class="skip">Skip to content</a> as the first thing in the page.');

  const frames = [...body.matchAll(/<iframe\b[^>]*>/gi)].map((m) => m[0]), untitled = frames.filter((t) => !attr(t, "title") && !attr(t, "aria-label"));
  if (frames.length) add("iframe", "Embedded frames have titles", untitled.length ? "fail" : "pass", "4.1.2", untitled.length ? `${untitled.length} embedded frame${untitled.length > 1 ? "s" : ""} (maps, videos, booking widgets) have no title.` : "Every embedded frame has a title.", 'Add title="Map of our location" (or similar) to each <iframe>.', untitled.map((t) => short(attr(t, "src") || "(no src)", 80)));

  const media = [...body.matchAll(/<(video|audio)\b[^>]*>/gi)].map((m) => m[0]).filter((t) => has(t, "autoplay") && !has(t, "muted"));
  if (media.length) add("autoplay", "No sound plays on its own", "fail", "1.4.2", `${media.length} video or audio element${media.length > 1 ? "s play" : " plays"} automatically with sound.`, "Mute autoplaying media, or let visitors start it themselves.");

  const tables = [...body.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].filter((m) => !/role\s*=\s*["']?(presentation|none)/i.test(m[0].slice(0, 200)));
  const noTh = tables.filter((m) => !/<th\b/i.test(m[1]));
  if (tables.length) add("tables", "Data tables have headers", noTh.length ? "warn" : "pass", "1.3.1", noTh.length ? `${noTh.length} table${noTh.length > 1 ? "s have" : " has"} no header cells (<th>).` : "Tables use header cells.", "Mark header rows or columns with <th>.");

  const tab = [...body.matchAll(/tabindex\s*=\s*["']?([1-9]\d*)/gi)].length;
  if (tab) add("tabindex", "Natural keyboard order", "warn", "2.4.3", `${tab} element${tab > 1 ? "s use" : " uses"} a positive tabindex, which changes the order the keyboard moves through the page.`, 'Use tabindex="0" or remove it, and order the HTML the way it should be read.');

  const ids = [...body.matchAll(/\sid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]), dup = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (dup.length) add("ids", "Unique IDs", "warn", "1.3.1", `${dup.length} ID${dup.length > 1 ? "s are" : " is"} used more than once. Labels and ARIA references can point at the wrong element.`, "Make every id on the page unique.", dup);

  return out;
}

/** GET /api/a11y?url=… */
export async function a11yApi(params, fetchImpl) {
  let u; try { u = normaliseUrl(params.get("url")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let page; try { page = await getPage(u, fetchImpl); } catch (e) { return { status: 200, body: { url: u.href, status: 0, error: e.name === "AbortError" ? "The page didn't answer in time." : "We couldn't connect to that page." } }; }
  if (page.error || page.status >= 400 || !page.html) return { status: 200, body: { url: page.url, status: page.status, error: page.error || `The page answered with HTTP ${page.status}.` } };
  const checks = a11yCheck(page.html), scored = checks.filter((c) => c.status !== "info");
  const score = scored.length ? Math.round((100 * scored.reduce((n, c) => n + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0)) / scored.length) : 100;
  return { status: 200, body: { url: page.url, status: page.status, score, checks } };
}
