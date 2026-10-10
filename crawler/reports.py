"""
reports.py - turns a crawl CSV into an SEO issues report, a 0-100 site
score, an Excel workbook, a "what changed" diff between two crawls, and a
side-by-side competitor comparison.

Everything here works on the rows seo_crawler.py writes, so it can also be
run on an old CSV:  python reports.py crawl.csv  (prints the score and issues)
"""

import csv
import re
import sys
from collections import Counter, defaultdict

MISSING = "N/A"

# Severity -> points taken off per affected page when scoring.
WEIGHTS = {"High": 10, "Medium": 4, "Low": 1}
SLOW_MS = 1500
THIN_WORDS = 200
ISSUE_COLUMNS = ["Severity", "Issue", "URL", "Detail", "Found On"]


def load_rows(path):
    try:
        with open(path, newline="", encoding="utf-8-sig") as f:
            return list(csv.DictReader(f))
    except FileNotFoundError:
        return []


def _int(value, default=0):
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def parse_price(value):
    """'£1,299.00' -> 1299.0; None if there is no number."""
    if not value or value == MISSING:
        return None
    match = re.search(r"\d[\d,]*(?:\.\d+)?", str(value))
    if not match:
        return None
    try:
        return float(match.group(0).replace(",", ""))
    except ValueError:
        return None


def _is_html_page(row):
    """Pages we can judge for on-page SEO (fetched OK and had HTML)."""
    return _int(row.get("Status")) == 200 and row.get("Word Count", MISSING) != MISSING


def find_issues(rows):
    """Return a list of issue dicts (see ISSUE_COLUMNS), worst first."""
    issues = []

    def add(severity, issue, row, detail=""):
        issues.append({"Severity": severity, "Issue": issue, "URL": row.get("URL", ""),
                       "Detail": detail, "Found On": row.get("Found On", MISSING)})

    pages = [r for r in rows if _is_html_page(r)]
    titles = Counter(r["Title"] for r in pages if r.get("Title", MISSING) != MISSING)
    descs = Counter(r["Meta Description"] for r in pages
                    if r.get("Meta Description", MISSING) != MISSING)

    for row in rows:
        if row.get("Status") == "Redirect loop":
            add("High", "Redirect loop", row, "The page keeps redirecting and never loads")
            continue
        status = _int(row.get("Status"))
        if status >= 500:
            add("High", "Server error", row, f"HTTP {status}")
            continue
        if status >= 400:
            add("High", "Broken page", row, f"HTTP {status}")
            continue
        if not _is_html_page(row):
            continue

        title = row.get("Title", MISSING)
        if title == MISSING:
            add("High", "Missing title", row)
        else:
            length = len(title)
            if length > 60:
                add("Low", "Title too long", row, f"{length} characters (aim for 30-60)")
            elif length < 15:
                add("Low", "Title too short", row, f"{length} characters (aim for 30-60)")
            if titles[title] > 1:
                add("Medium", "Duplicate title", row, f"Shared by {titles[title]} pages: {title[:80]}")

        desc = row.get("Meta Description", MISSING)
        if desc == MISSING:
            add("Medium", "Missing meta description", row)
        else:
            length = len(desc)
            if length > 160:
                add("Low", "Meta description too long", row, f"{length} characters (aim for 70-160)")
            elif length < 50:
                add("Low", "Meta description too short", row, f"{length} characters (aim for 70-160)")
            if descs[desc] > 1:
                add("Medium", "Duplicate meta description", row, f"Shared by {descs[desc]} pages")

        h1_count = _int(row.get("H1 Count"))
        if h1_count == 0:
            add("Medium", "Missing H1 heading", row)
        elif h1_count > 1:
            add("Low", "More than one H1 heading", row, f"{h1_count} H1 tags")

        ms = _int(row.get("Response Time (ms)"))
        if ms > SLOW_MS:
            add("Medium", "Slow page", row, f"{ms} ms to respond (aim for under {SLOW_MS})")

        words = _int(row.get("Word Count"))
        if words < THIN_WORDS:
            add("Low", "Thin content", row, f"{words} words")

        no_alt = _int(row.get("Images Missing Alt"))
        if no_alt:
            add("Low", "Images missing alt text", row, f"{no_alt} image(s)")

        if "noindex" in str(row.get("Meta Robots", "")).lower():
            add("Medium", "Hidden from search engines (noindex)", row)

    order = {"High": 0, "Medium": 1, "Low": 2}
    issues.sort(key=lambda i: (order[i["Severity"]], i["Issue"], i["URL"]))
    return issues


