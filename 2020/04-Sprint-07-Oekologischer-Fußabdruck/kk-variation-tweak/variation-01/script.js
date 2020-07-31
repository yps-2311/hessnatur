// load core and global js
// @ codekit-prepend '../global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO, _w) {
    'use strict';

    function pushGoal(goal) {
        _w.iridion = _w.iridion || [];
        _w.iridion.push(['goal', goal]);
    }

    if (document.URL.indexOf('/p/') !== -1) {
        WATO.KK_AB07_PDS();
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
