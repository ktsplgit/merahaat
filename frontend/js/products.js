/* =============================================================
   MERAHAAT — products.js
   THE SINGLE SOURCE OF TRUTH for every product in the storefront.

   Nothing else in the project stores product names, prices or images.
   The homepage cards, the listing page (products.html), the detail page
   (product.html) and the cart (cart.html) all read from this one array.

   ---------------------------------------------------------------
   HOW TO ADD A PRODUCT
   ---------------------------------------------------------------
   Copy the block below, paste it at the end of the PRODUCTS array,
   and give it an `id` that is not already used:

     {
       id: 38,
       name: "Product name shown to shoppers",
       category: "Jewellery",          // must be one of CATEGORY_ORDER
       price: 999,                     // selling price (number, ₹)
       originalPrice: 1299,            // null if there is no discount
       discount: 23,                   // 0 if there is no discount
       rating: 4.5,                    // 0 – 5 (halves are fine)
       reviews: 24,
       image: "assets/img/photos/p-thing.jpg",   // main / card image
       images: [                       // gallery. 1 image is fine.
         "assets/img/photos/p-thing.jpg",
         "assets/img/photos/cat-jewellery.jpg"
       ],
       description: "One or two sentences.",
       specs: { Material: "Brass", Weight: "40 g" },   // optional
       inStock: true,
       badge: "Best Seller",           // optional extra pill, "" for none
       added: "2026-08-20"             // used by the "Newest" sort
     }

   That is the only edit needed — every page picks it up automatically.

   ---------------------------------------------------------------
   IMAGES
   ---------------------------------------------------------------
   Every path below points at a file that already exists in
   assets/img/. The `.jpg` photographs live in assets/img/photos/ and
   each one has an on-brand `.svg` twin in assets/img/ that is used as
   an automatic <img onerror> fallback (see MHStore.fallbackFor).
   Gallery arrays reuse the matching category / hero photography as a
   second "in context" shot — swap those for real alternate angles
   when the photography exists.
   ============================================================= */
