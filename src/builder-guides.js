// "SEO for <website builder>" guides. The step-by-step fixes come from engine/platform.js – the same
// text the SEO report shows under each fix – so the guides and the report never disagree.
import { HOW_TO } from "../engine/platform.js";

// The order a beginner should work through them: can Google see it, what it shows, then the rest.
const ORDER = [
  ["Indexable", "Make sure Google is allowed to index your pages"],
  ["HTTPS", "Use the secure https:// address"],
  ["Title tag", "Write a title for every page"],
  ["Meta description", "Write a description for every page"],
  ["H1 heading", "Give each page one main heading"],
  ["Image alt text", "Describe your images"],
  ["Images", "Shrink your images"],
  ["XML sitemap", "Send Google your sitemap"],
  ["LocalBusiness markup", "Tell Google your business details"],
  ["Open Graph & social cards", "Set how your pages look when shared"],
  ["AI crawler access", "Let AI search read your site"],
  ["Favicon", "Add a site icon"],
];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const steps = (p) => `<h2>Which fixes matter most, and where are they?</h2>
<p>Work down this list in order. Each step says exactly where the setting is in ${p}. Run the <a href="/">free SEO check</a> on your home page first: the report spots that your site runs on ${p} and shows these steps under anything that needs fixing.</p>
<ol>${ORDER.filter(([k]) => HOW_TO[p][k]).map(([k, t]) => `<li><strong>${t}.</strong> ${esc(HOW_TO[p][k])}</li>`).join("")}</ol>`;
const after = `<h2>What should I do after the basics?</h2>
<ul><li><strong>Connect Google Search Console</strong> to see the searches you appear for and any pages Google can't index – see our <a href="/guides/google-search-console">Search Console guide</a>.</li><li><strong>Write a page for each main service</strong>, in your customers' words. The <a href="/keyword-generator">keyword generator</a> helps you find them.</li><li><strong>Earn a few good links</strong> from suppliers, trade bodies and local groups. Check yours with the <a href="/backlink-checker">backlink checker</a>.</li><li><strong>Turn on <a href="/seo-monitoring">weekly monitoring</a></strong> so you hear when something breaks after an update.</li></ul>`;

const guide = (p, slug, title, desc, lead, intro, mistakes, faqs) => ({
  path: `/guides/${slug}`, crumb: `${p} SEO guide`, parent: ["/guides", "Guides"], article: true, title, desc, h1: `${p} SEO: a step-by-step guide`, lead,
  sections: intro + steps(p) + mistakes + after, faqs,
});

