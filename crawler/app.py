#!/usr/bin/env python3
"""
app.py - web front end for seo_crawler.py, to embed in your SEO website.

A visitor enters a website URL and a page limit (up to 10,000). The crawl
runs in the background, the page shows live progress, and the CSV can be
downloaded at any point (it is written as the crawl goes).

Run locally:
    pip install -r requirements.txt
    python app.py                       # http://127.0.0.1:5000

Run in production (one process, many threads: jobs live in memory):
    gunicorn -w 1 --threads 8 -b 0.0.0.0:8000 app:app

Settings (environment variables):
    MAX_CONCURRENT_JOBS   crawls allowed at once (default 3)
    JOBS_DIR              where CSVs are stored (default ./jobs)
    JOB_RETENTION_HOURS   delete finished CSVs after this long (default 48)
    ALLOW_PRIVATE_HOSTS   "1" only for local testing; blocks localhost and
                          private network addresses otherwise
"""

import ipaddress
import os
import socket
import threading
import time
import uuid
from urllib.parse import urlparse

import requests

from flask import Flask, abort, jsonify, redirect, render_template_string, request, send_file, url_for

from seo_crawler import COLUMNS, DEFAULT_MAX_PAGES, HARD_MAX_PAGES, Crawler

MAX_CONCURRENT_JOBS = int(os.environ.get("MAX_CONCURRENT_JOBS", "3"))
JOBS_DIR = os.path.abspath(os.environ.get("JOBS_DIR", "jobs"))
JOB_RETENTION_HOURS = float(os.environ.get("JOB_RETENTION_HOURS", "48"))
ALLOW_PRIVATE_HOSTS = os.environ.get("ALLOW_PRIVATE_HOSTS") == "1"
# Test hook: fast delays for local testing only.
FAST_DELAYS = os.environ.get("CRAWLER_FAST_TEST") == "1"

os.makedirs(JOBS_DIR, exist_ok=True)
app = Flask(__name__)
jobs = {}  # job_id -> {"crawler", "thread", "created", "url"}
jobs_lock = threading.Lock()


def pick_scheme(bare):
    """For 'example.com' typed without http(s)://, prefer https, fall back to http."""
    try:
        requests.head("https://" + bare, timeout=10, allow_redirects=True)
        return "https://" + bare
    except requests.RequestException:
        return "http://" + bare


def validate_target(raw):
    """
    Return a clean http(s) URL, or raise ValueError with a friendly message.
    Refuses localhost / private IPs so visitors can't use your server to
    probe your own internal network.
    """
    raw = (raw or "").strip()
    if not raw:
        raise ValueError("Please enter a website URL.")
    if "://" not in raw:
        raw = pick_scheme(raw)
    parts = urlparse(raw)
    if parts.scheme not in ("http", "https") or not parts.hostname:
        raise ValueError("That doesn't look like a website URL.")
    if not ALLOW_PRIVATE_HOSTS:
        try:
            infos = socket.getaddrinfo(parts.hostname, None)
        except socket.gaierror:
            raise ValueError("That domain could not be found.")
        for info in infos:
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                raise ValueError("That address is not allowed.")
    return raw


def running_count():
    return sum(1 for j in jobs.values() if j["crawler"].state in ("pending", "running"))


def cleanup_old_jobs():
    cutoff = time.time() - JOB_RETENTION_HOURS * 3600
    with jobs_lock:
        for job_id in [k for k, j in jobs.items()
                       if j["created"] < cutoff and j["crawler"].state not in ("pending", "running")]:
            try:
                os.remove(jobs[job_id]["crawler"].output_csv)
            except OSError:
                pass
            del jobs[job_id]


def get_job(job_id):
    job = jobs.get(job_id)
    if not job:
        abort(404)
    return job


