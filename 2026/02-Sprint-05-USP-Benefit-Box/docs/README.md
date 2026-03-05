# Sprint 05 – USP-Benefit-Box

**Experiment:** Kameleoon 362466  
**Autor:** Manuel Brückmann  
**Client:** hessnatur (SPA, React/Next.js)

## Beschreibung

3 USP-Karten (Bewusst, Qualität, Weniger) werden je nach Seitentyp und Device als **Swipe-Karussell** (Mobile) oder **statische Tiles** (Desktop) eingefügt. Klick auf eine Karte öffnet einen **Drawer** mit Akkordeon (alle 3 USPs, ausgewählter offen).

### Seitentypen & Insert-Positionen

| Seitentyp | Mobile | Desktop |
|-----------|--------|---------|
| Homepage | Nach Hero-Teaser-Slider | Nach Hero-Teaser-Slider |
| Category | Nach 3./4. Produktkarte* | Nach 2./3. Produktkarte* |
| PDP | Ersetzt story-telling/retraced-story | Ersetzt story-telling/retraced-story |

\* Position verschiebt sich +1 wenn kein Promo-Element im Grid vorhanden ist (Promo-Erkennung via erste 3 Grid-Kinder).

## Architektur

```
src/
├── global/
│   ├── global.js          # KEK-Framework (einkommentierte Helper)
│   ├── global.less         # Globale Styles
│   └── vars.less           # LESS-Variablen (Farben, Fonts, Transitions)
├── variation-00/           # Control (leer)
├── variation-01/
│   ├── script.js           # Varianten-Logik (~790 Zeilen)
│   ├── script.min.js       # CodeKit-Output (minified)
│   ├── style.less          # Varianten-Styles (~410 Zeilen)
│   └── style.css           # CodeKit-Output (compiled)
└── vendor/                 # Externe Abhängigkeiten
```

## LESS-Variablen (`vars.less`)

### Farben
| Variable | Wert | Verwendung |
|----------|------|------------|
| `@kk-bg-icon` | `#fbfaf8` | Icon-SVG-Hintergrund |
| `@kk-icon-fill` | `#4d4d4d` | Icon-SVG-Fill |
| `@kk-text-primary` | `#2d2d2d` | Headlines |
| `@kk-text-secondary` | `#666` | Sublines |
| `@kk-text-tertiary` | `#999` | Links, Testimonial-Name |
| `@kk-text-body` | `#4A4A4A` | Fließtext, Bullets |

### Fonts
| Variable | Wert | Quelle |
|----------|------|--------|
| `@kk-font-headline` | `'Outfit', sans-serif` | Nativ von hessnatur geladen |
| `@kk-font-body` | `'Inter', sans-serif` | Google Fonts (300, 500, 700) |
| `@kk-font-serif` | `'Tinos', Georgia, serif` | Google Fonts (italic only) |

### Transitions
| Variable | Wert |
|----------|------|
| `@kk-transition-base` | `0.3s ease` |

## Webfonts

Ein kombinierter Google-Fonts-Request lädt **Inter** (Light 300, Medium 500, Bold 700) und **Tinos** (Italic). Guard verhindert Doppel-Loading via `link[href*="Inter"]`-Check.

**Outfit** wird von hessnatur nativ geladen und muss nicht importiert werden.

## Script-Struktur (script.js)

### Sektionen (in Reihenfolge)

1. **WEBFONTS** – Google Fonts laden (Inter + Tinos)
2. **DEVICE DETECTION** – `matchMedia`-basiert, 640px Breakpoint
3. **PAGE TYPE DETECTION** – Seitentyp aus `data-testid` nach Header ableiten
4. **INSERTION LOGIC** – Insert-Routing je Seitentyp
5. **CATEGORY GRID** – Sort/Filter-Reaktivität via DOM-Flag + MutationObserver
6. **USP DATA** – Content-Array `uspData` mit 3 USP-Objekten
7. **SESSION STORAGE** – Slide-Rotation zwischen Seitenaufrufen
8. **TRACKING** – DataLayer Push bei USP-Interaktion
9. **DRAWER** – Akkordeon-basiertes Detail-Panel
10. **SHARED ASSETS** – Icon-SVG + Card/Slide HTML-Builder
11. **MOBILE: CAROUSEL** – Infinite-Loop mit Clone-Slides
12. **DESKTOP: TILES** – 3 statische Kacheln
13. **CAROUSEL LOGIC** – Slide-Navigation + Infinite-Loop-Handling
14. **EVENT HANDLERS** – Touch/Swipe + Click → Drawer
15. **VIEWPORT CHANGE** – Carousel ↔ Tiles bei Breakpoint-Wechsel
16. **INIT** – `createDrawer()`, `initPageChangeListener()`, `initViewportChangeListener()`

### Wichtige Patterns

#### DOM-Flag (Sort/Filter-Reaktivität)
`data-kk-processed` auf erster Product Card verhindert Observer-Loop. React entfernt das Flag beim Re-Render → Observer erkennt Änderung → Cleanup + Re-Insert.

#### Promo-Offset (Grid-Positionierung)
Die ersten 3 Grid-Kinder werden geprüft. Wenn alle `product-list-card` sind → kein Promo-Element → Insert-Position verschiebt sich +1.

#### Akkordeon
Alle 3 USPs werden beim `createDrawer()`-Aufruf vorgerendert. State-Wechsel (aktiv/inaktiv) erfolgt über CSS-Klasse `--active` mit `max-height`-Transition (800px, 0.4s). Klick auf bereits aktives Item wird ignoriert.

#### Carousel Infinite-Loop
Clone des letzten Slides am Anfang + Clone des ersten am Ende. Bei Über-/Unterlauf: animierter Übergang zum Clone, dann ohne Transition auf echten Slide zurücksetzen.

## Tracking

`trackUspInteraction(uspId, source)` pusht `select_promotion` in den DataLayer:

```javascript
{
    event: 'Ecommerce - select_promotion',
    event_name: 'select_promotion',
    ecommerce: {
        creative_name: 'kk_usp_benefit_box_' + uspId,
        creative_slot: source,        // 'card' oder 'accordion'
        promotion_name: 'kk_usp_benefit_box'
    }
}
```

| Trigger | `creative_slot` |
|---------|----------------|
| Kachel/Slide-Klick | `card` |
| Akkordeon-Header-Klick | `accordion` |

## SPA-Navigation

hessnatur ändert `data-testid` am Page-Container bei Navigation. Ein `MutationObserver` auf `attributes` erkennt Seitenwechsel ohne URL-Polling. `onPageChange()` dedupliziert aufeinanderfolgende Aufrufe mit gleichem Seitentyp.

## Build

CodeKit kompiliert automatisch:
- `script.js` → `script.min.js` (minified/uglified)
- `style.less` → `style.css` (compiled)

Code ist minification-safe (IIFE mit `win`-Parameter statt `window`).