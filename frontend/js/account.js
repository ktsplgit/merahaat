/* =============================================================
   MERAHAAT — account.js
   Interactions for the Login / Register ("My account") page.
   Loads AFTER main.js, which already wires the shared chrome
   (sticky header, drawer, back-to-top, reveal-on-scroll, etc.).
   This file only adds the account-specific behaviour and, like
   main.js, degrades gracefully and honours prefers-reduced-motion.

   Sections:
   1. Helpers
   2. Decorative floating shapes
   3. Login / Register segmented toggle (mobile)
   4. Password show / hide
   5. Password strength meter
   6. Account-type segmented control (customer / vendor)
   7. Inline validation
   8. Mocked submit (spinner -> success -> redirect)
   9. Reset-password modal (focus trap)
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const auth = $("#auth");
  if (!auth) return; // not on the account page

  /* ---------- 2. Decorative floating shapes ---------- */
  (function shapes() {
    const layer = $("#accountShapes");
    if (!layer || prefersReduced) return;
    // A handful of soft festive orbs, deterministic sizes/positions (no RNG).
    const specs = [
      { size: 120, left: 6,  top: 12, dur: 17, delay: 0,   gold: false, drift: 18 },
      { size: 70,  left: 88, top: 20, dur: 14, delay: -3,  gold: true,  drift: -14 },
      { size: 160, left: 78, top: 68, dur: 21, delay: -6,  gold: false, drift: 16 },
      { size: 54,  left: 16, top: 78, dur: 15, delay: -2,  gold: true,  drift: -12 },
      { size: 90,  left: 46, top: 8,  dur: 19, delay: -8,  gold: false, drift: 20 },
      { size: 40,  left: 60, top: 88, dur: 13, delay: -5,  gold: true,  drift: -18 },
    ];
    specs.forEach((s) => {
      const el = document.createElement("span");
      el.className = "shape" + (s.gold ? " shape--gold" : "");
      el.style.width = el.style.height = s.size + "px";
      el.style.left = s.left + "%";
      el.style.top = s.top + "%";
      el.style.setProperty("--dur", s.dur + "s");
      el.style.setProperty("--delay", s.delay + "s");
      el.style.setProperty("--drift", s.drift + "px");
      layer.appendChild(el);
    });
  })();

  /* ---------- 3. Login / Register segmented toggle (mobile) ---------- */
  (function toggle() {
    const tabLogin = $("#tabLogin");
    const tabRegister = $("#tabRegister");
    if (!tabLogin || !tabRegister) return;

    function activate(which) {
      auth.dataset.active = which;
      const isLogin = which === "login";
      tabLogin.setAttribute("aria-selected", String(isLogin));
      tabRegister.setAttribute("aria-selected", String(!isLogin));
      // move focus to the first field of the newly shown panel (mobile only)
      if (window.matchMedia("(max-width: 900px)").matches) {
        const panel = $("#panel-" + which);
        const first = panel && $(".field__input", panel);
        if (first) first.focus({ preventScroll: true });
      }
    }
    tabLogin.addEventListener("click", () => activate("login"));
    tabRegister.addEventListener("click", () => activate("register"));

    // roving arrow-key support between the two tabs
    [tabLogin, tabRegister].forEach((tab) => {
      tab.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const other = tab === tabLogin ? tabRegister : tabLogin;
          other.focus();
          activate(other === tabLogin ? "login" : "register");
        }
      });
    });
  })();

  /* ---------- 4. Password show / hide ---------- */
  $$("[data-toggle-pass]").forEach((btn) => {
    const input = document.getElementById(btn.dataset.togglePass);
    if (!input) return;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.classList.toggle("is-on", show);
      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus({ preventScroll: true });
    });
  });

  /* ---------- 5. Password strength meter ---------- */
  (function strength() {
    const input = $("#regPass");
    const meter = $("#regPass-strength");
    if (!input || !meter) return;
    const label = $(".strength__label", meter);
    const WORDS = ["", "Weak", "Fair", "Good", "Strong"];

    function score(v) {
      if (!v) return 0;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      // very short passwords can never read as strong
      if (v.length < 6) s = Math.min(s, 1);
      return Math.min(s, 4);
    }
    input.addEventListener("input", () => {
      const level = score(input.value);
      meter.dataset.level = String(level);
      if (label) label.textContent = level ? "Password strength: " + WORDS[level] : "";
    });
  })();

  /* ---------- 6. Account-type segmented control ---------- */
  (function acctType() {
    const seg = $("#acctSegment");
    if (!seg) return;
    $$('input[name="acctType"]', seg).forEach((radio) => {
      radio.addEventListener("change", () => { if (radio.checked) seg.dataset.active = radio.value; });
    });
  })();

  /* ---------- 7. Inline validation ---------- */
  // Returns "" when valid, or an error message string.
  function validate(input) {
    const v = input.value.trim();
    const type = input.type;
    const isEmail = type === "email";
    if (input.required && !v) {
      return isEmail ? "Please enter your email address." : "This field is required.";
    }
    if (isEmail && v && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
    if (type === "password" && v && v.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  function setFieldState(input, message) {
    const field = input.closest(".field");
    const err = field && $(".field__error", field);
    const valid = !message;
    if (field) {
      field.classList.toggle("is-invalid", !valid);
      field.classList.toggle("is-valid", valid && input.value.trim() !== "");
    }
    input.setAttribute("aria-invalid", String(!valid));
    if (err) {
      err.textContent = valid ? "" : message;
      if (!valid && err.id) input.setAttribute("aria-describedby", err.id);
    }
    // restart the shake animation on repeated invalid submits
    if (!valid && !prefersReduced) {
      input.style.animation = "none";
      // force reflow so the animation can replay
      void input.offsetWidth;
      input.style.animation = "";
    }
    return valid;
  }

  // Live: clear an error as soon as the field becomes valid again.
  $$(".authform .field__input, .modal__form .field__input").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field && field.classList.contains("is-invalid")) {
        if (!validate(input)) setFieldState(input, "");
      }
    });
    // validate a filled field on blur to show the green tick early
    input.addEventListener("blur", () => {
      if (input.value.trim() !== "") setFieldState(input, validate(input));
    });
  });

  /* ---------- 8. Mocked submit (spinner -> success -> redirect) ---------- */
  function handleSubmit(form, opts) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = $$(".field__input", form);
      let firstInvalid = null;
      let allValid = true;
      inputs.forEach((input) => {
        const msg = validate(input);
        const ok = setFieldState(input, msg);
        if (!ok && !firstInvalid) firstInvalid = input;
        if (!ok) allValid = false;
      });
      if (!allValid) { firstInvalid && firstInvalid.focus(); return; }

      const btn = $(".btn--submit", form);
      if (!btn || btn.classList.contains("is-loading")) return;
      btn.classList.add("is-loading");
      btn.disabled = true;

      // Mock network round-trip: spinner -> success morph -> callback.
      const wait = prefersReduced ? 300 : 1100;
      setTimeout(() => {
        btn.classList.remove("is-loading");
        btn.classList.add("is-done");
        setTimeout(() => { opts && opts.onDone && opts.onDone(btn); }, prefersReduced ? 200 : 900);
      }, wait);
    });
  }

  const loginForm = $("#loginForm");
  const registerForm = $("#registerForm");
  if (loginForm) handleSubmit(loginForm, { onDone: () => { window.location.href = "index.html"; } });
  if (registerForm) handleSubmit(registerForm, { onDone: () => { window.location.href = "index.html"; } });

  /* ---------- 9. Reset-password modal (focus trap) ---------- */
  (function resetModal() {
    const modal = $("#resetModal");
    const openLink = $("#forgotLink");
    const closeBtn = $("#resetClose");
    const form = $("#resetForm");
    const modalBox = modal && $(".modal", modal);
    if (!modal || !openLink) return;

    let lastFocused = null;
    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function open(e) {
      e && e.preventDefault();
      lastFocused = document.activeElement;
      modal.hidden = false;
      // Commit the pre-open state (opacity 0 / visibility hidden) with a forced
      // reflow, THEN add .show so the fade actually transitions.
      void modal.offsetWidth;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
      // The overlay transitions `visibility`, so for this one tick its computed
      // value is still `hidden` — and a visibility:hidden element cannot take
      // focus, so focusing here silently does nothing and the keyboard is left
      // behind the overlay. Two frames later the style recalc has landed and the
      // field is focusable; the transition carries on, so nothing is visible.
      const first = $("#resetEmail");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!modal.hidden && first) first.focus({ preventScroll: true });
        });
      });
      document.addEventListener("keydown", onKeydown);
    }
    function close() {
      modal.classList.remove("show");
      document.removeEventListener("keydown", onKeydown);
      const done = () => {
        modal.hidden = true;
        // reset for next open
        modalBox && modalBox.classList.remove("done");
        if (form) {
          form.reset();
          $$(".field", form).forEach((f) => f.classList.remove("is-invalid", "is-valid"));
          const btn = $(".btn--submit", form);
          if (btn) { btn.classList.remove("is-loading", "is-done"); btn.disabled = false; }
        }
      };
      if (prefersReduced) done();
      else setTimeout(done, 300);
      document.body.style.overflow = "";
      lastFocused && lastFocused.focus();
    }
    function onKeydown(e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // trap focus within the modal
      const items = $$(FOCUSABLE, modal).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    openLink.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    if (form) {
      handleSubmit(form, {
        onDone: () => { modalBox && modalBox.classList.add("done"); },
      });
    }
  })();

})();
