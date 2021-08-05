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