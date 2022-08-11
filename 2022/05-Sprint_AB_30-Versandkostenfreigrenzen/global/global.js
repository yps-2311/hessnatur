/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
 * @function
 * @author Christian Knoth
 * @namespace global
 * @name global
 * @description
 */

(function(WATO){
	"use strict";

	WATO.prototype.S0522 = function (props) {

		var WATO = this;

		const { variation, cookie, limit } = props;
		
		console.log("AB30 - Versandkostenfreigrenzen", variation, cookie, limit);


		(async function init (){
	
			function insertHTML (elem, place, value){
				if(elem){
					elem.insertAdjacentHTML(place, value);
				}
			}
	
			function getPriceValue (elem) {
				if(elem){
					return parseFloat(elem.innerHTML.match(/\d+/g).join("."));
				}
			}
	
			function checkPath (url){
				return window.location.pathname.includes(url);
			}
	
			function pushError() {
				window.iridion.push(['goal', "S05AB30_Error"]);
			}
	
			if(checkPath('/p/')){// vkf79hn2022 vkf99hn2022 vkf169hn2022


				if(document.cookie.indexOf("iridionGroup=") === -1){
					WATO.setCookie("iridionGroup", cookie, ".hessnatur.com", true);
				}
	
				//lösche Versandkosten wenn Gesamtkosten höher als 99 sind
				WATO.ajax('de/cart/add?context=offCanvasRight', () => {
					WATO.elem('.js-cart-total-unit-count + span', total => {
						if(total){
	
							if(total[0].textContent && parseInt(total[0].textContent.split(",")[0]) >= limit){
								
								console.log(WATO.qs('#offCanvasMiniCartWrapper .row .h-xsmallOffset-bottom-outer'));
								WATO.qs('#offCanvasMiniCartWrapper .row .h-xsmallOffset-bottom-outer').innerHTML = "inkl. MwSt.";
							}
						}
					});
				});
				
				try{
	
					let wrapper = await WATO.asyncElem('.kk_cta_uvps ul');
					wrapper = wrapper[0];
	
					if(!WATO.qs('.kk_noDeliv')){
						console.log("do");
						insertHTML(wrapper, 'beforeend',
							'<li class="kk_noDeliv">Kostenloser Versand ab ' + limit + ' &euro;</li>'
						);
					}
	
				} catch(e){
					console.log("error",e);
					pushError();
				}
				
			} else if(checkPath('/cart')){
				
				try{
	
					let oldDeliv = await WATO.asyncElem('.column.small-12.text-right.h-xsmallOffset-top-outer');
					oldDeliv = oldDeliv[0].parentElement;
					const currentValue = getPriceValue(WATO.qsa('strong + strong.price.offset-price-left')[1]);
	
					//default, Versandkosten entfallen nicht
					let redValue = 'Nur noch ' + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(limit - currentValue);
					let redText = "und Ihre";
					let noDeliv = false;

					//Versandkosten entfallen (+ eingelöster Promocode)
					if(currentValue >= limit || (WATO.qs('.price.discountPrice').innerHTML.indexOf('Portofrei') !== -1)){
						console.log("Versandkosten entfallen", "currentValue",currentValue, "limit", limit);
						redValue = "Gute Nachricht!";
						redText = "Ihre";
						noDeliv = true;

						insertHTML(WATO.qs('.js_backstopWrapper .row .yCmsContentSlot'), 'beforebegin', 
							'<div class="kk_notifyOnSuccess yCmsContentSlot column small-12 medium-6 large-offset-1 h-text-muted">' +
								`<div>**Versandkostenfrei: Für diese Bestellung ab einem Warenwert nach Retoure von ${ limit },00 €.</div>` + 
							'</div>'
						);
					}
	
					if(!WATO.qs('.kk_dBox')){

						insertHTML(oldDeliv, 'afterend', 
						`<div class="row align-right${ noDeliv && " kk_cW" }">` +
							'<div class="kk_dBox">' +
								`<div class="kk05_svg${ noDeliv && " kk_check" }"></div>` +
								'<div><strong>' + redValue + '</strong><br>' + redText + ` Bestellung ist versandkostenfrei${ noDeliv && "**" }</div>` +
							'</div>' +
						'</div>'
						);
					}
	
					if(!WATO.qs('.kk_redP')){

						insertHTML(WATO.qs('.btn-deliverycosts'), 'afterend',
							' (frei ab ' + limit + ',00 &euro;)'
						)
						/*
						
						insertHTML(oldDeliv, 'beforebegin', 
							'<div class="kk_redP small-12 text-right h-text-muted">' +
								'<span>Versand (frei ab ' + limit + ',00 &euro;)</span>' +
								`<span class="price offset-price-left ${ noDeliv ? "kk_lt" : "" }">5,95 &euro;*</span>` +
							'</div>'
						);
						*/
					}
	
				} catch(e){
					
					pushError();
				}
				
			}
		})();
	}


	
})(window.WATO);
