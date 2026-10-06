// IceWork SEO Checker – audits one public page plus the site files around it (robots.txt, sitemap,
// llms.txt, the www / non-www twin, a sample of internal links) across ten areas, including
// AI-search readiness and real Core Web Vitals (via Google PageSpeed Insights, fetched separately).
// analyse() is pure (testable in Node); runCheck() / runVitals() do the network work.

const MAX_BYTES = 1_000_000;
const TIMEOUT_MS = 10_000;
const LINK_SAMPLE = 12;
// Cloudflare Workers (free plan) allow 50 subrequests per request. Keep page fetches well under that,
// leaving room for the Cache API reads/writes used by caching and rate limiting.
const FETCH_BUDGET = 40;
const SITEMAP_MAX = 5_000; // sitemap URLs handed to the audit client
const SITEMAP_READ = 1_000_000; // bytes of sitemap read by the single-page check (decoding is ~4 ms CPU per MB)
const SITEMAP_READ_AUDIT = 1_500_000; // total sitemap bytes read when starting a site audit
export const UA = "IceWorkSEOChecker/2.0 (+https://icework.co.uk/seo-checker)";
export const UA_TOKEN = "iceworkseochecker"; // robots.txt product token we obey in the site audit

// ---------- helpers
const AW = {};
"abdeghnopqu0123456789$£?_#".split("").forEach((c) => (AW[c] = 1139));
"ckszvxy".split("").forEach((c) => (AW[c] = 1024));
Object.assign(AW, { f: 569, i: 455, j: 455, l: 455, m: 1706, r: 682, t: 569, w: 1479, " ": 569, ".": 569, ",": 569, ":": 569, ";": 569, "!": 569, "-": 682, "–": 1139, "—": 2048, "|": 532, "&": 1366, "'": 391, "’": 391, '"': 727, "(": 682, ")": 682, "/": 569, "+": 1196, "%": 1821, "@": 2079, "*": 797 });
Object.assign(AW, { A: 1366, B: 1366, C: 1479, D: 1479, E: 1366, F: 1251, G: 1593, H: 1479, I: 569, J: 1024, K: 1366, L: 1139, M: 1706, N: 1479, O: 1593, P: 1366, Q: 1593, R: 1479, S: 1366, T: 1251, U: 1479, V: 1366, W: 1933, X: 1366, Y: 1366, Z: 1251 });
/** Approximate rendered width in Arial (Google's SERP font) at the given size. */
export const pixelWidth = (s, px = 20) => Math.round([...s].reduce((t, c) => t + (AW[c] ?? 1139), 0) / 2048 * px);

const cp = (n) => { try { return String.fromCodePoint(n); } catch { return ""; } };
const decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;|&#x0*27;/gi, "'").replace(/&#(\d+);/g, (_, n) => cp(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => cp(parseInt(n, 16)));
const text = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")); return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null; };
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => m[0]);
const meta = (head, key, val) => { for (const t of tags(head, "meta")) if ((attr(t, key) || "").toLowerCase() === val) return attr(t, "content"); return null; };
const STOP = new Set("a an and are as at be by for from has have in is it its of on or that the this to was were will with you your we our i me my not but if so can do does how what when where which who why".split(" "));
const syllables = (w) => { w = w.toLowerCase().replace(/[^a-z]/g, ""); if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, ""); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
/** Very light stemmer so "chargers" in a title matches "charger" in the text. */
const stem = (w) => (w.length > 4 ? w.replace(/(?:ies|es|s|ing|ed)$/, "") : w);
const stripNoise = (html) => html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ").replace(/<template\b[\s\S]*?<\/template>/gi, " ");
/** Main content: <main> if present, else <body> without nav/header/footer/aside boilerplate. */
const mainOf = (body) => (body.match(/<main\b[\s\S]*<\/main>/i) || [null])[0] || body.replace(/<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
const sameSite = (a, b) => a.replace(/^www\./, "") === b.replace(/^www\./, "");
const noSlash = (u) => u.replace(/\/$/, "");
// Search crawlers (blocking these removes you from search and AI answers) vs training-only crawlers
// (blocking these is a content-licensing choice; each company documents them as separate from search).
const SEARCH_BOTS = [["Googlebot", "Google Search & AI Overviews"], ["Bingbot", "Bing & Copilot"], ["OAI-SearchBot", "ChatGPT search"], ["ChatGPT-User", "ChatGPT browsing"], ["Claude-SearchBot", "Claude search"], ["Claude-User", "Claude browsing"], ["PerplexityBot", "Perplexity"], ["Applebot", "Siri & Spotlight"]];
const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"];
const IMPACT = { critical: 5, high: 3, medium: 2, low: 1 };
const LB_RE = /LocalBusiness|Store|Restaurant|Hotel|ProfessionalService|Dentist|Plumber|Electrician|AutoRepair|HealthAndBeauty|LegalService|RealEstateAgent|HomeAndConstructionBusiness|FoodEstablishment|LodgingBusiness|MedicalBusiness|AutomotiveBusiness|FinancialService|SportsActivityLocation|EntertainmentBusiness/;
// UK phone numbers: 01/02/03/05/07/08/09 + 8–9 more digits, or +44 / 0044 forms.
const PHONE_UK = /(?:(?:\+44|\b0044)\s?(?:\(0\)\s?)?|\b0)[1-35789](?:[\s-]?\d){8,9}(?!\d)/;
// UK postcodes; the inward code never uses C I K M O V.
const POSTCODE_UK = /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[ABD-HJLNP-UW-Z]{2}\b/;

// ---------- robots.txt (RFC 9309 / Google's documented behaviour)
const robotsCache = new Map();
/** Parse robots.txt into groups. Each rule carries a precompiled matcher. */
export function parseRobots(robots) {
  if (robotsCache.has(robots)) return robotsCache.get(robots);
  const groups = []; let cur = null, lastWasUA = false;
  for (const raw of robots.slice(0, 500_000).split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*/, "").trim(); if (!line) continue;
    const i = line.indexOf(":"); if (i < 0) continue;
    const k = line.slice(0, i).trim().toLowerCase(), v = line.slice(i + 1).trim();
    if (k === "user-agent") {
      if (!lastWasUA || !cur) { cur = { agents: [], rules: [] }; groups.push(cur); }
      // product token only: "Googlebot/2.1" -> "googlebot"
      const tok = v === "*" ? "*" : (v.match(/^[A-Za-z_-]+/) || [""])[0].toLowerCase();
      if (tok) cur.agents.push(tok);
      lastWasUA = true;
    } else if (k === "allow" || k === "disallow") {
      lastWasUA = false;
      if (cur && v) {
        const pat = v.replace(/[^\x00-\x7f]/gu, (c) => encodeURIComponent(c));
        const re = new RegExp("^" + pat.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
        cur.rules.push({ allow: k === "allow", len: pat.length, re });
      }
    } else if (k !== "sitemap") lastWasUA = false; // other records (crawl-delay…) end the user-agent run; sitemap lines are group-independent
  }
  if (robotsCache.size > 20) robotsCache.clear();
  robotsCache.set(robots, groups);
  return groups;
}
/**
 * May `agent` fetch `path` (path + query)? `agent` is a product token or a list of tokens in fallback
 * order (e.g. ["googlebot-image", "googlebot"]). All groups naming the agent are merged; a specific
 * group replaces "*" entirely; longest matching rule wins and Allow wins a tie.
 */
export function robotsAllows(robots, agent, path) {
  if (!robots) return true;
  const groups = typeof robots === "string" ? parseRobots(robots) : robots;
  let rules = null;
  for (const t of [].concat(agent).map((a) => a.toLowerCase())) {
    const m = groups.filter((g) => g.agents.includes(t));
    if (m.length) { rules = m.flatMap((g) => g.rules); break; }
  }
  if (!rules) rules = groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules);
  if (path === "/robots.txt") return true;
  let best = null;
  for (const r of rules) if (r.re.test(path) && (!best || r.len > best.len || (r.len === best.len && r.allow))) best = r;
  return !best || best.allow;
}

