/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

    WATO.prototype.goalPush = function(key, sendOnNextPageView){
        console.log('key: ', key);
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    };

    WATO.prototype.ps02goals = function(variante){
        var _self = this;


        // _self.exclude(1023, function(){

        //     _self.setCookie('kkps02desk_exclude', 'true', ".hessnatur.com", false);
        //     _self.reload();

        // });


        function clickgoal(queryparameter, goalname, sendOnNextPageView) {
            _self.elem(queryparameter, function(element){
                if(element){
                    for (var i = 0; i < element.length; i++) {
                        element[i].addEventListener('click', function(){
                            _self.goalPush(goalname, sendOnNextPageView);
                        });
                    }
                }
            });
        }
        
        if(!variante){
            // V0
            clickgoal('.whishList', "kk02_herz_cat");
            clickgoal('.js-entry-remove', "kk02_delite_cart");
        }
    };

	
})(window.WATO, window);