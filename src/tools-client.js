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
        h += '<p class="small">Certificate dates come from public Certificate Transparency logs (crt.sh), which list every certificate issued; the server checks are made live. See all response headers with the <a href="/http-header-checker?url=' + encodeURIComponent("https://" + j.name) + '">HTTP header checker</a>.</p>';
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
      return '<div class="card" style="margin:16px 0"><p class="ct">' + esc(label) + ": " + esc(r.domain) + '</p><div class="row" style="gap:28px"><div><b style="font-size:30px">' + r.refDomains.toLocaleString("en-GB") + '</b><br><span class="small">websites link to it</span></div><div><b style="font-size:30px;color:' + col(r.strength >= 40, r.strength >= 20) + '">' + r.strength + '</b><br><span class="small">link strength (0–100)</span></div></div></div>';
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