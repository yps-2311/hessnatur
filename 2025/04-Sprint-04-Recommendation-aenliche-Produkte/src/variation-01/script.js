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
     * CSS für Wishlist-Button Hover-Effekt und Fade-Transition hinzufügen
     */
    function addRecoStyles() {
        if (document.querySelector('#ec-reco-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'ec-reco-styles';
        style.textContent = [
            // Wishlist Hover
            '.ec-reco-updated .ec-wishlist-btn:hover svg { color: #c00 !important; }',
            // Fade Transition für Anti-Flicker (schnell: 100ms)
            '.ec-reco-fade { transition: opacity 0.1s ease-out; }',
            '.ec-reco-fade.ec-fading { opacity: 0; }'
        ].join('\n');
        document.head.appendChild(style);
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

    // Cache für Template, GUID und Request-Tracking
    var cache = {
        template: null,
        guid: null,
        lastRenderedUrl: null,
        wrapper: null,
        isLoading: false,
        currentRequestToken: null // Verhindert Race Conditions bei schnellen URL-Wechseln
    };

    var STORAGE_KEY = 'econda_reco_cache';
    var CACHE_TTL = 30 * 60 * 1000; // 30 Minuten

    /**
     * Produkte aus sessionStorage laden
     * Nutzt vollständige URL als Key für Farbvarianten-Support
     */
    function getCachedProducts(productUrl) {
        try {
            var cached = sessionStorage.getItem(STORAGE_KEY);
            if (!cached) return null;
            
            var data = JSON.parse(cached);
            var entry = data[productUrl];
            
            if (entry && (Date.now() - entry.timestamp) < CACHE_TTL) {
                console.log('[econda Reco] Cache Hit für URL:', productUrl);
                return entry.products;
            }
            
            // Abgelaufenen Eintrag löschen
            if (entry) {
                delete data[productUrl];
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            }
        } catch (e) {
            console.warn('[econda Reco] Cache Lesefehler:', e);
        }
        return null;
    }

    /**
     * Produkte in sessionStorage speichern
     * Nutzt vollständige URL als Key für Farbvarianten-Support
     */
    function setCachedProducts(productUrl, products) {
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
                timestamp: Date.now()
            };
            
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('[econda Reco] Cache gespeichert für URL:', productUrl, '(' + products.length + ' Produkte)');
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
     * Vollständige Produkt-URL für Cache-Key (inkl. Farbvarianten)
     * Nutzt nur den Pathname - die Produkt-ID ändert sich bei Farbwechsel
     */
    function getProductUrl() {
        // Bei Hessnatur ändert sich die Produkt-ID im Pfad bei Farbwechsel
        // z.B. /de/p/5751788 -> /de/p/5751706
        // Daher ist der Pathname allein ausreichend als Cache-Key
        return window.location.pathname;
    }

    /**
     * Ausgewählte Größe aus der aktuellen URL extrahieren
     * Hessnatur Format: /p/5709863XL oder /p/5733876M
     * @returns {string|null} Die Größe (z.B. "XL", "M", "XXL") oder null
     */
    function getSelectedSizeFromUrl() {
        // Suche nach Produkt-ID mit angehängter Größe: /p/1234567XL
        var match = window.location.pathname.match(/\/p\/(\d+)([A-Z]+)(?:\?|$|\/)/i);
        if (match && match[2]) {
            var size = match[2].toUpperCase();
            // Validiere dass es eine echte Größe ist (nicht Teil der ID)
            var validSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2XL', '3XL'];
            if (validSizes.indexOf(size) > -1) {
                console.log('[econda Reco] Größe aus URL erkannt:', size);
                return size;
            }
        }
        return null;
    }

    /**
     * Größe an Produkt-URL anhängen (Hessnatur Format)
     * @param {string} url - Die Original-URL (z.B. https://www.hessnatur.com/de/p/5668959)
     * @param {string} size - Die Größe (z.B. "M")
     * @returns {string} URL mit Größe (z.B. https://www.hessnatur.com/de/p/5668959M)
     */
    function appendSizeToProductUrl(url, size) {
        if (!size || !url || url === '#') return url;
        
        // Finde /p/1234567 und hänge Größe an
        // Beachte: URL könnte schon Query-Parameter haben
        return url.replace(/(\/p\/\d+)([^A-Z]|$)/i, '$1' + size + '$2');
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
        } catch (e) {
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
        } catch (e) {
            // sessionStorage nicht verfügbar
        }
        
        // 5. Keine GUID gefunden - nicht generieren, sondern null zurückgeben
        console.warn('[econda Reco] Keine Wishlist-GUID gefunden');
        return null;
    }

    /**
     * Wishlist Mutation aufrufen
     */
    function addToWishlist(productCode) {
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
                if (entry.quantityAdded !== undefined) {
                    if (entry.quantityAdded > 0) {
                        console.log('[econda Reco] ✅ Wishlist Erfolg - neu hinzugefügt!');
                    } else {
                        console.log('[econda Reco] ⚠️ Artikel bereits auf Merkzettel');
                    }
                } else if (entry.invalidFields) {
                    console.warn('[econda Reco] Wishlist Fehler:', entry.invalidFields);
                }
            }
        })
        .catch(function(err) {
            console.error('[econda Reco] Wishlist Error:', err);
        });
    }

    /**
     * Discount in Prozent berechnen aus Streichpreis und aktuellem Preis
     * @param {string} oldPrice - Alter Preis z.B. "149,99 €"
     * @param {string} currentPrice - Aktueller Preis z.B. "99,99 €"
     * @returns {number|null} - Rabatt in Prozent (gerundet) oder null
     */
    function calculateDiscount(oldPrice, currentPrice) {
        if (!oldPrice || !currentPrice) return null;
        
        // Preis-String zu Zahl konvertieren: "149,99 €" -> 149.99
        var parsePrice = function(priceStr) {
            var cleaned = priceStr.replace(/[^\d,\.]/g, '').replace(',', '.');
            return parseFloat(cleaned);
        };
        
        var oldNum = parsePrice(oldPrice);
        var currentNum = parsePrice(currentPrice);
        
        if (isNaN(oldNum) || isNaN(currentNum) || oldNum <= 0) return null;
        
        var discount = Math.round((1 - currentNum / oldNum) * 100);
        return discount > 0 ? discount : null;
    }

    /**
     * DataLayer Event pushen für Tracking
     * @param {string} eventType - 'click' oder 'wishlist'
     * @param {object} product - Produkt-Objekt mit id, name, price, etc.
     * @param {number} index - Position im Reco-Slider (0-basiert)
     */
    function pushDataLayerEvent(eventType, product, index) {
        window.dataLayer = window.dataLayer || [];
        
        // Discount berechnen wenn Streichpreis vorhanden
        var discount = calculateDiscount(product.oldprice1, product.price);
        
        var eventData = {
            event: "select_item_from_list",
            item_id: product.id || '',
            item_name: product.name || '',
            index: index,
            price: product.price || '',
            item_list_name: "Ähnliche Produkte",
            item_variant: product.sku || '',
            currency: "EUR",
            interaction_type: eventType // 'click' oder 'wishlist'
        };
        
        // Discount nur hinzufügen wenn vorhanden
        if (discount !== null) {
            eventData.discount = discount;
        }
        
        window.dataLayer.push(eventData);
        console.log('[econda Reco] DataLayer Event gepusht:', eventData);
    }

    /**
     * ProductCard mit econda-Daten befüllen
     */
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
            link.setAttribute('data-original-href', url);
            
            // Alten Handler entfernen um Memory Leak zu verhindern
            if (link._clickHandler) {
                link.removeEventListener('click', link._clickHandler);
            }
            
            // Neuen Handler erstellen und speichern
            link._clickHandler = function() {
                pushDataLayerEvent('click', product, index);
                
                // Größe an URL anhängen falls vorhanden
                var currentSize = getSelectedSizeFromUrl();
                if (currentSize) {
                    var originalUrl = link.getAttribute('data-original-href');
                    var urlWithSize = appendSizeToProductUrl(originalUrl, currentSize);
                    if (urlWithSize !== originalUrl) {
                        link.href = urlWithSize;
                    }
                }
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
            } else if (priceDiscounted) {
                // Fallback wenn nur discounted Element vorhanden
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
            newBtn.setAttribute('data-reco-index', index);
            // Produkt-Daten für DataLayer speichern
            newBtn.setAttribute('data-product-json', JSON.stringify({
                id: product.id || '',
                name: product.name || '',
                price: product.price || '',
                sku: product.sku || ''
            }));
            newBtn.classList.add('ec-wishlist-btn');
            
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
                var index = parseInt(btn.getAttribute('data-reco-index') || '0', 10);
                var productJson = btn.getAttribute('data-product-json');
                
                console.log('[econda Reco] Wishlist Button geklickt, code:', code);
                
                // DataLayer Event feuern
                if (productJson) {
                    try {
                        var product = JSON.parse(productJson);
                        pushDataLayerEvent('wishlist', product, index);
                    } catch (err) {
                        console.warn('[econda Reco] Product JSON parse error:', err);
                    }
                }
                
                if (code) addToWishlist(code);
                return false;
            };
            
            btn.addEventListener('click', btn._wishlistHandler, { capture: true });
        });
    }

    /**
     * Produkte deduplizieren und aktuelles PDP-Produkt ausschließen
     * @param {Array} products - Array von Produkten
     * @param {string} [excludeId] - Produkt-ID die ausgeschlossen werden soll (aktuelles PDP-Produkt)
     */
    function dedupeProducts(products, excludeId) {
        var seen = {};
        return products.filter(function(p) {
            // Aktuelles PDP-Produkt ausschließen
            if (excludeId && p.id === excludeId) {
                console.log('[econda Reco] Produkt ausgeschlossen (aktuelles PDP):', p.id);
                return false;
            }
            // Duplikate filtern
            if (seen[p.id]) return false;
            seen[p.id] = true;
            return true;
        });
    }

    /**
     * Reco mit econda-Daten befüllen (mit Anti-Flicker Fade-Transition)
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

        // Styles hinzufügen (einmalig)
        addRecoStyles();

        // Template cachen
        if (!cache.template) {
            var templateSlide = KEK.qs('.swiper-slide', swiperWrapper);
            if (!templateSlide) return;
            cache.template = templateSlide.cloneNode(true);
        }

        console.log('[econda Reco] Rendere', products.length, 'Produkte');

        // DocumentFragment für bessere Performance vorbereiten
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
                console.log('[econda Reco] Swiper aktualisiert');
            }

            // Wishlist-Buttons binden
            bindWishlistButtons(oldReco);
            
            // Fade-in (nur bei Updates)
            if (isUpdate) {
                swiperWrapper.classList.remove('ec-fading');
            }
            
            // Marker-Klasse hinzufügen
            oldReco.classList.add('ec-reco-updated');

            console.log('[econda Reco] ✅ Reco erfolgreich aktualisiert mit', products.length, 'Produkten');
        }, fadeDelay);
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

        var productUrl = getProductUrl();
        
        // Verhindere doppelte API-Calls für dieselbe URL
        if (!existingProducts && !start && cache.isLoading && cache.lastRenderedUrl === productUrl) {
            console.log('[econda Reco] Bereits am Laden für URL:', productUrl, '- Skip');
            return;
        }
        
        console.log('[econda Reco] Lade Reco für URL:', productUrl);
        
        // URL SOFORT merken um Race Conditions zu vermeiden
        cache.lastRenderedUrl = productUrl;
        cache.isLoading = true;
        
        // Request-Token für Race Condition Schutz
        var requestToken = Date.now();
        cache.currentRequestToken = requestToken;

        // Erst Cache prüfen (nur beim ersten Aufruf) - nutzt vollständige URL
        if (!existingProducts && !start) {
            var cachedProducts = getCachedProducts(productUrl);
            if (cachedProducts && cachedProducts.length >= 5) {
                console.log('[econda Reco] Verwende gecachte Produkte für URL:', productUrl);
                cache.isLoading = false;
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
                // Race Condition Check: Ist dieser Request noch aktuell?
                if (cache.currentRequestToken !== requestToken) {
                    console.log('[econda Reco] Veralteter Request ignoriert (Token:', requestToken, 'vs', cache.currentRequestToken, ')');
                    return;
                }
                
                console.log('[econda Reco] API Response:', data);
                var newProducts = data.items || data.products || [];
                
                if (!newProducts.length && !existingProducts.length) {
                    console.warn('[econda Reco] Keine Produkte in Response');
                    cache.isLoading = false;
                    return;
                }

                // Alle Produkte zusammenführen und aktuelles Produkt ausschließen
                var allProducts = existingProducts.concat(newProducts);
                var uniqueProducts = dedupeProducts(allProducts, productId);
                
                console.log('[econda Reco] Unique Produkte bisher:', uniqueProducts.length);

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
                    console.log('[econda Reco] Nur', uniqueProducts.length, 'unique Produkte - lade weitere nach...');
                    loadAndRenderReco(wrapper, allProducts, start + CONFIG.csize);
                    return;
                }

                // Genug Produkte oder max. Versuche erreicht - rendern
                cache.isLoading = false;
                if (uniqueProducts.length) {
                    // In Cache speichern - mit vollständiger URL als Key
                    setCachedProducts(productUrl, uniqueProducts);
                    initEcondaReco(wrapper, uniqueProducts);
                } else {
                    console.warn('[econda Reco] Keine unique Produkte gefunden');
                }
            })
            .catch(function(err) {
                console.error('[econda Reco] API Error:', err);
                cache.isLoading = false;
            });
    }

    /**
     * Reco aktualisieren bei Produktwechsel (inkl. Farbvarianten)
     */
    function refreshRecoIfNeeded() {
        // Nur auf PDP-Seiten
        if (!/\/p\/\d+/.test(window.location.pathname)) {
            console.log('[econda Reco] Keine PDP - Skip refresh');
            return;
        }
        
        var currentUrl = getProductUrl();
        console.log('[econda Reco] Check refresh - current:', currentUrl, 'lastRendered:', cache.lastRenderedUrl);
        
        // Aktualisieren wenn sich die URL geändert hat (inkl. Farbvarianten!)
        if (currentUrl && currentUrl !== cache.lastRenderedUrl) {
            console.log('[econda Reco] URL-Wechsel erkannt:', cache.lastRenderedUrl, '->', currentUrl);
            
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
            } else {
                // Wrapper noch nicht vorhanden - warte auf Element
                console.log('[econda Reco] Wrapper nicht gefunden - warte auf Element');
                KEK.elem(selectors.oldReco, function(recos) {
                    if (recos && recos.length) {
                        var w = recos[0].closest(selectors.recoWrapper) || recos[0].parentElement;
                        cache.wrapper = w;
                        loadAndRenderReco(w);
                    }
                });
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
