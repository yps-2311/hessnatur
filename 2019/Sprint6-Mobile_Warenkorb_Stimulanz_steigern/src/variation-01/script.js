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

    // function pushGoal(key) {
    //     window.iridion.push(['goal', 's5_' + key]);
    // }

    // Element entfernen
    // function removeObject(el) {
    //     if(el){
    //         el.parentNode.removeChild(el);
    //     }
    // }

    // WATO.goalsFromCat();

    console.log("Sprint 6");

    function removeStarFromString(el) {
        if(el){
            el.innerHTML = el.innerHTML.replace("*","");
        }
    }

    var imgPath = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2019/Sprint06/";


    WATO.elem('.js_backstopWrapper > .bgColor-super-light-gray', function(addOtherArticle){
        if(addOtherArticle){
            WATO.elem('.js_backstopWrapper > .h-mediumOffset-bottom-inner:not(.yCmsContentSlot)', function(bottomButtons){
                if(bottomButtons){
                    bottomButtons[0].insertAdjacentElement('afterend', addOtherArticle[0]);
                }
            });
        }
    });

    WATO.elem('.js_backstopWrapper > .row > .h-xsmallOffset-bottom-outer', function(topButton){
        if(topButton){
            topButton[0].insertAdjacentHTML('afterend', 
                '<div class="columns small-12">'+
                    '<div class="kk_grew"><img src="'+imgPath+'infoi.svg" >Artikel im Warenkorb werden nicht reserviert.</div>'+
                '</div>'
            );
        }
    });

    WATO.elem('.listing__table--item', function(allItems){
        if(allItems){
            var overAllMoneySavings = 0

            for (var i = 0; i < allItems.length; i++) {
                var thisItem = allItems[i],
                    shippingAvailability = WATO.qs(".js-availability-status", thisItem),
                    itemImg = WATO.qs(".small-4 img", thisItem),
                    discountPrice = WATO.qs(".discountPrice", thisItem),
                    normalPrice = WATO.qs(".price", thisItem),
                    strikeValue = WATO.qs(".strikeValue", thisItem);

                if(shippingAvailability) {
                    // WATO.qs(".small-4", thisItem).insertAdjacentElement('beforeend', shippingAvailability);
                    itemImg.insertAdjacentElement('afterend', shippingAvailability);
                }

                itemImg.setAttribute("src", itemImg.getAttribute("src").replace("hyb_redes_cart_overview", "generalfeed_small"));

                itemImg.parentNode.insertAdjacentHTML('afterend', 
                    '<div class="kk_removeAndQuantity row column small-12"></div>'
                );

                var removeAndQuantity = WATO.qs(".kk_removeAndQuantity", thisItem);
                
                removeAndQuantity.insertAdjacentElement('afterbegin', WATO.qs('.item__amount', thisItem).parentNode);
                removeAndQuantity.insertAdjacentElement('afterbegin', WATO.qs(".js-entry-remove", thisItem).parentNode);
                

                removeStarFromString(discountPrice);
                removeStarFromString(normalPrice);
                
                if(strikeValue){
                    var strikePrice = strikeValue.innerHTML.replace("*",""),
                        moneySavings = parseFloat(strikePrice.replace("€","").replace(".","").replace(",",".")) - 
                            parseFloat(discountPrice.innerHTML.replace("*","").replace("€","").replace(".","").replace(",","."));

                    strikeValue.innerHTML = strikePrice;
                    
                    strikeValue.parentNode.insertAdjacentHTML('afterend', 
                        '<div class="kk_lightgreen">€ '+String((moneySavings).toFixed(2)).replace(".",",")+' Ersparnis</div>'
                    );

                    overAllMoneySavings += moneySavings;
                }
            }

            WATO.elem('.price.offset-price-left', function(zwischenSumme){
                if(zwischenSumme){
                    zwischenSumme = zwischenSumme[0];

                    zwischenSumme.innerHTML = zwischenSumme.innerHTML.replace("*","");

                    if(overAllMoneySavings){
                        zwischenSumme.parentNode.parentNode.parentNode.insertAdjacentHTML('beforeend', 
                            '<div class="kk_lightgreen">Sie sparen mit dieser Bestellung <b>€ '+String((overAllMoneySavings).toFixed(2)).replace(".",",")+'</b></div>'
                        );
                    }

                    WATO.qs(".btn-deliverycosts").innerHTML = "+ Versand";
                }
            });
        }
    });

    WATO.elem('.h-xsmallOffset-bottom-outer .price', function(totalPrice){
        if(totalPrice){
            removeStarFromString(totalPrice[0]);
        }
    });

    // Gutschein und Aktionscode
    WATO.elem('.row + .row + .bgColor-super-light-gray', function(actionCode){
        if(actionCode){
            actionCode = actionCode[0];

            actionCode.classList.add('kk_actionCode');

            actionCode.insertAdjacentHTML('afterbegin', 
                '<div class="kk_opener"><img src="'+imgPath+'gutschein.svg">Ich habe einen Gutschein- oder Aktionscode</div>'
            );

            WATO.qs(".kk_opener", actionCode).addEventListener('click', function(e){
                e.target.parentNode.classList.add('kk_open');
            });

            actionCode.insertAdjacentElement('beforebegin', WATO.qs(".js_backstopWrapper > .row.h-smallOffset-bottom-outer"));

            actionCode.nextElementSibling.insertAdjacentElement('afterend', actionCode);
        }
    });

    WATO.elem('.js_backstopWrapper > .callout.dark-gray', function(freundeWerbenFreunde){
        if(freundeWerbenFreunde){
            freundeWerbenFreunde[0].insertAdjacentHTML('beforebegin', 
                '<div class="kk_uvps">'+
                    '<div>'+
                        '<img src="'+imgPath+'headerlabel.png">'+
                        '<h4>Zeitloses Design seit 1976</h4>'+
                    '</div>'+
                '</div>'
            );

        }
    });
    


})(new window.WATO());