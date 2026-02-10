// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace Variante1
 * @name Variation 01
 * @description 
 */

(function (KEK) {
	"use strict";

	// let productsInCart = [];

	// Konstanten für Produkt-ID-Slices (Magic Numbers vermeiden)
	const SKU_MODEL_END = 5;        // slice(0, 5) = Modell-ID (z.B. "57283")
	const SKU_STYLE_START = 5;      // slice(5, 7) = Style-ID (z.B. "88")
	const SKU_STYLE_END = 7;
	const SKU_WITH_COLOR_END = 7;   // slice(0, 7) = Modell + Style (z.B. "5728388")
	const SKU_SIZE_START = 7;       // slice(7, 11) = Größen-ID (z.B. "34")
	const SKU_SIZE_END = 11;

	// Mapping Tabelle für Konvertierung Kleidergröße → Zahlengröße
	const sizeMapping = {
		damen: { 'XS': '32', 'S': '36', 'M': '40', 'L': '44', 'XL': '48', 'XXL': '52', 'XXXL': '56' },
		herren: { 'XS': '44', 'S': '48', 'M': '52', 'L': '56', 'XL': '60', 'XXL': '64', 'XXXL': '68' }
	};

	const alternativProdukt = [{
		id: "5552501",
		price: "29,99 €",
		sku: "555250140,",
		sku7: "5552501",
		iconurl: "https://images.hessnatur.com/images/2825924/webshop_product-xlarge/product-shop/Socke_im_2er_Pack_aus_reiner_Bio_Baumwolle-55525_01_7.webp",
		reduced1: "false",
		name: "Socke im 2er-Pack aus reiner Bio-Baumwolle"
	}];

	let savedSizes = new Set();

	// Hilfsfunktion um die passende productSize zu ermitteln
	const getProductSize = (products) => {
		console.log('products: ', products);
		const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE'];
		const twoDigitSizeRegex = /^\d{2}$/;
		
		let size = '';
		let size2 = '';
		let firstProduct = null;
		let secondProduct = null;
		
		// Durchsuche alle Produkte nach gültigen Größen
		for (let i = 0; i < products.length; i++) {
			const itemSize = products[i].item_size;
			
			// Prüfe ob Größe den Kriterien entspricht (Prio 1 & 2)
			if (clothingSizes.includes(itemSize) || twoDigitSizeRegex.test(itemSize)) {
				if (!firstProduct) {
					firstProduct = products[i];
					size = itemSize;
				} else if (!secondProduct) {
					secondProduct = products[i];
					size2 = itemSize;
					break; // Beide gefunden, fertig
				}
			}
		}
		
		// Wenn size2 leer ist, versuche Mapping basierend auf Kategorie
		if (size && !size2 && firstProduct) {
			const category = firstProduct.item_category?.toLowerCase();
			
			// Mapping in beide Richtungen: XL -> 48 und 48 -> XL
			if (sizeMapping[category]?.[size]) {
				// Buchstaben → Zahl (z.B. XL -> 48)
				size2 = sizeMapping[category][size];
			} else if (sizeMapping[category]) {
				// Zahl → Buchstaben (z.B. 48 -> XL) - Reverse Lookup
				const reverseMatch = Object.entries(sizeMapping[category]).find(([key, val]) => val === size);
				if (reverseMatch) {
					size2 = reverseMatch[0]; // Der Key ist die Buchstaben-Größe
				}
			}
		}
		
		// Baue den String zusammen
		let result = '';
		console.log('size: ', size);
		if (size) {
			result += '&ctxcustom.size=' + size;
			savedSizes.add(size);
		}
		console.log('size2: ', size2);
		if (size2) {
			result += '&ctxcustom.size2=' + size2;
			savedSizes.add(size2);
		}
		
		// console.log('result: ', result);
		return result;
	};

	const getProductFromEconda = (productDatas) => {
		// console.log('productIDs: ', productIDs);

		// const productDatas = window.dataLayer && window.dataLayer.find(entry => entry.event === "Ecommerce - view_cart").ecommerce.items;
		console.log('productDatas: ', productDatas);
		

		// const pidParams = productIDs.map(id => `&pid=${id.slice(0, 7)}`).join('');
		// console.log('pidParams: ', pidParams);
		// console.log('getProductSize(productIDs): ', getProductSize(productIDs));
    	// const url = 'https://widgets.crosssell.info/eps/crosssell/recommendations/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1.do?wid=205&type=cs&aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&widgetdetails=true&start=0&ctxcustom.size=' + getProductSize(productIDs) + (productIDs ? pidParams : ''); // &csize=20


		const pidParams = productDatas.map(prod => `&pid=${prod.item_variant.slice(0, SKU_WITH_COLOR_END)}`).join('');
		const productSizes = getProductSize(productDatas);

		// console.log('pidParams: ', pidParams);
		// console.log('productSizes: ', productSizes);

		// Wenn es aus den Produkten im Warenkorb keine nutzbare Größe zu extrahieren gibt (zb Decken oder Schaals) dann wird direkt auf das 
		// alternativ Produkt gewechselt statt einen Request gegen Econda zu machen, da kein sinnvolles Ergebniss zu erwarten ist, ohne mitgesendete Größe
		if(productSizes === ""){
			return Promise.resolve(alternativProdukt);
		}

		// Request gegen Econda für eine Reco mit sinnvollen Produkten
    	const url = 'https://widgets.crosssell.info/eps/crosssell/recommendations/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1.do?wid=205&type=cs&aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&'+
					'widgetdetails=true&csize=20&start=0' + productSizes + (productDatas ? pidParams : ''); // &ctxcustom.size=

		return fetch(url)
			.then(res => res.json())
			.then(data => {
				console.log('Econda Produkte:', data.items);
				
				return data.items.length === 0 ? alternativProdukt : data.items;
			})
			.catch(error => {
				// console.error('Econda Fehler:', error);
				return [];
			});
	}

	const getCookie = (name) => {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				return cookie.substring(name.length + 1);
			}
		}
		return null;
	}

	const addProductToCart = (exactProductID9) => {
		// console.log('exactProductID9: ', exactProductID9);
		fetch('https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				operationName: "updateCartEntry",
				variables: {
					country: "de",
					guid: getCookie('HessnaturDESite-cart'),
					cartEntry: {
						quantity: 1,
						product: {
							code: exactProductID9
						}
					}
				},
				query: "mutation updateCartEntry($country: String!, $token: String, $guid: String, $expirationTime: String, $cartEntry: UpdateCartEntry!) {\n  updateCartEntry(country: $country, token: $token, guid: $guid, expirationTime: $expirationTime, cartEntry: $cartEntry) {\n    __typename\n    ... on CartModification {\n      guid\n      quantity\n      quantityAdded\n      statusCode\n      entry {\n        quantity\n        entryNumber\n        totalPrice {\n          formattedValue\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on GenericOCCResponse {\n      success\n      invalidFields\n      __typename\n    }\n  }\n}\n"
			})
		})
		// .then(response => response.json())
		.then(KEK.reload);
		// .catch(error => {
		// 	// console.error('Fehler:', error);
		// });
	};

	const priceToFloat = (oldPrice) => {
		return parseFloat(oldPrice.replace(/[^\d,.]/g, '').replace('.', '').replace(',', '.'))
	};

	const getPriceToDisplay = (thisPrice) => {
		return thisPrice.toFixed(2).replace('.', ',').replace(',00', '');
	}

	const getSavedMoney = () => {
		let saveMoney = 0;
		KEK.qsa('[class*="cart_cart-page__wrapper__cart-entries-list__"] > div:first-child [class*="CartEntry_cartEntry__detailsWrapper__details__price__"]').forEach((item) => {
			// console.log('item: ', item);
			const strikePrice = KEK.qs('[class*="PriceLabel_priceRow__priceLabel--striked__"]', item);
			// console.log('strikePrice: ', strikePrice);
			const reducePrice = KEK.qs('[class*="PriceLabel_priceRow__priceLabel--discounted__"]', item);
			// console.log('reducePrice: ', reducePrice);
			if(strikePrice && reducePrice) {
				const strikePriceValue = priceToFloat(strikePrice.textContent); // parseFloat(strikePrice.textContent.replace(/[^\d,.]/g, '').replace('.', '').replace(',', '.'));
				const reducePriceValue = priceToFloat(reducePrice.textContent); // parseFloat(reducePrice.textContent.replace(/[^\d,.]/g, '').replace('.', '').replace(',', '.'));
				const savings = strikePriceValue - reducePriceValue;
				saveMoney += savings;
			}
		});
		const amount_voucher = KEK.qs('[class*="AmountBox_voucher__"] div:last-child');
		if(amount_voucher){{
			saveMoney += priceToFloat(amount_voucher.textContent.replace('-',''));
		}}

		return saveMoney;
	}

	// Haupt-Funktion die alles koordiniert
	const initializeCartAddOn = (econdaProducts, productsStayInCart) => {
		// console.log('productsStayInCart: ', productsStayInCart);

		KEK.elem(() => {
			const saveMoney = getSavedMoney();
			return saveMoney >= 20 && saveMoney;
		}, (saveMoney) => {
			if(saveMoney){

				// console.log('saveMoney>: ', saveMoney);

				// Mindestens 20€ muss die Ersparnis sein
				// if(saveMoney < 20) {
				// 	return;
				// }

				// Finde alle Produkte aus Econda deren Preis kleiner ist als saveMoney
				// Und es werden nur Produkte die direkt die korrekte Größe haben weitergegeben
				let matchingProducts = econdaProducts.filter(product => {
					// console.log('product: ', product);
					const productPrice = priceToFloat(product.price);
					// console.log('product.sku.slice(7, 11): ', product.sku.slice(7, 11), productsStayInCart[0].slice(7, 11));
					// return productPrice < saveMoney && product.sku.slice(7, 11) === productsStayInCart[0].slice(7, 11);
					const productSizeId = product.sku.slice(SKU_SIZE_START, SKU_SIZE_END);
					let foundMatch = false;
					for (let j = 0; j < productsStayInCart.length && !foundMatch; j++) {
						// console.log('product.sku.slice(7, 11): ', product.sku.slice(7, 11), productsStayInCart[j].slice(7, 11));
						if (productSizeId === productsStayInCart[j].item_id.slice(SKU_SIZE_START, SKU_SIZE_END)) {
							foundMatch = true;
						}
					}
					return productPrice < saveMoney && foundMatch;
				});

				// Fallback 1 -> größe ONE ist ein Produkt dass es sowieso nur in einer Größe gibt
				if (matchingProducts.length === 0) {
					// console.log("fallback1 ", matchingProducts);
					matchingProducts = econdaProducts.filter(product => {
						return priceToFloat(product.price) < saveMoney && product.sku.slice(SKU_SIZE_START, SKU_SIZE_END) === "ONE";
					});
				}

				// Fallback 2 -> Hauptsache das Produkt ist günstiger als die Ersparniss im Warenkorb
				if (matchingProducts.length === 0) {
					// console.log("fallback2 ", matchingProducts);
					matchingProducts = econdaProducts.filter(product => {
						return priceToFloat(product.price) < saveMoney;
					});
				}
				// console.log('matchingProducts: ', matchingProducts);

				if (matchingProducts.length === 0) {
					// console.log('Kein passendes Econda-Produkt gefunden');
					return;
				}

				// Sortiere nach Preis (günstigste zuerst)
				matchingProducts.sort((a, b) => {
					const priceA = priceToFloat(a.price);
					const priceB = priceToFloat(b.price);
					return priceA - priceB;
				});

				// console.log('Passende Econda-Produkte:', matchingProducts);

				// Starte mit dem ersten Produkt
				fetchProductDetails(matchingProducts, 0, saveMoney);


			}
		});
	};

	const fetchProductDetails = (matchingProducts, currentIndex, saveMoney) => {
		
		// Prüfe ob wir noch Produkte zum Testen haben
		// if (currentIndex >= matchingProducts.length) {
		// 	console.log('Kein Produkt mit mindestens 2 Größen gefunden');
		// 	return;
		// }

		const econdaProduct = matchingProducts[currentIndex];
		// console.log('econdaProduct: ', econdaProduct);
		const productID = econdaProduct.sku7;
		const productModelID = productID.slice(0, SKU_MODEL_END);  // Cache für mehrfache Verwendung
		// console.log('->>. Teste Produkt ' + (currentIndex + 1) + '/' + matchingProducts.length + ':', productID);
		
		fetch('https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				operationName: 'getAllAvailabilities',
				variables: {
					code: productID,
					lang: 'de',
					country: 'de'
				},
			query: `query getAllAvailabilities($code: String!, $lang: String!, $country: String!) { allAvailabilities(code: $code, lang: $lang, country: $country) {id styles { id name imgUrl sizes { id name availabilityIndex deliveryTime price { formattedValue currencyIso netValue __typename } __typename } __typename } __typename } }`})
		})
		.then(response => response.json())
		.then(responseData => {
			// console.log('GraphQL Response:', responseData);

			const matchingStyle = responseData.data.allAvailabilities.styles.find(style => style.id === productID.slice(SKU_STYLE_START, SKU_STYLE_END));
			const produktData = matchingStyle || responseData.data.allAvailabilities.styles[0];
			
			// console.log('produktData: ', produktData);

			KEK.elem('[data-testid="cartPage"] [class*="cart_cart-page__wrapper__cart-entries-list_"]', (cartWrapper) => {
				if(cartWrapper && !KEK.qs('#kk_addon')){
					// console.log('cartWrapper: ', cartWrapper);
					cartWrapper = cartWrapper[0];
					
					// Funktion zum Berechnen der Eco Points (Preis aufgerundet)
					const calculateEcoPoints = (formattedPrice) => {
						const price = parseFloat(formattedPrice.replace(/[^\d,]/g, '').replace(',', '.'));
						return Math.ceil(price);
					};
					
					// Funktion zum Ermitteln der CSS-Klasse basierend auf Lieferzeit
					const getDeliveryClass = (deliveryTime) => {
						if (deliveryTime && deliveryTime.includes('Woche')) {
							return 'ProductAvailability_soonAvailable__G_otz';
						}
						return 'ProductAvailability_available__zjuhf';
					};

					// getProductSize(productID)
					// console.log('productID: ', econdaProduct.sku.slice(7,11));
					// console.log('getProductSize(productID): ', getProductSize(econdaProduct.sku));




					// if (sizeMapping[category]?.[size]) {
					// 	size2 = sizeMapping[category][size];
					// }

					
					// Größen-Dropdown dynamisch erstellen
					const sizeOptionsHTML = produktData.sizes.map(size => {
						const selectedCorrectSize = savedSizes.has(size.id) ? 'selected' : '';

						return '<option '+selectedCorrectSize+' value="'+size.id+'" data-price="'+size.price.formattedValue+'" data-delivery="'+size.deliveryTime+'">'+size.name+'</option>';
					}).join('');

					// console.log('sizeOptionsHTML: ', sizeOptionsHTML);
					
					// Preis-HTML basierend auf reduziert/nicht reduziert
					const isReduced = econdaProduct.reduced === "true";
					let priceHTML = '';
					const productPrice = produktData.sizes[0]?.price.formattedValue;
					
					if (isReduced) {
						priceHTML = 
							'<span class="sr-only">Erhältlich für ' + econdaProduct.price + ' anstatt ' + econdaProduct.oldprice + '</span>' +
							'<div class="PriceLabel_priceRow__priceLabel--cartEntry__kJU_x PriceLabel_priceRow__priceLabel--discounted__rpPhy PriceLabel_priceRow__priceLabel--discounted--bold__0yqY5">' +
								'<span id="kk_product_price" aria-hidden="true" data-testid="price-label-discounted">' +
									'<div>' + productPrice + '</div>' +
								'</span>' +
							'</div>' +
							'<div class="PriceLabel_priceRow__priceLabel--cartEntry__kJU_x PriceLabel_priceRow__priceLabel--striked__F_I_p PriceLabel_priceRow__priceLabel--striked--cartEntry__wXUbx">' +
								'<span aria-hidden="true" data-testid="price-label-striked" id="kk_product_oldprice">' + econdaProduct.oldprice + '</span>' +
							'</div>' +
							'<div class="PriceLabel_priceRow__priceInfo--cartEntry__Rh3lR"></div>';
					} else {
						priceHTML = 
							'<div class="PriceLabel_priceRow__priceLabel--cartEntry__kJU_x">' +
								'<span aria-hidden="true" data-testid="price-label" id="kk_product_price">' + productPrice + '</span>' +
							'</div>' +
							'<div class="PriceLabel_priceRow__priceInfo--cartEntry__Rh3lR"></div>';
					}

					// console.log('econdaProduct: ', econdaProduct);
					// console.log('econdaProduct.iconurl: ', econdaProduct.iconurl);
					// console.log('produktData: ', produktData);

					// console.log('econdaProduct: ', econdaProduct);
					const productImage = econdaProduct.iconurl.replace("feeds_pic_mid", "webshop_product-small");
					const ecoPoints = calculateEcoPoints(productPrice);
					
					KEK.insert(cartWrapper, 'beforeend', 
						'<div id="kk_addon" class="CartEntry_cartEntry__detailsWrapper__ufzUb">' +
							'<div class="kk_leftgreen"><b>Glückwunsch! Du sparst <span>' + getPriceToDisplay(saveMoney) + ' €</span></b><p>Nutze deine Ersparnis:&nbsp;<br>Füge den Artikel hinzu und freu dich über ein schönes Extra.</p></div>' +
							'<div class="kk_imageprod" style="background-image:url(' + productImage + ')">' +
							'</div>' +
							'<div class="CartEntry_cartEntry__detailsWrapper__details__IFwWE">' +
								'<img class="kk_mobileimage" src="' + productImage + '" />' +
								'<div class="CartEntry_cartEntry__headline__JQKsM">' +
									econdaProduct.name +
								'</div>' +
								'<div class="CartEntry_cartEntry__detailsWrapper__details__subline__dnLuO">' +
									'<div class="CartEntry_cartEntry__subline__JAHeL">Artikel ' + productModelID + '</div>' +
									'<div class="CartEntry_cartEntry__detailsWrapper__details--detail__BsQu1">Farbe: ' + (produktData.name.charAt(0).toUpperCase() + produktData.name.slice(1)) + '</div>' +
								'</div>' +
								'<div class="CartEntry_cartEntry__detailsWrapper__details__availability__UPqPX">' +
									'<span class="' + getDeliveryClass(produktData.sizes[0]?.deliveryTime) + '" data-testid="product-availability-deliveryTime-available" id="kk_delivery_time">' + produktData.sizes[0]?.deliveryTime + '</span>' +
								'</div>' +
								'<div class="CartEntry_cartEntry__detailsWrapper__details__box__H2ZF2">' +
									'<div class="CartEntry_cartEntry__detailsWrapper__details__size__zOaRA">' +
										'Größe ' +
										'<p>' +
											'<select class="Select_special__bJJJ0" id="kk_size_select">' +
												sizeOptionsHTML +
											'</select>' +
										'</p>' +
									'</div>' +
								'</div>' +
								'<div class="CartEntry_cartEntry__detailsWrapper__details__price__oo_cN">' +
									'<div class="PriceLabel_priceRow__1sb0z">' +
										priceHTML +
									'</div>' +
									'<div class="kk_eco_points CartEntry_cartEntry__detailsWrapper__details__ecoPoints__lteLs">' + ecoPoints + ' Eco Points</div>' +
								'</div>' +
								'<button id="kk_add_to_cart_btn" class="btn-primary">Hinzufügen</button>' +
								'<div class="kk_eco_points CartEntry_cartEntry__detailsWrapper__details__ecoPoints__lteLs">' + ecoPoints + ' Eco Points</div>' +
							'</div>' +
						'</div>');

					// Event Listener für Größenauswahl - Preis, Eco Points und Lieferzeit aktualisieren
					const sizeSelect = KEK.qs('#kk_size_select', cartWrapper);
					const priceLabel = KEK.qs('#kk_product_price', cartWrapper);
					const ecoPointsLabel = KEK.qs('.kk_eco_points', cartWrapper);
					const deliveryTimeLabel = KEK.qs('#kk_delivery_time', cartWrapper);
					
					if (sizeSelect && priceLabel && ecoPointsLabel && deliveryTimeLabel) {
						KEK.eventElem(sizeSelect, 'change', (e) => {
							const selectedOption = e.currentTarget.options[e.currentTarget.selectedIndex];
							const newPrice = selectedOption.getAttribute('data-price');
							const newDeliveryTime = selectedOption.getAttribute('data-delivery');
							
							if (newPrice) {
								// Preis aktualisieren - unterschiedlich je nach reduziert/nicht reduziert
								if (isReduced) {
									// Bei reduzierten Produkten: Preis in div innerhalb des span
									const priceDiv = priceLabel.querySelector('div');
									if (priceDiv) {
										priceDiv.textContent = newPrice;
									}
								} else {
									// Bei normalen Produkten: direkt im span
									priceLabel.textContent = newPrice;
								}
								
								const newEcoPoints = calculateEcoPoints(newPrice);
								ecoPointsLabel.textContent = newEcoPoints + ' Eco Points';
							}
							
							if (newDeliveryTime) {
								deliveryTimeLabel.textContent = newDeliveryTime;
								// CSS-Klasse basierend auf Lieferzeit aktualisieren
								deliveryTimeLabel.className = getDeliveryClass(newDeliveryTime);
							}
						});
					}

					// Event Listener für "Hinzufügen"-Button
					const addToCartBtn = KEK.qs('#kk_add_to_cart_btn', cartWrapper);
					if (addToCartBtn) {
						// console.log('produktData: ', produktData);


						KEK.eventElem(addToCartBtn, 'click', (e) => {
							e.preventDefault();

							const selectedSizeId = sizeSelect.value;

							// Zusammengesetzte Produkt-ID erstellen: productID + produktData.id + selectedSizeId
							// console.log('productID: ', productID.slice(0, 5));
							// console.log('produktData.id: ', produktData.id);
							// console.log('selectedSizeId: ', selectedSizeId);

							const fullProductID = productModelID + produktData.id + selectedSizeId;
							// console.log('Full Product ID:', fullProductID);
							
							// SessionStorage setzen - Produkt-ID des hinzugefügten Produktes speichern
							sessionStorage.setItem('kk_added_reco_product', fullProductID);


							// Goal
							window.dataLayer.push({
								"event": "Ecommerce - add_to_cart",
								"event_name": "add_to_cart",
								"ecommerce": {
									"currency": "EUR",
									"value": priceToFloat(productPrice),
									"items": [
										{
											"item_id": productModelID + produktData.id,
											"item_name": econdaProduct.name,
											// "affiliation": "hessnatur",
											"currency": "EUR",
											"index": 0,
											// "item_brand": "hessnatur",
											// "item_category": "damen",
											// "item_category2": "bekleidung",
											// "item_category3": "Materialien",
											"item_variant": fullProductID,
											"price": priceToFloat(productPrice),
											"quantity": 1,
											"item_model": productModelID,
											"item_size": selectedSizeId,
											// "item_color": "cognac",
											// "item_rating": "5",
											// "item_icons": "Sale::Sustainable",
											"item_discounted": econdaProduct.reduced1
											// "item_wtr": "WT-ZGH hw2025 e-shop sale",
											// "item_sortiment": "SO-001 Damen",
											// "item_warengruppe": "WG-30 pullover"
										}
									]
								}
							});

							// console.log("aaaaaa", {
							// 		"event": "Ecommerce - add_to_cart",
							// 		"event_name": "add_to_cart",
							// 		"ecommerce": {
							// 			"currency": "EUR",
							// 			"value": priceToFloat(productPrice),
							// 			"items": [
							// 				{
							// 					"item_id": productID.slice(0, 5) + produktData.id,
							// 					"item_name": econdaProduct.name,
							// 					// "affiliation": "hessnatur",
							// 					"currency": "EUR",
							// 					"index": 0,
							// 					// "item_brand": "hessnatur",
							// 					// "item_category": "damen",
							// 					// "item_category2": "bekleidung",
							// 					// "item_category3": "Materialien",
							// 					"item_variant": fullProductID,
							// 					"price": priceToFloat(productPrice),
							// 					"quantity": 1,
							// 					"item_model": productID.slice(0, 5),
							// 					"item_size": selectedSizeId,
							// 					// "item_color": "cognac",
							// 					// "item_rating": "5",
							// 					// "item_icons": "Sale::Sustainable",
							// 					"item_discounted": econdaProduct.reduced1
							// 					// "item_wtr": "WT-ZGH hw2025 e-shop sale",
							// 					// "item_sortiment": "SO-001 Damen",
							// 					// "item_warengruppe": "WG-30 pullover"
							// 				}
							// 			]
							// 		}
							// 	});

							
							// Funktion aufrufen
							addProductToCart(fullProductID);
						});
					}



					// Callback function to execute when mutations are observed
					const callback = (mutationList) => {
						for (const mutation of mutationList) {
							// if (mutation.type === "childList") {
							// 	console.log("A child node has been added or removed.");
							// } else if (mutation.type === "attributes") {
							// 	console.log(`The ${mutation.attributeName} attribute was modified.`);
							// }
							// mutation.type
							if (mutation.type === "attributes"){

								KEK.qs('.kk_leftgreen span', cartWrapper).innerHTML = getPriceToDisplay(getSavedMoney()) + ' €';
							}
						}
					};

					// Create an observer instance linked to the callback function
					const observer = new MutationObserver(callback);

					// Start observing the target node for configured mutations
					observer.observe(KEK.qs('div', cartWrapper), { attributes: true, childList: true, subtree: true });

					// Later, you can stop observing
					// observer.disconnect();




				}
			});
		});
		// .catch(error => console.error('GraphQL Error:', error));
	};

	KEK.elem(() => {
		const data = window.dataLayer && window.dataLayer.find(entry => entry.event === "Ecommerce - view_cart");
		return data && data.ecommerce && data.ecommerce.items;
	}, (items) => {
		if(items){

			const getSessionStorage = sessionStorage.getItem('kk_added_reco_product');

			for (let i = 0; i < items.length; i++) {
				
				// productsInCart.push(items[i].item_id);

				if(getSessionStorage && (items[i].item_id.substring(0,5) === getSessionStorage.substring(0,5))){
					return;
				}
			}
			
			// console.log('productsInCart: ', productsInCart);

			// Initial: Econda-Produkte laden
			getProductFromEconda(items).then(econdaProducts => {
				console.log('econdaProducts: ', econdaProducts);
				if (econdaProducts && econdaProducts.length > 0) {
					initializeCartAddOn(econdaProducts, items);
				}
				// else {
				// 	console.log('Keine Econda-Produkte gefunden, Alterantiv Socken eingebaut');
				// 	initializeCartAddOn([{
				// 		id: "5552501",
				// 		price: "29,99 €",
				// 		sku: "555250140,",
				// 		sku7: "5552501",
				// 		iconurl: "https://images.hessnatur.com/images/2825924/webshop_product-xlarge/product-shop/Socke_im_2er_Pack_aus_reiner_Bio_Baumwolle-55525_01_7.webp",
				// 		reduced1: "false",
				// 		name: "Socke im 2er-Pack aus reiner Bio-Baumwolle"
				// 	}], items);
				// }
			});
		}
	});

})(new window.KEK());