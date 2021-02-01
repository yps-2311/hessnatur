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


    var hasNotExcludeCookie = document.cookie.indexOf("kksp17desk_exclude=true") === -1,
        isColorChange = false;

    /*jshint loopfunc: true */

    function sliderHeight(factor) {
        var temp = window.innerWidth * factor;
        if(temp > 852.8){
            return 852.8;
        }else{
            return parseFloat(temp).toFixed(3);
        }
    }
    function removeItem(element) {
        if(element){
            element.parentNode.removeChild(element);
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

    function setErrorTracking(key, error){
        if(document.cookie.indexOf('kk=testpreview') !== -1){
            console.log(error);
        }
        WATO.goalPush(key);
    }

    function getNewCarousel(markupHTML, markupHTMLNavi) {
        return '<div class="kk_slider main-carousel">'+ // style="height: '+sliderHeight(0.4398)+'px"
                    markupHTML+
                '</div>'+
                '<div class="kk_carouselnav carousel carousel-nav">'+
                    markupHTMLNavi+
                '</div>';
    }

    // todo: Prüfen auf colorID bei Farbwechsel: colorID === neue Farbe?
    function buildHeader(colorID) {
       
        // Gallerie und Buybox
        WATO.elem('.pds__imageAndCockpitWrapper', function(mainWrapper){
            if(mainWrapper){
                try {
                    mainWrapper = mainWrapper[0];

                    // Initialisierung ganz zu Beginn, da sonst ein Timing-Issue auffällt
                    if(WATO.qs('.kk_sliderWrapper', mainWrapper) === null){
                        mainWrapper.insertAdjacentHTML('afterbegin', 
                            '<div class="kk_sliderWrapper">'+
                            '</div>');
                    }

                    WATO.elem(function() {
                        if(colorID){
                            return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
                        }else{
                            return true;
                        }
                    }, function(avalibeColorImages){
                        if(avalibeColorImages){

                            var thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer:not(.kk-thumb)", mainWrapper),
                                markupHTML = "",
                                markupHTMLNavi = "",
                                initFlickity = function(){
                                    // Auf jQuery und Gallerie Funktion warten
                                    WATO.elem(function(){
                                        return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                                    }, function(){
                                        try {

                                            // Slider Options
                                            var sliderOptions = {
                                                cellAlign: 'left',
                                                cellSelector: '.carousel-cell',
                                                draggable: false,
                                                wrapAround: true,
                                                pageDots: false
                                            },
                                            thumbPics = thumbnails.length;
                                                    
                                            if(thumbPics <= 2){
                                                // Bei einem oder zwei Produktbilder die
                                                // Interaktion mit der Gallerie deaktivieren
                                                sliderOptions.prevNextButtons = false;
                                                sliderOptions.pageDots = false;

                                                if(thumbPics === 1){
                                                    sliderOptions.cellAlign = 'center';
                                                }
                                            }

                                            // Init Main-Slider
                                            jQuery('.kk_slider').flickity(sliderOptions);

                                            // Fix für Chrome
                                            setTimeout(function(){
                                                jQuery(".kk_slider .flickity-viewport").css("height", sliderHeight(0.4398)+"px");
                                            }, 300);

                                            // Thumb-Navigation init
                                            var sliderNavi = jQuery('.kk_carouselnav');
                                            if(thumbPics > 2){
                                                sliderNavi.flickity({
                                                    asNavFor: '.kk_slider',
                                                    cellAlign: 'left',
                                                    contain: true,
                                                    pageDots: false,
                                                    prevNextButtons: false
                                                });
                                            }else{
                                                sliderNavi.hide();
                                            }

                                            isColorChange = false;

                                        } catch (error) {
                                            // setErrorTracking("wa_setup_monitoring1", error);
                                            window.iridion.push(['goal', 'wa_setup_monitoring1', error.toString()]);
                                        }
                                    });
                                };

                            // Timing Problem. Thumbnails werden nachgeladen. Daher helper-Klasse kk-thumb setzen und wenn diese null ist wurden neue Slider-Elemente eingefügt.
                            if(colorID){

                                WATO.elem(function(){
                                    thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer:not(.kk-thumb)", mainWrapper);
    
                                    return thumbnails.length > 0 && typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined" && window.ACC.productDetail.galleryImages.length > 0;
    
                                }, function(fnCallback){
                                    if(fnCallback){
                                        

                                        for (var i = 0; i < thumbnails.length; i++) {
                                            var productPicURL = thumbnails[i].getAttribute("data-image");
        
                                            addClass(thumbnails[i], 'kk-thumb');
        
                                            markupHTML += 
                                            '<div class="carousel-cell">'+
                                                '<a href="'+productPicURL.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom">'+ //zoomWidth:600px; zoomHeight:1000px; 
                                                    '<img src="'+productPicURL+'">'+ // .replace("_main/","_reco/")
                                                '</a>'+
                                            '</div>';
        
                                            markupHTMLNavi += 
                                            '<div class="carousel-cell">'+
                                                '<img src="'+productPicURL.replace("_main/","_thumb/")+'">'+
                                            '</div>';
                                        }


                                        // alte Galerie entfernen
                                        removeItem(WATO.qs(".kk_slider", mainWrapper));
                                        removeItem(WATO.qs(".kk_carouselnav", mainWrapper));
                                        
                                        // Die Main-Galerie neu erstellen
                                        WATO.qs(".kk_sliderWrapper").insertAdjacentHTML('afterbegin', getNewCarousel(markupHTML, markupHTMLNavi));

                                        initFlickity();
                                    }
                                });

                            } else {

                                // wird aus Original-Slider gebaut
                                // Neue Galerie Markup wird initial gebaut
                                for (var i = 0; i < thumbnails.length; i++) {
                                    var productPicURL = thumbnails[i].getAttribute("data-image");

                                    addClass(thumbnails[i], 'kk-thumb');

                                    markupHTML += 
                                    '<div class="carousel-cell">'+
                                        '<a href="'+productPicURL.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom">'+ //zoomWidth:600px; zoomHeight:1000px; 
                                            '<img src="'+productPicURL+'">'+ // .replace("_main/","_reco/")
                                        '</a>'+
                                    '</div>';

                                    markupHTMLNavi += 
                                    '<div class="carousel-cell">'+
                                        '<img src="'+productPicURL.replace("_main/","_thumb/")+'">'+
                                    '</div>';
                                }

                                // alte Galerie entfernen
                                removeItem(WATO.qs(".kk_slider", mainWrapper));
                                removeItem(WATO.qs(".kk_carouselnav", mainWrapper));
        
                                // Markup und Statische Felder für "Complete the Look" und "Titel" werden eingebaut
                                WATO.qs('.kk_sliderWrapper', mainWrapper).innerHTML = getNewCarousel(markupHTML, markupHTMLNavi);
                                
                                initFlickity();
                            }
                        }
                    });

                } catch (error) {
                    setErrorTracking("wa_setup_monitoring", error);
                }
            }
        });
    }


    // Farbe gewächselt
    function changeColor(e) {

        var thisTarget = e.target.parentNode.getAttribute("data-color"),
            newColorImage = WATO.qs('img', e.currentTarget),
            prodDescImg = WATO.qs('#kk-prod-desc-img');

        if(!thisTarget){
            thisTarget = e.target.parentNode.parentNode.getAttribute("data-color");
        }
        
        // // Ausgewählte Farbe an Galerie übergeben
        buildHeader(parseInt(thisTarget));

        createCTL(false);

        // Bild in der Produktbeschreibung auswechseln
        if(prodDescImg && newColorImage && newColorImage.getAttribute('src')){

            prodDescImg.setAttribute('src', newColorImage.getAttribute('src').replace(/hyb_redes_detail_thumb/, 'hyb_redes_detail_main'));
        }
    }

    function initGallery(galID, adaptiveHeight, prevNextButn, factorForHeight, dots) {
      
        WATO.elem(function(){
            return typeof $ !== "undefined";
        }, function(isjq){
            if(isjq){
                // Doku https://flickity.metafizzy.co/

                try {

                    var settingsRatingGallery = {
                        // options
                        draggable: true,
                        cellAlign: 'left',
                        contain: true,
                        prevNextButtons: !!prevNextButn,
                        pageDots: !!dots,
                        percentPosition: true,
                        setGallerySize: true,
                        adaptiveHeight: !!adaptiveHeight
                    };

                    // Wenn zu wenig Elemente vorhanden sind, wird die Darstellung zentriert
                    if(galID === "#kk_rating_gallery" && prevNextButn === false){
                        settingsRatingGallery.cellAlign = 'center';
                    }
                    // Complete the look muss ein Index bekommen, da sonst ein Problem entsteht
                    if(galID === "#kk_ctlwrapper" && prevNextButn){
                        settingsRatingGallery.initialIndex = 0;
                        settingsRatingGallery.pageDots = true;
                        settingsRatingGallery.groupCells = 2;
                    }
                    

                    $(galID).flickity(settingsRatingGallery);

                    if(galID === "#kk_ctlwrapper"){
                        // Fix für Chrome
                        setTimeout(function(){
                            jQuery(galID+" .flickity-viewport").css("height", sliderHeight(factorForHeight)+"px");
                        }, 300);
                    }

                } catch (error) {
                    // setErrorTracking("wa_setup_monitoring1", error);
                    window.iridion.push(['goal', 'wa_setup_monitoring1', error.toString()]);
                }
                
            }
        });
    }

    function setPlaceholder(id, text) {
        WATO.elem(id, function(placeholder){
            if(placeholder){
                placeholder[0].setAttribute('placeholder', text);
            }
        });
    }

    // Complete the Look
    function createCTL(init) {
        WATO.elem('.js-jump-complete-look', function(completeTheLookLink){
            if(completeTheLookLink){
                
                WATO.elem(function(){

                    return WATO.qsa('.h-xxLargeOffset-bottom-inner-xLarge-up > img').length > 0 && !WATO.qs(".kk_ctl");

                }, function(){
                    var completeTheLookImg = WATO.qs('.h-xxLargeOffset-bottom-inner-xLarge-up > img');

                    try {
                        completeTheLookLink = completeTheLookLink[0];

                        // neuer Titel
                        completeTheLookLink.innerHTML = "Complete the Look";

                        if(completeTheLookImg){

                            var CTLTeaserImgSrc = completeTheLookImg.getAttribute('src').replace("_reco","_main"),
                                CTLWrapper = WATO.qs(".js-completeTheLookWrapper");
        
                            // Anker zu CTL wird mit dem Hauptbild als Hintergrund versehen
                            completeTheLookLink.setAttribute('style', 'background-image: url('+CTLTeaserImgSrc+')');

                            // CTL-Anker unter die Hauptgalerie verschoben
                            // Umbau 06.10.2020
                            WATO.elem('.kk_sliderWrapper', function(sliderWrapper){
                                if(sliderWrapper){
                                    var newCompleteTheLookLink = completeTheLookLink.cloneNode(true);

                                    sliderWrapper = sliderWrapper[0];

                                    if(WATO.qs('.js-jump-complete-look', sliderWrapper)){

                                        sliderWrapper.removeChild(WATO.qs('.js-jump-complete-look', sliderWrapper));
                                    }

                                    sliderWrapper.insertAdjacentElement('beforeend', newCompleteTheLookLink);
                                }
                            });

                            if(CTLWrapper){
                                var CTLProducts = WATO.qsa(".item__image", CTLWrapper);
                            
                                removeItem(WATO.qs("#look"));

                                // CTL wird umgebaut
                                CTLWrapper.insertAdjacentHTML('beforeend', 
                                    '<div class="kk_ctl" id="look">'+
                                        '<img src="'+CTLTeaserImgSrc+'">'+
                                        '<div class="kk_rightlook">'+
                                            '<div class="kk_subline">Complete the Look</div>'+
                                            '<div class="kk_teaser">Für mehr Stil: Ihr Perfektes Outfit</div>'+
                                            '<div id="kk_ctlwrapper"></div>'+ // style="height: '+sliderHeight(0.41)+'px"
                                        '</div>'+
                                    '</div>'
                                );
            
                                var newCTLWrapper = WATO.qs("#kk_ctlwrapper", CTLWrapper.parentNode);
                                
                                // Umbau ohne Umpositionierung des Original-Elements: 06.10.2020
                                for (var i = 0; i < CTLProducts.length; i++) {

                                    var newCTLProduct = CTLProducts[i].cloneNode(true);

                                    var img = WATO.qs("img", newCTLProduct);
                                    
                                    // 30.09.2020: Abfrage ob img überhaupt vorhanden
                                    if(img){
                                        img.setAttribute('src', img.getAttribute('src').replace("hyb_redes_reco","hyb_redes_detail_main"));
                                    }
    
                                    newCTLWrapper.insertAdjacentElement('beforeend', newCTLProduct);
                                }

                                initGallery('#kk_ctlwrapper', false, CTLProducts.length > 2, 0.41);                               

                                WATO.elem(function(){
                                    // Falls noch nicht geladen
                                    return typeof window.MagicZoom !== "undefined" && typeof window.MagicZoom.start !== "undefined";

                                }, function(fnCallback){
                                    if(fnCallback){
                                        // init MagicZoom
                                        window.MagicZoom.start();
                                    }
                                });
                            }
                        }
                    } catch (error) {
                        // setErrorTracking("kk17_setup_ctl_monitor", error);

                        window.iridion.push(['goal', 'kk17_setup_ctl_monitor', document.URL]);
                        window.iridion.push(['goal', 'catchMonitoring', error.toString()]);
                    }
                });
            }
        });
    }


    if(hasNotExcludeCookie){

        window.iridion.econda.push(["Sprint17desktop", "V1"]);

        // WATO.sprint17goals(1);

        WATO.elem(function(){
            return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
        }, function(){
            /*
            * Flickity asNavFor v2.0.2
            * enable asNavFor for Flickity
            */
    
            /*jshint browser: true, undef: true, unused: true, strict: true*/
    
            ( function( window, factory ) {
                // universal module definition
                /*jshint strict: false */ /*globals define, module, require */
                if ( typeof define === 'function' && define.amd ) {
                // AMD
                define( [
                    'flickity/js/index',
                    'fizzy-ui-utils/utils'
                ], factory );
                } else if ( typeof module === 'object' && module.exports ) {
                    // CommonJS
                    module.exports = factory(
                        require('flickity'),
                        require('fizzy-ui-utils')
                    );
                } else {
                    // browser global
                    window.Flickity = factory(
                        window.Flickity,
                        window.fizzyUIUtils
                    );
                }
            
            }( window, function factory( Flickity, utils ) {
            
            // 'use strict';
            
            // -------------------------- asNavFor prototype -------------------------- //
            
            // Flickity.defaults.asNavFor = null;
            
            Flickity.createMethods.push('_createAsNavFor');
            
                var proto = Flickity.prototype;
                
                proto._createAsNavFor = function() {
                    this.on( 'activate', this.activateAsNavFor );
                    this.on( 'deactivate', this.deactivateAsNavFor );
                    this.on( 'destroy', this.destroyAsNavFor );
                
                    var asNavForOption = this.options.asNavFor;
                    if ( !asNavForOption ) {
                    return;
                    }
                    // HACK do async, give time for other flickity to be initalized
                    var _this = this;
                    setTimeout( function initNavCompanion() {
                    _this.setNavCompanion( asNavForOption );
                    });
                };
                
                proto.setNavCompanion = function( elem ) {
                    elem = utils.getQueryElement( elem );
                    var companion = Flickity.data( elem );
                    // stop if no companion or companion is self
                    if ( !companion || companion === this ) {
                    return;
                    }
                
                    this.navCompanion = companion;
                    // companion select
                    var _this = this;
                    this.onNavCompanionSelect = function() {
                    _this.navCompanionSelect();
                    };
                    companion.on( 'select', this.onNavCompanionSelect );
                    // click
                    this.on( 'staticClick', this.onNavStaticClick );
                
                    this.navCompanionSelect( true );
                };
                
                proto.navCompanionSelect = function( isInstant ) {
                    // wait for companion & selectedCells first. #8
                    var companionCells = this.navCompanion && this.navCompanion.selectedCells;
                    if ( !companionCells ) {
                    return;
                    }
                    // select slide that matches first cell of slide
                    var selectedCell = companionCells[0];
                    var firstIndex = this.navCompanion.cells.indexOf( selectedCell );
                    var lastIndex = firstIndex + companionCells.length - 1;
                    var selectIndex = Math.floor( lerp( firstIndex, lastIndex,
                    this.navCompanion.cellAlign ) );
                    this.selectCell( selectIndex, false, isInstant );
                    // set nav selected class
                    this.removeNavSelectedElements();
                    // stop if companion has more cells than this one
                    if ( selectIndex >= this.cells.length ) {
                    return;
                    }
                
                    var selectedCells = this.cells.slice( firstIndex, lastIndex + 1 );
                    this.navSelectedElements = selectedCells.map( function( cell ) {
                    return cell.element;
                    });
                    this.changeNavSelectedClass('add');
                };
                
                function lerp( a, b, t ) {
                    return ( b - a ) * t + a;
                }
                
                proto.changeNavSelectedClass = function( method ) {

                    var hArray = this.navSelectedElements;

                    for (var i = 0; i < hArray.length; i++) {
                        var navElem = hArray[i];

                        navElem.classList[ method ]('is-nav-selected');
                        
                    }
                    // Fehler im EDGE!!!
                    // this.navSelectedElements.forEach( function( navElem ) {
                    // navElem.classList[ method ]('is-nav-selected');
                    // });
                };
                
                proto.activateAsNavFor = function() {
                    this.navCompanionSelect( true );
                };
                
                proto.removeNavSelectedElements = function() {
                    if ( !this.navSelectedElements ) {
                    return;
                    }
                    this.changeNavSelectedClass('remove');
                    delete this.navSelectedElements;
                };
                
                proto.onNavStaticClick = function( event, pointer, cellElement, cellIndex ) {
                    if ( typeof cellIndex === 'number' ) {
                    this.navCompanion.selectCell( cellIndex );
                    }
                };
                
                proto.deactivateAsNavFor = function() {
                    this.removeNavSelectedElements();
                };
                
                proto.destroyAsNavFor = function() {
                    if ( !this.navCompanion ) {
                    return;
                    }
                    this.navCompanion.off( 'select', this.onNavCompanionSelect );
                    this.off( 'staticClick', this.onNavStaticClick );
                    delete this.navCompanion;
                };
                
                // -----  ----- //
                
                return Flickity;
            
            }));
        });

        buildHeader(false);

        // Zurück-Button
        WATO.elem('.breadcrumb--back a', function(breadcrumb){
            if(breadcrumb){
                breadcrumb = breadcrumb[0];
                breadcrumb.innerHTML = 'zurück';
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
    
                        // Anker zum Scrollen
                        WATO.qs(".starRatingWrapper", stars).setAttribute('data-open-accordion-css-selector', '.ang_detail_additional');
                    }
                });
            }
        });
    
        WATO.elem('.productInfoAccordion .accordion-item', function(productInfoAccordionItem){
            if(productInfoAccordionItem){
    
                var prodInfoAccordion = productInfoAccordionItem[0].parentNode;
    
                // Tabs
                prodInfoAccordion.insertAdjacentHTML('beforebegin', '<div id="infoTabs"></div>');
    
                // Erstes Tab einblenden
                WATO.qs("div", productInfoAccordionItem[0]).classList.add('kk_show');
                
                var infoTabs = WATO.qs("#infoTabs", prodInfoAccordion.parentNode);
    
                // if(originalProductInfos){
                //     prodInfoAccordion.insertAdjacentElement('beforebegin', originalProductInfos);
                // }
    
                for (var i = 0; i < productInfoAccordionItem.length; i++) {
                    var prodContent = WATO.qs("div", productInfoAccordionItem[i]),
                        tabText = prodContent.previousElementSibling.textContent;
    
                    // Umtexten
                    if(tabText === "Produktbeschreibung") {
                        tabText = "Produktdetails";
                    }
    
                    prodContent.insertAdjacentHTML('afterbegin', 
                        '<h4>'+tabText+'</h4>'
                    );
    
                    // Markup der Tabs setzen
                    if(prodContent.getAttribute('id') === "Passform"){
                        // Passform soll wenn vorhanden, als zweiter Tab erscheinen
                        WATO.qs(".kk_carousel:first-child", infoTabs).insertAdjacentHTML('afterend', 
                            '<div class="kk_carousel'+(i===0 ? " kk_active":'')+'" data-index="'+i+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                        );
                    } else {
                        // Alle Tabs werden eingebaut nur bei Pflege kann es sein dass es keine Inhalte gibt, in dem Fall wird es nicht eingebaut
                        if(!(prodContent.getAttribute('id') === "Pflege" && WATO.qsa("#Pflege li").length === 0)){
    
                            // Material und Pflege sollen zusammengefasst dargestellt werden
                            if(prodContent.getAttribute('id') === "Pflege"){
                                var tabMaterial = WATO.qs('.kk_carousel[data="Material"]'),
                                    contentMaterial = WATO.qs('#Material');
    
                                if(tabMaterial && contentMaterial){
                                    tabMaterial.innerHTML = 'Material und Pflege';
    
                                    contentMaterial.insertAdjacentHTML('beforeend', prodContent.innerHTML);
    
                                } else {
                                    infoTabs.insertAdjacentHTML('beforeend', 
                                        '<div class="kk_carousel'+(i===0 ? " kk_active":'')+'" data-index="'+i+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                                    );
                                }
                            } else {
    
                                infoTabs.insertAdjacentHTML('beforeend', 
                                    '<div class="kk_carousel'+(i===0 ? " kk_active":'')+'" data-index="'+i+'" data="'+prodContent.getAttribute('id')+'">'+tabText+'</div>'
                                );
                            }
                        }
                    }
                    
                    // Interaktion mit Tabs
                    var thisTab = WATO.qs(".kk_carousel[data-index='"+i+"']", infoTabs);
                    if(thisTab){
                        thisTab.addEventListener('click', function(e){
                            var thisTarget = e.target,
                                thisKey = thisTarget.getAttribute('data');
        
                            removeClass(WATO.qs(".kk_show"), 'kk_show');
                            removeClass(WATO.qs(".kk_active"), 'kk_active');
        
                            addClass(WATO.qs("#"+thisKey), 'kk_show');
                            addClass(thisTarget, 'kk_active');
                        });
                    }
                }
            }
        });

        // Hauptbild-URL aus Metainfo
        WATO.elem('meta[property="og:image"]', function(initPic){
            if(initPic){

                var firstPicUrl = initPic[0].getAttribute("content");

                // Produktinfos
                WATO.elem('#Produktbeschreibung .column', function(Produktbeschreibung){
                    if(Produktbeschreibung){
                        Produktbeschreibung = Produktbeschreibung[0];

                        var articleNumber = WATO.qs(".pds-cockpit__articleNumber"),
                            prodUvp = WATO.qs(".pds-cockpit__shortDescription") !== null ? WATO.qs(".pds-cockpit__shortDescription").innerHTML : "";
                        
                        // Produkt UVPs in die Produktinfos kopieren
                        Produktbeschreibung.insertAdjacentHTML('beforeend', 
                            '<ul class="pds-cockpit__shortDescription kk-prod-uvp">'+prodUvp+'</ul>' 
                        );

                        WATO.elem('#Produktbeschreibung .pds-cockpit__shortDescription', function(elemUvp){
                            if(elemUvp){
                                WATO.elem(function(){

                                    return WATO.qs('#Produktbeschreibung .pds-cockpit__shortDescription') === null;

                                }, function(fnCallback){
                                    if(fnCallback){
                                        Produktbeschreibung.insertAdjacentHTML('beforeend', 
                                            '<ul class="pds-cockpit__shortDescription kk-prod-uvp">'+prodUvp+'</ul>' 
                                        );
                                    }
                                });
                            }
                        });

                        // Artikelnummer in die Produktinfos verschieben
                        if(articleNumber){
                            Produktbeschreibung.insertAdjacentElement('beforeend', articleNumber);

                            WATO.elem('#Produktbeschreibung .pds-cockpit__articleNumber', function(elemArticleNumber){
                                if(elemArticleNumber){
                                    WATO.elem(function(){
    
                                        return WATO.qs('#Produktbeschreibung .pds-cockpit__articleNumber') === null;
    
                                    }, function(fnCallback){
                                        if(fnCallback){
                                            Produktbeschreibung.insertAdjacentElement('beforeend', articleNumber);
                                        }
                                    });
                                }
                            });
                        }

                        // Bild in die Produktinfos einbauen
                        Produktbeschreibung.insertAdjacentHTML('afterend', 
                            '<img id="kk-prod-desc-img" src="'+firstPicUrl.replace("detail_zoom","detail_main").replace("_1.jpg","_7.jpg")+'">'
                        );
                    }
                });

                // Farben
                // 30.09.2020: Workaround bei Klick auf gleiche Farbe
                WATO.elem('.pds-cockpit__colorSwitch li a', function(colorSwitch){
                    if(colorSwitch){

                        try {
                            var firstPic = firstPicUrl.replace("detail_zoom","detail_thumb"),
                                prodID = firstPic.match(/\d{5}/),
                                numberOfColors = colorSwitch.length,
                                selectedColor = -1;

                            // Produktfarben mit Listeners
                            for (var j = 0; j < numberOfColors; j++) {
                                var thisColorLink = colorSwitch[j],
                                    colorParent = thisColorLink.parentNode;

                                if(colorParent.classList.contains('active') && colorParent.getAttribute('data-color')){
                                    selectedColor = colorParent.getAttribute('data-color');
                                }

                                thisColorLink.innerHTML = '<img src="'+firstPic.split(prodID)[0] + prodID + '_' + thisColorLink.parentNode.getAttribute('data-color') +'_7.jpg">'; //  + imgNumber +

                                addClass(thisColorLink, 'kk-img-switch');

                                thisColorLink.addEventListener('click', function(eClick){

                                    var newActiveColor = eClick.currentTarget,
                                        newColorParent = newActiveColor.parentNode,
                                        newColorID = newColorParent.getAttribute('data-color');

                                    // Workaround für doppelte Darstellung der Image Galerie, CTL, wenn der Ladeprozess zu lange braucht (viele Klicks auf andere Farbauswahl)
                                    if(isColorChange === true){

                                        eClick.stopPropagation();

                                    } else if(newColorID !== null && newColorID !== selectedColor && isColorChange === false){
                                        
                                        isColorChange = true;

                                        selectedColor = newColorID;
                                        
                                        changeColor(eClick);
                                    }
                                });
                            }
                        } catch (error) {
                            setErrorTracking("kk17_setup_colorswitch_monitor", error);
                        }
                    }
                });
            }
        });

        createCTL(true);
    
        // Klick auf mehr Details
        WATO.elem('.js-pds-more-details', function(moreDetails){
            if(moreDetails){
                moreDetails = moreDetails[0];
                moreDetails.insertAdjacentHTML('beforebegin', 
                    '<a class="btn-simple-link kk_moreinfos" href="#">Mehr Produktdetails</a>'
                );
                WATO.qs(".kk_moreinfos", moreDetails.parentNode).addEventListener('click', function(e){
                    e.preventDefault();
    
                    try {
                        // window.ACC.global.scrollToElement();
    
                        $('html, body').animate(
                        {
                            scrollTop: $("#infoTabs").offset().top - 154
                        }, 500);
    
                    } catch (error) {
                        setErrorTracking("wa_setup_monitoring3", error);
                    }
                });
            }
        });
    
        WATO.ready(function(){
            // Weiterlesen Buttons im Produkttext oder in den Kundenbewertungen werden aufgeklappt
            setTimeout(function(){
                WATO.elem(function(){
                    return typeof window.ACC !== "undefined" && typeof window.ACC.global !== "undefined";
                }, function(accGloablIsAvaliable){
                    if(accGloablIsAvaliable){
                        window.ACC.global.destroyShorten(".js_triggerShortenDestroy");
                    }
                });
            }, 1500);
        });

    } 

})(new window.WATO(), window);