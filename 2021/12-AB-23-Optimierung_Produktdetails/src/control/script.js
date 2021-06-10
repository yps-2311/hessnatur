
// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V0
 * @name Control
 * @description
 */
 (function(WATO) {
    "use strict";

    // window.iridion.econda.push(["SprintAB23", "V0"]);

    // var fakeClick = false,
    var pushGoal = function(key) {
            window.iridion.push(['goal', key]);
        };

    WATO.elem('#infoTabs div', function(accordionTitle){

        if(accordionTitle){

            for(var i = 0; i < accordionTitle.length; i++){

                accordionTitle[i].addEventListener('click', function(){
                    pushGoal('kk_ab23_click_tab');
                    pushGoal('kk_ab23_click_tab_' + this.getAttribute('data') + '-label');
                });
            }
        }
    });

})(new window.WATO());
