// XKey site shell: brand, styles, layout and helpers. Content lives in content.js.
import { CHECKER_CSS } from "../engine/checker-ui.js";
import { MONITOR_CSS } from "../engine/monitor.js";
import { FONT_PATHS } from "./fonts.js";
import { GUIDE_FOR } from "./builder-guides.js";
import { DATES } from "./page-dates.js";

export const BRAND = { name: "XKey", fullName: "XKey", domain: "xkey.co.uk", tagline: "Free SEO & AI search check", maker: "IceWork", makerUrl: "https://icework.co.uk", email: "iceworks@f1rst.co.uk", price: 350, town: "Blackpool",
  // SEO report extras (engine/checker-ui.js): the authority & backlinks section, and our free tool for each fix
  offsite: true,
  whois: true,
  guides: GUIDE_FOR,
  tools: {
    "Title tag": ["/title-tag-checker", "Preview and measure your title with the free title tag checker"],
    "Meta description": ["/ai-meta-description-generator", "Write one free with the AI title & description writer"],
    "Open Graph & social cards": ["/open-graph-generator", "Make the tags with the free Open Graph generator"],
    "XML sitemap": ["/xml-sitemap-generator", "Make one with the free XML sitemap generator"],
    "AI crawler access": ["/robots-txt-generator", "Make a new robots.txt with the free generator"],
    "Indexable": ["/robots-txt-tester", "Test your robots.txt rules with the free tester"],
    "llms.txt": ["/llms-txt-generator", "Make one with the free llms.txt generator"],
    "LocalBusiness markup": ["/schema-generator", "Make the code with the free local business schema generator"],
    "Entity clarity": ["/schema-generator", "Make the code with the free local business schema generator"],
    "JSON-LD present & valid": ["/schema-generator", "Make valid code with the free schema generator"],
    "Word count": ["/word-counter", "Count words and keywords with the free word counter"],
    "Topic focus": ["/keyword-generator", "Find the phrases people search with the free keyword generator"],
    "Anchor text quality": ["/anchor-text-checker", "Check every link's wording with the free anchor text checker"],
  },
  // check name → [guide, title] – shown under each fix in the report
  learn: {
    "Indexable": ["/guides/why-is-my-website-not-on-google", "why isn't my website on Google?"],
    "Title tag": ["/guides/title-tags", "how to write title tags"],
    "Meta description": ["/guides/meta-descriptions", "how to write meta descriptions"],
    "Open Graph & social cards": ["/guides/does-social-media-help-seo", "does social media help SEO?"],
    "Image alt text": ["/guides/image-seo", "image SEO"],
    "Images": ["/guides/image-seo", "image SEO"],
    "Internal linking": ["/guides/internal-linking", "internal linking"],
    "Link names": ["/guides/internal-linking", "internal linking"],
    "Anchor text quality": ["/guides/internal-linking", "internal linking"],
    "Breadcrumbs": ["/guides/internal-linking", "internal linking"],
    "Word count": ["/guides/how-to-write-seo-content", "how to write SEO content"],
    "Topic focus": ["/guides/how-to-write-seo-content", "how to write SEO content"],
    "Question-led content": ["/guides/how-to-write-seo-content", "how to write SEO content"],
    "Readability": ["/guides/how-to-write-seo-content", "how to write SEO content"],
    "Heading structure": ["/guides/on-page-seo-checklist", "the on-page SEO checklist"],
    "Canonical URL": ["/guides/duplicate-content", "duplicate content"],
    "HTTPS": ["/guides/website-not-secure", "fixing a \"Not secure\" warning"],
    "HTTP → HTTPS redirect": ["/guides/website-not-secure", "fixing a \"Not secure\" warning"],
    "Mobile viewport": ["/guides/mobile-friendly-website", "mobile-friendly websites"],
    "Tap-to-contact": ["/guides/mobile-friendly-website", "mobile-friendly websites"],
    "Redirects": ["/guides/broken-links-and-redirects", "broken links and redirects"],
    "robots.txt": ["/guides/robots-txt", "robots.txt explained"],
    "XML sitemap": ["/guides/xml-sitemaps", "XML sitemaps"],
    "Security headers": ["/guides/technical-seo-checklist", "the technical SEO checklist"],
    "HSTS": ["/guides/technical-seo-checklist", "the technical SEO checklist"],
    "Render-blocking resources": ["/guides/core-web-vitals", "Core Web Vitals"],
    "Scripts & third parties": ["/guides/core-web-vitals", "Core Web Vitals"],
    "LocalBusiness markup": ["/guides/schema-markup", "schema markup"],
    "JSON-LD present & valid": ["/guides/schema-markup", "schema markup"],
    "Entity clarity": ["/guides/schema-markup", "schema markup"],
    "AI crawler access": ["/guides/block-ai-training-bots", "blocking AI training bots"],
    "llms.txt": ["/guides/llms-txt", "do you need llms.txt?"],
    "Map & directions": ["/guides/local-seo-checklist", "the local SEO checklist"],
    "Contact details on page": ["/guides/local-seo-checklist", "the local SEO checklist"],
  } };
