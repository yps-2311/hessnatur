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
     * Toast-Benachrichtigung anzeigen (wie hessnatur native)
     */
    function showToast(message, type) {
        // Bestehenden Toast entfernen
        var existingToast = document.querySelector('.ec-reco-toast');
        if (existingToast) existingToast.remove();

        var toast = document.createElement('div');
        toast.className = 'ec-reco-toast';
        
        var isSuccess = type === 'success';
        var iconSvg = isSuccess 
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#4CAF50"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FFC107"/><path d="M12 8v4M12 16h.01" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>';
        
        toast.innerHTML = iconSvg + '<span>' + message + '</span><button class="ec-toast-close">&times;</button>';
        
        // Styles inline setzen
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#fff;padding:16px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;gap:12px;z-index:99999;font-family:inherit;font-size:14px;max-width:350px;animation:ecToastIn 0.3s ease;';
        
        // Close Button Style
        var closeBtn = toast.querySelector('.ec-toast-close');
        closeBtn.style.cssText = 'background:none;border:none;font-size:20px;cursor:pointer;color:#999;padding:0;margin-left:8px;';
        closeBtn.onclick = function() { toast.remove(); };
        
        // Animation CSS hinzufügen
        if (!document.querySelector('#ec-toast-styles')) {
            var style = document.createElement('style');
            style.id = 'ec-toast-styles';
            style.textContent = '@keyframes ecToastIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}@keyframes ecToastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Nach 4 Sekunden ausblenden
        setTimeout(function() {
            toast.style.animation = 'ecToastOut 0.3s ease forwards';
            setTimeout(function() { toast.remove(); }, 300);
        }, 4000);
    }

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
     * GUID aus verschiedenen Quellen holen
     */
    function getGuid() {
        if (cache.guid) return cache.guid;
        
        // 1. Aus hessnatur Wishlist-Cookie (primäre Quelle!)
        // Format: HessnaturDESite-wishlist, HessnaturATSite-wishlist, etc.
        var wishlistCookieMatch = document.cookie.match(/Hessnatur[A-Z]{2}Site-wishlist=([^;]+)/);
        if (wishlistCookieMatch) {
            cache.guid = wishlistCookieMatch[1];
            console.log('[econda Reco] GUID aus Wishlist-Cookie gefunden:', cache.guid);
            return cache.guid;
        }
        
        // 2. Aus Cookie (verschiedene mögliche Namen)
        var cookiePatterns = [/guid=([^;]+)/, /hn_guid=([^;]+)/, /customer_guid=([^;]+)/];
        for (var i = 0; i < cookiePatterns.length; i++) {
            var match = document.cookie.match(cookiePatterns[i]);
            if (match) {
                cache.guid = match[1];
                console.log('[econda Reco] GUID aus Cookie gefunden:', cache.guid);
                return cache.guid;
            }
        }
        
        // 3. Aus localStorage
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
        
        // 4. Aus sessionStorage
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
        
        // 5. Keine GUID gefunden - nicht generieren, sondern null zurückgeben
        console.warn('[econda Reco] Keine Wishlist-GUID gefunden');
        return null;
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
            var entry = data.data && data.data.updateWishlistEntry;
            if (entry) {
                // Erfolg prüfen - quantityAdded > 0 = neu hinzugefügt, quantityAdded === 0 = bereits vorhanden
                if (entry.quantityAdded !== undefined) {
                    if (entry.quantityAdded > 0) {
                        console.log('[econda Reco] ✅ Wishlist Erfolg - neu hinzugefügt!');
                        showToast('Der Artikel wurde zum Merkzettel hinzugefügt.', 'success');
                    } else {
                        console.log('[econda Reco] ⚠️ Artikel bereits auf Merkzettel');
                        showToast('Der Artikel ist bereits auf deinem Merkzettel.', 'warning');
                    }
                    // Visuelles Feedback - Herz füllen
                    button.classList.add('is-active');
                    var svg = button.querySelector('svg');
                    if (svg) {
                        svg.setAttribute('data-prefix', 'fas');
                        svg.style.color = '#c00'; // Rotes Herz
                    }
                    // Kurze Animation
                    button.style.transform = 'scale(1.2)';
                    setTimeout(function() {
                        button.style.transform = '';
                    }, 200);
                } else if (entry.invalidFields) {
                    console.warn('[econda Reco] Wishlist Fehler:', entry.invalidFields);
                    showToast('Fehler beim Hinzufügen zum Merkzettel.', 'warning');
                }
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
            if (index === 0) {
                console.log('[econda Reco] Bild gesetzt:', image);
            }
        } else if (index === 0) {
            console.log('[econda Reco] Bild Problem - img:', !!img, 'image:', image);
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
