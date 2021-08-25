// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */

(function(WATO) {
    "use strict";

    try {
        window.iridion.econda.push(["SprintPS19-3", "V0"]);
    } catch (error) {
        // console.log('Error: ', error);
    }
	/*jshint loopfunc: true */

    WATO.elem('.js_backstopWrapper > .h-disp-block a[href*="berater"], .js_backstopWrapper > .h-disp-block a', function(berater){
        if(berater){
            berater[0].addEventListener('click', function(){
                window.iridion.push(['goal', 'ps19_beraterBannerClick', '', true]);
            });
        }
    });
})(new window.WATO());