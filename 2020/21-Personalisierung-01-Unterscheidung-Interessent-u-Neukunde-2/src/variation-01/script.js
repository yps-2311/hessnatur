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


    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1,
        hessnaturLogo = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/boxlogo.svg", //"https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        // 3 Monate
        favProducts = [43309,47936,50571,42678,43311,22219,42384,46272,70180,70870,49551,22215,42668,50562,42483,39996,45737,48305,42746,43328,43342,55280,40738,43319,46351,38034,44339,29662,48435,22224,47779,44477,48383,47505,50518,17646,50367,99999,46269,41739,50566,40745,43012,50205,47793,13617,40745,32974,50532,36986,49839,49611,45671,50285,18424,23127,50522,49306,32967,43372,42601,42745,50135,49687,49686,47029,42747,49123,47039,50231,50477,46361,20023,47806,50108,50701,48306,43309,42132,42356,41741,47022,47901,47589,22838,50113,40745,47039,42962,20051,50364,50365,30708,50925,41598,47701,50924,46267],
        // 14 Tage (Topseller DE_14Tage-20210111)
        sehrgefragtProducts = [43309,47936,50518,49306,47779,50205,70870,47505,42668,39939,45683,43309,22219,50136,22215,50261,50204,50532,50285,50864,39996,50264,42962,43069,50562,50482,49551,42766,48305,50249,55280,50248,50256,50137,47589,40738,46272,44477,49381,42746,49036,22838,50197,50258,50051,50523,50135,50481,42678,50132,50701,49171,42483,50355,48383,49815,50377,49029,50404,50214,50365,49255,20051,42147,50224,48435,99999,50405,40745,48036,42745,70180,43342,49918,50185,50364,49481,49813,42747,50367,17646,48622,50414,50257,46272,29662,50447,50563,49634,50231,50189,50311,44699,50575,48306,50238,50375,49597,46977,50236];
        
    // Anpassung MV
    // Verstehe die Logik nicht. Habe diese nach Rücksprache mit Jenny angepasst. 
    // if ((!window.iridion.push(['hasSegment', "32812"])) && (!window.iridion.push(['hasSegment', "32813"]))) {
    //     window.iridion.push(["segment", (isInteressent ? "32812" : "32813")]);
    // }
    if(isInteressent){

        window.iridion.push(["segment", "32812"]);
    } else {
        
        window.iridion.push(["segment", "-32812"]);
        window.iridion.push(["segment", "32813"]);
    }
    
    // WATO.exclude(1024, WATO.reload);
    WATO.exclude(1023, function(){

        WATO.setCookie('kksp17desk_exclude', 'true', ".hessnatur.com", false);
        WATO.setCookie('kkps01desk_exclude', 'true', ".hessnatur.com", false);

        WATO.reload();
    });

    function checkForKachelClass(elem) {

        return elem.nextElementSibling.classList.contains('kk_kachel');
    }

    function init() {

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

                    if(siegel){

                        siegel.parentNode.classList.add('kk_siegel');

                        var siegelOrganic = WATO.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]', siegel);

                        if(siegelOrganic){

                            siegelOrganic.setAttribute('src', 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/organic.jpg');
                        }
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
        } else {

            // Kategorieseite
            WATO.elem('footer', function(prodWrapper){

                if(prodWrapper){

                    var allProds = WATO.qsa(".js-product-grid > .gridviewProductItemWrapper");

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
                        
                        if(prod6 && !checkForKachelClass(prod6)){
                            prod6.insertAdjacentHTML('afterend', all3boxes[0]);
                        }
                        
                        if(prod9 && !checkForKachelClass(prod9)){
                            prod9.insertAdjacentHTML('afterend',  all3boxes[1]);
                        }

                        if(prod15 && !checkForKachelClass(prod15)){
                            prod15.insertAdjacentHTML('afterend',  all3boxes[2]);
                        }
                    } else {

                        // Neukunde
                        var allProducts = WATO.qsa(".dropdown-pane");

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
    }
    
    init();

    WATO.ajax('productListJSON?products', function(){

        init();
    });

})(new window.WATO(), window);