# Sprint 23 – Highlights Material & Pflege PDP

**Experiment:** noch offen  
**Client:** hessnatur  
**Scope:** Produktdetailseiten; Mobile im Buybox-Kontext, Desktop unter den Produktbildern

## Ziel

Passform, Material und Pflege sollen als nutzerorientierte Highlights sichtbar werden. Mobile sitzt das Modul im Buybox-Kontext vor den bestehenden Bullet-/Trust-Elementen. Desktop sitzt das Modul unter der Produktbild-Spalte. Die Variante nutzt bestehende PDP-Daten und ergänzt priorisierte Material- und Verarbeitungsnutzen.

## Insert-Position

- Desktop-Ziel: direkt nach der Produktbild-Spalte innerhalb `[data-testid="buy-box"]`
- Desktop-Anker: direktes Buybox-Kind mit Klasse `BuyBox_buyBox__media...`
- Mobile-Zielposition: innerhalb `[data-testid="buy-box-content"]`, direkt vor `[data-testid="product-description-bullets"]`
- Mobile-Fallbacks:
  - vor `[data-testid="product-benefit-list"]`
  - vor `[data-testid="product-payment-option"]`
  - nach `[data-testid="add-to-cart"]`
  - nach `[data-testid="product-properties-wrapper"]`

Damit sitzt das Modul auf Desktop unter den Produktbildern und auf Mobile oberhalb der relevanten Buybox-Inhalte.

## Datenquelle

Die Variante liest Produktdaten aus:

```javascript
window.__NEXT_DATA__.props.pageProps.productResult.product
```

Genutzte Felder:

- `product.badges`
- `product.informationBox.productDetails.bullets`
- `product.informationBox.productDetails.paragraphs`
- `product.informationBox.productFit`
- `product.informationBox.productMaterial`
- `product.informationBox.productCareLabel`

## Ausspiel-Logik

Es werden maximal 3 Fakten gerendert.

1. Passform-Fact
   - genau ein relevanter Passform-Hinweis
   - Quellen: `productFit`, Fallback aus `productDetails.bullets`
2. Material-Fact
   - Hauptmaterial als Headline, besondere Materialien/Verarbeitungen wenn vorhanden direkt im Titel, z. B. `Bio-Denim aus 100% Baumwolle`
   - weitere Materialien klein darunter
   - besondere Materialien/Verarbeitungen wie Musselin, Leinen, Bio-Denim, Nature Fleece, Slub oder Nature Shell werden priorisiert als Nutzentext herausgearbeitet
   - Quelle: `productMaterial`
3. Pflege-Fact
   - bevorzugt maschinenwaschbare Pflegehinweise
   - Quelle: `productCareLabel`

Fallback-Regel:

- Wenn ein Slot leer bleibt, wird er nicht mit einem fachfremden Qualitäts- oder Proof-Fact aufgefüllt.
- Es werden nie mehr als 3 Fakten gezeigt.

## Dedupe-Regeln

Nicht erneut ausspielen, wenn der Inhalt schon sichtbar ist in:

- Produktname
- sichtbaren Badges
- den bereits oberhalb sichtbaren PDP-Teaser-Bullets

Dadurch werden generische oder bereits sichtbare Aussagen wie `Nachhaltig`, `Vegan` oder die ersten Teaser nicht doppelt gezeigt.

## Kategorie-Heuristiken

- `Jeans/Basics`: Hauptmaterial plus Denim-/Verarbeitungsnutzen
- `Outerwear`: Hauptmaterial plus Outdoor-/Verarbeitungsnutzen, z. B. Nature Shell oder Fleece
- `Bedding/Matratze/Schuhe`: Hauptmaterial zuerst, weitere Material-Sektionen klein darunter

## Tracking

Beim erfolgreichen Render wird ein DataLayer-Event gepusht:

```javascript
{
  event: "kk_product_info_module_rendered",
  event_name: "kk_product_info_module_rendered",
  experiment_name: "07-Sprint-23-Highlights-Material-Pflege",
  product_code: "...",
  product_name: "...",
  product_info_facts: ["Label: Text", ...]
}
```

## Dateien

```text
src/
├── global/
├── variation-00/
├── variation-01/
│   ├── script.js
│   ├── script.min.js
│   ├── style.less
│   └── style.css
└── vendor/
tampermonkey/
└── tampermonkey.js
```

## Tampermonkey

Der Loader lädt lokal:

- `src/vendor/KEK.js`
- `src/global/global.js`
- `src/variation-01/style.css`
- `src/variation-01/script.js`
- `assets/materialicon_passform.svg`
- `assets/materialicon_waschmaschine.svg`

über:

```text
https://local-dev.konversionskraft.de/hessnatur/2026/07-Sprint-23-Highlights-Material-Pflege/
```
