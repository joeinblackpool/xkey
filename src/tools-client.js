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
          '<p class="small">An estimate from how strongly each ranking page targets the keyword and what kind of site it is. Backlinks aren\'t measured, so treat big-name sites as harder than they look.</p>';
      });
    });
  }
}
