// load core and global js
// @codekit-prepend './vendor/WATO.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO, _w) {
    'use strict';

    var docURL = document.URL;

    if (docURL.indexOf('/p/') !== -1) {
        WATO.elem(function () {
            return !!_w.kk07_ecoData;
        }, function (run) {
            if (run) {
                window.iridion.push(['run', '969446889188']);
            }
        });
    } else {
        var productInfo = JSON.parse(window.localStorage.getItem('kk_eco_products')) || {};

        WATO.elem('.column.yCmsContentSlot', function (summaryRow) {
            if (summaryRow) {
                summaryRow = summaryRow[0];
                var productNames = WATO.qsa('.cart__productname'),
                    found = false;

                for (var i = 0; i < productNames.length; i++) {
                    if (found) { break; }
                    var id = productNames[i].href.match(/de\/.*\/p\/(\d+)/)[1];

                    if (productInfo[id]) {
                        window.iridion.push(['run', '969446889188']);
                        break;
                    } else {
                        WATO.xhr_get('https://products.hessnatur.com/products/' + id, function (data) {
                            try {
                                if (data) {
                                    var ecoData = data.products[0].ecological_data;
                                    if (ecoData && !found) {
                                        if (ecoData.water_savings_in_liter &&
                                            ecoData.clean_earth_consumption_in_square_meter) {

                                            productInfo[data.products[0].sku] = [ecoData.water_savings_in_liter, ecoData.clean_earth_consumption_in_square_meter];
                                            window.localStorage.setItem('kk_eco_products', JSON.stringify(productInfo));
                                            found = true;
                                            window.iridion.push(['run', '969446889188']);
                                        } else {
                                            productInfo[data.products[0].sku] = 'NO_API_DATA';
                                            window.localStorage.setItem('kk_eco_products', JSON.stringify(productInfo));
                                        }
                                    }
                                }
                            } catch (e) { console.log(e); }
                        });
                    }
                }
            }

        });
    }
})(new window.WATO(), window);
