// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

// window.mzOptions = {
//     onZoomReady: function() {
//         console.log('onReady', arguments[0]);
//     },
//     onUpdate: function() {
//         console.log('onUpdated', arguments[0], arguments[1], arguments[2]);
//     },
//     onZoomIn: function() {
//         console.log('onZoomIn', arguments[0]);
//     },
//     onZoomOut: function() {
//         console.log('onZoomOut', arguments[0]);
//     }
// };


(function(WATO, window, documentElement) {
    "use strict";

    function pushGoal(key, sendOnNextPageView){    
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }
    // WATO.goalsFromCat();

    function removeStarFromString(el) {
        if(el){
            el.innerHTML = el.innerHTML.replace("*","");
        }
    }
    function priceReplace(className, responseAsElement) {
        WATO.qs(className, documentElement).innerHTML = WATO.qs(className, responseAsElement).innerHTML.replace("*","");
    }

    var imgPath = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2019/Sprint06/",
        allProductsInfos = {};

    function getSizeOptions(allSizes, prodID) {

        var dropDownSize = '';
        // Alle Größen des Produkts
        for (var l = 0; l < allSizes.length; l++) {
            var currentProductSize = allSizes[l],
                isAvailable = currentProductSize.available,
                isSelected = currentProductSize.sizeCode === prodID.substring(7,11);
                
                // console.log('isSelected: ', isSelected);
                // console.log('prodID: ', prodID);
                // console.log('prodID.substring(7,10): ', prodID.substring(7,11));
                // console.log('currentProductSize.sizeCode: ', currentProductSize.sizeCode);
            
            dropDownSize += '<option '+
                ((!isAvailable) && isSelected ? 'class="kk_red"' : '')+
                ' value="'+currentProductSize.sizeCode+'" '+
                (isAvailable ? '' : 'disabled=""')+
                (isSelected ? 'selected="selected"' : "")+
                ' data-code="'+currentProductSize.code+'">'+currentProductSize.size+'</option>';
        }
        return dropDownSize;
    }

    function addClass(element,className){
        if(element){
            element.classList.add(className);
        }
    }
    function removeClass(element,className){
        if(element){
            element.classList.remove(className);
        }
    }

    function submitForm(thisForm) {
        WATO.elem(function() {
            return typeof jQuery !== "undefined";
        }, function(element){
            if(element){
                jQuery.ajax({
                    url : '/de/cart/update',
                    type: 'post',
                    data : jQuery(thisForm).serialize()
                });
            }
        });
    }

    function removeItem(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    function overallDiscountBuild(savingSum) {
        var sumWrapper = WATO.qs(".price.offset-price-left").parentNode.parentNode.parentNode;

        removeItem(WATO.qs(".kk_lightgreen", sumWrapper));

        if(savingSum > 0){
            sumWrapper.insertAdjacentHTML('beforeend', 
                '<div class="kk_lightgreen">Sie sparen mit dieser Bestellung <b>€ '+String((savingSum).toFixed(2)).replace(".",",")+'</b></div>'
            );
        }
    }

    function updateAllInfosForThisProduct(parentForm, productID){

        pushGoal("nutzeEinstellungen");

        var allColors = allProductsInfos[productID.substring(0,5)],
            colorSelector = WATO.qs('.item__color', parentForm);

        for (var j = 0; j < allColors.colors.length; j++) {
            var thisColor = allColors.colors[j],
                finalCombination = "",
                warningTheSizeHasBeenChanged = false;

            // console.log('thisColor: ', thisColor);
            // console.log('j === allColors.colors.length: ', j === allColors.colors.length-1);

            // Der Sonderfall "00" ist nur für Matratzen denn dort wird nicht nach Farbe sondern nach Material unterschieden
            if(thisColor.colorCode === "00" || thisColor.colorCode === colorSelector.value){

                // console.log('thisColor.sizes: ', thisColor.sizes);
                for (var k = 0; k < thisColor.sizes.length; k++) {

                    // console.log('thisColor.sizes[k].sizeCode: ', thisColor.sizes[k].sizeCode);
                    // console.log('productID: ', productID);

                    var thisSizeColorCombination = thisColor.sizes[k],
                        isKorrektCombination = thisSizeColorCombination.sizeCode === productID.substring(7,11);

                    if(k === thisColor.sizes.length-1 && (!isKorrektCombination)){
                        thisSizeColorCombination = thisColor.sizes[0];
                        isKorrektCombination = true;
                        warningTheSizeHasBeenChanged = true;
                    }

                    if(isKorrektCombination){

                        finalCombination = thisSizeColorCombination.code;

                        var statusBar = WATO.qs(".js-availability-status", parentForm.previousElementSibling),
                            statusText = thisSizeColorCombination.availabilityText,
                            tempClasses = "label js-availability-status ";

                        // console.log('thisSizeColorCombination: ', thisSizeColorCombination);

                        statusBar.innerHTML = statusText;
                        
                        // Klassen des Versandstatus aktualisieren
                        if(statusText.indexOf("Sofort lieferbar") !== -1){
                            statusBar.className = tempClasses+"success";
                        }else if(statusText.indexOf("Ausverkauft") !== -1){
                            statusBar.className = tempClasses+"alert";
                        }else{
                            statusBar.className = tempClasses+"warning";
                        }

                        // Wenn dieses Produkt ein Streichpreis hat
                        var isStrikePrice = thisSizeColorCombination.strikePrice,
                            markup = '<div class="row align-right-for-medium">';

                        if(isStrikePrice){
                            // mit Preichpreis - Preisanzeige
                            var rabatt = isStrikePrice - thisSizeColorCombination.price;
                            markup +=   '<div class="column shrink price discountPrice h-xsmallOffset-bottom-inner">'+thisSizeColorCombination.formattedPrice+'</div>'+
                                        '<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer">'+thisSizeColorCombination.formattedStrikePrice+'</div>'+
                                    '</div>'+
                                    '<div class="kk_lightgreen" data-discount="'+rabatt+'">€ '+String((rabatt).toFixed(2)).replace(".",",")+' Ersparnis</div>';
                        }else{
                            // ohne Preichpreis - Preisanzeige
                            markup += '<div class="column shrink price h-xsmallOffset-bottom-inner">'+thisSizeColorCombination.formattedPrice+'</div>'+
                                    '</div>';
                        }
                        WATO.qs(".column.small-12.h-smallOffset-bottom-inner", parentForm).innerHTML = markup+'<p class="h-text-muted">inkl. 19% Mwst.</p>';

                        // Alle Rabatte zusammenrechnen und aktualisieren
                        var allDiscounts = WATO.qsa(".listing__table--item .kk_lightgreen"),
                            discountSum = 0;

                        for (var l = 0; l < allDiscounts.length; l++) {
                            discountSum += parseFloat(allDiscounts[l].getAttribute("data-discount"));
                        }
                        // Den Rabatt aller Produkte unter der Gesammtsumme anzeigen
                        overallDiscountBuild(discountSum);

                        break;
                    }
                }
                
                // console.log('finalCombination: ', finalCombination);

                WATO.qs('input[name="variantCode"]', parentForm).value = finalCombination;

                
                var siteDropdown = WATO.qs('.item__size', parentForm);

                // Das Dropdown für Größen wird hier neu gebaut
                siteDropdown.innerHTML = getSizeOptions(thisColor.sizes, finalCombination);

                if(warningTheSizeHasBeenChanged && !WATO.qs(".kk_red", parentForm)){
                    addClass(siteDropdown.parentNode, "kk_warning");
                }else{
                    removeClass(siteDropdown.parentNode, "kk_warning");
                }

                break;
            }
        }
    }

    function changeSize(e) {
        // console.log("changeSize");
        // Ändern der Produktgröße
        var parentForm = e.target.closest("form"),
            variantID = WATO.qs('input[name="variantCode"]', parentForm),
            sizeSelect = WATO.qs('.item__size', parentForm),
            newVariantID = variantID.value.substring(0,7) + sizeSelect.value;
            
        // console.log('newVariantID: ', newVariantID);
        // console.log('sizeSelect: ', sizeSelect);
        // console.log('sizeSelect.value: ', sizeSelect.value);
        // console.log('variantID.value.substring(0,7): ', variantID.value.substring(0,7));
        
        variantID.value = newVariantID;

        // console.log('sizeSelect.parentNode: ', sizeSelect.parentNode);
        removeClass(sizeSelect.parentNode, "kk_warning");
        // console.log('sizeSelect.parentNode: ', sizeSelect.parentNode.classList);

        // Die angezeigten Produktinfos werden aktualisiert
        updateAllInfosForThisProduct(parentForm, newVariantID);

        // Die Größenänderung wird per Formsubmit abgeschickt
        submitForm(parentForm);
    }
    
    function changeColor(e) {
        // Änderung der Produktfarbe
        var parentForm = e.target.closest("form"),
            variantCode = WATO.qs('input[name="variantCode"]', parentForm),
            selectedOption = WATO.qs('.item__color', parentForm),
            inputSize = WATO.qs('.item__size', parentForm),
            productMainID = variantCode.value.substring(0,5),
            productSelectedSize = variantCode.value.substring(7,9);

        // Produkt-VariantCode ist die ProduktID:
        // Beispiel: 111112233
        // 1 = MainID, 2 = ProduktfarbenID, 3 = Produktgröße
        variantCode.value = productMainID + selectedOption.value + productSelectedSize;

        // Der Magiczoom der auf den Bildern liegt wird aktualisiert
        if(window.MagicZoom){
            window.MagicZoom.update(WATO.qs(".MagicZoom", parentForm.previousElementSibling).getAttribute("id"), selectedOption.options[selectedOption.selectedIndex].getAttribute("data-img"), selectedOption.options[selectedOption.selectedIndex].getAttribute("data-img"));
        }

        updateAllInfosForThisProduct(parentForm, variantCode.value);

        if(WATO.qs(".kk_red", parentForm)){
            // Fehlermeldung anzeigen wenn das Ausgewählte gleichzeitig nicht verfügbar ist

            addClass(inputSize, 'kk_error');
            addClass(documentElement, 'kk_deactive');
        }else{
            // Fehlermeldungen entfernen und Farbänderung abschicken
            removeClass(inputSize, 'kk_error');
            removeClass(documentElement, 'kk_deactive');
            
            submitForm(parentForm);
        }
    }

    function checkContinueButtonClick(thisClass) {
        // Der "Jetzt sicher einkaufen"-Button geht nur wenn kein Fehler auf der Seite vorliegt
        
        WATO.elem(thisClass, function(successButton){
            if(successButton){
                successButton[0].addEventListener('click', function(e){
                    if(documentElement.className.indexOf("kk_deactive") !== -1){
                        e.preventDefault();
                        addClass(e.target, 'kk_errorMsg');
                    }
                });
            }
        });
    }

    function httpGetAsync(theUrl, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                try {
                    callback(theUrl, JSON.parse(xmlHttp.responseText));
                } catch (error) {
                    console.log('Error: ', error);
                }
            }
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    // Weitere Artikel hinzufügen Box nach unten verschoben
    WATO.elem('#hessnaturQuickAddForm', function(addOtherArticle){
        if(addOtherArticle){
            WATO.elem('.js_backstopWrapper > .h-mediumOffset-bottom-inner:not(.yCmsContentSlot)', function(bottomButtons){
                if(bottomButtons){
                    bottomButtons[0].insertAdjacentElement('afterend', addOtherArticle[0].parentNode);
                }
            });
        }
    });

    // Infobar eingebaut
    WATO.elem('.js_backstopWrapper > .row > .h-xsmallOffset-bottom-outer', function(topButton){
        if(topButton){
            topButton[0].insertAdjacentHTML('afterend', 
                '<div class="columns small-12">'+
                    '<div class="kk_grew"><img src="'+imgPath+'infoi.svg">Artikel im Warenkorb werden nicht reserviert.</div>'+
                '</div>'
            );
        }
    });

    // document.documentElement.addEventListener('click', function(e){
    //     try {
    //         var clickClasses = e.target.classList;
    //         console.log('clickClasses: ', clickClasses);
    //         if(clickClasses.contains("mz-image-stage") || clickClasses.contains("mz-button-close")){
    //             pushGoal("clickProduktbild");
    //         }
    //     } catch (error) {
    //         console.log('Error: ', error);
    //     }
    // });

    WATO.ajax("/de/cart/update", function(url, responseText) {
        // console.log('responseText: ', responseText);
        if(responseText.indexOf("Der Artikel wurde aktualisiert.") !== -1){
            removeClass(WATO.qs(".kk_error"), 'kk_error');
            removeClass(WATO.qs(".kk_red"), 'kk_red');
            removeClass(documentElement, 'kk_deactive');

            try {

                var responseAsElement = document.createElement("div");
                responseAsElement.innerHTML = responseText;

                priceReplace(".h-xLargeOffset-bottom-outer .price", responseAsElement);
                priceReplace(".h-xsmallOffset-bottom-outer .price", responseAsElement);
                priceReplace(".h-text-muted .offset-price-left", responseAsElement);

            } catch (error) {
                console.log('Error: ', error);
            }
        }
    });

    checkContinueButtonClick('.yCmsContentSlot + .row .button.success');
    checkContinueButtonClick('.h-mediumOffset-bottom-inner .button.success');

    // Sternchen hinter den Preisen entfernt bei Gesamtsumme
    WATO.elem('.h-xsmallOffset-bottom-outer .price', function(totalPrice){
        if(totalPrice){
            removeStarFromString(totalPrice[0]);

            // Alle Produkte
            WATO.elem('.listing__table--item .item__amount', function(allItemsRemoveButton){
                if(allItemsRemoveButton){
                    // Summe aller Rabatte
                    var overAllMoneySavings = 0;

                    for (var i = 0; i < allItemsRemoveButton.length; i++) {
                        var thisItem = allItemsRemoveButton[i].closest(".listing__table--item"),
                            shippingAvailability = WATO.qs(".js-availability-status", thisItem),
                            itemImg = WATO.qs(".small-4 img", thisItem),
                            itemImgSrc = itemImg.getAttribute("src"),
                            discountPrice = WATO.qs(".discountPrice", thisItem),
                            normalPrice = WATO.qs(".price", thisItem),
                            strikeValue = WATO.qs(".strikeValue", thisItem);

                        // console.log('thisItem: ', thisItem);

                        httpGetAsync("https://www.hessnatur.com"+WATO.qs("form", thisItem).getAttribute("data-product-json-url"), function(uri, data){
                            // console.log("-------------------");
                            // console.log('uri: ', uri);
                            // console.log('data: ', data);

                            allProductsInfos[String(data.code)] = data;

                            try {
                                if(data){

                                    // console.log('data.shortUrl: ', data.shortUrl);
                                    var dropDownColor = '',
                                        thisProd = WATO.qs('form[data-product-json-url="'+uri.replace("https://www.hessnatur.com","")+'"]'),
                                        prodID = WATO.qs('input[name="variantCode"]', thisProd).value,
                                        sizeDropdown = WATO.qs(".item__size", thisProd),
                                        colorDropdown = WATO.qs(".item__color", thisProd);

                                    // console.log('thisProd: ', thisProd);
                                    // console.log('sizeDropdown: ', sizeDropdown);
                                    // console.log('colorDropdown: ', colorDropdown);

                                    // Alle Farben des Produkts
                                    for (var k = 0; k < data.colors.length; k++) {
                                        var colors = data.colors[k],
                                            isSelected = colors.sizes[0].code.substring(5,7) === prodID.substring(5,7);
            
                                        // Dropdown für Farbauswahl, inclusive Vorselectierung der richtigen Farbe
                                        if(colorDropdown){
                                            dropDownColor += '<option value="'+colors.colorCode+'" data-img="'+colors.modelImageUrl+'"'+
                                                    ' data-code="'+colors.code+'" data-price="'+colors.formattedPrice+'" '+
                                                    (isSelected ? 'selected="selected"' : "")+'>'+ // Hier wird die Vorselektierung gesetzt
                                                    colors.color+' ('+colors.colorCode+')</option>';
                                        }

                                        if(isSelected){
                                            sizeDropdown.innerHTML = getSizeOptions(colors.sizes, prodID);
                                        }
                                    }
                                    
                                    if(colorDropdown){
                                        colorDropdown.innerHTML = dropDownColor;
                                        colorDropdown.addEventListener('change', changeColor);
                                    }

                                    // Interaktion mit dem Größenänderungsbutton
                                    sizeDropdown.addEventListener('change', changeSize);
                                }
                            } catch (error) {
                                console.log('Error: ', error);
                            }
                        });


                        // Verfügbarkeit vor das Bild verschoben
                        if(shippingAvailability) {
                            itemImg.insertAdjacentElement('afterend', shippingAvailability);
                        }

                        // Bild in größerer Auflösung laden
                        itemImg.setAttribute("src", itemImgSrc.replace("hyb_redes_cart_overview", "generalfeed_small"));

                        // Box unter dem Bild für Mülleimer und Anzahl
                        WATO.qs("form", thisItem).insertAdjacentHTML('beforeend', 
                            '<div class="kk_removeAndQuantity row column small-12"></div>'
                        );

                        var headline = WATO.qs(".h4", thisItem);
                        if(headline){
                            headline.addEventListener('click', function(){
                                pushGoal("HLCart", true);
                            });
                        }

                        // MagicZoom
                        var imgParent = itemImg.parentNode;
                        addClass(imgParent, 'MagicZoom');
                        imgParent.setAttribute("data-options","zoomOn: click;");
                        
                        imgParent.addEventListener('touchstart', function(){
                            pushGoal("clickProduktbild");
                        });

                        // imgParent.setAttribute("data-options", "onZoomIn: function() {console.log('onZoomIn', arguments[0]);}");
                        imgParent.setAttribute("href", itemImgSrc.replace("hyb_redes_cart_overview", "generalfeed_medium"));

                        var removeAndQuantity = WATO.qs(".kk_removeAndQuantity", thisItem);

                        // ProduktMenge verschieben
                        removeAndQuantity.insertAdjacentElement('afterbegin', allItemsRemoveButton[i].parentNode);
                        // LöschenButton verschieben
                        removeAndQuantity.insertAdjacentElement('afterbegin', WATO.qs(".js-entry-remove", thisItem).parentNode);

                        // Sternchen hinter den Preisen entfernt
                        removeStarFromString(discountPrice);
                        removeStarFromString(normalPrice);
                        
                        // Wenn es einen Streichpreis gibt
                        if(strikeValue){
                            var strikePrice = strikeValue.innerHTML.replace("*",""),
                                moneySavings = parseFloat(strikePrice.replace("€","").replace(".","").replace(",",".")) - 
                                    parseFloat(discountPrice.innerHTML.replace("*","").replace("€","").replace(".","").replace(",","."));

                            strikeValue.innerHTML = strikePrice;
                            
                            // Ersparnis darunter in einer grünen Box anzeigen
                            strikeValue.parentNode.insertAdjacentHTML('afterend', 
                                '<div class="kk_lightgreen" data-discount="'+moneySavings+'">€ '+String((moneySavings).toFixed(2)).replace(".",",")+' Ersparnis</div>'
                            );

                            overAllMoneySavings += moneySavings;
                        }
                    }

                    // Fallback falls MagicZoom die Zoom Funktion der Bilder nicht direkt initialisiert hat
                    setTimeout(function(){

                        if(window.MagicZoom){
                            window.MagicZoom.refresh();
                        }
                    }, 1500);

                    // Zwischensumme
                    WATO.elem('.price.offset-price-left', function(zwischenSumme){
                        if(zwischenSumme){
                            zwischenSumme = zwischenSumme[0];

                            removeStarFromString(zwischenSumme);

                            // Wenn es Rabatte gibt werden diese hier summiert angezeigt
                            if(overAllMoneySavings){
                                overallDiscountBuild(overAllMoneySavings);
                                // zwischenSumme.parentNode.parentNode.parentNode.insertAdjacentHTML('beforeend', 
                                //     '<div class="kk_lightgreen">Sie sparen mit dieser Bestellung <b>€ '+String((overAllMoneySavings).toFixed(2)).replace(".",",")+'</b></div>'
                                // );
                            }

                            // Versandlinkt-Text angepasst
                            WATO.qs(".btn-deliverycosts").innerHTML = "+ Versand";
                        }
                    });
                }
            });
        }
    });

    // Gutschein und Aktionscode
    WATO.elem('#hessnaturVoucherForm', function(actionCode){
        if(actionCode){
            actionCode = actionCode[0].parentNode.parentNode;

            // Aktionscodebox
            addClass(actionCode, 'kk_actionCode');

            actionCode.insertAdjacentHTML('afterbegin', 
                '<div class="kk_opener"><img src="'+imgPath+'gutschein.svg">Ich habe einen Gutschein- oder Aktionscode</div>'
            );

            // Ausklapp-mechanik
            WATO.qs(".kk_opener", actionCode).addEventListener('click', function(e){
                addClass(e.target.parentNode, 'kk_open');
                pushGoal("aktionscode");
            });

            // Reihenfolge mit Freunde werben Freunde getauscht
            actionCode.insertAdjacentElement('beforebegin', WATO.qs(".js_backstopWrapper > .row.h-smallOffset-bottom-outer"));
            actionCode.nextElementSibling.insertAdjacentElement('afterend', actionCode);
        }
    });

    // UVPs vor dem Footer
    WATO.elem('.js_backstopWrapper > .callout.dark-gray', function(freundeWerbenFreunde){
        if(freundeWerbenFreunde){
            freundeWerbenFreunde[0].insertAdjacentHTML('beforebegin', 
                '<div class="kk_uvps">'+
                    '<div>'+
                        '<img src="'+imgPath+'headerlabel.png">'+
                        '<h4>Zeitloses Design seit 1976</h4>'+
                        '<ul>'+
                            '<li><b>Natürliche Materialien zum Wohlfühlen</b><br>Unsere Artikel haben einen besonders hohen Tragekomfort</li>'+
                            '<li><b>Qualitativ hochwertig verarbeitet</b><br>Alle unsere Artikel sind absolut frei von Schadstoffen</li>'+
                            '<li><b>Wir übernehmen Verantwortung</b><br>Faire und zertifizierte ökologische Standards in der Produktion</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'
            );
        }
    });

})(new window.WATO(), window, window.document.documentElement);