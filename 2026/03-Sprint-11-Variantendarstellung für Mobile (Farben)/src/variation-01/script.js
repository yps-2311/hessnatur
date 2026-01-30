/**
 * @function
 * @author Manuel Brückmann
 * @namespace V1
 * @name Variation 01
 * @description Sprint 11 - Variantendarstellung für Mobile (Farben) - Farbvarianten auf Mobile anzeigen
 */
(function(KEK) {
    "use strict";

    KEK.elem('[class*="ProductListCard_productListCard__colorsBox"]', function(boxes) {
        if (!boxes) return;
        boxes.forEach(function(box) {
            box.style.setProperty('display', 'block', 'important');
        });
    });

})(new window.KEK());
