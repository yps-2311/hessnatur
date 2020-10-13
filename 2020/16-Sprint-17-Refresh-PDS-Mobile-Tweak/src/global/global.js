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

    WATO.prototype.goalPush = function(key, sendOnNextPageView){
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    };

    WATO.prototype.sprint17goals = function(variante){
        var _self = this;

        function clickgoal(queryparameter, goalname) {
            _self.elem(queryparameter, function(element){
                if(element){
                    element[0].addEventListener('click', function(){
                        _self.goalPush(goalname);
                    });
                }
            });
        }

        clickgoal('div[data-share="Facebook"]', "kk17_facebook");
        clickgoal('div[data-share="Twitter"]', "kk17_twitter");
        clickgoal('div[data-share="Pinterest"]', "kk17_pinterest");
        clickgoal('a.starRatingWrapper', "kk17_bewertungen_anker");

        clickgoal('#ecRecommendationsContainer', "kk17_reco");

        _self.elem('#addToCartButton', function(addToCartButton){
            if(addToCartButton){
                addToCartButton[0].addEventListener('click', function(){
                    _self.elem('#sizeSelectReminder[aria-hidden="false"]', function(sizeSelectReminder){
                        if(sizeSelectReminder){
                            _self.goalPush('kk17_addtocart_withoutsize');
                        }
                    });
                });
            }
        });

        
        if(variante === 0){
            clickgoal('#accordion-rating-label', "kk17_rating");
            clickgoal('#accordion-rating .js_showAdditionalItems', "kk17_rating");

            clickgoal('#Produktbeschreibung-label', "kk17_Produktbeschreibung");
            clickgoal('#Ausgezeichnete_Qualitaet-label', "kk17_Ausgezeichnete_Qualitaet");
            clickgoal('#Passform-label', "kk17_Passform");
            clickgoal('#Made_In-label', "kk17_Made_In");
            clickgoal('#Pflege-label', "kk17_Pflege");
            clickgoal('#Material-label', "kk17_Pflege");
        }
    };


    WATO.prototype.sprint17 = function(variante){
        /*jshint loopfunc: true */

        window.document.documentElement.classList.add('kk_sp17');

        var _self = this,
            sendGoalScrollToEnd = false;

        // Element entfernen
        function removeObject(el) {
            if(el){
                el.parentNode.removeChild(el);
            }
        }

        function initGallery(galID, adaptiveHeight) {
            _self.elem(function(){
                return typeof $ !== "undefined";
            }, function(isjq){
                if(isjq){
                    // Doku https://flickity.metafizzy.co/
                    // console.log('$(galID): ', $(galID));
                    var thisGal = $(galID);

                    thisGal.flickity({
                        // options
                        draggable: true,
                        cellAlign: 'left',
                        contain: true,
                        prevNextButtons: false,
                        pageDots: false,
                        percentPosition: true,
                        setGallerySize: true,
                        adaptiveHeight: !!adaptiveHeight
                    });

                    if(galID === '#infoTabs'){
                        thisGal.on( 'scroll.flickity', function( event, progress ) {
                            if(progress > 1 && !sendGoalScrollToEnd){
                                _self.goalPush("kk17_scrolltoend");
                                sendGoalScrollToEnd = true;
                            }
                        });
                    }
                }
            });
        }


        // Send JSON data
        function getXHR(sendtype ,url, callback, data) {
                        
            var XHR = new XMLHttpRequest();

            // Set up our request
            XHR.open(sendtype, url);
            
            // Add the required HTTP header for form data POST requests
            // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            XHR.onreadystatechange = function() { // Call a function when the state changes.
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    // Request finished. Do processing here.
                    callback(this);
                }
            };

            // Finally, send our data.
            XHR.send(data||true);
        }

        // Galerie erstellen
        function buildGallery(bigPicture, markup, farbID, imgValue) {

            _self.elem('.pds-cockpit__wrapper', function(mainContent){
                if(mainContent){
                    try {
                        mainContent = mainContent[0];

                        var mainContentWrapper = mainContent.parentNode;
                        
                        // falls die Galerie mit einer anderen Farbe schon vorhanden ist wird diese entfernt
                        removeObject(_self.qs(".kk_slider", mainContentWrapper));

                        // Alle anderen Galerien der Seite werden ebenfalls entfernt da es sonst nach dem initalisieren zu fehlern kommt
                        removeObject(_self.qs(".show-for-medium-only.column.small-12.medium-6", mainContentWrapper));
                        removeObject(_self.qs(".pds-productImage__mzThumbsWrapper.js_magicZoomThumbWrapper", mainContentWrapper));
                        removeObject(_self.qs(".js_magicZoomKeyVisualWrapper", mainContentWrapper));
                        removeObject(_self.qs(".column.small-12.hide-for-medium.h-smallmediumOffset-bottom-outer.h-no-padding", mainContentWrapper));

                        // Markup der neuen Galerie
                        mainContent.insertAdjacentHTML('beforebegin', 
                                '<div id="kk_slider'+farbID+'" class="h-largeOffset-bottom-outer kk_slider">'+
                                        bigPicture+
                                    '<div class="kk_sliderThumbs">'+
                                        markup+
                                    '</div>'+
                                '</div>'
                            );
                        
                        if(imgValue === 1){
                            mainContent.parentNode.classList.add("kk_onlyone");
                        }
                        // Außer beim initialen laden, muss die Magiczoom funktion die neue Galerie initalisieren
                        if(farbID !== 0){
                            _self.elem(function(){
                                // Falls noch nicht geladen
                                return typeof window.MagicZoom !== "undefined";

                            }, function(){
                                // init MagicZoom
                                window.MagicZoom.start();
                            });
                        }

                        // Nur für Entwicklung
                        setTimeout(function(){
                            window.MagicZoom.start();
                        }, 1000);
                    } catch (error) {
                        _self.goalPush("wa_setup_monitoring");
                        // console.log('Error: ', error);
                    }
                    
                }
            });
        }

        // Informationen zur Galerie werden zusammengestellt
        function buildGalleryWrapper(colorID) {

            _self.elem(function() {
                if(colorID){
                    // Wenn auf der Seite die Informationen aller Produktfarben verfügbar sind
                    // können diese genutzt werden um selbst die neue Galerie zu erstellen
                    // liegen alle in indow.ACC.productDetail.galleryImages
                    return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
                }else{
                    return true;
                }
            }, function(avalibeColorImages){
                if(avalibeColorImages){

                    var onlyOneImage = 0;

                    if(colorID){
                        // Galerie nach Farbwechsel

                        // Wird aus window.ACC.productDetail.galleryImages gebaut
                        colorID = parseInt(colorID);

                        var galleryImgs = window.ACC.productDetail.galleryImages,
                            mainPicColor = "",
                            markupHTMLColor = "";

                        // Galerie wird mit den BilderURLs erstellt
                        for (var j = 0; j < galleryImgs.length; j++) {
                            var thisProduct = galleryImgs[j];
                            if(parseInt(thisProduct.product.color) === colorID){

                                var picURL = thisProduct.zoom.url,
                                    altText = thisProduct.zoom.altText,
                                    picReco = picURL.replace("_zoom/","_reco/"),
                                    picThumb = picURL.replace("_zoom/","_thumb/");

                                    markupHTMLColor +=   '<a data-zoom-id="zoomMedium" class="thumbnailContainer js_thumbnailContainer mz-thumb" href="'+picURL+'" data-color="'+colorID+'" data-image="'+picReco+'">'+
                                                    '<img src="'+picThumb+'" alt="'+altText+'" data-color="'+colorID+'">'+
                                                '</a>';

                                if(mainPicColor === ""){
                                    mainPicColor =   '<a class="MagicZoom" data-options="hint: always; zoomPosition: inner" id="zoomMedium" href="'+picURL+'">'+
                                                    '<img src="'+picReco+'" alt="'+altText+'">'+
                                                '</a>';
                                }
                                onlyOneImage++;

                                // _self.qs(".js-jump-complete-look").setAttribute('style', 'background-image: url('+picThumb+')');
                            }
                        }

                        buildGallery(mainPicColor, markupHTMLColor, colorID, onlyOneImage);

                    }else{
                        // Galerie initialer Seitenaufruf

                        var mainPicInitial = "",
                            markupHTMLInitial = "";

                            _self.elem('meta[property="og:image"]', function(initPic){
                            if(initPic){
                                var initPicLength = initPic.length;
                                
                                // Farben
                                _self.elem('.pds-cockpit__colorSwitch li a', function(colorSwitch){
                                    if(colorSwitch){
                                        try {
                                            var firstPic = initPic[0].getAttribute("content").replace("detail_zoom","detail_thumb"),
                                                prodID = firstPic.match(/\d{5}/),
                                                numberOfColors = colorSwitch.length;

                                            for (var j = 0; j < numberOfColors; j++) {
                                                var thisColorLink = colorSwitch[j];

                                                thisColorLink.innerHTML = '<img src="'+firstPic.split(prodID)[0] + prodID + '_' + thisColorLink.parentNode.getAttribute('data-color') +'_7.jpg">'; //  + imgNumber +

                                                thisColorLink.addEventListener('click', changeColor);
                                            }
                                        } catch (error) {
                                            _self.goalPush("wa_setup_monitoring1");
                                            // console.log('Error: ', error);
                                        }
                                    }
                                });
                    
                                // Die Galeriebilder liegen in Metadaten im Head
                                for (var i = 0; i < initPicLength; i++) {

                                    var picURL = initPic[i].getAttribute("content"),
                                        altText = _self.qs('meta[property="twitter:title"]').getAttribute("content"),
                                        picReco = picURL.replace("_zoom/","_reco/"),
                                        picThumb = picURL.replace("_zoom/","_thumb/");

                                        markupHTMLInitial += '<a data-zoom-id="zoomMedium" class="thumbnailContainer js_thumbnailContainer mz-thumb" href="'+picURL+'" data-color="" data-image="'+picReco+'">'+
                                                                '<img src="'+picThumb+'" alt="'+altText+'" data-color="">'+
                                                            '</a>';

                                    if(mainPicInitial === ""){
                                        mainPicInitial = '<a class="MagicZoom" data-options="hint: always; zoomPosition: inner" id="zoomMedium" href="'+picURL+'">'+
                                            '<img src="'+picReco+'" alt="'+altText+'">'+
                                        '</a>';
                                    }
                                }

                                onlyOneImage = initPic.length;
                            }
                        });
                        
                        buildGallery(mainPicInitial, markupHTMLInitial, 0, onlyOneImage);
                    }
                }
            });
        }

        // Farbe gewächselt
        function changeColor(e) {
            var thisTarget = e.target.parentNode.getAttribute("data-color");

            if(!thisTarget){
                thisTarget = e.target.parentNode.parentNode.getAttribute("data-color");
            }
            
            // Ausgewählte Farbe an Galerie übergeben
            buildGalleryWrapper(parseInt(thisTarget));

            createCTL();
        }

        // Klick auf mehr Details
        _self.elem('.js-pds-more-details', function(moreDetails){
            if(moreDetails){
                moreDetails[0].addEventListener('click', function(e){
                    e.preventDefault();
                    _self.goalPush("klick_produktdetails");

                    setTimeout(function(){
                        try {
                            window.ACC.global.scrollToElement($("#kk_infoTabs"));
                        } catch (error) {
                            // console.log('Error: ', error);
                        }
                    }, 100);
                });
            }
        });


        function addClass(elem, thisclassname) {
            if(elem){
                elem.classList.add(thisclassname);
            }
        }
        function removeClass(elem, thisclassname) {
            if(elem){
                elem.classList.remove(thisclassname);
            }
        }

        // Zurück-Button
        _self.elem('.breadcrumb--back a', function(breadcrumb){
            if(breadcrumb){
                breadcrumb = breadcrumb[0];
                breadcrumb.innerHTML = 'zurück';
                breadcrumb.addEventListener('click', function(){
                    _self.goalPush("kategorie_back", true);
                });
            }
        });

        function tabInteraction(i) {
            _self.qs(".kk_carousel[data-index='"+i+"']").addEventListener('click', function(e){
                var thisTarget = e.target,
                    thisKey = thisTarget.getAttribute('data');

                removeClass(_self.qs(".kk_show"), 'kk_show');
                removeClass(_self.qs(".kk_active"), 'kk_active');

                addClass(_self.qs("#"+thisKey), 'kk_show');
                addClass(thisTarget, 'kk_active');

                _self.goalPush('kk17_'+thisKey);
            });
        }

        // Größenberatung Fallback
        _self.elem('#size_advisor', function(sizeAdvisor){
            if(sizeAdvisor){
                sizeAdvisor[0].setAttribute('href', "/de/groessenberatung");
            }
        });

        // Initaile Galerie erstellen
        buildGalleryWrapper();

        // Produktdetails vom Akordion in einen Slider umbauen
        _self.elem('.productInfoAccordion .accordion-item', function(productInfoAccordionItem){
            if(productInfoAccordionItem){

                var prodInfoAccordion = productInfoAccordionItem[0].parentNode;

                // Tabs
                prodInfoAccordion.insertAdjacentHTML('beforebegin', '<div id="kk_infoTabs"></div><div id="kk_infoContent"></div>');

                // Erstes Tab einblenden
                _self.qs("div", productInfoAccordionItem[0]).classList.add('kk_show');
                
                var infoTabs = _self.qs("#kk_infoTabs", prodInfoAccordion.parentNode),
                    infoContent = _self.qs("#kk_infoContent", prodInfoAccordion.parentNode);

                for (var i = 0; i < productInfoAccordionItem.length; i++) {
                    var prodContent = _self.qs("div", productInfoAccordionItem[i]),
                        tabText = prodContent.previousElementSibling.textContent;

                    // Umtexten
                    if(tabText === "Produktbeschreibung") {
                        tabText = "Produktdetails";

                        infoTabs.insertAdjacentHTML('beforeend', 
                            '<div class="kk_carousel kk_active" data-index="'+i+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                        );

                        addClass(prodContent.parentNode, "kk_hide");

                        infoContent.insertAdjacentElement('afterbegin', prodContent);

                        // Interaktion mit Tabs
                        tabInteraction(i);
                        
                        _self.qs(".pds-productDescription__text", prodContent).parentNode.insertAdjacentHTML('afterend', 
                            _self.qs(".pds-cockpit__shortDescription").outerHTML+
                            _self.qs(".pds-cockpit__articleNumber").outerHTML
                        );

                    }else if(tabText === "Passform") {
                        infoTabs.insertAdjacentHTML('beforeend', 
                            '<div class="kk_carousel" data-index="'+i+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                        );

                        addClass(prodContent.parentNode, "kk_hide");

                        infoContent.insertAdjacentElement('afterbegin', prodContent);

                        // Interaktion mit Tabs
                        tabInteraction(i);
                    }else if(tabText === "Pflege") {

                        var material = _self.qs("#Material", productInfoAccordionItem[0].parentNode);

                        material.previousElementSibling.innerHTML = "Material & Pflege";

                        material.insertAdjacentHTML('beforeend', 
                            prodContent.innerHTML
                        );
                        
                    }
                    // else{

                    //     // Fallback
                    //     prodContent.previousElementSibling.addEventListener('click', function(e){
                    //         console.log("klick");
                    //         var thisTarget = e.target;
                    //         setTimeout(function(){
                    //             thisTarget.parentNode.classList.contains('')
                                

                    //         }, 300);
                    //     });

                    // }
                }

                var articleNumber = _self.qs(".pds-cockpit__articleNumber"),
                    articleNumberID = _self.qs("span", articleNumber).textContent.trim(),
                    colorNumber = _self.qs(".pds-cockpit__colorSwitch .active").getAttribute('data-color');

                // Artikelnummer wird nach unten in den Content-Bereich verschoben
                var prodInfoContent = _self.qs("#Produktbeschreibung > .row", productInfoAccordionItem[0]);

                if(prodInfoContent && articleNumber){
                    prodInfoContent.insertAdjacentElement('afterend', articleNumber.cloneNode(true));
                }

                // Infos zum Produkt laden (nicht immer vorhanden) um Infos zur Nachhaltigkeit anzuzeigen
                getXHR("GET","https://products.hessnatur.com/products/"+articleNumberID+colorNumber, function(callbackContent) {
                    var respText = callbackContent.responseText;
                    if(respText.length > 0){
                        try {
                            var responseJSON = JSON.parse(respText),
                                data = responseJSON.products[0].ecological_data,
                                savingWater = data.water_savings_in_liter,
                                savingMeter = data.clean_earth_consumption_in_square_meter.toFixed(1);

                            console.log('savingWater: ', savingWater);
                            console.log('prodInfoAccordion: ', prodInfoAccordion);
                            if(savingWater !== 0){
                                prodInfoAccordion.parentNode.insertAdjacentHTML('afterend', 
                                    '<div class="kk_nachhaltig">'+
                                        '<h4>Ökologische Ersparnis: <span>Im Vergleich zum konventionellen Baumwollanbau</span></h4>'+
                                        '<div class="kk_water">'+
                                            '<h5>'+Math.round(savingWater)+' l<b>weniger<br>Wasserverbrauch</b></h5>'+
                                            '<p>91% Einsparung von Wasser durch Verwendung von Regenwasser, im Boden gespeicherte Feuchtigkeit und Anwendung verbrauchsarmer Bewässerungsmethoden.</p>'+
                                        '</div>'+
                                        '<div class="kk_cloud">'+
                                            '<h5>46% <b>weniger<br>CO<sub>2</sub>-Ausstoß</b></h5>'+
                                            '<p>46% CO<sub>2</sub> Einsparung durch weniger energieintensive Arbeitsmethoden im Bio-Anbau und den Verzicht auf Mineraldünger und Pestizide.</p>'+
                                        '</div>'+
                                        '<div class="kk_earth">'+
                                            '<h5>'+savingMeter+'m<sup>2</sup><b>mehr<br>gesunde Erde</b></h5>'+
                                            '<p>'+savingMeter+'m² mehr gesunde Erde durch Vermeidung von Pestiziden, künstlichen Düngemitteln und Entlaubungsmitteln. </p>'+
                                        '</div>'+
                                        '<small>*im Vergleich zur konventionellen Produktion</small>'+
                                    '</div>'
                                );
                            }
                        } catch (error) {
                            // console.log('getXHR Error: ', error);
                        }
                    }
                });
            }
        });

        // Complete the Look
        function createCTL() {
            _self.elem('.js-jump-complete-look', function(completeTheLookLink){
                if(completeTheLookLink){
                    
                    _self.elem(function(){
                        return _self.qsa('.h-xxLargeOffset-bottom-inner-xLarge-up > img').length > 0 && !_self.qs(".kk_ctl");
                    }, function(){
                        var completeTheLookImg = _self.qs('.h-xxLargeOffset-bottom-inner-xLarge-up > img');

                        try {
                            completeTheLookLink = completeTheLookLink[0];
                            completeTheLookLink.innerHTML = "Complete the Look";

                            if(completeTheLookImg){
                                var CTLTeaserImgSrc = completeTheLookImg.getAttribute('src'), // .replace("reco","detail") thumb
                                    CTLWrapper = _self.qs(".js-completeTheLookWrapper");
            
                                completeTheLookLink.setAttribute('style', 'background-image: url('+CTLTeaserImgSrc+')');

                                completeTheLookLink.addEventListener('click', function(){
                                    _self.goalPush("kk17_shopthelook_anker");
                                });

                                if(CTLWrapper) {
                                    var CTLProducts = _self.qsa(".item__image", CTLWrapper);
                                
                                    // CTL wird umgebaut
                                    CTLWrapper.insertAdjacentHTML('beforeend', 
                                        '<div class="kk_ctl" id="look">'+
                                            '<img src="'+CTLTeaserImgSrc+'">'+
                                            '<div class="kk_subline">Complete the Look</div>'+
                                            '<div class="kk_teaser">FÜR MEHR STIL: IHR<br>PerfekteS Outfit</div>'+
                                            '<div id="kk_ctlwrapper"></div>'+
                                        '</div>'
                                    );
                
                                    var newCTLWrapper = _self.qs("#kk_ctlwrapper", CTLWrapper.parentNode);
                                    
                                    for (var i = 0; i < CTLProducts.length; i++) {
                                        CTLProducts[i].addEventListener('click', function(){
                                            _self.goalPush("kk17_product_ctl", true);
                                        });
                                        if(newCTLWrapper){
                                            newCTLWrapper.insertAdjacentElement('beforeend', CTLProducts[i]);
                                        }
                                    }
                                    
                                    initGallery('#kk_ctlwrapper');
                                }
                            }

                        } catch (error) {
                            _self.goalPush("wa_setup_monitoring2");
                            // console.log('Error: ', error);
                        }
                    });
                }
            });
        }
        createCTL();

        // Bewertung
        _self.elem('#accordion-rating', function(ratingBody){
            if(ratingBody){
                ratingBody = ratingBody[0];

                var nachkommastelle = Math.pow(10, 2),
                    ratingOfThisProduct = _self.qs('.starRatingWrapper meta[itemprop="ratingValue"]');

                if(ratingOfThisProduct) {

                    ratingBody.insertAdjacentHTML('afterbegin', 
                        '<div id="kk_ratingnew">'+
                            '<div>'+(Math.round(ratingOfThisProduct.getAttribute('content')*nachkommastelle)/nachkommastelle)+'<span class="kk_grey">/5</span></div> <u>alle anzeigen</u>'+
                        '</div>'+
                        '<div id="kk_ratingbox">'+
                        '</div>'
                    );

                    var newRating = _self.qs("#kk_ratingnew", ratingBody),
                        ratingbox = _self.qs("#kk_ratingbox", ratingBody),
                        ratingScores = [0,0,0,0,0],
                        commitsOfAllUsers = [];
                    
                    _self.elem('#accordion-rating-label', function(ratingTop){
                        if(ratingTop){
                            ratingTop = ratingTop[0];

                            console.log('ratingTop: ', ratingTop);
                            if(ratingTop){
                                ratingTop.click();
                            }

                            newRating.insertAdjacentElement('beforeend', _self.qs(".rating--stars", ratingTop));

                            ratingTop.innerHTML = 'Kundenbewertungen ('+ratingTop.textContent.match(/\d+/g)+')';
                        }
                    });

                    _self.elem('#read_reviews meta[itemprop="ratingValue"]', function(allRatings){
                        if(allRatings){
                            var ratingLength = allRatings.length,
                                showMoreRatingsButton = _self.qs(".js_showAdditionalItems");

                            for (var k = 0; k < ratingLength; k++) {
                                var thisScore = parseInt(allRatings[k].getAttribute('content')),
                                    ratingCommit = allRatings[k].closest(".js_ratingItem");
                                
                                ratingScores[thisScore-1]++;

                                commitsOfAllUsers.push(ratingCommit);

                                ratingCommit.setAttribute('data-score', thisScore);
                            }

                            for (var i = 4; i >= 0; i--) {
                                
                                ratingbox.insertAdjacentHTML('beforeend', 
                                    '<div class="kk_ratingrow" data-index="'+(i+1)+'"><div>'+(i+1)+'</div>'+
                                        '<div class="kk_bar"><span style="width: '+(ratingScores[i]/ratingLength*100)+'%"></span></div>'+
                                    '</div>'
                                );

                                _self.qs(".kk_ratingrow:last-child", ratingbox).addEventListener('click', function(e){
                                    var thisTarget = e.target.classList.contains('kk_ratingrow') ? e.target : e.target.closest(".kk_ratingrow");
                                    
                                    removeClass(_self.qs(".kk_showgreen"), "kk_showgreen");
                                    addClass(thisTarget, "kk_showgreen");
                                    addClass(showMoreRatingsButton, "hide");
                                    
                                    for (var j = 0; j < commitsOfAllUsers.length; j++) {
                                        var thisCommit = commitsOfAllUsers[j];
                                        if(thisCommit.getAttribute('data-score') === thisTarget.getAttribute('data-index')){
                                            addClass(thisCommit, "show");
                                            removeClass(thisCommit, "hide");
                                        }else{
                                            addClass(thisCommit, "hide");
                                            removeClass(thisCommit, "show");
                                        }
                                    }
                                });
                            }

                            newRating.addEventListener('click', function(){
                                for (var l = 0; l < commitsOfAllUsers.length; l++) {
                                    var thisCommit = commitsOfAllUsers[l];
                                    addClass(thisCommit, "show");
                                    removeClass(thisCommit, "hide");
                                }
                                removeClass(_self.qs(".kk_showgreen"), "kk_showgreen");
                            });
                        }
                    });
                }
            }
        });



        _self.ready(function(){

            // Weiterlesen Buttons im Produkttext oder in den Kundenbewertungen werden aufgeklappt
            setTimeout(function(){
                _self.elem(function(){
                    return typeof window.ACC !== "undefined" && typeof window.ACC.global !== "undefined";
                }, function(accGloablIsAvaliable){
                    if(accGloablIsAvaliable){
                        window.ACC.global.destroyShorten(".js_triggerShortenDestroy");
                    }
                });
            }, 1500);
        });

        _self.ajax("https://www.hessnatur.com/de/cart/add", function(){
            _self.elem('#ecRecommendationsContainer > .productitem', function(ecRecommendationsContainer){
                if(ecRecommendationsContainer){
                    ecRecommendationsContainer[0].parentNode.parentNode.innerHTML = ecRecommendationsContainer[0].parentNode.parentNode.innerHTML;
                    initGallery('#ecRecommendationsContainer');
                }
            });
        });
    }

	
})(window.WATO, window);