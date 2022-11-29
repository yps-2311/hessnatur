// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Jonas Hoeppe
 * @namespace V1
 * @name Variation 01
 * @description
 */
 (function(WATO) {
    "use strict";

    window.iridion.econda.push(["AB38", "V1"]);

    WATO.s38_GOALS();

    WATO.elem('body', function(body){
        if(body){
            body[0].classList.add('kk_ab38_scope');
        }
    });
    

})(new window.WATO());
