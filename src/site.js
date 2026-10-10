// XKey site shell: brand, styles, layout and helpers. Content lives in content.js.
import { CHECKER_CSS } from "../engine/checker-ui.js";
import { MONITOR_CSS } from "../engine/monitor.js";

export const BRAND = { name: "XKey", fullName: "XKey", domain: "xkey.co.uk", tagline: "Free SEO & AI search check", maker: "IceWork", makerUrl: "https://icework.co.uk", email: "iceworks@f1rst.co.uk", price: 350, town: "Blackpool" };
export const SITE = `https://${BRAND.domain}`;
export const UPDATED = "2026-10-10";

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const CSS = `:root{--bg:#f6f8fb;--fg:#0e1726;--mute:#526077;--line:#dde3ec;--card:#fff;--brand:#0a6f6a;--brand-ink:#fff;--soft:#dcf1ef;--hero:#0e1726;--hero-fg:#eef3fa}
@media (prefers-color-scheme:dark){:root{--bg:#0b111b;--fg:#e8eef7;--mute:#9aa8bd;--line:#223047;--card:#111a28;--brand:#3fd0c9;--brand-ink:#08121c;--soft:#10302f;--hero:#111a28;--hero-fg:#e8eef7}}
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
${CHECKER_CSS}
${MONITOR_CSS}
.cmp-l input{font-weight:400}
.free{display:flex;flex-wrap:wrap;gap:6px 18px;list-style:none;padding:0;margin:14px 0 0;font-size:15px;font-weight:600;color:var(--fg)}.free li::before{content:"✓ ";color:var(--brand)}
.ogc{border:1px solid var(--line);border-radius:12px;overflow:hidden;max-width:520px;background:var(--card)}.ogi{aspect-ratio:1.91/1;background:var(--line) center/cover no-repeat}.ogn{display:flex;align-items:center;justify-content:center;color:var(--mute);font-size:14px}.ogt{padding:10px 14px;display:flex;flex-direction:column;gap:2px;font-family:Arial,sans-serif}.ogt span{font-size:12px;color:var(--mute)}.ogt b{font-size:16px}.ogt small{font-size:14px;color:var(--mute)}
.tool .row>div{min-width:0}
.prose code{overflow-wrap:anywhere}pre{max-width:100%;overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.5}pre code{overflow-wrap:normal;white-space:pre}
@media (max-width:640px){.nav{gap:0;min-height:0}.nav ul{margin:0 -20px;padding:0 20px;width:calc(100% + 40px);flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:0 18px}.nav ul::-webkit-scrollbar{display:none}.nav ul a{white-space:nowrap;font-size:15px}.hero{padding-top:28px;padding-bottom:28px}.hero h1{font-size:34px}.lead{font-size:18px}.cta{padding:26px}}`;

export const NAV = [["/", "SEO check"], ["/website-crawler", "Site crawler"], ["/ai-seo-checker", "AI SEO checker"], ["/website-audit", "Site audit"], ["/seo-comparison", "Compare"], ["/seo-tools", "All tools"], ["/guides", "Guides"]];

export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0e1726"/><path d="M14 16l12 16-12 16h9l7.5-10L38 48h9L35 32l12-16h-9l-7.5 10L23 16z" fill="#3fd0c9"/></svg>`;

function jsonld(p) {
  const url = SITE + p.path;
  const g = [
    { "@type": "Organization", "@id": `${SITE}/#org`, name: BRAND.name, description: "Free SEO and AI search tools for UK businesses. Every tool is free, with no account, no email, no Google sign-in and no paid version.", url: `${SITE}/`, logo: `${SITE}/favicon.svg`, email: BRAND.email, parentOrganization: { "@type": "Organization", "@id": "https://icework.co.uk/#business", name: BRAND.maker, url: BRAND.makerUrl + "/" } },
    { "@type": "WebSite", "@id": `${SITE}/#site`, url: `${SITE}/`, name: BRAND.name, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" },
    p.app ? { "@type": "WebApplication", "@id": `${url}#app`, name: p.app, url, applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }, publisher: { "@id": `${SITE}/#org` } }
      : p.article ? { "@type": "Article", "@id": `${url}#page`, headline: p.h1, description: p.desc, url, dateModified: UPDATED, datePublished: UPDATED, author: { "@id": `${SITE}/#org` }, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" }
      : { "@type": "WebPage", "@id": `${url}#page`, url, name: p.title, description: p.desc, isPartOf: { "@id": `${SITE}/#site` }, dateModified: UPDATED },
  ];
  if (p.itemList) g.push({ "@type": "ItemList", name: "Free SEO tools", itemListElement: p.itemList.map(([path, name], i) => ({ "@type": "ListItem", position: i + 1, name, url: SITE + path })) });
  if (p.path !== "/") g.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, ...(p.parent ? [{ "@type": "ListItem", position: 2, name: p.parent[1], item: SITE + p.parent[0] }] : []), { "@type": "ListItem", position: p.parent ? 3 : 2, name: p.crumb, item: url }] });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c");
}

