(function(window, document){

    // if(document.cookie.indexOf('iridion_debug=true') === -1) return;

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function getProfileValue(key, defaultValue) {
        if(!key) return;

        // TODO refactor
        if(defaultValue){

            // fix escaping string
            return window.iridion.push(['profile', 'getValue', key, JSON.stringify(defaultValue)]);
        } else {

            return window.iridion.push(['profile', 'getValue', key]);
        }
    }
    
    function xhr_get(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = function() {
            if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
                try {
                    callback(this.response);
                }
                catch(e) {
                    callback(false);    
                }
            } else {
                // We reached our target server, but it returned an error
                callback(false);
            }
        };
        
        request.onerror = function() {
            // There was a connection error of some sort
            callback(false);
        };
        // request.withCredentials = true;
        request.send();
    };

    function setProfileValue(key, value) {
        if(!key || !value) return;

        window.iridion.push(['profile', 'setValue', key, value]);
    }

    function getCategory() {

        function checkPath(key) {
            return PATHNAME.indexOf(key) !== -1
        }

        var category = false;

        // TODO refactoring
        if(checkPath('damen')){

            category = 'damen';
        } else if(checkPath('herren')){

            category = 'herren';
        } else if(checkPath('home')){

            category = 'home';
        } else if(checkPath('baby')){

            category = 'baby';
        }

        // product detail page?
        if(!category && checkPath('/p/')){

            var item = document.querySelectorAll('.breadcrumbs span');

            if(item && item[1]){

                item = item[1].textContent.toLowerCase();

                if(item === 'damen'){
    
                    category = 'damen';
                } else if(item === 'herren'){
    
                    category = 'herren';
                } else if(item === 'home'){
    
                    category = 'home';
                } else if(item === 'baby'){
    
                    category = 'baby';
                }
            }
        }

        return category;
    }

    function sendMessage(message, value) {
        if(DEBUG_MODE){
            console.log("kk >>> ", message, value);
        }
    }

    function pushErrorLog(err) {
        window.iridion.push(['goal', 'profile_error', err.toString()]);
    }


    /** CATEGORY AFFINITY **/
    var URL                         = document.URL,
        PATHNAME                    = location.pathname,
        KEY_DATA                    = 'categoryAffinityData',
        KEY_STATUS                  = 'categoryAffinity',
        DEFAULT_CATEGORY_AFFINITY   = {
            damen: 0,
            herren: 0,
            baby: 0,
            home: 0,
            lastVisit: 0
        },
        // MAIN_CATEGORY           = ["/de/NEU", "/de/damen", "/de/herren", "/de/outdoor", "/de/baby", "/de/home", "/de/sale"];
        MAIN_CATEGORY               = ["/de/damen", "/de/herren", "/de/baby", "/de/home"],
        DEBUG_MODE                  = document.cookie.indexOf('iridion_debug=true') !== -1;

    // hotfix data error
    try {

        var checkJuniorKey = getProfileValue(KEY_DATA, DEFAULT_CATEGORY_AFFINITY);

        if(!checkJuniorKey || checkJuniorKey && checkJuniorKey.junior){

            sendMessage("reset data object", DEFAULT_CATEGORY_AFFINITY);
            setProfileValue(KEY_DATA, DEFAULT_CATEGORY_AFFINITY);
        }
    } catch(err) {
        pushErrorLog(err);
    }

    ready(function() {

        try {

            var DATA                        = getProfileValue(KEY_DATA, DEFAULT_CATEGORY_AFFINITY),
                PROFILE_USER_SESSION        = getProfileValue('visitorSession'),
                PROFILE_CATEGORY_AFFINITY   = getProfileValue(KEY_STATUS, 'damen'),
                multiplier                  = 1,
                currentCategory             = getCategory();

            if(typeof DATA === "string"){
                DATA = JSON.parse(DATA);
            }

            if(DATA.lastVisit === 0 || DATA.lastVisit !== PROFILE_USER_SESSION.last) {

                multiplier = 2;
                
                DATA["lastVisit"] = PROFILE_USER_SESSION.last;
                setProfileValue(KEY_DATA, DATA);
            }

            sendMessage("current category " + currentCategory);

            if(currentCategory){

                var points = 0;

                // product detail page
                if(URL.indexOf("/p/") !== -1){
                    
                    points = 3;
                // main category page
                } else if(MAIN_CATEGORY.indexOf(PATHNAME) !== -1){
        
                    points = 7;
                // category page
                } else if(URL.indexOf("/c/") !== -1){
        
                    points = 5;
                }

                sendMessage("points", points);

                if(points !== 0){

                    DATA[currentCategory] = DATA[currentCategory] + (multiplier * points);
                    setProfileValue(KEY_DATA, DATA);

                    var currentData = DATA;
                    delete currentData.lastVisit;

                    var bestValue = Object.keys(currentData).reduce(function(a, b) {
                        return currentData[a] > currentData[b] ? a : b;
                    }, 0);

                    sendMessage("your best score", bestValue);
                    
                    if(PROFILE_CATEGORY_AFFINITY !== bestValue){
                        
                        sendMessage("save new category affinity", bestValue);
                        setProfileValue(KEY_STATUS, bestValue);
                    }
                }
            }
        } catch(err){
            pushErrorLog(err);
        }
    });



    /** Customer Type:
     * 
     * Interessent: Noch nichts gekauft
     * Neukunde: Einmal gekauft
     * Bestandskunde: Mehr als einmal gekauft
     */

    if(window.document.cookie.indexOf("kkprofiletest") !== -1){
        console.log("kkprofiletest");

        var CUSTOMERTYPE = getProfileValue("customerType");
        console.log('CUSTOMERTYPE 12: ', CUSTOMERTYPE);
        console.log('CUSTOMERTYPE !== "Bestandskunde": ', CUSTOMERTYPE !== "Bestandskunde");
        console.log('CUSTOMERTYPE !== "Interessent" && CUSTOMERTYPE !== "Neukunde": ', CUSTOMERTYPE !== "Interessent" && CUSTOMERTYPE !== "Neukunde");

        if(CUSTOMERTYPE !== "Bestandskunde"){
            console.log('!!CUSTOMERTYPE: ', !!CUSTOMERTYPE);
            if(!!CUSTOMERTYPE) {
                if(PATHNAME.indexOf("/my-account") !== -1){
                    var counter = 0,
                        interval = setInterval(function(){
                            counter++;

                            var orders = window.document.querySelectorAll("#orderhistory_ajax .zebra_even > div").length;

                            if(orders > 0){
                                if (orders > 1) {
                                    // bestandskunde, more than 1 order
                                    setProfileValue("customerType", "Bestandskunde");
                                }else if(CUSTOMERTYPE === "Interessent"){
                                    setProfileValue("customerType", "Neukunde");
                                }
                                clearInterval(interval);
                            }else if(counter > 100){
                                // Maximal 10 Sek
                                clearInterval(interval);
                            }
                        }, 100);

                }else if(PATHNAME.indexOf("/addresses/") !== -1){

                    var counter2 = 0,
                        interval2 = setInterval(function(){
                            counter2++;
                            
                            if(typeof window.emos3 !== "undefined" && (typeof window.emos3.emos_vid !== "undefined" || typeof window.emos3.emos_cid !== "undefined")){
                                
                                xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid), function (response) {

                                    console.log('response: ', response);

                                    if (response){
                                        if (response.indexOf('Bestandskunde') !== -1){
                                            // Bestandskunde
                                            setProfileValue("customerType", "Bestandskunde");
                                        } else if (response.indexOf('Neukunde') !== -1 && CUSTOMERTYPE === "Interessent") {
                                            // neukunde
                                            setProfileValue("customerType", "Neukunde");
                                        }
                                    }
                                });

                                clearInterval(interval2);

                            }else if(counter2 > 100){
                                // Maximal 10 Sek
                                clearInterval(interval2);
                            }
                        }, 100);

                }else if(PATHNAME.indexOf("/checkout/") === -1 && window.document.referrer.indexOf("/checkout/") !== -1){
                    console.log("no in checkout");

                    xhr_get('https://www.hessnatur.com/de/my-account/orders', function(response){
                        try {

                            if (response){
                                // neukunde, only 0 or 1 order
                                if (response.split("js_orderHistoryItem-").length < 2) {
                                    // sessionStorage.setItem('kk_targetGroup', 'neukunde');
                                    setProfileValue("customerType", "Neukunde");
    
                                }else {
                                    // bestandskunde, more than 1 order
                                    setProfileValue("customerType", "Bestandskunde");
                                }
                            }
                            
                        } catch (error) {
                            console.log('Error: ', error);
                        }
                    });

                }
        
            }else if(CUSTOMERTYPE !== "Interessent" && CUSTOMERTYPE !== "Neukunde"){
                // Interessent
                setProfileValue("customerType", "Interessent");
            }
        }
    
    }

})(window, document);