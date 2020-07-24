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

    var waterValue = 0,
        earthValue = 0;

    function showEcoInfo(productInfo, qty) {
        waterValue += productInfo[0] * qty;
        earthValue += productInfo[1] * qty;

        WATO.qs('.kk_summary > div').innerHTML = WATO.KK_AB07_BOX([waterValue, earthValue]).markup;
    }

    function pushGoal(goal) {
        _w.iridion = _w.iridion || [];
        _w.iridion.push(['goal', goal]);
    }

    WATO.KK_AB07_PDS();

    if (document.URL.indexOf('/cart') !== -1) {

        var productInfo = JSON.parse(window.localStorage.getItem('kk_eco_products')) || {};

        WATO.elem('.column.yCmsContentSlot', function (summaryRow) {
            if (summaryRow) {
                summaryRow = summaryRow[0];
                var summaryParent = summaryRow.parentNode;
                summaryParent.classList.add('kk_summary');
                summaryParent.nextElementSibling.nextElementSibling.classList.add('kk_old_totals');

                Array.prototype.forEach.call(WATO.qsa('.cart__productname'), function (productName) {
                    var id = productName.href.match(/de\/.*\/p\/(\d+)/)[1],
                        qty = parseInt(WATO.qs('.qty', productName.parentNode.parentNode.parentNode).value);

                    if (productInfo[id]) {
                        showEcoInfo(productInfo[id], qty);
                    }
                });

                WATO.qs('.kk07_header').addEventListener('click', function () {
                    pushGoal('kk07_click_element_wk');
                });

                WATO.elem('.offset-price-left', function (totals) {
                    if (totals) {
                        var totalWrapper = summaryParent.lastElementChild;
                        totals[1].parentNode.parentNode.classList.add('h-xsmallOffset-bottom-outer');
                        totalWrapper.insertAdjacentElement('beforeend', totals[1].parentNode.parentNode);
                        totalWrapper.insertAdjacentElement('beforeend', totals[2].parentNode.parentNode);

                        WATO.qs('#hessnaturVoucherForm .quickadd_button').addEventListener('click', function () {
                            pushGoal('kk07_click_voucher_btn');
                        });

                        WATO.qs('#item__voucherno').addEventListener('click', function () {
                            pushGoal('kk07_click_voucher_input');
                        });
                    }
                });

                WATO.elem('#kk_upsell_wrapper', function (upsell) {
                    if (upsell) {
                        upsell[0].insertAdjacentElement('afterend', summaryParent);
                    }
                });
            }
        });


    }

})(new window.WATO(), window);
