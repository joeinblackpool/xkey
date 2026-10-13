// Website reports: /site/<domain> – one page per website with its authority, global rank, linking
// websites (Common Crawl web graph, see backlinks.js) and registration details (RDAP/WHOIS, see whois.js).
// Hosting and technology load on request from /api/hosting and /api/tech, so the page itself stays fast.
// Only sites with plenty of real data are indexable (see `indexable`); every other report is noindex,follow,
// and a domain with no links and no registration answers 404 – so no thin pages reach Google.
import { esc, layout, send, SITE } from "./site.js";
import { siteDomain, siteLinks, authority, crawlMonths } from "./backlinks.js";
import { lookupDomain } from "./whois.js";
import { pixelWidth } from "../engine/checker.js";

const HTMLT = "text/html; charset=utf-8";
const VERSION = "1"; // bump to drop every cached report after a template change
export const INDEX_MAX_RANK = 1_000_000, INDEX_MIN_REF = 50;

/** Indexable only when the site is in the top million by harmonic centrality and at least 50 websites link to it. */
export const indexable = (r) => !!(r && r.found && r.rank > 0 && r.rank <= INDEX_MAX_RANK && r.refDomains >= INDEX_MIN_REF);

const num = (n) => Number(n).toLocaleString("en-GB");
const date = (s) => { const d = new Date(s); return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }); };
const years = (s) => { const d = new Date(s); return isNaN(d) ? 0 : Math.floor((Date.now() - d) / (365.25 * 86_400_000)); };
const share = (rank, ranked) => { const p = (100 * rank) / ranked; return p < 0.01 ? "the top 0.01%" : p < 1 ? `the top ${p.toFixed(2).replace(/0$/, "")}%` : `the top ${Math.ceil(p)}%`; };
const band = (a) => a >= 70 ? "one of the most trusted websites on the internet" : a >= 50 ? "a very strong website" : a >= 35 ? "a well-established website" : a >= 20 ? "a moderately established website" : "a young or little-linked website";

function title(d) {
  for (const t of [`${d} Authority, Backlinks & Domain Age | XKey`, `${d} Website Report | XKey`, `${d} | XKey`]) if (pixelWidth(t, 20) <= 580) return t;
  return `${d.slice(0, 40)}… | XKey`;
}

function timed(p, ms) { return Promise.race([p, new Promise((ok) => setTimeout(() => ok(null), ms))]); }

const linkerRows = (list, from) => list.map(([d, s], i) => `<tr><td>${from + i + 1}</td><td style="overflow-wrap:anywhere"><a href="/site/${esc(d)}">${esc(d)}</a></td><td>${s}</td></tr>`).join("");