(function () {
  "use strict";

  /* Display order for the category filter — mirrors the homepage
     "Shop by Category" tiles, then the remaining catnav categories. */
  const CATEGORY_ORDER = [
    "Jewellery",
    "Leather",
    "Kids",
    "Winter Wear",
    "Grocery",
    "Dry Fruits",
    "Corporate Gifts",
    "Cosmetic",
    "Namkeen & Snacks",
    "Puja"
  ];

  const PRODUCTS = [
    /* ---------- LEATHER — the SURMEE wallet range (homepage "Top Products") ---------- */
    {
      id: 1,
      name: "SURMEE Premium Black Bifold Leather Wallet for Men",
      category: "Leather",
      price: 240,
      originalPrice: 400,
      discount: 40,
      rating: 4.5,
      reviews: 38,
      image: "assets/img/photos/p-wallet-black.jpg",
      images: [
        "assets/img/photos/p-wallet-black.jpg",
        "assets/img/photos/cat-leather.jpg",
        "assets/img/photos/hero-leather.jpg"
      ],
      description:
        "A slim bifold cut from full-grain leather and finished by hand. Six card slots, two currency compartments and a hidden pocket keep everyday essentials tidy without adding bulk.",
      specs: {
        Material: "Genuine full-grain leather",
        Closure: "Bifold",
        "Card slots": "6",
        Dimensions: "11.5 × 9.5 cm",
        Warranty: "6 months against manufacturing defects"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-05-14"
    },
    {
      id: 2,
      name: "SURMEE Premium Bifold Leather Dark Blue Wallet for Men",
      category: "Leather",
      price: 499,
      originalPrice: 650,
      discount: 23,
      rating: 4.4,
      reviews: 21,
      image: "assets/img/photos/p-wallet-blue.jpg",
      images: [
        "assets/img/photos/p-wallet-blue.jpg",
        "assets/img/photos/cat-leather.jpg"
      ],
      description:
        "Deep indigo leather with contrast stitching and a soft suede lining. The RFID-safe card bay sits flush so the wallet stays flat in a back pocket.",
      specs: {
        Material: "Genuine leather",
        Closure: "Bifold",
        "Card slots": "8",
        Dimensions: "11.5 × 9.5 cm"
      },
      inStock: true,
      badge: "",
      added: "2026-05-14"
    },
    {
      id: 3,
      name: "SURMEE Men's Classic Genuine Leather Wallet with Coin Pocket",
      category: "Leather",
      price: 499,
      originalPrice: 650,
      discount: 23,
      rating: 4.3,
      reviews: 17,
      image: "assets/img/photos/p-wallet-classic.jpg",
      images: [ 
        "assets/img/photos/p-wallet-classic.jpg",
        "assets/img/photos/cat-leather.jpg"
      ],
      description:
        "The classic shape, with a zipped coin pocket along the spine. Vegetable-tanned leather that darkens beautifully with use.",
      specs: {
        Material: "Vegetable-tanned leather",
        Closure: "Bifold with zip coin pocket",
        "Card slots": "6",
        Dimensions: "12 × 9.5 cm"
      },
      inStock: true,
      badge: "",
      added: "2026-05-10"
    },
    {
      id: 4,
      name: "SURMEE Genuine Leather Men's Classic Fold Wallet",
      category: "Leather",
      price: 650,
      originalPrice: null,
      discount: 0,
      rating: 4.6,
      reviews: 12,
      image: "assets/img/photos/p-wallet-fold.jpg",
      /* Deliberately a single-image product — proves the gallery
         degrades cleanly when alternate shots do not exist yet. */
      images: ["assets/img/photos/p-wallet-fold.jpg"],
      description:
        "A structured fold wallet with a reinforced spine, built to hold its shape for years. Hand-burnished edges, no raw seams.",
      specs: {
        Material: "Genuine leather",
        Closure: "Fold",
        "Card slots": "4",
        Dimensions: "11 × 9 cm"
      },
      inStock: true,
      badge: "New",
      added: "2026-06-02"
    },
    {
      id: 5,
      name: "SURMEE Men's Genuine Leather Classic Bi-Fold Wallet",
      category: "Leather",
      price: 499,
      originalPrice: 650,
      discount: 23,
      rating: 4.2,
      reviews: 9,
      image: "assets/img/photos/p-wallet-bifold.jpg",
      images: [
        "assets/img/photos/p-wallet-bifold.jpg",
        "assets/img/photos/cat-leather.jpg"
      ],
      description:
        "An everyday bifold in warm tan leather. Two note sleeves, a clear ID window and enough give to break in comfortably within a week.",
      specs: {
        Material: "Genuine leather",
        Closure: "Bifold",
        "Card slots": "6",
        Extras: "ID window"
      },
      inStock: true,
      badge: "",
      added: "2026-05-08"
    },
    {
      id: 6,
      name: "SURMEE Men's Premium Genuine Leather Dark Wallet",
      category: "Leather",
      price: 499,
      originalPrice: 650,
      discount: 23,
      rating: 4.5,
      reviews: 26,
      image: "assets/img/photos/p-wallet-dark.jpg",
      images: [
        "assets/img/photos/p-wallet-dark.jpg",
        "assets/img/photos/cat-leather.jpg",
        "assets/img/photos/hero-leather.jpg"
      ],
      description:
        "Espresso-dark leather with a matte finish that hides scuffs. The slimmest wallet in the SURMEE range at just 11 mm when filled.",
      specs: {
        Material: "Genuine leather",
        Closure: "Bifold",
        Thickness: "11 mm filled",
        "Card slots": "6"
      },
      inStock: true,
      badge: "Trending",
      added: "2026-05-08"
    },

    /* ---------- homepage "Featured Products" ---------- */
    {
      id: 7,
      name: "Roasted Salted Almonds Badam — 250gms",
      category: "Dry Fruits",
      price: 282,
      originalPrice: 434,
      discount: 35,
      rating: 4.6,
      reviews: 54,
      image: "assets/img/photos/p-almonds.jpg",
      images: [
        "assets/img/photos/p-almonds.jpg",
        "assets/img/photos/cat-dryfruits.jpg",
        "assets/img/photos/hero-dryfruit.jpg"
      ],
      description:
        "California almonds dry-roasted in small batches and lightly salted — no oil, no preservatives. Sealed the same day they are roasted so they stay audibly crisp.",
      specs: {
        "Net weight": "250 g",
        Ingredients: "Almonds, iodised salt",
        "Shelf life": "6 months from packing",
        Storage: "Cool, dry place; refrigerate after opening"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-06-18"
    },
    {
      id: 8,
      name: "Woolen Ponchos For Girls And Women",
      category: "Winter Wear",
      price: 1300,
      originalPrice: 4333.33,
      discount: 70,
      rating: 4.3,
      reviews: 31,
      image: "assets/img/photos/p-poncho.jpg",
      images: [
        "assets/img/photos/p-poncho.jpg",
        "assets/img/photos/cat-winter.jpg",
        "assets/img/photos/hero-winter.jpg"
      ],
      description:
        "A free-size woolen poncho with a soft fringed hem — warm enough for a Delhi December, light enough to layer over a kurta. Woven in Ludhiana.",
      specs: {
        Material: "70% wool, 30% acrylic blend",
        Size: "Free size (fits XS–XL)",
        Care: "Dry clean recommended",
        "Made in": "Ludhiana, India"
      },
      inStock: true,
      badge: "Limited Stock",
      added: "2026-06-18"
    },
    {
      id: 9,
      name: "Ethereal Glow Silver Oxidized Black Color Dangler Earrings",
      category: "Jewellery",
      price: 220,
      originalPrice: 733,
      discount: 70,
      rating: 4.4,
      reviews: 47,
      image: "assets/img/photos/p-earrings-black.jpg",
      images: [
        "assets/img/photos/p-earrings-black.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Oxidised silver-look danglers set with jet-black stones and finished with tiny ghungroo bells. Feather-light, so they are comfortable through a full wedding function.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Black cubic zirconia",
        Length: "6.5 cm",
        Weight: "14 g per pair",
        Closure: "Push-back"
      },
      inStock: true,
      badge: "",
      added: "2026-06-20"
    },
    {
      id: 10,
      name: "Dry Fruit Combo Pack — 2.9 Kgs Pack Of 6 (500×5 + 400gms)",
      category: "Dry Fruits",
      price: 2965,
      originalPrice: 4562,
      discount: 35,
      rating: 4,
      reviews: 1,
      image: "assets/img/photos/p-combo.jpg",
      images: [
        "assets/img/photos/p-combo.jpg",
        "assets/img/photos/cat-dryfruits.jpg",
        "assets/img/photos/m-basket.jpg"
      ],
      description:
        "Six sealed pouches — almonds, cashews, pistachios, raisins, walnuts and apricots — adding up to 2.9 kg. The most economical way to stock a festive pantry.",
      specs: {
        "Net weight": "2.9 kg total (5 × 500 g + 1 × 400 g)",
        Contents: "Almonds, cashews, pistachios, raisins, walnuts, apricots",
        Packaging: "Food-grade resealable pouches",
        "Shelf life": "6 months from packing"
      },
      inStock: true,
      badge: "Value Pack",
      added: "2026-06-12"
    },
    {
      id: 11,
      name: "Aloo Bhujia Namkeen (400GM)",
      category: "Namkeen & Snacks",
      price: 99,
      originalPrice: 198,
      discount: 50,
      rating: 4.5,
      reviews: 62,
      image: "assets/img/photos/p-aloobhujia.jpg",
      images: [
        "assets/img/photos/p-aloobhujia.jpg",
        "assets/img/photos/hero-namkeen.jpg"
      ],
      description:
        "Fine potato bhujia fried in groundnut oil and seasoned the Bikaneri way — a little tangy, a little hot, impossible to stop at one handful.",
      specs: {
        "Net weight": "400 g",
        Ingredients: "Potato, gram flour, groundnut oil, spices, salt",
        Allergens: "Contains peanuts",
        "Shelf life": "4 months from packing"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-06-25"
    },
    {
      id: 12,
      name: "Navratan Mix (200GM)",
      category: "Namkeen & Snacks",
      price: 50,
      originalPrice: 100,
      discount: 50,
      rating: 4.2,
      reviews: 28,
      image: "assets/img/photos/p-navratan.jpg",
      images: [
        "assets/img/photos/p-navratan.jpg",
        "assets/img/photos/hero-namkeen.jpg"
      ],
      description:
        "Nine ingredients in one mix — sev, boondi, peanuts, cornflakes, green peas, raisins and three kinds of dal. Sweet, salty and crunchy in the same mouthful.",
      specs: {
        "Net weight": "200 g",
        Ingredients: "Gram flour, peanuts, cornflakes, green peas, raisins, lentils, spices",
        Allergens: "Contains peanuts",
        "Shelf life": "4 months from packing"
      },
      inStock: true,
      badge: "",
      added: "2026-06-25"
    },
    {
      id: 13,
      name: "Twilight Serenade Silver Oxidized Green Color Chokar Necklace Set",
      category: "Jewellery",
      price: 780,
      originalPrice: 2600,
      discount: 70,
      rating: 4.7,
      reviews: 35,
      image: "assets/img/photos/p-necklace-green.jpg",
      images: [
        "assets/img/photos/p-necklace-green.jpg",
        "assets/img/photos/cat-jewellery.jpg",
        "assets/img/photos/hero-jewellery.jpg"
      ],
      description:
        "A choker-length collar of oxidised silver-look panels set with emerald-green stones, with matching earrings. An adjustable dori at the back takes it from a snug choker to a mid-length necklace.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Green kundan-style glass",
        "Set includes": "Necklace + 1 pair earrings",
        Length: "Adjustable 34–46 cm",
        Weight: "78 g"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-06-14"
    },
    {
      id: 14,
      name: "Cashew Kernels Whole Kaju W 240 — 1kg",
      category: "Dry Fruits",
      price: 982,
      originalPrice: 1511,
      discount: 35,
      rating: 4,
      reviews: 1,
      image: "assets/img/photos/p-cashew.jpg",
      images: [
        "assets/img/photos/p-cashew.jpg",
        "assets/img/photos/cat-dryfruits.jpg",
        "assets/img/photos/hero-dryfruit.jpg"
      ],
      description:
        "Grade W240 whole kernels from Kerala — large, pale and unbroken, the grade halwais buy. Raw and unsalted, so they work for both cooking and snacking.",
      specs: {
        "Net weight": "1 kg",
        Grade: "W240 (whole, 240 kernels per lb)",
        Origin: "Kollam, Kerala",
        "Shelf life": "6 months from packing"
      },
      inStock: true,
      badge: "",
      added: "2026-06-10"
    },
    {
      id: 15,
      name: "Oxidised Elegant Black Color Long Necklace Set with Pearl Beads",
      category: "Jewellery",
      price: 1980,
      originalPrice: 6600,
      discount: 70,
      rating: 4.8,
      reviews: 19,
      image: "assets/img/photos/p-necklace-long.jpg",
      images: [
        "assets/img/photos/p-necklace-long.jpg",
        "assets/img/photos/cat-jewellery.jpg",
        "assets/img/photos/hero-jewellery.jpg"
      ],
      description:
        "A long rani-haar style layered necklace strung with freshwater-look pearl beads and black stone motifs. The statement piece for a heavy silk saree.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Beads: "Shell pearls",
        "Set includes": "Necklace + 1 pair earrings",
        Length: "62 cm",
        Weight: "142 g"
      },
      inStock: true,
      badge: "Premium",
      added: "2026-06-08"
    },
    {
      id: 16,
      name: "Timeless Elegance Silver Oxidized Multi Color Chokar Necklace",
      category: "Jewellery",
      price: 720,
      originalPrice: 2400,
      discount: 70,
      rating: 4.5,
      reviews: 41,
      image: "assets/img/photos/p-necklace-multi.jpg",
      images: [
        "assets/img/photos/p-necklace-multi.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Ruby, emerald and sapphire-toned stones set side by side in oxidised silver-look panels — one necklace that matches almost any outfit in the wardrobe.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Multi-colour kundan-style glass",
        "Set includes": "Necklace + 1 pair earrings",
        Length: "Adjustable 34–46 cm"
      },
      inStock: true,
      badge: "",
      added: "2026-06-08"
    },

    /* ---------- homepage "Latest Products" ---------- */
    {
      id: 17,
      name: "Multi Color Zhumi in American Diamond",
      category: "Jewellery",
      price: 300,
      originalPrice: 857.14,
      discount: 65,
      rating: 5,
      reviews: 1,
      image: "assets/img/photos/p-zhumi.jpg",
      images: [
        "assets/img/photos/p-zhumi.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Classic bell-shaped jhumkas pavé-set with American diamond and finished with a fringe of coloured beads. They catch light from every angle.",
      specs: {
        Material: "Brass with rhodium plating",
        Stones: "American diamond (CZ) + glass beads",
        Length: "4.5 cm",
        Closure: "Push-back"
      },
      inStock: true,
      badge: "New",
      added: "2026-08-14"
    },
    {
      id: 18,
      name: "Oxidised Tribal look Stylish Chokar Necklace Set with Pearl Beads & Ruby",
      category: "Jewellery",
      price: 920,
      originalPrice: 3066,
      discount: 70,
      rating: 4.6,
      reviews: 23,
      image: "assets/img/photos/p-chokar-ruby.jpg",
      images: [
        "assets/img/photos/p-chokar-ruby.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Tribal-inspired hammered panels, ruby-red stones and a double row of pearl beads. Handworked in Jaipur, so no two pieces are identical.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Ruby-red glass, shell pearls",
        "Set includes": "Necklace + 1 pair earrings",
        "Made in": "Jaipur, India"
      },
      inStock: true,
      badge: "New",
      added: "2026-08-14"
    },
    {
      id: 19,
      name: "Radiant Oxidized Silver look Black Color Zhumki Chandelier Earrings",
      category: "Jewellery",
      price: 212,
      originalPrice: 706,
      discount: 70,
      rating: 4.3,
      reviews: 16,
      image: "assets/img/photos/p-zhumki-black.jpg",
      images: [
        "assets/img/photos/p-zhumki-black.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Three tiers of oxidised silver-look chandelier work with black stone drops. Long enough to make a statement, light enough to forget you are wearing them.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Black glass",
        Length: "7 cm",
        Weight: "18 g per pair"
      },
      inStock: true,
      badge: "",
      added: "2026-08-10"
    },
    {
      id: 20,
      name: "Ethereal Aura Silver Look Oxidized Green Color Chokar Necklace Set",
      category: "Jewellery",
      price: 640,
      originalPrice: 2133,
      discount: 70,
      rating: 4.4,
      reviews: 12,
      image: "assets/img/photos/p-chokar-green.jpg",
      images: [
        "assets/img/photos/p-chokar-green.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "A lighter, everyday take on the festive choker — slimmer panels, softer green stones and a comfortable adjustable tie.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Green glass",
        "Set includes": "Necklace + 1 pair earrings",
        Length: "Adjustable 34–44 cm"
      },
      inStock: true,
      badge: "",
      added: "2026-08-10"
    },
    {
      id: 21,
      name: "Vintage Silver Cascade Rani & Green Color Chandelier Zhumki Earrings",
      category: "Jewellery",
      price: 360,
      originalPrice: 1200,
      discount: 70,
      rating: 4.5,
      reviews: 14,
      image: "assets/img/photos/p-cascade.jpg",
      images: [
        "assets/img/photos/p-cascade.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "A cascade of rani-pink and green stones falling from an oxidised silver-look crescent. Pairs naturally with the Ethereal Aura choker.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Rani pink + green glass",
        Length: "6 cm",
        Closure: "Push-back"
      },
      inStock: true,
      badge: "",
      added: "2026-08-06"
    },
    {
      id: 22,
      name: "Moonlit Reflections Silver Look Pink Color Drop Earrings",
      category: "Jewellery",
      price: 184,
      originalPrice: 613,
      discount: 70,
      rating: 4.1,
      reviews: 8,
      image: "assets/img/photos/p-drop-pink.jpg",
      images: [
        "assets/img/photos/p-drop-pink.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "Small teardrop earrings with a single blush-pink stone — the pair to reach for on a workday when jhumkas are too much.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Blush pink glass",
        Length: "3 cm",
        Weight: "8 g per pair"
      },
      inStock: true,
      badge: "",
      added: "2026-08-06"
    },
    {
      id: 23,
      name: "Radiant Oxidized Silver look Rani Color Zhumki Chandelier Earrings",
      category: "Jewellery",
      price: 212,
      originalPrice: 706,
      discount: 70,
      rating: 4.3,
      reviews: 11,
      image: "assets/img/photos/p-zhumki-rani.jpg",
      images: [
        "assets/img/photos/p-zhumki-rani.jpg",
        "assets/img/photos/cat-jewellery.jpg"
      ],
      description:
        "The Radiant chandelier in rani pink — the same three-tier silhouette, in the shade that reads as festive from across a room.",
      specs: {
        Material: "Brass with oxidised silver plating",
        Stones: "Rani pink glass",
        Length: "7 cm",
        Weight: "18 g per pair"
      },
      inStock: true,
      badge: "",
      added: "2026-08-04"
    },
    {
      id: 24,
      name: "Pistachios Pista without Shell Un-salted — 1Kg",
      category: "Dry Fruits",
      price: 2145,
      originalPrice: 3300,
      discount: 35,
      rating: 4.7,
      reviews: 33,
      image: "assets/img/photos/p-pista.jpg",
      images: [
        "assets/img/photos/p-pista.jpg",
        "assets/img/photos/cat-dryfruits.jpg",
        "assets/img/photos/hero-dryfruit.jpg"
      ],
      description:
        "Shelled Iranian pistachio kernels, unsalted and unroasted — the bright-green ones confectioners use for barfi and kulfi.",
      specs: {
        "Net weight": "1 kg",
        Type: "Shelled kernels, raw, unsalted",
        Origin: "Iran",
        "Shelf life": "6 months from packing"
      },
      inStock: true,
      badge: "",
      added: "2026-08-02"
    },

    /* ---------- catalogue depth: products that fill out the remaining
                  "Shop by Category" tiles so no category lands empty ---------- */
    {
      id: 25,
      name: "Handcrafted Leather Sling Bag for Women",
      category: "Leather",
      price: 1299,
      originalPrice: 1899,
      discount: 32,
      rating: 4.4,
      reviews: 29,
      image: "assets/img/photos/m-sling.jpg",
      images: [
        "assets/img/photos/m-sling.jpg",
        "assets/img/photos/cat-leather.jpg"
      ],
      description:
        "A compact crossbody in soft cognac leather with an adjustable strap and a zip pocket on the back panel. Holds a phone, a small wallet and keys with room to spare.",
      specs: {
        Material: "Genuine leather",
        Dimensions: "22 × 16 × 6 cm",
        Strap: "Adjustable, 90–130 cm",
        Compartments: "1 main + 1 zip back pocket"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-07-22"
    },
    {
      id: 26,
      name: "SURMEE Handcrafted Leather Office Satchel Bag",
      category: "Leather",
      price: 2499,
      originalPrice: 3499,
      discount: 29,
      rating: 4.6,
      reviews: 18,
      image: "assets/img/photos/m-satchel.jpg",
      images: [
        "assets/img/photos/m-satchel.jpg",
        "assets/img/photos/cat-leather.jpg",
        "assets/img/photos/hero-leather.jpg"
      ],
      description:
        "A padded 14-inch laptop satchel with brass hardware and a detachable shoulder strap. Stitched on a single hide so the grain runs continuously across the flap.",
      specs: {
        Material: "Full-grain leather",
        "Fits laptop": "Up to 14 inch",
        Dimensions: "38 × 28 × 10 cm",
        Hardware: "Antique brass",
        Warranty: "1 year"
      },
      inStock: true,
      badge: "Premium",
      added: "2026-07-18"
    },
    {
      id: 27,
      name: "Golden Radiance Traditional Jhumka Earrings",
      category: "Jewellery",
      price: 899,
      originalPrice: 1499,
      discount: 40,
      rating: 4.7,
      reviews: 44,
      image: "assets/img/photos/m-goldearrings.jpg",
      images: [
        "assets/img/photos/m-goldearrings.jpg",
        "assets/img/photos/cat-jewellery.jpg",
        "assets/img/photos/hero-jewellery.jpg"
      ],
      description:
        "Temple-style jhumkas in a warm micro-gold finish, with filigree domes and a row of pearl drops. A South-Indian silhouette that suits both silk and cotton.",
      specs: {
        Material: "Brass with 1-micron gold plating",
        Drops: "Shell pearls",
        Length: "5.5 cm",
        Weight: "22 g per pair",
        Closure: "Screw-back"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-07-26"
    },
    {
      id: 28,
      name: "Premium Trail Mix with Berries & Seeds — 500gms",
      category: "Dry Fruits",
      price: 549,
      originalPrice: 799,
      discount: 31,
      rating: 4.5,
      reviews: 37,
      image: "assets/img/photos/m-trailmix.jpg",
      images: [
        "assets/img/photos/m-trailmix.jpg",
        "assets/img/photos/cat-dryfruits.jpg"
      ],
      description:
        "Almonds, walnuts, cranberries, blueberries, pumpkin seeds and sunflower seeds — nothing fried, nothing sugar-coated. The desk-drawer jar that stops the 4 pm biscuit.",
      specs: {
        "Net weight": "500 g",
        Contents: "Almonds, walnuts, cranberries, blueberries, pumpkin & sunflower seeds",
        "Added sugar": "None",
        "Shelf life": "5 months from packing"
      },
      inStock: true,
      badge: "Trending",
      added: "2026-07-30"
    },
    {
      id: 29,
      name: "Festive Dry Fruit Gift Hamper Basket",
      category: "Corporate Gifts",
      price: 1899,
      originalPrice: 2799,
      discount: 32,
      rating: 4.6,
      reviews: 22,
      image: "assets/img/photos/m-basket.jpg",
      images: [
        "assets/img/photos/m-basket.jpg",
        "assets/img/photos/cat-gifts.jpg"
      ],
      description:
        "A handwoven cane basket packed with four dry-fruit pouches, wrapped in festive net and finished with a ribbon. Arrives gift-ready with a blank card for your message.",
      specs: {
        Contents: "4 × 200 g dry-fruit pouches",
        Basket: "Handwoven cane, reusable",
        Personalisation: "Blank gift card included",
        Packaging: "Gift-wrapped, ready to present"
      },
      inStock: true,
      badge: "Festive Pick",
      added: "2026-08-01"
    },
    {
      id: 30,
      name: "Corporate Diwali Gift Box — Assorted Sweets & Nuts",
      category: "Corporate Gifts",
      price: 1499,
      originalPrice: 2199,
      discount: 32,
      rating: 4.4,
      reviews: 15,
      image: "assets/img/photos/cat-gifts.jpg",
      images: ["assets/img/photos/cat-gifts.jpg", "assets/img/photos/m-basket.jpg"],
      description:
        "A rigid two-tier box of assorted mithai and roasted nuts, designed for bulk corporate gifting. Logo printing available on orders above 50 boxes.",
      specs: {
        Contents: "500 g assorted mithai + 300 g roasted nuts",
        Box: "Rigid two-tier, magnetic close",
        "Bulk orders": "Logo printing available above 50 units",
        "Shelf life": "21 days from packing"
      },
      /* Out of stock on purpose — exercises the disabled add-to-cart state. */
      inStock: false,
      badge: "",
      added: "2026-08-01"
    },
    {
      id: 31,
      name: "Baby Care Essentials Combo for Newborns",
      category: "Kids",
      price: 799,
      originalPrice: 1199,
      discount: 33,
      rating: 4.5,
      reviews: 26,
      image: "assets/img/photos/m-baby.jpg",
      images: [
        "assets/img/photos/m-baby.jpg",
        "assets/img/photos/cat-kids.jpg"
      ],
      description:
        "A five-piece starter set — mild baby wash, lotion, massage oil, powder and a hooded towel. Free of parabens, sulphates and added colour.",
      specs: {
        "Set includes": "Baby wash, lotion, massage oil, powder, hooded towel",
        "Suitable for": "Newborn and above",
        Free_from: "Parabens, sulphates, added colour",
        Dermatologist: "Tested"
      },
      inStock: true,
      badge: "New",
      added: "2026-07-12"
    },
    {
      id: 32,
      name: "Kids Cotton Festive Wear Set",
      category: "Kids",
      price: 649,
      originalPrice: 999,
      discount: 35,
      rating: 4.2,
      reviews: 13,
      image: "assets/img/photos/cat-kids.jpg",
      images: ["assets/img/photos/cat-kids.jpg"],
      description:
        "A two-piece cotton kurta-pyjama set with block-printed detailing — festive enough for a puja, soft enough that a toddler will actually keep it on.",
      specs: {
        Material: "100% cotton",
        Sizes: "1–2y, 2–3y, 3–4y, 4–5y",
        Care: "Machine wash cold",
        "Set includes": "Kurta + pyjama"
      },
      inStock: true,
      badge: "",
      added: "2026-07-12"
    },
    {
      id: 33,
      name: "Whole Spices Masala Combo Pack — 6 Jars",
      category: "Grocery",
      price: 749,
      originalPrice: 1099,
      discount: 32,
      rating: 4.6,
      reviews: 48,
      image: "assets/img/photos/m-spices.jpg",
      images: [
        "assets/img/photos/m-spices.jpg",
        "assets/img/photos/cat-grocery.jpg"
      ],
      description:
        "Six airtight jars of whole spices — cumin, coriander, black pepper, cardamom, cloves and cinnamon — sourced directly from growers and packed unground so the oils stay in.",
      specs: {
        Contents: "6 jars × 100 g",
        Spices: "Cumin, coriander, black pepper, cardamom, cloves, cinnamon",
        Form: "Whole, unground",
        Packaging: "Airtight glass jars"
      },
      inStock: true,
      badge: "Best Seller",
      added: "2026-07-08"
    },
    {
      id: 34,
      name: "Everyday Grocery Staples Combo Pack",
      category: "Grocery",
      price: 999,
      originalPrice: 1399,
      discount: 29,
      rating: 4.1,
      reviews: 19,
      image: "assets/img/photos/cat-grocery.jpg",
      images: ["assets/img/photos/cat-grocery.jpg", "assets/img/photos/m-spices.jpg"],
      description:
        "A month's base pantry for a small household — atta, two dals, rice, sugar, tea and cooking oil, in one shipment.",
      specs: {
        Contents: "Atta 5 kg, toor dal 1 kg, moong dal 1 kg, rice 5 kg, sugar 1 kg, tea 250 g, oil 1 L",
        "Best for": "1–3 person household, ~1 month",
        Packaging: "Individually sealed"
      },
      inStock: true,
      badge: "",
      added: "2026-07-08"
    },
    {
      id: 35,
      name: "Ayurvedic Herbal Skincare Gift Set",
      category: "Cosmetic",
      price: 899,
      originalPrice: 1299,
      discount: 31,
      rating: 4.3,
      reviews: 24,
      image: "assets/img/photos/cat-cosmetic.jpg",
      /* Single-image product — the gallery hides its thumbnail strip. */
      images: ["assets/img/photos/cat-cosmetic.jpg"],
      description:
        "Four ayurvedic staples in one box — ubtan face pack, kumkumadi face oil, aloe gel and a rose facial mist. Formulated without parabens or mineral oil.",
      specs: {
        "Set includes": "Ubtan face pack, kumkumadi oil, aloe gel, rose mist",
        "Skin type": "All, including sensitive",
        Free_from: "Parabens, mineral oil, artificial fragrance",
        "Shelf life": "24 months unopened"
      },
      inStock: true,
      badge: "",
      added: "2026-07-04"
    },
    {
      id: 36,
      name: "Sandalwood Incense Sticks & Brass Puja Thali Set",
      category: "Puja",
      price: 449,
      originalPrice: 699,
      discount: 36,
      rating: 4.6,
      reviews: 31,
      image: "assets/img/m-incense.jpg",
      /* Single-image product. */
      images: ["assets/img/m-incense.jpg"],
      description:
        "A hand-etched brass thali with diya, bell, kumkum bowls and two boxes of natural sandalwood agarbatti — everything needed for a daily aarti in one set.",
      specs: {
        "Set includes": "Brass thali, diya, bell, 2 kumkum bowls, 2 × 20 incense sticks",
        Thali: "Brass, 20 cm diameter",
        Incense: "Natural sandalwood, charcoal-free",
        Care: "Polish brass with a dry cloth"
      },
      inStock: true,
      badge: "Festive Pick",
      added: "2026-07-01"
    },
    {
      id: 37,
      name: "Handwoven Winter Shawl with Kashmiri Embroidery",
      category: "Winter Wear",
      price: 1799,
      originalPrice: 2599,
      discount: 31,
      rating: 4.7,
      reviews: 27,
      image: "assets/img/photos/cat-winter1.jpg",
      images: [
        "assets/img/photos/cat-winter1.jpg",
        "assets/img/photos/cat-winter.jpg"
      ],
      description:
        "A full-size shawl in fine wool, hand-embroidered along the border in traditional Kashmiri sozni work. Warm without weight, and it folds down to nothing in a bag.",
      specs: {
        Material: "Fine merino-blend wool",
        Size: "200 × 70 cm",
        Embroidery: "Hand sozni work",
        Care: "Dry clean only",
        "Made in": "Srinagar, India"
      },
      inStock: true,
      badge: "Premium",
      added: "2026-07-16"
    }
  ];

  /* ---------- small data helpers (no DOM, no side effects) ---------- */

  /** "Namkeen & Snacks" -> "namkeen-snacks" (used for tidy URLs). */
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/&/g, " ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** A fresh copy of the array, so callers can sort/filter freely. */
  function all() {
    return PRODUCTS.slice();
  }

  /** Look up one product by id. Returns undefined when not found. */
  function byId(id) {
    const wanted = Number(id);
    return PRODUCTS.find(function (p) { return p.id === wanted; });
  }

  /**
   * Categories DERIVED from the product data (never hardcoded twice).
   * Returns [{ name, slug, count }] in CATEGORY_ORDER first, then any
   * new category alphabetically — so adding a product with a brand-new
   * category still shows up in the filter automatically.
   */
  function categories() {
    const counts = new Map();
    PRODUCTS.forEach(function (p) {
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });
    const known = CATEGORY_ORDER.filter(function (name) { return counts.has(name); });
    const extra = Array.from(counts.keys())
      .filter(function (name) { return CATEGORY_ORDER.indexOf(name) === -1; })
      .sort();
    return known.concat(extra).map(function (name) {
      return { name: name, slug: slugify(name), count: counts.get(name) };
    });
  }

  /**
   * Resolve a ?category= URL value to a real category name.
   * Accepts a slug ("winter-wear"), the display name ("Winter Wear")
   * or any casing of either. Returns "" when nothing matches.
   */
  function findCategory(value) {
    if (!value) return "";
    // URLSearchParams already percent-decodes query values, so the text is
    // normally ready to slugify. A caller may still pass an encoded string,
    // so decoding is attempted — but guarded, because a stray "%" (as in
    // "?category=100%") makes decodeURIComponent throw URIError, which would
    // otherwise abort the whole listing script and leave an empty grid.
    let text = String(value);
    try { text = decodeURIComponent(text); } catch (err) { /* use the raw text */ }
    const needle = slugify(text);
    const hit = categories().find(function (c) { return c.slug === needle; });
    return hit ? hit.name : "";
  }

  /** Products in the same category, excluding the given id. */
  function related(product, limit) {
    if (!product) return [];
    const max = limit || 4;
    const same = PRODUCTS.filter(function (p) {
      return p.category === product.category && p.id !== product.id;
    });
    // Top up with other categories if this one is thin, so the strip is never empty.
    if (same.length < max) {
      PRODUCTS.forEach(function (p) {
        if (same.length >= max) return;
        if (p.id !== product.id && same.indexOf(p) === -1) same.push(p);
      });
    }
    return same.slice(0, max);
  }

  window.MHProducts = {
    data: PRODUCTS,
    CATEGORY_ORDER: CATEGORY_ORDER,
    all: all,
    byId: byId,
    categories: categories,
    findCategory: findCategory,
    related: related,
    slugify: slugify
  };

  /* Convenience alias so `products` reads naturally in the console. */
  window.products = PRODUCTS;
})();
