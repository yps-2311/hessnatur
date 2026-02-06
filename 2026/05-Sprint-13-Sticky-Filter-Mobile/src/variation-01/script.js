// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @project 05-Sprint-13-Sticky-Filter-Mobile
 * @author Manuel Brückmann
 * @date 4. Februar 2026
 * @variation 01
 * @description Sticky Filter/Sortierung auf mobilen PLPs & SRPs mit Event-Tracking für Filter-Tabs und Kategorien
 */
(function(KEK) {
    "use strict";

    // Tracking Helper
    const trackClick = (eventName, action, category) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event_name: eventName,
            filter_action: action,
            filter_category: category || ''
        });
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
        });

        // Track Schließen-Button Click
        KEK.elem('.FilterSortTabs_filterSortTabs__close-all-button__X7GUA', (closeBtns) => {
            if (!closeBtns) return;

            closeBtns[0].addEventListener('click', () => {
                trackClick('filter_click', 'Clicke Filter', 'Schließen');
            });
        });
    };

    // Init Test (SPA-safe mit KEK.elem Polling)
    KEK.elem('.plp_filterSortTabsWrapper__LkAYd', (wrapper) => {
        if (!wrapper) return;
        initTracking();
    });

})(new window.KEK());
