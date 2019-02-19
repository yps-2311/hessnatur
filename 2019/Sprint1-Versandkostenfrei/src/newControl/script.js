// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    if(window.location.pathname.indexOf("/p/") !== -1){
        // klick auf versandkostenlayer
        WATO.elem('.h-nowrap .js-reveal-ajax', function(element){
            if(element){
                element[0].addEventListener('click', function(){
                    window.iridion.push(['goal', "klick_versandkostenlayer"]);

                });
            }
        });
    }

})(new window.WATO());