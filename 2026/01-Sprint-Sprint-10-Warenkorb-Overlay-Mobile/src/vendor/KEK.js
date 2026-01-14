/*
<-------------------------- important functions ----------------------------->

 * KEK.elem             ==> polling onto an element
 * KEK.qs               ==> shortcut for document.querySelector
 * KEK.qsa              ==> shortcut for document.querySelectorAll

<--------------------------- helping functions ------------------------------>

 * KEK.ajax             ==> perform callbacks on specific AJAX-activities (dt. führe Callback-Methode bei spezifischen AJAX-Aktivitäten aus)
 * KEK.cookieGet        ==> reads out a specific cookie
 * KEK.cookieSet        ==> adds a cookie value to a given name
 * KEK.cookieRemove     ==> deletes a cookie
 * KEK.defineClass      ==> adds a class to an element or replaces an elements class with a new one
 * KEK.eventElem        ==> sets an EventListener and callback on DOM-node after polling for it
 * KEK.exclude          ==> punchout-function
 * KEK.insert           ==> insert an element or HTML-parsable string into another element, if it exists
 * KEK.docReady         ==> executes callback on DOM-ready event
 * KEK.reload           ==> hard browser reload (deletes hash)
 * KEK.storageAvailable ==> check if localStorage is available

<----------------------------- lts functions -------------------------------->

 * KEK.poll 	         ==> mighty polling with further options

 */

