// XKey pages. Each page targets its own search phrase with original copy.
// form: "check" | "audit" | "compare" | "monitor" | "title" | "robots" | "llms" | null
// focus: report section to jump to after a check (matches the report's section ids).
import { SECTOR_GUIDES } from "./sector-guides.js";
import { BUILDER_GUIDES } from "./builder-guides.js";
import { BEGINNER_GUIDES } from "./beginner-guides.js";
import { TRADE_GUIDES } from "./trade-guides.js";

const TOOLS = [
  ["/", "Free SEO check", "Full single-page audit: Google readiness, AI search, speed, security and local SEO."],
  ["/website-crawler", "Website crawler", "Crawl up to 10,000 pages and download every title, heading, link and price as Excel or CSV."],
  ["/ai-seo-checker", "AI SEO checker", "Can ChatGPT, Claude, Perplexity and Google AI Overviews read and cite your site?"],
  ["/website-audit", "Website audit", "Crawl up to 250 pages for broken links, duplicate titles and orphan pages."],
  ["/backlink-checker", "Backlink checker", "See which websites link to any site – .co.uk, .com or anything else – and which link to your competitor but not you."],
  ["/domain-authority-checker", "Domain authority checker", "Authority scores for up to 100 websites at once, with links and global rank."],
  ["/redirect-checker", "Redirect checker", "Follow any address hop by hop: 301s, 302s, chains, loops and meta refreshes."],
  ["/http-header-checker", "HTTP header checker", "Every response header for any address, with what each one means for SEO."],
  ["/website-down-checker", "Website down checker", "Is a website down for everyone or just you? Live status and response time."],
  ["/open-graph-checker", "Open Graph checker", "See how any page looks when shared on Facebook, LinkedIn, WhatsApp and X."],
  ["/hreflang-checker", "Hreflang checker", "Check language and country tags, return links and x-default on any page."],
  ["/website-hosting-checker", "Website hosting checker", "Who hosts a website? The hosting company, IP address, CDN and server location."],
  ["/ssl-checker", "SSL checker", "Is a site secure? Certificate expiry, https redirects, HSTS and mixed content."],
  ["/utm-builder", "UTM link builder", "Tracking links for Google Analytics: source, medium and campaign, ready to copy."],
  ["/url-slug-generator", "URL slug generator", "Turn titles into short, clean, SEO-friendly page addresses."],
  ["/case-converter", "Case converter", "Sentence case, Title Case, UPPER, lower, camelCase and more in one click."],
  ["/website-technology-checker", "Website technology checker", "What is a site built with? CMS, theme, plugins, analytics, hosting and email."],
  ["/dns-lookup", "DNS lookup", "A, MX, TXT, NS and other records, plus SPF and DMARC email checks."],
  ["/mx-lookup", "MX lookup", "Which mail servers receive a domain's email, in priority order, and who provides them."],
  ["/spf-checker", "SPF checker", "Check an SPF record, every include and the 10-DNS-lookup limit."],
  ["/dmarc-checker", "DMARC checker", "Look up a DMARC policy tag by tag and see if it stops fake email."],
  ["/dkim-checker", "DKIM checker", "Find DKIM keys under common selectors or yours, with key size and type."],
  ["/domain-age-checker", "Domain age checker", "How old is a website? Registration and expiry dates for up to 100 domains."],
  ["/whois-lookup", "WHOIS lookup", "Who a domain is registered with, when it expires and its name servers."],
  ["/seo-comparison", "Competitor comparison", "Your site against up to two competitors, side by side."],
  ["/seo-monitoring", "SEO monitoring", "A free weekly re-check with a score history graph."],
  ["/title-tag-checker", "Title tag checker", "See your title and description in pixels, exactly as Google cuts them."],
  ["/robots-txt-tester", "robots.txt tester", "Paste your rules and test any URL against Googlebot or AI crawlers."],
  ["/llms-txt-generator", "llms.txt generator", "Create an llms.txt file that gives AI assistants a map of your site."],
  ["/mobile-friendly-test", "Mobile-friendly test", "Check your page works on phones – Google's own test closed in 2023."],
  ["/broken-link-checker", "Broken link checker", "Crawl your whole site and find every dead link and broken image."],
  ["/schema-checker", "Schema checker", "Validate your structured data and see Google's required properties."],
  ["/page-speed-checker", "Page speed checker", "Core Web Vitals from real Chrome users plus a Lighthouse test."],
  ["/sitemap-checker", "Sitemap checker", "Check your XML sitemap is found, valid and listed in robots.txt."],
  ["/security-headers-checker", "Security headers checker", "HTTPS, HSTS and the headers browsers use to protect visitors."],
  ["/local-seo-checker", "Local SEO checker", "LocalBusiness markup, contact details and map signals for UK businesses."],
  ["/meta-tag-generator", "Meta tag generator", "Title, description, canonical, robots and social tags, ready to paste."],
  ["/open-graph-generator", "Open Graph generator", "Control how your link looks on Facebook, LinkedIn, WhatsApp and X."],
  ["/xml-sitemap-generator", "XML sitemap generator", "Find your pages and download a valid sitemap.xml."],
  ["/robots-txt-generator", "robots.txt generator", "Block AI training bots while staying visible in AI search."],
  ["/schema-generator", "Local business schema generator", "LocalBusiness JSON-LD for Google and AI assistants."],
  ["/keyword-generator", "Long-tail keyword generator", "Turn one topic into dozens of winnable search phrases."],
  ["/blog-title-generator", "Blog title generator", "Headline ideas measured to fit Google's results."],
  ["/word-counter", "Word counter", "Words, characters, reading time, readability and keyword density."],
  ["/keyword-difficulty-checker", "Keyword difficulty checker", "How hard is page one? We grade the pages that rank now."],
  ["/plagiarism-checker", "Plagiarism checker", "Find copies of your text across the web – no word limit."],
  ["/anchor-text-checker", "Anchor text checker", "Grade every link on a page and generate better anchors."],
  ["/local-search-checker", "Local search checker", "See Google results as they appear in any UK town."],
  ["/ai-meta-description-generator", "AI title & description writer", "AI reads your page and writes titles and descriptions that fit Google."],
  ["/bulk-seo-checker", "Bulk SEO checker", "Score up to 20 websites at once and download a CSV."],
  ["/seo-badge", "SEO score badge", "Show your score on your site – it updates itself weekly."],
];
export const toolCards = (except) => `<div class="grid">${TOOLS.filter(([p]) => p !== except).map(([p, t, d]) => `<a class="card" href="${p}"><p class="ct">${t}</p><p>${d}</p></a>`).join("")}</div>`;

const toolPage = (path, crumb, title, desc, h1, lead, focus, app, sections, faqs) => ({ path, crumb, title, desc, h1, lead, form: "check", focus, app, parent: ["/seo-tools", "SEO tools"], sections, faqs });

import { MORE_GUIDES } from "./more-guides.js";
import { GUIDES_8 } from "./guides-8.js";

