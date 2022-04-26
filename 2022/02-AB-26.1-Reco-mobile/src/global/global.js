/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

    var urlSearch = window.location.search,
        sawNowProductFromReco = urlSearch.indexOf("emcs1=91_ARP_Produktdetailseite") !== -1 || urlSearch.indexOf("kk_26=true") !== -1;

    WATO.prototype.goalPush = function(key, nextpagesend){
        if(nextpagesend){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

	WATO.prototype.ab26global = function(typeOfReco){

        var WATO = this,
            swipeSend = [];

        WATO.elem('.small-collapse > [data-componentid="CrossSellingEconda"] .flickity-enabled .item__image, #kk_likethiswrapper .flickity-enabled .item__image', function(recoTop){
            if(recoTop){
                recoTop.forEach(function(item){
                    item.addEventListener('click', function(){
                        if(typeOfReco === "nachhaltig"){
                            WATO.goalPush("kk26_klick_recoSustainingPr", true);
                        }else if(typeOfReco === "aenlich"){
                            WATO.goalPush("kk26_klick_recoSimilarPr", true);
                        }
                    });
                });
                recoTop[0].closest(".flickity-enabled").addEventListener('touchmove', function(){
                    if(typeOfReco === "nachhaltig" && swipeSend.indexOf("Sustaining") === -1){
                        swipeSend.push("Sustaining");
                        WATO.goalPush("kk26_swipeSustaining");
                    }else if(typeOfReco === "aenlich" && swipeSend.indexOf("Similar") === -1){
                        swipeSend.push("Similar");
                        WATO.goalPush("kk26_swipeSimilar");
                    }
                });
            }
        });

        WATO.elem('.js-product-references-wrapper > [data-componentid="CrossSellingEconda"] .flickity-enabled .item__image', function(recoBottom){
            if(recoBottom){
                recoBottom.forEach(function(item){
                    item.addEventListener('click', function(){
                        WATO.goalPush("kk26_klick_recoBottom", true);
                    });
                });
                recoBottom[0].closest(".flickity-enabled").addEventListener('touchmove', function(){
                    if(swipeSend.indexOf("bottom") === -1){
                        swipeSend.push("bottom");
                        WATO.goalPush("kk26_swipeBottom");
                    }
                });
            }
        });

        // Hat auf ein Produkt der Reco aufgerufen
        if(sawNowProductFromReco){
            // Produkt dem WK hinzugefügt - Goal
            WATO.ajax("/cart/add", function(){
                WATO.goalPush("kk26_recoproduct_addtocart");
            });
        }
    };

    WATO.prototype.ab26_1build = function(variation){
        var WATO = this,
            multiReloadStop = false;

        // Nur die Varianten bekommen diese Klasse für die Globale CSS
        window.document.documentElement.classList.add('kk_ab26_1');

        function colorWasChanged(callback) {
            WATO.ajax("/ProductReferencesComponentController/", function(){
                if(!multiReloadStop){
                    multiReloadStop = true;

                    callback();

                    setTimeout(function(){
                        multiReloadStop = false;
                    }, 500);
                }
            });
        }

        function initSlider(selectorWrapper, sliderType) {
            

            var tempOptions = window.ACC.productSlider.getFlickityOptions();
            tempOptions.groupCells = 1;

            var sliderInstanz = new window.Flickity(selectorWrapper, tempOptions);

            setTimeout(function(){
                WATO.ab26global(sliderType);
            }, 1000);

            // WATO.elem(function(){
            //     return typeof $ !== "undefined";
            // }, function(isjq){
            //     if(isjq){
            //         // Doku https://flickity.metafizzy.co/
            //         $(selectorWrapper).flickity({
            //             draggable: true,
            //             cellAlign: 'left',
            //             contain: true,
            //             prevNextButtons: false,
            //             pageDots: false,
            //             percentPosition: true,
            //             setGallerySize: true
            //         });

            //         setTimeout(function(){
            //             WATO.ab26global(sliderType);
            //         }, 1000);
            //     }
            // });
        }

        function likeThisArticleReco(sku) {

            var isExistsReco = WATO.qs('#kk_likethiswrapper');
            if(isExistsReco){
                isExistsReco.parentNode.removeChild(isExistsReco);
            }
            

            WATO.elem('.pds__imageAndCockpitWrapper + .small-collapse > .small-12', function(prodInfo){
                if(prodInfo){
                    
                    prodInfo[0].insertAdjacentHTML('beforebegin', 
                        // MV, 27.08.21 > Die Klasse js-product-reference darf nicht gesetzt werden, führt sonst zu einem Konflikt der 100% Ausspielung 
                        // Refresh-PDS-Desktop und dem STL Element
                        '<div id="kk_likethiswrapper" class="small-12 columns">'+
                            '<div class="small-12 columns">'+
                                '<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                                    '<div class="column small-12 h-mediumOffset-bottom-outer">'+
                                        '<div class="h4 text-center recommendation-headline">Ähnlich wie dieser Artikel</div>'+
                                    '</div>'+
                                    '<div class="column small-12 h-no-padding-medium-down">'+
                                        '<div id="kk_likethisproduct" '+
                                            'class="flickity-productslider js-ecReco" '+
                                            'data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f" '+
                                            'data-wid="163" '+
                                            'data-count="20" '+
                                            'data-product="sku:' + sku + '">'+
                                                'Loading...'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'
                    );
                    

                    WATO.elem(function(){
                        return typeof window.econda !== "undefined" && typeof jQuery !== "undefined" && 
                            typeof window.Flickity !== "undefined" && // && typeof window.usercentrics !== "undefined"
                            typeof window.econda.recengine !== "undefined" && typeof window.econda.recengine.Widget !== "undefined"; // typeof jQuery.fn.flickity !== "undefined"
                    } , function(econdaRdy){
                        if(econdaRdy){

                            // Reco-Init aus dem komprimierten Code der Seite von Hessnatur
                            // leicht angepasst "var n = $("#kk_likethisproduct")" und "new window.Flickity(t, ACC.productSlider.getFlickityOptions());"
    
                            var t = $("#completeTheLookRecommendationsAddToCart");
                            if (t.length > 0) return;
    
                            var i = {};
                            i.horizontal = function(e, t, i) {
    
                                // var sku = WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7);
                                
                                if(e.products.length > 3){
                                    e.products = e.products.filter(function(product){
                                        return product.sku !== sku;
                                    });
        
                                    for (var n = e.products, a = [], o = $("#ecRecommendationsAddToCart").length > 0, s = "", r = 0; r < n.length; r++) {
                                        var l = n[r]
                                            , c = void 0 !== l.oldprice
                                            , u = void 0 !== l.basicprice;
                                        s += '<div class="' + (o ? "carousel-cell" : "productitem text-center small-5 columns") + '">',
                                        s += '<a href="' + (l.deeplink ? l.deeplink : '//www.hessnatur.com/de/p/'+l.sku) + '?kk_26=true" class="item__image">',
                                        s += '<img src="' + l.iconurl + '" />',
                                        s += '<div class="item__desc h-smallOffset-top-outer">',
                                        s += '<h4 class="desc-name">' + i.html(l.name) + "</h4>",
                                        s += '<div class="desc-price">',
                                        s += '<span class="price full ' + (c ? "show" : "hide") + '">' + l.oldprice + "</span>",
                                        s += '<span class="price ' + (c ? "show" : "hide") + '">' + window.ACC.messages.productPriceFromClean + "</span>",
                                        s += '<span class="price special ' + (c ? "show" : "hide") + '">' + l.price + "</span>",
                                        s += '<span class="price ' + (c ? "hide" : "show") + '">' + l.price + "</span>",
                                        s += u ? '<div class="product-basic-price basicPrice">' + l.basicprice + "</div>" : "",
                                        s += "</div>",
                                        s += "</div>",
                                        s += "</a>",
                                        s += "</div>"
                                    }
                                    a.push(s);
                                    var d = a;
                                    $(t).html(d);
                                    // $(t).flickity(ACC.productSlider.getFlickityOptions())
                                    var tempOptions = window.ACC.productSlider.getFlickityOptions();
                                    tempOptions.groupCells = 1;
                                    var flickotySlider = new window.Flickity(t, tempOptions);
        
                                    // flickotySlider.on('staticClick', function(event, pointer, cellElement, cellIndex){
                                    // //     // KK: PS03: Klick auf das 1. Produkt aus Reco-Element
                                    // //     // KK: PS03: Klick auf das 2. Produkt aus Reco-Element
                                    // //     // KK: PS03: Klick auf das 3. Produkt aus Reco-Element
                                    // //     // KK: PS03: Klick auf das 4. Produkt aus Reco-Element
                                    // //     // pushGoalAgain('click_product_' + (cellIndex + 1));
                                    // //     WATO.goalPush('click_product_' + (cellIndex + 1), true);
                                    // //     // window.iridion.push(["segment", '32890']);

                                    //     WATO.goalPush('klick_recoSimilarProduct', true);
                                    // });
        
                                    // flickotySlider.on('dragStart', function() {
                                    //     WATO.goalPush('click_product_change');
                                    // });
    
                                    // flickotySlider.on('touchmove', function() {
                                    //     WATO.goalPush('kk26_swipe_reco');
                                    // });

                                }else{
                                    $("#kk_likethiswrapper").hide();
                                }
                            };

                            var n = $("#kk_likethisproduct"), 
                                a = n.data("accountid"), 
                                o = n.data("wid"), 
                                s = n.data("product"), 
                                r = n.data("count"),
                                l = new window.econda.recengine.Widget({
                                    element: n,
                                    renderer: {
                                        type: "function",
                                        rendererFn: i.horizontal
                                    },
                                    accountId: a,
                                    id: o,
                                    context: {
                                        products: [{
                                            id: s
                                        }]
                                    },
                                    chunkSize: r,
                                    empty: function(e) {
                                        this._onSuccessfulResponse(e)
                                    }
                                });
    
                            l.render();
                            
                            
                        }
                    });
                }
            });
        }

        if(variation === 1 || (variation === 3 && !sawNowProductFromReco)){
            // V1 || V3

            // Reco von unten auf der Seite nach oben geschoben
            WATO.elem('[data-componentid="CrossSellingEconda"]', function(crossSellingEconda){
                if(crossSellingEconda){ 
                    crossSellingEconda = crossSellingEconda[0];
                    
                    var qualiBadges = WATO.qs('.medium-uncollapse > .kk_quali'),
                        productInfos = WATO.qs('.medium-uncollapse > .small-12:not(.js-product-reference)'),
                        ctlWrapper = WATO.qs('.js-completeTheLookWrapper', crossSellingEconda.parentNode);

                    // Originale Reco wird nach oben verschoben, da diese schon lange zum laden braucht
                    // und dann kann der Benutzer früher die Reco sehen.
                    if(qualiBadges){
                        qualiBadges.insertAdjacentElement('afterend', crossSellingEconda);
                    }else if(productInfos){
                        productInfos.insertAdjacentElement('beforebegin', crossSellingEconda);
                    }

                    // Sobald die Produkte der Reco geladen sind
                    WATO.elem('#ecRecommendationsContainer .productitem', function(hereWhereTheProduts){
                        if(hereWhereTheProduts){

                            // ... wird ein Klon erstellt
                            var theClone = WATO.qs('[data-componentid="CrossSellingEconda"]').cloneNode(true);

                            // der Slider im Klon bekommt eine eigene ID zur besseren unterscheidung
                            WATO.qs('#ecRecommendationsContainer', theClone).setAttribute('id', 'kk_recobottom');

                            // Klon wird platziert wo sich zuvor die original Reco befand
                            ctlWrapper.insertAdjacentElement('afterend', theClone);

                            // Slider-Produkte werden in den Wrapper des Sliders neu plaziert damit die initialisierung der Sliders funktioniert
                            var newSliderAtBottom = WATO.qs('#kk_recobottom');
                            newSliderAtBottom.innerHTML = WATO.qs('.flickity-slider', newSliderAtBottom).innerHTML;

                            WATO.elem(function(){
                                return WATO.qs('.item__image', newSliderAtBottom).offsetHeight > 50;
                            }, function(element){
                                if(element){
                                    initSlider(newSliderAtBottom, "nachhaltig");
                                }
                            });
                        }
                    });
                }
            });

            colorWasChanged(function() {

                WATO.elem('#ecRecommendationsContainer .flickity-slider', function(element){
                    if(element){
                        var thisReco = WATO.qs('#ecRecommendationsContainer:not(.flickity-enabled)');
                        thisReco.innerHTML =  element[0].innerHTML;

                        WATO.elem(function(){
                            return WATO.qs('.item__image', thisReco).offsetHeight > 50;
                        }, function(element){
                            if(element){
                                initSlider(thisReco, "nachhaltig");
                            }
                        });
                    }
                });

                // WATO.elem('#ecRecommendationsContainer > .productitem', function(ecRecommendationsContainer){
                //     if(ecRecommendationsContainer){

                //         // Bei Farbänderung wird der Slider neu initialisiert
                //         ecRecommendationsContainer[0].parentNode.parentNode.innerHTML = ecRecommendationsContainer[0].parentNode.parentNode.innerHTML;

                //         initSlider('#ecRecommendationsContainer');
                //     }
                // });
            });

        }else if(variation === 2 || (variation === 3 && sawNowProductFromReco)){
            // V2 || V3

            WATO.ab26global("aenlich");

            // SKU (ProduktID) die ersten 5 Ziffern sind die HauptKennung die Ziffer 6 und 7 stehen für den Farbcode
            var skuMainID = WATO.qs('meta[property="product:upc"]').getAttribute('content');

            likeThisArticleReco(skuMainID.substring(0,7));

            colorWasChanged(function() {
                // Gibt es eine aktive Farbauswahl
                var selectedColorID = WATO.qs('.js-color-bubbles .active');

                likeThisArticleReco(selectedColorID ? (skuMainID.substring(0,5) + selectedColorID.getAttribute('data-color')) : skuMainID.substring(0,7));
            });
        }
    };
	
})(window.WATO, window);