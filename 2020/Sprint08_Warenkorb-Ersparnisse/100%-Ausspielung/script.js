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

    }

    

})(new window.WATO());
