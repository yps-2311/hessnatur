// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    // WATO.goalsFromCat();

    if(document.location.pathname === "/de/"){
        // Startseite

        // Die Reco wird unter die Bühne verschoben
        WATO.elem('.mainTeaser', function(mainTeaser){
            if(mainTeaser){
                mainTeaser = mainTeaser[0];

                WATO.elem('.js-product-reference', function(oldReco){
                    if(oldReco){
                        oldReco = oldReco[0];
                        
                        var recoHeadline = oldReco.previousElementSibling;

                        mainTeaser.insertAdjacentElement('afterend', oldReco);
                        mainTeaser.insertAdjacentElement('afterend', recoHeadline);
                        console.log('oldReco: ', oldReco);

                        WATO.elem(".rteContainer > .js-product-reference a", function(allLinksInReco){
                            if(allLinksInReco){
                                // var allLinksInReco = WATO.qsa("a", oldReco);
                                console.log('allLinksInReco: ', allLinksInReco);
                                
                                for (var i = 0; i < allLinksInReco.length; i++) {
                                    allLinksInReco[i].addEventListener('click', function(){
                                        window.iridion.push(['goal', 'klick_recoProduct', '', true]);
                                    });
                                    
                                }
                            }
                        });


                        
                    }

                });
            }
        });
    }

    // WATO.elem(function(){
    //     return typeof jQuery !== "undefined";
    // }, function(element){
    //     if(element){
    //         jQuery('.kk_reco a').click(function(){
    //             console.log("klick_recoProduct");
    //             window.iridion.push(['goal', 'klick_recoProduct', '', true]);
    //         });
    //     }
    // });
    

})(new window.WATO());
