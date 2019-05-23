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

    WATO.elem('.js-pds-more-details', function(moreDetails){
        if(moreDetails){
            moreDetails.addEventListener('click', function(){
                WATO.goalPush("klick_produktdetails");
            });
        }
    });

    // Zurück-Button
    WATO.elem('.breadcrumb--back a', function(breadcrumb){
        if(breadcrumb){
            breadcrumb[0].addEventListener('click', function(){
                WATO.goalPush("kategorie_back", true);
            });
        }
    });

    WATO.elem('.accordion-item > a', function(otherTabs){
        if(otherTabs){
            var passform = false,
                material = false,
                pflege = false,
                ausgezeichneteQuali = false;

            for (var i = 0; i < otherTabs.length; i++) {
                var thisTab = otherTabs[i],
                    tabText = thisTab.textContent;
                
                if(tabText.indexOf("Ausgezeichnete Qualit") !== -1){
                    ausgezeichneteQuali = thisTab.parentNode;
                }else if(tabText.indexOf("Passform") !== -1){
                    passform = thisTab.parentNode;
                }else if(tabText.indexOf("Material") !== -1){
                    material = thisTab.parentNode;
                }else if(tabText.indexOf("Pflege") !== -1){
                    pflege = thisTab.parentNode;
                }
            }

            if(passform){
                WATO.qs('a[href="/de/groessenberatung"]', passform).addEventListener('click', function(){
                    WATO.goalPush("material_pflege");
                });
            }

            material.addEventListener('click', function(){
                WATO.goalPush("material_pflege");
            });
            pflege.addEventListener('click', function(){
                WATO.goalPush("material_pflege");
            });
            ausgezeichneteQuali.addEventListener('click', function(){
                WATO.goalPush("ausgezeichnete_qualitaet");
            });
        }
    });

})(new window.WATO());
