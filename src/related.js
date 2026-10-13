// "Related guides" on every tool and guide page, so each guide gets links from the pages closest to it.
// Tools list their guides by hand (TOOL_GUIDES); guides share topics (TOPICS). A page that isn't listed
// here (a new tool or guide) still gets related guides, picked from the guides that link to it and
// shared title words. Ties go to the guide with the fewest links so far, spreading links evenly.
const TOOL_GUIDES = {
  "/": ["what-is-an-seo-check", "how-to-check-website-seo", "on-page-seo-checklist", "how-to-rank-higher-on-google"],
  "/ai-seo-checker": ["ai-search-optimisation", "how-to-appear-in-chatgpt", "google-ai-overviews", "llms-txt"],
  "/website-audit": ["technical-seo-checklist", "broken-links-and-redirects", "duplicate-content", "internal-linking"],
  "/website-crawler": ["technical-seo-checklist", "website-redesign-seo", "ecommerce-seo", "duplicate-content"],
  "/backlink-checker": ["how-to-get-backlinks", "what-is-domain-authority", "competitor-seo-analysis", "business-directory-listings"],
  "/domain-authority-checker": ["what-is-domain-authority", "how-to-get-backlinks", "competitor-seo-analysis"],
  "/redirect-checker": ["broken-links-and-redirects", "website-redesign-seo", "duplicate-content", "technical-seo-checklist"],
  "/http-header-checker": ["technical-seo-checklist", "broken-links-and-redirects", "why-is-my-website-not-on-google"],
  "/website-down-checker": ["why-is-my-website-not-on-google", "technical-seo-checklist", "google-search-console"],
  "/open-graph-checker": ["title-tags", "meta-descriptions", "on-page-seo-checklist"],
  "/hreflang-checker": ["technical-seo-checklist", "duplicate-content", "seo-for-multiple-locations"],
  "/website-hosting-checker": ["core-web-vitals", "technical-seo-checklist", "choosing-a-domain-name"],
  "/ssl-checker": ["website-not-secure", "technical-seo-checklist", "why-is-my-website-not-on-google", "website-redesign-seo"],
  "/utm-builder": ["measuring-seo-results", "google-search-console", "seo-vs-google-ads"],
  "/url-slug-generator": ["on-page-seo-checklist", "website-redesign-seo", "product-page-seo"],
  "/case-converter": ["title-tags", "how-to-write-seo-content"],
  "/website-technology-checker": ["wordpress-seo", "shopify-seo", "wix-seo", "competitor-seo-analysis"],
  "/dns-lookup": ["choosing-a-domain-name", "technical-seo-checklist", "website-redesign-seo"],
  "/mx-lookup": ["why-are-my-emails-going-to-spam", "gmail-yahoo-microsoft-sender-rules", "spf-dkim-dmarc-setup"],
  "/spf-checker": ["spf-dkim-dmarc-setup", "why-are-my-emails-going-to-spam", "gmail-yahoo-microsoft-sender-rules"],
  "/dmarc-checker": ["how-to-set-up-dmarc", "spf-dkim-dmarc-setup", "gmail-yahoo-microsoft-sender-rules"],
  "/dkim-checker": ["spf-dkim-dmarc-setup", "why-are-my-emails-going-to-spam", "gmail-yahoo-microsoft-sender-rules"],
  "/domain-age-checker": ["what-is-domain-authority", "choosing-a-domain-name", "competitor-seo-analysis"],
  "/whois-lookup": ["choosing-a-domain-name", "what-is-domain-authority"],
  "/seo-comparison": ["competitor-seo-analysis", "how-to-rank-higher-on-google", "keyword-research-for-beginners"],
  "/seo-monitoring": ["measuring-seo-results", "how-long-does-seo-take", "google-search-console", "how-to-check-website-seo"],
  "/title-tag-checker": ["title-tags", "meta-descriptions", "on-page-seo-checklist"],
  "/robots-txt-tester": ["robots-txt", "block-ai-training-bots", "why-is-my-website-not-on-google", "technical-seo-checklist"],
  "/llms-txt-generator": ["llms-txt", "ai-search-optimisation", "block-ai-training-bots"],
  "/mobile-friendly-test": ["mobile-friendly-website", "core-web-vitals", "technical-seo-checklist", "why-is-my-website-not-on-google"],
  "/broken-link-checker": ["broken-links-and-redirects", "internal-linking", "website-redesign-seo"],
  "/schema-checker": ["schema-markup", "local-seo-checklist", "ai-search-optimisation"],
  "/page-speed-checker": ["core-web-vitals", "image-seo", "technical-seo-checklist"],
  "/sitemap-checker": ["xml-sitemaps", "google-search-console", "technical-seo-checklist", "why-is-my-website-not-on-google", "seo-for-new-websites"],
  "/security-headers-checker": ["technical-seo-checklist", "what-is-eeat"],
  "/local-seo-checker": ["local-seo-checklist", "google-business-profile", "how-to-get-google-reviews", "seo-for-multiple-locations"],
  "/meta-tag-generator": ["title-tags", "meta-descriptions", "on-page-seo-checklist"],
  "/open-graph-generator": ["title-tags", "meta-descriptions"],
  "/xml-sitemap-generator": ["xml-sitemaps", "google-search-console", "seo-for-new-websites", "technical-seo-checklist"],
  "/robots-txt-generator": ["robots-txt", "block-ai-training-bots", "llms-txt", "why-is-my-website-not-on-google"],
  "/schema-generator": ["schema-markup", "local-seo-checklist", "google-business-profile"],
  "/keyword-generator": ["keyword-research-for-beginners", "how-to-write-seo-content", "competitor-seo-analysis"],
  "/blog-title-generator": ["title-tags", "how-to-write-seo-content", "keyword-research-for-beginners"],
  "/word-counter": ["how-to-write-seo-content", "what-is-eeat", "keyword-research-for-beginners"],
  "/keyword-difficulty-checker": ["keyword-research-for-beginners", "competitor-seo-analysis", "how-to-rank-higher-on-google"],
  "/plagiarism-checker": ["duplicate-content", "how-to-write-seo-content", "what-is-eeat"],
  "/anchor-text-checker": ["internal-linking", "how-to-get-backlinks"],
  "/local-search-checker": ["local-seo-checklist", "google-business-profile", "seo-for-multiple-locations", "bing-places-and-bing-seo"],
  "/ai-meta-description-generator": ["meta-descriptions", "title-tags", "ai-search-optimisation"],
  "/bulk-seo-checker": ["how-to-check-website-seo", "competitor-seo-analysis", "what-is-an-seo-check"],
  "/seo-badge": ["what-is-an-seo-check", "measuring-seo-results"],
  "/rank-tracker": ["how-to-rank-higher-on-google", "measuring-seo-results", "keyword-research-for-beginners"],
  "/seo-content-editor": ["how-to-write-seo-content", "keyword-research-for-beginners", "what-is-eeat"],
  "/toxic-backlink-checker": ["how-to-get-backlinks", "domain-authority-vs-domain-rating", "what-is-domain-authority"],
  "/competitor-ads-checker": ["seo-vs-google-ads", "competitor-seo-analysis"],
  "/uptime-monitor": ["why-is-my-website-not-on-google", "technical-seo-checklist"],
  "/website-analytics": ["google-analytics-for-beginners", "measuring-seo-results", "google-search-console", "seo-vs-google-ads"],
  "/brand-monitoring": ["how-to-get-backlinks", "competitor-seo-analysis"],
  "/wordpress-seo-plugin": ["wordpress-seo", "best-website-builder-for-seo"],
  "/accessibility-checker": ["image-seo", "what-is-eeat", "technical-seo-checklist"],
  "/redirect-map-generator": ["website-redesign-seo", "broken-links-and-redirects", "duplicate-content"],
  "/seo-roi-calculator": ["how-much-does-seo-cost", "how-long-does-seo-take", "measuring-seo-results"],
  "/qr-code-generator": ["how-to-get-google-reviews", "local-seo-checklist"],
  "/google-review-link-generator": ["how-to-get-google-reviews", "how-to-respond-to-negative-reviews", "google-business-profile", "local-seo-checklist"],
  "/image-compressor": ["image-seo", "core-web-vitals"],
  "/privacy-policy-generator": ["what-is-eeat", "technical-seo-checklist"],
  "/website-report": ["how-to-check-website-seo", "what-is-domain-authority", "competitor-seo-analysis"],
  "/heading-checker": ["on-page-seo-checklist", "how-to-write-seo-content", "title-tags"],
  "/alt-text-checker": ["image-seo", "on-page-seo-checklist"],
  "/canonical-checker": ["duplicate-content", "technical-seo-checklist", "broken-links-and-redirects"],
};
const SECTOR = "hotels-and-bnbs hair-and-beauty-salons estate-agents dentists-and-clinics tradespeople restaurants professional-services gyms-and-personal-trainers car-garages cleaning-companies driving-instructors pet-businesses removal-companies tutors care-homes charities therapists-and-counsellors independent-shops tourist-attractions nurseries-and-childcare gardeners-and-landscapers b2b-companies photographers architects-and-interior-designers florists vets wedding-businesses".split(" ");
const TOPICS = {
  "what-is-an-seo-check": "basics", "how-to-check-website-seo": "basics onpage", "how-much-does-seo-cost": "basics", "seo-vs-google-ads": "basics analytics",
  "how-to-rank-higher-on-google": "basics keywords", "seo-for-small-businesses": "basics local", "seo-for-new-websites": "basics indexing",
  "why-is-my-website-not-on-google": "indexing", "google-search-console": "indexing analytics", "bing-places-and-bing-seo": "indexing local",
  "block-ai-training-bots": "ai indexing", "ai-search-optimisation": "ai", "llms-txt": "ai",
  "title-tags": "onpage titles", "meta-descriptions": "onpage titles", "on-page-seo-checklist": "onpage", "image-seo": "onpage speed",
  "internal-linking": "onpage links", "product-page-seo": "onpage shop",
  "technical-seo-checklist": "technical indexing", "core-web-vitals": "technical speed", "broken-links-and-redirects": "technical links redirects",
  "duplicate-content": "technical content redirects", "website-redesign-seo": "technical platforms redirects", "choosing-a-domain-name": "domains basics",
  "what-is-domain-authority": "links domains", "how-to-get-backlinks": "links", "business-directory-listings": "links local", "competitor-seo-analysis": "keywords links analytics",
  "keyword-research-for-beginners": "keywords content", "how-to-write-seo-content": "content keywords", "what-is-eeat": "content",
  "measuring-seo-results": "analytics basics", "how-long-does-seo-take": "basics analytics", "how-to-choose-an-seo-company": "basics",
  "xml-sitemaps": "indexing technical", "robots-txt": "indexing technical ai", "ecommerce-seo": "shop platforms",
  "local-seo-checklist": "local", "google-business-profile": "local", "how-to-get-google-reviews": "local", "seo-for-multiple-locations": "local", "schema-markup": "schema local ai",
  "wordpress-seo": "platforms", "webflow-seo": "platforms", "godaddy-website-builder-seo": "platforms", "best-website-builder-for-seo": "platforms basics",
  "gmail-yahoo-microsoft-sender-rules": "email", "why-has-my-website-traffic-dropped": "analytics indexing", "website-not-secure": "technical", "mobile-friendly-website": "technical speed",
  "google-analytics-for-beginners": "analytics", "google-business-profile-suspended": "local", "how-to-respond-to-negative-reviews": "local", "youtube-seo": "content", "does-social-media-help-seo": "content links", "why-are-my-emails-going-to-spam": "email", "spf-dkim-dmarc-setup": "email",
  "how-much-does-a-website-cost": "basics platforms", "web-designer-vs-website-builder": "platforms basics", "how-to-appear-in-chatgpt": "ai", "google-ai-overviews": "ai", "how-to-set-up-dmarc": "email", "free-ahrefs-alternatives": "seotools links", "free-semrush-alternatives": "seotools keywords",
  "domain-authority-vs-domain-rating": "links domains seotools", "wix-seo": "platforms", "squarespace-seo": "platforms", "shopify-seo": "platforms shop",
  ...Object.fromEntries(SECTOR.map((s) => [`seo-for-${s}`, "sectors"])),
};
const STOP = new Set("and are can does for free from get google guide how into its not the uk vs what when why with you your seo".split(" "));
const words = (p) => new Set(`${p.crumb} ${p.h1}`.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ies|es|s)$/, "")));
const linksOf = (p) => new Set([...String(p.sections || "").matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]).filter((l) => l !== p.path));
const count = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n; };
const slug = (path) => path.slice("/guides/".length);
const topics = (path) => new Set((TOPICS[slug(path)] || "").split(" ").filter(Boolean));

