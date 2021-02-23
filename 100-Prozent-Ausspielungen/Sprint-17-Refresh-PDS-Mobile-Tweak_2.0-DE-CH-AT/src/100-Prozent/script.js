// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */


(function(WATO) {
    "use strict";

    
    // window.iridion.econda.push(["Sprint17mobtw2", "V2"]);


    // WATO.sprint17goals(1);
    WATO.sprint17(1);

    WATO.elem('.pds-cockpit__wrapper ', function(cockpitWrapper){
        if(cockpitWrapper){
            cockpitWrapper = cockpitWrapper[0];
            
            var mainWrapper = WATO.qs(".js_backstopWrapper"),
                artNumber = WATO.qs(".pds-cockpit__articleNumber", cockpitWrapper),
                ratingSummary = WATO.qs(".pds-cockpit__ratingSummaryWrapper");

            if(ratingSummary){
                artNumber.insertAdjacentElement('afterend', ratingSummary);
            }

            mainWrapper.insertAdjacentElement('afterbegin', WATO.qs(".pds-cockpit__productName", cockpitWrapper).parentNode.parentNode);
            mainWrapper.insertAdjacentElement('afterbegin', artNumber.parentNode);
        }
    });

    WATO.elem('.pds-cockpit__wrapper', function(cockpitWrapper){
        if(cockpitWrapper){
            cockpitWrapper = cockpitWrapper[0];
            WATO.qs(".show-for-large", cockpitWrapper).insertAdjacentElement('afterend', WATO.qs(".align-justify", cockpitWrapper));
        }
    });
    

})(new window.WATO());
