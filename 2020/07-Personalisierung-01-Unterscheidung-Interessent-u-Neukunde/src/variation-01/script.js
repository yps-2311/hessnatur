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


    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1,
        hessnaturLogo = "https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        favProducts = [47936,42600,42601,42668,42384,22219,47858,48873,49681,42746,43342,45064,49233,42384,46632,49609,42745,48251,46514,48254,49629,49611,41741,22215,49377,18424,49839,46585,26975,49837,43157,38034,42385,41739,49818,47464,47464,48386,49578,36986],
        sehrgefragtProducts = [47936,42601,42668,42600,43309,22219,42384,47858,42746,43342,48873,22215,26975,49681,43157,42745,49609,49837,45064,49233,41741,46632,18424,41739,49839,49842,49692,49686,22224,47589,49687,46239,38034,36986,49611,42384,42747,49688,46632,46627];
        
        
          


    console.log('isInteressent: ', isInteressent);

    try {
        window.iridion.push(["segment", (isInteressent ? "32812" : "32813")]);
        
    } catch (error) {
    }
    
    WATO.exclude(1024, WATO.reload);
          
    if(isPDS){
        // PDS


        var thisProductID = parseInt(window.location.pathname.split("/p/")[1].substring(0,5));

        WATO.elem('.productInfoTop > div > .column.medium-10:nth-child(2)', function(materialInfo){
            if(materialInfo){
                var productInfo = materialInfo[0].previousElementSibling;
                productInfo.insertAdjacentHTML('afterbegin', 
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
    
                var siegel = WATO.qs(".certificateWrapper", productInfo);
                console.log('siegel: ', siegel);
                if(siegel){
                    siegel.parentNode.classList.add('kk_siegel');

                    var siegelOrganic = WATO.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]', siegel);
                    if(siegelOrganic){
                        siegelOrganic.setAttribute('src', 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/organic.jpg');
                    }
    
                    materialInfo[0].insertAdjacentElement('beforeend', siegel.parentNode);
                }
                
            }
        });

        if(!isInteressent) {
            // Badges nur für Neukunde
            if(favProducts.indexOf(thisProductID) !== -1){
                window.document.documentElement.classList.add('kk_favorit');
            }
            if(sehrgefragtProducts.indexOf(thisProductID) !== -1){
                WATO.elem('.pds-productImage__mzKeyVisualWrapper', function(productImage){
                    if(productImage){
                        productImage[1].insertAdjacentHTML('beforeend', 
                            '<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>'
                        );
                    }
                });
            }
        }
        

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
        
        WATO.elem('footer', function(prodWrapper){
            if(prodWrapper){
                // var parentProds = WATO.qs(".js-product-grid > .gridviewProductItemWrapper").parentNode;
                var allProds = WATO.qsa(".js-product-grid > .gridviewProductItemWrapper");
                console.log('allProds: ', allProds);

                if(isInteressent) {

                    // Interessent
                    var prod6 = allProds[4] || allProds[allProds.length-1],//WATO.qs(".gridviewProductItemWrapper:nth-child(6)", parentProds) || WATO.qs(".gridviewProductItemWrapper:last-child", parentProds),
                        prod9 = allProds[7], //WATO.qs(".gridviewProductItemWrapper:nth-child(9)", parentProds),
                        prod15 = allProds[13]; //WATO.qs(".gridviewProductItemWrapper:nth-child(15)", parentProds);
                    
                        console.log('prod6: ', prod6);
                    if(prod6){
                        prod6.insertAdjacentHTML('afterend', 
                            '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_hoechstequali">'+
                                '<div>'+
                                    '<div class="kk_content">'+
                                        '<img src="'+hessnaturLogo+'">'+
                                        '<h3>Höchste Qualität</h3>'+
                                        '<div>Verwendung kontrollierter<br>BIO-Naturfaser</div>'+
                                        '<div>Höchste Qualität bei<br>unseren Produkten</div>'+
                                        '<div>Kompletter Ausschuss belastender Chemikalien</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'
                        );
                    }
                    
                    if(prod9){
                        prod9.insertAdjacentHTML('afterend', 
                            '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_nachteile">'+
                                '<div>'+
                                    '<div class="kk_content">'+
                                        '<img src="'+hessnaturLogo+'">'+
                                        '<h3>Keine Nachteile für Mensch & Natur</h3>'+
                                        '<div>Konsequente Einhaltung von Naturschutz, Gesundheit und Fairness</div>'+
                                        '<div>Ein Herstellungsprozess mit ökoligischer Verantwortung</div>'+
                                        '<div>Vorschriften zum Umweltschutz (z.B. Abwasserkläranlagen)</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'
                        );
                    }
        
                    if(prod15){
                        prod15.insertAdjacentHTML('afterend', 
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

                }else{
                    // Neukunde
                    var allProducts = WATO.qsa(".dropdown-pane");
                    console.log('allProducts: ', allProducts);

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
                
            }
        });
    }
    

    
    
    

})(new window.WATO());