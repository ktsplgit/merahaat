/* =============================================================
   MERAHAAT — store.js
   The SHARED shop layer. Loaded on every page, right after
   products.js and before any page-specific script.

   It owns the things that would otherwise get copy-pasted:
     · money / star formatting
     · renderProductCard()  — the ONE place card HTML is written
     · the cart          (localStorage, key "merahaat_cart")
     · the wishlist      (localStorage, key "merahaat_wishlist")
     · the header cart badge, on every page
     · toasts + screen-reader announcements
     · delegated click handling for [data-add] and .wish, so cards
       that are rendered later still work with zero extra wiring

   Everything here is vanilla JS. No dependencies.

   Sections:
   1. Helpers (DOM, escaping, formatting)
   2. Image fallbacks
   3. Product card component
   4. Reveal / skeleton hydration for dynamic cards
   5. localStorage plumbing
   6. Cart API
   7. Wishlist API
   8. Header cart badge
   9. Toast + live-region announcements
   10. Delegated interactions (add to cart, wishlist, cart icon, search)
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Helpers ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Escape text that is about to be dropped into an HTML template. */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** 240 -> "₹240.00", 4333.33 -> "₹4,333.33" (matches the homepage). */
  function formatPrice(amount) {
    const n = Number(amount) || 0;
    return "₹" + n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /** "(1 review)" / "(12 reviews)" / "(0 reviews)" */
  function reviewLabel(count) {
    const n = Number(count) || 0;
    return "(" + n + " review" + (n === 1 ? "" : "s") + ")";
  }

  /**
   * The exact `.stars` block the homepage already uses: five slots of
   * ★ / ½ / ☆ plus the review count, wrapped in an aria-label.
   */
  function starMarkup(rating, reviews) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(r);
    const rest = r - full;
    const half = rest >= 0.25 && rest < 0.75 ? 1 : 0;
    const bonus = rest >= 0.75 ? 1 : 0;
    const filled = full + bonus;
    let glyphs = "★".repeat(filled);
    if (half) glyphs += "½";
    glyphs += "☆".repeat(Math.max(0, 5 - filled - half));
    const label = (Math.round(r * 10) / 10) + " out of 5 stars";
    return (
      '<div class="stars" aria-label="' + esc(label) + '">' + glyphs +
      ' <span class="stars__count">' + esc(reviewLabel(reviews)) + "</span></div>"
    );
  }

  /* ---------- 2. Image fallbacks ----------
     Every assets/img/photos/NAME.jpg has an on-brand assets/img/NAME.svg
     twin used as an <img onerror> fallback — the same trick the homepage
     already uses. A couple of paths need an explicit mapping. */
  const FALLBACK_OVERRIDES = {
    "assets/img/photos/cat-winter1.jpg": "assets/img/cat-winter.svg"
  };

  function fallbackFor(src) {
    if (FALLBACK_OVERRIDES[src]) return FALLBACK_OVERRIDES[src];
    const match = /^assets\/img\/photos\/(.+)\.jpg$/.exec(String(src || ""));
    return match ? "assets/img/" + match[1] + ".svg" : "";
  }

  /** The onerror="" attribute string for an image, or "" when there is no twin. */
  function fallbackAttr(src) {
    const fb = fallbackFor(src);
    return fb ? " onerror=\"this.onerror=null;this.src='" + fb + "'\"" : "";
  }

  /** Detail-page URL for a product. */
  function productUrl(product) {
    return "product.html?id=" + encodeURIComponent(product.id);
  }

  /** Listing-page URL pre-filtered to a category. */
  function categoryUrl(categoryName) {
    return "products.html?category=" + encodeURIComponent(
      window.MHProducts ? window.MHProducts.slugify(categoryName) : categoryName
    );
  }

  /* ---------- 3. Product card component ----------
     The ONLY place product-card markup is written. The class names are
     identical to the homepage cards, so the visual design, hover states,
     shine sweep, badge pulse and wishlist heart all come for free. */
  const HEART_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>';

  /**
   * renderProductCard(product, options) -> HTML string
   *
   * options.index    number  — drives the staggered scroll-reveal delay
   * options.reveal   boolean — include the .reveal animation class (default true)
   */
  function renderProductCard(product, options) {
    const opts = options || {};
    const index = Number(opts.index) || 0;
    const useReveal = opts.reveal !== false;
    const url = productUrl(product);
    const saved = isWished(product.id);
    const soldOut = product.inStock === false;

    /* Discount pill — same look as the homepage "-40%" badge. */
    let badges = "";
    if (product.discount) {
      badges += '<span class="badge badge--pulse">-' + Math.round(product.discount) + "%</span>";
    }
    if (product.badge) {
      badges += '<span class="badge badge--tag">' + esc(product.badge) + "</span>";
    }
    if (soldOut) badges += '<span class="badge badge--out">Sold out</span>';

    const priceRow =
      '<p class="card__price"><span class="price">' + formatPrice(product.price) + "</span>" +
      (product.originalPrice
        ? ' <span class="price--old">' + formatPrice(product.originalPrice) + "</span>"
        : "") +
      "</p>";

    return (
      '<article class="card' + (useReveal ? " reveal" : "") + '" data-id="' + product.id +
        '" data-stagger style="--i:' + index + '">' +
        '<div class="card__media">' +
          badges +
          '<img class="card__img" src="' + esc(product.image) + '"' + fallbackAttr(product.image) +
            ' alt="' + esc(product.name) + '" loading="lazy" />' +
          /* Whole-image click target. Hidden from the tab order and from
             screen readers because the title link below says the same thing. */
          '<a class="card__link" href="' + url + '" tabindex="-1" aria-hidden="true"></a>' +
          '<div class="card__actions">' +
            (soldOut
              ? '<button class="card__add" type="button" disabled>Sold out</button>'
              : '<button class="card__add" type="button" data-add data-id="' + product.id + '">Add to cart</button>') +
            '<a class="card__quick" href="' + url + '">View details</a>' +
          "</div>" +
          '<button class="wish' + (saved ? " is-saved" : "") + '" type="button" data-id="' + product.id +
            '" aria-pressed="' + (saved ? "true" : "false") +
            '" aria-label="' + (saved ? "Remove from wishlist" : "Save to wishlist") + '">' +
            HEART_SVG +
          "</button>" +
        "</div>" +
        '<div class="card__body">' +
          starMarkup(product.rating, product.reviews) +
          '<h3 class="card__title"><a href="' + url + '">' + esc(product.name) + "</a></h3>" +
          priceRow +
        "</div>" +
      "</article>"
    );
  }

  /** Render a list of products into a container element. */
  function renderProductGrid(container, list, options) {
    if (!container) return;
    const opts = options || {};
    container.innerHTML = list
      .map(function (p, i) { return renderProductCard(p, { index: i % 10, reveal: opts.reveal }); })
      .join("");
    hydrateCards(container);
  }

  /* ---------- 4. Reveal / skeleton hydration for dynamic cards ----------
     main.js wires these up for the static homepage markup at page load.
     Cards rendered afterwards need the same treatment, or they would keep
     the shimmer skeleton and stay invisible at opacity 0. */

  /** Swap the shimmer skeleton for the image once it has decoded. */
  function hydrateCardMedia(root) {
    $$(".card__media", root || document).forEach(function (media) {
      if (media.classList.contains("loaded")) return;
      const img = $(".card__img", media);
      if (!img) return;
      const done = function () { media.classList.add("loaded"); };
      if (img.complete && img.naturalWidth !== 0) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  /** Fade `.reveal` elements in as they scroll into view. */
  function observeReveals(root) {
    const els = $$(".reveal:not(.in-view)", root || document);
    if (!els.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in-view");
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /** Everything a freshly rendered batch of cards needs. */
  function hydrateCards(root) {
    hydrateCardMedia(root);
    observeReveals(root);
  }

  /* ---------- 5. localStorage plumbing ----------
     Wrapped in try/catch: Safari private mode throws on write, and a
     shopper with a full or blocked store should still be able to browse. */
  const CART_KEY = "merahaat_cart";
  const WISH_KEY = "merahaat_wishlist";

  function readJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  /** Tell every listener on this page that the cart changed. */
  function emitCartChange() {
    document.dispatchEvent(new CustomEvent("mh:cartchange"));
  }
  function emitWishChange() {
    document.dispatchEvent(new CustomEvent("mh:wishchange"));
  }

  /* ---------- 6. Cart API ----------
     Stored shape: [{ id: 1, qty: 2 }]
     Only ids and quantities live in localStorage — names, prices and
     images are always looked up from products.js, so there is exactly
     one copy of the product data and prices can never go stale. */
  const MAX_QTY = 99;

  function getCart() {
    return readJSON(CART_KEY, []).filter(function (line) {
      return line && Number(line.qty) > 0 && window.MHProducts && window.MHProducts.byId(line.id);
    }).map(function (line) {
      return { id: Number(line.id), qty: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(line.qty)))) };
    });
  }

  function saveCart(cart) {
    writeJSON(CART_KEY, cart);
    updateCartBadge(true);
    emitCartChange();
  }

  /** Total number of items (not lines) in the cart. */
  function cartCount() {
    return getCart().reduce(function (sum, line) { return sum + line.qty; }, 0);
  }

  /** Cart lines joined to live product data: [{ product, qty, lineTotal }] */
  function cartLines() {
    return getCart().map(function (line) {
      const product = window.MHProducts.byId(line.id);
      return { product: product, qty: line.qty, lineTotal: product.price * line.qty };
    });
  }

  /* Part of the public API for completeness alongside cartCount()/cartLines().
     cart.js does not call it: that page already holds the cartLines() array and
     reduces it once for the subtotal, saved amount and unit count together. */
  function cartSubtotal() {
    return cartLines().reduce(function (sum, line) { return sum + line.lineTotal; }, 0);
  }

  /**
   * Add a product to the cart, or bump its quantity if it is already in.
   * Returns true when the cart changed.
   */
  function addToCart(id, qty, sourceImg) {
    const product = window.MHProducts && window.MHProducts.byId(id);
    if (!product) return false;
    if (product.inStock === false) {
      toast("Sorry — " + product.name + " is out of stock.", "warn");
      return false;
    }
    const add = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(qty) || 1)));
    const cart = getCart();
    const existing = cart.find(function (line) { return line.id === product.id; });
    if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + add);
    else cart.push({ id: product.id, qty: add });

    saveCart(cart);
    if (sourceImg && window.__flyToCart) window.__flyToCart(sourceImg);
    toast(product.name + " added to cart");
    announce(product.name + " added to cart. " + cartCount() + " in cart.");
    return true;
  }

  /** Set an exact quantity. 0 (or less) removes the line. */
  function setQty(id, qty) {
    const next = Math.floor(Number(qty) || 0);
    if (next <= 0) return removeFromCart(id);
    const cart = getCart();
    const line = cart.find(function (l) { return l.id === Number(id); });
    if (!line) return false;
    line.qty = Math.min(MAX_QTY, next);
    saveCart(cart);
    return true;
  }

  function removeFromCart(id) {
    const cart = getCart().filter(function (l) { return l.id !== Number(id); });
    saveCart(cart);
    return true;
  }

  function clearCart() {
    saveCart([]);
  }

  /** Frontend-only "Buy Now": add, then hand over to the cart page. */
  function buyNow(id, qty) {
    if (addToCart(id, qty)) window.location.href = "cart.html";
  }

  /* ---------- 7. Wishlist API ----------
     Stored shape: [1, 7, 22] — just product ids. */
  function getWishlist() {
    return readJSON(WISH_KEY, [])
      .map(Number)
      .filter(function (id) { return window.MHProducts && window.MHProducts.byId(id); });
  }

  function isWished(id) {
    return getWishlist().indexOf(Number(id)) !== -1;
  }

  /** Toggle and return the new saved state (true = now saved). */
  function toggleWish(id) {
    const numId = Number(id);
    const list = getWishlist();
    const at = list.indexOf(numId);
    const nowSaved = at === -1;
    if (nowSaved) list.push(numId);
    else list.splice(at, 1);
    writeJSON(WISH_KEY, list);
    syncWishButtons();
    emitWishChange();
    return nowSaved;
  }

  /** Repaint every wishlist heart on the page from storage. */
  function syncWishButtons() {
    const list = getWishlist();
    $$(".wish").forEach(function (btn) {
      const holder = btn.dataset.id ? btn : btn.closest("[data-id]");
      const id = holder ? Number(holder.dataset.id) : 0;
      if (!id) return;
      const on = list.indexOf(id) !== -1;
      btn.classList.toggle("is-saved", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Remove from wishlist" : "Save to wishlist");
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", on ? "currentColor" : "none");
    });
  }

  /* ---------- 8. Header cart badge ----------
     One function, called on every page load, after every cart change and
     when another tab changes the cart. */
  function updateCartBadge(animate) {
    const count = cartCount();
    const badge = $("#cartBadge");
    const cartBtn = $("#cartBtn");

    if (badge) {
      badge.textContent = String(count);
      if (animate) { badge.classList.remove("pop"); void badge.offsetWidth; badge.classList.add("pop"); }
    }
    if (cartBtn) {
      cartBtn.setAttribute("aria-label", "Shopping cart, " + count + " item" + (count === 1 ? "" : "s"));
      if (animate) { cartBtn.classList.remove("bump"); void cartBtn.offsetWidth; cartBtn.classList.add("bump"); }
    }
    /* Any other place that wants the live count (e.g. the cart page title). */
    $$("[data-cart-count]").forEach(function (el) { el.textContent = String(count); });
  }

  /* ---------- 9. Toast + live-region announcements ---------- */
  let toastHost = null;

  function ensureToastHost() {
    if (toastHost && document.body.contains(toastHost)) return toastHost;
    toastHost = document.createElement("div");
    toastHost.className = "toasts";
    /* The screen-reader message goes through #cartLive instead, so the
       toast itself stays out of the accessibility tree — no double reads. */
    toastHost.setAttribute("aria-hidden", "true");
    document.body.appendChild(toastHost);
    return toastHost;
  }

  const TOAST_ICONS = {
    ok: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    warn: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg>'
  };

  /** A small self-dismissing message in the bottom-left. */
  function toast(message, kind) {
    const host = ensureToastHost();
    const type = TOAST_ICONS[kind] ? kind : "ok";
    const el = document.createElement("div");
    el.className = "toast toast--" + type;
    el.innerHTML = '<span class="toast__icon">' + TOAST_ICONS[type] + "</span>" +
      '<span class="toast__msg">' + esc(message) + "</span>";
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("is-in"); });
    setTimeout(function () {
      el.classList.remove("is-in");
      setTimeout(function () { el.remove(); }, 320);
    }, 2600);
  }

  /** Speak something through the shared #cartLive polite live region. */
  function announce(message) {
    const live = $("#cartLive");
    if (live) live.textContent = message;
  }

  /* ---------- 10. Delegated interactions ----------
     Delegation (one listener on document) rather than per-button listeners,
     so cards rendered later — listing grid, related strip, cart page — all
     work without any extra wiring. */

  document.addEventListener("click", function (e) {
    /* --- Add to cart --- */
    const addBtn = e.target.closest("[data-add]");
    if (addBtn && !addBtn.disabled) {
      e.preventDefault();
      const holder = addBtn.dataset.id ? addBtn : addBtn.closest("[data-id]");
      const id = holder && holder.dataset.id;
      if (!id) return;

      /* Quantity: either a named input (detail page) or one unit. */
      let qty = 1;
      if (addBtn.dataset.qtyFrom) {
        const input = $(addBtn.dataset.qtyFrom);
        if (input) qty = parseInt(input.value, 10) || 1;
      }

      /* Image the fly-to-cart ghost launches from. */
      const card = addBtn.closest(".card");
      const sourceImg = addBtn.dataset.flyFrom
        ? $(addBtn.dataset.flyFrom)
        : (card && $(".card__img", card));

      if (addToCart(id, qty, sourceImg)) {
        /* Same brief confirmation the homepage has always shown. */
        if (!addBtn.dataset.busy) {
          const original = addBtn.textContent;
          addBtn.dataset.busy = "1";
          addBtn.textContent = "Added ✓";
          setTimeout(function () {
            addBtn.textContent = original;
            delete addBtn.dataset.busy;
          }, 1100);
        }
      }
      return;
    }

    /* --- Buy now (frontend only: fills the cart, then opens it) --- */
    const buyBtn = e.target.closest("[data-buy-now]");
    if (buyBtn && !buyBtn.disabled) {
      e.preventDefault();
      const holder = buyBtn.dataset.id ? buyBtn : buyBtn.closest("[data-id]");
      let qty = 1;
      if (buyBtn.dataset.qtyFrom) {
        const input = $(buyBtn.dataset.qtyFrom);
        if (input) qty = parseInt(input.value, 10) || 1;
      }
      if (holder && holder.dataset.id) buyNow(holder.dataset.id, qty);
      return;
    }

    /* --- Wishlist heart --- */
    const wishBtn = e.target.closest(".wish");
    if (wishBtn) {
      e.preventDefault();
      e.stopPropagation();
      const holder = wishBtn.dataset.id ? wishBtn : wishBtn.closest("[data-id]");
      const id = holder && holder.dataset.id;
      if (!id) return;
      const nowSaved = toggleWish(id);
      const product = window.MHProducts.byId(id);
      const name = product ? product.name : "Item";
      toast(name + (nowSaved ? " saved to wishlist" : " removed from wishlist"), nowSaved ? "ok" : "info");
      announce(name + (nowSaved ? " added to wishlist." : " removed from wishlist."));
      return;
    }

    /* --- The header cart icon is a <button> on the pages that predate the
           cart page; send it to cart.html. Newer pages use a real <a>. --- */
    const cartBtn = e.target.closest("#cartBtn");
    if (cartBtn && cartBtn.tagName === "BUTTON") {
      window.location.href = "cart.html";
    }
  });

  /* Header search -> the listing page. products.html filters in place
     instead (its own script handles the submit), so skip it there. */
  document.addEventListener("submit", function (e) {
    const form = e.target.closest("form.search");
    if (!form) return;
    if (document.body.dataset.page === "products") return; // catalog.js owns it
    const input = $(".search__input", form);
    const term = input ? input.value.trim() : "";
    e.preventDefault();
    window.location.href = term
      ? "products.html?q=" + encodeURIComponent(term)
      : "products.html";
  });

  /* Keep the ripple highlight following the cursor on dynamically
     rendered .btn elements too (main.js only sees the static ones). */
  if (!prefersReduced) {
    document.addEventListener("pointermove", function (e) {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--rx", ((e.clientX - r.left) / r.width) * 100 + "%");
      btn.style.setProperty("--ry", ((e.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  }

  /* Another tab changed the cart or wishlist — stay in sync. */
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) { updateCartBadge(false); emitCartChange(); }
    if (e.key === WISH_KEY) { syncWishButtons(); emitWishChange(); }
  });

  /* First paint: badge + hearts reflect what is already in storage. */
  function init() {
    updateCartBadge(false);
    syncWishButtons();
    hydrateCardMedia(document);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ---------- public API ---------- */
  window.MHStore = {
    /* formatting + markup */
    esc: esc,
    formatPrice: formatPrice,
    starMarkup: starMarkup,
    reviewLabel: reviewLabel,
    fallbackFor: fallbackFor,
    fallbackAttr: fallbackAttr,
    productUrl: productUrl,
    categoryUrl: categoryUrl,
    renderProductCard: renderProductCard,
    renderProductGrid: renderProductGrid,
    hydrateCards: hydrateCards,
    hydrateCardMedia: hydrateCardMedia,
    observeReveals: observeReveals,
    /* cart */
    getCart: getCart,
    cartCount: cartCount,
    cartLines: cartLines,
    cartSubtotal: cartSubtotal,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    buyNow: buyNow,
    updateCartBadge: updateCartBadge,
    /* wishlist */
    getWishlist: getWishlist,
    isWished: isWished,
    toggleWish: toggleWish,
    syncWishButtons: syncWishButtons,
    /* feedback */
    toast: toast,
    announce: announce
  };
})();
