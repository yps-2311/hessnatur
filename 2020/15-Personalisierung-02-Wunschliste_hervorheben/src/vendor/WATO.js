/**
 * WATO.elem 			 ==> Polling auf ein Element
 * WATO.qs 				 ==> Kurzform für document.querySelector
 * WATO.qsa 			 ==> Kurzform für document.querySelectorAll
 * WATO.ready 			 ==> Wartet auf document.ready
 * WATO.ajax 			 ==> Überprüfung auf Ajax-Aktivitäten auf der Seite
 * WATO.getCookie 		 ==> Ließt einen Cookie aus
 * WATO.setCookie 	     ==> Fügt einen Cookie hinzu
 * WATO.removeCookie 	 ==> Entfernt einen Cookie
 * WATO.exclude 		 ==> Punchout-Funktion
 * WATO.storageAvailable ==> Überprüft ob der LocalStorage verfügbar ist
 * WATO.reload           ==> Führt einen Reload aus (löscht dabei den #hash, als Workaround für manche Browser)
 * WATO.offsetY          ==> Gibt die Y-Position eines Elements zurück
 * WATO.scrollTo         ==> Scrollt bis zum Übergebenen Pixel (von oben)
 * WATO.event            ==> EventListener setzen
 * WATO.xhr_get          ==> Ajax GET Request
 * WATO.xhr_post         ==> Ajax POST Request
 */
