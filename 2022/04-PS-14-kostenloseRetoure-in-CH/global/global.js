/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO) {
    "use strict";

	if(location.pathname === '/ch/cart'){

		WATO.elem('.footerWrapper', function(element){
			if(element){
				var price = WATO.qsa('strong.price');
				for (var i = 0; i < price.length; i++) {
					if(price[i].previousElementSibling.textContent.indexOf("Gesamtsumme") !== -1){
						window.iridion.push(["goal", 'ps14_cart_completeprice', parseInt(price[i].textContent.replace("*","").replace(",","").replace("CHF","").split(".")[0])]);
					}
				}
				
				window.iridion.push(["goal", 'ps14_cart_countproducts', WATO.qsa('.cart__productname').length]);
			}
		});
	}

})(new window.WATO());