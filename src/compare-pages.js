// Comparison and reference pages: honest free alternatives to the big paid SEO suites, how the authority
// scores differ, which website builder is best for SEO, Webflow and GoDaddy builder guides, and an A–Z glossary.
// Facts about other companies' products are kept to what they publish themselves; nothing here knocks them.

const G = ["/guides", "Guides"];

// [term, definition, optional [path, link text]]
const TERMS = [
  ["301 redirect", "A permanent redirect from one address to another. It passes almost all of the old page's ranking value to the new one, so use it whenever a page moves.", ["/redirect-checker", "Redirect checker"]],
  ["302 redirect", "A temporary redirect. Search engines keep the old address in their index, so don't use it for permanent moves."],
  ["404 error", "The 'page not found' response. A few are normal; links from your own pages to 404s waste visitors and crawling.", ["/broken-link-checker", "Broken link checker"]],
  ["Alt text", "A short description of an image in the page code. Screen readers read it aloud, and Google uses it to understand the picture.", ["/guides/image-seo", "Image SEO guide"]],
  ["Anchor text", "The clickable words of a link. Descriptive anchor text tells Google and visitors what the linked page is about.", ["/anchor-text-checker", "Anchor text checker"]],
  ["Algorithm update", "A change Google makes to how it ranks pages. Big 'core updates' happen a few times a year and can move rankings up or down."],
  ["AI Overviews", "AI-written summaries Google shows above some search results, with links to the pages they draw on."],
  ["AI search", "Answers from assistants such as ChatGPT, Perplexity, Copilot and Gemini, which read websites to answer questions.", ["/guides/ai-search-optimisation", "AI search optimisation"]],
  ["Authority", "An estimate of how strong a website is, based on the links pointing to it. Each SEO tool has its own score; Google doesn't publish one.", ["/domain-authority-checker", "Domain authority checker"]],
  ["Backlink", "A link to your site from another website. Links from relevant, trusted sites are one of Google's strongest ranking signals.", ["/backlink-checker", "Backlink checker"]],
  ["Black hat SEO", "Tactics that break search engines' rules – hidden text, bought links, fake reviews. They risk penalties and rarely last."],
  ["Bounce rate", "In older analytics, the share of visits that left after one page. Google Analytics 4 uses 'engagement rate' instead."],
  ["Breadcrumbs", "The 'Home / Guides / This page' trail near the top of a page. They help visitors and can appear in Google's results."],
  ["Broken link", "A link to a page that no longer exists or doesn't load.", ["/broken-link-checker", "Broken link checker"]],
  ["Canonical tag", "A line in the page code that names the main version of a page when the same content is reachable at several addresses.", ["/guides/duplicate-content", "Duplicate content guide"]],
  ["Citation", "A mention of your business name, address and phone number on another site, such as a directory. Important for local SEO.", ["/guides/business-directory-listings", "Directory listings guide"]],
  ["Click-through rate (CTR)", "The share of people who saw your result in Google and clicked it. Better titles and descriptions raise it."],
  ["CMS", "Content management system – the software you edit your website with, such as WordPress, Wix or Shopify.", ["/website-technology-checker", "Technology checker"]],
  ["Conversion rate", "The share of visitors who do what you want – call, book, buy or send an enquiry. More traffic only helps if pages convert."],
  ["Content gap", "Topics your competitors cover that you don't. Filling them can win searches you're missing.", ["/seo-comparison", "Competitor comparison"]],
  ["Core update", "A broad change to Google's ranking systems, announced a few times a year."],
  ["Core Web Vitals", "Google's three measures of real-world page experience: loading (LCP), responsiveness (INP) and visual stability (CLS).", ["/guides/core-web-vitals", "Core Web Vitals guide"]],
  ["Crawl budget", "Roughly how many pages Google is willing to crawl on your site in a given time. Only matters for very large sites."],
  ["Crawler", "A program that visits web pages to read them, such as Googlebot or Bingbot. Also called a spider or bot.", ["/website-crawler", "Website crawler"]],
  ["CLS (Cumulative Layout Shift)", "How much a page jumps around while it loads. Under 0.1 is good."],
  ["Deindexed", "Removed from Google's index, so the page can't appear in results."],
  ["DKIM", "A digital signature on your emails that proves they came from your domain. Not an SEO factor, but vital for email delivery.", ["/dkim-checker", "DKIM checker"]],
  ["DMARC", "An email DNS record that says what to do with mail that fails SPF and DKIM checks.", ["/dmarc-checker", "DMARC checker"]],
  ["DNS", "The internet's address book: it turns your domain name into the server address your site lives on.", ["/dns-lookup", "DNS lookup"]],
  ["Do-follow link", "An ordinary link that passes ranking value. The opposite of a nofollow link."],
  ["Domain age", "How long ago a domain was first registered. Age alone isn't a ranking factor, but older sites have had longer to earn links.", ["/domain-age-checker", "Domain age checker"]],
  ["Domain authority", "Moz's name for its 0–100 link strength score, now used loosely for any tool's authority score.", ["/guides/what-is-domain-authority", "What is domain authority?"]],
  ["Duplicate content", "The same or very similar text on several pages or sites. Google usually shows only one version.", ["/guides/duplicate-content", "Duplicate content guide"]],
  ["E-E-A-T", "Experience, Expertise, Authoritativeness and Trustworthiness – the qualities Google's quality raters look for in content.", ["/guides/what-is-eeat", "What is E-E-A-T?"]],
  ["Featured snippet", "A box at the top of some Google results quoting a short answer from one page."],
  ["Favicon", "The small icon shown in browser tabs and next to your site in Google's mobile results."],
  ["Google Business Profile", "Your free business listing on Google Search and Maps – the most important thing for local SEO.", ["/guides/google-business-profile", "Google Business Profile guide"]],
  ["Google Search Console", "Google's free tool showing which searches you appear for, clicks, indexing problems and more.", ["/guides/google-search-console", "Search Console guide"]],
  ["Googlebot", "Google's crawler. It reads pages much like a modern Chrome browser."],
  ["H1 heading", "The main heading of a page. Each page should have one that says what the page is about."],
  ["Headings (H2–H6)", "Subheadings that break a page into sections and help readers and search engines scan it."],
  ["Hreflang", "Tags that tell Google which language or country each version of a page is for.", ["/hreflang-checker", "Hreflang checker"]],
  ["HTTPS", "The secure version of a web address, shown with a padlock. A light ranking signal and essential for trust.", ["/ssl-checker", "SSL checker"]],
  ["Impressions", "How many times your pages appeared in search results, whether or not anyone clicked."],
  ["Index", "Google's database of pages it can show in results. A page must be indexed to rank."],
  ["Indexing", "Google adding a page to its index after crawling it.", ["/guides/why-is-my-website-not-on-google", "Not on Google? Causes and fixes"]],
  ["IndexNow", "A way to tell Bing and some other search engines instantly when pages change. Google doesn't use it."],
  ["INP (Interaction to Next Paint)", "How quickly a page responds when someone taps or clicks. Under 200 milliseconds is good."],
  ["Internal link", "A link from one page on your site to another. Internal links spread ranking value and help Google find pages.", ["/guides/internal-linking", "Internal linking guide"]],
  ["JSON-LD", "The format Google recommends for structured data: a block of code describing the page's content.", ["/schema-generator", "Schema generator"]],
  ["Keyword", "A word or phrase people type into a search engine.", ["/guides/keyword-research-for-beginners", "Keyword research guide"]],
  ["Keyword cannibalisation", "Several of your own pages competing for the same search, so none ranks as well as one strong page would."],
  ["Keyword difficulty", "An estimate of how hard it would be to reach page one for a search.", ["/keyword-difficulty-checker", "Keyword difficulty checker"]],
  ["Keyword stuffing", "Repeating a phrase unnaturally often. Against Google's spam policies and off-putting for readers."],
  ["Knowledge panel", "The information box Google shows about well-known people, organisations and places."],
  ["LCP (Largest Contentful Paint)", "How long the biggest thing on the screen takes to appear. Under 2.5 seconds is good."],
  ["Link building", "Earning links from other websites to yours.", ["/guides/how-to-get-backlinks", "How to get backlinks"]],
  ["llms.txt", "A proposed text file that gives AI tools a summary of your site and its key pages.", ["/llms-txt-generator", "llms.txt generator"]],
  ["Local pack", "The map and three businesses Google shows for local searches such as 'plumber near me'.", ["/local-search-checker", "Local search checker"]],
  ["Local SEO", "Getting found by customers searching in your area.", ["/guides/local-seo-checklist", "Local SEO checklist"]],
  ["Long-tail keyword", "A longer, more specific search, such as 'emergency boiler repair Preston'. Easier to rank for and often ready to buy.", ["/keyword-generator", "Keyword generator"]],
  ["Manual action", "A penalty applied by a person at Google for breaking its spam policies. Shown in Search Console."],
  ["Meta description", "The page summary in the code that Google often shows under your title in results.", ["/guides/meta-descriptions", "Meta descriptions guide"]],
  ["Meta robots tag", "A line in the page code that tells search engines whether to index the page and follow its links."],
  ["Mobile-first indexing", "Google ranks pages using the mobile version of your site, so it must work well on phones."],
  ["MX record", "The DNS record that says where your domain's email is delivered.", ["/mx-lookup", "MX lookup"]],
  ["NAP", "Name, address and phone number – they should be identical everywhere your business is listed."],
  ["Nofollow", "A link attribute (rel=\"nofollow\") asking search engines not to pass ranking value. Also 'sponsored' and 'ugc'."],
  ["Noindex", "An instruction that keeps a page out of search results."],
  ["Off-page SEO", "Everything outside your site that affects rankings – mainly links, reviews and mentions."],
  ["On-page SEO", "Optimising the page itself: content, titles, headings, images and links.", ["/guides/on-page-seo-checklist", "On-page SEO checklist"]],
  ["Open Graph", "Tags that control how your page looks when shared on Facebook, LinkedIn, WhatsApp and others.", ["/open-graph-checker", "Open Graph checker"]],
  ["Organic traffic", "Visitors who arrive from unpaid search results."],
  ["Orphan page", "A page that no other page on your site links to, so visitors and search engines struggle to find it."],
  ["PageRank", "Google's original method of scoring pages by the links pointing to them. Still part of how Google works, though no longer public."],
  ["Page speed", "How fast a page loads and becomes usable.", ["/page-speed-checker", "Page speed checker"]],
  ["Penalty", "A drop in rankings caused by breaking Google's rules, either automatically or through a manual action."],
  ["People Also Ask", "The expandable list of related questions Google shows in many results."],
  ["Position", "Where your page appears in the results – position 1 is the top organic result."],
  ["Ranking factor", "Anything Google uses to decide the order of results, such as relevance, links and page experience."],
  ["Redirect chain", "Several redirects in a row (A → B → C). Each hop slows things down; link straight to the final page.", ["/redirect-checker", "Redirect checker"]],
  ["Referring domain", "A different website that links to yours. Ten links from ten sites usually count for more than ten from one site."],
  ["Rich results", "Search results with extras such as star ratings, prices or FAQs, made possible by structured data.", ["/schema-checker", "Schema checker"]],
  ["robots.txt", "A file at the root of your site telling crawlers which areas they may visit.", ["/robots-txt-tester", "robots.txt tester"]],
  ["Schema markup", "Structured data using the schema.org vocabulary to describe your business, products, events and more.", ["/guides/schema-markup", "Schema markup guide"]],
  ["Search intent", "What the searcher actually wants – to learn, to compare, to buy or to find a place. Pages that match intent rank better."],
  ["Search volume", "Roughly how many times a month a phrase is searched."],
  ["SERP", "Search engine results page – the page of results you see after searching."],
  ["Sitemap (XML)", "A file listing the pages you want search engines to find.", ["/xml-sitemap-generator", "XML sitemap generator"]],
  ["Site migration", "Moving a site to a new domain, platform or structure. Needs redirects for every old address.", ["/guides/website-redesign-seo", "Redesign without losing rankings"]],
  ["Slug", "The part of a web address after the domain, such as /emergency-plumber.", ["/url-slug-generator", "URL slug generator"]],
  ["Soft 404", "A page that says 'not found' (or has almost no content) but returns a normal 200 status, confusing search engines."],
  ["Spam score", "A tool's estimate of how likely a site is to be penalised, based on spammy patterns. Not a Google measure."],
  ["SPF", "An email DNS record listing the services allowed to send email as your domain.", ["/spf-checker", "SPF checker"]],
  ["SSL certificate", "The file that lets a site use HTTPS. Free certificates from Let's Encrypt are just as secure as paid ones.", ["/ssl-checker", "SSL checker"]],
  ["Status code", "The three-digit answer a server gives for each request: 200 OK, 301 moved, 404 not found, 500 error.", ["/http-header-checker", "HTTP header checker"]],
  ["Structured data", "Code that labels the information on a page in a way machines understand. See schema markup."],
  ["Technical SEO", "Making sure search engines can crawl, render and index your site: speed, HTTPS, sitemaps, redirects and so on.", ["/guides/technical-seo-checklist", "Technical SEO checklist"]],
  ["Thin content", "Pages with little useful content of their own. Google may ignore them or rank the whole site lower."],
  ["Title tag", "The page title in the code, shown as the blue link in Google's results.", ["/title-tag-checker", "Title tag checker"]],
  ["Top-level domain (TLD)", "The ending of a domain, such as .co.uk, .uk or .com. A .co.uk ending helps signal that you serve UK customers.", ["/guides/choosing-a-domain-name", "Choosing a domain name"]],
  ["Traffic", "The number of visitors to a website."],
  ["UTM tags", "Labels added to a link so analytics can show where visits came from – a newsletter, a flyer QR code or an advert.", ["/utm-builder", "UTM builder"]],
  ["URL", "A web address, such as https://xkey.co.uk/seo-tools."],
  ["User experience (UX)", "How easy and pleasant a site is to use. Good UX keeps visitors and supports rankings."],
  ["Webmaster guidelines", "Now called Google Search Essentials: Google's rules for sites that want to appear in its results."],
  ["White hat SEO", "SEO that follows search engines' rules: useful content, a sound site and earned links."],
  ["WHOIS", "The public record of who a domain is registered with, and when it was registered and expires.", ["/whois-lookup", "WHOIS lookup"]],
  ["Word count", "How many words a page has. There's no ideal number – cover the topic fully and stop.", ["/word-counter", "Word counter"]],
  ["XML sitemap", "See sitemap."],
  ["Zero-click search", "A search answered on the results page itself – by a snippet, map or AI Overview – so nobody clicks through."],
];

