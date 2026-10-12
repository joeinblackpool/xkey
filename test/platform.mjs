// Website builder detection (engine/platform.js) and the report's "On WordPress: …" steps.
import { detectPlatform, howTo, HOW_TO } from "../engine/platform.js";
import { analyse } from "../engine/checker.js";
import { checkerReport } from "../engine/checker-ui.js";
import { BRAND, esc } from "../src/site.js";

let failed = 0;
const eq = (name, got, want) => { const ok = got === want; if (!ok) failed++; console.log(`${ok ? " ok " : "FAIL"}  ${name}${ok ? "" : ` – got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`}`); };

const page = (head, body = "") => `<!doctype html><html lang="en"><head>${head}</head><body>${body}</body></html>`;
eq("WordPress", detectPlatform(page('<link rel="stylesheet" href="/wp-content/themes/x/style.css">')), "WordPress");
eq("WordPress generator", detectPlatform(page('<meta name="generator" content="WordPress 6.6">')), "WordPress");
eq("Wix", detectPlatform(page('<meta name="generator" content="Wix.com Website Builder">')), "Wix");
eq("Wix header", detectPlatform(page(""), (h) => (h === "x-wix-request-id" ? "1" : null)), "Wix");
eq("Squarespace", detectPlatform(page('<!-- This is Squarespace. --><script src="https://static1.squarespace.com/x.js"></script>')), "Squarespace");
eq("Shopify", detectPlatform(page('<link href="//cdn.shopify.com/s/files/1/theme.css">')), "Shopify");
eq("Webflow", detectPlatform(page("", '<html data-wf-page="abc">')), "Webflow");
eq("Hand-made site", detectPlatform(page("<title>Hi</title>")), null);
eq("Unknown platform → no steps", howTo(null, "Title tag"), null);
eq("Unknown check → no steps", howTo("Wix", "Not a check"), null);
for (const p of Object.keys(HOW_TO)) eq(`${p} has title steps`, typeof howTo(p, "Title tag"), "string");

// the report shows the steps for a WordPress page that has no meta description
const r = analyse({ url: "https://smithplumbing.co.uk/", status: 200, headers: {}, html: page('<title>Plumber in Preston | Smith</title><link rel="stylesheet" href="/wp-content/themes/x/style.css">', "<h1>Plumber</h1><p>Leaks fixed.</p>"), ms: 200, bytes: 500, redirects: 0, chain: [], robots: "", robotsStatus: 200, llms: false, sitemap: null, broken: null });
eq("analyse() reports the platform", r.platform, "WordPress");
const html = checkerReport(esc, BRAND, r);
eq("report shows Built with WordPress", /Built with WordPress/.test(html), true);
eq("report shows WordPress steps for the description", html.includes("On WordPress:</strong> " + esc(HOW_TO.WordPress["Meta description"])), true);
eq("report links to the description writer", html.includes('href="/ai-meta-description-generator"'), true);
eq("report has the authority section", html.includes('id="offsite"'), true);
eq("report without BUSINESS extras has no authority section", checkerReport(esc, { name: "X", fullName: "X", domain: "x.co.uk" }, r).includes('id="offsite"'), false);

console.log(failed ? `\n${failed} platform checks failed` : "\nPlatform checks passed");
process.exit(failed ? 1 : 0);
