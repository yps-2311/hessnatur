// load core and global js
// @ codekit-prepend "../global/global.js";


/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO, window) {
    "use strict";


    // window.iridion.econda.push(["Sprint17", "V0"]);

    WATO.sprint17goals(0);

    // Element entfernen
    // function removeObject(el) {
    //     if(el){
    //         el.parentNode.removeChild(el);
    //     }
    // }

    // // Galerie erstellen
    // function buildGallery(bigPicture, markup, farbID, imgValue) {

    //     WATO.elem('.pds-cockpit__wrapper', function(mainContent){
    //         if(mainContent){
    //             mainContent = mainContent[0];

    //             var mainContentWrapper = mainContent.parentNode;
                
    //             // falls die Galerie mit einer anderen Farbe schon vorhanden ist wird diese entfernt
    //             removeObject(WATO.qs(".kk_slider", mainContentWrapper));

    //             // Alle anderen Galerien der Seite werden ebenfalls entfernt da es sonst nach dem initalisieren zu fehlern kommt
    //             removeObject(WATO.qs(".show-for-medium-only.column.small-12.medium-6", mainContentWrapper));
    //             removeObject(WATO.qs(".pds-productImage__mzThumbsWrapper.js_magicZoomThumbWrapper", mainContentWrapper));
    //             removeObject(WATO.qs(".js_magicZoomKeyVisualWrapper", mainContentWrapper));
    //             removeObject(WATO.qs(".column.small-12.hide-for-medium.h-smallmediumOffset-bottom-outer.h-no-padding", mainContentWrapper));

    //             // Markup der neuen Galerie
    //             mainContent.insertAdjacentHTML('beforebegin', 
    //                     '<div id="kk_slider'+farbID+'" class="h-largeOffset-bottom-outer kk_slider">'+
    //                             bigPicture+
    //                         '<div class="kk_sliderThumbs">'+
    //                             markup+
    //                         '</div>'+
    //                     '</div>'
    //                 );
                
    //             if(imgValue === 1){
    //                 mainContent.parentNode.classList.add("kk_onlyone");
    //             }
    //             // Außer beim initialen laden, muss die Magiczoom funktion die neue Galerie initalisieren
    //             if(farbID !== 0){
    //                 WATO.elem(function(){
    //                     // Falls noch nicht geladen
    //                     return typeof window.MagicZoom !== "undefined";
    //                 }, function(){
    //                     // init MagicZoom
    //                     window.MagicZoom.start();
    //                 });
    //             }
    //         }
    //     });
    // }

    // // Informationen zur Galerie werden zusammengestellt
    // function buildGalleryWrapper(colorID) {

    //     WATO.elem(function() {
    //         if(colorID){
    //             // Wenn auf der Seite die Informationen aller Produktfarben verfügbar sind
    //             // können diese genutzt werden um selbst die neue Galerie zu erstellen
    //             // liegen alle in indow.ACC.productDetail.galleryImages
    //             return typeof window.ACC !== "undefined" && typeof window.ACC.productDetail !== "undefined" && typeof window.ACC.productDetail.galleryImages !== "undefined";
    //         }else{
    //             return true;
    //         }
    //     }, function(avalibeColorImages){
    //         if(avalibeColorImages){

    //             var onlyOneImage = 0;

    //             if(colorID){
    //                 // Galerie nach Farbwechsel

    //                 // Wird aus window.ACC.productDetail.galleryImages gebaut
    //                 colorID = parseInt(colorID);

    //                 var galleryImgs = window.ACC.productDetail.galleryImages,
    //                     mainPicColor = "",
    //                     markupHTMLColor = "";

    //                 // Galerie wird mit den BilderURLs erstellt
    //                 for (var j = 0; j < galleryImgs.length; j++) {
    //                     var thisProduct = galleryImgs[j];
    //                     if(parseInt(thisProduct.product.color) === colorID){

    //                         var picURL = thisProduct.zoom.url,
    //                             altText = thisProduct.zoom.altText,
    //                             picReco = picURL.replace("_zoom/","_reco/"),
    //                             picThumb = picURL.replace("_zoom/","_thumb/");

    //                             markupHTMLColor +=   '<a data-zoom-id="zoomMedium" class="thumbnailContainer js_thumbnailContainer mz-thumb" href="'+picURL+'" data-color="'+colorID+'" data-image="'+picReco+'">'+
    //                                             '<img src="'+picThumb+'" alt="'+altText+'" data-color="'+colorID+'">'+
    //                                         '</a>';

    //                         if(mainPicColor === ""){
    //                             mainPicColor =   '<a class="MagicZoom" data-options="hint: always; zoomPosition: inner" id="zoomMedium" href="'+picURL+'">'+
    //                                             '<img src="'+picReco+'" alt="'+altText+'">'+
    //                                         '</a>';
    //                         }
    //                         onlyOneImage++;
    //                     }
    //                 }

    //                 buildGallery(mainPicColor, markupHTMLColor, colorID, onlyOneImage);

    //             }else{
    //                 // Galerie initialer Seitenaufruf

    //                 var mainPicInitial = "",
    //                     markupHTMLInitial = "";

    //                 WATO.elem('meta[property="og:image"]', function(initPic){
    //                     if(initPic){
                
    //                         // Die Galeriebilder liegen in Metadaten im Head
    //                         for (var i = 0; i < initPic.length; i++) {

    //                             var picURL = initPic[i].getAttribute("content"),
    //                                 altText = WATO.qs('meta[property="twitter:title"]').getAttribute("content"),
    //                                 picReco = picURL.replace("_zoom/","_reco/"),
    //                                 picThumb = picURL.replace("_zoom/","_thumb/");

    //                                 markupHTMLInitial +=   '<a data-zoom-id="zoomMedium" class="thumbnailContainer js_thumbnailContainer mz-thumb" href="'+picURL+'" data-color="" data-image="'+picReco+'">'+
    //                                                 '<img src="'+picThumb+'" alt="'+altText+'" data-color="">'+
    //                                             '</a>';

    //                             if(mainPicInitial === ""){
    //                                 mainPicInitial = '<a class="MagicZoom" data-options="hint: always; zoomPosition: inner" id="zoomMedium" href="'+picURL+'">'+
    //                                     '<img src="'+picReco+'" alt="'+altText+'">'+
    //                                 '</a>';
    //                             }
    //                         }

    //                         onlyOneImage = initPic.length;
    //                     }
    //                 });
                    
    //                 buildGallery(mainPicInitial, markupHTMLInitial, 0, onlyOneImage);
    //             }
    //         }
    //     });
    // }

    // // Farbe gewächselt
    // function changeColor(e) {
    //     var thisTarget = e.target.parentNode.getAttribute("data-color");

    //     if(!thisTarget){
    //         thisTarget = e.target.parentNode.parentNode.getAttribute("data-color");
    //     }
        
    //     // Ausgewählte Farbe an Galerie übergeben
    //     buildGalleryWrapper(parseInt(thisTarget));
    // }

    // // Produkt UVPs
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
    
    // // Merken Button über die CTA geschoben
    // WATO.elem('#addToWishlistForm', function(addToWishlistForm){
    //     if(addToWishlistForm){
    //         WATO.qs("#avail_container").insertAdjacentElement('beforebegin', addToWishlistForm[0]);
    //     }
    // });

    // // Zurück-Button
    // WATO.elem('.breadcrumb--back a', function(breadcrumb){
    //     if(breadcrumb){
    //         // breadcrumb = breadcrumb[0];
    //         // breadcrumb.innerHTML = 'zurück zu <b>„'+breadcrumb+'“</b>';
    //         breadcrumb[0].addEventListener('click', function(){
    //             WATO.goalPush("kategorie_back", true);
    //         });
    //     }
    // });

    // // Merken Button - Wishlist
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
    //             WATO.goalPush("wa_setup_monitoring");
    //         }
    //     }
    // });
    
    // // Produktinfos in Akordions 
    // WATO.elem('.accordion-item:first-child .accordion-title', function(productInfo){
    //     if(productInfo){
    //         productInfo = productInfo[0];

    //         // Reihenfolge ändern
    //         productInfo.insertAdjacentElement('afterend', WATO.qs(".pds-cockpit__articleNumber"));

    //         var passform = false,
    //             material = false,
    //             pflege = false,
    //             ausgezeichneteQuali = false;

    //         WATO.elem('.accordion-item > a', function(otherTabs){
    //             if(otherTabs){

    //                 // var otherTabs = WATO.qsa(".accordion-item > a"),

    //                 // Verschiedenste Akordions ermitteln
    //                 for (var i = 0; i < otherTabs.length; i++) {
    //                     var thisTab = otherTabs[i],
    //                         tabText = thisTab.textContent;
    //                     if(tabText.indexOf("Ausgezeichnete Qualit") !== -1){
    //                         ausgezeichneteQuali = thisTab.parentNode;
    //                     }else if(tabText.indexOf("Passform") !== -1){
    //                         passform = thisTab.parentNode;
    //                     }else if(tabText.indexOf("Material") !== -1){
    //                         material = thisTab.parentNode;
    //                     }else if(tabText.indexOf("Pflege") !== -1){
    //                         pflege = thisTab.parentNode;
    //                     }
    //                 }

    //                 // Wenn Passform vorhanden ist: Diese in Produktinfos verschieben
    //                 if(passform){
    //                     productInfo.parentNode.insertAdjacentElement('beforeend', WATO.qs(".shrink + div", passform));
    //                     // Original Akordion ausblenden
    //                     passform.style.display = "none";
    //                 }


    //                 if(material){

    //                     // Material in ausgezeichnete Qualität verschieben
    //                     if(ausgezeichneteQuali){
    //                         ausgezeichneteQuali.insertAdjacentElement('beforebegin', material);
    //                         ausgezeichneteQuali.addEventListener('click', function(){
    //                             WATO.goalPush("ausgezeichnete_qualitaet");
    //                         });
    //                     }

    //                     var materialList = WATO.qs(".row > *:last-child", material);
                    
    //                     // Pflege in Materialliste verschieben
    //                     if(pflege && materialList){
    //                         materialList.insertAdjacentElement('afterend', WATO.qs("ul.no-bullet", pflege));
    //                         pflege.style.display = "none";
    //                     }
            
    //                     // Neue Pflege HL erstellen
    //                     if(materialList){
    //                         materialList.insertAdjacentHTML('afterend', '<strong class="column small-12 h-text-uppercase kk_subline">Pflege</strong>');
    //                     }
            
    //                     // Akordion Link umbenennen
    //                     var materialPflege = WATO.qs("a", material);
    //                     materialPflege.innerHTML = "Material & Pflege";
    //                     materialPflege.addEventListener('click', function(){
    //                         WATO.goalPush("material_pflege");
    //                     });
    //                 }

    //                 // socialmedia und FAQs verschoben
    //                 WATO.elem('.footerBenefitWrapper', function(footerUVPs){
    //                     if(footerUVPs && ausgezeichneteQuali){
    //                         try {
    //                             var afterTheList = ausgezeichneteQuali.parentNode,
    //                                 socialmedia = WATO.qs(".pds-cockpit__sozialMediaShareWrapper"),
    //                                 questions = socialmedia.previousElementSibling || 0;
                                
    //                             if(questions !== 0){
    //                                 afterTheList.insertAdjacentElement('afterend', socialmedia);
    //                                 afterTheList.insertAdjacentElement('afterend', questions);
    //                             }

    //                             afterTheList.insertAdjacentElement('afterend', footerUVPs[0]);

    //                         } catch (error) {
    //                         }
    //                     }
    //                 });
    //             }
    //         });

    //         WATO.elem('.productInfoAccordion a[href="/de/groessenberatung', function(element){
    //             if(element){
    //                 element[0].addEventListener('click', function(){
    //                     WATO.goalPush("masstabelle");
    //                 });
    //             }
    //         });
    //     }
    // });
    
    // // Listener auf Farben
    // WATO.elem('.pds-cockpit__colorSwitch li a', function(colorSwitch){
    //     if(colorSwitch){
    //         for (var j = 0; j < colorSwitch.length; j++) {
    //             colorSwitch[j].addEventListener('click', changeColor);
    //         }
    //     }
    // });

    // // Initaile Galerie erstellen
    // buildGalleryWrapper();

})(new window.WATO(), window);