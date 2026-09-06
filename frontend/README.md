# Meerahaat

A static e-commerce storefront for Merahaat, built with plain HTML, CSS and
JavaScript. No framework, no build step, no backend.

---

## 1. Project Overview

**Meerahaat** is the frontend of an online shopping website. It sells jewellery,
leather goods, dry fruits, namkeen, winter wear, grocery, kids' items, puja items,
cosmetics and corporate gifts.

**What type of application it is.** A multi-page static web application. Each page is
a real `.html` file. There is no server-side code — the browser downloads the HTML,
CSS and JavaScript and does all the work locally.

**The problem it solves.** The original Merahaat site had product information written
directly into the page markup. Every product appeared in only one fixed place, there
was no way to browse or search a catalog, and adding a product meant hand-writing
HTML in several files. This project replaces that with a **single product data file**
that all pages read from, so the catalog can be searched, filtered, sorted and
extended from one place.

**What the project currently provides.**

- A landing page with a hero carousel, category tiles and product sections.
- A product listing page with search, filters, sorting and pagination.
- A product detail page that works for any product via a URL parameter.
- A shopping cart that survives page reloads.
- A wishlist.
- A login/register page with client-side form validation.

**Current status: frontend only.** All data lives in a JavaScript file, and the cart
and wishlist live in the browser's `localStorage`. There is no database, no server API,
no real user accounts and no payment processing. Section 19 lists every limitation.

---

## 2. Project Objectives

1. **Remove duplicated product data.** Keep all product information in one file
   (`js/products.js`) so a price or name is never written twice.
2. **Build one detail page instead of many.** A single `product.html` serves every
   product, selected by a URL parameter.
3. **Make the catalog browsable.** Add search, category/price/rating filters and
   sorting on top of the shared data.
4. **Make the cart persistent.** Store it in `localStorage` so it survives navigation
   and reloads.
5. **Keep the existing design.** Reuse the established colours, typography, spacing
   and animations. Do not restyle the site.
6. **Stay dependency-free.** No framework, no bundler, no package manager. The project
   must run by opening a file or serving a folder.
7. **Keep it readable.** Plain functions, clear names and comments that explain *why*,
   so another developer (or a student) can follow the code without prior context.
8. **Be accessible and responsive.** Keyboard support, screen-reader labels, and
   layouts that work from 375 px to 1440 px.

---

## 3. Technology Stack

| Technology | Used for |
|---|---|
| **HTML5** | Page structure. Semantic elements (`header`, `nav`, `main`, `section`, `footer`, `fieldset`) and ARIA attributes. |
| **CSS3** | All styling. Custom properties (variables) for the design tokens, Flexbox and Grid for layout, media queries for responsiveness, transitions/keyframes for animation. |
| **JavaScript (ES2015+, vanilla)** | All behaviour. Plain functions inside IIFEs, no modules and no transpiling. |
| **Web Storage API (`localStorage`)** | Persisting the cart and the wishlist in the browser. |
| **Python `http.server`** | Local development only — a one-command static file server. Not a runtime dependency. |

**Loaded from a CDN (optional, not required):**

| Resource | Purpose | If it fails to load |
|---|---|---|
| Google Fonts (Fraunces, Manrope) | Brand typography | A system font stack takes over. |
| GSAP + ScrollTrigger 3.12.5 (cdnjs) | Extra scroll-linked parallax only | `js/main.js` detects the absence and runs its `IntersectionObserver` + CSS fallback. Every feature still works. |

**Not used:** React, Vue, Angular, Node.js, Express, MongoDB, Firebase, jQuery,
Bootstrap, Tailwind, webpack, Vite, npm, or any REST/GraphQL API. There is no
`package.json` because there is nothing to install.

---

## 4. Project Structure

```
Meerahaat/
├── assets/
│   └── img/                  # all images (96 files)
│       └── photos/           # JPG photographs used by products & banners
├── css/
│   ├── styles.css            # design tokens + shared layout + landing page
│   ├── shop.css              # shared shop layer (used by 3 pages)
│   ├── products.css          # listing page only
│   ├── product.css           # detail page only
│   ├── cart.css              # cart page only
│   └── account.css           # account page only
├── js/
│   ├── products.js           # THE product data + lookup helpers
│   ├── store.js              # shared cart / wishlist / card rendering
│   ├── catalog.js            # listing page logic
│   ├── product.js            # detail page logic
│   ├── cart.js               # cart page logic
│   ├── main.js               # shared chrome: carousel, nav, scroll effects
│   └── account.js            # account page logic
├── index.html                # landing page
├── products.html             # product listing
├── product.html             # product detail (one file for all products)
├── cart.html                 # shopping cart
├── account.html              # login / register
├── favicon.ico
├── .gitignore
└── README.md
```

### Folders

| Path | Contents |
|---|---|
| `assets/img/` | On-brand SVG images. Each one also acts as the fallback if its JPG twin is missing. |
| `assets/img/photos/` | JPG photographs for products, category tiles, hero banners and the lifestyle mosaic. |
| `css/` | Stylesheets. `styles.css` defines every design token; the other five only add layout and never introduce a new colour or font. |
| `js/` | Application logic, split by responsibility (see below). |

### JavaScript files

| File | Responsibility |
|---|---|
| `js/products.js` | **Centralised product data.** The `PRODUCTS` array (37 items) plus helpers: `all`, `byId`, `categories`, `findCategory`, `related`, `slugify`. Loaded first on every page. |
| `js/store.js` | **Shared store logic.** Cart and wishlist read/write, the `renderProductCard()` HTML builder, the header cart badge, toast messages and screen-reader announcements. The only file that touches `localStorage`. |
| `js/catalog.js` | **Listing page.** Search, category/price/rating filtering, sorting, "Show more" pagination, empty state and URL synchronisation. Runs only on `products.html`. |
| `js/product.js` | **Detail page.** Reads `?id=`, fills in the product, drives the image gallery, quantity stepper, specification table and related products. Runs only on `product.html`. |
| `js/cart.js` | **Cart page.** Renders cart rows, computes subtotal/shipping/total, handles quantity changes and removal. Runs only on `cart.html`. |
| `js/main.js` | **Shared page chrome.** Hero carousel, sticky header, scroll-progress bar, scroll reveals, mobile drawer, back-to-top, count-up statistics, fly-to-cart animation, and the optional GSAP layer. Loaded on every page. |
| `js/account.js` | **Account page.** Login/register tab switching, floating labels, show/hide password, password strength meter, format-only validation, and the reset-password modal. Runs only on `account.html`. |

