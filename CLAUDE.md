# XKey (xkey.co.uk)

Free SEO & AI search checker for UK businesses, made by IceWork (icework.co.uk). Owner: Joe, Blackpool.

## Deploy
- Single Cloudflare Worker `xkey`. Push to `main` → Cloudflare Workers Builds deploys automatically (root directory `/`, `npx wrangler deploy`).
- Custom domains xkey.co.uk + www (wrangler.jsonc). KV `STATE` (monitors, badge scores, IndexNow). Workers AI binding `AI` (AI title/description writer, capped daily).
- Optional secret `PSI_KEY` (Google PageSpeed) — set in the Cloudflare dashboard, never in code or chat.

## Website crawler (crawler/)
- Python/Flask app (`crawler/`), NOT part of the Worker: Render (free plan, Oregon) runs it from `render.yaml` (rootDir `crawler`) at https://crawler.xkey.co.uk (CNAME, DNS only). Render pulls the public repo by URL, so pushes don't auto-deploy: use Render → seo-crawler → Manual Deploy → Deploy latest commit. A deploy/restart wipes running and finished jobs.
- "Full product list, fast" mode lists every product address from a shop's sitemaps (names/codes from the URL) without visiting pages; prices need a products-only crawl. Sites behind bot protection (e.g. HTTP 202 empty pages) are reported as blocked – never try to get around a site's protection.
- Crawls one site (robots.txt respected, 2.5–5.5 s between pages, max 10,000 rows): SEO issues report + score, Excel/CSV/Google Sheets, product data, competitor compare, emailed re-crawls (needs SMTP settings on Render). Run locally: `cd crawler && pip install -r requirements.txt && python app.py`. Details: `crawler/README.md`.
- `REQUIRE_EMAIL` (email before download) exists but stays OFF: it breaks the "no email" rule below unless Joe says otherwise.

## Layout
- `src/` – XKey pages (`content.js`), shell/styles (`site.js`), routing + APIs (`index.js`), browser tools (`tools-client.js`, served as /assets/tools.js), page parser (`page-parse.js`), OG image (`og.js`).
- `engine/` – SEO checker engine **shared with icework.co.uk** (repo joeinblackpool/ICEWORK, folder `src/`). `src/page-parse.js` is also copied to ICEWORK `src/` (it powers the competitor topic gap there). Keep the two copies identical: change it here, then copy the same files into ICEWORK `src/` and run its tests (`node test/check.mjs`, `node test/checker-unit.mjs`).

## Before pushing – `node test/all.mjs` must pass
- `test/check.mjs` – 0 problems on every page (titles ≤580px, descriptions 500–990px, unique titles, valid JSON-LD, no broken internal links; also runs XKey's own checker on every page).
- `test/tools.mjs` – builds the Worker the way Cloudflare does (esbuild, keep-names on) and clicks through every tool in Chromium; fails on any script error or missing result. Add a scenario whenever a tool is added or changed.
- `test/mobile.mjs` – every page on iPhone 13 and Pixel 7: no sideways scroll, tap targets ≥44px.
- `crawler/test_crawler.py` – the Python crawler against fake local sites (products first, redirect loops, bot-protection blocks, 20,000-product sitemap list, web-app flow).
- `test/lib.mjs` runs the Worker locally with stand-ins for Cache, KV and Workers AI; checks of xkey.co.uk run in-process, so no internet is needed. Tests need Playwright + esbuild (`npm i -g playwright esbuild && npx playwright install chromium`).
- Browser scripts are served from Function#toString: never rely on bundler helpers in them (wrangler.jsonc sets `keep_names: false`; src/index.js adds a `__name` shim as a safety net).

## Rules
- Never break Google's rules: no scraping Google results, no fake reviews, no bought links, no doorway pages.
- Copy is honest: "unlimited" only for tools that run in the browser; say what a tool can't measure.
- Free means free: no sign-up, no email, no subscription. Rate limits only to stop abuse.
- Never ask Joe to paste tokens or keys in chat; secrets go in Cloudflare/GitHub settings. If he pastes one, don't use it and tell him to delete it.
- Do the work rather than asking; keep reports short and plain.
