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

    // window.iridion.econda.push(["Sprint06", "V1"]);

    // function pushGoal(key, sendOnNextPageView){    
    //     if(sendOnNextPageView){
    //         window.iridion.push(['goal', key, '', true]);
    //     }else{
    //         window.iridion.push(['goal', key]);
    //     }
    // }
    // WATO.goalsFromCat();


    var hessnaturLogo = "https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg";

    WATO.elem('.js-product-grid > .gridviewProductItemWrapper:nth-child(15)', function(prodWrapper){
        if(prodWrapper){
            var parentProds = prodWrapper[0].parentNode;

            WATO.qs(".gridviewProductItemWrapper:nth-child(6)", parentProds).insertAdjacentHTML('afterend', 
                '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_quali">'+
                    '<div>'+
                        '<div class="kk_content">'+
                            '<img src="'+hessnaturLogo+'">'+
                            '<h3>Höchste Qualität</h3>'+
                            '<div>Verwendung kontrollierter BIO-Naturfaser</div>'+
                            '<div>Höchste Qualität bei unseren Produkten</div>'+
                            '<div>Kompletter Ausschuss belastender Chemikalien</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );

            WATO.qs(".gridviewProductItemWrapper:nth-child(10)", parentProds).insertAdjacentHTML('afterend', 
                '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_nachteile">'+
                    '<div>'+
                        '<div class="kk_content">'+
                            '<img src="'+hessnaturLogo+'">'+
                            '<h3>Keine Nachteile für Mensch & Natur</h3>'+
                            '<div>Konsequente Einhaltung von Naturschutz, Gesundheit und Fairness</div>'+
                            '<div>Ein Herstellungsprozess mit ökoligischer Verantwortung</div>'+
                            '<div>Vorschriften zum Umwelt- schutz (z.B. Abwasserklär- anlagen)</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );

            prodWrapper[0].insertAdjacentHTML('afterend', 
                '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_trage">'+
                    '<div>'+
                        '<div class="kk_content">'+
                            '<img src="'+hessnaturLogo+'">'+
                            '<h3>Höchste Qualität</h3>'+
                            '<div>Verwendung kontrollierter BIO-Naturfaser</div>'+
                            '<div>Höchste Qualität bei unseren Produkten</div>'+
                            '<div>Kompletter Ausschuss belastender Chemikalien</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );


        }
    });

    
    

})(new window.WATO());