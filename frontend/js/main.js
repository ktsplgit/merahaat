/* =============================================================
   MERAHAAT — main.js
   Vanilla-first interactions. GSAP + ScrollTrigger + Lenis are an
   OPTIONAL enhancement layer: if they fail to load, everything below
   still works via IntersectionObserver + CSS.

   Sections:
   1. Helpers & feature detection
   2. Scroll progress + sticky header
   3. Reveal on scroll (IntersectionObserver) + section underline
   4. Image skeleton -> loaded
   5. Hero carousel
   6. Mobile drawer / hamburger
   7. Add-to-cart micro-interaction
   8. Count-up stats
   9. Back-to-top + WhatsApp
   10. Button ripple origin
   11. Payment icons stagger
   12. GSAP / Lenis enhancement layer
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Helpers & feature detection ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // throttle via requestAnimationFrame
  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
      }
    };
  }

  /* ---------- 2. Scroll progress + sticky header ---------- */
  const progress = $("#scrollProgress");
  const header = $("#header");

  const onScroll = rafThrottle(() => {
    const st = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (st / docH) * 100 : 0) + "%";
    if (header) header.classList.toggle("shrink", st > 40);
    // back-to-top visibility
    if (backTop) backTop.classList.toggle("show", st > 500);
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Reveal on scroll ---------- */
  const revealEls = $$(".reveal, .section__title");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target); // reveal once
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // no IO or reduced motion -> show everything immediately
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- 4. Image skeleton -> loaded ---------- */
  $$(".card__media").forEach((media) => {
    const img = $(".card__img", media);
    if (!img) return;
    const done = () => media.classList.add("loaded");
    if (img.complete && img.naturalWidth !== 0) done();
    else { img.addEventListener("load", done); img.addEventListener("error", done); }
  });

  /* ---------- 5. Hero carousel ---------- */
  (function heroCarousel() {
    const track = $("#heroTrack");
    if (!track) return;
    const slides = $$(".hero__slide", track);
    const dotsWrap = $("#heroDots");
    const prevBtn = $("#heroPrev");
    const nextBtn = $("#heroNext");
    let index = 0;
    let timer = null;
    // True while the pointer is over the hero or focus is inside it. Tracked
    // separately from `timer` so that returning to a hidden tab does not
    // resume autoplay under a cursor that is still parked on the banner.
    let hovered = false;
    const INTERVAL = 5500;

    // build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.className = "hero__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", () => { go(i); restart(); });
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
      dots.forEach((d, k) => {
        d.classList.toggle("is-active", k === index);
        d.setAttribute("aria-selected", k === index ? "true" : "false");
      });
    }
    const next = () => go(index + 1);
    const prev = () => go(index - 1);

    // Autoplay lifecycle. Several listeners below can each ask for a start —
    // a single pointer leaving the hero fires both `mouseleave` and `focusout`,
    // and a tab that loads in the background gets another start() from
    // `visibilitychange`. The `!timer` guard means those can never stack two
    // intervals (which would run the carousel at double speed); `hovered`
    // means an interval is never handed back while the user is still on it.
    function start() { if (!prefersReduced && !timer && !hovered && !document.hidden) timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    nextBtn && nextBtn.addEventListener("click", () => { next(); restart(); });
    prevBtn && prevBtn.addEventListener("click", () => { prev(); restart(); });

    // pause on hover / focus
    const hero = track.closest(".hero");
    ["mouseenter", "focusin"].forEach((ev) => hero.addEventListener(ev, () => { hovered = true; stop(); }));
    ["mouseleave", "focusout"].forEach((ev) => hero.addEventListener(ev, () => { hovered = false; start(); }));

    // keyboard when hero focused
    hero.setAttribute("tabindex", "-1");
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { next(); restart(); }
      else if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    // Basic touch swipe. A tap on a touch screen also emits a compatibility
    // `mouseenter`, so `hovered` is cleared here — there is no cursor left
    // resting on the banner once the finger lifts, and without this the
    // autoplay would stall after the first swipe on mobile.
    let startX = null;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
      startX = null; hovered = false; start();
    });

    // pause when tab hidden
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    go(0);
    start();
  })();

  /* ---------- 6. Mobile drawer / hamburger ---------- */
  (function drawer() {
    const burger = $("#hamburger");
    const drawerEl = $("#mobileDrawer");
    const overlay = $("#drawerOverlay");
    const closeBtn = $("#drawerClose");
    if (!burger || !drawerEl) return;

    function open() {
      drawerEl.classList.add("open");
      drawerEl.setAttribute("aria-hidden", "false");
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("show"));
      burger.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      const firstLink = $(".drawer__list a", drawerEl);
      firstLink && firstLink.focus();
    }
    function close() {
      drawerEl.classList.remove("open");
      drawerEl.setAttribute("aria-hidden", "true");
      overlay.classList.remove("show");
      setTimeout(() => (overlay.hidden = true), 320);
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      burger.focus();
    }
    burger.addEventListener("click", () => (drawerEl.classList.contains("open") ? close() : open()));
    closeBtn && closeBtn.addEventListener("click", close);
    overlay && overlay.addEventListener("click", close);
    $$(".drawer__list a", drawerEl).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawerEl.classList.contains("open")) close(); });
  })();

  /* ---------- 7. Add-to-cart micro-interaction ----------
     The real cart now lives in js/store.js (MHStore): it persists to
     localStorage, updates the badge, fires the fly-to-cart ghost and shows
     the "Added ✓" confirmation — all through one delegated listener, so it
     also covers cards rendered later. The block below is only the original
     visual-only fallback, kept for the case where store.js is absent. */
  (function cart() {
    if (window.MHStore) return; // MHStore owns add-to-cart

    const cartBtn = $("#cartBtn");
    const badge = $("#cartBadge");
    const live = $("#cartLive");
    if (!cartBtn || !badge) return;
    let count = 0;

    $$("[data-add]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // fly-to-cart ghost from this card's image
        const card = btn.closest(".card");
        const img = card && card.querySelector(".card__img");
        if (window.__flyToCart) window.__flyToCart(img);
        count += 1;
        badge.textContent = String(count);
        // retrigger animations
        cartBtn.classList.remove("bump"); void cartBtn.offsetWidth; cartBtn.classList.add("bump");
        badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop");
        cartBtn.setAttribute("aria-label", "Shopping cart, " + count + " item" + (count === 1 ? "" : "s"));
        const title = btn.closest(".card") && $(".card__title", btn.closest(".card"));
        if (live) live.textContent = (title ? title.textContent.trim() : "Item") + " added to cart. " + count + " in cart.";
        // brief button confirmation
        const original = btn.textContent;
        btn.textContent = "Added ✓";
        setTimeout(() => (btn.textContent = original), 1100);
      });
    });
  })();

  /* ---------- 8. Count-up stats ---------- */
  (function countUp() {
    const nums = $$(".countup");
    if (!nums.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      nums.forEach((n) => (n.textContent = n.dataset.count));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1400; const t0 = performance.now();
        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  })();

  /* ---------- 9. Back-to-top ---------- */
  var backTop = $("#backToTop");
  backTop && backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  /* ---------- 10. Button ripple origin ---------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--rx", ((e.clientX - r.left) / r.width) * 100 + "%");
      btn.style.setProperty("--ry", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  /* ---------- 11. Payment icons stagger ---------- */
  (function payIcons() {
    const pays = $$(".pay");
    if (!pays.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      pays.forEach((p) => p.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        pays.forEach((p, i) => setTimeout(() => p.classList.add("in"), i * 90));
        obs.disconnect();
      });
    }, { threshold: 0.4 });
    io.observe(pays[0]);
  })();

  /* ---------- Smooth anchor scrolling (vanilla) ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // Native smooth scroll with a small offset for the sticky header.
      const y = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Vanilla parallax fallback for SURMEE banner ---------- */
  const parallaxEl = $("[data-parallax] .promo__bg");
  if (parallaxEl && !prefersReduced) {
    const container = parallaxEl.closest("[data-parallax]");
    const onPar = rafThrottle(() => {
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const pct = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      parallaxEl.style.transform = "translateY(" + (pct * -30) + "px)";
    });
    window.addEventListener("scroll", onPar, { passive: true });
    onPar();
  }

  /* ---------- 12. Impressive micro-interactions (vanilla) ---------- */

  // 12a. Wishlist heart — injected into every product card (engagement driver)
  //      Cards rendered by MHStore.renderProductCard() already contain their
  //      own heart, so those are skipped. When MHStore is present it also owns
  //      the click (one delegated listener + localStorage), so no listener is
  //      attached here — that keeps a single wishlist code path.
  (function wishlist() {
    const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>';
    let saved = 0;
    const live = document.getElementById("cartLive");
    $$(".card__media").forEach((media) => {
      if (media.querySelector(".wish")) return; // already has one
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wish";
      btn.setAttribute("aria-label", "Save to wishlist");
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = HEART;
      if (!window.MHStore) {
        btn.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          const on = btn.classList.toggle("is-saved");
          btn.querySelector("svg").setAttribute("fill", on ? "currentColor" : "none");
          btn.setAttribute("aria-pressed", on ? "true" : "false");
          saved += on ? 1 : -1;
          const card = btn.closest(".card");
          const title = card && card.querySelector(".card__title");
          if (live) live.textContent = (title ? title.textContent.trim() : "Item") +
            (on ? " added to wishlist." : " removed from wishlist.");
        });
      }
      media.appendChild(btn);
    });
    // Paint the freshly injected hearts from the saved wishlist.
    if (window.MHStore) window.MHStore.syncWishButtons();
  })();

  // 12b. Magnetic buttons — gently follow the cursor
  (function magnetic() {
    if (prefersReduced || window.matchMedia("(pointer: coarse)").matches) return;
    $$(".hero__cta, .promo__cta, .newsletter__btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + mx * 0.28 + "px," + my * 0.32 + "px)";
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  })();

  // 12c. Fly-to-cart — a ghost of the product image arcs into the cart icon
  (function flyToCart() {
    const cartBtn = document.getElementById("cartBtn");
    if (!cartBtn) return;
    window.__flyToCart = function (sourceImg) {
      if (prefersReduced || !sourceImg) return;
      const from = sourceImg.getBoundingClientRect();
      const to = cartBtn.getBoundingClientRect();
      const ghost = document.createElement("img");
      ghost.src = sourceImg.currentSrc || sourceImg.src;
      ghost.className = "fly-ghost";
      ghost.style.left = from.left + "px";
      ghost.style.top = from.top + "px";
      ghost.style.width = from.width + "px";
      ghost.style.height = from.height + "px";
      document.body.appendChild(ghost);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      ghost.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1, offset: 0 },
          { transform: "translate(" + dx * 0.5 + "px," + (dy * 0.5 - 60) + "px) scale(0.6)", opacity: 0.9, offset: 0.6 },
          { transform: "translate(" + dx + "px," + dy + "px) scale(0.12)", opacity: 0.2, offset: 1 },
        ],
        { duration: 750, easing: "cubic-bezier(0.5,0,0.75,0.35)" }
      ).onfinish = () => ghost.remove();
    };
  })();

  // 12d. Festive floating sparkles in the hero (lightweight, capped, reduced-motion aware)
  (function heroSparkles() {
    if (prefersReduced) return;
    const layer = document.getElementById("heroSparkles");
    if (!layer) return;
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      const size = 4 + (i % 4) * 3;
      s.style.width = s.style.height = size + "px";
      s.style.left = ((i * 37) % 100) + "%";
      s.style.setProperty("--dur", (7 + (i % 5) * 1.6) + "s");
      s.style.setProperty("--delay", (-i * 0.9) + "s");
      s.style.setProperty("--drift", ((i % 2 ? 1 : -1) * (10 + (i % 3) * 14)) + "px");
      s.style.bottom = "-12px";
      layer.appendChild(s);
    }
  })();

  /* ---------- 13. GSAP + ScrollTrigger enhancement (no scroll hijacking) ----------
     ScrollTrigger only READS native scroll position — it never intercepts the
     wheel/trackpad, so scrolling always stays native and smooth. If GSAP fails to
     load, every effect below already has a vanilla equivalent above. */
  window.addEventListener("load", function () {
    if (prefersReduced) return;
    if (typeof window.gsap === "undefined" || !window.ScrollTrigger) return;
    try {
      gsap.registerPlugin(window.ScrollTrigger);

      // Parallax on the SURMEE banner background
      const bg = document.querySelector("[data-parallax] .promo__bg");
      if (bg) {
        gsap.fromTo(bg, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: bg.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true }
        });
      }

      // Subtle parallax drift on every lifestyle mosaic image
      $$(".mosaic__cell img").forEach((img) => {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: img.closest(".mosaic__cell"), start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // Hero overlay deepens + content lifts as you scroll past
      if (document.querySelector(".hero")) {
        gsap.to(".hero__overlay", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
          opacity: 0.9, ease: "none"
        });
        gsap.to(".hero__content", {
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
          yPercent: 18, opacity: 0.6, ease: "none"
        });
      }
    } catch (err) { /* enhancement failed -> vanilla baseline remains */ }
  });

})();