### HTML pages

| Page | Purpose |
|---|---|
| `index.html` | Landing page. Hero carousel, 8 category tiles, "Top Products", a featured mosaic, "Latest Products", a promotional banner, trust badges, newsletter and footer. Its product cards are written directly in the HTML (see section 17). |
| `products.html` | The catalog. Empty grid in the markup; `catalog.js` fills it. Contains the filter sidebar (which becomes a drawer on small screens) and the sort dropdown. |
| `product.html` | One detail page for every product, chosen by `?id=`. Contains an empty gallery, title, price and specification table that `product.js` populates, plus a "Product not found" panel for invalid IDs. |
| `cart.html` | The shopping bag. Empty list in the markup; `cart.js` fills it from `localStorage`. Contains the order summary and the (intentionally inert) checkout button. |
| `account.html` | Login and register forms. Validation is client-side and format-only; nothing is stored or transmitted. |

All five pages share the same header, offer bar, category navigation, mobile drawer,
trust row and footer markup.

---

## 5. Application Architecture

The code is layered. Each layer only knows about the one above it.

```
        js/products.js          ← the data (37 products + lookup helpers)
               │                  exposes window.MHProducts
               ▼
         js/store.js            ← shared logic: cart, wishlist, card HTML, badge
               │                  exposes window.MHStore
               ▼
   catalog.js / product.js      ← one page script per page; asks the layers
   cart.js / account.js            above for data and markup
               │
               ▼
          HTML pages            ← provide the containers the page script fills
```

`js/main.js` sits beside the page scripts and handles the chrome that is identical on
every page (carousel, navigation, scroll effects).

**Load order matters, and is guaranteed.** Every page loads its scripts like this:

```html
<script defer src="js/products.js"></script>   <!-- 1. data      -->
<script defer src="js/store.js"></script>      <!-- 2. shared    -->
<script defer src="js/main.js"></script>       <!-- 3. chrome    -->
<script defer src="js/catalog.js"></script>    <!-- 4. this page -->
```

`defer` scripts execute in document order after the HTML is parsed. So:

- `store.js` can rely on `window.MHProducts` already existing.
- `main.js` can check `window.MHStore` to decide which interactions it should *not*
  handle (this is how duplicate cart logic is avoided — see section 21).
- the page script runs last, when every container element exists.

**`products.js` is the single source of product data.** No product name, price or
image is written anywhere else in JavaScript. The cart stores only IDs. The detail page
looks products up by ID. The listing page renders from the same array. Change a price
in `products.js` and every page — including carts already saved in a browser — shows
the new price.

---

## 6. Product Data System

### The `PRODUCTS` array

`js/products.js` contains one array of 37 objects. Every object has the same shape:

```js
{
  id: 1,                                   // unique number, used in URLs
  name: "SURMEE Premium Black Bifold Leather Wallet for Men",
  category: "Leather",                     // display name
  price: 240,                              // number, not a string
  originalPrice: 400,                      // null when there is no discount
  discount: 40,                            // percent; 0 when there is no discount
  rating: 4.5,                             // 0–5, halves allowed
  reviews: 38,
  image: "assets/img/photos/p-wallet-black.jpg",   // card / main image
  images: [ /* gallery: main image first, then alternates */ ],
  description: "A slim bifold cut from full-grain leather…",
  specs: { Material: "Genuine full-grain leather", Closure: "Bifold" },
  inStock: true,
  badge: "",                               // optional pill: "New", "Best Seller"…
  added: "2026-02-14"                      // ISO date, used by the "Newest" sort
}
```

### Product IDs

IDs are plain numbers, `1` to `37`, and must be unique. They are the only thing that
identifies a product across the application:

- the detail page URL is `product.html?id=13`
- the cart stores `{ "id": 13, "qty": 2 }`
- the wishlist stores `13`
- homepage cards carry `data-id="13"`

**IDs 1–24 are the 24 product cards already written into `index.html`, in the same
order they appear on the page.** That mapping is deliberate: it means a homepage card
and its detail page can never disagree. IDs 25–37 exist so that no category tile leads
to an empty listing.

### Categories

Categories are **not** stored in a separate list. `MHProducts.categories()` counts them
from the data:

```js
[
  { name: "Jewellery",        slug: "jewellery",        count: 12 },
  { name: "Leather",          slug: "leather",          count: 8  },
  { name: "Kids",             slug: "kids",             count: 2  },
  { name: "Winter Wear",      slug: "winter-wear",      count: 2  },
  { name: "Grocery",          slug: "grocery",          count: 2  },
  { name: "Dry Fruits",       slug: "dry-fruits",       count: 5  },
  { name: "Corporate Gifts",  slug: "corporate-gifts",  count: 2  },
  { name: "Cosmetic",         slug: "cosmetic",         count: 1  },
  { name: "Namkeen & Snacks", slug: "namkeen-snacks",   count: 2  },
  { name: "Puja",             slug: "puja",             count: 1  }
]
```

Because the list is counted, adding a product in a new category makes that category
appear in the filter sidebar with the correct count on the next reload. A constant
called `CATEGORY_ORDER` at the top of the file only controls **display order** — the
first eight entries above are in the same order as the homepage's eight category tiles,
which is why the list is not sorted by count. Any category not named in `CATEGORY_ORDER`
(here, Namkeen & Snacks and Puja) is appended alphabetically after it.

### Product lookup

| Helper | Returns |
|---|---|
| `MHProducts.all()` | A **copy** of the array, so callers can sort it without affecting anyone else. |
| `MHProducts.byId(13)` | One product object, or `undefined`. Accepts a string, so `byId("13")` works straight from a URL. |
| `MHProducts.categories()` | `[{ name, slug, count }]`, counted from the data. |
| `MHProducts.findCategory(value)` | The display name for a slug *or* a display name, in any capitalisation. `""` when nothing matches. |
| `MHProducts.related(product, 4)` | Up to 4 other products: same category first, then topped up from other categories so the strip is never empty. |
| `MHProducts.slugify(text)` | `"Namkeen & Snacks"` → `"namkeen-snacks"`. |

