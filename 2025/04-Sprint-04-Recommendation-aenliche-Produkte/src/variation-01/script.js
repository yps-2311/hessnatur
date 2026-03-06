// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Anton Müller
 * @namespace V1
 * @name Variation 01
 * @description econda Recommendation Widget auf PDP
 */
(function(KEK, win) {
    "use strict";

    const DEBUG = true;
    function log() { if (DEBUG) console.log.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }
    function warn() { if (DEBUG) console.warn.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }
    function err() { if (DEBUG) console.error.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }

    log('Script gestartet');

    // Early exit für nicht-PDP Seiten
    if (!/\/p\/\d+/.test(win.location.pathname)) {
        log('Keine PDP - Exit');
        return;
    }

    // =========================================================================
    // SELEKTOREN (nur >3x genutzte als Konstante)
    // =========================================================================

    const SEL_OLD_RECO = '[data-testid="recommendation"]';
    const SEL_RECO_WRAPPER = '[data-testid="recommendation-wrapper"]';
    const SEL_SWIPER_WRAPPER = '.swiper-wrapper';

    // =========================================================================
    // STATE & KONFIGURATION
    // =========================================================================

    const CSIZE = 20;
    const STORAGE_KEY = 'kk-reco-cache';
    const DOM_STABLE_DELAY = 400;

    const cache = {
        lastRenderedUrl: null,
        wrapper: null,
        isLoading: false,
        currentRequestToken: null
    };

    // Lokaler Wishlist-State (synchron verfügbar für fillProductCard)
    let wishlistedIds = new Set();

    function isProductWishlisted(econdaId) {
        let found = false;
        wishlistedIds.forEach((code) => {
            if (code.indexOf(econdaId) === 0) found = true;
        });
        return found;
    }

    // =========================================================================
    // FALLBACK – Original-Reco wieder einblenden
    // =========================================================================

    function showOriginalReco() {
        const antiFlicker = KEK.qs('#kk-reco-antiflicker');
        if (antiFlicker) {
            antiFlicker.remove();
            warn('Fallback: Original-Reco wieder eingeblendet');
        }
    }

    // =========================================================================
    // ANTI-FLICKER – sofort injizieren um native Reco zu verstecken
    // =========================================================================

    function injectAntiFlicker() {
        if (KEK.qs('#kk-reco-antiflicker')) return;
        KEK.insert(
            document.head || document.documentElement,
            'beforeend',
            '<style id="kk-reco-antiflicker">' +
                '[data-testid="recommendation"] .swiper-wrapper { opacity: 0 !important; }' +
                '[data-testid="recommendation"] .swiper-wrapper.kk-slides-active { opacity: 1 !important; }' +
                '[data-testid="recommendation"] .swiper-wrapper.kk-slides-fadein { transition-property: opacity; transition-duration: 0.15s; transition-timing-function: ease-out; }' +
            '</style>'
        );
    }

    injectAntiFlicker();

    // =========================================================================
    // STYLE INJECTION
    // =========================================================================

    function addRecoStyles() {
        if (KEK.qs('#kk-reco-styles')) return;

        KEK.insert(
            document.head || document.documentElement,
            'beforeend',
            '<style id="kk-reco-styles">' +
                '.kk-reco-fade { transition-property: opacity; transition-duration: 0.1s; transition-timing-function: ease-out; }' +
                '.kk-reco-fade.kk-fading { opacity: 0; }' +
            '</style>'
        );
    }

    // =========================================================================
    // COUNTRY DETECTION
    // =========================================================================

    function getCountry() {
        const pathMatch = win.location.pathname.match(/^\/([a-z]{2})\//);
        if (pathMatch) return pathMatch[1];

        const htmlLang = document.documentElement.lang;
        if (htmlLang) return htmlLang.split('-')[0].toLowerCase();

        return 'de';
    }

    // =========================================================================
    // WISHLIST – Cookie & API
    // =========================================================================

    function getWishlistCookie() {
        const match = document.cookie.match(/(?:^|;\s*)HessnaturDESite-wishlist=([^;]+)/);
        return match ? match[1] : null;
    }

    function fetchWishlistSKUs() {
        const guid = getWishlistCookie();
        if (!guid) {
            log('Kein Wishlist-Cookie - leeres Set');
            return Promise.resolve(new Set());
        }

        const country = getCountry();
        const body = JSON.stringify({
            query: 'query getWishlist($country: String!, $lang: String!, $guid: String) { wishlist(country: $country, lang: $lang, guid: $guid) { code entries { entryNumber product { code name baseProduct } } } }',
            variables: { country: country.toUpperCase(), lang: country, guid: guid }
        });

        return fetch('/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then((res) => res.json())
        .then((data) => {
            const entries = data && data.data && data.data.wishlist && data.data.wishlist.entries;
            if (!entries) return new Set();
            const codes = new Set();
            entries.forEach((entry) => {
                if (entry.product && entry.product.code) {
                    codes.add(entry.product.code);
                }
            });
            log('Wishlist geladen:', codes.size, 'Einträge');
            return codes;
        })
        .catch((e) => {
            warn('Wishlist API Fehler:', e);
            return new Set();
        });
    }

    // =========================================================================
    // WISHLIST – Button State Sync
    // =========================================================================

    function syncWishlistButtons() {
        fetchWishlistSKUs().then((wishlistCodes) => {
            // Lokalen State aktualisieren
            wishlistedIds = wishlistCodes;
            log('wishlistedIds aktualisiert:', wishlistedIds.size, 'Einträge');

            const slides = KEK.qsa('[data-kk-product]');
            if (!slides || !slides.length) {
                log('syncWishlist: keine [data-kk-product] Slides gefunden');
                return;
            }

            log('syncWishlist: ', wishlistCodes.size, 'Wishlist-Codes, ', slides.length, 'Slides');

            slides.forEach((slide) => {
                const econdaId = slide.getAttribute('data-kk-product');
                const btn = KEK.qs('.kk-wishlist-btn', slide) || KEK.qs('[data-testid="add-to-wishlist-button"]', slide);
                if (!btn || !econdaId) return;

                let isOnWishlist = false;
                wishlistCodes.forEach((code) => {
                    if (code.indexOf(econdaId) === 0) {
                        isOnWishlist = true;
                        log('syncWishlist Match: code', code, 'starts with econdaId', econdaId);
                    }
                });

                if (isOnWishlist) {
                    markButtonAsWishlisted(btn);
                } else {
                    unmarkButtonAsWishlisted(btn);
                }
            });
            log('Wishlist-Buttons synchronisiert');
        });
    }

    // Wishlist-Sync mit Retries (gegen React-Race-Conditions)
    let syncRetryTimers = [];
    function scheduleWishlistSync() {
        // Alte Retries canceln
        syncRetryTimers.forEach((t) => clearTimeout(t));
        syncRetryTimers = [];

        // Sofort + verzögerte Retries
        const delays = [0, 1500, 3000];
        delays.forEach((delay) => {
            const timer = setTimeout(() => {
                log('scheduleWishlistSync: Sync nach', delay, 'ms');
                syncWishlistButtons();
            }, delay);
            syncRetryTimers.push(timer);
        });
    }

    function markButtonAsWishlisted(btn) {
        if (!btn) return;
        KEK.defineClass(btn, 'AddToWishlistButton_added__X4ouM');
        const svg = KEK.qs('svg', btn);
        if (svg) {
            svg.setAttribute('data-prefix', 'fas');
            svg.setAttribute('data-icon', 'heart');
            const path = KEK.qs('path', svg);
            if (path) {
                path.setAttribute('d', 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z');
            }
        }
    }

    function unmarkButtonAsWishlisted(btn) {
        if (!btn) return;
        KEK.defineClass(btn, 'AddToWishlistButton_added__X4ouM', true);
        const svg = KEK.qs('svg', btn);
        if (svg) {
            svg.setAttribute('data-prefix', 'far');
            svg.setAttribute('data-icon', 'heart');
            const path = KEK.qs('path', svg);
            if (path) {
                path.setAttribute('d', 'M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z');
            }
        }
    }
    
    // =========================================================================
    // ANTI-FLICKER – Hide/Show Reco
    // =========================================================================

    function hideReco(element) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.15s ease-out';
    }

    function showReco(element) {
        if (!element) return;
        element.style.opacity = '1';
    }

    // =========================================================================
    // DOM STABILITY – Warte bis React fertig
    // =========================================================================

    function waitForStableDOM(element, callback, recoElement) {
        if (recoElement) hideReco(recoElement);
        let timer = null;
        let observer = null;
        let hasTriggered = false;

        const triggerCallback = () => {
            if (hasTriggered) return;
            hasTriggered = true;
            if (observer) observer.disconnect();
            clearTimeout(timer);
            log('DOM stabil - starte Rendering');
            callback(() => {
                if (recoElement) showReco(recoElement);
            });
        };

        observer = new MutationObserver(function() {
            clearTimeout(timer);
            timer = setTimeout(triggerCallback, DOM_STABLE_DELAY);
        });

        observer.observe(element, { childList: true, subtree: true });

        timer = setTimeout(triggerCallback, DOM_STABLE_DELAY);

        log('Warte auf stabilen DOM (' + DOM_STABLE_DELAY + 'ms)...');
    }

    // =========================================================================
    // SESSION STORAGE CACHE
    // =========================================================================

    function getCachedProducts(productUrl) {
        try {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const entry = data[productUrl];

            // 30 Minuten TTL
            if (entry && (Date.now() - entry.timestamp) < 30 * 60 * 1000) {
                log('Cache Hit für URL:', productUrl);
                return entry.products;
            }

            if (entry) {
                delete data[productUrl];
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch (e) {
            warn('Cache Lesefehler:', e);
        }
        return null;
    }

    function getCacheWasExhausted(productUrl) {
        try {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return false;

            const data = JSON.parse(cached);
            const entry = data[productUrl];

            return entry && entry.exhausted === true;
        } catch (e) {
            return false;
        }
    }

    function setCachedProducts(productUrl, products, exhausted) {
        try {
            const cached = sessionStorage.getItem(STORAGE_KEY);
            const data = cached ? JSON.parse(cached) : {};

            const keys = Object.keys(data);
            if (keys.length > 10) {
                const oldest = keys.reduce((a, b) => data[a].timestamp < data[b].timestamp ? a : b);
                delete data[oldest];
            }

            data[productUrl] = {
                products: products,
                timestamp: Date.now(),
                exhausted: exhausted || false
            };

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            log('Cache gespeichert für URL:', productUrl, '(' + products.length + ' Produkte, exhausted:', exhausted + ')');
        } catch (e) {
            warn('Cache Schreibfehler:', e);
        }
    }

    // =========================================================================
    // URL & PRODUKT-ID HELPER
    // =========================================================================

    function getProductId() {
        const match = win.location.pathname.match(/\/p\/(\d+)/);
        return match ? match[1] : null;
    }

    function getProductUrl() {
        return win.location.pathname;
    }

    // =========================================================================
    // WISHLIST – Add Action
    // =========================================================================

    function openWishlistOverlayOnMobile() {
        const isMobile = win.matchMedia ? win.matchMedia('(max-width: 1023px)').matches : win.innerWidth < 1024;
        if (!isMobile) return false;

        function clickLikeUser(element) {
            if (!element) return false;
            try {
                ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
                    element.dispatchEvent(new MouseEvent(type, {
                        bubbles: true,
                        cancelable: true,
                        view: win
                    }));
                });
                return true;
            } catch (e) {
                return false;
            }
        }

        function clickCounterAncestorChain(counterElement) {
            let current = counterElement;
            let depth = 0;
            while (current && depth < 7) {
                const clicked = clickLikeUser(current);
                if (clicked) {
                    log('Wishlist-Overlay Trigger über Counter-Chain versucht (depth=' + depth + ')');
                    return true;
                }
                current = current.parentElement;
                depth++;
            }
            return false;
        }

        // Primär: event-basierte Overlay-Öffnung (falls kein Trigger-Element im DOM existiert)
        const openEvents = [
            'hessnatur:openWishlist',
            'hessnatur:openWishlistOverlay',
            'hessnatur:toggleWishlistOverlay',
            'hessnatur:openDrawer'
        ];
        openEvents.forEach((eventName) => {
            win.dispatchEvent(new CustomEvent(eventName, {
                detail: {
                    source: 'kk-reco',
                    panel: 'wishlist',
                    open: true
                }
            }));
        });
        log('Wishlist-Overlay Open-Events dispatched');

        const wishlistCounter = KEK.qs('[data-testid="wishlist-counter"]');
        if (wishlistCounter) {
            if (clickCounterAncestorChain(wishlistCounter)) {
                return true;
            }

            const counterTrigger = wishlistCounter.closest('button, a, [role="button"]');
            if (counterTrigger && counterTrigger.getAttribute('data-testid') !== 'add-to-wishlist-button') {
                log('Wishlist-Overlay Trigger über wishlist-counter gefunden');
                clickLikeUser(counterTrigger);
                return true;
            }
        }

        // Header/Topbar Trigger für Wishlist-Overlay (nicht PDP-Buttons)
        const overlayTriggerSelectors = [
            '[data-testid="wishlist-counter"]',
            'button[data-testid="wishlist-button"]',
            'button[aria-controls*="wishlist" i]',
            'button[aria-label*="Merkliste" i]',
            'button[aria-label*="wishlist" i]',
            '[data-testid*="wishlist"][role="button"]'
        ];

        for (let i = 0; i < overlayTriggerSelectors.length; i++) {
            const selector = overlayTriggerSelectors[i];
            const candidates = KEK.qsa(selector) || [];
            const candidateList = Array.prototype.slice.call(candidates);
            let trigger = null;

            for (let j = 0; j < candidateList.length; j++) {
                const el = candidateList[j];
                if (!el) continue;
                const triggerEl = el.matches('button, a, [role="button"]') ? el : el.closest('button, a, [role="button"]');
                if (!triggerEl) continue;
                if (triggerEl.getAttribute('data-testid') === 'add-to-wishlist-button') continue;
                if (el.closest('[data-testid="product-card"]')) continue;
                if (el.closest('[data-testid="buy-box"]')) continue;
                trigger = triggerEl;
                break;
            }
            if (trigger) {
                log('Wishlist-Overlay Trigger gefunden:', selector);
                clickLikeUser(trigger);
                return true;
            }
        }

        // Heuristik: interaktive Header-Elemente mit Wishlist/Merkliste-Merkmalen
        const interactiveElements = KEK.qsa('button, a, [role="button"]') || [];
        const interactiveList = Array.prototype.slice.call(interactiveElements);
        const keywordRegex = /(wishlist|merkliste|merkzettel)/i;

        for (let i = 0; i < interactiveList.length; i++) {
            const el = interactiveList[i];
            if (!el) continue;
            if (el.closest('[data-testid="product-card"]')) continue;
            if (el.closest('[data-testid="buy-box"]')) continue;
            if (el.closest('[data-testid="recommendation"]')) continue;

            const attrs = [
                el.getAttribute('data-testid') || '',
                el.getAttribute('aria-label') || '',
                el.getAttribute('aria-controls') || '',
                el.getAttribute('href') || '',
                el.className || '',
                el.textContent || ''
            ].join(' ');

            if (!keywordRegex.test(attrs)) continue;
            if (el.getAttribute('data-testid') === 'add-to-wishlist-button') continue;

            log('Wishlist-Overlay Trigger heuristisch gefunden');
            clickLikeUser(el);
            return true;
        }

        warn('Kein Wishlist-Overlay Trigger gefunden - kein Seitenwechsel ausgeführt');
        return false;
    }

    function addToWishlist(productCode, product, btn) {
        log('Wishlist Add via Custom Event:', productCode);

        win.dispatchEvent(new CustomEvent('hessnatur:addToWishlist', {
            detail: {
                productCode: productCode,
                source: 'kk-reco',
                openWishlist: true,
                openWishlistOverlay: true
            }
        }));

        markButtonAsWishlisted(btn);

        // Optimistisch in lokalen State übernehmen
        wishlistedIds.add(productCode);
        log('wishlistedIds optimistisch hinzugefügt:', productCode);

        setTimeout(syncWishlistButtons, 1500);
    }

    // =========================================================================
    // PREIS-PARSING & DISCOUNT
    // =========================================================================

    function parsePrice(priceString) {
        if (!priceString) return null;
        const cleaned = priceString.replace(/[^\d,\.]/g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    function calculateDiscount(oldPrice, currentPrice) {
        const oldNum = parsePrice(oldPrice);
        const currentNum = parsePrice(currentPrice);

        if (oldNum === null || currentNum === null || oldNum <= 0) return null;

        const discount = Math.round((1 - currentNum / oldNum) * 100);
        return discount > 0 ? discount : null;
    }

    // =========================================================================
    // GA4 DATALAYER TRACKING
    // =========================================================================

    function pushDataLayerEvent(eventType, product, index) {
        win.dataLayer = win.dataLayer || [];

        const priceFloat = parsePrice(product.price);
        const discount = calculateDiscount(product.oldprice1, product.price);

        const item = {
            item_id: product.id || '',
            item_name: product.name || '',
            item_list_name: 'Ähnliche Produkte',
            item_variant: product.sku || '',
            index: index,
            currency: 'EUR'
        };

        if (priceFloat !== null) {
            item.price = priceFloat;
        }

        if (discount !== null) {
            item.discount = discount;
        }

        const eventData = {
            event: 'select_item_from_list',
            item_list_name: 'Ähnliche Produkte',
            interaction_type: eventType,
            items: [item]
        };

        if (priceFloat !== null) {
            eventData.value = priceFloat;
            eventData.currency = 'EUR';
        }

        win.dataLayer.push(eventData);
        log('DataLayer Event gepusht:', eventData);
    }

    // =========================================================================
    // PRODUCT CARD – Rendering
    // =========================================================================

    function fillProductCard(card, product, index) {
        const id = product.id || '';
        const name = product.name || '';
        const image = product.iconurl || product.imageurl || '';
        const originalPrice = product.oldprice || product.oldprice1 || '';
        const currentPrice = product.price || '';
        const showAsDiscounted = product.reduced === 'true' && originalPrice.length > 0;

        let url = product.deeplink || '';
        if (!url && id) {
            url = 'https://www.hessnatur.com/' + getCountry() + '/p/' + id;
        }
        if (!url) url = '#';

        // Link
        const link = KEK.qs('a', card);
        if (link) {
            link.href = url;
            link.title = name;
            link.setAttribute('data-product-id', id);
            link.setAttribute('data-reco-index', index);

            if (link._clickHandler) {
                link.removeEventListener('click', link._clickHandler);
            }

            link._clickHandler = () => {
                pushDataLayerEvent('click', product, index);
            };
            link.addEventListener('click', link._clickHandler);
        }

        // Bild
        const img = KEK.qs('[data-testid="media"] img', card);
        if (img && image) {
            img.removeAttribute('srcset');
            img.src = image;
            img.alt = name;
            img.title = name;
        }

        // Titel
        const headline = KEK.qs('[class*="ProductCard_productCard__headline"]', card);
        if (headline) headline.textContent = name;

        // Preis – alle 3 Elemente existieren garantiert (Template-Normalisierung)
        const priceLabel = KEK.qs('[data-testid="price-label"]', card);
        const priceDiscounted = KEK.qs('[data-testid="price-label-discounted"]', card);
        const priceStriked = KEK.qs('[data-testid="price-label-striked"]', card);

        // ALLE Preis-Wrapper verstecken
        if (priceLabel) priceLabel.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = 'none';
        if (priceDiscounted) priceDiscounted.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = 'none';
        if (priceStriked) priceStriked.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = 'none';

        if (showAsDiscounted) {
            // Reduziert: Streichpreis + Aktionspreis in Rot
            if (priceDiscounted) {
                priceDiscounted.textContent = currentPrice;
                priceDiscounted.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = '';
            }
            if (priceStriked) {
                priceStriked.textContent = originalPrice;
                priceStriked.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = '';
            }
        } else {
            // Regulärer Preis: schwarzer Preis
            if (priceLabel) {
                priceLabel.textContent = currentPrice;
                priceLabel.style.color = '#000';
                priceLabel.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]').style.display = '';
            }
        }

        // Wishlist-Button – klonen um React-Binding zu umgehen
        const wishlistBtn = KEK.qs('[data-testid="add-to-wishlist-button"]', card);
        if (wishlistBtn) {
            const newBtn = wishlistBtn.cloneNode(true);
            const wishlistCode = product.sku || id;
            log('Wishlist-Code für Produkt', id, ':', wishlistCode);

            newBtn.setAttribute('data-code', wishlistCode);
            newBtn.setAttribute('data-reco-index', index);
            KEK.defineClass(newBtn, 'kk-wishlist-btn');

            // Wishlist-State synchron aus lokalem Set anwenden
            if (isProductWishlisted(id)) {
                markButtonAsWishlisted(newBtn);
                log('Wishlist-State aus lokalem Set: markiert für', id);
            }

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const econdaId = id || product.productid || '';
                const alreadyWishlisted = isProductWishlisted(econdaId);
                if (alreadyWishlisted) {
                    log('Produkt bereits auf Wishlist - kein Add/Overlay:', econdaId);
                    return false;
                }

                log('Wishlist Button geklickt, code:', wishlistCode);
                pushDataLayerEvent('wishlist', product, index);
                addToWishlist(wishlistCode, product, newBtn);
                openWishlistOverlayOnMobile();

                return false;
            }, true);
            wishlistBtn.parentNode.replaceChild(newBtn, wishlistBtn);
        }
    }

    // =========================================================================
    // DEDUPLICATION
    // =========================================================================

    function dedupeProducts(products, excludeId) {
        const seen = {};
        return products.filter((p) => {
            if (excludeId && p.id === excludeId) {
                log('Produkt ausgeschlossen (aktuelles PDP):', p.id);
                return false;
            }
            if (seen[p.id]) return false;
            seen[p.id] = true;
            return true;
        });
    }

    // =========================================================================
    // INIT ECONDA RECO – Rendering in bestehenden Swiper
    // =========================================================================

    function initEcondaReco(wrapper, products, onComplete) {
        log('initEcondaReco mit', products.length, 'Produkten');

        const oldReco = KEK.qs(SEL_OLD_RECO, wrapper);
        if (!oldReco) {
            err('Original-Reco nicht gefunden');
            if (onComplete) onComplete();
            return;
        }

        const swiperWrapper = KEK.qs(SEL_SWIPER_WRAPPER, oldReco);
        if (!swiperWrapper) {
            err('Swiper-Wrapper nicht gefunden');
            if (onComplete) onComplete();
            return;
        }

        addRecoStyles();

        // Template IMMER frisch klonen – nie cachen (verhindert vergifteten Wishlist-State)
        const templateSlide = KEK.qs('.swiper-slide', swiperWrapper);
        if (!templateSlide) {
            if (onComplete) onComplete();
            return;
        }
        const template = templateSlide.cloneNode(true);

        // Template bereinigen: Wishlist-State zurücksetzen
        const tplWishBtn = KEK.qs('[data-testid="add-to-wishlist-button"]', template);
        if (tplWishBtn) {
            KEK.defineClass(tplWishBtn, 'AddToWishlistButton_added__X4ouM', true);
            KEK.defineClass(tplWishBtn, 'kk-wishlist-btn', true);
            const tplSvg = KEK.qs('svg', tplWishBtn);
            if (tplSvg) {
                tplSvg.setAttribute('data-prefix', 'far');
                tplSvg.setAttribute('data-icon', 'heart');
                const tplPath = KEK.qs('path', tplSvg);
                if (tplPath) {
                    tplPath.setAttribute('d', 'M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z');
                }
            }
        }

        // Template bereinigen: Preis-Elemente normalisieren
        // Je nach Template-Produkt fehlen bestimmte Preis-Container.
        // Wir stellen sicher, dass ALLE 3 (price-label, price-label-discounted,
        // price-label-striked) existieren, damit fillProductCard nur native
        // Hessnatur-Elemente nutzen muss.
        const tplCard = KEK.qs('[data-testid="product-card"]', template);
        if (tplCard) {
            const tplPriceLabel = KEK.qs('[data-testid="price-label"]', tplCard);
            const tplPriceDisc = KEK.qs('[data-testid="price-label-discounted"]', tplCard);
            const tplPriceStriked = KEK.qs('[data-testid="price-label-striked"]', tplCard);

            // Referenz-Wrapper: irgendeines der vorhandenen Preis-Elemente
            const refSpan = tplPriceLabel || tplPriceDisc || tplPriceStriked;
            const refWrapper = refSpan ? refSpan.closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]') : null;
            const priceContainer = refWrapper ? refWrapper.parentElement : null;

            if (priceContainer) {
                // Fehlende Elemente mit nativen Hessnatur-Klassen erstellen
                if (!tplPriceLabel) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'PriceLabel_priceRow__priceLabel--productCard__zOye_';
                    wrapper.style.display = 'none';
                    const span = document.createElement('span');
                    span.setAttribute('aria-hidden', 'true');
                    span.setAttribute('data-testid', 'price-label');
                    wrapper.appendChild(span);
                    priceContainer.insertBefore(wrapper, refWrapper);
                }

                if (!tplPriceDisc) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'PriceLabel_priceRow__priceLabel--productCard__zOye_ PriceLabel_priceRow__priceLabel--discounted__rpPhy';
                    wrapper.style.display = 'none';
                    const span = document.createElement('span');
                    span.setAttribute('aria-hidden', 'true');
                    span.setAttribute('data-testid', 'price-label-discounted');
                    wrapper.appendChild(span);
                    priceContainer.insertBefore(wrapper, refWrapper.nextSibling);
                }

                if (!tplPriceStriked) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'PriceLabel_priceRow__priceLabel--productCard__zOye_ PriceLabel_priceRow__priceLabel--striked__F_I_p';
                    wrapper.style.display = 'none';
                    const span = document.createElement('span');
                    span.setAttribute('aria-hidden', 'true');
                    span.setAttribute('data-testid', 'price-label-striked');
                    wrapper.appendChild(span);
                    // Striked kommt nach Discounted
                    const discWrapper = KEK.qs('[data-testid="price-label-discounted"]', tplCard).closest('[class*="PriceLabel_priceRow__priceLabel--productCard"]');
                    priceContainer.insertBefore(wrapper, discWrapper ? discWrapper.nextSibling : null);
                }

                // Alle Preis-Wrapper initial verstecken
                KEK.qsa('[class*="PriceLabel_priceRow__priceLabel--productCard"]', tplCard).forEach((el) => {
                    el.style.display = 'none';
                });
            }
        }

        log('Rendere', products.length, 'Produkte');

        const fragment = document.createDocumentFragment();

        products.forEach((product, index) => {
            const newSlide = template.cloneNode(true);
            newSlide.className = 'swiper-slide';
            // Kein Inline-Style: Swiper berechnet width/marginRight
            // selbst via breakpoints nach swiper.update()
            newSlide.setAttribute('aria-label', (index + 1) + ' / ' + products.length);
            newSlide.setAttribute('data-kk-product', product.id || product.productid || '');

            const card = KEK.qs('[data-testid="product-card"]', newSlide);
            if (card) fillProductCard(card, product, index);

            fragment.appendChild(newSlide);
        });

        const isUpdate = oldReco.classList.contains('kk-reco-updated');
        const fadeDelay = isUpdate ? 100 : 0;

        if (isUpdate) {
            KEK.defineClass(swiperWrapper, 'kk-reco-fade');
            KEK.defineClass(swiperWrapper, 'kk-fading');
        }

        setTimeout(() => {
            swiperWrapper.innerHTML = '';
            swiperWrapper.appendChild(fragment);
            // Kurz fade-in-Klasse für Opacity-Transition, dann sofort entfernen
            // damit Swiper's transform-Transition nicht dauerhaft überschrieben wird
            KEK.defineClass(swiperWrapper, 'kk-slides-fadein');
            KEK.defineClass(swiperWrapper, 'kk-slides-active');
            setTimeout(() => {
                KEK.defineClass(swiperWrapper, 'kk-slides-fadein', true);
            }, 200);

            const swiperContainer = KEK.qs('.swiper', oldReco);
            if (swiperContainer && swiperContainer.swiper) {
                const swiper = swiperContainer.swiper;

                // Navigation-Buttons an Swiper binden (nach Slide-Austausch
                // sind nextEl/prevEl ggf. null – hier frisch rauslesen)
                const nextBtn = KEK.qs('.swiper-button-next', oldReco);
                const prevBtn = KEK.qs('.swiper-button-prev', oldReco);
                if (nextBtn && prevBtn) {
                    swiper.params.navigation.nextEl = nextBtn;
                    swiper.params.navigation.prevEl = prevBtn;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                }

                swiper.update();
                swiper.slideTo(0, 0);
                log('Swiper aktualisiert');
            }

            if (isUpdate) {
                KEK.defineClass(swiperWrapper, 'kk-fading', true);
            }

            KEK.defineClass(oldReco, 'kk-reco-updated');

            log('✅ Reco erfolgreich aktualisiert mit', products.length, 'Produkten');

            if (onComplete) onComplete();

            scheduleWishlistSync();
        }, fadeDelay);
    }

    function buildApiUrl(productId, start) {
        return 'https://widgets.crosssell.info/eps/crosssell/recommendations/' +
            '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1.do?' +
            'wid=202&type=cs&pid=' + productId +
            '&aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1' +
            '&widgetdetails=true&csize=' + CSIZE + '&start=' + (start || 0);
    }

    // =========================================================================
    // LOAD & RENDER RECO – API-Fetch mit Cache & Paging
    // =========================================================================

    function loadAndRenderReco(wrapper, existingProducts, start, onComplete) {
        const productId = getProductId();
        if (!productId) {
            err('Keine Produkt-ID in URL gefunden');
            if (onComplete) onComplete();
            return;
        }

        const productUrl = getProductUrl();

        if (!existingProducts && !start && cache.isLoading && cache.lastRenderedUrl === productUrl) {
            log('Bereits am Laden für URL:', productUrl, '- Skip');
            if (onComplete) onComplete();
            return;
        }

        log('Lade Reco für URL:', productUrl);

        cache.lastRenderedUrl = productUrl;
        cache.isLoading = true;

        const requestToken = Date.now();
        cache.currentRequestToken = requestToken;

        if (!existingProducts && !start) {
            const cachedProducts = getCachedProducts(productUrl);
            if (cachedProducts && cachedProducts.length >= 1) {
                const cacheIsFinal = cachedProducts.length >= 5 || getCacheWasExhausted(productUrl);
                if (cacheIsFinal) {
                    log('Verwende gecachte Produkte für URL:', productUrl, '(' + cachedProducts.length + ' Produkte, final:', cacheIsFinal + ')');
                    // cache.isLoading bleibt true bis initEcondaReco fertig ist
                    initEcondaReco(wrapper, cachedProducts, () => {
                        cache.isLoading = false;
                        if (onComplete) onComplete();
                    });
                    return;
                }
            }
        }

        existingProducts = existingProducts || [];
        start = start || 0;

        const apiUrl = buildApiUrl(productId, start);
        log('API Request (start=' + start + '):', apiUrl);

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                if (cache.currentRequestToken !== requestToken) {
                    log('Veralteter Request ignoriert (Token:', requestToken, 'vs', cache.currentRequestToken, ')');
                    return;
                }

                log('API Response:', data);
                const newProducts = data.items || data.products || [];

                if (!newProducts.length && !existingProducts.length) {
                    warn('Keine Produkte in Response - zeige Original-Reco');
                    showOriginalReco();
                    cache.isLoading = false;
                    if (onComplete) onComplete();
                    return;
                }

                const allProducts = existingProducts.concat(newProducts);
                const uniqueProducts = dedupeProducts(allProducts, productId);

                log('Unique Produkte bisher:', uniqueProducts.length);

                const minProducts = 5;
                const maxRetries = 3;
                const currentRetry = Math.floor(start / CSIZE);

                const previousUniqueCount = dedupeProducts(existingProducts, productId).length;
                const gotNewUniqueProducts = uniqueProducts.length > previousUniqueCount;

                if (uniqueProducts.length < minProducts && newProducts.length > 0 && currentRetry < maxRetries && gotNewUniqueProducts) {
                    log('Nur', uniqueProducts.length, 'unique Produkte - lade weitere nach...');
                    loadAndRenderReco(wrapper, allProducts, start + CSIZE, onComplete);
                    return;
                }

                const isExhausted = uniqueProducts.length < minProducts;

                cache.isLoading = false;
                if (uniqueProducts.length) {
                    setCachedProducts(productUrl, uniqueProducts, isExhausted);
                    // isLoading bleibt false aber render läuft synchron
                    // reapplyObserver ist 800ms debounced – kein Race-Problem
                    initEcondaReco(wrapper, uniqueProducts, onComplete);
                } else {
                    warn('Keine unique Produkte gefunden');
                    showOriginalReco();
                    if (onComplete) onComplete();
                }
            })
            .catch((error) => {
                err('API Error:', error);
                showOriginalReco();
                cache.isLoading = false;
                if (onComplete) onComplete();
            });
    }

    // =========================================================================
    // REFRESH – Produktwechsel / Farbvarianten
    // =========================================================================

    function refreshRecoIfNeeded() {
        if (!/\/p\/\d+/.test(win.location.pathname)) {
            log('Keine PDP - Skip refresh');
            showOriginalReco();
            cache.lastRenderedUrl = null;
            return;
        }

        // Anti-Flicker re-injizieren (z.B. nach Rückkehr von Wishlist-Seite)
        injectAntiFlicker();

        const currentUrl = getProductUrl();
        log('Check refresh - current:', currentUrl, 'lastRendered:', cache.lastRenderedUrl);

        // DOM-State prüfen: React könnte den DOM neu gerendert haben
        // Klasse allein reicht nicht – React kann Slides ersetzen ohne das Element zu tauschen
        const oldReco = KEK.qs(SEL_OLD_RECO);
        const hasOurSlides = oldReco ? !!KEK.qs('[data-kk-product]', oldReco) : false;
        const domWasRecreated = oldReco && (!oldReco.classList.contains('kk-reco-updated') || !hasOurSlides);

        if ((currentUrl && currentUrl !== cache.lastRenderedUrl) || domWasRecreated) {
            log('Refresh nötig:', currentUrl !== cache.lastRenderedUrl ? 'URL-Wechsel' : 'DOM recreated');

            // URL sofort setzen um Doppel-Rendering zu verhindern
            cache.lastRenderedUrl = currentUrl;

            // Wishlist-State VOR dem Render aktualisieren
            fetchWishlistSKUs().then((codes) => {
                wishlistedIds = codes;
                log('wishlistedIds vor Render aktualisiert:', wishlistedIds.size, 'Einträge');

                if (oldReco) {
                    KEK.defineClass(oldReco, 'kk-reco-updated', true);
                }

                const wrapper = oldReco ? (oldReco.closest(SEL_RECO_WRAPPER) || oldReco.parentElement) : cache.wrapper;

                if (wrapper && oldReco) {
                    const swiperWrapper = KEK.qs(SEL_SWIPER_WRAPPER, oldReco);
                    if (swiperWrapper) {
                        waitForStableDOM(swiperWrapper, (onComplete) => {
                            cache.lastRenderedUrl = getProductUrl();
                            loadAndRenderReco(wrapper, null, null, onComplete);
                        }, oldReco);
                    } else {
                        cache.lastRenderedUrl = currentUrl;
                        loadAndRenderReco(wrapper);
                    }
                } else {
                    log('Wrapper nicht gefunden - warte auf Element');
                    KEK.elem(SEL_OLD_RECO, (recos) => {
                        if (!recos) return;
                        const w = recos[0].closest(SEL_RECO_WRAPPER) || recos[0].parentElement;
                        cache.wrapper = w;
                        cache.lastRenderedUrl = getProductUrl();
                        loadAndRenderReco(w);
                    });
                }
            });
        } else if (hasOurSlides) {
            // Slides vorhanden, URL gleich – kein Re-Render nötig
            // Aber Wishlist-State könnte sich geändert haben (z.B. Rückkehr von Wishlist-Seite)
            log('Slides vorhanden, nur Wishlist sync');
            scheduleWishlistSync();
        }
    }

    // =========================================================================
    // SPA URL-OBSERVER
    // =========================================================================

    function observeUrlChanges() {
        let urlChangeTimer = null;
        const onUrlChange = () => {
            clearTimeout(urlChangeTimer);
            urlChangeTimer = setTimeout(refreshRecoIfNeeded, 200);
        };

        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function() { origPush.apply(this, arguments); log('URL geändert (pushState)'); onUrlChange(); };
        history.replaceState = function() { origReplace.apply(this, arguments); log('URL geändert (replaceState)'); onUrlChange(); };
        win.addEventListener('popstate', () => { log('URL geändert (popstate)'); onUrlChange(); });

        log('URL-Observer aktiviert');
    }

    // =========================================================================
    // SETUP – SPA-ready mit URL-Observer
    // =========================================================================

    function setupRecoWidget() {
        log('Setup gestartet, warte auf:', SEL_OLD_RECO);

        cache.lastRenderedUrl = getProductUrl();
        log('Initiale URL:', cache.lastRenderedUrl);

        observeUrlChanges();

        KEK.elem(SEL_OLD_RECO, (recos) => {
            log('Element gefunden:', recos);

            if (!recos || !recos.length) return;

            const oldReco = recos[0];

            const hasOurSlidesInner = !!KEK.qs('[data-kk-product]', oldReco);
            if (oldReco.classList.contains('kk-reco-updated') && hasOurSlidesInner) {
                const currentUrl = getProductUrl();
                if (currentUrl === cache.lastRenderedUrl) {
                    log('Bereits aktualisiert für diese URL - skip');
                    return;
                }
                log('URL geändert - refresh nötig');
                KEK.defineClass(oldReco, 'kk-reco-updated', true);
            }

            if (!/\/p\/\d+/.test(win.location.pathname)) {
                log('Keine PDP URL - skip');
                return;
            }

            const swiperWrapper = KEK.qs(SEL_SWIPER_WRAPPER, oldReco);
            if (!swiperWrapper) {
                log('Kein Swiper-Wrapper gefunden - skip');
                return;
            }

            waitForStableDOM(swiperWrapper, (onComplete) => {
                const urlNow = getProductUrl();
                log('DOM stabil, lade für URL:', urlNow);

                const alreadyHasOurSlides = !!KEK.qs('[data-kk-product]', oldReco);
                if (oldReco.classList.contains('kk-reco-updated') && alreadyHasOurSlides) {
                    log('Wurde zwischenzeitlich bereits aktualisiert - skip');
                    if (onComplete) onComplete();
                    return;
                }

                const wrapper = oldReco.closest(SEL_RECO_WRAPPER) || oldReco.parentElement;
                cache.wrapper = wrapper;
                cache.lastRenderedUrl = urlNow;
                loadAndRenderReco(wrapper, null, null, onComplete);
            }, oldReco);
        });

        // Persistenter Observer: React Re-Render Schutz + Wishlist Counter Watch
        let reapplyTimer = null;
        let fastCheckTimer = null;
        let counterSyncTimer = null;
        let lastCounterText = null;
        const reapplyObserver = new MutationObserver(function() {
            // 1. Wishlist Counter Watch (persistent, unabhängig von Reco-State)
            clearTimeout(counterSyncTimer);
            counterSyncTimer = setTimeout(() => {
                const counter = KEK.qs('[data-testid="wishlist-counter"]');
                const counterText = counter ? counter.textContent.trim() : '';
                if (lastCounterText !== null && counterText !== lastCounterText) {
                    log('Wishlist-Counter geändert:', lastCounterText, '→', counterText);
                    syncWishlistButtons();
                }
                lastCounterText = counterText;
            }, 500);

            // 2. FAST CHECK (50ms): Klassen sofort entfernen wenn React unsere Slides zerstört hat
            clearTimeout(fastCheckTimer);
            fastCheckTimer = setTimeout(() => {
                const reco = KEK.qs(SEL_OLD_RECO);
                if (!reco) return;
                const sw = KEK.qs(SEL_SWIPER_WRAPPER, reco);
                const hasSlides = !!KEK.qs('[data-kk-product]', reco);
                if (!hasSlides) {
                    // Unsere Slides sind weg – sofort alles unsichtbar machen
                    KEK.defineClass(reco, 'kk-reco-updated', true);
                    if (sw) KEK.defineClass(sw, 'kk-slides-active', true);
                }
            }, 50);

            // 3. SLOW CHECK (800ms): React Re-Render Schutz - voller Re-Render
            clearTimeout(reapplyTimer);
            reapplyTimer = setTimeout(() => {
                if (!/\/p\/\d+/.test(win.location.pathname)) return;
                if (cache.isLoading) return;

                const reco = KEK.qs(SEL_OLD_RECO);
                if (!reco) return;

                const hasOurRecoSlides = !!KEK.qs('[data-kk-product]', reco);
                if (reco.classList.contains('kk-reco-updated') && hasOurRecoSlides) return;

                log('React hat Reco neu gerendert - re-apply econda');
                KEK.defineClass(reco, 'kk-reco-updated', true);

                const sw = KEK.qs(SEL_SWIPER_WRAPPER, reco);
                if (!sw) return;
                KEK.defineClass(sw, 'kk-slides-active', true);

                waitForStableDOM(sw, (onComplete) => {
                    const stillHasOurSlides = !!KEK.qs('[data-kk-product]', reco);
                    if (reco.classList.contains('kk-reco-updated') && stillHasOurSlides) {
                        if (onComplete) onComplete();
                        return;
                    }
                    const w = reco.closest(SEL_RECO_WRAPPER) || reco.parentElement;
                    cache.wrapper = w;
                    cache.lastRenderedUrl = getProductUrl();
                    loadAndRenderReco(w, null, null, onComplete);
                }, reco);
            }, 800);
        });
        reapplyObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Wishlist Pre-Fetch + Start
    fetchWishlistSKUs().then((codes) => {
        wishlistedIds = codes;
        log('Initialer Wishlist-State geladen:', wishlistedIds.size, 'Einträge');
        setupRecoWidget();
    });

})(new window.KEK(), window);
