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

	window.iridion.econda.push(["SprintAB20", "V0"]);

    function pushGoal(key, sendOnNextPageView){    
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}

    // Beim AddToCart wird der Warenkorblayer geöffnet
    WATO.ajax("/cart/add", function() {

        WATO.elem('#completeTheLookRecommendationsAddToCart a', function(ctaModal){
            if(ctaModal){
                for (var i = 0; i < ctaModal.length; i++) {
                    ctaModal[i].addEventListener('click', function(){
                        pushGoal("kk_wklayer_ctl", true);
                    });
                }
            }
        });
    });

    WATO.elem('#kk_ctlwrapper a', function(ctlwrapper){
        if(ctlwrapper){
            for (var j = 0; j < ctlwrapper.length; j++) {
                ctlwrapper[j].addEventListener('click', function(){
                    pushGoal("kk_8s_addToCart", true);
                });
            }
        }
    });

})(new window.WATO(), window);