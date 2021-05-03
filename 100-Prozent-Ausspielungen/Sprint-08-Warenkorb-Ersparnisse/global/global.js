/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
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

	WATO.prototype.s8 = function(variant){
		var _self = this;
		variant = variant || 0;

		// console.log(variant);

		_self.exclude(1023, _self.reload);

		if(variant === 0) {
			return false;
		}

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
				_youSaved = 0;
	
				// iterate all products and find savings
				for(var i=0; i < _productCount; i++) {
					var _thisProduct = _products[i],
					_oldPrice = _self.qs('.strikeValue', _thisProduct);
	
					if(_oldPrice) {
						var _newPrice = _self.qs('.price', _thisProduct),
						_oldPriceWrapper = _oldPrice.parentElement,
						_save = price2Float(_oldPrice.textContent) - price2Float(_newPrice.textContent);
	
						// sum savings
						if(_save > 0) {
							_youSaved += _save;
						}
	
						_oldPriceWrapper.classList.add('kk_price');
						
						_oldPriceWrapper.parentElement.insertAdjacentHTML('beforeend', ''+
							'<div class="kk_save">€ '+float2Price(_save)+' Ersparnis</div>'
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
	
				// kk_sum.id="kk_sum";
				kk_sum.classList.add('discountPrice');
				kk_sum.insertAdjacentHTML('afterend', ''+
					'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+float2Price(price2Float(kk_sum.textContent) + _youSaved)+'*</div>'
				);
				
				_self.qs('.btn-deliverycosts').insertAdjacentHTML('afterend', ''+
					'<br/>'+
					'<div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> € '+float2Price(_youSaved)+'</div>'
				);

				_self.elem('#hessnaturVoucherForm', function(hessnaturVoucherForm){
					if(hessnaturVoucherForm) {
						var _target = hessnaturVoucherForm[0].closest('.bgColor-super-light-gray');

						_target.id="kk_voucher";
						_target.nextElementSibling.insertAdjacentElement('afterend', _target);
					}
				});

				if(variant === 2 && !localStorage.getItem('kk_upsell_hide')) {
					// get localstorage category from add to cart (PDS 100%)
					var _ls = JSON.parse(localStorage.getItem('kk_cats')),
					_cats = Object.keys(_ls),
					_cat = '',
					_catCount = 0,
					upsellProds = {
						'herren': [
							// Ersparniss >= 20
							'4238409',
							// Ersparniss >= 10
							'4266889',
						],
						'damen': [
							// Ersparniss >= 20
							'4260009',
							// Ersparniss >= 10
							'4266889',
						],
						'baby': [
							// Ersparniss >= 20
							'4568785',
							// Ersparniss >= 10
							'36581',
						],
						'kids': [
							// Ersparniss >= 20
							'3606218',
						],
						'home': [
							// Ersparniss >= 20
							'4793601',
						],
					},
					upsellPreselect = {
						'4793601': '479360151',
					};

					// find category with highest product add2cart
					for(var c = 0; c < _cats.length; c++) {
						var _key = _cats[c],
						_val = parseInt(_ls[_key]);

						if(_val > _catCount) {
							_cat = _key;
							_catCount = _val;
						}
					}

					var promoProd = upsellProds[_cat];

					// decide which product will be shown
					var upsellIndex = 2;
						
					if(_youSaved >= 20) {
						upsellIndex = 0;
					}
					else if(_youSaved >= 10) {
						upsellIndex = 1;
					}
					var promo = promoProd[upsellIndex];

					// if product found get product info from API
					if(promo) {
						_self.xhr_get('https://www.hessnatur.com/de/p/'+String(promo).substring(0,5)+'/json', false, function(data){
							// console.log(data);

							var init_img_url = '',
							init_color_text = '',
							init_price = '',
							name = data.name,

							colors = {},
							colorsHTML = '',
							sizesHTML = '',

							prod_variations = data.colors,
							prod_variation_count = prod_variations.length,

							buildSizesHTML = function(_sizes){
								var _sizeCount = _sizes.length,
								_sizesHTML = '';

								for(var s = 0; s < _sizeCount; s++) {
									var thisSize = _sizes[s];

									_sizesHTML += '<option value="'+thisSize.code+'" '+((sizesHTML === '' && upsellPreselect[promo] === thisSize.code) ? 'selected="selected"' : '' )+'>'+thisSize.size+'</option>';
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
													'<p style="font-size:26px;line-height: normal;text-transform: uppercase; margin-bottom:23px">Glückwunsch, <br/>Sie sparen €&nbsp'+float2Price(_youSaved)+'!</p>'+
													'<p style="font-size:15px; line-height: normal">Warum nicht einfach die Ersparnis nutzen und <br/>ein '+((promo === '4266889') ? 'Paar '+name.replace('Socke', 'Socken') : name )+' für nur <b id="kk_price_left">€&nbsp;'+float2Price(init_price)+'</b> hinzufügen?</p>'+
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
																'<div class="column shrink price h-xsmallOffset-bottom-inner">€ <span id="kk_price">'+float2Price(init_price)+'</span>*</div>'+
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
																// '<div>'+
																// 	'<button type="button" class="js-entry-edit textLink" style="margin-right: 10px">'+
																// 		'<img src="/_ui/responsive/common/images/icons/edit.png" title="Details ändern" class="icon-edit">'+
																// 	'</button>'+
																// '</div>'+
															'</div>'+
														'</div>'+
														'<div>'+
															'<button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit" style="margin-bottom:0">'+
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
								catch(err) {}

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
									_self.qs('#kk_price_left').innerHTML = '€&nbsp;'+float2Price(_price);
								}
								catch(err) {}
							};

							var _color_bopsels = _self.qsa('.productItemColor', kk_upsell_wrapper);

							for(var c = 0; c < _color_bopsels.length; c++) {
								_color_bopsels[c].addEventListener('click', changeColor);
							}
							
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

								goalPush('kk_s8_a2c');

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
							});

							_self.qs('#kk_hide_upsell', kk_upsell_wrapper).addEventListener('click', function(){
								goalPush('kk_s8_del');

								localStorage.setItem('kk_upsell_hide', 1);
								kk_upsell_wrapper.outerHTML = '';
							});
						});
					}
				}
	
				// kk_total.id="kk_total";
				kk_total.classList.add('discountPrice');
				kk_total.insertAdjacentHTML('afterend', ''+
					'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+float2Price(price2Float(kk_total.textContent) + _youSaved)+'*</div>'
				);

				kk_total.closest('.h-xsmallOffset-bottom-outer:not(.column)').insertAdjacentHTML('afterbegin', '<div class="column small-12 large-10 large-offset-1"><hr></div>');
				
			}
		});
	};
	
})(window.WATO);

