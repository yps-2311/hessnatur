// load core and global js
// @codekit-prepend '../global/global.js';

/**
 * @function
 * @author Nguyet Dang
 * @namespace C
 * @name Control
 * @description
 */
(function (WATO, _w) {
    'use strict';



    WATO.elem('.js-pds-more-details', function (moreDetails) {
        if (moreDetails) {
            moreDetails[0].addEventListener('click', function () {
                _w.iridion = _w.iridion || [];
                _w.iridion.push(['goal', 'kk07_click_more_details']);
            });
        }
    });



})(new window.WATO(), window);
