// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function(WATO) {
    "use strict";

    window.iridion.econda.push(["Sprint06", "V0"]);

    function pushGoal(key, sendOnNextPageView){    
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

    WATO.elem('.listing__table--item .item__amount', function(allItemsRemoveButton){
        if(allItemsRemoveButton){
            for (var i = 0; i < allItemsRemoveButton.length; i++) {
                var thisItem = allItemsRemoveButton[i].closest(".listing__table--item");

                WATO.qs(".small-4 a", thisItem).addEventListener('click', function(){
                    pushGoal("clickProduktbild", true);
                });

                WATO.qs(".h4", thisItem).addEventListener('click', function(){
                    pushGoal("HLCart", true);
                });

                WATO.qs(".js-entry-edit-save", thisItem).addEventListener('click', function(){
                    pushGoal("nutzeEinstellungen", true);
                });
            }
        }
    });

    WATO.elem('#hessnaturVoucherForm .quickadd__button', function(quickadd__button){
        if(quickadd__button){
            quickadd__button[0].addEventListener('click', function(){
                pushGoal("aktionscode", true);
            });
        }
    });

    

})(new window.WATO());