(function (window, document) {
    "use strict";

    if (window.KEK === undefined) {
        /**
         * @class
         * @namespace KEK
         * @constructor
         *
         * @author Max Vith
         * @see {@link http://usejsdoc.org/tags-param.html|JSDoc}, {@link http://www.w3schools.com/js/js_strict.asp|JavaScript Use Strict}
         */
        window.KEK = function () { };
    }

    /**
     * @function elem
     * @memberOf KEK
     *
     * @author Max Vith
     * @description Polling with JavaScript and jQuery.
     * @see Inspiriert von {@link http://clearhead.me/a-new-monetate-polling-pattern-emerges/|Clearhead.me}.
     *
     * @param { string } selector - CSS Selector des zu findenden DOM Elements.
     * @param { function } callback - Auszuführende Funktion nachdem das Element gefunden wurde.
     * @param { number } [timeout=20] - Wiederholungsrate in Millisekunden.
     * @param { class } [self=KEK] - KO(nversionsKraft) Testing Object.
     *
     * @return { object } NodeList object - Returns all elements in the document that matches a specified CSS selector(s), as a static NodeList object.
     */
    window.KEK.prototype.elem = function (waitFor, callback, timeout, self, time) {

        let _self = this || self,
            _time = time || Date.now(),
            _status = false,
            _result;

        if (Date.now() - _time > 1e4) {

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
    //*/

    /**
     * @function qs
     * @memberOf KEK
     *
     * @author Max Vith, Timo Ott
     *
     * @param { string } selector - CSS Selector des zu findenden DOM Elements
     * @param { node } parent - CSS Selector des zu findenden DOM Elements
     */
    window.KEK.prototype.qs = function (selector, parent) {

        return (parent ? parent : document).querySelector(selector);

    };
    //*/

  /**
   * @function qsa
   * @memberOf KEK
   *
   * @author Max Vith, Timo Ott, Christian Knoth
   *
   * @param { string } selector - CSS Selector des zu findenden DOM Elements
   * @param { node } parent - CSS Selector des zu findenden DOM Elements
   * @param { func } callback - Callback function if the node was found
   */
    //*
    window.KEK.prototype.qsa = function (selector, parent, callback) {
        const elem = [...(parent ? parent : document).querySelectorAll(selector)];

        if (typeof callback === "function") {
        callback(elem);
        }

        return elem;
    };
    //*/

    /**
     * @function ajax
     * @memberOf KEK
     *
     * @author Lukas Dziambor & Max Vith & Christian Knoth
     *
     * @param { string } url -
     * @param { function } callback -
     * @param { props: string } event - set the event, when ("loadend", "load") you want to execute the callback
     * @param { props: string } method - decide if you want to get the payload value of the response ("open") or the request ("send")
     * @param { note } iterable - (with typescript) we could extend the object to an array
     */

    /*
        window.KEK.prototype.ajax = function(url, callback, props = {}) {

            const { event = "loadend" , method = "open" } = props;

            let request = XMLHttpRequest.prototype.open;

            if(method === "open"){

                XMLHttpRequest.prototype.open = function(method, uri) {
    
                    const _self = this;
    
                    _self.addEventListener(event, () => {
    
                        if(
                            this.readyState === 4 &&
                            uri.indexOf(url) !== -1 &&
                            typeof callback === "function"
                        ){
    
                            callback({ self: _self.response ? _self : true, _uri: uri, _myUrl: url });
                        }
                    }, false);
    
                    request.apply(this, arguments);
                };

            } else if(method === "send"){
                request = XMLHttpRequest.prototype.send;

                XMLHttpRequest.prototype.send = function() {

                    const _self = this;
                    _self.addEventListener(event, () => {
                        if(_self.responseURL.indexOf(url) !== -1){
                            callback(arguments);
                        }
                    });
                    
                    request.apply(this, arguments);
                };
            }
        };
    //*/

    /**
     * @function cookieGet
     * @memberOf KEK
     *
     * @author Max Vith
     *
     * @param { string } name - Cookie name
     */

    /*
        window.KEK.prototype.cookieGet = function(name){
            
            const cookies = document.cookie.split(";");
            
            for(let i = 0; i < cookies.length; i++){
                
                if(cookies[i].substring(0, cookies[i].indexOf("=")).replace(/^\s+|\s+$/g,"") === name){
                    
                    return decodeURIComponent(cookies[i].substring(cookies[i].indexOf("=") + 1));
                }
            }
            
            return false;
        };
    //*/

    /**
     * @function cookieSet
     * @memberOf KEK
     *
     * @author Max Vith
     *
     * @param { string } name - Cookie name
     * @param { string } value - Cookie value
     * @param { string } domain - Domain like .exaple.com
     * @param { boolean } session - true = session cookie, false = permanent cookie
     */

    /*
        window.KEK.prototype.cookieSet = function(name, value, domain, session){
            
            const exdate = new Date();
            
            exdate.setDate(exdate.getDate() + 365);
            
            document.cookie = name + "=" + encodeURIComponent(value) + ";" + (!session ? "expires=" + exdate.toUTCString() + ";" : "") + "domain=" + domain + ";path=/; SameSite=None; Secure";
        };
    //*/

    /**
     * @function cookieRemove
     * @memberOf KEK
     *
     * @author Max Vith
     *
     * @param { string } name - Cookie name
     * @param { string } domain - Domain like .example.com
     */

    /*
        window.KEK.prototype.cookieRemove = function(name, domain){
            
            document.cookie = name + "=false;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + domain + ";path=/";
        };
    //*/


    /**
     * @function defineClass
     * @memberOf KEK
     *
     * @author Christian Knoth
     *
     * @description add, replace or remove a class of the given element + returns modified version of current classes
     *
     * @param { DOM-node } element - DOM-element which has to be changed
     * @param { string } selector - specify the css class which has to be added or overwritten
     * @param { string | boolean } overwriteOrRemove - specify the new css-class which should replace the old one, or handover a true if the old one hast to be removed
     */

    /*
		window.KEK.prototype.defineClass = function(element, selector, overwriteOrRemove) {
			const c_list = element && element.classList;

			if(c_list && selector){
                if(typeof overwriteOrRemove === "boolean" && overwriteOrRemove){
                    
                    c_list.remove(selector);

                } else if (typeof overwriteOrRemove === "string") {
                    
                    c_list.replace(selector, overwriteOrRemove);

                } else {

                    c_list.add(selector);
                }
			}

            return c_list;
		};
    //*/

    /**
     * @function eventElem
     * @memberOf KEK
     *
     * @author Max Vith & Christian Knoth
     *
     * @param { string | Node | function } selector
     * @param { string[] } eventType
     * @param { function } callback
     * @param { object } props specifies the listener, example: {once : true} or { passive: true }
     * @description sets an EventListener and callback on DOM-node after polling for it if you pass a string or function as selector
     * @note the passive option tells the browser that the callback will not call preventDefault(), which can improve performance for touch and wheel events.
     */

    /*
        window.KEK.prototype.eventElem = function (selector, eventType, callback, props) {

            if(!selector) return;

            if(typeof selector !== "object"){

                this.elem(selector, elem => {

                    if(elem){

                        (elem.length > 0 ? elem[0] : elem).addEventListener(eventType, callback, props);
                    }
                });
            } else {

                selector.addEventListener(eventType, callback, props);
            }
        };
    //*/

    /**
     * @function exclude
     * @memberOf KEK
     *
     * @author Max Vith
     *
     * @param { number } width -
     * @param { function } callback
     */

    /*
        window.KEK.prototype.exclude = function(width, callback){

            let exclude = false;
            
            function _checkWidth() {
                
                const current = window.innerWidth || document.body.clientWidth;
                
                if(current <= width && !exclude){
                    
                    exclude = true;
                    
                    callback();
                }
            }
            
            _checkWidth();
            
            if(typeof callback === "function"){
                
                window.addEventListener('resize', () => {
                    _checkWidth();
                });
            }
        };
    //*/

    /**
     * @function insert
     * @memberOf KEK
     *
     * @author Christian Knoth
     * @description insert an element or HTML-parsable string into another element, if it exists
     *
     * @param { DOM-node } el
     * @param { string } where - afterbegin, beforebegin, beforeend, afterend
     * @param { string | element } insertion
     */
    
    //*
        window.KEK.prototype.insert = function(el, where, insertion) {
            return el && insertion && where && el["insertAdjacent" + (typeof insertion !== "string" ? "Element" : "HTML")](where, insertion);
        };
    //*/

    /**
     * @function reload
     * @memberOf KEK
     *
     * @author Lukas Dziambor
     */

    /*
        window.KEK.prototype.reload = function() {
            window.location.reload();
            window.location.href=location.href.split('#')[0];
        };
    //*/


    /**
     * @function docReady
     * @memberOf KEK
     *
     * @author Max Vith
     * @description executes callback on DOM-ready event
     *
     * @param { function } callback
     */

    /*
    window.KEK.prototype.docReady = function(callback) {

            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {

                callback();
            } else {

                document.addEventListener('DOMContentLoaded', callback);
            }
        };
    //*/

    /**
     * @function storageAvailable
     * @memberOf KEK
     *
     * @author Max Vith
     *
     * @returns { boolean } - true = private / inkognito
     */

    /*
        window.KEK.prototype.storageAvailable = function() {
            
            const mod = 'KEK';
            
            try {
                
                window.localStorage.setItem(mod, mod);
                window.localStorage.removeItem(mod);
                
                return true;
            } catch(e) {
        
                return false;
            }
        };
    //*/



    /**
     * @author Christian Knoth
     * @description This is a prototype for a mightier polling-function in it's early state.
     * 
     * @notification1 It's a promise, you can await it and go on with your code after it insider an async declared function.
     * @notification2 This function reveives an object. The order of handing over props doesn't matter.
     * 
     * @param { string | boolean } wFor - waitFor: CSS selector or a condition, resolves, if the node is found or the condition returns true
     * @param { function } cb - callback (optional): executed function if sth. gets resolved
     * @param { number } [t_out = 20] - timeout (optional): handles the sampling [ms] of the polling
     * @param { number } [t = 10000] - time (optional): max. duration [ms] of the polling
     * @param { function } exA - executeAfter (optional): handover another function, which will be executed after a successfull resolvation of the polling
     * @param { function } hT - handleTimeout (optional): the HE-grenade, in case of not finding an element and timeout reached, you can pass another function which will be executed then, example: error goal
     * @param { function } hE - handleError (optional): the HE-grenade, in case of a explosion whenever sth. crashes
     * @param { function } aWy - anyWay (optional): handover another function, which will always be executed in the end
     * @param { function } sCon - stopCondition (optional): stop the polling and resolve, if a specific circumstance is fullfilled
     */

    /*
    window.KEK.prototype.poll = function ({
        wFor: waitFor,
        p: parent,
        cb: callback,
        t_out: timeout = 20,
        t: time = 10000,
        i: index,
        exA: executeAfter,
        hT: handleTimeout,
        hE: handleError,
        aWy: anyway,
        sCon: stopCondition
    }, self, win = window) {

        const unclear = undefined;

        const isFunc = val => (typeof val === "function");

        const _self = this || self;

        let _result;

        try {
    
            return new Promise(async resolve => {

                if(stopCondition) resolve(unclear);

                if(isFunc(waitFor)){
                    _result = await waitFor();
                }
                else {
                    _result = (parent ? parent : document).querySelectorAll(waitFor);
                    if(_result.length < 1) _result = false;
                    else if(index){
                        _result = _result[index];
                    }
                }

                if(_result){
                    
                    if(isFunc(callback)){
                        await callback(_result);
                    }
                    resolve(_result);

                    if(isFunc(executeAfter)){
                        executeAfter(_result);
                    }
                }
                else if(time <= 0){

                    if(isFunc(handleTimeout)){
                        handleTimeout();
                    }
                    resolve(unclear);
                }
                else {

                    resolve(
                        await new Promise((resolve) => {
                            setTimeout(async() => {
                                resolve(await _self.poll(
                                    {
                                        wFor: waitFor,
                                        cb: callback,
                                        t_out: timeout,
                                        t: (time - timeout),
                                        i: index, 
                                        exA: executeAfter,
                                        hT: handleTimeout,
                                        hE: handleError,
                                        aWy: anyway,
                                    }, _self, win));
                            }, timeout) ;
                        })
                    );
                }

            });

        } catch (error) {

            time = 0;
            
            if(isFunc(handleError)){
                handleError(error);
            }
            else {
                console.log("KEK: error", error);
            }

            resolve(null);

        } finally {
            
            if(isFunc(anyway) && (time <= 0)){
                //clear instances
                anyway(_result);
            }
        }
    };
    //*/

})(window, document);
