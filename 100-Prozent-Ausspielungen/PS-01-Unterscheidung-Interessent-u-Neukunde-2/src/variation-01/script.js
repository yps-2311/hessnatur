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

    // window.iridion.econda.push(["SprintPS01", "V1"]);


    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1,
        hessnaturLogo = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/boxlogo.svg", //"https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        // 3 Monate
        favProducts = [43309,47936,43309,42678,22219,22215,42668,49551,50571,50518,40738,42384,42483,47779,48305,43311,47505,70870,49306,42746,46272,50205,70180,22838,50562,40745,50285,50367,70870,50566,42668,42962,48383,50532,48435,50204,43342,43069,47936,55280,22224,50135,50136,42745,99999,43328,47589,39996,38034,44339,50477,50249,50364,50701,41739,50522,45737,50365,46351,50256,18424,45683,29662,47029,50377,50562,48306,17646,49839,42678,50133,44477,36986,49255,50132,47681,50258,50476,20051,47039,49149,42766,42747,41741,98700,42147,50113,49036,50108,49381,39939,48036,47039,46269,50046,47387,13617,50523,47901,50447];
        
    // 14 Tage (Topseller DE_14Tage-20210111)
    // workaround ab 19
    window.sehrgefragtProducts = [43309,47936,42668,42746,49049,48305,49609,49321,42678,42747,42384,41739,50964,70870,48036,42745,44699,49046,42539,22219,51026,51292,51264,50562,46272,41741,22215,49481,43342,49551,48306,44477,22224,51186,18424,72010,42601,70180,47936,49045,50563,17646,46977,49687,49686,38034,42127,49038,47022,55280,49688,44702,50472,51167,29662,36986,50873,49692,46062,44697,43319,49555,48435,44698,49101,42537,50921,47039,48303,49685,48383,42600,46269,50305,51286,42144,42672,45385,49321,51022,50655,46239,48873,51011,16159,50645,47387,49611,50911,50898,43069,47806,20051,20023,49842,20148,39845,49224,49704,51249];
   
     

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

            if(window.sehrgefragtProducts.indexOf(thisProductID) !== -1){

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

                        if(window.sehrgefragtProducts.indexOf(thisID) !== -1) {
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