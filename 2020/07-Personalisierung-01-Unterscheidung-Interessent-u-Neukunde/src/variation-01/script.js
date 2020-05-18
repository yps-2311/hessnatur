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


    var hessnaturLogo = "https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        favProducts = [43309,47936,42601,42668,43319,22219,42746,43342,42384,22215,42600,43157,48606,39996,26975,48847,49837,48702,48948,41739,22224,47404,20051,42745,47505,41741,47858,49842,49686,49025,49839,46239,49609,48403,47299,18424,48612,42747,36986,49692],
        sehrgefragtProducts = [47936,43309,22219,26975,42668,42601,22215,43319,42746,46645,43157,47858,49638,49681,43342,42600,22224,49323,39996,18424,46623,42745,20051,46632,49686,48383,48435,36986,41741,41739,46267,49304,46585,49049,49862,49692,42384,49837,46627,49025];
        
        
          
    if(isPDS){
        // PDS

        WATO.elem('.productInfoTop > div > .column.medium-10', function(productInfo){
            if(productInfo){
                productInfo[0].insertAdjacentHTML('afterbegin', 
                    '<div class="kk_quali">'+
                        '<h4 class="kk_hl">'+
                            '<span>Natürliche Qualität</span>für Ihr Wohlbefinden'+
                        '</h4>'+
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
                console.log('siegel: ', siegel);
                if(siegel){
                    siegel.classList.add('kk_siegel');
                    var siegelOrganic = WATO.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]', siegel);
                    
                    if(siegelOrganic){
                        siegelOrganic.setAttribute('src', 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/organic.jpg');
                    }
    
                    productInfo[1].insertAdjacentElement('beforeend', siegel);
                }
                
            }
        });

        WATO.elem('.pds-productImage__mzKeyVisualWrapper', function(productImage){
            if(productImage && favProducts.indexOf(parseInt(window.location.pathname.split("/p/")[1].substring(0,5))) !== -1){

                productImage[1].insertAdjacentHTML('beforeend', 
                    '<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>'
                );

                window.document.documentElement.classList.add('kk_favorit');
    
            }
        });

        WATO.elem('.pds-cockpit__addProductWrapper', function(addToCartBox){
            if(addToCartBox){
                addToCartBox[0].insertAdjacentHTML('afterend', 
                    '<div class="kk_cta_uvps">'+
                        '<ul>'+
                            '<li>Kostenlose Rücksendung</li>'+
                            '<li>14 Tage Rückgaberecht</li>'+
                            '<li>Versand aller Pakete mit DHL</li>'+
                        '</ul>'+
                    '</div>'
                );
            }
        });

    }else{
        // Kategorieseite
        
        WATO.elem('.js-product-grid > .gridviewProductItemWrapper:nth-child(15)', function(prodWrapper){
            if(prodWrapper){
                var parentProds = prodWrapper[0].parentNode;
    
                WATO.qs(".gridviewProductItemWrapper:nth-child(6)", parentProds).insertAdjacentHTML('afterend', 
                    '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_hoechstequali">'+
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
    

                var allProducts = WATO.qsa(".dropdown-pane", parentProds);

                for (var i = 0; i < allProducts.length; i++) {
                    var thisProd = allProducts[i],
                        thisID = parseInt(thisProd.getAttribute('id').substring(0,5));
                    if(favProducts.indexOf(thisID) !== -1) {
                        thisProd.classList.add('kk_fav');
                    }
                    if(sehrgefragtProducts.indexOf(thisID) !== -1) {
                        thisProd.classList.add('kk_sehrgefragt');
                    }
                }



                

                
                
            }
        });
    }
    

    
    
    

})(new window.WATO());