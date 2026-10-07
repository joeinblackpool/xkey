// Browser code for the full-site audit (served as /assets/audit.js via Function#toString, so it
// is real, lint-checkable JS here). Crawls via /api/audit/* in small batches, then builds the
// site-wide report in the page. No dependencies.
export function auditApp() {
  "use strict";
  var root = document.getElementById("audit");
  if (!root) return;
  var START = root.getAttribute("data-url"), MAX = Math.min(250, +root.getAttribute("data-max") || 250), BATCH = 6, PARALLEL = 2;
  var BRAND = root.getAttribute("data-brand") || "";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var short = function (u) { try { var x = new URL(u); return (x.pathname + x.search) || "/"; } catch (e) { return u; } };
  var safeHref = function (u) { return /^https?:\/\//i.test(String(u)) ? esc(u) : "#"; };
  var $ = function (id) { return document.getElementById(id); };
  var state = { host: null, token: null, sitemap: new Set(), sitemapFound: false, robots: false, robotsDown: false, robotsStatus: 0, seen: new Map(), queue: [], results: new Map(), blocked: new Set(), inbound: new Map(), redirectedFrom: new Map(), retried: new Set(), stopped: false, error: null, active: 0, done: false, startedAt: Date.now() };

  root.innerHTML = '<div class="card" id="au-progress"><p class="ct" id="au-status" aria-live="polite">Starting audit…</p><div class="au-bar"><span id="au-fill"></span></div><p class="small" id="au-count">Reading robots.txt and sitemap…</p><button type="button" class="btn ghost" id="au-stop">Stop and show results</button></div><div id="au-report"></div>';
  $("au-stop").onclick = function () { state.stopped = true; this.disabled = true; this.textContent = "Stopping…"; if (state.active === 0) pump(); };

  function enqueue(u, depth, from) {
    if (from) { if (!state.inbound.has(u)) state.inbound.set(u, new Set()); state.inbound.get(u).add(from); }
    if (state.seen.has(u)) { var s = state.seen.get(u); if (depth != null && (s.depth == null || depth < s.depth)) s.depth = depth; return; }
    if (state.seen.size >= MAX * 4) return;
    state.seen.set(u, { depth: depth, sitemapOnly: depth == null });
    state.queue.push(u);
  }
  function progress() {
    var n = state.results.size;
    $("au-fill").style.width = Math.min(100, Math.round((n / Math.max(1, Math.min(MAX, state.seen.size - state.blocked.size))) * 100)) + "%";
    $("au-count").textContent = n + " page" + (n === 1 ? "" : "s") + " checked · " + state.queue.length + " waiting · limit " + MAX + (state.blocked.size ? " · " + state.blocked.size + " skipped (robots.txt)" : "");
  }
  function api(path) {
    return fetch(path).then(function (r) {
      return r.json().catch(function () { return { error: "The server sent an unexpected reply (HTTP " + r.status + ")." }; }).then(function (j) {
        if (!r.ok || j.error) { var e = new Error(j.error || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function pump() {
    if (state.done) return;
    if (state.stopped || state.results.size >= MAX) { if (state.active === 0) finish(); return; }
    if (state.queue.length === 0 && state.active === 0) {
      // links exhausted: check sitemap URLs nobody links to (orphans)
      var added = 0; state.sitemap.forEach(function (u) { if (!state.seen.has(u) && state.results.size + added < MAX) { enqueue(u, null, null); added++; } });
      if (!added) return finish();
    }
    while (state.active < PARALLEL && state.queue.length) {
      var room = MAX - state.results.size - state.active * BATCH; if (room <= 0) break;
      send(state.queue.splice(0, Math.min(BATCH, room)));
    }
  }
  function send(batch) {
    state.active++;
    api("/api/audit/batch?t=" + encodeURIComponent(state.token) + batch.map(function (u) { return "&u=" + encodeURIComponent(u); }).join(""))
      .then(function (rows) { rows.forEach(take); batch.forEach(function (u) { if (!state.results.has(u) && !state.blocked.has(u)) state.results.set(u, { url: u, status: 0, error: "No result" }); }); })
      .catch(function (e) {
        var key = batch.join(" ");
        if (e.status !== 429 && e.status !== 403 && !state.retried.has(key)) { state.retried.add(key); Array.prototype.unshift.apply(state.queue, batch); return; }
        state.error = e.message; $("au-status").textContent = "Paused: " + e.message; state.stopped = true;
      })
      .then(function () { state.active--; progress(); pump(); });
  }
  function take(r) {
    if (!r || typeof r.url !== "string") return;
    if (r.blocked) { state.blocked.add(r.url); return; }
    if (state.results.has(r.url)) return;
    state.results.set(r.url, r);
    var d = (state.seen.get(r.url) || {}).depth;
    if (r.redirect) { try { var t = new URL(r.redirect); t.hash = ""; if (t.hostname.replace(/^www\./, "") === state.host.replace(/^www\./, "")) { state.redirectedFrom.set(t.href, r.url); enqueue(t.href, d, null); } } catch (e) {} }
    if (r.links) r.links.forEach(function (l) { enqueue(l, d == null ? null : d + 1, r.url); });
  }

  api("/api/audit/start?url=" + encodeURIComponent(START)).then(function (s) {
    state.host = s.host; state.token = s.token; state.robots = s.robots; state.robotsDown = !!s.robotsDown; state.robotsStatus = s.robotsStatus; state.sitemapFound = s.sitemapFound; state.sitemapTruncated = !!s.sitemapTruncated;
    (s.sitemap || []).forEach(function (u) { state.sitemap.add(u); });
    $("au-status").textContent = "Crawling " + s.host + "…";
    enqueue(s.start, 0, null); progress(); pump();
  }).catch(function (e) { root.innerHTML = '<div class="card"><p class="ct">The audit couldn\'t start</p><p>' + esc(e.message) + "</p></div>"; });

  // ---------------- analysis
  var W = { critical: 20, high: 10, medium: 5, low: 2 };
  var bits = function (x) { x = x - ((x >>> 1) & 0x55555555); x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; };
  var ham = function (a, b) { return bits((parseInt(a.slice(0, 8), 16) ^ parseInt(b.slice(0, 8), 16)) >>> 0) + bits((parseInt(a.slice(8), 16) ^ parseInt(b.slice(8), 16)) >>> 0); };
  function finish() {
    if (state.done) return; state.done = true;
    var all = Array.from(state.results.values());
    var html = all.filter(function (r) { return r.status === 200 && r.title !== undefined; });
    var idx = html.filter(function (r) { return !r.noindex && (!r.canonical || r.canonical === r.url); });
    var issues = [];
    function add(sev, title, pages, fix) { if (pages.length) issues.push({ sev: sev, title: title, pages: pages, fix: fix }); }
    var src = function (u) { var s = state.inbound.get(u); return s ? Array.from(s).slice(0, 3).map(short).join(", ") : state.redirectedFrom.has(u) ? "redirect from " + short(state.redirectedFrom.get(u)) : "sitemap only"; };
    var groupBy = function (list, keyFn) { var m = new Map(); list.forEach(function (r) { var k = keyFn(r); if (!k) return; if (!m.has(k)) m.set(k, []); m.get(k).push(r); }); var out = []; m.forEach(function (rs) { if (rs.length > 1) out.push(rs); }); return out; };

    if (state.robotsDown) issues.push({ sev: "critical", title: "robots.txt is unavailable (" + (state.robotsStatus ? "HTTP " + state.robotsStatus : "no response") + ")", pages: [], fix: "Google treats an unreachable robots.txt as \"don't crawl\" and pauses crawling. Make /robots.txt return 200, or 404 if you don't need one.", site: true });
    add("critical", "Broken pages (4xx/5xx or unreachable)", all.filter(function (r) { return r.status >= 400 || r.status === 0; }).map(function (r) { return [r.url, (r.status || r.error) + " · linked from " + src(r.url)]; }), "Fix the page, restore it, or 301-redirect it to the closest live page – and update the links pointing to it.");
    var redirs = all.filter(function (r) { return r.status >= 300 && r.status < 400; });
    add("high", "Internal links to redirects", redirs.filter(function (r) { return state.inbound.has(r.url); }).map(function (r) { return [r.url, r.status + " → " + (r.redirect ? short(r.redirect) : "?") + " · linked from " + src(r.url)]; }), "Point these links straight at the final address so visitors and crawlers skip the redirect.");
    add("high", "Redirect chains", redirs.filter(function (r) { var t = state.results.get(r.redirect); return t && t.status >= 300 && t.status < 400; }).map(function (r) { return [r.url, "→ " + short(r.redirect) + " → " + short(state.results.get(r.redirect).redirect)]; }), "Make every redirect go to its final destination in one hop.");
    add("medium", "Internal links using http://", html.filter(function (r) { return r.httpLinks > 0; }).map(function (r) { return [r.url, r.httpLinks + " link(s) to http:// pages"]; }), "Update internal links to https:// (or relative links) so they don't go through a redirect.");
    add("high", "Noindex pages listed in the sitemap", html.filter(function (r) { return r.noindex && state.sitemap.has(r.url); }).map(function (r) { return [r.url, "noindex"]; }), "Either remove noindex or take the page out of the sitemap – the two signals contradict each other.");
    add("medium", "Sitemap lists redirects or errors", all.filter(function (r) { return state.sitemap.has(r.url) && r.status !== 200; }).map(function (r) { return [r.url, String(r.status || r.error) + (r.redirect ? " → " + short(r.redirect) : "")]; }), "List only final, working (200) URLs in the sitemap.");
    add("medium", "Pages set to noindex", html.filter(function (r) { return r.noindex && !state.sitemap.has(r.url); }).map(function (r) { return [r.url, "won't appear in Google"]; }), "Check these are meant to be hidden from search.");
    var canonOther = html.filter(function (r) { return r.canonical && r.canonical !== r.url; });
    var canonBad = canonOther.filter(function (r) { var t = state.results.get(r.canonical); return t && (t.status !== 200 || t.noindex); });
    add("high", "Canonical points to a redirect, error or noindex page", canonBad.map(function (r) { var t = state.results.get(r.canonical); return [r.url, "canonical → " + short(r.canonical) + " (" + (t.noindex && t.status === 200 ? "noindex" : t.status || t.error) + ")"]; }), "Point canonicals at the final, indexable version of the page.");
    add("medium", "Canonical points to another page", canonOther.filter(function (r) { return canonBad.indexOf(r) < 0; }).map(function (r) { return [r.url, "canonical → " + short(r.canonical)]; }), "Fine for true duplicates (e.g. filtered or tracking URLs); otherwise every unique page should have a self-referencing canonical.");
    add("low", "Missing canonical tag", html.filter(function (r) { return !r.canonical && !r.noindex; }).map(function (r) { return [r.url, "no canonical"]; }), "Add a self-referencing canonical tag to every page – it protects against duplicate URLs created by parameters.");
    add("critical", "Missing page title", idx.filter(function (r) { return !r.title; }).map(function (r) { return [r.url, "no <title>"]; }), "Give every page a unique, descriptive title.");
    var dupRows = function (key) { var out = []; groupBy(idx, function (r) { return (r[key] || "").trim().toLowerCase(); }).forEach(function (rs) { rs.forEach(function (r) { out.push([r.url, "“" + r[key].slice(0, 80) + "” shared by " + rs.length + " pages"]); }); }); return out; };
    add("high", "Duplicate titles", dupRows("title"), "Rewrite titles so each page describes its own topic – duplicates make pages compete with each other.");
    // near-duplicate titles: same words once site-wide boilerplate (brand, location) is ignored
    var tok = function (t) { return (t || "").toLowerCase().split(/[^\p{L}\p{N}£]+/u).filter(function (w) { return w.length > 1; }); };
    var df = new Map(); idx.forEach(function (r) { new Set(tok(r.title)).forEach(function (w) { df.set(w, (df.get(w) || 0) + 1); }); });
    var common = function (w) { return idx.length >= 5 && df.get(w) > idx.length * 0.4; };
    var tsets = idx.map(function (r) { return { r: r, s: new Set(tok(r.title).filter(function (w) { return !common(w); })) }; }).filter(function (x) { return x.s.size >= 2; });
    var nearT = new Map();
    for (var i = 0; i < tsets.length; i++) for (var j = i + 1; j < tsets.length; j++) {
      var A = tsets[i], B = tsets[j]; if (A.r.title.trim().toLowerCase() === B.r.title.trim().toLowerCase()) continue;
      var inter = 0; A.s.forEach(function (w) { if (B.s.has(w)) inter++; });
      if (inter / (A.s.size + B.s.size - inter) >= 0.8) { if (!nearT.has(A.r.url)) nearT.set(A.r.url, B.r); if (!nearT.has(B.r.url)) nearT.set(B.r.url, A.r); }
    }
    add("low", "Near-duplicate titles", Array.from(nearT).map(function (x) { return [x[0], "very similar to " + short(x[1].url)]; }), "Make each title clearly different, leading with what's unique about that page.");
    add("medium", "Titles too long for Google", idx.filter(function (r) { return r.titlePx > 580; }).map(function (r) { return [r.url, r.titlePx + "px: " + r.title.slice(0, 70)]; }), "Shorten titles to under ~580px (about 55–60 characters).");
    add("low", "Titles too short", idx.filter(function (r) { return r.title && r.titlePx < 250; }).map(function (r) { return [r.url, r.titlePx + "px: " + r.title]; }), "Use the space: add the main keyword and location or brand.");
    add("high", "Missing meta description", idx.filter(function (r) { return !r.desc; }).map(function (r) { return [r.url, "no description"]; }), "Write a unique 140–155 character description for each page.");
    add("medium", "Duplicate meta descriptions", dupRows("desc"), "Make each description specific to its page.");
    add("low", "Descriptions too long", idx.filter(function (r) { return r.descPx > 990; }).map(function (r) { return [r.url, r.descPx + "px"]; }), "Trim descriptions to under ~990px (about 155 characters).");
    // duplicate content: identical main text, then near-identical (SimHash within 3 of 64 bits)
    var dupC = [], inDup = new Set();
    groupBy(idx, function (r) { return r.hash; }).forEach(function (rs) { rs.forEach(function (r) { inDup.add(r.url); dupC.push([r.url, "same main text as " + rs.filter(function (o) { return o !== r; }).slice(0, 2).map(function (o) { return short(o.url); }).join(", ")]); }); });
    add("high", "Duplicate content", dupC, "Merge duplicate pages and 301-redirect the extras, or point a canonical at the main version.");
    var sims = idx.filter(function (r) { return r.sim && !inDup.has(r.url); }), nearC = new Map();
    for (var a = 0; a < sims.length; a++) for (var b = a + 1; b < sims.length; b++) if (ham(sims[a].sim, sims[b].sim) <= 3) { if (!nearC.has(sims[a].url)) nearC.set(sims[a].url, sims[b]); if (!nearC.has(sims[b].url)) nearC.set(sims[b].url, sims[a]); }
    add("medium", "Near-duplicate content", Array.from(nearC).map(function (x) { return [x[0], "almost the same text as " + short(x[1].url)]; }), "Pages that only swap a place name or product are seen as thin duplicates – give each one genuinely specific content, or combine them.");
    add("high", "Missing H1 heading", idx.filter(function (r) { return !r.h1.length; }).map(function (r) { return [r.url, "no H1"]; }), "Give every page one H1 stating its topic.");
    add("low", "More than one H1", idx.filter(function (r) { return r.h1.length > 1; }).map(function (r) { return [r.url, r.h1.length + " H1s"]; }), "Use a single clear H1; make the others H2s.");
    add("medium", "Thin content (under 200 words)", idx.filter(function (r) { return r.words < 200; }).map(function (r) { return [r.url, r.words + " words of main content"]; }), "Expand with genuinely useful detail, merge with a related page, or noindex it.");
    add("high", "Orphan pages (in sitemap, never linked)", html.filter(function (r) { return (state.seen.get(r.url) || {}).sitemapOnly && !state.inbound.has(r.url); }).map(function (r) { return [r.url, "no internal links point here"]; }), "Link to these pages from relevant pages – Google rarely ranks pages your own site doesn't link to.");
    if (state.sitemapFound && !state.sitemapTruncated) add("medium", "Indexable pages missing from the sitemap", idx.filter(function (r) { return !state.sitemap.has(r.url); }).map(function (r) { return [r.url, "not in sitemap"]; }), "Add every indexable page to the XML sitemap.");
    add("medium", "Deep pages (4+ clicks from home)", idx.filter(function (r) { var d = (state.seen.get(r.url) || {}).depth; return d != null && d >= 4; }).map(function (r) { return [r.url, (state.seen.get(r.url).depth) + " clicks"]; }), "Bring important pages within three clicks of the home page with better menus and hub pages.");
    // hreflang: every alternate must link back (Google ignores one-way pairs)
    var hrefl = [], hrefBad = [];
    html.forEach(function (r) { (r.hreflang || []).forEach(function (e) { var t = state.results.get(e[1]); if (!t || e[1] === r.url) return; if (t.status !== 200) hrefBad.push([r.url, e[0] + " → " + short(e[1]) + " (" + (t.status || t.error) + ")"]); else if (t.hreflang && !t.hreflang.some(function (x) { return x[1] === r.url; })) hrefl.push([r.url, e[0] + " → " + short(e[1]) + " doesn't link back"]); }); });
    add("high", "hreflang without return links", hrefl, "Each language version must list every other version (and itself) – Google ignores hreflang pairs that don't point back.");
    add("high", "hreflang points to redirects or errors", hrefBad, "Point hreflang links at the final, working URL of each language version.");
    add("medium", "Slow server response (over 1 s)", html.filter(function (r) { return r.ms > 1000; }).map(function (r) { return [r.url, (r.ms / 1000).toFixed(1) + " s"]; }), "Add page caching or a CDN; look at slow database queries and plugins.");
    add("low", "Heavy HTML (over 500 kB)", html.filter(function (r) { return r.bytes > 500000; }).map(function (r) { return [r.url, Math.round(r.bytes / 1024) + " kB"]; }), "Remove inline bloat and paginate very long lists.");
    add("medium", "Images missing alt text", html.filter(function (r) { return r.imgsNoAlt > 0; }).map(function (r) { return [r.url, r.imgsNoAlt + " of " + r.imgs + " images"]; }), "Add descriptive alt text (or alt=\"\" for decorative images).");
    add("low", "No structured data", idx.filter(function (r) { return !r.ld; }).map(function (r) { return [r.url, "no JSON-LD"]; }), "Add JSON-LD (Organization/LocalBusiness, WebPage or Article, BreadcrumbList).");
    add("low", "Missing language attribute", html.filter(function (r) { return !r.lang; }).map(function (r) { return [r.url, "no lang"]; }), "Add lang=\"en-GB\" to the <html> tag.");
    if (!state.sitemapFound) issues.push({ sev: "high", title: "No XML sitemap found", pages: [], fix: "Create sitemap.xml listing every page, add it to robots.txt and submit it in Google Search Console.", site: true });
    if (!state.robots && !state.robotsDown) issues.push({ sev: "low", title: "No robots.txt", pages: [], fix: "Add a robots.txt that allows crawling and lists your sitemap.", site: true });

    var base = Math.max(1, html.length);
    var penalty = issues.reduce(function (t, i) { var frac = i.site ? 1 : Math.min(1, i.pages.length / base); return t + W[i.sev] * (0.35 + 0.65 * frac); }, 0);
    var score = all.length ? Math.max(0, Math.round(100 - penalty)) : 0;
    var order = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort(function (a, b) { return order[a.sev] - order[b.sev] || b.pages.length - a.pages.length; });
    render(all, html, issues, score);
  }

  // Force-directed map of internal links, computed in the browser (no libraries).
  function drawMap(pages) {
    var box = $("au-map"), urls = pages.map(function (r) { return r.url; }).slice(0, 250), index = {};
    urls.forEach(function (u, i) { index[u] = i; });
    var edges = [], inDeg = urls.map(function () { return 0; });
    urls.forEach(function (u, i) { var src = state.inbound.get(u); if (src) src.forEach(function (f) { if (index[f] != null && index[f] !== i) { edges.push([index[f], i]); inDeg[i]++; } }); });
    var W = 900, H = 600, n = urls.length;
    if (!n) { box.innerHTML = "<p>No pages to map.</p>"; return; }
    var P = urls.map(function (u, i) { var a = i * 2.39996, r = 20 * Math.sqrt(i + 1); return { x: W / 2 + r * Math.cos(a), y: H / 2 + r * Math.sin(a), vx: 0, vy: 0 }; });
    var damp = Math.max(1, edges.length / n), k = Math.sqrt(W * H / n) * 0.55, iters = n > 150 ? 220 : 320;
    for (var it = 0; it < iters; it++) {
      var t = 1 - it / iters;
      for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
        var dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d2 = dx * dx + dy * dy + 0.01, f = k * k / d2;
        P[i].vx += dx * f; P[i].vy += dy * f; P[j].vx -= dx * f; P[j].vy -= dy * f;
      }
      edges.forEach(function (e) { var a = P[e[0]], b = P[e[1]], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01, f = d / k / damp; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f; });
      P.forEach(function (p) { p.vx += (W / 2 - p.x) * 0.02; p.vy += (H / 2 - p.y) * 0.02; var v = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1, cap = 30 * t + 1; p.x += p.vx / v * Math.min(v, cap); p.y += p.vy / v * Math.min(v, cap); p.vx = p.vy = 0; p.x = Math.max(12, Math.min(W - 12, p.x)); p.y = Math.max(12, Math.min(H - 12, p.y)); });
    }
    // fit the layout to the frame
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    P.forEach(function (p) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); });
    var sc = Math.min((W - 60) / Math.max(1, x1 - x0), (H - 60) / Math.max(1, y1 - y0));
    P.forEach(function (p) { p.x = 30 + (p.x - x0) * sc + (W - 60 - (x1 - x0) * sc) / 2; p.y = 30 + (p.y - y0) * sc + (H - 60 - (y1 - y0) * sc) / 2; });
    var home = urls.reduce(function (h, u, i) { var d = (state.seen.get(u) || {}).depth; return d === 0 ? i : h; }, -1);
    var colour = function (u, i) { var d = (state.seen.get(u) || {}).depth; return i === home ? "#0a6f6a" : !inDeg[i] ? "#cf222e" : d != null && d >= 4 ? "#d4a72c" : "#5b7fa6"; };
    var svg = '<svg viewBox="0 0 ' + W + " " + H + '" class="au-svg" role="img" aria-label="Site map of ' + n + ' pages" style="width:100%;height:auto;background:var(--card);border:1px solid var(--line);border-radius:12px">' +
      edges.map(function (e) { var a = P[e[0]], b = P[e[1]]; return '<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) + '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) + '" stroke="var(--line)" stroke-width="0.6"/>'; }).join("") +
      urls.map(function (u, i) { var r = Math.min(n > 100 ? 8 : 12, 3 + Math.sqrt(inDeg[i]) * 0.9); return '<a href="' + safeHref(u) + '" target="_blank" rel="noopener nofollow"><circle cx="' + P[i].x.toFixed(1) + '" cy="' + P[i].y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + colour(u, i) + '"><title>' + esc(short(u)) + " – " + inDeg[i] + " internal link" + (inDeg[i] === 1 ? "" : "s") + " in</title></circle></a>"; }).join("") + "</svg>";
    var orphans = urls.filter(function (u, i) { return !inDeg[i] && i !== home; });
    box.innerHTML = svg + '<p class="small">' + n + " pages, " + edges.length + " internal links." + (orphans.length ? " " + orphans.length + " orphan page" + (orphans.length === 1 ? "" : "s") + ": " + orphans.slice(0, 10).map(function (u) { return esc(short(u)); }).join(", ") + (orphans.length > 10 ? "…" : "") : " No orphan pages.") + " Hover over a dot to see the page; click to open it.</p>";
  }

  function render(all, html, issues, score) {
    var pg = $("au-progress"); if (pg) pg.remove();
    var errors = all.filter(function (r) { return r.status >= 400 || r.status === 0; }).length;
    var avg = html.length ? Math.round(html.reduce(function (t, r) { return t + (r.ms || 0); }, 0) / html.length) : 0;
    var col = score >= 90 ? "#1a7f37" : score >= 70 ? "#9a6700" : "#cf222e";
    var depthMax = 0; state.seen.forEach(function (s, u) { if (state.results.has(u) && s.depth != null) depthMax = Math.max(depthMax, s.depth); });
    var counts = { critical: 0, high: 0, medium: 0, low: 0 }; issues.forEach(function (i) { counts[i.sev]++; });
    var h = '<div class="print-only au-brand"><strong>' + esc(BRAND) + "</strong> · Website audit of " + esc(state.host) + " · " + esc(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })) + "</div>" +
      (state.error ? '<div class="card" style="margin-bottom:14px"><p><strong>The crawl stopped early:</strong> ' + esc(state.error) + " The results below cover the pages checked so far.</p></div>" : "") +
      '<div class="ck-head"><div class="ring" style="--p:' + score + ";--c:" + col + '" role="img" aria-label="Site score ' + score + ' out of 100"><div><span><b>' + score + "</b><small>site score</small></span></div></div><div>" +
      '<div class="vit"><div><small>Pages checked</small><b>' + all.length + '</b></div><div><small>Errors</small><b class="' + (errors ? "s-fail" : "s-pass") + '">' + errors + "</b></div><div><small>Avg response</small><b>" + (avg / 1000).toFixed(2) + " s</b></div><div><small>Deepest page</small><b>" + depthMax + " clicks</b></div></div>" +
      '<div class="ck-stats">' + ["critical", "high", "medium", "low"].map(function (s) { return '<span class="pill">' + counts[s] + " " + s + "</span>"; }).join("") + (state.stopped ? '<span class="pill s-warn">Stopped early</span>' : "") + (all.length >= MAX ? '<span class="pill">Reached the ' + MAX + "-page limit</span>" : "") + "</div></div></div>" +
      '<div class="row noprint" style="margin:18px 0"><button type="button" class="btn" id="au-print">Download PDF report</button><button type="button" class="btn ghost" id="au-csv">Download CSV of all pages</button></div>' +
      "<h2>Issues to fix</h2>" + (issues.length ? issues.map(function (i, n) {
        return '<details class="au-issue"' + (n < 3 ? " open" : "") + '><summary><span class="imp sev-' + i.sev + '">' + i.sev + "</span> " + esc(i.title) + (i.site ? "" : ' <span class="small">· ' + i.pages.length + " page" + (i.pages.length === 1 ? "" : "s") + "</span>") + '</summary><p class="fix"><strong>Fix:</strong> ' + esc(i.fix) + "</p>" +
          (i.pages.length ? '<ul class="au-urls">' + i.pages.slice(0, 50).map(function (p) { return '<li><a href="' + safeHref(p[0]) + '" target="_blank" rel="noopener nofollow">' + esc(short(p[0])) + '</a> <span class="small">' + esc(p[1]) + "</span></li>"; }).join("") + (i.pages.length > 50 ? '<li class="small">…and ' + (i.pages.length - 50) + " more (see the CSV)</li>" : "") + "</ul>" : "") + "</details>";
      }).join("") : "<p>No site-wide issues found – excellent.</p>") +
      '<h2>All pages</h2><div class="tablewrap"><table class="au-table"><thead><tr><th>Page</th><th>Status</th><th>Title</th><th>Words</th><th>Depth</th><th>Time</th></tr></thead><tbody>' +
      all.slice().sort(function (a, b) { return a.url < b.url ? -1 : a.url > b.url ? 1 : 0; }).map(function (r) { var d = (state.seen.get(r.url) || {}).depth; return '<tr><td><a href="' + safeHref(r.url) + '" target="_blank" rel="noopener nofollow">' + esc(short(r.url)) + '</a></td><td class="' + (r.status === 200 ? "s-pass" : r.status >= 300 && r.status < 400 ? "s-warn" : "s-fail") + '">' + esc(r.status || r.error) + "</td><td>" + esc(String(r.title || r.type || (r.redirect && ("→ " + short(r.redirect))) || "").slice(0, 70)) + "</td><td>" + esc(r.words != null ? r.words : "") + "</td><td>" + (d == null ? "–" : esc(d)) + "</td><td>" + (typeof r.ms === "number" ? (r.ms / 1000).toFixed(2) + "s" : "") + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<h2 class="noprint">Visual site map</h2><p class="noprint small">How your pages link together. Bigger dots have more internal links pointing at them. <span style="color:#cf222e">●</span> orphan (nothing links to it) · <span style="color:#d4a72c">●</span> 4+ clicks deep · <span style="color:#0a6f6a">●</span> home page</p><div class="noprint"><button type="button" class="btn ghost" id="au-map-btn">Show interactive site map</button><div id="au-map"></div></div>' +
      '<p class="small">Crawled ' + all.length + " URLs in " + Math.round((Date.now() - state.startedAt) / 1000) + " s, following links from the home page and the XML sitemap" + (state.blocked.size ? "; " + state.blocked.size + " URL(s) were skipped because robots.txt disallows them" : ", respecting robots.txt") + ". Scores are a guide, not a guarantee of rankings.</p>";
    $("au-report").innerHTML = h;
    $("au-map-btn").onclick = function () { this.remove(); drawMap(html); };
    $("au-print").onclick = function () { document.querySelectorAll(".au-issue").forEach(function (d) { d.open = true; }); window.print(); };
    $("au-csv").onclick = function () {
      var rows = [["url", "status", "redirect", "title", "title_px", "description", "h1", "words", "depth", "ms", "noindex", "canonical", "images_no_alt", "json_ld", "inbound_links", "in_sitemap"]];
      all.forEach(function (r) { var s = state.seen.get(r.url) || {}; rows.push([r.url, r.status || r.error, r.redirect || "", r.title || "", r.titlePx || "", r.desc || "", (r.h1 || []).join(" | "), r.words != null ? r.words : "", s.depth == null ? "" : s.depth, r.ms != null ? r.ms : "", r.noindex ? "yes" : "", r.canonical || "", r.imgsNoAlt || 0, r.ld || 0, state.inbound.has(r.url) ? state.inbound.get(r.url).size : 0, state.sitemap.has(r.url) ? "yes" : ""]); });
      // neutralise spreadsheet formulas (CSV injection): text starting with = + - @ tab or CR gets a leading apostrophe
      var cell = function (c) { c = String(c == null ? "" : c); if (typeof c === "string" && /^[=+\-@\t\r]/.test(c) && !/^-?\d+(\.\d+)?$/.test(c)) c = "'" + c; return /[",\n\r]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; };
      var csv = rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })); a.download = state.host + "-audit.csv"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
    };
    window.addEventListener("beforeprint", function () { document.querySelectorAll(".au-issue").forEach(function (d) { d.open = true; }); });
  }
}
