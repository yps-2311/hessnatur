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

    // function KK_AB07_BOX(ecoData) {

	// 	// function formatValue(value) {
	// 	// 	var toRound = value > 999 ? 10 : 100,
	// 	// 		num_parts = (Math.round(value * toRound) / toRound).toString().split(".");
	// 	// 	num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	// 	// 	return num_parts.join(",");
	// 	// }

	// 	// var waterValue = formatValue(ecoData[0]),
	// 	// 	earthValue = formatValue(ecoData[1]),
	// 	// 	savings = [
	// 	// 		['water', waterValue + ' l', 'weniger <br/>Wasserverbrauch', '91% Einsparung von Wasser durch <br/>Verwendung von Regenwasser, im <br/>Boden gespeicherte Feuchtigkeit und <br/>Anwendung verbrauchsarmer <br/>Bewässerungsmethoden.'],
	// 	// 		['co2', '46 %', 'weniger <br/>CO2-Ausstoß', '46 % CO2 Einsparung durch weniger <br/>energieintensive Arbeitsmethoden im <br/>Bio-Anbau und den Verzicht auf <br/>Mineraldünger und Pestizide.'],
	// 	// 		['earth', earthValue + ' m²', 'mehr <br/>gesunde Erde', earthValue + ' m² mehr gesunde Erde durch <br/>Vermeidung von Pestiziden, <br/>künstlichen Düngemitteln und <br/>Entlaubungsmitteln.']
	// 	// 	];

	// 	// return {
	// 	// 	savings: savings,
    //     // };
        
    //     function formatValue(value) {
	// 		var toRound = value > 999 ? 10 : 100,
	// 			num_parts = (Math.round(value * toRound) / toRound).toString().split(".");
	// 		num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	// 		return num_parts.join(",");
	// 	}

	// 	var waterValue = formatValue(ecoData[0]),
	// 		earthValue = formatValue(ecoData[1]),
	// 		savings = [
	// 			['water', waterValue + ' l', 'weniger <br/>Wasserverbrauch', '91% Einsparung von Wasser durch <br/>Verwendung von Regenwasser, im <br/>Boden gespeicherte Feuchtigkeit und <br/>Anwendung verbrauchsarmer <br/>Bewässerungsmethoden.'],
	// 			['co2', '46 %', 'weniger <br/>CO2-Ausstoß', '46 % CO2 Einsparung durch weniger <br/>energieintensive Arbeitsmethoden im <br/>Bio-Anbau und den Verzicht auf <br/>Mineraldünger und Pestizide.'],
	// 			['earth', earthValue + ' m²', 'mehr <br/>gesunde Erde', earthValue + ' m² mehr gesunde Erde durch <br/>Vermeidung von Pestiziden, <br/>künstlichen Düngemitteln und <br/>Entlaubungsmitteln.']
	// 		];

	// 	var savingsMarkup = '';

	// 	for (var i = 0; i < savings.length; i++) {
	// 		savingsMarkup += '<li><i class="kk07_eco__icon ' + savings[i][0] + '"></i><strong>' + savings[i][1] + '</strong>' + savings[i][2] + '</li>';
	// 	}

	// 	return {
	// 		savings: savings,
	// 		markup: '<div class="row kk07_header">' +
	// 			'<div class="column">' +
	// 			'<div>' +
	// 			'<div class="kk07_headline">' +
	// 			'<span>' +
	// 			'Ökologische Ersparnis' +
	// 			// (pds ? '' : '<br/>durch diesen Einkauf') +
	// 			'</span>' +
    //             // (pds ? 'bei der Herstellung dieses Artikels.' : 'Durch Ihren Einkauf helfen Sie uns die Welt ein Stück besser zu machen.') +
    //             'bei der Herstellung dieses Artikels.'+
	// 			'</div>' +
	// 			'<div>' +
	// 			'<ul>' +
	// 			savingsMarkup +
	// 			'</ul>' +
    //             // (pds ? '<a href="#kk07_ecological">mehr Infos</a>' : '') +
    //             '<a href="#kk07_ecological">mehr Infos</a>'+
	// 			'</div>' +
	// 			'</div>' +
	// 			'</div>' +
	// 			'</div>'
	// 	};
	// }


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

    // function setPlaceholder(id, text) {
    //     WATO.elem(id, function(placeholder){
    //         if(placeholder){
    //             placeholder[0].setAttribute('placeholder', text);
    //         }
    //     });
    // }

    // Complete the Look
    function createCTL() {
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

        if(window.iridion.econda){
            window.iridion.econda.push(["Sprint17desktop", "V1"]);
        }

        WATO.sprint17goals();

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
        // WATO.elem('.js-pds-more-details', function(moreDetails){
        //     if(moreDetails){
        //         moreDetails = moreDetails[0];
        //         moreDetails.insertAdjacentHTML('beforebegin', 
        //             '<a class="btn-simple-link kk_moreinfos" href="#">Mehr Produktdetails</a>'
        //         );
        //         WATO.qs(".kk_moreinfos", moreDetails.parentNode).addEventListener('click', function(e){
        //             e.preventDefault();
    
        //             try {
        //                 // window.ACC.global.scrollToElement();
    
        //                 $('html, body').animate(
        //                 {
        //                     scrollTop: $("#infoTabs").offset().top - 154
        //                 }, 500);
    
        //             } catch (error) {
        //                 setErrorTracking("wa_setup_monitoring3", error);
        //             }
        //         });
        //     }
        // });

        var eco_data = JSON.parse(window.localStorage.getItem('kk_ecological')) || {},
            excludedProducts = ['4782699', '4782600', '4783599', '4782200', '4782400', '4782800', '4782899', '4783500', '4783700', '4783799'],
            id = window.document.location.pathname.split("/p/");//document.URL.match(/(de|at|ch)\/.*\/p\/(\d+)/);
        
        if (id.length > 0 && excludedProducts.indexOf(id[1]) === -1) {
            id = id[1].substring(0,7); // ID fix: DL 11.10.2021

            if (eco_data[id] && new Date().getTime() - eco_data[id].timestamp < 86400000) {
                window.kk07_ecoData = eco_data[id];
            } else if(id.length > 5){
                WATO.xhr_get('https://products.hessnatur.com/products/' + id, function (data) {
                    if (data) {
                        var ecoData = data.products[0].ecological_data;
                        if (ecoData) {
                            if (ecoData.water_savings_in_liter &&
                                ecoData.carbon_dioxide_savings_in_gram &&
                                ecoData.clean_earth_consumption_in_square_meter) {
                                window.kk07_ecoData = eco_data[id] = Object.assign(ecoData, { timestamp: new Date().getTime() });
                                window.localStorage.setItem('kk_ecological', JSON.stringify(eco_data));
                            }
                        }
                    }
                });
            }
        }
    
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


            // Vom AB07 Ökologischen Fußabdruck

            // var savings,
            //     ecoWrapper;

            document.documentElement.classList.add('kk07B');

            function formatNumber(num) {
                num = Math.round(num * 100) / 100;
                var num_parts = num.toString().split(".");
                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                return num_parts.join(",");
            }

            WATO.elem(function () {
                return WATO.qs('.js-product-info .large-10') && !!window.kk07_ecoData;
            }, function (run) {
                if (run) {

                    var savingMeter = window.kk07_ecoData.clean_earth_consumption_in_square_meter.toFixed(1).replace(".",",");
        
                    WATO.qs('.js-product-info').insertAdjacentHTML('afterend',
                        '<div class="row show-for-medium" style="order: 4;">'+
                        '<div class="column small-12" id="kk07_ecological">' +
                        '<div class="h3"><b>Ökologische Ersparnis:</b> im Vergleich zum<br>konventionellen Baumwollanbau</div>' +
                        '<div class="row">' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_eco__icon water"></div>' +
                        '<div class="kk07_eco__amount"><span data-property="water_savings_in_liter">' + formatNumber(window.kk07_ecoData.water_savings_in_liter) + '</span> l</div>' +
                        '<strong>weniger Wasserverbrauch</strong>' +
                        '<span>91% Einsparung von Wasser durch Verwendung von Regenwasser, im Boden gespeicherte Feuchtigkeit und Anwendung verbrauchsarmer Bewässerungsmethoden.</span>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_eco__icon co2"></div>' +
                        '<div class="kk07_eco__amount">46%</div>' +
                        '<strong>weniger CO2-Ausstoß</strong>' +
                        '<span>46% CO2 Einsparung durch weniger energieintensive Arbeitsmethoden im Bio-Anbau und den Verzicht auf Mineraldünger und Pestizide.</span>' +
                        '</div>' +
                        '<div class="column large-4 kk07_eco__point">' +
                        '<div class="kk07_eco__icon earth"></div>' +
                        '<div class="kk07_eco__amount"><span data-property="clean_earth_in_square_meter">' + savingMeter + '</span> m<sup>2</sup></div>' +
                        '<strong>mehr gesunde Erde</strong>' +
                        '<span>'+savingMeter+' m² mehr gesunde Erde durch Vermeidung von Pestiziden, künstlichen Düngemitteln und Entlaubungsmitteln.</span>' +
                        '</div>' +
                        '</div>'+
                        '</div>'
                        // '<div class="kk07_eco__footer">' +
                        // '<a href="#">Mehr erfahren</a> ' +
                        // '<small>*im Vergleich zur konventionellen Produktion</small></div>' +
                        // '</div>'
                        );
        
                }
            });

			// WATO.elem(function () {
			// 	return !!window.kk07_ecoData;
			// }, function (run) {
			// 	if (run) {

            //         console.log(2);

			// 		var productInfo = JSON.parse(window.localStorage.getItem('kk_eco_products')) || {},
			// 			ecoData = [window.kk07_ecoData.water_savings_in_liter, window.kk07_ecoData.clean_earth_consumption_in_square_meter],
			// 			boxInfos = KK_AB07_BOX(ecoData, true);

			// 		savings = boxInfos.savings;

			// 		productInfo[document.URL.match(/de\/.*\/p\/(\d+)/)[1]] = ecoData;
			// 		window.localStorage.setItem('kk_eco_products', JSON.stringify(productInfo));

            //         console.log(3);

			// 		WATO.elem('.pds-cockpit__wrapper .align-justify', function (headerElem) {
			// 			if (headerElem) {
			// 				headerElem[0].insertAdjacentHTML('afterend', boxInfos.markup);
			// 			}
			// 		});

            //         console.log(4);

			// 		WATO.elem('.kk07_header', function (headerElement) {
			// 			if (headerElement) {
			// 				headerElement = headerElement[0];
			// 				// headerElement.addEventListener('click', function () {
			// 				// 	pushGoal('kk07_click_element');
			// 				// });

			// 				WATO.qs('a', headerElement).addEventListener('click', function (e) {
			// 					e.preventDefault();
			// 					// pushGoal('kk07_click_more_info');
			// 					jQuery("html, body").animate({ scrollTop: jQuery('#kk07_ecological').offset().top - 75 });
			// 				});
			// 			}
			// 		});

			// 		WATO.elem('#kk07_ecological', function (ecoElem) {
			// 			if (ecoElem) {
            //                 console.log('ecoElem: ', ecoElem);
			// 				ecoWrapper = ecoElem[0];
			// 				WATO.qs('.h3', ecoWrapper).innerHTML = '<strong>Ökologische Ersparnis:</strong> Im Vergleich zum <br/>konventionellen Baumwollanbau';

			// 				Array.prototype.forEach.call(WATO.qsa('.kk07_eco__point', ecoWrapper), function (ecoPoint, index) {
			// 					for (var i = 1; i < 4; i++) {
			// 						ecoPoint.children[i].innerHTML = savings[index][i];
			// 					}
			// 				});
			// 				ecoWrapper.style.opacity = '1';
			// 			}
			// 		});
			// 	}
			// });
        });

    } 

})(new window.WATO(), window);


// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,i,n,o,r){var a,s=this||o,c=r||Date.now(),l=!1;return Date.now()-c>2e4?(i(!1),!1):("string"==typeof e?l=(a=t.querySelectorAll(e)).length>0:a=l=!0===e(),!0===l?i(a):setTimeout(s.elem.bind(null,e,i,n,s,c),n||20))},e.WATO.prototype.qs=function(e,i){return(i||t).querySelector(e)},e.WATO.prototype.qsa=function(e,i){return(i||t).querySelectorAll(e)},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var i=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(n,o,r,a,s){this.addEventListener("loadend",(function(){var i=this.responseText;4===this.readyState&&-1!==o.indexOf(e)&&t(o,i)}),!1),i.call(this,n,o,r,a,s)}},e.WATO.prototype.setCookie=function(e,i,n,o){var r=new Date;r.setDate(r.getDate()+365),t.cookie=e+"="+encodeURIComponent(i)+";"+(o?"":"expires="+r.toUTCString()+";")+"domain="+n+";path=/"},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_get=function(e,t,i){var n=new XMLHttpRequest;n.open("GET",e,!0),n.timeout=2e3,n.onload=function(){if(this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);t(e,i)}catch(e){t(!1)}else t(!1)},n.onerror=function(){t(!1)},n.send()},e.WATO.prototype.exclude=function(i,n){function o(){(e.innerWidth||t.body.clientWidth)<=i&&!r&&(r=!0,n())}var r=!1;o(),"function"==typeof n&&(e.onresize=function(){o()})}}(window,document),function(e,t){"use strict";e.prototype.goalPush=function(e,i){i?t.iridion.push(["goal",e,"",!0]):t.iridion.push(["goal",e])},e.prototype.sprint17goals=function(e){var t=this;t.exclude(1023,(function(){t.reload()}))}}(window.WATO,window),function(e,t){"use strict";var i=-1===document.cookie.indexOf("kksp17desk_exclude=true"),n=!1;function o(e){var i=t.innerWidth*e;return i>852.8?852.8:parseFloat(i).toFixed(3)}function r(e){e&&e.parentNode.removeChild(e)}function a(e,t){e&&e.classList.add(t)}function s(e,t){e&&e.classList.remove(t)}function c(t,i){-1!==document.cookie.indexOf("kk=testpreview")&&console.log(i),e.goalPush(t)}function l(e,t){return'<div class="kk_slider main-carousel">'+e+'</div><div class="kk_carouselnav carousel carousel-nav">'+t+"</div>"}function d(i){e.elem(".pds__imageAndCockpitWrapper",(function(s){if(s)try{s=s[0],null===e.qs(".kk_sliderWrapper",s)&&s.insertAdjacentHTML("afterbegin",'<div class="kk_sliderWrapper"></div>'),e.elem((function(){return!i||void 0!==t.ACC&&void 0!==t.ACC.productDetail&&void 0!==t.ACC.productDetail.galleryImages}),(function(c){if(c){var d=e.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer:not(.kk-thumb)",s),u="",p="",m=function(){e.elem((function(){return void 0!==t.jQuery&&void 0!==t.Flickity}),(function(){try{var e={cellAlign:"left",cellSelector:".carousel-cell",draggable:!1,wrapAround:!0,pageDots:!1},i=d.length;i<=2&&(e.prevNextButtons=!1,e.pageDots=!1,1===i&&(e.cellAlign="center")),jQuery(".kk_slider").flickity(e),setTimeout((function(){jQuery(".kk_slider .flickity-viewport").css("height",o(.4398)+"px")}),300);var r=jQuery(".kk_carouselnav");i>2?r.flickity({asNavFor:".kk_slider",cellAlign:"left",contain:!0,pageDots:!1,prevNextButtons:!1}):r.hide(),n=!1}catch(e){t.iridion.push(["goal","wa_setup_monitoring1",e.toString()])}}))};if(i)e.elem((function(){return(d=e.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer:not(.kk-thumb)",s)).length>0&&void 0!==t.ACC&&void 0!==t.ACC.productDetail&&void 0!==t.ACC.productDetail.galleryImages&&t.ACC.productDetail.galleryImages.length>0}),(function(t){if(t){for(var i=0;i<d.length;i++){var n=d[i].getAttribute("data-image");a(d[i],"kk-thumb"),u+='<div class="carousel-cell"><a href="'+n.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom"><img src="'+n+'"></a></div>',p+='<div class="carousel-cell"><img src="'+n.replace("_main/","_thumb/")+'"></div>'}r(e.qs(".kk_slider",s)),r(e.qs(".kk_carouselnav",s)),e.qs(".kk_sliderWrapper").insertAdjacentHTML("afterbegin",l(u,p)),m()}}));else{for(var v=0;v<d.length;v++){var g=d[v].getAttribute("data-image");a(d[v],"kk-thumb"),u+='<div class="carousel-cell"><a href="'+g.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom"><img src="'+g+'"></a></div>',p+='<div class="carousel-cell"><img src="'+g.replace("_main/","_thumb/")+'"></div>'}r(e.qs(".kk_slider",s)),r(e.qs(".kk_carouselnav",s)),e.qs(".kk_sliderWrapper",s).innerHTML=l(u,p),m()}}}))}catch(e){c("wa_setup_monitoring",e)}}))}function u(){e.elem(".js-jump-complete-look",(function(i){i&&e.elem((function(){return e.qsa(".h-xxLargeOffset-bottom-inner-xLarge-up > img").length>0&&!e.qs(".kk_ctl")}),(function(){var n,a,s,c,l,d=e.qs(".h-xxLargeOffset-bottom-inner-xLarge-up > img");try{if((i=i[0]).innerHTML="Complete the Look",d){var u=d.getAttribute("src").replace("_reco","_main"),p=e.qs(".js-completeTheLookWrapper");if(i.setAttribute("style","background-image: url("+u+")"),e.elem(".kk_sliderWrapper",(function(t){if(t){var n=i.cloneNode(!0);t=t[0],e.qs(".js-jump-complete-look",t)&&t.removeChild(e.qs(".js-jump-complete-look",t)),t.insertAdjacentElement("beforeend",n)}})),p){var m=e.qsa(".item__image",p);r(e.qs("#look")),p.insertAdjacentHTML("beforeend",'<div class="kk_ctl" id="look"><img src="'+u+'"><div class="kk_rightlook"><div class="kk_subline">Complete the Look</div><div class="kk_teaser">Für mehr Stil: Ihr Perfektes Outfit</div><div id="kk_ctlwrapper"></div></div></div>');for(var v=e.qs("#kk_ctlwrapper",p.parentNode),g=0;g<m.length;g++){var k=m[g].cloneNode(!0),f=e.qs("img",k);f&&f.setAttribute("src",f.getAttribute("src").replace("hyb_redes_reco","hyb_redes_detail_main")),v.insertAdjacentElement("beforeend",k)}n="#kk_ctlwrapper",a=!1,s=m.length>2,c=.41,e.elem((function(){return"undefined"!=typeof $}),(function(e){if(e)try{var i={draggable:!0,cellAlign:"left",contain:!0,prevNextButtons:!!s,pageDots:!!l,percentPosition:!0,setGallerySize:!0,adaptiveHeight:!!a};"#kk_rating_gallery"===n&&!1===s&&(i.cellAlign="center"),"#kk_ctlwrapper"===n&&s&&(i.initialIndex=0,i.pageDots=!0,i.groupCells=2),$(n).flickity(i),"#kk_ctlwrapper"===n&&setTimeout((function(){jQuery(n+" .flickity-viewport").css("height",o(c)+"px")}),300)}catch(e){t.iridion.push(["goal","wa_setup_monitoring1",e.toString()])}})),e.elem((function(){return void 0!==t.MagicZoom&&void 0!==t.MagicZoom.start}),(function(e){e&&t.MagicZoom.start()}))}}}catch(e){t.iridion.push(["goal","kk17_setup_ctl_monitor",document.URL]),t.iridion.push(["goal","catchMonitoring",e.toString()])}}))}))}if(i){t.iridion.econda&&t.iridion.econda.push(["Sprint17desktop","V1"]),e.sprint17goals(),e.elem((function(){return void 0!==t.jQuery&&void 0!==t.Flickity}),(function(){!function(e,t){"function"==typeof define&&define.amd?define(["flickity/js/index","fizzy-ui-utils/utils"],t):"object"==typeof module&&module.exports?module.exports=t(require("flickity"),require("fizzy-ui-utils")):e.Flickity=t(e.Flickity,e.fizzyUIUtils)}(t,(function(e,t){e.createMethods.push("_createAsNavFor");var i=e.prototype;return i._createAsNavFor=function(){this.on("activate",this.activateAsNavFor),this.on("deactivate",this.deactivateAsNavFor),this.on("destroy",this.destroyAsNavFor);var e=this.options.asNavFor;if(e){var t=this;setTimeout((function(){t.setNavCompanion(e)}))}},i.setNavCompanion=function(i){i=t.getQueryElement(i);var n=e.data(i);if(n&&n!==this){this.navCompanion=n;var o=this;this.onNavCompanionSelect=function(){o.navCompanionSelect()},n.on("select",this.onNavCompanionSelect),this.on("staticClick",this.onNavStaticClick),this.navCompanionSelect(!0)}},i.navCompanionSelect=function(e){var t=this.navCompanion&&this.navCompanion.selectedCells;if(t){var i,n,o,r=t[0],a=this.navCompanion.cells.indexOf(r),s=a+t.length-1,c=Math.floor((i=a,n=s,o=this.navCompanion.cellAlign,(n-i)*o+i));if(this.selectCell(c,!1,e),this.removeNavSelectedElements(),!(c>=this.cells.length)){var l=this.cells.slice(a,s+1);this.navSelectedElements=l.map((function(e){return e.element})),this.changeNavSelectedClass("add")}}},i.changeNavSelectedClass=function(e){for(var t=this.navSelectedElements,i=0;i<t.length;i++){t[i].classList[e]("is-nav-selected")}},i.activateAsNavFor=function(){this.navCompanionSelect(!0)},i.removeNavSelectedElements=function(){this.navSelectedElements&&(this.changeNavSelectedClass("remove"),delete this.navSelectedElements)},i.onNavStaticClick=function(e,t,i,n){"number"==typeof n&&this.navCompanion.selectCell(n)},i.deactivateAsNavFor=function(){this.removeNavSelectedElements()},i.destroyAsNavFor=function(){this.navCompanion&&(this.navCompanion.off("select",this.onNavCompanionSelect),this.off("staticClick",this.onNavStaticClick),delete this.navCompanion)},e}))})),d(!1),e.elem(".breadcrumb--back a",(function(e){e&&((e=e[0]).innerHTML="zurück")})),e.elem(".js-badges-container",(function(t){t&&e.elem(".pds-cockpit__ratingSummaryWrapper",(function(i){i&&(i=i[0],e.qs("a + span",i).innerHTML=e.qs("meta",i).getAttribute("content").substring(0,4),t[0].insertAdjacentElement("afterbegin",i),e.qs(".starRatingWrapper",i).setAttribute("data-open-accordion-css-selector",".ang_detail_additional"))}))})),e.elem(".productInfoAccordion .accordion-item",(function(t){if(t){var i=t[0].parentNode;i.insertAdjacentHTML("beforebegin",'<div id="infoTabs"></div>'),e.qs("div",t[0]).classList.add("kk_show");for(var n=e.qs("#infoTabs",i.parentNode),o=0;o<t.length;o++){var r=e.qs("div",t[o]),c=r.previousElementSibling.textContent;if("Produktbeschreibung"===c&&(c="Produktdetails"),r.insertAdjacentHTML("afterbegin","<h4>"+c+"</h4>"),"Passform"===r.getAttribute("id"))e.qs(".kk_carousel:first-child",n).insertAdjacentHTML("afterend",'<div class="kk_carousel'+(0===o?" kk_active":"")+'" data-index="'+o+'" data="'+r.getAttribute("id")+'">'+c+"</div>");else if("Pflege"!==r.getAttribute("id")||0!==e.qsa("#Pflege li").length)if("Pflege"===r.getAttribute("id")){var l=e.qs('.kk_carousel[data="Material"]'),d=e.qs("#Material");l&&d?(l.innerHTML="Material und Pflege",d.insertAdjacentHTML("beforeend",r.innerHTML)):n.insertAdjacentHTML("beforeend",'<div class="kk_carousel'+(0===o?" kk_active":"")+'" data-index="'+o+'" data="'+r.getAttribute("id")+'">'+c+"</div>")}else n.insertAdjacentHTML("beforeend",'<div class="kk_carousel'+(0===o?" kk_active":"")+'" data-index="'+o+'" data="'+r.getAttribute("id")+'">'+c+"</div>");var u=e.qs(".kk_carousel[data-index='"+o+"']",n);u&&u.addEventListener("click",(function(t){var i=t.target,n=i.getAttribute("data");s(e.qs(".kk_show"),"kk_show"),s(e.qs(".kk_active"),"kk_active"),a(e.qs("#"+n),"kk_show"),a(i,"kk_active")}))}}})),e.elem('meta[property="og:image"]',(function(t){if(t){var i=t[0].getAttribute("content");e.elem("#Produktbeschreibung .column",(function(t){if(t){t=t[0];var n=e.qs(".pds-cockpit__articleNumber"),o=null!==e.qs(".pds-cockpit__shortDescription")?e.qs(".pds-cockpit__shortDescription").innerHTML:"";t.insertAdjacentHTML("beforeend",'<ul class="pds-cockpit__shortDescription kk-prod-uvp">'+o+"</ul>"),e.elem("#Produktbeschreibung .pds-cockpit__shortDescription",(function(i){i&&e.elem((function(){return null===e.qs("#Produktbeschreibung .pds-cockpit__shortDescription")}),(function(e){e&&t.insertAdjacentHTML("beforeend",'<ul class="pds-cockpit__shortDescription kk-prod-uvp">'+o+"</ul>")}))})),n&&(t.insertAdjacentElement("beforeend",n),e.elem("#Produktbeschreibung .pds-cockpit__articleNumber",(function(i){i&&e.elem((function(){return null===e.qs("#Produktbeschreibung .pds-cockpit__articleNumber")}),(function(e){e&&t.insertAdjacentElement("beforeend",n)}))}))),t.insertAdjacentHTML("afterend",'<img id="kk-prod-desc-img" src="'+i.replace("detail_zoom","detail_main").replace("_1.jpg","_7.jpg")+'">')}})),e.elem(".pds-cockpit__colorSwitch li a",(function(t){if(t)try{for(var o=i.replace("detail_zoom","detail_thumb"),r=o.match(/\d{5}/),s=t.length,l=-1,p=0;p<s;p++){var m=t[p],v=m.parentNode;v.classList.contains("active")&&v.getAttribute("data-color")&&(l=v.getAttribute("data-color")),m.innerHTML='<img src="'+o.split(r)[0]+r+"_"+m.parentNode.getAttribute("data-color")+'_7.jpg">',a(m,"kk-img-switch"),m.addEventListener("click",(function(t){var i,o,r,a,s=t.currentTarget.parentNode.getAttribute("data-color");!0===n?t.stopPropagation():null!==s&&s!==l&&!1===n&&(n=!0,l=s,o=(i=t).target.parentNode.getAttribute("data-color"),r=e.qs("img",i.currentTarget),a=e.qs("#kk-prod-desc-img"),o||(o=i.target.parentNode.parentNode.getAttribute("data-color")),d(parseInt(o)),u(),a&&r&&r.getAttribute("src")&&a.setAttribute("src",r.getAttribute("src").replace(/hyb_redes_detail_thumb/,"hyb_redes_detail_main")))}))}}catch(e){c("kk17_setup_colorswitch_monitor",e)}}))}})),u();var p=JSON.parse(t.localStorage.getItem("kk_ecological"))||{},m=t.document.location.pathname.split("/p/");m.length>0&&-1===["4782699","4782600","4783599","4782200","4782400","4782800","4782899","4783500","4783700","4783799"].indexOf(m[1])&&(m=m[1],p[m]&&(new Date).getTime()-p[m].timestamp<864e5?t.kk07_ecoData=p[m]:m.length>5&&e.xhr_get("https://products.hessnatur.com/products/"+m,(function(e){if(e){var i=e.products[0].ecological_data;i&&i.water_savings_in_liter&&i.carbon_dioxide_savings_in_gram&&i.clean_earth_consumption_in_square_meter&&(t.kk07_ecoData=p[m]=Object.assign(i,{timestamp:(new Date).getTime()}),t.localStorage.setItem("kk_ecological",JSON.stringify(p)))}}))),e.ready((function(){setTimeout((function(){e.elem((function(){return void 0!==t.ACC&&void 0!==t.ACC.global}),(function(e){e&&t.ACC.global.destroyShorten(".js_triggerShortenDestroy")}))}),1500),document.documentElement.classList.add("kk07B"),e.elem((function(){return e.qs(".js-product-info .large-10")&&!!t.kk07_ecoData}),(function(i){if(i){var n=t.kk07_ecoData.clean_earth_consumption_in_square_meter.toFixed(1).replace(".",",");e.qs(".js-product-info").insertAdjacentHTML("afterend",'<div class="row show-for-medium" style="order: 4;"><div class="column small-12" id="kk07_ecological"><div class="h3"><b>Ökologische Ersparnis:</b> im Vergleich zum<br>konventionellen Baumwollanbau</div><div class="row"><div class="column large-4 kk07_eco__point"><div class="kk07_eco__icon water"></div><div class="kk07_eco__amount"><span data-property="water_savings_in_liter">'+(o=t.kk07_ecoData.water_savings_in_liter,(r=(o=Math.round(100*o)/100).toString().split("."))[0]=r[0].replace(/\B(?=(\d{3})+(?!\d))/g,"."),r.join(",")+'</span> l</div><strong>weniger Wasserverbrauch</strong><span>91% Einsparung von Wasser durch Verwendung von Regenwasser, im Boden gespeicherte Feuchtigkeit und Anwendung verbrauchsarmer Bewässerungsmethoden.</span></div><div class="column large-4 kk07_eco__point"><div class="kk07_eco__icon co2"></div><div class="kk07_eco__amount">46%</div><strong>weniger CO2-Ausstoß</strong><span>46% CO2 Einsparung durch weniger energieintensive Arbeitsmethoden im Bio-Anbau und den Verzicht auf Mineraldünger und Pestizide.</span></div><div class="column large-4 kk07_eco__point"><div class="kk07_eco__icon earth"></div><div class="kk07_eco__amount"><span data-property="clean_earth_in_square_meter">')+n+"</span> m<sup>2</sup></div><strong>mehr gesunde Erde</strong><span>"+n+" m² mehr gesunde Erde durch Vermeidung von Pestiziden, künstlichen Düngemitteln und Entlaubungsmitteln.</span></div></div></div>")}var o,r}))}))}}(new window.WATO,window);