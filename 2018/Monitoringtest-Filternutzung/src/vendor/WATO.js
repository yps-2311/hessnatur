/**
 * WATO.elem 			 ==> Polling auf ein Element
 * WATO.qs 				 ==> Kurzform für document.querySelector
 * WATO.qsa 			 ==> Kurzform für document.querySelectorAll
 * WATO.ready 			 ==> Wartet auf document.ready
 * WATO.classlist 		 ==> Fügt mehrere Klassen einem Element hinzu oder entfernt sie
 * WATO.ajax 			 ==> Überprüfung auf Ajax-Aktivitäten auf der Seite
 * WATO.getCookie 		 ==> Ließt einen Cookie aus
 * WATO.setCookie 	     ==> Fügt einen Cookie hinzu
 * WATO.removeCookie 	 ==> Entfernt einen Cookie
 * WATO.exclude 		 ==> Punchout-Funktion
 * WATO.storageAvailable ==> Überprüft ob der LocalStorage verfügbar ist
 */

(function(window, document) {
    "use strict";

    console.log("a");

    if (window.WATO === undefined) {
        /**
         * @class
         * @namespace WATO
         * @constructor
         *
         * @author Max Vith
         * @see {@link http://usejsdoc.org/tags-param.html|JSDoc}, {@link http://www.w3schools.com/js/js_strict.asp|JavaScript Use Strict}
         */
        window.WATO = function() {};
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

    // window.WATO.prototype.elem = function(
    //     waitFor,
    //     callback,
    //     timeout,
    //     self,
    //     time
    // ) {
    //     try {

    //         var _self = this || self,
    //             _time = time || Date.now(),
    //             _status = false,
    //             _result;

    //         console.log("elem");

    //         if (Date.now() - _time > 10000) {
    //             callback(false);

    //             return false;
    //         }

    //         if (typeof waitFor === "string") {
    //             _result = document.querySelectorAll(waitFor);

    //             _status = _result.length > 0;
    //         } else {
    //             _result = _status = waitFor() === true;
    //         }

    //         return _status === true ? callback(_result) : setTimeout(
    //                 _self.elem.bind(
    //                     null,
    //                     waitFor,
    //                     callback,
    //                     timeout,
    //                     _self,
    //                     _time
    //                 ),
    //                 timeout || 20
    //             );
            
    //     } catch (error) {
    //         console.log(error);
    //     }        
    // };

    window.WATO.prototype.elem = function(waitFor, callback, timeout, self, time) {

        console.log("elem");

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

            _result = _status = waitFor() === true;
        }

        return _status === true ? callback(_result) : setTimeout(_self.elem.bind(null, waitFor, callback, timeout, _self, _time), timeout || 20);
    };



    /**
     * @function qs
     * @memberOf WATO
     *
     * @author Timo Ott
     *
     * @param {string} selector - CSS Selector des zu findenden DOM Elements.
     */
    window.WATO.prototype.qs = function(selector, parent) {
        return (parent ? parent : document).querySelector(selector);
    };

    /**
     * @function qsa
     * @memberOf WATO
     *
     * @author Timo Ott
     *
     * @param {string} selector - CSS Selector des zu findenden DOM Elements.
     */
    // window.WATO.prototype.qsa = function(selector, parent) {
    //     return (parent ? parent : document).querySelectorAll(selector);
    // };

    /**
     * @function ready
     * @memberOf WATO
     *
     * @author Max Vith
     *
     * @param {function} callback
     */
    /*
	window.WATO.prototype.ready = function(callback) {

		// BUGFIX LD 09.05.2017
		var state = document.readyState !== 'loading';

		if(state) {
		
			callback();
		} else {
			
			document.addEventListener('DOMContentLoaded', callback);
		}
		
		return state;
	};
	*/

    /**
     * @function classlist
     * @memberOf WATO
     *
     * @author Pascal Martin
     *
     * @description Benutzung z.B.: WATO.classlist("h1", ["Eins", "Zwei", "Drei"], true); oder WATO.classlist("h1", ["Eins", "Zwei", "Drei"]); oder WATO.classlist("h1", ["Eins", "Zwei", "Drei"], false);
     *
     * @param {string} selector - CSS Selector des DOM Elements was geändert werden soll
     * @param {string} action - Erwartet "add" zum hinzufügen oder "remove" zum löschen von Klassen
     * @param {array} classes - Erwartet ein Array mit allen Klassen die hinzugefügt oder entfernt werden sollen
     */
    /*
	window.WATO.prototype.classlist = function (selector, classes, action) {
		var el = document.querySelector(selector).classList;
		for (var z = 0; z < classes.length; z++) {
			if(action || action === undefined){
				el.add(classes[z]);
			}else{
				el.remove(classes[z]);
			}
		}
	};
	*/

    /**
     * @function ajax
     * @memberOf WATO
     *
     * @author Lukas Dziambor & Max Vith
     *
     * @param {string} url -
     * @param {function} callback -
     */
    // window.WATO.prototype.ajax = function(url, callback) {
    //     var request = XMLHttpRequest.prototype.open;

    //     XMLHttpRequest.prototype.open = function(
    //         method,
    //         uri,
    //         async,
    //         user,
    //         pass
    //     ) {
    //         this.addEventListener(
    //             "loadend",
    //             function() {
    //                 if (this.readyState === 4) {
    //                     if (uri.indexOf(url) !== -1) {
    //                         callback();
    //                     }
    //                 }
    //             },
    //             false
    //         );

    //         request.call(this, method, uri, async, user, pass);
    //     };
    // };

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
})(window, document);
