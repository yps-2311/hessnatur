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
        favProducts = [43309,47936,42678,22219,50571,22215,49551,42384,46272,43311,70180,42483,48305,70870,43309,42746,40738,50518,50562,42668,47779,47505,43342,49306,50205,48383,22838,39996,48435,40745,50532,43328,55280,50285,50367,45737,22224,38034,44339,50566,42962,29662,41739,46351,42745,44477,99999,50204,49839,43069,43319,47589,18424,50135,17646,46269,36986,50136,47029,42747,48306,40745,50477,50249,70870,49611,50701,50364,50522,43012,41741,50522,50365,49255,47901,20051,50256,47039,47039,50108,13617,42601,49123,45683,49687,32974,50476,50377,49686,50113,50133,47681,50258,49837,47900,50132,50231,49036,36973,20023],
        // 14 Tage (Topseller DE_14Tage-20210111)
        sehrgefragtProducts = [43309,47936,42668,70870,22838,50518,49306,50132,42962,50562,50204,22215,22219,50377,50136,42678,43069,45683,48305,42384,48036,50205,50041,50532,44477,49481,70180,50563,50575,49255,47779,46272,55280,29662,43342,42746,51264,49551,50249,47177,50033,39939,47387,50285,50127,44699,46977,49036,49597,48017,47998,46062,50236,50046,50197,49049,49321,50185,42745,51167,50311,72010,49813,42722,47589,17646,47505,48383,46272,38034,44697,20051,51292,32974,48622,50921,47936,50189,47806,42483,49815,50492,49704,47431,49887,43311,50035,49788,42127,42601,50069,40745,19996,42747,50472,49688,49555,46269,50522,48873];
        

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

            // if(!isInteressent) {

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
            // }

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
                    }

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
            });
        }
    }
    
    init();

    WATO.ajax('productListJSON?products', function(){

        init();
    });

})(new window.WATO(), window);