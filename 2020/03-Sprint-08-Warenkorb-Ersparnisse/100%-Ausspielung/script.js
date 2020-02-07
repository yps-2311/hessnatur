// load core and global js
// @ codekit-prepend "../global/global.js";

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

        var kk_pi_cat = false,
        getCat = function(so_id){
            var ret = '';
            switch(so_id) {
                case "SO-001":
                case "SO-015":
                case "SO-018":
                case "SO-020":
                case "SO-021":
                case "SO-030":
                case "SO-040":
                        ret = 'damen';
                    break;

                case "SO-002":
                case "SO-008":
                case "SO-016":
                case "SO-031":
                case "SO-041":
                        ret = 'herren';
                    break;

                case "SO-004":
                case "SO-032":
                case "SO-042":
                        ret = 'kids';
                    break;

                case "SO-005":
                        ret = 'baby';
                    break;

                case "SO-007":
                        ret = 'home';
                    break;
            }
            return ret;
        };



        WATO.elem(function(){
            try {
                kk_pi_cat = window.pi.category_id;
                return !!kk_pi_cat;
            }
            catch(e) {}
            return false;
        }, function(pi_found){
            if(pi_found) {
                console.log('kk_pi_cat: '+kk_pi_cat);
            }
        });

        WATO.ajax('cart/add', function(){
            try {
                var _ls = JSON.parse(localStorage.getItem('kk_cats') || '{}'),
                // _group = window.emosSelectVariantEventPrototype.group.split('/')[0],
                _group = getCat(kk_pi_cat),
                _thisGroup = _ls[_group];
                
                console.log(_group);
                if(_group !== '') {
                    if(!_thisGroup) {
                        _thisGroup = 1;
                    }
                    else {
                        _thisGroup++;
                    }
        
                    _ls[_group] = _thisGroup;
        
                    localStorage.setItem('kk_cats', JSON.stringify(_ls));
                }
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
