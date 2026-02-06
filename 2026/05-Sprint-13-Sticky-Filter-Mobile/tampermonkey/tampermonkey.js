// ==UserScript==
// @name         Hessnatur Sprint 13 - Sticky Filter Mobile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A/B Test Sticky Filter auf Mobile PLPs/SRPs (Inline Version)
// @author       Manuel Brückmann
// @match        https://www.hessnatur.com/*
// @match        https://hessnatur.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Nur auf Mobile (< 640px)
    if (window.innerWidth >= 640) {
        console.log('[Sprint 13] Desktop detected, test not applied.');
        return;
    }

    console.log('[Sprint 13] Mobile detected, applying Sticky Filter test.');

    // ==================== CSS ====================
    GM_addStyle(`
        /* Sticky Filter/Sortier-Tab-Wrapper - wird zum positioning context */
        .plp_filterSortTabsWrapper__LkAYd,
        div[class*="plp_filterSortTabsWrapper"] {
            position: -webkit-sticky !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 100 !important;
            background-color: #fff !important;
        }

        /* Filter-Panel schwebt direkt unter den Buttons */
        .FilterSortTabs_filterSortTabs__panel__MjrDK,
        div[role="tabpanel"][class*="FilterSortTabs"] {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            bottom: auto !important;
            max-height: 70vh !important;
            z-index: 101 !important;
            background-color: #fff !important;
            overflow-y: auto !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        /* Fix: Schließen-Button nicht aufblähen */
        .FilterSortTabs_filterSortTabs__close-all-button__X7GUA {
            flex-shrink: 0 !important;
            flex-grow: 0 !important;
            height: auto !important;
            min-height: unset !important;
            padding: 16px 24px !important;
            margin: 16px !important;
        }
    `);
    console.log('[Sprint 13] CSS injected.');

    // ==================== KEK Framework ====================
    if (window.KEK === undefined) {
        window.KEK = function () {};
    }

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

    // ==================== Test Logic ====================
    const KEK = new window.KEK();

    // Tracking Helper
    const trackClick = (eventName, action, category) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event_name: eventName,
            filter_action: action,
            filter_category: category || ''
        });
        console.log('[Sprint 13] Tracked:', { event_name: eventName, filter_action: action, filter_category: category });
    };

    // Init Tracking
    const initTracking = () => {
        // Track Filter/Sortieren Tab Clicks
        KEK.elem('.FilterSortTabs_filterSortTabs__trigger__Hjs7L', (triggers) => {
            if (!triggers) return;

            triggers.forEach((trigger, index) => {
                const isFilterTab = index === 0;
                const eventName = isFilterTab ? 'filter_click' : 'sort_click';
                const action = isFilterTab ? 'Clicke Filter' : 'Clicke Sortieren';

                trigger.addEventListener('click', () => {
                    trackClick(eventName, action, '');
                });
            });
            console.log('[Sprint 13] Tab click tracking initialized.');
        });

        // Track Filter-Kategorie Clicks (h3 > button)
        KEK.elem('.FilterElement_filterAccordionItem__header__fALCo button', (categoryButtons) => {
            if (!categoryButtons) return;

            categoryButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const categoryName = btn.textContent.trim();
                    trackClick('filter_click', 'Clicke Filter', categoryName);
                });
            });
            console.log('[Sprint 13] Category click tracking initialized.');
        });

        // Track Schließen-Button Click
        KEK.elem('.FilterSortTabs_filterSortTabs__close-all-button__X7GUA', (closeBtns) => {
            if (!closeBtns) return;

            closeBtns[0].addEventListener('click', () => {
                trackClick('filter_click', 'Clicke Filter', 'Schließen');
            });
            console.log('[Sprint 13] Close button tracking initialized.');
        });
    };

    // Init Test (SPA-safe mit KEK.elem Polling)
    KEK.elem('.plp_filterSortTabsWrapper__LkAYd', (wrapper) => {
        if (!wrapper) return;
        console.log('[Sprint 13] Filter wrapper found, initializing tracking.');
        initTracking();
    });

})();
