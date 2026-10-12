// Website technology checker: what a site is built with – website builder or CMS, shop platform,
// theme, plugins, analytics, advertising pixels, cookie banner, chat, hosting/CDN and server – from
// the page's own HTML, response headers and cookies, plus its email and DNS providers from DNS.
// Only what the site reveals publicly can be found; server-side software that leaves no trace can't.
import { normaliseUrl } from "../engine/checker.js";
import { query } from "./dns.js";
import { GUIDE_FOR } from "./builder-guides.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36 XKeyTechChecker/1.0 (+https://xkey.co.uk/website-technology-checker)";
const TIMEOUT_MS = 10_000, PAGE_CAP = 1_500_000, MAX_HOPS = 5;

export const CATEGORIES = [
  ["cms", "Website builder or CMS"], ["shop", "Online shop"], ["theme", "Theme"], ["builder", "Page builder"], ["seo", "SEO plugin"],
  ["wp", "WordPress plugins"], ["js", "JavaScript framework"], ["lib", "JavaScript libraries"], ["analytics", "Analytics"],
  ["tags", "Tag manager"], ["ads", "Advertising and tracking pixels"], ["consent", "Cookie consent"], ["marketing", "Email marketing and CRM"],
  ["chat", "Live chat and support"], ["reviews", "Reviews"], ["booking", "Online booking"], ["pay", "Payments"], ["fonts", "Fonts"],
  ["media", "Maps and video"], ["security", "Security and spam protection"], ["cdn", "Hosting and CDN"], ["server", "Web server"],
  ["lang", "Programming language"], ["email", "Email provider"], ["dns", "DNS provider"], ["sending", "Sends email with"], ["verified", "Accounts verified for this domain"],
];