export const PAGES = [
  {
    path: "/", crumb: "Home", title: "Free SEO Check | No Sign-Up, No Email, Instant Report",
    desc: "Free SEO check for any website – no sign-up, no email, no subscription. Google readiness, AI search, Core Web Vitals and local SEO, with a ranked fix list.",
    h1: "Free SEO check – no sign-up, no email", eyebrow: "Free · Instant · Any website", app: "XKey free SEO check",
    lead: "Type in any web address and get a full SEO report in about 20 seconds – no account, no email, no daily limit. See how Google reads the page, whether AI assistants can find it, how fast it really is, and exactly what to fix first.",
    form: "check",
    sections: `<div class="cta" style="margin-top:0"><p class="ct" style="font-size:24px">New: crawl your whole website free – up to 10,000 pages</p><p>Every page's title, description, headings, word count, links and prices in one spreadsheet, plus an SEO issues report and a score out of 100. Download as Excel or CSV, or compare with a competitor. No sign-up, no email.</p><a class="btn" href="/website-crawler">Try the website crawler</a></div>
<h2>What "free, no sign-up" means on XKey</h2>
<p>Lots of SEO checkers call themselves free, then ask for an email before showing the report, stop you after a few checks a day or hide the useful parts behind a trial. Here's exactly what you get on XKey:</p>
<div class="tablewrap"><table><thead><tr><th scope="col">What you might expect</th><th scope="col">On XKey</th></tr></thead><tbody>
<tr><td>Create an account first</td><td><strong>Never.</strong> No account, no login, no password.</td></tr>
<tr><td>"Sign in with Google" or connect Search Console</td><td><strong>Never.</strong> XKey reads public pages; it never asks to link any account.</td></tr>
<tr><td>Enter your email to see the results</td><td><strong>Never.</strong> The full report appears on screen straight away.</td></tr>
<tr><td>Only a few checks a day</td><td><strong>No daily limit.</strong> Only bot protection: two checks a minute, and a cap on re-checking the same site too often.</td></tr>
<tr><td>Part of the report locked</td><td><strong>Nothing locked.</strong> Every check, score and fix is shown.</td></tr>
<tr><td>Pay to download the report</td><td><strong>Free.</strong> Print it or save it as a PDF from the report page.</td></tr>
<tr><td>A free trial that runs out</td><td><strong>No trial.</strong> It stays free.</td></tr>
<tr><td>Sign up for the whole-site audit</td><td><p style="margin:0"><strong>No sign-up.</strong> The <a href="/website-audit">website audit</a> crawls up to 250 pages, and the <a href="/website-crawler">website crawler</a> up to 10,000.</p></td></tr>
</tbody></table></div>
<h2>What the free SEO check looks at</h2>
<p>XKey runs around 50 checks across ten areas, each weighted by how much it affects your rankings. You get an overall score out of 100, a score for each area and a "fix these first" list sorted by impact.</p>
<div class="grid">
<div class="card"><p class="ct">Indexing &amp; crawling</p><p>Status code, noindex, robots.txt rules, XML sitemap, canonical tag, redirect chains, www and https consistency.</p></div>
<div class="card"><p class="ct">AI search readiness</p><p>Whether search and AI crawlers are allowed in, llms.txt, entity markup, question-led content, freshness and trust pages.</p></div>
<div class="card"><p class="ct">Search snippet</p><p>Title and meta description measured in pixels like Google, plus Open Graph and social cards.</p></div>
<div class="card"><p class="ct">Content quality</p><p>Word count, readability, topic focus against your title, H1 and heading structure.</p></div>
<div class="card"><p class="ct">Real-world speed</p><p>Core Web Vitals from real Chrome users where available, plus a Lighthouse lab test.</p></div>
<div class="card"><p class="ct">Structured data</p><p>JSON-LD validity and Google's required properties for your business type.</p></div>
<div class="card"><p class="ct">Links</p><p>Internal linking, anchor text and a live broken-link test on a sample of your links.</p></div>
<div class="card"><p class="ct">Security, mobile &amp; local</p><p>HTTPS, security headers, mobile viewport, accessibility basics and LocalBusiness signals.</p></div>
</div>
<h2>Why most free SEO checkers miss AI search</h2>
<p>A growing share of people now ask ChatGPT, Claude, Perplexity or Google's AI Overviews instead of scrolling through ten blue links. Those assistants can only recommend a business they're allowed to crawl and can clearly understand. A site can rank on Google and still be invisible to AI because its robots.txt blocks the crawlers, its business details aren't marked up, or it never answers questions directly. XKey scores this separately as <strong>AI search readiness</strong>, so you can see both sides at once. Read more in our <a href="/guides/ai-search-optimisation">guide to AI search optimisation</a>.</p>
<h2>How is the SEO score worked out?</h2>
<p>Every check has an impact level. A critical problem – such as a noindex tag that keeps the page out of Google – counts five times as much as a low-impact one, high counts three times and medium twice. Your score out of 100 is how many of those weighted points the page earns. That means one serious problem pulls the score down more than a handful of small ones, which is how it works in Google too. Each area gets its own score as well, so you can see at a glance whether the trouble is indexing, content, speed or AI visibility.</p>
<h2>Built for UK websites</h2>
<p>XKey is made in Blackpool for UK businesses. The local SEO checks recognise UK phone numbers and postcodes, so it can tell whether your contact details are on the page and match your LocalBusiness markup, and the report is written in plain British English rather than agency jargon. It works for any website in any country, though.</p>
<h2>How to use your SEO report</h2>
<ol><li><strong>Start with the fix list.</strong> It's sorted so the changes with the biggest effect come first – usually indexing problems, missing titles or a missing H1.</li>
<li><strong>Check the critical items.</strong> Anything marked critical can stop a page ranking at all.</li>
<li><strong>Re-run the check</strong> after each change. Reports are cached for an hour, so add a small change to the address (such as a trailing slash) if you need a fresh one sooner.</li>
<li><strong>Check the whole site.</strong> A single page can look perfect while problems elsewhere hold you back – run a <a href="/website-audit">full website audit</a> next.</li></ol>
<h2>What can't a free SEO check tell you?</h2>
<p>No checker – free or paid – can see your actual Google rankings, the full list of sites linking to you, or how strong your competitors are for a particular search. For your rankings and indexing, set up Google Search Console (our <a href="/guides/google-search-console">step-by-step guide</a> shows how). If your site doesn't appear in Google at all, start with <a href="/guides/why-is-my-website-not-on-google">why isn't my website on Google?</a> And if you serve local customers, follow the <a href="/guides/local-seo-checklist">local SEO checklist</a>.</p>
<h2>Is this SEO check really free?</h2>
<p>Yes, completely. No cost, no sign-up, no email address, no subscription, no trial that runs out and no "upgrade to see your results". You get the whole report straight away. The <a href="/seo-tools">instant tools</a> run in your browser and are unlimited; full checks only have a safety limit set far above normal use, to stop bots. XKey is made by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, a small web studio in Blackpool, as a free tool for UK businesses – if you'd like the fixes done for you, IceWork can help, but you never have to.</p>`,
    faqs: [
      ["How accurate is the score?", "Every check is based on what Google and the AI providers document publicly, and title widths are measured in pixels the way Google displays them. The score is a guide to how well-prepared a page is – no tool can guarantee rankings, because Google also weighs links, competition and many other signals."],
      ["Do you store my website's content?", "No. We fetch the page like a search engine would, analyse it and keep only the finished report in a short-lived cache for an hour so repeat views are fast."],
      ["Is there a limit on how many sites I can check?", "Not for normal use. The instant tools run in your browser and are unlimited. Full checks and audits only have a safety limit set far above what a person can use by hand (two checks a minute, every minute), plus a cap on how often any one website can be checked – that stops bots using XKey to flood other people's sites."],
      ["Do I need to give my email address?", "No. XKey never asks for an email, an account or card details – not even for weekly monitoring, which gives you a private link instead."],
      ["Can I download my SEO report without signing up?", "Yes. Use \"Print or save as PDF\" at the bottom of any report. The website audit also gives you a PDF and a CSV of every page, with no sign-up."],
      ["Can I check a competitor's website?", "Yes – any public website. To see your site and up to two competitors side by side, use the competitor comparison."],
      ["Why is my score different from other SEO checkers?", "Each tool weights different checks. XKey gives extra weight to things that stop a page appearing at all (indexing, titles, H1) and adds AI search readiness, which most checkers don't measure yet."],
    ],
  },
  {
    path: "/ai-seo-checker", crumb: "AI SEO checker", parent: ["/seo-tools", "SEO tools"], title: "Free AI SEO Checker | Can ChatGPT See Your Website?",
    desc: "Free AI SEO checker: see if ChatGPT, Claude, Perplexity and Google AI Overviews can crawl, understand and cite your website, with clear fixes.",
    h1: "AI SEO checker: can ChatGPT see your website?", eyebrow: "AI search readiness", app: "XKey AI SEO checker",
    lead: "Check whether AI assistants are allowed to read your site, whether they can tell who you are, and whether your content is written in the form they quote.",
    form: "check", focus: "ai-search-readiness",
    sections: `<h2>What the AI SEO check covers</h2>
<ul><li><strong>AI crawler access.</strong> We read your robots.txt the way each crawler does. Search crawlers such as OAI-SearchBot, Claude-SearchBot, PerplexityBot and Googlebot decide whether you can be <em>cited</em>; training-only crawlers such as GPTBot and Google-Extended only affect model training, so we report them separately.</li>
<li><strong>Snippet controls.</strong> Google documents that <code>nosnippet</code> and <code>max-snippet</code> limit how your content can be used in AI Overviews.</li>
<li><strong>Entity clarity.</strong> Organization or LocalBusiness structured data with links to your official profiles tells AI exactly who runs the site.</li>
<li><strong>Question-led content.</strong> AI answers tend to quote short, direct answers under question-style headings.</li>
<li><strong>Freshness and trust.</strong> Visible "last updated" dates, and About, Contact and Privacy pages.</li>
<li><strong>llms.txt.</strong> A new, optional file that gives AI tools a clean summary of your site. It isn't a ranking factor, but it's cheap to add – use our <a href="/llms-txt-generator">llms.txt generator</a>.</li></ul>
<h2>What is AI SEO (or GEO)?</h2>
<p>Generative engine optimisation – often called AI SEO or GEO – means making your site easy for AI assistants to find, understand and cite. Most of it is good SEO done thoroughly: crawlable pages, clear facts, structured data and content that answers real questions. The difference is that AI tools are less forgiving of vague pages, because they need a confident, specific answer to quote. Our <a href="/guides/ai-search-optimisation">AI search optimisation guide</a> explains each step.</p>
<h2>Should I block AI crawlers?</h2>
<p>It depends on what you want. Blocking training crawlers (GPTBot, Google-Extended, CCBot) stops your content being used to train models but doesn't stop you being found. Blocking search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) stops those assistants showing and linking to your site. Most businesses that want customers should allow the search crawlers. Test your rules with our <a href="/robots-txt-tester">robots.txt tester</a>.</p>`,
    faqs: [["Does llms.txt help me rank in ChatGPT?", "Not directly – no major AI provider has said it uses llms.txt as a ranking signal. It's a low-effort way to give AI tools a clean overview, so we report it as low impact."], ["How long until AI assistants notice changes?", "Assistants that search the web live (such as ChatGPT search or Perplexity) can see changes as soon as their crawler revisits. Answers that come from a model's training data only change when the model is retrained."]],
  },
  {
    path: "/website-audit", crumb: "Website audit", parent: ["/seo-tools", "SEO tools"], title: "Free Website SEO Audit | No Sign-Up, Up to 250 Pages",
    desc: "Free website audit: crawl up to 250 pages to find broken links, duplicate titles, orphan pages, redirect chains and indexing problems. PDF and CSV reports.",
    h1: "Free website SEO audit", eyebrow: "Full-site crawl", app: "XKey website audit",
    lead: "XKey crawls up to 250 pages of your site the way Google does and lists every site-wide problem, ranked by impact – with a PDF report and a CSV of every page.",
    form: "audit",
    sections: `<h2>What the website audit finds</h2>
<div class="grid">
<div class="card"><p class="ct">Broken pages</p><p>Every 404 and server error, with the pages that link to it.</p></div>
<div class="card"><p class="ct">Redirect problems</p><p>Internal links that hit redirects, and redirect chains.</p></div>
<div class="card"><p class="ct">Duplicate content</p><p>Duplicate and near-duplicate titles, descriptions and page text.</p></div>
<div class="card"><p class="ct">Indexing conflicts</p><p>Noindex pages in the sitemap, canonicals pointing elsewhere, pages missing from the sitemap.</p></div>
<div class="card"><p class="ct">Site structure</p><p>Orphan pages nothing links to, and pages buried four or more clicks deep.</p></div>
<div class="card"><p class="ct">Thin and slow pages</p><p>Pages with very little text, missing H1s and slow server responses.</p></div>
</div>
<h2>How does the crawl work?</h2>
<p>We start at the address you enter, follow your internal links and read your XML sitemap, respecting your robots.txt as we go. Each page is fetched once and summarised; nothing is stored after your report is shown. A 250-page crawl usually takes one to three minutes.</p>
<h2>Single page or whole site?</h2>
<p>The <a href="/">free SEO check</a> looks at one page in great detail, including AI readiness and real-world speed. The website audit looks wider and finds problems that only show up across many pages, such as fifty pages sharing the same title. Use both. For bigger sites, or to get every page into a spreadsheet, use the <a href="/website-crawler">website crawler</a>, which handles up to 10,000 pages.</p>`,
    faqs: [["How many pages can the audit check?", "Up to 250 pages per audit, which covers most small and medium business websites. Larger sites are sampled from the home page and sitemap outwards."], ["Does the audit follow robots.txt?", "Yes. Pages your robots.txt blocks for crawlers are skipped and listed, just as a search engine would treat them."], ["Can I download the results?", "Yes. Print the report or save it as a PDF, and download a CSV with a row for every page crawled."]],
  },
  {
    path: "/website-crawler", crumb: "Website crawler", parent: ["/seo-tools", "SEO tools"], title: "Free Website Crawler | 10,000 Pages to Excel or CSV",
    desc: "Free website crawler: crawl up to 10,000 pages and download every title, description, heading, link, contact detail and product price as Excel or CSV.",
    h1: "Free website crawler", eyebrow: "Up to 10,000 pages", app: "XKey website crawler",
    lead: "Crawl a whole website and get an SEO issues report, a score out of 100 and a spreadsheet of every page – titles, descriptions, headings, word counts, links, contact details and product prices.",
    sections: `<p><a class="btn" href="https://crawler.xkey.co.uk/" rel="noopener">Open the website crawler</a></p>
<h2>What the website crawler gives you</h2>
<div class="grid">
<div class="card"><p class="ct">A row for every page</p><p>Status code, title, description, H1, headings, word count, response time, canonical, robots tag and the page that first linked to it.</p></div>
<div class="card"><p class="ct">SEO issues and a score</p><p>Broken pages and where they're linked from, missing or duplicate titles and descriptions, missing H1s, thin and slow pages, images without alt text and noindex pages – ranked High, Medium and Low.</p></div>
<div class="card"><p class="ct">Excel, CSV and Google Sheets</p><p>Download an Excel workbook with Summary, Issues and Pages sheets, a CSV of every page, an issues-only CSV, or a formula that pulls the data straight into Google Sheets.</p></div>
<div class="card"><p class="ct">Every product in a shop</p><p>The fast product list reads a shop's sitemaps and lists every product address, with names and product codes, in a minute or two – even for shops with tens of thousands of products. Then visit any section for prices, SKU, brand, stock and images.</p></div>
<div class="card"><p class="ct">Competitor comparison</p><p>Crawl your site and a competitor's with the same settings and see them side by side, with the better result highlighted.</p></div>
<div class="card"><p class="ct">Contact details</p><p>Email addresses and phone numbers published on each page, so you can check your details are the same everywhere.</p></div>
</div>
<h2>Website crawler or website audit?</h2>
<p>The <a href="/website-audit">website audit</a> checks up to 250 pages in a few minutes and gives you a ranked report with indexing checks such as orphan pages and sitemap conflicts. The crawler goes much further – up to 10,000 pages – and is built for getting the data out: a spreadsheet you can sort, filter and share. Use the audit for a quick health check and the crawler when you need every page in a spreadsheet.</p>
<h2>How long does a crawl take?</h2>
<p>The crawler is deliberately polite. It follows robots.txt, including any crawl delay, waits between 2.5 and 5.5 seconds between pages and backs off if a site says it's busy. That works out at about four seconds a page: 100 pages take around seven minutes and 1,000 pages about an hour. Keep the crawl page open while it runs; once it finishes, the results and downloads stay available for 48 hours.</p>
<h2>What it can't do</h2>
<ul><li>It stays on the site you enter and doesn't check links to other websites.</li><li>It reads the HTML each page sends, so content that only appears after JavaScript runs may be missed.</li><li>It runs on a free server that sleeps when nobody is using it, so the first visit can take up to a minute to wake it, and very long crawls may be interrupted.</li><li>Only crawl sites you own or have permission to crawl.</li></ul>
<p>Not sure where to start? Run the <a href="/">free SEO check</a> on your home page first, then crawl the whole site. Our guide to <a href="/guides/broken-links-and-redirects">broken links and redirects</a> explains how to fix what the crawler finds.</p>`,
    faqs: [["Is the website crawler free?", "Yes. No sign-up, no email and no subscription. There's a limit of a few crawls at once so the free server stays available for everyone."], ["Can it list every product a shop sells?", "Usually, yes. Open Product directory options and tick Full product list, fast: it reads the shop's sitemaps, which list every product page, and gives you each product's address, name and code in a minute or two. For prices and stock, start a second crawl with Visit product pages for prices and a section of the shop – that visits each page, so allow about 4 seconds a product."], ["Is my crawl data kept?", "Finished crawl files are deleted automatically after 48 hours. Nothing is shared with anyone else."]],
  },
  {
    path: "/backlink-checker", crumb: "Backlink checker", parent: ["/seo-tools", "SEO tools"], title: "Free Backlink Checker for Any Website | No Sign-Up",
    desc: "Free backlink checker for any website – .co.uk, .com and more: see how many websites link to a site, the 50 strongest, and the link gap with a competitor.",
    h1: "Free backlink checker for any website", eyebrow: "Free · No sign-up", app: "XKey backlink checker", form: "backlinks",
    lead: "See which websites link to any site – .co.uk, .com or any other ending – how strong those links are, and which websites link to your competitor but not to you. No account, no email.",
    sections: `<h2>What the backlink checker shows</h2>
<div class="grid">
<div class="card"><p class="ct">Websites linking to you</p><p>How many different websites link to a site, counted once each – the headline number most SEO tools use.</p></div>
<div class="card"><p class="ct">Your strongest links</p><p>The 50 strongest linking websites, strongest first, each with a link strength score.</p></div>
<div class="card"><p class="ct">The link gap</p><p>Add a competitor to see the strong websites that link to them but not to you – your best list of link prospects.</p></div>
</div>
<h2>Where does the link data come from?</h2>
<p>From <a href="https://commoncrawl.org/" rel="noopener">Common Crawl</a>, a non-profit that crawls billions of web pages every month and publishes a free map of which websites link to which. Each quarter XKey takes the newest map – over 130 million websites and 2 billion links – and builds an index of every website that's linked to, whatever its ending. That's the same kind of data the big paid tools build with their own crawlers.</p>
<h2>What is link strength?</h2>
<p>A score from 0 to 100 based on how many different websites link to a site, on a logarithmic scale – so going from 10 to 100 linking websites moves the score as much as going from 1,000 to 10,000. The most-linked website on the web scores 100. A local business with a few dozen good links typically scores 15–30; national newspapers and government sites score 60 and above. It's comparable to Ahrefs' Domain Rating or Moz's Domain Authority in spirit, but it's our own calculation, so the numbers won't match theirs.</p>
<h2>How do I use the link gap?</h2>
<p>Work down the list and ask why each website links to your competitor. Usually it's one of a handful of reasons: a supplier or manufacturer listing stockists, a trade body or directory, a local club or charity they sponsor, a news story, or a genuinely useful guide on their site. Most of those are open to you too. Never buy links – Google treats paid links as spam, and our <a href="/guides/local-seo-checklist">local SEO checklist</a> covers the honest ways to earn them.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>Only the 50 strongest linking websites.</strong> The count of linking websites is complete, but the list (and the link gap) shows each site's 50 strongest, to keep lookups fast and free.</li><li><strong>Not every link on the web.</strong> Common Crawl visits billions of pages but not all of them, so small or new sites may show fewer links than they really have – and links added in the last few months won't appear until the next quarterly update.</li><li><strong>Websites, not individual pages.</strong> It counts linking websites and shows which ones; it doesn't list the exact page each link is on, its anchor text or whether it's nofollow. Subdomains count as their main site, so blog.example.com is looked up as example.com.</li></ul>`,
    faqs: [["Is this backlink checker really free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots. The data is public, and XKey builds the index itself, so there's nothing to upgrade to."], ["How often is the backlink data updated?", "Every three months, when Common Crawl publishes its next web graph. The months the data covers are shown under every result."], ["Why does my site show no backlinks?", "Either no other website links to it yet, or Common Crawl hasn't crawled the pages that do. New sites often take a few months to appear. Getting listed on a few genuine local directories and suppliers' sites is the quickest honest way to start."], ["Can I check a competitor's backlinks?", "Yes – any website, UK or not. Put your site in the first box and theirs in the second to see the websites that link to them but not to you."]],
  },
  {
    path: "/domain-authority-checker", crumb: "Domain authority checker", parent: ["/seo-tools", "SEO tools"], title: "Free Domain Authority Checker | Bulk, No Sign-Up",
    desc: "Free bulk domain authority checker: score up to 100 websites at once from 0 to 100, with linking websites and global rank. No sign-up, no email.",
    h1: "Free domain authority checker", eyebrow: "Bulk · Free · No sign-up", app: "XKey domain authority checker", form: "authority",
    lead: "Paste up to 100 websites – yours, your competitors', or sites you're thinking of getting a link from – and see how much authority each one has in the web's link map. No account, no email.",
    sections: `<h2>What the domain authority checker shows</h2>
<div class="grid">
<div class="card"><p class="ct">Authority score</p><p>A score from 0 to 100 for each website. The more central a site is in the web's link map, the higher it scores.</p></div>
<div class="card"><p class="ct">Linking websites</p><p>How many different websites link to it, each counted once.</p></div>
<div class="card"><p class="ct">Global rank</p><p>Its position among every website Common Crawl has mapped – over 100 million – where #1 is the most central.</p></div>
</div>
<p>Check up to 100 websites at once, sort them by authority and download the results as a CSV. Click any website to open its backlinks.</p>
<h2>How is authority worked out?</h2>
<p>From <a href="https://commoncrawl.org/" rel="noopener">Common Crawl</a>'s public map of which websites link to which, refreshed every quarter. Common Crawl ranks every website by <strong>harmonic centrality</strong>: roughly, how few link-hops it takes to reach the site from everywhere else on the web. A link from a well-connected site therefore counts for far more than dozens from sites nobody links to, which makes the score hard to inflate with junk links.</p>
<p>XKey turns that rank into a score: the most central website on the web scores 100, and the score falls evenly each time the rank gets ten times longer, down to 0 for the least connected site. As a rough guide, national brands and newspapers score 70 and above, established businesses 40–60, and a local business with a handful of genuine links 20–40.</p>
<h2>Is this the same as Moz Domain Authority or Ahrefs Domain Rating?</h2>
<p>No. Domain Authority is Moz's own metric and Domain Rating is Ahrefs', each calculated from their own crawls. XKey's authority score measures the same idea – how strong a website's links are – from public data, so it will usually put sites in the same order, but the numbers won't match theirs. Compare sites with one tool, not across tools.</p>
<h2>How to use domain authority</h2>
<ul><li><strong>Size up competitors.</strong> If the sites ranking above you all score 30 points higher, you'll need more and better links, not just better pages.</li><li><strong>Vet link opportunities.</strong> Paste a list of directories, suppliers or local sites and start with the strongest. Never buy links – Google treats paid links as spam.</li><li><strong>Track your progress.</strong> Check again each quarter when the data updates. Authority moves slowly; a few genuine links from respected local sites make a real difference.</li></ul>
<p>Authority is about the whole website. Whether a page ranks also depends on its content and how well it answers the search – run the <a href="/">free SEO check</a> on the page itself, and see who links to your competitors with the <a href="/backlink-checker">backlink checker</a>.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>Brand-new links.</strong> The data is refreshed quarterly, so links from the last few months won't count yet.</li><li><strong>Every link on the web.</strong> Common Crawl visits billions of pages but not all of them, so small sites may score a little lower than they should.</li><li><strong>Individual pages.</strong> Scores are for whole websites. Subdomains count as their main site, so blog.example.com is scored as example.com.</li><li><strong>Rankings or traffic.</strong> A high score helps, but it doesn't guarantee a page ranks or gets visitors.</li></ul>`,
    faqs: [["Is the domain authority checker free?", "Yes. No sign-up, no email and no subscription. You can check up to 100 websites at a time, with only a fair-use limit to stop bots."], ["What is a good domain authority score?", "It depends on who you compete with. Compare your score with the sites that rank above you for your main searches: if you're within about ten points, better pages and local signals can close the gap. For most local businesses, 20–40 is normal."], ["How can I increase my domain authority?", "Earn links from websites that are themselves well linked: suppliers and manufacturers listing stockists, trade bodies, local news, clubs and charities you support, and genuinely useful guides people want to share. Links from low-quality directories barely move the score."], ["Why does a website score 0?", "No links to it were found in the data. That's common for new or very small sites, because Common Crawl doesn't visit every page on the web."], ["How often is it updated?", "Every three months, when Common Crawl publishes its next web graph. The months the data covers are shown under every result."]],
  },
  {
    path: "/redirect-checker", crumb: "Redirect checker", parent: ["/seo-tools", "SEO tools"], title: "Redirect Checker | 301, 302 & Redirect Chains (Free)",
    desc: "Free redirect checker: follow up to 100 addresses hop by hop and see every 301, 302 and meta refresh, redirect chains, loops and where each one ends.",
    h1: "Free redirect checker", eyebrow: "Bulk · Free · No sign-up", app: "XKey redirect checker", form: "redirects",
    lead: "See exactly what happens when someone – or Google – visits an address: every redirect, its status code, and where it finally lands. Check one address or up to 100 at once.",
    sections: `<h2>What the redirect checker shows</h2>
<div class="grid">
<div class="card"><p class="ct">Every hop</p><p>Each address in the chain with its HTTP status code (301, 302, 307, 308, 404…) and response time.</p></div>
<div class="card"><p class="ct">Where it ends</p><p>The final address and whether it loads, errors or never responds.</p></div>
<div class="card"><p class="ct">What to fix</p><p>Chains, loops, temporary redirects, meta refreshes and redirects back to insecure http.</p></div>
</div>
<p>Press <strong>Test http, https, www versions</strong> to check all four ways people can type your address. They should all end up on one version of your site, ideally in a single hop.</p>
<h2>301, 302, 307 or 308?</h2>
<ul><li><strong>301 Moved Permanently</strong> – the page has moved for good. Use it for changed addresses, a move to https or a new domain.</li><li><strong>308 Permanent Redirect</strong> – the same as a 301 for search engines. Fine to use.</li><li><strong>302 Found and 307 Temporary Redirect</strong> – the move is temporary, for example during maintenance. Google may keep the old address in its results.</li><li><strong>Meta refresh</strong> – a redirect inside the page instead of from the server. It's slower and less clear to search engines, so replace it with a 301 when you can.</li></ul>
<h2>Do redirects hurt SEO?</h2>
<p>A single 301 passes a page's ranking signals on to the new address, so moving pages is safe if you redirect them. Problems start with <strong>chains</strong> (A to B to C), which slow visitors down and waste Google's crawling, and <strong>loops</strong>, which stop the page loading at all. Fix a chain by pointing the first address straight at the final one, and update your own links to skip the redirect. Our guide to <a href="/guides/broken-links-and-redirects">broken links and redirects</a> covers the fixes, and the <a href="/website-audit">website audit</a> finds redirecting links across your whole site.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>JavaScript redirects.</strong> We read the server's response and meta refresh tags; we don't run the page's scripts.</li><li><strong>Redirects by country or login.</strong> We visit from Cloudflare's network, usually in a nearby country. Sites that redirect by location, cookie or login may send you somewhere else.</li><li><strong>Sites that block checkers.</strong> Some firewalls refuse automated visits, which shows as a 403 or no response even when the site works in your browser.</li></ul>`,
    faqs: [["Is the redirect checker free?", "Yes. No sign-up, no email and no subscription. Check up to 100 addresses at a time, with only a fair-use limit to stop bots."], ["How many redirects is too many?", "Aim for one. Google follows up to ten hops, but each one slows the page down, so point old addresses straight at the final page."], ["Should http and www versions redirect?", "Yes. Pick one version of your site – usually https without www, or with it – and 301 every other version to it, so visitors and Google see a single address."], ["Why does the checker show a 403 when my site works?", "Your site's firewall is probably blocking automated visitors. That's not a problem for Google if it allows Googlebot, but it's worth checking in Search Console."]],
  },
  {
    path: "/http-header-checker", crumb: "HTTP header checker", parent: ["/seo-tools", "SEO tools"], title: "HTTP Header Checker | See Response Headers Free",
    desc: "Free HTTP header checker: see the status code and every response header for any address and each redirect, with notes on X-Robots-Tag and caching.",
    h1: "Free HTTP header checker", eyebrow: "Any address · Free · No sign-up", app: "XKey HTTP header checker", form: "headers",
    lead: "See exactly what a server sends back before the page itself: the status code and every header, for the address you enter and each redirect along the way.",
    sections: `<h2>Headers that matter for SEO</h2>
<ul><li><strong>Status code</strong> – 200 for a working page, 301 or 308 for a permanent move, 404 or 410 for a page that's gone, 5xx for a server problem.</li><li><strong>X-Robots-Tag</strong> – works like a robots meta tag but in the header, so it can apply to PDFs and images. A stray <code>noindex</code> here keeps the page out of Google, and it's easy to miss because it isn't in the page's HTML.</li><li><strong>Link: rel="canonical"</strong> – a canonical address set in the header, often used for PDFs.</li><li><strong>Location</strong> – where a redirect sends visitors.</li><li><strong>Content-Type</strong> – what the file is and its character set.</li></ul>
<h2>Headers that matter for speed and security</h2>
<ul><li><strong>Content-Encoding</strong> – whether the page is compressed with gzip or brotli. Compression can make pages several times smaller.</li><li><strong>Cache-Control</strong> – how long browsers and CDNs may keep a copy.</li><li><strong>Strict-Transport-Security (HSTS)</strong> – tells browsers to always use https.</li><li><strong>X-Content-Type-Options</strong>, <strong>Content-Security-Policy</strong> and friends – protect visitors from some attacks. The <a href="/security-headers-checker">security headers checker</a> grades them in detail.</li></ul>
<p>To follow lots of addresses at once, use the <a href="/redirect-checker">redirect checker</a>.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>What visitors in other countries get.</strong> We visit from Cloudflare's network; sites can send different headers by location, cookie or login.</li><li><strong>Request headers.</strong> This shows what the server sends back, not what your browser sends.</li><li><strong>Sites that block checkers.</strong> A firewall may answer us with a 403 even when the site works in your browser.</li></ul>`,
    faqs: [["Is the HTTP header checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["How do I see HTTP headers in my browser?", "Open developer tools (F12), go to the Network tab, reload the page and click the first request. This tool shows the same thing without the setup, and follows redirects for you."], ["Why is my page not indexed when the HTML has no noindex?", "Check the X-Robots-Tag header here. Some servers, plugins and CDNs add noindex in the header, where it's invisible in the page source."]],
  },
  {
    path: "/website-down-checker", crumb: "Website down checker", parent: ["/seo-tools", "SEO tools"], title: "Is It Down? Website Down Checker for Any Site",
    desc: "Free website down checker: find out if a site is down for everyone or just you, with its live status code, response time and any redirects. No sign-up.",
    h1: "Is this website down?", eyebrow: "Any website · Free · No sign-up", app: "XKey website down checker", form: "updown",
    lead: "Type a web address and we'll try to load it right now from Cloudflare's network, so you can tell if it's down for everyone or just for you.",
    sections: `<h2>What the down checker tells you</h2>
<div class="grid">
<div class="card"><p class="ct">Up or down</p><p>A plain answer: the site loads, it's down, or it's answering with an error page.</p></div>
<div class="card"><p class="ct">Status code and speed</p><p>The HTTP status (200, 404, 500, 503…) and how long the server took to answer.</p></div>
<div class="card"><p class="ct">Redirects</p><p>Every redirect on the way, so you can spot a loop or a redirect to a dead address.</p></div>
</div>
<h2>It's up for you but down for me. What now?</h2>
<ol><li>Reload the page with your browser's cache bypassed (Ctrl + F5 on Windows, Cmd + Shift + R on a Mac), or try a private window.</li><li>Try the site on mobile data instead of Wi-Fi. If it works there, the problem is your network or router.</li><li>Restart your router, or switch your computer's DNS to a public resolver such as 1.1.1.1 or 8.8.8.8.</li><li>If it still won't load, a firewall or the site's bot protection may be blocking your connection. Contact the site owner.</li></ol>
<h2>What the codes mean</h2>
<ul><li><strong>200</strong> – the page loaded normally.</li><li><strong>301 / 302</strong> – a redirect to another address; we follow it to the end.</li><li><strong>403</strong> – the server refused the request, often bot protection. The site may still work in a browser.</li><li><strong>404 / 410</strong> – the server is up, but that page doesn't exist.</li><li><strong>500, 502, 503, 504</strong> – the server or something in front of it has a problem. This is what "down" usually means.</li><li><strong>No response</strong> – the server didn't answer at all, the domain doesn't resolve, or the connection timed out.</li></ul>
<h2>Does downtime hurt SEO?</h2>
<p>A short outage doesn't. Google retries later. But if a site keeps returning 5xx errors or timing out for more than a day or two, Google crawls it less and can start dropping pages from results. Turn on free <a href="/seo-monitoring">weekly SEO monitoring</a> to catch problems, and check the server with the <a href="/website-hosting-checker">hosting checker</a>.</p>`,
    faqs: [["Is the down checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Where do you check from?", "From Cloudflare's network, normally the data centre nearest to you. One check from one place can't see a regional outage elsewhere in the world."], ["Why does it say 403 when the site works for me?", "Some sites block automated checks with bot protection. A 403 usually means the server is up and refusing us, not that it's down."], ["Can it alert me when my site goes down?", "Not yet. For now, check here when you suspect a problem, and use weekly SEO monitoring to catch pages that break."]],
  },
  {
    path: "/open-graph-checker", crumb: "Open Graph checker", parent: ["/seo-tools", "SEO tools"], title: "Open Graph Checker | Preview Social Shares Free",
    desc: "Free Open Graph checker: see how any page looks when shared on Facebook, LinkedIn, WhatsApp and X, and check its og: and Twitter card tags.",
    h1: "Open Graph checker", eyebrow: "Any page · Free · No sign-up", app: "XKey Open Graph checker", form: "ogcheck",
    lead: "Enter a page address to preview its link card and check every Open Graph and X (Twitter) card tag, with a plain list of anything missing or wrong.",
    sections: `<h2>What the Open Graph checker looks at</h2>
<div class="grid">
<div class="card"><p class="ct">The preview</p><p>The title, description, image and site name the big platforms will show, read the way their link previewers read them.</p></div>
<div class="card"><p class="ct">The image</p><p>Whether og:image is there, uses a full https:// address, loads, and is big enough (1200 × 630 is ideal).</p></div>
<div class="card"><p class="ct">Every tag</p><p>All og:, twitter: and article: tags on the page, plus the canonical address, so you can spot duplicates and leftovers.</p></div>
</div>
<h2>Why do Open Graph tags matter?</h2>
<p>When someone shares your page on Facebook, LinkedIn, WhatsApp, Slack or X, the platform builds the card from these tags. Without them it guesses, often picking a logo or a random image and the wrong text. A clear card with a good image gets more clicks, and every share is a visitor. Open Graph tags don't change Google rankings directly, but they decide how your links look everywhere else.</p>
<h2>How to fix the problems it finds</h2>
<ul><li>Create the tags with our <a href="/open-graph-generator">Open Graph generator</a> and paste them into the page's &lt;head&gt;. On WordPress, Yoast SEO and Rank Math add them for you.</li><li>Use an image at least 1200 × 630 pixels, under 5 MB, on a full https:// address.</li><li>After fixing, ask the platform to re-read the page. Facebook and LinkedIn cache cards, so old previews can stick for a while.</li></ul>
<h2>What it can't check</h2>
<p>Each platform crops and trims a little differently, and some only show a card after they've fetched the page themselves, so treat the preview as a close guide rather than an exact copy. Pages behind a login or bot protection can't be read.</p>`,
    faqs: [["Is the Open Graph checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["My card still shows the old image. Why?", "Facebook, LinkedIn and X cache link previews. Once your tags are right, use each platform's own sharing debugger to make it fetch the page again."], ["Do I need Twitter card tags too?", "X falls back to Open Graph tags, but it needs twitter:card set to summary_large_image to show the big image."], ["What size should og:image be?", "1200 × 630 pixels works everywhere. Keep important text away from the edges, because some apps crop to a square."]],
  },
  {
    path: "/hreflang-checker", crumb: "Hreflang checker", parent: ["/seo-tools", "SEO tools"], title: "Hreflang Checker | Test Hreflang Tags Free",
    desc: "Free hreflang checker: test the language and country tags on any page, check every alternate page links back, and catch wrong codes such as en-UK.",
    h1: "Hreflang checker", eyebrow: "Any page · Free · No sign-up", app: "XKey hreflang checker", form: "hreflang",
    lead: "Enter a page address to list its hreflang tags, check each language code, and load every alternate version to confirm it links back.",
    sections: `<h2>What the hreflang checker tests</h2>
<div class="grid">
<div class="card"><p class="ct">Valid codes</p><p>Every hreflang value must be a real language code, with an optional country: en, en-GB, fr-BE. A common slip is en-UK, which Google ignores.</p></div>
<div class="card"><p class="ct">Return links</p><p>If page A points to page B, B must point back to A. We open every alternate page and check, because one-way tags are ignored.</p></div>
<div class="card"><p class="ct">Self-reference and x-default</p><p>Each page should list itself, and an x-default tells Google which version to show everyone else.</p></div>
</div>
<h2>Who needs hreflang?</h2>
<p>Only sites with the same content in more than one language or for more than one country, such as a UK and an Irish version of a shop, or English and Welsh pages. A single-language UK site doesn't need it at all. Hreflang doesn't raise rankings; it makes sure each searcher gets the right version, with the right currency and spelling.</p>
<h2>The mistakes we see most</h2>
<ul><li><strong>en-UK instead of en-GB.</strong> The country code for the United Kingdom is GB. "uk" on its own means Ukrainian.</li><li><strong>Missing return links.</strong> The US page points to the UK page, but the UK page doesn't point back.</li><li><strong>Alternates that redirect or 404.</strong> Every hreflang address must load directly with a 200.</li><li><strong>Pointing every language at the home page</strong> instead of at the matching page.</li></ul>
<h2>What it can't check</h2>
<p>We read tags in the page's &lt;head&gt; and in HTTP Link headers. Hreflang listed only in an XML sitemap isn't checked here; use the <a href="/sitemap-checker">sitemap checker</a> for the sitemap itself. We open up to 20 alternate pages per check.</p>`,
    faqs: [["Is the hreflang checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Should I use en or en-GB?", "Use en-GB if you also have versions for other English-speaking countries. Use en alone if one English version serves everyone."], ["Do I need x-default?", "It's recommended. It names the page to show people whose language or country doesn't match any version, often a language picker or your main site."], ["Does hreflang need to be on every page?", "On every page that has translated or regional versions, and each of those versions must list all the others, including itself."]],
  },
  {
    path: "/website-hosting-checker", crumb: "Website hosting checker", parent: ["/seo-tools", "SEO tools"], title: "Website Hosting Checker | Who Is Hosting This Site?",
    desc: "Free website hosting checker: find out who hosts any website, its IP address and network owner, the country and whether a CDN like Cloudflare sits in front.",
    h1: "Who is hosting this website?", eyebrow: "Any website · Free · No sign-up", app: "XKey website hosting checker", form: "hosting",
    lead: "Type a web address to find the company that hosts it, the server's IP address and where that address is registered, and whether a CDN hides the real host.",
    sections: `<h2>What the hosting checker shows</h2>
<div class="grid">
<div class="card"><p class="ct">Hosting company</p><p>The platform or host behind the site: Shopify, Wix, WP Engine, Amazon, OVH, IONOS, a UK host and so on.</p></div>
<div class="card"><p class="ct">IP addresses</p><p>Every IPv4 and IPv6 address, who owns each network, its address range and the country it's registered in.</p></div>
<div class="card"><p class="ct">CDN and reverse DNS</p><p>Whether Cloudflare or another CDN sits in front, and the server's own name from reverse DNS, which often names the host.</p></div>
</div>
<h2>Why find out who hosts a website?</h2>
<ul><li><strong>Moving a site.</strong> Lost track of where your own site lives? Find the host before your renewal or before you change anything.</li><li><strong>Reporting abuse.</strong> A copy of your content, a scam page or spam: the host is who to contact, through their abuse address.</li><li><strong>Checking a supplier.</strong> See whether a web designer hosts sites themselves or on a big platform, and whether the server is in the UK.</li><li><strong>Speed.</strong> A server on the other side of the world, with no CDN, makes every first visit slower for UK customers.</li></ul>
<h2>Does hosting affect SEO?</h2>
<p>Indirectly. Google doesn't rank sites higher for a particular host, but a slow or unreliable server hurts: pages load slower, Google crawls less when the server struggles, and downtime can drop pages from results. Server location matters far less than it used to, especially with a CDN. Test real speed with the <a href="/page-speed-checker">page speed checker</a>, and see the whole set-up with the <a href="/website-technology-checker">website technology checker</a>.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>The host behind a CDN.</strong> Cloudflare, Fastly and similar services answer for the site, so the IP addresses belong to them. That's what they're designed to do, and we don't try to get around it.</li><li><strong>The exact data centre.</strong> The country is where the IP address is registered, which is usually, but not always, where the server is.</li><li><strong>Resellers.</strong> Many small hosts rent servers from bigger companies, so the network owner may be the company behind your host.</li></ul>`,
    faqs: [["Is the hosting checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Why does it say Cloudflare?", "The site uses Cloudflare as a CDN and security layer, so visitors (and we) only ever see Cloudflare's addresses. The real host is hidden on purpose; the site owner can see it in their Cloudflare account."], ["How do I find who hosts my email?", "Email can be hosted somewhere else. The DNS lookup shows the MX records, and the website technology checker names the email provider."], ["Can I find other sites on the same server?", "Not with this tool. Many hosts put thousands of sites on one address, and a reliable list needs a full scan of the internet."]],
  },
  {
    path: "/ssl-checker", crumb: "SSL checker", parent: ["/seo-tools", "SEO tools"], title: "SSL Checker | Check a Site's Certificate & HTTPS Free",
    desc: "Free SSL checker: see if a website's certificate is trusted, when it expires and who issued it, whether http redirects to https, HSTS and any mixed content.",
    h1: "SSL certificate checker", eyebrow: "Any website · Free · No sign-up", app: "XKey SSL checker", form: "ssl",
    lead: "Type a domain to check its SSL (TLS) certificate and https set-up: whether browsers trust it, when it expires, and anything on the page still loading insecurely.",
    sections: `<h2>What the SSL checker tests</h2>
<div class="grid">
<div class="card"><p class="ct">Trusted certificate</p><p>We connect over https like a browser. If the certificate is missing, expired or for the wrong name, the connection fails and we tell you.</p></div>
<div class="card"><p class="ct">Expiry and issuer</p><p>Who issued the certificate, the date it runs out and the names it covers, with a warning three weeks before expiry.</p></div>
<div class="card"><p class="ct">Redirects and HSTS</p><p>Whether http:// sends people to https://, and whether HSTS tells browsers to always use https.</p></div>
<div class="card"><p class="ct">Mixed content</p><p>Images, scripts and stylesheets on the page still loaded over http://, which browsers block or flag as "Not secure".</p></div>
</div>
<h2>Does SSL affect SEO?</h2>
<p>Yes, in two ways. Google has used https as a ranking signal since 2014, and Chrome labels any page without it "Not secure", which puts visitors off. An expired certificate is worse: browsers show a full-page warning and almost everyone leaves. Most hosts now give free certificates from Let's Encrypt that renew automatically, so the usual problems are a renewal that silently failed, a missing redirect from http, or old http:// image links.</p>
<h2>How to fix common SSL problems</h2>
<ul><li><strong>Expired or about to expire:</strong> renew in your hosting control panel, and check automatic renewal is switched on.</li><li><strong>Wrong name:</strong> the certificate must cover both yourbusiness.co.uk and www.yourbusiness.co.uk. Ask your host to add the missing name.</li><li><strong>No redirect:</strong> add a 301 redirect from http:// to https:// (most hosts have a "force https" switch), then test it with the <a href="/redirect-checker">redirect checker</a>.</li><li><strong>Mixed content:</strong> change each http:// address in your pages to https://. On WordPress, a search-and-replace plugin fixes old links in one go.</li></ul>
<h2>What it can't tell you</h2>
<p>Workers can't read the certificate a server hands over, so the issuer and dates come from the public Certificate Transparency logs, which record every certificate browsers will trust. A site with several certificates may be using a different one from the newest we show. We check the home page for mixed content, not every page.</p>`,
    faqs: [["Is the SSL checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["What's the difference between SSL and TLS?", "TLS is the modern version of SSL. Everyone still says SSL certificate, but every secure site today uses TLS."], ["How long does an SSL certificate last?", "Free Let's Encrypt certificates last 90 days and renew automatically. Paid ones last up to a year, and browsers are moving to shorter lifetimes."], ["Do I need to pay for an SSL certificate?", "Not for a normal business website. A free certificate gives exactly the same padlock and encryption as a paid one."]],
  },
  {
    path: "/utm-builder", crumb: "UTM link builder", parent: ["/seo-tools", "SEO tools"], title: "UTM Builder | Free Campaign URL Builder for GA4",
    desc: "Free UTM builder: add utm_source, utm_medium and utm_campaign to any link so Google Analytics 4 shows which posts, emails and ads bring visitors.",
    h1: "UTM link builder", eyebrow: "Instant tool · Unlimited", app: "XKey UTM builder", form: "utm",
    lead: "Fill in where a link will be shared, and copy a tracking link that tells Google Analytics exactly where each visitor came from.",
    sections: `<h2>What are UTM tags?</h2>
<p>UTM tags are extra bits at the end of a link, such as <code>?utm_source=facebook&amp;utm_medium=social</code>. They don't change the page people see, but Google Analytics reads them and files the visit under that source, medium and campaign. Without them, a click from your newsletter or a WhatsApp group often shows up as "direct", and you can't tell what worked.</p>
<h2>Which fields should I fill in?</h2>
<ul><li><strong>Source</strong> – the site or list the link sits on: facebook, instagram, newsletter, google.</li><li><strong>Medium</strong> – the kind of link: social, email, cpc (paid ads), qr, print. GA4 groups visits into channels from this, so stick to common values.</li><li><strong>Campaign</strong> – your name for the push: spring-sale, boiler-offer-2026.</li><li><strong>Term and content</strong> – optional. Term is for paid keywords; content tells two links in the same email or post apart.</li></ul>
<h2>Rules that keep your reports clean</h2>
<ul><li>Use lower case every time. Analytics treats Facebook and facebook as two different sources.</li><li>Never add UTM tags to links between your own pages. They start a new visit and wipe out where the person really came from.</li><li>Google Ads tags its own links automatically. Only add UTMs there if you've turned auto-tagging off.</li><li>Keep a simple list of the names you use, so the whole team tags links the same way.</li></ul>
<p>Everything runs in your browser, so you can build as many links as you like. Track what those visitors do next with your <a href="/seo-monitoring">weekly SEO monitoring</a>.</p>`,
    faqs: [["Is the UTM builder free?", "Yes, and unlimited. It runs entirely in your browser, with no sign-up and nothing sent to us."], ["Do UTM tags affect SEO?", "Not if you only use them on links from other places, such as social posts and emails. Don't use them on internal links, and keep a canonical tag on your pages so Google indexes the clean address."], ["Where do I see UTM results?", "In Google Analytics 4, under Reports → Acquisition → Traffic acquisition. Switch the dimension to Session source / medium or Session campaign."], ["Can I shorten a UTM link?", "Yes. Any link shortener keeps the tags; the full address opens behind the short one."]],
  },
  {
    path: "/url-slug-generator", crumb: "URL slug generator", parent: ["/seo-tools", "SEO tools"], title: "URL Slug Generator | SEO-Friendly Slugs Free",
    desc: "Free URL slug generator: turn page titles into short, lower-case, hyphenated addresses that are easy to read and share, with accents and symbols cleaned up.",
    h1: "URL slug generator", eyebrow: "Instant tool · Unlimited", app: "XKey URL slug generator", form: "slug",
    lead: "Paste page titles, one per line, and get clean URL slugs: lower case, hyphens between words, accents and symbols removed, trimmed to a sensible length.",
    sections: `<h2>What makes a good URL slug?</h2>
<p>The slug is the part of the address after the domain, such as <code>/boiler-service-blackpool</code>. Google shows it in results and uses the words in it as a small clue to what the page is about. People read it too, before they click and when they share a link.</p>
<ul><li><strong>Short and descriptive.</strong> Three to five words that say what the page is. Drop dates and numbers that will go out of date.</li><li><strong>Lower case with hyphens.</strong> Google treats hyphens as spaces between words. Underscores join words together.</li><li><strong>No accents, symbols or spaces.</strong> They turn into ugly codes like %C3%A9 when the link is copied.</li><li><strong>Your main keyword once.</strong> Never stuff it in twice.</li></ul>
<h2>Should I change old URLs to match?</h2>
<p>Usually not. A page's address carries its history in Google, and changing it without a 301 redirect throws that away. Use good slugs for new pages. If you must change an old one, redirect the old address to the new one and check it with the <a href="/redirect-checker">redirect checker</a>.</p>
<h2>How this generator cleans text</h2>
<p>It swaps accented letters for plain ones (é → e, ß → ss), turns &amp; into "and", removes apostrophes so "Blackpool's" becomes "blackpools", replaces everything else with hyphens and trims at a whole word. Tick "remove small words" to drop a, the, and, of and similar. Everything happens in your browser.</p>`,
    faqs: [["Is the slug generator free?", "Yes, and unlimited. It runs in your browser with no sign-up."], ["How long should a URL slug be?", "As short as it can be while still describing the page. Most good slugs are under 60 characters, and many are under 30."], ["Should I remove stop words from slugs?", "It's optional. Removing them makes slugs shorter, but keep them if the slug reads oddly without them."], ["Does WordPress make slugs automatically?", "Yes, from the title, but it keeps every word. Edit the slug in the page settings before you publish – changing it later needs a redirect."]],
  },
  {
    path: "/case-converter", crumb: "Case converter", parent: ["/seo-tools", "SEO tools"], title: "Case Converter | Sentence, Title, Upper & Lower Case",
    desc: "Free case converter: change text to sentence case, Title Case, UPPER CASE, lower case, camelCase, snake_case or kebab-case in one click, then copy it.",
    h1: "Case converter", eyebrow: "Instant tool · Unlimited", app: "XKey case converter", form: "caseconv",
    lead: "Paste your text, pick a case and copy the result. Handy for headings, page titles, product names and anything typed with Caps Lock on.",
    sections: `<h2>Which case should I use?</h2>
<ul><li><strong>Sentence case</strong> – only the first word and names have capitals. Easiest to read; Google's own style and most UK websites use it for headings.</li><li><strong>Title Case</strong> – main words capitalised, small words like "and", "of" and "the" left lower case. Common for page titles and book-style headings.</li><li><strong>Capitalise Each Word</strong> – every word starts with a capital, small words included.</li><li><strong>UPPER CASE</strong> – use sparingly. Whole sentences in capitals read as shouting and are harder to scan.</li><li><strong>camelCase, snake_case and kebab-case</strong> – for code, file names and URLs. kebab-case is the format for page addresses; try the <a href="/url-slug-generator">URL slug generator</a> for those.</li></ul>
<h2>Does letter case matter for SEO?</h2>
<p>Not for rankings: Google ignores case when it matches searches. It matters for clicks. A title in sentence or title case looks tidier in search results than one in capitals, and Google sometimes rewrites shouty titles. Check how yours will look with the <a href="/title-tag-checker">title tag checker</a>. Case does matter in page addresses: /Contact and /contact can be two different pages, so keep URLs in lower case.</p>
<h2>How the title case works</h2>
<p>Every word is capitalised except short joining words (a, an, and, as, at, but, by, for, in, of, on, or, the, to, up, via, with) unless they start or end the line. Sentence case also capitalises the word "I" and the first word after a full stop, question mark or exclamation mark. Names in the middle of a sentence aren't known to us, so check those by eye.</p>`,
    faqs: [["Is the case converter free?", "Yes, and unlimited. It runs in your browser, with no sign-up and nothing sent to us."], ["Can I undo a conversion?", "Press Ctrl+Z (Cmd+Z on a Mac) in the text box. Converting to lower case and back can't restore capitals on names, so keep a copy of the original."], ["Does it work with other languages?", "Yes for upper, lower and sentence case in any language with capital letters. The small-word list for title case is English."], ["Is there a limit on text length?", "No fixed limit. Very long documents work, though your browser may slow down past a few hundred thousand words."]],
  },
  {
    path: "/website-technology-checker", crumb: "Website technology checker", parent: ["/seo-tools", "SEO tools"], title: "Website Technology Checker | What's This Site Built With?",
    desc: "Free website technology checker: see the CMS or website builder, theme, plugins, analytics, hosting, email provider and more behind any website. No sign-up.",
    h1: "What is this website built with?", eyebrow: "Any website · Free · No sign-up", app: "XKey website technology checker", form: "tech",
    lead: "Type any web address to see the technology behind it: the website builder or CMS, the theme, plugins, analytics and tracking, cookie banner, hosting and who handles its email.",
    sections: `<h2>What the technology checker finds</h2>
<div class="grid">
<div class="card"><p class="ct">Platform and theme</p><p>WordPress, Shopify, Wix, Squarespace, Webflow and dozens more, with the WordPress or Shopify theme name and the page builder.</p></div>
<div class="card"><p class="ct">Plugins and tools</p><p>SEO plugins such as Yoast and Rank Math, forms, caching, live chat, reviews, booking and payment providers.</p></div>
<div class="card"><p class="ct">Tracking and marketing</p><p>Google Analytics 4, Tag Manager, Meta Pixel, Google Ads, Hotjar, email marketing tools and the cookie banner.</p></div>
<div class="card"><p class="ct">Hosting, email and DNS</p><p>The CDN or host (Cloudflare, WP Engine, Vercel…), the web server, the email provider and who runs the DNS.</p></div>
</div>
<h2>Why check what a website is built with?</h2>
<ul><li><strong>Researching competitors.</strong> See which platform, booking system and review widget a successful rival uses, and whether they advertise on Google, Facebook or TikTok.</li><li><strong>Choosing a platform.</strong> Find a site you like and check whether it's WordPress, Shopify or a builder such as Wix before you commit to the same.</li><li><strong>Taking over a website.</strong> New to a business, or a web designer picking up a client? Find out what the site runs on before you get the logins.</li><li><strong>Checking your own site.</strong> Spot leftovers such as old Universal Analytics code that no longer records anything, or tracking tags with no cookie banner.</li></ul>
<h2>Does the platform affect SEO?</h2>
<p>Any of the big platforms can rank well. What matters more is how the site is set up: unique titles and descriptions, fast pages, clean addresses and helpful content. Each platform keeps those settings in a different place, so if your site is on WordPress, Wix, Squarespace or Shopify, the checker links to our step-by-step SEO guide for it. Then run the <a href="/">free SEO check</a> for a report with fix steps for your builder.</p>
<h2>How it works, and what it can't see</h2>
<p>We load the page once, as a normal browser would, and look for the fingerprints each technology leaves: file paths, script addresses, generator tags, response headers and cookies. We also read the domain's public DNS records for its email provider, DNS host and the services it has verified. We don't guess. If something leaves no trace, it isn't listed, so:</p>
<ul><li>Server-side software that hides itself (most databases, and the language behind many sites) can't be seen.</li><li>Tools loaded only after you accept cookies, or only on other pages such as checkout, may not show. Check those pages too.</li><li>Sites behind bot protection may only reveal their hosting and DNS.</li></ul>`,
    faqs: [["Is the website technology checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Can it tell which WordPress theme a site uses?", "Usually. It reads the theme folder name from the page's code, and shows the parent and child theme if there are both. Some security plugins rename or hide it."], ["How do I tell if a site is Shopify, Wix or Squarespace?", "Enter its address above. Each builder loads files from its own servers (cdn.shopify.com, static.wixstatic.com, static1.squarespace.com), so the checker can tell them apart even on a custom domain."], ["Why is a tool I know a site uses not listed?", "It may load only after cookie consent, only on some pages, or be one we don't recognise yet. We only list what we can actually see on the page you entered."]],
  },
  {
    path: "/dns-lookup", crumb: "DNS lookup", parent: ["/seo-tools", "SEO tools"], title: "DNS Lookup | Check A, MX, TXT & NS Records Free",
    desc: "Free DNS lookup: see a domain's A, AAAA, CNAME, MX, NS, TXT, CAA and SOA records, and check its website, www version, SPF and DMARC in one go.",
    h1: "Free DNS lookup", eyebrow: "Any domain · Free · No sign-up", app: "XKey DNS lookup", form: "dns",
    lead: "Type a domain to see every main DNS record – where the website points, who handles its email and what TXT records it has – with plain-English checks on what's missing.",
    sections: `<h2>What the DNS lookup shows</h2>
<div class="grid">
<div class="card"><p class="ct">Website records</p><p>A and AAAA (the server's address), CNAME aliases, and whether the www version works too.</p></div>
<div class="card"><p class="ct">Email records</p><p>MX servers, the SPF record and the DMARC policy, with a warning if anything is missing or wrong.</p></div>
<div class="card"><p class="ct">Everything else</p><p>NS (who runs the DNS), TXT (verification codes), CAA (who may issue SSL certificates), SOA and DNSSEC.</p></div>
</div>
<h2>Which DNS records matter for SEO?</h2>
<ul><li><strong>A, AAAA and CNAME</strong> – if these are wrong or missing, nobody can reach the site, Google included. After a move to a new host, check they point at the new server.</li><li><strong>www and non-www</strong> – both should resolve, and one should 301-redirect to the other. Check that with the <a href="/redirect-checker">redirect checker</a>.</li><li><strong>TXT records</strong> – Google Search Console can verify your site with a TXT record, which covers every version of the domain at once.</li><li><strong>NS records</strong> – show which company runs your DNS. Fast, reliable DNS helps every page load a little quicker.</li></ul>
<h2>SPF and DMARC</h2>
<p>They don't affect rankings, but they decide whether your emails reach the inbox. <strong>SPF</strong> lists the servers allowed to send email for your domain, and there must be only one SPF record. <strong>DMARC</strong> tells receiving servers what to do with email that fails those checks. Since 2024, Gmail and Yahoo expect both from anyone sending email in bulk. For more detail, use the <a href="/spf-checker">SPF checker</a>, which follows every include, and the <a href="/dmarc-checker">DMARC checker</a>.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>Changes made in the last few minutes or hours.</strong> We ask public resolvers (Cloudflare's 1.1.1.1, with Google as a backup), which may hold the old answer until its TTL runs out.</li><li><strong>DKIM.</strong> DKIM keys live under a "selector" name only your email provider knows. The <a href="/dkim-checker">DKIM checker</a> tries the common ones, or the one you enter.</li><li><strong>Private or internal names</strong> that only resolve inside your network.</li></ul>`,
    faqs: [["Is the DNS lookup free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["How long do DNS changes take?", "Usually minutes, but resolvers can keep an old answer for as long as its TTL (time to live), shown next to every record. Lower the TTL a day before a planned move."], ["Why does my site work but show no A record?", "Check you typed the exact address people use. The site may run on www only, which is a CNAME to your host – the lookup shows www separately."], ["Do DNS settings affect SEO?", "Only indirectly: if DNS fails, Google can't reach your pages, and slow DNS adds a little to every first visit."]],
  },
  {
    path: "/mx-lookup", crumb: "MX lookup", parent: ["/seo-tools", "SEO tools"], title: "MX Lookup | Check a Domain's Mail Servers Free",
    desc: "Free MX lookup: see which mail servers receive email for any domain, in priority order, who provides them and whether each one resolves.",
    h1: "Free MX record lookup", eyebrow: "Any domain · Free · No sign-up", app: "XKey MX lookup", form: "email", emailType: "mx",
    lead: "Type a domain to see where its email goes: every MX record in priority order, the email provider behind it and whether each mail server actually resolves.",
    sections: `<h2>What is an MX record?</h2>
<p>MX (mail exchanger) records tell the rest of the internet which servers accept email for your domain. When someone emails you@yourbusiness.co.uk, their server looks up your MX records and delivers to the one with the lowest priority number, trying the next one if it doesn't answer. No MX records means no email.</p>
<h2>What the lookup checks</h2>
<div class="grid">
<div class="card"><p class="ct">Every mail server</p><p>Each MX record with its priority, so you can see which server is tried first and which are backups.</p></div>
<div class="card"><p class="ct">The provider</p><p>Google Workspace, Microsoft 365, Zoho, IONOS, 123 Reg and other common providers are named, so you know who handles the email.</p></div>
<div class="card"><p class="ct">Does it resolve?</p><p>An MX record pointing at a name with no IP address, or at a bare IP address, makes email bounce. We test each one.</p></div>
</div>
<h2>Moving email to a new provider</h2>
<ul><li><strong>Add the new provider's MX records</strong> exactly as they give them, and remove the old ones, or some email will keep going to the old mailbox.</li><li><strong>Update SPF</strong> to include the new provider, then check it with the <a href="/spf-checker">SPF checker</a>.</li><li><strong>Set up DKIM</strong> in the new provider's admin panel and test it with the <a href="/dkim-checker">DKIM checker</a>.</li><li><strong>Leave the website alone.</strong> MX records only affect email; your A and CNAME records (see the <a href="/dns-lookup">DNS lookup</a>) decide where the website loads.</li></ul>
<h2>What it can't tell you</h2>
<p>We read public DNS through Cloudflare's and Google's resolvers, which may keep an old answer for as long as the record's TTL after a change. We don't connect to the mail servers or send test email, so a server that resolves but refuses mail will still look fine here.</p>`,
    faqs: [["Is the MX lookup free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["What does MX priority mean?", "Lower numbers are tried first. Two records with the same number share the load; a higher number is a backup used only when the others don't answer."], ["Do MX records affect SEO?", "No. They only decide where email is delivered. Your website's DNS records are separate."], ["How long do MX changes take?", "Usually under an hour, but the old records can be remembered for as long as their TTL. Lower the TTL a day before you switch provider."]],
  },
  {
    path: "/spf-checker", crumb: "SPF checker", parent: ["/seo-tools", "SEO tools"], title: "SPF Record Checker | Validate Includes & Lookups Free",
    desc: "Free SPF checker: read any domain's SPF record, follow every include, count the 10 DNS lookups and spot +all, duplicate records and broken includes.",
    h1: "SPF record checker", eyebrow: "Any domain · Free · No sign-up", app: "XKey SPF checker", form: "email", emailType: "spf",
    lead: "Type a domain to read its SPF record, see every service allowed to send email as it, and check it stays within the 10 DNS lookups SPF allows.",
    sections: `<h2>What is SPF?</h2>
<p>SPF (Sender Policy Framework) is a TXT record, starting <code>v=spf1</code>, that lists the servers allowed to send email for your domain. Receiving servers check it on every email: mail from a server that isn't listed is marked as suspicious or rejected, which stops others faking your address and keeps your own email out of spam.</p>
<h2>What the SPF checker tests</h2>
<div class="grid">
<div class="card"><p class="ct">One record only</p><p>Two SPF records is a common mistake after adding a new service. It breaks SPF completely, so we flag it first.</p></div>
<div class="card"><p class="ct">The 10-lookup limit</p><p>We follow every include down the chain and count the lookups. Over 10 and SPF fails for every email.</p></div>
<div class="card"><p class="ct">How it ends</p><p>~all and -all protect you; +all and ?all let anyone send as you. We explain which you have.</p></div>
<div class="card"><p class="ct">Broken includes</p><p>An include for a service you've left, or a typo, points at a domain with no SPF record and breaks the whole check.</p></div>
</div>
<h2>How to read an SPF record</h2>
<ul><li><strong>include:_spf.google.com</strong> allows a service's servers (here Google Workspace). Each include uses at least one lookup.</li><li><strong>ip4:</strong> and <strong>ip6:</strong> allow one address or a range, and cost nothing.</li><li><strong>a</strong> and <strong>mx</strong> allow your website's server and your mail servers.</li><li><strong>~all</strong> at the end means "anything else is probably fake"; <strong>-all</strong> means "reject anything else".</li></ul>
<h2>Too many DNS lookups?</h2>
<p>Remove includes for services you no longer use first. Then check whether a service needs an include at all: many marketing tools send from their own domain and only need DKIM. Replacing an include with the ip4: ranges it contains also works, but the ranges can change without warning, so only do it for your own servers.</p>
<h2>What it can't tell you</h2>
<p>We check the record your domain publishes, not a particular email. To see whether one email passed, open it and look at the Authentication-Results header. SPF alone isn't enough any more: add <a href="/dkim-checker">DKIM</a> and a <a href="/dmarc-checker">DMARC</a> policy too.</p>`,
    faqs: [["Is the SPF checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Can I have two SPF records?", "No. A domain must have exactly one record starting v=spf1. Merge them by putting every include and ip4 into one record with one all at the end."], ["Should I use ~all or -all?", "~all is the safe choice while you check every service that sends email for you. Once DMARC reports show nothing legitimate failing, -all is stricter."], ["Does SPF affect SEO?", "No, it only affects email delivery. It matters for your business, though: without it, quotes and invoices are more likely to land in spam."]],
  },
  {
    path: "/dmarc-checker", crumb: "DMARC checker", parent: ["/seo-tools", "SEO tools"], title: "DMARC Checker | Look Up Any Domain's Policy Free",
    desc: "Free DMARC checker: look up any domain's DMARC record, see its policy tag by tag, check the reporting address and how to move from p=none to reject.",
    h1: "DMARC record checker", eyebrow: "Any domain · Free · No sign-up", app: "XKey DMARC checker", form: "email", emailType: "dmarc",
    lead: "Type a domain to look up its DMARC record, see what each tag means and whether it actually stops fake email being sent in your name.",
    sections: `<h2>What is DMARC?</h2>
<p>DMARC is a TXT record at <code>_dmarc.yourbusiness.co.uk</code> that tells receiving servers what to do with email claiming to be from you that fails SPF and DKIM: deliver it anyway (<code>p=none</code>), send it to spam (<code>p=quarantine</code>) or refuse it (<code>p=reject</code>). It also asks them to send you reports, so you can see every server sending email in your name.</p>
<h2>Why it matters now</h2>
<p>Since February 2024, Gmail and Yahoo require a DMARC record from anyone sending large amounts of email, and Microsoft followed in 2025. Without one, phishing email using your domain can reach your customers, and your own messages are more likely to be filtered.</p>
<h2>From p=none to p=reject, safely</h2>
<ul><li><strong>Start with p=none and a rua= address.</strong> Nothing is blocked; you just get daily reports.</li><li><strong>Read the reports for a few weeks.</strong> Make sure every service that sends for you (your mailbox, website forms, invoicing, newsletters) passes SPF or DKIM. Fix them with the <a href="/spf-checker">SPF checker</a> and <a href="/dkim-checker">DKIM checker</a>.</li><li><strong>Move to p=quarantine</strong>, optionally with pct=25 to start with a quarter of failing email.</li><li><strong>Finish at p=reject</strong> once nothing legitimate is failing.</li></ul>
<h2>What the checker looks at</h2>
<p>We find the record (on the parent domain too, for subdomains), check there is exactly one, that the policy is valid, what it means for subdomains and whether reports are sent anywhere. Every tag is explained in plain English. We read the published record only; we can't see the reports, which go to the address in rua=.</p>`,
    faqs: [["Is the DMARC checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Is p=none bad?", "It's the right place to start, but it protects nothing: fake email is still delivered. Treat it as a step towards quarantine and reject."], ["Where do I add a DMARC record?", "In your DNS, as a TXT record with the name _dmarc and a value starting v=DMARC1; – at the company that runs your DNS, which may not be your email provider."], ["Does DMARC need SPF and DKIM?", "Yes. DMARC passes when SPF or DKIM passes for your own domain, so set both up first, then add DMARC."]],
  },
  {
    path: "/dkim-checker", crumb: "DKIM checker", parent: ["/seo-tools", "SEO tools"], title: "DKIM Checker | Look Up Selectors & Key Size Free",
    desc: "Free DKIM checker: find a domain's DKIM keys under common selectors or the one you enter, see the key type and size, and spot revoked or weak keys.",
    h1: "DKIM record checker", eyebrow: "Any domain · Free · No sign-up", app: "XKey DKIM checker", form: "email", emailType: "dkim",
    lead: "Type a domain, and its DKIM selector if you know it, to find the public key receiving servers use to check your email's signature.",
    sections: `<h2>What is DKIM?</h2>
<p>DKIM (DomainKeys Identified Mail) adds a digital signature to every email you send. Receiving servers check it against a public key published in your DNS, at <code>selector._domainkey.yourbusiness.co.uk</code>. If the signature matches, they know the email really came from you and wasn't changed on the way, which helps it reach the inbox and lets DMARC pass.</p>
<h2>What is a DKIM selector?</h2>
<p>The selector is the first part of the record's name, so a domain can have several keys at once – one per email service, or old and new keys during a change. Google Workspace uses <code>google</code>, Microsoft 365 uses <code>selector1</code> and <code>selector2</code>, and other services choose their own. If you leave the selector blank, we try the common ones. To find yours for certain, open an email you sent, view the original message and look for <code>s=</code> in the DKIM-Signature header.</p>
<h2>What the checker tests</h2>
<ul><li><strong>Whether the key exists</strong> under the selector, following any CNAME your provider asked you to add.</li><li><strong>Key type and size.</strong> 2048-bit RSA is the standard; 1024-bit still works but should be replaced, and anything smaller is rejected by many receivers.</li><li><strong>Revoked keys</strong> (an empty p=), which make every email signed with that selector fail.</li><li><strong>Testing mode</strong> (t=y), which asks receivers to go easy on failures.</li></ul>
<h2>Setting up DKIM</h2>
<p>Switch it on in your email provider's admin panel (Google Workspace: Apps, Gmail, Authenticate email; Microsoft 365: the Defender portal). It gives you one or two records to add to your DNS. Do the same for every other service that sends email as you, such as newsletters and invoicing, then add a <a href="/dmarc-checker">DMARC</a> policy.</p>
<h2>What it can't tell you</h2>
<p>We can't list every selector a domain has: DNS doesn't allow it, so a key under an unusual selector won't show until you enter it. We check the published key, not whether a particular email was signed correctly.</p>`,
    faqs: [["Is the DKIM checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Why does it say no DKIM key found?", "Your provider probably uses a selector we didn't try. Find it in the s= part of the DKIM-Signature header of an email you've sent, enter it and check again."], ["Should I use a 2048-bit key?", "Yes. It's the current recommendation and every major provider supports it. Some DNS hosts need the long key split into two quoted strings, which is fine."], ["Do I need DKIM if I have SPF?", "Yes. SPF breaks when email is forwarded, but a DKIM signature survives, and Gmail and Yahoo now expect both from bulk senders."]],
  },
  {
    path: "/domain-age-checker", crumb: "Domain age checker", parent: ["/seo-tools", "SEO tools"], title: "Domain Age Checker | Bulk, Free, No Sign-Up",
    desc: "Free bulk domain age checker: see when up to 100 domains were first registered, how old they are, when they expire and who they're registered with.",
    h1: "Free domain age checker", eyebrow: "Bulk · Free · No sign-up", app: "XKey domain age checker", form: "domainage",
    lead: "Paste up to 100 domains and see how old each one is, straight from the registries' own records. Works for .co.uk, .com and most other endings. No account, no email.",
    sections: `<h2>What the domain age checker shows</h2>
<div class="grid">
<div class="card"><p class="ct">Domain age</p><p>Years and months since the domain was first registered.</p></div>
<div class="card"><p class="ct">Registered and expiry dates</p><p>The exact dates from the registry, and how long is left before renewal.</p></div>
<div class="card"><p class="ct">Registrar</p><p>The company the domain is registered through. Open any domain for its full WHOIS record.</p></div>
</div>
<p>Sort by age, download the results as a CSV, and spot domains that are about to expire or aren't registered at all.</p>
<h2>Where does the data come from?</h2>
<p>Straight from the registry that runs each ending – Nominet for .uk, Verisign for .com and .net, and so on – using <strong>RDAP</strong>, the official replacement for WHOIS. For the few endings whose registry hasn't moved to RDAP yet (such as .de, .eu and .it) we ask the registry's WHOIS server instead. Nothing is estimated and nothing comes from a third-party database, so the dates are the same ones the registry holds.</p>
<h2>Does domain age matter for SEO?</h2>
<p>Not directly. Google has said for years that a domain's age on its own isn't a ranking factor. What older domains usually have is a history: more links built up over time, more content and more trust from visitors. A brand-new domain can rank well with good pages and genuine links; an old one with nothing on it won't. Check the links themselves with the <a href="/domain-authority-checker">domain authority checker</a>.</p>
<h2>Good uses for a domain age check</h2>
<ul><li><strong>Vet a link or a partner.</strong> A site claiming twenty years in business on a domain registered last month is worth a second look.</li><li><strong>Size up competitors.</strong> See how long the sites ranking above you have been around, alongside their <a href="/backlink-checker">backlinks</a>.</li><li><strong>Buying an expired or second-hand domain.</strong> Check its age and registrar first – then check it isn't carrying spam links.</li><li><strong>Don't lose your own.</strong> An expired domain takes your website and email down with it. Check your expiry date and turn on auto-renew.</li></ul>
<h2>What it can't tell you</h2>
<ul><li><strong>Gaps in ownership.</strong> The registered date is when the current registration began. If a domain expired and was registered again, the age starts from the new date, and earlier owners aren't shown.</li><li><strong>Some endings don't publish dates.</strong> A few registries, such as DENIC for .de and EURid for .eu, don't make registration dates public. We say so rather than guess.</li><li><strong>Owners' names and addresses.</strong> Since GDPR, registries hide personal details. You'll see the registrar, not the person.</li></ul>`,
    faqs: [["Is the domain age checker free?", "Yes. No sign-up, no email and no subscription. You can check up to 100 domains at a time, with only a fair-use limit to stop bots."], ["How do I find out how old a website is?", "Type its domain into the checker. The age is counted from the date the registry says the domain was first registered, which is usually close to when the website started."], ["Why does it say a domain isn't registered?", "The registry has no record of it, so it's probably free to buy. Double-check the spelling – a missing letter is the usual reason."], ["Why is a date missing?", "Some registries, such as those for .de and .eu, don't publish registration dates. Everything else about the domain is still shown where the registry provides it."], ["Can I see who owns a domain?", "Usually not. Personal details are hidden for privacy. The WHOIS lookup shows the registrar, who you can contact about a domain."]],
  },
  {
    path: "/whois-lookup", crumb: "WHOIS lookup", parent: ["/seo-tools", "SEO tools"], title: "WHOIS Lookup | Free Domain Registration Check",
    desc: "Free WHOIS lookup for any domain: registrar, registration and expiry dates, name servers, status codes and DNSSEC, straight from the registry.",
    h1: "Free WHOIS lookup", eyebrow: "Any domain · Free · No sign-up", app: "XKey WHOIS lookup", form: "whois",
    lead: "Look up any domain – .co.uk, .com or almost any other ending – and see who it's registered with, when it was registered, when it expires and where its name servers point.",
    sections: `<h2>What a WHOIS lookup shows</h2>
<ul><li><strong>Registrar</strong> – the company the domain is registered through, and the people to contact about it.</li><li><strong>Registered, updated and expiry dates</strong> – how old the domain is and when it must be renewed.</li><li><strong>Name servers</strong> – which DNS service runs the domain, which often tells you the web host.</li><li><strong>Status codes</strong> – whether the domain is locked against transfer, on hold or about to be deleted.</li><li><strong>DNSSEC</strong> – whether the domain's DNS is signed against tampering.</li></ul>
<p>Checking lots of domains? The <a href="/domain-age-checker">domain age checker</a> takes up to 100 at once.</p>
<h2>WHOIS and RDAP</h2>
<p>WHOIS is the old text service registries have used since the 1980s. RDAP is its replacement: the same records in a standard format, and since 2025 the official source for .com and every other generic ending. XKey asks each registry over RDAP where it has it, and falls back to WHOIS for endings that don't (we show the registry's raw WHOIS text when that happens).</p>
<h2>What the status codes mean</h2>
<ul><li><strong>client transfer prohibited</strong> – locked so it can't be moved to another registrar without unlocking first. Normal and good.</li><li><strong>client hold or server hold</strong> – the domain isn't working, often because of an unpaid renewal or a dispute.</li><li><strong>redemption period or pending delete</strong> – the domain has expired. The owner can still get it back for a short time before it's released.</li><li><strong>active or ok</strong> – registered with no restrictions.</li></ul>
<h2>Why can't I see the owner's name?</h2>
<p>Since GDPR in 2018, registries and registrars hide the personal details of domain owners. To reach the owner, contact the registrar shown, or use any contact details on the website itself.</p>`,
    faqs: [["Is this WHOIS lookup free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["How do I check if a domain is available?", "Look it up. If the registry has no record of it, we'll tell you it isn't registered, so you can buy it from any registrar."], ["Why is some information missing?", "Registries publish different amounts. Some don't show registration dates, and personal details are hidden everywhere for privacy."], ["How do I change my domain's WHOIS details?", "Through the registrar you bought it from – they pass changes on to the registry. For .uk domains you can also contact Nominet."]],
  },
  {
    path: "/seo-comparison", crumb: "Competitor comparison", parent: ["/seo-tools", "SEO tools"], title: "Compare Website SEO With Competitors | Free Tool",
    desc: "Free, no sign-up: compare your website's SEO with up to two competitors side by side – score, AI readiness, speed, content and where they beat you.",
    h1: "Compare your SEO with competitors", eyebrow: "Side by side", app: "XKey SEO comparison",
    lead: "Google ranks pages against each other. See how your page scores against two rivals, check by check, and where they're ahead.",
    form: "compare",
    sections: `<h2>What does the comparison show?</h2>
<ul><li>Overall SEO score and AI search readiness for each site</li><li>Scores for every area: indexing, snippets, content, structured data, links, speed, security, mobile</li><li>Words on the page, HTML size and failed checks</li><li><strong>Where competitors beat you</strong> – checks they pass and you don't</li><li><strong>Where you're ahead</strong> – your advantages to keep</li></ul>
<h2>Which competitors should I compare against?</h2>
<p>Compare like with like: your home page against theirs, or your service page against their equivalent service page. Pick competitors who rank above you for the search you want, not simply the biggest names. Then fix the checks they pass and you fail, starting with the most important.</p>`,
    faqs: [["Is the comparison free?", "Yes. Compare up to three sites at a time with no sign-up."], ["Will competitors know I checked their site?", "They aren't notified. Our checker fetches their public page like any automated visit, so at most it shows up as a visit in their server logs."]],
  },
  {
    path: "/seo-monitoring", crumb: "SEO monitoring", parent: ["/seo-tools", "SEO tools"], title: "Free SEO Monitoring | Weekly Website Checks",
    desc: "Free weekly SEO monitoring: XKey re-checks your page every week, tracks the score over time and shows anything that breaks. No account needed.",
    h1: "Free weekly SEO monitoring", eyebrow: "Set and forget", app: "XKey SEO monitoring",
    lead: "Websites break quietly – a plugin update removes a title, a developer adds noindex, a redirect goes missing. Free monitoring re-checks your page every week and shows exactly what changed.",
    form: "monitor",
    sections: `<h2>How does free SEO monitoring work?</h2>
<ol><li>Enter your address below. We run the first check straight away.</li><li>You get a private dashboard link – bookmark it. Anyone with the link can view it, so only share it with people you trust.</li><li>Every week we check again and add the result to your score history graph.</li><li>The dashboard lists new problems and fixed problems since the previous check.</li></ol>
<h2>What does monitoring track?</h2>
<p>The overall score, AI search readiness, each area's score, server response time, word count and the pass/fail status of every individual check – so a single broken item stands out straight away.</p>`,
    faqs: [["Do I need an account?", "No. There's no sign-up and no email – just keep the dashboard link."], ["How often is my site checked?", "Once a week. You can also run an extra check from your dashboard, up to once an hour."], ["How do I stop monitoring?", "Email us your dashboard link and we'll delete the monitor and its history."]],
  },
  {
    path: "/title-tag-checker", crumb: "Title tag checker", parent: ["/seo-tools", "SEO tools"], title: "Free Title Tag & Meta Description Pixel Checker",
    desc: "Check your title tag and meta description length in pixels, as Google measures them. Live preview of your Google result as you type. Free.",
    h1: "Title tag and meta description checker", eyebrow: "Instant tool", app: "XKey title tag checker",
    lead: "Google cuts titles and descriptions by pixel width, not character count. Type below to see exactly how yours will look in search results.",
    form: "title",
    sections: `<h2>How long should a title tag be?</h2>
<p>Google shows roughly <strong>580 pixels</strong> of a title on desktop – about 50 to 60 characters, but wide letters such as W and M use more space than i or l. Titles that run over are cut with an ellipsis, and Google sometimes rewrites titles it considers too long or unhelpful.</p>
<h2>How long should a meta description be?</h2>
<p>Around <strong>990 pixels</strong> on desktop, or roughly 150 to 160 characters. Google often writes its own snippet from your page text when your description doesn't match the search, so write a description that genuinely summarises the page.</p>
<h2>Tips for better titles</h2>
<ul><li>Put the main search phrase near the start.</li><li>Make every title on your site unique.</li><li>Add your town for local services, e.g. "Plumber in Blackpool".</li><li>Avoid repeating the same word and stuffing keywords.</li></ul>
<p>To check the titles on every page of your site at once, run a <a href="/website-audit">website audit</a>.</p>`,
    faqs: [["Why does Google rewrite my title?", "Google may replace a title that's too long, stuffed with keywords, repeated across pages or doesn't match the page – often using your H1 instead. A clear, unique title that describes the page is usually left alone."], ["Does the title tag still matter for SEO?", "Yes. It's one of the strongest on-page signals of what a page is about, and it's the headline people see before deciding whether to click."]],
  },
  {
    path: "/robots-txt-tester", crumb: "robots.txt tester", parent: ["/seo-tools", "SEO tools"], title: "Free robots.txt Tester | Googlebot & AI Crawlers",
    desc: "Free robots.txt tester: paste your rules and test whether Googlebot, Bingbot, GPTBot, ClaudeBot or PerplexityBot can crawl any URL. Google's matching rules.",
    h1: "robots.txt tester", eyebrow: "Instant tool", app: "XKey robots.txt tester",
    lead: "Paste a robots.txt file, choose a crawler and test a URL. We apply Google's documented rules: the most specific matching group, longest matching rule, and Allow winning ties.",
    form: "robots",
    sections: `<h2>How does robots.txt matching work?</h2>
<ul><li><strong>Groups:</strong> a crawler obeys the group that names it most specifically; if none does, it uses the <code>User-agent: *</code> group.</li><li><strong>Longest match wins:</strong> when both an Allow and a Disallow rule match, the longer (more specific) rule applies.</li><li><strong>Ties go to Allow.</strong></li><li><code>*</code> matches any characters and <code>$</code> marks the end of the URL.</li></ul>
<h2>What are the most common robots.txt mistakes?</h2>
<ul><li><code>Disallow: /</code> left over from a development site, blocking everything.</li><li>Blocking CSS and JavaScript, which stops Google rendering the page properly.</li><li>Using robots.txt to hide pages from search – it stops crawling, not indexing. Use <code>noindex</code> instead.</li><li>Blocking AI search crawlers by accident when you only meant to block training crawlers.</li></ul>`,
    faqs: [["Does robots.txt stop a page appearing in Google?", "No – it stops crawling, not indexing. A blocked page can still be indexed from links pointing to it, just without a description. To keep a page out of Google, allow crawling and add a noindex tag."], ["Where does robots.txt go?", "At the root of your domain, e.g. yoursite.co.uk/robots.txt. Each subdomain needs its own file."]],
  },
  {
    path: "/llms-txt-generator", crumb: "llms.txt generator", parent: ["/seo-tools", "SEO tools"], title: "llms.txt Generator | Free Tool for AI Search",
    desc: "Free llms.txt generator: create an llms.txt file that gives ChatGPT, Claude and other AI tools a clear summary of your website and its key pages.",
    h1: "llms.txt generator", eyebrow: "Instant tool", app: "XKey llms.txt generator",
    lead: "Fill in a few details and copy a ready-made llms.txt file. Upload it to the root of your website (yoursite.co.uk/llms.txt).",
    form: "llms",
    sections: `<h2>What is llms.txt?</h2>
<p>llms.txt is a proposed standard: a short Markdown file at the root of your website that summarises who you are and links to your most useful pages, so large language models can understand your site without wading through menus and scripts. It sits alongside robots.txt and sitemap.xml.</p>
<h2>Does llms.txt improve rankings?</h2>
<p>Be wary of anyone who says it does. No major AI provider has confirmed using it as a ranking signal. It's quick to add and can help tools that read it, so it's worth five minutes – but crawl access, clear content and structured data matter far more. Check those with the <a href="/ai-seo-checker">AI SEO checker</a>.</p>
<h2>What should llms.txt include?</h2>
<ul><li>A one-line summary of the business.</li><li>Your main services or products, with links.</li><li>Key information pages: pricing, contact, about.</li><li>Keep it short – it's a map, not a copy of your site.</li></ul>`,
    faqs: [["Where do I put llms.txt?", "In the root of your website so it loads at yoursite.co.uk/llms.txt as plain text – the same place as robots.txt."]],
  },
  toolPage("/mobile-friendly-test", "Mobile-friendly test", "Mobile-Friendly Test | Free Alternative to Google's Tool",
    "Free mobile-friendly test: check your page's viewport, tap targets, readability and mobile speed. A free alternative now Google's own test has closed.",
    "Mobile-friendly test", "Google retired its Mobile-Friendly Test in December 2023, but mobile still matters more than ever: Google indexes the mobile version of your site. Check yours below.",
    "mobile-accessibility", "XKey mobile-friendly test",
    `<h2>What makes a page mobile friendly?</h2>
<ul><li>A viewport tag set to the device width, without blocking pinch-zoom.</li><li>Text that's readable without zooming, and buttons large enough to tap with a thumb.</li><li>No content wider than the screen, so nobody has to scroll sideways.</li><li>Fast loading on a mobile connection – see the real-world speed section of your report.</li><li>Tap-to-call or tap-to-email links so visitors can contact you instantly.</li></ul>
<h2>Why Google closed its test – and what to use instead</h2>
<p>Google pointed site owners to Lighthouse and Search Console instead. XKey combines a mobile checklist with Lighthouse's mobile performance data from Google PageSpeed Insights, so you get both in one report. Your results open at the <strong>Mobile &amp; accessibility</strong> section.</p>`,
    [["Is mobile-first indexing still a thing?", "Yes. Google uses the mobile version of your pages for indexing and ranking, so anything missing on mobile is effectively missing for Google."]]),
  {
    path: "/broken-link-checker", crumb: "Broken link checker", parent: ["/seo-tools", "SEO tools"], title: "Free Broken Link Checker | Whole Site, No Sign-Up",
    desc: "Free broken link checker for your whole website: crawls up to 300 pages, tests every link and image, and shows which pages hold each dead link.",
    h1: "Free broken link checker", eyebrow: "Whole site · Free · No sign-up", app: "XKey broken link checker", form: "links",
    lead: "Enter your website and we'll crawl it page by page, test every link and image – to your own pages and to other sites – and list the broken ones with the pages they're on.",
    sections: `<h2>What the broken link checker finds</h2>
<div class="grid">
<div class="card"><p class="ct">Broken links</p><p>Links to pages that return 404, 410 or a server error, or never respond – on your site or anyone else's.</p></div>
<div class="card"><p class="ct">Broken images</p><p>Images that fail to load, so visitors see a gap or a broken icon.</p></div>
<div class="card"><p class="ct">Where to fix them</p><p>Every page each broken link is on, with its link text, so you can find it fast. Download it all as a CSV.</p></div>
</div>
<p>It also lists links that redirect, so you can point them straight at the final address, and links that refused our checker, so you can test those by hand.</p>
<h2>How it works</h2>
<p>Starting from the address you enter, the checker reads each page of your site, follows your internal links to find more pages (up to 300), and tests every link and image it finds (up to 2,500). It respects your robots.txt and waits between pages so your site isn't overloaded. Keep the tab open while it runs – most small sites take a minute or two.</p>
<h2>How do I fix broken links?</h2>
<ol><li>If the page moved, add a 301 redirect from the old address to the new one, then check it with the <a href="/redirect-checker">redirect checker</a>.</li><li>Update your own links to point straight at the new address, so visitors skip the redirect.</li><li>If a page is gone for good, remove the link or point it to the closest useful page.</li><li>For links to other sites, search their site for the new address, or link to a different source.</li></ol>
<p>For titles, duplicate pages and other problems across your site, run the <a href="/website-audit">website audit</a>.</p>
<h2>What it can't tell you</h2>
<ul><li><strong>Links added by JavaScript.</strong> We read the HTML your server sends; menus and links built by scripts after the page loads aren't seen.</li><li><strong>Sites that block checkers.</strong> Some sites (LinkedIn, for example) refuse automated visits. We list these separately rather than call them broken – check them in your browser.</li><li><strong>Very large sites.</strong> We stop at 300 pages and 2,500 links. For bigger sites, use the <a href="/website-crawler">website crawler</a>.</li></ul>`,
    faqs: [["Is the broken link checker free?", "Yes. No sign-up, no email and no subscription, with only a fair-use limit to stop bots."], ["Do broken links hurt SEO?", "A few won't sink a site, but they waste visitors' time and Google's crawling, and broken internal links can leave pages hard for Google to find. They're quick to fix."], ["Why does a link work for me but show as broken?", "The site may have been down when we checked, or it blocks automated visitors. If it works in your browser, it's probably fine."], ["Does it check links to other websites?", "Yes. Every link and image on your pages is tested, wherever it points."]],
  },
  toolPage("/schema-checker", "Schema checker", "Schema Markup Checker | Validate Structured Data Free",
    "Free schema markup checker: validate your JSON-LD structured data, see which types you use and which properties Google requires for rich results.",
    "Schema markup checker", "Structured data helps Google and AI assistants understand your business and can earn rich results. Check yours against Google's documented requirements.",
    "structured-data", "XKey schema checker",
    `<h2>What does the schema checker test?</h2>
<ul><li>Every JSON-LD block parses correctly and declares <code>@context</code>.</li><li>The types you use, such as Organization, LocalBusiness, Product, Article, Event or BreadcrumbList.</li><li>Google's <strong>required</strong> properties for each type, with recommended properties listed separately.</li></ul>
<h2>Things to know</h2>
<ul><li>FAQ rich results are now limited to government and health websites, so FAQ markup rarely shows stars or drop-downs for businesses.</li><li>Reviews of your own business written on your own site don't get review stars.</li><li>Markup must match what's visible on the page.</li></ul>`,
    [["Which schema type should a small business use?", "LocalBusiness, or a more specific type such as Plumber or Restaurant, if you serve customers in an area; Organization otherwise. Add BreadcrumbList on inner pages."], ["Does schema markup improve rankings?", "Not directly. It helps search engines and AI understand the page and can make it eligible for rich results, which can lift clicks."]]),
  toolPage("/page-speed-checker", "Page speed checker", "Page Speed Checker | Core Web Vitals Test (Free)",
    "Free page speed checker: Core Web Vitals (LCP, INP, CLS) from real Chrome users plus a Lighthouse test, server response time and speed fixes.",
    "Page speed checker", "See how fast your page is for real visitors, not just in a lab test, and what's slowing it down.",
    "performance", "XKey page speed checker",
    `<h2>Which page speed numbers matter?</h2>
<div class="tablewrap"><table><thead><tr><th>Metric</th><th>Measures</th><th>Good</th></tr></thead><tbody><tr><td>LCP</td><td>How long the main content takes to appear</td><td>2.5 s or less</td></tr><tr><td>INP</td><td>How quickly the page responds to taps and clicks</td><td>200 ms or less</td></tr><tr><td>CLS</td><td>How much the layout jumps while loading</td><td>0.1 or less</td></tr><tr><td>TTFB</td><td>How fast the server starts responding</td><td>0.8 s or less</td></tr></tbody></table></div>
<p>Google judges Core Web Vitals at the 75th percentile of real visits – so three out of four visitors need a good experience. Where your site has enough traffic, XKey shows this real-user data from the Chrome UX Report. Read more in our <a href="/guides/core-web-vitals">Core Web Vitals guide</a>.</p>`,
    [["Why is my speed score different every time?", "Lab tests vary with network and server load from run to run. Real-user data is much steadier, so trust it when it's available."], ["Is page speed a ranking factor?", "Yes, as part of Google's page experience signals, but a light one – relevant, helpful content matters more. Speed matters most for keeping visitors."]]),
  toolPage("/sitemap-checker", "Sitemap checker", "XML Sitemap Checker | Test & Validate It Free Online",
    "Free XML sitemap checker: find your sitemap, check it's valid, listed in robots.txt and includes this page, with lastmod dates.",
    "XML sitemap checker", "Your sitemap tells search engines which pages exist. Check it's being found and that it's telling the truth.",
    "indexing-crawling", "XKey sitemap checker",
    `<h2>What does a good sitemap look like?</h2>
<ul><li>Listed in robots.txt with a <code>Sitemap:</code> line, and submitted in Google Search Console.</li><li>Only includes pages you want indexed: no redirects, errors or noindex pages.</li><li>Uses accurate <code>lastmod</code> dates so search engines know what changed.</li><li>Split into a sitemap index if you have more than 50,000 URLs.</li></ul>
<p>To find sitemap entries that redirect or error, and indexable pages missing from your sitemap, run the <a href="/website-audit">website audit</a>.</p>`,
    [["Do I need a sitemap?", "Small, well-linked sites can be found without one, but a sitemap is free insurance and helps new pages get discovered sooner."], ["Where should my sitemap be?", "Usually at yoursite.co.uk/sitemap.xml, listed in robots.txt and submitted in Google Search Console and Bing Webmaster Tools."]]),
  toolPage("/security-headers-checker", "Security headers checker", "Free Security Headers Checker | HTTPS, HSTS & More",
    "Free security headers checker: HTTPS, HTTP-to-HTTPS redirects, HSTS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy and more.",
    "Security headers checker", "Browsers warn visitors about insecure sites, and Google prefers HTTPS. Check the basics that keep your visitors safe.",
    "security", "XKey security headers checker",
    `<h2>Which security headers does it check?</h2>
<ul><li>HTTPS with no insecure (mixed) content, and http:// redirecting to https://.</li><li>HSTS with a long enough max-age.</li><li>X-Content-Type-Options, Referrer-Policy, Permissions-Policy and clickjacking protection (X-Frame-Options or CSP frame-ancestors).</li><li>Whether your server advertises its software version.</li></ul>
<p>Many of these can be switched on in one place if your site is behind a CDN such as Cloudflare.</p>`,
    [["Does HTTPS help SEO?", "Yes – Google uses HTTPS as a light ranking signal, and browsers label plain HTTP pages 'Not secure', which puts visitors off."], ["What is HSTS?", "HTTP Strict Transport Security tells browsers to only ever use HTTPS for your site, which blocks downgrade attacks. Turn it on once your whole site works over HTTPS."]]),
  toolPage("/local-seo-checker", "Local SEO checker", "Local SEO Checker for UK Businesses | Free",
    "Free local SEO checker for UK businesses: LocalBusiness markup, UK phone and postcode, map links and the details that help you appear in Google Maps.",
    "Local SEO checker for UK businesses", "If customers find you by searching for a service in a town, local signals on your website matter. Check yours below.",
    "local-seo", "XKey local SEO checker",
    `<h2>What matters most for local SEO?</h2>
<ul><li><strong>Google Business Profile</strong> – the single biggest factor for appearing in the map results.</li><li><strong>Consistent name, address and phone</strong> on your site, your profile and directories.</li><li><strong>LocalBusiness structured data</strong> with address or area served, phone, opening hours and geo-coordinates.</li><li><strong>Town and service pages</strong> that match how people search, e.g. "electrician in Lytham St Annes".</li><li><strong>Reviews</strong> from real customers on your Google profile.</li></ul>
<p>Local SEO checks are only scored when your page looks like a local business, so national websites aren't marked down.</p>`,
    [["Do I need a Google Business Profile?", "If you serve customers locally, yes. It's free, and it's what appears in Google Maps and the local results."], ["Should I make a page for every town I cover?", "Only where you genuinely serve that area and have something specific to say. Near-identical town pages can count as doorway pages, which Google's spam policies prohibit."]]),
  {
    path: "/meta-tag-generator", crumb: "Meta tag generator", parent: ["/seo-tools", "SEO tools"], title: "Free Meta Tag Generator | No Sign-Up, Instant HTML",
    desc: "Free meta tag generator: create your title, meta description, canonical, robots and social tags in seconds, with Google pixel-width checks. No sign-up, no email.",
    h1: "Free meta tag generator", eyebrow: "Instant tool · Unlimited", app: "XKey meta tag generator",
    lead: "Fill in the boxes and copy a complete, correct set of meta tags for the <head> of your page – title, description, canonical, robots and social sharing tags.",
    form: "meta",
    sections: `<h2>Which meta tags actually matter for SEO?</h2>
<ul><li><strong>Title</strong> – the clickable headline in Google and one of the strongest signals of what the page is about.</li><li><strong>Meta description</strong> – doesn't affect rankings directly, but it's your advert in the results and affects how many people click.</li><li><strong>Canonical</strong> – tells search engines which address is the main version when the same page can be reached in several ways.</li><li><strong>Robots</strong> – lets you keep a page out of search with <code>noindex</code>. <code>max-image-preview:large</code> allows big image previews in Google Discover.</li><li><strong>Viewport</strong> – needed for the page to display properly on phones, which is how Google indexes it.</li><li><strong>Open Graph</strong> – controls the title, text and image shown when someone shares the page on Facebook, LinkedIn, WhatsApp or X.</li></ul>
<h2>Which meta tags can I ignore?</h2>
<p>The <code>keywords</code> meta tag has been ignored by Google since 2009, so this generator leaves it out. Tags such as <code>revisit-after</code>, <code>rating</code> and <code>author</code> have no effect on Google rankings either.</p>
<h2>How do I add meta tags to my website?</h2>
<p>Paste the generated code between <code>&lt;head&gt;</code> and <code>&lt;/head&gt;</code> in your page's HTML. On WordPress, use an SEO plugin's title and description boxes instead of pasting code; on Wix, Squarespace and Shopify, look for "SEO settings" on each page. Then run a <a href="/">free SEO check</a> to confirm Google can see them.</p>`,
    faqs: [["Is this meta tag generator really free?", "Yes – free, unlimited and no sign-up. It runs entirely in your browser, so nothing you type is sent to us."], ["How long should my meta description be?", "Aim for roughly 500 to 990 pixels – about 120 to 155 characters. The generator measures it in pixels as you type."]],
  },
  {
    path: "/open-graph-generator", crumb: "Open Graph generator", parent: ["/seo-tools", "SEO tools"], title: "Open Graph Generator | Free OG Tags, No Sign-Up",
    desc: "Free Open Graph generator: create og: and Twitter card tags with a live preview of how your link will look on Facebook, LinkedIn, WhatsApp and X. No sign-up.",
    h1: "Open Graph tag generator", eyebrow: "Instant tool · Unlimited", app: "XKey Open Graph generator",
    lead: "Control how your page looks when it's shared. Fill in the details, check the preview and copy the tags into your page's <head>.",
    form: "og",
    sections: `<h2>What are Open Graph tags?</h2>
<p>Open Graph is a set of <code>og:</code> meta tags, created by Facebook and now read by LinkedIn, WhatsApp, Slack, Discord, iMessage and most other apps, that tell them which title, description and image to show when someone shares a link. X (Twitter) reads them too, plus its own <code>twitter:card</code> tag, which the generator adds for you.</p>
<h2>What size should an Open Graph image be?</h2>
<p><strong>1200 × 630 pixels</strong> (a 1.91:1 ratio) works everywhere. Use PNG or JPG – SVG isn't supported – keep it under about 5 MB, and keep important text away from the edges because some apps crop to a square.</p>
<h2>Why isn't my new image showing when I share a link?</h2>
<p>Social networks cache link previews, sometimes for weeks. After changing your tags, ask them to look again: Facebook's Sharing Debugger and LinkedIn's Post Inspector both have a "scrape again" option. Also check the image address is a full https:// URL and isn't blocked by robots.txt.</p>
<h2>Do Open Graph tags help SEO?</h2>
<p>Not directly – Google doesn't rank pages on them. But a clear, attractive preview gets more clicks when your page is shared, and more visitors and mentions help over time. The <a href="/">free SEO check</a> tests your Open Graph tags as part of the snippet section.</p>`,
    faqs: [["Do I need both Open Graph and Twitter tags?", "X falls back to Open Graph for the title, description and image, but it needs twitter:card to show a large image. The generator includes both."]],
  },
  {
    path: "/xml-sitemap-generator", crumb: "XML sitemap generator", parent: ["/seo-tools", "SEO tools"], title: "Free XML Sitemap Generator Online | No Registration",
    desc: "Free XML sitemap generator: find your pages automatically or paste a list, then download a valid sitemap.xml for Google and Bing. No registration, no email.",
    h1: "Free XML sitemap generator", eyebrow: "Instant tool · No registration", app: "XKey XML sitemap generator",
    lead: "Enter your website to find its pages automatically, or paste your own list of addresses. Download a valid sitemap.xml in one click.",
    form: "sitemap",
    sections: `<h2>How do I use the sitemap generator?</h2>
<ol><li>Type your website address and press <strong>Find pages on my site</strong>. We read your existing sitemap and the links on your home page.</li><li>Check the list: remove anything you don't want in Google (thank-you pages, logins, duplicates) and add any pages that are missing.</li><li>Download <code>sitemap.xml</code> and upload it to the root of your website.</li><li>Add <code>Sitemap: https://yoursite.co.uk/sitemap.xml</code> to robots.txt and submit it in Google Search Console and Bing Webmaster Tools.</li></ol>
<h2>What should a sitemap include?</h2>
<p>Only pages you want to appear in search: the final https:// address of each page, with no redirects, errors or noindex pages. <code>lastmod</code> should be the date the page's content last changed – Google uses it when it's accurate and ignores it when it isn't. Google ignores <code>priority</code> and <code>changefreq</code>, so we leave them out.</p>
<h2>Does my website builder already make a sitemap?</h2>
<p>Very likely. WordPress (since version 5.5), Wix, Squarespace and Shopify all create one automatically – try yoursite.co.uk/sitemap.xml or /wp-sitemap.xml. This generator is for hand-built sites, small static sites and anyone who needs a clean list. To check an existing sitemap, use the <a href="/sitemap-checker">sitemap checker</a>.</p>`,
    faqs: [["Is there a limit on the number of URLs?", "A single sitemap can hold up to 50,000 URLs (and 50 MB). The generator itself has no limit – it runs in your browser."], ["Will a sitemap get my pages indexed?", "It helps Google find them, but indexing isn't guaranteed. Pages also need to be useful, reachable through links and not blocked."]],
  },
  {
    path: "/word-counter", crumb: "Word counter", parent: ["/seo-tools", "SEO tools"], title: "Word Counter & Keyword Density Checker | Free, No Login",
    desc: "Free word counter with character count, reading time, readability score and keyword density for single words and phrases. Unlimited, no login, nothing stored.",
    h1: "Word counter and keyword density checker", eyebrow: "Instant tool · Unlimited", app: "XKey word counter",
    lead: "Paste or type your text to count words, characters, sentences and reading time – and see which words and phrases you use most.",
    form: "words",
    sections: `<h2>What does the word counter measure?</h2>
<ul><li><strong>Words and characters</strong>, with and without spaces – handy for meta descriptions, ads and social posts with character limits.</li><li><strong>Sentences, paragraphs and reading time</strong> (at about 230 words a minute).</li><li><strong>Readability</strong> using the Flesch reading-ease score: 60 or above is plain English that most adults read easily.</li><li><strong>Keyword density</strong> – the most-used words and two- and three-word phrases, with common words such as "the" and "and" filtered out.</li></ul>
<h2>What is a good keyword density?</h2>
<p>There isn't one. Google has never published a target and doesn't use a density formula. Use the phrases people search for naturally, especially in your title, first paragraph and headings – and if one phrase is far more frequent than everything else, read the text aloud: if it sounds repetitive, it probably reads as keyword stuffing to Google too.</p>
<h2>How many words should a web page have?</h2>
<p>As many as it takes to answer the question fully, and no more. A contact page might need 100 words; a service page usually needs 400 or more to cover prices, process, areas and common questions; a guide may need 1,500. The <a href="/">free SEO check</a> counts the words in your page's main content, ignoring menus and footers.</p>`,
    faqs: [["Is my text stored or sent anywhere?", "No. The word counter runs entirely in your browser – nothing you paste leaves your device."], ["Does it work with other languages?", "Yes, word and character counts work for any language that uses spaces between words. The readability score is designed for English."]],
  },
  {
    path: "/keyword-generator", crumb: "Long-tail keyword generator", parent: ["/seo-tools", "SEO tools"], title: "Free Long-Tail Keyword Generator | No Sign-Up",
    desc: "Free long-tail keyword generator: turn one topic into question, buying, local and comparison keyword ideas for your pages. No sign-up, no email.",
    h1: "Free long-tail keyword generator", eyebrow: "Instant tool · Unlimited", app: "XKey long-tail keyword generator",
    lead: "Enter a product or service and your town to get dozens of specific, long-tail keyword ideas – the low-competition searches that new and small websites can actually win.",
    form: "keywords",
    sections: `<h2>What are long-tail keywords?</h2>
<p>Long-tail keywords are longer, more specific searches – "emergency plumber in Blackpool on a Sunday" rather than "plumber". Each one has fewer searches, but together they make up most of what people type into Google, they face far less competition, and the people searching them usually know exactly what they want.</p>
<h2>How do I check if a keyword is worth targeting?</h2>
<ol><li><strong>Search it on Google</strong> and look at what ranks. If the results are forums, thin directories or pages that don't quite answer the question, you have a good chance.</li><li><strong>Check Google's autocomplete and "People also ask"</strong> – if Google suggests it, real people search for it.</li><li><strong>Look in Google Search Console</strong> for searches you already appear for on page two – they're often the quickest wins.</li></ol>
<p>This tool generates ideas from proven patterns; it doesn't show search volumes. Google Keyword Planner gives free volume ranges if you have a Google Ads account.</p>
<h2>How should I use these keyword ideas?</h2>
<p>Pick one main phrase per page and put it in the title, the H1 and the first paragraph. Turn question keywords into headings with direct answers underneath – the format Google's "People also ask" boxes and AI assistants like to quote. Then check the page with the <a href="/">free SEO check</a>.</p>`,
    faqs: [["Why doesn't it show search volumes?", "Accurate volumes come from paid data providers. Rather than show made-up numbers, we give you proven keyword patterns and explain how to check them for free."], ["Are 'no sign-up' keywords worth targeting?", "Yes, if your page genuinely offers that. People who add 'no sign-up' or 'free' to a search are frustrated with paywalls and click quickly on a page that delivers."]],
  },
  {
    path: "/blog-title-generator", crumb: "Blog title generator", parent: ["/seo-tools", "SEO tools"], title: "Free Blog Title Generator | No Sign-Up, Instant Ideas",
    desc: "Free blog post title generator: enter a keyword and get 15 headline ideas, each measured in pixels so it fits in Google's results. No sign-up, unlimited use.",
    h1: "Free blog title generator", eyebrow: "Instant tool · Unlimited", app: "XKey blog title generator",
    lead: "Enter your topic or keyword and get headline ideas proven to earn clicks – each one measured against Google's title width.",
    form: "titles",
    sections: `<h2>What makes a good blog post title?</h2>
<ul><li><strong>It contains the search phrase</strong>, ideally near the start.</li><li><strong>It promises something specific</strong>: a number, a price, a year, a result.</li><li><strong>It fits</strong>: about 580 pixels on desktop, or Google cuts it off with "…". We show the width next to each idea.</li><li><strong>It's honest</strong>. Clickbait that the article doesn't deliver brings visitors who leave straight away.</li></ul>
<h2>Should my page title and H1 be the same?</h2>
<p>They can be, and that's fine. Many sites use a slightly longer H1 on the page and a tighter title tag for Google, sometimes with the brand name added. What matters is that both clearly describe the same topic – Google often rewrites titles that don't match the page. Check yours with the <a href="/title-tag-checker">title tag checker</a>.</p>
<h2>Where do the best blog ideas come from?</h2>
<p>Your customers. Write down every question people ask you by phone, email or in person – each one is a blog post, and those are exactly the long-tail searches small sites can win. The <a href="/keyword-generator">long-tail keyword generator</a> helps fill the gaps.</p>`,
    faqs: [["Can I use these titles as they are?", "Yes – they're templates for you to adapt. Edit them so they match exactly what your article delivers."]],
  },
  {
    path: "/robots-txt-generator", crumb: "robots.txt generator", parent: ["/seo-tools", "SEO tools"], title: "robots.txt Generator | Free, With AI Crawler Controls",
    desc: "Free robots.txt generator with AI crawler controls: block AI training bots like GPTBot while staying visible in ChatGPT, Claude and Google search. No sign-up.",
    h1: "robots.txt generator with AI crawler controls", eyebrow: "Instant tool · Unlimited", app: "XKey robots.txt generator",
    lead: "Choose what to block, including AI training crawlers, and download a correct robots.txt file. Then test it with the robots.txt tester.",
    form: "robotsgen",
    sections: `<h2>Should I block AI crawlers?</h2>
<p>There are two kinds. <strong>Training crawlers</strong> (GPTBot, ClaudeBot, Google-Extended, CCBot and others) collect pages to train AI models; blocking them doesn't affect your search visibility. <strong>AI search crawlers</strong> (OAI-SearchBot, Claude-SearchBot, PerplexityBot) fetch pages so the assistant can show and link to them; blocking those removes you from those answers. Most businesses that want customers block training if they prefer and always allow search. Google's AI Overviews use normal Googlebot, so they can't be blocked separately without leaving Google.</p>
<h2>What should I block in robots.txt?</h2>
<p>Usually very little: admin areas, internal search results, baskets and checkout pages, and endless filter combinations on shops. Never block your CSS or JavaScript – Google needs them to render your pages.</p>
<h2>Does robots.txt hide a page from Google?</h2>
<p>No. It stops crawling, not indexing – a blocked page can still appear in results if other sites link to it. To keep a page out of Google, allow it to be crawled and add a <code>noindex</code> meta tag. Test your finished file with the <a href="/robots-txt-tester">robots.txt tester</a>.</p>`,
    faqs: [["Do all AI crawlers obey robots.txt?", "The major providers (OpenAI, Anthropic, Google, Perplexity, Apple and Common Crawl) say their crawlers follow it. Badly behaved scrapers may not – for those you need a firewall or your CDN's bot protection."]],
  },
  {
    path: "/schema-generator", crumb: "Local business schema generator", parent: ["/seo-tools", "SEO tools"], title: "Local Business Schema Generator | Free JSON-LD",
    desc: "Free LocalBusiness schema generator: create JSON-LD structured data with address, opening hours, service areas and profiles for Google and AI. No sign-up.",
    h1: "Local business schema generator", eyebrow: "Instant tool · Unlimited", app: "XKey schema generator",
    lead: "Create LocalBusiness structured data that tells Google and AI assistants exactly who you are, where you work and when you're open.",
    form: "schemagen",
    sections: `<h2>What is LocalBusiness schema?</h2>
<p>It's a block of JSON-LD code, using the schema.org vocabulary, that states your business details in a form machines can read without guessing: name, address, phone, opening hours, areas served and links to your official profiles. Google uses it to understand your business, and AI assistants use it to describe you accurately.</p>
<h2>Which business type should I choose?</h2>
<p>The most specific one that fits – Plumber, Electrician, Dentist, Restaurant and so on – because each is still a LocalBusiness. If none fits, use LocalBusiness or ProfessionalService.</p>
<h2>What if I don't have a public address?</h2>
<p>Service-area businesses that visit customers can leave out the street address and use <strong>areas served</strong> instead, listing the towns you cover. Whatever you include must match your Google Business Profile and what's visible on your website.</p>
<h2>How do I add the code to my site?</h2>
<p>Paste it into the <code>&lt;head&gt;</code> or anywhere in the <code>&lt;body&gt;</code> of your home page (or contact page). On WordPress, an SEO plugin or a header-code plugin does the job. Then run the <a href="/schema-checker">schema checker</a> to validate it.</p>`,
    faqs: [["What are sameAs links?", "Links to your official profiles elsewhere – Google Business Profile, Facebook, LinkedIn, Companies House. They help Google and AI connect your website to the same business across the web."], ["Will schema get me stars in Google?", "Not on its own. Review stars aren't shown for reviews a business publishes about itself on its own site."]],
  },
  {
    path: "/keyword-difficulty-checker", crumb: "Keyword difficulty checker", parent: ["/seo-tools", "SEO tools"], title: "Free Keyword Difficulty Checker | No Sign-Up",
    desc: "Free keyword difficulty checker: see how hard it is to reach page one by analysing the pages that rank now. No sign-up, no email, no subscription.",
    h1: "Free keyword difficulty checker", eyebrow: "Free · No sign-up", app: "XKey keyword difficulty checker",
    lead: "Find out whether you can realistically rank for a keyword. Search it on Google, paste the page-one results, and XKey grades how strong each one really is.",
    form: "difficulty",
    sections: `<h2>How does this keyword difficulty checker work?</h2>
<p>Paid tools estimate difficulty from their own databases of backlinks. XKey looks at the evidence directly: the pages Google ranks right now for your search. For each one we check whether the keyword is in the title and main heading, how much content it has, whether it uses structured data, how fast it responds and what kind of site it is – a national brand, or a forum, free blog or Q&amp;A page that a focused business page can often beat.</p>
<p>You do the Google search yourself, so you see exactly the results your customers see, in your location – and we don't break Google's rules by scraping its results.</p>
<h2>What is a good keyword difficulty score?</h2>
<ul><li><strong>Under 35 – easy.</strong> Page one is held by pages that don't really target the phrase. A focused, helpful page can rank, often within weeks.</li><li><strong>35 to 60 – medium.</strong> Beatable with a better page, a few relevant links and, for local searches, a strong Google Business Profile.</li><li><strong>Over 60 – hard.</strong> Strong, well-targeted pages and big sites. Target a longer, more specific variation first – try the <a href="/keyword-generator">long-tail keyword generator</a>.</li></ul>
<h2>What does it not measure?</h2>
<p>Backlinks – links from other websites – are a big part of why established sites rank, and measuring them needs a crawl of the whole web. So treat big-name sites as harder than their on-page score suggests. Search volume isn't included either; Google Keyword Planner gives free ranges.</p>`,
    faqs: [["Why do I have to paste the results myself?", "Google doesn't allow automated scraping of its results. Searching yourself is within the rules, free, and shows the real results for your location."], ["How many results should I paste?", "All ten organic results on page one gives the best estimate. Skip ads, the map pack and video carousels."]],
  },
  {
    path: "/plagiarism-checker", crumb: "Plagiarism checker", parent: ["/seo-tools", "SEO tools"], title: "Free Plagiarism Checker | No Sign-Up, No Word Limit",
    desc: "Free plagiarism checker with no sign-up and no word limit: search the web for your most distinctive sentences and compare your text with any page.",
    h1: "Free plagiarism checker", eyebrow: "Free · No word limit", app: "XKey plagiarism checker",
    lead: "Check whether your text has been copied – or copies someone else. Search the web for its most distinctive sentences in one click, and compare it word for word with any page.",
    form: "plagiarism",
    sections: `<h2>How does this plagiarism checker work?</h2>
<ol><li><strong>We pick your most distinctive sentences</strong> – the ones with the most unusual wording, which are the most likely to be unique.</li><li><strong>You search for each one, word for word</strong>, on Google or Bing with one click. If another page shows up with the same wording, the text has been copied one way or the other.</li><li><strong>Compare with any page.</strong> Add the address of a page you suspect and we measure what share of your text appears on it word for word, and show the matching passages.</li></ol>
<p>Your text is never stored, and the sentence picking happens in your browser. Unlike many free checkers, there's no word limit and no sign-up.</p>
<h2>Does duplicate content hurt SEO?</h2>
<p>Google doesn't penalise ordinary duplication, but when several pages have the same text it usually shows only one of them – and it may not be yours. Copying content wholesale from other sites can count as scraped content under Google's spam policies. Make sure your important pages say something in your own words.</p>
<h2>What should I do if someone has copied my content?</h2>
<p>Contact the site owner first and ask them to remove it or credit you. If that doesn't work, you can file a copyright removal request with Google under the Digital Millennium Copyright Act (DMCA) form, and contact the site's web host.</p>`,
    faqs: [["Is this as thorough as paid plagiarism checkers?", "Paid checkers compare against their own databases of web pages and academic papers. Ours uses Google and Bing's own indexes, one sentence at a time, which is excellent for spotting web copies but doesn't cover private academic databases."], ["Is my text kept?", "No. Picking sentences happens in your browser, and when you compare with a page we only fetch that page."]],
  },
  {
    path: "/anchor-text-checker", crumb: "Anchor text checker", parent: ["/seo-tools", "SEO tools"], title: "Anchor Text Checker & Generator | Free, No Sign-Up",
    desc: "Free anchor text checker and generator: list every link on a page, find empty, generic and clashing anchors, and get balanced anchor ideas. No sign-up.",
    h1: "Anchor text checker and generator", eyebrow: "Free · No sign-up", app: "XKey anchor text checker",
    lead: "Anchor text is the clickable wording of a link, and Google uses it to understand the page it points to. Check every link on a page, then generate better anchors.",
    form: "anchors",
    sections: `<h2>What does the anchor text checker look for?</h2>
<ul><li><strong>Empty anchors</strong> – links with no text, or image links with no alt text, tell Google and screen-reader users nothing.</li><li><strong>Generic anchors</strong> such as "click here" and "read more" waste the chance to describe the destination.</li><li><strong>Same anchor, different pages</strong> – using the same words to link to two pages blurs which one should rank.</li><li><strong>nofollow on internal links</strong>, which throws away your own link value.</li><li><strong>Your internal anchors</strong> in the page content, so you can see what you're telling Google each page is about.</li></ul>
<h2>What is good anchor text?</h2>
<p>Words that describe the page you're linking to, written naturally into the sentence: "see our <em>boiler servicing prices</em>" rather than "click here". For your own internal links, descriptive anchors that include the topic are ideal – Google's own guidance encourages it.</p>
<h2>Can anchor text be over-optimised?</h2>
<p>Yes – but mostly for links from other websites. Lots of external links using the exact same keyword anchor looks unnatural, and buying links to manipulate rankings breaks Google's spam policies. Natural links use a mix of your brand name, your address and descriptive phrases, which is what the generator gives you.</p>`,
    faqs: [["How many links should a page have?", "There's no fixed limit. Link wherever it genuinely helps a visitor, and make sure every important page is linked from somewhere in your content, not only the menu."], ["Do menu and footer links count?", "Yes, but Google understands they're site-wide navigation. Links within the main content carry more context, so we show those separately."]],
  },
  {
    path: "/local-search-checker", crumb: "Local search checker", parent: ["/seo-tools", "SEO tools"], title: "Local SERP Checker | See Google From Any UK Town, Free",
    desc: "Free local SERP checker: see Google search results as they appear in any UK town or city, without a VPN or sign-up. Check your local rankings in seconds.",
    h1: "Local search checker: see Google from any UK town", eyebrow: "Instant tool · Unlimited", app: "XKey local search checker",
    lead: "Google shows different results in different places. Type a search and a town to open Google exactly as people there see it – handy for checking where you rank across your service area.",
    form: "localserp",
    sections: `<h2>Why do Google results change by location?</h2>
<p>For anything with local intent – plumbers, cafés, solicitors, "near me" searches – Google ranks businesses close to the searcher higher, and shows a map pack of nearby businesses. So your position in Blackpool can be completely different from your position in Preston, even for the same words. Searching from your own office only ever shows you one of those pictures.</p>
<h2>How does this local search checker work?</h2>
<p>We build a Google search link with a location setting (the same <code>uule</code> parameter search professionals use), plus settings that switch off personalisation. The search runs in your own browser, from Google directly – we don't scrape or store anything – so the results are as real as they get. If Google doesn't recognise a place name, it falls back to your own location: try the main town name, spelled as on a map.</p>
<h2>How do I improve my local rankings?</h2>
<ul><li>Complete and verify your <strong>Google Business Profile</strong>, with the right categories and service areas.</li><li>Keep your <strong>name, address and phone</strong> identical on your website, profile and directories.</li><li>Add <strong>LocalBusiness structured data</strong> – our <a href="/schema-generator">schema generator</a> writes it for you.</li><li>Create genuinely useful pages for the towns you serve, and earn reviews from real customers.</li><li>Check your site with the <a href="/local-seo-checker">local SEO checker</a>.</li></ul>`,
    faqs: [["Is this the same as a rank tracker?", "It shows you the live results so you can see where you appear. Paid rank trackers automate this across hundreds of searches; doing it by hand for your few most important searches costs nothing and follows Google's rules."], ["Why don't I see the map pack?", "Google only shows the map pack when it thinks the search is local. Try adding the type of business, such as 'plumber' rather than 'plumbing'."]],
  },
  {
    path: "/ai-meta-description-generator", crumb: "AI title & description writer", parent: ["/seo-tools", "SEO tools"], title: "AI Meta Description Generator | Free, No Sign-Up",
    desc: "Free AI meta description and title generator: we read your page and write three titles and three descriptions sized for Google. No sign-up, no email.",
    h1: "AI meta description and title generator", eyebrow: "AI · Free · No sign-up", app: "XKey AI meta description generator",
    lead: "Give us a page address or a few lines about the page. AI reads it and writes three titles and three meta descriptions – each measured in pixels so it fits in Google.",
    form: "aiwriter",
    sections: `<h2>How does the AI meta description generator work?</h2>
<p>If you enter an address, we read the page's current title, description, main heading and text. The AI – Meta's Llama model, running on Cloudflare's network – then writes three titles and three descriptions in British English around your main keyword and town. We measure every suggestion in pixels the way Google displays it, so you can see at a glance which ones fit.</p>
<h2>Can I trust what the AI writes?</h2>
<p>Use it as a first draft. We tell the AI never to invent prices, awards or reviews, but AI can still get details wrong – so read every word and make sure it's true for your business before you use it. Google's guidance is clear that AI-written content is fine when it's accurate and helpful to people.</p>
<h2>What makes a good meta description?</h2>
<ul><li>It describes what's actually on the page – Google rewrites descriptions that don't match.</li><li>It leads with the benefit to the searcher, not your company history.</li><li>It ends with a reason to click: a price, a guarantee, "book online", "free quote".</li><li>It's unique to the page and roughly 120 to 155 characters long.</li></ul>
<p>Check how your result looks with the <a href="/title-tag-checker">title tag checker</a>, or write tags by hand with the <a href="/meta-tag-generator">meta tag generator</a>.</p>`,
    faqs: [["Is the AI writer really free?", "Yes – no sign-up, no email and no credits to buy. There's a fair-use limit of 30 uses an hour per connection, and a daily cap so the free service stays available for everyone."], ["Is my page text stored?", "No. The page is read, sent to the AI to write your suggestions, and then discarded."]],
  },
  {
    path: "/bulk-seo-checker", crumb: "Bulk SEO checker", parent: ["/seo-tools", "SEO tools"], title: "Bulk SEO Checker | Check 20 Websites at Once, Free",
    desc: "Free bulk SEO checker: paste up to 20 web addresses and get SEO and AI search scores, failed checks and titles side by side, with a CSV download.",
    h1: "Bulk SEO checker", eyebrow: "Free · No sign-up", app: "XKey bulk SEO checker",
    lead: "Check up to 20 pages or websites in one go – your own pages, a client list or a whole page of competitors – and download the results as a spreadsheet.",
    form: "bulk",
    sections: `<h2>What does the bulk SEO checker show?</h2>
<p>For every address you get the overall SEO score, the AI search readiness score, the number of failed checks, the word count and the page title – the same engine as our <a href="/">free SEO check</a>, run on each page. Click any row for the full report with fixes, or download everything as a CSV for Excel or Google Sheets.</p>
<h2>Who is it for?</h2>
<ul><li><strong>Business owners</strong> checking their most important pages at once.</li><li><strong>Web designers and agencies</strong> reviewing a list of client sites before a call.</li><li><strong>Anyone researching a market</strong> – paste the ten sites on page one for your search and see who's well optimised.</li></ul>
<h2>How is this different from the website audit?</h2>
<p>The bulk checker runs the full single-page check – including AI readiness and speed signals – on pages you choose, across any websites. The <a href="/website-audit">website audit</a> crawls one site from its home page to find site-wide problems such as broken links and duplicate titles.</p>`,
    faqs: [["Why is the limit 20?", "Each check fetches a page and its supporting files, so 20 at a time keeps the tool fast and free for everyone. Run another batch whenever you like."]],
  },
  {
    path: "/seo-badge", crumb: "SEO score badge", parent: ["/seo-tools", "SEO tools"], title: "Free SEO Score Badge for Your Website | XKey",
    desc: "Show visitors your website is well built: add a free XKey SEO score badge that updates itself weekly. Copy one line of code – no sign-up.",
    h1: "Free SEO score badge for your website", eyebrow: "Free · Updates itself", app: "XKey SEO score badge",
    lead: "Proud of your score? Add a small badge to your footer that shows your current XKey SEO score and updates itself every week.",
    form: "badge",
    sections: `<h2>How does the badge work?</h2>
<p>The badge is a small image served by XKey. The first time it's shown, we check your home page in the background and remember the score; after that we re-check about once a week, so the number stays honest. Clicking the badge opens your full, up-to-date report.</p>
<h2>Where should I put it?</h2>
<p>Most sites put it in the footer, next to payment or trade-association logos. Web designers often add it to the sites they build to show clients the work is search-ready.</p>
<h2>Does the badge slow my site down?</h2>
<p>No. It's a tiny image (under 1 kB) served from Cloudflare's network and cached, with no scripts and no cookies.</p>`,
    faqs: [["What if my score drops?", "The badge always shows your real score. If it drops, the linked report shows exactly what changed and how to fix it – or remove the badge at any time."]],
  },
  {
    path: "/seo-tools", crumb: "SEO tools", title: "Free SEO Tools | No Sign-Up, No Email, No Subscription",
    desc: "32 free SEO tools with no sign-up, no email and no subscription: SEO check, site audit, meta tag and sitemap generators, keyword ideas and more.",
    h1: "Free SEO tools", eyebrow: "No sign-up", lead: "Every tool is free, with no account, no email and no subscription. The generators and counters run in your browser, so they're unlimited and nothing you type leaves your device.",
    sections: `<h2>Which SEO tool should I start with?</h2><p>Start with the <a href="/">free SEO check</a> on your most important page – it covers everything below in one report. Then run the <a href="/website-audit">website audit</a> to catch site-wide problems, and turn on <a href="/seo-monitoring">weekly monitoring</a> so nothing breaks unnoticed.</p><h2>Are these SEO tools really free?</h2><p>Yes. No sign-up, no trial and no limits beyond fair-use rate limits that stop abuse. XKey is paid for by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, who build websites, as a useful free service.</p><h2>Do the single-topic tools run a different check?</h2><p>The checkers for speed, schema, sitemaps, security, mobile and local SEO run the full check and open your report at that section, so you never miss a bigger problem elsewhere on the page.</p>`, tools: true, itemList: TOOLS,
  },
  {
    path: "/guides", crumb: "Guides", title: "Free SEO Guides | Plain-English Help From XKey",
    desc: "Free plain-English SEO guides for UK businesses: why a site isn't on Google, Search Console, title tags, local SEO, schema, AI search and more.",
    h1: "SEO guides", eyebrow: "Plain English", lead: "Short, practical guides for business owners who want to understand their SEO report.", sections: `<h2>Who are these guides for?</h2><p>Business owners, marketers and anyone who has run an SEO check and wants to know what the results mean. Each guide explains one topic in plain English, says what matters and what doesn't, and links to the free tool that checks it. We update them when Google or the AI providers change their guidance.</p><h2>Where should I start?</h2><p>If you're new to SEO, read <a href="/guides/what-is-an-seo-check">what an SEO check is</a>, then follow the <a href="/guides/how-to-check-website-seo">10-minute routine</a>. If your site doesn't appear in Google at all, start with <a href="/guides/why-is-my-website-not-on-google">why isn't my website on Google?</a></p><h2>Guides for local businesses</h2><p>Serve customers in a particular town? The <a href="/guides/local-seo-checklist">local SEO checklist</a> and <a href="/guides/google-business-profile">Google Business Profile guide</a> cover the steps that put you in the map pack.</p><h2>Guides for AI search</h2><p>To get recommended by ChatGPT, Claude, Perplexity and Google's AI Overviews, read <a href="/guides/ai-search-optimisation">AI search optimisation</a>, then decide which crawlers to let in with our guide to <a href="/guides/block-ai-training-bots">blocking AI training bots</a>, and find out <a href="/guides/llms-txt">whether you need llms.txt</a>.</p>`, guides: true,
  },
  {
    path: "/guides/what-is-an-seo-check", crumb: "What is an SEO check?", parent: ["/guides", "Guides"], article: true,
    title: "What Is an SEO Check? (And What It Can't Tell You)", desc: "What an SEO check looks at, how to read the score, and what no SEO checker can measure – explained in plain English.",
    h1: "What is an SEO check?", lead: "An SEO check reads a web page the way a search engine does and reports anything that could stop it being found, understood or chosen.",
    sections: `<h2>What does an SEO check look at?</h2>
<p>A good check covers three things. <strong>Can search engines reach the page?</strong> (status code, robots.txt, noindex, canonical, sitemap). <strong>Can they understand it?</strong> (title, headings, content, structured data). <strong>Will people want to click and stay?</strong> (snippet, speed, mobile usability, trust). Newer tools, including XKey, add a fourth: <strong>can AI assistants find and cite it?</strong></p>
<h2>How should I read the score?</h2>
<p>Scores are weighted: problems that stop a page appearing at all count far more than nice-to-haves. Treat the score as a to-do list, not a grade – a page scoring 85 with a critical indexing problem is in more trouble than one scoring 75 with minor warnings.</p>
<h2>What can't an SEO checker tell you?</h2>
<ul><li><strong>Your actual rankings</strong> – that needs <a href="/guides/google-search-console">Google Search Console</a> or a rank tracker.</li><li><strong>How strong your competitors are</strong> for a particular search.</li><li><strong>Your backlink profile</strong> in full – that requires a crawl of the whole web.</li><li><strong>Whether your content is the best answer</strong> – that's still a human judgement.</li></ul>
<p>Ready? <a href="/">Run a free SEO check</a>.</p>`,
  },
  {
    path: "/guides/how-to-check-website-seo", crumb: "How to check a website's SEO", parent: ["/guides", "Guides"], article: true,
    title: "How to Check a Website's SEO in 10 Minutes", desc: "A simple 10-minute routine to check any website's SEO: one-page check, site audit, Search Console and a competitor comparison.",
    h1: "How to check a website's SEO in 10 minutes", lead: "You don't need to be technical. Follow these steps in order and you'll know where a site stands and what to fix first.",
    sections: `<h2>1. Check the most important page (2 minutes)</h2>
<p>Run the <a href="/">free SEO check</a> on the home page or your most important service page. Fix anything marked <strong>critical</strong> first.</p>
<h2>2. Crawl the whole site (3 minutes)</h2>
<p>Run a <a href="/website-audit">website audit</a> to find broken links, duplicate titles and orphan pages across the site.</p>
<h2>3. Look at Google's own data (3 minutes)</h2>
<p>In <a href="/guides/google-search-console">Google Search Console</a>, check the <strong>Pages</strong> report for pages that aren't indexed, and the <strong>Performance</strong> report for the searches you already appear for. If you haven't set it up, do it today – it's free.</p>
<h2>4. Compare with a competitor (2 minutes)</h2>
<p>Use the <a href="/seo-comparison">competitor comparison</a> against a business that ranks above you, and note where they're ahead.</p>
<h2>5. Keep watching</h2>
<p>Turn on <a href="/seo-monitoring">free weekly monitoring</a> so you hear about problems before they cost you visitors.</p>`,
    faqs: [["How often should I check my website's SEO?", "After any big change – a redesign, new plugin or new pages – and otherwise once a month. Weekly monitoring catches problems in between."], ["Do I need paid SEO tools?", "Not to start. Free checks plus Google Search Console cover most of what a small business needs; paid tools add keyword and backlink data."], ["Can I check a website I don't own?", "Yes – XKey checks any public page. Search Console data needs you to verify ownership, though."]],
  },
  {
    path: "/guides/ai-search-optimisation", crumb: "AI search optimisation", parent: ["/guides", "Guides"], article: true,
    title: "AI Search Optimisation: Get Found by ChatGPT & AI", desc: "How to get your business found and cited by ChatGPT, Claude, Perplexity and Google AI Overviews: crawl access, entities, answers and trust.",
    h1: "AI search optimisation: getting found by ChatGPT and AI Overviews", lead: "AI assistants are becoming a front door to the web. Here's how to make sure they can find, understand and recommend your business.",
    sections: `<h2>1. Let the right crawlers in</h2>
<p>AI search features fetch pages with their own crawlers – for example OAI-SearchBot (ChatGPT search), Claude-SearchBot, PerplexityBot and Googlebot (AI Overviews). If robots.txt blocks them, you can't be cited. Training crawlers such as GPTBot and Google-Extended are separate: blocking them doesn't remove you from search. Test your rules with the <a href="/robots-txt-tester">robots.txt tester</a>, and see our guide to <a href="/guides/block-ai-training-bots">blocking training bots without leaving AI search</a>.</p>
<h2>2. Make it obvious who you are</h2>
<p>Add Organization or LocalBusiness structured data with your name, website, logo, contact details and <code>sameAs</code> links to official profiles such as your Google Business Profile and LinkedIn page. Keep the same name and details everywhere.</p>
<h2>3. Answer questions directly</h2>
<p>Write headings as the questions customers ask ("How much does a new boiler cost?") and answer in the first sentence underneath. AI tools quote clear, specific answers far more readily than marketing copy.</p>
<h2>4. Show you're current and accountable</h2>
<p>Show a "last updated" date, add <code>dateModified</code> to your structured data, and link to About, Contact and Privacy pages. Avoid <code>nosnippet</code> unless you really mean to stop your text being quoted.</p>
<h2>5. Earn mentions elsewhere</h2>
<p>Assistants also weigh what other sites say about you: reviews, directories, local news and genuine discussions. That part takes time and can't be faked.</p>
<p>Check your site now with the <a href="/ai-seo-checker">AI SEO checker</a>.</p>`,
    faqs: [["Is GEO different from SEO?", "Mostly it's the same work done more thoroughly. The extra parts are AI crawler access, clear information about who you are and direct answers to questions."], ["Can I pay to appear in AI answers?", "Not in the organic answers. Be wary of anyone promising guaranteed placement in ChatGPT or AI Overviews."], ["How do I know if AI assistants mention my business?", "Ask them. Search for your service and town in ChatGPT, Perplexity and Google, note who gets named, and repeat monthly."]],
  },
  {
    path: "/guides/core-web-vitals", crumb: "Core Web Vitals explained", parent: ["/guides", "Guides"], article: true,
    title: "Core Web Vitals Explained: LCP, INP and CLS", desc: "Core Web Vitals in plain English: what LCP, INP and CLS measure, Google's thresholds, and the most common fixes for each.",
    h1: "Core Web Vitals explained", lead: "Google's Core Web Vitals measure how fast and stable a page feels to real visitors. Here's what each one means and how to improve it.",
    sections: `<h2>LCP – Largest Contentful Paint (good: 2.5 s or less)</h2>
<p>How long until the biggest thing on screen – usually a hero image or headline – appears. Common fixes: faster hosting or a CDN, compressing and resizing the hero image, not lazy-loading the first image, and removing render-blocking scripts.</p>
<h2>INP – Interaction to Next Paint (good: 200 ms or less)</h2>
<p>How quickly the page reacts when someone taps or clicks. Common fixes: less JavaScript, removing heavy third-party widgets and splitting long tasks.</p>
<h2>CLS – Cumulative Layout Shift (good: 0.1 or less)</h2>
<p>How much the page jumps around while loading. Common fixes: giving images and embeds a width and height, reserving space for adverts and banners, and loading fonts carefully.</p>
<h2>Lab data vs real-user data</h2>
<p>Lab tests (Lighthouse) load your page once on a simulated phone. Real-user data (the Chrome UX Report) comes from actual Chrome visitors over 28 days, and it's what Google uses. XKey's <a href="/page-speed-checker">page speed checker</a> shows both.</p>`,
    faqs: [["Where can I find my Core Web Vitals?", "In Google Search Console's Core Web Vitals report, in PageSpeed Insights, or in XKey's page speed checker."], ["What happened to FID?", "Interaction to Next Paint (INP) replaced First Input Delay as a Core Web Vital in March 2024."], ["Why does my site have no real-user data?", "The Chrome UX Report only covers pages and sites with enough Chrome visits. Until then, use the lab test as a guide."]],
  },
  {
    path: "/guides/why-is-my-website-not-on-google", crumb: "Why isn't my website on Google?", parent: ["/guides", "Guides"], article: true,
    title: "Why Isn't My Website on Google? 9 Causes and Fixes", desc: "Can't find your website on Google? The nine most common causes – from a stray noindex tag to a brand-new domain – and how to fix each one.",
    h1: "Why isn't my website on Google?", lead: "If you search for your business and your website doesn't appear, one of a handful of problems is almost always to blame. Here's how to find which one, in the order most likely to matter.",
    sections: `<h2>First: is it really missing?</h2>
<p>Type <code>site:yourdomain.co.uk</code> into Google. If you see a list of your pages, your site <em>is</em> indexed – it just isn't ranking for the words you tried, which is a different problem (see cause 8). If Google shows nothing at all, work through the causes below. The quickest way to test most of them at once is a <a href="/">free SEO check</a> on your home page.</p>
<h2>1. The site is very new</h2>
<p>Google has to discover a site before it can index it. A brand-new domain with no links pointing at it can take anything from a few days to several weeks to appear. You can speed this up by adding the site to Google Search Console and submitting your sitemap – our <a href="/guides/google-search-console">Search Console guide</a> walks through it.</p>
<h2>2. A noindex tag is telling Google to stay away</h2>
<p>This is the most common cause on sites that were built on a staging server. A <code>&lt;meta name="robots" content="noindex"&gt;</code> tag, or an <code>X-Robots-Tag: noindex</code> header, asks search engines not to list the page. In WordPress, check that <strong>Settings › Reading › Discourage search engines</strong> is unticked. XKey flags noindex as a critical problem.</p>
<h2>3. robots.txt is blocking Googlebot</h2>
<p>A single line – <code>Disallow: /</code> under <code>User-agent: *</code> – blocks the whole site. Paste your rules into the <a href="/robots-txt-tester">robots.txt tester</a> and test your home page against Googlebot. Remember that robots.txt stops crawling, not indexing: a blocked page can still appear as a bare link with no description, which is rarely what you want.</p>
<h2>4. The page returns an error</h2>
<p>Pages that answer with a 404, 410 or 5xx status code are dropped from Google. So are pages Google thinks are "soft 404s" – they say 200 OK but look empty or like an error page. Our <a href="/guides/broken-links-and-redirects">guide to broken links and redirects</a> explains how to fix them.</p>
<h2>5. The canonical tag points somewhere else</h2>
<p>A canonical tag tells Google which address is the "real" version of a page. If every page on your site points its canonical at the home page, or at the old staging domain, Google will index that address instead of yours. Each page should normally point to itself.</p>
<h2>6. There's not enough on the page</h2>
<p>Google doesn't index everything it crawls. Pages with only a heading and a photo, or text copied from another site, are often crawled and then left out. In Search Console these show as "Crawled – currently not indexed". Write something genuinely useful – what you do, where, for whom, how much it costs and how to get in touch.</p>
<h2>7. Google can't see the content</h2>
<p>If your text only appears after JavaScript runs, or is inside images, Google may see an almost blank page. Most modern site builders are fine, but some single-page apps and old Flash-style templates are not. The <a href="/">SEO check</a> reports the word count Google can actually read.</p>
<h2>8. It's indexed but not ranking</h2>
<p>If <code>site:</code> finds you but your name or service doesn't, you're competing with other pages. Make sure your title and H1 say exactly what you do and where, set up a Google Business Profile if you serve local customers (see our <a href="/guides/local-seo-checklist">local SEO checklist</a>), and earn a few genuine links from local directories, suppliers and associations.</p>
<h2>9. A manual action or security issue</h2>
<p>Rarely, Google removes a site for spam or because it has been hacked. Search Console's <strong>Security &amp; Manual actions</strong> section will tell you if this has happened and what to fix. Hacked sites often show strange pages in a <code>site:</code> search – Japanese text or pharmacy keywords are common signs.</p>`,
    faqs: [["How long does it take for a new website to appear on Google?", "Usually a few days to a few weeks. Submitting a sitemap in Google Search Console and getting even one link from an established site helps Google find it sooner."], ["Can I pay Google to index my website?", "No. Indexing is free and can't be bought. Google Ads put you in the paid results, but they don't affect whether your pages are indexed or how they rank."], ["Why does my site show on Bing but not Google?", "The two search engines crawl and index separately. Check Google Search Console's Pages report for the reason Google gives, and fix anything marked as an error."]],
  },
  {
    path: "/guides/google-search-console", crumb: "How to set up Google Search Console", parent: ["/guides", "Guides"], article: true,
    title: "How to Set Up Google Search Console (Step by Step)", desc: "Set up Google Search Console in 15 minutes: choose a property type, verify your site, submit a sitemap and learn the four reports that matter most.",
    h1: "How to set up Google Search Console", lead: "Search Console is Google's free tool for website owners. It's the only place to see which searches you appear for, which pages Google has indexed and why others were left out.",
    sections: `<h2>Why every website needs Search Console</h2>
<p>An SEO checker like XKey looks at your pages from the outside. Search Console shows Google's own view from the inside: the actual searches people used to find you, how often you appeared, how many clicked, and any page Google couldn't index along with the reason. It costs nothing and takes about 15 minutes to set up.</p>
<h2>Step 1: choose a property type</h2>
<p>Go to Google Search Console, sign in with a Google account and click <strong>Add property</strong>. You'll see two choices:</p>
<ul><li><strong>Domain property</strong> – covers every version of your site (http and https, www and non-www, and all subdomains). It can only be verified with a DNS record, so you need access to wherever your domain is managed.</li><li><strong>URL-prefix property</strong> – covers one exact address, such as <code>https://www.example.co.uk/</code>. It offers more ways to verify, including uploading a file or adding a meta tag.</li></ul>
<p>If you can edit your DNS, choose Domain. If your web designer manages everything, a URL-prefix property for the exact address your site uses is fine.</p>
<h2>Step 2: verify that you own the site</h2>
<p>For a Domain property, Google gives you a TXT record to add in your DNS settings (at your registrar, or Cloudflare if you use it). For a URL-prefix property, the simplest options are uploading the HTML file Google gives you to your site's root folder, or pasting a meta tag into your home page's <code>&lt;head&gt;</code>. Sites already using Google Analytics or Tag Manager can often verify with one click. Then press <strong>Verify</strong>. DNS changes can take a little while to be seen – if it fails, wait an hour and try again.</p>
<h2>Step 3: submit your sitemap</h2>
<p>Open <strong>Sitemaps</strong>, type the address of your sitemap (often <code>sitemap.xml</code> or <code>sitemap_index.xml</code>) and click Submit. Google should show "Success" and the number of pages it found. Not sure you have one? Run the <a href="/sitemap-checker">sitemap checker</a>, or make one with the <a href="/xml-sitemap-generator">XML sitemap generator</a>.</p>
<h2>Step 4: learn the four reports that matter</h2>
<ul><li><strong>Performance</strong> – searches, clicks, impressions and average position. Filter by page to see what each one ranks for.</li><li><strong>Pages</strong> (under Indexing) – which pages are indexed and, for the rest, why not: noindex, redirect, not found, duplicate or "crawled – currently not indexed".</li><li><strong>URL inspection</strong> – type any address into the bar at the top to see exactly how Google last saw it, and request indexing after you've fixed or published a page.</li><li><strong>Core Web Vitals</strong> – real-visitor speed data, grouped into good, needs improvement and poor. Our <a href="/guides/core-web-vitals">Core Web Vitals guide</a> explains it.</li></ul>
<h2>Step 5: add Bing too</h2>
<p>Bing Webmaster Tools can import your verified sites straight from Search Console, so it takes a couple of minutes. Bing also powers several other search services, so it's worth having.</p>
<h2>What Search Console won't tell you</h2>
<p>It doesn't check your titles, structured data, security headers or AI crawler access in detail, and it only reports on your own site. Pair it with a regular <a href="/">SEO check</a> and <a href="/seo-monitoring">weekly monitoring</a> to catch problems before they show up in Google's data.</p>`,
    faqs: [["Is Google Search Console free?", "Yes, completely. There's no paid version."], ["How long until data appears?", "Usually a few days after verification. Performance data then covers up to the last 16 months, starting from when Google first collected it."], ["Does using Search Console improve my rankings?", "Not by itself. It shows you what to fix and lets you ask Google to recrawl pages, which helps new and updated pages get picked up sooner."]],
  },
  {
    path: "/guides/title-tags", crumb: "How to write title tags", parent: ["/guides", "Guides"], article: true,
    title: "How to Write Title Tags That Fit Google's Results", desc: "How to write title tags that rank and get clicked: why Google cuts titles by pixel width, what to put first, examples and the mistakes to avoid.",
    h1: "How to write title tags that fit Google", lead: "Your title tag is usually the blue headline people see in Google. It's one of the strongest signals of what a page is about, and it decides whether anyone clicks.",
    sections: `<h2>What is a title tag?</h2>
<p>It's the text between <code>&lt;title&gt;</code> and <code>&lt;/title&gt;</code> in a page's HTML. Browsers show it in the tab, social sites use it when a link is shared, and Google uses it for the headline of your search result – which Google calls the "title link".</p>
<h2>Why length is measured in pixels, not characters</h2>
<p>Google cuts long titles to fit the width of the results page, adding "…" at the end. Because letters have different widths – a "W" is far wider than an "i" – a 55-character title in capitals can be cut while a 65-character title in lower case fits. On desktop the space is roughly 600 pixels. Our <a href="/title-tag-checker">title tag checker</a> measures your title the way Google displays it, so you can see exactly where it would be cut.</p>
<h2>A simple formula that works</h2>
<p><strong>Main search phrase + what makes you different + location (if local)</strong>. For example:</p>
<ul><li><em>Emergency Plumber in Preston | 24/7, No Call-Out Fee</em></li><li><em>Wedding Cakes Blackpool | Handmade to Order Since 2009</em></li><li><em>How to Bleed a Radiator (With Pictures)</em></li></ul>
<p>Put the words people actually search for at the start, where they're least likely to be cut and most likely to be read. Your brand name can go at the end if there's room – but on most pages, Google already shows your site name above the title, so it isn't essential.</p>
<h2>Seven mistakes to avoid</h2>
<ol><li><strong>The same title on every page.</strong> Each page needs its own. Duplicate titles make it hard for Google to tell pages apart – the <a href="/website-audit">website audit</a> finds them across your whole site.</li><li><strong>"Home" or "Welcome".</strong> These tell searchers nothing.</li><li><strong>Keyword stuffing.</strong> "Plumber Preston, Plumbers Preston, Cheap Plumber Preston" looks like spam, and Google is likely to rewrite it.</li><li><strong>Too long.</strong> The important part gets cut off.</li><li><strong>Too short.</strong> "Services" wastes space you could use to persuade.</li><li><strong>Not matching the page.</strong> If the title promises prices, show prices – otherwise people bounce back to Google.</li><li><strong>All capitals.</strong> Harder to read and takes up more width.</li></ol>
<h2>Why Google sometimes rewrites your title</h2>
<p>Google can replace a title with text from your H1, headings or links when it thinks the original is too long, stuffed with keywords, the same as other pages or a poor match for the search. Keeping your title accurate, unique and close to your H1 is the best way to have it shown as written.</p>
<p>Need ideas? Try the <a href="/blog-title-generator">blog title generator</a> or let the <a href="/ai-meta-description-generator">AI title and description writer</a> suggest options that fit.</p>`,
    faqs: [["How many characters should a title tag be?", "Around 50–60 characters usually fits, but Google measures pixel width rather than characters, so check it with a pixel-width checker."], ["Should the title tag and H1 be the same?", "They can be similar. The title is written for the search results; the H1 is the heading on the page. Keeping them close helps Google show your title as written."], ["Does changing my title tag affect rankings?", "It can, for better or worse. Change one page at a time and watch its clicks and position in Search Console for a few weeks."]],
  },
  {
    path: "/guides/meta-descriptions", crumb: "How to write a meta description", parent: ["/guides", "Guides"], article: true,
    title: "How to Write a Meta Description That Gets Clicks", desc: "What a meta description is, whether Google uses it, how long it should be and a simple formula for writing one that earns the click – with examples.",
    h1: "How to write a meta description", lead: "A meta description is the short summary that often appears under your title in Google. It doesn't change your ranking directly, but a good one can win you the click.",
    sections: `<h2>Does Google actually use meta descriptions?</h2>
<p>Sometimes. Google has said the description isn't a ranking factor, and it often writes its own snippet from your page text when that matches the search better. But when your description is accurate and relevant, Google frequently shows it as written – and it's also used by Facebook, LinkedIn, WhatsApp and many AI tools when your link is shared. It's worth five minutes per important page.</p>
<h2>How long should it be?</h2>
<p>Like titles, descriptions are cut by width, not character count. Around 140–155 characters usually shows in full on desktop, and a little less on mobile. Put the important part first so a cut-off version still makes sense. The <a href="/title-tag-checker">title tag checker</a> measures both your title and description in pixels.</p>
<h2>A formula for descriptions that get clicked</h2>
<p><strong>What you offer + why choose you + what to do next.</strong></p>
<ul><li><em>Local electrician in Lytham for rewires, fuse boards and EV chargers. NICEIC registered, fixed prices, free quotes – call today.</em></li><li><em>Find out how much a loft conversion costs in 2026, what affects the price and how to save, with real examples from the North West.</em></li></ul>
<p>Use the words people search for – Google shows matching words in bold, which draws the eye. Be specific: numbers, places, prices and guarantees beat vague words like "quality" and "professional".</p>
<h2>Common mistakes</h2>
<ul><li><strong>Leaving it blank</strong> – Google will pick some text from the page, which may be a cookie notice or a menu.</li><li><strong>The same description on every page</strong> – each page needs its own. The <a href="/website-audit">website audit</a> lists duplicates.</li><li><strong>Promising what the page doesn't deliver</strong> – it costs you visitors who leave straight away.</li><li><strong>Using quotation marks</strong> – in some systems a double quote ends the description early.</li></ul>
<h2>How to add one</h2>
<p>Most website builders and SEO plugins (Yoast, Rank Math, Squarespace, Wix, Shopify) have a "search appearance" or "SEO description" box for each page. If you edit HTML yourself, use the <a href="/meta-tag-generator">meta tag generator</a> to create the tag, or let the <a href="/ai-meta-description-generator">AI description writer</a> draft one from your page.</p>`,
    faqs: [["Is a meta description a ranking factor?", "No, not directly. It affects how many people click your result, and more relevant clicks are good for your business either way."], ["Why is Google showing different text from my meta description?", "Google picks the text it thinks best answers each search. A description that clearly summarises the page is more likely to be shown."], ["Do I need a meta description on every page?", "Your important pages should each have a unique one. For very large sites, it's better to leave some blank than to repeat the same text everywhere."]],
  },
  {
    path: "/guides/local-seo-checklist", crumb: "Local SEO checklist", parent: ["/guides", "Guides"], article: true,
    title: "Local SEO Checklist for UK Small Businesses", desc: "A practical local SEO checklist for UK small businesses: Google Business Profile, consistent contact details, local pages, schema, reviews and citations.",
    h1: "Local SEO checklist for UK small businesses", lead: "When someone searches for a plumber, café or accountant \"near me\", Google shows a map and three businesses before any normal results. This checklist covers what gets you into that map pack and onto page one.",
    sections: `<h2>How Google decides local rankings</h2>
<p>Google says local results are based mainly on three things: <strong>relevance</strong> (how well your business matches the search), <strong>distance</strong> (how far you are from the searcher or the place they named) and <strong>prominence</strong> (how well known you are, from reviews, links and mentions across the web). You can't move your premises, but you can improve the other two.</p>
<h2>1. Claim and complete your Google Business Profile</h2>
<p>This is the single most important step for local search. Choose the most accurate primary category, add your hours, services, service areas, photos and a description written for customers. Our <a href="/guides/google-business-profile">Google Business Profile guide</a> covers setup and verification.</p>
<h2>2. Keep your name, address and phone number identical everywhere</h2>
<p>Your business name, address and phone number (often called NAP) should match exactly on your website, Google profile, Facebook page and directory listings. "Unit 4, 12 High St" on one site and "12 High Street, Unit 4" on another isn't a disaster, but a different phone number or an old address is. Put your details in the footer of every page as text, not just in an image.</p>
<h2>3. Give each service and main town its own page</h2>
<p>A page for "boiler repairs" and another for "boiler installation" can each rank for its own searches. If you serve several towns, a page for each <em>main</em> area is fine – as long as each says something genuinely specific: jobs you've done there, travel times, local regulations or prices. Dozens of near-identical "plumber in [town]" pages are doorway pages and break Google's spam rules.</p>
<h2>4. Add LocalBusiness structured data</h2>
<p>LocalBusiness schema tells Google and AI assistants your name, address, phone, hours, area served and website in a format machines can read without guessing. Create it with the <a href="/schema-generator">local business schema generator</a>, then check it with the <a href="/local-seo-checker">local SEO checker</a>.</p>
<h2>5. Get reviews the honest way</h2>
<p>Ask every happy customer, and make it easy with a short link to your Google review form. Reply to every review, especially the bad ones – calmly and helpfully. Never buy reviews, write your own, offer discounts for them or only ask customers you know are happy: it breaks Google's rules, and the Digital Markets, Competition and Consumers Act 2024 made fake reviews illegal in the UK.</p>
<h2>6. List your business in the right directories</h2>
<p>To see where your competitors are listed and you aren't, put both sites into the free <a href="/backlink-checker">backlink checker</a>. A handful of accurate listings beats hundreds of junk ones. Good places to start: Bing Places, Apple Business Connect, Yell, Thomson Local, Facebook, your trade body (such as Gas Safe, NICEIC or the Federation of Master Builders), your local chamber of commerce and any respected sites for your industry.</p>
<h2>7. Be visible to AI assistants too</h2>
<p>People increasingly ask ChatGPT or Google's AI Overviews for local recommendations. They can only suggest businesses they can read and understand – check yours with the <a href="/ai-seo-checker">AI SEO checker</a> and read our <a href="/guides/ai-search-optimisation">AI search guide</a>.</p>
<h2>8. Check how you look in other towns</h2>
<p>Results change from street to street. The <a href="/local-search-checker">local search checker</a> shows Google's results as they appear in any UK town, so you can see who you're really up against.</p>`,
    faqs: [["Do I need a website for local SEO?", "You can appear in the map pack with only a Google Business Profile, but a website gives Google more to go on and gives customers somewhere to check you out. Most top-ranking local businesses have both."], ["Can I rank in a town where I don't have an office?", "In the normal results, yes, with a genuinely useful page about your work there. In the map pack it's much harder, because distance matters a lot."], ["Should I use a virtual office address?", "No. Google's guidelines don't allow mailboxes or virtual offices as a business address unless the office is staffed during your business hours. Service-area businesses can hide their address and list the areas they cover instead."]],
  },
  {
    path: "/guides/google-business-profile", crumb: "Google Business Profile guide", parent: ["/guides", "Guides"], article: true,
    title: "Google Business Profile: How to Set It Up and Verify", desc: "How to create, verify and get the most from a free Google Business Profile: categories, service areas, video verification, photos, posts and reviews.",
    h1: "Google Business Profile: set up and verify", lead: "A Google Business Profile is the free listing that shows your business on Google Maps and in the local map pack. For most local businesses, it brings in more calls than the website does.",
    sections: `<h2>Before you start</h2>
<p>Search Google Maps for your business name first. If a profile already exists – Google sometimes creates them from public information – you'll claim it rather than create a new one. Duplicate profiles confuse customers and Google, so never make a second one. You'll need a Google account; use one the business controls, not a personal or employee account that might disappear.</p>
<h2>Step 1: create or claim the profile</h2>
<p>Go to Google Business Profile, enter your business name and choose your <strong>primary category</strong>. This is the most important choice you'll make: pick the one that describes what you <em>are</em> ("Plumber", "Wedding photographer", "Italian restaurant") rather than everything you do. You can add extra categories later.</p>
<h2>Step 2: storefront or service-area business</h2>
<p>If customers visit you, enter your address. If you go to them – trades, cleaners, mobile hairdressers – you can hide your address and list the towns or postcodes you cover instead. You can't use a PO box, virtual office or someone else's address.</p>
<h2>Step 3: verification</h2>
<p>Google needs to confirm you really run the business, and Google decides which method you're offered. For most new profiles that's now a <strong>short video</strong>, recorded on your phone in one continuous take. It typically needs to show:</p>
<ul><li><strong>Where you are</strong> – your street, nearby businesses or your signage.</li><li><strong>That the business is real</strong> – equipment, stock, branded vehicles or your workspace.</li><li><strong>That you manage it</strong> – for example unlocking the door, opening a till or showing tools only staff would have.</li></ul>
<p>Keep faces and private documents out of shot. Reviews of the video usually take a few working days. Older or established profiles may be offered phone, email or instant verification instead. If the video is rejected, read the reason carefully, fix it and submit a new one rather than creating another profile.</p>
<h2>Step 4: fill in everything</h2>
<ul><li><strong>Hours</strong>, including bank holidays and special hours.</li><li><strong>Services or menu</strong>, with prices where you can.</li><li><strong>Description</strong> – up to 750 characters, written for customers. Mention what you do and where, without stuffing in keywords.</li><li><strong>Photos</strong> – real photos of your work, team, premises and vehicles. Profiles with photos get far more attention than those without.</li><li><strong>Website link</strong> – to your home page or the most relevant local page.</li></ul>
<h2>Step 5: keep it active</h2>
<p>Add new photos, share updates and offers as posts, keep your hours accurate and reply to every review. Make sure your name, address and phone number match your website exactly – see the <a href="/guides/local-seo-checklist">local SEO checklist</a>.</p>
<h2>Rules that get profiles suspended</h2>
<p>Adding keywords or towns to your business name ("Smith Plumbing – Best Plumber Preston"), using a fake or shared address, creating more than one profile per location, and buying or faking reviews. Suspension can take weeks to reverse, so it isn't worth the risk.</p>
<p>Once your profile is live, check your website's local signals with the <a href="/local-seo-checker">local SEO checker</a>.</p>`,
    faqs: [["Does a Google Business Profile cost anything?", "No. It's free. Be wary of anyone calling to say your listing will be removed unless you pay – Google doesn't charge for profiles."], ["Can I choose postcard verification?", "Google decides which verification methods you're offered, and for most new profiles that's video. If another option is available you'll see it on the verification screen."], ["How long does it take to appear on Google Maps?", "Usually within a few days of successful verification, though edits can take a little longer to show everywhere."]],
  },
  {
    path: "/guides/schema-markup", crumb: "Schema markup for small businesses", parent: ["/guides", "Guides"], article: true,
    title: "Schema Markup for Small Businesses: What to Add", desc: "Schema markup in plain English: which types a small business website needs, what Google still shows as rich results in 2026, and how to add it safely.",
    h1: "Schema markup for small businesses", lead: "Schema markup – also called structured data – is a short block of code that tells search engines and AI assistants exactly what's on a page, so they don't have to guess.",
    sections: `<h2>What schema markup does</h2>
<p>A person reading your contact page knows which string of digits is your phone number and that "Mon–Fri 9–5" means your opening hours. A machine has to guess. Schema markup labels these facts using a shared vocabulary from schema.org, usually in a format called JSON-LD that sits in the page's code without changing how it looks. Google recommends JSON-LD because it's the easiest to add and maintain.</p>
<h2>What it can and can't do</h2>
<p>Structured data can make your result eligible for extra features – star ratings on products, event dates, breadcrumbs and more – and it helps Google and AI assistants connect your website with your business. It doesn't guarantee those features, and it isn't a direct ranking boost. Google ignores markup that describes things not visible on the page, and misleading markup can lead to a manual action.</p>
<h2>The schema types most small businesses need</h2>
<ul><li><strong>Organization</strong> or <strong>LocalBusiness</strong> (or a more specific type such as Plumber, Dentist or Restaurant) – your name, logo, address, phone, hours, area served, website and <code>sameAs</code> links to your official profiles. Put it on your home page and contact page. Create it with the <a href="/schema-generator">local business schema generator</a>.</li><li><strong>WebSite</strong> – your site name, which helps Google show the right name above your results.</li><li><strong>BreadcrumbList</strong> – shows where a page sits on your site, and can replace the address in your search result with a tidy path.</li><li><strong>Product</strong> – for shops: price, currency, availability and reviews from real customers.</li><li><strong>Article</strong> – for blog posts and guides: headline, author and dates.</li><li><strong>Event</strong> – for gigs, classes and open days with dates and locations.</li></ul>
<h2>What changed recently</h2>
<p>Google has been cutting back the rich results it shows. HowTo rich results were removed in 2023. FAQ rich results were limited to government and health sites the same year, and on 7 May 2026 Google stopped showing them for everyone. There's no penalty for keeping FAQ markup, but it no longer earns extra space in Google, so it isn't worth adding new. Star ratings for a business reviewing <em>itself</em> – on its own LocalBusiness or Organization markup – haven't been shown since 2019.</p>
<h2>How to add schema markup</h2>
<p>On WordPress, plugins such as Yoast and Rank Math add the basics automatically. Shopify, Wix and Squarespace include some markup too – check what's already there before adding more, so you don't end up with two conflicting versions. For custom sites, paste the JSON-LD into the page's <code>&lt;head&gt;</code> or just before <code>&lt;/body&gt;</code>.</p>
<h2>How to check it</h2>
<p>Run the <a href="/schema-checker">schema checker</a> on the page. It validates your JSON-LD, lists the types found and shows any properties Google requires that are missing. Re-check after every redesign or plugin update – broken markup is one of the most common things a site change quietly breaks.</p>`,
    faqs: [["Is schema markup a ranking factor?", "Not directly. It helps search engines understand your pages and can make them eligible for rich results, which can improve clicks."], ["Do AI assistants use schema markup?", "AI search tools read structured data along with the visible page. Clear Organization or LocalBusiness markup makes it easier for them to connect your website with the right business details."], ["Should I remove my FAQ schema?", "There's no need to rush. Google says it doesn't cause problems, though it no longer produces rich results. Remove it next time you're editing the page if you'd like tidier code."]],
  },
  {
    path: "/guides/llms-txt", crumb: "What is llms.txt?", parent: ["/guides", "Guides"], article: true,
    title: "What Is llms.txt and Does Your Website Need One?", desc: "What llms.txt is, who uses it, what Google says about it, and whether it's worth adding to your website – an honest, plain-English answer.",
    h1: "What is llms.txt and does your website need one?", lead: "llms.txt is a short text file that gives AI tools a summary of your website and a list of its most important pages. It's simple to add – but it's worth knowing what it does and doesn't do.",
    sections: `<h2>Where llms.txt came from</h2>
<p>The format was proposed in September 2024 by Jeremy Howard of Answer.AI. The idea: web pages are full of menus, adverts and scripts that large language models (LLMs) have to wade through. A plain Markdown file at <code>yourdomain.co.uk/llms.txt</code> could give them a clean summary instead – who you are, what the site covers and links to the pages that matter.</p>
<h2>What goes in the file</h2>
<p>A typical llms.txt has:</p>
<ul><li>a heading with your site or business name,</li><li>a one-line summary in a quote block,</li><li>a short paragraph with any important context, and</li><li>sections of links, each with a few words about the page – for example your services, prices, guides and contact page.</li></ul>
<p>You can see XKey's own at <a href="/llms.txt">xkey.co.uk/llms.txt</a>, or build yours in a minute with the <a href="/llms-txt-generator">llms.txt generator</a>.</p>
<h2>Does Google use it?</h2>
<p>No – not for Search. Google's Search guidance says you don't need llms.txt or any other special file to appear in AI Overviews or AI Mode; those features draw on the normal search index, so ordinary SEO is what counts. Other parts of Google take a different view: in 2026 Lighthouse added an experimental check for llms.txt as part of assessing whether sites are ready for AI agents browsing on people's behalf.</p>
<h2>Do ChatGPT, Claude or Perplexity use it?</h2>
<p>None of the big AI companies has published a commitment to read llms.txt when deciding what to cite. Some AI coding tools and documentation sites do use it, and AI agents may fetch it when they're sent to explore a site. In short: there's no evidence it boosts your visibility today, and no evidence it does any harm.</p>
<h2>So should you add one?</h2>
<p>If it takes you ten minutes, yes – it's a tidy summary of your site, it costs nothing and it may become more useful as AI agents spread. But it is <em>not</em> a replacement for the things that demonstrably matter for AI search:</p>
<ul><li>letting AI search crawlers in through robots.txt (see our guide to <a href="/guides/block-ai-training-bots">blocking training bots without leaving AI search</a>),</li><li>clear Organization or LocalBusiness <a href="/guides/schema-markup">schema markup</a>,</li><li>pages that answer real questions directly, and</li><li>being indexed by Google and Bing in the first place.</li></ul>
<p>The <a href="/ai-seo-checker">AI SEO checker</a> tests all of these, including whether you have an llms.txt file, and weights them by how much they really matter.</p>`,
    faqs: [["Is llms.txt the same as robots.txt?", "No. robots.txt tells crawlers which pages they may visit. llms.txt is a summary and reading list; it doesn't allow or block anything."], ["Where does the llms.txt file go?", "In the root of your website, so it loads at yourdomain.co.uk/llms.txt – the same place as robots.txt."], ["What is llms-full.txt?", "An optional companion file containing the full text of your key pages in Markdown. It's mainly used by software documentation sites and isn't needed for most businesses."]],
  },
  {
    path: "/guides/block-ai-training-bots", crumb: "Block AI training bots", parent: ["/guides", "Guides"], article: true,
    title: "Block AI Training Bots but Stay Visible in AI Search", desc: "Stop AI companies training on your content while staying visible in ChatGPT search, Perplexity and Google AI Overviews – with robots.txt examples.",
    h1: "How to block AI training bots but stay in AI search", lead: "Many businesses want to stop AI companies copying their content for training – without disappearing from the AI assistants their customers now use to find them. With the right robots.txt rules, you can do both.",
    sections: `<h2>Training crawlers and search crawlers are different</h2>
<p>Most AI companies now use separate crawlers for separate jobs. <strong>Training crawlers</strong> collect pages to build future AI models. <strong>Search crawlers</strong> fetch pages so an assistant can find, quote and link to you when someone asks a question. A third kind fetches a page only when a user asks the assistant to look at it. Blocking a training crawler doesn't stop the search crawler from the same company.</p>
<h2>The main crawlers to know</h2>
<ul><li><strong>OpenAI</strong> – GPTBot (training), OAI-SearchBot (ChatGPT search), ChatGPT-User (pages a user asks about).</li><li><strong>Anthropic</strong> – ClaudeBot (training), Claude-SearchBot (search), Claude-User (pages a user asks about).</li><li><strong>Perplexity</strong> – PerplexityBot (search), Perplexity-User (pages a user asks about).</li><li><strong>Google</strong> – Googlebot crawls for Search, including AI Overviews and AI Mode. <em>Google-Extended</em> isn't a separate crawler but a robots.txt token that controls whether your content is used for Gemini models; blocking it doesn't affect Google Search.</li><li><strong>Apple</strong> – Applebot (search features such as Siri and Spotlight); Applebot-Extended controls use for Apple's AI training.</li><li><strong>Common Crawl</strong> – CCBot builds a public web archive that many AI models have been trained on.</li></ul>
<h2>A robots.txt that blocks training and allows search</h2>
<pre><code>User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: *
Allow: /

Sitemap: https://yourdomain.co.uk/sitemap.xml</code></pre>
<p>OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot and Bingbot aren't named, so they follow the <code>User-agent: *</code> group and stay allowed. Create a version tailored to your site with the <a href="/robots-txt-generator">robots.txt generator</a>, then test individual pages with the <a href="/robots-txt-tester">robots.txt tester</a>.</p>
<h2>Things robots.txt can't do</h2>
<ul><li><strong>It's a request, not a lock.</strong> Reputable companies follow it; badly behaved scrapers ignore it. For those, firewall rules are the answer – Cloudflare, for example, offers a setting to block known AI crawlers at the network level.</li><li><strong>It isn't retrospective.</strong> Content already collected for past training isn't removed.</li><li><strong>Crawler names change.</strong> New bots appear every year, so review your rules every few months.</li></ul>
<h2>Watch out for blocking everything by accident</h2>
<p>Some security plugins, hosting firewalls and "block AI" settings stop search crawlers as well as training crawlers. If your business never appears in ChatGPT or Perplexity answers, that's one of the first things to check. The <a href="/ai-seo-checker">AI SEO checker</a> fetches your robots.txt and shows which AI crawlers are allowed in, one by one.</p>
<p>For more on getting recommended by AI assistants, read our <a href="/guides/ai-search-optimisation">AI search optimisation guide</a>.</p>`,
    faqs: [["Will blocking GPTBot remove me from ChatGPT?", "No. ChatGPT's search feature uses OAI-SearchBot, which is controlled separately. Block GPTBot and allow OAI-SearchBot to stay findable without contributing to training."], ["Does blocking Google-Extended affect my Google rankings?", "No. Google says Google-Extended doesn't affect inclusion or ranking in Google Search, including AI Overviews."], ["How often should I update my AI crawler rules?", "Every few months, or whenever a major AI company announces a new crawler. The robots.txt generator is kept up to date with the main ones."]],
  },
  {
    path: "/guides/broken-links-and-redirects", crumb: "Broken links and redirects", parent: ["/guides", "Guides"], article: true,
    title: "Broken Links, 404 Errors and Redirects Explained", desc: "What 404 errors, soft 404s, 301 and 302 redirects and redirect chains mean for SEO, when they matter and how to find and fix them on your website.",
    h1: "Broken links, 404s and redirects explained", lead: "Every website collects broken links over time – pages get renamed, products sell out and other sites move. A few don't matter much. Left unchecked, they waste visitors, crawl time and links you've earned.",
    sections: `<h2>What the status codes mean</h2>
<ul><li><strong>200 OK</strong> – the page loaded normally.</li><li><strong>301 Moved Permanently</strong> – the page has a new permanent address. Search engines move it to the new URL and pass along its signals.</li><li><strong>302 Found / 307 Temporary Redirect</strong> – the page is somewhere else for now. Google treats a long-standing temporary redirect much like a permanent one, but 301 is clearer when a move is permanent.</li><li><strong>404 Not Found</strong> – nothing exists at this address.</li><li><strong>410 Gone</strong> – the page has been removed deliberately. Google drops it slightly faster than a 404.</li><li><strong>5xx</strong> – a server error. If these persist, Google slows down crawling and may drop pages.</li></ul>
<h2>Do 404 errors hurt SEO?</h2>
<p>Not on their own. Google has said 404s for pages that genuinely no longer exist are normal and don't count against the rest of your site. They matter when:</p>
<ul><li><strong>your own pages link to them</strong> – visitors hit a dead end, and Google wastes time crawling nothing;</li><li><strong>other websites link to them</strong> – any value from those links is lost; or</li><li><strong>an important page is broken by mistake</strong> – it drops out of Google.</li></ul>
<h2>Soft 404s</h2>
<p>A soft 404 is a page that returns "200 OK" but is empty, says "not found", or is a thin "no results" page. Google treats it as an error anyway and reports it in Search Console. Fix it by returning a real 404 or 410, redirecting to a genuinely relevant page, or adding proper content.</p>
<h2>When to redirect and when to let a page 404</h2>
<p>Redirect with a 301 when there's a close replacement – the renamed page, the new version of a product or the category it belonged to. Don't redirect everything to your home page; Google often treats that as a soft 404 and visitors find it confusing. If there's truly no equivalent, a helpful 404 page with a search box and links to your main sections is the right answer.</p>
<h2>Redirect chains</h2>
<p>A chain is when page A redirects to B, which redirects to C. Each hop adds delay, and Google stops following after several hops. Chains usually build up through redesigns – http to https, then non-www to www, then an old URL to a new one. Point every old address straight at its final destination, and update your internal links to use the final URL directly.</p>
<h2>How to find broken links</h2>
<ul><li>Check any single page with the <a href="/broken-link-checker">broken link checker</a>.</li><li>Crawl up to 250 pages with the <a href="/website-audit">website audit</a> to find broken internal links, redirect chains and the pages linking to them.</li><li>In Google Search Console, the <strong>Pages</strong> report lists URLs that are "Not found (404)" or "Soft 404", and the <strong>Links</strong> report shows which of your pages other sites link to most.</li></ul>
<h2>Prevent them in the first place</h2>
<p>Before changing a page's address, set up the redirect at the same time. After a redesign, crawl the old sitemap against the new site to make sure every old URL lands somewhere sensible. And turn on <a href="/seo-monitoring">weekly monitoring</a> so a broken key page doesn't go unnoticed for months.</p>`,
    faqs: [["How many redirects is too many?", "Ideally one hop from the old address to the new one. Two is fine; long chains slow pages down and risk Google giving up before the end."], ["Should I use a 404 or a 410 for deleted pages?", "Either works. A 410 tells Google the removal is deliberate and can get the page dropped a little faster."], ["Do redirects lose SEO value?", "A 301 to a closely matching page keeps nearly all of it. Redirecting to an unrelated page, such as the home page, loses most of it."]],
  },
  ...SECTOR_GUIDES,
  ...BEGINNER_GUIDES,
  ...BUILDER_GUIDES,
  ...TRADE_GUIDES,
  {
    path: "/about", crumb: "About", title: "About XKey | Free UK SEO Checker",
    desc: "XKey is a free SEO and AI search checker made by IceWork, a small web studio in Blackpool, for UK businesses.",
    h1: "About XKey", lead: "XKey is a free SEO and AI search checker for UK businesses, made by IceWork, a small web studio in Blackpool.",
    sections: `<h2>Why we built it</h2>
<p>Most SEO tools are built for agencies: expensive, hidden behind sign-ups, and full of jargon. Small business owners need something simpler – a clear score, a short list of what matters, and an honest explanation. We also wanted a tool that takes AI search seriously, because that's where search is heading.</p>
<h2>Why is everything free?</h2>
<p>Because "free" should mean free. Most SEO tools that call themselves free want something back – an email address for their mailing list, a "Sign in with Google" to read your data, card details for a trial, or a cap of a few checks before you have to pay. XKey asks for none of that. Every tool, report, download and weekly monitor is free, with no account and no paid version waiting behind it. XKey is paid for by <a href="https://icework.co.uk" rel="noopener">IceWork</a>: some people who use it later ask IceWork to fix their website, and that's the only business model.</p>
<h2>How it's built</h2>
<p>XKey runs on Cloudflare's network. Checks are based on what Google and the AI providers document publicly, and we update them as their guidance changes. We fetch pages the way a search engine does, follow robots.txt in the site audit and don't keep your content.</p>
<h2>Who's behind it</h2>
<p>XKey is made by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, a web design studio in Blackpool. If you'd like help fixing what XKey finds, IceWork can do it – but the tools are free to use either way.</p>`,
  },
  {
    path: "/contact", crumb: "Contact", title: "Contact XKey | Free SEO Checker Help & Feedback",
    desc: "Contact the team behind XKey, the free UK SEO and AI search checker. Email us any time – we aim to reply within 24 hours.",
    h1: "Contact XKey", lead: "Questions, feedback or found a bug? Email us any time – we aim to reply within 24 hours.",
    sections: `<p><a class="btn" href="mailto:iceworks@f1rst.co.uk?subject=XKey">Email iceworks@f1rst.co.uk</a></p><p>XKey is run by IceWork, Blackpool, Lancashire, UK.</p>
<h2>What should I include when reporting a problem?</h2><p>The web address you checked, what you expected and what the report said. A screenshot helps. If a check seems wrong for your site, tell us – it's the fastest way for us to improve the tool.</p>
<h2>What can I ask about?</h2><p>Anything to do with XKey: a check that gave a result you don't understand, a tool that didn't work, an idea for a new tool, or a question about what a report means for your site. We read every message ourselves – there's no ticket system and no chatbot – and we reply from the same address. We don't need an account, a phone number or any details beyond your email to help.</p>
<h2>Is there a phone number?</h2><p>Not for XKey. Email lets us look at the page you're asking about before we reply, so you get a proper answer rather than a guess. If your question is about getting a website built or repaired, IceWork's own site has its contact details.</p>
<h2>Can you fix my website for me?</h2><p>XKey's tools are free for everyone. If you'd like the fixes done for you, <a href="https://icework.co.uk" rel="noopener">IceWork</a> builds and repairs websites for UK businesses – just mention XKey when you get in touch.</p>`,
  },
  {
    path: "/privacy", crumb: "Privacy", title: "Privacy Policy | XKey Free SEO Checker",
    desc: "How XKey handles the web addresses you check, the short-lived report cache and monitoring dashboards. No accounts, no tracking cookies.",
    h1: "Privacy", lead: "Last reviewed 6 October 2026.",
    sections: `<h2>What we collect</h2><p>When you run a check we receive the web address you entered and your IP address. We use the IP address only for short-term rate limiting to stop abuse; it's held in a temporary cache for about an hour.</p>
<h2>Reports</h2><p>Finished reports are cached for up to an hour so repeat views are fast. We don't store the content of the pages we check.</p>
<h2>Monitoring</h2><p>If you start monitoring, we store the web address and a weekly summary of the check results so we can show your history. Anyone with the dashboard link can view it. To have a monitor deleted, email us with the link.</p>
<h2>Cookies and your browser</h2><p>XKey doesn't set advertising or tracking cookies. To show "Your recent checks", your browser keeps a short list of the addresses you checked and their scores – it stays on your device, is never sent to us, and you can clear it with one click.</p>
<h2>Your rights</h2><p>You can contact us about your data at <a href="mailto:iceworks@f1rst.co.uk">iceworks@f1rst.co.uk</a>, or complain to the Information Commissioner's Office at <a href="https://ico.org.uk/" rel="noopener">ico.org.uk</a>.</p>`,
  },
  ...MORE_GUIDES,
  ...GUIDES_8,
];
