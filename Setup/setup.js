/*jshint loopfunc: true */
(function(window){

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

    // check for crazy user and disable iridion
    try {

        var userCookie = getCookie('iridion_user');

        if(userCookie && userCookie.indexOf('1521023056101454') !== -1) {

            window.document.cookie = "iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/";
        }
    } catch(e){}
    
    try {

        var URL = document.URL;

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
            URL.indexOf("/de/damen") !== -1 ||
            URL.indexOf("/de/herren") !== -1 ||
            URL.indexOf("/de/baby") !== -1 ||
            URL.indexOf("/de/home") !== -1 ||
            URL.indexOf("/de/sale") !== -1
        ){

            // Kategorie
            goalPush('page_cat');

            docReady(function(){
                try {
                    var _filterTab = document.querySelector('#tabFilter-label'),
                    _filterLabel = _filterTab.querySelector('strong').innerHTML;
                    if(_filterLabel.indexOf('(0)') === -1 && _filterLabel.indexOf('>0<') === -1) {
                        goalPush('filter_genutzt');
                    }
                    _filterTab.addEventListener('click', function(){
                        goalPush('filter_click');
                    });
                }
                catch(e) {
                    goalPush('error_setup');
                }

                try {
                    document.querySelector('#tabSort-label').addEventListener('click', function(){
                        goalPush('cat_click_sort');
                    });
                }
                catch(e) {
                    goalPush('error_setup');
                }
            });

        }else if(URL.indexOf("/de/cart") !== -1){

            // Warenkorb
            goalPush('page_cart');
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
            
        }else if(URL.indexOf("/summary") !== -1){
            // Zusammenfassung
            goalPush('page_sum');
            
            try{            	
            	docReady(function(){
            		var zahlart = window.document.querySelectorAll('#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner');
            		
            		if(	zahlart.length !== 0 && zahlart[0].textContent.trim().toLowerCase().indexOf('rechnung') !== -1){
                        window.localStorage.setItem("kk_buytype","rechnung");
            			// document.querySelector('button.success').addEventListener('click', function(){
            			// 	window.iridion.push(["segment", "32785"]);
                        // });
            		}
            	});
            } catch(error){
                goalPush('error_setup');
            }

        }else if(URL.indexOf("/checkout/orderConfirmation") !== -1){
            // Danke
            goalPush('page_conv');
    
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
            }
        }

        // TODO hochladen und testen
        
        // Wenn ein User über einen Newsletter kommt wird er mit diesem Cookie markiert
        if(window.document.location.search.indexOf("layer=") !== -1){
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
            }
        });
    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
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

            if(_cookie.indexOf("kk_visitor_returning") === -1){

                // Segment - Neukunde
                setSegment(32800);

                window.document.cookie = "kk_visitor_firstsession=true;domain=.hessnatur.com;path=/";
                window.document.cookie = "kk_visitor_returning=true;domain=.hessnatur.com;path=/;expires=Thu, 18 Dec 2025 12:00:00 UTC";
                
            }else{
                // Segment - Wiederkehrer
                setSegment(32801);

                // Segment entfernen da kein Neukunde mehr
                removeSegment(32800);
            }
        }

    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
    }

})(window);



// Backup 05.08.19:
//!function(e){function t(t){e.iridion.push(["goal",t])}function n(e){(document.attachEvent?"complete"===document.readyState:"loading"!==document.readyState)?e():document.addEventListener("DOMContentLoaded",e)}try{var r=function(e){for(var t=document.cookie.split(";"),n=0;n<t.length;n++)if(t[n].substr(0,t[n].indexOf("=")).replace(/^\s+|\s+$/g,"")===e)return decodeURIComponent(t[n].substr(t[n].indexOf("=")+1))}("iridion_user");r&&-1!==r.indexOf("1521023056101454")&&(e.document.cookie="iridion_exclude=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; domain=.hessnatur.com; path=/")}catch(e){}try{var o=document.URL;if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(o))t("page_home");else if(-1!==o.indexOf("/p/")){t("page_pds");var i=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(e,n,r,o,a){this.addEventListener("loadend",function(){4===this.readyState&&-1!==n.indexOf("https://www.hessnatur.com/de/cart/add")&&t("click_addToCart")},false),i.call(this,e,n,r,o,a)}}else if(-1!==o.indexOf("/de/damen")||-1!==o.indexOf("/de/herren")||-1!==o.indexOf("/de/baby")||-1!==o.indexOf("/de/home")||-1!==o.indexOf("/de/sale"))t("page_cat"),n(function(){try{var e=document.querySelector("#tabFilter-label"),n=e.querySelector("strong").innerHTML;-1===n.indexOf("(0)")&&-1===n.indexOf(">0<")&&t("filter_genutzt"),e.addEventListener("click",function(){t("filter_click")})}catch(e){t("error_setup")}try{document.querySelector("#tabSort-label").addEventListener("click",function(){t("cat_click_sort")})}catch(e){t("error_setup")}});else if(-1!==o.indexOf("/de/cart"))t("page_cart");else if(-1!==o.indexOf("/register/guest-update"))t("page_guest");else if(-1!==o.indexOf("/register"))t("page_reg");else if(-1!==o.indexOf("/login")){t("page_signin");var a=setInterval(function(){var n=e.document.querySelector("#loginForm .text-right .button");n&&(clearInterval(a),n.addEventListener("click",function(){t("page_login")}))},100);setTimeout(function(){clearInterval(a)},5e3)}else if(-1!==o.indexOf("/merkzettel"))t("click_merken");else if(-1!==o.indexOf("/addresses/add-delivery-address"))t("page_address");else if(-1!==o.indexOf("/payment/add-payment-method"))t("page_pay");else if(-1!==o.indexOf("/summary")){t("page_sum");try{n(function(){var t=e.document.querySelectorAll("#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner");0!==t.length&&-1!==t[0].textContent.trim().toLowerCase().indexOf("rechnung")&&e.localStorage.setItem("kk_buytype","rechnung")})}catch(e){t("error_setup")}}else if(-1!==o.indexOf("/checkout/orderConfirmation")){t("page_conv");var c=setInterval(function(){try{if("undefined"!=typeof e.emospro){var n=0,r="";e.emospro.billing&&e.emospro.billing.length>3&&(clearInterval(c),n=e.emospro.billing[3],r=e.emospro.billing[0]),0===n&&e.emospro.ec_Event&&e.emospro.ec_Event.length>0&&(clearInterval(c),n=e.emospro.ec_Event[0].price),0!==parseInt(n)?e.iridion.push(["revenue",n,r]):t("error_revenue")}}catch(e){t("error_revenue")}},100);setTimeout(function(){clearInterval(c)},3e3),"rechnung"===e.localStorage.getItem("kk_buytype")&&(e.iridion.push(["segment","32785"]),e.localStorage.removeItem("kk_buytype"))}-1!==e.document.location.search.indexOf("layer=")&&(e.document.cookie="kk_newsletter=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/"),n(function(){try{for(var e=document.querySelectorAll(".breadcrumbs *"),n=e.length,r=0;r<n;r++)e[r].addEventListener("click",function(){t("breadcrumb")});document.querySelector('a[data-toggle="offCanvasLeft"]')&&document.querySelector('a[data-toggle="offCanvasLeft"]').addEventListener("click",function(){t("burgermenu")})}catch(e){t("error_setup")}})}catch(e){t("error_setup")}}(window);