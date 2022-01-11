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

        function goalPush(key, sendOnNextPageView){
            console.log('key: ', key);
			if(sendOnNextPageView){
				window.iridion.push(['goal', key, '', true]);
			}else{
				window.iridion.push(['goal', key]);
			}
		}

        _self.elem('[data-componentid="CrossSellingEconda"]', function(crossSellingEconda){
            if(crossSellingEconda){
                var allProducts = _self.qsa('.item__image', crossSellingEconda[0].parentNode);

                allProducts.forEach(function(item){
                    item.addEventListener('click', function(){
                        goalPush("klick_recoProduct", true);
                    });
                });

                _self.qs('#ecRecommendationsContainer', crossSellingEconda[0]).addEventListener('touchmove', function(){
                    if(!swipeSend){
                        swipeSend = true;
                        goalPush("kk26_swipe_reco", true);
                    }
                });
            }
        });
        
        
    };
	
})(window.WATO, window);