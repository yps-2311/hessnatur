# Hessnatur – Sprint 4: PDP Recommendation "Ähnliche Produkte"

## Übersicht

Dieser A/B-Test ersetzt das native **econda Recommendation Widget (Widget-ID 202)** auf der Hessnatur Produktdetailseite (PDP) durch eine eigene, clientseitige Implementierung. Statt das Widget über das econda JS-SDK zu rendern, wird die **econda CrossSell API direkt** angefragt und die empfohlenen Produkte in den bestehenden Swiper-Slider injiziert.

**Ziel:** Bessere Kontrolle über Darstellung, Deduplizierung und Tracking der "Ähnliche Produkte"-Empfehlungen.

---

## Varianten

| Variante | Beschreibung |
|----------|-------------|
| `variation-00` | **Control** – Keine Änderung, natives econda Widget läuft unverändert. |
| `variation-01` | **Treatment** – Eigene econda API-Anbindung, Produkte werden dedupliziert und in den bestehenden Swiper gerendert. |

---

## Architektur & Ablauf (Variation 01)

### High-Level Flow

```
PDP geladen
  │
  ├─ Anti-Flicker CSS injizieren (native Reco unsichtbar)
  ├─ Wishlist-State via GraphQL API vorladen
  │
  └─ KEK.elem wartet auf [data-testid="recommendation"]
       │
       ├─ waitForStableDOM (MutationObserver, 400ms Debounce)
       │
       └─ loadAndRenderReco()
            ├─ SessionStorage Cache prüfen (30min TTL)
            ├─ econda CrossSell API fetchen (Paging bei <5 unique Produkten)
            ├─ Deduplizierung (gleiche Produkt-ID + aktuelles PDP ausschließen)
            ├─ initEcondaReco() → Template klonen, Slides befüllen, Swiper updaten
            └─ Wishlist-Buttons synchronisieren
```

### Komponenten im Detail

#### 1. Anti-Flicker (`injectAntiFlicker`)
- Injiziert sofort ein `<style>`-Tag, das den nativen `.swiper-wrapper` auf `opacity: 0` setzt.
- Wird erst nach erfolgreichem Rendering via Klasse `.kk-slides-active` wieder eingeblendet.
- **Fallback:** `showOriginalReco()` entfernt das Anti-Flicker-Stylesheet komplett, falls die API fehlschlägt.

#### 2. econda CrossSell API (`buildApiUrl`, `loadAndRenderReco`)
- **Endpoint:** `https://widgets.crosssell.info/eps/crosssell/recommendations/`
- **Parameter:** Widget-ID `202`, Account-ID, aktuelle Produkt-ID aus URL, Page-Size `csize=20`.
- **Paging-Logik:** Falls nach Deduplizierung weniger als 5 unique Produkte vorhanden sind, wird automatisch nachgeladen (max. 3 Seiten).
- **Request-Token:** Verhindert Race Conditions bei schneller Navigation – veraltete Responses werden ignoriert.

#### 3. SessionStorage Cache (`getCachedProducts`, `setCachedProducts`)
- **Key:** `kk-reco-cache`
- **TTL:** 30 Minuten
- **Struktur:** `{ [productUrl]: { products, timestamp, exhausted } }`
- **LRU:** Max. 10 Einträge, ältester wird verdrängt.
- **Exhausted-Flag:** Merkt sich, ob die API weniger als 5 Produkte liefern kann, um unnötige Nachlade-Requests zu vermeiden.

#### 4. Deduplizierung (`dedupeProducts`)
- Entfernt Produkte mit gleicher `id` (econda liefert teils gleiche Produkte in verschiedenen Größen).
- Schließt das aktuell angezeigte PDP-Produkt aus.

#### 5. Template-Rendering (`initEcondaReco`, `fillProductCard`)
- Klont den **ersten existierenden Swiper-Slide** als Template.
- **Template-Normalisierung:** Stellt sicher, dass alle 3 Preis-Elemente existieren (`price-label`, `price-label-discounted`, `price-label-striked`), unabhängig davon, ob das Template-Produkt reduziert war oder nicht.
- **Wishlist-Reset:** Template-Wishlist-State wird vor dem Klonen zurückgesetzt.
- Pro Produkt wird ein Slide erzeugt und befüllt:
  - **Bild** (aus `iconurl`/`imageurl`)
  - **Produktname** in Headline
  - **Preis:** Regulär (schwarz) oder reduziert (Streichpreis + roter Aktionspreis)
  - **Link** zum Produkt (mit `data-product-id` und Click-Tracking)
  - **Wishlist-Button** (geklont, um React-Bindings zu umgehen)