/** Analyse a fetched page plus the facts gathered around it. Pure: no network. */
export function analyse(f) {
  const H = (k) => (f.headers && (f.headers.get ? f.headers.get(k) : f.headers[k.toLowerCase()])) || null;
  const raw = f.html || "";
  const clean = stripNoise(raw);
  const head = (raw.match(/<head\b[\s\S]*?<\/head>/i) || [raw.slice(0, 20000)])[0];
  const body = (clean.match(/<body\b[\s\S]*<\/body>/i) || [clean])[0];
  const mainHtml = mainOf(body);
  const page = new URL(f.finalUrl || f.url);
  const cats = [];
  const cat = (name, blurb) => { const c = { name, blurb, checks: [] }; cats.push(c);
    return (name, impact, status, notes, fix) => c.checks.push({ name, impact, status, notes: [].concat(notes).filter(Boolean), fix: status === "pass" || status === "info" ? null : fix || null }); };
  const P = (ok, warn) => (ok ? "pass" : warn ? "warn" : "fail");
  const robots = f.robots ? parseRobots(f.robots) : null;
  const robotsPath = page.pathname + page.search;

  // ---------------- facts shared by several checks
  const site = page.hostname.replace(/^www\./, "");
  const brand = site.split(".")[0].toLowerCase();
  const title = text((raw.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);
  const titleWordsAll = title.toLowerCase().split(/[^\p{L}\p{N}£]+/u).filter((w) => w.length > 2 && !STOP.has(w));
  const titleWords = [...new Set(titleWordsAll.filter((w) => w !== brand))];
  const desc = meta(head, "name", "description") || "";
  const bodyText = text(body);
  const mainText = text(mainHtml);
  const words = mainText ? mainText.split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w)) : [];
  const wc = words.length;
  const hs = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => [+m[1], text(m[2])]);
  const h1s = hs.filter((x) => x[0] === 1); const h1 = h1s[0] ? h1s[0][1] : "";
  const ldBlocks = [...raw.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const ld = [], ldErrors = [], top = new Set();
  const walk = (o, isTop) => { if (Array.isArray(o)) return o.forEach((x) => walk(x, isTop)); if (o && typeof o === "object") { if (o["@type"]) { ld.push(o); if (isTop) top.add(o); } if (o["@graph"]) walk(o["@graph"], true); for (const [k, v] of Object.entries(o)) if (k !== "@graph" && v && typeof v === "object") walk(v, false); } };
  ldBlocks.forEach((s, i) => {
    let j; try { j = JSON.parse(s.trim().replace(/^<!\[CDATA\[|\]\]>$/g, "")); } catch { ldErrors.push(`Block ${i + 1}: invalid JSON`); return; }
    const ctxOk = [].concat(j).every((x) => !x || typeof x !== "object" || /schema\.org/i.test(JSON.stringify(x["@context"] || "")));
    if (!ctxOk) ldErrors.push(`Block ${i + 1}: no schema.org @context`);
    walk(j, true);
  });
  const types = (o) => [].concat(o["@type"]).map(String);
  const hasType = (re) => ld.filter((o) => types(o).some((t) => re.test(t)));
  const robotsMeta = ((meta(head, "name", "robots") || "") + " " + (meta(head, "name", "googlebot") || "") + " " + (H("x-robots-tag") || "")).toLowerCase();
  const canonTags = tags(clean, "link").filter((t) => /rel\s*=\s*["']?canonical["'\s>]/i.test(t));
  const linkHeaderCanon = ((H("link") || "").match(/<([^>]+)>\s*;[^,]*rel\s*=\s*"?canonical/i) || [])[1] || null;
  const canonical = canonTags.length ? attr(canonTags[0], "href") : linkHeaderCanon;
  const links = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({ tag: m[0], href: (attr(m[0], "href") || "").trim() || null, text: (text(m[2]) || attr(m[0], "aria-label") || attr(m[0], "title") || (attr(m[0], "aria-labelledby") ? "[labelled]" : "") || (/<img\b[^>]*alt\s*=\s*["'][^"']+/i.test(m[2]) ? "[image]" : "")).trim() }));
  const webLinks = links.filter((l) => l.href && !/^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(l.href)).map((l) => { try { return { ...l, u: new URL(l.href, page) }; } catch { return null; } }).filter((l) => l && /^https?:$/.test(l.u.protocol));
  const internal = webLinks.filter((l) => sameSite(l.u.hostname, page.hostname));
  const external = webLinks.filter((l) => !sameSite(l.u.hostname, page.hostname));
  const imgs = tags(body, "img");
  // sub-resources the browser actually loads (not <a> links or rel=canonical/alternate)
  const resources = [...raw.replace(/<!--[\s\S]*?-->/g, " ").matchAll(/<(script|link|img|iframe|source|video|audio|embed|track)\b[^>]*>/gi)].flatMap((m) => {
    const t = m[0], n = m[1].toLowerCase();
    if (n === "link") { const rel = (attr(t, "rel") || "").toLowerCase(); return /stylesheet|icon|preload|modulepreload|manifest/.test(rel) ? [attr(t, "href")] : []; }
    return [attr(t, "src"), attr(t, "poster"), ...((attr(t, "srcset") || "").split(",").map((s) => s.trim().split(/\s+/)[0]))];
  }).filter(Boolean);

  // ================= 1. Indexing & crawling
  const I = cat("Indexing & crawling", "Can search engines reach, read and index this page?");
  const noindex = /\b(noindex|none)\b/.test(robotsMeta);
  I("Status code", "critical", P(f.status === 200), `The page returned HTTP ${f.status}.`, "Make sure the page returns 200 OK.");
  I("Indexable", "critical", P(!noindex), noindex ? "The page tells search engines not to index it (noindex)." : "No noindex instruction – the page can appear in search.", "Remove the noindex meta tag or X-Robots-Tag header if this page should be found.");
  const gAllowed = robotsAllows(robots, "googlebot", robotsPath);
  const rs = f.robotsStatus;
  const robotsDown = rs === 0 || rs === 429 || rs >= 500;
  I("robots.txt", robotsDown ? "critical" : "high", robotsDown ? "fail" : P(f.robots != null && gAllowed, gAllowed),
    robotsDown ? `robots.txt ${rs ? `returned HTTP ${rs}` : "could not be reached"}. Google treats an unavailable robots.txt as "don't crawl" and pauses crawling the site until it loads.`
      : [f.robots == null ? `No robots.txt found${rs ? ` (HTTP ${rs})` : ""} – crawlers may read everything.` : "robots.txt found.", gAllowed ? "Googlebot is allowed to crawl this page." : "robots.txt BLOCKS Googlebot from this page."],
    robotsDown ? "Make /robots.txt return 200 (or 404 if you don't need one) – check your server, firewall or bot protection." : f.robots == null ? "Add a robots.txt that allows crawling and lists your sitemap." : "Remove or narrow the Disallow rule that blocks this page.");
  const sm = f.sitemap;
  I("XML sitemap", "high", P(sm && sm.urls > 0 && sm.inRobots, sm && sm.urls > 0), sm ? [sm.index ? `Sitemap index found at ${sm.url} listing ${sm.urls.toLocaleString("en-GB")} sitemap${sm.urls === 1 ? "" : "s"}.` : `Sitemap found at ${sm.url} with ${sm.more ? "over " : ""}${sm.urls.toLocaleString("en-GB")} URL${sm.urls === 1 ? "" : "s"}${sm.more ? " (we read the first 1 MB)" : ""}.`, sm.inRobots ? "Declared in robots.txt." : "Not declared in robots.txt.", sm.listsPage === true ? "This page is listed in it." : sm.listsPage === false ? "This page is NOT listed in it." : null, sm.lastmod ? `Most recent lastmod: ${sm.lastmod}.` : "No lastmod dates – add accurate ones so search engines know what changed."] : "No XML sitemap found at /sitemap.xml or in robots.txt.", sm ? "Add a 'Sitemap:' line to robots.txt, list every indexable page and include accurate lastmod dates." : "Create an XML sitemap listing every page and submit it in Google Search Console.");
  // canonical
  let canonU = null; try { canonU = canonical ? new URL(canonical, page) : null; } catch {}
  const canonAbs = canonical && /^https?:\/\//i.test(canonical);
  const canonSet = new Set(canonTags.map((t) => { try { return new URL(attr(t, "href") || "", page).href; } catch { return "?"; } }));
  const canonConflict = canonSet.size > 1;
  const pageNoQuery = page.origin + page.pathname;
  const canonSelf = !!canonU && noSlash(canonU.href) === noSlash(page.href);
  const canonClean = !!canonU && !canonSelf && page.search && noSlash(canonU.href) === noSlash(pageNoQuery);
  I("Canonical URL", "high", canonConflict ? "fail" : P(canonU && canonAbs && (canonSelf || canonClean), canonU),
    canonConflict ? `${canonSet.size} different canonical tags – Google ignores conflicting canonicals.` : canonU ? [`Canonical: ${canonical}${!canonTags.length ? " (from the HTTP Link header)" : ""}`,
      canonSelf ? "Points to this page (self-referencing)." : canonClean ? "Points to this address without its query string – correct for tracking or filter parameters." : "Points to a DIFFERENT address – Google will probably index that one instead of this page.",
      canonAbs ? null : "Google accepts relative canonicals but recommends a full absolute URL.",
      page.protocol === "https:" && canonU.protocol === "http:" ? "The canonical uses http:// although the page is on https://." : null,
      !sameSite(canonU.hostname, page.hostname) ? "The canonical points to a different website." : canonU.hostname !== page.hostname ? "The canonical uses the other www / non-www version of your domain." : null,
      noindex && !canonSelf ? "The page is also noindex – mixed signals." : null] : "No canonical tag.",
    canonConflict ? "Keep exactly one canonical tag per page." : "Add <link rel=\"canonical\" href=\"(this page's full URL)\"> – only point it elsewhere for true duplicates.");
  const chain = f.chain || [];
  const sameHop = chain.length <= 1 || chain.every((h) => { try { return sameSite(new URL(h).hostname, page.hostname); } catch { return false; } });
  I("Redirects", "high", P(f.redirects === 0 || (f.redirects === 1 && sameHop), f.redirects <= 2 && sameHop),
    f.redirects ? [`${f.redirects} redirect${f.redirects > 1 ? "s" : ""} before the page loaded${f.redirects > 1 ? " – a chain slows visitors and wastes crawl budget" : ""}.`, chain.length ? `${chain.concat(page.href).join(" → ")}` : null, f.redirects === 1 && sameHop ? "A single redirect to your preferred address is normal; just make sure your own links use the final address." : null] : "Loads directly with no redirects.",
    "Link straight to the final address and make each redirect go to its destination in one hop.");
  I("www / non-www", "medium", P(f.wwwOk !== false), f.wwwNote || "Not tested.", "Pick one version (with or without www) and 301-redirect the other to it.");
  const hreflang = tags(head, "link").filter((t) => /hreflang\s*=/i.test(t) && /rel\s*=\s*["']?alternate/i.test(t));
  if (hreflang.length) {
    const entries = hreflang.map((t) => [(attr(t, "hreflang") || "").trim(), attr(t, "href") || ""]);
    const badCode = entries.filter(([c]) => !/^(x-default|[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?)$/i.test(c) || /^(gb|jp|cn|dk)(-|$)/i.test(c) || /-(uk|eu)$/i.test(c)).map(([c]) => c || "(empty)");
    const rel = entries.filter(([, h]) => !/^https?:\/\//i.test(h)).length;
    const self = entries.some(([, h]) => { try { return noSlash(new URL(h, page).href) === noSlash(page.href); } catch { return false; } });
    const xdef = entries.some(([c]) => /^x-default$/i.test(c));
    I("hreflang", "medium", P(!badCode.length && self && !rel, !badCode.length), [`${entries.length} hreflang link(s).`, badCode.length ? `Invalid codes: ${[...new Set(badCode)].slice(0, 5).join(", ")} (use ISO codes such as en-gb – "uk" is not a valid region, use "gb").` : "All language codes are valid.", self ? null : "The list doesn't include this page itself – Google requires each page to list itself.", rel ? `${rel} use relative URLs – Google requires fully qualified URLs.` : null, xdef ? null : "No x-default (recommended for a language picker or fallback page)."], "Use valid ISO language(-region) codes, absolute URLs, include this page itself, and make sure every alternate links back.");
  }

  // ================= 2. Snippets & sharing
  const M = cat("Search snippet & sharing", "How the page looks in Google results and when shared.");
  const tpx = pixelWidth(title, 20);
  const dupTitle = [...new Set(titleWordsAll.filter((w, i) => titleWordsAll.indexOf(w) !== i))];
  M("Title tag", "critical", P(title && tpx >= 250 && tpx <= 580 && !dupTitle.length, title && tpx <= 620), title ? [`“${title}”`, `About ${tpx}px of Google's ~580px desktop width${tpx > 580 ? " – it will probably be cut off" : tpx < 250 ? " – short; use the space" : ""}.`, dupTitle.length ? `Repeated words: ${dupTitle.join(", ")}.` : null] : "No <title> found.", "Write a unique title of roughly 50–60 characters with the main search phrase first.");
  const dpx = pixelWidth(desc, 14);
  M("Meta description", "high", P(desc && dpx >= 500 && dpx <= 990, !!desc), desc ? [`${desc.length} characters, ~${dpx}px of ~990px.`, dpx > 990 ? "Long – Google will probably truncate it." : dpx < 500 ? "Short – sell the click with a benefit and a call to action." : "Good length.", "Google sometimes rewrites descriptions to match the search; a good one is still used most often."] : "No meta description – Google will pick text from the page.", "Write a 140–155 character description that answers the searcher's question and invites the click.");
  const og = { t: meta(head, "property", "og:title"), d: meta(head, "property", "og:description"), i: meta(head, "property", "og:image"), u: meta(head, "property", "og:url") };
  const tw = meta(head, "name", "twitter:card");
  M("Open Graph & social cards", "medium", P(og.t && og.i && og.d && !/\.svg(\?|$)/i.test(og.i || ""), og.t || og.i), [og.t && og.i ? "Open Graph title and image set." : "Open Graph title or image missing.", og.t && og.i && !og.d ? "No og:description." : null, og.i && /\.svg(\?|$)/i.test(og.i) ? "og:image is an SVG – Facebook, LinkedIn and WhatsApp won't show it. Use PNG or JPG (1200×630)." : null, og.i && !/^https?:\/\//i.test(og.i) ? "og:image should be a full absolute URL." : null, tw ? `Twitter/X card: ${tw}.` : "No twitter:card tag."], "Add og:title, og:description, og:image (1200×630 PNG/JPG, absolute URL) and twitter:card=summary_large_image.");
  const favicon = tags(head, "link").some((t) => /rel\s*=\s*["']?[^"'>]*icon/i.test(t));
  M("Favicon", "low", P(favicon), favicon ? "Favicon linked (Google shows it next to results)." : "No favicon linked.", "Add a square favicon at least 48×48px.");
  const lang = attr((raw.match(/<html\b[^>]*>/i) || [""])[0], "lang");
  M("Language", "low", P(!!lang), lang ? `lang="${lang}"` : "No lang attribute on <html>.", "Add lang=\"en-GB\" (or your language) to the <html> tag.");

  // ================= 3. Content quality
  const C = cat("Content quality", "Is there enough clear, useful text that matches what the page targets?");
  C("Word count", "medium", P(wc >= 400, wc >= 200), [`${wc.toLocaleString("en-GB")} words of main content${/<main\b/i.test(body) ? " (inside <main>)" : " (menus and footer excluded)"}.`, "Google has no minimum word count – this is a rough guide to whether the page answers the question in full."], "Add genuinely useful content: key service pages usually need 400+ words to answer what customers ask.");
  // Readability on prose only (paragraphs, list items…), so menus and headings don't distort it.
  const prose = [...mainHtml.matchAll(/<(p|li|blockquote|dd|td|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => text(m[2])).filter((s) => s.split(" ").length >= 4);
  const proseText = prose.map((s) => (/[.!?]["')\]]?$/.test(s) ? s : s + ".")).join(" ");
  const pWords = proseText ? proseText.split(" ").filter((w) => /[a-z]/i.test(w)).slice(0, 3000) : [];
  const pSentences = proseText ? proseText.split(/[.!?]+["')\]]?(?:\s|$)/).filter((s) => s.trim().split(/\s+/).length >= 2).length : 0;
  const english = !lang || /^en\b/i.test(lang);
  if (!english) C("Readability", "medium", "info", `Reading-ease scores only work for English; this page is lang="${lang}".`);
  else if (pWords.length < 100 || !pSentences) C("Readability", "medium", "info", "Not enough paragraph text to score readability.");
  else {
    const sylls = pWords.reduce((t, w) => t + syllables(w), 0);
    const flesch = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (pWords.length / pSentences) - 84.6 * (sylls / pWords.length))));
    C("Readability", "medium", P(flesch >= 50, flesch >= 30), `Flesch reading ease ${flesch} (${flesch >= 60 ? "plain English" : flesch >= 50 ? "fairly easy" : flesch >= 30 ? "fairly difficult" : "difficult"}), about ${Math.round(pWords.length / pSentences)} words per sentence.`, "Use shorter sentences and everyday words – aim for a score of 50+ for customer-facing pages.");
  }
  const lowerMain = (mainText + " " + hs.map((x) => x[1]).join(" ")).toLowerCase();
  const covered = titleWords.filter((w) => lowerMain.includes(stem(w)));
  C("Topic focus", "high", titleWords.length ? P(covered.length / titleWords.length >= 0.75, covered.length / titleWords.length >= 0.5) : "info", titleWords.length ? `${covered.length} of ${titleWords.length} title keywords appear in the main content${covered.length < titleWords.length ? ` (missing: ${titleWords.filter((w) => !covered.includes(w)).join(", ")})` : ""}.` : "No title keywords to compare.", "Use your main title phrases naturally in the opening paragraph and headings.");
  const h1Lower = h1.toLowerCase();
  const h1Overlap = titleWords.filter((w) => h1Lower.includes(stem(w))).length;
  C("H1 heading", "critical", P(h1s.length === 1 && h1 && (h1Overlap > 0 || !titleWords.length), h1s.length === 1 || (h1s.length > 1 && h1)), h1s.length ? [h1s.length > 1 ? `${h1s.length} H1 headings – one clear H1 is best practice.` : `“${h1}”`, h1 && !h1Overlap && titleWords.length ? "The H1 shares no keywords with the title." : null, !h1 ? "The H1 is empty." : null] : "No H1 heading.", "Use one H1 that states the page topic with its main keyword.");
  let skipped = 0; for (let i = 1; i < hs.length; i++) if (hs[i][0] > hs[i - 1][0] + 1) skipped++;
  const emptyH = hs.filter((x) => !x[1]).length;
  const tooMany = hs.length > Math.max(12, wc / 40);
  C("Heading structure", "medium", P(!skipped && !tooMany && !emptyH && hs.length >= 2, !tooMany && skipped <= 2), [`${hs.length} headings for ${wc} words${tooMany ? " – a lot for the amount of text" : ""}.`, skipped ? `${skipped} skipped level(s), e.g. H2 → H4.` : "Levels are in order.", emptyH ? `${emptyH} empty heading(s).` : null], "Use H2s for main sections and H3s inside them, without skipping levels.");
  const codeRatio = raw.length ? Math.round((bodyText.length / raw.length) * 100) : 0;
  C("Text-to-code ratio", "low", P(codeRatio >= 10, codeRatio >= 5), `${codeRatio}% of the HTML is visible text.`, "Trim unused markup, inline scripts and builder bloat.");

  // ================= 4. AI search readiness
  const A = cat("AI search readiness", "Can ChatGPT, Claude, Perplexity and Google AI Overviews read, understand and cite this site?");
  const blockedSearch = SEARCH_BOTS.filter(([b]) => !robotsAllows(robots, b.toLowerCase(), robotsPath));
  const blockedTrain = TRAINING_BOTS.filter((b) => !robotsAllows(robots, b.toLowerCase(), robotsPath));
  const coreBlocked = blockedSearch.filter(([b]) => b === "Googlebot" || b === "Bingbot");
  A("AI crawler access", "high", P(!blockedSearch.length, !coreBlocked.length), [blockedSearch.length ? `robots.txt blocks search crawlers: ${blockedSearch.map(([b, d]) => `${b} (${d})`).join(", ")}.` : "Search and AI-search crawlers (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot…) can read this page.", blockedTrain.length ? `Training-only crawlers blocked: ${blockedTrain.join(", ")}. That's a licensing choice – these companies document them as separate from their search crawlers.` : null], "Allow Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot so search and AI tools can cite you (you can still block training-only bots such as GPTBot or Google-Extended).");
  const snipMax = (robotsMeta.match(/max-snippet\s*:\s*(-?\d+)/) || [])[1];
  const nosnippet = /\bnosnippet\b/.test(robotsMeta) || snipMax === "0";
  A("Snippet controls", "high", P(!nosnippet && !(snipMax && +snipMax > 0 && +snipMax < 50), !nosnippet), nosnippet ? "nosnippet / max-snippet:0 is set – Google won't show text from this page in results or use it in AI Overviews." : snipMax && +snipMax > 0 && +snipMax < 50 ? `max-snippet:${snipMax} limits how much text Google can quote.` : "No snippet restrictions – search and AI answers can quote this page.", "Remove nosnippet / max-snippet limits unless you deliberately want to stop quotes (use data-nosnippet on specific sections instead).");
  A("llms.txt", "low", P(f.llms === true), f.llms ? "/llms.txt found." : "No /llms.txt file. It's an optional, emerging convention – few AI tools are confirmed to read it yet, so this is low priority.", "Optionally add /llms.txt: a short Markdown summary of who you are with links to your key pages.");
  // Count only real questions: ends with "?" or opens with a clearly interrogative form ("How…", "Is…", "What is…") –
  // not statements such as "What we do" or "What the rules guarantee".
  const qHeads = hs.filter(([n, t]) => n >= 2 && (/\?\s*$/.test(t) || /^(how|why|can|could|do|does|did|is|are|was|should|will|would)\s+\S+\s+\S+/i.test(t) && !/^how (it|we) work/i.test(t) || /^(what|which|who|when|where)('s|\s+(is|are|was|were|does|do|did|can|should|will|would|happens|makes|counts))\b/i.test(t)));
  A("Question-led content", "medium", P(qHeads.length >= 3, qHeads.length >= 1), qHeads.length ? `${qHeads.length} heading(s) phrased as questions, e.g. “${qHeads[0][1].slice(0, 70)}”.` : "No headings phrased as questions.", "Add headings that match real questions (\"How much does…?\") followed by a direct one- or two-sentence answer – an easy format for search and AI answers to quote.");
  const org = hasType(/Organization|LocalBusiness|Corporation|Person|ProfessionalService/).concat(hasType(LB_RE)).filter((o, i, a) => a.indexOf(o) === i);
  const sameAs = org.flatMap((o) => [].concat(o.sameAs || []));
  A("Entity clarity", "high", P(org.length && sameAs.length >= 2, org.length), org.length ? [`Identified as: ${[...new Set(org.flatMap(types))].join(", ")}.`, sameAs.length ? `${sameAs.length} official profile link(s) (sameAs).` : "No sameAs links to official profiles (Google Business Profile, LinkedIn, Facebook, Companies House…)."] : "No Organization / LocalBusiness structured data – search engines and AI have to guess who runs this site.", "Add Organization or LocalBusiness JSON-LD with name, url, logo, contact details and sameAs links to your official profiles.");
  const dated = /dateModified|datePublished/.test(ldBlocks.join(" ")) || /<time\b/i.test(body) || !!meta(head, "property", "article:modified_time") || !!meta(head, "property", "article:published_time") || /(last (updated|reviewed)|updated on|published on?)\s*:?\s*(\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(bodyText);
  A("Freshness signals", "medium", P(dated), dated ? "The page shows when it was published or last updated." : "No published/updated date found.", "Show a 'last updated' date and add dateModified to your structured data.");
  const trust = ["about", "contact", "privacy"].filter((k) => internal.some((l) => new RegExp(k, "i").test(l.u.pathname + " " + l.text)));
  A("Trust pages (E-E-A-T)", "medium", P(trust.length === 3, trust.length >= 2), `Links found to: ${trust.length ? trust.join(", ") : "none"} of about / contact / privacy.`, "Link to About, Contact and Privacy pages from every page – they help visitors, Google and AI tools see who stands behind the content.");

  // ================= 5. Structured data
  const D = cat("Structured data", "Machine-readable facts for rich results and AI.");
  D("JSON-LD present & valid", "high", P(ldBlocks.length && !ldErrors.length, ldBlocks.length), ldBlocks.length ? [`${ldBlocks.length} JSON-LD block(s): ${[...new Set(ld.flatMap(types))].slice(0, 12).join(", ") || "no @type"}.`, ldErrors.length ? ldErrors.join("; ") : "All blocks parse correctly."] : "No JSON-LD structured data.", "Add JSON-LD describing the business and the page (Organization/LocalBusiness, WebSite, WebPage or Article, BreadcrumbList).");
  // Google's documented required properties (req) and a few recommended ones (rec), checked on top-level entities.
  const has = (o, k) => o[k] != null && o[k] !== "";
  const reqMiss = [], recMiss = [], sdNotes = [];
  for (const o of ld) {
    const ts = types(o), t = ts[0], isTop = top.has(o);
    const need = (k, ok = has(o, k)) => { if (!ok) reqMiss.push(`${t}.${k}`); };
    const want = (k, ok = has(o, k)) => { if (!ok) recMiss.push(`${t}.${k}`); };
    if (ts.some((x) => LB_RE.test(x)) && isTop) { need("name"); need("address"); want("telephone"); want("url"); }
    else if (ts.includes("Organization") && isTop) { want("name"); want("url"); want("logo"); }
    if (ts.includes("Product")) { need("name"); need("offers|review|aggregateRating", has(o, "offers") || has(o, "review") || has(o, "aggregateRating")); }
    if (ts.some((x) => /^(Article|NewsArticle|BlogPosting)$/.test(x)) && isTop) { want("headline"); want("image"); want("datePublished"); want("author"); }
    if (ts.includes("BreadcrumbList")) { const items = [].concat(o.itemListElement || []); need("itemListElement", items.length > 0); items.forEach((li, i) => { if (!li || li.position == null || !(li.name || (li.item && li.item.name))) reqMiss.push("ListItem.position/name"); else if (i < items.length - 1 && !li.item) reqMiss.push("ListItem.item"); }); }
    if (ts.includes("Event")) { need("name"); need("startDate"); need("location"); }
    if (ts.includes("FAQPage")) { const q = [].concat(o.mainEntity || []); need("mainEntity", q.length > 0); if (q.some((x) => !x || !x.name || !(x.acceptedAnswer && x.acceptedAnswer.text))) reqMiss.push("Question.name/acceptedAnswer.text"); sdNotes.push("Google now shows FAQ rich results only for well-known government and health sites, but the markup still helps machines read your Q&As."); }
    if (ts.includes("Recipe")) { need("name"); need("image"); }
    if (ts.includes("JobPosting")) { ["title", "description", "datePosted", "hiringOrganization"].forEach((k) => need(k)); need("jobLocation", has(o, "jobLocation") || has(o, "applicantLocationRequirements")); }
    if (ts.includes("VideoObject")) { need("name"); need("thumbnailUrl"); need("uploadDate"); }
    if (ts.includes("AggregateRating")) { need("ratingValue"); need("ratingCount|reviewCount", has(o, "ratingCount") || has(o, "reviewCount")); }
    if (isTop && (o.aggregateRating || o.review) && ts.some((x) => x === "Organization" || LB_RE.test(x))) sdNotes.push("Review stars aren't shown for reviews a business publishes about itself (Google's self-serving review rule).");
  }
  if (ld.length) D("Required properties", "medium", P(!reqMiss.length, !reqMiss.length), [reqMiss.length ? `Missing required: ${[...new Set(reqMiss)].slice(0, 8).join(", ")}.` : "Key types include Google's required properties.", recMiss.length ? `Recommended but missing: ${[...new Set(recMiss)].slice(0, 8).join(", ")}.` : null, ...new Set(sdNotes)], "Fill in the missing properties so the markup qualifies for rich results – test with Google's Rich Results Test.");
  const bc = hasType(/BreadcrumbList/).length > 0;
  D("Breadcrumbs", "low", page.pathname === "/" ? "info" : P(bc), page.pathname === "/" ? "Home page – breadcrumbs not needed." : bc ? "BreadcrumbList markup present." : "No BreadcrumbList markup.", "Add BreadcrumbList JSON-LD so Google shows the page's place in your site.");

  // ================= 6. Links
  const L = cat("Links", "Internal linking, anchor text and broken links.");
  const byText = new Map(); internal.forEach((l) => { const k = l.text.toLowerCase(); if (!k || k.startsWith("[")) return; byText.set(k, (byText.get(k) || new Set()).add(noSlash(l.u.pathname) + l.u.search)); });
  const dupAnchors = [...byText].filter(([, s]) => s.size > 1).map(([t]) => t);
  const vague = internal.filter((l) => /^(click here|here|read more|more|learn more|this page|link|find out more)$/i.test(l.text)).length;
  const emptyA = webLinks.filter((l) => !l.text).length;
  L("Internal linking", "high", P(internal.length >= 5 && internal.length <= 250, internal.length >= 2), `${internal.length} internal and ${external.length} external links.`, "Link to your most important pages from this page with descriptive text.");
  L("Anchor text quality", "medium", P(!dupAnchors.length && !vague && !emptyA, !emptyA), [dupAnchors.length ? `Same text used for different pages: ${dupAnchors.slice(0, 4).map((t) => `“${t}”`).join(", ")}.` : "No link text points to two different pages.", vague ? `${vague} vague link(s) like “click here” or “read more”.` : null, emptyA ? `${emptyA} link(s) with no text at all.` : null], "Make every link text describe its destination, e.g. “logo design prices” instead of “click here”.");
  const b = f.broken;
  if (b) L("Broken links (sample)", "high", P(!b.broken.length, b.broken.length <= 1), b.checked ? [`Checked ${b.checked} internal link(s)${b.skipped ? ` (${b.skipped} more not checked)` : ""}.`, b.broken.length ? `Broken: ${b.broken.slice(0, 5).map((x) => `${x.path} (${x.status || "no response"})`).join(", ")}.` : "No broken links found.", b.redirected ? `${b.redirected} link(s) point to a redirect – link to the final address instead.` : null] : "No internal links to test.", "Fix or remove links that return errors, and update links that redirect.");
  const nofollowInt = internal.filter((l) => /rel\s*=\s*["'][^"']*nofollow/i.test(l.tag)).length;
  if (nofollowInt) L("Internal nofollow", "low", "warn", `${nofollowInt} internal link(s) are nofollow, so search engines may not follow them.`, "Remove rel=\"nofollow\" from links to your own pages.");
  const httpInternal = page.protocol === "https:" ? internal.filter((l) => l.u.protocol === "http:").length : 0;
  if (httpInternal) L("Internal links to http://", "medium", "warn", `${httpInternal} internal link(s) use http:// – each one goes through a redirect.`, "Update internal links to use https:// (or relative links).");

  // ================= 7. Performance
  const R = cat("Performance", "Speed signals from the HTML and server. Real-user Core Web Vitals load below.");
  const inProc = H("x-checker-internal") === "1";
  const edgeNote = "Not measurable here: this site is served by the same server as the checker, so the check ran in-process and skipped the Cloudflare edge that real visitors go through.";
  if (inProc) R("Server response (TTFB)", "high", "info", edgeNote);
  else R("Server response (TTFB)", "high", P(f.ms <= 800, f.ms <= 1800), `${f.ms} ms until the first response from our checker, including connection setup (Google rates TTFB good under 0.8 s, poor over 1.8 s).`, "Use page caching or a CDN (e.g. Cloudflare) so HTML is served from the edge.");
  R("HTML size", "medium", P(f.bytes <= 150_000, f.bytes <= 400_000), `${Math.round(f.bytes / 1024)} kB of HTML${f.bytes > 400_000 ? " – heavy for phones" : ""}${f.bytes > MAX_BYTES ? " (we only analysed the first 1 MB)" : ""}.`, "Remove inline bloat, base64 images and unused markup.");
  const enc = H("content-encoding");
  // Workers' fetch() decompresses transparently and often hides content-encoding, so only a visible header can be scored.
  if (enc) R("Compression", "medium", "pass", `Compressed with ${enc}.`);
  else R("Compression", "medium", "info", inProc ? edgeNote : "Couldn't be measured from our server (our fetch decodes compressed pages before we see them). Check in your browser's developer tools that HTML is sent with br or gzip.");
  const headScripts = tags(head, "script").filter((t) => attr(t, "src") && !/\s(async|defer)\b/i.test(t) && !/type\s*=\s*["']?module/i.test(t));
  const headCss = tags(head, "link").filter((t) => /rel\s*=\s*["']?stylesheet/i.test(t) && !/media\s*=\s*["']?print/i.test(t));
  R("Render-blocking resources", "high", P(!headScripts.length && headCss.length <= 2, headScripts.length <= 1 && headCss.length <= 4), `${headScripts.length} blocking script(s) and ${headCss.length} stylesheet(s) in <head>.`, "Add defer to scripts, inline critical CSS and load the rest asynchronously.");
  const allScripts = (raw.match(/<script\b(?![^>]*application\/ld\+json)/gi) || []).length;
  const thirdParty = [...new Set(resources.map((s) => { try { return new URL(s, page); } catch { return null; } }).filter((u) => u && /^https?:$/.test(u.protocol)).map((u) => u.hostname.replace(/^www\./, "")).filter((h) => h !== site && !h.endsWith("." + site)))];
  R("Scripts & third parties", "medium", P(allScripts <= 10 && thirdParty.length <= 5, allScripts <= 25 && thirdParty.length <= 12), [`${allScripts} script tag(s); files loaded from ${thirdParty.length} other domain(s)${thirdParty.length ? `: ${thirdParty.slice(0, 6).join(", ")}${thirdParty.length > 6 ? "…" : ""}` : ""}.`], "Remove unused tracking and widget scripts; every third party adds connection time.");
  const noDims = imgs.filter((t) => !(attr(t, "width") && attr(t, "height")) && !/aspect-ratio/i.test(attr(t, "style") || "")).length;
  const lazyCandidates = imgs.slice(3); const notLazy = lazyCandidates.filter((t) => !/loading\s*=\s*["']?lazy/i.test(t)).length;
  const firstLazy = imgs.length && /loading\s*=\s*["']?lazy/i.test(imgs[0]);
  const modern = imgs.filter((t) => /\.(webp|avif)(\?|$)/i.test(attr(t, "src") || "") || /srcset/i.test(t)).length;
  R("Images", "medium", P(!noDims && !notLazy && !firstLazy, noDims <= 2), imgs.length ? [`${imgs.length} image(s).`, noDims ? `${noDims} without width/height – can cause layout shift (CLS).` : "All images reserve their space.", notLazy ? `${notLazy} image(s) after the first three aren't lazy-loaded.` : null, firstLazy ? "The first image is lazy-loaded – if it's the main (LCP) image, that delays it. Don't lazy-load images visible on arrival." : null, `${modern} use WebP/AVIF or responsive srcset.`] : "No <img> tags.", "Give every image width and height, lazy-load images below the fold (but not the main image) and serve WebP/AVIF.");
  const cc = H("cache-control") || "";
  R("Caching", "low", P(/max-age=[1-9]\d|s-maxage=[1-9]/i.test(cc) && !/no-store/i.test(cc), !!cc), cc ? `Cache-Control: ${cc}` : "No Cache-Control header.", "Set Cache-Control so browsers and CDNs can reuse the page.");
  const h3 = /h3=/i.test(H("alt-svc") || "");
  if (h3) R("HTTP/3", "low", "pass", "Server advertises HTTP/3 (faster on mobile networks).");
  else R("HTTP/3", "low", "info", inProc ? edgeNote : `Couldn't be confirmed from our server – the alt-svc header that advertises HTTP/3 isn't always visible to it.${/cloudflare/i.test(H("server") || "") ? " Your site is on Cloudflare, which offers HTTP/3 under Network settings." : ""}`);

  // ================= 8. Security
  const S = cat("Security", "Visitor safety signals that browsers and Google check.");
  const mixedN = page.protocol === "https:" ? resources.filter((s) => /^http:\/\//i.test(s)).length : 0;
  S("HTTPS", "critical", P(page.protocol === "https:" && !mixedN, page.protocol === "https:"), page.protocol !== "https:" ? "The page is not served over HTTPS." : mixedN ? `${mixedN} file(s) load over insecure http:// (mixed content) – browsers may block them.` : "Secure HTTPS with no mixed content.", "Serve everything over HTTPS and update http:// file links.");
  if (f.httpRedirects !== undefined) S("HTTP → HTTPS redirect", "high", P(f.httpRedirects), f.httpRedirects ? `http:// redirects to https://${f.httpHops > 1 ? ` (via ${f.httpHops} hops)` : ""}.` : "http:// does not redirect to https://.", "301-redirect all http:// requests to https://.");
  const hsts = H("strict-transport-security");
  const hstsAge = +((hsts || "").match(/max-age\s*=\s*"?(\d+)/i) || [, 0])[1];
  S("HSTS", "medium", P(hsts && hstsAge >= 15_552_000, hsts && hstsAge > 0), hsts ? [`HSTS: ${hsts}`, hstsAge < 15_552_000 ? "max-age is under 6 months – browsers will forget it quickly." : null] : "No Strict-Transport-Security header.", "Add Strict-Transport-Security: max-age=63072000; includeSubDomains.");
  const secHeaders = { "content-security-policy": "CSP", "x-content-type-options": "nosniff", "referrer-policy": "Referrer-Policy", "permissions-policy": "Permissions-Policy" };
  const present = Object.entries(secHeaders).filter(([k]) => H(k)).map(([, v]) => v);
  const xfo = H("x-frame-options") || /frame-ancestors/i.test(H("content-security-policy") || "");
  S("Security headers", "low", P(present.length >= 3 && xfo, present.length >= 2), `Present: ${present.concat(xfo ? ["clickjacking protection"] : []).join(", ") || "none"}.`, "Add X-Content-Type-Options, Referrer-Policy, Permissions-Policy and X-Frame-Options (or a CSP).");
  const xp = H("x-powered-by") || H("server");
  S("Server fingerprint", "low", P(!H("x-powered-by")), H("x-powered-by") ? `X-Powered-By reveals “${H("x-powered-by")}”.` : `No X-Powered-By header${xp ? ` (server: ${xp})` : ""}.`, "Remove X-Powered-By so attackers can't see your software versions.");

  // ================= 9. Mobile & accessibility
  const Y = cat("Mobile & accessibility", "Usable on phones and by everyone – Google indexes the mobile version.");
  const vp = meta(head, "name", "viewport") || "";
  const noZoom = /user-scalable\s*=\s*["']?(no|0)\b|maximum-scale\s*=\s*1(\.0+)?(?![\d.])/i.test(vp);
  Y("Mobile viewport", "critical", P(/width\s*=\s*device-width/i.test(vp) && !noZoom, /width\s*=\s*device-width/i.test(vp)), vp ? `viewport: ${vp}${noZoom ? " – blocks pinch-zoom" : ""}` : "No viewport meta tag – the page won't fit phones.", "Use <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> and allow zoom.");
  const noAlt = imgs.filter((t) => attr(t, "alt") === null).length;
  Y("Image alt text", "medium", P(!noAlt, noAlt <= 2), imgs.length ? (noAlt ? `${noAlt} of ${imgs.length} images have no alt attribute.` : `All ${imgs.length} images have alt text.`) : "No images.", "Describe each meaningful image in its alt attribute (use alt=\"\" for decorative ones).");
  const fields = [...body.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((m) => m[0]).filter((t) => !/type\s*=\s*["']?(hidden|submit|button|image|reset)\b/i.test(t));
  const forIds = new Set([...body.matchAll(/<label\b[^>]*\sfor\s*=\s*["']?([^"'\s>]+)/gi)].map((m) => decode(m[1])));
  const wrapped = new Set(); for (const m of body.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)) for (const t of m[1].match(/<(input|select|textarea)\b[^>]*>/gi) || []) wrapped.add(t);
  const unlabelled = fields.filter((t) => !wrapped.has(t) && !attr(t, "aria-label") && !attr(t, "aria-labelledby") && !attr(t, "title") && !(attr(t, "id") && forIds.has(attr(t, "id")))).length;
  if (fields.length) Y("Form labels", "medium", P(!unlabelled), unlabelled ? `${unlabelled} of ${fields.length} form field(s) have no label.` : `All ${fields.length} form fields are labelled.`, "Give every form field a <label> or aria-label (a placeholder isn't a label).");
  Y("Link names", "low", P(!emptyA), emptyA ? `${emptyA} link(s) have no readable name for screen readers.` : "Every link has a readable name.", "Add text or aria-label to icon-only links.");
  const tel = links.some((l) => /^tel:/i.test(l.href || "")); const mail = links.some((l) => /^mailto:/i.test(l.href || ""));
  Y("Tap-to-contact", "medium", P(tel || mail), tel || mail ? `One-tap contact: ${[tel && "phone", mail && "email"].filter(Boolean).join(" and ")}.` : "No tel: or mailto: links.", "Add a tap-to-call or tap-to-email button so phone visitors can contact you instantly.");

  // ================= 10. Local SEO
  const lb = hasType(LB_RE);
  const phoneUK = tel || PHONE_UK.test(bodyText);
  const postcode = POSTCODE_UK.test(bodyText);
  const mapLink = webLinks.some((l) => /google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.apple\.com|waze\.com|maps\.app\.goo\.gl|g\.page\//i.test(l.u.href));
  const mapEmbed = /<iframe\b[^>]*(google\.[a-z.]+\/maps|maps\.google\.)/i.test(raw);
  const lbFields = lb.length ? ["address", "telephone", "geo", "openingHoursSpecification", "areaServed", "url"].filter((k) => lb.some((o) => o[k] != null || (k === "telephone" && o.contactPoint && [].concat(o.contactPoint).some((c) => c && c.telephone)) || (k === "openingHoursSpecification" && o.openingHours))) : [];
  const isLocal = lb.length > 0 || phoneUK || postcode || mapLink || mapEmbed;
  const N = cat("Local SEO", isLocal ? "Signals that help you appear in Google Maps and 'near me' searches." : "This site doesn't look like a local business, so these checks are shown for information and not scored.");
  if (!isLocal) cats[cats.length - 1].info = true;
  N("LocalBusiness markup", "high", P(lb.length && lbFields.length >= 4, lb.length), lb.length ? `LocalBusiness markup includes: ${lbFields.join(", ") || "only a name"}.` : "No LocalBusiness structured data.", "Add LocalBusiness JSON-LD with address or areaServed, telephone, geo, opening hours and url.");
  N("Contact details on page", "medium", P(phoneUK || postcode || mail, false), [phoneUK ? "A UK phone number is shown." : "No phone number found.", postcode ? "A UK postcode is shown." : "No postcode found (fine for service-area businesses).", mail ? "An email link is shown." : null], "Show the same business name, area and phone/email as your Google Business Profile.");
  N("Map & directions", "low", P(mapLink || mapEmbed), mapLink || mapEmbed ? "Links to or embeds a map." : "No map or directions link.", "Add a Google Maps directions link so customers can find you.");

  // ---------------- scoring
  for (const c of cats) if (c.info) c.checks.forEach((k) => { if (k.status !== "pass") { k.status = "info"; k.fix = null; } });
  const tally = (list) => { let got = 0, tot = 0; for (const k of list) { if (k.status === "info") continue; const w = IMPACT[k.impact]; tot += w; got += k.status === "pass" ? w : k.status === "warn" ? w * 0.5 : 0; } return tot ? Math.round((got / tot) * 100) : 100; };
  for (const c of cats) c.score = tally(c.checks);
  const all = cats.flatMap((c) => c.checks.map((k) => ({ ...k, category: c.name }))).filter((k) => k.status !== "info");
  const fixes = all.filter((k) => k.status !== "pass").sort((a, b) => IMPACT[b.impact] * (b.status === "fail" ? 2 : 1) - IMPACT[a.impact] * (a.status === "fail" ? 2 : 1));
  const counts = { pass: all.filter((k) => k.status === "pass").length, warn: all.filter((k) => k.status === "warn").length, fail: all.filter((k) => k.status === "fail").length };
  const aiScore = cats.find((c) => c.name === "AI search readiness").score;
  return { url: page.href, score: tally(all), aiScore, counts, categories: cats, fixes,
    facts: { title, desc, h1, status: f.status, ms: f.ms, bytes: f.bytes, words: wc, ogImage: og.i, redirects: f.redirects, internal: inProc } };
}

// ---------------- network
// Hostnames that are never public, plus wildcard-DNS services that map names onto any IP (127.0.0.1.nip.io…).
const PRIVATE = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain|test|example|invalid|onion|arpa|nip\.io|sslip\.io|xip\.io|localtest\.me|lvh\.me|vcap\.me|lacolhost\.com|localhost\.run|traefik\.me)$/i;
/** Validate and normalise a user-supplied address; only public http(s) sites, by domain name, on standard ports. */
export function normaliseUrl(input) {
  let s = String(input || "").trim();
  if (!s) throw new Error("Enter a web address to check.");
  if (s.length > 2048) throw new Error("That address is too long.");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) { if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^[^:]+:\d/.test(s)) throw new Error("Only http and https addresses can be checked."); s = "https://" + s.replace(/^\/+/, ""); }
  let u; try { u = new URL(s); } catch { throw new Error("That doesn't look like a web address."); }
  if (!/^https?:$/.test(u.protocol)) throw new Error("Only http and https addresses can be checked.");
  if (u.username || u.password) throw new Error("Addresses with a username or password can't be checked.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard web ports can be checked.");
  u.hostname = u.hostname.replace(/\.+$/, ""); // "example.com." -> "example.com"
  const h = u.hostname;
  // IP literals (the URL parser turns decimal/octal/hex forms into dotted quads and wraps IPv6 in []),
  // private names, and anything without a real TLD (letters, or an xn-- IDN TLD).
  if (!h || h.startsWith("[") || /^[\d.]+$/.test(h) || /^0x/i.test(h) || PRIVATE.test(h) || !/\.(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/i.test(h) || h.length > 253)
    throw new Error("Only public websites (by domain name) can be checked.");
  u.hash = "";
  return u;
}

async function get(u, fetchImpl, method = "GET") {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try { return await fetchImpl(u.toString(), { method, redirect: "manual", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8", "accept-encoding": "br, gzip" } }); }
  finally { clearTimeout(t); }
}
const discard = async (r) => { try { await r.body?.cancel(); } catch {} };
async function readCapped(res, cap = MAX_BYTES) {
  if (!res.body || !res.body.getReader) { const s = await res.text(); return { text: s.slice(0, cap), bytes: s.length }; }
  const reader = res.body.getReader(); const parts = []; let n = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; n += value.length; parts.push(value); if (n > cap) { try { await reader.cancel(); } catch {} break; } }
  const buf = new Uint8Array(Math.min(n, cap)); let o = 0; for (const p of parts) { const take = Math.min(p.length, buf.length - o); buf.set(p.subarray(0, take), o); o += take; if (o >= buf.length) break; }
  return { text: new TextDecoder().decode(buf), bytes: n };
}
/** Fetch a small text file, following up to `hops` redirects (each hop re-validated). */
async function getFile(u, fetchImpl, cap = 500_000, hops = 3) {
  try {
    for (let i = 0; ; i++) {
      const r = await get(u, fetchImpl);
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400 && loc && i < hops) { await discard(r); u = normaliseUrl(new URL(loc, u).href); continue; }
      if (r.status !== 200) { await discard(r); return { status: r.status, text: null, url: u }; }
      const { text, bytes } = await readCapped(r, cap);
      return { status: 200, text, bytes, url: u };
    }
  } catch { return { status: 0, text: null, url: u }; }
}
/** robots.txt for an origin: { status, text } (text null unless it loaded). */
export const fetchRobots = async (origin, fetchImpl = fetch) => { const r = await getFile(new URL("/robots.txt", origin), fetchImpl, 500_000); return { status: r.status, text: r.text }; };
/** Wrap fetch so one request can never exceed the subrequest budget. */
const budgeted = (fetchImpl, max) => { let n = 0; const f = (...a) => (++n > max ? Promise.reject(Object.assign(new Error("Subrequest budget used up"), { budget: true })) : fetchImpl(...a)); f.left = () => max - n; return f; };

/** Call fn(value) for each <tag>value</tag> in xml – an indexOf scan, several times cheaper than a regex over a large sitemap. */
function eachTag(xml, tag, fn) {
  const open = "<" + tag + ">", close = "</" + tag + ">";
  for (let i = xml.indexOf(open); i >= 0; i = xml.indexOf(open, i)) {
    const j = xml.indexOf(close, i); if (j < 0) break;
    let v = xml.slice(i + open.length, j).trim(); i = j + close.length;
    if (v.startsWith("<![CDATA[")) v = v.slice(9, v.endsWith("]]>") ? -3 : undefined).trim();
    if (fn(v.includes("&") ? decode(v) : v) === false) break;
  }
}
/** Find the sitemap: robots.txt Sitemap: lines first, then /sitemap.xml. */
async function findSitemap(robots, origin, fetchImpl, pageHref) {
  const declared = robots ? [...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]) : [];
  const tries = [...new Set([...declared.slice(0, 2), origin + "/sitemap.xml"])];
  for (const s of tries) {
    let su; try { su = normaliseUrl(s); } catch { continue; }
    const { text: xml, url, bytes } = await getFile(su, fetchImpl, SITEMAP_READ);
    if (!xml || !/<(urlset|sitemapindex)\b/i.test(xml.slice(0, 5000))) continue;
    const cut = bytes > SITEMAP_READ;
    let lm = null, n = 0; eachTag(xml, "lastmod", (v) => { if (!lm || v > lm) lm = v; }); eachTag(xml, "loc", () => { n++; });
    const index = /<sitemapindex\b/i.test(xml.slice(0, 5000));
    const variants = [pageHref, noSlash(pageHref), noSlash(pageHref) + "/"].flatMap((h) => [h, h.replace(/&/g, "&amp;")]);
    const listsPage = index ? null : variants.some((h) => xml.includes(">" + h + "<") || xml.includes(h + "]]>")) || (cut ? null : false);
    return { url: url.href, urls: n, more: cut, index, inRobots: declared.length > 0, lastmod: lm, listsPage };
  }
  return null;
}

/** Fetch the page and its surroundings, then analyse. */
export async function runCheck(input, fetchImpl = fetch) {
  const F = budgeted(fetchImpl, FETCH_BUDGET);
  let u = normaliseUrl(input);
  let res, redirects = 0, ms = 0; const chain = [];
  for (;;) {
    const t0 = Date.now(); res = await get(u, F); ms = Date.now() - t0;
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      if (redirects >= 6) throw new Error("That address redirects too many times (more than 6 hops).");
      await discard(res);
      const next = normaliseUrl(new URL(loc, u).toString());
      if (next.href === u.href) throw new Error("That address redirects to itself.");
      chain.push(u.href); u = next; redirects++; continue;
    }
    break;
  }
  const type = res.headers.get("content-type") || "";
  if (res.status >= 300 && res.status < 400) throw new Error(`That address returned a redirect (HTTP ${res.status}) without saying where to.`);
  if (res.status >= 400) throw new Error(`That address returned an error (HTTP ${res.status}).`);
  if (!/html/i.test(type)) { await discard(res); throw new Error(`That address isn't a web page (it returned ${type.split(";")[0] || "an unknown type"}).`); }
  const { text: html, bytes } = await readCapped(res);
  const origin = `${u.protocol}//${u.hostname}`;
  const [robotsF, llmsF, wwwRes, httpRes] = await Promise.all([
    getFile(new URL("/robots.txt", origin), F, 500_000),
    getFile(new URL("/llms.txt", origin), F, 50_000, 2),
    (async () => {
      try {
        const alt = new URL("/", origin); alt.hostname = u.hostname.startsWith("www.") ? u.hostname.slice(4) : "www." + u.hostname;
        let r = await get(alt, F, "HEAD"); if (r.status === 405 || r.status === 501) r = await get(alt, F);
        await discard(r); return { alt, r };
      } catch { return null; }
    })(),
    (async () => {
      if (u.protocol !== "https:") return null;
      // follow the http:// version (up to 3 hops) to see whether it ends up on https://
      let x = new URL(u.href.replace(/^https:/, "http:")), hops = 0;
      try {
        for (; hops < 3; hops++) {
          const r = await get(x, F, "HEAD"); await discard(r);
          const loc = r.headers.get("location");
          if (!(r.status >= 300 && r.status < 400 && loc)) break;
          x = normaliseUrl(new URL(loc, x).href); if (x.protocol === "https:") return { ok: true, hops: hops + 1 };
        }
        return { ok: false, hops };
      } catch { return null; }
    })(),
  ]);
  const robots = robotsF.text;
  const llms = llmsF.text;
  const sitemap = await findSitemap(robots, origin, F, u.href);
  let wwwOk = null, wwwNote = null;
  if (wwwRes && wwwRes.r) {
    const loc = wwwRes.r.headers.get("location"); let to = null; try { to = loc && new URL(loc, wwwRes.alt).hostname; } catch {}
    if (wwwRes.r.status >= 300 && wwwRes.r.status < 400 && to === u.hostname) { wwwOk = true; wwwNote = `${wwwRes.alt.hostname} redirects to ${u.hostname}.`; }
    else if (wwwRes.r.status >= 300 && wwwRes.r.status < 400) wwwNote = `${wwwRes.alt.hostname} redirects to ${to || "somewhere else"}.`;
    else if (wwwRes.r.status === 200) { wwwOk = false; wwwNote = `Both ${wwwRes.alt.hostname} and ${u.hostname} load without redirecting – Google may see duplicate sites.`; }
    else wwwNote = `${wwwRes.alt.hostname} isn't in use (HTTP ${wwwRes.r.status}).`;
  } else wwwNote = "The other version (with/without www) doesn't exist – fine.";
  // broken-link sample: unique internal pages, HEAD then GET fallback, every URL re-validated
  const site = u.hostname.replace(/^www\./, "");
  const seen = new Set(); const sample = [];
  for (const m of stripNoise(html).matchAll(/<a\b[^>]*\shref\s*=\s*["']([^"'#]+)["']/gi)) {
    let l; try { l = normaliseUrl(new URL(decode(m[1]).trim(), u).href); } catch { continue; }
    if (l.hostname.replace(/^www\./, "") !== site) continue;
    if (l.href === u.href || seen.has(l.href)) continue; seen.add(l.href);
    if (robots && !robotsAllows(robots, UA_TOKEN, l.pathname + l.search)) continue; // don't fetch what robots.txt asks us not to
    sample.push(l);
    if (sample.length >= LINK_SAMPLE) break;
  }
  const results = await Promise.all(sample.map(async (l) => {
    const path = l.pathname + l.search;
    try { let r = await get(l, F, "HEAD"); if (r.status === 405 || r.status === 501) { await discard(r); r = await get(l, F); } await discard(r); return { path, status: r.status }; }
    catch (e) { return e.budget ? { path, skipped: true } : { path, status: 0 }; }
  }));
  const done = results.filter((r) => !r.skipped);
  const broken = { checked: done.length, skipped: results.length - done.length, broken: done.filter((r) => r.status >= 400 || r.status === 0), redirected: done.filter((r) => r.status >= 300 && r.status < 400).length };
  return analyse({ url: input, finalUrl: u.href, status: res.status, headers: res.headers, html, ms, redirects, chain, wwwOk, wwwNote, bytes, robots, robotsStatus: robotsF.status, llms: !!(llms && llms.trim() && !/<html|<!doctype/i.test(llms)), sitemap, broken, httpRedirects: httpRes ? httpRes.ok : undefined, httpHops: httpRes ? httpRes.hops : 0 });
}

/** Real-world speed from Google PageSpeed Insights (lab Lighthouse + Chrome UX Report field data). */
export async function runVitals(input, key, fetchImpl = fetch) {
  const u = normaliseUrl(input);
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", u.href); api.searchParams.set("strategy", "mobile"); api.searchParams.set("category", "performance");
  if (key) api.searchParams.set("key", key);
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 55_000);
  let j; try {
    const r = await fetchImpl(api.toString(), { signal: ctl.signal });
    try { j = await r.json(); } catch { throw new Error(`PageSpeed returned an unreadable response (HTTP ${r.status})`); }
    if (!r.ok) {
      const msg = (j && j.error && j.error.message) || `PageSpeed returned ${r.status}`;
      if (r.status === 429 || /quota|rate limit/i.test(msg)) throw Object.assign(new Error("Google's daily allowance of free PageSpeed tests for this tool has been used up."), { quota: true });
      throw new Error(msg);
    }
  } catch (e) { if (e.name === "AbortError") throw new Error("Google PageSpeed took too long"); throw e; } finally { clearTimeout(t); }
  const lr = j.lighthouseResult || {};
  if (lr.runtimeError && lr.runtimeError.code && lr.runtimeError.code !== "NO_ERROR") throw new Error(`Lighthouse couldn't load the page (${lr.runtimeError.code})`);
  const a = lr.audits || {};
  const metric = (src, m) => { const x = (src && src.metrics || {})[m]; return x && typeof x.percentile === "number" ? { p75: x.percentile, cat: ["FAST", "AVERAGE", "SLOW"].includes(x.category) ? x.category : null } : null; };
  const pageField = j.loadingExperience && j.loadingExperience.metrics && j.loadingExperience.origin_fallback !== true ? j.loadingExperience : null;
  const originField = j.originLoadingExperience && j.originLoadingExperience.metrics ? j.originLoadingExperience : null;
  const src = pageField || originField;
  const field = { source: pageField ? "this page" : originField ? "whole site" : null, lcp: metric(src, "LARGEST_CONTENTFUL_PAINT_MS"), inp: metric(src, "INTERACTION_TO_NEXT_PAINT"), cls: metric(src, "CUMULATIVE_LAYOUT_SHIFT_SCORE"), ttfb: metric(src, "EXPERIMENTAL_TIME_TO_FIRST_BYTE") };
  // Core Web Vitals assessment, using Google's "good" thresholds at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
  const judged = [field.lcp && field.lcp.p75 <= 2500, field.inp && field.inp.p75 <= 200, field.cls && field.cls.p75 / 100 <= 0.1].filter((x, i) => [field.lcp, field.inp, field.cls][i]);
  field.cwv = field.source && field.lcp && field.cls ? judged.every(Boolean) : null;
  const score = lr.categories && lr.categories.performance && lr.categories.performance.score;
  return {
    performance: typeof score === "number" ? Math.round(score * 100) : null,
    lab: { lcp: a["largest-contentful-paint"]?.displayValue, cls: a["cumulative-layout-shift"]?.displayValue, tbt: a["total-blocking-time"]?.displayValue, fcp: a["first-contentful-paint"]?.displayValue, si: a["speed-index"]?.displayValue },
    field,
    opportunities: Object.values(a).filter((x) => x && x.details && x.details.type === "opportunity" && typeof x.score === "number" && x.score < 0.9).sort((x, y) => (y.details.overallSavingsMs || 0) - (x.details.overallSavingsMs || 0)).slice(0, 5).map((x) => ({ title: String(x.title || ""), savings: x.details.overallSavingsMs ? `${(x.details.overallSavingsMs / 1000).toFixed(1)} s` : null })),
  };
}

// ---------------- full-site audit (client-driven crawl; the server fetches small batches)
/** FNV-1a 32-bit hash. */
const fnv = (s, seed = 2166136261) => { let h = seed >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
/** 64-bit SimHash (two 32-bit halves, hex) over 3-word shingles – near-identical texts get near-identical hashes. */
function simhash(words) {
  const v = new Int32Array(64);
  for (let i = 0; i + 2 < words.length; i++) {
    const sh = words[i] + " " + words[i + 1] + " " + words[i + 2];
    const a = fnv(sh), b = fnv(sh, 0x811c9dc5 ^ 0x5bd1e995);
    for (let k = 0; k < 32; k++) { v[k] += (a >>> k) & 1 ? 1 : -1; v[k + 32] += (b >>> k) & 1 ? 1 : -1; }
  }
  let lo = 0, hi = 0; for (let k = 0; k < 32; k++) { if (v[k] > 0) lo |= 1 << k; if (v[k + 32] > 0) hi |= 1 << k; }
  return (hi >>> 0).toString(16).padStart(8, "0") + (lo >>> 0).toString(16).padStart(8, "0");
}

/** Compact per-page facts used by the site audit. Pure. */
export function pageFacts(html, pageUrl, headers, status, ms, bytes) {
  const page = new URL(pageUrl);
  const clean = stripNoise(html);
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [html.slice(0, 20000)])[0];
  const body = (clean.match(/<body\b[\s\S]*<\/body>/i) || [clean])[0];
  const H = (k) => (headers && headers.get ? headers.get(k) : null) || "";
  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);
  const desc = meta(head, "name", "description") || "";
  const robotsMeta = ((meta(head, "name", "robots") || "") + " " + (meta(head, "name", "googlebot") || "") + " " + H("x-robots-tag")).toLowerCase();
  const canonTag = tags(head, "link").find((t) => /rel\s*=\s*["']?canonical["'\s>]/i.test(t));
  let canonical = canonTag ? attr(canonTag, "href") : ((H("link").match(/<([^>]+)>\s*;[^,]*rel\s*=\s*"?canonical/i) || [])[1] || null);
  try { if (canonical) { const c = new URL(canonical.trim(), page); c.hash = ""; canonical = c.href; } } catch { canonical = null; }
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  const mainWords = text(mainOf(body)).toLowerCase().split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w));
  const words = mainWords.length;
  const imgs = tags(body, "img");
  const links = new Set(); let httpLinks = 0;
  for (const m of body.matchAll(/<a\b[^>]*\shref\s*=\s*["']([^"'#]+)["'][^>]*>/gi)) {
    if (/\brel\s*=\s*["'][^"']*nofollow/i.test(m[0])) continue;
    let l; try { l = new URL(decode(m[1]).trim(), page); } catch { continue; }
    if (!/^https?:$/.test(l.protocol) || !sameSite(l.hostname, page.hostname)) continue;
    if (/\.(jpe?g|png|gif|webp|avif|svg|pdf|zip|docx?|xlsx?|pptx?|mp4|mp3|ico|css|js|xml|txt|json|rss)$/i.test(l.pathname)) continue;
    if (page.protocol === "https:" && l.protocol === "http:") httpLinks++;
    l.hash = ""; links.add(l.href);
    if (links.size >= 400) break;
  }
  const hreflang = tags(head, "link").filter((t) => /hreflang\s*=/i.test(t) && /rel\s*=\s*["']?alternate/i.test(t)).slice(0, 30).map((t) => { try { const x = new URL((attr(t, "href") || "").trim(), page); x.hash = ""; return [(attr(t, "hreflang") || "").toLowerCase(), x.href]; } catch { return null; } }).filter(Boolean);
  const ld = (html.match(/application\/ld\+json/gi) || []).length;
  const joined = mainWords.join(" ");
  return {
    url: page.href, status, ms, bytes, title, titlePx: pixelWidth(title, 20), desc, descPx: pixelWidth(desc, 14),
    h1: h1.slice(0, 3), words, noindex: /\b(noindex|none)\b/.test(robotsMeta), canonical, lang: attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang"),
    imgs: imgs.length, imgsNoAlt: imgs.filter((t) => attr(t, "alt") === null).length, ld, links: [...links], httpLinks, hreflang,
    hash: words >= 50 ? fnv(joined).toString(16) : null, sim: words >= 100 ? simhash(mainWords.slice(0, 3000)) : null,
  };
}

/** Start an audit: validate the site, read robots.txt and sitemap URLs. */
export async function crawlStart(input, fetchImpl = fetch) {
  const F = budgeted(fetchImpl, FETCH_BUDGET);
  let u = normaliseUrl(input);
  // follow redirects on the start page so we crawl the real host
  for (let i = 0; ; i++) {
    const r = await get(u, F, "GET"); await discard(r);
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) { if (i >= 5) throw new Error("The site redirects too many times."); u = normaliseUrl(new URL(loc, u).href); continue; }
    if (r.status >= 400) throw new Error(`The site returned an error (HTTP ${r.status}).`);
    break;
  }
  const origin = `${u.protocol}//${u.hostname}`;
  const rf = await getFile(new URL("/robots.txt", origin), F, 500_000);
  const robots = rf.text;
  const robotsDown = rf.status === 0 || rf.status === 429 || rf.status >= 500;
  const smList = robots ? [...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]) : [];
  const sitemapUrls = new Set(); let sitemapFound = false, truncated = false, readLeft = SITEMAP_READ_AUDIT;
  const site = u.hostname.replace(/^www\./, "").replace(/[.]/g, "\\.");
  const fast = new RegExp(`^https?://(?:www\\.)?${site}/[\\x21-\\x22\\x24-\\x7e]*$`);
  const queue = [...new Set(smList.slice(0, 3))];
  const fallback = origin + "/sitemap.xml";
  for (let i = 0, fetched = 0; fetched < 6; i++) {
    if (i >= queue.length) { if (sitemapFound || queue.includes(fallback)) break; queue.push(fallback); } // fall back to /sitemap.xml only if the declared ones failed
    let su; try { su = normaliseUrl(queue[i]); } catch { continue; }
    if (!sameSite(su.hostname, u.hostname)) continue;
    if (readLeft <= 0) { truncated = true; break; }
    fetched++;
    const cap = readLeft;
    const { text: xml, bytes = 0 } = await getFile(su, F, cap);
    readLeft -= Math.min(bytes, cap); if (bytes > cap) truncated = true; // readCapped reports the bytes seen, which exceed cap when cut off
    if (!xml || !/<(urlset|sitemapindex)\b/i.test(xml.slice(0, 5000))) continue;
    sitemapFound = true;
    if (/<sitemapindex\b/i.test(xml.slice(0, 5000))) { const kids = []; eachTag(xml, "loc", (l) => { kids.push(l); return kids.length < 5; }); kids.reverse().forEach((l) => { if (!queue.includes(l)) queue.splice(i + 1, 0, l); }); continue; }
    const locs = []; eachTag(xml, "loc", (l) => { locs.push(l); return locs.length < SITEMAP_MAX; });
    for (const l of locs) {
      // Fast path for ordinary absolute URLs (parsing 10,000 URLs with new URL() would blow the CPU budget);
      // anything unusual (uppercase host, non-ASCII, bare origin, fragment) goes through the real parser.
      let href = null;
      if (fast.test(l)) href = l;
      else { try { const x = new URL(l); if (sameSite(x.hostname, u.hostname)) { x.hash = ""; href = x.href; } } catch {} }
      if (href) sitemapUrls.add(href);
      if (sitemapUrls.size >= SITEMAP_MAX) { truncated = true; break; }
    }
  }
  return { start: u.href, origin, host: u.hostname, robots: robots !== null, robotsStatus: rf.status, robotsDown, sitemapFound, sitemapTruncated: truncated, sitemap: [...sitemapUrls] };
}

/**
 * Fetch a batch of pages from one site (no redirect following; redirects are reported).
 * Pages robots.txt disallows for our crawler are not fetched and come back as { blocked: true }.
 */
export async function crawlBatch(host, urls, fetchImpl = fetch, robots = null) {
  const groups = robots ? parseRobots(robots) : null;
  const out = await Promise.all(urls.slice(0, 8).map(async (raw) => {
    let u; try { u = normaliseUrl(raw); } catch (e) { return { url: String(raw).slice(0, 300), status: 0, error: e.message }; }
    if (!sameSite(u.hostname, host)) return { url: u.href, status: 0, error: "Different site" };
    if (groups && !robotsAllows(groups, UA_TOKEN, u.pathname + u.search)) return { url: u.href, blocked: true };
    try {
      const t0 = Date.now(); const r = await get(u, fetchImpl, "GET"); const ms = Date.now() - t0;
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400) { let to = null; try { to = new URL(loc, u); to.hash = ""; to = /^https?:$/.test(to.protocol) ? to.href : null; } catch { to = null; } await discard(r); return { url: u.href, status: r.status, ms, redirect: to }; }
      const type = r.headers.get("content-type") || "";
      if (r.status >= 400 || !/html/i.test(type)) { await discard(r); return { url: u.href, status: r.status, ms, type: type.split(";")[0] || "unknown" }; }
      const { text: html, bytes } = await readCapped(r, 1_000_000);
      return pageFacts(html, u.href, r.headers, r.status, ms, bytes);
    } catch (e) { return { url: u.href, status: 0, error: e.name === "AbortError" ? "Timed out" : "Could not connect" }; }
  }));
  return out;
}

/** Fetch one public page's HTML for the single-purpose tools: { status, html, url, ms }. Redirects are re-validated. */
export async function fetchHtml(input, fetchImpl = fetch) {
  const t0 = Date.now();
  const r = await getFile(normaliseUrl(input), fetchImpl, MAX_BYTES, 5);
  return { status: r.status, html: r.text, url: r.url.href, ms: Date.now() - t0 };
}
