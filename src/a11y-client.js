// Browser code for the accessibility checker (served as /assets/a11y.js). Element ids a11-.
// Served from Function#toString (see index.js), so no imports and no bundler helpers in here.
export function a11yApp() {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var f = $("a11-form");
  if (!f) return;
  var ICON = { pass: ["✓", "s-pass", "Passed"], warn: ["!", "s-warn", "Check"], fail: ["✗", "s-fail", "Problem"], info: ["i", "s-info", "Note"] };
  var ORDER = { fail: 0, warn: 1, info: 2, pass: 3 };
  var run = function (u) {
    var out = $("a11-out");
    out.innerHTML = '<p class="small">Reading the page…</p>';
    fetch("/api/a11y?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
      var n = { pass: 0, warn: 0, fail: 0 }; j.checks.forEach(function (c) { if (n[c.status] != null) n[c.status]++; });
      var col = j.score >= 90 ? "#1a7f37" : j.score >= 60 ? "#9a6700" : "#cf222e";
      var list = j.checks.slice().sort(function (a, b) { return ORDER[a.status] - ORDER[b.status]; });
      out.innerHTML = '<div class="ck-head"><div class="ring" style="--p:' + j.score + ";--c:" + col + '"><div><b>' + j.score + '</b><small>out of 100</small></div></div><div><p style="margin:0"><strong>' + esc(j.url) + '</strong></p><div class="ck-stats"><span class="pill s-fail">' + n.fail + ' problems</span><span class="pill s-warn">' + n.warn + ' to check</span><span class="pill s-pass">' + n.pass + ' passed</span></div><p class="small">From the page\'s HTML only. Colour contrast, keyboard use and screen-reader flow still need a person to test – see below.</p></div></div>' +
        list.map(function (c) {
          var i = ICON[c.status] || ICON.info;
          return '<div class="card" style="margin:12px 0"><p style="margin:0"><strong class="' + i[1] + '">' + i[0] + " " + esc(i[2]) + "</strong> · <strong>" + esc(c.name) + '</strong> <span class="small">WCAG ' + esc(c.wcag) + "</span></p><p>" + esc(c.detail) + "</p>" +
            (c.items && c.items.length ? '<ul class="small">' + c.items.map(function (x) { return "<li><code>" + esc(x) + "</code></li>"; }).join("") + "</ul>" : "") +
            (c.status === "pass" ? "" : '<p class="small"><strong>Fix:</strong> ' + esc(c.fix) + "</p>") + "</div>";
        }).join("");
    }).catch(function () { out.innerHTML = '<p class="s-fail">Something went wrong – please try again.</p>'; });
  };
  f.addEventListener("submit", function (ev) { ev.preventDefault(); var u = $("a11-url").value.trim(); if (u) { run(u); try { history.replaceState(null, "", "?url=" + encodeURIComponent(u)); } catch (e) {} } });
  var q = new URLSearchParams(location.search).get("url");
  if (q) { $("a11-url").value = q; run(q); }
}
