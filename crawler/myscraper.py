#!/usr/bin/env python3
"""
myscraper.py - configurable, polite, production-grade list scraper.

What it does
------------
* Walks a paginated listing (?page=X style URLs OR a "Next" link/button).
* Extracts one row per item using CSS selectors you set in CONFIG below.
* Writes every page's rows straight to a CSV as it goes (nothing is lost
  if the run stops early), and stops at exactly MAX_ITEMS rows (default 10,000).
* Rotates real browser User-Agents, shuffles optional headers, sleeps a
  random 2.5-5.5 s between pages, and backs off 30s -> 60s -> 120s ... on
  429 / 503 (honouring the server's Retry-After header when present).
* Checks the site's robots.txt before every page and will not fetch
  disallowed paths. Only scrape sites whose terms of service allow it.
* Uses requests + BeautifulSoup by default; flip USE_PLAYWRIGHT (or pass
  --playwright) for sites that only render their data with JavaScript.

Out of the box it is configured for https://books.toscrape.com/, a site
built for scraping practice, so you can see it work before pointing it at
your own target. To adapt it, edit only the CONFIG block.

Install
-------
    pip install requests beautifulsoup4
    # Only if the site needs JavaScript:
    pip install playwright
    playwright install chromium

Run
---
    python myscraper.py                     # uses CONFIG as-is
    python myscraper.py --max-items 50      # quick test run
    python myscraper.py --playwright        # force the browser engine
    python myscraper.py --help              # all options
"""

import argparse
import csv
import os
import random
import re
import sys
import time
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup

# =============================================================================
# CONFIG - the only section you should need to edit for a new website
# =============================================================================
CONFIG = {
    # First listing page to start from.
    "START_URL": "https://books.toscrape.com/catalogue/page-1.html",

    # CSS selector matching ONE repeated item card / row on a listing page.
    "ITEM_SELECTOR": "article.product_pod",

    # The CSV columns. Each field is looked up INSIDE one item card.
    #   selector : CSS selector inside the item (None = the item itself)
    #   attr     : HTML attribute to read (None = visible text)
    #   absolute : True = turn a relative link into a full URL
    #   regex    : optional pattern; the first match in the extracted text
    #              (or in the whole item's text if selector is None) is kept.
    #              Handy for emails / phone numbers buried in free text.
    # Mapping for the demo site:  Business Name -> book title,
    # Pricing -> price, Contact -> stock text, Direct Page URL -> link.
    "FIELDS": {
        "Name": {"selector": "h3 a", "attr": "title"},
        "Price": {"selector": "p.price_color", "attr": None},
        "Contact / Availability": {"selector": "p.instock.availability", "attr": None},
        "Page URL": {"selector": "h3 a", "attr": "href", "absolute": True},
        # Example for a directory site with contact details in free text:
        # "Email": {"selector": None, "attr": None,
        #           "regex": r"[\w.+-]+@[\w-]+\.[\w.-]+"},
        # "Phone": {"selector": None, "attr": None,
        #           "regex": r"\+?\d[\d\s().-]{7,}\d"},
    },

    # Pagination, tried in this order:
    # 1) a "Next" link: CSS selector of the <a> whose href is the next page.
    "NEXT_PAGE_SELECTOR": "li.next a",
    # 2) a URL pattern with {page}, used when no Next link is found.
    #    e.g. "https://example.com/listings?page={page}". None = disabled.
    "PAGE_URL_PATTERN": None,
    "FIRST_PAGE_NUMBER": 1,

    # Hard row cap: the script stops at exactly this many rows.
    "MAX_ITEMS": 10000,

    # Output file (written iteratively, page by page).
    "OUTPUT_CSV": "scraped_database.csv",

    # Use a real headless browser (Playwright) instead of requests.
    "USE_PLAYWRIGHT": False,
    # Playwright only: CSS selector of a "Next" BUTTON to click when the
    # next page has no URL (infinite-scroll / JS pagers). None = disabled.
    "NEXT_BUTTON_CLICK_SELECTOR": None,

    # Human-like delay between page requests (seconds).
    "MIN_DELAY": 2.5,
    "MAX_DELAY": 5.5,

    # Back-off schedule for 429 / 503 (seconds). One retry per entry.
    "BACKOFF_SCHEDULE": [30, 60, 120, 240],
    # Status codes that trigger back-off and retry.
    "RETRY_STATUSES": {429, 500, 502, 503, 504},

    "REQUEST_TIMEOUT": 30,

    # Value written when an item is missing a field.
    "MISSING_VALUE": "N/A",
}

