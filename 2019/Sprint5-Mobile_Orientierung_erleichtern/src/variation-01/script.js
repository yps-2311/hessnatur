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

    function pushGoal(key) {
        window.iridion.push(['goal', 's5_' + key]);
    }

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

            WATO.elem(".gridviewProductFilterMobileWrapper .breadcrumb--back", function(el){
                el[0].insertAdjacentHTML('afterend', originalBreadcrumb.innerHTML);
            });
        }
    });

    // Der Filter hat eine Mengenangabe diese wird umgebaut um sie desinersich anzupassen
    WATO.elem('#tabFilter-label strong', function(filter){
        if(filter){
            filter = filter[0];

            var filterInnerHTML = filter.innerHTML,
            filterCount0 = filter.innerHTML.indexOf('(0)') !== -1;

            filter.innerHTML = filterInnerHTML.replace("(","<span "+((filterCount0) ? 'style="display:none;"' : '' )+">").replace(")","</span>");
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
                                    var sub = submenu[i],
                                    sub_new = sub.cloneNode(true);

                                    sub.setAttribute('data-kkindex', i);
                                    sub_new.setAttribute('data-kkindex', i);
                                    sub_new.classList.add('kkindex');

                                    sub_new.onclick = function(){};

                                    sub_new.addEventListener('click', function(){
                                        pushGoal('s5_subentry');

                                        var kkindex = this.getAttribute('data-kkindex');

                                        console.log(this);
                                        console.log(this.getAttribute('data-kkindex'));
                                        console.log('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label');
                                        console.log(WATO.qs('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label'));

                                        WATO.qs('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label').click();
                                    });

                                    newFilterbar.insertAdjacentElement('beforeend', sub_new);
                                }
                            }else{
                                // ErrorGoal
                                pushGoal('s5_setup');
                                alert('polling timeout 4');
                            }
                        }
                        else {
                            pushGoal('s5_setup');
                            alert('polling timeout 3');
                        }
                    });
                }
                else {
                    pushGoal('s5_setup');
                    alert('polling timeout 2');
                }
            });
        }
        else {
            pushGoal('s5_setup');
            alert('polling timeout');
        }
    });

    WATO.elem('a[data-toggle="drop_pane_FFassortment"]', function(sortimentFilter){
        if(sortimentFilter) {
            sortimentFilter[0].parentNode.style.display = 'none';
        }
    });

    WATO.goalsFromCat();

})(new window.WATO());