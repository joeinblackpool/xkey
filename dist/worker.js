// src/content.js
var TOOLS = [
  ["/", "Free SEO check", "Full single-page audit: Google readiness, AI search, speed, security and local SEO."],
  ["/ai-seo-checker", "AI SEO checker", "Can ChatGPT, Claude, Perplexity and Google AI Overviews read and cite your site?"],
  ["/website-audit", "Website audit", "Crawl up to 250 pages for broken links, duplicate titles and orphan pages."],
  ["/seo-comparison", "Competitor comparison", "Your site against up to two competitors, side by side."],
  ["/seo-monitoring", "SEO monitoring", "A free weekly re-check with a score history graph."],
  ["/title-tag-checker", "Title tag checker", "See your title and description in pixels, exactly as Google cuts them."],
  ["/robots-txt-tester", "robots.txt tester", "Paste your rules and test any URL against Googlebot or AI crawlers."],
  ["/llms-txt-generator", "llms.txt generator", "Create an llms.txt file that gives AI assistants a map of your site."],
  ["/mobile-friendly-test", "Mobile-friendly test", "Check your page works on phones \u2013 Google's own test closed in 2023."],
  ["/broken-link-checker", "Broken link checker", "Find links on your site that lead to errors or redirects."],
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
  ["/plagiarism-checker", "Plagiarism checker", "Find copies of your text across the web \u2013 no word limit."],
  ["/anchor-text-checker", "Anchor text checker", "Grade every link on a page and generate better anchors."],
  ["/local-search-checker", "Local search checker", "See Google results as they appear in any UK town."],
  ["/ai-meta-description-generator", "AI title & description writer", "AI reads your page and writes titles and descriptions that fit Google."],
  ["/bulk-seo-checker", "Bulk SEO checker", "Score up to 20 websites at once and download a CSV."],
  ["/seo-badge", "SEO score badge", "Show your score on your site \u2013 it updates itself weekly."]
];
var toolCards = (except) => `<div class="grid">${TOOLS.filter(([p]) => p !== except).map(([p, t, d]) => `<a class="card" href="${p}"><p class="ct">${t}</p><p>${d}</p></a>`).join("")}</div>`;
var toolPage = (path, crumb, title, desc, h1, lead, focus, app, sections, faqs2) => ({ path, crumb, title, desc, h1, lead, form: "check", focus, app, parent: ["/seo-tools", "SEO tools"], sections, faqs: faqs2 });
var PAGES = [
  {
    path: "/",
    crumb: "Home",
    title: "Free SEO Check | No Sign-Up, No Email, Instant Report",
    desc: "Free SEO check for any website \u2013 no sign-up, no email, no subscription. Google readiness, AI search, Core Web Vitals and local SEO, with a ranked fix list.",
    h1: "Free SEO check for any website",
    eyebrow: "Free \xB7 Instant \xB7 No sign-up",
    app: "XKey free SEO check",
    lead: "Type in a web address and get a full SEO report in about 20 seconds: how Google sees the page, whether AI assistants can find it, how fast it really is, and exactly what to fix first.",
    form: "check",
    sections: `<h2>What the free SEO check looks at</h2>
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
<h2>How to use your SEO report</h2>
<ol><li><strong>Start with the fix list.</strong> It's sorted so the changes with the biggest effect come first \u2013 usually indexing problems, missing titles or a missing H1.</li>
<li><strong>Check the critical items.</strong> Anything marked critical can stop a page ranking at all.</li>
<li><strong>Re-run the check</strong> after each change. Reports are cached for an hour, so add a small change to the address (such as a trailing slash) if you need a fresh one sooner.</li>
<li><strong>Check the whole site.</strong> A single page can look perfect while problems elsewhere hold you back \u2013 run a <a href="/website-audit">full website audit</a> next.</li></ol>
<h2>Is this SEO check really free?</h2>
<p>Yes, completely. No cost, no sign-up, no email address, no subscription, no trial that runs out and no "upgrade to see your results". You get the whole report straight away. The <a href="/seo-tools">instant tools</a> run in your browser and are unlimited; full checks only have a safety limit set far above normal use, to stop bots. XKey is made by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, a small web studio in Blackpool, as a free tool for UK businesses \u2013 if you'd like the fixes done for you, IceWork can help, but you never have to.</p>`,
    faqs: [
      ["How accurate is the score?", "Every check is based on what Google and the AI providers document publicly, and title widths are measured in pixels the way Google displays them. The score is a guide to how well-prepared a page is \u2013 no tool can guarantee rankings, because Google also weighs links, competition and many other signals."],
      ["Do you store my website's content?", "No. We fetch the page like a search engine would, analyse it and keep only the finished report in a short-lived cache for an hour so repeat views are fast."],
      ["Is there a limit on how many sites I can check?", "Not for normal use. The instant tools run in your browser and are unlimited. Full checks and audits only have a safety limit set far above what a person can use by hand (two checks a minute, every minute), plus a cap on how often any one website can be checked \u2013 that stops bots using XKey to flood other people's sites."],
      ["Do I need to give my email address?", "No. XKey never asks for an email, an account or card details \u2013 not even for weekly monitoring, which gives you a private link instead."],
      ["Can I check a competitor's website?", "Yes \u2013 any public website. To see your site and up to two competitors side by side, use the competitor comparison."],
      ["Why is my score different from other SEO checkers?", "Each tool weights different checks. XKey gives extra weight to things that stop a page appearing at all (indexing, titles, H1) and adds AI search readiness, which most checkers don't measure yet."]
    ]
  },
  {
    path: "/ai-seo-checker",
    crumb: "AI SEO checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free AI SEO Checker | Can ChatGPT See Your Website?",
    desc: "Free AI SEO checker: see if ChatGPT, Claude, Perplexity and Google AI Overviews can crawl, understand and cite your website, with clear fixes.",
    h1: "AI SEO checker: can ChatGPT see your website?",
    eyebrow: "AI search readiness",
    app: "XKey AI SEO checker",
    lead: "Check whether AI assistants are allowed to read your site, whether they can tell who you are, and whether your content is written in the form they quote.",
    form: "check",
    focus: "ai-search-readiness",
    sections: `<h2>What the AI SEO check covers</h2>
<ul><li><strong>AI crawler access.</strong> We read your robots.txt the way each crawler does. Search crawlers such as OAI-SearchBot, Claude-SearchBot, PerplexityBot and Googlebot decide whether you can be <em>cited</em>; training-only crawlers such as GPTBot and Google-Extended only affect model training, so we report them separately.</li>
<li><strong>Snippet controls.</strong> Google documents that <code>nosnippet</code> and <code>max-snippet</code> limit how your content can be used in AI Overviews.</li>
<li><strong>Entity clarity.</strong> Organization or LocalBusiness structured data with links to your official profiles tells AI exactly who runs the site.</li>
<li><strong>Question-led content.</strong> AI answers tend to quote short, direct answers under question-style headings.</li>
<li><strong>Freshness and trust.</strong> Visible "last updated" dates, and About, Contact and Privacy pages.</li>
<li><strong>llms.txt.</strong> A new, optional file that gives AI tools a clean summary of your site. It isn't a ranking factor, but it's cheap to add \u2013 use our <a href="/llms-txt-generator">llms.txt generator</a>.</li></ul>
<h2>What is AI SEO (or GEO)?</h2>
<p>Generative engine optimisation \u2013 often called AI SEO or GEO \u2013 means making your site easy for AI assistants to find, understand and cite. Most of it is good SEO done thoroughly: crawlable pages, clear facts, structured data and content that answers real questions. The difference is that AI tools are less forgiving of vague pages, because they need a confident, specific answer to quote. Our <a href="/guides/ai-search-optimisation">AI search optimisation guide</a> explains each step.</p>
<h2>Should I block AI crawlers?</h2>
<p>It depends on what you want. Blocking training crawlers (GPTBot, Google-Extended, CCBot) stops your content being used to train models but doesn't stop you being found. Blocking search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) stops those assistants showing and linking to your site. Most businesses that want customers should allow the search crawlers. Test your rules with our <a href="/robots-txt-tester">robots.txt tester</a>.</p>`,
    faqs: [["Does llms.txt help me rank in ChatGPT?", "Not directly \u2013 no major AI provider has said it uses llms.txt as a ranking signal. It's a low-effort way to give AI tools a clean overview, so we report it as low impact."], ["How long until AI assistants notice changes?", "Assistants that search the web live (such as ChatGPT search or Perplexity) can see changes as soon as their crawler revisits. Answers that come from a model's training data only change when the model is retrained."]]
  },
  {
    path: "/website-audit",
    crumb: "Website audit",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Website SEO Audit | No Sign-Up, Up to 250 Pages",
    desc: "Free website audit: crawl up to 250 pages to find broken links, duplicate titles, orphan pages, redirect chains and indexing problems. PDF and CSV reports.",
    h1: "Free website SEO audit",
    eyebrow: "Full-site crawl",
    app: "XKey website audit",
    lead: "XKey crawls up to 250 pages of your site the way Google does and lists every site-wide problem, ranked by impact \u2013 with a PDF report and a CSV of every page.",
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
<p>The <a href="/">free SEO check</a> looks at one page in great detail, including AI readiness and real-world speed. The website audit looks wider and finds problems that only show up across many pages, such as fifty pages sharing the same title. Use both.</p>`,
    faqs: [["How many pages can the audit check?", "Up to 250 pages per audit, which covers most small and medium business websites. Larger sites are sampled from the home page and sitemap outwards."], ["Does the audit follow robots.txt?", "Yes. Pages your robots.txt blocks for crawlers are skipped and listed, just as a search engine would treat them."], ["Can I download the results?", "Yes. Print the report or save it as a PDF, and download a CSV with a row for every page crawled."]]
  },
  {
    path: "/seo-comparison",
    crumb: "Competitor comparison",
    parent: ["/seo-tools", "SEO tools"],
    title: "Compare Website SEO With Competitors | Free Tool",
    desc: "Compare your website's SEO with up to two competitors side by side: overall score, AI readiness, speed and content, and where they beat you.",
    h1: "Compare your SEO with competitors",
    eyebrow: "Side by side",
    app: "XKey SEO comparison",
    lead: "Google ranks pages against each other. See how your page scores against two rivals, check by check, and where they're ahead.",
    form: "compare",
    sections: `<h2>What does the comparison show?</h2>
<ul><li>Overall SEO score and AI search readiness for each site</li><li>Scores for every area: indexing, snippets, content, structured data, links, speed, security, mobile</li><li>Words on the page, HTML size and failed checks</li><li><strong>Where competitors beat you</strong> \u2013 checks they pass and you don't</li><li><strong>Where you're ahead</strong> \u2013 your advantages to keep</li></ul>
<h2>Which competitors should I compare against?</h2>
<p>Compare like with like: your home page against theirs, or your service page against their equivalent service page. Pick competitors who rank above you for the search you want, not simply the biggest names. Then fix the checks they pass and you fail, starting with the most important.</p>`,
    faqs: [["Is the comparison free?", "Yes. Compare up to three sites at a time with no sign-up."], ["Will competitors know I checked their site?", "They aren't notified. Our checker fetches their public page like any automated visit, so at most it shows up as a visit in their server logs."]]
  },
  {
    path: "/seo-monitoring",
    crumb: "SEO monitoring",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free SEO Monitoring | Weekly Website Checks",
    desc: "Free weekly SEO monitoring: XKey re-checks your page every week, tracks the score over time and shows anything that breaks. No account needed.",
    h1: "Free weekly SEO monitoring",
    eyebrow: "Set and forget",
    app: "XKey SEO monitoring",
    lead: "Websites break quietly \u2013 a plugin update removes a title, a developer adds noindex, a redirect goes missing. Free monitoring re-checks your page every week and shows exactly what changed.",
    form: "monitor",
    sections: `<h2>How does free SEO monitoring work?</h2>
<ol><li>Enter your address below. We run the first check straight away.</li><li>You get a private dashboard link \u2013 bookmark it. Anyone with the link can view it, so only share it with people you trust.</li><li>Every week we check again and add the result to your score history graph.</li><li>The dashboard lists new problems and fixed problems since the previous check.</li></ol>
<h2>What does monitoring track?</h2>
<p>The overall score, AI search readiness, each area's score, server response time, word count and the pass/fail status of every individual check \u2013 so a single broken item stands out straight away.</p>`,
    faqs: [["Do I need an account?", "No. There's no sign-up and no email \u2013 just keep the dashboard link."], ["How often is my site checked?", "Once a week. You can also run an extra check from your dashboard, up to once an hour."], ["How do I stop monitoring?", "Email us your dashboard link and we'll delete the monitor and its history."]]
  },
  {
    path: "/title-tag-checker",
    crumb: "Title tag checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Title Tag & Meta Description Pixel Width Checker",
    desc: "Check your title tag and meta description length in pixels, as Google measures them. Live preview of your Google result as you type. Free.",
    h1: "Title tag and meta description checker",
    eyebrow: "Instant tool",
    app: "XKey title tag checker",
    lead: "Google cuts titles and descriptions by pixel width, not character count. Type below to see exactly how yours will look in search results.",
    form: "title",
    sections: `<h2>How long should a title tag be?</h2>
<p>Google shows roughly <strong>580 pixels</strong> of a title on desktop \u2013 about 50 to 60 characters, but wide letters such as W and M use more space than i or l. Titles that run over are cut with an ellipsis, and Google sometimes rewrites titles it considers too long or unhelpful.</p>
<h2>How long should a meta description be?</h2>
<p>Around <strong>990 pixels</strong> on desktop, or roughly 150 to 160 characters. Google often writes its own snippet from your page text when your description doesn't match the search, so write a description that genuinely summarises the page.</p>
<h2>Tips for better titles</h2>
<ul><li>Put the main search phrase near the start.</li><li>Make every title on your site unique.</li><li>Add your town for local services, e.g. "Plumber in Blackpool".</li><li>Avoid repeating the same word and stuffing keywords.</li></ul>
<p>To check the titles on every page of your site at once, run a <a href="/website-audit">website audit</a>.</p>`,
    faqs: [["Why does Google rewrite my title?", "Google may replace a title that's too long, stuffed with keywords, repeated across pages or doesn't match the page \u2013 often using your H1 instead. A clear, unique title that describes the page is usually left alone."], ["Does the title tag still matter for SEO?", "Yes. It's one of the strongest on-page signals of what a page is about, and it's the headline people see before deciding whether to click."]]
  },
  {
    path: "/robots-txt-tester",
    crumb: "robots.txt tester",
    parent: ["/seo-tools", "SEO tools"],
    title: "robots.txt Tester | Check Googlebot & AI Crawler Access",
    desc: "Free robots.txt tester: paste your rules and test whether Googlebot, Bingbot, GPTBot, ClaudeBot or PerplexityBot can crawl any URL. Google's matching rules.",
    h1: "robots.txt tester",
    eyebrow: "Instant tool",
    app: "XKey robots.txt tester",
    lead: "Paste a robots.txt file, choose a crawler and test a URL. We apply Google's documented rules: the most specific matching group, longest matching rule, and Allow winning ties.",
    form: "robots",
    sections: `<h2>How does robots.txt matching work?</h2>
<ul><li><strong>Groups:</strong> a crawler obeys the group that names it most specifically; if none does, it uses the <code>User-agent: *</code> group.</li><li><strong>Longest match wins:</strong> when both an Allow and a Disallow rule match, the longer (more specific) rule applies.</li><li><strong>Ties go to Allow.</strong></li><li><code>*</code> matches any characters and <code>$</code> marks the end of the URL.</li></ul>
<h2>What are the most common robots.txt mistakes?</h2>
<ul><li><code>Disallow: /</code> left over from a development site, blocking everything.</li><li>Blocking CSS and JavaScript, which stops Google rendering the page properly.</li><li>Using robots.txt to hide pages from search \u2013 it stops crawling, not indexing. Use <code>noindex</code> instead.</li><li>Blocking AI search crawlers by accident when you only meant to block training crawlers.</li></ul>`,
    faqs: [["Does robots.txt stop a page appearing in Google?", "No \u2013 it stops crawling, not indexing. A blocked page can still be indexed from links pointing to it, just without a description. To keep a page out of Google, allow crawling and add a noindex tag."], ["Where does robots.txt go?", "At the root of your domain, e.g. yoursite.co.uk/robots.txt. Each subdomain needs its own file."]]
  },
  {
    path: "/llms-txt-generator",
    crumb: "llms.txt generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "llms.txt Generator | Free Tool for AI Search",
    desc: "Free llms.txt generator: create an llms.txt file that gives ChatGPT, Claude and other AI tools a clear summary of your website and its key pages.",
    h1: "llms.txt generator",
    eyebrow: "Instant tool",
    app: "XKey llms.txt generator",
    lead: "Fill in a few details and copy a ready-made llms.txt file. Upload it to the root of your website (yoursite.co.uk/llms.txt).",
    form: "llms",
    sections: `<h2>What is llms.txt?</h2>
<p>llms.txt is a proposed standard: a short Markdown file at the root of your website that summarises who you are and links to your most useful pages, so large language models can understand your site without wading through menus and scripts. It sits alongside robots.txt and sitemap.xml.</p>
<h2>Does llms.txt improve rankings?</h2>
<p>Be wary of anyone who says it does. No major AI provider has confirmed using it as a ranking signal. It's quick to add and can help tools that read it, so it's worth five minutes \u2013 but crawl access, clear content and structured data matter far more. Check those with the <a href="/ai-seo-checker">AI SEO checker</a>.</p>
<h2>What should llms.txt include?</h2>
<ul><li>A one-line summary of the business.</li><li>Your main services or products, with links.</li><li>Key information pages: pricing, contact, about.</li><li>Keep it short \u2013 it's a map, not a copy of your site.</li></ul>`,
    faqs: [["Where do I put llms.txt?", "In the root of your website so it loads at yoursite.co.uk/llms.txt as plain text \u2013 the same place as robots.txt."]]
  },
  toolPage(
    "/mobile-friendly-test",
    "Mobile-friendly test",
    "Mobile-Friendly Test | Free Alternative to Google's Tool",
    "Free mobile-friendly test: check your page's viewport, tap targets, readability and mobile speed. A free alternative now Google's own test has closed.",
    "Mobile-friendly test",
    "Google retired its Mobile-Friendly Test in December 2023, but mobile still matters more than ever: Google indexes the mobile version of your site. Check yours below.",
    "mobile-accessibility",
    "XKey mobile-friendly test",
    `<h2>What makes a page mobile friendly?</h2>
<ul><li>A viewport tag set to the device width, without blocking pinch-zoom.</li><li>Text that's readable without zooming, and buttons large enough to tap with a thumb.</li><li>No content wider than the screen, so nobody has to scroll sideways.</li><li>Fast loading on a mobile connection \u2013 see the real-world speed section of your report.</li><li>Tap-to-call or tap-to-email links so visitors can contact you instantly.</li></ul>
<h2>Why Google closed its test \u2013 and what to use instead</h2>
<p>Google pointed site owners to Lighthouse and Search Console instead. XKey combines a mobile checklist with Lighthouse's mobile performance data from Google PageSpeed Insights, so you get both in one report. Your results open at the <strong>Mobile &amp; accessibility</strong> section.</p>`,
    [["Is mobile-first indexing still a thing?", "Yes. Google uses the mobile version of your pages for indexing and ranking, so anything missing on mobile is effectively missing for Google."]]
  ),
  toolPage(
    "/broken-link-checker",
    "Broken link checker",
    "Free Broken Link Checker | Find Dead Links on Your Site",
    "Free broken link checker: find links on your website that lead to 404 errors, server errors or redirects, and see which pages link to them.",
    "Broken link checker",
    "Broken links frustrate visitors and waste the attention search engines give your site. Check a page below, or crawl your whole site with the website audit.",
    "links",
    "XKey broken link checker",
    `<h2>Two ways to find broken links</h2>
<ul><li><strong>Quick check:</strong> the form above tests a sample of links on one page and shows any that fail or redirect.</li><li><strong>Whole site:</strong> the <a href="/website-audit">website audit</a> crawls up to 250 pages and lists every broken page together with the pages that link to it.</li></ul>
<h2>How do I fix broken links?</h2>
<ol><li>If the page moved, add a 301 redirect from the old address to the new one.</li><li>Update your own links to point straight at the new address, so visitors skip the redirect.</li><li>If the page is gone for good, remove the link or point it to the closest useful page.</li></ol>`,
    [["Do broken links hurt SEO?", "A few won't sink a site, but they waste visitors' time and crawl attention, and broken internal links can leave pages hard for Google to find. They're quick to fix."], ["Why does a link work for me but show as broken?", "Some sites block automated checkers or need a login. If the link works in your browser, it's probably fine \u2013 check it by hand."]]
  ),
  toolPage(
    "/schema-checker",
    "Schema checker",
    "Schema Markup Checker | Validate Structured Data Free",
    "Free schema markup checker: validate your JSON-LD structured data, see which types you use and which properties Google requires for rich results.",
    "Schema markup checker",
    "Structured data helps Google and AI assistants understand your business and can earn rich results. Check yours against Google's documented requirements.",
    "structured-data",
    "XKey schema checker",
    `<h2>What does the schema checker test?</h2>
<ul><li>Every JSON-LD block parses correctly and declares <code>@context</code>.</li><li>The types you use, such as Organization, LocalBusiness, Product, Article, Event or BreadcrumbList.</li><li>Google's <strong>required</strong> properties for each type, with recommended properties listed separately.</li></ul>
<h2>Things to know</h2>
<ul><li>FAQ rich results are now limited to government and health websites, so FAQ markup rarely shows stars or drop-downs for businesses.</li><li>Reviews of your own business written on your own site don't get review stars.</li><li>Markup must match what's visible on the page.</li></ul>`,
    [["Which schema type should a small business use?", "LocalBusiness, or a more specific type such as Plumber or Restaurant, if you serve customers in an area; Organization otherwise. Add BreadcrumbList on inner pages."], ["Does schema markup improve rankings?", "Not directly. It helps search engines and AI understand the page and can make it eligible for rich results, which can lift clicks."]]
  ),
  toolPage(
    "/page-speed-checker",
    "Page speed checker",
    "Page Speed Checker | Core Web Vitals Test (Free)",
    "Free page speed checker: Core Web Vitals (LCP, INP, CLS) from real Chrome users plus a Lighthouse test, server response time and speed fixes.",
    "Page speed checker",
    "See how fast your page is for real visitors, not just in a lab test, and what's slowing it down.",
    "performance",
    "XKey page speed checker",
    `<h2>Which page speed numbers matter?</h2>
<div class="tablewrap"><table><thead><tr><th>Metric</th><th>Measures</th><th>Good</th></tr></thead><tbody><tr><td>LCP</td><td>How long the main content takes to appear</td><td>2.5 s or less</td></tr><tr><td>INP</td><td>How quickly the page responds to taps and clicks</td><td>200 ms or less</td></tr><tr><td>CLS</td><td>How much the layout jumps while loading</td><td>0.1 or less</td></tr><tr><td>TTFB</td><td>How fast the server starts responding</td><td>0.8 s or less</td></tr></tbody></table></div>
<p>Google judges Core Web Vitals at the 75th percentile of real visits \u2013 so three out of four visitors need a good experience. Where your site has enough traffic, XKey shows this real-user data from the Chrome UX Report. Read more in our <a href="/guides/core-web-vitals">Core Web Vitals guide</a>.</p>`,
    [["Why is my speed score different every time?", "Lab tests vary with network and server load from run to run. Real-user data is much steadier, so trust it when it's available."], ["Is page speed a ranking factor?", "Yes, as part of Google's page experience signals, but a light one \u2013 relevant, helpful content matters more. Speed matters most for keeping visitors."]]
  ),
  toolPage(
    "/sitemap-checker",
    "Sitemap checker",
    "XML Sitemap Checker | Test & Validate It Free Online",
    "Free XML sitemap checker: find your sitemap, check it's valid, listed in robots.txt and includes this page, with lastmod dates.",
    "XML sitemap checker",
    "Your sitemap tells search engines which pages exist. Check it's being found and that it's telling the truth.",
    "indexing-crawling",
    "XKey sitemap checker",
    `<h2>What does a good sitemap look like?</h2>
<ul><li>Listed in robots.txt with a <code>Sitemap:</code> line, and submitted in Google Search Console.</li><li>Only includes pages you want indexed: no redirects, errors or noindex pages.</li><li>Uses accurate <code>lastmod</code> dates so search engines know what changed.</li><li>Split into a sitemap index if you have more than 50,000 URLs.</li></ul>
<p>To find sitemap entries that redirect or error, and indexable pages missing from your sitemap, run the <a href="/website-audit">website audit</a>.</p>`,
    [["Do I need a sitemap?", "Small, well-linked sites can be found without one, but a sitemap is free insurance and helps new pages get discovered sooner."], ["Where should my sitemap be?", "Usually at yoursite.co.uk/sitemap.xml, listed in robots.txt and submitted in Google Search Console and Bing Webmaster Tools."]]
  ),
  toolPage(
    "/security-headers-checker",
    "Security headers checker",
    "Security Headers Checker | HTTPS, HSTS & More",
    "Free security headers checker: HTTPS, HTTP-to-HTTPS redirects, HSTS, Content-Security-Policy, X-Content-Type-Options, Referrer-Policy and more.",
    "Security headers checker",
    "Browsers warn visitors about insecure sites, and Google prefers HTTPS. Check the basics that keep your visitors safe.",
    "security",
    "XKey security headers checker",
    `<h2>Which security headers does it check?</h2>
<ul><li>HTTPS with no insecure (mixed) content, and http:// redirecting to https://.</li><li>HSTS with a long enough max-age.</li><li>X-Content-Type-Options, Referrer-Policy, Permissions-Policy and clickjacking protection (X-Frame-Options or CSP frame-ancestors).</li><li>Whether your server advertises its software version.</li></ul>
<p>Many of these can be switched on in one place if your site is behind a CDN such as Cloudflare.</p>`,
    [["Does HTTPS help SEO?", "Yes \u2013 Google uses HTTPS as a light ranking signal, and browsers label plain HTTP pages 'Not secure', which puts visitors off."], ["What is HSTS?", "HTTP Strict Transport Security tells browsers to only ever use HTTPS for your site, which blocks downgrade attacks. Turn it on once your whole site works over HTTPS."]]
  ),
  toolPage(
    "/local-seo-checker",
    "Local SEO checker",
    "Local SEO Checker for UK Businesses | Free",
    "Free local SEO checker for UK businesses: LocalBusiness markup, UK phone and postcode, map links and the details that help you appear in Google Maps.",
    "Local SEO checker for UK businesses",
    "If customers find you by searching for a service in a town, local signals on your website matter. Check yours below.",
    "local-seo",
    "XKey local SEO checker",
    `<h2>What matters most for local SEO?</h2>
<ul><li><strong>Google Business Profile</strong> \u2013 the single biggest factor for appearing in the map results.</li><li><strong>Consistent name, address and phone</strong> on your site, your profile and directories.</li><li><strong>LocalBusiness structured data</strong> with address or area served, phone, opening hours and geo-coordinates.</li><li><strong>Town and service pages</strong> that match how people search, e.g. "electrician in Lytham St Annes".</li><li><strong>Reviews</strong> from real customers on your Google profile.</li></ul>
<p>Local SEO checks are only scored when your page looks like a local business, so national websites aren't marked down.</p>`,
    [["Do I need a Google Business Profile?", "If you serve customers locally, yes. It's free, and it's what appears in Google Maps and the local results."], ["Should I make a page for every town I cover?", "Only where you genuinely serve that area and have something specific to say. Near-identical town pages can count as doorway pages, which Google's spam policies prohibit."]]
  ),
  {
    path: "/meta-tag-generator",
    crumb: "Meta tag generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Meta Tag Generator | No Sign-Up, Instant HTML",
    desc: "Free meta tag generator: create your title, meta description, canonical, robots and social tags in seconds, with Google pixel-width checks. No sign-up, no email.",
    h1: "Free meta tag generator",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey meta tag generator",
    lead: "Fill in the boxes and copy a complete, correct set of meta tags for the <head> of your page \u2013 title, description, canonical, robots and social sharing tags.",
    form: "meta",
    sections: `<h2>Which meta tags actually matter for SEO?</h2>
<ul><li><strong>Title</strong> \u2013 the clickable headline in Google and one of the strongest signals of what the page is about.</li><li><strong>Meta description</strong> \u2013 doesn't affect rankings directly, but it's your advert in the results and affects how many people click.</li><li><strong>Canonical</strong> \u2013 tells search engines which address is the main version when the same page can be reached in several ways.</li><li><strong>Robots</strong> \u2013 lets you keep a page out of search with <code>noindex</code>. <code>max-image-preview:large</code> allows big image previews in Google Discover.</li><li><strong>Viewport</strong> \u2013 needed for the page to display properly on phones, which is how Google indexes it.</li><li><strong>Open Graph</strong> \u2013 controls the title, text and image shown when someone shares the page on Facebook, LinkedIn, WhatsApp or X.</li></ul>
<h2>Which meta tags can I ignore?</h2>
<p>The <code>keywords</code> meta tag has been ignored by Google since 2009, so this generator leaves it out. Tags such as <code>revisit-after</code>, <code>rating</code> and <code>author</code> have no effect on Google rankings either.</p>
<h2>How do I add meta tags to my website?</h2>
<p>Paste the generated code between <code>&lt;head&gt;</code> and <code>&lt;/head&gt;</code> in your page's HTML. On WordPress, use an SEO plugin's title and description boxes instead of pasting code; on Wix, Squarespace and Shopify, look for "SEO settings" on each page. Then run a <a href="/">free SEO check</a> to confirm Google can see them.</p>`,
    faqs: [["Is this meta tag generator really free?", "Yes \u2013 free, unlimited and no sign-up. It runs entirely in your browser, so nothing you type is sent to us."], ["How long should my meta description be?", "Aim for roughly 500 to 990 pixels \u2013 about 120 to 155 characters. The generator measures it in pixels as you type."]]
  },
  {
    path: "/open-graph-generator",
    crumb: "Open Graph generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Open Graph Generator | Free OG Tags, No Sign-Up",
    desc: "Free Open Graph generator: create og: and Twitter card tags with a live preview of how your link will look on Facebook, LinkedIn, WhatsApp and X. No sign-up.",
    h1: "Open Graph tag generator",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey Open Graph generator",
    lead: "Control how your page looks when it's shared. Fill in the details, check the preview and copy the tags into your page's <head>.",
    form: "og",
    sections: `<h2>What are Open Graph tags?</h2>
<p>Open Graph is a set of <code>og:</code> meta tags, created by Facebook and now read by LinkedIn, WhatsApp, Slack, Discord, iMessage and most other apps, that tell them which title, description and image to show when someone shares a link. X (Twitter) reads them too, plus its own <code>twitter:card</code> tag, which the generator adds for you.</p>
<h2>What size should an Open Graph image be?</h2>
<p><strong>1200 \xD7 630 pixels</strong> (a 1.91:1 ratio) works everywhere. Use PNG or JPG \u2013 SVG isn't supported \u2013 keep it under about 5 MB, and keep important text away from the edges because some apps crop to a square.</p>
<h2>Why isn't my new image showing when I share a link?</h2>
<p>Social networks cache link previews, sometimes for weeks. After changing your tags, ask them to look again: Facebook's Sharing Debugger and LinkedIn's Post Inspector both have a "scrape again" option. Also check the image address is a full https:// URL and isn't blocked by robots.txt.</p>
<h2>Do Open Graph tags help SEO?</h2>
<p>Not directly \u2013 Google doesn't rank pages on them. But a clear, attractive preview gets more clicks when your page is shared, and more visitors and mentions help over time. The <a href="/">free SEO check</a> tests your Open Graph tags as part of the snippet section.</p>`,
    faqs: [["Do I need both Open Graph and Twitter tags?", "X falls back to Open Graph for the title, description and image, but it needs twitter:card to show a large image. The generator includes both."]]
  },
  {
    path: "/xml-sitemap-generator",
    crumb: "XML sitemap generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free XML Sitemap Generator Online | No Registration",
    desc: "Free XML sitemap generator: find your pages automatically or paste a list, then download a valid sitemap.xml for Google and Bing. No registration, no email.",
    h1: "Free XML sitemap generator",
    eyebrow: "Instant tool \xB7 No registration",
    app: "XKey XML sitemap generator",
    lead: "Enter your website to find its pages automatically, or paste your own list of addresses. Download a valid sitemap.xml in one click.",
    form: "sitemap",
    sections: `<h2>How do I use the sitemap generator?</h2>
<ol><li>Type your website address and press <strong>Find pages on my site</strong>. We read your existing sitemap and the links on your home page.</li><li>Check the list: remove anything you don't want in Google (thank-you pages, logins, duplicates) and add any pages that are missing.</li><li>Download <code>sitemap.xml</code> and upload it to the root of your website.</li><li>Add <code>Sitemap: https://yoursite.co.uk/sitemap.xml</code> to robots.txt and submit it in Google Search Console and Bing Webmaster Tools.</li></ol>
<h2>What should a sitemap include?</h2>
<p>Only pages you want to appear in search: the final https:// address of each page, with no redirects, errors or noindex pages. <code>lastmod</code> should be the date the page's content last changed \u2013 Google uses it when it's accurate and ignores it when it isn't. Google ignores <code>priority</code> and <code>changefreq</code>, so we leave them out.</p>
<h2>Does my website builder already make a sitemap?</h2>
<p>Very likely. WordPress (since version 5.5), Wix, Squarespace and Shopify all create one automatically \u2013 try yoursite.co.uk/sitemap.xml or /wp-sitemap.xml. This generator is for hand-built sites, small static sites and anyone who needs a clean list. To check an existing sitemap, use the <a href="/sitemap-checker">sitemap checker</a>.</p>`,
    faqs: [["Is there a limit on the number of URLs?", "A single sitemap can hold up to 50,000 URLs (and 50 MB). The generator itself has no limit \u2013 it runs in your browser."], ["Will a sitemap get my pages indexed?", "It helps Google find them, but indexing isn't guaranteed. Pages also need to be useful, reachable through links and not blocked."]]
  },
  {
    path: "/word-counter",
    crumb: "Word counter",
    parent: ["/seo-tools", "SEO tools"],
    title: "Word Counter & Keyword Density Checker | Free, No Login",
    desc: "Free word counter with character count, reading time, readability score and keyword density for single words and phrases. Unlimited, no login, nothing stored.",
    h1: "Word counter and keyword density checker",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey word counter",
    lead: "Paste or type your text to count words, characters, sentences and reading time \u2013 and see which words and phrases you use most.",
    form: "words",
    sections: `<h2>What does the word counter measure?</h2>
<ul><li><strong>Words and characters</strong>, with and without spaces \u2013 handy for meta descriptions, ads and social posts with character limits.</li><li><strong>Sentences, paragraphs and reading time</strong> (at about 230 words a minute).</li><li><strong>Readability</strong> using the Flesch reading-ease score: 60 or above is plain English that most adults read easily.</li><li><strong>Keyword density</strong> \u2013 the most-used words and two- and three-word phrases, with common words such as "the" and "and" filtered out.</li></ul>
<h2>What is a good keyword density?</h2>
<p>There isn't one. Google has never published a target and doesn't use a density formula. Use the phrases people search for naturally, especially in your title, first paragraph and headings \u2013 and if one phrase is far more frequent than everything else, read the text aloud: if it sounds repetitive, it probably reads as keyword stuffing to Google too.</p>
<h2>How many words should a web page have?</h2>
<p>As many as it takes to answer the question fully, and no more. A contact page might need 100 words; a service page usually needs 400 or more to cover prices, process, areas and common questions; a guide may need 1,500. The <a href="/">free SEO check</a> counts the words in your page's main content, ignoring menus and footers.</p>`,
    faqs: [["Is my text stored or sent anywhere?", "No. The word counter runs entirely in your browser \u2013 nothing you paste leaves your device."], ["Does it work with other languages?", "Yes, word and character counts work for any language that uses spaces between words. The readability score is designed for English."]]
  },
  {
    path: "/keyword-generator",
    crumb: "Long-tail keyword generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Long-Tail Keyword Generator | No Sign-Up",
    desc: "Free long-tail keyword generator: turn one topic into question, buying, local and comparison keyword ideas for your pages. No sign-up, no email.",
    h1: "Free long-tail keyword generator",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey long-tail keyword generator",
    lead: "Enter a product or service and your town to get dozens of specific, long-tail keyword ideas \u2013 the low-competition searches that new and small websites can actually win.",
    form: "keywords",
    sections: `<h2>What are long-tail keywords?</h2>
<p>Long-tail keywords are longer, more specific searches \u2013 "emergency plumber in Blackpool on a Sunday" rather than "plumber". Each one has fewer searches, but together they make up most of what people type into Google, they face far less competition, and the people searching them usually know exactly what they want.</p>
<h2>How do I check if a keyword is worth targeting?</h2>
<ol><li><strong>Search it on Google</strong> and look at what ranks. If the results are forums, thin directories or pages that don't quite answer the question, you have a good chance.</li><li><strong>Check Google's autocomplete and "People also ask"</strong> \u2013 if Google suggests it, real people search for it.</li><li><strong>Look in Google Search Console</strong> for searches you already appear for on page two \u2013 they're often the quickest wins.</li></ol>
<p>This tool generates ideas from proven patterns; it doesn't show search volumes. Google Keyword Planner gives free volume ranges if you have a Google Ads account.</p>
<h2>How should I use these keyword ideas?</h2>
<p>Pick one main phrase per page and put it in the title, the H1 and the first paragraph. Turn question keywords into headings with direct answers underneath \u2013 the format Google's "People also ask" boxes and AI assistants like to quote. Then check the page with the <a href="/">free SEO check</a>.</p>`,
    faqs: [["Why doesn't it show search volumes?", "Accurate volumes come from paid data providers. Rather than show made-up numbers, we give you proven keyword patterns and explain how to check them for free."], ["Are 'no sign-up' keywords worth targeting?", "Yes, if your page genuinely offers that. People who add 'no sign-up' or 'free' to a search are frustrated with paywalls and click quickly on a page that delivers."]]
  },
  {
    path: "/blog-title-generator",
    crumb: "Blog title generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Blog Title Generator | No Sign-Up, Instant Ideas",
    desc: "Free blog post title generator: enter a keyword and get 15 headline ideas, each measured in pixels so it fits in Google's results. No sign-up, unlimited use.",
    h1: "Free blog title generator",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey blog title generator",
    lead: "Enter your topic or keyword and get headline ideas proven to earn clicks \u2013 each one measured against Google's title width.",
    form: "titles",
    sections: `<h2>What makes a good blog post title?</h2>
<ul><li><strong>It contains the search phrase</strong>, ideally near the start.</li><li><strong>It promises something specific</strong>: a number, a price, a year, a result.</li><li><strong>It fits</strong>: about 580 pixels on desktop, or Google cuts it off with "\u2026". We show the width next to each idea.</li><li><strong>It's honest</strong>. Clickbait that the article doesn't deliver brings visitors who leave straight away.</li></ul>
<h2>Should my page title and H1 be the same?</h2>
<p>They can be, and that's fine. Many sites use a slightly longer H1 on the page and a tighter title tag for Google, sometimes with the brand name added. What matters is that both clearly describe the same topic \u2013 Google often rewrites titles that don't match the page. Check yours with the <a href="/title-tag-checker">title tag checker</a>.</p>
<h2>Where do the best blog ideas come from?</h2>
<p>Your customers. Write down every question people ask you by phone, email or in person \u2013 each one is a blog post, and those are exactly the long-tail searches small sites can win. The <a href="/keyword-generator">long-tail keyword generator</a> helps fill the gaps.</p>`,
    faqs: [["Can I use these titles as they are?", "Yes \u2013 they're templates for you to adapt. Edit them so they match exactly what your article delivers."]]
  },
  {
    path: "/robots-txt-generator",
    crumb: "robots.txt generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "robots.txt Generator | Free, With AI Crawler Controls",
    desc: "Free robots.txt generator with AI crawler controls: block AI training bots like GPTBot while staying visible in ChatGPT, Claude and Google search. No sign-up.",
    h1: "robots.txt generator with AI crawler controls",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey robots.txt generator",
    lead: "Choose what to block, including AI training crawlers, and download a correct robots.txt file. Then test it with the robots.txt tester.",
    form: "robotsgen",
    sections: `<h2>Should I block AI crawlers?</h2>
<p>There are two kinds. <strong>Training crawlers</strong> (GPTBot, ClaudeBot, Google-Extended, CCBot and others) collect pages to train AI models; blocking them doesn't affect your search visibility. <strong>AI search crawlers</strong> (OAI-SearchBot, Claude-SearchBot, PerplexityBot) fetch pages so the assistant can show and link to them; blocking those removes you from those answers. Most businesses that want customers block training if they prefer and always allow search. Google's AI Overviews use normal Googlebot, so they can't be blocked separately without leaving Google.</p>
<h2>What should I block in robots.txt?</h2>
<p>Usually very little: admin areas, internal search results, baskets and checkout pages, and endless filter combinations on shops. Never block your CSS or JavaScript \u2013 Google needs them to render your pages.</p>
<h2>Does robots.txt hide a page from Google?</h2>
<p>No. It stops crawling, not indexing \u2013 a blocked page can still appear in results if other sites link to it. To keep a page out of Google, allow it to be crawled and add a <code>noindex</code> meta tag. Test your finished file with the <a href="/robots-txt-tester">robots.txt tester</a>.</p>`,
    faqs: [["Do all AI crawlers obey robots.txt?", "The major providers (OpenAI, Anthropic, Google, Perplexity, Apple and Common Crawl) say their crawlers follow it. Badly behaved scrapers may not \u2013 for those you need a firewall or your CDN's bot protection."]]
  },
  {
    path: "/schema-generator",
    crumb: "Local business schema generator",
    parent: ["/seo-tools", "SEO tools"],
    title: "Local Business Schema Generator | Free JSON-LD",
    desc: "Free LocalBusiness schema generator: create JSON-LD structured data with address, opening hours, service areas and profiles for Google and AI. No sign-up.",
    h1: "Local business schema generator",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey schema generator",
    lead: "Create LocalBusiness structured data that tells Google and AI assistants exactly who you are, where you work and when you're open.",
    form: "schemagen",
    sections: `<h2>What is LocalBusiness schema?</h2>
<p>It's a block of JSON-LD code, using the schema.org vocabulary, that states your business details in a form machines can read without guessing: name, address, phone, opening hours, areas served and links to your official profiles. Google uses it to understand your business, and AI assistants use it to describe you accurately.</p>
<h2>Which business type should I choose?</h2>
<p>The most specific one that fits \u2013 Plumber, Electrician, Dentist, Restaurant and so on \u2013 because each is still a LocalBusiness. If none fits, use LocalBusiness or ProfessionalService.</p>
<h2>What if I don't have a public address?</h2>
<p>Service-area businesses that visit customers can leave out the street address and use <strong>areas served</strong> instead, listing the towns you cover. Whatever you include must match your Google Business Profile and what's visible on your website.</p>
<h2>How do I add the code to my site?</h2>
<p>Paste it into the <code>&lt;head&gt;</code> or anywhere in the <code>&lt;body&gt;</code> of your home page (or contact page). On WordPress, an SEO plugin or a header-code plugin does the job. Then run the <a href="/schema-checker">schema checker</a> to validate it.</p>`,
    faqs: [["What are sameAs links?", "Links to your official profiles elsewhere \u2013 Google Business Profile, Facebook, LinkedIn, Companies House. They help Google and AI connect your website to the same business across the web."], ["Will schema get me stars in Google?", "Not on its own. Review stars aren't shown for reviews a business publishes about itself on its own site."]]
  },
  {
    path: "/keyword-difficulty-checker",
    crumb: "Keyword difficulty checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Keyword Difficulty Checker | No Sign-Up",
    desc: "Free keyword difficulty checker: see how hard it is to reach page one by analysing the pages that rank now. No sign-up, no email, no subscription.",
    h1: "Free keyword difficulty checker",
    eyebrow: "Free \xB7 No sign-up",
    app: "XKey keyword difficulty checker",
    lead: "Find out whether you can realistically rank for a keyword. Search it on Google, paste the page-one results, and XKey grades how strong each one really is.",
    form: "difficulty",
    sections: `<h2>How does this keyword difficulty checker work?</h2>
<p>Paid tools estimate difficulty from their own databases of backlinks. XKey looks at the evidence directly: the pages Google ranks right now for your search. For each one we check whether the keyword is in the title and main heading, how much content it has, whether it uses structured data, how fast it responds and what kind of site it is \u2013 a national brand, or a forum, free blog or Q&amp;A page that a focused business page can often beat.</p>
<p>You do the Google search yourself, so you see exactly the results your customers see, in your location \u2013 and we don't break Google's rules by scraping its results.</p>
<h2>What is a good keyword difficulty score?</h2>
<ul><li><strong>Under 35 \u2013 easy.</strong> Page one is held by pages that don't really target the phrase. A focused, helpful page can rank, often within weeks.</li><li><strong>35 to 60 \u2013 medium.</strong> Beatable with a better page, a few relevant links and, for local searches, a strong Google Business Profile.</li><li><strong>Over 60 \u2013 hard.</strong> Strong, well-targeted pages and big sites. Target a longer, more specific variation first \u2013 try the <a href="/keyword-generator">long-tail keyword generator</a>.</li></ul>
<h2>What does it not measure?</h2>
<p>Backlinks \u2013 links from other websites \u2013 are a big part of why established sites rank, and measuring them needs a crawl of the whole web. So treat big-name sites as harder than their on-page score suggests. Search volume isn't included either; Google Keyword Planner gives free ranges.</p>`,
    faqs: [["Why do I have to paste the results myself?", "Google doesn't allow automated scraping of its results. Searching yourself is within the rules, free, and shows the real results for your location."], ["How many results should I paste?", "All ten organic results on page one gives the best estimate. Skip ads, the map pack and video carousels."]]
  },
  {
    path: "/plagiarism-checker",
    crumb: "Plagiarism checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free Plagiarism Checker | No Sign-Up, No Word Limit",
    desc: "Free plagiarism checker with no sign-up and no word limit: search the web for your most distinctive sentences and compare your text with any page.",
    h1: "Free plagiarism checker",
    eyebrow: "Free \xB7 No word limit",
    app: "XKey plagiarism checker",
    lead: "Check whether your text has been copied \u2013 or copies someone else. Search the web for its most distinctive sentences in one click, and compare it word for word with any page.",
    form: "plagiarism",
    sections: `<h2>How does this plagiarism checker work?</h2>
<ol><li><strong>We pick your most distinctive sentences</strong> \u2013 the ones with the most unusual wording, which are the most likely to be unique.</li><li><strong>You search for each one, word for word</strong>, on Google or Bing with one click. If another page shows up with the same wording, the text has been copied one way or the other.</li><li><strong>Compare with any page.</strong> Add the address of a page you suspect and we measure what share of your text appears on it word for word, and show the matching passages.</li></ol>
<p>Your text is never stored, and the sentence picking happens in your browser. Unlike many free checkers, there's no word limit and no sign-up.</p>
<h2>Does duplicate content hurt SEO?</h2>
<p>Google doesn't penalise ordinary duplication, but when several pages have the same text it usually shows only one of them \u2013 and it may not be yours. Copying content wholesale from other sites can count as scraped content under Google's spam policies. Make sure your important pages say something in your own words.</p>
<h2>What should I do if someone has copied my content?</h2>
<p>Contact the site owner first and ask them to remove it or credit you. If that doesn't work, you can file a copyright removal request with Google under the Digital Millennium Copyright Act (DMCA) form, and contact the site's web host.</p>`,
    faqs: [["Is this as thorough as paid plagiarism checkers?", "Paid checkers compare against their own databases of web pages and academic papers. Ours uses Google and Bing's own indexes, one sentence at a time, which is excellent for spotting web copies but doesn't cover private academic databases."], ["Is my text kept?", "No. Picking sentences happens in your browser, and when you compare with a page we only fetch that page."]]
  },
  {
    path: "/anchor-text-checker",
    crumb: "Anchor text checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Anchor Text Checker & Generator | Free, No Sign-Up",
    desc: "Free anchor text checker and generator: list every link on a page, find empty, generic and clashing anchors, and get balanced anchor ideas. No sign-up.",
    h1: "Anchor text checker and generator",
    eyebrow: "Free \xB7 No sign-up",
    app: "XKey anchor text checker",
    lead: "Anchor text is the clickable wording of a link, and Google uses it to understand the page it points to. Check every link on a page, then generate better anchors.",
    form: "anchors",
    sections: `<h2>What does the anchor text checker look for?</h2>
<ul><li><strong>Empty anchors</strong> \u2013 links with no text, or image links with no alt text, tell Google and screen-reader users nothing.</li><li><strong>Generic anchors</strong> such as "click here" and "read more" waste the chance to describe the destination.</li><li><strong>Same anchor, different pages</strong> \u2013 using the same words to link to two pages blurs which one should rank.</li><li><strong>nofollow on internal links</strong>, which throws away your own link value.</li><li><strong>Your internal anchors</strong> in the page content, so you can see what you're telling Google each page is about.</li></ul>
<h2>What is good anchor text?</h2>
<p>Words that describe the page you're linking to, written naturally into the sentence: "see our <em>boiler servicing prices</em>" rather than "click here". For your own internal links, descriptive anchors that include the topic are ideal \u2013 Google's own guidance encourages it.</p>
<h2>Can anchor text be over-optimised?</h2>
<p>Yes \u2013 but mostly for links from other websites. Lots of external links using the exact same keyword anchor looks unnatural, and buying links to manipulate rankings breaks Google's spam policies. Natural links use a mix of your brand name, your address and descriptive phrases, which is what the generator gives you.</p>`,
    faqs: [["How many links should a page have?", "There's no fixed limit. Link wherever it genuinely helps a visitor, and make sure every important page is linked from somewhere in your content, not only the menu."], ["Do menu and footer links count?", "Yes, but Google understands they're site-wide navigation. Links within the main content carry more context, so we show those separately."]]
  },
  {
    path: "/local-search-checker",
    crumb: "Local search checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Local SERP Checker | See Google From Any UK Town, Free",
    desc: "Free local SERP checker: see Google search results as they appear in any UK town or city, without a VPN or sign-up. Check your local rankings in seconds.",
    h1: "Local search checker: see Google from any UK town",
    eyebrow: "Instant tool \xB7 Unlimited",
    app: "XKey local search checker",
    lead: "Google shows different results in different places. Type a search and a town to open Google exactly as people there see it \u2013 handy for checking where you rank across your service area.",
    form: "localserp",
    sections: `<h2>Why do Google results change by location?</h2>
<p>For anything with local intent \u2013 plumbers, caf\xE9s, solicitors, "near me" searches \u2013 Google ranks businesses close to the searcher higher, and shows a map pack of nearby businesses. So your position in Blackpool can be completely different from your position in Preston, even for the same words. Searching from your own office only ever shows you one of those pictures.</p>
<h2>How does this local search checker work?</h2>
<p>We build a Google search link with a location setting (the same <code>uule</code> parameter search professionals use), plus settings that switch off personalisation. The search runs in your own browser, from Google directly \u2013 we don't scrape or store anything \u2013 so the results are as real as they get. If Google doesn't recognise a place name, it falls back to your own location: try the main town name, spelled as on a map.</p>
<h2>How do I improve my local rankings?</h2>
<ul><li>Complete and verify your <strong>Google Business Profile</strong>, with the right categories and service areas.</li><li>Keep your <strong>name, address and phone</strong> identical on your website, profile and directories.</li><li>Add <strong>LocalBusiness structured data</strong> \u2013 our <a href="/schema-generator">schema generator</a> writes it for you.</li><li>Create genuinely useful pages for the towns you serve, and earn reviews from real customers.</li><li>Check your site with the <a href="/local-seo-checker">local SEO checker</a>.</li></ul>`,
    faqs: [["Is this the same as a rank tracker?", "It shows you the live results so you can see where you appear. Paid rank trackers automate this across hundreds of searches; doing it by hand for your few most important searches costs nothing and follows Google's rules."], ["Why don't I see the map pack?", "Google only shows the map pack when it thinks the search is local. Try adding the type of business, such as 'plumber' rather than 'plumbing'."]]
  },
  {
    path: "/ai-meta-description-generator",
    crumb: "AI title & description writer",
    parent: ["/seo-tools", "SEO tools"],
    title: "AI Meta Description Generator | Free, No Sign-Up",
    desc: "Free AI meta description and title generator: we read your page and write three titles and three descriptions sized for Google. No sign-up, no email.",
    h1: "AI meta description and title generator",
    eyebrow: "AI \xB7 Free \xB7 No sign-up",
    app: "XKey AI meta description generator",
    lead: "Give us a page address or a few lines about the page. AI reads it and writes three titles and three meta descriptions \u2013 each measured in pixels so it fits in Google.",
    form: "aiwriter",
    sections: `<h2>How does the AI meta description generator work?</h2>
<p>If you enter an address, we read the page's current title, description, main heading and text. The AI \u2013 Meta's Llama model, running on Cloudflare's network \u2013 then writes three titles and three descriptions in British English around your main keyword and town. We measure every suggestion in pixels the way Google displays it, so you can see at a glance which ones fit.</p>
<h2>Can I trust what the AI writes?</h2>
<p>Use it as a first draft. We tell the AI never to invent prices, awards or reviews, but AI can still get details wrong \u2013 so read every word and make sure it's true for your business before you use it. Google's guidance is clear that AI-written content is fine when it's accurate and helpful to people.</p>
<h2>What makes a good meta description?</h2>
<ul><li>It describes what's actually on the page \u2013 Google rewrites descriptions that don't match.</li><li>It leads with the benefit to the searcher, not your company history.</li><li>It ends with a reason to click: a price, a guarantee, "book online", "free quote".</li><li>It's unique to the page and roughly 120 to 155 characters long.</li></ul>
<p>Check how your result looks with the <a href="/title-tag-checker">title tag checker</a>, or write tags by hand with the <a href="/meta-tag-generator">meta tag generator</a>.</p>`,
    faqs: [["Is the AI writer really free?", "Yes \u2013 no sign-up, no email and no credits to buy. There's a fair-use limit of 30 uses an hour per connection, and a daily cap so the free service stays available for everyone."], ["Is my page text stored?", "No. The page is read, sent to the AI to write your suggestions, and then discarded."]]
  },
  {
    path: "/bulk-seo-checker",
    crumb: "Bulk SEO checker",
    parent: ["/seo-tools", "SEO tools"],
    title: "Bulk SEO Checker | Check 20 Websites at Once, Free",
    desc: "Free bulk SEO checker: paste up to 20 web addresses and get SEO and AI search scores, failed checks and titles side by side, with a CSV download.",
    h1: "Bulk SEO checker",
    eyebrow: "Free \xB7 No sign-up",
    app: "XKey bulk SEO checker",
    lead: "Check up to 20 pages or websites in one go \u2013 your own pages, a client list or a whole page of competitors \u2013 and download the results as a spreadsheet.",
    form: "bulk",
    sections: `<h2>What does the bulk SEO checker show?</h2>
<p>For every address you get the overall SEO score, the AI search readiness score, the number of failed checks, the word count and the page title \u2013 the same engine as our <a href="/">free SEO check</a>, run on each page. Click any row for the full report with fixes, or download everything as a CSV for Excel or Google Sheets.</p>
<h2>Who is it for?</h2>
<ul><li><strong>Business owners</strong> checking their most important pages at once.</li><li><strong>Web designers and agencies</strong> reviewing a list of client sites before a call.</li><li><strong>Anyone researching a market</strong> \u2013 paste the ten sites on page one for your search and see who's well optimised.</li></ul>
<h2>How is this different from the website audit?</h2>
<p>The bulk checker runs the full single-page check \u2013 including AI readiness and speed signals \u2013 on pages you choose, across any websites. The <a href="/website-audit">website audit</a> crawls one site from its home page to find site-wide problems such as broken links and duplicate titles.</p>`,
    faqs: [["Why is the limit 20?", "Each check fetches a page and its supporting files, so 20 at a time keeps the tool fast and free for everyone. Run another batch whenever you like."]]
  },
  {
    path: "/seo-badge",
    crumb: "SEO score badge",
    parent: ["/seo-tools", "SEO tools"],
    title: "Free SEO Score Badge for Your Website | XKey",
    desc: "Show visitors your website is well built: add a free XKey SEO score badge that updates itself weekly. Copy one line of code \u2013 no sign-up.",
    h1: "Free SEO score badge for your website",
    eyebrow: "Free \xB7 Updates itself",
    app: "XKey SEO score badge",
    lead: "Proud of your score? Add a small badge to your footer that shows your current XKey SEO score and updates itself every week.",
    form: "badge",
    sections: `<h2>How does the badge work?</h2>
<p>The badge is a small image served by XKey. The first time it's shown, we check your home page in the background and remember the score; after that we re-check about once a week, so the number stays honest. Clicking the badge opens your full, up-to-date report.</p>
<h2>Where should I put it?</h2>
<p>Most sites put it in the footer, next to payment or trade-association logos. Web designers often add it to the sites they build to show clients the work is search-ready.</p>
<h2>Does the badge slow my site down?</h2>
<p>No. It's a tiny image (under 1 kB) served from Cloudflare's network and cached, with no scripts and no cookies.</p>`,
    faqs: [["What if my score drops?", "The badge always shows your real score. If it drops, the linked report shows exactly what changed and how to fix it \u2013 or remove the badge at any time."]]
  },
  {
    path: "/seo-tools",
    crumb: "SEO tools",
    title: "Free SEO Tools | No Sign-Up, No Email, No Subscription",
    desc: "30 free SEO tools with no sign-up, no email and no subscription: SEO check, site audit, meta tag and sitemap generators, keyword ideas and more.",
    h1: "Free SEO tools",
    eyebrow: "No sign-up",
    lead: "Every tool is free, with no account, no email and no subscription. The generators and counters run in your browser, so they're unlimited and nothing you type leaves your device.",
    sections: `<h2>Which SEO tool should I start with?</h2><p>Start with the <a href="/">free SEO check</a> on your most important page \u2013 it covers everything below in one report. Then run the <a href="/website-audit">website audit</a> to catch site-wide problems, and turn on <a href="/seo-monitoring">weekly monitoring</a> so nothing breaks unnoticed.</p><h2>Are these SEO tools really free?</h2><p>Yes. No sign-up, no trial and no limits beyond fair-use rate limits that stop abuse. XKey is paid for by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, who build websites, as a useful free service.</p><h2>Do the single-topic tools run a different check?</h2><p>The checkers for speed, schema, sitemaps, security, mobile and local SEO run the full check and open your report at that section, so you never miss a bigger problem elsewhere on the page.</p>`,
    tools: true,
    itemList: TOOLS
  },
  {
    path: "/guides",
    crumb: "Guides",
    title: "SEO Guides | Plain-English Help From XKey",
    desc: "Plain-English SEO guides for UK businesses: why a site isn't on Google, Search Console, title tags, local SEO, schema, AI search and more.",
    h1: "SEO guides",
    eyebrow: "Plain English",
    lead: "Short, practical guides for business owners who want to understand their SEO report.",
    sections: `<h2>Who are these guides for?</h2><p>Business owners, marketers and anyone who has run an SEO check and wants to know what the results mean. Each guide explains one topic in plain English, says what matters and what doesn't, and links to the free tool that checks it. We update them when Google or the AI providers change their guidance.</p><h2>Where should I start?</h2><p>If you're new to SEO, read <a href="/guides/what-is-an-seo-check">what an SEO check is</a>, then follow the <a href="/guides/how-to-check-website-seo">10-minute routine</a>. If your site doesn't appear in Google at all, start with <a href="/guides/why-is-my-website-not-on-google">why isn't my website on Google?</a></p><h2>Guides for local businesses</h2><p>Serve customers in a particular town? The <a href="/guides/local-seo-checklist">local SEO checklist</a> and <a href="/guides/google-business-profile">Google Business Profile guide</a> cover the steps that put you in the map pack.</p><h2>Guides for AI search</h2><p>To get recommended by ChatGPT, Claude, Perplexity and Google's AI Overviews, read <a href="/guides/ai-search-optimisation">AI search optimisation</a>, then decide which crawlers to let in with our guide to <a href="/guides/block-ai-training-bots">blocking AI training bots</a>, and find out <a href="/guides/llms-txt">whether you need llms.txt</a>.</p>`,
    guides: true
  },
  {
    path: "/guides/what-is-an-seo-check",
    crumb: "What is an SEO check?",
    parent: ["/guides", "Guides"],
    article: true,
    title: "What Is an SEO Check? (And What It Can't Tell You)",
    desc: "What an SEO check looks at, how to read the score, and what no SEO checker can measure \u2013 explained in plain English.",
    h1: "What is an SEO check?",
    lead: "An SEO check reads a web page the way a search engine does and reports anything that could stop it being found, understood or chosen.",
    sections: `<h2>What does an SEO check look at?</h2>
<p>A good check covers three things. <strong>Can search engines reach the page?</strong> (status code, robots.txt, noindex, canonical, sitemap). <strong>Can they understand it?</strong> (title, headings, content, structured data). <strong>Will people want to click and stay?</strong> (snippet, speed, mobile usability, trust). Newer tools, including XKey, add a fourth: <strong>can AI assistants find and cite it?</strong></p>
<h2>How should I read the score?</h2>
<p>Scores are weighted: problems that stop a page appearing at all count far more than nice-to-haves. Treat the score as a to-do list, not a grade \u2013 a page scoring 85 with a critical indexing problem is in more trouble than one scoring 75 with minor warnings.</p>
<h2>What can't an SEO checker tell you?</h2>
<ul><li><strong>Your actual rankings</strong> \u2013 that needs <a href="/guides/google-search-console">Google Search Console</a> or a rank tracker.</li><li><strong>How strong your competitors are</strong> for a particular search.</li><li><strong>Your backlink profile</strong> in full \u2013 that requires a crawl of the whole web.</li><li><strong>Whether your content is the best answer</strong> \u2013 that's still a human judgement.</li></ul>
<p>Ready? <a href="/">Run a free SEO check</a>.</p>`
  },
  {
    path: "/guides/how-to-check-website-seo",
    crumb: "How to check a website's SEO",
    parent: ["/guides", "Guides"],
    article: true,
    title: "How to Check a Website's SEO in 10 Minutes",
    desc: "A simple 10-minute routine to check any website's SEO: one-page check, site audit, Search Console and a competitor comparison.",
    h1: "How to check a website's SEO in 10 minutes",
    lead: "You don't need to be technical. Follow these steps in order and you'll know where a site stands and what to fix first.",
    sections: `<h2>1. Check the most important page (2 minutes)</h2>
<p>Run the <a href="/">free SEO check</a> on the home page or your most important service page. Fix anything marked <strong>critical</strong> first.</p>
<h2>2. Crawl the whole site (3 minutes)</h2>
<p>Run a <a href="/website-audit">website audit</a> to find broken links, duplicate titles and orphan pages across the site.</p>
<h2>3. Look at Google's own data (3 minutes)</h2>
<p>In <a href="/guides/google-search-console">Google Search Console</a>, check the <strong>Pages</strong> report for pages that aren't indexed, and the <strong>Performance</strong> report for the searches you already appear for. If you haven't set it up, do it today \u2013 it's free.</p>
<h2>4. Compare with a competitor (2 minutes)</h2>
<p>Use the <a href="/seo-comparison">competitor comparison</a> against a business that ranks above you, and note where they're ahead.</p>
<h2>5. Keep watching</h2>
<p>Turn on <a href="/seo-monitoring">free weekly monitoring</a> so you hear about problems before they cost you visitors.</p>`,
    faqs: [["How often should I check my website's SEO?", "After any big change \u2013 a redesign, new plugin or new pages \u2013 and otherwise once a month. Weekly monitoring catches problems in between."], ["Do I need paid SEO tools?", "Not to start. Free checks plus Google Search Console cover most of what a small business needs; paid tools add keyword and backlink data."], ["Can I check a website I don't own?", "Yes \u2013 XKey checks any public page. Search Console data needs you to verify ownership, though."]]
  },
  {
    path: "/guides/ai-search-optimisation",
    crumb: "AI search optimisation",
    parent: ["/guides", "Guides"],
    article: true,
    title: "AI Search Optimisation: Get Found by ChatGPT & AI",
    desc: "How to get your business found and cited by ChatGPT, Claude, Perplexity and Google AI Overviews: crawl access, entities, answers and trust.",
    h1: "AI search optimisation: getting found by ChatGPT and AI Overviews",
    lead: "AI assistants are becoming a front door to the web. Here's how to make sure they can find, understand and recommend your business.",
    sections: `<h2>1. Let the right crawlers in</h2>
<p>AI search features fetch pages with their own crawlers \u2013 for example OAI-SearchBot (ChatGPT search), Claude-SearchBot, PerplexityBot and Googlebot (AI Overviews). If robots.txt blocks them, you can't be cited. Training crawlers such as GPTBot and Google-Extended are separate: blocking them doesn't remove you from search. Test your rules with the <a href="/robots-txt-tester">robots.txt tester</a>, and see our guide to <a href="/guides/block-ai-training-bots">blocking training bots without leaving AI search</a>.</p>
<h2>2. Make it obvious who you are</h2>
<p>Add Organization or LocalBusiness structured data with your name, website, logo, contact details and <code>sameAs</code> links to official profiles such as your Google Business Profile and LinkedIn page. Keep the same name and details everywhere.</p>
<h2>3. Answer questions directly</h2>
<p>Write headings as the questions customers ask ("How much does a new boiler cost?") and answer in the first sentence underneath. AI tools quote clear, specific answers far more readily than marketing copy.</p>
<h2>4. Show you're current and accountable</h2>
<p>Show a "last updated" date, add <code>dateModified</code> to your structured data, and link to About, Contact and Privacy pages. Avoid <code>nosnippet</code> unless you really mean to stop your text being quoted.</p>
<h2>5. Earn mentions elsewhere</h2>
<p>Assistants also weigh what other sites say about you: reviews, directories, local news and genuine discussions. That part takes time and can't be faked.</p>
<p>Check your site now with the <a href="/ai-seo-checker">AI SEO checker</a>.</p>`,
    faqs: [["Is GEO different from SEO?", "Mostly it's the same work done more thoroughly. The extra parts are AI crawler access, clear information about who you are and direct answers to questions."], ["Can I pay to appear in AI answers?", "Not in the organic answers. Be wary of anyone promising guaranteed placement in ChatGPT or AI Overviews."], ["How do I know if AI assistants mention my business?", "Ask them. Search for your service and town in ChatGPT, Perplexity and Google, note who gets named, and repeat monthly."]]
  },
  {
    path: "/guides/core-web-vitals",
    crumb: "Core Web Vitals explained",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Core Web Vitals Explained: LCP, INP and CLS",
    desc: "Core Web Vitals in plain English: what LCP, INP and CLS measure, Google's thresholds, and the most common fixes for each.",
    h1: "Core Web Vitals explained",
    lead: "Google's Core Web Vitals measure how fast and stable a page feels to real visitors. Here's what each one means and how to improve it.",
    sections: `<h2>LCP \u2013 Largest Contentful Paint (good: 2.5 s or less)</h2>
<p>How long until the biggest thing on screen \u2013 usually a hero image or headline \u2013 appears. Common fixes: faster hosting or a CDN, compressing and resizing the hero image, not lazy-loading the first image, and removing render-blocking scripts.</p>
<h2>INP \u2013 Interaction to Next Paint (good: 200 ms or less)</h2>
<p>How quickly the page reacts when someone taps or clicks. Common fixes: less JavaScript, removing heavy third-party widgets and splitting long tasks.</p>
<h2>CLS \u2013 Cumulative Layout Shift (good: 0.1 or less)</h2>
<p>How much the page jumps around while loading. Common fixes: giving images and embeds a width and height, reserving space for adverts and banners, and loading fonts carefully.</p>
<h2>Lab data vs real-user data</h2>
<p>Lab tests (Lighthouse) load your page once on a simulated phone. Real-user data (the Chrome UX Report) comes from actual Chrome visitors over 28 days, and it's what Google uses. XKey's <a href="/page-speed-checker">page speed checker</a> shows both.</p>`,
    faqs: [["Where can I find my Core Web Vitals?", "In Google Search Console's Core Web Vitals report, in PageSpeed Insights, or in XKey's page speed checker."], ["What happened to FID?", "Interaction to Next Paint (INP) replaced First Input Delay as a Core Web Vital in March 2024."], ["Why does my site have no real-user data?", "The Chrome UX Report only covers pages and sites with enough Chrome visits. Until then, use the lab test as a guide."]]
  },
  {
    path: "/guides/why-is-my-website-not-on-google",
    crumb: "Why isn't my website on Google?",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Why Isn't My Website on Google? 9 Causes and Fixes",
    desc: "Can't find your website on Google? The nine most common causes \u2013 from a stray noindex tag to a brand-new domain \u2013 and how to fix each one.",
    h1: "Why isn't my website on Google?",
    lead: "If you search for your business and your website doesn't appear, one of a handful of problems is almost always to blame. Here's how to find which one, in the order most likely to matter.",
    sections: `<h2>First: is it really missing?</h2>
<p>Type <code>site:yourdomain.co.uk</code> into Google. If you see a list of your pages, your site <em>is</em> indexed \u2013 it just isn't ranking for the words you tried, which is a different problem (see cause 8). If Google shows nothing at all, work through the causes below. The quickest way to test most of them at once is a <a href="/">free SEO check</a> on your home page.</p>
<h2>1. The site is very new</h2>
<p>Google has to discover a site before it can index it. A brand-new domain with no links pointing at it can take anything from a few days to several weeks to appear. You can speed this up by adding the site to Google Search Console and submitting your sitemap \u2013 our <a href="/guides/google-search-console">Search Console guide</a> walks through it.</p>
<h2>2. A noindex tag is telling Google to stay away</h2>
<p>This is the most common cause on sites that were built on a staging server. A <code>&lt;meta name="robots" content="noindex"&gt;</code> tag, or an <code>X-Robots-Tag: noindex</code> header, asks search engines not to list the page. In WordPress, check that <strong>Settings \u203A Reading \u203A Discourage search engines</strong> is unticked. XKey flags noindex as a critical problem.</p>
<h2>3. robots.txt is blocking Googlebot</h2>
<p>A single line \u2013 <code>Disallow: /</code> under <code>User-agent: *</code> \u2013 blocks the whole site. Paste your rules into the <a href="/robots-txt-tester">robots.txt tester</a> and test your home page against Googlebot. Remember that robots.txt stops crawling, not indexing: a blocked page can still appear as a bare link with no description, which is rarely what you want.</p>
<h2>4. The page returns an error</h2>
<p>Pages that answer with a 404, 410 or 5xx status code are dropped from Google. So are pages Google thinks are "soft 404s" \u2013 they say 200 OK but look empty or like an error page. Our <a href="/guides/broken-links-and-redirects">guide to broken links and redirects</a> explains how to fix them.</p>
<h2>5. The canonical tag points somewhere else</h2>
<p>A canonical tag tells Google which address is the "real" version of a page. If every page on your site points its canonical at the home page, or at the old staging domain, Google will index that address instead of yours. Each page should normally point to itself.</p>
<h2>6. There's not enough on the page</h2>
<p>Google doesn't index everything it crawls. Pages with only a heading and a photo, or text copied from another site, are often crawled and then left out. In Search Console these show as "Crawled \u2013 currently not indexed". Write something genuinely useful \u2013 what you do, where, for whom, how much it costs and how to get in touch.</p>
<h2>7. Google can't see the content</h2>
<p>If your text only appears after JavaScript runs, or is inside images, Google may see an almost blank page. Most modern site builders are fine, but some single-page apps and old Flash-style templates are not. The <a href="/">SEO check</a> reports the word count Google can actually read.</p>
<h2>8. It's indexed but not ranking</h2>
<p>If <code>site:</code> finds you but your name or service doesn't, you're competing with other pages. Make sure your title and H1 say exactly what you do and where, set up a Google Business Profile if you serve local customers (see our <a href="/guides/local-seo-checklist">local SEO checklist</a>), and earn a few genuine links from local directories, suppliers and associations.</p>
<h2>9. A manual action or security issue</h2>
<p>Rarely, Google removes a site for spam or because it has been hacked. Search Console's <strong>Security &amp; Manual actions</strong> section will tell you if this has happened and what to fix. Hacked sites often show strange pages in a <code>site:</code> search \u2013 Japanese text or pharmacy keywords are common signs.</p>`,
    faqs: [["How long does it take for a new website to appear on Google?", "Usually a few days to a few weeks. Submitting a sitemap in Google Search Console and getting even one link from an established site helps Google find it sooner."], ["Can I pay Google to index my website?", "No. Indexing is free and can't be bought. Google Ads put you in the paid results, but they don't affect whether your pages are indexed or how they rank."], ["Why does my site show on Bing but not Google?", "The two search engines crawl and index separately. Check Google Search Console's Pages report for the reason Google gives, and fix anything marked as an error."]]
  },
  {
    path: "/guides/google-search-console",
    crumb: "How to set up Google Search Console",
    parent: ["/guides", "Guides"],
    article: true,
    title: "How to Set Up Google Search Console (Step by Step)",
    desc: "Set up Google Search Console in 15 minutes: choose a property type, verify your site, submit a sitemap and learn the four reports that matter most.",
    h1: "How to set up Google Search Console",
    lead: "Search Console is Google's free tool for website owners. It's the only place to see which searches you appear for, which pages Google has indexed and why others were left out.",
    sections: `<h2>Why every website needs Search Console</h2>
<p>An SEO checker like XKey looks at your pages from the outside. Search Console shows Google's own view from the inside: the actual searches people used to find you, how often you appeared, how many clicked, and any page Google couldn't index along with the reason. It costs nothing and takes about 15 minutes to set up.</p>
<h2>Step 1: choose a property type</h2>
<p>Go to Google Search Console, sign in with a Google account and click <strong>Add property</strong>. You'll see two choices:</p>
<ul><li><strong>Domain property</strong> \u2013 covers every version of your site (http and https, www and non-www, and all subdomains). It can only be verified with a DNS record, so you need access to wherever your domain is managed.</li><li><strong>URL-prefix property</strong> \u2013 covers one exact address, such as <code>https://www.example.co.uk/</code>. It offers more ways to verify, including uploading a file or adding a meta tag.</li></ul>
<p>If you can edit your DNS, choose Domain. If your web designer manages everything, a URL-prefix property for the exact address your site uses is fine.</p>
<h2>Step 2: verify that you own the site</h2>
<p>For a Domain property, Google gives you a TXT record to add in your DNS settings (at your registrar, or Cloudflare if you use it). For a URL-prefix property, the simplest options are uploading the HTML file Google gives you to your site's root folder, or pasting a meta tag into your home page's <code>&lt;head&gt;</code>. Sites already using Google Analytics or Tag Manager can often verify with one click. Then press <strong>Verify</strong>. DNS changes can take a little while to be seen \u2013 if it fails, wait an hour and try again.</p>
<h2>Step 3: submit your sitemap</h2>
<p>Open <strong>Sitemaps</strong>, type the address of your sitemap (often <code>sitemap.xml</code> or <code>sitemap_index.xml</code>) and click Submit. Google should show "Success" and the number of pages it found. Not sure you have one? Run the <a href="/sitemap-checker">sitemap checker</a>, or make one with the <a href="/xml-sitemap-generator">XML sitemap generator</a>.</p>
<h2>Step 4: learn the four reports that matter</h2>
<ul><li><strong>Performance</strong> \u2013 searches, clicks, impressions and average position. Filter by page to see what each one ranks for.</li><li><strong>Pages</strong> (under Indexing) \u2013 which pages are indexed and, for the rest, why not: noindex, redirect, not found, duplicate or "crawled \u2013 currently not indexed".</li><li><strong>URL inspection</strong> \u2013 type any address into the bar at the top to see exactly how Google last saw it, and request indexing after you've fixed or published a page.</li><li><strong>Core Web Vitals</strong> \u2013 real-visitor speed data, grouped into good, needs improvement and poor. Our <a href="/guides/core-web-vitals">Core Web Vitals guide</a> explains it.</li></ul>
<h2>Step 5: add Bing too</h2>
<p>Bing Webmaster Tools can import your verified sites straight from Search Console, so it takes a couple of minutes. Bing also powers several other search services, so it's worth having.</p>
<h2>What Search Console won't tell you</h2>
<p>It doesn't check your titles, structured data, security headers or AI crawler access in detail, and it only reports on your own site. Pair it with a regular <a href="/">SEO check</a> and <a href="/seo-monitoring">weekly monitoring</a> to catch problems before they show up in Google's data.</p>`,
    faqs: [["Is Google Search Console free?", "Yes, completely. There's no paid version."], ["How long until data appears?", "Usually a few days after verification. Performance data then covers up to the last 16 months, starting from when Google first collected it."], ["Does using Search Console improve my rankings?", "Not by itself. It shows you what to fix and lets you ask Google to recrawl pages, which helps new and updated pages get picked up sooner."]]
  },
  {
    path: "/guides/title-tags",
    crumb: "How to write title tags",
    parent: ["/guides", "Guides"],
    article: true,
    title: "How to Write Title Tags That Fit Google's Results",
    desc: "How to write title tags that rank and get clicked: why Google cuts titles by pixel width, what to put first, examples and the mistakes to avoid.",
    h1: "How to write title tags that fit Google",
    lead: "Your title tag is usually the blue headline people see in Google. It's one of the strongest signals of what a page is about, and it decides whether anyone clicks.",
    sections: `<h2>What is a title tag?</h2>
<p>It's the text between <code>&lt;title&gt;</code> and <code>&lt;/title&gt;</code> in a page's HTML. Browsers show it in the tab, social sites use it when a link is shared, and Google uses it for the headline of your search result \u2013 which Google calls the "title link".</p>
<h2>Why length is measured in pixels, not characters</h2>
<p>Google cuts long titles to fit the width of the results page, adding "\u2026" at the end. Because letters have different widths \u2013 a "W" is far wider than an "i" \u2013 a 55-character title in capitals can be cut while a 65-character title in lower case fits. On desktop the space is roughly 600 pixels. Our <a href="/title-tag-checker">title tag checker</a> measures your title the way Google displays it, so you can see exactly where it would be cut.</p>
<h2>A simple formula that works</h2>
<p><strong>Main search phrase + what makes you different + location (if local)</strong>. For example:</p>
<ul><li><em>Emergency Plumber in Preston | 24/7, No Call-Out Fee</em></li><li><em>Wedding Cakes Blackpool | Handmade to Order Since 2009</em></li><li><em>How to Bleed a Radiator (With Pictures)</em></li></ul>
<p>Put the words people actually search for at the start, where they're least likely to be cut and most likely to be read. Your brand name can go at the end if there's room \u2013 but on most pages, Google already shows your site name above the title, so it isn't essential.</p>
<h2>Seven mistakes to avoid</h2>
<ol><li><strong>The same title on every page.</strong> Each page needs its own. Duplicate titles make it hard for Google to tell pages apart \u2013 the <a href="/website-audit">website audit</a> finds them across your whole site.</li><li><strong>"Home" or "Welcome".</strong> These tell searchers nothing.</li><li><strong>Keyword stuffing.</strong> "Plumber Preston, Plumbers Preston, Cheap Plumber Preston" looks like spam, and Google is likely to rewrite it.</li><li><strong>Too long.</strong> The important part gets cut off.</li><li><strong>Too short.</strong> "Services" wastes space you could use to persuade.</li><li><strong>Not matching the page.</strong> If the title promises prices, show prices \u2013 otherwise people bounce back to Google.</li><li><strong>All capitals.</strong> Harder to read and takes up more width.</li></ol>
<h2>Why Google sometimes rewrites your title</h2>
<p>Google can replace a title with text from your H1, headings or links when it thinks the original is too long, stuffed with keywords, the same as other pages or a poor match for the search. Keeping your title accurate, unique and close to your H1 is the best way to have it shown as written.</p>
<p>Need ideas? Try the <a href="/blog-title-generator">blog title generator</a> or let the <a href="/ai-meta-description-generator">AI title and description writer</a> suggest options that fit.</p>`,
    faqs: [["How many characters should a title tag be?", "Around 50\u201360 characters usually fits, but Google measures pixel width rather than characters, so check it with a pixel-width checker."], ["Should the title tag and H1 be the same?", "They can be similar. The title is written for the search results; the H1 is the heading on the page. Keeping them close helps Google show your title as written."], ["Does changing my title tag affect rankings?", "It can, for better or worse. Change one page at a time and watch its clicks and position in Search Console for a few weeks."]]
  },
  {
    path: "/guides/meta-descriptions",
    crumb: "How to write a meta description",
    parent: ["/guides", "Guides"],
    article: true,
    title: "How to Write a Meta Description That Gets Clicks",
    desc: "What a meta description is, whether Google uses it, how long it should be and a simple formula for writing one that earns the click \u2013 with examples.",
    h1: "How to write a meta description",
    lead: "A meta description is the short summary that often appears under your title in Google. It doesn't change your ranking directly, but a good one can win you the click.",
    sections: `<h2>Does Google actually use meta descriptions?</h2>
<p>Sometimes. Google has said the description isn't a ranking factor, and it often writes its own snippet from your page text when that matches the search better. But when your description is accurate and relevant, Google frequently shows it as written \u2013 and it's also used by Facebook, LinkedIn, WhatsApp and many AI tools when your link is shared. It's worth five minutes per important page.</p>
<h2>How long should it be?</h2>
<p>Like titles, descriptions are cut by width, not character count. Around 140\u2013155 characters usually shows in full on desktop, and a little less on mobile. Put the important part first so a cut-off version still makes sense. The <a href="/title-tag-checker">title tag checker</a> measures both your title and description in pixels.</p>
<h2>A formula for descriptions that get clicked</h2>
<p><strong>What you offer + why choose you + what to do next.</strong></p>
<ul><li><em>Local electrician in Lytham for rewires, fuse boards and EV chargers. NICEIC registered, fixed prices, free quotes \u2013 call today.</em></li><li><em>Find out how much a loft conversion costs in 2026, what affects the price and how to save, with real examples from the North West.</em></li></ul>
<p>Use the words people search for \u2013 Google shows matching words in bold, which draws the eye. Be specific: numbers, places, prices and guarantees beat vague words like "quality" and "professional".</p>
<h2>Common mistakes</h2>
<ul><li><strong>Leaving it blank</strong> \u2013 Google will pick some text from the page, which may be a cookie notice or a menu.</li><li><strong>The same description on every page</strong> \u2013 each page needs its own. The <a href="/website-audit">website audit</a> lists duplicates.</li><li><strong>Promising what the page doesn't deliver</strong> \u2013 it costs you visitors who leave straight away.</li><li><strong>Using quotation marks</strong> \u2013 in some systems a double quote ends the description early.</li></ul>
<h2>How to add one</h2>
<p>Most website builders and SEO plugins (Yoast, Rank Math, Squarespace, Wix, Shopify) have a "search appearance" or "SEO description" box for each page. If you edit HTML yourself, use the <a href="/meta-tag-generator">meta tag generator</a> to create the tag, or let the <a href="/ai-meta-description-generator">AI description writer</a> draft one from your page.</p>`,
    faqs: [["Is a meta description a ranking factor?", "No, not directly. It affects how many people click your result, and more relevant clicks are good for your business either way."], ["Why is Google showing different text from my meta description?", "Google picks the text it thinks best answers each search. A description that clearly summarises the page is more likely to be shown."], ["Do I need a meta description on every page?", "Your important pages should each have a unique one. For very large sites, it's better to leave some blank than to repeat the same text everywhere."]]
  },
  {
    path: "/guides/local-seo-checklist",
    crumb: "Local SEO checklist",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Local SEO Checklist for UK Small Businesses",
    desc: "A practical local SEO checklist for UK small businesses: Google Business Profile, consistent contact details, local pages, schema, reviews and citations.",
    h1: "Local SEO checklist for UK small businesses",
    lead: 'When someone searches for a plumber, caf\xE9 or accountant "near me", Google shows a map and three businesses before any normal results. This checklist covers what gets you into that map pack and onto page one.',
    sections: `<h2>How Google decides local rankings</h2>
<p>Google says local results are based mainly on three things: <strong>relevance</strong> (how well your business matches the search), <strong>distance</strong> (how far you are from the searcher or the place they named) and <strong>prominence</strong> (how well known you are, from reviews, links and mentions across the web). You can't move your premises, but you can improve the other two.</p>
<h2>1. Claim and complete your Google Business Profile</h2>
<p>This is the single most important step for local search. Choose the most accurate primary category, add your hours, services, service areas, photos and a description written for customers. Our <a href="/guides/google-business-profile">Google Business Profile guide</a> covers setup and verification.</p>
<h2>2. Keep your name, address and phone number identical everywhere</h2>
<p>Your business name, address and phone number (often called NAP) should match exactly on your website, Google profile, Facebook page and directory listings. "Unit 4, 12 High St" on one site and "12 High Street, Unit 4" on another isn't a disaster, but a different phone number or an old address is. Put your details in the footer of every page as text, not just in an image.</p>
<h2>3. Give each service and main town its own page</h2>
<p>A page for "boiler repairs" and another for "boiler installation" can each rank for its own searches. If you serve several towns, a page for each <em>main</em> area is fine \u2013 as long as each says something genuinely specific: jobs you've done there, travel times, local regulations or prices. Dozens of near-identical "plumber in [town]" pages are doorway pages and break Google's spam rules.</p>
<h2>4. Add LocalBusiness structured data</h2>
<p>LocalBusiness schema tells Google and AI assistants your name, address, phone, hours, area served and website in a format machines can read without guessing. Create it with the <a href="/schema-generator">local business schema generator</a>, then check it with the <a href="/local-seo-checker">local SEO checker</a>.</p>
<h2>5. Get reviews the honest way</h2>
<p>Ask every happy customer, and make it easy with a short link to your Google review form. Reply to every review, especially the bad ones \u2013 calmly and helpfully. Never buy reviews, write your own, offer discounts for them or only ask customers you know are happy: it breaks Google's rules, and the Digital Markets, Competition and Consumers Act 2024 made fake reviews illegal in the UK.</p>
<h2>6. List your business in the right directories</h2>
<p>A handful of accurate listings beats hundreds of junk ones. Good places to start: Bing Places, Apple Business Connect, Yell, Thomson Local, Facebook, your trade body (such as Gas Safe, NICEIC or the Federation of Master Builders), your local chamber of commerce and any respected sites for your industry.</p>
<h2>7. Be visible to AI assistants too</h2>
<p>People increasingly ask ChatGPT or Google's AI Overviews for local recommendations. They can only suggest businesses they can read and understand \u2013 check yours with the <a href="/ai-seo-checker">AI SEO checker</a> and read our <a href="/guides/ai-search-optimisation">AI search guide</a>.</p>
<h2>8. Check how you look in other towns</h2>
<p>Results change from street to street. The <a href="/local-search-checker">local search checker</a> shows Google's results as they appear in any UK town, so you can see who you're really up against.</p>`,
    faqs: [["Do I need a website for local SEO?", "You can appear in the map pack with only a Google Business Profile, but a website gives Google more to go on and gives customers somewhere to check you out. Most top-ranking local businesses have both."], ["Can I rank in a town where I don't have an office?", "In the normal results, yes, with a genuinely useful page about your work there. In the map pack it's much harder, because distance matters a lot."], ["Should I use a virtual office address?", "No. Google's guidelines don't allow mailboxes or virtual offices as a business address unless the office is staffed during your business hours. Service-area businesses can hide their address and list the areas they cover instead."]]
  },
  {
    path: "/guides/google-business-profile",
    crumb: "Google Business Profile guide",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Google Business Profile: How to Set It Up and Verify",
    desc: "How to create, verify and get the most from a free Google Business Profile: categories, service areas, video verification, photos, posts and reviews.",
    h1: "Google Business Profile: set up and verify",
    lead: "A Google Business Profile is the free listing that shows your business on Google Maps and in the local map pack. For most local businesses, it brings in more calls than the website does.",
    sections: `<h2>Before you start</h2>
<p>Search Google Maps for your business name first. If a profile already exists \u2013 Google sometimes creates them from public information \u2013 you'll claim it rather than create a new one. Duplicate profiles confuse customers and Google, so never make a second one. You'll need a Google account; use one the business controls, not a personal or employee account that might disappear.</p>
<h2>Step 1: create or claim the profile</h2>
<p>Go to Google Business Profile, enter your business name and choose your <strong>primary category</strong>. This is the most important choice you'll make: pick the one that describes what you <em>are</em> ("Plumber", "Wedding photographer", "Italian restaurant") rather than everything you do. You can add extra categories later.</p>
<h2>Step 2: storefront or service-area business</h2>
<p>If customers visit you, enter your address. If you go to them \u2013 trades, cleaners, mobile hairdressers \u2013 you can hide your address and list the towns or postcodes you cover instead. You can't use a PO box, virtual office or someone else's address.</p>
<h2>Step 3: verification</h2>
<p>Google needs to confirm you really run the business, and Google decides which method you're offered. For most new profiles that's now a <strong>short video</strong>, recorded on your phone in one continuous take. It typically needs to show:</p>
<ul><li><strong>Where you are</strong> \u2013 your street, nearby businesses or your signage.</li><li><strong>That the business is real</strong> \u2013 equipment, stock, branded vehicles or your workspace.</li><li><strong>That you manage it</strong> \u2013 for example unlocking the door, opening a till or showing tools only staff would have.</li></ul>
<p>Keep faces and private documents out of shot. Reviews of the video usually take a few working days. Older or established profiles may be offered phone, email or instant verification instead. If the video is rejected, read the reason carefully, fix it and submit a new one rather than creating another profile.</p>
<h2>Step 4: fill in everything</h2>
<ul><li><strong>Hours</strong>, including bank holidays and special hours.</li><li><strong>Services or menu</strong>, with prices where you can.</li><li><strong>Description</strong> \u2013 up to 750 characters, written for customers. Mention what you do and where, without stuffing in keywords.</li><li><strong>Photos</strong> \u2013 real photos of your work, team, premises and vehicles. Profiles with photos get far more attention than those without.</li><li><strong>Website link</strong> \u2013 to your home page or the most relevant local page.</li></ul>
<h2>Step 5: keep it active</h2>
<p>Add new photos, share updates and offers as posts, keep your hours accurate and reply to every review. Make sure your name, address and phone number match your website exactly \u2013 see the <a href="/guides/local-seo-checklist">local SEO checklist</a>.</p>
<h2>Rules that get profiles suspended</h2>
<p>Adding keywords or towns to your business name ("Smith Plumbing \u2013 Best Plumber Preston"), using a fake or shared address, creating more than one profile per location, and buying or faking reviews. Suspension can take weeks to reverse, so it isn't worth the risk.</p>
<p>Once your profile is live, check your website's local signals with the <a href="/local-seo-checker">local SEO checker</a>.</p>`,
    faqs: [["Does a Google Business Profile cost anything?", "No. It's free. Be wary of anyone calling to say your listing will be removed unless you pay \u2013 Google doesn't charge for profiles."], ["Can I choose postcard verification?", "Google decides which verification methods you're offered, and for most new profiles that's video. If another option is available you'll see it on the verification screen."], ["How long does it take to appear on Google Maps?", "Usually within a few days of successful verification, though edits can take a little longer to show everywhere."]]
  },
  {
    path: "/guides/schema-markup",
    crumb: "Schema markup for small businesses",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Schema Markup for Small Businesses: What to Add",
    desc: "Schema markup in plain English: which types a small business website needs, what Google still shows as rich results in 2026, and how to add it safely.",
    h1: "Schema markup for small businesses",
    lead: "Schema markup \u2013 also called structured data \u2013 is a short block of code that tells search engines and AI assistants exactly what's on a page, so they don't have to guess.",
    sections: `<h2>What schema markup does</h2>
<p>A person reading your contact page knows which string of digits is your phone number and that "Mon\u2013Fri 9\u20135" means your opening hours. A machine has to guess. Schema markup labels these facts using a shared vocabulary from schema.org, usually in a format called JSON-LD that sits in the page's code without changing how it looks. Google recommends JSON-LD because it's the easiest to add and maintain.</p>
<h2>What it can and can't do</h2>
<p>Structured data can make your result eligible for extra features \u2013 star ratings on products, event dates, breadcrumbs and more \u2013 and it helps Google and AI assistants connect your website with your business. It doesn't guarantee those features, and it isn't a direct ranking boost. Google ignores markup that describes things not visible on the page, and misleading markup can lead to a manual action.</p>
<h2>The schema types most small businesses need</h2>
<ul><li><strong>Organization</strong> or <strong>LocalBusiness</strong> (or a more specific type such as Plumber, Dentist or Restaurant) \u2013 your name, logo, address, phone, hours, area served, website and <code>sameAs</code> links to your official profiles. Put it on your home page and contact page. Create it with the <a href="/schema-generator">local business schema generator</a>.</li><li><strong>WebSite</strong> \u2013 your site name, which helps Google show the right name above your results.</li><li><strong>BreadcrumbList</strong> \u2013 shows where a page sits on your site, and can replace the address in your search result with a tidy path.</li><li><strong>Product</strong> \u2013 for shops: price, currency, availability and reviews from real customers.</li><li><strong>Article</strong> \u2013 for blog posts and guides: headline, author and dates.</li><li><strong>Event</strong> \u2013 for gigs, classes and open days with dates and locations.</li></ul>
<h2>What changed recently</h2>
<p>Google has been cutting back the rich results it shows. HowTo rich results were removed in 2023. FAQ rich results were limited to government and health sites the same year, and on 7 May 2026 Google stopped showing them for everyone. There's no penalty for keeping FAQ markup, but it no longer earns extra space in Google, so it isn't worth adding new. Star ratings for a business reviewing <em>itself</em> \u2013 on its own LocalBusiness or Organization markup \u2013 haven't been shown since 2019.</p>
<h2>How to add schema markup</h2>
<p>On WordPress, plugins such as Yoast and Rank Math add the basics automatically. Shopify, Wix and Squarespace include some markup too \u2013 check what's already there before adding more, so you don't end up with two conflicting versions. For custom sites, paste the JSON-LD into the page's <code>&lt;head&gt;</code> or just before <code>&lt;/body&gt;</code>.</p>
<h2>How to check it</h2>
<p>Run the <a href="/schema-checker">schema checker</a> on the page. It validates your JSON-LD, lists the types found and shows any properties Google requires that are missing. Re-check after every redesign or plugin update \u2013 broken markup is one of the most common things a site change quietly breaks.</p>`,
    faqs: [["Is schema markup a ranking factor?", "Not directly. It helps search engines understand your pages and can make them eligible for rich results, which can improve clicks."], ["Do AI assistants use schema markup?", "AI search tools read structured data along with the visible page. Clear Organization or LocalBusiness markup makes it easier for them to connect your website with the right business details."], ["Should I remove my FAQ schema?", "There's no need to rush. Google says it doesn't cause problems, though it no longer produces rich results. Remove it next time you're editing the page if you'd like tidier code."]]
  },
  {
    path: "/guides/llms-txt",
    crumb: "What is llms.txt?",
    parent: ["/guides", "Guides"],
    article: true,
    title: "What Is llms.txt and Does Your Website Need One?",
    desc: "What llms.txt is, who uses it, what Google says about it, and whether it's worth adding to your website \u2013 an honest, plain-English answer.",
    h1: "What is llms.txt and does your website need one?",
    lead: "llms.txt is a short text file that gives AI tools a summary of your website and a list of its most important pages. It's simple to add \u2013 but it's worth knowing what it does and doesn't do.",
    sections: `<h2>Where llms.txt came from</h2>
<p>The format was proposed in September 2024 by Jeremy Howard of Answer.AI. The idea: web pages are full of menus, adverts and scripts that large language models (LLMs) have to wade through. A plain Markdown file at <code>yourdomain.co.uk/llms.txt</code> could give them a clean summary instead \u2013 who you are, what the site covers and links to the pages that matter.</p>
<h2>What goes in the file</h2>
<p>A typical llms.txt has:</p>
<ul><li>a heading with your site or business name,</li><li>a one-line summary in a quote block,</li><li>a short paragraph with any important context, and</li><li>sections of links, each with a few words about the page \u2013 for example your services, prices, guides and contact page.</li></ul>
<p>You can see XKey's own at <a href="/llms.txt">xkey.co.uk/llms.txt</a>, or build yours in a minute with the <a href="/llms-txt-generator">llms.txt generator</a>.</p>
<h2>Does Google use it?</h2>
<p>No \u2013 not for Search. Google's Search guidance says you don't need llms.txt or any other special file to appear in AI Overviews or AI Mode; those features draw on the normal search index, so ordinary SEO is what counts. Other parts of Google take a different view: in 2026 Lighthouse added an experimental check for llms.txt as part of assessing whether sites are ready for AI agents browsing on people's behalf.</p>
<h2>Do ChatGPT, Claude or Perplexity use it?</h2>
<p>None of the big AI companies has published a commitment to read llms.txt when deciding what to cite. Some AI coding tools and documentation sites do use it, and AI agents may fetch it when they're sent to explore a site. In short: there's no evidence it boosts your visibility today, and no evidence it does any harm.</p>
<h2>So should you add one?</h2>
<p>If it takes you ten minutes, yes \u2013 it's a tidy summary of your site, it costs nothing and it may become more useful as AI agents spread. But it is <em>not</em> a replacement for the things that demonstrably matter for AI search:</p>
<ul><li>letting AI search crawlers in through robots.txt (see our guide to <a href="/guides/block-ai-training-bots">blocking training bots without leaving AI search</a>),</li><li>clear Organization or LocalBusiness <a href="/guides/schema-markup">schema markup</a>,</li><li>pages that answer real questions directly, and</li><li>being indexed by Google and Bing in the first place.</li></ul>
<p>The <a href="/ai-seo-checker">AI SEO checker</a> tests all of these, including whether you have an llms.txt file, and weights them by how much they really matter.</p>`,
    faqs: [["Is llms.txt the same as robots.txt?", "No. robots.txt tells crawlers which pages they may visit. llms.txt is a summary and reading list; it doesn't allow or block anything."], ["Where does the llms.txt file go?", "In the root of your website, so it loads at yourdomain.co.uk/llms.txt \u2013 the same place as robots.txt."], ["What is llms-full.txt?", "An optional companion file containing the full text of your key pages in Markdown. It's mainly used by software documentation sites and isn't needed for most businesses."]]
  },
  {
    path: "/guides/block-ai-training-bots",
    crumb: "Block AI training bots",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Block AI Training Bots but Stay Visible in AI Search",
    desc: "Stop AI companies training on your content while staying visible in ChatGPT search, Perplexity and Google AI Overviews \u2013 with robots.txt examples.",
    h1: "How to block AI training bots but stay in AI search",
    lead: "Many businesses want to stop AI companies copying their content for training \u2013 without disappearing from the AI assistants their customers now use to find them. With the right robots.txt rules, you can do both.",
    sections: `<h2>Training crawlers and search crawlers are different</h2>
<p>Most AI companies now use separate crawlers for separate jobs. <strong>Training crawlers</strong> collect pages to build future AI models. <strong>Search crawlers</strong> fetch pages so an assistant can find, quote and link to you when someone asks a question. A third kind fetches a page only when a user asks the assistant to look at it. Blocking a training crawler doesn't stop the search crawler from the same company.</p>
<h2>The main crawlers to know</h2>
<ul><li><strong>OpenAI</strong> \u2013 GPTBot (training), OAI-SearchBot (ChatGPT search), ChatGPT-User (pages a user asks about).</li><li><strong>Anthropic</strong> \u2013 ClaudeBot (training), Claude-SearchBot (search), Claude-User (pages a user asks about).</li><li><strong>Perplexity</strong> \u2013 PerplexityBot (search), Perplexity-User (pages a user asks about).</li><li><strong>Google</strong> \u2013 Googlebot crawls for Search, including AI Overviews and AI Mode. <em>Google-Extended</em> isn't a separate crawler but a robots.txt token that controls whether your content is used for Gemini models; blocking it doesn't affect Google Search.</li><li><strong>Apple</strong> \u2013 Applebot (search features such as Siri and Spotlight); Applebot-Extended controls use for Apple's AI training.</li><li><strong>Common Crawl</strong> \u2013 CCBot builds a public web archive that many AI models have been trained on.</li></ul>
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
<ul><li><strong>It's a request, not a lock.</strong> Reputable companies follow it; badly behaved scrapers ignore it. For those, firewall rules are the answer \u2013 Cloudflare, for example, offers a setting to block known AI crawlers at the network level.</li><li><strong>It isn't retrospective.</strong> Content already collected for past training isn't removed.</li><li><strong>Crawler names change.</strong> New bots appear every year, so review your rules every few months.</li></ul>
<h2>Watch out for blocking everything by accident</h2>
<p>Some security plugins, hosting firewalls and "block AI" settings stop search crawlers as well as training crawlers. If your business never appears in ChatGPT or Perplexity answers, that's one of the first things to check. The <a href="/ai-seo-checker">AI SEO checker</a> fetches your robots.txt and shows which AI crawlers are allowed in, one by one.</p>
<p>For more on getting recommended by AI assistants, read our <a href="/guides/ai-search-optimisation">AI search optimisation guide</a>.</p>`,
    faqs: [["Will blocking GPTBot remove me from ChatGPT?", "No. ChatGPT's search feature uses OAI-SearchBot, which is controlled separately. Block GPTBot and allow OAI-SearchBot to stay findable without contributing to training."], ["Does blocking Google-Extended affect my Google rankings?", "No. Google says Google-Extended doesn't affect inclusion or ranking in Google Search, including AI Overviews."], ["How often should I update my AI crawler rules?", "Every few months, or whenever a major AI company announces a new crawler. The robots.txt generator is kept up to date with the main ones."]]
  },
  {
    path: "/guides/broken-links-and-redirects",
    crumb: "Broken links and redirects",
    parent: ["/guides", "Guides"],
    article: true,
    title: "Broken Links, 404 Errors and Redirects Explained",
    desc: "What 404 errors, soft 404s, 301 and 302 redirects and redirect chains mean for SEO, when they matter and how to find and fix them on your website.",
    h1: "Broken links, 404s and redirects explained",
    lead: "Every website collects broken links over time \u2013 pages get renamed, products sell out and other sites move. A few don't matter much. Left unchecked, they waste visitors, crawl time and links you've earned.",
    sections: `<h2>What the status codes mean</h2>
<ul><li><strong>200 OK</strong> \u2013 the page loaded normally.</li><li><strong>301 Moved Permanently</strong> \u2013 the page has a new permanent address. Search engines move it to the new URL and pass along its signals.</li><li><strong>302 Found / 307 Temporary Redirect</strong> \u2013 the page is somewhere else for now. Google treats a long-standing temporary redirect much like a permanent one, but 301 is clearer when a move is permanent.</li><li><strong>404 Not Found</strong> \u2013 nothing exists at this address.</li><li><strong>410 Gone</strong> \u2013 the page has been removed deliberately. Google drops it slightly faster than a 404.</li><li><strong>5xx</strong> \u2013 a server error. If these persist, Google slows down crawling and may drop pages.</li></ul>
<h2>Do 404 errors hurt SEO?</h2>
<p>Not on their own. Google has said 404s for pages that genuinely no longer exist are normal and don't count against the rest of your site. They matter when:</p>
<ul><li><strong>your own pages link to them</strong> \u2013 visitors hit a dead end, and Google wastes time crawling nothing;</li><li><strong>other websites link to them</strong> \u2013 any value from those links is lost; or</li><li><strong>an important page is broken by mistake</strong> \u2013 it drops out of Google.</li></ul>
<h2>Soft 404s</h2>
<p>A soft 404 is a page that returns "200 OK" but is empty, says "not found", or is a thin "no results" page. Google treats it as an error anyway and reports it in Search Console. Fix it by returning a real 404 or 410, redirecting to a genuinely relevant page, or adding proper content.</p>
<h2>When to redirect and when to let a page 404</h2>
<p>Redirect with a 301 when there's a close replacement \u2013 the renamed page, the new version of a product or the category it belonged to. Don't redirect everything to your home page; Google often treats that as a soft 404 and visitors find it confusing. If there's truly no equivalent, a helpful 404 page with a search box and links to your main sections is the right answer.</p>
<h2>Redirect chains</h2>
<p>A chain is when page A redirects to B, which redirects to C. Each hop adds delay, and Google stops following after several hops. Chains usually build up through redesigns \u2013 http to https, then non-www to www, then an old URL to a new one. Point every old address straight at its final destination, and update your internal links to use the final URL directly.</p>
<h2>How to find broken links</h2>
<ul><li>Check any single page with the <a href="/broken-link-checker">broken link checker</a>.</li><li>Crawl up to 250 pages with the <a href="/website-audit">website audit</a> to find broken internal links, redirect chains and the pages linking to them.</li><li>In Google Search Console, the <strong>Pages</strong> report lists URLs that are "Not found (404)" or "Soft 404", and the <strong>Links</strong> report shows which of your pages other sites link to most.</li></ul>
<h2>Prevent them in the first place</h2>
<p>Before changing a page's address, set up the redirect at the same time. After a redesign, crawl the old sitemap against the new site to make sure every old URL lands somewhere sensible. And turn on <a href="/seo-monitoring">weekly monitoring</a> so a broken key page doesn't go unnoticed for months.</p>`,
    faqs: [["How many redirects is too many?", "Ideally one hop from the old address to the new one. Two is fine; long chains slow pages down and risk Google giving up before the end."], ["Should I use a 404 or a 410 for deleted pages?", "Either works. A 410 tells Google the removal is deliberate and can get the page dropped a little faster."], ["Do redirects lose SEO value?", "A 301 to a closely matching page keeps nearly all of it. Redirecting to an unrelated page, such as the home page, loses most of it."]]
  },
  {
    path: "/about",
    crumb: "About",
    title: "About XKey | Free UK SEO Checker",
    desc: "XKey is a free SEO and AI search checker made by IceWork, a small web studio in Blackpool, for UK businesses.",
    h1: "About XKey",
    lead: "XKey is a free SEO and AI search checker for UK businesses, made by IceWork, a small web studio in Blackpool.",
    sections: `<h2>Why we built it</h2>
<p>Most SEO tools are built for agencies: expensive, hidden behind sign-ups, and full of jargon. Small business owners need something simpler \u2013 a clear score, a short list of what matters, and an honest explanation. We also wanted a tool that takes AI search seriously, because that's where search is heading.</p>
<h2>How it's built</h2>
<p>XKey runs on Cloudflare's network. Checks are based on what Google and the AI providers document publicly, and we update them as their guidance changes. We fetch pages the way a search engine does, follow robots.txt in the site audit and don't keep your content.</p>
<h2>Who's behind it</h2>
<p>XKey is made by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, a web design studio in Blackpool. If you'd like help fixing what XKey finds, IceWork can do it \u2013 but the tools are free to use either way.</p>`
  },
  {
    path: "/contact",
    crumb: "Contact",
    title: "Contact XKey | Free SEO Checker Help & Feedback",
    desc: "Contact the team behind XKey, the free UK SEO and AI search checker. Email us any time \u2013 we aim to reply within 24 hours.",
    h1: "Contact XKey",
    lead: "Questions, feedback or found a bug? Email us any time \u2013 we aim to reply within 24 hours.",
    sections: `<p><a class="btn" href="mailto:iceworks@f1rst.co.uk?subject=XKey">Email iceworks@f1rst.co.uk</a></p><p>XKey is run by IceWork, Blackpool, Lancashire, UK.</p>
<h2>What should I include when reporting a problem?</h2><p>The web address you checked, what you expected and what the report said. A screenshot helps. If a check seems wrong for your site, tell us \u2013 it's the fastest way for us to improve the tool.</p>
<h2>Can you fix my website for me?</h2><p>XKey's tools are free for everyone. If you'd like the fixes done for you, <a href="https://icework.co.uk" rel="noopener">IceWork</a> builds and repairs websites for UK businesses \u2013 just mention XKey when you get in touch.</p>`
  },
  {
    path: "/privacy",
    crumb: "Privacy",
    title: "Privacy Policy | XKey Free SEO Checker",
    desc: "How XKey handles the web addresses you check, the short-lived report cache and monitoring dashboards. No accounts, no tracking cookies.",
    h1: "Privacy",
    lead: "Last reviewed 6 October 2026.",
    sections: `<h2>What we collect</h2><p>When you run a check we receive the web address you entered and your IP address. We use the IP address only for short-term rate limiting to stop abuse; it's held in a temporary cache for about an hour.</p>
<h2>Reports</h2><p>Finished reports are cached for up to an hour so repeat views are fast. We don't store the content of the pages we check.</p>
<h2>Monitoring</h2><p>If you start monitoring, we store the web address and a weekly summary of the check results so we can show your history. Anyone with the dashboard link can view it. To have a monitor deleted, email us with the link.</p>
<h2>Cookies and your browser</h2><p>XKey doesn't set advertising or tracking cookies. To show "Your recent checks", your browser keeps a short list of the addresses you checked and their scores \u2013 it stays on your device, is never sent to us, and you can clear it with one click.</p>
<h2>Your rights</h2><p>You can contact us about your data at <a href="mailto:iceworks@f1rst.co.uk">iceworks@f1rst.co.uk</a>, or complain to the Information Commissioner's Office at <a href="https://ico.org.uk/" rel="noopener">ico.org.uk</a>.</p>`
  }
];

// engine/checker.js
var MAX_BYTES = 1e6;
var TIMEOUT_MS = 1e4;
var LINK_SAMPLE = 12;
var FETCH_BUDGET = 40;
var SITEMAP_MAX = 5e3;
var SITEMAP_READ = 1e6;
var SITEMAP_READ_AUDIT = 15e5;
var UA = "IceWorkSEOChecker/2.0 (+https://icework.co.uk/seo-checker)";
var UA_TOKEN = "iceworkseochecker";
var AW = {};
"abdeghnopqu0123456789$\xA3?_#".split("").forEach((c) => AW[c] = 1139);
"ckszvxy".split("").forEach((c) => AW[c] = 1024);
Object.assign(AW, { f: 569, i: 455, j: 455, l: 455, m: 1706, r: 682, t: 569, w: 1479, " ": 569, ".": 569, ",": 569, ":": 569, ";": 569, "!": 569, "-": 682, "\u2013": 1139, "\u2014": 2048, "|": 532, "&": 1366, "'": 391, "\u2019": 391, '"': 727, "(": 682, ")": 682, "/": 569, "+": 1196, "%": 1821, "@": 2079, "*": 797 });
Object.assign(AW, { A: 1366, B: 1366, C: 1479, D: 1479, E: 1366, F: 1251, G: 1593, H: 1479, I: 569, J: 1024, K: 1366, L: 1139, M: 1706, N: 1479, O: 1593, P: 1366, Q: 1593, R: 1479, S: 1366, T: 1251, U: 1479, V: 1366, W: 1933, X: 1366, Y: 1366, Z: 1251 });
var pixelWidth = (s, px = 20) => Math.round([...s].reduce((t, c) => t + (AW[c] ?? 1139), 0) / 2048 * px);
var cp = (n) => {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
};
var decode = (s) => s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;|&#x0*27;/gi, "'").replace(/&#(\d+);/g, (_, n) => cp(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => cp(parseInt(n, 16)));
var text = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
var attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null;
};
var tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => m[0]);
var meta = (head, key, val) => {
  for (const t of tags(head, "meta")) if ((attr(t, key) || "").toLowerCase() === val) return attr(t, "content");
  return null;
};
var STOP = new Set("a an and are as at be by for from has have in is it its of on or that the this to was were will with you your we our i me my not but if so can do does how what when where which who why".split(" "));
var syllables = (w) => {
  w = w.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
};
var stem = (w) => w.length > 4 ? w.replace(/(?:ies|es|s|ing|ed)$/, "") : w;
var stripNoise = (html) => html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ").replace(/<template\b[\s\S]*?<\/template>/gi, " ");
var mainOf = (body) => (body.match(/<main\b[\s\S]*<\/main>/i) || [null])[0] || body.replace(/<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi, " ");
var sameSite = (a, b) => a.replace(/^www\./, "") === b.replace(/^www\./, "");
var noSlash = (u) => u.replace(/\/$/, "");
var SEARCH_BOTS = [["Googlebot", "Google Search & AI Overviews"], ["Bingbot", "Bing & Copilot"], ["OAI-SearchBot", "ChatGPT search"], ["ChatGPT-User", "ChatGPT browsing"], ["Claude-SearchBot", "Claude search"], ["Claude-User", "Claude browsing"], ["PerplexityBot", "Perplexity"], ["Applebot", "Siri & Spotlight"]];
var TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"];
var IMPACT = { critical: 5, high: 3, medium: 2, low: 1 };
var LB_RE = /LocalBusiness|Store|Restaurant|Hotel|ProfessionalService|Dentist|Plumber|Electrician|AutoRepair|HealthAndBeauty|LegalService|RealEstateAgent|HomeAndConstructionBusiness|FoodEstablishment|LodgingBusiness|MedicalBusiness|AutomotiveBusiness|FinancialService|SportsActivityLocation|EntertainmentBusiness/;
var PHONE_UK = /(?:(?:\+44|\b0044)\s?(?:\(0\)\s?)?|\b0)[1-35789](?:[\s-]?\d){8,9}(?!\d)/;
var POSTCODE_UK = /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[ABD-HJLNP-UW-Z]{2}\b/;
var robotsCache = /* @__PURE__ */ new Map();
function parseRobots(robots) {
  if (robotsCache.has(robots)) return robotsCache.get(robots);
  const groups = [];
  let cur = null, lastWasUA = false;
  for (const raw of robots.slice(0, 5e5).split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const k = line.slice(0, i).trim().toLowerCase(), v = line.slice(i + 1).trim();
    if (k === "user-agent") {
      if (!lastWasUA || !cur) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
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
    } else if (k !== "sitemap") lastWasUA = false;
  }
  if (robotsCache.size > 20) robotsCache.clear();
  robotsCache.set(robots, groups);
  return groups;
}
function robotsAllows(robots, agent, path) {
  if (!robots) return true;
  const groups = typeof robots === "string" ? parseRobots(robots) : robots;
  let rules = null;
  for (const t of [].concat(agent).map((a) => a.toLowerCase())) {
    const m = groups.filter((g) => g.agents.includes(t));
    if (m.length) {
      rules = m.flatMap((g) => g.rules);
      break;
    }
  }
  if (!rules) rules = groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules);
  if (path === "/robots.txt") return true;
  let best = null;
  for (const r of rules) if (r.re.test(path) && (!best || r.len > best.len || r.len === best.len && r.allow)) best = r;
  return !best || best.allow;
}
function analyse(f) {
  const H = (k) => f.headers && (f.headers.get ? f.headers.get(k) : f.headers[k.toLowerCase()]) || null;
  const raw = f.html || "";
  const clean = stripNoise(raw);
  const head = (raw.match(/<head\b[\s\S]*?<\/head>/i) || [raw.slice(0, 2e4)])[0];
  const body = (clean.match(/<body\b[\s\S]*<\/body>/i) || [clean])[0];
  const mainHtml = mainOf(body);
  const page = new URL(f.finalUrl || f.url);
  const cats = [];
  const cat = (name, blurb) => {
    const c = { name, blurb, checks: [] };
    cats.push(c);
    return (name2, impact, status, notes, fix) => c.checks.push({ name: name2, impact, status, notes: [].concat(notes).filter(Boolean), fix: status === "pass" || status === "info" ? null : fix || null });
  };
  const P = (ok, warn) => ok ? "pass" : warn ? "warn" : "fail";
  const robots = f.robots ? parseRobots(f.robots) : null;
  const robotsPath = page.pathname + page.search;
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
  const h1s = hs.filter((x) => x[0] === 1);
  const h1 = h1s[0] ? h1s[0][1] : "";
  const ldBlocks = [...raw.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const ld = [], ldErrors = [], top = /* @__PURE__ */ new Set();
  const walk = (o, isTop) => {
    if (Array.isArray(o)) return o.forEach((x) => walk(x, isTop));
    if (o && typeof o === "object") {
      if (o["@type"]) {
        ld.push(o);
        if (isTop) top.add(o);
      }
      if (o["@graph"]) walk(o["@graph"], true);
      for (const [k, v] of Object.entries(o)) if (k !== "@graph" && v && typeof v === "object") walk(v, false);
    }
  };
  ldBlocks.forEach((s, i) => {
    let j;
    try {
      j = JSON.parse(s.trim().replace(/^<!\[CDATA\[|\]\]>$/g, ""));
    } catch {
      ldErrors.push(`Block ${i + 1}: invalid JSON`);
      return;
    }
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
  const webLinks = links.filter((l) => l.href && !/^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(l.href)).map((l) => {
    try {
      return { ...l, u: new URL(l.href, page) };
    } catch {
      return null;
    }
  }).filter((l) => l && /^https?:$/.test(l.u.protocol));
  const internal = webLinks.filter((l) => sameSite(l.u.hostname, page.hostname));
  const external = webLinks.filter((l) => !sameSite(l.u.hostname, page.hostname));
  const imgs = tags(body, "img");
  const resources = [...raw.replace(/<!--[\s\S]*?-->/g, " ").matchAll(/<(script|link|img|iframe|source|video|audio|embed|track)\b[^>]*>/gi)].flatMap((m) => {
    const t = m[0], n = m[1].toLowerCase();
    if (n === "link") {
      const rel = (attr(t, "rel") || "").toLowerCase();
      return /stylesheet|icon|preload|modulepreload|manifest/.test(rel) ? [attr(t, "href")] : [];
    }
    return [attr(t, "src"), attr(t, "poster"), ...(attr(t, "srcset") || "").split(",").map((s) => s.trim().split(/\s+/)[0])];
  }).filter(Boolean);
  const I = cat("Indexing & crawling", "Can search engines reach, read and index this page?");
  const noindex = /\b(noindex|none)\b/.test(robotsMeta);
  I("Status code", "critical", P(f.status === 200), `The page returned HTTP ${f.status}.`, "Make sure the page returns 200 OK.");
  I("Indexable", "critical", P(!noindex), noindex ? "The page tells search engines not to index it (noindex)." : "No noindex instruction \u2013 the page can appear in search.", "Remove the noindex meta tag or X-Robots-Tag header if this page should be found.");
  const gAllowed = robotsAllows(robots, "googlebot", robotsPath);
  const rs = f.robotsStatus;
  const robotsDown = rs === 0 || rs === 429 || rs >= 500;
  I(
    "robots.txt",
    robotsDown ? "critical" : "high",
    robotsDown ? "fail" : P(f.robots != null && gAllowed, gAllowed),
    robotsDown ? `robots.txt ${rs ? `returned HTTP ${rs}` : "could not be reached"}. Google treats an unavailable robots.txt as "don't crawl" and pauses crawling the site until it loads.` : [f.robots == null ? `No robots.txt found${rs ? ` (HTTP ${rs})` : ""} \u2013 crawlers may read everything.` : "robots.txt found.", gAllowed ? "Googlebot is allowed to crawl this page." : "robots.txt BLOCKS Googlebot from this page."],
    robotsDown ? "Make /robots.txt return 200 (or 404 if you don't need one) \u2013 check your server, firewall or bot protection." : f.robots == null ? "Add a robots.txt that allows crawling and lists your sitemap." : "Remove or narrow the Disallow rule that blocks this page."
  );
  const sm = f.sitemap;
  I("XML sitemap", "high", P(sm && sm.urls > 0 && sm.inRobots, sm && sm.urls > 0), sm ? [sm.index ? `Sitemap index found at ${sm.url} listing ${sm.urls.toLocaleString("en-GB")} sitemap${sm.urls === 1 ? "" : "s"}.` : `Sitemap found at ${sm.url} with ${sm.more ? "over " : ""}${sm.urls.toLocaleString("en-GB")} URL${sm.urls === 1 ? "" : "s"}${sm.more ? " (we read the first 1 MB)" : ""}.`, sm.inRobots ? "Declared in robots.txt." : "Not declared in robots.txt.", sm.listsPage === true ? "This page is listed in it." : sm.listsPage === false ? "This page is NOT listed in it." : null, sm.lastmod ? `Most recent lastmod: ${sm.lastmod}.` : "No lastmod dates \u2013 add accurate ones so search engines know what changed."] : "No XML sitemap found at /sitemap.xml or in robots.txt.", sm ? "Add a 'Sitemap:' line to robots.txt, list every indexable page and include accurate lastmod dates." : "Create an XML sitemap listing every page and submit it in Google Search Console.");
  let canonU = null;
  try {
    canonU = canonical ? new URL(canonical, page) : null;
  } catch {
  }
  const canonAbs = canonical && /^https?:\/\//i.test(canonical);
  const canonSet = new Set(canonTags.map((t) => {
    try {
      return new URL(attr(t, "href") || "", page).href;
    } catch {
      return "?";
    }
  }));
  const canonConflict = canonSet.size > 1;
  const pageNoQuery = page.origin + page.pathname;
  const canonSelf = !!canonU && noSlash(canonU.href) === noSlash(page.href);
  const canonClean = !!canonU && !canonSelf && page.search && noSlash(canonU.href) === noSlash(pageNoQuery);
  I(
    "Canonical URL",
    "high",
    canonConflict ? "fail" : P(canonU && canonAbs && (canonSelf || canonClean), canonU),
    canonConflict ? `${canonSet.size} different canonical tags \u2013 Google ignores conflicting canonicals.` : canonU ? [
      `Canonical: ${canonical}${!canonTags.length ? " (from the HTTP Link header)" : ""}`,
      canonSelf ? "Points to this page (self-referencing)." : canonClean ? "Points to this address without its query string \u2013 correct for tracking or filter parameters." : "Points to a DIFFERENT address \u2013 Google will probably index that one instead of this page.",
      canonAbs ? null : "Google accepts relative canonicals but recommends a full absolute URL.",
      page.protocol === "https:" && canonU.protocol === "http:" ? "The canonical uses http:// although the page is on https://." : null,
      !sameSite(canonU.hostname, page.hostname) ? "The canonical points to a different website." : canonU.hostname !== page.hostname ? "The canonical uses the other www / non-www version of your domain." : null,
      noindex && !canonSelf ? "The page is also noindex \u2013 mixed signals." : null
    ] : "No canonical tag.",
    canonConflict ? "Keep exactly one canonical tag per page." : `Add <link rel="canonical" href="(this page's full URL)"> \u2013 only point it elsewhere for true duplicates.`
  );
  const chain = f.chain || [];
  const sameHop = chain.length <= 1 || chain.every((h) => {
    try {
      return sameSite(new URL(h).hostname, page.hostname);
    } catch {
      return false;
    }
  });
  I(
    "Redirects",
    "high",
    P(f.redirects === 0 || f.redirects === 1 && sameHop, f.redirects <= 2 && sameHop),
    f.redirects ? [`${f.redirects} redirect${f.redirects > 1 ? "s" : ""} before the page loaded${f.redirects > 1 ? " \u2013 a chain slows visitors and wastes crawl budget" : ""}.`, chain.length ? `${chain.concat(page.href).join(" \u2192 ")}` : null, f.redirects === 1 && sameHop ? "A single redirect to your preferred address is normal; just make sure your own links use the final address." : null] : "Loads directly with no redirects.",
    "Link straight to the final address and make each redirect go to its destination in one hop."
  );
  I("www / non-www", "medium", P(f.wwwOk !== false), f.wwwNote || "Not tested.", "Pick one version (with or without www) and 301-redirect the other to it.");
  const hreflang = tags(head, "link").filter((t) => /hreflang\s*=/i.test(t) && /rel\s*=\s*["']?alternate/i.test(t));
  if (hreflang.length) {
    const entries = hreflang.map((t) => [(attr(t, "hreflang") || "").trim(), attr(t, "href") || ""]);
    const badCode = entries.filter(([c]) => !/^(x-default|[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?)$/i.test(c) || /^(gb|jp|cn|dk)(-|$)/i.test(c) || /-(uk|eu)$/i.test(c)).map(([c]) => c || "(empty)");
    const rel = entries.filter(([, h]) => !/^https?:\/\//i.test(h)).length;
    const self = entries.some(([, h]) => {
      try {
        return noSlash(new URL(h, page).href) === noSlash(page.href);
      } catch {
        return false;
      }
    });
    const xdef = entries.some(([c]) => /^x-default$/i.test(c));
    I("hreflang", "medium", P(!badCode.length && self && !rel, !badCode.length), [`${entries.length} hreflang link(s).`, badCode.length ? `Invalid codes: ${[...new Set(badCode)].slice(0, 5).join(", ")} (use ISO codes such as en-gb \u2013 "uk" is not a valid region, use "gb").` : "All language codes are valid.", self ? null : "The list doesn't include this page itself \u2013 Google requires each page to list itself.", rel ? `${rel} use relative URLs \u2013 Google requires fully qualified URLs.` : null, xdef ? null : "No x-default (recommended for a language picker or fallback page)."], "Use valid ISO language(-region) codes, absolute URLs, include this page itself, and make sure every alternate links back.");
  }
  const M = cat("Search snippet & sharing", "How the page looks in Google results and when shared.");
  const tpx = pixelWidth(title, 20);
  const dupTitle = [...new Set(titleWordsAll.filter((w, i) => titleWordsAll.indexOf(w) !== i))];
  M("Title tag", "critical", P(title && tpx >= 250 && tpx <= 580 && !dupTitle.length, title && tpx <= 620), title ? [`\u201C${title}\u201D`, `About ${tpx}px of Google's ~580px desktop width${tpx > 580 ? " \u2013 it will probably be cut off" : tpx < 250 ? " \u2013 short; use the space" : ""}.`, dupTitle.length ? `Repeated words: ${dupTitle.join(", ")}.` : null] : "No <title> found.", "Write a unique title of roughly 50\u201360 characters with the main search phrase first.");
  const dpx = pixelWidth(desc, 14);
  M("Meta description", "high", P(desc && dpx >= 500 && dpx <= 990, !!desc), desc ? [`${desc.length} characters, ~${dpx}px of ~990px.`, dpx > 990 ? "Long \u2013 Google will probably truncate it." : dpx < 500 ? "Short \u2013 sell the click with a benefit and a call to action." : "Good length.", "Google sometimes rewrites descriptions to match the search; a good one is still used most often."] : "No meta description \u2013 Google will pick text from the page.", "Write a 140\u2013155 character description that answers the searcher's question and invites the click.");
  const og = { t: meta(head, "property", "og:title"), d: meta(head, "property", "og:description"), i: meta(head, "property", "og:image"), u: meta(head, "property", "og:url") };
  const tw = meta(head, "name", "twitter:card");
  M("Open Graph & social cards", "medium", P(og.t && og.i && og.d && !/\.svg(\?|$)/i.test(og.i || ""), og.t || og.i), [og.t && og.i ? "Open Graph title and image set." : "Open Graph title or image missing.", og.t && og.i && !og.d ? "No og:description." : null, og.i && /\.svg(\?|$)/i.test(og.i) ? "og:image is an SVG \u2013 Facebook, LinkedIn and WhatsApp won't show it. Use PNG or JPG (1200\xD7630)." : null, og.i && !/^https?:\/\//i.test(og.i) ? "og:image should be a full absolute URL." : null, tw ? `Twitter/X card: ${tw}.` : "No twitter:card tag."], "Add og:title, og:description, og:image (1200\xD7630 PNG/JPG, absolute URL) and twitter:card=summary_large_image.");
  const favicon = tags(head, "link").some((t) => /rel\s*=\s*["']?[^"'>]*icon/i.test(t));
  M("Favicon", "low", P(favicon), favicon ? "Favicon linked (Google shows it next to results)." : "No favicon linked.", "Add a square favicon at least 48\xD748px.");
  const lang = attr((raw.match(/<html\b[^>]*>/i) || [""])[0], "lang");
  M("Language", "low", P(!!lang), lang ? `lang="${lang}"` : "No lang attribute on <html>.", 'Add lang="en-GB" (or your language) to the <html> tag.');
  const C = cat("Content quality", "Is there enough clear, useful text that matches what the page targets?");
  C("Word count", "medium", P(wc >= 400, wc >= 200), [`${wc.toLocaleString("en-GB")} words of main content${/<main\b/i.test(body) ? " (inside <main>)" : " (menus and footer excluded)"}.`, "Google has no minimum word count \u2013 this is a rough guide to whether the page answers the question in full."], "Add genuinely useful content: key service pages usually need 400+ words to answer what customers ask.");
  const prose = [...mainHtml.matchAll(/<(p|li|blockquote|dd|td|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => text(m[2])).filter((s) => s.split(" ").length >= 4);
  const proseText = prose.map((s) => /[.!?]["')\]]?$/.test(s) ? s : s + ".").join(" ");
  const pWords = proseText ? proseText.split(" ").filter((w) => /[a-z]/i.test(w)).slice(0, 3e3) : [];
  const pSentences = proseText ? proseText.split(/[.!?]+["')\]]?(?:\s|$)/).filter((s) => s.trim().split(/\s+/).length >= 2).length : 0;
  const english = !lang || /^en\b/i.test(lang);
  if (!english) C("Readability", "medium", "info", `Reading-ease scores only work for English; this page is lang="${lang}".`);
  else if (pWords.length < 100 || !pSentences) C("Readability", "medium", "info", "Not enough paragraph text to score readability.");
  else {
    const sylls = pWords.reduce((t, w) => t + syllables(w), 0);
    const flesch = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (pWords.length / pSentences) - 84.6 * (sylls / pWords.length))));
    C("Readability", "medium", P(flesch >= 50, flesch >= 30), `Flesch reading ease ${flesch} (${flesch >= 60 ? "plain English" : flesch >= 50 ? "fairly easy" : flesch >= 30 ? "fairly difficult" : "difficult"}), about ${Math.round(pWords.length / pSentences)} words per sentence.`, "Use shorter sentences and everyday words \u2013 aim for a score of 50+ for customer-facing pages.");
  }
  const lowerMain = (mainText + " " + hs.map((x) => x[1]).join(" ")).toLowerCase();
  const covered = titleWords.filter((w) => lowerMain.includes(stem(w)));
  C("Topic focus", "high", titleWords.length ? P(covered.length / titleWords.length >= 0.75, covered.length / titleWords.length >= 0.5) : "info", titleWords.length ? `${covered.length} of ${titleWords.length} title keywords appear in the main content${covered.length < titleWords.length ? ` (missing: ${titleWords.filter((w) => !covered.includes(w)).join(", ")})` : ""}.` : "No title keywords to compare.", "Use your main title phrases naturally in the opening paragraph and headings.");
  const h1Lower = h1.toLowerCase();
  const h1Overlap = titleWords.filter((w) => h1Lower.includes(stem(w))).length;
  C("H1 heading", "critical", P(h1s.length === 1 && h1 && (h1Overlap > 0 || !titleWords.length), h1s.length === 1 || h1s.length > 1 && h1), h1s.length ? [h1s.length > 1 ? `${h1s.length} H1 headings \u2013 one clear H1 is best practice.` : `\u201C${h1}\u201D`, h1 && !h1Overlap && titleWords.length ? "The H1 shares no keywords with the title." : null, !h1 ? "The H1 is empty." : null] : "No H1 heading.", "Use one H1 that states the page topic with its main keyword.");
  let skipped = 0;
  for (let i = 1; i < hs.length; i++) if (hs[i][0] > hs[i - 1][0] + 1) skipped++;
  const emptyH = hs.filter((x) => !x[1]).length;
  const faqH = (body.match(/<summary\b[^>]*>\s*<h[2-6]\b/gi) || []).length;
  const tooMany = hs.length - faqH > Math.max(12, wc / 40);
  C("Heading structure", "medium", P(!skipped && !tooMany && !emptyH && hs.length >= 2, skipped <= 2 && hs.length - faqH <= Math.max(20, wc / 15)), [`${hs.length} headings for ${wc} words${tooMany ? " \u2013 a lot for the amount of text" : ""}.`, skipped ? `${skipped} skipped level(s), e.g. H2 \u2192 H4.` : "Levels are in order.", emptyH ? `${emptyH} empty heading(s).` : null], "Use H2s for main sections and H3s inside them, without skipping levels.");
  const codeRatio = raw.length ? Math.round(bodyText.length / raw.length * 100) : 0;
  C("Text-to-code ratio", "low", P(codeRatio >= 10, codeRatio >= 5), `${codeRatio}% of the HTML is visible text.`, "Trim unused markup, inline scripts and builder bloat.");
  const A = cat("AI search readiness", "Can ChatGPT, Claude, Perplexity and Google AI Overviews read, understand and cite this site?");
  const blockedSearch = SEARCH_BOTS.filter(([b2]) => !robotsAllows(robots, b2.toLowerCase(), robotsPath));
  const blockedTrain = TRAINING_BOTS.filter((b2) => !robotsAllows(robots, b2.toLowerCase(), robotsPath));
  const coreBlocked = blockedSearch.filter(([b2]) => b2 === "Googlebot" || b2 === "Bingbot");
  A("AI crawler access", "high", P(!blockedSearch.length, !coreBlocked.length), [blockedSearch.length ? `robots.txt blocks search crawlers: ${blockedSearch.map(([b2, d]) => `${b2} (${d})`).join(", ")}.` : "Search and AI-search crawlers (Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot\u2026) can read this page.", blockedTrain.length ? `Training-only crawlers blocked: ${blockedTrain.join(", ")}. That's a licensing choice \u2013 these companies document them as separate from their search crawlers.` : null], "Allow Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot and PerplexityBot so search and AI tools can cite you (you can still block training-only bots such as GPTBot or Google-Extended).");
  const snipMax = (robotsMeta.match(/max-snippet\s*:\s*(-?\d+)/) || [])[1];
  const nosnippet = /\bnosnippet\b/.test(robotsMeta) || snipMax === "0";
  A("Snippet controls", "high", P(!nosnippet && !(snipMax && +snipMax > 0 && +snipMax < 50), !nosnippet), nosnippet ? "nosnippet / max-snippet:0 is set \u2013 Google won't show text from this page in results or use it in AI Overviews." : snipMax && +snipMax > 0 && +snipMax < 50 ? `max-snippet:${snipMax} limits how much text Google can quote.` : "No snippet restrictions \u2013 search and AI answers can quote this page.", "Remove nosnippet / max-snippet limits unless you deliberately want to stop quotes (use data-nosnippet on specific sections instead).");
  A("llms.txt", "low", P(f.llms === true), f.llms ? "/llms.txt found." : "No /llms.txt file. It's an optional, emerging convention \u2013 few AI tools are confirmed to read it yet, so this is low priority.", "Optionally add /llms.txt: a short Markdown summary of who you are with links to your key pages.");
  const qHeads = hs.filter(([n, t]) => n >= 2 && (/\?\s*$/.test(t) || /^(how|why|can|could|do|does|did|is|are|was|should|will|would)\s+\S+\s+\S+/i.test(t) && !/^how (it|we) work/i.test(t) || /^(what|which|who|when|where)('s|\s+(is|are|was|were|does|do|did|can|should|will|would|happens|makes|counts))\b/i.test(t)));
  A("Question-led content", "medium", P(qHeads.length >= 3, qHeads.length >= 1), qHeads.length ? `${qHeads.length} heading(s) phrased as questions, e.g. \u201C${qHeads[0][1].slice(0, 70)}\u201D.` : "No headings phrased as questions.", 'Add headings that match real questions ("How much does\u2026?") followed by a direct one- or two-sentence answer \u2013 an easy format for search and AI answers to quote.');
  const org = hasType(/Organization|LocalBusiness|Corporation|Person|ProfessionalService/).concat(hasType(LB_RE)).filter((o, i, a) => a.indexOf(o) === i);
  const sameAs = org.flatMap((o) => [].concat(o.sameAs || []));
  A("Entity clarity", "high", P(org.length && sameAs.length >= 2, org.length), org.length ? [`Identified as: ${[...new Set(org.flatMap(types))].join(", ")}.`, sameAs.length ? `${sameAs.length} official profile link(s) (sameAs).` : "No sameAs links to official profiles (Google Business Profile, LinkedIn, Facebook, Companies House\u2026)."] : "No Organization / LocalBusiness structured data \u2013 search engines and AI have to guess who runs this site.", "Add Organization or LocalBusiness JSON-LD with name, url, logo, contact details and sameAs links to your official profiles.");
  const dated = /dateModified|datePublished/.test(ldBlocks.join(" ")) || /<time\b/i.test(body) || !!meta(head, "property", "article:modified_time") || !!meta(head, "property", "article:published_time") || /(last (updated|reviewed)|updated on|published on?)\s*:?\s*(\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(bodyText);
  A("Freshness signals", "medium", P(dated), dated ? "The page shows when it was published or last updated." : "No published/updated date found.", "Show a 'last updated' date and add dateModified to your structured data.");
  const trust = ["about", "contact", "privacy"].filter((k) => internal.some((l) => new RegExp(k, "i").test(l.u.pathname + " " + l.text)));
  A("Trust pages (E-E-A-T)", "medium", P(trust.length === 3, trust.length >= 2), `Links found to: ${trust.length ? trust.join(", ") : "none"} of about / contact / privacy.`, "Link to About, Contact and Privacy pages from every page \u2013 they help visitors, Google and AI tools see who stands behind the content.");
  const D = cat("Structured data", "Machine-readable facts for rich results and AI.");
  D("JSON-LD present & valid", "high", P(ldBlocks.length && !ldErrors.length, ldBlocks.length), ldBlocks.length ? [`${ldBlocks.length} JSON-LD block(s): ${[...new Set(ld.flatMap(types))].slice(0, 12).join(", ") || "no @type"}.`, ldErrors.length ? ldErrors.join("; ") : "All blocks parse correctly."] : "No JSON-LD structured data.", "Add JSON-LD describing the business and the page (Organization/LocalBusiness, WebSite, WebPage or Article, BreadcrumbList).");
  const has = (o, k) => o[k] != null && o[k] !== "";
  const reqMiss = [], recMiss = [], sdNotes = [];
  for (const o of ld) {
    const ts = types(o), t = ts[0], isTop = top.has(o);
    const need = (k, ok = has(o, k)) => {
      if (!ok) reqMiss.push(`${t}.${k}`);
    };
    const want = (k, ok = has(o, k)) => {
      if (!ok) recMiss.push(`${t}.${k}`);
    };
    if (ts.some((x) => LB_RE.test(x)) && isTop) {
      need("name");
      need("address");
      want("telephone");
      want("url");
    } else if (ts.includes("Organization") && isTop) {
      want("name");
      want("url");
      want("logo");
    }
    if (ts.includes("Product")) {
      need("name");
      need("offers|review|aggregateRating", has(o, "offers") || has(o, "review") || has(o, "aggregateRating"));
    }
    if (ts.some((x) => /^(Article|NewsArticle|BlogPosting)$/.test(x)) && isTop) {
      want("headline");
      want("image");
      want("datePublished");
      want("author");
    }
    if (ts.includes("BreadcrumbList")) {
      const items = [].concat(o.itemListElement || []);
      need("itemListElement", items.length > 0);
      items.forEach((li, i) => {
        if (!li || li.position == null || !(li.name || li.item && li.item.name)) reqMiss.push("ListItem.position/name");
        else if (i < items.length - 1 && !li.item) reqMiss.push("ListItem.item");
      });
    }
    if (ts.includes("Event")) {
      need("name");
      need("startDate");
      need("location");
    }
    if (ts.includes("FAQPage")) {
      const q = [].concat(o.mainEntity || []);
      need("mainEntity", q.length > 0);
      if (q.some((x) => !x || !x.name || !(x.acceptedAnswer && x.acceptedAnswer.text))) reqMiss.push("Question.name/acceptedAnswer.text");
      sdNotes.push("Google now shows FAQ rich results only for well-known government and health sites, but the markup still helps machines read your Q&As.");
    }
    if (ts.includes("Recipe")) {
      need("name");
      need("image");
    }
    if (ts.includes("JobPosting")) {
      ["title", "description", "datePosted", "hiringOrganization"].forEach((k) => need(k));
      need("jobLocation", has(o, "jobLocation") || has(o, "applicantLocationRequirements"));
    }
    if (ts.includes("VideoObject")) {
      need("name");
      need("thumbnailUrl");
      need("uploadDate");
    }
    if (ts.includes("AggregateRating")) {
      need("ratingValue");
      need("ratingCount|reviewCount", has(o, "ratingCount") || has(o, "reviewCount"));
    }
    if (isTop && (o.aggregateRating || o.review) && ts.some((x) => x === "Organization" || LB_RE.test(x))) sdNotes.push("Review stars aren't shown for reviews a business publishes about itself (Google's self-serving review rule).");
  }
  if (ld.length) D("Required properties", "medium", P(!reqMiss.length, !reqMiss.length), [reqMiss.length ? `Missing required: ${[...new Set(reqMiss)].slice(0, 8).join(", ")}.` : "Key types include Google's required properties.", recMiss.length ? `Recommended but missing: ${[...new Set(recMiss)].slice(0, 8).join(", ")}.` : null, ...new Set(sdNotes)], "Fill in the missing properties so the markup qualifies for rich results \u2013 test with Google's Rich Results Test.");
  const bc = hasType(/BreadcrumbList/).length > 0;
  D("Breadcrumbs", "low", page.pathname === "/" ? "info" : P(bc), page.pathname === "/" ? "Home page \u2013 breadcrumbs not needed." : bc ? "BreadcrumbList markup present." : "No BreadcrumbList markup.", "Add BreadcrumbList JSON-LD so Google shows the page's place in your site.");
  const L = cat("Links", "Internal linking, anchor text and broken links.");
  const byText = /* @__PURE__ */ new Map();
  internal.forEach((l) => {
    const k = l.text.toLowerCase();
    if (!k || k.startsWith("[")) return;
    byText.set(k, (byText.get(k) || /* @__PURE__ */ new Set()).add(noSlash(l.u.pathname) + l.u.search));
  });
  const dupAnchors = [...byText].filter(([, s]) => s.size > 1).map(([t]) => t);
  const vague = internal.filter((l) => /^(click here|here|read more|more|learn more|this page|link|find out more)$/i.test(l.text)).length;
  const emptyA = webLinks.filter((l) => !l.text).length;
  L("Internal linking", "high", P(internal.length >= 5 && internal.length <= 250, internal.length >= 2), `${internal.length} internal and ${external.length} external links.`, "Link to your most important pages from this page with descriptive text.");
  L("Anchor text quality", "medium", P(!dupAnchors.length && !vague && !emptyA, !emptyA), [dupAnchors.length ? `Same text used for different pages: ${dupAnchors.slice(0, 4).map((t) => `\u201C${t}\u201D`).join(", ")}.` : "No link text points to two different pages.", vague ? `${vague} vague link(s) like \u201Cclick here\u201D or \u201Cread more\u201D.` : null, emptyA ? `${emptyA} link(s) with no text at all.` : null], "Make every link text describe its destination, e.g. \u201Clogo design prices\u201D instead of \u201Cclick here\u201D.");
  const b = f.broken;
  if (b) L("Broken links (sample)", "high", P(!b.broken.length, b.broken.length <= 1), b.checked ? [`Checked ${b.checked} internal link(s)${b.skipped ? ` (${b.skipped} more not checked)` : ""}.`, b.broken.length ? `Broken: ${b.broken.slice(0, 5).map((x) => `${x.path} (${x.status || "no response"})`).join(", ")}.` : "No broken links found.", b.redirected ? `${b.redirected} link(s) point to a redirect \u2013 link to the final address instead.` : null] : "No internal links to test.", "Fix or remove links that return errors, and update links that redirect.");
  const nofollowInt = internal.filter((l) => /rel\s*=\s*["'][^"']*nofollow/i.test(l.tag)).length;
  if (nofollowInt) L("Internal nofollow", "low", "warn", `${nofollowInt} internal link(s) are nofollow, so search engines may not follow them.`, 'Remove rel="nofollow" from links to your own pages.');
  const httpInternal = page.protocol === "https:" ? internal.filter((l) => l.u.protocol === "http:").length : 0;
  if (httpInternal) L("Internal links to http://", "medium", "warn", `${httpInternal} internal link(s) use http:// \u2013 each one goes through a redirect.`, "Update internal links to use https:// (or relative links).");
  const R = cat("Performance", "Speed signals from the HTML and server. Real-user Core Web Vitals load below.");
  const inProc = H("x-checker-internal") === "1";
  const edgeNote = "Not measurable here: this site is served by the same server as the checker, so the check ran in-process and skipped the Cloudflare edge that real visitors go through.";
  if (inProc) R("Server response (TTFB)", "high", "info", edgeNote);
  else R("Server response (TTFB)", "high", P(f.ms <= 800, f.ms <= 1800), `${f.ms} ms until the first response from our checker, including connection setup (Google rates TTFB good under 0.8 s, poor over 1.8 s).`, "Use page caching or a CDN (e.g. Cloudflare) so HTML is served from the edge.");
  R("HTML size", "medium", P(f.bytes <= 15e4, f.bytes <= 4e5), `${Math.round(f.bytes / 1024)} kB of HTML${f.bytes > 4e5 ? " \u2013 heavy for phones" : ""}${f.bytes > MAX_BYTES ? " (we only analysed the first 1 MB)" : ""}.`, "Remove inline bloat, base64 images and unused markup.");
  const enc = H("content-encoding");
  if (enc) R("Compression", "medium", "pass", `Compressed with ${enc}.`);
  else R("Compression", "medium", "info", inProc ? edgeNote : "Couldn't be measured from our server (our fetch decodes compressed pages before we see them). Check in your browser's developer tools that HTML is sent with br or gzip.");
  const headScripts = tags(head, "script").filter((t) => attr(t, "src") && !/\s(async|defer)\b/i.test(t) && !/type\s*=\s*["']?module/i.test(t));
  const headCss = tags(head, "link").filter((t) => /rel\s*=\s*["']?stylesheet/i.test(t) && !/media\s*=\s*["']?print/i.test(t));
  R("Render-blocking resources", "high", P(!headScripts.length && headCss.length <= 2, headScripts.length <= 1 && headCss.length <= 4), `${headScripts.length} blocking script(s) and ${headCss.length} stylesheet(s) in <head>.`, "Add defer to scripts, inline critical CSS and load the rest asynchronously.");
  const allScripts = (raw.match(/<script\b(?![^>]*application\/ld\+json)/gi) || []).length;
  const thirdParty = [...new Set(resources.map((s) => {
    try {
      return new URL(s, page);
    } catch {
      return null;
    }
  }).filter((u) => u && /^https?:$/.test(u.protocol)).map((u) => u.hostname.replace(/^www\./, "")).filter((h) => h !== site && !h.endsWith("." + site)))];
  R("Scripts & third parties", "medium", P(allScripts <= 10 && thirdParty.length <= 5, allScripts <= 25 && thirdParty.length <= 12), [`${allScripts} script tag(s); files loaded from ${thirdParty.length} other domain(s)${thirdParty.length ? `: ${thirdParty.slice(0, 6).join(", ")}${thirdParty.length > 6 ? "\u2026" : ""}` : ""}.`], "Remove unused tracking and widget scripts; every third party adds connection time.");
  const noDims = imgs.filter((t) => !(attr(t, "width") && attr(t, "height")) && !/aspect-ratio/i.test(attr(t, "style") || "")).length;
  const lazyCandidates = imgs.slice(3);
  const notLazy = lazyCandidates.filter((t) => !/loading\s*=\s*["']?lazy/i.test(t)).length;
  const firstLazy = imgs.length && /loading\s*=\s*["']?lazy/i.test(imgs[0]);
  const modern = imgs.filter((t) => /\.(webp|avif)(\?|$)/i.test(attr(t, "src") || "") || /srcset/i.test(t)).length;
  R("Images", "medium", P(!noDims && !notLazy && !firstLazy, noDims <= 2), imgs.length ? [`${imgs.length} image(s).`, noDims ? `${noDims} without width/height \u2013 can cause layout shift (CLS).` : "All images reserve their space.", notLazy ? `${notLazy} image(s) after the first three aren't lazy-loaded.` : null, firstLazy ? "The first image is lazy-loaded \u2013 if it's the main (LCP) image, that delays it. Don't lazy-load images visible on arrival." : null, `${modern} use WebP/AVIF or responsive srcset.`] : "No <img> tags.", "Give every image width and height, lazy-load images below the fold (but not the main image) and serve WebP/AVIF.");
  const cc = H("cache-control") || "";
  R("Caching", "low", P(/max-age=[1-9]\d|s-maxage=[1-9]/i.test(cc) && !/no-store/i.test(cc), !!cc), cc ? `Cache-Control: ${cc}` : "No Cache-Control header.", "Set Cache-Control so browsers and CDNs can reuse the page.");
  const h3 = /h3=/i.test(H("alt-svc") || "");
  if (h3) R("HTTP/3", "low", "pass", "Server advertises HTTP/3 (faster on mobile networks).");
  else R("HTTP/3", "low", "info", inProc ? edgeNote : `Couldn't be confirmed from our server \u2013 the alt-svc header that advertises HTTP/3 isn't always visible to it.${/cloudflare/i.test(H("server") || "") ? " Your site is on Cloudflare, which offers HTTP/3 under Network settings." : ""}`);
  const S = cat("Security", "Visitor safety signals that browsers and Google check.");
  const mixedN = page.protocol === "https:" ? resources.filter((s) => /^http:\/\//i.test(s)).length : 0;
  S("HTTPS", "critical", P(page.protocol === "https:" && !mixedN, page.protocol === "https:"), page.protocol !== "https:" ? "The page is not served over HTTPS." : mixedN ? `${mixedN} file(s) load over insecure http:// (mixed content) \u2013 browsers may block them.` : "Secure HTTPS with no mixed content.", "Serve everything over HTTPS and update http:// file links.");
  if (f.httpRedirects !== void 0) S("HTTP \u2192 HTTPS redirect", "high", P(f.httpRedirects), f.httpRedirects ? `http:// redirects to https://${f.httpHops > 1 ? ` (via ${f.httpHops} hops)` : ""}.` : "http:// does not redirect to https://.", "301-redirect all http:// requests to https://.");
  const hsts = H("strict-transport-security");
  const hstsAge = +((hsts || "").match(/max-age\s*=\s*"?(\d+)/i) || [, 0])[1];
  S("HSTS", "medium", P(hsts && hstsAge >= 15552e3, hsts && hstsAge > 0), hsts ? [`HSTS: ${hsts}`, hstsAge < 15552e3 ? "max-age is under 6 months \u2013 browsers will forget it quickly." : null] : "No Strict-Transport-Security header.", "Add Strict-Transport-Security: max-age=63072000; includeSubDomains.");
  const secHeaders = { "content-security-policy": "CSP", "x-content-type-options": "nosniff", "referrer-policy": "Referrer-Policy", "permissions-policy": "Permissions-Policy" };
  const present = Object.entries(secHeaders).filter(([k]) => H(k)).map(([, v]) => v);
  const xfo = H("x-frame-options") || /frame-ancestors/i.test(H("content-security-policy") || "");
  S("Security headers", "low", P(present.length >= 3 && xfo, present.length >= 2), `Present: ${present.concat(xfo ? ["clickjacking protection"] : []).join(", ") || "none"}.`, "Add X-Content-Type-Options, Referrer-Policy, Permissions-Policy and X-Frame-Options (or a CSP).");
  const xp = H("x-powered-by") || H("server");
  S("Server fingerprint", "low", P(!H("x-powered-by")), H("x-powered-by") ? `X-Powered-By reveals \u201C${H("x-powered-by")}\u201D.` : `No X-Powered-By header${xp ? ` (server: ${xp})` : ""}.`, "Remove X-Powered-By so attackers can't see your software versions.");
  const Y = cat("Mobile & accessibility", "Usable on phones and by everyone \u2013 Google indexes the mobile version.");
  const vp = meta(head, "name", "viewport") || "";
  const noZoom = /user-scalable\s*=\s*["']?(no|0)\b|maximum-scale\s*=\s*1(\.0+)?(?![\d.])/i.test(vp);
  Y("Mobile viewport", "critical", P(/width\s*=\s*device-width/i.test(vp) && !noZoom, /width\s*=\s*device-width/i.test(vp)), vp ? `viewport: ${vp}${noZoom ? " \u2013 blocks pinch-zoom" : ""}` : "No viewport meta tag \u2013 the page won't fit phones.", 'Use <meta name="viewport" content="width=device-width, initial-scale=1"> and allow zoom.');
  const noAlt = imgs.filter((t) => attr(t, "alt") === null).length;
  Y("Image alt text", "medium", P(!noAlt, noAlt <= 2), imgs.length ? noAlt ? `${noAlt} of ${imgs.length} images have no alt attribute.` : `All ${imgs.length} images have alt text.` : "No images.", 'Describe each meaningful image in its alt attribute (use alt="" for decorative ones).');
  const fields = [...body.matchAll(/<(input|select|textarea)\b[^>]*>/gi)].map((m) => m[0]).filter((t) => !/type\s*=\s*["']?(hidden|submit|button|image|reset)\b/i.test(t));
  const forIds = new Set([...body.matchAll(/<label\b[^>]*\sfor\s*=\s*["']?([^"'\s>]+)/gi)].map((m) => decode(m[1])));
  const wrapped = /* @__PURE__ */ new Set();
  for (const m of body.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/gi)) for (const t of m[1].match(/<(input|select|textarea)\b[^>]*>/gi) || []) wrapped.add(t);
  const unlabelled = fields.filter((t) => !wrapped.has(t) && !attr(t, "aria-label") && !attr(t, "aria-labelledby") && !attr(t, "title") && !(attr(t, "id") && forIds.has(attr(t, "id")))).length;
  if (fields.length) Y("Form labels", "medium", P(!unlabelled), unlabelled ? `${unlabelled} of ${fields.length} form field(s) have no label.` : `All ${fields.length} form fields are labelled.`, "Give every form field a <label> or aria-label (a placeholder isn't a label).");
  Y("Link names", "low", P(!emptyA), emptyA ? `${emptyA} link(s) have no readable name for screen readers.` : "Every link has a readable name.", "Add text or aria-label to icon-only links.");
  const tel = links.some((l) => /^tel:/i.test(l.href || ""));
  const mail = links.some((l) => /^mailto:/i.test(l.href || ""));
  Y("Tap-to-contact", "medium", P(tel || mail), tel || mail ? `One-tap contact: ${[tel && "phone", mail && "email"].filter(Boolean).join(" and ")}.` : "No tel: or mailto: links.", "Add a tap-to-call or tap-to-email button so phone visitors can contact you instantly.");
  const lb = hasType(LB_RE);
  const phoneUK = tel || PHONE_UK.test(bodyText);
  const postcode = POSTCODE_UK.test(bodyText);
  const mapLink = webLinks.some((l) => /google\.[a-z.]+\/maps|maps\.google\.|goo\.gl\/maps|maps\.apple\.com|waze\.com|maps\.app\.goo\.gl|g\.page\//i.test(l.u.href));
  const mapEmbed = /<iframe\b[^>]*(google\.[a-z.]+\/maps|maps\.google\.)/i.test(raw);
  const lbFields = lb.length ? ["address", "telephone", "geo", "openingHoursSpecification", "areaServed", "url"].filter((k) => lb.some((o) => o[k] != null || k === "telephone" && o.contactPoint && [].concat(o.contactPoint).some((c) => c && c.telephone) || k === "openingHoursSpecification" && o.openingHours)) : [];
  const isLocal = lb.length > 0 || phoneUK || postcode || mapLink || mapEmbed;
  const N = cat("Local SEO", isLocal ? "Signals that help you appear in Google Maps and 'near me' searches." : "This site doesn't look like a local business, so these checks are shown for information and not scored.");
  if (!isLocal) cats[cats.length - 1].info = true;
  N("LocalBusiness markup", "high", P(lb.length && lbFields.length >= 4, lb.length), lb.length ? `LocalBusiness markup includes: ${lbFields.join(", ") || "only a name"}.` : "No LocalBusiness structured data.", "Add LocalBusiness JSON-LD with address or areaServed, telephone, geo, opening hours and url.");
  N("Contact details on page", "medium", P(phoneUK || postcode || mail, false), [phoneUK ? "A UK phone number is shown." : "No phone number found.", postcode ? "A UK postcode is shown." : "No postcode found (fine for service-area businesses).", mail ? "An email link is shown." : null], "Show the same business name, area and phone/email as your Google Business Profile.");
  N("Map & directions", "low", P(mapLink || mapEmbed), mapLink || mapEmbed ? "Links to or embeds a map." : "No map or directions link.", "Add a Google Maps directions link so customers can find you.");
  for (const c of cats) if (c.info) c.checks.forEach((k) => {
    if (k.status !== "pass") {
      k.status = "info";
      k.fix = null;
    }
  });
  const tally = (list) => {
    let got = 0, tot = 0;
    for (const k of list) {
      if (k.status === "info") continue;
      const w = IMPACT[k.impact];
      tot += w;
      got += k.status === "pass" ? w : k.status === "warn" ? w * 0.5 : 0;
    }
    return tot ? Math.round(got / tot * 100) : 100;
  };
  for (const c of cats) c.score = tally(c.checks);
  const all = cats.flatMap((c) => c.checks.map((k) => ({ ...k, category: c.name }))).filter((k) => k.status !== "info");
  const fixes = all.filter((k) => k.status !== "pass").sort((a, b2) => IMPACT[b2.impact] * (b2.status === "fail" ? 2 : 1) - IMPACT[a.impact] * (a.status === "fail" ? 2 : 1));
  const counts = { pass: all.filter((k) => k.status === "pass").length, warn: all.filter((k) => k.status === "warn").length, fail: all.filter((k) => k.status === "fail").length };
  const aiScore = cats.find((c) => c.name === "AI search readiness").score;
  return {
    url: page.href,
    score: tally(all),
    aiScore,
    counts,
    categories: cats,
    fixes,
    facts: { title, desc, h1, status: f.status, ms: f.ms, bytes: f.bytes, words: wc, ogImage: og.i, redirects: f.redirects, internal: inProc }
  };
}
var PRIVATE = /(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain|test|example|invalid|onion|arpa|nip\.io|sslip\.io|xip\.io|localtest\.me|lvh\.me|vcap\.me|lacolhost\.com|localhost\.run|traefik\.me)$/i;
function normaliseUrl(input2) {
  let s = String(input2 || "").trim();
  if (!s) throw new Error("Enter a web address to check.");
  if (s.length > 2048) throw new Error("That address is too long.");
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^[^:]+:\d/.test(s)) throw new Error("Only http and https addresses can be checked.");
    s = "https://" + s.replace(/^\/+/, "");
  }
  let u;
  try {
    u = new URL(s);
  } catch {
    throw new Error("That doesn't look like a web address.");
  }
  if (!/^https?:$/.test(u.protocol)) throw new Error("Only http and https addresses can be checked.");
  if (u.username || u.password) throw new Error("Addresses with a username or password can't be checked.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard web ports can be checked.");
  u.hostname = u.hostname.replace(/\.+$/, "");
  const h = u.hostname;
  if (!h || h.startsWith("[") || /^[\d.]+$/.test(h) || /^0x/i.test(h) || PRIVATE.test(h) || !/\.(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/i.test(h) || h.length > 253)
    throw new Error("Only public websites (by domain name) can be checked.");
  u.hash = "";
  return u;
}
async function get(u, fetchImpl, method = "GET") {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    return await fetchImpl(u.toString(), { method, redirect: "manual", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8", "accept-encoding": "br, gzip" } });
  } finally {
    clearTimeout(t);
  }
}
var discard = async (r) => {
  try {
    await r.body?.cancel();
  } catch {
  }
};
async function readCapped(res, cap = MAX_BYTES) {
  if (!res.body || !res.body.getReader) {
    const s = await res.text();
    return { text: s.slice(0, cap), bytes: s.length };
  }
  const reader = res.body.getReader();
  const parts = [];
  let n = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.length;
    parts.push(value);
    if (n > cap) {
      try {
        await reader.cancel();
      } catch {
      }
      break;
    }
  }
  const buf = new Uint8Array(Math.min(n, cap));
  let o = 0;
  for (const p of parts) {
    const take = Math.min(p.length, buf.length - o);
    buf.set(p.subarray(0, take), o);
    o += take;
    if (o >= buf.length) break;
  }
  return { text: new TextDecoder().decode(buf), bytes: n };
}
async function getFile(u, fetchImpl, cap = 5e5, hops = 3) {
  try {
    for (let i = 0; ; i++) {
      const r = await get(u, fetchImpl);
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400 && loc && i < hops) {
        await discard(r);
        u = normaliseUrl(new URL(loc, u).href);
        continue;
      }
      if (r.status !== 200) {
        await discard(r);
        return { status: r.status, text: null, url: u };
      }
      const { text: text2, bytes } = await readCapped(r, cap);
      return { status: 200, text: text2, bytes, url: u };
    }
  } catch {
    return { status: 0, text: null, url: u };
  }
}
var fetchRobots = async (origin, fetchImpl = fetch) => {
  const r = await getFile(new URL("/robots.txt", origin), fetchImpl, 5e5);
  return { status: r.status, text: r.text };
};
var budgeted = (fetchImpl, max) => {
  let n = 0;
  const f = (...a) => ++n > max ? Promise.reject(Object.assign(new Error("Subrequest budget used up"), { budget: true })) : fetchImpl(...a);
  f.left = () => max - n;
  return f;
};
function eachTag(xml, tag, fn) {
  const open = "<" + tag + ">", close = "</" + tag + ">";
  for (let i = xml.indexOf(open); i >= 0; i = xml.indexOf(open, i)) {
    const j = xml.indexOf(close, i);
    if (j < 0) break;
    let v = xml.slice(i + open.length, j).trim();
    i = j + close.length;
    if (v.startsWith("<![CDATA[")) v = v.slice(9, v.endsWith("]]>") ? -3 : void 0).trim();
    if (fn(v.includes("&") ? decode(v) : v) === false) break;
  }
}
async function findSitemap(robots, origin, fetchImpl, pageHref) {
  const declared = robots ? [...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]) : [];
  const tries = [.../* @__PURE__ */ new Set([...declared.slice(0, 2), origin + "/sitemap.xml"])];
  for (const s of tries) {
    let su;
    try {
      su = normaliseUrl(s);
    } catch {
      continue;
    }
    const { text: xml, url, bytes } = await getFile(su, fetchImpl, SITEMAP_READ);
    if (!xml || !/<(urlset|sitemapindex)\b/i.test(xml.slice(0, 5e3))) continue;
    const cut = bytes > SITEMAP_READ;
    let lm = null, n = 0;
    eachTag(xml, "lastmod", (v) => {
      if (!lm || v > lm) lm = v;
    });
    eachTag(xml, "loc", () => {
      n++;
    });
    const index = /<sitemapindex\b/i.test(xml.slice(0, 5e3));
    const variants = [pageHref, noSlash(pageHref), noSlash(pageHref) + "/"].flatMap((h) => [h, h.replace(/&/g, "&amp;")]);
    const listsPage = index ? null : variants.some((h) => xml.includes(">" + h + "<") || xml.includes(h + "]]>")) || (cut ? null : false);
    return { url: url.href, urls: n, more: cut, index, inRobots: declared.length > 0, lastmod: lm, listsPage };
  }
  return null;
}
async function runCheck(input2, fetchImpl = fetch) {
  const F = budgeted(fetchImpl, FETCH_BUDGET);
  let u = normaliseUrl(input2);
  let res, redirects = 0, ms = 0;
  const chain = [];
  for (; ; ) {
    const t0 = Date.now();
    res = await get(u, F);
    ms = Date.now() - t0;
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      if (redirects >= 6) throw new Error("That address redirects too many times (more than 6 hops).");
      await discard(res);
      const next = normaliseUrl(new URL(loc, u).toString());
      if (next.href === u.href) throw new Error("That address redirects to itself.");
      chain.push(u.href);
      u = next;
      redirects++;
      continue;
    }
    break;
  }
  const type = res.headers.get("content-type") || "";
  if (res.status >= 300 && res.status < 400) throw new Error(`That address returned a redirect (HTTP ${res.status}) without saying where to.`);
  if (res.status >= 400) throw new Error(`That address returned an error (HTTP ${res.status}).`);
  if (!/html/i.test(type)) {
    await discard(res);
    throw new Error(`That address isn't a web page (it returned ${type.split(";")[0] || "an unknown type"}).`);
  }
  const { text: html, bytes } = await readCapped(res);
  const origin = `${u.protocol}//${u.hostname}`;
  const [robotsF, llmsF, wwwRes, httpRes] = await Promise.all([
    getFile(new URL("/robots.txt", origin), F, 5e5),
    getFile(new URL("/llms.txt", origin), F, 5e4, 2),
    (async () => {
      try {
        const alt = new URL("/", origin);
        alt.hostname = u.hostname.startsWith("www.") ? u.hostname.slice(4) : "www." + u.hostname;
        let r = await get(alt, F, "HEAD");
        if (r.status === 405 || r.status === 501) r = await get(alt, F);
        await discard(r);
        return { alt, r };
      } catch {
        return null;
      }
    })(),
    (async () => {
      if (u.protocol !== "https:") return null;
      let x = new URL(u.href.replace(/^https:/, "http:")), hops = 0;
      try {
        for (; hops < 3; hops++) {
          const r = await get(x, F, "HEAD");
          await discard(r);
          const loc = r.headers.get("location");
          if (!(r.status >= 300 && r.status < 400 && loc)) break;
          x = normaliseUrl(new URL(loc, x).href);
          if (x.protocol === "https:") return { ok: true, hops: hops + 1 };
        }
        return { ok: false, hops };
      } catch {
        return null;
      }
    })()
  ]);
  const robots = robotsF.text;
  const llms = llmsF.text;
  const sitemap = await findSitemap(robots, origin, F, u.href);
  let wwwOk = null, wwwNote = null;
  if (wwwRes && wwwRes.r) {
    const loc = wwwRes.r.headers.get("location");
    let to = null;
    try {
      to = loc && new URL(loc, wwwRes.alt).hostname;
    } catch {
    }
    if (wwwRes.r.status >= 300 && wwwRes.r.status < 400 && to === u.hostname) {
      wwwOk = true;
      wwwNote = `${wwwRes.alt.hostname} redirects to ${u.hostname}.`;
    } else if (wwwRes.r.status >= 300 && wwwRes.r.status < 400) wwwNote = `${wwwRes.alt.hostname} redirects to ${to || "somewhere else"}.`;
    else if (wwwRes.r.status === 200) {
      wwwOk = false;
      wwwNote = `Both ${wwwRes.alt.hostname} and ${u.hostname} load without redirecting \u2013 Google may see duplicate sites.`;
    } else wwwNote = `${wwwRes.alt.hostname} isn't in use (HTTP ${wwwRes.r.status}).`;
  } else wwwNote = "The other version (with/without www) doesn't exist \u2013 fine.";
  const site = u.hostname.replace(/^www\./, "");
  const seen = /* @__PURE__ */ new Set();
  const sample = [];
  for (const m of stripNoise(html).matchAll(/<a\b[^>]*\shref\s*=\s*["']([^"'#]+)["']/gi)) {
    let l;
    try {
      l = normaliseUrl(new URL(decode(m[1]).trim(), u).href);
    } catch {
      continue;
    }
    if (l.hostname.replace(/^www\./, "") !== site) continue;
    if (l.href === u.href || seen.has(l.href)) continue;
    seen.add(l.href);
    if (robots && !robotsAllows(robots, UA_TOKEN, l.pathname + l.search)) continue;
    sample.push(l);
    if (sample.length >= LINK_SAMPLE) break;
  }
  const results = await Promise.all(sample.map(async (l) => {
    const path = l.pathname + l.search;
    try {
      let r = await get(l, F, "HEAD");
      if (r.status === 405 || r.status === 501) {
        await discard(r);
        r = await get(l, F);
      }
      await discard(r);
      return { path, status: r.status };
    } catch (e) {
      return e.budget ? { path, skipped: true } : { path, status: 0 };
    }
  }));
  const done = results.filter((r) => !r.skipped);
  const broken = { checked: done.length, skipped: results.length - done.length, broken: done.filter((r) => r.status >= 400 || r.status === 0), redirected: done.filter((r) => r.status >= 300 && r.status < 400).length };
  return analyse({ url: input2, finalUrl: u.href, status: res.status, headers: res.headers, html, ms, redirects, chain, wwwOk, wwwNote, bytes, robots, robotsStatus: robotsF.status, llms: !!(llms && llms.trim() && !/<html|<!doctype/i.test(llms)), sitemap, broken, httpRedirects: httpRes ? httpRes.ok : void 0, httpHops: httpRes ? httpRes.hops : 0 });
}
async function runVitals(input2, key, fetchImpl = fetch) {
  const u = normaliseUrl(input2);
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", u.href);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  if (key) api.searchParams.set("key", key);
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 55e3);
  let j;
  try {
    const r = await fetchImpl(api.toString(), { signal: ctl.signal });
    try {
      j = await r.json();
    } catch {
      throw new Error(`PageSpeed returned an unreadable response (HTTP ${r.status})`);
    }
    if (!r.ok) {
      const msg = j && j.error && j.error.message || `PageSpeed returned ${r.status}`;
      if (r.status === 429 || /quota|rate limit/i.test(msg)) throw Object.assign(new Error("Google's daily allowance of free PageSpeed tests for this tool has been used up."), { quota: true });
      throw new Error(msg);
    }
  } catch (e) {
    if (e.name === "AbortError") throw new Error("Google PageSpeed took too long");
    throw e;
  } finally {
    clearTimeout(t);
  }
  const lr = j.lighthouseResult || {};
  if (lr.runtimeError && lr.runtimeError.code && lr.runtimeError.code !== "NO_ERROR") throw new Error(`Lighthouse couldn't load the page (${lr.runtimeError.code})`);
  const a = lr.audits || {};
  const metric = (src2, m) => {
    const x = (src2 && src2.metrics || {})[m];
    return x && typeof x.percentile === "number" ? { p75: x.percentile, cat: ["FAST", "AVERAGE", "SLOW"].includes(x.category) ? x.category : null } : null;
  };
  const pageField = j.loadingExperience && j.loadingExperience.metrics && j.loadingExperience.origin_fallback !== true ? j.loadingExperience : null;
  const originField = j.originLoadingExperience && j.originLoadingExperience.metrics ? j.originLoadingExperience : null;
  const src = pageField || originField;
  const field = { source: pageField ? "this page" : originField ? "whole site" : null, lcp: metric(src, "LARGEST_CONTENTFUL_PAINT_MS"), inp: metric(src, "INTERACTION_TO_NEXT_PAINT"), cls: metric(src, "CUMULATIVE_LAYOUT_SHIFT_SCORE"), ttfb: metric(src, "EXPERIMENTAL_TIME_TO_FIRST_BYTE") };
  const judged = [field.lcp && field.lcp.p75 <= 2500, field.inp && field.inp.p75 <= 200, field.cls && field.cls.p75 / 100 <= 0.1].filter((x, i) => [field.lcp, field.inp, field.cls][i]);
  field.cwv = field.source && field.lcp && field.cls ? judged.every(Boolean) : null;
  const score = lr.categories && lr.categories.performance && lr.categories.performance.score;
  return {
    performance: typeof score === "number" ? Math.round(score * 100) : null,
    lab: { lcp: a["largest-contentful-paint"]?.displayValue, cls: a["cumulative-layout-shift"]?.displayValue, tbt: a["total-blocking-time"]?.displayValue, fcp: a["first-contentful-paint"]?.displayValue, si: a["speed-index"]?.displayValue },
    field,
    opportunities: Object.values(a).filter((x) => x && x.details && x.details.type === "opportunity" && typeof x.score === "number" && x.score < 0.9).sort((x, y) => (y.details.overallSavingsMs || 0) - (x.details.overallSavingsMs || 0)).slice(0, 5).map((x) => ({ title: String(x.title || ""), savings: x.details.overallSavingsMs ? `${(x.details.overallSavingsMs / 1e3).toFixed(1)} s` : null }))
  };
}
var fnv = (s, seed = 2166136261) => {
  let h = seed >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
function simhash(words) {
  const v = new Int32Array(64);
  for (let i = 0; i + 2 < words.length; i++) {
    const sh = words[i] + " " + words[i + 1] + " " + words[i + 2];
    const a = fnv(sh), b = fnv(sh, 2166136261 ^ 1540483477);
    for (let k = 0; k < 32; k++) {
      v[k] += a >>> k & 1 ? 1 : -1;
      v[k + 32] += b >>> k & 1 ? 1 : -1;
    }
  }
  let lo = 0, hi = 0;
  for (let k = 0; k < 32; k++) {
    if (v[k] > 0) lo |= 1 << k;
    if (v[k + 32] > 0) hi |= 1 << k;
  }
  return (hi >>> 0).toString(16).padStart(8, "0") + (lo >>> 0).toString(16).padStart(8, "0");
}
function pageFacts(html, pageUrl, headers, status, ms, bytes) {
  const page = new URL(pageUrl);
  const clean = stripNoise(html);
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [html.slice(0, 2e4)])[0];
  const body = (clean.match(/<body\b[\s\S]*<\/body>/i) || [clean])[0];
  const H = (k) => (headers && headers.get ? headers.get(k) : null) || "";
  const title = text((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]);
  const desc = meta(head, "name", "description") || "";
  const robotsMeta = ((meta(head, "name", "robots") || "") + " " + (meta(head, "name", "googlebot") || "") + " " + H("x-robots-tag")).toLowerCase();
  const canonTag = tags(head, "link").find((t) => /rel\s*=\s*["']?canonical["'\s>]/i.test(t));
  let canonical = canonTag ? attr(canonTag, "href") : (H("link").match(/<([^>]+)>\s*;[^,]*rel\s*=\s*"?canonical/i) || [])[1] || null;
  try {
    if (canonical) {
      const c = new URL(canonical.trim(), page);
      c.hash = "";
      canonical = c.href;
    }
  } catch {
    canonical = null;
  }
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1]));
  const mainWords = text(mainOf(body)).toLowerCase().split(" ").filter((w) => /[\p{L}\p{N}]/u.test(w));
  const words = mainWords.length;
  const imgs = tags(body, "img");
  const links = /* @__PURE__ */ new Set();
  let httpLinks = 0;
  for (const m of body.matchAll(/<a\b[^>]*\shref\s*=\s*["']([^"'#]+)["'][^>]*>/gi)) {
    if (/\brel\s*=\s*["'][^"']*nofollow/i.test(m[0])) continue;
    let l;
    try {
      l = new URL(decode(m[1]).trim(), page);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(l.protocol) || !sameSite(l.hostname, page.hostname)) continue;
    if (/\.(jpe?g|png|gif|webp|avif|svg|pdf|zip|docx?|xlsx?|pptx?|mp4|mp3|ico|css|js|xml|txt|json|rss)$/i.test(l.pathname)) continue;
    if (page.protocol === "https:" && l.protocol === "http:") httpLinks++;
    l.hash = "";
    links.add(l.href);
    if (links.size >= 400) break;
  }
  const hreflang = tags(head, "link").filter((t) => /hreflang\s*=/i.test(t) && /rel\s*=\s*["']?alternate/i.test(t)).slice(0, 30).map((t) => {
    try {
      const x = new URL((attr(t, "href") || "").trim(), page);
      x.hash = "";
      return [(attr(t, "hreflang") || "").toLowerCase(), x.href];
    } catch {
      return null;
    }
  }).filter(Boolean);
  const ld = (html.match(/application\/ld\+json/gi) || []).length;
  const joined = mainWords.join(" ");
  return {
    url: page.href,
    status,
    ms,
    bytes,
    title,
    titlePx: pixelWidth(title, 20),
    desc,
    descPx: pixelWidth(desc, 14),
    h1: h1.slice(0, 3),
    words,
    noindex: /\b(noindex|none)\b/.test(robotsMeta),
    canonical,
    lang: attr((html.match(/<html\b[^>]*>/i) || [""])[0], "lang"),
    imgs: imgs.length,
    imgsNoAlt: imgs.filter((t) => attr(t, "alt") === null).length,
    ld,
    links: [...links],
    httpLinks,
    hreflang,
    hash: words >= 50 ? fnv(joined).toString(16) : null,
    sim: words >= 100 ? simhash(mainWords.slice(0, 3e3)) : null
  };
}
async function crawlStart(input2, fetchImpl = fetch) {
  const F = budgeted(fetchImpl, FETCH_BUDGET);
  let u = normaliseUrl(input2);
  for (let i = 0; ; i++) {
    const r = await get(u, F, "GET");
    await discard(r);
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) {
      if (i >= 5) throw new Error("The site redirects too many times.");
      u = normaliseUrl(new URL(loc, u).href);
      continue;
    }
    if (r.status >= 400) throw new Error(`The site returned an error (HTTP ${r.status}).`);
    break;
  }
  const origin = `${u.protocol}//${u.hostname}`;
  const rf = await getFile(new URL("/robots.txt", origin), F, 5e5);
  const robots = rf.text;
  const robotsDown = rf.status === 0 || rf.status === 429 || rf.status >= 500;
  const smList = robots ? [...robots.matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]) : [];
  const sitemapUrls = /* @__PURE__ */ new Set();
  let sitemapFound = false, truncated = false, readLeft = SITEMAP_READ_AUDIT;
  const site = u.hostname.replace(/^www\./, "").replace(/[.]/g, "\\.");
  const fast = new RegExp(`^https?://(?:www\\.)?${site}/[\\x21-\\x22\\x24-\\x7e]*$`);
  const queue = [...new Set(smList.slice(0, 3))];
  const fallback = origin + "/sitemap.xml";
  for (let i = 0, fetched = 0; fetched < 6; i++) {
    if (i >= queue.length) {
      if (sitemapFound || queue.includes(fallback)) break;
      queue.push(fallback);
    }
    let su;
    try {
      su = normaliseUrl(queue[i]);
    } catch {
      continue;
    }
    if (!sameSite(su.hostname, u.hostname)) continue;
    if (readLeft <= 0) {
      truncated = true;
      break;
    }
    fetched++;
    const cap = readLeft;
    const { text: xml, bytes = 0 } = await getFile(su, F, cap);
    readLeft -= Math.min(bytes, cap);
    if (bytes > cap) truncated = true;
    if (!xml || !/<(urlset|sitemapindex)\b/i.test(xml.slice(0, 5e3))) continue;
    sitemapFound = true;
    if (/<sitemapindex\b/i.test(xml.slice(0, 5e3))) {
      const kids = [];
      eachTag(xml, "loc", (l) => {
        kids.push(l);
        return kids.length < 5;
      });
      kids.reverse().forEach((l) => {
        if (!queue.includes(l)) queue.splice(i + 1, 0, l);
      });
      continue;
    }
    const locs = [];
    eachTag(xml, "loc", (l) => {
      locs.push(l);
      return locs.length < SITEMAP_MAX;
    });
    for (const l of locs) {
      let href = null;
      if (fast.test(l)) href = l;
      else {
        try {
          const x = new URL(l);
          if (sameSite(x.hostname, u.hostname)) {
            x.hash = "";
            href = x.href;
          }
        } catch {
        }
      }
      if (href) sitemapUrls.add(href);
      if (sitemapUrls.size >= SITEMAP_MAX) {
        truncated = true;
        break;
      }
    }
  }
  return { start: u.href, origin, host: u.hostname, robots: robots !== null, robotsStatus: rf.status, robotsDown, sitemapFound, sitemapTruncated: truncated, sitemap: [...sitemapUrls] };
}
async function crawlBatch(host, urls, fetchImpl = fetch, robots = null) {
  const groups = robots ? parseRobots(robots) : null;
  const out = await Promise.all(urls.slice(0, 8).map(async (raw) => {
    let u;
    try {
      u = normaliseUrl(raw);
    } catch (e) {
      return { url: String(raw).slice(0, 300), status: 0, error: e.message };
    }
    if (!sameSite(u.hostname, host)) return { url: u.href, status: 0, error: "Different site" };
    if (groups && !robotsAllows(groups, UA_TOKEN, u.pathname + u.search)) return { url: u.href, blocked: true };
    try {
      const t0 = Date.now();
      const r = await get(u, fetchImpl, "GET");
      const ms = Date.now() - t0;
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400) {
        let to = null;
        try {
          to = new URL(loc, u);
          to.hash = "";
          to = /^https?:$/.test(to.protocol) ? to.href : null;
        } catch {
          to = null;
        }
        await discard(r);
        return { url: u.href, status: r.status, ms, redirect: to };
      }
      const type = r.headers.get("content-type") || "";
      if (r.status >= 400 || !/html/i.test(type)) {
        await discard(r);
        return { url: u.href, status: r.status, ms, type: type.split(";")[0] || "unknown" };
      }
      const { text: html, bytes } = await readCapped(r, 1e6);
      return pageFacts(html, u.href, r.headers, r.status, ms, bytes);
    } catch (e) {
      return { url: u.href, status: 0, error: e.name === "AbortError" ? "Timed out" : "Could not connect" };
    }
  }));
  return out;
}
async function fetchHtml(input2, fetchImpl = fetch) {
  const t0 = Date.now();
  const r = await getFile(normaliseUrl(input2), fetchImpl, MAX_BYTES, 5);
  return { status: r.status, html: r.text, url: r.url.href, ms: Date.now() - t0 };
}

// engine/audit-client.js
function auditApp() {
  "use strict";
  var root = document.getElementById("audit");
  if (!root) return;
  var START = root.getAttribute("data-url"), MAX = Math.min(250, +root.getAttribute("data-max") || 250), BATCH = 6, PARALLEL = 2;
  var BRAND2 = root.getAttribute("data-brand") || "";
  var esc2 = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var short = function(u) {
    try {
      var x = new URL(u);
      return x.pathname + x.search || "/";
    } catch (e) {
      return u;
    }
  };
  var safeHref = function(u) {
    return /^https?:\/\//i.test(String(u)) ? esc2(u) : "#";
  };
  var $ = function(id) {
    return document.getElementById(id);
  };
  var state = { host: null, token: null, sitemap: /* @__PURE__ */ new Set(), sitemapFound: false, robots: false, robotsDown: false, robotsStatus: 0, seen: /* @__PURE__ */ new Map(), queue: [], results: /* @__PURE__ */ new Map(), blocked: /* @__PURE__ */ new Set(), inbound: /* @__PURE__ */ new Map(), redirectedFrom: /* @__PURE__ */ new Map(), retried: /* @__PURE__ */ new Set(), stopped: false, error: null, active: 0, done: false, startedAt: Date.now() };
  root.innerHTML = '<div class="card" id="au-progress"><p class="ct" id="au-status" aria-live="polite">Starting audit\u2026</p><div class="au-bar"><span id="au-fill"></span></div><p class="small" id="au-count">Reading robots.txt and sitemap\u2026</p><button type="button" class="btn ghost" id="au-stop">Stop and show results</button></div><div id="au-report"></div>';
  $("au-stop").onclick = function() {
    state.stopped = true;
    this.disabled = true;
    this.textContent = "Stopping\u2026";
    if (state.active === 0) pump();
  };
  function enqueue(u, depth, from) {
    if (from) {
      if (!state.inbound.has(u)) state.inbound.set(u, /* @__PURE__ */ new Set());
      state.inbound.get(u).add(from);
    }
    if (state.seen.has(u)) {
      var s = state.seen.get(u);
      if (depth != null && (s.depth == null || depth < s.depth)) s.depth = depth;
      return;
    }
    if (state.seen.size >= MAX * 4) return;
    state.seen.set(u, { depth, sitemapOnly: depth == null });
    state.queue.push(u);
  }
  function progress() {
    var n = state.results.size;
    $("au-fill").style.width = Math.min(100, Math.round(n / Math.max(1, Math.min(MAX, state.seen.size - state.blocked.size)) * 100)) + "%";
    $("au-count").textContent = n + " page" + (n === 1 ? "" : "s") + " checked \xB7 " + state.queue.length + " waiting \xB7 limit " + MAX + (state.blocked.size ? " \xB7 " + state.blocked.size + " skipped (robots.txt)" : "");
  }
  function api(path) {
    return fetch(path).then(function(r) {
      return r.json().catch(function() {
        return { error: "The server sent an unexpected reply (HTTP " + r.status + ")." };
      }).then(function(j) {
        if (!r.ok || j.error) {
          var e = new Error(j.error || "HTTP " + r.status);
          e.status = r.status;
          throw e;
        }
        return j;
      });
    });
  }
  function pump() {
    if (state.done) return;
    if (state.stopped || state.results.size >= MAX) {
      if (state.active === 0) finish();
      return;
    }
    if (state.queue.length === 0 && state.active === 0) {
      var added = 0;
      state.sitemap.forEach(function(u) {
        if (!state.seen.has(u) && state.results.size + added < MAX) {
          enqueue(u, null, null);
          added++;
        }
      });
      if (!added) return finish();
    }
    while (state.active < PARALLEL && state.queue.length) {
      var room = MAX - state.results.size - state.active * BATCH;
      if (room <= 0) break;
      send2(state.queue.splice(0, Math.min(BATCH, room)));
    }
  }
  function send2(batch) {
    state.active++;
    api("/api/audit/batch?t=" + encodeURIComponent(state.token) + batch.map(function(u) {
      return "&u=" + encodeURIComponent(u);
    }).join("")).then(function(rows) {
      rows.forEach(take);
      batch.forEach(function(u) {
        if (!state.results.has(u) && !state.blocked.has(u)) state.results.set(u, { url: u, status: 0, error: "No result" });
      });
    }).catch(function(e) {
      var key = batch.join(" ");
      if (e.status !== 429 && e.status !== 403 && !state.retried.has(key)) {
        state.retried.add(key);
        Array.prototype.unshift.apply(state.queue, batch);
        return;
      }
      state.error = e.message;
      $("au-status").textContent = "Paused: " + e.message;
      state.stopped = true;
    }).then(function() {
      state.active--;
      progress();
      pump();
    });
  }
  function take(r) {
    if (!r || typeof r.url !== "string") return;
    if (r.blocked) {
      state.blocked.add(r.url);
      return;
    }
    if (state.results.has(r.url)) return;
    state.results.set(r.url, r);
    var d = (state.seen.get(r.url) || {}).depth;
    if (r.redirect) {
      try {
        var t = new URL(r.redirect);
        t.hash = "";
        if (t.hostname.replace(/^www\./, "") === state.host.replace(/^www\./, "")) {
          state.redirectedFrom.set(t.href, r.url);
          enqueue(t.href, d, null);
        }
      } catch (e) {
      }
    }
    if (r.links) r.links.forEach(function(l) {
      enqueue(l, d == null ? null : d + 1, r.url);
    });
  }
  api("/api/audit/start?url=" + encodeURIComponent(START)).then(function(s) {
    state.host = s.host;
    state.token = s.token;
    state.robots = s.robots;
    state.robotsDown = !!s.robotsDown;
    state.robotsStatus = s.robotsStatus;
    state.sitemapFound = s.sitemapFound;
    state.sitemapTruncated = !!s.sitemapTruncated;
    (s.sitemap || []).forEach(function(u) {
      state.sitemap.add(u);
    });
    $("au-status").textContent = "Crawling " + s.host + "\u2026";
    enqueue(s.start, 0, null);
    progress();
    pump();
  }).catch(function(e) {
    root.innerHTML = `<div class="card"><p class="ct">The audit couldn't start</p><p>` + esc2(e.message) + "</p></div>";
  });
  var W3 = { critical: 20, high: 10, medium: 5, low: 2 };
  var bits = function(x) {
    x = x - (x >>> 1 & 1431655765);
    x = (x & 858993459) + (x >>> 2 & 858993459);
    return (x + (x >>> 4) & 252645135) * 16843009 >>> 24;
  };
  var ham = function(a, b) {
    return bits((parseInt(a.slice(0, 8), 16) ^ parseInt(b.slice(0, 8), 16)) >>> 0) + bits((parseInt(a.slice(8), 16) ^ parseInt(b.slice(8), 16)) >>> 0);
  };
  function finish() {
    if (state.done) return;
    state.done = true;
    var all = Array.from(state.results.values());
    var html = all.filter(function(r) {
      return r.status === 200 && r.title !== void 0;
    });
    var idx = html.filter(function(r) {
      return !r.noindex && (!r.canonical || r.canonical === r.url);
    });
    var issues = [];
    function add(sev, title, pages, fix) {
      if (pages.length) issues.push({ sev, title, pages, fix });
    }
    var src = function(u) {
      var s = state.inbound.get(u);
      return s ? Array.from(s).slice(0, 3).map(short).join(", ") : state.redirectedFrom.has(u) ? "redirect from " + short(state.redirectedFrom.get(u)) : "sitemap only";
    };
    var groupBy = function(list, keyFn) {
      var m = /* @__PURE__ */ new Map();
      list.forEach(function(r) {
        var k = keyFn(r);
        if (!k) return;
        if (!m.has(k)) m.set(k, []);
        m.get(k).push(r);
      });
      var out = [];
      m.forEach(function(rs) {
        if (rs.length > 1) out.push(rs);
      });
      return out;
    };
    if (state.robotsDown) issues.push({ sev: "critical", title: "robots.txt is unavailable (" + (state.robotsStatus ? "HTTP " + state.robotsStatus : "no response") + ")", pages: [], fix: `Google treats an unreachable robots.txt as "don't crawl" and pauses crawling. Make /robots.txt return 200, or 404 if you don't need one.`, site: true });
    add("critical", "Broken pages (4xx/5xx or unreachable)", all.filter(function(r) {
      return r.status >= 400 || r.status === 0;
    }).map(function(r) {
      return [r.url, (r.status || r.error) + " \xB7 linked from " + src(r.url)];
    }), "Fix the page, restore it, or 301-redirect it to the closest live page \u2013 and update the links pointing to it.");
    var redirs = all.filter(function(r) {
      return r.status >= 300 && r.status < 400;
    });
    add("high", "Internal links to redirects", redirs.filter(function(r) {
      return state.inbound.has(r.url);
    }).map(function(r) {
      return [r.url, r.status + " \u2192 " + (r.redirect ? short(r.redirect) : "?") + " \xB7 linked from " + src(r.url)];
    }), "Point these links straight at the final address so visitors and crawlers skip the redirect.");
    add("high", "Redirect chains", redirs.filter(function(r) {
      var t = state.results.get(r.redirect);
      return t && t.status >= 300 && t.status < 400;
    }).map(function(r) {
      return [r.url, "\u2192 " + short(r.redirect) + " \u2192 " + short(state.results.get(r.redirect).redirect)];
    }), "Make every redirect go to its final destination in one hop.");
    add("medium", "Internal links using http://", html.filter(function(r) {
      return r.httpLinks > 0;
    }).map(function(r) {
      return [r.url, r.httpLinks + " link(s) to http:// pages"];
    }), "Update internal links to https:// (or relative links) so they don't go through a redirect.");
    add("high", "Noindex pages listed in the sitemap", html.filter(function(r) {
      return r.noindex && state.sitemap.has(r.url);
    }).map(function(r) {
      return [r.url, "noindex"];
    }), "Either remove noindex or take the page out of the sitemap \u2013 the two signals contradict each other.");
    add("medium", "Sitemap lists redirects or errors", all.filter(function(r) {
      return state.sitemap.has(r.url) && r.status !== 200;
    }).map(function(r) {
      return [r.url, String(r.status || r.error) + (r.redirect ? " \u2192 " + short(r.redirect) : "")];
    }), "List only final, working (200) URLs in the sitemap.");
    add("medium", "Pages set to noindex", html.filter(function(r) {
      return r.noindex && !state.sitemap.has(r.url);
    }).map(function(r) {
      return [r.url, "won't appear in Google"];
    }), "Check these are meant to be hidden from search.");
    var canonOther = html.filter(function(r) {
      return r.canonical && r.canonical !== r.url;
    });
    var canonBad = canonOther.filter(function(r) {
      var t = state.results.get(r.canonical);
      return t && (t.status !== 200 || t.noindex);
    });
    add("high", "Canonical points to a redirect, error or noindex page", canonBad.map(function(r) {
      var t = state.results.get(r.canonical);
      return [r.url, "canonical \u2192 " + short(r.canonical) + " (" + (t.noindex && t.status === 200 ? "noindex" : t.status || t.error) + ")"];
    }), "Point canonicals at the final, indexable version of the page.");
    add("medium", "Canonical points to another page", canonOther.filter(function(r) {
      return canonBad.indexOf(r) < 0;
    }).map(function(r) {
      return [r.url, "canonical \u2192 " + short(r.canonical)];
    }), "Fine for true duplicates (e.g. filtered or tracking URLs); otherwise every unique page should have a self-referencing canonical.");
    add("low", "Missing canonical tag", html.filter(function(r) {
      return !r.canonical && !r.noindex;
    }).map(function(r) {
      return [r.url, "no canonical"];
    }), "Add a self-referencing canonical tag to every page \u2013 it protects against duplicate URLs created by parameters.");
    add("critical", "Missing page title", idx.filter(function(r) {
      return !r.title;
    }).map(function(r) {
      return [r.url, "no <title>"];
    }), "Give every page a unique, descriptive title.");
    var dupRows = function(key) {
      var out = [];
      groupBy(idx, function(r) {
        return (r[key] || "").trim().toLowerCase();
      }).forEach(function(rs) {
        rs.forEach(function(r) {
          out.push([r.url, "\u201C" + r[key].slice(0, 80) + "\u201D shared by " + rs.length + " pages"]);
        });
      });
      return out;
    };
    add("high", "Duplicate titles", dupRows("title"), "Rewrite titles so each page describes its own topic \u2013 duplicates make pages compete with each other.");
    var tok = function(t) {
      return (t || "").toLowerCase().split(/[^\p{L}\p{N}£]+/u).filter(function(w) {
        return w.length > 1;
      });
    };
    var df = /* @__PURE__ */ new Map();
    idx.forEach(function(r) {
      new Set(tok(r.title)).forEach(function(w) {
        df.set(w, (df.get(w) || 0) + 1);
      });
    });
    var common = function(w) {
      return idx.length >= 5 && df.get(w) > idx.length * 0.4;
    };
    var tsets = idx.map(function(r) {
      return { r, s: new Set(tok(r.title).filter(function(w) {
        return !common(w);
      })) };
    }).filter(function(x) {
      return x.s.size >= 2;
    });
    var nearT = /* @__PURE__ */ new Map();
    for (var i = 0; i < tsets.length; i++) for (var j = i + 1; j < tsets.length; j++) {
      var A = tsets[i], B = tsets[j];
      if (A.r.title.trim().toLowerCase() === B.r.title.trim().toLowerCase()) continue;
      var inter = 0;
      A.s.forEach(function(w) {
        if (B.s.has(w)) inter++;
      });
      if (inter / (A.s.size + B.s.size - inter) >= 0.8) {
        if (!nearT.has(A.r.url)) nearT.set(A.r.url, B.r);
        if (!nearT.has(B.r.url)) nearT.set(B.r.url, A.r);
      }
    }
    add("low", "Near-duplicate titles", Array.from(nearT).map(function(x) {
      return [x[0], "very similar to " + short(x[1].url)];
    }), "Make each title clearly different, leading with what's unique about that page.");
    add("medium", "Titles too long for Google", idx.filter(function(r) {
      return r.titlePx > 580;
    }).map(function(r) {
      return [r.url, r.titlePx + "px: " + r.title.slice(0, 70)];
    }), "Shorten titles to under ~580px (about 55\u201360 characters).");
    add("low", "Titles too short", idx.filter(function(r) {
      return r.title && r.titlePx < 250;
    }).map(function(r) {
      return [r.url, r.titlePx + "px: " + r.title];
    }), "Use the space: add the main keyword and location or brand.");
    add("high", "Missing meta description", idx.filter(function(r) {
      return !r.desc;
    }).map(function(r) {
      return [r.url, "no description"];
    }), "Write a unique 140\u2013155 character description for each page.");
    add("medium", "Duplicate meta descriptions", dupRows("desc"), "Make each description specific to its page.");
    add("low", "Descriptions too long", idx.filter(function(r) {
      return r.descPx > 990;
    }).map(function(r) {
      return [r.url, r.descPx + "px"];
    }), "Trim descriptions to under ~990px (about 155 characters).");
    var dupC = [], inDup = /* @__PURE__ */ new Set();
    groupBy(idx, function(r) {
      return r.hash;
    }).forEach(function(rs) {
      rs.forEach(function(r) {
        inDup.add(r.url);
        dupC.push([r.url, "same main text as " + rs.filter(function(o) {
          return o !== r;
        }).slice(0, 2).map(function(o) {
          return short(o.url);
        }).join(", ")]);
      });
    });
    add("high", "Duplicate content", dupC, "Merge duplicate pages and 301-redirect the extras, or point a canonical at the main version.");
    var sims = idx.filter(function(r) {
      return r.sim && !inDup.has(r.url);
    }), nearC = /* @__PURE__ */ new Map();
    for (var a = 0; a < sims.length; a++) for (var b = a + 1; b < sims.length; b++) if (ham(sims[a].sim, sims[b].sim) <= 3) {
      if (!nearC.has(sims[a].url)) nearC.set(sims[a].url, sims[b]);
      if (!nearC.has(sims[b].url)) nearC.set(sims[b].url, sims[a]);
    }
    add("medium", "Near-duplicate content", Array.from(nearC).map(function(x) {
      return [x[0], "almost the same text as " + short(x[1].url)];
    }), "Pages that only swap a place name or product are seen as thin duplicates \u2013 give each one genuinely specific content, or combine them.");
    add("high", "Missing H1 heading", idx.filter(function(r) {
      return !r.h1.length;
    }).map(function(r) {
      return [r.url, "no H1"];
    }), "Give every page one H1 stating its topic.");
    add("low", "More than one H1", idx.filter(function(r) {
      return r.h1.length > 1;
    }).map(function(r) {
      return [r.url, r.h1.length + " H1s"];
    }), "Use a single clear H1; make the others H2s.");
    add("medium", "Thin content (under 200 words)", idx.filter(function(r) {
      return r.words < 200;
    }).map(function(r) {
      return [r.url, r.words + " words of main content"];
    }), "Expand with genuinely useful detail, merge with a related page, or noindex it.");
    add("high", "Orphan pages (in sitemap, never linked)", html.filter(function(r) {
      return (state.seen.get(r.url) || {}).sitemapOnly && !state.inbound.has(r.url);
    }).map(function(r) {
      return [r.url, "no internal links point here"];
    }), "Link to these pages from relevant pages \u2013 Google rarely ranks pages your own site doesn't link to.");
    if (state.sitemapFound && !state.sitemapTruncated) add("medium", "Indexable pages missing from the sitemap", idx.filter(function(r) {
      return !state.sitemap.has(r.url);
    }).map(function(r) {
      return [r.url, "not in sitemap"];
    }), "Add every indexable page to the XML sitemap.");
    add("medium", "Deep pages (4+ clicks from home)", idx.filter(function(r) {
      var d = (state.seen.get(r.url) || {}).depth;
      return d != null && d >= 4;
    }).map(function(r) {
      return [r.url, state.seen.get(r.url).depth + " clicks"];
    }), "Bring important pages within three clicks of the home page with better menus and hub pages.");
    var hrefl = [], hrefBad = [];
    html.forEach(function(r) {
      (r.hreflang || []).forEach(function(e) {
        var t = state.results.get(e[1]);
        if (!t || e[1] === r.url) return;
        if (t.status !== 200) hrefBad.push([r.url, e[0] + " \u2192 " + short(e[1]) + " (" + (t.status || t.error) + ")"]);
        else if (t.hreflang && !t.hreflang.some(function(x) {
          return x[1] === r.url;
        })) hrefl.push([r.url, e[0] + " \u2192 " + short(e[1]) + " doesn't link back"]);
      });
    });
    add("high", "hreflang without return links", hrefl, "Each language version must list every other version (and itself) \u2013 Google ignores hreflang pairs that don't point back.");
    add("high", "hreflang points to redirects or errors", hrefBad, "Point hreflang links at the final, working URL of each language version.");
    add("medium", "Slow server response (over 1 s)", html.filter(function(r) {
      return r.ms > 1e3;
    }).map(function(r) {
      return [r.url, (r.ms / 1e3).toFixed(1) + " s"];
    }), "Add page caching or a CDN; look at slow database queries and plugins.");
    add("low", "Heavy HTML (over 500 kB)", html.filter(function(r) {
      return r.bytes > 5e5;
    }).map(function(r) {
      return [r.url, Math.round(r.bytes / 1024) + " kB"];
    }), "Remove inline bloat and paginate very long lists.");
    add("medium", "Images missing alt text", html.filter(function(r) {
      return r.imgsNoAlt > 0;
    }).map(function(r) {
      return [r.url, r.imgsNoAlt + " of " + r.imgs + " images"];
    }), 'Add descriptive alt text (or alt="" for decorative images).');
    add("low", "No structured data", idx.filter(function(r) {
      return !r.ld;
    }).map(function(r) {
      return [r.url, "no JSON-LD"];
    }), "Add JSON-LD (Organization/LocalBusiness, WebPage or Article, BreadcrumbList).");
    add("low", "Missing language attribute", html.filter(function(r) {
      return !r.lang;
    }).map(function(r) {
      return [r.url, "no lang"];
    }), 'Add lang="en-GB" to the <html> tag.');
    if (!state.sitemapFound) issues.push({ sev: "high", title: "No XML sitemap found", pages: [], fix: "Create sitemap.xml listing every page, add it to robots.txt and submit it in Google Search Console.", site: true });
    if (!state.robots && !state.robotsDown) issues.push({ sev: "low", title: "No robots.txt", pages: [], fix: "Add a robots.txt that allows crawling and lists your sitemap.", site: true });
    var base = Math.max(1, html.length);
    var penalty = issues.reduce(function(t, i2) {
      var frac = i2.site ? 1 : Math.min(1, i2.pages.length / base);
      return t + W3[i2.sev] * (0.35 + 0.65 * frac);
    }, 0);
    var score = all.length ? Math.max(0, Math.round(100 - penalty)) : 0;
    var order = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort(function(a2, b2) {
      return order[a2.sev] - order[b2.sev] || b2.pages.length - a2.pages.length;
    });
    render2(all, html, issues, score);
  }
  function drawMap(pages) {
    var box = $("au-map"), urls = pages.map(function(r) {
      return r.url;
    }).slice(0, 250), index = {};
    urls.forEach(function(u, i2) {
      index[u] = i2;
    });
    var edges = [], inDeg = urls.map(function() {
      return 0;
    });
    urls.forEach(function(u, i2) {
      var src = state.inbound.get(u);
      if (src) src.forEach(function(f2) {
        if (index[f2] != null && index[f2] !== i2) {
          edges.push([index[f2], i2]);
          inDeg[i2]++;
        }
      });
    });
    var W4 = 900, H = 600, n = urls.length;
    if (!n) {
      box.innerHTML = "<p>No pages to map.</p>";
      return;
    }
    var P = urls.map(function(u, i2) {
      var a = i2 * 2.39996, r = 20 * Math.sqrt(i2 + 1);
      return { x: W4 / 2 + r * Math.cos(a), y: H / 2 + r * Math.sin(a), vx: 0, vy: 0 };
    });
    var damp = Math.max(1, edges.length / n), k = Math.sqrt(W4 * H / n) * 0.55, iters = n > 150 ? 220 : 320;
    for (var it = 0; it < iters; it++) {
      var t = 1 - it / iters;
      for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
        var dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d2 = dx * dx + dy * dy + 0.01, f = k * k / d2;
        P[i].vx += dx * f;
        P[i].vy += dy * f;
        P[j].vx -= dx * f;
        P[j].vy -= dy * f;
      }
      edges.forEach(function(e) {
        var a = P[e[0]], b = P[e[1]], dx2 = b.x - a.x, dy2 = b.y - a.y, d = Math.sqrt(dx2 * dx2 + dy2 * dy2) + 0.01, f2 = d / k / damp;
        a.vx += dx2 * f2;
        a.vy += dy2 * f2;
        b.vx -= dx2 * f2;
        b.vy -= dy2 * f2;
      });
      P.forEach(function(p) {
        p.vx += (W4 / 2 - p.x) * 0.02;
        p.vy += (H / 2 - p.y) * 0.02;
        var v = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, cap = 30 * t + 1;
        p.x += p.vx / v * Math.min(v, cap);
        p.y += p.vy / v * Math.min(v, cap);
        p.vx = p.vy = 0;
        p.x = Math.max(12, Math.min(W4 - 12, p.x));
        p.y = Math.max(12, Math.min(H - 12, p.y));
      });
    }
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    P.forEach(function(p) {
      x0 = Math.min(x0, p.x);
      x1 = Math.max(x1, p.x);
      y0 = Math.min(y0, p.y);
      y1 = Math.max(y1, p.y);
    });
    var sc = Math.min((W4 - 60) / Math.max(1, x1 - x0), (H - 60) / Math.max(1, y1 - y0));
    P.forEach(function(p) {
      p.x = 30 + (p.x - x0) * sc + (W4 - 60 - (x1 - x0) * sc) / 2;
      p.y = 30 + (p.y - y0) * sc + (H - 60 - (y1 - y0) * sc) / 2;
    });
    var home = urls.reduce(function(h, u, i2) {
      var d = (state.seen.get(u) || {}).depth;
      return d === 0 ? i2 : h;
    }, -1);
    var colour3 = function(u, i2) {
      var d = (state.seen.get(u) || {}).depth;
      return i2 === home ? "#0a6f6a" : !inDeg[i2] ? "#cf222e" : d != null && d >= 4 ? "#d4a72c" : "#5b7fa6";
    };
    var svg = '<svg viewBox="0 0 ' + W4 + " " + H + '" class="au-svg" role="img" aria-label="Site map of ' + n + ' pages" style="width:100%;height:auto;background:var(--card);border:1px solid var(--line);border-radius:12px">' + edges.map(function(e) {
      var a = P[e[0]], b = P[e[1]];
      return '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" stroke="var(--line)" stroke-width="0.6"/>';
    }).join("") + urls.map(function(u, i2) {
      var r = Math.min(n > 100 ? 8 : 12, 3 + Math.sqrt(inDeg[i2]) * 0.9);
      return '<a href="' + safeHref(u) + '" target="_blank" rel="noopener nofollow"><circle cx="' + P[i2].x.toFixed(1) + '" cy="' + P[i2].y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + colour3(u, i2) + '"><title>' + esc2(short(u)) + " \u2013 " + inDeg[i2] + " internal link" + (inDeg[i2] === 1 ? "" : "s") + " in</title></circle></a>";
    }).join("") + "</svg>";
    var orphans = urls.filter(function(u, i2) {
      return !inDeg[i2] && i2 !== home;
    });
    box.innerHTML = svg + '<p class="small">' + n + " pages, " + edges.length + " internal links." + (orphans.length ? " " + orphans.length + " orphan page" + (orphans.length === 1 ? "" : "s") + ": " + orphans.slice(0, 10).map(function(u) {
      return esc2(short(u));
    }).join(", ") + (orphans.length > 10 ? "\u2026" : "") : " No orphan pages.") + " Hover over a dot to see the page; click to open it.</p>";
  }
  function render2(all, html, issues, score) {
    var pg = $("au-progress");
    if (pg) pg.remove();
    var errors = all.filter(function(r) {
      return r.status >= 400 || r.status === 0;
    }).length;
    var avg = html.length ? Math.round(html.reduce(function(t, r) {
      return t + (r.ms || 0);
    }, 0) / html.length) : 0;
    var col = score >= 90 ? "#1a7f37" : score >= 70 ? "#9a6700" : "#cf222e";
    var depthMax = 0;
    state.seen.forEach(function(s, u) {
      if (state.results.has(u) && s.depth != null) depthMax = Math.max(depthMax, s.depth);
    });
    var counts = { critical: 0, high: 0, medium: 0, low: 0 };
    issues.forEach(function(i) {
      counts[i.sev]++;
    });
    var h = '<div class="print-only au-brand"><strong>' + esc2(BRAND2) + "</strong> \xB7 Website audit of " + esc2(state.host) + " \xB7 " + esc2((/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })) + "</div>" + (state.error ? '<div class="card" style="margin-bottom:14px"><p><strong>The crawl stopped early:</strong> ' + esc2(state.error) + " The results below cover the pages checked so far.</p></div>" : "") + '<div class="ck-head"><div class="ring" style="--p:' + score + ";--c:" + col + '" role="img" aria-label="Site score ' + score + ' out of 100"><div><span><b>' + score + '</b><small>site score</small></span></div></div><div><div class="vit"><div><small>Pages checked</small><b>' + all.length + '</b></div><div><small>Errors</small><b class="' + (errors ? "s-fail" : "s-pass") + '">' + errors + "</b></div><div><small>Avg response</small><b>" + (avg / 1e3).toFixed(2) + " s</b></div><div><small>Deepest page</small><b>" + depthMax + ' clicks</b></div></div><div class="ck-stats">' + ["critical", "high", "medium", "low"].map(function(s) {
      return '<span class="pill">' + counts[s] + " " + s + "</span>";
    }).join("") + (state.stopped ? '<span class="pill s-warn">Stopped early</span>' : "") + (all.length >= MAX ? '<span class="pill">Reached the ' + MAX + "-page limit</span>" : "") + '</div></div></div><div class="row noprint" style="margin:18px 0"><button type="button" class="btn" id="au-print">Download PDF report</button><button type="button" class="btn ghost" id="au-csv">Download CSV of all pages</button></div><h2>Issues to fix</h2>' + (issues.length ? issues.map(function(i, n) {
      return '<details class="au-issue"' + (n < 3 ? " open" : "") + '><summary><span class="imp sev-' + i.sev + '">' + i.sev + "</span> " + esc2(i.title) + (i.site ? "" : ' <span class="small">\xB7 ' + i.pages.length + " page" + (i.pages.length === 1 ? "" : "s") + "</span>") + '</summary><p class="fix"><strong>Fix:</strong> ' + esc2(i.fix) + "</p>" + (i.pages.length ? '<ul class="au-urls">' + i.pages.slice(0, 50).map(function(p) {
        return '<li><a href="' + safeHref(p[0]) + '" target="_blank" rel="noopener nofollow">' + esc2(short(p[0])) + '</a> <span class="small">' + esc2(p[1]) + "</span></li>";
      }).join("") + (i.pages.length > 50 ? '<li class="small">\u2026and ' + (i.pages.length - 50) + " more (see the CSV)</li>" : "") + "</ul>" : "") + "</details>";
    }).join("") : "<p>No site-wide issues found \u2013 excellent.</p>") + '<h2>All pages</h2><div class="tablewrap"><table class="au-table"><thead><tr><th>Page</th><th>Status</th><th>Title</th><th>Words</th><th>Depth</th><th>Time</th></tr></thead><tbody>' + all.slice().sort(function(a, b) {
      return a.url < b.url ? -1 : a.url > b.url ? 1 : 0;
    }).map(function(r) {
      var d = (state.seen.get(r.url) || {}).depth;
      return '<tr><td><a href="' + safeHref(r.url) + '" target="_blank" rel="noopener nofollow">' + esc2(short(r.url)) + '</a></td><td class="' + (r.status === 200 ? "s-pass" : r.status >= 300 && r.status < 400 ? "s-warn" : "s-fail") + '">' + esc2(r.status || r.error) + "</td><td>" + esc2(String(r.title || r.type || r.redirect && "\u2192 " + short(r.redirect) || "").slice(0, 70)) + "</td><td>" + esc2(r.words != null ? r.words : "") + "</td><td>" + (d == null ? "\u2013" : esc2(d)) + "</td><td>" + (typeof r.ms === "number" ? (r.ms / 1e3).toFixed(2) + "s" : "") + "</td></tr>";
    }).join("") + '</tbody></table></div><h2 class="noprint">Visual site map</h2><p class="noprint small">How your pages link together. Bigger dots have more internal links pointing at them. <span style="color:#cf222e">\u25CF</span> orphan (nothing links to it) \xB7 <span style="color:#d4a72c">\u25CF</span> 4+ clicks deep \xB7 <span style="color:#0a6f6a">\u25CF</span> home page</p><div class="noprint"><button type="button" class="btn ghost" id="au-map-btn">Show interactive site map</button><div id="au-map"></div></div><p class="small">Crawled ' + all.length + " URLs in " + Math.round((Date.now() - state.startedAt) / 1e3) + " s, following links from the home page and the XML sitemap" + (state.blocked.size ? "; " + state.blocked.size + " URL(s) were skipped because robots.txt disallows them" : ", respecting robots.txt") + ". Scores are a guide, not a guarantee of rankings.</p>";
    $("au-report").innerHTML = h;
    $("au-map-btn").onclick = function() {
      this.remove();
      drawMap(html);
    };
    $("au-print").onclick = function() {
      document.querySelectorAll(".au-issue").forEach(function(d) {
        d.open = true;
      });
      window.print();
    };
    $("au-csv").onclick = function() {
      var rows = [["url", "status", "redirect", "title", "title_px", "description", "h1", "words", "depth", "ms", "noindex", "canonical", "images_no_alt", "json_ld", "inbound_links", "in_sitemap"]];
      all.forEach(function(r) {
        var s = state.seen.get(r.url) || {};
        rows.push([r.url, r.status || r.error, r.redirect || "", r.title || "", r.titlePx || "", r.desc || "", (r.h1 || []).join(" | "), r.words != null ? r.words : "", s.depth == null ? "" : s.depth, r.ms != null ? r.ms : "", r.noindex ? "yes" : "", r.canonical || "", r.imgsNoAlt || 0, r.ld || 0, state.inbound.has(r.url) ? state.inbound.get(r.url).size : 0, state.sitemap.has(r.url) ? "yes" : ""]);
      });
      var cell = function(c) {
        c = String(c == null ? "" : c);
        if (typeof c === "string" && /^[=+\-@\t\r]/.test(c) && !/^-?\d+(\.\d+)?$/.test(c)) c = "'" + c;
        return /[",\n\r]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c;
      };
      var csv = rows.map(function(r) {
        return r.map(cell).join(",");
      }).join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
      a.download = state.host + "-audit.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 5e3);
    };
    window.addEventListener("beforeprint", function() {
      document.querySelectorAll(".au-issue").forEach(function(d) {
        d.open = true;
      });
    });
  }
}

// engine/compare-client.js
function compareApp() {
  "use strict";
  var root = document.getElementById("compare");
  if (!root) return;
  var urls = JSON.parse(root.getAttribute("data-urls") || "[]");
  var esc2 = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var host = function(u) {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch (e) {
      return u;
    }
  };
  var col = function(s) {
    return s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e";
  };
  var results = urls.map(function() {
    return null;
  });
  root.innerHTML = '<div class="vit">' + urls.map(function(u, i) {
    return '<div id="cmp-' + i + '"><small>' + (i ? "Competitor " + i : "Your site") + "</small><b>" + esc2(host(u)) + '</b><small class="cmp-state">Checking\u2026</small></div>';
  }).join("") + '</div><div id="cmp-out"></div>';
  var pending = urls.length;
  urls.forEach(function(u, i) {
    fetch("/api/check?url=" + encodeURIComponent(u)).then(function(r) {
      return r.json().then(function(j) {
        if (!r.ok) throw new Error(j.error || "HTTP " + r.status);
        return j;
      });
    }).then(function(j) {
      results[i] = j;
      document.querySelector("#cmp-" + i + " .cmp-state").innerHTML = '<span style="color:' + col(j.score) + '">' + j.score + "/100</span>";
    }).catch(function(e) {
      results[i] = { error: e.message, url: u };
      document.querySelector("#cmp-" + i + " .cmp-state").innerHTML = '<span class="s-fail">' + esc2(e.message) + "</span>";
    }).then(function() {
      if (--pending === 0) render2();
    });
  });
  function render2() {
    var ok = results.filter(function(r) {
      return r && !r.error;
    });
    if (!ok.length) {
      document.getElementById("cmp-out").innerHTML = "<p>None of the sites could be checked.</p>";
      return;
    }
    var cats = [];
    ok.forEach(function(r) {
      r.categories.forEach(function(c) {
        if (!c.info && cats.indexOf(c.name) < 0) cats.push(c.name);
      });
    });
    var row = function(label, vals, better) {
      var nums = vals.filter(function(v) {
        return typeof v === "number";
      });
      var best = nums.length ? better === "low" ? Math.min.apply(null, nums) : Math.max.apply(null, nums) : null;
      return '<tr><th scope="row">' + esc2(label) + "</th>" + vals.map(function(v) {
        return "<td" + (v === best && nums.length > 1 ? ' class="cmp-best"' : "") + ">" + (v == null ? "\u2013" : typeof v === "number" ? v : esc2(v)) + "</td>";
      }).join("") + "</tr>";
    };
    var get2 = function(f) {
      return results.map(function(r) {
        return r && !r.error ? f(r) : null;
      });
    };
    var catScore = function(r, n) {
      var c = r.categories.filter(function(c2) {
        return c2.name === n;
      })[0];
      return c && !c.info ? c.score : null;
    };
    var h = '<div class="tablewrap"><table class="cmp"><thead><tr><th></th>' + results.map(function(r, i) {
      return '<th scope="col">' + (i ? "Competitor " + i : "You") + '<br><span class="small">' + esc2(host(r.url)) + "</span></th>";
    }).join("") + "</tr></thead><tbody>" + row("Overall SEO score", get2(function(r) {
      return r.score;
    })) + row("AI search readiness", get2(function(r) {
      return r.aiScore;
    })) + cats.filter(function(n) {
      return n !== "AI search readiness";
    }).map(function(n) {
      return row(n, get2(function(r) {
        return catScore(r, n);
      }));
    }).join("") + row("Words on page", get2(function(r) {
      return r.facts.words;
    })) + row("Server response (ms)", get2(function(r) {
      return r.facts.internal ? null : r.facts.ms;
    }), "low") + row("HTML size (kB)", get2(function(r) {
      return Math.round(r.facts.bytes / 1024);
    }), "low") + row("Checks failed", get2(function(r) {
      return r.counts.fail;
    }), "low") + "</tbody></table></div>";
    var me = results[0];
    if (me && !me.error) {
      var beat = [];
      results.slice(1).forEach(function(r, i) {
        if (!r || r.error) return;
        Object.keys(me.checks).forEach(function(k) {
          if (me.checks[k] !== "pass" && r.checks[k] === "pass") beat.push([k, host(r.url), me.checks[k]]);
        });
      });
      var seen = {};
      beat = beat.filter(function(b) {
        if (seen[b[0]]) return false;
        seen[b[0]] = 1;
        return true;
      });
      var ahead = [];
      Object.keys(me.checks).forEach(function(k) {
        if (me.checks[k] === "pass" && results.slice(1).some(function(r) {
          return r && !r.error && r.checks[k] && r.checks[k] !== "pass";
        })) ahead.push(k);
      });
      h += "<h2>Where competitors beat you</h2>" + (beat.length ? '<ul class="chg">' + beat.map(function(b) {
        return '<li><span class="s-fail">' + (b[2] === "fail" ? "\u2717" : "!") + "</span> <strong>" + esc2(b[0]) + '</strong> <span class="small">\u2013 ' + esc2(b[1]) + " passes this</span></li>";
      }).join("") + "</ul>" : "<p>Nowhere \u2013 you match or beat every competitor on every check.</p>") + "<h2>Where you're ahead</h2>" + (ahead.length ? '<ul class="chg">' + ahead.slice(0, 15).map(function(k) {
        return '<li><span class="s-pass">\u2713</span> ' + esc2(k) + "</li>";
      }).join("") + "</ul>" : "<p>No clear advantages yet.</p>") + '<p><a class="btn" href="/seo-checker?url=' + encodeURIComponent(me.url) + '">See your full report and fixes</a></p>';
    }
    h += '<p class="small">Each site is checked on the single page entered. Compare like with like \u2013 home page with home page. Scores are a guide, not a guarantee of rankings.</p>';
    h += '<div id="cmp-gap"></div>';
    document.getElementById("cmp-out").innerHTML = h;
    topicGap();
  }
  function topicGap() {
    var box = document.getElementById("cmp-gap");
    if (!box || urls.length < 2) return;
    var STOP2 = " a an and are as at be but by can do for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to too up us was we were what when which who will with you your yours i'm it's don't you're we're also more most all any each just get got how why where who's here out over about only other some such very can't will'll new use used using one two per via may might must should would could been being both own same ";
    var words = function(t) {
      return (String(t).toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).map(function(w) {
        return w.replace(/[’]/g, "'");
      });
    };
    var phrases = function(t) {
      var w = words(t), c = {};
      for (var n = 1; n <= 3; n++) for (var i = 0; i + n <= w.length; i++) {
        var g = w.slice(i, i + n);
        if (STOP2.indexOf(" " + g[0] + " ") >= 0 || STOP2.indexOf(" " + g[n - 1] + " ") >= 0) continue;
        if (n === 1 && (g[0].length < 4 || /^\d+$/.test(g[0]))) continue;
        var k = g.join(" ");
        c[k] = (c[k] || 0) + 1;
      }
      return c;
    };
    box.innerHTML = "<h2>Topic gap</h2><p>Reading the pages\u2026</p>";
    Promise.all(urls.map(function(u) {
      return fetch("/api/page?url=" + encodeURIComponent(u)).then(function(r) {
        if (r.status === 404) throw new Error("none");
        return r.json();
      }).then(function(j) {
        return j.error ? null : j;
      }, function() {
        return null;
      });
    })).then(function(pages) {
      if (!pages[0]) {
        box.innerHTML = "";
        return;
      }
      var mine = words(pages[0].title + " " + pages[0].h1.join(" ") + " " + pages[0].text).join(" ");
      var gap = {};
      pages.slice(1).forEach(function(p, i) {
        if (!p) return;
        var c = phrases(p.title + " " + p.h1.join(" ") + " " + p.text);
        Object.keys(c).forEach(function(k) {
          if (c[k] < 2 || (" " + mine + " ").indexOf(" " + k + " ") >= 0) return;
          var g = gap[k] || (gap[k] = { n: 0, sites: [] });
          g.n += c[k];
          g.sites.push(i + 1);
        });
      });
      var list = Object.keys(gap).map(function(k) {
        return [k, gap[k]];
      });
      list.sort(function(a, b) {
        return b[1].sites.length - a[1].sites.length || b[1].n * b[0].split(" ").length - a[1].n * a[0].split(" ").length;
      });
      var picked = [];
      list.forEach(function(x) {
        if (picked.length >= 24) return;
        if (picked.some(function(p) {
          return p[0].indexOf(x[0]) >= 0 || x[0].indexOf(p[0]) >= 0;
        })) return;
        picked.push(x);
      });
      box.innerHTML = "<h2>Topic gap: what competitors cover that you don't</h2>" + (picked.length ? '<p class="small">Words and phrases each competitor uses at least twice that never appear on your page. Not every one belongs on your page \u2013 pick the ones your customers would genuinely want answered.</p><ul class="chg">' + picked.map(function(x) {
        return "<li><strong>" + esc2(x[0]) + '</strong> <span class="small">\u2013 used ' + x[1].n + "\xD7 by " + x[1].sites.map(function(s) {
          return "competitor " + s;
        }).join(" and ") + "</span></li>";
      }).join("") + "</ul>" : "<p>No gaps \u2013 your page already covers every topic your competitors repeat.</p>");
    });
  }
}

// engine/checker-ui.js
var AUDIT_JS = `(${auditApp.toString()})();`;
var REPORT_JS = `(${reportApp.toString()})();`;
var AUDIT_MAX = 250;
var COMPARE_JS = `(${compareApp.toString()})();`;
var CHECKER_CSS = `.ck-form{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 6px}.ck-form input{flex:1 1 260px;min-height:52px;font:inherit;font-size:18px;padding:12px 16px;border:2px solid var(--line);border-radius:14px;background:var(--card);color:var(--fg)}.ck-form input:focus{outline:none;border-color:var(--brand)}.ck-form button{min-height:52px;border:0;cursor:pointer;font:inherit;font-size:17px}
.ck-head{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center;margin-top:18px}@media(max-width:640px){.ck-head{grid-template-columns:1fr;justify-items:start}}
.ring{--p:0;--c:var(--brand);width:150px;height:150px;border-radius:50%;background:conic-gradient(var(--c) calc(var(--p)*1%),var(--line) 0);display:grid;place-items:center}.ring>div{width:118px;height:118px;border-radius:50%;background:var(--bg);display:grid;place-items:center;text-align:center;line-height:1.1}.ring b{font-size:40px;letter-spacing:-.02em}.ring small{display:block;color:var(--mute);font-size:13px}
.ck-stats{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}.pill{display:inline-flex;gap:6px;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--line);font-size:14px;font-weight:600}
.s-info{color:var(--mute)}.s-pass{color:#1a7f37}.s-warn{color:#9a6700}.s-fail{color:#cf222e}@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .s-pass{color:#3fb950}:root:not([data-theme=light]) .s-warn{color:#d29922}:root:not([data-theme=light]) .s-fail{color:#ff7b72}}
.bars{display:grid;gap:10px;margin:14px 0}.bar{display:grid;grid-template-columns:minmax(150px,240px) 1fr 44px;gap:12px;align-items:center;font-size:15px}.bar a{color:inherit;text-decoration:none;padding:6px 0}.bar i{display:block;height:10px;border-radius:999px;background:var(--line);overflow:hidden}.bar i span{display:block;height:100%;border-radius:999px}@media(max-width:520px){.bar{grid-template-columns:1fr 44px}.bar i{grid-column:1/3;order:3}}
.fixes{counter-reset:f;list-style:none;padding:0;display:grid;gap:10px}.fixes li{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px}.fixes li::before{counter-increment:f;content:counter(f);display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--brand);color:var(--brand-ink);font-weight:700;font-size:14px;margin-right:8px}.fixes p{margin:6px 0 0;color:var(--mute)}
.imp{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:6px;border:1px solid var(--line);color:var(--mute);margin-left:6px;vertical-align:middle}
.chk{list-style:none;padding:0;margin:0}.chk li{display:grid;grid-template-columns:28px 1fr;gap:6px 10px;padding:14px 0;border-bottom:1px solid var(--line)}.chk .ic{font-weight:800;font-size:18px;line-height:1.4}.chk h4{margin:0;font-size:16px}.chk p{margin:4px 0 0;color:var(--mute);font-size:15px;overflow-wrap:anywhere}.chk .fix{color:var(--fg)}
.catsec{margin-top:34px}.catsec h3{display:flex;justify-content:space-between;gap:12px;font-size:22px;margin:0}.catsec .blurb{color:var(--mute);margin:4px 0 6px}
.vit{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:12px 0}.vit div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px}.vit b{display:block;font-size:24px}.vit small{color:var(--mute)}
.cmp-form{align-items:flex-end}.cmp-l{flex:1 1 220px;display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:600;color:var(--mute)}.cmp-l input{width:100%;flex:none}
#compare .vit b{font-size:18px;overflow-wrap:anywhere}.hero h1{overflow-wrap:anywhere}.cmp{min-width:420px}.cmp th,.cmp td{text-align:center}.cmp th[scope=row]{text-align:left}.cmp-best{font-weight:800;color:#1a7f37}
.au-bar{height:10px;border-radius:999px;background:var(--line);overflow:hidden;margin:10px 0}.au-bar span{display:block;height:100%;width:0;background:var(--brand);transition:width .3s}
.au-issue{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:4px 16px;margin:10px 0}.au-issue summary{padding:12px 0;font-weight:600}.au-issue .fix{margin:0 0 8px}
.au-urls{margin:0 0 12px;padding-left:18px}.au-urls li{margin:4px 0;overflow-wrap:anywhere}.au-urls a{display:inline-block;padding:4px 0}
.sev-critical{color:#cf222e;border-color:currentColor}.sev-high{color:#bc4c00;border-color:currentColor}.sev-medium{color:#9a6700;border-color:currentColor}.sev-low{color:var(--mute)}
.au-table{font-size:14px}.au-table td{overflow-wrap:anywhere}.au-table a{display:inline-block;padding:6px 0}.print-only{display:none}
@media print{header.top,footer,.ck-form,.cta,.noprint,.crumbs{display:none!important}.print-only{display:block;margin-bottom:12px;font-size:14px}body{background:#fff;color:#000}.au-issue,.card{break-inside:avoid}a{color:#000}}`;
var ICON = { pass: "\u2713", warn: "!", fail: "\u2717", info: "i" };
var LABEL = { pass: "Passed", warn: "Warnings", fail: "Failed", info: "For information" };
var colour = (s) => s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e";
var slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
var form = (esc2, value = "") => `<form class="ck-form" action="/seo-checker" method="get" role="search"><label for="ck-url" class="sr">Website address</label><input id="ck-url" name="url" type="text" inputmode="url" autocomplete="url" placeholder="yourwebsite.co.uk" value="${esc2(value)}" required><button class="btn" type="submit">Check my site</button></form>`;
function checkerReport(esc2, BUSINESS, r) {
  const fixes = r.fixes.slice(0, 8);
  return `<div class="wrap hero" style="padding-bottom:20px"><span class="eyebrow">SEO report</span><h1>SEO report for ${esc2(new URL(r.url).hostname)}</h1>
<p class="small" style="overflow-wrap:anywhere">${esc2(r.url)} \xB7 checked ${esc2((/* @__PURE__ */ new Date()).toUTCString().replace(/:\d\d GMT/, " GMT"))}</p>
<div class="ck-head"><div class="ring" style="--p:${r.score};--c:${colour(r.score)}" role="img" aria-label="Overall score ${r.score} out of 100"><div><span><b>${r.score}</b><small>out of 100</small></span></div></div>
<div><div class="ck-stats">${["pass", "warn", "fail"].map((s) => `<span class="pill s-${s}">${ICON[s]} ${r.counts[s]} ${LABEL[s]}</span>`).join("")}<span class="pill">AI readiness ${r.aiScore}%</span></div>
<div class="bars">${r.categories.filter((c) => !c.info).map((c) => `<div class="bar"><a href="#${slug(c.name)}">${esc2(c.name)}</a><i><span style="width:${c.score}%;background:${colour(c.score)}"></span></i><b>${c.score}%</b></div>`).join("")}</div></div></div>
${form(esc2, r.url)}</div>
<section style="padding-top:0"><div class="wrap prose"><h2>Fix these first</h2>${fixes.length ? `<ol class="fixes">${fixes.map((k) => `<li><strong>${esc2(k.name)}</strong><span class="imp">${k.impact}</span><p>${esc2(k.fix || k.notes[0] || "")}</p></li>`).join("")}</ol>` : "<p>Nothing important to fix \u2013 excellent work.</p>"}
<div class="card noprint" style="margin:24px 0"><p class="ct">Check the whole website</p><p>This report covers one page. The full-site audit crawls up to ${AUDIT_MAX} pages to find broken links, duplicate titles, orphan pages and more.</p><a class="btn" href="/site-audit?url=${encodeURIComponent(r.url)}">Run a full-site audit</a></div>
<div class="grid noprint" style="margin:0 0 24px"><div class="card"><p class="ct">Monitor this site weekly</p><p>We'll re-check it every week and track the score, with a history graph and a list of anything that breaks.</p><form method="post" action="/api/monitor"><input type="hidden" name="url" value="${esc2(r.url)}"><button class="btn" type="submit">Start free monitoring</button></form></div><div class="card"><p class="ct">Compare with competitors</p><p>See how this page scores against up to two competitors, side by side, and where they beat you.</p><a class="btn ghost" href="/seo-compare?u=${encodeURIComponent(r.url)}">Compare sites</a></div></div>
<div id="vitals" class="catsec" data-url="${esc2(r.url)}"><h3>Real-world speed <span class="small">Google PageSpeed</span></h3><p class="blurb">Loading Core Web Vitals from Google\u2026 this can take up to 30 seconds.</p></div>
${r.categories.map((c) => `<div class="catsec" id="${slug(c.name)}"><h3>${esc2(c.name)} ${c.info ? '<span class="small">not scored</span>' : `<span style="color:${colour(c.score)}">${c.score}%</span>`}</h3><p class="blurb">${esc2(c.blurb)}</p><ul class="chk">${c.checks.map((k) => `<li><span class="ic s-${k.status}" aria-label="${LABEL[k.status]}">${ICON[k.status]}</span><div><h4>${esc2(k.name)}<span class="imp">${k.impact}</span></h4>${k.notes.map((n) => `<p>${esc2(n)}</p>`).join("")}${k.fix ? `<p class="fix"><strong>Fix:</strong> ${esc2(k.fix)}</p>` : ""}</div></li>`).join("")}</ul></div>`).join("")}
<p class="small noprint" style="margin-top:28px">This report checks one page. Scores are a guide, not a guarantee of rankings. <a href="/seo-checker">Check another page</a> \xB7 <a href="#" id="ck-print">Print or save as PDF</a></p></div></section>
<script src="/assets/report.js" defer></script>`;
}
function reportApp() {
  "use strict";
  var pr = document.getElementById("ck-print");
  if (pr) pr.onclick = function(ev) {
    ev.preventDefault();
    window.print();
  };
  var fo = (location.search.match(/[?&]focus=([a-z-]{2,40})(&|$)/) || [])[1], fe = fo && document.getElementById(fo);
  if (fe && !location.hash) fe.scrollIntoView();
  try {
    var ring = document.querySelector(".ck-head .ring"), sc = ring && (ring.getAttribute("aria-label") || "").match(/\d+/), vb = document.getElementById("vitals");
    if (sc && vb) {
      var list = JSON.parse(localStorage.getItem("seo_recent") || "[]").filter(function(x) {
        return x.u !== vb.getAttribute("data-url");
      });
      list.unshift({ u: vb.getAttribute("data-url"), s: +sc[0], t: Date.now() });
      localStorage.setItem("seo_recent", JSON.stringify(list.slice(0, 12)));
    }
  } catch (e2) {
  }
  var box = document.getElementById("vitals");
  if (!box) return;
  var e = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var cat = { FAST: ["Good", "s-pass"], AVERAGE: ["Needs work", "s-warn"], SLOW: ["Poor", "s-fail"] };
  var col = function(p) {
    return p >= 90 ? "#1a7f37" : p >= 50 ? "#9a6700" : "#cf222e";
  };
  var num = function(x) {
    return typeof x === "number" && isFinite(x);
  };
  function tile(n, v, c) {
    var k = cat[c];
    return "<div><small>" + e(n) + '</small><b class="' + (k ? k[1] : "") + '">' + e(v || "\u2013") + "</b>" + (k ? "<small>" + k[0] + "</small>" : "") + "</div>";
  }
  fetch("/api/vitals?url=" + encodeURIComponent(box.getAttribute("data-url"))).then(function(r) {
    return r.json().catch(function() {
      return { error: "HTTP " + r.status };
    });
  }).then(function(j) {
    if (j.error) {
      var er = new Error(j.error);
      er.quota = j.quota;
      throw er;
    }
    var f = j.field || {}, perf = num(j.performance) ? Math.round(j.performance) : null, lab = j.lab || {};
    var h = "<h3>Real-world speed " + (perf != null ? '<span style="color:' + col(perf) + '">' + perf + "%</span>" : "") + '</h3><p class="blurb">Mobile Lighthouse score from Google PageSpeed Insights' + (f.source ? ", with real Chrome user data for " + e(f.source) + " (75th percentile, last 28 days)." : ". Not enough real-user traffic for Chrome field data yet, so only the lab test is shown.") + "</p>";
    if (f.source) {
      if (f.cwv === true || f.cwv === false) h += '<p><span class="pill ' + (f.cwv ? "s-pass" : "s-fail") + '">Core Web Vitals assessment: ' + (f.cwv ? "Passed" : "Failed") + '</span> <span class="small">Good means LCP \u2264 2.5 s, INP \u2264 200 ms and CLS \u2264 0.1.</span></p>';
      var m = function(x) {
        return x && num(x.p75) ? x : null;
      }, lcp = m(f.lcp), inp = m(f.inp), cls = m(f.cls), ttfb = m(f.ttfb);
      h += '<div class="vit">' + tile("LCP (loading)", lcp && (lcp.p75 / 1e3).toFixed(1) + " s", lcp && lcp.cat) + tile("INP (response)", inp && Math.round(inp.p75) + " ms", inp && inp.cat) + tile("CLS (stability)", cls && (cls.p75 / 100).toFixed(2), cls && cls.cat) + tile("TTFB", ttfb && (ttfb.p75 / 1e3).toFixed(2) + " s", ttfb && ttfb.cat) + "</div>";
    }
    h += '<div class="vit">' + tile("LCP (lab)", lab.lcp) + tile("Total blocking time (lab)", lab.tbt) + tile("CLS (lab)", lab.cls) + tile("First paint (lab)", lab.fcp) + "</div>";
    if (j.opportunities && j.opportunities.length) h += '<ul class="chk">' + j.opportunities.map(function(o) {
      return '<li><span class="ic s-warn">!</span><div><h4>' + e(o.title) + "</h4>" + (o.savings ? "<p>Could save about " + e(o.savings) + "</p>" : "") + "</div></li>";
    }).join("") + "</ul>";
    box.innerHTML = h;
  }).catch(function(err) {
    var psi = "https://pagespeed.web.dev/analysis?url=" + encodeURIComponent(box.getAttribute("data-url"));
    box.innerHTML = "<h3>Real-world speed</h3>" + (err.quota ? `<p class="blurb">Real-world speed data isn't available from this tool today: ` + e(err.message) + ' You can run the same test free on <a href="' + e(psi) + '" target="_blank" rel="noopener">Google PageSpeed Insights</a>.</p>' : `<p class="blurb">Google PageSpeed couldn't be reached (` + e(err.message) + '). Reload the page to try again, or use <a href="' + e(psi) + '" target="_blank" rel="noopener">Google PageSpeed Insights</a> directly.</p>');
  });
}
var cmpForm = (esc2, vals = []) => `<form class="ck-form cmp-form" action="/seo-compare" method="get"><label class="cmp-l">Your website<input name="u" type="text" inputmode="url" placeholder="yourwebsite.co.uk" value="${esc2(vals[0] || "")}" required></label><label class="cmp-l">Competitor 1<input name="u" type="text" inputmode="url" placeholder="competitor.co.uk" value="${esc2(vals[1] || "")}" required></label><label class="cmp-l">Competitor 2 (optional)<input name="u" type="text" inputmode="url" placeholder="another-competitor.co.uk" value="${esc2(vals[2] || "")}"></label><button class="btn" type="submit">Compare</button></form>`;
function comparePage(esc2, urls) {
  return `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">Competitor comparison</span><h1>SEO comparison</h1><p class="lead" style="overflow-wrap:anywhere">${urls.map((u) => `<strong>${esc2(new URL(u).hostname.replace(/^www\./, ""))}</strong>`).join(" vs ")}</p></div><section style="padding-top:0"><div class="wrap prose"><div id="compare" data-urls="${esc2(JSON.stringify(urls))}"></div><noscript><p>The comparison needs JavaScript.</p></noscript>${cmpForm(esc2, urls)}</div></section><script src="/assets/compare.js" defer></script>`;
}
var HOUR = () => Math.floor(Date.now() / 36e5);
var CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'";
var withCsp = (res) => {
  try {
    res.headers.set("content-security-policy", CSP);
  } catch {
  }
  return res;
};
var SELF_UA = /IceWorkSEOChecker/i;
function ipKey(request) {
  const ip = (request.headers.get("cf-connecting-ip") || "anon").toLowerCase();
  if (!ip.includes(":") || ip.includes(".")) return ip;
  const [a, b = ""] = ip.split("::");
  const L = a ? a.split(":") : [], R = b ? b.split(":") : [];
  const full = ip.includes("::") ? [...L, ...Array(Math.max(0, 8 - L.length - R.length)).fill("0"), ...R] : L;
  return full.slice(0, 4).map((x) => x.replace(/^0+(?=.)/, "")).join(":") + "::/64";
}
async function over(name, limit, ttl = 3700) {
  if (typeof caches === "undefined") return false;
  const key = new Request(`https://ratelimit.icework/${encodeURIComponent(name)}`);
  const hit = await caches.default.match(key);
  const n = hit ? +await hit.text() || 0 : 0;
  if (n >= limit) return true;
  await caches.default.put(key, new Response(String(n + 1), { headers: { "cache-control": `max-age=${ttl}` } }));
  return false;
}
var rateLimited = (request, bucket, limit) => over(`${bucket}/${ipKey(request)}/${HOUR()}`, limit);
var overOnce = (name) => over(`${name}/${HOUR()}`, 1);
var te = new TextEncoder();
var b64u = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
var keys = /* @__PURE__ */ new Map();
async function hmac(secret, msg) {
  let k = keys.get(secret);
  if (!k) {
    k = await crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    keys.set(secret, k);
  }
  return b64u(await crypto.subtle.sign("HMAC", k, te.encode(msg)));
}
var generatedSecret = null;
async function secretOf(env) {
  if (env && env.AUDIT_SECRET) return env.AUDIT_SECRET;
  if (generatedSecret) return generatedSecret;
  if (env && env.STATE) {
    let s = await env.STATE.get("audit_secret");
    if (!s) {
      s = b64u(crypto.getRandomValues(new Uint8Array(32)));
      await env.STATE.put("audit_secret", s);
    }
    return generatedSecret = s;
  }
  return "icework-audit-test-only";
}
async function signAudit(secret, origin, now = Date.now()) {
  const p = b64u(te.encode(JSON.stringify({ o: origin, e: Math.floor(now / 1e3) + 3600, n: Math.random().toString(36).slice(2, 10) })));
  return `${p}.${await hmac(secret, p)}`;
}
async function verifyAudit(secret, token, now = Date.now()) {
  const [p, sig] = String(token || "").split(".");
  if (!p || !sig || p.length > 400) return null;
  const good = await hmac(secret, p);
  if (good.length !== sig.length) return null;
  let diff2 = 0;
  for (let i = 0; i < good.length; i++) diff2 |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff2) return null;
  try {
    const j = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    return j && typeof j.o === "string" && j.e * 1e3 > now ? { ...j, sig } : null;
  } catch {
    return null;
  }
}
async function cachedRobots(origin, fetchImpl, ctx) {
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://cache.icework/robots?o=${encodeURIComponent(origin)}`);
  const hit = cache && await cache.match(key);
  if (hit) return hit.headers.get("x-ok") === "1" ? await hit.text() : null;
  const r = await fetchRobots(origin, fetchImpl);
  if (cache) ctx.waitUntil(cache.put(key, new Response(r.text || "", { headers: { "cache-control": "max-age=600", "x-ok": r.text != null ? "1" : "0" } })));
  return r.text;
}
async function handleChecker(request, env, ctx, { layout: layout2, esc: esc2, BUSINESS, page, send: send2, fetchImpl = fetch }) {
  const url = new URL(request.url);
  if (SELF_UA.test(request.headers.get("user-agent") || "")) return Response.json({ error: "The checker doesn't check its own tool pages." }, { status: 403 });
  if (url.pathname === "/api/vitals") {
    let target2;
    try {
      target2 = normaliseUrl(url.searchParams.get("url"));
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    const cache2 = typeof caches !== "undefined" ? caches.default : null;
    const key2 = new Request(`https://cache.icework/vitals?u=${encodeURIComponent(target2.href)}`);
    const hit2 = cache2 && await cache2.match(key2);
    if (hit2) return hit2;
    if (await rateLimited(request, "vitals", 60)) return Response.json({ error: "Too many speed tests from your connection this hour" }, { status: 429 });
    try {
      const res2 = Response.json(await runVitals(target2.href, env && env.PSI_KEY), { headers: { "cache-control": "public, max-age=21600" } });
      if (cache2) ctx.waitUntil(cache2.put(key2, res2.clone()));
      return res2;
    } catch (e) {
      return Response.json({ error: e.message || "PageSpeed unavailable", quota: !!e.quota }, { status: e.quota ? 503 : 502, headers: { "cache-control": "no-store" } });
    }
  }
  if (url.pathname === "/api/audit/start") {
    if (await rateLimited(request, "audit", 40)) return Response.json({ error: "You've started a lot of audits this hour. Please try again later." }, { status: 429 });
    try {
      const s = await crawlStart(url.searchParams.get("url"), fetchImpl);
      return Response.json({ ...s, token: await signAudit(await secretOf(env), s.origin) }, { headers: { "cache-control": "no-store" } });
    } catch (e) {
      return Response.json({ error: e.name === "AbortError" ? "The site took too long to respond." : e.message }, { status: 400 });
    }
  }
  if (url.pathname === "/api/audit/batch") {
    const urls = url.searchParams.getAll("u").slice(0, 6);
    if (!urls.length) return Response.json({ error: "Nothing to check" }, { status: 400 });
    const tok = await verifyAudit(await secretOf(env), url.searchParams.get("t"));
    if (!tok) return Response.json({ error: "This audit session has expired \u2013 reload the page to start again.", expired: true }, { status: 403 });
    let origin;
    try {
      origin = normaliseUrl(tok.o);
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    if (await rateLimited(request, "batch", 2e3)) return Response.json({ error: "Hourly crawl limit reached" }, { status: 429 });
    if (await over(`tok/${tok.sig}`, 70)) return Response.json({ error: "This audit has reached its page limit." }, { status: 429 });
    if (await over(`host/${origin.hostname}/${HOUR()}`, 400)) return Response.json({ error: "This website is being audited a lot right now \u2013 please try again later." }, { status: 429 });
    const robots = await cachedRobots(origin.origin, fetchImpl, ctx);
    return Response.json(await crawlBatch(origin.hostname, urls, fetchImpl, robots), { headers: { "cache-control": "no-store" } });
  }
  if (url.pathname === "/api/check") {
    let target2;
    try {
      target2 = normaliseUrl(url.searchParams.get("url"));
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    const cache2 = typeof caches !== "undefined" ? caches.default : null;
    const key2 = new Request(`https://cache.icework/checkjson?u=${encodeURIComponent(target2.href)}`);
    const hit2 = cache2 && await cache2.match(key2);
    if (hit2) return hit2;
    if (await rateLimited(request, "check", 120)) return Response.json({ error: "Too many checks this hour" }, { status: 429 });
    if (await over(`check-host/${target2.hostname}/${HOUR()}`, 60)) return Response.json({ error: "That site has been checked a lot this hour" }, { status: 429 });
    try {
      const r = await runCheck(target2.href, fetchImpl);
      const checks = {};
      for (const c of r.categories) for (const k of c.checks) if (k.status !== "info") checks[`${c.name} \u203A ${k.name}`] = k.status;
      const res2 = Response.json({ url: r.url, score: r.score, aiScore: r.aiScore, counts: r.counts, categories: r.categories.map((c) => ({ name: c.name, score: c.score, info: !!c.info })), facts: r.facts, checks }, { headers: { "cache-control": "public, max-age=3600" } });
      if (cache2) ctx.waitUntil(cache2.put(key2, res2.clone()));
      return res2;
    } catch (e) {
      return Response.json({ error: e.name === "AbortError" ? "Took too long to respond" : (e.message || "Couldn't be reached").slice(0, 160) }, { status: 502 });
    }
  }
  if (url.pathname === "/seo-compare") {
    const us = [];
    for (const v of url.searchParams.getAll("u").slice(0, 3)) {
      if (!v.trim()) continue;
      try {
        us.push(normaliseUrl(v).href);
      } catch (e) {
        return null;
      }
    }
    if (us.length < 2) return null;
    return withCsp(send2(layout2({ ...page("compare"), noindex: true, title: `SEO comparison: ${us.map((u) => new URL(u).hostname).join(" vs ")}`, body: comparePage(esc2, [...new Set(us)]) }), "text/html; charset=utf-8", 200, "no-store"));
  }
  if (url.pathname === "/site-audit") {
    const q2 = url.searchParams.get("url");
    let target2;
    try {
      target2 = normaliseUrl(q2);
    } catch (e) {
      return null;
    }
    const host = target2.hostname;
    return withCsp(send2(layout2({ ...page("audit"), noindex: true, title: `Full-site SEO audit: ${host}`, body: `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">Site audit</span><h1>Full-site audit for ${esc2(host)}</h1><p class="small" style="overflow-wrap:anywhere">${esc2(target2.href)} \xB7 up to ${AUDIT_MAX} pages</p></div><section style="padding-top:0"><div class="wrap"><div id="audit" data-url="${esc2(target2.href)}" data-max="${AUDIT_MAX}" data-brand="${esc2(BUSINESS.fullName)} \xB7 ${esc2(BUSINESS.domain)}"></div><noscript><p>The site audit needs JavaScript. You can still use the <a href="/seo-checker?url=${encodeURIComponent(target2.href)}">single-page SEO checker</a>.</p></noscript></div></section><script src="/assets/audit.js" defer></script>` }), "text/html; charset=utf-8", 200, "no-store"));
  }
  if (url.pathname !== "/seo-checker") return null;
  const q = url.searchParams.get("url");
  if (!q) return send2(layout2(page("landing")), "text/html; charset=utf-8");
  const errPage = (msg, status) => withCsp(send2(layout2({ ...page("landing"), noindex: true, body: `<div class="wrap hero"><span class="eyebrow">SEO checker</span><h1>We couldn't check that page</h1><p class="lead">${esc2(msg)}</p>${form(esc2, q.slice(0, 300))}</div>` }), "text/html; charset=utf-8", status, "no-store"));
  let target;
  try {
    target = normaliseUrl(q);
  } catch (e) {
    return errPage(e.message, 400);
  }
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`https://cache.icework/report?u=${encodeURIComponent(target.href)}`);
  const hit = cache && await cache.match(key);
  if (hit) return hit;
  if (await rateLimited(request, "check", 120)) return errPage("You've run a lot of checks this hour. Please try again a little later.", 429);
  if (await over(`check-host/${target.hostname}/${HOUR()}`, 60)) return errPage("That website has been checked a lot in the last hour. Please try again later.", 429);
  let report;
  try {
    report = await runCheck(target.href, fetchImpl);
  } catch (e) {
    return errPage(e.name === "AbortError" ? "The site took too long to respond (over 10 seconds)." : e.message || "The site could not be reached.", 502);
  }
  const res = withCsp(send2(layout2({ ...page("report"), noindex: true, title: `SEO report: ${new URL(report.url).hostname} scores ${report.score}/100`, body: checkerReport(esc2, BUSINESS, report) }), "text/html; charset=utf-8", 200, "public, max-age=3600"));
  if (cache) ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

// engine/monitor.js
var OWN_SITES = ["https://icework.co.uk/", "https://teslachargers.co.uk/", "https://pubg.uk/", "https://polarisapartments.co.uk/", "https://bizenergy.co.uk/", "https://rockfactory.uk/"];
var WEEK = 7 * 864e5;
var DAY = 864e5;
var MAX_MONITORS = 200;
var MAX_HISTORY = 60;
var ownId = (u) => "own-" + new URL(u).hostname.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
var randomId = () => {
  const b = crypto.getRandomValues(new Uint8Array(12));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
var validId = (id) => /^(own-[a-z0-9-]{3,80}|[A-Za-z0-9_-]{16})$/.test(id || "");
function snapshot(r, t = Date.now()) {
  const checks = {};
  for (const c of r.categories) for (const k of c.checks) if (k.status !== "info") checks[`${c.name} \u203A ${k.name}`] = k.status;
  return { t, score: r.score, ai: r.aiScore, cats: Object.fromEntries(r.categories.filter((c) => !c.info).map((c) => [c.name, c.score])), checks, ms: r.facts.ms, words: r.facts.words, title: (r.facts.title || "").slice(0, 120) };
}
function diff(prev, cur) {
  if (!prev || !cur || prev.error || cur.error) return { worse: [], better: [] };
  const rank = { pass: 0, warn: 1, fail: 2 };
  const worse = [], better = [];
  for (const [k, s] of Object.entries(cur.checks || {})) {
    const p = (prev.checks || {})[k];
    if (p == null) continue;
    if (rank[s] > rank[p]) worse.push([k, p, s]);
    else if (rank[s] < rank[p]) better.push([k, p, s]);
  }
  return { worse, better };
}
async function getIndex(env) {
  return await env.STATE.get("mon:index", "json") || [];
}
async function putIndex(env, idx) {
  await env.STATE.put("mon:index", JSON.stringify(idx));
}
async function getMonitor(env, id) {
  return validId(id) ? await env.STATE.get("mon:" + id, "json") : null;
}
async function createMonitor(env, input2) {
  const u = normaliseUrl(input2);
  const idx = await getIndex(env);
  const existing = idx.find((m) => m.url === u.href);
  if (existing) return existing.id;
  if (idx.length >= MAX_MONITORS) throw new Error("Monitoring is full right now. Please try again in a few days.");
  const id = OWN_SITES.includes(u.href) ? ownId(u.href) : randomId();
  const now = Date.now();
  await env.STATE.put("mon:" + id, JSON.stringify({ id, url: u.href, host: u.hostname, created: now, history: [] }));
  idx.push({ id, url: u.href, next: now });
  await putIndex(env, idx);
  return id;
}
async function runMonitor(env, id, fetchImpl) {
  const m = await getMonitor(env, id);
  if (!m) return null;
  let snap;
  try {
    snap = snapshot(await runCheck(m.url, fetchImpl));
  } catch (e) {
    snap = { t: Date.now(), error: (e && e.message || "Check failed").slice(0, 200) };
  }
  m.history = [...m.history || [], snap].slice(-MAX_HISTORY);
  m.lastRun = snap.t;
  await env.STATE.put("mon:" + id, JSON.stringify(m));
  const idx = await getIndex(env);
  const row = idx.find((x) => x.id === id);
  if (row) {
    row.next = snap.t + (snap.error ? DAY : WEEK);
    await putIndex(env, idx);
  }
  return m;
}
async function runDueMonitors(env, fetchImpl, own = OWN_SITES) {
  if (!env || !env.STATE) return "no KV";
  let idx = await getIndex(env);
  const missing = own.filter((u) => !idx.some((m2) => m2.url === u));
  if (missing.length) {
    for (const u of missing) await createMonitor(env, u);
    idx = await getIndex(env);
  }
  const due = idx.filter((m2) => m2.next <= Date.now()).sort((a, b) => a.next - b.next)[0];
  if (!due) return "nothing due";
  const m = await runMonitor(env, due.id, fetchImpl);
  return m ? `checked ${m.url}: ${m.history.at(-1).error ? "error" : m.history.at(-1).score}` : "missing";
}
var colour2 = (s) => s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e";
var fmt = (t) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
function chart(esc2, hist) {
  const pts = hist.filter((h) => !h.error);
  if (pts.length < 2) return `<p class="small">The history graph appears after the second weekly check.</p>`;
  const W3 = 640, H = 220, L = 34, R = 10, T = 12, B = 28;
  const x = (i) => L + i * (W3 - L - R) / (pts.length - 1), y = (v) => T + (100 - v) * (H - T - B) / 100;
  const line = (key, cls) => `<polyline class="${cls}" fill="none" stroke-width="3" points="${pts.map((p, i) => `${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ")}"/>` + pts.map((p, i) => `<circle class="${cls}" cx="${x(i).toFixed(1)}" cy="${y(p[key]).toFixed(1)}" r="3.5"><title>${esc2(fmt(p.t))}: ${p[key]}</title></circle>`).join("");
  const grid = [0, 50, 70, 90, 100].map((v) => `<line x1="${L}" x2="${W3 - R}" y1="${y(v)}" y2="${y(v)}" class="mg"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="mt">${v}</text>`).join("");
  const labels = [0, pts.length - 1].map((i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="${i ? "end" : "start"}" class="mt">${esc2(fmt(pts[i].t))}</text>`).join("");
  return `<svg class="mchart" viewBox="0 0 ${W3} ${H}" role="img" aria-label="Score history: overall from ${pts[0].score} to ${pts.at(-1).score}">${grid}${labels}${line("ai", "ml2")}${line("score", "ml1")}</svg><p class="small"><span class="key k1"></span> Overall score <span class="key k2"></span> AI readiness</p>`;
}
var MONITOR_CSS = `.mchart{width:100%;height:auto;margin:8px 0}.mchart .mg{stroke:var(--line)}.mchart .mt{fill:var(--mute);font-size:12px}.ml1{stroke:var(--brand);fill:var(--brand)}.ml2{stroke:#2f6fb3;fill:#2f6fb3}.mchart polyline{fill:none}.key{display:inline-block;width:14px;height:4px;border-radius:2px;vertical-align:middle;margin:0 4px 0 10px}.k1{background:var(--brand)}.k2{background:#2f6fb3}
.mtable td,.mtable th{white-space:nowrap}.chg{list-style:none;padding:0;margin:8px 0}.chg li{padding:8px 0;border-bottom:1px solid var(--line)}`;
function dashboard(esc2, m) {
  const hist = m.history || [], last = hist.filter((h) => !h.error).at(-1), prevOk = hist.filter((h) => !h.error).at(-2);
  const lastAny = hist.at(-1);
  const { worse, better } = diff(prevOk, last);
  const next = lastAny ? lastAny.t + (lastAny.error ? DAY : WEEK) : Date.now();
  const head = `<div class="wrap hero" style="padding-bottom:16px"><span class="eyebrow">SEO monitoring</span><h1>Weekly SEO monitor: ${esc2(m.host)}</h1><p class="small" style="overflow-wrap:anywhere">${esc2(m.url)} \xB7 monitoring since ${esc2(fmt(m.created))} \xB7 next check around ${esc2(fmt(next))}</p><p class="small">Bookmark this page \u2013 it's your private dashboard. Anyone with the link can view it.</p></div>`;
  if (!last) return head + `<section style="padding-top:0"><div class="wrap prose"><div class="card"><p class="ct">${lastAny ? "The last check couldn't reach the site" : "First check queued"}</p><p>${lastAny ? esc2(lastAny.error) + " \u2013 we'll try again within a day." : "The first check runs within the next few hours. You can also run it now."}</p><form method="post" action="/api/monitor/${esc2(m.id)}/run"><button class="btn" type="submit">Run a check now</button></form></div></div></section>`;
  const cats = Object.entries(last.cats).map(([n, s]) => {
    const p = prevOk && prevOk.cats[n];
    const d = p != null ? s - p : 0;
    return `<div class="bar"><span>${esc2(n)}</span><i><span style="width:${s}%;background:${colour2(s)}"></span></i><b>${s}%${d ? ` <small class="${d > 0 ? "s-pass" : "s-fail"}">${d > 0 ? "\u25B2" : "\u25BC"}${Math.abs(d)}</small>` : ""}</b></div>`;
  }).join("");
  const change = (list, cls, word) => list.map(([k, a, b]) => `<li><span class="${cls}">${word}</span> ${esc2(k)} <span class="small">(${a} \u2192 ${b})</span></li>`).join("");
  return head + `<section style="padding-top:0"><div class="wrap prose">
<div class="ck-head"><div class="ring" style="--p:${last.score};--c:${colour2(last.score)}" role="img" aria-label="Latest score ${last.score}"><div><span><b>${last.score}</b><small>latest score</small></span></div></div>
<div><div class="ck-stats"><span class="pill">AI readiness ${last.ai}%</span><span class="pill">Checked ${esc2(fmt(last.t))}</span>${prevOk ? last.score === prevOk.score ? `<span class="pill">No change since ${esc2(fmt(prevOk.t))}</span>` : `<span class="pill ${last.score > prevOk.score ? "s-pass" : "s-fail"}">${last.score > prevOk.score ? "\u25B2" : "\u25BC"} ${Math.abs(last.score - prevOk.score)} since ${esc2(fmt(prevOk.t))}</span>` : ""}</div><div class="bars">${cats}</div></div></div>
<h2>Score history</h2>${chart(esc2, hist)}
<h2>What changed since the previous check</h2>${prevOk ? worse.length || better.length ? `<ul class="chg">${change(worse, "s-fail", "New problem:")}${change(better, "s-pass", "Fixed:")}</ul>` : "<p>No changes \u2013 everything that passed still passes.</p>" : "<p>Changes will show here after the second check.</p>"}
<div class="row noprint" style="margin:20px 0"><a class="btn" href="/seo-checker?url=${encodeURIComponent(m.url)}">See the full report</a><form method="post" action="/api/monitor/${esc2(m.id)}/run" style="display:inline"><button class="btn ghost" type="submit">Run a check now</button></form></div>
<h2>Check history</h2><div class="tablewrap"><table class="mtable"><thead><tr><th>Date</th><th>Score</th><th>AI</th><th>Response</th><th>Words</th></tr></thead><tbody>${hist.slice().reverse().map((h) => h.error ? `<tr><td>${esc2(fmt(h.t))}</td><td colspan="4" class="s-fail">${esc2(h.error)}</td></tr>` : `<tr><td>${esc2(fmt(h.t))}</td><td style="color:${colour2(h.score)}"><b>${h.score}</b></td><td>${h.ai}%</td><td>${h.ms} ms</td><td>${h.words}</td></tr>`).join("")}</tbody></table></div>
<p class="small">Checks run automatically once a week. Scores are a guide, not a guarantee of rankings.</p></div></section>`;
}

// src/site.js
var BRAND = { name: "XKey", fullName: "XKey", domain: "xkey.co.uk", tagline: "Free SEO & AI search check", maker: "IceWork", makerUrl: "https://icework.co.uk", email: "iceworks@f1rst.co.uk", price: 350, town: "Blackpool" };
var SITE = `https://${BRAND.domain}`;
var UPDATED = "2026-10-10";
var esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var CSS = `:root{--bg:#f6f8fb;--fg:#0e1726;--mute:#526077;--line:#dde3ec;--card:#fff;--brand:#0a6f6a;--brand-ink:#fff;--soft:#dcf1ef;--hero:#0e1726;--hero-fg:#eef3fa}
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
a.card{text-decoration:none;display:block}a.card:hover{border-color:var(--brand)}a.card .ct::after{content:" \u2192";color:var(--brand)}
.prose>*{max-width:46em}.prose h2{margin-top:36px}
.crumbs{font-size:14px;color:var(--mute);padding-top:16px}.crumbs a{color:var(--mute);display:inline-block;padding:12px 0;min-width:44px}
.cta{background:var(--hero);color:var(--hero-fg);border-radius:20px;padding:36px;margin:40px 0}.cta h2,.cta .ct{color:var(--hero-fg)!important}.cta p{color:var(--hero-fg);opacity:.85}
.tablewrap{overflow-x:auto}table{border-collapse:collapse;width:100%;margin:12px 0}th,td{text-align:left;vertical-align:top;padding:10px 12px;border-bottom:1px solid var(--line)}th{font-size:15px}
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
.free{display:flex;flex-wrap:wrap;gap:6px 18px;list-style:none;padding:0;margin:14px 0 0;font-size:15px;font-weight:600;color:var(--fg)}.free li::before{content:"\u2713 ";color:var(--brand)}
.ogc{border:1px solid var(--line);border-radius:12px;overflow:hidden;max-width:520px;background:var(--card)}.ogi{aspect-ratio:1.91/1;background:var(--line) center/cover no-repeat}.ogn{display:flex;align-items:center;justify-content:center;color:var(--mute);font-size:14px}.ogt{padding:10px 14px;display:flex;flex-direction:column;gap:2px;font-family:Arial,sans-serif}.ogt span{font-size:12px;color:var(--mute)}.ogt b{font-size:16px}.ogt small{font-size:14px;color:var(--mute)}
.tool .row>div{min-width:0}
.prose code{overflow-wrap:anywhere}pre{max-width:100%;overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;font-size:14px;line-height:1.5}pre code{overflow-wrap:normal;white-space:pre}
@media (max-width:640px){.nav{gap:0;min-height:0}.nav ul{margin:0 -20px;padding:0 20px;width:calc(100% + 40px);flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:0 18px}.nav ul::-webkit-scrollbar{display:none}.nav ul a{white-space:nowrap;font-size:15px}.hero{padding-top:28px;padding-bottom:28px}.hero h1{font-size:34px}.lead{font-size:18px}.cta{padding:26px}}`;
var NAV = [["/", "SEO check"], ["/ai-seo-checker", "AI SEO checker"], ["/website-audit", "Site audit"], ["/seo-comparison", "Compare"], ["/seo-tools", "All tools"], ["/guides", "Guides"]];
var FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0e1726"/><path d="M14 16l12 16-12 16h9l7.5-10L38 48h9L35 32l12-16h-9l-7.5 10L23 16z" fill="#3fd0c9"/></svg>`;
function jsonld(p) {
  const url = SITE + p.path;
  const g = [
    { "@type": "Organization", "@id": `${SITE}/#org`, name: BRAND.name, url: `${SITE}/`, logo: `${SITE}/favicon.svg`, email: BRAND.email, parentOrganization: { "@type": "Organization", "@id": "https://icework.co.uk/#business", name: BRAND.maker, url: BRAND.makerUrl + "/" } },
    { "@type": "WebSite", "@id": `${SITE}/#site`, url: `${SITE}/`, name: BRAND.name, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" },
    p.app ? { "@type": "WebApplication", "@id": `${url}#app`, name: p.app, url, applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" }, publisher: { "@id": `${SITE}/#org` } } : p.article ? { "@type": "Article", "@id": `${url}#page`, headline: p.h1, description: p.desc, url, dateModified: UPDATED, datePublished: UPDATED, author: { "@id": `${SITE}/#org` }, publisher: { "@id": `${SITE}/#org` }, inLanguage: "en-GB" } : { "@type": "WebPage", "@id": `${url}#page`, url, name: p.title, description: p.desc, isPartOf: { "@id": `${SITE}/#site` }, dateModified: UPDATED }
  ];
  if (p.itemList) g.push({ "@type": "ItemList", name: "Free SEO tools", itemListElement: p.itemList.map(([path, name], i) => ({ "@type": "ListItem", position: i + 1, name, url: SITE + path })) });
  if (p.path !== "/") g.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }, ...p.parent ? [{ "@type": "ListItem", position: 2, name: p.parent[1], item: SITE + p.parent[0] }] : [], { "@type": "ListItem", position: p.parent ? 3 : 2, name: p.crumb, item: url }] });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": g }).replace(/</g, "\\u003c");
}
function layout(p) {
  const url = SITE + p.path;
  const nav = NAV.map(([h, t]) => `<li><a href="${h}"${h === p.path ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  const crumbs = p.path === "/" ? "" : `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a> / ${p.parent ? `<a href="${p.parent[0]}">${esc(p.parent[1])}</a> / ` : ""}${esc(p.crumb || "")}</nav>`;
  const maker = p.noindex ? `<div class="wrap"><div class="maker noprint"><p><strong>Want these fixed for you?</strong> XKey is made by <a href="${BRAND.makerUrl}/" rel="noopener">${BRAND.maker}</a>, a ${BRAND.town} web studio. IceWork builds fast websites that pass every check here \u2013 a 3-page site with domain and a year's hosting is \xA3${BRAND.price} all in.</p></div></div>` : "";
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.desc)}"><link rel="canonical" href="${url}">
<meta name="robots" content="${p.noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${BRAND.name}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/og.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#0e1726">
<style>${CSS}</style><script type="application/ld+json">${jsonld(p)}</script></head><body>
<header class="top"><div class="wrap nav"><a class="logo" href="/" aria-label="XKey home">X<b>Key</b></a><ul>${nav}</ul></div></header>
${crumbs}<main>${p.body}${maker}</main>
<footer><div class="wrap"><div class="cols">
<div><a class="logo" href="/">X<b>Key</b></a><p>${BRAND.tagline}. No cost, no sign-up, no email, no subscription. Built in the UK.</p><p class="small">Made by <a href="${BRAND.makerUrl}" rel="noopener">${BRAND.maker}</a>, ${BRAND.town}.</p></div>
<div><strong>SEO checks</strong><ul><li><a href="/">Free SEO check</a></li><li><a href="/ai-seo-checker">AI SEO checker</a></li><li><a href="/website-audit">Website audit</a></li><li><a href="/seo-comparison">Competitor comparison</a></li><li><a href="/seo-monitoring">SEO monitoring</a></li></ul></div>
<div><strong>Free tools</strong><ul><li><a href="/title-tag-checker">Title tag checker</a></li><li><a href="/robots-txt-tester">robots.txt tester</a></li><li><a href="/llms-txt-generator">llms.txt generator</a></li><li><a href="/meta-tag-generator">Meta tag generator</a></li><li><a href="/xml-sitemap-generator">Sitemap generator</a></li><li><a href="/keyword-generator">Keyword generator</a></li><li><a href="/ai-meta-description-generator">AI description writer</a></li><li><a href="/keyword-difficulty-checker">Keyword difficulty</a></li><li><a href="/plagiarism-checker">Plagiarism checker</a></li><li><a href="/word-counter">Word counter</a></li><li><a href="/seo-tools">All 30 SEO tools</a></li></ul></div>
<div><strong>XKey</strong><ul><li><a href="/guides">SEO guides</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li><li><a href="mailto:${BRAND.email}">${BRAND.email}</a></li><li><a href="/privacy">Privacy</a></li></ul></div>
</div><p class="small">\xA9 ${UPDATED.slice(0, 4)} ${BRAND.name}. Scores are a guide, not a guarantee of rankings.</p></div></footer></body></html>`;
}
var SECURITY = { "strict-transport-security": "max-age=63072000; includeSubDomains; preload", "x-content-type-options": "nosniff", "referrer-policy": "strict-origin-when-cross-origin", "x-frame-options": "DENY", "permissions-policy": "camera=(), microphone=(), geolocation=()" };
var send = (body, type, status = 200, cache = "public, max-age=300") => new Response(body, { status, headers: { "content-type": type, "cache-control": cache, ...SECURITY } });

// src/tools-client.js
function toolsApp() {
  "use strict";
  var $ = function(id) {
    return document.getElementById(id);
  };
  var esc2 = function(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var px = function(s, size) {
    var t = 0;
    for (var ch of String(s)) t += W[ch] == null ? 1139 : W[ch];
    return Math.round(t / 2048 * size);
  };
  var cut = function(s, size, max) {
    var out = "", t = 0;
    for (var ch of String(s)) {
      t += (W[ch] == null ? 1139 : W[ch]) / 2048 * size;
      if (t > max - 12) return out.replace(/\s+\S*$/, "") + " \u2026";
      out += ch;
    }
    return out;
  };
  var col = function(ok, near) {
    return ok ? "#1a7f37" : near ? "#9a6700" : "#cf222e";
  };
  var ti = $("tt-title");
  if (ti) {
    var de = $("tt-desc"), ur = $("tt-url");
    var meter = function(id, w, lo, hi) {
      var ok = w >= lo && w <= hi, near = w > 0 && w <= hi * 1.07;
      $(id).innerHTML = '<div class="meter" role="img" aria-label="' + w + " of " + hi + ' pixels"><span style="width:' + Math.min(100, w / hi * 100) + "%;background:" + col(ok, near) + '"></span></div><span class="small">' + w + " px of about " + hi + " px" + (w > hi ? " \u2013 Google will probably cut this off" : w && w < lo ? " \u2013 short; you have room to say more" : w ? " \u2013 good length" : "") + "</span>";
    };
    var upd = function() {
      var t = ti.value.trim(), d = de.value.trim(), u = ur.value.trim() || "yourwebsite.co.uk";
      var tw = px(t, 20), dw = px(d, 14);
      meter("tt-tm", tw, 250, 580);
      meter("tt-dm", dw, 500, 990);
      $("tt-tc").textContent = t.length + " characters";
      $("tt-dc").textContent = d.length + " characters";
      var host = u.replace(/^https?:\/\//, "").replace(/\/.*$/, ""), crumbs = u.replace(/^https?:\/\//, "").split("/").filter(Boolean).slice(1).join(" \u203A ");
      $("tt-serp").innerHTML = '<div class="u">' + esc2(host) + (crumbs ? " \u203A " + esc2(crumbs) : "") + '</div><div class="t">' + esc2(tw > 580 ? cut(t, 20, 580) : t || "Your page title") + '</div><div class="d">' + esc2(dw > 990 ? cut(d, 14, 990) : d || "Your meta description will appear here. If you leave it out, Google writes one from your page text.") + "</div>";
    };
    [ti, de, ur].forEach(function(el) {
      el.addEventListener("input", upd);
    });
    upd();
  }
  var rf = $("rt-form");
  if (rf) {
    var show = function(h) {
      $("rt-out").innerHTML = h;
    };
    rf.addEventListener("submit", function(ev) {
      ev.preventDefault();
      show("<p>Testing\u2026</p>");
      fetch("/api/robots-test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ robots: $("rt-robots").value, url: $("rt-url").value, agent: $("rt-agent").value }) }).then(function(r) {
        return r.json();
      }).then(function(j) {
        if (j.error) return show('<p class="s-fail">' + esc2(j.error) + "</p>");
        show('<p style="font-size:20px"><strong class="' + (j.allowed ? "s-pass" : "s-fail") + '">' + (j.allowed ? "\u2713 Allowed" : "\u2717 Blocked") + "</strong> for " + esc2(j.agentName) + " on <code>" + esc2(j.path) + '</code></p><div class="tablewrap"><table><thead><tr><th>Crawler</th><th>Used for</th><th>Result</th></tr></thead><tbody>' + j.all.map(function(a) {
          return "<tr><td>" + esc2(a.name) + "</td><td>" + esc2(a.use) + '</td><td class="' + (a.allowed ? "s-pass" : "s-fail") + '">' + (a.allowed ? "Allowed" : "Blocked") + "</td></tr>";
        }).join("") + "</tbody></table></div>");
      }).catch(function() {
        show(`<p class="s-fail">Couldn't run the test \u2013 please try again.</p>`);
      });
    });
    var lb = $("rt-load");
    if (lb) lb.addEventListener("click", function() {
      var u = $("rt-url").value.trim();
      if (!u) {
        $("rt-url").focus();
        return;
      }
      lb.disabled = true;
      lb.textContent = "Loading\u2026";
      fetch("/api/robots?url=" + encodeURIComponent(u)).then(function(r) {
        return r.json();
      }).then(function(j) {
        if (j.error) show('<p class="s-fail">' + esc2(j.error) + "</p>");
        else {
          $("rt-robots").value = j.text;
          show('<p class="small">Loaded robots.txt from ' + esc2(j.origin) + " (HTTP " + j.status + ").</p>");
        }
      }).catch(function() {
        show(`<p class="s-fail">Couldn't load robots.txt.</p>`);
      }).then(function() {
        lb.disabled = false;
        lb.textContent = "Load from the website";
      });
    });
  }
  var lf = $("lt-form");
  if (lf) {
    var gen = function() {
      var name = $("lt-name").value.trim() || "Your business", sum = $("lt-sum").value.trim(), site = $("lt-site").value.trim().replace(/\/+$/, "");
      if (site && !/^https?:\/\//i.test(site)) site = "https://" + site;
      var abs = function(u) {
        u = u.trim();
        return /^https?:\/\//i.test(u) ? u : site + "/" + u.replace(/^\/+/, "");
      };
      var lines = $("lt-pages").value.split(/\n/).map(function(l) {
        return l.split("|").map(function(x) {
          return x.trim();
        });
      }).filter(function(p) {
        return p[0] && p[1];
      });
      var out = "# " + name + "\n\n" + (sum ? "> " + sum.replace(/\s+/g, " ") + "\n\n" : "") + ($("lt-about").value.trim() ? $("lt-about").value.trim() + "\n\n" : "") + (lines.length ? "## Key pages\n\n" + lines.map(function(p) {
        return "- [" + p[0] + "](" + abs(p[1]) + ")" + (p[2] ? ": " + p[2] : "");
      }).join("\n") + "\n" : "");
      $("lt-out").textContent = out;
      var a = $("lt-dl");
      a.href = URL.createObjectURL(new Blob([out], { type: "text/plain" }));
      return out;
    };
    lf.addEventListener("input", gen);
    lf.addEventListener("submit", function(ev) {
      ev.preventDefault();
      gen();
    });
    $("lt-copy").addEventListener("click", function() {
      var t = gen(), b = $("lt-copy");
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function() {
        b.textContent = "Copied";
      }, function() {
        b.textContent = "Select the text and copy";
      });
      setTimeout(function() {
        b.textContent = "Copy";
      }, 2e3);
    });
    gen();
  }
  var val = function(id) {
    var el = $(id);
    return el ? el.value.trim() : "";
  };
  var attr3 = function(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  };
  var absUrl = function(u) {
    u = String(u || "").trim();
    if (!u) return "";
    return /^https?:\/\//i.test(u) ? u : "https://" + u.replace(/^\/+/, "");
  };
  var copyBtn = function(btnId, outId) {
    var b = $(btnId);
    if (!b) return;
    b.addEventListener("click", function() {
      var t = $(outId).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function() {
        b.textContent = "Copied";
      }, function() {
        b.textContent = "Select the text and copy";
      });
      setTimeout(function() {
        b.textContent = "Copy";
      }, 2e3);
    });
  };
  var live = function(formId, fn) {
    var f = $(formId);
    if (!f) return;
    f.addEventListener("input", fn);
    f.addEventListener("change", fn);
    f.addEventListener("submit", function(ev) {
      ev.preventDefault();
      fn();
    });
    fn();
  };
  var download = function(aId, text2, type) {
    var a = $(aId);
    if (a) a.href = URL.createObjectURL(new Blob([text2], { type: type || "text/plain" }));
  };
  live("mt-form", function() {
    var t = val("mt-title"), d = val("mt-desc"), u = absUrl(val("mt-url")), img = absUrl(val("mt-img")), idx = $("mt-index").checked;
    var tw = px(t, 20), dw = px(d, 14);
    $("mt-tm").innerHTML = '<span class="small" style="color:' + col(tw && tw <= 580, tw <= 620) + '">Title: ' + tw + " px of ~580 px</span>";
    $("mt-dm").innerHTML = '<span class="small" style="color:' + col(dw >= 500 && dw <= 990, dw && dw <= 1060) + '">Description: ' + dw + " px of ~990 px</span>";
    var L = ['<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">'];
    if (t) L.push("<title>" + attr3(t) + "</title>");
    if (d) L.push('<meta name="description" content="' + attr3(d) + '">');
    if (u) L.push('<link rel="canonical" href="' + attr3(u) + '">');
    L.push('<meta name="robots" content="' + (idx ? "index, follow, max-image-preview:large" : "noindex, follow") + '">');
    if (t) L.push('<meta property="og:title" content="' + attr3(t) + '">');
    if (d) L.push('<meta property="og:description" content="' + attr3(d) + '">');
    if (u) L.push('<meta property="og:url" content="' + attr3(u) + '">');
    L.push('<meta property="og:type" content="website">');
    if (img) {
      L.push('<meta property="og:image" content="' + attr3(img) + '">');
      L.push('<meta name="twitter:card" content="summary_large_image">');
    }
    $("mt-out").textContent = L.join("\n");
  });
  copyBtn("mt-copy", "mt-out");
  live("og-form", function() {
    var t = val("og-title"), d = val("og-desc"), u = absUrl(val("og-url")), img = absUrl(val("og-img")), site = val("og-site"), type = $("og-type").value;
    var L = [];
    L.push('<meta property="og:type" content="' + attr3(type) + '">');
    if (t) L.push('<meta property="og:title" content="' + attr3(t) + '">');
    if (d) L.push('<meta property="og:description" content="' + attr3(d) + '">');
    if (u) L.push('<meta property="og:url" content="' + attr3(u) + '">');
    if (site) L.push('<meta property="og:site_name" content="' + attr3(site) + '">');
    if (img) {
      L.push('<meta property="og:image" content="' + attr3(img) + '">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="' + attr3(t) + '">');
    }
    L.push('<meta property="og:locale" content="en_GB">');
    L.push('<meta name="twitter:card" content="' + (img ? "summary_large_image" : "summary") + '">');
    if (t) L.push('<meta name="twitter:title" content="' + attr3(t) + '">');
    if (d) L.push('<meta name="twitter:description" content="' + attr3(d) + '">');
    if (img) L.push('<meta name="twitter:image" content="' + attr3(img) + '">');
    $("og-out").textContent = L.join("\n");
    var host = "";
    try {
      host = new URL(u).hostname.replace(/^www\./, "");
    } catch (e) {
    }
    var warn = /\.svg(\?|$)/i.test(img) ? `<p class="small s-warn">SVG images aren't supported by Facebook, LinkedIn or X \u2013 use a PNG or JPG.</p>` : "";
    $("og-card").innerHTML = '<div class="ogc">' + (img && /^https:\/\//.test(img) ? '<div class="ogi" style="background-image:url(&quot;' + attr3(img).replace(/[()'"\\]/g, "") + '&quot;)"></div>' : '<div class="ogi ogn">1200 \xD7 630 image</div>') + '<div class="ogt"><span>' + esc2(host.toUpperCase() || "YOURSITE.CO.UK") + "</span><b>" + esc2(t || "Your page title") + "</b><small>" + esc2((d || "Your description").slice(0, 110)) + "</small></div></div>" + warn;
  });
  copyBtn("og-copy", "og-out");
  var smGen = function() {
    var site = absUrl(val("sm-site")).replace(/\/+$/, ""), today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), seen = {}, bad = 0;
    var urls = $("sm-urls").value.split(/\s+/).filter(Boolean).map(function(x) {
      x = /^https?:\/\//i.test(x) ? x : site ? site + "/" + x.replace(/^\/+/, "") : x;
      try {
        var y = new URL(x);
        y.hash = "";
        return y.href;
      } catch (e) {
        bad++;
        return null;
      }
    }).filter(function(x) {
      if (!x || seen[x]) return false;
      seen[x] = 1;
      return true;
    });
    var withDate = $("sm-lastmod").checked;
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(function(x) {
      return "  <url><loc>" + x.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</loc>" + (withDate ? "<lastmod>" + today + "</lastmod>" : "") + "</url>";
    }).join("\n") + "\n</urlset>\n";
    $("sm-out").textContent = xml;
    $("sm-count").textContent = urls.length + " URL" + (urls.length === 1 ? "" : "s") + (bad ? " \xB7 " + bad + " skipped (not a valid address)" : "") + (urls.length > 5e4 ? " \xB7 over 50,000 \u2013 split into several sitemaps" : "");
    download("sm-dl", xml, "application/xml");
  };
  live("sm-form", smGen);
  copyBtn("sm-copy", "sm-out");
  var smFind = $("sm-find");
  if (smFind) smFind.addEventListener("click", function() {
    var u = val("sm-site");
    if (!u) {
      $("sm-site").focus();
      return;
    }
    smFind.disabled = true;
    smFind.textContent = "Finding pages\u2026";
    fetch("/api/discover?url=" + encodeURIComponent(u)).then(function(r) {
      return r.json();
    }).then(function(j) {
      if (j.error) {
        $("sm-count").textContent = j.error;
        return;
      }
      $("sm-urls").value = j.urls.join("\n");
      smGen();
      $("sm-count").textContent += " \xB7 found from " + (j.fromSitemap ? "your existing sitemap and " : "") + "links on your home page";
    }).catch(function() {
      $("sm-count").textContent = "Couldn't reach that website.";
    }).then(function() {
      smFind.disabled = false;
      smFind.textContent = "Find pages on my site";
    });
  });
  var STOP2 = " a an and are as at be but by can do for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to too up us was we were what when which who will with you your yours i'm it's don't you're we're ";
  live("wc-form", function() {
    var t = $("wc-text").value, words = t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
    var sentences = (t.match(/[^.!?\n]+[.!?]+(\s|$)/g) || []).length || (words.length ? 1 : 0);
    var paras = t.split(/\n\s*\n/).filter(function(x) {
      return x.trim();
    }).length;
    var syl = function(w) {
      w = w.toLowerCase().replace(/[^a-z]/g, "");
      if (w.length <= 3) return 1;
      w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
      var m = w.match(/[aeiouy]{1,2}/g);
      return m ? m.length : 1;
    };
    var sy = words.reduce(function(n, w) {
      return n + syl(w);
    }, 0);
    var fre = words.length && sentences ? Math.round(206.835 - 1.015 * (words.length / sentences) - 84.6 * (sy / words.length)) : null;
    var stat = function(n, l) {
      return "<div><b>" + n + "</b><small>" + l + "</small></div>";
    };
    $("wc-stats").innerHTML = stat(words.length.toLocaleString("en-GB"), "words") + stat(t.length.toLocaleString("en-GB"), "characters") + stat(t.replace(/\s/g, "").length.toLocaleString("en-GB"), "without spaces") + stat(sentences, "sentences") + stat(paras, "paragraphs") + stat(Math.max(words.length ? 1 : 0, Math.round(words.length / 230)) + " min", "reading time") + stat(fre == null ? "\u2013" : Math.max(0, Math.min(100, fre)), "readability (0\u2013100)");
    var lw = words.map(function(w) {
      return w.toLowerCase().replace(/[’']/g, "'");
    });
    var count = function(n) {
      var c = {};
      for (var i = 0; i + n <= lw.length; i++) {
        var g = lw.slice(i, i + n);
        if (STOP2.indexOf(" " + g[0] + " ") >= 0 || STOP2.indexOf(" " + g[n - 1] + " ") >= 0 || g[0].length < 3 && n === 1) continue;
        var k = g.join(" ");
        c[k] = (c[k] || 0) + 1;
      }
      return Object.keys(c).map(function(k2) {
        return [k2, c[k2]];
      }).filter(function(x) {
        return n === 1 || x[1] > 1;
      }).sort(function(a, b) {
        return b[1] - a[1];
      }).slice(0, 10);
    };
    var table = function(rows, label) {
      return rows.length ? '<div><p class="ct" style="font-size:17px">' + label + "</p><table><tbody>" + rows.map(function(r) {
        return "<tr><td>" + esc2(r[0]) + "</td><td>" + r[1] + "</td><td>" + (r[1] / lw.length * 100).toFixed(1) + "%</td></tr>";
      }).join("") + "</tbody></table></div>" : "";
    };
    $("wc-kw").innerHTML = words.length ? '<div class="grid" style="margin-top:8px">' + table(count(1), "Top words") + table(count(2), "Top 2-word phrases") + table(count(3), "Top 3-word phrases") + "</div>" : "";
  });
  live("kw-form", function() {
    var seed = val("kw-seed").toLowerCase().replace(/\s+/g, " "), town = val("kw-town").toLowerCase();
    if (!seed) {
      $("kw-out").innerHTML = "";
      $("kw-n").textContent = "";
      return;
    }
    var G = {
      "Questions": ["how much does " + seed + " cost", "how to choose " + seed, "what is " + seed, "is " + seed + " worth it", "how long does " + seed + " take", "why do i need " + seed, "when should i get " + seed, "which " + seed + " is best", "can i do " + seed + " myself", "what to ask before " + seed],
      "Buying intent": ["best " + seed, "cheap " + seed, "affordable " + seed, seed + " prices", seed + " cost", seed + " quote", seed + " deals", seed + " for small business", "professional " + seed, seed + " reviews"],
      "Free & no-friction": ["free " + seed, seed + " no sign up", "free " + seed + " no registration", seed + " without account", "free " + seed + " online", seed + " no subscription", "free " + seed + " no email", "instant " + seed],
      "Comparisons": [seed + " vs diy", seed + " alternatives", "best " + seed + " compared", seed + " pros and cons"],
      "Beginners & guides": [seed + " for beginners", seed + " guide", seed + " checklist", seed + " tips", seed + " mistakes to avoid", seed + " examples", seed + " step by step"]
    };
    if (town) G["Local"] = [seed + " " + town, seed + " in " + town, seed + " near " + town, "best " + seed + " in " + town, "cheap " + seed + " " + town, seed + " " + town + " prices", "local " + seed + " " + town, seed + " near me"];
    else G["Local"] = [seed + " near me", "local " + seed, seed + " in my area"];
    var all = [], h = "";
    Object.keys(G).forEach(function(k) {
      h += '<div class="card"><p class="ct" style="font-size:17px">' + esc2(k) + '</p><ul style="margin:0;padding-left:18px">' + G[k].map(function(x) {
        all.push(x);
        return "<li>" + esc2(x) + "</li>";
      }).join("") + "</ul></div>";
    });
    $("kw-out").innerHTML = '<div class="grid">' + h + "</div>";
    $("kw-n").textContent = all.length + " ideas";
    $("kw-all").textContent = all.join("\n");
  });
  copyBtn("kw-copy", "kw-all");
  live("bt-form", function() {
    var k = val("bt-kw"), y = (/* @__PURE__ */ new Date()).getFullYear(), aud = val("bt-aud");
    if (!k) {
      $("bt-out").innerHTML = "";
      return;
    }
    var K = k.replace(/(^|\s)(\S)/g, function(m, sp, ch) {
      return sp + ch.toUpperCase();
    }), a = aud ? " for " + aud : "";
    var T = ["How to Choose " + K + a + " (" + y + " Guide)", K + ": A Plain-English Guide" + a, "7 " + K + " Mistakes to Avoid", K + " Explained in 5 Minutes", "Is " + K + " Worth It? An Honest Answer", "How Much Does " + K + " Cost in " + y + "?", "The " + K + " Checklist" + a, K + " vs DIY: Which Is Right for You?", "10 Questions to Ask Before " + K, "What Nobody Tells You About " + K, "A Beginner's Guide to " + K, K + " Tips That Actually Work", "Why " + K + " Matters" + a, "Everything You Need to Know About " + K, "How We Do " + K + " (Step by Step)"];
    $("bt-out").innerHTML = '<ol class="chk" style="list-style:none;padding:0">' + T.map(function(t) {
      var w = px(t, 20);
      return '<li style="display:block;padding:8px 0;border-bottom:1px solid var(--line)"><strong>' + esc2(t) + '</strong> <span class="small" style="color:' + col(w <= 580, w <= 620) + '">' + w + " px</span></li>";
    }).join("") + "</ol>";
  });
  live("rg-form", function() {
    var site = absUrl(val("rg-site")).replace(/\/+$/, ""), L = ["User-agent: *"];
    var dis = val("rg-block").split(/\s+/).filter(Boolean).map(function(p) {
      return p.charAt(0) === "/" ? p : "/" + p;
    });
    if ($("rg-all").checked) L.push("Disallow: /");
    else {
      dis.forEach(function(p) {
        L.push("Disallow: " + p);
      });
      if (!dis.length) L.push("Allow: /");
    }
    var train = [["GPTBot", "OpenAI training"], ["ClaudeBot", "Anthropic training"], ["Google-Extended", "Gemini training"], ["CCBot", "Common Crawl"], ["Applebot-Extended", "Apple AI training"], ["Meta-ExternalAgent", "Meta AI training"]];
    var search = [["OAI-SearchBot", "ChatGPT search"], ["Claude-SearchBot", "Claude search"], ["PerplexityBot", "Perplexity search"]];
    if ($("rg-train").checked) train.forEach(function(b) {
      L.push("", "# " + b[1], "User-agent: " + b[0], "Disallow: /");
    });
    if ($("rg-search").checked) search.forEach(function(b) {
      L.push("", "# " + b[1], "User-agent: " + b[0], "Disallow: /");
    });
    if (site) L.push("", "Sitemap: " + site + "/sitemap.xml");
    var out = L.join("\n") + "\n";
    $("rg-out").textContent = out;
    download("rg-dl", out);
    $("rg-note").innerHTML = $("rg-all").checked ? '<span class="s-fail">This blocks every crawler from your whole site \u2013 only use it on a development site.</span>' : $("rg-search").checked ? '<span class="s-warn">Blocking AI search crawlers stops ChatGPT, Claude and Perplexity showing and linking to your site.</span>' : "";
  });
  copyBtn("rg-copy", "rg-out");
  live("sg-form", function() {
    var o = { "@context": "https://schema.org", "@type": $("sg-type").value };
    var set = function(k, v) {
      if (v) o[k] = v;
    };
    set("name", val("sg-name"));
    set("url", absUrl(val("sg-url")));
    set("telephone", val("sg-tel"));
    set("email", val("sg-email"));
    set("image", absUrl(val("sg-img")));
    set("description", val("sg-desc"));
    set("priceRange", val("sg-price"));
    var adr = { "@type": "PostalAddress", streetAddress: val("sg-street"), addressLocality: val("sg-town"), postalCode: val("sg-pc"), addressCountry: "GB" };
    Object.keys(adr).forEach(function(k) {
      if (!adr[k]) delete adr[k];
    });
    if (adr.streetAddress || adr.addressLocality || adr.postalCode) o.address = adr;
    var areas = val("sg-areas").split(/,|\n/).map(function(x) {
      return x.trim();
    }).filter(Boolean);
    if (areas.length) o.areaServed = areas.map(function(a) {
      return { "@type": "Place", name: a };
    });
    var days = val("sg-days"), op = val("sg-open"), cl = val("sg-close");
    if (days && op && cl) o.openingHoursSpecification = [{ "@type": "OpeningHoursSpecification", dayOfWeek: days.split(",").map(function(d) {
      return d.trim();
    }), opens: op, closes: cl }];
    var same = val("sg-same").split(/\s+/).filter(Boolean).map(absUrl);
    if (same.length) o.sameAs = same;
    var json = JSON.stringify(o, null, 2).replace(/</g, "\\u003c");
    $("sg-out").textContent = '<script type="application/ld+json">\n' + json + "\n</script>";
    var miss = ["name", "address"].filter(function(k) {
      return !o[k];
    });
    $("sg-note").innerHTML = miss.length ? '<span class="s-warn">Google requires ' + miss.join(" and ") + " for LocalBusiness. Service-area businesses without a public address can use areaServed and leave the street out.</span>" : `<span class="s-pass">Has Google's required properties.</span>`;
  });
  copyBtn("sg-copy", "sg-out");
  var getPage = function(u) {
    return fetch("/api/page?url=" + encodeURIComponent(u)).then(function(r) {
      return r.json();
    }).then(function(j) {
      if (j.error) throw new Error(j.error);
      return j;
    });
  };
  var GENERIC = /^(click here|here|read more|more|learn more|find out more|this|link|this link|go|continue|details|more info|see more|view more|click|website|page|download)$/i;
  var ac = $("ac-form");
  if (ac) ac.addEventListener("submit", function(ev) {
    ev.preventDefault();
    var out = $("ac-out"), u = val("ac-url");
    out.innerHTML = "<p>Reading the page\u2026</p>";
    getPage(u).then(function(j) {
      var L = j.links, body = L.filter(function(l) {
        return !l.nav;
      });
      var flag = function(l) {
        var t = l.t.trim(), f = [];
        if (!t) f.push(["fail", l.img ? "Image link with no alt text" : "Empty anchor \u2013 no text at all"]);
        else if (GENERIC.test(t)) f.push(["warn", "Generic anchor \u2013 says nothing about the destination"]);
        else if (/^(https?:\/\/|www\.)/i.test(t)) f.push(["warn", "Bare URL as anchor"]);
        else if (t.length > 100) f.push(["warn", "Very long anchor"]);
        if (!l.int && /\b(sponsored|ugc)\b/.test(l.rel)) f.push(["info", l.rel.match(/sponsored|ugc/)[0] + " link"]);
        if (/\bnofollow\b/.test(l.rel) && l.int) f.push(["warn", "nofollow on an internal link \u2013 wastes your own link value"]);
        return f;
      };
      var byText = {}, byUrl = {};
      L.forEach(function(l) {
        var k = l.t.trim().toLowerCase();
        if (!k) return;
        (byText[k] = byText[k] || {})[l.h.replace(/[?#].*$/, "").replace(/\/$/, "")] = 1;
        (byUrl[l.h] = byUrl[l.h] || {})[k] = 1;
      });
      var clash = Object.keys(byText).filter(function(k) {
        return Object.keys(byText[k]).length > 1 && !GENERIC.test(k);
      });
      var counts = { fail: 0, warn: 0 }, rows = L.map(function(l) {
        var f = flag(l);
        f.forEach(function(x) {
          if (counts[x[0]] != null) counts[x[0]]++;
        });
        return [l, f];
      });
      var intN = L.filter(function(l) {
        return l.int;
      }).length;
      var top = {};
      body.filter(function(l) {
        return l.int && l.t.trim();
      }).forEach(function(l) {
        var k = l.t.trim();
        top[k] = (top[k] || 0) + 1;
      });
      var topList = Object.keys(top).sort(function(a, b) {
        return top[b] - top[a];
      }).slice(0, 12);
      var stat = function(n, l2) {
        return "<div><b>" + n + "</b><small>" + l2 + "</small></div>";
      };
      out.innerHTML = '<p class="small" style="overflow-wrap:anywhere">' + esc2(j.url) + '</p><div class="vit">' + stat(L.length, "links") + stat(intN, "internal") + stat(L.length - intN, "external") + stat('<span class="' + (counts.fail ? "s-fail" : "s-pass") + '">' + counts.fail + "</span>", "empty anchors") + stat('<span class="' + (counts.warn ? "s-warn" : "s-pass") + '">' + counts.warn + "</span>", "weak anchors") + "</div>" + (clash.length ? '<p><strong class="s-warn">Same anchor, different pages:</strong> ' + clash.slice(0, 8).map(function(k) {
        return "\u201C" + esc2(k) + "\u201D";
      }).join(", ") + " \u2013 this blurs which page should rank for those words.</p>" : "") + (topList.length ? '<h3>Internal anchors in the page content</h3><p class="small">These tell Google what your other pages are about. Descriptive, varied anchors are best.</p><ul>' + topList.map(function(k) {
        return "<li>" + esc2(k) + (top[k] > 1 ? ' <span class="small">\xD7' + top[k] + "</span>" : "") + "</li>";
      }).join("") + "</ul>" : "") + '<h3>Every link</h3><div class="tablewrap"><table><thead><tr><th>Anchor text</th><th>Goes to</th><th>Notes</th></tr></thead><tbody>' + rows.map(function(r) {
        var l = r[0], f = r[1];
        return "<tr><td>" + (l.t ? esc2(l.t) : '<em class="s-fail">(none)</em>') + '</td><td style="overflow-wrap:anywhere;font-size:14px">' + (l.int ? "" : "\u2197 ") + esc2(l.h.replace(/^https?:\/\/(www\.)?/, "")) + (l.nav ? ' <span class="small">menu/footer</span>' : "") + "</td><td>" + (f.length ? f.map(function(x) {
          return '<span class="s-' + (x[0] === "info" ? "pass" : x[0]) + '">' + esc2(x[1]) + "</span>";
        }).join("<br>") : '<span class="s-pass">OK</span>') + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }).catch(function(e) {
      out.innerHTML = '<p class="s-fail">' + esc2(e.message) + "</p>";
    });
  });
  live("ag-form", function() {
    var k = val("ag-kw"), b = val("ag-brand"), u = absUrl(val("ag-url"));
    if (!k) {
      $("ag-out").innerHTML = "";
      return;
    }
    var host = "";
    try {
      host = new URL(u).hostname.replace(/^www\./, "");
    } catch (e) {
    }
    var G = [
      ["Descriptive (best for internal links)", [k, k + " guide", "how " + k + " works", "our " + k, k + " prices and options"]],
      ["Partial match (natural mentions)", ["affordable " + k, "help with " + k, k + " for small businesses", "everything about " + k]],
      ["Branded", b ? [b, b + "'s " + k, k + " from " + b] : []],
      ["Website address", host ? [host, "www." + host] : []]
    ];
    $("ag-out").innerHTML = '<div class="grid">' + G.filter(function(g) {
      return g[1].length;
    }).map(function(g) {
      return '<div class="card"><p class="ct" style="font-size:17px">' + esc2(g[0]) + '</p><ul style="margin:0;padding-left:18px">' + g[1].map(function(x) {
        return "<li>" + esc2(x) + "</li>";
      }).join("") + "</ul></div>";
    }).join("") + "</div>" + (u ? '<p style="margin:16px 0 6px;font-weight:600">HTML</p><pre class="out">' + esc2('<a href="' + u + '">' + k + "</a>") + "</pre>" : "");
  });
  var pg = $("pg-form");
  if (pg) pg.addEventListener("submit", function(ev) {
    ev.preventDefault();
    var t = $("pg-text").value.trim(), out = $("pg-out"), cmp = val("pg-url");
    if (!t) {
      $("pg-text").focus();
      return;
    }
    var sents = (t.replace(/\s+/g, " ").match(/[^.!?]+[.!?]?/g) || []).map(function(x) {
      return x.trim();
    }).filter(function(x) {
      var n = x.split(" ").length;
      return n >= 7 && n <= 40;
    });
    var freq = {};
    (t.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []).forEach(function(w) {
      freq[w] = (freq[w] || 0) + 1;
    });
    var score = function(x) {
      var ws = x.toLowerCase().match(/[\p{L}\p{N}']+/gu) || [];
      return ws.reduce(function(n, w) {
        return n + (STOP2.indexOf(" " + w + " ") >= 0 ? 0 : w.length > 6 ? 2 : 1);
      }, 0) / Math.sqrt(ws.length);
    };
    var pick = sents.map(function(x, i) {
      return [x, score(x), i];
    }).sort(function(a, b) {
      return b[1] - a[1];
    }).slice(0, 8).sort(function(a, b) {
      return a[2] - b[2];
    });
    var phrase = function(x) {
      var ws = x.replace(/["“”]/g, "").split(" ");
      return ws.slice(0, 14).join(" ");
    };
    var h = "<h3>Search the web for your most distinctive sentences</h3>" + (pick.length ? '<p class="small">Each button searches for the exact words in quotes. If another page shows up with the same wording, it has been copied \u2013 one way or the other.</p><ol class="pgl">' + pick.map(function(p2) {
      var q = '"' + phrase(p2[0]) + '"';
      return "<li><p>" + esc2(p2[0]) + '</p><a class="btn ghost" rel="noopener" target="_blank" href="https://www.google.com/search?q=' + encodeURIComponent(q) + '">Google</a> <a class="btn ghost" rel="noopener" target="_blank" href="https://www.bing.com/search?q=' + encodeURIComponent(q) + '">Bing</a></li>';
    }).join("") + "</ol>" : "<p>Add a few full sentences (seven words or more) to search for.</p>");
    out.innerHTML = h + (cmp ? '<div id="pg-cmp"><p>Comparing with ' + esc2(cmp) + "\u2026</p></div>" : "");
    if (!cmp) return;
    getPage(cmp).then(function(j) {
      var norm = function(x) {
        return x.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      };
      var a = norm(t), bb = norm(j.text), N = 5, set = {};
      for (var i = 0; i + N <= bb.length; i++) set[bb.slice(i, i + N).join(" ")] = 1;
      var hit = [], total = Math.max(0, a.length - N + 1), shared = 0;
      for (var k2 = 0; k2 < total; k2++) {
        var on = !!set[a.slice(k2, k2 + N).join(" ")];
        if (on) shared++;
        hit.push(on);
      }
      var pct = total ? Math.round(shared / total * 100) : 0;
      var runs = [], cur = null;
      hit.forEach(function(on2, i2) {
        if (on2) {
          if (!cur) cur = [i2, i2 + N];
          else cur[1] = i2 + N;
        } else if (cur) {
          runs.push(cur);
          cur = null;
        }
      });
      if (cur) runs.push(cur);
      runs = runs.filter(function(r) {
        return r[1] - r[0] >= 8;
      }).sort(function(x, y) {
        return y[1] - y[0] - (x[1] - x[0]);
      }).slice(0, 8);
      $("pg-cmp").innerHTML = "<h3>Similarity with " + esc2(j.host) + '</h3><div class="meter" role="img" aria-label="' + pct + '% matching"><span style="width:' + pct + "%;background:" + col(pct < 10, pct < 30) + '"></span></div><p><strong>' + pct + "%</strong> of your text appears word-for-word on that page (" + j.words.toLocaleString("en-GB") + " words checked). " + (pct < 10 ? "Little or no copying." : pct < 30 ? "Some shared passages \u2013 check they're quoted or your own." : "Heavy overlap \u2013 one copy is likely to be filtered out of search results.") + "</p>" + (runs.length ? "<p><strong>Longest matching passages:</strong></p><ul>" + runs.map(function(r) {
        return "<li>\u201C" + esc2(a.slice(r[0], r[1]).join(" ")) + "\u201D</li>";
      }).join("") + "</ul>" : "");
    }).catch(function(e) {
      $("pg-cmp").innerHTML = '<p class="s-fail">' + esc2(e.message) + "</p>";
    });
  });
  var kd = $("kd-form");
  if (kd) {
    var kdLink = function() {
      var k = val("kd-kw");
      var a = $("kd-google");
      a.href = "https://www.google.co.uk/search?q=" + encodeURIComponent(k || "your keyword");
      a.textContent = k ? "Search Google for \u201C" + k + "\u201D" : "Search Google";
    };
    $("kd-kw").addEventListener("input", kdLink);
    kdLink();
    var BIG = /(^|\.)(wikipedia\.org|amazon\.(co\.uk|com)|ebay\.(co\.uk|com)|gov\.uk|nhs\.uk|bbc\.co\.uk|which\.co\.uk|youtube\.com|facebook\.com|linkedin\.com|tripadvisor\.(co\.uk|com)|checkatrade\.com|trustpilot\.com|yell\.com|argos\.co\.uk|johnlewis\.com|theguardian\.com|telegraph\.co\.uk|moneysavingexpert\.com|forbes\.com|indeed\.co\.uk|rightmove\.co\.uk|booking\.com|apple\.com|microsoft\.com|google\.com|ac\.uk)$/;
    var EASY = /(^|\.)(reddit\.com|quora\.com|mumsnet\.com|pistonheads\.com|stackexchange\.com|medium\.com|blogspot\.com|wordpress\.com|wixsite\.com|pinterest\.(co\.uk|com)|tiktok\.com)$|forum/;
    kd.addEventListener("submit", function(ev) {
      ev.preventDefault();
      var k = val("kd-kw").toLowerCase(), out = $("kd-out");
      var urls = $("kd-urls").value.split(/\s+/).filter(function(x) {
        return /\./.test(x);
      }).slice(0, 10);
      if (!k) {
        $("kd-kw").focus();
        return;
      }
      if (urls.length < 3) {
        out.innerHTML = '<p class="s-warn">Paste the addresses of at least 3 (ideally 10) pages that rank on page one for this keyword.</p>';
        return;
      }
      var kws = k.split(/\s+/).filter(function(w) {
        return STOP2.indexOf(" " + w + " ") < 0;
      });
      out.innerHTML = "<p>Checking " + urls.length + " pages\u2026</p>";
      Promise.all(urls.map(function(u) {
        return getPage(u).then(function(j) {
          return j;
        }, function(e) {
          return { url: u, error: e.message };
        });
      })).then(function(res) {
        var has = function(s, all) {
          s = (s || "").toLowerCase();
          return all ? s.indexOf(k) >= 0 : kws.every(function(w) {
            return s.indexOf(w) >= 0;
          });
        };
        var rows = res.map(function(j) {
          if (j.error) return { j, s: null };
          var host = j.host, s = 0, why = [];
          if (BIG.test(host)) {
            s += 40;
            why.push("major site");
          } else if (EASY.test(host)) {
            s -= 15;
            why.push("forum/Q&A or free blog");
          }
          if (has(j.title, true)) {
            s += 15;
            why.push("exact phrase in title");
          } else if (has(j.title)) {
            s += 9;
            why.push("keywords in title");
          } else why.push("not targeted in title");
          if (j.h1.some(function(h) {
            return has(h);
          })) {
            s += 8;
            why.push("in H1");
          }
          var first = j.text.split(" ").slice(0, 120).join(" ");
          if (has(first)) s += 5;
          s += j.words >= 1500 ? 14 : j.words >= 800 ? 10 : j.words >= 400 ? 6 : 0;
          why.push(j.words.toLocaleString("en-GB") + " words");
          if (j.ld.length) {
            s += 6;
            why.push("structured data");
          }
          if (j.https) s += 3;
          if (j.ms < 800) s += 4;
          if (/\b(near me|in [a-z]+)\b/.test(k) && !has(j.title + " " + j.h1.join(" "))) s -= 5;
          return { j, s: Math.max(0, Math.min(100, s + 10)), why };
        });
        var ok = rows.filter(function(r) {
          return r.s != null;
        });
        if (!ok.length) {
          out.innerHTML = '<p class="s-fail">None of those pages could be read.</p>';
          return;
        }
        var sorted = ok.map(function(r) {
          return r.s;
        }).sort(function(a, b) {
          return b - a;
        });
        var kdv = Math.round(sorted.reduce(function(n, v, i) {
          return n + v * (i < 3 ? 1.5 : 1);
        }, 0) / sorted.reduce(function(n, v, i) {
          return n + (i < 3 ? 1.5 : 1);
        }, 0));
        var weak = ok.filter(function(r) {
          return r.s < 40;
        }).length;
        var verdict = kdv < 35 ? ["Easy", "s-pass", "The pages ranking now are weak or don't target this phrase. A focused, genuinely useful page has a real chance."] : kdv < 60 ? ["Medium", "s-warn", "Beatable with a well-built page that answers the search better than what's there, plus some links or local signals."] : ["Hard", "s-fail", "Strong, well-targeted pages and big sites hold page one. Go for a longer, more specific version of this keyword first."];
        out.innerHTML = '<div class="ck-head" style="margin:16px 0"><div class="ring" style="--p:' + kdv + ";--c:" + (kdv < 35 ? "#1a7f37" : kdv < 60 ? "#9a6700" : "#cf222e") + '" role="img" aria-label="Difficulty ' + kdv + ' out of 100"><div><span><b>' + kdv + '</b><small>difficulty</small></span></div></div><div><p style="font-size:22px;margin:0"><strong class="' + verdict[1] + '">' + verdict[0] + "</strong></p><p>" + verdict[2] + "</p>" + (weak ? "<p><strong>" + weak + " of " + ok.length + "</strong> ranking pages look weak \u2013 those are the spots to take.</p>" : "") + '</div></div><div class="tablewrap"><table><thead><tr><th>#</th><th>Page</th><th>Strength</th><th>Why</th></tr></thead><tbody>' + rows.map(function(r, i) {
          return "<tr><td>" + (i + 1) + '</td><td style="overflow-wrap:anywhere;font-size:14px">' + esc2((r.j.host || r.j.url) + "") + '<br><span class="small">' + esc2((r.j.title || "").slice(0, 80)) + "</span></td><td>" + (r.s == null ? '<span class="s-fail">' + esc2(r.j.error) + "</span>" : '<b style="color:' + (r.s < 40 ? "#1a7f37" : r.s < 65 ? "#9a6700" : "#cf222e") + '">' + r.s + "</b>") + '</td><td class="small">' + (r.why ? esc2(r.why.join(" \xB7 ")) : "") + "</td></tr>";
        }).join("") + `</tbody></table></div><p class="small">An estimate from how strongly each ranking page targets the keyword and what kind of site it is. Backlinks aren't measured, so treat big-name sites as harder than they look.</p>`;
      });
    });
  }
  var rc = $("recent");
  if (rc) {
    var list = [];
    try {
      list = JSON.parse(localStorage.getItem("seo_recent") || "[]");
    } catch (e) {
    }
    if (list.length) {
      var ago = function(t) {
        var m = Math.round((Date.now() - t) / 6e4);
        return m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " days ago";
      };
      rc.innerHTML = '<p class="ct" style="font-size:17px;margin-top:18px">Your recent checks</p><ul class="recent">' + list.slice(0, 6).map(function(x) {
        var host = x.u;
        try {
          host = new URL(x.u).hostname.replace(/^www\./, "");
        } catch (e) {
        }
        return '<li><a href="/seo-checker?url=' + encodeURIComponent(x.u) + '">' + esc2(host) + '</a> <b style="color:' + col(x.s >= 90, x.s >= 70) + '">' + x.s + '</b> <span class="small">' + ago(x.t) + "</span></li>";
      }).join("") + '</ul><p class="small">Saved only in this browser. <a href="#" id="recent-clear">Clear</a></p>';
      $("recent-clear").addEventListener("click", function(ev) {
        ev.preventDefault();
        try {
          localStorage.removeItem("seo_recent");
        } catch (e) {
        }
        rc.innerHTML = "";
      });
    }
  }
  live("ls-form", function() {
    var q = val("ls-q"), town = val("ls-town"), region = $("ls-region").value, a = $("ls-go");
    if (!q || !town) {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      $("ls-note").textContent = "Enter a search and a town.";
      return;
    }
    var canon = town.replace(/\s*,\s*/g, ",").replace(/^\w/, function(c) {
      return c.toUpperCase();
    }) + "," + region + ",United Kingdom";
    var KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var b64 = btoa(unescape(encodeURIComponent(canon)));
    var uule = "w+CAIQICI" + KEYS.charAt(canon.length % 64) + b64;
    a.href = "https://www.google.co.uk/search?q=" + encodeURIComponent(q) + "&gl=uk&hl=en&pws=0&uule=" + encodeURIComponent(uule);
    a.removeAttribute("aria-disabled");
    $("ls-note").textContent = "Opens Google in a new tab showing results for \u201C" + q + "\u201D as seen from " + canon.replace(/,/g, ", ") + ".";
  });
  var af = $("ai-form");
  if (af) af.addEventListener("submit", function(ev) {
    ev.preventDefault();
    var out = $("ai-out"), btn = af.querySelector("button[type=submit]");
    btn.disabled = true;
    out.innerHTML = "<p>Writing\u2026 this takes a few seconds.</p>";
    fetch("/api/ai-snippet", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: val("ai-url"), about: $("ai-about").value, keyword: val("ai-kw"), town: val("ai-town") }) }).then(function(r) {
      return r.json();
    }).then(function(j) {
      if (j.error) {
        out.innerHTML = '<p class="s-fail">' + esc2(j.error) + "</p>";
        return;
      }
      var row = function(x, max) {
        return '<li style="display:block;padding:10px 0;border-bottom:1px solid var(--line)"><span>' + esc2(x.t) + '</span> <span class="small" style="color:' + col(x.px <= max, x.px <= max * 1.07) + '">' + x.px + ' px</span> <button type="button" class="btn ghost ai-cp" style="padding:4px 12px;font-size:14px" data-t="' + esc2(x.t) + '">Copy</button></li>';
      };
      out.innerHTML = (j.current ? '<p class="small"><strong>Now:</strong> ' + esc2(j.current.title || "(no title)") + " \u2014 " + esc2(j.current.desc || "(no description)") + "</p>" : "") + '<h3>Titles</h3><ul style="list-style:none;padding:0;margin:0">' + j.titles.map(function(x) {
        return row(x, 580);
      }).join("") + '</ul><h3 style="margin-top:18px">Meta descriptions</h3><ul style="list-style:none;padding:0;margin:0">' + j.descriptions.map(function(x) {
        return row(x, 990);
      }).join("") + '</ul><p class="small">Written by AI \u2013 check every word is true for your business before using it. Press "Write with AI" again for new ideas.</p>';
      out.querySelectorAll(".ai-cp").forEach(function(b) {
        b.addEventListener("click", function() {
          var t = b.getAttribute("data-t");
          (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function() {
            b.textContent = "Copied";
          }, function() {
            b.textContent = "Select and copy";
          });
        });
      });
    }).catch(function() {
      out.innerHTML = '<p class="s-fail">Something went wrong \u2013 please try again.</p>';
    }).then(function() {
      btn.disabled = false;
    });
  });
  var bk = $("bk-form");
  if (bk) bk.addEventListener("submit", function(ev) {
    ev.preventDefault();
    var urls = $("bk-urls").value.split(/\s+/).filter(function(x) {
      return /\./.test(x);
    }), seen = {};
    urls = urls.filter(function(u) {
      u = u.toLowerCase();
      if (seen[u]) return false;
      seen[u] = 1;
      return true;
    }).slice(0, 20);
    var out = $("bk-out");
    if (!urls.length) {
      out.innerHTML = '<p class="s-warn">Add at least one web address.</p>';
      return;
    }
    var res = urls.map(function() {
      return null;
    }), next = 0, done = 0;
    var draw = function() {
      out.innerHTML = '<p class="small">' + done + " of " + urls.length + ' checked</p><div class="tablewrap"><table><thead><tr><th>Page</th><th>SEO</th><th>AI</th><th>Failed</th><th>Words</th><th>Title</th></tr></thead><tbody>' + urls.map(function(u, i) {
        var r = res[i];
        if (!r) return "<tr><td>" + esc2(u) + '</td><td colspan="5" class="small">Waiting\u2026</td></tr>';
        if (r.error) return "<tr><td>" + esc2(u) + '</td><td colspan="5" class="s-fail">' + esc2(r.error) + "</td></tr>";
        return '<tr><td style="overflow-wrap:anywhere"><a href="/seo-checker?url=' + encodeURIComponent(r.url) + '">' + esc2(r.url.replace(/^https?:\/\/(www\.)?/, "")) + '</a></td><td><b style="color:' + col(r.score >= 90, r.score >= 70) + '">' + r.score + "</b></td><td>" + r.aiScore + "</td><td>" + r.counts.fail + "</td><td>" + r.facts.words + '</td><td class="small">' + esc2((r.facts.title || "").slice(0, 60)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" + (done === urls.length ? '<p><button type="button" class="btn ghost" id="bk-csv">Download CSV</button></p>' : "");
      var c = $("bk-csv");
      if (c) c.onclick = function() {
        var cell = function(v) {
          v = String(v == null ? "" : v);
          if (/^[=+\-@\t\r]/.test(v)) v = "'" + v;
          return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
        };
        var rows = [["url", "seo_score", "ai_score", "failed", "warnings", "words", "title"]].concat(res.map(function(r, i) {
          return r && !r.error ? [r.url, r.score, r.aiScore, r.counts.fail, r.counts.warn, r.facts.words, r.facts.title] : [urls[i], "error", r && r.error || ""];
        }));
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob(["\uFEFF" + rows.map(function(r) {
          return r.map(cell).join(",");
        }).join("\r\n")], { type: "text/csv" }));
        a.download = "xkey-bulk-check.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    };
    var work = function() {
      if (next >= urls.length) return;
      var i = next++;
      fetch("/api/check?url=" + encodeURIComponent(urls[i])).then(function(r) {
        return r.json();
      }).then(function(j) {
        res[i] = j.error ? { error: j.error } : j;
      }, function() {
        res[i] = { error: "Couldn't be checked" };
      }).then(function() {
        done++;
        draw();
        work();
      });
    };
    draw();
    work();
    work();
    work();
  });
  live("bd-form", function() {
    var site = val("bd-site").replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
    if (!site) {
      $("bd-prev").innerHTML = '<span class="small">Enter your website to see your badge.</span>';
      $("bd-code").textContent = "";
      return;
    }
    var img = "https://xkey.co.uk/badge.svg?site=" + encodeURIComponent(site);
    var code = '<a href="https://xkey.co.uk/seo-checker?url=' + encodeURIComponent(site) + '" title="SEO score checked by XKey"><img src="' + img + '" alt="XKey SEO score" height="22"></a>';
    $("bd-prev").innerHTML = '<img src="/badge.svg?site=' + encodeURIComponent(site) + '" alt="XKey SEO score" height="22">';
    $("bd-code").textContent = code;
  });
  copyBtn("bd-copy", "bd-code");
}

// src/og.js
var OG_PNG = "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AACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATBEQAgAAAIBMERACAAAAgEwREAIAAACATP0fAAAA//+TlazCAAAABklEQVQDAMUZz9O3vqVKAAAAAElFTkSuQmCC";

// src/page-parse.js
var ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "\u2013", mdash: "\u2014", rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201C", rdquo: "\u201D", hellip: "\u2026", pound: "\xA3" };
var decode2 = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m);
var strip = (s) => decode2(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
var attr2 = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode2(m[1] ?? m[2] ?? m[3] ?? "") : null;
};
function summarisePage(html, pageUrl) {
  html = html.slice(0, 1e6);
  const page = new URL(pageUrl);
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) || [""])[0];
  const title = strip((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || ["", ""])[1]);
  const descTag = (head.match(/<meta\b[^>]*name\s*=\s*["']?description["']?[^>]*>/i) || [""])[0];
  const body = html.replace(/<head\b[\s\S]*?<\/head>/i, "").replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1])).filter(Boolean).slice(0, 3);
  const mainHtml = (body.match(/<main\b[\s\S]*?<\/main>/i) || body.match(/<article\b[\s\S]*?<\/article>/i) || [body.replace(/<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi, " ")])[0];
  const text2 = strip(mainHtml.replace(/<\/(p|div|li|h[1-6]|section|article|br|td|tr)>/gi, ". ").replace(/<br\s*\/?>/gi, ". ")).replace(/(\.\s*){2,}/g, ". ").replace(/^\.\s*/, "");
  const words = (text2.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
  const links = [];
  const ranges = [...body.matchAll(/<(nav|header|footer)\b[\s\S]*?<\/\1>/gi)].map((m) => [m.index, m.index + m[0].length]);
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr2(m[1], "href");
    if (href == null || /^(javascript:|mailto:|tel:|#)/i.test(href.trim())) continue;
    let u;
    try {
      u = new URL(href.trim(), page);
      u.hash = "";
    } catch {
      continue;
    }
    if (!/^https?:$/.test(u.protocol)) continue;
    const img = (m[2].match(/<img\b[^>]*>/i) || [null])[0];
    const t = strip(m[2]) || (img ? attr2(img, "alt") || "" : "") || attr2(m[1], "aria-label") || attr2(m[1], "title") || "";
    links.push({ h: u.href, t: t.slice(0, 200), rel: (attr2(m[1], "rel") || "").toLowerCase(), img: !!img && !strip(m[2]), int: u.hostname.replace(/^www\./, "") === page.hostname.replace(/^www\./, ""), nav: ranges.some(([a, b]) => m.index >= a && m.index < b) });
    if (links.length >= 600) break;
  }
  const ld = [];
  for (const m of html.matchAll(/<script\b[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (o) => {
        if (Array.isArray(o)) return o.forEach(walk);
        if (o && typeof o === "object") {
          if (o["@type"]) ld.push(...[].concat(o["@type"]));
          if (o["@graph"]) walk(o["@graph"]);
        }
      };
      walk(JSON.parse(m[1]));
    } catch {
    }
  }
  return { url: page.href, host: page.hostname.replace(/^www\./, ""), https: page.protocol === "https:", title, desc: attr2(descTag, "content") || "", h1, words, text: text2.slice(0, 6e4), links, ld: [...new Set(ld)].slice(0, 20) };
}

// src/index.js
var BY_PATH = Object.fromEntries(PAGES.map((p) => [p.path, p]));
var GUIDES = PAGES.filter((p) => p.path.startsWith("/guides/"));
var W2 = {};
for (let c = 32; c < 127; c++) W2[String.fromCharCode(c)] = pixelWidth(String.fromCharCode(c), 2048);
for (const c of "\u2013\u2014\xA3\u20AC\u2019\u2018\u201C\u201D\u2026\xB7\u2022\xE9") W2[c] = pixelWidth(c, 2048);
var TOOLS_JS = `var W=${JSON.stringify(W2)};(${toolsApp.toString()})();`;
var input = (id, name, ph, extra = "") => `<label for="${id}" class="sr">Website address</label><input id="${id}" name="${name}" type="text" inputmode="url" autocomplete="url" placeholder="${ph}" required${extra}>`;
var FORMS = {
  check: (p) => `<form class="ck-form" action="/seo-checker" method="get" role="search">${input("ck-url", "url", "yourwebsite.co.uk")}${p.focus ? `<input type="hidden" name="focus" value="${p.focus}">` : ""}<button class="btn" type="submit">${p.path === "/" ? "Check my site" : "Run free check"}</button></form><p class="small">Free, no sign-up. Checks one page in about 20 seconds. We fetch it like a search engine and don't keep your content.</p><div id="recent"></div><script src="/assets/tools.js" defer></script>`,
  audit: () => `<form class="ck-form" action="/site-audit" method="get" role="search">${input("au-url", "url", "yourwebsite.co.uk")}<button class="btn" type="submit">Audit my site</button></form><p class="small">Crawls up to 250 pages. Keep the tab open while it runs (usually one to three minutes).</p>`,
  compare: (p) => cmpForm(esc, p.prefill || []),
  monitor: () => `<form class="ck-form" action="/api/monitor" method="post">${input("mo-url", "url", "yourwebsite.co.uk")}<button class="btn" type="submit">Start free monitoring</button></form><p class="small">No account or email needed \u2013 you'll get a private dashboard link to bookmark.</p>`,
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
<label for="lt-pages">Key pages \u2013 one per line: Title | address | short note</label><textarea id="lt-pages">Services | /services | Boilers, leaks, bathrooms and emergency callouts
Prices | /prices | Fixed prices for common jobs
Contact | /contact | Phone, email and opening hours</textarea>
<p style="margin:16px 0 6px;font-weight:600">Your llms.txt</p><pre class="out" id="lt-out" aria-live="polite"></pre>
<div class="row"><button class="btn" type="button" id="lt-copy">Copy</button><a class="btn ghost" id="lt-dl" href="#" download="llms.txt">Download llms.txt</a></div></form><script src="/assets/tools.js" defer></script>`,
  meta: () => `<form class="tool" id="mt-form"><label for="mt-title">Page title</label><input id="mt-title" type="text" value="Emergency Plumber in Blackpool | Smith &amp; Sons"><div id="mt-tm"></div>
<label for="mt-desc">Meta description</label><textarea id="mt-desc" style="min-height:80px;font-family:inherit;font-size:16px">Gas Safe plumbers covering Blackpool and the Fylde coast. Fixed prices, no callout fee and most jobs done the same day.</textarea><div id="mt-dm"></div>
<label for="mt-url">Page address (canonical)</label><input id="mt-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/page">
<label for="mt-img">Sharing image address (1200 \xD7 630)</label><input id="mt-img" type="text" inputmode="url" placeholder="https://yoursite.co.uk/share.jpg">
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="mt-index" type="checkbox" checked style="width:auto"> Allow search engines to index this page</label>
<p style="margin:16px 0 6px;font-weight:600">Your meta tags</p><pre class="out" id="mt-out" aria-live="polite"></pre><button class="btn" type="button" id="mt-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  og: () => `<form class="tool" id="og-form"><label for="og-title">Title</label><input id="og-title" type="text" value="Smith &amp; Sons \u2013 Blackpool Plumbers">
<label for="og-desc">Description</label><input id="og-desc" type="text" value="Gas Safe plumbers covering the Fylde coast. Fixed prices and same-day callouts.">
<label for="og-url">Page address</label><input id="og-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/">
<label for="og-img">Image address (1200 \xD7 630 PNG or JPG)</label><input id="og-img" type="text" inputmode="url" placeholder="https://yoursite.co.uk/share.jpg">
<label for="og-site">Site name</label><input id="og-site" type="text" placeholder="Smith &amp; Sons">
<label for="og-type">Type</label><select id="og-type"><option value="website">website</option><option value="article">article</option><option value="product">product</option></select>
<p style="margin:16px 0 6px;font-weight:600">Preview</p><div id="og-card" aria-live="polite"></div>
<p style="margin:16px 0 6px;font-weight:600">Your tags</p><pre class="out" id="og-out"></pre><button class="btn" type="button" id="og-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  sitemap: () => `<form class="tool" id="sm-form"><label for="sm-site">Your website</label><div class="row"><input id="sm-site" type="text" inputmode="url" placeholder="https://yoursite.co.uk" style="flex:1 1 260px;width:auto"><button class="btn ghost" type="button" id="sm-find">Find pages on my site</button></div>
<label for="sm-urls">Page addresses \u2013 one per line (full addresses or paths)</label><textarea id="sm-urls" spellcheck="false">/
/services
/about
/contact</textarea>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="sm-lastmod" type="checkbox" style="width:auto"> Add today's date as lastmod (only if every page changed today)</label>
<p class="small" id="sm-count" aria-live="polite"></p><pre class="out" id="sm-out"></pre><div class="row"><button class="btn" type="button" id="sm-copy">Copy</button><a class="btn ghost" id="sm-dl" href="#" download="sitemap.xml">Download sitemap.xml</a></div></form><script src="/assets/tools.js" defer></script>`,
  words: () => `<form class="tool" id="wc-form"><label for="wc-text">Your text</label><textarea id="wc-text" style="min-height:220px;font-family:inherit;font-size:16px" placeholder="Paste or type your text here\u2026"></textarea><div class="vit" id="wc-stats" aria-live="polite" style="margin-top:14px"></div><div id="wc-kw"></div></form><script src="/assets/tools.js" defer></script>`,
  keywords: () => `<form class="tool" id="kw-form"><div class="row"><div style="flex:2 1 240px"><label for="kw-seed">Product, service or topic</label><input id="kw-seed" type="text" value="boiler repair"></div><div style="flex:1 1 160px"><label for="kw-town">Town (optional)</label><input id="kw-town" type="text" placeholder="Blackpool"></div></div>
<p class="small" id="kw-n" aria-live="polite"></p><div id="kw-out"></div><pre class="sr" id="kw-all"></pre><p><button class="btn" type="button" id="kw-copy">Copy all ideas</button></p></form><script src="/assets/tools.js" defer></script>`,
  titles: () => `<form class="tool" id="bt-form"><div class="row"><div style="flex:2 1 240px"><label for="bt-kw">Topic or keyword</label><input id="bt-kw" type="text" value="garden landscaping"></div><div style="flex:1 1 160px"><label for="bt-aud">Audience (optional)</label><input id="bt-aud" type="text" placeholder="small gardens"></div></div><div id="bt-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  robotsgen: () => `<form class="tool" id="rg-form"><label for="rg-site">Your website (for the Sitemap line)</label><input id="rg-site" type="text" inputmode="url" placeholder="https://yoursite.co.uk">
<label for="rg-block">Folders to block \u2013 one per line (optional)</label><textarea id="rg-block" spellcheck="false" style="min-height:90px">/wp-admin/
/basket/</textarea>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-train" type="checkbox" style="width:auto"> Block AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot\u2026)</label>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-search" type="checkbox" style="width:auto"> Block AI search crawlers (ChatGPT, Claude and Perplexity search)</label>
<label style="display:flex;gap:10px;align-items:center;font-weight:400"><input id="rg-all" type="checkbox" style="width:auto"> Block everything (development sites only)</label>
<p class="small" id="rg-note" aria-live="polite"></p><pre class="out" id="rg-out"></pre><div class="row"><button class="btn" type="button" id="rg-copy">Copy</button><a class="btn ghost" id="rg-dl" href="#" download="robots.txt">Download robots.txt</a><a class="btn ghost" href="/robots-txt-tester">Test it</a></div></form><script src="/assets/tools.js" defer></script>`,
  schemagen: () => `<form class="tool" id="sg-form"><label for="sg-type">Business type</label><select id="sg-type">${["LocalBusiness", "ProfessionalService", "HomeAndConstructionBusiness", "Plumber", "Electrician", "HVACBusiness", "RoofingContractor", "Locksmith", "HousePainter", "GeneralContractor", "AutoRepair", "BeautySalon", "HairSalon", "Dentist", "Restaurant", "CafeOrCoffeeShop", "BarOrPub", "Store", "LodgingBusiness", "LegalService", "AccountingService", "RealEstateAgent", "CleaningService"].map((t) => `<option>${t}</option>`).join("")}</select>
<div class="row"><div style="flex:1 1 240px"><label for="sg-name">Business name</label><input id="sg-name" type="text" placeholder="Smith &amp; Sons Plumbing"></div><div style="flex:1 1 240px"><label for="sg-url">Website</label><input id="sg-url" type="text" inputmode="url" placeholder="https://smithplumbing.co.uk"></div></div>
<div class="row"><div style="flex:1 1 200px"><label for="sg-tel">Phone</label><input id="sg-tel" type="tel" placeholder="+44 1253 000000"></div><div style="flex:1 1 200px"><label for="sg-email">Email</label><input id="sg-email" type="email" placeholder="hello@smithplumbing.co.uk"></div></div>
<label for="sg-desc">Short description</label><input id="sg-desc" type="text" placeholder="Gas Safe plumbers covering Blackpool and the Fylde coast.">
<div class="row"><div style="flex:2 1 240px"><label for="sg-street">Street address (leave blank if you don't have a public address)</label><input id="sg-street" type="text"></div><div style="flex:1 1 140px"><label for="sg-town">Town</label><input id="sg-town" type="text" placeholder="Blackpool"></div><div style="flex:1 1 110px"><label for="sg-pc">Postcode</label><input id="sg-pc" type="text" placeholder="FY1 1AA"></div></div>
<label for="sg-areas">Areas served (comma separated)</label><input id="sg-areas" type="text" placeholder="Blackpool, Lytham St Annes, Fleetwood">
<div class="row"><div style="flex:2 1 220px"><label for="sg-days">Open days</label><input id="sg-days" type="text" value="Monday, Tuesday, Wednesday, Thursday, Friday"></div><div style="flex:1 1 90px"><label for="sg-open">Opens</label><input id="sg-open" type="time" value="08:00"></div><div style="flex:1 1 90px"><label for="sg-close">Closes</label><input id="sg-close" type="time" value="18:00"></div></div>
<div class="row"><div style="flex:1 1 240px"><label for="sg-img">Logo or photo address</label><input id="sg-img" type="text" inputmode="url"></div><div style="flex:1 1 120px"><label for="sg-price">Price range</label><input id="sg-price" type="text" placeholder="\xA3\xA3"></div></div>
<label for="sg-same">Official profiles (sameAs) \u2013 one per line</label><textarea id="sg-same" spellcheck="false" style="min-height:80px" placeholder="https://www.facebook.com/yourbusiness"></textarea>
<p class="small" id="sg-note" aria-live="polite"></p><pre class="out" id="sg-out"></pre><button class="btn" type="button" id="sg-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`,
  anchors: () => `<form class="ck-form" id="ac-form"><label for="ac-url" class="sr">Page address</label><input id="ac-url" type="text" inputmode="url" placeholder="yourwebsite.co.uk/page" required><button class="btn" type="submit">Check anchors</button></form><div id="ac-out" aria-live="polite"></div>
<h2 style="margin-top:36px">Anchor text generator</h2><form class="tool" id="ag-form"><div class="row"><div style="flex:2 1 220px"><label for="ag-kw">Target page topic or keyword</label><input id="ag-kw" type="text" value="boiler servicing"></div><div style="flex:1 1 160px"><label for="ag-brand">Brand name</label><input id="ag-brand" type="text" placeholder="Smith &amp; Sons"></div></div><label for="ag-url">Target page address</label><input id="ag-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/boiler-servicing"><div id="ag-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  plagiarism: () => `<form class="tool" id="pg-form"><label for="pg-text">Your text</label><textarea id="pg-text" style="min-height:200px;font-family:inherit;font-size:16px" placeholder="Paste the text you want to check\u2026"></textarea>
<label for="pg-url">Compare with a page (optional)</label><input id="pg-url" type="text" inputmode="url" placeholder="https://suspected-copy.co.uk/page">
<p style="margin:16px 0 0"><button class="btn" type="submit">Check for plagiarism</button></p><div id="pg-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  difficulty: () => `<form class="tool" id="kd-form"><label for="kd-kw">Keyword</label><input id="kd-kw" type="text" placeholder="boiler repair blackpool" required>
<p style="margin:12px 0 0"><strong>Step 1:</strong> <a class="btn ghost" id="kd-google" href="https://www.google.co.uk/search" target="_blank" rel="noopener">Search Google</a></p>
<label for="kd-urls"><strong>Step 2:</strong> paste the addresses of the page-one results (up to 10, one per line \u2013 skip ads and maps)</label><textarea id="kd-urls" spellcheck="false" placeholder="https://example.co.uk/page"></textarea>
<p style="margin:16px 0 0"><button class="btn" type="submit">Check difficulty</button></p><div id="kd-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  localserp: () => `<form class="tool" id="ls-form"><div class="row"><div style="flex:2 1 240px"><label for="ls-q">What would a customer search?</label><input id="ls-q" type="text" value="emergency plumber"></div><div style="flex:1 1 160px"><label for="ls-town">Town or city</label><input id="ls-town" type="text" value="Blackpool"></div><div style="flex:1 1 150px"><label for="ls-region">Nation</label><select id="ls-region"><option>England</option><option>Scotland</option><option>Wales</option><option>Northern Ireland</option></select></div></div>
<p style="margin:16px 0 4px"><a class="btn" id="ls-go" target="_blank" rel="noopener">See Google results from there</a></p><p class="small" id="ls-note" aria-live="polite"></p></form><script src="/assets/tools.js" defer></script>`,
  aiwriter: () => `<form class="tool" id="ai-form"><label for="ai-url">Page address (optional \u2013 we'll read the page)</label><input id="ai-url" type="text" inputmode="url" placeholder="https://yoursite.co.uk/services">
<label for="ai-about">\u2026or describe the page</label><textarea id="ai-about" style="min-height:90px;font-family:inherit;font-size:16px" placeholder="Family-run plumbers in Blackpool. Boiler repairs, servicing and emergency callouts, Gas Safe registered, no callout fee."></textarea>
<div class="row"><div style="flex:2 1 220px"><label for="ai-kw">Main keyword</label><input id="ai-kw" type="text" placeholder="boiler repair"></div><div style="flex:1 1 160px"><label for="ai-town">Town (optional)</label><input id="ai-town" type="text" placeholder="Blackpool"></div></div>
<p style="margin:16px 0 0"><button class="btn" type="submit">Write with AI</button></p><div id="ai-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  bulk: () => `<form class="tool" id="bk-form"><label for="bk-urls">Web addresses \u2013 one per line, up to 20</label><textarea id="bk-urls" spellcheck="false" placeholder="yoursite.co.uk&#10;competitor.co.uk&#10;yoursite.co.uk/services"></textarea>
<p style="margin:16px 0 0"><button class="btn" type="submit">Check them all</button></p><div id="bk-out" aria-live="polite"></div></form><script src="/assets/tools.js" defer></script>`,
  badge: () => `<form class="tool" id="bd-form"><label for="bd-site">Your website</label><input id="bd-site" type="text" inputmode="url" placeholder="yoursite.co.uk">
<p style="margin:16px 0 6px;font-weight:600">Preview</p><div id="bd-prev"></div><p style="margin:16px 0 6px;font-weight:600">Code to paste into your site</p><pre class="out" id="bd-code"></pre><button class="btn" type="button" id="bd-copy">Copy</button></form><script src="/assets/tools.js" defer></script>`
};
var ROBOT_AGENTS = [
  ["googlebot", "Googlebot", "Google Search and AI Overviews"],
  ["bingbot", "Bingbot", "Bing and Copilot"],
  ["oai-searchbot", "OAI-SearchBot", "ChatGPT search results"],
  ["chatgpt-user", "ChatGPT-User", "ChatGPT fetching a page for a user"],
  ["gptbot", "GPTBot", "OpenAI model training"],
  ["claude-searchbot", "Claude-SearchBot", "Claude search results"],
  ["claude-user", "Claude-User", "Claude fetching a page for a user"],
  ["claudebot", "ClaudeBot", "Anthropic model training"],
  ["perplexitybot", "PerplexityBot", "Perplexity search results"],
  ["google-extended", "Google-Extended", "Gemini training and grounding (token only)"],
  ["applebot", "Applebot", "Siri and Spotlight"],
  ["ccbot", "CCBot", "Common Crawl dataset"]
];
var AGENT_FALLBACK = { "googlebot-image": ["googlebot-image", "googlebot"] };
function robotsTest(body) {
  const robots = String(body.robots || "").slice(0, 2e5);
  let path = String(body.url || "/").trim();
  if (!path) return { error: "Enter a URL or path to test." };
  try {
    const u = new URL(/^[a-z]+:\/\//i.test(path) ? path : "https://x.invalid" + (path.startsWith("/") ? "" : "/") + path);
    path = u.pathname + u.search;
  } catch {
    return { error: "That URL doesn't look right." };
  }
  const one = ROBOT_AGENTS.find(([t]) => t === body.agent) || ROBOT_AGENTS[0];
  const allows = (t) => robotsAllows(robots, AGENT_FALLBACK[t] || [t], path);
  return { path, agentName: one[1], allowed: allows(one[0]), all: ROBOT_AGENTS.map(([t, name, use]) => ({ name, use, allowed: allows(t) })) };
}
var faqs = (list) => list && list.length ? `<h2>Frequently asked questions</h2>${list.map(([q, a]) => `<details><summary><h3>${esc(q)}</h3></summary><p>${esc(a)}</p></details>`).join("")}` : "";
var guideCards = () => `<div class="grid">${GUIDES.map((g) => `<a class="card" href="${g.path}"><p class="ct">${esc(g.crumb)}</p><p>${esc(g.desc)}</p></a>`).join("")}</div>`;
var CTA = `<div class="cta"><p class="ct" style="font-size:26px">Run a free SEO check now</p><p>About 50 checks covering Google, AI search, speed, security and local SEO. No sign-up.</p><form class="ck-form" action="/seo-checker" method="get" role="search"><label for="cta-url" class="sr">Website address</label><input id="cta-url" name="url" type="text" inputmode="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Check my site</button></form></div>`;
var MAKER = `<div class="maker"><p><strong>Want the fixes done for you?</strong> XKey is made by <a href="https://icework.co.uk/" rel="noopener">IceWork</a>, a web studio in ${BRAND.town}. IceWork builds fast, search-ready websites \u2013 a 3-page site including domain and a year's hosting is \xA3${BRAND.price} all in.</p></div>`;
var INSTANT = /* @__PURE__ */ new Set(["title", "robots", "llms", "meta", "og", "sitemap", "words", "keywords", "titles", "robotsgen", "schemagen", "localserp"]);
var freeStrip = (f) => `<ul class="free" aria-label="What free means here"><li>No cost</li><li>No sign-up</li><li>No email</li><li>No subscription</li><li>${INSTANT.has(f) ? "Unlimited \u2013 runs in your browser" : "No limits for normal use"}</li></ul>`;
function render(p) {
  const form2 = p.form ? FORMS[p.form](p) : "";
  const isTool = !p.article && p.path !== "/about" && p.path !== "/contact" && p.path !== "/privacy";
  const body = `<div class="wrap hero"${p.form ? "" : ' style="padding-bottom:24px"'}>${p.eyebrow ? `<span class="eyebrow">${esc(p.eyebrow)}</span>` : ""}<h1>${esc(p.h1)}</h1><p class="lead">${esc(p.lead)}</p>${form2}${p.form ? freeStrip(p.form) : ""}</div>
<section style="padding-top:0"><div class="wrap prose">${p.article ? `<p class="small">Last updated <time datetime="${UPDATED}">${new Date(UPDATED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time> \xB7 By the XKey team</p>` : ""}${p.sections || ""}${faqs(p.faqs)}</div>
${p.tools ? `<div class="wrap">${toolCards()}</div>` : ""}${p.guides ? `<div class="wrap">${guideCards()}</div>` : ""}
${isTool && !p.tools && !p.guides ? `<div class="wrap"><h2>More free SEO tools</h2>${toolCards(p.path)}</div>` : ""}
<div class="wrap">${p.form === "check" ? "" : CTA}${p.path === "/contact" || p.path === "/privacy" ? "" : MAKER}</div></section>`;
  return layout({ ...p, body });
}
var HTML = Object.fromEntries(PAGES.map((p) => [p.path, render(p)]));
var NOT_FOUND = layout({ path: "/404", crumb: "Not found", title: "Page not found | XKey", desc: "That page doesn't exist.", noindex: true, body: `<div class="wrap hero"><h1>Page not found</h1><p class="lead">That page doesn't exist or has moved.</p><a class="btn" href="/">Run a free SEO check</a></div>` });
var ENGINE_PAGE = { landing: "/", audit: "/website-audit", compare: "/seo-comparison", report: "/" };
var enginePage = (k) => BY_PATH[ENGINE_PAGE[k] || "/"];
var OG_BYTES = Uint8Array.from(atob(OG_PNG), (c) => c.charCodeAt(0));
var INDEXED = PAGES.filter((p) => !p.noindex);
var SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXED.map((p) => `<url><loc>${SITE}${p.path}</loc><lastmod>${UPDATED}</lastmod></url>`).join("\n")}
</urlset>
`;
var ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /monitor/

Sitemap: ${SITE}/sitemap.xml
`;
var LLMS = `# ${BRAND.name}

> Free SEO and AI search checker for UK websites, made by ${BRAND.maker} (${BRAND.makerUrl}), a web studio in ${BRAND.town}. No sign-up.

XKey checks a page for Google readiness, AI search visibility (ChatGPT, Claude, Perplexity, Google AI Overviews), Core Web Vitals, structured data, security and local SEO, and gives a ranked list of fixes. It also crawls whole sites, compares competitors and monitors sites weekly.

## Tools

${INDEXED.filter((p) => !p.article && !["/about", "/contact", "/privacy"].includes(p.path)).map((p) => `- [${p.crumb === "Home" ? "Free SEO check" : p.crumb}](${SITE}${p.path}): ${p.desc}`).join("\n")}

## Guides

${GUIDES.map((p) => `- [${p.crumb}](${SITE}${p.path}): ${p.desc}`).join("\n")}

## About

- [About XKey](${SITE}/about)
- [Contact](${SITE}/contact)
- [Privacy](${SITE}/privacy)
`;
var MANIFEST = JSON.stringify({ name: BRAND.name, short_name: BRAND.name, start_url: "/", display: "browser", background_color: "#f6f8fb", theme_color: "#0e1726", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] });
var INDEXNOW_KEY = "7b3e9c41d2a84f06b5e1c8a9f0d36e72";
var SITE_VERSION = (() => {
  let h = 2166136261;
  const t = JSON.stringify(PAGES);
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
})();
async function submitIndexNow(env) {
  if (!env || !env.STATE) return "no KV binding";
  if (await env.STATE.get("indexnow") === SITE_VERSION) return "already submitted";
  const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: BRAND.domain, key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: INDEXED.map((p) => SITE + p.path) }) });
  if (res.status === 200 || res.status === 202) {
    await env.STATE.put("indexnow", SITE_VERSION);
    return "submitted " + res.status;
  }
  return "failed " + res.status;
}
var OWN_HOSTS = /* @__PURE__ */ new Set([BRAND.domain, `www.${BRAND.domain}`]);
var selfFetch = (env, ctx) => async (inp, init = {}) => {
  const u = new URL(typeof inp === "string" ? inp : inp.url);
  if (!OWN_HOSTS.has(u.hostname)) return fetch(inp, init);
  const { signal, ...rest } = init;
  const res = await worker.fetch(new Request(u.href, { ...rest, redirect: "manual" }), env, ctx);
  const headers = new Headers(res.headers);
  headers.set("x-checker-internal", "1");
  return new Response((rest.method || "GET").toUpperCase() === "HEAD" ? null : res.body, { status: res.status, headers });
};
var badgeSvg = (score) => {
  const right = score == null ? "checked" : `${score}/100`, col = score == null ? "#0a6f6a" : score >= 90 ? "#1a7f37" : score >= 70 ? "#9a6700" : "#cf222e";
  const lw = 106, rw = score == null ? 62 : 58;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lw + rw}" height="22" role="img" aria-label="SEO score: ${right} by XKey"><title>SEO score: ${right} \u2013 checked by XKey (xkey.co.uk)</title><rect width="${lw}" height="22" rx="4" fill="#0e1726"/><rect x="${lw - 4}" width="${rw + 4}" height="22" rx="4" fill="${col}"/><rect x="${lw - 4}" width="4" height="22" fill="${col}"/><g fill="#fff" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11"><text x="8" y="15">XKey SEO score</text><text x="${lw + rw / 2}" y="15" text-anchor="middle" font-weight="bold">${right}</text></g></svg>`;
};
async function aiSnippet(env, ctx, b) {
  const kw = String(b.keyword || "").slice(0, 80).trim(), town = String(b.town || "").slice(0, 60).trim();
  let about = String(b.about || "").slice(0, 1500).trim(), page = null;
  if (b.url && String(b.url).trim()) {
    try {
      const r = await fetchHtml(String(b.url).trim(), selfFetch(env, ctx));
      if (r.status === 200 && r.html) page = summarisePage(r.html, r.url);
      else return { error: `That page returned HTTP ${r.status || "error"}.` };
    } catch (e) {
      return { error: e && e.message || "Couldn't reach that page." };
    }
    about = `Current title: ${page.title}
Current description: ${page.desc}
Main heading: ${page.h1.join(" / ")}
Page text: ${page.text.slice(0, 2500)}`;
  }
  if (!about && !kw) return { error: "Enter a page address, or describe the page." };
  const prompt = `You write search-result snippets for UK small business websites. Use British English. Be specific and honest: never invent prices, awards, reviews or claims that aren't in the information given.
Write 3 page titles (each under 60 characters, main keyword near the start${town ? ", include the town" : ""}) and 3 meta descriptions (each 120 to 155 characters, plain benefit plus a call to action).
Main keyword: ${kw || "(choose from the page)"}${town ? `
Town: ${town}` : ""}
About the page:
${about}
Reply with JSON only, exactly in this shape: {"titles":["...","...","..."],"descriptions":["...","...","..."]}`;
  let out;
  try {
    out = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", { messages: [{ role: "user", content: prompt }], max_tokens: 600, temperature: 0.6 });
  } catch (e) {
    return { error: "The AI writer is busy or has reached today's free limit \u2013 please try again later." };
  }
  const text2 = String(out && (out.response ?? out.result?.response) || "");
  let j = null;
  try {
    j = JSON.parse((text2.match(/\{[\s\S]*\}/) || ["{}"])[0]);
  } catch {
  }
  const clean = (a) => (Array.isArray(a) ? a : []).map((x) => String(x).replace(/\s+/g, " ").replace(/^["']|["']$/g, "").trim()).filter(Boolean).slice(0, 3);
  const titles = clean(j && j.titles).map((t) => ({ t, px: pixelWidth(t, 20) })), descriptions = clean(j && j.descriptions).map((t) => ({ t, px: pixelWidth(t, 14) }));
  if (!titles.length && !descriptions.length) return { error: "The AI didn't return usable suggestions \u2013 please try again." };
  return { titles, descriptions, current: page ? { title: page.title, desc: page.desc } : null };
}
var JS = "text/javascript; charset=utf-8";
var TXT = "text/plain; charset=utf-8";
var HTMLT = "text/html; charset=utf-8";
var worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname === `www.${BRAND.domain}` || url.hostname === BRAND.domain && url.protocol === "http:") return Response.redirect(`${SITE}${url.pathname}${url.search}`, 301);
    const c = ctx || { waitUntil() {
    } };
    if (request.method === "POST") {
      if (url.pathname === "/api/robots-test") {
        if (await rateLimited(request, "robotstest", 2e3)) return Response.json({ error: "Too many tests this hour." }, { status: 429 });
        let body;
        try {
          body = JSON.parse((await request.text()).slice(0, 25e4));
        } catch {
          return Response.json({ error: "Bad request" }, { status: 400 });
        }
        return Response.json(robotsTest(body || {}), { headers: { "cache-control": "no-store" } });
      }
      if (url.pathname === "/api/ai-snippet") {
        if (!env || !env.AI) return Response.json({ error: "The AI writer isn't available here." }, { status: 503 });
        if (await rateLimited(request, "ai", 30)) return Response.json({ error: "You've used the AI writer a lot this hour \u2013 please try again later." }, { status: 429 });
        if (await over(`ai-day/${Math.floor(Date.now() / 864e5)}`, 400)) return Response.json({ error: "The AI writer has reached today's free limit \u2013 please try again tomorrow." }, { status: 429 });
        let body;
        try {
          body = JSON.parse((await request.text()).slice(0, 2e4));
        } catch {
          return Response.json({ error: "Bad request" }, { status: 400 });
        }
        return Response.json(await aiSnippet(env, c, body || {}), { headers: { "cache-control": "no-store" } });
      }
      if (url.pathname.startsWith("/api/monitor")) {
        if (!env || !env.STATE) return send("Monitoring isn't available here.", TXT, 503);
        const back = (id) => new Response(null, { status: 303, headers: { location: `/monitor/${id}` } });
        const run = url.pathname.match(/^\/api\/monitor\/([A-Za-z0-9_-]+)\/run$/);
        if (run) {
          const id = run[1];
          if (!validId(id) || !await getMonitor(env, id)) return send("Not found", TXT, 404);
          if (!await rateLimited(request, "monrun", 6) && !await overOnce(`monrun/${id}`)) await runMonitor(env, id, selfFetch(env, c));
          return back(id);
        }
        if (url.pathname === "/api/monitor") {
          if (await rateLimited(request, "moncreate", 20)) return send("Too many monitors created from your connection this hour.", TXT, 429);
          let id;
          try {
            const f = await request.formData();
            id = await createMonitor(env, f.get("url"));
          } catch (e) {
            return send(e && e.message || "Couldn't start monitoring.", TXT, 400);
          }
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
      case "/sitemap.xml":
        return send(SITEMAP, "application/xml; charset=utf-8");
      case "/robots.txt":
        return send(ROBOTS, TXT);
      case "/llms.txt":
        return send(LLMS, TXT);
      case "/site.webmanifest":
        return send(MANIFEST, "application/manifest+json");
      case "/assets/audit.js":
        return send(AUDIT_JS, JS, 200, "public, max-age=3600");
      case "/assets/compare.js":
        return send(COMPARE_JS, JS, 200, "public, max-age=3600");
      case "/assets/report.js":
        return send(REPORT_JS, JS, 200, "public, max-age=3600");
      case "/assets/tools.js":
        return send(TOOLS_JS, JS, 200, "public, max-age=3600");
      case "/favicon.svg":
        return send(FAVICON, "image/svg+xml", 200, "public, max-age=31536000, immutable");
      case "/favicon.ico":
        return Response.redirect(`${url.origin}/favicon.svg`, 301);
      case "/og.png":
        return send(OG_BYTES, "image/png", 200, "public, max-age=86400");
      case `/${INDEXNOW_KEY}.txt`:
        return send(INDEXNOW_KEY, TXT);
      case "/badge.svg": {
        let t;
        try {
          t = normaliseUrl(url.searchParams.get("site") || "");
        } catch {
          return send(badgeSvg(null), "image/svg+xml", 200, "public, max-age=3600");
        }
        const host = t.hostname.replace(/^www\./, "");
        const saved = env && env.STATE ? await env.STATE.get("badge:" + host, "json") : null;
        if ((!saved || Date.now() - saved.t > 7 * 864e5) && env && env.STATE && !await over(`badge-run/${host}/${Math.floor(Date.now() / 864e5)}`, 1)) {
          c.waitUntil(runCheck(t.origin + "/", selfFetch(env, c)).then((r) => env.STATE.put("badge:" + host, JSON.stringify({ s: r.score, t: Date.now() }), { expirationTtl: 60 * 86400 })).catch(() => {
          }));
        }
        return send(badgeSvg(saved && saved.s), "image/svg+xml", 200, "public, max-age=21600");
      }
      case "/api/page": {
        let t;
        try {
          t = normaliseUrl(url.searchParams.get("url"));
        } catch (e) {
          return Response.json({ error: e.message }, { status: 400 });
        }
        if (await rateLimited(request, "page", 600)) return Response.json({ error: "Too many requests from your connection this hour." }, { status: 429 });
        if (await over(`page-host/${t.hostname}/${Math.floor(Date.now() / 36e5)}`, 300)) return Response.json({ error: "That website has been fetched a lot this hour \u2013 please try again later." }, { status: 429 });
        try {
          const r = await fetchHtml(t.href, selfFetch(env, c));
          if (r.status !== 200 || !r.html) return Response.json({ error: r.status ? `The page returned HTTP ${r.status}.` : "Couldn't reach that page.", url: t.href }, { status: 502 });
          return Response.json({ ...summarisePage(r.html, r.url), ms: r.ms }, { headers: { "cache-control": "no-store" } });
        } catch (e) {
          return Response.json({ error: e && e.message || "Couldn't reach that page.", url: t.href }, { status: 502 });
        }
      }
      case "/api/discover": {
        if (await rateLimited(request, "discover", 60)) return Response.json({ error: "You've searched a lot of sites this hour \u2013 please try again later." }, { status: 429 });
        try {
          const f = selfFetch(env, c), st = await crawlStart(url.searchParams.get("url"), f);
          const [home] = await crawlBatch(st.host, [st.start], f);
          const found = new Set([st.start, ...st.sitemap.slice(0, 2e3), ...home && home.links || []].map((u) => {
            try {
              const x = new URL(u);
              x.hash = "";
              return x.href;
            } catch {
              return null;
            }
          }).filter((u) => u && new URL(u).hostname === st.host && !/\.(jpe?g|png|gif|webp|svg|pdf|zip|css|js|xml|txt)$/i.test(new URL(u).pathname)));
          return Response.json({ urls: [...found].slice(0, 2e3), fromSitemap: st.sitemap.length > 0 }, { headers: { "cache-control": "no-store" } });
        } catch (e) {
          return Response.json({ error: e.name === "AbortError" ? "The site took too long to respond." : (e.message || "Couldn't reach that website.").slice(0, 160) }, { status: 400 });
        }
      }
      case "/api/robots": {
        let t;
        try {
          t = normaliseUrl(url.searchParams.get("url"));
        } catch (e) {
          return Response.json({ error: e.message }, { status: 400 });
        }
        if (await rateLimited(request, "robotsload", 200)) return Response.json({ error: "Too many requests this hour." }, { status: 429 });
        try {
          const r = await fetchRobots(t.origin, selfFetch(env, c));
          return Response.json({ origin: t.origin, status: r.status, text: r.text == null ? "" : r.text.slice(0, 2e5) }, { headers: { "cache-control": "no-store" } });
        } catch (e) {
          return Response.json({ error: "Couldn't reach that website." }, { status: 502 });
        }
      }
    }
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
  }
};
var index_default = worker;
export {
  HTML,
  INDEXNOW_KEY,
  LLMS,
  PAGES,
  SITEMAP,
  index_default as default,
  robotsTest,
  selfFetch
};
