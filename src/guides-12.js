// Bundle of guides: problems owners search when something goes wrong (traffic drops, "not secure"),
// mobile sites and analytics basics, plus two sectors written around how their customers search.

export const GUIDES_12 = [
  {
    path: "/guides/why-has-my-website-traffic-dropped", crumb: "Why has my traffic dropped?", parent: ["/guides", "Guides"], article: true,
    title: "Why Has My Website Traffic Dropped? How to Find the Cause",
    desc: "Why website traffic drops: tracking faults, Google updates, lost rankings, technical errors, seasonality or AI Overviews, and how to find which it is.",
    h1: "Why has my website traffic dropped?",
    lead: "A sudden fall in visitors is worrying, but you can usually find the cause in under an hour. Work through these checks in order: the first ones are the most common and the quickest to rule out.",
    sections: `<h2>Is it a real drop or a tracking problem?</h2>
<p>Compare your <a href="/guides/google-analytics-for-beginners">Google Analytics</a> figures with <a href="/guides/google-search-console">Google Search Console</a>. If Search Console clicks are steady but analytics fell, the tracking code may have been removed in a redesign, broken by a plugin or blocked by a new cookie banner that only counts visitors who accept. Fix the tracking before changing anything else.</p>
<h2>Did something change on the website?</h2>
<p>Most self-inflicted drops follow a change. Check whether recently:</p>
<ul><li>The site was redesigned or moved platform, changing page addresses without 301 redirects. See <a href="/guides/website-redesign-seo">website redesign SEO</a> and test old addresses with the <a href="/redirect-checker">redirect checker</a>.</li><li>A page or the whole site was set to noindex, or robots.txt started blocking Google. Test it with the <a href="/robots-txt-tester">robots.txt tester</a>.</li><li>Pages were deleted, merged or had their main text cut.</li><li>The site went down or became very slow. Try the <a href="/website-down-checker">website down checker</a>.</li></ul>
<p>Run a <a href="/">free SEO check</a> on your key pages: anything marked critical is a likely cause.</p>
<h2>Which pages and searches lost traffic?</h2>
<p>In Search Console, open Performance, compare the last 28 days with the previous period and sort pages and queries by the change in clicks. A drop across the whole site points to a technical problem or a Google update; a drop on a few pages points to those pages, or to a competitor overtaking them.</p>
<h2>Was there a Google update?</h2>
<p>Google makes several big "core updates" a year, plus spam updates. If your drop lines up with one, Google's advice is not to make quick fixes but to improve the pages that fell: make them more useful, more original and clearer about who wrote them. See <a href="/guides/what-is-eeat">E-E-A-T</a>. Also check Search Console's Manual actions and Security issues reports; both should say no issues detected.</p>
<h2>Could it be seasonal, or AI answers?</h2>
<ul><li><strong>Seasonality:</strong> compare with the same month last year. Many businesses are quieter in summer or after Christmas.</li><li><strong>AI Overviews:</strong> if impressions held up but clicks fell for question searches, Google may now answer them on the results page. See <a href="/guides/ai-search-optimisation">AI search optimisation</a>.</li><li><strong>Competitors:</strong> check who now ranks above you, and compare their page with yours in the <a href="/seo-comparison">SEO comparison tool</a>.</li></ul>`,
    faqs: [["How long does it take to recover from a traffic drop?", "Technical mistakes such as noindex or missing redirects can recover within weeks of fixing them. Drops after a core update often take until the next update, or longer, to recover."], ["Should I disavow links after a traffic drop?", "Rarely. Google ignores most spammy links on its own. Only consider it if you have a manual action for unnatural links, or know links were bought."], ["Can I stop traffic drops happening again?", "Set up free SEO monitoring, check Search Console monthly and test redirects whenever you change the site."]],
  },
  {
    path: "/guides/website-not-secure", crumb: "Website not secure warning", parent: ["/guides", "Guides"], article: true,
    title: "Website \"Not Secure\" Warning? Fix It With HTTPS",
    desc: "Why browsers mark a site \"Not secure\", how to fix it with a free SSL certificate and HTTPS redirects, and how to find mixed content.",
    h1: "How to fix a \"Not secure\" warning on your website",
    lead: "If Chrome shows \"Not secure\" next to your website address, visitors see it too – and many leave, especially before filling in a form. The fix is HTTPS, which is free on almost every host and takes minutes to switch on.",
    sections: `<h2>Why does my website say "Not secure"?</h2>
<p>Browsers show the warning when a page loads over plain <code>http://</code> instead of <code>https://</code>. Without HTTPS, anything typed into the page could be read or changed on the way. You may also see it on an https site if the certificate has expired or doesn't cover the address used, for example the www version.</p>
<h2>Does HTTPS affect SEO?</h2>
<p>Yes, a little directly – Google uses HTTPS as a light ranking signal – and a lot indirectly, because people trust and stay on secure sites. Google indexes the https version of a page when it can.</p>
<h2>How do I switch my website to HTTPS?</h2>
<ol><li><strong>Get a certificate.</strong> Wix, Squarespace and Shopify add one automatically. Most hosts offer free Let's Encrypt certificates in their control panel, often called "SSL" or "AutoSSL". Cloudflare can also provide one.</li><li><strong>Redirect http to https</strong> with a 301 redirect for every page, not just the home page. Many hosts have a "force HTTPS" switch; WordPress sites may need the site address updated under Settings → General too.</li><li><strong>Update internal links</strong>, canonical tags and your sitemap to use https addresses.</li><li><strong>Add the https version</strong> to Google Search Console if you use the URL-prefix method, or use a domain property, which covers both.</li></ol>
<h2>What is mixed content?</h2>
<p>A page loaded over https that pulls in images, scripts or styles over http is mixed content. Browsers block insecure scripts and may drop the padlock for insecure images. Fix it by changing those addresses to https, or removing them. WordPress users can search the database for old http links with a search-and-replace plugin.</p>
<h2>How do I check my HTTPS setup?</h2>
<p>Use the free <a href="/ssl-checker">SSL checker</a> to see your certificate, its expiry date, the http to https redirect, HSTS and mixed content on your home page. Our <a href="/">SEO check</a> tests HTTPS on any page, and the <a href="/redirect-checker">redirect checker</a> shows every hop from the http address. See the <a href="/guides/technical-seo-checklist">technical SEO checklist</a> for what to check next.</p>`,
    faqs: [["Do I have to pay for an SSL certificate?", "Usually not. Free certificates protect visitors just as well as paid ones for a normal business website."], ["Will moving to HTTPS lose my rankings?", "Not if every http address redirects with a 301 to its https version. Expect a short wobble while Google recrawls."], ["What is HSTS?", "A header telling browsers to always use https for your site. Add it once HTTPS works everywhere."]],
  },
  {
    path: "/guides/mobile-friendly-website", crumb: "Mobile-friendly website", parent: ["/guides", "Guides"], article: true,
    title: "Is Your Website Mobile Friendly? Checks and Fixes",
    desc: "Why a mobile-friendly website matters for Google rankings, the problems that annoy phone visitors most, and how to test and fix your site for free.",
    h1: "How to make your website mobile friendly",
    lead: "Most visitors to a small business website arrive on a phone, and Google ranks sites based on their mobile version. If your site is fiddly on a phone, you lose both rankings and customers. Most fixes are quick.",
    sections: `<h2>Why does mobile matter for SEO?</h2>
<p>Google uses mobile-first indexing: it crawls and ranks your site based on what a phone sees. Text, links or structured data that only appear on the desktop version may not count. And people searching on a phone leave quickly if a page is slow or hard to use, which costs you the enquiry even if you rank.</p>
<h2>What makes a website mobile friendly?</h2>
<ul><li><strong>A viewport tag</strong> – <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> – so the page fits the screen. Don't block pinch-zoom.</li><li><strong>Readable text</strong> without zooming: roughly 16px for body text.</li><li><strong>Big tap targets</strong>: buttons and links at least about 44px high with space between them.</li><li><strong>No sideways scrolling</strong>: images, tables and embeds that fit the screen.</li><li><strong>Tap-to-call and tap-to-email links</strong> so customers can contact you in one tap.</li><li><strong>No pop-ups covering the content</strong> as soon as the page opens.</li><li><strong>Fast loading</strong> on mobile data. See <a href="/guides/core-web-vitals">Core Web Vitals</a> and <a href="/guides/image-seo">image SEO</a>.</li></ul>
<h2>How do I test my site on mobile?</h2>
<ol><li>Open it on your own phone and try to do what a customer would: find a price, call you, fill in the form.</li><li>Run a <a href="/">free SEO check</a>: it tests the viewport, tap-to-contact links, image sizes and speed signals.</li><li>In Chrome on a computer, right-click → Inspect, then click the phone icon to preview different screens.</li><li>Check the Core Web Vitals report in <a href="/guides/google-search-console">Google Search Console</a> for real-visitor data.</li></ol>
<h2>How do I fix an old site that isn't mobile friendly?</h2>
<p>If your site was built before about 2015 and has no mobile layout, patching it is rarely worth it: move to a responsive theme or a modern builder, keeping the same page addresses or adding 301 redirects. Read <a href="/guides/website-redesign-seo">website redesign SEO</a> first.</p>`,
    faqs: [["Does Google still have a mobile-friendly test?", "Google retired its standalone Mobile-Friendly Test in 2023. Use Lighthouse in Chrome, Search Console's Core Web Vitals report and our SEO check instead."], ["Should my mobile site have less content?", "No. Keep the same main content on mobile and desktop; you can tidy it with menus and expandable sections."], ["Do I need a separate mobile website?", "No. A responsive design that adapts to the screen is simpler and what Google recommends."]],
  },
  {
    path: "/guides/google-analytics-for-beginners", crumb: "Google Analytics for beginners", parent: ["/guides", "Guides"], article: true,
    title: "Google Analytics 4 for Beginners: Set It Up and Read It",
    desc: "Google Analytics 4 for small business owners: how to set it up, the few reports worth checking, how to track enquiries, and what it can't tell you.",
    h1: "Google Analytics for beginners",
    lead: "Google Analytics shows how many people visit your website, where they come from and what they do. Google Analytics 4 (GA4) replaced the old version in 2023 and looks very different. You only need a handful of its reports to run a small business site.",
    sections: `<h2>How do I set up Google Analytics 4?</h2>
<ol><li>Go to analytics.google.com, sign in with the Google account your business uses and create a property for your website.</li><li>Add a "Web" data stream with your site address. Google gives you a measurement ID starting with G-.</li><li>Paste that ID into your website: Wix, Squarespace and Shopify have a box for it in their settings; on WordPress, use Google's Site Kit plugin or your theme's settings.</li><li>Visit your site and check the Realtime report shows you.</li></ol>
<p>Under UK law you need visitors' consent before setting analytics cookies, so use a cookie banner that only loads Analytics after consent. That means Analytics will under-count visitors who decline.</p>
<h2>Which reports should a small business check?</h2>
<ul><li><strong>Reports → Acquisition → Traffic acquisition</strong>: how visitors arrive – Organic Search (Google and Bing), Direct, Referral, Organic Social, Paid Search.</li><li><strong>Reports → Engagement → Pages and screens</strong>: which pages get the most views.</li><li><strong>Reports → Engagement → Events</strong>: actions such as form submissions and clicks on your phone number, once you set them up.</li></ul>
<h2>How do I track enquiries in Google Analytics?</h2>
<p>Enquiries matter more than visits. Mark the actions that bring you business as "key events": a thank-you page after the contact form, clicks on <code>tel:</code> and <code>mailto:</code> links, or a booking confirmation. GA4's enhanced measurement records some clicks automatically; others need setting up in Admin → Events or with Google Tag Manager.</p>
<h2>What's the difference between Analytics and Search Console?</h2>
<p>Analytics shows what visitors do once they reach your site, from every source. <a href="/guides/google-search-console">Google Search Console</a> shows how your site performs in Google search before the click: the searches you appear for, your position and how many people clicked. Link the two in Analytics to see both together.</p>
<h2>Are there simpler alternatives?</h2>
<p>Yes. Privacy-friendly tools such as Plausible, Fathom or your website builder's own statistics are simpler, and some don't need a cookie banner. They show fewer details, but often enough for a small business. Our <a href="/website-technology-checker">website technology checker</a> shows which analytics a site uses.</p>`,
    faqs: [["Is Google Analytics free?", "Yes, GA4 is free for normal business websites."], ["Why don't Analytics and Search Console numbers match?", "They measure different things: Search Console counts clicks from Google search, while Analytics counts visits from every source, and only from visitors who accepted cookies."], ["Do I still need Universal Analytics?", "No. Universal Analytics stopped collecting data in 2023 and has been shut down. GA4 is the current version."]],
  },
  {
    path: "/guides/seo-for-therapists-and-counsellors", crumb: "SEO for therapists and counsellors", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Therapists, Counsellors and Psychotherapists",
    desc: "SEO for UK therapists and counsellors: rank for local and online therapy searches, write pages clients trust, use directories and protect client privacy.",
    h1: "SEO for therapists and counsellors",
    lead: "People searching for a therapist are often taking a difficult first step. They want to know you understand their problem, that you're qualified and that getting in touch will be easy. A website that shows this clearly can rank well without any hard selling.",
    sections: `<h2>How do clients search for a therapist?</h2>
<ul><li><strong>By problem and place:</strong> "anxiety counselling Blackpool", "couples therapy Lancaster", "bereavement counsellor near me".</li><li><strong>By type of therapy:</strong> "CBT therapist Preston", "EMDR therapy Lancashire".</li><li><strong>Online:</strong> "online counselling UK", "therapy over Zoom" – searches you can win from anywhere in the country.</li><li><strong>By cost:</strong> "how much does counselling cost", "low cost counselling".</li></ul>
<p>Create a page for each main issue or therapy you work with, written in warm, plain language, and mention where you see clients in person. Find more searches with the <a href="/keyword-generator">keyword generator</a>.</p>
<h2>What should a therapist's website include?</h2>
<ul><li>Your qualifications and membership of a professional body such as BACP, UKCP or BABCP, with a link to your register entry.</li><li>A real photo and a short, human "about me".</li><li>Fees, session length, and whether you offer concessions or online sessions.</li><li>What the first session is like and how to book it.</li><li>Answers to common worries: confidentiality, how many sessions people need, what if it doesn't feel right.</li></ul>
<p>These pages build the trust Google looks for on health topics – see <a href="/guides/what-is-eeat">E-E-A-T</a>.</p>
<h2>Do therapy directories help with SEO?</h2>
<p>Yes. Directories such as Counselling Directory, Psychology Today and your professional body's register often rank highly for therapy searches, send real enquiries and link to your site. Keep your details identical everywhere – see <a href="/guides/business-directory-listings">business directory listings</a>.</p>
<h2>How do I handle reviews and privacy?</h2>
<p>Many professional bodies discourage asking clients for testimonials, so check your ethical framework first. A <a href="/guides/google-business-profile">Google Business Profile</a> still helps local searches even with few reviews. Never reply to a review in a way that confirms someone is a client. If you work from home, you can hide your address and show a service area instead.</p>`,
    faqs: [["Should a therapist blog?", "Articles that answer questions clients ask – what happens in CBT, how to support a partner with anxiety – can rank and show your approach. Keep them accurate and avoid giving clinical advice to individuals."], ["Is it worth targeting online therapy searches?", "Yes, if you offer online sessions. They're competitive nationally, so pair them with specific issues or approaches you specialise in."], ["Can I use Google Ads for therapy?", "Yes, but health advertising has extra rules, so check Google's policies. SEO and directories bring steady enquiries without paying per click."]],
  },
  {
    path: "/guides/seo-for-independent-shops", crumb: "SEO for independent shops", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Independent Shops on the High Street",
    desc: "SEO for independent high street shops: get found in local searches, show what you stock, appear in Google's in-store listings and win against chains.",
    h1: "SEO for independent shops",
    lead: "Shoppers increasingly search before they visit: \"bike shop near me open now\", \"where to buy wool in Lytham\". Independent high street shops can win these searches against the chains by showing exactly what they stock, when they're open and why they're worth the trip.",
    sections: `<h2>How do shoppers search for local shops?</h2>
<ul><li><strong>Shop type and place:</strong> "independent bookshop Blackpool", "deli Lytham", "toy shop Fleetwood".</li><li><strong>A product nearby:</strong> "buy fishing bait near me", "where to buy Lego in Preston".</li><li><strong>Right now:</strong> "card shop open now", "hardware shop open Sunday".</li></ul>
<h2>How do I get my shop into Google Maps results?</h2>
<p>Set up and complete your <a href="/guides/google-business-profile">Google Business Profile</a>: the right main category, accurate opening hours (including bank holidays), photos of the shop front so people recognise it, and the inside so they want to visit. Post new stock and events as updates, and ask happy customers for reviews – see <a href="/guides/how-to-get-google-reviews">how to get Google reviews</a>. Follow the <a href="/guides/local-seo-checklist">local SEO checklist</a> for the rest.</p>
<h2>Can Google show what my shop has in stock?</h2>
<p>Yes. Through Google Merchant Center, shops can show local products in Google search, Maps and the Shopping tab, with "in stock nearby" labels. Several till and shop systems can send your stock to Google automatically. Even without that, a Business Profile product list helps people see what you sell.</p>
<h2>What should a shop's website include?</h2>
<ul><li>A page for each main product range ("walking boots", "wool and yarn"), naming the brands you stock and your town – brands are searched far more than shop names.</li><li>Opening hours, parking, accessibility and a map on the contact page.</li><li>Services that chains don't offer: fitting, repairs, ordering in, local delivery, click and collect.</li><li>If you sell online too, follow our <a href="/guides/product-page-seo">product page SEO guide</a>.</li></ul>
<h2>How do shops earn local links?</h2>
<p>Join your town's business association or BID website, sponsor local clubs and events, get featured in "shop local" guides and local press, and work with neighbouring businesses on events. Check what you already have with the <a href="/backlink-checker">backlink checker</a>, and see <a href="/guides/how-to-get-backlinks">how to get backlinks</a>.</p>`,
    faqs: [["Do independent shops need a website if they have Google Business Profile?", "A profile is essential, but a website lets you rank for product and brand searches, show your full range and earn links."], ["Can a small shop beat the chains in Google?", "Often, for local searches. Google looks at relevance, distance and prominence, and independents usually have better reviews and more specific pages."], ["Should I list every product on my website?", "Not if you don't sell online. Pages for each range and the brands you stock are enough, kept up to date."]],
  },
];
