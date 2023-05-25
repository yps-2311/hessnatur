(function(){

    /**
     * Iridion Consent Check
     */
    // if(document.URL.indexOf('//sf.acc.hess-webshop-dev-760c.gcp.get-cloud.io') !== -1){

        

        // if(localStorage.getItem("kk_development") === "true"){
            
        try {
            // var ucSettings = localStorage.getItem('ucSettings');
            var setIridionConsent = function(value){
                if(typeof window.iridion !== "undefined"){
                    window.localStorage.setItem("ucIridionConsent", value);
                    window.iridion.push(["consent", {
                        "cookies": value,
                        "profile": value,
                        "tracking": value
                    }]);
                }
            }

            // NEU

            // consent status changed
            window.addEventListener('whenConsentLoaded', function(e){

                // find the data from content event
                var consentData = typeof e.data !== "undefined" ? e.data : e.detail,
                    consentEvent = consentData.event;

                if (consentEvent === 'consent_changed' || consentEvent === 'consents_initialized' || consentEvent === 'consent_changed Iridion' || consentEvent === 'consent_status') {

                    var iridionConsent = consentData['Iridion'];

                    // If iridion consent is changed or init AND consent was change the status to before
                    if(typeof iridionConsent !== "undefined" && window.localStorage.getItem("ucIridionConsent") !== String(iridionConsent)){
                        // true
                        if(iridionConsent){
                                                        
                            setIridionConsent(true);

                        // false
                        } else {

                            setIridionConsent(false);
                        }
                    }
                }
                    
                // }
            });
            // END NEU

        } catch(e){
            console.log("Consent: ",e);
        }

        // }else{
        //     try {

        //         // ALT
        //         if(ucSettings){
                
        //             ucSettings = JSON.parse(ucSettings);
    
        //             for(var containerId in ucSettings){
    
        //                 var ucConsents  = ucSettings[containerId].ucConsents;
        //                 var templates   = ucConsents.consentTemplates;
        //                 var consents    = ucConsents.consents;
            
        //                 for(var key in templates){
    
        //                     for(var version in templates[key]){
            
        //                         // get the template id out of the uc templates
        //                         if(templates[key][version].dataProcessor === "Iridion"){
            
        //                             // get the current consent status
        //                             for(var i = 0; i < consents.length; i++){
        //                                 if(consents[i].templateId === key){
    
        //                                     var iridionConsentStatus = window.localStorage.ucIridionConsent;
                                            
        //                                     if(!consents[i].consentStatus){
    
        //                                         if(iridionConsentStatus === undefined || iridionConsentStatus === "true"){
        //                                             setIridionConsent(false);
        //                                         }
    
        //                                         return false;
        //                                     }
    
        //                                     if(iridionConsentStatus === undefined || window.localStorage.ucIridionConsent === "false"){
        //                                         setIridionConsent(true);
        //                                     }
                                            
        //                                     return true;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }

        //         }
        //         // END ALT
    
        //     } catch(e){
        //         console.log("Consent ALT: ",e);
        //     }
        // }




            
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
            // for(var i = 0; i < data.length; i++){
            //     // check for consent
            //     if(document.cookie.indexOf('iridion_user') !== -1){
            //         console.log("Econda send old: ", data[i]);
            //         window.emos3.send(data[i]);
            //     }
            // }
            
            for(var i = 0; i < data.length; i++){

                // DL 26.01.2022
                var testAndVariation = data[i].abtest[0][0]+data[i].abtest[0][1];
                
                // check for consent
                if(document.cookie.indexOf('iridion_user') !== -1 && 
                   !window.sessionStorage.getItem('kk_'+testAndVariation)){ // DL 26.01.2022

                    window.emos3.send(data[i]);

                    // DL 26.01.2022
                    window.sessionStorage.setItem('kk_'+testAndVariation, true);
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
        // Added by DL 25.05.2023 integration old new system
        try {
            if(typeof window.kkiridionhook === "function"){
                window.kkiridionhook(key);
            }
        } catch (error) {
            console.log('Error: ', error);
        }
        // end
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

    // JH 05.12.2022  for AB 8.5
    function deleteCookie( name, path, domain ) {
        if( getCookie( name ) ) {
          document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
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

    // added DL, 27.09.21
    function getProfileValue(key) {
        return window.iridion.push(['profile', 'getValue', key]);
    }

    // check for crazy user and disable iridion
    try {

        var userCookie = getCookie('iridion_user');

        if(userCookie && userCookie.indexOf('1521023056101454') !== -1) {

            window.document.cookie = "iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/";
        }
    } catch(e){}



    try {
        if(!getCookie('iridion_session_lp')) {
            var pathNameURL = window.location.pathname;
            window.document.cookie = "iridion_session_lp="+pathNameURL+"; domain=.hessnatur.com; path=/";

            if(pathNameURL.indexOf("/p/") !== -1){
                setSegment(32897);
            }else{
                removeSegment(32897);
            }
        }
    } catch(e){
    }
    
    
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

                    if(this.readyState === 4 && uri.indexOf("/cart/add") !== -1){

                        goalPush('click_addToCart');

                        // added DL, 27.09.21
                        try {
                            if(!!document.querySelector('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg"]')){

                                var isOtherNewProductsIsCart = getProfileValue('newItemsInCart'),
                                    thisProductID = document.location.pathname.split("/p/")[1].substring(0,5);

                                if(isOtherNewProductsIsCart && isOtherNewProductsIsCart.length > 0 && isOtherNewProductsIsCart !== "[]"){
                                    isOtherNewProductsIsCart = isOtherNewProductsIsCart;
                                }else{
                                    isOtherNewProductsIsCart = [];
                                }

                                isOtherNewProductsIsCart.push(thisProductID);

                                setProfileValue('newItemsInCart', isOtherNewProductsIsCart);
                            }
                        } catch (error) {
                            console.log('Error: ', error);
                        }

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

        }else if(URL.indexOf("/cart") !== -1){
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

        }else if(URL.indexOf("/newsletter/registrierung/fast-geschafft") !== -1){
            
            // Neukunde Anmeldung (vor dem Douple-Opt-In) - NEU von DL 11.10.21
            goalPush('page_newsletter_registration');

        }else if(URL.indexOf("/newsletter/abmeldung") !== -1){

            // PageView: Newsletter Abmeldung - NEU von DL 27.09.21
            goalPush('page_newsletter_deregistration');

        }else if(URL.indexOf("/newsletter/doi/einstellungen") !== -1){

            // PageView: Douple-Opt-In akzeptiert - NEU von DL 27.09.21
            goalPush('page_newsletter_success');
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
    
                        if(typeof window.emospro.billing !== "undefined" && window.emospro.billing.length > 3){
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

                         // added DL, 27.09.21
                        try {
                            var productsBuyed = window.emospro.ec_Event,
                                productsNew = getProfileValue('newItemsInCart');

                            if(productsNew){
                                productsNew = productsNew;

                                for (var j = 0; j < productsBuyed.length; j++) {
                                    for (var k = 0; k < productsNew.length; k++) {
                                        if(productsBuyed[j].sku.indexOf(productsNew[k]) !== -1){
                                            console.log("product is new");
                                            goalPush('buyed_new_product');
                                            setProfileValue('newItemsInCart', []);
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            console.log('Error: ', error);
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

            
            //JH. 05.12.2022  Remove exlcude cookie on tankyou page for AB 8.5
            try {
                deleteCookie('kk_upsell_hide', '/', '.hessnatur.com');
            } catch(err) {
                pushErrorLog(err);
            }

        }
        
        // Wenn ein User über einen Newsletter kommt wird er mit diesem Cookie markiert
        if(window.document.location.search.indexOf("layer=") !== -1 ||
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

// BKP 05.12.2022 !function(){try{var e=function(e){void 0!==window.iridion&&(window.localStorage.setItem("ucIridionConsent",e),window.iridion.push(["consent",{cookies:e,profile:e,tracking:e}]))};window.addEventListener("whenConsentLoaded",(function(t){var n=void 0!==t.data?t.data:t.detail,o=n.event;if("consent_changed"===o||"consents_initialized"===o||"consent_changed Iridion"===o||"consent_status"===o){var r=n.Iridion;void 0!==r&&window.localStorage.getItem("ucIridionConsent")!==String(r)&&e(!!r)}}))}catch(e){console.log("Consent: ",e)}}(),window.iridion.tracking=window.controllerName||window.document.location.pathname,window.iridion.econda=window.iridion.econda||[],window.iridion.econda=function(e){"use strict";var t=[],n=!1;function o(){e.iridion=e.iridion||[],e.iridion.push(["goal","error_econda"])}function r(){try{for(var n=0;n<t.length;n++){var r=t[n].abtest[0][0]+t[n].abtest[0][1];-1===document.cookie.indexOf("iridion_user")||e.sessionStorage.getItem("kk_"+r)||(e.emos3.send(t[n]),e.sessionStorage.setItem("kk_"+r,!0))}t=[]}catch(e){o()}}function i(){return void 0!==e.emos3&&"function"==typeof e.emos3.send&&(n=!0,!0)}if(i())r();else var a=e.setInterval((function(){i()&&(clearInterval(a),r())}),20);return{push:function(e){try{t.push({type:"event",abtest:[e]}),n&&r()}catch(e){o()}}}}(window),function(e){function t(t){e.iridion.push(["goal",t])}function n(e){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?e():document.addEventListener("DOMContentLoaded",e)}function o(e){for(var t=document.cookie.split(";"),n=0;n<t.length;n++)if(t[n].substr(0,t[n].indexOf("=")).replace(/^\s+|\s+$/g,"")===e)return decodeURIComponent(t[n].substr(t[n].indexOf("=")+1))}function r(t){e.iridion.push(["segment",String(t)])}function i(t){e.iridion.push(["removeSegment",String(t)])}function a(t,n){e.iridion.push(["profile","setValue",t,n])}function s(t){return e.iridion.push(["profile","getValue",t])}Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null});try{var c=o("iridion_user");c&&-1!==c.indexOf("1521023056101454")&&(e.document.cookie="iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/")}catch(e){}try{if(!o("iridion_session_lp")){var d=e.location.pathname;e.document.cookie="iridion_session_lp="+d+"; domain=.hessnatur.com; path=/",-1!==d.indexOf("/p/")?r(32897):i(32897)}}catch(e){}try{var l=document.URL;d=e.location.pathname;if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(l))t("page_home");else if(-1!==l.indexOf("/p/")){t("page_pds");var u=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(e,n,o,r,i){this.addEventListener("loadend",(function(){if(4===this.readyState&&-1!==n.indexOf("/cart/add")){t("click_addToCart");try{if(document.querySelector('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg"]')){var e=s("newItemsInCart"),o=document.location.pathname.split("/p/")[1].substring(0,5);(e=e&&e.length>0&&"[]"!==e?e:[]).push(o),a("newItemsInCart",e)}}catch(e){console.log("Error: ",e)}}}),!1),u.call(this,e,n,o,r,i)}}else if("/de/NEU"===d||"/de/damen"===d||"/de/herren"===d||"/de/outdoor"===d||"/de/baby"===d||"/de/home"===d||"/de/sale"===d)t("page_lp_cat"),-1!==d.indexOf("damen")?a("categoryAffinity","damen"):-1!==d.indexOf("herren")&&a("categoryAffinity","herren");else if(-1!==l.indexOf("/c/"))t("page_cat"),n((function(){try{var e=document.querySelector("#tabFilter-label"),n=setInterval((function(){if(void 0!==e){clearInterval(n);try{var o=e.querySelector("strong");void 0!==o&&(-1===o.innerHTML.indexOf("(0)")&&-1===o.innerHTML.indexOf(">0<")&&t("filter_genutzt"),e.addEventListener("click",(function(){t("filter_click")})))}catch(e){}}}),100);setTimeout((function(){clearInterval(n)}),1e4)}catch(e){t("error_setup"),t("error_setup1a")}try{var o=document.querySelector("#tabSort-label"),r=setInterval((function(){if(null!=o){clearInterval(r);try{o.addEventListener("click",(function(){t("cat_click_sort")}))}catch(e){}}}),100);setTimeout((function(){clearInterval(r)}),1e4)}catch(e){t("error_setup"),t("error_setup2a")}}));else if(-1!==l.indexOf("/cart"))t("page_cart"),document.addEventListener("click",(function(n){var o=n.target;o.closest("#hessnaturVoucherForm .quickadd__button")?e.iridion.push(["goal","aktionscode","",!0]):o.closest(".js-entry-edit-save")&&t("nutzeEinstellungen")}));else if(-1!==l.indexOf("/register/guest-update"))t("page_guest");else if(-1!==l.indexOf("/register"))t("page_reg");else if(-1!==l.indexOf("/newsletter/registrierung/fast-geschafft"))t("page_newsletter_registration");else if(-1!==l.indexOf("/newsletter/abmeldung"))t("page_newsletter_deregistration");else if(-1!==l.indexOf("/newsletter/doi/einstellungen"))t("page_newsletter_success");else if(-1!==l.indexOf("/login")){t("page_signin");var f=setInterval((function(){var n=e.document.querySelector("#loginForm .text-right .button");n&&(clearInterval(f),n.addEventListener("click",(function(){t("page_login")})))}),100);setTimeout((function(){clearInterval(f)}),5e3)}else if(-1!==l.indexOf("/merkzettel"))t("click_merken");else if(-1!==l.indexOf("/addresses/add-delivery-address"))t("page_address");else if(-1!==l.indexOf("/payment/add-payment-method"))t("page_pay");else if(-1!==l.indexOf("/search"))t("page_suche");else if(-1!==l.indexOf("/summary")){t("page_sum");try{n((function(){var t=e.document.querySelectorAll("#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner");0!==t.length&&-1!==t[0].textContent.trim().toLowerCase().indexOf("rechnung")&&(e.localStorage.setItem("kk_buytype","rechnung"),a("kk_buytype","rechnung"))}))}catch(e){t("error_setup"),t("error_setup3")}}else if(-1!==l.indexOf("/checkout/orderConfirmation")){t("page_conv"),e.localStorage.setItem("kk_hasbought",!0),e.localStorage.removeItem("kk_upsell_hide");var m=setInterval((function(){try{if(void 0!==e.emospro){var n=0,o="";void 0!==e.emospro.billing&&e.emospro.billing.length>3&&(clearInterval(m),n=e.emospro.billing[3],o=e.emospro.billing[0]),0===n&&e.emospro.ec_Event&&e.emospro.ec_Event.length>0&&(clearInterval(m),n=e.emospro.ec_Event[0].price),0!==parseInt(n)?e.iridion.push(["revenue",n,o]):t("error_revenue");try{var r=e.emospro.ec_Event,i=s("newItemsInCart");if(i){i=i;for(var c=0;c<r.length;c++)for(var d=0;d<i.length;d++)-1!==r[c].sku.indexOf(i[d])&&(console.log("product is new"),t("buyed_new_product"),a("newItemsInCart",[]))}}catch(e){console.log("Error: ",e)}}}catch(e){t("error_revenue")}}),100);setTimeout((function(){clearInterval(m)}),3e3),"rechnung"===e.localStorage.getItem("kk_buytype")&&(e.iridion.push(["segment","32785"]),e.localStorage.removeItem("kk_buytype"),a("kk_buytype","false")),a("hasbought","true")}-1===e.document.location.search.indexOf("layer=")&&"/de/newsletter/doi/einstellungen"!==location.pathname||(e.document.cookie="kk_newsletter=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/"),n((function(){try{for(var e=document.querySelectorAll(".breadcrumbs *"),n=e.length,o=0;o<n;o++)e[o].addEventListener("click",(function(){t("breadcrumb")}));document.querySelector('a[data-toggle="offCanvasLeft"]')&&document.querySelector('a[data-toggle="offCanvasLeft"]').addEventListener("click",(function(){t("burgermenu")}))}catch(e){t("error_setup"),t("error_setup4")}})),e.localStorage.getItem("kk_hasbought")&&a("hasbought","true")}catch(e){t("error_setup"),t("error_setup5")}try{var p=e.document.referrer,g=e.document.location,h=e.document.cookie;-1!==p.indexOf(".google.")||-1!==p.indexOf(".bing.")?r(32804):-1!==p.indexOf(".facebook.")||-1!==p.indexOf(".instagram.")?r(32805):-1!==p.indexOf(".hessnatur.com/magazin/")&&r(32806),-1===g.pathname.indexOf("/newsletter/doi/einstellungen")&&-1===g.search.indexOf("?newsletter=")||r(32803),n((function(){for(var t=e.document.querySelectorAll('.js-product-reference[data-componentid="CrossSellingEconda"] .item__image'),n=0;n<t.length;n++)t[n].addEventListener("click",(function(){r(32802)}))})),-1===h.indexOf("kk_visitor_firstsession")?-1===h.indexOf("kk_visitor_returning")?(r(32800),e.document.cookie="kk_visitor_firstsession="+new Date+";domain=.hessnatur.com;path=/",e.document.cookie="kk_visitor_returning=true;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2025 12:00:00 UTC"):(r(32801),i(32800)):new Date-new Date(o("kk_visitor_firstsession"))<144e5||(e.document.cookie="kk_visitor_firstsession=false;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2000 12:00:00 UTC")}catch(e){t("error_setup"),t("error_setup6")}}(window);