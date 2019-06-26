/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
    "use strict";

    /*jshint loopfunc: true */
    
    WATO.prototype.goalPush = function(key, sendOnNextPageView){
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
        // console.log('goalPush: ', key);
    };

    // Goal ob Produkte aus dem WK entfernt wurden
    WATO.prototype.goalRemoveItem = function(){
        var _self = this;

        _self.elem('.js-entry-remove', function(removeItems){
            if(removeItems){
                for (var i = 0; i < removeItems.length; i++) {
                    removeItems[i].addEventListener('click', function(){
                        _self.goalPush("removeProcuktFromBaskel", true);
                    });
                }
            }
        });
    };
    
	
})(window.WATO);