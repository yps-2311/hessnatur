// load core and global js
// @ codekit-prepend '../global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace C
 * @name Control
 * @description
 */
(function (WATO, _w) {
    'use strict';


    function pushGoal(goal) {
        _w.iridion = _w.iridion || [];
        _w.iridion.push(['goal', goal]);
    }

    if (document.URL.indexOf('/p/') !== -1) {
        WATO.elem('.js-pds-more-details', function (moreDetails) {
            if (moreDetails) {
                moreDetails[0].addEventListener('click', function () {
                    pushGoal('kk07_click_more_details');
                });
            }
        });
    } else {

        WATO.elem('#hessnaturVoucherForm .quickadd__button', function (voucherBtn) {
            if (voucherBtn) {

                voucherBtn[0].addEventListener('click', function () {
                    pushGoal('kk07_click_voucher_btn');
                });

                WATO.qs('#item__voucherno').addEventListener('click', function () {
                    pushGoal('kk07_click_voucher_input');
                });
            }
        });
    }





})(new window.WATO(), window);