- Slides werden als `DocumentFragment` gesammelt und per `innerHTML = ''` + `appendChild` eingesetzt.
- **Swiper-Update:** Navigation wird neu gebunden, `swiper.update()` und `slideTo(0)` aufgerufen.

#### 6. Preis-Darstellung
- Alle 3 Preis-Wrapper werden initial versteckt.
- Bei `reduced === 'true'` + vorhandenem `oldprice`: Streichpreis + Aktionspreis anzeigen.
- Sonst: Nur regulärer Preis in Schwarz.

#### 7. Wishlist-Integration
- **Read:** Wishlist-SKUs werden via Hessnatur **GraphQL API** (`/api/graphql`) geladen, basierend auf dem `HessnaturDESite-wishlist` Cookie.
- **Write:** Neue Wishlist-Einträge werden via Hessnatur Custom Event `hessnatur:addToWishlist` hinzugefügt (kein eigener GraphQL-Call).
- **UI-Sync:** Wishlist-Buttons werden nach jedem Render per `syncWishlistButtons()` aktualisiert (mit Retries nach 0ms, 1.5s, 3s gegen React-Race-Conditions).
- **Optimistischer State:** Nach Klick wird der Button sofort als "gemerkt" markiert, bevor der API-Call bestätigt.
- **Mobile:** Wishlist-Overlay wird nach dem Add automatisch geöffnet (Multi-Strategie über Custom Events, Counter-Click, heuristische Trigger-Suche).
- **Country-Detection:** Aus URL-Pfad (`/de/`, `/fr/`, etc.) oder `<html lang>`.

#### 8. GA4 DataLayer Tracking (`pushDataLayerEvent`)
- Event: `select_item_from_list`
- `item_list_name`: "Ähnliche Produkte"
- `interaction_type`: `"click"` (Produkt-Klick) oder `"wishlist"` (Wishlist-Button)
- Enthält `item_id`, `item_name`, `item_variant` (SKU), `index`, `price`, `discount` (berechnet aus Streichpreis).

#### 9. SPA-Handling (`observeUrlChanges`, `refreshRecoIfNeeded`)
- **History-Monkey-Patching:** `pushState` und `replaceState` werden gewrapped, `popstate` wird gelistened.
- Bei URL-Wechsel: 200ms Debounce, dann `refreshRecoIfNeeded()`.
- Prüft ob URL oder DOM sich geändert hat (React könnte Slides ersetzen, ohne URL zu ändern).

#### 10. React Re-Render Schutz (`reapplyObserver`)
Ein persistenter `MutationObserver` auf `document.body` mit 3 Stufen:
- **Fast (50ms):** Wenn unsere `[data-kk-product]` Slides verschwunden sind → Marker-Klassen sofort entfernen, Opacity auf 0.
- **Slow (800ms):** Falls React die Reco komplett neu rendert → voller Re-Render mit `waitForStableDOM` + `loadAndRenderReco`.
- **Wishlist Counter Watch (500ms):** Beobachtet den Wishlist-Counter im Header – bei Änderung werden Buttons synchronisiert.

---

## Dateistruktur

```
src/
├── global/
│   ├── global.js       # KEK-Framework Setup (prepend KEK.js)
│   ├── global.less      # Globale Styles (leer)
│   └── vars.less        # LESS-Variablen (leer)
├── variation-00/
│   ├── script.js        # Control – No-Op
│   └── style.less       # Control – keine Styles
├── variation-01/
│   ├── script.js        # Treatment – econda API Reco (~1200 Zeilen)
│   ├── style.less       # Marker-Klasse + Global-Imports
│   └── style.css        # Compiled CSS
└── vendor/
    └── KEK.js           # KEK Framework Library
```

---

## Externe Abhängigkeiten

| Dependency | Zweck |
|-----------|-------|
| **econda CrossSell API** | Produkt-Empfehlungen (Widget 202) |
| **Hessnatur GraphQL API** (`/api/graphql`) | Wishlist lesen |
| **Hessnatur Custom Event** (`hessnatur:addToWishlist`) | Wishlist schreiben |
| **Swiper.js** (auf der Seite vorhanden) | Carousel-Funktionalität |
| **KEK Framework** | DOM-Helpers, Polling, Element-Selektion |

---

## Bekannte Edge Cases

- Bei manchen Referenzprodukten liefert econda weniger als 5 Empfehlungen zurück → Paging + Exhausted-Flag
- Gleiche Produkte in verschiedenen Größen werden von econda zurückgeliefert → Deduplizierung auf `id`
- React kann den Reco-DOM jederzeit neu rendern (z.B. bei Farbwechsel) → MutationObserver mit Fast/Slow Check
- Wishlist-State kann sich außerhalb des Tests ändern (z.B. auf Wishlist-Seite) → Counter-Watch + Sync mit Retries