// [name, category, page pattern, { header: pattern } | null, version pattern]
// Page patterns run on the HTML (scripts included), header patterns on response headers (set-cookie included).
const SIGNS = [
  // website builders and CMSs
  ["WordPress", "cms", /\/wp-content\/|\/wp-includes\/|<meta[^>]+name=["']generator["'][^>]+content=["']WordPress/i, { link: /wp-json/i }, /<meta[^>]+name=["']generator["'][^>]+content=["']WordPress ([\d.]+)/i],
  ["Shopify", "shop", /cdn\.shopify\.com|\bShopify\.theme\b|<meta[^>]+name=["']shopify-/i, { "x-shopid": /./, "x-shopify-stage": /./, "powered-by": /shopify/i }],
  ["Wix", "cms", /static\.wixstatic\.com|<meta[^>]+content=["']Wix\.com Website Builder/i, { "x-wix-request-id": /./ }],
  ["Squarespace", "cms", /static1\.squarespace\.com|<!-- This is Squarespace\. -->|assets\.squarespace\.com/i, { server: /squarespace/i }],
  ["Webflow", "cms", /\bdata-wf-(?:page|site)=|<meta[^>]+content=["']Webflow["']/i],
  ["GoDaddy Website Builder", "cms", /img1\.wsimg\.com|<meta[^>]+content=["']Starfield Technologies; Go Daddy Website Builder/i],
  ["Weebly / Square Online", "cms", /editmysite\.com|weebly\.com\/weebly/i],
  ["Duda", "cms", /dd-cdn\.multiscreensite\.com|dudaone\.com|irp\.cdn-website\.com/i],
  ["HubSpot CMS", "cms", /\/hs\/hsstatic\/|<meta[^>]+name=["']generator["'][^>]+content=["']HubSpot/i],
  ["Ghost", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Ghost/i, null, /<meta[^>]+name=["']generator["'][^>]+content=["']Ghost ([\d.]+)/i],
  ["Joomla", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Joomla|\/media\/jui\/|\/media\/system\/js\/core/i],
  ["Drupal", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Drupal|\/sites\/default\/files\/|drupal-settings-json/i, { "x-drupal-cache": /./, "x-generator": /drupal/i, "x-drupal-dynamic-cache": /./ }, /<meta[^>]+name=["']generator["'][^>]+content=["']Drupal (\d+)/i],
  ["TYPO3", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']TYPO3|\/typo3temp\//i],
  ["Umbraco", "cms", /\/umbraco\/|\/media\/[a-z0-9]{8}\/[^"']+\?rnd=/i],
  ["Craft CMS", "cms", null, { "x-powered-by": /craft cms/i }],
  ["Adobe Experience Manager", "cms", /\/etc\.clientlibs\/|\/content\/dam\//i],
  ["Contentful", "cms", /images\.ctfassets\.net/i],
  ["Sanity", "cms", /cdn\.sanity\.io/i],
  ["Framer", "cms", /framerusercontent\.com|<meta[^>]+name=["']generator["'][^>]+content=["']Framer/i],
  ["Jimdo", "cms", /jimstatic\.com|jimdo\.com\/app/i],
  ["Strikingly", "cms", /strikinglycdn\.com|static-assets\.strikinglycdn/i],
  ["Hostinger Website Builder", "cms", /zyrosite\.com|zyro\.com\/builder/i],
  ["Blogger", "cms", /<meta[^>]+content=["']blogger["'][^>]+name=["']generator|<meta[^>]+name=["']generator["'][^>]+content=["']Blogger|\.blogspot\.com\//i],
  ["Substack", "cms", /substackcdn\.com/i],
  ["Carrd", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Carrd|carrd\.co\/assets/i],
  ["Hugo", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Hugo/i, null, /content=["']Hugo ([\d.]+)/i],
  ["Jekyll", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Jekyll/i],
  ["Eleventy", "cms", /<meta[^>]+name=["']generator["'][^>]+content=["']Eleventy/i],
  // shops
  ["WooCommerce", "shop", /\/plugins\/woocommerce\/|woocommerce-(?:page|js|no-js)|wc-block-/i, { "set-cookie": /woocommerce_/i }],
  ["Magento / Adobe Commerce", "shop", /\/static\/version\d+\/frontend\/|data-mage-init|Mage\.Cookies/i, { "x-magento-tags": /./, "x-magento-cache-debug": /./ }],
  ["BigCommerce", "shop", /cdn\d*\.bigcommerce\.com|bigcommerce\.com\/s-/i],
  ["PrestaShop", "shop", /<meta[^>]+name=["']generator["'][^>]+content=["']PrestaShop|var prestashop\s*=/i, { "set-cookie": /PrestaShop-/ }],
  ["OpenCart", "shop", /catalog\/view\/theme\/|index\.php\?route=(?:common|product)\//i, { "set-cookie": /OCSESSID/ }],
  ["Ecwid", "shop", /app\.ecwid\.com|ecwid\.com\/script\.js/i],
  ["Big Cartel", "shop", /bigcartel\.com/i],
  ["Squarespace Commerce", "shop", /squarespace-commerce|commerce-product-item/i],
  ["Wix Stores", "shop", /wixstores|wix-ecommerce/i],
  // page builders
  ["Elementor", "builder", /\/plugins\/elementor\/|elementor-kit-\d+|class=["'][^"']*elementor-/i],
  ["Divi", "builder", /\/themes\/Divi\/|et_pb_section|\/plugins\/divi-builder\//i],
  ["WPBakery", "builder", /js_composer|class=["'][^"']*vc_row/i],
  ["Beaver Builder", "builder", /fl-builder-content|\/plugins\/bb-plugin\//i],
  ["Bricks", "builder", /\/themes\/bricks\/|class=["'][^"']*brxe-/i],
  ["Oxygen", "builder", /\/plugins\/oxygen\/|class=["'][^"']*ct-section/i],
  ["Avada", "builder", /\/themes\/Avada\/|fusion-builder-row|fusion-fullwidth/i],
  ["Breakdance", "builder", /\/plugins\/breakdance\/|class=["'][^"']*bde-/i],
  ["Gutenberg blocks", "builder", /class=["'][^"']*wp-block-(?:group|columns|cover|buttons)/i],
  // SEO plugins
  ["Yoast SEO", "seo", /yoast-schema-graph|This site is optimized with the Yoast SEO/i, { "x-redirect-by": /yoast/i }, /optimized with the Yoast SEO (?:Premium )?plugin v([\d.]+)/i],
  ["Rank Math", "seo", /rank-math-schema|<!-- Search Engine Optimization by Rank Math/i, null, /Rank Math (?:PRO )?- https?:\/\/rankmath\.com\/ -->|Rank Math PRO v([\d.]+)/i],
  ["All in One SEO", "seo", /<!-- All in One SEO|aioseo-/i, null, /All in One SEO (?:Pro )?([\d.]+)/i],
  ["SEOPress", "seo", /seopress/i],
  ["The SEO Framework", "seo", /<!-- The SEO Framework/i],
  // WordPress plugins
  ["Contact Form 7", "wp", /\/plugins\/contact-form-7\/|class=["'][^"']*wpcf7/i],
  ["Gravity Forms", "wp", /\/plugins\/gravityforms\/|gform_wrapper/i],
  ["WPForms", "wp", /\/plugins\/wpforms(?:-lite)?\/|wpforms-form/i],
  ["WP Rocket", "wp", /\/plugins\/wp-rocket\/|data-rocket-|<!-- This website is like a Rocket/i, { "x-rocket-nginx-serving-static": /./ }],
  ["LiteSpeed Cache", "wp", /\/plugins\/litespeed-cache\/|<!-- Page (?:optimized|generated) by LiteSpeed Cache/i, { "x-litespeed-cache": /./ }],
  ["W3 Total Cache", "wp", /Performance optimized by W3 Total Cache/i],
  ["WP Super Cache", "wp", /<!-- Dynamic page generated in [\d.]+ seconds\. -->\s*<!-- Cached page generated by WP-Super-Cache/i],
  ["Autoptimize", "wp", /\/cache\/autoptimize\//i],
  ["Jetpack", "wp", /\/plugins\/jetpack\/|stats\.wp\.com|i[0-3]\.wp\.com\//i],
  ["WPML", "wp", /\/plugins\/sitepress-multilingual-cms\/|wpml-ls/i],
  ["Site Kit by Google", "wp", /<meta[^>]+content=["']Site Kit by Google/i],
  ["MonsterInsights", "wp", /monsterinsights/i],
  ["Wordfence", "wp", /\/plugins\/wordfence\//i],
  ["Slider Revolution", "wp", /\/plugins\/revslider\/|rev_slider_wrapper/i],
  ["SiteGround Optimizer", "wp", /\/plugins\/sg-cachepress\/|siteground-optimizer/i],
  // JavaScript frameworks
  ["Next.js", "js", /__NEXT_DATA__|\/_next\/static\//, { "x-powered-by": /next\.js/i }],
  ["Nuxt", "js", /__NUXT__|\/_nuxt\//],
  ["Gatsby", "js", /id=["']___gatsby["']/],
  ["Astro", "js", /<astro-island|\/_astro\/|<meta[^>]+name=["']generator["'][^>]+content=["']Astro/i, null, /content=["']Astro v([\d.]+)/i],
  ["SvelteKit", "js", /__sveltekit|data-sveltekit/],
  ["Remix", "js", /__remixContext|window\.__remixManifest/],
  ["Angular", "js", /\bng-version=["']|\bng-app\b/, null, /ng-version=["']([\d.]+)/],
  ["React", "js", /data-reactroot|react-dom(?:\.production)?(?:\.min)?\.js|__NEXT_DATA__|id=["']___gatsby["']/],
  ["Vue.js", "js", /\bdata-v-[0-9a-f]{8}\b|vue(?:\.global|\.runtime)?(?:\.prod)?(?:\.min)?\.js|__NUXT__/],
  ["Alpine.js", "js", /\bx-data=|alpinejs/i],
  ["htmx", "js", /\bhx-(?:get|post)=|htmx\.org|htmx(?:\.min)?\.js/i],
  // libraries
  ["jQuery", "lib", /jquery(?:[.-][\d.]+)?(?:\.min)?\.js/i, null, /jquery[.-]([\d]+\.[\d.]+?)(?:\.min)?\.js|jquery(?:\.min)?\.js\?ver=([\d.]+)/i],
  ["Bootstrap", "lib", /bootstrap(?:\.bundle)?(?:\.min)?\.(?:css|js)/i],
  ["Tailwind CSS", "lib", /cdn\.tailwindcss\.com|tailwindcss/i],
  ["Font Awesome", "lib", /font-?awesome|kit\.fontawesome\.com/i],
  ["Swiper", "lib", /swiper(?:-bundle)?(?:\.min)?\.(?:js|css)/i],
  ["Slick", "lib", /slick(?:\.min)?\.(?:js|css)/i],
  ["GSAP", "lib", /gsap(?:\.min)?\.js|\/gsap@/i],
  ["Lottie", "lib", /lottie(?:-player)?(?:\.min)?\.js|lottie-player/i],
  // analytics
  ["Google Analytics 4", "analytics", /googletagmanager\.com\/gtag\/js\?id=G-|gtag\(\s*['"]config['"]\s*,\s*['"]G-/i],
  ["Google Analytics (Universal, retired)", "analytics", /google-analytics\.com\/(?:analytics|ga)\.js|['"]UA-\d{4,}-\d+['"]/i],
  ["Microsoft Clarity", "analytics", /clarity\.ms\/tag/i],
  ["Hotjar", "analytics", /static\.hotjar\.com|hotjar\.com\/c\/hotjar/i],
  ["Plausible", "analytics", /plausible\.io\/js/i],
  ["Fathom", "analytics", /cdn\.usefathom\.com/i],
  ["Matomo", "analytics", /matomo\.js|piwik\.js|_paq\.push/i],
  ["Adobe Analytics", "analytics", /AppMeasurement|omniture|\/s_code\.js/i],
  ["Mixpanel", "analytics", /cdn\.mxpnl\.com|mixpanel-\d|mixpanel\.init/i],
  ["Segment", "analytics", /cdn\.segment\.com/i],
  ["Heap", "analytics", /heapanalytics\.com|cdn\.heapanalytics/i],
  ["Cloudflare Web Analytics", "analytics", /static\.cloudflareinsights\.com/i],
  ["Vercel Analytics", "analytics", /\/_vercel\/insights\//i],
  ["Simple Analytics", "analytics", /simpleanalyticscdn\.com/i],
  ["Umami", "analytics", /umami(?:\.is)?\/script\.js|cloud\.umami\.is/i],
  ["Crazy Egg", "analytics", /script\.crazyegg\.com/i],
  ["Lucky Orange", "analytics", /luckyorange\.(?:com|net)/i],
  ["Yandex Metrica", "analytics", /mc\.yandex\.ru\/metrika/i],
  ["Jetpack Stats", "analytics", /stats\.wp\.com\/e-/i],
  // tag managers
  ["Google Tag Manager", "tags", /googletagmanager\.com\/gtm\.js|googletagmanager\.com\/ns\.html|['"]GTM-[A-Z0-9]{4,}['"]/i],
  ["Tealium", "tags", /tags\.tiqcdn\.com/i],
  ["Adobe Launch", "tags", /assets\.adobedtm\.com/i],
  // advertising and tracking pixels
  ["Meta (Facebook) Pixel", "ads", /connect\.facebook\.net\/[^"']*\/fbevents\.js|\bfbq\(\s*['"]init/i],
  ["Google Ads", "ads", /googleadservices\.com|['"]AW-\d{6,}['"]|googleads\.g\.doubleclick\.net/i],
  ["Google AdSense", "ads", /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle/i],
  ["LinkedIn Insight Tag", "ads", /snap\.licdn\.com\/li\.lms-analytics|_linkedin_partner_id/i],
  ["TikTok Pixel", "ads", /analytics\.tiktok\.com\/i18n\/pixel/i],
  ["Pinterest Tag", "ads", /s\.pinimg\.com\/ct\/core\.js|\bpintrk\(/i],
  ["Microsoft Advertising (Bing UET)", "ads", /bat\.bing\.com\/bat\.js/i],
  ["X (Twitter) Pixel", "ads", /static\.ads-twitter\.com\/uwt\.js/i],
  ["Snapchat Pixel", "ads", /sc-static\.net\/scevent\.min\.js/i],
  ["Criteo", "ads", /static\.criteo\.net|dynamic\.criteo\.com/i],
  ["Taboola", "ads", /cdn\.taboola\.com/i],
  ["Outbrain", "ads", /widgets\.outbrain\.com/i],
  // cookie consent
  ["Cookiebot", "consent", /consent\.cookiebot\.com/i],
  ["OneTrust", "consent", /cdn\.cookielaw\.org|optanon/i],
  ["CookieYes", "consent", /cdn-cookieyes\.com|cookieyes/i],
  ["Civic Cookie Control", "consent", /cc\.cdn\.civiccomputing\.com/i],
  ["Complianz", "consent", /\/plugins\/complianz-gdpr|cmplz-cookiebanner/i],
  ["Termly", "consent", /app\.termly\.io/i],
  ["iubenda", "consent", /cdn\.iubenda\.com/i],
  ["Osano", "consent", /cmp\.osano\.com/i],
  ["Usercentrics", "consent", /usercentrics\.eu|app\.usercentrics/i],
  ["Didomi", "consent", /sdk\.privacy-center\.org|didomi\.io/i],
  ["TrustArc", "consent", /consent\.trustarc\.com|truste\.com\/notice/i],
  ["Quantcast Choice", "consent", /cmp\.quantcast\.com|quantcast\.mgr\.consensu/i],
  ["Cookie Notice", "consent", /\/plugins\/cookie-notice\/|id=["']cookie-notice["']/i],
  ["Borlabs Cookie", "consent", /borlabs-cookie/i],
  ["Shopify cookie banner", "consent", /shopify-privacy-banner|privacy-banner\.shopifycdn/i],
  // email marketing and CRM
  ["HubSpot", "marketing", /js\.hs-scripts\.com|js\.hsforms\.net|js\.hs-analytics\.net/i],
  ["Mailchimp", "marketing", /chimpstatic\.com|list-manage\.com/i],
  ["Klaviyo", "marketing", /static\.klaviyo\.com|klaviyo\.com\/onsite/i],
  ["ActiveCampaign", "marketing", /trackcmp\.net|activehosted\.com/i],
  ["Brevo (Sendinblue)", "marketing", /sibforms\.com|sendinblue\.com|brevo\.com\/js/i],
  ["Kit (ConvertKit)", "marketing", /convertkit\.com|\.ck\.page/i],
  ["Marketo", "marketing", /munchkin\.marketo\.net/i],
  ["Salesforce Pardot", "marketing", /pi\.pardot\.com|pardot\.com\/pd\.js/i],
  ["Omnisend", "marketing", /omnisnippet|omnisend\.com/i],
  ["Zoho SalesIQ", "chat", /salesiq\.zoho/i],
  // chat and support
  ["Intercom", "chat", /widget\.intercom\.io|intercomcdn\.com/i],
  ["Tawk.to", "chat", /embed\.tawk\.to/i],
  ["Zendesk", "chat", /static\.zdassets\.com|zopim/i],
  ["LiveChat", "chat", /cdn\.livechatinc\.com/i],
  ["Drift", "chat", /js\.driftt\.com/i],
  ["Crisp", "chat", /client\.crisp\.chat/i],
  ["Tidio", "chat", /code\.tidio\.co/i],
  ["Freshchat", "chat", /wchat\.freshchat\.com|freshworks\.com\/widget/i],
  ["WhatsApp chat link", "chat", /wa\.me\/\d|api\.whatsapp\.com\/send/i],
  // reviews
  ["Trustpilot", "reviews", /widget\.trustpilot\.com/i],
  ["Feefo", "reviews", /api\.feefo\.com|feefo\.com\/feefo-widget/i],
  ["REVIEWS.io", "reviews", /widget\.reviews\.io|widget\.reviews\.co\.uk/i],
  ["Yotpo", "reviews", /staticw2\.yotpo\.com|cdn-widgetsrepository\.yotpo\.com/i],
  ["Judge.me", "reviews", /judge\.me/i],
  ["Trustindex", "reviews", /cdn\.trustindex\.io/i],
  ["Elfsight widgets", "reviews", /static\.elfsight\.com|elfsightcdn\.com/i],
  ["Checkatrade", "reviews", /checkatrade\.com/i],
  // booking
  ["Calendly", "booking", /assets\.calendly\.com|calendly\.com\/[a-z0-9_-]+/i],
  ["Fresha", "booking", /fresha\.com\/(?:book|a\/|providers)/i],
  ["Treatwell", "booking", /treatwell\.co\.uk\/(?:place|widget)/i],
  ["Booksy", "booking", /booksy\.com\/(?:widget|en-gb)/i],
  ["SimplyBook.me", "booking", /simplybook\.(?:me|it|net)/i],
  ["Acuity Scheduling", "booking", /acuityscheduling\.com/i],
  ["OpenTable", "booking", /opentable\.co(?:m|\.uk)\/(?:widget|restref|r\/)/i],
  ["ResDiary", "booking", /resdiary\.com/i],
  ["Bookwhen", "booking", /bookwhen\.com/i],
  // payments
  ["Stripe", "pay", /js\.stripe\.com/i],
  ["PayPal", "pay", /paypal\.com\/sdk\/js|paypalobjects\.com/i],
  ["Klarna", "pay", /klarnaservices\.com|klarnacdn\.net|klarna-placement/i],
  ["Clearpay / Afterpay", "pay", /js\.(?:afterpay|clearpay)\.co|static\.(?:afterpay|clearpay)|(?:afterpay|clearpay)-placement/i],
  ["Square", "pay", /squarecdn\.com|web\.squarecdn|js\.squareup\.com/i],
  ["Amazon Pay", "pay", /payments-amazon\.com/i],
  ["Shop Pay", "pay", /shop-pay|shopify-payment-button/i],
  // fonts
  ["Google Fonts", "fonts", /fonts\.googleapis\.com|fonts\.gstatic\.com/i],
  ["Adobe Fonts", "fonts", /use\.typekit\.net|p\.typekit\.net/i],
  ["Bunny Fonts", "fonts", /fonts\.bunny\.net/i],
  // maps and video
  ["Google Maps", "media", /maps\.googleapis\.com|google\.com\/maps\/embed|maps\.google\.com\/maps/i],
  ["YouTube", "media", /youtube(?:-nocookie)?\.com\/embed|youtube\.com\/iframe_api/i],
  ["Vimeo", "media", /player\.vimeo\.com/i],
  ["Wistia", "media", /fast\.wistia\.(?:com|net)/i],
  ["Mapbox", "media", /api\.mapbox\.com/i],
  ["Leaflet", "media", /leaflet(?:\.min)?\.(?:js|css)/i],
  // security
  ["Google reCAPTCHA", "security", /google\.com\/recaptcha|recaptcha\/api\.js|grecaptcha/i],
  ["hCaptcha", "security", /hcaptcha\.com\/1\/api\.js|js\.hcaptcha\.com/i],
  ["Cloudflare Turnstile", "security", /challenges\.cloudflare\.com\/turnstile/i],
  ["Sucuri", "security", null, { "x-sucuri-id": /./, server: /sucuri/i }],
  ["Imperva", "security", null, { "x-iinfo": /./, "x-cdn": /incapsula|imperva/i }],
  // hosting and CDN
  ["Cloudflare", "cdn", null, { server: /cloudflare/i, "cf-ray": /./ }],
  ["Fastly", "cdn", null, { "x-fastly-request-id": /./, "x-served-by": /^cache-/i }],
  ["Akamai", "cdn", null, { "x-akamai-transformed": /./, server: /akamai/i, "akamai-grn": /./ }],
  ["Amazon CloudFront", "cdn", null, { "x-amz-cf-id": /./, via: /cloudfront/i }],
  ["Amazon S3", "cdn", null, { server: /AmazonS3/i }],
  ["Vercel", "cdn", null, { server: /vercel/i, "x-vercel-id": /./ }],
  ["Netlify", "cdn", null, { server: /netlify/i, "x-nf-request-id": /./ }],
  ["GitHub Pages", "cdn", null, { server: /GitHub\.com/i }],
  ["Google Cloud", "cdn", null, { via: /\bgoogle\b/i, "x-goog-generation": /./, "x-guploader-uploadid": /./ }],
  ["Microsoft Azure", "cdn", null, { "x-azure-ref": /./, "x-ms-request-id": /./ }],
  ["Fly.io", "cdn", null, { server: /^Fly\//i, "fly-request-id": /./ }],
  ["Render", "cdn", null, { "rndr-id": /./, "x-render-origin-server": /./ }],
  ["Heroku", "cdn", null, { via: /vegur|heroku/i }],
  ["WP Engine", "cdn", /wpengine(?:powered)?\.com|wpe-/i, { "x-powered-by": /wp engine/i, "wpe-backend": /./ }],
  ["Kinsta", "cdn", null, { "x-kinsta-cache": /./, "ki-cache-type": /./, "ki-edge": /./ }],
  ["WordPress.com / VIP", "cdn", null, { "x-hacker": /./ }],
  ["Pantheon", "cdn", null, { "x-pantheon-styx-hostname": /./ }],
  ["Hostinger", "cdn", null, { platform: /hostinger/i, panel: /hpanel/i, "x-hcdn-request-id": /./ }],
  ["Bunny CDN", "cdn", null, { server: /bunnycdn/i, "cdn-pullzone": /./ }],
  ["KeyCDN", "cdn", null, { server: /keycdn/i }],
  ["Varnish cache", "cdn", null, { "x-varnish": /./, via: /varnish/i }],
  ["Shopify hosting", "cdn", null, { "x-shopid": /./ }],
  ["Squarespace hosting", "cdn", null, { server: /squarespace/i }],
  ["Wix hosting", "cdn", null, { "x-wix-request-id": /./ }],
  // programming languages (from headers and cookies)
  ["PHP", "lang", null, { "x-powered-by": /php/i, "set-cookie": /PHPSESSID/ }, /PHP\/([\d.]+)/i],
  ["ASP.NET", "lang", /__VIEWSTATE|__doPostBack/, { "x-powered-by": /asp\.net/i, "x-aspnet-version": /./, "set-cookie": /ASP\.NET_SessionId|\.AspNetCore\./ }],
  ["Java", "lang", null, { "set-cookie": /JSESSIONID/ }],
  ["Node.js (Express)", "lang", null, { "x-powered-by": /express/i }],
  ["Laravel", "lang", null, { "set-cookie": /laravel_session/ }],
  ["Ruby on Rails", "lang", /<meta[^>]+name=["']csrf-param["'][^>]+content=["']authenticity_token/i, { "x-runtime": /^\d+\.\d+$/ }],
  ["Django", "lang", /csrfmiddlewaretoken/i, { "set-cookie": /\bcsrftoken=/ }],
  // verification tags in the page
  ["Google Search Console", "verified", /<meta[^>]+name=["']google-site-verification["']/i],
  ["Bing Webmaster Tools", "verified", /<meta[^>]+name=["']msvalidate\.01["']/i],
  ["Pinterest", "verified", /<meta[^>]+name=["']p:domain_verify["']/i],
  ["Meta (Facebook) Business", "verified", /<meta[^>]+name=["']facebook-domain-verification["']/i],
  ["Yandex Webmaster", "verified", /<meta[^>]+name=["']yandex-verification["']/i],
];

const SERVERS = [["nginx", /^nginx/i], ["Apache", /^apache/i], ["LiteSpeed", /^litespeed/i], ["Microsoft IIS", /^microsoft-iis/i], ["OpenResty", /^openresty/i], ["Caddy", /^caddy/i], ["Envoy", /^envoy/i], ["Google Frontend", /^Google Frontend/i], ["Gunicorn", /^gunicorn/i], ["Kestrel", /^kestrel/i], ["Tengine", /^tengine/i], ["Cowboy", /^cowboy/i]];

const EMAIL = [["Google Workspace", /aspmx\.l\.google\.com|googlemail\.com|smtp\.google\.com|\.google\.com$/i], ["Microsoft 365", /mail\.protection\.outlook\.com|outlook\.com$/i], ["Zoho Mail", /zoho\.(?:com|eu|in)$/i], ["Proton Mail", /protonmail\.ch$/i], ["Fastmail", /messagingengine\.com$/i], ["iCloud Mail", /icloud\.com$/i], ["Yahoo Mail", /yahoodns\.net$/i], ["GoDaddy email", /secureserver\.net$/i], ["IONOS email", /ionos\.(?:co\.uk|com|de|es|fr)$|kundenserver\.de$|1and1\./i], ["123 Reg email", /123-reg\.co\.uk$/i], ["Namecheap Private Email", /privateemail\.com$|registrar-servers\.com$|jellyfish\.systems$/i], ["Titan Email", /titan\.email$/i], ["Hostinger email", /hostinger\.(?:com|co\.uk)$/i], ["Fasthosts email", /livemail\.co\.uk$/i], ["Mimecast", /mimecast\.(?:com|co\.za)$/i], ["Proofpoint", /pphosted\.com$|ppe-hosted\.com$/i], ["Barracuda", /barracudanetworks\.com$/i], ["Amazon WorkMail / SES", /awsapps\.com$|amazonaws\.com$/i], ["Cloudflare Email Routing", /mx\.cloudflare\.net$/i], ["ImprovMX", /improvmx\.com$/i], ["Yandex Mail", /yandex\.(?:net|ru)$/i], ["Mailgun", /mailgun\.org$/i], ["Krystal email", /krystal\.(?:uk|co\.uk)$/i]];
const DNSP = [["Cloudflare", /ns\.cloudflare\.com$/i], ["Amazon Route 53", /awsdns/i], ["Google Cloud DNS", /googledomains\.com$|ns-cloud-[a-z]\d*\.googledomains|google\.com$/i], ["Microsoft Azure DNS", /azure-dns\./i], ["GoDaddy", /domaincontrol\.com$/i], ["123 Reg", /123-reg\.co\.uk$/i], ["IONOS", /ui-dns\.(?:com|org|biz|de)$/i], ["Namecheap", /registrar-servers\.com$/i], ["Fasthosts", /livedns\.co\.uk$/i], ["Heart Internet", /heartinternet\.co\.uk$/i], ["Krystal", /krystal\.(?:co\.uk|uk|hosting)$/i], ["34SP.com", /34sp\.com$/i], ["Tsohost", /tsohost\.co\.uk$/i], ["Wix", /wixdns\.net$/i], ["Squarespace", /squarespacedns\.com$/i], ["Hostinger", /dns-parking\.com$|hostinger\./i], ["SiteGround", /siteground\.net$/i], ["Bluehost", /bluehost\.com$/i], ["HostGator", /hostgator\.com$/i], ["DigitalOcean", /digitalocean\.com$/i], ["Linode", /linode\.com$/i], ["Hetzner", /hetzner\.(?:com|de)$|your-server\.de$/i], ["OVHcloud", /ovh\.(?:net|co\.uk)$/i], ["DNSimple", /dnsimple\.com$/i], ["NS1", /nsone\.net$/i], ["UltraDNS", /ultradns\./i], ["Akamai", /akam\.net$/i], ["Gandi", /gandi\.net$/i], ["Vercel", /vercel-dns\.com$/i], ["WordPress.com", /wordpress\.com$/i], ["Shopify", /shopify\.com$/i]];
const SENDERS = [["Google Workspace", /_spf\.google\.com/i], ["Microsoft 365", /spf\.protection\.outlook\.com/i], ["SendGrid", /sendgrid\.net/i], ["Mailchimp", /servers\.mcsv\.net/i], ["Mailchimp Transactional (Mandrill)", /mandrillapp\.com/i], ["Mailgun", /mailgun\.org/i], ["Amazon SES", /amazonses\.com/i], ["Brevo (Sendinblue)", /brevo\.com|sendinblue\.com/i], ["Salesforce", /_spf\.salesforce\.com/i], ["HubSpot", /hubspotemail\.net/i], ["Zendesk", /zendesk\.com/i], ["SparkPost", /sparkpostmail\.com/i], ["Postmark", /mtasv\.net/i], ["Zoho", /zoho\.(?:com|eu|in)/i], ["Shopify", /shops\.shopify\.com/i], ["Mailjet", /mailjet\.com/i], ["Constant Contact", /constantcontact\.com/i], ["Campaign Monitor", /createsend\.com/i], ["Freshdesk", /freshdesk\.com/i], ["Help Scout", /helpscoutemail\.com/i], ["Xero", /_spf\.xero\.com/i], ["Klaviyo", /klaviyo/i]];
const TXT_VERIFY = [["Google Search Console", /^google-site-verification=/i], ["Meta (Facebook) Business", /^facebook-domain-verification=/i], ["Microsoft 365", /^MS=ms\d+/], ["Apple", /^apple-domain-verification=/i], ["Atlassian", /^atlassian-domain-verification=/i], ["DocuSign", /^docusign=/i], ["Adobe", /^adobe-(?:idp-site|sign)-verification=/i], ["Stripe", /^stripe-verification=/i], ["Zoom", /^ZOOM_verify_/i], ["Pinterest", /^pinterest-site-verification=/i], ["OpenAI", /^openai-domain-verification=/i], ["Slack", /^slack-domain-verification=/i], ["Dropbox", /^dropbox-domain-verification=/i], ["Yandex Webmaster", /^yandex-verification:/i], ["HubSpot", /^hubspot-developer-verification=/i], ["Mailchimp", /^mailchimp-/i], ["Brevo", /^brevo-code:/i], ["Zoho", /^zoho-verification=/i], ["Have I Been Pwned", /^have-i-been-pwned-verification=/i], ["Canva", /^canva-site-verification=/i], ["Ahrefs", /^ahrefs-site-verification_/i], ["Shopify", /^shopify-verification-code=/i], ["Notion", /^notion-domain-verification=/i], ["Webex", /^webexdomainverification\./i], ["Cisco", /^cisco-ci-domain-verification=/i], ["Miro", /^miro-verification=/i]];

const titleCase = (s) => s.replace(/[-_]+/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
const decode = (s) => String(s).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** What a page reveals about how it's built: [{ name, cat, version?, how }]. H(name) reads a response header. */
export function detectTech(html, H = () => null) {
  html = String(html || "");
  const found = new Map();
  const add = (name, cat, how, version) => { const k = cat + "|" + name; if (!found.has(k)) found.set(k, { name, cat, ...(version ? { version } : {}), how }); };
  for (const [name, cat, re, hdr, ver] of SIGNS) {
    let how = null;
    if (hdr) for (const [k, r] of Object.entries(hdr)) { const v = H(k); if (v && r.test(v)) { how = `${k} header`; break; } }
    if (!how && re && re.test(html)) how = "page code";
    if (!how) continue;
    let version = null;
    if (ver) { const m = html.match(ver) || (hdr && hdr["x-powered-by"] && String(H("x-powered-by") || "").match(ver)); if (m) version = m.slice(1).find(Boolean) || null; }
    add(name, cat, how, version);
  }
  // themes
  const themes = [...new Set([...html.matchAll(/\/wp-content\/themes\/([a-z0-9_.-]+)\//gi)].map((m) => m[1]))];
  for (const t of themes.slice(0, 3)) add(titleCase(t) + " (WordPress theme)", "theme", "page code");
  const shopTheme = html.match(/Shopify\.theme\s*=\s*\{[^}]*?"name"\s*:\s*"([^"]{1,60})"/);
  if (shopTheme) add(decode(shopTheme[1]) + " (Shopify theme)", "theme", "page code");
  const sqTpl = html.match(/"templateId"\s*:\s*"[^"]+"[^}]*"templateName"\s*:\s*"([^"]{1,40})"/);
  if (sqTpl) add(sqTpl[1] + " (Squarespace template)", "theme", "page code");
  // any other generator tag
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/name\s*=\s*["']generator["']/i.test(m[0])) continue;
    const g = decode((m[0].match(/content\s*=\s*["']([^"']{1,80})["']/i) || [])[1] || "").replace(/^powered by\s+/i, "").trim();
    if (g && ![...found.values()].some((t) => g.toLowerCase().includes(t.name.toLowerCase().split(/[ (/]/)[0]))) add(g, /commerce|shop/i.test(g) ? "shop" : /elementor|divi|wpbakery|visual composer|bricks|oxygen|avada|beaver|breakdance/i.test(g) ? "builder" : /seo|yoast|rank math/i.test(g) ? "seo" : found.has("cms|WordPress") ? "wp" : "cms", "generator tag");
  }
  // web server from the Server header (CDNs are listed above)
  const server = String(H("server") || "").trim();
  for (const [n, r] of SERVERS) if (r.test(server)) { const v = server.match(/\/([\d.]+)/); add(n, "server", "server header", v && v[1]); }
  return tidy([...found.values()]);
}

// Tidy up overlaps: a Shopify site doesn't also need "React" from its theme, Next.js already says React, and so on.
function tidy(list) {
  const has = (n) => list.some((t) => t.name === n);
  const drop = new Set();
  if (has("Next.js") || has("Gatsby") || has("Remix")) drop.add("React");
  if (has("Nuxt")) drop.add("Vue.js");
  if (has("Squarespace")) drop.add("Squarespace hosting");
  if (has("Wix")) drop.add("Wix hosting");
  if (has("Shopify")) drop.add("Shopify hosting");
  if (!has("WordPress")) { for (const t of list) if (t.cat === "wp" || (t.cat === "builder" && t.name === "Gutenberg blocks")) drop.add(t.name); }
  if (has("Rank Math") || has("Yoast SEO") || has("All in One SEO")) drop.add("SEOPress");
  if (has("Jetpack Stats")) drop.add("Jetpack");
  if (has("WhatsApp chat link") && list.filter((t) => t.cat === "chat").length > 1) drop.add("WhatsApp chat link");
  return list.filter((t) => !drop.has(t.name));
}

async function readText(res, cap) {
  if (!res.body || !res.body.getReader) return (await res.text()).slice(0, cap);
  const rd = res.body.getReader(), parts = []; let n = 0;
  for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); n += value.length; if (n > cap) { try { await rd.cancel(); } catch {} break; } }
  const buf = new Uint8Array(Math.min(n, cap)); let o = 0; for (const p of parts) { const take = Math.min(p.length, buf.length - o); buf.set(p.subarray(0, take), o); o += take; if (o >= buf.length) break; }
  return new TextDecoder().decode(buf);
}

const SECOND_LEVEL = /\.(?:co|org|me|ltd|plc|net|sch|ac|gov|nhs|police|com|gen|edu)\.[a-z]{2}$/i;
const apex = (host) => { const parts = host.split("."); return parts.slice(SECOND_LEVEL.test(host) ? -3 : -2).join("."); };
const match = (list, s) => (list.find(([, r]) => r.test(s)) || [])[0] || null;

/** Email provider, DNS host, email senders and verified accounts from the domain's DNS. */
async function dnsTech(env, host) {
  const out = [], add = (name, cat, how) => { if (name && !out.some((t) => t.name === name && t.cat === cat)) out.push({ name, cat, how }); };
  const names = [...new Set([host.replace(/^www\./, ""), apex(host)])];
  for (const name of names) {
    let mx, ns, txt;
    try { [mx, ns, txt] = await Promise.all(["MX", "NS", "TXT"].map((t) => query(env, name, t).then((r) => r.answers.filter((a) => a.type === t)))); } catch { return out; }
    if (!mx.length && !ns.length && name !== names[names.length - 1]) continue; // a subdomain: ask its parent
    for (const a of mx) { const h = (a.data.split(/\s+/)[1] || a.data).replace(/\.$/, "").toLowerCase(); if (h) add(match(EMAIL, h) || (h === "." ? null : `Own or other mail server (${h})`), "email", "MX record"); }
    for (const a of ns) { const h = a.data.replace(/\.$/, "").toLowerCase(); add(match(DNSP, h) || null, "dns", "NS record"); }
    if (ns.length && !out.some((t) => t.cat === "dns")) add(`Other (${ns[0].data.replace(/\.$/, "").toLowerCase()})`, "dns", "NS record");
    for (const a of txt) {
      const t = a.data.replace(/^"|"$/g, "").replace(/"\s+"/g, "");
      if (/^v=spf1\b/i.test(t)) for (const [n, r] of SENDERS) if (r.test(t)) add(n, "sending", "SPF record");
      const v = match(TXT_VERIFY, t); if (v) add(v, "verified", "TXT record");
    }
    break;
  }
  return out;
}

/** Fetch a page (following up to 5 redirects): { url, status, html, H } */
export async function getPage(start, fetchImpl) {
  let u = start;
  for (let i = 0; ; i++) {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const r = await fetchImpl(u.href, { redirect: "manual", signal: ac.signal, headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*;q=0.8", "accept-language": "en-GB,en;q=0.9" } });
      const loc = r.headers.get("location");
      if (r.status >= 300 && r.status < 400 && loc) {
        try { await r.body?.cancel(); } catch {}
        if (i >= MAX_HOPS) return { url: u.href, status: r.status, html: "", H: () => null, error: "Too many redirects." };
        try { u = normaliseUrl(new URL(loc, u).href); } catch { return { url: u.href, status: r.status, html: "", H: () => null, error: "It redirects somewhere we can't follow." }; }
        continue;
      }
      const H = (k) => (k === "set-cookie" && r.headers.getSetCookie ? r.headers.getSetCookie().join("\n") : r.headers.get(k)) || null;
      const html = /html|xml|text\/plain/i.test(r.headers.get("content-type") || "") || !r.headers.get("content-type") ? await readText(r, PAGE_CAP) : (await r.body?.cancel().catch(() => {}), "");
      return { url: u.href, status: r.status, html, H };
    } finally { clearTimeout(t); }
  }
}

/** GET /api/tech?url=… */
export async function techApi(env, params, fetchImpl) {
  let u; try { u = normaliseUrl(params.get("url")); } catch (e) { return { status: 400, body: { error: e.message } }; }
  let page;
  try { page = await getPage(u, fetchImpl); }
  catch (e) { return { status: 200, body: { start: u.href, url: u.href, status: 0, error: e.name === "AbortError" ? "The site didn't answer in time." : "We couldn't connect to that site.", tech: [], groups: CATEGORIES } }; }
  const host = new URL(page.url).hostname;
  const [fromPage, fromDns] = await Promise.all([Promise.resolve(detectTech(page.html, page.H)), dnsTech(env, host).catch(() => [])]);
  const tech = [...fromPage, ...fromDns];
  const has = (cat) => tech.some((t) => t.cat === cat);
  const notes = [];
  const blocked = page.status === 403 || page.status === 429 || page.status === 503 || (page.status === 202 && page.html.length < 500);
  if (page.error) notes.push({ level: "warn", text: page.error });
  else if (blocked) notes.push({ level: "warn", text: `The site answered with HTTP ${page.status}, which usually means bot protection. Only the hosting and DNS details below could be read.` });
  else if (page.status >= 400) notes.push({ level: "warn", text: `The page answered with HTTP ${page.status}, so it may not show the site's usual code.` });
  if (page.status === 200 && page.html) {
    if (!has("analytics") && !has("tags")) notes.push({ level: "info", text: "No analytics found on this page. Some sites only load it after cookie consent; otherwise the owner can't see how many visitors arrive." });
    if ((has("ads") || tech.some((t) => t.cat === "analytics" && !/Plausible|Fathom|Simple Analytics|Umami|Cloudflare Web Analytics|Vercel Analytics/.test(t.name))) && !has("consent")) notes.push({ level: "info", text: "Tracking tags found but no known cookie banner. In the UK, non-essential cookies need consent first (some banners are custom-built, so check by eye)." });
    if (tech.some((t) => t.name === "Google Analytics (Universal, retired)") && !tech.some((t) => t.name === "Google Analytics 4")) notes.push({ level: "warn", text: "Uses the old Universal Analytics code, which Google switched off in 2024. It isn't recording visits – move to Google Analytics 4." });
  }
  const cms = tech.find((t) => t.cat === "cms" || t.cat === "shop");
  const key = cms && cms.name.replace(/ \/.*$/, "");
  const guide = key && GUIDE_FOR[key] ? { name: key, path: GUIDE_FOR[key] } : null;
  const title = decode((page.html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).replace(/\s+/g, " ").trim().slice(0, 120);
  return { status: 200, body: { start: u.href, url: page.url, status: page.status, title, tech, groups: CATEGORIES, notes, guide } };
}

/** Email provider for an MX host, and the sending service behind an SPF include (null if unknown). */
export const emailProvider = (host) => match(EMAIL, host);
export const spfSender = (domain) => match(SENDERS, domain);
