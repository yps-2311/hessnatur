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

    // reposition the "fair fashion"-bar
    WATO.elem('.marketingBarWrapper', function(marketingBarWrapper){
        if(marketingBarWrapper) {
            marketingBarWrapper = marketingBarWrapper[0];

            WATO.qs('div.headerWrapper').insertAdjacentElement('beforebegin', marketingBarWrapper);

            var _fairFashion = WATO.qs('.yCmsComponent', marketingBarWrapper);
            _fairFashion.className = 'yCmsComponent column small-6 h-largeOffset-left-inner-large h-font-serif';
            _fairFashion.insertAdjacentHTML('afterend', ''+
                '<div class="yCmsComponent column small-6 h-largeOffset-left-inner-large h-font-serif">'+
                    '<div class="rteContainer">'+
                        '<ul id="kk_metaNavi" class="dropdown menu align-right meta-navigation show-for-large" role="menubar">'+

                        '</ul>'+
                    '</div>'+
                '</div>'
            );

            // reposition the meta navi "newsletter", "magazin", "über uns"
            WATO.elem('ul.meta-navigation.show-for-large li', function(menuitem) {
                if(menuitem) {
                    var kk_metaNavi = WATO.qs('#kk_metaNavi');

                    for(var i = 0; i < 3; i++) {
                        kk_metaNavi.insertAdjacentElement('beforeend', menuitem[i]);
                    }
                }
            });

            checkIcons();
        }
    });

    // set navi in fullsize under logo
    WATO.elem('#header', function(header){
        if(header) {
            header[0].insertAdjacentHTML('beforeend', ''+
                '<div class="column small-12 h-pos-relative h-largeOffset-left-inner-large">'+
                    '<div id="kk_naviWrapper" class="row align-middle" data-margin-top="0">'+
                    '</div>'+
                '</div>'
            );

            var _navi = WATO.qs('#mainNavPrgRedirectionForm').parentElement;

            _navi.className = 'column small-12 medium-12';
            _navi.id="kk_navi";
            _navi.insertAdjacentHTML('afterend', '<div id="kk_searchWrapper" class="column small-4 medium-5"></div>');
            
            WATO.qs('#kk_naviWrapper').insertAdjacentElement('afterbegin', _navi);

            // reposition search
            WATO.elem('#search_form', function(_search) {
                if(_search) {
                    _search = _search[0].parentElement;

                    _search.className = 'yCmsComponent column small-8';
                    WATO.qs('#kk_searchWrapper').insertAdjacentElement('afterbegin', _search);
        
                    _search.insertAdjacentHTML('afterend', '<div id="kk_searchToggle" class="search"></div>');
        
                    WATO.qs('#kk_searchToggle').addEventListener('click', function(){
                        _search.style.left='2.30769rem';
                    });
                }
            });
        
            // add ajax listener for icon badges
            checkIcons();
            WATO.ajax('wishlist/add', checkIcons);
            WATO.ajax('cart/add', checkIcons);
        }
    });

    WATO.ready(checkIcons);

})(new window.WATO());