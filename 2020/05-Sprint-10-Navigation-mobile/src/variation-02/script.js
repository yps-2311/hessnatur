// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function(WATO) {
    "use strict";

    /*jshint loopfunc: true */

    WATO.sprint10();
    WATO.sprint10goals();

    function addClass(elem, thisclassname) {
        if(elem){
            elem.classList.add(thisclassname);
        }
    }

    function pushGoal(key){
        window.iridion.push(['goal', key]);
    }

    addClass(document.documentElement, 'kk_s10nav');

    // Neue Header Navi
    WATO.elem('#offCanvasNavPrgRedirectionForm', function(navi){
        if(navi){
            navi = navi[0];
            // Markup
            navi.insertAdjacentHTML('beforebegin', 
                '<div class="kk_topnav">'+
                    '<div class="kk_neu" data-title="NEU">'+
                        'Neu'+
                    '</div>'+
                    '<div class="kk_damen" data-title="Damen">'+
                        'Damen'+
                    '</div>'+
                    '<div class="kk_herren" data-title="Herren">'+
                        'Herren'+
                    '</div>'+
                    '<div class="kk_junior" data-title="Junior">'+
                        'Junior'+
                    '</div>'+
                    '<div class="kk_home" data-title="Home">'+
                        'Home'+
                    '</div>'+
                    '<div class="kk_sale" data-title="Sale">'+
                        'Sale'+
                    '</div>'+
                '</div>'
            );

            // Syncen und Klickbarkeit der neuen Navi
            var newTopNav = WATO.qsa(".kk_topnav > div", navi.parentNode);

            // Neue Navipunkte
            for (var i = 0; i < newTopNav.length; i++) {
                newTopNav[i].addEventListener('click', function(e){
                    var thisTarget = e.target,
                        isActiveOne = WATO.qs(".kk_active", navi.parentNode),
                        dataTitle = thisTarget.getAttribute('data-title');

                    if(isActiveOne){
                        isActiveOne.classList.remove('kk_active');
                    }
                    addClass(thisTarget, 'kk_active');
                    
                    thisTarget.parentNode.setAttribute('class', "kk_topnav");
                    addClass(thisTarget.parentNode, 'kk_active_' + dataTitle);

                    // Fix der Originalnavi, zu oft sind verschiedenste aktive Navis gleichzeitig offen geblieben
                    var activeNavi = WATO.qsa(".is-active", navi);
                    for (var j = 0; j < activeNavi.length; j++) {
                        activeNavi[j].classList.remove('is-active');
                    }

                    WATO.qs('#offCanvasNavigation > [aria-label="'+dataTitle+'"] > a', navi).click();

                    pushGoal("clicklevel1");

                    switch (dataTitle) {
                        case "NEU":
                            pushGoal("click_neu");
                            break;
                        case "Damen":
                            pushGoal("click_damen");
                            break;
                        case "Herren":
                            pushGoal("click_herren");
                            break;
                        case "Junior":
                            pushGoal("click_junior");
                            break;
                        case "Home":
                            pushGoal("click_home");
                            break;
                        case "Sale":
                            pushGoal("click_sale");
                            break;
                    }
                });
            }

            // Wenn man sich in einer Kategorie befindet wird hier das neue Menü gehighligted
            var functionality = function() {
                WATO.elem('#offCanvasNavigation > li[aria-expanded="true"]', function(activeNavi){
                    if(activeNavi){
                        var thisActiveNavi = WATO.qs('.kk_topnav > div[data-title="'+activeNavi[0].getAttribute('aria-label')+'"]');
                        addClass(thisActiveNavi, 'kk_active');
                        addClass(thisActiveNavi.parentNode, 'kk_active_' + thisActiveNavi.getAttribute('data-title'));
                    }
                });
            };

            functionality(navi);

            // Burgermenu geöffnet
            WATO.elem('a[href="#menu"]', function(menu){
                if(menu){
                    menu[0].addEventListener('click', function(){
                        console.log("click");
                        functionality(navi);
                    });
                }
            });
            

        }
    });

})(new window.WATO());