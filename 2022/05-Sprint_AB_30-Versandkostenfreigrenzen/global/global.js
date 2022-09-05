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
				else return false;
			}
	
			function checkPath (url){
				return window.location.pathname.includes(url);
			}
	
			function pushGoal(value) {
				if(value) window.iridion.push(['goal', "S05AB30_" + value]);
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
								
								WATO.qs('#offCanvasMiniCartWrapper .row .h-xsmallOffset-bottom-outer').innerHTML = "inkl. MwSt.";
							}
						}
					});
				});
	
				let wrapper = await WATO.asyncElem('.kk_cta_uvps ul');
				if(wrapper && !WATO.qs('.kk_noDeliv')){

					wrapper = wrapper[0];
	
					insertHTML(wrapper, 'beforeend',
						'<li class="kk_noDeliv">Kostenloser Versand ab ' + limit + ' &euro;</li>'
					);
				}
				
			} else if(checkPath('/cart')){
	
				let oldDeliv = await WATO.asyncElem('.column.small-12.text-right.h-xsmallOffset-top-outer');
				if(oldDeliv){

					oldDeliv = oldDeliv[0].parentElement;

					const selectPortofrei = WATO.qs('.price.discountPrice');
					const currentValue = getPriceValue(WATO.qs('.cart-promotions-potential b'));
					
					//default - Versandkosten entfallen (+ eingelöster Promocode)
					let redValue = "Gute Nachricht!",
						redText = "Ihre",
						noDeliv = true;

					if(selectPortofrei){
						pushGoal("redeemedCoupon");
					}

					//default, Versandkosten entfallen nicht
					if(currentValue && !( selectPortofrei && selectPortofrei.innerHTML.indexOf('Portofrei') !== -1)){
						
						redValue = 'Nur noch ' + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(currentValue);
						redText = "und Ihre";
						noDeliv = false;
					}
	
					if(!WATO.qs('.kk_dBox')){

						insertHTML(oldDeliv, 'afterend', 
						`<div class="row align-right${ noDeliv ? " kk_cW" : '' }">` +
							'<div class="kk_dBox">' +
								`<div class="kk05_svg${ noDeliv ? " kk_check" : '' }"></div>` +
								`<div><strong>${ redValue }</strong><br>${ redText } Bestellung ist versandkostenfrei**</div>` +
							'</div>' +
						'</div>'
						);
					}

					const cliff = WATO.qs('.js_backstopWrapper .row.h-xsmallOffset-bottom-outer .h-mediumOffset-bottom-outer');
					if(cliff){

						cliff.classList.add('kk_d-none');
						insertHTML(cliff, 'afterend', 
							'<div class="kk_notifyOnSuccess column small-12 medium-6 large-5 large-offset-1 h-mediumOffset-bottom-outer h-text-muted">' +
								`<div>**Gilt für diese Bestellung ab einem Warenwert von ${ limit },00 Euro (abzüglich Versandkosten, Rabatt und Retouren).</div>` + 
							'</div>'
						);
					}
	
					if(!WATO.qs('.kk_redP')){

						insertHTML(WATO.qs('.btn-deliverycosts'), 'afterend',
							' (frei ab ' + limit + ',00 &euro;)'
						);
					}
				}
				
			}
		})();
	}


	
})(window.WATO);