def site_score(rows, issues):
    """0-100. Average points lost per page, scaled so ~25 points/page = 0."""
    if not rows:
        return 0
    lost = sum(WEIGHTS[i["Severity"]] for i in issues)
    return max(0, round(100 * (1 - min(1.0, lost / len(rows) / 25))))


def summarise(rows, issues=None):
    """Headline numbers for a crawl, used by the report, Excel and compare."""
    issues = find_issues(rows) if issues is None else issues
    pages = [r for r in rows if _is_html_page(r)]
    prices = [p for p in (parse_price(r.get("Price")) for r in rows) if p is not None]
    words = [_int(r.get("Word Count")) for r in pages]
    times = [_int(r.get("Response Time (ms)")) for r in pages]
    by_issue = Counter(i["Issue"] for i in issues)
    by_sev = Counter(i["Severity"] for i in issues)
    return {
        "Score": site_score(rows, issues),
        "Pages crawled": len(rows),
        "Pages OK": len(pages),
        "Broken pages": by_issue["Broken page"] + by_issue["Server error"],
        "High issues": by_sev["High"],
        "Medium issues": by_sev["Medium"],
        "Low issues": by_sev["Low"],
        "Average words per page": round(sum(words) / len(words)) if words else 0,
        "Average response (ms)": round(sum(times) / len(times)) if times else 0,
        "Products found": sum(1 for r in rows if r.get("Product Name", MISSING) != MISSING
                              or r.get("Price", MISSING) != MISSING),
        "Average price": round(sum(prices) / len(prices), 2) if prices else MISSING,
        "Lowest price": min(prices) if prices else MISSING,
        "Highest price": max(prices) if prices else MISSING,
        "issue_counts": dict(by_issue.most_common()),
    }


def write_issues_csv(issues, path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=ISSUE_COLUMNS)
        writer.writeheader()
        writer.writerows(issues)


def write_xlsx(rows, path, issues=None, summary=None, site=""):
    """Excel workbook with Summary, Issues and Pages sheets."""
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill
    from openpyxl.utils import get_column_letter

    issues = find_issues(rows) if issues is None else issues
    summary = summarise(rows, issues) if summary is None else summary
    if len(rows) > 20000:
        return _write_xlsx_large(rows, path, issues, summary, site)
    wb = Workbook()
    bold = Font(bold=True)
    head_fill = PatternFill("solid", fgColor="DCE6F8")

    def sheet(ws, header, data):
        ws.append(header)
        for cell in ws[1]:
            cell.font, cell.fill = bold, head_fill
        for item in data:
            ws.append([_cell(item.get(h, "")) for h in header])
        ws.freeze_panes = "A2"
        if data:
            ws.auto_filter.ref = ws.dimensions
        for idx, h in enumerate(header, 1):
            longest = max([len(str(h))] + [len(str(d.get(h, ""))) for d in data[:500]])
            ws.column_dimensions[get_column_letter(idx)].width = min(60, max(10, longest + 2))

    ws = wb.active
    ws.title = "Summary"
    ws.append(["Site", site])
    for key, value in summary.items():
        if key != "issue_counts":
            ws.append([key, value])
    ws.append([])
    ws.append(["Issue", "Pages affected"])
    ws.cell(ws.max_row, 1).font = ws.cell(ws.max_row, 2).font = bold
    for issue, count in summary["issue_counts"].items():
        ws.append([issue, count])
    for c in ws["A"]:
        if c.value:
            c.font = bold
    ws.column_dimensions["A"].width, ws.column_dimensions["B"].width = 34, 60

    sheet(wb.create_sheet("Issues"), ISSUE_COLUMNS, issues)
    header = list(rows[0].keys()) if rows else []
    sheet(wb.create_sheet("Pages"), header, rows)
    wb.save(path)


def _cell(value):
    """Numbers as numbers so Excel can sort and sum them."""
    if isinstance(value, str) and re.fullmatch(r"-?\d+(\.\d+)?", value):
        return float(value) if "." in value else int(value)
    return value


