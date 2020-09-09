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
        excludedProducts = ['4782699', '4782600', '4783599', '4782200', '4782400', '4782800', '4782899', '4783500', '4783700', '4783799'],
        id = document.URL.match(/de\/.*\/p\/(\d+)/)[1];

    if (excludedProducts.indexOf(id) === -1) {
        if (eco_data[id] && new Date().getTime() - eco_data[id].timestamp < 86400000) {
            window.kk07_ecoData = eco_data[id];
            window.iridion.push(['run', '945287385013']);
            window.iridion.push(['run', '975787791526']);
        } else {
            WATO.xhr_get('https://products.hessnatur.com/products/' + id, function (data) {
                if (data) {
                    var ecoData = data.products[0].ecological_data;
                    if (ecoData) {
                        if (ecoData.water_savings_in_liter &&
                            ecoData.carbon_dioxide_savings_in_gram &&
                            ecoData.clean_earth_consumption_in_square_meter) {
                            window.kk07_ecoData = eco_data[id] = Object.assign(ecoData, { timestamp: new Date().getTime() });
                            window.localStorage.setItem('kk_ecological', JSON.stringify(eco_data));
                            window.iridion.push(['run', '945287385013']);
                            window.iridion.push(['run', '975787791526']);
                        }
                    }
                }
            });
        }
    }



})(new window.WATO());
