// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Yannick Preuss
 * @namespace V1
 * @name Variation 01
 * @description econda Recommendation Widget auf PDP
 */
(function(KEK) {
    "use strict";

    // Debug-Flag: false für Production, true für Entwicklung
    var DEBUG = false;
    function log() { if (DEBUG) console.log.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }
    function warn() { if (DEBUG) console.warn.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }
    function err() { if (DEBUG) console.error.apply(console, ['[econda Reco]'].concat(Array.prototype.slice.call(arguments))); }

    log('Script gestartet');

    // Early exit für nicht-PDP Seiten
    if (!/\/p\/\d+/.test(window.location.pathname)) {
        log('Keine PDP - Exit');
        return;
    }

    var CONFIG = {
        accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
        widgetId: '202',
        baseUrl: 'https://widgets.crosssell.info/eps/crosssell/recommendations/',
        csize: 20
    };

    /** CSS für Wishlist-Hover und Fade-Transition */
    function addRecoStyles() {
        if (document.querySelector('#ec-reco-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'ec-reco-styles';
        style.textContent = [
            '.ec-reco-fade { transition: opacity 0.1s ease-out; }',
            '.ec-reco-fade.ec-fading { opacity: 0; }'
        ].join('\n');
        (document.head || document.documentElement).appendChild(style);
    }

    /** Country aus URL oder HTML-Lang ermitteln */
    function getCountry() {
        // 1. Aus URL-Pfad (z.B. /de/p/12345)
        var pathMatch = window.location.pathname.match(/^\/([a-z]{2})\//);
        if (pathMatch) return pathMatch[1];
        
        // 2. Fallback: HTML lang Attribut (z.B. "de-DE" -> "de")
        var htmlLang = document.documentElement.lang;
        if (htmlLang) return htmlLang.split('-')[0].toLowerCase();
        
        // 3. Default
        return 'de';
    }

    var selectors = {
        recoWrapper: '[data-testid="recommendation-wrapper"]',
        oldReco: '[data-testid="recommendation"]',
        swiperWrapper: '.swiper-wrapper',
        productCard: '[data-testid="product-card"]',
        priceLabel: '[data-testid="price-label"]',
        priceLabelDiscounted: '[data-testid="price-label-discounted"]',
        priceLabelStriked: '[data-testid="price-label-striked"]',
        productCardHeadline: '[class*="ProductCard_productCard__headline"]',
        productCardImage: '[data-testid="media"] img',
        wishlistButton: '[data-testid="add-to-wishlist-button"]'
    };

    // Cache für Template und Request-Tracking
    var cache = {
        template: null,
        lastRenderedUrl: null,
        wrapper: null,
        isLoading: false,
        currentRequestToken: null // Verhindert Race Conditions bei schnellen URL-Wechseln
    };

    var STORAGE_KEY = 'econda_reco_cache';
    var CACHE_TTL = 30 * 60 * 1000; // 30 Minuten
    var DOM_STABLE_DELAY = 400; // Warte 400ms bis DOM stabil ist (React fertig)
    var WISHLIST_SYNC_DELAY = 1000; // Delay nach Add bevor API re-fetched wird
    var COUNTER_DEBOUNCE = 500; // Debounce für Counter-Observer

    /** Wishlist-GUID aus Cookie lesen */
    function getWishlistCookie() {
        var match = document.cookie.match(/(?:^|;\s*)HessnaturDESite-wishlist=([^;]+)/);
        return match ? match[1] : null;
    }

    /** Wishlist-SKUs via GraphQL API laden */
    function fetchWishlistSKUs() {
        var guid = getWishlistCookie();
        if (!guid) {
            log('Kein Wishlist-Cookie - leeres Set');
            return Promise.resolve(new Set());
        }

        var country = getCountry();
        var body = JSON.stringify({
            query: 'query getWishlist($country: String!, $lang: String!, $guid: String) { wishlist(country: $country, lang: $lang, guid: $guid) { code entries { entryNumber product { code name baseProduct } } } }',
            variables: { country: country.toUpperCase(), lang: country, guid: guid }
        });

        return fetch('/api/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var entries = data && data.data && data.data.wishlist && data.data.wishlist.entries;
            if (!entries) return new Set();
            var codes = new Set();
            entries.forEach(function(entry) {
                if (entry.product && entry.product.code) {
                    codes.add(entry.product.code);
                }
            });
            log('Wishlist geladen:', codes.size, 'Einträge');
            return codes;
        })
        .catch(function(e) {
            warn('Wishlist API Fehler:', e);
            return new Set();
        });
    }

    /** Alle Reco-Wishlist-Buttons mit echtem Wishlist-State synchronisieren */
    function syncWishlistButtons() {
        fetchWishlistSKUs().then(function(wishlistCodes) {
            var slides = document.querySelectorAll('[data-ec-product]');
            if (!slides.length) return;

            slides.forEach(function(slide) {
                var econdaId = slide.getAttribute('data-ec-product');
                var btn = slide.querySelector('.ec-wishlist-btn');
                if (!btn || !econdaId) return;

                // Matching: Wishlist code beginnt mit econda Product-ID (7 Digits)
                var isOnWishlist = false;
                wishlistCodes.forEach(function(code) {
                    if (code.indexOf(econdaId) === 0) isOnWishlist = true;
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

    /** Wishlist-Button als 'added' markieren (rotes gefülltes Herz) */
    function markButtonAsWishlisted(btn) {
        if (!btn) return;
        btn.classList.add('AddToWishlistButton_added__X4ouM');
        var svg = btn.querySelector('svg');
        if (svg) {
            svg.setAttribute('data-prefix', 'fas');
            svg.setAttribute('data-icon', 'heart');
            var path = svg.querySelector('path');
            if (path) {
                path.setAttribute('d', 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z');
            }
        }
    }

    /** Wishlist-Button als 'not added' zurücksetzen (Outline-Herz) */
    function unmarkButtonAsWishlisted(btn) {
        if (!btn) return;
        btn.classList.remove('AddToWishlistButton_added__X4ouM');
        var svg = btn.querySelector('svg');
        if (svg) {
            svg.setAttribute('data-prefix', 'far');
            svg.setAttribute('data-icon', 'heart');
            var path = svg.querySelector('path');
            if (path) {
                path.setAttribute('d', 'M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z');
            }
        }
    }
    
    /** Reco-Container verstecken (Anti-Flicker) */
    function hideReco(element) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.15s ease-out';
    }
    
    /** Reco-Container einblenden */
    function showReco(element) {
        if (!element) return;
        element.style.opacity = '1';
    }
    
    /** Warte bis DOM stabil ist (React fertig) */
    function waitForStableDOM(element, callback, recoElement) {
        // Anti-Flicker: Reco verstecken während wir warten
        if (recoElement) hideReco(recoElement);
        var timer = null;
        var observer = null;
        var hasTriggered = false;
        
        var triggerCallback = function() {
            if (hasTriggered) return;
            hasTriggered = true;
            if (observer) observer.disconnect();
            clearTimeout(timer);
            log('DOM stabil - starte Rendering');
            callback(function() {
                // Callback zum Einblenden nach dem Rendering
                if (recoElement) showReco(recoElement);
            });
        };
        
        observer = new MutationObserver(function() {
            // Bei jeder Änderung Timer zurücksetzen
            clearTimeout(timer);
            timer = setTimeout(triggerCallback, DOM_STABLE_DELAY);
        });
        
        observer.observe(element, { childList: true, subtree: true });
        
        // Initial Timer starten (falls keine Mutations kommen)
        timer = setTimeout(triggerCallback, DOM_STABLE_DELAY);
        
        log('Warte auf stabilen DOM (' + DOM_STABLE_DELAY + 'ms)...');
    }

    /** Produkte aus sessionStorage laden */
    function getCachedProducts(productUrl) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return null;
            
            var data = JSON.parse(cached);
            var entry = data[productUrl];
            
            if (entry && (Date.now() - entry.timestamp) < CACHE_TTL) {
                log('Cache Hit für URL:', productUrl);
                return entry.products;
            }
            
            // Abgelaufenen Eintrag löschen
            if (entry) {
                delete data[productUrl];
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch (e) {
            warn('Cache Lesefehler:', e);
        }
        return null;
    }

    /** Prüft ob API-Paging abgeschlossen */
    function getCacheWasExhausted(productUrl) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return false;
            
            var data = JSON.parse(cached);
            var entry = data[productUrl];
            
            return entry && entry.exhausted === true;
        } catch (e) {
            return false;
        }
    }

    /** Produkte in sessionStorage speichern */
    function setCachedProducts(productUrl, products, exhausted) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            var data = cached ? JSON.parse(cached) : {};
            
            // Alte Einträge limitieren (max 10 behalten)
            var keys = Object.keys(data);
            if (keys.length > 10) {
                var oldest = keys.reduce(function(a, b) {
                    return data[a].timestamp < data[b].timestamp ? a : b;
                });
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

    /** Produkt-ID aus URL extrahieren */
    function getProductId() {
        var match = window.location.pathname.match(/\/p\/(\d+)/);
        return match ? match[1] : null;
    }

    /** Cache-Key aus URL-Pathname */
    function getProductUrl() {
        return window.location.pathname;
    }

    /** Wishlist-Klick behandeln - nutzt Hessnatur Custom Event */
    function addToWishlist(productCode, product, btn) {
        log('Wishlist Add via Custom Event:', productCode);
        
        // Hessnatur Custom Event dispatchen - Toast wird von Hessnatur gehandhabt
        window.dispatchEvent(new CustomEvent('hessnatur:addToWishlist', {
            detail: { productCode: productCode }
        }));
        
        // Optimistic UI: Button sofort als "added" markieren
        markButtonAsWishlisted(btn);
        
        // Nach Delay alle Buttons gegen echte Wishlist-API synchronisieren
        setTimeout(syncWishlistButtons, WISHLIST_SYNC_DELAY);
    }

    /** Preis-String in Float umwandeln */
    function parsePrice(priceString) {
        if (!priceString) return null;
        // Entferne alles außer Zahlen, Komma, Punkt
        var cleaned = priceString.replace(/[^\d,\.]/g, '').replace(',', '.');
        var num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    /** Discount in Prozent berechnen */
    function calculateDiscount(oldPrice, currentPrice) {
        var oldNum = parsePrice(oldPrice);
        var currentNum = parsePrice(currentPrice);
        
        if (oldNum === null || currentNum === null || oldNum <= 0) return null;
        
        var discount = Math.round((1 - currentNum / oldNum) * 100);
        return discount > 0 ? discount : null;
    }

    /** DataLayer Event pushen für Tracking */
    function pushDataLayerEvent(eventType, product, index) {
        window.dataLayer = window.dataLayer || [];
        
        // Preise als Float parsen
        var priceFloat = parsePrice(product.price);
        var oldPriceFloat = parsePrice(product.oldprice1);
        
        // Discount berechnen wenn Streichpreis vorhanden
        var discount = calculateDiscount(product.oldprice1, product.price);
        
        // Item-Objekt nach GA4-Standard
        var item = {
            item_id: product.id || '',
            item_name: product.name || '',
            item_list_name: "Ähnliche Produkte",
            item_variant: product.sku || '',
            index: index,
            currency: "EUR"
        };
        
        // Price als Float (nur wenn geparst werden konnte)
        if (priceFloat !== null) {
            item.price = priceFloat;
        }
        
        // Discount nur hinzufügen wenn vorhanden
        if (discount !== null) {
            item.discount = discount;
        }
        
        var eventData = {
            event: "select_item_from_list",
            item_list_name: "Ähnliche Produkte",
            interaction_type: eventType, // 'click' oder 'wishlist'
            items: [item]
        };
        
        // Value als Float (Summe der Preise im items-Array)
        if (priceFloat !== null) {
            eventData.value = priceFloat;
            eventData.currency = "EUR";
        }
        
        window.dataLayer.push(eventData);
        log('DataLayer Event gepusht:', eventData);
    }

    /** ProductCard mit econda-Daten befüllen */
    function fillProductCard(card, product, index) {
        var id = product.id || '';
        var name = product.name || '';
        var image = product.iconurl || product.imageurl || '';
        var originalPrice = product.oldprice1 || '';
        var currentPrice = product.price || '';
        var showAsDiscounted = product.reduced === 'true' && originalPrice.length > 0;

        // URL bauen: deeplink verwenden oder aus ID generieren
        var url = product.deeplink || '';
        if (!url && id) {
            var country = getCountry();
            url = 'https://www.hessnatur.com/' + country + '/p/' + id;
        }
        if (!url) url = '#';

        // Link - href direkt setzen
        var link = card.querySelector('a');
        if (link) {
            link.href = url;
            link.title = name;
            link.setAttribute('data-product-id', id);
            link.setAttribute('data-reco-index', index);
            
            // Alten Handler entfernen um Memory Leak zu verhindern
            if (link._clickHandler) {
                link.removeEventListener('click', link._clickHandler);
            }
            
            // Click-Handler für DataLayer Tracking
            link._clickHandler = function() {
                pushDataLayerEvent('click', product, index);
            };
            link.addEventListener('click', link._clickHandler);
        }

        // Bild
        var img = card.querySelector(selectors.productCardImage);
        if (img && image) {
            img.removeAttribute('srcset');
            img.src = image;
            img.alt = name;
            img.title = name;
        }

        // Titel
        var headline = card.querySelector(selectors.productCardHeadline);
        if (headline) headline.textContent = name;

        // Preis - Elemente einmal selektieren
        var priceLabel = card.querySelector(selectors.priceLabel);
        var priceDiscounted = card.querySelector(selectors.priceLabelDiscounted);
        var priceStriked = card.querySelector(selectors.priceLabelStriked);

        if (showAsDiscounted) {
            // Reduzierter Preis anzeigen (rot)
            if (priceDiscounted) {
                priceDiscounted.innerHTML = '<div style="color:#c00">' + currentPrice + '</div>';
                priceDiscounted.parentElement.style.display = '';
            }
            if (priceStriked) {
                priceStriked.textContent = originalPrice;
                // Streichpreis: normale Farbe, durchgestrichen
                priceStriked.style.color = '';
                priceStriked.style.textDecoration = 'line-through';
                priceStriked.parentElement.style.display = '';
            }
            if (priceLabel && priceLabel.parentElement) priceLabel.parentElement.style.display = 'none';
        } else {
            // Normaler Preis (nicht reduziert)
            if (priceLabel) {
                priceLabel.textContent = currentPrice;
                priceLabel.style.color = '#000';
                priceLabel.parentElement.style.display = '';
            }
            if (priceStriked && priceStriked.parentElement) priceStriked.parentElement.style.display = 'none';
            if (priceLabel && priceDiscounted && priceDiscounted.parentElement) priceDiscounted.parentElement.style.display = 'none';
        }

        // Wishlist-Button - komplett neu erstellen um React-Binding zu umgehen
        // Wir müssen klonen, da React sonst das falsche Produkt (PDP-Produkt) hinzufügt
        var wishlistBtn = card.querySelector(selectors.wishlistButton);
        if (wishlistBtn) {
            // Button klonen um alle React-Event-Handler zu entfernen
            var newBtn = wishlistBtn.cloneNode(true);
            
            // Code für Wishlist: SKU bevorzugen, sonst ID
            // Hessnatur erwartet vollständige SKU wie "57042192632"
            var wishlistCode = product.sku || id;
            log('Wishlist-Code für Produkt', id, ':', wishlistCode);
            
            newBtn.setAttribute('data-code', wishlistCode);
            newBtn.setAttribute('data-reco-index', index);
            newBtn.classList.add('ec-wishlist-btn');
            
            // Wishlist-State wird nach Render via syncWishlistButtons() gesetzt
            
            // Handler DIREKT binden (nicht später in bindWishlistButtons)
            var wishlistHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                log('Wishlist Button geklickt, code:', wishlistCode);
                
                // DataLayer Event
                pushDataLayerEvent('wishlist', product, index);
                
                // Wishlist API aufrufen
                addToWishlist(wishlistCode, product, newBtn);
                
                return false;
            };
            
            newBtn.addEventListener('click', wishlistHandler, true);
            wishlistBtn.parentNode.replaceChild(newBtn, wishlistBtn);
        }
    }

    /** Produkte deduplizieren und PDP-Produkt ausschließen */
    function dedupeProducts(products, excludeId) {
        var seen = {};
        return products.filter(function(p) {
            // Aktuelles PDP-Produkt ausschließen
            if (excludeId && p.id === excludeId) {
                log('Produkt ausgeschlossen (aktuelles PDP):', p.id);
                return false;
            }
            // Duplikate filtern
            if (seen[p.id]) return false;
            seen[p.id] = true;
            return true;
        });
    }

    /** Reco mit econda-Daten befüllen */
    function initEcondaReco(wrapper, products, onComplete) {
        log('initEcondaReco mit', products.length, 'Produkten');
        
        var oldReco = KEK.qs(selectors.oldReco, wrapper);
        if (!oldReco) {
            err('Original-Reco nicht gefunden');
            if (onComplete) onComplete();
            return;
        }

        var swiperWrapper = KEK.qs(selectors.swiperWrapper, oldReco);
        if (!swiperWrapper) {
            err('Swiper-Wrapper nicht gefunden');
            if (onComplete) onComplete();
            return;
        }

        // Styles hinzufügen (einmalig)
        addRecoStyles();

        // Template cachen
        if (!cache.template) {
            var templateSlide = KEK.qs('.swiper-slide', swiperWrapper);
            if (!templateSlide) {
                if (onComplete) onComplete();
                return;
            }
            cache.template = templateSlide.cloneNode(true);
        }

        log('Rendere', products.length, 'Produkte');

        // DocumentFragment für bessere Performance vorbereiten
        var fragment = document.createDocumentFragment();

        products.forEach(function(product, index) {
            var newSlide = cache.template.cloneNode(true);
            newSlide.className = 'swiper-slide';
            newSlide.style.cssText = 'width:296.8px;margin-right:12px';
            newSlide.setAttribute('aria-label', (index + 1) + ' / ' + products.length);
            // Marker für MutationObserver um unsere Slides zu erkennen
            newSlide.setAttribute('data-ec-product', product.id || product.productid || '');

            var card = KEK.qs(selectors.productCard, newSlide);
            if (card) fillProductCard(card, product, index);

            fragment.appendChild(newSlide);
        });

        // Prüfe ob es ein Update ist (Farbwechsel) oder erstes Laden
        var isUpdate = oldReco.classList.contains('ec-reco-updated');
        var fadeDelay = isUpdate ? 100 : 0; // Nur bei Updates faden, nicht beim ersten Laden
        
        if (isUpdate) {
            // Anti-Flicker: Fade-out nur bei Updates
            swiperWrapper.classList.add('ec-reco-fade');
            swiperWrapper.classList.add('ec-fading');
        }
        
        // Content tauschen (sofort oder nach Fade-out)
        setTimeout(function() {
            swiperWrapper.innerHTML = '';
            swiperWrapper.appendChild(fragment);

            // Swiper updaten
            var swiperContainer = KEK.qs('.swiper', oldReco);
            if (swiperContainer && swiperContainer.swiper) {
                swiperContainer.swiper.update();
                swiperContainer.swiper.slideTo(0, 0);
                log('Swiper aktualisiert');
            }

            // Wishlist-Buttons sind bereits in fillProductCard gebunden
            
            // Fade-in (nur bei Updates)
            if (isUpdate) {
                swiperWrapper.classList.remove('ec-fading');
            }
            
            // Marker-Klasse hinzufügen
            oldReco.classList.add('ec-reco-updated');

            log('✅ Reco erfolgreich aktualisiert mit', products.length, 'Produkten');
            
            // Callback aufrufen (für showReco)
            if (onComplete) onComplete();
            
            // Wishlist-Buttons gegen echte API synchronisieren
            syncWishlistButtons();
        }, fadeDelay);
    }

    /** API URL bauen */
    function buildApiUrl(productId, start) {
        return CONFIG.baseUrl + CONFIG.accountId + '.do?' +
            'wid=' + CONFIG.widgetId +
            '&type=cs&pid=' + productId +
            '&aid=' + CONFIG.accountId +
            '&widgetdetails=true&csize=' + CONFIG.csize + '&start=' + (start || 0);
    }

    /** econda-Daten laden (mit Cache und Nachladen) */
    function loadAndRenderReco(wrapper, existingProducts, start, onComplete) {
        var productId = getProductId();
        if (!productId) {
            err('Keine Produkt-ID in URL gefunden');
            if (onComplete) onComplete();
            return;
        }

        var productUrl = getProductUrl();
        
        // Verhindere doppelte API-Calls für dieselbe URL
        if (!existingProducts && !start && cache.isLoading && cache.lastRenderedUrl === productUrl) {
            log('Bereits am Laden für URL:', productUrl, '- Skip');
            if (onComplete) onComplete();
            return;
        }
        
        log('Lade Reco für URL:', productUrl);
        
        // URL SOFORT merken um Race Conditions zu vermeiden
        cache.lastRenderedUrl = productUrl;
        cache.isLoading = true;
        
        // Request-Token für Race Condition Schutz
        var requestToken = Date.now();
        cache.currentRequestToken = requestToken;

        // Erst Cache prüfen (nur beim ersten Aufruf) - nutzt vollständige URL
        if (!existingProducts && !start) {
            var cachedProducts = getCachedProducts(productUrl);
            // Cache verwenden wenn:
            // 1. Mindestens 5 Produkte (ideal) ODER
            // 2. Cache existiert und wurde bereits als "final" gespeichert (weniger als 5, aber API hat nicht mehr)
            if (cachedProducts && cachedProducts.length >= 1) {
                // Prüfe ob wir bereits versucht haben mehr zu laden (Flag im Cache)
                var cacheIsFinal = cachedProducts.length >= 5 || getCacheWasExhausted(productUrl);
                if (cacheIsFinal) {
                    log('Verwende gecachte Produkte für URL:', productUrl, '(' + cachedProducts.length + ' Produkte, final:', cacheIsFinal + ')');
                    cache.isLoading = false;
                    initEcondaReco(wrapper, cachedProducts, onComplete);
                    return;
                }
            }
        }

        existingProducts = existingProducts || [];
        start = start || 0;

        var apiUrl = buildApiUrl(productId, start);
        log('API Request (start=' + start + '):', apiUrl);

        fetch(apiUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                // Race Condition Check: Ist dieser Request noch aktuell?
                if (cache.currentRequestToken !== requestToken) {
                    log('Veralteter Request ignoriert (Token:', requestToken, 'vs', cache.currentRequestToken, ')');
                    return;
                }
                
                log('API Response:', data);
                var newProducts = data.items || data.products || [];
                
                if (!newProducts.length && !existingProducts.length) {
                    warn('Keine Produkte in Response - zeige Original-Reco');
                    cache.isLoading = false;
                    // WICHTIG: Reco wieder einblenden auch wenn keine Produkte!
                    if (onComplete) onComplete();
                    return;
                }

                // Alle Produkte zusammenführen und aktuelles Produkt ausschließen
                var allProducts = existingProducts.concat(newProducts);
                var uniqueProducts = dedupeProducts(allProducts, productId);
                
                log('Unique Produkte bisher:', uniqueProducts.length);

                // Wenn weniger als 5 unique Produkte, prüfen ob Nachladen sinnvoll ist
                var minProducts = 5;
                var maxRetries = 3;
                var currentRetry = Math.floor(start / CONFIG.csize);
                
                // Nur nachladen wenn:
                // 1. Weniger als minProducts unique Produkte
                // 2. API hat neue Produkte geliefert
                // 3. Max Retries nicht erreicht
                // 4. Die neuen Produkte haben tatsächlich neue unique Produkte gebracht
                var previousUniqueCount = dedupeProducts(existingProducts, productId).length;
                var gotNewUniqueProducts = uniqueProducts.length > previousUniqueCount;
                
                if (uniqueProducts.length < minProducts && newProducts.length > 0 && currentRetry < maxRetries && gotNewUniqueProducts) {
                    log('Nur', uniqueProducts.length, 'unique Produkte - lade weitere nach...');
                    loadAndRenderReco(wrapper, allProducts, start + CONFIG.csize, onComplete);
                    return;
                }

                // Genug Produkte oder max. Versuche erreicht - rendern
                // Cache als "exhausted" markieren wenn weniger als minProducts
                var isExhausted = uniqueProducts.length < minProducts;
                
                cache.isLoading = false;
                if (uniqueProducts.length) {
                    // In Cache speichern - mit vollständiger URL als Key
                    setCachedProducts(productUrl, uniqueProducts, isExhausted);
                    initEcondaReco(wrapper, uniqueProducts, onComplete);
                } else {
                    warn('Keine unique Produkte gefunden');
                    if (onComplete) onComplete();
                }
            })
            .catch(function(err) {
                err('API Error:', err);
                cache.isLoading = false;
                if (onComplete) onComplete();
            });
    }

    /** Reco aktualisieren bei Produktwechsel */
    function refreshRecoIfNeeded() {
        // Nur auf PDP-Seiten
        if (!/\/p\/\d+/.test(window.location.pathname)) {
            log('Keine PDP - Skip refresh');
            return;
        }
        
        var currentUrl = getProductUrl();
        log('Check refresh - current:', currentUrl, 'lastRendered:', cache.lastRenderedUrl);
        
        // Aktualisieren wenn sich die URL geändert hat (inkl. Farbvarianten!)
        if (currentUrl && currentUrl !== cache.lastRenderedUrl) {
            log('URL-Wechsel erkannt:', cache.lastRenderedUrl, '->', currentUrl);
            
            // Marker-Klasse entfernen für Re-Rendering
            var oldReco = document.querySelector(selectors.oldReco);
            if (oldReco) {
                oldReco.classList.remove('ec-reco-updated');
            }
            
            // Template-Cache leeren (Template könnte sich geändert haben)
            cache.template = null;
            
            // Wrapper finden
            var wrapper = oldReco ? (oldReco.closest(selectors.recoWrapper) || oldReco.parentElement) : cache.wrapper;
            
            if (wrapper && oldReco) {
                var swiperWrapper = KEK.qs(selectors.swiperWrapper, oldReco);
                if (swiperWrapper) {
                    // Warte bis React fertig ist, dann neu laden
                    waitForStableDOM(swiperWrapper, function(onComplete) {
                        cache.lastRenderedUrl = getProductUrl();
                        loadAndRenderReco(wrapper, null, null, onComplete);
                    }, oldReco);
                } else {
                    // Direkt laden wenn kein Swiper gefunden
                    cache.lastRenderedUrl = currentUrl;
                    loadAndRenderReco(wrapper);
                }
            } else {
                // Wrapper noch nicht vorhanden - warte auf Element
                log('Wrapper nicht gefunden - warte auf Element');
                KEK.elem(selectors.oldReco, function(recos) {
                    if (recos && recos.length) {
                        var w = recos[0].closest(selectors.recoWrapper) || recos[0].parentElement;
                        cache.wrapper = w;
                        cache.lastRenderedUrl = getProductUrl();
                        loadAndRenderReco(w);
                    }
                });
            }
        }
    }

    /** URL-Änderungen beobachten (SPA-Navigation) */
    function observeUrlChanges() {
        var onUrlChange = function() { setTimeout(refreshRecoIfNeeded, 100); };
        
        var origPush = history.pushState, origReplace = history.replaceState;
        history.pushState = function() { origPush.apply(this, arguments); log('URL geändert (pushState)'); onUrlChange(); };
        history.replaceState = function() { origReplace.apply(this, arguments); log('URL geändert (replaceState)'); onUrlChange(); };
        window.addEventListener('popstate', function() { log('URL geändert (popstate)'); onUrlChange(); });
        
        log('URL-Observer aktiviert');
    }

    /** Setup - SPA-ready mit URL-Observer */
    function setup() {
        log('Setup gestartet, warte auf:', selectors.oldReco);
        
        // Initiale URL merken
        cache.lastRenderedUrl = getProductUrl();
        log('Initiale URL:', cache.lastRenderedUrl);
        
        // URL-Observer für Variantenwechsel
        observeUrlChanges();
        
        // Wishlist-Counter beobachten für Remove-Erkennung
        var counterDebounceTimer = null;
        KEK.elem('[data-testid="wishlist-counter"]', function(counters) {
            if (!counters || !counters.length) return;
            var counterEl = counters[0];
            log('Wishlist-Counter gefunden, starte Observer');
            var counterObserver = new MutationObserver(function() {
                clearTimeout(counterDebounceTimer);
                counterDebounceTimer = setTimeout(function() {
                    log('Wishlist-Counter geändert - synchronisiere Buttons');
                    syncWishlistButtons();
                }, COUNTER_DEBOUNCE);
            });
            counterObserver.observe(counterEl, { characterData: true, subtree: true, childList: true });
        });
        
        KEK.elem(selectors.oldReco, function(recos) {
            log('Element gefunden:', recos);
            
            if (!recos || !recos.length) return;
            
            var oldReco = recos[0];
            
            // Bereits von uns aktualisiert? Skip.
            if (oldReco.classList.contains('ec-reco-updated')) {
                var currentUrl = getProductUrl();
                if (currentUrl === cache.lastRenderedUrl) {
                    log('Bereits aktualisiert für diese URL - skip');
                    return;
                }
                // URL hat sich geändert - neu laden
                log('URL geändert - refresh nötig');
                oldReco.classList.remove('ec-reco-updated');
                cache.template = null;
            }
            
            // Nur auf PDP-Seiten verarbeiten
            if (!/\/p\/\d+/.test(window.location.pathname)) {
                log('Keine PDP URL - skip');
                return;
            }
            
            var swiperWrapper = KEK.qs(selectors.swiperWrapper, oldReco);
            if (!swiperWrapper) {
                log('Kein Swiper-Wrapper gefunden - skip');
                return;
            }
            
            // KERNLÖSUNG: Warte bis React fertig gerendert hat
            // Der DOM muss für 400ms stabil sein, bevor wir rendern
            waitForStableDOM(swiperWrapper, function(onComplete) {
                var urlNow = getProductUrl();
                log('DOM stabil, lade für URL:', urlNow);
                
                // Nochmal prüfen ob nicht schon updated
                if (oldReco.classList.contains('ec-reco-updated')) {
                    log('Wurde zwischenzeitlich bereits aktualisiert - skip');
                    if (onComplete) onComplete(); // Trotzdem einblenden
                    return;
                }
                
                var wrapper = oldReco.closest(selectors.recoWrapper) || oldReco.parentElement;
                cache.wrapper = wrapper;
                cache.lastRenderedUrl = urlNow;
                loadAndRenderReco(wrapper, null, null, onComplete);
            }, oldReco);
        });
    }

    // Start
    setup();

})(new window.KEK());
