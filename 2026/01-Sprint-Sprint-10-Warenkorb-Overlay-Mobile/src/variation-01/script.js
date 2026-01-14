// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(KEK) {
    "use strict";

    // SVGs Inline
    const checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" fill="none">' +
        '<path stroke="#00a63e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="m14 1-9 9-4-4"/>' +
    '</svg>';

    const chevronSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none">' +
        '<path stroke="#0a0a0a" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M9 1 5 5 1 1"/>' +
    '</svg>';

    // Nudge HTML Template
    function getNudgeHtml() {
        return '<div class="kk-nudge">' +
            '<span class="kk-nudge__icon">' + checkSvg + '</span>' +
            '<span class="kk-nudge__text"><b>Gute Wahl</b>, der Artikel liegt in Ihrem Warenkorb.</span>' +
        '</div>';
    }

    // Collapsible HTML Template
    function getCollapsibleHtml() {
        return '<div class="kk-collapsible">' +
            '<button class="kk-collapsible__header" aria-expanded="false">' +
                '<span class="kk-collapsible__icon">' + chevronSvg + '</span>' +
                '<span class="kk-collapsible__text">Den ganzen Look sehen</span>' +
            '</button>' +
            '<div class="kk-collapsible__content">' +
                '<p>Blindtext</p>' +
            '</div>' +
        '</div>';
    }

    // Toggle-Funktion für Collapsible
    function toggleCollapsible(header) {
        const collapsible = header.parentElement;
        const isOpen = collapsible.classList.contains('kk-collapsible--open');
        const textEl = KEK.qs('.kk-collapsible__text', header);

        if (isOpen) {
            collapsible.classList.remove('kk-collapsible--open');
            header.setAttribute('aria-expanded', 'false');
            if (textEl) textEl.textContent = 'Den ganzen Look sehen';
        } else {
            collapsible.classList.add('kk-collapsible--open');
            header.setAttribute('aria-expanded', 'true');
            if (textEl) textEl.textContent = 'Den ganzen Look einklappen';
        }
    }

    // 1. Headline anpassen
    KEK.observe('[data-testid="minicart"]', function(minicart) {
        // Auf Headline warten (sollte immer da sein)
        KEK.elem('[class*="miniCart__headline"]', function(headlines) {
            if (!headlines) return;
            const headline = headlines[0];
            headline.textContent = 'Mein Warenkorb';

            // Auf Entries warten, dann Anzahl updaten (können leer sein bei leerem Warenkorb)
            KEK.elem('[data-testid="mincart-entry-remove-button"]', function(entries) {
                if (!entries) return;
                headline.textContent += ' (' + entries.length + ')';
            });

            // 2. Nudge unter Headline einfügen
            if (!headline.nextElementSibling?.classList.contains('kk-nudge')) {
                KEK.insert(headline, 'afterend', getNudgeHtml());
            }
        });

        // 3. Collapsibles einfügen
        KEK.elem('[class*="miniCart__entryWrapper"] > [class*="miniCartEntry__"]', function(entries) {
            if (!entries) return;

            entries.forEach(function(entry) {
                // Prüfen ob bereits eingefügt (nach dem Entry)
                if (entry.nextElementSibling?.classList.contains('kk-collapsible')) return;

                // Collapsible nach dem Entry einfügen
                KEK.insert(entry, 'afterend', getCollapsibleHtml());

                // Click-Handler
                const collapsible = entry.nextElementSibling;
                const header = KEK.qs('.kk-collapsible__header', collapsible);
                if (header) {
                    header.addEventListener('click', function() {
                        toggleCollapsible(header);
                    });
                }
            });
        });
    });

})(new window.KEK());
