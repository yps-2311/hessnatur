// load core and global js
// @ codekit-prepend "../global/global.js";
// @codekit-prepend "../vendor/WATO.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    function removeVoucher(token, voucherCode) {
        window.iridion.push(['goal', "useVoucher"]);
        
        try {
            var request = new XMLHttpRequest();
        
            request.open('POST', 'https://www.hessnatur.com/de/cart/removeVoucher');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            if(typeof callback === "function") {
                request.onload = callback;
            }
            request.send("voucherCode="+voucherCode+"&CSRFToken=" + token);
        } catch (error) {
            // console.log(error);
            window.iridion.push(['goal', "wa_setup_monitoring"]);
        }
    }

    WATO.elem('section > #hessnaturVoucherForm', function(voucherWrapper){
        if(voucherWrapper){
            try {
                for (var i = 0; i < voucherWrapper.length; i++) {

                    var voucherElem = voucherWrapper[i],
                        voucherTextContent = voucherElem.textContent;

                    WATO.elem('input[name="CSRFToken"]', function(token){
                        if(token){
                            if(voucherTextContent.indexOf('ECOMWAPF99MB') !== -1 ){
                                voucherElem.style.display = "none";
                                removeVoucher(token[0].value, "ECOMWAPF99MB");
                            }else if(voucherTextContent.indexOf('ECOMWAPF149MB') !== -1){
                                voucherElem.style.display = "none";
                                removeVoucher(token[0].value, "ECOMWAPF149MB");
                            }
                        }
                    });
                }
            } catch (error) {
                // console.log(error);
                window.iridion.push(['goal', "wa_setup_monitoring"]);
            }
        }
    });


})(new window.WATO());