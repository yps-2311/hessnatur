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

    /*jshint loopfunc: true */

    var eightSelectAPIid = 'b0c6f362-6371-461e-b1b6-6cab65da6a1e',
        skuID = WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7);

    function build8select(ctl, firstcall) {
        WATO.elem('.kk_sliderWrapper', function(jumpCompleteLookBtn){
            if(jumpCompleteLookBtn){
                WATO.elem('.pds__imageAndCockpitWrapper .mz-ready img', function(mainImg){
                    if(mainImg){
                        // Ankerbutton liegt unter den Heroshots und wird für 8Select angepasst
                        var ankerButton = WATO.qs('.js-jump-complete-look'),
                            colorID = WATO.qs('.pds-cockpit__colorSwitch .active');

                        ankerButton.setAttribute('data-8select-widget-id', 'sys-button');
                        ankerButton.setAttribute('href', '#');

                        // SKU wird neu ermittelt mithilft der alten SKU und einer ggfs. neuen Farb-ID
                        if(colorID){
                            skuID = skuID.substring(0,5) + colorID.getAttribute('data-color');
                        }

                        // CTL wird eingebaut inclusive neuer Headline von uns
                        ctl.insertAdjacentHTML('beforebegin', 
                            '<div class="kk_subline">Complete the Look</div>'+
                            '<div class="kk_teaser">Für mehr Stil: Ihr Perfektes Outfit</div>'+
                            '<div data-8select-widget-id="sys-psv" data-sku="'+skuID+'"></div>'
                        );

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
                            window._8select.initCSE();
                        }
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
                // Weiteres CTL von 8 Select wird eingesetzt
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

    // Farbwechsel Interaktion
    WATO.elem('.pds-cockpit__colorSwitch a', function(colorSwitcher){
        if(colorSwitcher){
            for (var k = 0; k < colorSwitcher.length; k++) {
                colorSwitcher[k].addEventListener('click', function(){
                    WATO.elem('#look', function(look){
                        if(look){
                            build8select(look, false);
                        }
                    });
                });
            }
        }
    });

})(new window.WATO(), window);