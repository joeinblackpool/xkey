// XKey (xkey.co.uk): free SEO & AI search check. Uses the same engine as IceWork's checker.
import { PAGES, toolCards } from "./content.js";
import { BRAND, SITE, UPDATED, esc, layout, send, FAVICON } from "./site.js";
import { toolsApp } from "./tools-client.js";
import { OG_PNG } from "./og.js";
import { handleChecker, rateLimited, AUDIT_JS, REPORT_JS, COMPARE_JS, overOnce, cmpForm, over } from "../engine/checker-ui.js";
import { createMonitor, runMonitor, getMonitor, validId, dashboard, runDueMonitors } from "../engine/monitor.js";
import { robotsAllows, pixelWidth, normaliseUrl, fetchRobots, crawlStart, crawlBatch, fetchHtml, runCheck } from "../engine/checker.js";
import { summarisePage } from "./page-parse.js";

const BY_PATH = Object.fromEntries(PAGES.map((p) => [p.path, p]));
const GUIDES = PAGES.filter((p) => p.path.startsWith("/guides/"));

// Arial advance widths (in 1/2048 em) for the title checker, taken from the engine's own table.
const W = {}; for (let c = 32; c < 127; c++) W[String.fromCharCode(c)] = pixelWidth(String.fromCharCode(c), 2048);
for (const c of "–—£€’‘“”…·•é") W[c] = pixelWidth(c, 2048);
const TOOLS_JS = `var W=${JSON.stringify(W)};(${toolsApp.toString()})();`;