export function reportBody(d, r, m, w) {
  const ranked = m.ranked || 0, a = authority(r, ranked), months = crawlMonths(m.release);
  const age = w && w.registered && w.created ? years(w.created) : null;
  const tiles = [
    [r.found ? `${a}/100` : "–", "authority"],
    [r.found && r.rank ? `#${num(r.rank)}` : "–", `global rank of ${num(ranked || m.domains || 0)}`],
    [r.found ? num(r.refDomains) : "0", "websites link to it"],
    [age != null ? (age < 1 ? "Under a year" : `${age} year${age === 1 ? "" : "s"}`) : "–", "domain age"],
  ].map(([v, l]) => `<div><b style="font-size:30px">${esc(v)}</b><br><span class="small">${esc(l)}</span></div>`).join("");
  const parts = [`<div class="card" style="margin:0 0 22px"><div class="row" style="gap:28px">${tiles}</div></div>`];
  if (r.found) {
    parts.push(`<h2>How strong is ${esc(d)}?</h2><p>${esc(d)} has an XKey authority of <strong>${a} out of 100</strong>${r.rank ? `, which makes it ${band(a)}. It ranks <strong>#${num(r.rank)}</strong> of ${num(ranked)} websites by how central it is to the web's links – ${share(r.rank, ranked)}` : ""}. <strong>${num(r.refDomains)}</strong> different website${r.refDomains === 1 ? "" : "s"} link to it.</p>
<p>Authority comes from Common Crawl's map of links between websites (${esc(months)}): a site linked from many well-linked sites scores high. Google doesn't use this number, but it tracks the kind of link strength that helps pages rank. <a href="/guides/what-is-domain-authority">What is domain authority?</a></p>`);
    if (r.linkers.length) {
      const list = r.linkers;
      parts.push(`<h2>Which websites link to ${esc(d)}?</h2><p>The ${list.length === 1 ? "website" : `${list.length} strongest websites`} linking to ${esc(d)}, by link strength (0–100). Select any one to see its own report.</p>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Website linking to it</th><th>Link strength</th></tr></thead><tbody>${linkerRows(list, 0)}</tbody></table></div>
${r.refDomains > list.length ? `<p class="small">Showing the strongest ${list.length} of ${num(r.refDomains)}. Compare ${esc(d)} with a competitor in the <a href="/backlink-checker?d=${encodeURIComponent(d)}">backlink checker</a>.</p>` : ""}`);
    }
  } else {
    parts.push(`<h2>Links to ${esc(d)}</h2><p>No links to ${esc(d)} were found in Common Crawl's map of the web (${esc(months)}). That's normal for new or small websites: Common Crawl doesn't visit every page, so some links may be missing. <a href="/guides/how-to-get-backlinks">How to get backlinks</a>.</p>`);
  }
  if (w && w.registered) {
    const rows = [["Registered", date(w.created)], ["Expires", date(w.expires)], ["Last updated", date(w.updated)], ["Registrar", w.registrar], ["Name servers", (w.nameservers || []).slice(0, 4).join(", ").toLowerCase()]].filter(([, v]) => v);
    parts.push(`<h2>When was ${esc(d)} registered?</h2>${w.created ? `<p>${esc(d)} was registered on <strong>${esc(date(w.created))}</strong>${w.registrar ? ` through ${esc(w.registrar)}` : ""}${w.expires ? `, and is paid up until ${esc(date(w.expires))}` : ""}.</p>` : `<p>The registry doesn't publish a registration date for ${esc(d)}.</p>`}
${rows.length ? `<div class="tablewrap"><table><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td style="overflow-wrap:anywhere">${esc(v)}</td></tr>`).join("")}</tbody></table></div>` : ""}
<p class="small">Straight from the domain registry. Owners' personal details are hidden by law, so to reach the owner use the website's own contact page or the registrar. Full record: <a href="/whois-lookup?d=${encodeURIComponent(d)}">WHOIS lookup</a>.</p>`);
  } else if (w && w.registered === false) {
    parts.push(`<h2>Registration</h2><p>The registry says ${esc(d)} isn't registered right now.</p>`);
  } else {
    parts.push(`<h2>Registration</h2><p>The registry didn't answer in time. See the <a href="/whois-lookup?d=${encodeURIComponent(d)}">WHOIS lookup</a> for ${esc(d)}.</p>`);
  }
  parts.push(`<h2>Where is ${esc(d)} hosted, and what is it built with?</h2><p>We check the live website when you ask, so this page stays fast.</p>
<p><button class="btn" type="button" id="sr-live" data-d="${esc(d)}">Check hosting and technology</button></p><div id="sr-out" aria-live="polite"></div>
<h2>More free checks for ${esc(d)}</h2><ul><li><a href="/seo-checker?url=${encodeURIComponent(d)}">Full SEO check</a> – about 50 checks for Google and AI search</li><li><a href="/ssl-checker?d=${encodeURIComponent(d)}">SSL checker</a> – certificate and https</li><li><a href="/dns-lookup?d=${encodeURIComponent(d)}">DNS lookup</a> and <a href="/mx-lookup?d=${encodeURIComponent(d)}">MX lookup</a></li><li><a href="/website-hosting-checker?d=${encodeURIComponent(d)}">Hosting checker</a> and <a href="/website-technology-checker?url=${encodeURIComponent(d)}">technology checker</a></li><li><a href="/domain-age-checker">Domain age checker</a> for up to 100 sites at once</li></ul>
<p class="small">Link data: Common Crawl web graph, ${esc(months)}. Registration data: the domain registry, checked ${esc(date(new Date().toISOString()))}. Look up another website on the <a href="/website-report">website report</a> page.</p>`);
  return parts.join("\n");
}

