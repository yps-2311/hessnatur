// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    var url = document.URL;

    if(url.indexOf("/p/") !== -1){
        // klick auf versandkostenlayer
        WATO.elem('.h-nowrap .js-reveal-ajax', function(element){
            if(element){
                element[0].addEventListener('click', function(){
                    window.iridion.push(['goal', "klick_versandkostenlayer"]);
                });
            }
        });
    }
    else if(url.indexOf("/cart") !== -1){
        WATO.elem('.yCmsContentSlot + .column .offset-price-left', function(sum){
            if(sum){
                try {
                    WATO.elem('section > #hessnaturVoucherForm', function(voucherWrapper){
                        if(voucherWrapper){
                            for (var i = 0; i < voucherWrapper.length; i++) {
                                var voucherElem = voucherWrapper[i],
                                voucherTextContent = voucherElem.textContent;

                                if(voucherTextContent.indexOf('ECOMWAPF99MB') !== -1 || 
                                   voucherTextContent.indexOf('ECOMWAPF149MB') !== -1 ){
                                        voucherElem.style.display = "none";

                                        WATO.goalPush('crossdevice_voucher_code');
                                }
                            }
                        }
                    });
                } catch (error) {
                    // console.log("3 ",error);
                    WATO.goalPush("catchMonitoring");
                }
            }
        });

        WATO.elem('.reveal-overlay .alert callout', function(errorMsg){
            if(errorMsg) {
                errorMsg = errorMsg[0];
                if(/.*Gutschein.*ECOMWAPF99MB.*Mindestbestellwert.*/.test(errorMsg) || /.*Gutschein.*ECOMWAPF149MB.*Mindestbestellwert.*/.test(errorMsg)) {
                    WATO.goalPush('voucher_code_wk_error');
                }
            }
        });
    }
    else if(url.indexOf("/summary") !== -1){
        WATO.elem('.print-page-break-avoid.h-offset-bottom-inner .columns', function(totalSummary){
            if(totalSummary){
                try {
                    totalSummary = totalSummary[0];

                    var rows = WATO.qsa(".row", totalSummary);

                    // Alle Zeilen der Kosten prüfen ob diese das Word Versandkosten oder den Vouchercode beinhalten um
                    // diese auszublenden. Stattdessen wird dann Gratis in die Versandkosten-Zeile geschrieben
                    for (var i = 0; i < rows.length; i++) {
                        var thisRow = rows[i],
                        thisRowContent = thisRow.textContent;
                        // console.log('thisRow: ', thisRow);
                        if(thisRowContent.indexOf('ECOMWAPF99MB') !== -1 ||
                            thisRowContent.indexOf('ECOMWAPF149MB') !== -1
                        ){
                            thisRow.style.display = 'none';
                            WATO.goalPush('crossdevice_voucher_code');
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

})(new window.WATO());