// Pages for the rank tracker, SEO content editor, backlink audit, competitor ad checker, uptime monitor,
// website analytics, brand monitoring and the WordPress fixer plugin. Browser code: src/pro-client.js
// (/assets/pro.js); servers: src/uptime.js, src/analytics.js, src/wp-plugin.js.

export const PRO_TOOLS = [
  ["/rank-tracker", "Rank tracker", "Track your Google positions for every search, by country, from your own Search Console data."],
  ["/seo-content-editor", "SEO content editor", "Write with a live score, related terms and questions taken from the pages that rank."],
  ["/toxic-backlink-checker", "Toxic backlink checker", "Spot spam links, check your anchor text mix and build a disavow file."],
  ["/competitor-ads-checker", "Competitor ad checker", "See which ad platforms a competitor uses and open every ad they run."],
  ["/uptime-monitor", "Uptime monitor", "Checks your site every 15 minutes and alerts you the moment it goes down or slows."],
  ["/website-analytics", "Website analytics", "Cookie-free visitor stats: live visitors, pages, sources and conversions."],
  ["/brand-monitoring", "Brand monitoring", "Find mentions of your business, unlinked mentions and copied content."],
  ["/wordpress-seo-plugin", "WordPress SEO fixer", "A free plugin that fixes missing alt text, descriptions, extra H1s and broken links."],
];

const SCRIPT = `<script src="/assets/pro.js" defer></script>`;
const field = (id, label, ph, extra = "") => `<label for="${id}">${label}</label><input id="${id}" type="text" placeholder="${ph}"${extra}>`;

