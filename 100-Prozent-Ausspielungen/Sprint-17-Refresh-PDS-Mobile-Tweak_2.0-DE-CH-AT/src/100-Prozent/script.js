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
    
    // window.iridion.econda.push(["Sprint17mobtw2", "V2"]);

    // WATO.sprint17goals(1);
    WATO.sprint17(1);

    WATO.elem('.pds-cockpit__wrapper', function(cockpitWrapper){
        if(cockpitWrapper){
            cockpitWrapper = cockpitWrapper[0];
            // console.log('cockpitWrapper: ', cockpitWrapper);
            
            var imageAndCockpitWrapper = WATO.qs(".pds__imageAndCockpitWrapper"),
                artNumber = WATO.qs(".pds-cockpit__articleNumber", cockpitWrapper),
                ratingSummary = WATO.qs(".pds-cockpit__ratingSummaryWrapper"),
                navBreadcrumb = WATO.qs('nav[role="navigation"]');

            if(ratingSummary){
                artNumber.insertAdjacentElement('afterend', ratingSummary);
            }

            if(navBreadcrumb){
                imageAndCockpitWrapper.insertAdjacentElement('afterbegin', navBreadcrumb);
            }

            imageAndCockpitWrapper.insertAdjacentElement('beforebegin', artNumber.parentNode);


            WATO.elem(function(){
                // console.log('WATO.qs(".pds-cockpit__productName"): ', WATO.qs(".pds-cockpit__productName, h1"));
                // console.log('WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode: ', WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode);
                // console.log('typeof WATO.qs(".pds-cockpit__productName") !== "undefined" && typeof WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode !== "undefined": ', typeof WATO.qs(".pds-cockpit__productName") !== "undefined" && typeof WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode !== "undefined");
                return typeof WATO.qs(".pds-cockpit__productName") !== "undefined" && typeof WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode !== "undefined";
            }, function(element){
                if(element){
                    try {
                        // console.log('WATO.qs(".pds-cockpit__productName", cockpitWrapper): ', WATO.qs(".pds-cockpit__productName, h1"));
                        // console.log('imageAndCockpitWrapper: ', imageAndCockpitWrapper);
                        imageAndCockpitWrapper.insertAdjacentElement('beforebegin', WATO.qs(".pds-cockpit__productName, h1").parentNode.parentNode);
                    } catch (error) {
                        // console.log('Error1: ', error);
                    }
                }
            });
            



            WATO.elem(function(){
                return typeof WATO.qs(".show-for-large", cockpitWrapper) !== "undefined" && typeof WATO.qs(".align-justify", cockpitWrapper) !== "undefined";
            }, function(isReady){
                if(isReady){
                    // console.log('WATO.qs(".show-for-large", cockpitWrapper): ', WATO.qs(".show-for-large", cockpitWrapper));
                    // console.log('WATO.qs(".align-justify", cockpitWrapper): ', WATO.qs(".align-justify", cockpitWrapper));
                    try {
                        WATO.qs(".show-for-large", cockpitWrapper).insertAdjacentElement('afterend', WATO.qs(".align-justify", cockpitWrapper));
                    } catch (error) {
                        // console.log('Error2: ', error);
                    }
                }
            });


            
            
        }
    });

    // WATO.elem('.pds-cockpit__wrapper', function(cockpitWrapper){
    //     if(cockpitWrapper){
    //         cockpitWrapper = cockpitWrapper[0];
    //         WATO.qs(".show-for-large", cockpitWrapper).insertAdjacentElement('afterend', WATO.qs(".align-justify", cockpitWrapper));
    //     }
    // });
    

})(new window.WATO());


// !function(e){"use strict";e.sprint17(1),e.elem(".pds-cockpit__wrapper ",(function(t){if(t){t=t[0];var n=e.qs(".js_backstopWrapper"),r=e.qs(".pds-cockpit__articleNumber",t),p=e.qs(".pds-cockpit__ratingSummaryWrapper");p&&r.insertAdjacentElement("afterend",p),n.insertAdjacentElement("afterbegin",e.qs(".pds-cockpit__productName",t).parentNode.parentNode),n.insertAdjacentElement("afterbegin",r.parentNode)}})),e.elem(".pds-cockpit__wrapper",(function(t){t&&(t=t[0],e.qs(".show-for-large",t).insertAdjacentElement("afterend",e.qs(".align-justify",t)))}))}(new window.WATO);