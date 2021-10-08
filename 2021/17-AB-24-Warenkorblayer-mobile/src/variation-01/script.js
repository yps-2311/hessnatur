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

	var htmlElement = window.document.documentElement,
		productsInCart = JSON.parse(window.localStorage.getItem("kk_cart_ctl")) || {};

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

	function replaceImgInCart() {
		var allCartImgs = WATO.qsa('#offCanvasMiniCartWrapper img');

		for (var k = 0; k < allCartImgs.length; k++) {
			var thisImgSrc = allCartImgs[k].getAttribute('src');
			if(thisImgSrc.indexOf("hyb_redes_layer_thumb") !== -1){
				allCartImgs[k].setAttribute('src', thisImgSrc.replace('hyb_redes_layer_thumb','hyb_redes_reco'));
			}
		}
	}

	function openCTL(e) {
		var isAddToCart = typeof e.target !== "undefined",
			thisTarget = isAddToCart ? e.target : e;

		if(!isAddToCart) {
			addClass(thisTarget, 'kk_open');
		}else{
			thisTarget.classList.toggle('kk_open');
			WATO.goalPush("kk24_toggle_ctl");
		}

		if(!thisTarget.classList.contains('kk_requestIsSent')){
			addClass(thisTarget, "kk_requestIsSent");
	
			var cltWrapper = thisTarget.nextElementSibling,
				existsData = productsInCart[parseInt(cltWrapper.getAttribute('data-id'))];
	
			if(!cltWrapper.innerHTML.length && existsData){
				existsData.forEach(function(thisID){
	
					WATO.xhr_get('https://products.hessnatur.com/products/' + thisID, function (dataCTLProduct) {
						if (dataCTLProduct) {
							var ctlJSON = JSON.parse(dataCTLProduct).products[0],
								discountPrice = String(ctlJSON.price_prev).replace(".",","),
								normalPrice = String(ctlJSON.price).replace(".",",");
	
							cltWrapper.insertAdjacentHTML('beforeend', 
								'<a href="'+ctlJSON.permalink+'" class="item__image">'+
									'<img src="'+(typeof ctlJSON.imageOnlyProduct !== "undefined" ? ctlJSON.imageOnlyProduct : ctlJSON.image)+'" alt="'+ctlJSON.name+'" title="'+ctlJSON.name+'">'+
									'<div class="item__desc h-smallOffset-top-outer text-left">'+
										(
											ctlJSON.sale ? 
											'<p class="item__sale h4">Sale</p>'
											: ''
										)+
										'<span class="desc-name">'+ctlJSON.name+
										'<div class="desc-price">'+
											(
												discountPrice !== "0" ? 
												'<span class="price light special">Ab&nbsp;'+String(normalPrice).replace(".",",")+'&nbsp;€</span>'+
												'<span class="price light full">'+discountPrice+'&nbsp;€</span>' : 
												'<span class="price light">'+normalPrice+'&nbsp;€</span>'
											)+
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
		}
		
	}

	function setCTL(isAddedToCart) {
		console.log("setCTL");

		// Complete the Look unter die Produkte im Mini-WK bauen
		WATO.elem('#offCanvasMiniCartWrapper > .scrollContainer > .columns > .columns > .row:not(.collapse)', function(productList){
			if(productList){

				replaceImgInCart();

				var isTheAddedProductCTLOpen = false;

				for (var i = 0; i < productList.length; i++) {
					var product = productList[i],
						productID = WATO.qs('.flyout-image a', product).getAttribute('href').split("/p/")[1].substring(0,7),
						ctlProductIDs = productsInCart[parseInt(productID)];

					if(productsInCart && ctlProductIDs && !WATO.qs('.kk_cltwrapper', product)){
						WATO.qs('.h-list--horizontal', product).insertAdjacentHTML('afterend', 
							'<div class="kk_cltwrapper">'+
								'<div class="kk_clt_title"></div>'+ // Komplettes Outfit ansehen
								'<div class="kk_basket_ctl" data-id="'+productID+'"></div>'+
							'</div>'
						);

						if(productID.indexOf(isAddedToCart) !== -1 && !isTheAddedProductCTLOpen){
							// Beim in den Warenkorb legen wird das erste CTL angezeigt
							openCTL(WATO.qs('.kk_clt_title', product));
							isTheAddedProductCTLOpen = true;

							if(ctlProductIDs){
								switch (ctlProductIDs.length) {
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
							}
						}

						WATO.qs('.kk_clt_title', product).addEventListener('click', openCTL);
					}
				}
			}
		});
	}
	
	WATO.ajax('/cart/add', function(){
		// Add to Cart

		var miniCartWrapper = WATO.qs('#offCanvasMiniCartWrapper'),
			selectedColor = WATO.qs('.pds-cockpit__colorSwitch .active'),
			prodID = WATO.qs('[itemprop="productID"]').textContent,
			prodID7 = prodID + (selectedColor ? selectedColor.getAttribute('data-color') : '');

		// Grüne Info dass ein Produkt in den WK gelegt wurde
		if(!WATO.qs('.kk_goodchoice', miniCartWrapper.parentNode)){
			WATO.qs('.scrollContainer', miniCartWrapper).insertAdjacentHTML('beforebegin', 
				'<div class="row kk_goodchoice"><b>Gute Wahl,</b>&nbsp;der Artikel liegt in Ihrem Warenkorb.</div>'
			);

			// CLT Produkte dem LS hinzufügen
			var ctlItems = WATO.qsa('#look .item__image');

			if (ctlItems.length) {
				var ctlIDs = [];
				for (var i = 0; i < ctlItems.length; i++) {
					ctlIDs.push(parseInt(ctlItems[i].getAttribute('href').split("/p/")[1].substring(0,7)));
				}
				productsInCart[prodID7] = ctlIDs;
				console.log('prodID7: ', prodID7);
				console.log('productsInCart[prodID7]: ', productsInCart[prodID7]);
			}

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

			setCTL(prodID7);
		}
	});

	WATO.ajax('/cart/quickUpdate', function(){
		setTimeout(function(){
			setCTL(false);
		}, 500);
	});

	setCTL(false);

	WATO.elem('#offCanvasRight', function(offCanvasRight){
		if(offCanvasRight){
			offCanvasRight = offCanvasRight[0];

			// eine Instanz des Observers erzeugen
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					console.log(mutation.type);
					if(offCanvasRight.classList.contains('is-open')){
						addClass(htmlElement, 'kk_noscroll');
					}else{
						removeClass(htmlElement, 'kk_noscroll');
					}
				});
			});

			// Konfiguration des Observers: alles melden - Änderungen an Daten, Kindelementen und Attributen
			var config = { attributes: true, childList: false, characterData: false };

			// eigentliche Observierung starten und Zielnode und Konfiguration übergeben
			observer.observe(offCanvasRight, config);
		}
	});


})(new window.WATO(), window);