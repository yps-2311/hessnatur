## 100%-Ausspielungen
Alle 100%-Ausspielungen werden im Ordner 100-Prozent-Ausspielungen abgelegt und gepflegt.

## cartData
```javascript
var origOpenSearch = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
    this.addEventListener("loadend", function() {
        if(this.readyState === 4){                                
            if(uri.indexOf('/cart') !== -1){
				// current cart data
				console.log(this.responseText);
            }
        }
    }, false);
    origOpenSearch.call(this, method, uri, async, user, pass);
};
```

## updateVoucher
```javascript
var request = new XMLHttpRequest();
request.open('POST', 'https://www.hessnatur.com/de/cart/updateVoucher');
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send("voucherCode=ECOMTESTOMPF89MB&CSRFToken=" + document.querySelector('input[name="CSRFToken"]').value);
```

## removeVoucher
```javascript
var request = new XMLHttpRequest();
request.open('POST', 'https://www.hessnatur.com/de/cart/removeVoucher');
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send("voucherCode=ECOMTESTOMPF89MB&CSRFToken=" + document.querySelector('input[name="CSRFToken"]').value);
```

## Produktinfos als JSON
Beispiel URL:
https://products.hessnatur.com/products/20051012
Sollte es keine Infos geben, ist die ProduktID nicht ausführlich genug. Meist erst ab einer 7stelligen ID gib es Infos.
Hierbei stehen die ersten 5 Ziffern für das Produkt, die 6+7 für die Farbe/Typ und sollte es 8+9 geben stehen die Ziffern für die Größe.

## addToWishlist (Custom Event)
Hessnatur stellt ein Custom Event bereit, um Produkte zur Wishlist hinzuzufügen. Das Event wird auf `window` dispatched und Hessnatur handhabt die komplette Logik (API-Call, Toast, Counter-Update, Error-Handling).

```javascript
window.dispatchEvent(new CustomEvent('hessnatur:addToWishlist', {
    detail: { productCode: '<SKU CODE>' }
}));
```

## Page Type Targeting in Kameleoon
**Wichtig:** In Kameleoon gibt es unter Custom Types "Pagetype" (z.B. home, category, pdp), diese Custom Events triggern aber (teilweise) nicht rechtzeitig, so dass das Targeting in den A/B Tests während der Session (mal) fehlschlägt. Das passiert z.B., wenn per "Browser Back" und nicht über die Breadcrumb / SPA navigiert wird.

Dafür muss dann zustäztlich ein Page URL Trigger definiert werden, der **ODER** neben dem Pagetype auch auf das URL Pattern prüft.

Hier die RegExp für die verschiedenen Page Types:

**Home:**
```
https://www.hessnatur.com/de
```

**Category / PLP:**
```
^https:\/\/www\.hessnatur\.com\/de\/($|.*\/c\/.*)
```

**Produkt / PDP / PDS:**
```
^https:\/\/www\.hessnatur\.com\/de\/($|.*\/p\/.*)
```
