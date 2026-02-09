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
        var isMobile = window.innerWidth <= 640;
        var position = isMobile ? 'bottom-center' : 'top-right';

        // Find or create Toastify section
        var section = KEK.qs('.Toastify');
        if (!section) {
            section = document.createElement('section');
            section.className = 'Toastify';
            section.setAttribute('aria-live', 'polite');
            section.setAttribute('aria-atomic', 'false');
            section.setAttribute('aria-relevant', 'additions text');
            section.setAttribute('aria-label', 'Notifications Alt+T');
            document.body.appendChild(section);
        }

        // Find or create container for current position
        var container = section.querySelector('.Toastify__toast-container--' + position);
        if (!container) {
            container = document.createElement('div');
            container.className = 'Toastify__toast-container Toastify__toast-container--' + position;
            section.appendChild(container);
        }

        // Build toast HTML
        var toastId = 'v1-copy-toast-' + Date.now();
        var toast = document.createElement('div');
        toast.id = toastId;
        toast.tabIndex = 0;
        toast.setAttribute('data-in', 'true');
        toast.className = 'Toastify__toast Toastify__toast-theme--light Toastify__toast--success Toastify--animate Toastify__bounce-enter--' + position;
        toast.innerHTML =
            '<div class="Toastify__toast-icon Toastify--animate-icon Toastify__zoom-enter">' +
                '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--toastify-icon-color-success)">' +
                    '<path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>' +
                '</svg>' +
            '</div>' +
            message +
            '<button class="Toastify__close-button Toastify__close-button--light" type="button" aria-label="close">' +
                '<svg aria-hidden="true" viewBox="0 0 14 16">' +
                    '<path fill-rule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path>' +
                '</svg>' +
            '</button>' +
            '<div class="Toastify__progress-bar--wrp" data-hidden="false">' +
                '<div class="Toastify__progress-bar--bg Toastify__progress-bar-theme--light Toastify__progress-bar--success"></div>' +
                '<div role="progressbar" aria-hidden="false" aria-label="notification timer" class="Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar-theme--light Toastify__progress-bar--success" style="animation-duration: 2000ms; animation-play-state: running;"></div>' +
            '</div>';

        container.appendChild(toast);

        // Close button handler
        var closeBtn = toast.querySelector('.Toastify__close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                removeToast();
            });
        }

        // Auto-remove after 2s
        var autoRemoveTimer = setTimeout(function () {
            removeToast();
        }, 2000);

        function removeToast() {
            clearTimeout(autoRemoveTimer);
            toast.setAttribute('data-in', 'false');
            toast.classList.remove('Toastify__bounce-enter--' + position);
            toast.classList.add('Toastify__bounce-exit--' + position);
            setTimeout(function () {
                toast.remove();
            }, 750);
        }
    };

})(window.KEK);
