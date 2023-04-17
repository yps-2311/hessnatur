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
        } else if(checkPath('baby') || checkPath('junior')){

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

    // DL 17.04.2023
    function removeSegment(thisID) {
        window.iridion.push(['removeSegment', String(thisID)]);
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

    var CUSTOMERTYPE = getProfileValue("customerType");

    function econdaCall() {
        var counter2 = 0,
            interval2 = setInterval(function(){
                counter2++;
                
                if(typeof window.emos3 !== "undefined" && (typeof window.emos3.emos_vid !== "undefined" || typeof window.emos3.emos_cid !== "undefined")){
                    
                    xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid), function (response) {

                        if (response){
                            if (response.indexOf('Bestandskunde') !== -1){
                                // Bestandskunde
                                setProfileValue("customerType", "Bestandskunde");

                                // DL 17.04.2023 Remove Interessent Segment
                                removeSegment(32854);

                                // DL 17.04.2023 Remove Neukunde Segment
                                removeSegment(32856);

                            } else if (response.indexOf('Neukunde') !== -1 && CUSTOMERTYPE === "Interessent") {
                                // neukunde
                                setProfileValue("customerType", "Neukunde");

                                // DL 17.04.2023 Remove Interessent Segment
                                removeSegment(32854);
                            }
                        }
                    });

                    clearInterval(interval2);

                }else if(counter2 > 100){
                    // Maximal 10 Sek
                    clearInterval(interval2);
                }
            }, 100);
    }

    if(CUSTOMERTYPE !== "Bestandskunde"){
        if(!!CUSTOMERTYPE) {

            if(!sessionStorage.getItem('kk_eCustomerType')){
                sessionStorage.setItem('kk_eCustomerType', 'true');
                econdaCall();
            }

            // Noch nicht hochgeladen
            if(getProfileValue("hasbought") === "true" && CUSTOMERTYPE === "Interessent"){
                setProfileValue("customerType", "Neukunde");
                // DL 17.04.2023 Remove Interessent Segment
                removeSegment(32854);
            }
            
            if(PATHNAME.indexOf("/addresses/") !== -1){

                econdaCall();

            }else if(PATHNAME.indexOf("/checkout/") === -1){

                var counter3 = 0,
                    interval3 = setInterval(function(){
                        counter3++;

                        if(document.querySelector('#myAccountLink[href="/de/my-account"]')){
                            clearInterval(interval3);

                            setProfileValue("customerType", "Neukunde");
                            // DL 17.04.2023 Remove Interessent Segment
                            removeSegment(32854);

                            xhr_get('https://www.hessnatur.com/de/my-account/orders', function(response){
                                try {

                                    if (response){
                                        if(response.split("js_orderHistoryItem-").length > 1){
                                            // bestandskunde, more than 1 order
                                            setProfileValue("customerType", "Bestandskunde");

                                            // DL 17.04.2023 Remove Neukunde Segment
                                            removeSegment(32856);
                                        }
                                    }
                                    
                                } catch (error) {
                                    // console.log('Error: ', error);
                                }
                            });
                            // }
                        }else if(counter3 > 100){
                            // Maximal 10 Sek
                            clearInterval(interval3);
                        }
                    }, 100);
            }
        }else if(CUSTOMERTYPE !== "Interessent" && CUSTOMERTYPE !== "Neukunde"){
            // Interessent
            setProfileValue("customerType", "Interessent");
        }
    }
})(window, document);

// BKP 17.04.2023
// !function(e,t){function n(t,n){if(t)return n?e.iridion.push(["profile","getValue",t,JSON.stringify(n)]):e.iridion.push(["profile","getValue",t])}function r(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onload=function(){if(4===this.readyState&&this.status>=200&&this.status<400)try{t(this.response)}catch(e){t(!1)}else t(!1)},n.onerror=function(){t(!1)},n.send()}function s(t,n){t&&n&&e.iridion.push(["profile","setValue",t,n])}function o(e,t){y&&console.log("kk >>> ",e,t)}function i(t){e.iridion.push(["goal","profile_error",t.toString()])}var a,u=t.URL,c=location.pathname,d="categoryAffinityData",f="categoryAffinity",m={damen:0,herren:0,baby:0,home:0,lastVisit:0},l=["/de/damen","/de/herren","/de/baby","/de/home"],y=-1!==t.cookie.indexOf("iridion_debug=true");try{var h=n(d,m);(!h||h&&h.junior)&&(o("reset data object",m),s(d,m))}catch(e){i(e)}a=function(){try{var e=n(d,m),r=n("visitorSession"),a=n(f,"damen"),y=1,h=function(){function e(e){return-1!==c.indexOf(e)}var n=!1;if(e("damen")?n="damen":e("herren")?n="herren":e("home")?n="home":(e("baby")||e("junior"))&&(n="baby"),!n&&e("/p/")){var r=t.querySelectorAll(".breadcrumbs span");r&&r[1]&&("damen"===(r=r[1].textContent.toLowerCase())?n="damen":"herren"===r?n="herren":"home"===r?n="home":"baby"===r&&(n="baby"))}return n}();if("string"==typeof e&&(e=JSON.parse(e)),0!==e.lastVisit&&e.lastVisit===r.last||(y=2,e.lastVisit=r.last,s(d,e)),o("current category "+h),h){var p=0;if(-1!==u.indexOf("/p/")?p=3:-1!==l.indexOf(c)?p=7:-1!==u.indexOf("/c/")&&(p=5),o("points",p),0!==p){e[h]=e[h]+y*p,s(d,e);var v=e;delete v.lastVisit;var b=Object.keys(v).reduce((function(e,t){return v[e]>v[t]?e:t}),0);o("your best score",b),a!==b&&(o("save new category affinity",b),s(f,b))}}}catch(e){i(e)}},"loading"!=t.readyState?a():t.addEventListener("DOMContentLoaded",a);var p=n("customerType");function v(){var t=0,n=setInterval((function(){t++,void 0===e.emos3||void 0===e.emos3.emos_vid&&void 0===e.emos3.emos_cid?t>100&&clearInterval(n):(r("https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?"+(void 0!==e.emos3.emos_cid?"emcid="+e.emos3.emos_cid:"emvid="+e.emos3.emos_vid),(function(e){e&&(-1!==e.indexOf("Bestandskunde")?s("customerType","Bestandskunde"):-1!==e.indexOf("Neukunde")&&"Interessent"===p&&s("customerType","Neukunde"))})),clearInterval(n))}),100)}if("Bestandskunde"!==p)if(p){if(sessionStorage.getItem("kk_eCustomerType")||(sessionStorage.setItem("kk_eCustomerType","true"),v()),"true"===n("hasbought")&&"Interessent"===p&&s("customerType","Neukunde"),-1!==c.indexOf("/addresses/"))v();else if(-1===c.indexOf("/checkout/"))var b=0,g=setInterval((function(){b++,t.querySelector('#myAccountLink[href="/de/my-account"]')?(clearInterval(g),s("customerType","Neukunde"),r("https://www.hessnatur.com/de/my-account/orders",(function(e){try{e&&e.split("js_orderHistoryItem-").length>1&&s("customerType","Bestandskunde")}catch(e){}}))):b>100&&clearInterval(g)}),100)}else"Interessent"!==p&&"Neukunde"!==p&&s("customerType","Interessent")}(window,document);