# Modern desktop User-Agents across Chrome / Firefox / Safari / Edge on
# Windows and macOS. One is picked at random for every page request.
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.6; rv:131.0) Gecko/20100101 Firefox/131.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
]

ACCEPT_LANGUAGES = [
    "en-US,en;q=0.9",
    "en-GB,en;q=0.9,en-US;q=0.8",
    "en-US,en;q=0.8,fr;q=0.5",
    "en-CA,en;q=0.9,en-US;q=0.7",
]


# =============================================================================
# Small helpers
# =============================================================================
def log(msg):
    """Timestamped, flushed terminal output."""
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def build_headers(referer=None):
    """
    Build a fresh header set for one request.

    The User-Agent is rotated every call, and the optional headers
    (Accept-Language, Referer, DNT, ...) are added in a shuffled order so
    consecutive requests don't share an identical header layout.
    """
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    optional = [
        ("Accept-Language", random.choice(ACCEPT_LANGUAGES)),
        ("DNT", "1"),
        ("Upgrade-Insecure-Requests", "1"),
        ("Accept-Encoding", "gzip, deflate"),
    ]
    if referer:
        optional.append(("Referer", referer))
    random.shuffle(optional)
    # Randomly drop DNT now and then; real browsers differ on it.
    for key, value in optional:
        if key == "DNT" and random.random() < 0.3:
            continue
        headers[key] = value
    return headers


def human_sleep(min_delay, max_delay):
    """Sleep a random (jittered) amount of time and return it."""
    pause = random.uniform(min_delay, max_delay)
    time.sleep(pause)
    return pause


def clean_text(value):
    """Collapse whitespace so CSV cells stay on one line."""
    return re.sub(r"\s+", " ", value).strip()


# =============================================================================
# robots.txt
# =============================================================================
class RobotsChecker:
    """Caches one robots.txt per host and answers can_fetch(url)."""

    def __init__(self, timeout):
        self.timeout = timeout
        self.parsers = {}

    def _parser_for(self, url):
        parts = urlparse(url)
        root = f"{parts.scheme}://{parts.netloc}"
        if root in self.parsers:
            return self.parsers[root]
        parser = RobotFileParser()
        try:
            resp = requests.get(
                root + "/robots.txt", headers=build_headers(), timeout=self.timeout
            )
            if resp.status_code == 200:
                parser.parse(resp.text.splitlines())
            elif resp.status_code in (401, 403):
                # Standard convention: an access-denied robots.txt means "keep out".
                parser.disallow_all = True
            else:
                parser.allow_all = True  # no robots.txt -> no restrictions
        except requests.RequestException as exc:
            log(f"Could not read robots.txt ({exc}); assuming allowed.")
            parser.allow_all = True
        self.parsers[root] = parser
        return parser

    def can_fetch(self, url):
        return self._parser_for(url).can_fetch("*", url)

    def crawl_delay(self, url):
        try:
            return self._parser_for(url).crawl_delay("*")
        except Exception:
            return None


