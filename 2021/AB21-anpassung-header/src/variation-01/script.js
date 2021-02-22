// load core and global js
// @ codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Tobias Wittkopf
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    'use strict';

    // Goals and Punchout
    WATO.kkab21();

    function ajax(url, callback) {
        var request = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
            var that = this;

            that.addEventListener('loadend', function() {
                if (this.readyState === 4) {
                    if (uri.indexOf(url) !== -1) {
                        callback(that);
                    }
                }
            }, false);

            request.call(this, method, uri, async, user, pass);
        };
    };

    ajax('/de/dynamicHeader', function(response) {
        try {
            var json = JSON.parse(response.response);
        } catch (error) {
            window.iridion.push(['goal', 'kk_ab21_error_setup', '1_' + error.toString()]);
            return;
        }

        if (json.login && json.login.accountLink) {
            WATO.elem('#myAccountLink', function (link) {
                if (link) {
                    link[0].insertAdjacentHTML('beforeend', '' +
                        '<span class="kk-meta-link">' +
                            (json.login.accountLink === '/de/my-account'
                                ? 'Kundenkonto'
                                : 'Einloggen') +
                        '</span>'
                    );
                }
            });
        }
    });
})(new window.WATO(), window);
