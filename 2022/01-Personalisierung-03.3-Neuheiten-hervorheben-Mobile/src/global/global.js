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
	
	WATO.prototype.ps03_3 = function(){

		var WATO = this,
			econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
			UrlPathname = window.location.pathname,
			productIDs = [];

		function isCustomerTypeInteressent() {
			var customerType = window.iridion.push(['profile', 'getValue', "customerType"]);
			return !window.localStorage.getItem("kk_hasbought") && customerType !== "Neukunde" && customerType !== "Bestandskunde";
		}

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

		function ucFirst(string) {
			return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
		}

		if(UrlPathname.indexOf("/c/") !== -1){
			// Kategorieseiten
			
			var	position = '.js-product-grid > *:nth-child(8) > div';

			// Auf der Seite Trends soll die Reco eine Zeile weiter oben an gezeigt werden.
			if(UrlPathname.indexOf("trends") !== -1){
				position = ".js-product-grid > *:nth-child(6) > div";
			}

			// Produkte zählen
			WATO.elem('.footerWrapper', function(element){
				if(element){
					var appProducts = WATO.qsa('.gridviewProductItemWrapper .dropdown-pane');
					for (var i = 0; i < appProducts.length; i++) {
						productIDs.push(appProducts[i].getAttribute('id').substring(0,5));
					}
				}
			});

			// Wenn Econda geladen ist
			WATO.elem(function(){
				return 	typeof window.econda !== "undefined" && 
						typeof window.econda.recengine !== "undefined" && 
						typeof window.econda.recengine.Widget !== "undefined";
			}, function(isLoadedEconda){
				if(isLoadedEconda){
					// console.log('isLoadedEconda: ', isLoadedEconda);
					// Wenn Econda geladen ist kann der Call abgeschickt werden

					var tempCat = window.location.pathname.replace("/de/", "").split("/"),
						mainCat = tempCat[0] === "sale" ? ucFirst(tempCat[1]) : ucFirst(tempCat[0]);

					if(mainCat === "Junior" || mainCat === "Babys"){
						mainCat = "Baby";
					}
					
					WATO.ajaxCallback("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
						try {
							var data = JSON.parse(callbackData.response),
								items = data.items,
								itemsTemp = [];
								
								// console.log('data: ', data);
								// console.log('items: ', items);

							if(items.length === 0){
								WATO.qs('#kk_crossprods').style.display = "none";
							}else{
								// Alle Produkte die bereits auf dieser Seite zu sehen sind werden aus der Liste entfernt
								for (var j = 0; j < items.length; j++) {
									if (productIDs.indexOf(items[j].id) === -1) {
										itemsTemp.push(items[j]);
									}
								}
								items = itemsTemp;

								// Zufällige Reihenfolge der Produkte
								for (var i = items.length - 1; i > 0; i--) {

									var j = Math.floor(Math.random() * (i + 1)),
										temp = items[i];

									items[i] = items[j];
									items[j] = temp;
								}

								// Die neue Reco
								WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
									if(cbody){
										cbody = cbody[0];

										cbody.innerHTML = '';

										var headlineText = isCustomerTypeInteressent() ? "Neu in unserem Sortiment" :  "Neu seit Ihrem letzten Besuch";

										cbody.insertAdjacentHTML('beforeend',  
											'<div class="carousel-cell kk_blackbox">'+
												'<h4>'+headlineText+'</h4>'+
												// (userTypeText[1] ? '<div class="kk_subline">'+userTypeText[1]+'</div>' : '' )+
											'</div>'
										);

										var countProducts = items.length < 10 ? items.length : 10;

										for (var j = 0; j < countProducts; j++) {

											var item = items[j],
												imgURL = item.iconurl.replace("large","small").replace("_7.jpg","_1.jpg").replace("generalfeed_small","hyb_redes_list_main");

											fetch(imgURL)
												.then((res) => {
													res.blob().then((data) => {
														try {
															if(typeof data.size !== "undefined" && data.size === 5803){ // 3080
																// Hier wird anhand der Größe des zurückgelieferten Bildes erkannt dass es sich um einen Platzhalter vom Imageserver handelt
																var imgToChangeSrc = WATO.qs('img[src="'+res.url+'"]');
																if(imgToChangeSrc){
																	imgToChangeSrc.setAttribute('src', res.url.replace("_1.jpg","_7.jpg"));
																}
															}
														} catch(error) {
															// console.log('Error: ', error);
															window.iridion.push(['goal', 'error_setup', error.toString()]);
														}
													});
												}).catch((error) => {
													// console.log('Error: ', error);
													window.iridion.push(['goal', 'error_setup', error.toString()]);
												});

											cbody.insertAdjacentHTML('beforeend',  
												'<a class="carousel-cell" href="' + item.deeplink + '?ps03=true" data-index="' + (j+1) + '">'+
													'<div class="kk_cimg">'+
														'<img src="' + imgURL + '">'+
														'<div class="kk_badge">'+
															(item.isVegan === "true" ? '<span class="kk_vegan">Vegan</span>' : '') + // '<img src="' + imgs7 + 'overlay_vegan.svg" alt="Vegan">'
															((new Date().getTime() - new Date(item.g_ab).getTime()) / (1000 * 3600 * 24) < 45 ? '<span class="kk_new">New</span>' : '')+ // '<img src="'+imgs7+'overlay_neu.svg" alt="Neu">'
														'</div>'+
													'</div>'+
													'<div class="kk_title">' + item.name + '</div>'+
													'<div class="kk_price">' + item.price + '</div>'+
												'</a>'
											);
										}

										var	newURL = "NEU";

										switch (mainCat) {
											case 'Herren':
												newURL = 'herren/bekleidung/c/neu-herren';
												break;
											case 'Damen':
												newURL = 'damen/bekleidung/c/neu-damen';
												break;
											case 'Baby':
											// case 'Junior':
												newURL = 'baby/bekleidung/c/neu-junior';
												break;
											case 'Home':
												newURL = 'home/bekleidung/c/neu-home';
												break;
											default:
												if(UrlPathname.indexOf('herren') !== -1){
													newURL = 'herren/bekleidung/c/neu-herren';
												}else if(UrlPathname.indexOf('damen') !== -1){
													newURL = 'damen/bekleidung/c/neu-damen';
												}else if(UrlPathname.indexOf('baby') !== -1 || UrlPathname.indexOf('junior') !== -1){
													newURL = 'baby/bekleidung/c/neu-junior';
												}else if(UrlPathname.indexOf('home') !== -1){
													newURL = 'home/bekleidung/c/neu-home';
												}
												break;
										}

										cbody.insertAdjacentHTML('beforeend',  
											'<div class="carousel-cell kk_blackbox">'+
												'<h4>Noch mehr Neuheiten entdecken?</h4>'+
												'<a class="kk_subline" href="/de/'+newURL+'">zu allen Neuheiten</a>'+
											'</div>'
										);

										// https://www.hessnatur.com/de/herren/bekleidung/c/neu-herren
										// https://www.hessnatur.com/de/damen/bekleidung/c/neu-damen
										// https://www.hessnatur.com/de/baby/bekleidung/c/neu-junior
										// https://www.hessnatur.com/de/home/heimtextilien/c/neu-home

										// WATO.elem(function(){
										// 	return typeof window.Flickity !== "undefined";
										// }, function(){

										// 	var scrollGoalSend = false;

										// 	// Slider init
										// 	new window.Flickity(cbody, {
										// 		cellAlign: 'left',
										// 		cellSelector: '.carousel-cell',
										// 		draggable: true,
										// 		wrapAround: false,
										// 		pageDots: false,
										// 		contain: false,
										// 		groupCells: 1
										// 	}).on('staticClick', function(event, pointer, cellElement, cellIndex){
										// 		// KK: PS03: Klick auf das 1. Produkt aus Slide-Element
										// 		// KK: PS03: Klick auf das 2. Produkt aus Slide-Element
										// 		// KK: PS03: Klick auf das 3. Produkt aus Slide-Element
										// 		// KK: PS03: Klick auf das 4. Produkt aus Slide-Element
										// 		pushGoalAgain('click_slide_' + cellIndex);
										// 	}).on('dragStart', function() {
										// 		if(!scrollGoalSend){
										// 			scrollGoalSend = true;
										// 			// KK: PS03: Klick auf Pfeil auf der rechten / linken Seite - PDL
										// 			pushGoal('click_slide_change');
										// 		}
										// 	});

										// 	WATO.elem('#kk_crossprods button.next', function(nextButton){
										// 		if(nextButton){
										// 			nextButton[0].addEventListener('click', function(){
										// 				// KK: PS03: Klick auf Pfeil auf der rechten / linken Seite - PDL
										// 				pushGoal('click_slide_change');
										// 			});
										// 		}
										// 	});
										// });

										var touchmoveEvent = false,
											touchmovePixelsX = 0;

										cbody.addEventListener('touchmove', function(changesData){
											var temp = changesData.changedTouches[0].clientX;
											if(!touchmoveEvent && touchmovePixelsX > temp + 50){
												touchmoveEvent = true;
												pushGoal('click_slide_change');
											}
											if(touchmovePixelsX === 0){
												touchmovePixelsX = temp;
											}
										});

										WATO.qsa('.carousel-cell', cbody).forEach(function(item, cellIndex){
											item.addEventListener('click', function(){
												// KK: PS03: Klick auf das 1. Produkt aus Slide-Element
												// KK: PS03: Klick auf das 2. Produkt aus Slide-Element
												// KK: PS03: Klick auf das 3. Produkt aus Slide-Element
												// KK: PS03: Klick auf das 4. Produkt aus Slide-Element
												pushGoalAgain('click_slide_' + cellIndex);
											});
											
										});

									}
								});
							}

							
						} catch (error) {
							// console.log('Error: ', error);
							WATO.elem('#kk_crossprods', function(crossprods){
								if(crossprods){
									crossprods[0].style.display = "none";
								}
							});
						}
					});

					try {

						var widget = new window.econda.recengine.Widget({
							accountId: econdaAccountID,
							id: 128,
							
							context: {
								categories: [{
									type: 'productcategory',
									path: mainCat
								}]
							}
						});

						widget.render();

					} catch (error) {
						// console.log('Error: ', error);
						window.iridion.push(['goal', 'error_setup', error.toString()]);
					}
				}
			});

			WATO.elem(position, function(wrapperOfAllProducts){
				if(wrapperOfAllProducts){
					var wrapperOfAllProductsParent = wrapperOfAllProducts[0].parentNode;

					wrapperOfAllProductsParent.insertAdjacentHTML('beforebegin', 
						'<div id="kk_crossprods">'+
							// '<div id="kk_crosshead" class="kk_open">Neu seit ihrem letzten besuch</div>'+
							'<div class="kk_cbody main-carousel">'+
								'<div class="kk_cprod kk_blackbox">'+
									'<div class="kk-loader">' +
										'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
									'</div>'+
								'</div>'+
								'<div class="kk_cprod">'+
									'<div class="kk-loader">' +
										'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
									'</div>'+
									// '</div>'+
									// '<div class="kk_cprod"></div>'+
								'</div>'+
								// '<div class="kk_cprod"></div>'+
							'</div>'+
						'</div>'
					);



					window.document.documentElement.classList.add('kk_ps03_3');

					// Klapp-Mechanik
					// WATO.qs('#kk_crosshead', wrapperOfAllProductsParent.parentNode).addEventListener('click', function(){
					// 	this.classList.toggle('kk_open');
					// });

					// Fix: Wenn Tests oder Ausspielungen wie der PS01 in die Produktliste Elemente einfügen
					// Kann es sein dass unser neuer Bereich nicht mehr an der korrekten Position steht.
					// Dieses wird hier behoben, indem es neu plaziert wird.
					WATO.elem('.gridviewProductItemWrapper.kk_kachel', function(kk_kachel){
						if(kk_kachel){
							var crossprodsBody = WATO.qs('#kk_crossprods'),
								positionCorrection = ".js-product-grid > *:nth-child(7)";
							
							if(UrlPathname.indexOf("trends") !== -1){
								positionCorrection = ".js-product-grid > *:nth-child(5)";
							}
							var elemCorrection = WATO.qs(positionCorrection);
							if(elemCorrection){
								elemCorrection.insertAdjacentElement('afterend', crossprodsBody);
							}
						}
					});

				}
			});
		}
	};

	WATO.prototype.ps03setSegment = function(){
		var _self = this;

		function doSomeSegment(id, key) {
			if(!key){
				window.iridion.push(["segment", id]);
			}else if(key === 1 && window.iridion.push(['hasSegment', id])){
				window.iridion.push(["removeSegment", id]);
			}else if(key === 2){
				return window.iridion.push(['hasSegment', id]);
			}
		}
		// try {
		var variation = window.iridion.push(['profile', 'getValue', 'customerType']) || "Interessent";

		if(variation === "Interessent"){
			// Interessent
			if(!doSomeSegment("32862", 2)){
				doSomeSegment("32862");
			}
		}else if(variation === "Neukunde"){
			// Neukunde
			if(!doSomeSegment("32863", 2)){
				doSomeSegment("32862", 1);
				doSomeSegment("32863");
			}
		}else if(variation === "Bestandskunde"){
			// Bestandskunde
			if(!doSomeSegment("32860", 2)){
				doSomeSegment("32862", 1);
				doSomeSegment("32863", 1);
				doSomeSegment("32860");
			}
		}

		// Klick auf eines der ersten 6 Produkte
		_self.elem('.js-product-grid > .gridviewProductItemWrapper:nth-child(7)', function(the6thProduct){
			if(the6thProduct){
				var the6Products = _self.qsa('.js-product-grid > .gridviewProductItemWrapper');
				
				for (var j = 0; j < 6; j++) {
					the6Products[j].addEventListener('click', function(){
						window.iridion.push(['goal', 'ps03_click_6_products', '', true]);
					});
				}
			}
		});

			
	// 		switch (_self.goProfile('categoryAffinity')) {
	// 			case "herren":
	// 				if(!doSomeSegment("32865", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32865");
	// 				}
	// 				break;
	// 			case "baby":
	// 				if(!doSomeSegment("32866", 2)){
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32866");
	// 				}
	// 				break;
	// 			case "home":
	// 				if(!doSomeSegment("32867", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32867");
	// 				}
	// 				break;
	// 			default: // damen
	// 				if(!doSomeSegment("32864", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32864");
	// 				}
	// 				break;
	// 		}



		// } catch (error) {
		// 	// console.log('error: ', error);
		// }
	// };

	// WATO.prototype.ps03desktop = function(){
	// 	var _self = this,
	// 		UrlPathname = window.location.pathname;

	// 	function goalPush(key, sendOnNextPageView){
	// 		if(sendOnNextPageView){
	// 			window.iridion.push(['goal', key, '', true]);
	// 		}else{
	// 			window.iridion.push(['goal', key]);
	// 		}
	// 	}

	// 	_self.exclude(1023, function(){
	// 		_self.setCookie('kkps03desk_exclude', 'true', ".hessnatur.com", false);
	// 		_self.reload();
	// 	});

	// 	if(UrlPathname.indexOf("/c/neu-") === -1 && UrlPathname !== "/de/NEU"){
	// 		// Alle Kategorieseiten außer NEU und die NEU-LP
	// 		_self.elem('.footerWrapper', function(footerWrapper){
	// 			if(footerWrapper){
	// 				for (var k = 2; k < 8; k++) {
	// 					var produkte = _self.qs('.js-product-grid > .gridviewProductItemWrapper:nth-child('+k+')');
	// 					if(produkte){
	// 						// Goals der ersten 6 Produkte geklickt
	// 						produkte.addEventListener('click', function(){
	// 							goalPush("cat_prod_first6", true);
	// 						});
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
	};
	
})(window.WATO, window);