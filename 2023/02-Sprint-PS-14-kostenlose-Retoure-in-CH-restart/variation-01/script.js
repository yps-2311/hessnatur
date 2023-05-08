// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description Original von Jonas Hoeppe
 */
(function(WATO) {
    "use strict";

    const thisLocation = location.pathname;

    function addClass(element, newClass) {
		if(element && newClass){
			element.classList.add(newClass);
		}
	}

	function removeClass(element, existingClass) {
		if(element && existingClass){
			element.classList.remove(existingClass);
		}
	}

    function addAsterisk(addToThisParent) {
        const asterisk = WATO.qs('.kk_asterisk', addToThisParent.parentElement);
        const textInBox = WATO.qs('.kk_sub_text', addToThisParent.parentElement);

        if(asterisk && textInBox){
            textInBox.addEventListener('click', () => {
                if(asterisk.classList.contains('kk_hidden')){
                    removeClass(asterisk, "kk_hidden");
                }else{
                    addClass(asterisk, "kk_hidden");
                }
            });
        }
    }

    const isConfirmation = thisLocation === '/ch/checkout/multi/summary';


    /* The Contents of the Grey Box and the actionbar are set here */ 

    const boxContent =  '<div class="kk_main_text hn-headline">kostenlose Rücksendung</div>' +
                        '<div class="kk_sub_text hn-text-block">'+
                            '<div>Bei uns kaufen Sie <b>ohne Risiko</b>. Falls Ihnen etwas nicht gefällt, nutzen Sie einfach unsere <b>kostenlose</b> <span><b>Rücksendung</b>.'+
                                '<img src="https://media.hessnatur.com/kk/100Prozent/ps14/infoi.svg" alt="info"></span>'+
                            '</div>'+
                            '<div class="kk_asterisk kk_hidden">Gilt nicht für Matratzen, Kissen, Bettdecken, Unterbetten, Lattenroste, Teppiche, Gardinen, Poufs und Baby-Bettwaren.</div>'+
                        '</div>';

    
    // INFO-i Icon
    // Gilt nicht für Matratzen, Kissen, Bettdecken, Unterbetten, Lattenroste, Teppiche, Gardinen, Poufs und Baby-Bettwaren.


    // Set Cookie
    // Ablaufdatum des Cookies anpassen wenn Datum vorliegt
    // document.cookie = "PromotionMediumNo=EOR F23 Test ohne Retourekosten FS23; expires=Mon, 13 May 2024 00:00:00 GMT; path=/ch/;";
    document.cookie = "PromotionMediumNo=EOR; expires=Mon, 13 May 2024 00:00:00 GMT; path=/ch/;";

    // Econda
    // Zum Teststart wieder einbauen
    window.iridion.econda.push(["PS14CHrestart", "V1"]);

    // Action Bar Manipulation
    // if(!isConfirmation){
    //     WATO.elem('.yCmsComponent.actionbarWrapper .actionbar.flyout .column', function(actionbarFlyoutColumn){
    //         if(actionbarFlyoutColumn) {
    //             // console.log('actionbarFlyoutColumn: ',actionbarFlyoutColumn);
    
    //             var actionbar_text_span = WATO.qs('.actionbar-text-wrapper');
    //             if(actionbar_text_span){
    //                 var actionbar_existing_content = actionbar_text_span.innerHTML;
    //                 // var actionbar_additional_content = "";
    //                 var actionbar_new_content = "KOSTENLOSE RÜCKSENDUNG** & " + actionbar_existing_content;
        
    //                 actionbar_text_span.innerHTML = actionbar_new_content;
    //             }
    
    //             actionbarFlyoutColumn[0].insertAdjacentHTML('afterEnd',
    //                 '<div class="column">' +
    //                     '<div class="text-center">' + 
    //                         // TODO Datum anpassen
    //                         '**Gilt für Bestellungen zwischen dem 06.04. und 16.05.2022. Gilt nicht für Matratzen, Kissen, Bettdecken, Unterbetten, Lattenroste, Teppiche, Gardinen, Poufs und Baby-Bettwaren.'+
    //                     '</div>' +
    //                 '</div>'
    //             );
    //         }
    //     });
    // }

    // Startseite
    if(thisLocation === '/ch/') {
        // WATO.elem('.lpmHero', function(lpmHero){
        WATO.elem('.js-product-reference', function(productReference){
            if(productReference){
                productReference = productReference[0];

                productReference.insertAdjacentHTML('afterEnd', 
                '<div class="kk_free_return_outer_wrapper row fsmall-12 h-no-padding-medium-down column">' +
                    '<div class="kk_free_return_wrapper --cell-padding">' +
                        '<div id="kk_free_return">' +
                            boxContent +
                        '</div>' +
                    '</div>' +
                '</div>'
                );

                addAsterisk(productReference);

                const wrapper = WATO.qs('.kk_free_return_outer_wrapper');
                if(wrapper){
                    wrapper.nextElementSibling.style.display = "none";
                }
            }
        });
    }

    // PDP
    // else if(isPDP) {
    //     WATO.elem('.js-add-product-container #addToCartForm', function(addToCart){
    //         if(addToCart){    
    //             addToCart[0].parentElement.parentElement.insertAdjacentHTML('beforeEnd', 
    //             '<div id="kk_free_return" class="kk_pdp">' +
    //                 boxContent +
    //             '</div>'  
    //             );
    //         }
    //     }); 
    // }


    // Warenkorb   
    else if(thisLocation === '/ch/cart') {
        // Desktop
        WATO.elem('.js_backstopWrapper .column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer .price', function(price){
            if(price){
                let div = price[0].parentElement.parentElement.parentElement.previousElementSibling;

                // div.classList.add('kk_free_return_wrapper_desktop');
                addClass(div, 'kk_free_return_wrapper_desktop');
                // div.classList.remove('h-mediumOffset-bottom-outer');
                removeClass(div, 'h-mediumOffset-bottom-outer');

                div.insertAdjacentHTML('afterBegin', 
                    '<div class="kk_free_return_cart_wrapper">' +
                        '<div id="kk_free_return" class="kk_cart">' +
                            boxContent +
                        '</div>' +
                    '</div>'
                );

                addAsterisk(div);

                addClass(div.nextElementSibling, 'kk_free_return_sibling');
                // div.nextElementSibling.classList.add('kk_free_return_sibling');
            }
        });
        // Mobile
        WATO.elem('.column.small-12.medium-6.large-5.small-order-1.medium-order-2.text-right .button.success', function(successBtn){
            if(successBtn){
                successBtn = successBtn[0];
                successBtn.parentElement.insertAdjacentHTML('afterEnd', 
                    '<div class="kk_free_return_wrapper mobile column small-12 medium-6 large-5 large-offset-1 small-order-1 medium-order-1">' +
                        '<div id="kk_free_return" class="kk_cart mobile">' +
                            boxContent +
                        '</div>' +  
                    '</div>'
                );

                addAsterisk(successBtn.parentElement);
            }
        });
    }


    // Kaufbestätigung
    else if(isConfirmation) {
        // Desktop
        WATO.elem('.price.totalPrice', function(price){
            if(price){
                const priceParent = price[0].parentElement.parentElement;

                // priceParent.classList.remove('medium-offset-6');
                removeClass(priceParent, 'medium-offset-6');

                priceParent.insertAdjacentHTML('beforeBegin',
                    '<div class="column small-12 medium-6 large-5 large-offset-1 h-smallOffset-bottom-outer kk_free_return_wrapper_desktop">' +
                        '<div class="kk_free_return_confirmation_wrapper">' +
                            '<div id="kk_free_return" class="kk_confirmation">' +
                                boxContent +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );

                addAsterisk(priceParent);
            }
        });
        // Mobile
        WATO.elem('.button.success', function(buyBtn){
            if(buyBtn){
                const buyBtnParent = buyBtn[0].parentElement.parentElement;

                // buyBtn[0].parentElement.parentElement.classList.remove('h-xLargeOffset-bottom-outer');
                removeClass(buyBtnParent, 'h-xLargeOffset-bottom-outer');

                buyBtnParent.parentElement.insertAdjacentHTML('afterEnd', 
                    '<div class="kk_free_return_wrapper mobile column small-12 medium-6 large-5 large-offset-1 small-order-1 medium-order-1">' +
                        '<div id="kk_free_return" class="kk_confirmation mobile">' +
                            boxContent +
                        '</div>' +  
                    '</div>'
                );

                addAsterisk(buyBtnParent.parentElement);
            }
        })
    }
})(new window.WATO());
