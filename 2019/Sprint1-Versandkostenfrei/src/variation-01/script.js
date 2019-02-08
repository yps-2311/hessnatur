// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    console.log(1);

    var url = window.location.pathname,
        voucherLimit = 90;

    function priceToFloat(element) {
        return parseFloat(element.textContent.replace("€", "").replace(",", "."))
    }
    

    if(url.indexOf("/p/") !== -1){
        // PDS

        WATO.elem('#miniCartDropdown span.float-right', function(wkPrice){
            if(wkPrice){
                var totalPrice = priceToFloat(wkPrice[0]);
                console.log('totalPrice: ', totalPrice);

                WATO.elem('span[itemprop="priceCurrency"]', function(productPriceBox){
                    if(productPriceBox){
                        console.log('productPriceBox: ', productPriceBox);

                        var productPrice = priceToFloat(productPriceBox[0]),
                            request = new XMLHttpRequest(),
                            voucherCode = "ECOMTESTOMPF89MB";
                        
                        console.log('productPrice: ', productPrice);
                        console.log('productPrice+totalPrice >= voucherLimit: ', productPrice+totalPrice >= voucherLimit);

                        if(productPrice+totalPrice >= voucherLimit){
                            console.log("gesetzt");
                            request.open('POST', 'https://www.hessnatur.com/de/cart/updateVoucher');
                            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                            request.send("voucherCode="+voucherCode+"&CSRFToken=" + WATO.qs('input[name="CSRFToken"]').value);
                        }
                    }
                });

                
            }
        });

    }




})(new window.WATO());