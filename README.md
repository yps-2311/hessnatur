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