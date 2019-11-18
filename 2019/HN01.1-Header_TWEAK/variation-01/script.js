// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Lukas Dziambor
 * @namespace V1
 * @name Variation 01
 * @description New Header + OUTDOOR
 */

// window.iridion.econda.push(["HN01", "V1"]);


(function(WATO) {
    "use strict";

    // hide badges when 0 count
    function checkIcons() {
        var _badges = WATO.qsa('.meta-navigation .badge--hollow'),
        _badgeCount = _badges.length;

        for(var b = 0; b < _badgeCount; b++) {
            var thisBadge = _badges[b],
            _displayTxt = 'block';
            
            if(thisBadge.textContent === '0') {
                _displayTxt = 'none';
            }
            thisBadge.style.display = _displayTxt;
        }
    }

    // set navi in fullsize under logo
    WATO.elem('#header', function(header){
        if(header) {
            // add ajax listener for icon badges
            checkIcons();
            WATO.ajax('wishlist/add', checkIcons);
            WATO.ajax('cart/add', checkIcons);
        }
    });

    var badgeChecker = setInterval(function(){
        checkIcons();
    }, 42);

    setTimeout(function(){
        clearInterval(badgeChecker);
    }, 10000);

    WATO.elem('#mainNavPrgRedirectionForm li[aria-label="Outdoor"]', function(outdoorDesktop){
        if(outdoorDesktop) {
            outdoorDesktop[0].addEventListener('click', function(){
                // console.log('outdoor!');
                window.iridion.push(['goal', 'mainNavi_outdoor', '', true]);
            });
        }
    });

    if(location.pathname === '/de/outdoor') {
        WATO.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] > .h-text-bold', function(damen){
            if(damen) {
                damen[0].classList.remove('h-text-bold');
            }
        });
        WATO.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] .secondLevel .h-text-bold', function(secondLevel){
            if(secondLevel) {
                secondLevel[0].classList.remove('h-text-bold');
            }
        });
        WATO.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] .thirdLevel .h-text-bold', function(thirdLevel){
            if(thirdLevel) {
                thirdLevel[0].classList.remove('h-text-bold');
            }
        });

        WATO.elem('#mainNavPrgRedirectionForm [aria-label="Outdoor"] > a', function(outdoor){
            if(outdoor) {
                outdoor[0].classList.add('h-text-bold');
            }
        });
    }

})(new window.WATO());