def diff_crawls(old_rows, new_rows):
    """What changed between two crawls of the same site."""
    old = {r["URL"]: r for r in old_rows}
    new = {r["URL"]: r for r in new_rows}
    changes = defaultdict(list)
    for url in new.keys() - old.keys():
        changes["New pages"].append(url)
    for url in old.keys() - new.keys():
        changes["Pages no longer found"].append(url)
    for url in new.keys() & old.keys():
        a, b = old[url], new[url]
        sa, sb = _int(a.get("Status")), _int(b.get("Status"))
        if sa < 400 <= sb:
            changes["Newly broken"].append(f"{url} (now HTTP {sb})")
        elif sb < 400 <= sa:
            changes["Fixed"].append(f"{url} (was HTTP {sa})")
        pa, pb = parse_price(a.get("Price")), parse_price(b.get("Price"))
        if pa is not None and pb is not None and pa != pb:
            label = "Price drops" if pb < pa else "Price rises"
            name = b.get("Product Name") if b.get("Product Name", MISSING) != MISSING else url
            changes[label].append(f"{name}: {pa:g} -> {pb:g} ({url})")
        if a.get("Title") != b.get("Title") and sb == 200:
            changes["Title changed"].append(f"{url}: \"{a.get('Title')}\" -> \"{b.get('Title')}\"")
        if (a.get("Availability") != b.get("Availability")
                and b.get("Availability", MISSING) != MISSING):
            changes["Stock changed"].append(f"{url}: {a.get('Availability')} -> {b.get('Availability')}")
    return {k: sorted(v) for k, v in changes.items()}


def diff_as_text(changes, limit=50):
    if not changes:
        return "No changes since the last crawl."
    lines = []
    for heading, items in changes.items():
        lines.append(f"{heading} ({len(items)})")
        lines += [f"  - {item}" for item in items[:limit]]
        if len(items) > limit:
            lines.append(f"  ...and {len(items) - limit} more (see the attached CSV)")
        lines.append("")
    return "\n".join(lines).strip()


COMPARE_METRICS = ["Score", "Pages crawled", "Pages OK", "Broken pages", "High issues",
                   "Medium issues", "Low issues", "Average words per page",
                   "Average response (ms)", "Products found", "Average price",
                   "Lowest price", "Highest price"]
# For these, a lower number is the better result.
LOWER_IS_BETTER = {"Broken pages", "High issues", "Medium issues", "Low issues",
                   "Average response (ms)"}


def compare(summary_a, summary_b):
    """Rows of (metric, a, b, winner) where winner is 'a', 'b' or ''."""
    out = []
    for metric in COMPARE_METRICS:
        a, b = summary_a.get(metric, MISSING), summary_b.get(metric, MISSING)
        winner = ""
        if isinstance(a, (int, float)) and isinstance(b, (int, float)) and a != b \
                and "price" not in metric.lower() and metric not in ("Pages crawled", "Pages OK", "Products found"):
            better_a = a < b if metric in LOWER_IS_BETTER else a > b
            winner = "a" if better_a else "b"
        out.append((metric, a, b, winner))
    return out


if __name__ == "__main__":
    data = load_rows(sys.argv[1])
    found = find_issues(data)
    info = summarise(data, found)
    print(f"Score: {info['Score']}/100 from {info['Pages crawled']} pages")
    for name, count in info["issue_counts"].items():
        print(f"  {count:5d}  {name}")


def _write_xlsx_large(rows, path, issues, summary, site):
    """Same three sheets, written in openpyxl's streaming mode so big lists fit in a small server's memory."""
    from openpyxl import Workbook
    from openpyxl.cell import WriteOnlyCell
    from openpyxl.styles import Font
    wb = Workbook(write_only=True)
    bold = Font(bold=True)

    def head(ws, values):
        cells = []
        for v in values:
            c = WriteOnlyCell(ws, value=v)
            c.font = bold
            cells.append(c)
        ws.append(cells)

    ws = wb.create_sheet("Summary")
    ws.append(["Site", site])
    for key, value in summary.items():
        if key != "issue_counts":
            ws.append([key, value])
    ws.append([])
    head(ws, ["Issue", "Pages affected"])
    for issue, count in summary["issue_counts"].items():
        ws.append([issue, count])

    ws = wb.create_sheet("Issues")
    ws.freeze_panes = "A2"
    head(ws, ISSUE_COLUMNS)
    for item in issues:
        ws.append([_cell(item.get(h, "")) for h in ISSUE_COLUMNS])

    header = list(rows[0].keys()) if rows else []
    # Drop columns that are empty in every row (e.g. SEO fields in a sitemap product list).
    header = [h for h in header if any(r.get(h, MISSING) not in (MISSING, "") for r in rows[:5000])] or header
    ws = wb.create_sheet("Pages")
    ws.freeze_panes = "A2"
    head(ws, header)
    for row in rows:
        ws.append([_cell(row.get(h, "")) for h in header])
    wb.save(path)
