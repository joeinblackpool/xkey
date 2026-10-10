// Phone checks (iPhone 13, Pixel 7): no sideways scroll, no text overflow, tap targets >= 44px.
// Needs Playwright. Run: node test/mobile.mjs (starts the site locally if nothing is on :8789)
import { need, serve } from "./lib.mjs";
const { chromium, devices } = await need("playwright");
const { PAGES } = await import("../src/index.js");
// Use a server already running on :8789 (e.g. wrangler dev), otherwise start the local one.
let site = null;
try { await fetch("http://localhost:8789/"); } catch { site = await serve(8789); }
const paths = PAGES.map((p) => p.path);
const b = await chromium.launch();
let total = 0;
for (const dev of ["iPhone 13", "Pixel 7"]) {
  const ctx = await b.newContext({ ...devices[dev] });
  let problems = 0;
  for (const p of paths) {
    const page = await ctx.newPage();
    await page.goto("http://localhost:8789" + p);
    const r = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw) out.push(`horizontal scroll ${document.documentElement.scrollWidth}>${vw}`);
      // WCAG 2.2 target size: 24x24 CSS px, or enough spacing; inline links inside sentences are exempt
      for (const el of document.querySelectorAll("a, button, summary")) {
        const inText = el.tagName === "A" && el.closest("p, li") && !el.classList.contains("btn") && !el.closest("nav, footer, .card");
        const rc = el.getBoundingClientRect();
        if (inText || rc.width === 0) continue;
        if (rc.height < 44 && rc.width < 200 || rc.height < 24) out.push(`small target ${Math.round(rc.width)}x${Math.round(rc.height)} "${el.textContent.trim().slice(0, 30)}"`);
      }
      for (const el of document.querySelectorAll("h1,h2,h3,p,li")) if (el.scrollWidth > el.clientWidth + 1) out.push(`text overflow <${el.tagName}> "${el.textContent.trim().slice(0, 30)}"`);
      return out;
    });
    if (r.length) { problems += r.length; console.log(dev, p, [...new Set(r)].slice(0, 8)); }
    await page.close();
  }
  console.log(`${dev}: ${paths.length} pages, ${problems} problems`);
  total += problems;
}
await b.close();
if (site) await site.close();
process.exit(total ? 1 : 0);
