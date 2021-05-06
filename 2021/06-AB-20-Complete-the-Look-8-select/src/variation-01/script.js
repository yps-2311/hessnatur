// load core and global js
// @ codekit-prepend "../vendor/WATO.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    /*jshint loopfunc: true */

	window.iridion.econda.push(["SprintAB20", "V1"]);

    function pushGoal(key, sendOnNextPageView){    
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}

    var eightSelectAPIid = 'b0c6f362-6371-461e-b1b6-6cab65da6a1e',
        skuID = WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7);

    function build8select(ctl, firstcall) {
        console.log('firstcall: ', firstcall);
        console.log('ctl: ', ctl);
        WATO.elem('.kk_sliderWrapper', function(jumpCompleteLookBtn){
            console.log('jumpCompleteLookBtn: ', jumpCompleteLookBtn);
            if(jumpCompleteLookBtn && ctl && !WATO.qs('[data-8select-widget-id="sys-psv"]')){
                WATO.elem('.pds__imageAndCockpitWrapper .mz-ready img', function(mainImg){
                    if(mainImg){
                        console.log('mainImg: ', mainImg);
                        
                        // Ankerbutton liegt unter den Heroshots und wird für 8Select angepasst
                        var ankerButton = WATO.qs('.js-jump-complete-look'),
                            colorID = WATO.qs('.pds-cockpit__colorSwitch .active');
                            
                        console.log('ankerButton: ', ankerButton);
                        console.log('colorID: ', colorID);

                        ankerButton.setAttribute('data-8select-widget-id', 'sys-button');
                        ankerButton.setAttribute('href', '#');

                        // SKU wird neu ermittelt mithilft der alten SKU und einer ggfs. neuen Farb-ID
                        if(colorID){
                            skuID = skuID.substring(0,5) + colorID.getAttribute('data-color');
                            console.log('skuID: ', skuID);
                        }

                        // CTL wird eingebaut inclusive neuer Headline von uns
                        ctl.insertAdjacentHTML('beforebegin', 
                            '<div class="kk_subline">Complete the Look</div>'+
                            '<div class="kk_teaser">Für mehr Stil: Ihr Perfektes Outfit</div>'+
                            '<div data-8select-widget-id="sys-psv" data-sku="'+skuID+'"></div>'
                        );

                        console.log('firstcall: ', firstcall);
                        if(firstcall){
                            // Initialisierung von 8Select
                            window.eightlytics = function () {
                                window.eightlytics.queue = window.eightlytics.queue || [];
                                window.eightlytics.queue.push(arguments);
                            };
                    
                            var script = document.createElement('script');
                            script.src   = 'https://wgt.8select.io/' + eightSelectAPIid + '/loader.js';
                    
                            var entry = document.getElementsByTagName('script')[0];
                            entry.parentNode.insertBefore(script, entry);

                        }else{
                            // Nach Änderungen auf der Seite wie Farbauswahl muss das CTL von 8 Select neu initialisert werden
                            WATO.elem(function() {
                                return typeof window._8select !== "undefined";
                            }, function(eightselectReady){
                                if(eightselectReady){
                                    try {
                                        window._8select.initCSE();
                                    } catch (error) {
                                        console.log('Error: ', error);
                                    }
                                }
                            });
                        }

                        window._eightselect_shop_plugin = window._eightselect_shop_plugin || {};
                        window._eightselect_shop_plugin.addToCart = function (sku, quantity, Promise) {
                            // the function has to return a promise
                            // you can use the injected Promise or use your own polyfill
                            
                            // add your cart logic here, for example
                            return new Promise(function(resolve, reject) {

                                    // var data = {
                                    //         productCodePost: sku,
                                    //         ff_id: sku.substring(0,5),
                                    //         ff_masterId: sku.substring(0,5),
                                    //         ff_title: "",
                                    //         ff_price: "",
                                    //         qty: String(quantity || 1),
                                    //         CSRFToken: WATO.qs('[name="CSRFToken"]').value
                                    //     },
                                    //     XHR = new XMLHttpRequest(),
                                    //     urlEncodedData = "",
                                    //     urlEncodedDataPairs = [],
                                    //     name;
                            
                                    // // Turn the data object into an array of URL-encoded key/value pairs.
                                    // for (name in data) {
                                    //     urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
                                    // }
                            
                                    // // Combine the pairs into a single string and replace all %-encoded spaces to
                                    // // the '+' character; matches the behaviour of browser form submissions.
                                    // urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
                            
                                    // // Set up our request
                                    // XHR.open('POST', 'https://www.hessnatur.com/de/cart/add');
                            
                                    // // Add the required HTTP header for form data POST requests
                                    // XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                            
                                    // // Finally, send our data.
                                    // XHR.send(urlEncodedData);

                                    // var t = ACC.productDetail.getHiddenFormFields().cartForm,
                                    //     i = ACC.productDetail.getSelectedColorVariant(),
                                    //     n = ACC.productDetail.getSelectedSizeVariant(i);

                                    // ACC.track.trackAddToCart("", "496730941", "1", n);


                                WATO.elem(function(){
                                    return typeof jQuery !== "undefined";
                                }, function(element){
                                    if(element){

                                        try {
                                            var clone = jQuery("#addToCartForm").clone(true);
                                            clone.attr("id", "kk_addToCartForm");
                                            clone.find('[name="productCodePost"]').val(sku);
                                            clone.find('[name="ff_id"]').val(sku.substring(0,5));
                                            clone.find('[name="ff_masterId"]').val(sku.substring(0,5));
                                            clone.find('[name="ff_title"]').val("");
                                            clone.find('[name="ff_price"]').val("");
                                            clone.find('[name="qty"]').val(1);
                                            jQuery("body").prepend(clone);
                                            jQuery("body").prepend('<select style="display:none;" name="desc_size" id="desc__size" class="kk_size h-no-margin-bottom js-size-picker">'+
                                            '<option selected="selected" value="'+sku.substring(7,9)+'"></option>'+
                                            '</select>');
                                            clone.find('button').click();
                                            
                                            pushGoal("kk_8s_addToCart");

                                            setTimeout(function(){
                                                jQuery("#kk_addToCartForm").remove();
                                                jQuery(".kk_size").remove();
                                            }, 5000);

                                            return resolve("done");

                                        } catch (error) {
                                            pushGoal("e1");
                                            return reject(new Error("add2cart failed"));
                                        }
                                    }
                                });
                            });
                        };
                    }
                });
            }
        });
    }

    // #look muss direkt existieren sonst wäre man vom Activation Test nicht in diesen gekommen
    build8select(WATO.qs('#look'), true);

    // Beim AddToCart wird der Warenkorblayer geöffnet
    WATO.ajax("/cart/add", function() {

        WATO.elem('#completeTheLookRecommendationsAddToCart', function(completeTheLookRecommendationsAddToCart){
            if(completeTheLookRecommendationsAddToCart){

                var cartLayerFromCLT = WATO.qs('#kk_addToCartForm'),
                    tempSKU = skuID;

                if(cartLayerFromCLT){
                    tempSKU = WATO.qs('[name="productCodePost"]', cartLayerFromCLT).value;

                    WATO.elem(function(){
                        return typeof jQuery !== "undefined";
                    }, function(element){
                        if(element){
                            jQuery("#kk_addToCartForm").remove();
                            jQuery(".kk_size").remove();
                        }
                    });
                }

                var existsReco = WATO.qs('#addedtocartrecommendationpopup [data-8select-widget-id="sys-acc"]');

                if(existsReco){
                    existsReco.parentNode.removeChild(existsReco);
                }

                // Weiteres CTL von 8 Select wird eingesetzt
                completeTheLookRecommendationsAddToCart[0].insertAdjacentHTML('beforebegin', 
                    '<div data-8select-widget-id="sys-acc" data-sku="'+tempSKU+'" data-include-css="true"></div>'
                );
                WATO.elem(function() {
                    return typeof window._8select !== "undefined";
                }, function(eightselectReady){
                    if(eightselectReady){
                        window._8select.initCSE();

                        WATO.elem('[data-8select-widget-id="sys-acc"] a', function(ctaModal){
                            if(ctaModal){
                                for (var i = 0; i < ctaModal.length; i++) {
                                    ctaModal[i].addEventListener('click', function(){
                                        pushGoal("kk_wklayer_ctl", true);
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    // Farbwechsel Interaktion
    // WATO.elem('.pds-cockpit__colorSwitch a', function(colorSwitcher){
    //     if(colorSwitcher){
    //         for (var k = 0; k < colorSwitcher.length; k++) {
    //             colorSwitcher[k].addEventListener('click', function(){
    //                 setTimeout(function(){
    //                     WATO.elem('#look', function(look){
    //                         if(look){
    //                             console.log('look[0]: ', look[0]);
    //                             build8select(look[0], false);
    //                         }
    //                     });
    //                 }, 500);
    //             });
    //         }
    //     }
    // });


    WATO.ajax("componentId=CrossSelling&productIdsToExclude=", function() {
        console.log("ajax");
        WATO.elem('#look', function(look){
            if(look){
                console.log('look[0]: ', look[0]);
                build8select(look[0], false);
            }
        });
    });

})(new window.WATO(), window);