export const SITE = `https://${BRAND.domain}`;
// The address written as HTML character codes: browsers and screen readers show it normally, but
// spam bots scanning pages for name@domain don't pick it up.
export const EMAIL_HTML = [...BRAND.email].map((c) => `&#${c.charCodeAt(0)};`).join("");
export const UPDATED = "2026-10-12";

// Each page's first-published and last-changed dates (src/page-dates.js, kept up to date by
// `node test/dates.mjs`, which test/all.mjs runs first). A page whose content no longer matches its
// stored hash, or a new page, counts as changed on UPDATED.
export const pageHash = (p) => { let h = 2166136261; const t = JSON.stringify(p); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
export function pageDates(p) {
  const d = DATES[p.path];
  return d && d[2] === pageHash(p) ? { published: d[0], modified: d[1] } : { published: d ? d[0] : UPDATED, modified: UPDATED };
}

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const CSS = `:root{--bg:#faf8f3;--fg:#0f1011;--mute:#4b4e54;--line:rgba(15,16,17,.15);--card:#fffefa;--brand:#0a6560;--brand-ink:#faf8f3;--soft:transparent;--hero:#0f1011;--hero-fg:#faf8f3}
@media (prefers-color-scheme:dark){:root{--bg:#0f1011;--fg:#ece8de;--mute:#a7a59e;--line:rgba(236,232,222,.15);--card:#141517;--brand:#3fd0c9;--brand-ink:#0f1011;--soft:transparent;--hero:#ece8de;--hero-fg:#0f1011}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
a{color:inherit}a:hover{color:var(--brand)}img,svg{max-width:100%}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
header.top{border-bottom:1px solid var(--line);background:var(--bg)}
.nav{display:flex;align-items:center;gap:20px;min-height:64px;flex-wrap:wrap}
.logo{font-weight:900;font-size:24px;text-decoration:none;letter-spacing:-.03em;display:inline-block;padding:8px 0;min-height:44px}.logo b{color:var(--brand)}
.nav ul{display:flex;gap:4px 18px;list-style:none;margin:0 0 0 auto;padding:0;flex-wrap:wrap}.nav ul a{text-decoration:none;color:var(--mute);font-size:15px;display:inline-block;padding:10px 0}.nav ul a:hover,.nav ul a[aria-current]{color:var(--fg)}
.btn{display:inline-block;background:var(--brand);color:var(--brand-ink);padding:12px 22px;border-radius:12px;text-decoration:none;font-weight:700;border:0;cursor:pointer;font:inherit;font-weight:700}.btn:hover{color:var(--brand-ink);filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--fg);border:1px solid var(--line)}
.hero{padding-top:64px;padding-bottom:48px}.hero h1{font-size:clamp(34px,6vw,60px);line-height:1.06;letter-spacing:-.035em;margin:0 0 18px;max-width:16em}
.lead{font-size:20px;color:var(--mute);max-width:38em;margin:0 0 24px}
.eyebrow{display:inline-block;background:var(--soft);color:var(--brand);font-weight:700;font-size:14px;padding:4px 12px;border-radius:8px;margin-bottom:18px}
.row{display:flex;gap:12px;flex-wrap:wrap}
section{padding:40px 0}h2{font-size:30px;letter-spacing:-.02em;line-height:1.2;margin:0 0 14px}h3{font-size:20px;margin:0 0 6px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:22px}
.ct{font-weight:700;font-size:20px;margin:0 0 6px;color:var(--fg)!important}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px}.card p{margin:0;color:var(--mute)}
a.card{text-decoration:none;display:block}a.card:hover{border-color:var(--brand)}a.card .ct::after{content:" →";color:var(--brand)}
.prose>*{max-width:46em}.prose h2{margin-top:36px}
.crumbs{font-size:14px;color:var(--mute);padding-top:16px}.crumbs a{color:var(--mute);display:inline-block;padding:12px 0;min-width:44px}
.cta{background:var(--hero);color:var(--hero-fg);border-radius:20px;padding:36px;margin:40px 0}.cta h2,.cta .ct{color:var(--hero-fg)!important}.cta p{color:var(--hero-fg);opacity:.85}
.tablewrap{overflow-x:auto}.promise{border-top:1px solid var(--line);background:var(--card)}.promise .wrap{padding-top:22px;padding-bottom:22px}.promise p{margin:0}.promise ul{display:flex;flex-wrap:wrap;gap:8px 18px;list-style:none;padding:0;margin:10px 0 0}.promise li{font-size:15px}.promise li::before{content:"✓ ";color:var(--brand);font-weight:700}table{border-collapse:collapse;width:100%;margin:12px 0}th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}th{font-size:15px}
details{border-bottom:1px solid var(--line);padding:14px 0}summary{cursor:pointer;font-weight:600}summary h3{display:inline;font-size:18px;margin:0}
footer{border-top:1px solid var(--line);margin-top:56px;padding:32px 0;color:var(--mute);font-size:15px}footer .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px 32px}footer ul{list-style:none;padding:0;margin:0}footer a{color:var(--mute);display:inline-block;padding:10px 0;min-height:44px}
.small{font-size:14px;color:var(--mute)}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tool{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin:8px 0 18px}.tool label{display:block;font-weight:600;font-size:15px;margin:12px 0 6px}.tool input,.tool textarea,.tool select{width:100%;font:inherit;font-size:16px;padding:12px 14px;border:2px solid var(--line);border-radius:12px;background:var(--bg);color:var(--fg)}.tool textarea{min-height:150px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px}
.meter{height:12px;border-radius:999px;background:var(--line);overflow:hidden;margin:8px 0}.meter span{display:block;height:100%;border-radius:999px;transition:width .15s}
.serp{border:1px solid var(--line);border-radius:12px;padding:14px 16px;background:var(--card);margin-top:12px;font-family:Arial,sans-serif}.serp .u{font-size:14px;color:var(--mute)}.serp .t{font-size:20px;color:#1a0dab;line-height:1.3;margin:4px 0}.serp .d{font-size:14px;color:var(--mute)}@media (prefers-color-scheme:dark){.serp .t{color:#8ab4f8}}
.out{white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:14px;overflow-x:auto}
.recent{list-style:none;padding:0;margin:6px 0;display:flex;flex-direction:column;gap:2px}.recent a{display:inline-block;padding:8px 0;min-height:44px}
.maker{background:var(--soft);border-radius:14px;padding:18px 20px;margin:24px 0}.maker p{margin:0}
.pt0{padding-top:0}.mb40{margin-bottom:40px}.hero.pb24{padding-bottom:24px}.cta.first{margin-top:0}.ct.big{font-size:24px}.m0{margin:0}
${CHECKER_CSS}
${MONITOR_CSS}
.cmp-l input{font-weight:400}
.free{display:flex;flex-wrap:wrap;gap:6px 18px;list-style:none;padding:0;margin:14px 0 0;font-size:15px;font-weight:600;color:var(--fg)}.free li::before{content:"✓ ";color:var(--brand)}
.ogc{border:1px solid var(--line);border-radius:12px;overflow:hidden;max-width:520px;background:var(--card)}.ogi{aspect-ratio:1.91/1;background:var(--line) center/cover no-repeat}.ogn{display:flex;align-items:center;justify-content:center;color:var(--mute);font-size:14px}.ogt{padding:10px 14px;display:flex;flex-direction:column;gap:2px;font-family:Arial,sans-serif}.ogt span{font-size:12px;color:var(--mute)}.ogt b{font-size:16px}.ogt small{font-size:14px;color:var(--mute)}
.tool .row>div{min-width:0}
.prose code{overflow-wrap:anywhere}pre{max-width:100%;overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.5}pre code{overflow-wrap:normal;white-space:pre}
@font-face{font-family:Fraunces;src:url(${FONT_PATHS.fraunces}) format("woff2");font-weight:500 900;font-display:optional}
@font-face{font-family:"Geist Mono";src:url(${FONT_PATHS["geist-mono"]}) format("woff2");font-weight:400 700;font-display:optional}
:root{--font-editorial:Fraunces,Georgia,"Times New Roman",serif;--font-mono:"Geist Mono",ui-monospace,Menlo,Consolas,monospace;--ease:cubic-bezier(.16,1,.3,1)}
*,*::before,*::after{border-radius:0!important;box-shadow:none!important;text-shadow:none!important}
body::after{content:"";position:fixed;inset:0;z-index:2147483647;pointer-events:none;opacity:.05;transform:translateZ(0)}
.g body::after{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.05'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")}
h1,h2,h3,.ct,.logo{font-family:var(--font-editorial);font-weight:650}.hero h1{font-weight:700;letter-spacing:-.025em}.logo{font-weight:900}
code,kbd,pre,.out,.tool textarea,.eyebrow,.nav ul a,.btn,.crumbs,.pill,.imp,.free,.promise ul,.vit b,.ring b,th,.au-table,.small time{font-family:var(--font-mono)}
.eyebrow{background:none;color:var(--fg);border:1px solid var(--fg);font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;padding:3px 10px}
.btn,.btn.ghost{background:transparent!important;color:var(--fg)!important;border:1px solid var(--fg)!important;font-weight:600;letter-spacing:.01em;filter:none!important}
.btn:hover,.btn:active,.btn:focus-visible,.btn[aria-pressed=true]{background:var(--fg)!important;color:var(--bg)!important}
.cta .btn{color:var(--hero-fg)!important;border-color:var(--hero-fg)!important}.cta .btn:hover,.cta .btn:active,.cta .btn:focus-visible{background:var(--hero-fg)!important;color:var(--hero)!important}
.nav ul{gap:4px}.nav ul a{color:var(--fg);font-size:14px;padding:10px 12px;border:1px solid transparent}.nav ul a[aria-current]{border-color:var(--fg)}.nav ul a:hover,.nav ul a:active,.nav ul a:focus-visible{background:var(--fg);color:var(--bg);border-color:var(--fg)}
a,button,summary,.btn,.nav ul a,a.card,input,select,textarea{transition:none!important}
a.card:hover{border-color:var(--fg)}a.card .ct::after{color:var(--fg)}
.tool input,.tool textarea,.tool select,.ck-form input{border:1px solid var(--fg)!important}input:focus,textarea:focus,select:focus,[contenteditable]:focus{outline:2px solid var(--brand)!important;outline-offset:1px}
:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.hero{border-bottom:1px solid var(--line);margin-bottom:40px}.prose h2{border-top:1px solid var(--line);padding-top:32px}.prose>h2:first-child{border-top:0;padding-top:0}.maker{background:none;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0}
.meter span,.au-bar span{transition-timing-function:var(--ease)}
.rv{opacity:0;transform:translateY(28px)}.rv.in{opacity:1;transform:none;transition:opacity .9s var(--ease),transform 1.1s var(--ease)!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
@media print{body::after{display:none}}
@media (prefers-color-scheme:dark){body::after{filter:invert(1);opacity:.06}}
@media (max-width:640px){.nav{gap:0;min-height:0}.nav ul{margin:0 -20px;padding:0 20px;width:calc(100% + 40px);flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:0 18px}.nav ul::-webkit-scrollbar{display:none}.nav ul a{white-space:nowrap;font-size:15px}.hero{padding-top:28px;padding-bottom:28px}.hero h1{font-size:34px}.lead{font-size:18px}.cta{padding:26px}}
@media (max-width:640px){.nav ul{gap:0 4px}.nav ul a{font-size:14px}}`;

// After the page has loaded: grain texture on, and blocks below the first screen drift in as they're scrolled to.
// External file (report pages' CSP blocks inline scripts); the path carries a hash so it can be cached for good.
export const SITE_JS = "(function(){var run=function(){var d=document;d.documentElement.classList.add(\"g\");if(!window.IntersectionObserver||matchMedia(\"(prefers-reduced-motion: reduce)\").matches)return;var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(\"in\");io.unobserve(e.target)}})},{rootMargin:\"0px 0px -8% 0px\"});d.querySelectorAll(\".prose>h2,.prose>p,.prose>ul,.prose>details,.grid>*,.cta,.maker\").forEach(function(el){if(el.getBoundingClientRect().top>innerHeight){el.classList.add(\"rv\");io.observe(el)}});addEventListener(\"beforeprint\",function(){d.querySelectorAll(\".rv\").forEach(function(el){el.classList.add(\"in\")})})};if(document.readyState===\"complete\")run();else addEventListener(\"load\",run)})();\n";
let jsHash = 2166136261; for (const c of SITE_JS) jsHash = Math.imul(jsHash ^ c.charCodeAt(0), 16777619) >>> 0;
export const SITE_JS_PATH = `/assets/site-${jsHash.toString(36)}.js`;

// Tool scripts (/assets/tools.js etc.) are linked as /assets/<name>.js?v=<hash of the script>, so
// browsers can keep them for a year; index.js fills ASSET_V before any page is rendered.
export const ASSET_V = {};
export const assetHash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0; return h.toString(36); };
const versioned = (html) => html.replace(/(src="\/assets\/)([a-z0-9]+)\.js"/g, (m, a, n) => (ASSET_V[n] ? `${a}${n}.js?v=${ASSET_V[n]}"` : m));

export const NAV = [["/", "SEO check"], ["/website-crawler", "Site crawler"], ["/ai-seo-checker", "AI SEO checker"], ["/website-audit", "Site audit"], ["/seo-comparison", "Compare"], ["/seo-tools", "All tools"], ["/guides", "Guides"]];

export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0f1011"/><path d="M14 16l12 16-12 16h9l7.5-10L38 48h9L35 32l12-16h-9l-7.5 10L23 16z" fill="#3fd0c9"/></svg>`;

function jsonld(p) {
  const url = SITE + p.path, modified = p.modified || UPDATED, published = p.published || modified;
  const g = [
    { "@type": "Organization", "@id": `${SITE}/#org`, name: BRAND.name, description: "Free SEO and AI search tools for UK businesses. Every tool is free, with no account, no email, no Google sign-in and no paid version.", url: `${SITE}/`, logo: `${SITE}/favicon.svg`, email: BRAND.email, address: { "@type": "PostalAddress", addressLocality: BRAND.town, addressRegion: "Lancashire", addressCountry: "GB" }, areaServed: "GB", parentOrganization: { "@type": "Organization", "@id": "https://icework.co.uk/#business", name: BRAND.maker, url: BRAND.makerUrl + "/" } },
    { "@type": "WebSite", "@id": `${SITE}/#site`, url: `${SITE}/`, name: BRAND.name, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" },
    p.app ? { "@type": "WebApplication", "@id": `${url}#app`, name: p.app, url, applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, dateModified: modified, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }, publisher: { "@id": `${SITE}/#org` } }
      : p.article ? { "@type": p.news ? "NewsArticle" : "Article", "@id": `${url}#page`, headline: p.h1, description: p.desc, url, ...(p.news ? { image: `${SITE}/og.png`, mainEntityOfPage: url } : {}), dateModified: modified, datePublished: published, author: { "@id": `${SITE}/#org` }, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" }
      : { "@type": "WebPage", "@id": `${url}#page`, url, name: p.title, description: p.desc, isPartOf: { "@id": `${SITE}/#site` }, dateModified: modified },
  ];
  if (p.itemList) g.push({ "@type": "ItemList", name: "Free SEO tools", itemListElement: p.itemList.map(([path, name], i) => ({ "@type": "ListItem", position: i + 1, name, url: SITE + path })) });
  // FAQPage mirrors the questions and answers shown on the page (faqs() in index.js).
  if (p.faqs && p.faqs.length) g.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: p.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  if (p.path !== "/") g.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, ...(p.parent ? [{ "@type": "ListItem", position: 2, name: p.parent[1], item: SITE + p.parent[0] }] : []), { "@type": "ListItem", position: p.parent ? 3 : 2, name: p.crumb, item: url }] });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c").replace(/@(?=[\w-]+\.)/g, "\\u0040"); // same data for parsers, no plain email address for bots
}