`byId()` is defensive: it coerces with `Number()`, so `"abc"`, `""`, `null`, `"0"` and
`"999"` all return `undefined` instead of throwing.

### Slug generation

`slugify()` lowercases the text, replaces `&` with a space, converts every run of
non-alphanumeric characters to a single `-`, and trims leading/trailing dashes. This
is what makes `Namkeen & Snacks` safe to put in a URL as `namkeen-snacks`.

### How the detail page uses `?id=`

```js
const params  = new URLSearchParams(window.location.search);
const product = MHProducts.byId(params.get("id"));
```

If `product` is `undefined` — missing, non-numeric or unknown ID — the page hides the
product layout and shows a "Product not found" panel with a link back to the catalog.
No console error and no blank page.

### How category filtering works

Links point at `products.html?category=<slug>`. `catalog.js` reads the parameter and
calls `MHProducts.findCategory()` to turn the slug back into a real category name, then
filters on it. An unknown or malformed value resolves to `""`, which simply means
"no category filter" — so a bad link shows all products instead of breaking.

---

## 7. How Product Listing Works

`products.html` contains an **empty** grid. `catalog.js` fills it, so no product HTML
is duplicated on the page.

| Control | Behaviour |
|---|---|
| **Search** | Case-insensitive match against the product **name, category and description**. Typing filters as you type. There are two inputs (the header search and the sidebar search) and they mirror each other. |
| **Category filter** | Radio buttons built from `MHProducts.categories()`, each showing its live count. |
| **Price filter** | Any price · Under ₹250 · ₹250–₹499 · ₹500–₹999 · ₹1,000–₹1,999 · ₹2,000 & above. |
| **Rating filter** | Any rating · 4.5 & up · 4.0 & up · 3.0 & up. |
| **Sorting** | Featured · Price: Low to High · Price: High to Low · Customer Rating · Newest First. |
| **Pagination** | "Show more" adds **12** cards at a time and reports how many of the total are shown. Changing any filter resets to the first 12. |
| **Empty state** | When nothing matches, an accessible panel appears with the search term quoted and a "Clear all filters" button. |
| **Result count** | A live region reads `"37 products found"` and updates on every change. |

**Sorting never mutates the data.** `MHProducts.all()` hands back a copy, and each sort
runs on that copy, so the curated order in `products.js` (which is what "Featured"
means) is never lost.

**URL synchronisation.** Filters are written back to the address bar with
`history.replaceState`, so any view can be bookmarked, shared or reloaded:

```
products.html?category=jewellery
products.html?q=combo
products.html?category=leather&sort=price-asc
```

The reverse also works — those URLs preselect the controls on load. `q` and `search`
are both accepted for the search term, and `category` and `cat` for the category.
`replaceState` is used rather than `pushState` so that adjusting a filter five times
does not leave five entries in the browser's back history.

---

## 8. How Product Details Work

One file, `product.html`, serves all 37 products. The URL decides which one:

```
product.html?id=1     → SURMEE Premium Black Bifold Leather Wallet
product.html?id=13    → Twilight Serenade Silver Oxidized Necklace Set
product.html?id=999   → "Product not found" panel
```

`product.js` reads the ID with `URLSearchParams`, looks the product up, and then fills
in the page: document title, breadcrumb, name, price, discount, stars, stock state,
description, specifications and gallery.

| Part | How it works |
|---|---|
| **Gallery** | The `images` array becomes one large image plus a row of thumbnail buttons. Duplicate paths are removed first, and thumbnails are only rendered when there is more than one image. Clicking a thumbnail swaps the main image; the active one is marked with `aria-pressed="true"`. Arrow keys, Home and End move through the thumbnails and wrap around. Once the main image has loaded it becomes hover-zoomable. The main image's `alt` text is generated as `"<product name> — photo 2 of 3"`. |
| **Quantity** | A `−` / input / `+` stepper. The value is clamped to **1–99**, so typing `0` becomes `1` and `999` becomes `99`. |
| **Specifications** | The `specs` object is rendered as a two-column table. **Category** and **Availability** rows are always appended, so the table is never empty even for a product with no `specs`. |
| **Related products** | `MHProducts.related(product, 4)` returns four other products, rendered with the same shared card function as every other grid. |
| **Add to cart** | The button carries `data-add` and the product ID. The click is handled by `store.js`, which adds the chosen quantity, updates the badge, shows a toast and announces the change. A separate "Buy now" button adds the item and then opens the cart page. |
| **Wishlist** | A heart button that toggles the product in the saved wishlist and reflects its state with `aria-pressed`. |

---

## 9. Cart System

### Storage architecture

The cart lives in `localStorage` under the key **`merahaat_cart`**, and it stores
**only IDs and quantities**:

```json
[
  { "id": 1,  "qty": 2 },
  { "id": 13, "qty": 1 }
]
```

Everything else — name, price, image, stock status — is looked up again from
`js/products.js` every time the cart is rendered.

**Why it is done this way.** If the cart stored prices, a saved cart would keep showing
last month's price after `products.js` was updated, and the same product data would
exist in two places. Storing only the ID means `products.js` stays the single source of
truth and prices can never go stale.

Reading the cart is also a cleanup step: `getCart()` drops any line whose product no
longer exists in `products.js`, and clamps every quantity to 1–99. A cart saved before
a product was deleted therefore degrades quietly instead of crashing the page.

### Operations

| Operation | What happens |
|---|---|
| **Add to cart** | `MHStore.addToCart(id, qty)`. Refuses products with `inStock: false` (and says so). If the product is already in the cart, the quantity is increased instead of adding a second line. |
| **Increase / decrease quantity** | `MHStore.setQty(id, qty)`, upper bound 99. A quantity of `0` or less **removes the line** rather than clamping back up to 1. The cart page never sends `0`: `cart.js` clamps the stepper value to 1–99 before calling, so pressing `−` at quantity 1 leaves the row at 1 and removal only happens through the explicit remove button. |
| **Remove** | `MHStore.removeFromCart(id)`. The row slides out first, then the list re-renders (immediately if the user prefers reduced motion). |
| **Clear cart** | Asks for confirmation with `window.confirm()` before emptying. |
| **Cart badge** | The number next to the header cart icon. `MHStore.updateCartBadge()` is called on every change and on every page load, so the count is correct on all five pages. The icon's `aria-label` is updated too (`"Shopping cart, 3 items"`). |
| **Totals** | Subtotal (sum of `price × qty`), the amount saved versus the original prices, shipping, and the final total. |
| **Shipping** | **Free above ₹1,499**, otherwise a flat **₹79**. Below the threshold the page shows how much more is needed to qualify. |
| **Empty state** | A panel with a "Continue shopping" link when the cart has no items. |

