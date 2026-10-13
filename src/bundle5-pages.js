// Accessibility checker (/accessibility-checker, API in a11y.js, browser code a11y-client.js), Google
// algorithm updates tracker (/google-algorithm-updates, live list from google-updates.js) and the free
// SEO course (/learn-seo: 10 lessons pointing at XKey's guides and tools, ticks saved in localStorage).
import { GSD_MARK } from "./google-updates.js";

const T = ["/seo-tools", "SEO tools"];

export const A11Y_FORMS = {
  a11y: () => `<form class="ck-form" id="a11-form"><label for="a11-url" class="sr">Page address</label><input id="a11-url" type="text" inputmode="url" autocomplete="url" placeholder="yourwebsite.co.uk" required><button class="btn" type="submit">Check accessibility</button></form><div id="a11-out" aria-live="polite"></div><script src="/assets/a11y.js" defer></script>`,
};

// [title, why it matters, [[href, link text]], [tasks]]
const LESSONS = [
  ["How Google decides what to show", "Google sends crawlers to read pages, stores them in its index, then ranks the pages it thinks best answer each search. Ranking leans on three things: whether the page is relevant to the words searched, whether it's trustworthy (links and reviews from elsewhere), and whether it's a good experience to use. For local searches, distance and your Google Business Profile matter too. AI answers such as Google's AI Overviews and ChatGPT use much of the same signals.",
    [["/guides/how-to-rank-higher-on-google", "How to rank higher on Google"], ["/guides/what-is-eeat", "What E-E-A-T means"]],
    ["Search for your main service and town, and note who ranks above you", "Write down the 5 searches you most want to be found for"]],
  ["Check where you stand", "Before changing anything, get a baseline. A quick check shows the problems stopping Google reading or trusting your site, and Search Console shows the searches you already appear for. Most small business sites have a handful of easy fixes – a missing title, a blocked page, a slow image – that are worth more than any clever trick.",
    [["/", "Free SEO check"], ["/guides/google-search-console", "Set up Google Search Console"], ["/guides/why-is-my-website-not-on-google", "Why isn't my website on Google?"]],
    ["Run the free SEO check on your home page", "Add your site to Google Search Console", "Fix every red item in the check"]],
  ["Find the words your customers use", "Keyword research is just finding out how people describe what you sell. They rarely use your industry's terms: they search \"emergency plumber Preston\", not \"heating engineering services\". Pick one main phrase for each page, and choose phrases you can realistically win – a local phrase beats a national one for a small business.",
    [["/guides/keyword-research-for-beginners", "Keyword research for beginners"], ["/keyword-generator", "Keyword generator"], ["/keyword-difficulty-checker", "Keyword difficulty checker"]],
    ["List 20 phrases customers might search", "Give each important page one main phrase"]],
  ["Titles and descriptions", "The title tag is the blue link in Google, and it's the strongest on-page signal you control. Put the main phrase near the start, add your town if you're local, and keep it under about 60 characters. The meta description doesn't change rankings, but a good one gets more people to click.",
    [["/guides/title-tags", "How to write title tags"], ["/guides/meta-descriptions", "Meta descriptions"], ["/title-tag-checker", "Title tag checker"]],
    ["Rewrite the title of your 5 most important pages", "Give each one a description that makes people want to click"]],
  ["Write pages worth ranking", "Google ranks pages, not websites. Every service you want to be found for needs its own page that properly answers the questions a customer would ask: what's included, prices or price ranges, areas covered, how long it takes, and why choose you. Photos of real work and real reviews beat generic text every time.",
    [["/guides/how-to-write-seo-content", "How to write SEO content"], ["/guides/on-page-seo-checklist", "On-page SEO checklist"], ["/seo-content-editor", "SEO content editor"]],
    ["Make sure each main service has its own page", "Add prices, areas and common questions to your best page"]],
  ["Fix the technical basics", "Technical SEO is making sure Google can find, read and load your pages. That means a working sitemap, nothing important blocked in robots.txt, one secure https address, no broken links, and pages that load fast on a phone. You only need to get these right once, then keep an eye on them.",
    [["/guides/technical-seo-checklist", "Technical SEO checklist"], ["/guides/core-web-vitals", "Core Web Vitals"], ["/broken-link-checker", "Broken link checker"], ["/page-speed-checker", "Page speed checker"]],
    ["Check your sitemap and robots.txt", "Find and fix broken links", "Shrink any images over 300 KB"]],
  ["Win local search", "For anything people want nearby, the map results get most of the clicks. Your Google Business Profile is the biggest factor: the right category, full details, photos, posts and a steady stream of reviews. Keep your name, address and phone number exactly the same everywhere they appear.",
    [["/guides/google-business-profile", "Google Business Profile guide"], ["/guides/local-seo-checklist", "Local SEO checklist"], ["/guides/how-to-get-google-reviews", "How to get Google reviews"], ["/local-search-checker", "Local search checker"]],
    ["Claim and complete your Google Business Profile", "Ask your last 10 happy customers for a review", "List your business on the main directories"]],
  ["Earn links and mentions", "Links from other websites are how Google judges trust. You don't need many, but you need real ones: suppliers, local organisations, clubs you sponsor, local news, trade bodies and directories. Never buy links – it breaks Google's rules and can get your site pushed down.",
    [["/guides/how-to-get-backlinks", "How to get backlinks"], ["/guides/business-directory-listings", "Business directory listings"], ["/backlink-checker", "Backlink checker"]],
    ["Check who links to you and to your top competitor", "Ask 3 suppliers or partners to link to you"]],
  ["Get found in AI search", "ChatGPT, Google's AI Overviews, Perplexity and Copilot increasingly answer questions directly. They favour clear pages that state facts plainly, structured data that describes your business, and sites that let their crawlers in. Most of this is good SEO anyway – but check you're not blocking AI crawlers by accident.",
    [["/guides/ai-search-optimisation", "AI search optimisation"], ["/ai-seo-checker", "AI SEO checker"], ["/guides/schema-markup", "Schema markup"], ["/guides/llms-txt", "llms.txt"]],
    ["Run the AI SEO checker on your home page", "Add LocalBusiness schema to your site"]],
  ["Measure and keep going", "SEO takes months, not days, so measure the right things: clicks and searches in Search Console, enquiries from the website, and where you rank for your main phrases. Check monthly, keep adding useful pages, and re-run a full check after any website change.",
    [["/guides/measuring-seo-results", "Measuring SEO results"], ["/guides/how-long-does-seo-take", "How long SEO takes"], ["/rank-tracker", "Rank tracker"], ["/seo-monitoring", "Weekly SEO monitoring"]],
    ["Note this month's clicks from Search Console", "Set a monthly reminder to check rankings and fix new problems"]],
];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const COURSE = `<p class="small" id="ls-progress" aria-live="polite">Tick tasks as you go – your progress is saved in this browser only.</p>
<p class="small">Stuck on a word? The <a href="/seo-glossary">SEO glossary</a> explains every term in plain English.</p>
<ol class="small">${LESSONS.map(([t], i) => `<li><a href="#${slug(t)}">${t}</a></li>`).join("")}</ol>
${LESSONS.map(([t, why, links, tasks], i) => `<h2 id="${slug(t)}">Lesson ${i + 1}: ${t}</h2><p>${why}</p><p><strong>Read and use:</strong> ${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join(" · ")}</p><div class="ls-tasks">${tasks.map((k, j) => `<label style="display:flex;gap:10px;align-items:center;min-height:44px"><input type="checkbox" data-k="${i}-${j}" style="width:22px;height:22px"> ${k}</label>`).join("")}</div>`).join("\n")}
<script>(function(){var K="xk-course",s={};try{s=JSON.parse(localStorage.getItem(K)||"{}")||{};}catch(e){}var b=[].slice.call(document.querySelectorAll(".ls-tasks input")),p=document.getElementById("ls-progress");
var upd=function(){var n=b.filter(function(x){return x.checked;}).length;if(n)p.textContent=n+" of "+b.length+" tasks done – saved in this browser.";};
b.forEach(function(x){x.checked=!!s[x.getAttribute("data-k")];x.addEventListener("change",function(){s[x.getAttribute("data-k")]=x.checked?1:0;try{localStorage.setItem(K,JSON.stringify(s));}catch(e){}upd();});});upd();})();</script>`;