// ---------- forms
const input = (id, name, ph, extra = "") => `<label for="${id}" class="sr">Website address</label><input id="${id}" name="${name}" type="text" inputmode="url" autocomplete="url" placeholder="${ph}" required${extra}>`;
const FORMS = {
  check: (p) => `<form class="ck-form" action="/seo-checker" method="get" role="search">${input("ck-url", "url", "yourwebsite.co.uk")}${p.focus ? `<input type="hidden" name="focus" value="${p.focus}">` : ""}<button class="btn" type="submit">${p.path === "/" ? "Check my site" : "Run free check"}</button></form><p class="small">Free, no sign-up. Checks one page in about 20 seconds. We fetch it like a search engine and don't keep your content.</p><div id="recent"></div><script src="/assets/tools.js" defer></script>`,
  audit: () => `<form class="ck-form" action="/site-audit" method="get" role="search">${input("au-url", "url", "yourwebsite.co.uk")}<button class="btn" type="submit">Audit my site</button></form><p class="small">Crawls up to 250 pages. Keep the tab open while it runs (usually one to three minutes).</p>`,
  compare: (p) => cmpForm(esc, p.prefill || []),
  monitor: () => `<form class="ck-form" action="/api/monitor" method="post">${input("mo-url", "url", "yourwebsite.co.uk")}<button class="btn" type="submit">Start free monitoring</button></form><p class="small">No account or email needed – you'll get a private dashboard link to bookmark.</p>`,
  title: () => `<div class="tool"><label for="tt-title">Title tag</label><input id="tt-title" type="text" value="Emergency Plumber in Blackpool | 24/7 Callouts | Smith &amp; Sons"><div id="tt-tm"></div><p class="small" id="tt-tc"></p>
<label for="tt-desc">Meta description</label><textarea id="tt-desc" style="min-height:90px;font-family:inherit;font-size:16px">Local, Gas Safe plumbers covering Blackpool and the Fylde coast. Fixed prices, no callout fee and most jobs done the same day. Call or book online.</textarea><div id="tt-dm"></div><p class="small" id="tt-dc"></p>
<label for="tt-url">Page address (optional)</label><input id="tt-url" type="text" inputmode="url" placeholder="yourwebsite.co.uk/services">
<p style="margin:16px 0 0;font-weight:600">Google preview</p><div class="serp" id="tt-serp" aria-live="polite"></div></div><script src="/assets/tools.js" defer></script>`,
  robots: () => `<form class="tool" id="rt-form"><label for="rt-url">URL to test</label><div class="row"><input id="rt-url" type="text" inputmode="url" placeholder="https://yourwebsite.co.uk/page" required style="flex:1 1 260px;width:auto"><button class="btn ghost" type="button" id="rt-load">Load from the website</button></div>
<label for="rt-robots">robots.txt</label><textarea id="rt-robots" spellcheck="false">User-agent: *
Disallow: /admin/
Allow: /

User-agent: GPTBot
Disallow: /

Sitemap: https://yourwebsite.co.uk/sitemap.xml</textarea>
<label for="rt-agent">Crawler</label><select id="rt-agent">${ROBOT_AGENTS.map(([t, n]) => `<option value="${t}">${n}</option>`).join("")}</select>
<p style="margin:16px 0 0"><button class="btn" type="submit">Test URL</button></p><div id="rt-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  llms: () => `<form class="tool" id="lt-form"><label for="lt-name">Business or website name</label><input id="lt-name" type="text" placeholder="Smith &amp; Sons Plumbing">
<label for="lt-site">Website address</label><input id="lt-site" type="text" inputmode="url" placeholder="https://smithplumbing.co.uk">
<label for="lt-sum">One-sentence summary</label><input id="lt-sum" type="text" placeholder="Gas Safe plumbers covering Blackpool and the Fylde coast since 1998.">
<label for="lt-about">More detail (optional)</label><textarea id="lt-about" style="min-height:80px;font-family:inherit;font-size:16px" placeholder="Opening hours, areas covered, what makes you different."></textarea>
<label for="lt-pages">Key pages – one per line: Title | address | short note</label><textarea id="lt-pages">Services | /services | Boilers, leaks, bathrooms and emergency callouts
Prices | /prices | Fixed prices for common jobs
Contact | /contact | Phone, email and opening hours</textarea>
<p style="margin:16px 0 6px;font-weight:600">Your llms.txt</p><pre class="out" id="lt-out" aria-live="polite"></pre>
<div class="row"><button class="btn" type="button" id="lt-copy">Copy</button><a class="btn ghost" id="lt-dl" href="#" download="llms.txt">Download llms.txt</a></div></form><script src="/assets/tools.js" defer></script>`,
  meta: () => `<form class="tool" id="mt-form"><label for="mt-title">Page title</label><input id="mt-title" type="text" value="Emergency Plumber in Blackpool | Smith &amp; Sons"><div id="mt-tm"></div>
<label for="mt-desc">Meta description</label><textarea id="mt-desc" style="min-height:80px;font-family:inherit;font-size:16px">Gas Safe plumbers covering Blackpool and the Fylde coast. Fixed prices, no callout fee and most jobs done the same day.</textarea><div id="mt-dm"></div>
<label for="mt-url">Page address (canonical)</label><input id="mt-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/page">
<label for="mt-img">Sharing image address (1200 × 630)</label><input id="mt-img" type="text" inputmode="url" placeholder="https://yoursite.co.uk/share.jpg">
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="mt-index" type="checkbox" checked style="width:auto"> Allow search engines to index this page</label>
<p style="margin:16px 0 6px;font-weight:600">Your meta tags</p><pre class="out" id="mt-out" aria-live="polite"></pre><button class="btn" type="button" id="mt-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  og: () => `<form class="tool" id="og-form"><label for="og-title">Title</label><input id="og-title" type="text" value="Smith &amp; Sons – Blackpool Plumbers">
<label for="og-desc">Description</label><input id="og-desc" type="text" value="Gas Safe plumbers covering the Fylde coast. Fixed prices and same-day callouts.">
<label for="og-url">Page address</label><input id="og-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/">
<label for="og-img">Image address (1200 × 630 PNG or JPG)</label><input id="og-img" type="text" inputmode="url" placeholder="https://yoursite.co.uk/share.jpg">
<label for="og-site">Site name</label><input id="og-site" type="text" placeholder="Smith &amp; Sons">
<label for="og-type">Type</label><select id="og-type"><option value="website">website</option><option value="article">article</option><option value="product">product</option></select>
<p style="margin:16px 0 6px;font-weight:600">Preview</p><div id="og-card" aria-live="polite"></div>
<p style="margin:16px 0 6px;font-weight:600">Your tags</p><pre class="out" id="og-out"></pre><button class="btn" type="button" id="og-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  sitemap: () => `<form class="tool" id="sm-form"><label for="sm-site">Your website</label><div class="row"><input id="sm-site" type="text" inputmode="url" placeholder="https://yoursite.co.uk" style="flex:1 1 260px;width:auto"><button class="btn ghost" type="button" id="sm-find">Find pages on my site</button></div>
<label for="sm-urls">Page addresses – one per line (full addresses or paths)</label><textarea id="sm-urls" spellcheck="false">/
/services
/about
/contact</textarea>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="sm-lastmod" type="checkbox" style="width:auto"> Add today's date as lastmod (only if every page changed today)</label>
<p class="small" id="sm-count" aria-live="polite"></p><pre class="out" id="sm-out"></pre><div class="row"><button class="btn" type="button" id="sm-copy">Copy</button><a class="btn ghost" id="sm-dl" href="#" download="sitemap.xml">Download sitemap.xml</a></div></form><script src="/assets/tools.js" defer></script>`,
  words: () => `<form class="tool" id="wc-form"><label for="wc-text">Your text</label><textarea id="wc-text" style="min-height:220px;font-family:inherit;font-size:16px" placeholder="Paste or type your text here…"></textarea><div class="vit" id="wc-stats" aria-live="polite" style="margin-top:14px"></div><div id="wc-kw"></div></form><script src="/assets/tools.js" defer></script>`,
  keywords: () => `<form class="tool" id="kw-form"><div class="row"><div style="flex:2 1 240px"><label for="kw-seed">Product, service or topic</label><input id="kw-seed" type="text" value="boiler repair"></div><div style="flex:1 1 160px"><label for="kw-town">Town (optional)</label><input id="kw-town" type="text" placeholder="Blackpool"></div></div>
<p class="small" id="kw-n" aria-live="polite"></p><div id="kw-out"></div><pre class="sr" id="kw-all"></pre><p><button class="btn" type="button" id="kw-copy">Copy all ideas</button></p></form><script src="/assets/tools.js" defer></script>`,
  titles: () => `<form class="tool" id="bt-form"><div class="row"><div style="flex:2 1 240px"><label for="bt-kw">Topic or keyword</label><input id="bt-kw" type="text" value="garden landscaping"></div><div style="flex:1 1 160px"><label for="bt-aud">Audience (optional)</label><input id="bt-aud" type="text" placeholder="small gardens"></div></div><div id="bt-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  robotsgen: () => `<form class="tool" id="rg-form"><label for="rg-site">Your website (for the Sitemap line)</label><input id="rg-site" type="text" inputmode="url" placeholder="https://yoursite.co.uk">
<label for="rg-block">Folders to block – one per line (optional)</label><textarea id="rg-block" spellcheck="false" style="min-height:90px">/wp-admin/
/basket/</textarea>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-train" type="checkbox" style="width:auto"> Block AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot…)</label>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-search" type="checkbox" style="width:auto"> Block AI search crawlers (ChatGPT, Claude and Perplexity search)</label>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-all" type="checkbox" style="width:auto"> Block everything (development sites only)</label>
<p class="small" id="rg-note" aria-live="polite"></p><pre class="out" id="rg-out"></pre><div class="row"><button class="btn" type="button" id="rg-copy">Copy</button><a class="btn ghost" id="rg-dl" href="#" download="robots.txt">Download robots.txt</a><a class="btn ghost" href="/robots-txt-tester">Test it</a></div></form><script src="/assets/tools.js" defer></script>`,
  schemagen: () => `<form class="tool" id="sg-form"><label for="sg-type">Business type</label><select id="sg-type">${["LocalBusiness", "ProfessionalService", "HomeAndConstructionBusiness", "Plumber", "Electrician", "HVACBusiness", "RoofingContractor", "Locksmith", "HousePainter", "GeneralContractor", "AutoRepair", "BeautySalon", "HairSalon", "Dentist", "Restaurant", "CafeOrCoffeeShop", "BarOrPub", "Store", "LodgingBusiness", "LegalService", "AccountingService", "RealEstateAgent", "CleaningService" ].map((t) => `<option>${t}</option>`).join("")}</select>
<div class="row"><div style="flex:1 1 240px"><label for="sg-name">Business name</label><input id="sg-name" type="text" placeholder="Smith &amp; Sons Plumbing"></div><div style="flex:1 1 240px"><label for="sg-url">Website</label><input id="sg-url" type="text" inputmode="url" placeholder="https://smithplumbing.co.uk"></div></div>
<div class="row"><div style="flex:1 1 200px"><label for="sg-tel">Phone</label><input id="sg-tel" type="tel" placeholder="+44 1253 000000"></div><div style="flex:1 1 200px"><label for="sg-email">Email</label><input id="sg-email" type="email" placeholder="hello@smithplumbing.co.uk"></div></div>
<label for="sg-desc">Short description</label><input id="sg-desc" type="text" placeholder="Gas Safe plumbers covering Blackpool and the Fylde coast.">
<div class="row"><div style="flex:2 1 240px"><label for="sg-street">Street address (leave blank if you don't have a public address)</label><input id="sg-street" type="text"></div><div style="flex:1 1 140px"><label for="sg-town">Town</label><input id="sg-town" type="text" placeholder="Blackpool"></div><div style="flex:1 1 110px"><label for="sg-pc">Postcode</label><input id="sg-pc" type="text" placeholder="FY1 1AA"></div></div>
<label for="sg-areas">Areas served (comma separated)</label><input id="sg-areas" type="text" placeholder="Blackpool, Lytham St Annes, Fleetwood">
<div class="row"><div style="flex:2 1 220px"><label for="sg-days">Open days</label><input id="sg-days" type="text" value="Monday, Tuesday, Wednesday, Thursday, Friday"></div><div style="flex:1 1 90px"><label for="sg-open">Opens</label><input id="sg-open" type="time" value="08:00"></div><div style="flex:1 1 90px"><label for="sg-close">Closes</label><input id="sg-close" type="time" value="18:00"></div></div>
<div class="row"><div style="flex:1 1 240px"><label for="sg-img">Logo or photo address</label><input id="sg-img" type="text" inputmode="url"></div><div style="flex:1 1 120px"><label for="sg-price">Price range</label><input id="sg-price" type="text" placeholder="££"></div></div>
<label for="sg-same">Official profiles (sameAs) – one per line</label><textarea id="sg-same" spellcheck="false" style="min-height:80px" placeholder="https://www.facebook.com/yourbusiness"></textarea>
<p class="small" id="sg-note" aria-live="polite"></p><pre class="out" id="sg-out"></pre><button class="btn" type="button" id="sg-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  anchors: () => `<form class="ck-form" id="ac-form"><label for="ac-url" class="sr">Page address</label><input id="ac-url" type="text" inputmode="url" placeholder="yourwebsite.co.uk/page" required><button class="btn" type="submit">Check anchors</button></form><div id="ac-out" aria-live="polite"></div>
<h2 style="margin-top:36px">Anchor text generator</h2><form class="tool" id="ag-form"><div class="row"><div style="flex:2 1 220px"><label for="ag-kw">Target page topic or keyword</label><input id="ag-kw" type="text" value="boiler servicing"></div><div style="flex:1 1 160px"><label for="ag-brand">Brand name</label><input id="ag-brand" type="text" placeholder="Smith &amp; Sons"></div></div><label for="ag-url">Target page address</label><input id="ag-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/boiler-servicing"><div id="ag-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  plagiarism: () => `<form class="tool" id="pg-form"><label for="pg-text">Your text</label><textarea id="pg-text" style="min-height:200px;font-family:inherit;font-size:16px" placeholder="Paste the text you want to check…"></textarea>
<label for="pg-url">Compare with a page (optional)</label><input id="pg-url" type="text" inputmode="url" placeholder="https://suspected-copy.co.uk/page">
<p style="margin:16px 0 0"><button class="btn" type="submit">Check for plagiarism</button></p><div id="pg-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  difficulty: () => `<form class="tool" id="kd-form"><label for="kd-kw">Keyword</label><input id="kd-kw" type="text" placeholder="boiler repair blackpool" required>
<p style="margin:12px 0 0"><strong>Step 1:</strong> <a class="btn ghost" id="kd-google" href="https://www.google.co.uk/search" target="_blank" rel="noopener">Search Google</a></p>
<label for="kd-urls"><strong>Step 2:</strong> paste the addresses of the page-one results (up to 10, one per line – skip ads and maps)</label><textarea id="kd-urls" spellcheck="false" placeholder="https://example.co.uk/page"></textarea>
<p style="margin:16px 0 0"><button class="btn" type="submit">Check difficulty</button></p><div id="kd-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  localserp: () => `<form class="tool" id="ls-form"><div class="row"><div style="flex:2 1 240px"><label for="ls-q">What would a customer search?</label><input id="ls-q" type="text" value="emergency plumber"></div><div style="flex:1 1 160px"><label for="ls-town">Town or city</label><input id="ls-town" type="text" value="Blackpool"></div><div style="flex:1 1 150px"><label for="ls-region">Nation</label><select id="ls-region"><option>England</option><option>Scotland</option><option>Wales</option><option>Northern Ireland</option></select></div></div>
<p style="margin:16px 0 4px"><a class="btn" id="ls-go" target="_blank" rel="noopener">See Google results from there</a></p><p class="small" id="ls-note" aria-live="polite"></p></form><script src="/assets/tools.js" defer></script>`,
  aiwriter: () => `<form class="tool" id="ai-form"><label for="ai-url">Page address (optional – we'll read the page)</label><input id="ai-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/services">
<label for="ai-about">…or describe the page</label><textarea id="ai-about" style="min-height:90px;font-family:inherit;font-size:16px" placeholder="Family-run plumbers in Blackpool. Boiler repairs, servicing and emergency callouts, Gas Safe registered, no callout fee."></textarea>
<div class="row"><div style="flex:2 1 220px"><label for="ai-kw">Main keyword</label><input id="ai-kw" type="text" placeholder="boiler repair"></div><div style="flex:1 1 160px"><label for="ai-town">Town (optional)</label><input id="ai-town" type="text" placeholder="Blackpool"></div></div>
<p style="margin:16px 0 0"><button class="btn" type="submit">Write with AI</button></p><div id="ai-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  bulk: () => `<form class="tool" id="bk-form"><label for="bk-urls">Web addresses – one per line, up to 20</label><textarea id="bk-urls" spellcheck="false" placeholder="yoursite.co.uk&#10;competitor.co.uk&#10;yoursite.co.uk/services"></textarea>
<p style="margin:16px 0 0"><button class="btn" type="submit">Check them all</button></p><div id="bk-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  badge: () => `<form class="tool" id="bd-form"><label for="bd-site">Your website</label><input id="bd-site" type="text" inputmode="url" placeholder="yoursite.co.uk">
<p style="margin:16px 0 6px;font-weight:600">Preview</p><div id="bd-prev"></div><p style="margin:16px 0 6px;font-weight:600">Code to paste into your site</p><pre class="out" id="bd-code"></pre><button class="btn" type="button" id="bd-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
};

// crawlers offered by the robots tester: [token(s) in fallback order, label, purpose]
const ROBOT_AGENTS = [
  ["googlebot", "Googlebot", "Google Search and AI Overviews"], ["bingbot", "Bingbot", "Bing and Copilot"],
  ["oai-searchbot", "OAI-SearchBot", "ChatGPT search results"], ["chatgpt-user", "ChatGPT-User", "ChatGPT fetching a page for a user"], ["gptbot", "GPTBot", "OpenAI model training"],
  ["claude-searchbot", "Claude-SearchBot", "Claude search results"], ["claude-user", "Claude-User", "Claude fetching a page for a user"], ["claudebot", "ClaudeBot", "Anthropic model training"],
  ["perplexitybot", "PerplexityBot", "Perplexity search results"], ["google-extended", "Google-Extended", "Gemini training and grounding (token only)"],
  ["applebot", "Applebot", "Siri and Spotlight"], ["ccbot", "CCBot", "Common Crawl dataset"],
];
const AGENT_FALLBACK = { "googlebot-image": ["googlebot-image", "googlebot"] };

function robotsTest(body) {
  const robots = String(body.robots || "").slice(0, 200_000);
  let path = String(body.url || "/").trim();
  if (!path) return { error: "Enter a URL or path to test." };
  try { const u = new URL(/^[a-z]+:\/\//i.test(path) ? path : "https://x.invalid" + (path.startsWith("/") ? "" : "/") + path); path = u.pathname + u.search; } catch { return { error: "That URL doesn't look right." }; }
  const one = ROBOT_AGENTS.find(([t]) => t === body.agent) || ROBOT_AGENTS[0];
  const allows = (t) => robotsAllows(robots, AGENT_FALLBACK[t] || [t], path);
  return { path, agentName: one[1], allowed: allows(one[0]), all: ROBOT_AGENTS.map(([t, name, use]) => ({ name, use, allowed: allows(t) })) };
}

// ---------- pages
const faqs = (list) => list && list.length ? `<h2>Frequently asked questions</h2>${list.map(([q, a]) => `<details><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("")}` : "";
const guideCards = () => `<div class="grid">${GUIDES.map((g) => `<a class="card" href="${g.path}"><p class="ct">${esc(g.crumb)}</p><p>${esc(g.desc)}</p></a>`).join("")}</div>`;
const CTA = `<div class="cta"><p class="ct" style="font-size:26px">Run a free SEO check now</p><p>About 50 checks covering Google, AI search, speed, security and local SEO. No sign-up.</p><form class="ck-form" action="/seo-checker" method="get" role="search"><label for="cta-url" class="sr">Website address</label><input id="cta-url" name="url" type="text" inputmode="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Check my site</button></form></div>`;
const MAKER = `<div class="maker"><p><strong>Want the fixes done for you?</strong> XKey is made by <a href="https://icework.co.uk/?utm_source=xkey&amp;utm_medium=referral" rel="noopener">IceWork</a>, a web studio in ${BRAND.town}. IceWork builds fast, search-ready websites – a 3-page site including domain and a year's hosting is £${BRAND.price} all in.</p></div>`;

const INSTANT = new Set(["title", "robots", "llms", "meta", "og", "sitemap", "words", "keywords", "titles", "robotsgen", "schemagen", "localserp"]);
const freeStrip = (f) => `<ul class="free" aria-label="What free means here"><li>No cost</li><li>No sign-up</li><li>No email</li><li>No subscription</li><li>${INSTANT.has(f) ? "Unlimited – runs in your browser" : "No limits for normal use"}</li></ul>`;
function render(p) {
  const form = p.form ? FORMS[p.form](p) : "";
  const isTool = !p.article && p.path !== "/about" && p.path !== "/contact" && p.path !== "/privacy";
  const body = `<div class="wrap hero"${p.form ? "" : ' style="padding-bottom:24px"'}>${p.eyebrow ? `<span class="eyebrow">${esc(p.eyebrow)}</span>` : ""}<h1>${esc(p.h1)}</h1><p class="lead">${esc(p.lead)}</p>${form}${p.form ? freeStrip(p.form) : ""}</div>
<section style="padding-top:0"><div class="wrap prose">${p.article ? `<p class="small">Last updated <time datetime="${UPDATED}">${new Date(UPDATED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time> · By the XKey team</p>` : ""}${p.sections || ""}${faqs(p.faqs)}</div>
${p.tools ? `<div class="wrap">${toolCards()}</div>` : ""}${p.guides ? `<div class="wrap">${guideCards()}</div>` : ""}
${isTool && !p.tools && !p.guides ? `<div class="wrap"><h2>More free SEO tools</h2>${toolCards(p.path)}</div>` : ""}
<div class="wrap">${p.form === "check" ? "" : CTA}${p.path === "/contact" || p.path === "/privacy" ? "" : MAKER}</div></section>`;
  return layout({ ...p, body });
}
const HTML = Object.fromEntries(PAGES.map((p) => [p.path, render(p)]));
const NOT_FOUND = layout({ path: "/404", crumb: "Not found", title: "Page not found | XKey", desc: "That page doesn't exist.", noindex: true, body: `<div class="wrap hero"><h1>Page not found</h1><p class="lead">That page doesn't exist or has moved.</p><a class="btn" href="/">Run a free SEO check</a></div>` });

// handleChecker's page(k): the landing pages its forms and error pages belong to
const ENGINE_PAGE = { landing: "/", audit: "/website-audit", compare: "/seo-comparison", report: "/" };
const enginePage = (k) => BY_PATH[ENGINE_PAGE[k] || "/"];

// ---------- static files
const OG_BYTES = Uint8Array.from(atob(OG_PNG), (c) => c.charCodeAt(0));
const INDEXED = PAGES.filter((p) => !p.noindex);
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${INDEXED.map((p) => `<url><loc>${SITE}${p.path}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}\n</urlset>\n`;
const ROBOTS = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /monitor/\n\nSitemap: ${SITE}/sitemap.xml\n`;
const LLMS = `# ${BRAND.name}\n\n> Free SEO and AI search checker for UK websites, made by ${BRAND.maker} (${BRAND.makerUrl}), a web studio in ${BRAND.town}. No sign-up.\n\nXKey checks a page for Google readiness, AI search visibility (ChatGPT, Claude, Perplexity, Google AI Overviews), Core Web Vitals, structured data, security and local SEO, and gives a ranked list of fixes. It also crawls whole sites, compares competitors and monitors sites weekly.\n\n## Tools\n\n${INDEXED.filter((p) => !p.article && !["/about", "/contact", "/privacy"].includes(p.path)).map((p) => `- [${p.crumb === "Home" ? "Free SEO check" : p.crumb}](${SITE}${p.path}): ${p.desc}`).join("\n")}\n\n## Guides\n\n${GUIDES.map((p) => `- [${p.crumb}](${SITE}${p.path}): ${p.desc}`).join("\n")}\n\n## About\n\n- [About XKey](${SITE}/about)\n- [Contact](${SITE}/contact)\n- [Privacy](${SITE}/privacy)\n`;
const MANIFEST = JSON.stringify({ name: BRAND.name, short_name: BRAND.name, start_url: "/", display: "browser", background_color: "#f6f8fb", theme_color: "#0e1726", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] });

// IndexNow: submit every page once per site version.
const INDEXNOW_KEY = "7b3e9c41d2a84f06b5e1c8a9f0d36e72";
const SITE_VERSION = (() => { let h = 2166136261; const t = JSON.stringify(PAGES); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); })();
async function submitIndexNow(env) {
  if (!env || !env.STATE) return "no KV binding";
  if ((await env.STATE.get("indexnow")) === SITE_VERSION) return "already submitted";
  const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: BRAND.domain, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: INDEXED.map((p) => SITE + p.path) }) });
  if (res.status === 200 || res.status === 202) { await env.STATE.put("indexnow", SITE_VERSION); return "submitted " + res.status; }
  return "failed " + res.status;
}

// A Worker can't fetch its own custom domain (HTTP 522), so checks of xkey.co.uk run in-process.
const OWN_HOSTS = new Set([BRAND.domain, `www.${BRAND.domain}`]);
export const selfFetch = (env, ctx) => async (inp, init = {}) => {
  const u = new URL(typeof inp === "string" ? inp : inp.url);
  if (!OWN_HOSTS.has(u.hostname)) return fetch(inp, init);
  const { signal, ...rest } = init;
  const res = await worker.fetch(new Request(u.href, { ...rest, redirect: "manual" }), env, ctx);
  const headers = new Headers(res.headers); headers.set("x-checker-internal", "1");
  return new Response((rest.method || "GET").toUpperCase() === "HEAD" ? null : res.body, { status: res.status, headers });
};

// ---------- score badge
const badgeSvg = (score) => {
  const right = score == null ? "checked" : `${score}/100`, col = score == null ? "#0a6f6a" : score >= 90 ? "#1a7f37" : score >= 70 ? "#9a6700" : "#cf222e";
  const lw = 106, rw = score == null ? 62 : 58;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + rw}" height="22" role="img" aria-label="SEO score: ${right} by XKey"><title>SEO score: ${right} – checked by XKey (xkey.co.uk)</title><rect width="${lw}" height="22" rx="4" fill="#0e1726"/><rect x="${lw - 4}" width="${rw + 4}" height="22" rx="4" fill="${col}"/><rect x="${lw - 4}" width="4" height="22" fill="${col}"/><g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11"><text x="8" y="15">XKey SEO score</text><text x="${lw + rw / 2}" y="15" text-anchor="middle" font-weight="bold">${right}</text></g></svg>`;
};

