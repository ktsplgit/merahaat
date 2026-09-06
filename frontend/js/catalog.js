/* =============================================================
   MERAHAAT — catalog.js
   The product LISTING page (products.html).

   Reads products from js/products.js and renders them with
   MHStore.renderProductCard() — so the cards here are the exact same
   component as the homepage cards. Nothing about product data or card
   markup is duplicated in this file.

   Sections:
   1. Config + state
   2. URL query params  (?q= and ?category=)
   3. Category options, built from the data
   4. Filtering
   5. Sorting
   6. Rendering (grid, count, empty state, show-more)
   7. Active-filter chips
   8. Page title + breadcrumb
   9. Events
   10. Mobile filter drawer
   ============================================================= */
(function () {
  "use strict";

  const S = window.MHStore;
  const P = window.MHProducts;
  if (!S || !P) return; // data/store failed to load — nothing to do

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- 1. Config + state ---------- */
  const PAGE_SIZE = 12; // how many cards are added per "Show more"

  const state = {
    q: "",           // search term
    category: "",    // "" = all categories
    price: "all",    // "all" | "0-249" | "250-499" | … | "2000-"
    rating: 0,       // minimum average rating
    sort: "featured",
    visible: PAGE_SIZE
  };

  /* Element cache */
  const el = {
    grid: $("#productGrid"),
    empty: $("#emptyState"),
    emptyText: $("#emptyText"),
    resultLine: $("#resultLine"),
    pageTitle: $("#pageTitle"),
    pageSub: $("#pageSub"),
    crumb: $("#crumbCurrent"),
    chips: $("#activeChips"),
    categoryList: $("#categoryList"),
    sort: $("#sortSelect"),
    railSearch: $("#filterSearch"),
    railSearchClear: $("#filterSearchClear"),
    headerSearch: $("#searchInput"),
    headerForm: $("form.search"),
    filters: $("#filters"),
    filterBtn: $("#filterBtn"),
    filterCount: $("#filterCount"),
    filtersClose: $("#filtersClose"),
    reset: $("#resetFilters"),
    emptyReset: $("#emptyReset"),
    loadWrap: $("#loadMoreWrap"),
    loadBtn: $("#loadMore"),
    loadNote: $("#loadMoreNote")
  };

  /* Price bands, kept next to the radio values they belong to. */
  const PRICE_BANDS = {
    "all": null,
    "0-249": [0, 249.99],
    "250-499": [250, 499.99],
    "500-999": [500, 999.99],
    "1000-1999": [1000, 1999.99],
    "2000-": [2000, Infinity]
  };
  const PRICE_LABELS = {
    "0-249": "Under ₹250",
    "250-499": "₹250 – ₹499",
    "500-999": "₹500 – ₹999",
    "1000-1999": "₹1,000 – ₹1,999",
    "2000-": "₹2,000 & above"
  };

  /* ---------- 2. URL query params ----------
     products.html?q=wallet          -> pre-filled search
     products.html?category=leather  -> pre-selected category
     Both the slug ("winter-wear") and the display name ("Winter Wear")
     are accepted, in any casing. */
  function readParams() {
    const params = new URLSearchParams(window.location.search);

    const q = params.get("q") || params.get("search") || "";
    if (q) state.q = q.trim();

    const cat = params.get("category") || params.get("cat") || "";
    if (cat) state.category = P.findCategory(cat); // "" when unknown

    const sort = params.get("sort");
    if (sort && $('#sortSelect option[value="' + sort + '"]')) state.sort = sort;
  }

  /** Keep the address bar in step, so the view can be shared or bookmarked. */
  function writeParams() {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category) params.set("category", P.slugify(state.category));
    if (state.sort !== "featured") params.set("sort", state.sort);
    const query = params.toString();
    window.history.replaceState(null, "", query ? "?" + query : window.location.pathname);
  }

  /* ---------- 3. Category options, built from the data ----------
     P.categories() derives the list (and the per-category counts) from
     js/products.js, so a new product with a new category appears here
     with no edit to this file or to products.html. */
  function buildCategoryOptions() {
    if (!el.categoryList) return;
    const cats = P.categories();
    const total = P.data.length;

    let html = optionHtml("cat", "", "All Products", total, state.category === "");
    cats.forEach(function (c) {
      html += optionHtml("cat", c.name, c.name, c.count, state.category === c.name);
    });
    el.categoryList.innerHTML = html;
  }

  function optionHtml(name, value, label, count, checked) {
    return (
      '<label class="fopt">' +
        '<input type="radio" name="' + name + '" value="' + S.esc(value) + '"' + (checked ? " checked" : "") + " />" +
        '<span class="fopt__dot" aria-hidden="true"></span>' +
        '<span class="fopt__label">' + S.esc(label) + "</span>" +
        '<span class="fopt__count">' + count + "</span>" +
      "</label>"
    );
  }

  /* ---------- 4. Filtering ---------- */

  /** Case-insensitive match across name + category + description. */
  function matchesSearch(product, needle) {
    if (!needle) return true;
    const haystack = (product.name + " " + product.category + " " + product.description).toLowerCase();
    /* Every word must appear somewhere, so "black wallet" works. */
    return needle.toLowerCase().split(/\s+/).filter(Boolean).every(function (word) {
      return haystack.indexOf(word) !== -1;
    });
  }

  function matchesPrice(product) {
    const band = PRICE_BANDS[state.price];
    if (!band) return true;
    return product.price >= band[0] && product.price <= band[1];
  }

  /** The filtered list, always derived from a FRESH copy of the data. */
  function getFiltered() {
    const needle = state.q.trim();
    return P.all().filter(function (p) {
      if (state.category && p.category !== state.category) return false;
      if (!matchesPrice(p)) return false;
      if (state.rating && p.rating < state.rating) return false;
      return matchesSearch(p, needle);
    });
  }

  /* ---------- 5. Sorting ----------
     Sorting works on the filtered COPY, never on P.data, so the original
     order (used by "Featured") is never lost. */
  function sortList(list) {
    const out = list.slice();
    switch (state.sort) {
      case "price-asc":
        return out.sort(function (a, b) { return a.price - b.price; });
      case "price-desc":
        return out.sort(function (a, b) { return b.price - a.price; });
      case "rating":
        return out.sort(function (a, b) {
          return (b.rating - a.rating) || (b.reviews - a.reviews);
        });
      case "newest":
        return out.sort(function (a, b) {
          /* ISO date strings compare correctly as plain strings. */
          if (a.added === b.added) return b.id - a.id;
          return a.added < b.added ? 1 : -1;
        });
      case "featured":
      default:
        /* "Featured" = the curated order in products.js, best discounts first
           among equals so the grid still opens on something compelling. */
        return out.sort(function (a, b) { return (b.discount - a.discount) || (a.id - b.id); });
    }
  }

  /* ---------- 6. Rendering ---------- */
  function render() {
    const matched = sortList(getFiltered());
    const total = matched.length;
    const shown = Math.min(state.visible, total);
    const page = matched.slice(0, shown);

    /* Cards — one shared component, same markup as the homepage. */
    el.grid.innerHTML = page
      .map(function (p, i) { return S.renderProductCard(p, { index: i % 10 }); })
      .join("");
    S.hydrateCards(el.grid);

    /* Count line */
    if (el.resultLine) {
      el.resultLine.innerHTML = total
        ? "<strong>" + total + "</strong> product" + (total === 1 ? "" : "s") + " found"
        : "No products found";
    }

    /* Empty state */
    const isEmpty = total === 0;
    el.grid.hidden = isEmpty;
    if (el.empty) el.empty.hidden = !isEmpty;
    if (isEmpty && el.emptyText) {
      el.emptyText.textContent = state.q
        ? "Nothing matched “" + state.q + "”. Try a shorter search term, or clear a filter or two."
        : "We couldn’t find anything matching your filters. Try clearing a filter or two.";
    }

    /* Show-more */
    if (el.loadWrap) {
      const more = total > shown;
      el.loadWrap.hidden = !more;
      if (more && el.loadNote) {
        el.loadNote.textContent = "Showing " + shown + " of " + total + " products";
      }
    }

    updateChips();
    updateHead(total);
    writeParams();
  }

  /* ---------- 7. Active-filter chips ---------- */
  function updateChips() {
    if (!el.chips) return;
    const chips = [];
    if (state.q) chips.push({ kind: "q", text: "“" + state.q + "”" });
    if (state.category) chips.push({ kind: "category", text: state.category });
    if (state.price !== "all") chips.push({ kind: "price", text: PRICE_LABELS[state.price] });
    if (state.rating) chips.push({ kind: "rating", text: state.rating + "★ & up" });

    el.chips.innerHTML = chips.map(function (c) {
      return '<span class="chip">' + S.esc(c.text) +
        '<button class="chip__x" type="button" data-clear="' + c.kind +
        '" aria-label="Remove filter: ' + S.esc(c.text) + '">&times;</button></span>';
    }).join("");

    /* The mobile Filters button carries a count so it is obvious that
       filters are active while the rail is closed. */
    if (el.filterCount) {
      el.filterCount.textContent = String(chips.length);
      el.filterCount.hidden = chips.length === 0;
    }
  }

  /* ---------- 8. Page title + breadcrumb ---------- */
  function updateHead(total) {
    const title = state.category || "All Products";
    if (el.pageTitle) el.pageTitle.textContent = title;
    if (el.crumb) el.crumb.textContent = title;
    document.title = title + " — Merahaat";

    if (el.pageSub) {
      if (state.q) {
        el.pageSub.textContent = 'Results for “' + state.q + '” — ' + total +
          " product" + (total === 1 ? "" : "s") + " found.";
      } else if (state.category) {
        el.pageSub.textContent = "Every " + state.category + " piece in the Merahaat collection.";
      } else {
        el.pageSub.textContent =
          "Handpicked jewellery, leather, dry fruits and festive favourites — all in one place.";
      }
    }
  }

  /* ---------- 9. Events ---------- */

  /* Filter changes are cheap, so just re-render on every change. */
  function onFilterChange() {
    state.visible = PAGE_SIZE; // a new filter always starts from the top
    render();
  }

  /* Search: debounced while typing so we don't re-render on every keypress. */
  let searchTimer = null;
  function setSearch(value, immediate) {
    const next = String(value || "");
    if (el.railSearch && el.railSearch.value !== next) el.railSearch.value = next;
    if (el.headerSearch && el.headerSearch.value !== next) el.headerSearch.value = next;
    if (el.railSearchClear) el.railSearchClear.hidden = next.trim() === "";

    clearTimeout(searchTimer);
    const run = function () { state.q = next.trim(); onFilterChange(); };
    if (immediate) run();
    else searchTimer = setTimeout(run, 200);
  }

  if (el.railSearch) {
    el.railSearch.addEventListener("input", function () { setSearch(this.value); });
  }
  if (el.headerSearch) {
    el.headerSearch.addEventListener("input", function () { setSearch(this.value); });
  }
  /* The header form filters this page instead of navigating away. */
  if (el.headerForm) {
    el.headerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      setSearch(el.headerSearch ? el.headerSearch.value : "", true);
      closeFilters();
    });
  }
  if (el.railSearchClear) {
    el.railSearchClear.addEventListener("click", function () {
      setSearch("", true);
      if (el.railSearch) el.railSearch.focus();
    });
  }

  /* One delegated change handler for all three radio groups. */
  if (el.filters) {
    el.filters.addEventListener("change", function (e) {
      const input = e.target;
      if (input.name === "cat") { state.category = input.value; onFilterChange(); }
      else if (input.name === "price") { state.price = input.value; onFilterChange(); }
      else if (input.name === "rating") { state.rating = parseFloat(input.value) || 0; onFilterChange(); }
    });
  }

  if (el.sort) {
    el.sort.addEventListener("change", function () {
      state.sort = this.value;
      state.visible = PAGE_SIZE;
      render();
    });
  }

  /* Chip "×" buttons clear a single filter. */
  if (el.chips) {
    el.chips.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-clear]");
      if (!btn) return;
      clearOne(btn.dataset.clear);
    });
  }

  function clearOne(kind) {
    if (kind === "q") setSearch("", true);
    else if (kind === "category") { state.category = ""; syncControls(); onFilterChange(); }
    else if (kind === "price") { state.price = "all"; syncControls(); onFilterChange(); }
    else if (kind === "rating") { state.rating = 0; syncControls(); onFilterChange(); }
  }

  function resetAll() {
    state.category = "";
    state.price = "all";
    state.rating = 0;
    state.sort = "featured";
    if (el.sort) el.sort.value = "featured";
    syncControls();
    setSearch("", true);
  }
  if (el.reset) el.reset.addEventListener("click", resetAll);
  if (el.emptyReset) el.emptyReset.addEventListener("click", function () {
    resetAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /** Push the current state back onto the radio inputs. */
  function syncControls() {
    $$('input[name="cat"]', el.filters).forEach(function (i) { i.checked = i.value === state.category; });
    $$('input[name="price"]', el.filters).forEach(function (i) { i.checked = i.value === state.price; });
    $$('input[name="rating"]', el.filters).forEach(function (i) {
      i.checked = (parseFloat(i.value) || 0) === state.rating;
    });
  }

  if (el.loadBtn) {
    el.loadBtn.addEventListener("click", function () {
      state.visible += PAGE_SIZE;
      render();
      /* Move focus to the first newly added card title for keyboard users. */
      const cards = $$(".card", el.grid);
      const first = cards[Math.max(0, state.visible - PAGE_SIZE)];
      const link = first && $(".card__title a", first);
      if (link) link.focus();
    });
  }

  /* ---------- 10. Mobile filter drawer ----------
     Under 900px the rail slides in from the left, mirroring the site's
     existing navigation drawer (same overlay, same Esc-to-close). */
  let overlay = null;
  let lastFocus = null;

  function openFilters() {
    if (!el.filters) return;
    lastFocus = document.activeElement;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "filters__overlay";
      overlay.addEventListener("click", closeFilters);
      document.body.appendChild(overlay);
    }
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add("show"); });
    el.filters.classList.add("is-open");
    if (el.filterBtn) el.filterBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (el.filtersClose) el.filtersClose.focus();
  }

  function closeFilters() {
    if (!el.filters || !el.filters.classList.contains("is-open")) return;
    el.filters.classList.remove("is-open");
    if (overlay) {
      overlay.classList.remove("show");
      setTimeout(function () { if (overlay) overlay.hidden = true; }, 320);
    }
    if (el.filterBtn) el.filterBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (el.filterBtn) el.filterBtn.addEventListener("click", openFilters);
  if (el.filtersClose) el.filtersClose.addEventListener("click", closeFilters);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeFilters();
  });

  /* ---------- boot ---------- */
  readParams();
  buildCategoryOptions();
  syncControls();
  if (state.q) {
    if (el.railSearch) el.railSearch.value = state.q;
    if (el.headerSearch) el.headerSearch.value = state.q;
    if (el.railSearchClear) el.railSearchClear.hidden = false;
  }
  if (el.sort) el.sort.value = state.sort;
  render();
})();
