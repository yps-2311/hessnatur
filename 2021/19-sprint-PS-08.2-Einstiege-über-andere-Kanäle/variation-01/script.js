// load core and global js
//@prepros-prepend  "../global/global.js";

/**
 * @function
 * @author FH
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    document.documentElement.classList.add('kk-ps08-2');

    if(window.innerWidth >540) {
        WATO.elem('.js-badges-container .pds-cockpit__ratingSummaryWrapper', function (pdsCockpit) {
            if (pdsCockpit) {

                pdsCockpit = pdsCockpit[0];

                var badgesContainer =  WATO.qs('.js-badges-container');

                var newbadgesContainer =document.createElement('div');

                newbadgesContainer.classList.add('kk-badges-container');
                newbadgesContainer.classList.add('column');



                badgesContainer.parentElement.insertBefore(newbadgesContainer,badgesContainer);
                badgesContainer.classList.remove('column');
                badgesContainer.insertAdjacentHTML('beforeend', '<span class="kk-nachhaltig">Nachhaltig</span>');

                newbadgesContainer.appendChild(badgesContainer);
                newbadgesContainer.insertBefore(pdsCockpit, badgesContainer);



            }
        })
    } else {
        WATO.elem('.js-badges-container', function (badgesContainer) {
            if (badgesContainer){
                badgesContainer = badgesContainer[0];
                badgesContainer.insertAdjacentHTML('beforeend', '<span class="kk-nachhaltig">Nachhaltig</span>');
                var rowContainer = badgesContainer.parentElement;
                if(!!rowContainer.classList.contains('align-middle')){
                    rowContainer.classList.remove('align-middle');
                }
            }
        })
    }

    WATO.ps802();

})(new window.WATO());
