// load core and global js
// @codekit-prepend "vendor/WATO.js";

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

    console.log('skuID: ', skuID);

    function eightSelectInit() {
        window.eightlytics || function (window) {
            window.eightlytics = function () {
                window.eightlytics.queue = window.eightlytics.queue || [];
                window.eightlytics.queue.push(arguments);
            };
        }(window);

        var script = document.createElement('script');
        script.src   = 'https://wgt.8select.io/' + eightSelectAPIid + '/loader.js';
        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);
    }

    function build8select(ctl, firstcall) {
        WATO.elem('.kk_sliderWrapper', function(jumpCompleteLookBtn){ // , .js-jump-complete-look
            if(jumpCompleteLookBtn){
                console.log('jumpCompleteLookBtn: ', jumpCompleteLookBtn);
                WATO.elem('.pds__imageAndCockpitWrapper .mz-ready img', function(mainImg){
                    if(mainImg){
                        console.log('mainImg: ', mainImg);

                        var ankerButton = WATO.qs('.js-jump-complete-look');
                            // ankerButton8select = WATO.qs('[data-8select-widget-id="sys-button"]');

                        // if(ankerButton){
                        //     ankerButton.parentNode.removeChild(ankerButton);
                        // }
                        // if(ankerButton8select){
                        //     ankerButton8select.parentNode.removeChild(ankerButton8select);
                        // }

                        // jumpCompleteLookBtn[0].insertAdjacentHTML('beforeend', 
                        //     // '<div data-8select-widget-id="sys-button">'+
                        //     //     '<div style="background-image: url('+mainImg[0].getAttribute('src')+');"></div>'+
                        //     // '</div>'
                        //     '<a data-8select-widget-id="sys-button" class="textLink button js-jump-complete-look h-offset-right-outer" '+
                        //         'href="#" style="background-image: url('+mainImg[0].getAttribute('src')+');">Complete the Look'+
                        //     '</a>'
                        // );
                        
                        ankerButton.setAttribute('data-8select-widget-id', 'sys-button');
                        ankerButton.setAttribute('href', '');

                        var colorID = WATO.qs('.pds-cockpit__colorSwitch .active');

                        if(colorID){
                            skuID = skuID.substring(0,5) + colorID.getAttribute('data-color');
                        }
                        console.log('skuID: ', skuID);
    
                        console.log('ctl: ', ctl);
                        ctl.insertAdjacentHTML('beforebegin', 
                            '<div data-8select-widget-id="sys-psv" data-sku="'+skuID+'"></div>'
                        );

                        if(firstcall){
                            eightSelectInit();
                        }else{
                            window._8select.initCSE();
                        }
                    }
                });
            }
        });
    }

    var productUPC = WATO.qs('meta[property="product:upc"]');

    if(siteURL.indexOf("/p/") !== -1 && productUPC){

        skuID = productUPC.getAttribute('content').substring(0,7);

        WATO.xhr_get('https://pss.8select.io/'+eightSelectAPIid+'/sys/'+skuID, function(resp){
            if(resp){
                console.log('resp: ', resp);
                WATO.elem('#look', function(look){
                    if(look){

                        // ----- Bis hier wird es eine Aktivierung eines anderen Tests geben -----

                        console.log('look[0]: ', look[0]);
                        build8select(look[0], true);

                        WATO.ajax("/cart/add", function() {
                            WATO.elem('#completeTheLookRecommendationsAddToCart', function(completeTheLookRecommendationsAddToCart){
                                if(completeTheLookRecommendationsAddToCart){
                                    completeTheLookRecommendationsAddToCart[0].insertAdjacentHTML('beforebegin', 
                                        '<div data-8select-widget-id="sys-acc" data-sku="'+skuID+'" data-include-css="true"></div>'
                                    );
                                    WATO.elem(function() {
                                        return typeof window._8select !== "undefined";
                                    }, function(eightselectReady){
                                        if(eightselectReady){
                                            window._8select.initCSE();
                                        }
                                    });
                                }
                            });
                        });

                        WATO.elem('.pds-cockpit__colorSwitch a', function(colorSwitcher){
                            if(colorSwitcher){
                                for (var k = 0; k < colorSwitcher.length; k++) {
                                    colorSwitcher[k].addEventListener('click', function(){
                                        WATO.elem('#look', function(look){
                                            if(look){
                                                console.log('look: ', look);
                                                build8select(look[0], false);
                                            }
                                        });
                                        
                                    });
                                }
                            }
                        });

                        // ----- ENDE -----
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
                        // [
                        //     {
                        //         sku: '12345', // string
                        //         amount: 3, // integer
                        //         price: 1199 // integer - price of 1 item in cent
                        //     },
                        //     {
                        //         sku: '456', // string
                        //         amount: 1, // integer
                        //         price: 19995 // integer
                        //     }
                        // ]
                    }  
                );
            }
        });
    }

})(new window.WATO(), window);



// (function(d, s, w) {
//     var apiId = 'b0c6f362-6371-461e-b1b6-6cab65da6a1e';
//     w.eightlytics || function (w) {
//         w.eightlytics = function () {
//         window.eightlytics.queue = window.eightlytics.queue || [];
//         window.eightlytics.queue.push(arguments);
//         };
//     }(w);
//     var script = d.createElement(s);
//     script.src   = 'https://wgt.8select.io/' + apiId + '/loader.js';
//     var entry = d.getElementsByTagName(s)[0];
//     entry.parentNode.insertBefore(script, entry);
// })(document, 'script', window);


// <div data-8select-widget-id="sys-psv" data-sku="4976972"></div>

// _8select.initCSE();


// // PDS

// SKU mit Farbe
// 7 Zeichen

// // nach dem Complete the Look Anker

// <div data-8select-widget-id="sys-button"><div style="background-image: url(https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_detail_main/Hemd_Modern_Fit_aus_Bio_Baumwolle_mit_Hanf_und_Yak-49769_72_1.jpg);/*! width: 200px; *//*! height: 110px; *//*! background-size: cover; */"></div></div>



// // WK Layer
// <div data-8select-widget-id="sys-acc" data-sku="4976972" data-include-css="true"></div>
// _8select.initCSE();





// // Dankeseite

// window.eightlytics(
//     'purchase',
//       {
//         customerid: 'anonymous', // string
//         orderid: '1234', // string
//         products: [
//           {
//             sku: '12345', // string
//             amount: 3, // integer
//             price: 1199 // integer - price of 1 item in cent
//           },
//           {
//             sku: '456', // string
//             amount: 1, // integer
//             price: 19995 // integer
//           }
//         ]
//     }  
// );



// // 8S-demo=true

