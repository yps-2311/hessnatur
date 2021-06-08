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

    var fakeClick = false;

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

    // WATO.elem(function(){
    //     return typeof window.jQuery === "function";
    // }, function(){

    //     $('.small-collapse').on('shown.bs.collapse', function(e) {
    //         // var $card = $(this).closest('.accordion-item');
    //         // var $open = $($(this).data('parent')).find('.collapse.show');

    //         // var additionalOffset = 0;
    //         // if($card.prevAll().filter($open.closest('.accordion-item')).length !== 0){
    //         //       additionalOffset =  $open.height();
    //         // }
    //         $('html,body').animate({
    //             scrollTop: $card.offset().top - additionalOffset
    //         }, 500);
    //     });
    // });

    WATO.elem('.productInfoAccordion .accordion-title', function(accordionTitle){

        if(accordionTitle){

            for(var i = 0; i < accordionTitle.length; i++){

                accordionTitle[i].addEventListener('click', function(){

                    if(!fakeClick){

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
