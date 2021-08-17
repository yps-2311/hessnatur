(function(){

    /**
     * Iridion Consent Check
     */
    // if(document.URL.indexOf('//sf.acc.hess-webshop-dev-760c.gcp.get-cloud.io') !== -1){

        try {

            var ucSettings = localStorage.getItem('ucSettings');
            var setIridionConsent = function(value){
                window.localStorage.setItem("ucIridionConsent", value);
                window.iridion.push(["consent", {
                    "cookies": value,
                    "profile": value,
                    "tracking": value
                }]);
            }
            
            if(ucSettings){
                
                ucSettings = JSON.parse(ucSettings);

                for(var containerId in ucSettings){

                    var ucConsents  = ucSettings[containerId].ucConsents;
                    var templates   = ucConsents.consentTemplates;
                    var consents    = ucConsents.consents;
        
                    for(var key in templates){

                        for(var version in templates[key]){
        
                            // get the template id out of the uc templates
                            if(templates[key][version].dataProcessor === "Iridion"){
        
                                // get the current consent status
                                for(var i = 0; i < consents.length; i++){
                                    if(consents[i].templateId === key){

                                        var iridionConsentStatus = window.localStorage.ucIridionConsent;
                                        
                                        if(!consents[i].consentStatus){

                                            if(iridionConsentStatus === undefined || iridionConsentStatus === "true"){
                                                setIridionConsent(false);
                                            }

                                            return false;
                                        }

                                        if(iridionConsentStatus === undefined || window.localStorage.ucIridionConsent === "false"){
                                            setIridionConsent(true);
                                        }
                                        
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch(e){
            console.log(e);
        }
    // } else {

    //     window.iridion.push(["consent", {
    //         "cookies": true,
    //         "profile": true,
    //         "tracking": true
    //     }]);
    // }
})();


/**
 * Custom-URL Tracking
 */
window.iridion.tracking = window.controllerName || window.document.location.pathname;


/**
 * Econda
 * Include into the variaton js
 * window.iridion.econda.push([{
 *     siteID: 1,
 *     content: (siteTitle ? "HTML-Title/"+siteTitle: "content"),
 *     abtest:  [ [testname, testvariante] ]
 * }]);
 * 
 * MV, 05.08.2021 - Ich habe vor dem Versenden eine Prüfung auf das Iridion User Cookie
 * eingebaut. Sollten wir kein Cookie haben, haben wir keinen Consent. 
 */
window.iridion.econda = window.iridion.econda || [];
window.iridion.econda = (function(window){
    "use strict";

    var data = [],
        emos3Status = false;

    function pushErrorGoal() {
        window.iridion = window.iridion || [];
        window.iridion.push(['goal', 'error_econda']);
    }

    function sendEcondaTracking() {

        try {
            for(var i = 0; i < data.length; i++){
                // check for consent
                if(document.cookie.indexOf('iridion_user') !== -1){
                    window.emos3.send(data[i]);
                }
            }
            data = [];
        } catch(e) {
            pushErrorGoal();
        }
    }

    function checkStatus() {
        if(typeof window.emos3 !== "undefined" && typeof window.emos3.send === "function"){
            emos3Status = true;
            return true;
        }
        return false;
    }

    if(checkStatus()){
        sendEcondaTracking();
    } else {

        var econdaInterval  = window.setInterval(function(){
            if(checkStatus()){
                clearInterval(econdaInterval);
                sendEcondaTracking();
            }
        }, 20);
    }

    return {
        push: function(tracking){
            try {
                data.push({
                    type :'event',
                    abtest: [tracking]
                });
                
                if(emos3Status){
                    sendEcondaTracking();
                }
            } catch(e) {
                pushErrorGoal();
            }
        }
    };
})(window);

/**
 * Setup & Goals
 * 
 * jshint loopfunc: true
 */
(function(window){

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
    
            do {
                if (el.matches(s)) {
                    return el;
                }
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }
    
    function docReady(callback) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
    
    function getCookie(name) {
        
        var cookies = document.cookie.split(";");
        
        for(var i = 0; i < cookies.length; i++){
            
            if(cookies[i].substr(0, cookies[i].indexOf("=")).replace(/^\s+|\s+$/g,"") === name){
                
                return decodeURIComponent(cookies[i].substr(cookies[i].indexOf("=") + 1));
            }
        }
    }

    function setSegment(thisID) {
        window.iridion.push(['segment', String(thisID)]);
    }

    function removeSegment(thisID) {
        window.iridion.push(['removeSegment', String(thisID)]);
    }

    // added MV, 09.02.2021
    function setProfileValue(key, value) {
        window.iridion.push(['profile', 'setValue', key, value]);
    }

    // check for crazy user and disable iridion
    try {

        var userCookie = getCookie('iridion_user');

        if(userCookie && userCookie.indexOf('1521023056101454') !== -1) {

            window.document.cookie = "iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/";
        }
    } catch(e){}
    
    try {

        var URL = document.URL,
            pathNameURL = window.location.pathname;

        if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(URL)){
            // Startseite
            goalPush('page_home');
        }else if(URL.indexOf("/p/") !== -1){
            // Produktdetailseite
            goalPush('page_pds');
    
            var origOpen = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

                this.addEventListener("loadend", function() {

                    if(this.readyState === 4 && uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1){

                        goalPush('click_addToCart');
                    }
                }, false);

                origOpen.call(this, method, uri, async, user, pass);
            };

            
    
        }else if(
            pathNameURL === "/de/NEU" || 
            pathNameURL === "/de/damen" || 
            pathNameURL === "/de/herren" || 
            pathNameURL === "/de/outdoor" || 
            pathNameURL === "/de/baby" || 
            pathNameURL === "/de/home" || 
            pathNameURL === "/de/sale"
        ){

            // Kategorieeinsteigsseite
            goalPush('page_lp_cat');

            if(pathNameURL.indexOf('damen') !== -1){

                setProfileValue('categoryAffinity', 'damen');
            } else if(pathNameURL.indexOf('herren') !== -1){

                setProfileValue('categoryAffinity', 'herren');
            }
        }else if(
            // URL.indexOf("/de/damen") !== -1 ||
            // URL.indexOf("/de/herren") !== -1 ||
            // URL.indexOf("/de/baby") !== -1 ||
            // URL.indexOf("/de/home") !== -1 ||
            // URL.indexOf("/de/sale") !== -1
            URL.indexOf("/c/") !== -1
        ){

            // Kategorie
            goalPush('page_cat');

            docReady(function(){
                try {
                    var _filterTab = document.querySelector('#tabFilter-label'), // .gridviewProductFilterDesktopWrapper a
                        interval = setInterval(function(){
                            if(typeof _filterTab !== "undefined"){
                                clearInterval(interval);
                                try {
                                    var _filterLabel = _filterTab.querySelector('strong');
                                    if(typeof _filterLabel !== "undefined"){
                                        if(_filterLabel.innerHTML.indexOf('(0)') === -1 && _filterLabel.innerHTML.indexOf('>0<') === -1) {
                                            goalPush('filter_genutzt');
                                        }
                                        _filterTab.addEventListener('click', function(){
                                            goalPush('filter_click');
                                        });
                                    }
                                } catch (error) {
                                }
                            }
                        }, 100);
                    setTimeout(function(){
                        clearInterval(interval);
                    }, 10000);

                    // var _filterTab = document.querySelector('#tabFilter-label'),
                    //     _filterLabel = _filterTab.querySelector('strong').innerHTML;

                    // if(_filterLabel.indexOf('(0)') === -1 && _filterLabel.indexOf('>0<') === -1) {
                    //     goalPush('filter_genutzt');
                    // }
                    // _filterTab.addEventListener('click', function(){
                    //     goalPush('filter_click');
                    // });
                }
                catch(e) {
                    goalPush('error_setup');
                    goalPush('error_setup1a');
                }

                try {
                    var sortButton = document.querySelector('#tabSort-label'), //desktop__sort
                        interval2 = setInterval(function(){
                            if(typeof sortButton !== "undefined" && sortButton !== null){
                                clearInterval(interval2);
                                try {
                                    sortButton.addEventListener('click', function(){
                                        goalPush('cat_click_sort');
                                    });
                                } catch (e) {
                                }
                            }
                        }, 100);
                    setTimeout(function(){
                        clearInterval(interval2);
                    }, 10000);
                    // document.querySelector('#tabSort-label').addEventListener('click', function(){
                    //     goalPush('cat_click_sort');
                    // });
                }
                catch(e) {
                    goalPush('error_setup');
                    goalPush('error_setup2a');
                }
            });

        }else if(URL.indexOf("/de/cart") !== -1){
            // Warenkorb
            goalPush('page_cart');

            document.addEventListener('click', function(e){
                var _target = e.target;

                if(_target.closest('#hessnaturVoucherForm .quickadd__button')) {
                    // send on next pageview
                    window.iridion.push(['goal', 'aktionscode', '', true]);
                }
                else if(_target.closest('.js-entry-edit-save')) {
                    goalPush("nutzeEinstellungen", true);
                }
            });

        }else if(URL.indexOf("/register/guest-update") !== -1){
            
            // Gast Regestrierung
            goalPush('page_guest');
        }else if(URL.indexOf("/register") !== -1){

            // Neukunde Regestrierung
            goalPush('page_reg');
        }else if(URL.indexOf("/login") !== -1){

            // Login Regestrierung
            goalPush('page_signin');
    
            var wa_loginButtonInterval = setInterval(function(){
                var $wa_loginButton = window.document.querySelector("#loginForm .text-right .button");
                if($wa_loginButton){
                    clearInterval(wa_loginButtonInterval);
                    $wa_loginButton.addEventListener("click",function(){
                        goalPush('page_login');
                    });
                }
            },100);

            setTimeout(function(){
                clearInterval(wa_loginButtonInterval);
            }, 5000);

        } else if (URL.indexOf("/merkzettel") !== -1) {
            // Merkzettel
            goalPush('click_merken');
            
        } else if(URL.indexOf("/addresses/add-delivery-address") !== -1){
            // Adresse
            goalPush('page_address');
            
        }else if(URL.indexOf("/payment/add-payment-method") !== -1){
            // Bezahungsart
            goalPush('page_pay');

        }else if(URL.indexOf("/search") !== -1){
            // Suchergebnissseite
            goalPush('page_suche');
            
        }else if(URL.indexOf("/summary") !== -1){
            // Zusammenfassung
            goalPush('page_sum');
            
            try{            	
                docReady(function(){
                    var zahlart = window.document.querySelectorAll('#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner');
                    
                    if(	zahlart.length !== 0 && zahlart[0].textContent.trim().toLowerCase().indexOf('rechnung') !== -1){
                        window.localStorage.setItem("kk_buytype","rechnung");
                        setProfileValue('kk_buytype', 'rechnung');
                        // document.querySelector('button.success').addEventListener('click', function(){
                        // 	window.iridion.push(["segment", "32785"]);
                        // });
                    }
                });
            } catch(error){
                goalPush('error_setup');
                goalPush('error_setup3');
            }

        }else if(URL.indexOf("/checkout/orderConfirmation") !== -1){
            // Danke
            goalPush('page_conv');

            // Für PS01
            window.localStorage.setItem("kk_hasbought", true);

            // Für Sprint8 und Sprint12
            window.localStorage.removeItem('kk_upsell_hide');
    
            // Revenue
            var wa_interval = setInterval(function(){

                try {
                    if(typeof window.emospro !== "undefined"){

                        var wa_price = 0,
                            wa_buyid = "";
    
                        if(window.emospro.billing && window.emospro.billing.length > 3){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.billing[3];
                            wa_buyid = window.emospro.billing[0];
                        }
                        if(wa_price === 0 && window.emospro.ec_Event && window.emospro.ec_Event.length > 0){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.ec_Event[0].price;
                        }
    
                        if(parseInt(wa_price) !== 0){
                            window.iridion.push(["revenue", wa_price, wa_buyid]);
                        }else{
                            goalPush('error_revenue');
                        }
                    }
                } catch (error) {
                    // console.log(error);
                    goalPush('error_revenue');
                }
            }, 100);

            setTimeout(function(){
                clearInterval(wa_interval);
            }, 3000);

            if(window.localStorage.getItem("kk_buytype") === "rechnung"){
                window.iridion.push(["segment", "32785"]);
                window.localStorage.removeItem("kk_buytype");

                setProfileValue("kk_buytype", "false");
            }

            setProfileValue('hasbought', 'true');
        }

        // TODO hochladen und testen
        
        // Wenn ein User über einen Newsletter kommt wird er mit diesem Cookie markiert
        if(
            window.document.location.search.indexOf("layer=") !== -1 ||
            location.pathname === "/de/newsletter/doi/einstellungen"            // MV, 30.06.2021
        ){
            window.document.cookie = "kk_newsletter=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/";
        }

        docReady(function(){
            try {
                var breadcrumbs = document.querySelectorAll('.breadcrumbs *'),
                breadcrumbsCount = breadcrumbs.length;

                for(var b=0; b < breadcrumbsCount; b++) {
                    breadcrumbs[b].addEventListener('click', function(){
                        goalPush('breadcrumb');
                    });
                }

                var burgerMenuToggle = document.querySelector('a[data-toggle="offCanvasLeft"]');
                if(burgerMenuToggle) {
                    document.querySelector('a[data-toggle="offCanvasLeft"]').addEventListener('click', function(){
                        goalPush('burgermenu');
                    });
                }
            }
            catch(e) {
                goalPush('error_setup');
                goalPush('error_setup4');
            }
        });

        if(window.localStorage.getItem("kk_hasbought")){
            setProfileValue('hasbought', 'true');
        }

    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
        goalPush('error_setup5');
    }

    try {

        var _ref = window.document.referrer,
            _location = window.document.location,
            _cookie = window.document.cookie;

        if(_ref.indexOf(".google.") !== -1 || _ref.indexOf(".bing.") !== -1){
            // Referrer - Suchmaschine
            setSegment(32804);
        }else if(_ref.indexOf(".facebook.") !== -1 || _ref.indexOf(".instagram.") !== -1){
            // Referrer - Social Media
            setSegment(32805);
        }else if(_ref.indexOf(".hessnatur.com/magazin/") !== -1){
            // Referrer - Magazin
            setSegment(32806);
        }

        if(_location.pathname.indexOf("/newsletter/doi/einstellungen") !== -1 || _location.search.indexOf("?newsletter=") !== -1){
            // Referrer - Newsletter
            setSegment(32803);
        }

        docReady(function(){
            var _recos = window.document.querySelectorAll('.js-product-reference[data-componentid="CrossSellingEconda"] .item__image');

            // Klick auf sämtliche Recos
            for (var i = 0; i < _recos.length; i++) {
                _recos[i].addEventListener('click', function(){
                    setSegment(32802);
                });
            }
        });

        if(_cookie.indexOf("kk_visitor_firstsession") === -1){

            // 14400000 Milisekunden entspricht 4h - 4h nach Erstbesuch wird der Benutzer automatisch zum "Wiederkehrer"
            if(_cookie.indexOf("kk_visitor_returning") === -1){
                
                // Segment - Neukunde
                setSegment(32800);

                window.document.cookie = "kk_visitor_firstsession="+new Date()+";domain=.hessnatur.com;path=/";
                window.document.cookie = "kk_visitor_returning=true;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2025 12:00:00 UTC";
                
            } else {
                // Segment - Wiederkehrer
                setSegment(32801);
                // Segment entfernen da kein Neukunde mehr
                removeSegment(32800);
            }
        } else {
            if(!(new Date() - new Date(getCookie("kk_visitor_firstsession")) < 14400000)){ //14400000
                window.document.cookie = "kk_visitor_firstsession=false;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2000 12:00:00 UTC";
            }
        }
    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
        goalPush('error_setup6');
    }
})(window);


// !function(){if(-1!==document.URL.indexOf("//sf.acc.hess-webshop-dev-760c.gcp.get-cloud.io"))try{var e=localStorage.getItem("ucSettings"),t=function(e){window.localStorage.setItem("ucIridionConsent",e),window.iridion.push(["consent",{cookies:e,profile:e,tracking:e}])};if(e)for(var n in e=JSON.parse(e)){var o=e[n].ucConsents,r=o.consentTemplates,i=o.consents;for(var a in r)for(var c in r[a])if("Iridion"===r[a][c].dataProcessor)for(var s=0;s<i.length;s++)if(i[s].templateId===a){var d=window.localStorage.ucIridionConsent;return i[s].consentStatus?(void 0!==d&&"false"!==window.localStorage.ucIridionConsent||t(!0),!0):(void 0!==d&&"true"!==d||t(!1),!1)}}}catch(e){console.log(e)}else window.iridion.push(["consent",{cookies:!0,profile:!0,tracking:!0}])}(),window.iridion.tracking=window.controllerName||window.document.location.pathname,window.iridion.econda=window.iridion.econda||[],window.iridion.econda=function(e){"use strict";var t=[],n=!1;function o(){e.iridion=e.iridion||[],e.iridion.push(["goal","error_econda"])}function r(){try{for(var n=0;n<t.length;n++)-1!==document.cookie.indexOf("iridion_user")&&e.emos3.send(t[n]);t=[]}catch(e){o()}}function i(){return void 0!==e.emos3&&"function"==typeof e.emos3.send&&(n=!0,!0)}if(i())r();else var a=e.setInterval((function(){i()&&(clearInterval(a),r())}),20);return{push:function(e){try{t.push({type:"event",abtest:[e]}),n&&r()}catch(e){o()}}}}(window),function(e){function t(t){e.iridion.push(["goal",t])}function n(e){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?e():document.addEventListener("DOMContentLoaded",e)}function o(e){for(var t=document.cookie.split(";"),n=0;n<t.length;n++)if(t[n].substr(0,t[n].indexOf("=")).replace(/^\s+|\s+$/g,"")===e)return decodeURIComponent(t[n].substr(t[n].indexOf("=")+1))}function r(t){e.iridion.push(["segment",String(t)])}function i(t,n){e.iridion.push(["profile","setValue",t,n])}Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null});try{var a=o("iridion_user");a&&-1!==a.indexOf("1521023056101454")&&(e.document.cookie="iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/")}catch(e){}try{var c=document.URL,s=e.location.pathname;if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(c))t("page_home");else if(-1!==c.indexOf("/p/")){t("page_pds");var d=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(e,n,o,r,i){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==n.indexOf("https://www.hessnatur.com/de/cart/add")&&t("click_addToCart")}),!1),d.call(this,e,n,o,r,i)}}else if("/de/NEU"===s||"/de/damen"===s||"/de/herren"===s||"/de/outdoor"===s||"/de/baby"===s||"/de/home"===s||"/de/sale"===s)t("page_lp_cat"),-1!==s.indexOf("damen")?i("categoryAffinity","damen"):-1!==s.indexOf("herren")&&i("categoryAffinity","herren");else if(-1!==c.indexOf("/c/"))t("page_cat"),n((function(){try{var e=document.querySelector("#tabFilter-label"),n=setInterval((function(){if(void 0!==e){clearInterval(n);try{var o=e.querySelector("strong");void 0!==o&&(-1===o.innerHTML.indexOf("(0)")&&-1===o.innerHTML.indexOf(">0<")&&t("filter_genutzt"),e.addEventListener("click",(function(){t("filter_click")})))}catch(e){}}}),100);setTimeout((function(){clearInterval(n)}),1e4)}catch(e){t("error_setup"),t("error_setup1a")}try{var o=document.querySelector("#tabSort-label"),r=setInterval((function(){void 0!==o&&(clearInterval(r),o.addEventListener("click",(function(){t("cat_click_sort")})))}),100);setTimeout((function(){clearInterval(r)}),1e4)}catch(e){t("error_setup"),t("error_setup2a")}}));else if(-1!==c.indexOf("/de/cart"))t("page_cart"),document.addEventListener("click",(function(n){var o=n.target;o.closest("#hessnaturVoucherForm .quickadd__button")?e.iridion.push(["goal","aktionscode","",!0]):o.closest(".js-entry-edit-save")&&t("nutzeEinstellungen")}));else if(-1!==c.indexOf("/register/guest-update"))t("page_guest");else if(-1!==c.indexOf("/register"))t("page_reg");else if(-1!==c.indexOf("/login")){t("page_signin");var l=setInterval((function(){var n=e.document.querySelector("#loginForm .text-right .button");n&&(clearInterval(l),n.addEventListener("click",(function(){t("page_login")})))}),100);setTimeout((function(){clearInterval(l)}),5e3)}else if(-1!==c.indexOf("/merkzettel"))t("click_merken");else if(-1!==c.indexOf("/addresses/add-delivery-address"))t("page_address");else if(-1!==c.indexOf("/payment/add-payment-method"))t("page_pay");else if(-1!==c.indexOf("/search"))t("page_suche");else if(-1!==c.indexOf("/summary")){t("page_sum");try{n((function(){var t=e.document.querySelectorAll("#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner");0!==t.length&&-1!==t[0].textContent.trim().toLowerCase().indexOf("rechnung")&&(e.localStorage.setItem("kk_buytype","rechnung"),i("kk_buytype","rechnung"))}))}catch(e){t("error_setup"),t("error_setup3")}}else if(-1!==c.indexOf("/checkout/orderConfirmation")){t("page_conv"),e.localStorage.setItem("kk_hasbought",!0),e.localStorage.removeItem("kk_upsell_hide");var u=setInterval((function(){try{if(void 0!==e.emospro){var n=0,o="";e.emospro.billing&&e.emospro.billing.length>3&&(clearInterval(u),n=e.emospro.billing[3],o=e.emospro.billing[0]),0===n&&e.emospro.ec_Event&&e.emospro.ec_Event.length>0&&(clearInterval(u),n=e.emospro.ec_Event[0].price),0!==parseInt(n)?e.iridion.push(["revenue",n,o]):t("error_revenue")}}catch(e){t("error_revenue")}}),100);setTimeout((function(){clearInterval(u)}),3e3),"rechnung"===e.localStorage.getItem("kk_buytype")&&(e.iridion.push(["segment","32785"]),e.localStorage.removeItem("kk_buytype"),i("kk_buytype","false")),i("hasbought","true")}-1===e.document.location.search.indexOf("layer=")&&"/de/newsletter/doi/einstellungen"!==location.pathname||(e.document.cookie="kk_newsletter=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/"),n((function(){try{for(var e=document.querySelectorAll(".breadcrumbs *"),n=e.length,o=0;o<n;o++)e[o].addEventListener("click",(function(){t("breadcrumb")}));document.querySelector('a[data-toggle="offCanvasLeft"]')&&document.querySelector('a[data-toggle="offCanvasLeft"]').addEventListener("click",(function(){t("burgermenu")}))}catch(e){t("error_setup"),t("error_setup4")}})),e.localStorage.getItem("kk_hasbought")&&i("hasbought","true")}catch(e){t("error_setup"),t("error_setup5")}try{var f=e.document.referrer,p=e.document.location,m=e.document.cookie;-1!==f.indexOf(".google.")||-1!==f.indexOf(".bing.")?r(32804):-1!==f.indexOf(".facebook.")||-1!==f.indexOf(".instagram.")?r(32805):-1!==f.indexOf(".hessnatur.com/magazin/")&&r(32806),-1===p.pathname.indexOf("/newsletter/doi/einstellungen")&&-1===p.search.indexOf("?newsletter=")||r(32803),n((function(){for(var t=e.document.querySelectorAll('.js-product-reference[data-componentid="CrossSellingEconda"] .item__image'),n=0;n<t.length;n++)t[n].addEventListener("click",(function(){r(32802)}))})),-1===m.indexOf("kk_visitor_firstsession")?-1===m.indexOf("kk_visitor_returning")?(r(32800),e.document.cookie="kk_visitor_firstsession="+new Date+";domain=.hessnatur.com;path=/",e.document.cookie="kk_visitor_returning=true;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2025 12:00:00 UTC"):(r(32801),g=32800,e.iridion.push(["removeSegment",String(g)])):new Date-new Date(o("kk_visitor_firstsession"))<144e5||(e.document.cookie="kk_visitor_firstsession=false;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2000 12:00:00 UTC")}catch(e){t("error_setup"),t("error_setup6")}var g}(window);