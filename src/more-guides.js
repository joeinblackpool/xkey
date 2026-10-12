// Bundle of guides for popular searches: two general topics, then sector guides written around how each
// sector's customers search, so none repeats another page.

export const MORE_GUIDES = [
  {
    path: "/guides/how-to-rank-higher-on-google", crumb: "How to rank higher on Google", parent: ["/guides", "Guides"], article: true,
    title: "How to Rank Higher on Google: Find What's Holding You Back",
    desc: "How to rank higher on Google when you're stuck on page two or lower: find the pages closest to page one, then fix what holds each one back.",
    h1: "How to rank higher on Google",
    lead: "If your site is on Google but stuck below the first page, guessing wastes months. The quickest wins usually come from pages that already rank on page two, because Google already thinks they're nearly good enough.",
    sections: `<h2>How do I find the pages closest to page one?</h2>
<p>Open <a href="/guides/google-search-console">Google Search Console</a> → Performance, tick "Average position", and sort the queries by position. Searches where you sit around positions 8 to 20 with a fair number of impressions are your best opportunities: people are searching, Google is showing you, just not high enough. Click each query to see which page ranks for it.</p>
<p>Not on Google at all? That's a different problem – start with <a href="/guides/why-is-my-website-not-on-google">why isn't my website on Google?</a></p>
<h2>Does the page actually match what the searcher wants?</h2>
<p>Search the phrase yourself and look at what ranks on page one. If they're all price lists and yours is a story about your company, or they're step-by-step guides and yours is a sales page, Google has decided searchers want something different. Reshape your page to give that answer, better than the pages above you.</p>
<h2>Does the page say clearly what it's about?</h2>
<ul><li>Put the search phrase, or close wording, in the <a href="/guides/title-tags">title</a>, the main heading and the first paragraph.</li><li>Cover the questions the top pages answer, plus ones they miss. Our <a href="/guides/how-to-write-seo-content">guide to writing SEO content</a> covers how.</li><li>Run the <a href="/">free SEO check</a> on the page to catch missing titles, thin content or a slow load.</li></ul>
<h2>Do other pages on my site point to it?</h2>
<p>Add links to the page from your home page, from related services and from any blog posts on the topic, using descriptive link text. It's the one ranking signal you control completely – see <a href="/guides/internal-linking">internal linking</a>.</p>
<h2>Is my site trusted as much as the sites above me?</h2>
<p>Compare yourself with the pages that outrank you. The <a href="/seo-comparison">SEO comparison tool</a> puts your page side by side with a competitor's, and the <a href="/backlink-checker">backlink checker</a> shows which websites link to them but not to you. Local businesses should also compare reviews and Business Profiles – see the <a href="/guides/local-seo-checklist">local SEO checklist</a>.</p>
<h2>How long until I see a difference?</h2>
<p>Small on-page changes are usually picked up within days to a few weeks once Google recrawls the page. Changes that rely on new links and reviews take longer. Change one thing at a time on your most important pages, note the date, and compare the position in Search Console a few weeks later.</p>`,
    faqs: [["Why does my site rank differently when I search on my own phone?", "Results are personalised by location, device and search history. Use Search Console's average position instead of checking by hand."], ["Will updating the date on a page help it rank?", "Not on its own. Google looks at whether the content genuinely changed. Update the page properly, then update the date."], ["Can I pay Google to rank higher in the normal results?", "No. Google Ads buys sponsored places only; the ordinary results can't be bought. See our guide to SEO vs Google Ads."]],
  },
  {
    path: "/guides/what-is-eeat", crumb: "What is E-E-A-T?", parent: ["/guides", "Guides"], article: true,
    title: "What Is E-E-A-T? Experience, Expertise and Trust Explained",
    desc: "E-E-A-T in plain English: what experience, expertise, authority and trust mean to Google, and simple ways a small business can show them.",
    h1: "What is E-E-A-T? Experience, expertise and trust explained",
    lead: "E-E-A-T stands for experience, expertise, authoritativeness and trust. It comes from the guidelines Google gives the people who rate its search results. It isn't a score you can check, but the things it describes are exactly what Google's systems try to reward.",
    sections: `<h2>What does each letter mean?</h2>
<ul><li><strong>Experience:</strong> first-hand knowledge – you've actually done the job, used the product or visited the place.</li><li><strong>Expertise:</strong> the skill or qualifications to talk about the topic.</li><li><strong>Authoritativeness:</strong> others recognise you as a go-to source – links, mentions, awards, memberships.</li><li><strong>Trust:</strong> the page is accurate, honest and safe. Google calls trust the most important of the four.</li></ul>
<h2>Is E-E-A-T a ranking factor?</h2>
<p>Not a single one you can measure. Google says it uses many signals that line up with E-E-A-T, and its raters use the idea to judge whether search results are good. In practice, pages that clearly show who's behind them and why they can be trusted tend to do better, especially on topics about money, health, legal matters and safety.</p>
<h2>How can a small business show experience?</h2>
<ul><li>Your own photos of real jobs, products and premises, not stock images.</li><li>Case studies and examples with specific details: the problem, what you did, the result.</li><li>Writing in your own voice about what you've learned – the tips and mistakes only someone who does the work would know.</li></ul>
<h2>How do I show expertise and authority?</h2>
<ul><li>An about page and team pages with names, photos, qualifications and years in the trade.</li><li>Accreditations and memberships with registration numbers – Gas Safe, NICEIC, FCA, SRA, Propertymark and so on.</li><li>Named authors on guides, with a short note on why they're qualified to write it.</li><li>Links and mentions from trade bodies, local press and suppliers – see <a href="/guides/how-to-get-backlinks">how to get backlinks</a>.</li></ul>
<h2>What makes a website trustworthy?</h2>
<ul><li>A real address, phone number and company details that match your Google Business Profile.</li><li>Genuine reviews, and honest replies to the bad ones.</li><li>Clear prices, terms, returns and privacy pages.</li><li>A secure https:// site with no broken pages or intrusive pop-ups.</li><li>Accurate, up-to-date information with the date it was last reviewed.</li></ul>
<p>The <a href="/">free SEO check</a> looks at several of these signals – trust pages, contact details, structured data and security – and lists any that are missing.</p>
<h2>Does E-E-A-T matter for AI search?</h2>
<p>AI assistants such as ChatGPT and Google's AI Overviews prefer to cite clear, trustworthy sources, and they look for many of the same signals. Making it obvious who you are and what you know helps in both. See <a href="/guides/ai-search-optimisation">AI search optimisation</a>.</p>`,
    faqs: [["What does YMYL mean?", "\"Your Money or Your Life\" – topics where bad information could hurt someone's health, finances or safety. Google expects a higher level of trust on those pages."], ["Do I need author bios on every page?", "On articles and guides, a named author with a short bio helps. Service pages are fine with your business clearly named and good about and team pages."], ["Can AI-written content have good E-E-A-T?", "Only if a real expert adds first-hand detail and checks it. Generic text with nothing only you could know shows no experience at all."]],
  },
  {
    path: "/guides/seo-for-gyms-and-personal-trainers", crumb: "SEO for gyms and personal trainers", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Gyms, Personal Trainers and Fitness Studios",
    desc: "SEO for gyms, personal trainers and fitness studios: win local searches, list classes and prices, and turn more visitors into trial bookings.",
    h1: "SEO for gyms and personal trainers",
    lead: "People looking for a gym, class or trainer search close to home or work and want to know three things fast: what it costs, when the classes are, and whether it feels right for them. Make those easy to find and you win the sign-up.",
    sections: `<h2>What do fitness customers search for?</h2>
<p>"Gym near me", "24 hour gym Blackpool", "personal trainer Lytham", "reformer pilates St Annes", "boxing classes for beginners Preston", "women-only gym". January, spring and September bring the biggest peaks, so get pages and profiles ready before them.</p>
<h2>How do I win local fitness searches?</h2>
<ul><li>Complete your <a href="/guides/google-business-profile">Google Business Profile</a> with the most exact category (gym, yoga studio, personal trainer, boxing gym), opening hours including staffed hours, and photos of the equipment, studio and classes.</li><li>Personal trainers working from several gyms or clients' homes should use a service area rather than an address.</li><li>Ask members for reviews after a few weeks, when they've seen progress – see <a href="/guides/how-to-get-google-reviews">getting more Google reviews</a>.</li></ul>
<h2>What should a gym or PT website show?</h2>
<ul><li><strong>Prices as real text</strong> – memberships, class packs, PT sessions, joining fees. Hidden prices lose people to the gym down the road that shows them.</li><li><strong>A timetable</strong> on a real web page, not just an app or a picture, so Google and visitors can read it.</li><li><strong>A page for each main class or service</strong> – what happens, who it suits, what to bring, level.</li><li><strong>Trainer profiles</strong> with qualifications (Level 3 PT, REPs or CIMSPA membership, specialist courses) and what each one specialises in.</li><li><strong>A clear free trial or first-session offer</strong> with a booking button on every page.</li></ul>
<h2>Do client results help SEO?</h2>
<p>Real stories, with permission, are strong first-hand content: the goal, the plan, the result, in the client's words. Avoid exaggerated before-and-after claims – advertising rules apply to fitness and weight-loss claims too. Our guide to <a href="/guides/what-is-eeat">E-E-A-T</a> explains why genuine experience matters.</p>
<h2>Which links help a fitness business?</h2>
<p>Local running clubs and sports teams you sponsor or train, physios and sports therapists you refer to, local employers with staff wellness schemes, community events and charity challenges, and equipment brands that list affiliated gyms.</p>`,
    faqs: [["Should a personal trainer have a website?", "Yes, even a small one. A page for each service, prices, your qualifications and client stories helps you rank and gives people a reason to choose you over a gym's in-house trainers."], ["Do class booking apps hurt my SEO?", "Not if your own site still shows the timetable and prices as text. Link to the app for booking, but don't rely on it as your only page."], ["How do I rank for 'gym near me'?", "There's no trick: a complete, accurate Business Profile, the right category, steady reviews and photos. Google works out 'near' from where the searcher is."]],
  },
  {
    path: "/guides/seo-for-wedding-businesses", crumb: "SEO for wedding businesses", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Wedding Photographers, Venues and Suppliers",
    desc: "SEO for wedding photographers, venues and suppliers: win couples' planning searches, show real weddings and earn links from venues.",
    h1: "SEO for wedding businesses",
    lead: "Couples plan a wedding for months and search constantly along the way – for ideas, prices, venues and suppliers. Unlike an emergency plumber, you get many chances to be found. The trick is being useful at each stage.",
    sections: `<h2>How do couples search for wedding suppliers?</h2>
<p>From broad to specific as the date gets closer: "wedding venues Lancashire", "barn wedding venue near Preston", "how much is a wedding photographer UK", "wedding photographer Lytham Hall", "small wedding florist Blackpool". Searches that name a venue or style are less competitive and come from couples who are close to booking.</p>
<h2>What pages should a wedding business have?</h2>
<ul><li><strong>Real weddings:</strong> a page for each wedding you've worked on (with the couple's permission), naming the venue, season and style, with your best photos and a short story. These rank for "[venue] wedding" searches couples make when they've booked the venue and need suppliers.</li><li><strong>Venue pages</strong> for places you work at often, with tips only someone who's been there would know.</li><li><strong>Prices or packages</strong>, at least "from" prices. "How much does a wedding photographer cost" is a huge search; answering it honestly builds trust.</li><li><strong>An FAQ</strong> covering travel, deposits, timelines, what happens if it rains.</li></ul>
<h2>How do I stop a photo-heavy site being slow?</h2>
<p>Wedding sites are often the slowest on the web because galleries load dozens of full-size photos. Resize images before uploading, keep galleries to your best 20–40 photos per wedding, and let lower images load as people scroll. The <a href="/guides/image-seo">image SEO guide</a> has the details, and the <a href="/">free SEO check</a> shows your speed.</p>
<h2>Which links work best for wedding suppliers?</h2>
<ul><li>Venues' recommended supplier lists – ask every venue you work at.</li><li>Other suppliers you work with, featured on each other's real wedding posts.</li><li>Wedding blogs and magazines that feature real weddings; submit your best ones.</li><li>Wedding fairs and local directories.</li></ul>
<p>Check who links to competitors with the <a href="/backlink-checker">backlink checker</a> to find lists you're missing from.</p>
<h2>Does Google Business Profile matter for wedding suppliers?</h2>
<p>Yes, especially for venues and for searches like "wedding photographer near me". Add photos regularly and ask every couple for a review after they've received their photos or flowers – reviews carry a lot of weight for a once-in-a-lifetime purchase.</p>`,
    faqs: [["Should I publish my wedding prices?", "Starting prices at least. Couples compare on budget early, and pages that answer the price question rank for very popular searches."], ["Is Instagram enough for a wedding business?", "It's great for inspiration, but couples search Google when they're ready to book. A website with real weddings, prices and venue pages catches those searches."], ["How many real wedding posts should I write?", "Aim for one for each wedding at a venue couples might search for. Each post is a new page that can rank for that venue."]],
  },
  {
    path: "/guides/seo-for-car-garages", crumb: "SEO for car garages", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Car Garages, MOT Centres and Mechanics",
    desc: "SEO for car garages, MOT centres and mechanics: rank for MOT and repair searches, show prices and approvals, and take bookings online.",
    h1: "SEO for car garages and mechanics",
    lead: "Drivers search for a garage when something has gone wrong or an MOT is due, and they want someone nearby, honest and available soon. Prices, reviews and an easy booking decide who gets the job.",
    sections: `<h2>What do drivers search for?</h2>
<p>"MOT near me", "MOT Blackpool", "car service Lytham", "clutch replacement cost", "mobile mechanic Preston", "brakes grinding noise", "air con regas near me". Some searches are urgent and local; others, like "how much is a timing belt change", are research before a booking.</p>
<h2>How do I win the map results?</h2>
<ul><li>Choose the most exact category in your <a href="/guides/google-business-profile">Google Business Profile</a> – auto repair shop, MOT testing centre, tyre shop – and add each service with a price.</li><li>Mobile mechanics should set a service area instead of showing a home address.</li><li>Ask every customer for a review when they collect the car. Garages live or die on reputation, and reviews mentioning the job and price are especially persuasive. See <a href="/guides/how-to-get-google-reviews">how to get more Google reviews</a>.</li></ul>
<h2>What pages should a garage website have?</h2>
<ul><li><strong>MOT page</strong> with your price, how long it takes, whether you can do retests, and your DVSA-approved test centre status.</li><li><strong>Servicing page</strong> with interim and full service prices and what each includes.</li><li><strong>A page for each common repair</strong> – brakes, clutches, exhausts, timing belts, diagnostics, air con – with typical costs and how long it takes.</li><li><strong>Makes you specialise in</strong>, if any, such as German cars or hybrids.</li><li><strong>Online booking or a clear call-to-book</strong> button, with tap-to-call on mobile.</li></ul>
<h2>Should I publish repair prices?</h2>
<p>Where you can, yes. Prices "from", with what affects the final cost, help people choose you and match popular "how much does … cost" searches. Drivers are wary of being overcharged, so clear pricing is itself a trust signal.</p>
<h2>Which links help a garage?</h2>
<p>Trade schemes and memberships (such as Good Garage Scheme or an RMI membership), parts suppliers and manufacturers' approved repairer lists, local car clubs and motorsport events you sponsor, and local business directories. Check your existing links with the <a href="/backlink-checker">backlink checker</a>.</p>`,
    faqs: [["Should I show MOT prices if they're capped?", "Yes. The DVSA sets a maximum MOT fee, and many garages charge less – showing your price, and any discounts, is a reason to pick you."], ["Do I need separate pages for each repair?", "For the repairs you want more of and that people search for, yes. Group small jobs together on one general repairs page."], ["Do online booking widgets help SEO?", "Not directly, but they turn more visitors into bookings. Make sure the service details and prices are on the page as text, not only inside the widget."]],
  },
  {
    path: "/guides/seo-for-cleaning-companies", crumb: "SEO for cleaning companies", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Cleaning Companies and Window Cleaners",
    desc: "SEO for cleaning companies and window cleaners: rank in your area, give each service its own page, show prices and insurance, win contracts.",
    h1: "SEO for cleaning companies",
    lead: "Cleaning customers are often looking for someone they'll trust in their home or business week after week. Clear prices, proof of insurance and vetting, and a good local reputation matter more than anything clever.",
    sections: `<h2>What do cleaning customers search for?</h2>
<p>"House cleaner near me", "end of tenancy cleaning Blackpool", "office cleaning Preston", "window cleaner Lytham", "carpet cleaning prices", "oven cleaning near me". Domestic customers want a regular cleaner; landlords and tenants want one-off deep cleans; businesses want reliable contracts.</p>
<h2>How do I appear in local searches?</h2>
<ul><li>Set up a <a href="/guides/google-business-profile">Google Business Profile</a> with a service area covering the towns you work in, the exact category (house cleaning service, window cleaning service, carpet cleaner, commercial cleaning service) and each service listed.</li><li>Post before-and-after photos of real jobs.</li><li>Ask every customer for a review – regular customers are often happy to after a few visits.</li></ul>
<h2>What pages should a cleaning website have?</h2>
<ul><li><strong>A page for each service</strong> – regular domestic cleaning, end of tenancy, deep cleans, office and commercial, windows, carpets, ovens – with what's included, how long it takes and prices or price guides.</li><li><strong>A checklist page</strong> for end of tenancy cleans showing exactly what you clean. Tenants search for this, and letting agents link to good ones.</li><li><strong>Trust details:</strong> public liability insurance, DBS checks for staff, products you use, and any guarantee (such as re-cleaning free if a deposit is held back).</li><li><strong>The areas you cover</strong>, listed on one page and in your profile – not dozens of near-identical town pages.</li></ul>
<h2>How do I win commercial cleaning contracts from search?</h2>
<p>Business buyers compare on reliability and paperwork. Give commercial cleaning its own pages for each kind of premises you serve – offices, schools, surgeries, shops – listing hours, how you manage staff and quality, and insurance and health and safety details. Case studies with named clients (with permission) carry a lot of weight.</p>
<h2>Which links help cleaning companies?</h2>
<p>Letting agents and landlords' associations (for end of tenancy work), local business networks and chambers of commerce, product suppliers, and community groups you support. The <a href="/backlink-checker">backlink checker</a> shows where competitors get theirs.</p>`,
    faqs: [["Should I publish cleaning prices?", "Yes, at least hourly rates or price guides by property size. It filters out poor-fit enquiries and matches popular price searches."], ["Should I make a page for every town I clean in?", "Only if each page has real local content, like jobs done there and local reviews. Otherwise list your areas on one page and in your Business Profile."], ["Do I need separate pages for domestic and commercial cleaning?", "Yes. They're different customers searching different phrases, and each needs its own details and proof."]],
  },
  {
    path: "/guides/seo-for-new-websites", crumb: "SEO for new websites", parent: ["/guides", "Guides"], article: true,
    title: "SEO for a New Website: Your First 30 Days on Google",
    desc: "SEO for a brand new website: get found by Google quickly, avoid launch mistakes, and build the first pages, reviews and links that help it rank.",
    h1: "SEO for a new website: the first 30 days",
    lead: "A brand new website starts with no history, no links and no reviews, so Google has little reason to show it yet. The first month is about getting found, getting the basics right and giving Google its first reasons to trust you.",
    sections: `<h2>How long does it take Google to find a new website?</h2>
<p>Usually a few days to a few weeks. You can speed it up by telling Google the site exists: verify it in <a href="/guides/google-search-console">Google Search Console</a>, submit your sitemap, and use URL Inspection → Request indexing on your home page and main service pages. A link from somewhere Google already visits, such as your Google Business Profile or a supplier's site, helps too.</p>
<h2>What should I check on launch day?</h2>
<ul><li><strong>The site isn't blocked.</strong> Many builders and developers hide sites from search while they're being built. Check with the <a href="/robots-txt-tester">robots.txt tester</a> and the <a href="/">free SEO check</a>, which flags a noindex tag.</li><li><strong>One secure address.</strong> http, https, www and non-www should all end at the same https:// address – test with the <a href="/redirect-checker">redirect checker</a>.</li><li><strong>Every page has its own title and description.</strong> Not "Home" or the template's default.</li><li><strong>The site works on a phone</strong> and loads quickly.</li><li><strong>If this replaces an old site</strong>, every old address redirects to its new page – see <a href="/guides/website-redesign-seo">redesigning without losing rankings</a>.</li></ul>
<h2>Which pages should a new site have first?</h2>
<p>A home page that says plainly what you do and where, a page for each main service or product type, an about page with real people and photos, and a contact page with your address, phone and opening hours. Then answer the questions customers ask most, one page or section each. The <a href="/guides/on-page-seo-checklist">on-page SEO checklist</a> covers what each page needs.</p>
<h2>Why isn't my new site ranking yet?</h2>
<p>Being indexed isn't the same as ranking. New sites usually appear first for their own name and very specific searches, then climb for broader searches as they earn trust. Expect a few months for competitive local searches. Search Console's Performance report will show the first searches you appear for, often within a couple of weeks.</p>
<h2>How do I build trust from day one?</h2>
<ul><li>Claim your <a href="/guides/google-business-profile">Google Business Profile</a> and link it to the site.</li><li>Ask your first customers for reviews straight away – see <a href="/guides/how-to-get-google-reviews">how to get more Google reviews</a>.</li><li>Get your first links from people who already know you: suppliers, trade bodies, local groups, partners. See <a href="/guides/how-to-get-backlinks">how to get backlinks</a>.</li><li>Add structured data describing your business with the <a href="/schema-generator">schema generator</a>.</li></ul>
<h2>What should I avoid with a new site?</h2>
<p>Don't buy links or "SEO packages" promising instant rankings, don't copy text from competitors, and don't create dozens of near-identical town pages to look bigger. All of these can hold a new site back for a long time. Turn on <a href="/seo-monitoring">weekly monitoring</a> so you hear if something breaks while you're busy.</p>`,
    faqs: [["Is there a Google sandbox for new websites?", "Google says there's no specific sandbox, but new sites naturally rank slowly because they have no links, reviews or history yet. Building those is what moves you up."], ["Should I launch with lots of pages or a few?", "Launch with the pages that matter – home, services, about, contact – done well. Add more as you can make each one genuinely useful."], ["Do I need to submit my site to search engines?", "Submitting a sitemap in Google Search Console is enough for Google. Bing Webmaster Tools works the same way for Bing, which also powers some AI search tools."]],
  },
  {
    path: "/guides/seo-for-multiple-locations", crumb: "SEO for multiple locations", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Businesses With Multiple Locations or Branches",
    desc: "SEO for businesses with several branches: a Business Profile per location, useful location pages, no doorway pages, and reviews for each branch.",
    h1: "SEO for multiple locations",
    lead: "Each branch can appear in its own local map results, but only if Google can clearly see it's a real, separate location. Done well, every new branch adds a new set of local searches you can win.",
    sections: `<h2>Does each branch need its own Google Business Profile?</h2>
<p>Yes – one profile per real location that serves customers in person during its opening hours. Each needs its own address, phone number (ideally a local one rather than one central number) and opening hours, and staff there to serve customers. Don't create profiles for places you don't have a staffed presence; Google treats those as spam and can suspend them. Manage them together in a business group so you can update hours and posts in one go. See the <a href="/guides/google-business-profile">Google Business Profile guide</a>.</p>
<h2>What should a location page include?</h2>
<p>Each branch should have its own page on your website, linked from its Business Profile. Make each one genuinely useful to someone visiting that branch:</p>
<ul><li>Full address, map, directions, parking and public transport.</li><li>That branch's phone number, hours and any holiday changes.</li><li>The team at that branch, with photos.</li><li>Services that differ between branches – not every branch offers everything.</li><li>Reviews from that branch's customers, and local details such as nearby landmarks.</li><li>LocalBusiness structured data for that address – make it with the <a href="/schema-generator">schema generator</a>.</li></ul>
<h2>How do I avoid doorway pages?</h2>
<p>Doorway pages are near-identical pages made only to rank for different place names. Google's spam policies target them. If two location pages would say exactly the same thing with the town swapped, they're not useful. Real branches have real differences – people, opening hours, services, directions – so write those down. Areas you serve but have no branch in are better listed on one service-area page. More in <a href="/guides/duplicate-content">duplicate content</a>.</p>
<h2>How should the website be organised?</h2>
<ul><li>A "Locations" or "Find a branch" page linking to every branch page.</li><li>Branch pages at clear addresses, such as /locations/preston.</li><li>Each service page linking to the branches that offer it.</li><li>Your main menu and footer linking to the locations page.</li></ul>
<p>See <a href="/guides/internal-linking">internal linking</a> for why this structure matters.</p>
<h2>How do I handle reviews across branches?</h2>
<p>Ask customers to review the branch they used, with that branch's own review link. Track each branch's rating and reply to every review, ideally from the branch manager who knows the customer. A branch with few reviews is the easiest win – focus there first.</p>
<h2>What if a branch closes or moves?</h2>
<p>If it moves, update the address on its Business Profile rather than making a new one, so its reviews stay. If it closes, mark the profile as permanently closed and redirect its location page to the nearest branch or your locations page.</p>`,
    faqs: [["Can I use one phone number for all branches?", "You can, but a local number for each branch is clearer for customers and for Google. If calls go to a central team, a tracked local number that forwards there works well."], ["Should each location have its own website?", "Usually not. One website with strong location pages builds trust in one place and is far easier to keep up to date."], ["Can a virtual office have a Business Profile?", "Generally no. Google requires a real location that customers can visit or that's staffed during the stated hours. Service-area businesses should hide their address and set an area instead."]],
  },
  {
    path: "/guides/seo-for-driving-instructors", crumb: "SEO for driving instructors", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Driving Instructors: Get More Learners Booking",
    desc: "SEO for driving instructors and driving schools: rank for lessons in your area, show prices and pass rates honestly, cover test centres and get students to book.",
    h1: "SEO for driving instructors",
    lead: "Learner drivers and their parents search locally, compare prices and look for someone patient with a good pass record. A clear website and a strong Google profile win more pupils than any amount of advertising on cars.",
    sections: `<h2>What do learners search for?</h2>
<p>"Driving lessons Blackpool", "driving instructor near me", "automatic driving lessons Preston", "intensive driving course Lancashire", "female driving instructor Lytham", "driving lessons prices". Parents often search on behalf of 17-year-olds, so write for both.</p>
<h2>How do I appear in the map results?</h2>
<ul><li>Set up a <a href="/guides/google-business-profile">Google Business Profile</a> as a driving school with a service area covering the towns you teach in – hide your home address.</li><li>List each lesson type with a price: manual, automatic, block bookings, intensive courses, motorway and Pass Plus lessons.</li><li>Ask every pupil for a review after they pass, when they're happiest. A photo of them with their certificate (with permission) is great for your profile too. See <a href="/guides/how-to-get-google-reviews">getting Google reviews</a>.</li></ul>
<h2>What should a driving instructor's website include?</h2>
<ul><li><strong>Prices as real text:</strong> single lessons, block bookings, intensive courses, and any first-lesson offer.</li><li><strong>Your ADI status</strong> – that you're a DVSA-approved driving instructor (or a trainee, if you are) – plus your experience and any specialist training, such as teaching nervous drivers or learners with additional needs.</li><li><strong>The areas and test centres you cover</strong>, with what you know about each test centre's routes and how you prepare pupils for them.</li><li><strong>Your car</strong> – manual or automatic, dual controls, and whether pupils can be picked up from school, college or work.</li><li><strong>Pass stories</strong> from real pupils, and honest pass-rate information if you share it.</li></ul>
<h2>Which guides help a driving school rank?</h2>
<p>Learners search lots of questions before they book: "how many lessons do I need", "what's on the driving test", "how to book a driving test", "show me tell me questions". Answering them clearly, with a link to your booking page, brings in learners early. See <a href="/guides/how-to-write-seo-content">how to write SEO content</a>.</p>
<h2>Which links help a driving instructor?</h2>
<p>Local schools and colleges' careers or sixth-form pages, local community sites, driving instructor association directories, and local businesses you work with. Check where competitors are listed with the <a href="/backlink-checker">backlink checker</a>.</p>`,
    faqs: [["Should I publish my lesson prices?", "Yes. Learners and parents compare prices first, and pages showing them match common price searches."], ["Should I make a page for each test centre?", "If you teach for several test centres, a page each with real local knowledge – routes, tricky junctions, how you prepare pupils – is genuinely useful and isn't a doorway page."], ["Do I need a website if I'm with a franchise?", "Many franchises give you a profile page, but your own Business Profile and a simple site with your prices, reviews and areas helps pupils choose you specifically."]],
  },
  {
    path: "/guides/seo-for-pet-businesses", crumb: "SEO for pet businesses", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Dog Groomers, Walkers, Kennels and Pet Businesses",
    desc: "SEO for dog groomers, walkers, kennels and pet sitters: rank in local searches, show prices and insurance, and share photos of happy pets.",
    h1: "SEO for pet businesses",
    lead: "Pet owners are choosing someone to trust with a member of the family. They search locally, look at photos, read reviews closely and want to see you're insured and experienced. Show all of that clearly and you'll fill your diary.",
    sections: `<h2>What do pet owners search for?</h2>
<p>"Dog groomer near me", "dog walker Lytham", "cat sitter Blackpool", "dog boarding Preston", "puppy training classes", "mobile dog grooming", plus breed-specific searches like "cockapoo grooming". Searches spike before holidays for boarding and sitting.</p>
<h2>How do I win local pet searches?</h2>
<ul><li>Choose the exact category in your <a href="/guides/google-business-profile">Google Business Profile</a> – pet groomer, dog walker, pet sitter, kennel, dog trainer – and list every service with a price.</li><li>Mobile groomers, walkers and sitters should use a service area, not a home address.</li><li>Post photos of happy dogs after grooms or walks (owners usually love to share). They're your best advert.</li><li>Ask every customer for a review – see <a href="/guides/how-to-get-google-reviews">how to get more Google reviews</a>.</li></ul>
<h2>What should a pet business website show?</h2>
<ul><li><strong>Prices</strong> by service and dog size or breed, so owners know where they stand.</li><li><strong>Trust details:</strong> insurance, DBS checks, pet first aid training, grooming or training qualifications, and the licence number if you run boarding, home boarding or day care (these need a council animal activity licence in England).</li><li><strong>A page per service</strong> – full groom, puppy groom, hand stripping, group walks, solo walks, home boarding – explaining what's included and how long it takes.</li><li><strong>Breed pages</strong> for the breeds you groom most, with how you groom them and photos, if you have real experience to share.</li><li><strong>How booking works</strong>, cancellation rules, and what owners need to bring.</li></ul>
<h2>Do reviews and photos really help?</h2>
<p>For pet businesses they're often the deciding factor. Owners read reviews for signs that pets are treated gently and come home happy. Photos of real pets you've cared for, posted regularly, show you're active and loved. Use your own photos, not stock images – see <a href="/guides/image-seo">image SEO</a> for keeping them light.</p>
<h2>Which links help pet businesses?</h2>
<p>Local vets, pet shops and rescues you work with, breed clubs, dog-friendly cafés and pubs, local Facebook groups' recommendation pages and community sites. Many will link to a trusted local groomer or walker if you ask.</p>`,
    faqs: [["Do dog walkers need a website?", "A simple one helps: your areas, prices, insurance and reviews. Combined with a Business Profile it makes you easy to find and trust."], ["Should I show prices for grooming?", "Yes, at least 'from' prices by size or breed. Owners compare before calling, and price pages match what they search."], ["Do I need a licence to mention on my site?", "In England, boarding, home boarding and dog day care need an animal activity licence from the council. Showing your licence number and star rating builds trust."]],
  },
  {
    path: "/guides/seo-for-removal-companies", crumb: "SEO for removal companies", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Removal Companies and Man and Van Services",
    desc: "SEO for removal companies and man and van services: rank for moves in your area, show prices and insurance, and get more quote requests.",
    h1: "SEO for removal companies",
    lead: "People moving house search early, compare several firms and ask for quotes. Most choose on trust and price. A website that makes both obvious, and makes getting a quote easy, wins the job.",
    sections: `<h2>What do people search for when moving?</h2>
<p>"Removals Blackpool", "man and van near me", "house removals cost", "office removals Preston", "storage near me", "packing service", "long distance removals Lancashire to London". Most people search one to two months before their move, and again in a panic the week before.</p>
<h2>How do I appear in local searches?</h2>
<ul><li>Complete your <a href="/guides/google-business-profile">Google Business Profile</a> as a moving company, with a service area if customers don't visit you, and list each service with a price guide.</li><li>Post photos of your vans, team and careful packing.</li><li>Ask every customer for a review once they've unpacked – movers are judged heavily on reviews. See <a href="/guides/how-to-get-google-reviews">how to get more Google reviews</a>.</li></ul>
<h2>What should a removals website include?</h2>
<ul><li><strong>A quote form that's quick to fill in</strong>, plus a phone number and WhatsApp if you use it.</li><li><strong>Price guides:</strong> typical costs by property size or by van and crew per hour, and what changes the price.</li><li><strong>Trust details:</strong> goods-in-transit and public liability insurance, trade association membership (such as the British Association of Removers), years in business and the team.</li><li><strong>A page for each service:</strong> house moves, flat moves, office moves, single items, packing, storage, long-distance and European moves.</li><li><strong>Real moves</strong> as short case studies – the property, the distance, how long it took.</li></ul>
<h2>What guides attract people planning a move?</h2>
<p>A moving checklist, how to pack a kitchen, how many boxes you need, what to do on moving day, who to tell when you move. Useful guides get found weeks before the move, earn links from estate agents and letting agents, and put your name first when people need a quote. See <a href="/guides/how-to-write-seo-content">how to write SEO content</a>.</p>
<h2>Which links help a removal company?</h2>
<p>Estate agents and letting agents (many keep lists of recommended movers), storage companies, local business groups, trade association directories and community sites. Offer agents a printed or online moving checklist with your details – a useful resource they'll happily link to.</p>`,
    faqs: [["Should I put removal prices on my website?", "Price guides are worth it even if every move is quoted. They answer a very common search and help customers trust you'll be fair."], ["Should I make pages for every town I move people to?", "Only for routes or areas where you have real detail to share, such as regular long-distance runs. Otherwise list your areas on one page."], ["Do quote comparison sites help SEO?", "They can send work and sometimes a link, but you compete on price with every other firm there. Your own profile, reviews and website bring customers who've already chosen you."]],
  },
  {
    path: "/guides/seo-for-tutors", crumb: "SEO for tutors", parent: ["/guides", "Guides"], article: true,
    title: "SEO for Tutors and Tutoring Businesses in the UK",
    desc: "SEO for private tutors: rank for your subjects and exams locally and online, show qualifications and DBS checks, and turn parents into bookings.",
    h1: "SEO for tutors",
    lead: "Parents look for a tutor when exams loom or a child is struggling. They search by subject, level and area, and they need to trust you with their child. Make your subjects, qualifications and results easy to find and they'll get in touch.",
    sections: `<h2>What do parents and students search for?</h2>
<p>"Maths tutor Blackpool", "GCSE English tutor near me", "11 plus tutor Lancashire", "A level chemistry tutor online", "dyslexia tutor Preston". Searches peak in September, after mock results in January, and in the run-up to exams.</p>
<h2>Should I target local or online searches?</h2>
<p>Both, if you teach both. For in-person tutoring, a <a href="/guides/google-business-profile">Google Business Profile</a> with a service area (hide your home address) helps you appear in local map results. For online tutoring, subject and exam pages on your website matter more, because online searches aren't tied to a place and compete nationally – so be specific: "online GCSE maths tutor for foundation tier" is easier to win than "online maths tutor".</p>
<h2>What should a tutor's website include?</h2>
<ul><li><strong>A page for each subject and level</strong> you teach – GCSE maths, A level biology, 11+ – with exam boards, how you structure sessions and what progress looks like.</li><li><strong>Qualifications and experience:</strong> degree, teaching qualification (QTS), years teaching, examiner experience, and specialist training such as SEN support.</li><li><strong>Safeguarding:</strong> an enhanced DBS check and how sessions run, especially for online lessons.</li><li><strong>Prices and availability</strong> as real text, and how to book a first session.</li><li><strong>Results and testimonials</strong> from parents and students, with permission.</li></ul>
<h2>What content helps tutors rank?</h2>
<p>Helpful pages for the questions parents and students ask: "what's on the 11 plus in Lancashire", "how to revise for GCSE maths", "what grade boundaries mean", "how much does a tutor cost". Written from real teaching experience, these rank, earn links from schools and parent groups, and lead naturally to booking you. See <a href="/guides/what-is-eeat">E-E-A-T</a> for why your own experience matters.</p>
<h2>Do tutoring platforms help or hurt?</h2>
<p>Platforms like Tutorful or MyTutor can bring students, but they take a cut and the student belongs to them. Use them alongside your own website and profile, link to your own site where they allow it, and ask happy families to review you on Google too.</p>`,
    faqs: [["How much should I charge, and should I show it?", "Showing your rate builds trust and saves time. Check local and online rates for your subject and level and price accordingly."], ["Do I need a separate page for each subject?", "Yes, for each subject and level you want to be found for. Parents search very specifically, and a focused page answers them better."], ["Can tutors get Google reviews?", "Yes. Ask parents or adult students to review you after a good result or term of progress, and never offer free lessons in return."]],
  },
];
