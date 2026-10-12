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
];
