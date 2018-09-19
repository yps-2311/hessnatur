// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    function filterGenutzt(e){
        var pButton = e.target;

        if(!pButton.classList.contains("button")){
            pButton = pButton.parentNode;
        }
        // Nur Anwenden Button (nicht schließen Button)
        if(!WATO.qs(".js-filter-apply", pButton).classList.contains("hide")){
            
            // Goal "allgemein" Filter genutzt
            WATO.goalPush("filter_genutzt");

            var sAttr = pButton.getAttribute("data-yeti-box"), // Attribut zur identifikation des Filters
                sFilterType = "";
            if(sAttr){
                // Alle bekannten Filter werden hier einem Goal zugeordnet
                switch (sAttr) {
                    case "toggle_filter_FFassortment":
                        sFilterType = "sortiment";
                        break;
                    case "toggle_filter_FFproductgroup":
                        sFilterType = "kategorie";
                        break;
                    case "toggle_filter_colorgroup":
                        sFilterType = "farben";
                        break;
                    case "toggle_filter_FFfarbauspraegung":
                        sFilterType = "farbauspraegung";
                        break;
                    case "toggle_filter_FFfilterSize":
                        sFilterType = "groesse";
                        break;
                    case "toggle_filter_FFprice":
                        sFilterType = "preis";
                        break;
                    case "toggle_filter_FFpassform":
                        sFilterType = "passform";
                        break;
                    case "toggle_filter_material":
                        sFilterType = "material";
                        break;
                    default:
                        sFilterType = "unbekannt"; // ... außer es passt keines der oberen Goals
                        break;
                }
                WATO.goalPush("filter_"+sFilterType);
            }
        }
    }
    
    try {

        // Alle einzelnen Filter-"Anwenden" Buttons geklickt
        WATO.elem('.gridviewProductFilterDesktopWrapper .dropdown-pane button', function(pButtons){
            if(pButtons){
                for (var i = 0; i < pButtons.length; i++) {
                    pButtons[i].addEventListener("click", filterGenutzt);
                }
            }
        });

        // Filter zurücksetzen Button geklickt
        WATO.elem('.filterTagReset', function(pZuruecksetzen){
            if(pZuruecksetzen){
                pZuruecksetzen[0].addEventListener("click",function (){
                    WATO.goalPush("filter_zuruecksetzen");
                });
            }
        });

        // Sortierung geändert
        WATO.elem('#desktop__sort', function(pSortieren){
            if(pSortieren){
                pSortieren[0].addEventListener("change",function (){
                    WATO.goalPush("sortierung_geaendert");
                });
            }
        });
        
    } catch (error) {
        console.log(error);
    }

    
})(new window.WATO());