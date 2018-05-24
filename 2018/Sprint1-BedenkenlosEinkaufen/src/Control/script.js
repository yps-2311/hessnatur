// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO, window) {
    "use strict";
    
    function kickout(breite){
		if(window.innerWidth < breite){
            addClass(window.document.body, "wa_punchout");
		}else{
            removeClass(window.document.body, "wa_punchout");
        }
    }
    
    var uri = window.document.location.pathname;
    
    try {

        window.addEventListener("resize", function(){
            kickout(1024);
        }, false);
        kickout(1024);

        if(uri.indexOf("/de/cart") !== -1 || uri.indexOf("/p/") !== -1){
            WATO.globalGoals(0);
        }
        
    } catch (error) {
        console.log(error);
    }
})(new window.WATO(), window);