const slug = (t) => t.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const letters = [...new Set(TERMS.map(([t]) => (/^[a-z]/i.test(t) ? t[0].toUpperCase() : "#")))];
const glossary = () => {
  const by = (l) => TERMS.filter(([t]) => (/^[a-z]/i.test(t) ? t[0].toUpperCase() : "#") === l).sort((a, b) => a[0].localeCompare(b[0], "en"));
  return `<p class="small">Jump to: ${letters.map((l) => `<a href="#letter-${l === "#" ? "0" : l.toLowerCase()}">${l}</a>`).join(" · ")}</p>
${letters.map((l) => `<h2 id="letter-${l === "#" ? "0" : l.toLowerCase()}">${l === "#" ? "0–9" : l}</h2>${by(l).map(([t, d, link]) => `<p id="${slug(t)}"><strong>${esc(t)}</strong> – ${esc(d)}${link ? ` <a href="${link[0]}">${esc(link[1])}</a>` : ""}</p>`).join("")}`).join("\n")}`;
};

export const COMPARE_PAGES = [
  {
    path: "/seo-glossary", crumb: "SEO glossary", parent: G, article: true,
    title: "SEO Glossary: 110+ Terms Explained in Plain English",
    desc: `SEO glossary for business owners: ${TERMS.length} SEO terms from 301 redirect to zero-click search, each explained in plain English with a free tool or guide.`,
    h1: "SEO glossary: every term explained in plain English",
    lead: "SEO is full of jargon. Here's what each term means in a sentence or two, with a link to a free tool or guide where you can see it in action on your own site.",
    sections: glossary() + `<h2>Still stuck?</h2><p>Run the <a href="/">free SEO check</a> on your website – every result in the report explains what it means and how to fix it, in the same plain English. New to SEO? Start with <a href="/guides/seo-for-small-businesses">SEO for small businesses</a>.</p>`,
    faqs: [["What does SEO stand for?", "Search engine optimisation: making your website easier for search engines like Google to find, understand and recommend."], ["What's the difference between SEO and SEM?", "SEO is about unpaid results. SEM (search engine marketing) usually means paid search adverts such as Google Ads, and sometimes covers both."], ["Which SEO terms matter most for a small business?", "Title tags, Google Business Profile, backlinks, page speed and indexing. Get those right and you're ahead of most competitors."]],
  },
  {
    path: "/guides/free-ahrefs-alternatives", crumb: "Free Ahrefs alternatives", parent: G, article: true,
    title: "Free Ahrefs Alternatives: Backlinks & SEO Without Paying",
    desc: "Honest free Ahrefs alternatives for small businesses: free backlink checkers, authority scores, site audits and keyword tools, and what you give up.",
    h1: "Free Ahrefs alternatives for small businesses",
    lead: "Ahrefs is one of the best SEO tools there is, and priced for agencies and big marketing teams. If you run a small business, you can cover most of what you'd use it for with free tools – here's how, and where the free options fall short.",
    sections: `<h2>What do people use Ahrefs for?</h2>
<p>Mostly four things: seeing who links to a website (backlinks), comparing site strength (Ahrefs calls its score Domain Rating), checking a site for technical problems (Site Audit) and researching keywords and competitors' rankings. Here are free ways to do each.</p>
<h2>Free backlink checkers</h2>
<ul><li><strong><a href="/backlink-checker">XKey backlink checker</a></strong> – any website, the 50 strongest linking sites, and a link gap against a competitor. No sign-up. Built on Common Crawl's public web graph, which is refreshed quarterly and smaller than Ahrefs' own index, so expect fewer links listed.</li><li><strong>Google Search Console</strong> – the "Links" report shows sites linking to <em>your own</em> site, straight from Google. You can't look at competitors.</li><li><strong>Ahrefs Webmaster Tools</strong> – Ahrefs' own free plan: backlinks and a site audit for sites you can prove you own. A good option if you only need your own site.</li><li><strong>Bing Webmaster Tools</strong> – backlinks to your site from Bing's index, free.</li></ul>
<h2>Free authority score</h2>
<p>The <a href="/domain-authority-checker">XKey domain authority checker</a> scores up to 100 sites at once from 0 to 100 and gives each a global rank. The numbers won't match Ahrefs' DR exactly because every tool measures differently – see <a href="/guides/domain-authority-vs-domain-rating">DA vs DR vs other scores</a>.</p>
<h2>Free site audit</h2>
<p>The <a href="/website-audit">XKey website audit</a> crawls up to 250 pages for broken links, missing titles, duplicate content and more; the <a href="/website-crawler">website crawler</a> goes up to 10,000 pages and exports to Excel. Screaming Frog's free version crawls up to 500 addresses if you're happy installing software.</p>
<h2>Free keyword research</h2>
<ul><li><strong>Google Search Console</strong> – the searches you already appear for, with clicks and positions. The single most useful keyword source for an existing site.</li><li><strong>Google Keyword Planner</strong> – search volume ranges, free with a Google Ads account (you don't have to run adverts).</li><li><strong><a href="/keyword-generator">XKey keyword generator</a></strong> and <strong><a href="/keyword-difficulty-checker">keyword difficulty checker</a></strong> – long-tail ideas and how hard page one looks.</li><li>Google's own autocomplete and "People also ask" boxes.</li></ul>
<h2>What you give up without a paid tool</h2>
<ul><li><strong>Competitors' rankings and traffic estimates.</strong> Free tools can't show every keyword a competitor ranks for.</li><li><strong>Fresh, very large link data.</strong> Ahrefs crawls the web constantly; free link data is smaller and less up to date.</li><li><strong>Historical charts and alerts</strong> for lost links and ranking changes.</li></ul>
<p>For a local business, those gaps rarely matter. Your Search Console data, a regular <a href="/">SEO check</a>, <a href="/seo-monitoring">weekly monitoring</a> and a quarterly look at backlinks cover what moves the needle.</p>`,
    faqs: [["Is there a completely free version of Ahrefs?", "Ahrefs Webmaster Tools is free for websites you own and verify. Looking at other people's sites needs a paid plan."], ["What's the best free backlink checker?", "For your own site, Google Search Console. For checking any site, including competitors, the XKey backlink checker is free with no sign-up, though its link data is smaller than the paid tools'."], ["Is paying for an SEO tool worth it for a small business?", "Usually not at the start. Spend the time on your Google Business Profile, content and earning a few good links first; consider a paid tool if you're doing SEO for many sites or in a very competitive market."]],
  },
  {
    path: "/guides/free-semrush-alternatives", crumb: "Free Semrush alternatives", parent: G, article: true,
    title: "Free Semrush Alternatives: Keyword, Audit & Local Tools",
    desc: "Free Semrush alternatives for small businesses: keyword research, site audits, rank checks, local SEO and competitor tools that cost nothing.",
    h1: "Free Semrush alternatives",
    lead: "Semrush does a huge amount – keywords, audits, rank tracking, local listings, competitor research and more – with monthly prices to match. For a small business, free tools cover the parts you'll actually use.",
    sections: `<h2>Keyword research</h2>
<p>Start with <strong>Google Search Console</strong>: the Performance report lists every search your site already appears for, with impressions, clicks and position. Look for searches where you're in positions 8–20 – they're the quickest wins. Add <strong>Google Keyword Planner</strong> for volume ranges, and the <a href="/keyword-generator">keyword generator</a> to turn one service into dozens of local long-tail phrases. Check how hard page one looks with the <a href="/keyword-difficulty-checker">keyword difficulty checker</a>.</p>
<h2>Site audit</h2>
<p>The <a href="/">free SEO check</a> runs about 50 checks on any page, including AI search readiness, and the <a href="/website-audit">website audit</a> crawls up to 250 pages. For bigger sites, the <a href="/website-crawler">website crawler</a> handles up to 10,000 pages with a spreadsheet export.</p>
<h2>Position tracking</h2>
<p>Search Console shows your average position for every search, free, from Google's own data. To see the live results as a customer in a particular town would, use the <a href="/local-search-checker">local search checker</a>. Paid trackers automate checking hundreds of phrases daily – for a handful of important searches, a weekly look at Search Console is enough.</p>
<h2>Local SEO</h2>
<p>Semrush's Listing Management pushes your details to directories. Doing it yourself is free: claim your <a href="/guides/google-business-profile">Google Business Profile</a>, <a href="/guides/bing-places-and-bing-seo">Bing Places</a> and Apple Business Connect, then work through the main <a href="/guides/business-directory-listings">UK directories</a>. Make it easy for customers to review you by sending them a direct link to your review form.</p>
<h2>Competitor research</h2>
<p>Compare your page with up to two competitors' side by side in the <a href="/seo-comparison">competitor comparison</a>, check their link strength with the <a href="/domain-authority-checker">domain authority checker</a>, see what they're built with in the <a href="/website-technology-checker">technology checker</a>.</p>
<h2>What the free route can't do</h2>
<ul><li>Estimate a competitor's traffic or list every keyword they rank for.</li><li>Track hundreds of keywords automatically every day.</li><li>Pull it all into one dashboard with client reporting.</li></ul>
<p>If you manage SEO for lots of clients, a paid suite saves time. If you're improving one business website, the free tools here and an hour a week will take you a long way.</p>`,
    faqs: [["Does Semrush have a free plan?", "Semrush offers a limited free account with a small number of searches a day. It's enough to try it, not to work with every day."], ["What's the best free alternative to Semrush for keywords?", "Google Search Console for keywords you already rank for, and Google Keyword Planner for new ideas and volumes. Both are free from Google."], ["Can I track my Google rankings for free?", "Yes – Search Console shows your average position for every search. For a live look at the results in a specific town, use a local search checker."]],
  },
  {
    path: "/guides/domain-authority-vs-domain-rating", crumb: "DA vs DR vs other scores", parent: G, article: true,
    title: "Domain Authority vs Domain Rating: Moz, Ahrefs & More",
    desc: "Moz Domain Authority vs Ahrefs Domain Rating vs Semrush Authority Score vs XKey authority: how each is calculated, why they differ and which to trust.",
    h1: "Domain Authority vs Domain Rating (and the other scores)",
    lead: "Put the same website into four SEO tools and you'll get four different authority numbers. They're all estimates of link strength, made in different ways. Here's how they compare.",
    sections: `<h2>The main scores at a glance</h2>
<div class="tablewrap"><table><thead><tr><th>Score</th><th>Made by</th><th>Based on</th><th>Scale</th></tr></thead><tbody>
<tr><td>Domain Authority (DA)</td><td>Moz</td><td>Moz's link index, using a model trained to predict which sites rank in Google</td><td>1–100</td></tr>
<tr><td>Domain Rating (DR)</td><td>Ahrefs</td><td>How many unique sites link to a site, and how strong those sites are, from Ahrefs' own crawler</td><td>0–100</td></tr>
<tr><td>Authority Score (AS)</td><td>Semrush</td><td>Links plus estimated organic traffic and spam signals</td><td>0–100</td></tr>
<tr><td>XKey authority</td><td>XKey</td><td>Where the site ranks among 133 million websites in Common Crawl's public web graph (harmonic centrality)</td><td>0–100</td></tr>
</tbody></table></div>
<h2>Why don't the numbers match?</h2>
<ul><li><strong>Different link data.</strong> Each company crawls the web separately and finds a different set of links. XKey uses the free Common Crawl web graph, refreshed quarterly.</li><li><strong>Different maths.</strong> Some count linking sites, some weight them by strength, some add traffic or spam signals.</li><li><strong>Different scaling.</strong> All are logarithmic – going from 20 to 30 is far easier than from 70 to 80 – but each stretches the scale differently.</li></ul>
<p>So a site might be DA 35, DR 42 and XKey 38 at the same time. None is "right"; compare like with like, using one tool for you and your competitors.</p>
<h2>Does Google use any of them?</h2>
<p>No. Google doesn't use third-party authority scores. It does use links heavily, which is why these scores often line up with which sites rank well – but a page with great content and local relevance regularly beats higher-scoring sites. More in <a href="/guides/what-is-domain-authority">what is domain authority?</a></p>
<h2>Which score should I use?</h2>
<p>Whichever you can check consistently. If you pay for Moz, Ahrefs or Semrush, use its score. If you don't, the <a href="/domain-authority-checker">XKey domain authority checker</a> scores up to 100 sites at once for free.</p>
<h2>How do I raise my score?</h2>
<p>The same way for every tool: earn links from more, and stronger, relevant websites. Local newspapers, suppliers, trade bodies, partners and genuinely useful content all help. See <a href="/guides/how-to-get-backlinks">how to get backlinks</a>, and never buy links – Google's spam policies forbid it and the scores themselves try to filter them out.</p>`,
    faqs: [["Is DR better than DA?", "Neither is better; they measure link strength in different ways from different link data. Pick one and use it consistently to compare sites."], ["Why did my score drop when I didn't change anything?", "Scores are relative. When very strong sites gain links, everyone else can slip a little, and tools also lose track of links that have been removed."], ["What's a good authority score for a local business?", "Anything comparable to the competitors who rank for your searches. Many successful local businesses score between 10 and 30."]],
  },
  {
    path: "/guides/best-website-builder-for-seo", crumb: "Best website builder for SEO", parent: G, article: true,
    title: "Best Website Builder for SEO in 2026: Honest UK Comparison",
    desc: "Which website builder is best for SEO? WordPress, Wix, Squarespace, Shopify, Webflow and GoDaddy compared on control, speed, redirects and schema.",
    h1: "Which website builder is best for SEO?",
    lead: "Every popular website builder can rank on Google – the platform matters far less than what you put on it. But they differ in how much control you get, and those differences decide how far you can take your SEO.",
    sections: `<h2>The short answer</h2>
<ul><li><strong>Most control:</strong> WordPress (self-hosted) and Webflow.</li><li><strong>Easiest with solid SEO basics:</strong> Squarespace and Wix.</li><li><strong>Best for online shops:</strong> Shopify, or WordPress with WooCommerce.</li><li><strong>Most limited:</strong> GoDaddy's website builder – fine for a simple brochure site, restrictive as you grow.</li></ul>
<h2>Side-by-side comparison</h2>
<div class="tablewrap"><table><thead><tr><th>Feature</th><th>WordPress</th><th>Wix</th><th>Squarespace</th><th>Shopify</th><th>Webflow</th><th>GoDaddy</th></tr></thead><tbody>
<tr><td>Edit title and description per page</td><td>Yes (with an SEO plugin)</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Choose page addresses</td><td>Fully</td><td>Mostly</td><td>Mostly</td><td>Fixed prefixes (/products/, /pages/)</td><td>Fully</td><td>Mostly</td></tr>
<tr><td>Automatic XML sitemap</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Edit robots.txt</td><td>Yes</td><td>Yes</td><td>No</td><td>Yes (theme file)</td><td>Yes</td><td>No</td></tr>
<tr><td>301 redirects</td><td>Yes (plugin)</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Limited</td></tr>
<tr><td>Custom schema markup</td><td>Yes</td><td>Yes</td><td>Code injection (paid plans)</td><td>Theme code or apps</td><td>Yes</td><td>Limited</td></tr>
<tr><td>Speed out of the box</td><td>Depends on host and theme</td><td>Fair</td><td>Good</td><td>Good</td><td>Very good</td><td>Fair</td></tr>
</tbody></table></div>
<p class="small">Platforms change their features often; check the current position before you commit, especially for robots.txt and code access.</p>
<h2>WordPress</h2>
<p>Runs a large share of the web, and you can change anything – but you're responsible for hosting, updates, security and speed. With a good host, a light theme and an SEO plugin such as Yoast, Rank Math or SEOPress, it's the most capable option. <a href="/guides/wordpress-seo">WordPress SEO guide</a>.</p>
<h2>Wix</h2>
<p>Wix has improved enormously for SEO and now lets you edit almost everything a small business needs, including robots.txt, redirects and structured data. Pages can be heavier than hand-built sites, so keep images small. <a href="/guides/wix-seo">Wix SEO guide</a>.</p>
<h2>Squarespace</h2>
<p>Clean, fast templates and sensible defaults; less control over the technical details. Great if you want a beautiful site and good basics without fuss. <a href="/guides/squarespace-seo">Squarespace SEO guide</a>.</p>
<h2>Shopify</h2>
<p>Excellent for selling, quick and secure. The fixed address structure and some duplicate collection URLs are known quirks, handled by Shopify's built-in canonical tags. <a href="/guides/shopify-seo">Shopify SEO guide</a>.</p>
<h2>Webflow</h2>
<p>Designer-friendly with clean code and fast hosting, plus full control of meta tags, schema, redirects and robots.txt. Steeper learning curve. <a href="/guides/webflow-seo">Webflow SEO guide</a>.</p>
<h2>GoDaddy Website Builder</h2>
<p>Quick to set up and cheap, with basic SEO settings and an automatic sitemap. Code access and technical control are limited, which can hold back ambitious sites. <a href="/guides/godaddy-website-builder-seo">GoDaddy website builder SEO guide</a>.</p>
<h2>Which builder does a site use?</h2>
<p>Curious what your competitors use? The <a href="/website-technology-checker">website technology checker</a> shows the builder, theme and plugins behind any site. And whichever you choose, the <a href="/">free SEO check</a> spots your builder and shows fixes with the exact menus for it.</p>`,
    faqs: [["Is Wix bad for SEO?", "Not any more. Modern Wix sites can rank well; it gives you control over titles, descriptions, addresses, redirects and structured data. Speed takes a little care."], ["Should I move my site to WordPress for better SEO?", "Only if your current builder stops you doing something important. A move risks rankings unless every old address is redirected, and content and links matter far more than the platform."], ["Which website builder is fastest?", "Webflow, Squarespace and Shopify are fast out of the box because they host on big content delivery networks. WordPress can be fastest of all with good hosting, or slowest with a heavy theme."]],
  },
  {
    path: "/guides/webflow-seo", crumb: "Webflow SEO", parent: G, article: true,
    title: "Webflow SEO Guide: Settings, CMS Fields & Redirects",
    desc: "Webflow SEO guide: titles and descriptions, CMS template SEO fields, sitemap, robots.txt, 301 redirects, schema and speed – where each setting is.",
    h1: "Webflow SEO: a step-by-step guide",
    lead: "Webflow gives you clean code, fast hosting and control over almost every SEO setting. The catch is knowing where each one lives – especially for CMS pages, where one template controls hundreds of pages.",
    sections: `<h2>1. Titles and meta descriptions</h2>
<p>Open the <strong>Pages</strong> panel, hover over a page and select its <strong>settings</strong> (the cog). Under <strong>SEO settings</strong>, fill in the <strong>Title tag</strong> and <strong>Meta description</strong>. Webflow shows a preview of the search result. Write a unique title for every page with your main phrase first – check its width in the <a href="/title-tag-checker">title tag checker</a>.</p>
<h2>2. CMS template pages</h2>
<p>For blog posts, services or products stored in the CMS, open the <strong>Collection template</strong> page's settings. Instead of typing text, insert fields: for example a title of "<em>Name</em> | Smith Plumbing" and a description from a "Summary" field. Add a dedicated SEO title and description field to the collection if you want to write them by hand for important items.</p>
<h2>3. Open Graph images</h2>
<p>Lower down the same page settings, set the <strong>Open Graph</strong> title, description and image – for CMS templates, bind the image to the item's main image field. Test how links look with the <a href="/open-graph-checker">Open Graph checker</a>.</p>
<h2>4. Sitemap and robots.txt</h2>
<p>In <strong>Site settings → SEO</strong>, switch on <strong>auto-generate sitemap</strong> and add the address (yourdomain.co.uk/sitemap.xml) to <a href="/guides/google-search-console">Google Search Console</a>. The same tab has a robots.txt box – leave it empty or minimal unless you need to block something. Make sure <strong>indexing of the webflow.io staging subdomain is disabled</strong>, so Google doesn't find a duplicate copy of your site.</p>
<h2>5. Redirects</h2>
<p>Changed a page's slug or moved from another platform? In <strong>Site settings → Publishing</strong> (older accounts: Hosting), add <strong>301 redirects</strong> from each old path to its new one. Wildcards help when a whole folder moves. Check them afterwards with the <a href="/redirect-checker">redirect checker</a>.</p>
<h2>6. Headings and alt text</h2>
<p>Each page needs one H1 – Webflow's heading element lets you choose the level in its settings, so check designers haven't used H1 for styling elsewhere. Add alt text to images in the <strong>Assets</strong> panel (it then applies everywhere the image is used) or per image in its settings; for CMS images, bind alt text to a field. The <a href="/">free SEO check</a> lists any you've missed.</p>
<h2>7. Schema markup</h2>
<p>Paste JSON-LD into <strong>Page settings → Custom code → Inside &lt;head&gt; tag</strong>. For a local business, generate it with the <a href="/schema-generator">schema generator</a>. On CMS templates you can insert fields inside the code to build Article or Product markup for every item.</p>
<h2>8. Speed</h2>
<p>Webflow's hosting is fast, but heavy interactions, big videos and uncompressed images slow pages down. Compress images to WebP before uploading, keep Lottie and scroll animations to a minimum on key pages, and check the <a href="/page-speed-checker">page speed checker</a>.</p>
<p>When you're done, publish and run the <a href="/">free SEO check</a> on your home page and a CMS page to confirm everything's in place.</p>`,
    faqs: [["Is Webflow good for SEO?", "Yes. It produces clean code, hosts on a fast global network and gives you control over titles, descriptions, schema, redirects, robots.txt and the sitemap."], ["How do I stop Google indexing my webflow.io site?", "In Site settings → SEO, disable indexing for the Webflow subdomain. Your custom domain stays indexable."], ["Why aren't my Webflow changes showing in Google?", "Make sure you've published to your custom domain, then ask Google to recrawl the page using URL Inspection in Search Console. Updates can take a few days to appear."]],
  },
  {
    path: "/guides/godaddy-website-builder-seo", crumb: "GoDaddy website builder SEO", parent: G, article: true,
    title: "GoDaddy Website Builder SEO: Settings That Matter",
    desc: "SEO for GoDaddy Website Builder: page titles, descriptions, the SEO wizard, sitemap, images, Google Business Profile and what the builder can't do.",
    h1: "GoDaddy Website Builder SEO",
    lead: "GoDaddy's website builder (sold as Websites + Marketing) is quick and cheap, and plenty of UK tradespeople use it. It covers the SEO basics – here's how to set them up properly, and when you'll outgrow it.",
    sections: `<h2>1. Run the SEO wizard</h2>
<p>In your GoDaddy dashboard, open your website and look for <strong>Search Engine Optimisation (SEO)</strong> under the marketing or site tools. The wizard asks what your business does and where, suggests keywords and helps write titles and descriptions for your pages. Use its suggestions as a starting point, not the final word – make each page's title specific ("Emergency Plumber in Preston | Smith Plumbing").</p>
<h2>2. Page titles and descriptions</h2>
<p>In the editor, open the <strong>Site navigation</strong> or pages menu, choose a page and open its <strong>settings</strong>. The <strong>SEO</strong> section has the page title, description and the address (slug). Write a unique title and description for every page, and check their width with the <a href="/title-tag-checker">title tag checker</a>.</p>
<h2>3. Headings and text</h2>
<p>Make sure each page has one main heading that says what the page is about, and enough useful text – a few hundred words on service pages explaining what you do, where, prices or how quotes work, and why customers choose you. GoDaddy's section templates can leave pages very thin; add a text section where needed.</p>
<h2>4. Images</h2>
<p>Open each image's settings to add <strong>alt text</strong> describing it. Upload photos at a sensible size (compress them first) – large phone photos are the most common cause of slow GoDaddy sites.</p>
<h2>5. Sitemap and Search Console</h2>
<p>GoDaddy creates a sitemap automatically at yourdomain.co.uk/sitemap.xml once the site is published. Add your site to <a href="/guides/google-search-console">Google Search Console</a> (GoDaddy can connect it for you through the SEO tools) and submit the sitemap.</p>
<h2>6. Google Business Profile</h2>
<p>For local businesses this matters more than any setting on the site. GoDaddy offers to manage listings, but you can claim your <a href="/guides/google-business-profile">Google Business Profile</a> directly for free and keep full control.</p>
<h2>What GoDaddy's builder can't do</h2>
<ul><li>No access to edit robots.txt, and limited control over the page code.</li><li>Limited redirects and structured data options compared with WordPress, Wix or Webflow.</li><li>A blog and online store exist but are basic.</li></ul>
<p>For a simple local brochure site, that's rarely a problem. If you plan lots of content, a bigger shop or detailed technical SEO, compare options in <a href="/guides/best-website-builder-for-seo">best website builder for SEO</a> – and if you move, redirect every old page (see <a href="/guides/website-redesign-seo">redesigning without losing rankings</a>).</p>
<p>Check how your GoDaddy site is doing with the <a href="/">free SEO check</a>.</p>`,
    faqs: [["Is GoDaddy Website Builder good for SEO?", "It covers the basics – titles, descriptions, a sitemap, alt text and HTTPS – which is enough for many local businesses. It's less flexible than WordPress, Wix or Webflow for advanced SEO."], ["Do I need GoDaddy's paid SEO add-on?", "No. Everything the wizard helps with, you can do yourself in the page settings for free. Spend the effort on your content and Google Business Profile instead."], ["How do I move from GoDaddy without losing rankings?", "Keep the same domain, recreate every important page, and set up 301 redirects from any address that changes. Check them with a redirect checker after launch."]],
  },
];
