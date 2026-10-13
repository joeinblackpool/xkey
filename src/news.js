// SEO news (/news): short, original posts on real search events – a Google update, a Search feature or
// policy change, a UK regulator decision – each citing its sources and saying what it means for small
// UK businesses, with links to the XKey tool or guide that helps. Newest first: add a post at the top.
// Only real, sourced events: never pad quiet days, never rewrite someone else's article, never guess.
// Every post becomes a normal PAGES entry (NewsArticle markup, sitemap, IndexNow) and an item in
// /news/rss.xml. Dates come from src/page-dates.js like every other page.
const POSTS = [
  {
    slug: "google-september-2026-spam-update-finished", crumb: "September 2026 spam update finished",
    title: "Google's September 2026 Spam Update Has Finished",
    desc: "Google's September 2026 spam update finished rolling out on 8 October after two weeks. What it targeted, how to tell if it hit your site, and what to do.",
    h1: "Google's September 2026 spam update has finished rolling out",
    lead: "Google's September 2026 spam update finished rolling out on 8 October 2026, two weeks after it started. If your search traffic dropped between 24 September and 8 October, here is how to check whether this update was the cause, and what to do.",
    body: `<h2>What happened?</h2>
<p>Google started the September 2026 spam update on 24 September 2026 and said it could take up to two weeks. Its Search Status Dashboard marked the rollout complete on 8 October 2026. Google described it as a normal spam update that applies to all languages and all countries, the UK included. It didn't announce any change to its spam policies.</p>
<h2>What does a spam update target?</h2>
<p>Spam updates improve Google's automated systems for spotting sites that break its <a href="https://developers.google.com/search/docs/essentials/spam-policies" rel="noopener">spam policies</a>. Sites that break them can rank lower or drop out of results altogether. The usual causes are:</p>
<ul><li><strong>Bought or swapped links</strong> meant to manipulate rankings.</li><li><strong>Mass-produced pages</strong> made to catch searches rather than help people, including AI-written pages published at scale with nothing added.</li><li><strong>Doorway pages</strong>, such as dozens of near-identical "plumber in [town]" pages.</li><li><strong>Hacked content</strong> injected into a site without the owner knowing.</li><li><strong>Expired domains or rented pages</strong> used to borrow another site's reputation.</li></ul>
<h2>What does it mean for a small UK business?</h2>
<p>Most small business sites have nothing to fear from a spam update. If your traffic fell in the window, rule out the common causes first: a site change, a noindex tag, a blocked robots.txt or a hacked page. Run the <a href="/">free SEO check</a> and compare Search Console's Performance report for the two weeks before 24 September with the two weeks after 8 October (see <a href="/guides/why-has-my-website-traffic-dropped">why has my website traffic dropped?</a>).</p>
<p>If you've ever paid for links, check who links to you with the <a href="/toxic-backlink-checker">toxic backlink checker</a>. If you built lots of town pages that only swap the place name, merge them into fewer, genuinely useful pages – our guide to <a href="/guides/seo-for-multiple-locations">SEO for multiple locations</a> shows how. Sites hit by a spam update can recover, but Google says it can take months for its systems to learn that a site now follows the rules. Links Google has already discounted don't come back, so removing bought links won't restore what they once gave you.</p>
<p>Every confirmed update, with its dates, is listed on our <a href="/google-algorithm-updates">Google algorithm updates tracker</a>.</p>`,
    sources: [["Google Search Status Dashboard: September 2026 spam update", "https://status.search.google.com/incidents/XhUDXP7A67iHCD2kmbVu"], ["Google Search Central: spam updates", "https://developers.google.com/search/docs/appearance/spam-updates"], ["Google Search Central: spam policies", "https://developers.google.com/search/docs/essentials/spam-policies"]],
  },
  {
    slug: "google-updates-ai-content-guidance", crumb: "Google updates its AI content advice",
    title: "Google Updates Its Advice on AI-Written Content",
    desc: "On 1 October 2026 Google updated its guidance on AI-generated content for Search. What changed, what Google says about scaled content, and what to do.",
    h1: "Google updates its advice on AI-written content",
    lead: "On 1 October 2026 Google revised its Search guidance on using generative AI to create content, drawing on its Search Quality Rater Guidelines. AI-written pages aren't banned, but pages churned out in bulk without adding anything are a spam problem. Here is what changed and what it means for your site.",
    body: `<h2>What changed?</h2>
<p>Google's page on using generative AI content was rewritten using material from the Search Quality Rater Guidelines, the handbook Google gives to the people who rate its search results. The page now points to the raters' guidance on <strong>scaled content abuse</strong> (section 4.6.5) and on main content made with "little to no effort". Google also notes that the guidelines "are not a guide to ranking first in Google" and that raters' scores don't directly change rankings.</p>
<h2>What does Google say about AI content?</h2>
<ul><li><strong>AI can help.</strong> Google says generative AI can be useful for researching a topic and adding structure to original content.</li><li><strong>Bulk pages are the risk.</strong> Using AI tools to make many pages "without adding value for users may violate" its spam policy on scaled content abuse.</li><li><strong>Check everything.</strong> Google says "it is critical to manually factcheck and review all AI-generated content" – including titles, meta descriptions, structured data and image alt text – because AI models predict likely words rather than look up facts.</li><li><strong>Say how you used it</strong> where readers would expect to know. Online shops using AI-written product data must label it in Merchant Center.</li></ul>
<h2>What does it mean for a small UK business?</h2>
<p>Using AI to draft a page you then check and improve with your own knowledge is fine. The danger is publishing lots of AI pages nobody has read – 50 "best plumber in [town]" pages, or blog posts that repeat what every other site already says. Google's spam updates are built to find exactly that pattern, and one bad batch can hold back a whole site.</p>
<p>Before you publish an AI draft, add what only you know: real prices, photos of your own work, local details, what customers actually ask. Check it isn't too close to other pages with the <a href="/plagiarism-checker">plagiarism checker</a>, and use the <a href="/seo-content-editor">SEO content editor</a> to compare it with pages that already rank. Our guides to <a href="/guides/what-is-eeat">E-E-A-T</a> and <a href="/guides/how-to-write-seo-content">writing SEO content</a> explain what Google looks for.</p>`,
    sources: [["Google Search Central: using generative AI content", "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content"], ["Google Search Central: documentation updates", "https://developers.google.com/search/updates"], ["Google Search Central: spam policies (scaled content abuse)", "https://developers.google.com/search/docs/essentials/spam-policies"]],
  },
  {
    slug: "cma-search-choice-screens-ai-assistants", crumb: "CMA search choice screen proposals",
    title: "CMA Wants Yearly Search Choice Screens in the UK",
    desc: "The CMA has proposed yearly search engine choice screens on Android and Chrome in the UK, open to AI assistants. What it means for being found online.",
    h1: "CMA proposes yearly search choice screens, open to AI assistants",
    lead: "On 23 September 2026 the UK's Competition and Markets Authority strengthened its proposals for Google's search services. Android and Chrome users in the UK would be asked to choose their search service when they set up, and again every year, and AI assistants could be among the choices.",
    body: `<h2>What has the CMA proposed?</h2>
<ul><li><strong>Choice screens:</strong> Google would have to show Android and Chrome users in the UK a choice of search services when they first set up an Android phone or open Chrome.</li><li><strong>A yearly prompt</strong> asking people to pick their default search provider again.</li><li><strong>AI assistants</strong> could appear on these screens if they meet the CMA's criteria, including technical and security requirements.</li><li><strong>Fair credit for publishers:</strong> search providers on the choice screens would have to attribute publishers' content fairly, so people can reach the source and see where answers came from.</li></ul>
<h2>When will it happen?</h2>
<p>Not yet. The proposals follow the CMA's decision to give Google "strategic market status" in search. Views were invited until 9 October 2026, and the CMA expects to make its final decision by the end of 2026.</p>
<h2>What does it mean for a small UK business?</h2>
<p>If the rules go ahead, more people in the UK could end up searching with Bing, DuckDuckGo or an AI assistant such as ChatGPT instead of Google. Google is still where most searches happen, but a site that only works for Google could miss a growing share of customers.</p>
<p>The good news is that the same basics work everywhere: clear pages that answer real questions, accurate business details, and a site search engines and AI tools are allowed to read. Three practical steps:</p>
<ul><li>Set up <a href="/guides/bing-places-and-bing-seo">Bing Places and Bing Webmaster Tools</a> – Bing's index also feeds several other search services and AI assistants.</li><li>Check how ready your site is for AI search with the <a href="/ai-seo-checker">AI SEO checker</a>, and read <a href="/guides/how-to-appear-in-chatgpt">how to appear in ChatGPT</a>.</li><li>Make sure your <a href="/robots-txt-tester">robots.txt</a> doesn't block the search crawlers you want – see <a href="/guides/block-ai-training-bots">blocking AI training bots</a> for which ones are which.</li></ul>`,
    sources: [["GOV.UK: CMA strengthens proposals allowing people choice over their search service (23 September 2026)", "https://www.gov.uk/government/news/cma-strengthens-proposals-allowing-people-choice-over-their-search-service"], ["CMA case page: Google's general search and search advertising services", "https://www.gov.uk/cma-cases/googles-general-search-and-search-advertising-services"]],
  },
  {
    slug: "search-console-ai-report-and-ai-opt-out", crumb: "Search Console AI report and opt-out",
    title: "Search Console's AI Report and AI Opt-Out Go Worldwide",
    desc: "Google's Search Console now shows how your pages appear in AI Overviews and AI Mode, with a toggle to opt out. Tested in the UK first, now worldwide.",
    h1: "Search Console's AI report and AI opt-out are now available to every site",
    lead: "Google has rolled out two Search Console features to every website worldwide: a report showing how your pages appear in AI Overviews and AI Mode, and a switch to keep your site out of them. UK sites got them first, in a test that began in June 2026; Google completed the worldwide rollout on 31 August 2026.",
    body: `<h2>What's new in Search Console?</h2>
<ul><li><strong>AI performance insights:</strong> impressions in Google's generative AI features, which of your pages appear in AI answers, and in which countries. Google says it will add more measurements over time. There are no click or search-term figures yet.</li><li><strong>An AI opt-out toggle:</strong> a setting that decides whether your site can appear in, and be used to ground answers in, AI Overviews, AI Mode and AI Overviews in Discover.</li></ul>
<p>Google first offered both to a group of UK website owners from 3 June 2026, before the worldwide rollout. If you can't see the report, your site may not have enough data in AI features yet.</p>
<h2>Should I opt out of AI Overviews?</h2>
<p>For almost every small business, no. Google says sites that opt out "will not receive traffic or impressions" from its generative AI features. It also says the setting won't be used as a ranking signal for normal search results, so opting out doesn't harm your blue-link rankings – but it does give up a growing source of visibility. AI Overviews appear on many local and "how to" searches, and being the page Google quotes can still bring customers.</p>
<p>Opting out makes more sense for publishers whose content is the product, such as news sites or paid courses, who would rather people read it on their own site.</p>
<h2>What should I do now?</h2>
<ul><li>Open <a href="/guides/google-search-console">Google Search Console</a> and look at the new AI report. Note which pages already appear in AI answers – they show what Google trusts you on.</li><li>Run your key pages through the <a href="/ai-seo-checker">AI SEO checker</a> to see what makes a page easy for AI tools to quote.</li><li>Read our guide to <a href="/guides/google-ai-overviews">Google AI Overviews</a> for how to get cited, and <a href="/guides/ai-search-optimisation">AI search optimisation</a> for ChatGPT and the others.</li></ul>`,
    sources: [["Google: new controls for website owners (updated 31 August 2026)", "https://blog.google/products-and-platforms/products/search/new-controls-website-owners/"]],
  },
  {
    slug: "google-review-snippets-fake-reviews-rule", crumb: "Google's fake reviews rule for review stars",
    title: "Google Adds a Fake Reviews Rule for Review Stars",
    desc: "Google's review snippet rules now ban fake and undisclosed incentivised reviews in your markup. What it means for UK businesses and your star ratings.",
    h1: "Google adds a fake reviews rule for review stars",
    lead: "On 24 July 2026 Google added a guideline to its review snippet documentation: pages must not include fake or undisclosed incentivised reviews, on the page or in the structured data that can earn star ratings in search results. UK law already bans both.",
    body: `<h2>What does the new rule say?</h2>
<p>Google's review snippet guidelines now say: "Don't include fake or undisclosed incentivized reviews on your page or in your structured data markup." Google gives two examples:</p>
<ul><li>Reviews that aren't based on a genuine experience of the product or service.</li><li>Reviews written in exchange for a benefit – money, discounts, vouchers or free products – that don't clearly and prominently say so.</li></ul>
<p>Pages that break Google's structured data guidelines can lose their rich results, such as review stars, or get a manual action in Search Console.</p>
<h2>What does it mean for a small UK business?</h2>
<p>If you only show genuine reviews, nothing changes. If you've ever offered a discount for a review, say so clearly next to those reviews, or stop. Since April 2025 the Digital Markets, Competition and Consumers Act has made fake reviews, and incentivised reviews that hide the incentive, illegal in the UK, with the CMA able to fine businesses directly.</p>
<h2>Can I still get stars for testimonials on my own site?</h2>
<p>No – that's a long-standing rule: Google won't show review stars for your own business when you control the reviews about yourself – for example, testimonials you pick and mark up with LocalBusiness or Organization schema. Stars for a local business come from reviews people leave on Google, so the best route is a steady flow of real Google reviews. Our guide to <a href="/guides/how-to-get-google-reviews">getting Google reviews</a> shows how, and the <a href="/google-review-link-generator">Google review link generator</a> makes asking easy.</p>
<p>Check what your pages currently mark up with the <a href="/schema-checker">schema checker</a>, and see our guide to <a href="/guides/schema-markup">schema markup</a> for what Google still shows in 2026.</p>`,
    sources: [["Google Search Central: review snippet structured data guidelines", "https://developers.google.com/search/docs/appearance/structured-data/review-snippet"], ["Google Search Central: documentation updates (24 July 2026)", "https://developers.google.com/search/updates"], ["GOV.UK: CMA guidance on fake reviews (CMA208)", "https://www.gov.uk/government/publications/fake-reviews-cma208"]],
  },
];

