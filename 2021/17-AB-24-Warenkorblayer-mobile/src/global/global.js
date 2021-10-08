/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
    "use strict";

	/*jshint loopfunc: true */

	WATO.prototype.goalPush = function(key, sendOnNextPageView){
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}

	WATO.prototype.ab24goals = function(){
		var _self = this;

		function pushSegment(key) {
			window.iridion.push(['segment', key]);
		}

		_self.ajax('/de/cart/add', function(){
			// Add to Cart
			if(_self.qsa('#look .item__image').length > 0){
				// Produkt das ein CLT hat in den Warenkorb gelegt
				pushSegment('32902');
			}
		});

		_self.elem('#offCanvasMiniCartWrapper', function(offCanvasMiniCartWrapper){
			if(offCanvasMiniCartWrapper){
				// Button zum Warenkorb geklickt
				offCanvasMiniCartWrapper[0].addEventListener('click', function(e){
					var hrefFromButton = e.target.getAttribute('href');

					if(hrefFromButton && hrefFromButton === "/de/cart"){
						_self.goalPush("kk_ab24_gocart", true);
					}
				});
			}
		});
	};
	
})(window.WATO, window);