// ---------- AI title & description writer (Workers AI, free daily allocation)
async function aiSnippet(env, ctx, b) {
  const kw = String(b.keyword || "").slice(0, 80).trim(), town = String(b.town || "").slice(0, 60).trim();
  let about = String(b.about || "").slice(0, 1500).trim(), page = null;
  if (b.url && String(b.url).trim()) {
    try { const r = await fetchHtml(String(b.url).trim(), selfFetch(env, ctx)); if (r.status === 200 && r.html) page = summarisePage(r.html, r.url); else return { error: `That page returned HTTP ${r.status || "error"}.` }; }
    catch (e) { return { error: (e && e.message) || "Couldn't reach that page." }; }
    about = `Current title: ${page.title}\nCurrent description: ${page.desc}\nMain heading: ${page.h1.join(" / ")}\nPage text: ${page.text.slice(0, 2500)}`;
  }
  if (!about && !kw) return { error: "Enter a page address, or describe the page." };
  const prompt = `You write search-result snippets for UK small business websites. Use British English. Be specific and honest: never invent prices, awards, reviews or claims that aren't in the information given.
Write 3 page titles (each under 60 characters, main keyword near the start${town ? ", include the town" : ""}) and 3 meta descriptions (each 120 to 155 characters, plain benefit plus a call to action).
Main keyword: ${kw || "(choose from the page)"}${town ? `\nTown: ${town}` : ""}
About the page:
${about}
Reply with JSON only, exactly in this shape: {"titles":["...","...","..."],"descriptions":["...","...","..."]}`;
  let out;
  try { out = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", { messages: [{ role: "user", content: prompt }], max_tokens: 600, temperature: 0.6 }); }
  catch (e) { return { error: "The AI writer is busy or has reached today's free limit – please try again later." }; }
  const text = String((out && (out.response ?? out.result?.response)) || "");
  let j = null; try { j = JSON.parse((text.match(/\{[\s\S]*\}/) || ["{}"])[0]); } catch {}
  const clean = (a) => (Array.isArray(a) ? a : []).map((x) => String(x).replace(/\s+/g, " ").replace(/^["']|["']$/g, "").trim()).filter(Boolean).slice(0, 3);
  const titles = clean(j && j.titles).map((t) => ({ t, px: pixelWidth(t, 20) })), descriptions = clean(j && j.descriptions).map((t) => ({ t, px: pixelWidth(t, 14) }));
  if (!titles.length && !descriptions.length) return { error: "The AI didn't return usable suggestions – please try again." };
  return { titles, descriptions, current: page ? { title: page.title, desc: page.desc } : null };
}

const JS = "text/javascript; charset=utf-8", TXT = "text/plain; charset=utf-8", HTMLT = "text/html; charset=utf-8";

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname === `www.${BRAND.domain}` || (url.hostname === BRAND.domain && url.protocol === "http:")) return Response.redirect(`${SITE}${url.pathname}${url.search}`, 301);
    const c = ctx || { waitUntil() {} };

    if (request.method === "POST") {
      if (url.pathname === "/api/robots-test") {
        if (await rateLimited(request, "robotstest", 2000)) return Response.json({ error: "Too many tests this hour." }, { status: 429 });
        let body; try { body = JSON.parse((await request.text()).slice(0, 250_000)); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
        return Response.json(robotsTest(body || {}), { headers: { "cache-control": "no-store" } });
      }
      if (url.pathname === "/api/ai-snippet") {
        if (!env || !env.AI) return Response.json({ error: "The AI writer isn't available here." }, { status: 503 });
        if (await rateLimited(request, "ai", 30)) return Response.json({ error: "You've used the AI writer a lot this hour – please try again later." }, { status: 429 });
        if (await over(`ai-day/${Math.floor(Date.now() / 86_400_000)}`, 400)) return Response.json({ error: "The AI writer has reached today's free limit – please try again tomorrow." }, { status: 429 });
        let body; try { body = JSON.parse((await request.text()).slice(0, 20_000)); } catch { return Response.json({ error: "Bad request" }, { status: 400 }); }
        return Response.json(await aiSnippet(env, c, body || {}), { headers: { "cache-control": "no-store" } });
      }
      if (url.pathname.startsWith("/api/monitor")) {
        if (!env || !env.STATE) return send("Monitoring isn't available here.", TXT, 503);
        const back = (id) => new Response(null, { status: 303, headers: { location: `/monitor/${id}` } });
        const run = url.pathname.match(/^\/api\/monitor\/([A-Za-z0-9_-]+)\/run$/);
        if (run) {
          const id = run[1]; if (!validId(id) || !(await getMonitor(env, id))) return send("Not found", TXT, 404);
          if (!(await rateLimited(request, "monrun", 6)) && !(await overOnce(`monrun/${id}`))) await runMonitor(env, id, selfFetch(env, c));
          return back(id);
        }
        if (url.pathname === "/api/monitor") {
          if (await rateLimited(request, "moncreate", 20)) return send("Too many monitors created from your connection this hour.", TXT, 429);
          let id; try { const f = await request.formData(); id = await createMonitor(env, f.get("url")); } catch (e) { return send((e && e.message) || "Couldn't start monitoring.", TXT, 400); }
          const m = await getMonitor(env, id);
          if (!m.history.length) await runMonitor(env, id, selfFetch(env, c));
          return back(id);
        }
      }
      return send("Method not allowed", TXT, 405);
    }
    if (request.method !== "GET" && request.method !== "HEAD") return send("Method not allowed", TXT, 405);

    const path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) return Response.redirect(`${url.origin}${path.replace(/\/+$/, "")}${url.search}`, 301);
    if (path === "/index.html") return Response.redirect(`${url.origin}/`, 301);

    switch (path) {
      case "/sitemap.xml": return send(SITEMAP, "application/xml; charset=utf-8");
      case "/robots.txt": return send(ROBOTS, TXT);
      case "/llms.txt": return send(LLMS, TXT);
      case "/site.webmanifest": return send(MANIFEST, "application/manifest+json");
      case "/assets/audit.js": return send(AUDIT_JS, JS, 200, "public, max-age=3600");
      case "/assets/compare.js": return send(COMPARE_JS, JS, 200, "public, max-age=3600");
      case "/assets/report.js": return send(REPORT_JS, JS, 200, "public, max-age=3600");
      case "/assets/tools.js": return send(TOOLS_JS, JS, 200, "public, max-age=3600");
      case "/favicon.svg": return send(FAVICON, "image/svg+xml", 200, "public, max-age=31536000, immutable");
      case "/favicon.ico": return Response.redirect(`${url.origin}/favicon.svg`, 301);
      case "/og.png": return send(OG_BYTES, "image/png", 200, "public, max-age=86400");
      case `/${INDEXNOW_KEY}.txt`: return send(INDEXNOW_KEY, TXT);
      case "/badge.svg": {
        let t; try { t = normaliseUrl(url.searchParams.get("site") || ""); } catch { return send(badgeSvg(null), "image/svg+xml", 200, "public, max-age=3600"); }
        const host = t.hostname.replace(/^www\./, "");
        const saved = env && env.STATE ? await env.STATE.get("badge:" + host, "json") : null;
        if ((!saved || Date.now() - saved.t > 7 * 86_400_000) && env && env.STATE && !(await over(`badge-run/${host}/${Math.floor(Date.now() / 86_400_000)}`, 1))) {
          c.waitUntil(runCheck(t.origin + "/", selfFetch(env, c)).then((r) => env.STATE.put("badge:" + host, JSON.stringify({ s: r.score, t: Date.now() }), { expirationTtl: 60 * 86_400 })).catch(() => {}));
        }
        return send(badgeSvg(saved && saved.s), "image/svg+xml", 200, "public, max-age=21600");
      }
      case "/api/page": {
        let t; try { t = normaliseUrl(url.searchParams.get("url")); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
        if (await rateLimited(request, "page", 600)) return Response.json({ error: "Too many requests from your connection this hour." }, { status: 429 });
        if (await over(`page-host/${t.hostname}/${Math.floor(Date.now() / 3_600_000)}`, 300)) return Response.json({ error: "That website has been fetched a lot this hour – please try again later." }, { status: 429 });
        try {
          const r = await fetchHtml(t.href, selfFetch(env, c));
          if (r.status !== 200 || !r.html) return Response.json({ error: r.status ? `The page returned HTTP ${r.status}.` : "Couldn't reach that page.", url: t.href }, { status: 502 });
          return Response.json({ ...summarisePage(r.html, r.url), ms: r.ms }, { headers: { "cache-control": "no-store" } });
        } catch (e) { return Response.json({ error: (e && e.message) || "Couldn't reach that page.", url: t.href }, { status: 502 }); }
      }
      case "/api/discover": {
        if (await rateLimited(request, "discover", 60)) return Response.json({ error: "You've searched a lot of sites this hour – please try again later." }, { status: 429 });
        try {
          const f = selfFetch(env, c), st = await crawlStart(url.searchParams.get("url"), f);
          const [home] = await crawlBatch(st.host, [st.start], f);
          const found = new Set([st.start, ...st.sitemap.slice(0, 2000), ...((home && home.links) || [])].map((u) => { try { const x = new URL(u); x.hash = ""; return x.href; } catch { return null; } }).filter((u) => u && new URL(u).hostname === st.host && !/\.(jpe?g|png|gif|webp|svg|pdf|zip|css|js|xml|txt)$/i.test(new URL(u).pathname)));
          return Response.json({ urls: [...found].slice(0, 2000), fromSitemap: st.sitemap.length > 0 }, { headers: { "cache-control": "no-store" } });
        } catch (e) { return Response.json({ error: e.name === "AbortError" ? "The site took too long to respond." : (e.message || "Couldn't reach that website.").slice(0, 160) }, { status: 400 }); }
      }
      case "/api/robots": {
        let t; try { t = normaliseUrl(url.searchParams.get("url")); } catch (e) { return Response.json({ error: e.message }, { status: 400 }); }
        if (await rateLimited(request, "robotsload", 200)) return Response.json({ error: "Too many requests this hour." }, { status: 429 });
        try { const r = await fetchRobots(t.origin, selfFetch(env, c)); return Response.json({ origin: t.origin, status: r.status, text: r.text == null ? "" : r.text.slice(0, 200_000) }, { headers: { "cache-control": "no-store" } }); }
        catch (e) { return Response.json({ error: "Couldn't reach that website." }, { status: 502 }); }
      }
    }

    // engine routes (reports and APIs); the bare tool URLs belong to our landing pages
    const has = (k) => url.searchParams.has(k) && url.searchParams.get(k).trim();
    if (path === "/seo-checker" && !has("url")) return Response.redirect(`${url.origin}/`, 301);
    if (path === "/site-audit" && !has("url")) return Response.redirect(`${url.origin}/website-audit`, 301);
    if (path === "/seo-compare" && !url.searchParams.getAll("u").some((v) => v.trim())) return Response.redirect(`${url.origin}/seo-comparison`, 301);
    if (path === "/seo-checker" || path === "/site-audit" || path === "/seo-compare" || path === "/api/vitals" || path === "/api/check" || path.startsWith("/api/audit/")) {
      const r = await handleChecker(request, env, c, { layout, esc, BUSINESS: BRAND, page: enginePage, send, fetchImpl: selfFetch(env, c) });
      if (r) return r;
      if (path === "/seo-compare") return send(render({ ...BY_PATH["/seo-comparison"], noindex: true, prefill: url.searchParams.getAll("u").slice(0, 3) }), HTMLT, 200, "no-store");
    }
    if (path.startsWith("/monitor/") && env && env.STATE) {
      const m = await getMonitor(env, path.slice(9));
      if (m) return send(layout({ path, crumb: "SEO monitor", parent: ["/seo-monitoring", "SEO monitoring"], title: `SEO monitor: ${m.host}`, desc: "Weekly SEO monitoring dashboard.", noindex: true, body: dashboard(esc, m) }), HTMLT, 200, "no-store");
    }
    if (HTML[path]) return send(HTML[path], HTMLT);
    return send(NOT_FOUND, HTMLT, 404);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(submitIndexNow(env).then((r) => console.log("IndexNow:", r)));
    ctx.waitUntil(runDueMonitors(env, selfFetch(env, ctx), []).then((r) => console.log("Monitor:", r)).catch((e) => console.log("Monitor error:", e && e.message)));
  },
};
export default worker;
export { PAGES, HTML, robotsTest, INDEXNOW_KEY, SITEMAP, LLMS };
