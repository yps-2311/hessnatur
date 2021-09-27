// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function(WATO, window) {
    "use strict";
	
	
	window.iridion.econda.push(["SprintPS03tweak", "V1"]);

	/*jshint loopfunc: true */
	WATO.ps03tweak();
	WATO.setSegmentByProfile();
    WATO.ps03globalgoals();

	function pushGoal(key, value) {

		var payload = ['goal', 'ps03_' + key];

		if(value){
			payload.push(value);
		}

		window.iridion.push(payload);
	}
	
	function pushGoalAgain(key) {
		window.iridion.push(['goal', 'ps03_' + key, '', true]);
	}

	var locate = window.location;

	if(locate.pathname.indexOf("/p/") !== -1 && locate.search.indexOf("ps03=true") !== -1){
		
		WATO.elem('.pds__imageAndCockpitWrapper + .small-collapse > .small-12', function(prodInfo){
			if(prodInfo){

				prodInfo[0].insertAdjacentHTML('beforebegin', 
					// MV, 27.08.21 > Die Klasse js-product-reference darf nicht gesetzt werden, führt sonst zu einem Konflikt der 100% Ausspielung 
					// Refresh-PDS-Desktop und dem STL Element
					// '<div class="small-12 columns js-product-reference">'+
					'<div class="small-12 columns">'+
						'<div class="small-12 columns">'+
							'<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
								'<div class="column small-12 h-mediumOffset-bottom-outer">'+
									'<div class="h4 text-center recommendation-headline">Ähnlich wie dieser Artikel</div>'+
								'</div>'+
								'<div class="column small-12 h-no-padding-medium-down">'+
									'<div id="kk_likethisproduct" '+
										'class="flickity-productslider js-ecReco" '+
										'data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f" '+
										'data-wid="163" '+
										'data-count="20" '+
										'data-product="sku:' + WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7) + '">'+
											'Loading...'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
				);
				
				WATO.elem(function(){
					return typeof window.econda !== "undefined" && typeof jQuery !== "undefined" && 
						typeof window.Flickity !== "undefined" && typeof window.usercentrics !== "undefined" && 
						typeof window.econda.recengine !== "undefined" && typeof window.econda.recengine.Widget !== "undefined"; // typeof jQuery.fn.flickity !== "undefined"
				} , function(econdaRdy){
					if(econdaRdy){
						// Reco-Init aus dem komprimierten Code der Seite von Hessnatur
						// leicht angepasst "var n = $("#kk_likethisproduct")" und "new window.Flickity(t, ACC.productSlider.getFlickityOptions());"

						var e = window.usercentrics.getConsents("SJXtq4iOoZX");
						if (null !== e && e.consentStatus) {
							var t = $("#completeTheLookRecommendationsAddToCart");
							if (t.length > 0) return;

							var i = {};
							i.horizontal = function(e, t, i) {

								var sku = WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7);
								e.products = e.products.filter(function(product){
									return product.sku !== sku;
								});

								for (var n = e.products, a = [], o = $("#ecRecommendationsAddToCart").length > 0, s = "", r = 0; r < n.length; r++) {
									var l = n[r]
										, c = void 0 !== l.oldprice
										, u = void 0 !== l.basicprice;
									s += '<div class="' + (o ? "carousel-cell" : "productitem text-center small-8 medium-5 large-3 columns") + '">',
									s += '<a href="' + (l.deeplink ? l.deeplink : '//www.hessnatur.com/de/p/'+l.sku) + '" class="item__image">',
									s += '<img src="' + l.iconurl + '" />',
									s += '<div class="item__desc h-smallOffset-top-outer">',
									s += '<h4 class="desc-name">' + i.html(l.name) + "</h4>",
									s += '<div class="desc-price">',
									s += '<span class="price full ' + (c ? "show" : "hide") + '">' + l.oldprice + "</span>&nbsp;&nbsp;",
									s += '<span class="price ' + (c ? "show" : "hide") + '" style="margin-left: 3px">' + window.ACC.messages.productPriceFromClean + "</span>",
									s += '<span class="price special ' + (c ? "show" : "hide") + '">' + l.price + "</span>",
									s += '<span class="price ' + (c ? "hide" : "show") + '">' + l.price + "</span>",
									s += u ? '<div class="product-basic-price basicPrice">' + l.basicprice + "</div>" : "",
									s += "</div>",
									s += "</div>",
									s += "</a>",
									s += "</div>"
								}
								a.push(s);
								var d = a;
								$(t).html(d);
								// $(t).flickity(ACC.productSlider.getFlickityOptions())
								var flickotySlider = new window.Flickity(t, window.ACC.productSlider.getFlickityOptions());

								flickotySlider.on('staticClick', function(event, pointer, cellElement, cellIndex){
									// KK: PS03: Klick auf das 1. Produkt aus Reco-Element
									// KK: PS03: Klick auf das 2. Produkt aus Reco-Element
									// KK: PS03: Klick auf das 3. Produkt aus Reco-Element
									// KK: PS03: Klick auf das 4. Produkt aus Reco-Element
									pushGoalAgain('click_product_' + (cellIndex + 1));
									window.iridion.push(["segment", '32891']);
								});

								flickotySlider.on('dragStart', function() {
									pushGoal('click_product_change');
								});

								
								// var scrollGoalSend = false;
								// flickotySlider.on('scroll', function() {
								// 	if(!scrollGoalSend){
								// 		scrollGoalSend = true;
								// 		// KK: PS03: Klick auf Pfeil auf linken / rechten Seite - PDS - V1
								// 		pushGoal('click_product_change');
								// 	}
								// });

								// WATO.elem('#kk_likethisproduct > button', (buttons) => {
								// 	[...buttons].map((button) => {
								// 		button.addEventListener('click', () => {
								// 			// KK: PS03: Klick auf Pfeil auf linken / rechten Seite - PDS - V1
								// 			pushGoal('click_product_change');
								// 		});
								// 	});
								// });
							};
							
							var n = $("#kk_likethisproduct"), 
								a = n.data("accountid"), 
								o = n.data("wid"), 
								s = n.data("product"), 
								r = n.data("count"),
								l = new window.econda.recengine.Widget({
									element: n,
									renderer: {
										type: "function",
										rendererFn: i.horizontal
									},
									accountId: a,
									id: o,
									context: {
										products: [{
											id: s
										}]
									},
									chunkSize: r,
									empty: function(e) {
										this._onSuccessfulResponse(e)
									}
								});

							l.render();

							WATO.elem('#kk_likethisproduct .flickity-prev-next-button.previous', function(prevBtn){
								if(prevBtn){
									prevBtn[0].addEventListener('click', function(){
										pushGoal('click_product_change');
									});
								}
							});
							WATO.elem('#kk_likethisproduct .flickity-prev-next-button.next', function(nextBtn){
								if(nextBtn){
									nextBtn[0].addEventListener('click', function(){
										pushGoal('click_product_change');
									});
								}
							});

						}
					}
				});
			}
		});
	}

})(new window.WATO(), window);