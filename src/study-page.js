// The State of UK Websites (/uk-website-study): original research from study/run.mjs. Every number on
// the page is read from src/study-data.js, so re-running the study updates the page.
import { STUDY } from "./study-data.js";

const T = STUDY.top, E = STUDY.everyday;
const pc = (n) => `${Math.round(n)}%`;
const ck = (g, name, k = "pass") => (g.checks[name] ? g.checks[name][k] : 0);
const bad = (g, name) => ck(g, name, "warn") + ck(g, name, "fail");
const date = new Date(STUDY.generated).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const noDmarc = (g) => g.email.dmarc.missing + g.email.dmarc.none;
const row = (label, a, b) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`;
const table = (rows) => `<div class="tablewrap"><table><thead><tr><th></th><th>Everyday .uk sites</th><th>Top 500 .uk sites</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
const cms = E.cms.top.slice(0, 8);

export const STUDY_PAGE = {
  path: "/uk-website-study", crumb: "State of UK websites", parent: ["/guides", "Guides"], article: true,
  title: `State of UK Websites ${STUDY.generated.slice(0, 4)}: SEO, Email & AI Study`,
  desc: `We checked ${E.checked + T.checked} .uk websites for SEO, speed, security, email protection and AI search readiness. ${pc(noDmarc(E))} of everyday sites have no working DMARC.`,
  h1: "The state of UK websites",
  lead: `In ${date} we ran XKey's SEO check on ${(E.checked + T.checked).toLocaleString("en-GB")} .uk home pages – ${E.checked} everyday sites and ${T.checked} of the 500 most-linked – and looked up the email security of ${(E.email.sites + T.email.sites).toLocaleString("en-GB")} domains. Here's what we found.`,
  sections: `<h2>Key findings</h2>
<ul>
<li><strong>${pc(noDmarc(E))} of everyday .uk domains don't protect their email</strong> with an enforced DMARC policy (${pc(E.email.dmarc.missing)} have no DMARC record at all), so anyone can send email pretending to be them. Among the top 500 it's ${pc(noDmarc(T))}.</li>
<li><strong>The average everyday site scores ${E.score.average} out of 100</strong> on XKey's SEO check, against ${T.score.average} for the top 500. Only ${pc(E.score.over90)} score 90 or more.</li>
<li><strong>${pc(bad(E, "Title tag"))} have a problem with their title tag</strong> – the single most important line for Google – and ${pc(bad(E, "Meta description"))} with their meta description.</li>
<li><strong>${pc(ck(E, "Tap-to-contact", "fail"))} of everyday sites have no tap-to-call or email link</strong> on the home page, so phone visitors can't contact them in one tap.</li>
<li><strong>Almost nobody blocks AI search.</strong> Just ${pc(E.ai.blocksAny)} of everyday sites block any AI crawler in robots.txt (${pc(T.ai.blocksAny)} of the top 500), but ${pc(ck(E, "Question-led content", "fail"))} have none of the question-and-answer content AI answers like to quote.</li>
<li><strong>WordPress runs ${pc(E.cms.top.find(([n]) => n === "WordPress")?.[1] || 0)} of everyday .uk sites</strong> where we could tell the platform.</li>
</ul>
<h2>Google basics</h2>
<p>The share of home pages that passed each of XKey's checks with no problems:</p>
${table([
  row("Title tag with no problems", pc(ck(E, "Title tag")), pc(ck(T, "Title tag"))),
  row("Good meta description", pc(ck(E, "Meta description")), pc(ck(T, "Meta description"))),
  row("One clear H1 heading", pc(ck(E, "H1 heading")), pc(ck(T, "H1 heading"))),
  row("Working XML sitemap", pc(ck(E, "XML sitemap")), pc(ck(T, "XML sitemap"))),
  row("Correct canonical tag", pc(ck(E, "Canonical URL")), pc(ck(T, "Canonical URL"))),
  row("Valid structured data (JSON-LD)", pc(ck(E, "JSON-LD present & valid")), pc(ck(T, "JSON-LD present & valid"))),
  row("Social share cards (Open Graph)", pc(ck(E, "Open Graph & social cards")), pc(ck(T, "Open Graph & social cards"))),
  row("Enough words to rank", pc(ck(E, "Word count")), pc(ck(T, "Word count"))),
])}
<p>Titles and descriptions are the cheapest fixes on any site: they take minutes and change what people see in Google. See <a href="/guides/title-tags">how to write title tags</a> and <a href="/guides/meta-descriptions">meta descriptions</a>.</p>
<h2>Email security: most small sites can be spoofed</h2>
${table([
  row("No DMARC record", pc(E.email.dmarc.missing), pc(T.email.dmarc.missing)),
  row("DMARC set to monitor only (p=none)", pc(E.email.dmarc.none), pc(T.email.dmarc.none)),
  row("DMARC quarantine", pc(E.email.dmarc.quarantine), pc(T.email.dmarc.quarantine)),
  row("DMARC reject (fully protected)", pc(E.email.dmarc.reject), pc(T.email.dmarc.reject)),
  row("No SPF record", pc(E.email.spfNone), pc(T.email.spfNone)),
])}
<p>Since 2024 Gmail, Yahoo and Microsoft have pushed senders to set up SPF, DKIM and DMARC, and messages from domains without them are more likely to land in spam. Some domains in the sample don't send email at all (${pc(E.email.noMx)} of everyday domains have no mail servers) – but those still need a DMARC record so nobody can fake mail from them. Check yours with the <a href="/dmarc-checker">DMARC checker</a> and <a href="/spf-checker">SPF checker</a>.</p>
<h2>AI search: open doors, little to quote</h2>
${table([
  row("Block at least one AI crawler", pc(E.ai.blocksAny), pc(T.ai.blocksAny)),
  row("Block GPTBot (ChatGPT training)", pc(E.ai.byBot.GPTBot), pc(T.ai.byBot.GPTBot)),
  row("Block ClaudeBot", pc(E.ai.byBot.ClaudeBot), pc(T.ai.byBot.ClaudeBot)),
  row("Block Google-Extended (Gemini training)", pc(E.ai.byBot["Google-Extended"]), pc(T.ai.byBot["Google-Extended"])),
  row("Have an llms.txt file", pc(ck(E, "llms.txt")), pc(ck(T, "llms.txt"))),
  row("Clear about who they are (entity clarity)", pc(ck(E, "Entity clarity")), pc(ck(T, "Entity clarity"))),
])}
<p>The average AI search readiness score was ${E.aiScore.average} for everyday sites and ${T.aiScore.average} for the top 500. Being reachable isn't the problem – being quotable is. See <a href="/guides/ai-search-optimisation">AI search optimisation</a> or run the <a href="/ai-seo-checker">AI SEO checker</a>.</p>
<h2>Speed, security and phones</h2>
${table([
  row("Images properly sized and compressed", pc(ck(E, "Images")), pc(ck(T, "Images"))),
  row("No render-blocking scripts or styles", pc(ck(E, "Render-blocking resources")), pc(ck(T, "Render-blocking resources"))),
  row("Fast server response", pc(ck(E, "Server response (TTFB)")), pc(ck(T, "Server response (TTFB)"))),
  row("http:// redirects to https://", pc(ck(E, "HTTP → HTTPS redirect")), pc(ck(T, "HTTP → HTTPS redirect"))),
  row("HSTS switched on", pc(ck(E, "HSTS")), pc(ck(T, "HSTS"))),
  row("Mobile viewport set", pc(ck(E, "Mobile viewport")), pc(ck(T, "Mobile viewport"))),
  row("Every image has alt text", pc(ck(E, "Image alt text")), pc(ck(T, "Image alt text"))),
])}
<p>Heavy images were the most common speed problem. The <a href="/page-speed-checker">page speed checker</a> shows which ones.</p>
<h2>What UK sites are built with</h2>
<div class="tablewrap"><table><thead><tr><th>Platform</th><th>Share of everyday sites</th></tr></thead><tbody>${cms.map(([n, v]) => row(n, pc(v), "").replace(/<td><\/td><\/tr>$/, "</tr>")).join("")}<tr><td>Custom or couldn't tell</td><td>${pc(E.cms.none)}</td></tr></tbody></table></div>
<p>${pc(E.analytics.none)} of everyday sites had no analytics we could detect, and ${pc(E.analytics.top.find(([n]) => /Universal/.test(n))?.[1] || 0)} still load Universal Analytics, which stopped collecting data in 2023. ${pc(E.consent)} show a cookie consent banner. Find out what any site runs on with the <a href="/website-technology-checker">website technology checker</a>.</p>
<h2>How we did the study</h2>
<ul>
<li><strong>Sample.</strong> From Common Crawl's public web graph (release ${STUDY.release}), the ${T.sites} most-linked .uk domains, plus a random sample of ${E.sites.toLocaleString("en-GB")} .uk domains ranked between 500,000th and 5,000,000th on the whole web – mostly small businesses, clubs and charities.</li>
<li><strong>Checks.</strong> XKey's own <a href="/">SEO check</a> on each home page (the same one anyone can run), DNS lookups for SPF, DMARC and mail servers, robots.txt rules for nine AI crawlers, and the platform from the page's code.</li>
<li><strong>Politeness.</strong> One request at a time per site, our own user agent (XKeyResearch), and robots.txt obeyed – ${T.skippedByRobots + E.skippedByRobots} sites that asked not to be crawled were skipped.</li>
<li><strong>Limits.</strong> ${T.unreachable} top sites and ${E.unreachable} everyday sites couldn't be checked: they were offline, parked, or blocked automated visitors. Percentages for page checks are of the sites we could read (${E.checked} everyday, ${T.checked} top); email figures cover every domain that answered DNS. Home pages only. We publish totals, never results for individual sites.</li>
</ul>
<h2>Cite this study</h2>
<p>You're welcome to use these figures with a link to this page: <em>XKey, "The state of UK websites", ${date}, https://xkey.co.uk/uk-website-study</em>.</p>
<h2>How does your site compare?</h2>
<p>Run the <a href="/">free SEO check</a> on your own home page – it's the same test every site in the study got – and compare your score with the averages above.</p>`,
  faqs: [["How many UK websites have DMARC?", `In our sample, ${pc(100 - E.email.dmarc.missing)} of everyday .uk domains had a DMARC record, but only ${pc(E.email.dmarc.quarantine + E.email.dmarc.reject)} set it to quarantine or reject, which is what actually stops spoofing.`], ["What is the average SEO score of a UK website?", `${E.score.average} out of 100 for everyday .uk sites and ${T.score.average} for the 500 most-linked, on XKey's free SEO check.`], ["How many UK websites block AI crawlers?", `${pc(E.ai.blocksAny)} of everyday .uk sites and ${pc(T.ai.blocksAny)} of the top 500 block at least one AI crawler in robots.txt.`], ["How up to date are these figures?", `They were collected in ${date}. The date at the top of the page shows when the study was last run.`]],
};