export const BUILDER_GUIDES = [
  guide("WordPress", "wordpress-seo", "WordPress SEO for Beginners: Where Every Setting Is",
    "WordPress SEO in plain English: where to set titles, descriptions, sitemaps and alt text, which plugin to use, and the mistakes that hide sites from Google.",
    "WordPress can rank as well as anything on the web, but it gives you enough rope to hang yourself: one wrong tickbox can hide your whole site from Google. Here's where every important setting lives.",
    `<h2>Is WordPress good for SEO?</h2>
<p>You control everything: page addresses, code, hosting and any SEO plugin you like. The flip side is that speed and security are your job. A cheap host, a heavy page builder or twenty plugins can make a WordPress site slow, and Google measures that.</p>
<p>You need exactly one SEO plugin. Yoast SEO and Rank Math are both free and both do the job; pick one. Two SEO plugins at once print two sets of tags and confuse search engines.</p>`,
    `<h2>What are the most common WordPress mistakes?</h2>
<ul><li><strong>Leaving “Discourage search engines” ticked after launch</strong> – the classic. Check Settings → Reading.</li><li><strong>Thin tag and category pages</strong> – hundreds of near-empty archive pages. Your SEO plugin can set tag archives to noindex.</li><li><strong>Not updating</strong> – out-of-date plugins are the most common way small WordPress sites get hacked, and hacked sites get flagged by Google.</li><li><strong>Changing a page's address without a redirect</strong> – use the free Redirection plugin, or the redirect tool in Rank Math.</li></ul>`,
    [["Is Yoast or Rank Math better?", "Both cover everything a small business needs. Use whichever you find easier, and only one of them."], ["Is WordPress.com the same as WordPress.org?", "They run the same software. On WordPress.com, installing plugins such as Yoast needs one of the higher paid plans; lower plans have more limited SEO settings."], ["Will a page builder like Elementor hurt my SEO?", "Not by itself, but it adds a lot of code. Keep pages simple, avoid stacking many add-ons, and check your speed in the free SEO check."]]),

  guide("Wix", "wix-seo", "Wix SEO Guide: Where to Find Every Setting",
    "Wix SEO in plain English: where to set page titles, descriptions, headings and alt text in Wix, what Wix does for you and the mistakes to avoid.",
    "Wix gets the technical basics right for you, so most of Wix SEO is filling in the right boxes. The hard part is finding them. Here's where each one is.",
    `<h2>What does Wix do for you?</h2>
<p>Wix makes your sitemap, turns on the secure https:// address for connected domains, and makes every template work on phones. It also has its own SEO setup checklist in the dashboard, which is worth finishing.</p>
<p>Where Wix falls short is control: you can't edit the underlying code, and pages tend to be heavier than a hand-built site, which matters most on mobile. Keep images small and avoid stacking lots of animations and apps on one page.</p>`,
    `<h2>What are the most common Wix mistakes?</h2>
<ul><li><strong>Staying on the free wixsite.com address</strong> – connect your own domain (it needs a paid plan). It looks more trustworthy to customers and to Google.</li><li><strong>Text inside images</strong> – Google and AI assistants can't read words that are part of a picture. Put headings and prices in real text.</li><li><strong>Pages hidden from search</strong> – check each page's SEO basics and make sure indexing is on for the pages that matter.</li><li><strong>Default titles</strong> like “Home | My Site” – write a real title for every page.</li></ul>`,
    [["Is Wix bad for SEO?", "No. Wix sites can and do rank well. Fill in the basics on every page, keep pages light, and write useful content – that matters far more than the builder."], ["Can I edit robots.txt on Wix?", "Yes, with the Robots.txt editor under Marketing & SEO → SEO."], ["Do I need a Wix SEO app?", "No. Everything in this guide is built into Wix."]]),

  guide("Squarespace", "squarespace-seo", "Squarespace SEO Guide: Every Setting, in Order",
    "Squarespace SEO in plain English: where to set SEO titles, descriptions, headings and alt text in Squarespace, and the mistakes that cost rankings.",
    "Squarespace sites look great and the technical side is mostly handled for you. What's left is a short list of boxes to fill in on every page – here's where they are.",
    `<h2>What does Squarespace do for you?</h2>
<p>Squarespace makes your sitemap, sets up the secure https:// address, and makes every template mobile-friendly. Its templates are clean, which helps both speed and how Google reads the page.</p>
<p>The trade-off is fewer controls. There are no SEO plugins, and adding your own code (such as full LocalBusiness markup) needs Code Injection, which is only on the higher plans.</p>`,
    `<h2>What are the most common Squarespace mistakes?</h2>
<ul><li><strong>Huge images</strong> – upload photos around 2,500 pixels wide at most, not straight off the camera.</li><li><strong>Blank SEO descriptions</strong> on blog posts and products – each needs its own.</li><li><strong>Leaving demo pages from the template</strong> live and indexed – delete or hide them.</li><li><strong>Text inside banner images</strong> – put it in real text blocks so search engines can read it.</li></ul>`,
    [["Is Squarespace good for SEO?", "Yes, for most small businesses. The basics are covered; the difference comes from filling in your titles and descriptions and writing useful pages."], ["Can I edit robots.txt on Squarespace?", "Not directly. Squarespace manages it, but the Crawlers settings let you choose whether AI crawlers can read your site."], ["Squarespace or Wix for SEO?", "Both are fine. Pick the one you find easier to keep updated – fresh, useful content beats the choice of builder."]]),

  guide("Shopify", "shopify-seo", "Shopify SEO Guide for Small Shops: The Basics",
    "Shopify SEO in plain English: where to set titles, descriptions and alt text in Shopify, what it does for you and the mistakes that hold shops back.",
    "Shopify handles hosting, speed and the technical basics well. Most Shopify SEO comes down to writing your own product and collection content and filling in the search listing for each page.",
    `<h2>What does Shopify do for you, and what can't you change?</h2>
<p>Shopify gives you fast hosting, the secure https:// address, a sitemap and, in most themes, product markup so Google can show prices and stock in results.</p>
<p>You can't change the fixed parts of page addresses (/products/, /collections/, /pages/). That's fine – Google doesn't mind. Products shown inside collections get extra addresses too, but Shopify's canonical tags point Google at the main one.</p>`,
    `<h2>What are the most common Shopify mistakes?</h2>
<ul><li><strong>Copying the manufacturer's description</strong> – hundreds of shops have the same text. Write your own, even a short paragraph.</li><li><strong>Empty collection pages</strong> – add a few sentences at the top of each collection about what's in it and who it's for.</li><li><strong>Too many apps</strong> – every app adds code. Remove the ones you don't use, and check speed afterwards.</li><li><strong>Deleting sold-out products</strong> – keep the page if it's coming back; if not, redirect it to the closest product or collection. Shopify offers to create a redirect when you change a page's address – leave that ticked.</li></ul>`,
    [["Do I need a Shopify SEO app?", "Not for the basics. Everything in this guide is built into Shopify. Apps can help with bulk editing on very large shops."], ["Can I remove /products/ from my URLs?", "No, Shopify doesn't allow it, and it doesn't hurt your rankings."], ["Why is my Shopify store not on Google?", "The most common reason is that the store password is still on (Online Store → Preferences). After that, submit your sitemap in Google Search Console."]]),
];

/** platform name → guide address, for the SEO report */
export const GUIDE_FOR = Object.fromEntries(BUILDER_GUIDES.map((g) => [g.crumb.replace(/ SEO guide$/, ""), g.path]));
