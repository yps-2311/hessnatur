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

    // Gallerie und Buybox
    WATO.elem('.pds__imageAndCockpitWrapper', function(mainWrapper){
        if(mainWrapper){
            try {
                mainWrapper = mainWrapper[0];

                var thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer", mainWrapper),
                    markupHTML = "";
                    // lessProducts = thumbnails.length <= 2;

                // Neue Gallerie Markup wird gebaut
                for (var i = 0; i < thumbnails.length; i++) {
                    markupHTML += '<div class="carousel-cell"><img src="'+thumbnails[i].getAttribute("data-image")+'"></div>';
                }

                // Markup und Statische Felder für "Complete the Look" und "Titel" werden eingebaut
                mainWrapper.insertAdjacentHTML('afterbegin', 
                    '<div class="kk_slider small-8 main-carousel">'+
                        '<div class="static-banner kk_title"></div>'+
                        '<div class="static-banner kk_complete"></div>'+
                        markupHTML+
                    '</div>'
                );

                // Complete the Look
                // Nur wenn Complete bei diesem Produkt vorhanden ist
                WATO.elem('.completeTheLookHeadline', function(completeTL){
                    if(completeTL){

                        // Scroll to "Complete the Look" Button
                        WATO.elem(".js-jump-complete-look", function(completeTheLookBtn){
                            if(completeTheLookBtn){
                                completeTheLookBtn = completeTheLookBtn[0];
                                completeTheLookBtn.innerHTML = "Complete the Look";
        
                                var completeBtn = WATO.qs(".kk_complete", mainWrapper);

                                // Button in der Gallerie platzieren
                                    completeBtn.insertAdjacentElement('afterbegin', completeTheLookBtn);
                                    setTimeout(function(){
                                        // Leicht verspätet einblenden
                                        completeBtn.classList.add("kk_show");
                                    }, 1000);
                                
                            }
                        });
                    }
                });

                // Produkttitel für Fullscreenanzeige einbauen
                WATO.elem('.pds-cockpit__productName', function(title){
                    if(title){
                        WATO.qs(".kk_title", mainWrapper).innerHTML = title[0].textContent;
                    }
                });

                // Auf jQuery und Gallerie Funktion warten
                WATO.elem(function(){
                    return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                }, function(){
                    try {

                        // Fullscreen Funktion nachträglich eingebaut


                        /*!
                        * Flickity fullscreen v1.1.1
                        * Enable fullscreen view for Flickity
                        */

                        /*jshint browser: true, undef: true, unused: true, strict: true*/

                        ( function( window, factory ) {
                            // universal module definition
                            /*jshint strict: false */ /*globals define, module, require */
                            if ( typeof define === 'function' && define.amd ) {
                                // AMD
                                define( [
                                    'flickity/js/index',
                                ], factory );
                            } else if ( typeof module === 'object' && module.exports ) {
                                // CommonJS
                                module.exports = factory(
                                    require('flickity')
                                );
                            } else {
                                // browser global
                                factory(
                                    window.Flickity
                                );

                                // Fullscreen schließen mit ESC
                                document.addEventListener('keydown', function(event){
                                    if (event.keyCode === 27) {
                                        jQuery(".kk_slider").flickity('exitFullscreen');
                                    }
                                }, false);
                            }
                        
                        }( window, function factory( Flickity ) {
                            
                            Flickity.createMethods.push('_createFullscreen');
                            var proto = Flickity.prototype;
                            
                            
                            proto._createFullscreen = function() {
                                this.isFullscreen = false;
                            
                                if ( !this.options.fullscreen ) {
                                    return;
                                }
                                // buttons
                                this.viewFullscreenButton = new FullscreenButton( 'view', this );
                                this.exitFullscreenButton = new FullscreenButton( 'exit', this );
                            
                                this.on( 'activate', this._changeFullscreenActive );
                                this.on( 'deactivate', this._changeFullscreenActive );
                            };
                            
                            // ----- activation ----- //
                            
                            proto._changeFullscreenActive = function() {
                                var childMethod = this.isActive ? 'appendChild' : 'removeChild';
                                this.element[ childMethod ]( this.viewFullscreenButton.element );
                                this.element[ childMethod ]( this.exitFullscreenButton.element );
                                // activate or deactivate buttons
                                var activeMethod = this.isActive ? 'activate' : 'deactivate';
                                this.viewFullscreenButton[ activeMethod ]();
                                this.exitFullscreenButton[ activeMethod ]();
                            };
                            
                            // ----- view, exit, toggle ----- //
                            
                            proto.viewFullscreen = function() {
                                this._changeFullscreen( true );
                                // this.focus();
                            };
                            
                            proto.exitFullscreen = function() {
                                this._changeFullscreen( false );
                            };
                            
                            proto._changeFullscreen = function( isView ) {
                                if ( this.isFullscreen === isView ) {
                                    return;
                                }
                                this.isFullscreen = isView;

                                var classMethod = isView ? 'add' : 'remove';

                                document.documentElement.classList[ classMethod ]('is-flickity-fullscreen');

                                this.element.classList[ classMethod ]('is-fullscreen');
                                this.resize();

                                // HACK extra reposition on fullscreen for images
                                if ( this.isFullscreen ) {
                                    this.reposition();
                                }

                                this.dispatchEvent( 'fullscreenChange', null, [ isView ] );
                            };
                            
                            proto.toggleFullscreen = function() {
                                this._changeFullscreen( !this.isFullscreen );
                            };
                            
                            // ----- setGallerySize ----- //
                            
                            // overwrite so fullscreen cells are full height
                            var setGallerySize = proto.setGallerySize;

                            proto.setGallerySize = function() {
                                if ( !this.options.setGallerySize ) {
                                return;
                                }
                                if ( this.isFullscreen ) {
                                // remove height style on fullscreen
                                this.viewport.style.height = '';
                                } else {
                                // otherwise, do normal
                                setGallerySize.call( this );
                                }
                            };
                            
                            // ----- keyboard ----- //
                            
                            // ESC key closes full screen
                            // Flickity.keyboardHandlers[27] = function() {
                                
                            //     this.exitFullscreen();
                            // };
                            // window.addEventListener("keydown", 27, function() {
                            //     // this.exitFullscreen();
                            //     console.log("aaa");
                            // });
                            
                            // ----- FullscreenButton ----- //
                            
                            function FullscreenButton( name, flickity ) {
                                this.name = name;
                                this.createButton();
                                this.createIcon();
                                // events
                                // trigger viewFullscreen or exitFullscreen on click
                                this.onClick = function() {
                                flickity[ name + 'Fullscreen' ]();
                                };
                                this.clickHandler = this.onClick.bind( this );
                            }
                            
                            FullscreenButton.prototype.createButton = function() {
                                var element = this.element = document.createElement('button');
                                element.className = 'flickity-button flickity-fullscreen-button ' +
                                'flickity-fullscreen-button-' + this.name;
                                // prevent button from submitting form
                                element.setAttribute( 'type', 'button' );
                                // set label
                                var label = capitalize( this.name + ' full-screen' );
                                element.setAttribute( 'aria-label', label );
                                element.title = label;
                            };
                            
                            function capitalize( text ) {
                                return text[0].toUpperCase() + text.slice(1);
                            }
                            
                            var svgURI = 'http://www.w3.org/2000/svg';
                            
                            var pathDirections = {
                                view: 'M15,20,7,28h5v4H0V20H4v5l8-8Zm5-5,8-8v5h4V0H20V4h5l-8,8Z',
                                exit: 'M32,3l-7,7h5v4H18V2h4V7l7-7ZM3,32l7-7v5h4V18H2v4H7L0,29Z',
                            };
                            
                            FullscreenButton.prototype.createIcon = function() {
                                var svg = document.createElementNS( svgURI, 'svg');
                                svg.setAttribute( 'class', 'flickity-button-icon' );
                                svg.setAttribute( 'viewBox', '0 0 32 32' );
                                // path & direction
                                var path = document.createElementNS( svgURI, 'path');
                                var direction = pathDirections[ this.name ];
                                path.setAttribute( 'd', direction );
                                // put it together
                                svg.appendChild( path );
                                this.element.appendChild( svg );
                            };
                            
                            FullscreenButton.prototype.activate = function() {
                                this.element.addEventListener( 'click', this.clickHandler );
                            };
                            
                            FullscreenButton.prototype.deactivate = function() {
                                this.element.removeEventListener( 'click', this.clickHandler );
                            };
                            
                            Flickity.FullscreenButton = FullscreenButton;
                            
                            return Flickity;
                        
                        }));
                        // ----- Fullscreen Funktion ENDE ----- //




                        // MagicZoom.refresh();

                        // Slider Options
                        var sliderOptions = {
                            cellAlign: 'left',
                            contain: true,
                            cellSelector: '.carousel-cell',
                            imagesLoaded: true,
                            lazyLoad: true,
                            wrapAround: true,
                            fullscreen: true
                        },
                        thumbPics = thumbnails.length;

                        if(thumbPics <= 2){
                            // Bei einem oder zwei Produktbilder die
                            // Interaktion mit der Gallerie deaktivieren
                            sliderOptions.draggable = false;
                            sliderOptions.prevNextButtons = false;
                            sliderOptions.pageDots = false;

                            if(thumbPics === 1){
                                sliderOptions.cellAlign = 'center';
                            }
                        }
                        // Init Slider
                        jQuery('.kk_slider').flickity(sliderOptions);

                    } catch (error) {
                        console.log(error);
                    }
                });
                    
                
            } catch (error) {
                console.log(error);
            }
        }
    });


    // Bullets von der Buybox, Artikelnummer, Socialmedia und Telefonnummer
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

                        var thisText = productDescriptionText.innerHTML,
                            prodTextParent = productDescriptionText.parentNode,
                            buybox = buyboxDescription.parentNode,
                            moreDetailsBtn = WATO.qs(".js-pds-more-details", buybox),
                            sozialMedia = WATO.qs(".pds-cockpit__sozialMediaShareWrapper"),
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
                        
                        // Socialmedia verschoben
                        if(sozialMedia){
                            prodTextParent.parentNode.parentNode.insertAdjacentElement('afterbegin', sozialMedia);
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

})(new window.WATO(), window);