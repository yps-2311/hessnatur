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

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
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
                        }
                    }

                    buildGallery(mainPicColor, markupHTMLColor, colorID, onlyOneImage);

                }else{
                    // Galerie initialer Seitenaufruf

                    var mainPicInitial = "",
                        markupHTMLInitial = "";

                    WATO.elem('meta[property="og:image"]', function(initPic){
                        if(initPic){
                
                            // Die Galeriebilder liegen in Metadaten im Head
                            for (var i = 0; i < initPic.length; i++) {

                                var picURL = initPic[i].getAttribute("content"),
                                    altText = WATO.qs('meta[property="twitter:title"]').getAttribute("content"),
                                    picReco = picURL.replace("_zoom/","_reco/"),
                                    picThumb = picURL.replace("_zoom/","_thumb/");

                                    markupHTMLInitial +=   '<a data-zoom-id="zoomMedium" class="thumbnailContainer js_thumbnailContainer mz-thumb" href="'+picURL+'" data-color="" data-image="'+picReco+'">'+
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

    // Produkt UVPs
    // WATO.elem('.h-largeOffset-bottom-outer.show-for-large', function(uvps){
    //     if(uvps){
    //         uvps = uvps[0];

    //         // Umplatzieren
    //         WATO.qs(".align-justify.h-xsmallOffset-bottom-inner", uvps.parentNode).insertAdjacentElement('beforebegin', uvps);

    //         // Jedem UVP wird der Punkt entfernt
    //         Array.prototype.forEach.call(WATO.qsa(".pds-cockpit__shortDescription li", uvps),function(elem){
    //             elem.innerHTML = elem.innerHTML.replace("·", "").trim();
    //         });    
            
    //         var moreDetails = WATO.qs(".js-pds-more-details", uvps);
    //         // Mehr details Link
    //         if(moreDetails){
    //             moreDetails.innerHTML = "mehr Produktdetails";
    //             // Scrollto animation repariert
    //             moreDetails.addEventListener('click', function(e){
    //                 e.preventDefault();

    //                 WATO.goalPush("klick_produktdetails");

    //                 setTimeout(function(){
    //                     window.ACC.global.scrollToElement(jQuery(".accordion.productInfoAccordion"));
    //                 }, 700);
    //             });
    //         }
    //     }
    // });
    
    // Merken Button über die CTA geschoben
    // WATO.elem('#addToWishlistForm', function(addToWishlistForm){
    //     if(addToWishlistForm){
    //         WATO.qs("#avail_container").insertAdjacentElement('beforebegin', addToWishlistForm[0]);
    //     }
    // });

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

    // Merken Button - Wishlist
    // WATO.elem('#addToWishlistButton', function(addToWishlistButton){
    //     if(addToWishlistButton){
    //         addToWishlistButton = addToWishlistButton[0];
    //         try {
    //             var siteURL = window.location.pathname.split("/p/")[1];

    //             addToWishlistButton.addEventListener('click', function(){
    //                 window.localStorage.setItem("kk_"+siteURL, true);
    //             });

    //             if(window.localStorage.getItem("kk_"+siteURL)){
    //                 addToWishlistButton.classList.add("kk_gemerkt");
    //                 WATO.qs(".pds-cockpit__addToWishlistButtonIconWrapper", addToWishlistButton).innerHTML = "Gemerkt";
    //             }
    //         } catch (error) {
    //             // console.log(error);
    //         }
    //     }
    // });


    

    WATO.elem('#size_advisor', function(sizeAdvisor){
        if(sizeAdvisor){
            sizeAdvisor[0].setAttribute('href', "/de/groessenberatung");
        }
    });

    
    // Farben
    WATO.elem('.pds-cockpit__colorSwitch li a', function(colorSwitch){
        if(colorSwitch){
            var imgURL = WATO.qs('meta[property="og:image"]').getAttribute('content').replace("detail_zoom","detail_thumb"),
                prodID = imgURL.match(/\d{5}/);

            for (var j = 0; j < colorSwitch.length; j++) {
                var thisColorLink = colorSwitch[j];
                
                

                thisColorLink.innerHTML = '<img src="'+imgURL.split(prodID)[0] + prodID + '_' + thisColorLink.parentNode.getAttribute('data-color') + '_8.jpg">';

                // https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_detail_thumb/Basic_T_Shirt_aus_reiner_Bio_Baumwolle-36062_18_8.jpg
                // https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_detail_zoom/Basic_T_Shirt_aus_reiner_Bio_Baumwolle-36062_76_7.jpg
                // TODO man kann die Bilder-URLs auch statisch bauen

                thisColorLink.addEventListener('click', changeColor);
            }
            // WATO.elem(function() {
            //     return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
            // }, function(avalibeColorImages){
            //     if(avalibeColorImages){
            //         var allProducts = window.ACC.productDetail.galleryImages,
            //             imgForColorIDs = {};

            //         for (var k = 0; k < allProducts.length; k++) {
            //             var thisColorID = allProducts[k].thumbnail.color;

            //             if(!imgForColorIDs[thisColorID]) {
			// 				imgForColorIDs[thisColorID] = [];
			// 			}
			// 			imgForColorIDs[thisColorID] = allProducts[k].thumbnail.url;
            //         }


            //         for (var j = 0; j < colorSwitch.length; j++) {
            //             var thisColorLink = colorSwitch[j];
                        
            //             thisColorLink.innerHTML = '<img src="'+imgForColorIDs[thisColorLink.parentNode.getAttribute('data-color')]+'">';
            //             // https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_detail_thumb/Basic_T_Shirt_aus_reiner_Bio_Baumwolle-36062_18_8.jpg
            //             // TODO man kann die Bilder-URLs auch statisch bauen

            //             thisColorLink.addEventListener('click', changeColor);
            //         }
            //     }
            // });
        }
    });

    // Initaile Galerie erstellen
    buildGalleryWrapper();
    

})(new window.WATO(), window);



// BUG in KK: 2019 Sprint 03.2 DE - mobile Relevanz erhöhen [100% V1]