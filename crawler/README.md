# XKey website crawler

A Python/Flask app, hosted on Render (see `../render.yaml`), planned at
crawler.xkey.co.uk. It is separate from the Cloudflare Worker.

| File | What it is |
|---|---|
| `app.py` | Web app: form, live progress, report, downloads, compare, email features. |
| `seo_crawler.py` | Crawls one site (no per-site setup) and writes one row per page. Also a command-line tool. |
| `reports.py` | SEO issues, 0-100 score, Excel export, "what changed" diff, competitor compare. |
| `store.py` | SQLite store for email leads and scheduled re-crawls. |
| `mailer.py` | Sends email through any SMTP service. |
| `myscraper.py` | Original selector-based scraper for pulling set fields from one known site. |
| `templates/` | Page templates. |

## What visitors get
- **SEO issues report and score.** Broken pages (and the page that links to
  them), missing or duplicate titles and descriptions, missing H1, slow
  pages, thin content, images without alt text and noindex pages, ranked
  High / Medium / Low, plus a score out of 100.
- **Downloads.** Excel (Summary, Issues and Pages sheets), CSV, an issues
  CSV, and a Google Sheets formula (`=IMPORTDATA(...)`) that pulls the data
  into a sheet.
- **Product directories.** "Only this section" (e.g. `/products/`) and
  "Only save product pages" give one row per product with name, price,
  currency, SKU, brand, stock and image (from schema.org / Open Graph data).
- **Full product list, fast.** Reads the shop's sitemaps (product sitemaps
  first) and lists every product address with a name and product code taken
  from the address – up to 200,000 rows in a minute or two, without visiting
  the pages. Addresses robots.txt disallows are left out. Prices need a normal
  products-only crawl of a section.
- **Competitor compare.** Crawls two sites with the same settings and shows
  them side by side, best result in green, with an Excel download.
- **Email me when the site changes** (needs SMTP, below). Weekly or monthly
  re-crawls that email new broken pages, fixes, price drops and rises,
  stock changes, title changes and new or removed pages, with the
  spreadsheet attached. Visitors confirm by email first, and every email has
  a stop link. Maximum 3 watched sites per email.
- **Email before download** (off by default). With `REQUIRE_EMAIL=1`,
  visitors enter an email before downloading. Leads download from
  `/admin/leads.csv` (user `admin`, password `ADMIN_PASSWORD`). This goes
  against XKey's "no email" promise, so it stays off unless Joe decides
  otherwise.

## Settings (Render > Environment)
| Setting | Default | What it does |
|---|---|---|
| `MAX_CONCURRENT_JOBS` | 3 | Crawls running at once (a compare uses 2). |
| `MAX_JOBS_PER_VISITOR` | 2 | Crawls one visitor can run at once. |
| `JOB_RETENTION_HOURS` | 48 | Finished crawl files are deleted after this. |
| `SECRET_KEY` | random | Signs visitor sessions. Render generates one. |
| `PUBLIC_URL` | | Site address used in email links. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` | | Turn on the email features. Any SMTP service works, e.g. Brevo (free tier) or Mailgun. |
| `SCHEDULE_MAX_PAGES` | 1000 | Page limit for scheduled re-crawls. |
| `REQUIRE_EMAIL` | off | `1` asks for an email before downloads. |
| `ADMIN_PASSWORD` | | Password for `/admin/leads.csv`. |
| `DATA_DIR` | `./data` | Where the SQLite database and scheduled crawls live. Needs a Render persistent disk (paid plans) to survive deploys. |
| `JOBS_DIR` | `./jobs` | Where crawl files live. |

## Run it locally
```
pip install -r requirements.txt
python app.py            # http://127.0.0.1:5000
python seo_crawler.py https://example.com --max-pages 500
python seo_crawler.py https://shop.com/products/ --path /products/ --products-only
python reports.py seo_crawl.csv   # score + issue counts for any crawl CSV
```

## Limits to know
- The crawler waits 2.5 to 5.5 seconds between pages, about 4 seconds per
  page: 1,000 pages take about an hour, 10,000 about 11 hours.
- Render's free plan sleeps after about 15 minutes with no visitors, which
  stops crawls and the re-crawl scheduler. Long crawls and email updates
  need a paid plan (Starter) with a persistent disk.
- Crawl jobs are kept in memory, so a restart or deploy ends running
  crawls. Keep gunicorn at one worker (`-w 1`).
- Follows robots.txt and never leaves the start site. It refuses localhost
  and private network addresses. Only crawl sites you own or have
  permission to crawl.
