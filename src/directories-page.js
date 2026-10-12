// UK business directories list: every directory worth a listing, grouped by kind of business, with each
// site's live XKey authority filled in from /api/authority (batches of 10) after the page loads.

// [name, domain, link, best for]
const GROUPS = [
  ["The essentials for every business", [
    ["Google Business Profile", "google.com", "https://www.google.com/business/", "Everyone – the most important listing for local search and Maps"],
    ["Bing Places", "bing.com", "https://www.bingplaces.com/", "Everyone – Bing, Copilot and Windows search"],
    ["Apple Business Connect", "apple.com", "https://businessconnect.apple.com/", "Everyone – Apple Maps and Siri on iPhones"],
    ["Facebook page", "facebook.com", "https://www.facebook.com/pages/create", "Everyone – many customers check Facebook for reviews and opening hours"],
    ["LinkedIn company page", "linkedin.com", "https://www.linkedin.com/company/setup/new/", "B2B firms, professional services and recruiting"],
  ]],
  ["Big UK directories", [
    ["Yell", "yell.com", "https://www.yell.com/free-listing/", "Local businesses of every kind"],
    ["Thomson Local", "thomsonlocal.com", "https://www.thomsonlocal.com/", "Local businesses of every kind"],
    ["Scoot", "scoot.co.uk", "https://www.scoot.co.uk/", "Local businesses; also feeds partner sites"],
    ["FreeIndex", "freeindex.co.uk", "https://www.freeindex.co.uk/", "Services and trades, with reviews"],
    ["Yelp", "yelp.co.uk", "https://biz.yelp.co.uk/", "Restaurants, shops and local services"],
    ["Cylex", "cylex-uk.co.uk", "https://www.cylex-uk.co.uk/", "General local listings"],
    ["Hotfrog", "hotfrog.co.uk", "https://www.hotfrog.co.uk/", "General local listings"],
    ["192.com", "192.com", "https://www.192.com/", "Businesses customers look up by name"],
    ["Foursquare", "foursquare.com", "https://foursquare.com/", "Venues – its data feeds many apps and maps"],
    ["Nextdoor", "nextdoor.co.uk", "https://business.nextdoor.com/", "Neighbourhood services recommended by locals"],
    ["Brownbook", "brownbook.net", "https://www.brownbook.net/", "General listings"],
    ["Misterwhat", "misterwhat.co.uk", "https://www.misterwhat.co.uk/", "General listings"],
  ]],
  ["Reviews", [
    ["Trustpilot", "trustpilot.com", "https://business.trustpilot.com/", "Online shops and national services"],
    ["Reviews.io", "reviews.io", "https://www.reviews.io/", "Online shops"],
    ["Feefo", "feefo.com", "https://www.feefo.com/", "Retail, travel and financial services"],
  ]],
  ["Trades and home services", [
    ["Checkatrade", "checkatrade.com", "https://www.checkatrade.com/", "Builders, plumbers, electricians and other trades"],
    ["TrustATrader", "trustatrader.com", "https://www.trustatrader.com/", "Trades and home improvement"],
    ["MyBuilder", "mybuilder.com", "https://www.mybuilder.com/", "Builders and trades looking for jobs"],
    ["Rated People", "ratedpeople.com", "https://www.ratedpeople.com/", "Trades looking for jobs"],
    ["Which? Trusted Traders", "which.co.uk", "https://trustedtraders.which.co.uk/", "Vetted trades"],
    ["MyJobQuote", "myjobquote.co.uk", "https://www.myjobquote.co.uk/", "Trades looking for leads"],
    ["Bark", "bark.com", "https://www.bark.com/", "Services of all kinds looking for leads"],
    ["TrustMark", "trustmark.org.uk", "https://www.trustmark.org.uk/", "Government-endorsed home improvement trades"],
    ["Gas Safe Register", "gassaferegister.co.uk", "https://www.gassaferegister.co.uk/", "Gas engineers (registration is a legal requirement)"],
    ["NICEIC", "niceic.com", "https://www.niceic.com/", "Electricians"],
    ["Federation of Master Builders", "fmb.org.uk", "https://www.fmb.org.uk/", "Builders who are members"],
  ]],
  ["Food, drink and travel", [
    ["Tripadvisor", "tripadvisor.co.uk", "https://www.tripadvisor.co.uk/Owners", "Restaurants, pubs, hotels and attractions"],
    ["OpenTable", "opentable.co.uk", "https://restaurant.opentable.co.uk/", "Restaurants taking bookings"],
    ["Booking.com", "booking.com", "https://join.booking.com/", "Hotels, B&Bs and holiday lets"],
    ["VisitEngland / VisitBritain", "visitbritain.com", "https://www.visitbritain.org/", "Attractions and places to stay"],
  ]],
  ["Health, beauty and fitness", [
    ["NHS website", "nhs.uk", "https://www.nhs.uk/", "GPs, dentists, pharmacies and NHS services"],
    ["Treatwell", "treatwell.co.uk", "https://www.treatwell.co.uk/partners/", "Hair and beauty salons"],
    ["Fresha", "fresha.com", "https://www.fresha.com/for-business", "Salons, spas and barbers"],
    ["Doctify", "doctify.com", "https://www.doctify.com/", "Private clinics and specialists"],
    ["Counselling Directory", "counselling-directory.org.uk", "https://www.counselling-directory.org.uk/", "Counsellors and therapists"],
  ]],
  ["Professional services", [
    ["Law Society – Find a Solicitor", "lawsociety.org.uk", "https://solicitors.lawsociety.org.uk/", "Solicitors (automatic for regulated firms)"],
    ["ICAEW – Find a Chartered Accountant", "icaew.com", "https://find.icaew.com/", "Chartered accountants"],
    ["Unbiased", "unbiased.co.uk", "https://www.unbiased.co.uk/", "Financial advisers, mortgage brokers and accountants"],
    ["VouchedFor", "vouchedfor.co.uk", "https://www.vouchedfor.co.uk/", "Financial advisers and solicitors"],
    ["RIBA – Find an Architect", "architecture.com", "https://www.architecture.com/find-an-architect", "Architects"],
    ["Clutch", "clutch.co", "https://clutch.co/", "Agencies, web designers and IT firms"],
  ]],
  ["Weddings, events and families", [
    ["Hitched", "hitched.co.uk", "https://www.hitched.co.uk/", "Wedding venues and suppliers"],
    ["Bridebook", "bridebook.com", "https://bridebook.com/", "Wedding venues and suppliers"],
    ["Childcare.co.uk", "childcare.co.uk", "https://www.childcare.co.uk/", "Childminders, nurseries and nannies"],
    ["Tutorful", "tutorful.co.uk", "https://tutorful.co.uk/", "Tutors"],
  ]],
  ["Motoring", [
    ["Good Garage Scheme", "goodgaragescheme.com", "https://www.goodgaragescheme.com/", "Independent garages"],
    ["Motor Codes", "motorcodes.co.uk", "https://www.motorcodes.co.uk/", "Garages signed up to the code"],
    ["Auto Trader", "autotrader.co.uk", "https://www.autotrader.co.uk/", "Car dealers"],
  ]],
];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const COUNT = GROUPS.reduce((n, [, l]) => n + l.length, 0);

