// load core and global js
// @codekit-prepend '../global/global.js';

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    'use strict';

    console.log('ÖKO!');


    var productId = document.URL.match(/de\/.*\/p\/(\d+)/)[1];


    WATO.xhr_get('https://products-approval.hessnatur.com/products/' + productId, function (data) {
        if (data) {
            console.log('success', data);
            var ecoData = data.products[0].ecological_data;
            if (ecoData) {
                WATO.elem('.js-product-info', function (productInfo) {
                    if (productInfo) {
                        productInfo[0].insertAdjacentHTML('beforeend',
                            '<div class="column small-12" id="kk09_ecological">' +
                            '<div class="h3">Wir haben dieses Produkt nachhaltig für Sie <br/>produziert. Sparen Sie mit Ihrem Kauf:</div>' +
                            '<div class="row">' +
                            '<div class="column large-4 kk09_eco__point">' +
                            '<div class="kk09_eco__amount">' + ecoData.water_savings_in_liter + ' l</div>' +
                            '<strong>Wasser*</strong>' +
                            '<span>Wir setzen durchweg auf wassersparende und -schonende Verfahren.</span>' +
                            '</div>' +
                            '<div class="column large-4 kk09_eco__point">' +
                            '<div class="kk09_eco__amount">' + ecoData.carbon_dioxide_savings_in_gram + ' kg</div>' +
                            '<strong>CO2*</strong>' +
                            '<span>Wir nutzen so wenig Strom wie möglich und nur aus nachhaltigen Energiequellen.</span>' +
                            '</div>' +
                            '<div class="column large-4 kk09_eco__point">' +
                            '<div class="kk09_eco__amount">' + ecoData.clean_earth_in_square_meter + ' m<sup>2</sup></div>' +
                            '<strong>Boden/Erde*</strong>' +
                            '<span>Wir verwenden ausschließlich Rohstoffe aus ökologischer Landwirtschaft.</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="kk09_eco__footer"><a href="#">Mehr erfahren</a><small>*im Vergleich zur konventionellen Produktion</small></div>' +
                            '</div>');
                    }
                });
            }
        } else {
            console.log('no products', data);
        }
    });




})(new window.WATO());
