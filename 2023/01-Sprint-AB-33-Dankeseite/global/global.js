/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * @prepros-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
	"use strict";
	WATO.prototype.ab33 = function(){
        WATO = this;
        var isVisible = false;
        //push goal in iridion
        const goalPush = (key) => {
            window.iridion.push(['goal', key]);
        };

        // verhindert die erneute Ausführung bei einem reload
        if (sessionStorage.getItem("KK_AB33") !== 'true') {
            sessionStorage.setItem("KK_AB33", true);

            // //prüfen ob segment da ist
            // if (window.iridion.push(['hasSegment', "32925"])) {
            //     goalPush('page_conv_return');

            //     var wa_interval = setInterval(function(){

            //         try {
            //             if(typeof window.emospro !== "undefined"){

            //                 var wa_price = 0,
            //                     wa_buyid = "";

            //                 if(typeof window.emospro.billing !== "undefined" && window.emospro.billing.length > 3){
            //                     clearInterval(wa_interval);
            //                     wa_price = window.emospro.billing[3];
            //                     wa_buyid = window.emospro.billing[0];
            //                 }
            //                 if(wa_price === 0 && window.emospro.ec_Event && window.emospro.ec_Event.length > 0){
            //                     clearInterval(wa_interval);
            //                     wa_price = window.emospro.ec_Event[0].price;
            //                 }

            //                 if(parseInt(wa_price) !== 0){
            //                     
            //                     window.iridion.push(['goal' ,"revenue_return", wa_price, wa_buyid]);
            //                 }else{

            //                     goalPush('error_revenue_return');
            //                 }
            //             }
            //         } catch (error) {
            //             //testweise drin lassen
            //             console.log(error);
            //             goalPush('error_revenue_return');
            //         }
            //     }, 100);

            //     setTimeout(function(){
            //         clearInterval(wa_interval);
            //     }, 3000);

            // } 
        }
        let monitorInterval;
        let kkScreenWidth = screen.width;
        WATO.elem('#sovendus-container-1', (newStickyElem) => {
            if (newStickyElem) {
                newStickyElem = newStickyElem[0];
                if (kkScreenWidth < 1024) {
                    window.addEventListener('scroll', () => {
                        
                        var topPosition = newStickyElem.getBoundingClientRect().top;
                        var elementHeight = newStickyElem.offsetHeight;
                        var kkScreenHeight = screen.height;
                        if(topPosition - kkScreenHeight < 0 && !(topPosition + elementHeight  < 0) && isVisible === false){
                            monitorInterval = setInterval(() => {
                                let elem = document.activeElement;
                                if(elem && elem.tagName == 'IFRAME'){
                                    clearInterval(monitorInterval);
                                    goalPush('click_thankyou_coupon');
                                }
                                
                            }, 1000);
                            setTimeout( () => {
                                clearInterval(monitorInterval);
                            }, 20000);
                        } else if(topPosition + elementHeight  < 0 && isVisible === true){
                            isVisible = false;
                            clearInterval(monitorInterval);
                        }
                    });
                } else {
                    WATO.ev(newStickyElem, 'mouseenter', () => {
                        monitorInterval = setInterval(() => {

                            let elem = document.activeElement;
                            if(elem && elem.tagName == 'IFRAME'){
                                clearInterval(monitorInterval);
                                goalPush('click_thankyou_coupon');
                            }
                        }, 1000);
                        setTimeout( () => {
                            clearInterval(monitorInterval);
                        }, 20000);

                    });
                    WATO.ev(newStickyElem, 'mouseleave', () => {
                        clearInterval(monitorInterval);
                    });
                }
            }
        });

        WATO.ev('._1imnks7', 'click', (tyTrustedshop) => {
            if (tyTrustedshop) {
                goalPush('click_thankyou_trustedshops');
            }
        });
	};
    
	
})(window.WATO, window);




