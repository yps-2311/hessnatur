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
	function removeNudge(oNudge){
        console.log('oNudge: ', oNudge);
		oNudge.classList.remove('wa-show-nudge');
		window.setTimeout(function(){
			oNudge.style.display = "none";
		}, 1100);
	}

    WATO.elem('.bgColor-super-light-gray', function(addArticleBar){
        if(addArticleBar){
            addArticleBar[0].insertAdjacentHTML("afterend", 
                '<div class="row">'+
                    '<div id="kk_topInfo" class="column small-6"><b>Gute Wahl!</b> Nur noch wenige Klicks bis zu Ihrer Bestellung.</div>'+
                '</div>');
        }
    });

    WATO.elem('.discountPrice.h-xsmallOffset-bottom-inner', function(discountPrice){
        if(discountPrice){
            for (var i = 0; i < discountPrice.length; i++) {
                var thisDiscountPrice = discountPrice[i],
                    thisNormalPrice = thisDiscountPrice.nextElementSibling;

                if(thisDiscountPrice && thisNormalPrice) {
                    var disPrice = getFloatNumber(thisDiscountPrice),
                        normPrice = getFloatNumber(thisNormalPrice);

                    if(normPrice > disPrice) {

                        var total = normPrice - disPrice;

                        thisDiscountPrice.parentNode.parentNode.insertAdjacentHTML("beforeend", 
                            '<div class="kk_green">'+
                                'Sie sparen € '+
                                getGermanPrice(total)+
                            '</div>');

                        WATO.totalDiscount = WATO.totalDiscount + total;

                        if(discountPrice.length === i+1){

                            var redeemedVouchers = WATO.qsa(".shrink .price.discountPrice");
                            for (var k = 0; k < redeemedVouchers.length; k++) {
                                WATO.totalDiscount = WATO.totalDiscount + getFloatNumber(redeemedVouchers[k]);
                            }
                            
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

    WATO.elem('a.success', function(successBtn){
        if(successBtn){
            for (var j = 0; j < successBtn.length; j++) {
                var thisBtn = successBtn[j];

                thisBtn.innerHTML = "Zur Kasse";
                thisBtn.insertAdjacentHTML("afterend",'<div class="kk_save">Sichere Verbindung (SSL-verschlüsselt)</div>');

                thisBtn.insertAdjacentHTML('afterend', 
                '<div class="kk_nudgeCart wa-show-nudge">'+
                    '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
                    '<h4>In Ruhe Zuhause anprobieren & entscheiden:</h4>'+
                    '<p>Sie haben 14 Tage Zeit um unseren <b>kostenlosen Retouren-Service</b> zu nutzen. Egal, wie Sie zahlen möchten.</p>'+
                '</div>');

                WATO.qs(".close-button", thisBtn.parentNode).addEventListener('click', function(e){
                    removeNudge(WATO.qs(".kk_nudgeCart", e.target.parentNode.parentNode.parentNode));
                });
            }
        }
    });

    WATO.elem('.row > .yCmsContentSlot', function(betweenSums){
        if(betweenSums){
            betweenSums[0].parentNode.insertAdjacentHTML("beforebegin",
            '<div class="row kk_blue">'+
                '<div class="column small-12 large-10 large-offset-1">Artikel im Warenkorb werden nicht zurückgelegt.</div>'+
            '</div>');

            WATO.elem('.applyVoucherWrapper', function(applyVoucherWrapper){
                if(applyVoucherWrapper){

                    applyVoucherWrapper = applyVoucherWrapper[0];
                    
                    WATO.qs(".kk_blue").insertAdjacentElement("afterbegin", applyVoucherWrapper.parentNode);

                    applyVoucherWrapper.insertAdjacentHTML("afterbegin", '<div class="kk_trust row">'+
                            '<b class="column small-12">Wir übernehmen Verantwortung</b>'+
                            '<div class="kk_fst column small-4">Höchste Qualitätsstandards nach der hessnatur Richtlinie</div>'+
                            '<div class="kk_sec column small-4">Reine Naturfasern aus biologischer Landwirtschaft</div>'+
                            '<div class="kk_thr column small-4">Hoher Tragekomfort und Hautverträglichkeit</div>'+
                        '</div>');
                }
            });
        }
    });    
    
})(new window.WATO());
