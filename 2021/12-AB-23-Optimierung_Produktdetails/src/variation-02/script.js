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

    window.iridion.econda.push(["SprintAB23", "V2"]);

    // var fakeClick = false,
    var pushGoal = function(key) {
            window.iridion.push(['goal', key]);
        };

    WATO.elem('#infoTabs', function(infoTabs){

        if(infoTabs){

            infoTabs[0].parentNode.classList.add('kk-ab23');
        }
    });

    // open the first tab
    // if we need an alternative > https://get.foundation/sites/docs/accordion.html
    // WATO.elem('#Produktbeschreibung-label', function(produktbeschreibungLabel){
    //     if(produktbeschreibungLabel){
    //         // fakeClick = true;
    //         // produktbeschreibungLabel[0].click();
    //     }
    // });

    WATO.elem('#Produktbeschreibung', function(produktbeschreibung){

        if(produktbeschreibung){

            WATO.elem('.productInfoAccordion', function(productInfoAccordion){
        
                if(productInfoAccordion){
                    
                    productInfoAccordion[0].insertAdjacentHTML('beforebegin',
                        '<div id="kk-productInfoAccordion" class="row productInfoAccordion"><div class="column small-12">' + produktbeschreibung[0].innerHTML + '</div></div>'
                    );

                    var workaround = setInterval(function(){
                        WATO.qs('#kk-productInfoAccordion > .column').innerHTML = WATO.qs('#Produktbeschreibung').innerHTML;
                    }, 50);

                    window.addEventListener('load', function(){
                        clearInterval(workaround);
                        WATO.qs('#kk-productInfoAccordion > .column').innerHTML = WATO.qs('#Produktbeschreibung').innerHTML;
                    });
                }
            });
        }
    });

    WATO.elem('.productInfoAccordion .accordion-title', function(accordionTitle){

        if(accordionTitle){

            for(var i = 0; i < accordionTitle.length; i++){

                accordionTitle[i].addEventListener('click', function(){

                    // if(!fakeClick){

                        pushGoal('kk_ab23_click_tab');
                        pushGoal('kk_ab23_click_tab_' + this.getAttribute('id'));

                        // var $elem = $(this);

                        // window.setTimeout(function(){
                        //     $('html,body').animate({
                        //         scrollTop: $elem.offset().top - 150
                        //     }, 500);
                        // }, 250);
                    // }

                    // fakeClick = false;
                });
            }
        }
    });

})(new window.WATO());