export const BUNDLE5_PAGES = [
  {
    path: "/accessibility-checker", crumb: "Accessibility checker", parent: T, title: "Website Accessibility Checker | Free WCAG 2.2 Test",
    desc: "Free accessibility checker: test any page against WCAG 2.2 for missing alt text, unlabelled forms, empty links, blocked zoom and heading order.",
    h1: "Website accessibility checker", eyebrow: "Free tool · No sign-up", app: "XKey accessibility checker", form: "a11y",
    lead: "Check any page for the accessibility problems that can be found in its code – missing alt text, form fields without labels, links and buttons with no name, zoom blocked on phones – with a plain-English fix for each.",
    sections: `<h2>What does it check?</h2>
<ul><li><strong>Images</strong> – every image has alt text, and the alt text isn't a file name like IMG_2041.jpg (WCAG 1.1.1).</li><li><strong>Links and buttons</strong> – each one has a name a screen reader can announce, and links don't just say "click here" (2.4.4, 4.1.2).</li><li><strong>Forms</strong> – every field has a label; placeholder text isn't enough (1.3.1).</li><li><strong>Structure</strong> – page language, title, one h1, headings in order, a main landmark and a skip link (3.1.1, 2.4.2, 1.3.1, 2.4.1).</li><li><strong>Phones</strong> – people can pinch-zoom (1.4.4).</li><li><strong>Embeds and media</strong> – maps and videos have titles, nothing plays sound by itself, data tables have headers.</li><li><strong>Code</strong> – no duplicate IDs and no positive tabindex.</li></ul>
<h2>What it can't check</h2>
<p>About a third of accessibility problems can be found automatically. This tool reads the page's HTML, so it can't judge <strong>colour contrast</strong>, whether everything works with a <strong>keyboard</strong>, whether focus is visible, or how the page sounds in a <strong>screen reader</strong>. Content added by JavaScript after the page loads isn't seen either. To test those, try tabbing through your page without a mouse, and listen to it with VoiceOver (iPhone and Mac) or NVDA (free for Windows).</p>
<h2>Does a UK business website have to be accessible?</h2>
<p>The <strong>Equality Act 2010</strong> requires service providers to make reasonable adjustments for disabled people, and that includes websites. Public sector sites must meet WCAG 2.2 AA under the 2018 accessibility regulations. If you sell to customers in the EU, the <strong>European Accessibility Act</strong> has applied to many online shops and services since June 2025. Around one in four people in the UK has a disability, so an accessible site also simply reaches more customers.</p>
<h2>Does accessibility help SEO?</h2>
<p>Much of it overlaps. Alt text helps Google understand images (see <a href="/guides/image-seo">image SEO</a>), clear headings help it understand the page, descriptive link text helps <a href="/guides/internal-linking">internal linking</a>, and allowing zoom is part of being <a href="/mobile-friendly-test">mobile friendly</a>. Fix the problems here and run the <a href="/">free SEO check</a> to cover the rest.</p>`,
    faqs: [["Is this a full WCAG audit?", "No. It finds the problems that show up in a page's code. A full audit adds manual testing with a keyboard, a screen reader and contrast tools."], ["Will an accessibility overlay or widget fix my site?", "No. Overlays don't fix missing labels or alt text in your code, and many disabled users find them get in the way. Fix the page itself."], ["What score should I aim for?", "100, with no problems. Each failed check stops some people using your site, and most take minutes to fix."]],
  },
  {
    path: "/google-algorithm-updates", crumb: "Google algorithm updates", parent: ["/guides", "Guides"], article: true,
    title: "Google Algorithm Updates 2026 | Live Tracker & History",
    desc: "Every confirmed Google algorithm update with start and end dates, live from Google's Search Status Dashboard, and what to do if one hit your site.",
    h1: "Google algorithm updates: live tracker",
    lead: "Confirmed Google ranking updates, with the date each started and finished, read live from Google's own Search Status Dashboard. If your traffic dropped, check here first.",
    sections: `<h2>Confirmed updates</h2>${GSD_MARK}
<p class="small">Source: <a href="https://status.search.google.com/" rel="noopener">Google Search Status Dashboard</a>, refreshed every hour. Only updates Google itself has announced are listed – Google changes its rankings every day, and most changes are never announced.</p>
<p>For what each update and other search changes mean for a small business, read our <a href="/news">SEO news</a>.</p>
<h2>Did an update hit my site?</h2>
<ol><li><strong>Line up the dates.</strong> In <a href="/guides/google-search-console">Google Search Console</a>, open Performance, set the dates to cover the update and compare the weeks before and after.</li><li><strong>Wait for it to finish.</strong> Rankings bounce around during a rollout. Judge the result a week or two after Google says it's complete.</li><li><strong>Find what dropped.</strong> Compare pages and searches. A drop across the whole site points to an update; a drop on one page usually has a simpler cause.</li><li><strong>Rule out your own changes.</strong> A redesign, new addresses, a blocked robots.txt or a noindex tag cause far more drops than updates do – run the <a href="/">free SEO check</a> and the <a href="/broken-link-checker">broken link checker</a>.</li></ol>
<h2>How to recover from a core update</h2>
<p>Google says there's nothing to "fix" after a core update – it has re-judged which pages are most helpful. Pages that dropped usually lost to pages that answer the question better. Look at what ranks above you now and improve your page honestly: more first-hand detail, real photos, prices, clear answers, and proof of experience (see <a href="/guides/what-is-eeat">E-E-A-T</a> and <a href="/guides/how-to-write-seo-content">writing SEO content</a>). Recovery often shows at the next core update, a few months later.</p>
<h2>How to recover from a spam update</h2>
<p>Spam updates target sites breaking Google's spam policies: bought links, pages made only for search engines, copied or mass-produced content, and hacked pages. Remove the problem, check your links with the <a href="/toxic-backlink-checker">toxic backlink checker</a>, and if you received a manual action in Search Console, request a review once it's fixed.</p>`,
    faqs: [["How often does Google update its algorithm?", "Every day, in small ways. Google announces only the bigger updates – usually a few core updates and a spam update or two each year."], ["How long does a Google update take?", "Most roll out over one to three weeks. The table shows how long each confirmed update took."], ["Where does this list come from?", "Google's own Search Status Dashboard, which is where Google confirms ranking updates. We don't add rumoured or unconfirmed updates."]],
  },
  {
    path: "/learn-seo", crumb: "Free SEO course", parent: ["/guides", "Guides"], article: true,
    title: "Free SEO Course for Beginners | 10 Lessons, No Sign-Up",
    desc: "A free SEO course for UK small businesses: 10 short lessons from how Google works to local and AI search, each with tasks to tick off and a free tool to do it.",
    h1: "Free SEO course: 10 lessons for small businesses",
    lead: "Learn SEO by doing it on your own website. Ten short lessons, in the order that matters most, each with a couple of tasks and the free XKey guides and tools to do them. No sign-up, no email.",
    sections: COURSE,
    faqs: [["How long does the course take?", "Each lesson takes a few minutes to read. The tasks take anything from five minutes to an afternoon – do one lesson a week and you'll have covered the essentials in under three months."], ["Do I need any technical knowledge?", "No. The course is written for business owners. Where something needs a developer, the guides say so."], ["Is my progress saved?", "Yes, in this browser only. Nothing is sent to XKey and there's no account."]],
  },
];
