// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description USP-Benefit-Box Karussell unter Header (Mobile)
 */

(function(KEK, win) {
    "use strict";

    // =========================================================================
    // DEVICE DETECTION
    // Erkennt Mobile vs Desktop NUR anhand Viewport-Breite (640px Breakpoint)
    // User-Agent wird NICHT mehr verwendet - matchMedia ist zuverlässiger
    // =========================================================================
    
    // Aktueller Device-Typ basierend auf Viewport (NICHT User-Agent!)
    let currentDeviceType = win.innerWidth < 640 ? 'mobile' : 'desktop';

    // =========================================================================
    // PAGE TYPE DETECTION
    // Ermittelt Seitentyp (homepage/category/pdp) anhand DOM-Struktur
    // =========================================================================

    function getPageTypeFromDOM() {
        const header = document.querySelector('[data-testid="header"]');
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
    // Fügt USP-Box je nach Seitentyp an der richtigen Stelle ein
    // =========================================================================

    let lastPageType = null;

    function insertUSPBox(pageType) {
        // Guard: Bereits eingefügt? → Skip
        if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
        
        // currentDeviceType verwenden (wird von matchMedia aktualisiert)
        // NICHT isMobile() - das prüft UA und ignoriert Viewport-Änderungen
        const mobile = currentDeviceType === 'mobile';
        const html = mobile ? createCarousel() : createDesktopTiles();
        const initEvents = mobile ? initCarouselEvents : initTileEvents;

        if (pageType === 'homepage') {
            // Home: nach hero-teaser-slider
            KEK.elem('[data-testid="hero-teaser-slider"]', function(els) {
                if (!els) return;
                if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
                KEK.insert(els[0], 'afterend', html);
                initEvents();
            });
        } else if (pageType === 'category') {
            // Category: Desktop nach 2. Produkt (3-Spalten-Grid), Mobile nach 3. Produkt (2-Spalten-Grid)
            KEK.elem('[data-testid="product-list-card"]', function(els) {
                if (!els) return;
                if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
                const minProducts = mobile ? 3 : 2;
                const targetIndex = els.length >= minProducts ? (minProducts - 1) : els.length - 1;
                KEK.insert(els[targetIndex], 'afterend', html);
                initEvents();
            });
        } else if (pageType === 'pdp') {
            // PDP: vor story-telling ODER vor retraced-story (Fallback)
            KEK.elem('[data-testid="story-telling"], [data-totalretracedstory]', function(els) {
                if (!els) return;
                if (KEK.qs('.kk-usp-carousel') || KEK.qs('.kk-usp-tiles')) return;
                KEK.insert(els[0], 'beforebegin', html);
                els[0].parentNode.removeChild(els[0]);
                initEvents();
            });
        }
    }

    function onPageChange() {
        const pageType = getPageTypeFromDOM();
        if (!pageType) return;
        
        // Nur feuern wenn sich der PageType tatsächlich geändert hat
        if (pageType === lastPageType) return;
        lastPageType = pageType;
        
        insertUSPBox(pageType);
    }

    // =========================================================================
    // SPA NAVIGATION
    // MutationObserver erkennt Seitenwechsel in der Single Page App
    // =========================================================================

    function initPageChangeListener() {
        // Direkt auf das Page-Container-Element warten (nicht auf Header)
        // Löst Race Condition beim Cold Load
        KEK.elem('[data-testid="contentPage"], [data-testid="categoryPage"], [data-testid="productPage"]', function(els) {
            if (!els) return;
            const pageContainer = els[0];
            
            // Initial: Seite gefunden → direkt einfügen
            onPageChange();
            
            // Observer für SPA-Navigation (wenn sich data-testid ändert)
            const observer = new MutationObserver(function() {
                onPageChange();
            });
            
            observer.observe(pageContainer, { 
                attributes: true,
                attributeFilter: ['data-testid']
            });
        });
    }

    // =========================================================================
    // USP DATA
    // Inhalte der drei USP-Karten (Qualität, Nachhaltigkeit, Service)
    // =========================================================================

    const USP_DATA = [
        {
            id: 'quality',
            headline: 'Qualität, die bleibt',
            subline: 'Gemacht für viele Jahre.',
            text: 'Für uns zeigt sich Qualität dort, wo Material, Verarbeitung und Nutzung zusammenkommen.',
            bullets: [
                'robuste Naturmaterialien, die für regelmäßiges Tragen ausgelegt sind',
                'saubere Verarbeitung und stabile Nähte, die auch nach vielen Waschgängen halten',
                'Schnitte, die formstabil bleiben und nicht schnell altern',
                'Produkte, die bewusst auf Langlebigkeit statt schnellen Ersatz ausgelegt sind'
            ]
        },
        {
            id: 'sustainability',
            headline: 'Nachhaltigkeit',
            subline: 'Platzhalter',
            text: 'Wir setzen auf verantwortungsvolle Produktion und transparente Lieferketten.',
            bullets: [
                'Bio-zertifizierte Materialien aus kontrolliertem Anbau',
                'faire Arbeitsbedingungen in der gesamten Lieferkette',
                'ressourcenschonende Produktionsprozesse',
                'langlebige Produkte statt Fast Fashion'
            ]
        },
        {
            id: 'service',
            headline: 'Service & Garantie',
            subline: 'Platzhalter',
            text: 'Wir stehen hinter unseren Produkten und bieten umfassenden Service.',
            bullets: [
                'kostenloser Versand ab 50€ Bestellwert',
                'einfache Retoure innerhalb von 30 Tagen',
                'persönliche Beratung per Telefon und E-Mail',
                'Reparaturservice für ausgewählte Produkte'
            ]
        }
    ];

    // =========================================================================
    // SESSION STORAGE
    // Speichert Slide-Index für Rotation zwischen Seitenwechseln
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
            const normalizedIndex = ((index % USP_DATA.length) + USP_DATA.length) % USP_DATA.length;
            sessionStorage.setItem(STORAGE_KEY, normalizedIndex);
        } catch (e) {}
    }

    function getNextSlideIndex() {
        const current = getStoredSlideIndex();
        return (current + 1) % USP_DATA.length;
    }

    // =========================================================================
    // DRAWER (Slide-in Panel)
    // Zeigt Detail-Infos zu einem USP beim Klick auf Karte/Link
    // =========================================================================

    let isOpen = false;

    function getUspById(id) {
        for (let i = 0; i < USP_DATA.length; i++) {
            if (USP_DATA[i].id === id) {
                return USP_DATA[i];
            }
        }
        return USP_DATA[0];
    }

    function buildBulletList(bullets) {
        let html = '<ul class="kk-usp-drawer__bullets">';
        for (let i = 0; i < bullets.length; i++) {
            html += '<li>' + bullets[i] + '</li>';
        }
        html += '</ul>';
        return html;
    }

    function updateDrawerContent(uspId) {
        const usp = getUspById(uspId);
        const contentEl = KEK.qs('.kk-usp-drawer__content');
        
        if (!contentEl || !usp) return;

        contentEl.innerHTML = '<div class="kk-usp-drawer__icon-headline-row">' +
            '<div class="kk-usp-drawer__icon">' + ICON_SVG + '</div>' +
            '<h2 class="kk-usp-drawer__headline">' + usp.headline + '</h2>' +
        '</div>' +
        '<p class="kk-usp-drawer__text">' + usp.text + '</p>' +
        buildBulletList(usp.bullets);
    }

    function createDrawer() {
        if (KEK.qs('.kk-usp-drawer')) return;

        KEK.insert(document.body, 'beforeend', '<div class="kk-usp-backdrop"></div>');
        KEK.insert(document.body, 'beforeend',
            '<div class="kk-usp-drawer">' +
                '<div class="kk-usp-drawer__header">' +
                    '<button class="kk-usp-drawer__close" aria-label="Schließen">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                            '<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
                '<div class="kk-usp-drawer__content"></div>' +
            '</div>'
        );

        KEK.elem('.kk-usp-drawer__close', function(els) {
            if (!els) return;
            els[0].addEventListener('click', closeDrawer);
        });

        KEK.elem('.kk-usp-backdrop', function(els) {
            if (!els) return;
            els[0].addEventListener('click', closeDrawer);
        });
    }

    function openDrawer(uspId) {
        if (isOpen) return;
        
        updateDrawerContent(uspId || 'quality');
        isOpen = true;

        const backdrop = KEK.qs('.kk-usp-backdrop');
        const drawer = KEK.qs('.kk-usp-drawer');

        if (backdrop) KEK.defineClass(backdrop, 'kk-usp-backdrop--active');
        if (drawer) KEK.defineClass(drawer, 'kk-usp-drawer--open');
    }

    function closeDrawer() {
        if (!isOpen) return;
        isOpen = false;

        const backdrop = KEK.qs('.kk-usp-backdrop');
        const drawer = KEK.qs('.kk-usp-drawer');

        if (backdrop) KEK.defineClass(backdrop, 'kk-usp-backdrop--active', true);
        if (drawer) KEK.defineClass(drawer, 'kk-usp-drawer--open', true);
    }

    // =========================================================================
    // SHARED ASSETS
    // Icon-SVG und HTML-Builder für Cards (DRY: Mobile + Desktop nutzen diese)
    // =========================================================================

    const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 37">' +
        '<path d="M25.31 33.68c-4.07 2.75-9.32 2.77-13.41.28-2.06-1.25-3.28-3.17-3.65-5.49-2.43-.41-4.36-1.72-5.57-3.82-2.21-3.84-2.24-8.71-.04-12.54C3.87 9.97 5.79 8.6 8.27 8.22c.43-2.63 1.97-4.69 4.38-5.89 5.73-2.86 14.67-1.2 15.86 5.87 2.38.37 4.34 1.66 5.59 3.79 2.3 3.91 2.28 8.85-.04 12.76-1.23 2.08-3.18 3.33-5.52 3.72-.34 2.12-1.33 3.92-3.22 5.2Zm1.89-5.17c-3.7-.4-7.11-2.58-8.13-6.22-.29-1.02-.04-2.19.62-2.78s1.78-.81 2.68-.47c3.42 1.28 5.79 4.44 6.19 8.13 6.04-1.2 7.13-9.27 4.69-14.03-.98-1.91-2.61-3.29-4.71-3.56-.38 3.69-2.54 7-6.08 8.09-1.05.32-2.27.1-2.88-.56s-.78-1.84-.47-2.8c1.11-3.48 4.34-5.68 8.07-6.1-.29-2.01-1.56-3.62-3.37-4.58C18.8.95 10.67 2.32 9.65 8.21c3.72.44 6.87 2.58 8.03 6.01.33.98.18 2.16-.34 2.78-.67.79-1.87 1.07-2.89.7-3.5-1.25-5.48-4.47-6.19-8.1-1.93.24-3.48 1.44-4.47 3.16C.95 17.67 2.2 26.05 8.25 27.18c.42-3.74 2.61-6.97 6.1-8.07 1.04-.33 2.26-.15 2.93.59.56.63.74 1.79.44 2.76-1.09 3.55-4.4 5.7-8.09 6.08.34 2.23 1.83 3.95 3.89 4.9 4.7 2.15 12.56 1.12 13.7-4.89ZM9.61 9.56c.25 3.11 4.99 8.31 6.57 6.72s-2.89-6.95-6.57-6.72m17.58.01c-3.08.2-5.95 2.16-6.88 5.16-.14.46-.04 1.24.22 1.49 1.6 1.56 6.79-2.61 6.66-6.66ZM16.11 20.43c-2.31-1.58-6.71 3.51-6.49 6.73 5.03-.09 8.39-5.43 6.49-6.73m11.08 6.66c-.29-3.32-4.86-8.4-6.59-6.81s2.76 7.11 6.59 6.81"/>' +
    '</svg>';

    let currentSlide = 0;

    // Shared Card HTML Builder
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

    function buildCarouselSlides() {
        let html = '';
        html += buildSlideHTML(USP_DATA[USP_DATA.length - 1], true);
        for (let i = 0; i < USP_DATA.length; i++) {
            html += buildSlideHTML(USP_DATA[i], false);
        }
        html += buildSlideHTML(USP_DATA[0], true);
        return html;
    }

    function buildDots() {
        let html = '';
        for (let i = 0; i < USP_DATA.length; i++) {
            const activeClass = i === 0 ? ' kk-usp-carousel__dot--active' : '';
            html += '<button class="kk-usp-carousel__dot' + activeClass + '" data-slide="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
        }
        return html;
    }

    // =========================================================================
    // MOBILE: CAROUSEL
    // Swipebares Karussell mit Clone-Slides für Infinite Loop
    // =========================================================================

    function createCarousel() {
        if (KEK.qs('.kk-usp-carousel')) return;

        const carouselHTML = '<div class="kk-usp-carousel">' +
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
    // DESKTOP: TILES
    // Statische 3-Spalten Kacheln ohne Swipe
    // =========================================================================

    function createDesktopTiles() {
        if (KEK.qs('.kk-usp-tiles')) return;

        let tilesHTML = '<div class="kk-usp-tiles">';
        for (let i = 0; i < USP_DATA.length; i++) {
            tilesHTML += '<div class="kk-usp-card" data-usp-id="' + USP_DATA[i].id + '">' +
                buildCardHTML(USP_DATA[i]) +
            '</div>';
        }
        tilesHTML += '</div>';
        return tilesHTML;
    }

    // =========================================================================
    // CAROUSEL LOGIC
    // Slide-Navigation, Position-Update, Infinite-Loop mit Clones
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
            const dotIndex = ((currentSlide % USP_DATA.length) + USP_DATA.length) % USP_DATA.length;
            for (let i = 0; i < dots.length; i++) {
                KEK.defineClass(dots[i], 'kk-usp-carousel__dot--active', true);
            }
            KEK.defineClass(dots[dotIndex], 'kk-usp-carousel__dot--active');
        }
    }

    function goToSlide(index, animate) {
        const total = USP_DATA.length;
        
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
    // EVENT HANDLERS
    // Touch/Swipe für Carousel, Click für Drawer-Öffnung
    // =========================================================================

    function initCarouselEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startOffset = 0;
        let hasMoved = false;

        function getCurrentOffset() {
            const slideWidth = getSlideWidth();
            const gap = 30;
            const trackIndex = currentSlide + 1;
            return trackIndex * (slideWidth + gap);
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
                    
                    // Ermittle den Index dieser Slide
                    let clickedIndex = -1;
                    if (isClone) {
                        // Clone: finde den echten Index anhand der uspId
                        for (let j = 0; j < USP_DATA.length; j++) {
                            if (USP_DATA[j].id === uspId) {
                                clickedIndex = j;
                                break;
                            }
                        }
                    } else {
                        const realSlides = KEK.qsa('.kk-usp-carousel__slide:not(.kk-usp-carousel__slide--clone)');
                        clickedIndex = Array.prototype.indexOf.call(realSlides, this);
                    }
                    
                    // Aktive Slide → Drawer öffnen, sonst Slide wechseln
                    if (clickedIndex === currentSlide) {
                        openDrawer(uspId);
                    } else if (clickedIndex >= 0) {
                        goToSlide(clickedIndex);
                    }
                });
            }
        });

        // Nächsten Slide aus SessionStorage holen und setzen
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
    // VIEWPORT CHANGE HANDLING
    // Reagiert auf Device-Rotation (Portrait ↔ Landscape)
    // =========================================================================

    function handleViewportChange(isMobileNow) {
        const newDeviceType = isMobileNow ? 'mobile' : 'desktop';
        
        // Nur reagieren wenn sich der Device-Typ ändert
        if (newDeviceType === currentDeviceType) return;
        currentDeviceType = newDeviceType;
        
        // Altes Element entfernen
        const oldCarousel = KEK.qs('.kk-usp-carousel');
        const oldTiles = KEK.qs('.kk-usp-tiles');
        if (oldCarousel) oldCarousel.parentNode.removeChild(oldCarousel);
        if (oldTiles) oldTiles.parentNode.removeChild(oldTiles);
        
        // Neu einfügen mit aktuellem Layout
        const pageType = getPageTypeFromDOM();
        if (pageType) {
            lastPageType = null; // Reset damit insertUSPBox neu feuert
            insertUSPBox(pageType);
        }
    }

    function initViewportChangeListener() {
        const mobileBreakpoint = win.matchMedia('(max-width: 639px)');
        mobileBreakpoint.addEventListener('change', function(e) {
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
