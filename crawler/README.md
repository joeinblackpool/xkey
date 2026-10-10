# SEO crawler app

Three files, one folder:

| File | What it is |
|---|---|
| `app.py` | The web app: a form where a visitor enters a URL and page limit, a live progress page, and a CSV download. |
| `seo_crawler.py` | Crawls **any** website (no setup per site) and writes one SEO row per page. Also runs from the command line. |
| `myscraper.py` | The original selector-based scraper, for pulling specific fields (name, price, ...) from one known site. Default cap is now 10,000 rows. |

## Columns in the crawl CSV
URL, Status, Title, Title Length, Meta Description, Meta Description Length,
H1, H1 Count, Canonical, Meta Robots, Word Count, Internal Links,
External Links, Images Missing Alt, Emails, Phones, Response Time (ms).
Product Name, Price, Currency, SKU, Brand, Availability, Product Image
(on product pages; read from schema.org or Open Graph markup, which most
shop platforms publish). Missing values are written as `N/A`.

## Pulling a product directory
In the web form, enter the shop's address, put its product folder (for
example `/products/`) in "Only this section of the site", and tick "Only
save product pages". The CSV then has one row per product. If a shop's
product pages live outside its listing folder, leave the section empty
and just tick "Only save product pages".

Command line:
```
python seo_crawler.py https://shop.com/products/ --path /products/ --products-only
```

## Run it on your computer
```
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000 in your browser.

Command line, without the web page:
```
python seo_crawler.py https://example.com --max-pages 500
```

## Put it on your website
This is a Python app, so it needs a host that runs Python (for example
Render, Railway, Fly.io, or any small VPS). Static hosts such as Cloudflare
Pages or Netlify cannot run it by themselves.

Start command on the host:
```
gunicorn -w 1 --threads 8 -b 0.0.0.0:$PORT app:app
```
Keep `-w 1`: crawl jobs are tracked in memory, so they must all live in one
process. Then link to it from your SEO site, for example as
`tools.yoursite.com`, or embed it in a page with an `<iframe>`.

Environment variables you can set on the host:
- `MAX_CONCURRENT_JOBS` (default 3): how many crawls can run at once.
- `JOB_RETENTION_HOURS` (default 48): finished CSVs are deleted after this.
- `JOBS_DIR` (default `./jobs`): where CSVs are stored.

## How long a crawl takes
The crawler waits 2.5 to 5.5 seconds between pages so it does not hammer
the target site. That averages about 4 seconds per page, so 1,000 pages
take roughly an hour and 10,000 pages roughly 11 hours. Visitors can
bookmark the progress page and download partial results at any time.

## Built-in safety
- Follows robots.txt, including Crawl-delay, and never leaves the start domain.
- Backs off 30s, 60s, 120s, 240s on 429/503 errors.
- Refuses localhost and private network addresses, so visitors can't use
  your server to reach your own internal systems.
- Limits how many crawls run at once.

Only crawl sites you own or have permission to crawl, and check each
site's terms of service.
