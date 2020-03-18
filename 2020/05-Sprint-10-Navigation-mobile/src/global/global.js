/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
    "use strict";
    
    WATO.prototype.sprint10 = function(){
        var _self = this,
            imgPath = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/AB10/katimg/";

        function cleanMenuHeadline(ele) {
            if(typeof ele === "object"){
                // Zur korrekten URL Benennung werden alle Sonderzeichen ersetzt
                return ele.textContent.toLowerCase().trim().replace(" & ","_").replace("/","").replace("ä","ae").replace("ü","ue").replace("ö","oe").replace("ß","ss").replace(/ /g,"_"); // .replace("✿","")
            }
        }

        // Navi Hierarchy
        _self.elem( '#offCanvasNavigation > li:not([aria-label="Outdoor"]), '+ // Level 1
                    '#offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li:not(.h-text-bold):not([data-drilldown-back-levels]), '+ // Level 2
                    '#offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li > ul > li:not(.h-text-bold):not([data-drilldown-back-levels])', // Level 3
                    function(all3LevelHierarchy){ //:not(.h-text-bold)
            if(all3LevelHierarchy){
                for (var i = 0; i < all3LevelHierarchy.length; i++) {
                    try {
                        var thisMenuPoint = all3LevelHierarchy[i],
                            tempHL = thisMenuPoint.parentNode.parentNode.parentNode.previousElementSibling,
                            tempHL2 = thisMenuPoint.parentNode.previousElementSibling,
                            tempHeadlineText = "";
                        
                        // Für Level 3 - Wenn ein Navi-Punkt eine Level3 Benennung hat wird dieser hier für die Benennung mitaufgenommen
                        // z.B. damen_bekleidung_hose wird hier damen aufgenommen
                        if(tempHL && tempHL.textContent.trim().length > 0){
                            tempHeadlineText = cleanMenuHeadline(tempHL) + '_';
                        }
                        // Für Level 2
                        // z.B. damen_bekleidung_hose wird hier bekleidung aufgenommen
                        if(tempHL2){
                            tempHeadlineText += cleanMenuHeadline(tempHL2) + '_';
                        }
                        // Bei Level 1 bleibt tempHeadlineText leer
                        
                        var isTitleInA = _self.qs("a", thisMenuPoint);

                        // Navi-Punkt-Titel
                        thisMenuPoint.setAttribute('style', 'background-image: url("' + imgPath + tempHeadlineText + 
                            cleanMenuHeadline((isTitleInA ? isTitleInA : thisMenuPoint)) + 
                            '.png")');

                    } catch (error) {
                        console.log('Error: ', error);
                    }
                    
                }
            }
        });


    };
	
})(window.WATO);