// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description Sprint 14 – Gutschein ohne Portofrei
 */
(function(KEK) {
    "use strict";

    const REPLACEMENT_CODE = 'PSM26MAERZ20';
    let originalCode = null;

    // Clipboard-API patchen: alten Gutscheincode immer durch neuen ersetzen
    const origWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = (text) => {
        if (originalCode && text === originalCode) {
            return origWriteText(REPLACEMENT_CODE);
        }
        return origWriteText(text);
    };

    const modifyLayer = (modal) => {
        const content = KEK.qs('[class*="onlineMarketingLayer__content__"]', modal);
        if (!content) return;
        if (modal.hasAttribute('data-kk-processed')) return;

        modal.setAttribute('data-kk-processed', 'true');

        // Headline: "& Portofrei" entfernen, * bleibt
        const headline = KEK.qs('.text-3xl', content);
        if (headline && headline.textContent.includes('Portofrei')) {
            headline.textContent = headline.textContent.replace(/\s*&\s*Portofrei/, '');
        }

        // Voucher-Code ersetzen
        const voucherText = KEK.qs('[class*="voucher__text"]', content);
        if (voucherText) {
            if (!originalCode) originalCode = voucherText.textContent.trim();
            voucherText.textContent = REPLACEMENT_CODE;
        }

        // Gutscheincode im Fließtext: Original <strong> ausblenden, Span dahinter
        const asterixStrong = KEK.qs('[class*="asterix_text"] > p > strong', content);
        if (asterixStrong && !asterixStrong.hasAttribute('data-kk-hidden')) {
            asterixStrong.setAttribute('data-kk-hidden', 'true');
            asterixStrong.style.display = 'none';
            KEK.insert(asterixStrong, 'afterend',
                '<span class="kk-voucher-code" style="font-weight:bold">' + REPLACEMENT_CODE + '</span>');
        }

        // Copy-Button: Toast nachrüsten (Clipboard-Patch fängt den Code ab)
        const copyBtn = KEK.qs('[data-testid="copy-to-clipboard-button"]', content);
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                showCopyToast();
            }, true);
        }
    };

    const showCopyToast = () => {
        const toastify = KEK.qs('.Toastify');
        if (!toastify) return;

        // Container
        const container = '<div class="Toastify__toast-container Toastify__toast-container--top-right">' +
            '<div id="copy-to-clipboard-toast" tabindex="0" data-in="true" ' +
                'class="Toastify__toast Toastify__toast-theme--light Toastify__toast--default Toastify--animate Toastify__bounce-enter--top-right" ' +
                'role="alert">' +
                'Der Gutscheincode wurde in deine Zwischenablage kopiert.' +
                '<button class="Toastify__close-button Toastify__close-button--light" type="button" aria-label="close">' +
                    '<svg aria-hidden="true" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path></svg>' +
                '</button>' +
            '</div>' +
        '</div>';

        KEK.insert(toastify, 'afterbegin', container);

        const inserted = KEK.qs('.Toastify__toast-container', toastify);
        if (!inserted) return;

        // Close-Button
        const closeBtn = KEK.qs('.Toastify__close-button', inserted);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                removeToast(inserted);
            });
        }

        // Auto-Remove nach 3s
        setTimeout(() => {
            removeToast(inserted);
        }, 3000);
    };

    const removeToast = (container) => {
        if (!container || !container.parentNode) return;
        const toast = KEK.qs('.Toastify__toast', container);
        if (toast) {
            KEK.defineClass(toast, 'Toastify__bounce-enter--top-right', 'Toastify__bounce-exit--top-right');
            setTimeout(() => {
                if (container.parentNode) container.parentNode.removeChild(container);
            }, 700);
        } else {
            container.parentNode.removeChild(container);
        }
    };

    // MutationObserver auf body – wartet auf modal-layer
    KEK.elem('body', (bodies) => {
        if (!bodies) return;

        const observer = new MutationObserver(function() {
            const modal = KEK.qs('[data-testid="modal-layer"]');
            if (!modal) return;

            const content = KEK.qs('[class*="onlineMarketingLayer__content__"]', modal);
            if (!content) return;

            modifyLayer(modal);
        });

        observer.observe(bodies[0], { childList: true, subtree: true });

        // Initialer Check
        const existing = KEK.qs('[data-testid="modal-layer"]');
        if (existing) modifyLayer(existing);
    });

})(new window.KEK());
