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

	function xhr_get(url, scopedData, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
			try {
				var data = JSON.parse(this.response);
				callback(data, scopedData);
			}
			catch(e) {
				callback(data);    
			}
			} else {
				// We reached our target server, but it returned an error
				callback(false);
			}
		};
		
		request.onerror = function() {
			// There was a connection error of some sort
			callback(false);
		};
		request.withCredentials = true;
		request.send();
	};


	WATO.prototype.s8_4_GOALS = function(variant){
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

		// additional Goals kept from AB 8.3
		if (variant === 1 || variant === 2) {
			addClickGoal('.kk_pb_column > .payback__form__container', 'kk_click_fold_pb_container');
		}
		addClickGoal('#paybackCardFormButton', 'kk_click_redeem_pb_number');
		addClickGoal('#hessnaturVoucherForm .button.quickadd__button', 'kk_click_redeem_voucher', true);

		// new 8.4 Goals
		addClickGoal('.js-entry-remove', 'kk_delete_product', true);
		addClickGoal('.js-entry-edit', 'kk_click_edit_pencil');

		// Change amount  (Goal for Variants in in the Variant Code itself below)
		if(variant === 0) {
			_self.elem('.item__amount .input-group-field.qty', function(qtyInput){
				if(qtyInput){
					qtyInput.forEach(function(input){
						input.addEventListener('change', function(){
							goalPush('kk_change_product_quantity', true);
						});
					});
				}
			});
		}
	}


	WATO.prototype.s8_4 = function(variant){
		var _self = this;

		// _self.exclude(1023, _self.reload);


		function price2Float(str) {
			return parseFloat(str.replace('€ ', '').replace('.', '').replace(',', '.'));
		}
		function float2Price(num) {			
			if(num.toFixed(2) % 1 === 0) {
				var result = num.toFixed(0);
				if(num.toFixed(0).length > 3) {
					result = mach_tausender(num.toFixed(0));
				}
				return result;
			}

			else {
				var _temp = num.toFixed(2).replace('.', ','),
				_pos = _temp.length - 6;
	
				if(_pos > 0) {
					_temp = _temp.substring(0, _pos)+'.'+_temp.substring(_pos);
				}
				return _temp;
			}
		}

		function mach_tausender(zahl) {
			//var i;
			var j=0;
			var ergebnis="";
		 
			var i = zahl.length - 1;
				while (i >= 0) {
				ergebnis=zahl.substr(i,1)+ergebnis;
				j++;
				if (j==3) {
					ergebnis="."+ergebnis;
					j=0;
				}
				i--;
				}
				return ergebnis;
		}
		

		function minusOrPlusClick(className, operator, _thisProduct) {
			_self.qs(className, _thisProduct).addEventListener('click', function(e){
				var qtyAmount = _self.qs('.qty', e.target.closest(".item__form")),
					newAmount = _self.qs('.kk_qty', e.target.parentNode.parentNode),
					qtyNumber = parseInt(qtyAmount.value);
	
	
				if(operator === '-') {
					if(qtyNumber > 1){
					// if(qtyNumber > 0){
						qtyAmount.value = qtyNumber - 1;
						newAmount.value = qtyNumber - 1;
						productQuantityChangeTimeout(e);
					}
				} else {
					qtyAmount.value = qtyNumber + 1;
					newAmount.value = qtyNumber + 1;
					productQuantityChangeTimeout(e);
				}
			});
		}
	
		function productQuantityChangeTimeout(e) {
			setTimeout(function(){
				goalPush('kk_change_product_quantity', true);
				_self.qs('.item_refresh', e.target.closest(".item__form")).click();
			}, 2000);
		}

		function insertBorderContainerElementLayout(element, positioning, className, content) {
			element.insertAdjacentHTML(positioning,
			'<div class="' + className + '_container row h-xsmallOffset-bottom-outer">' +
				'<div class="column small-12 medium-6 large-5">' +
					'<div class="row align-right">' +
						'<div class="' + className + ' column small-6 medium-12 h-xsmallOffset-bottom-outer">' +
							content +
						'</div>' +	
					'</div>' +
				'</div>' +
			'</div>');
		}

		function buildPaybackContainer() {
			var kk_bottom_checkout_wrapper = _self.qs('.kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container');
			
			_self.elem('#js-payback-form-container', function(payback_form_container){
				if(payback_form_container && kk_bottom_checkout_wrapper) {

					/* Build new Payback section / change the layout */

					var payback_points_container = _self.qs('.column.small-12.large-10.large-offset-1 > .payback__form__container');
					var payback_container = payback_form_container[0].closest('.row.h-smallOffset-bottom-outer');

					// add some new pb HTML 

					var kk_pb_column = _self.qs('.kk_pb_column');
					// if(!_self.qs('.kk_pb_column')){
					if(!kk_pb_column){
						payback_form_container[0].parentElement.insertAdjacentHTML('afterBegin', 
							'<div class="kk_pb_column">' +
								'<div class="kk_pb_extended">'+
								'</div>' +
							'</div>'
						);

						kk_pb_column = _self.qs('.kk_pb_column');
					}			

					// get added elements for further manipulation
					var kk_pb_extended = _self.qs('.kk_pb_extended');

					// fold and extend logic
					if(payback_points_container) {

						addClass(payback_points_container, 'kk-extended');
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

					if(payback_container) {

						addClass(payback_container, 'kk_payback_v2');

						// remove some styling classes for variant 1
						if(variant === 1) {
							payback_container.firstElementChild.classList.remove('large-10', 'large-offset-1');	
							// Positioning of the new Payback section for each variant
							kk_bottom_checkout_wrapper.append(payback_container);
						}

						// Positioning of the new Payback section for each variant
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
						_oldPrice = _self.qs('.strikeValue', _thisProduct),
						proImg = _self.qs('img', _thisProduct),
						lineArtikel = _self.qs('.h-text-muted', _thisProduct),
						sizeAndColor = _self.qs('.medium-4', _thisProduct),
						amount = _self.qs('.item__amount', _thisProduct),
						editBtn = _self.qs('.js-entry-edit', _thisProduct),
						removeBtn = _self.qs('.icon-trash', _thisProduct),
						// qtyAmount = _self.qs('.qty', amount),
						articleID = lineArtikel.textContent.replace("Artikel",""); // Not only Numbers, it could be that the ID have some letters at the end
					
					proImg.setAttribute('src', proImg.getAttribute('src').replace("hyb_redes_cart_overview", "hyb_redes_list_main"));

					_productsIDs.push(parseInt(articleID));

					lineArtikel.innerHTML = '<span>Artikel:</span>'+articleID.trim();

					// Editbutton
					if(editBtn && sizeAndColor) {
						sizeAndColor.insertAdjacentElement('beforeend', editBtn);
						sizeAndColor.insertAdjacentElement('beforeend', _self.qs('.js-entry-edit-cancel', _thisProduct).parentNode);
					}

					
					// Farbe und Größe
					lineArtikel.insertAdjacentElement('afterend', sizeAndColor);

					amount.parentNode.parentNode.style.display = "none";
					proImg.parentNode.insertAdjacentHTML('afterend', 
						'<div class="kk_amount">'+
							'<span class="kk_minus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/minus.svg"></span>'+
							'<input class="kk_qty" type="number" pattern="^[1-9][0-9]{1,2}$|^\d$" required="required" value="'+_self.qs('.qty', amount).value+'" maxlength="2">'+
							'<span class="kk_plus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/plus.svg"></span>'+
						'</div>'
					);

					minusOrPlusClick('.kk_minus', '-', _thisProduct);
					minusOrPlusClick('.kk_plus', '+', _thisProduct);

					_self.qs('.kk_qty', _thisProduct).addEventListener('change', function(e){
						var thisTarget = e.target;
						if(!(parseInt(thisTarget.value) > 0)){
							addClass(thisTarget.parentElement, "kk_errormsg");
						}else{
							goalPush('kk_change_product_quantity', true);
							_self.qs('.qty', thisTarget.closest(".item__form")).value = thisTarget.value;
							_self.qs('.item_refresh', e.target.closest(".item__form")).click();
						}
					});

					// if(removeBtn) {
					// 	removeBtn.setAttribute('src','https://media.hessnatur.com/kk/2022/AB8.4/X.svg');
					// }


	
					if(_oldPrice) {
						var _newPrice = _self.qs('.price', _thisProduct),
						_oldPriceWrapper = _oldPrice.parentElement,
						_save = price2Float(_oldPrice.textContent) - price2Float(_newPrice.textContent);

						// sum savings
						if(_save > 0) {
							_youSaved += _save;
						}

						addClass(_oldPriceWrapper, 'kk_price');

						var oldPriceWrapperParent = _oldPrice.parentElement.parentElement;
						if(oldPriceWrapperParent){
							addClass(oldPriceWrapperParent, 'kk_flex_column');
						}

						if(variant === 0) {
							_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
								'<div class="kk_save">'+float2Price(_save)+' &euro; Ersparnis</div>'
							);
						} else if(variant === 1 || variant === 2) {
							_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
								'<div class="kk_save">Sie sparen '+float2Price(_save)+' &euro;</div>'
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
									['5278909', '5278709', '4260117'],  // updated products
									// Ersparniss >= 10
									['7018089', '7201089', '4266889']

								],'herren': [
									// Ersparniss >= 25 || 29.95
									['4238409', '4538514', '5037301'],
									// Ersparniss >= 10
									['7018089', '7201089', '4266889']
								],
								'baby': [
									// Ersparniss >= 25 || 29.95
									// ['5203901', '5170494', '5528001'],
									['5203801', '5222740', '5528001'],  // updated products
									// Ersparniss >= 10
									// ['3658101', '1786201', '5204336']
									['3658101', '1786201', '3984501']	// updated products
								],
								'home': [
									// Ersparniss >= 25 || 29.95
									['5093162', '5038209', '4955142'],
									// Ersparniss >= 10
									['5212562', '5216900', '5212924']
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
							addClass(kk_sum, 'discountPrice');
	
							kk_sum.insertAdjacentHTML('afterend', ''+
								'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_sum.textContent) + _youSavedOnlySale)+' &euro;*</div>'
							);
						}
						if(variant === 0) {
							try {
								_self.elem('.btn-deliverycosts, .h-xsmallOffset-top-outer strong + strong', function(deliverycosts){
									if(deliverycosts){
										deliverycosts[0].insertAdjacentHTML('afterend', ''+
											'<br/>'+
											'<div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> <span id="kk_yousave">'+float2Price(_youSaved)+'</span> &euro;</div>'
										);
									}
								});
							} catch (error) {
								goalPush('kk_8.4_error_goal');
							}
						}

						// if(isVoucher){
						// 	_self.qs('#kk_yousave').parentNode.insertAdjacentElement('beforebegin', isVoucher.parentNode.parentNode.parentNode);
						// }
					}
					
					if(variant === 0) {
						const locationHref = window.location.href;
						if(_youSaved >= (isVoucher ? 25 : 25) || (isVoucher && locationHref.indexOf("?voucher=25") !== -1)) {
							upsellIndex = 0;
						}else if(_youSaved >= 10 || (isVoucher && locationHref.indexOf("?voucher=10") !== -1)) {
							upsellIndex = 1;
						}
					} else if(variant === 1 || variant === 2) {
						// if((_youSaved + _additionalDiscountAmount) >= (isVoucher ? 29.95 : 29.95)) {
						if((_youSaved + _additionalDiscountAmount) >= 29.95 ) {
							upsellIndex = 0;
						} else if((_youSaved + + _additionalDiscountAmount) >= 10 ) {
							upsellIndex = 1;
						}
					}
				

					var subtotalDiv = kk_sum.parentElement.parentElement.parentElement.parentElement;

					// var callout = _self.qs('.js_backstopWrapper > .callout.dark-gray');

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
												'<div class="kk_save">Sie sparen '+float2Price(_youSaved + _additionalDiscountAmount)+' &euro;</div>');
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

													insertBorderContainerElementLayout(kk_voucher, 'afterend', 'kk_ordervalue', 
														'<strong>Bestellwert</strong>'
													);

													_self.qs('.kk_ordervalue').insertAdjacentElement('beforeend', ordervalue_element_clone);
												}
											}
										}
				
										// add kk_shipping_info_container
										if(final_price_container){

											insertBorderContainerElementLayout(final_price_container, 'beforebegin', 'kk_shipping_info', 
												'<p>Versandkosten werden im nächsten Schritt berechnet.</p>'
											);
											_self.qs('.kk_shipping_info_container').insertAdjacentHTML('afterend', '<hr>');
										}

										// add kk_payment_info_container
										if(continue_or_payment_btn_container) {
											
											insertBorderContainerElementLayout(continue_or_payment_btn_container, 'afterend', 'kk_payment_info', 
												'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/paymentoptions.png"></div>'
											);
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
									xhr_get('https://www.hessnatur.com/de/p/'+prodUsk+'/json', false, function(data){
										
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
																		'<p>Glückwunsch, <br/>Sie sparen '+float2Price(_youSaved)+'&nbsp&euro;</p>'+ // !
																		'<p>Warum nicht einfach die Ersparnis nutzen und '+ gramatikAnpassung(name) +' für nur <b id="kk_price_left">'+float2Price(init_price)+'&nbsp;&euro;</b> hinzufügen?</p>'+
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
																					'<div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+float2Price(init_price)+'</span>&nbsp;&euro;*</div>'+
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
																	'<p>Glückwunsch! Sie sparen '+float2Price(_youSaved + _additionalDiscountAmount)+'&nbsp&euro;</p>'+ 
																	'<div class="kk_close_upsell">' +
																		'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/X.svg" title="Entfernen" class="icon-trash">' +
																	'</div>' +
																'</div>'+
																'<div class="kk_seperation_line">' +
																	'<hr>' +
																'</div>' +
																'<div id="kk_upsell_right" class="medium-12">'+

																	'<div class="kk_reason_wrapper">' +
																		'<div class="kk_inner_reason_wrapper">' +
																		'<div class="kk_reason_question">Warum nicht einfach die Ersparnis nutzen?</div>' +
																		// '<div class="kk_reason_text">Fügen Sie ein Paar Socken aus Bio-Baumwolle für nur 7.95</div>' +
																		'<p class="kk_reason_text">Fügen Sie '+ gramatikAnpassung(name) +' für nur <b id="kk_price_left">'+float2Price(init_price)+'&nbsp;&euro;</b> hinzu. Erhältlich in verschiedenen Farben.</p>'+
																		'</div>' +
																	'</div>' +

																	'<div class="kk_img_wrapper">'+
																		'<img id="kk_upsell_img" src="'+init_img_url+'"/>'+
																		'<div class="kk_upsell_column medium-4">'+
																			'<div class="kk_product_name">'+
																				'<a href="'+data.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+name+'</a>'+
																			'</div>'+
																			'<div class="kk_price_div">'+
																					'<div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+float2Price(init_price)+'</span>&nbsp;&euro;*</div>'+
																				'<p class="h-text-muted">inkl. 19% MwSt.</p>'+
																			'</div>'+
																		'</div>'+
																	'</div>'+
																	'<div class="kk_upsell_column">'+
																		'<div class="kk_color_selection">'+
																			'<span class="h-text-muted">Farbe:</span>'+
																			'<ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+
																				colorsHTML+
																			'</ul>'+
																		'</div>'+
																	'</div>'+
																	'<div class="kk_upsell_row">'+
																		'<div class="kk_addToCartDiv">'+
																			'<div class="kk_size_selection">'+
																				'<span class="h-text-muted">Größe:</span> '+ 
																				'<select id="kk_sizes" class="custom__select">'+sizesHTML+'</select>'+
																			'</div>'+
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

											}
										}


										// set first color active
										addClass(_self.qs('.js-color-bubbles li'), 'active');
										
										var changeColor = function(e){
											 
											try {
												var _li = this ? this.parentElement : e.parentElement,
													_color = colors[_li.getAttribute('data-color')],
													kk_sizes = _self.qs('#kk_sizes'),
													kk_colorname = _self.qs("#kk_colorname");

												// update sizes dropdown
												if(kk_sizes && _color) {
													kk_sizes.innerHTML = buildSizesHTML(_color.sizes);
												}

												// update product image
												if(_color){
													if(variant === 0) {
														_self.qs('#kk_upsell_img').setAttribute('src', (_color.modelImageUrl || _color.articleImageUrl));
													} else if(variant === 1 || variant === 2) {
														_self.qs('#kk_upsell_img').setAttribute('src', (_color.modelImageUrl || _color.articleImageUrl).replace('_1.','_7.'));
													}
												}

												// set selected color active
												// _self.qs('.active', kk_upsell_wrapper).classList.remove('active');
												// removeClass(_self.qs('.active', kk_upsell_wrapper), 'active');
												addClass(_li, 'active');

												if(kk_colorname) {
													kk_colorname.innerHTML = _li.getAttribute('data-colorname');
												}

												// trigger change for price update
												if(kk_sizes){
													if ("createEvent" in document) {
														var evt = document.createEvent("HTMLEvents");
														evt.initEvent("change", false, true);
														kk_sizes.dispatchEvent(evt);
													}else {
														kk_sizes.fireEvent("onchange");
													}
												}
												
											}
											catch(err) {
												goalPush('kk_8.4_error_goal');
												//console.log('error: ', err.toString());
											}

											return false;
										};
										// changeSize = function(){
										// 	try {
										// 		var _val = this.value,
										// 		_li = _self.qs('.active .productItemColor'/*, kk_upsell_wrapper*/),
										// 		_color = colors[_li.parentElement.getAttribute('data-color')];

										// 		var _price = _color.sizes.filter(function(k){ 
										// 			return k.code === _val;
										// 		})[0].price;

										// 		// update price
										// 		_self.qs('#kk_price').innerHTML = float2Price(_price);
										// 		_self.qs('#kk_price_left').innerHTML = float2Price(_price)+'&nbsp;€';
										// 	}
										// 	catch(err) {
										// 		goalPush('kk_8.4_error_goal');
										// 		console.log('error: ', err.toString());
										// 	}
										// };

										var _color_bopsels = _self.qsa('.productItemColor'/*, kk_upsell_wrapper*/);

										for(var c = 0; c < _color_bopsels.length; c++) {
											_color_bopsels[c].addEventListener('click', function(e){
												e.preventDefault();
												changeColor(e.currentTarget);
											});
										}

										// set right color active
										if(promo[alternativKey]){
											changeColor(_self.qs('.js-color-bubbles li[data-color="'+promo[alternativKey].substring(5,7)+'"] a'/*, kk_upsell_wrapper*/));
										}

										
										//_self.qs('#kk_sizes').addEventListener('change', changeSize);


										// _self.qs('#kk_addToCartButton', kk_upsell_wrapper).addEventListener('click', function(){
										// 	var _prodId = _self.qs('#kk_sizes').value,
										// 	params = { 
										// 		productCodePost: _prodId,
										// 		ff_id: _prodId,
										// 		ff_masterId: data.code,
										// 		ff_title: encodeURIComponent(name),
										// 		ff_price: price2Float(_self.qs('#kk_price').textContent),
										// 		qty: 1,
										// 		CSRFToken: window.ACC.config.CSRFToken
										// 	};

										// 	// goalPush('kk_s8_a2c');

										// 	if(_prodId !== '') {
										// 		_self.xhr_post('https://www.hessnatur.com/de/cart/add', 
										// 			Object.keys(params).map(function(k){ 
										// 				return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
										// 				}).join('&'), 
										// 		function(){
										// 			// localStorage.setItem('kk_upsell_hide', 1);
													
										// 			setCookie('kk_upsell_hide', 'true', ".hessnatur.com", 5);

										// 			location.href=location.href.split('#')[0];
										// 			location.reload();
										// 		});
										// 	}
										// });

										if(variant === 0) {
											_self.qs('#kk_hide_upsell'/*, kk_upsell_wrapper*/).addEventListener('click', function(){
											// goalPush('kk_s8_del');

											setCookie('kk_upsell_hide', 'true', ".hessnatur.com", 5);

											// localStorage.setItem('kk_upsell_hide', 1);
											// kk_upsell_wrapper.outerHTML = '';
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
						'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_total.textContent) + _youSaved)+' &euro;*</div>'
					);
	
					try {
						const tempTotalClosest = kk_total.closest('.h-xsmallOffset-bottom-outer:not(.column)');
						if(tempTotalClosest){
							tempTotalClosest.insertAdjacentHTML('afterbegin', '<div class="column small-12 large-10 large-offset-1"><hr></div>');
						}
					} catch (error) {
						goalPush('kk_8.4_error_goal');
					}
					
				}

				// Voucher werden immer mit Seitenreload hinzgefügt und entfernt, hier kann einfach auf die Element gepollt werden
				_self.elem('#hessnaturVoucherForm:not(.column)', function(voucherForms){
					if(voucherForms) {

						_self.elem('.kk_shipping_info_container', function(shipping_info_container){
							if(shipping_info_container) {
								voucherForms.forEach(function(voucherForm){
									shipping_info_container[0].insertAdjacentHTML( 'beforebegin',
										'<div class="kk_active_voucher_container row h-xsmallOffset-bottom-outer">' +
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
									// remove_btn.firstElementChild.src = "https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/X.svg";

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
						if(pbCardNumber){
							buildPaybackContainer();
						}
					});
				});
				
			}
		});
	};
	
})(window.WATO);


// BKP
// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,s,i,r){var a,o=this||i,l=r||Date.now(),c=!1;return Date.now()-l>3e4?(n(!1),!1):("string"==typeof e?c=(a=t.querySelectorAll(e)).length>0:a=c=!0===e(),!0===c?n(a):setTimeout(o.elem.bind(null,e,n,s,o,l),s||20))},e.WATO.prototype.qs=function(e,n){return(n||t).querySelector(e)},e.WATO.prototype.qsa=function(e,n){return(n||t).querySelectorAll(e)},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(s,i,r,a,o){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==i.indexOf(e)&&t()}),!1),n.call(this,s,i,r,a,o)}},e.WATO.prototype.exclude=function(n,s){function i(){(e.innerWidth||t.body.clientWidth)<=n&&!r&&(r=!0,s())}var r=!1;i(),"function"==typeof s&&(e.onresize=function(){i()})},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_get=function(e,t,n){var s=new XMLHttpRequest;s.open("GET",e,!0),s.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,t)}catch(t){n(e)}else n(!1)},s.onerror=function(){n(!1)},s.withCredentials=!0,s.send()},e.WATO.prototype.xhr_post=function(e,t,n,s){var i=new XMLHttpRequest;i.open("POST",e,!0),i.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,s)}catch(t){n(e)}else n(!1)},i.onerror=function(){n(!1)},i.withCredentials=!0,i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.send(t)}}(window,document),function(e){"use strict";function t(e,t){e&&t&&e.classList.add(t)}function n(e,t){e&&t&&e.classList.remove(t)}function s(e,t){window.iridion.push(["goal",e,"",t||!1])}function i(e){return-1!==e.indexOf("Body")||-1!==e.indexOf("Waschhandschuh")||-1!==e.indexOf("Langarmbody")?"einen "+e:-1!==e.indexOf("Papierbox")||-1!==e.indexOf("Gallseife")||-1!==e.indexOf("Klapp-Karte")||-1!==e.indexOf("MÃƒÂ¼tze")||-1!==e.indexOf("hose")||-1!==e.indexOf("Decke")?"eine "+e:-1!==e.indexOf("Socke")?"ein Paar "+e.replace("Socke","Socken"):"ein "+e}e.prototype.s8_4_GOALS=function(e){var t=this;function n(e,n,i){t.elem(e,(function(e){e&&e[0].addEventListener("click",(function(){s(n,i||!1)}))}))}1!==e&&2!==e||n(".kk_pb_column > .payback__form__container","kk_click_fold_pb_container"),n("#paybackCardFormButton","kk_click_redeem_pb_number"),n("#hessnaturVoucherForm .button.quickadd__button","kk_click_redeem_voucher",!0),n(".js-entry-remove","kk_delete_product",!0),n(".js-entry-edit","kk_click_edit_pencil"),0===e&&t.elem(".item__amount .input-group-field.qty",(function(e){e&&e.forEach((function(e){e.addEventListener("change",(function(){s("kk_change_product_quantity",!0)}))}))}))},e.prototype.s8_4=function(e){var r=this;function a(e){return parseFloat(e.replace("Ã¢â€šÂ¬ ","").replace(".","").replace(",","."))}function o(e){if(e.toFixed(2)%1==0){var t=e.toFixed(0);return e.toFixed(0).length>3&&(t=function(e){var t=0,n="",s=e.length-1;for(;s>=0;)n=e.substr(s,1)+n,3==++t&&(n="."+n,t=0),s--;return n}(e.toFixed(0))),t}var n=e.toFixed(2).replace(".",","),s=n.length-6;return s>0&&(n=n.substring(0,s)+"."+n.substring(s)),n}function l(e,t,n){r.qs(e,n).addEventListener("click",(function(e){var n=r.qs(".qty",e.target.closest(".item__form")),s=r.qs(".kk_qty",e.target.parentNode.parentNode),i=parseInt(n.value);"-"===t?i>1&&(n.value=i-1,s.value=i-1,c(e)):(n.value=i+1,s.value=i+1,c(e))}))}function c(e){setTimeout((function(){s("kk_change_product_quantity",!0),r.qs(".item_refresh",e.target.closest(".item__form")).click()}),2e3)}function d(e,t,n,s){e.insertAdjacentHTML(t,'<div class="'+n+'_container row h-xsmallOffset-bottom-outer"><div class="column small-12 medium-6 large-5"><div class="row align-right"><div class="'+n+' column small-6 medium-12 h-xsmallOffset-bottom-outer">'+s+"</div></div></div></div>")}function u(){var s=r.qs(".kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container");r.elem("#js-payback-form-container",(function(i){if(i&&s){var a=r.qs(".column.small-12.large-10.large-offset-1 > .payback__form__container"),o=i[0].closest(".row.h-smallOffset-bottom-outer"),l=r.qs(".kk_pb_column");l||(i[0].parentElement.insertAdjacentHTML("afterBegin",'<div class="kk_pb_column"><div class="kk_pb_extended"></div></div>'),l=r.qs(".kk_pb_column"));var c=r.qs(".kk_pb_extended");a&&(t(a,"kk-extended"),l.insertAdjacentElement("afterbegin",a),a.addEventListener("click",(function(){c.classList.contains("kk-hidden")?(n(c,"kk-hidden"),t(a,"kk-extended")):(t(c,"kk-hidden"),n(a,"kk-extended"))}))),c.append(i[0]),o&&(t(o,"kk_payback_v2"),1===e&&(o.firstElementChild.classList.remove("large-10","large-offset-1"),s.append(o)),2===e&&r.qs(".kk_subtotal_styling").insertAdjacentElement("beforebegin",o))}}))}r.elem("#hessnaturQuickAddForm",(function(e){e&&e[0].parentElement.insertAdjacentHTML("afterend",'<div class="row"><div class="column small-12 large-10 large-offset-1"><div id="kk_cart_hint">Artikel im Warenkorb werden nicht reserviert.</div></div></div>')})),r.elem(".h-mediumOffset-bottom-inner .button.success",(function(c){if(c){for(var p=r.qsa(".listing__table--item"),k=p.length,m=0,_=[],f=0,v=0;v<k;v++){var h=p[v],b=r.qs(".strikeValue",h),g=r.qs("img",h),y=r.qs(".h-text-muted",h),x=r.qs(".medium-4",h),q=r.qs(".item__amount",h),w=r.qs(".js-entry-edit",h),E=(r.qs(".icon-trash",h),y.textContent.replace("Artikel",""));if(g.setAttribute("src",g.getAttribute("src").replace("hyb_redes_cart_overview","hyb_redes_list_main")),_.push(parseInt(E)),y.innerHTML="<span>Artikel:</span>"+E.trim(),w&&x&&(x.insertAdjacentElement("beforeend",w),x.insertAdjacentElement("beforeend",r.qs(".js-entry-edit-cancel",h).parentNode)),y.insertAdjacentElement("afterend",x),q.parentNode.parentNode.style.display="none",g.parentNode.insertAdjacentHTML("afterend",'<div class="kk_amount"><span class="kk_minus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/minus.svg"></span><input class="kk_qty" type="number" pattern="^[1-9][0-9]{1,2}$|^d$" required="required" value="'+r.qs(".qty",q).value+'" maxlength="2"><span class="kk_plus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/plus.svg"></span></div>'),l(".kk_minus","-",h),l(".kk_plus","+",h),r.qs(".kk_qty",h).addEventListener("change",(function(e){var n=e.target;parseInt(n.value)>0?(s("kk_change_product_quantity",!0),r.qs(".qty",n.closest(".item__form")).value=n.value,r.qs(".item_refresh",e.target.closest(".item__form")).click()):t(n.parentElement,"kk_errormsg")})),b){var A=r.qs(".price",h),O=b.parentElement,T=a(b.textContent)-a(A.textContent);T>0&&(m+=T),t(O,"kk_price");var L=b.parentElement.parentElement;L&&t(L,"kk_flex_column"),0===e?O.parentElement.insertAdjacentHTML("beforeend",'<div class="kk_save">'+o(T)+" Ã¢â€šÂ¬ Ersparnis</div>"):1!==e&&2!==e||O.parentElement.insertAdjacentHTML("beforeend",'<div class="kk_save">Sie sparen '+o(T)+" Ã¢â€šÂ¬</div>"),r.qs("img",h).insertAdjacentHTML("afterend",'<span style="width: 100%;display: block;text-align: center;margin-top: -13px;"><img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;"></span>')}}r.elem("#hessnaturVoucherForm .coupon-value .price.discountPrice",(function(e){e&&(f=parseFloat(e[0].textContent.replace(",",".").replace("Ã¢â€šÂ¬","").replace("-","")),isNaN(f)&&(f=0))}));var j=r.qsa(".row:first-child .offset-price-left"),C=j[0],S=j[1];r.elem("#hessnaturVoucherForm",(function(e){if(e){var t=e[0].closest(".bgColor-super-light-gray");t.id="kk_voucher",t.nextElementSibling.insertAdjacentElement("beforebegin",t)}}));var M={sale:{damen:[["5278909","5278709","4260117"],["7018089","7201089","4266889"]],herren:[["4238409","4538514","5037301"],["7018089","7201089","4266889"]],baby:[["5203801","5222740","5528001"],["3658101","1786201","3984501"]],home:[["5093162","5038209","4955142"],["5212562","5216900","5212924"]],sonstiges:[["4260189","4260089","4260117"]]}},H={4793601:"479360151"},W=r.qs('[name="voucherCode"][value="ALLES21"]'),F=M[W?"voucher":"sale"][window.iridion.push(["profile","getValue","categoryAffinity"])];F||(F=M.sale.damen);var B=2,z=m;if(m>0&&(z>0&&(t(C,"discountPrice"),C.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+o(a(C.textContent)+z)+" Ã¢â€šÂ¬*</div>")),0===e))try{r.elem(".btn-deliverycosts, .h-xsmallOffset-top-outer strong + strong",(function(e){e&&e[0].insertAdjacentHTML("afterend",'<br/><div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> <span id="kk_yousave">'+o(m)+"</span> Ã¢â€šÂ¬</div>")}))}catch(V){s("kk_8.4_error_goal")}if(0===e){const D=window.location.href;m>=25||W&&-1!==D.indexOf("?voucher=25")?B=0:(m>=10||W&&-1!==D.indexOf("?voucher=10"))&&(B=1)}else 1!==e&&2!==e||(m+f>=29.95?B=0:m+ +f>=10&&(B=1));var I=C.parentElement.parentElement.parentElement.parentElement;if(r.elem(".js_backstopWrapper > .callout.dark-gray",(function(s){if(s&&(s=s[0],(1===e||2===e)&&s)){s.insertAdjacentHTML("beforeBegin",'<div class="kk_bottom_checkout_wrapper row"><div class="kk_inner_bottom_checkout_wrapper column small-12 large-10 large-offset-1"><div class="kk_border_container"></div></div></div>');var i=r.qs(".kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container");if(i){var a=r.qs("#kk_voucher")||r.qs("#hessnaturVoucherForm.column.small-12").parentElement.parentElement,l=r.qs(".column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer .price.offset-price-left").closest(".row.h-xsmallOffset-bottom-outer"),c=r.qs(".row.h-mediumOffset-bottom-inner .column .button.expanded-small-only").closest(".row.h-mediumOffset-bottom-inner"),p=[a,l,c];r.elem("#hessnaturVoucherForm .button.quickadd__button",(function(e){if(e){var t=r.qs("label",a);t&&t.parentElement.append(e[0])}}));var k=r.qs(".text-right.h-text-muted",l);k&&(k.innerHTML="inkl. 19% MwSt."),m&&l.lastElementChild.insertAdjacentHTML("beforeend",'<div class="kk_save">Sie sparen '+o(m+f)+" Ã¢â€šÂ¬</div>"),t(l,"kk_final_price_container"),t(c,"kk_btn_redesign"),t(I,"kk_subtotal_styling"),2===e&&t(I,"column");var _=r.qs(".price.strikeValue",I);_&&n(_,"column");for(var v=0;v<p.length;v++)i.insertAdjacentElement("beforeEnd",p[v]);if(a){var h=r.qs(".price.offset-price-left.discountPrice");if(h){var b=h.cloneNode(!0);b.textContent!==r.qs(".column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer > .price").textContent&&(d(a,"afterend","kk_ordervalue","<strong>Bestellwert</strong>"),r.qs(".kk_ordervalue").insertAdjacentElement("beforeend",b))}}l&&(d(l,"beforebegin","kk_shipping_info","<p>Versandkosten werden im nÃƒÂ¤chsten Schritt berechnet.</p>"),r.qs(".kk_shipping_info_container").insertAdjacentHTML("afterend","<hr>")),c&&d(c,"afterend","kk_payment_info",'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/paymentoptions.png"></div>'),r.elem("#js-payback-form-container",(function(e){e&&u()}));var g=r.qsa(".js_backstopWrapper > .row.h-smallOffset-bottom-outer:not(.kk_payback_v2)");g&&g.forEach((function(e){e.firstElementChild.firstElementChild.classList.contains("kk_pb_row")||(e.style.display="none")}))}}})),F){var N=F[B];if(N){function P(n){var a=parseInt(N[n].substring(0,5));-1!==_.indexOf(a)?++n<3&&P(n):r.xhr_get("https://www.hessnatur.com/de/p/"+a+"/json",!1,(function(a){if(-1===document.cookie.indexOf("kk_upsell_hide")){if(a){for(var l="",c="",d="",u=a.name,p={},k="",_="",v=a.colors,h=v.length,b=!1,g=function(e){for(var t=e.length,s="",i=0;i<t;i++){var r=e[i];s+="<option "+(r.available?"":'disabled=""')+' value="'+r.code+'" '+(""===_&&H[N[n]]===r.code?'selected="selected"':"")+">"+r.size+"</option>"}return s},y=0;y<h;y++){var x=v[y];if(100!==x.availabilityIndex&&x.available){""===l&&(l=x.modelImageUrl||x.articleImageUrl,c=x.color,d=x.price,_=g(x.sizes));var q=x.colorCode;p[q]=x,k+='<li data-color="'+q+'" data-colorname="'+x.color+'"><a class="productItemColor" href="#color" onclick="return false"><img itemprop="image" src="'+x.colorUrl+'" alt="2312754" class="h-shape-circle"></a></li>',b=!0}}if(b||++n<3&&P(n),0===e)I.insertAdjacentHTML("afterend",'<div id="kk_upsell_wrapper" class="row"><div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer"><div id="kk_upsell_inner" class="row"><div class="medium-5"><div id="kk_upsell_left"><p>GlÃƒÂ¼ckwunsch, <br/>Sie sparen '+o(m)+"&nbspÃ¢â€šÂ¬</p><p>Warum nicht einfach die Ersparnis nutzen und "+i(u)+' fÃƒÂ¼r nur <b id="kk_price_left">'+o(d)+'&nbsp;Ã¢â€šÂ¬</b> hinzufÃƒÂ¼gen?</p></div></div><div id="kk_upsell_right" class="medium-7"><div class="kk_img_wrapper"><img id="kk_upsell_img" src="'+l+'"/></div><div class="kk_upsell_column"><div class="kk_upsell_spacebetween"><div class="kk_product_name"><a href="'+a.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+u+'</a></div><div class="kk_price_div"><div class="row align-right-for-medium"><div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+o(d)+'</span>&nbsp;Ã¢â€šÂ¬*</div></div><p class="h-text-muted">inkl. 19% MwSt.</p></div></div><div><div class="kk_color_selection"><p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+c+'</span></p><ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+k+'</ul></div><div class="kk_size_selection"><p><span class="h-text-muted">GrÃƒÂ¶ÃƒÅ¸e:</span> <select id="kk_sizes" class="custom__select">'+_+'</select></p></div></div><div class="kk_upsell_spacebetween"><div><div class="kk_garbage_container column row align-self-bottom small-12"><div class="align-self-bottom shrink h-no-padding-right"><button id="kk_hide_upsell" type="button" class="js-entry-remove textLink"><img src="/_ui/responsive/common/images/icons/garbage.svg" class="icon-trash"></button></div></div></div><div><button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit"><span class="pds-cockpit__addToCartButtonIconWrapper">Zum Warenkorb hinzufÃƒÂ¼gen</span></button></div></div></div></div></div></div></div>');else if(1===e||2===e){(1===e&&I?I:2===e&&r.qs(".kk_pb_row")?r.qs(".kk_pb_row").parentElement.parentElement:C.parentElement.parentElement.parentElement.parentElement).insertAdjacentHTML("afterend",'<div id="kk_upsell_wrapper" class="row"><div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer column"><div id="kk_upsell_inner" class="row"><div id="kk_upsell_left"><p>GlÃƒÂ¼ckwunsch! Sie sparen '+o(m+f)+'&nbspÃ¢â€šÂ¬</p><div class="kk_close_upsell"><img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/X.svg" title="Entfernen" class="icon-trash"></div></div><div class="kk_seperation_line"><hr></div><div id="kk_upsell_right" class="medium-12"><div class="kk_reason_wrapper"><div class="kk_inner_reason_wrapper"><div class="kk_reason_question">Warum nicht einfach die Ersparnis nutzen?</div><p class="kk_reason_text">FÃƒÂ¼gen Sie '+i(u)+' fÃƒÂ¼r nur <b id="kk_price_left">'+o(d)+'&nbsp;Ã¢â€šÂ¬</b> hinzu. ErhÃƒÂ¤ltlich in verschiedenen Farben.</p></div></div><div class="kk_img_wrapper"><img id="kk_upsell_img" src="'+l+'"/><div class="kk_upsell_column medium-4"><div class="kk_product_name"><a href="'+a.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+u+'</a></div><div class="kk_price_div"><div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+o(d)+'</span>&nbsp;Ã¢â€šÂ¬*</div><p class="h-text-muted">inkl. 19% MwSt.</p></div></div></div><div class="kk_upsell_column"><div class="kk_color_selection"><span class="h-text-muted">Farbe:</span><ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+k+'</ul></div></div><div class="kk_upsell_row"><div class="kk_addToCartDiv"><div class="kk_size_selection"><span class="h-text-muted">GrÃƒÂ¶ÃƒÅ¸e:</span> <select id="kk_sizes" class="custom__select">'+_+'</select></div><div><button id="kk_addToCartButton" class="button success expanded js-add-to-cart-button" type="submit"><img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/%2B.svg" alt=""><span class="pds-cockpit__addToCartButtonIconWrapper">HinzufÃƒÂ¼gen</span></button></div></div></div></div></div></div></div>')}}else++n<3&&P(n);t(r.qs(".js-color-bubbles li"),"active");for(var w=function(n){try{var i=this?this.parentElement:n.parentElement,a=p[i.getAttribute("data-color")],o=r.qs("#kk_sizes"),l=r.qs("#kk_colorname");if(o&&a&&(o.innerHTML=g(a.sizes)),a&&(0===e?r.qs("#kk_upsell_img").setAttribute("src",a.modelImageUrl||a.articleImageUrl):1!==e&&2!==e||r.qs("#kk_upsell_img").setAttribute("src",(a.modelImageUrl||a.articleImageUrl).replace("_1.","_7."))),t(i,"active"),l&&(l.innerHTML=i.getAttribute("data-colorname")),o)if("createEvent"in document){var c=document.createEvent("HTMLEvents");c.initEvent("change",!1,!0),o.dispatchEvent(c)}else o.fireEvent("onchange")}catch(e){s("kk_8.4_error_goal")}return!1},E=r.qsa(".productItemColor"),A=0;A<E.length;A++)E[A].addEventListener("click",(function(e){e.preventDefault(),w(e.currentTarget)}));w(r.qs('.js-color-bubbles li[data-color="'+N[n].substring(5,7)+'"] a')),0===e&&r.qs("#kk_hide_upsell").addEventListener("click",(function(){!function(e,t,n,s){var i=new Date;i.setDate(i.getDate()+s),document.cookie=e+"="+encodeURIComponent(t)+";expires="+i.toUTCString()+";domain="+n+";path=/"}("kk_upsell_hide","true",".hessnatur.com",5)}))}}))}P(0)}}if(m>0){t(S,"discountPrice"),S.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+o(a(S.textContent)+m)+" Ã¢â€šÂ¬*</div>");try{const U=S.closest(".h-xsmallOffset-bottom-outer:not(.column)");U&&U.insertAdjacentHTML("afterbegin",'<div class="column small-12 large-10 large-offset-1"><hr></div>')}catch(G){s("kk_8.4_error_goal")}}r.elem("#hessnaturVoucherForm:not(.column)",(function(e){e&&r.elem(".kk_shipping_info_container",(function(s){s&&e.forEach((function(e){s[0].insertAdjacentHTML("beforebegin",'<div class="kk_active_voucher_container row h-xsmallOffset-bottom-outer"><div class="column small-12 medium-6 large-5"><div class="row align-right"><div class="kk_active_voucher column small-6 medium-12 text-right h-xsmallOffset-bottom-outer"></div></div></div></div>'),r.qs(".kk_active_voucher").append(e);var i=r.qs(".coupon-name",e);n(i,"column"),i.insertAdjacentHTML("afterBegin",'<div class="kk_coupon_wrapper"></div>');var a=r.qs(".kk_coupon_wrapper",e);a.append(r.qs(".coupon-name strong",e)),a.append(r.qs(".coupon-name input",e));var o=e.firstElementChild.firstElementChild.firstElementChild;i.firstElementChild.append(o);var l=i.previousElementSibling;l.textContent="Gutschein-/Aktionscode",n(l,"column"),n(i.nextElementSibling,"column"),t(i.parentElement,"column")}))}))})),r.ajax("updatePaybackNumber",(function(){u()})),r.ajax("removePaybackNumber",(function(){r.elem("#paybackCardForm #paybackCardNumber",(function(e){e&&u()}))}))}}))}}(window.WATO);
// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,s,i,r){var a,o=this||i,l=r||Date.now(),c=!1;return Date.now()-l>3e4?(n(!1),!1):("string"==typeof e?c=(a=t.querySelectorAll(e)).length>0:a=c=!0===e(),!0===c?n(a):setTimeout(o.elem.bind(null,e,n,s,o,l),s||20))},e.WATO.prototype.qs=function(e,n){return(n||t).querySelector(e)},e.WATO.prototype.qsa=function(e,n){return(n||t).querySelectorAll(e)},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(s,i,r,a,o){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==i.indexOf(e)&&t()}),!1),n.call(this,s,i,r,a,o)}},e.WATO.prototype.exclude=function(n,s){function i(){(e.innerWidth||t.body.clientWidth)<=n&&!r&&(r=!0,s())}var r=!1;i(),"function"==typeof s&&(e.onresize=function(){i()})},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_post=function(e,t,n,s){var i=new XMLHttpRequest;i.open("POST",e,!0),i.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,s)}catch(t){n(e)}else n(!1)},i.onerror=function(){n(!1)},i.withCredentials=!0,i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.send(t)}}(window,document),function(e){"use strict";function t(e,t){e&&t&&e.classList.add(t)}function n(e,t){e&&t&&e.classList.remove(t)}function s(e,t){window.iridion.push(["goal",e,"",t||!1])}function i(e){return-1!==e.indexOf("Body")||-1!==e.indexOf("Waschhandschuh")||-1!==e.indexOf("Langarmbody")?"einen "+e:-1!==e.indexOf("Papierbox")||-1!==e.indexOf("Gallseife")||-1!==e.indexOf("Klapp-Karte")||-1!==e.indexOf("MÃ¼tze")||-1!==e.indexOf("hose")||-1!==e.indexOf("Decke")?"eine "+e:-1!==e.indexOf("Socke")?"ein Paar "+e.replace("Socke","Socken"):"ein "+e}e.prototype.s8_4_GOALS=function(e){var t=this;function n(e,n,i){t.elem(e,(function(e){e&&e[0].addEventListener("click",(function(){s(n,i||!1)}))}))}1!==e&&2!==e||n(".kk_pb_column > .payback__form__container","kk_click_fold_pb_container"),n("#paybackCardFormButton","kk_click_redeem_pb_number"),n("#hessnaturVoucherForm .button.quickadd__button","kk_click_redeem_voucher",!0),n(".js-entry-remove","kk_delete_product",!0),n(".js-entry-edit","kk_click_edit_pencil"),0===e&&t.elem(".item__amount .input-group-field.qty",(function(e){e&&e.forEach((function(e){e.addEventListener("change",(function(){s("kk_change_product_quantity",!0)}))}))}))},e.prototype.s8_4=function(e){var r=this;function a(e){return parseFloat(e.replace("â‚¬ ","").replace(".","").replace(",","."))}function o(e){if(e.toFixed(2)%1==0){var t=e.toFixed(0);return e.toFixed(0).length>3&&(t=function(e){var t=0,n="",s=e.length-1;for(;s>=0;)n=e.substr(s,1)+n,3==++t&&(n="."+n,t=0),s--;return n}(e.toFixed(0))),t}var n=e.toFixed(2).replace(".",","),s=n.length-6;return s>0&&(n=n.substring(0,s)+"."+n.substring(s)),n}function l(e,t,n){r.qs(e,n).addEventListener("click",(function(e){var n=r.qs(".qty",e.target.closest(".item__form")),s=r.qs(".kk_qty",e.target.parentNode.parentNode),i=parseInt(n.value);"-"===t?i>1&&(n.value=i-1,s.value=i-1,c(e)):(n.value=i+1,s.value=i+1,c(e))}))}function c(e){setTimeout((function(){s("kk_change_product_quantity",!0),r.qs(".item_refresh",e.target.closest(".item__form")).click()}),2e3)}function d(e,t,n,s){e.insertAdjacentHTML(t,'<div class="'+n+'_container row h-xsmallOffset-bottom-outer"><div class="column small-12 medium-6 large-5"><div class="row align-right"><div class="'+n+' column small-6 medium-12 h-xsmallOffset-bottom-outer">'+s+"</div></div></div></div>")}function u(){var s=r.qs(".kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container");r.elem("#js-payback-form-container",(function(i){if(i&&s){var a=r.qs(".column.small-12.large-10.large-offset-1 > .payback__form__container"),o=i[0].closest(".row.h-smallOffset-bottom-outer"),l=r.qs(".kk_pb_column");l||(i[0].parentElement.insertAdjacentHTML("afterBegin",'<div class="kk_pb_column"><div class="kk_pb_extended"></div></div>'),l=r.qs(".kk_pb_column"));var c=r.qs(".kk_pb_extended");a&&(t(a,"kk-extended"),l.insertAdjacentElement("afterbegin",a),a.addEventListener("click",(function(){c.classList.contains("kk-hidden")?(n(c,"kk-hidden"),t(a,"kk-extended")):(t(c,"kk-hidden"),n(a,"kk-extended"))}))),c.append(i[0]),o&&(t(o,"kk_payback_v2"),1===e&&(o.firstElementChild.classList.remove("large-10","large-offset-1"),s.append(o)),2===e&&r.qs(".kk_subtotal_styling").insertAdjacentElement("beforebegin",o))}}))}r.elem("#hessnaturQuickAddForm",(function(e){e&&e[0].parentElement.insertAdjacentHTML("afterend",'<div class="row"><div class="column small-12 large-10 large-offset-1"><div id="kk_cart_hint">Artikel im Warenkorb werden nicht reserviert.</div></div></div>')})),r.elem(".h-mediumOffset-bottom-inner .button.success",(function(c){if(c){for(var p=r.qsa(".listing__table--item"),k=p.length,m=0,_=[],f=0,v=0;v<k;v++){var h=p[v],b=r.qs(".strikeValue",h),g=r.qs("img",h),y=r.qs(".h-text-muted",h),x=r.qs(".medium-4",h),q=r.qs(".item__amount",h),w=r.qs(".js-entry-edit",h),E=(r.qs(".icon-trash",h),y.textContent.replace("Artikel",""));if(g.setAttribute("src",g.getAttribute("src").replace("hyb_redes_cart_overview","hyb_redes_list_main")),_.push(parseInt(E)),y.innerHTML="<span>Artikel:</span>"+E.trim(),w&&x&&(x.insertAdjacentElement("beforeend",w),x.insertAdjacentElement("beforeend",r.qs(".js-entry-edit-cancel",h).parentNode)),y.insertAdjacentElement("afterend",x),q.parentNode.parentNode.style.display="none",g.parentNode.insertAdjacentHTML("afterend",'<div class="kk_amount"><span class="kk_minus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/minus.svg"></span><input class="kk_qty" type="number" pattern="^[1-9][0-9]{1,2}$|^d$" required="required" value="'+r.qs(".qty",q).value+'" maxlength="2"><span class="kk_plus"><img src="https://media.hessnatur.com/kk/2022/AB8.4/plus.svg"></span></div>'),l(".kk_minus","-",h),l(".kk_plus","+",h),r.qs(".kk_qty",h).addEventListener("change",(function(e){var n=e.target;parseInt(n.value)>0?(s("kk_change_product_quantity",!0),r.qs(".qty",n.closest(".item__form")).value=n.value,r.qs(".item_refresh",e.target.closest(".item__form")).click()):t(n.parentElement,"kk_errormsg")})),b){var A=r.qs(".price",h),O=b.parentElement,L=a(b.textContent)-a(A.textContent);L>0&&(m+=L),t(O,"kk_price");var T=b.parentElement.parentElement;T&&t(T,"kk_flex_column"),0===e?O.parentElement.insertAdjacentHTML("beforeend",'<div class="kk_save">'+o(L)+" â‚¬ Ersparnis</div>"):1!==e&&2!==e||O.parentElement.insertAdjacentHTML("beforeend",'<div class="kk_save">Sie sparen '+o(L)+" â‚¬</div>"),r.qs("img",h).insertAdjacentHTML("afterend",'<span style="width: 100%;display: block;text-align: center;margin-top: -13px;"><img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;"></span>')}}r.elem("#hessnaturVoucherForm .coupon-value .price.discountPrice",(function(e){e&&(f=parseFloat(e[0].textContent.replace(",",".").replace("â‚¬","").replace("-","")),isNaN(f)&&(f=0))}));var j=r.qsa(".row:first-child .offset-price-left"),C=j[0],S=j[1];r.elem("#hessnaturVoucherForm",(function(e){if(e){var t=e[0].closest(".bgColor-super-light-gray");t.id="kk_voucher",t.nextElementSibling.insertAdjacentElement("beforebegin",t)}}));var M={sale:{damen:[["5278909","5278709","4260117"],["7018089","7201089","4266889"]],herren:[["4238409","4538514","5037301"],["7018089","7201089","4266889"]],baby:[["5203801","5222740","5528001"],["3658101","1786201","3984501"]],home:[["5093162","5038209","4955142"],["5212562","5216900","5212924"]],sonstiges:[["4260189","4260089","4260117"]]}},H={4793601:"479360151"},W=r.qs('[name="voucherCode"][value="ALLES21"]'),F=M[W?"voucher":"sale"][window.iridion.push(["profile","getValue","categoryAffinity"])];F||(F=M.sale.damen);var B=2,z=m;if(m>0&&(z>0&&(t(C,"discountPrice"),C.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+o(a(C.textContent)+z)+" â‚¬*</div>")),0===e))try{r.elem(".btn-deliverycosts, .h-xsmallOffset-top-outer strong + strong",(function(e){e&&e[0].insertAdjacentHTML("afterend",'<br/><div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> <span id="kk_yousave">'+o(m)+"</span> â‚¬</div>")}))}catch(V){s("kk_8.4_error_goal")}if(0===e){const D=window.location.href;m>=25||W&&-1!==D.indexOf("?voucher=25")?B=0:(m>=10||W&&-1!==D.indexOf("?voucher=10"))&&(B=1)}else 1!==e&&2!==e||(m+f>=29.95?B=0:m+ +f>=10&&(B=1));var I=C.parentElement.parentElement.parentElement.parentElement;if(r.elem(".js_backstopWrapper > .callout.dark-gray",(function(s){if(s&&(s=s[0],(1===e||2===e)&&s)){s.insertAdjacentHTML("beforeBegin",'<div class="kk_bottom_checkout_wrapper row"><div class="kk_inner_bottom_checkout_wrapper column small-12 large-10 large-offset-1"><div class="kk_border_container"></div></div></div>');var i=r.qs(".kk_bottom_checkout_wrapper .kk_inner_bottom_checkout_wrapper .kk_border_container");if(i){var a=r.qs("#kk_voucher")||r.qs("#hessnaturVoucherForm.column.small-12").parentElement.parentElement,l=r.qs(".column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer .price.offset-price-left").closest(".row.h-xsmallOffset-bottom-outer"),c=r.qs(".row.h-mediumOffset-bottom-inner .column .button.expanded-small-only").closest(".row.h-mediumOffset-bottom-inner"),p=[a,l,c];r.elem("#hessnaturVoucherForm .button.quickadd__button",(function(e){if(e){var t=r.qs("label",a);t&&t.parentElement.append(e[0])}}));var k=r.qs(".text-right.h-text-muted",l);k&&(k.innerHTML="inkl. 19% MwSt."),m&&l.lastElementChild.insertAdjacentHTML("beforeend",'<div class="kk_save">Sie sparen '+o(m+f)+" â‚¬</div>"),t(l,"kk_final_price_container"),t(c,"kk_btn_redesign"),t(I,"kk_subtotal_styling"),2===e&&t(I,"column");var _=r.qs(".price.strikeValue",I);_&&n(_,"column");for(var v=0;v<p.length;v++)i.insertAdjacentElement("beforeEnd",p[v]);if(a){var h=r.qs(".price.offset-price-left.discountPrice");if(h){var b=h.cloneNode(!0);b.textContent!==r.qs(".column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer > .price").textContent&&(d(a,"afterend","kk_ordervalue","<strong>Bestellwert</strong>"),r.qs(".kk_ordervalue").insertAdjacentElement("beforeend",b))}}l&&(d(l,"beforebegin","kk_shipping_info","<p>Versandkosten werden im nÃ¤chsten Schritt berechnet.</p>"),r.qs(".kk_shipping_info_container").insertAdjacentHTML("afterend","<hr>")),c&&d(c,"afterend","kk_payment_info",'<img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/paymentoptions.png"></div>'),r.elem("#js-payback-form-container",(function(e){e&&u()}));var g=r.qsa(".js_backstopWrapper > .row.h-smallOffset-bottom-outer:not(.kk_payback_v2)");g&&g.forEach((function(e){e.firstElementChild.firstElementChild.classList.contains("kk_pb_row")||(e.style.display="none")}))}}})),F){var N=F[B];if(N){function P(n){var a,l,c,d,u=parseInt(N[n].substring(0,5));-1!==_.indexOf(u)?++n<3&&P(n):(a="https://www.hessnatur.com/de/p/"+u+"/json",l=!1,c=function(a){if(-1===document.cookie.indexOf("kk_upsell_hide")){if(a){for(var l="",c="",d="",u=a.name,p={},k="",_="",v=a.colors,h=v.length,b=!1,g=function(e){for(var t=e.length,s="",i=0;i<t;i++){var r=e[i];s+="<option "+(r.available?"":'disabled=""')+' value="'+r.code+'" '+(""===_&&H[N[n]]===r.code?'selected="selected"':"")+">"+r.size+"</option>"}return s},y=0;y<h;y++){var x=v[y];if(100!==x.availabilityIndex&&x.available){""===l&&(l=x.modelImageUrl||x.articleImageUrl,c=x.color,d=x.price,_=g(x.sizes));var q=x.colorCode;p[q]=x,k+='<li data-color="'+q+'" data-colorname="'+x.color+'"><a class="productItemColor" href="#color" onclick="return false"><img itemprop="image" src="'+x.colorUrl+'" alt="2312754" class="h-shape-circle"></a></li>',b=!0}}b||++n<3&&P(n),0===e?I.insertAdjacentHTML("afterend",'<div id="kk_upsell_wrapper" class="row"><div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer"><div id="kk_upsell_inner" class="row"><div class="medium-5"><div id="kk_upsell_left"><p>GlÃ¼ckwunsch, <br/>Sie sparen '+o(m)+"&nbspâ‚¬</p><p>Warum nicht einfach die Ersparnis nutzen und "+i(u)+' fÃ¼r nur <b id="kk_price_left">'+o(d)+'&nbsp;â‚¬</b> hinzufÃ¼gen?</p></div></div><div id="kk_upsell_right" class="medium-7"><div class="kk_img_wrapper"><img id="kk_upsell_img" src="'+l+'"/></div><div class="kk_upsell_column"><div class="kk_upsell_spacebetween"><div class="kk_product_name"><a href="'+a.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+u+'</a></div><div class="kk_price_div"><div class="row align-right-for-medium"><div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+o(d)+'</span>&nbsp;â‚¬*</div></div><p class="h-text-muted">inkl. 19% MwSt.</p></div></div><div><div class="kk_color_selection"><p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+c+'</span></p><ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+k+'</ul></div><div class="kk_size_selection"><p><span class="h-text-muted">GrÃ¶ÃŸe:</span> <select id="kk_sizes" class="custom__select">'+_+'</select></p></div></div><div class="kk_upsell_spacebetween"><div><div class="kk_garbage_container column row align-self-bottom small-12"><div class="align-self-bottom shrink h-no-padding-right"><button id="kk_hide_upsell" type="button" class="js-entry-remove textLink"><img src="/_ui/responsive/common/images/icons/garbage.svg" class="icon-trash"></button></div></div></div><div><button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit"><span class="pds-cockpit__addToCartButtonIconWrapper">Zum Warenkorb hinzufÃ¼gen</span></button></div></div></div></div></div></div></div>'):1!==e&&2!==e||(1===e&&I?I:2===e&&r.qs(".kk_pb_row")?r.qs(".kk_pb_row").parentElement.parentElement:C.parentElement.parentElement.parentElement.parentElement).insertAdjacentHTML("afterend",'<div id="kk_upsell_wrapper" class="row"><div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer column"><div id="kk_upsell_inner" class="row"><div id="kk_upsell_left"><p>GlÃ¼ckwunsch! Sie sparen '+o(m+f)+'&nbspâ‚¬</p><div class="kk_close_upsell"><img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/X.svg" title="Entfernen" class="icon-trash"></div></div><div class="kk_seperation_line"><hr></div><div id="kk_upsell_right" class="medium-12"><div class="kk_reason_wrapper"><div class="kk_inner_reason_wrapper"><div class="kk_reason_question">Warum nicht einfach die Ersparnis nutzen?</div><p class="kk_reason_text">FÃ¼gen Sie '+i(u)+' fÃ¼r nur <b id="kk_price_left">'+o(d)+'&nbsp;â‚¬</b> hinzu. ErhÃ¤ltlich in verschiedenen Farben.</p></div></div><div class="kk_img_wrapper"><img id="kk_upsell_img" src="'+l+'"/><div class="kk_upsell_column medium-4"><div class="kk_product_name"><a href="'+a.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover">'+u+'</a></div><div class="kk_price_div"><div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+o(d)+'</span>&nbsp;â‚¬*</div><p class="h-text-muted">inkl. 19% MwSt.</p></div></div></div><div class="kk_upsell_column"><div class="kk_color_selection"><span class="h-text-muted">Farbe:</span><ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles">'+k+'</ul></div></div><div class="kk_upsell_row"><div class="kk_addToCartDiv"><div class="kk_size_selection"><span class="h-text-muted">GrÃ¶ÃŸe:</span> <select id="kk_sizes" class="custom__select">'+_+'</select></div><div><button id="kk_addToCartButton" class="button success expanded js-add-to-cart-button" type="submit"><img src="https://media.hessnatur.com/kk/2022/Sprint%20AB%2008.3%20Warenkorb%20Ersparnisse/%2B.svg" alt=""><span class="pds-cockpit__addToCartButtonIconWrapper">HinzufÃ¼gen</span></button></div></div></div></div></div></div></div>')}else++n<3&&P(n);t(r.qs(".js-color-bubbles li"),"active");for(var w=function(n){try{var i=this?this.parentElement:n.parentElement,a=p[i.getAttribute("data-color")],o=r.qs("#kk_sizes"),l=r.qs("#kk_colorname");if(o&&a&&(o.innerHTML=g(a.sizes)),a&&(0===e?r.qs("#kk_upsell_img").setAttribute("src",a.modelImageUrl||a.articleImageUrl):1!==e&&2!==e||r.qs("#kk_upsell_img").setAttribute("src",(a.modelImageUrl||a.articleImageUrl).replace("_1.","_7."))),t(i,"active"),l&&(l.innerHTML=i.getAttribute("data-colorname")),o)if("createEvent"in document){var c=document.createEvent("HTMLEvents");c.initEvent("change",!1,!0),o.dispatchEvent(c)}else o.fireEvent("onchange")}catch(e){s("kk_8.4_error_goal")}return!1},E=r.qsa(".productItemColor"),A=0;A<E.length;A++)E[A].addEventListener("click",(function(e){e.preventDefault(),w(e.currentTarget)}));w(r.qs('.js-color-bubbles li[data-color="'+N[n].substring(5,7)+'"] a')),0===e&&r.qs("#kk_hide_upsell").addEventListener("click",(function(){!function(e,t,n,s){var i=new Date;i.setDate(i.getDate()+s),document.cookie=e+"="+encodeURIComponent(t)+";expires="+i.toUTCString()+";domain="+n+";path=/"}("kk_upsell_hide","true",".hessnatur.com",5)}))}},(d=new XMLHttpRequest).open("GET",a,!0),d.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);c(e,l)}catch(t){c(e)}else c(!1)},d.onerror=function(){c(!1)},d.withCredentials=!0,d.send())}P(0)}}if(m>0){t(S,"discountPrice"),S.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+o(a(S.textContent)+m)+" â‚¬*</div>");try{const U=S.closest(".h-xsmallOffset-bottom-outer:not(.column)");U&&U.insertAdjacentHTML("afterbegin",'<div class="column small-12 large-10 large-offset-1"><hr></div>')}catch(G){s("kk_8.4_error_goal")}}r.elem("#hessnaturVoucherForm:not(.column)",(function(e){e&&r.elem(".kk_shipping_info_container",(function(s){s&&e.forEach((function(e){s[0].insertAdjacentHTML("beforebegin",'<div class="kk_active_voucher_container row h-xsmallOffset-bottom-outer"><div class="column small-12 medium-6 large-5"><div class="row align-right"><div class="kk_active_voucher column small-6 medium-12 text-right h-xsmallOffset-bottom-outer"></div></div></div></div>'),r.qs(".kk_active_voucher").append(e);var i=r.qs(".coupon-name",e);n(i,"column"),i.insertAdjacentHTML("afterBegin",'<div class="kk_coupon_wrapper"></div>');var a=r.qs(".kk_coupon_wrapper",e);a.append(r.qs(".coupon-name strong",e)),a.append(r.qs(".coupon-name input",e));var o=e.firstElementChild.firstElementChild.firstElementChild;i.firstElementChild.append(o);var l=i.previousElementSibling;l.textContent="Gutschein-/Aktionscode",n(l,"column"),n(i.nextElementSibling,"column"),t(i.parentElement,"column")}))}))})),r.ajax("updatePaybackNumber",(function(){u()})),r.ajax("removePaybackNumber",(function(){r.elem("#paybackCardForm #paybackCardNumber",(function(e){e&&u()}))}))}}))}}(window.WATO);
