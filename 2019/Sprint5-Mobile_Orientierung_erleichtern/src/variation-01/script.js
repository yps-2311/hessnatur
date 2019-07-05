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

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    function getLastChildrens(obj) {
        // Gibt die Childrens des letzes Menüs zurück die nicht folgenden Klassen ensprechen
        var allLi = obj[obj.length-1].children,
            newLis = [];
        for (var k = 0; k < allLi.length; k++) {
            var thisLi = allLi[k];
            if(!thisLi.classList.contains(".h-text-decoration-none-hover") && 
                !thisLi.classList.contains(".h-text-uppercase") && 
                !thisLi.classList.contains(".is-drilldown-submenu-parent") && 
                !thisLi.classList.contains(".is-drilldown-submenu-item")){
                newLis.push(thisLi);
            }
        }
        return newLis;
    }

    // Breadcrumb wird umgebaut
    WATO.elem('.breadcrumbs.h-no-margin', function(breadcrumbs){
        if(breadcrumbs){
            // Die Originale aus der Desktopansicht wird an den Platz der Mobileansicht verschoben
            var originalBreadcrumb = breadcrumbs[0],
                allBreadcrumbLi = WATO.qsa("li", originalBreadcrumb);

            // Der erste Menüpunkt wird entfernt (in dem Fall Startseite)
            if(allBreadcrumbLi.length >= 3) {
                removeObject(allBreadcrumbLi[0]);
            }
            
            // Der Link der aktiven Kategorie soll nicht klickbar sein (zweite Zeile in fett)
            WATO.qs("a", allBreadcrumbLi[allBreadcrumbLi.length-1]).removeAttribute("href");

            WATO.qs(".gridviewProductFilterMobileWrapper .breadcrumb--back").insertAdjacentHTML('afterend', originalBreadcrumb.innerHTML);
        }
    });

    // Der Filter hat eine Mengenangabe diese wird umgebaut um sie desinersich anzupassen
    WATO.elem('#tabFilter-label strong', function(filter){
        if(filter){
            filter = filter[0];
            filter.innerHTML = filter.innerHTML.replace("(","<span>").replace(")","</span>");
        }
    });

    WATO.elem('.gridviewProductFilterMobileWrapper .toggleFilter', function(afterBreadcrumb){
        if(afterBreadcrumb){
            afterBreadcrumb = afterBreadcrumb[0];

            // Slider einbauen
            afterBreadcrumb.insertAdjacentHTML('afterend', '<div class="kk_subfilters"><ul></ul></div>');

            // console.log('afterBreadcrumb: ', afterBreadcrumb);

            // Aktiviertes Menü
            WATO.elem('#offCanvasNavigation .js-drilldown-active', function(activeMenue){
                if(activeMenue){
                    // Die Untermenüpunkte
                    // console.log('activeMenue: ', activeMenue);

                    // var submenuQuery = ".is-submenu-item:not(.h-text-decoration-none-hover):not(.h-text-uppercase):not(.is-drilldown-submenu-parent)";

                    WATO.elem(function(){

                        // return WATO.qsa(submenuQuery, activeMenue[activeMenue.length-1]).length > 0;

                        // Warten bis untermenüpunkte vorhanden sind
                        return getLastChildrens(activeMenue).length > 0;
                    }, function(element){
                        if(element){

                            // var submenu = WATO.qsa(submenuQuery, activeMenue[activeMenue.length-1]);
                            var submenu = getLastChildrens(activeMenue),
                                newFilterbar = WATO.qs(".kk_subfilters ul", afterBreadcrumb.parentNode);

                            // console.log('submenu: ', submenu);
                            // console.log('newFilterbar: ', newFilterbar);
    
                            if(submenu && newFilterbar){
                                /*jshint loopfunc: true */

                                // Die geklonten Untermenüpunkte werden in den Slider eingebaut
                                for (var i = 0; i < submenu.length; i++) {
                                    newFilterbar.insertAdjacentElement('beforeend', submenu[i].cloneNode(true));
                                }
            
                                var allNewFilters = WATO.qsa("label", newFilterbar);
                                for (var j = 0; j < allNewFilters.length; j++) {
                                    var thisLabel = allNewFilters[j];
    
                                    // Wenn man in der untersten Herachie des Menüs angelangt ist wird die aktuelle Kategorie nicht verlinkt
                                    // removeObject(WATO.qs("span.h-text-bold", allNewFilters[j]).parentNode.parentNode);
                                    if(!WATO.qs("span.h-text-bold", thisLabel)){
                                        // Die Untermenüpunkte werden verlinkt, hierbei wird auf den Originallink im Menü geklickt
                                        thisLabel.addEventListener('click', function(e){
                                            WATO.qs('#offCanvasNavPrgRedirectionForm [value="'+WATO.qs("input", e.target.parentNode).value+'"]').click();
                                        });
                                    }
                                }
                            }else{
                                // ErrorGoal
                                
                            }
                        }
                    });
                }
            });
        }
    });

    WATO.goalsFromCat();

})(new window.WATO());