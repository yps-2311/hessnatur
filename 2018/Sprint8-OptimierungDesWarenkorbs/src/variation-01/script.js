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

    WATO.totalDiscount = 0;

    // Zeit bis Nudge eingeblendet wird
    var nDelayCart = 5000;

    function getFloatNumber(price) {
        return parseFloat(price.textContent.replace("-","").replace("*","").replace("€","").replace(",","."));
    }
    function getGermanPrice(floatPrice) {
        return floatPrice.toFixed(2).replace(".",",");
    }
    function getLocalstorage(name){
    	return window.localStorage.getItem(name);
    }
    function setLocalstorage(name){
    	window.localStorage.setItem(name, true);
    }
    function nudgeClose(e){
        setLocalstorage("kk_nudgeCart");

        var oNudge = WATO.qs(".kk_nudgeCart", e.target.parentNode.parentNode.parentNode);
        if(oNudge){
            oNudge.classList.remove('wa-show-nudge');
            window.setTimeout(function(){
                oNudge.style.display = "none";
            }, 1100);
        }
    }

    try {

        // Wenn mindestens ein Produkt im WK liegt wird eine Zeile Text oberhalb eingeblendet
        WATO.elem('.item__form', function(product){
            if(product && product.length > 0){
                WATO.elem('.bgColor-super-light-gray', function(addArticleBar){
                    if(addArticleBar){
                        addArticleBar[0].insertAdjacentHTML("afterend", 
                            '<div class="row">'+
                                '<div id="kk_topInfo" class="column small-5"><b>Gute Wahl!</b> Nur noch wenige Klicks bis zu Ihrer Bestellung.</div>'+
                            '</div>');
                    }
                });
            }
        });
    
        // Discout Produkte
        WATO.elem('.discountPrice.h-xsmallOffset-bottom-inner', function(discountPrice){
            if(discountPrice){
                for (var i = 0; i < discountPrice.length; i++) {
                    var thisDiscountPrice = discountPrice[i],
                        thisNormalPrice = thisDiscountPrice.nextElementSibling;

                    // Wenn ein Produkt einen Discoutpreis hat und der dazugehörige Normalpreis
                    // ermittelt werden konnte werden diese Rabatte summiert und unten angezeigt
                    if(thisDiscountPrice && thisNormalPrice) {
                        var disPrice = getFloatNumber(thisDiscountPrice),
                            normPrice = getFloatNumber(thisNormalPrice);
    
                        if(normPrice > disPrice) {
    
                            var total = normPrice - disPrice;
    
                            // Rabattbox für jedes Produkt
                            thisDiscountPrice.parentNode.parentNode.insertAdjacentHTML("beforeend", 
                                '<div class="kk_green">'+
                                    'Sie sparen € '+
                                    getGermanPrice(total)+
                                '</div>');
    
                            WATO.totalDiscount = WATO.totalDiscount + total;
    
                            if(discountPrice.length === i+1){
                                // Rabattcode
                                var redeemedVouchers = WATO.qsa(".shrink .price.discountPrice");
                                if(redeemedVouchers.length > 0){
                                    for (var k = 0; k < redeemedVouchers.length; k++) {
                                        // wurde einer order mehrere eingelöst werden diese dem Gesammtrabatt aufaddiert
                                        WATO.totalDiscount = WATO.totalDiscount + getFloatNumber(redeemedVouchers[k]);
                                    }
                                    // GOAL
                                    WATO.goalPush("useVoucher");
                                }
                                
                                // Rabattbestellung unten rechts
                                WATO.qs(".align-right > .h-xsmallOffset-bottom-outer").insertAdjacentHTML("beforebegin", 
                                '<div class="kk_green">'+
                                    'Sie sparen mit dieser Bestellung € '+
                                    getGermanPrice(WATO.totalDiscount)+
                                '</div>');
                            }
                        }
                    }
                }
            }
        });
    
        // CTAs (weiter zum Checkout)
        WATO.elem('a.success', function(successBtn){
            if(successBtn){
                // Nudge einblenden
                var showNudge = function(){
                    var body = document.documentElement.scrollTop !== 0 ? document.documentElement : document.body,
                        start = body.scrollTop,
                        addClass = function(id){
                            var thisNudge = WATO.qs(".kk_nudgeCart", successBtn[id].parentNode);
                            if(thisNudge){
                                thisNudge.classList.add("wa-show-nudge");
                            }
                        };

                    if(start > 270){
                        addClass(1);
                    }else{
                        addClass(0);
                    }
                };

                for (var j = 0; j < successBtn.length; j++) {
                    var thisBtn = successBtn[j];
    
                    // Umbenennen
                    thisBtn.innerHTML = "Zur Kasse";
                    thisBtn.insertAdjacentHTML("afterend",'<div class="kk_save">Sichere Verbindung (SSL-verschlüsselt)</div>');
    
                    // Wenn der Nudge noch nie weggeklickt wurde wird dieser nach Zeit X eingeblendet
                    if(!getLocalstorage("kk_nudgeCart")){
                        // Nudge
                        thisBtn.insertAdjacentHTML('afterend', 
                            '<div class="kk_nudgeCart">'+
                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
                                '<h4>In Ruhe zu Hause anprobieren & entscheiden:</h4>'+
                                '<p>Sie haben 14 Tage Zeit, um unseren <b>kostenlosen Retouren-Service</b> zu nutzen. Egal, wie Sie zahlen möchten.</p>'+
                            '</div>');
            
                        // schließen des Nudges
                        WATO.qs(".close-button", thisBtn.parentNode).addEventListener('click', nudgeClose);
    
                        // Nach Zeit X wird entweder der obere oder der untere Nudge eingeblendet
                        window.setTimeout(showNudge, nDelayCart);
                    }
                }
            }
        });

        // Unterhalb der Produkte
        WATO.elem('.row > .yCmsContentSlot', function(betweenSums){
            if(betweenSums){
                // Statischer Text in blau
                betweenSums[0].parentNode.insertAdjacentHTML("beforebegin",
                '<div class="row kk_blue">'+
                    '<div class="column small-12 large-10 large-offset-1">Artikel im Warenkorb werden nicht zurückgelegt.</div>'+
                '</div>');
    
                // Eingabefeld für Rabattcodes oder Gutscheine umplatziert
                WATO.elem('.applyVoucherWrapper', function(applyVoucherWrapper){
                    if(applyVoucherWrapper){
                        applyVoucherWrapper = applyVoucherWrapper[0];
                        
                        WATO.qs(".kk_blue").insertAdjacentElement("afterbegin", applyVoucherWrapper.parentNode);
                        // Statische UVP Box links unten
                        applyVoucherWrapper.insertAdjacentHTML("afterbegin", '<div class="kk_trust row">'+
                                '<b class="column small-12">Wir übernehmen Verantwortung</b>'+
                                '<div class="kk_fst column small-4 h6">Höchste Qualitätsstandards nach der hessnatur Richtlinie</div>'+
                                '<div class="kk_sec column small-4 h6">Reine Naturfasern aus biologischer Landwirtschaft</div>'+
                                '<div class="kk_thr column small-4 h6">Hoher Tragekomfort und Hautverträglichkeit</div>'+
                            '</div>');
                    }
                });
            }
        });
    
        WATO.globalCode();
        
    } catch (error) {
        console.log(error);
    }

})(new window.WATO());
