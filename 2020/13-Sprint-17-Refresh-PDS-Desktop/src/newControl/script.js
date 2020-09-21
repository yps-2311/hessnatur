// load core and global js
// @codekit-prepend "../global/global.js";


/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    if(document.cookie.indexOf("kksp17desk_exclude=true") === -1){

        // window.iridion.econda.push(["Sprint17desktop", "V0"]);

        WATO.sprint17goals(0);

        /*jshint loopfunc: true */
        
        WATO.ready(function(){

            var ctlItems = WATO.qsa('.pds-completeTheLookWrapper .productitem'),
                ratings = WATO.qsa('.js_showAdditionalItems, #read_reviews a.js_triggerShortenDestroy');

            WATO.elem(function(){
                ctlItems = WATO.qsa('.pds-completeTheLookWrapper .productitem');

                return ctlItems.length !== 0;

            }, function(fnCallback){
                if(fnCallback){

                    for (var ctl = 0; ctl < ctlItems.length; ctl++) {

                        ctlItems[ctl].addEventListener('click', function(){
                            WATO.goalPush("kk17_product_ctl", true);
                        });                       
                    }
                }
            });

            WATO.elem(function(){
                ratings = WATO.qsa('.js_showAdditionalItems, #read_reviews a.js_triggerShortenDestroy');

                return ratings.length !== 0;

            }, function(fnCallback){
                if(fnCallback){

                    for (var r = 0; r < ratings.length; r++) {

                        ratings[r].addEventListener('click', function(){
                            WATO.goalPush("kk17_product_ctl", true);
                        });                       
                    }
                }
            });

            
        });



    }

})(new window.WATO());