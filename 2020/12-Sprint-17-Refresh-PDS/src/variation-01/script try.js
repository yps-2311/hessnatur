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

    // window.iridion.econda.push(["Sprint13", "V1"]);

    // if (!Element.prototype.matches) {
    //     Element.prototype.matches = Element.prototype.msMatchesSelector || 
    //                                 Element.prototype.webkitMatchesSelector;
    // }
    
    // if (!Element.prototype.closest) {
    // Element.prototype.closest = function(s) {
    //     var el = this;
    
    //     do {
    //     if (Element.prototype.matches.call(el, s)) return el;
    //     el = el.parentElement || el.parentNode;
    //     } while (el !== null && el.nodeType === 1);
    //     return null;
    // };
    // }

    // function pushGoal(key, sendOnNextPageView){    
    //     if(sendOnNextPageView){
    //         window.iridion.push(['goal', key, '', true]);
    //     }else{
    //         window.iridion.push(['goal', key]);
    //     }
    // }


    console.log(1);



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
                console.log(2);
                try {
                    mainWrapper = mainWrapper[0];
                    console.log('mainWrapper: ', mainWrapper);

                    WATO.elem(function() {
                        if(colorID){
                            return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
                        }else{
                            return true;
                        }
                    }, function(avalibeColorImages){
                        if(avalibeColorImages){

                            console.log(3);


                            // adaptiveHeight: true

                            // asNavFor
                            // https://flickity.metafizzy.co/options.html

                            var dots = WATO.qsa(".flickity-page-dots > .dot"),
                                thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer", mainWrapper);
                                
                            console.log('dots: ', dots);

                            for (var i = 0; i < dots.length; i++) {
                                dots[i].innerHTML = '<img data-index="'+i+'" src="'+thumbnails[i].getAttribute("data-image")+'">';

                                WATO.qs("img", dots[i]).addEventListener('click', function(e){
                                    
                                    $('.js_productImagesCarouselWrapper').flickity( 'select', e.target.getAttribute('data-index'));
                                });
                            }


                            var firstGaleryImg = WATO.qs(".js_carousel-cell");

                            
                            firstGaleryImg.parentNode.parentNode.style.height = firstGaleryImg.offsetHeight+"px";

                            // for (var i = 0; i < thumbnails.length; i++) {
                            //     var productPicURL = thumbnails[i].getAttribute("data-image");
                            // }


                            // var existingSlider = WATO.qs(".kk_slider", mainWrapper);

                            // if(existingSlider){
                            //     existingSlider.parentNode.removeChild(existingSlider);
                            // }

                            // var thumbnails = WATO.qsa(".show-for-medium-only .thumbnailContainer.js_thumbnailContainer", mainWrapper),
                            //     markupHTML = "";
                            
                            // console.log('thumbnails: ', thumbnails);

                            // if(colorID){
                            //     // Wird aus window.ACC.productDetail.galleryImages gebaut
                            //     colorID = parseInt(colorID);
                            //     console.log('colorID: ', colorID);

                            //     var galleryImgs = window.ACC.productDetail.galleryImages;
                            //     console.log('galleryImgs: ', galleryImgs);

                            //     for (var j = 0; j < galleryImgs.length; j++) {
                            //         var thisProduct = galleryImgs[j];
                            //         if(parseInt(thisProduct.product.color) === colorID){

                            //             var picURL = thisProduct.zoom.url;
                            //             console.log('picURL: ', picURL);

                            //             markupHTML += 
                            //             '<div class="carousel-cell">'+
                            //                 '<a href="'+picURL+'" data-options="zoomPosition: right" class="MagicZoom">'+
                            //                     '<img src="'+picURL.replace("_zoom/","_reco/")+'">'+
                            //                 '</a>'+
                            //             '</div>';
                            //         }
                            //     }
                            // }else{
                            //     // wird aus Original-Slider gebaut

                            //     // Neue Gallerie Markup wird gebaut
                            //     for (var i = 0; i < thumbnails.length; i++) {
                            //         var productPicURL = thumbnails[i].getAttribute("data-image");

                            //         markupHTML += 
                            //         '<div class="carousel-cell">'+
                            //             '<a href="'+productPicURL.replace("_main/","_zoom/")+'" data-options="zoomPosition: right;" class="MagicZoom">'+ //zoomWidth:600px; zoomHeight:1000px; 
                            //                 '<img src="'+productPicURL.replace("_main/","_reco/")+'">'+
                            //             '</a>'+
                            //         '</div>';
                            //     }
                            // }
        
                            // // Markup und Statische Felder für "Complete the Look" und "Titel" werden eingebaut
                            // mainWrapper.insertAdjacentHTML('afterbegin', 
                            //     '<div class="kk_slider small-8 main-carousel" style="height: '+sliderHeight()+'px">'+ // style="min-height: '+(window.innerWidth * 0.4149)+'px"
                            //         '<div class="static-banner kk_complete"><span>Complete the Look &rsaquo;</span></div>'+
                            //         markupHTML+
                            //     '</div>'
                            // );

                            // console.log('sliderHeight(): ', sliderHeight());
        
                            // Auf jQuery und Gallerie Funktion warten
                            // WATO.elem(function(){
                            //     return typeof window.jQuery !== "undefined" && typeof window.Flickity !== "undefined";
                            // }, function(){
                            //     try {

                            //         // Slider Options
                            //         var sliderOptions = {
                            //             cellAlign: 'left',
                            //             cellSelector: '.carousel-cell',
                            //             draggable: false,
                            //             wrapAround: true,
                            //         },
                            //         thumbPics = thumbnails.length;
        
                            //         if(thumbPics <= 2){
                            //             // Bei einem oder zwei Produktbilder die
                            //             // Interaktion mit der Gallerie deaktivieren
                            //             sliderOptions.prevNextButtons = false;
                            //             sliderOptions.pageDots = false;
        
                            //             if(thumbPics === 1){
                            //                 sliderOptions.cellAlign = 'center';
                            //             }
                            //         }
                            //         // Init Slider
                            //         jQuery('.kk_slider').flickity(sliderOptions);

                            //         // Complete the Look
                            //         // Funktion ist original von der Seite übernommen
                            //         WATO.elem('.js-completeTheLookWrapper > .row', function(isCompletteTheLook){
                            //             if(isCompletteTheLook){
                            //                 var myCompletteBtn = WATO.qs(".kk_complete", mainWrapper);
                            //                 myCompletteBtn.style.opacity = 1;
                            //                 myCompletteBtn.addEventListener('click', function(){
                            //                     var completeBtn = jQuery(".js-completeTheLookWrapper").first();
                            //                     if(completeBtn.length){
                            //                         window.ACC.global.scrollToElement(completeBtn);
                            //                     }
                            //                     WATO.goalPush("completelookanker");
                            //                 });
                            //             }
                            //         });
        
                            //     } catch (error) {
                            //         // console.log(error);
                            //         WATO.goalPush("wa_setup_monitoring");
                            //     }
                            // });

                        }
                    });

                } catch (error) {
                    // console.log(error);
                    // WATO.goalPush("wa_setup_monitoring");
                }
            }
        });
    }
    buildHeader(false);

    // Farbe wechseln
    // WATO.elem('.pds-cockpit__colorSwitch a', function(colorSwitcher){
    //     if(colorSwitcher){
    //         var clickColor = function(){
    //             buildHeader(this.parentNode.getAttribute("data-color"));
    //         };
    //         for (var k = 0; k < colorSwitcher.length; k++) {
    //             colorSwitcher[k].addEventListener('click', clickColor);
    //         }
    //     }
    // });





    // Farbwechsel des Produkts
    WATO.ajax("reload?", function() {
        // createNewReco();
    });
    

})(new window.WATO(), window);



// BUG in KK: 2019 Sprint 03.2 DE - mobile Relevanz erhöhen [100% V1]