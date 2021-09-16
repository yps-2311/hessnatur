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

	// window.iridion.econda.push(["SprintAB24", "V1"]);

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

	var htmlElement = window.document.documentElement,
		productsInCart = JSON.parse(window.localStorage.getItem("kk_cart_ctl")) || {};

	function setCTL() {
		// Complete the Look unter die Produkte im Mini-WK bauen
		WATO.elem('#offCanvasMiniCartWrapper > .scrollContainer > .columns > .columns > .row:not(.collapse)', function(productList){
			if(productList){

				for (var i = 0; i < productList.length; i++) {
					var product = productList[i],
						productID = WATO.qs('.flyout-image a', product).getAttribute('href').split("/p/")[1].substring(0,7);

					if(productsInCart && productsInCart[parseInt(productID)]){
						WATO.qs('.h-list--horizontal', product).insertAdjacentHTML('afterend', 
							'<div class="kk_cltwrapper">'+
								'<div class="kk_clt_title">Komplettes Outfit ansehen</div>'+
								'<div class="kk_basket_ctl" data-id="'+productID+'"></div>'+
							'</div>'
						);

						WATO.qs('.kk_clt_title', product).addEventListener('click', function(e){
							e.target.classList.toggle('kk_open');

							var cltWrapper = e.target.nextElementSibling,
								existsData = productsInCart[parseInt(cltWrapper.getAttribute('data-id'))];

							if(!cltWrapper.innerHTML.length && existsData){
								existsData.forEach(function(thisID){

									WATO.xhr_get('https://products.hessnatur.com/products/' + thisID, function (dataCTLProduct) {
										if (dataCTLProduct) {
											var ctlJSON = JSON.parse(dataCTLProduct).products[0];

											cltWrapper.insertAdjacentHTML('beforeend', 
												'<a href="'+ctlJSON.permalink+'" class="item__image">'+
													'<img src="'+ctlJSON.image+'" alt="'+ctlJSON.name+'" title="'+ctlJSON.name+'">'+
													'<div class="item__desc h-smallOffset-top-outer text-left">'+
														'<span class="desc-name">'+ctlJSON.name+
														'<div class="desc-price">'+
															'<span class="price light">'+String(ctlJSON.price).replace(".",",")+'&nbsp;€</span>'+
														'</div>'+
													'</div>'+
												'</a>'
											);
											WATO.qs('.item__image:last-child', cltWrapper).addEventListener('click', function(){
												WATO.goalPush("kk_ab24_ctlprod", true);
											});
										}
									});
								});
							}
						});
					}
				}
			}
		});
	}
	
	WATO.ajax('/de/cart/add', function(){
		// Add to Cart

		var miniCartWrapper = WATO.qs('#offCanvasMiniCartWrapper'),
			selectedColor = WATO.qs('.pds-cockpit__colorSwitch .active'),
			prodID = WATO.qs('[itemprop="productID"]').textContent,
			prodID7 = prodID + (selectedColor ? selectedColor.getAttribute('data-color') : '');

		// Grüne Info dass ein Produkt in den WK gelegt wurde
		WATO.qs('.scrollContainer', miniCartWrapper).insertAdjacentHTML('beforebegin', 
			'<div class="row kk_goodchoice"><b>Gute Wahl,</b>&nbsp;der Artikel liegt in Ihrem Warenkorb.</div>'
		);

		// CLT Produkte dem LS hinzufügen
		WATO.elem('#look .item__image', function(ctlItems){
			if(ctlItems){
				var ctlIDs = [];
				for (var i = 0; i < ctlItems.length; i++) {
					ctlIDs.push(parseInt(ctlItems[i].getAttribute('href').split("/p/")[1].substring(0,7)));
				}
				productsInCart[prodID7] = ctlIDs;
			}
		});

		// Im LS gespeichert
		window.localStorage.setItem("kk_cart_ctl", JSON.stringify(productsInCart));

		// Bei Interaktion mit dem WK soll dieser offen bleiben und 
		// nicht wie Control-Verhalten nach 3 Sek sich eingenständig schließen
		if(!miniCartWrapper.classList.contains('kk_haslistener')){
			miniCartWrapper.addEventListener('touchstart', function(){

				addClass(miniCartWrapper,'kk_haslistener');
				addClass(htmlElement,'kk_minicartopen');

				WATO.qs('.close-button', miniCartWrapper).addEventListener('click', function(){
					removeClass(htmlElement,'kk_minicartopen');
				});
				WATO.qs('#offCanvasRight + .off-canvas-content').addEventListener('click', function(){
					removeClass(htmlElement,'kk_minicartopen');
				});
			});
		}

		setCTL();
	});	

	setCTL();


})(new window.WATO(), window);