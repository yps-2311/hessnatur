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

    console.log('here');

    WATO.elem('.h-mediumOffset-bottom-inner .button.success', function(bottomCTA) {
        if(bottomCTA) {
            console.log(JSON.parse(localStorage.getItem('kk_cats')));
        }
    });

    // function requestXML(URL, data, callback){

    //     var params = typeof data === 'string' ? data : Object.keys(data).map(
    //       function(k){ 
    //         return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    //       }
    //     ).join('&');
      
    //     var request = new XMLHttpRequest();
      
    //     request.open("POST", URL , true);
    //     request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //     request.onload = function(){
    //       if (request.status >= 200 && request.status < 400 && request.responseText.length > 0) {
    //         callback(request);
    //       }
    //     };
    //     request.send(params);
    //   }
      
    //   requestXML("https://www.hessnatur.com/de/cart/add", { 
    //     productCodePost: '49865833130',
    //     ff_id: '49865833130',
    //     ff_masterId: '49865',
    //     ff_title: "Jeans Jasper Slim Fit aus Bio-Denim",
    //     ff_price: 129.95,
    //     qty: 1,
    //     CSRFToken: ACC.config.CSRFToken
    //   }, function(){
    //     // Wenn das Produkt dem WK hinzugefügt wurde wird die Seite neu geladen
    //   //  location.href=location.href.split('#')[0];
    //   //  location.reload();
    //   });

})(new window.WATO());
