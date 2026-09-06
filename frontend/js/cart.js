/* =============================================================
   MERAHAAT — cart.js
   The shopping bag page (cart.html).

   The bag itself lives in MHStore (localStorage, product ids + quantities
   only). This file just draws it and forwards clicks — no second copy of
   the cart logic, and no prices stored on the client that could go stale.

   Sections:
   1. Setup
   2. Draw one line
   3. Draw the page (lines + summary + empty state)
   4. Events (quantity, remove, clear, checkout)
   5. Stay in sync
   ============================================================= */
(function () {
  "use strict";

  const S = window.MHStore;
  const P = window.MHProducts;
  if (!S || !P) return;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  /* ---------- 1. Setup ---------- */
  /* Shipping is a simple front-end illustration, not a real rate table. */
  const FREE_SHIPPING_OVER = 1499;
  const FLAT_SHIPPING = 79;

  const el = {
    layout: $("#cartLayout"),
    lines: $("#cartLines"),
    empty: $("#cartEmpty"),
    sub: $("#cartSub"),
    clear: $("#clearCart"),
    subtotal: $("#sumSubtotal"),
    saveRow: $("#sumSaveRow"),
    save: $("#sumSave"),
    shipRow: $("#sumShipRow"),
    ship: $("#sumShip"),
    total: $("#sumTotal"),
    checkout: $("#checkoutBtn")
  };
  if (!el.lines) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 2. Draw one line ---------- */
  function lineHtml(line) {
    const p = line.product;
    const url = S.productUrl(p);
    const name = S.esc(p.name);

    /* Unit price, with the struck-through original when there is a discount. */
    let unit = '<span class="price">' + S.formatPrice(p.price) + "</span> each";
    if (p.originalPrice && p.originalPrice > p.price) {
      unit += ' <s class="price--old">' + S.formatPrice(p.originalPrice) + "</s>";
    }

    return (
      '<div class="cline" data-id="' + p.id + '">' +
        '<div class="cline__media">' +
          '<img src="' + p.image + '" alt=""' + S.fallbackAttr(p.image) +
            ' loading="lazy" width="96" height="96" />' +
          '<a class="cline__link" href="' + url + '" aria-label="View ' + name + '"></a>' +
        "</div>" +

        '<div class="cline__body">' +
          '<span class="cline__cat">' + S.esc(p.category) + "</span>" +
          '<p class="cline__name"><a href="' + url + '">' + name + "</a></p>" +
          '<p class="cline__unit">' + unit + "</p>" +
          '<button class="cline__remove" type="button" data-remove aria-label="Remove ' + name + ' from bag">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>' +
            "Remove" +
          "</button>" +
        "</div>" +

        '<div class="cline__qty">' +
          '<div class="qty qty--sm">' +
            '<button class="qty__btn" type="button" data-step="-1" aria-label="Decrease quantity of ' + name + '">' +
              '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>' +
            "</button>" +
            '<input class="qty__input" type="number" value="' + line.qty + '" min="1" max="99" step="1" ' +
              'inputmode="numeric" data-qty-input aria-label="Quantity of ' + name + '" />' +
            '<button class="qty__btn" type="button" data-step="1" aria-label="Increase quantity of ' + name + '">' +
              '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
            "</button>" +
          "</div>" +
        "</div>" +

        '<div class="cline__total"><span class="price">' + S.formatPrice(line.lineTotal) + "</span></div>" +
      "</div>"
    );
  }

  /* ---------- 3. Draw the page ---------- */
  function render() {
    const lines = S.cartLines();
    const isEmpty = lines.length === 0;

    el.layout.hidden = isEmpty;
    el.empty.hidden = !isEmpty;

    if (isEmpty) {
      el.lines.innerHTML = "";
      el.sub.textContent = "Your bag is empty for now.";
      document.title = "Shopping Bag — Merahaat";
      return;
    }

    el.lines.innerHTML = lines.map(lineHtml).join("");

    /* Totals */
    const subtotal = lines.reduce(function (sum, l) { return sum + l.lineTotal; }, 0);
    const saved = lines.reduce(function (sum, l) {
      const p = l.product;
      const off = p.originalPrice && p.originalPrice > p.price ? p.originalPrice - p.price : 0;
      return sum + off * l.qty;
    }, 0);
    const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
    const units = lines.reduce(function (sum, l) { return sum + l.qty; }, 0);

    el.subtotal.textContent = S.formatPrice(subtotal);

    el.saveRow.hidden = saved <= 0;
    if (saved > 0) el.save.textContent = "−" + S.formatPrice(saved);

    el.shipRow.classList.toggle("summary__row--free", shipping === 0);
    el.ship.textContent = shipping === 0 ? "Free" : S.formatPrice(shipping);

    el.total.textContent = S.formatPrice(subtotal + shipping);

    el.sub.textContent = units + (units === 1 ? " item" : " items") + " in your bag" +
      (shipping === 0
        ? " — free shipping applied."
        : " — add " + S.formatPrice(FREE_SHIPPING_OVER - subtotal) + " more for free shipping.");

    document.title = "Shopping Bag (" + units + ") — Merahaat";
  }

  /* Re-render, then put the keyboard focus back where it was so that
     clicking "+" three times in a row actually works. */
  function renderKeepFocus() {
    const active = document.activeElement;
    const row = active && active.closest ? active.closest(".cline") : null;
    let restore = null;

    if (row) {
      const id = row.dataset.id;
      if (active.dataset.step) restore = '.cline[data-id="' + id + '"] .qty__btn[data-step="' + active.dataset.step + '"]';
      else if (active.hasAttribute("data-qty-input")) restore = '.cline[data-id="' + id + '"] [data-qty-input]';
    }

    render();

    if (restore) {
      const target = $(restore, el.lines);
      if (target) target.focus();
    }
  }

  /* ---------- 4. Events ---------- */
  function clampQty(value) {
    const n = Math.round(Number(value));
    if (!isFinite(n) || n < 1) return 1;
    return Math.min(n, 99);
  }

  /* One delegated click handler for every row. */
  el.lines.addEventListener("click", function (e) {
    const row = e.target.closest(".cline");
    if (!row) return;
    const id = Number(row.dataset.id);

    const stepBtn = e.target.closest(".qty__btn");
    if (stepBtn) {
      const input = $("[data-qty-input]", row);
      const next = clampQty(Number(input.value) + (Number(stepBtn.dataset.step) || 0));
      S.setQty(id, next); // fires mh:cartchange -> renderKeepFocus()
      return;
    }

    if (e.target.closest("[data-remove]")) {
      removeRow(row, id);
    }
  });

  /* Typing a quantity straight into the field. */
  el.lines.addEventListener("change", function (e) {
    const input = e.target.closest("[data-qty-input]");
    if (!input) return;
    const row = input.closest(".cline");
    input.value = clampQty(input.value);
    S.setQty(Number(row.dataset.id), Number(input.value));
  });

  /* Slide the row out before it disappears — unless motion is reduced. */
  function removeRow(row, id) {
    const product = P.byId(id);
    const name = product ? product.name : "Item";

    const drop = function () {
      S.removeFromCart(id);
      S.toast(name + " removed from your bag", "info");
      S.announce(name + " removed from your bag");
    };

    if (prefersReduced) { drop(); return; }
    row.classList.add("is-leaving");
    setTimeout(drop, 260);
  }

  if (el.clear) {
    el.clear.addEventListener("click", function () {
      if (!S.cartCount()) return;
      /* Clearing the whole bag cannot be undone, so ask first. */
      if (!window.confirm("Remove everything from your bag?")) return;
      S.clearCart();
      S.toast("Your bag is now empty", "info");
      S.announce("Shopping bag cleared");
    });
  }

  /* Checkout is intentionally not connected to anything. */
  if (el.checkout) {
    el.checkout.addEventListener("click", function () {
      const message = "Checkout functionality will be available soon.";
      S.toast(message, "info");
      S.announce(message);
    });
  }

  /* ---------- 5. Stay in sync ---------- */
  /* Fired by MHStore whenever the bag changes — including from another tab. */
  document.addEventListener("mh:cartchange", renderKeepFocus);

  render();
})();
