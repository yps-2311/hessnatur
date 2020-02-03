// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

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

})(new window.WATO());
