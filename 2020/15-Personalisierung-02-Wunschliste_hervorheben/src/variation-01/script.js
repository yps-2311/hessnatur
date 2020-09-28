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


    var gutscheincode = "Versandkostenfrei";

    WATO.elem('.gridviewProductItemWrapper', function(gridviewProductItemWrapper){

        if(gridviewProductItemWrapper){

            console.log(">>> kk: found " + gridviewProductItemWrapper.length + " products");

            for(var i = 0; i < gridviewProductItemWrapper.length; i++){

                var kkWishlistButton = document.createElement("button");

                kkWishlistButton.classList.add('kk_wishlist');
                if(i === 0){
                    kkWishlistButton.classList.add('kk_first');
                }
                
                kkWishlistButton.type = "button";

                // save product id
                kkWishlistButton.dataset.id = WATO.qs('.dropdown-pane', gridviewProductItemWrapper[i]).getAttribute('id');
                
                kkWishlistButton.addEventListener('click', function(){

                    var productId = this.dataset.id,
                        thisNudge = WATO.qs(".kk_nudge");

                    if(thisNudge){
                        thisNudge.parentNode.removeChild(thisNudge);
                    }

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

                    var modaloverlay = WATO.qs("#kk_wishlist_overlay");
                    modaloverlay.classList.add('kk_open');

                    var productWrapper = WATO.qs('div[id="'+productId+'"]').parentNode.parentNode.parentNode.parentNode;
                    WATO.qs("#kk_prodinfo").innerHTML = 
                        '<img src="'+WATO.qs(".productImage-1", productWrapper).getAttribute('src')+'">'+
                        '<div id="kk_title">'+WATO.qs(".js-prgLink a", productWrapper).innerHTML+'</div>'+
                        '<div id="kk_price">'+WATO.qs(".productPrgWrapper > span.h-text-decoration-none", productWrapper).innerHTML+'</div>';
                        
                });

                var originalButton = WATO.qs('.whishList', gridviewProductItemWrapper[i]);

                originalButton.insertAdjacentElement('afterend',
                    kkWishlistButton
                );
                
                if(i === 0){
                    originalButton.insertAdjacentHTML('afterend', 
                        '<div class="kk_nudge">'+
                            '<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
                                '<span aria-hidden="true">×</span>'+
                            '</button>'+
                            '<b>Wunschliste beobachten</b>'+
                            '<p>Sie erfahren wenn der Artikel</p>'+
                            '<ul>'+
                                '<li>in geringer Stückzahl verfügbar</li>'+
                                '<li>im Sale</li>'+
                                '<li>in einer Aktion ist </li>'+
                            '</ul>'+
                        '</div>'
                    );

                    var thisNudge = WATO.qs(".kk_nudge", originalButton.parentNode);

                    WATO.qs(".close-button", thisNudge).addEventListener('click', function(e){
                        e.preventDefault();
                        thisNudge.parentNode.removeChild(thisNudge);
                    });
                }
            }
        }
    });

    function copyStringToClipboard (str) {
        // Temporäres Element erzeugen
        var el = document.createElement('textarea');
        // Den zu kopierenden String dem Element zuweisen
        el.value = str;
        // Element nicht editierbar setzen und aus dem Fenster schieben
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Text innerhalb des Elements auswählen
        el.select();
        // Ausgewählten Text in die Zwischenablage kopieren
        document.execCommand('copy');
        // Temporäres Element löschen
        document.body.removeChild(el);
    }

    WATO.elem('.off-canvas-wrapper-inner', function(offCanvasWrapperInner){

        if(offCanvasWrapperInner){

            offCanvasWrapperInner = offCanvasWrapperInner[0];

            offCanvasWrapperInner.insertAdjacentHTML('beforeend',
                '<div id="kk_wishlist_overlay" class="reveal-overlay">' + 
                    '<div class="reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" tabindex="-1">'+
                        '<div class="row kk_wishlist_modal">' +
                            '<div class="columns large-4 kk_info">'+
                                '<div class="kk_checkbox">Der Artikel wurde auf Ihrer Wunschliste gespeichert</div>'+
                                '<div id="kk_prodinfo"></div>'+
                            '</div>' +
                            '<div class="columns large-8 kk_selectors">'+
                                '<h4>Wunschliste beobachten</h4>'+
                                '<div class="kk_infoi">Sie erhalten auf Wunsch <b>nützliche Infos zu<br>Artikeln</b> auf Ihrem Merkzettel</div>'+
                                '<div id="kk_menge" class="kk_whitebox"><div class="kk_check kk_selected"></div><h5>Geringe Stückzahl</h5><small>Sobald ein Artikel in geringer Stückzahl verfügbar ist</small></div>'+
                                '<div id="kk_sale" class="kk_whitebox"><div class="kk_check kk_selected"></div><h5>Sale</h5><small>Sobald der Artikel günstiger wird</small></div>'+
                                '<div id="kk_aktion" class="kk_whitebox"><div class="kk_check"></div><h5>Aktion</h5><small>Sobald ein Artikel in einer Aktion gelistet wird (z.B.SSV)</small></div>'+
                            '</div>' +
                            '<div class="row large-12">'+
                                '<div class="columns large-4">'+
                                    '<a href="/merkzettel">Zur Wunschliste</a>'+
                                '</div>' +
                                '<div class="columns large-8">'+
                                    '<button>Wunschliste Info-Service Nutzen</button>'+
                                    '<span>Nein Danke, das interessiert micht nicht</span>'+
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row kk_service kk_hidden">' +
                            '<div class="columns large-12">'+
                                '<h4>Danke, dass Sie unseren Wunschliste-Service nutzen wollen.</h4>'+
                                '<div class="kk_orangebox">Der Service befindet sich momentan in Entwicklung und ist noch nicht verfügbar</div>'+
                                '<p>Um Ihnen die Wartezeit zu verkürzen erhalten Sie einen Versandkostenfrei-Gutschein, den Sie für Ihre nächste Bestellung einlösen können.</p>'+
                                '<div class="kk_code">gutscheincode<button>Code kopieren</button></div>'+
                                '<a href="/merkzettel">Zur Wunschliste</a>'+
                                '<small>Einmalig einlösbar für Ihre nächste Bestellung und nur in Verbindung mit Ihrem Aktionscode. Nicht kombinierbar mit anderen Aktionen. Keine Auszahlung möglich. Gültig bis xxx.</small>'+
                            '</div>' +
                        '</div>' +
                        '<button class="close-button" data-close="" aria-label="Close reveal" type="button">' +
                            '<span aria-hidden="true">×</span>' +
                        '</button>' +
                    '</div>' +
                '</div>'
            );

            var theModal = WATO.qs("#kk_wishlist_overlay", offCanvasWrapperInner);

            WATO.qs(".close-button",theModal).addEventListener('click', function(e){
                e.preventDefault();
                theModal.classList.remove('kk_open');
            });
            WATO.qs(".large-8 span",theModal).addEventListener('click', function(e){
                e.preventDefault();
                theModal.classList.remove('kk_open');
            });
            theModal.addEventListener('click', function(e){
                e.preventDefault();
                if(e.target.classList.contains('reveal-overlay')) {
                    theModal.classList.remove('kk_open');
                }
            });

            WATO.qs(".large-12 .large-8 button",theModal).addEventListener('click', function(e){
                e.preventDefault();
                WATO.qs(".kk_wishlist_modal", theModal).classList.add('kk_hidden');
                WATO.qs(".kk_service", theModal).classList.remove('kk_hidden');
            });

            WATO.qs(".kk_code",theModal).addEventListener('click', function(e){
                e.preventDefault();
                copyStringToClipboard(gutscheincode);
            });

            

        }
    });

    // $('#kk_wishlist_overlay').foundation('reveal', 'open');
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
