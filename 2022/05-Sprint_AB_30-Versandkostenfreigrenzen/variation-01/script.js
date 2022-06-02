// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";
    console.log("v1");

    (async function init (){

        const location = window.location.pathname;

        function insertHTML (elem, place, value) {
            if(elem){
                elem.insertAdjacentHTML(place, value);
            }
        }

        function getPriceValue (elem) {
            if(elem){
                return parseFloat(elem.innerHTML.match(/\d+/g).join("."))
            }
        }

        if(location.includes('/p/')){
            
            try{

                let wrapper = await WATO.asyncElem('.kk_cta_uvps ul');
                wrapper = wrapper[0];

                console.log("wrapper", wrapper);

                insertHTML(wrapper, 'beforeend', 
                    '<li>Kostenloser Versand ab 100€</li>'
                );

            } catch(e){
                //push Error: Fail
            }
            
        } else if(location.includes('/cart')){

            
            try{

                let oldDeliv = await WATO.asyncElem('.column.small-12.text-right.h-text-muted.h-xsmallOffset-top-outer');
                oldDeliv = oldDeliv[0].parentElement;// identifier war sonst irgendwie unklar

                const currentValue = getPriceValue(WATO.qs('strong + strong.price.offset-price-left'));

                //negativ
                let redValue = `Nur noch ${ 100 - currentValue }€`;
                let redText = "und ihre Bestellung ist versandkostenfrei";
                let newValue = currentValue + 5.95;

                //positiv
                if(currentValue >= 100){
                    redValue = "Gute Nachricht!";
                    redText = "Ihre Bestellung ist versandkostenfrei";
                    newValue = 0;
                }


                console.log("currentValue", currentValue);

                insertHTML(oldDeliv, 'afterend', 
                `<div class="row align-right ${ newValue === 0 ? "kk_cW" : "" }">` +
                    '<div class="kk_dBox">' +
                        `<div class="kk05_svg ${ newValue === 0 ? "kk_check" : "" }"></div>` +
                        '<div><strong>' + redValue + '</strong><br>' + redText + '</div>' +
                    '</div>' +
                '</div>'
                );

                insertHTML(oldDeliv, 'beforebegin', 
                    '<div class="kk_redP small-12 text-right h-text-muted">' +
                        '<span>Versand (frei ab 100,00€)</span>' +
                        `<span class="price offset-price-left ${ newValue === 0 ? "kk_lt" : "" }">5,95 €*</span>` +
                    '</div>'
                );

                console.log("oldDeliv",oldDeliv)

            } catch(e){
                //push Error: Fail
            }
            
        }
    })();

})(new window.WATO());
//})(window.WATO); <- script standalone