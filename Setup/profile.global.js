(function(){

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
        } else if(checkPath('outdoor')){

            category = 'outdoor';
        } else if(checkPath('baby')){

            category = 'baby';
        }

        // product detail page?
        if(!category && checkPath('/p/')){

            var item = document.querySelectorAll('.breadcrumbs span')[1];

            if(item){

                item = item[1].textContent;

                if(item === 'damen'){
    
                    category = 'damen';
                } else if(item === 'herren'){
    
                    category = 'herren';
                } else if(item === 'outdoor'){
    
                    category = 'outdoor';
                } else if(item === 'baby'){
    
                    category = 'baby';
                }
            }
        }

        return category;
    }

    var URL                     = document.URL,
        PATHNAME                = location.pathname,
        KEY_DATA                = 'categoryAffinityData',
        KEY_STATUS              = 'categoryAffinity',
        MAIN_CATEGORY           = ["/de/NEU", "/de/damen", "/de/herren", "/de/outdoor", "/de/baby", "/de/home", "/de/sale"];

    ready(function() {

        try {

            var DATA = getProfileValue(KEY_DATA, {
                    damen: 0,
                    herren: 0,
                    junior: 0,
                    home: 0,
                    lastVisit: 0
                }),
                PROFILE_USER_SESSION = getProfileValue('visitorSession'),
                PROFILE_CATEGORY_AFFINITY = getProfileValue(KEY_STATUS, 'damen'),
                multiplier = 1,
                currentCategory = getCategory();

            if(typeof DATA === "string"){
                DATA = JSON.parse(DATA);
            }

            // if(PROFILE_USER_SESSION && PROFILE_USER_SESSION.last){
            if(DATA.lastVisit === 0 || DATA.lastVisit !== PROFILE_USER_SESSION.last) {

                multiplier = 2;
                
                DATA["lastVisit"] = PROFILE_USER_SESSION.last;
                setProfileValue(KEY_DATA, DATA);
            }
            // }

            console.log("kk >>> current category", currentCategory);

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

                console.log("kk >>> points", points);

                if(points !== 0){

                    DATA[currentCategory] = DATA[currentCategory] + (multiplier * points);
                    setProfileValue(KEY_DATA, DATA);

                    var currentData = DATA;
                    delete currentData.lastVisit;

                    var bestValue = Object.keys(currentData).reduce(function(a, b) {
                        return currentData[a] > currentData[b] ? a : b;
                    });

                    console.log("kk >>> your best score", bestValue);
                    
                    if(PROFILE_CATEGORY_AFFINITY !== bestValue){
                        
                        console.log("kk >>> save new category affinity", bestValue);
                        setProfileValue(KEY_STATUS, bestValue);
                    }
                }
            }
        } catch(err){
            window.iridion.push(['goal', 'profile_error', err.toString()]);
        }
    });
})();