/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
	"use strict";

	// Create Element.remove() function if not exist
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		};
	}

	WATO.prototype.goalPush = function(key, sendOnNextPageView){
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
		// console.log('goalPush: ', key);
	};

	WATO.prototype.sprint01 = function(voucherLimit, voucherCode){
		var _self = this,
			url = window.location.pathname,
			isDesktop = window.innerWidth > 640; //414

		function priceToFloat(element) {
			if(element){
				return parseFloat(element.textContent.replace("€", "").replace("ab", "").replace(",", "."));
			}else{
				return 0;
			}
		}
		function floatToPrice(floatNumber) {
			return String(floatNumber.toFixed(2)).replace(".",",");
		}
		function availableVoucher(element, voucherCode) {
			return element && element.textContent.indexOf(voucherCode) !== -1;
		}
		function addCodeOrRemove(voucherCode, updateOrRemove, token) {
			// updateOrRemove === true -> code wird hinzugefügt oder aktualisiert
			// updateOrRemove === false -> code wird entfernt
			try {
				var request = new XMLHttpRequest();
	
				request.open('POST', 'https://www.hessnatur.com/de/cart/' + (updateOrRemove ? "update" : "remove" ) + 'Voucher');
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				request.send("voucherCode="+voucherCode+"&CSRFToken=" + token);
	
			} catch (error) {
				// console.log(error);
				goalPush("catchMonitoring");
			}
		}
		function getFreeShippingHTML(withBreak) {
			return '<div class="kk_wknurnoch">'+
					'<span>Gratis Versand ab '+voucherLimit+' €</span>'+
					'<small>Wir schenken Ihnen die Versand<span class="kk_break">'+ (withBreak?'-<br>':'') +'</span>kosten in Höhe von 5,95 €!</small>'+
				'</div>';
		}
		// function getIsShippingFree(productPrice, totalPrice){
		// 	if(!totalPrice){
		// 		totalPrice = priceToFloat(_self.qs("#miniCartDropdown span.float-right"));
		// 	}
		// 	console.log('productPrice: ', productPrice);
		// 	console.log('totalPrice: ', totalPrice);
		// 	console.log('productPrice+totalPrice: ', productPrice+totalPrice);

		// 	return (productPrice+totalPrice) >= voucherLimit;
		// }

		function openShippingLayer(elem) {
			if(elem){
				elem.addEventListener('click', function(e){
					e.preventDefault();

					// window.iridion.push(['goal', "klick_versandkostenlayer"]);
					goalPush("klick_versandkostenlayer");

					try {
						window.ACC.modals.loadAjaxModal("/de/component/shippingInformations");
					} catch (error) {
						// console.log(error);
						goalPush("catchMonitoring");
					}
				});
			}
		}

		function pdpPriceShow(totalPrice, productPrice) {

			try {
				var orginalShippingLink = 'zzgl. <a class="btn-simple-link js-reveal-ajax" href="/de/component/shippingInformations">Versandkosten</a>',
					orginalShippingVersandkosten = _self.qs(".js-price-info > .h-nowrap:nth-child(3)"),
					orginalShippingPosition = _self.qs(".js-price-info > .h-nowrap:nth-child(2)"),
					comboPrice = productPrice+totalPrice,
					isExistMessage = _self.qs("#addToCartForm > .kk_wklfree"),
					versandkostenLink = _self.qs(".h-nowrap .js-reveal-ajax"),
					existsMobileNurNoch = _self.qs(".kk_wklfreeMobile"),

					mobileNurNochXMessage = function(price) {
						_self.elem('#offCanvasMiniCartWrapper', function(offCanvasMiniCartWrapper){
							if(offCanvasMiniCartWrapper){
								offCanvasMiniCartWrapper[0].insertAdjacentHTML('afterend', 
									'<div class="kk_wklfreeMobile">'+
										'<b>Nur noch '+ floatToPrice(price) +'€</b><small>und Ihre Bestellung ist versandkostenfrei!</span>'+
									'</div>'
								);
							}
						});
			
						if(orginalShippingPosition){
							orginalShippingPosition.innerHTML = orginalShippingLink;
						}
						
						openShippingLayer(versandkostenLink);
					}

				// console.log('existsMobileNurNoch: ', existsMobileNurNoch);
				if(existsMobileNurNoch){
					existsMobileNurNoch.remove();
				}
				var freeTeaser = _self.qs("#offCanvasMiniCartWrapper + .kk_wklfree");
				if(freeTeaser){
					// freeTeaser.style.display = "none";
					// console.log("<<<<< remove");
					freeTeaser.remove();
				}


				if(isExistMessage){
					isExistMessage.remove();
				}

				if(orginalShippingPosition && orginalShippingVersandkosten && orginalShippingVersandkosten.textContent.indexOf("Versandkosten") !== -1){
					orginalShippingPosition = orginalShippingVersandkosten;
				}

				

				// console.log('totalPrice >= voucherLimit: ', totalPrice >= voucherLimit);
				// console.log('productPrice >= voucherLimit: ', productPrice >= voucherLimit);
				// console.log('productPrice: ', productPrice);
				// console.log('totalPrice: ', totalPrice);
				// console.log('comboPrice >= voucherLimit: ', comboPrice >= voucherLimit);

				if(totalPrice >= voucherLimit || productPrice >= voucherLimit){
					// versandkostenfrei
					// console.log('>>> versandkostenfrei');
					var greenHTML = '<span class="kk_green">versandkostenfrei</span>';

					if(orginalShippingPosition){
						orginalShippingPosition.innerHTML = greenHTML;
					}
					
					// console.log('_self.qs(".js-price-info > .h-nowrap:nth-child(3)"): ', _self.qs(".js-price-info > .h-nowrap:nth-child(3)"));


					if(isDesktop) {
						// Desktop
						_self.elem('#miniCartDropdown .h-xsmallOffset-bottom-outer', function(miniCart){
							if(miniCart){
								miniCart = miniCart[0];
	
								if(miniCart.textContent.indexOf("zzgl. Versandkosten") !== -1){
									miniCart.innerHTML = 'inkl. MwSt., '+greenHTML;
								}
							}
						});
					}else{
						// Mobile
						_self.elem('#offCanvasMiniCartWrapper > .row .h-xsmallOffset-bottom-outer', function(offCanvasMiniCartWrapper){
							if(offCanvasMiniCartWrapper){
								offCanvasMiniCartWrapper[0].innerHTML = greenHTML;
							}
						});
					}

				}else if(comboPrice >= voucherLimit){
					
					// Mit diesem Produkt zusammen wird die Bestellung versandkostenfrei
					// console.log(">>> Mit diesem Produkt zusammen wird die Bestellung Versandkostenfrei");

					_self.qs("#addToCartButton").insertAdjacentHTML('afterend', 
						'<div class="kk_wklfree">'+
							'Mit diesem Artikel wird Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
						'</div>'
					);

					// nur noch X€ und Ihre Bestellung ist versandkostenfrei
					mobileNurNochXMessage(voucherLimit - totalPrice);

				}else if(!isDesktop) {
					// Mobile

					// nur noch X€ und Ihre Bestellung ist versandkostenfrei
					mobileNurNochXMessage(voucherLimit - totalPrice);
					
				}else{
					if(orginalShippingPosition){
						orginalShippingPosition.innerHTML = orginalShippingLink;
						openShippingLayer(versandkostenLink);
					}
					
				}

			} catch (error) {
				// console.log(error);
				goalPush("catchMonitoring");
			}
		}


		// Global
		_self.elem('.footerWrapper li:first-child', function(footerLi){
			if(footerLi){
				footerLi = footerLi[0];
				footerLi.innerHTML = '<a class="js-reveal-ajax" href="/de/component/shippingInformations">Gratis Versand ab '+voucherLimit+' €</a>';
				openShippingLayer(_self.qs(".js-reveal-ajax", footerLi));
			}
		});
		_self.elem('#miniCartDropdown span.float-right, #miniCartDropdown .flyout-default-text', function(wkPrice){
			if(wkPrice){
				wkPrice = wkPrice[0];
				var totalPrice = 0;
				if(wkPrice.textContent.indexOf("noch keine Artikel") === -1){
					totalPrice = priceToFloat(wkPrice);
				}
				pdpPriceShow(totalPrice, 0);
			}
		});

		if(url.indexOf("/p/") !== -1){
			// PDS

			var freeText =  '<div class="kk_wklfree">'+
								'Mit diesem Artikel ist Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
							'</div>';

			// miniCartDropdown oben rechts
			_self.elem('#miniCartDropdown span.float-right, #miniCartDropdown .flyout-default-text', function(wkPrice){
				if(wkPrice){
					wkPrice = wkPrice[0];
					// console.log('wkPrice: ', wkPrice);

					// Gesamt WK Wert
					var totalPrice = 0;

					if(wkPrice.textContent.indexOf("noch keine Artikel") === -1){
						totalPrice = priceToFloat(wkPrice);
					}

					// console.log('totalPrice: ', totalPrice);

					// Preis des aktuellen Produktes
					_self.elem('span[itemprop="priceCurrency"]', function(productPriceBox){
						if(productPriceBox){
							// console.log('productPriceBox: ', productPriceBox);

							_self.qs("#desc__size").addEventListener('change', function(){
								setTimeout(function(){
									// console.log("change");

									var currentProductPrice = priceToFloat(_self.qs('span[itemprop="priceCurrency"]'));
									// console.log('currentProductPrice: ', currentProductPrice);

									if(isDesktop){
										var newWKPrice = _self.qs("#miniCartDropdown span.float-right");

										// Neuen WK Total abfragen
										if(newWKPrice){
											totalPrice = priceToFloat(newWKPrice);
										}
									}else{
										var newWKPrice = _self.qs("#offCanvasMiniCartWrapper strong .float-right");

										// Neuen WK Total abfragen
										if(newWKPrice){
											totalPrice = priceToFloat(newWKPrice);
										}
									}
									
									// console.log('totalPrice: ', totalPrice);

									pdpPriceShow(totalPrice, currentProductPrice);
								}, 200);
							});


							var productPrice = priceToFloat(productPriceBox[0]), // Produktpreis
								comboPrice = productPrice+totalPrice; // Kombination aus Produktpreis und aktuellem WK-Wert
								// isShippingFree = comboPrice >= voucherLimit, // ist versandkostenfrei!
								// euroToFree = floatToPrice(voucherLimit - comboPrice);
							
							// console.log('productPrice: ', productPrice);
							// console.log('voucherLimit: ', voucherLimit);
							// console.log('comboPrice: ', comboPrice);
							// console.log('voucherLimit - comboPrice: ', voucherLimit - comboPrice);
							// console.log('productPrice: ', productPrice);
							// console.log('productPrice+totalPrice >= voucherLimit: ', productPrice+totalPrice >= voucherLimit);

							pdpPriceShow(totalPrice, productPrice);
							

							// Dieses Produkt wurde zum WK hinzugefügt
							_self.ajax("cart/add", function(){
								// console.log("cart/add");

								// console.log('comboPrice: ', comboPrice);
								// console.log('voucherLimit: ', voucherLimit);
								// console.log('comboPrice >= voucherLimit: ', comboPrice >= voucherLimit);

								try {
									if(comboPrice >= voucherLimit){
										// der Vouchercode wird hinzugefügt
										// console.log('_self.qs(input[name="CSRFToken"]).value: ', _self.qs('input[name="CSRFToken"]').value);
										addCodeOrRemove(voucherCode, true, _self.qs('input[name="CSRFToken"]').value);
									}

									if(isDesktop){
										// Desktop

										// WK-Layer Footer
										// console.log("WK-Layer Footer");

										setTimeout(function(){
											_self.elem('.wa_footer .column:nth-child(2)', function(betweenButtonsInWKLayer){
												if(betweenButtonsInWKLayer){
													betweenButtonsInWKLayer = betweenButtonsInWKLayer[0];
													// console.log('betweenButtonsInWKLayer: ', betweenButtonsInWKLayer);

													var newWKPrice = _self.qs("#miniCartDropdown span.float-right");

													// Neuen WK Total abfragen
													if(newWKPrice){
														totalPrice = priceToFloat(newWKPrice);
													}

													pdpPriceShow(totalPrice, productPrice);


													// console.log('totalPrice >= voucherLimit: ', totalPrice >= voucherLimit);
													// console.log('totalPrice: ', totalPrice);

													if(totalPrice >= voucherLimit){
														// Versandkostenfrei
														// console.log("Versandkostenfrei");
															betweenButtonsInWKLayer.innerHTML = freeText;
													}else{
														// Nur noch X€ bis versandkostenfrei
														betweenButtonsInWKLayer.innerHTML = 
															'<div class="kk_wklfree">'+
																'<b>Es fehlen nur noch '+ floatToPrice(voucherLimit - totalPrice) +' €</b><small>und wir schenken Ihnen die Versandkosten!</span>'+
															'</div>';
													}
												}
											});
										}, 200);

									}else{
										// Mobile
										
										// console.log(1);

										var newWKPrice = _self.qs("#offCanvasMiniCartWrapper strong .float-right");

										// Neuen WK Total abfragen
										if(newWKPrice){
											totalPrice = priceToFloat(newWKPrice);
										}
										pdpPriceShow(totalPrice, productPrice); //+productPrice

										// if(totalPrice >= voucherLimit){
											// Im WK-Layer:
											// Wenn vorhandener Text wie "Nur noch X€ bis versandkostenfrei" oder 
											// "Mit diesem Produkt zusammen wird die Bestellung versandkostenfrei" dann diesen durch 
											// "versandkostenfrei" ersetzen
											
											// _self.qs("#offCanvasMiniCartWrapper .h-xsmallOffset-bottom-outer").innerHTML = freeText;
										// }

									}
								} catch (error) {
									// console.log(error);
									goalPush("catchMonitoring");
								}
							});

						}
					});
				}
			});

		}else if(url.indexOf("/c/") !== -1){
		// Kategorieseite

			if(isDesktop){
				// Desktop

				// Unter der Navi wird der Versandkostenfrei Text eingebaut
				_self.elem('.sidebarNav--nav', function(navi){
					if(navi){
						navi[0].insertAdjacentHTML('afterend', getFreeShippingHTML(true));
					}
				});
			}else{
				// Mobile

				// Nach dem vierten Produkt wird der Versandkostenfrei Text eingebaut
				_self.elem('.gridviewProductItemWrapper:nth-child(5)', function(fourthProduct){
					if(fourthProduct){
						fourthProduct[0].insertAdjacentHTML('afterend', 
							getFreeShippingHTML(false)
						);

					}
				});
			}

		}else if(url === "/de/"){
		// Startseite

		_self.elem('.small-12 + .small-12 + .rteContainer', function(teaser){
			if(teaser){
				teaser[0].insertAdjacentHTML('beforebegin', 
					'<div class="kk_homewrapper">'+
						getFreeShippingHTML(false)+
					'</div>'
				);
			}
		});

		}else if(url.indexOf("/cart") !== -1){
			// WK Seite
			// console.log("WK Seite");

			_self.elem('.h-xsmallOffset-bottom-outer strong.offset-price-left', function(sum){
				if(sum){

					var totalSum = priceToFloat(sum[0]),
						zwischenSummeField = _self.qs(".yCmsContentSlot + .column"),
						voucherWrapper = _self.qs("section > #hessnaturVoucherForm"),
						isActiveVoucher = availableVoucher(voucherWrapper, voucherCode),
						siteToken = _self.qs('input[name="CSRFToken"]').value;
						
					// console.log('voucherWrapper: ', voucherWrapper);
					// console.log('voucherLimit: ', voucherLimit);
					// console.log('totalSum: ', totalSum);
					// console.log('voucherLimit - totalSum: ', voucherLimit - totalSum);

					if(totalSum >= voucherLimit){
						// Versandkostenfrei
						// console.log("Versandkostenfrei");

						zwischenSummeField.classList.add("kk_shippingfree");

						if(!isActiveVoucher){
							// Wenn noch kein Code gesetzt ist wieder dieser hier nachträglich gesetzt
							addCodeOrRemove(voucherCode, true, siteToken);
						}

					}else{
						// Nur noch X€ bis versandkostenfrei
						// console.log('Nur noch X€ bis versandkostenfrei: ', (voucherLimit - totalSum).toFixed(2));

						zwischenSummeField.classList.add("kk_only");
						zwischenSummeField.insertAdjacentHTML( (isDesktop ? 'afterbegin' : 'beforeend'), 
							'<div class="kk_wknurnoch">'+
								'<span>Nur noch '+ floatToPrice(voucherLimit - totalSum) + '€</span>'+
								'<small>und Ihre Bestellung ist'+(isDesktop ? "<br>": " ")+'versandkostenfrei!</small>'+
							'</div>'
						);

						if(isActiveVoucher){
							// Wenn der Code noch gesetzt ist und der WK-Wert zu niedrig ist
							// wird der Code wieder entfernt
							// console.log("Code wieder entfernt");

							addCodeOrRemove(voucherCode, false, siteToken);
						}

					}

					if(isActiveVoucher){
						voucherWrapper.style.display = "none";
					}

				}
			});


		}else if(url.indexOf("/summary") !== -1){
		// Zusammenfassung


			_self.elem('.print-page-break-avoid.h-offset-bottom-inner .columns', function(totalSummary){
				if(totalSummary){
					totalSummary = totalSummary[0];

					var rows = _self.qsa(".row", totalSummary),
						totalPrice = _self.qs(".print-page-break-avoid > .row:last-child .totalPrice");

					if(totalPrice && priceToFloat(totalPrice) >= voucherLimit){
						// Alle Zeilen der Kosten prüfen ob diese das Word Versandkosten oder den Vouchercode beinhalten um
						// diese auszublenden. Stattdessen wird dann Gratis in die Versandkosten-Zeile geschrieben
						for (var i = 0; i < rows.length; i++) {
							var thisRow = rows[i];
							if(thisRow.textContent.indexOf(voucherCode) !== -1 || thisRow.textContent.indexOf("Versandkosten") !== -1){
								thisRow.classList.add("kk_hide");
							}else if(thisRow.textContent.indexOf("Portofrei") !== -1){
								_self.qs(".totalPrice", thisRow).innerHTML = '<span class="kk_green">Gratis</span>';
							}
						}

						_self.qs("#checkoutSummaryForm1").classList.add("kk_gratis");
					}

					
				}
			});

		}
	};

})(window.WATO, window);


/*try{
var script = document.createElement("script");
script.src = "https://dev.web-arts.de/hessnatur/2019/Sprint1-Versandkostenfrei/src/global/global.min.js";
document.head.appendChild(script);
setTimeout(function(){

!function(n){"use strict";n.sprint01(99,"ECOMWAPF99MB")}(new window.WATO);

}, 1000);

} catch (error) {
        console.log(error);
}*/
