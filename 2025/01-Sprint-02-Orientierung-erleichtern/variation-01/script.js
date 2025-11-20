// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

(function (KEK) {
  "use strict";

  //console.log("Sprint 02 Variante 1 — u19");




  const SELECTOR_SIDEBAR = '[data-testid="plp-sidebar"]';
  const SELECTOR_HEADLINE = ".CategorySidebar_categorySidebar__headline__7JhIF";
  const SELECTOR_ACTIVE_LINK =
    ".CategorySidebar_categorySidebar__navigation__link--active__4qshT";
  const SELECTOR_PLP_CONTENT = '[data-testid="plp-content"]';
  const BREADCRUMB_ID = "kk-breadcrumb";
  const H1_ID = "kk-plp-h1";
  const CHECK_INTERVAL = 200;

  /* ----------------------------- Überkategorien ----------------------------- */
  const OVERCATEGORIES = [
    { path: "/de/damen/bekleidung/c/damen-bekleidung", text: "Bekleidung", parent: "Damen" },
    { path: "/de/damen/waesche/c/damen-waesche", text: "Wäsche", parent: "Damen" },
    { path: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires", text: "Schuhe & Accessoires", parent: "Damen" },
    { path: "/de/damen/bekleidung/basics/c/damen-essentials", text: "Basics", parent: "Damen" },
    { path: "/de/herren/bekleidung/c/herren-bekleidung", text: "Bekleidung", parent: "Herren" },
    { path: "/de/herren/waesche/c/herren-waesche", text: "Wäsche", parent: "Herren" },
    { path: "/de/herren/schuhe-und-accessoires/c/herren-schuhe-accessoires", text: "Schuhe & Accessoires", parent: "Herren" },
    { path: "/de/herren/bekleidung/basics/c/herren-essentials", text: "Basics", parent: "Herren" },
    { path: "/de/baby/bekleidung/c/baby-bekleidung", text: "Baby (NEWBORN - 3 JAHRE)", parent: "Junior" },
    { path: "/de/baby/bekleidung/c/junior-bekleidung", text: "Kids (98-164)", parent: "Junior" },
    { path: "/de/baby/originals/c/junior-essentials", text: "hessnatur Originals", parent: "Junior" },
    { path: "/de/baby/living/c/baby-living", text: "Home", parent: "Junior" },
    { path: "/de/sale/damen/c/sale-damen", text: "Damen", parent: "Sale" },
    { path: "/de/sale/herren/c/sale-herren", text: "Herren", parent: "Sale" },
    { path: "/de/sale/junior/c/sale-junior", text: "Junior", parent: "Sale" },
    { path: "/de/sale/home/c/sale-home", text: "Home", parent: "Sale" },
    { path: "/de/sale/bestseller/c/sale-bestseller", text: "Outlet", parent: "Sale" },
  ];




// ----------------------------- Feste Breadcrumb-Zuordnungen -----------------------------




const FIXED_BREADCRUMBS = [
  // --- NEU-Kategorien ---
  {
    url: "/de/damen/bekleidung/c/neu-damen",
    breadcrumb: [
      { text: "Neu", href: "/de/damen/bekleidung/c/neu-damen" },
    ],
  },
  {
    url: "/de/herren/bekleidung/c/neu-herren",
    breadcrumb: [
      { text: "Neu", href: "/de/herren/bekleidung/c/neu-herren" },
    ],
  },
  {
    url: "/de/baby/bekleidung/c/neu-junior",
    breadcrumb: [
      { text: "Neu", href: "/de/baby/bekleidung/c/neu-junior" },
    ],
  },
  {
    url: "/de/home/heimtextilien/c/neu-home",
    breadcrumb: [
      { text: "Neu", href: "/de/home/heimtextilien/c/neu-home" },
    ],
  },

  // --- DAMEN / WÄSCHE ---
  {
    url: "/de/damen/waesche/c/damen-waesche",
    breadcrumb: [
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },

  // --- NEU / DAMEN Varianten ---
  {
    url: "/de/damen/bekleidung/kleidung/c/neu-damen-bekleidung",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Damen", href: "/de/damen/bekleidung/c/neu-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/damenwaesche/c/neu-damen-waesche",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Damen", href: "/de/damen/bekleidung/c/neu-damen" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/accessoires/c/neu-damen-accessoires",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Damen", href: "/de/damen/bekleidung/c/neu-damen" },
    ],
  },

  // --- NEU / HERREN Varianten ---
  {
    url: "/de/herren/bekleidung/kleidung/c/neu-herren-bekleidung",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Herren", href: "/de/herren/bekleidung/c/neu-herren" },
    ],
  },
  {
    url: "/de/herren/waesche/herrenwaesche/c/neu-herren-waesche",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Herren", href: "/de/herren/bekleidung/c/neu-herren" },
    ],
  },
  {
    url: "/de/herren/schuhe-und-accessoires/accessoires/c/neu-herren-accessoires",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Herren", href: "/de/herren/bekleidung/c/neu-herren" },
    ],
  },
  {
  url: "/de/baby/bekleidung/kleidung/c/neu-baby-bekleidung",
  breadcrumb: [
    { text: "Neu", href: "/de/NEU" },
    { text: "Junior", href: "/de/baby/bekleidung/c/neu-junior" }
  ]
  },
  {
    url: "/de/baby/bekleidung/kleidung/c/neu-kinder-bekleidung",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Junior", href: "/de/baby/bekleidung/c/neu-junior" }
    ]
  },
  {
    url: "/de/baby/bekleidung/waesche-und-struempfe/c/neu-kinder-waesche",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Junior", href: "/de/baby/bekleidung/c/neu-junior" }
    ]
  },
  {
    url: "/de/home/schlafzimmer/heimtextilien/c/neu-home-schlafzimmer",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Home", href: "/de/home/heimtextilien/c/neu-home" }
    ]
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/wohnzimmer/c/neu-home-wohnzimmer",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Home", href: "/de/home/heimtextilien/c/neu-home" }
    ]
  },
  {
    url: "/de/home/bad/badezimmer/c/neu-home-badezimmer",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Home", href: "/de/home/heimtextilien/c/neu-home" }
    ]
  },
  {
    url: "/de/baby/heimtextilien/c/neu-home-kinderzimmer",
    breadcrumb: [
      { text: "Neu", href: "/de/NEU" },
      { text: "Home", href: "/de/home/heimtextilien/c/neu-home" }
    ]
  },
    // --- SALE / HOME Varianten ---
  {
    url: "/de/sale/home/c/sale-home",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
    ],
  },
  {
    url: "/de/sale/home/schlafzimmer/c/sale-home-schlafzimmer",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Home", href: "/de/sale/home/c/sale-home" },
    ],
  },
  {
    url: "/de/sale/home/wohnzimmer/c/sale-home-wohnzimmer",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Home", href: "/de/sale/home/c/sale-home" },
    ],
  },
  {
    url: "/de/sale/home/badezimmer/c/sale-home-badezimmer",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Home", href: "/de/sale/home/c/sale-home" },
    ],
  },
  {
    url: "/de/sale/home/babywelten/c/sale-home-babywelten",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Home", href: "/de/sale/home/c/sale-home" },
    ],
  },
    // --- DAMEN Hauptkategorien ---
  {
    url: "/de/damen/bekleidung/c/damen-bekleidung",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
    ],
  },
  {
    url: "/de/damen/bekleidung/basics/c/damen-essentials",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
    ],
  },
  {
    url: "/de/herren/schuhe-und-accessoires/c/herren-schuhe-accessoires",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
    ],
  },
  {
    url: "/de/herren/bekleidung/basics/c/herren-essentials",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
    ],
  },
  {
    url: "/de/baby/bekleidung/c/baby-bekleidung",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
    ],
  },
  {
    url: "/de/baby/bekleidung/c/junior-bekleidung",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
    ],
  },
  {
    url: "/de/baby/originals/c/junior-essentials",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
    ],
  },
  {
    url: "/de/baby/living/c/baby-living",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
    ],
  },
  {
    url: "/de/herren/bekleidung/ungebleicht-und-ungefaerbt/c/herren-specials-ungebleicht-ungefaerbt",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
    ],
  },
  {
    url: "/de/herren/bekleidung/specials/c/herren-specials-capsule-wardrobe",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Specials", href: "/de/herren" },
    ],
  },
  {
    url: "/de/baby/bekleidung/shirts/c/baby-bekleidung-shirts",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/hosen/c/baby-bekleidung-hosen",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/fleece/c/baby-bekleidung-fleece",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/jacken/c/baby-bekleidung-jacken",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/bodys/c/baby-bekleidung-bodys",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/nachtwaesche/c/baby-bekleidung-nachtwaesche",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/erstausstattung/c/baby-bekleidung-erstausstattung",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/schuhe-und-struempfe/c/baby-bekleidung-schuhe-struempfe",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/accessoires/c/baby-bekleidung-accessoires",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Baby (NEWBORN - 3 JAHRE)", href: "/de/baby/bekleidung/c/baby-bekleidung" },
    ],
  },
  {
  url: "/de/baby/bekleidung/fleece/c/junior-bekleidung-fleece",
  breadcrumb: [
    { text: "Junior", href: "/de/baby" },
    { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
  ],
  },
  {
    url: "/de/baby/bekleidung/jacken-und-strickjacken/c/junior-bekleidung-jacken",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/pullover-und-sweatshirts/c/junior-bekleidung-pullover-sweatshirts",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/kleider-und-hosen/c/junior-bekleidung-kleider-hosen",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/waesche-und-struempfe/c/junior-bekleidung-unterwaesche",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/nachtwaesche/c/junior-bekleidung-nachtwaesche",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" },
    ],
  },
  {
    url: "/de/baby/bekleidung/struempfe-und-strumpfhosen/c/junior-bekleidung-struempfe-strumpfhosen",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" }
    ]
  },
  {
    url: "/de/baby/bekleidung/schuhe/c/junior-bekleidung-schuhe",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Kids (98-164)", href: "/de/baby/bekleidung/c/junior-bekleidung" }
    ]
  },
  {
    url: "/de/baby/baby-hnclassics/bio-baumwollfleece/c/baby-hnclassics-baumwollfleece",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "hessnatur Originals", href: "/de/baby/originals/c/junior-essentials" },
    ],
  },
  {
    url: "/de/baby/baby-hnclassics/bio-wollwalk/c/baby-hnclassics-wollwalk",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "hessnatur Originals", href: "/de/baby/originals/c/junior-essentials" },
    ],
  },
  {
    url: "/de/baby/baby-hnclassics/bio-wollfleece/c/baby-hnclassics-wollfleece",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "hessnatur Originals", href: "/de/baby/originals/c/junior-essentials" },
    ],
  },
  {
    url: "/de/baby/bekleidung/schlafsaecke/c/baby-bekleidung-schlafsaecke",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Home", href: "/de/baby/living/c/baby-living" },
    ],
  },
  {
    url: "/de/baby/living/bettwaesche/c/baby-living-bettwaesche",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Home", href: "/de/baby/living/c/baby-living" },
    ],
  },
  {
    url: "/de/baby/living/decken/c/baby-living-decken",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Home", href: "/de/baby/living/c/baby-living" },
    ],
  },
  {
    url: "/de/baby/living/bad/c/junior-living-bad",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Home", href: "/de/baby/living/c/baby-living" },
    ],
  },
  {
    url: "/de/baby/living/transport/c/baby-living-transport",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Home", href: "/de/baby/living/c/baby-living" },
    ],
  },
  {
    url: "/de/damen/waesche/bhs/c/damen-waesche-bhs",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/spacer-bhs/c/damen-waesche-spacer-bhs",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "BHs & Bustiers", href: "/de/damen/waesche/bhs/c/damen-waesche-bhs" },
    ],
  },
  {
    url: "/de/bhs-ohne-buegel/c/damen-waesche-bhs-ohne-buegel",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "BHs & Bustiers", href: "/de/damen/waesche/bhs/c/damen-waesche-bhs" },
    ],
  },
  {
    url: "/de/damen/waesche/bustiers/c/damen-waesche-bustiers",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "BHs & Bustiers", href: "/de/damen/waesche/bhs/c/damen-waesche-bhs" },
    ],
  },
  {
    url: "/de/damen/waesche/still-bhs/c/damen-waesche-still-bhs",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "BHs & Bustiers", href: "/de/damen/waesche/bhs/c/damen-waesche-bhs" },
    ],
  },
  {
    url: "/de/damen/waesche/unterhemden/c/damen-waesche-unterhemden",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/spaghetti-tops/c/damen-waesche-spaghetti-tops",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterhemden", href: "/de/damen/waesche/unterhemden/c/damen-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/damen/waesche/tank-tops/c/damen-waesche-tank-tops",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterhemden", href: "/de/damen/waesche/unterhemden/c/damen-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/damen/waesche/damen-waesche-kurzarm-shirt/c/damen-waesche-kurzarm-shirt",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterhemden", href: "/de/damen/waesche/unterhemden/c/damen-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/damen/waesche/langarm-unterhemden/c/damen-waesche-langarm-shirt",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterhemden", href: "/de/damen/waesche/unterhemden/c/damen-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/damen/waesche/unterhosen/c/damen-waesche-unterhosen",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/slips/c/damen-waesche-slips",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterteile", href: "/de/damen/waesche/unterhosen/c/damen-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/damen/waesche/pantys/c/damen-waesche-pantys",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterteile", href: "/de/damen/waesche/unterhosen/c/damen-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/damen/waesche/strings/c/damen-waesche-strings",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterteile", href: "/de/damen/waesche/unterhosen/c/damen-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/damen/waesche/longpants/c/damen-waesche-longpants",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Unterteile", href: "/de/damen/waesche/unterhosen/c/damen-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/damen/waesche/unterkleider/c/damen-waesche-unterkleider",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/multipacks/c/damen-waesche-multipacks",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/funktionswaesche/c/damen-waesche-funktionswaesche",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/stillwaesche/c/damen-waesche-stillen",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/nachtwaesche/c/damen-waesche-nachtwaesche",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/ungebleicht-und-ungefaerbt/c/damen-waesche-ungebleicht-ungefaerbt",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/loungewear/c/damen-waesche-loungewear",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/struempfe-und-strumpfhosen/c/damen-waesche-struempfe",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
    ],
  },
  {
  url: "/de/herren/waesche/unterhemden/c/herren-waesche-unterhemden",
  breadcrumb: [
    { text: "Wäsche", href: "/de/waesche" },
    { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
  ],
  },
  {
    url: "/de/herren/waesche/unterhosen/c/herren-waesche-unterhosen",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/funktionswaesche/c/herren-waesche-funktionswaesche",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/multipacks/c/herren-waesche-multipacks",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/ungebleicht-und-ungefaerbt/c/herren-waesche-ungebleicht-ungefaerbt",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/loungewear/c/herren-waesche-loungewear",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/herren/waesche/struempfe/c/herren-waesche-struempfe",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/waesche/junior-waesche/c/junior-waesche",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
    ],
  },
  {
  url: "/de/herren/waesche/tank-tops/c/herren-waesche-tank-tops",
  breadcrumb: [
    { text: "Wäsche", href: "/de/waesche" },
    { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
    { text: "Unterhemden", href: "/de/herren/waesche/unterhemden/c/herren-waesche-unterhemden" },
  ],
  },
  {
    url: "/de/herren/waesche/kurzarm-shirts/c/herren-waesche-kurzarm-shirts",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Unterhemden", href: "/de/herren/waesche/unterhemden/c/herren-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/herren/waesche/langarm-shirts/c/herren-waesche-langarm-shirts",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Unterhemden", href: "/de/herren/waesche/unterhemden/c/herren-waesche-unterhemden" },
    ],
  },
  {
    url: "/de/herren/waesche/slips/c/herren-waesche-slips",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Unterteile", href: "/de/herren/waesche/unterhosen/c/herren-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/herren/waesche/pants/c/herren-waesche-pants",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Unterteile", href: "/de/herren/waesche/unterhosen/c/herren-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/herren/waesche/lange-unterhosen/c/herren-waesche-longpants",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Unterteile", href: "/de/herren/waesche/unterhosen/c/herren-waesche-unterhosen" },
    ],
  },
  {
    url: "/de/herren/waesche/pyjamas/c/herren-waesche-pyjamas",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Nachtwäsche", href: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/herren/waesche/waesche-serien-herren/c/lp-herren-waescheserie-mix-match",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Nachtwäsche", href: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/herren/waesche/pyjamas/c/herren-waesche-pyjamas-oberteile",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Nachtwäsche", href: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/herren/waesche/pyjamas/c/herren-waesche-pyjamas-unterteile",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Nachtwäsche", href: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/herren/waesche/nachthemden/c/herren-waesche-nachthemden",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
      { text: "Herren", href: "/de/herren/waesche/c/herren-waesche" },
      { text: "Nachtwäsche", href: "/de/herren/waesche/nachtwaesche/c/herren-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/schuhe/c/damen-schuhe-accessoires-schuhe",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Schuhe & Accessoires", href: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/hausschuhe/c/damen-hausschuhe",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Schuhe & Accessoires", href: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/schals-und-tuecher/c/damen-schuhe-accessoires-schals-tuecher",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Schuhe & Accessoires", href: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/muetzen-und-handschuhe/c/damen-schuhe-accessoires-muetzen-handschuhe",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Schuhe & Accessoires", href: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/damen/schuhe-und-accessoires/handschuhe/c/damen-handschuhe",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Schuhe & Accessoires", href: "/de/damen/schuhe-und-accessoires/c/damen-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/damen/bekleidung/essentials/c/damen-essentials-shirts",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Basics", href: "/de/damen/bekleidung/essentials/c/damen-essentials-shirts" },
    ],
  },
  {
    url: "/de/damen/bekleidung/essentials/c/damen-essentials-strick",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Basics", href: "/de/damen/bekleidung/essentials/c/damen-essentials-shirts" },
    ],
  },
  {
    url: "/de/damen/bekleidung/essentials/c/damen-essentials-fleece",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Basics", href: "/de/damen/bekleidung/essentials/c/damen-essentials-shirts" },
    ],
  },
  {
    url: "/de/damen/bekleidung/essentials/c/damen-essentials-hosen",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Basics", href: "/de/damen/bekleidung/essentials/c/damen-essentials-shirts" },
    ],
  },
  {
    url: "/de/damen/bekleidung/specials/c/damen-specials-ungebleicht-ungefaerbt",
    breadcrumb: [
      { text: "Damen", href: "/de" },
      { text: "Specials", href: "/de/damen" },
    ],
  },
  {
    url: "/de/damen/bekleidung/specials/c/damen-specials-capsule-wardrobe",
    breadcrumb: [
      { text: "Damen", href: "/de" },
      { text: "Specials", href: "/de/damen" },
    ],
  },
  {
    url: "/de/herren/schuhe-und-accessoires/schuhe/c/herren-schuhe",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Schuhe & Accessoires", href: "/de/herren/schuhe-und-accessoires/c/herren-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/herren/schuhe-und-accessoires/hausschuhe/c/herren-hausschuhe",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Schuhe & Accessoires", href: "/de/herren/schuhe-und-accessoires/c/herren-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/herren/schuhe-und-accessoires/muetzen-und-huete/c/herren-muetzen",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Schuhe & Accessoires", href: "/de/herren/schuhe-und-accessoires/c/herren-schuhe-accessoires" },
    ],
  },
  {
    url: "/de/herren/bekleidung/essentials/c/herren-essentials-shirts",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Basics", href: "/de/herren/bekleidung/basics/c/herren-essentials" },
    ],
  },
  {
    url: "/de/herren/bekleidung/essentials/c/herren-essentials-strick",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Basics", href: "/de/herren/bekleidung/basics/c/herren-essentials" },
    ],
  },
  {
    url: "/de/herren/bekleidung/essentials/c/herren-essentials-fleece",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Basics", href: "/de/herren/bekleidung/basics/c/herren-essentials" },
    ],
  },
  {
    url: "/de/herren/bekleidung/essentials/c/herren-essentials-hosen",
    breadcrumb: [
      { text: "Herren", href: "/de/herren" },
      { text: "Basics", href: "/de/herren/bekleidung/basics/c/herren-essentials" },
    ],
  },
  {
    url: "/de/baby/bekleidung/overalls/c/lp-junior-overalls-baumwollfleece",
    breadcrumb: [
      { text: "Junior / Baby (NEWBORN - 3 JAHRE)", href: "/de/baby" },
      { text: "Jacken", href: "/de/baby/bekleidung/c/baby-bekleidung" },
      { text: "Overalls & Strampler", href: "/de/baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler" },
    ],
  },
  {
    url: "/de/baby/bekleidung/overalls/c/lp-junior-overalls-wollfleece",
    breadcrumb: [
      { text: "Junior / Baby (NEWBORN - 3 JAHRE)", href: "/de/baby" },
      { text: "Jacken", href: "/de/baby/bekleidung/c/baby-bekleidung" },
      { text: "Overalls & Strampler", href: "/de/baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler" },
    ],
  },
  {
    url: "/de/baby/bekleidung/overalls/c/lp-junior-overalls-walk",
    breadcrumb: [
      { text: "Junior / Baby (NEWBORN - 3 JAHRE)", href: "/de/baby" },
      { text: "Jacken", href: "/de/baby/bekleidung/c/baby-bekleidung" },
      { text: "Overalls & Strampler", href: "/de/baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler" },
    ],
  },
  {
    url: "/de/ungebleicht-und-ungefaerbt/c/baby-hnclassics-ungebleicht-ungefaerbt",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Specials", href: "/de" },
    ],
  },
  {
    url: "/de/baby/trends/c/trends-junior-saison-1",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Specials", href: "/de/" },
    ],
  },
  {
    url: "/de/baby/bekleidung/trends/c/trends-baby-kindergarten",
    breadcrumb: [
      { text: "Junior", href: "/de/baby" },
      { text: "Specials", href: "/de/" },
    ],
  },
  {
    url: "/de/damen/waesche/waesche-serien-damen/c/lp-damen-waesche-pure-daily",
    breadcrumb: [
      { text: "Wäsche", href: "/de/waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/waesche-serien-damen/c/lp-damen-waesche-pure-daily",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/cotton/c/lp-damen-waesche-serie-5",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/mix-und-match/c/lp-damen-waesche-serie-3",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/modal-serie/c/lp-damen-waesche-serie-4",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/ripp-serie/c/lp-damen-waesche-serie-1",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/musselin-serie/c/lp-damen-waesche-serie-2",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
    url: "/de/damen/waesche/pointelle/c/lp-damen-waesche-serie-6",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche-Serien", href: "/de/waesche-serien-damen" },
    ],
  },
  {
  url: "/de/baby/wohnen/c/home-wohnzimmer-kids",
  breadcrumb: [
    { text: "Junior", href: "/de/baby" },
    { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
  ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/lp-home-teppiche-schurwolle-rhoenschaf",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
      { text: "Teppiche", href: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/lp-home-teppiche-schurwolle-deichschaf",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
      { text: "Teppiche", href: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/lp-home-teppiche-schurwolle-regional",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
      { text: "Teppiche", href: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/lp-home-teppiche-kurzflor",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
      { text: "Teppiche", href: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/lp-home-teppiche-hochflor",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
      { text: "Teppiche", href: "/de/home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche" },
    ],
  },
  {
    url: "/de/home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Wohnen", href: "/de/home/wohnzimmer-und-esszimmer/c/home-wohnzimmer" },
    ],
  },
  {
    url: "/de/home/bad/c/home-bad",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
    ],
  },
  {
    url: "/de/home/bad/badtextilien/c/home-bad-badtextilien",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Bad", href: "/de/home/bad/c/home-bad" },
    ],
  },
  {
    url: "/de/home/bad/bademaentel/c/home-bad-bademaentel",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Bad", href: "/de/home/bad/c/home-bad" },
    ],
  },
  {
    url: "/de/home/bad/badematten/c/home-bad-badematten",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Bad", href: "/de/home/bad/c/home-bad" },
    ],
  },
  {
    url: "/de/home/schlafzimmer/c/home-schlafzimmer",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
    ],
  },
  {
    url: "/de/home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Schlafen", href: "/de/home/schlafzimmer/c/home-schlafzimmer" },
    ],
  },
  {
    url: "/de/home/schlafzimmer/kissen-und-kopfkissen/c/home-schlafzimmer-kissen-kopfkissen",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Schlafen", href: "/de/home/schlafzimmer/c/home-schlafzimmer" },
    ],
  },
  {
    url: "/de/home/schlafzimmer/bettdecken/c/home-schlafzimmer-bettdecken",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Schlafen", href: "/de/home/schlafzimmer/c/home-schlafzimmer" },
    ],
  },
  {
    url: "/de/home/schlafzimmer/bettzubehoer/c/home-schlafzimmer-bettzubehoer",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Schlafen", href: "/de/home/schlafzimmer/c/home-schlafzimmer" },
    ],
  },
  {
    url: "/de/home/wohnwelten-trend/c/lp-home-wohnwelt-trend-2",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Specials", href: "/de/" },
    ],
  },
  {
    url: "/de/home/musselin/c/home-specials-musselin",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Specials", href: "/de/" },
    ],
  },
  {
    url: "/de/home/bad/sauna-welt/c/berater-home-sauna",
    breadcrumb: [
      { text: "Home", href: "/de/home" },
      { text: "Specials", href: "/de/" },
    ],
  },
  {
  url: "/de/sale/damen/c/sale-damen",
  breadcrumb: [
    { text: "Sale", href: "/de/sale" },
  ],
  },
  {
    url: "/de/sale/herren/c/sale-herren",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
    ],
  },
  {
    url: "/de/sale/junior/c/sale-junior",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
    ],
  },
  {
    url: "/de/sale/bestseller/c/sale-bestseller",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
    ],
  },
  {
    url: "/de/sale/damen/shirts-und-tops/c/sale-damen-shirts-tops",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/blusen-und-tuniken/c/sale-damen-blusen-tuniken",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/pullover/c/sale-damen-pullover",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/strickjacken/c/sale-damen-strickjacken",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/jacken-und-maentel/c/sale-damen-jacken-maentel",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/blazer/c/sale-damen-blazer",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/kleider/c/sale-damen-kleider",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/roecke/c/sale-damen-roecke",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/jeans/c/sale-damen-jeans",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/hosen/c/sale-damen-hosen",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/waesche/c/sale-damen-waesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/fleece/c/sale-damen-fleece",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/loungewear/c/sale-damen-loungewear",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/accessoires/c/sale-damen-accessoires",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/schuhe/c/sale-damen-schuhe",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
    ],
  },
  {
    url: "/de/sale/damen/unterwaesche/c/sale-damen-unterwaesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
      { text: "Wäsche", href: "/de/sale/damen/waesche/c/sale-damen-waesche" },
    ],
  },
  {
    url: "/de/sale/damen/nachtwaesche/c/sale-damen-nachtwaesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Damen", href: "/de/sale/damen/c/sale-damen" },
      { text: "Wäsche", href: "/de/sale/damen/waesche/c/sale-damen-waesche" },
    ],
  },
  {
  url: "/de/sale/herren/shirts/c/sale-herren-shirts",
  breadcrumb: [
    { text: "Sale", href: "/de/sale" },
    { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
  ],
  },
  {
    url: "/de/sale/herren/hemden/c/sale-herren-hemden",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/pullover-und-strickjacken/c/sale-herren-pullover-strickjacken",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/jacken-und-maentel/c/sale-herren-jacken-maentel",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/jeans-und-hosen/c/sale-herren-jeans-hosen",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/fleece/c/sale-herren-fleece",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/sweat/c/sale-herren-sweat",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/waesche/c/sale-herren-waesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
    ],
  },
  {
    url: "/de/sale/herren/nachtwaesche/c/sale-herren-nachtwaesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
      { text: "Wäsche", href: "/de/sale/herren/waesche/c/sale-herren-waesche" },
    ],
  },
  {
    url: "/de/sale/herren/unterwaesche/c/sale-herren-unterwaesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Herren", href: "/de/sale/herren/c/sale-herren" },
      { text: "Wäsche", href: "/de/sale/herren/waesche/c/sale-herren-waesche" },
    ],
  },
{
  url: "/de/sale/babys/c/sale-babys",
  breadcrumb: [
    { text: "Sale", href: "/de/sale" },
    { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
  ],
  },
  {
    url: "/de/sale/kinder/c/sale-kinder",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
    ],
  },
  {
    url: "/de/sale/babys/strampler-und-overalls/c/sale-babys-strampler-overalls",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/babys/pullover-und-sweatshirts/c/sale-babys-pullover-sweatshirts",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/babys/hosen-und-kleider/c/sale-babys-hosen-kleider",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/babys/jacken/c/sale-babys-jacken",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/babys/waesche/c/sale-babys-waesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/babys/accessoires/c/sale-babys-accessoires",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Baby", href: "/de/sale/babys/c/sale-babys" },
    ],
  },
  {
    url: "/de/sale/kinder/hosen-und-kleider/c/sale-kinder-hosen-kleider",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Kinder", href: "/de/sale/kinder/c/sale-kinder" },
    ],
  },
  {
    url: "/de/sale/kinder/jacken/c/sale-kinder-jacken",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Kinder", href: "/de/sale/kinder/c/sale-kinder" },
    ],
  },
  {
    url: "/de/sale/kinder/waesche/c/sale-kinder-waesche",
    breadcrumb: [
      { text: "Sale", href: "/de/sale" },
      { text: "Junior", href: "/de/sale/junior/c/sale-junior" },
      { text: "Kinder", href: "/de/sale/kinder/c/sale-kinder" },
    ],
  },
  {
    url: "/de/herren/waesche/c/herren-waesche",
    breadcrumb: [
      { text: "Wäsche", href: "/de/herren/waesche/c/herren-waesche" },
    ],
  },
  {
    url: "/de/damen/waesche/nachtwaesche/pyjamas/c/damen-waesche-pyjamas",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Nachtwäsche", href: "/de/damen/waesche/nachtwaesche/c/damen-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/damen/waesche/pyjamas/c/damen-waesche-pyjamas-oberteile",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Nachtwäsche", href: "/de/damen/waesche/nachtwaesche/c/damen-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/damen/waesche/pyjamas/c/damen-waesche-pyjamas-unterteile",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Nachtwäsche", href: "/de/damen/waesche/nachtwaesche/c/damen-waesche-nachtwaesche" },
    ],
  },
  {
    url: "/de/damen/waesche/nachtwaesche/nachthemden/c/damen-waesche-nachthemden",
    breadcrumb: [
      { text: "Damen", href: "/de/damen" },
      { text: "Wäsche", href: "/de/damen/waesche/c/damen-waesche" },
      { text: "Nachtwäsche", href: "/de/damen/waesche/nachtwaesche/c/damen-waesche-nachtwaesche" },
    ],
  },
];


