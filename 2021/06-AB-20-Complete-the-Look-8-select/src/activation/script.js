// load core and global js
// @codekit-prepend "../vendor/WATO.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    var eightSelectAPIid = 'b0c6f362-6371-461e-b1b6-6cab65da6a1e',
        skuID = "",
        siteURL = window.location.pathname;

    function eightSelectInit() {
        // Von 8Select
        window.eightlytics || function () {
            window.eightlytics = function () {
                window.eightlytics.queue = window.eightlytics.queue || [];
                window.eightlytics.queue.push(arguments);
            };
        }();

        var script = document.createElement('script');
        script.src   = 'https://wgt.8select.io/' + eightSelectAPIid + '/loader.js';
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
    }


    var productUPC = WATO.qs('meta[property="product:upc"]');

    if(siteURL.indexOf("/p/") !== -1 && productUPC){
        // PDS

        // SKU = ProduktID
        // Steht in einem Meta Tag im Head
        skuID = productUPC.getAttribute('content').substring(0,7);

        // Anfrage ob von 8 Select für diese SKU ein CTL existiert um den Benutzer in den Test zu lassen
        WATO.xhr_get('https://pss.8select.io/'+eightSelectAPIid+'/sys/'+skuID, function(resp){
            if(resp){
                // Wenn dann auch auf der PDS eine von Hessnatur existierende CTL zu finden ist kann der Benutzer in den Test
                WATO.elem('#look', function(look){
                    if(look){

                        // PUSH in den Test
                        window.iridion.push(["run","1010363048583"]);
                    }
                });  
            }
        });

    }else if(siteURL.indexOf("/checkout/orderConfirmation") !== -1){
        // Dankeseite

        eightSelectInit();

        WATO.elem(function() {
            return typeof window.eightlytics !== "undefined" && typeof window.emospro !== "undefined";
        }, function(eightselectReady){
            if(eightselectReady){

                try {
                    // Infos zum Kauf werden an 8Select übertragen
                    var prods = [],
                        econdaData = window.emospro;

                    for (var i = 0; i < econdaData.ec_Event.length; i++) {
                        var thisProd = econdaData.ec_Event[i];
                        prods.push({
                            sku: thisProd.sku, // string
                            amount: thisProd.count, // integer
                            price: parseInt(String(thisProd.price).replace(".","")) // integer - price of 1 item in cent
                        });
                    }

                    window.eightlytics(
                        'purchase',
                        {
                            customerid: econdaData.billing[1], // string
                            orderid: econdaData.billing[0], // string
                            products: prods
                        }  
                    );
                } catch (error) {
                    window.iridion.push(['goal', 'error_sprint2']);
                    // console.log('Error: ', error);
                }
            }
        });
    }

})(new window.WATO(), window);