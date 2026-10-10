"""
Offline tests for the website crawler.  Run:  cd crawler && python test_crawler.py
Each test starts a tiny fake website on localhost and drives the real crawler and web app:
  - a shop shaped like a big merchant (sitemap index with the blog first, products second,
    a redirect-loop page, Product JSON-LD on product pages)
  - a site whose bot protection answers HTTP 202 with an empty page
  - a 20,000-product sitemap for the fast product list
"""
import csv
import os
import sys
import tempfile
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
TMP = tempfile.mkdtemp(prefix="crawler-test-")
os.environ.update(ALLOW_PRIVATE_HOSTS="1", CRAWLER_FAST_TEST="1",
                  JOBS_DIR=os.path.join(TMP, "jobs"), DATA_DIR=os.path.join(TMP, "data"))
sys.path.insert(0, HERE)
os.chdir(HERE)

import seo_crawler as sc  # noqa: E402
import reports  # noqa: E402


def serve(handler_cls):
    srv = ThreadingHTTPServer(("127.0.0.1", 0), handler_cls)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"


def shop_handler(n_products=5, big=False):
    import json

    class H(BaseHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def send(self, code, body, ct="text/html", extra=None):
            b = body.encode()
            self.send_response(code)
            self.send_header("Content-Type", ct)
            self.send_header("Content-Length", str(len(b)))
            for k, v in (extra or {}).items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(b)

        def do_GET(self):
            base = f"http://{self.headers['Host']}"
            p = self.path
            if p == "/robots.txt":
                return self.send(200, f"User-agent: *\nDisallow: /p/blocked-product/p/999\nSitemap: {base}/sitemap.xml\n", "text/plain")
            if p == "/sitemap.xml":
                return self.send(200, f"<sitemapindex><sitemap><loc>{base}/sitemap_blog.xml</loc></sitemap>"
                                      f"<sitemap><loc>{base}/sitemap_products.xml</loc></sitemap></sitemapindex>", "application/xml")
            if p == "/sitemap_blog.xml":
                return self.send(200, "<urlset>" + "".join(f"<url><loc>{base}/blog/{i}</loc></url>" for i in range(20))
                                 + f"<url><loc>{base}/blog/loop</loc></url></urlset>", "application/xml")
            if p == "/sitemap_products.xml":
                return self.send(200, "<urlset>" + "".join(f"<url><loc>{base}/p/brass-valve-{i}-15mm/p/{1000 + i}</loc></url>" for i in range(n_products))
                                 + f"<url><loc>{base}/p/blocked-product/p/999</loc></url></urlset>", "application/xml")
            if p == "/blog/loop":
                return self.send(302, "", extra={"Location": "/blog/loop"})
            if p.startswith("/p/"):
                code = p.rsplit("/", 1)[-1]
                ld = {"@context": "https://schema.org", "@type": "Product", "name": f"Brass valve {code}", "sku": code,
                      "offers": {"@type": "Offer", "price": "9.99", "priceCurrency": "GBP"}}
                return self.send(200, f'<html><head><title>Valve {code}</title><script type="application/ld+json">{json.dumps(ld)}</script></head><body><h1>Valve</h1></body></html>')
            return self.send(200, f"<html><head><title>Page {p}</title></head><body><h1>{p}</h1><a href='/blog/loop'>loop</a></body></html>")
    return H


class Blocked(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        self.send_response(202)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", "0")
        self.end_headers()


def rows_of(path):
    with open(path, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


class CrawlerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.shop, cls.shop_url = serve(shop_handler())
        cls.blocked, cls.blocked_url = serve(Blocked)
        cls.big, cls.big_url = serve(shop_handler(20000))

    def crawl(self, url, **kw):
        out = os.path.join(TMP, f"c{time.time_ns()}.csv")
        c = sc.Crawler(url + "/", out, min_delay=0, max_delay=0, backoff_schedule=[1, 1], **kw)
        t = time.time()
        c.run()
        return c, rows_of(out), time.time() - t

    def test_products_first_and_saved(self):
        c, rows, _ = self.crawl(self.shop_url, max_pages=5, products_only=True)
        self.assertEqual(c.state, "finished")
        self.assertEqual(len(rows), 5)
        self.assertTrue(all(r["Price"] == "9.99" and r["Currency"] == "GBP" for r in rows))
        self.assertLessEqual(c.pages_fetched, 7, "product sitemap should be crawled before the blog")

    def test_redirect_loop_skipped_fast_and_reported(self):
        c, rows, secs = self.crawl(self.shop_url, max_pages=40)
        loops = [r for r in rows if r["Status"] == "Redirect loop"]
        self.assertEqual(len(loops), 1)
        self.assertLess(secs, 10, "a redirect loop must not trigger long back-offs")
        self.assertIn("Redirect loop", [i["Issue"] for i in reports.find_issues(rows)])

    def test_blocked_site_is_explained_not_scored(self):
        c, rows, _ = self.crawl(self.blocked_url, max_pages=10)
        self.assertEqual(c.state, "failed")
        self.assertIn("blocked the crawler", c.message)
        self.assertEqual(reports.summarise(rows)["Score"], reports.MISSING)
        self.assertIn("Blocked by the site", [i["Issue"] for i in reports.find_issues(rows)])

    def test_fast_product_list(self):
        c, rows, secs = self.crawl(self.big_url, products_only=True, sitemap_list=True)
        self.assertEqual(c.state, "finished")
        self.assertEqual(len(rows), 20000, "robots-disallowed product must be left out")
        self.assertEqual(rows[0]["Product Name"], "Brass Valve 0 15MM")
        self.assertEqual(rows[0]["SKU"], "1000")
        self.assertLess(secs, 30)

    def test_web_app_flow(self):
        import app as A
        client = A.app.test_client()
        self.assertIn('name="product_list"', client.get("/").get_data(as_text=True))
        loc = client.post("/start", data={"url": self.big_url + "/", "product_list": "1"}).headers["Location"]
        job = loc.rstrip("/").split("/")[-1]
        states, slowest = [], 0
        for _ in range(300):
            t = time.time()
            d = client.get(f"/api/job/{job}").get_json()
            slowest = max(slowest, time.time() - t)
            if not states or states[-1] != d["state"]:
                states.append(d["state"])
            if d["report"]:
                break
            time.sleep(0.1)
        self.assertEqual(d["mode"], "list")
        self.assertEqual(d["pages_done"], 20000)
        self.assertLess(slowest, 2, "the progress endpoint must never block on report building")
        for kind in ("xlsx", "csv", "issues"):
            self.assertEqual(client.get(f"/job/{job}/download/{kind}").status_code, 200, kind)


if __name__ == "__main__":
    unittest.main(verbosity=2)
