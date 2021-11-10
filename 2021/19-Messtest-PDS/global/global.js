/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	/*jshint loopfunc: true */

	WATO.prototype.messtestpds = function(){
		var _self = this,
			goalSended = [];

		function goalPush(key, sendOnNextPageView){
			// Jedes Goal braucht nur einmal gesendet zu werden
			if(goalSended.indexOf(key) === -1){
				console.log('key: ', key);
				if(sendOnNextPageView){
					window.iridion.push(['goal', key, '', true]);
				}else{
					window.iridion.push(['goal', key]);
				}
				goalSended.push(key);
			}
		}

		function isElementClicked(clickedTarget, selector, goalname, sendOnNextPageView) {
			// Das geklickte Element wird abgeglichen ob es selbst oder eines der Eltern-Elemente einem Goal entspricht
			if(selector.length > 0 && goalSended.indexOf(goalname) === -1 && 
					(	clickedTarget.closest(selector) || 
						clickedTarget === _self.qs(selector) || 
						(typeof clickedTarget.classList !== "undefined" && clickedTarget.classList.contains(selector.replace(".","")))
					)
				){

				goalPush(goalname, sendOnNextPageView);
				return true;
			}
			return false;
		}

		_self.elem('section.js_backstopWrapper', function(globalWrapper){
			if(globalWrapper){
				globalWrapper[0].addEventListener('click', function(e){
					var thisTarget = e.target;

					// Wenn eines der Goals mit dem geklicken Element übereinstimmt, sorgt der "break" dafür, dass die Folgenden nicht mehr geprüft werden
					switch (true) {
						case isElementClicked(thisTarget, '.breadcrumb--back', 'pds_back', true):
							break;

						case isElementClicked(thisTarget, '.breadcrumbs', 'pds_breadcrumb', true):
							break;

						case isElementClicked(thisTarget, '.starRatingWrapper', 'pds_rating'):
							break;

						case isElementClicked(thisTarget, '.flickity-slider a', 'pds_magnifier'):
							break;

						case isElementClicked(thisTarget, '[href="/de/component/shippingInformations"]', 'pds_shippingcost'):
							break;

						case isElementClicked(thisTarget, '.js-pds-more-details', 'pds_moreproductinfos'):
							break;

						case isElementClicked(thisTarget, '[data-open="availability-matrix"]', 'pds_available'):
							break;

						case isElementClicked(thisTarget, '.pds__imageAndCockpitWrapper .flickity-prev-next-button', 'pds_arrows'):
							break;

						case isElementClicked(thisTarget, '.js-size-advisor', 'pds_sizeadvisor'):
							break;

						case isElementClicked(thisTarget, '#addToWishlistButton', 'pds_wishlist'):
							break;

						case isElementClicked(thisTarget, '.js-jump-complete-look', 'pds_jumpctl'):
							break;

						case isElementClicked(thisTarget, '.pds__imageAndCockpitWrapper .carousel-nav .carousel-cell', 'pds_thumbnails'):
							break;

						case isElementClicked(thisTarget, '[href="/de/groessenberatung"]', 'pds_masstabelle'):
							break;

						case isElementClicked(thisTarget, '.certificateTextWrapper a', 'pds_certificate'):
							break;
					}
				});
			}
		});

		// Zoom hover
		_self.elem('.pds__imageAndCockpitWrapper > div:first-child > .main-carousel', function(mainImgWrapper){
			if(mainImgWrapper){
				mainImgWrapper = mainImgWrapper[0];

				var isMouseOver = false,
					mouseE = function() {
						isMouseOver = true;
						setTimeout(function(){
							if(isMouseOver){
								goalPush('pds_zoomhover');
	
								mainImgWrapper.removeEventListener('mouseenter', mouseE);
								mainImgWrapper.removeEventListener('mouseleave', mouseL);
							}
						}, 3000);
					},
					mouseL = function() {
						isMouseOver = false;
					};

				mainImgWrapper.addEventListener('mouseenter', mouseE);
				mainImgWrapper.addEventListener('mouseleave', mouseL);
			}
		});


		// Menge verändert
		_self.elem('#desc__amount', function(amount){
			if(amount){
				amount[0].addEventListener('change', function(){
					goalPush('pds_changeamount');
				});
			}
		});

		// Ein Element aus CompleteTheLook oder Reco wird dem Warenkorb hinzugefügt
		var url = window.document.location,
			isFromCTL = url.search.indexOf("crossID=") !== -1,
			isFromReco = url.search.indexOf("emcs0=91_ARP_Produktdetailseite_DE") !== -1;
		
		if(isFromCTL || isFromReco){
			_self.ajax("https://www.hessnatur.com/de/cart/add", function() {
				if(isFromCTL){
					window.iridion.push(["segment", ""]);
					goalPush('pds_addCtlProductToCart');
				}
				if(isFromReco){
					window.iridion.push(["segment", ""]);
					goalPush('pds_addRecoProductToCart');
				}
			});
		}
	}
})(window.WATO);