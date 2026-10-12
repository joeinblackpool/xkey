// Browser-only tools served as /assets/extra.js: image compressor, QR code and Google review link maker,
// and the UK privacy policy generator. Nothing is uploaded – files and text never leave the visitor's browser.
// Served from Function#toString (see index.js), so no imports and no bundler helpers in here.

/** QR code (byte mode) as a square boolean matrix. ecl: "L" | "M" | "Q" | "H". Versions 1–40, smallest that fits;
 *  the mask with the lowest penalty (ISO/IEC 18004). `forceMask` is for tests. Returns null when the text is too long. */
export function qrMatrix(text, ecl, forceMask) {
  var EC = { L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30] };
  var NB = { L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81] };
  var FB = { L: 1, M: 0, Q: 3, H: 2 };
  ecl = EC[ecl] ? ecl : "M";
  var bytes = Array.from(new TextEncoder().encode(String(text)));
  var rawModules = function (v) { var r = (16 * v + 128) * v + 64; if (v >= 2) { var n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; };
  var dataCw = function (v) { return Math.floor(rawModules(v) / 8) - EC[ecl][v - 1] * NB[ecl][v - 1]; };
  var ver = 0;
  for (var v = 1; v <= 40; v++) { var bits = 4 + (v < 10 ? 8 : 16) + 8 * bytes.length; if (bits <= dataCw(v) * 8) { ver = v; break; } }
  if (!ver) return null;
  // data bits
  var bb = [], put = function (val, len) { for (var i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
  var cap = dataCw(ver) * 8;
  put(0, Math.min(4, cap - bb.length)); put(0, (8 - bb.length % 8) % 8);
  for (var pad = 0xec; bb.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);
  var data = []; for (var i = 0; i < bb.length; i += 8) { var x = 0; for (var j = 0; j < 8; j++) x = (x << 1) | bb[i + j]; data.push(x); }
  // Reed–Solomon over GF(256), polynomial 0x11d
  var mul = function (a, b) { var z = 0; for (var k = 7; k >= 0; k--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((b >>> k) & 1) * a; } return z & 0xff; };
  var ecLen = EC[ecl][ver - 1], nb = NB[ecl][ver - 1];
  var div = []; for (i = 0; i < ecLen - 1; i++) div.push(0); div.push(1);
  var root = 1;
  for (i = 0; i < ecLen; i++) { for (j = 0; j < div.length; j++) { div[j] = mul(div[j], root); if (j + 1 < div.length) div[j] ^= div[j + 1]; } root = mul(root, 2); }
  var rs = function (d) { var res = div.map(function () { return 0; }); d.forEach(function (b) { var f = b ^ res.shift(); res.push(0); div.forEach(function (c, k) { res[k] ^= mul(c, f); }); }); return res; };
  var raw = Math.floor(rawModules(ver) / 8), shortLen = Math.floor(raw / nb), nShort = nb - raw % nb, blocks = [], at = 0;
  for (i = 0; i < nb; i++) { var len = shortLen - ecLen + (i < nShort ? 0 : 1), d = data.slice(at, at + len); at += len; var e = rs(d); if (i < nShort) d.push(0); blocks.push(d.concat(e)); }
  var cw = [];
  for (i = 0; i < blocks[0].length; i++) for (j = 0; j < nb; j++) if (i !== shortLen - ecLen || j >= nShort) cw.push(blocks[j][i]);
  // matrix
  var size = ver * 4 + 17, M = [], F = [];
  for (i = 0; i < size; i++) { M.push(new Array(size).fill(false)); F.push(new Array(size).fill(false)); }
  var set = function (x, y, dark) { M[y][x] = dark; F[y][x] = true; };
  for (i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  var finder = function (cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy; if (xx >= 0 && xx < size && yy >= 0 && yy < size) set(xx, yy, d !== 2 && d !== 4); } };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  var al = [];
  if (ver > 1) { var n = Math.floor(ver / 7) + 2, step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2; al = [6]; for (var p = size - 7; al.length < n; p -= step) al.splice(1, 0, p); }
  al.forEach(function (ay, a) { al.forEach(function (ax, b) { if ((a === 0 && b === 0) || (a === 0 && b === al.length - 1) || (a === al.length - 1 && b === 0)) return; for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }); });
  var format = function (mask) {
    var d = (FB[ecl] << 3) | mask, r = d; for (var k = 0; k < 10; k++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    var b = ((d << 10) | r) ^ 0x5412, bit = function (k) { return ((b >>> k) & 1) !== 0; };
    for (k = 0; k <= 5; k++) set(8, k, bit(k));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (k = 9; k < 15; k++) set(14 - k, 8, bit(k));
    for (k = 0; k < 8; k++) set(size - 1 - k, 8, bit(k));
    for (k = 8; k < 15; k++) set(8, size - 15 + k, bit(k));
    set(8, size - 8, true);
  };
  format(0);
  if (ver >= 7) { var r = ver; for (i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1f25); var vb = (ver << 12) | r; for (i = 0; i < 18; i++) { var bt = ((vb >>> i) & 1) !== 0, a2 = size - 11 + i % 3, b2 = Math.floor(i / 3); set(a2, b2, bt); set(b2, a2, bt); } }
  // codewords in the zigzag
  var bi = 0;
  for (var right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (var vert = 0; vert < size; vert++) for (j = 0; j < 2; j++) {
      var xx = right - j, up = ((right + 1) & 2) === 0, yy = up ? size - 1 - vert : vert;
      if (!F[yy][xx] && bi < cw.length * 8) { M[yy][xx] = ((cw[bi >>> 3] >>> (7 - (bi & 7))) & 1) !== 0; bi++; }
    }
  }
  var applyMask = function (mask) {
    for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
      if (F[y][x]) continue;
      var inv = [(x + y) % 2 === 0, y % 2 === 0, x % 3 === 0, (x + y) % 3 === 0, (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, x * y % 2 + x * y % 3 === 0, (x * y % 2 + x * y % 3) % 2 === 0, ((x + y) % 2 + x * y % 3) % 2 === 0][mask];
      if (inv) M[y][x] = !M[y][x];
    }
  };
  var penalty = function () {
    var s = 0, dark = 0, y, x, k;
    var line = function (get) {
      var t = 0, run = 1, hist = [];
      for (var q = 0; q < size; q++) { if (q > 0 && get(q) === get(q - 1)) { run++; } else { if (q > 0) hist.push([get(q - 1), run]); run = 1; } }
      hist.push([get(size - 1), run]);
      hist.forEach(function (h) { if (h[1] >= 5) t += h[1] - 2; });
      var seq = []; for (q = 0; q < size; q++) seq.push(get(q) ? 1 : 0);
      var pat = [1, 0, 1, 1, 1, 0, 1];
      for (q = 0; q + 7 <= size; q++) {
        var m = true; for (var w = 0; w < 7; w++) if (seq[q + w] !== pat[w]) { m = false; break; }
        if (!m) continue;
        var before = true, after = true;
        for (w = 1; w <= 4; w++) { if (q - w >= 0 && seq[q - w]) before = false; if (q + 6 + w < size && seq[q + 6 + w]) after = false; }
        if (before) t += 40; if (after) t += 40;
      }
      return t;
    };
    for (y = 0; y < size; y++) s += line(function (q) { return M[y][q]; });
    for (x = 0; x < size; x++) s += line(function (q) { return M[q][x]; });
    for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) { var c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) s += 3; }
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (M[y][x]) dark++;
    k = Math.ceil(Math.abs(dark * 20 - size * size * 10) / (size * size)) - 1;
    return s + k * 10;
  };
  var best = forceMask, low = Infinity;
  if (best == null) for (var mk = 0; mk < 8; mk++) { applyMask(mk); format(mk); var pen = penalty(); if (pen < low) { low = pen; best = mk; } applyMask(mk); }
  applyMask(best); format(best);
  return M;
}

export function extraApp() {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var kb = function (n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB"; };
  var copy = function (btn, text) { (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); }, function () {}); };

  /* global qrMatrix */
  var qrSvg = function (text, ecl, fg, bg) {
    var m = qrMatrix(text, ecl); if (!m) return null;
    var n = m.length, q = 4, d = "";
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (m[y][x]) d += "M" + (x + q) + " " + (y + q) + "h1v1h-1z";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (n + 2 * q) + " " + (n + 2 * q) + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="' + esc(bg || "#ffffff") + '"/><path d="' + d + '" fill="' + esc(fg || "#000000") + '"/></svg>';
  };
  var svgToPng = function (svg, px, cb) {
    var img = new Image(); img.onload = function () { var c = document.createElement("canvas"); c.width = c.height = px; var g = c.getContext("2d"); g.imageSmoothingEnabled = false; g.drawImage(img, 0, 0, px, px); c.toBlob(cb, "image/png"); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  // ---- QR code generator
  var qf = $("qr-form");
  if (qf) {
    var qupd = function () {
      var t = $("qr-text").value.trim(), out = $("qr-out");
      if (!t) { out.innerHTML = '<p class="small">Type a web address or text to make a QR code.</p>'; return; }
      var svg = qrSvg(t, $("qr-ecl").value, $("qr-fg").value, $("qr-bg").value);
      if (!svg) { out.innerHTML = '<p>That\'s too long for a QR code – keep it under about 2,000 characters, or use a shorter link.</p>'; return; }
      out.innerHTML = '<div class="qr-box" style="max-width:280px;margin:12px 0">' + svg + '</div><div class="row"><a class="btn" id="qr-png" href="#" download="qr-code.png">Download PNG</a><a class="btn ghost" id="qr-svgdl" download="qr-code.svg" href="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '">Download SVG</a></div>';
      svgToPng(svg, 1200, function (b) { var a = $("qr-png"); if (a && b) a.href = URL.createObjectURL(b); });
    };
    ["qr-text", "qr-ecl", "qr-fg", "qr-bg"].forEach(function (id) { $(id).addEventListener("input", qupd); });
    qf.addEventListener("submit", function (ev) { ev.preventDefault(); qupd(); });
    qupd();
  }

  // ---- Google review link + QR card
  var rv = $("rv-form");
  if (rv) {
    var link = function (s) {
      s = s.trim(); if (!s) return "";
      if (/^https?:\/\//i.test(s)) return s; // a g.page/r/…/review or search.google.com link copied from the Business Profile
      if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return "https://search.google.com/local/writereview?placeid=" + s;
      return null;
    };
    var rupd = function () {
      var l = link($("rv-id").value), name = $("rv-name").value.trim(), out = $("rv-out");
      if (l === "") { out.innerHTML = ""; return; }
      if (l === null) { out.innerHTML = '<p>That doesn\'t look like a Place ID (a long code starting with letters such as ChIJ) or a review link. See the steps below for finding yours.</p>'; return; }
      var svg = qrSvg(l, "M");
      out.innerHTML = '<p style="font-weight:600;margin:16px 0 6px">Your review link</p><div class="row"><input id="rv-link" type="text" readonly value="' + esc(l) + '" style="flex:1 1 260px"><button class="btn" type="button" id="rv-copy">Copy</button><a class="btn ghost" href="' + esc(l) + '" target="_blank" rel="noopener">Test it</a></div>' +
        '<div id="rv-card" style="max-width:340px;margin:20px 0;padding:22px;border:2px solid #0e1726;border-radius:14px;text-align:center;background:#fff;color:#0e1726"><p style="margin:0 0 4px;font-size:20px;font-weight:700">' + esc(name || "Enjoyed our service?") + '</p><p style="margin:0 0 12px">Please leave us a Google review</p><div style="max-width:220px;margin:0 auto">' + svg + '</div><p class="small" style="margin:10px 0 0;color:#333">Scan with your phone camera</p></div>' +
        '<div class="row"><a class="btn" id="rv-png" href="#" download="google-review-qr.png">Download QR code</a><button class="btn ghost" type="button" id="rv-print">Print the card</button></div>';
      $("rv-copy").addEventListener("click", function () { copy($("rv-copy"), l); });
      $("rv-print").addEventListener("click", function () { var w = window.open("", "_blank"); if (!w) return; w.document.write("<!doctype html><title>Review card</title><body style=\"font-family:Arial,sans-serif\">" + $("rv-card").outerHTML + "<script>setTimeout(function(){print()},300)<\/script></body>"); w.document.close(); });
      svgToPng(svg, 1200, function (b) { var a = $("rv-png"); if (a && b) a.href = URL.createObjectURL(b); });
    };
    ["rv-id", "rv-name"].forEach(function (id) { $(id).addEventListener("input", rupd); });
    rv.addEventListener("submit", function (ev) { ev.preventDefault(); rupd(); });
  }

  // ---- image compressor (canvas re-encode in the browser)
  var ic = $("ic-form");
  if (ic) {
    var files = [];
    var run = function () {
      var out = $("ic-out"), q = +$("ic-q").value / 100, fmt = $("ic-fmt").value, maxw = +$("ic-w").value || 0;
      $("ic-qv").textContent = $("ic-q").value + "%";
      if (!files.length) { out.innerHTML = ""; return; }
      out.innerHTML = '<p class="small">Compressing ' + files.length + ' image' + (files.length > 1 ? "s" : "") + '…</p>';
      var rows = [], done = 0, before = 0, after = 0;
      files.forEach(function (f, i) {
        var url = URL.createObjectURL(f), img = new Image();
        img.onload = function () {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (maxw && w > maxw) { h = Math.round(h * maxw / w); w = maxw; }
          var c = document.createElement("canvas"); c.width = w; c.height = h;
          var g = c.getContext("2d"), type = fmt === "same" ? (f.type === "image/png" ? "image/png" : f.type === "image/webp" ? "image/webp" : "image/jpeg") : fmt;
          if (type === "image/jpeg") { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); }
          g.drawImage(img, 0, 0, w, h);
          c.toBlob(function (b) {
            var keep = b && b.size < f.size ? b : f, ext = keep === f ? f.name.split(".").pop() : type.split("/")[1].replace("jpeg", "jpg");
            var name = f.name.replace(/\.[^.]+$/, "") + (keep === f ? "" : "-min") + "." + ext;
            before += f.size; after += keep.size;
            rows[i] = "<tr><td style=\"overflow-wrap:anywhere\">" + esc(f.name) + "</td><td>" + img.naturalWidth + "×" + img.naturalHeight + (w !== img.naturalWidth ? " → " + w + "×" + h : "") + "</td><td>" + kb(f.size) + "</td><td><b>" + kb(keep.size) + "</b>" + (keep === f ? " (already small)" : " (−" + Math.round(100 - keep.size / f.size * 100) + "%)") + '</td><td><a href="' + URL.createObjectURL(keep) + '" download="' + esc(name) + '">Download</a></td></tr>';
            URL.revokeObjectURL(url);
            if (++done === files.length) out.innerHTML = '<p><strong>' + kb(before) + " → " + kb(after) + "</strong> (saved " + Math.max(0, Math.round(100 - after / before * 100)) + '%)</p><div class="tablewrap"><table><thead><tr><th>Image</th><th>Size (px)</th><th>Before</th><th>After</th><th></th></tr></thead><tbody>' + rows.join("") + "</tbody></table></div>";
          }, type, q);
        };
        img.onerror = function () { rows[i] = "<tr><td>" + esc(f.name) + '</td><td colspan="4">This file couldn\'t be read as an image.</td></tr>'; if (++done === files.length) out.innerHTML = '<div class="tablewrap"><table><tbody>' + rows.join("") + "</tbody></table></div>"; };
        img.src = url;
      });
    };
    $("ic-file").addEventListener("change", function () { files = Array.from($("ic-file").files || []).slice(0, 30); run(); });
    ["ic-q", "ic-fmt", "ic-w"].forEach(function (id) { $(id).addEventListener("change", run); });
    $("ic-q").addEventListener("input", function () { $("ic-qv").textContent = $("ic-q").value + "%"; });
    ic.addEventListener("submit", function (ev) { ev.preventDefault(); run(); });
  }

  // ---- UK privacy policy and cookie notice generator
  var pp = $("pp-form");
  if (pp) {
    var on = function (id) { return $(id).checked; }, v = function (id) { return $(id).value.trim(); };
    var gen = function () {
      var biz = v("pp-name") || "[Your business name]", site = v("pp-site") || "[yourwebsite.co.uk]", addr = v("pp-addr") || "[Your business address]", mail = v("pp-email") || "[your email address]", ico = v("pp-ico");
      var today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      var uses = [], third = [], cookies = [];
      if (on("pp-contact")) uses.push(["When you contact us by email, phone or our contact form", "your name, contact details and what you tell us", "to reply to you and provide what you ask for", "legitimate interests, or taking steps at your request before entering into a contract", "up to 2 years after our last contact, unless you become a customer"]);
      if (on("pp-orders")) uses.push(["When you buy from us or book a service", "your name, address, contact details, what you ordered and payment records (card details are handled by our payment provider, not stored by us)", "to provide what you ordered, take payment, deliver, handle returns and keep accounts", "contract, and legal obligation for tax records", "6 years after the end of the tax year, as HMRC requires"]);
      if (on("pp-news")) uses.push(["When you sign up for our emails", "your email address and name, and whether you open our emails", "to send you news and offers you asked for", "consent – you can unsubscribe at any time using the link in every email", "until you unsubscribe"]);
      if (on("pp-booking")) uses.push(["When you book an appointment online", "your name, contact details and booking details", "to manage your booking and send reminders", "contract", "2 years after your last appointment"]);
      if (on("pp-jobs")) uses.push(["When you apply for a job with us", "your CV, contact details and anything else you send", "to consider your application", "legitimate interests, or steps before a contract", "6 months after the role is filled, unless you agree to us keeping it longer"]);
      if (on("pp-ga")) { third.push("Google Analytics (Google Ireland Ltd / Google LLC) – to understand how visitors use our website"); cookies.push(["Google Analytics (_ga, _ga_*)", "Counts visits and shows which pages are popular. Only set if you accept analytics cookies.", "Up to 2 years"]); }
      if (on("pp-ads")) { third.push("Advertising platforms such as Meta (Facebook/Instagram) and Google Ads – to measure and improve our adverts"); cookies.push(["Advertising cookies (for example _fbp, _gcl_au)", "Measure whether our adverts lead to enquiries and show relevant adverts. Only set if you accept marketing cookies.", "Up to 90 days"]); }
      if (on("pp-orders")) third.push("Our payment provider, to take payments securely");
      if (on("pp-news")) third.push("Our email marketing service, to send our emails");
      third.push("Our website host and email provider, who store data on our behalf", "Our accountant, and HMRC or other authorities where the law requires");
      cookies.unshift(["Essential cookies", "Make the website work – for example remembering your cookie choice" + (on("pp-orders") ? " and your basket" : "") + ". These don't need consent.", "Session or up to 1 year"]);
      var abroad = on("pp-ga") || on("pp-ads");
      var h = function (t) { return "<h2>" + t + "</h2>"; }, p = function (t) { return "<p>" + t + "</p>"; };
      var html = "<h1>Privacy policy</h1>" + p("Last updated: " + today) +
        p("This policy explains how " + esc(biz) + " (\"we\", \"us\") collects and uses your personal information when you use " + esc(site) + " or deal with us, and the rights you have under UK data protection law (the UK GDPR and the Data Protection Act 2018).") +
        h("Who we are") + p(esc(biz) + " is the controller of your personal information. Our address is " + esc(addr) + ". You can contact us about anything in this policy at " + esc(mail) + "." + (ico ? " We are registered with the Information Commissioner's Office (ICO), registration number " + esc(ico) + "." : "")) +
        h("What we collect and why") + (uses.length ? uses.map(function (u) { return "<h3>" + esc(u[0]) + "</h3><ul><li><strong>What:</strong> " + esc(u[1]) + "</li><li><strong>Why:</strong> " + esc(u[2]) + "</li><li><strong>Legal basis:</strong> " + esc(u[3]) + "</li><li><strong>How long we keep it:</strong> " + esc(u[4]) + "</li></ul>"; }).join("") : p("We only collect the information you choose to give us, and use it to reply to you.")) +
        p("Our website also records basic technical information (such as your IP address and browser) in server logs for security, kept for a short time.") +
        h("Who we share it with") + "<ul>" + third.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" + p("We never sell your personal information.") +
        (abroad ? h("Transfers outside the UK") + p("Some of these providers store data outside the UK, including in the USA. Where they do, the transfer is protected by UK adequacy regulations (including the UK–US data bridge) or by the ICO's approved contract terms.") : "") +
        h("Cookies") + p("Cookies are small files stored on your device. We use:") + '<div class="tablewrap"><table><thead><tr><th>Cookie</th><th>What it does</th><th>How long</th></tr></thead><tbody>' + cookies.map(function (c) { return "<tr><td>" + esc(c[0]) + "</td><td>" + esc(c[1]) + "</td><td>" + esc(c[2]) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
        (cookies.length > 1 ? p("We only set non-essential cookies if you agree to them in our cookie banner. You can change your mind at any time using the cookie settings link on our website, or by clearing cookies in your browser.") : "") +
        h("Your rights") + "<ul><li>to be told how we use your information (this policy);</li><li>to get a copy of the information we hold about you;</li><li>to have it corrected if it's wrong;</li><li>to have it deleted, or its use restricted, in some circumstances;</li><li>to object to us using it, including for direct marketing at any time;</li><li>to have it transferred to another organisation, in some circumstances;</li><li>to withdraw consent at any time, where we rely on consent.</li></ul>" + p("To use any of these rights, email " + esc(mail) + ". We'll reply within one month and won't usually charge.") +
        h("Complaints") + p("If you're unhappy with how we've handled your information, please tell us first so we can put it right. You can also complain to the Information Commissioner's Office: ico.org.uk/make-a-complaint, or call 0303 123 1113.") +
        h("Changes to this policy") + p("We'll update this page if we change how we use your information. The date at the top shows when it last changed.");
      $("pp-preview").innerHTML = html.replace(/<(\/?)h([123])>/g, function (m, c, n) { return "<" + c + "h" + (+n + 1) + ">"; }); // one h1 per page: the preview sits below the tool's own heading
      $("pp-html").value = html.replace(/<\/(h1|h2|h3|p|ul|table|div)>/g, "</$1>\n");
      var text = html.replace(/<li>/g, "• ").replace(/<\/(h1|h2|h3|p|li|tr)>/g, "\n").replace(/<\/t[dh]>/g, " | ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\n{3,}/g, "\n\n");
      $("pp-text").value = text;
      $("pp-banner").value = cookies.length > 1 ? "We use essential cookies to make our website work. With your permission we'd also like to set " + [on("pp-ga") ? "analytics cookies to understand how it's used" : "", on("pp-ads") ? "marketing cookies to measure our adverts" : ""].filter(Boolean).join(" and ") + ". [Accept all]  [Reject all]  [Choose]  –  See our privacy policy for details." : "This website only uses essential cookies, which don't need your consent, so you don't need a cookie banner. Mention them in your privacy policy (done above).";
    };
    pp.addEventListener("input", gen); pp.addEventListener("change", gen);
    pp.addEventListener("submit", function (ev) { ev.preventDefault(); gen(); });
    ["pp-copyhtml", "pp-copytext"].forEach(function (id) { $(id).addEventListener("click", function () { copy($(id), $(id === "pp-copyhtml" ? "pp-html" : "pp-text").value); }); });
    gen();
  }
}
