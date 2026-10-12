// Browser-only tools served as /assets/more.js: redirect map generator and SEO ROI calculator.
// Served from Function#toString (see index.js), so no imports and no bundler helpers in here.

/** Parse pasted "old new" pairs (tab, comma, space or arrow separated) into [{ from, to }], paths kept as given. */
export function redirectPairs(text) {
  var out = [], seen = {};
  String(text || "").split(/\r?\n/).forEach(function (line) {
    var t = line.trim(); if (!t || /^#/.test(t)) return;
    var parts = t.split(/\s*(?:\t|,|;|\s->\s|\s=>\s|→|\s+)\s*/).filter(Boolean);
    if (parts.length < 2) return;
    var from = parts[0].replace(/^"|"$/g, ""), to = parts[parts.length - 1].replace(/^"|"$/g, "");
    if (/^(old|from|source)/i.test(from) && /^(new|to|target|destination)/i.test(to)) return; // header row
    var path = function (u) { try { var x = new URL(u, "https://example.invalid"); return x.host === "example.invalid" ? x.pathname + x.search : null; } catch (e) { return null; } };
    var key = from.replace(/^https?:\/\/[^/]+/i, "");
    if (seen[key]) return; seen[key] = 1;
    out.push({ from: from, to: to, fromPath: path(from) || (function () { try { var x = new URL(from); return x.pathname + x.search; } catch (e) { return from; } })(), absolute: /^https?:\/\//i.test(to) });
  });
  return out;
}

/** Turn pairs into server rules. kind: htaccess | nginx | cloudflare | netlify | vercel | csv */
export function redirectRules(pairs, kind, site) {
  var q = function (s) { return s.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"); };
  var abs = function (to) { return /^https?:\/\//i.test(to) ? to : (site ? site.replace(/\/$/, "") : "") + (to.charAt(0) === "/" ? to : "/" + to); };
  if (kind === "htaccess") return "# 301 redirects – add near the top of .htaccess\nRewriteEngine On\n" + pairs.map(function (p) {
    var path = p.fromPath.split("?")[0], qs = p.fromPath.split("?")[1];
    return (qs ? "RewriteCond %{QUERY_STRING} ^" + q(qs) + "$\n" : "") + "RewriteRule ^" + q(path.replace(/^\//, "")) + "$ " + p.to + (qs ? " [R=301,L,QSD]" : " [R=301,L]");
  }).join("\n") + "\n";
  if (kind === "nginx") return "# inside your server { } block\n" + pairs.map(function (p) { return "location = " + p.fromPath.split("?")[0] + " { return 301 " + p.to + "; }"; }).join("\n") + "\n";
  if (kind === "cloudflare") return "source,target,status,preserve_query_string\n" + pairs.map(function (p) { return [abs(p.fromPath), abs(p.to), 301, "FALSE"].join(","); }).join("\n") + "\n";
  if (kind === "netlify") return pairs.map(function (p) { return p.fromPath + "  " + p.to + "  301"; }).join("\n") + "\n";
  if (kind === "vercel") return JSON.stringify({ redirects: pairs.map(function (p) { return { source: p.fromPath.split("?")[0], destination: p.to, permanent: true }; }) }, null, 2) + "\n";
  return "source,target\n" + pairs.map(function (p) { return p.fromPath + "," + p.to; }).join("\n") + "\n";
}

export function moreApp() {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  /* global redirectPairs, redirectRules */

  // ---- redirect map generator
  var rm = $("rm-form");
  if (rm) {
    var upd = function () {
      var pairs = redirectPairs($("rm-in").value), kind = $("rm-kind").value, notes = [];
      var loops = pairs.filter(function (p) { return p.fromPath === p.to || p.from === p.to; });
      var targets = {}; pairs.forEach(function (p) { targets[p.to.replace(/^https?:\/\/[^/]+/i, "")] = 1; });
      var chains = pairs.filter(function (p) { return targets[p.fromPath]; });
      if (loops.length) notes.push(loops.length + " redirect" + (loops.length > 1 ? "s point" : " points") + " to itself: " + loops.slice(0, 3).map(function (p) { return p.fromPath; }).join(", "));
      if (chains.length) notes.push(chains.length + " old address" + (chains.length > 1 ? "es are" : " is") + " also a new address, which makes a chain: " + chains.slice(0, 3).map(function (p) { return p.fromPath; }).join(", ") + ". Point the first redirect straight to the final page.");
      if (kind === "cloudflare" && !$("rm-site").value.trim() && pairs.some(function (p) { return !p.absolute; })) notes.push("Cloudflare bulk redirects need full addresses – enter your website above.");
      $("rm-count").textContent = pairs.length ? pairs.length + " redirect" + (pairs.length > 1 ? "s" : "") : "Paste old and new addresses above, one pair per line.";
      $("rm-notes").innerHTML = notes.map(function (n) { return '<p class="small" style="color:#9a6700">⚠ ' + esc(n) + "</p>"; }).join("");
      $("rm-out").textContent = pairs.length ? redirectRules(pairs, kind, $("rm-site").value.trim()) : "";
      var names = { htaccess: ".htaccess", nginx: "redirects.conf", cloudflare: "bulk-redirects.csv", netlify: "_redirects", vercel: "vercel.json", csv: "redirects.csv" };
      var a = $("rm-dl"); a.download = names[kind]; a.href = "data:text/plain;charset=utf-8," + encodeURIComponent($("rm-out").textContent);
    };
    ["rm-in", "rm-kind", "rm-site"].forEach(function (id) { $(id).addEventListener("input", upd); });
    rm.addEventListener("submit", function (ev) { ev.preventDefault(); upd(); });
    $("rm-copy").addEventListener("click", function () { var b = $("rm-copy"); (navigator.clipboard ? navigator.clipboard.writeText($("rm-out").textContent) : Promise.reject()).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1500); }, function () {}); });
    upd();
  }

  // ---- SEO ROI calculator
  var roi = $("roi-form");
  if (roi) {
    var CTR = [0, 28, 15, 11, 8, 6, 4.5, 3.5, 3, 2.5, 2];
    var ctr = function (p) { return p <= 10 ? CTR[Math.max(1, Math.round(p))] : p <= 20 ? 1 : 0.3; };
    var gbp = function (n) { return "£" + Math.round(n).toLocaleString("en-GB"); };
    var calc = function () {
      var vol = +$("roi-vol").value || 0, pos = +$("roi-pos").value || 1, now = +$("roi-now").value || 0, conv = (+$("roi-conv").value || 0) / 100, close = (+$("roi-close").value || 0) / 100, val = +$("roi-val").value || 0, cost = +$("roi-cost").value || 0;
      var visits = vol * ctr(pos) / 100, visitsNow = now ? vol * ctr(now) / 100 : 0, extra = Math.max(0, visits - visitsNow);
      var leads = extra * conv, sales = leads * close, revenue = sales * val, yearRev = revenue * 12, yearCost = cost * 12;
      var roiPct = yearCost ? Math.round((yearRev - yearCost) / yearCost * 100) : null;
      $("roi-out").innerHTML = '<div class="card" style="margin:16px 0"><div class="row" style="gap:28px">' +
        [[Math.round(extra).toLocaleString("en-GB"), "extra visits a month"], [leads.toFixed(1), "extra enquiries a month"], [gbp(revenue), "extra sales a month"], [roiPct == null ? "–" : roiPct + "%", "return on SEO spend (a year)"]].map(function (x) { return '<div><b style="font-size:28px">' + esc(x[0]) + '</b><br><span class="small">' + esc(x[1]) + "</span></div>"; }).join("") +
        '</div></div><p>' + (yearCost ? "Spending " + gbp(yearCost) + " a year to bring in about " + gbp(yearRev) + " of sales " + (yearRev >= yearCost ? "would pay back " + (yearRev / yearCost).toFixed(1) + " times over." : "wouldn't pay for itself at these numbers – aim for a busier search or a better position.") : "Enter a monthly SEO cost to see your return.") + "</p>" +
        '<div class="tablewrap"><table><thead><tr><th>Position</th><th>Typical click rate</th><th>Visits a month</th></tr></thead><tbody>' + [1, 2, 3, 5, 10, 15].map(function (p) { return "<tr" + (p === Math.round(pos) ? ' style="font-weight:700"' : "") + "><td>" + p + "</td><td>" + ctr(p) + "%</td><td>" + Math.round(vol * ctr(p) / 100).toLocaleString("en-GB") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    };
    roi.addEventListener("input", calc); roi.addEventListener("submit", function (ev) { ev.preventDefault(); calc(); });
    calc();
  }
}
