# Prototyp Versandkostenfreigrenze
- Gutscheinseite ausschließen (https://www.hessnatur.com/de/geschenkgutschein)
- Gutscheine werden noch geliefert
- WK Wert über den WK Layer beziehen

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