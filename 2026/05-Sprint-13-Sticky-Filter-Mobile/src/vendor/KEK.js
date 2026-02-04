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

})(window, document);