# =============================================================================
# Fetchers: requests (fast) and Playwright (JavaScript sites)
# =============================================================================
class RequestsFetcher:
    """Plain HTTP fetcher built on a requests.Session (keeps cookies)."""

    def __init__(self, timeout):
        self.timeout = timeout
        self.session = requests.Session()
        # Start with no default headers; build_headers() supplies them all.
        self.session.headers.clear()

    def fetch(self, url, referer=None):
        """Return (status_code, html_text, retry_after_seconds_or_None)."""
        resp = self.session.get(
            url, headers=build_headers(referer), timeout=self.timeout
        )
        retry_after = resp.headers.get("Retry-After")
        retry_after = int(retry_after) if retry_after and retry_after.isdigit() else None
        return resp.status_code, resp.text, retry_after

    def click_next(self, selector):
        return None  # Buttons can only be clicked in a real browser.

    def close(self):
        self.session.close()


class PlaywrightFetcher:
    """Headless Chromium fetcher for pages that need JavaScript."""

    def __init__(self, timeout, item_selector):
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            sys.exit(
                "Playwright is not installed. Run:\n"
                "    pip install playwright\n    playwright install chromium"
            )
        self.timeout_ms = timeout * 1000
        self.item_selector = item_selector
        self._pw = sync_playwright().start()
        self.browser = self._pw.chromium.launch(headless=True)
        self.context = self.browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={"width": random.choice([1366, 1440, 1536, 1920]), "height": 900},
        )
        self.page = self.context.new_page()

    def _wait_for_items(self):
        try:
            self.page.wait_for_selector(self.item_selector, timeout=self.timeout_ms)
        except Exception:
            pass  # No items found; the caller treats it as an empty page.

    def fetch(self, url, referer=None):
        # Rotate the UA and header order for every navigation as well.
        headers = build_headers(referer)
        self.context.set_extra_http_headers(
            {k: v for k, v in headers.items() if k != "Accept-Encoding"}
        )
        resp = self.page.goto(url, timeout=self.timeout_ms, wait_until="domcontentloaded")
        self._wait_for_items()
        status = resp.status if resp else 200
        retry_after = None
        if resp:
            value = resp.headers.get("retry-after")
            retry_after = int(value) if value and value.isdigit() else None
        return status, self.page.content(), retry_after

    def click_next(self, selector):
        """Click a JS 'Next' button. Returns the new HTML or None if absent."""
        button = self.page.query_selector(selector)
        if not button or not button.is_enabled():
            return None
        button.scroll_into_view_if_needed()
        button.click()
        self.page.wait_for_load_state("networkidle", timeout=self.timeout_ms)
        self._wait_for_items()
        return self.page.content()

    @property
    def current_url(self):
        return self.page.url

    def close(self):
        try:
            self.browser.close()
        finally:
            self._pw.stop()


def fetch_with_backoff(fetcher, url, referer, cfg):
    """
    Fetch a page, retrying on rate limits, server errors and network
    failures with exponential back-off. Returns HTML, or None if the page
    still fails after every retry (the caller then stops cleanly).
    """
    schedule = list(cfg["BACKOFF_SCHEDULE"])
    attempt = 0
    while True:
        try:
            status, html, retry_after = fetcher.fetch(url, referer)
            if status == 200:
                return html
            if status in cfg["RETRY_STATUSES"] or status == 403:
                reason = f"HTTP {status}"
            else:
                log(f"HTTP {status} for {url}; not retryable, skipping.")
                return None
        except Exception as exc:  # timeouts, DNS, connection resets, browser errors
            reason = f"{type(exc).__name__}: {exc}"
            retry_after = None

        if attempt >= len(schedule):
            log(f"Giving up on {url} after {attempt} retries ({reason}).")
            return None
        wait = max(schedule[attempt], retry_after or 0) + random.uniform(0, 5)
        attempt += 1
        log(f"{reason}. Backing off {wait:.0f}s (retry {attempt}/{len(schedule)})...")
        time.sleep(wait)


