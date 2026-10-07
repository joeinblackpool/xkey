// XKey pages. Each page targets its own search phrase with original copy.
// form: "check" | "audit" | "compare" | "monitor" | "title" | "robots" | "llms" | null
// focus: report section to jump to after a check (matches the report's section ids).

const TOOLS = [
  ["/", "Free SEO check", "Full single-page audit: Google readiness, AI search, speed, security and local SEO."],
  ["/ai-seo-checker", "AI SEO checker", "Can ChatGPT, Claude, Perplexity and Google AI Overviews read and cite your site?"],
  ["/website-audit", "Website audit", "Crawl up to 250 pages for broken links, duplicate titles and orphan pages."],
  ["/seo-comparison", "Competitor comparison", "Your site against up to two competitors, side by side."],
  ["/seo-monitoring", "SEO monitoring", "A free weekly re-check with a score history graph."],
  ["/title-tag-checker", "Title tag checker", "See your title and description in pixels, exactly as Google cuts them."],
  ["/robots-txt-tester", "robots.txt tester", "Paste your rules and test any URL against Googlebot or AI crawlers."],
  ["/llms-txt-generator", "llms.txt generator", "Create an llms.txt file that gives AI assistants a map of your site."],
  ["/mobile-friendly-test", "Mobile-friendly test", "Check your page works on phones – Google's own test closed in 2023."],
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
  ["/plagiarism-checker", "Plagiarism checker", "Find copies of your text across the web – no word limit."],
  ["/anchor-text-checker", "Anchor text checker", "Grade every link on a page and generate better anchors."],
  ["/local-search-checker", "Local search checker", "See Google results as they appear in any UK town."],
  ["/ai-meta-description-generator", "AI title & description writer", "AI reads your page and writes titles and descriptions that fit Google."],
  ["/bulk-seo-checker", "Bulk SEO checker", "Score up to 20 websites at once and download a CSV."],
  ["/seo-badge", "SEO score badge", "Show your score on your site – it updates itself weekly."],
];
export const toolCards = (except) => `<div class="grid">${TOOLS.filter(([p]) => p !== except).map(([p, t, d]) => `<a class="card" href="${p}"><p class="ct">${t}</p><p>${d}</p></a>`).join("")}</div>`;

const toolPage = (path, crumb, title, desc, h1, lead, focus, app, sections, faqs) => ({ path, crumb, title, desc, h1, lead, form: "check", focus, app, parent: ["/seo-tools", "SEO tools"], sections, faqs });

