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


    var windowHeight = (window.innerHeight || document.documentElement.clientHeight),
        windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    function formatNumber(num) {
        num = Math.round(num * 100) / 100;
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return num_parts.join(",");
    }


    // Check if user scrolled to Product Description
    function checkScrollDepth() {
        var ecoWrapper = WATO.qs('#kk07_ecological').getBoundingClientRect(),
            vertInView = (ecoWrapper.top <= windowHeight) && ((ecoWrapper.top + ecoWrapper.height) >= 0),
            horInView = (ecoWrapper.left <= windowWidth) && ((ecoWrapper.left + ecoWrapper.width) >= 0);
        if (vertInView && horInView) {

            window.iridion.push(['goal', 'kk07_eco_seen']);

            window.removeEventListener('scroll', checkScrollDepth);
        }
    }

    WATO.elem(function () {
        return WATO.qs('.js-product-info .large-10') && !!window.kk07_ecoData;
    }, function (run) {
        if (run) {

            WATO.qs('.js-product-info .large-10').insertAdjacentHTML('afterend',
                '<div class="column small-12" id="kk07_ecological">' +
                '<div class="h3">Wir haben dieses Produkt nachhaltig für Sie <br/>produziert. Sparen Sie mit Ihrem Kauf:</div>' +
                '<div class="row">' +
                '<div class="column large-4 kk07_eco__point">' +
                '<div class="kk07_eco__icon water"></div>' +
                '<div class="kk07_eco__amount"><span data-property="water_savings_in_liter">' + formatNumber(window.kk07_ecoData.water_savings_in_liter) + '</span> l</div>' +
                '<strong>Wasser*</strong>' +
                '<span>Wir setzen durchweg auf wassersparende und -schonende Verfahren.</span>' +
                '</div>' +
                '<div class="column large-4 kk07_eco__point">' +
                '<div class="kk07_eco__icon co2"></div>' +
                '<div class="kk07_eco__amount"><span data-property="carbon_dioxide_savings_in_gram">' + formatNumber(window.kk07_ecoData.carbon_dioxide_savings_in_gram) + '</span> kg</div>' +
                '<strong>CO2*</strong>' +
                '<span>Wir nutzen so wenig Strom wie möglich und nur aus nachhaltigen Energiequellen.</span>' +
                '</div>' +
                '<div class="column large-4 kk07_eco__point">' +
                '<div class="kk07_eco__icon earth"></div>' +
                '<div class="kk07_eco__amount"><span data-property="clean_earth_in_square_meter">' + formatNumber(window.kk07_ecoData.clean_earth_consumption_in_square_meter) + '</span> m<sup>2</sup></div>' +
                '<strong>Boden/Erde*</strong>' +
                '<span>Wir verwenden ausschließlich Rohstoffe aus ökologischer Landwirtschaft.</span>' +
                '</div>' +
                '</div>' +
                '<div class="kk07_eco__footer">' +
                // '<a href="#">Mehr erfahren</a> ' +
                '<small>*im Vergleich zur konventionellen Produktion</small></div>' +
                '</div>');

            window.addEventListener('scroll', checkScrollDepth);

        }
    });

    // WATO.elem('#desc__size', function (sizes) {
    //     if (sizes) {
    //         sizes[0].addEventListener('change', function () {

    //             WATO.xhr_get('https://products-approval.hessnatur.com/products/' + WATO.qs('[name="productCodePost"]').value.substring(0, 7), function (data) {
    //                 if (data) {
    //                     var ecoData = data.products[0].ecological_data;
    //                     if (ecoData) {
    //                         var ecoDataWrappers = WATO.qsa('#kk07_ecological .kk07_eco__amount span');
    //                         for (var i = 0; i < 3; i++) {
    //                             ecoDataWrappers[i].innerHTML = formatNumber(ecoData[ecoDataWrappers[i].getAttribute('data-property')]);
    //                         }
    //                     }
    //                 }
    //             });
    //         });
    //     }
    // });


})(new window.WATO());
