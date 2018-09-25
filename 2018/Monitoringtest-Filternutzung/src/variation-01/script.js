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

    console.log(1);

    function filterGenutzt(e){
        console.log('e: ', e);
        // var eventOrginal = e;
        // e.preventDefault();
        // e.stopPropogation();

        console.log("filterGenutzt");

        var pButton = e.target;
        console.log('pButton: ', pButton);

        if(!pButton.classList.contains("button")){
            console.log('pButton: ', pButton.classList);
            pButton = pButton.parentNode;
        }

        console.log('pButton: ', pButton);

        // Nur Anwenden Button (nicht schließen Button)
        if(!WATO.qs(".js-filter-apply", pButton).classList.contains("hide")){
            
            // Goal "allgemein" Filter genutzt
            WATO.goalPush("filter_genutzt");

            // In Segment "Filter genutzt"
            window.iridion.push(["segment", "32780"]);

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
                    case "toggle_filter_FFlaenge":
                        sFilterType = "laenge";
                        break;
                    case "toggle_filter_FFweite":
                        sFilterType = "weite";
                        break;
                    case "toggle_filter_FFbraFit":
                        sFilterType = "bhform";
                        break;
                    default:
                        sFilterType = "unbekannt"; // ... außer es passt keines der oberen Goals
                        break;
                }
                WATO.goalPush("filter_"+sFilterType);

                // setTimeout(function(){
                    // console.log(eventOrginal.target);
                    // eventOrginal.target.dispatchEvent(eventOrginal);
                // }, 5000);
            }
        }
    }

    console.log(2);
    
    try {

        console.log(3);


        // console.log('WATO.qs(".gridviewProductFilterDesktopWrapper .dropdown-pane button"): ', WATO.qs(".gridviewProductFilterDesktopWrapper .dropdown-pane button"));

        // console.log('WATO.qs(".filterTagReset"): ', WATO.qs(".filterTagReset"));


        // Alle einzelnen Filter-"Anwenden" Buttons geklickt
        WATO.elem('.gridviewProductFilterDesktopWrapper .dropdown-pane button', function(pButtons){
            console.log(4);
            if(pButtons){
                console.log(5);
                for (var i = 0; i < pButtons.length; i++) {
                    console.log(6);
                    pButtons[i].addEventListener("mousedown", filterGenutzt);
                }

                // Filter zurücksetzen Button geklickt
                // WATO.elem('.filterTagReset', function(pZuruecksetzen){
                //     if(pZuruecksetzen){
                //         console.log("filterTagReset");
                //         pZuruecksetzen[0].addEventListener("click",function (){
                //             WATO.goalPush("filter_zuruecksetzen");
                //         });
                //     }
                // });

                var filterTagReset = WATO.qsa(".filterTagReset");
                if(filterTagReset && filterTagReset.length > 0){
                    console.log("filterTagReset");
                    filterTagReset[0].addEventListener("click",function (){
                        WATO.goalPush("filter_zuruecksetzen");
                    });
                }

            }
        });

        // Sortierung geändert
        WATO.elem('#desktop__sort', function(pSortieren){
            if(pSortieren){
                console.log("desktop__sort");
                pSortieren[0].addEventListener("change",function (){
                    WATO.goalPush("sortierung_geaendert");
                });
            }
        });
        
    } catch (error) {
        console.log(error);
    }
})(new window.WATO());