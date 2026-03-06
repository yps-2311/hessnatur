// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description USP-Benefit-Box: 3 USP-Karten (Qualität, Nachhaltigkeit, Service)
 *   - Mobile: Swipe-Karussell mit Infinite-Loop (Clone-Slides)
 *   - Desktop: 3 statische Tiles im Produkt-Grid
 *   - Klick auf Karte → Drawer mit Detail-Infos
 *   - Karussell rotiert zwischen Seitenaufrufen via SessionStorage
 *   - Category: MutationObserver re-positioniert Tiles nach Sort/Filter
 */

(function(KEK, win) {
    "use strict";

    // =========================================================================
    // WEBFONTS – Inter 300 (Sublines) + Tinos italic (Testimonials)
    // Outfit (Headlines) wird von hessnatur nativ geladen.
    // =========================================================================

    if (!KEK.qs('link[href*="Inter"]')) {
        KEK.insert(document.head, 'beforeend',
            '<link rel="preconnect" href="https://fonts.googleapis.com">' +
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
            '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&family=Tinos:ital@1&display=swap" rel="stylesheet">'
        );
    }

    // =========================================================================
    // DEVICE DETECTION
    // =========================================================================

    // matchMedia-basiert (640px Breakpoint), wird von initViewportChangeListener aktualisiert
    let currentDeviceType = win.innerWidth < 640 ? 'mobile' : 'desktop';

    // =========================================================================
    // PAGE TYPE DETECTION
    // =========================================================================

    // Leitet Seitentyp aus data-testid des ersten Siblings nach dem Header ab.
    // hessnatur SPA nutzt ein einziges Container-Element, dessen testid den Typ bestimmt.
    function getPageTypeFromDOM() {
        const header = KEK.qs('[data-testid="header"]');
        if (!header) return null;
        
        const sibling = header.nextElementSibling;
        if (!sibling) return null;
        
        const testId = sibling.getAttribute('data-testid');
        if (testId === 'contentPage') return 'homepage';
        if (testId === 'categoryPage') return 'category';
        if (testId === 'productPage') return 'pdp';
        return null;
    }

    // =========================================================================
    // INSERTION LOGIC
    // =========================================================================

    let lastPageType = null;
    let categoryGridObserver = null;

    // =========================================================================
    // CATEGORY GRID: Sort/Filter-Reaktivität (DOM-Flag Ansatz)
    //
    // Problem: React ersetzt Product Cards bei Sort/Filter komplett.
    //          Unsere Tiles (Fremdkörper im React-DOM) werden dabei verschoben.
    //
    // Lösung:  data-kk-processed auf erste Product Card setzen.
    //          React ersetzt Cards → Marker verschwindet → Observer triggert
    //          → Tiles cleanup + re-insert an korrekter Position.
    //          Eigene Inserts berühren keine Cards → Marker bleibt → kein Loop.
    // =========================================================================

    function cleanupCategoryTiles() {
        const existingCarousel = KEK.qs('.kk-usp-carousel');
        const existingTiles = KEK.qs('.kk-usp-tiles');
        if (existingCarousel) existingCarousel.remove();
        if (existingTiles) existingTiles.remove();
    }

    // Positioniert Tiles nach dem n-ten Produkt im Grid.
    // Guard: data-kk-processed auf erster Card verhindert Re-Insert (→ kein Observer-Loop).
    function positionTilesInGrid() {
        const cards = KEK.qsa('[data-testid="product-list-card"]');
        if (!cards || cards.length === 0) return;

        if (cards[0].hasAttribute('data-kk-processed')) return;

        cleanupCategoryTiles();

        const mobile = currentDeviceType === 'mobile';
        const html = mobile ? createCarousel() : createDesktopTiles();
        const initEvents = mobile ? initCarouselEvents : initTileEvents;

        // Sale-Seiten haben 4-Spalten-Grid (--large Modifier am Klassennamen)
        const productGrid = KEK.qs('[data-testid="product-grid"]');
        const isLargeGrid = !mobile && productGrid && productGrid.className.includes('--large');

        // Promo-Banner-Erkennung: Banner sitzt im DOM am Ende, wird aber via CSS Grid
        // visuell an Row 1 / Col 2 platziert → verschiebt alle Produkte um 1.
        // Kein Banner → Position +1 kompensieren.
        const hasBanner = productGrid && KEK.qs('[data-testid="product-grid-action-banner-teaser"]', productGrid);
        const promoOffset = hasBanner ? 0 : 1;

        // Insert-Position: Mobile nach 3., Desktop nach 2., Large Grid nach 3. Produkt
        // Ohne Promo-Element: +1 (Mobile nach 4., Desktop nach 3., Large Grid nach 4.)
        const minProducts = (mobile ? 3 : (isLargeGrid ? 3 : 2)) + promoOffset;
        const targetIndex = cards.length >= minProducts ? (minProducts - 1) : cards.length - 1;
        KEK.insert(cards[targetIndex], 'afterend', html);

        // 4-Spalten-Grid: Modifier-Klasse für CSS grid-column: span 4
        if (isLargeGrid) {
            const tiles = KEK.qs('.kk-usp-tiles');
            if (tiles) KEK.defineClass(tiles, 'kk-usp-tiles--large-grid');
        }

        initEvents();

        // DOM-Flag setzen – React entfernt es beim nächsten Re-Render
        cards[0].setAttribute('data-kk-processed', '');
    }

    // MutationObserver auf Grid + Wrapper:
    // - Grid (childList): React tauscht Cards bei Sort/Filter → Observer feuert
    // - Wrapper (childList): React könnte Grid-Node komplett ersetzen
    // positionTilesInGrid() hat Guard → nur Aktion wenn Marker fehlt
    function startCategoryGridObserver() {
        if (categoryGridObserver) return;

        const grid = KEK.qs('[data-testid="product-grid"]');
        if (!grid) return;

        categoryGridObserver = new MutationObserver(function() {
            positionTilesInGrid();

            // Grid-Node könnte durch React ersetzt worden sein → neu observen
            const currentGrid = KEK.qs('[data-testid="product-grid"]');
            if (currentGrid) categoryGridObserver.observe(currentGrid, { childList: true });
        });

        categoryGridObserver.observe(grid, { childList: true });

        if (grid.parentElement) {
            categoryGridObserver.observe(grid.parentElement, { childList: true });
        }
    }

    function stopCategoryGridObserver() {
        if (categoryGridObserver) {
            categoryGridObserver.disconnect();
            categoryGridObserver = null;
        }
    }

    function insertCategoryUSP() {
        KEK.elem('[data-testid="product-list-card"]', function(els) {
            if (!els) return;
            positionTilesInGrid();
            startCategoryGridObserver();
        });
    }

    // Routing: Leitet an die richtige Insert-Logik je nach Seitentyp weiter.
    // Category hat eigenen Flow (Observer), Homepage/PDP sind One-Shot-Inserts.
    function insertUSPBox(pageType) {
        if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;

        if (pageType === 'category') {
            insertCategoryUSP();
            return;
        } else {
            stopCategoryGridObserver();
        }

        const mobile = currentDeviceType === 'mobile';
        const html = mobile ? createCarousel() : createDesktopTiles();
        const initEvents = mobile ? initCarouselEvents : initTileEvents;

        if (pageType === 'homepage') {
            KEK.elem('[data-testid="hero-teaser-slider"]', function(els) {
                if (!els) return;
                if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
                KEK.insert(els[0], 'afterend', html);
                initEvents();
            });
        } else if (pageType === 'pdp') {
            // Ersetzt story-telling/retraced-story durch USP-Box
            KEK.elem('[data-testid="story-telling"], [data-totalretracedstory]', function(els) {
                if (!els) return;
                if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
                KEK.insert(els[0], 'beforebegin', html);
                els[0].style.display = 'none';
                initEvents();
            });
        }
    }

    // Dedupliziert aufeinanderfolgende Aufrufe mit gleichem Seitentyp
    function onPageChange() {
        const pageType = getPageTypeFromDOM();
        if (!pageType) return;
        if (pageType === lastPageType) return;
        lastPageType = pageType;
        insertUSPBox(pageType);
    }

    // =========================================================================
    // SPA NAVIGATION
    // =========================================================================

    // hessnatur SPA ändert data-testid am Page-Container bei Navigation.
    // Observer darauf erkennt Seitenwechsel ohne URL-Polling.
    function initPageChangeListener() {
        KEK.elem('[data-testid="contentPage"], [data-testid="categoryPage"], [data-testid="productPage"]', function(els) {
            if (!els) return;
            
            onPageChange();
            
            const observer = new MutationObserver(function() {
                onPageChange();
            });
            observer.observe(els[0], { attributes: true, attributeFilter: ['data-testid'] });
        });
    }

    // =========================================================================
    // USP DATA – Inhalte der 3 USP-Karten
    // =========================================================================

    const uspData = [
        {
            id: 'conscious',
            headline: 'Bewusst, statt beliebig',
            subline: 'Ehrlich gefertigt. Fair gedacht.',
            text: 'Wir stehen für eine klare Haltung, nicht für flüchtige Trends. Weil wir seit 1976 beweisen, wie fest Mode und Verantwortung zusammengehören. Darum passen unsere Produkte nicht nur für eine Saison, sondern für ein ganzes Leben. Damit du eine bewusste Wahl treffen kannst.',
            bullets: [
                'Keine Kompromisse: Konsequentes Handeln im Einklang mit der Natur',
                'Geprüft fair: Ausgezeichnet fair: Leader-Status bei der Fair Wear Foundation',
                'Natürlich: schon 99,6% unserer Materialien sind natürlichen Ursprungs Kaufentscheidungen mit Weitblick für langfristige Zufriedenheit',
                'Durchdacht: Vom Rohstoff bis zum Design Gestaltung mit Blick auf Nutzung statt kurzfristiger Neuheit'
            ],
            testimonialCite: 'Nachhaltig zu arbeiten ist möglich und hessnatur beweist das seit 50 Jahren.',
            testimonialName: 'Patrick Götz,<br/> Chief Product & Sustainability Officer hessnatur'
        },
        {
            id: 'quality',
            headline: 'Qualität, die bleibt',
            subline: 'Gemacht für viele Jahre.',
            text: 'Qualität ist für uns kein Zufall, sondern ein Versprechen. Mit 99,6% Materialien natürlichen Ursprungs und verbindlichen Standards stellen wir sicher, dass deine Kleidung nicht nur hautverträglich ist, sondern auch den Herausforderungen deines Alltags dauerhaft standhält. Damit du lange Freude an deinen Lieblingsstücken hast.',
            bullets: [
                '99,6% Materialien natürlichen Ursprungs für unverfälschte Qualität ohne Kompromisse',
                'Unabhängige Zertifikate wie der GOTS für geprüfte Produktionsstandards',
                'Langjährige Partnerschaften für gleichbleibend hohe Qualität',
                'Second Hand Shop für ein zweites Leben deiner Lieblingsstücke'
            ],
            testimonialCite: 'Mode ist für uns mehr als ein Produkt – sie ist eine Haltung. Jedes Stück steht für natürliche Materialien, präzise Schnitte und langlebige Qualität.',
            testimonialName: 'Patrick Götz,<br/> Chief Product & Sustainability Officer hessnatur'
        },
        {
            id: 'less-is-more',
            headline: 'Weniger, aber besser',
            subline: 'Achtsam kaufen. Lange tragen.',
            text: 'Bewusster Konsum bedeutet nicht Verzicht, sondern Lebensqualität. Weil er deinen Kleiderschrank übersichtlicher und deinen Stil klarer/authentischer macht. Darum schaffen wir Kleidung, die bleibt. Lieblingsstücke, die sich mühelos kombinieren lassen. Und dir jeden Tag das gute Gefühl geben, nicht irgendetwas, sondern eine bewusste Entscheidung zu tragen.',
            bullets: [
                'Capsule Wardrobe: Dein Kleiderschrank aus wenigen, perfekt kombinierbaren Lieblingsstücken',
                'Zeitloses Design: Essentials, die Trends überdauern',
                'Langlebige Naturmaterialien: gemacht, um zu bleiben',
                'Ressourcenschonend: Vom Anbau der Fasern bis zu unserem Second Hand Shop'
            ],
            testimonialCite: 'Es ist mir einfach wichtig, einer Marke vertrauen zu können. Ich weiß, bei hessnatur bin ich einfach gut aufgehoben.',
            testimonialName: 'Maria Astor,<br/> Content Creator & Autorin'
        }
    ];

    // =========================================================================
    // SESSION STORAGE – Slide-Rotation zwischen Seitenaufrufen
    // Bei jedem Load wird der nächste Slide angezeigt (0 → 1 → 2 → 0 …)
    // =========================================================================

    const STORAGE_KEY = 'kk-usp-slide-index';

    function getStoredSlideIndex() {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored !== null ? parseInt(stored, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    function saveSlideIndex(index) {
        try {
            const normalizedIndex = ((index % uspData.length) + uspData.length) % uspData.length;
            sessionStorage.setItem(STORAGE_KEY, normalizedIndex);
        } catch (e) {}
    }

    function getNextSlideIndex() {
        const current = getStoredSlideIndex();
        return (current + 1) % uspData.length;
    }

    // =========================================================================
    // TRACKING
    // =========================================================================

    function trackUspInteraction(uspId, source) {
        win.dataLayer = win.dataLayer || [];
        win.dataLayer.push({
            event: 'Ecommerce - select_promotion',
            event_name: 'select_promotion',
            ecommerce: {
                creative_name: 'kk_usp_benefit_box_' + uspId,
                creative_slot: source,
                promotion_name: 'kk_usp_benefit_box'
            }
        });
    }

    // =========================================================================
    // DRAWER – Slide-in Panel mit Detail-Infos pro USP
    // Öffnet von rechts, Backdrop schließt bei Klick
    // =========================================================================

    function buildBulletList(bullets) {
        let html = '<ul class="kk-usp-drawer__bullets">';
        for (let i = 0; i < bullets.length; i++) {
            html += '<li>' + bullets[i] + '</li>';
        }
        html += '</ul>';
        return html;
    }

    // Baut das HTML für ein einzelnes Akkordeon-Item (Header + Body)
    function buildAccordionItem(usp) {
        return '<div class="kk-usp-drawer__accordion-item" data-usp-id="' + usp.id + '">' +
            '<div class="kk-usp-drawer__accordion-header">' +
                '<div class="kk-usp-drawer__icon">' + ICON_SVG + '</div>' +
                '<div class="kk-usp-drawer__header-text">' +
                    '<h2 class="kk-usp-drawer__headline">' + usp.headline + '</h2>' +
                    '<p class="kk-usp-drawer__subline">' + usp.subline + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="kk-usp-drawer__accordion-body">' +
                '<div class="kk-usp-drawer__accordion-body-inner">' +
                    '<p class="kk-usp-drawer__text">' + usp.text + '</p>' +
                    buildBulletList(usp.bullets) +
                    '<blockquote class="kk-usp-drawer__testimonial">' +
                        '<p class="kk-usp-drawer__testimonial-cite">' + usp.testimonialCite + '</p>' +
                        '<footer class="kk-usp-drawer__testimonial-name">— ' + usp.testimonialName + '</footer>' +
                    '</blockquote>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    // Klappt das gewählte Akkordeon-Item auf, alle anderen zu.
    // Klick auf bereits aktives Item wird ignoriert (kein Toggle).
    function activateAccordionItem(uspId) {
        const items = KEK.qsa('.kk-usp-drawer__accordion-item');
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].getAttribute('data-usp-id') === uspId) {
                KEK.defineClass(items[i], 'kk-usp-drawer__accordion-item--active');
            } else {
                KEK.defineClass(items[i], 'kk-usp-drawer__accordion-item--active', true);
            }
        }
    }

    // Drawer + Backdrop werden einmalig am Body-Ende eingefügt.
    // Alle 3 USPs als Akkordeon-Items vorgerendert – kein späteres innerHTML nötig.
    function createDrawer() {
        if (KEK.qs('.kk-usp-drawer')) return;

        let accordionHTML = '';
        for (let i = 0; i < uspData.length; i++) {
            accordionHTML += buildAccordionItem(uspData[i]);
        }

        KEK.insert(document.body, 'beforeend', '<div class="kk-usp-backdrop" style="opacity:0;visibility:hidden"></div>');
        KEK.insert(document.body, 'beforeend',
            '<div class="kk-usp-drawer" style="transform:translateX(100%)">' +
                '<button class="kk-usp-drawer__close" aria-label="Schließen">' +
                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>' +
                '</button>' +
                '<div class="kk-usp-drawer__content">' + accordionHTML + '</div>' +
            '</div>'
        );

        // Close-Button + Backdrop schließen den Drawer
        KEK.elem('.kk-usp-drawer__close', function(els) {
            if (!els) return;
            els[0].addEventListener('click', closeDrawer);
        });

        KEK.elem('.kk-usp-backdrop', function(els) {
            if (!els) return;
            els[0].addEventListener('click', closeDrawer);
        });

        // Akkordeon-Header Click → inaktive Items aufklappen
        KEK.elem('.kk-usp-drawer__accordion-header', function(headers) {
            if (!headers) return;
            for (let i = 0; i < headers.length; i++) {
                headers[i].addEventListener('click', function() {
                    const item = this.closest('.kk-usp-drawer__accordion-item');
                    if (!item || item.classList.contains('kk-usp-drawer__accordion-item--active')) return;
                    const accordionUspId = item.getAttribute('data-usp-id');
                    activateAccordionItem(accordionUspId);
                    trackUspInteraction(accordionUspId, 'accordion');
                });
            }
        });
    }

    function openDrawer(uspId) {
        const drawer = KEK.qs('.kk-usp-drawer');
        if (drawer && drawer.classList.contains('kk-usp-drawer--open')) return;
        
        activateAccordionItem(uspId || 'quality');
        trackUspInteraction(uspId || 'quality', 'card');

        const backdrop = KEK.qs('.kk-usp-backdrop');

        if (backdrop) KEK.defineClass(backdrop, 'kk-usp-backdrop--active');
        if (drawer) {
            drawer.scrollTop = 0;
            KEK.defineClass(drawer, 'kk-usp-drawer--open');
        }
    }

    function closeDrawer() {
        const drawer = KEK.qs('.kk-usp-drawer');
        if (!drawer || !drawer.classList.contains('kk-usp-drawer--open')) return;

        const backdrop = KEK.qs('.kk-usp-backdrop');

        if (backdrop) KEK.defineClass(backdrop, 'kk-usp-backdrop--active', true);
        KEK.defineClass(drawer, 'kk-usp-drawer--open', true);
    }

    // =========================================================================
    // SHARED ASSETS – Icon + Card-HTML-Builder (Mobile + Desktop)
    // =========================================================================

    const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 37">' +
        '<path d="M25.31 33.68c-4.07 2.75-9.32 2.77-13.41.28-2.06-1.25-3.28-3.17-3.65-5.49-2.43-.41-4.36-1.72-5.57-3.82-2.21-3.84-2.24-8.71-.04-12.54C3.87 9.97 5.79 8.6 8.27 8.22c.43-2.63 1.97-4.69 4.38-5.89 5.73-2.86 14.67-1.2 15.86 5.87 2.38.37 4.34 1.66 5.59 3.79 2.3 3.91 2.28 8.85-.04 12.76-1.23 2.08-3.18 3.33-5.52 3.72-.34 2.12-1.33 3.92-3.22 5.2Zm1.89-5.17c-3.7-.4-7.11-2.58-8.13-6.22-.29-1.02-.04-2.19.62-2.78s1.78-.81 2.68-.47c3.42 1.28 5.79 4.44 6.19 8.13 6.04-1.2 7.13-9.27 4.69-14.03-.98-1.91-2.61-3.29-4.71-3.56-.38 3.69-2.54 7-6.08 8.09-1.05.32-2.27.1-2.88-.56s-.78-1.84-.47-2.8c1.11-3.48 4.34-5.68 8.07-6.1-.29-2.01-1.56-3.62-3.37-4.58C18.8.95 10.67 2.32 9.65 8.21c3.72.44 6.87 2.58 8.03 6.01.33.98.18 2.16-.34 2.78-.67.79-1.87 1.07-2.89.7-3.5-1.25-5.48-4.47-6.19-8.1-1.93.24-3.48 1.44-4.47 3.16C.95 17.67 2.2 26.05 8.25 27.18c.42-3.74 2.61-6.97 6.1-8.07 1.04-.33 2.26-.15 2.93.59.56.63.74 1.79.44 2.76-1.09 3.55-4.4 5.7-8.09 6.08.34 2.23 1.83 3.95 3.89 4.9 4.7 2.15 12.56 1.12 13.7-4.89ZM9.61 9.56c.25 3.11 4.99 8.31 6.57 6.72s-2.89-6.95-6.57-6.72m17.58.01c-3.08.2-5.95 2.16-6.88 5.16-.14.46-.04 1.24.22 1.49 1.6 1.56 6.79-2.61 6.66-6.66ZM16.11 20.43c-2.31-1.58-6.71 3.51-6.49 6.73 5.03-.09 8.39-5.43 6.49-6.73m11.08 6.66c-.29-3.32-4.86-8.4-6.59-6.81s2.76 7.11 6.59 6.81"/>' +
    '</svg>';

    let currentSlide = 0;

    function buildCardHTML(usp) {
        return '<div class="kk-usp-card__icon">' + ICON_SVG + '</div>' +
            '<h3 class="kk-usp-card__headline">' + usp.headline + '</h3>' +
            '<p class="kk-usp-card__subline">' + usp.subline + '</p>' +
            '<a href="#" class="kk-usp-card__link" data-usp-id="' + usp.id + '">Mehr erfahren</a>';
    }

    function buildSlideHTML(usp, isClone) {
        const cloneClass = isClone ? ' kk-usp-carousel__slide--clone' : '';
        return '<div class="kk-usp-carousel__slide kk-usp-card' + cloneClass + '" data-usp-id="' + usp.id + '">' +
            buildCardHTML(usp) +
        '</div>';
    }

    // Clone am Anfang (letzter Slide) + am Ende (erster Slide) für Infinite-Loop-Effekt
    function buildCarouselSlides() {
        let html = '';
        html += buildSlideHTML(uspData[uspData.length - 1], true);
        for (let i = 0; i < uspData.length; i++) {
            html += buildSlideHTML(uspData[i], false);
        }
        html += buildSlideHTML(uspData[0], true);
        return html;
    }

    function buildDots() {
        let html = '';
        for (let i = 0; i < uspData.length; i++) {
            const activeClass = i === 0 ? ' kk-usp-carousel__dot--active' : '';
            html += '<button class="kk-usp-carousel__dot' + activeClass + '" data-slide="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
        }
        return html;
    }

    // =========================================================================
    // MOBILE: CAROUSEL (Swipe + Infinite Loop via Clones)
    // =========================================================================

    // display:none inline → CSS Override mit display:flex!important verhindert FOUC
    function createCarousel() {
        if (KEK.qs('.kk-usp-carousel')) return;

        const carouselHTML = '<div class="kk-usp-carousel" style="display:none">' +
            '<div class="kk-usp-carousel__track">' +
                buildCarouselSlides() +
            '</div>' +
            '<div class="kk-usp-carousel__dots">' +
                buildDots() +
            '</div>' +
        '</div>';

        return carouselHTML;
    }

    // =========================================================================
    // DESKTOP: TILES (3 statische Kacheln)
    // =========================================================================

    function createDesktopTiles() {
        if (KEK.qs('.kk-usp-tiles')) return;

        let tilesHTML = '<div class="kk-usp-tiles" style="display:none">';
        for (let i = 0; i < uspData.length; i++) {
            tilesHTML += '<div class="kk-usp-card" data-usp-id="' + uspData[i].id + '">' +
                buildCardHTML(uspData[i]) +
            '</div>';
        }
        tilesHTML += '</div>';
        return tilesHTML;
    }

    // =========================================================================
    // CAROUSEL LOGIC – Slide-Navigation + Infinite-Loop
    // Track-Offset = (currentSlide + 1) wegen Clone am Anfang.
    // Bei Über-/Unterlauf: animiert zum Clone, dann ohne Transition zurücksetzen.
    // =========================================================================

    function getSlideWidth() {
        const slide = KEK.qs('.kk-usp-carousel__slide');
        return slide ? slide.offsetWidth : 0;
    }

    function updateSlidePosition(animate) {
        const track = KEK.qs('.kk-usp-carousel__track');
        if (!track) return;

        const slideWidth = getSlideWidth();
        const gap = 30;
        const trackIndex = currentSlide + 1;
        const offset = trackIndex * (slideWidth + gap);

        if (animate === false) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.3s ease';
        }
        track.style.transform = 'translateX(-' + offset + 'px)';

        const dots = KEK.qsa('.kk-usp-carousel__dot');
        if (dots && dots.length > 0) {
            const dotIndex = ((currentSlide % uspData.length) + uspData.length) % uspData.length;
            for (let i = 0; i < dots.length; i++) {
                KEK.defineClass(dots[i], 'kk-usp-carousel__dot--active', true);
            }
            KEK.defineClass(dots[dotIndex], 'kk-usp-carousel__dot--active');
        }
    }

    function goToSlide(index, animate) {
        const total = uspData.length;
        
        if (index < 0) {
            currentSlide = -1;
            updateSlidePosition(true);
            setTimeout(function() {
                currentSlide = total - 1;
                saveSlideIndex(currentSlide);
                updateSlidePosition(false);
            }, 300);
        } else if (index >= total) {
            currentSlide = total;
            updateSlidePosition(true);
            setTimeout(function() {
                currentSlide = 0;
                saveSlideIndex(currentSlide);
                updateSlidePosition(false);
            }, 300);
        } else {
            currentSlide = index;
            saveSlideIndex(currentSlide);
            updateSlidePosition(animate);
        }
    }

    // =========================================================================
    // EVENT HANDLERS – Touch/Swipe + Click → Drawer
    // hasMoved Flag unterscheidet Tap von Swipe (verhindert Drawer-Open bei Swipe)
    // =========================================================================

    function initCarouselEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startOffset = 0;
        let hasMoved = false;

        function getCurrentOffset() {
            const slideWidth = getSlideWidth();
            return (currentSlide + 1) * (slideWidth + 30);
        }

        KEK.elem('.kk-usp-carousel__dot', function(dots) {
            if (!dots) return;
            for (let i = 0; i < dots.length; i++) {
                dots[i].addEventListener('click', function() {
                    const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
                    goToSlide(slideIndex);
                });
            }
        });

        KEK.elem('.kk-usp-carousel .kk-usp-card__link', function(links) {
            if (!links) return;
            for (let i = 0; i < links.length; i++) {
                links[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    if (hasMoved) return;
                    const uspId = this.getAttribute('data-usp-id');
                    openDrawer(uspId);
                });
            }
        });

        KEK.elem('.kk-usp-carousel', function(carousels) {
            if (!carousels) return;
            const carousel = carousels[0];
            const track = KEK.qs('.kk-usp-carousel__track', carousel);
            if (!track) return;

            carousel.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                isDragging = true;
                hasMoved = false;
                startOffset = getCurrentOffset();
                track.style.transition = 'none';
            }, { passive: true });

            carousel.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diff = startX - currentX;
                
                if (Math.abs(diff) > 10) {
                    hasMoved = true;
                }
                
                const newOffset = startOffset + diff;
                track.style.transform = 'translateX(-' + newOffset + 'px)';
            }, { passive: true });

            carousel.addEventListener('touchend', function(e) {
                if (!isDragging) return;
                isDragging = false;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                track.style.transition = 'transform 0.3s ease';

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        goToSlide(currentSlide + 1);
                    } else {
                        goToSlide(currentSlide - 1);
                    }
                } else {
                    updateSlidePosition(true);
                }
            });
        });

        KEK.elem('.kk-usp-carousel__slide', function(slides) {
            if (!slides) return;
            for (let i = 0; i < slides.length; i++) {
                slides[i].addEventListener('click', function(e) {
                    if (hasMoved) return;
                    if (e.target.closest('.kk-usp-card__link')) return;
                    
                    const isClone = this.classList.contains('kk-usp-carousel__slide--clone');
                    const uspId = this.getAttribute('data-usp-id');
                    
                    // Clone-Slides haben keinen Array-Index → anhand uspId auflösen
                    let clickedIndex = -1;
                    if (isClone) {
                        for (let j = 0; j < uspData.length; j++) {
                            if (uspData[j].id === uspId) {
                                clickedIndex = j;
                                break;
                            }
                        }
                    } else {
                        const realSlides = KEK.qsa('.kk-usp-carousel__slide:not(.kk-usp-carousel__slide--clone)');
                        clickedIndex = Array.prototype.indexOf.call(realSlides, this);
                    }
                    
                    if (clickedIndex === currentSlide) {
                        openDrawer(uspId);
                    } else if (clickedIndex >= 0) {
                        goToSlide(clickedIndex);
                    }
                });
            }
        });

        // Rotation: Nächsten Slide aus SessionStorage anzeigen
        currentSlide = getNextSlideIndex();
        saveSlideIndex(currentSlide);
        updateSlidePosition(false);
    }

    function initTileEvents() {
        KEK.elem('.kk-usp-tiles .kk-usp-card__link', function(links) {
            if (!links) return;
            for (let i = 0; i < links.length; i++) {
                links[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    const uspId = this.getAttribute('data-usp-id');
                    openDrawer(uspId);
                });
            }
        });

        KEK.elem('.kk-usp-tiles .kk-usp-card', function(tiles) {
            if (!tiles) return;
            for (let i = 0; i < tiles.length; i++) {
                tiles[i].addEventListener('click', function(e) {
                    if (e.target.closest('.kk-usp-card__link')) return;
                    const uspId = this.getAttribute('data-usp-id');
                    openDrawer(uspId);
                });
            }
        });
    }

    // =========================================================================
    // VIEWPORT CHANGE – Carousel ↔ Tiles bei Breakpoint-Wechsel
    // =========================================================================

    // Entfernt aktuelles Layout, setzt lastPageType zurück → insertUSPBox baut neu
    function handleViewportChange(isMobileNow) {
        const newDeviceType = isMobileNow ? 'mobile' : 'desktop';
        if (newDeviceType === currentDeviceType) return;
        currentDeviceType = newDeviceType;
        
        cleanupCategoryTiles();
        
        const pageType = getPageTypeFromDOM();
        if (pageType) {
            lastPageType = null;
            insertUSPBox(pageType);
        }
    }

    function initViewportChangeListener() {
        win.matchMedia('(max-width: 639px)').addEventListener('change', function(e) {
            handleViewportChange(e.matches);
        });
    }

    // =========================================================================
    // INIT
    // =========================================================================

    createDrawer();
    initPageChangeListener();
    initViewportChangeListener();

})(new window.KEK(), window);
