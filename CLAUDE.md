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

## Backlink checker (/backlink-checker)
- Data: Common Crawl's domain-level web graph (free, public, ~133M domains / 2.1B links, new release quarterly). `backlinks/build.py` keeps every linked domain (all endings): referring-domain count, 0–100 link strength (log of referring domains vs the most-linked domain) and its 50 strongest linkers.
- Format 2 (scope "all"): `manifest.json` (release, tag, shards, files), `bl-index.bin` (3 little-endian uint32 per shard: file, offset, length), `bl-data-N.bin` (< 1.9 GB each; gzipped text shards, lines `domain\tref_domains\tstrength\tlinker:strength,…\thc_rank`; hc_rank = Common Crawl's harmonic centrality position from `-domain-ranks.txt.gz`, 0 = unranked, missing in releases built before Oct 2026; manifest `ranked` = number of ranked domains). Shard = zlib crc32(domain) % 131072. Format 1 (first UK-only release: fnv1a32 % 4096, JSON shards, offsets in the manifest) is still read by `src/backlinks.js`.
- Built by `.github/workflows/backlinks.yml` on a GitHub runner (push to backlinks/** on main, quarterly cron, or manual): one pass over the edges counts links and saves each partition's links to local disk (`--spill`), then 16 partitions are sorted and written by 4 processes. First real run (cc-main-2026-jul-aug-sep): 23 min build + 4 min upload, 120M linked domains, 5.5 GB in 3 data files. Each build gets its own tag (`backlinks-<release>-<timestamp>`), uploads as a draft, becomes "latest" only when every file is there, then all but the previous backlink release are deleted. No secrets involved.
- `src/backlinks.js` reads `releases/latest/download/manifest.json` (6 h edge cache), `bl-index.bin` whole (kept in memory), then one Range request per lookup (must be HTTP 206, never a whole data file). Non-.uk sites are allowed only when manifest.scope is "all"; they try the last 3 labels, then the last 2 (not for com.au-style suffixes).
- Tests: format-2 fixture in `test/fixtures/backlinks/` (rebuild with `python test/fixtures/make-backlinks.py`), format-1 fixture in `test/fixtures/backlinks-v1/`, both via `env.BL_DATA` (`blData()` in test/lib.mjs). Builder test: `python backlinks/test_build.py`.

## Domain authority checker (/domain-authority-checker)
- Same index as the backlink checker. `GET /api/authority?d=a.com,b.co.uk` (≤10 sites; the page sends up to 100 in batches). Authority = 100 × (1 − ln(hc_rank) / ln(ranked)), min 1; falls back to link strength when a release has no ranks. Ranks are optional in the build: if the ranks file is missing, the build still runs with every rank 0.

## Domain age checker (/domain-age-checker) and WHOIS lookup (/whois-lookup)
- `src/whois.js`, `GET /api/whois?d=a.com,b.co.uk` (≤10; the age page sends up to 100 in batches; raw WHOIS text only for single lookups). Registry data via RDAP, base URL per ending from IANA's bootstrap (data.iana.org/rdap/dns.json, cached a day). Endings without RDAP (.de, .eu, .it, .ie …) fall back to WHOIS on port 43 (`cloudflare:sockets`, server from whois.iana.org). Results cached 12 h (not registered: 1 h).
- Tests use stand-ins `env.WHOIS_FETCH` / `env.WHOIS_TCP` (`whoisStandIns()` in test/lib.mjs). Real-world check: `node test/live.mjs registries` (real registries) and `node test/live.mjs site` (live xkey.co.uk APIs), run by `.github/workflows/live-check.yml` on pushes, after deploys to main and weekly.

## Redirect checker (/redirect-checker)
- `src/redirects.js`, `GET /api/redirects?u=…&u=…[&agent=mobile]` (≤10; the page sends up to 100 in batches). Follows each hop with `redirect: "manual"` (max 10), re-validating every hop with the engine's `normaliseUrl`, and follows meta refresh (≤10 s) on HTML pages. Shares a 45-subrequest budget per API call. Desktop/mobile browser user agents only (no Googlebot impersonation). Tested in-process against xkey.co.uk's own redirects and a fake web in test/tools.mjs.

## Broken link checker (/broken-link-checker) and HTTP header checker (/http-header-checker)
- `src/linkcheck.js`: the browser drives a whole-site crawl (≤300 pages, ≤2,500 links). `GET /api/links/page?url=` reads one page (robots.txt respected, token `xkeylinkchecker`, same-site redirects followed) and returns its links and images with anchor text; `GET /api/links/check?u=…` (≤10) tests links (HEAD, GET if HEAD is refused, ≤5 redirects; 401/403/429/999 = "blocked", not broken), cached 1 h (broken 15 min), 45-subrequest budget per call.
- `src/headers.js`: `GET /api/headers?url=` = `traceRedirects(…, withHeaders)` plus plain-English notes per hop (X-Robots-Tag noindex, Link canonical, charset, compression, Cache-Control, HSTS, server versions).

## DNS lookup (/dns-lookup)
- `src/dns.js`, `GET /api/dns?d=` – A/AAAA/CNAME/MX/NS/TXT/CAA/SOA via DNS-over-HTTPS JSON (cloudflare-dns.com, dns.google as fallback), plus www and `_dmarc` lookups and checks (site resolves, www resolves, MX, one SPF and no +all, DMARC policy). DKIM isn't checked (needs a selector). Tests: `env.DNS_FETCH` stand-in (`dnsStandIn()` in test/lib.mjs).

## MX lookup, SPF, DMARC and DKIM checkers (/mx-lookup, /spf-checker, /dmarc-checker, /dkim-checker)
- `src/email.js`, `GET /api/email?d=[&t=mx|spf|dmarc|dkim][&s=selector]` – MX (provider via `emailProvider` in tech.js, each host's A/AAAA), SPF followed through every include/redirect with the 10-lookup count, DMARC tags (falls back to the parent domain's record), DKIM only when t=dkim (the selector given, or the `SELECTORS` list). One form (`FORMS.email`, page field `emailType`), element ids em-. Each page shows its own part in full and one line for the others. Tests: email zone in `dnsStandIn()`.

## Website technology checker (/website-technology-checker)
- `src/tech.js`, `GET /api/tech?url=` – fetches one page (≤5 redirects, browser user agent) and matches its HTML, headers and cookies against the `SIGNS` list (CMS/builder, shop, theme, page builder, SEO and WordPress plugins, JS frameworks, analytics, ads pixels, cookie banner, chat, reviews, booking, payments, fonts, CDN/host, server, language); MX/NS/TXT from DNS (`query` in dns.js) give email provider, DNS host, SPF senders and verified accounts. Lists only what leaves a trace. Add a technology by adding one line to `SIGNS` (and a test in test/tools.mjs if it's tricky).

## Website hosting checker (/website-hosting-checker)
- `src/hosting.js`, `GET /api/hosting?d=` – A/AAAA (≤2 IPv4 + 1 IPv6), each IP's network owner via RDAP (IANA ipv4/ipv6 bootstrap, longest-prefix match), reverse DNS (PTR), plus `getPage` + `detectTech` from tech.js for the platform/CDN. Hosted builders (Shopify, Wix …) and hosts with their own headers (WP Engine, Vercel …) win; behind a CDN (Cloudflare …) the real host is reported as hidden, never guessed. Tests: `ipRdap` in `whoisStandIns()`, PTR in `dnsStandIn()`.

## Website down checker, Open Graph checker, hreflang checker
- Browser-only logic in tools-client.js. The down checker (/website-down-checker) reuses `/api/redirects`. The Open Graph checker (/open-graph-checker) and hreflang checker (/hreflang-checker) use `src/meta.js`, `GET /api/meta?url=` (title, every head `<meta>`/`<link>`, html lang, hreflang from Link headers; `getPage` from tech.js); the hreflang checker loads up to 20 alternates (3 at a time) to check return links. Browser tests fake `/api/meta` with a scenario's `routes`.
## SSL checker (/ssl-checker)
- `src/ssl.js`, `GET /api/ssl?d=` – live: https connection (a failed TLS fetch = not secure), http→https redirect, HSTS, mixed content on the home page (`mixedContent`, active vs passive). Certificate issuer/dates/names from Certificate Transparency (crt.sh JSON, `exclude=expired`, newest covering cert; Cert Spotter API if crt.sh fails; cached 6 h) because Workers can't read the served certificate – the page says so. Tests: `env.CT_FETCH` (`ctStandIn()` in test/lib.mjs).

## Browser-only text tools: UTM builder (/utm-builder), URL slug generator (/url-slug-generator), case converter (/case-converter)
- All in tools-client.js, nothing sent to the server. Element id prefixes ut-, us-, cc- (sg- is taken by the schema generator).

## Layout
- `src/` – XKey pages (`content.js`), shell/styles (`site.js`), routing + APIs (`index.js`), browser tools (`tools-client.js`, served as /assets/tools.js), page parser (`page-parse.js`), OG image (`og.js`).
- `src/related.js` – the "Related guides" block on every tool and guide page: tools list their guides by hand in `TOOL_GUIDES`, guides share topics in `TOPICS`. Add new tools and guides there; unlisted pages still get guides picked automatically. check.mjs fails if a guide is linked from fewer than 2 pages.
- `src/page-dates.js` – each page's [first published, last changed, content hash], used for sitemap lastmod, Article/WebApplication dates and "Last updated". Written by `node test/dates.mjs` (test/all.mjs runs it first): commit the file when it changes. A page missing from it or changed since counts as changed on `UPDATED`.
- IndexNow: the 15-minute cron submits only pages that are new or changed since the last submission (per-page hashes in KV `indexnow-pages`). Google doesn't use IndexNow; it reads sitemap.xml (submitted in Search Console).
- `engine/` – SEO checker engine **shared with icework.co.uk** (repo joeinblackpool/ICEWORK, folder `src/`). `src/page-parse.js` is also copied to ICEWORK `src/` (it powers the competitor topic gap there). Keep the two copies identical: change it here, then copy the same files into ICEWORK `src/` and run its tests (`node test/check.mjs`, `node test/checker-unit.mjs`).

## Before pushing – `node test/all.mjs` must pass
- `test/check.mjs` – 0 problems on every page (titles ≤580px, descriptions 500–990px, unique titles, valid JSON-LD, no broken internal links; also runs XKey's own checker on every page).
- `test/tools.mjs` – builds the Worker the way Cloudflare does (esbuild, keep-names on) and clicks through every tool in Chromium; fails on any script error or missing result. Add a scenario whenever a tool is added or changed.
- `test/mobile.mjs` – every page on iPhone 13 and Pixel 7: no sideways scroll, tap targets ≥44px.
- `crawler/test_crawler.py` – the Python crawler against fake local sites (products first, redirect loops, bot-protection blocks, 20,000-product sitemap list, web-app flow).
- `test/lib.mjs` runs the Worker locally with stand-ins for Cache, KV and Workers AI; checks of xkey.co.uk run in-process, so no internet is needed. Tests need Playwright + esbuild (`npm i -g playwright esbuild && npx playwright install chromium`).
- Browser scripts are served from Function#toString: never rely on bundler helpers in them (wrangler.jsonc sets `keep_names: false`; src/index.js adds a `__name` shim as a safety net).

## Rules
- **Joe's absolute rule: search visitors come first.** The site's number one goal is to rank first on Google for every product and service it offers – without visitors the site isn't worth doing. Rank every piece of work by how many search visitors it will bring, and never ship anything that could hurt rankings (thin or near-duplicate pages, slower pages, hidden text, blocked crawlers, changed addresses without redirects).
- Never break Google's rules: no scraping Google results, no fake reviews, no bought links, no doorway pages.
- Copy is honest: "unlimited" only for tools that run in the browser; say what a tool can't measure.
- Free means free: no sign-up, no email, no subscription. Rate limits only to stop abuse.
- Never ask Joe to paste tokens or keys in chat; secrets go in Cloudflare/GitHub settings. If he pastes one, don't use it and tell him to delete it.
- Do the work rather than asking; keep reports short and plain.
