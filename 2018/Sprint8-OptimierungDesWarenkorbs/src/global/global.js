/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	WATO.prototype.goalPush = function(key, sendOnNextPageView){
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
		console.log('goalPush: ', key);
	};

	WATO.prototype.globalCode = function(){
		// Punchout
		this.exclude("1024", function(){
			window.location.reload();
			window.location.href = window.location.href;
		});

		try {

			var _self = this;
			
			// Weiter Stöbern Button unten links geklick
			_self.elem('.medium-order-1 .expanded-small-only', function(continueShopping){
				if(continueShopping){
					continueShopping[0].addEventListener('click', function(){
						_self.goalPush("continueShopping", true);
					});
				}
			});

			// Wenn ein Gutschein eingelösst ist, nur dann ist dieses Objekt vorhanden und das Goal kann gesendet werden
			_self.elem('.shrink .price.discountPrice', function(redeemedVouchers){
				if(redeemedVouchers){
					_self.goalPush("useVoucher");
				}
			});

			// Artikel wurde per Artikelnummer rechts oben in den WK hinzugefügt.
			// Anhand des Textes im Infolayer wird ermittelt ob dies nach einem Reload passiert ist.
			_self.elem('#informationModal .h-smallOffset-bottom-inner', function(informationModal){
				if(informationModal){
					if(informationModal[0].textContent.indexOf("Der Artikel wurde zum Warenkorb hinzugefügt") !== -1){
						_self.goalPush("enterArticle");
					}
				}
			});

		} catch (error) {
			// console.log(error);
			_self.goalPush("catchMonitoring");
		}
	};	
})(window.WATO);

