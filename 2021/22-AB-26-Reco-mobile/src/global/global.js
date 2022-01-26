/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

	WATO.prototype.ab26global = function(){

        var _self = this,
            swipeSend = false;

        function goalPush(key){
			window.iridion.push(['goal', key]);
		}

        _self.elem('#ecRecommendationsContainer', function(crossSellingEconda){
            if(crossSellingEconda){
                crossSellingEconda[0].addEventListener('touchmove', function(){
                    if(!swipeSend){
                        swipeSend = true;
                        goalPush("kk26_swipe_reco");
                    }
                });
            }
        });

        if(window.location.search.indexOf("emcs1=91_ARP_Produktdetailseite") !== -1){
            goalPush("klick_recoProduct");

            _self.ajax("/cart/add", function(){
                goalPush("kk26_recoproduct_addtocart");
            });
        }
    };
	
})(window.WATO, window);