export const PRO_FORMS = {
  ranktrack: () => `<div class="tool"><label for="rk-file">Search Console export (the ZIP or CSV file)</label><input id="rk-file" type="file" accept=".zip,.csv,.tsv,.txt" multiple>
<label for="rk-paste">…or paste the Queries table</label><textarea id="rk-paste" placeholder="Top queries, Clicks, Impressions, CTR, Position"></textarea>
<div class="row"><div style="flex:1 1 200px">${field("rk-site", "Website", "yourwebsite.co.uk", ' inputmode="url"')}</div><div style="flex:1 1 200px">${field("rk-region", "Region (optional)", "United Kingdom")}</div></div>
<p class="row" style="margin:16px 0 0"><button class="btn" id="rk-go" type="button">Track my rankings</button><button class="btn" id="rk-demo" type="button" style="background:var(--fg)">Try sample data</button></p></div><div id="rk-out" aria-live="polite"></div>${SCRIPT}`,
  editor: () => `<div class="tool">${field("ce-kw", "Main keyword", "emergency plumber blackpool")}
<label for="ce-comp">Top-ranking pages for that keyword (optional, up to 5, one per line)</label><textarea id="ce-comp" style="min-height:80px" placeholder="https://competitor.co.uk/emergency-plumber"></textarea>
<p style="margin:12px 0 0"><button class="btn" id="ce-load" type="button">Get content guidelines</button></p><p id="ce-status" class="small" aria-live="polite"></p>
${field("ce-title", "Page title", "Emergency Plumber in Blackpool | 24/7, No Call-Out Fee")}
<label id="ce-ed-l">Your content – write here or paste from Word or Google Docs (headings are kept)</label><div id="ce-ed" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="ce-ed-l" style="min-height:280px;padding:12px 14px;border:2px solid var(--line);border-radius:12px;background:var(--bg);overflow-wrap:anywhere"></div>
<p style="margin:12px 0 0"><button class="btn" id="ce-copy" type="button" style="background:var(--fg)">Copy as HTML</button></p></div><div id="ce-out" aria-live="polite"></div>${SCRIPT}`,
  baudit: () => `<form class="ck-form" id="ba-form"><label for="ba-url" class="sr">Website address</label><input id="ba-url" type="text" inputmode="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Audit my links</button></form><div id="ba-out" aria-live="polite"></div>${SCRIPT}`,
  ads: () => `<form class="tool" id="ad-form"><div class="row"><div style="flex:2 1 220px">${field("ad-url", "Competitor's website", "competitor.co.uk", ' inputmode="url" required')}</div><div style="flex:1 1 160px">${field("ad-brand", "Brand name (optional)", "Competitor Ltd")}</div></div><p style="margin:16px 0 0"><button class="btn" type="submit">Find their ads</button></p></form><div id="ad-out" aria-live="polite"></div>${SCRIPT}`,
  uptime: () => `<form class="tool" method="post" action="/api/uptime">${field("up-url", "Website to watch", "yourwebsite.co.uk", ' name="url" inputmode="url" required')}
<label for="up-alert">Where to send alerts (optional)</label><input id="up-alert" name="alert" type="text" placeholder="an ntfy topic name, or a Slack, Discord or Teams webhook">
<p class="small">For phone alerts, install the free <a href="https://ntfy.sh/" rel="noopener">ntfy</a> app, subscribe to a topic name only you know (for example <code>mysite-alerts-7f3k</code>) and enter the same name here.</p>
<p style="margin:12px 0 0"><button class="btn" type="submit">Start free monitoring</button></p></form>`,
  analytics: () => `<form class="ck-form" method="post" action="/api/analytics"><label for="an-url" class="sr">Website address</label><input id="an-url" name="url" type="text" inputmode="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Get my tracking code</button></form>`,
  brand: () => `<form class="tool" id="bm-form"><div class="row"><div style="flex:1 1 200px">${field("bm-brand", "Business or brand name", "Smith Plumbing", " required")}</div><div style="flex:1 1 200px">${field("bm-site", "Your website (optional)", "smithplumbing.co.uk", ' inputmode="url"')}</div></div><p style="margin:16px 0 0"><button class="btn" type="submit">Find mentions</button></p></form><div id="bm-out" aria-live="polite"></div>
<div class="tool" id="bm-check" hidden><label for="bm-urls">Pages that mention you (paste up to 20 addresses from the searches above)</label><textarea id="bm-urls" style="min-height:100px" placeholder="https://localnews.co.uk/best-plumbers"></textarea><p style="margin:12px 0 0"><button class="btn" id="bm-go" type="button">Check for links</button></p><div id="bm-res" aria-live="polite"></div></div>${SCRIPT}`,
  wpplugin: () => `<p><a class="btn" href="/downloads/xkey-seo-fixer.zip" download>Download the free plugin (.zip)</a></p><p class="small">Version 1.0.0 · WordPress 6.0+ · PHP 7.4+ · GPL licence · no account, no tracking.</p>`,
};
export const PRO_INSTANT = ["ranktrack", "editor", "brand", "wpplugin"];

