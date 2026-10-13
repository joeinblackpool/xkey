// Browser code for the newer tools (served as /assets/pro.js): rank tracker (rk-), SEO content editor
// (ce-), backlink audit (ba-), competitor ad checker (ad-), brand monitor (bm-) and the analytics
// dashboard (an-). Served from Function#toString, so no bundler helpers; each tool only starts when
// its elements are on the page.
export function proApp() {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var num = function (n) { return Number(n || 0).toLocaleString("en-GB"); };
  var getJson = function (u) { return fetch(u).then(function (r) { return r.json().then(function (j) { if (!r.ok && !j.error) j.error = "HTTP " + r.status; return j; }); }); };
  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } } };
  var download = function (name, text, type) { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: type || "text/plain" })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  var bars = function (rows, label) {
    if (!rows || !rows.length) return '<p class="small">Nothing yet.</p>';
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }));
    return '<div class="tablewrap"><table><thead><tr><th>' + esc(label) + '</th><th style="width:45%">Share</th><th>Count</th></tr></thead><tbody>' + rows.map(function (r) {
      return "<tr><td style=\"overflow-wrap:anywhere\">" + esc(r.name || "(none)") + '</td><td><div class="meter" style="margin:0"><span style="width:' + Math.max(2, r.n / max * 100) + '%;background:var(--brand)"></span></div></td><td>' + num(r.n) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  };
  var STOP = {}; "a about above after again all also am an and any are as at be been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself get got also may might must one two use using used make made like just per via etc us".split(" ").forEach(function (w) { STOP[w] = 1; });
  var words = function (t) { return (String(t).toLowerCase().match(/[a-z0-9£][a-z0-9'’-]*/g) || []).map(function (w) { return w.replace(/['’]s$/, "").replace(/^-+|-+$/g, ""); }).filter(Boolean); };

  // ================= rank tracker (Search Console exports, kept in this browser)
  var rk = $("rk-go");
  if (rk) {
    var csvRows = function (text) {
      var rows = [], row = [], f = "", q = false, sep = text.indexOf("\t") > -1 && text.split("\n")[0].indexOf(",") < 0 ? "\t" : ",";
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
        else if (c === '"') q = true;
        else if (c === sep) { row.push(f); f = ""; }
        else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); if (row.join("").trim()) rows.push(row); row = []; f = ""; }
        else f += c;
      }
      row.push(f); if (row.join("").trim()) rows.push(row);
      return rows;
    };
    var pnum = function (s) { s = String(s == null ? "" : s).replace(/[%,\s]/g, ""); return s === "" ? null : Number(s); };
    // ZIP files from Search Console's "Download CSV": read the central directory, inflate each CSV.
    var unzip = function (buf) {
      var v = new DataView(buf), out = {}, jobs = [], e = buf.byteLength - 22;
      while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
      if (e < 0) return Promise.reject(new Error("That isn't a ZIP file."));
      var n = v.getUint16(e + 10, true), p = v.getUint32(e + 16, true), dec = new TextDecoder();
      for (var k = 0; k < n; k++) {
        var method = v.getUint16(p + 10, true), size = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true);
        var name = dec.decode(new Uint8Array(buf, p + 46, nl));
        var start = off + 30 + v.getUint16(off + 26, true) + v.getUint16(off + 28, true), data = new Uint8Array(buf, start, size);
        (function (name, method, data) {
          if (!/\.csv$/i.test(name)) return;
          if (method === 0) { out[name] = dec.decode(data); return; }
          if (method !== 8 || typeof DecompressionStream === "undefined") return;
          jobs.push(new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text().then(function (t) { out[name] = t; }));
        })(name, method, data);
        p += 46 + nl + xl + cl;
      }
      return Promise.all(jobs).then(function () { return out; });
    };
    var readFiles = function (files) {
      return Promise.all([].map.call(files, function (f) {
        return f.arrayBuffer().then(function (b) {
          if (new Uint8Array(b, 0, 2)[0] === 0x50 && new Uint8Array(b, 0, 2)[1] === 0x4b) return unzip(b);
          var o = {}; o[f.name] = new TextDecoder().decode(b); return o;
        });
      })).then(function (list) { return Object.assign.apply(null, [{}].concat(list)); });
    };
    // Turn the export's tables into { rows: [{ q, c, i, pos, prev }], region, period, dates }
    var parseExport = function (tables) {
      var res = { rows: [], region: "", period: "", dates: [] };
      Object.keys(tables).forEach(function (name) {
        var t = csvRows(tables[name].replace(/^﻿/, ""));
        if (!t.length) return;
        var h = t[0].map(function (x) { return x.trim(); }), col = function (re, nth) { var hits = []; h.forEach(function (x, i) { if (re.test(x)) hits.push(i); }); return hits[nth || 0]; };
        if (/^filter$/i.test(h[0])) { t.slice(1).forEach(function (r) { if (/country/i.test(r[0])) res.region = r[1]; if (/date/i.test(r[0])) res.period = r[1]; }); return; }
        if (/^date$/i.test(h[0]) && col(/position/i) != null) { var dp = col(/position/i); res.dates = t.slice(1).map(function (r) { return { d: r[0], pos: pnum(r[dp]) }; }).filter(function (r) { return r.pos != null; }).sort(function (a, b) { return a.d < b.d ? -1 : 1; }); return; }
        if (!/quer|keyword|search term/i.test(h[0]) || col(/position/i) == null) return;
        var ci = col(/click/i), ii = col(/impression/i), pi = col(/position/i), pp = col(/position/i, 1);
        res.rows = t.slice(1).map(function (r) { return { q: r[0].trim(), c: pnum(r[ci]) || 0, i: pnum(r[ii]) || 0, pos: pnum(r[pi]), prev: pp != null ? pnum(r[pp]) : null }; }).filter(function (r) { return r.q && r.pos; });
      });
      return res;
    };
    var SAMPLE = "Top queries,Last 28 days Clicks,Previous 28 days Clicks,Last 28 days Impressions,Previous 28 days Impressions,Last 28 days CTR,Previous 28 days CTR,Last 28 days Position,Previous 28 days Position\nemergency plumber blackpool,41,30,620,540,6.6%,5.6%,3.2,4.8\nplumber blackpool,22,25,1900,2100,1.2%,1.2%,8.4,7.1\nboiler repair blackpool,9,2,410,300,2.2%,0.7%,6.9,14.2\nblocked drain lytham,3,0,150,40,2%,0%,11.5,24\nbathroom fitters fylde,0,1,90,120,0%,0.8%,18.3,16.9";
    var render = function (snap, hist, label) {
      var rows = snap.rows.slice().sort(function (a, b) { return b.i - a.i; });
      var prevSnap = hist.length > 1 ? hist[hist.length - 2] : null, prevMap = {};
      if (prevSnap) prevSnap.rows.forEach(function (r) { prevMap[r[0]] = r[3]; });
      rows.forEach(function (r) { if (r.prev == null && prevSnap) r.prev = prevMap[r.q] == null ? null : prevMap[r.q]; r.ch = r.prev != null ? Math.round((r.prev - r.pos) * 10) / 10 : null; });
      var top3 = rows.filter(function (r) { return r.pos <= 3.5; }).length, top10 = rows.filter(function (r) { return r.pos <= 10.5; }).length, strike = rows.filter(function (r) { return r.pos > 10.5 && r.pos <= 20.5; }).length;
      var up = rows.filter(function (r) { return r.ch >= 1; }).length, down = rows.filter(function (r) { return r.ch <= -1; }).length;
      var chart = "";
      if (snap.dates.length > 2) {
        var W = 640, H = 150, ps = snap.dates.map(function (d) { return d.pos; }), lo = Math.min.apply(null, ps), hi = Math.max.apply(null, ps), span = Math.max(1, hi - lo);
        chart = '<h3>Average position, day by day</h3><svg class="mchart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Average position from ' + ps[0] + " to " + ps[ps.length - 1] + '"><polyline class="ml1" fill="none" stroke-width="2" points="' + snap.dates.map(function (d, i) { return (i * W / (snap.dates.length - 1)).toFixed(1) + "," + (10 + (d.pos - lo) / span * (H - 30)).toFixed(1); }).join(" ") + '"/><text x="0" y="' + (H - 2) + '" class="mt">' + esc(snap.dates[0].d) + '</text><text x="' + W + '" y="' + (H - 2) + '" text-anchor="end" class="mt">' + esc(snap.dates[snap.dates.length - 1].d) + '</text></svg><p class="small">Higher on the chart = closer to the top of Google (position ' + lo.toFixed(1) + " to " + hi.toFixed(1) + ").</p>";
      }
      var histOf = function (q) { return hist.map(function (s) { var r = s.rows.filter(function (x) { return x[0] === q; })[0]; return r ? r[3] : null; }).filter(function (x) { return x != null; }); };
      var filter = "all", show = function () {
        var list = rows.filter(function (r) { return filter === "all" || (filter === "up" && r.ch >= 1) || (filter === "down" && r.ch <= -1) || (filter === "near" && r.pos > 10.5 && r.pos <= 20.5) || (filter === "top" && r.pos <= 3.5); }).slice(0, 500);
        $("rk-table").innerHTML = '<div class="tablewrap"><table><thead><tr><th>Search</th><th>Position</th><th>Change</th><th>Clicks</th><th>Impressions</th>' + (hist.length > 1 ? "<th>History</th>" : "") + "</tr></thead><tbody>" + list.map(function (r) {
          var ch = r.ch == null ? "–" : r.ch > 0 ? '<span style="color:#1a7f37">▲ ' + r.ch + "</span>" : r.ch < 0 ? '<span style="color:#cf222e">▼ ' + -r.ch + "</span>" : "=";
          return "<tr><td>" + esc(r.q) + "</td><td><strong>" + r.pos.toFixed(1) + "</strong></td><td>" + ch + "</td><td>" + num(r.c) + "</td><td>" + num(r.i) + "</td>" + (hist.length > 1 ? '<td class="small">' + histOf(r.q).map(function (p) { return Number(p).toFixed(1); }).join(" → ") + "</td>" : "") + "</tr>";
        }).join("") + "</tbody></table></div>" + (list.length ? "" : '<p class="small">No searches in this view.</p>');
      };
      $("rk-out").innerHTML = '<h2>Rankings for ' + esc(label) + "</h2>" +
        '<p>' + num(rows.length) + " searches · <strong>" + top3 + "</strong> in the top 3 · <strong>" + top10 + "</strong> on page one · <strong>" + strike + "</strong> on page two (positions 11–20, the quickest wins)" + (up + down ? " · " + up + " up, " + down + " down" : "") + "</p>" +
        (snap.period ? '<p class="small">Period: ' + esc(snap.period) + "</p>" : "") + chart +
        '<div class="row" role="group" aria-label="Filter">' + [["all", "All"], ["top", "Top 3"], ["near", "Page two"], ["up", "Moved up"], ["down", "Moved down"]].map(function (f) { return '<button type="button" class="btn" data-f="' + f[0] + '" style="padding:8px 14px">' + f[1] + "</button>"; }).join("") + '<button type="button" class="btn" id="rk-csv" style="padding:8px 14px">Download CSV</button></div><div id="rk-table"></div>' +
        '<p class="small">Saved in this browser only (' + hist.length + " snapshot" + (hist.length === 1 ? "" : "s") + " for " + esc(label) + '). Upload a new export each week to build a ranking history. <button type="button" id="rk-clear" class="btn" style="padding:6px 12px;background:#cf222e">Delete saved history</button></p>';
      [].forEach.call(document.querySelectorAll("#rk-out [data-f]"), function (b) { b.addEventListener("click", function () { filter = b.getAttribute("data-f"); show(); }); });
      $("rk-csv").addEventListener("click", function () { download("rankings.csv", "Search,Position,Change,Clicks,Impressions\n" + rows.map(function (r) { return ['"' + r.q.replace(/"/g, '""') + '"', r.pos, r.ch == null ? "" : r.ch, r.c, r.i].join(","); }).join("\n"), "text/csv"); });
      $("rk-clear").addEventListener("click", function () { var all = store.get("xk-rank", {}); delete all[label]; store.set("xk-rank", all); $("rk-out").innerHTML = "<p>Saved history deleted.</p>"; });
      show();
    };
    var go = function (tables) {
      var snap = parseExport(tables);
      if (!snap.rows.length) { $("rk-out").innerHTML = '<p class="small" style="color:#cf222e">No search queries found. In Search Console open Performance → Search results, choose the Queries tab, then Export → Download CSV and upload the ZIP here.</p>'; return; }
      var site = ($("rk-site").value.trim() || "My site").toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, ""), region = $("rk-region").value.trim() || snap.region || "All countries";
      var label = site + " · " + region, all = store.get("xk-rank", {}), hist = all[label] || [];
      hist.push({ t: Date.now(), period: snap.period, rows: snap.rows.slice(0, 1000).map(function (r) { return [r.q, r.c, r.i, r.pos]; }) });
      all[label] = hist.slice(-30);
      if (!store.set("xk-rank", all)) { all[label] = hist.slice(-10); store.set("xk-rank", all); }
      render(snap, all[label], label);
    };
    rk.addEventListener("click", function () {
      var files = $("rk-file").files, pasted = $("rk-paste").value.trim();
      $("rk-out").innerHTML = "<p>Reading…</p>";
      (files && files.length ? readFiles(files) : Promise.resolve(pasted ? { "Queries.csv": pasted } : null)).then(function (t) {
        if (!t) { $("rk-out").innerHTML = '<p class="small" style="color:#cf222e">Choose your Search Console export, or paste the table.</p>'; return; }
        go(t);
      }).catch(function (e) { $("rk-out").innerHTML = '<p class="small" style="color:#cf222e">' + esc(e.message || "Couldn't read that file.") + "</p>"; });
    });
    $("rk-demo").addEventListener("click", function () { $("rk-site").value = "example-plumber.co.uk"; $("rk-region").value = "United Kingdom"; go({ "Queries.csv": SAMPLE }); });
  }

  // ================= SEO content editor
  var ed = $("ce-ed");
  if (ed) {
    var guide = { words: 800, terms: [], questions: [], comps: 0 };
    var syll = function (w) { w = w.replace(/e$/, ""); var m = w.match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); };
    var kwWords = function () { return words($("ce-kw").value).filter(function (w) { return !STOP[w]; }); };
    var defaultQuestions = function (kw) { return kw ? ["What is " + kw + "?", "How much does " + kw + " cost?", "How long does " + kw + " take?", "How do I choose " + kw + "?", "Is " + kw + " worth it?"] : []; };
    var termsFrom = function (pages, kw) {
      var df = {}, tf = {}, mine = {}; kw.forEach(function (w) { mine[w] = 1; });
      pages.forEach(function (p) {
        var ws = words(p.text), seen = {};
        for (var i = 0; i < ws.length; i++) {
          var grams = [ws[i]]; if (i + 1 < ws.length) grams.push(ws[i] + " " + ws[i + 1]);
          grams.forEach(function (g) {
            var parts = g.split(" "); if (parts.some(function (x) { return STOP[x] || x.length < 3 || /^\d+$/.test(x); })) return;
            tf[g] = (tf[g] || 0) + 1; if (!seen[g]) { seen[g] = 1; df[g] = (df[g] || 0) + 1; }
          });
        }
      });
      var need = pages.length > 1 ? 2 : 1;
      return Object.keys(df).filter(function (g) { return df[g] >= need && !(g.indexOf(" ") < 0 && mine[g]) && tf[g] >= 2; })
        .sort(function (a, b) { return df[b] * Math.log(1 + tf[b]) * (b.indexOf(" ") > 0 ? 1.6 : 1) - df[a] * Math.log(1 + tf[a]) * (a.indexOf(" ") > 0 ? 1.6 : 1); })
        .slice(0, 30).map(function (g) { return { t: g, n: Math.max(1, Math.round(tf[g] / pages.length)) }; });
    };
    var analyse = function () {
      var kw = $("ce-kw").value.trim().toLowerCase(), title = $("ce-title").value.trim(), text = ed.innerText || "", ws = words(text), n = ws.length;
      var heads = [].map.call(ed.querySelectorAll("h1,h2,h3,h4"), function (h) { return h.textContent.toLowerCase(); });
      var low = " " + ws.join(" ") + " ", kwl = words(kw).join(" "), count = kwl ? (low.split(" " + kwl + " ").length - 1) : 0;
      var dens = n && kwl ? count * kwl.split(" ").length / n * 100 : 0;
      var sentences = text.split(/[.!?]+\s|\n+/).filter(function (s) { return words(s).length > 2; }), avgSent = sentences.length ? n / sentences.length : 0;
      var syl = ws.reduce(function (a, w) { return a + syll(w); }, 0), flesch = n && sentences.length ? Math.round(206.835 - 1.015 * avgSent - 84.6 * syl / n) : 0;
      var inFirst = kwl && (" " + ws.slice(0, 100).join(" ") + " ").indexOf(" " + kwl + " ") > -1;
      var termHits = guide.terms.map(function (t) { var c = low.split(" " + t.t + " ").length - 1; return { t: t.t, want: Math.max(1, Math.round(t.n * Math.max(n, 300) / Math.max(guide.words, 300))), c: c }; });
      var used = termHits.filter(function (t) { return t.c > 0; }).length;
      var qs = (guide.questions.length ? guide.questions : defaultQuestions(kw)).map(function (q) {
        var key = words(q).filter(function (w) { return !STOP[w]; });
        var hit = heads.some(function (h) { var hw = words(h); return key.length && key.filter(function (w) { return hw.indexOf(w) > -1; }).length / key.length >= 0.6; });
        return { q: q, ok: hit };
      });
      var qOk = qs.filter(function (q) { return q.ok; }).length, qNeed = Math.ceil(qs.length / 2), wNeed = Math.max(1, guide.words * 0.8), tNeed = guide.terms.length * 0.6;
      // [passed, points, label, part-points when not passed]
      var checks = [
        [!!kwl && title.toLowerCase().indexOf(kwl) > -1, 10, "Main keyword in the page title"],
        [title.length >= 30 && title.length <= 60, 5, "Title between 30 and 60 characters (now " + title.length + ")"],
        [!!kwl && heads.some(function (h) { return words(h).join(" ").indexOf(kwl) > -1; }), 10, "Main keyword in a heading"],
        [!!inFirst, 10, "Main keyword in the first 100 words"],
        [dens >= 0.4 && dens <= 2.5, 10, "Keyword used naturally: " + dens.toFixed(1) + "% of words (aim for 0.5–2.5%)"],
        [n >= wNeed, 15, num(n) + " words – aim for about " + num(guide.words) + (guide.comps ? " (the competing pages' typical length)" : ""), 15 * n / wNeed],
        [guide.terms.length > 0 && used >= tNeed, 20, guide.terms.length ? used + " of " + guide.terms.length + " related terms used" : "Add competing pages above to get related terms", tNeed ? 20 * used / tNeed : 0],
        [qs.length > 0 && qOk >= qNeed, 10, "Common questions answered under their own headings (" + qOk + " of " + qs.length + ")", qNeed ? 10 * qOk / qNeed : 0],
        [flesch >= 50, 5, "Easy to read: reading ease " + flesch + " (aim for 50+)"],
        [avgSent > 0 && avgSent <= 20, 5, "Short sentences: " + avgSent.toFixed(0) + " words on average (aim for under 20)"],
      ];
      var score = Math.round(checks.reduce(function (a, c) { return a + (c[0] ? c[1] : Math.min(c[1], c[3] || 0)); }, 0));
      var colour = score >= 75 ? "#1a7f37" : score >= 50 ? "#9a6700" : "#cf222e";
      $("ce-out").innerHTML = '<h2>Content score: <span style="color:' + colour + '">' + score + "/100</span></h2>" +
        '<div class="meter" role="img" aria-label="Score ' + score + ' of 100"><span style="width:' + score + "%;background:" + colour + '"></span></div>' +
        "<ul>" + checks.map(function (c) { return "<li>" + (c[0] ? "✅ " : "⬜ ") + esc(c[2]) + "</li>"; }).join("") + "</ul>" +
        (termHits.length ? "<h3>Related terms</h3><p class=\"small\">Words and phrases the competing pages use. Work in the ones that fit naturally – never stuff them.</p><p>" + termHits.map(function (t) { var ok = t.c >= t.want; return '<span style="display:inline-block;margin:3px;padding:4px 10px;border-radius:999px;font-size:14px;background:' + (ok ? "#dcf1e3" : t.c ? "#fff4d6" : "var(--bg)") + ";border:1px solid var(--line);color:#0e1726\">" + esc(t.t) + " " + t.c + "/" + t.want + "</span>"; }).join("") + "</p>" : "") +
        (qs.length ? "<h3>Questions to answer</h3><ul>" + qs.map(function (q) { return "<li>" + (q.ok ? "✅ " : "⬜ ") + esc(q.q) + "</li>"; }).join("") + "</ul>" : "");
      store.set("xk-editor", { kw: $("ce-kw").value, title: title, html: ed.innerHTML.slice(0, 200000), guide: guide });
    };
    var t0; var later = function () { clearTimeout(t0); t0 = setTimeout(analyse, 250); };
    ["ce-kw", "ce-title"].forEach(function (id) { $(id).addEventListener("input", later); });
    ed.addEventListener("input", later);
    var saved = store.get("xk-editor", null);
    if (saved) { $("ce-kw").value = saved.kw || ""; $("ce-title").value = saved.title || ""; var tmp = document.createElement("div"); tmp.innerHTML = saved.html || ""; [].forEach.call(tmp.querySelectorAll("script,style,iframe,object,embed"), function (x) { x.remove(); }); [].forEach.call(tmp.querySelectorAll("*"), function (x) { [].slice.call(x.attributes).forEach(function (a) { if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) x.removeAttribute(a.name); }); }); ed.innerHTML = tmp.innerHTML; if (saved.guide) guide = saved.guide; }
    $("ce-load").addEventListener("click", function () {
      var kw = $("ce-kw").value.trim(), urls = $("ce-comp").value.split(/\s+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 5);
      if (!kw) { $("ce-status").textContent = "Enter your main keyword first."; return; }
      if (!urls.length) { guide = { words: 800, terms: [], questions: defaultQuestions(kw.toLowerCase()), comps: 0 }; $("ce-status").textContent = "Using general guidelines. Add the top-ranking pages for your keyword to get related terms and a target length."; analyse(); return; }
      $("ce-status").textContent = "Reading " + urls.length + " page" + (urls.length > 1 ? "s" : "") + "…";
      Promise.all(urls.map(function (u) { return getJson("/api/page?url=" + encodeURIComponent(u)).catch(function () { return { error: "failed" }; }); })).then(function (pages) {
        var ok = pages.filter(function (p) { return !p.error && p.text; });
        if (!ok.length) { $("ce-status").textContent = "Couldn't read those pages – check the addresses."; return; }
        var lens = ok.map(function (p) { return p.words || words(p.text).length; }).sort(function (a, b) { return a - b; });
        var qs = []; ok.forEach(function (p) { (p.text.match(/[A-Z][^.!?\n]{10,90}\?/g) || []).forEach(function (q) { if (qs.indexOf(q) < 0) qs.push(q.trim()); }); });
        guide = { words: Math.max(300, Math.round(lens[Math.floor(lens.length / 2)] / 50) * 50), terms: termsFrom(ok, kwWords()), questions: (qs.slice(0, 6).length >= 3 ? qs.slice(0, 6) : qs.concat(defaultQuestions(kw.toLowerCase())).slice(0, 6)), comps: ok.length };
        $("ce-status").textContent = "Guidelines from " + ok.length + " competing page" + (ok.length > 1 ? "s" : "") + (pages.length > ok.length ? " (" + (pages.length - ok.length) + " couldn't be read)" : "") + ".";
        analyse();
      });
    });
    $("ce-copy").addEventListener("click", function () { var h = ed.innerHTML; if (navigator.clipboard) navigator.clipboard.writeText(h); $("ce-status").textContent = "HTML copied – paste it into your website's editor (HTML or code view)."; });
    analyse();
  }

  // ================= backlink audit: risky linking sites, anchor text, disavow file
  var baf = $("ba-form");
  if (baf) {
    var SPAM_TLD = /\.(xyz|top|click|loan|work|gq|tk|ml|cf|ga|icu|buzz|rest|monster|cyou|sbs|cfd|bond|win|bid|review|date|racing|download|stream|trade|party|science|men|webcam|kim|country|cricket|accountant|faith|zip|mov|su|pw)$/;
    var SPAM_WORD = /casino|betting|\bbet|poker|slot|porn|xxx|sex|escort|viagra|cialis|pharma|pills|payday|loan|essay|crypto|forex|replica|hack|crack|torrent|adult/;
    var SCHEME = /seo|backlink|links?(?:directory|dir)|directory|bookmark|rank|webdir|linkfarm|article(?:s|base|directory)|freelisting|addurl|submit/;
    var riskOf = function (d, s) {
      var why = [], score = 0, label = d.split(".")[0];
      if (SPAM_TLD.test(d)) { score += 40; why.push("spam-prone ending"); }
      if (SPAM_WORD.test(d)) { score += 50; why.push("gambling/adult/pharma words"); }
      if (SCHEME.test(d)) { score += 30; why.push("looks like a link directory or SEO site"); }
      if ((label.match(/-/g) || []).length >= 3 || (label.match(/\d/g) || []).length >= 4) { score += 20; why.push("machine-made name"); }
      if (label.length > 25) { score += 10; why.push("very long name"); }
      if (s < 5) { score += 15; why.push("almost no links of its own"); }
      return { score: score, level: score >= 50 ? "High" : score >= 25 ? "Medium" : "Low", why: why };
    };
    var kind = function (t, dom, brand) {
      var x = t.toLowerCase().trim();
      if (!x) return "Empty or image";
      if (x.indexOf(dom) > -1 || /^https?:|^www\./.test(x)) return "Web address";
      if (brand && x.replace(/[^a-z0-9]/g, "").indexOf(brand) > -1) return "Brand";
      if (/^(click here|here|this|website|link|read more|more|visit|visit site|homepage|home|source|this site|view|learn more)$/.test(x)) return "Generic";
      return "Keyword or phrase";
    };
    baf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var out = $("ba-out"), d = $("ba-url").value.trim();
      out.innerHTML = "<p>Looking up links…</p>";
      getJson("/api/backlinks?d=" + encodeURIComponent(d)).then(function (r) {
        if (r.error) { out.innerHTML = '<p class="small" style="color:#cf222e">' + esc(r.error) + "</p>"; return; }
        var y = r.you;
        if (!y.found) { out.innerHTML = "<p>No links to <strong>" + esc(y.domain) + "</strong> were found in " + esc(r.months || "the latest crawl") + ". New sites often aren't linked yet – nothing risky to audit.</p>"; return; }
        var brand = y.domain.split(".")[0].replace(/[^a-z0-9]/g, "");
        var list = y.linkers.map(function (l) { return { d: l[0], s: l[1], risk: riskOf(l[0], l[1]) }; });
        var high = list.filter(function (l) { return l.risk.level === "High"; }), med = list.filter(function (l) { return l.risk.level === "Medium"; });
        out.innerHTML = "<h2>Backlink audit: " + esc(y.domain) + "</h2><p><strong>" + num(y.refDomains) + "</strong> linking websites · link strength <strong>" + y.strength + "/100</strong> · from " + esc(r.months || "Common Crawl") + ".</p>" +
          "<p>Of the " + list.length + " strongest linking sites: <strong style=\"color:#cf222e\">" + high.length + " high risk</strong>, <strong style=\"color:#9a6700\">" + med.length + " medium</strong>, " + (list.length - high.length - med.length) + " low.</p>" +
          '<div class="tablewrap"><table><thead><tr><th>Disavow</th><th>Linking site</th><th>Strength</th><th>Risk</th><th>Why</th></tr></thead><tbody>' + list.map(function (l, i) {
            return '<tr><td><input type="checkbox" class="ba-x" data-i="' + i + '"' + (l.risk.level === "High" ? " checked" : "") + ' aria-label="Disavow ' + esc(l.d) + '" style="width:24px;height:24px"></td><td>' + esc(l.d) + "</td><td>" + l.s + '</td><td style="color:' + (l.risk.level === "High" ? "#cf222e" : l.risk.level === "Medium" ? "#9a6700" : "#1a7f37") + '">' + l.risk.level + '</td><td class="small">' + esc(l.risk.why.join(", ") || "–") + "</td></tr>";
          }).join("") + "</tbody></table></div>" +
          '<h3>Anchor text</h3><div id="ba-anchors"><p>Reading the home pages of the strongest linking sites…</p></div>' +
          '<h3>Disavow file</h3><p class="small">Only use this if Google has sent you a manual action for unnatural links, or you know links were bought. Google ignores most spam links by itself, and disavowing good links can hurt.</p><textarea id="ba-dis" readonly style="min-height:120px"></textarea><p><button type="button" class="btn" id="ba-dl">Download disavow.txt</button></p>';
        var upd = function () { var picked = [].filter.call(document.querySelectorAll(".ba-x"), function (c) { return c.checked; }).map(function (c) { return "domain:" + list[+c.getAttribute("data-i")].d; }); $("ba-dis").value = "# Disavow file for " + y.domain + " made with XKey (xkey.co.uk)\n" + picked.join("\n"); };
        [].forEach.call(document.querySelectorAll(".ba-x"), function (c) { c.addEventListener("change", upd); }); upd();
        $("ba-dl").addEventListener("click", function () { download("disavow.txt", $("ba-dis").value); });
        // anchors: links to this site on the linking sites' home pages, 3 at a time
        var targets = list.slice(0, 15), found = [], done = 0, next = 0;
        var finish = function () {
          var counts = {}; found.forEach(function (a) { counts[a.k] = (counts[a.k] || 0) + 1; });
          var rows = Object.keys(counts).map(function (k) { return { name: k, n: counts[k] }; }).sort(function (a, b) { return b.n - a.n; });
          var kwShare = found.length ? (counts["Keyword or phrase"] || 0) / found.length : 0;
          $("ba-anchors").innerHTML = found.length ? bars(rows, "Anchor type") + (kwShare > 0.3 && found.length >= 5 ? '<p style="color:#cf222e">' + Math.round(kwShare * 100) + "% of anchors are keyword phrases. Natural profiles are mostly brand names and web addresses – lots of exact keyword anchors can look like bought links.</p>" : "<p>The mix looks natural: mostly brand names and web addresses.</p>") +
            '<div class="tablewrap"><table><thead><tr><th>Linking site</th><th>Anchor text</th><th>Type</th></tr></thead><tbody>' + found.map(function (a) { return "<tr><td>" + esc(a.d) + "</td><td>" + esc(a.t || "(none)") + (a.nf ? ' <span class="small">nofollow</span>' : "") + "</td><td>" + esc(a.k) + "</td></tr>"; }).join("") + '</tbody></table></div><p class="small">From the home pages of the ' + targets.length + " strongest linking sites. Links deeper inside those sites aren't read.</p>"
            : '<p class="small">No links to ' + esc(y.domain) + " on the home pages of the " + targets.length + " strongest linking sites – their links are on inner pages, which this audit doesn't read.</p>";
        };
        var pump = function () {
          if (next >= targets.length) return;
          var l = targets[next++];
          getJson("/api/page?url=" + encodeURIComponent("https://" + l.d + "/")).then(function (p) {
            (p.links || []).forEach(function (k) { var h = ""; try { h = new URL(k.h).hostname.replace(/^www\./, ""); } catch (e) {} if (h === y.domain || h.slice(-y.domain.length - 1) === "." + y.domain) found.push({ d: l.d, t: k.t, nf: /nofollow|sponsored|ugc/.test(k.rel), k: kind(k.t, y.domain, brand) }); });
          }).catch(function () {}).then(function () { done++; if (done === targets.length) finish(); else pump(); });
        };
        if (!targets.length) finish(); else for (var i = 0; i < 3; i++) pump();
      }).catch(function () { out.innerHTML = '<p class="small" style="color:#cf222e">The lookup failed – please try again.</p>'; });
    });
    var pre = new URLSearchParams(location.search).get("d");
    if (pre) { $("ba-url").value = pre; baf.requestSubmit ? baf.requestSubmit() : baf.dispatchEvent(new Event("submit")); }
  }

  // ================= competitor ad checker
  var adf = $("ad-form");
  if (adf) {
    var ADS = { "Google Ads": "Runs, or has run, Google search, Shopping or YouTube ads – this tag reports sales and leads back to Google Ads.", "Meta (Facebook) Pixel": "Advertises (or retargets) on Facebook and Instagram.", "Microsoft Advertising (Bing UET)": "Runs Bing and Microsoft search ads.", "LinkedIn Insight Tag": "Runs or plans LinkedIn ads – usually B2B.", "TikTok Pixel": "Advertises on TikTok.", "Pinterest Tag": "Advertises on Pinterest.", "X (Twitter) Pixel": "Advertises on X (Twitter).", "Snapchat Pixel": "Advertises on Snapchat.", "Criteo": "Uses Criteo retargeting ads – shows its products to past visitors around the web.", "Google AdSense": "Shows other people's ads on its site (earns from ads rather than buying them).", "Taboola": "Uses Taboola sponsored-content ads.", "Outbrain": "Uses Outbrain sponsored-content ads." };
    adf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var out = $("ad-out"), raw = $("ad-url").value.trim();
      var dom = raw.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, ""), brand = $("ad-brand").value.trim() || dom.split(".")[0];
      if (!dom) return;
      out.innerHTML = "<p>Checking " + esc(dom) + "…</p>";
      var q = encodeURIComponent(brand);
      var libs = [
        ["Google Ads Transparency Centre", "https://adstransparency.google.com/?region=GB&domain=" + encodeURIComponent(dom), "Every Google search, Shopping, YouTube and display ad the advertiser has run, with dates and regions."],
        ["Meta Ad Library", "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=GB&q=" + q + "&search_type=keyword_unordered", "Live Facebook and Instagram ads, with the creative, start date and versions."],
        ["LinkedIn Ad Library", "https://www.linkedin.com/ad-library/search?keyword=" + q, "Sponsored LinkedIn posts from the company page."],
        ["TikTok Ad Library", "https://library.tiktok.com/ads?region=all&adv_name=" + q, "TikTok ads shown in Europe, with reach and dates."],
        ["Google search (see live text ads)", "https://www.google.co.uk/search?q=" + q, "Search their brand and main services yourself – ads are marked 'Sponsored'."],
      ];
      getJson("/api/tech?url=" + encodeURIComponent(dom)).then(function (r) {
        var tech = r.tech || [], ads = tech.filter(function (t) { return t.cat === "ads"; }), gtm = tech.some(function (t) { return /Tag Manager/i.test(t.name); });
        out.innerHTML = "<h2>Ads: " + esc(dom) + "</h2>" + (r.error ? '<p class="small" style="color:#cf222e">' + esc(r.error) + " The ad libraries below still work.</p>" :
          (ads.length ? "<p>We found <strong>" + ads.length + "</strong> advertising tag" + (ads.length > 1 ? "s" : "") + " on their home page:</p><ul>" + ads.map(function (a) { return "<li><strong>" + esc(a.name) + "</strong> – " + esc(ADS[a.name] || "Advertising or tracking pixel.") + "</li>"; }).join("") + "</ul>" : "<p>No advertising tags on their home page." + (gtm ? " They use Google Tag Manager, which can load ad tags only after cookie consent – check the ad libraries below." : " They may not advertise, or load tags only after cookie consent.") + "</p>")) +
          "<h3>See their actual ads</h3><p class=\"small\">The ad platforms publish every ad by law or by their own rules. These links open each library already searched for " + esc(brand) + ".</p><ul>" + libs.map(function (l) { return '<li><a href="' + esc(l[1]) + '" target="_blank" rel="noopener nofollow">' + esc(l[0]) + "</a> – " + esc(l[2]) + "</li>"; }).join("") + "</ul>" +
          '<p class="small">Ad spend and keyword bids aren\'t public – Google and Meta don\'t publish them for UK advertisers, and tools that show them are estimating. Compare organic strength with the <a href="/backlink-checker">backlink checker</a> and <a href="/seo-comparison">competitor comparison</a>.</p>';
      }).catch(function () { out.innerHTML = '<p class="small" style="color:#cf222e">The check failed – please try again.</p>'; });
    });
  }

  // ================= brand monitor
  var bmf = $("bm-form");
  if (bmf) {
    bmf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var brand = $("bm-brand").value.trim(), dom = $("bm-site").value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
      if (!brand) return;
      var qb = '"' + brand + '"', not = dom ? " -site:" + dom : "", g = function (q, extra) { return "https://www.google.co.uk/search?q=" + encodeURIComponent(q) + (extra || ""); };
      var links = [
        ["Everywhere on Google, except your site", g(qb + not)],
        ["New this week", g(qb + not, "&tbs=qdr:w")],
        ["News stories", g(qb, "&tbm=nws")],
        ["Reviews and complaints", g(qb + " (reviews OR complaint OR scam)" + not)],
        ["Reddit and forums", g(qb + " (site:reddit.com OR site:mumsnet.com OR site:moneysavingexpert.com)")],
        ["Bing", "https://www.bing.com/search?q=" + encodeURIComponent(qb + not)],
        ["YouTube", "https://www.youtube.com/results?search_query=" + encodeURIComponent(qb)],
        ["Look-alike domains (possible impersonation)", g("intitle:" + qb + not)],
      ];
      $("bm-out").innerHTML = "<h2>Find mentions of " + esc(brand) + "</h2><ul>" + links.map(function (l) { return '<li><a href="' + esc(l[1]) + '" target="_blank" rel="noopener nofollow">' + esc(l[0]) + "</a></li>"; }).join("") + "</ul>" +
        '<h3>Get alerts automatically</h3><p><a class="btn" href="https://www.google.com/alerts?q=' + encodeURIComponent(qb + not) + '" target="_blank" rel="noopener nofollow">Set up a free Google Alert</a></p><p class="small">Google emails you when it finds new pages mentioning ' + esc(brand) + ". Choose \"As-it-happens\" and \"All results\".</p>" +
        (dom ? '<h3>Negative SEO and copied content</h3><ul><li><a href="/toxic-backlink-checker?d=' + encodeURIComponent(dom) + '">Audit the sites linking to ' + esc(dom) + "</a> for spam links.</li><li><a href=\"/plagiarism-checker\">Check whether your text has been copied</a>.</li><li><a href=\"/uptime-monitor\">Get an alert if your site goes down</a>.</li></ul>" : "");
      $("bm-check").hidden = false;
    });
    $("bm-go").addEventListener("click", function () {
      var brand = $("bm-brand").value.trim().toLowerCase(), dom = $("bm-site").value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
      var urls = $("bm-urls").value.split(/\s+/).filter(Boolean).slice(0, 20), out = $("bm-res");
      if (!brand || !urls.length) { out.innerHTML = '<p class="small">Enter your brand above and at least one page address.</p>'; return; }
      out.innerHTML = "<p>Checking " + urls.length + " page" + (urls.length > 1 ? "s" : "") + "…</p>";
      var res = [], next = 0, done = 0;
      var paint = function () {
        out.innerHTML = '<div class="tablewrap"><table><thead><tr><th>Page</th><th>Mentions you?</th><th>Links to you?</th><th>What to do</th></tr></thead><tbody>' + res.map(function (r) {
          var todo = r.error ? "Couldn't read the page" : r.mention && !r.link ? "<strong>Unlinked mention – ask them to add a link</strong>" : r.link ? (r.nofollow ? "Linked (nofollow) – fine" : "Linked – nothing to do") : "Not mentioned";
          return '<tr><td style="overflow-wrap:anywhere">' + esc(r.url) + "</td><td>" + (r.error ? "–" : r.mention ? "Yes" : "No") + "</td><td>" + (r.error ? "–" : r.link ? "Yes" : "No") + "</td><td>" + todo + "</td></tr>";
        }).join("") + "</tbody></table></div>";
      };
      var pump = function () {
        if (next >= urls.length) return;
        var u = urls[next++];
        getJson("/api/page?url=" + encodeURIComponent(u)).then(function (p) {
          if (p.error) { res.push({ url: u, error: true }); return; }
          var ls = (p.links || []).filter(function (k) { try { var h = new URL(k.h).hostname.replace(/^www\./, ""); return dom && (h === dom || h.slice(-dom.length - 1) === "." + dom); } catch (e) { return false; } });
          res.push({ url: u, mention: (p.text || "").toLowerCase().indexOf(brand) > -1 || (p.title || "").toLowerCase().indexOf(brand) > -1, link: ls.length > 0, nofollow: ls.length && ls.every(function (k) { return /nofollow|sponsored|ugc/.test(k.rel); }) });
        }).catch(function () { res.push({ url: u, error: true }); }).then(function () { done++; paint(); if (done < urls.length) pump(); });
      };
      for (var i = 0; i < 3; i++) pump();
    });
  }

  // ================= analytics dashboard
  var an = $("an-dash");
  if (an) {
    var secret = an.getAttribute("data-secret"), days = 7, timer;
    var load = function () {
      getJson("/api/analytics/" + secret + "?days=" + days).then(function (r) {
        if (r.error) { an.innerHTML = '<p class="small" style="color:#cf222e">' + esc(r.error) + "</p>"; return; }
        var s = r.series, W = 640, H = 160, max = Math.max(1, Math.max.apply(null, s.map(function (x) { return x.views; })));
        var bw = W / s.length;
        var chart = '<svg class="mchart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Pageviews per day">' + s.map(function (x, i) { var h = x.views / max * (H - 24); return '<rect x="' + (i * bw + 1).toFixed(1) + '" y="' + (H - 18 - h).toFixed(1) + '" width="' + Math.max(1, bw - 2).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="var(--brand)"><title>' + x.day + ": " + x.views + " views, " + x.visitors + " visitors</title></rect>"; }).join("") + '<text x="0" y="' + (H - 2) + '" class="mt">' + s[0].day + '</text><text x="' + W + '" y="' + (H - 2) + '" text-anchor="end" class="mt">' + s[s.length - 1].day + "</text></svg>";
        an.innerHTML = '<div class="row" role="group" aria-label="Period">' + [1, 7, 30, 90].map(function (d) { return '<button type="button" class="btn" data-d="' + d + '" style="padding:8px 14px' + (d === days ? "" : ";opacity:.6") + '">' + (d === 1 ? "Today" : d + " days") + "</button>"; }).join("") + "</div>" +
          '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">' + [["Live now", r.live, "visitors in the last 30 minutes"], ["Visitors", r.visitors, "unique per day"], ["Pageviews", r.views, ""], ["Conversions", r.conversions, r.conversionRate + "% of visitors"]].map(function (t) { return '<div class="card"><p class="small">' + t[0] + '</p><p class="ct" style="font-size:28px">' + num(t[1]) + '</p><p class="small">' + esc(t[2]) + "</p></div>"; }).join("") + "</div>" +
          chart + (r.capped ? '<p class="small">Some days reached the free limit of ' + num(r.cap) + " pageviews; visits above it weren't counted.</p>" : "") +
          "<h3>Top pages</h3>" + bars(r.pages, "Page") + "<h3>Where visitors came from</h3>" + bars(r.refs, "Website") + "<h3>Countries</h3>" + bars(r.countries, "Country") + "<h3>Devices</h3>" + bars(r.devices, "Device") +
          "<h3>Conversions (goals)</h3>" + bars(r.goals, "Goal") + "<h3>Outbound link clicks</h3>" + bars(r.outbound, "Website");
        [].forEach.call(an.querySelectorAll("[data-d]"), function (b) { b.addEventListener("click", function () { days = +b.getAttribute("data-d"); load(); }); });
      }).catch(function () {});
      clearTimeout(timer); timer = setTimeout(load, 30000);
    };
    load();
  }
}
