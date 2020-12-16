// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */


(function(WATO, window) {
    "use strict";

    window.iridion.econda.push(["SprintPS01", "V1"]);

    // function pushGoal(key, sendOnNextPageView){    
    //     if(sendOnNextPageView){
    //         window.iridion.push(['goal', key, '', true]);
    //     }else{
    //         window.iridion.push(['goal', key]);
    //     }
    // }
    // WATO.goalsFromCat();
    
    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1,
        hessnaturLogo = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/boxlogo.svg", //"https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        favProducts = [43309,47936,50571,43311,43319,42678,39996,46272,42668,70180,42384,70870,43372,45737,22219,43328,55280,50562,47796,42746,49551,43342,47793,46361,42483,22215,48305,32967,45672,40745,38034,46351,13617,45671,44339,43012,29662,50231,44477,45683,41739,99999,17646,40745,47900,42132,50042,32974,39939,49839,46269,22224,50522,43316,30708,49687,49686,23127,40738,48435,49611,47701,42601,47022,44603,42745,47806,42747,47438,48383,48702,45727,50415,49837,32962,41741,36986,50864,47901,48741,49123,20023,18424,49692,50917,44351,43449,33137,40738,48306,46267,50924,71950,50919,42127,72010,20148,50925,41598,50864],
        sehrgefragtProducts = [43309,40738,47936,42678,50566,50571,50367,70870,50477,43311,40745,50522,42483,47438,55280,49889,50364,48008,45737,47505,50365,50135,42864,22219,48007,50701,50133,42766,29662,43328,42668,47681,47786,39996,50285,50205,47779,50208,23127,42384,13617,44339,50518,47589,22215,49149,47244,50562,49321,17646,49306,32974,50238,50476,46272,43342,47387,49381,43012,38034,50019,49958,50249,48000,46441,50256,50112,49551,22838,43069,49178,42962,49975,47039,70180,42356,50532,49042,49541,50923,49123,46351,49842,99999,49046,48305,50114,50447,49891,47488,47431,20023,47701,50318,37118,45671,43342,47240,48435,49991];

        
    // Anpassung MV
    // Verstehe die Logik nicht. Habe diese nach Rücksprache mit Jenny angepasst. 
    try {
        // if ((!window.iridion.push(['hasSegment', "32812"])) && (!window.iridion.push(['hasSegment', "32813"]))) {
        //     window.iridion.push(["segment", (isInteressent ? "32812" : "32813")]);
        // }
        if(isInteressent){

            window.iridion.push(["segment", "32812"]);
        } else {
            
            window.iridion.push(["segment", "-32812"]);
            window.iridion.push(["segment", "32813"]);
        }
    } catch (error) {
    }
    
    // WATO.exclude(1024, WATO.reload);
    WATO.exclude(1023, function(){
        console.log("exclude");

        WATO.setCookie('kksp17desk_exclude', 'true', ".hessnatur.com", false);
        WATO.setCookie('kkps01desk_exclude', 'true', ".hessnatur.com", false);

        WATO.reload();

    });
          
    if(isPDS){
        // PDS

        var thisProductID = parseInt(window.location.pathname.split("/p/")[1].substring(0,5));

        WATO.elem('.small-12 > .small-collapse.medium-uncollapse.large-uncollapse', function(contentArea){
            if(contentArea){
                var productInfo = contentArea[0];

                productInfo.insertAdjacentHTML('afterbegin', 
                    '<div class="kk_quali">'+
                        '<h4 class="kk_hl">'+
                            '<span>Natürliche Qualität für Ihr Wohlbefinden</span>'+
                        '</h4>'+
                        '<div class="kk_natur">'+
                            'Naturfasern in höchster<br>Qualität'+
                        '</div>'+
                        '<div class="kk_stuecke">'+
                            'Besonderer Tragekomfort &<br>Verzicht auf Schadstoffe'+
                        '</div>'+
                        '<div class="kk_tropfen">'+
                            'Kleidung, die Mensch & Natur<br>gut tut'+
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
    
                    // contentArea[0].insertAdjacentElement('beforeend', siegel.parentNode);
                }
                
            }
        });

        if(!isInteressent) {
            // Badges nur für Neukunde
            if(favProducts.indexOf(thisProductID) !== -1){
                window.document.documentElement.classList.add('kk_favorit');
            }
            if(sehrgefragtProducts.indexOf(thisProductID) !== -1){
                WATO.elem('.js-price-container', function(priceContainer){
                    if(priceContainer){
                        priceContainer[0].insertAdjacentHTML('afterend', 
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
                // console.log('allProds: ', allProds);

                if(isInteressent) {
                    // Interessent

                    var prod6 = allProds[4] || allProds[allProds.length-2] || allProds[allProds.length-1],
                        prod9 = allProds[7],
                        prod15 = allProds[13],
                        all3boxes = [
                            '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_hoechstequali">'+
                                '<div>'+
                                    '<div class="kk_content">'+
                                        '<img src="'+hessnaturLogo+'">'+
                                        '<h3>Qualität & Bewusstsein </h3>'+
                                        '<div>Verwendung kontrollierter Naturfasern</div>'+
                                        '<div>Höchste Qualität bei unseren Produkten</div>'+
                                        '<div>Mensch und Natur vor<br>Chemikalien schützen</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>',
                            '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_nachteile">'+
                                '<div>'+
                                    '<div class="kk_content">'+
                                        '<img src="'+hessnaturLogo+'">'+
                                        '<h3>Vorteile für Mensch & Natur</h3>'+
                                        '<div>Konsequente Einhaltung von Naturschutz und Fairness</div>'+
                                        '<div>Ein Herstellungsprozess mit ökologischer Verantwortung</div>'+
                                        '<div>Einhaltung des Umweltschutzes<br>(z.B. Abwasserkläranlagen)</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>',
                            '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_trage">'+
                                '<div>'+
                                    '<div class="kk_content">'+
                                        '<img src="'+hessnaturLogo+'">'+
                                        '<h3>Tragekomfort & Verträglichkeit</h3>'+
                                        '<div>Verwendung von hautsympathischen Materialien</div>'+
                                        '<div>Verzicht auf belastende Chemikalien</div>'+
                                        '<div>Wertvolle Naturfasern<br>auf Ihrer Haut</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'
                        ];

                    // Zufällige Reihenfolge
                    for (var i = all3boxes.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1)),
                            temp = all3boxes[i];

                        all3boxes[i] = all3boxes[j];
                        all3boxes[j] = temp;
                    }
                    
                    if(prod6){
                        prod6.insertAdjacentHTML('afterend', all3boxes[0]);
                    }
                    if(prod9){
                        prod9.insertAdjacentHTML('afterend',  all3boxes[1]);
                    }
                    if(prod15){
                        prod15.insertAdjacentHTML('afterend',  all3boxes[2]);
                    }

                }else{
                    // Neukunde
                    var allProducts = WATO.qsa(".dropdown-pane");
                    // console.log('allProducts: ', allProducts);

                    for (var k = 0; k < allProducts.length; k++) {
                        var thisProd = allProducts[k],
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
    

    
    
    

})(new window.WATO(), window);