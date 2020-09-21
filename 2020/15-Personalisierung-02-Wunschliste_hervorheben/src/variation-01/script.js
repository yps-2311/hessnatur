// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    console.log("hallo welt 123");

    WATO.elem('.gridviewProductItemWrapper', function(gridviewProductItemWrapper){

        if(gridviewProductItemWrapper){

            console.log(">>> kk: found " + gridviewProductItemWrapper.length + " products");

            for(var i = 0; i < gridviewProductItemWrapper.length; i++){

                var kkWishlistButton = document.createElement("button");

                kkWishlistButton.classList.add('kk-wishlist');
                kkWishlistButton.type = "button";

                // save product id
                kkWishlistButton.dataset.id = WATO.qs('.dropdown-pane', gridviewProductItemWrapper[i]).getAttribute('id');
                
                kkWishlistButton.addEventListener('click', function(){

                    var productId = this.dataset.id;

                    fetch('https://www.hessnatur.com/de/wishlist/add', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: 'productCodePost=' + productId + '&qty=1&CSRFToken=' + window.ACC.config.CSRFToken
                    }).then(function() {

                        console.log(">>> kk: product " + productId + " added");
                    }).catch(function(error) {

                        console.log(">>> KK: error", error.toString());
                    });
                });

                WATO.qs('.whishList', gridviewProductItemWrapper[i]).insertAdjacentElement('afterend',
                    kkWishlistButton
                );
            }
        }
    });

    WATO.elem('.off-canvas-wrapper-inner', function(offCanvasWrapperInner){

        if(offCanvasWrapperInner){

            offCanvasWrapperInner[0].insertAdjacentHTML('beforeend',
                '<div id="kk-wishlist-overlay" class="reveal-overlay">' + 
                    '<div class="reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" tabindex="-1">'+
                    // '<div class="reveal">' +
                        '<div class="row">' +
                            '<div class="">asdasds</div>' +
                            '<button class="close-button" data-close="" aria-label="Close reveal" type="button">' +
                                '<span aria-hidden="true">×</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }
    });

    // $("#addedtocartrecommendationpopup").foundation().foundation("open")

    /**
     * CSS Prefix 
     *
    document.documentElement.classList.add('specific-experiment-class');
    */

    /**
     * POLLING
     *
    WATO.elem(".btn-default", function(btnDefault) {

        if(btnDefault) {

        }
    });

    WATO.elem(
        function(){return window.numTest === 123;}, 
        function(funcCallback) {

            if(funcCallback){

            }
        });
    */

    /**
     * DOM READY
     *
    WATO.ready(function() {

    });
    */
})(new window.WATO());
