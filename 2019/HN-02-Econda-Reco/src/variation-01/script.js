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

    // function pushGoal(key) {
    //     window.iridion.push(['goal', 's5_' + key]);
    // }

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    console.log("Reco");

    var pageID = 90,
        pageURL = document.location.pathname,
        templateHomeAndSortiment = '<div class="rteContainer">'+
                '<div style="text-align: center">'+
                    '<h2>Diese Produkte könnten Ihnen gefallen:</h2>'+
                '</div>'+
            '</div>'+
            '<div class="kk_newReco small-12 columns js-product-reference">'+
                '<div class="small-12 columns">'+
                    '<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                        '<div class="column small-12 h-no-padding-medium-down">'+
                            '<div class="kk_reco flickity-productslider js-ecReco">'+
                                // Hier werden die Produkte eingefügt
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';

    function createNewReco() {
        var thisReco = WATO.qs(".kk_reco");

            WATO.ajax("https://widgets.crosssell.info/eps/crosssell/recommendations/", function(responseContent) {
                // console.log('responseContent: ', responseContent);
                try {
                    var recoJSON = JSON.parse(responseContent);

                    if(recoJSON.widgetdetails.tracking.emcs1.indexOf(pageID) !== -1){

                        var recoProducts = recoJSON.items,
                            htmlMarkup = "";
    
                        for (var i = 0; i < recoProducts.length; i++) {
                            var thisProduct = recoProducts[i];
    
                            htmlMarkup += 
                                '<div class="productitem text-center small-8 medium-5 large-3 columns">'+
                                    '<a href="'+thisProduct.deeplink+'" class="item__image">'+
                                        '<img src="'+thisProduct.iconurl.replace("_large/","_medium/")+'">'+
                                        '<div class="item__desc h-smallOffset-top-outer">'+
                                            '<h4 class="desc-name">'+thisProduct.name+'</h4>'+
                                            '<div class="desc-price">'+
                                                '<span class="price full hide">undefined</span>&nbsp;&nbsp;<span class="price special hide">'+thisProduct.price+'</span>'+
                                                '<span class="price show">'+thisProduct.price+'</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</a>'+
                                '</div>';
                        }

                        thisReco.innerHTML = htmlMarkup;

                        // Auf jQuery und Gallerie Funktion warten
                        WATO.elem(function(){
                            return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                        }, function(){
                            try {
                                console.log("slider");

                                // Slider Options
                                var sliderOptions = {
                                    cellAlign: 'left',
                                    cellSelector: '.productitem',
                                    draggable: true,
                                    wrapAround: true,
                                    pageDots: false,
                                    groupCells: true,
                                    groupCells: 4
                                }

                                // Init Slider
                                var theSlider = jQuery('.kk_reco');
                                theSlider.flickity(sliderOptions);

                                var interval = setInterval(function(){
                                    if(jQuery('.kk_reco .productitem:first-child').height() > 70){
                                        console.log("interval");
                                        clearInterval(interval);
                                        theSlider.flickity('resize');
                                    }
                                }, 100);
                                setTimeout(function(){
                                    clearInterval(interval);
                                }, 5000);

                            } catch (error) {
                                console.log(error);
                                // WATO.goalPush("wa_setup_monitoring");
                            }
                        });
                    }

                } catch (error) {
                    console.log('Error: ', error);
                }
            });

            var widget = new econda.recengine.Widget({
                element: thisReco,
                accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
                id: pageID,
                context: {
                    products: [{ id: 'prodId1' }, { id: 'prodId2' }]
                }
            });
            widget.render();
    }

    if(pageURL.indexOf("/p/") !== -1){
        // PDS
        pageID = 91;
        
        WATO.elem('.js-product-reference:not(.kk_newReco)', function(oldReco){
            if(oldReco){
                oldReco = oldReco[0];

                oldReco.insertAdjacentHTML('afterend', 
                    '<div class="kk_newReco small-12 columns js-product-reference">'+
                        '<div class="small-12 columns">'+
                            '<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                                '<div class="column small-12 h-mediumOffset-bottom-outer">'+
                                    '<div class="h4 text-center">Diese Produkte könnten Ihnen gefallen</div>'+
                                '</div>'+
                                '<div class="column small-12 h-no-padding-medium-down">'+
                                    '<div class="kk_reco flickity-productslider js-ecReco">'+
                                        // Hier werden die Produkte eingefügt
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                );
                createNewReco();

                removeObject(oldReco);
            }
        });

    }else if(pageURL === "/de/"){
        // Startseite

        // Unterhalb der Bühne wird der neue Slider eingebaut
        WATO.elem('.mainTeaser', function(mainTeaser){
            if(mainTeaser){
                mainTeaser[0].insertAdjacentHTML('afterend', templateHomeAndSortiment);
                createNewReco();
            }
        });

        WATO.elem('.js-product-reference:not(.kk_newReco)', function(oldReco){
            if(oldReco){
                oldReco = oldReco[0];
    
                removeObject(oldReco.previousElementSibling);
                removeObject(oldReco);
            }
        });
        
    }else{
        // Sortimentseiten

        switch (pageURL) {
            case "/de/damen":
                pageID = 96;
                break;
            case "/de/herren":
                pageID = 93;
                break;
            case "/de/baby":
                pageID = 94;
                break;
            case "/de/home":
                pageID = 95;
                break;
            case "/de/sale":
                pageID = 92;
                break;
        }

        WATO.elem('.js-product-reference:not(.kk_newReco)', function(oldReco){
            if(oldReco){
                oldReco = oldReco[0];

                oldReco.insertAdjacentHTML('afterend', templateHomeAndSortiment);
                createNewReco();
                
                removeObject(oldReco.previousElementSibling);
                removeObject(oldReco);
            }
        });
    }
    
    console.log('pageID: ', pageID);



})(new window.WATO());