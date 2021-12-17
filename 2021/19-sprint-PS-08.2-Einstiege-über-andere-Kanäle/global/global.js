/** !LOAD WATO OBJECT*/
//@prepros-prepend  "../vendor/WATO.js";


(function (WATO) {
    "use strict";

    WATO.prototype.ps802 = function() {
        if (document.referrer.indexOf('https://www.hessnatur.com') === -1){
            window.iridion.push(["segment", '32911']);
        }
    }

})(window.WATO);

