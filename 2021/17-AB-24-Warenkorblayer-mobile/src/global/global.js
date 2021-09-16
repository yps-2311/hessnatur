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

			// pushSegment();
			if(_self.qsa('#look .item__image').lenght > 0){
				// Produkt das ein CLT hat in den Warenkorb gelegt
				// pushSegment();
			}
		});

		_self.elem('#offCanvasMiniCartWrapper [href="/de/cart"]', function(element){
			if(element){
				// Button zum Warenkorb geklickt
				element[0].addEventListener('click', function(){
					_self.goalPush("kk_ab24_gocart", true);
				});
			}
		});
	};
	
})(window.WATO, window);