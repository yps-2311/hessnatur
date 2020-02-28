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

    /*jshint loopfunc: true */

    WATO.sprint10();

    WATO.elem('#offCanvasNavPrgRedirectionForm', function(navi){
        if(navi){
            navi = navi[0];
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

            var newTopNav = WATO.qsa(".kk_topnav > div", navi.parentNode);
                // theLinksNavi = WATO.qsa('#offCanvasNavigation > .is-drilldown-submenu-parent:not([aria-label="Outdoor"]) > .h-text-decoration-none-hover', navi);

            for (var i = 0; i < newTopNav.length; i++) {
                newTopNav[i].addEventListener('click', function(e){

                    var isActiveOne = WATO.qs(".kk_active", navi.parentNode);

                    if(isActiveOne){
                        isActiveOne.classList.remove('kk_active');
                    }
                    e.target.classList.add('kk_active');

                    console.log('e.target.getAttribute(data-title): ', e.target.getAttribute('data-title'));
                    console.log('e.target: ', e.target);
                    console.log('WATO.q navi): ', WATO.qs('#offCanvasNavigation > [aria-label="'+e.target.getAttribute('data-title')+'"] > a', navi));
                    console.log('WATO.qsa(".is-active", navi): ', WATO.qsa(".is-active", navi));

                    // Fix der Originalnavi, zu oft sind verschiedenste aktive Navis gleichzeitig offen geblieben
                    var activeNavi = WATO.qsa(".is-active", navi);
                    for (var j = 0; j < activeNavi.length; j++) {
                        activeNavi[j].classList.remove('is-active');
                    }

                    WATO.qs('#offCanvasNavigation > [aria-label="'+e.target.getAttribute('data-title')+'"] > a', navi).click();
                });
            }

        }
    });

})(new window.WATO());