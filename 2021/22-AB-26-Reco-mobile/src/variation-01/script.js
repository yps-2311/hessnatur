// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
 (function(WATO) {
    "use strict";

    window.iridion.econda.push(["AB26", "V1"]);

    WATO.elem('[data-componentid="CrossSellingEconda"]', function(crossSellingEconda){
        if(crossSellingEconda){ 
            crossSellingEconda = crossSellingEconda[0];
            
            var qualiBadges = WATO.qs('.medium-uncollapse > .kk_quali'),
                productInfos = WATO.qs('.medium-uncollapse > .small-12');

            if(qualiBadges){
                qualiBadges.insertAdjacentElement('afterend', crossSellingEconda);
            }else if(productInfos){
                productInfos.insertAdjacentElement('beforebegin', crossSellingEconda);
            }

            WATO.ab26global();
        }
    });

    var multiReloadStop = false;
        // scrollGoalSend = false;

    WATO.ajax("/ProductReferencesComponentController/", function(){
        if(!multiReloadStop){
            multiReloadStop = true;

            WATO.elem('#ecRecommendationsContainer > .productitem', function(ecRecommendationsContainer){
                if(ecRecommendationsContainer){
                    ecRecommendationsContainer[0].parentNode.parentNode.innerHTML = ecRecommendationsContainer[0].parentNode.parentNode.innerHTML;

                    WATO.elem(function(){
                        return typeof $ !== "undefined";
                    }, function(isjq){
                        if(isjq){
                            // Doku https://flickity.metafizzy.co/
                            var slider = $('#ecRecommendationsContainer');

                            // slider.on( 'scroll.flickity', function() {
                            //     if(!scrollGoalSend){
                            //         scrollGoalSend = true;
                            //         window.iridion.push(['goal', 'kk26_swipe_reco']);
                            //     }
                            // });

                            slider.flickity({
                                draggable: true,
                                cellAlign: 'left',
                                contain: true,
                                prevNextButtons: false,
                                pageDots: false,
                                percentPosition: true,
                                setGallerySize: true
                            });

                            setTimeout(function(){
                                WATO.ab26global();
                            }, 1000);
                        }
                    });
                }
            });
            setTimeout(function(){
                multiReloadStop = false;
            }, 500);
        }
    });

})(new window.WATO());