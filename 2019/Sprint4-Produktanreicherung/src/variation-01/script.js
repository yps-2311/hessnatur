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

    /*jshint loopfunc: true */

     /* jshint ignore:start */
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
      
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
        
            do {
                if (el.matches(s)) 
                    return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
    /* jshint ignore:end */

    // Sendet ein Request. In unserem Fall um ein Produkt in den WK zu legen
    function requestXML(URL, data, callback){

        var params = typeof data === 'string' ? data : Object.keys(data).map(
                function(k){ 
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                }
            ).join('&');

        var request = new XMLHttpRequest();
    
        request.open("POST", URL , true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function(){
            if (request.status >= 200 && request.status < 400 && request.responseText.length > 0) {
                callback(request);
            }
        };
        request.send(params);
    }

    // Fragt eine Produktdetail-JSON an um diese Daten dann als "Reco" zu verwenden
    function ajax_get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var data = "";
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

    // "Complete The Look"-Box
    function buildCompleteTheLook(thisPoduct, allTrackedCTLProducts, appProductsFromCTLinCard) {
        var thisCTL = thisPoduct.nextElementSibling.nextElementSibling;

        // Hierbei handelt es sich um die im Localstorage gespeicherten daten welche Produkte zum CTL gehören.
        // Falls CTL erst nachgeladen wird sind diese Daten nicht aktuell
        // daher werden sie erst jetzt aus dem Localstroage geladen
        if(!allTrackedCTLProducts){
            // Artikel-ID wird ermittelt und falls vorhanden ein LS Element geladen
            try {
                allTrackedCTLProducts = window.localStorage.getItem("kk_ctl_"+thisPoduct.getAttribute("data-product-json-url").replace("/de/p/", "").substr(0, 5)).split(",");
            } catch (error) {
                console.log(error);
            }
        }

        // Alle CTL Produkte wurden mit den im WK befindlichen abgeglichen und 
        // wenn diese dann übereinstimmen werde sie markiert.
        if(!appProductsFromCTLinCard){
            appProductsFromCTLinCard = thisPoduct.nextElementSibling.getAttribute("data-ctl").split(",");
        }
        
        // Alle Produkte die CTL haben werden hier durchgeprüft
        for (var j = 1; j < allTrackedCTLProducts.length; j++) {

            // Produkt ID
            var thisProductCode = allTrackedCTLProducts[j];
            
            // JSON Anfrage für Produktinfos und die Position wird mit übergeben
            ajax_get("https://www.hessnatur.com/de/p/"+thisProductCode+"/json?position="+j, function(data, callURL){

                // Falls irgendwelche Produktdaten nicht vorhanden sind soll das Produkt lieber nicht gelistet werden
                try {

                    var dropDownColor = '<select name="item__color" class="custom__select item__color">',
                        dropDownSize = '<select name="item__size" class="custom__select item__size">';

                    // Alle Farben des Produkts
                    for (var k = 0; k < data.colors.length; k++) {
                        var colors = data.colors[k];

                        // Dropdown für Farbauswahl, inclusive Vorselectierung der richtigen Farbe
                        dropDownColor += '<option value="'+colors.colorCode+'" data-img="'+colors.articleImageUrl.replace("_list_main", "_detail_thumb")+'"'+
                                ' data-code="'+colors.code+'" '+(callURL.indexOf(colors.code) !== -1 ? 'selected="selected"' : "")+'>'+
                                colors.color+' ('+colors.colorCode+')</option>';
                    }

                    var firstSizes = data.colors[0].sizes;

                    // Alle Größen des Produkts
                    for (var l = 0; l < firstSizes.length; l++) {
                        var thisSize = firstSizes[l];
                        dropDownSize += '<option value="'+thisSize.size+'" data-code="'+thisSize.code+'">'+thisSize.size+'</option>';
                    }

                    dropDownColor += '</select>';
                    dropDownSize += '</select>';

                    // Markup für CTL Produkte
                    WATO.qs(".kk_pos"+callURL.split("position=")[1], thisCTL).insertAdjacentHTML('beforeend', 
                        '<div class="carousel-cell" data-prid="'+data.code+'">'+
                            '<div class="kk_ctlInfos">'+
                                '<img src="'+data.colors[0].articleImageUrl.replace("_list_main", "_detail_thumb")+'" alt="'+data.name+'" title="'+data.name+'">'+
                                '<div class="item__desc h-smallOffset-top-outer">'+
                                    '<h4 class="desc-name">'+data.name+'</h4>'+
                                    '<div class="desc-price">'+
                                        '<span class="price">'+data.formattedPrice+'</span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="kk_moreInfos">'+
                                '<label class="h-text-muted">Farbe:</label>'+
                                dropDownColor+
                                '<label class="h-text-muted">Größe:</label>'+
                                dropDownSize+
                                '<label class="h-text-muted">Anzahl:</label>'+
                                '<input name="quantity" class="input-group-field qty" pattern="^[1-9][0-9]{1,2}$|^\d$" type="text" value="1" maxlength="2">'+
                                '<button class="kk_addtoCart button success" data-price="'+data.price+'" data-prid="'+data.code+'">In den Warenkorb</button>'+
                            '</div>'+
                        '</div>'
                    );
                    var thisCTLProd = WATO.qs('.carousel-cell[data-prid="'+data.code+'"]', thisCTL);

                    // Hier kommt das grüne Häckchen wenn das Produkt schon im WK liegt
                    if(appProductsFromCTLinCard && appProductsFromCTLinCard.includes(data.code)){
                        thisCTLProd.classList.add("kk_isInWK");
                    }

                    // Farbe ändern
                    WATO.qs(".item__color", thisCTLProd).addEventListener('change', function(e){
                        var thisExplicitTarget = e.explicitOriginalTarget;
                        WATO.qs("img", thisExplicitTarget.parentNode.parentNode).setAttribute("src", WATO.qs('option[value="'+thisExplicitTarget.value+'"]', thisExplicitTarget).getAttribute("data-img"));
                    });

                    // CTL-Infos ein- und ausklappen (unter dem Produktnamen)
                    WATO.qs('.kk_ctlInfos', thisCTLProd).addEventListener('click', function(e){
                        e.preventDefault();

                        var isOpenProduct = WATO.qs(".kk_moreInfos.kk_show");

                        if(isOpenProduct){
                            isOpenProduct.classList.remove("kk_show");
                        }
                        
                        WATO.qs(".kk_moreInfos", e.target.closest(".carousel-cell")).classList.add("kk_show");

                        WATO.goalPush("klickProductCTL");
                    });

                    // Produkt in den WK legen
                    WATO.qs(".kk_addtoCart", thisCTLProd).addEventListener('click', function(e){
                        e.preventDefault();

                        WATO.goalPush("intoTheBasketCTL", true);

                        var thisTarget = e.target,
                            thisID = thisTarget.getAttribute("data-prid"),
                            thisColor = WATO.qs(".item__color", thisTarget.parentNode).value,
                            thisSize = WATO.qs(".item__size", thisTarget.parentNode).value,
                            thisQuantity = WATO.qs(".qty", thisTarget.parentNode).value,
                            exectProductID = thisID+thisColor+thisSize;
                        
                        requestXML("https://www.hessnatur.com/de/cart/add", { 
                            productCodePost: exectProductID,
                            ff_id: exectProductID,
                            ff_masterId: thisID,
                            ff_title: "",
                            ff_price: parseFloat(thisTarget.getAttribute("data-price")),
                            qty: parseInt(thisQuantity),
                            CSRFToken: WATO.qs('input[name="CSRFToken"]').value
                        }, function(){
                            // Wenn das Produkt dem WK hinzugefügt wurde wird die Seite neu geladen
                            location.href=location.href.split('#')[0];
                            location.reload();
                        });
                    });
                    
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }

    var isOneCTLshowen = false;

    WATO.exclude(1023, function () {
        location.href=location.href.split('#')[0];
        location.reload();
    });

    WATO.goalRemoveItem();

    // Alle Produkte im WK
    WATO.elem('.js-update-entry-form', function(allProducts){
        if(allProducts){

            for (var i = 0; i < allProducts.length; i++) {
                var thisPoduct = allProducts[i];

                // Alle im Localstorage gemerkten CTL-Produkte
                for (var thisLS in window.localStorage) {
                    if(thisLS.indexOf("kk_ctl_") !== -1){

                        var allTrackedCTLProducts = window.localStorage.getItem(thisLS).split(",");

                        // Dieses Produkt ist das in den WK gelegte Produkt zudem die CTL Produkte angezeigt werden sollen
                        if(thisPoduct.getAttribute("data-product-json-url").indexOf(allTrackedCTLProducts[0]) !== -1 && !thisPoduct.classList.contains("kk_hasCTL")){
                            // Das Produkt ist ein CTL-Haupt-Produkt (also das Ausgangsprodukt eines Sets)
                            thisPoduct.classList.add("kk_hasCTL");

                            var appProductsFromCTLinCard = [];

                            for (var m = 0; m < allProducts.length; m++) {
                                for (var n = 1; n < allTrackedCTLProducts.length; n++) {
                                    if(allProducts[m].getAttribute("data-product-json-url").indexOf(allTrackedCTLProducts[n].substr(0,5)) !== -1){

                                        // Alle Produkte werden neu sortiert, so dass sie in den CTL Gruppen zusammen liegen
                                        thisPoduct.parentNode.insertAdjacentElement('afterend', allProducts[m].parentNode);

                                        // Ein Teil eines Sets
                                        allProducts[m].parentNode.classList.add("kk_ctlProduct");

                                        // Nur die ersten 5 Nummern sind für ein Produkt relevant
                                        appProductsFromCTLinCard.push(allTrackedCTLProducts[n].substr(0,5));
                                    }
                                }
                            }

                            // Nur Produkte mit "CTL"-Badge anzeigen die nicht selbst ein CTL Produkt sind (z.B. mit der hier neuen CTL-Funktion inzugefügt wurden)
                            if(!thisPoduct.classList.contains("kk_ctlProduct")){
                                thisPoduct.insertAdjacentHTML('afterend', 
                                    '<div class="kk_buttonCTL" data-ctl="'+appProductsFromCTLinCard+'">Complete<br>the look</div>'+
                                    '<div class="kk_shopTheLook kk_hide">'+
                                        '<h3>Complete the look <span>'+(appProductsFromCTLinCard.length + 1)+'/'+allTrackedCTLProducts.length+'</span></h3>'+
                                        '<div class="kk_pos1 kk_pos"></div>'+
                                        '<div class="kk_pos2 kk_pos"></div>'+
                                        '<div class="kk_pos3 kk_pos"></div>'+
                                    '</div>'
                                );

                                if(!isOneCTLshowen){
                                    // Das erste CTL Produkt dieses wird direkt geladen und angezeigt

                                    isOneCTLshowen = true;

                                    buildCompleteTheLook(thisPoduct, allTrackedCTLProducts, appProductsFromCTLinCard);

                                    // Eingeblendet
                                    thisPoduct.nextElementSibling.classList.add("kk_hide");
                                    thisPoduct.nextElementSibling.nextElementSibling.classList.remove("kk_hide");
                
                                }else{
                                    // Ein Produkt mit einem Badge das aber nicht ausgeklappt ist
                                    // erst beim klick auf das Badge werden die Produkte geladen

                                    WATO.qs(".kk_buttonCTL", thisPoduct.parentNode).addEventListener('click', function(e){
                                        // Nur die CTL Produkte anfragen wenn diese hier noch nicht eingebaut sind
                                        if(!WATO.qs(".carousel-cell", e.target.nextElementSibling)){
                                            buildCompleteTheLook(e.target.previousElementSibling);
                                        }

                                        WATO.goalPush("klickButtonCTL");
                                    });
                                }

                            }

                            // CTL ein und ausklappen
                            WATO.qs(".kk_buttonCTL", thisPoduct.parentNode).addEventListener('click', function(e){
                                var selectedTarget = e.target,
                                    openCTL = WATO.qs(".kk_buttonCTL.kk_hide");

                                    if(openCTL){
                                        openCTL.classList.remove("kk_hide");
                                        openCTL.nextElementSibling.classList.add("kk_hide");
                                    }

                                    selectedTarget.nextElementSibling.classList.remove("kk_hide");
                                    selectedTarget.classList.add("kk_hide");
                            });
                        }

                    }
                }
            }
        }
    });
    
})(new window.WATO(), window);