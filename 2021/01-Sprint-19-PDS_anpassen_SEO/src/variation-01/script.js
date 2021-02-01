// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";
    
    WATO.sprint19();

    /** BADGES **/
    var CLASS_MODIFIED = 'kk-modified',
        productsEdited = 0;

    WATO.elem('body', function(body){

        if(body){

            new MutationObserver(function(mutations) {
                mutations.forEach(function() {

                    var products = WATO.qsa('.gridviewProductItemWrapper:not(.kk-modified)');

                    if(productsEdited < products.length){

                        products.forEach(function(product){
            
                            if(!product.classList.contains(CLASS_MODIFIED)){

                                product.classList.add(CLASS_MODIFIED);

                                var icons = WATO.qsa('.productBadges img', product),
                                    iconImagePath = '',
                                    iconHTML = '';
                    
                                icons.forEach(function(icon){
                                    iconImagePath += icon.getAttribute('src');
                                });

                                if(iconImagePath !== ''){

                                    if(iconImagePath.indexOf('_neu.svg') !== -1){

                                        iconHTML = '<span><b>NEU</b></span>';
                                    }

                                    if(iconImagePath.indexOf('_vegan.svg') !== -1){

                                        iconHTML += '<span class="kk-vegan"><b>VEGAN</b></span>';
                                    }

                                    if(iconImagePath.indexOf('_sale.svg') !== -1){

                                        iconHTML += '<span class="kk-sale"><b>SALE</b></span>';
                                    }

                                    if(iconImagePath.indexOf('_neue_qualitaet.svg') !== -1){

                                        iconHTML += '<span class="kk-quality"><b>NEUE QUALITÄT</b></span>';
                                    }

                                    if(iconImagePath.indexOf('shell.svg') !== -1){

                                        iconHTML += '<span class="kk-quality"><b>NATURE SHELL</b></span>';
                                    }
                                }

                                // Ich setze diesen Container immer, damit nth-child greifed und wir ggfs. alles
                                // auf eine Höhe setzen können 
                                var prodItem = WATO.qs('.productItemColorContainer', product);

                                if(prodItem){

                                    prodItem.insertAdjacentHTML('afterbegin', 
                                        '<div class="kk-icons column small-12">' + iconHTML + '</div>'
                                    );
                                }
                            }
                        });
                    }
                });
            }).observe(document.body, {
                attributes: true, 
                childList: true, 
                characterData: true 
            });
        }
    });

})(new window.WATO());
