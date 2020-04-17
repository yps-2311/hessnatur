// load core and global js
// @codekit-prepend '../global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO, _w) {
    'use strict';


    var windowHeight = (window.innerHeight || document.documentElement.clientHeight),
        windowWidth = (window.innerWidth || document.documentElement.clientWidth),
        ecoData;

    function formatNumber(num) {
        num = Math.round(num * 100) / 100;
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return num_parts.join(",");
    }


    // Check if user scrolled to Product Description
    // function checkScrollDepth() {
    //     var ecoWrapper = WATO.qs('#kk07_ecological').getBoundingClientRect(),
    //         vertInView = (ecoWrapper.top <= windowHeight) && ((ecoWrapper.top + ecoWrapper.height) >= 0),
    //         horInView = (ecoWrapper.left <= windowWidth) && ((ecoWrapper.left + ecoWrapper.width) >= 0);
    //     if (vertInView && horInView) {

    //         window.iridion.push(['goal', 'kk07_eco_seen']);

    //         window.removeEventListener('scroll', checkScrollDepth);
    //     }
    // }

    WATO.elem(function () {
        ecoData = _w.kk07_ecoData;
        return !!ecoData;
    }, function (run) {
        if (run) {

            var waterValue = ecoData.water_savings_in_liter,
                co2Value = ecoData.carbon_dioxide_savings_in_gram,
                earthValue = ecoData.clean_earth_consumption_in_square_meter;

            WATO.elem('.pds-cockpit__wrapper .align-justify', function (headerElem) {
                if (headerElem) {
                    headerElem[0].insertAdjacentHTML('afterend',
                        '<div class="row" id="kk07_header">' +
                        '<div class="column">' +
                        '<div class="kk07_headline">Ihre ökologische Ersparnis</div><span>bei der Herstellung dieses Artikels.</span>' +
                        '<ul>' +
                        '<li><span><i class="kk07_icon water"></i>Wasser</span> <strong>' + waterValue + '</strong> gefüllte Badewannen</li>' +
                        '<li><span><i class="kk07_icon co2"></i>CO2</span> <strong>' + co2Value + '</strong> Flüge (Frankfurt-Paris)</li>' +
                        '<li><span><i class="kk07_icon earth"></i>Erde</span> <strong>' + earthValue + '</strong> gefüllte Blumentöpfe</li>' +
                        '</ul>' +
                        '<a href="">mehr Infos</a>' +
                        '</div>' +
                        '</div>'
                    );
                }
            });


            WATO.elem('#kk07_ecological', function (ecoElem) {
                if (ecoElem) {
                    ecoElem[0].innerHTML =
                        '<div class="kk07_headline">Ihre ökologische Ersparnis</div>' +
                        '<div class="row">' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon water"></i>' +
                        '<strong>weniger Wasserverbrauch</strong>' +
                        '<span>= ' + waterValue + ' gefüllte Badewannen</span>' +
                        '</div>' +
                        '<p>Eine Badewanne fasst Ø 120l Wasser. Bei der Produktion dieses Kleidungsstücks wird im Vergleich zur herkömmlichen Herstellung die Wassermenge von ' + waterValue + ' gefüllten Badewannen eingespart. Sie sparen somit ' + (waterValue * 120) + 'l Wasser.</p>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon co2"></i>' +
                        '<strong>weniger CO2-Ausstoß</strong>' +
                        '<span>= ' + co2Value + ' Flüge (Frankfurt-Paris)</span>' +
                        '</div>' +
                        '<p>Ein Flug von Frankfurt nach Paris verbraucht 207kg CO2 pro Person. <br/>Bei der Herstellung dieses Produktes werden allein ' + (co2Value * 207) + ' CO2 eingespart. Das entspricht umgerechnet ' + co2Value + ' Flügen von Frankfurt nach Paris.</p>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon earth"></i>' +
                        '<strong>gesündere Erde</strong>' +
                        '<span>= ' + earthValue + ' gefüllte Blumentöpfe <br/>ohne Pestizide</span>' +
                        '</div>' +
                        '<p>Ein normaler Blumentopf fasst ca. 0,82 Liter Erde. Bei der Produktion dieses Kleidungsstücks werden umgerechnet ' + earthValue + ' gefüllte Blumentöpfe weniger als bei der herkömmlichen Produktion mit künstlichem Dünger & Pestiziden behandelt.</p>' +
                        '</div>' +
                        '</div>';
                    ecoElem[0].style.opacity = '1';
                }
            });
            // window.addEventListener('scroll', checkScrollDepth);

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


})(new window.WATO(), window);