(function (window, document) {
    "use strict";

    if (window.WATO === undefined) {
        /**
         * @class
         * @namespace WATO
         * @constructor
         *
         * @author Max Vith
         * @see {@link http://usejsdoc.org/tags-param.html|JSDoc}, {@link http://www.w3schools.com/js/js_strict.asp|JavaScript Use Strict}
         */
        window.WATO = function () { };
    }

    /**
     * @function elem
     * @memberOf WATO
     *
     * @author Max Vith
     * @description Polling with JavaScript and jQuery.
     * @see Inspiriert von {@link http://clearhead.me/a-new-monetate-polling-pattern-emerges/|Clearhead.me}.
     *
     * @param {string} selector - CSS Selector des zu findenden DOM Elements.
     * @param {function} callback - Auszuführende Funktion nachdem das Element gefunden wurde.
     * @param {number} [timeout=20] - Wiederholungsrate in Millisekunden.
     * @param {class} [self=WATO] - Web Arts Testing Object.
     *
     * @return {object} NodeList object - Returns all elements in the document that matches a specified CSS selector(s), as a static NodeList object.
     */
    window.WATO.prototype.elem = function (waitFor, callback, timeout, self, time) {

        var _self = this || self,
            _time = time || Date.now(),
            _status = false,
            _result;

        if (Date.now() - _time > 10000) {

            callback(false);

            return false;
        }

        if (typeof waitFor === "string") {

            _result = document.querySelectorAll(waitFor);
            _status = _result.length > 0;
        } else {

            _result = waitFor() || false;
            _status = !!_result;
        }

        return _status === true ? callback(_result) : setTimeout(_self.elem.bind(null, waitFor, callback, timeout, _self, _time), timeout || 20);
    };

    /**
     * @function qs
     * @memberOf WATO
     *
     * @author Timo Ott
     *
     * @param {string} selector - CSS Selector des zu findenden DOM Elements
     */
    window.WATO.prototype.qs = function (selector, parent) {

        return (parent ? parent : document).querySelector(selector);
    };

    /**
     * @function qsa
     * @memberOf WATO
     *
     * @author Timo Ott
     *
     * @param {string} selector - CSS Selector des zu findenden DOM Elements
     */
    window.WATO.prototype.qsa = function (selector, parent) {

        return (parent ? parent : document).querySelectorAll(selector);
    };

    /**
     * @function ready
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {function} callback
     */
    window.WATO.prototype.ready = function (callback) {

        // http://youmightnotneedjquery.com/ IE9+
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {

            callback();
        } else {

            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    /**
     * @function ajax
     * @memberOf WATO
     *
     * @author Lukas Dziambor & Max Vith
     *
     * @param {string} url -
     * @param {function} callback -
     */
    /*
    window.WATO.prototype.ajax = function(url, callback) {

        var request = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

            this.addEventListener("loadend", function() {

                if (this.readyState === 4) {

                    if (uri.indexOf(url) !== -1) {
                        
                        callback();
                    }
                }
            }, false);

            request.call(this, method, uri, async, user, pass);
        };
    };
    */

    /**
     * @function getCookie
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {string} name - Cookie name
     */
    /*
	window.WATO.prototype.getCookie = function(name){
		
		var cookies = document.cookie.split(";");
		
		for(var i = 0; i < cookies.length; i++){
			
			if(cookies[i].substr(0, cookies[i].indexOf("=")).replace(/^\s+|\s+$/g,"") === name){
				
				return decodeURIComponent(cookies[i].substr(cookies[i].indexOf("=") + 1));
			}
		}
		
		return false;
	};
	*/

    /**
     * @function setCookie
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {string} domain - Domain like .exaple.com
     * @param {Boolean} session - true = session cookie, false = permanent cookie
     */
    /*
	window.WATO.prototype.setCookie = function(name, value, domain, session){
		
		var exdate = new Date();
		
		exdate.setDate(exdate.getDate() + 365);
		
		document.cookie = name + "=" + encodeURIComponent(value) + ";" + (!session ? "expires=" + exdate.toUTCString() + ";" : "") + "domain=" + domain + ";path=/";
	};
	*/

    /**
     * @function removeCookie
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {string} name - Cookie name
     * @param {string} domain - Domain like .exaple.com
     */
    /*
	window.WATO.prototype.removeCookie = function(name, domain){
		
		document.cookie = name + "=false;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domain + ";path=/";
	};
	*/

    /**
     * @function exclude
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {number} width -
     * @param {function} callback
     */
    /*
	window.WATO.prototype.exclude = function(width, callback){
		
		function _checkWidth() {
			
			var current = window.innerWidth || document.body.clientWidth;
			
			if(current <= width && !exclude){
				
				exclude = true;
				
				callback();
			}
		}
		
		var exclude = false;
		
		_checkWidth();
		
		if(typeof callback === "function"){
			
			window.onresize = function() {

				_checkWidth();
			};
		}
	};
	*/

    /**
     * @function storageAvailable
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @returns {Boolean} - true = private / inkognito
     */
    /*
	window.WATO.prototype.storageAvailable = function(){
		
		var mod = 'wato';
	    
	    try {
	    	
	        window.localStorage.setItem(mod, mod);
	        window.localStorage.removeItem(mod);
	        
	        return true;
	    } catch(e) {
	
	        return false;
	    }
	};
    */

    /**
     * @function reload
     * @memberOf WATO
     *
     * @author Lukas Dziambor
     */
    
	window.WATO.prototype.reload = function(){
        location.reload();
        location.href=location.href.split('#')[0];
	};
    

    /**
     * @function offsetY
     * @memberOf WATO
     *
     * @author Lukas Dziambor
     * 
     * @returns {integer} - y-position from top in pixel
     */
    /*
	window.WATO.prototype.offsetY = function(el){
        var curtop = 0;
        if (el.offsetParent) {
            while (el.offsetParent) {
                curtop += el.offsetTop;
                el = el.offsetParent;
            }
        }
        else if (el.y){
            curtop += el.y;
        }
          
        return curtop;
	};
    */

    /**
     * @function scrollTo
     * @memberOf WATO
     *
     * @author Lukas Dziambor
     */
    /*
	window.WATO.prototype.scrollTo = function(pixel, duration){
        Math.easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1){
                return c/2*t*t + b;
            }else{
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            }
        };

        var start = window.document.documentElement.scrollTop + window.document.body.scrollTop,
        change = pixel - start,
        currentTime = 0,
        increment = 20,
            
        animateScroll = function(){        
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, duration);

            window.document.documentElement.scrollTop = val;
            window.document.body.scrollTop = val;

            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
	};
    */

    /**
     * @function event
     * @memberOf WATO
     *
     * @param {node} element - DOM Node die den Listener erhalten soll
     * @param {string} - Eventtype z.B. click
     * @param {function} callback - Auszuführende Funktion bei Trigger.
     * 
     * @author Lukas Dziambor
     */
    /*
	window.WATO.prototype.event = function(element, type, callback){
        element.addEventListener(type, callback);
	};
    */

    /**
     * @function xhr_get
     * @memberOf WATO
     *
     * @param {string} url - URL die angefragt werden soll
     * @param {function} callback - Auszuführende Funktion nachdem der Request erfolgreich beendet wurde.
     * @param {object} scopedData - Daten die im Scope des Callbacks verfügbar sein sollen
     * 
     * @author Lukas Dziambor
     */
    /*
	window.WATO.prototype.xhr_get = function(url, callback, scopedData) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = function() {
          if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
            try {
                var data = JSON.parse(this.response);
                callback(data, scopedData);
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
    */

    /**
     * @function xhr_post
     * @memberOf WATO
     *
     * @param {string} url - URL die angefragt werden soll
     * @param {string} payload - POST parameter als key=value pair mit & verknüpft
     * @param {function} callback - Auszuführende Funktion nachdem der Request erfolgreich beendet wurde.
     * @param {string} contentType - RequestHeader Content-Type -> default 'application/x-www-form-urlencoded'
     * @param {object} scopedData - Daten die im Scope des Callbacks verfügbar sein sollen
     * 
     * @author Lukas Dziambor
     */
    /*
	window.WATO.prototype.xhr_post = function(url, payload, callback, contentType, scopedData) {
        var request = new XMLHttpRequest();

        contentType = contentType || 'application/x-www-form-urlencoded';

        request.open('POST', url, true);
        
        request.onload = function() {
          if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
            try {
                var data = JSON.parse(this.response);
                callback(data, scopedData);
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
        request.setRequestHeader('Content-Type', contentType);
        request.send(payload);
    };
    */

})(window, document);