### Cart synchronisation

Only `store.js` reads or writes `localStorage`. After every change it dispatches a
`CustomEvent`:

- `mh:cartchange`
- `mh:wishchange`

Anything that displays cart state listens for those events rather than polling. This is
how the cart page, the header badge and the wishlist hearts all stay in step without
knowing about each other.

All storage access is wrapped in `try`/`catch`. Safari's private mode throws when you
write to `localStorage`, and a blocked or full store would otherwise break the page —
instead it falls back to an empty cart and browsing continues.

**Note: synchronisation is within a single page.** Two tabs open at once will not update
each other live (the `storage` event is not used); each tab is correct as of its own
last render or reload.

### Checkout

**Checkout is not connected to any payment system.** The button shows the message:

> Checkout functionality will be available soon.

There is no payment gateway, no order submission, and no simulated payment flow. It is
a placeholder for future backend work (section 20).

A standing note under the order summary says the same thing before the button is even
pressed, so the page never looks like a working checkout:

> This is a front-end demo store. No payment gateway is connected and no order is
> placed — your bag is saved in this browser only.

---

## 10. Wishlist

The wishlist is a list of product IDs in `localStorage` under the key
**`merahaat_wishlist`**:

```json
[1, 7, 22]
```

- Every product card and the detail page have a heart button.
- Clicking it calls `MHStore.toggleWish(id)`, which adds or removes the ID, saves,
  fires `mh:wishchange`, shows a toast and announces the change to screen readers.
- The button's state is exposed with `aria-pressed`, and the heart is filled when saved.
- On every page load, `MHStore.syncWishButtons()` paints the saved state onto whatever
  hearts are on the page — including cards that JavaScript has just rendered.

**Current scope.** The wishlist is a saved list only. There is no dedicated wishlist
page, no count badge in the header, and no way to move an item from the wishlist into
the cart in one step. Like the cart, it belongs to the browser profile, not to a user
account.

---

## 11. Homepage Integration

`index.html` was already complete when this work started, so it was treated as existing
markup and changed as little as possible. Its 24 product cards are still written by
hand — what was added is the wiring:

| Element | Wired to |
|---|---|
| Product card title, image overlay and "View details" | `product.html?id=N` — the card's real product |
| Product card "Add to cart" | `data-add data-id="N"`, handled by `store.js`, so it adds to the real persistent cart |
| Product card heart | The shared wishlist |
| The 8 "Shop by Category" tiles | `products.html?category=jewellery`, `?category=leather`, `?category=kids`, `?category=winter-wear`, `?category=grocery`, `?category=dry-fruits`, `?category=corporate-gifts`, `?category=cosmetic` |
| The 9 mosaic / featured cells | Relevant category or search URLs, e.g. `products.html?q=bag` |
| The 38 category-navigation and mobile-drawer links | Matching category or search URLs, e.g. "Earrings & Zhumki" → `products.html?q=earrings` |
| The logo | `index.html` |
| Header cart icon | `cart.html`, with the live item-count badge |

Each card carries `data-id="N"` matching its product in `products.js`, which is what
lets the shared cart and wishlist code treat hand-written and generated cards
identically. Nothing about the homepage's layout, styling or animation was changed.

---

## 12. Hero Carousel

Five full-width banner slides in `index.html`, driven by `js/main.js`.

**Slide order.** The carousel opens on **Winter Wear**, then advances through
Namkeen & Snacks → Premium Dry Fruits → Oxidized Jewellery → SURMEE Leather, and loops.

The order is pure markup — the five `.hero__slide` elements play top to bottom, and
`main.js` always starts at index 0 whatever that slide happens to be. To reorder them,
move the blocks and keep two things consistent:

- the first slide keeps the `is-active` class and has **no** `loading` attribute, so it
  loads immediately; the other four keep `loading="lazy"`;
- each slide's `aria-label="N of 5"` should match its new position.

**Autoplay interval:** 5500 ms (5.5 seconds).

**Pause behaviour:**

| Event | Result |
|---|---|
| `mouseenter` / `focusin` on the hero | Autoplay stops and a `hovered` flag is set |
| `mouseleave` / `focusout` | `hovered` is cleared and autoplay resumes |
| `touchstart` | Autoplay stops (so a swipe is not fought) |
| `touchend` | Swipe is applied; `hovered` is cleared and autoplay resumes |
| `visibilitychange` → tab hidden | Autoplay stops, so a background tab does no work |
| `visibilitychange` → tab visible | Autoplay resumes, **unless** the pointer is still on the hero |
| Prev / next click, arrow key, dot click | Slide changes; autoplay restarts only if the user is not on the hero |

**Duplicate timer prevention.** Several of those handlers can each ask autoplay to
start, and some fire together — one pointer leaving the hero emits both `mouseleave`
and `focusout`, and a tab that loads in the background gets an extra start from
`visibilitychange`. Without a guard, each call would create another `setInterval` and
the carousel would visibly run at double or triple speed. `start()` therefore refuses
to create a timer when one already exists:

```js
function start() {
  if (!prefersReduced && !timer && !hovered && !document.hidden) {
    timer = setInterval(next, INTERVAL);
  }
}
function stop() { if (timer) { clearInterval(timer); timer = null; } }
```

The `hovered` and `document.hidden` checks close a second gap: returning to a
backgrounded tab used to resume autoplay even though the cursor was still parked on the
banner.

**Accessibility.**

- The carousel is marked with `aria-roledescription="carousel"` and each slide with
  `aria-roledescription="slide"` and `aria-label="N of 5"`.
- The dot controls are `role="tab"` buttons with `aria-selected` and
  `aria-label="Go to slide N"`.
- With the hero focused, **←** and **→** move between slides.
- Basic horizontal swipe support on touch devices (45 px threshold).
- **Reduced motion:** when the operating system requests reduced motion, autoplay never
  starts at all — the first slide simply stays put and the controls still work.