# ----------------------------------------------------------------- templates
BASE_CSS = """
<style>
 :root{--bg:#f7f7f8;--card:#fff;--text:#1d1d1f;--muted:#6b6b70;--accent:#2563eb;--border:#e3e3e8;--bad:#b42318}
 @media (prefers-color-scheme:dark){:root{--bg:#141416;--card:#1e1e21;--text:#ececf0;--muted:#9a9aa2;--accent:#5b8cff;--border:#2e2e33;--bad:#ff6b5e}}
 *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--text);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
 main{max-width:720px;margin:40px auto;padding:0 16px} .card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px}
 h1{font-size:1.5rem;margin:0 0 4px} p.sub{color:var(--muted);margin:0 0 20px}
 label{display:block;font-weight:600;margin:14px 0 6px} input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--text);font-size:1rem}
 button,.btn{display:inline-block;margin-top:18px;padding:10px 18px;border:0;border-radius:8px;background:var(--accent);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;text-decoration:none}
 .btn.secondary{background:transparent;color:var(--accent);border:1px solid var(--accent)} .err{color:var(--bad);margin-top:12px}
 .bar{height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin:16px 0 6px} .bar>div{height:100%;background:var(--accent);width:0;transition:width .4s}
 pre{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:.8rem;max-height:260px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere}
 .muted{color:var(--muted);font-size:.9rem}
 label.check{display:flex;gap:8px;align-items:center;font-weight:400} label.check input{width:auto}
</style>"""

FORM_HTML = BASE_CSS + """
<main><div class="card">
 <h1>Website SEO Crawler</h1>
 <p class="sub">Crawl any public website and download a spreadsheet of every page's title, meta description, H1, word count, links, contact details and product data. To pull a product directory, enter the shop's address, put its product folder below, and tick "Only save product pages".</p>
 <form method="post" action="{{ url_for('start') }}">
  <label for="url">Website URL</label>
  <input id="url" name="url" placeholder="https://example.com" value="{{ url or '' }}" required>
  <label for="max_pages">Maximum rows (1 to {{ hard_max }})</label>
  <input id="max_pages" name="max_pages" type="number" min="1" max="{{ hard_max }}" value="{{ max_pages }}">
  <label for="path">Only this section of the site (optional)</label>
  <input id="path" name="path" placeholder="/products/" value="{{ path or '' }}">
  <label class="check"><input type="checkbox" name="products_only" value="1" {% if products_only %}checked{% endif %}>
   Only save product pages (name, price, SKU, brand, stock)</label>
  <button type="submit">Start crawl</button>
  {% if error %}<div class="err">{{ error }}</div>{% endif %}
 </form>
 <p class="muted" style="margin-top:20px">The crawler follows robots.txt and pauses a few seconds between pages, so large sites take a while (about 4 seconds per page). Only crawl sites you own or have permission to crawl.</p>
</div></main>"""

JOB_HTML = BASE_CSS + """
<main><div class="card">
 <h1>Crawling {{ url }}</h1>
 <p class="sub" id="state">Starting...</p>
 <div class="bar"><div id="fill"></div></div>
 <div class="muted" id="count">0 / {{ max_pages }} rows</div>
 <a class="btn" href="{{ url_for('download', job_id=job_id) }}">Download CSV</a>
 <form method="post" action="{{ url_for('stop', job_id=job_id) }}" style="display:inline" id="stopform">
  <button class="btn secondary" type="submit">Stop</button></form>
 <a class="btn secondary" href="{{ url_for('index') }}">New crawl</a>
 <p class="muted" style="margin-top:16px">You can bookmark this page and come back later. The CSV downloads whatever has been crawled so far.</p>
 <pre id="log"></pre>
</div></main>
<script>
const jobUrl = {{ url_for('job_status', job_id=job_id)|tojson }};
async function poll(){
  try{
    const r = await fetch(jobUrl); const d = await r.json();
    document.getElementById('fill').style.width = Math.min(100, 100*d.pages_done/d.max_pages) + '%';
    document.getElementById('count').textContent = d.pages_done + ' / ' + d.max_pages + ' rows saved, ' + d.pages_fetched + ' pages checked' + (d.state==='running' ? ' (' + d.queued + ' more queued)' : '');
    const labels = {pending:'Starting...', running:'Crawling...', finished:'Finished. ', stopped:'Stopped. ', failed:'Failed: '};
    document.getElementById('state').textContent = (labels[d.state]||d.state) + (d.state==='running'?'':d.message);
    const log = document.getElementById('log'); log.textContent = d.log.join('\\n'); log.scrollTop = log.scrollHeight;
    if (d.state==='pending' || d.state==='running') setTimeout(poll, 2000);
    else document.getElementById('stopform').style.display='none';
  }catch(e){ setTimeout(poll, 5000); }
}
poll();
</script>"""


