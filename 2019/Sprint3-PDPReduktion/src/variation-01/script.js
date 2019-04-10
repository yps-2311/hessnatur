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

    // var isflickityFullscreen = false;

    // function flickityFullscreen() {
    //     try {
    //         if(!isflickityFullscreen){

    //             /*!
    //             * Flickity fullscreen v1.1.1
    //             * Enable fullscreen view for Flickity
    //             */
        
    //             /*jshint browser: true, undef: true, unused: true, strict: true*/
        
    //             ( function( window, factory ) {
    //                 // universal module definition
    //                 /*jshint strict: false */ /*globals define, module, require */
    //                 if ( typeof define === 'function' && define.amd ) {
    //                     // AMD
    //                     define( [
    //                         'flickity/js/index',
    //                     ], factory );
    //                 } else if ( typeof module === 'object' && module.exports ) {
    //                     // CommonJS
    //                     module.exports = factory(
    //                         require('flickity')
    //                     );
    //                 } else {
    //                     // browser global
    //                     factory(
    //                         window.Flickity
    //                     );
        
    //                     // Fullscreen schließen mit ESC
    //                     document.addEventListener('keydown', function(event){
    //                         if (event.keyCode === 27) {
    //                             jQuery(".kk_slider").flickity('exitFullscreen');
    //                         }
    //                     }, false);
    //                 }
        
    //             }( window, function factory( Flickity ) {
        
    //                 // "use strict";
                    
    //                 Flickity.createMethods.push('_createFullscreen');
    //                 var proto = Flickity.prototype;
                    
                    
    //                 proto._createFullscreen = function() {
    //                     this.isFullscreen = false;
                    
    //                     if ( !this.options.fullscreen ) {
    //                         return;
    //                     }
    //                     // buttons
    //                     this.viewFullscreenButton = new FullscreenButton( 'view', this );
    //                     this.exitFullscreenButton = new FullscreenButton( 'exit', this );
                    
    //                     this.on( 'activate', this._changeFullscreenActive );
    //                     this.on( 'deactivate', this._changeFullscreenActive );
    //                 };
                    
    //                 // ----- activation ----- //
                    
    //                 proto._changeFullscreenActive = function() {
    //                     var childMethod = this.isActive ? 'appendChild' : 'removeChild';
    //                     this.element[ childMethod ]( this.viewFullscreenButton.element );
    //                     this.element[ childMethod ]( this.exitFullscreenButton.element );
    //                     // activate or deactivate buttons
    //                     var activeMethod = this.isActive ? 'activate' : 'deactivate';
    //                     this.viewFullscreenButton[ activeMethod ]();
    //                     this.exitFullscreenButton[ activeMethod ]();
    //                 };
                    
    //                 // ----- view, exit, toggle ----- //
                    
    //                 proto.viewFullscreen = function() {
    //                     this._changeFullscreen( true );
    //                     // this.focus();
    //                 };
                    
    //                 proto.exitFullscreen = function() {
    //                     this._changeFullscreen( false );
    //                 };
                    
    //                 proto._changeFullscreen = function( isView ) {
    //                     if ( this.isFullscreen === isView ) {
    //                         return;
    //                     }
    //                     this.isFullscreen = isView;
        
    //                     var classMethod = isView ? 'add' : 'remove';
        
    //                     document.documentElement.classList[ classMethod ]('is-flickity-fullscreen');
        
    //                     this.element.classList[ classMethod ]('is-fullscreen');
    //                     this.resize();
        
    //                     // HACK extra reposition on fullscreen for images
    //                     if ( this.isFullscreen ) {
    //                         this.reposition();
    //                     }
        
    //                     this.dispatchEvent( 'fullscreenChange', null, [ isView ] );
    //                 };
                    
    //                 proto.toggleFullscreen = function() {
    //                     this._changeFullscreen( !this.isFullscreen );
    //                 };
                    
    //                 // ----- setGallerySize ----- //
                    
    //                 // overwrite so fullscreen cells are full height
    //                 var setGallerySize = proto.setGallerySize;
        
    //                 proto.setGallerySize = function() {
    //                     if ( !this.options.setGallerySize ) {
    //                     return;
    //                     }
    //                     if ( this.isFullscreen ) {
    //                     // remove height style on fullscreen
    //                     this.viewport.style.height = '';
    //                     } else {
    //                     // otherwise, do normal
    //                     setGallerySize.call( this );
    //                     }
    //                 };
                    
    //                 // ----- keyboard ----- //
                    
    //                 // ESC key closes full screen
    //                 // Flickity.keyboardHandlers[27] = function() {
                        
    //                 //     this.exitFullscreen();
    //                 // };
    //                 // window.addEventListener("keydown", 27, function() {
    //                 //     // this.exitFullscreen();
    //                 //     console.log("aaa");
    //                 // });
                    
    //                 // ----- FullscreenButton ----- //
                    
    //                 function FullscreenButton( name, flickity ) {
    //                     this.name = name;
    //                     this.createButton();
    //                     this.createIcon();
    //                     // events
    //                     // trigger viewFullscreen or exitFullscreen on click
    //                     this.onClick = function() {
    //                     flickity[ name + 'Fullscreen' ]();
    //                     };
    //                     this.clickHandler = this.onClick.bind( this );
    //                 }
                    
    //                 FullscreenButton.prototype.createButton = function() {
    //                     var element = this.element = document.createElement('button');
    //                     element.className = 'flickity-button flickity-fullscreen-button ' +
    //                     'flickity-fullscreen-button-' + this.name;
    //                     // prevent button from submitting form
    //                     element.setAttribute( 'type', 'button' );
    //                     // set label
    //                     var label = capitalize( this.name + ' full-screen' );
    //                     element.setAttribute( 'aria-label', label );
    //                     element.title = label;
    //                 };
                    
    //                 function capitalize( text ) {
    //                     return text[0].toUpperCase() + text.slice(1);
    //                 }
                    
    //                 var svgURI = 'http://www.w3.org/2000/svg';
                    
    //                 var pathDirections = {
    //                     view: 'M15,20,7,28h5v4H0V20H4v5l8-8Zm5-5,8-8v5h4V0H20V4h5l-8,8Z',
    //                     exit: 'M32,3l-7,7h5v4H18V2h4V7l7-7ZM3,32l7-7v5h4V18H2v4H7L0,29Z',
    //                 };
                    
    //                 FullscreenButton.prototype.createIcon = function() {
    //                     var svg = document.createElementNS( svgURI, 'svg');
    //                     svg.setAttribute( 'class', 'flickity-button-icon' );
    //                     svg.setAttribute( 'viewBox', '0 0 32 32' );
    //                     // path & direction
    //                     var path = document.createElementNS( svgURI, 'path');
    //                     var direction = pathDirections[ this.name ];
    //                     path.setAttribute( 'd', direction );
    //                     // put it together
    //                     svg.appendChild( path );
    //                     this.element.appendChild( svg );
    //                 };
                    
    //                 FullscreenButton.prototype.activate = function() {
    //                     this.element.addEventListener( 'click', this.clickHandler );
    //                 };
                    
    //                 FullscreenButton.prototype.deactivate = function() {
    //                     this.element.removeEventListener( 'click', this.clickHandler );
    //                 };
                    
    //                 Flickity.FullscreenButton = FullscreenButton;
                    
    //                 return Flickity;
        
    //             }));
    //             // ----- Fullscreen Funktion ENDE ----- //

    //             isflickityFullscreen = true;
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    function sliderHeight() {
        var temp = window.innerWidth * 0.452;
        if(temp > 850){
            return 850;
        }else{
            return parseFloat(temp).toFixed(3);
        }
    }


    function buildHeader(colorID) {
        console.log('clicked: ', colorID);

        // WATO.qs(".pds__imageAndCockpitWrapper")
        
        // Gallerie und Buybox
        WATO.elem('.pds__imageAndCockpitWrapper', function(mainWrapper){
            if(mainWrapper){
                console.log('mainWrapper: ', mainWrapper);
                try {
                    mainWrapper = mainWrapper[0];

                    WATO.elem(function() {
                        if(colorID){
                            // console.log('WATO.qs(.show-for-medium-only .thumbnailContainer.js_thumbnailContainer, mainWrapper): ', WATO.qs('.show-for-medium-only .thumbnailContainer.js_thumbnailContainer', mainWrapper));
                            // return WATO.qs('.show-for-medium-only .thumbnailContainer.js_thumbnailContainer', mainWrapper).getAttribute("data-color") === colorID;
                            return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
                        }else{
                            return true;
                        }
                    }, function(avalibeColorImages){
                        console.log('----------- avalibeColorImages: ', avalibeColorImages);
                        if(avalibeColorImages){


                            var existingSlider = WATO.qs(".kk_slider", mainWrapper);

                            if(existingSlider){
                                console.log('existingSlider: ', existingSlider);
                                existingSlider.parentNode.removeChild(existingSlider);
                            }


                            var thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer", mainWrapper),
                                markupHTML = "";
                                // lessProducts = thumbnails.length <= 2;


                            if(colorID){
                                colorID = parseInt(colorID);

                                var galleryImgs = window.ACC.productDetail.galleryImages;

                                for (var j = 0; j < galleryImgs.length; j++) {
                                    var thisProduct = galleryImgs[j];
                                    console.log('thisProduct: ', thisProduct);
                                    if(parseInt(thisProduct.product.color) === colorID){
                                        // markupHTML += '<div class="carousel-cell"><img src="'+thisProduct.url.replace("_main/","_reco/")+'"></div>';
                                        var picURL = thisProduct.zoom.url;
                                        console.log('picURL: ', picURL);
                                        markupHTML += 
                                        '<div class="carousel-cell">'+
                                            '<a href="'+picURL+'" data-options="zoomPosition: right" class="MagicZoom">'+
                                                '<img src="'+picURL.replace("_zoom/","_reco/")+'">'+
                                            '</a>'+
                                        '</div>';
                                    }
                                }
                            }else{
                                // Neue Gallerie Markup wird gebaut
                                for (var i = 0; i < thumbnails.length; i++) {
                                    var productPicURL = thumbnails[i].getAttribute("data-image");
                                    // markupHTML += '<div class="carousel-cell"><img src="'+thumbnails[i].getAttribute("data-image").replace("_main/","_reco/")+'"></div>';
                                    markupHTML += 
                                    '<div class="carousel-cell">'+
                                        '<a href="'+productPicURL.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom">'+ //zoomWidth:600px; zoomHeight:1000px; 
                                            '<img src="'+productPicURL.replace("_main/","_reco/")+'">'+
                                        '</a>'+
                                    '</div>';
                                }
                            }

        
                            // Markup und Statische Felder für "Complete the Look" und "Titel" werden eingebaut
                            mainWrapper.insertAdjacentHTML('afterbegin', 
                                '<div class="kk_slider small-8 main-carousel" style="height: '+sliderHeight()+'px">'+ // style="min-height: '+(window.innerWidth * 0.4149)+'px"
                                    // '<div class="static-banner kk_title"></div>'+
                                    '<div class="static-banner kk_complete"><span>Complete the Look &rsaquo;</span></div>'+
                                    markupHTML+
                                '</div>'
                            );
                            // window.MagicZoom.refresh();

                            // Produkttitel für Fullscreenanzeige einbauen
                            // WATO.elem('.pds-cockpit__productName', function(title){
                            //     if(title){
                            //         WATO.qs(".kk_title", mainWrapper).innerHTML = title[0].textContent;
                            //     }
                            // });

                            // var colorText = WATO.qs(".js-color-name", mainWrapper);
                            // console.log('colorText: ', colorText);
                            // if(colorText){
                            //     colorText.innerHTML = colorText.textContent.split("(")[0];
                            // }
        
                            // Auf jQuery und Gallerie Funktion warten
                            WATO.elem(function(){
                                return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                            }, function(){
                                try {
        
                                    // Fullscreen Funktion nachträglich eingebaut
                                    // flickityFullscreen();
        
                                    // MagicZoom.refresh();
        
                                    // Slider Options
                                    var sliderOptions = {
                                        cellAlign: 'left',
                                        cellSelector: '.carousel-cell',
                                        // imagesLoaded: true,
                                        draggable: false,
                                        // lazyLoad: 2,
                                        wrapAround: true,
                                        // fullscreen: true
                                    },
                                    thumbPics = thumbnails.length;
        
                                    if(thumbPics <= 2){
                                        // Bei einem oder zwei Produktbilder die
                                        // Interaktion mit der Gallerie deaktivieren
                                        // sliderOptions.draggable = false;
                                        sliderOptions.prevNextButtons = false;
                                        sliderOptions.pageDots = false;
        
                                        if(thumbPics === 1){
                                            sliderOptions.cellAlign = 'center';
                                        }
                                    }
                                    // Init Slider
                                    jQuery('.kk_slider').flickity(sliderOptions);


                                    // WATO.elem(function(){
                                    //     return typeof window.MagicZoom !== "undefined" && typeof window.MagicZoom.start !== "undefined";
                                    // }, function(){
                                    //     try {
                                    //         window.MagicZoom.start();
                                    //         console.log('window.MagicZoom: ', window.MagicZoom.start);
                                    //     } catch (error) {
                                    //         console.log(error);
                                    //     }
                                    // });


                                    // Complete the Look
                                    // Funktion ist original von der Seite übernommen
                                    WATO.qs(".kk_complete").addEventListener('click', function(){
                                        var completeBtn = jQuery(".js-completeTheLookWrapper").first();
                                        if(completeBtn.length){
                                            window.ACC.global.scrollToElement(completeBtn);
                                        }
                                    });
        
                                } catch (error) {
                                    console.log(error);
                                }
                            });



                        }
                    });

                } catch (error) {
                    console.log(error);
                }
            }
        });
    }


    WATO.exclude(1024, function(){
        window.location.reload();
        window.location.href=location.href.split('#')[0];
    });


    // RESIZE passt die größe der Gallerie an
    window.addEventListener('resize', function(){
        var mySlider = WATO.qs(".kk_slider");
        if(mySlider){
            console.log('sliderWidht()+"px": ', sliderHeight()+"px");
            mySlider.style.height = sliderHeight()+"px";
        }
    });





    // WATO.qs("head").insertAdjacentHTML('beforeend', 
    //         '<style>'+
    //             '.kk_slider{'+
    //                 'max-height: '+ (window.innerWidth * 0.444) + 'px;' +
    //             '}'+
    //             '.kk_slider .flickity-viewport{'+
    //                 'min-height: '+ (window.innerWidth * 0.4149) + 'px;' +
    //             '}'+
    //         '</style>'
    //     );

    buildHeader(false);

    // Größe Dropdown
    WATO.elem('#desc__size', function(size){
        if(size){
            size = size[0];
            WATO.qs("option", size).innerHTML = "Wählen";
            size.parentNode.classList.add("kk_sizeWrapper");
        }
    });

    // Farbe wechseln
    WATO.elem('.pds-cockpit__colorSwitch a', function(colorSwitcher){
        if(colorSwitcher){
            var clickColor = function(){
                buildHeader(this.parentNode.getAttribute("data-color"));
            };
            for (var k = 0; k < colorSwitcher.length; k++) {
                colorSwitcher[k].addEventListener('click', clickColor);
            }
        }
    });


    // Bullets von der Buybox, Artikelnummer und Telefonnummer
    // werden zum Erklärungstext Bereich verschoben

    // Bulletpoints in der Buybox
    WATO.elem('.pds-cockpit__shortDescription', function(buyboxDescription){
        if(buyboxDescription){
            buyboxDescription = buyboxDescription[0];

            // Produkt Erklärungstext Bereich
            WATO.elem('.productInfosItem .pds-productDescription__text', function(productDescriptionText){
                if(productDescriptionText){
                    try {
                        productDescriptionText = productDescriptionText[0];

                        var thisText = productDescriptionText.textContent,
                            prodTextParent = productDescriptionText.parentNode,
                            buybox = buyboxDescription.parentNode,
                            moreDetailsBtn = WATO.qs(".js-pds-more-details", buybox),
                            articleNr = WATO.qs(".pds-cockpit__articleNumber");
                        
                        // Produktinfo-Text gekürzt auf das nächste Leerzeichen nach 145 Zeichen
                        if(thisText.length > 145){
                            for (var i = 145; i < thisText.length; i++) {
                                if(thisText[i].charAt(0) === " "){
                                    thisText = thisText.substring(0, i) + " … ";
                                    break;
                                }
                            }
                        }
                        // Buybox Produktinfo-Text
                        buyboxDescription.insertAdjacentHTML('afterend', '<div class="kk_desc">'+thisText+'</div>');
                        
                        // Telefonnummer
                        prodTextParent.insertAdjacentHTML('afterend', '<div class="column small-12 kk_tel">Haben Sie Fragen zum Artikel? Rufen Sie uns zum Ortstarif an: '+
                            '<b>06033 / 181 33 33</b></div>');

                        // Mehr Produktdetails - Scrollto Button hinter dem abgeschnittenen Text platzieren
                        if(moreDetailsBtn){
                            moreDetailsBtn.innerHTML = "mehr Produktdetails";
                            WATO.qs(".kk_desc", buybox).insertAdjacentElement('beforeend', moreDetailsBtn);
                        }

                        // ... zum Erklärungstext Bereich verschoben
                        prodTextParent.insertAdjacentElement('beforebegin', buyboxDescription);

                        // Artikelnummer verschoben
                        if(articleNr){
                            articleNr.classList.add("medium-12");
                            prodTextParent.insertAdjacentElement('beforebegin', articleNr);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });

            // Größenberater umbenennen
            WATO.elem('#size_advisor', function(sizeAdvisor){
                if(sizeAdvisor){
                    sizeAdvisor[0].innerHTML = "Größenberater";
                }
            });
        }
    });


    WATO.elem('.bgColor-super-light-gray .large-3', function(rightMadeIn){
        if(rightMadeIn){
            var sozialMedia = WATO.qs(".pds-cockpit__sozialMediaShareWrapper");

            // Socialmedia verschoben
            if(sozialMedia){
                rightMadeIn[0].insertAdjacentElement('beforeend', sozialMedia);
            }

        }
    });



    // WATO.elem(function(){
    //     return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
    // }, function(){
    // });

})(new window.WATO(), window);