//BKP
// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,s,i,r){var o,a=this||i,l=r||Date.now(),c=!1;return Date.now()-l>1e4?(n(!1),!1):("string"==typeof e?c=(o=t.querySelectorAll(e)).length>0:o=c=!0===e(),!0===c?n(o):setTimeout(a.elem.bind(null,e,n,s,a,l),s||20))},e.WATO.prototype.qs=function(e,n){return(n||t).querySelector(e)},e.WATO.prototype.qsa=function(e,n){return(n||t).querySelectorAll(e)},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(s,i,r,o,a){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==i.indexOf(e)&&t()}),!1),n.call(this,s,i,r,o,a)}},e.WATO.prototype.exclude=function(n,s){function i(){(e.innerWidth||t.body.clientWidth)<=n&&!r&&(r=!0,s())}var r=!1;i(),"function"==typeof s&&(e.onresize=function(){i()})},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_get=function(e,t,n){var s=new XMLHttpRequest;s.open("GET",e,!0),s.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,t)}catch(t){n(e)}else n(!1)},s.onerror=function(){n(!1)},s.withCredentials=!0,s.send()},e.WATO.prototype.xhr_post=function(e,t,n,s){var i=new XMLHttpRequest;i.open("POST",e,!0),i.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,s)}catch(t){n(e)}else n(!1)},i.onerror=function(){n(!1)},i.withCredentials=!0,i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.send(t)}}(window,document),function(e){"use strict";function t(e){window.iridion.push(["goal",e])}Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null}),e.prototype.s8=function(e){var n=this;if(e=e||0,n.exclude(1023,n.reload),0===e)return!1;function s(e){return parseFloat(e.replace("€ ","").replace(".","").replace(",","."))}function i(e){var t=e.toFixed(2).replace(".",","),n=t.length-6;return n>0&&(t=t.substring(0,n)+"."+t.substring(n)),t}n.elem("#hessnaturQuickAddForm",(function(e){e&&e[0].parentElement.insertAdjacentHTML("afterend",'<div class="row"><div class="column small-12 large-10 large-offset-1"><div id="kk_cart_hint">Artikel im Warenkorb werden nicht reserviert.</div></div></div>')})),n.elem(".h-mediumOffset-bottom-inner .button.success",(function(r){if(r){for(var o=n.qsa(".listing__table--item"),a=o.length,l=0,c=0;c<a;c++){var d=o[c],p=n.qs(".strikeValue",d);if(p){var u=n.qs(".price",d),m=p.parentElement,f=s(p.textContent)-s(u.textContent);f>0&&(l+=f),m.classList.add("kk_price"),m.parentElement.insertAdjacentHTML("beforeend",'<div class="kk_save">€ '+i(f)+" Ersparnis</div>"),n.qs("img",d).insertAdjacentHTML("afterend",'<span style="width: 100%;display: block;text-align: center;margin-top: -13px;"><img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;"></span>')}}var v=n.qsa(".offset-price-left"),h=v[0],k=v[1];if(h.classList.add("discountPrice"),h.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+i(s(h.textContent)+l)+"*</div>"),n.qs(".btn-deliverycosts").insertAdjacentHTML("afterend",'<br/><div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> € '+i(l)+"</div>"),n.elem("#hessnaturVoucherForm",(function(e){if(e){var t=e[0].closest(".bgColor-super-light-gray");t.id="kk_voucher",t.nextElementSibling.insertAdjacentElement("afterend",t)}})),2===e&&!localStorage.getItem("kk_upsell_hide")){for(var g=JSON.parse(localStorage.getItem("kk_cats")),_=Object.keys(g),y="",b=0,x={4793601:"479360151"},w=0;w<_.length;w++){var T=_[w],q=parseInt(g[T]);q>b&&(y=T,b=q)}var E={herren:["4238409","4266889"],damen:["4260009","4266889"],baby:["4568785","36581"],kids:["3606218"],home:["4793601"]}[y],L=2;l>=20?L=0:l>=10&&(L=1);var A=E[L];A&&n.xhr_get("https://www.hessnatur.com/de/p/"+A+"/json",!1,(function(e){for(var r="",o="",a="",c=e.name,d={},p="",u="",m=e.colors,f=m.length,v=function(e){for(var t=e.length,n="",s=0;s<t;s++){var i=e[s];n+='<option value="'+i.code+'" '+(""===u&&x[A]===i.code?'selected="selected"':"")+">"+i.size+"</option>"}return n},k=0;k<f;k++){var g=m[k];if(100!==g.availabilityIndex){""===r&&(r=g.modelImageUrl||g.articleImageUrl,o=g.color,a=g.price,u=v(g.sizes));var _=g.colorCode;d[_]=g,p+='<li data-color="'+_+'" data-colorname="'+g.color+'"><a class="productItemColor" href="#color" onclick="return false"><img itemprop="image" src="'+g.colorUrl+'" alt="2312754" class="h-shape-circle"></a></li>'}}h.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML("afterend",'<div id="kk_upsell_wrapper" class="row"><div class="medium-12 large-10 large-offset-1 h-largeOffset-bottom-outer"><div id="kk_upsell_inner" class="row" style="border: 5px solid #CBF1A5; padding:10px"><div class="medium-5" style="padding-right:67px;display:flex"><div id="kk_upsell_left"><p style="font-size:26px;line-height: normal;text-transform: uppercase; margin-bottom:23px">Glückwunsch, <br/>Sie sparen €&nbsp'+i(l)+'!</p><p style="font-size:15px; line-height: normal">Warum nicht einfach die Ersparnis nutzen und <br/>ein '+("4266889"===A?"Paar "+c.replace("Socke","Socken"):c)+' für nur <b id="kk_price_left">€&nbsp;'+i(a)+'</b> hinzufügen?</p></div></div><div id="kk_upsell_right" class="medium-7"><div style="margin-right: 25px;flex-shrink: 0;align-items: center;display: flex;"><img id="kk_upsell_img" src="'+r+'"/></div><div style="display: flex;flex-direction: column;justify-content: space-between;"><div style="display: flex;"><div><a href="'+e.url+'" target="_blank" class="h4 cart__productname h-text-decoration-none-hover" style="margin-bottom:15px">'+c+'</a></div><div style="flex-shrink:0;margin-top: 9px;margin-left:25px"><div class="row align-right-for-medium"><div class="column shrink price h-xsmallOffset-bottom-inner">€ <span id="kk_price">'+i(a)+'</span>*</div></div><p class="h-text-muted">inkl. MwSt.</p></div></div><div><div><p><span class="h-text-muted">Farbe:</span> <span id="kk_colorname">'+o+'</span></p><ul class="menu pds-cockpit__colorSwitch show-for-large js-color-bubbles" style="margin: 10px 0;">'+p+'</ul></div><div><p style="margin-bottom: 15px;"><span class="h-text-muted">Größe:</span> <select id="kk_sizes" class="custom__select" style="width: auto;margin: 0;">'+u+'</select></p></div></div><div style="display:flex;justify-content:space-between"><div><div class="column row align-self-bottom small-12" style="margin-top: 21px;"><div class="align-self-bottom shrink h-no-padding-right"><button id="kk_hide_upsell" type="button" class="js-entry-remove textLink" style="margin-right:10px"><img src="/_ui/responsive/common/images/icons/garbage.svg" class="icon-trash"></button></div></div></div><div><button id="kk_addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit" style="margin-bottom:0"><span class="pds-cockpit__addToCartButtonIconWrapper">Zum Warenkorb hinzufügen</span></button></div></div></div></div></div></div></div>');var y=n.qs("#kk_upsell_wrapper");n.qs(".js-color-bubbles li",y).classList.add("active");for(var b=function(e){e.preventDefault();try{var t=this.parentElement,s=d[t.getAttribute("data-color")];if(n.qs("#kk_sizes").innerHTML=v(s.sizes),n.qs("#kk_upsell_img").setAttribute("src",s.modelImageUrl||s.articleImageUrl),n.qs(".active",y).classList.remove("active"),t.classList.add("active"),n.qs("#kk_colorname").innerHTML=t.getAttribute("data-colorname"),"createEvent"in document){var i=document.createEvent("HTMLEvents");i.initEvent("change",!1,!0),n.qs("#kk_sizes").dispatchEvent(i)}else n.qs("#kk_sizes").fireEvent("onchange")}catch(e){}return!1},w=n.qsa(".productItemColor",y),T=0;T<w.length;T++)w[T].addEventListener("click",b);n.qs("#kk_sizes").addEventListener("change",(function(){try{var e=this.value,t=n.qs(".active .productItemColor",y),s=d[t.parentElement.getAttribute("data-color")].sizes.filter((function(t){return t.code===e}))[0].price;n.qs("#kk_price").innerHTML=i(s),n.qs("#kk_price_left").innerHTML="€&nbsp;"+i(s)}catch(e){}})),n.qs("#kk_addToCartButton",y).addEventListener("click",(function(){var i=n.qs("#kk_sizes").value,r={productCodePost:i,ff_id:i,ff_masterId:e.code,ff_title:encodeURIComponent(c),ff_price:s(n.qs("#kk_price").textContent),qty:1,CSRFToken:window.ACC.config.CSRFToken};t("kk_s8_a2c"),""!==i&&n.xhr_post("https://www.hessnatur.com/de/cart/add",Object.keys(r).map((function(e){return encodeURIComponent(e)+"="+encodeURIComponent(r[e])})).join("&"),(function(){localStorage.setItem("kk_upsell_hide",1),location.href=location.href.split("#")[0],location.reload()}))})),n.qs("#kk_hide_upsell",y).addEventListener("click",(function(){t("kk_s8_del"),localStorage.setItem("kk_upsell_hide",1),y.outerHTML=""}))}))}k.classList.add("discountPrice"),k.insertAdjacentHTML("afterend",'<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+i(s(k.textContent)+l)+"*</div>"),k.closest(".h-xsmallOffset-bottom-outer:not(.column)").insertAdjacentHTML("afterbegin",'<div class="column small-12 large-10 large-offset-1"><hr></div>')}}))}}(window.WATO);
