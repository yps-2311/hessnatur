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

        function insertHTML (elem, place, value) {
            if(elem){
                elem.insertAdjacentHTML(place, value);
            }
        }

        function getPriceValue (elem) {
            if(elem){
                return parseFloat(elem.innerHTML.match(/\d+/g).join("."));
            }
        }

        function checkPath (url) {
            return window.location.pathname.includes(url);
        }

        function pushError() {
            window.iridion.push(['goal', "S05AB30: Error"]);
        }

        if(checkPath('/p/')){
            
            try{

                let wrapper = await WATO.asyncElem('.kk_cta_uvps ul');
                wrapper = wrapper[0];

                console.log("wrapper", wrapper);

                insertHTML(wrapper, 'beforeend', 
                    '<li>Kostenloser Versand ab 100 &euro;</li>'
                );

            } catch(e){
                
                pushError();
            }
            
        } else if(checkPath('/cart')){
            
            try{

                let oldDeliv = await WATO.asyncElem('.column.small-12.text-right.h-xsmallOffset-top-outer');
                const currentValue = getPriceValue(WATO.qs('strong + strong.price.offset-price-left'));

                console.log("cV",WATO.qs('.coupon-value .price.discountPrice'));//

                if(currentValue && currentValue >= 70){
                    //default, Versankosten entfallen nicht
                    let redValue = 'Nur noch ' + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(100 - currentValue);
                    let redText = "und Ihre";
                    let newValue = currentValue + 5.95;

                    oldDeliv = oldDeliv[0].parentElement;
    
                    //Versandkosten entfallen (+ eingelöster Promocode)
                    if(currentValue >= 100 || WATO.qs('.coupon-value .price.discountPrice')){
                        redValue = "Gute Nachricht!";
                        redText = "Ihre";
                        newValue = 0;
                    }
    
                    if(!WATO.qs('.kk_dBox')){

                        insertHTML(oldDeliv, 'afterend', 
                        `<div class="row align-right ${ newValue === 0 ? "kk_cW" : "" }">` +
                            '<div class="kk_dBox">' +
                                `<div class="kk05_svg ${ newValue === 0 ? "kk_check" : "" }"></div>` +
                                '<div><strong>' + redValue + '</strong><br>' + redText + ' Bestellung ist versandkostenfrei</div>' +
                            '</div>' +
                        '</div>'
                        );
                    }
    
                    if(!WATO.qs('.kk_redP')){

                        insertHTML(oldDeliv, 'beforebegin', 
                            '<div class="kk_redP small-12 text-right h-text-muted">' +
                                '<span>Versand (frei ab 100,00 &euro;)</span>' +
                                `<span class="price offset-price-left ${ newValue === 0 ? "kk_lt" : "" }">5,95 &euro;*</span>` +
                            '</div>'
                        );
                    }
                }

            } catch(e){
                
                pushError();
            }
            
        }
    })();

})(new window.WATO());
//})(window.WATO); <- script standalone