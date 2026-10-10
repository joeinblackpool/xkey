# XKey (xkey.co.uk)

Free SEO & AI search checker for UK businesses, made by IceWork (icework.co.uk). Owner: Joe, Blackpool.

## Deploy
- Single Cloudflare Worker `xkey`. Push to `main` → Cloudflare Workers Builds deploys automatically (root directory `/`, `npx wrangler deploy`).
- Custom domains xkey.co.uk + www (wrangler.jsonc). KV `STATE` (monitors, badge scores, IndexNow). Workers AI binding `AI` (AI title/description writer, capped daily).
- Optional secret `PSI_KEY` (Google PageSpeed) — set in the Cloudflare dashboard, never in code or chat.

## Website crawler (crawler/)
- Python/Flask app (`crawler/`), NOT part of the Worker: Render runs it from `render.yaml` (rootDir `crawler`), planned at crawler.xkey.co.uk. Wrangler ignores the folder.
- Crawls one site (robots.txt respected, 2.5–5.5 s between pages, max 10,000 rows): SEO issues report + score, Excel/CSV/Google Sheets, product data, competitor compare, emailed re-crawls (needs SMTP settings on Render). Run locally: `cd crawler && pip install -r requirements.txt && python app.py`. Details: `crawler/README.md`.
- `REQUIRE_EMAIL` (email before download) exists but stays OFF: it breaks the "no email" rule below unless Joe says otherwise.

## Layout
- `src/` – XKey pages (`content.js`), shell/styles (`site.js`), routing + APIs (`index.js`), browser tools (`tools-client.js`, served as /assets/tools.js), page parser (`page-parse.js`), OG image (`og.js`).
- `engine/` – SEO checker engine **shared with icework.co.uk** (repo joeinblackpool/ICEWORK, folder `src/`). `src/page-parse.js` is also copied to ICEWORK `src/` (it powers the competitor topic gap there). Keep the two copies identical: change it here, then copy the same files into ICEWORK `src/` and run its tests (`node test/check.mjs`, `node test/checker-unit.mjs`).

## Before pushing
- `node test/check.mjs` must report 0 problems (titles ≤580px, descriptions 500–990px, unique titles, valid JSON-LD, no broken internal links; it also runs XKey's own checker on every page).
- Phone layout: `test/mobile.mjs` (Playwright) – no sideways scroll, tap targets ≥44px.

## Rules
- Never break Google's rules: no scraping Google results, no fake reviews, no bought links, no doorway pages.
- Copy is honest: "unlimited" only for tools that run in the browser; say what a tool can't measure.
- Free means free: no sign-up, no email, no subscription. Rate limits only to stop abuse.
- Never ask Joe to paste tokens or keys in chat; secrets go in Cloudflare/GitHub settings. If he pastes one, don't use it and tell him to delete it.
- Do the work rather than asking; keep reports short and plain.