const LIVE = `<script>(function(){var b=document.getElementById("sr-live");if(!b)return;var o=document.getElementById("sr-out"),d=b.getAttribute("data-d");
function e(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}
b.addEventListener("click",function(){b.disabled=true;o.innerHTML='<p class="small">Checking '+e(d)+'…</p>';
Promise.all([fetch("/api/hosting?d="+encodeURIComponent(d)).then(function(r){return r.json();}).catch(function(){return{};}),fetch("/api/tech?url="+encodeURIComponent(d)).then(function(r){return r.json();}).catch(function(){return{};})]).then(function(x){var h=x[0]||{},t=x[1]||{},rows=[];
if(h.exists===false)rows.push(["Hosting","Not found in DNS"]);else if(h.provider||h.how)rows.push(["Hosting",(h.provider?h.provider+" – ":"")+(h.how||"")]);else if(h.error)rows.push(["Hosting",h.error]);
(t.groups||[]).forEach(function(g){var n=(t.tech||[]).filter(function(i){return i.cat===g[0];}).map(function(i){return i.name;});if(n.length)rows.push([g[1],n.join(", ")]);});
if(t.error)rows.push(["Technology",t.error]);
o.innerHTML=rows.length?'<div class="tablewrap"><table><tbody>'+rows.map(function(r){return'<tr><th scope="row">'+e(r[0])+"</th><td>"+e(r[1])+"</td></tr>";}).join("")+"</tbody></table></div>":'<p>Nothing could be detected.</p>';b.disabled=false;});});})();</script>`;

function notFound(d) {
  return layout({ path: `/site/${d}`, crumb: d, parent: ["/website-report", "Website report"], title: `No report for ${d} | XKey`, desc: "We couldn't find this website.", noindex: true,
    body: `<div class="wrap hero"><h1>No report for ${esc(d)}</h1><p class="lead">We found no links to ${esc(d)} and the registry says it isn't registered. Check the spelling, or look up another website.</p><form class="ck-form" action="/site" method="get"><label for="sr-d2" class="sr">Website</label><input id="sr-d2" name="d" type="text" inputmode="url" placeholder="yourbusiness.co.uk" required><button class="btn" type="submit">See report</button></form></div>` });
}

/** GET /site/<domain> */
export async function siteReport(request, env, ctx, raw, limited) {
  let site; try { site = siteDomain(decodeURIComponent(raw)); } catch { return null; }
  const d = site.domain;
  if (raw !== d) return Response.redirect(`${SITE}/site/${d}`, 301);
  const cache = typeof caches !== "undefined" ? caches.default : null;
  const key = new Request(`${SITE}/__site/${VERSION}/${d}`);
  const hit = cache && (await cache.match(key));
  if (hit) return hit;
  if (limited && (await limited())) return send("Too many reports from your connection this hour – please try again later.", "text/plain; charset=utf-8", 429, "no-store");
  let links;
  try { links = await siteLinks(env, ctx, site); } catch { links = { m: null }; }
  if (!links.m) return send(layout({ path: `/site/${d}`, crumb: d, parent: ["/website-report", "Website report"], title: `${d} report | XKey`, desc: "The link data is being updated.", noindex: true, body: `<div class="wrap hero"><h1>${esc(d)}</h1><p class="lead">The link data is being updated – please try again in a few minutes.</p></div>` }), HTMLT, 503, "no-store");
  const w = await timed(lookupDomain(env, ctx, d).catch(() => null), 4000);
  const { m, r } = links;
  if (!r.found && w && w.registered === false) return send(notFound(d), HTMLT, 404, "public, max-age=3600");
  const a = authority(r, m.ranked), index = indexable(r);
  const desc = r.found
    ? `${d} has an authority of ${a}/100${r.rank ? `, ranks #${num(r.rank)} worldwide` : ""} and is linked from ${num(r.refDomains)} websites. See who links to it, its domain age and its hosting.`
    : `Free report for ${d}: links, domain age, registrar, expiry date, hosting and technology, with no sign-up. Look up any website on XKey.`;
  const lead = r.found ? `Authority, global rank, the websites that link to ${d}, when it was registered and where it's hosted – free, from public data.` : `What we know about ${d}: its registration, links and hosting – free, from public data.`;
  const html = layout({ path: `/site/${d}`, crumb: d, parent: ["/website-report", "Website report"], title: title(d), desc, noindex: !index,
    body: `<div class="wrap hero" style="padding-bottom:24px"><span class="eyebrow">Website report</span><h1 style="overflow-wrap:anywhere">${esc(d)} website report</h1><p class="lead">${esc(lead)}</p></div>
<section class="pt0"><div class="wrap prose">${reportBody(d, r, m, w)}</div></section>${LIVE}` });
  const res = send(html, HTMLT, 200, "public, max-age=3600");
  if (cache && w) ctx.waitUntil(cache.put(key, new Response(html, { headers: { "content-type": HTMLT, "cache-control": "max-age=86400" } })).catch(() => {}));
  return res;
}

