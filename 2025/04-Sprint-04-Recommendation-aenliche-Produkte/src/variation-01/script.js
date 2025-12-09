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

    console.log('[econda Reco] Script gestartet');

    // Early exit für nicht-PDP Seiten
    if (!/\/p\/\d+/.test(window.location.pathname)) {
        console.log('[econda Reco] Keine PDP - Exit');
        return;
    }

    var CONFIG = {
        accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
        widgetId: '202',
        baseUrl: 'https://widgets.crosssell.info/eps/crosssell/recommendations/',
        graphqlEndpoint: 'https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app//api/graphql',
        csize: 20
    };

    /**
     * Country aus URL oder HTML-Lang ermitteln
     * Hessnatur URLs: /de/, /at/, /ch/, /fr/, /nl/, /be/, etc.
     */
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

    // Cache für Template und GUID
    var cache = {
        template: null,
        guid: null,
        productId: null,
        lastRenderedProductId: null,
        wrapper: null
    };

    var STORAGE_KEY = 'econda_reco_cache';
    var CACHE_TTL = 30 * 60 * 1000; // 30 Minuten

    /**
     * Produkte aus sessionStorage laden
     */
    function getCachedProducts(productId) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return null;
            
            var data = JSON.parse(cached);
            var entry = data[productId];
            
            if (entry && (Date.now() - entry.timestamp) < CACHE_TTL) {
                console.log('[econda Reco] Cache Hit für Produkt:', productId);
                return entry.products;
            }
            
            // Abgelaufenen Eintrag löschen
            if (entry) {
                delete data[productId];
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch (e) {
            console.warn('[econda Reco] Cache Lesefehler:', e);
        }
        return null;
    }

    /**
     * Produkte in sessionStorage speichern
     */
    function setCachedProducts(productId, products) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            var data = cached ? JSON.parse(cached) : {};
            
            data[productId] = {
                products: products,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('[econda Reco] Cache gespeichert für Produkt:', productId, '(' + products.length + ' Produkte)');
        } catch (e) {
            console.warn('[econda Reco] Cache Schreibfehler:', e);
        }
    }

    /**
     * Aktuelle Produkt-ID aus URL extrahieren (immer frisch)
     */
    function getProductId() {
        var match = window.location.pathname.match(/\/p\/(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * GUID aus verschiedenen Quellen holen oder generieren
     */
    function getGuid() {
        if (cache.guid) return cache.guid;
        
        // 1. Aus Cookie (verschiedene mögliche Namen)
        var cookiePatterns = [/guid=([^;]+)/, /hn_guid=([^;]+)/, /customer_guid=([^;]+)/];
        for (var i = 0; i < cookiePatterns.length; i++) {
            var match = document.cookie.match(cookiePatterns[i]);
            if (match) {
                cache.guid = match[1];
                console.log('[econda Reco] GUID aus Cookie gefunden:', cache.guid);
                return cache.guid;
            }
        }
        
        // 2. Aus localStorage
        try {
            var lsKeys = ['guid', 'hn_guid', 'customer_guid', 'wishlist_guid'];
            for (var j = 0; j < lsKeys.length; j++) {
                var val = localStorage.getItem(lsKeys[j]);
                if (val) {
                    cache.guid = val;
                    console.log('[econda Reco] GUID aus localStorage gefunden:', cache.guid);
                    return cache.guid;
                }
            }
        } catch (_) {
            // localStorage nicht verfügbar
        }
        
        // 3. Aus sessionStorage
        try {
            var ssKeys = ['guid', 'hn_guid', 'customer_guid'];
            for (var k = 0; k < ssKeys.length; k++) {
                var ssVal = sessionStorage.getItem(ssKeys[k]);
                if (ssVal) {
                    cache.guid = ssVal;
                    console.log('[econda Reco] GUID aus sessionStorage gefunden:', cache.guid);
                    return cache.guid;
                }
            }
        } catch (_) {
            // sessionStorage nicht verfügbar
        }
        
        // 4. Aus __NEXT_DATA__ (Next.js State)
        try {
            var nextDataEl = document.getElementById('__NEXT_DATA__');
            if (nextDataEl) {
                var nextData = JSON.parse(nextDataEl.textContent);
                if (nextData.props && nextData.props.pageProps) {
                    var pageProps = nextData.props.pageProps;
                    cache.guid = pageProps.guid || pageProps.customerGuid || pageProps.wishlistGuid;
                    if (cache.guid) {
                        console.log('[econda Reco] GUID aus __NEXT_DATA__ gefunden:', cache.guid);
                        return cache.guid;
                    }
                }
            }
        } catch (_) {
            // JSON parse error
        }
        
        // 5. Neue GUID generieren und speichern
        cache.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        console.log('[econda Reco] Neue GUID generiert:', cache.guid);
        
        // In localStorage speichern für spätere Verwendung
        try {
            localStorage.setItem('guid', cache.guid);
        } catch (_) {
            // localStorage nicht verfügbar
        }
        
        return cache.guid;
    }

    /**
     * Wishlist Mutation aufrufen
     */
    function addToWishlist(productCode, button) {
        var guid = getGuid();
        console.log('[econda Reco] Wishlist Add:', productCode, 'GUID:', guid, 'Country:', getCountry());
        if (!guid) {
            console.warn('[econda Reco] Keine GUID gefunden');
            return;
        }

        fetch(CONFIG.graphqlEndpoint, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                operationName: 'updateWishlistEntry',
                variables: {
                    country: getCountry(),
                    guid: guid,
                    code: productCode
                },
                query: 'mutation updateWishlistEntry($country: String!, $code: String!, $guid: String, $token: String) { updateWishlistEntry(country: $country, code: $code, guid: $guid, token: $token) { __typename ... on WishlistModification { quantity quantityAdded statusCode guid __typename } ... on GenericOCCResponse { success invalidFields __typename } } }'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            console.log('[econda Reco] Wishlist Response:', data);
            if (data.data && data.data.updateWishlistEntry) {
                button.classList.add('is-active');
                var svg = button.querySelector('svg');
                if (svg) svg.setAttribute('data-prefix', 'fas');
            }
        })
        .catch(function(err) {
            console.error('[econda Reco] Wishlist Error:', err);
        });
    }

    /**
     * ProductCard mit econda-Daten befüllen
     */
    function fillProductCard(card, product, index) {
        // Debug erstes Produkt
        if (index === 0) {
            console.log('[econda Reco] Erstes Produkt:', product);
            console.log('[econda Reco] Verfügbare Keys:', Object.keys(product));
        }

        var id = product.id || '';
        var name = product.name || '';
        var image = product.iconurl || product.imageurl || '';
        var originalPrice = product.oldprice1 || '';
        var currentPrice = product.price || '';
        var showAsDiscounted = product.reduced === 'true' && originalPrice.length > 0;

        // URL bauen: deeplink verwenden oder aus ID generieren
        var url = product.deeplink || '';
        if (!url && id) {
            // Fallback: URL aus Produkt-ID bauen (hessnatur Format)
            var country = getCountry();
            url = 'https://www.hessnatur.com/' + country + '/p/' + id;
        }
        if (!url) url = '#';

        // Debug URL
        if (index === 0) {
            console.log('[econda Reco] URL für erstes Produkt:', url);
            console.log('[econda Reco] deeplink:', product.deeplink);
            console.log('[econda Reco] id:', id);
        }

        // Link - href direkt setzen
        var link = card.querySelector('a');
        if (link) {
            link.href = url;
            link.title = name; // Tooltip aktualisieren
            // Produkt-ID als Data-Attribut für Wishlist speichern
            link.setAttribute('data-product-id', id);
            console.log('[econda Reco] Link href gesetzt:', url);
        }

        // Bild
        var img = card.querySelector(selectors.productCardImage);
        if (img && image) {
            img.removeAttribute('srcset');
            img.src = image;
            img.alt = name;
            img.title = name; // Tooltip auch auf Bild
        }

        // Titel
        var headline = card.querySelector(selectors.productCardHeadline);
        if (headline) headline.textContent = name;

        // Preis - Elemente einmal selektieren
        var priceLabel = card.querySelector(selectors.priceLabel);
        var priceDiscounted = card.querySelector(selectors.priceLabelDiscounted);
        var priceStriked = card.querySelector(selectors.priceLabelStriked);

        if (showAsDiscounted) {
            if (priceDiscounted) {
                priceDiscounted.innerHTML = '<div>' + currentPrice + '</div>';
                priceDiscounted.parentElement.style.display = '';
            }
            if (priceStriked) {
                priceStriked.textContent = originalPrice;
                priceStriked.parentElement.style.display = '';
            }
            if (priceLabel) priceLabel.parentElement.style.display = 'none';
        } else {
            if (priceLabel) {
                priceLabel.textContent = currentPrice;
                priceLabel.parentElement.style.display = '';
            } else if (priceDiscounted) {
                priceDiscounted.innerHTML = '<div style="color:#000!important">' + currentPrice + '</div>';
                priceDiscounted.style.color = '#000';
                priceDiscounted.parentElement.style.display = '';
            }
            if (priceStriked && priceStriked.parentElement) priceStriked.parentElement.style.display = 'none';
            if (priceLabel && priceDiscounted && priceDiscounted.parentElement) priceDiscounted.parentElement.style.display = 'none';
        }

        // Wishlist-Button - komplett neu erstellen um React-Binding zu umgehen
        var wishlistBtn = card.querySelector(selectors.wishlistButton);
        if (wishlistBtn) {
            // Button klonen um alle React-Event-Handler zu entfernen
            var newBtn = wishlistBtn.cloneNode(true);
            newBtn.setAttribute('data-code', id);
            newBtn.classList.add('ec-wishlist-btn');
            
            // Click-Handler direkt binden
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('[econda Reco] Wishlist Button geklickt, code:', id);
                addToWishlist(id, newBtn);
                return false;
            }, true);
            
            wishlistBtn.parentNode.replaceChild(newBtn, wishlistBtn);
        }
    }

    /**
     * Wishlist Click-Handler direkt auf Buttons binden
     */
    function bindWishlistButtons(container) {
        var buttons = container.querySelectorAll('.ec-wishlist-btn');
        console.log('[econda Reco] Binde Wishlist-Buttons:', buttons.length);
        
        buttons.forEach(function(btn) {
            // Alten Handler entfernen falls vorhanden
            btn.removeEventListener('click', btn._wishlistHandler);
            
            // Neuen Handler erstellen und speichern
            btn._wishlistHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                var code = btn.getAttribute('data-code');
                console.log('[econda Reco] Wishlist Button geklickt, code:', code);
                if (code) addToWishlist(code, btn);
                return false;
            };
            
            btn.addEventListener('click', btn._wishlistHandler, { capture: true });
        });
    }

    /**
     * Produkte deduplizieren
     */
    function dedupeProducts(products) {
        var seen = {};
        return products.filter(function(p) {
            if (seen[p.id]) return false;
            seen[p.id] = true;
            return true;
        });
    }

    /**
     * Reco mit econda-Daten befüllen
     */
    function initEcondaReco(wrapper, products) {
        console.log('[econda Reco] initEcondaReco mit', products.length, 'Produkten');
        
        var oldReco = KEK.qs(selectors.oldReco, wrapper);
        if (!oldReco) {
            console.error('[econda Reco] Original-Reco nicht gefunden');
            return;
        }

        var swiperWrapper = KEK.qs(selectors.swiperWrapper, oldReco);
        if (!swiperWrapper) {
            console.error('[econda Reco] Swiper-Wrapper nicht gefunden');
            return;
        }

        // Template cachen
        if (!cache.template) {
            var templateSlide = KEK.qs('.swiper-slide', swiperWrapper);
            if (!templateSlide) return;
            cache.template = templateSlide.cloneNode(true);
        }

        console.log('[econda Reco] Rendere', products.length, 'Produkte');

        // DocumentFragment für bessere Performance
        var fragment = document.createDocumentFragment();

        products.forEach(function(product, index) {
            var newSlide = cache.template.cloneNode(true);
            newSlide.className = 'swiper-slide';
            newSlide.style.cssText = 'width:296.8px;margin-right:12px';
            newSlide.setAttribute('aria-label', (index + 1) + ' / ' + products.length);

            var card = KEK.qs(selectors.productCard, newSlide);
            if (card) fillProductCard(card, product, index);

            fragment.appendChild(newSlide);
        });

        // DOM nur einmal manipulieren
        swiperWrapper.innerHTML = '';
        swiperWrapper.appendChild(fragment);

        // Swiper updaten
        var swiperContainer = KEK.qs('.swiper', oldReco);
        if (swiperContainer && swiperContainer.swiper) {
            swiperContainer.swiper.update();
            swiperContainer.swiper.slideTo(0, 0);
            console.log('[econda Reco] Swiper aktualisiert');
        }

        // Wishlist-Buttons binden (bei jedem Rendern neu binden)
        bindWishlistButtons(oldReco);
        
        // Marker-Klasse hinzufügen
        oldReco.classList.add('ec-reco-updated');

        // Aktuelle Produkt-ID merken für Variantenwechsel-Erkennung
        cache.lastRenderedProductId = getProductId();

        console.log('[econda Reco] ✅ Reco erfolgreich aktualisiert mit', products.length, 'Produkten für Produkt:', cache.lastRenderedProductId);
    }

    /**
     * API URL bauen
     */
    function buildApiUrl(productId, start) {
        return CONFIG.baseUrl + CONFIG.accountId + '.do?' +
            'wid=' + CONFIG.widgetId +
            '&type=cs&pid=' + productId +
            '&aid=' + CONFIG.accountId +
            '&widgetdetails=true&csize=' + CONFIG.csize + '&start=' + (start || 0);
    }

    /**
     * econda-Daten laden (mit Cache und Nachladen bei < 5 unique Produkten)
     */
    function loadAndRenderReco(wrapper, existingProducts, start) {
        var productId = getProductId();
        if (!productId) {
            console.error('[econda Reco] Keine Produkt-ID in URL gefunden');
            return;
        }

        // Erst Cache prüfen (nur beim ersten Aufruf)
        if (!existingProducts && !start) {
            var cachedProducts = getCachedProducts(productId);
            if (cachedProducts && cachedProducts.length >= 5) {
                console.log('[econda Reco] Verwende gecachte Produkte');
                initEcondaReco(wrapper, cachedProducts);
                return;
            }
        }

        existingProducts = existingProducts || [];
        start = start || 0;

        var apiUrl = buildApiUrl(productId, start);
        console.log('[econda Reco] API Request (start=' + start + '):', apiUrl);

        fetch(apiUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                console.log('[econda Reco] API Response:', data);
                var newProducts = data.items || data.products || [];
                
                if (!newProducts.length && !existingProducts.length) {
                    console.warn('[econda Reco] Keine Produkte in Response');
                    return;
                }

                // Alle Produkte zusammenführen
                var allProducts = existingProducts.concat(newProducts);
                var uniqueProducts = dedupeProducts(allProducts);
                
                console.log('[econda Reco] Unique Produkte bisher:', uniqueProducts.length);

                // Wenn weniger als 5 unique Produkte UND neue Produkte geladen wurden, nachladen
                var minProducts = 5;
                var maxRetries = 3;
                var currentRetry = Math.floor(start / CONFIG.csize);
                
                if (uniqueProducts.length < minProducts && newProducts.length > 0 && currentRetry < maxRetries) {
                    console.log('[econda Reco] Nur', uniqueProducts.length, 'unique Produkte - lade weitere nach...');
                    loadAndRenderReco(wrapper, allProducts, start + CONFIG.csize);
                    return;
                }

                // Genug Produkte oder max. Versuche erreicht - rendern
                if (uniqueProducts.length) {
                    // In Cache speichern
                    setCachedProducts(productId, uniqueProducts);
                    initEcondaReco(wrapper, uniqueProducts);
                } else {
                    console.warn('[econda Reco] Keine unique Produkte gefunden');
                }
            })
            .catch(function(err) {
                console.error('[econda Reco] API Error:', err);
            });
    }

    /**
     * Reco aktualisieren bei Produktwechsel
     */
    function refreshRecoIfNeeded() {
        var currentProductId = getProductId();
        
        // Nur aktualisieren wenn sich die Produkt-ID geändert hat
        if (currentProductId && currentProductId !== cache.lastRenderedProductId) {
            console.log('[econda Reco] Produktwechsel erkannt:', cache.lastRenderedProductId, '->', currentProductId);
            
            // Marker-Klasse entfernen für Re-Rendering
            var oldReco = document.querySelector(selectors.oldReco);
            if (oldReco) {
                oldReco.classList.remove('ec-reco-updated');
            }
            
            // Template-Cache leeren (Template könnte sich geändert haben)
            cache.template = null;
            
            // Wrapper finden und neu laden
            var wrapper = oldReco ? (oldReco.closest(selectors.recoWrapper) || oldReco.parentElement) : cache.wrapper;
            if (wrapper) {
                loadAndRenderReco(wrapper);
            }
        }
    }

    /**
     * URL-Änderungen beobachten (für SPA-Navigation und Variantenwechsel)
     */
    function observeUrlChanges() {
        // History API abfangen (pushState, replaceState)
        var originalPushState = history.pushState;
        var originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            console.log('[econda Reco] URL geändert (pushState)');
            setTimeout(refreshRecoIfNeeded, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            console.log('[econda Reco] URL geändert (replaceState)');
            setTimeout(refreshRecoIfNeeded, 100);
        };
        
        // Popstate für Zurück/Vorwärts-Navigation
        window.addEventListener('popstate', function() {
            console.log('[econda Reco] URL geändert (popstate)');
            setTimeout(refreshRecoIfNeeded, 100);
        });
        
        console.log('[econda Reco] URL-Observer aktiviert');
    }

    /**
     * Setup - SPA-ready mit URL-Observer
     */
    function setup() {
        console.log('[econda Reco] Setup gestartet, warte auf:', selectors.oldReco);
        
        // URL-Observer für Variantenwechsel
        observeUrlChanges();
        
        KEK.elem(selectors.oldReco, function(recos) {
            console.log('[econda Reco] Element gefunden:', recos);
            if (recos && recos.length && !recos[0].classList.contains('ec-reco-updated')) {
                var wrapper = recos[0].closest(selectors.recoWrapper) || recos[0].parentElement;
                cache.wrapper = wrapper; // Wrapper cachen für spätere Refreshs
                loadAndRenderReco(wrapper);
            }
        });
    }

    // Start
    setup();

})(new window.KEK());
