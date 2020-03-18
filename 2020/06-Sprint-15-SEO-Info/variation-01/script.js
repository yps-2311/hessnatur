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
        }, 250);
        WATO.qs('#kk_seoClose').classList.remove('kk_show');
    }

    WATO.elem('.footerSmoBoxWrapper .rteContainer', function (seoText) {
        console.log('has seo text');
        WATO.elem('.toggleFilterButton', function (filterToggle) {
            if (filterToggle) {
                filterToggle[0].insertAdjacentHTML('beforebegin',
                    '<div id="kk_toggleSEO">Mehr erfahren</div>'
                );

                filterToggle[0].previousElementSibling.addEventListener('click', function () {
                    WATO.qs('#offCanvasMiniCartToggle').click();
                    document.documentElement.classList.add('kk_showSEO');

                    // window.setTimeout(function () {

                    WATO.qs('#kk_seoClose').classList.add('kk_show');
                    // }, 250);

                    WATO.elem('.js-off-canvas-overlay.is-visible', function (overlay) {
                        if (overlay) {
                            overlay[0].addEventListener('click', hideSEO);
                        }
                    });

                });
                document.body.insertAdjacentHTML('afterbegin',
                    '<div id="kk_seoClose">×</div>'
                );
                WATO.qs('#kk_seoClose').addEventListener('click', function () {
                    WATO.qs('#offCanvasMiniCartWrapper .close-button').click();
                    hideSEO();
                });

            }
        });


        WATO.elem('#offCanvasRight', function (canvasContent) {
            if (canvasContent) {
                canvasContent[0].insertAdjacentHTML('beforeend',
                    // '<div class="off-canvas position-right is-transition-push" id="kk_offCanvasRight">' +
                    '<div id="kk_offCanvasSEO" class="offCanvasTarget">' + seoText[0].outerHTML + '</div>'
                    // '</div>'
                );
            }
        });
    });



})(new window.WATO());