# =============================================================================
# Parsing
# =============================================================================
def extract_field(item, spec, page_url, missing):
    """
    Pull one field out of one item. Any missing element / attribute /
    regex match is caught and becomes the MISSING_VALUE ("N/A").
    """
    try:
        node = item.select_one(spec["selector"]) if spec.get("selector") else item
        if spec.get("attr"):
            value = node.get(spec["attr"])  # AttributeError if node is None
            if value is None:
                return missing
            if isinstance(value, list):  # e.g. class="a b"
                value = " ".join(value)
        else:
            value = node.get_text(" ", strip=True)

        if spec.get("absolute"):
            value = urljoin(page_url, value)
        if spec.get("regex"):
            match = re.search(spec["regex"], value)
            value = match.group(0) if match else ""

        value = clean_text(value)
        return value if value else missing
    except (AttributeError, TypeError, KeyError, IndexError):
        return missing


def parse_items(html, page_url, cfg):
    """Return a list of row dicts for every item on one listing page."""
    soup = BeautifulSoup(html, "html.parser")
    rows = []
    for item in soup.select(cfg["ITEM_SELECTOR"]):
        try:
            rows.append(
                {
                    name: extract_field(item, spec, page_url, cfg["MISSING_VALUE"])
                    for name, spec in cfg["FIELDS"].items()
                }
            )
        except Exception as exc:  # never let one odd card kill the page
            log(f"Skipped a malformed item: {exc}")
    return soup, rows


def find_next_url(soup, page_url, page_number, cfg):
    """Work out the next page URL from a Next link or the ?page=X pattern."""
    try:
        if cfg["NEXT_PAGE_SELECTOR"]:
            link = soup.select_one(cfg["NEXT_PAGE_SELECTOR"])
            if link and link.get("href"):
                return urljoin(page_url, link["href"])
    except Exception:
        pass
    if cfg["PAGE_URL_PATTERN"]:
        return cfg["PAGE_URL_PATTERN"].format(page=page_number + 1)
    return None


# =============================================================================
# CSV output
# =============================================================================
class CsvWriter:
    """Appends rows to the CSV and flushes after every page."""

    def __init__(self, path, fieldnames):
        self.path = path
        # utf-8-sig so Excel opens accented characters correctly.
        self.handle = open(path, "w", newline="", encoding="utf-8-sig")
        self.writer = csv.DictWriter(self.handle, fieldnames=fieldnames)
        self.writer.writeheader()
        self.handle.flush()

    def write_rows(self, rows):
        self.writer.writerows(rows)
        self.handle.flush()
        os.fsync(self.handle.fileno())

    def close(self):
        self.handle.close()