---

## 13. Responsive Design

**Verified at these viewport widths:** **1440 · 1200 · 992 · 768 · 480 · 375 px.**

The CSS itself uses four main breakpoints. Layout is fluid between them, which is why
the widths above all work even though they are not each a breakpoint:

| Breakpoint | What changes |
|---|---|
| **≤ 1080 px** | Container padding tightens; product grids drop from 4 columns to 3; the category tile row reflows. |
| **≤ 900 px** | The desktop category navigation is replaced by the hamburger + mobile drawer; the listing page's filter sidebar becomes a slide-in drawer; the account page collapses from two cards to one with a Login/Register toggle; the product detail page stacks the gallery above the information column. |
| **≤ 620 px** | Grids go to 2 columns; the hero text scales down; the cart switches from a two-column layout to a stacked one; footer columns stack. |
| **≤ 400 px** | Single-column grids, smallest type scale, compact header. |

Supporting queries: `(min-width: 901px)` for desktop-only navigation,
`(max-width: 420px)` for one small-screen adjustment, and `(hover: hover) and
(pointer: fine)` / `(hover: none)` so hover-only effects are not applied on touch
screens.

Fluid techniques used throughout: `width: min(100% - 2.5rem, var(--container))` for the
page container, `clamp()` for type scales, `grid-template-columns:
repeat(auto-fill, minmax(…, 1fr))` for card grids, and `aspect-ratio` on images so
nothing jumps as pictures load.

---

## 14. Accessibility

Everything listed here is implemented in the code.

**Structure**

- One `<h1>` per page. On `index.html` it is visually hidden (using the existing
  `.visually-hidden` utility) because the design's first visible heading is a hero
  slide title; the heading is still in the accessibility tree.
- Semantic landmarks on every page: `<header>`, `<nav aria-label="…">`, `<main id="main">`,
  `<footer>`.
- A **skip-to-content** link as the first focusable element on all five pages.
- `<html lang="en">`, a `<title>` and a `<meta name="description">` on every page. On the
  detail page the title is updated to the product name.

**Images and controls**

- All 55 `<img>` elements have an `alt` attribute. Decorative images (the logo, thumbnail
  images inside labelled buttons) use `alt=""` deliberately; the gallery's main image gets
  a generated `alt` such as `"<product name> — photo 2 of 3"`.
- Every icon-only button has an `aria-label` (cart, wishlist, hamburger, carousel arrows,
  quantity stepper, gallery thumbnails).
- Toggle buttons expose state: `aria-pressed` on wishlist hearts and gallery thumbnails,
  `aria-expanded` on the hamburger, `aria-selected` on carousel dots and account tabs.
- Filter groups are real `<fieldset>` + `<legend>` with labelled radio inputs. Every
  form input has an associated `<label>` (visually hidden where the design has no room
  for one).

**Keyboard**

- All interactive elements are native `<button>` / `<a>` / `<input>`, so they are
  focusable and operable by keyboard by default.
- A global `:focus-visible` outline, plus a custom rule for the styled radio buttons.
- Carousel: **←** / **→** when the hero is focused.
- Gallery thumbnails: **←** **→** **↑** **↓** **Home** **End**, wrapping at the ends.
- Mobile drawer and filter drawer: focus moves into the drawer on open, **Escape**
  closes it, and focus returns to the button that opened it. Body scrolling is locked
  while a drawer is open.
- Account page reset-password modal: focus moves to the email field when it opens, is
  trapped inside the modal while it is open, **Escape** and an overlay click both close
  it, and focus returns to the "Forgot password?" link that opened it.
- Product cards expose exactly four tab stops — wishlist, Add to cart, View details,
  title link. The invisible full-card overlay link is excluded with `tabindex="-1"` and
  `aria-hidden="true"` so keyboard users do not hit a duplicate.

**Announcements**

- A shared `role="status" aria-live="polite"` region on every page announces cart and
  wishlist changes ("… added to cart. 3 in cart.").
- The listing page announces its result count; the cart page announces the free-shipping
  status; the checkout button announces its message.

**Reduced motion**

- `@media (prefers-reduced-motion: reduce)` blocks exist in **all six** stylesheets.
- In JavaScript, `matchMedia("(prefers-reduced-motion: reduce)")` is checked before
  starting carousel autoplay, scroll reveals, count-up numbers, the fly-to-cart
  animation, magnetic buttons, hero sparkles, row-removal animations and smooth scrolling.

**Not verified.** No automated audit (axe, Lighthouse) or screen-reader testing has been
run; the checks above were made by inspecting the DOM and driving the pages by keyboard.
Colour-contrast ratios have not been measured.

---

## 15. Performance Considerations

| Technique | Where |
|---|---|
| **Deferred scripts** | All 29 `<script>` tags use `defer`, so parsing is never blocked and execution order stays predictable. |
| **Lazy-loaded images** | 48 of 55 images use `loading="lazy"`. The 7 that do not are the header logo on each page, the first hero slide, and the gallery's main image — all above the fold. |
| **Image fallbacks** | Every photograph carries `onerror="this.onerror=null; this.src='…svg'"`, so a missing JPG falls back to its SVG twin instead of showing a broken image. `this.onerror=null` prevents an infinite retry loop. |
| **Batched DOM updates** | Grids and cart lists are built as a single HTML string and written once, rather than appending elements one at a time. |
| **`IntersectionObserver`** | Scroll reveals and count-up numbers fire when the element enters the viewport, and the observer unobserves each element after firing — no scroll listener doing layout work. |
| **`requestAnimationFrame` throttling** | The scroll-progress bar, sticky header and parallax fallback all run through a `rafThrottle` helper, so they update at most once per frame. |
| **Passive listeners** | Touch and scroll listeners are registered with `{ passive: true }` so they cannot delay scrolling. |
| **Pagination** | The listing page renders 12 cards at a time instead of all 37. |
| **Background tab** | Carousel autoplay stops when the tab is hidden. |
| **Cheap animations** | Animations use `transform` and `opacity` only, with `will-change` applied sparingly. |
| **`aspect-ratio` + `width`/`height`** | Images reserve their space, so the layout does not shift as they load. |
| **Optional CDN layer** | GSAP is an enhancement. If it is blocked, nothing waits on it and nothing breaks. |

