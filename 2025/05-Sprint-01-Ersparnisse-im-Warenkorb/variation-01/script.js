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

	if (window.kkSp01) {
		return;
	}
	window.kkSp01 = true; 

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
		// console.log('products: ', products);
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
		// console.log('firstProduct: ', firstProduct);
		if (size && !size2 && firstProduct) {
			const category = firstProduct.item_category?.toLowerCase();
			// console.log('category: ', category);
			
			// Mapping in beide Richtungen: XL -> 48 und 48 -> XL
			// console.log('sizeMapping[category]?.[size]: ', sizeMapping[category]?.[size]);
			if (sizeMapping[category]?.[size]) {
				// Buchstaben → Zahl (z.B. XL -> 48)
				size2 = sizeMapping[category][size];
			} else if (sizeMapping[category]) {
				// console.log('sizeMapping[category]: ', sizeMapping[category]);
				// Zahl → Buchstaben (z.B. 48 -> XL) - Reverse Lookup
				const reverseMatch = Object.entries(sizeMapping[category]).find(([key, val]) => (val === size || String(parseInt(val)+2) === size));
				// console.log('reverseMatch: ', reverseMatch);
				if (reverseMatch) {
					size2 = reverseMatch[0]; // Der Key ist die Buchstaben-Größe
				}
			}
		}
		
		// Baue den String zusammen
		let result = '';
		// console.log('size: ', size);
		if (size) {
			result += '&ctxcustom.size=' + size;
			savedSizes.add(size);
		}

		// console.log('size2: ', size2);
		if (size2) {
			result += '&ctxcustom.size2=' + size2;
			savedSizes.add(size2);
		}
		
		return result;
	};

	const getProductFromEconda = (productDatas) => {
		// console.log('productDatas: ', productDatas);

		const pidParams = productDatas.map(prod => `&pid=${prod.item_variant.slice(0, SKU_WITH_COLOR_END)}`).join('');
		const productSizes = getProductSize(productDatas);

		// Wenn es aus den Produkten im Warenkorb keine nutzbare Größe zu extrahieren gibt (zb Decken oder Schaals) dann wird direkt auf das 
		// alternativ Produkt gewechselt statt einen Request gegen Econda zu machen, da kein sinnvolles Ergebniss zu erwarten ist, ohne mitgesendete Größe
		// console.log('productSizes: ', productSizes);
		// if(productSizes === ""){
		// 	return Promise.resolve(alternativProdukt);
		// }

		// Request gegen Econda für eine Reco mit sinnvollen Produkten
		const url = 'https://widgets.crosssell.info/eps/crosssell/recommendations/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1.do?wid=205&type=cs&aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&'+
					'widgetdetails=true&csize=20&start=0' + productSizes + (productDatas ? pidParams : ''); // &ctxcustom.size=

		// console.log('url: ', url);
		return fetch(url)
			.then(res => res.json())
			.then(data => {
				console.log('data: ', data);
				return data.items.length === 0 ? alternativProdukt : data.items;
			})
			.catch(error => {
				console.log('error: ', error);
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
		.then(KEK.reload)
		.catch(error => {
			// console.error('Fehler:', error);
		});
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
			const strikePrice = KEK.qs('[class*="PriceLabel_priceRow__priceLabel--striked__"]', item);
			const reducePrice = KEK.qs('[class*="PriceLabel_priceRow__priceLabel--discounted__"]', item);
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
		// console.log('econdaProducts: ', econdaProducts);
		// console.log('productsStayInCart: ', productsStayInCart);


		KEK.elem(() => {
			const saveMoney = getSavedMoney();
			return saveMoney >= 20 && saveMoney;
		}, (saveMoney) => {
			if(saveMoney){

				// Finde alle Produkte aus Econda deren Preis kleiner ist als saveMoney
				// Und es werden nur Produkte die direkt die korrekte Größe haben weitergegeben
				// Und die nicht bereits im Warenkorb sind (erste 5 Ziffern)
				const cartSkus = productsStayInCart.map(p => p.item_id.slice(0, SKU_MODEL_END));
				
				let matchingProducts = econdaProducts.filter(product => {
					const productPrice = priceToFloat(product.price);
					const productSizeId = product.sku.slice(SKU_SIZE_START, SKU_SIZE_END);
					const productModelId = product.sku.slice(0, SKU_MODEL_END);
					
					// Prüfe ob Produkt bereits im Warenkorb ist
					if (cartSkus.includes(productModelId)) {
						return false;
					}
					
					let foundMatch = false;
					for (let j = 0; j < productsStayInCart.length && !foundMatch; j++) {
						if (productSizeId === productsStayInCart[j].item_id.slice(SKU_SIZE_START, SKU_SIZE_END)) {
							foundMatch = true;
						}
					}
					return productPrice < saveMoney && foundMatch;
				});

				// Fallback 1 -> größe ONE ist ein Produkt dass es sowieso nur in einer Größe gibt
				if (matchingProducts.length === 0) {
					matchingProducts = econdaProducts.filter(product => {
						const productModelId = product.sku.slice(0, SKU_MODEL_END);
						return priceToFloat(product.price) < saveMoney && product.sku.slice(SKU_SIZE_START, SKU_SIZE_END) === "ONE" && !cartSkus.includes(productModelId);
					});
				}

				// Fallback 2 -> Hauptsache das Produkt ist günstiger als die Ersparniss im Warenkorb
				if (matchingProducts.length === 0) {
					matchingProducts = econdaProducts.filter(product => {
						const productModelId = product.sku.slice(0, SKU_MODEL_END);
						return priceToFloat(product.price) < saveMoney && !cartSkus.includes(productModelId);
					});
				}

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

				// Starte mit dem ersten Produkt
				// console.log('matchingProducts: ', matchingProducts);
				fetchProductDetails(matchingProducts, 0, saveMoney);
			}
		});
	};

	const fetchProductDetails = (matchingProducts, currentIndex, saveMoney) => {

		const econdaProduct = matchingProducts[currentIndex];
		const productID = econdaProduct.sku7;
		const productModelID = productID.slice(0, SKU_MODEL_END);  // Cache für mehrfache Verwendung
		
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

			const matchingStyle = responseData.data.allAvailabilities.styles.find(style => style.id === productID.slice(SKU_STYLE_START, SKU_STYLE_END));
			const produktData = matchingStyle || responseData.data.allAvailabilities.styles[0];

			// Prüfe ob alle Größen ausverkauft sind
			const allSoldOut = produktData.sizes.every(size => size.deliveryTime === "Ausverkauft");
			if (allSoldOut) {
				// console.log('Alle Größen ausverkauft, versuche nächstes Produkt...');
				const nextIndex = currentIndex + 1;
				if (nextIndex < matchingProducts.length) {
					fetchProductDetails(matchingProducts, nextIndex, saveMoney);
				} else if (matchingProducts !== alternativProdukt) {
					// Fallback auf alternativProdukt wenn keine matchingProducts mehr übrig
					fetchProductDetails(alternativProdukt, 0, saveMoney);
				}
				return;
			}

			KEK.elem('[data-testid="cartPage"] [class*="cart_cart-page__wrapper__cart-entries-list_"]', (cartWrapper) => {
				if(cartWrapper){
					// console.log('cartWrapper: ', cartWrapper);
					cartWrapper = cartWrapper[0];

					// Bestehendes kk_addon entfernen und neu aufbauen
					const existingAddon = KEK.qs('#kk_addon');
					if (existingAddon) {
						existingAddon.remove();
					}
					
					// Funktion zum Berechnen der Eco Points (Preis aufgerundet)
					const calculateEcoPoints = (formattedPrice) => {
						const price = parseFloat(formattedPrice.replace(/[^\d,]/g, '').replace(',', '.'));
						return Math.ceil(price);
					};
					
					// Funktion zum Ermitteln der CSS-Klasse basierend auf Lieferzeit
					const getDeliveryClass = (deliveryTime) => {
						if (deliveryTime && (deliveryTime.includes('Woche') || deliveryTime.includes('Ausverkauft'))) {
							return 'ProductAvailability_soonAvailable__G_otz';
						}
						return 'ProductAvailability_available__zjuhf';
					};

					// Wähle Größe: Priorität 1: savedSize die nicht ausverkauft ist, Priorität 2: erste nicht ausverkaufte Größe, Fallback: erste Größe
					const selectedSize = produktData.sizes.find(size => savedSizes.has(size.id) && size.deliveryTime !== "Ausverkauft") 
						|| produktData.sizes.find(size => size.deliveryTime !== "Ausverkauft")
						|| produktData.sizes[0];
					
					// Größen-Dropdown dynamisch erstellen
					const sizeOptionsHTML = produktData.sizes.map(size => {
						const selectedCorrectSize = selectedSize && size.id === selectedSize.id ? 'selected' : '';
						const isDisabled = size.deliveryTime === "Ausverkauft" ? 'disabled' : '';

						return '<option ' + selectedCorrectSize + ' ' + isDisabled + ' value="' + size.id + '" data-price="' + size.price.formattedValue + '" data-delivery="' + size.deliveryTime + '">' + size.name + '</option>';
					}).join('');
					
					// Preis-HTML basierend auf reduziert/nicht reduziert
					const isReduced = econdaProduct.reduced === "true";
					let priceHTML = '';
					const productPrice = selectedSize?.price.formattedValue;
					
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
									'<span class="' + getDeliveryClass(selectedSize?.deliveryTime) + '" data-testid="product-availability-deliveryTime-available" id="kk_delivery_time">' + selectedSize?.deliveryTime + '</span>' +
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

						KEK.eventElem(addToCartBtn, 'click', (e) => {
							e.preventDefault();

							const selectedSizeId = sizeSelect.value;

							// Zusammengesetzte Produkt-ID erstellen: productID + produktData.id + selectedSizeId
							const fullProductID = productModelID + produktData.id + selectedSizeId;
							
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

							// Funktion aufrufen
							addProductToCart(fullProductID);
						});
					}
				}
			});
		});
	};

	let lastCallItems = [];

	const getNewReco = () => {
		KEK.elem(() => {
			const data = window.dataLayer && window.dataLayer.findLast(entry => entry.event === "Ecommerce - view_cart");
			return data && data.ecommerce && data.ecommerce.items;
		}, (items) => {
			if(items && items !== lastCallItems){
				// console.log('items: ', items);

				lastCallItems = items;

				const getSessionStorage = sessionStorage.getItem('kk_added_reco_product');

				for (let i = 0; i < items.length; i++) {
					if(getSessionStorage && (items[i].item_id.substring(0,5) === getSessionStorage.substring(0,5))){
						return;
					}
				}

				// Initial: Econda-Produkte laden
				getProductFromEconda(items).then(econdaProducts => {
					// console.log('econdaProducts: ', econdaProducts);
					if (econdaProducts && econdaProducts.length > 0) {
						initializeCartAddOn(econdaProducts, items);

						KEK.elem('[data-testid="cartPage"] [class*="cart_cart-page__wrapper__cart-entries-list_"]', (cartWrapper) => {
							if(cartWrapper){
								cartWrapper = cartWrapper[0];

								// Callback function to execute when mutations are observed
								const callback = (mutationList) => {
									// console.log('getSavedMoney(): ', getSavedMoney());
									for (const mutation of mutationList) {
										if(mutation.type === "attributes"){
											const leftGreen = KEK.qs('.kk_leftgreen span', cartWrapper);
											if (leftGreen){
												// Update des ErsparnisTextes - Reco schon vorhanden in der Seite
												leftGreen.innerHTML = getPriceToDisplay(getSavedMoney()) + ' €';
											}else{
												// Neue Reco - Reco neu in die Seite einbauen
												initializeCartAddOn(econdaProducts, items);
											}
										}
									}
								};

								// Create an observer instance linked to the callback function
								const observer = new MutationObserver(callback);

								// Start observing the target node for configured mutations
								observer.observe(cartWrapper.parentNode, { attributes: true, childList: true, subtree: true });

							}
						});
					}
				});
			}
		});
	};

	// init
	if(window.location.pathname === "/de/cart") {
		getNewReco();
	}

	let locationNow = "";

	history.pushState = ( f => function pushState(){
		var ret = f.apply(this, arguments);
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	})(history.pushState);

	history.replaceState = ( f => function replaceState(){
		var ret = f.apply(this, arguments);
		window.dispatchEvent(new Event('locationchange'));
		return ret;
	})(history.replaceState);

	window.addEventListener('popstate',()=>{
		window.dispatchEvent(new Event('locationchange'))
	});

	window.addEventListener('locationchange', function(){
		const pathNameNow = window.location.pathname;
		if(pathNameNow === "/de/cart" && locationNow !== pathNameNow){
			setTimeout(() => {
				getNewReco();
			}, 500);
		}
		locationNow = pathNameNow;
	});

})(new window.KEK());