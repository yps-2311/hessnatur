// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description Sprint 10 – Warenkorb Layer Mobile
 */
(function(KEK) {
    "use strict";

    // =========================================================================
    // CONSTANTS & TEMPLATES
    // =========================================================================

    const STORAGE_KEY = 'kk-reco';

    // Flag: Nudge nur anzeigen wenn Add-to-Cart geklickt wurde
    let showNudge = false;

    // SVGs Inline
    const checkSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" fill="none">' +
        '<path stroke="#00a63e" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="m14 1-9 9-4-4"/>' +
    '</svg>';

    const chevronSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none">' +
        '<path stroke="#0a0a0a" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M9 1 5 5 1 1"/>' +
    '</svg>';

    // =========================================================================
    // LOCALSTORAGE HELPERS
    // =========================================================================

    // Reco-Store aus localStorage holen
    function getRecoStore() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    // Produktname normalisieren (case-insensitive)
    function normalizeProductName(name) {
        return name.toLowerCase().trim();
    }

    // Reco für Produkt speichern
    function saveRecoForProduct(productName, products) {
        const store = getRecoStore();
        const key = normalizeProductName(productName);
        store[key] = { products: products };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch (e) {
            // localStorage voll oder nicht verfügbar
        }
    }

    // Reco für Produkt abrufen
    function getRecoForProduct(productName) {
        const store = getRecoStore();
        const key = normalizeProductName(productName);
        return store[key]?.products || null;
    }

    // =========================================================================
    // TRACKING HELPERS
    // =========================================================================

    // DataLayer Event: Collapsible geöffnet (view_promotion)
    function trackCollapsibleExpand(parentProductName, entryIndex) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'Ecommerce - view_promotion',
            event_name: 'view_promotion',
            ecommerce: {
                creative_name: 'kk_shop_the_look_' + parentProductName,
                creative_slot: 'add_to_cart_layer_' + entryIndex,
                promotion_name: 'kk_shop_the_look_add_to_cart_layer'
            }
        });
    }

    // DataLayer Event: Reco-Produkt angeklickt (select_promotion)
    function trackRecoClick(parentProductName, recoIndex) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'Ecommerce - select_promotion',
            event_name: 'select_promotion',
            ecommerce: {
                creative_name: 'kk_shop_the_look_' + parentProductName,
                creative_slot: 'add_to_cart_layer_reco_' + recoIndex,
                promotion_name: 'kk_shop_the_look_add_to_cart_layer'
            }
        });
    }

    // =========================================================================
    // RECO EXTRACTION (PDP)
    // =========================================================================

    // Complete-the-Look Daten von Container extrahieren
    function extractRecoFromContainer(container) {
        const cards = KEK.qsa('[data-testid="product-card"]', container);
        if (!cards || cards.length === 0) return null;

        const products = [];
        // Max. 3 Produkte
        const maxCards = Math.min(cards.length, 3);

        for (let i = 0; i < maxCards; i++) {
            const card = cards[i];
            const link = KEK.qs('a[href]', card);
            const headline = KEK.qs('[class*="productCard__headline"]', card);
            const priceLabel = KEK.qs('[data-testid="price-label"]', card);
            const img = KEK.qs('[data-testid="media"] img', card);

            if (headline && link) {
                products.push({
                    name: headline.textContent.trim(),
                    price: priceLabel ? priceLabel.textContent.trim() : '',
                    image: img ? img.src : '',
                    url: link.getAttribute('href')
                });
            }
        }

        return products.length > 0 ? products : null;
    }

    // Aktuellen Produktnamen der PDP holen
    function getCurrentProductName() {
        const title = KEK.qs('[data-testid="buy-box"] h1');
        return title ? title.textContent.trim() : null;
    }

    // =========================================================================
    // HTML TEMPLATES
    // =========================================================================

    // Nudge HTML Template
    function getNudgeHtml() {
        return '<div class="kk-nudge">' +
            '<span class="kk-nudge__icon">' + checkSvg + '</span>' +
            '<span class="kk-nudge__text"><b>Gute Wahl</b>, der Artikel liegt in Ihrem Warenkorb.</span>' +
        '</div>';
    }

    // Collapsible HTML Template mit Reco-Produkten
    function getCollapsibleHtml(recoProducts) {
        let contentHtml = '';

        if (recoProducts && recoProducts.length > 0) {
            contentHtml = '<div class="kk-reco">';
            recoProducts.forEach(function(product) {
                contentHtml += '<a href="' + product.url + '" class="kk-reco__item">' +
                    '<div class="kk-reco__image">' +
                        '<img src="' + product.image + '" alt="' + product.name + '" />' +
                    '</div>' +
                    '<div class="kk-reco__info">' +
                        '<p class="kk-reco__name">' + product.name + '</p>' +
                        '<p class="kk-reco__price">' + product.price + '</p>' +
                    '</div>' +
                '</a>';
            });
            contentHtml += '</div>';
        }

        return '<div class="kk-collapsible">' +
            '<button class="kk-collapsible__header" aria-expanded="false">' +
                '<span class="kk-collapsible__icon">' + chevronSvg + '</span>' +
                '<span class="kk-collapsible__text">Den ganzen Look sehen</span>' +
            '</button>' +
            '<div class="kk-collapsible__content">' +
                contentHtml +
            '</div>' +
        '</div>';
    }

    // =========================================================================
    // COLLAPSIBLE TOGGLE
    // =========================================================================

    function toggleCollapsible(header, parentProductName, entryIndex) {
        const collapsible = header.parentElement;
        const isOpen = KEK.qs('.kk-collapsible--open') === collapsible;
        const textEl = KEK.qs('.kk-collapsible__text', header);

        if (isOpen) {
            KEK.defineClass(collapsible, 'kk-collapsible--open', true);
            header.setAttribute('aria-expanded', 'false');
            if (textEl) textEl.textContent = 'Den ganzen Look sehen';
        } else {
            KEK.defineClass(collapsible, 'kk-collapsible--open');
            header.setAttribute('aria-expanded', 'true');
            if (textEl) textEl.textContent = 'Den ganzen Look einklappen';
            // Tracking: Collapsible geöffnet
            if (parentProductName) {
                trackCollapsibleExpand(parentProductName, entryIndex);
            }
        }
    }

    // =========================================================================
    // ADD-TO-CART LISTENER (PDP) - via KEK.observe für SPA-Kompatibilität
    // =========================================================================

    // Wenn Add-to-Cart Button erscheint/sich ändert (z.B. nach Größenwahl), Listener initialisieren
    KEK.observe('[data-testid="add-to-cart-button"]', function(btn) {
        // Prüfen ob bereits Listener (via data-Attribut)
        if (btn.dataset.kkListener) return;
        btn.dataset.kkListener = 'true';
        
        btn.addEventListener('click', function() {
            // Nudge aktivieren
            showNudge = true;

            const productName = getCurrentProductName();
            if (!productName) return;

            // Complete-the-Look suchen
            const container = KEK.qs('[data-testid="complete-the-look"]');
            if (!container) return;

            const recoData = extractRecoFromContainer(container);
            if (recoData) {
                saveRecoForProduct(productName, recoData);
            }
        });
    });

    // =========================================================================
    // MINICART MANIPULATION
    // =========================================================================

    // Helper: Headline-Anzahl aktualisieren
    function updateHeadlineCount() {
        const headline = KEK.qs('[class*="miniCart__headline"]');
        if (!headline) return;

        const entries = KEK.qsa('[class*="miniCart__entryWrapper"] > [class*="miniCartEntry__"]');
        const count = entries ? entries.length : 0;
        headline.textContent = 'Mein Warenkorb (' + count + ')';
    }

    // Helper: Alle Collapsibles entfernen
    function removeAllCollapsibles() {
        const allCollapsibles = KEK.qsa('.kk-collapsible');
        if (allCollapsibles) {
            allCollapsibles.forEach(function(c) {
                c.remove();
            });
        }
    }

    // Helper: Collapsibles für alle Entries initialisieren
    function initCollapsibles() {
        // Erst alle alten Collapsibles entfernen
        removeAllCollapsibles();

        const entries = KEK.qsa('[class*="miniCart__entryWrapper"] > [class*="miniCartEntry__"]');
        if (!entries) return;

        entries.forEach(function(entry, entryIndex) {
            // Produktname aus Entry-Title holen
            const titleEl = KEK.qs('[class*="miniCartEntry__title"] p', entry);
            if (!titleEl) return;
            const productName = titleEl.textContent.trim();

            // Reco für dieses Produkt aus localStorage holen
            const recoProducts = getRecoForProduct(productName);
            if (!recoProducts) return;

            // Collapsible mit Reco-Daten einfügen
            KEK.insert(entry, 'afterend', getCollapsibleHtml(recoProducts));

            // Click-Handler für Collapsible Toggle
            const collapsible = entry.nextElementSibling;
            const header = KEK.qs('.kk-collapsible__header', collapsible);
            if (header) {
                header.addEventListener('click', function() {
                    toggleCollapsible(header, productName, entryIndex);
                });
            }

            // Click-Handler für Reco-Produkte (Tracking)
            const recoLinks = KEK.qsa('.kk-reco__item', collapsible);
            if (recoLinks) {
                recoLinks.forEach(function(link, recoIndex) {
                    link.addEventListener('click', function() {
                        trackRecoClick(productName, recoIndex);
                    });
                });
            }
        });
    }

    // Helper: Remove-Button Listener hinzufügen (nur noch für Headline-Update, Collapsibles werden via Observer gehandelt)
    function initRemoveListeners() {
        const removeBtns = KEK.qsa('[data-testid="mincart-entry-remove-button"]');
        if (!removeBtns) return;

        removeBtns.forEach(function(btn) {
            if (btn.dataset.kkListener) return;
            btn.dataset.kkListener = 'true';
            // Kein Click-Handler mehr nötig - MutationObserver übernimmt
        });
    }

    // 1. Headline anpassen
    KEK.observe('[data-testid="minicart"]', function(minicart) {
        // Auf Headline warten
        KEK.elem('[class*="miniCart__headline"]', function(headlines) {
            if (!headlines) return;
            const headline = headlines[0];
            headline.textContent = 'Mein Warenkorb';

            // Auf Entries warten, dann Anzahl updaten
            KEK.elem('[data-testid="mincart-entry-remove-button"]', function(entries) {
                if (!entries) return;
                headline.textContent += ' (' + entries.length + ')';
            });

            // 2. Nudge unter Headline einfügen (nur wenn Add-to-Cart geklickt wurde)
            if (showNudge) {
                // Prüfen ob Nudge bereits existiert
                const existingNudge = KEK.qs('.kk-nudge');
                if (!existingNudge) {
                    KEK.insert(headline, 'afterend', getNudgeHtml());
                }
                // Flag zurücksetzen nach Anzeige
                showNudge = false;
            }
        });

        // 3. Collapsibles mit Reco einfügen
        KEK.elem('[class*="miniCart__entryWrapper"]', function(wrappers) {
            if (!wrappers) return;
            const entryWrapper = wrappers[0];

            // Initial: Collapsibles aufbauen
            initCollapsibles();
            initRemoveListeners();

            // Aktuelle Entry-Anzahl tracken
            let lastEntryCount = KEK.qsa('[class*="miniCart__entryWrapper"] > [class*="miniCartEntry__"]')?.length || 0;

            // MutationObserver: Nur bei Entry-Anzahl-Änderung neu initialisieren
            const observer = new MutationObserver(function() {
                const currentEntryCount = KEK.qsa('[class*="miniCart__entryWrapper"] > [class*="miniCartEntry__"]')?.length || 0;
                
                // Nur reagieren wenn sich Entry-Anzahl geändert hat
                if (currentEntryCount !== lastEntryCount) {
                    lastEntryCount = currentEntryCount;
                    initCollapsibles();
                    initRemoveListeners();
                    updateHeadlineCount();
                }
            });

            observer.observe(entryWrapper, { childList: true, subtree: false });
        });
    });

})(new window.KEK());