Not done: no image compression pass, no WebP/AVIF versions, no CSS/JS minification, no
sprite sheets, no caching headers (the dev server sets none). See section 20.

---

## 16. How to Run Locally

The project is static, so it only needs to be served as a folder.

### Option A — a local HTTP server (recommended)

1. Open a terminal in the project folder (`Meerahaat/`).
2. Start Python's built-in server:

```bash
python -m http.server 8766
```

3. Open <http://localhost:8766> in a browser.

Any static server works equally well — for example:

```bash
npx serve .
```

or VS Code's "Live Server" extension. The port number is arbitrary; `8766` is just the
one used during development.

Pages: `/` · `/products.html` · `/product.html?id=1` · `/cart.html` · `/account.html`

### Option B — open the file directly

Double-click `index.html`. Everything renders and the catalog works, because there are
no `fetch()` calls and no modules.

Two caveats when using `file://`: browsers may block the Google Fonts and GSAP requests
(the built-in fallbacks handle that), and some browsers restrict `localStorage` on
`file://`, which would make the cart forget itself between pages. Use Option A if you
see that.

### A note on tooling

The repository contains no launch scripts, task runners or editor configuration, and the
application does not depend on any development tool. The command in Option A is the whole
setup. (A local Claude Code launch config was used during development; it is excluded
from the repository by `.gitignore` and only ran the same `python -m http.server 8766`
command shown above.)

---

## 17. How to Add a New Product

1. **Open `js/products.js`.** The file header contains a commented template; the
   `PRODUCTS` array is below it.
2. **Copy the template** (or the last object in the array) and paste it as a new entry.
3. **Assign the next available ID.** The highest current ID is `37`, so use `38`. IDs
   must be unique numbers.
4. **Fill in the product information:**
   - `name` — the full product title.
   - `category` — an existing category name, or a new one (it will appear in the filter
     automatically). Add it to `CATEGORY_ORDER` if you want it in a specific position.
   - `price`, `originalPrice`, `discount` — numbers. Use `null` for `originalPrice` and
     `0` for `discount` when there is no offer.
   - `rating`, `reviews` — numbers.
   - `description` — one or two sentences. This text is searchable.
   - `specs` — an object of label/value pairs for the detail-page table. Quote any key
     containing a space, e.g. `"Shelf life": "6 months"`.
   - `inStock` — `true` or `false`.
   - `badge` — `""`, or a short label such as `"New"`.
   - `added` — an ISO date, `"YYYY-MM-DD"`, used by the "Newest First" sort.
5. **Add the image.** Put the photograph in `assets/img/photos/` and point `image` at it,
   e.g. `"assets/img/photos/p-my-product.jpg"`. List it first in `images`, followed by
   any additional gallery shots. If you also place an SVG with the same base name in
   `assets/img/` (`assets/img/p-my-product.svg`), it is used automatically as the
   fallback if the JPG is ever missing — no extra field is needed.
6. **Save the file.**
7. **Run the application** (section 16) and hard-reload so the browser does not serve a
   cached `products.js`.
8. **Verify:**
   - it appears on `products.html`;
   - its category shows an increased count in the sidebar, and filtering by that
     category includes it;
   - searching for a word from its name or description finds it;
   - each sort option places it sensibly;
   - `product.html?id=38` shows the full detail page with the gallery and specs;
   - it appears in the "related products" strip of another product in the same category;
   - "Add to cart" increments the badge, and the cart page shows the right line total.

### Derived automatically

You do **not** need to edit any other file. These are all computed from the array:

- the listing grid and its result count
- the category list, its slugs and its counts
- search matching, price/rating filtering and all five sort orders
- the detail page URL and its entire content
- related-product strips
- the card HTML (one shared `renderProductCard()` function)
- the `onerror` image fallback path
- cart line totals, subtotal and shipping

### Known limitation: the homepage grids

`index.html`'s two product grids (24 cards) are still **hand-written HTML**. That page
existed before this catalog system and was deliberately not rebuilt. A new product
therefore appears everywhere *except* those two homepage grids.

To feature a new product on the homepage you have two options:

- **Link to it** from a category tile or navigation item (no new markup needed), or
- **Copy an existing `<article class="card">` block** in `index.html`, then update its
  `data-id`, both `product.html?id=N` links, the image `src`/`onerror`/`alt`, the title,
  the price and the rating to match the new product.

Converting those grids to render from `products.js` is listed as future work
(section 20).

---

## 18. Current Features

- [x] Centralised product data (37 products in one file)
- [x] Product listing page rendered from data
- [x] Product search (name, category, description)
- [x] Category filtering, with counts derived from the data
- [x] Price-range filtering (5 bands)
- [x] Rating filtering (4.5+, 4.0+, 3.0+)
- [x] Sorting (Featured, price ascending/descending, rating, newest)
- [x] "Show more" pagination, 12 products per page
- [x] Empty state with a "Clear all filters" action
- [x] Filter state synchronised with the URL (shareable and bookmarkable)
- [x] Single product detail page driven by `?id=`
- [x] "Product not found" handling for invalid IDs
- [x] Image gallery with thumbnails, keyboard navigation and hover zoom
- [x] Specification table
- [x] Related products
- [x] Add to cart, from the homepage, the listing and the detail page
- [x] Quantity stepper with 1–99 clamping
- [x] Cart page with line items, remove, and clear-all
- [x] Subtotal, savings, shipping and total calculation
- [x] Free shipping above ₹1,499
- [x] Cart badge in the header of every page
- [x] Wishlist with persistent saved state
- [x] `localStorage` persistence for cart and wishlist, with error handling
- [x] Responsive layouts (375 px – 1440 px)
- [x] Hero carousel with autoplay, pause behaviour and swipe
- [x] Mobile navigation drawer and mobile filter drawer
- [x] Accessibility: landmarks, labels, keyboard support, live regions, reduced motion
- [x] Image fallbacks so no broken image is ever shown
- [x] Account page with client-side (format-only) form validation

Not working / not built — see section 19:

- [ ] Checkout and payment
- [ ] Real user accounts
- [ ] Order history
- [ ] Dedicated wishlist page
- [ ] Admin product management
- [ ] Homepage grids rendered from product data

---

## 19. Current Limitations

These are honest, known limitations of a frontend-only build.

