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


    var ecoData, waterValue,
        co2Value,
        earthValue,
        s3 = 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/AB07-KK/';

    function pushGoal(goal) {
        _w.iridion = _w.iridion || [];
        _w.iridion.push(['goal', goal]);
    }

    function getStyledValue(value, styled) {
        return !styled ? value : '<strong>' + value + '</strong>';
    }

    function getValueText(type, styled) {
        switch (type) {
            case 0: return getStyledValue(waterValue, styled) + ' gefüllte Badewanne' + (waterValue > 1 ? 'n' : '');
            case 1: return getStyledValue(co2Value, styled) + ' ' + (co2Value > 1 ? 'Flüge' : 'Flug') + ' (Frankfurt-Paris)';
            case 2: return getStyledValue(earthValue, styled) + ' ' + (earthValue > 1 ? 'gefüllte Blumentöpfe' : 'gefüllter Blumentopf');
        }
    }

    document.documentElement.classList.add('kk07A');

    WATO.elem(function () {
        ecoData = _w.kk07_ecoData;
        return !!ecoData;
    }, function (run) {
        if (run) {
            waterValue = Math.round(ecoData.water_savings_in_liter / 120);
            co2Value = Math.round(ecoData.carbon_dioxide_savings_in_gram / 207);
            earthValue = Math.round(ecoData.clean_earth_consumption_in_square_meter / 0.82);


            WATO.elem('.pds-cockpit__wrapper .align-justify', function (headerElem) {
                if (headerElem) {
                    headerElem[0].insertAdjacentHTML('afterend',
                        '<div class="row" id="kk07_header">' +
                        '<div class="column">' +
                        '<div>' +
                        '<div class="kk07_headline">Ihre ökologische Ersparnis</div><span>bei der Herstellung dieses Artikels.</span>' +
                        '<ul>' +
                        '<li><span><i class="kk07_icon water"></i>Wasser</span> ' + getValueText(0, true) + '</li>' +
                        '<li><span><i class="kk07_icon co2"></i>CO2</span> ' + getValueText(1, true) + '</li>' +
                        '<li><span><i class="kk07_icon earth"></i>Erde</span> ' + getValueText(2, true) + '</li>' +
                        '</ul>' +
                        '<a href="#kk07_ecological">mehr Infos</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );

                    WATO.qs('#kk07_header a').addEventListener('click', function (e) {
                        e.preventDefault();
                        pushGoal('kk07_click_more_info');
                        jQuery("html, body").animate({ scrollTop: jQuery('#kk07_ecological').offset().top - 75 });
                    });

                    WATO.qs('.js-pds-more-details').addEventListener('click', function () {
                        pushGoal('kk07_click_more_details');
                    });
                }
            });


            WATO.elem('#kk07_ecological', function (ecoElem) {
                if (ecoElem) {
                    ecoElem[0].innerHTML =
                        '<div class="kk07_headline">Ihre ökologische Ersparnis</div>' +
                        '<div class="row">' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<img src="' + s3 + 'wasser.png" alt="Ökologische Ersparnis - Weniger Wasserverbrauch">' +
                        '<div>' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon water"></i>' +
                        '<strong>weniger Wasserverbrauch</strong>' +
                        '<span>= ' + getValueText(0, false) + '</span>' +
                        '</div>' +
                        '<p>Eine Badewanne fasst Ø 120l Wasser. Bei der Produktion dieses Kleidungsstücks wird im Vergleich zur herkömmlichen Herstellung die Wassermenge von ' + getValueText(0, false) + ' eingespart. Sie sparen somit ' + (waterValue * 120) + 'l Wasser.</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<img src="' + s3 + 'co2.png" alt="Ökologische Ersparnis - Weniger CO2-Ausstoß">' +
                        '<div>' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon co2"></i>' +
                        '<strong>weniger CO2-Ausstoß</strong>' +
                        '<span>= ' + getValueText(1, false) + '</span>' +
                        '</div>' +
                        '<p>Ein Flug von Frankfurt nach Paris verbraucht 207 kg CO2 pro Person. <br/>Bei der Herstellung dieses Produktes werden allein ' + (co2Value * 207) + ' kg CO2 eingespart. Das entspricht umgerechnet ' + co2Value + ' ' + (co2Value > 1 ? 'Flügen' : 'Flug') + ' von Frankfurt nach Paris.</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<img src="' + s3 + 'erde.png" alt="Ökologische Ersparnis - Gesündere Erde">' +
                        '<div>' +
                        '<div class="kk07_head">' +
                        '<i class="kk07_icon earth"></i>' +
                        '<strong>gesündere Erde</strong>' +
                        '<span>= ' + getValueText(2, false) + ' <br/>ohne Pestizide</span>' +
                        '</div>' +
                        '<p>Ein normaler Blumentopf fasst ca. 0,82 Liter Erde. Bei der Produktion dieses Kleidungsstücks werden umgerechnet ' + getValueText(2, false) + ' weniger mit künstlichem Dünger & Pestiziden behandelt als bei der herkömmlichen Produktion.</p>' +
                        '</div>' +
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
