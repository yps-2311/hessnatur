/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	WATO.prototype.messtestCart = function(){
		var _self = this;

		function goalPush(key, sendOnNextPageView){
			if(sendOnNextPageView){
				window.iridion.push(['goal', key, '', true]);
			}else{
				window.iridion.push(['goal', key]);
			}
		}

		_self.elem('#item__orderno', function(inputArtNo){
			if(inputArtNo){
				inputArtNo[0].addEventListener('click', function(){
					goalPush("click_articleNoField");
				});
			}
		});

		_self.elem('#hessnaturQuickAddForm', function(quickaddButton){
			if(quickaddButton){
				quickaddButton[0].addEventListener('submit', function(){
					goalPush("click_articleNoButton", true);
				});
			}
		});

		_self.elem('.footerWrapper', function(footerWrapper){
			if(footerWrapper){
				_self.elem('.js-entry-edit', function(editLink){
					if(editLink){
						for (var i = 0; i < editLink.length; i++) {
							editLink[i].addEventListener('click', function(){
								goalPush("click_productEditLink");
							});
						}
					}
				});
			}
		});

		_self.elem('#errorModal .h-smallOffset-bottom-inner', function(errorMsg){
			if(errorMsg){
				if(errorMsg[0].textContent.indexOf("Das Produkt wurde nicht gefunden!") !== -1){
					goalPush("fehlermeldung_flasche_eingabe");
				}
			}
		});
	};
	
})(window.WATO);

