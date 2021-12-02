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

    // window.iridion.econda.push(["SprintPS01-2", "V1"]);

    WATO.ps01_2global();

    var isInteressent = WATO.isCustomerTypeInteressent(),
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        imgUrl = 'https://media.hessnatur.com/kk/2021/ps01_2/',
        boxContent = [
            // Inhalte und Bilder für 3 Sets der UVPs
            {title: 'Für Mensch und Natur',
             img: 'menschundnatur.svg',
             uvps: ['Konsequente Einhaltung von Naturschutz und Fairness', 
                    'Ein Herstellungs-<br>prozess mit ökologischer Verantwortung',
                    'Einhaltung des Umweltschutzes (z.B. Abwasser-<br>kläranlagen)'
            ]},
            {title: 'Für Qualität und Bewusstsein',
             img: 'qualitaet.svg',
             uvps: ['Verwendung kontrollierter Naturfasern', 
                    'Höchste Qualität bei unseren Produkten',
                    'Mensch und Natur vor Chemikalien schützen'
            ]},
            {title: 'Für Tragekomfort und Verträglichkeit',
             img: 'tragekomfort.svg',
             uvps: ['Verwendung von hautsympathischen Materialien', 
                    'Verzicht auf belastende Chemikalien',
                    'Wertvolle Naturfasern auf Ihrer Haut'
            ]}
        ];

    function checkForKachelClass(elem) {
        try {
            return elem.nextElementSibling ? elem.nextElementSibling.classList.contains('kk_kachel') : false;
        } catch (error) {
            return false;
        }
    }

    function getCatBox(contentIndex, uvpIndex) {
        return  '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel">'+
                    '<div class="row">'+
                        '<div class="column small-12">'+
                            '<div class="kk_content column">'+
                                '<div>'+
                                    '<img src="'+imgUrl+boxContent[contentIndex].img+'">'+
                                    '<div>'+boxContent[contentIndex].uvps[uvpIndex]+'</div>'+
                                    '<h3>'+boxContent[contentIndex].title+'</h3>'+
                                '</div>'+
                            '</div>'+
                            '<img src="'+WATO.qs('.productImage-1').getAttribute("src")+'" class="productImage-1">'+
                        '</div>'+
                    '</div>'+
                    '<div class="productItemColorContainer row align-center h-pos-relative h-xsmallOffset-top-outer">'+
                    '</div>'+
                '</div>';
    }

    function init() {

        if(isPDS){
            // PDS

            if(!isInteressent) {

                var thisProductID = parseInt(window.location.pathname.split("/p/")[1].substring(0,5));

                // Badges nur für Neukunde
                WATO.elem(function(){
                    return WATO.favProducts.length > 0 && WATO.sehrgefragtProducts.length > 0;
                }, function(element){
                    if(element){

                        if(WATO.favProducts.indexOf(thisProductID) !== -1){
                            window.document.documentElement.classList.add('kk_favorit');
                        }

                        if(WATO.sehrgefragtProducts.indexOf(thisProductID) !== -1){
                            WATO.elem('.js-price-container', function(priceContainer){
                                if(priceContainer){
                                    priceContainer[0].insertAdjacentHTML('afterend', 
                                        '<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>'
                                    );
                                }
                            });
                        }
                    }
                });

            }

            WATO.elem('.small-12 > .small-collapse.medium-uncollapse.large-uncollapse', function(contentArea){
                if(contentArea){
                    // UVPs auf PDS auf voller länge
                    contentArea[0].insertAdjacentHTML('afterbegin', 
                        '<div class="kk_quali">'+
                            '<div class="kk_innerwrapper">'+
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
                                    'Kleidung, die Mensch &<br>Natur gut tut'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    );
                }
            });

        } else {

            // Kategorieseite
            WATO.elem('footer', function(prodWrapper){

                if(prodWrapper){

                    var allProds = WATO.qsa(".js-product-grid > .gridviewProductItemWrapper");
                    
                    if(isInteressent && !WATO.qs('.kk_kachel')) {

                        // Interessent
                        var prod6 = allProds[4] || allProds[allProds.length-2] || allProds[allProds.length-1],
                            prod9 = allProds[7],
                            prod15 = allProds[13],
                            randomContentIndex = Math.floor(Math.random() * 3),
                            all3boxes = [
                                getCatBox(randomContentIndex, 0),
                                getCatBox(randomContentIndex, 1),
                                getCatBox(randomContentIndex, 2)
                            ];
                        
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
                    if(!isInteressent) {
                        WATO.elem(function(){
                            return  WATO.favProducts.length > 0 && WATO.sehrgefragtProducts.length > 0;
                        }, function(element){
                            if(element){
                                // Produkte
                                var allProducts = WATO.qsa(".js-product-grid .dropdown-pane");

                                for (var k = 0; k < allProducts.length; k++) {
                                    var thisProd = allProducts[k],
                                        thisID = parseInt(thisProd.getAttribute('id').substring(0,5));
                                    
                                    // Badgets werden gesetzt
                                    if(WATO.favProducts.indexOf(thisID) !== -1) {
                                        thisProd.classList.add('kk_fav');
                                    }
                                    if(WATO.sehrgefragtProducts.indexOf(thisID) !== -1) {
                                        thisProd.classList.add('kk_sehrgefragt');
                                    }
                                }
                            }
                        });
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



// var searchText = "billext";

// for (var thisObj in this) {
//     if(thisObj.indexOf(searchText) !== -1){
//         console.log(thisObj+' (type: '+(typeof window[thisObj])+'): ', window[thisObj]);
//     }
//     try {
//         for (var nextObj in window[thisObj]) {
//             if(nextObj.indexOf(searchText) !== -1){
//                 console.log('------ '+thisObj+'.'+nextObj+' (type: '+(typeof window[thisObj][nextObj])+'): ', window[thisObj][nextObj]);
//             }
//         }
//     } catch (error) {
//         console.log('Error: ', error);
//     }
// }