export function layout(p) {
  const url = SITE + p.path;
  const nav = NAV.map(([h, t]) => `<li><a href="${h}"${h === p.path ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const crumbs = p.path === "/" ? "" : `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a> / ${p.parent ? `<a href="${p.parent[0]}">${esc(p.parent[1])}</a> / ` : ""}${esc(p.crumb || "")}</nav>`;
  const maker = p.noindex ? `<div class="wrap"><div class="maker noprint"><p><strong>Want these fixed for you?</strong> XKey is made by <a href="${BRAND.makerUrl}/" rel="noopener">${BRAND.maker}</a>, a ${BRAND.town} web studio. IceWork builds fast websites that pass every check here – a 3-page site with domain and a year's hosting is £${BRAND.price} all in.</p></div></div>` : "";
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.desc)}"><link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${BRAND.name}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0e1726">
<style>${CSS}</style><script type="application/ld+json">${jsonld(p)}</script></head><body>
<header class="top"><div class="wrap nav"><a class="logo" href="/" aria-label="XKey home">X<b>Key</b></a><ul>${nav}</ul></div></header>
${crumbs}<main>${p.body}${maker}</main>
<aside class="promise noprint" aria-label="The XKey free promise"><div class="wrap"><p><strong>Every XKey tool is 100% free – for good.</strong> No catch, no paid version, nothing to unlock.</p><ul><li>No account</li><li>No email</li><li>No "Sign in with Google"</li><li>No card details</li><li>No trial</li><li>No subscription</li></ul></div></aside>
<footer><div class="wrap"><div class="cols">
<div><a class="logo" href="/">X<b>Key</b></a><p>${BRAND.tagline}. No cost, no sign-up, no email, no subscription. Built in the UK.</p><p class="small">Made by <a href="${BRAND.makerUrl}" rel="noopener">${BRAND.maker}</a>, ${BRAND.town}.</p></div>
<div><strong>SEO checks</strong><ul><li><a href="/">Free SEO check</a></li><li><a href="/website-crawler">Website crawler</a></li><li><a href="/ai-seo-checker">AI SEO checker</a></li><li><a href="/website-audit">Website audit</a></li><li><a href="/seo-comparison">Competitor comparison</a></li><li><a href="/seo-monitoring">SEO monitoring</a></li></ul></div>
<div><strong>Free tools</strong><ul><li><a href="/title-tag-checker">Title tag checker</a></li><li><a href="/robots-txt-tester">robots.txt tester</a></li><li><a href="/llms-txt-generator">llms.txt generator</a></li><li><a href="/meta-tag-generator">Meta tag generator</a></li><li><a href="/xml-sitemap-generator">Sitemap generator</a></li><li><a href="/keyword-generator">Keyword generator</a></li><li><a href="/ai-meta-description-generator">AI description writer</a></li><li><a href="/keyword-difficulty-checker">Keyword difficulty</a></li><li><a href="/plagiarism-checker">Plagiarism checker</a></li><li><a href="/word-counter">Word counter</a></li><li><a href="/seo-tools">All 31 SEO tools</a></li></ul></div>
<div><strong>XKey</strong><ul><li><a href="/guides">SEO guides</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li><li><a href="/privacy">Privacy</a></li></ul></div>
</div><p class="small">© ${UPDATED.slice(0, 4)} ${BRAND.name}. Scores are a guide, not a guarantee of rankings.</p></div></footer></body></html>`;
}

const SECURITY = { "strict-transport-security": "max-age=63072000; includeSubDomains; preload", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(), microphone=(), geolocation=()" };
export const send = (body, type, status = 200, cache = "public, max-age=300") => new Response(body, { status, headers: { "content-type": type, "cache-control": cache, ...SECURITY } });
