// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
 (function(WATO) {
    "use strict";

    // window.iridion.econda.push(["AB26", "V1"]);

    WATO.ab26global();

    WATO.elem('[data-componentid="CrossSellingEconda"]', function(crossSellingEconda){
        if(crossSellingEconda){
            crossSellingEconda = crossSellingEconda[0].parentNode;
            
            var qualiBadges = WATO.qs('.medium-uncollapse > .kk_quali'),
                productInfos = WATO.qs('.medium-uncollapse > .small-12');

            if(qualiBadges){
                qualiBadges.insertAdjacentElement('afterend', crossSellingEconda);
            }else if(productInfos){
                productInfos.insertAdjacentElement('beforebegin', crossSellingEconda);
            }

        }
    });

    // Eventuell mit clonen und einfügen, anstatt verschieben versuchen
    //cloneNode()

})(new window.WATO());