# =============================================================================
# Main loop
# =============================================================================
def scrape(cfg):
    max_items = cfg["MAX_ITEMS"]
    robots = RobotsChecker(cfg["REQUEST_TIMEOUT"])

    if cfg["USE_PLAYWRIGHT"]:
        log("Engine: Playwright (headless Chromium)")
        fetcher = PlaywrightFetcher(cfg["REQUEST_TIMEOUT"], cfg["ITEM_SELECTOR"])
    else:
        log("Engine: requests + BeautifulSoup")
        fetcher = RequestsFetcher(cfg["REQUEST_TIMEOUT"])

    # Respect a robots.txt Crawl-delay if it asks for more than our minimum.
    min_delay, max_delay = cfg["MIN_DELAY"], cfg["MAX_DELAY"]
    crawl_delay = robots.crawl_delay(cfg["START_URL"])
    if crawl_delay and crawl_delay > min_delay:
        log(f"robots.txt asks for Crawl-delay {crawl_delay}s; adjusting delays.")
        min_delay, max_delay = crawl_delay, crawl_delay + (max_delay - min_delay)

    writer = CsvWriter(cfg["OUTPUT_CSV"], list(cfg["FIELDS"].keys()))
    total, page_number = 0, cfg["FIRST_PAGE_NUMBER"]
    url, referer, html = cfg["START_URL"], None, None
    seen_urls, seen_rows = set(), set()

    log(f"Starting at {url} (target: {max_items} rows -> {cfg['OUTPUT_CSV']})")
    try:
        while total < max_items and (url or html):
            # ---- 1. Get the page HTML (by URL, or already loaded by a click)
            if url:
                if url in seen_urls:
                    log("Pagination looped back to a page already scraped; stopping.")
                    break
                if not robots.can_fetch(url):
                    log(f"robots.txt disallows {url}; stopping.")
                    break
                seen_urls.add(url)
                html = fetch_with_backoff(fetcher, url, referer, cfg)
                if html is None:
                    log("Could not load the page; stopping. Data so far is saved.")
                    break
                page_url = url
            else:
                page_url = getattr(fetcher, "current_url", referer)

            # ---- 2. Parse items and enforce the exact row cap
            soup, rows = parse_items(html, page_url, cfg)
            if not rows:
                log(f"Page {page_number} had no items matching "
                    f"'{cfg['ITEM_SELECTOR']}'; assuming the end was reached.")
                break
            fresh = []
            for row in rows:
                key = tuple(row.values())
                if key not in seen_rows:  # skip duplicates across pages
                    seen_rows.add(key)
                    fresh.append(row)
            fresh = fresh[: max_items - total]
            writer.write_rows(fresh)
            total += len(fresh)

            if total >= max_items:
                log(f"Page {page_number} scraped successfully. "
                    f"Total items: {total}/{max_items}. Target reached.")
                break

            # ---- 3. Find the next page (link, URL pattern, or button click)
            next_url = find_next_url(soup, page_url, page_number, cfg)
            html = None
            if not next_url and cfg["USE_PLAYWRIGHT"] and cfg["NEXT_BUTTON_CLICK_SELECTOR"]:
                pause = human_sleep(min_delay, max_delay)
                log(f"Page {page_number} scraped successfully. Total items: "
                    f"{total}/{max_items}. Slept {pause:.1f}s, clicking Next...")
                try:
                    html = fetcher.click_next(cfg["NEXT_BUTTON_CLICK_SELECTOR"])
                except Exception as exc:
                    log(f"Clicking Next failed: {exc}")
                if html is None:
                    log("No more Next button; finished.")
                    break
                referer, url = page_url, None
                page_number += 1
                continue
            if not next_url:
                log(f"Page {page_number} scraped successfully. "
                    f"Total items: {total}/{max_items}. No next page; finished.")
                break

            pause = random.uniform(min_delay, max_delay)
            log(f"Page {page_number} scraped successfully. Total items: "
                f"{total}/{max_items}. Sleeping for {pause:.1f} seconds...")
            time.sleep(pause)
            referer, url = page_url, next_url
            page_number += 1

    except KeyboardInterrupt:
        log("Interrupted by you (Ctrl+C). Data so far is saved.")
    finally:
        writer.close()
        fetcher.close()

    log(f"Done. {total} rows written to {os.path.abspath(cfg['OUTPUT_CSV'])}")
    return total


def parse_args():
    p = argparse.ArgumentParser(description="Configurable polite list scraper.")
    p.add_argument("--url", help="override START_URL")
    p.add_argument("--max-items", type=int, help="override MAX_ITEMS (default 10000)")
    p.add_argument("--output", help="override OUTPUT_CSV")
    p.add_argument("--playwright", action="store_true", help="use headless Chromium")
    p.add_argument("--min-delay", type=float, help="override MIN_DELAY seconds")
    p.add_argument("--max-delay", type=float, help="override MAX_DELAY seconds")
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    cfg = dict(CONFIG)
    if args.url:
        cfg["START_URL"] = args.url
    if args.max_items:
        cfg["MAX_ITEMS"] = args.max_items
    if args.output:
        cfg["OUTPUT_CSV"] = args.output
    if args.playwright:
        cfg["USE_PLAYWRIGHT"] = True
    if args.min_delay is not None:
        cfg["MIN_DELAY"] = args.min_delay
    if args.max_delay is not None:
        cfg["MAX_DELAY"] = max(args.max_delay, cfg["MIN_DELAY"])
    scrape(cfg)