const table = (list) => `<div class="tablewrap"><table class="dir"><thead><tr><th>Directory</th><th>Best for</th><th>Authority</th></tr></thead><tbody>${list.map(([n, d, link, best]) => `<tr><td><a href="${esc(link)}" rel="noopener" style="display:inline-flex;align-items:center;min-height:44px">${esc(n)}</a></td><td>${esc(best)}</td><td data-d="${esc(d)}">–</td></tr>`).join("")}</tbody></table></div>`;

const SCRIPT = `<script>(function(){var cells=[].slice.call(document.querySelectorAll("td[data-d]")),ds=[];cells.forEach(function(c){var d=c.getAttribute("data-d");if(ds.indexOf(d)<0)ds.push(d);});
var put=function(r){cells.forEach(function(c){if(c.getAttribute("data-d")===r.domain||c.getAttribute("data-d")===r.input){c.innerHTML=r.found?'<a style="display:inline-flex;align-items:center;min-height:44px;min-width:44px" href="/backlink-checker?d='+encodeURIComponent(r.domain)+'">'+r.authority+"</a>":"–";}});};
for(var i=0;i<ds.length;i+=10)(function(part){fetch("/api/authority?d="+encodeURIComponent(part.join(","))).then(function(r){return r.json();}).then(function(j){(j.results||[]).forEach(put);}).catch(function(){});})(ds.slice(i,i+10));})();</script>`;

export const DIRECTORIES_PAGE = {
  path: "/uk-business-directories", crumb: "UK business directories", parent: ["/guides", "Guides"], article: true,
  title: "UK Business Directories List 2026 (With Authority Scores)",
  desc: `The UK business directories worth listing on in 2026: ${COUNT} sites grouped by trade, from Google and Yell to Checkatrade and Treatwell, each with its authority.`,
  h1: "UK business directories worth listing on",
  lead: `${COUNT} directories, review sites and trade registers that UK customers actually use, grouped by kind of business, with each site's authority score from XKey's link data. Start at the top and work down.`,
  sections: `<h2>How to use this list</h2>
<ol><li>Do the five essentials first – they matter more than everything else put together.</li><li>Add the big UK directories that suit you, then the ones for your trade.</li><li>Use exactly the same business name, address, phone number and website on every listing.</li><li>Keep a note of each listing and its log-in, so you can update them when anything changes.</li></ol>
<p>Why listings matter, and which to skip, is covered in the <a href="/guides/business-directory-listings">directory listings guide</a>.</p>
${GROUPS.map(([g, list]) => `<h2>${esc(g)}</h2>${table(list)}`).join("\n")}
<h2>What does the authority score mean?</h2>
<p>It's XKey's 0–100 estimate of how strong each site is in the web's links, from Common Crawl's public web graph – select a score to see the websites linking to it, or compare any sites in the <a href="/domain-authority-checker">domain authority checker</a>. A listing on a high-authority site is more likely to be seen and trusted, but the best directory for you is the one your customers use. Many directory links are "nofollow", so think of listings as a way to be found and to confirm your details, not as a shortcut to rankings.</p>
<h2>Which directories should I avoid?</h2>
<ul><li>Paid packages that promise to submit you to hundreds of directories.</li><li>Directories full of adverts and spam, or with no real visitors.</li><li>Sites outside the UK or unrelated to your trade.</li><li>Anyone selling links dressed up as directory listings – that's against Google's spam policies.</li></ul>
<p>Check that your details match everywhere with a quick search for your business name and phone number, and see how you appear in local results with the <a href="/local-search-checker">local search checker</a>.</p>${SCRIPT}`,
  faqs: [["Are business directory listings free?", "Most of the directories here offer a free basic listing, with paid upgrades for extra features or leads. The essentials – Google, Bing, Apple and Facebook – are completely free."], ["How many directories should I be listed on?", "Quality beats quantity. The essentials, a few big UK directories and the main ones for your trade – usually 10 to 20 in total – is plenty for a local business."], ["Do directory listings help SEO?", "Yes, modestly. Consistent listings help Google trust your business details for local search, and some send customers directly. They won't outrank a strong Google Business Profile and good reviews."]],
};
