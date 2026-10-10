"""
store.py - small SQLite store for email leads and scheduled re-crawls.

The database lives in DATA_DIR (default ./data). On Render, attach a
persistent disk and point DATA_DIR at it, otherwise the file is wiped on
every deploy.
"""

import csv
import io
import os
import secrets
import sqlite3
import threading
import time

DATA_DIR = os.path.abspath(os.environ.get("DATA_DIR", "data"))
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "crawler.sqlite3")
_lock = threading.Lock()


def _conn():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def init():
    with _lock, _conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY, email TEXT NOT NULL, site_url TEXT,
            job_id TEXT, marketing_ok INTEGER DEFAULT 0, created REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY, token TEXT UNIQUE NOT NULL, email TEXT NOT NULL,
            url TEXT NOT NULL, max_pages INTEGER NOT NULL, path TEXT,
            products_only INTEGER DEFAULT 0, every_days INTEGER NOT NULL,
            confirmed INTEGER DEFAULT 0, active INTEGER DEFAULT 1,
            next_run REAL, last_run REAL, last_csv TEXT, created REAL NOT NULL);
        """)


# ------------------------------------------------------------------ leads
def add_lead(email, site_url, job_id, marketing_ok):
    with _lock, _conn() as c:
        c.execute("INSERT INTO leads (email, site_url, job_id, marketing_ok, created) "
                  "VALUES (?, ?, ?, ?, ?)",
                  (email, site_url, job_id, int(bool(marketing_ok)), time.time()))


def leads_csv():
    with _lock, _conn() as c:
        rows = c.execute("SELECT email, site_url, marketing_ok, created FROM leads "
                         "ORDER BY created DESC").fetchall()
    out = io.StringIO()
    writer = csv.writer(out)
    writer.writerow(["Email", "Site crawled", "Happy to get marketing", "Date (UTC)"])
    for r in rows:
        writer.writerow([r["email"], r["site_url"], "yes" if r["marketing_ok"] else "no",
                         time.strftime("%Y-%m-%d %H:%M", time.gmtime(r["created"]))])
    return out.getvalue()


# -------------------------------------------------------------- schedules
def add_schedule(email, url, max_pages, path, products_only, every_days):
    token = secrets.token_urlsafe(24)
    with _lock, _conn() as c:
        c.execute("INSERT INTO schedules (token, email, url, max_pages, path, products_only, "
                  "every_days, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                  (token, email, url, max_pages, path, int(bool(products_only)),
                   every_days, time.time()))
    return token


def active_count_for(email):
    with _lock, _conn() as c:
        return c.execute("SELECT COUNT(*) FROM schedules WHERE email = ? AND active = 1",
                         (email,)).fetchone()[0]


def get_schedule(token):
    with _lock, _conn() as c:
        return c.execute("SELECT * FROM schedules WHERE token = ?", (token,)).fetchone()


def confirm_schedule(token):
    """Mark confirmed; first run is due straight away."""
    with _lock, _conn() as c:
        cur = c.execute("UPDATE schedules SET confirmed = 1, next_run = ? "
                        "WHERE token = ? AND active = 1 AND confirmed = 0",
                        (time.time(), token))
        return cur.rowcount > 0


def stop_schedule(token):
    with _lock, _conn() as c:
        return c.execute("UPDATE schedules SET active = 0 WHERE token = ?",
                         (token,)).rowcount > 0


def due_schedules(now=None):
    now = now or time.time()
    with _lock, _conn() as c:
        return c.execute("SELECT * FROM schedules WHERE active = 1 AND confirmed = 1 "
                         "AND next_run <= ? ORDER BY next_run", (now,)).fetchall()


def finish_run(schedule_id, last_csv, every_days):
    now = time.time()
    with _lock, _conn() as c:
        c.execute("UPDATE schedules SET last_run = ?, last_csv = ?, next_run = ? WHERE id = ?",
                  (now, last_csv, now + every_days * 86400, schedule_id))


def delete_unconfirmed(older_than_hours=48):
    with _lock, _conn() as c:
        c.execute("DELETE FROM schedules WHERE confirmed = 0 AND created < ?",
                  (time.time() - older_than_hours * 3600,))
