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
        voucherLimit = 99,
        voucherCode = "ECOMWAPF99MB";

    function priceToFloat(element) {
        return parseFloat(element.textContent.replace("€", "").replace(",", "."));
    }
    function floatToPrice(floatNumber) {
        return String(floatNumber.toFixed(2)).replace(".",",");
    }
    function availableVoucher(element) {
        return element && element.textContent.indexOf(voucherCode) !== -1;
    }
    function addCodeOrRemove(voucherCode, updateOrRemove) {
        try {
            var request = new XMLHttpRequest();
            request.open('POST', 'https://www.hessnatur.com/de/cart/' + (updateOrRemove ? "update" : "remove" ) + 'Voucher');
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send("voucherCode="+voucherCode+"&CSRFToken=" + WATO.qs('input[name="CSRFToken"]').value);
        } catch (error) {
            console.log(error);
        }
    }
    

    if(url.indexOf("/p/") !== -1){
        // PDS

        WATO.elem('#miniCartDropdown span.float-right', function(wkPrice){
            if(wkPrice){
                wkPrice = wkPrice[0];

                var totalPrice = priceToFloat(wkPrice);
                console.log('totalPrice: ', totalPrice);

                WATO.elem('span[itemprop="priceCurrency"]', function(productPriceBox){
                    if(productPriceBox){
                        console.log('productPriceBox: ', productPriceBox);

                        var productPrice = priceToFloat(productPriceBox[0]),
                            comboPrice = productPrice+totalPrice;
                        
                        console.log('productPrice: ', productPrice);
                        console.log('productPrice+totalPrice >= voucherLimit: ', productPrice+totalPrice >= voucherLimit);

                        if(comboPrice >= voucherLimit){
                            // Mit diesem Produkt zusammen wird die Bestellung versandkostenfrei
                            console.log("Mit diesem Produkt zusammen wird die Bestellung Versandkostenfrei");
                        }else{
                            // Nur noch X€ bis versandkostenfrei
                            console.log('Nur noch X€ bis versandkostenfrei: ', (voucherLimit - totalPrice).toFixed(2));
                        }

                        WATO.ajax("cart/add", function(){
                            console.log("cart/add");
                            // Dieses Produkt wurde zum WK hinzugefügt

                            addCodeOrRemove(voucherCode, true);

                            console.log('totalPrice: ', totalPrice);

                            WATO.elem('.reveal .row:last-child .column:nth-child(2)', function(betweenButtonsInWKLayer){
                                if(betweenButtonsInWKLayer){
                                    betweenButtonsInWKLayer = betweenButtonsInWKLayer[0];

                                    try {
                                        console.log('betweenButtonsInWKLayer[0]: ', betweenButtonsInWKLayer);

                                        // var currentTotalPrice = priceToFloat(wkPrice);
                                        // console.log('wkPrice: ', wkPrice);
                                        // console.log('wkPrice: ', wkPrice.textContent);
                                        
                                        // console.log('currentTotalPrice: ', currentTotalPrice);

                                        // if(currentTotalPrice >= voucherLimit){
                                        //     console.log("Versandkostenfrei");
                                        // }else{
                                        //     // Nur noch X€ bis versandkostenfrei
                                        //     console.log('Nur noch X€ bis versandkostenfrei: ', voucherLimit - currentTotalPrice);
                                        // }
                                        if(comboPrice >= voucherLimit){
                                            console.log("Versandkostenfrei");
                                                betweenButtonsInWKLayer.innerHTML = 
                                                    '<div class="kk_wklfree">'+
                                                        'Mit diesem Artikel ist Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
                                                    '</div>';
                                        }else{
                                            // Nur noch X€ bis versandkostenfrei
                                            console.log('Nur noch X€ bis versandkostenfrei: ', (voucherLimit - comboPrice).toFixed(2));
                                            betweenButtonsInWKLayer.innerHTML = 
                                                '<div class="kk_wklfree">'+
                                                    '<b>Es fehlen nur noch '+ (voucherLimit - comboPrice).toFixed(2) +'</b><small>und wir schenken Ihnne die Versandkosten!</span>'+
                                                '</div>';
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    }
                                    

                                }
                            });


                        });
                    }
                });

                
            }
        });

    }else if(url.indexOf("/cart") !== -1){
        // WK Seite
        console.log("WK Seite");

        WATO.elem('.h-xsmallOffset-bottom-outer strong.offset-price-left', function(sum){
            if(sum){

                var totalSum = priceToFloat(sum[0]),
                    zwischenSummeField = WATO.qs(".yCmsContentSlot + .column"),
                    voucherWrapper = WATO.qs("section > #hessnaturVoucherForm"),
                    isActiveVoucher = availableVoucher(voucherWrapper);
                    
                console.log('voucherWrapper: ', voucherWrapper);

                if(totalSum >= voucherLimit){
                    // Versandkostenfrei

                    console.log("Versandkostenfrei");
                    zwischenSummeField.classList.add("kk_shippingfree");

                    if(!isActiveVoucher){
                        // Wenn noch kein Code gesetzt ist wieder dieser hier nachträglich gesetzt
                        addCodeOrRemove(voucherCode, true);
                    }

                }else{
                    // Nur noch X€ bis versandkostenfrei
                    console.log('Nur noch X€ bis versandkostenfrei: ', (voucherLimit - totalSum).toFixed(2));

                    zwischenSummeField.classList.add("kk_only");
                    zwischenSummeField.insertAdjacentHTML('afterbegin', 
                        '<div class="kk_wknurnoch">'+
                            '<span>Nur noch '+ floatToPrice(voucherLimit - totalSum) + ' €</span>'+
                            '<small>und Ihre Bestellung ist<br>versandkostenfrei!</small>'+
                        '</div>'
                    );

                    if(isActiveVoucher){
                        // Wenn der Code noch gesetzt ist und der WK-Wert zu niedrig ist
                        // wird der Code wieder entfernt
                        addCodeOrRemove(voucherCode, false);
                    }

                }

                if(isActiveVoucher){
                    voucherWrapper.style.display = "none";
                }

            }
        });


    }else if(url.indexOf("/summary") !== -1){
        // Zusammenfassung


        WATO.elem('.print-page-break-avoid.h-offset-bottom-inner .columns', function(totalSummary){
            if(totalSummary){
                totalSummary = totalSummary[0];

                var rows = WATO.qsa(".row", totalSummary);

                for (var i = 0; i < rows.length; i++) {
                    var thisRow = rows[i];
                    if(thisRow.textContent.indexOf(voucherCode) !== -1 || thisRow.textContent.indexOf("Versandkosten") !== -1){
                        console.log('thisRow: ', thisRow);
                        thisRow.classList.add("kk_hide");

                    }else if(thisRow.textContent.indexOf("Portofrei") !== -1){
                        WATO.qs(".totalPrice", thisRow).innerHTML = '<span class="kk_green">Gratis</span>';
                    }
                }

            }
        });



    }


    



})(new window.WATO());