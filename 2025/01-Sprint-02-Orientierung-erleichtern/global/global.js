/*
 * !LOAD KEK OBJECT
 * @codekit-prepend "../vendor/KEK.js";
 * @prepros-prepend "../vendor/KEK.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
 * @function
 * @author Andreas Hartung
 * @namespace G
 * @name Global
 * @description
 */
(function(KEK) {
    "use strict";

    // KEK.prototype.KamPo = Kameleoon.API.Core.runWhenElementPresent;
    
    // const pushGoal = (goalID) => {
    //     if (window.Kameleoon && window.Kameleoon.API && window.Kameleoon?.API?.Goals) {
    //         window.Kameleoon.API.Goals.processConversion(goalID);
    //     }
    // }
    

    KEK.prototype.S02Excluded = function(){

        const KEK = this;

        const cookieVal = "kk_S02_exlude";

        if(KEK.cookieGet(cookieVal) === "true"){
            return true;
        }

        KEK.exclude(1100, () => {
            
            KEK.cookieSet(cookieVal, "true", "www.hessnatur.com");
            KEK.reload();
        });

        return false;
    };
	
})(window.KEK);
