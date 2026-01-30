/*
 * Sprint 11 - Variantendarstellung für Mobile (Farben)
 * 
 * KEK.elem - polling onto an element
 * KEK.qs   - shortcut for document.querySelector
 * KEK.qsa  - shortcut for document.querySelectorAll
 */

(function (window, document) {
    "use strict";

    if (window.KEK === undefined) {
        window.KEK = function () { };
    }

    /**
     * @function elem
     * @memberOf KEK
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

    /**
     * @function qsa
     * @memberOf KEK
     *
     * @param { string } selector - CSS Selector
     * @param { node } parent - Parent Element (optional)
     */
    window.KEK.prototype.qsa = function (selector, parent) {

        return (parent ? parent : document).querySelectorAll(selector);

    };

    /**
     * @function defineClass
     * @memberOf KEK
     *
     * @param { node } el - DOM Element
     * @param { string } cla - Klasse hinzufügen/entfernen
     * @param { boolean|string } rep - true = entfernen, string = ersetzen
     */
    window.KEK.prototype.defineClass = function (el, cla, rep) {

        if (rep === true) {
            el.classList.remove(cla);
        } else if (typeof rep === "string") {
            el.classList.remove(cla);
            el.classList.add(rep);
        } else {
            el.classList.add(cla);
        }

    };

})(window, document);
