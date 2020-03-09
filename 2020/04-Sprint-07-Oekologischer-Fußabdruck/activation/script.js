// load core and global js
// @codekit-prepend '../global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    'use strict';



    WATO.xhr_get('https://products.hessnatur.com/products/' + document.URL.match(/de\/.*\/p\/(\d+)/)[1], function (data) {
        if (data) {

            var ecoData = data.products[0].ecological_data;
            if (ecoData) {
                if (ecoData.water_savings_in_liter &&
                    ecoData.carbon_dioxide_savings_in_gram &&
                    ecoData.clean_earth_consumption_in_square_meter) {
                    window.kk07_ecoData = ecoData;
                    window.iridion.push(['run', '942344586200']);
                }
            }
        }
    });



})(new window.WATO());
