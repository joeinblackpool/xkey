#!/usr/bin/env python3
"""
seo_crawler.py - crawl ANY website and export an SEO audit row per page.

Unlike myscraper.py (which needs CSS selectors for one specific site),
this crawler needs only a start URL. It follows the site's own internal
links (plus its sitemap.xml) and records, for every page:

    URL, status code, title, meta description, H1, canonical, meta robots,
    word count, internal/external link counts, images missing alt text,
    emails and phone numbers found on the page, and response time,
    plus product name, price, currency, SKU, brand, stock and image on
    product pages (read from schema.org / Open Graph markup).

Product directories: pass path_prefix="/products/" (--path) to stay
inside one folder, and products_only=True (--products-only) to save only
pages that carry product data.

It stays on the start URL's domain, respects robots.txt (including
Crawl-delay), waits a random 2.5-5.5 s between pages, backs off on
429/503, writes the CSV as it goes, and stops at max_pages (default 10,000).

Used two ways:
  * Command line:  python seo_crawler.py https://example.com --max-pages 500
                   python seo_crawler.py https://shop.com/products/ --path /products/ --products-only
  * From the web app (app.py), which calls crawl() in a background thread.

Install:  pip install requests beautifulsoup4
"""

import argparse
import csv
import json
import os
import random
import re
import threading
import time
import warnings
from collections import deque
from urllib.parse import urldefrag, urljoin, urlparse

import requests
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning

from myscraper import RobotsChecker, build_headers

# Sitemaps are XML; the built-in HTML parser reads them fine, so hide the hint.
warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

DEFAULT_MAX_PAGES = 10000
HARD_MAX_PAGES = 10000  # the web app never allows more than this

COLUMNS = [
    "URL", "Status", "Title", "Title Length", "Meta Description",
    "Meta Description Length", "H1", "H1 Count", "Canonical", "Meta Robots",
    "Word Count", "Internal Links", "External Links", "Images Missing Alt",
    "Emails", "Phones", "Response Time (ms)", "Found On",
    # Product data, read from schema.org markup (JSON-LD / microdata) or
    # Open Graph product tags. N/A on pages that aren't product pages.
    "Product Name", "Price", "Currency", "SKU", "Brand", "Availability",
    "Product Image",
]
PRODUCT_COLUMNS = ["Product Name", "Price", "Currency", "SKU", "Brand",
                   "Availability", "Product Image"]

# Links to files we never want to download as "pages".
SKIP_EXTENSIONS = re.compile(
    r"\.(jpe?g|png|gif|webp|svg|ico|bmp|tiff?|pdf|zip|rar|7z|gz|tar|mp3|mp4|"
    r"avi|mov|wmv|webm|ogg|wav|docx?|xlsx?|pptx?|csv|exe|dmg|apk|css|js|json|"
    r"xml|txt|woff2?|ttf|eot)$",
    re.I,
)
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{2,4}[\s.-]\d{3,4}[\s.-]?\d{3,4}")
RETRY_STATUSES = {429, 500, 502, 503, 504}
BACKOFF_SCHEDULE = [30, 60, 120, 240]
MISSING = "N/A"


def _host(url):
    host = urlparse(url).netloc.lower()
    return host[4:] if host.startswith("www.") else host


def normalize_url(url, base=None):
    """Absolute http(s) URL without #fragment, or None if not crawlable."""
    try:
        url = urljoin(base, url) if base else url
        url, _ = urldefrag(url)
        parts = urlparse(url)
        if parts.scheme not in ("http", "https") or not parts.netloc:
            return None
        if SKIP_EXTENSIONS.search(parts.path):
            return None
        if not parts.path:
            url = parts._replace(path="/").geturl()
        return url
    except Exception:
        return None


def _first(value):
    """JSON-LD values may be a list, a dict or a plain value; return a string."""
    if isinstance(value, list):
        value = value[0] if value else None
    if isinstance(value, dict):
        value = value.get("name") or value.get("url") or value.get("@id")
    return str(value).strip() if value not in (None, "") else None


