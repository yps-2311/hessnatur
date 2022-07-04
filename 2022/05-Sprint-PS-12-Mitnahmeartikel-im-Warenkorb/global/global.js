/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	const imgBasePath = 'https://imgs7.hessnatur.com/is/image/HessNatur/';
	const imgPath =  imgBasePath + 'hyb_redes_detail_main/';
	const cartImgPath =  imgBasePath + 'hyb_redes_cart_overview/';
	const productPath = 'https://www.hessnatur.com/de/';
	const additionalURLParameter = '?kk_ps12=true'; 

	// Static product list
	const products = [
		/*temporary test sold out*/ //{id: '489041750', name: 'ROLLKRAGEN-PULLOVER AUS SCHURWOLLE MIT KASCHMIR', price: '139,95 €', oldPrice: '', pricePerUnit: '', image: 'Rollkragen_Pullover_aus_Schurwolle_mit_Kaschmir-48904_17_7.jpg', badge: 'sale', link: 'rollkragen-pullover-aus-schurwolle-mit-kaschmir/p/48904'},
		// {id: '5212562ONE', name: 'Papierbox Floris', price: '9,95 €', oldPrice: '12,95 €', pricePerUnit: '', image: 'Papierbox_Floris-52125_62_7.jpg', badge: 'sale', link: 'papierbox-floris/p/52125'},
		{id: '49717095', name: 'Perkal-Servietten aus reiner Bio-Baumwolle', price: '22,95 €', oldPrice: '', pricePerUnit: '', image: 'Perkal_Servietten_aus_reiner_Bio_Baumwolle_im_2er_Set-49717_09_7.jpg', badge: 'vegan', link: 'perkal-servietten-aus-reiner-bio-baumwolle-im-2er-set/p/4971709'},	// vegan & -20% (sale)
		{id: '509310910', name: 'Leinen-Tischset im 2-er Set', price: '24,95 €', oldPrice: '', pricePerUnit: '', image: 'Leinen_Tischset_im_2_er_Set-50931_09_7.jpg', badge: 'vegan', link: 'tischset-im-2-er-set-aus-reinem-leinen/p/5093109'},	// vegan & -20% (sale)
		{id: '509320915', name: 'Geschirrtuch im 2er-Set', price: '29,95 €', oldPrice: '', pricePerUnit: '', image: 'Leinen_Geschirrtuch_im_2_er_Set-50932_09_7.jpg', badge: 'vegan', link: 'geschirrtuch-im-2-er-set-aus-reinem-leinen/p/50932'},
		{id: '49714351', name: 'Geschenksäckchen Betterrecycling aus reiner Bio-Baumwolle', price: '6,95 €', oldPrice: '', pricePerUnit: '', image: 'Geschenksaeckchen_BetterRecycling_aus_reiner_Bio_Baumwolle-49714_35_7.jpg', badge: 'vegan', link: 'geschenksaeckchen-aus-reiner-bio-baumwolle/p/4971435'},
		// {id: '22224431', name: 'Satin-Kissenbezug aus reiner Bio-Baumwolle', price: '11,95 €', oldPrice: '14,95 €', pricePerUnit: '', image: 'Satin_Kissenbezug_aus_reiner_Bio_Baumwolle-22224_43_7.jpg', badge: 'sale', link: 'satin-kissenbezug-aus-reiner-bio-baumwolle/p/2222443'},
		{id: '38549001L', name: 'Bio-Hygienespüler neutral', price: '12,95 €', oldPrice: '', pricePerUnit: '12,95 €', image: 'Bio_Hygienespueler_neutral-38549_00_7.jpg', badge: 'vegan', link: 'bio-hygienespueler-neutral/p/3854900'},
		{id: '5289101ONE', name: 'Zirbenholz für den Schrank', price: '14,95 €', oldPrice: '', pricePerUnit: '', image: 'Zirbenholz_fuer_den_Schrank_im_2er_Set-52891_01_7.jpg', badge: 'vegan', link: 'zirbenholz-fuer-schrank%2C-2-er-set/p/52891'},
		{id: '495399645C', name: 'Zirbenholz-Kleiderbügel', price: '14,95 €', oldPrice: '', pricePerUnit: '', image: 'Zirbenholz_Kleiderbuegel-49539_96_7.jpg', badge: 'vegan', link: 'zirbenholz-kleiderbuegel/p/49539'},
		{id: '5038209ONE', name: 'Wäschenetz im Set', price: '24,95 €', oldPrice: '', pricePerUnit: '', image: 'Waeschenetz_im_Set_aus_reiner_Bio_Baumwolle-50382_09_7.jpg', badge: 'vegan', link: 'waeschenetz-im-set-aus-reiner-bio-baumwolle/p/50382'},
		{id: '4980196ONE', name: 'Zirbenanhänger', price: '4,95 €', oldPrice: '', pricePerUnit: '', image: 'Zirbenanhaenger-49801_96_7.jpg', badge: 'vegan', link: 'zirbenanhaenger/p/49801'},
		// {id: '5212624ONE', name: 'Geschenkpapier Floris', price: '4,45 €', oldPrice: '6,95 €', pricePerUnit: '', image: 'Geschenkpapier_Floris-52126_24_7.jpg', badge: '', link: 'geschenkpapier-floris/p/5212624'},
		{id: '479360151', name: 'Handtuch aus reinem Bio-Frottee', price: '12,95 €', oldPrice: '', pricePerUnit: '', image: 'Handtuch_aus_reinem_Bio_Frottee-47936_01_7.jpg', badge: 'vegan', link: 'frottee-handtuch-aus-reiner-bio-baumwolle/p/47936'},
		{id: '495550951', name: 'Waffelpiqué-Handtuch', price: '12,95 €', oldPrice: '', pricePerUnit: '', image: 'Waffelpiqu__Handtuch_aus_reiner_Bio_Baumwolle-49555_09_6.jpg', badge: 'vegan', link: 'waffelpique-tuch-aus-reiner-bio-baumwolle/p/49555'},
		{id: '5217601ONE', name: 'Lavendel-Duftsäckchen 2er-Set', price: '14,95 €', oldPrice: '', pricePerUnit: '', image: 'Lavendelsaeckchen_im_2er_Set-52176_01_7.jpg', badge: 'vegan', link: 'lavendelsaeckchen/p/52176'},
		{id: '5216900ONE', name: 'Gallseife', price: '5,95 €', oldPrice: '', pricePerUnit: '59,50 €', image: 'Gallseife-52169_00_7.jpg', badge: '', link: 'gallseife/p/52169'},
		{id: '52887013', name: 'Aufbewahrungstasche', price: '9,95 €', oldPrice: '', pricePerUnit: '', image: 'Bettwarentasche_aus_reiner_Bio_Baumwolle-52887_01_4.jpg', badge: 'vegan', link: 'bettwarentaschen/p/52887'},
		{id: '52038019', name: 'Badetuch mit Kapuze für Kinder', price: '29,95 €', oldPrice: '', pricePerUnit: '', image: 'Badetuch_mit_Kapuze_fuer_Kinder-52038_01_7.jpg', badge: 'vegan', link: 'badetuch-mit-kapuze-aus-reiner-bio-baumwolle/p/5203801'},
		{id: '3482500V250', name: 'Flecklöser mit Panamarinde', price: '12,95 €', oldPrice: '', pricePerUnit: '51,80 €', image: 'Fleckloeser_mit_Panamarinde-34825_00_7.jpg', badge: 'vegan', link: 'fleckloeser-mit-panamarinde/p/34825'},
		{id: '29718001L', name: 'Bio-Waschmittel neutral', price: '12,95 €', oldPrice: '', pricePerUnit: '12,95 €', image: 'Bio_Waschmittel_neutral-29718_00_7.jpg', badge: 'vegan', link: 'bio-waschmittel-neutral/p/29718'}
	];


	// Example product info JSON
	/*{"products":[{"imageOnlyProduct":"https://imgs7.hessnatur.com/is/image/HessNatur/20051_01_7","image":"https://imgs7.hessnatur.com/is/image/HessNatur/20051_01_1",
	"inStock":true,"availableAT":true,"availableCH":true,"multiple_price":false,"sku":"20051012","name":"Stilleinlagen aus Seide mit Bio-Schurwolle","color":"natur","size":"14 cm",
	"permalink":"https://www.hessnatur.com/de/stilleinlagen-aus-seide-und-schurwolle/p/20051012","available_text":"Sofort lieferbar","bullet_points":["Hautberuhigend durch reine Bouretteseide",
	"H\u00e4lt die Haut trocken: die Zwischenlage Bio-Schurwolle","Ungebleicht und ungef\u00e4rbt: Pure Natur auf der Haut","F\u00fcr stillende junge M\u00fctter geeignet"],
	"description":"Die 3-lagige, gestrickte Stilleinlage besteht beidseitig aus weicher Bourretteseide, die zur Beruhigung auf die ger\u00f6tete Haut ach dem Stillen gelegt werden kann. Eine Zwischenlage aus Bio-Merinowolle sorgt f\u00fcr den idealen Feuchtigkeitstransport weg vom K\u00f6rper, die Haut bleibt trocken. Die BH-Einlagen sind aus ungebleichten, ungef\u00e4rbten Naturfasern gefertigt, sodass ausschlie\u00dflich pure Natur die Haut ber\u00fchrt. Bouretteseide entsteht aus den Kokons des Maulbeerspinners, sie wird aus den inneren Teilen des Kokons, der noch Seidenleim und k\u00fcrzere Seidenfasern mit leichten Verdickungen enth\u00e4lt. Die gestrickte, weiche Qualit\u00e4t der  Seide  hat eine matte Griffigkeit, wirkt hautberuhigend und ist saugf\u00e4hig. Ideal ist die Kombination ihrer Eigenschaften mit denen der Bio-Schurwolle, die Feuchtigkeit gut aufnehmen kann. Wir verarbeiten sie f\u00fcr die Stilleinlage bewusst ungebleicht und ungef\u00e4rbt, um die Haut der jungen Mutter ebenso zu sch\u00fctzen wie die Natur, aus der unsere wertvollen Naturfasern stammen.",
	"price":6.95,"price_prev":0.0,"sale":false,"ecological_data":{"water_consumption_in_liters":0.0,"water_savings_in_liter":0.0,"carbon_dioxide_consumption_in_gram":0.0,"carbon_dioxide_savings_in_gram":0.0,"clean_earth_consumption_in_square_meter":0.0,"weight":0}}]}
	*/
	
	function shuffle(array) {
		var copy = [], n = array.length, i;
	  
		// While there remain elements to shuffle…
		while (n) {
	  
		  // Pick a remaining element…
		  i = Math.floor(Math.random() * array.length);
	  
		  // If not already shuffled, move it to the new array.
		  if (i in array) {
			copy.push(array[i]);
			delete array[i];
			n--;
		  }
		}
	  
		return copy;
	}

	// Randomize product order 
	const shuffledProducts = shuffle(products);

	WATO.prototype.ps12 = function(variant){

		const WATO = this;

		let myFlickity;


		function goalPush(key, nextPageSend){
			window.iridion.push(['goal', key, "", nextPageSend || false]);
		}
		
		function addClass(object, newClass) {
			if(object && newClass){
				object.classList.add(newClass);
			}
		}

		function priceStringToFloat(string) {
			if(typeof string !== 'string'){
				string = string.toString();
			}
			return parseFloat(string.replace(' ','').replace('.','').replace(',','.').replace('€',''));
		}

		function priceFloatToString(number) {
			return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
		}
		

		function initFlickity(slider){

			myFlickity = new window.Flickity( slider, {
				cellAlign: 'left',
				contain: true,
				pageDots: false,
				groupCells: true,
				imagesLoaded: true,
  			});

			let afterInitial;
			myFlickity.on( 'settle', function( index ) {
				if(afterInitial){	
					goalPush('kk_slider_scrolled');
				}
				afterInitial = true;
			});
 
		}

		function fetchAsync(url) {
			return new Promise( async (resolve, reject) => {
				try {
					const response = await fetch(url);

					if(response.status !== 200) {
						reject(response.status);
					}
					resolve(response.json());

				} catch (err) {
					reject(response?.status|| {});
				}
			});
		}

		function setLSUpdatedProducts(productID, inStock, price, price_prev) {
			let updatedProducts = JSON.parse(localStorage.getItem('kk_fetched_products'));
			if(updatedProducts === null) {
				updatedProducts = {
					date: new Date().toLocaleDateString()
				};
			}
			if(inStock) {
				updatedProducts[productID] = {available: inStock, price: price, oldPrice: price_prev};
			} else {
				updatedProducts[productID] = {available: false};
			}

			localStorage.setItem('kk_fetched_products', JSON.stringify(updatedProducts));
		}

		async function fetchAndUpdateProducts(productID, button, currentSlide, item, inStock, price, price_prev) {
			//let productID = item.getAttribute('product-id');
			let url = 'https://products.hessnatur.com/products/' + productID;
			let productData;
			
			try {
				productData = await fetchAsync(url);

			
				if(productData){

					let htmlPrice = WATO.qs('.js-price-container .kkActivePrice span', item);
					let htmlPricePrev = WATO.qs('.js-price-container .strikeValue span', item);
					let availableText = productData.products[0].available_text;

					inStock = productData.products[0].inStock;
					price = productData.products[0].price;


					if(productData.products[0].price_prev === 0.0) {
						price_prev = 0;
					} else {
						price_prev = productData.products[0].price_prev;
					}


					if(inStock) {
						addClass(currentSlide, 'kkInStock');

					} else if(!inStock && availableText.indexOf('Voraussichtliche Lieferzeit') !== -1){
						addClass(currentSlide, 'kkInStock');
					} else {

						// Wenn ein Produkt nicht verfügbar ist, hinzufügen Btn disablen
						button.disabled = true;
						button.textContent = 'zurzeit vergriffen';
					}

					// Price aus der JSON Response mit dem Preis des jeweiligen Items des Arrays abgleichen
					// Bei Abweichung, den Array Price mit dem der Response überschreiben.
					if(htmlPrice && price !== priceStringToFloat(htmlPrice.textContent)) {
						htmlPrice.textContent = priceFloatToString(price);
					}
					if(htmlPricePrev && price_prev !== priceStringToFloat(htmlPricePrev.textContent)){
						if(price_prev !== 0) {
							htmlPricePrev.textContent = priceFloatToString(price_prev);
						} else {
							htmlPricePrev.textContent = "";
						}
						
						// inline if else
						//htmlPricePrev.textContent = price_prev !== 0 ? price_prev.toString().replace('.',',') + ' €' : "";
					}

					setLSUpdatedProducts(productID, inStock, price, price_prev);

				}
			} catch (error) {

				inStock = false;

				setLSUpdatedProducts(productID, inStock, price, price_prev);

				button.disabled = true;

				button.textContent = 'zurzeit vergriffen';
			}

			addClass(currentSlide, 'kk-item-up-to-date');
		}

		function insertSliderElements() {

			// Check for discount to display the proper black box text
			let blackBox = '<img class="kk-product-img" src="https://media.hessnatur.com/kk/2022/PS%2012/Component%202.svg">';
			const discountPrice = WATO.qs('.js_backstopWrapper .row.h-xsmallOffset-bottom-outer .price.discountPrice');
			const strikePrice = WATO.qs('.js_backstopWrapper .row.h-xsmallOffset-bottom-outer .price.strikeValue');
			
			if(discountPrice && strikePrice) {
				blackBox = '<img class="kk-product-img" src="https://media.hessnatur.com/kk/2022/PS%2012/Component%201.svg">';
			}

			
			let html = 
				// Initial intro Slide
				'<div class="kk-carousel-cell kk-intro-slide">' +
					blackBox + 
					'<div class="kk-slide-info-wrapper"></div>' +
				'</div>';


			// check for Localstorage entry
			let fetchedProducts = JSON.parse(localStorage.getItem('kk_fetched_products'));
			let matchingDate = false;

			if(fetchedProducts !== null) {

				if(fetchedProducts.date === new Date().toLocaleDateString()) {
					matchingDate = true;
				} else {
					localStorage.removeItem('kk_fetched_products');
				}
			}

			shuffledProducts.forEach( function(item){

				let slideStatus = '';
				let availableStatus = '';

				if(matchingDate) {
					// localStorage auf Eintrag mit passender ID prüfen
					if(fetchedProducts[item.id]){
						
 						if(fetchedProducts[item.id]['available']){
							availableStatus = 'kkInStock';



							// Alte Werte mit Localstorage werten überschreiben
							item.price = priceFloatToString(fetchedProducts[item.id].price);
							if(fetchedProducts[item.id].oldPrice !== 0) {
								item.oldPrice = priceFloatToString(fetchedProducts[item.id].oldPrice);
							} else {
								item.oldPrice = '';
							}

						} else {
							availableStatus = 'kk-hidden';
						}
						
						slideStatus = 'kk-item-up-to-date';
					}
				}		

				// Check for product badges
				let badge = '';
				if(item.badge === 'sale') {
					badge = '<span class="kk-badge kk-sale">SALE</span>';
				} else if(item.badge === 'vegan') {
					badge = '<span class="kk-badge kk-vegan">VEGAN</span>';
				} else {
					badge ='<span class="kk-badge"></span>';
				}

				// initialy hide add to cart btns for variant 1
				let addBtnStatus = '';
				if(variant === 1) {
					addBtnStatus = 'kk-hidden';
				}

				let pricePerUnit = '';
				if(item.pricePerUnit) {
					if(item.id === '5216900ONE') {
						pricePerUnit = 
						'<div class="kk-price-per-unit">' +
							'<span itemprop="priceCurrency" content="EUR">(1 Kilogramm = ' + item.pricePerUnit + ')</span>' +
						'</div>';
					} else {
						pricePerUnit =
						'<div class="kk-price-per-unit">' +
							'<span itemprop="priceCurrency" content="EUR">(1 Liter = ' + item.pricePerUnit + ')</span>' +
						'</div>';
					}

				}

				// Build and Add Product Slider Items
				html = html +  
					'<div class="kk-carousel-cell '+ slideStatus + ' ' + availableStatus + '" product-id="' + item.id + '">' +
						'<a href="'+ productPath + item.link + additionalURLParameter + '">' +
							'<img class="kk-product-img" src="' + imgPath + item.image + '">' + 
							'<div class="kk-slide-info-wrapper">' +
								badge +
								'<span class="name">' + item.name + '</span>' +

								// '<div class="js-price-container row">' +
								// 	'<div class="column shrink h-xsmallOffset-bottom-inner price kkActivePrice">' + 
								// 		'<span itemprop="priceCurrency" content="EUR">' + item.price + '</span>' +
								// 	'</div>' +
								// 	'<div class="column shrink h-xsmallOffset-bottom-inner price strikeValue">' +
								// 		'<span itemprop="priceCurrency" content="EUR">' + item.oldPrice + '</span>' +
								// 	'</div>' +
								// '</div>' +
								'<div class="js-price-container">' +
									'<div class="price kkActivePrice">' + 
										'<span itemprop="priceCurrency" content="EUR">' + item.price + '</span>' +
									'</div>' +
									'<div class="price strikeValue">' +
										'<span itemprop="priceCurrency" content="EUR">' + item.oldPrice + '</span>' +
									'</div>' +
								'</div>' +
								pricePerUnit + 
							'</div>' +
						'</a>' +
						
						'<button class="kk-add-button ' + addBtnStatus + '">' +
							'<span>+ hinzufügen</span>' + 
						'</button>' +

					'</div>';
			});

			return html;
		}

		// Polling for Element to insert the Swiper HTML behind
		WATO.elem('.js_backstopWrapper > .h-xsmallOffset-bottom-outer', function(position) {
			if(position) {
				position[0].insertAdjacentHTML('afterEnd', 
					'<div class="kk_takeaway_slider row">' + 
						'<div class="medium-12 large-10 large-offset-1 column">' +
							// Swiper wrapper
							'<div class="kk-flkty-main-carousel">' +
								insertSliderElements() +
							'</div>' +
						'</div>' +
					'</div>'
				);


				// Use the same picutures in the cart and slider for all slider products
				let cartItems = WATO.qsa('.item__form.listing__table--item');

				// itterate through cart items
				cartItems.forEach( function(cartItem){

					// get Cart item id
					let cartItemID = WATO.qs('.item__form.listing__table--item .js-update-entry-form input[name="variantCode"]', cartItem).value;

					
					// check for each cart item if the id is part of our static list
					shuffledProducts.forEach( function(product){

						// if the id is part of our list change the default picture to the picture used in the list
						if(cartItemID === product.id){
							cartItem.firstElementChild.firstElementChild.firstElementChild.src = cartImgPath + product.image;
						}
					});
				});


				// Slider initialisieren, sobald window.Flickity verfügbar ist
				WATO.elem(function(){
					return typeof window.Flickity !== "undefined";
				}, function(flickityReady){
					if(flickityReady) {
						initFlickity('.kk-flkty-main-carousel');
					}
				});

	
				// warten bis der Slider initialisiert ist, dann alle Slides selektieren 
				WATO.elem('.kk-flkty-main-carousel.flickity-enabled', function(slider) {
					if(slider) {

						// myFlickity.resize();

						// let sliderItems = WATO.qsa('.kk-carousel-cell:not(kk-intro-slide)', slider[0]);

						// Get all item ids in the cart
						let cartIDs = WATO.qsa('.item__form.listing__table--item .js-update-entry-form input[name="variantCode"]');

		
						WATO.qsa('.kk-carousel-cell:not(kk-intro-slide)', slider[0]).forEach( function(item) {

							let productID = item.getAttribute('product-id'),
							currentSlide = WATO.qs('.kk-carousel-cell[product-id="' + productID + '"]'),
							button = WATO.qs('.kk-add-button', currentSlide),
							productHoverTimeout,
							inStock,
							price,
							price_prev;							

							// Check if an Element with Matching id is in the cart already
							cartIDs.forEach( function(cartID) {
								// if(cartID.defaultValue === productID) {
								if(cartID.value === productID) {
									// hide item
									addClass(item, 'kk-hidden');
								} 
							});
							
							item.addEventListener("mouseenter", function(){


								if(variant === 1){
									button.classList.remove('kk-hidden');
								}

								productHoverTimeout = setTimeout( async function() {
									if(!currentSlide.classList.contains('kk-item-up-to-date')) {	
										fetchAndUpdateProducts(productID, button, currentSlide, item, inStock, price, price_prev);
									}
								}, 500);
							});

							item.addEventListener("mouseleave", function(){
								clearTimeout(productHoverTimeout);

								if(variant === 1){
									addClass(button, 'kk-hidden');
								}
							});


							function addProductToCart() {
								if(item.classList.contains('kkInStock')) {
									var params = { 
										productCodePost: productID,
										ff_id: productID.substring(0, 5),
										ff_masterId: productID.substring(0, 5),
										qty: 1,
										CSRFToken: window.ACC.config.CSRFToken
									};
	
									// add reco product to cart
									goalPush('kk_add_to_cart', true);
	
									if(productID !== '') {
										WATO.xhr_post('https://www.hessnatur.com/de/cart/add', 
											Object.keys(params).map(function(k){ 
												return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
												}).join('&'), 
										function(){
	
											location.href=location.href.split('#')[0];
											location.reload();
										});
									}
								} else {
									button.disabled = true;
									button.textContent = 'zurzeit vergriffen';
								}
							}

							// Add to Cart Listener 
							button.addEventListener('click', function(){

								// check if item class up to date is set
								if(currentSlide.classList.contains('kk-item-up-to-date')) {
									
									addProductToCart();

								} else {   // does not Contain class kk-item-up-to-date

									// Sonderfall, wenn der add to cart btn direkt geklickt wird
									fetchAndUpdateProducts(productID, button, currentSlide, item, inStock, price, price_prev).then( 
										function() {
											
											addProductToCart();

										}, function() {
											button.disabled = true;
											button.textContent = 'zurzeit vergriffen';
										}
									);
									
								}
							});
						});		
					}
				});
				
			}
		});

	};
	
})(window.WATO);