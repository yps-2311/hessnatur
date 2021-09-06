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
	
	WATO.prototype.getProfileValue = function(thisName) { // thisvalue
		// if(thisvalue){
		// 	window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
		// }else{
			return window.iridion.push(['profile', 'getValue', thisName]);
		// }
	};

	WATO.prototype.setSegmentByProfile = function() {

		function doSomeSegment(id, key) {
			if(!key){
				window.iridion.push(["segment", id]);
			}else if(key === 1 && window.iridion.push(['hasSegment', id])){
				window.iridion.push(["removeSegment", id]);
			}else if(key === 2){
				return window.iridion.push(['hasSegment', id]);
			}
		}

		var variation = this.getProfileValue('customerType') || "Interessent";
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
	};

	WATO.prototype.ps03globalgoals = function(){

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

		
		var WATO = this,
			PATHNAME = location.pathname; 

		if(PATHNAME.indexOf("/p/") !== -1){

			WATO.elem('img[src*="/overlay_neu.svg"]', function(hasNewBadge){
				if(hasNewBadge){
					WATO.ajaxCallback('/cart/add', function(){
						pushGoal('newProductAddToCart');
					});
				}
			});

			WATO.elem(() => {
				return WATO.qs('#kk_ctlwrapper') && typeof jQuery === "function"
			}, (result) => {
				if(!result) return;
				var scrollGoalSend = false;
				jQuery('#kk_ctlwrapper').on('staticClick.flickity', function(event, pointer, cellElement, cellIndex) {
					// KK: PS03: Klick auf das 1. Produkt aus CTL-Element
					// KK: PS03: Klick auf das 2. Produkt aus CTL-Element
					// KK: PS03: Klick auf das 3. Produkt aus CTL-Element
					pushGoalAgain('click_ctl_' + (cellIndex+1));
				}).on('scroll.flickity', function() {
					if(!scrollGoalSend){
						scrollGoalSend = true;
						// KK: PS03: Klick auf Pfeil auf linken / rechten Seite - PDS - V2
						pushGoal('click_slide_change_v2');
					}
				});
			});
		} else if(PATHNAME.indexOf("/c/") !== -1){

			WATO.ready(() => {
				[...WATO.qsa('.gridviewProductItemWrapper')].map((product, index) => {
					if(index >= 9)return;
					product.addEventListener('click', () => {
						// KK: PS03: Klick auf eines der ersten 9 Produkte
						pushGoalAgain('click_9_products');
					});
				});
			});
		}
	};
	
	WATO.prototype.ps03tweak = function(){

		var WATO = this,
			// econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f',
			econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
			UrlHref = window.location.href,
			UrlPathname = window.location.pathname,
			imgs7 = "https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/",
			productIDs = [];

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

		function getCompareString(categoryString) {
			// Wenn die Hauptkategorie übereinstimmt +2 Punkte 
			// wenn die Unterkategorie übereinstimmt +1 Punkt oder halt 0 Punkte. 
			// Damit kann die Produkt je nach "wichtigkeit der Kategorie" in der man sich befindet, sortieren.
			var temp = 0,
				splitString = categoryString.productcategory.split("^^");
			
			if(UrlHref.indexOf(splitString[0].toLowerCase().replace("-outdoor","")) !== -1){
				temp = 2;
			}
			if(UrlHref.indexOf(splitString[1].toLowerCase().replace("-outdoor","")) !== -1){
				temp++;
			}
			return temp;
		}

		function ucFirst(string) {
			return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
		}

		function compare(a, b) {
			var tempA = getCompareString(a),
				tempB = getCompareString(b);
				
			if (tempA < tempB) {
				return 1;
			}
			if (tempA > tempB) {
				return -1;
			}
			return 0;
		}

		// function ajax(url, callback) {
		// 	var request = XMLHttpRequest.prototype.open;

		// 	XMLHttpRequest.prototype.open = function (method, uri, async, user, pass) {

		// 		this.addEventListener("loadend", function () {
		// 			var _that = this;
		// 			if (_that.readyState === 4) {
						
		// 				if (uri.indexOf(url) !== -1) {

		// 					if (typeof callback === "function") {
		// 						callback(_that);
		// 					}
		// 				}
		// 			}
		// 		}, false);

		// 		request.call(this, method, uri, async, user, pass);
		// 	};
		// }

		if(UrlPathname.indexOf("/c/") !== -1){

			// Kategorieseiten
			// var userType = "Interessent", // WATO.getProfileValue('customerType') || "Interessent", // "Neukunde",
				// headerText = {
				// 	Interessent: ['Neu bei uns eingetroffen.', 'Lassen Sie sich von unseren neuen Outfits inspirieren.'],
				// 	Neukunde: ['Neu seit Ihrem letzen Besuch.', 'Neue Outfits Im Bereich '+UrlPathname.split("/")[2]],
				// 	Bestandskunde: ['Neuheiten passend zu Artikeln, die Sie häufig kaufen:']
				// },
				// econdaWidgetIDs = {
				// 	Interessent: 128,
				// 	Neukunde: 129,
				// 	Bestandskunde: 130
				// },
			var sublineCategory = 'Outfits';
			if(UrlPathname.indexOf('/de/home/') !== -1 || UrlPathname.indexOf('/de/sale/home/') !== -1){
				sublineCategory = 'Produkten';
			}
			
			var	userTypeText = ['Neu bei uns eingetroffen.', 'Lassen Sie sich von unseren neuen ' + sublineCategory + ' inspirieren.'], //headerText[userType],
				position = '.js-product-grid > *:nth-child(8) > div';

			// Auf der Seite Trends soll die Reco eine Zeile weiter oben an gezeigt werden.
			if(UrlPathname.indexOf("trends") !== -1){
				position = ".js-product-grid > *:nth-child(5) > div";
			}

			WATO.elem('.footerWrapper', function(element){
				if(element){
					var appProducts = WATO.qsa('.gridviewProductItemWrapper .dropdown-pane');
					for (var i = 0; i < appProducts.length; i++) {
						productIDs.push(appProducts[i].getAttribute('id').substring(0,5));
					}
				}
			});

			WATO.elem(function(){
				return 	typeof window.econda !== "undefined" && 
						typeof window.econda.recengine !== "undefined" && 
						typeof window.econda.recengine.Widget !== "undefined";
			}, function(isLoadedEconda){
				if(isLoadedEconda){
					// Wenn Econda geladen ist kann der Call abgeschickt werden


					var tempCat = window.location.pathname.replace("/de/", "").split("/"),
						mainCat = tempCat[0] === "sale" ? ucFirst(tempCat[1]) : ucFirst(tempCat[0]);

					if(mainCat === "Junior" || mainCat === "Babys"){
						mainCat = "Baby";
					}
						
					WATO.ajaxCallback("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
						var data = JSON.parse(callbackData.response),
							items = data.items,
							itemsTemp = [];

						// Alle Produkte die bereits auf dieser Seite zu sehen sind werden aus der Liste entfernt
						for (var j = 0; j < items.length; j++) {
							if (productIDs.indexOf(items[j].id) === -1) {
								itemsTemp.push(items[j]);
							}
						}
						items = itemsTemp;

						// Sortieren der Produkte nach Kategorie der aktuellen Seite.
						// z.B. Wenn man auf Herren-Hemden ist werden bevorzugt Herren Produkte angezeigt
						items.sort(compare);

						// Die neue Reco
						WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
							if(cbody){
								cbody = cbody[0];

								cbody.innerHTML = '';

								cbody.insertAdjacentHTML('beforeend',  
									'<div class="carousel-cell kk_blackbox">'+
										'<h4>'+userTypeText[0]+'</h4>'+
										(userTypeText[1] ? '<div class="kk_subline">'+userTypeText[1]+'</div>' : '' )+
										'<span class="kk_number">1/3</span>'+
									'</div>'
								);

								WATO.elem('#kk_crossprods .kk_blackbox:last-child a', function(textlink){
									if(!textlink) return;
									textlink[0].addEventListener('click', () => {
										pushGoal('click_textlink');
									});
								});

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
													console.log('Error: ', error);
													window.iridion.push(['goal', 'error_setup', error.toString()]);
												}
											});
										}).catch((error) => {
											console.log('Error: ', error);
											window.iridion.push(['goal', 'error_setup', error.toString()]);
										});

									cbody.insertAdjacentHTML('beforeend',  
										'<a class="carousel-cell" href="' + item.deeplink + '?ps03=true" data-index="' + (j+1) + '">'+
											'<div class="kk_cimg">'+
												'<img src="' + imgURL + '">'+
												'<div class="kk_badge">'+
													(item.isVegan === "true" ? '<img src="' + imgs7 + 'overlay_vegan.svg" alt="Vegan">' : '') +
													(item.new === "1" ? '<img src="' + imgs7 + 'overlay_neu.svg" alt="Neu">' : '') +
												'</div>'+
											'</div>'+
											'<div class="kk_title">' + item.name + '</div>'+
											'<div class="kk_price">' + item.price + '</div>'+
										'</a>'
									);
								}

								// [...WATO.qsa('#kk_crossprods .carousel-cell')].map((product) => {
								// 	product.addEventListener('click', () => {
								// 		pushGoalAgain('ps03_click_slide_' + product.dataset.index);
								// 	});
								// });

								// var tempMainCat = WATO.qs('.navigation-main > li > a.h-text-bold'),
								// 	selectedCategory = tempMainCat ? tempMainCat.getAttribute('href').replace("/de/","") : ,
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

								// https://www.hessnatur.com/de/herren/bekleidung/c/neu-herren
								// https://www.hessnatur.com/de/damen/bekleidung/c/neu-damen
								// https://www.hessnatur.com/de/baby/bekleidung/c/neu-junior
								// https://www.hessnatur.com/de/home/heimtextilien/c/neu-home

								cbody.insertAdjacentHTML('beforeend',  
									'<div class="carousel-cell kk_blackbox">'+
										'<h4>Noch mehr Neuheiten entdecken?</h4>'+
										'<a class="kk_subline" href="/de/'+newURL+'">> zu allen Neuheiten</a>'+
										'<span class="kk_number">3/3</span>'+
									'</div>'
								);

								WATO.elem(function(){
									return typeof window.Flickity !== "undefined";
								}, function(){

									var scrollGoalSend = false;

									// Slider init
									new window.Flickity(cbody, {
										cellAlign: 'left',
										cellSelector: '.carousel-cell',
										draggable: true,
										wrapAround: false,
										pageDots: false,
										contain: true,
										groupCells: 4
									}).on('staticClick', function(event, pointer, cellElement, cellIndex){
										// KK: PS03: Klick auf das 1. Produkt aus Slide-Element
										// KK: PS03: Klick auf das 2. Produkt aus Slide-Element
										// KK: PS03: Klick auf das 3. Produkt aus Slide-Element
										// KK: PS03: Klick auf das 4. Produkt aus Slide-Element
										pushGoalAgain('click_slide_' + cellIndex);
									}).on('scroll', function() {
										if(!scrollGoalSend){
											scrollGoalSend = true;
											// KK: PS03: Klick auf Pfeil auf der rechten / linken Seite - PDL
											pushGoal('click_slide_change');
										}
									});

									// WATO.elem('#kk_crossprods > .main-carousel > button', (buttons) => {
									// 	[...buttons].map((button) => {
									// 		button.addEventListener('click', () => {
									// 			// KK: PS03: Klick auf Pfeil auf der rechten / linken Seite - PDL
									// 			pushGoal('click_slide_change');
									// 		});
									// 	});
									// });
								});
							}
						});
					});

					try {

						// var metaTag = WATO.qs('meta[property="og:title"]').getAttribute('content'),
						// 	metaSplit = metaTag.split(' '),
						// var menuSelection = WATO.qs('.sidebarNav--nav .h-text-bold'),
							// menuSplit = menuSelection ? menuSelection.textContent.trim().split(' ') : [],

						// pathWidget = [mainCat];

						// if(menuSplit.length > 0){
						// 	pathWidget.push(menuSplit[0]);

						var widget = new window.econda.recengine.Widget({
							accountId: econdaAccountID,
							id: 128, // econdaWidgetIDs[userType]
							
							context: {
								categories: [{
									type: 'productcategory',
									// path: ['Home','Spannbetttücher-Laken']
									// path: ['Damen','Jacken']
									// path: ['Damen','Loungewear-Yoga', 'Oberteile']
									// path: ['Herren','Strümpfe']
									// path: ['Baby', 'Strumpfhosen/Leggings']
									// path: pathWidget
									path: mainCat
								}]
							}
						});

						widget.render();


						// var widget = new econda.recengine.Widget({
						// 	element: document.getElementById('ecRecommendationsContainer_128'),
						// 	renderer: {
						// 	   type: 'template',
						// 	   uri: '/path/to/my/template.html'
						// 	},
						// 	accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
						// 	id: '128',
						// 	// a context category of type brand named econda (replace with your category)
						// 	context: {
						// 		categories: [{
						// 			type: 'brand',
						// 			path: 'econda'
						// 		}]
						// 	}
						//  });
						//  widget.render();


					} catch (error) {
						console.log('Error: ', error);
						window.iridion.push(['goal', 'error_setup', error.toString()]);
					}
				}
			});

			WATO.elem(position, function(wrapperOfAllProducts){
				if(wrapperOfAllProducts){
					var wrapperOfAllProductsParent = wrapperOfAllProducts[0].parentNode,
						loadingPlaceholder = '<div class="kk_cprod"><div class="kk-loader">' +
												'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
											'</div></div>';

					wrapperOfAllProductsParent.insertAdjacentHTML('beforebegin', 
						'<div id="kk_crossprods">'+
							'<div class="kk_cbody main-carousel">'+
								'<div class="kk_load">'+
									'<div class="kk_cprod kk_blackbox"><div class="kk-loader">' +
									'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
								'</div></div>'+
									loadingPlaceholder+
									loadingPlaceholder+
									loadingPlaceholder+
									'<div class="kk_cprod"></div>'+
								'</div>'+
							'</div>'+
						'</div>'
					);

					// Fix: Wenn Tests oder Ausspielungen wie der PS01 in die Produktliste Elemente einfügen
					// Kann es sein dass unser neuer Bereich nicht mehr an der korrekten Position steht.
					// Dieses wird hier behoben, indem es neu plaziert wird.
					WATO.elem('.gridviewProductItemWrapper.kk_kachel', function(kk_kachel){
						if(kk_kachel){
							var crossprodsBody = WATO.qs('#kk_crossprods'),
								positionCorrection = ".js-product-grid > *:nth-child(11)";
							
							if(UrlPathname.indexOf("trends") !== -1){
								positionCorrection = ".js-product-grid > *:nth-child(8)";
							}
							var elemCorrection = WATO.qs(positionCorrection);
							if(elemCorrection){
								elemCorrection.insertAdjacentElement('afterend', crossprodsBody);
							}
						}
					});
					// var crossprodsBody = WATO.qs('#kk_crossprods .kk_cbody');
					// WATO.elem(function(){
					// 	return wrapperOfAllProductsParent !== crossprodsBody.parentNode;
					// }, function(element){
					// 	if(element){
					// 		wrapperOfAllProductsParent.insertAdjacentElement('beforebegin', crossprodsBody.parentNode);
					// 	}
					// });
				}
			});

			// if(variation === "Neukunde" || variation === "neukunde"){
			// 	WATO.elem('.opens-right > a.h-text-bold', function(categoryName){
			// 		if(categoryName){
			// 			WATO.elem('.kk_cattype', function(cattype){
			// 				if(cattype){
			// 					cattype[0].innerHTML = " "+categoryName[0].textContent;
			// 				}
			// 			});
			// 		}
			// 	});
			// }
		}

	};

	// WATO.prototype.ps03setSegment = function(){
	// 	var _self = this;

	// 	function doSomeSegment(id, key) {
	// 		if(!key){
	// 			window.iridion.push(["segment", id]);
	// 		}else if(key === 1 && window.iridion.push(['hasSegment', id])){
	// 			window.iridion.push(["removeSegment", id]);
	// 		}else if(key === 2){
	// 			return window.iridion.push(['hasSegment', id]);
	// 		}
	// 	}
	// 	try {
	// 		var variation = _self.goProfile('customerType') || "Interessent";

	// 		if(variation === "Interessent"){
	// 			// Interessent
	// 			if(!doSomeSegment("32862", 2)){
	// 				doSomeSegment("32862");
	// 			}
	// 		}else if(variation === "Neukunde"){
	// 			// Neukunde
	// 			if(!doSomeSegment("32863", 2)){
	// 				doSomeSegment("32862", 1);
	// 				doSomeSegment("32863");
	// 			}
	// 		}else if(variation === "Bestandskunde"){
	// 			// Bestandskunde
	// 			if(!doSomeSegment("32860", 2)){
	// 				doSomeSegment("32862", 1);
	// 				doSomeSegment("32863", 1);
	// 				doSomeSegment("32860");
	// 			}
	// 		}
			
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



	// 	} catch (error) {
	// 		// console.log('error: ', error);
	// 	}
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
	// };
	
})(window.WATO, window);