const sources = (list) => `<h2>Sources</h2><ul>${list.map(([t, u]) => `<li><a href="${u}" rel="noopener">${t}</a></li>`).join("")}</ul>`;
export const NEWS = POSTS.map((n) => ({
  path: `/news/${n.slug}`, crumb: n.crumb, parent: ["/news", "SEO news"], article: true, news: true,
  title: n.title, desc: n.desc, h1: n.h1, lead: n.lead, sections: n.body + sources(n.sources),
}));

export const NEWS_HUB = {
  path: "/news", crumb: "SEO news",
  title: "SEO News UK: Google Updates Explained for Businesses",
  desc: "UK SEO news in plain English: Google updates, Search Console changes and new rules, explained for small businesses with sources and next steps.",
  h1: "SEO news for UK businesses",
  eyebrow: "Plain English",
  lead: "The search changes that matter to small UK businesses, explained in plain English. Each post covers a real event, cites its sources and says what to do next. We only post when something genuinely changes.",
  sections: `<h2>What does XKey's SEO news cover?</h2>
<p>Confirmed Google updates, changes to Google Search and Search Console, new Google guidance and policies, and UK rules that affect how businesses are found online, such as decisions by the Competition and Markets Authority. Each post says what happened, what it means for a small business and what to do next, with links to Google's or the regulator's own announcement.</p>
<h2>How often do you post?</h2>
<p>When something real happens. We check Google's announcements and the UK regulators every day, and post only when there's a change worth knowing about. Quiet days get no post.</p>
<h2>How is this different from the Google updates tracker?</h2>
<p>The <a href="/google-algorithm-updates">Google algorithm updates tracker</a> lists every confirmed ranking update with its dates, live from Google. SEO news covers a wider range of changes and explains each one.</p>`,
  newsHub: true,
};
