/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	function addClass(element, newClass) {
		if(element && newClass){
			element.classList.add(newClass);
		}
	}

	function removeClass(element, existingClass) {
		if(element && existingClass){
			element.classList.remove(existingClass);
		}
	}

	function goalPush(key, nextPageSend){
		window.iridion.push(['goal', key, "", nextPageSend || false]);
	}	

	function setCookie(name, value, domain, expiresDays) {
		var exdate = new Date();

		exdate.setDate(exdate.getDate() + expiresDays);
		
		document.cookie = name + "=" + encodeURIComponent(value) + ";" + "expires=" + exdate.toUTCString() + ";" + "domain=" + domain + ";path=/";
	}

	function gramatikAnpassung(word) {
		if(word.indexOf("Body") !== -1 || word.indexOf("Waschhandschuh") !== -1 || word.indexOf("Langarmbody") !== -1 ){
			return 'einen '+word;
		}else if(word.indexOf("Papierbox") !== -1 || word.indexOf("Gallseife") !== -1 || 
				word.indexOf("Klapp-Karte") !== -1 || word.indexOf("Mütze") !== -1 || word.indexOf("hose") !== -1 || word.indexOf("Decke") !== -1){
			return 'eine '+word;
		}else if(word.indexOf("Socke") !== -1){
			return 'ein Paar '+word.replace("Socke", "Socken");
		}else {
			return 'ein '+word;
		}
	}

	WATO.prototype.s8_3_GOALS = function(){
		var _self = this;

		function addClickGoal(selector, goalName, nextPageSend){
			_self.elem(selector, function(btn){
				if(btn){
					btn[0].addEventListener('click', function(){
						goalPush(goalName, nextPageSend || false);
					});
				}
			});
		}

		addClickGoal('.kk_pb_column > .payback__form__container', 'kk_click_fold_pb_container');
		addClickGoal('#paybackCardFormButton', 'kk_click_redeem_pb_number');
		addClickGoal('#hessnaturVoucherForm .button.quickadd__button', 'kk_click_redeem_voucher', true);
		addClickGoal('#kk_addToCartButton', 'kk_click_upsell_add_to_cart', true);
		addClickGoal('#kk_upsell_wrapper #kk_sizes', 'kk_click_upsell_size');

		_self.elem('#kk_upsell_wrapper .productItemColor', function(btns){
			if(btns){
				btns.forEach( function(btn) {
					btn.addEventListener('click', function(){
						goalPush('kk_click_upsell_color');
					});
				});
			}
		});
	}


	WATO.prototype.s8_3 = function(variant){
		var _self = this;

		_self.exclude(1023, _self.reload);


		function price2Float(str) {
			return parseFloat(str.replace('€ ', '').replace('.', '').replace(',', '.'));
		}
		function float2Price(num) {
			var _temp = num.toFixed(2).replace('.', ','),
			_pos = _temp.length - 6;

			if(_pos > 0) {
				_temp = _temp.substring(0, _pos)+'.'+_temp.substring(_pos);
			}

			return _temp;
		}



		function buildPaybackContainer() {
			var kk_bottom_checkout_wrapper = _self.qs('.kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container');
			
			_self.elem('#js-payback-form-container', function(payback_form_container){
				if(payback_form_container) {

					if(kk_bottom_checkout_wrapper) {

						/* Build new Payback section / change the layout */

						var payback_points_container = _self.qs('.column.small-12.large-10.large-offset-1 > .payback__form__container');
						var payback_container = payback_form_container[0].closest('.row.h-smallOffset-bottom-outer');

						addClass(payback_container, 'kk_payback_v2');

						// add some new pb HTML 
						if(!_self.qs('.kk_pb_column')){
							payback_form_container[0].parentElement.insertAdjacentHTML('afterBegin', 
								'<div class="kk_pb_column">' +
									'<div class="kk_pb_extended">'+
									'</div>' +
								'</div>'
							);

						}			

						// get added elements for further manipulation
						var kk_pb_column = _self.qs('.kk_pb_column');
						var kk_pb_extended = _self.qs('.kk_pb_extended');

						// remove some styling classes for variant 1
						if(variant === 1) {
							payback_container.firstElementChild.classList.remove('large-10', 'large-10', 'large-offset-1');	
						}

						// fold and extend logic
						if(payback_points_container) {

							// DL 14.11.2022 folgende zwei Zeilen - Payback ist zuerst ausgeblendet
							// addClass(payback_points_container, 'kk-extended');
							addClass(kk_pb_extended, 'kk-hidden');

							kk_pb_column.insertAdjacentElement('afterbegin', payback_points_container);

							payback_points_container.addEventListener('click', function(){
								if(kk_pb_extended.classList.contains('kk-hidden')){
									removeClass(kk_pb_extended, 'kk-hidden');
									addClass(payback_points_container, 'kk-extended');
								} else {
									addClass(kk_pb_extended, 'kk-hidden');
									removeClass(payback_points_container, 'kk-extended');
								}
								
							}); 
						}
					
						kk_pb_extended.append(payback_form_container[0]);

						// Positioning of the new Payback section for each variant
						if(variant === 1) {
							kk_bottom_checkout_wrapper.append(payback_container);
						}
						if(variant === 2) {
							_self.qs('.kk_subtotal_styling').insertAdjacentElement('beforebegin', payback_container);
						}
					}
				}
			});
		}


		// add blue alert at top
		_self.elem('#hessnaturQuickAddForm', function(hessnaturQuickAddForm){
			if(hessnaturQuickAddForm) {
				hessnaturQuickAddForm[0].parentElement.insertAdjacentHTML('afterend', ''+
					'<div class="row">'+
						'<div class="column small-12 large-10 large-offset-1">'+
							'<div id="kk_cart_hint">Artikel im Warenkorb werden nicht reserviert.</div>'+
						'</div>'+
					'</div>'
				);
			}
		});
	
	
		// find bottom CTA so products a loaded
		_self.elem('.h-mediumOffset-bottom-inner .button.success', function(bottomCTA) {
			if(bottomCTA) {

				var _products = _self.qsa('.listing__table--item'), 
					_productCount = _products.length,
					_youSaved = 0,
					_productsIDs = [],
					_additionalDiscountAmount = 0;
		
				// iterate all products and find savings
				for(var i=0; i < _productCount; i++) {
					var _thisProduct = _products[i],
					_oldPrice = _self.qs('.strikeValue', _thisProduct);

					_productsIDs.push(parseInt(_self.qs('.h-text-muted', _thisProduct).textContent.replace("Artikel","")));
	
					if(_oldPrice) {
						var _newPrice = _self.qs('.price', _thisProduct),
						_oldPriceWrapper = _oldPrice.parentElement,
						_save = price2Float(_oldPrice.textContent) - price2Float(_newPrice.textContent);
	
						// sum savings
						if(_save > 0) {
							_youSaved += _save;
						}

						addClass(_oldPriceWrapper, 'kk_price');

						if(variant === 0) {
							_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
								'<div class="kk_save">'+float2Price(_save)+' € Ersparnis</div>'
							);
						} else if(variant === 1 || variant === 2) {
							_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
								'<div class="kk_save">Sie sparen '+float2Price(_save)+' €</div>'
							);
						}
	
						_self.qs('img', _thisProduct).insertAdjacentHTML('afterend', ''+
							'<span style="width: 100%;display: block;text-align: center;margin-top: -13px;">'+
								'<img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;">'+
							'</span>'
						);
					}
				}

				// Additional Discount
				_self.elem('#hessnaturVoucherForm .coupon-value .price.discountPrice', function(discountPrice){
					if(discountPrice) {
						_additionalDiscountAmount = parseFloat(discountPrice[0].textContent.replace(',','.').replace('€','').replace('-',''));
						if(isNaN(_additionalDiscountAmount)) {
							_additionalDiscountAmount = 0;
						}
					}
				});

	
				var sumPrices = _self.qsa('.row:first-child .offset-price-left'),
					kk_sum = sumPrices[0],
					kk_total = sumPrices[1];
				

				_self.elem('#hessnaturVoucherForm', function(hessnaturVoucherForm){
					if(hessnaturVoucherForm) {
						hessnaturVoucherForm = hessnaturVoucherForm[0];
						var _target = hessnaturVoucherForm[0].closest('.bgColor-super-light-gray');

						_target.id="kk_voucher";
						// _target.nextElementSibling.insertAdjacentElement('afterend', _target);
						_target.nextElementSibling.insertAdjacentElement('beforebegin', _target);
					}
				});

				// Cookie läuft nach 5 Tagen ab

				// if(document.cookie.indexOf("kk_upsell_hide") === -1) { // !localStorage.getItem('kk_upsell_hide')

					var upsellProds = {
                        'sale': {
                            'damen': [
                                // Ersparniss >= 25 || 29.95
                                // ['4260189', '4260089', '4260117'],
                                // ['5278909', '5278709', '4260117'],  // updated products 
                                ['5008301', '5278709', '5129289'], // updated 08.12.2022
                                // Ersparniss >= 10
                                ['7018089', '7201089', '4266889']

                            ],'herren': [
                                // Ersparniss >= 25 || 29.95
                                // ['4238409', '4538514', '5037301'],
                                ['5092701', '4238409', '5037301'], // updated 08.12.2022
                                // Ersparniss >= 10
                                ['7018089', '7201089', '4266889']
                            ],
                            'baby': [
                                // Ersparniss >= 25 || 29.95
                                // ['5203901', '5170494', '5528001'],
                                // ['5203801', '5222740', '5528001'],  // updated products
                                ['1765001', '3288601', '1764664'],  //  updated 08.12.2022
                                // Ersparniss >= 10
                                // ['3658101', '1786201', '5204336']
                                // ['3658101', '1786201', '3984501']    // updated products
                                ['3984501', '1786201', '5309101']   // updated 08.12.2022
                            ],
                            'home': [
                                // Ersparniss >= 25 || 29.95
                                // ['5093162', '5038209', '4955142'],
                                ['4971731', '5302712', '5038209'],  // updated 08.12.2022
                                // Ersparniss >= 10
                                // ['5212562', '5216900', '5212924']
                                ['4953996', '5289101', '5320412']  // updated 16.12.2022
                            ],
                            // Default von Damen
                            'sonstiges': [
                                ['4260189', '4260089', '4260117']
                            ]
                        }
							// 'voucher': {
							// 	'damen': [
							// 		// Ersparniss >= 25
							// 		['4260089'],
							// 		// Ersparniss >= 10
							// 		['7018089'],

							// 	],'herren': [
							// 		// Ersparniss >= 25
							// 		['4238409'],
							// 		// Ersparniss >= 10
							// 		['7018089'],
							// 	],
							// 	'baby': [
							// 		// Ersparniss >= 25
							// 		['5203901'],
							// 		// Ersparniss >= 10
							// 		['4332829'],
							// 	],
							// 	'home': [
							// 		// Ersparniss >= 25
							// 		['5038209'],
							// 		// Ersparniss >= 10
							// 		['5178512']
							// 	]
							// },
					},
					upsellPreselect = {
						'4793601': '479360151'
					};

					
					var isVoucher = _self.qs('[name="voucherCode"][value="ALLES21"]'),
						promoProd = upsellProds[(isVoucher ? 'voucher' : 'sale')][window.iridion.push(['profile', 'getValue', 'categoryAffinity'])];

					// Fallback if affinity is undefined & no voucher is used	
					if(!promoProd) {
						promoProd = upsellProds['sale']['damen'];
					}

					// decide which product will be shown
					var upsellIndex = 2,
						_youSavedOnlySale = _youSaved;

					// if(isVoucher){
					// 	var voucherSave = parseFloat(isVoucher.parentNode.nextElementSibling.textContent.replace("-", "").replace(",", ".").replace("€", ""));

					// 	if(voucherSave){
					// 		_youSaved = _youSaved + voucherSave;
					// 	}

					// 	goalPush("voucher_alles21");

					// }

					if(_youSaved > 0){
						if(_youSavedOnlySale > 0){
							addClass(kk_sum, 'discountPrice')
	
							kk_sum.insertAdjacentHTML('afterend', ''+
								'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_sum.textContent) + _youSavedOnlySale)+' €*</div>'
							);
						}
						if(variant === 0) {
							try {
								_self.qs('.btn-deliverycosts, .h-xsmallOffset-top-outer strong + strong').insertAdjacentHTML('afterend', ''+
									'<br/>'+
									'<div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> <span id="kk_yousave">'+float2Price(_youSaved)+'</span> €</div>'
								);
							} catch (error) {
					
							}
						}

						// if(isVoucher){
						// 	_self.qs('#kk_yousave').parentNode.insertAdjacentElement('beforebegin', isVoucher.parentNode.parentNode.parentNode);
						// }
					}
					
					if(variant === 0) {
						if(_youSaved >= (isVoucher ? 25 : 25) || (isVoucher && window.location.href.indexOf("?voucher=25") !== -1)) {
							upsellIndex = 0;
						}else if(_youSaved >= 10 || (isVoucher && window.location.href.indexOf("?voucher=10") !== -1)) {
							upsellIndex = 1;
						}
					} else if(variant === 1 || variant === 2) {
						if((_youSaved + _additionalDiscountAmount) >= (isVoucher ? 29.95 : 29.95)) {
							upsellIndex = 0;
						} else if((_youSaved + + _additionalDiscountAmount) >= 10 ) {
							upsellIndex = 1;
						}
					}
				

					var subtotalDiv = kk_sum.parentElement.parentElement.parentElement.parentElement;

					var callout = _self.qs('.js_backstopWrapper > .callout.dark-gray');

					_self.elem('.js_backstopWrapper > .callout.dark-gray', function(calloutForm) {  
						if(calloutForm){
							calloutForm = calloutForm[0];

							if(variant === 1 || variant === 2) {
								if(calloutForm) {
									calloutForm.insertAdjacentHTML('beforeBegin', 
										'<div class="kk_bottom_checkout_wrapper row">' +
											'<div class="kk_inner_bottom_checkout_wrapper column small-12 large-10 large-offset-1">' +
												'<div class="kk_border_container">' +
													// '<div class="kk_voucher_input_area row h-xsmallOffset-bottom-outer">' +
													// 	'<div class="column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer"></div>' + 
													// '</div>' + 
												'</div>' +
											'</div>' +
										'</div>'
									);
			
									var kk_bottom_checkout_wrapper = _self.qs('.kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container');
								
									if(kk_bottom_checkout_wrapper) {
				
										/* Build inside of the kk_border_container */
										var kk_voucher = _self.qs('#kk_voucher') || _self.qs('#hessnaturVoucherForm.column.small-12').parentElement.parentElement,
											final_price_container = _self.qs('.column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer .price.offset-price-left').closest('.row.h-xsmallOffset-bottom-outer'),
											continue_shopping_btn = _self.qs('.row.h-mediumOffset-bottom-inner .column .button.expanded-small-only'),
											continue_or_payment_btn_container = continue_shopping_btn.closest('.row.h-mediumOffset-bottom-inner'),
											elementsArr = [kk_voucher, final_price_container, continue_or_payment_btn_container];
							

										//KK Voucher umbauen
										_self.elem('#hessnaturVoucherForm .button.quickadd__button', function(submit){
											if(submit) {
												var input_label = _self.qs('label', kk_voucher);
												if(input_label) {
													input_label.parentElement.append(submit[0]);
												}
											}
										});

										// change finalpice mute text
										var price_mute_text = _self.qs('.text-right.h-text-muted',final_price_container);
										if(price_mute_text){
											price_mute_text.innerHTML = 'inkl. 19% MwSt.';
										}
										


										//kk save box
										if(_youSaved) {
											final_price_container.lastElementChild.insertAdjacentHTML('beforeend', 
												'<div class="kk_save">Sie sparen '+float2Price(_youSaved + _additionalDiscountAmount)+' €</div>');
										}


										// Add classes 
										addClass(final_price_container, 'kk_final_price_container');
										addClass(continue_or_payment_btn_container, 'kk_btn_redesign')
										addClass(subtotalDiv, 'kk_subtotal_styling');
										if(variant === 2) {
											addClass(subtotalDiv, 'column');
										}

										// remove class for subtotalprice
										var subtotal_price = _self.qs('.price.strikeValue', subtotalDiv);

										if(subtotal_price) {
											removeClass(subtotal_price, 'column');
										}


										// Move elements into wrapper
										for(var i=0; i<elementsArr.length; i++) {
											kk_bottom_checkout_wrapper.insertAdjacentElement('beforeEnd', elementsArr[i]);
										}

										// add ordervalue if ordervalue differs from the finalprice
										if(kk_voucher) {
											var ordervalue_element = _self.qs('.price.offset-price-left.discountPrice');
											if(ordervalue_element){
												var ordervalue_element_clone = ordervalue_element.cloneNode(true);
												if(ordervalue_element_clone.textContent !== _self.qs('.column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer > .price').textContent) {
													kk_voucher.insertAdjacentHTML('afterend', 
													'<div class="kk_ordervalue_container row h-xsmallOffset-bottom-outer">' +
														'<div class="column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer"></div>' +
														'<div class="column small-12 medium-6 large-5">' +
															'<div class="row align-right">' +
																'<div class="kk_ordervalue column small-6 medium-12 h-xsmallOffset-bottom-outer">' +
																	'<strong>Bestellwert</strong>' +
																	//ordervalue +
																'</div>' +	
															'</div>' +
														'</div>' +
													'</div>');

													_self.qs('.kk_ordervalue').insertAdjacentElement('beforeend', ordervalue_element_clone);
												}
											}
										}
				
										// add kk_shipping_info_container
										if(final_price_container){
											final_price_container.insertAdjacentHTML('beforebegin',
											'<div class="kk_shipping_info_container row h-xsmallOffset-bottom-outer">' +
												'<div class="column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer"></div>' +
												'<div class="column small-12 medium-6 large-5">' +
													'<div class="row align-right">' +
														'<div class="kk_shipping_info column small-6 medium-12 h-xsmallOffset-bottom-outer">' +
															'<p>Versandkosten werden im nächsten Schritt berechnet.</p>' +
															'<hr>' +
														'</div>' +	
													'</div>' +
												'</div>' +
											'</div>');
										}

										// add kk_payment_info_container
										if(continue_or_payment_btn_container) {
											continue_or_payment_btn_container.insertAdjacentHTML('afterend',
											'<div class="kk_payment_info_container row h-xsmallOffset-bottom-outer">' +
												'<div class="column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer"></div>' +
												'<div class="column small-12 medium-6 large-5">' +
													'<div class="row align-right">' +
														'<div class="kk_payment_info column small-6 medium-12 h-xsmallOffset-bottom-outer">' +
															'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/paymentoptions.svg"></div>' +
														'</div>' +	
													'</div>' +
												'</div>' +
											'</div>');
										}


										/* Build new Payback section */
										_self.elem('#js-payback-form-container', function(payback_form_container){
											if(payback_form_container) {
												buildPaybackContainer();
											}
										});
									
										// hide dividing lines
										var divider = _self.qsa('.js_backstopWrapper > .row.h-smallOffset-bottom-outer:not(.kk_payback_v2)');
										if(divider) {
											divider.forEach(function(element){
												if(!element.firstElementChild.firstElementChild.classList.contains('kk_pb_row')) {
													element.style.display = "none";
												}	
											});
										}
									}	
								}
							}
						}
					});


					if(promoProd){
						var promo = promoProd[upsellIndex];

						// if product found get product info from API
						if(promo) {

							function getProductData(alternativKey) {

								var prodUsk = parseInt(promo[alternativKey].substring(0,5));

								if(_productsIDs.indexOf(prodUsk) !== -1){
									// Liegt das Promo Produkt schon im WK dann nimm eine Alternative
									alternativKey++;
									if(alternativKey < 3){
										getProductData(alternativKey);
									}
								} else {

									_self.xhr_get('https://www.hessnatur.com/de/p/'+prodUsk+'/json', false, function(data){
										
										if(document.cookie.indexOf("kk_upsell_hide") === -1) {
										
											if(!data){
												// Wenn das Produkt mit dieser ID nicht existiert
												alternativKey++;
												if(alternativKey < 3){
													getProductData(alternativKey);
												}
											}else{

												var init_img_url = '',
												init_color_text = '',
												init_price = '',
												name = data.name,

												colors = {},
												colorsHTML = '',
												sizesHTML = '',

												prod_variations = data.colors,
												prod_variation_count = prod_variations.length,

												isGenerallyAvailable = false,

												buildSizesHTML = function(_sizes){
													var _sizeCount = _sizes.length,
													_sizesHTML = '';

													for(var s = 0; s < _sizeCount; s++) {
														var thisSize = _sizes[s];

														_sizesHTML += '<option '+(thisSize.available ? '' : 'disabled=""')+' value="'+thisSize.code+'" '+((sizesHTML === '' && upsellPreselect[promo[alternativKey]] === thisSize.code) ? 'selected="selected"' : '' )+'>'+thisSize.size+'</option>';
													}

													return _sizesHTML;
												};

											for(var p = 0; p < prod_variation_count; p++) {
												var thisProd = prod_variations[p];

												if(thisProd.availabilityIndex !== 100 && thisProd.available) {
													if(init_img_url === '') {
														init_img_url = thisProd.modelImageUrl || thisProd.articleImageUrl;
														init_color_text = thisProd.color;
														init_price = thisProd.price;

														sizesHTML = buildSizesHTML(thisProd.sizes);
													}

													var colorCode = thisProd.colorCode;

													colors[colorCode] = thisProd;

													colorsHTML += '<li data-color="'+colorCode+'" data-colorname="'+thisProd.color+'">'+
														'<a class="productItemColor" href="#color" onclick="return false">'+
															'<img itemprop="image" src="'+thisProd.colorUrl+'" alt="2312754" class="h-shape-circle">'+
														'</a>'+
													'</li>';

													isGenerallyAvailable = true;
												}
											}

											if(!isGenerallyAvailable){
												// Wenn das Produkt in keiner Farbe verfügbar ist wird die nächste Alternative gewählt
												alternativKey++;
												if(alternativKey < 3){
													getProductData(alternativKey);
												}
											}

											if(variant === 0 ) {								
												subtotalDiv.insertAdjacentHTML('afterend', ''+
													'<div id="kk_upsell_wrapper" class="row">'+
														'<div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer">'+
															'<div id="kk_upsell_inner" class="row">'+
																'<div class="medium-5">'+
																	'<div id="kk_upsell_left">'+
																		'<p>Glückwunsch, <br/>Sie sparen '+float2Price(_youSaved)+'&nbsp€</p>'+ // !
																		'<p>Warum nicht einfach die Ersparnis nutzen und '+ gramatikAnpassung(name) +' für nur <b id="kk_price_left">'+float2Price(init_price)+'&nbsp;€</b> hinzufügen?</p>'+
																	'</div>'+
																'</div>'+
																'<div id="kk_upsell_right" class="medium-7">'+
																	'<div class="kk_img_wrapper">'+
																		'<img id="kk_upsell_img" src="'+init_img_url+'"/>'+
																	'</div>'+
																	'<div class="kk_upsell_column">'+
																		'<div class="kk_upsell_spacebetween">'+
																			'<div class="kk_product_name">'+
																				'<a href="'+data.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+name+'</a>'+
																			'</div>'+
																			'<div class="kk_price_div">'+
																				'<div class="row align-right-for-medium">'+
																					'<div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+float2Price(init_price)+'</span>&nbsp;€*</div>'+
																				'</div>'+
																				'<p class="h-text-muted">inkl. 19% MwSt.</p>'+
																			'</div>'+
																		'</div>'+
																		'<div>'+
																			'<div class="kk_color_selection">'+
																				'<p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+init_color_text+'</span></p>'+
																				'<ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+
																					colorsHTML+
																				'</ul>'+
																			'</div>'+
																			'<div class="kk_size_selection">'+
																				'<p>'+
																					'<span class="h-text-muted">Größe:</span> '+ 
																					'<select id="kk_sizes" class="custom__select">'+sizesHTML+'</select>'+
																				'</p>'+
																			'</div>'+
																		'</div>'+
																		'<div class="kk_upsell_spacebetween">'+
																			'<div>'+
																				'<div class="kk_garbage_container column row align-self-bottom small-12">'+
																					'<div class="align-self-bottom shrink h-no-padding-right">'+
																						'<button id="kk_hide_upsell" type="button" class="js-entry-remove textLink">'+
																							'<img src="/_ui/responsive/common/images/icons/garbage.svg" class="icon-trash">'+
																						'</button>'+
																					'</div>'+
																					// '<div>'+
																					// 	'<button type="button" class="js-entry-edit textLink" style="margin-right: 10px">'+
																					// 		'<img src="/_ui/responsive/common/images/icons/edit.png" title="Details ändern" class="icon-edit">'+
																					// 	'</button>'+
																					// '</div>'+
																				'</div>'+
																			'</div>'+
																			'<div>'+
																				'<button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit">'+
																					'<span class="pds-cockpit__addToCartButtonIconWrapper">Zum Warenkorb hinzufügen</span>'+
																				'</button>'+
																			'</div>'+
																		'</div>'+
																	'</div>'+
																'</div>'+
															'</div>'+
														'</div>'+
													'</div>'
												);
											}

											else if(variant === 1 || variant === 2) {

												var upsellPosition = '';
												if(variant === 1 && subtotalDiv){
													upsellPosition = subtotalDiv;
												} else if (variant === 2 && _self.qs('.kk_pb_row')){
													upsellPosition = _self.qs('.kk_pb_row').parentElement.parentElement;
												} else { // Fallback
													upsellPosition = kk_sum.parentElement.parentElement.parentElement.parentElement;
												}

												upsellPosition.insertAdjacentHTML('afterend', ''+
													'<div id="kk_upsell_wrapper" class="row">'+
														'<div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer column">'+
															'<div id="kk_upsell_inner" class="row">'+
																'<div id="kk_upsell_left">'+
																	'<p>Glückwunsch! Sie sparen '+float2Price(_youSaved + _additionalDiscountAmount)+'&nbsp€</p>'+ 
																'</div>'+
																'<div class="kk_seperation_line">' +
																	'<hr>' +
																'</div>' +
																'<div id="kk_upsell_right" class="medium-12">'+

																	'<div class="kk_reason_wrapper">' +
																		'<div class="kk_inner_reason_wrapper">' +
																		'<div class="kk_reason_question">Warum nicht einfach die Ersparnis nutzen?</div>' +
																		// '<div class="kk_reason_text">Fügen Sie ein Paar Socken aus Bio-Baumwolle für nur 7.95</div>' +
																		'<p class="kk_reason_text">Fügen Sie '+ gramatikAnpassung(name) +' für nur <b id="kk_price_left">'+float2Price(init_price)+'&nbsp;€</b> hinzu. Erhältlich in verschiedenen Farben.</p>'+
																		'</div>' +
																	'</div>' +

																	'<div class="kk_img_wrapper">'+
																		'<img id="kk_upsell_img" src="'+init_img_url+'"/>'+
																	'</div>'+
																	'<div class="kk_upsell_row">'+
																		'<div class="kk_upsell_column medium-4">'+
																			'<div class="kk_product_name">'+
																				'<a href="'+data.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+name+'</a>'+
																			'</div>'+
																			'<div class="kk_price_div">'+
																					'<div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+float2Price(init_price)+'</span>&nbsp;€*</div>'+
																				'<p class="h-text-muted">inkl. 19% MwSt.</p>'+
																			'</div>'+
																		'</div>'+
																		'<div class="kk_upsell_column">'+
																			'<div class="kk_color_selection">'+
																				'<p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+init_color_text+'</span></p>'+
																				'<ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+
																					colorsHTML+
																				'</ul>'+
																			'</div>'+
																			'<div class="kk_size_selection">'+
																				'<p>'+
																					'<span class="h-text-muted">Größe:</span> '+ 
																					'<select id="kk_sizes" class="custom__select">'+sizesHTML+'</select>'+
																				'</p>'+
																			'</div>'+
																		'</div>'+
																		'<div class="kk_addToCartDiv">'+
																			'<div>'+
																				'<button id="kk_addToCartButton" class="button success expanded js-add-to-cart-button" type="submit">'+
																					'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/%2B.svg" alt="">'+
																					'<span class="pds-cockpit__addToCartButtonIconWrapper">Hinzufügen</span>'+
																				'</button>'+
																			'</div>'+
																		'</div>'+
																	'</div>'+
																'</div>'+
															'</div>'+
														'</div>'+
													'</div>'
												);

												const kk_upsell_wrapper = _self.qs('#kk_upsell_wrapper');

												// set first color active
												addClass(_self.qs('.js-color-bubbles li'), 'active');
												
												var changeColor = function(e){
													try {
														e.preventDefault();
													} catch (error) {
													}
													
													try {
														var _li = this ? this.parentElement : e.parentElement,
														_color = colors[_li.getAttribute('data-color')];
		
														// update sizes dropdown
														_self.qs('#kk_sizes').innerHTML = buildSizesHTML(_color.sizes);
		
														// update product image 
		
														if(variant === 0) {
															_self.qs('#kk_upsell_img').setAttribute('src', (_color.modelImageUrl || _color.articleImageUrl));
														} else if(variant === 1 || variant === 2) {
															_self.qs('#kk_upsell_img').setAttribute('src', (_color.modelImageUrl || _color.articleImageUrl).replace('_1.','_7.'));
														}
		
														// set selected color active
														// _self.qs('.active', kk_upsell_wrapper).classList.remove('active');
														removeClass(_self.qs('.active', kk_upsell_wrapper), 'active');
														addClass(_li, 'active')
		
														_self.qs("#kk_colorname").innerHTML = _li.getAttribute('data-colorname');
		
														// trigger change for price update
														if ("createEvent" in document) {
															var evt = document.createEvent("HTMLEvents");
															evt.initEvent("change", false, true);
															_self.qs('#kk_sizes').dispatchEvent(evt);
														}else {
															_self.qs('#kk_sizes').fireEvent("onchange");
														}
													}
													catch(err) {
														
													}
		
													return false;
												},
												changeSize = function(){
													try {
														var _val = this.value,
														_li = _self.qs('.active .productItemColor', kk_upsell_wrapper),
														_color = colors[_li.parentElement.getAttribute('data-color')];
		
														var _price = _color.sizes.filter(function(k){ 
															return k.code === _val;
														})[0].price;
		
														// update price
														_self.qs('#kk_price').innerHTML = float2Price(_price);
														_self.qs('#kk_price_left').innerHTML = float2Price(_price)+'&nbsp;€';
													}
													catch(err) {}
												};
		
												var _color_bopsels = _self.qsa('.productItemColor', kk_upsell_wrapper);
		
												for(var c = 0; c < _color_bopsels.length; c++) {
													_color_bopsels[c].addEventListener('click', changeColor);
												}
		
												// set right color active
												changeColor(_self.qs('.js-color-bubbles li[data-color="'+promo[alternativKey].substring(5,7)+'"] a', kk_upsell_wrapper));
		
												
												_self.qs('#kk_sizes').addEventListener('change', changeSize);
		
		
												_self.qs('#kk_addToCartButton', kk_upsell_wrapper).addEventListener('click', function(){
													var _prodId = _self.qs('#kk_sizes').value,
													params = { 
														productCodePost: _prodId,
														ff_id: _prodId,
														ff_masterId: data.code,
														ff_title: encodeURIComponent(name),
														ff_price: price2Float(_self.qs('#kk_price').textContent),
														qty: 1,
														CSRFToken: window.ACC.config.CSRFToken
													};
		
													// goalPush('kk_s8_a2c');
		
													if(_prodId !== '') {
														_self.xhr_post('https://www.hessnatur.com/de/cart/add', 
															Object.keys(params).map(function(k){ 
																return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
																}).join('&'), 
														function(){
															// localStorage.setItem('kk_upsell_hide', 1);
															
															setCookie('kk_upsell_hide', 'true', ".hessnatur.com", 5);
		
															location.href=location.href.split('#')[0];
															location.reload();
														});
													}
												});
											}
										}




										if(variant === 0) {
											_self.qs('#kk_hide_upsell', kk_upsell_wrapper).addEventListener('click', function(){
											// goalPush('kk_s8_del');

											setCookie('kk_upsell_hide', 'true', ".hessnatur.com", 5);

											// localStorage.setItem('kk_upsell_hide', 1);
											kk_upsell_wrapper.outerHTML = '';
											});
										}

										}
									});

								}

							}

							getProductData(0);

						}
					}
				// }
				
	
				// kk_total.id="kk_total";
				if(_youSaved > 0){
					addClass(kk_total, 'discountPrice');

					kk_total.insertAdjacentHTML('afterend', ''+
						'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_total.textContent) + _youSaved)+' €*</div>'
					);
	
					try {
						kk_total.closest('.h-xsmallOffset-bottom-outer:not(.column)').insertAdjacentHTML('afterbegin', '<div class="column small-12 large-10 large-offset-1"><hr></div>');
					} catch (error) {
						
					}
					
				}

				// Voucher werden immer mit Seitenreload hinzgefügt und entfernt, hier kann einfach auf die Element gepollt werden
				_self.elem('#hessnaturVoucherForm:not(.column)', function(voucherForms){
					if(voucherForms) {

						// var voucher_input = _self.qs('#kk_voucher');
						// var ordervalue = _self.qs('.kk_ordervalue_container');
						// var shipping_info_container = _self.qs('.kk_shipping_info_container');
						_self.elem('.kk_shipping_info_container', function(shipping_info_container){
							// if(voucher_input) {
							if(shipping_info_container) {
								voucherForms.forEach(function(voucherForm){
									shipping_info_container[0].insertAdjacentHTML( 'beforebegin',
										'<div class="kk_active_voucher_container row h-xsmallOffset-bottom-outer">' +
											'<div class="column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer"></div>' +
											'<div class="column small-12 medium-6 large-5">' +
												'<div class="row align-right">' +
													'<div class="kk_active_voucher column small-6 medium-12 text-right h-xsmallOffset-bottom-outer">' +
														// Voucherform gets placed here
													'</div>' +
												'</div>' +
											'</div>' +
										'</div>'
									);

									_self.qs('.kk_active_voucher').append(voucherForm);


									var coupon_name = _self.qs('.coupon-name', voucherForm);
									removeClass(coupon_name, 'column');

									// insert additional container
									coupon_name.insertAdjacentHTML('afterBegin', 
										'<div class="kk_coupon_wrapper"></div>'
									);

									var kk_coupon_wrapper = _self.qs('.kk_coupon_wrapper', voucherForm);

									kk_coupon_wrapper.append(_self.qs('.coupon-name strong', voucherForm));
									kk_coupon_wrapper.append(_self.qs('.coupon-name input', voucherForm));

									var remove_btn = voucherForm.firstElementChild.firstElementChild.firstElementChild;

									// change img src (remove icon)
									remove_btn.firstElementChild.src = "https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/X.svg";

									// reposition btn
									coupon_name.firstElementChild.append(remove_btn);
								

									// fix CSS classes 
									var coupon_text = coupon_name.previousElementSibling;
									coupon_text.textContent = 'Gutschein-/Aktionscode';
									removeClass(coupon_text, 'column');
									removeClass(coupon_name.nextElementSibling, 'column');
									addClass(coupon_name.parentElement, 'column');
								});
							}
						});
						
					}
				});



				/* Payback interactions */
				_self.ajax('updatePaybackNumber', function() {

					buildPaybackContainer();

				});

				_self.ajax('removePaybackNumber', function() {
					_self.elem('#paybackCardForm #paybackCardNumber', function(pbCardNumber){
						if(pbCardNumber){;
							buildPaybackContainer();
						}
					});
				});
				
			}
		});
	};
	
})(window.WATO);