// ----------------------------- Prüft, ob aktuelle URL einen festen Breadcrumb hat -----------------------------
const getFixedBreadcrumb = () => {
  
  // aktuelle URL ohne Query und Hash bereinigen
  const cleanUrl = window.location.pathname;

  // Finde exakten Treffer (Parameter & Anker werden ignoriert)
  const match = FIXED_BREADCRUMBS.find(item => {
    const fixedClean = item.url.replace(/[?#].*$/, "");
    return cleanUrl === fixedClean;
  });

  if (match) {
    return match.breadcrumb;
  }

  return null;
};

 /* ----------------------------- Breadcrumb Datenaufbau ----------------------------- */
const buildBreadcrumbData = () => {

  // 1️⃣ Prüfen, ob ein fester Breadcrumb hinterlegt ist
  const fixed = getFixedBreadcrumb();
  if (fixed) {
    return fixed;
  }

  

  // 2️⃣ Wenn kein fester Treffer → mit der dynamischen Logik weitermachen
  const sidebar = KEK.qs(SELECTOR_SIDEBAR);

  if (!sidebar) {
    return [];
  }

  const headline = KEK.qs(SELECTOR_HEADLINE, sidebar);
  const headlineText = headline ? headline.textContent.trim() : "";
  const path = new URL(window.location.href).pathname;

  // 🧩 Root bestimmen (Neu zuerst prüfen!)
  let rootCategory = "Damen";
  let rootHref = "/de/damen/";

  if (path.includes("/neu-")) {
    rootCategory = "Neu";
    rootHref = "/de/NEU";
  } else if (path.includes("/herren/")) {
    rootCategory = "Herren";
    rootHref = "/de/herren/";
  } else if (path.includes("/baby/")) {
    rootCategory = "Junior";
    rootHref = "/de/baby/";
  } else if (path.includes("/home/")) {
    rootCategory = "Home";
    rootHref = "/de/home/";
  } else if (path.includes("/sale/")) {
    rootCategory = "Sale";
    rootHref = "/de/sale/";
  }


  const activeLinks = KEK.qsa(SELECTOR_ACTIVE_LINK, sidebar);
  const activeData = Array.from(activeLinks).map((el) => ({
    text: el.textContent.trim(),
    href: el.getAttribute("href"),
  }));

  // 🧱 Grundstruktur
  const breadcrumbData = [{ text: rootCategory, href: rootHref }];
  if (headlineText) breadcrumbData.push({ text: headlineText, href: null });
  if (activeData.length) breadcrumbData.push(...activeData.slice(0, -1));

  // 🧩 Overcategory Matching (längster Match gewinnt)
const match = OVERCATEGORIES
  .filter(item => path.includes(item.path.replace("/c/", "/")))
  .sort((a, b) => b.path.length - a.path.length)[0];

if (match) {
  const isExactOvercategory = path === match.path;

  // 🧺 Sonderfall: WÄSCHE
  if (match && match.text === "Wäsche") {
      breadcrumbData.length = 0;
      breadcrumbData.push(
        { text: "Wäsche", href: match.path },
        { text: match.parent, href: `/de/${match.parent.toLowerCase()}/` }
      );


      // Wenn Unterseite → Parent-Kategorie hinzufügen (z. B. Unterhemden)
      if (!isExactOvercategory) {
        const activeLinks = KEK.qsa(SELECTOR_ACTIVE_LINK, sidebar);
        if (activeLinks.length > 1) {
          const parentCategory = activeLinks[activeLinks.length - 2];
          breadcrumbData.push({
            text: parentCategory.textContent.trim(),
            href: parentCategory.getAttribute("href") || null,
          });
        } else if (activeLinks.length === 1) {
          breadcrumbData.push({
            text: activeLinks[0].textContent.trim(),
            href: null,
          });
        }
      }

      return breadcrumbData;
    }

    // 🧩 Standard-Overcategory-Logik
    breadcrumbData.length = 0; // Reset, wir bauen frisch auf
    breadcrumbData.push({ text: match.parent, href: `/de/${match.parent.toLowerCase()}/` });

    if (!isExactOvercategory) {
      breadcrumbData.push({ text: match.text, href: match.path });

      // evtl. Unterkategorie ergänzen
      const activeLinks = KEK.qsa(SELECTOR_ACTIVE_LINK, sidebar);
      if (activeLinks.length) {
        const last = activeLinks[activeLinks.length - 1];
        breadcrumbData.push({ text: last.textContent.trim(), href: null });
      }
    }

    
    return breadcrumbData;
  }



    // 🩹 Post-Fix: Bekleidung-Link richtig setzen (global)
  (() => {
    const cat = breadcrumbData.find(b => b.text === "Bekleidung");
    const root = breadcrumbData[0]?.text;

    if (!cat || !root) return;

    // Finde die passende Overcategory
    const match = OVERCATEGORIES.find(o =>
      o.text === "Bekleidung" && o.parent === root
    );

    if (match) {
      cat.href = match.path;
    }
  })();

  return breadcrumbData;
};


/* ----------------------------- Breadcrumb einfügen ----------------------------- */
const insertBreadcrumb = (data) => {
  const sidebar = KEK.qs(SELECTOR_SIDEBAR);
  const content = KEK.qs(SELECTOR_PLP_CONTENT);
  if (!content) return;

  // alte Breadcrumbs entfernen
  document.querySelectorAll(`#${BREADCRUMB_ID}`).forEach((el) => el.remove());

  // neues Breadcrumb erstellen
  const div = document.createElement("div");
  div.id = BREADCRUMB_ID;
  div.className = "kk-breadcrumb";
  div.style.color = "#393939";
  div.style.fontSize = "14px";
  div.style.fontWeight = "500";

  data.forEach((part, i) => {
    const node = document.createElement(part.href ? "a" : "span");
    node.textContent = part.text;
    if (part.href) {
      node.href = part.href;
      node.style.color = "#393939";
      node.style.textDecoration = "none";

      // 🧩 Hover-Style inline hinzufügen
      node.addEventListener("mouseenter", () => {
        node.style.textDecoration = "underline";
      });
      node.addEventListener("mouseleave", () => {
        node.style.textDecoration = "none";
      });
    }
    div.appendChild(node);
    if (i < data.length - 1) div.appendChild(document.createTextNode(" / "));
  });

  const h1 = KEK.qs(`#${H1_ID}`);

  // 1. Wenn mobile Ansicht (<1024px)
  if (window.innerWidth < 1024) {
    if (h1) {
      // H1 existiert → direkt davor einfügen
      content.insertBefore(div, h1);

    } else {
      // H1 fehlt → auf DOM-Änderung warten
      const observer = new MutationObserver(() => {
        const h1Found = document.querySelector(`#${H1_ID}`);
        const breadcrumb = document.querySelector(`#${BREADCRUMB_ID}`);
        if (h1Found && breadcrumb && breadcrumb.nextSibling !== h1Found) {
          h1Found.parentNode.insertBefore(breadcrumb, h1Found);
          observer.disconnect();
        }
      });
      observer.observe(content, { childList: true, subtree: false });
      // Breadcrumb schon mal hinzufügen (am Anfang, bis H1 kommt)
      content.prepend(div);
    }
  }

  // ✅ 2. Desktop ≥1024px → Sidebar oder Content
  else if (sidebar) {
    sidebar.prepend(div);

  } else {
    content.prepend(div);
  }

// Styles direkt beim Erstellen setzen
const width = window.innerWidth;
if (width < 640) {
  div.style.margin = "15px 0 15px 10px";
} else if (width < 1024) {
  div.style.margin = "20px 0 20px 0";
} else {
  div.style.margin = "0 0 32px 0";
}

};


  /* ----------------------------- H1 einfügen ----------------------------- */
  const insertH1 = (data) => {
    const sidebar = KEK.qs(SELECTOR_SIDEBAR);
    const content = KEK.qs(SELECTOR_PLP_CONTENT);
    if (!sidebar || !content) return;

    let tries = 0;
    const MAX_TRIES = 20;

    const check = () => {
      tries++;
      const activeLinks = KEK.qsa(SELECTOR_ACTIVE_LINK, sidebar);
      let titleText = "";
      if (activeLinks.length) titleText = activeLinks[activeLinks.length - 1].textContent.trim();
      else {
        const headline = KEK.qs(SELECTOR_HEADLINE, sidebar);
        if (headline) titleText = headline.textContent.trim();
      }

      if (titleText) {
        let existing = KEK.qs(`#${H1_ID}`, content);
        if (existing) existing.remove();
        const h1 = document.createElement("h1");
        h1.id = H1_ID;
        h1.textContent = titleText;
        h1.style.color = "#393939";
        h1.style.fontSize = "31px";
        h1.style.lineHeight = "30.5px";
        h1.style.margin = "0 0 25px 10px";
        content.prepend(h1);

        setTimeout(applyMobileInlineStyles, 50);
      } else if (tries < MAX_TRIES) {
        setTimeout(check, 150);
      } else {
      }
    };
    check();
  };

 /* ----------------------------- Inline-Styling zentral (smart) ----------------------------- */
const applyMobileInlineStyles = (() => {
  let lastState = "";

  return () => {
    const h1 = document.querySelector(`#${H1_ID}`);
    const breadcrumb = document.querySelector(`#${BREADCRUMB_ID}`);
    if (!h1 || !breadcrumb) {
      return;
    }

    const width = window.innerWidth;
    const newState =
      width < 640 ? "small" :
      width < 1024 ? "medium" :
      "large";

    // 👇 Nur updaten, wenn wirklich anderer Zustand
    if (newState === lastState) return;
    lastState = newState;


    switch (newState) {
      case "small":
        Object.assign(h1.style, {
          color: "#393939",
          fontSize: "31px",
          lineHeight: "30.5px",
          margin: "0 0 25px 10px",
          fontWeight: "500",
        });
        Object.assign(breadcrumb.style, {
          color: "#393939",
          fontSize: "14px",
          fontWeight: "500",
          margin: "15px 0 15px 10px",
        });
        break;

      case "medium":
        Object.assign(h1.style, {
          color: "#393939",
          fontSize: "31px",
          lineHeight: "30.5px",
          margin: "0 0 30px 0",
          fontWeight: "500",
        });
        Object.assign(breadcrumb.style, {
          color: "#393939",
          fontSize: "14px",
          fontWeight: "500",
          margin: "20px 0 20px 0",
        });
        break;

      case "large":
        Object.assign(h1.style, {
          color: "#393939",
          fontSize: "31px",
          lineHeight: "30.5px",
          margin: "0 0 25px 10px",
          fontWeight: "",
        });
        Object.assign(breadcrumb.style, {
          color: "#393939",
          fontSize: "14px",
          fontWeight: "500",
          margin: "0 0 32px 0",
        });
        break;
    }
  };
})();


  /* ----------------------------- Resize überwachen ----------------------------- */
  let lastWidthState = window.innerWidth < 1024 ? "mobile" : "desktop";
  window.addEventListener("resize", () => {
    const nowState = window.innerWidth < 1024 ? "mobile" : "desktop";
    applyMobileInlineStyles();

    if (nowState !== lastWidthState) {
      lastWidthState = nowState;
      rebuildNavigation();
    }
  });

  /* ----------------------------- Rebuild ----------------------------- */
  const rebuildNavigation = () => {
    const data = buildBreadcrumbData();
    if (!data.length) return;

    insertH1(data);
    insertBreadcrumb(data);

    setTimeout(applyMobileInlineStyles, 100);
    setTimeout(applyMobileInlineStyles, 400);
  };

 const observeUrlAndDom = () => {
  let lastUrl = window.location.href;
  let lastSidebarSignature = "";
  let blocked = false; // 🔥 wichtig!

  setInterval(() => {

    const isEnglish = window.location.href.includes("/en-DE/");

    // Wenn EN-Seite → Test vollständig deaktivieren
    if (isEnglish) {
        blocked = true;

        // Elemente entfernen
        KEK.elem('#kk-breadcrumb', el => el?.[0]?.remove());
        KEK.elem('#kk-plp-h1', el => el?.[0]?.remove());

        return; // beendet nur diese Iteration – aber "blocked" verhindert den Rest unten
    }

    // Wenn wir einmal blockiert wurden, NUR zurück auf DE reaktivieren (optional)
    if (blocked && !isEnglish) {
        blocked = false;
    }

    // Wenn blockiert → NICHTS mehr vom Test ausführen
    if (blocked) return;

    // --- ab hier darf dein Test laufen ---
    const currentUrl = window.location.href;
    const sidebar = KEK.qs(SELECTOR_SIDEBAR);

    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;

      setTimeout(rebuildNavigation, 200);
      setTimeout(rebuildNavigation, 800);
    }

    if (sidebar) {
      const headline = sidebar.querySelector(SELECTOR_HEADLINE);
      const active = sidebar.querySelectorAll(SELECTOR_ACTIVE_LINK);
      const signature =
        (headline ? headline.textContent.trim() : "") +
        "|" +
        Array.from(active).map((a) => a.textContent.trim()).join("|");

      if (signature && signature !== lastSidebarSignature) {
        lastSidebarSignature = signature;
        rebuildNavigation();
      }
    }
  }, CHECK_INTERVAL);
};


  /* ----------------------------- Init ----------------------------- */
  const init = () => {
    rebuildNavigation();
    observeUrlAndDom();
  };

  KEK.elem("body", init);
})(new window.KEK());
