// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    // window.iridion.econda.push(["SprintAB23", "V2"]);

    var fakeClick = false,
        pushGoal = function(key) {
            window.iridion.push(['goal', key]);
        };

    WATO.elem('#infoTabs', function(infoTabs){

        if(infoTabs){

            infoTabs[0].parentNode.classList.add('kk-ab23');
        }
    });

    // open the first tab
    // if we need an alternative > https://get.foundation/sites/docs/accordion.html
    WATO.elem('#Produktbeschreibung-label', function(produktbeschreibungLabel){

        if(produktbeschreibungLabel){

            fakeClick = true;
            produktbeschreibungLabel[0].click();
        }
    });

    WATO.elem('.productInfoAccordion .accordion-title', function(accordionTitle){

        if(accordionTitle){

            for(var i = 0; i < accordionTitle.length; i++){

                accordionTitle[i].addEventListener('click', function(){

                    if(!fakeClick){

                        pushGoal('kk_ab23_click_tab');
                        pushGoal('kk_ab23_click_tab_' + this.getAttribute('id'));

                        var $elem = $(this);

                        window.setTimeout(function(){
                            $('html,body').animate({
                                scrollTop: $elem.offset().top - 150
                            }, 500);
                        }, 250);
                    }

                    fakeClick = false;
                });
            }
        }
    });

})(new window.WATO());
