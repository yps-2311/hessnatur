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

    window.iridion.econda.push(["SprintAB23", "V1"]);

    console.log("SprintAB23 - V1");


    var setContentContainer = function(selectorAccordion, selectorNewPosition) {

        WATO.elem(selectorAccordion, function(accordion){

            if(accordion){

                WATO.qs(selectorNewPosition).innerHTML = accordion[0].innerHTML;
            }
        });
    },
    setProductbeschreibung = function() {

        // left column
        WATO.elem('#Produktbeschreibung > .row > .column', function(produktbeschreibung){

            if(produktbeschreibung){

                produktbeschreibung = produktbeschreibung[0];

                produktbeschreibung.insertAdjacentHTML('beforeend', 
                    '<div id="kk-ab23-Made_In" class="kk-ab23-contentBox"></div>' +
                    '<div id="kk-ab23-Material" class="kk-ab23-contentBox"></div>'
                );

                setContentContainer('#Made_In', '#kk-ab23-Made_In');
                setContentContainer('#Material', '#kk-ab23-Material');
            }
        });
    }

    WATO.elem('#kk-prod-desc-img', function(prodImg){

        if(prodImg){

            setProductbeschreibung();

            prodImg = prodImg[0];

            // right column and prod img
            prodImg.parentNode.insertAdjacentHTML('beforeend',
                '<div class="column small-12 medium-6 large-6">' + 
                    prodImg.outerHTML +
                    '<div class="row">' + 
                        '<div id="kk-ab23-content-right" class="column">' +
                            '<div id="kk-ab23-Ausgezeichnete_Qualitaet" class="kk-ab23-contentBox"></div>' +
                            '<div id="kk-ab23-Passform" class="kk-ab23-contentBox"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            setContentContainer('#Ausgezeichnete_Qualitaet', '#kk-ab23-Ausgezeichnete_Qualitaet');
            setContentContainer('#Passform', '#kk-ab23-Passform');
        }
    });

    // workaround if the product are kicked out of the dom
    window.addEventListener('load', function(){
        if(!WATO.qs('#kk-ab23-Made_In')){
            setProductbeschreibung();
        }
    });
})(new window.WATO());
