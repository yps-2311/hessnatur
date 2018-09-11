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

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }

     WATO.elem("a[data-open=availability-matrix]", function (oAvailMatrix){

         if (oAvailMatrix) {
             oAvailMatrix[0].addEventListener("click", function(){
                 goalPush("s5_click_availability");
             });
         }
     });

    WATO.elem(".js-pds-more-details", function(a_showMore) {

        if (a_showMore) {
            a_showMore[0].addEventListener("click", function(){
                goalPush("s5_more_details");
            });
        }

    });

})(new window.WATO());
