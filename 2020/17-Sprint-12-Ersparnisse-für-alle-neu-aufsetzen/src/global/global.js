/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
	"use strict";

	if (!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	  
	if (!Element.prototype.closest) {
		Element.prototype.closest = function(s) {
		  	var el = this;
	  
			do {
				if (el.matches(s)) {
					return el;
				}
				el = el.parentElement || el.parentNode;
			} while (el !== null && el.nodeType === 1);

			return null;
		};
	}

	function goalPush(key){
		window.iridion.push(['goal', key]);
	}
	function hasSegment(value) {
		var segmentID = String(value);
		return window.iridion.push(['hasSegment', segmentID]);
	}
	function pushSegment(value, removeIt) {
		var segmentID = String(value);
		if(!hasSegment(segmentID)){
			window.iridion.push(['segment', segmentID]);
			console.log('......... addSegment: ', segmentID);
		}else if(removeIt){
			window.iridion.push(['removeSegment', segmentID]);
			console.log('......... removeSegment: ', segmentID);
		}
	}
	function pushEconda(key, noBuy) {
		if(typeof window.emos3 !== "undefined"){
			console.log('pushEconda: ', key);
			window.emos3.send({Target : ['kk_AB_12', key, noBuy]});
		}
	}

	WATO.prototype.sp12n = function(variant){

		var _self = this,
			pageURL = window.location.pathname;


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

		if(pageURL.indexOf("/cart") !== -1){
			// Warenkorb

			// add blue alert at top
			if(variant){
				// V1
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
			}
		
			// find bottom CTA so products a loaded
			_self.elem('.h-mediumOffset-bottom-inner .button.success', function(bottomCTA) {
				if(bottomCTA) {
					var _products = _self.qsa('.listing__table--item'), 
						_productCount = _products.length,
						varianteSale = !!_self.qs(".item__form .strikeValue"),
						hasVoucher = !!_self.qs("#hessnaturVoucherForm"),
						_youSaved = 0;

					// Segmente setzen für Sale, NoSale, Gutschein
					if(hasVoucher){
						// Guschein

						if(hasSegment("32821")){
							// Segment: Zuvor - Sale
							pushSegment("32829");
						}else if(hasSegment("32822")){
							// Segment: Zuvor - No Sale
							pushSegment("32828");
						}

						// Entferne Segment für Sale und NoSale und setze Guschein
						pushSegment("32821", false);
						pushSegment("32822", false);
						pushSegment("32820");
						pushEconda('VOUCHER', 0);

					}else if(varianteSale){
						// Sale

						if(hasSegment("32820")){
							// Segment: Zuvor - Gutschein
							pushSegment("32830");
						}else if(hasSegment("32822")){
							// Segment: Zuvor - No Sale
							pushSegment("32828");
						}
						
						// Entferne Segment für Guschein und NoSale und setze Sale
						pushSegment("32820", false);
						pushSegment("32822", false);
						pushSegment("32821");
						pushEconda('SALE', 0);

					}else {
						// No Sale

						if(hasSegment("32821")){
							// Segment: Zuvor - Sale
							pushSegment("32829");
						}else if(hasSegment("32820")){
							// Segment: Zuvor - Gutschein
							pushSegment("32830");
						}

						// Entferne Segment für Sale und Gutschein und setze NoSale
						pushSegment("32820", false);
						pushSegment("32821", false);
						pushSegment("32822");
						pushEconda('NOSALE', 0);
					}

					if(varianteSale){
						if(!hasSegment("32827")){
							// Segment: Erstaufruf Sale
							pushSegment("32826");
						}
					}else{
						if(!hasSegment("32826")){
							// Segment: Erstaufruf No Sale
							pushSegment("32827");
						}
					}

					if(variant){

						// iterate all products and find savings
						for(var i=0; i < _productCount; i++) {
							var _thisProduct = _products[i],
							_oldPrice = _self.qs('.strikeValue', _thisProduct);
			
							if(_oldPrice && varianteSale) {
								var _newPrice = _self.qs('.price', _thisProduct),
								_oldPriceWrapper = _oldPrice.parentElement,
								_save = price2Float(_oldPrice.textContent) - price2Float(_newPrice.textContent);
			
								// sum savings
								if(_save > 0) {
									_youSaved += _save;
								}
			
								_oldPriceWrapper.classList.add('kk_price');
								
								_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
									'<div class="kk_save">'+float2Price(_save)+' € Ersparnis</div>'
								);
			
								_self.qs('img', _thisProduct).insertAdjacentHTML('afterend', ''+
									'<span style="width: 100%;display: block;text-align: center;margin-top: -13px;">'+
										'<img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;">'+
									'</span>'
								);
							}
						}
			
						var sumPrices = _self.qsa('.offset-price-left'),
							kk_sum = sumPrices[0],
							kk_total = sumPrices[1];

						if(varianteSale){
							kk_sum.classList.add('discountPrice');
							kk_sum.insertAdjacentHTML('afterend', ''+
								'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_sum.textContent) + _youSaved)+' €*</div>'
							);
							
							_self.qs('.btn-deliverycosts').insertAdjacentHTML('afterend', ''+
								'<br/>'+
								'<div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> '+float2Price(_youSaved)+' €</div>'
							);
						}

						_self.elem('#hessnaturVoucherForm', function(hessnaturVoucherForm){
							if(hessnaturVoucherForm) {
								var _target = hessnaturVoucherForm[0].closest('.bgColor-super-light-gray');

								_target.id="kk_voucher";
								_target.nextElementSibling.insertAdjacentElement('afterend', _target);
							}
						});

						if(!localStorage.getItem('kk_upsell_hide') && localStorage.getItem('kk_cats')) {
							// get localstorage category from add to cart (PDS 100%)
							var _ls = JSON.parse(localStorage.getItem('kk_cats')),
								_cats = Object.keys(_ls),
								_cat = '',
								_catCount = 0,
								upsellProds,
								upsellPreselect = {
									'4793601': '479360151',
								};

							if(varianteSale) {
								// Sale Produkte
								upsellProds = {
									'herren': [
										// Ersparnis >= 20
										'4238409',
										// Ersparnis >= 10
										'4266889',
									],
									'damen': [
										// Ersparnis >= 20
										'4260009',
										// Ersparnis >= 10
										'4266889',
									],
									'baby': [
										// Ersparnis >= 20
										'4568785',
										// Ersparnis >= 10
										'36581',
									],
									'kids': [
										// Ersparnis >= 20
										'3606218',
									],
									'home': [
										// Ersparnis >= 20
										'4793601',
									],
									'sonstiges': [
										'4266889',
									]
								};
							}else{
								// No Sale Produkte
								upsellProds = 
								{
									'herren': [
										// Warenkorbwert <= 40
										'4266889',
										// Warenkorbwert > 40
										'4238409',
									],
									'damen': [
										// Warenkorbwert <= 40
										'4266889',
										// Warenkorbwert > 40
										'4260009',
									],
									'baby': [
										// Warenkorbwert <= 40
										'42683',
										// Warenkorbwert > 40
										'4568785',
									],
									'kids': [
										'3606218',
									],
									'home': [
										'4793601',
									],
									'sonstiges': [
										'4266889',
									]
								};
							}

							// find category with highest product add2cart
							for(var c = 0; c < _cats.length; c++) {
								var _key = _cats[c],
									_val = parseInt(_ls[_key]);

								if(_val >= _catCount) {
									_cat = _key;
									_catCount = _val;
								}
							}

							var promoProd = upsellProds[_cat];

							// decide which product will be shown
							var upsellIndex = 2;

							if(varianteSale) {
								if(_youSaved >= 20) {
									upsellIndex = 0;
								}
								else if(_youSaved >= 10) {
									upsellIndex = 1;
								}
							}else{
								if(_cat === "kids" || _cat === "home" || _cat === "sonstiges" || parseFloat(_self.qs(".h-xLargeOffset-bottom-outer .price").textContent.replace("€","").replace("*","").replace(".","").replace(",",".")) <= 40){
									// Warenkorbwert <= 40
									upsellIndex = 0;
								}else{
									// Warenkorbwert > 40
									upsellIndex = 1;
								}
							}
							
							var promo = promoProd[upsellIndex];

							// if product found get product info from API
							if(promo) {

								_self.xhr_get('https://www.hessnatur.com/de/p/'+promo.substring(0,5)+'/json', false, function(data){

									var init_img_url = '',
										init_color_text = '',
										init_price = '',
										name = data.name,

										colors = {},
										colorsHTML = '',
										sizesHTML = '',

										prod_variations = data.colors,
										prod_variation_count = prod_variations.length,

										firstItemSize = _self.qs(".value--size").textContent,

									buildSizesHTML = function(_sizes){
										var _sizeCount = _sizes.length,
											_sizesHTML = '';

										for(var s = 0; s < _sizeCount; s++) {
											var thisSize = _sizes[s],
												thisSelected = '';

											if(varianteSale){
												thisSelected = ((sizesHTML === '' && upsellPreselect[promo] === thisSize.code) ? 'selected="selected"' : '' );
											}else{
												thisSelected = ((sizesHTML === '' && firstItemSize === thisSize.code.substring(7,9)) ? 'selected="selected"' : '' );
											}

											_sizesHTML += '<option value="'+thisSize.code+'" '+thisSelected+'>'+thisSize.size+'</option>';
										}

										return _sizesHTML;
									};


									for(var p = 0; p < prod_variation_count; p++) {
										var thisProd = prod_variations[p];

										if(thisProd.availabilityIndex !== 100) {
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
										}
									}


									kk_sum.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML('afterend', ''+
										'<div id="kk_upsell_wrapper" class="row">'+
											'<div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer">'+
												'<div id="kk_upsell_inner" class="row" style="border: 5px solid #CBF1A5; padding:10px">'+
													'<div class="medium-5" style="padding-right:67px;display:flex">'+
														'<div id="kk_upsell_left">'+
															'<div id="kk_highbadge" '+(varianteSale ? 'style="display:none"' : '')+'>Highlight</div>'+
															'<p>'+ (varianteSale ? 'Glückwunsch, <br/>Sie sparen '+float2Price(_youSaved).replace(",00", "")+' €!' : 
																'Glückwunsch zu Ihrer Produktauswahl!') +
															'</p>'+
															'<p>'+ (varianteSale ? 'Warum nicht einfach die Ersparnis nutzen und ein '+((promo === '4266889') ? 'Paar '+name.replace('Socke', 'Socken') : name )+' für nur <b id="kk_price_left">€&nbsp;'+float2Price(init_price)+'</b> hinzufügen?' : 
																'Wie wäre es mit einem weiteren Kundenliebling aus unserem Sortiment? Jetzt für nur <b>'+float2Price(init_price)+' €</b> hinzufügen.')+
															'</p>'+
														'</div>'+
													'</div>'+
													'<div id="kk_upsell_right" class="medium-7">'+
														'<div style="margin-right: 25px;flex-shrink: 0;align-items: center;display: flex;">'+
															'<img id="kk_upsell_img" src="'+init_img_url+'"/>'+
														'</div>'+
														'<div style="display: flex;flex-direction: column;justify-content: space-between;">'+
															'<div style="display: flex;">'+
																'<div>'+
																	'<a href="'+data.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover" style="margin-bottom:15px">'+name+'</a>'+
																'</div>'+
																'<div style="flex-shrink:0;margin-top: 9px;margin-left:25px">'+
																	'<div class="row align-right-for-medium">'+
																		'<div class="column shrink price h-xsmallOffset-bottom-inner"><span id="kk_price">'+float2Price(init_price)+'</span> €*</div>'+
																	'</div>'+
																	'<p class="h-text-muted">inkl. MwSt.</p>'+
																'</div>'+
															'</div>'+
															'<div>'+
																'<div>'+
																	'<p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+init_color_text+'</span></p>'+
																	'<ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles" style="margin: 10px 0;">'+
																		colorsHTML+
																	'</ul>'+
																'</div>'+
																'<div>'+
																	'<p style="margin-bottom: 15px;">'+
																		'<span class="h-text-muted">Größe:</span> '+ 
																		'<select id="kk_sizes" class="custom__select" style="width: auto;margin: 0;">'+sizesHTML+'</select>'+
																	'</p>'+
																'</div>'+
															'</div>'+
															'<div style="display:flex;justify-content:space-between">'+
																'<div>'+
																	'<div class="column row align-self-bottom small-12" style="margin-top: 21px;">'+
																		'<div class="align-self-bottom shrink h-no-padding-right">'+
																			'<button id="kk_hide_upsell" type="button" class="js-entry-remove textLink" style="margin-right:10px">'+
																				'<img src="/_ui/responsive/common/images/icons/garbage.svg" class="icon-trash">'+
																			'</button>'+
																		'</div>'+
																	'</div>'+
																'</div>'+
																'<div>'+
																	'<button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit" style="margin-bottom:0">'+
																		'<span class="pds-cockpit__addToCartButtonIconWrapper">Zum Warenkorb hinzufügen</span>'+
																		'<span><div class="kk-loading"><div></div><div></div><div></div><div></div></div>wird ihrem Warenkorb hinzugefügt</span>'+
																	'</button>'+
																'</div>'+
															'</div>'+
														'</div>'+
													'</div>'+
												'</div>'+
											'</div>'+
										'</div>'
									);

									var kk_upsell_wrapper = _self.qs('#kk_upsell_wrapper');

									// set first color active
									_self.qs('.js-color-bubbles li', kk_upsell_wrapper).classList.add('active');

									var changeColor = function(e){
										e.preventDefault();

										try {
											var _li = this.parentElement,
												_color = colors[_li.getAttribute('data-color')];

											// update sizes dropdown
											_self.qs('#kk_sizes').innerHTML = buildSizesHTML(_color.sizes);

											// update product image 
											_self.qs('#kk_upsell_img').setAttribute('src', (_color.modelImageUrl || _color.articleImageUrl));

											// set selected color active
											_self.qs('.active', kk_upsell_wrapper).classList.remove('active');
											_li.classList.add('active');

											_self.qs("#kk_colorname").innerHTML = _li.getAttribute('data-colorname');

											// trigger change for price update 
											if ("createEvent" in document) {
												var evt = document.createEvent("HTMLEvents");
												evt.initEvent("change", false, true);
												_self.qs('#kk_sizes').dispatchEvent(evt);
											}
											else {
												_self.qs('#kk_sizes').fireEvent("onchange");
											}
										}
										catch(err) {
											console.log('err: ', err);
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
											_self.qs("#kk_upsell_left p b").innerHTML = float2Price(_price) + ' €';

										}
										catch(err) {
											// console.log('err: ', err);
										}
										
									};

									var _color_bopsels = _self.qsa('.productItemColor', kk_upsell_wrapper),
										addToCartCTA = _self.qs('#kk_addToCartButton', kk_upsell_wrapper);

									for(var c = 0; c < _color_bopsels.length; c++) {
										_color_bopsels[c].addEventListener('click', changeColor);
									}
									
									_self.qs('#kk_sizes').addEventListener('change', changeSize);


									addToCartCTA.addEventListener('click', function(){
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

										goalPush('kk_s12_a2c');

										if(_prodId !== '') {
											_self.xhr_post('https://www.hessnatur.com/de/cart/add', 
												Object.keys(params).map(function(k){ 
													return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
													}).join('&'), 
											function(){
												localStorage.setItem('kk_upsell_hide', 1);
												location.href=location.href.split('#')[0];
												location.reload();
											});
										}

										addToCartCTA.classList.add('kk_klickbuy');
										
									});

									_self.qs('#kk_hide_upsell', kk_upsell_wrapper).addEventListener('click', function(){
										goalPush('kk_s12_del');

										localStorage.setItem('kk_upsell_hide', 1);
										kk_upsell_wrapper.outerHTML = '';
									});
								});
							}
						}

						if(varianteSale){
							kk_total.classList.add('discountPrice');
							kk_total.insertAdjacentHTML('afterend', ''+
								'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">'+float2Price(price2Float(kk_total.textContent) + _youSaved)+' €*</div>'
							);
						}

						kk_total.closest('.h-xsmallOffset-bottom-outer:not(.column)').insertAdjacentHTML('afterbegin', '<div class="column small-12 large-10 large-offset-1"><hr></div>');
						

					}
				}
			});

		}else if(pageURL.indexOf("/checkout/orderConfirmation") !== -1){
			// Dankeseite

			if(hasSegment("32820")){
				// Guschein Dankeseite
				pushSegment("32823");
				pushSegment("32820", false);
				pushEconda('VOUCHER', 1);

			}else if(hasSegment("32821")){
				// Sale Dankeseite
				pushSegment("32825");
				pushSegment("32820", false);
				pushEconda('SALE', 1);
				
			}else if(hasSegment("32822")){
				// No Sale Dankeseite
				pushSegment("32824");
				pushSegment("32820", false);
				pushEconda('NOSALE', 1);
			}
		}
	};
	
})(window.WATO, window);