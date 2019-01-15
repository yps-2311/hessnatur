# Prototyp Versandkostenfreigrenze
- Gutscheinseite ausschließen (https://www.hessnatur.com/de/geschenkgutschein)
- Gutscheine werden noch geliefert
- WK Wert über den WK Layer beziehen
jQuery.post( "https://www.hessnatur.com/de/cart/updateVoucher", { voucherCode: "213141", CSRFToken: "9db68265-e578-4bc4-ab0d-f7bdfcbfb3c8" } );