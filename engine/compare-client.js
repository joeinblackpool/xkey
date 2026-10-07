// Browser code for /seo-compare (served as /assets/compare.js). Runs a check for each site via
// /api/check (one request each, so each gets its own subrequest budget) and renders a scoreboard.
export function compareApp() {
  "use strict";
  var root = document.getElementById("compare");
  if (!root) return;
  var urls = JSON.parse(root.getAttribute("data-urls") || "[]");
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var host = function (u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };
  var col = function (s) { return s >= 90 ? "#1a7f37" : s >= 70 ? "#9a6700" : "#cf222e"; };
  var results = urls.map(function () { return null; });
  root.innerHTML = '<div class="vit">' + urls.map(function (u, i) { return '<div id="cmp-' + i + '"><small>' + (i ? "Competitor " + i : "Your site") + '</small><b>' + esc(host(u)) + '</b><small class="cmp-state">Checking…</small></div>'; }).join("") + '</div><div id="cmp-out"></div>';
  var pending = urls.length;
  urls.forEach(function (u, i) {
    fetch("/api/check?url=" + encodeURIComponent(u)).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || "HTTP " + r.status); return j; }); })
      .then(function (j) { results[i] = j; document.querySelector("#cmp-" + i + " .cmp-state").innerHTML = '<span style="color:' + col(j.score) + '">' + j.score + '/100</span>'; })
      .catch(function (e) { results[i] = { error: e.message, url: u }; document.querySelector("#cmp-" + i + " .cmp-state").innerHTML = '<span class="s-fail">' + esc(e.message) + '</span>'; })
      .then(function () { if (--pending === 0) render(); });
  });
  function render() {
    var ok = results.filter(function (r) { return r && !r.error; });
    if (!ok.length) { document.getElementById("cmp-out").innerHTML = "<p>None of the sites could be checked.</p>"; return; }
    var cats = []; ok.forEach(function (r) { r.categories.forEach(function (c) { if (!c.info && cats.indexOf(c.name) < 0) cats.push(c.name); }); });
    var row = function (label, vals, better) {
      var nums = vals.filter(function (v) { return typeof v === "number"; });
      var best = nums.length ? (better === "low" ? Math.min.apply(null, nums) : Math.max.apply(null, nums)) : null;
      return '<tr><th scope="row">' + esc(label) + '</th>' + vals.map(function (v) { return '<td' + (v === best && nums.length > 1 ? ' class="cmp-best"' : "") + '>' + (v == null ? "–" : typeof v === "number" ? v : esc(v)) + '</td>'; }).join("") + '</tr>';
    };
    var get = function (f) { return results.map(function (r) { return r && !r.error ? f(r) : null; }); };
    var catScore = function (r, n) { var c = r.categories.filter(function (c) { return c.name === n; })[0]; return c && !c.info ? c.score : null; };
    var h = '<div class="tablewrap"><table class="cmp"><thead><tr><th></th>' + results.map(function (r, i) { return '<th scope="col">' + (i ? "Competitor " + i : "You") + '<br><span class="small">' + esc(host(r.url)) + '</span></th>'; }).join("") + '</tr></thead><tbody>' +
      row("Overall SEO score", get(function (r) { return r.score; })) + row("AI search readiness", get(function (r) { return r.aiScore; })) +
      cats.filter(function (n) { return n !== "AI search readiness"; }).map(function (n) { return row(n, get(function (r) { return catScore(r, n); })); }).join("") +
      row("Words on page", get(function (r) { return r.facts.words; })) + row("Server response (ms)", get(function (r) { return r.facts.internal ? null : r.facts.ms; }), "low") +
      row("HTML size (kB)", get(function (r) { return Math.round(r.facts.bytes / 1024); }), "low") + row("Checks failed", get(function (r) { return r.counts.fail; }), "low") +
      '</tbody></table></div>';
    var me = results[0];
    if (me && !me.error) {
      var beat = [];
      results.slice(1).forEach(function (r, i) {
        if (!r || r.error) return;
        Object.keys(me.checks).forEach(function (k) { if (me.checks[k] !== "pass" && r.checks[k] === "pass") beat.push([k, host(r.url), me.checks[k]]); });
      });
      var seen = {}; beat = beat.filter(function (b) { if (seen[b[0]]) return false; seen[b[0]] = 1; return true; });
      var ahead = [];
      Object.keys(me.checks).forEach(function (k) { if (me.checks[k] === "pass" && results.slice(1).some(function (r) { return r && !r.error && r.checks[k] && r.checks[k] !== "pass"; })) ahead.push(k); });
      h += '<h2>Where competitors beat you</h2>' + (beat.length ? '<ul class="chg">' + beat.map(function (b) { return '<li><span class="s-fail">' + (b[2] === "fail" ? "✗" : "!") + '</span> <strong>' + esc(b[0]) + '</strong> <span class="small">– ' + esc(b[1]) + ' passes this</span></li>'; }).join("") + '</ul>' : "<p>Nowhere – you match or beat every competitor on every check.</p>") +
        '<h2>Where you\'re ahead</h2>' + (ahead.length ? '<ul class="chg">' + ahead.slice(0, 15).map(function (k) { return '<li><span class="s-pass">✓</span> ' + esc(k) + '</li>'; }).join("") + '</ul>' : "<p>No clear advantages yet.</p>") +
        '<p><a class="btn" href="/seo-checker?url=' + encodeURIComponent(me.url) + '">See your full report and fixes</a></p>';
    }
    h += '<p class="small">Each site is checked on the single page entered. Compare like with like – home page with home page. Scores are a guide, not a guarantee of rankings.</p>';
    h += '<div id="cmp-gap"></div>';
    document.getElementById("cmp-out").innerHTML = h;
    topicGap();
  }
  // Topic gap: phrases competitors use repeatedly that your page never mentions. Needs /api/page (XKey); skipped quietly elsewhere.
  function topicGap() {
    var box = document.getElementById("cmp-gap"); if (!box || urls.length < 2) return;
    var STOP = " a an and are as at be but by can do for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to too up us was we were what when which who will with you your yours i'm it's don't you're we're also more most all any each just get got how why where who's here out over about only other some such very can't will'll new use used using one two per via may might must should would could been being both own same ";
    var words = function (t) { return (String(t).toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).map(function (w) { return w.replace(/[’]/g, "'"); }); };
    var phrases = function (t) {
      var w = words(t), c = {};
      for (var n = 1; n <= 3; n++) for (var i = 0; i + n <= w.length; i++) {
        var g = w.slice(i, i + n); if (STOP.indexOf(" " + g[0] + " ") >= 0 || STOP.indexOf(" " + g[n - 1] + " ") >= 0) continue;
        if (n === 1 && (g[0].length < 4 || /^\d+$/.test(g[0]))) continue;
        var k = g.join(" "); c[k] = (c[k] || 0) + 1;
      }
      return c;
    };
    box.innerHTML = "<h2>Topic gap</h2><p>Reading the pages…</p>";
    Promise.all(urls.map(function (u) { return fetch("/api/page?url=" + encodeURIComponent(u)).then(function (r) { if (r.status === 404) throw new Error("none"); return r.json(); }).then(function (j) { return j.error ? null : j; }, function () { return null; }); })).then(function (pages) {
      if (!pages[0]) { box.innerHTML = ""; return; }
      var mine = words(pages[0].title + " " + pages[0].h1.join(" ") + " " + pages[0].text).join(" ");
      var gap = {};
      pages.slice(1).forEach(function (p, i) {
        if (!p) return; var c = phrases(p.title + " " + p.h1.join(" ") + " " + p.text);
        Object.keys(c).forEach(function (k) { if (c[k] < 2 || (" " + mine + " ").indexOf(" " + k + " ") >= 0) return; var g = gap[k] || (gap[k] = { n: 0, sites: [] }); g.n += c[k]; g.sites.push(i + 1); });
      });
      var list = Object.keys(gap).map(function (k) { return [k, gap[k]]; });
      // prefer phrases both competitors use, then longer phrases, then frequency; drop single words already inside a listed phrase
      list.sort(function (a, b) { return b[1].sites.length - a[1].sites.length || b[1].n * b[0].split(" ").length - a[1].n * a[0].split(" ").length; });
      var picked = []; list.forEach(function (x) { if (picked.length >= 24) return; if (picked.some(function (p) { return p[0].indexOf(x[0]) >= 0 || x[0].indexOf(p[0]) >= 0; })) return; picked.push(x); });
      box.innerHTML = "<h2>Topic gap: what competitors cover that you don't</h2>" + (picked.length ? '<p class="small">Words and phrases each competitor uses at least twice that never appear on your page. Not every one belongs on your page – pick the ones your customers would genuinely want answered.</p><ul class="chg">' + picked.map(function (x) { return "<li><strong>" + esc(x[0]) + '</strong> <span class="small">– used ' + x[1].n + "× by " + x[1].sites.map(function (s) { return "competitor " + s; }).join(" and ") + "</span></li>"; }).join("") + "</ul>" : "<p>No gaps – your page already covers every topic your competitors repeat.</p>");
    });
  }
}