def _walk_jsonld(node):
    """Yield every dict inside a JSON-LD blob (handles @graph and nesting)."""
    if isinstance(node, list):
        for item in node:
            yield from _walk_jsonld(item)
    elif isinstance(node, dict):
        yield node
        for value in node.values():
            if isinstance(value, (list, dict)):
                yield from _walk_jsonld(value)


def extract_product(soup):
    """
    Return a dict of product fields found on the page (empty if none).
    Tries, in order: JSON-LD schema.org Product, microdata itemprop tags,
    then Open Graph / product: meta tags. Most shops (Shopify, WooCommerce,
    Magento, BigCommerce, Wix ...) publish at least one of these.
    """
    found = {}

    # 1) JSON-LD <script type="application/ld+json">
    for script in soup.find_all("script", type=re.compile("ld\\+json", re.I)):
        try:
            data = json.loads(script.string or script.get_text() or "")
        except (ValueError, TypeError):
            continue
        for obj in _walk_jsonld(data):
            types = obj.get("@type")
            types = types if isinstance(types, list) else [types]
            if not any(str(t).lower() in ("product", "productgroup") for t in types):
                continue
            offers = obj.get("offers") or {}
            if isinstance(offers, list):
                offers = offers[0] if offers else {}
            if isinstance(offers, dict) and offers.get("@type") == "AggregateOffer":
                offers = dict(offers, price=offers.get("price") or offers.get("lowPrice"))
            offers = offers if isinstance(offers, dict) else {}
            avail = _first(offers.get("availability"))
            found = {
                "Product Name": _first(obj.get("name")),
                "Price": _first(offers.get("price")),
                "Currency": _first(offers.get("priceCurrency")),
                "SKU": _first(obj.get("sku") or obj.get("mpn") or obj.get("gtin13")),
                "Brand": _first(obj.get("brand")),
                "Availability": avail.rsplit("/", 1)[-1] if avail else None,
                "Product Image": _first(obj.get("image")),
            }
            break
        if found:
            break

    # 2) Microdata: itemtype=".../Product" with itemprop children
    if not found:
        scope = soup.find(attrs={"itemtype": re.compile(r"schema\.org/Product$", re.I)})
        if scope:
            def prop(name):
                tag = scope.find(attrs={"itemprop": name})
                if not tag:
                    return None
                value = (tag.get("content") or tag.get("href") or tag.get("src")
                         or tag.get_text(" ", strip=True))
                return value.strip() if value else None
            avail = prop("availability")
            found = {
                "Product Name": prop("name"), "Price": prop("price"),
                "Currency": prop("priceCurrency"), "SKU": prop("sku"),
                "Brand": prop("brand"),
                "Availability": avail.rsplit("/", 1)[-1] if avail else None,
                "Product Image": prop("image"),
            }

    # 3) Open Graph / product: meta tags fill any gaps
    def og(*names):
        for name in names:
            tag = soup.find("meta", attrs={"property": name}) or soup.find("meta", attrs={"name": name})
            if tag and tag.get("content"):
                return tag["content"].strip()
        return None
    og_price = og("product:price:amount", "og:price:amount")
    if found or og_price or (og("og:type") or "").lower() == "product":
        found.setdefault("Product Name", None)
        fallbacks = {
            "Product Name": og("og:title"),
            "Price": og_price,
            "Currency": og("product:price:currency", "og:price:currency"),
            "Availability": og("product:availability", "og:availability"),
            "Product Image": og("og:image"),
            "Brand": og("product:brand"),
        }
        for key, value in fallbacks.items():
            if not found.get(key) and value:
                found[key] = value
    return {k: re.sub(r"\s+", " ", v) for k, v in found.items() if v}


