/* =============================================================
   MERAHAAT — product.js
   The single product DETAIL page (product.html?id=12).

   One HTML template + one dataset = every product page. The product is
   chosen from the URL query string, so there is exactly one detail page
   in the project rather than one file per product.

   Sections:
   1. Which product? (URL -> data)
   2. Fill the page
   3. Gallery (thumbnails, swap, zoom, keyboard)
   4. Quantity stepper
   5. Wishlist button
   6. Related products
   7. Not found
   ============================================================= */
(function () {
  "use strict";

  const S = window.MHStore;
  const P = window.MHProducts;
  if (!S || !P) return;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const el = {
    pdp: $("#pdp"),
    missing: $("#pdpMissing"),
    crumbCat: $("#crumbCat"),
    crumbCatSep: $("#crumbCatSep"),
    crumbCurrent: $("#crumbCurrent"),
    galleryMain: $("#galleryMain"),
    galleryImg: $("#galleryImg"),
    galleryBadges: $("#galleryBadges"),
    thumbs: $("#thumbs"),
    cat: $("#pdpCat"),
    title: $("#pdpTitle"),
    rating: $("#pdpRating"),
    stock: $("#pdpStock"),
    price: $("#pdpPrice"),
    oldPrice: $("#pdpOldPrice"),
    discount: $("#pdpDiscount"),
    saving: $("#pdpSaving"),
    desc: $("#pdpDesc"),
    qtyInput: $("#qtyInput"),
    add: $("#pdpAdd"),
    buy: $("#pdpBuy"),
    wish: $("#pdpWish"),
    wishLabel: $("#pdpWishLabel"),
    specsPanel: $("#specsPanel"),
    specsBody: $("#specsBody"),
    relatedWrap: $("#relatedWrap"),
    relatedGrid: $("#relatedGrid")
  };

  /* ---------- 1. Which product? ---------- */
  const params = new URLSearchParams(window.location.search);
  const product = P.byId(params.get("id"));

  if (!product) {
    showMissing();
    return;
  }

  /* ---------- 2. Fill the page ---------- */
  const catUrl = S.categoryUrl(product.category);

  document.title = product.name + " — Merahaat";
  const metaDesc = $('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", product.description);

  /* Breadcrumb: Home / Products / Category / This product */
  el.crumbCat.textContent = product.category;
  el.crumbCat.href = catUrl;
  el.crumbCat.hidden = false;
  el.crumbCatSep.hidden = false;
  el.crumbCurrent.textContent = product.name;

  el.cat.textContent = product.category;
  el.cat.href = catUrl;
  el.title.textContent = product.name;

  /* Rating: the shared star component, so it matches the cards exactly. */
  el.rating.innerHTML =
    '<span class="pdp__ratingnum">' + product.rating.toFixed(1) + "</span>" +
    S.starMarkup(product.rating, product.reviews);

  /* Stock */
  el.stock.className = "stock " + (product.inStock ? "stock--in" : "stock--out");
  el.stock.textContent = product.inStock ? "In stock" : "Out of stock";

  /* Price block */
  el.price.textContent = S.formatPrice(product.price);
  if (product.originalPrice && product.originalPrice > product.price) {
    el.oldPrice.textContent = S.formatPrice(product.originalPrice);
    el.oldPrice.hidden = false;
    const saved = product.originalPrice - product.price;
    el.saving.textContent = "You save " + S.formatPrice(saved);
    el.saving.hidden = false;
  }
  if (product.discount) {
    el.discount.textContent = "-" + product.discount + "%";
    el.discount.hidden = false;
  }

  el.desc.textContent = product.description;

  /* Add to cart / Buy now — the shared store handles the click through
     [data-add] / [data-buy-now]; this page only supplies the product id. */
  el.add.dataset.id = product.id;
  el.buy.dataset.id = product.id;
  if (!product.inStock) {
    el.add.disabled = true;
    el.add.textContent = "Sold out";
    el.add.removeAttribute("data-add");
    el.buy.disabled = true;
    el.buy.removeAttribute("data-buy-now");
    if (el.qtyInput) el.qtyInput.disabled = true;
    $$(".qty__btn").forEach(function (b) { b.disabled = true; });
  }

  /* Specifications */
  renderSpecs(product.specs);

  /* Badges over the main photo — reuses the card badge component. */
  let badges = "";
  if (product.discount) badges += '<span class="badge badge--pulse">-' + product.discount + "%</span>";
  if (product.badge) badges += '<span class="badge badge--tag">' + S.esc(product.badge) + "</span>";
  if (!product.inStock) badges += '<span class="badge badge--out">Sold out</span>';
  el.galleryBadges.innerHTML = badges;

  el.pdp.hidden = false;

  /* ---------- 3. Gallery ---------- */
  /* Duplicate paths would produce duplicate thumbnails, so de-duplicate. */
  const images = (product.images && product.images.length ? product.images : [product.image])
    .filter(function (src, i, arr) { return src && arr.indexOf(src) === i; });

  let activeIndex = 0;

  function setMainImage(index, animate) {
    const src = images[index];
    if (!src) return;
    activeIndex = index;

    const img = el.galleryImg;
    const fb = S.fallbackFor(src);
    img.onerror = fb
      ? function () { img.onerror = null; img.src = fb; }
      : null;

    if (animate) {
      img.classList.add("is-swapping");
      img.addEventListener("load", onSwapped, { once: true });
      img.addEventListener("error", onSwapped, { once: true });
    }
    img.src = src;
    img.alt = product.name + (images.length > 1 ? " — photo " + (index + 1) + " of " + images.length : "");

    $$(".thumb", el.thumbs).forEach(function (btn, i) {
      const on = i === index;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function onSwapped() {
    el.galleryImg.classList.remove("is-swapping");
  }

  /* Thumbnails are only built for multi-photo products — a single-photo
     product gets a clean image with no empty strip underneath. */
  if (images.length > 1) {
    el.thumbs.innerHTML = images.map(function (src, i) {
      return '<button class="thumb" type="button" data-index="' + i + '"' +
        ' aria-pressed="' + (i === 0 ? "true" : "false") + '"' +
        ' aria-label="Show photo ' + (i + 1) + " of " + images.length + '">' +
        '<img src="' + src + '" alt=""' + S.fallbackAttr(src) + ' loading="lazy" width="78" height="78" />' +
        "</button>";
    }).join("");

    el.thumbs.addEventListener("click", function (e) {
      const btn = e.target.closest(".thumb");
      if (!btn) return;
      setMainImage(Number(btn.dataset.index), true);
    });

    /* Arrow keys walk the strip, Home/End jump to the ends. */
    el.thumbs.addEventListener("keydown", function (e) {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let next = null;
      if (keys[e.key]) next = (activeIndex + keys[e.key] + images.length) % images.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = images.length - 1;
      if (next === null) return;
      e.preventDefault();
      setMainImage(next, true);
      const btn = $('.thumb[data-index="' + next + '"]', el.thumbs);
      if (btn) btn.focus();
    });
  }

  /* Show the first photo. */
  setMainImage(0, false);

  /* Skeleton -> loaded (same behaviour as the product cards). */
  function markLoaded() { el.galleryMain.classList.add("loaded", "can-zoom"); }
  if (el.galleryImg.complete) markLoaded();
  el.galleryImg.addEventListener("load", markLoaded);
  el.galleryImg.addEventListener("error", markLoaded);

  /* Cursor-tracked zoom. CSS limits the effect to fine pointers, and the
     transform origin follows the cursor through --zx / --zy. */
  el.galleryMain.addEventListener("mousemove", function (e) {
    if (!el.galleryMain.classList.contains("is-zoomed")) return;
    const r = el.galleryMain.getBoundingClientRect();
    el.galleryMain.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%");
    el.galleryMain.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%");
  });
  el.galleryMain.addEventListener("click", function (e) {
    /* Ignore clicks that land on the badges. */
    if (e.target.closest(".badge")) return;
    const zoomed = el.galleryMain.classList.toggle("is-zoomed");
    if (zoomed) {
      const r = el.galleryMain.getBoundingClientRect();
      el.galleryMain.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.galleryMain.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%");
    }
  });
  el.galleryMain.addEventListener("mouseleave", function () {
    el.galleryMain.classList.remove("is-zoomed");
  });

  /* ---------- 4. Quantity stepper ---------- */
  function clampQty(value) {
    const n = Math.round(Number(value));
    if (!isFinite(n) || n < 1) return 1;
    return Math.min(n, 99);
  }

  $$(".qty__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const step = Number(btn.dataset.step) || 0;
      el.qtyInput.value = clampQty(Number(el.qtyInput.value) + step);
    });
  });
  el.qtyInput.addEventListener("change", function () {
    this.value = clampQty(this.value);
  });
  /* Enter in the number field should add to cart, not submit anything. */
  el.qtyInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.value = clampQty(this.value);
      if (!el.add.disabled) el.add.click();
    }
  });

  /* ---------- 5. Wishlist button ----------
     Same stored list as the heart on the cards (MHStore owns it), just a
     different-looking control. */
  function paintWish() {
    const on = S.isWished(product.id);
    el.wish.classList.toggle("is-saved", on);
    el.wish.setAttribute("aria-pressed", on ? "true" : "false");
    el.wishLabel.textContent = on ? "Saved to wishlist" : "Add to wishlist";
  }
  el.wish.addEventListener("click", function () {
    const saved = S.toggleWish(product.id);
    paintWish();
    S.toast(saved ? "Saved to your wishlist" : "Removed from your wishlist", saved ? "ok" : "info");
    S.announce(product.name + (saved ? " saved to wishlist" : " removed from wishlist"));
  });
  /* Keep in step when the same product is toggled on a related card. */
  document.addEventListener("mh:wishchange", paintWish);
  paintWish();

  /* ---------- 6. Related products ---------- */
  const relatedList = P.related(product, 4);
  if (relatedList.length) {
    S.renderProductGrid(el.relatedGrid, relatedList);
    el.relatedWrap.hidden = false;
  }

  /* Build the specifications table from product.specs. Any product can
     carry any set of keys — nothing here is hardcoded per product. */
  function renderSpecs(specs) {
    const rows = [];
    Object.keys(specs || {}).forEach(function (key) {
      const value = specs[key];
      if (value === undefined || value === null || value === "") return;
      rows.push("<tr><th scope=\"row\">" + S.esc(key) + "</th><td>" + S.esc(String(value)) + "</td></tr>");
    });
    /* Two values every product has, shown last for consistency. */
    rows.push('<tr><th scope="row">Category</th><td>' + S.esc(product.category) + "</td></tr>");
    rows.push('<tr><th scope="row">Availability</th><td>' +
      (product.inStock ? "In stock" : "Currently out of stock") + "</td></tr>");

    el.specsBody.innerHTML = rows.join("");
  }

  /* ---------- 7. Not found ---------- */
  function showMissing() {
    if (el.pdp) el.pdp.hidden = true;
    if (el.relatedWrap) el.relatedWrap.hidden = true;
    if (el.missing) el.missing.hidden = false;
    if (el.crumbCurrent) el.crumbCurrent.textContent = "Not found";
    document.title = "Product not found — Merahaat";
  }
})();
