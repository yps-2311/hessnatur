// load core and global js
// @codekit-prepend './global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    'use strict';

    if (document.URL.indexOf('/p/') !== -1) {
        WATO.KK_AB07_PDS();
    }



})(new window.WATO());
