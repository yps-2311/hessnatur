// load core and global js
// @ codekit-prepend "../global/global.js";


/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    window.iridion.econda.push(["HN02", "V1"]);

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    WATO.exclude(1023, function(){
        window.location.reload();
        window.location.href=location.href.split('#')[0];
    });

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

    function createNewReco(prodId) {

        if(!prodId) {
            prodId = 'prodId1';
        }

        var thisReco = WATO.qs(".kk_reco");

        WATO.ajaxCallback("https://widgets.crosssell.info/eps/crosssell/recommendations/", function(responseContent) {
            // console.log("ajax");
            try {
                if(responseContent && responseContent.length > 0){

                    var recoJSON = JSON.parse(responseContent),
                        thisTrackingID = recoJSON.widgetdetails.tracking;
                    
                    // console.log('recoJSON: ', recoJSON);
                    // console.log('thisTrackingID: ', thisTrackingID);

                    // console.log('pageID: ', pageID);
                    // console.log('recoJSON.widgetdetails.tracking.emcs1: ', recoJSON.widgetdetails.tracking.emcs1);
                    // console.log('recoJSON.widgetdetails.tracking.emcs1.indexOf(pageID): ', recoJSON.widgetdetails.tracking.emcs1.indexOf(pageID));
                    if(thisTrackingID.emcs1.indexOf(pageID) !== -1){

                        var recoProducts = recoJSON.items,
                            htmlMarkup = "";

                        // console.log('recoProducts: ', recoProducts);

                        for (var i = 0; i < recoProducts.length; i++) {

                            try {
                                var thisProduct = recoProducts[i],
                                    streichPreis = thisProduct.oldprice,
                                    link = thisProduct.deeplink,
                                    emcs2 = thisTrackingID.emcs2;
                                    
                                // console.log('thisProduct: ', thisProduct);
                                // console.log('streichPreis: ', streichPreis);
                                // console.log('link: ', link);

                                // https://www.hessnatur.com/de/minikleid-aus-schurwolle-mit-kaschmir/p/407451634?utm_source=Email&utm_medium=hessnatur&utm_campaign=Reco&et_uk=fdb86430931c4a6581f6be5566d31566
                                // https://www.hessnatur.com/de/langarm-shirt-aus-reiner-bio-baumwolle/p/433424034?utm_source=Email&utm_medium=hessnatur&utm_campaign=Reco&emcs0=79_Topseller_DOB_WTR&emcs1=71_Startseite&emcs2=null&emcs3=43342&et_uk=fdb86430931c4a6581f6be5566d31566


                                // emcs0=79_Topseller_DOB_WTR&emcs1=71_Startseite&emcs2=null&emcs3=47515

                                // console.log('thisTrackingID.emcs0: ', thisTrackingID.emcs0);
                                // console.log('thisTrackingID.emcs1: ', thisTrackingID.emcs1);
                                // console.log('thisTrackingID.emcs2: ', thisTrackingID.emcs2);

                                if(!link){
                                    link = "https://www.hessnatur.com/de/p/"+thisProduct.sku;
                                }
                                // console.log('link: ', link);

                                htmlMarkup += 
                                    '<div class="productitem text-center small-8 medium-5 large-3 columns">'+
                                        '<a href="'+link+((link.indexOf('?') === -1) ? '?' : '&' )+'emcs0='+thisTrackingID.emcs0+'&emcs1='+thisTrackingID.emcs1+'&emcs2='+(emcs2 ? emcs2 : "null")+'&emcs3='+thisProduct.id+'" class="item__image">'+
                                            '<img src="'+thisProduct.iconurl.replace("_large/","_medium/")+'">'+
                                            '<div class="item__desc h-smallOffset-top-outer">'+
                                                '<h4 class="desc-name">'+thisProduct.name+'</h4>'+

                                                '<div class="desc-price">'+
                                                    '<span class="price full '+(!streichPreis ? "hide":"show")+'">'+streichPreis+'</span>&nbsp;&nbsp;<span class="price special '+(!streichPreis ? "hide":"show")+'">'+thisProduct.price+'</span>'+
                                                    '<span class="price '+(streichPreis ? "hide":"show")+'">'+thisProduct.price+'</span>'+
                                                '</div>'+

                                                // Streichpreis Markup
                                                // '<div class="desc-price">'+
                                                //     '<span class="price full show">24,95 €</span>&nbsp;&nbsp;<span class="price special show">11,95 €</span>'+
                                                //     '<span class="price hide">11,95 €</span>'+
                                                // '</div>'+

                                            '</div>'+
                                        '</a>'+
                                    '</div>';

                            } catch (error) {
                                console.log('Error: ', error);
                            }
                            
                        }

                        // console.log('htmlMarkup: ', htmlMarkup);
                        // console.log('thisReco: ', thisReco);
                        thisReco.innerHTML = htmlMarkup;

                        // Auf jQuery und Gallerie Funktion warten
                        WATO.elem(function(){
                            return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                        }, function(){
                            try {
                                // console.log("slider");

                                // Slider Options
                                var sliderOptions = {
                                    cellAlign: 'left',
                                    cellSelector: '.productitem',
                                    draggable: true,
                                    wrapAround: true,
                                    pageDots: false,
                                    // groupCells: true,
                                    groupCells: 4
                                };

                                // Init Slider
                                var theSlider = jQuery('.kk_reco');
                                theSlider.flickity(sliderOptions);

                                var interval = setInterval(function(){
                                    theSlider.flickity('resize');
                                    if(jQuery('.kk_reco .productitem:first-child').height() > 80){
                                        clearInterval(interval);

                                        jQuery('.kk_reco a').click(function(){
                                            window.iridion.push(['goal', 'klick_recoProduct', '', true]);
                                        });
                                    }
                                }, 100);
                                setTimeout(function(){
                                    clearInterval(interval);
                                }, 5000);

                            } catch (error) {
                                // console.log(error);
                                WATO.goalPush("wa_setup_monitoring");
                            }
                        });
                    }

                }

            } catch (error) {
                // console.log('Error: ', error);
                WATO.goalPush("wa_setup_monitoring");
            }
        });

        var widget = new window.econda.recengine.Widget({
            // element: thisReco,
            accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
            id: pageID,
            context: {
                // products: [{ id: 'prodId1' }, { id: 'prodId2' }]
                products: [{ id: prodId }]
            }
        });
        widget.render();
    }

    if(pageURL.indexOf("/p/") !== -1){
        // PDS
        pageID = 91;
        // console.log('pageID: ', pageID);
        
        WATO.elem('.js-product-reference[data-componentid="CrossSellingEconda"]:not(.kk_newReco)', function(oldReco){
            if(oldReco){
                oldReco = oldReco[0];
                // console.log('oldReco: ', oldReco);

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

                WATO.elem('input[name="ff_id"]', function(ff_id){
                    if(ff_id) {
                        createNewReco(ff_id[0].value);
                        removeObject(oldReco);
                    }
                });
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
    
    // console.log('pageID: ', pageID);



})(new window.WATO());


//!function(e){"use strict";function i(e){e&&e.parentNode.removeChild(e)}window.iridion.econda.push(["HN02","V1"]),e.exclude(1023,function(){window.location.reload(),window.location.href=location.href.split("#")[0]});var n=90,c=document.location.pathname,s='<div class="rteContainer"><div style="text-align: center"><h2>Diese Produkte könnten Ihnen gefallen:</h2></div></div><div class="kk_newReco small-12 columns js-product-reference"><div class="small-12 columns"><div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer"><div class="column small-12 h-no-padding-medium-down"><div class="kk_reco flickity-productslider js-ecReco"></div></div></div></div></div>';function t(i){i||(i="prodId1");var c=e.qs(".kk_reco");e.ajaxCallback("https://widgets.crosssell.info/eps/crosssell/recommendations/",function(i){try{if(i&&i.length>0){var s=JSON.parse(i);if(-1!==s.widgetdetails.tracking.emcs1.indexOf(n)){for(var t=s.items,r="",o=0;o<t.length;o++){var d=t[o],a=d.oldprice,l=d.deeplink;r+='<div class="productitem text-center small-8 medium-5 large-3 columns"><a href="'+l+(-1===l.indexOf("?")?"?":"&")+"emcs0=79_Startseite&emcs1=79_Startseite&emcs2=null&emcs3="+d.id+'" class="item__image"><img src="'+d.iconurl.replace("_large/","_medium/")+'"><div class="item__desc h-smallOffset-top-outer"><h4 class="desc-name">'+d.name+'</h4><div class="desc-price"><span class="price full '+(a?"show":"hide")+'">'+a+'</span>&nbsp;&nbsp;<span class="price special '+(a?"show":"hide")+'">'+d.price+'</span><span class="price '+(a?"hide":"show")+'">'+d.price+"</span></div></div></a></div>"}c.innerHTML=r,e.elem(function(){return"undefined"!=typeof window.jQuery&&"undefined"!=typeof window.Flickity},function(){try{var i=jQuery(".kk_reco");i.flickity({cellAlign:"left",cellSelector:".productitem",draggable:true,wrapAround:true,pageDots:false,groupCells:4});var n=setInterval(function(){i.flickity("resize"),jQuery(".kk_reco .productitem:first-child").height()>80&&(clearInterval(n),jQuery(".kk_reco a").click(function(){window.iridion.push(["goal","klick_recoProduct","",true])}))},100);setTimeout(function(){clearInterval(n)},5e3)}catch(i){e.goalPush("wa_setup_monitoring")}})}}}catch(i){e.goalPush("wa_setup_monitoring")}}),new window.econda.recengine.Widget({accountId:"00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1",id:n,context:{products:[{id:i}]}}).render()}if(-1!==c.indexOf("/p/"))n=91,e.elem(".js-product-reference:not(.kk_newReco)",function(n){n&&((n=n[0]).insertAdjacentHTML("afterend",'<div class="kk_newReco small-12 columns js-product-reference"><div class="small-12 columns"><div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer"><div class="column small-12 h-mediumOffset-bottom-outer"><div class="h4 text-center">Diese Produkte könnten Ihnen gefallen</div></div><div class="column small-12 h-no-padding-medium-down"><div class="kk_reco flickity-productslider js-ecReco"></div></div></div></div></div>'),e.elem('input[name="ff_id"]',function(e){e&&(t(e[0].value),i(n))}))});else if("/de/"===c)e.elem(".mainTeaser",function(e){e&&(e[0].insertAdjacentHTML("afterend",s),t())}),e.elem(".js-product-reference:not(.kk_newReco)",function(e){e&&(i((e=e[0]).previousElementSibling),i(e))});else{switch(c){case"/de/damen":n=96;break;case"/de/herren":n=93;break;case"/de/baby":n=94;break;case"/de/home":n=95;break;case"/de/sale":n=92}e.elem(".js-product-reference:not(.kk_newReco)",function(e){e&&((e=e[0]).insertAdjacentHTML("afterend",s),t(),i(e.previousElementSibling),i(e))})}}(new window.WATO);
