// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    // function pushGoal(key) {
    //     window.iridion.push(['goal', 's5_' + key]);
    // }
    // WATO.goalsFromCat();

    // if (!Element.prototype.matches) {
    //     Element.prototype.matches = Element.prototype.msMatchesSelector || 
    //                                 Element.prototype.webkitMatchesSelector;
    // }
    // if (!Element.prototype.closest) {
    //     Element.prototype.closest = function(s) {
    //         var el = this;
        
    //         do {
    //         if (el.matches(s)) return el;
    //         el = el.parentElement || el.parentNode;
    //         } while (el !== null && el.nodeType === 1);
    //         return null;
    //     };
    // }

    function removeStarFromString(el) {
        if(el){
            el.innerHTML = el.innerHTML.replace("*","");
        }
    }

    var imgPath = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2019/Sprint06/",
        allProductsInfos = {};


    // Weitere Artikel hinzufügen Box nach unten verschoben
    WATO.elem('.js_backstopWrapper > .bgColor-super-light-gray', function(addOtherArticle){
        if(addOtherArticle){
            WATO.elem('.js_backstopWrapper > .h-mediumOffset-bottom-inner:not(.yCmsContentSlot)', function(bottomButtons){
                if(bottomButtons){
                    bottomButtons[0].insertAdjacentElement('afterend', addOtherArticle[0]);
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

    // function httpGetAsync(theUrl, callback) {
    //     var xmlHttp = new XMLHttpRequest();
    //     xmlHttp.onreadystatechange = function() { 
    //         if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
    //             callback(xmlHttp.responseText);
    //         }
    //     };
    //     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    //     xmlHttp.send(null);
    // }
    function ajax_get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var data = false;
                try {
                    data = JSON.parse(xmlhttp.responseText);
                } catch(err) {
                }
                callback(data, url);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function getSizeOptions(thisSizes, prodID) {
        var dropDownSize = '';
        // Alle Größen des Produkts
        for (var l = 0; l < thisSizes.length; l++) {
            var thisSize = thisSizes[l],
                isAvailable = thisSize.available,
                isSelected = thisSize.size === prodID.substring(7,9);
            dropDownSize += '<option '+((!isAvailable) && isSelected ? 'class="kk_red"' : '')+' value="'+thisSize.size+'" '+(isAvailable ? '' : 'disabled=""')+(isSelected ? 'selected="selected"' : "")+' data-code="'+thisSize.code+'">'+thisSize.size+'</option>';
        }
        return dropDownSize;
    }

    function changeSize(e) {
        var parentForm = e.target.closest("form"),
            variantCode = WATO.qs('input[name="variantCode"]', parentForm);
            // selectedOption = WATO.qs('.item__size', parentForm);
        
        // WATO.qs('input[name="variantCode"]', parentForm).value = selectedOption.options[selectedOption.selectedIndex].getAttribute("data-code");
        variantCode.value = variantCode.value.substring(0,7) + WATO.qs('.item__size', parentForm).value;

        $.ajax({
            url : '/de/cart/update',
            type: 'post',
            data : $(parentForm).serialize()
        });
    }

    function changeColor(e) {
        var parentForm = e.target.closest("form"),
            variantCode = WATO.qs('input[name="variantCode"]', parentForm),
            selectedOption = WATO.qs('.item__color', parentForm),
            inputSize = WATO.qs('.item__size', parentForm),
            productMainID = variantCode.value.substring(0,5),
            productSelectedSize = variantCode.value.substring(7,9);

        variantCode.value = productMainID + selectedOption.value + productSelectedSize;

        if(window.MagicZoom){
            window.MagicZoom.update(WATO.qs(".MagicZoom", parentForm.previousElementSibling).getAttribute("id"), selectedOption.options[selectedOption.selectedIndex].getAttribute("data-img"), selectedOption.options[selectedOption.selectedIndex].getAttribute("data-img"));
        }
        
        // console.log('allProductsInfos: ', allProductsInfos);

        // allProductsInfos[productMainID]
        console.log('allProductsInfos[productMainID]: ', allProductsInfos[productMainID]);

        // selectedOption.value

        var allColors = allProductsInfos[productMainID].colors;

        for (var j = 0; j < allColors.length; j++) {
            if(allColors[j].colorCode === selectedOption.value){
                inputSize.innerHTML = getSizeOptions(allColors[j].sizes, variantCode.value);
                break;
            }
        }

        console.log('WATO.qs(".kk_red", parentForm): ', WATO.qs(".kk_red", parentForm));
        if(WATO.qs(".kk_red", parentForm)){
            // Fehler
            console.log("fehler");
            inputSize.classList.add('kk_error');
        }else{
            $.ajax({
                url : '/de/cart/update',
                type: 'post',
                data : $(parentForm).serialize()
            });
        }
        
    }


    // Alle Produkte
    WATO.elem('.listing__table--item .item__amount', function(allItems){
        if(allItems){
            // Summe aller Rabatte
            var overAllMoneySavings = 0

            for (var i = 0; i < allItems.length; i++) {
                var thisItem = allItems[i].closest(".listing__table--item"),
                    shippingAvailability = WATO.qs(".js-availability-status", thisItem),
                    itemImg = WATO.qs(".small-4 img", thisItem),
                    itemImgSrc = itemImg.getAttribute("src"),
                    discountPrice = WATO.qs(".discountPrice", thisItem),
                    normalPrice = WATO.qs(".price", thisItem),
                    strikeValue = WATO.qs(".strikeValue", thisItem);

                ajax_get("https://www.hessnatur.com"+WATO.qs("form", thisItem).getAttribute("data-product-json-url"), function(data){
                    console.log('data: ', data);

                    allProductsInfos[String(data.code)] = data;

                    try {
                        if(data){

                            var dropDownColor = '', //'<select name="item__color" class="custom__select item__color">',
                                 //'<select name="item__size" class="custom__select item__size">',
                                thisProd = WATO.qs('form[data-product-json-url^="'+data.shortUrl+'"]'),
                                prodID = WATO.qs('input[name="variantCode"]', thisProd).value,
                                sizeDropdown = WATO.qs(".item__size", thisProd),
                                colorDropdown = WATO.qs(".item__color", thisProd),
                                preselectedSizeKey = 0;
    
                            // Alle Farben des Produkts
                            for (var k = 0; k < data.colors.length; k++) {
                                var colors = data.colors[k],
                                    isSelected = colors.code.substring(5,7) === prodID.substring(5,7);
    
                                // Dropdown für Farbauswahl, inclusive Vorselectierung der richtigen Farbe
                                dropDownColor += '<option value="'+colors.colorCode+'" data-img="'+colors.modelImageUrl+'"'+
                                        ' data-code="'+colors.code+'" data-price="'+colors.formattedPrice+'" '+

                                        (isSelected ? 'selected="selected"' : "")+'>'+ // Hier wird die Vorselektierung gesetzt
                                        colors.color+' ('+colors.colorCode+')</option>';

                                if(isSelected){
                                    // preselectedSizeKey = k;
                                    console.log('prodID: ', prodID);
                                    sizeDropdown.innerHTML = getSizeOptions(data.colors[k].sizes, prodID);
                                }
                            }
    
                            colorDropdown.innerHTML = dropDownColor;
                            

                            sizeDropdown.addEventListener('change', changeSize);

                            colorDropdown.addEventListener('change', changeColor);

                        }
                    } catch (error) {
                        console.log('Error: ', error);
                    }
                });



                // Verfügbarkeit vor das Bild verschoben
                if(shippingAvailability) {
                    itemImg.insertAdjacentElement('afterend', shippingAvailability);
                }
                
                // Lupe-Symbol
                itemImg.insertAdjacentHTML('beforebegin', 
                    '<div class="kk_lupe"></div>'
                );

                // Bild in größerer Auflösung laden
                itemImg.setAttribute("src", itemImgSrc.replace("hyb_redes_cart_overview", "generalfeed_small"));

                // Box unter dem Bild für Mülleimer und Anzahl
                WATO.qs("form", thisItem).insertAdjacentHTML('beforeend', 
                    '<div class="kk_removeAndQuantity row column small-12"></div>'
                );

                // MagicZoom
                itemImg.parentNode.classList.add('MagicZoom');
                itemImg.parentNode.setAttribute("href", itemImgSrc.replace("hyb_redes_cart_overview", "generalfeed_medium"));

                var removeAndQuantity = WATO.qs(".kk_removeAndQuantity", thisItem);

                removeAndQuantity.insertAdjacentElement('afterbegin', allItems[i].parentNode);
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
                        '<div class="kk_lightgreen">€ '+String((moneySavings).toFixed(2)).replace(".",",")+' Ersparnis</div>'
                    );

                    overAllMoneySavings += moneySavings;
                }
            }

            // Fallback falls MagicZoom die Zoom Funktion der Bilder nicht direkt initialisiert hat
            setTimeout(function(){
                if(window.MagicZoom){
                    window.MagicZoom.refresh();
                }
            }, 2000);

            // Zwischensumme
            WATO.elem('.price.offset-price-left', function(zwischenSumme){
                if(zwischenSumme){
                    zwischenSumme = zwischenSumme[0];

                    removeStarFromString(zwischenSumme);

                    // Wenn es Rabatte gibt werden diese hier summiert angezeigt
                    if(overAllMoneySavings){
                        zwischenSumme.parentNode.parentNode.parentNode.insertAdjacentHTML('beforeend', 
                            '<div class="kk_lightgreen">Sie sparen mit dieser Bestellung <b>€ '+String((overAllMoneySavings).toFixed(2)).replace(".",",")+'</b></div>'
                        );
                    }

                    // Versandlinkt-Text angepasst
                    WATO.qs(".btn-deliverycosts").innerHTML = "+ Versand";
                }
            });
        }
    });

    // Sternchen hinter den Preisen entfernt bei Gesamtsumme
    WATO.elem('.h-xsmallOffset-bottom-outer .price', function(totalPrice){
        if(totalPrice){
            removeStarFromString(totalPrice[0]);
        }
    });

    // Gutschein und Aktionscode
    WATO.elem('.row + .row + .bgColor-super-light-gray', function(actionCode){
        if(actionCode){
            actionCode = actionCode[0];

            // Aktionscodebox
            actionCode.classList.add('kk_actionCode');

            actionCode.insertAdjacentHTML('afterbegin', 
                '<div class="kk_opener"><img src="'+imgPath+'gutschein.svg">Ich habe einen Gutschein- oder Aktionscode</div>'
            );

            // Ausklapp-mechanik
            WATO.qs(".kk_opener", actionCode).addEventListener('click', function(e){
                e.target.parentNode.classList.add('kk_open');
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
                            '<li><b>Natürliche Materialen zum Wohlfühlen</b><br>Unsere Artikel haben einen besonders hohen Tragekomfort</li>'+
                            '<li><b>Qualitativ hochwertig verarbeitet</b><br>Alle unsere Artikel sind absolut frei von Schadstoffen</li>'+
                            '<li><b>Wir übernehmen Verantwortung</b><br>Faire und zertifizierte ökologische Standards in der Produktion</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'
            );
        }
    });



})(new window.WATO());