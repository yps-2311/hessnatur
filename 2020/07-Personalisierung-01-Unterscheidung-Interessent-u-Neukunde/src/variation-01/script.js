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

    WATO.elem('.productInfoTop > div > .column.medium-10', function(productInfo){
        if(productInfo){
            productInfo[0].insertAdjacentHTML('afterbegin', 
                '<div class="kk_quali">'+
                    '<span>Natürliche Qualität für Ihr wohlbefinden</span>'+
                    '<div class="kk_natur">'+
                        'Höchste Qualität durch<br>reine BIO-Naturfasern'+
                    '</div>'+
                    '<div class="kk_stuecke">'+
                        'Kleindungsstücke ohne<br>Nachteile für Menschen & Natur'+
                    '</div>'+
                    '<div class="kk_tropfen">'+
                        'Tragekomfort ohne<br>Schadstoffbelastung für die Haut'+
                    '</div>'+
                '</div>'
            );

            var siegel = WATO.qs(".certificateWrapper", productInfo[0]).parentNode;
            if(siegel){
                siegel.classList.add('kk_siegel');
                productInfo[1].insertAdjacentElement('beforeend', siegel);
            }
            
        }
    });

    WATO.elem('.pds-productImage__mzKeyVisualWrapper', function(productImage){
        if(productImage){
            console.log('productImage: ', productImage);
            productImage[1].insertAdjacentHTML('beforeend', 
                '<div><b>Aktuell sehr gefragt</b> Dieser Artikel verkauft sich schnell</div>'
            );

        }
    });
    
    

})(new window.WATO());