export const PAGES = [
  {
    path: "/", crumb: "Home", title: "Free SEO Check | No Sign-Up, No Email, Instant Report",
    desc: "Free SEO check for any website – no sign-up, no email, no subscription. Google readiness, AI search, Core Web Vitals and local SEO, with a ranked fix list.",
    h1: "Free SEO check for any website", eyebrow: "Free · Instant · No sign-up", app: "XKey free SEO check",
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
<ol><li><strong>Start with the fix list.</strong> It's sorted so the changes with the biggest effect come first – usually indexing problems, missing titles or a missing H1.</li>
<li><strong>Check the critical items.</strong> Anything marked critical can stop a page ranking at all.</li>
<li><strong>Re-run the check</strong> after each change. Reports are cached for an hour, so add a small change to the address (such as a trailing slash) if you need a fresh one sooner.</li>
<li><strong>Check the whole site.</strong> A single page can look perfect while problems elsewhere hold you back – run a <a href="/website-audit">full website audit</a> next.</li></ol>
<h2>Is this SEO check really free?</h2>
<p>Yes, completely. No cost, no sign-up, no email address, no subscription, no trial that runs out and no "upgrade to see your results". You get the whole report straight away. The <a href="/seo-tools">instant tools</a> run in your browser and are unlimited; full checks only have a safety limit set far above normal use, to stop bots. XKey is made by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, a small web studio in Blackpool, as a free tool for UK businesses – if you'd like the fixes done for you, IceWork can help, but you never have to.</p>`,
    faqs: [
      ["How accurate is the score?", "Every check is based on what Google and the AI providers document publicly, and title widths are measured in pixels the way Google displays them. The score is a guide to how well-prepared a page is – no tool can guarantee rankings, because Google also weighs links, competition and many other signals."],
      ["Do you store my website's content?", "No. We fetch the page like a search engine would, analyse it and keep only the finished report in a short-lived cache for an hour so repeat views are fast."],
      ["Is there a limit on how many sites I can check?", "Not for normal use. The instant tools run in your browser and are unlimited. Full checks and audits only have a safety limit set far above what a person can use by hand (two checks a minute, every minute), plus a cap on how often any one website can be checked – that stops bots using XKey to flood other people's sites."],
      ["Do I need to give my email address?", "No. XKey never asks for an email, an account or card details – not even for weekly monitoring, which gives you a private link instead."],
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
<p>The <a href="/">free SEO check</a> looks at one page in great detail, including AI readiness and real-world speed. The website audit looks wider and finds problems that only show up across many pages, such as fifty pages sharing the same title. Use both.</p>`,
    faqs: [["How many pages can the audit check?", "Up to 250 pages per audit, which covers most small and medium business websites. Larger sites are sampled from the home page and sitemap outwards."], ["Does the audit follow robots.txt?", "Yes. Pages your robots.txt blocks for crawlers are skipped and listed, just as a search engine would treat them."], ["Can I download the results?", "Yes. Print the report or save it as a PDF, and download a CSV with a row for every page crawled."]],
  },
  {
    path: "/seo-comparison", crumb: "Competitor comparison", parent: ["/seo-tools", "SEO tools"], title: "Compare Website SEO With Competitors | Free Tool",
    desc: "Compare your website's SEO with up to two competitors side by side: overall score, AI readiness, speed and content, and where they beat you.",
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
    path: "/title-tag-checker", crumb: "Title tag checker", parent: ["/seo-tools", "SEO tools"], title: "Title Tag & Meta Description Pixel Width Checker",
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
    path: "/robots-txt-tester", crumb: "robots.txt tester", parent: ["/seo-tools", "SEO tools"], title: "robots.txt Tester | Check Googlebot & AI Crawler Access",
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
  toolPage("/broken-link-checker", "Broken link checker", "Free Broken Link Checker | Find Dead Links on Your Site",
    "Free broken link checker: find links on your website that lead to 404 errors, server errors or redirects, and see which pages link to them.",
    "Broken link checker", "Broken links frustrate visitors and waste the attention search engines give your site. Check a page below, or crawl your whole site with the website audit.",
    "links", "XKey broken link checker",
    `<h2>Two ways to find broken links</h2>
<ul><li><strong>Quick check:</strong> the form above tests a sample of links on one page and shows any that fail or redirect.</li><li><strong>Whole site:</strong> the <a href="/website-audit">website audit</a> crawls up to 250 pages and lists every broken page together with the pages that link to it.</li></ul>
<h2>How do I fix broken links?</h2>
<ol><li>If the page moved, add a 301 redirect from the old address to the new one.</li><li>Update your own links to point straight at the new address, so visitors skip the redirect.</li><li>If the page is gone for good, remove the link or point it to the closest useful page.</li></ol>`,
    [["Do broken links hurt SEO?", "A few won't sink a site, but they waste visitors' time and crawl attention, and broken internal links can leave pages hard for Google to find. They're quick to fix."], ["Why does a link work for me but show as broken?", "Some sites block automated checkers or need a login. If the link works in your browser, it's probably fine – check it by hand."]]),
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
  toolPage("/security-headers-checker", "Security headers checker", "Security Headers Checker | HTTPS, HSTS & More",
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
    desc: "30 free SEO tools with no sign-up, no email and no subscription: SEO check, site audit, meta tag and sitemap generators, keyword ideas and more.",
    h1: "Free SEO tools", eyebrow: "No sign-up", lead: "Every tool is free, with no account, no email and no subscription. The generators and counters run in your browser, so they're unlimited and nothing you type leaves your device.",
    sections: `<h2>Which SEO tool should I start with?</h2><p>Start with the <a href="/">free SEO check</a> on your most important page – it covers everything below in one report. Then run the <a href="/website-audit">website audit</a> to catch site-wide problems, and turn on <a href="/seo-monitoring">weekly monitoring</a> so nothing breaks unnoticed.</p><h2>Are these SEO tools really free?</h2><p>Yes. No sign-up, no trial and no limits beyond fair-use rate limits that stop abuse. XKey is paid for by <a href="https://icework.co.uk" rel="noopener">IceWork</a>, who build websites, as a useful free service.</p><h2>Do the single-topic tools run a different check?</h2><p>The checkers for speed, schema, sitemaps, security, mobile and local SEO run the full check and open your report at that section, so you never miss a bigger problem elsewhere on the page.</p>`, tools: true, itemList: TOOLS,
  },
  {
    path: "/guides", crumb: "Guides", title: "SEO Guides | Plain-English Help From XKey",
    desc: "Plain-English SEO guides: what an SEO check is, how to check a website's SEO, AI search optimisation and Core Web Vitals explained.",
    h1: "SEO guides", eyebrow: "Plain English", lead: "Short, practical guides for business owners who want to understand their SEO report.", sections: `<h2>Who are these guides for?</h2><p>Business owners, marketers and anyone who has run an SEO check and wants to know what the results mean. Each guide explains one topic in plain English, says what matters and what doesn't, and links to the free tool that checks it. We update them when Google or the AI providers change their guidance.</p><h2>Where should I start?</h2><p>If you're new to SEO, read <a href="/guides/what-is-an-seo-check">what an SEO check is</a>, then follow the <a href="/guides/how-to-check-website-seo">10-minute routine</a>.</p>`, guides: true,
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
<ul><li><strong>Your actual rankings</strong> – that needs Google Search Console or a rank tracker.</li><li><strong>How strong your competitors are</strong> for a particular search.</li><li><strong>Your backlink profile</strong> in full – that requires a crawl of the whole web.</li><li><strong>Whether your content is the best answer</strong> – that's still a human judgement.</li></ul>
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
<p>In Google Search Console, check the <strong>Pages</strong> report for pages that aren't indexed, and the <strong>Performance</strong> report for the searches you already appear for. If you haven't set it up, do it today – it's free.</p>
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
<p>AI search features fetch pages with their own crawlers – for example OAI-SearchBot (ChatGPT search), Claude-SearchBot, PerplexityBot and Googlebot (AI Overviews). If robots.txt blocks them, you can't be cited. Training crawlers such as GPTBot and Google-Extended are separate: blocking them doesn't remove you from search. Test your rules with the <a href="/robots-txt-tester">robots.txt tester</a>.</p>
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
    path: "/about", crumb: "About", title: "About XKey | Free UK SEO Checker",
    desc: "XKey is a free SEO and AI search checker made by IceWork, a small web studio in Blackpool, for UK businesses.",
    h1: "About XKey", lead: "XKey is a free SEO and AI search checker for UK businesses, made by IceWork, a small web studio in Blackpool.",
    sections: `<h2>Why we built it</h2>
<p>Most SEO tools are built for agencies: expensive, hidden behind sign-ups, and full of jargon. Small business owners need something simpler – a clear score, a short list of what matters, and an honest explanation. We also wanted a tool that takes AI search seriously, because that's where search is heading.</p>
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
];
