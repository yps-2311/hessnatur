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
	function setSegment(thisID) {
		if(!window.iridion.push(['hasSegment', String(thisID)])){
			window.iridion.push(['segment', String(thisID)]);
		}
    }
	

	// V2
	WATO.ajax('/de/cart/add', function(){
		// Add to Cart
		
		var ctlItems = WATO.qsa('#look .item__image'),
			thisColor = WATO.qs('[itemprop="color"] +ul .active'),
			thisProdID = WATO.qs('[itemprop="productID"]').textContent + (thisColor ? thisColor.getAttribute('data-color') : ''),
			cartProducts = WATO.qsa('#offCanvasMiniCartWrapper .flyout-image > a'),
			diesesProduct = '',
			allItemsHTML = '';

		for (var j = 0; j < cartProducts.length; j++) {
			if(cartProducts[j].getAttribute('href').indexOf(thisProdID) !== -1){
				diesesProduct = cartProducts[j].parentNode.parentNode.parentNode.outerHTML.replace('hyb_redes_layer_thumb','hyb_redes_reco');
			}
		}

		for (var i = 0; i < ctlItems.length; i++) {
			allItemsHTML += ctlItems[i].outerHTML;
		}

		switch (ctlItems.length) {
			case 1:
				setSegment("32898");
				break;
			case 2:
				setSegment("32899");
				break;
			case 3:
			case 4:
			case 5:
				setSegment("32900");
				break;
		}

		// Diese Klasse sorgt dafür dass im Hintergrund der Mini-WK nicht automatisch ausklappt
		addClass(document.documentElement,'kk_modalIsOpen');

		// console.log('ctlItems.length: ', ctlItems.length);

		// Neuer Warenkorb Layer
		WATO.qs('body').insertAdjacentHTML('afterbegin', 
			'<div class="reveal-overlay kk_cartlayer">'+
				'<div class="reveal">'+
					'<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
						'<span aria-hidden="true">×</span>'+
					'</button>'+
					'<div class="row kk_goodchoice"><b>Gute Wahl,&nbsp;</b>der Artikel liegt in Ihrem Warenkorb.</div>'+
					diesesProduct+
					(ctlItems.length > 0 ? // Nur anzeigen wenn es CLT gibt
						'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="19" xmlns:v="https://vecta.io/nano">'+
							'<path d="M28.469 13.401C26.59 8.559 22.659 4.507 17.86 2.52 12.323.227 5.628.351.384 3.39c-.678.393-.177 1.459.561 1.243 5.166-1.51 10.783-1.94 15.835.272 4.097 1.794 7.377 5.083 9.07 9.148-.495-.251-1-.486-1.52-.7-1.56-.64-2.746 1.488-1.235 2.353l4.782 2.74c.59.338 1.515.083 1.794-.559.796-1.831 1.415-3.722 1.824-5.676.351-1.674-2.238-2.275-2.589-.598a27.56 27.56 0 0 1-.438 1.789z" fill="#393939" fill-rule="evenodd"/>'+
						'</svg>'+
						'<h4 class="columns">'+(typeof window.basketTrackingObject !== "undefined" && typeof window.basketTrackingObject.category_id !== "undefined" && window.basketTrackingObject.category_id === "SO-007" ? "Runden Sie Ihren Einkauf ab" : 'komplettes Outfit')+'</h4>'+
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