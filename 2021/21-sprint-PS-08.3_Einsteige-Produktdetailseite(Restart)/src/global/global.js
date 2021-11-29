/** !LOAD WATO OBJECT*/
//@prepros-prepend  "../vendor/WATO.js";


(function (WATO) {
    "use strict";

    WATO.prototype.ps8_3 = function() {
        if (document.referrer.indexOf('https://www.hessnatur.com') === -1){
            window.iridion.push(["segment", '32909']);
            console.log('PS08.2- Nutzer von außerhalb auf die Seite einsteigt');
        }
    }

})(window.WATO);