**Architecture**

1. **No backend or API.** Nothing is served dynamically. All logic runs in the browser.
2. **No database.** The 37 products are a JavaScript array. Changing a product means
   editing `js/products.js` and redeploying the files.
3. **No authentication.** `account.html` validates format only (non-empty required
   fields, a valid email pattern, password of at least 6 characters), shows a spinner,
   then redirects to `index.html`. No credentials are stored, hashed or transmitted, and
   there is no session. Logging in grants nothing.
4. **No payment processing.** Checkout displays "Checkout functionality will be available
   soon." There is no gateway and no simulated order flow — deliberately, so nothing can
   be mistaken for a working transaction.
5. **No order management.** There is no order, no confirmation and no history.
6. **No stock management.** `inStock` is a static boolean in the data. Adding an item to
   the cart does not decrement anything, and nothing prevents ordering more than exists.
7. **No tax engine.** No GST or tax line is calculated. Shipping is a single rule (free
   above ₹1,499, otherwise ₹79) rather than a rate table.
8. **No coupon redemption.** The codes shown in the offer bar (e.g. `MH0005`) are
   display-only text, as on the original site. There is no field to enter one and no
   discount logic.

**Data scope**

9. **Cart and wishlist are browser-local.** They live in `localStorage`, so they belong
   to one browser profile on one device. They do not follow a user to another device or
   browser, are not tied to an account, and are lost if site data is cleared.
10. **No live sync between tabs.** Two tabs open at once will not update each other; each
    is correct as of its own last render.
11. **Ratings and review counts are illustrative.** The source site showed `0 reviews` on
    every product, which would make the rating filter and the rating sort meaningless, so
    plausible values were used instead. **Prices, original prices and discount
    percentages are the real ones.** There is no review system — no one can submit a
    review.
12. **Product photographs are openly-licensed placeholders**, sourced from Wikimedia
    Commons and LoremFlickr and stored locally in `assets/img/photos/`. They are suitable
    for a demo. **Before production use, replace them with Merahaat's own product
    photography, or verify each file's licence and attribution.** Two decorative mosaic
    tiles intentionally use the SVG placeholders.

**Content**

13. **Placeholder links remain.** Roughly 21–24 links per page still point at `href="#"`:
    the footer's informational pages (About us, Privacy Policy, Terms and Conditions,
    Shipping Policy, Help & FAQs, Blog, Contact Us, Track Orders, Technical Support, B2B,
    Corporate Business, Sell on Merahaat, Become a Franchise), the five social icons, the
    "Download the app" and "Download Catalogue" links, and the coupon-code links. Those
    pages and accounts do not exist yet, and no URLs were invented for them. The WhatsApp
    float links to `https://wa.me/` with no number for the same reason. **These need real
    destinations before the site goes live.**
14. **Homepage product grids are hand-maintained.** `index.html`'s 24 cards are written in
    HTML rather than generated, so a new product in `products.js` does not appear there
    automatically (section 17 explains the workaround).

**Code / tooling**

15. **No automated tests.** All verification was manual, through a browser.
16. **No automated accessibility or performance audit.** No axe, Lighthouse or
    screen-reader testing has been run, and colour contrast has not been measured.
17. **No production build.** Assets are unminified and uncompressed; images are the
    original JPG/SVG files with no WebP/AVIF alternatives.
18. **Two external CDN requests** (Google Fonts, GSAP). Both degrade gracefully, but an
    offline-first deployment would want them hosted locally.
19. **`product.html` contains two `<h1>` elements** in the source — the product title and
    the "Product not found" heading. Only one is ever rendered or reachable at runtime,
    because the unused panel carries the `hidden` attribute, so this is a source-level
    HTML-validator complaint rather than a user-facing problem. Splitting the not-found
    state into its own page would remove it.

---

## 20. Future Improvements

None of the following is implemented. This is a list of realistic next steps, in
roughly the order they would be worth doing.

**Make the data dynamic**

1. **Backend API.** Replace `js/products.js` with an HTTP endpoint (`GET /api/products`,
   `GET /api/products/:id`). Because every page already goes through
   `MHProducts.all()` / `byId()`, only those helpers would need to change.
2. **Database.** Store products, categories, stock and prices properly instead of in a
   file.
3. **Admin product management.** A protected page to create, edit and retire products,
   including image upload — replacing the "edit a JavaScript file" workflow.
4. **Render the homepage grids from product data**, removing the last hand-written cards
   and the limitation in section 17.

**Make accounts and orders real**

5. **Authentication.** Real registration and login, server-side validation, password
   hashing, sessions or tokens, and email verification.
6. **User-specific carts and wishlists.** Persist them server-side against the account so
   they follow the user between devices, using the current `localStorage` cart as the
   guest fallback and merging it on login.
7. **Real checkout.** Address entry, shipping-method selection, order review and
   confirmation.
8. **Payment gateway integration** (for example Razorpay, Stripe or PayU), with the
   secret key held server-side only.
9. **Order management.** Order records, status tracking, invoices, and an order-history
   page.
10. **Inventory management.** Real stock levels, decrement on order, and out-of-stock
    handling driven by data.

**Improve the storefront**

11. **Product reviews and ratings** submitted by real customers, replacing the current
    illustrative values.
12. **Coupon engine** so the codes in the offer bar actually apply a discount.
13. **Tax and shipping rules** — GST calculation and a real rate table by weight or
    destination.
14. **A dedicated wishlist page**, a wishlist count badge, and "move to cart".
15. **Build out the placeholder pages** listed in section 19 (About, Privacy Policy,
    Terms, Shipping Policy, FAQs, Contact) and add real social links.

**Engineering and delivery**

16. **Image optimisation.** Compress the photographs, generate WebP/AVIF, add
    `srcset`/`sizes` for responsive sources, and replace the placeholder stock photos
    with licensed product photography.
17. **Automated tests.** Unit tests for the data helpers and cart maths, plus
    browser-level tests for the main user journeys.
18. **Automated audits in CI.** Lighthouse and axe for performance and accessibility
    regressions.
19. **Production deployment.** Host the folder on static hosting (GitHub Pages, Netlify,
    Vercel, S3 + CloudFront), serve over HTTPS with cache headers, and self-host the
    fonts and GSAP.
