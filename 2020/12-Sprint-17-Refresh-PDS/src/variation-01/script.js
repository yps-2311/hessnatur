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

    console.log(1);

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    function initGallery(galID, adaptiveHeight) {
        WATO.elem(function(){
            return typeof $ !== "undefined";
        }, function(isjq){
            if(isjq){
                // Doku https://flickity.metafizzy.co/
                $(galID).flickity({
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

        WATO.elem('.pds-cockpit__wrapper', function(mainContent){
            if(mainContent){
                mainContent = mainContent[0];

                var mainContentWrapper = mainContent.parentNode;
                
                // falls die Galerie mit einer anderen Farbe schon vorhanden ist wird diese entfernt
                removeObject(WATO.qs(".kk_slider", mainContentWrapper));

                // Alle anderen Galerien der Seite werden ebenfalls entfernt da es sonst nach dem initalisieren zu fehlern kommt
                removeObject(WATO.qs(".show-for-medium-only.column.small-12.medium-6", mainContentWrapper));
                removeObject(WATO.qs(".pds-productImage__mzThumbsWrapper.js_magicZoomThumbWrapper", mainContentWrapper));
                removeObject(WATO.qs(".js_magicZoomKeyVisualWrapper", mainContentWrapper));
                removeObject(WATO.qs(".column.small-12.hide-for-medium.h-smallmediumOffset-bottom-outer.h-no-padding", mainContentWrapper));

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
                    WATO.elem(function(){
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
            }
        });
    }

    // Informationen zur Galerie werden zusammengestellt
    function buildGalleryWrapper(colorID) {

        WATO.elem(function() {
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

                            // WATO.qs(".js-jump-complete-look").setAttribute('style', 'background-image: url('+picThumb+')');
                        }
                    }

                    buildGallery(mainPicColor, markupHTMLColor, colorID, onlyOneImage);

                }else{
                    // Galerie initialer Seitenaufruf

                    var mainPicInitial = "",
                        markupHTMLInitial = "";

                    WATO.elem('meta[property="og:image"]', function(initPic){
                        if(initPic){
                            var initPicLength = initPic.length;
                            
                            // Farben
                            WATO.elem('.pds-cockpit__colorSwitch li a', function(colorSwitch){
                                if(colorSwitch){

                                    var firstPic = initPic[0].getAttribute("content").replace("detail_zoom","detail_thumb");

                                    if(initPicLength === 1){

                                        colorSwitch[0].innerHTML = '<img src="'+firstPic+'">';
                                        colorSwitch[0].addEventListener('click', changeColor);

                                    }else{
                                        var prodID = firstPic.match(/\d{5}/),
                                            numberOfColors = colorSwitch.length;

                                        for (var j = 0; j < numberOfColors; j++) {
                                            var thisColorLink = colorSwitch[j];

                                            thisColorLink.innerHTML = '<img src="'+firstPic.split(prodID)[0] + prodID + '_' + thisColorLink.parentNode.getAttribute('data-color') +'_7.jpg">'; //  + imgNumber +

                                            thisColorLink.addEventListener('click', changeColor);
                                        }
                                    }
                                }
                            });
                
                            // Die Galeriebilder liegen in Metadaten im Head
                            for (var i = 0; i < initPicLength; i++) {

                                var picURL = initPic[i].getAttribute("content"),
                                    altText = WATO.qs('meta[property="twitter:title"]').getAttribute("content"),
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
    }

    // Klick auf mehr Details
    WATO.elem('.js-pds-more-details', function(moreDetails){
        if(moreDetails){
            moreDetails[0].addEventListener('click', function(e){
                e.preventDefault();
                // WATO.goalPush("klick_produktdetails");

                setTimeout(function(){
                    try {
                        window.ACC.global.scrollToElement($(".accordion.productInfoAccordion"));
                    } catch (error) {
                        // console.log('Error: ', error);
                    }
                }, 700);
            });
        }
    });

    function pushGoal(key, sendOnNextPageView){    
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

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
    WATO.elem('.breadcrumb--back a', function(breadcrumb){
        if(breadcrumb){
            breadcrumb = breadcrumb[0];
            breadcrumb.innerHTML = 'zurück';
            breadcrumb.addEventListener('click', function(){
                WATO.goalPush("kategorie_back", true);
            });
        }
    });

    // Sterne und Bewertung unter das Haupt-Bild platzieren
    WATO.elem('.js-badges-container', function(badges){
        if(badges){
            WATO.elem('.pds-cockpit__ratingSummaryWrapper', function(stars){
                if(stars){
                    stars = stars[0];
                    WATO.qs("a + span", stars).innerHTML = WATO.qs("meta", stars).getAttribute('content').substring(0,4);
                    badges[0].insertAdjacentElement('afterbegin', stars);
                }
            });
        }
    });

    // Größenberatung Fallback
    WATO.elem('#size_advisor', function(sizeAdvisor){
        if(sizeAdvisor){
            sizeAdvisor[0].setAttribute('href', "/de/groessenberatung");
        }
    });

    // Initaile Galerie erstellen
    buildGalleryWrapper();


    // Produktdetails vom Akordion in einen Slider umbauen
    WATO.elem('.productInfoAccordion .accordion-item', function(productInfoAccordionItem){
        if(productInfoAccordionItem){

            var prodInfoAccordion = productInfoAccordionItem[0].parentNode;

            // Tabs
            prodInfoAccordion.insertAdjacentHTML('beforebegin', '<div id="infoTabs"></div>');

            // Erstes Tab einblenden
            WATO.qs("div", productInfoAccordionItem[0]).classList.add('kk_show');
            
            var infoTabs = WATO.qs("#infoTabs", prodInfoAccordion.parentNode);

            for (var i = 0; i < productInfoAccordionItem.length; i++) {
                var prodContent = WATO.qs("div", productInfoAccordionItem[i]),
                    tabText = prodContent.previousElementSibling.textContent;

                // Umtexten
                if(tabText === "Produktbeschreibung") {
                    tabText = "Produktdetails";
                }

                // Markup der Tabs setzen
                infoTabs.insertAdjacentHTML('beforeend', 
                    '<div class="kk_carousel'+(i===0 ? " kk_active":'')+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                );

                // Interaktion mit Tabs
                WATO.qs(".kk_carousel:last-child", infoTabs).addEventListener('click', function(e){
                    var thisTarget = e.target;
                    removeClass(WATO.qs(".kk_show"), 'kk_show');
                    removeClass(WATO.qs(".kk_active"), 'kk_active');

                    addClass(WATO.qs("#"+thisTarget.getAttribute('data')), 'kk_show');
                    addClass(thisTarget, 'kk_active');
                });
            }

            initGallery('#infoTabs');

            var articleNumber = WATO.qs(".pds-cockpit__articleNumber"),
                articleNumberID = WATO.qs("span", articleNumber).textContent.trim(),
                colorNumber = WATO.qs(".pds-cockpit__colorSwitch .active").getAttribute('data-color');

            WATO.qs("#Produktbeschreibung .pds-productDescription__text", productInfoAccordionItem[0]).insertAdjacentElement('afterend', articleNumber);

            
            getXHR("GET","https://products.hessnatur.com/products/"+articleNumberID+colorNumber, function(callbackContent) {
                var respText = callbackContent.responseText;
                if(typeof respText !== "undefined"){
                    try {
                        var responseJSON = JSON.parse(respText),
                            data = responseJSON.products[0].ecological_data,
                            savingWater = data.water_savings_in_liter;
    
                        if(savingWater !== 0){
                            prodInfoAccordion.parentNode.insertAdjacentHTML('afterend', 
                                '<div class="kk_nachhaltig">'+
                                    '<h4>Für Weniger Kurzlebigkeit, FÜR mehr Zukunft: <span>Wir haben dieses Produkt nachhaltig für Sie produziert.</span></h4>'+
                                    '<div class="kk_water">'+
                                        '<h5>'+Math.round(savingWater)+' l<b>Wasser*</b></h5>'+
                                        '<p>Im Einklang mit der Natur: Wir setzen durchweg auf wassersparende und -schonende Verfahren.</p>'+
                                    '</div>'+
                                    '<div class="kk_cloud">'+
                                        '<h5>'+data.clean_earth_consumption_in_square_meter+' kg<b>CO<sub>2</sub>*</b></h5>'+
                                        '<p>Ressourcenschonend: Wir nutzen so wenig Strom wie möglich und nur aus nachhaltigen Energiequellen.</p>'+
                                    '</div>'+
                                    '<div class="kk_earth">'+
                                        '<h5>'+data.carbon_dioxide_consumption_in_gram+' g<b>BODEN/ERDE*</b></h5>'+
                                        '<p>Für weniger Künstlichkeit: Wir verwenden ausschließlich Rohstoffe aus ökologischer Landwirtschaft.</p>'+
                                    '</div>'+
                                    // '<a>mehr erfahren</a>'+
                                    '<small>*im Vergleich zur konventionellen Produktion</small>'+
                                '</div>'
                            );
                        }
                    } catch (error) {
                        // console.log('Error: ', error);
                    }
                }
            });
        }
    });


    console.log(7);

    WATO.elem('.js-jump-complete-look', function(completeTheLookLink){
        if(completeTheLookLink){
            
            WATO.elem('.h-xxLargeOffset-bottom-inner-xLarge-up > img', function(completeTheLookImg){
                if(completeTheLookImg){
                    completeTheLookLink = completeTheLookLink[0];
                    completeTheLookLink.innerHTML = "Complete the Look";

                    var CTLTeaserImgSrc = completeTheLookImg[0].getAttribute('src'), // .replace("reco","detail") thumb
                        CTLWrapper = WATO.qs(".js-completeTheLookWrapper"),
                        CTLProducts = WATO.qsa(".item__image", CTLWrapper);

                    completeTheLookLink.setAttribute('style', 'background-image: url('+CTLTeaserImgSrc+')');
                    
                    CTLWrapper.insertAdjacentHTML('afterend', 
                        '<div class="kk_ctl">'+
                            '<img src="'+CTLTeaserImgSrc+'">'+
                            '<div class="kk_subline">Complete the Look</div>'+
                            '<div class="kk_teaser">FÜR MEHR STIL: IHR<br>PerfekteS Outfit</div>'+
                            '<div id="kk_ctlwrapper"></div>'+
                        '</div>'
                    );

                    var newCTLWrapper = WATO.qs("#kk_ctlwrapper", CTLWrapper.parentNode);
                    
                    for (var i = 0; i < CTLProducts.length; i++) {
                        newCTLWrapper.insertAdjacentElement('beforeend', CTLProducts[i]);
                    }
                    
                    initGallery('#kk_ctlwrapper');
                }
            });
        }
    });


    console.log(8);

    WATO.elem('#ecRecommendationsContainer', function(ecRecommendationsContainer){
        if(ecRecommendationsContainer){
            initGallery('#ecRecommendationsContainer');
            ecRecommendationsContainer[0].parentNode.previousElementSibling.innerHTML = '<div class="h4 text-center recommendation-headline">Nachhaltige Produkte für Sie</div>';
        }
    });

    console.log(9);

    WATO.elem('.ratingAccordion', function(ratingAccordion){
        if(ratingAccordion){
            ratingAccordion = ratingAccordion[0];

            ratingAccordion.insertAdjacentHTML('beforebegin', 
                '<div id="kk_rating">'+
                    '<div>'+WATO.qs("#accordion-rating-label", ratingAccordion).innerHTML.replace("Bewertungen","Kundenbewertungen")+'</div>'+
                    '<div id="kk_rating_gallery"></div>'+
                '</div>'
            );

            var ratingGal = WATO.qs("#kk_rating_gallery", ratingAccordion.parentNode),
                allRatings = WATO.qsa(".js_ratingItem", ratingAccordion);

            for (var i = 0; i < allRatings.length; i++) {
                var author = WATO.qs(".title__name", allRatings[i]);
                author.innerHTML = author.innerHTML.replace(",", "");
                ratingGal.insertAdjacentElement('beforeend', allRatings[i]);
            }
            initGallery('#kk_rating_gallery', true);
            
        }
    });

})(new window.WATO(), window);