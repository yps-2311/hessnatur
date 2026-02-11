/*
 * !LOAD KEK OBJECT
 * @codekit-prepend "../vendor/KEK.js";
 * @prepros-prepend "../vendor/KEK.js";
 */

/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description Sprint 11 - Variantendarstellung für Mobile (Farben) - Farbvarianten auf Mobile anzeigen
 */
(function(KEK) {
    "use strict";

    function applyColorsVisible(box) {
        // React's inline styles entfernen – CSS übernimmt mit !important
        box.removeAttribute('style');
        KEK.defineClass(box, 'kk-colors-visible');

        const ul = KEK.qs('ul', box);
        if (!ul) return;

        // Bei mehr als 5 Varianten: Scroll-Indikator (Fade) anzeigen
        if (ul.children.length > 5) {
            KEK.defineClass(box, 'kk-scrollable');
        }        
    }

    function processAllBoxes() {
        const boxes = KEK.qsa('[class*="ProductListCard_productListCard__colorsBox"]');
        if (!boxes || boxes.length === 0) return;
        boxes.forEach(applyColorsVisible);
    }

    // Observer-Config (wiederverwendbar für reconnect)
    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] };

    // Initial + MutationObserver auf Grid-Container
    KEK.elem('[class*="plp_plp__grid"]', function(grids) {
        if (!grids) return;
        const grid = grids[0];

        // Initial alle Boxen behandeln
        processAllBoxes();

        // Event-Delegation: Ein Handler für alle colorsBox-Klicks
        grid.addEventListener('click', function(e) {
            const link = e.target.closest('[class*="ProductListCard_productListCard__colorsBox"] a');
            if (!link) return;
            
            // Navigation verhindern
            e.preventDefault();
            
            // Hover-Event triggern (Hessnatur wechselt Produktbild bei mouseover)
            link.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        });

        // Observer für SPA-Rerenders mit Disconnect-Pattern (verhindert Loops)
        const observer = new MutationObserver(function() {
            observer.disconnect();
            processAllBoxes();
            observer.observe(grid, observerConfig);
        });
        observer.observe(grid, observerConfig);

    });

})(new window.KEK());