export function layout(p) {
  return versioned(page(p));
}

function page(p) {
  const url = SITE + p.path;
  const nav = NAV.map(([h, t]) => `<li><a href="${h}"${h === p.path ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const crumbs = p.path === "/" ? "" : `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a> / ${p.parent ? `<a href="${p.parent[0]}">${esc(p.parent[1])}</a> / ` : ""}${esc(p.crumb || "")}</nav>`;
  const maker = p.noindex ? `<div class="wrap"><div class="maker noprint"><p><strong>Want these fixed for you?</strong> XKey is made by <a href="${BRAND.makerUrl}/" rel="noopener">${BRAND.maker}</a>, a ${BRAND.town} web studio. IceWork builds fast websites that pass every check here – a 3-page site with domain and a year's hosting is £${BRAND.price} all in.</p></div></div>` : "";
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.desc)}"><link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
<meta property="og:type" content="${p.article ? "article" : "website"}">${p.article && p.modified ? `<meta property="article:published_time" content="${p.published}"><meta property="article:modified_time" content="${p.modified}">` : ""}<meta property="og:site_name" content="${BRAND.name}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/og.png">
${p.news || p.newsHub ? `<link rel="alternate" type="application/rss+xml" title="XKey SEO news" href="${SITE}/news/rss.xml">` : ""}<link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0f1011">
<style>${CSS}</style><script type="application/ld+json">${jsonld(p)}</script></head><body>
<header class="top"><div class="wrap nav"><a class="logo" href="/" aria-label="XKey home">X<b>Key</b></a><ul>${nav}</ul></div></header>
${crumbs}<main>${p.body}${maker}</main>
<aside class="promise noprint" aria-label="The XKey free promise"><div class="wrap"><p><strong>Every XKey tool is 100% free – for good.</strong> No catch, no paid version, nothing to unlock.</p><ul><li>No account</li><li>No email</li><li>No "Sign in with Google"</li><li>No card details</li><li>No trial</li><li>No subscription</li></ul></div></aside>
<footer><div class="wrap"><div class="cols">
<div><a class="logo" href="/">X<b>Key</b></a><p>${BRAND.tagline}. No cost, no sign-up, no email, no subscription. Built in the UK.</p><p class="small">Made by <a href="${BRAND.makerUrl}" rel="noopener">${BRAND.maker}</a>, ${BRAND.town}.</p></div>
<div><strong>SEO checks</strong><ul><li><a href="/">Free SEO check</a></li><li><a href="/website-crawler">Website crawler</a></li><li><a href="/ai-seo-checker">AI SEO checker</a></li><li><a href="/website-audit">Website audit</a></li><li><a href="/backlink-checker">Backlink checker</a></li><li><a href="/seo-comparison">Competitor comparison</a></li><li><a href="/seo-monitoring">SEO monitoring</a></li></ul></div>
<div><strong>Free tools</strong><ul><li><a href="/title-tag-checker">Title tag checker</a></li><li><a href="/robots-txt-tester">robots.txt tester</a></li><li><a href="/llms-txt-generator">llms.txt generator</a></li><li><a href="/meta-tag-generator">Meta tag generator</a></li><li><a href="/xml-sitemap-generator">Sitemap generator</a></li><li><a href="/keyword-generator">Keyword generator</a></li><li><a href="/ai-meta-description-generator">AI description writer</a></li><li><a href="/keyword-difficulty-checker">Keyword difficulty</a></li><li><a href="/plagiarism-checker">Plagiarism checker</a></li><li><a href="/word-counter">Word counter</a></li><li><a href="/seo-tools">All 32 SEO tools</a></li></ul></div>
<div><strong>XKey</strong><ul><li><a href="/guides">SEO guides</a></li><li><a href="/learn-seo">Free SEO course</a></li><li><a href="/seo-glossary">SEO glossary</a></li><li><a href="/news">SEO news</a></li><li><a href="/google-algorithm-updates">Google updates</a></li><li><a href="/uk-business-directories">UK directories</a></li><li><a href="/uk-website-study">UK website study</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="mailto:${EMAIL_HTML}">${EMAIL_HTML}</a></li><li><a href="/privacy">Privacy</a></li></ul></div>
</div><p class="small">© ${UPDATED.slice(0, 4)} ${BRAND.name}. Scores are a guide, not a guarantee of rankings.</p></div></footer><script src="${SITE_JS_PATH}" async></script></body></html>`;
}

const SECURITY = { "strict-transport-security": "max-age=63072000; includeSubDomains; preload", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(), microphone=(), geolocation=()" };
export const send = (body, type, status = 200, cache = "public, max-age=300") => new Response(body, { status, headers: { "content-type": type, "cache-control": cache, ...SECURITY } });
