// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

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

	// window.iridion.econda.push(["SprintAB22", "V1"]);

	// function addClass(elem, thisclassname) {
	// 	if(elem){
	// 		elem.classList.add(thisclassname);
	// 	}
	// }
	// function removeClass(elem, thisclassname) {
	// 	if(elem){
	// 		elem.classList.remove(thisclassname);
	// 	}
	// }
	// function pushSegment(key) {
	// 	window.iridion.push(['segment', key]);
	// }


	// WATO.ajax('/de/cart/add', function(){
	// 	// Add to Cart

	// 	WATO.qs('#offCanvasMiniCartWrapper > .scrollContainer').insertAdjacentHTML('beforebegin', 
	// 		'<div class="row kk_goodchoice"><b>Gute Wahl,</b>&nbsp;der Artikel liegt in Ihrem Warenkorb.</div>'
	// 	);
	// 	setCTL();

	// });


	// function setCTL() {
	// 	WATO.elem('#offCanvasMiniCartWrapper > .scrollContainer', function(productListWrapper){
	// 		if(productListWrapper){
	// 			productListWrapper = productListWrapper[0];
	
	// 			WATO.elem('#look .item__image', function(ctlItems){
	// 				if(ctlItems){
	// 					var allItemsHTML = '';
	// 					for (var i = 0; i < ctlItems.length; i++) {
	// 						allItemsHTML += ctlItems[i].outerHTML;
	// 					}
	
	// 					WATO.qs('.row:first-child > .columns', productListWrapper).insertAdjacentHTML('beforeend', 
	// 						'<div class="kk_cltwrapper">'+
	// 							'<div class="kk_clt_title">Komplettes Outfit ansehen</div>'+
	// 							'<div class="kk_basket_ctl">'+
	// 								allItemsHTML+
	// 							'</div>'+
	// 						'</div>'
	// 					);
	// 					WATO.qs('.kk_clt_title', productListWrapper).addEventListener('click', function(e){
	// 						e.target.classList.toggle('kk_open');
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});
	// }

	// setCTL();




	// V2
	WATO.ajax('/de/cart/add', function(){
		// Add to Cart
		
		var ctlItems = WATO.qsa('#look .item__image'),
			allItemsHTML = '';
		
		for (var i = 0; i < ctlItems.length; i++) {
			allItemsHTML += ctlItems[i].outerHTML;
		}

		window.document.documentElement.classList.add('kk_modalIsOpen');

		WATO.qs('body').insertAdjacentHTML('afterbegin', 
			'<div class="reveal-overlay kk_cartlayer">'+
				'<div class="reveal">'+
					'<div class="row kk_goodchoice"><b>Gute Wahl,</b>&nbsp;der Artikel liegt in Ihrem Warenkorb.</div>'+
					WATO.qs('#offCanvasMiniCartWrapper .row:first-child > .columns').outerHTML+
					'<h4 class="columns">Zum kompletten Outfit</h4>'+
					'<div class="kk_basket_ctl columns">'+
						allItemsHTML+
					'</div>'+
					'<div class="columns">'+
						'<a href="/de/cart" class="button expanded -padding-tight js-switch-to-page-button">Zum&nbsp;Warenkorb</a>'+
					'</div>'+
					'<u>Weiter einkaufen</u>'+
				'</div>'+
			'</div>'
		);
		var cartLayer = WATO.qs('.kk_cartlayer');

		cartLayer.addEventListener('click', function(e){
			if(e.target.classList.contains('kk_cartlayer')){
				cartLayer.parentNode.removeChild(cartLayer);
			}
		});
		WATO.qs('u', cartLayer).addEventListener('click', function(){
			cartLayer.parentNode.removeChild(cartLayer);
		});
	});
	


})(new window.WATO(), window);