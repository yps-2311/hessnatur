// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    function sliderHeight() {
        var temp = window.innerWidth * 0.452;
        if(temp > 850){
            return 850;
        }else{
            return parseFloat(temp).toFixed(3);
        }
    }

    function buildHeader(colorID) {
        
        // Gallerie und Buybox
        WATO.elem('.pds__imageAndCockpitWrapper', function(mainWrapper){
            if(mainWrapper){
                try {
                    mainWrapper = mainWrapper[0];

                    WATO.elem(function() {
                        if(colorID){
                            return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
                        }else{
                            return true;
                        }
                    }, function(avalibeColorImages){
                        if(avalibeColorImages){

                            var existingSlider = WATO.qs(".kk_slider", mainWrapper);

                            if(existingSlider){
                                existingSlider.parentNode.removeChild(existingSlider);
                            }

                            var thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer", mainWrapper),
                                markupHTML = "";

                            if(colorID){
                                // Wird aus window.ACC.productDetail.galleryImages gebaut
                                colorID = parseInt(colorID);

                                var galleryImgs = window.ACC.productDetail.galleryImages;

                                for (var j = 0; j < galleryImgs.length; j++) {
                                    var thisProduct = galleryImgs[j];
                                    if(parseInt(thisProduct.product.color) === colorID){

                                        var picURL = thisProduct.zoom.url;

                                        markupHTML += 
                                        '<div class="carousel-cell">'+
                                            '<a href="'+picURL+'" data-options="zoomPosition: right" class="MagicZoom">'+
                                                '<img src="'+picURL.replace("_zoom/","_reco/")+'">'+
                                            '</a>'+
                                        '</div>';
                                    }
                                }
                            }else{
                                // wird aus Original-Slider gebaut

                                // Neue Gallerie Markup wird gebaut
                                for (var i = 0; i < thumbnails.length; i++) {
                                    var productPicURL = thumbnails[i].getAttribute("data-image");

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
                                    '<div class="static-banner kk_complete"><span>Complete the Look &rsaquo;</span></div>'+
                                    markupHTML+
                                '</div>'
                            );
        
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
                                    // Init Slider
                                    jQuery('.kk_slider').flickity(sliderOptions);

                                    // Complete the Look
                                    // Funktion ist original von der Seite übernommen
                                    WATO.elem('.js-completeTheLookWrapper > .row', function(isCompletteTheLook){
                                        if(isCompletteTheLook){
                                            var myCompletteBtn = WATO.qs(".kk_complete", mainWrapper);
                                            myCompletteBtn.style.opacity = 1;
                                            myCompletteBtn.addEventListener('click', function(){
                                                var completeBtn = jQuery(".js-completeTheLookWrapper").first();
                                                if(completeBtn.length){
                                                    window.ACC.global.scrollToElement(completeBtn);
                                                }
                                                WATO.goalPush("completelookanker");
                                            });
                                        }
                                    });
        
                                } catch (error) {
                                    // console.log(error);
                                    WATO.goalPush("wa_setup_monitoring");
                                }
                            });

                        }
                    });

                } catch (error) {
                    // console.log(error);
                    WATO.goalPush("wa_setup_monitoring");
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
            // console.log('sliderWidht()+"px": ', sliderHeight()+"px");
            mySlider.style.height = sliderHeight()+"px";
        }
    });

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
                        // console.log(error);
                        WATO.goalPush("wa_setup_monitoring");
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

    WATO.goalsPdpRed();

})(new window.WATO(), window);