const P = ["/seo-tools", "SEO tools"];
export const PRO_PAGES = [
  {
    path: "/rank-tracker", crumb: "Rank tracker", parent: P, title: "Free Rank Tracker | Google Positions From Search Console",
    desc: "Free rank tracker: upload your Search Console export to see every search you rank for, position changes, page-two quick wins and history by country.",
    h1: "Free rank tracker for Google", eyebrow: "Free · Runs in your browser", app: "XKey rank tracker", form: "ranktrack",
    lead: "See where you rank on Google for every search, how positions moved, and which phrases are one push from page one – from Google's own data, not guesswork.",
    sections: `<h2>How does this rank tracker work?</h2>
<p>Google Search Console already records your real position for every search that showed your site – in every country, on every device. This tracker turns its export into a clear ranking report:</p>
<ol><li>In <a href="https://search.google.com/search-console" rel="noopener">Search Console</a> open <strong>Performance → Search results</strong>.</li><li>Pick a date range – choose <strong>Compare</strong> (for example last 28 days against the previous 28) to see movements.</li><li>To track a region, add a <strong>Country</strong> filter. The tracker reads it from the export and keeps each region's history separately.</li><li>Click <strong>Export → Download CSV</strong> and upload the ZIP file here. No need to unzip it.</li></ol>
<p>Upload a fresh export every week and the tracker builds a history for each search, so you can see a phrase climb from 14 to 9 to 4. Everything stays in your browser – your data is never sent to us.</p>
<h2>Why use Search Console data instead of a paid rank tracker?</h2>
<p>Paid trackers check a list of keywords you choose, from one location, once a day. Search Console covers <em>every</em> search you appeared for, including ones you'd never think to track, averaged across real searches by real people. It's also free and within Google's rules – scraping Google's results, which most trackers do, isn't.</p>
<p>The trade-off: Search Console shows an <strong>average</strong> position over the period, and only for searches where you appeared. To see the live results page in a particular town, use the <a href="/local-search-checker">local search checker</a>.</p>
<h2>What should I do with the results?</h2>
<ul><li><strong>Page two (positions 11–20)</strong> is your quickest win. Improve those pages with the <a href="/seo-content-editor">SEO content editor</a> and link to them from your strongest pages.</li><li><strong>High impressions, few clicks</strong> usually means a weak title. Rewrite it with the <a href="/title-tag-checker">title tag checker</a>.</li><li><strong>Drops</strong> after a change? Run a <a href="/">free SEO check</a> on the page to spot what broke.</li></ul>`,
    faqs: [["Do I need to connect my Google account?", "No. You download the export from Search Console yourself and upload it here. We never see your Google login or your data – the report is built in your browser."], ["Can it track rankings in different countries?", "Yes. Add a Country filter in Search Console before exporting, or type the region in the box. Each website and region keeps its own history in your browser."], ["How often should I upload?", "Weekly is ideal. Search Console data is usually two or three days behind, and weekly snapshots show clear trends without daily noise."], ["Where is my history saved?", "In your browser's local storage, on this device only. Clearing your browser data or pressing 'Delete saved history' removes it."]],
  },
  {
    path: "/seo-content-editor", crumb: "SEO content editor", parent: P, title: "SEO Content Editor | Free Writing & Optimisation Tool",
    desc: "Free SEO content editor: get a live score, the related terms top-ranking pages use, questions to answer and a target length as you write. No sign-up.",
    h1: "Free SEO content editor", eyebrow: "Free · Runs in your browser", app: "XKey SEO content editor", form: "editor",
    lead: "Write content that ranks. Add your keyword and the pages that rank now, then write – the score, related terms and questions update as you type.",
    sections: `<h2>How does the content editor work?</h2>
<ol><li><strong>Enter the search phrase</strong> you want the page to rank for. Not sure which? Use the <a href="/keyword-generator">long-tail keyword generator</a>.</li><li><strong>Add the pages that rank top</strong> for it today (search Google yourself and copy the addresses). We read them and work out their typical length, the terms they all use and the questions they answer.</li><li><strong>Write or paste your draft.</strong> Headings from Word or Google Docs are kept. The score and checklist update as you type.</li></ol>
<p>Your draft is saved in your browser so you can come back to it, and it's never sent to us. When you're done, copy it as HTML into your website.</p>
<h2>What does the score measure?</h2>
<ul><li>Your keyword in the title, a heading and the first 100 words – where Google looks first.</li><li>Natural keyword use, not stuffing (around 0.5–2.5% of words).</li><li>Length compared with the pages that rank now.</li><li>Coverage of the related terms and questions those pages share – the signs of a complete answer.</li><li>Readability: short sentences and plain words.</li></ul>
<h2>Will a high score guarantee page one?</h2>
<p>No tool can promise that. Content is one part; links from other sites, page speed and how well the page meets the searcher's need all matter too. But a page that covers the topic as fully as the current top results, in clearer language, gives Google a real reason to rank it. Treat the related terms as ideas for what to explain, not words to repeat.</p>`,
    faqs: [["Is this like SurferSEO or Clearscope?", "It works the same way – comparing your draft with the pages that rank – but it's free, needs no account, and you choose the competing pages yourself, so you see exactly what you're measured against."], ["Does it write the content for me?", "No – it guides you while you write. For titles and descriptions, the AI title & description writer can suggest wording."], ["Why do I have to paste the competing pages?", "Fetching Google's results automatically breaks Google's rules. Searching yourself takes seconds and shows the real results for your location."]],
  },
  {
    path: "/toxic-backlink-checker", crumb: "Toxic backlink checker", parent: P, title: "Toxic Backlink Checker | Free Spam Link Audit & Disavow",
    desc: "Free toxic backlink checker: grade the sites linking to you for spam, check your anchor text mix and make a Google disavow file. No sign-up.",
    h1: "Free toxic backlink checker", eyebrow: "Free · No sign-up", app: "XKey toxic backlink checker", form: "baudit",
    lead: "Find spammy sites linking to you, see whether your anchor text looks natural, and build a disavow file if you really need one.",
    sections: `<h2>What does the backlink audit check?</h2>
<ul><li><strong>Risky linking sites.</strong> Each of your strongest linking websites is graded for common spam signs: endings favoured by spammers, gambling, adult or pharmacy words, link-directory and "SEO" sites, machine-made names, and sites with almost no links of their own.</li><li><strong>Anchor text.</strong> We read the home pages of those sites and collect the wording of their links to you. A natural profile is mostly your brand name and web address; lots of exact keyword phrases is a classic sign of bought links.</li><li><strong>Disavow file.</strong> Tick the domains you want Google to ignore and download a ready-made disavow.txt.</li></ul>
<p>The link data comes from Common Crawl's public web graph – the same index as our <a href="/backlink-checker">backlink checker</a> and <a href="/domain-authority-checker">domain authority checker</a>.</p>
<h2>Do toxic backlinks hurt rankings?</h2>
<p>Usually not. Google says its systems ignore most spammy links automatically, so a handful of junk links from scraper sites is normal for any website. Links become a problem when someone has <em>bought</em> or built them to manipulate rankings – then Google may ignore them all or, in serious cases, issue a manual action, which you'll see in Search Console under <strong>Security &amp; manual actions</strong>.</p>
<h2>Should I disavow links?</h2>
<p>Only if you have a manual action for unnatural links, or you know links were bought (for example by a previous SEO agency) and can't get them removed. Disavowing good links throws away their value. Upload the file at Google's disavow links tool for your Search Console property.</p>
<h2>What can't this audit see?</h2>
<p>The web graph lists which websites link to you, not every individual page, so we grade your 50 strongest linking sites and read anchor text from their home pages only. Paid tools crawl deeper; for most small businesses this is enough to spot a problem.</p>`,
    faqs: [["What is a toxic backlink?", "A link from a spammy or low-quality website – often from link farms, hacked sites or paid link schemes – that exists to manipulate rankings rather than help readers."], ["Can a competitor hurt me with bad links (negative SEO)?", "It's rare. Google is good at ignoring links you didn't build. If you see a sudden flood of spam links and a drop in rankings at the same time, audit them here and consider a disavow."], ["How often is the data updated?", "Common Crawl publishes a new web graph every few months, and we load each one as soon as it's out."]],
  },
  {
    path: "/competitor-ads-checker", crumb: "Competitor ad checker", parent: P, title: "Competitor Ad Checker | See Rivals' Google & Facebook Ads",
    desc: "Free competitor ad checker: see if a rival uses Google Ads, Facebook, TikTok, LinkedIn or Bing ads, and open every ad they run in the official libraries.",
    h1: "Competitor ad checker", eyebrow: "Free · No sign-up", app: "XKey competitor ad checker", form: "ads",
    lead: "Find out whether a competitor is paying for Google, Facebook, TikTok or LinkedIn ads – and see the actual ads they're running.",
    sections: `<h2>How does the competitor ad checker work?</h2>
<p>Businesses that advertise put a tracking tag on their website so the ad platform can count sales and leads. We read the competitor's home page and list every advertising tag we recognise – Google Ads, the Meta (Facebook) Pixel, Microsoft Advertising, LinkedIn, TikTok, Pinterest, X, Snapchat, Criteo and more – with what each one tells you.</p>
<p>Then we link you straight into the official ad libraries, already searched for that competitor:</p>
<ul><li><strong>Google Ads Transparency Centre</strong> – every search, Shopping, YouTube and display ad the advertiser has run, with dates and the countries shown.</li><li><strong>Meta Ad Library</strong> – live Facebook and Instagram ads, with the creative and when each started.</li><li><strong>LinkedIn Ad Library</strong> and <strong>TikTok Ad Library</strong> – sponsored posts and video ads.</li></ul>
<h2>Can I see how much a competitor spends on ads?</h2>
<p>Not accurately – and no free or paid tool can. Google and Meta don't publish spend for ordinary UK advertisers. Tools that quote ad budgets are estimating from guessed click prices. What you <em>can</em> see is far more useful: which platforms they use, which ads they keep running (long-running ads are usually the ones that work) and which offers and landing pages they push.</p>
<h2>How do I use this to win more customers?</h2>
<ul><li>Note the services and offers they advertise – those are the searches worth money. Make sure you have a strong page for each, and check it with the <a href="/seo-content-editor">SEO content editor</a>.</li><li>Ranking organically for the same searches gets you the same customers without paying per click. Compare your sites with the <a href="/seo-comparison">competitor comparison</a>.</li><li>Check which of their pages have links with the <a href="/backlink-checker">backlink checker</a>.</li></ul>`,
    faqs: [["Is it legal to look at competitors' ads?", "Yes. The ad libraries are public on purpose, for transparency, and reading a website's public code is what every browser does."], ["Why wasn't a tag found when I know they advertise?", "Some sites load tags only after a visitor accepts cookies, or through Google Tag Manager. The ad libraries still show their ads."], ["Does this work for any country?", "The tag check works for any website. The library links open UK results; you can change the country inside each library."]],
  },
  {
    path: "/uptime-monitor", crumb: "Uptime monitor", parent: P, title: "Free Website Uptime Monitor | Instant Alerts, No Sign-Up",
    desc: "Free uptime monitor: we check your site every 15 minutes and alert your phone, Slack or Teams the moment it goes down, slows or loses its database.",
    h1: "Free website uptime monitor", eyebrow: "Free · No sign-up · No email", app: "XKey uptime monitor", form: "uptime",
    lead: "Know the moment your website goes down, slows to a crawl or loses its database – before customers or Google notice.",
    sections: `<h2>What does the uptime monitor check?</h2>
<ul><li><strong>Is the site up?</strong> Every 15 minutes we load your page. Server errors (5xx), timeouts, refused connections, DNS and certificate failures all count as down.</li><li><strong>Database and server crashes.</strong> Many broken sites still answer "200 OK" with an error page. We spot "Error establishing a database connection", WordPress critical errors, PHP fatal errors, suspended hosting accounts and Cloudflare 52x pages.</li><li><strong>Slowdowns.</strong> If your server takes over 4 seconds to answer, you get a "slow" alert, and another when it's fast again.</li><li><strong>Response time history</strong> and uptime for today, 7 and 30 days, with a list of every incident.</li></ul>
<p>Every failure is re-checked a few seconds later before an alert goes out, so a single blip doesn't wake you up.</p>
<h2>How do I get alerts?</h2>
<ul><li><strong>Phone notifications:</strong> install the free <a href="https://ntfy.sh/" rel="noopener">ntfy</a> app (Android and iPhone, no account), subscribe to a topic name only you know, and enter that name above.</li><li><strong>Slack, Discord or Microsoft Teams:</strong> create an "incoming webhook" in the channel's settings and paste its address.</li></ul>
<h2>Why does downtime matter for SEO?</h2>
<p>If Googlebot finds your site down, it slows its crawling, and pages that keep failing can drop out of search results. Slow servers also hurt Core Web Vitals. Short outages are forgiven; long or repeated ones cost rankings and customers. An alert lets you call your host straight away.</p>
<p>For a one-off check, use the <a href="/website-down-checker">website down checker</a>. For weekly SEO health, add <a href="/seo-monitoring">SEO monitoring</a>.</p>`,
    faqs: [["Is it really free with no sign-up?", "Yes. You get a private dashboard link – bookmark it. Anyone with the link can see the dashboard, so only share it with people you trust."], ["How often is my site checked?", "About every 15 minutes, from Cloudflare's network. The dashboard shows the time of the last check."], ["Will the monitor slow my site down?", "No. It's one page request every 15 minutes – far less than a single visitor."], ["How do I stop monitoring?", "Press 'Stop monitoring' on your dashboard. Your site's history is deleted within 15 minutes."]],
  },
  {
    path: "/website-analytics", crumb: "Website analytics", parent: P, title: "Free Website Analytics | No Cookies, No Sign-Up",
    desc: "Free, cookie-free website analytics: live visitors, top pages, traffic sources, devices and conversions. A Google Analytics alternative in one line of code.",
    h1: "Free website analytics without cookies", eyebrow: "Free · No sign-up · No cookies", app: "XKey website analytics", form: "analytics",
    lead: "See who's on your site right now, where visitors come from and which pages turn them into customers – with one line of code and no cookie banner.",
    sections: `<h2>What does it track?</h2>
<ul><li><strong>Live visitors</strong> – people on your site in the last 30 minutes.</li><li><strong>Visitors and pageviews</strong> per day, for today, 7, 30 or 90 days.</li><li><strong>Top pages</strong>, <strong>where visitors came from</strong> (Google, social media, other websites), <strong>countries</strong> and <strong>devices</strong>.</li><li><strong>Conversions:</strong> phone-number and email clicks are counted automatically. Add <code>data-xkey-goal="Quote form"</code> to any button or link to count it as a goal, and see your conversion rate.</li><li><strong>Outbound clicks</strong> – which other websites visitors leave to.</li></ul>
<h2>How is it private?</h2>
<p>No cookies, no local storage and no fingerprinting. A visitor is counted with a one-way code made from their connection and browser plus a secret that changes every day, so nobody – including us – can follow a person between days or sites. We store totals, not people. That's why you don't need a cookie banner for it under UK GDPR and PECR guidance on strictly anonymous statistics – though you should mention it in your privacy policy.</p>
<h2>How do I add it to my site?</h2>
<p>Enter your address above and you'll get a private dashboard and one line of code to paste before <code>&lt;/head&gt;</code> – in WordPress use a header-scripts plugin or your theme's settings; in Wix, Squarespace or Shopify use the "custom code" setting. Visits start showing within seconds.</p>
<h2>Will it slow my site down?</h2>
<p>The script is under 1 kB, loads after your page (<code>defer</code>) and sends one tiny message per page. It won't affect your Core Web Vitals.</p>`,
    faqs: [["Is this a replacement for Google Analytics?", "For most small business sites, yes: it answers the everyday questions – how many visitors, from where, to which pages, and how many got in touch. Google Analytics is still better for advertising audiences and complex funnels."], ["Are there limits?", "Up to 5,000 pageviews a day per site are counted, which covers most small businesses. Data is kept for 400 days."], ["Who can see my stats?", "Anyone with your private dashboard link. Keep it to yourself, like a password."], ["Does it count bots?", "Known bots and crawlers are ignored, and visits from other websites using your code aren't counted."]],
  },
  {
    path: "/brand-monitoring", crumb: "Brand monitoring", parent: P, title: "Free Brand Monitoring Tool | Track Mentions & Win Links",
    desc: "Free brand monitoring: find new mentions of your business in Google, news, reviews and forums, and turn unlinked mentions into links that help you rank.",
    h1: "Free brand monitoring tool", eyebrow: "Free · Runs in your browser", app: "XKey brand monitoring", form: "brand",
    lead: "Find out what the web is saying about your business, get alerts for new mentions, and turn mentions without a link into links that help you rank.",
    sections: `<h2>What does brand monitoring cover?</h2>
<ul><li><strong>New mentions</strong> of your business name everywhere except your own site – this week, in the news, in reviews and complaints, on Reddit and forums, YouTube and Bing – each one a single click away.</li><li><strong>Free alerts:</strong> one click sets up a Google Alert, so Google emails you when it finds a new page mentioning you.</li><li><strong>Unlinked mentions:</strong> paste the pages you found and we check each one for your name and a link to your site. A mention without a link is the easiest link you'll ever earn – just ask the writer to add it.</li><li><strong>Copied content and negative SEO:</strong> shortcuts to the <a href="/plagiarism-checker">plagiarism checker</a> and the <a href="/toxic-backlink-checker">toxic backlink checker</a>.</li></ul>
<h2>Why do brand mentions matter for SEO?</h2>
<p>Links from other websites are still one of Google's strongest ranking signals, and mentions of your business on trusted sites help Google – and AI assistants like ChatGPT – understand who you are. Watching for mentions also lets you answer complaints quickly and spot anyone pretending to be you.</p>
<h2>How is this different from paid tools?</h2>
<p>Paid tools run their own web crawls and send a daily digest. We use the search engines' own, far bigger indexes: you run the searches in your browser (which keeps within Google's rules) and Google Alerts does the watching for free. The trade-off is a few clicks a week instead of an automatic report.</p>`,
    faqs: [["How do I ask for a link from an unlinked mention?", "Email the writer or site owner, thank them for the mention, and ask if they'd add a link to your site so readers can find you. Keep it short and friendly – most people say yes."], ["Is my search history stored?", "No. The searches run in your browser and the link check only fetches the pages you paste."], ["What if someone has copied my website?", "Ask them to remove it first. If they won't, you can file a copyright removal request with Google and contact their web host."]],
  },
  {
    path: "/wordpress-seo-plugin", crumb: "WordPress SEO fixer", parent: P, title: "Free WordPress SEO Plugin | Fix Alt Text, Descriptions & H1s",
    desc: "Free WordPress SEO plugin that fixes missing alt text, missing meta descriptions, extra H1s and broken internal links in one click – every change undoable.",
    h1: "Free WordPress SEO fixer plugin", eyebrow: "Free · GPL · No account", app: "XKey SEO Fixer for WordPress", form: "wpplugin",
    lead: "XKey tells you what to fix. This free plugin fixes the most common problems inside WordPress, in one click – and every change can be undone.",
    sections: `<h2>What does the plugin fix?</h2>
<ul><li><strong>Missing image alt text</strong> – fills it in from each image's title in the media library and in your posts (camera-style file names like IMG_1234 are left for you to describe).</li><li><strong>Missing meta descriptions</strong> – writes one from the excerpt or first sentences of each page, straight into Yoast SEO, Rank Math or SEOPress if you use them, or adds the tag itself if you don't.</li><li><strong>Extra H1 headings</strong> – your theme already prints the page title as the H1, so H1s inside the content become H2s (classic and block editor).</li><li><strong>Broken internal links</strong> – finds links to pages on your own site that no longer exist and points them at the page with the same name, or removes the link and keeps the text.</li></ul>
<h2>Is it safe?</h2>
<p>Nothing changes until you click. You see each proposed fix first, can fix one at a time or all of one type, and WordPress keeps a revision of every post the plugin edits – so any change can be undone from the post's Revisions screen. The plugin sends no data anywhere and has no ads or upsells.</p>
<h2>How do I install it?</h2>
<ol><li>Download the ZIP above.</li><li>In WordPress go to <strong>Plugins → Add New → Upload Plugin</strong>, choose the file and click <strong>Install Now</strong>, then <strong>Activate</strong>.</li><li>Open <strong>Tools → XKey SEO Fixer</strong>, review the issues and click to fix.</li></ol>
<p>Then run a <a href="/">free SEO check</a> or a <a href="/website-audit">website audit</a> to see what's left – titles, speed and content need a human touch. Not on WordPress? Our <a href="/guides/shopify-seo">Shopify</a> and other builder guides explain the same fixes step by step.</p>`,
    faqs: [["Does it work with Yoast, Rank Math or SEOPress?", "Yes. It writes meta descriptions into their fields, so they show in their editors as normal. With All in One SEO it lists the pages and points you to its bulk editor."], ["Will it slow my site down?", "No. It only runs in the admin area when you open it, apart from printing one meta description tag on pages it wrote a description for when no SEO plugin is active."], ["Is there a Shopify app?", "Not yet. Shopify's built-in editor covers alt text and descriptions; our Shopify guide shows where."]],
  },
];