// The hub's lists: well-known UK websites by kind, so Google and visitors can find the reports.
export const POPULAR = [
  ["News and media", ["bbc.co.uk", "theguardian.com", "telegraph.co.uk", "independent.co.uk", "dailymail.co.uk", "sky.com", "itv.com", "channel4.com"]],
  ["Shopping", ["amazon.co.uk", "ebay.co.uk", "argos.co.uk", "tesco.com", "sainsburys.co.uk", "johnlewis.com", "marksandspencer.com", "next.co.uk", "boots.com", "currys.co.uk"]],
  ["Trade and DIY", ["screwfix.com", "toolstation.com", "wickes.co.uk", "diy.com", "checkatrade.com", "trustatrader.com", "yell.com", "mybuilder.com"]],
  ["Property and motoring", ["rightmove.co.uk", "zoopla.co.uk", "onthemarket.com", "autotrader.co.uk", "gumtree.com", "motors.co.uk"]],
  ["Money", ["moneysavingexpert.com", "which.co.uk", "nationwide.co.uk", "barclays.co.uk", "hsbc.co.uk", "lloydsbank.com", "natwest.com", "monzo.com"]],
  ["Public services", ["gov.uk", "nhs.uk", "tfl.gov.uk", "metoffice.gov.uk", "royalmail.com", "nationalrail.co.uk", "ox.ac.uk", "cam.ac.uk"]],
  ["Website builders and hosts", ["wix.com", "squarespace.com", "shopify.com", "wordpress.com", "godaddy.com", "ionos.co.uk", "123-reg.co.uk", "krystal.io"]],
  ["Reviews and directories", ["trustpilot.com", "reviews.io", "thomsonlocal.com", "scoot.co.uk", "freeindex.co.uk", "tripadvisor.co.uk"]],
];

export const SITE_REPORT_PAGE = {
  path: "/website-report", crumb: "Website report", parent: ["/seo-tools", "SEO tools"], title: "Free Website Report | Authority, Backlinks, Age & Host",
  desc: "Free website report for any domain: authority score, global rank, the websites that link to it, domain age, registrar, hosting and technology. No sign-up.",
  h1: "Free website report for any domain", eyebrow: "Any website · Free · No sign-up", app: "XKey website report", form: "sitereport",
  lead: "Type any website to see its authority, where it ranks among 133 million websites, who links to it, how old it is, who it's registered with and where it's hosted – on one page.",
  sections: `<h2>What's in a website report?</h2>
<ul><li><strong>Authority (0–100) and global rank</strong> – how central the site is to the web's links, from Common Crawl's map of 133 million websites and 2 billion links.</li><li><strong>Websites that link to it</strong> – how many different sites link to it, and the 50 strongest.</li><li><strong>Domain age and registration</strong> – registered date, expiry date, registrar and name servers, straight from the registry.</li><li><strong>Hosting and technology</strong> – the hosting company, website builder, analytics and other tools it uses, checked live when you ask.</li></ul>
<h2>Who uses website reports?</h2>
<ul><li><strong>Business owners</strong> sizing up a competitor, a supplier or a site that's asked for a link.</li><li><strong>Anyone buying a website or domain</strong> who wants to know its age and link history first.</li><li><strong>Web designers and SEO freelancers</strong> getting a quick overview before a call.</li></ul>
${POPULAR.map(([k, list]) => `<h2>Popular UK websites: ${k.toLowerCase()}</h2><p>${list.map((d) => `<a href="/site/${d}">${d}</a>`).join(" · ")}</p>`).join("\n")}
<h2>Where does the data come from?</h2>
<p>Links and authority come from <a href="https://commoncrawl.org/" rel="noopener">Common Crawl</a>'s free, public web graph, updated every three months. Registration details come live from each domain registry (RDAP, or WHOIS where a registry has no RDAP). Hosting and technology are read from the live website. XKey's authority is our own score: Google doesn't publish one, and Moz's DA and Ahrefs' DR are measured differently, so the numbers won't match theirs exactly.</p>`,
  faqs: [["Is the website report free?", "Yes. No sign-up, no email and no limit for normal use – only a fair-use limit to stop bots."], ["Why does my site have no links listed?", "Common Crawl doesn't visit every page on the web, so new and small sites often have few or none recorded. Our guide on getting backlinks explains how to earn more."], ["Can I see who owns a website?", "Owners' personal details are hidden by law in the UK and EU. The report shows the registrar, which can pass messages to the owner, and the website's own contact page is usually quickest."], ["How often is it updated?", "Registration details are checked live (cached for up to a day). Link data is refreshed each time Common Crawl publishes a new web graph, about every three months."]],
};
