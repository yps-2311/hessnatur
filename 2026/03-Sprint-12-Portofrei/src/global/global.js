window.KEK = window.KEK || {};

(function (KEK) {
    "use strict";

    KEK.qs = function (selector, parent) {
        return (parent || document).querySelector(selector);
    };

    KEK.qsa = function (selector, parent) {
        return Array.from((parent || document).querySelectorAll(selector));
    };

    KEK.waitForElement = function (selector, callback, timeout) {
        var el = KEK.qs(selector);
        if (el) {
            callback(el);
            return;
        }

        var observer = new MutationObserver(function (mutations, obs) {
            var el = KEK.qs(selector);
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (timeout) {
            setTimeout(function () {
                observer.disconnect();
            }, timeout);
        }
    };

    KEK.copyToClipboard = function (text, callback) {
        if (!navigator.clipboard) {
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (callback) callback(true);
            } catch (err) {
                if (callback) callback(false);
            }
            document.body.removeChild(textArea);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            if (callback) callback(true);
        }, function () {
            if (callback) callback(false);
        });
    };

    KEK.trackEvent = function (position) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "coupon_copy_porto_frei",
            position: position
        });
        console.log('[KEK] Event tracked:', position);
    };

    KEK.showToast = function (message) {
        var toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#444; color:#fff; padding:8px 16px; border-radius:4px; font-family:Outfit, sans-serif; font-size:14px; z-index:10000; opacity:0; transition:opacity 0.3s ease;";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = "1";
        }, 10);

        setTimeout(function () {
            toast.style.opacity = "0";
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 2000);
    };

})(window.KEK);