export function relatedGuides(pages, n = 4) {
  const guides = pages.filter((p) => p.path.startsWith("/guides/") && !p.noindex);
  const byPath = new Map(guides.map((g) => [g.path, g]));
  const info = new Map(pages.map((p) => [p.path, { words: words(p), links: linksOf(p) }]));
  const inbound = new Map(guides.map((g) => [g.path, 0]));
  const out = {};
  const pick = (p, score, fixed = []) => {
    const own = info.get(p.path).links, chosen = fixed.map((s) => byPath.get(`/guides/${s}`)).filter((g) => g && !own.has(g.path));
    const rest = guides.filter((g) => g.path !== p.path && !own.has(g.path) && !chosen.includes(g)).map((g) => [g, score(g)]).filter(([, s]) => s > 0)
      .sort((a, b) => b[1] - a[1] || inbound.get(a[0].path) - inbound.get(b[0].path) || a[0].path.localeCompare(b[0].path)).map(([g]) => g);
    out[p.path] = [...chosen, ...rest].slice(0, n);
    for (const g of out[p.path]) inbound.set(g.path, inbound.get(g.path) + 1);
  };
  // A page's own words and the guides that already link to it, for pages without a hand-picked list.
  const fallback = (p) => (g) => { const a = info.get(p.path), b = info.get(g.path); return 10 * (b.links.has(p.path) ? 1 : 0) + 3 * count(a.words, b.words); };
  for (const g of guides) {
    const t = topics(g.path);
    pick(g, t.size ? (h) => 10 * count(t, topics(h.path)) + fallback(g)(h) : fallback(g));
  }
  for (const p of pages) {
    if (p.noindex || p.article || p.tools || p.guides || ["/about", "/contact", "/privacy"].includes(p.path)) continue;
    const fixed = TOOL_GUIDES[p.path];
    pick(p, fixed ? () => 0 : fallback(p), fixed || []);
  }
  return out;
}