# -------------------------------------------------------------------- routes
@app.get("/healthz")
def healthz():
    """Used by the host (e.g. Render) to check the app is up."""
    return "ok"


@app.get("/")
def index():
    return render_template_string(FORM_HTML, url=None, error=None, path=None, products_only=False,
                                  max_pages=DEFAULT_MAX_PAGES, hard_max=HARD_MAX_PAGES)


@app.post("/start")
def start():
    cleanup_old_jobs()
    raw_url = request.form.get("url", "")
    try:
        max_pages = max(1, min(int(request.form.get("max_pages") or DEFAULT_MAX_PAGES), HARD_MAX_PAGES))
    except ValueError:
        max_pages = DEFAULT_MAX_PAGES

    path = (request.form.get("path") or "").strip()[:200]
    products_only = request.form.get("products_only") == "1"

    def form_error(msg, code=400):
        return render_template_string(FORM_HTML, url=raw_url, error=msg, max_pages=max_pages,
                                      hard_max=HARD_MAX_PAGES, path=path,
                                      products_only=products_only), code

    try:
        target = validate_target(raw_url)
    except ValueError as exc:
        return form_error(str(exc))

    with jobs_lock:
        if running_count() >= MAX_CONCURRENT_JOBS:
            return form_error("The crawler is busy right now. Please try again in a few minutes.", 503)
        job_id = uuid.uuid4().hex
        delays = (0.05, 0.1) if FAST_DELAYS else (2.5, 5.5)
        crawler = Crawler(target, os.path.join(JOBS_DIR, f"{job_id}.csv"), max_pages,
                          min_delay=delays[0], max_delay=delays[1],
                          backoff_schedule=[1, 2] if FAST_DELAYS else None,
                          path_prefix=path or None, products_only=products_only)
        thread = threading.Thread(target=crawler.run, daemon=True)
        jobs[job_id] = {"crawler": crawler, "thread": thread, "created": time.time(), "url": target}
        thread.start()
    return redirect(url_for("job_page", job_id=job_id))


@app.get("/job/<job_id>")
def job_page(job_id):
    job = get_job(job_id)
    return render_template_string(JOB_HTML, job_id=job_id, url=job["url"],
                                  max_pages=job["crawler"].max_pages)


@app.get("/api/job/<job_id>")
def job_status(job_id):
    c = get_job(job_id)["crawler"]
    return jsonify(state=c.state, message=c.message, pages_done=c.pages_done,
                   max_pages=c.max_pages, queued=c.queued, pages_fetched=c.pages_fetched, log=list(c.recent_log)[-15:])


@app.post("/job/<job_id>/stop")
def stop(job_id):
    get_job(job_id)["crawler"].stop()
    return redirect(url_for("job_page", job_id=job_id))


@app.get("/job/<job_id>/download")
def download(job_id):
    job = get_job(job_id)
    path = job["crawler"].output_csv
    if not os.path.exists(path):
        # Crawl hasn't written anything yet: send just the header row.
        with open(path, "w", encoding="utf-8-sig") as f:
            f.write(",".join(COLUMNS) + "\n")
    host = urlparse(job["url"]).hostname or "site"
    return send_file(path, mimetype="text/csv", as_attachment=True,
                     download_name=f"seo-crawl-{host}.csv")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), threaded=True)
