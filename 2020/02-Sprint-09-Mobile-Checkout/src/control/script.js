// load core and global js
// @codekit-prepend "../global/global.js";
/*jshint loopfunc: true */
/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    console.log("KK: 2020 - Hessnatur - Sprint 09 - Control");
    WATO.AB09_goals();

    if (WATO.AB09_checkPATH("addresses/add-delivery-address")) {

        WATO.elem('#additional_address_trigger', function (addressTrigger) {
            if (addressTrigger) {
                addressTrigger[0].addEventListener('change', function () {
                    WATO.AB09_sendGoal('kk_ab09_click_delivery_checkbox');
                });
            }
        });
    }

})(new window.WATO());