// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V2
 * @name Variation 02
 * @description
 */
(function(WATO) {
    "use strict";

	/*jshint loopfunc: true */

	// window.iridion.econda.push(["SprintAB24", "V2"]);

	WATO.ab24goals();

	function addClass(elem, thisclassname) {
		if(elem){
			elem.classList.add(thisclassname);
		}
	}
	function removeClass(elem, thisclassname) {
		if(elem){
			elem.classList.remove(thisclassname);
		}
	}

	// V2
	WATO.ajax('/de/cart/add', function(){
		// Add to Cart
		
		var ctlItems = WATO.qsa('#look .item__image'),
			diesesProduct = WATO.qs('#offCanvasMiniCartWrapper .row:first-child > .columns'),
			allItemsHTML = '';
		
		for (var i = 0; i < ctlItems.length; i++) {
			allItemsHTML += ctlItems[i].outerHTML;
		}

		// Diese Klasse sorgt dafür dass im Hintergrund der Mini-WK nicht automatisch ausklappt
		addClass(document.documentElement,'kk_modalIsOpen');

		// Neuer Warenkorb Layer
		WATO.qs('body').insertAdjacentHTML('afterbegin', 
			'<div class="reveal-overlay kk_cartlayer">'+
				'<div class="reveal">'+
					'<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
						'<span aria-hidden="true">×</span>'+
					'</button>'+
					'<div class="row kk_goodchoice"><b>Gute Wahl,&nbsp;</b>der Artikel liegt in Ihrem Warenkorb.</div>'+
					(diesesProduct ? diesesProduct.outerHTML : '')+
					(ctlItems.length > 0 ? // Nur anzeigen wenn es CLT gibt
						'<h4 class="columns">Zum kompletten Outfit</h4>'+
						'<div class="kk_basket_ctl columns">'+
							allItemsHTML+
						'</div>'
					:'')+
					'<div class="columns">'+
						'<a href="/de/cart" class="button expanded -padding-tight js-switch-to-page-button">Zum&nbsp;Warenkorb</a>'+
					'</div>'+
					'<u>Weiter einkaufen</u>'+
				'</div>'+
			'</div>'
		);

		var cartLayer = WATO.qs('.kk_cartlayer'),
			ctlProds = WATO.qsa('.kk_basket_ctl a.item__image', cartLayer),
			closeLayer = function(goalName) {
				WATO.goalPush(goalName);
				// Muss warten bis der default WK weggeklappt ist
				setTimeout(function(){
					removeClass(document.documentElement,'kk_modalIsOpen');
				}, 3000);
				cartLayer.parentNode.removeChild(cartLayer);
			};

		// Layer schließen
		cartLayer.addEventListener('click', function(e){
			if(e.target.classList.contains('kk_cartlayer')){
				closeLayer("kk_ab24_closelayer");
			}
		});

		// Weiter einkaufen Link
		WATO.qs('u', cartLayer).addEventListener('click', function(){
			closeLayer("kk_ab24_continue");
		});

		// Layer schließen
		WATO.qs('.close-button', cartLayer).addEventListener('click', function(){
			closeLayer("kk_ab24_closelayer");
		});

		// Weiter zum Warenkorb
		WATO.qs('.js-switch-to-page-button', cartLayer).addEventListener('click', function(){
			closeLayer("kk_ab24_gocart", true);
		});

		// Auf dein CLT-Produkt im MiniWK geklickt
		ctlProds.forEach(function(item){
			item.addEventListener('click', function(){
				WATO.goalPush("kk_ab24_ctlprod", true);
			});
		});
	});

})(new window.WATO());