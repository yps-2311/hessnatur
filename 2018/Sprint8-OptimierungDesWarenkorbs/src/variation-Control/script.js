// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO, window) {
    "use strict";

    window.onresize = function() {
    
        // Punchout
        var current = window.innerWidth || document.body.clientWidth;
        if(current <= 1024){                            
            window.location.reload(true);
            window.location.href = window.location.href;
        }
    };

    WATO.elem('#toggleModel', function(toggleModel){
        if(toggleModel){
            toggleModel[0].addEventListener("click", function(){
                // Goal: Ansicht genutzt
                WATO.goalPush("useProductView", true);
            });
        }
    });

    WATO.goals();



})(new window.WATO(), window);
