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
    // function removeObject(el) {
    //     if(el){
    //         el.parentNode.removeChild(el);
    //     }
    // }

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

    // WATO.elem('.pds-completeTheLookWrapper .productitem', function(completeTheLookWrapper){
    //     if(completeTheLookWrapper){
    //         var list = [];
    //         for (var i = 0; i < completeTheLookWrapper.length; i++) {
    //             list.push(completeTheLookWrapper[i].getAttribute("data-productid"));
    //         }
    //         // console.log('list: ', list);
    //     }
    // });


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
        // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function(){
            if (request.status >= 200 && request.status < 400 && request.responseText.length > 0) {
                callback(request);
            }
        };
        request.send(params);
    }

    function ajax_get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log('responseText:' + xmlhttp.responseText);
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                } catch(err) {
                    // console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }
                callback(data, url);
            }
        };
     
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }



    function buildCompleteTheLook(thisPoduct, allTrackedCTLProducts, appProductsFromCTLinCard) {
        // console.log('thisPoduct: ', thisPoduct);
        // console.log('allTrackedCTLProducts: ', allTrackedCTLProducts);
        // console.log('appProductsFromCTLinCard: ', appProductsFromCTLinCard);
        var thisSTL = thisPoduct.nextElementSibling.nextElementSibling;
            
        for (var j = 1; j < allTrackedCTLProducts.length; j++) {

            var thisProductCode = allTrackedCTLProducts[j];
            
            ajax_get("https://www.hessnatur.com/de/p/"+thisProductCode+"/json", function(data, callURL){
                console.log('data: ', data);                                

                var dropDownColor = '<select name="item__color" class="custom__select item__color">',
                    dropDownSize = '<select name="item__size" class="custom__select item__size">';

                for (var k = 0; k < data.colors.length; k++) {
                    var colors = data.colors[k];

                    // Dropdown für Farbauswahl, inclusive Vorselectierung der richtigen Farbe
                    dropDownColor += '<option value="'+colors.colorCode+'" data-img="'+colors.articleImageUrl.replace("_list_main", "_detail_thumb")+'" data-code="'+colors.code+'" '+(callURL.indexOf(colors.code) !== -1 ? 'selected="selected"' : "")+'>'+
                            colors.color+' ('+colors.colorCode+')</option>';
                }

                var firstSizes = data.colors[0].sizes;

                for (var l = 0; l < firstSizes.length; l++) {
                    var thisSize = firstSizes[l];
                    dropDownSize += '<option value="'+thisSize.size+'" data-code="'+thisSize.code+'">'+thisSize.size+'</option>';
                }

                dropDownColor += '</select>';
                dropDownSize += '</select>';

                thisSTL.insertAdjacentHTML('beforeend', 
                    '<div class="carousel-cell" data-prid="'+data.code+'">'+
                        // '<a href="'+data.url+'" class="item__image" target="_blank">'+
                        '<div class="kk_ctlInfos">'+
                            '<img src="'+data.colors[0].articleImageUrl.replace("_list_main", "_detail_thumb")+'" alt="'+data.name+'" title="'+data.name+'">'+
                            '<div class="item__desc h-smallOffset-top-outer">'+
                                '<h4 class="desc-name">'+data.name+'</h4>'+
                                '<div class="desc-price">'+
                                    '<span class="price">'+data.formattedPrice+'</span>'+
                                '</div>'+
                            '</div>'+
                        // '</a>'+
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
                var thisCTLProd = WATO.qs('.carousel-cell[data-prid="'+data.code+'"]', thisSTL);

                if(appProductsFromCTLinCard.includes(data.code)){
                    thisCTLProd.classList.add("kk_isInWK");
                }

                WATO.qs(".item__color", thisCTLProd).addEventListener('change', function(e){
                    var thisExplicitTarget = e.explicitOriginalTarget;
                    WATO.qs("img", thisExplicitTarget.parentNode.parentNode).setAttribute("src", WATO.qs('option[value="'+thisExplicitTarget.value+'"]', thisExplicitTarget).getAttribute("data-img"))
                });

                WATO.qs('.kk_ctlInfos', thisCTLProd).addEventListener('click', function(e){
                    e.preventDefault();

                    var isOpenProduct = WATO.qs(".kk_moreInfos.kk_show");

                    if(isOpenProduct){
                        isOpenProduct.classList.remove("kk_show");
                    }
                    
                    WATO.qs(".kk_moreInfos", e.target.closest(".carousel-cell")).classList.add("kk_show");
                });


                WATO.qs(".kk_addtoCart", thisCTLProd).addEventListener('click', function(e){
                    e.preventDefault();

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
                        ff_title: "", // Damen+Sandalette+aus+Leder
                        ff_price: parseFloat(thisTarget.getAttribute("data-price")),
                        qty: parseInt(thisQuantity),
                        CSRFToken: WATO.qs('input[name="CSRFToken"]').value
                    }, function(req){
                        console.log('req: ', req);
                        location.reload();
                    });
    
                });
            });
        }
    }


   var isOneCTLshowen = false;

    WATO.elem('.js-update-entry-form', function(updateCartForm){
        if(updateCartForm){

            for (var thisLS in window.localStorage) {
                if(thisLS.indexOf("kk_ctl_") !== -1){

                    var allTrackedCTLProducts = window.localStorage.getItem(thisLS).split(",");
        
                    for (var i = 0; i < updateCartForm.length; i++) {
                        var thisPoduct = updateCartForm[i];
        
                        // Dieses Produkt ist das in den WK gelegte Produkt zudem die CTL Produkte angezeigt werden sollen
                        if(thisPoduct.getAttribute("data-product-json-url").indexOf(allTrackedCTLProducts[0]) !== -1 && !thisPoduct.classList.contains("kk_hasCTL")){

                            thisPoduct.classList.add("kk_hasCTL");
        
                            var appProductsFromCTLinCard = [];
        
                            for (var m = 0; m < updateCartForm.length; m++) {
                                for (var n = 1; n < allTrackedCTLProducts.length; n++) {
                                    if(updateCartForm[m].getAttribute("data-product-json-url").indexOf(allTrackedCTLProducts[n].substr(0,5)) !== -1){
        
                                        thisPoduct.parentNode.insertAdjacentElement('afterend', updateCartForm[m].parentNode);
                                        updateCartForm[m].parentNode.classList.add("kk_ctlProduct");
                                        appProductsFromCTLinCard.push(allTrackedCTLProducts[n].substr(0,5));
                                    }
                                }
                            }

                            // Nur Produkte mit "CTL"-Badge anzeigen die nicht selbst ein CTL Produkt sind (z.B. mit der hier neuen CTL-Funktion inzugefügt wurden)
                            if(!thisPoduct.classList.contains("kk_ctlProduct")){
                                thisPoduct.insertAdjacentHTML('afterend', 
                                    '<div class="kk_buttonCTL">Complete the look</div>'+
                                    '<div class="kk_shopTheLook kk_hide"><h3>Complete the look <span>'+(appProductsFromCTLinCard.length + 1)+'/'+allTrackedCTLProducts.length+'</span></h3></div>'
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
                                            buildCompleteTheLook(e.target.previousElementSibling, allTrackedCTLProducts, appProductsFromCTLinCard);
                                        }
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