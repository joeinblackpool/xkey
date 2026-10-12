// Which website builder a page was made with, and how to make the common fixes there.
// Most small-business owners can't edit HTML, so "add a meta description" only helps if we also
// say where that box is in WordPress, Wix, Squarespace or Shopify.

const SIGNS = [
  ["Shopify", /cdn\.shopify\.com|\bShopify\.theme\b|<meta[^>]+name=["']shopify-/i, "x-shopid"],
  ["Wix", /static\.wixstatic\.com|<meta[^>]+content=["']Wix\.com Website Builder/i, "x-wix-request-id"],
  ["Squarespace", /static1\.squarespace\.com|<!-- This is Squarespace\. -->/i],
  ["Webflow", /\bdata-wf-page=|<meta[^>]+content=["']Webflow["']/i],
  ["GoDaddy", /img1\.wsimg\.com|<meta[^>]+content=["']Starfield Technologies; Go Daddy Website Builder/i],
  ["Weebly", /editmysite\.com|weebly\.com\/weebly/i],
  ["Duda", /dd-cdn\.multiscreensite\.com|dudaone\.com/i],
  ["HubSpot", /js\.hs-scripts\.com|<meta[^>]+content=["']HubSpot["']/i],
  ["Ghost", /<meta[^>]+name=["']generator["'][^>]+content=["']Ghost/i],
  ["Joomla", /<meta[^>]+name=["']generator["'][^>]+content=["']Joomla/i],
  ["Drupal", /<meta[^>]+name=["']generator["'][^>]+content=["']Drupal|\/sites\/default\/files\//i, "x-drupal-cache"],
  ["WordPress", /\/wp-content\/|\/wp-includes\/|<meta[^>]+name=["']generator["'][^>]+content=["']WordPress/i],
];

/** The builder behind a page ("WordPress", "Wix", …) or null. H(name) reads a response header. */
export function detectPlatform(html, H = () => null) {
  for (const [name, re, header] of SIGNS) if ((header && H(header)) || re.test(html || "")) return name;
  return null;
}

// Where to make each fix, by check name. Only steps we're sure of; anything missing falls back
// to the general fix text.
const WP_SEO = "Edit the page and scroll to the Yoast SEO or Rank Math box (install one of these free plugins if you have neither)";
export const HOW_TO = {
  WordPress: {
    "Title tag": `${WP_SEO}, then fill in the SEO title.`,
    "Meta description": `${WP_SEO}, then fill in the meta description.`,
    "Indexable": "Settings → Reading: untick “Discourage search engines from indexing this site”. In Yoast or Rank Math, check this page isn't set to noindex.",
    "XML sitemap": "WordPress makes one at /wp-sitemap.xml, and Yoast or Rank Math make /sitemap_index.xml. Submit it in Google Search Console.",
    "Open Graph & social cards": "Yoast SEO and Rank Math add these tags for you. Set a sharing image in the plugin's Social tab on each page.",
    "Favicon": "Appearance → Customize → Site Identity → Site Icon (Settings → General in newer versions).",
    "H1 heading": "Most themes show the page title as the H1. In the editor, make sure no other block uses Heading 1 – use Heading 2 for sections.",
    "Image alt text": "Media → Library: click each image and fill in Alternative Text. For images already on a page, select the image block and fill in Alternative text in the sidebar.",
    "Images": "Install a free image optimiser plugin (such as EWWW Image Optimizer or Smush) to shrink images and serve WebP.",
    "AI crawler access": "Edit robots.txt in Yoast (Yoast SEO → Tools → File editor) or Rank Math (General Settings → Edit robots.txt) and remove the lines blocking AI crawlers.",
    "LocalBusiness markup": "Make the code with our free schema generator, then paste it into your site header with a free plugin such as WPCode.",
    "HTTPS": "Ask your host to turn on a free SSL certificate, then in Settings → General change both addresses to start with https://.",
  },
  Wix: {
    "Title tag": "In the Editor open the Pages menu, click ⋯ next to the page → SEO basics, and edit the Title tag.",
    "Meta description": "In the Editor open the Pages menu, click ⋯ next to the page → SEO basics, and edit the Meta description.",
    "Indexable": "Pages menu → ⋯ next to the page → SEO basics: turn on “Let search engines index this page”.",
    "XML sitemap": "Wix makes /sitemap.xml for you once the site is published on your own domain. Connect Google Search Console from the Wix SEO setup checklist.",
    "Open Graph & social cards": "Pages menu → ⋯ next to the page → Social share: add an image, title and description.",
    "H1 heading": "Click the main heading, open its text settings and set the HTML tag to H1. Set other headings to H2.",
    "Image alt text": "Click the image → Settings, and fill in “What's in the image? Tell Google”.",
    "AI crawler access": "Dashboard → Marketing & SEO → SEO → Robots.txt editor: remove the lines blocking AI crawlers.",
    "LocalBusiness markup": "Fill in your business info in Settings, then add the code from our schema generator under the page's SEO → Advanced SEO → Structured data markup.",
  },
  Squarespace: {
    "Title tag": "Pages panel → gear icon on the page → SEO tab: fill in the SEO title.",
    "Meta description": "Pages panel → gear icon on the page → SEO tab: fill in the SEO description.",
    "Indexable": "Page settings → SEO: turn off “Hide page from search engines”, and make sure the site isn't password-protected.",
    "XML sitemap": "Squarespace makes /sitemap.xml for you. Submit it in Google Search Console.",
    "Open Graph & social cards": "Page settings (gear icon) → Social Image: upload a 1200 × 630 image.",
    "Favicon": "Settings → Browser icon (favicon).",
    "H1 heading": "Select the main heading text and choose Heading 1 from the text style menu; use Heading 2 for the rest.",
    "Image alt text": "Edit each image block and fill in its alt text (image description) field.",
    "AI crawler access": "Settings → Crawlers: turn off blocking of AI crawlers if you want AI search to read your site.",
    "LocalBusiness markup": "Fill in Settings → Business information. For full markup, paste our schema generator's code into Settings → Advanced → Code Injection → Header (Core plan and above).",
    "HTTPS": "Settings → SSL: choose Secure.",
  },
  Shopify: {
    "Title tag": "Open the product, collection or page, scroll to “Search engine listing” and click Edit. For the home page: Online Store → Preferences.",
    "Meta description": "Open the product, collection or page, scroll to “Search engine listing” and click Edit. For the home page: Online Store → Preferences.",
    "Indexable": "Online Store → Preferences: remove the store password so Google can see the shop.",
    "XML sitemap": "Shopify makes /sitemap.xml for you. Submit it in Google Search Console.",
    "Open Graph & social cards": "Online Store → Preferences: add a social sharing image.",
    "H1 heading": "Most themes use the product or page title as the H1. If there's a second H1, check the sections added in Online Store → Themes → Customize.",
    "Image alt text": "Products → open the product → click an image → Add alt text.",
    "AI crawler access": "Online Store → Themes → ⋯ → Edit code → robots.txt.liquid: remove the rules blocking AI crawlers.",
    "LocalBusiness markup": "Paste our schema generator's code into theme.liquid (Online Store → Themes → ⋯ → Edit code), just before </head>.",
    "HTTPS": "Shopify adds SSL for you. Settings → Domains shows its status – it can take up to 48 hours after connecting a domain.",
  },
};

/** Platform-specific steps for a check, or null. */
export const howTo = (platform, check) => (platform && HOW_TO[platform] && HOW_TO[platform][check]) || null;
