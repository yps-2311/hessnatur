// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";
    
    /**
     * CSS Prefix 
     *
    document.documentElement.classList.add('specific-experiment-class');
    */


    WATO.elem('#js-foundation-sticky-left-navigation-data-anchor', function(prodContainer){

        if(prodContainer){

            // create kk root container
            prodContainer[0].parentNode.insertAdjacentHTML('afterend', 
                '<div id="kk-seo" class="row">' +
                    '<div class="columns small-12 large-9 large-offset-3"></div>' +
                '</div>'
            );

            // get current SEO text
            WATO.elem('.footerSmoBoxWrapper .rteContainer', function(seoWrapper){

                if(seoWrapper){

                    var newHTML = '';

                    // we need to wrap the text into seperate parts and add wrapper for product images
                    seoWrapper[0].innerHTML.split('<h2>').forEach(function(container, index) {
                        
                        if(index === 1){
                            newHTML += '<div class="column small-6 kk-seo-img"><div class="kk-seo-left"></div></div>';
                        }

                        newHTML += '<div class="column small-6">';

                        if(index !== 0) {
                            newHTML += '<h2>';
                        }
                        
                        newHTML += container; 
                        newHTML += '</div>';

                        if(index === 0 || index === 2){
                            newHTML += '<div class="column small-6 kk-seo-img"><div class="kk-seo-right"></div></div>';
                        }
                    });
                    
                    console.log(newHTML);

                    WATO.qs('#kk-seo .columns').innerHTML = '<div class="row">' + newHTML + '</div>';

                    // get the first 3 product images
                    WATO.elem('.productPrgWrapper img.productImage-1', function(prodImages){

                        if(prodImages){

                            var kkSEOImages = WATO.qsa('.kk-seo-img');

                            prodImages.forEach(function(img, index){

                                if(index >= 3)return false;

                                console.log("img", img);

                                if(kkSEOImages[index]){

                                    kkSEOImages[index].children[0].style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
                                }
                            });
                        }
                    });
                }
            });
        }
    });
})(new window.WATO());
