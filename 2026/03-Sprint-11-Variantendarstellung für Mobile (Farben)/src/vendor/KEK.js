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



})(window, document);
