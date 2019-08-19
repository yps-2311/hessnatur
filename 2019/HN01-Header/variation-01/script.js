// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Lukas Dziambor
 * @namespace V1
 * @name Variation 01
 * @description New Header + OUTDOOR
 */
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
            WATO.elem('#search_form', function(_search) {
                if(_search) {
                    _search = _search[0];
                    _search.insertAdjacentHTML('afterend', '<div id="kk_searchToggle" class="search"></div>');
        
                    WATO.qs('#kk_searchToggle').addEventListener('click', function(){
                        this.style.display = 'none';
                        _search.style.left='30px';
                    });
                }
            });
        
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

})(new window.WATO());