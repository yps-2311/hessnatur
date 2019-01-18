# Prototyp Versandkostenfreigrenze
- Gutscheinseite ausschließen (https://www.hessnatur.com/de/geschenkgutschein)
- Gutscheine werden noch geliefert
- WK Wert über den WK Layer beziehen

jQuery.post( "https://www.hessnatur.com/de/cart/updateVoucher", { voucherCode: "213141", CSRFToken: "9db68265-e578-4bc4-ab0d-f7bdfcbfb3c8" } );

## updateVoucher
```
var request = new XMLHttpRequest();
request.open('POST', 'https://www.hessnatur.com/de/cart/updateVoucher');
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send("voucherCode=ECOMTESTOMPF89MB&CSRFToken=" + document.querySelector('input[name="CSRFToken"]').value);
```

## removeVoucher
```
var request = new XMLHttpRequest();
request.open('POST', 'https://www.hessnatur.com/de/cart/removeVoucher');
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.send("voucherCode=ECOMTESTOMPF89MB&CSRFToken=" + document.querySelector('input[name="CSRFToken"]').value);
```