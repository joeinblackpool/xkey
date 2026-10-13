// Browser code for the instant tools (served as /assets/tools.js with the Arial width table W prepended).
// Title checker and llms.txt generator run entirely in the browser; the robots.txt tester asks the
// Worker so it uses exactly the same matcher as the SEO check.
export function toolsApp() {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  /* global W */
  var px = function (s, size) { var t = 0; for (var ch of String(s)) t += W[ch] == null ? 1139 : W[ch]; return Math.round(t / 2048 * size); };
  var cut = function (s, size, max) { var out = "", t = 0; for (var ch of String(s)) { t += (W[ch] == null ? 1139 : W[ch]) / 2048 * size; if (t > max - 12) return out.replace(/\s+\S*$/, "") + " …"; out += ch; } return out; };
  var col = function (ok, near) { return ok ? "#1a7f37" : near ? "#9a6700" : "#cf222e"; };

  // ---- title & description pixel checker
  var ti = $("tt-title");
  if (ti) {
    var de = $("tt-desc"), ur = $("tt-url");
    var meter = function (id, w, lo, hi) {
      var ok = w >= lo && w <= hi, near = w > 0 && w <= hi * 1.07;
      $(id).innerHTML = '<div class="meter" role="img" aria-label="' + w + ' of ' + hi + ' pixels"><span style="width:' + Math.min(100, w / hi * 100) + '%;background:' + col(ok, near) + '"></span></div><span class="small">' + w + ' px of about ' + hi + ' px' + (w > hi ? " – Google will probably cut this off" : w && w < lo ? " – short; you have room to say more" : w ? " – good length" : "") + '</span>';
    };
    var upd = function () {
      var t = ti.value.trim(), d = de.value.trim(), u = ur.value.trim() || "yourwebsite.co.uk";
      var tw = px(t, 20), dw = px(d, 14);
      meter("tt-tm", tw, 250, 580); meter("tt-dm", dw, 500, 990);
      $("tt-tc").textContent = t.length + " characters"; $("tt-dc").textContent = d.length + " characters";
      var host = u.replace(/^https?:\/\//, "").replace(/\/.*$/, ""), crumbs = u.replace(/^https?:\/\//, "").split("/").filter(Boolean).slice(1).join(" › ");
      $("tt-serp").innerHTML = '<div class="u">' + esc(host) + (crumbs ? " › " + esc(crumbs) : "") + '</div><div class="t">' + esc(tw > 580 ? cut(t, 20, 580) : t || "Your page title") + '</div><div class="d">' + esc(dw > 990 ? cut(d, 14, 990) : d || "Your meta description will appear here. If you leave it out, Google writes one from your page text.") + '</div>';
    };
    [ti, de, ur].forEach(function (el) { el.addEventListener("input", upd); });
    upd();
  }

  // ---- robots.txt tester
  var rf = $("rt-form");
  if (rf) {
    var show = function (h) { $("rt-out").innerHTML = h; };
    rf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      show("<p>Testing…</p>");
      fetch("/api/robots-test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ robots: $("rt-robots").value, url: $("rt-url").value, agent: $("rt-agent").value }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.error) return show('<p class="s-fail">' + esc(j.error) + "</p>");
          show('<p style="font-size:20px"><strong class="' + (j.allowed ? "s-pass" : "s-fail") + '">' + (j.allowed ? "✓ Allowed" : "✗ Blocked") + "</strong> for " + esc(j.agentName) + " on <code>" + esc(j.path) + "</code></p>" +
            '<div class="tablewrap"><table><thead><tr><th>Crawler</th><th>Used for</th><th>Result</th></tr></thead><tbody>' + j.all.map(function (a) { return "<tr><td>" + esc(a.name) + "</td><td>" + esc(a.use) + '</td><td class="' + (a.allowed ? "s-pass" : "s-fail") + '">' + (a.allowed ? "Allowed" : "Blocked") + "</td></tr>"; }).join("") + "</tbody></table></div>");
        })
        .catch(function () { show('<p class="s-fail">Couldn\'t run the test – please try again.</p>'); });
    });
    var lb = $("rt-load");
    if (lb) lb.addEventListener("click", function () {
      var u = $("rt-url").value.trim(); if (!u) { $("rt-url").focus(); return; }
      lb.disabled = true; lb.textContent = "Loading…";
      fetch("/api/robots?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) show('<p class="s-fail">' + esc(j.error) + "</p>"); else { $("rt-robots").value = j.text; show('<p class="small">Loaded robots.txt from ' + esc(j.origin) + " (HTTP " + j.status + ").</p>"); }
      }).catch(function () { show('<p class="s-fail">Couldn\'t load robots.txt.</p>'); }).then(function () { lb.disabled = false; lb.textContent = "Load from the website"; });
    });
  }

  // ---- llms.txt generator
  var lf = $("lt-form");
  if (lf) {
    var gen = function () {
      var name = $("lt-name").value.trim() || "Your business", sum = $("lt-sum").value.trim(), site = $("lt-site").value.trim().replace(/\/+$/, "");
      if (site && !/^https?:\/\//i.test(site)) site = "https://" + site;
      var abs = function (u) { u = u.trim(); return /^https?:\/\//i.test(u) ? u : site + "/" + u.replace(/^\/+/, ""); };
      var lines = $("lt-pages").value.split(/\n/).map(function (l) { return l.split("|").map(function (x) { return x.trim(); }); }).filter(function (p) { return p[0] && p[1]; });
      var out = "# " + name + "\n\n" + (sum ? "> " + sum.replace(/\s+/g, " ") + "\n\n" : "") + ($("lt-about").value.trim() ? $("lt-about").value.trim() + "\n\n" : "") +
        (lines.length ? "## Key pages\n\n" + lines.map(function (p) { return "- [" + p[0] + "](" + abs(p[1]) + ")" + (p[2] ? ": " + p[2] : ""); }).join("\n") + "\n" : "");
      $("lt-out").textContent = out;
      var a = $("lt-dl"); a.href = URL.createObjectURL(new Blob([out], { type: "text/plain" }));
      return out;
    };
    lf.addEventListener("input", gen);
    lf.addEventListener("submit", function (ev) { ev.preventDefault(); gen(); });
    $("lt-copy").addEventListener("click", function () {
      var t = gen(), b = $("lt-copy");
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select the text and copy"; });
      setTimeout(function () { b.textContent = "Copy"; }, 2000);
    });
    gen();
  }

  // ---- shared helpers for the generators
  var val = function (id) { var el = $(id); return el ? el.value.trim() : ""; };
  var attr = function (s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); };
  var absUrl = function (u) { u = String(u || "").trim(); if (!u) return ""; return /^https?:\/\//i.test(u) ? u : "https://" + u.replace(/^\/+/, ""); };
  var copyBtn = function (btnId, outId) {
    var b = $(btnId); if (!b) return;
    b.addEventListener("click", function () {
      var t = $(outId).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select the text and copy"; });
      setTimeout(function () { b.textContent = "Copy"; }, 2000);
    });
  };
  var live = function (formId, fn) { var f = $(formId); if (!f) return; f.addEventListener("input", fn); f.addEventListener("change", fn); f.addEventListener("submit", function (ev) { ev.preventDefault(); fn(); }); fn(); };
  var download = function (aId, text, type) { var a = $(aId); if (a) a.href = URL.createObjectURL(new Blob([text], { type: type || "text/plain" })); };

  // ---- meta tag generator
  live("mt-form", function () {
    var t = val("mt-title"), d = val("mt-desc"), u = absUrl(val("mt-url")), img = absUrl(val("mt-img")), idx = $("mt-index").checked;
    var tw = px(t, 20), dw = px(d, 14);
    $("mt-tm").innerHTML = '<span class="small" style="color:' + col(tw && tw <= 580, tw <= 620) + '">Title: ' + tw + " px of ~580 px</span>";
    $("mt-dm").innerHTML = '<span class="small" style="color:' + col(dw >= 500 && dw <= 990, dw && dw <= 1060) + '">Description: ' + dw + " px of ~990 px</span>";
    var L = ['<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">'];
    if (t) L.push("<title>" + attr(t) + "</title>");
    if (d) L.push('<meta name="description" content="' + attr(d) + '">');
    if (u) L.push('<link rel="canonical" href="' + attr(u) + '">');
    L.push('<meta name="robots" content="' + (idx ? "index, follow, max-image-preview:large" : "noindex, follow") + '">');
    if (t) L.push('<meta property="og:title" content="' + attr(t) + '">');
    if (d) L.push('<meta property="og:description" content="' + attr(d) + '">');
    if (u) L.push('<meta property="og:url" content="' + attr(u) + '">');
    L.push('<meta property="og:type" content="website">');
    if (img) { L.push('<meta property="og:image" content="' + attr(img) + '">'); L.push('<meta name="twitter:card" content="summary_large_image">'); }
    $("mt-out").textContent = L.join("\n");
  });
  copyBtn("mt-copy", "mt-out");

  // ---- open graph generator
  live("og-form", function () {
    var t = val("og-title"), d = val("og-desc"), u = absUrl(val("og-url")), img = absUrl(val("og-img")), site = val("og-site"), type = $("og-type").value;
    var L = [];
    L.push('<meta property="og:type" content="' + attr(type) + '">');
    if (t) L.push('<meta property="og:title" content="' + attr(t) + '">');
    if (d) L.push('<meta property="og:description" content="' + attr(d) + '">');
    if (u) L.push('<meta property="og:url" content="' + attr(u) + '">');
    if (site) L.push('<meta property="og:site_name" content="' + attr(site) + '">');
    if (img) { L.push('<meta property="og:image" content="' + attr(img) + '">', '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="' + attr(t) + '">'); }
    L.push('<meta property="og:locale" content="en_GB">');
    L.push('<meta name="twitter:card" content="' + (img ? "summary_large_image" : "summary") + '">');
    if (t) L.push('<meta name="twitter:title" content="' + attr(t) + '">');
    if (d) L.push('<meta name="twitter:description" content="' + attr(d) + '">');
    if (img) L.push('<meta name="twitter:image" content="' + attr(img) + '">');
    $("og-out").textContent = L.join("\n");
    var host = ""; try { host = new URL(u).hostname.replace(/^www\./, ""); } catch (e) {}
    var warn = /\.svg(\?|$)/i.test(img) ? '<p class="small s-warn">SVG images aren\'t supported by Facebook, LinkedIn or X – use a PNG or JPG.</p>' : "";
    $("og-card").innerHTML = '<div class="ogc">' + (img && /^https:\/\//.test(img) ? '<div class="ogi" style="background-image:url(&quot;' + attr(img).replace(/[()'"\\]/g, "") + '&quot;)"></div>' : '<div class="ogi ogn">1200 × 630 image</div>') + '<div class="ogt"><span>' + esc(host.toUpperCase() || "YOURSITE.CO.UK") + "</span><b>" + esc(t || "Your page title") + "</b><small>" + esc((d || "Your description").slice(0, 110)) + "</small></div></div>" + warn;
  });
  copyBtn("og-copy", "og-out");

  // ---- xml sitemap generator
  var smGen = function () {
    var site = absUrl(val("sm-site")).replace(/\/+$/, ""), today = new Date().toISOString().slice(0, 10), seen = {}, bad = 0;
    var urls = $("sm-urls").value.split(/\s+/).filter(Boolean).map(function (x) { x = /^https?:\/\//i.test(x) ? x : (site ? site + "/" + x.replace(/^\/+/, "") : x); try { var y = new URL(x); y.hash = ""; return y.href; } catch (e) { bad++; return null; } }).filter(function (x) { if (!x || seen[x]) return false; seen[x] = 1; return true; });
    var withDate = $("sm-lastmod").checked;
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(function (x) { return "  <url><loc>" + x.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</loc>" + (withDate ? "<lastmod>" + today + "</lastmod>" : "") + "</url>"; }).join("\n") + "\n</urlset>\n";
    $("sm-out").textContent = xml; $("sm-count").textContent = urls.length + " URL" + (urls.length === 1 ? "" : "s") + (bad ? " · " + bad + " skipped (not a valid address)" : "") + (urls.length > 50000 ? " · over 50,000 – split into several sitemaps" : "");
    download("sm-dl", xml, "application/xml");
  };
  live("sm-form", smGen);
  copyBtn("sm-copy", "sm-out");
  var smFind = $("sm-find");
  if (smFind) smFind.addEventListener("click", function () {
    var u = val("sm-site"); if (!u) { $("sm-site").focus(); return; }
    smFind.disabled = true; smFind.textContent = "Finding pages…";
    fetch("/api/discover?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error) { $("sm-count").textContent = j.error; return; }
      $("sm-urls").value = j.urls.join("\n"); smGen();
      $("sm-count").textContent += " · found from " + (j.fromSitemap ? "your existing sitemap and " : "") + "links on your home page";
    }).catch(function () { $("sm-count").textContent = "Couldn't reach that website."; }).then(function () { smFind.disabled = false; smFind.textContent = "Find pages on my site"; });
  });

  // ---- word counter & keyword density
  var STOP = " a an and are as at be but by can do for from has have he her his i if in into is it its me my no not of on or our she so than that the their them then there these they this to too up us was we were what when which who will with you your yours i'm it's don't you're we're ";
  live("wc-form", function () {
    var t = $("wc-text").value, words = t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
    var sentences = (t.match(/[^.!?\n]+[.!?]+(\s|$)/g) || []).length || (words.length ? 1 : 0);
    var paras = t.split(/\n\s*\n/).filter(function (x) { return x.trim(); }).length;
    var syl = function (w) { w = w.toLowerCase().replace(/[^a-z]/g, ""); if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, ""); var m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
    var sy = words.reduce(function (n, w) { return n + syl(w); }, 0);
    var fre = words.length && sentences ? Math.round(206.835 - 1.015 * (words.length / sentences) - 84.6 * (sy / words.length)) : null;
    var stat = function (n, l) { return "<div><b>" + n + "</b><small>" + l + "</small></div>"; };
    $("wc-stats").innerHTML = stat(words.length.toLocaleString("en-GB"), "words") + stat(t.length.toLocaleString("en-GB"), "characters") + stat(t.replace(/\s/g, "").length.toLocaleString("en-GB"), "without spaces") + stat(sentences, "sentences") + stat(paras, "paragraphs") + stat(Math.max(words.length ? 1 : 0, Math.round(words.length / 230)) + " min", "reading time") + stat(fre == null ? "–" : Math.max(0, Math.min(100, fre)), "readability (0–100)");
    var lw = words.map(function (w) { return w.toLowerCase().replace(/[’']/g, "'"); });
    var count = function (n) { var c = {}; for (var i = 0; i + n <= lw.length; i++) { var g = lw.slice(i, i + n); if (STOP.indexOf(" " + g[0] + " ") >= 0 || STOP.indexOf(" " + g[n - 1] + " ") >= 0 || g[0].length < 3 && n === 1) continue; var k = g.join(" "); c[k] = (c[k] || 0) + 1; } return Object.keys(c).map(function (k) { return [k, c[k]]; }).filter(function (x) { return n === 1 || x[1] > 1; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 10); };
    var table = function (rows, label) { return rows.length ? '<div><p class="ct" style="font-size:17px">' + label + '</p><table><tbody>' + rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + r[1] + "</td><td>" + (r[1] / lw.length * 100).toFixed(1) + "%</td></tr>"; }).join("") + "</tbody></table></div>" : ""; };
    $("wc-kw").innerHTML = words.length ? '<div class="grid" style="margin-top:8px">' + table(count(1), "Top words") + table(count(2), "Top 2-word phrases") + table(count(3), "Top 3-word phrases") + "</div>" : "";
  });

  // ---- UTM link builder
  live("ut-form", function () {
    var lower = $("ut-lower").checked, clean = function (v) { v = v.trim(); return lower ? v.toLowerCase().replace(/\s+/g, "-") : v; };
    var raw = val("ut-url"), notes = [];
    if (raw && !/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    var u; try { u = new URL(raw); } catch (e) { $("ut-out").textContent = ""; $("ut-notes").innerHTML = raw ? '<p class="s-warn">That doesn\'t look like a web address.</p>' : ""; return; }
    [["utm_source", "ut-source"], ["utm_medium", "ut-medium"], ["utm_campaign", "ut-campaign"], ["utm_term", "ut-term"], ["utm_content", "ut-content"]].forEach(function (p) { var v = clean(val(p[1])); if (v) u.searchParams.set(p[0], v); else u.searchParams.delete(p[0]); });
    var hash = u.hash; u.hash = ""; var out = u.href + hash;
    if (!val("ut-source")) notes.push("Add a source – Google Analytics needs it to credit the visit.");
    if (!val("ut-medium")) notes.push("Add a medium (social, email, cpc…) so the visit lands in the right channel in GA4.");
    if (/gclid|fbclid/.test(u.search)) notes.push("The address already has an ad click id; don't share it.");
    if (/^(organic|referral|\(none\))$/i.test(val("ut-medium"))) notes.push("\"" + val("ut-medium") + "\" is a medium GA4 uses for its own channels – pick another.");
    $("ut-out").textContent = out;
    $("ut-notes").innerHTML = (notes.length ? '<ul class="small">' + notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "") + '<p class="small">' + out.length + " characters. Never put UTM tags on links between pages of your own site – they restart the visit in Analytics.</p>";
  });
  copyBtn("ut-copy", "ut-out");

  // ---- URL slug generator
  var SMALL = " a an and the of to in on at for by or with from is are as be it its your our my ";
  var slugify = function (t, max, drop) {
    var s = t.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/æ/gi, "ae").replace(/ø/gi, "o").replace(/&/g, " and ").replace(/['’`]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    var w = s.split(" ").filter(Boolean);
    if (drop) { var kept = w.filter(function (x, i) { return i === 0 || SMALL.indexOf(" " + x + " ") < 0; }); if (kept.length) w = kept; }
    var out = w.join("-");
    if (max && out.length > max) { out = out.slice(0, max + 1); out = out.lastIndexOf("-") > 0 ? out.slice(0, out.lastIndexOf("-")) : out.slice(0, max); }
    return out;
  };
  live("us-form", function () {
    var max = +$("us-max").value, drop = $("us-stop").checked;
    $("us-out").textContent = val("us-in").split(/\n/).map(function (l) { return l.trim() ? slugify(l, max, drop) : ""; }).filter(Boolean).join("\n");
  });
  copyBtn("us-copy", "us-out");

  // ---- case converter
  var cc = $("cc-form");
  if (cc) {
    var LOWER_T = " a an and as at but by for if in nor of off on or per so the to up via vs with ";
    var words = function (t) { return t.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean); };
    var conv = {
      lower: function (t) { return t.toLowerCase(); },
      upper: function (t) { return t.toUpperCase(); },
      sentence: function (t) { return t.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)(\p{Ll})/gu, function (m, a, b) { return a + b.toUpperCase(); }).replace(/\bi\b/g, "I"); },
      capital: function (t) { return t.toLowerCase().replace(/(^|[\s(\["'“‘-])(\p{Ll})/gu, function (m, a, b) { return a + b.toUpperCase(); }); },
      title: function (t) { return t.split(/\n/).map(function (line) { var ws = line.toLowerCase().split(/(\s+)/), real = ws.filter(function (x) { return x.trim(); }).length, n = 0; return ws.map(function (x) { if (!x.trim()) return x; n++; var first = n === 1, last = n === real; return !first && !last && LOWER_T.indexOf(" " + x.replace(/[^a-z]/g, "") + " ") >= 0 && x.replace(/[^a-z]/g, "") ? x : x.replace(/\p{Ll}/u, function (c) { return c.toUpperCase(); }); }).join(""); }).join("\n"); },
      alt: function (t) { var i = 0; return t.replace(/\p{L}/gu, function (c) { return i++ % 2 ? c.toUpperCase() : c.toLowerCase(); }); },
      camel: function (t) { return t.split(/\n/).map(function (l) { return words(l).map(function (w, i) { w = w.toLowerCase(); return i ? w.charAt(0).toUpperCase() + w.slice(1) : w; }).join(""); }).join("\n"); },
      snake: function (t) { return t.split(/\n/).map(function (l) { return words(l).map(function (w) { return w.toLowerCase(); }).join("_"); }).join("\n"); },
      kebab: function (t) { return t.split(/\n/).map(function (l) { return words(l).map(function (w) { return w.toLowerCase(); }).join("-"); }).join("\n"); },
    };
    var count = function () { var t = $("cc-in").value; $("cc-n").textContent = (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length + " words · " + t.length + " characters"; };
    $("cc-in").addEventListener("input", count); count();
    $("cc-btns").addEventListener("click", function (ev) { var b = ev.target.closest("button[data-c]"); if (!b) return; $("cc-in").value = conv[b.getAttribute("data-c")]($("cc-in").value); $("cc-hidden").textContent = $("cc-in").value; count(); });
    cc.addEventListener("submit", function (ev) { ev.preventDefault(); });
    $("cc-copy").addEventListener("click", function () { $("cc-hidden").textContent = $("cc-in").value; var b = $("cc-copy"); (navigator.clipboard ? navigator.clipboard.writeText($("cc-in").value) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { $("cc-in").select(); b.textContent = "Press Ctrl+C to copy"; }); setTimeout(function () { b.textContent = "Copy text"; }, 2000); });
  }

  // ---- SSL checker (/api/ssl)
  var sl = $("sl-form");
  if (sl) {
    var slq = (location.search.match(/[?&]d=([^&]+)/) || [])[1];
    if (slq && !$("sl-d").value.trim()) { try { $("sl-d").value = decodeURIComponent(slq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { sl.requestSubmit ? sl.requestSubmit() : sl.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    sl.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("sl-d").value.trim(), out = $("sl-out");
      if (!d) { $("sl-d").focus(); return; }
      out.innerHTML = "<p>Checking the certificate…</p>";
      fetch("/api/ssl?d=" + encodeURIComponent(d)).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
        var bad = j.checks.some(function (c) { return c.level === "fail"; });
        var h = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.name) + '</p><p style="font-size:24px;margin:8px 0;color:' + (bad ? "#cf222e" : "#1a7f37") + '"><b>' + (j.secure ? (bad ? "Secure, with problems" : "Secure") : "Not secure") + "</b></p>" +
          '<ul style="list-style:none;padding:0;margin:8px 0">' + j.checks.map(function (n) { return '<li style="margin:6px 0;overflow-wrap:anywhere;color:' + lc[n.level] + '"><b>' + icon[n.level] + "</b> " + esc(n.text) + "</li>"; }).join("") + "</ul></div>";
        if (j.cert) h += '<div class="tablewrap"><table><tbody><tr><th scope="row" style="text-align:left">Issued by</th><td>' + esc(j.cert.issuer) + '</td></tr><tr><th scope="row" style="text-align:left">Valid from</th><td>' + esc(j.cert.from) + '</td></tr><tr><th scope="row" style="text-align:left">Expires</th><td style="color:' + col(j.cert.daysLeft >= 21, j.cert.daysLeft >= 7) + '">' + esc(j.cert.to) + " (" + j.cert.daysLeft + ' days)</td></tr><tr><th scope="row" style="text-align:left;vertical-align:top">Covers</th><td style="overflow-wrap:anywhere">' + j.cert.names.map(esc).join(", ") + "</td></tr></tbody></table></div>";
        else h += '<p class="small">' + (j.ctError ? "The public certificate logs didn't answer just now, so we can't show the dates – try again in a minute." : "No current certificate for this exact name was found in the public certificate logs.") + "</p>";
        if (j.mixed.length) h += "<h3>Insecure items on the page</h3><ul>" + j.mixed.slice(0, 30).map(function (m) { return '<li style="overflow-wrap:anywhere">' + (m.active ? "<b>Blocked</b> " : "") + "&lt;" + esc(m.tag) + "&gt; " + esc(m.url) + "</li>"; }).join("") + "</ul><p class=\"small\">Change each address to start with https://, or remove it.</p>";
        h += '<p class="small">Certificate dates come from public Certificate Transparency logs (crt.sh or Cert Spotter), which list every certificate issued; the server checks are made live. See all response headers with the <a href="/http-header-checker?url=' + encodeURIComponent("https://" + j.name) + '">HTTP header checker</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that site – please try again.</p>'; });
    });
  }

  // ---- long-tail keyword generator
  live("kw-form", function () {
    var seed = val("kw-seed").toLowerCase().replace(/\s+/g, " "), town = val("kw-town").toLowerCase();
    if (!seed) { $("kw-out").innerHTML = ""; $("kw-n").textContent = ""; return; }
    var G = {
      "Questions": ["how much does " + seed + " cost", "how to choose " + seed, "what is " + seed, "is " + seed + " worth it", "how long does " + seed + " take", "why do i need " + seed, "when should i get " + seed, "which " + seed + " is best", "can i do " + seed + " myself", "what to ask before " + seed],
      "Buying intent": ["best " + seed, "cheap " + seed, "affordable " + seed, seed + " prices", seed + " cost", seed + " quote", seed + " deals", seed + " for small business", "professional " + seed, seed + " reviews"],
      "Free & no-friction": ["free " + seed, seed + " no sign up", "free " + seed + " no registration", seed + " without account", "free " + seed + " online", seed + " no subscription", "free " + seed + " no email", "instant " + seed],
      "Comparisons": [seed + " vs diy", seed + " alternatives", "best " + seed + " compared", seed + " pros and cons"],
      "Beginners & guides": [seed + " for beginners", seed + " guide", seed + " checklist", seed + " tips", seed + " mistakes to avoid", seed + " examples", seed + " step by step"],
    };
    if (town) G["Local"] = [seed + " " + town, seed + " in " + town, seed + " near " + town, "best " + seed + " in " + town, "cheap " + seed + " " + town, seed + " " + town + " prices", "local " + seed + " " + town, seed + " near me"];
    else G["Local"] = [seed + " near me", "local " + seed, seed + " in my area"];
    var all = [], h = "";
    Object.keys(G).forEach(function (k) { h += '<div class="card"><p class="ct" style="font-size:17px">' + esc(k) + '</p><ul style="margin:0;padding-left:18px">' + G[k].map(function (x) { all.push(x); return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; });
    $("kw-out").innerHTML = '<div class="grid">' + h + "</div>";
    $("kw-n").textContent = all.length + " ideas"; $("kw-all").textContent = all.join("\n");
  });
  copyBtn("kw-copy", "kw-all");

  // ---- blog title generator
  live("bt-form", function () {
    var k = val("bt-kw"), y = new Date().getFullYear(), aud = val("bt-aud");
    if (!k) { $("bt-out").innerHTML = ""; return; }
    var K = k.replace(/(^|\s)(\S)/g, function (m, sp, ch) { return sp + ch.toUpperCase(); }), a = aud ? " for " + aud : "";
    var T = ["How to Choose " + K + a + " (" + y + " Guide)", K + ": A Plain-English Guide" + a, "7 " + K + " Mistakes to Avoid", K + " Explained in 5 Minutes", "Is " + K + " Worth It? An Honest Answer", "How Much Does " + K + " Cost in " + y + "?", "The " + K + " Checklist" + a, K + " vs DIY: Which Is Right for You?", "10 Questions to Ask Before " + K, "What Nobody Tells You About " + K, "A Beginner's Guide to " + K, K + " Tips That Actually Work", "Why " + K + " Matters" + a, "Everything You Need to Know About " + K, "How We Do " + K + " (Step by Step)"];
    $("bt-out").innerHTML = '<ol class="chk" style="list-style:none;padding:0">' + T.map(function (t) { var w = px(t, 20); return '<li style="display:block;padding:8px 0;border-bottom:1px solid var(--line)"><strong>' + esc(t) + '</strong> <span class="small" style="color:' + col(w <= 580, w <= 620) + '">' + w + " px</span></li>"; }).join("") + "</ol>";
  });

  // ---- robots.txt generator
  live("rg-form", function () {
    var site = absUrl(val("rg-site")).replace(/\/+$/, ""), L = ["User-agent: *"];
    var dis = val("rg-block").split(/\s+/).filter(Boolean).map(function (p) { return p.charAt(0) === "/" ? p : "/" + p; });
    if ($("rg-all").checked) L.push("Disallow: /"); else { dis.forEach(function (p) { L.push("Disallow: " + p); }); if (!dis.length) L.push("Allow: /"); }
    var train = [["GPTBot", "OpenAI training"], ["ClaudeBot", "Anthropic training"], ["Google-Extended", "Gemini training"], ["CCBot", "Common Crawl"], ["Applebot-Extended", "Apple AI training"], ["Meta-ExternalAgent", "Meta AI training"]];
    var search = [["OAI-SearchBot", "ChatGPT search"], ["Claude-SearchBot", "Claude search"], ["PerplexityBot", "Perplexity search"]];
    if ($("rg-train").checked) train.forEach(function (b) { L.push("", "# " + b[1], "User-agent: " + b[0], "Disallow: /"); });
    if ($("rg-search").checked) search.forEach(function (b) { L.push("", "# " + b[1], "User-agent: " + b[0], "Disallow: /"); });
    if (site) L.push("", "Sitemap: " + site + "/sitemap.xml");
    var out = L.join("\n") + "\n";
    $("rg-out").textContent = out; download("rg-dl", out);
    $("rg-note").innerHTML = $("rg-all").checked ? '<span class="s-fail">This blocks every crawler from your whole site – only use it on a development site.</span>' : $("rg-search").checked ? '<span class="s-warn">Blocking AI search crawlers stops ChatGPT, Claude and Perplexity showing and linking to your site.</span>' : "";
  });
  copyBtn("rg-copy", "rg-out");

  // ---- local business schema generator
  live("sg-form", function () {
    var o = { "@context": "https://schema.org", "@type": $("sg-type").value };
    var set = function (k, v) { if (v) o[k] = v; };
    set("name", val("sg-name")); set("url", absUrl(val("sg-url"))); set("telephone", val("sg-tel")); set("email", val("sg-email")); set("image", absUrl(val("sg-img"))); set("description", val("sg-desc")); set("priceRange", val("sg-price"));
    var adr = { "@type": "PostalAddress", streetAddress: val("sg-street"), addressLocality: val("sg-town"), postalCode: val("sg-pc"), addressCountry: "GB" };
    Object.keys(adr).forEach(function (k) { if (!adr[k]) delete adr[k]; });
    if (adr.streetAddress || adr.addressLocality || adr.postalCode) o.address = adr;
    var areas = val("sg-areas").split(/,|\n/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (areas.length) o.areaServed = areas.map(function (a) { return { "@type": "Place", name: a }; });
    var days = val("sg-days"), op = val("sg-open"), cl = val("sg-close");
    if (days && op && cl) o.openingHoursSpecification = [{ "@type": "OpeningHoursSpecification", dayOfWeek: days.split(",").map(function (d) { return d.trim(); }), opens: op, closes: cl }];
    var same = val("sg-same").split(/\s+/).filter(Boolean).map(absUrl);
    if (same.length) o.sameAs = same;
    var json = JSON.stringify(o, null, 2).replace(/</g, "\\u003c");
    $("sg-out").textContent = '<script type="application/ld+json">\n' + json + "\n</" + "script>";
    var miss = ["name", "address"].filter(function (k) { return !o[k]; });
    $("sg-note").innerHTML = miss.length ? '<span class="s-warn">Google requires ' + miss.join(" and ") + " for LocalBusiness. Service-area businesses without a public address can use areaServed and leave the street out.</span>" : '<span class="s-pass">Has Google\'s required properties.</span>';
  });
  copyBtn("sg-copy", "sg-out");

  // ---- shared: fetch a page summary from the Worker
  var getPage = function (u) { return fetch("/api/page?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) { if (j.error) throw new Error(j.error); return j; }); };
  var GENERIC = /^(click here|here|read more|more|learn more|find out more|this|link|this link|go|continue|details|more info|see more|view more|click|website|page|download)$/i;

  // ---- anchor text checker
  var ac = $("ac-form");
  if (ac) ac.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var out = $("ac-out"), u = val("ac-url"); out.innerHTML = "<p>Reading the page…</p>";
    getPage(u).then(function (j) {
      var L = j.links, body = L.filter(function (l) { return !l.nav; });
      var flag = function (l) {
        var t = l.t.trim(), f = [];
        if (!t) f.push(["fail", l.img ? "Image link with no alt text" : "Empty anchor – no text at all"]);
        else if (GENERIC.test(t)) f.push(["warn", "Generic anchor – says nothing about the destination"]);
        else if (/^(https?:\/\/|www\.)/i.test(t)) f.push(["warn", "Bare URL as anchor"]);
        else if (t.length > 100) f.push(["warn", "Very long anchor"]);
        if (!l.int && /\b(sponsored|ugc)\b/.test(l.rel)) f.push(["info", l.rel.match(/sponsored|ugc/)[0] + " link"]);
        if (/\bnofollow\b/.test(l.rel) && l.int) f.push(["warn", "nofollow on an internal link – wastes your own link value"]);
        return f;
      };
      var byText = {}, byUrl = {};
      L.forEach(function (l) { var k = l.t.trim().toLowerCase(); if (!k) return; (byText[k] = byText[k] || {})[l.h.replace(/[?#].*$/, "").replace(/\/$/, "")] = 1; (byUrl[l.h] = byUrl[l.h] || {})[k] = 1; });
      var clash = Object.keys(byText).filter(function (k) { return Object.keys(byText[k]).length > 1 && !GENERIC.test(k); });
      var counts = { fail: 0, warn: 0 }, rows = L.map(function (l) { var f = flag(l); f.forEach(function (x) { if (counts[x[0]] != null) counts[x[0]]++; }); return [l, f]; });
      var intN = L.filter(function (l) { return l.int; }).length;
      var top = {}; body.filter(function (l) { return l.int && l.t.trim(); }).forEach(function (l) { var k = l.t.trim(); top[k] = (top[k] || 0) + 1; });
      var topList = Object.keys(top).sort(function (a, b) { return top[b] - top[a]; }).slice(0, 12);
      var stat = function (n, l2) { return "<div><b>" + n + "</b><small>" + l2 + "</small></div>"; };
      out.innerHTML = '<p class="small" style="overflow-wrap:anywhere">' + esc(j.url) + "</p>" +
        '<div class="vit">' + stat(L.length, "links") + stat(intN, "internal") + stat(L.length - intN, "external") + stat('<span class="' + (counts.fail ? "s-fail" : "s-pass") + '">' + counts.fail + "</span>", "empty anchors") + stat('<span class="' + (counts.warn ? "s-warn" : "s-pass") + '">' + counts.warn + "</span>", "weak anchors") + "</div>" +
        (clash.length ? '<p><strong class="s-warn">Same anchor, different pages:</strong> ' + clash.slice(0, 8).map(function (k) { return "“" + esc(k) + "”"; }).join(", ") + " – this blurs which page should rank for those words.</p>" : "") +
        (topList.length ? '<h3>Internal anchors in the page content</h3><p class="small">These tell Google what your other pages are about. Descriptive, varied anchors are best.</p><ul>' + topList.map(function (k) { return "<li>" + esc(k) + (top[k] > 1 ? " <span class=\"small\">×" + top[k] + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
        '<h3>Every link</h3><div class="tablewrap"><table><thead><tr><th>Anchor text</th><th>Goes to</th><th>Notes</th></tr></thead><tbody>' + rows.map(function (r) {
          var l = r[0], f = r[1];
          return "<tr><td>" + (l.t ? esc(l.t) : '<em class="s-fail">(none)</em>') + '</td><td style="overflow-wrap:anywhere;font-size:14px">' + (l.int ? "" : "↗ ") + esc(l.h.replace(/^https?:\/\/(www\.)?/, "")) + (l.nav ? ' <span class="small">menu/footer</span>' : "") + "</td><td>" + (f.length ? f.map(function (x) { return '<span class="s-' + (x[0] === "info" ? "pass" : x[0]) + '">' + esc(x[1]) + "</span>"; }).join("<br>") : '<span class="s-pass">OK</span>') + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }).catch(function (e) { out.innerHTML = '<p class="s-fail">' + esc(e.message) + "</p>"; });
  });

  // ---- anchor text generator
  live("ag-form", function () {
    var k = val("ag-kw"), b = val("ag-brand"), u = absUrl(val("ag-url"));
    if (!k) { $("ag-out").innerHTML = ""; return; }
    var host = ""; try { host = new URL(u).hostname.replace(/^www\./, ""); } catch (e) {}
    var G = [
      ["Descriptive (best for internal links)", [k, k + " guide", "how " + k + " works", "our " + k, k + " prices and options"]],
      ["Partial match (natural mentions)", ["affordable " + k, "help with " + k, k + " for small businesses", "everything about " + k]],
      ["Branded", b ? [b, b + "'s " + k, k + " from " + b] : []],
      ["Website address", host ? [host, "www." + host] : []],
    ];
    $("ag-out").innerHTML = '<div class="grid">' + G.filter(function (g) { return g[1].length; }).map(function (g) { return '<div class="card"><p class="ct" style="font-size:17px">' + esc(g[0]) + '</p><ul style="margin:0;padding-left:18px">' + g[1].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>" +
      (u ? '<p style="margin:16px 0 6px;font-weight:600">HTML</p><pre class="out">' + esc('<a href="' + u + '">' + k + "</a>") + "</pre>" : "");
  });

  // ---- plagiarism checker
  var pg = $("pg-form");
  if (pg) pg.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var t = $("pg-text").value.trim(), out = $("pg-out"), cmp = val("pg-url");
    if (!t) { $("pg-text").focus(); return; }
    var sents = (t.replace(/\s+/g, " ").match(/[^.!?]+[.!?]?/g) || []).map(function (x) { return x.trim(); }).filter(function (x) { var n = x.split(" ").length; return n >= 7 && n <= 40; });
    var freq = {}; (t.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []).forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    var score = function (x) { var ws = x.toLowerCase().match(/[\p{L}\p{N}']+/gu) || []; return ws.reduce(function (n, w) { return n + (STOP.indexOf(" " + w + " ") >= 0 ? 0 : w.length > 6 ? 2 : 1); }, 0) / Math.sqrt(ws.length); };
    var pick = sents.map(function (x, i) { return [x, score(x), i]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8).sort(function (a, b) { return a[2] - b[2]; });
    var phrase = function (x) { var ws = x.replace(/["“”]/g, "").split(" "); return ws.slice(0, 14).join(" "); };
    var h = "<h3>Search the web for your most distinctive sentences</h3>" + (pick.length ? '<p class="small">Each button searches for the exact words in quotes. If another page shows up with the same wording, it has been copied – one way or the other.</p><ol class="pgl">' + pick.map(function (p2) { var q = '"' + phrase(p2[0]) + '"'; return "<li><p>" + esc(p2[0]) + '</p><a class="btn ghost" rel="noopener" target="_blank" href="https://www.google.com/search?q=' + encodeURIComponent(q) + '">Google</a> <a class="btn ghost" rel="noopener" target="_blank" href="https://www.bing.com/search?q=' + encodeURIComponent(q) + '">Bing</a></li>'; }).join("") + "</ol>" : "<p>Add a few full sentences (seven words or more) to search for.</p>");
    out.innerHTML = h + (cmp ? '<div id="pg-cmp"><p>Comparing with ' + esc(cmp) + "…</p></div>" : "");
    if (!cmp) return;
    getPage(cmp).then(function (j) {
      var norm = function (x) { return (x.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []); };
      var a = norm(t), bb = norm(j.text), N = 5, set = {};
      for (var i = 0; i + N <= bb.length; i++) set[bb.slice(i, i + N).join(" ")] = 1;
      var hit = [], total = Math.max(0, a.length - N + 1), shared = 0;
      for (var k2 = 0; k2 < total; k2++) { var on = !!set[a.slice(k2, k2 + N).join(" ")]; if (on) shared++; hit.push(on); }
      var pct = total ? Math.round(shared / total * 100) : 0;
      // rebuild the matching passages
      var runs = [], cur = null; hit.forEach(function (on, i2) { if (on) { if (!cur) cur = [i2, i2 + N]; else cur[1] = i2 + N; } else if (cur) { runs.push(cur); cur = null; } }); if (cur) runs.push(cur);
      runs = runs.filter(function (r) { return r[1] - r[0] >= 8; }).sort(function (x, y) { return (y[1] - y[0]) - (x[1] - x[0]); }).slice(0, 8);
      $("pg-cmp").innerHTML = "<h3>Similarity with " + esc(j.host) + '</h3><div class="meter" role="img" aria-label="' + pct + '% matching"><span style="width:' + pct + "%;background:" + col(pct < 10, pct < 30) + '"></span></div><p><strong>' + pct + "%</strong> of your text appears word-for-word on that page (" + j.words.toLocaleString("en-GB") + " words checked). " + (pct < 10 ? "Little or no copying." : pct < 30 ? "Some shared passages – check they're quoted or your own." : "Heavy overlap – one copy is likely to be filtered out of search results.") + "</p>" +
        (runs.length ? "<p><strong>Longest matching passages:</strong></p><ul>" + runs.map(function (r) { return "<li>“" + esc(a.slice(r[0], r[1]).join(" ")) + "”</li>"; }).join("") + "</ul>" : "");
    }).catch(function (e) { $("pg-cmp").innerHTML = '<p class="s-fail">' + esc(e.message) + "</p>"; });
  });

  // ---- keyword difficulty checker
  var kd = $("kd-form");
  if (kd) {
    var kdLink = function () { var k = val("kd-kw"); var a = $("kd-google"); a.href = "https://www.google.co.uk/search?q=" + encodeURIComponent(k || "your keyword"); a.textContent = k ? "Search Google for “" + k + "”" : "Search Google"; };
    $("kd-kw").addEventListener("input", kdLink); kdLink();
    var BIG = /(^|\.)(wikipedia\.org|amazon\.(co\.uk|com)|ebay\.(co\.uk|com)|gov\.uk|nhs\.uk|bbc\.co\.uk|which\.co\.uk|youtube\.com|facebook\.com|linkedin\.com|tripadvisor\.(co\.uk|com)|checkatrade\.com|trustpilot\.com|yell\.com|argos\.co\.uk|johnlewis\.com|theguardian\.com|telegraph\.co\.uk|moneysavingexpert\.com|forbes\.com|indeed\.co\.uk|rightmove\.co\.uk|booking\.com|apple\.com|microsoft\.com|google\.com|ac\.uk)$/;
    var EASY = /(^|\.)(reddit\.com|quora\.com|mumsnet\.com|pistonheads\.com|stackexchange\.com|medium\.com|blogspot\.com|wordpress\.com|wixsite\.com|pinterest\.(co\.uk|com)|tiktok\.com)$|forum/;
    kd.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var k = val("kd-kw").toLowerCase(), out = $("kd-out");
      var urls = $("kd-urls").value.split(/\s+/).filter(function (x) { return /\./.test(x); }).slice(0, 10);
      if (!k) { $("kd-kw").focus(); return; } if (urls.length < 3) { out.innerHTML = '<p class="s-warn">Paste the addresses of at least 3 (ideally 10) pages that rank on page one for this keyword.</p>'; return; }
      var kws = k.split(/\s+/).filter(function (w) { return STOP.indexOf(" " + w + " ") < 0; });
      out.innerHTML = "<p>Checking " + urls.length + " pages…</p>";
      Promise.all(urls.map(function (u) { return getPage(u).then(function (j) { return j; }, function (e) { return { url: u, error: e.message }; }); })).then(function (res) {
        var has = function (s, all) { s = (s || "").toLowerCase(); return all ? s.indexOf(k) >= 0 : kws.every(function (w) { return s.indexOf(w) >= 0; }); };
        var rows = res.map(function (j) {
          if (j.error) return { j: j, s: null };
          var host = j.host, s = 0, why = [];
          if (BIG.test(host)) { s += 40; why.push("major site"); } else if (EASY.test(host)) { s -= 15; why.push("forum/Q&A or free blog"); }
          if (has(j.title, true)) { s += 15; why.push("exact phrase in title"); } else if (has(j.title)) { s += 9; why.push("keywords in title"); } else why.push("not targeted in title");
          if (j.h1.some(function (h) { return has(h); })) { s += 8; why.push("in H1"); }
          var first = j.text.split(" ").slice(0, 120).join(" "); if (has(first)) s += 5;
          s += j.words >= 1500 ? 14 : j.words >= 800 ? 10 : j.words >= 400 ? 6 : 0; why.push(j.words.toLocaleString("en-GB") + " words");
          if (j.ld.length) { s += 6; why.push("structured data"); }
          if (j.https) s += 3; if (j.ms < 800) s += 4;
          if (/\b(near me|in [a-z]+)\b/.test(k) && !has(j.title + " " + j.h1.join(" "))) s -= 5;
          return { j: j, s: Math.max(0, Math.min(100, s + 10)), why: why };
        });
        var ok = rows.filter(function (r) { return r.s != null; });
        if (!ok.length) { out.innerHTML = '<p class="s-fail">None of those pages could be read.</p>'; return; }
        var sorted = ok.map(function (r) { return r.s; }).sort(function (a, b) { return b - a; });
        var kdv = Math.round(sorted.reduce(function (n, v, i) { return n + v * (i < 3 ? 1.5 : 1); }, 0) / sorted.reduce(function (n, v, i) { return n + (i < 3 ? 1.5 : 1); }, 0));
        var weak = ok.filter(function (r) { return r.s < 40; }).length;
        var verdict = kdv < 35 ? ["Easy", "s-pass", "The pages ranking now are weak or don't target this phrase. A focused, genuinely useful page has a real chance."] : kdv < 60 ? ["Medium", "s-warn", "Beatable with a well-built page that answers the search better than what's there, plus some links or local signals."] : ["Hard", "s-fail", "Strong, well-targeted pages and big sites hold page one. Go for a longer, more specific version of this keyword first."];
        out.innerHTML = '<div class="ck-head" style="margin:16px 0"><div class="ring" style="--p:' + kdv + ";--c:" + (kdv < 35 ? "#1a7f37" : kdv < 60 ? "#9a6700" : "#cf222e") + '" role="img" aria-label="Difficulty ' + kdv + ' out of 100"><div><span><b>' + kdv + "</b><small>difficulty</small></span></div></div><div><p style=\"font-size:22px;margin:0\"><strong class=\"" + verdict[1] + "\">" + verdict[0] + "</strong></p><p>" + verdict[2] + "</p>" + (weak ? "<p><strong>" + weak + " of " + ok.length + "</strong> ranking pages look weak – those are the spots to take.</p>" : "") + "</div></div>" +
          '<div class="tablewrap"><table><thead><tr><th>#</th><th>Page</th><th>Strength</th><th>Why</th></tr></thead><tbody>' + rows.map(function (r, i) { return "<tr><td>" + (i + 1) + '</td><td style="overflow-wrap:anywhere;font-size:14px">' + esc((r.j.host || r.j.url) + "") + "<br><span class=\"small\">" + esc((r.j.title || "").slice(0, 80)) + "</span></td><td>" + (r.s == null ? '<span class="s-fail">' + esc(r.j.error) + "</span>" : '<b style="color:' + (r.s < 40 ? "#1a7f37" : r.s < 65 ? "#9a6700" : "#cf222e") + '">' + r.s + "</b>") + '</td><td class="small">' + (r.why ? esc(r.why.join(" · ")) : "") + "</td></tr>"; }).join("") + "</tbody></table></div>" +
          '<p class="small">An estimate from how strongly each ranking page targets the keyword and what kind of site it is. Backlinks aren\'t measured here, so treat big-name sites as harder than they look – check any site\'s links with the <a href="/backlink-checker">backlink checker</a>.</p>';
      });
    });
  }

  // ---- backlink checker (index of every linked domain, built from Common Crawl's public web graph)
  var bl = $("bl-form");
  if (bl) {
    var strengthCell = function (v) { return '<b style="color:' + col(v >= 40, v >= 20) + '">' + v + "</b>"; };
    var linkerRows = function (list, start) {
      return list.map(function (l, i) { return "<tr><td>" + (start + i + 1) + '</td><td style="overflow-wrap:anywhere">' + esc(l[0]) + '</td><td class="num">' + strengthCell(l[1]) + "</td></tr>"; }).join("");
    };
    var linkerTable = function (list, more) {
      return '<div class="tablewrap"><table><thead><tr><th>#</th><th>Website linking to it</th><th>Link strength</th></tr></thead><tbody>' + linkerRows(list.slice(0, 25), 0) +
        (list.length > 25 ? '</tbody><tbody class="bl-more" hidden>' + linkerRows(list.slice(25), 25) : "") + "</tbody></table></div>" +
        (list.length > 25 ? '<p><button class="btn ghost bl-show" type="button">Show all ' + list.length + "</button></p>" : "") + (more ? '<p class="small">' + more + "</p>" : "");
    };
    var summary = function (r, label) {
      if (!r.found) return '<div class="card" style="margin:16px 0"><p class="ct">' + esc(label) + ": " + esc(r.domain) + '</p><p>No links to this site were found in the data. That\'s common for new or small sites – Common Crawl doesn\'t visit every page on the web, so some links may be missing.</p></div>';
      return '<div class="card" style="margin:16px 0"><p class="ct">' + esc(label) + ": " + esc(r.domain) + '</p><div class="row" style="gap:28px"><div><b style="font-size:30px">' + r.refDomains.toLocaleString("en-GB") + '</b><br><span class="small">websites link to it</span></div><div><b style="font-size:30px;color:' + col(r.strength >= 40, r.strength >= 20) + '">' + r.strength + '</b><br><span class="small">link strength (0–100)</span></div></div><p class="small" style="margin-top:10px"><a href="/site/' + encodeURIComponent(r.domain) + '">Full website report for ' + esc(r.domain) + '</a></p></div>';
    };
    var qd = (location.search.match(/[?&]d=([^&]+)/) || [])[1];
    if (qd && !val("bl-d")) { try { $("bl-d").value = decodeURIComponent(qd.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { bl.requestSubmit ? bl.requestSubmit() : bl.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    bl.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = val("bl-d"), vs = val("bl-vs"), out = $("bl-out");
      if (!d) { $("bl-d").focus(); return; }
      out.innerHTML = "<p>Looking up links…</p>";
      fetch("/api/backlinks?d=" + encodeURIComponent(d) + (vs ? "&vs=" + encodeURIComponent(vs) : "")).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var y = j.you, h = summary(y, "Your site");
        if (y.found) h += "<h3>Strongest websites linking to " + esc(y.domain) + "</h3>" + linkerTable(y.linkers, y.refDomains > y.linkers.length ? "Showing the " + y.linkers.length + " strongest of " + y.refDomains.toLocaleString("en-GB") + "." : "");
        if (j.them) {
          var t = j.them;
          h += "<h2 style=\"margin-top:32px\">Link gap: " + esc(y.domain) + " vs " + esc(t.domain) + "</h2>" + summary(t, "Competitor");
          if (t.found) {
            h += j.gap.length ? "<p><strong>" + j.gap.length + " website" + (j.gap.length === 1 ? "" : "s") + " link to " + esc(t.domain) + " but not to you</strong>, strongest first – these are your best link prospects. Ask yourself why they link to your competitor: a supplier, a directory, a local club, a news story or a useful guide?</p>" + linkerTable(j.gap, "Compared using each site's " + j.topK + " strongest linking websites.")
              : "<p>Every website among the strongest that link to " + esc(t.domain) + " links to you too. Nice work.</p>";
          }
        }
        h += '<p class="small" style="margin-top:20px">Link data: Common Crawl\'s public web graph, ' + esc(j.months) + ". Counts are websites (domains), not individual links, and include all link types. Refreshed every three months.</p>";
        out.innerHTML = h;
        Array.prototype.forEach.call(out.querySelectorAll(".bl-show"), function (b) {
          b.addEventListener("click", function () { var tb = b.parentNode.previousElementSibling.querySelector(".bl-more"); if (tb) tb.hidden = false; b.parentNode.hidden = true; });
        });
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t look that up – please try again.</p>'; });
    });
  }

  // ---- domain authority checker (same index, up to 100 sites in batches of 10)
  var da = $("da-form");
  if (da) da.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var seen = {}, sites = $("da-urls").value.split(/[\s,]+/).filter(function (x) { x = x.toLowerCase(); if (!/\./.test(x) || seen[x]) return false; seen[x] = 1; return true; }).slice(0, 100);
    var out = $("da-out"); if (!sites.length) { out.innerHTML = '<p class="s-warn">Add at least one website.</p>'; return; }
    var res = sites.map(function () { return null; }), batches = [], meta = null, failed = "", sorted = false;
    for (var b = 0; b < sites.length; b += 10) batches.push(b);
    var num = function (n) { return Number(n).toLocaleString("en-GB"); };
    var draw = function () {
      var done = res.filter(Boolean).length, order = sites.map(function (s, i) { return i; });
      if (sorted) order.sort(function (a, b) { return ((res[b] && res[b].authority) || -1) - ((res[a] && res[a].authority) || -1); });
      out.innerHTML = (done < sites.length ? '<p class="small">' + done + " of " + sites.length + " checked…</p>" : "") + (failed ? '<p class="s-fail">' + esc(failed) + "</p>" : "") +
        '<div class="tablewrap"><table><thead><tr><th>Website</th><th>Authority</th><th>Linking websites</th><th>Global rank</th></tr></thead><tbody>' + order.map(function (i) {
          var r = res[i]; if (!r) return "<tr><td>" + esc(sites[i]) + '</td><td colspan="3" class="small">Waiting…</td></tr>';
          if (r.error) return '<tr><td style="overflow-wrap:anywhere">' + esc(r.input) + '</td><td colspan="3" class="s-fail">' + esc(r.error) + "</td></tr>";
          if (!r.found) return '<tr><td style="overflow-wrap:anywhere">' + esc(r.domain) + '</td><td><b>0</b></td><td colspan="2" class="small">No links found</td></tr>';
          return '<tr><td style="overflow-wrap:anywhere"><a href="/backlink-checker?d=' + encodeURIComponent(r.domain) + '">' + esc(r.domain) + '</a></td><td><b style="color:' + col(r.authority >= 40, r.authority >= 20) + '">' + r.authority + "</b></td><td>" + num(r.refDomains) + "</td><td>" + (r.rank ? "#" + num(r.rank) : "–") + "</td></tr>";
        }).join("") + "</tbody></table></div>" +
        (done === sites.length ? '<div class="row"><button type="button" class="btn ghost" id="da-csv">Download CSV</button>' + (sites.length > 1 ? '<button type="button" class="btn ghost" id="da-sort">' + (sorted ? "Original order" : "Sort by authority") + "</button>" : "") + "</div>" : "") +
        (meta ? '<p class="small">Authority 0–100 ' + (meta.ranks ? "from each site's position in Common Crawl's ranking of " + num(meta.ranked) + " websites by how central they are in the web's link map" : "from how many websites link to each site, on a log scale") + ". Link data: " + esc(meta.months) + ". Click a website to see its backlinks.</p>" : "");
      var c = $("da-csv"); if (c) c.onclick = function () {
        var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        var rows = [["website", "authority", "linking_websites", "global_rank", "top_linking_websites"]].concat(res.map(function (r, i) { return !r ? [sites[i], "error"] : r.error ? [r.input, "error", r.error] : [r.domain, r.authority, r.refDomains, r.rank || "", (r.top || []).join(" ")]; }));
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n")], { type: "text/csv" })); a.download = "xkey-domain-authority.csv"; document.body.appendChild(a); a.click(); a.remove();
      };
      var so = $("da-sort"); if (so) so.onclick = function () { sorted = !sorted; draw(); };
    };
    var next = 0;
    var work = function () {
      if (next >= batches.length) return; var start = batches[next++], part = sites.slice(start, start + 10);
      fetch("/api/authority?d=" + encodeURIComponent(part.join(","))).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) throw new Error(j.error);
        meta = j; j.results.forEach(function (r, k) { res[start + k] = r; });
      }).catch(function (e) {
        failed = (e && e.message) || "Couldn't look those up – please try again.";
        part.forEach(function (s, k) { res[start + k] = { input: s, error: "Not checked" }; });
      }).then(function () { draw(); work(); });
    };
    draw(); work(); work();
  });

  // ---- whole-site broken link checker (/api/links/page crawls, /api/links/check tests links)
  var lk = $("lk-form");
  if (lk) lk.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var raw = $("lk-url").value.trim(), out = $("lk-out");
    if (!raw) { $("lk-url").focus(); return; }
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    var maxPages = +$("lk-max").value, withExt = $("lk-ext").value === "1", MAXL = 2500;
    var host; try { raw = new URL(raw).href; host = new URL(raw).hostname.replace(/^www\./, ""); } catch (e) { out.innerHTML = '<p class="s-fail">That doesn\'t look like a web address.</p>'; return; }
    var pageLike = function (u) { return !/\.(jpe?g|png|gif|webp|avif|svg|ico|pdf|zip|docx?|xlsx?|pptx?|mp4|mp3|css|js|xml|txt|json|rss)(\?|$)/i.test(u); };
    var queue = [raw], queued = {}, pages = [], links = {}, order = [], toCheck = [], activeP = 0, activeC = 0, stopped = false, fatal = "", capped = false;
    queued[raw] = 1;
    var stop = $("lk-stop"); stop.style.display = ""; stop.onclick = function () { stopped = true; stop.style.display = "none"; draw(); };
    var addLink = function (l, page) {
      var x = links[l.url];
      if (!x) {
        if (order.length >= MAXL) { capped = true; return; }
        x = links[l.url] = { url: l.url, kind: l.kind, internal: l.internal, from: [], r: null }; order.push(l.url);
        if (l.internal || withExt) toCheck.push(l.url);
      }
      if (x.from.length < 50 && !x.from.some(function (f) { return f.page === page; })) x.from.push({ page: page, text: l.text });
    };
    var num = function (n) { return Number(n).toLocaleString("en-GB"); };
    var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var by = function (v) { return order.map(function (u) { return links[u]; }).filter(function (x) { return x.r && x.r.verdict === v; }); };
    var rows = function (list, showFinal) {
      return '<div class="tablewrap"><table><thead><tr><th>' + (showFinal ? "Link → goes to" : "Link") + "</th><th>Status</th><th>Found on</th></tr></thead><tbody>" + list.map(function (x) {
        var f = x.from[0] || {};
        return '<tr><td style="overflow-wrap:anywhere"><a href="' + esc(x.url) + '" rel="nofollow noopener" target="_blank">' + esc(x.url) + "</a>" + (showFinal && x.r.final ? '<br><span class="small">→ ' + esc(x.r.final) + "</span>" : "") + '<br><span class="small">' + (x.kind === "image" ? "Image" : x.internal ? "Link to your site" : "Link to another site") + (f.text ? " · “" + esc(f.text) + "”" : "") + "</span></td>" +
          '<td><b style="color:' + col(x.r.verdict === "redirect", x.r.verdict === "blocked") + '">' + (x.r.status || "–") + "</b>" + (x.r.note ? '<br><span class="small">' + esc(x.r.note) + "</span>" : "") + "</td>" +
          '<td style="overflow-wrap:anywhere"><a href="' + esc(f.page) + '" rel="nofollow noopener" target="_blank">' + esc((f.page || "").replace(/^https?:\/\/[^\/]+/, "") || "/") + "</a>" + (x.from.length > 1 ? '<br><span class="small">and ' + (x.from.length - 1) + " more page" + (x.from.length > 2 ? "s" : "") + "</span>" : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    };
    var finished = function () { return stopped || ((!queue.length || pages.length >= maxPages) && !activeP && !toCheck.length && !activeC); };
    var draw = function () {
      var checked = order.filter(function (u) { return links[u].r; }).length, todo = order.filter(function (u) { var x = links[u]; return x.internal || withExt; }).length;
      var broken = by("broken"), blocked = by("blocked"), redir = by("redirect"), done = finished();
      var h = '<p class="small">' + (done ? (stopped ? "Stopped. " : "Finished. ") : "Checking… ") + "Crawled " + num(pages.length) + " page" + (pages.length === 1 ? "" : "s") + " · tested " + num(checked) + " of " + num(todo) + " links and images</p>" + (fatal ? '<p class="s-fail">' + esc(fatal) + "</p>" : "");
      h += '<div class="card" style="margin:16px 0"><div class="row" style="gap:28px"><div><b style="font-size:30px;color:' + col(!broken.length, false) + '">' + num(broken.length) + '</b><br><span class="small">broken</span></div><div><b style="font-size:30px">' + num(redir.length) + '</b><br><span class="small">redirecting</span></div><div><b style="font-size:30px">' + num(blocked.length) + '</b><br><span class="small">blocked our checker</span></div><div><b style="font-size:30px">' + num(pages.length) + '</b><br><span class="small">pages crawled</span></div></div></div>';
      if (broken.length) h += "<h3>Broken links and images</h3>" + rows(broken);
      else if (done && checked) h += '<p><strong style="color:#1a7f37">No broken links found.</strong></p>';
      if (blocked.length) h += "<details><summary style=\"cursor:pointer\"><strong>" + blocked.length + " link" + (blocked.length === 1 ? "" : "s") + " refused our checker</strong> – check these in your browser</summary>" + rows(blocked) + "</details>";
      if (redir.length) h += "<details><summary style=\"cursor:pointer\"><strong>" + redir.length + " link" + (redir.length === 1 ? "" : "s") + " redirect</strong> – point them straight at the final address</summary>" + rows(redir, true) + "</details>";
      if (done && (broken.length || blocked.length || redir.length)) h += '<div class="row"><button type="button" class="btn ghost" id="lk-csv">Download CSV</button></div>';
      if (done && (capped || pages.length >= maxPages)) h += '<p class="small">Stopped at ' + (capped ? num(MAXL) + " links" : num(maxPages) + " pages") + ". For bigger sites, use the <a href=\"/website-crawler\">website crawler</a>.</p>";
      out.innerHTML = h;
      var c = $("lk-csv"); if (c) c.onclick = function () {
        var all = [["link", "status", "result", "goes_to", "type", "link_text", "found_on"]];
        broken.concat(blocked, redir).forEach(function (x) { x.from.forEach(function (f) { all.push([x.url, x.r.status, x.r.verdict + (x.r.note ? ": " + x.r.note : ""), x.r.final || "", x.kind === "image" ? "image" : x.internal ? "internal" : "external", f.text, f.page]); }); });
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + all.map(function (r) { return r.map(cell).join(","); }).join("\r\n")], { type: "text/csv" })); a.download = "xkey-broken-links-" + host + ".csv"; document.body.appendChild(a); a.click(); a.remove();
      };
      if (done) stop.style.display = "none";
    };
    var crawl = function () {
      if (stopped || !queue.length || pages.length + activeP >= maxPages) { if (finished()) draw(); return; }
      var u = queue.shift(); activeP++;
      fetch("/api/links/page?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error && !j.links) { if (!pages.length) fatal = j.error; return; }
        pages.push(j);
        if (j.url !== j.start && links[j.start] && !links[j.start].r && j.status === 200) links[j.start].r = { status: 200, verdict: "redirect", final: j.url };
        if (j.status === 200 && links[j.url] && !links[j.url].r) { links[j.url].r = { status: 200, verdict: "ok" }; toCheck = toCheck.filter(function (x) { return x !== j.url; }); }
        (j.links || []).forEach(function (l) {
          addLink(l, j.url);
          if (l.internal && l.kind === "link" && pageLike(l.url) && !queued[l.url] && pages.length + queue.length + activeP < maxPages * 2) { queued[l.url] = 1; queue.push(l.url); }
        });
      }).catch(function () {}).then(function () { activeP--; draw(); setTimeout(crawl, 500); check(); });
    };
    var check = function () {
      if (stopped || activeC >= 2 || !toCheck.length) { if (finished()) draw(); return; }
      var part = toCheck.splice(0, 10); activeC++;
      fetch("/api/links/check?" + part.map(function (x) { return "u=" + encodeURIComponent(x); }).join("&")).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { fatal = j.error; stopped = true; return; }
        j.results.forEach(function (r) { if (r.verdict === "later") toCheck.push(r.url); else if (links[r.url] && !links[r.url].r) links[r.url].r = r; });
      }).catch(function () { part.forEach(function (x) { if (links[x] && !links[x].r) links[x].r = { status: 0, verdict: "broken", note: "Couldn't test" }; }); }).then(function () { activeC--; draw(); check(); });
      check();
    };
    out.innerHTML = '<p class="small">Starting…</p>';
    crawl(); setTimeout(crawl, 250);
  });

  // ---- DNS lookup (/api/dns)
  var dn = $("dn-form");
  if (dn) {
    var dnq = (location.search.match(/[?&]d=([^&]+)/) || [])[1];
    if (dnq && !$("dn-d").value.trim()) { try { $("dn-d").value = decodeURIComponent(dnq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { dn.requestSubmit ? dn.requestSubmit() : dn.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    dn.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("dn-d").value.trim(), out = $("dn-out");
      if (!d) { $("dn-d").focus(); return; }
      out.innerHTML = "<p>Looking up DNS…</p>";
      fetch("/api/dns?d=" + encodeURIComponent(d)).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
        var h = '<div class="card" style="margin:16px 0"><p class="ct">' + esc(j.name) + (j.dnssec ? ' <span class="small">· DNSSEC signed</span>' : "") + '</p><ul style="list-style:none;padding:0;margin:8px 0">' + j.checks.map(function (n) { return '<li style="margin:6px 0;overflow-wrap:anywhere;color:' + lc[n.level] + '"><b>' + icon[n.level] + "</b> " + esc(n.text) + "</li>"; }).join("") + "</ul></div>";
        if (j.exists) {
          var rows = [];
          ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "CAA", "SOA"].forEach(function (t) {
            var seen = {};
            (j.records[t] || []).forEach(function (a) { var k = a.type + a.name + a.data; if (seen[k] || (a.type !== t && !(t === "A" && a.type === "CNAME"))) return; seen[k] = 1; rows.push(a); });
          });
          if (j.www) j.www.answers.forEach(function (a) { rows.push(a); });
          (j.dmarc || []).forEach(function (t) { rows.push({ type: "TXT", name: "_dmarc." + j.name, ttl: "", data: t }); });
          h += rows.length ? '<div class="tablewrap"><table><thead><tr><th>Type</th><th>Name</th><th>Value</th><th>TTL</th></tr></thead><tbody>' + rows.map(function (a) { return "<tr><td><b>" + esc(a.type) + '</b></td><td style="overflow-wrap:anywhere">' + esc(a.name) + '</td><td style="overflow-wrap:anywhere;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px">' + esc(a.data) + '</td><td class="small">' + esc(a.ttl === "" ? "" : a.ttl + "s") + "</td></tr>"; }).join("") + "</tbody></table></div>" : "<p>No records found.</p>";
        }
        h += '<p class="small">Answers from public DNS (Cloudflare 1.1.1.1, Google as a backup). Recent changes may take up to each record\'s TTL to show. Also check the site\'s <a href="/whois-lookup?d=' + encodeURIComponent(j.name) + '">WHOIS record</a> and <a href="/http-header-checker?url=' + encodeURIComponent(j.name) + '">HTTP headers</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t look that up – please try again.</p>'; });
    });
  }

  // shared: submit a one-box form straight away when its page is opened with ?param=
  var prefill = function (form, input, param) {
    var q = (location.search.match(new RegExp("[?&]" + param + "=([^&]+)")) || [])[1];
    if (q && !$(input).value.trim()) { try { $(input).value = decodeURIComponent(q.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
  };
  var noteList = function (notes) {
    var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
    return notes.length ? '<ul style="list-style:none;padding:0;margin:8px 0">' + notes.map(function (n) { return '<li style="margin:6px 0;overflow-wrap:anywhere;color:' + lc[n[0]] + '"><b>' + icon[n[0]] + "</b> " + esc(n[1]) + "</li>"; }).join("") + "</ul>" : "";
  };

  // ---- MX lookup, SPF, DMARC and DKIM checkers (one form, data-t picks the main result; /api/email)
  var em = $("em-form");
  if (em) {
    var emT = em.getAttribute("data-t");
    var emS = (location.search.match(/[?&]s=([^&]+)/) || [])[1];
    if (emS && $("em-s") && !$("em-s").value) { try { $("em-s").value = decodeURIComponent(emS); } catch (e) {} }
    prefill(em, "em-d", "d");
    var emLabel = { mx: "MX lookup", spf: "SPF checker", dmarc: "DMARC checker", dkim: "DKIM checker" };
    var emWorst = function (checks) { return checks.some(function (c) { return c.level === "fail"; }) ? "fail" : checks.some(function (c) { return c.level === "warn"; }) ? "warn" : "ok"; };
    var emNotes = function (checks) { return noteList(checks.map(function (c) { return [c.level, c.text]; })); };
    var row = function (k, v) { return '<tr><th scope="row" style="text-align:left;vertical-align:top">' + esc(k) + '</th><td style="overflow-wrap:anywhere">' + v + "</td></tr>"; };
    var DM = { v: "Version", p: "Policy for this domain", sp: "Policy for subdomains", pct: "Share of failing email the policy applies to (%)", rua: "Where daily summary reports go", ruf: "Where failure reports go", adkim: "DKIM alignment (r = relaxed, s = strict)", aspf: "SPF alignment (r = relaxed, s = strict)", fo: "When to send failure reports", rf: "Failure report format", ri: "Seconds between summary reports", np: "Policy for subdomains that don't exist" };
    var Q = { "+": "", "-": "-", "~": "~", "?": "?" };
    var spfTree = function (node, depth) {
      if (!node || !node.terms || !node.terms.length) return "";
      return '<ul style="margin:4px 0;padding-left:' + (depth ? 18 : 0) + 'px;list-style:' + (depth ? "disc" : "none") + '">' + node.terms.map(function (t) {
        var c = t.child, label = Q[t.q] + t.type + (t.value ? (/^\//.test(t.value) ? "" : t.type === "redirect" ? "=" : ":") + t.value : "");
        var extra = t.sender ? " – " + esc(t.sender) : "";
        if (c && c.missing) extra += ' <span style="color:#cf222e">– no SPF record here</span>';
        if (c && c.loop) extra += ' <span style="color:#cf222e">– loop</span>';
        if (c && c.skipped) extra += ' <span class="small">(not followed)</span>';
        return '<li style="margin:4px 0;overflow-wrap:anywhere"><code>' + esc(label) + "</code>" + extra + (c && c.terms ? spfTree(c, depth + 1) : "") + "</li>";
      }).join("") + "</ul>";
    };
    em.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("em-d").value.trim(), out = $("em-out"), s = $("em-s") ? $("em-s").value.trim() : "";
      if (!d) { $("em-d").focus(); return; }
      out.innerHTML = "<p>Looking up the email records…</p>";
      fetch("/api/email?d=" + encodeURIComponent(d) + "&t=" + emT + (s ? "&s=" + encodeURIComponent(s) : "")).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var main = j[emT], worst = emWorst(main.checks), h = "";
        var verdict = {
          mx: j.mx.records.length ? j.mx.records.length + " mail server" + (j.mx.records.length > 1 ? "s" : "") : j.mx.nullMx ? "Doesn't receive email" : "No MX records",
          spf: j.spf.root.record ? (worst === "fail" ? "SPF has problems" : "SPF is set up") : "No SPF record",
          dmarc: j.dmarc.record ? (worst === "fail" ? "DMARC has problems" : "DMARC is set up") : "No DMARC record",
          dkim: j.dkim && j.dkim.found.length ? j.dkim.found.length + " DKIM key" + (j.dkim.found.length > 1 ? "s" : "") + " found" : "No DKIM key found",
        }[emT];
        h += '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.name) + '</p><p style="font-size:24px;margin:8px 0;color:' + col(worst === "ok", worst === "warn") + '"><b>' + esc(verdict) + "</b></p>" + emNotes(main.checks) + "</div>";
        if (emT === "mx" && j.mx.records.length) h += '<div class="tablewrap"><table><thead><tr><th>Priority</th><th>Mail server</th><th>Provider</th><th>IP address</th></tr></thead><tbody>' + j.mx.records.map(function (m) { return "<tr><td>" + m.pref + '</td><td style="overflow-wrap:anywhere">' + esc(m.host) + "</td><td>" + esc(m.provider || "–") + '</td><td style="overflow-wrap:anywhere">' + (m.ips ? (m.ips.length ? m.ips.map(esc).join("<br>") : '<span style="color:#cf222e">doesn\'t resolve</span>') : "–") + "</td></tr>"; }).join("") + '</tbody></table></div><p class="small">The lowest priority number is tried first.</p>';
        if (emT === "spf" && j.spf.root.record) h += '<h3>The SPF record</h3><p style="overflow-wrap:anywhere"><code id="em-rec">' + esc(j.spf.root.record) + '</code></p><p><b style="color:' + col(j.spf.lookups < 9, j.spf.lookups <= 10) + '">' + j.spf.lookups + " / 10</b> DNS lookups</p><h3>Every sender it allows</h3>" + spfTree(j.spf.root, 0) + '<p class="small">include, a, mx, ptr, exists and redirect each use one of the 10 lookups, counted through every include. ip4 and ip6 are free.</p>';
        if (emT === "dmarc" && j.dmarc.record) h += '<h3>The DMARC record' + (j.dmarc.at !== j.name ? " (on " + esc(j.dmarc.at) + ")" : "") + '</h3><p style="overflow-wrap:anywhere"><code id="em-rec">' + esc(j.dmarc.record) + '</code></p><div class="tablewrap"><table><thead><tr><th>Tag</th><th>Value</th><th>Meaning</th></tr></thead><tbody>' + Object.keys(j.dmarc.tags).map(function (k) { return "<tr><td><code>" + esc(k) + '</code></td><td style="overflow-wrap:anywhere">' + esc(j.dmarc.tags[k]) + "</td><td>" + esc(DM[k] || "Unknown tag – check for a typo") + "</td></tr>"; }).join("") + "</tbody></table></div>";
        if (emT === "dkim") {
          if (j.dkim.found.length) h += '<div class="tablewrap"><table><thead><tr><th>Selector</th><th>Key</th><th>Record</th></tr></thead><tbody>' + j.dkim.found.map(function (f) { return "<tr><td><code>" + esc(f.selector) + "</code></td><td>" + (f.revoked ? "revoked" : f.k === "ed25519" ? "ed25519" : f.bits + "-bit RSA") + '</td><td style="overflow-wrap:anywhere;font-size:13px">' + esc(f.record.length > 160 ? f.record.slice(0, 160) + "…" : f.record) + "</td></tr>"; }).join("") + "</tbody></table></div>";
          if (!s) h += '<p class="small">Selectors tried: ' + j.dkim.selectors.map(esc).join(", ") + ".</p>";
        }
        var others = ["mx", "spf", "dmarc", "dkim"].filter(function (k) { return k !== emT; });
        h += "<h3>The rest of " + esc(j.name) + "'s email set-up</h3><ul>" + others.map(function (k) {
          var link = '<a href="/' + { mx: "mx-lookup", spf: "spf-checker", dmarc: "dmarc-checker", dkim: "dkim-checker" }[k] + "?d=" + encodeURIComponent(j.name) + '">' + emLabel[k] + "</a>";
          if (k === "dkim") return "<li>DKIM: check the keys with the " + link + ".</li>";
          var w = emWorst(j[k].checks), first = j[k].checks.filter(function (c) { return c.level === w; })[0] || j[k].checks[0];
          return '<li style="overflow-wrap:anywhere"><b style="color:' + col(w === "ok", w === "warn") + '">' + (k === "mx" ? "MX" : k.toUpperCase()) + ":</b> " + esc(first ? first.text : "") + " " + link + "</li>";
        }).join("") + '</ul><p class="small">We read the public DNS records, live. That shows what the domain publishes, not whether one particular email passed – for that, look at the Authentication-Results header of an email you\'ve received.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t look that up – please try again.</p>'; });
    });
  }

  // ---- website down checker (uses /api/redirects)
  var ud = $("ud-form");
  if (ud) {
    prefill(ud, "ud-url", "url");
    ud.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("ud-url").value.trim(), out = $("ud-out");
      if (!u) { $("ud-url").focus(); return; }
      out.innerHTML = "<p>Checking right now…</p>";
      fetch("/api/redirects?u=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        var r = j.results && j.results[0];
        if (!r || r.error) { out.innerHTML = '<p class="s-fail">' + esc((r && r.error) || j.error || "Couldn't check that address.") + "</p>"; return; }
        var s = r.status, last = r.hops[r.hops.length - 1], ms = r.hops.reduce(function (t, h) { return t + (h.ms || 0); }, 0);
        var verdict = s === 0 ? ["fail", "It looks down", "The server didn't respond (" + last.text.toLowerCase() + "). It's down for us too, so it's probably not just you."]
          : s >= 500 ? ["fail", "It looks down", "The server answered with an error (HTTP " + s + " " + last.text + "). It's down for everyone, not just you."]
          : s === 401 || s === 403 || s === 429 ? ["warn", "It's up, but refused our check", "The server answered (HTTP " + s + "), so it's running, but it blocks automated checks. If it won't load for you, it may be blocking your connection too."]
          : s >= 400 ? ["warn", "The site is up, but this page isn't", "The server works but this address returns HTTP " + s + " " + last.text + ". Try the home page."]
          : ["ok", "It's up", "The site loaded for us (HTTP " + s + "). If it won't load for you, the problem is probably your connection, browser or DNS – see the steps below."];
        var c = { ok: "#1a7f37", warn: "#9a6700", fail: "#cf222e" }[verdict[0]];
        out.innerHTML = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(r.start) + '</p><p style="font-size:26px;margin:8px 0;color:' + c + '"><b>' + esc(verdict[1]) + "</b></p><p>" + esc(verdict[2]) + "</p>" +
          '<p class="small" style="overflow-wrap:anywhere">' + (s ? "Status " + s + " · " : "") + "answered in " + ms + " ms" + (r.redirects ? " · " + r.redirects + " redirect" + (r.redirects > 1 ? "s" : "") + " to " + esc(r.final) : "") + " · checked " + new Date().toLocaleTimeString("en-GB") + "</p>" +
          (r.problems.length && s ? '<p class="small">' + esc(r.problems[0]) + ' <a href="/redirect-checker">Check the redirects</a></p>' : "") +
          '<p><button class="btn ghost" type="button" id="ud-again">Check again</button></p></div>';
        $("ud-again").addEventListener("click", function () { ud.requestSubmit ? ud.requestSubmit() : ud.dispatchEvent(new Event("submit", { cancelable: true })); });
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t run the check – please try again.</p>'; });
    });
  }

  // ---- Open Graph checker (/api/meta)
  var oc = $("oc-form");
  if (oc) {
    prefill(oc, "oc-url", "url");
    oc.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("oc-url").value.trim(), out = $("oc-out");
      if (!u) { $("oc-url").focus(); return; }
      out.innerHTML = "<p>Reading the page…</p>";
      fetch("/api/meta?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.metas) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't read that page.") + "</p>"; return; }
        if (j.status !== 200) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "The page answered with HTTP " + j.status + ", so we couldn't read its tags.") + "</p>"; return; }
        var m = {}; j.metas.forEach(function (x) { if (m[x.key] == null) m[x.key] = x.content; });
        var canon = (j.links.filter(function (l) { return l.rel === "canonical"; })[0] || {}).href;
        var title = m["og:title"] || m["twitter:title"] || j.title, desc = m["og:description"] || m["twitter:description"] || m.description || "", img = m["og:image"] || m["og:image:url"] || m["twitter:image"] || "";
        var host = (m["og:url"] || j.url).replace(/^https?:\/\//, "").split(/[\/?#]/)[0];
        var n = [];
        if (!m["og:title"]) n.push(["warn", "No og:title. Platforms will fall back to the page title" + (j.title ? " (\"" + j.title + "\")" : "") + "."]); else n.push(["ok", "og:title is set."]);
        if (!m["og:description"]) n.push(["warn", "No og:description. Some platforms show no description at all without it."]); else n.push(["ok", "og:description is set."]);
        if (!img) n.push(["fail", "No og:image. Shares will show no picture, or a random one from the page – the biggest reason links get ignored."]);
        else if (!/^https:\/\//i.test(img)) n.push(["warn", "og:image should be a full https:// address (it's \"" + img + "\")."]);
        if (img && !m["og:image:alt"]) n.push(["info", "No og:image:alt – a short description of the image helps people using screen readers."]);
        if (!m["og:url"]) n.push(["info", "No og:url. Platforms will use the address that was shared."]);
        else if (canon && m["og:url"].replace(/\/$/, "") !== canon.replace(/\/$/, "")) n.push(["warn", "og:url (" + m["og:url"] + ") doesn't match the canonical address (" + canon + ")."]);
        if (!m["og:type"]) n.push(["info", "No og:type – \"website\" or \"article\" is assumed."]);
        if (!m["twitter:card"]) n.push(["info", "No twitter:card. X will show a small card; set it to summary_large_image for the big image."]);
        var dup = j.metas.filter(function (x) { return x.key === "og:title" || x.key === "og:description"; }).map(function (x) { return x.key; });
        if (dup.length !== new Set(dup).size) n.push(["warn", "Some og: tags appear twice, often from a theme and a plugin both adding them. Platforms may pick the wrong one."]);
        var safe = img && /^https?:\/\//i.test(img) ? img.replace(/[()'"\\\s]/g, encodeURIComponent) : "";
        var card = '<div class="ogc">' + (safe ? '<div class="ogi" style="background-image:url(&quot;' + safe + '&quot;)"></div>' : '<div class="ogi ogn">No image</div>') + '<div class="ogt"><span>' + esc((m["og:site_name"] ? m["og:site_name"] + " · " : "") + host.toUpperCase()) + "</span><b>" + esc(title || "(no title)") + "</b><small>" + esc(desc.slice(0, 160)) + "</small></div></div>";
        var tags = j.metas.filter(function (x) { return /^(og|twitter|article|fb):/.test(x.key); });
        out.innerHTML = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.url) + "</p>" + card + '<p class="small" id="oc-size"></p>' + noteList(n) + "</div>" +
          (tags.length ? '<div class="tablewrap"><table><tbody>' + tags.map(function (x) { return '<tr><th scope="row" style="text-align:left;white-space:nowrap;vertical-align:top">' + esc(x.key) + '</th><td style="overflow-wrap:anywhere">' + esc(x.content) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "<p>No Open Graph or Twitter card tags found on this page.</p>") +
          '<p class="small">Fix them with the <a href="/open-graph-generator">Open Graph generator</a>. Platforms cache cards, so re-share or use their debuggers after a change.</p>';
        if (safe) { var im = new Image(); im.onload = function () { var el = $("oc-size"); if (el) el.textContent = "Image: " + im.naturalWidth + " × " + im.naturalHeight + " pixels" + (im.naturalWidth < 600 ? " – too small for a large card (aim for 1200 × 630)." : im.naturalWidth < 1200 ? " – fine, but 1200 × 630 looks sharper." : " – a good size."); }; im.onerror = function () { var el = $("oc-size"); if (el) { el.textContent = "The image didn't load in your browser – check the address works."; el.style.color = "#cf222e"; } }; im.src = img; }
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t read that page – please try again.</p>'; });
    });
  }

  // ---- hreflang checker (/api/meta, then each alternate page)
  var hl = $("hl-form");
  if (hl) {
    prefill(hl, "hl-url", "url");
    var LANG = /^(x-default|[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?)$/i;
    var norm = function (x) { return String(x || "").replace(/#.*$/, "").replace(/\/$/, "").toLowerCase(); };
    hl.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("hl-url").value.trim(), out = $("hl-out");
      if (!u) { $("hl-url").focus(); return; }
      out.innerHTML = "<p>Reading the page…</p>";
      var meta = function (x) { return fetch("/api/meta?url=" + encodeURIComponent(x)).then(function (r) { return r.json(); }); };
      meta(u).then(function (j) {
        if (!j.links) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't read that page.") + "</p>"; return; }
        if (j.status !== 200) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "The page answered with HTTP " + j.status + ".") + "</p>"; return; }
        var alts = j.links.filter(function (l) { return l.rel.split(/\s+/).indexOf("alternate") >= 0 && l.hreflang; });
        var n = [], head = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.url) + "</p>";
        if (!alts.length) { out.innerHTML = head + noteList([["info", "No hreflang tags on this page. That's fine for a site in one language for one country; you only need them for translated or regional versions."]]) + (j.lang ? '<p class="small">The page says its language is "' + esc(j.lang) + '" (html lang).</p>' : "") + "</div>"; return; }
        var seen = {};
        alts.forEach(function (a) {
          var c = a.hreflang;
          if (!LANG.test(c)) n.push(["fail", "\"" + c + "\" isn't a valid hreflang code, so Google ignores it."]);
          else if (/-uk$/i.test(c)) n.push(["fail", "\"" + c + "\" uses UK, but the country code for the United Kingdom is GB (" + c.replace(/uk$/i, "GB") + ")."]);
          else if (/^uk$/i.test(c)) n.push(["warn", "\"uk\" means Ukrainian. For British English use en-GB."]);
          if (seen[c.toLowerCase()] && norm(seen[c.toLowerCase()]) !== norm(a.href)) n.push(["fail", "\"" + c + "\" points to two different pages."]);
          seen[c.toLowerCase()] = a.href;
        });
        if (!alts.some(function (a) { return norm(a.href) === norm(j.url); })) n.push(["warn", "The page doesn't list itself. Each version should include a hreflang tag pointing at its own address."]);
        if (!seen["x-default"]) n.push(["info", "No x-default. Add one for people whose language or country doesn't match any version."]);
        var others = alts.filter(function (a) { return norm(a.href) !== norm(j.url); }).slice(0, 20), rows = others.map(function () { return null; });
        var draw = function () {
          var done = rows.filter(Boolean).length, bad = rows.filter(function (r) { return r && !r.ok; }).length;
          out.innerHTML = head + noteList(n.concat(done === others.length ? [bad ? ["fail", bad + " of " + others.length + " alternate pages have a problem – see the table."] : ["ok", others.length ? "All " + others.length + " alternate pages load and link back." : "No other versions listed."]] : [])) + "</div>" +
            '<div class="tablewrap"><table><thead><tr><th>hreflang</th><th>Address</th><th>Status</th><th>Links back?</th></tr></thead><tbody>' + alts.map(function (a) {
              var i = others.indexOf(a), r = i >= 0 ? rows[i] : { status: 200, back: "this page", ok: true };
              return "<tr><td><b>" + esc(a.hreflang) + "</b>" + (a.header ? ' <span class="small">(header)</span>' : "") + '</td><td style="overflow-wrap:anywhere">' + esc(a.href) + "</td>" + (r ? '<td style="color:' + col(r.status === 200, false) + '">' + esc(r.status || "No response") + '</td><td style="color:' + col(r.ok, false) + '">' + esc(r.back) + "</td>" : '<td colspan="2" class="small">Checking…</td>') + "</tr>";
            }).join("") + "</tbody></table></div>" + (others.length < alts.filter(function (a) { return norm(a.href) !== norm(j.url); }).length ? '<p class="small">Only the first 20 alternate pages are checked.</p>' : "");
        };
        draw();
        var next = 0, work = function () {
          if (next >= others.length) return;
          var i = next++, a = others[i];
          meta(a.href).then(function (k) {
            var back = (k.links || []).some(function (l) { return l.hreflang && norm(l.href) === norm(j.url); });
            var redir = k.url && norm(k.url) !== norm(a.href);
            rows[i] = k.status !== 200 ? { status: k.status, back: "–", ok: false } : redir ? { status: "Redirects", back: "Points to " + k.url, ok: false } : { status: 200, back: back ? "Yes" : "No – add a tag pointing back", ok: back };
          }).catch(function () { rows[i] = { status: 0, back: "–", ok: false }; }).then(function () { draw(); work(); });
        };
        work(); work(); work();
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t read that page – please try again.</p>'; });
    });
  }

  // ---- website hosting checker (/api/hosting)
  var ho = $("ho-form");
  if (ho) {
    var hoq = (location.search.match(/[?&]d=([^&]+)/) || [])[1];
    if (hoq && !$("ho-d").value.trim()) { try { $("ho-d").value = decodeURIComponent(hoq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { ho.requestSubmit ? ho.requestSubmit() : ho.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    ho.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("ho-d").value.trim(), out = $("ho-out");
      if (!d) { $("ho-d").focus(); return; }
      out.innerHTML = "<p>Finding the host…</p>";
      fetch("/api/hosting?d=" + encodeURIComponent(d)).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
        var h = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.name) + "</p>";
        if (j.exists) h += '<p style="font-size:22px;margin:8px 0;overflow-wrap:anywhere"><b>' + (j.provider ? "Hosted by " + esc(j.provider) : "Host hidden") + "</b></p><p>" + esc(j.how) + "</p>" + (j.cdn.length ? '<p class="small">CDN and hosting signs: ' + esc(j.cdn.join(", ")) + "</p>" : "");
        if (j.notes.length) h += '<ul style="list-style:none;padding:0;margin:8px 0">' + j.notes.map(function (n) { return '<li style="margin:6px 0;color:' + lc[n.level] + '"><b>' + icon[n.level] + "</b> " + esc(n.text) + "</li>"; }).join("") + "</ul>";
        h += "</div>";
        if (j.ips.length) h += '<div class="tablewrap"><table><thead><tr><th>IP address</th><th>Network owner</th><th>Country</th><th>Reverse DNS</th></tr></thead><tbody>' + j.ips.map(function (i) { return '<tr><td style="overflow-wrap:anywhere;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px">' + esc(i.ip) + '</td><td style="overflow-wrap:anywhere">' + esc(i.org || "–") + (i.network ? '<br><span class="small">' + esc(i.network) + (i.range ? " · " + esc(i.range) : "") + "</span>" : "") + "</td><td>" + esc(i.country || "–") + '</td><td style="overflow-wrap:anywhere">' + esc(i.ptr || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>";
        if (j.exists) h += '<p class="small">IP owners from the regional internet registries (RIPE, ARIN and others). See everything the site runs on with the <a href="/website-technology-checker?url=' + encodeURIComponent(j.name) + '">technology checker</a>, or its <a href="/dns-lookup?d=' + encodeURIComponent(j.name) + '">DNS records</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that site – please try again.</p>'; });
    });
  }

  // ---- website technology checker (/api/tech)
  var tc = $("tc-form");
  if (tc) {
    var tcq = (location.search.match(/[?&]url=([^&]+)/) || [])[1];
    if (tcq && !$("tc-url").value.trim()) { try { $("tc-url").value = decodeURIComponent(tcq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { tc.requestSubmit ? tc.requestSubmit() : tc.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    tc.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("tc-url").value.trim(), out = $("tc-out");
      if (!u) { $("tc-url").focus(); return; }
      out.innerHTML = "<p>Looking at the site…</p>";
      fetch("/api/tech?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.tech) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't check that site.") + "</p>"; return; }
        var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
        var host = j.url.replace(/^https?:\/\//, "").split(/[\/?#]/)[0];
        var h = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.title || host) + '</p><p class="small" style="overflow-wrap:anywhere">' + esc(j.url) + (j.status ? " · HTTP " + j.status : "") + " · " + j.tech.length + (j.tech.length === 1 ? " technology" : " technologies") + " found</p>";
        if (j.error) h += '<p class="s-fail">' + esc(j.error) + "</p>";
        if (j.notes && j.notes.length) h += '<ul style="list-style:none;padding:0;margin:8px 0">' + j.notes.map(function (n) { return '<li style="margin:6px 0;color:' + lc[n.level] + '"><b>' + icon[n.level] + "</b> " + esc(n.text) + "</li>"; }).join("") + "</ul>";
        if (j.guide) h += '<p>Built with ' + esc(j.guide.name) + '? Our <a href="' + esc(j.guide.path) + '">' + esc(j.guide.name) + " SEO guide</a> shows where every SEO setting is.</p>";
        h += "</div>";
        var rows = [];
        j.groups.forEach(function (g) {
          var items = j.tech.filter(function (t) { return t.cat === g[0]; });
          if (items.length) rows.push("<tr><th scope=\"row\" style=\"text-align:left;vertical-align:top\">" + esc(g[1]) + "</th><td>" + items.map(function (t) { return "<b>" + esc(t.name) + "</b>" + (t.version ? " " + esc(t.version) : "") + ' <span class="small">(' + esc(t.how) + ")</span>"; }).join("<br>") + "</td></tr>");
        });
        h += rows.length ? '<div class="tablewrap"><table><tbody>' + rows.join("") + "</tbody></table></div>" : "<p>We couldn't spot any known technology on this page. It may be hand-built, or hide its fingerprints.</p>";
        h += '<p class="small">Found from the page\'s code, headers and cookies, and the domain\'s public DNS. Tools that load only after cookie consent or on other pages may not show. Next: run a <a href="/seo-checker?url=' + encodeURIComponent(j.url) + '">free SEO check</a> on this page, or see its <a href="/dns-lookup?d=' + encodeURIComponent(host) + '">DNS records</a> and <a href="/http-header-checker?url=' + encodeURIComponent(j.url) + '">HTTP headers</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that site – please try again.</p>'; });
    });
  }

  // ---- DNS propagation checker (/api/propagation)
  var dp = $("dp-form");
  if (dp) {
    var dpq = (location.search.match(/[?&]t=([A-Za-z]+)/) || [])[1];
    if (dpq) $("dp-t").value = dpq.toUpperCase();
    prefill(dp, "dp-d", "d");
    dp.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("dp-d").value.trim(), t = $("dp-t").value, out = $("dp-out");
      if (!d) { $("dp-d").focus(); return; }
      out.innerHTML = "<p>Asking " + t + " records from DNS services around the world…</p>";
      fetch("/api/propagation?d=" + encodeURIComponent(d) + "&t=" + t).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.resolvers) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't check that domain.") + "</p>"; return; }
        var ok = j.resolvers.filter(function (r) { return r.ok; }), same = ok.filter(function (r) { return r.match; }).length;
        var show = function (k) { return esc(k).replace(/\n/g, "<br>"); };
        var n = [];
        if (!ok.length) n.push(["fail", "None of the DNS services answered. Please try again in a moment."]);
        else if (same === ok.length) n.push(["ok", "All " + ok.length + " DNS services that answered give the same " + j.type + " record" + (j.fromAuthority ? " as your own name server" : "") + ". The change has spread."]);
        else n.push(["warn", same + " of " + ok.length + " DNS services give the " + (j.fromAuthority ? "same answer as your own name server" : "most common answer") + ". The others still have an older answer saved; it clears when its TTL (time to live) runs out."]);
        if (j.authority && !j.authority.ok) n.push(["info", "Your name server (" + j.authority.label + ") didn't answer us directly, so we compared the services with each other."]);
        if (j.expected === "(does not exist)") n.push(["info", j.name + " doesn't exist in DNS yet, or has been removed."]);
        else if (j.expected === "(no record)") n.push(["info", j.name + " has no " + j.type + " record" + (j.type === "A" ? ". If you've just added one, check the type and the host name (@ or www)." : ".")]);
        var maxTtl = 0; ok.forEach(function (r) { (r.answers || []).forEach(function (a) { if (a.ttl > maxTtl) maxTtl = a.ttl; }); });
        if (same < ok.length && maxTtl) n.push(["info", "The longest time left on a saved answer is about " + (maxTtl < 120 ? maxTtl + " seconds" : maxTtl < 7200 ? Math.round(maxTtl / 60) + " minutes" : Math.round(maxTtl / 3600) + " hours") + "."]);
        var row = function (r, label, place) {
          var st = !r.ok ? '<span class="small">' + esc(r.error) + "</span>" : r.match === false ? '<b class="s-warn">Different</b>' : r.match ? '<b class="s-pass">✓ Same</b>' : "";
          return "<tr><td><b>" + esc(label) + '</b><br><span class="small">' + esc(place) + '</span></td><td style="overflow-wrap:anywhere;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px">' + (r.ok ? show(r.key) : "–") + "</td><td>" + st + '</td><td class="small">' + (r.ok ? r.ms + " ms" : "") + "</td></tr>";
        };
        var h = '<div class="card" style="margin:16px 0"><p class="ct">' + esc(j.type) + " records for " + esc(j.name) + "</p>" + noteList(n) + "</div>" + '<div class="tablewrap"><table><thead><tr><th>DNS service</th><th>Answer</th><th>Status</th><th>Time</th></tr></thead><tbody>';
        if (j.authority) h += row({ ok: j.authority.ok, key: j.authority.key, error: j.authority.error, ms: j.authority.ms, match: j.authority.ok ? true : null }, "Your name server", j.authority.label + " (the source)");
        h += j.resolvers.map(function (r) { return row(r, r.label, "Based in " + r.country); }).join("") + "</tbody></table></div>";
        h += '<p class="small">Big public DNS services answer from the server nearest our checker, so this shows whether the main services have your change, not every broadband provider. See all of ' + esc(j.name) + '\'s records with our <a href="/dns-lookup?d=' + encodeURIComponent(j.name) + '">DNS lookup</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that domain – please try again.</p>'; });
    });
  }

  // ---- reverse DNS lookup (/api/ptr)
  var pt = $("pt-form");
  if (pt) {
    prefill(pt, "pt-q", "q");
    pt.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var q = $("pt-q").value.trim(), out = $("pt-out");
      if (!q) { $("pt-q").focus(); return; }
      out.innerHTML = "<p>Looking up…</p>";
      fetch("/api/ptr?q=" + encodeURIComponent(q)).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.results) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't look that up.") + "</p>"; return; }
        var rows = j.results, good = rows.filter(function (r) { return r.confirmed; }).length, none = rows.filter(function (r) { return !r.error && !r.ptr.length; }).length, n = [];
        if (none) n.push(["warn", none + " address" + (none > 1 ? "es have" : " has") + " no reverse DNS (PTR) record. A mail server without one gets most of its email rejected or marked as spam. Your hosting company or ISP sets PTR records, not your domain's DNS."]);
        var bad = rows.filter(function (r) { return r.ptr && r.ptr.length && !r.confirmed; }).length;
        if (bad) n.push(["warn", bad + " hostname" + (bad > 1 ? "s don't" : " doesn't") + " point back to the same IP address (no forward match). Gmail and Outlook check this for mail servers."]);
        if (good) n.push(["ok", good + " address" + (good > 1 ? "es have" : " has") + " a reverse DNS name that points back to the same IP (forward-confirmed)."]);
        var h = noteList(n) + '<div class="tablewrap"><table><thead><tr><th>IP address</th><th>Reverse DNS (PTR)</th><th>Points back?</th></tr></thead><tbody>' + rows.map(function (r) {
          if (r.error) return '<tr><td style="overflow-wrap:anywhere">' + esc(r.input) + '</td><td colspan="2" class="s-fail">' + esc(r.error) + "</td></tr>";
          return '<tr><td style="overflow-wrap:anywhere"><b>' + esc(r.ip) + "</b>" + (r.domain ? '<br><span class="small">' + esc(r.domain) + "</span>" : "") + '</td><td style="overflow-wrap:anywhere">' + (r.ptr.length ? r.ptr.map(esc).join("<br>") : '<span class="small">none</span>') + "</td><td>" + (r.confirmed ? '<b class="s-pass">✓ Yes</b>' : r.ptr.length ? '<b class="s-warn">No</b>' + (r.forward && r.forward.length ? '<br><span class="small">→ ' + esc(r.forward.join(", ")) + "</span>" : "") : "–") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
        h += '<p class="small">Find who owns an address with our <a href="/website-hosting-checker">hosting checker</a>, and check a domain\'s email setup with the <a href="/mx-lookup">MX lookup</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t look that up – please try again.</p>'; });
    });
  }

  // ---- meta tag checker (/api/meta)
  var mc = $("mc-form");
  if (mc) {
    prefill(mc, "mc-url", "url");
    mc.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("mc-url").value.trim(), out = $("mc-out");
      if (!u) { $("mc-url").focus(); return; }
      out.innerHTML = "<p>Reading the page…</p>";
      fetch("/api/meta?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.metas) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't read that page.") + "</p>"; return; }
        if (j.status !== 200) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "The page answered with HTTP " + j.status + ", so we couldn't read its tags.") + "</p>"; return; }
        var m = {}, cnt = {}; j.metas.forEach(function (x) { cnt[x.key] = (cnt[x.key] || 0) + 1; if (m[x.key] == null) m[x.key] = x.content; });
        var rel = function (r) { return j.links.filter(function (l) { return l.rel.split(/\s+/).indexOf(r) >= 0; }); };
        var t = j.title, d = m.description || "", tw = px(t, 20), dw = px(d, 14), n = [];
        if (!t) n.push(["fail", "No title tag. It's the headline Google shows for the page."]);
        else if (tw > 580) n.push(["warn", "The title is " + tw + " px wide (" + t.length + " characters). Google cuts titles at about 580 px, so the end won't show."]);
        else if (tw < 250) n.push(["info", "The title is short (" + t.length + " characters). There's room to add your main service or town."]);
        else n.push(["ok", "Title: " + t.length + " characters, " + tw + " px – a good length."]);
        if (!d) n.push(["warn", "No meta description. Google will write its own snippet from the page, which may not sell it."]);
        else if (dw > 990) n.push(["warn", "The description is " + dw + " px (" + d.length + " characters). Google cuts it at about 990 px on desktop."]);
        else if (dw < 400) n.push(["info", "The description is short (" + d.length + " characters). Aim for 120 to 155 characters with a reason to click."]);
        else n.push(["ok", "Description: " + d.length + " characters – a good length."]);
        if (cnt.description > 1) n.push(["warn", cnt.description + " meta descriptions. Keep one; often a theme and an SEO plugin both add it."]);
        if (cnt.title > 1) n.push(["info", "There's also a meta tag named \"title\", which Google ignores."]);
        var robots = ((m.robots || "") + "," + (m.googlebot || "")).toLowerCase();
        if (/noindex|none/.test(robots)) n.push(["fail", "robots says noindex, so Google won't show this page in search."]);
        else if (m.robots) n.push(["ok", "robots: " + m.robots]);
        if (/nofollow/.test(robots)) n.push(["info", "nofollow is set: Google won't follow links on this page."]);
        if (!m.viewport) n.push(["fail", "No viewport tag. Phones will show a shrunk desktop page; add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">."]);
        else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i.test(m.viewport)) n.push(["warn", "The viewport stops people zooming in, which makes the page hard to read for some visitors."]);
        var canon = rel("canonical");
        if (!canon.length) n.push(["warn", "No canonical tag. Add one pointing to the page's own clean address, so copies with tracking codes don't split its ranking."]);
        else if (canon.length > 1) n.push(["warn", canon.length + " canonical tags. Keep one."]);
        if (!j.lang) n.push(["warn", "No language on the <html> tag. Add lang=\"en-GB\" so browsers and screen readers know the language."]);
        if (!m["og:title"] || !m["og:image"]) n.push(["info", "Open Graph tags are " + (m["og:title"] || m["og:image"] ? "incomplete" : "missing") + ", so links shared on social media and messaging apps may look plain."]);
        if (!rel("icon").length && !rel("shortcut").length) n.push(["info", "No favicon link. Browsers will try /favicon.ico; Google needs a favicon to show next to your result."]);
        if (m.keywords) n.push(["info", "There's a meta keywords tag. Google has ignored it since 2009; it's harmless but shows competitors your keywords."]);
        var host = j.url.replace(/^https?:\/\//, "").split(/[\/?#]/)[0], crumbs = j.url.replace(/^https?:\/\//, "").split(/[?#]/)[0].split("/").filter(Boolean).slice(1).join(" › ");
        var h = '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc(j.url) + '</p><div class="serp"><div class="u">' + esc(host) + (crumbs ? " › " + esc(crumbs) : "") + '</div><div class="t">' + esc(tw > 580 ? cut(t, 20, 580) : t || "(no title)") + '</div><div class="d">' + esc(dw > 990 ? cut(d, 14, 990) : d || "(no description – Google will pick text from the page)") + "</div></div>" + noteList(n) + "</div>";
        h += '<h3>Every meta tag on the page</h3><div class="tablewrap"><table><thead><tr><th>Name</th><th>Content</th></tr></thead><tbody><tr><td><b>title</b></td><td style="overflow-wrap:anywhere">' + esc(t) + "</td></tr>" + (j.lang ? '<tr><td><b>html lang</b></td><td>' + esc(j.lang) + "</td></tr>" : "") + j.metas.map(function (x) { return "<tr><td><b>" + esc(x.key) + '</b></td><td style="overflow-wrap:anywhere">' + esc(x.content) + "</td></tr>"; }).join("") + canon.map(function (l) { return '<tr><td><b>link canonical</b></td><td style="overflow-wrap:anywhere">' + esc(l.href) + "</td></tr>"; }).join("") + "</tbody></table></div>";
        h += '<p class="small">Write better tags with our <a href="/meta-tag-generator">meta tag generator</a>, and preview sharing cards with the <a href="/open-graph-checker?url=' + encodeURIComponent(j.url) + '">Open Graph checker</a>.</p>';
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that page – please try again.</p>'; });
    });
  }
  // shared: one page's headings, images, structured data and indexing tags (/api/onpage)
  var onPage = function (u, out, then) {
    out.innerHTML = "<p>Reading the page…</p>";
    fetch("/api/onpage?url=" + encodeURIComponent(u)).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.headings) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "Couldn't read that page.") + "</p>"; return; }
      if (j.status !== 200) { out.innerHTML = '<p class="s-fail">' + esc(j.error || "The page answered with HTTP " + j.status + ", so we couldn't read it.") + "</p>"; return; }
      then(j);
    }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t check that page – please try again.</p>'; });
  };
  var pageHead = function (j) { return '<p class="ct" style="overflow-wrap:anywhere">' + esc(j.url) + "</p>" + (j.start && j.start.replace(/\/$/, "") !== j.url.replace(/\/$/, "") ? '<p class="small">Redirected from ' + esc(j.start) + ".</p>" : ""); };
  var oneBox = function (formId, inputId, run) {
    var f = $(formId); if (!f) return;
    prefill(f, inputId, "url");
    f.addEventListener("submit", function (ev) { ev.preventDefault(); var u = $(inputId).value.trim(); if (!u) { $(inputId).focus(); return; } run(u); });
  };

  // ---- schema markup validator (a page via /api/onpage, or pasted JSON-LD checked in the browser)
  var LOCAL = /^(LocalBusiness|ProfessionalService|HomeAndConstructionBusiness|Plumber|Electrician|HVACBusiness|RoofingContractor|GeneralContractor|HousePainter|Locksmith|MovingCompany|Dentist|Physician|MedicalClinic|MedicalBusiness|Optician|Pharmacy|VeterinaryCare|Restaurant|CafeOrCoffeeShop|BarOrPub|Bakery|FoodEstablishment|FastFoodRestaurant|Hotel|BedAndBreakfast|LodgingBusiness|Store|[A-Za-z]+Store|AutoRepair|AutoDealer|AutomotiveBusiness|HairSalon|BeautySalon|NailSalon|DaySpa|HealthAndBeautyBusiness|ExerciseGym|SportsActivityLocation|LegalService|Attorney|AccountingService|FinancialService|RealEstateAgent|InsuranceAgency|TravelAgency|ChildCare|EmergencyService|AnimalShelter|SelfStorage|EntertainmentBusiness|TattooParlor|Florist|EmploymentAgency|Notary|DryCleaningOrLaundry)$/;
  var SCHEMA = {
    Article: { rec: ["headline", "image", "datePublished", "dateModified", "author"] },
    Product: { req: ["name"], any: ["offers", "review", "aggregateRating"], rec: ["image", "description", "brand", "sku"] },
    LocalBusiness: { req: ["name", "address"], rec: ["telephone", "url", "openingHoursSpecification|openingHours", "image", "geo", "priceRange"] },
    Organization: { rec: ["name", "url", "logo", "sameAs"] },
    BreadcrumbList: { req: ["itemListElement"] },
    FAQPage: { req: ["mainEntity"] },
    Event: { req: ["name", "startDate", "location"], rec: ["endDate", "eventStatus", "image", "description", "offers", "organizer"] },
    Recipe: { req: ["name", "image"], rec: ["author", "datePublished", "description", "recipeIngredient", "recipeInstructions", "totalTime", "aggregateRating"] },
    Review: { req: ["itemReviewed", "author", "reviewRating"], rec: ["datePublished"] },
    AggregateRating: { req: ["itemReviewed", "ratingValue", "ratingCount|reviewCount"] },
    JobPosting: { req: ["title", "description", "datePosted", "hiringOrganization", "jobLocation|jobLocationType"], rec: ["validThrough", "employmentType", "baseSalary"] },
    VideoObject: { req: ["name", "thumbnailUrl", "uploadDate"], rec: ["description", "duration", "contentUrl|embedUrl"] },
    WebSite: { rec: ["name", "url"] },
    Course: { req: ["name", "description"], rec: ["provider"] },
    SoftwareApplication: { req: ["name"], any: ["aggregateRating", "review"], anyLevel: "warn", rec: ["offers", "applicationCategory", "operatingSystem"] },
    Person: { rec: ["name"] },
    HowTo: { rec: ["name", "step"] }
  };
  var ruleFor = function (t) { return /^(NewsArticle|BlogPosting|TechArticle|Report)$/.test(t) ? "Article" : LOCAL.test(t) ? "LocalBusiness" : /^(Corporation|NGO|EducationalOrganization|OnlineStore|NewsMediaOrganization)$/.test(t) ? "Organization" : /^(MobileApplication|WebApplication|VideoGame)$/.test(t) ? "SoftwareApplication" : SCHEMA[t] ? t : null; };
  var has = function (o, k) { return k.split("|").some(function (p) { var v = o[p]; return v != null && v !== "" && !(Array.isArray(v) && !v.length); }); };
  var schemaItems = function (blocks) {
    var items = [];
    blocks.forEach(function (b, bi) {
      if (b.error) return;
      var ctx = null;
      var walk = function (o) {
        if (Array.isArray(o)) { o.forEach(walk); return; }
        if (!o || typeof o !== "object") return;
        if (o["@context"]) ctx = o["@context"];
        if (o["@graph"]) { walk(o["@graph"]); if (!o["@type"]) return; }
        if (o["@type"]) items.push({ o: o, block: bi + 1, ctx: o["@context"] || ctx });
      };
      walk(b.data);
    });
    return items;
  };
  var checkItem = function (it) {
    var o = it.o, types = [].concat(o["@type"]).map(String), n = [];
    var ctx = typeof it.ctx === "string" ? it.ctx : it.ctx && JSON.stringify(it.ctx);
    if (!ctx) n.push(["fail", "No @context. Add \"@context\": \"https://schema.org\" or search engines can't tell which vocabulary this is."]);
    else if (!/schema\.org/i.test(ctx)) n.push(["warn", "@context isn't schema.org (" + ctx.slice(0, 80) + ")."]);
    var rule = null, rn = "";
    types.some(function (t) { var r = ruleFor(t.replace(/^https?:\/\/schema\.org\//i, "")); if (r) { rule = SCHEMA[r]; rn = r; return true; } return false; });
    if (!rule) { n.push(["info", "Google has no rich result for " + types.join(", ") + ", but search engines and AI tools can still read it."]); return n; }
    (rule.req || []).forEach(function (k) { if (!has(o, k)) n.push(["fail", "Missing " + k.split("|").join(" or ") + " – Google requires it for " + rn + " rich results."]); });
    if (rule.any && !rule.any.some(function (k) { return has(o, k); })) n.push([rule.anyLevel || "fail", "Needs at least one of " + rule.any.join(", ") + " to show as a rich result."]);
    var miss = (rule.rec || []).filter(function (k) { return !has(o, k); });
    if (miss.length) n.push(["warn", "Recommended but missing: " + miss.map(function (k) { return k.split("|").join(" or "); }).join(", ") + "."]);
    if (rn === "Product" && o.offers) [].concat(o.offers).forEach(function (f) { if (f && typeof f === "object" && !has(f, "price") && !has(f, "lowPrice")) n.push(["fail", "An offer has no price."]); else if (f && typeof f === "object" && !has(f, "priceCurrency")) n.push(["warn", "An offer has no priceCurrency (GBP for pounds)."]); if (f && typeof f === "object" && f.price != null && isNaN(parseFloat(String(f.price).replace(/,/g, "")))) n.push(["fail", "price should be a number such as 24.99, without the £ sign."]); });
    if (rn === "BreadcrumbList" && Array.isArray(o.itemListElement)) o.itemListElement.forEach(function (li, i) { if (!li || !has(li, "position") || !has(li, "name") && !(li.item && li.item.name)) n.push(["fail", "Breadcrumb " + (i + 1) + " needs a position and a name."]); else if (i < o.itemListElement.length - 1 && !has(li, "item")) n.push(["warn", "Breadcrumb " + (i + 1) + " has no item (address); only the last one may leave it out."]); });
    if (rn === "FAQPage") { [].concat(o.mainEntity || []).forEach(function (q, i) { if (!q || !has(q, "name") || !q.acceptedAnswer || !has(q.acceptedAnswer, "text")) n.push(["fail", "Question " + (i + 1) + " needs a name and an acceptedAnswer with text."]); }); n.push(["info", "Since 2023 Google shows FAQ rich results only for well-known government and health sites, but the markup still helps search engines and AI tools understand the page."]); }
    if (rn === "HowTo") n.push(["info", "Google stopped showing HowTo rich results in 2023. The markup is harmless but won't change how the page looks in search."]);
    var rating = rn === "AggregateRating" ? o : o.aggregateRating;
    if (rating && typeof rating === "object") { var rv = parseFloat(rating.ratingValue); if (isNaN(rv)) n.push(["fail", "aggregateRating needs a numeric ratingValue."]); else if (!has(rating, "ratingCount") && !has(rating, "reviewCount")) n.push(["fail", "aggregateRating needs ratingCount or reviewCount."]); if (rn === "LocalBusiness" || rn === "Organization") n.push(["warn", "Google doesn't show review stars for a business's reviews of itself (on its own site), so this rating won't appear as stars."]); }
    if (rn === "LocalBusiness" && o.address && typeof o.address === "object" && !Array.isArray(o.address)) { var miss2 = ["streetAddress", "addressLocality", "postalCode"].filter(function (k) { return !has(o.address, k); }); if (miss2.length) n.push(["warn", "The address is missing " + miss2.join(", ") + "."]); }
    if (!n.some(function (x) { return x[0] === "fail"; })) n.unshift(["ok", "Has the properties Google requires for " + rn + "."]);
    return n;
  };
  var showSchema = function (out, head, blocks, microdata, rdfa) {
    var items = schemaItems(blocks), broken = blocks.filter(function (b) { return b.error; });
    var h = '<div class="card" style="margin:16px 0">' + head;
    var n = [];
    if (!blocks.length) n.push([microdata.length || rdfa.length ? "info" : "warn", "No JSON-LD structured data found." + (microdata.length || rdfa.length ? " The page uses microdata or RDFa instead (listed below)." : " Google recommends JSON-LD; our schema generator writes it for you.")]);
    else n.push(["info", blocks.length + " JSON-LD block" + (blocks.length > 1 ? "s" : "") + ", " + items.length + " item" + (items.length === 1 ? "" : "s") + ": " + (items.map(function (it) { return [].concat(it.o["@type"]).join("/"); }).join(", ") || "none") + "."]);
    broken.forEach(function (b) { n.push(["fail", "A JSON-LD block is broken, so search engines ignore all of it: " + b.error]); });
    var seen = {};
    items.forEach(function (it) { var t = [].concat(it.o["@type"]).join("/"); if (/^(Organization|WebSite|LocalBusiness|BreadcrumbList|FAQPage)$/.test(t) || LOCAL.test(t)) { seen[t] = (seen[t] || 0) + 1; } });
    Object.keys(seen).forEach(function (t) { if (seen[t] > 1) n.push(["warn", seen[t] + " separate " + t + " items. Often a theme and a plugin both add one; keep one, with the right details."]); });
    h += noteList(n) + "</div>";
    items.slice(0, 40).forEach(function (it) {
      var o = it.o, name = o.name || o.headline || o.title || "";
      h += '<div class="card" style="margin:12px 0"><p class="ct" style="overflow-wrap:anywhere">' + esc([].concat(o["@type"]).join(" / ")) + (name && typeof name === "string" ? ' <span class="small">· ' + esc(name.slice(0, 80)) + "</span>" : "") + "</p>" + noteList(checkItem(it)) +
        '<details><summary class="small" style="cursor:pointer;padding:10px 0">Properties (' + Object.keys(o).length + ")</summary><pre class=\"out\" style=\"max-height:300px;overflow:auto\">" + esc(JSON.stringify(o, null, 2).slice(0, 6000)) + "</pre></details></div>";
    });
    broken.forEach(function (b) { if (b.raw) h += '<div class="card" style="margin:12px 0"><p class="ct s-fail">Broken JSON-LD</p><pre class="out" style="max-height:300px;overflow:auto">' + esc(b.raw) + "</pre></div>"; });
    if (microdata.length || rdfa.length) h += '<p class="small">Also on the page: ' + esc(microdata.concat(rdfa).join(", ")) + " (" + (microdata.length ? "microdata" : "RDFa") + "). These are listed only; JSON-LD is checked in full.</p>";
    h += '<p class="small">Build a clean LocalBusiness block with our <a href="/schema-generator">schema generator</a>. Google\'s rules change from time to time; its Rich Results Test is the final word on what it shows.</p>';
    out.innerHTML = h;
  };
  oneBox("sv-form", "sv-url", function (u) {
    var out = $("sv-out");
    onPage(u, out, function (j) { showSchema(out, pageHead(j), j.jsonld, j.microdata || [], j.rdfa || []); });
  });
  if ($("sv-check")) $("sv-check").addEventListener("click", function () {
    var code = $("sv-code").value.trim(), out = $("sv-out");
    if (!code) { $("sv-code").focus(); return; }
    var parts = /<script\b/i.test(code) ? (code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || []).map(function (s) { return s.replace(/^<script\b[^>]*>|<\/script>$/gi, ""); }) : [code];
    var blocks = parts.map(function (p) { try { return { data: JSON.parse(p.trim()) }; } catch (e) { return { error: e.message, raw: p.trim().slice(0, 2000) }; } });
    showSchema(out, '<p class="ct">Your code</p>', blocks, [], []);
  });

  // ---- heading checker (/api/onpage)
  oneBox("hc-form", "hc-url", function (u) {
    var out = $("hc-out");
    onPage(u, out, function (j) {
      var hs = j.headings, h1 = hs.filter(function (x) { return x.l === 1; }), n = [], count = [0, 0, 0, 0, 0, 0];
      hs.forEach(function (x) { count[x.l - 1]++; });
      if (!h1.length) n.push(["fail", "No H1. Give the page one main heading that says what it's about."]);
      else if (h1.length > 1) n.push(["warn", h1.length + " H1s. One clear H1 is best; make the others H2s."]);
      else if (!h1[0].t) n.push(["fail", "The H1 is empty (or only an image with no alt text)."]);
      else n.push(["ok", "One H1: \"" + h1[0].t + "\"."]);
      if (h1.some(function (x) { return x.hidden; })) n.push(["warn", "The H1 is hidden from visitors. Google may give hidden text less weight; show it on the page."]);
      if (h1.length && h1[0].t.length > 70) n.push(["info", "The H1 is " + h1[0].t.length + " characters. Shorter headings are easier to scan; put the key words first."]);
      if (h1.length && j.title && h1[0].t && h1[0].t.toLowerCase() === j.title.toLowerCase()) n.push(["info", "The H1 is the same as the page title. That's fine; some sites write a friendlier H1."]);
      if (hs.length && hs[0].l !== 1 && h1.length) n.push(["info", "The first heading is an H" + hs[0].l + ", before the H1. Often a theme puts headings in the header or top bar."]);
      var skips = [];
      hs.forEach(function (x, i) { if (i && x.l > hs[i - 1].l + 1) skips.push("H" + hs[i - 1].l + " → H" + x.l + (x.t ? " (\"" + x.t.slice(0, 40) + "\")" : "")); });
      if (skips.length) n.push(["warn", skips.length + " skipped level" + (skips.length > 1 ? "s" : "") + ", e.g. " + skips.slice(0, 2).join("; ") + ". Use the next level down and change the size with styling."]);
      var empty = hs.filter(function (x) { return !x.t; }).length;
      if (empty) n.push(["warn", empty + " empty heading" + (empty > 1 ? "s" : "") + ". Remove them or give them words."]);
      if (!count[1] && hs.length) n.push(["info", "No H2s. Longer pages read better broken into sections, each with an H2."]);
      var dupe = {}, dups = [];
      hs.forEach(function (x) { var k = x.l + x.t.toLowerCase(); if (x.t) { dupe[k] = (dupe[k] || 0) + 1; if (dupe[k] === 2) dups.push(x.t); } });
      if (dups.length) n.push(["info", "Repeated headings: " + dups.slice(0, 3).map(function (t) { return "\"" + t.slice(0, 40) + "\""; }).join(", ") + "."]);
      var h = '<div class="card" style="margin:16px 0">' + pageHead(j) + '<p class="small">' + hs.length + " heading" + (hs.length === 1 ? "" : "s") + ": " + count.map(function (c, i) { return "H" + (i + 1) + " " + c; }).join(" · ") + "</p>" + noteList(n) + "</div>";
      if (hs.length) h += '<h3>Heading outline</h3><ol style="list-style:none;padding:0;margin:8px 0">' + hs.map(function (x) {
        return '<li style="margin:4px 0;padding-left:' + (x.l - 1) * 18 + 'px;overflow-wrap:anywhere"><b style="display:inline-block;min-width:32px;color:' + (x.l === 1 ? "#1a7f37" : "inherit") + '">H' + x.l + "</b> " + (x.t ? esc(x.t) : '<span class="s-fail">(empty)</span>') + (x.hidden ? ' <span class="small">(hidden)</span>' : "") + "</li>";
      }).join("") + "</ol>";
      h += '<p class="small">Next, check the page\'s <a href="/title-tag-checker">title and description</a> and its <a href="/alt-text-checker?url=' + encodeURIComponent(j.url) + '">image alt text</a>.</p>';
      out.innerHTML = h;
    });
  });

  // ---- alt text checker (/api/onpage)
  oneBox("at-form", "at-url", function (u) {
    var out = $("at-out");
    onPage(u, out, function (j) {
      var imgs = j.images, alts = {}, rows = [], c = { missing: 0, link: 0, weak: 0, deco: 0, ok: 0 };
      imgs.forEach(function (x) { if (x.alt) alts[x.alt.toLowerCase()] = (alts[x.alt.toLowerCase()] || 0) + 1; });
      imgs.forEach(function (x) {
        var a = x.alt, v;
        var deco = x.role === "presentation" || x.role === "none" || x.hidden;
        if (a == null && x.link === "only") { v = ["fail", "Missing – this image is the whole link, so the link has no words"]; c.link++; }
        else if (a == null && deco) { v = ["info", "No alt, but marked decorative – add alt=\"\" to be safe"]; c.deco++; }
        else if (a == null) { v = ["fail", "Missing"]; c.missing++; }
        else if (!a && x.link === "only") { v = ["fail", "Empty, but this image is the whole link – describe where it goes"]; c.link++; }
        else if (!a) { v = ["info", "Empty – fine if the image is decorative"]; c.deco++; }
        else if (/\.(jpe?g|png|gif|webp|svg|avif)$/i.test(a) || /^(img|dsc|image|photo|pxl|screenshot)[-_ ]?\d+/i.test(a)) { v = ["warn", "Looks like a file name"]; c.weak++; }
        else if (/^(image|picture|photo|graphic) of\b/i.test(a)) { v = ["warn", "Drop \"" + a.split(" ").slice(0, 2).join(" ") + "\" – screen readers already say it's an image"]; c.weak++; }
        else if (a.length > 125) { v = ["warn", "Long (" + a.length + " characters) – some screen readers cut it off"]; c.weak++; }
        else if (alts[a.toLowerCase()] > 2 && !x.link) { v = ["warn", "Same alt text on " + alts[a.toLowerCase()] + " images"]; c.weak++; }
        else { v = ["ok", "Good"]; c.ok++; }
        rows.push([x, v]);
      });
      var n = [];
      if (!imgs.length) n.push(["info", "No images found in the page's HTML. Images added later by JavaScript or as CSS backgrounds aren't listed."]);
      if (c.missing) n.push(["fail", c.missing + " image" + (c.missing > 1 ? "s have" : " has") + " no alt text at all."]);
      if (c.link) n.push(["fail", c.link + " linked image" + (c.link > 1 ? "s have" : " has") + " no alt text, so the link has no anchor text."]);
      if (c.weak) n.push(["warn", c.weak + " image" + (c.weak > 1 ? "s have" : " has") + " weak alt text: a file name, \"image of\", repeated or too long."]);
      if (c.deco) n.push(["info", c.deco + " image" + (c.deco > 1 ? "s are" : " is") + " marked decorative (empty alt). Check each one really adds nothing for a blind visitor."]);
      if (imgs.length && !c.missing && !c.link && !c.weak) n.push(["ok", "Every image has alt text or is marked decorative."]);
      var file = function (s) { if (!s) return "(no address)"; if (s === "data:") return "(embedded image)"; var p = s.split(/[?#]/)[0].split("/"); return decodeURIComponent(p[p.length - 1] || p[p.length - 2] || s).slice(0, 60); };
      var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" };
      var h = '<div class="card" style="margin:16px 0">' + pageHead(j) + '<p class="small">' + imgs.length + " image" + (imgs.length === 1 ? "" : "s") + (imgs.length >= 400 ? " (the first 400)" : "") + ": " + c.ok + " good, " + (c.missing + c.link) + " missing, " + c.weak + " weak, " + c.deco + " decorative.</p>" + noteList(n) + "</div>";
      rows.sort(function (a, b) { var o = { fail: 0, warn: 1, info: 2, ok: 3 }; return o[a[1][0]] - o[b[1][0]]; });
      if (rows.length) h += '<div class="tablewrap"><table><thead><tr><th>Image</th><th>Alt text</th><th>Verdict</th></tr></thead><tbody>' + rows.slice(0, 300).map(function (r) {
        var x = r[0];
        return '<tr><td style="overflow-wrap:anywhere">' + (/^https?:/.test(x.src) ? '<a href="' + esc(x.src) + '" rel="nofollow noopener" target="_blank">' + esc(file(x.src)) + "</a>" : esc(file(x.src))) + (x.link ? ' <span class="small">(link)</span>' : "") + '</td><td style="overflow-wrap:anywhere">' + (x.alt == null ? '<span class="small">none</span>' : x.alt ? esc(x.alt) : '<span class="small">alt=""</span>') + '</td><td style="color:' + lc[r[1][0]] + '">' + esc(r[1][1]) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
      out.innerHTML = h;
    });
  });

  // ---- canonical checker (/api/onpage, then /api/redirects for the canonical address)
  oneBox("cn-form", "cn-url", function (u) {
    var out = $("cn-out");
    onPage(u, out, function (j) {
      var norm = function (s) { return String(s || "").replace(/#.*$/, "").replace(/\/$/, ""); };
      var tags = j.canonicals.filter(function (c) { return c.href; }), list = tags.map(function (c) { return c.href; });
      var distinct = list.filter(function (x, i) { return list.map(norm).indexOf(norm(x)) === i; });
      var canon = distinct[0] || j.linkCanonical || "";
      var robots = j.robots.map(function (r) { return r.content.toLowerCase(); }).join(",") + "," + String(j.xRobots || "").toLowerCase();
      var noindex = /\b(noindex|none)\b/.test(robots), self = canon && norm(canon) === norm(j.url);
      var n = [];
      if (noindex) n.push(["fail", "noindex found" + (j.robots.some(function (r) { return /noindex|none/i.test(r.content); }) ? " in a meta robots tag" : "") + (/noindex|none/i.test(j.xRobots || "") ? " in the X-Robots-Tag header" : "") + ". Google won't show this page in search."]);
      if (!canon) n.push(["warn", "No canonical tag. Add one pointing to the page's own clean address so tracking codes and www/http copies don't split its ranking."]);
      if (distinct.length > 1) n.push(["fail", distinct.length + " different canonical tags (" + distinct.join(", ") + "). Google ignores them all when they disagree."]);
      else if (tags.length > 1) n.push(["info", "The canonical tag appears " + tags.length + " times with the same address. Harmless, but usually a theme and a plugin both adding it."]);
      if (j.canonicals.some(function (c) { return c.inBody; })) n.push(["fail", "A canonical tag is outside the <head>. Google ignores canonical tags in the page body."]);
      if (j.canonicals.some(function (c) { return !c.href; })) n.push(["fail", "A canonical tag has no usable address."]);
      if (j.canonicals.some(function (c) { return c.raw && !/^https?:\/\//i.test(c.raw); })) n.push(["info", "The canonical address is relative (" + j.canonicals[0].raw + "). It works, but a full https:// address is safer."]);
      if (j.linkCanonical && canon && norm(j.linkCanonical) !== norm(canon)) n.push(["warn", "The Link header says the canonical is " + j.linkCanonical + ", but the tag says " + canon + "."]);
      if (j.robots.some(function (r) { return r.inBody; })) n.push(["warn", "A robots meta tag is in the page body, not the <head>."]);
      if (/\bnofollow\b/.test(robots)) n.push(["info", "nofollow is set: Google won't follow the links on this page."]);
      var cu = null; try { cu = canon ? new URL(canon) : null; } catch (e) {}
      if (cu) {
        var pu = new URL(j.url);
        if (self) n.push(["ok", "The canonical points to this page itself."]);
        else {
          if (cu.protocol === "http:" && pu.protocol === "https:") n.push(["warn", "The canonical uses http:// on an https site."]);
          if (cu.hostname.replace(/^www\./, "") !== pu.hostname.replace(/^www\./, "")) n.push(["warn", "The canonical points to another website (" + cu.hostname + "). Google will usually show that site's page instead of this one."]);
          else if (cu.hostname !== pu.hostname) n.push(["warn", "The canonical uses " + cu.hostname + " but the page is on " + pu.hostname + ". Pick one version of your domain."]);
          if (cu.pathname === "/" && pu.pathname !== "/") n.push(["fail", "The canonical points to the home page. Google will treat this page as a copy of your home page and drop it from search."]);
          else n.push(["info", "The canonical points to a different address, so Google will usually show that one instead of this page." + (noindex ? " With noindex as well, the signals are mixed; use one or the other." : "")]);
          if (/[?&](utm_|gclid|fbclid)/i.test(cu.search)) n.push(["warn", "The canonical address contains tracking codes."]);
        }
      }
      var verdict = noindex ? ["s-fail", "Not indexable"] : !cu || self ? ["s-pass", "Indexable"] : ["s-warn", "Points to another page"];
      var draw = function (target) {
        var h = '<div class="card" style="margin:16px 0">' + pageHead(j) + '<p style="font-size:20px"><strong class="' + verdict[0] + '">' + verdict[1] + "</strong></p>" +
          '<p style="overflow-wrap:anywhere">Canonical: ' + (canon ? "<b>" + esc(canon) + "</b>" : "none") + "</p>" + noteList(n.concat(target || [])) + "</div>" +
          '<div class="tablewrap"><table><tbody><tr><th>Meta robots</th><td style="overflow-wrap:anywhere">' + (j.robots.length ? j.robots.map(function (r) { return esc(r.name + ": " + r.content); }).join("<br>") : '<span class="small">none (indexable by default)</span>') + '</td></tr><tr><th>X-Robots-Tag</th><td style="overflow-wrap:anywhere">' + (j.xRobots ? esc(j.xRobots) : '<span class="small">none</span>') + '</td></tr><tr><th>HTTP status</th><td>' + esc(j.status) + "</td></tr></tbody></table></div>" +
          '<p class="small">Only Google Search Console\'s URL Inspection shows which address Google actually chose. Check redirects with our <a href="/redirect-checker">redirect checker</a>.</p>';
        out.innerHTML = h;
      };
      if (!cu || self) { draw(); return; }
      draw([["info", "Checking the canonical address…"]]);
      fetch("/api/redirects?u=" + encodeURIComponent(canon)).then(function (r) { return r.json(); }).then(function (k) {
        var r = (k.results || [])[0] || {};
        if (r.error || !r.status) draw([["warn", "The canonical address didn't answer: " + (r.error || "no response") + "."]]);
        else if (r.redirects) draw([["warn", "The canonical address redirects to " + r.final + ". Point the canonical straight at the final address."]]);
        else if (r.status !== 200) draw([["fail", "The canonical address answers HTTP " + r.status + ". A canonical must point to a working page."]]);
        else draw([["ok", "The canonical address loads directly (HTTP 200)."]]);
      }).catch(function () { draw([["info", "Couldn't test the canonical address."]]); });
    });
  });

  // ---- favicon generator (drawn on a canvas in the browser; .ico holds 16, 32 and 48 px PNGs)
  var fg = $("fg-form");
  if (fg) {
    var fgImg = null, fgUrls = [], fgTimer = 0;
    var fgMode = function () { return $("fg-m-img").checked ? "img" : "text"; };
    var fgDraw = function (size) {
      var c = document.createElement("canvas"); c.width = c.height = size;
      var x = c.getContext("2d");
      if (fgMode() === "img") {
        if (!fgImg) return null;
        var w = fgImg.naturalWidth || fgImg.width, h = fgImg.naturalHeight || fgImg.height, s = Math.min(w, h);
        x.imageSmoothingQuality = "high";
        x.drawImage(fgImg, (w - s) / 2, (h - s) / 2, s, s, 0, 0, size, size);
        return c;
      }
      var shape = $("fg-shape").value, r = shape === "circle" ? size / 2 : shape === "round" ? size * 0.2 : 0;
      x.fillStyle = $("fg-bg").value;
      x.beginPath(); x.moveTo(r, 0); x.arcTo(size, 0, size, size, r); x.arcTo(size, size, 0, size, r); x.arcTo(0, size, 0, 0, r); x.arcTo(0, 0, size, 0, r); x.closePath(); x.fill();
      var t = $("fg-t").value.trim().slice(0, 3) || "?";
      x.fillStyle = $("fg-fg").value; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 " + Math.round(size * [0.62, 0.48, 0.36][t.length - 1]) + "px system-ui, -apple-system, Segoe UI, Arial, sans-serif";
      x.fillText(t, size / 2, size * 0.54);
      return c;
    };
    var fgBlob = function (c) { return new Promise(function (ok) { c.toBlob(ok, "image/png"); }); };
    var fgIco = function (blobs) {
      return Promise.all(blobs.map(function (b) { return b.arrayBuffer(); })).then(function (bufs) {
        var head = new DataView(new ArrayBuffer(6 + 16 * bufs.length)), off = 6 + 16 * bufs.length, sizes = [16, 32, 48];
        head.setUint16(2, 1, true); head.setUint16(4, bufs.length, true);
        bufs.forEach(function (b, i) { var e = 6 + 16 * i; head.setUint8(e, sizes[i]); head.setUint8(e + 1, sizes[i]); head.setUint16(e + 4, 1, true); head.setUint16(e + 6, 32, true); head.setUint32(e + 8, b.byteLength, true); head.setUint32(e + 12, off, true); off += b.byteLength; });
        return new Blob([head.buffer].concat(bufs), { type: "image/x-icon" });
      });
    };
    var fgSvg = function () {
      var t = ($("fg-t").value.trim().slice(0, 3) || "?").replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }), shape = $("fg-shape").value;
      var bg = shape === "circle" ? '<circle cx="50" cy="50" r="50"' : '<rect width="100" height="100"' + (shape === "round" ? ' rx="20"' : "");
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' + bg + ' fill="' + $("fg-bg").value + '"/><text x="50" y="54" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,-apple-system,Segoe UI,Arial,sans-serif" font-weight="700" font-size="' + [62, 48, 36][t.replace(/&\w+;/g, "x").length - 1] + '" fill="' + $("fg-fg").value + '">' + t + "</text></svg>";
    };
    var fgRun = function () {
      $("fg-text").hidden = fgMode() !== "text"; $("fg-img").hidden = fgMode() !== "img";
      if (fgMode() === "img" && !fgImg) { $("fg-prev").innerHTML = '<p class="small">Choose an image to see your favicon.</p>'; $("fg-dl").innerHTML = ""; $("fg-code").textContent = ""; return; }
      var sizes = [16, 32, 48, 180, 192, 512], cs = sizes.map(fgDraw);
      $("fg-prev").innerHTML = "";
      [16, 32, 48, 180].forEach(function (s, i) { var d = document.createElement("div"); d.style.textAlign = "center"; var im = new Image(); im.src = cs[i].toDataURL(); im.width = im.height = Math.min(s, 96); im.alt = s + " × " + s + " favicon preview"; d.appendChild(im); d.insertAdjacentHTML("beforeend", '<div class="small">' + s + " px</div>"); $("fg-prev").appendChild(d); });
      Promise.all(cs.map(fgBlob)).then(function (bl) {
        return fgIco(bl.slice(0, 3)).then(function (ico) {
          fgUrls.forEach(function (u) { URL.revokeObjectURL(u); }); fgUrls = [];
          var text = fgMode() === "text";
          var files = [["favicon.ico", ico], ["apple-touch-icon.png", bl[3]], ["icon-192.png", bl[4]], ["icon-512.png", bl[5]]];
          if (text) files.push(["favicon.svg", new Blob([fgSvg()], { type: "image/svg+xml" })]);
          files.push(["site.webmanifest", new Blob([JSON.stringify({ name: "Your site", icons: [{ src: "/icon-192.png", type: "image/png", sizes: "192x192" }, { src: "/icon-512.png", type: "image/png", sizes: "512x512" }] }, null, 2)], { type: "application/manifest+json" })]);
          $("fg-dl").innerHTML = files.map(function (f) { var u = URL.createObjectURL(f[1]); fgUrls.push(u); return '<a class="btn ghost" href="' + u + '" download="' + f[0] + '">' + f[0] + "</a>"; }).join("");
          $("fg-code").textContent = '<link rel="icon" href="/favicon.ico" sizes="48x48">\n' + (text ? '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n' : "") + '<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">';
        });
      });
    };
    var fgLater = function () { clearTimeout(fgTimer); fgTimer = setTimeout(fgRun, 120); };
    fg.addEventListener("input", fgLater); fg.addEventListener("change", fgLater);
    fg.addEventListener("submit", function (ev) { ev.preventDefault(); });
    $("fg-file").addEventListener("change", function () {
      var f = this.files && this.files[0]; if (!f) return;
      var im = new Image(); im.onload = function () { fgImg = im; fgRun(); }; im.onerror = function () { fgImg = null; $("fg-prev").innerHTML = '<p class="s-fail">That file couldn\'t be read as an image.</p>'; }; im.src = URL.createObjectURL(f);
    });
    copyBtn("fg-copy", "fg-code");
    fgRun();
  }

  // ---- hreflang tag generator
  var hg = $("hg-form");
  if (hg) {
    var HG_LANG = [["en", "English"], ["cy", "Welsh"], ["ga", "Irish"], ["gd", "Scottish Gaelic"], ["fr", "French"], ["de", "German"], ["es", "Spanish"], ["it", "Italian"], ["pt", "Portuguese"], ["nl", "Dutch"], ["pl", "Polish"], ["ro", "Romanian"], ["sv", "Swedish"], ["da", "Danish"], ["no", "Norwegian"], ["fi", "Finnish"], ["el", "Greek"], ["cs", "Czech"], ["hu", "Hungarian"], ["tr", "Turkish"], ["ru", "Russian"], ["uk", "Ukrainian"], ["ar", "Arabic"], ["he", "Hebrew"], ["hi", "Hindi"], ["ur", "Urdu"], ["pa", "Punjabi"], ["bn", "Bengali"], ["zh-Hans", "Chinese (simplified)"], ["zh-Hant", "Chinese (traditional)"], ["ja", "Japanese"], ["ko", "Korean"], ["th", "Thai"], ["vi", "Vietnamese"], ["id", "Indonesian"], ["ms", "Malay"]];
    var HG_REG = [["", "Any country"], ["GB", "United Kingdom (GB)"], ["IE", "Ireland"], ["US", "United States"], ["CA", "Canada"], ["AU", "Australia"], ["NZ", "New Zealand"], ["ZA", "South Africa"], ["IN", "India"], ["FR", "France"], ["BE", "Belgium"], ["CH", "Switzerland"], ["LU", "Luxembourg"], ["DE", "Germany"], ["AT", "Austria"], ["ES", "Spain"], ["MX", "Mexico"], ["AR", "Argentina"], ["IT", "Italy"], ["PT", "Portugal"], ["BR", "Brazil"], ["NL", "Netherlands"], ["PL", "Poland"], ["SE", "Sweden"], ["DK", "Denmark"], ["NO", "Norway"], ["FI", "Finland"], ["GR", "Greece"], ["CY", "Cyprus"], ["MT", "Malta"], ["TR", "Turkey"], ["AE", "United Arab Emirates"], ["SA", "Saudi Arabia"], ["SG", "Singapore"], ["HK", "Hong Kong"], ["CN", "China"], ["TW", "Taiwan"], ["JP", "Japan"], ["KR", "South Korea"]];
    var hgOpts = function (list, v) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === v ? " selected" : "") + ">" + esc(o[1] + (o[0] ? " (" + o[0] + ")" : "")).replace(" (GB) (GB)", " (GB)") + "</option>"; }).join(""); };
    var hgN = 0;
    var hgRow = function (l, r, u) {
      var i = ++hgN, d = document.createElement("div");
      d.className = "row hg-row"; d.style.cssText = "align-items:flex-end;margin:6px 0";
      d.innerHTML = '<div style="flex:1 1 150px"><label for="hg-l' + i + '">Language</label><select id="hg-l' + i + '" class="hg-l">' + hgOpts(HG_LANG, l) + '</select></div><div style="flex:1 1 150px"><label for="hg-r' + i + '">Country</label><select id="hg-r' + i + '" class="hg-r">' + hgOpts(HG_REG, r) + '</select></div><div style="flex:3 1 240px"><label for="hg-u' + i + '">Page address</label><input id="hg-u' + i + '" class="hg-u" type="text" inputmode="url" value="' + attr(u || "") + '"></div><button class="btn ghost hg-del" type="button" aria-label="Remove this version" style="min-width:48px">×</button>';
      $("hg-rows").appendChild(d);
    };
    hgRow("en", "GB", "https://smithplumbing.co.uk/"); hgRow("en", "IE", "https://smithplumbing.ie/"); hgRow("fr", "FR", "https://smithplumbing.com/fr/");
    var hgRun = function () {
      var rows = [].slice.call(document.querySelectorAll(".hg-row")).map(function (d) { var l = d.querySelector(".hg-l").value, r = d.querySelector(".hg-r").value; return { code: l + (r ? "-" + r : ""), url: d.querySelector(".hg-u").value.trim() }; }).filter(function (x) { return x.url; });
      var xd = $("hg-xd").value.trim(), all = rows.slice(), n = [];
      if (xd) all.push({ code: "x-default", url: xd });
      var seen = {};
      all.forEach(function (x) { if (seen[x.code]) n.push(["fail", x.code + " is used twice. Each code can point to only one address."]); seen[x.code] = 1; if (!/^https?:\/\//i.test(x.url)) n.push(["warn", x.url + " should be a full address starting https://."]); });
      var langs = {}; rows.forEach(function (x) { var l = x.code.split("-")[0]; langs[l] = langs[l] || []; langs[l].push(x.code); });
      Object.keys(langs).forEach(function (l) { if (langs[l].length > 1 && langs[l].indexOf(l) < 0) n.push(["info", "You have several country versions in " + l + " but none for " + l + " on its own. Visitors who speak " + l + " elsewhere will get x-default; add a plain \"" + l + "\" row if one version suits them."]); });
      if (rows.length < 2) n.push(["warn", "hreflang needs at least two versions of the page."]);
      if (!xd) n.push(["info", "No x-default. It's optional, but recommended: it names the page for visitors whose language or country isn't listed."]);
      if (!n.some(function (x) { return x[0] !== "info"; })) n.push(["ok", "Put these same tags on every version listed, including this one. Each page must list all the others and itself."]);
      var fmt = $("hg-fmt").value, out;
      if (fmt === "xml") out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + rows.map(function (p) { return "  <url>\n    <loc>" + attr(p.url) + "</loc>\n" + all.map(function (x) { return '    <xhtml:link rel="alternate" hreflang="' + x.code + '" href="' + attr(x.url) + '"/>\n'; }).join("") + "  </url>\n"; }).join("") + "</urlset>";
      else if (fmt === "header") out = "Link: " + all.map(function (x) { return "<" + x.url + '>; rel="alternate"; hreflang="' + x.code + '"'; }).join(",\n      ");
      else out = all.map(function (x) { return '<link rel="alternate" hreflang="' + x.code + '" href="' + attr(x.url) + '">'; }).join("\n");
      $("hg-out").textContent = out;
      $("hg-notes").innerHTML = noteList(n) + '<p class="small">After publishing, test the tags and return links with our <a href="/hreflang-checker">hreflang checker</a>.</p>';
    };
    $("hg-add").addEventListener("click", function () { hgRow("en", "", ""); hgRun(); });
    $("hg-rows").addEventListener("click", function (ev) { var b = ev.target.closest(".hg-del"); if (b) { b.parentNode.remove(); hgRun(); } });
    live("hg-form", hgRun);
    copyBtn("hg-copy", "hg-out");
  }

  // ---- email header analyzer (parsed in the browser only)
  var eh = $("eh-form");
  if (eh) {
    var EH_SAMPLE = "Delivered-To: jo@smithplumbing.co.uk\nReceived: by 2002:a05:7300:1234 with SMTP id x9csp1;\n        Mon, 12 Oct 2026 09:15:12 -0700 (PDT)\nAuthentication-Results: mx.google.com;\n       dkim=pass header.i=@supplier.co.uk header.s=s1;\n       spf=pass (google.com: domain of invoices@supplier.co.uk designates 192.0.2.25 as permitted sender) smtp.mailfrom=invoices@supplier.co.uk;\n       dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=supplier.co.uk\nReceived: from mail.supplier.co.uk (mail.supplier.co.uk. [192.0.2.25])\n        by mx.google.com with ESMTPS id a1si2;\n        Mon, 12 Oct 2026 09:15:11 -0700 (PDT)\nReceived: from crm.supplier.co.uk (crm.supplier.co.uk [10.0.0.8])\n        by mail.supplier.co.uk (Postfix) with ESMTP id 4F2;\n        Mon, 12 Oct 2026 17:13:40 +0100 (BST)\nFrom: Supplier Accounts <invoices@supplier.co.uk>\nReply-To: accounts@supplier-payments.com\nTo: jo@smithplumbing.co.uk\nSubject: Invoice 2231 due\nDate: Mon, 12 Oct 2026 17:13:38 +0100\nMessage-ID: <2231.1760285618@crm.supplier.co.uk>\nX-Mailer: SupplierCRM 4.2\n";
    $("eh-sample").addEventListener("click", function () { $("eh-in").value = EH_SAMPLE; eh.requestSubmit ? eh.requestSubmit() : eh.dispatchEvent(new Event("submit", { cancelable: true })); });
    var ehDomain = function (v) { var m = String(v || "").match(/@([a-z0-9.-]+\.[a-z]{2,})/i); return m ? m[1].toLowerCase().replace(/\.$/, "") : ""; };
    var ehOrg = function (d) { var p = d.split("."); return p.slice(/\.(co|org|ac|gov|me|ltd|plc|net|sch|com)\.[a-z]{2}$/.test(d) ? -3 : -2).join("."); };
    var ehTime = function (s) { var t = Date.parse(String(s || "").replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim()); return isNaN(t) ? null : t; };
    var ehAgo = function (ms) { var s = Math.round(ms / 1000); return s < 0 ? "clock differs" : s < 60 ? s + " s" : s < 3600 ? Math.round(s / 60) + " min" : (s / 3600).toFixed(1) + " h"; };
    eh.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var raw = $("eh-in").value.replace(/\r\n?/g, "\n"), out = $("eh-out");
      if (!raw.trim()) { $("eh-in").focus(); return; }
      var lines = raw.replace(/^\s*\n/, "").split("\n"), hs = [];
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (!l.trim()) { if (hs.length) break; continue; }
        if (/^[ \t]/.test(l) && hs.length) hs[hs.length - 1][1] += " " + l.trim();
        else { var m = l.match(/^([!-9;-~]+):\s*(.*)$/); if (m) hs.push([m[1], m[2]]); }
      }
      if (!hs.length) { out.innerHTML = '<p class="s-fail">No headers found. In Gmail use ⋮ → Show original; in Outlook, File → Properties → Internet headers; in Apple Mail, View → Message → All Headers.</p>'; return; }
      var get = function (k) { k = k.toLowerCase(); for (var j = 0; j < hs.length; j++) if (hs[j][0].toLowerCase() === k) return hs[j][1]; return ""; };
      var all = function (k) { k = k.toLowerCase(); return hs.filter(function (h) { return h[0].toLowerCase() === k; }).map(function (h) { return h[1]; }); };
      var hops = all("Received").reverse().map(function (v) {
        var semi = v.lastIndexOf(";"), when = semi >= 0 ? ehTime(v.slice(semi + 1)) : null, body = semi >= 0 ? v.slice(0, semi) : v;
        var f = (body.match(/\bfrom\s+(.+?)(?=\s+by\s|\s+with\s|\s+id\s|$)/i) || [])[1] || "", b = (body.match(/\bby\s+(\S+)/i) || [])[1] || "", w = (body.match(/\bwith\s+(\S+)/i) || [])[1] || "";
        return { from: f.replace(/\s+/g, " ").slice(0, 120), by: b, with: w, when: when };
      });
      var ar = all("Authentication-Results")[0] || "", n = [];
      var res = function (k) { var m = ar.match(new RegExp("\\b" + k + "\\s*=\\s*([a-z]+)", "i")); return m ? m[1].toLowerCase() : ""; };
      var spf = res("spf") || ((get("Received-SPF").match(/^\s*([a-z]+)/i) || [])[1] || "").toLowerCase(), dkim = res("dkim"), dmarc = res("dmarc");
      var pill = function (name, v) { var c = v === "pass" ? "s-pass" : /fail|permerror/.test(v) && v !== "softfail" ? "s-fail" : v ? "s-warn" : "small"; return '<span style="display:inline-block;margin:4px 16px 4px 0"><b>' + name + '</b> <span class="' + c + '">' + esc(v || "not shown") + "</span></span>"; };
      var from = get("From"), fromD = ehDomain(from), rp = ehDomain(get("Return-Path")) || ehDomain((ar.match(/smtp\.mailfrom=(\S+)/i) || [])[1] ? "x@" + ar.match(/smtp\.mailfrom=([^\s;]+)/i)[1].replace(/^.*@/, "") : ""), rt = ehDomain(get("Reply-To"));
      if (dmarc === "fail") n.push(["fail", "DMARC failed: the email didn't prove it really came from " + (fromD || "the sender's domain") + ". Treat it with suspicion."]);
      else if (dmarc === "pass") n.push(["ok", "DMARC passed for " + (fromD || "the sender") + ": the sending domain is genuine."]);
      if (spf && spf !== "pass") n.push([/fail/.test(spf) && spf !== "softfail" ? "fail" : "warn", "SPF result: " + spf + ". The server that sent it isn't clearly allowed to send for this domain."]);
      if (dkim && dkim !== "pass") n.push(["warn", "DKIM result: " + dkim + ". The signature is missing or didn't match, so the message may have been changed or faked."]);
      if (!ar && !get("Received-SPF")) n.push(["info", "No Authentication-Results header. Copy the headers from the receiving mailbox (not a forwarded copy) to see SPF, DKIM and DMARC results."]);
      if (rt && fromD && ehOrg(rt) !== ehOrg(fromD)) n.push(["warn", "Replies go to " + rt + ", a different domain from the sender (" + fromD + "). That's common in invoice fraud: check before replying or paying."]);
      if (rp && fromD && ehOrg(rp) !== ehOrg(fromD)) n.push(["info", "The bounce address is on " + rp + ", not " + fromD + ". Normal for email services such as Mailchimp or Microsoft 365, but it needs DKIM to pass DMARC."]);
      var spam = get("X-Spam-Status") || get("X-Spam-Flag") || get("X-Spam-Score");
      if (spam) n.push([/^yes/i.test(spam) ? "warn" : "info", "Spam filter: " + spam.slice(0, 160)]);
      var total = hops.length > 1 && hops[0].when && hops[hops.length - 1].when ? hops[hops.length - 1].when - hops[0].when : null;
      if (total != null && total > 10 * 60000) n.push(["warn", "Delivery took " + ehAgo(total) + " from the first server to the last. Look for the slow hop below."]);
      var h = '<div class="card" style="margin:16px 0"><p class="ct">' + esc(get("Subject") || "(no subject)") + "</p>" + '<p style="margin:4px 0">' + pill("SPF", spf) + pill("DKIM", dkim) + pill("DMARC", dmarc) + "</p>" + noteList(n) + "</div>";
      h += '<div class="tablewrap"><table><tbody>' + [["From", from], ["Reply-To", get("Reply-To")], ["Return-Path", get("Return-Path")], ["To", get("To")], ["Date", get("Date")], ["Message-ID", get("Message-ID")], ["Sent with", get("X-Mailer") || get("User-Agent")]].filter(function (r) { return r[1]; }).map(function (r) { return "<tr><th>" + r[0] + '</th><td style="overflow-wrap:anywhere">' + esc(r[1]) + "</td></tr>"; }).join("") + "</tbody></table></div>";
      if (hops.length) h += "<h3>Route: " + hops.length + " hop" + (hops.length > 1 ? "s" : "") + (total != null ? ", " + ehAgo(total) + " in total" : "") + '</h3><div class="tablewrap"><table><thead><tr><th>#</th><th>From</th><th>By</th><th>With</th><th>Delay</th></tr></thead><tbody>' + hops.map(function (x, k) {
        var d = k && x.when && hops[k - 1].when ? x.when - hops[k - 1].when : null;
        return "<tr><td>" + (k + 1) + '</td><td style="overflow-wrap:anywhere">' + esc(x.from || "–") + '</td><td style="overflow-wrap:anywhere">' + esc(x.by || "–") + "</td><td>" + esc(x.with) + '</td><td style="color:' + (d != null && d > 5 * 60000 ? "#cf222e" : "inherit") + '">' + (d == null ? (k ? "?" : "start") : ehAgo(d)) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
      if (fromD) h += '<p class="small">Check ' + esc(fromD) + "'s email setup: <a href=\"/spf-checker?d=" + encodeURIComponent(fromD) + '">SPF</a> · <a href="/dmarc-checker?d=' + encodeURIComponent(fromD) + '">DMARC</a> · <a href="/dkim-checker?d=' + encodeURIComponent(fromD) + '">DKIM</a> · <a href="/mx-lookup?d=' + encodeURIComponent(fromD) + '">MX</a></p>';
      out.innerHTML = h;
    });
  }

  // ---- HTTP header checker (/api/headers)
  var hd = $("hd-form");
  if (hd) {
    var hdq = (location.search.match(/[?&]url=([^&]+)/) || [])[1];
    if (hdq && !$("hd-url").value.trim()) { try { $("hd-url").value = decodeURIComponent(hdq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { hd.requestSubmit ? hd.requestSubmit() : hd.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    hd.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = $("hd-url").value.trim(), out = $("hd-out");
      if (!u) { $("hd-url").focus(); return; }
      out.innerHTML = "<p>Fetching headers…</p>";
      fetch("/api/headers?url=" + encodeURIComponent(u) + ($("hd-mobile").checked ? "&agent=mobile" : "")).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var lc = { fail: "#cf222e", warn: "#9a6700", ok: "#1a7f37", info: "inherit" }, icon = { fail: "✗", warn: "!", ok: "✓", info: "•" };
        out.innerHTML = j.hops.map(function (h, i) {
          var s = h.status;
          return '<div class="card" style="margin:16px 0"><p class="ct" style="overflow-wrap:anywhere">' + (j.hops.length > 1 ? "Step " + (i + 1) + ": " : "") + esc(h.url) + "</p>" +
            '<p><b style="font-size:24px;color:' + col(s >= 200 && s < 300, s >= 300 && s < 400) + '">' + (s || "No response") + "</b> " + esc(h.text) + ' <span class="small">' + h.ms + " ms</span>" + (h.location ? '<br><span style="overflow-wrap:anywhere">→ ' + esc(h.location) + (h.type === "meta" ? " (meta refresh)" : "") + "</span>" : "") + "</p>" +
            (h.notes && h.notes.length ? '<ul style="list-style:none;padding:0;margin:8px 0">' + h.notes.map(function (n) { return '<li style="margin:4px 0;overflow-wrap:anywhere;color:' + lc[n.level] + '"><b>' + icon[n.level] + "</b> " + esc(n.text) + "</li>"; }).join("") + "</ul>" : "") +
            (h.headers && h.headers.length ? '<div class="tablewrap"><table><tbody>' + h.headers.map(function (kv) { return '<tr><th scope="row" style="text-align:left;white-space:nowrap;vertical-align:top">' + esc(kv[0]) + '</th><td style="overflow-wrap:anywhere;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px">' + esc(kv[1]) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "") + "</div>";
        }).join("") + (j.problems.length ? "<h3>Redirect notes</h3><ul>" + j.problems.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") +
          '<p class="small">Fetched from Cloudflare\'s network as a ' + ($("hd-mobile").checked ? "mobile" : "desktop") + " browser. Header names are shown in lower case, as HTTP/2 sends them.</p>";
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t fetch that address – please try again.</p>'; });
    });
  }

  // ---- redirect checker (/api/redirects, up to 100 addresses in batches of 10)
  var rd = $("rd-form");
  if (rd) {
    var rdRun = function () {
      var seen = {}, list = $("rd-urls").value.split(/\s+/).filter(function (x) { if (!/\./.test(x) || seen[x]) return false; seen[x] = 1; return true; }).slice(0, 100);
      var out = $("rd-out"); if (!list.length) { out.innerHTML = '<p class="s-warn">Add at least one web address.</p>'; return; }
      var agent = $("rd-agent").value, res = list.map(function () { return null; }), batches = [], failed = "";
      for (var b = 0; b < list.length; b += 10) batches.push(b);
      var stCol = function (s) { return col(s >= 200 && s < 300, s >= 300 && s < 400); };
      // several versions of one website (http/https, www/bare): do they all end at one secure address?
      var rdHost = function (u) { return u.replace(/^[a-z]+:\/\//i, "").split(/[\/?#]/)[0].replace(/^www\./i, "").toLowerCase(); };
      var rdSame = function (done) {
        if (done < list.length || list.length < 2 || list.some(function (u) { return rdHost(u) !== rdHost(list[0]); })) return "";
        var ends = {}, ok = res.every(function (r) { return r && !r.error && r.status === 200 && /^https:/.test(r.final || ""); });
        res.forEach(function (r) { if (r && !r.error) ends[r.final] = 1; });
        var e = Object.keys(ends), one = ok && e.length === 1;
        return '<p class="' + (one ? "s-pass" : "s-fail") + '" style="font-weight:600;overflow-wrap:anywhere">' + (one ? "✓ All " + list.length + " versions of " + esc(rdHost(list[0])) + " end at " + esc(e[0]) + " – exactly right."
          : "✗ These versions of " + esc(rdHost(list[0])) + " don't all end at one secure address" + (e.length > 1 ? " (they end at " + e.length + " different ones)" : "") + ". Google can treat them as separate sites and split your rankings – redirect them all with a 301 to one https:// address.") + "</p>";
      };
      var draw = function () {
        var done = res.filter(Boolean).length;
        out.innerHTML = (done < list.length ? '<p class="small">' + done + " of " + list.length + " checked…</p>" : "") + (failed ? '<p class="s-fail">' + esc(failed) + "</p>" : "") + list.map(function (u, i) {
          var r = res[i];
          if (!r) return '<div class="card" style="margin:12px 0"><p>' + esc(u) + ' <span class="small">Waiting…</span></p></div>';
          if (r.error) return '<div class="card" style="margin:12px 0"><p style="overflow-wrap:anywhere"><b>' + esc(r.input) + '</b></p><p class="s-fail">' + esc(r.error) + "</p></div>";
          var verdict = r.problems.length ? '<span style="color:' + col(false, r.ok) + '">' + (r.ok ? "Works, with " + r.problems.length + " thing" + (r.problems.length === 1 ? "" : "s") + " to fix" : "Problem") + "</span>" : '<span style="color:#1a7f37">' + (r.redirects ? "Good redirect" : "No redirect") + "</span>";
          return '<details class="card" style="margin:12px 0"' + (list.length <= 4 ? " open" : "") + '><summary style="cursor:pointer;overflow-wrap:anywhere"><b>' + esc(r.start) + "</b> – " + r.redirects + " redirect" + (r.redirects === 1 ? "" : "s") + ', ends <b style="color:' + stCol(r.status) + '">' + (r.status || "no response") + "</b> · " + verdict + "</summary>" +
            '<ol style="margin:12px 0 0;padding-left:22px">' + r.hops.map(function (h) {
              return '<li style="margin:6px 0;overflow-wrap:anywhere"><b style="color:' + stCol(h.status) + '">' + (h.status || "–") + "</b> " + esc(h.text) + (h.type === "meta" ? " (meta refresh" + (h.delay ? ", " + h.delay + "s" : "") + ")" : "") + ' <span class="small">' + h.ms + " ms</span><br>" + esc(h.url) + "</li>";
            }).join("") + "</ol>" +
            (r.redirects ? '<p style="overflow-wrap:anywhere">Final address: <b>' + esc(r.final) + "</b></p>" : "") +
            (r.problems.length ? '<ul style="margin:8px 0 0">' + r.problems.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") + "</details>";
        }).join("") + rdSame(done) +
        (done === list.length ? '<div class="row"><button type="button" class="btn ghost" id="rd-csv">Download CSV</button></div><p class="small">Checked as a ' + (agent === "mobile" ? "mobile" : "desktop") + " browser from Cloudflare's network. Sites that block automated visits or redirect by country or with JavaScript may behave differently for you.</p>" : "");
        var c = $("rd-csv"); if (c) c.onclick = function () {
          var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
          var rows = [["address", "redirects", "final_status", "final_address", "chain", "problems"]].concat(res.map(function (r, i) { return !r ? [list[i], "error"] : r.error ? [r.input, "error", "", "", "", r.error] : [r.start, r.redirects, r.status, r.final, r.hops.map(function (h) { return h.status + " " + h.url; }).join(" > "), r.problems.join(" ")]; }));
          var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n")], { type: "text/csv" })); a.download = "xkey-redirects.csv"; document.body.appendChild(a); a.click(); a.remove();
        };
      };
      var next = 0;
      var work = function () {
        if (next >= batches.length) return; var start = batches[next++], part = list.slice(start, start + 10);
        fetch("/api/redirects?agent=" + agent + part.map(function (x) { return "&u=" + encodeURIComponent(x); }).join("")).then(function (r) { return r.json(); }).then(function (j) {
          if (j.error) throw new Error(j.error);
          j.results.forEach(function (r, k) { res[start + k] = r; });
        }).catch(function (e) {
          failed = (e && e.message) || "Couldn't check those – please try again.";
          part.forEach(function (s, k) { res[start + k] = { input: s, error: "Not checked" }; });
        }).then(function () { draw(); work(); });
      };
      draw(); work(); work();
    };
    rd.addEventListener("submit", function (ev) { ev.preventDefault(); rdRun(); });
    $("rd-four").addEventListener("click", function () {
      var first = ($("rd-urls").value.split(/\s+/).filter(Boolean)[0] || "").replace(/^[a-z]+:\/\//i, "").split(/[\/?#]/)[0].replace(/^www\./i, "").toLowerCase();
      if (!/\./.test(first)) { $("rd-urls").focus(); $("rd-out").innerHTML = '<p class="s-warn">Type your website address first.</p>'; return; }
      $("rd-urls").value = ["http://" + first, "http://www." + first, "https://" + first, "https://www." + first].join("\n");
      rdRun();
    });
  }

  // ---- domain age checker + WHOIS lookup (registry data via /api/whois)
  var ageText = function (iso) {
    if (!iso) return "";
    var a = new Date(iso + "T00:00:00Z"), n = new Date(), m = (n.getUTCFullYear() - a.getUTCFullYear()) * 12 + n.getUTCMonth() - a.getUTCMonth() - (n.getUTCDate() < a.getUTCDate() ? 1 : 0);
    if (m < 0) return ""; var y = Math.floor(m / 12); m = m % 12;
    return y ? y + " year" + (y === 1 ? "" : "s") + (m ? ", " + m + " month" + (m === 1 ? "" : "s") : "") : m ? m + " month" + (m === 1 ? "" : "s") : "under a month";
  };
  var ukDate = function (iso) { if (!iso) return ""; var d = new Date(iso + "T00:00:00Z"); return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); };
  var daysLeft = function (iso) { return iso ? Math.round((new Date(iso + "T00:00:00Z") - Date.now()) / 86400000) : null; };
  var expiryHtml = function (iso) {
    if (!iso) return '<span class="small">Not published</span>';
    var d = daysLeft(iso);
    return '<span style="color:' + col(d > 60, d > 0) + '">' + esc(ukDate(iso)) + "</span>" + (d <= 60 ? ' <span class="small">(' + (d < 0 ? "expired" : d + " days left") + ")</span>" : "");
  };
  var dg = $("dg-form");
  if (dg) dg.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var seen = {}, sites = $("dg-urls").value.split(/[\s,]+/).filter(function (x) { x = x.toLowerCase(); if (!/\./.test(x) || seen[x]) return false; seen[x] = 1; return true; }).slice(0, 100);
    var out = $("dg-out"); if (!sites.length) { out.innerHTML = '<p class="s-warn">Add at least one domain.</p>'; return; }
    var res = sites.map(function () { return null; }), batches = [], failed = "", sorted = false;
    for (var b = 0; b < sites.length; b += 10) batches.push(b);
    var draw = function () {
      var done = res.filter(Boolean).length, order = sites.map(function (s, i) { return i; });
      var key = function (i) { return res[i] && res[i].created ? res[i].created : "9999"; };
      if (sorted) order.sort(function (a, b) { return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0; });
      out.innerHTML = (done < sites.length ? '<p class="small">' + done + " of " + sites.length + " checked…</p>" : "") + (failed ? '<p class="s-fail">' + esc(failed) + "</p>" : "") +
        '<div class="tablewrap"><table><thead><tr><th>Domain</th><th>Age</th><th>Registered</th><th>Expires</th><th>Registrar</th></tr></thead><tbody>' + order.map(function (i) {
          var r = res[i]; if (!r) return "<tr><td>" + esc(sites[i]) + '</td><td colspan="4" class="small">Waiting…</td></tr>';
          if (r.error) return '<tr><td style="overflow-wrap:anywhere">' + esc(r.domain || r.input) + '</td><td colspan="4" class="s-fail">' + esc(r.error) + "</td></tr>";
          if (!r.registered) return '<tr><td style="overflow-wrap:anywhere">' + esc(r.domain) + '</td><td colspan="4"><b style="color:#1a7f37">Not registered</b> <span class="small">– it may be free to buy</span></td></tr>';
          return '<tr><td style="overflow-wrap:anywhere"><a href="/whois-lookup?d=' + encodeURIComponent(r.domain) + '">' + esc(r.domain) + "</a></td><td><b>" + (r.created ? esc(ageText(r.created)) : '<span class="small">Not published</span>') + "</b></td><td>" + esc(ukDate(r.created)) + "</td><td>" + expiryHtml(r.expires) + '</td><td style="overflow-wrap:anywhere">' + esc(r.registrar) + "</td></tr>";
        }).join("") + "</tbody></table></div>" +
        (done === sites.length ? '<div class="row"><button type="button" class="btn ghost" id="dg-csv">Download CSV</button>' + (sites.length > 1 ? '<button type="button" class="btn ghost" id="dg-sort">' + (sorted ? "Original order" : "Oldest first") + "</button>" : "") + "</div>" : "") +
        '<p class="small">Dates come from each domain\'s registry. Age counts from the start of the current registration. Click a domain for its full WHOIS record.</p>';
      var c = $("dg-csv"); if (c) c.onclick = function () {
        var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        var rows = [["domain", "registered", "age", "registered_on", "expires_on", "registrar", "name_servers"]].concat(res.map(function (r, i) { return !r ? [sites[i], "error"] : r.error ? [r.domain || r.input, "error", r.error] : !r.registered ? [r.domain, "no"] : [r.domain, "yes", ageText(r.created), r.created || "", r.expires || "", r.registrar || "", (r.nameservers || []).join(" ")]; }));
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n")], { type: "text/csv" })); a.download = "xkey-domain-age.csv"; document.body.appendChild(a); a.click(); a.remove();
      };
      var so = $("dg-sort"); if (so) so.onclick = function () { sorted = !sorted; draw(); };
    };
    var next = 0;
    var work = function () {
      if (next >= batches.length) return; var start = batches[next++], part = sites.slice(start, start + 10);
      fetch("/api/whois?d=" + encodeURIComponent(part.join(","))).then(function (r) { return r.json(); }).then(function (j) {
        if (j.error) throw new Error(j.error);
        j.results.forEach(function (r, k) { res[start + k] = r; });
      }).catch(function (e) {
        failed = (e && e.message) || "Couldn't look those up – please try again.";
        part.forEach(function (s, k) { res[start + k] = { input: s, error: "Not checked" }; });
      }).then(function () { draw(); work(); });
    };
    draw(); work(); work();
  });

  var wh = $("wh-form");
  if (wh) {
    var whq = (location.search.match(/[?&]d=([^&]+)/) || [])[1];
    if (whq && !$("wh-d").value.trim()) { try { $("wh-d").value = decodeURIComponent(whq.replace(/\+/g, " ")); } catch (e) {} setTimeout(function () { wh.requestSubmit ? wh.requestSubmit() : wh.dispatchEvent(new Event("submit", { cancelable: true })); }, 0); }
    wh.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = $("wh-d").value.trim(), out = $("wh-out");
      if (!d) { $("wh-d").focus(); return; }
      out.innerHTML = "<p>Asking the registry…</p>";
      fetch("/api/whois?d=" + encodeURIComponent(d)).then(function (r) { return r.json(); }).then(function (j) {
        var r = j.results ? j.results[0] : j;
        if (j.error || r.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error || r.error) + "</p>"; return; }
        if (!r.registered) { out.innerHTML = '<div class="card" style="margin:16px 0"><p class="ct">' + esc(r.domain) + ' isn\'t registered</p><p>The registry has no record of it, so it\'s probably free to buy from any registrar. Check the spelling first.</p></div>'; return; }
        var row = function (k, v) { return v ? "<tr><th scope=\"row\" style=\"text-align:left;white-space:nowrap\">" + k + '</th><td style="overflow-wrap:anywhere">' + v + "</td></tr>" : ""; };
        var h = '<div class="card" style="margin:16px 0"><p class="ct">' + esc(r.domain) + '</p><div class="row" style="gap:28px"><div><b style="font-size:30px">' + (r.created ? esc(ageText(r.created)) : "–") + '</b><br><span class="small">' + (r.created ? "old (registered " + esc(ukDate(r.created)) + ")" : "registration date not published by this registry") + "</span></div>" +
          (r.expires ? '<div><b style="font-size:30px">' + expiryHtml(r.expires) + '</b><br><span class="small">expiry date</span></div>' : "") + "</div></div>" +
          '<div class="tablewrap"><table><tbody>' + row("Registrar", esc(r.registrar)) + row("Registered", esc(ukDate(r.created))) + row("Last updated", esc(ukDate(r.updated))) + row("Expires", r.expires ? expiryHtml(r.expires) : "") +
          row("Name servers", (r.nameservers || []).map(esc).join("<br>")) + row("Status", (r.status || []).map(esc).join("<br>")) + row("DNSSEC", r.dnssec == null ? "" : r.dnssec ? "Signed" : "Not signed") + "</tbody></table></div>" +
          (r.raw ? '<h3>Registry WHOIS record</h3><pre class="out">' + esc(r.raw.trim()) + "</pre>" : "") +
          '<p class="small">Source: ' + (r.source === "rdap" ? 'the registry\'s RDAP service' + (r.rdap ? ' (<a href="' + esc(r.rdap) + '" rel="nofollow noopener" target="_blank">raw record</a>)' : "") : "the registry's WHOIS server " + esc(r.server || "")) + ". Personal details are hidden by registries for privacy. Check more domains at once with the <a href=\"/domain-age-checker\">domain age checker</a>.</p>";
        out.innerHTML = h;
      }).catch(function () { out.innerHTML = '<p class="s-fail">Couldn\'t look that up – please try again.</p>'; });
    });
  }

  // ---- your recent checks (stored only in this browser)
  var rc = $("recent");
  if (rc) {
    var list = []; try { list = JSON.parse(localStorage.getItem("seo_recent") || "[]"); } catch (e) {}
    if (list.length) {
      var ago = function (t) { var m = Math.round((Date.now() - t) / 60000); return m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " days ago"; };
      rc.innerHTML = '<p class="ct" style="font-size:17px;margin-top:18px">Your recent checks</p><ul class="recent">' + list.slice(0, 6).map(function (x) {
        var host = x.u; try { host = new URL(x.u).hostname.replace(/^www\./, ""); } catch (e) {}
        return '<li><a href="/seo-checker?url=' + encodeURIComponent(x.u) + '">' + esc(host) + '</a> <b style="color:' + col(x.s >= 90, x.s >= 70) + '">' + x.s + '</b> <span class="small">' + ago(x.t) + "</span></li>";
      }).join("") + '</ul><p class="small">Saved only in this browser. <a href="#" id="recent-clear">Clear</a></p>';
      $("recent-clear").addEventListener("click", function (ev) { ev.preventDefault(); try { localStorage.removeItem("seo_recent"); } catch (e) {} rc.innerHTML = ""; });
    }
  }

  // ---- local Google results link (opens in the visitor's own browser)
  live("ls-form", function () {
    var q = val("ls-q"), town = val("ls-town"), region = $("ls-region").value, a = $("ls-go");
    if (!q || !town) { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); $("ls-note").textContent = "Enter a search and a town."; return; }
    var canon = town.replace(/\s*,\s*/g, ",").replace(/^\w/, function (c) { return c.toUpperCase(); }) + "," + region + ",United Kingdom";
    var KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var b64 = btoa(unescape(encodeURIComponent(canon)));
    var uule = "w+CAIQICI" + KEYS.charAt(canon.length % 64) + b64;
    a.href = "https://www.google.co.uk/search?q=" + encodeURIComponent(q) + "&gl=uk&hl=en&pws=0&uule=" + encodeURIComponent(uule);
    a.removeAttribute("aria-disabled");
    $("ls-note").textContent = "Opens Google in a new tab showing results for “" + q + "” as seen from " + canon.replace(/,/g, ", ") + ".";
  });

  // ---- AI title & description writer
  var af = $("ai-form");
  if (af) af.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var out = $("ai-out"), btn = af.querySelector("button[type=submit]");
    btn.disabled = true; out.innerHTML = "<p>Writing… this takes a few seconds.</p>";
    fetch("/api/ai-snippet", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: val("ai-url"), about: $("ai-about").value, keyword: val("ai-kw"), town: val("ai-town") }) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.error) { out.innerHTML = '<p class="s-fail">' + esc(j.error) + "</p>"; return; }
        var row = function (x, max) { return '<li style="display:block;padding:10px 0;border-bottom:1px solid var(--line)"><span>' + esc(x.t) + '</span> <span class="small" style="color:' + col(x.px <= max, x.px <= max * 1.07) + '">' + x.px + " px</span> <button type=\"button\" class=\"btn ghost ai-cp\" style=\"padding:4px 12px;font-size:14px\" data-t=\"" + esc(x.t) + '">Copy</button></li>'; };
        out.innerHTML = (j.current ? '<p class="small"><strong>Now:</strong> ' + esc(j.current.title || "(no title)") + " — " + esc(j.current.desc || "(no description)") + "</p>" : "") +
          "<h3>Titles</h3><ul style=\"list-style:none;padding:0;margin:0\">" + j.titles.map(function (x) { return row(x, 580); }).join("") + "</ul>" +
          "<h3 style=\"margin-top:18px\">Meta descriptions</h3><ul style=\"list-style:none;padding:0;margin:0\">" + j.descriptions.map(function (x) { return row(x, 990); }).join("") + "</ul>" +
          '<p class="small">Written by AI – check every word is true for your business before using it. Press "Write with AI" again for new ideas.</p>';
        out.querySelectorAll(".ai-cp").forEach(function (b) { b.addEventListener("click", function () { var t = b.getAttribute("data-t"); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select and copy"; }); }); });
      })
      .catch(function () { out.innerHTML = '<p class="s-fail">Something went wrong – please try again.</p>'; })
      .then(function () { btn.disabled = false; });
  });

  // ---- bulk SEO checker
  var bk = $("bk-form");
  if (bk) bk.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var urls = $("bk-urls").value.split(/\s+/).filter(function (x) { return /\./.test(x); }), seen = {};
    urls = urls.filter(function (u) { u = u.toLowerCase(); if (seen[u]) return false; seen[u] = 1; return true; }).slice(0, 20);
    var out = $("bk-out"); if (!urls.length) { out.innerHTML = '<p class="s-warn">Add at least one web address.</p>'; return; }
    var res = urls.map(function () { return null; }), next = 0, done = 0;
    var draw = function () {
      out.innerHTML = '<p class="small">' + done + " of " + urls.length + " checked</p>" + '<div class="tablewrap"><table><thead><tr><th>Page</th><th>SEO</th><th>AI</th><th>Failed</th><th>Words</th><th>Title</th></tr></thead><tbody>' + urls.map(function (u, i) {
        var r = res[i]; if (!r) return "<tr><td>" + esc(u) + '</td><td colspan="5" class="small">Waiting…</td></tr>';
        if (r.error) return "<tr><td>" + esc(u) + '</td><td colspan="5" class="s-fail">' + esc(r.error) + "</td></tr>";
        return '<tr><td style="overflow-wrap:anywhere"><a href="/seo-checker?url=' + encodeURIComponent(r.url) + '">' + esc(r.url.replace(/^https?:\/\/(www\.)?/, "")) + '</a></td><td><b style="color:' + col(r.score >= 90, r.score >= 70) + '">' + r.score + "</b></td><td>" + r.aiScore + "</td><td>" + r.counts.fail + "</td><td>" + r.facts.words + '</td><td class="small">' + esc((r.facts.title || "").slice(0, 60)) + "</td></tr>";
      }).join("") + "</tbody></table></div>" + (done === urls.length ? '<p><button type="button" class="btn ghost" id="bk-csv">Download CSV</button></p>' : "");
      var c = $("bk-csv"); if (c) c.onclick = function () {
        var cell = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
        var rows = [["url", "seo_score", "ai_score", "failed", "warnings", "words", "title"]].concat(res.map(function (r, i) { return r && !r.error ? [r.url, r.score, r.aiScore, r.counts.fail, r.counts.warn, r.facts.words, r.facts.title] : [urls[i], "error", (r && r.error) || ""]; }));
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n")], { type: "text/csv" })); a.download = "xkey-bulk-check.csv"; document.body.appendChild(a); a.click(); a.remove();
      };
    };
    var work = function () {
      if (next >= urls.length) return; var i = next++;
      fetch("/api/check?url=" + encodeURIComponent(urls[i])).then(function (r) { return r.json(); }).then(function (j) { res[i] = j.error ? { error: j.error } : j; }, function () { res[i] = { error: "Couldn't be checked" }; })
        .then(function () { done++; draw(); work(); });
    };
    draw(); work(); work(); work();
  });

  // ---- score badge
  live("bd-form", function () {
    var site = val("bd-site").replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
    if (!site) { $("bd-prev").innerHTML = '<span class="small">Enter your website to see your badge.</span>'; $("bd-code").textContent = ""; return; }
    var img = "https://xkey.co.uk/badge.svg?site=" + encodeURIComponent(site);
    var code = '<a href="https://xkey.co.uk/seo-checker?url=' + encodeURIComponent(site) + '" title="SEO score checked by XKey"><img src="' + img + '" alt="XKey SEO score" height="22"></a>';
    $("bd-prev").innerHTML = '<img src="/badge.svg?site=' + encodeURIComponent(site) + '" alt="XKey SEO score" height="22">';
    $("bd-code").textContent = code;
  });
  copyBtn("bd-copy", "bd-code");
}