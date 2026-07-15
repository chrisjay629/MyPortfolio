/* Christopher Jauregui — site interactions. Vanilla, no deps. */
(function () {
  "use strict";

  // ---- Sticky nav border once scrolled ----
  var nav = document.getElementById("nav");
  function navState() {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  // ---- Reveal-on-scroll (bulletproof: content is never left hidden) ----
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
    items = [];
  }

  // Reveal anything whose top has entered the lower ~92% of the viewport
  // (covers normal scrolling, anchor jumps, deep-links, and resizes).
  function revealInView() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = items.length - 1; i >= 0; i--) {
      var el = items[i];
      if (el.getBoundingClientRect().top < vh * 0.92) {
        el.classList.add("in");
        items.splice(i, 1); // stop tracking once revealed
      }
    }
  }

  // rAF-throttled scroll handler
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      navState();
      revealInView();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", revealInView, { passive: true });
  window.addEventListener("hashchange", function () {
    // let the browser complete the jump, then reveal the landing zone
    window.requestAnimationFrame(revealInView);
    setTimeout(revealInView, 60);
  });
  window.addEventListener("load", revealInView);

  // First paint
  navState();
  revealInView();
})();

/* ---- Ambient floating-node network ---- */
(function () {
  "use strict";
  var c = document.getElementById("bg-nodes");
  if (!c || !c.getContext) return;
  var ctx = c.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var w = 0, h = 0, dpr = 1, nodes = [], raf = null;
  var MAX_DIST = 150;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.clientWidth; h = c.clientHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    var count = Math.max(18, Math.min(64, Math.floor((w * h) / 24000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    var i, j, a, b, dx, dy, d;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
    }
    for (i = 0; i < nodes.length; i++) {
      for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.strokeStyle = "rgba(74,222,128," + ((1 - d / MAX_DIST) * 0.14).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = "rgba(74,222,128,0.42)";
    for (i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.4, 0, 6.2832);
      ctx.fill();
    }
    if (!reduce) raf = window.requestAnimationFrame(frame);
  }

  function start() { size(); init(); frame(); }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { size(); init(); if (reduce) frame(); }, 150);
  }, { passive: true });

  start();
})();
