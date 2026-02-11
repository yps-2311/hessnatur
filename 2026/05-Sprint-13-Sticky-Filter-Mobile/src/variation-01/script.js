// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @project 05-Sprint-13-Sticky-Filter-Mobile
 * @author Anton Müller
 * @date 4. Februar 2026
 * @variation 01
 * @description Sticky Filter/Sortierung auf mobilen PLPs & SRPs mit Event-Tracking für Filter-Tabs und Kategorien
 */
(function(KEK) {
    "use strict";

    //console.log('[Sprint 13] Script loaded, viewport:', window.innerWidth);

    // Nur auf Mobile (< 640px)
    if (window.innerWidth >= 640) {
        //console.log('[Sprint 13] Desktop detected, aborting.');
        return;
    }

    //console.log('[Sprint 13] Mobile detected, initializing...');

    // Tracking Helper
    const trackClick = (eventName, action, category) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event_name: eventName,
            filter_action: action,
            filter_category: category || ''
        });
        //console.log('[Sprint 13] Tracked:', { event_name: eventName, filter_action: action, filter_category: category });
    };

    // Init Tracking mit Event Delegation (erfasst auch dynamisch geladene Elemente)
    const initTracking = (wrapper) => {
        //console.log('[Sprint 13] Wrapper found, attaching event delegation.');
        wrapper.addEventListener('click', (e) => {
            const target = e.target;

            // Filter/Sortieren Tab Clicks
            const tabTrigger = target.closest('.FilterSortTabs_filterSortTabs__trigger__Hjs7L');
            if (tabTrigger) {
                const triggers = wrapper.querySelectorAll('.FilterSortTabs_filterSortTabs__trigger__Hjs7L');
                const index = Array.from(triggers).indexOf(tabTrigger);
                const action = index === 0 ? 'Clicke Filter' : 'Clicke Sortieren';
                trackClick('filter_click', action, '');
                return;
            }

            // Filter-Kategorie Clicks
            const categoryBtn = target.closest('.FilterElement_filterAccordionItem__header__fALCo button');
            if (categoryBtn) {
                const categoryName = categoryBtn.textContent.trim();
                trackClick('filter_click', 'Clicke Filter', categoryName);
                return;
            }

            // Sortier-Optionen Clicks
            const sortBtn = target.closest('.SortBy_sortBy__item__4ELSR');
            if (sortBtn) {
                const optionName = sortBtn.textContent.trim();
                trackClick('filter_click', 'Clicke Sortieren', optionName);
                return;
            }

            // Schließen-Button Clicks
            const closeBtn = target.closest('.FilterSortTabs_filterSortTabs__close-all-button__X7GUA');
            if (closeBtn) {
                const panel = closeBtn.closest('[role="tabpanel"]');
                const panels = wrapper.querySelectorAll('[role="tabpanel"]');
                const panelIndex = Array.from(panels).indexOf(panel);
                const action = panelIndex === 0 ? 'Clicke Filter' : 'Clicke Sortieren';
                trackClick('filter_click', action, 'Schließen');
                return;
            }
        });
    };

    // Init Test (SPA-safe mit KEK.elem Polling)
    // console.log('[Sprint 13] Starting KEK.elem polling for wrapper...');
    KEK.elem('.plp_filterSortTabsWrapper__LkAYd', (wrappers) => {
        if (!wrappers) {
            // console.log('[Sprint 13] Wrapper NOT found (timeout).');
            return;
        }
        console.log('[Sprint 13] Wrapper found:', wrappers[0]);
        initTracking(wrappers[0]);
    });

})(new window.KEK());
