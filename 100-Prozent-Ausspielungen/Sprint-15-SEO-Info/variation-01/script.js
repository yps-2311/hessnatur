// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Nguyet Dang
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";


    function hideSEO() {
        window.setTimeout(function () {

            document.documentElement.classList.remove('kk_showSEO');
        }, 550);
        WATO.qs('#kk_seoClose').classList.remove('kk_show');
    }


    // SEO text wrapper
    // only do stuff if element is given
    WATO.elem('.footerSmoBoxWrapper .rteContainer', function (seoText) {
        if (seoText) {
            WATO.elem('.toggleFilterButton', function (filterToggle) {
                if (filterToggle) {
                    // Add toggle
                    filterToggle[0].insertAdjacentHTML('beforebegin',
                        '<div id="kk_toggleSEO">Mehr erfahren</div>'
                    );

                    // Click listener for toggle
                    filterToggle[0].previousElementSibling.addEventListener('click', function () {
                        // Click on cart symbol to trigger layer
                        WATO.qs('#offCanvasMiniCartToggle').click();

                        // Add class for styling purpose
                        document.documentElement.classList.add('kk_showSEO');

                        // Close btn needs different timing for showing/hiding thus gets a separate class
                        WATO.qs('#kk_seoClose').classList.add('kk_show');

                        // Add click listener to overlay
                        // On click remove the class 
                        WATO.elem('.js-off-canvas-overlay.is-visible', function (overlay) {
                            if (overlay) {
                                overlay[0].addEventListener('click', hideSEO);
                            }
                        });

                    });

                    // Add own close btn
                    document.body.insertAdjacentHTML('afterbegin',
                        '<div id="kk_seoClose">×</div>'
                    );
                    // Add click listener to close btn
                    WATO.qs('#kk_seoClose').addEventListener('click', function () {
                        // Click on control close btn to close layer
                        WATO.qs('#offCanvasMiniCartWrapper .close-button').click();
                        hideSEO();
                    });

                }
            });

            // Add SEO text to exisiting off canvas element (cart layer)
            WATO.elem('#offCanvasRight', function (canvasContent) {
                if (canvasContent) {
                    canvasContent[0].insertAdjacentHTML('beforeend',
                        // '<div class="off-canvas position-right is-transition-push" id="kk_offCanvasRight">' +
                        '<div id="kk_offCanvasSEO" class="offCanvasTarget">' + seoText[0].outerHTML + '</div>'
                        // '</div>'
                    );
                }
            });
        }
    });



})(new window.WATO());
