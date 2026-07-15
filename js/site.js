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