20. **Structured data and SEO.** `Product` JSON-LD, Open Graph tags, a sitemap and
    `robots.txt`.

---

## 21. Development Notes

Implementation decisions worth knowing before changing the code.

**One data file, referenced by ID everywhere.** The rule that shaped everything else:
product information exists in exactly one place. The cart stores `{id, qty}`, the
wishlist stores IDs, URLs carry `?id=`, homepage cards carry `data-id`. Nothing caches a
name or price, so nothing can go stale.

**Products 1–24 mirror the homepage.** The 24 cards already in `index.html` were mapped
to IDs 1–24 in document order, and each card's title was checked against the dataset. The
dataset holds 37 products rather than the ~20 originally sketched, so that all 24 cards
have a real product *and* every category tile leads to a non-empty listing.

**One card renderer.** `MHStore.renderProductCard()` produces exactly the same markup as
the hand-written homepage cards — the same `.card`, `.card__media`, `.badge`, `.stars`
and `.card__actions` classes. That is why the listing page, the related-products strip
and the homepage all share hover zoom, the shine sweep, the discount pulse, the skeleton
shimmer and fly-to-cart without any duplicated CSS. After injecting cards,
`hydrateCards()` re-runs the image-load watcher and the reveal observer on just the new
nodes, so generated cards animate like static ones.

**Event delegation instead of per-card listeners.** `store.js` installs a single `click`
listener on `document` that matches `[data-add]`, `[data-buy-now]`, `.wish`, `.qty__btn`
and `[data-remove]`. Cards rendered after page load therefore work with no extra wiring,
and there is nothing to unbind when a grid is re-rendered.

**`main.js` yields to `store.js`.** `main.js` predates the cart and still contains its
original visual-only add-to-cart and wishlist code. Rather than delete it (it is the
fallback if `store.js` is ever absent), those blocks begin with
`if (window.MHStore) return;` and the wishlist injector skips any card that already has a
heart. This is why `defer` ordering matters: `store.js` must have defined `window.MHStore`
before `main.js` decides. The result is exactly one cart code path and one wishlist code
path.

**`CustomEvent` instead of shared state.** `mh:cartchange` and `mh:wishchange` let the
badge, the cart page and the hearts stay in step without importing each other. The cart
page re-renders on the event and deliberately restores focus to the stepper button that
was just pressed, so keyboard and screen-reader users are not thrown to the top of the
page after every `+`.

**Defensive reads, not defensive writes.** `getCart()` filters out lines whose product no
longer exists and clamps quantities on the way out of storage, and `readJSON()` swallows
parse errors and returns an empty array. Corrupt or blocked storage degrades to an empty
cart rather than an exception.

**URL parsing is guarded.** `URLSearchParams` already percent-decodes values, so
`findCategory()` treats a further `decodeURIComponent()` as best-effort inside a
`try`/`catch`. Without that, a URL such as `products.html?category=100%` throws
`URIError: URI malformed` and takes the whole listing script down with it. `byId()`
coerces with `Number()` for the same reason — any unusable `?id=` becomes `undefined` and
triggers the "Product not found" panel.

**All generated HTML is escaped.** `MHStore.esc()` escapes `& < > " '` and is applied to
every value interpolated into a template string, including the search term echoed back in
the empty state. Product data is trusted, but the search term comes from the URL.

**The carousel has one timer, by construction.** Autoplay start is guarded on `!timer`,
`!hovered` and `!document.hidden`, because six different lifecycle events can each ask it
to start and several fire together. See section 12.

**Category slugs handle `&`.** `Namkeen & Snacks` becomes `namkeen-snacks`, and
`findCategory()` accepts a slug or a display name in any capitalisation, so links, filters
and the URL all agree.

**Design tokens were not touched.** Every colour, font, space, radius, shadow and easing
is a CSS custom property in `:root` at the top of `css/styles.css`. The five other
stylesheets are layout-only layers built on those tokens — there is no second design
system and no hard-coded colour. Re-theming is a change in one block.

**GSAP is an enhancement, not a dependency.** `js/main.js` section 13 checks
`typeof window.gsap` and a reduced-motion preference before doing anything, and every
GSAP effect has a vanilla `IntersectionObserver`/CSS equivalent already running. Deleting
the two CDN `<script>` tags removes some scroll-linked parallax and breaks nothing. An
earlier version used the Lenis smooth-scroll library; it was removed because it
interfered with trackpad scrolling. Scrolling is now always native — GSAP ScrollTrigger
only *reads* the scroll position.

**Progressive enhancement throughout.** `index.html` renders its full content with
JavaScript disabled. Images fall back from JPG to SVG. Fonts fall back to a system stack.
Reveal animations default to visible when `IntersectionObserver` is unavailable.

**`[hidden]` is enforced globally in `css/styles.css`.** Several containers are shown and
hidden from JavaScript with the `hidden` attribute (`#pdp`, `#cartLayout`, `#productGrid`,
`#resetModal`), but their own classes set `display: grid` or `display: flex`. A class
selector and the browser's default `[hidden] { display: none }` have the same specificity,
so the class won on source order and the "hidden" block stayed laid out — an empty cart
still rendered the order summary, and `product.html?id=999` left a full-height blank gap
above "Product not found". One rule in the utilities section fixes all of them:

```css
[hidden] { display: none !important; }
```

`!important` is needed because `styles.css` loads before the page stylesheets, so without
it the later `.pdp` / `.cartlayout` rules would still win the tie.

**The reset-password modal focuses on the second frame, not the first.** `.modal-overlay`
transitions `visibility`, so on the tick the `.show` class is added the computed value is
still `visibility: hidden` — and a `visibility: hidden` element cannot take focus, so a
synchronous `focus()` call silently does nothing and the keyboard is left behind the
overlay. A single `requestAnimationFrame` is also too early (it runs before the style
recalc), and so is `setTimeout(0)`. Two nested `requestAnimationFrame` calls land after
the recalc, while the 300 ms fade is still playing, so focus arrives with nothing visible
out of place. See `open()` in `js/account.js` section 9.

**`cartSubtotal()` is intentionally unused by `cart.js`.** It exists as the natural
companion to `cartCount()` and `cartLines()` in the public API, but the cart page already
holds the `cartLines()` array and reduces it once for the subtotal, savings and unit count
together, which is cheaper than calling back into the store.
