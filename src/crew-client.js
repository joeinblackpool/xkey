// The crew: small ink-drawn figures that live around the page (logo, nav, forms, buttons, margins,
// footer) and react to what the visitor does. Pure decoration: served as /assets/crew-<hash>.js and
// loaded by SITE_JS only after the load event, when the browser is idle, and never for reduced-motion
// or data-saver visitors. Everything sits in aria-hidden, pointer-events:none layers positioned
// absolutely or fixed, so nothing in the page moves (no layout shift), nothing can be clicked by
// mistake, and there is no text: the figures carry no names or labels for visitors or search engines.
// Served from Function#toString, so no imports or bundler helpers in here.
export function crewApp() {
  var d = document, w = window, de = d.documentElement;
  if (d.getElementById("xkc") || !w.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var fine = matchMedia("(pointer: fine)").matches;
  var wide = function () { return innerWidth >= 900; };
  var margin = function () { return (innerWidth - Math.min(1100, innerWidth)) / 2; };
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var css = "#xkc,.xkc-f{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;color:var(--fg);z-index:50}.xkc-f{position:fixed;inset:0;width:auto;height:auto;overflow:hidden}" +
    "#xkc>div,.xkc-f>div{position:absolute;pointer-events:none}#xkc svg,.xkc-f svg{display:block;overflow:visible;max-width:none}.xkc-c{overflow:hidden}" +
    ".xkc-al,.xkc-ar,.xkc-x{transform-box:view-box;transform-origin:16px 21px}.xkc-ac{fill:var(--brand);stroke:var(--brand)}.xkc-hide{opacity:0}" +
    "@keyframes xkc-rub{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}@keyframes xkc-askew{0%,100%{transform:none}20%,70%{transform:rotate(-9deg) translateY(2px)}}" +
    "@keyframes xkc-wave{0%,100%{transform:rotate(0)}50%{transform:rotate(-40deg)}}@keyframes xkc-wave2{0%,100%{transform:rotate(0)}50%{transform:rotate(40deg)}}" +
    "@keyframes xkc-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes xkc-shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}" +
    "@keyframes xkc-pull{from{width:0}to{width:86%}}@keyframes xkc-dive{0%{transform:none}35%{transform:translateY(46px)}65%{transform:translateY(46px)}100%{transform:none}}" +
    "@keyframes xkc-bungee{0%{transform:translateY(-70px)}42%{transform:translateY(52vh)}58%{transform:translateY(40vh)}72%{transform:translateY(48vh)}100%{transform:translateY(-70px)}}" +
    "@keyframes xkc-cord{0%{transform:scaleY(0)}42%{transform:scaleY(1)}58%{transform:scaleY(.77)}72%{transform:scaleY(.92)}100%{transform:scaleY(0)}}" +
    "@keyframes xkc-paint{0%,100%{transform:translateY(0)}50%{transform:translateY(-60px)}}@keyframes xkc-strip{0%{transform:scaleY(0);opacity:.5}50%{transform:scaleY(1);opacity:.5}90%,100%{transform:scaleY(1);opacity:0}}" +
    "@keyframes xkc-launch{0%{transform:translateY(0)}25%{transform:translateY(-70vh)}100%{transform:translateY(0);opacity:0}}@keyframes xkc-chute{0%,22%{transform:scale(0)}30%,100%{transform:scale(1)}}" +
    "@keyframes xkc-clean{0%{transform:translateY(-80px)}4%,18%{transform:translateY(30vh)}22%,100%{transform:translateY(-80px)}}@keyframes xkc-squee{0%,100%{transform:translateX(0)}50%{transform:translateX(-26px)}}" +
    "@keyframes xkc-hatch{0%,8%,26%,100%{transform:scaleY(1)}11%,23%{transform:scaleY(.05)}}@keyframes xkc-peek{0%,10%,25%,100%{transform:translateY(30px)}13%,21%{transform:translateY(0)}}" +
    "@keyframes xkc-pounce{0%,100%{transform:none}40%{transform:translate(14px,-14px) rotate(15deg)}}@keyframes xkc-cheer{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(-150deg)}}@keyframes xkc-cheer2{0%,100%{transform:rotate(150deg)}50%{transform:rotate(20deg)}}" +
    "@keyframes xkc-pop{0%{transform:translateY(40px)}20%,80%{transform:none}100%{transform:translateY(40px)}}@keyframes xkc-curtain{0%,100%{transform:scaleY(0)}40%,60%{transform:scaleY(1)}}" +
    "@keyframes xkc-z{0%{transform:translate(0,0);opacity:0}30%{opacity:1}100%{transform:translate(8px,-16px);opacity:0}}@keyframes xkc-pace{0%,100%{transform:translateX(0) scaleX(1)}45%{transform:translateX(30px) scaleX(1)}50%{transform:translateX(30px) scaleX(-1)}95%{transform:translateX(0) scaleX(-1)}}" +
    "@keyframes xkc-swing{0%,100%{transform:rotate(18deg)}50%{transform:rotate(-18deg)}}@keyframes xkc-catch{0%,100%{transform:translateY(26px)}25%,75%{transform:none}}" +
    ".xkc-logo .xkc-cl{animation:xkc-rub .5s ease-in-out infinite}.logo b.xkc-tilt{animation:xkc-askew 1.4s ease-in-out}" +
    ".xkc-rope svg{transition:transform .5s var(--ease)!important}.xkc-rope.on svg{transform:translateY(18px)}.xkc-gate.on .xkc-ar{transform:rotate(-150deg)}" +
    ".xkc-pp{left:0;top:0;height:3px;background:var(--brand);animation:xkc-pull 5s cubic-bezier(.1,.6,.3,1) forwards}.xkc-pp>div{position:absolute;right:-26px;top:-8px;animation:xkc-bob .22s linear infinite}" +
    ".xkc-sniff.dive svg{animation:xkc-dive 1.3s var(--ease)}.xkc-sniff .xkc-mg{opacity:0}.xkc-sniff.found .xkc-mg{opacity:1}" +
    ".xkc-bj{top:0}.xkc-bj>i{position:absolute;left:15px;top:0;width:1px;height:52vh;background:currentColor;transform-origin:top;transform:scaleY(0)}.xkc-bj.go>i{animation:xkc-cord 2.4s var(--ease)}.xkc-bj>svg{transform:translateY(-70px) rotate(180deg)}.xkc-bj.go>svg{animation:xkc-bungee 2.4s var(--ease)}" +
    ".xkc-build .xkc-x{animation:xkc-paint 6s ease-in-out infinite}.xkc-build>i{position:absolute;left:30px;bottom:30px;width:6px;height:90px;background:var(--brand);transform-origin:bottom;animation:xkc-strip 6s ease-in-out infinite}" +
    ".xkc-para{animation:xkc-launch 5s var(--ease) forwards}.xkc-para .xkc-ch{transform-box:view-box;transform-origin:16px 0;animation:xkc-chute 5s var(--ease) forwards}" +
    ".xkc-win{top:0;animation:xkc-clean 40s var(--ease) infinite 9s;transform:translateY(-80px)}.xkc-win .xkc-sq{animation:xkc-squee 1.1s ease-in-out infinite}" +
    ".xkc-trap>b{position:absolute;left:4px;bottom:0;width:24px;height:22px;border:1px solid currentColor;opacity:.45;transform-origin:top;animation:xkc-hatch 34s infinite 14s}.xkc-trap .xkc-c{position:absolute;left:0;bottom:0;width:32px;height:30px}.xkc-trap svg{transform:translateY(30px);animation:xkc-peek 34s infinite 14s}" +
    ".xkc-pc{transition:transform .25s var(--ease)!important}.xkc-pc.jump svg{animation:xkc-pounce .45s var(--ease)}" +
    ".xkc-shy .xkc-al{transform:rotate(-142deg)}.xkc-shy .xkc-ar{transform:rotate(142deg)}.xkc-shy .xkc-e{opacity:0}" +
    ".xkc-dodge svg{transform:translateY(8px);transition:transform .3s var(--ease)!important}.xkc-dodge .xkc-sh{opacity:0}.xkc-dodge.on svg{transform:translateY(0) rotate(-8deg)}.xkc-dodge.on .xkc-sh{opacity:1}" +
    ".xkc-cheer .xkc-al{animation:xkc-cheer .7s ease-in-out infinite}.xkc-cheer .xkc-ar{animation:xkc-cheer2 .7s ease-in-out infinite}.xkc-cheer.on .xkc-al,.xkc-cheer.on .xkc-ar{animation-duration:.3s}" +
    ".xkc-err svg{animation:xkc-pop 2.6s var(--ease) forwards}.xkc-err .xkc-hd{transform-box:view-box;transform-origin:16px 17px;animation:xkc-shake .4s ease-in-out 4 .4s}" +
    ".xkc-dark .xkc-gg{opacity:0}.xkc-dark.night .xkc-gg{opacity:1}.xkc-dark>i{position:absolute;left:-4px;top:-6px;width:40px;height:52px;background:currentColor;transform-origin:top;transform:scaleY(0)}.xkc-dark.flip>i{animation:xkc-curtain 1.2s var(--ease)}" +
    ".xkc-sleep svg{transform:rotate(90deg) translate(14px,0)}.xkc-sleep .xkc-z{animation:xkc-z 2.5s ease-out infinite}.xkc-sleep .xkc-z2{animation-delay:1.2s}.xkc-sleep .xkc-q{opacity:0}.xkc-sleep.awake svg{transform:none;transition:transform .2s!important}.xkc-sleep.awake .xkc-z{display:none}.xkc-sleep.awake .xkc-q{opacity:1}" +
    ".xkc-guard svg{animation:xkc-pace 7s ease-in-out infinite}.xkc-swing svg{transform-origin:11px -13px;animation:xkc-swing 2.6s ease-in-out infinite}" +
    ".xkc-trash .xkc-c{position:absolute;left:0;top:0;width:32px;height:30px}.xkc-trash .xkc-c svg{transform:translateY(26px)}.xkc-trash.on .xkc-c svg{animation:xkc-catch 1.6s var(--ease)}" +
    ".btn.xkc-up{background:var(--bg)!important}.btn.xkc-up:hover,.btn.xkc-up:focus-visible{background:var(--fg)!important}@media print{#xkc,.xkc-f,.xkc-up{display:none!important}}";
  var st = d.createElement("style"); st.textContent = css; d.head.appendChild(st);
  var mk = function (cls, html, parent) { var e = d.createElement("div"); e.className = cls; e.innerHTML = html || ""; (parent || layer).appendChild(e); return e; };
  var layer = d.createElement("div"); layer.id = "xkc"; layer.setAttribute("aria-hidden", "true"); d.body.appendChild(layer);
  var fixed = d.createElement("div"); fixed.className = "xkc-f"; fixed.setAttribute("aria-hidden", "true"); d.body.appendChild(fixed);

  // One figure: head, eyes, body, arms (rotate at the shoulder), legs; extra = props in brand colour.
  var S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var fig = function (extra, o) {
    o = o || {}; var sc = o.s || 1;
    return '<svg viewBox="0 0 32 44" width="' + 32 * sc + '" height="' + 44 * sc + '" focusable="false"><g ' + S + '><path d="M16 17v14"/><path d="' + (o.sit ? "M16 31l-6 2v7M16 31l6 2v7" : "M16 31l-5 11M16 31l5 11") + '"/><path class="xkc-al" d="M16 21l-6 7"/><path class="xkc-ar" d="M16 21l6 7"/><g class="xkc-hd"><circle cx="16" cy="10" r="7" style="fill:var(--xkc-bg,var(--bg))"/><g class="xkc-e" fill="currentColor" stroke="none"><circle cx="13.5" cy="10" r="1.1"/><circle cx="18.5" cy="10" r="1.1"/></g>' + (o.head || "") + "</g>" + (extra || "") + "</g></svg>";
  };

  // Figures pinned to something on the page are re-placed whenever the layout changes.
  var pins = [];
  var pin = function (node, target, fx, fy) {
    if (target.closest(".cta")) { node.style.color = "var(--hero-fg)"; node.style.setProperty("--xkc-bg", "var(--hero)"); }
    pins.push([node, target, fx, fy]);
  };
  var place = function () {
    var vw = de.clientWidth;
    pins.forEach(function (p) {
      var r = p[1].getBoundingClientRect(), n = p[0];
      if (!r.width || !p[1].isConnected) { n.style.display = "none"; return; }
      n.style.display = "";
      var x = r.left + scrollX + p[2](r), nw = n.offsetWidth || 32;
      n.style.left = Math.max(0, Math.min(vw - nw - 2, x)) + "px";
      n.style.top = Math.max(0, r.top + scrollY + p[3](r)) + "px";
    });
  };
  var queued = false;
  var later = function () { if (!queued) { queued = true; requestAnimationFrame(function () { queued = false; place(); }); } };
  addEventListener("resize", later);
  if (w.ResizeObserver) new ResizeObserver(later).observe(d.body);
  var every = function (ms, f) { setInterval(function () { if (!d.hidden) f(); }, ms); };
  var flash = function (n, cls, ms) { n.classList.remove(cls); void n.offsetWidth; n.classList.add(cls); clearTimeout(n._t); n._t = setTimeout(function () { n.classList.remove(cls); }, ms); };

  // Header: polishes the logo (and now and then knocks a letter askew), hangs on a rope by the menu,
  // and salutes when a menu link is pointed at.
  var logo = $("header .logo");
  if (logo) {
    var lc = mk("xkc-logo", fig('<path class="xkc-cl xkc-ac" d="M3 26h7v4H3z"/>', { s: .8 }));
    lc.querySelector(".xkc-ar").setAttribute("d", "M16 21l-8 6");
    pin(lc, logo, function (r) { return r.width + 2; }, function (r) { return r.height / 2 - 20; });
    var lb = $("b", logo);
    if (lb) every(14000, function () { flash(lb, "xkc-tilt", 1500); });
  }
  var menu = $("header .nav ul");
  if (menu && wide()) {
    var rope = mk("xkc-rope", '<svg viewBox="0 0 2 30" width="2" height="30"><path d="M1 0v30" stroke="currentColor"/></svg>' + fig("", { s: .7 }));
    rope.firstChild.style.marginLeft = "11px";
    rope.querySelector(".xkc-al").setAttribute("d", "M16 21l-1-14");
    rope.querySelector(".xkc-ar").setAttribute("d", "M16 21l1-14");
    pin(rope, menu, function () { return -36; }, function (r) { return -r.top - scrollY; });
    var gate = mk("xkc-gate", fig("", { s: .7 }));
    var hdr = $("header.top");
    pin(gate, menu, function (r) { return r.width + 8; }, function () { return (hdr ? hdr.getBoundingClientRect().bottom : 64) - menu.getBoundingClientRect().top - 31; });
    menu.addEventListener("mouseover", function (e) { if (e.target.closest("a")) { rope.classList.add("on"); flash(gate, "on", 700); } });
    menu.addEventListener("mouseleave", function () { rope.classList.remove("on"); });
  }

  // Following a link or sending a form: one drags the loading bar across the top.
  var puller = function () {
    var old = $(".xkc-pp", fixed); if (old) old.remove();
    var bar = mk("xkc-pp", "<div>" + fig('<path d="M-6 26h12"/>', { s: .6 }) + "</div>", fixed);
    bar.querySelector(".xkc-ar").setAttribute("d", "M16 21l-10 5");
  };
  d.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute("download") || a.origin !== location.origin || (a.pathname === location.pathname && a.hash)) return;
    setTimeout(function () { if (!e.defaultPrevented) puller(); }, 0);
  });
  d.addEventListener("submit", function (e) { setTimeout(function () { if (!e.defaultPrevented) puller(); }, 0); });
  addEventListener("pageshow", function (e) { if (e.persisted) { var o = $(".xkc-pp", fixed); if (o) o.remove(); } });

  // The main address box: sits on top, dives in when you type and comes back with a magnifying glass.
  var box = $(".ck-form input:not([type=hidden])");
  if (box) {
    var sn = mk("xkc-sniff xkc-c", fig('<g class="xkc-mg"><circle cx="25" cy="27" r="3.5"/><path d="M27.5 29.5l3 3"/></g>', { s: .75, sit: true }));
    sn.style.height = "31px";
    pin(sn, box, function (r) { return Math.max(8, r.width - 60); }, function () { return -30; });
    var diving = false;
    box.addEventListener("input", function () {
      if (diving) return; diving = true; sn.classList.remove("found");
      flash(sn, "dive", 1300);
      setTimeout(function () { sn.classList.add("found"); }, 700);
      setTimeout(function () { sn.classList.remove("found"); diving = false; }, 3200);
    });
  }

  // Scrolling down fast: a bungee jump down the side of the screen.
  var bj = mk("xkc-bj", "<i></i>" + fig("", { s: .8 }), fixed);
  bj.style.right = wide() ? "18px" : "4px";
  var ly = scrollY, lt = Date.now(), rest = 0;
  addEventListener("scroll", function () {
    var now = Date.now(), v = (scrollY - ly) / Math.max(1, now - lt); ly = scrollY; lt = now;
    if (v > 3 && now > rest) { rest = now + 9000; flash(bj, "go", 2500); }
  }, { passive: true });

  // Margins on wide screens: a builder painting, a window cleaner, a trapdoor with binoculars.
  if (innerWidth >= 1280 && margin() > 80) {
    var bu = mk("xkc-build", "<i></i>" + fig('<path class="xkc-ac" d="M9 8a7 7 0 0 1 14 0z"/><path class="xkc-x" d="M22 28l8-4v-10M27 14h7"/>'), fixed);
    bu.style.left = "16px"; bu.style.bottom = "14%";
    var wc = mk("xkc-win", '<svg viewBox="0 0 40 2" width="40" height="2"><path d="M0 1h40" stroke="currentColor"/></svg>' + fig('<path class="xkc-sq" d="M3 18v10M3 23h7"/>', { s: .8 }), fixed);
    wc.style.right = "26px";
    var tr = mk("xkc-trap", '<div class="xkc-c">' + fig('<g class="xkc-ac"><circle cx="13" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/></g>', { s: .7 }) + "</div><b></b>", fixed);
    tr.style.left = "28px"; tr.style.top = "38%"; tr.style.width = "32px"; tr.style.height = "40px";
  }

  // Back to top: a parachutist is launched up and floats back down.
  var up = d.createElement("button");
  up.type = "button"; up.className = "btn xkc-up"; up.setAttribute("aria-label", "Back to top");
  up.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 13V3M3 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  up.style.cssText = "position:fixed;right:14px;bottom:14px;width:46px;height:46px;padding:0;display:none;z-index:51;align-items:center;justify-content:center";
  d.body.appendChild(up);
  var peak = 0;
  addEventListener("scroll", function () {
    peak = Math.max(peak, scrollY);
    var show = scrollY > innerHeight * 1.5 && scrollY < peak - 40;
    if (scrollY < innerHeight) peak = scrollY;
    up.style.display = show ? "flex" : "none";
  }, { passive: true });
  up.addEventListener("click", function () {
    scrollTo({ top: 0, behavior: "smooth" }); up.style.display = "none"; peak = 0;
    var p = mk("xkc-para", fig('<path class="xkc-ch" d="M2 2q14-14 28 0zM2 2l12 17M30 2l-12 17"/>'), fixed);
    p.style.right = "20px"; p.style.bottom = "16px";
    setTimeout(function () { p.remove(); }, 5100);
  });

  // Mouse users: a small one follows the pointer at a safe distance and pounces when it stops.
  if (fine && wide()) {
    var pc = mk("xkc-pc", fig("", { s: .55 }), fixed), mx = -99, my = -99, still;
    pc.style.left = "0"; pc.style.top = "0"; pc.style.display = "none";
    addEventListener("mousemove", function (e) {
      mx = e.clientX - 46; my = e.clientY + 18; pc.style.display = "";
      pc.style.transform = "translate(" + mx + "px," + my + "px)";
      clearTimeout(still); still = setTimeout(function () { flash(pc, "jump", 460); }, 1400);
    }, { passive: true });
    d.addEventListener("mouseleave", function () { pc.style.display = "none"; clearTimeout(still); });
  }

  // Text you paste or type in a big box stays private, so this one covers its eyes while you type.
  var ta = $("main textarea");
  if (ta) {
    var sk = mk("xkc-keep", fig("", { s: .75, sit: true }));
    pin(sk, ta, function (r) { return r.width - 40; }, function () { return -33; });
    ta.addEventListener("focus", function () { sk.classList.add("xkc-shy"); });
    ta.addEventListener("blur", function () { sk.classList.remove("xkc-shy"); });
  }

  // The main button: one hides behind it and puts up a shield when the pointer comes near.
  var cta = $(".ck-form .btn") || $(".cta .btn");
  if (cta) {
    var dg = mk("xkc-dodge xkc-c", fig('<path class="xkc-sh xkc-ac" d="M24 18h7v6q0 5-3.5 7q-3.5-2-3.5-7z"/>', { s: .75 }));
    dg.style.height = "24px";
    pin(dg, cta, function (r) { return r.width - 34; }, function () { return -23; });
    cta.addEventListener("mouseenter", function () { dg.classList.add("on"); });
    cta.addEventListener("mouseleave", function () { dg.classList.remove("on"); });
  }
  // Another button to press: a cheerleader with pom-poms beside it.
  var go = [].filter.call(d.querySelectorAll("main form.tool button[type=submit], main .cta .btn, main form.tool .btn"), function (b) { return b !== cta; })[0];
  if (go) {
    var ch = mk("xkc-cheer", fig('<circle class="xkc-ac xkc-al" cx="10" cy="29" r="2.6"/><circle class="xkc-ac xkc-ar" cx="22" cy="29" r="2.6"/>', { s: .8 }));
    pin(ch, go, function (r) { return r.width + 10; }, function (r) { return r.height - 36; });
    go.addEventListener("mouseenter", function () { ch.classList.add("on"); });
    go.addEventListener("mouseleave", function () { ch.classList.remove("on"); });
  }

  // A field filled in wrongly: up pops one shaking its head behind a big warning sign.
  d.addEventListener("invalid", function (e) {
    var f = e.target; if (!f.getBoundingClientRect) return;
    var old = $(".xkc-err", layer); if (old) old.remove();
    var er = mk("xkc-err xkc-c", fig('<path class="xkc-ac" d="M20 14h11v10H20z"/><path d="M25.5 16v4.5M25.5 22v.2" style="stroke:var(--bg)"/>', { s: .8 }));
    er.style.height = "36px";
    var r = f.getBoundingClientRect();
    er.style.left = Math.min(de.clientWidth - 40, r.left + scrollX + 4) + "px"; er.style.top = Math.max(0, r.top + scrollY - 35) + "px";
    setTimeout(function () { er.remove(); }, 2700);
  }, true);

  // Footer: a dark-mode mechanic (night-vision goggles when the device is in dark mode, with a
  // curtain drop when it switches), a guard pacing on the © line, a swinger hanging from the
  // footer logo, and a sleeper at the very bottom who wakes up when you get there.
  var promise = $(".promise");
  if (promise) {
    var dm = mk("xkc-dark", "<i></i>" + fig("", { s: .75, head: '<g class="xkc-gg"><circle class="xkc-ac" cx="13" cy="10" r="2.4"/><circle class="xkc-ac" cx="19" cy="10" r="2.4"/></g>' }));
    pin(dm, promise, function (r) { return Math.min(r.width - 44, margin() + Math.min(1100, innerWidth) - 60); }, function () { return -33; });
    var dq = matchMedia("(prefers-color-scheme: dark)");
    var setN = function () { dm.classList.toggle("night", dq.matches); };
    setN();
    var onScheme = function () { flash(dm, "flip", 1200); setTimeout(setN, 480); };
    if (dq.addEventListener) dq.addEventListener("change", onScheme); else if (dq.addListener) dq.addListener(onScheme);
  }
  var copy = $("footer .wrap > p.small");
  if (copy) {
    var gd = mk("xkc-guard", fig('<path class="xkc-ac" d="M22 28l7-9M24 22l3 3"/>', { s: .75 }));
    gd.style.width = "60px";
    pin(gd, copy, function () { return 0; }, function () { return -32; });
  }
  var flogo = $("footer .logo");
  if (flogo) {
    var sw = mk("xkc-swing", fig('<path d="M16 -18V3"/>', { s: .7 }));
    sw.querySelector(".xkc-al").setAttribute("d", "M16 21l-1-20");
    sw.querySelector(".xkc-ar").setAttribute("d", "M16 21l1-20");
    pin(sw, flogo, function (r) { return r.width + 8; }, function () { return 13; });
  }
  var foot = $("footer");
  if (foot) {
    var sl = mk("xkc-sleep", fig('<path class="xkc-z" d="M24 2h4l-4 4h4"/><path class="xkc-z xkc-z2" d="M28 -4h3l-3 3h3"/><path class="xkc-q" d="M27 0q3-3 5 0t-3 4v2M29 9v.3"/>', { s: .8 }));
    pin(sl, foot, function (r) { return r.width - 70; }, function (r) { return r.height - 40; });
    var awake = false;
    addEventListener("scroll", function () {
      var bottom = scrollY + innerHeight >= de.scrollHeight - 4;
      if (bottom && !awake) { awake = true; flash(sl, "awake", 2600); }
      if (!bottom) awake = false;
    }, { passive: true });
  }

  // Delete / clear / stop buttons: one pops out of a bin to catch what's thrown away.
  [].forEach.call(d.querySelectorAll("main button, main .btn"), function (b) {
    if (!/^\s*(delete|remove|clear|stop)\b/i.test(b.textContent)) return;
    var t = mk("xkc-trash", '<div class="xkc-c">' + fig("", { s: .7 }).replace('class="xkc-al"', 'class="xkc-al" transform="rotate(130 16 21)"').replace('class="xkc-ar"', 'class="xkc-ar" transform="rotate(-130 16 21)"') + '</div><svg viewBox="0 0 24 22" width="24" height="22" style="position:absolute;left:4px;top:24px"><path d="M1 2h22M3 2l2 19h14l2-19" ' + S + "/></svg>");
    t.style.width = "32px"; t.style.height = "48px";
    pin(t, b, function (r) { return r.width + 6; }, function (r) { return r.height - 46; });
    b.addEventListener("click", function () { flash(t, "on", 1700); });
  });

  place();
}
