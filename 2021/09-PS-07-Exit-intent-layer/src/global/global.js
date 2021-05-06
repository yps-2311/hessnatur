/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

// (function(WATO){
//     "use strict";

	/*jshint loopfunc: true */
	
	// WATO.prototype.goProfile = function(thisName, thisvalue) {
	// 	if(thisvalue){
	// 		window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
	// 	}else{
	// 		return window.iridion.push(['profile', 'getValue', thisName]);
	// 	}
	// };

	// WATO.prototype.ps03setSegment = function(){
	// 	var _self = this;

	// 	function doSomeSegment(id, key) {
	// 		if(!key){
	// 			window.iridion.push(["segment", id]);
	// 		}else if(key === 1 && window.iridion.push(['hasSegment', id])){
	// 			window.iridion.push(["removeSegment", id]);
	// 		}else if(key === 2){
	// 			return window.iridion.push(['hasSegment', id]);
	// 		}
	// 	}
	// 	try {
	// 		var variation = _self.goProfile('customerType') || "Interessent";

	// 		if(variation === "Interessent"){
	// 			// Interessent
	// 			if(!doSomeSegment("32862", 2)){
	// 				doSomeSegment("32862");
	// 			}
	// 		}else if(variation === "Neukunde"){
	// 			// Neukunde
	// 			if(!doSomeSegment("32863", 2)){
	// 				doSomeSegment("32862", 1);
	// 				doSomeSegment("32863");
	// 			}
	// 		}else if(variation === "Bestandskunde"){
	// 			// Bestandskunde
	// 			if(!doSomeSegment("32860", 2)){
	// 				doSomeSegment("32862", 1);
	// 				doSomeSegment("32863", 1);
	// 				doSomeSegment("32860");
	// 			}
	// 		}
			
	// 		switch (_self.goProfile('categoryAffinity')) {
	// 			case "herren":
	// 				if(!doSomeSegment("32865", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32865");
	// 				}
	// 				break;
	// 			case "baby":
	// 				if(!doSomeSegment("32866", 2)){
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32866");
	// 				}
	// 				break;
	// 			case "home":
	// 				if(!doSomeSegment("32867", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32864", 1);
	// 					doSomeSegment("32867");
	// 				}
	// 				break;
	// 			default: // damen
	// 				if(!doSomeSegment("32864", 2)){
	// 					doSomeSegment("32866", 1);
	// 					doSomeSegment("32867", 1);
	// 					doSomeSegment("32865", 1);
	// 					doSomeSegment("32864");
	// 				}
	// 				break;
	// 		}



	// 	} catch (error) {
	// 		// console.log('error: ', error);
	// 	}
	// };

	// WATO.prototype.ps03desktop = function(){
	// 	var _self = this,
	// 		UrlPathname = window.location.pathname;

	// 	function goalPush(key, sendOnNextPageView){
	// 		if(sendOnNextPageView){
	// 			window.iridion.push(['goal', key, '', true]);
	// 		}else{
	// 			window.iridion.push(['goal', key]);
	// 		}
	// 	}

	// 	_self.exclude(1023, function(){
	// 		_self.setCookie('kkps03desk_exclude', 'true', ".hessnatur.com", false);
	// 		_self.reload();
	// 	});

	// 	if(UrlPathname.indexOf("/c/neu-") === -1 && UrlPathname !== "/de/NEU"){
	// 		// Alle Kategorieseiten außer NEU und die NEU-LP
	// 		_self.elem('.footerWrapper', function(footerWrapper){
	// 			if(footerWrapper){
	// 				for (var k = 2; k < 8; k++) {
	// 					var produkte = _self.qs('.js-product-grid > .gridviewProductItemWrapper:nth-child('+k+')');
	// 					if(produkte){
	// 						// Goals der ersten 6 Produkte geklickt
	// 						produkte.addEventListener('click', function(){
	// 							goalPush("cat_prod_first6", true);
	// 						});
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
	// };
	
// })(window.WATO, window);