// Bundle of guides: email that reaches the inbox (feeds the email checkers), what a website costs and
// who should build it, and the two AI answer engines owners ask about most.

export const GUIDES_11 = [
  {
    path: "/guides/why-are-my-emails-going-to-spam", crumb: "Why are my emails going to spam?", parent: ["/guides", "Guides"], article: true,
    title: "Why Are My Emails Going to Spam? How to Fix It",
    desc: "Why business emails land in spam: missing SPF, DKIM or DMARC records, a poor sender reputation or spammy content, with free checks and simple fixes.",
    h1: "Why are my business emails going to spam?",
    lead: "If customers keep finding your quotes and invoices in their spam folder, the cause is usually fixable in an afternoon. Most of the time it's missing email records on your domain, followed by sender reputation and what's in the email itself.",
    sections: `<h2>What are the most common reasons emails go to spam?</h2>
<ol><li><strong>Missing or broken SPF, DKIM or DMARC records.</strong> Gmail, Yahoo and Outlook check these to confirm an email really came from your domain. Without them, your email looks like it could be forged.</li><li><strong>Sending through a service your records don't mention</strong> – a booking system, invoicing app or newsletter tool that sends "from" your address without being added to SPF and DKIM.</li><li><strong>A poor sender reputation</strong> – your domain or the server you send through has been used for spam, or many recipients marked your emails as spam.</li><li><strong>The content</strong> – lots of links, link shorteners, image-only emails, attachments people didn't expect, or wording that reads like a sales blast.</li><li><strong>Sending from a free address</strong> such as Gmail or Hotmail through a business tool, which those providers block.</li></ol>
<h2>How do I check my email records?</h2>
<p>Enter your domain in our free checkers – nothing to sign up for:</p>
<ul><li><a href="/spf-checker">SPF checker</a> – lists every service allowed to send for you and counts DNS lookups (more than 10 breaks SPF).</li><li><a href="/dkim-checker">DKIM checker</a> – tests whether your emails are signed.</li><li><a href="/dmarc-checker">DMARC checker</a> – shows your policy and where reports go.</li><li><a href="/mx-lookup">MX lookup</a> – confirms which provider receives your email.</li></ul>
<p>To set the records up for Microsoft 365, Google Workspace and other providers, follow our guide to <a href="/guides/spf-dkim-dmarc-setup">setting up SPF, DKIM and DMARC</a>.</p>
<h2>What rules do Gmail, Yahoo and Outlook have for senders?</h2>
<p>Since 2024, Gmail and Yahoo require every sender to have SPF or DKIM and to send from a domain with valid DNS, and require anyone sending around 5,000 or more emails a day to them to have SPF, DKIM and DMARC, a one-click unsubscribe on marketing emails and a low spam complaint rate. Microsoft brought in similar rules for Outlook.com in 2025. Even if you send far fewer, meeting these rules is the surest way into the inbox. The full list is in <a href="/guides/gmail-yahoo-microsoft-sender-rules">Gmail, Yahoo and Microsoft sender rules</a>.</p>
<h2>How do I improve my sender reputation?</h2>
<ul><li>Only email people who asked to hear from you, and make unsubscribing easy.</li><li>Send newsletters through a proper email marketing service, set up with your domain's DKIM, rather than from your normal inbox.</li><li>Remove addresses that bounce.</li><li>Ask regular customers to add your address to their contacts or mark you "not spam".</li></ul>
<h2>How do I test whether an email lands in spam?</h2>
<p>Send a plain test email to free Gmail and Outlook.com addresses you own and see where it lands. In Gmail, open the message, choose "Show original" and look for <strong>SPF: PASS</strong>, <strong>DKIM: PASS</strong> and <strong>DMARC: PASS</strong>. A fail tells you exactly which record to fix.</p>`,
    faqs: [["Why do only some of my emails go to spam?", "Usually because they're sent by different systems. Emails from your inbox may pass checks while those from your website's contact form or invoicing app don't. Check each service is covered by SPF and DKIM."], ["Will fixing SPF and DKIM stop all spam folder problems?", "It fixes the most common cause. Reputation and content still matter, and each recipient's own filters have the final say."], ["Does my website's SEO affect email delivery?", "No, they're separate. But the same domain is used for both, so a domain with a bad reputation for spam can be harder to trust everywhere."]],
  },
  {
    path: "/guides/spf-dkim-dmarc-setup", crumb: "SPF, DKIM and DMARC setup", parent: ["/guides", "Guides"], article: true,
    title: "SPF, DKIM and DMARC Setup for Microsoft 365 and Google",
    desc: "Step-by-step SPF, DKIM and DMARC setup for Microsoft 365, Google Workspace and other email providers, with the exact records and how to test them free.",
    h1: "How to set up SPF, DKIM and DMARC records",
    lead: "SPF, DKIM and DMARC are three DNS records that prove your emails really come from your business. Setting them up takes about half an hour in your domain's DNS settings, and it's the single biggest fix for emails going to spam.",
    sections: `<h2>What do SPF, DKIM and DMARC do?</h2>
<ul><li><strong>SPF</strong> lists the services allowed to send email for your domain.</li><li><strong>DKIM</strong> adds a digital signature to each email so receivers can check it wasn't forged or changed.</li><li><strong>DMARC</strong> tells receivers what to do when an email fails those checks, and sends you reports about who is sending as your domain.</li></ul>
<p>You add all three where your domain's DNS is managed – often your domain registrar (GoDaddy, IONOS, 123 Reg, Namecheap) or Cloudflare. Our <a href="/dns-lookup">DNS lookup</a> shows who hosts your DNS.</p>
<h2>How do I set up SPF?</h2>
<p>Add one TXT record on your root domain (shown as <code>@</code>). Start it with <code>v=spf1</code>, add an include for each service that sends email for you, and end with <code>~all</code> or <code>-all</code>:</p>
<ul><li><strong>Microsoft 365:</strong> <code>v=spf1 include:spf.protection.outlook.com -all</code></li><li><strong>Google Workspace:</strong> <code>v=spf1 include:_spf.google.com ~all</code></li><li>Both, plus a newsletter tool: one record with several includes, using the include each provider gives you in its help pages.</li></ul>
<p>Never create two SPF records – combine them into one. Keep under 10 DNS lookups in total. Test it with the <a href="/spf-checker">SPF checker</a>.</p>
<h2>How do I set up DKIM?</h2>
<ul><li><strong>Microsoft 365:</strong> in the Microsoft Defender portal, open Email authentication settings → DKIM, choose your domain, copy the two CNAME records it shows (selector1 and selector2) into your DNS, then switch signing on.</li><li><strong>Google Workspace:</strong> in the Admin console, go to Apps → Google Workspace → Gmail → Authenticate email, generate a key, add the TXT record it shows (usually at <code>google._domainkey</code>), then press Start authentication.</li><li><strong>Other services</strong> (Mailchimp, Xero, booking systems): look for "authenticate your domain" in their settings; each gives you its own records.</li></ul>
<p>Check each one with the <a href="/dkim-checker">DKIM checker</a> using the selector your provider gave you.</p>
<h2>How do I set up DMARC?</h2>
<p>Add a TXT record named <code>_dmarc</code>. Start in monitoring mode:</p>
<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@example.co.uk</code></pre>
<p>Reports arrive at that address showing every service sending as your domain. Once everything you use passes SPF or DKIM, tighten the policy to <code>p=quarantine</code>, then <code>p=reject</code>, which stops others sending forged emails as your business. Check it with the <a href="/dmarc-checker">DMARC checker</a>, and see <a href="/guides/how-to-set-up-dmarc">how to set up DMARC</a> for reading reports and moving safely to <code>p=reject</code>.</p>
<h2>What are the most common setup mistakes?</h2>
<ul><li>Two SPF records instead of one.</li><li>Forgetting a service, such as a website contact form or invoicing app.</li><li>Jumping straight to <code>p=reject</code> before checking reports, so real emails get blocked.</li><li>Typing the record name as <code>_dmarc.example.co.uk</code> in a DNS panel that adds the domain itself, creating <code>_dmarc.example.co.uk.example.co.uk</code>.</li></ul>
<p>Still landing in spam after this? See <a href="/guides/why-are-my-emails-going-to-spam">why are my emails going to spam?</a>.</p>`,
    faqs: [["How long do SPF, DKIM and DMARC take to work?", "Usually within an hour, although DNS changes can take up to 48 hours to reach everywhere."], ["Do I need DMARC if I only send a few emails?", "It's strongly recommended. It's free, protects your name from being used in scam emails and helps your emails reach the inbox."], ["Does a domain that never sends email need these records?", "Yes – add an SPF record of v=spf1 -all and a DMARC record with p=reject so nobody can send forged email from it."]],
  },
  {
    path: "/guides/how-much-does-a-website-cost", crumb: "How much does a website cost?", parent: ["/guides", "Guides"], article: true,
    title: "How Much Does a Website Cost in the UK? Honest Price Guide",
    desc: "What a small business website costs in the UK: builder plans, freelancers and agencies, plus the yearly running costs for hosting, domain and upkeep.",
    h1: "How much does a small business website cost in the UK?",
    lead: "A small business website can cost anything from a few pounds a month to several thousand pounds up front. Prices vary with who builds it, how many pages it needs and whether it sells online. Here are typical UK prices and what you get for them.",
    sections: `<h2>What does a DIY website builder cost?</h2>
<p>Builders such as Wix, Squarespace and Shopify usually cost roughly <strong>£10 to £40 a month</strong> for a business plan, with online shop plans costing more, plus card fees on sales. You do the work yourself, so the real cost is your time. Read our <a href="/guides/wix-seo">Wix</a>, <a href="/guides/squarespace-seo">Squarespace</a> and <a href="/guides/shopify-seo">Shopify</a> SEO guides before you choose.</p>
<h2>What does a freelance web designer cost?</h2>
<p>A simple brochure site of five to ten pages from a UK freelancer often costs somewhere around <strong>£500 to £3,000</strong>, depending on their experience, whether they write the words and how much is custom-designed. Shops and booking systems cost more.</p>
<h2>What does a web design agency cost?</h2>
<p>Agencies typically charge from about <strong>£3,000 to £10,000 or more</strong> for a small business site, and much more for large shops or bespoke features. You're paying for a team: design, writing, development, SEO and project management.</p>
<h2>What are the yearly running costs?</h2>
<ul><li><strong>Domain name:</strong> roughly £10 to £20 a year for a .co.uk or .com. See <a href="/guides/choosing-a-domain-name">choosing a domain name</a>.</li><li><strong>Hosting:</strong> included in builder plans; otherwise from a few pounds to £30 or more a month.</li><li><strong>Email:</strong> Microsoft 365 or Google Workspace is charged per user each month.</li><li><strong>Upkeep:</strong> updates, backups and security for WordPress sites, if someone else does it.</li><li><strong>Plugins, themes and apps</strong> that charge yearly.</li></ul>
<h2>What should be included in the price?</h2>
<p>Before you pay, check the quote covers a mobile-friendly design, https, a contact form, basic SEO (page titles, descriptions, a sitemap), Google Search Console set-up, redirects if it replaces an old site, and that you'll own the domain and content. Run any designer's own site and past work through our <a href="/">free SEO check</a> – a quick sign of quality.</p>
<h2>Is a cheap website a false economy?</h2>
<p>Not always, but watch for very cheap deals that rent you a site you can't take away, lock the domain in the designer's name or skip the SEO basics. A website that nobody finds isn't cheap at any price. If you're redesigning, read <a href="/guides/website-redesign-seo">website redesign SEO</a> first.</p>`,
    faqs: [["Why do website quotes vary so much?", "Prices depend on how much is custom design, who writes the words, the number of pages, features like booking or shops, and the designer's experience and overheads."], ["Do I need to pay monthly for a website?", "Usually something, yes – at least hosting and the domain. Some designers bundle these into a monthly fee; ask what happens if you leave."], ["Is SEO included in website design?", "Basic on-page SEO should be. Ongoing work such as content and links is usually a separate service – see how much SEO costs."]],
  },
  {
    path: "/guides/web-designer-vs-website-builder", crumb: "Web designer vs website builder", parent: ["/guides", "Guides"], article: true,
    title: "Web Designer vs Website Builder: Which Should You Choose?",
    desc: "Web designer or website builder? Compare cost, time, SEO and flexibility for UK small businesses, with a simple way to decide which suits you.",
    h1: "Web designer or website builder: which is right for you?",
    lead: "Website builders such as Wix and Squarespace make it easy to build a site yourself. A web designer builds it for you. Both can rank well on Google; the right choice depends on your budget, your time and what the site has to do.",
    sections: `<h2>When is a website builder the better choice?</h2>
<ul><li>You're just starting out and need a simple site quickly.</li><li>Your budget is tight but you have time to learn.</li><li>You want to change words, prices and photos yourself whenever you like.</li><li>The site is mainly a few pages: services, about, contact, maybe bookings.</li></ul>
<h2>When is a web designer the better choice?</h2>
<ul><li>You're in a competitive market and need a site that stands out and converts visitors into enquiries.</li><li>You need custom features, integrations or a large shop.</li><li>You're replacing an old site that already ranks and can't risk losing traffic.</li><li>Your time is worth more spent running the business.</li></ul>
<h2>Which is better for SEO?</h2>
<p>Today's main builders handle the technical basics – https, mobile layouts, sitemaps, editable titles. What decides rankings is the same either way: useful pages for each service and area, good titles, speed, reviews and links. A designer who understands SEO can do more for you; one who doesn't can do less than a builder. Check any site, built either way, with our <a href="/">free SEO check</a>. Our guides cover <a href="/guides/wordpress-seo">WordPress</a>, <a href="/guides/wix-seo">Wix</a>, <a href="/guides/squarespace-seo">Squarespace</a> and <a href="/guides/shopify-seo">Shopify</a>.</p>
<h2>How do the costs compare?</h2>
<p>A builder costs a monthly plan and your time. A designer costs more up front, plus hosting and possibly upkeep. Typical UK prices are in <a href="/guides/how-much-does-a-website-cost">how much does a website cost?</a>.</p>
<h2>Can I switch later?</h2>
<p>Yes, but moving platforms changes page addresses, so you'll need 301 redirects to keep your rankings. Follow the <a href="/guides/website-redesign-seo">website redesign SEO guide</a> and test old addresses with the <a href="/redirect-checker">redirect checker</a>. Whatever you choose, make sure the domain is registered in your name.</p>`,
    faqs: [["Can a web designer use a website builder?", "Yes, many designers build on Wix, Squarespace or WordPress, then hand it over so you can make small changes yourself. That can be a good middle ground."], ["Is WordPress a website builder?", "WordPress is a content management system you host yourself. It's more flexible than builders but needs updates and security looked after."], ["How do I choose a good web designer?", "Look at their past sites, check them with our free SEO tools, ask who owns the domain and site afterwards, and get a written quote listing what's included."]],
  },
  {
    path: "/guides/how-to-appear-in-chatgpt", crumb: "How to appear in ChatGPT", parent: ["/guides", "Guides"], article: true,
    title: "How to Get Your Business Recommended in ChatGPT Search",
    desc: "How ChatGPT finds businesses to recommend, the crawlers your site must allow, and practical steps to make a small business show up in ChatGPT answers.",
    h1: "How to get your business recommended by ChatGPT",
    lead: "More customers now ask ChatGPT \"who's a good electrician in Preston?\" instead of searching Google. ChatGPT can search the web when it answers, and you can make your business easier for it to find, understand and recommend.",
    sections: `<h2>How does ChatGPT find businesses to recommend?</h2>
<p>When a question needs up-to-date or local information, ChatGPT searches the web and reads pages before answering, then shows links to its sources. It relies partly on search partners, including Bing, and partly on its own search crawler, <strong>OAI-SearchBot</strong>. Without search, it answers from what it learned in training, which may be out of date or missing small businesses entirely.</p>
<h2>Which crawlers should my site allow?</h2>
<ul><li><strong>OAI-SearchBot</strong> – used to show your site in ChatGPT search results. Allow it.</li><li><strong>ChatGPT-User</strong> – visits a page when someone asks ChatGPT about it. Allow it.</li><li><strong>GPTBot</strong> – collects data to train OpenAI's models. Blocking it doesn't stop you appearing in ChatGPT search; it's your choice.</li><li><strong>Bingbot</strong> – keep it allowed, and set up <a href="/guides/bing-places-and-bing-seo">Bing Places and Bing Webmaster Tools</a>.</li></ul>
<p>Check yours with the <a href="/robots-txt-tester">robots.txt tester</a>, and read <a href="/guides/block-ai-training-bots">blocking AI training bots</a> if you want to block training only.</p>
<h2>What makes ChatGPT recommend a business?</h2>
<ul><li><strong>Clear facts on your site:</strong> what you do, where, prices or price ranges, opening hours and contact details, in plain text rather than images.</li><li><strong>Pages that answer questions directly:</strong> "How much does a boiler service cost in Blackpool?" answered in the first sentence.</li><li><strong>Mentions on other trusted sites:</strong> reviews, directories, local news and trade bodies. AI tools favour businesses that many independent sources agree on. See <a href="/guides/business-directory-listings">business directory listings</a>.</li><li><strong>Reviews</strong> on Google and elsewhere that describe what you did and where.</li><li><strong>Structured data</strong> such as LocalBusiness markup – see <a href="/guides/schema-markup">schema markup</a>.</li></ul>
<h2>How do I check if ChatGPT recommends my business?</h2>
<p>Ask ChatGPT the questions your customers would, with search switched on, and note which businesses and sources it cites. Look for visits from chatgpt.com in your website analytics. Our <a href="/ai-seo-checker">AI SEO checker</a> tests whether your pages are ready for AI search, and the wider <a href="/guides/ai-search-optimisation">AI search optimisation guide</a> covers Gemini, Copilot and Perplexity too.</p>`,
    faqs: [["Can I pay to be recommended by ChatGPT?", "There's no way to pay for a place in ChatGPT's answers. Be wary of anyone selling guaranteed AI recommendations."], ["Do I need an llms.txt file for ChatGPT?", "It isn't required, and there's no evidence ChatGPT relies on it today. See our llms.txt guide for the details."], ["Does good Google SEO help in ChatGPT?", "Mostly, yes. Clear, crawlable pages, strong reviews and mentions on trusted sites help on both."]],
  },
  {
    path: "/guides/google-ai-overviews", crumb: "Google AI Overviews", parent: ["/guides", "Guides"], article: true,
    title: "Google AI Overviews: How to Get Your Site Cited",
    desc: "What Google AI Overviews are, how they choose which websites to link, how they affect clicks to small business sites, and what you can do to be cited.",
    h1: "Google AI Overviews: what they mean for your website",
    lead: "AI Overviews are the AI-written summaries that appear above the normal results for many Google searches, with links to the websites they draw on. They change how people click, but the way to be cited is mostly good SEO done well.",
    sections: `<h2>How does Google choose which sites to cite in AI Overviews?</h2>
<p>Google builds AI Overviews from pages in its normal search index, and it says there's nothing special you need to do beyond its usual guidance. To be eligible, a page must be indexed and able to show a snippet in Google. In practice, cited pages tend to answer the question clearly, come from sites Google already trusts on the topic and match what the searcher wants.</p>
<h2>Do AI Overviews reduce clicks to my website?</h2>
<p>For simple questions answered in the summary, often yes – people may not need to click. For searches where someone wants to buy, book or call, such as "emergency plumber near me", local map results and normal listings still matter most, and AI Overviews appear less often. Being one of the cited links can still bring visitors who are further along in deciding.</p>
<h2>How can I improve my chances of being cited?</h2>
<ol><li>Make sure the page is indexed – check it in <a href="/guides/google-search-console">Google Search Console</a>.</li><li>Answer the question in the first sentence or two under a heading that asks it, then give the detail. See <a href="/guides/how-to-write-seo-content">how to write SEO content</a>.</li><li>Add facts that only you can give: prices, local knowledge, photos, examples from real jobs.</li><li>Show who wrote it and why they know – see <a href="/guides/what-is-eeat">E-E-A-T</a>.</li><li>Keep pages fast and the basics sound – run a <a href="/">free SEO check</a>.</li></ol>
<h2>Can I stop my site appearing in AI Overviews?</h2>
<p>Only by limiting snippets, using the nosnippet or max-snippet controls, and those also shrink or remove your normal Google snippets. Blocking Google-Extended in robots.txt doesn't remove you from AI Overviews; it controls use of your content for Gemini training and some other Google AI products. For most small businesses, staying visible is the better choice.</p>
<h2>How do I measure AI Overview traffic?</h2>
<p>Search Console counts clicks and impressions from AI Overviews inside its normal web search figures; it doesn't report them separately. Watch for pages whose impressions rise while clicks fall – often a sign an AI Overview now answers that question. Our guide to <a href="/guides/ai-search-optimisation">AI search optimisation</a> covers other AI tools too.</p>`,
    faqs: [["Do AI Overviews appear for every search?", "No. They appear for some searches, more often for questions and research than for local or shopping searches, and Google changes how often they show."], ["Is AI Mode the same as AI Overviews?", "No. AI Mode is a separate, chat-style search in Google. It draws on the same index, so the same advice applies."], ["Do I need special markup for AI Overviews?", "No special markup is required. Accurate structured data still helps Google understand your pages."]],
  },
];
