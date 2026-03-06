// ==UserScript==
// @name         hessnatur – Voucher ohne Portofrei (Prototype)
// @namespace    http://tampermonkey.net/
// @version      2026-03-06
// @description  Entfernt "& Portofrei" aus dem Aktionsbanner und ersetzt den Voucher-Code
// @author       KonversionsKRAFT
// @match        https://www.hessnatur.com/*utm_medium=cpc*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hessnatur.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const REPLACEMENT_CODE = 'TEST123';
    let modified = false;

    const modifyLayer = (modal) => {
        const content = modal.querySelector('[class*="onlineMarketingLayer__content__"]');
        if (!content) return;

        // Headline: "& Portofrei" entfernen, * bleibt
        const headline = content.querySelector('.text-3xl');
        if (headline && headline.textContent.includes('Portofrei')) {
            headline.textContent = headline.textContent.replace(/\s*&\s*Portofrei/, '');
        }

        // Voucher-Code ersetzen
        const voucherText = content.querySelector('[class*="voucher__text"]');
        if (voucherText) {
            voucherText.textContent = REPLACEMENT_CODE;
        }

        // Copy-Button: Original-Handler abfangen, neuen Code kopieren
        const copyBtn = content.querySelector('[data-testid="copy-to-clipboard-button"]');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                navigator.clipboard.writeText(REPLACEMENT_CODE);
            }, true);
        }

        modified = true;
    };

    const observer = new MutationObserver(function (mutations) {
        if (modified) return;

        const modal = document.querySelector('[data-testid="modal-layer"]');
        if (!modal) return;

        const content = modal.querySelector('[class*="onlineMarketingLayer__content__"]');
        if (!content) return;

        modifyLayer(modal);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initialer Check, falls Modal bereits im DOM
    const existing = document.querySelector('[data-testid="modal-layer"]');
    if (existing) modifyLayer(existing);
})();