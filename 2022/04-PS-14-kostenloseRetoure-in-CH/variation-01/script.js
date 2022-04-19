// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Jonas Hoeppe
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    // console.log('Variante 1');

    var isHome = false,
        isPDP = false,
        isCart = false,
        isConfirmation = false;

    if (location.pathname === '/ch/') {
        isHome = true;
    } else if (location.pathname === '/ch/cart') {
        isCart= true;
    } else if (location.pathname === '/ch/checkout/multi/summary') {
        isConfirmation = true;
    } else {
        isPDP = true;
    }


    /* The Contents of the Grey Box and the actionbar are set here */ 

    var boxContent =    '<div class="kk_main_text hn-headline">kostenlose Rücksendung</div>' +
                        '<div class="kk_sub_text hn-text-block"><div>Bei uns kaufen Sie <b>ohne Risiko</b>. Falls Ihnen etwas nicht gefällt, nutzen Sie einfach unsere <b>kostenlose Rücksendung</b>.**</div></div>';

    var actionbar_additional_content = "KOSTENLOSE RÜCKSENDUNG** & ";
    var actionbar_flyout_content = '**Gilt für Bestellungen zwischen dem 06.04. und 16.05.2022. Gilt nicht für Matratzen, Kissen, Bettdecken, Unterbetten, Lattenroste, Teppiche, Gardinen, Poufs und Baby-Bettwaren.';


    // Set Cookie
    document.cookie = "PromotionMediumNo=DOR; expires=Mon, 17 May 2022 00:00:00 GMT; path=/ch/;";

    // Econda
    window.iridion.econda.push(["PS14CH", "V1"]);


    // Action Bar Manipulation
    if(!isConfirmation){
        WATO.elem('.yCmsComponent.actionbarWrapper .actionbar.flyout .column', function(actionbarFlyoutColumn){
            if(actionbarFlyoutColumn) {
                // console.log('actionbarFlyoutColumn: ',actionbarFlyoutColumn);
    
                var actionbar_text_span = WATO.qs('.actionbar-text-wrapper');
                if(actionbar_text_span){
                    var actionbar_existing_content = actionbar_text_span.innerHTML;
                    // var actionbar_additional_content = "";
                    var actionbar_new_content = actionbar_additional_content + actionbar_existing_content;
        
                    actionbar_text_span.innerHTML = actionbar_new_content;
                }
    
                actionbarFlyoutColumn[0].insertAdjacentHTML('afterEnd',
                '<div class="column">' +
                    '<div class="text-center">' + actionbar_flyout_content + '</div>' +
                '</div>'
                );
            }
        });
    }


    // Startseite
    if(isHome) {
        // WATO.elem('.lpmHero', function(lpmHero){
        WATO.elem('.js-product-reference', function(productReference){
            if(productReference){

                productReference[0].insertAdjacentHTML('afterEnd', 
                '<div class="kk_free_return_outer_wrapper row fsmall-12 h-no-padding-medium-down column">' +
                    '<div class="kk_free_return_wrapper --cell-padding">' +
                        '<div id="kk_free_return">' +
                            boxContent +
                        '</div>' +
                    '</div>' +
                '</div>'
                );

                var wrapper = WATO.qs('.kk_free_return_outer_wrapper');
                if(wrapper){
                    wrapper.nextElementSibling.style.display = "none";
                }

                
            }
        });
    }

    // PDP
    else if(isPDP) {
        WATO.elem('.js-add-product-container #addToCartForm', function(addToCart){
            if(addToCart){    
                addToCart[0].parentElement.parentElement.insertAdjacentHTML('beforeEnd', 
                '<div id="kk_free_return" class="kk_pdp">' +
                    boxContent +
                '</div>'  
                );
            }
        }); 
    }


    // Warenkorb   
    else if(isCart) {
        // Desktop
        WATO.elem('.js_backstopWrapper .column.small-6.medium-12.text-right.h-xsmallOffset-bottom-outer .price', function(price){
            if(price){
                var div = price[0].parentElement.parentElement.parentElement.previousElementSibling;

                div.classList.add('kk_free_return_wrapper_desktop');
                div.classList.remove('h-mediumOffset-bottom-outer');

                div.insertAdjacentHTML('afterBegin', 
                '<div class="kk_free_return_cart_wrapper">' +
                    '<div id="kk_free_return" class="kk_cart">' +
                        boxContent +
                    '</div>' +
                '</div>'
                );

                div.nextElementSibling.classList.add('kk_free_return_sibling');
            }
        });
        // Mobile
        WATO.elem('.column.small-12.medium-6.large-5.small-order-1.medium-order-2.text-right .button.success', function(successBtn){
            if(successBtn){
                
                successBtn[0].parentElement.insertAdjacentHTML('afterEnd', 
                '<div class="kk_free_return_wrapper mobile column small-12 medium-6 large-5 large-offset-1 small-order-1 medium-order-1">' +
                    '<div id="kk_free_return" class="kk_cart mobile">' +
                        boxContent +
                    '</div>' +  
                '</div>'
                );

            }
        });
    }


    // Kaufbestätigung
    else if(isConfirmation) {
        // Desktop
        WATO.elem('.price.totalPrice', function(price){
            if(price){

                price[0].parentElement.parentElement.classList.remove('medium-offset-6');

                price[0].parentElement.parentElement.insertAdjacentHTML('beforeBegin',
                '<div class="column small-12 medium-6 large-5 large-offset-1 h-smallOffset-bottom-outer kk_free_return_wrapper_desktop">' +
                    '<div class="kk_free_return_confirmation_wrapper">' +
                        '<div id="kk_free_return" class="kk_confirmation">' +
                            boxContent +
                        '</div>' +
                    '</div>' +
                '</div>'
                );
            }
        });
        // Mobile
        WATO.elem('.button.success', function(buyBtn){
            if(buyBtn){

                buyBtn[0].parentElement.parentElement.classList.remove('h-xLargeOffset-bottom-outer');

                buyBtn[0].parentElement.parentElement.parentElement.insertAdjacentHTML('afterEnd', 
                '<div class="kk_free_return_wrapper mobile column small-12 medium-6 large-5 large-offset-1 small-order-1 medium-order-1">' +
                    '<div id="kk_free_return" class="kk_confirmation mobile">' +
                        boxContent +
                    '</div>' +  
                '</div>'
                );
            }
        })
    }


    // Nur wenn der Sonderfall umgesetzt werden soll.  Alle Boxen verstecken, bis die Überprüfung abgeschlossen wurde.

    // Cart & Confirmation Text nur anzeigen, wenn der Warenkorb / die Bestellung mindestens einen Artikel beinhaltet, welche nicht ausgeschlossen wird
    // if(isCart || isConfirmation) {


    //     // IDs aller Artikel als Array beziehen
    //     // const productIds = "";
        

    //     const blacklist = [2340401, 2340501, 3276703, 3276717, 3276733, 3276767, 3276782, 3276803, 3276817, 3276820, 3276860, 3276882, 3428203, 3428282, 3428401, 3428420, 3428460, 3428482, 3699282, 3699801, 3699901, 3700101, 3700201, 3700301, 3953901, 3954101, 4004109, 4004126, 4004137, 4004160, 4004192, 4031009, 4031026, 4031037, 4031060, 4031092, 4256101, 4256201, 4256301, 4462104, 4462203, 4462225, 4462233, 4462267, 4462269, 4462282, 4463701, 4463801, 4463901, 4464001, 4464701, 4524701, 4524801, 4540701, 4540801, 4540901, 4550909, 4550926, 4550937, 4550960, 4550992, 4551009, 4551026, 4551037, 4551060, 4551092, 4684801, 4782200, 4782400, 4782600, 4782699, 4782800, 4782899, 4784401, 4842396, 4842397, 4842398, 4894320, 4894337, 4894382, 4906301, 4906401, 4972901, 4973101, 4973201, 4973301, 4973401, 5188920, 5188937, 5188960, 5188982, 5195501, 5280601, 5281201, 5281301, 5281401, 5281501, 5281701, 5281901, 5282701];
    //     let shouldActivate = false;
        
        
    //     // Prüfen, ob eine der IDs nicht auf der Blacklist auftaucht.
    //     // for (let i = 0; i < productIds.length; i++) {

    //     //     if (blacklist.indexOf(productIds[i] === -1)) {
    //     //         shouldActivate = true;
    //     //         i = productIds.length;
                
    //     //     }
    //     //     // for (let j = 0; j < blacklist.length; j++) {
    //     //     //     if (productIds[i] !== blacklist[j]) {
    //     //     //         shouldActivate = false;
    //     //     //         break;
    //     //     //     }
    //     //     // }
    //     // }
        
    //     //  Sicherstellen, dass alle Elemente geladen sind
    //     // WATO.qsa auf listing__table--item   // elem und dann if 

    //     // WATO.qs auf input[name="variantCode"]
    //     // wenn vorhanden .value um an die Werte 


    //     // WATO.elem(".listing__table--item", function(table_item) {
    //     //     if(table_item) {
    //     //         console.log('table_item:', table_item);
    //     //         //table_item[0]

    //     //         table_item.forEach(function(){
    //     //         // for (let i = 0; i < table_items.length; i++) {
    //     //             // let productIds = WATO.qsa("input[name='variantCode']");
    //     //             if(productId) {
    //     //                 console.log('productId: ', productId.value);
    //     //                 if(blacklist.indexOf(productId.value === -1)) {
    //     //                     console.log('productId ist nicht in der Blacklist');
    //     //                     shouldActivate = true;
    //     //                 }
    //     //             }
    //     //         });

    //     //     }
    //     // });

        
    //     WATO.elem(".listing__table--item", function(table_items) {
    //         if(table_items) {
    //             console.log('table_item:', table_items);
    //             //table_item[0]

    //             let productIds = WATO.qsa("input[name='variantCode']");
    //             // table_item.forEach(function(){
                
    //             if(productIds) {
    //                 for (let i = 0; i < table_items.length; i++) {
    //                     console.log('productId: ', productIds[i].value);


    //                     // let idValue = parseInt(productIds[i].value.slice(7,8));
    //                     let idValue = parseInt(productIds[i].value.slice(0,-2));
    //                     console.log('idValue: ', idValue);
    //                     // ist 234050114 
    //                     // sollte sein 2340501

    //                     // if(blacklist.indexOf(parseInt(productIds[i].value) === -1)) {
    //                     if(blacklist.indexOf( idValue === -1)) {
    //                         console.log('productId ist nicht in der Blacklist');
    //                         shouldActivate = true;
    //                     }
    //                     // for(let j = 0; )
    //                 }
    //             }
    //         }
    //     });
          

    //     // Sobald eine Id nicht auf der Blacklist ist, Boxen anzeigen
    //     if (shouldActivate) {
    //         console.log('activate');
    //     }
    // }


   
})(new window.WATO());
