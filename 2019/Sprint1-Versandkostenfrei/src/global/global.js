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
		console.log("sprint01");

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
		// function availableVoucher(element, voucherCode) {
		// 	if(element){
		// 		return element.textContent.indexOf(voucherCode) !== -1;
		// 	}else{
		// 		return false;
		// 	}
		// }
		function addCodeOrRemove(voucherCode, updateOrRemove, token) {
			// updateOrRemove === true -> code wird hinzugefügt oder aktualisiert
			// updateOrRemove === false -> code wird entfernt
			try {
				var request = new XMLHttpRequest();
	
				request.open('POST', 'https://www.hessnatur.com/de/cart/' + (updateOrRemove ? "update" : "remove" ) + 'Voucher');
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				request.send("voucherCode="+voucherCode+"&CSRFToken=" + token);
	
			} catch (error) {
				console.log(error);
				_self.goalPush("catchMonitoring");
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
					_self.goalPush("klick_versandkostenlayer");

					try {
						window.ACC.modals.loadAjaxModal("/de/component/shippingInformations");
					} catch (error) {
						console.log(error);
						_self.goalPush("catchMonitoring");
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
					};

				// console.log('existsMobileNurNoch: ', existsMobileNurNoch);
				if(existsMobileNurNoch){
					existsMobileNurNoch.remove();
				}
				var freeTeaser = _self.qs("#offCanvasMiniCartWrapper + .kk_wklfree");
				if(freeTeaser){
					// freeTeaser.style.display = "none";
					console.log("<<<<< remove");
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
					console.log('>>> versandkostenfrei');
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
					console.log(">>> Mit diesem Produkt zusammen wird die Bestellung Versandkostenfrei");

					_self.elem('#addToCartButton', function(addToCartButton){
						if(addToCartButton){
							addToCartButton[0].insertAdjacentHTML('afterend', 
								'<div class="kk_wklfree">'+
									'Mit diesem Artikel wird Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
								'</div>'
							);
						}
					});

					// _self.qs("#addToCartButton").insertAdjacentHTML('afterend', 
					// 	'<div class="kk_wklfree">'+
					// 		'Mit diesem Artikel wird Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
					// 	'</div>'
					// );

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
				console.log("1 ",error);
				_self.goalPush("catchMonitoring");
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

			console.log(1);

			var freeText =  '<div class="kk_wklfree">'+
								'Mit diesem Artikel ist Ihre<br>Bestellung <span class="kk_green">versandkostenfrei</span>'+
							'</div>';

			// miniCartDropdown oben rechts
			_self.elem('#miniCartDropdown span.float-right, #miniCartDropdown .flyout-default-text', function(wkPrice){
				if(wkPrice){
					wkPrice = wkPrice[0];
					console.log('wkPrice: ', wkPrice);

					// Gesamt WK Wert
					var totalPrice = 0;

					if(wkPrice.textContent.indexOf("noch keine Artikel") === -1){
						totalPrice = priceToFloat(wkPrice);
					}

					console.log('totalPrice: ', totalPrice);

					// Preis des aktuellen Produktes
					_self.elem('span[itemprop="priceCurrency"]', function(productPriceBox){
						if(productPriceBox){
							console.log('productPriceBox: ', productPriceBox);

							_self.elem('#desc__size', function(element){
								if(element){
									element[0].addEventListener('change', function(){
										setTimeout(function(){
											console.log("change");
		
											var currentProductPrice = priceToFloat(_self.qs('span[itemprop="priceCurrency"]'));
											// console.log('currentProductPrice: ', currentProductPrice);
		
											if(isDesktop){
												var newWKPriceDektop = _self.qs("#miniCartDropdown span.float-right");
		
												// Neuen WK Total abfragen
												if(newWKPriceDektop){
													totalPrice = priceToFloat(newWKPriceDektop);
												}
											}else{
												var newWKPriceMobile = _self.qs("#offCanvasMiniCartWrapper strong .float-right");
		
												// Neuen WK Total abfragen
												if(newWKPriceMobile){
													totalPrice = priceToFloat(newWKPriceMobile);
												}
											}
											
											console.log('totalPrice: ', totalPrice);
		
											pdpPriceShow(totalPrice, currentProductPrice);
										}, 200);
									});
								}
							});

							// _self.qs("#desc__size")


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
								console.log("cart/add");

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
										console.log("WK-Layer Footer");

										setTimeout(function(){
											_self.elem('.ds_footer > .column:nth-child(2)', function(betweenButtonsInWKLayer){
												try {
													
													if(betweenButtonsInWKLayer){
														betweenButtonsInWKLayer = betweenButtonsInWKLayer[0];
														console.log('betweenButtonsInWKLayer: ', betweenButtonsInWKLayer);
	
														var newWKPrice = _self.qs("#miniCartDropdown span.float-right");
														console.log('newWKPrice: ', newWKPrice);
	
														// Neuen WK Total abfragen
														if(newWKPrice){
															totalPrice = priceToFloat(newWKPrice);
														}
	
														pdpPriceShow(totalPrice, productPrice);
	
	
														// console.log('totalPrice >= voucherLimit: ', totalPrice >= voucherLimit);
														console.log('totalPrice: ', totalPrice);
	
														if(totalPrice >= voucherLimit){
															// Versandkostenfrei
															console.log("Versandkostenfrei");
																betweenButtonsInWKLayer.innerHTML = freeText;
														}else{
															// Nur noch X€ bis versandkostenfrei
															betweenButtonsInWKLayer.innerHTML = 
																'<div class="kk_wklfree">'+
																	'<b>Es fehlen nur noch '+ floatToPrice(voucherLimit - totalPrice) +' €</b><small>und wir schenken Ihnen die Versandkosten!</span>'+
																'</div>';
														}
													}


												} catch (error) {
													console.log(error);
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
									console.log("2 ",error);
									_self.goalPush("catchMonitoring");
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
						console.log("a");
						navi[0].insertAdjacentHTML('afterend', getFreeShippingHTML(true));
					}
				});
			}else{
				// Mobile

				// Nach dem vierten Produkt wird der Versandkostenfrei Text eingebaut
				_self.elem('.gridviewProductItemWrapper:nth-child(5)', function(fourthProduct){
					if(fourthProduct){
						fourthProduct[0].insertAdjacentHTML('afterend', getFreeShippingHTML(false));

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
			console.log("WK Seite");

			_self.elem('.yCmsContentSlot + .column .offset-price-left', function(sum){
				if(sum){

					try {

						var totalSum = priceToFloat(sum[0]),
							zwischenSummeField = _self.qs(".yCmsContentSlot + .column"),
							ganzeSection = _self.qs(".js_backstopWrapper"),
							// voucherWrapper = _self.qsa("section > #hessnaturVoucherForm"),
							// isActiveVoucher = availableVoucher(ganzeSection, voucherCode),
							isActiveVoucher = ganzeSection.textContent.indexOf(voucherCode) !== -1,
							siteToken = _self.qs('input[name="CSRFToken"]').value,
							einPortofreiGutscheinIstVorhanden = ganzeSection.textContent.indexOf("Portofrei") !== -1;
							
							// console.log('voucherWrapper: ', voucherWrapper);
						console.log('isActiveVoucher: ', isActiveVoucher);
						console.log('voucherLimit: ', voucherLimit);
						console.log('totalSum: ', totalSum);
						console.log('voucherLimit - totalSum: ', voucherLimit - totalSum);
						console.log('einPortofreiGutscheinIstVorhanden: ', einPortofreiGutscheinIstVorhanden);
						console.log('totalSum >= voucherLimit: ', totalSum >= voucherLimit);

						if(totalSum >= voucherLimit || (einPortofreiGutscheinIstVorhanden && !isActiveVoucher)){
							// Versandkostenfrei
							console.log("Versandkostenfrei");

							console.log('zwischenSummeField: ', zwischenSummeField);
							zwischenSummeField.classList.add("kk_shippingfree");

							console.log('ganzeSection: ', ganzeSection);
							if(!isActiveVoucher && !einPortofreiGutscheinIstVorhanden){
								console.log("added Vouchercode");
								// Wenn noch kein Vouchercode bisher gesetzt ist, wird dieser hier nachträglich gesetzt
								addCodeOrRemove(voucherCode, true, siteToken);
							}

						}else{
							// Nur noch X€ bis versandkostenfrei
							console.log('Nur noch X€ bis versandkostenfrei: ', (voucherLimit - totalSum).toFixed(2));

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
								console.log("Code wieder entfernt");

								addCodeOrRemove(voucherCode, false, siteToken);
							}
						}
					
						if(isActiveVoucher){
							_self.elem('section > #hessnaturVoucherForm', function(voucherWrapper){
								if(voucherWrapper){
									console.log('isActiveVoucher: ', isActiveVoucher);
									for (var i = 0; i < voucherWrapper.length; i++) {
										console.log('voucherWrapper[i]: ', voucherWrapper[i]);
										console.log('voucherWrapper[i].textContent.indexOf(voucherCode): ', voucherWrapper[i].textContent.indexOf(voucherCode));
										if(voucherWrapper[i].textContent.indexOf(voucherCode) !== -1){
											voucherWrapper[i].style.display = "none";
										}
									}
								}
							});
						}
					} catch (error) {
						console.log("3 ",error);
						_self.goalPush("catchMonitoring");
					}

				}
			});


		}else if(url.indexOf("/summary") !== -1){
		// Zusammenfassung


			_self.elem('.print-page-break-avoid.h-offset-bottom-inner .columns', function(totalSummary){
				if(totalSummary){
					try {
						totalSummary = totalSummary[0];
						// console.log('totalSummary: ', totalSummary);

						var rows = _self.qsa(".row", totalSummary),
							totalPrice = _self.qs(".print-page-break-avoid > .row:last-child .totalPrice");
						// console.log('totalPrice: ', totalPrice);

						// console.log('totalPrice && priceToFloat(totalPrice) >= voucherLimit: ', totalPrice && priceToFloat(totalPrice) >= voucherLimit);
						// console.log('voucherLimit: ', voucherLimit);

						if(totalPrice && priceToFloat(totalPrice) >= voucherLimit || totalSummary.textContent.indexOf("Portofrei") !== -1){
							// Alle Zeilen der Kosten prüfen ob diese das Word Versandkosten oder den Vouchercode beinhalten um
							// diese auszublenden. Stattdessen wird dann Gratis in die Versandkosten-Zeile geschrieben
							// console.log('rows: ', rows);
							for (var i = 0; i < rows.length; i++) {
								var thisRow = rows[i];
								// console.log('thisRow: ', thisRow);
								if(thisRow.textContent.indexOf(voucherCode) !== -1 || thisRow.textContent.indexOf("Versandkosten") !== -1){
									thisRow.classList.add("kk_hide");
								}else if(thisRow.textContent.indexOf("Portofrei") !== -1){
									var priceInfo = _self.qs(".totalPrice", thisRow);
									if(priceInfo){
										priceInfo.innerHTML = '<span class="kk_green">Gratis</span>';
									}
								}
							}

							var summary = _self.qs("#checkoutSummaryForm1");
							if(summary){
								summary.classList.add("kk_gratis");
							}
						}
					} catch (error) {
						console.log(error);
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
