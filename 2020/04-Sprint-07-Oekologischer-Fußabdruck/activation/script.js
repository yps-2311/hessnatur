// load core and global js
// @codekit-prepend './vendor/WATO.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    'use strict';

    var eco_data = JSON.parse(window.localStorage.getItem('kk_ecological')) || {},
        id = document.URL.match(/de\/.*\/p\/(\d+)/)[1];

    if (eco_data[id] && new Date().getTime() - eco_data[id].timestamp < 86400000) {
        window.kk07_ecoData = eco_data[id];
        window.iridion.push(['run', '945287385013']);
    } else {
        WATO.xhr_get('https://products.hessnatur.com/products/' + id, function (data) {
            if (data) {
                var ecoData = data.products[0].ecological_data;
                if (ecoData) {
                    if (ecoData.water_savings_in_liter &&
                        ecoData.carbon_dioxide_savings_in_gram &&
                        ecoData.clean_earth_consumption_in_square_meter) {
                        window.kk07_ecoData = eco_data[id] = Object.assign(ecoData, { timestamp: new Date().getTime() });
                        window.iridion.push(['run', '945287385013']);
                        // window.iridion.push(['run', '952572184314']);
                    }
                }
            }
        });
    }




})(new window.WATO());
