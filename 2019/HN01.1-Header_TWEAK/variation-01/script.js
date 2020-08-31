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

    // if(window.document.location.href.indexOf("kk=preview") !== -1){
    //     window.document.documentElement.classList.add('kk_preview');
    WATO.elem('.logoContainer img', function(logo){
        if(logo){
            logo[0].setAttribute('src', 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/logo/hessnatur_logo.svg');
        }
    });
    // }

})(new window.WATO());

//!function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,o,a,i){var r,l=this||a,d=i||Date.now(),c=false;if(Date.now()-d>1e4)return n(false),false;return"string"==typeof e?c=(r=t.querySelectorAll(e)).length>0:r=c=true===e(),true===c?n(r):setTimeout(l.elem.bind(null,e,n,o,l,d),o||20)},e.WATO.prototype.qs=function(e,n){return(n||t).querySelector(e)},e.WATO.prototype.qsa=function(e,n){return(n||t).querySelectorAll(e)},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(o,a,i,r,l){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==a.indexOf(e)&&t()}),false),n.call(this,o,a,i,r,l)}}}(window,document),function(e){"use strict";function t(){for(var t=e.qsa(".meta-navigation .badge--hollow"),n=t.length,o=0;o<n;o++){var a=t[o],i="block";"0"===a.textContent&&(i="none"),a.style.display=i}}e.elem("#header",(function(n){n&&(t(),e.ajax("wishlist/add",t),e.ajax("cart/add",t))}));var n=setInterval((function(){t()}),42);setTimeout((function(){clearInterval(n)}),1e4),e.elem('#mainNavPrgRedirectionForm li[aria-label="Outdoor"]',(function(e){e&&e[0].addEventListener("click",(function(){window.iridion.push(["goal","mainNavi_outdoor","",true])}))})),"/de/outdoor"===location.pathname&&(e.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] > .h-text-bold',(function(e){e&&e[0].classList.remove("h-text-bold")})),e.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] .secondLevel .h-text-bold',(function(e){e&&e[0].classList.remove("h-text-bold")})),e.elem('#mainNavPrgRedirectionForm li[aria-label="Damen"] .thirdLevel .h-text-bold',(function(e){e&&e[0].classList.remove("h-text-bold")})),e.elem('#mainNavPrgRedirectionForm [aria-label="Outdoor"] > a',(function(e){e&&e[0].classList.add("h-text-bold")})))}(new window.WATO);