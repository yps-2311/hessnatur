/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

    WATO.prototype.favProducts = [];
    WATO.prototype.sehrgefragtProducts = [];

	WATO.prototype.ps01_2global = function(){
        var _self = this,
            isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1;

        function setCookieThatExpiresAfter24h() {
            // Aktualisierungen nur noch alle 24h
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + 1);
            document.cookie = "kk_favForSession=isUpToDate;expires=" + exdate.toUTCString() + ";domain=www.hessnatur.com;path=/";
        }
    
        function iridionProfile(thisName, thisvalue) {
            if(thisvalue){
                window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
            }else{
                return window.iridion.push(['profile', 'getValue', thisName]);
            }
        }
    
        function getFavOrPopular(widgetID, isFav, profileName) {
            _self.xhr_get_resp('https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid='+widgetID+'&csize=50&start=0&type=cs&widgetdetails=true', function(data) {
                var respArray = [];
                var allItems = JSON.parse(data).items;
                for (var i = 0; i < allItems.length; i++) {
                    respArray.push(parseInt(allItems[i].id));
                }
                iridionProfile(profileName, respArray);
                setCookieThatExpiresAfter24h();
                if(isFav){
                    _self.favProducts = respArray;
                }else{
                    _self.sehrgefragtProducts = respArray;
                }
            });
        }

        if(document.cookie.indexOf("kk_favForSession") !== -1){
            _self.favProducts = JSON.parse(iridionProfile("favProducts"));
            _self.sehrgefragtProducts = JSON.parse(iridionProfile("sehrgefragtProducts"));
        }else{
            getFavOrPopular(131, true, "favProducts");
            getFavOrPopular(132, false, "sehrgefragtProducts");
        }

        if(isInteressent){
            window.iridion.push(["segment", "32812"]);
        } else {
            window.iridion.push(["segment", "-32812"]);
            window.iridion.push(["segment", "32813"]);
        }
    };
	
})(window.WATO, window);