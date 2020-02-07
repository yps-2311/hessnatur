// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Lukas Dziambor
 * @namespace 100% for Sprint8
 * @name 100% for Sprint8
 * @description
 * Save Category of product added to cart on PDP 
 * Hide early + activate Sprint 8 on cart 
 */
(function(WATO) {
    "use strict";

    if(document.URL.indexOf('/p/') !== -1) {
        // Productpage
        WATO.ajax('cart/add', function(){
            try {
                var _ls = JSON.parse(localStorage.getItem('kk_cats') || '{}'),
                _group = window.emosSelectVariantEventPrototype.group.split('/')[0],
                _thisGroup = _ls[_group];
    
                console.log(_group);
    
                if(!_thisGroup) {
                    _thisGroup = 1;
                }
                else {
                    _thisGroup++;
                }
    
                _ls[_group] = _thisGroup;
    
                localStorage.setItem('kk_cats', JSON.stringify(_ls));
            }
            catch(e) {}
        });
    }
    else {
        // Cart
        document.head.insertAdjacentHTML('beforeend','<style id="kk_hide">html{opacity: 0 !important}</style>');
        var kk_hide = WATO.qs('#kk_hide');

        // find bottom CTA so products a loaded
		WATO.elem('.h-mediumOffset-bottom-inner .button.success', function(bottomCTA) {
			if(bottomCTA) {
				var _products = WATO.qsa('.listing__table--item'), 
				_productCount = _products.length;
	
				// iterate all products and find savings
				for(var i=0; i < _productCount; i++) {
					var _thisProduct = _products[i],
					_oldPrice = WATO.qs('.strikeValue', _thisProduct);
	
					if(_oldPrice) {
                        // active Test
                        window.iridion.push(['run', '939393152827']);
                        
                        break;
					}
                }
                
                kk_hide.innerHTML = '';
			}
        });
        
        setTimeout(function(){
            kk_hide.innerHTML = '';
        }, 5000);
    }

})(new window.WATO());