class Crawler:
    """One crawl job. Thread-safe progress fields are read by the web app."""

    def __init__(self, start_url, output_csv, max_pages=DEFAULT_MAX_PAGES,
                 min_delay=2.5, max_delay=5.5, backoff_schedule=None,
                 timeout=30, log_fn=None, path_prefix=None, products_only=False):
        self.start_url = normalize_url(start_url) or start_url
        # Only follow/save URLs whose path starts with this, e.g. "/products/".
        prefix = (path_prefix or "").strip()
        if prefix and not prefix.startswith("/"):
            prefix = "/" + prefix
        self.path_prefix = prefix if prefix not in ("", "/") else None
        # Save a row only when the page has product data.
        self.products_only = bool(products_only)
        self.pages_fetched = 0
        self.output_csv = output_csv
        self.max_pages = max(1, min(int(max_pages), HARD_MAX_PAGES))
        self.min_delay, self.max_delay = min_delay, max(max_delay, min_delay)
        self.backoff = backoff_schedule if backoff_schedule is not None else BACKOFF_SCHEDULE
        self.timeout = timeout
        self.site = _host(self.start_url)
        self.robots = RobotsChecker(timeout)
        self.session = requests.Session()
        self.session.headers.clear()
        self.stop_event = threading.Event()

        # Progress (read by the web app while the crawl runs).
        self.pages_done = 0
        self.queued = 0
        self.state = "pending"  # pending -> running -> finished/stopped/failed
        self.message = ""
        self.recent_log = deque(maxlen=50)
        self._log_fn = log_fn

    # ---------------------------------------------------------------- logging
    def log(self, msg):
        line = f"[{time.strftime('%H:%M:%S')}] {msg}"
        self.recent_log.append(line)
        if self._log_fn:
            self._log_fn(line)

    def stop(self):
        self.stop_event.set()

    def _sleep(self, seconds):
        """Interruptible sleep; returns False if a stop was requested."""
        return not self.stop_event.wait(seconds)

    # ------------------------------------------------------------- fetching
    def fetch(self, url, referer=None):
        """
        GET a URL with UA/header rotation and back-off on 429/5xx and network
        errors. Returns (response or None, elapsed_ms).
        """
        attempt = 0
        while not self.stop_event.is_set():
            started = time.time()
            retry_after = None
            try:
                resp = self.session.get(url, headers=build_headers(referer),
                                        timeout=self.timeout, allow_redirects=True)
                elapsed = int((time.time() - started) * 1000)
                if resp.status_code not in RETRY_STATUSES:
                    return resp, elapsed
                reason = f"HTTP {resp.status_code}"
                value = resp.headers.get("Retry-After", "")
                retry_after = int(value) if value.isdigit() else None
            except requests.RequestException as exc:
                reason = type(exc).__name__
            if attempt >= len(self.backoff):
                self.log(f"Giving up on {url} after {attempt} retries ({reason}).")
                return None, 0
            wait = max(self.backoff[attempt], retry_after or 0) + random.uniform(0, 5)
            attempt += 1
            self.log(f"{reason} on {url}. Backing off {wait:.0f}s "
                     f"(retry {attempt}/{len(self.backoff)})...")
            if not self._sleep(wait):
                break
        return None, 0

    def sitemap_urls(self, limit):
        """Collect page URLs from robots.txt Sitemap: lines and /sitemap.xml."""
        root = f"{urlparse(self.start_url).scheme}://{urlparse(self.start_url).netloc}"
        sitemaps = []
        try:
            parser = self.robots._parser_for(self.start_url)
            sitemaps = list(parser.site_maps() or [])
        except Exception:
            pass
        if not sitemaps:
            sitemaps = [root + "/sitemap.xml"]
        found, seen_maps = [], set()
        while sitemaps and len(found) < limit and len(seen_maps) < 50:
            sm = sitemaps.pop(0)
            if sm in seen_maps:
                continue
            seen_maps.add(sm)
            try:
                resp = self.session.get(sm, headers=build_headers(), timeout=self.timeout)
                if resp.status_code != 200:
                    continue
                soup = BeautifulSoup(resp.content, "html.parser")
                if soup.find("sitemapindex"):
                    sitemaps += [loc.get_text(strip=True) for loc in soup.select("sitemap > loc")]
                else:
                    found += [loc.get_text(strip=True) for loc in soup.select("url > loc")]
            except Exception:
                continue
        return found[:limit]

    # -------------------------------------------------------------- parsing
    def analyse(self, url, resp, elapsed_ms):
        """Build one CSV row and return (row, list_of_internal_links)."""
        row = dict.fromkeys(COLUMNS, MISSING)
        row["URL"], row["Status"], row["Response Time (ms)"] = url, resp.status_code, elapsed_ms
        ctype = resp.headers.get("Content-Type", "")
        if "html" not in ctype.lower():
            return row, []
        try:
            soup = BeautifulSoup(resp.text, "html.parser")
        except Exception:
            return row, []

        def text_of(node):
            try:
                return re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip() or MISSING
            except AttributeError:
                return MISSING

        def meta(name):
            try:
                tag = soup.find("meta", attrs={"name": re.compile(f"^{name}$", re.I)})
                return re.sub(r"\s+", " ", tag["content"]).strip() or MISSING
            except (AttributeError, KeyError, TypeError):
                return MISSING

        row["Title"] = text_of(soup.title)
        row["Title Length"] = 0 if row["Title"] == MISSING else len(row["Title"])
        row["Meta Description"] = meta("description")
        row["Meta Description Length"] = (0 if row["Meta Description"] == MISSING
                                          else len(row["Meta Description"]))
        h1s = soup.find_all("h1")
        row["H1"], row["H1 Count"] = (text_of(h1s[0]) if h1s else MISSING), len(h1s)
        try:
            row["Canonical"] = soup.find("link", rel="canonical")["href"]
        except (TypeError, KeyError):
            pass
        row["Meta Robots"] = meta("robots")
        row["Images Missing Alt"] = sum(1 for img in soup.find_all("img")
                                        if not (img.get("alt") or "").strip())

        # Contact details: mailto/tel links first, then plain text.
        body_text = soup.get_text(" ", strip=True)
        emails = {a["href"][7:].split("?")[0] for a in soup.select('a[href^="mailto:"]')}
        emails |= set(EMAIL_RE.findall(body_text))
        emails = {e for e in emails if not re.search(r"\.(png|jpe?g|gif|webp|svg)$", e, re.I)}
        phones = {a["href"][4:].strip() for a in soup.select('a[href^="tel:"]')}
        phones |= {p.strip() for p in PHONE_RE.findall(body_text)
                   if 7 <= len(re.sub(r"\D", "", p)) <= 15}
        row["Emails"] = "; ".join(sorted(emails)[:10]) or MISSING
        row["Phones"] = "; ".join(sorted(phones)[:10]) or MISSING

        try:
            row.update(extract_product(soup))  # before <script> tags are removed
            if row["Product Image"] != MISSING:
                row["Product Image"] = urljoin(url, row["Product Image"])
        except Exception:
            pass  # product fields stay N/A
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        row["Word Count"] = len(soup.get_text(" ", strip=True).split())

        internal, external = [], 0
        for a in soup.find_all("a", href=True):
            link = normalize_url(a["href"], url)
            if not link:
                continue
            if _host(link) == self.site:
                internal.append(link)
            else:
                external += 1
        row["Internal Links"], row["External Links"] = len(internal), external
        if "nofollow" in str(row["Meta Robots"]).lower():
            internal = []  # the page asks crawlers not to follow its links
        return row, internal

    def in_scope(self, url):
        """Same site, and inside the chosen folder if one was set."""
        if _host(url) != self.site:
            return False
        return not self.path_prefix or urlparse(url).path.startswith(self.path_prefix)

    # ----------------------------------------------------------------- main
    def run(self):
        self.state = "running"
        handle = None
        try:
            delay = self.robots.crawl_delay(self.start_url)
            if delay and delay > self.min_delay:
                self.log(f"robots.txt asks for Crawl-delay {delay}s; adjusting delays.")
                self.max_delay = delay + (self.max_delay - self.min_delay)
                self.min_delay = delay

            queue, seen = deque([self.start_url]), {self.start_url}
            for link in self.sitemap_urls(self.max_pages):
                link = normalize_url(link)
                if link and self.in_scope(link) and link not in seen:
                    seen.add(link)
                    queue.append(link)
            scope = f" inside {self.path_prefix}" if self.path_prefix else ""
            what = "product rows" if self.products_only else "pages"
            self.log(f"Crawling {self.start_url}{scope} (limit {self.max_pages} {what}, "
                     f"{len(queue)} URLs queued incl. sitemap).")
            # Safety net when only product pages are saved: don't fetch forever.
            fetch_limit = self.max_pages * 3 if self.products_only else self.max_pages

            handle = open(self.output_csv, "w", newline="", encoding="utf-8-sig")
            writer = csv.DictWriter(handle, fieldnames=COLUMNS)
            writer.writeheader()
            referers = {}

            while (queue and self.pages_done < self.max_pages
                   and self.pages_fetched < fetch_limit and not self.stop_event.is_set()):
                url = queue.popleft()
                self.queued = len(queue)
                if not self.robots.can_fetch(url):
                    self.log(f"Skipping (robots.txt disallows): {url}")
                    continue
                resp, elapsed = self.fetch(url, referers.get(url))
                if resp is None:
                    continue
                final_url = normalize_url(resp.url) or url
                if _host(final_url) != self.site:
                    self.log(f"Skipping {url}: redirects off-site.")
                    continue
                self.pages_fetched += 1

                try:
                    row, links = self.analyse(final_url, resp, elapsed)
                except Exception as exc:  # never let one odd page kill the crawl
                    self.log(f"Could not analyse {url}: {exc}")
                    row, links = dict.fromkeys(COLUMNS, MISSING), []
                    row["URL"], row["Status"] = final_url, resp.status_code
                # The page that linked here (N/A for the start page and sitemap URLs).
                row["Found On"] = referers.get(url) or MISSING
                is_product = row.get("Product Name", MISSING) != MISSING or row.get("Price", MISSING) != MISSING
                if is_product or not self.products_only:
                    writer.writerow(row)
                    handle.flush()
                    self.pages_done += 1

                for link in links:
                    if link not in seen and self.in_scope(link) and len(seen) < fetch_limit * 5:
                        seen.add(link)
                        referers[link] = final_url
                        queue.append(link)
                self.queued = len(queue)

                status = (f"Page {self.pages_fetched} crawled ({resp.status_code})"
                          f"{', product found' if is_product else ''}. Saved: "
                          f"{self.pages_done}/{self.max_pages}.")
                if self.pages_done >= self.max_pages or not queue or self.pages_fetched >= fetch_limit:
                    self.log(status)
                    break
                pause = random.uniform(self.min_delay, self.max_delay)
                self.log(f"{status} Queue: {len(queue)}. Sleeping for {pause:.1f} seconds...")
                if not self._sleep(pause):
                    break

            if self.stop_event.is_set():
                self.state, self.message = "stopped", "Stopped by user."
            else:
                self.state = "finished"
                if self.pages_fetched == 0:
                    self.state = "failed"
                    self.message = "Could not load any pages (site unreachable or blocked)."
                elif self.pages_done == 0:
                    self.message = "Finished, but no matching pages were found."
                elif self.pages_done >= self.max_pages:
                    self.message = "Reached the page limit."
                else:
                    self.message = "No more pages to crawl."
        except Exception as exc:
            self.state, self.message = "failed", f"{type(exc).__name__}: {exc}"
        finally:
            if handle:
                handle.close()
            self.session.close()
            self.log(f"{self.message} {self.pages_done} pages written to {self.output_csv}")
        return self.pages_done


def crawl(start_url, output_csv="seo_crawl.csv", **kwargs):
    """Convenience wrapper: run a crawl to completion and return page count."""
    return Crawler(start_url, output_csv, **kwargs).run()


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Crawl any site and export an SEO audit CSV.")
    ap.add_argument("url", help="start URL, e.g. https://example.com")
    ap.add_argument("--max-pages", type=int, default=DEFAULT_MAX_PAGES)
    ap.add_argument("--output", default="seo_crawl.csv")
    ap.add_argument("--min-delay", type=float, default=2.5)
    ap.add_argument("--max-delay", type=float, default=5.5)
    ap.add_argument("--path", help="only crawl URLs under this folder, e.g. /products/")
    ap.add_argument("--products-only", action="store_true",
                    help="only save pages that have product data")
    a = ap.parse_args()
    c = Crawler(a.url, a.output, a.max_pages, a.min_delay, a.max_delay,
                log_fn=lambda line: print(line, flush=True),
                path_prefix=a.path, products_only=a.products_only)
    try:
        c.run()
    except KeyboardInterrupt:
        c.stop()
    print(f"Saved to {os.path.abspath(a.output)}")
