// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (Element.prototype.matches.call(el, s)) {
                    return el;
                }
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    function getLS(key) {
        var ls = window.localStorage.getItem(key);
        if(ls){
            return ls.split(",");
        }else{
            return [];
        }
    }
    function setLS(key, body) {
        window.localStorage.setItem(key, body);
    }

    var gutscheincode = "Versandkostenfrei",
        isModalClosed = getLS("kk_modalClosed").length > 0,
        productsOnWishlist = [],
        pageIsCart = window.location.pathname.indexOf("cart") !== -1;

    function markModalAsClosed() {
        setLS("kk_modalClosed", true);
        isModalClosed = true;
    }
    function addClass(elem, thisclassname) {
        if(elem){
            elem.classList.add(thisclassname);
        }
    }
    function removeClass(elem, thisclassname) {
        if(elem){
            elem.classList.remove(thisclassname);
        }
    }

    function fetchSend(urlPath, sendParameter) {
        fetch('https://www.hessnatur.com/de/'+urlPath, {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: sendParameter + '&CSRFToken=' + window.ACC.config.CSRFToken
        }).then(function() {
            console.log(">>> kk: product " + productId);
        }).catch(function(error) {
            console.log(">>> KK: error", error.toString());
        });
    }

    function addToWishlist(productId) {
        fetchSend("wishlist/add", 'productCodePost=' + productId + '&qty=1');
    }


    // Wenn auf der Warenkorbseite der Optin gewählt wurde kommt hier kein Umbau mehr, auf der Produktliste jedoch weiterhin
    if(pageIsCart ? getLS("kk_cartmodalClosed").length === 0 : true){

        // Sobald der Minidropdown mit den Produkten auf der Wunschliste geladen ist kann eine Liste erstellt werden, 
        // damit die Produkte auf der Produktliste ein volles Herz bekommen
        WATO.elem('#miniWishListDropdown li.flyout-image a', function(miniWishlistProducts){
            if(miniWishlistProducts){
                for (var k = 0; k < miniWishlistProducts.length; k++) {
                    var productID = miniWishlistProducts[k].getAttribute("href").split("/p/")[1].substring(0,7);

                    // Liste befüllen
                    productsOnWishlist.push(productID);
                    
                    // Timing: Falls das folgende Polling schneller ist als dieses sind die Produkte bereits mit neuen Herzen ausgestattet,
                    // in diesem Fall werden die Produkte nachträglich mit vollen Herzen per Klasse ausgestattet
                    addClass(WATO.qs('div[id="'+productID+'"] .kk_wishlist'), 'kk_added');
                }
            }
        });

        // Produktliste und Warenkorb
        WATO.elem('.gridviewProductItemWrapper, .item__form', function(gridviewProductItemWrapper){

            if(gridviewProductItemWrapper){

                console.log(">>> kk: found " + gridviewProductItemWrapper.length + " products");

                // Produkte auf Produktliste und Warenkorb
                for(var i = 0; i < gridviewProductItemWrapper.length; i++){

                    var wishlistOrTrashButton = document.createElement("button"),
                        thisProductID = pageIsCart ? 
                            WATO.qs(".js-update-entry-form", gridviewProductItemWrapper[i]).getAttribute('data-product-json-url').replace("/de/p/","").replace("/json","").substring(0,9) : 
                            WATO.qs('.dropdown-pane', gridviewProductItemWrapper[i]).getAttribute('id').substring(0,9);

                    // Je nach Seitentyp bekommt der neue Button eine andere Klasse
                    addClass(wishlistOrTrashButton, (pageIsCart ? 'kk_remove' : 'kk_wishlist'));

                    // Der erste bekommt eine Sonderklasse für die Nudge
                    if(i === 0 && !pageIsCart){
                        addClass(wishlistOrTrashButton, 'kk_first');
                    }
                    
                    wishlistOrTrashButton.type = "button";
                    wishlistOrTrashButton.dataset.id = thisProductID;
                    
                    // Alle Herzen werden befüllt die bereits auf der Wunschliste Liegen (Timing)
                    if(productsOnWishlist.length > 0 && productsOnWishlist.indexOf(thisProductID) !== -1){
                        addClass(wishlistOrTrashButton, 'kk_added');
                    }

                    // Interaktion
                    wishlistOrTrashButton.addEventListener('click', function(){

                        var productId = this.dataset.id;

                        if(!pageIsCart){
                            // Produktliste
                            var thisNudge = WATO.qs(".kk_nudge")
                            if(thisNudge){
                                thisNudge.parentNode.removeChild(thisNudge);
                            }

                            // Herz voll ausgefüllt
                            addClass(this, 'kk_added');
                            addToWishlist(productId);
                        }else{
                            // Warenkorb
                            fetchSend("cart/update", 'entryNumber='+this.closest(".js-update-entry-form").getAttribute('id').substring(14,16)+'&variantCode=' + productId + '&quantity=0');
                        }

                        var productTop = WATO.qs('div[id="'+productId+'"], .js-update-entry-form[data-product-json-url*="'+productId+'"]').parentNode,
                            productWrapper = pageIsCart ? productTop : productTop.closest(".gridviewProductItemWrapper"),
                            modaloverlay = WATO.qs("#kk_wishlist_overlay");

                        // Links im Modal sind 
                        WATO.qs("#kk_prodinfo").innerHTML = 
                            '<img src="'+WATO.qs(".productImage-1, .small-4 a img", productTop).getAttribute('src').replace("hyb_redes_cart_overview","hyb_redes_list_main")+'">'+
                            '<div id="kk_title">'+WATO.qs(".js-prgLink a, .cart__productname", productWrapper).innerHTML+'</div>'+
                            '<div id="kk_price">'+WATO.qs(".productPrgWrapper > span.h-text-decoration-none, .price", productWrapper).innerHTML+'</div>';

                        modaloverlay.dataset.id = productId;
                        
                        // Open Modal
                        if(!isModalClosed){
                            // Modal öffnen
                            addClass(modaloverlay, 'kk_open');
                            // Modal als gesehen markiert
                            markModalAsClosed();
                        }else{
                            // Wenn Modal noch nicht gesehen und geschlossen wurde
                            if(pageIsCart) {
                                // Warenkorb
                                addClass(modaloverlay, 'kk_open');
                                addClass(modaloverlay, 'kk_showbuttons');
                            }else{
                                // Produktliste

                                // Swipe up infobox
                                    productTop.insertAdjacentHTML('beforeend', 
                                    '<div class="kk_swipeinfo">'+
                                        '<div class="kk_checkbox">Der Artikel wurde auf Ihrer Wunschliste gespeichert</div>'+
                                        '<a class="kk_gotowish" href="/merkzettel">Zur Wunschliste</a>'+
                                    '</div>'
                                );
                            }
                        }
                    });
                
                    // Der Originalbutton ist auf der Produktliste das herz und auf der Warenkorbseite der Mülleimer
                    var originalButton = WATO.qs('.whishList, .js-entry-remove', gridviewProductItemWrapper[i]);

                    originalButton.insertAdjacentElement('beforebegin', wishlistOrTrashButton);

                    // Nur auf der Produktliste, nur beim ersten Produkt und nur wenn das Modal noch nicht schoneinmal geschlossen wurde
                    if(!pageIsCart && i === 0 && !isModalClosed){
                        // Nudge
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
    }

    // Modal wird auch ohne Interaktion schon in die Seite eingebaut
    WATO.elem('.off-canvas-wrapper-inner', function(offCanvasWrapperInner){
    
        if(offCanvasWrapperInner){
            offCanvasWrapperInner = offCanvasWrapperInner[0];

            offCanvasWrapperInner.insertAdjacentHTML('beforeend',
                '<div id="kk_wishlist_overlay" class="reveal-overlay">' + 
                    '<div class="reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" tabindex="-1">'+
                        '<div class="row kk_wishlist_modal">' +
                            '<div class="columns large-4 kk_info">'+
                                (pageIsCart ? '<div class="kk_trash">Der Artikel wurde aus Ihrem Warenkorb gelöscht!</div>' : '<div class="kk_checkbox">Der Artikel wurde auf Ihrer Wunschliste gespeichert</div>')+
                                '<div id="kk_prodinfo"></div>'+
                            '</div>' +
                            '<div class="columns large-8 kk_selectors">'+
                                '<h4>Wunschliste beobachten</h4>'+
                                '<div class="kk_infoi">Sie erhalten auf Wunsch <b>nützliche Infos zu<br>Artikeln</b> auf Ihrem Merkzettel</div>'+
                                '<div id="kk_menge" class="kk_whitebox"><div class="kk_check kk_selected"></div><h5>Geringe Stückzahl</h5><small>Sobald ein Artikel in geringer Stückzahl verfügbar ist</small></div>'+
                                '<div id="kk_sale" class="kk_whitebox"><div class="kk_check kk_selected"></div><h5>Sale</h5><small>Sobald der Artikel günstiger wird</small></div>'+
                                '<div id="kk_aktion" class="kk_whitebox"><div class="kk_check kk_selected"></div><h5>Aktion</h5><small>Sobald ein Artikel in einer Aktion gelistet wird (z.B.SSV)</small></div>'+
                            '</div>' +
                            '<div class="columns large-8 kk_onlybuttons">'+
                                '<button class="kk_gotowish">Auf Ihre Wunschliste legen</button>'+
                                '<button class="kk_darkbutton">Zurück zum Warenkorb</button>'+
                                '<div id="kk_skip">Diesen Schritt in Zukunft überspringen</div>' +
                            '</div>' +
                            '<div class="row large-12">'+
                                '<div class="columns large-4">'+
                                    '<a class="kk_gotowish" href="/merkzettel">Zur Wunschliste</a>'+
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
                                '<div class="kk_code"><input readonly id="kk_copytext" type="text" value="'+gutscheincode+'"><button>Code kopieren</button></div>'+
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

            var theModal = WATO.qs("#kk_wishlist_overlay", offCanvasWrapperInner),
                checkboxes = WATO.qsa(".kk_check", theModal),
                closeModal = function(theModal) {
                    removeClass(theModal, 'kk_open');
                    markModalAsClosed();
                    if(pageIsCart){
                        WATO.reload();
                    }
                };
            
            // Schließen-X Button Modal
            WATO.qs(".close-button",theModal).addEventListener('click', function(){
                closeModal(theModal);
            });
            // Modal schließen mit dem Link "Nein Danke, das interessiert micht nicht"
            WATO.qs(".large-8 span",theModal).addEventListener('click', function(){
                closeModal(theModal);
            });
            // Blurry-Background schließt Modal
            theModal.addEventListener('click', function(e){
                e.preventDefault();
                if(e.target.classList.contains('reveal-overlay')) {
                    closeModal(theModal);
                }
            });

            // "Wunschliste Info-Service Nutzen" Button - öffnet die Folgeseite mit dem Gutschein
            WATO.qs(".large-12 .large-8 button",theModal).addEventListener('click', function(e){
                e.preventDefault();

                addClass(WATO.qs(".kk_wishlist_modal", theModal),'kk_hidden');
                removeClass(WATO.qs(".kk_service", theModal), 'kk_hidden');

                if(pageIsCart){
                    // Auf dem Warenkorb fügt erst dieser Link das Produkt zur Wunschliste hinzu
                    addToWishlist(theModal.dataset.id);
                }
            });

            // Der Gutscheincode
            WATO.qs(".kk_code",theModal).addEventListener('click', function(e){
                e.preventDefault();
                try {
                    WATO.qs("#kk_copytext").select();
                    window.document.execCommand('copy');
                } catch (error) {
                    console.log('Error: ', error);
                }
            });

            // Die drei Checkboxen zum an- und abwählen
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].addEventListener('click', function(){
                    var thisCheck = e.target;
                    if(thisCheck.classList.contains('kk_selected')){
                        removeClass(thisCheck, 'kk_selected');
                    }else{
                        addClass(thisCheck, 'kk_selected');
                    }
                });
            }
            
            // Alternativ-Modal auf dem Warenkorb wenn man das vorherige Modal schon einmal gesehen hat
            if(pageIsCart){
                // Zur Wunschliste hinzufügen
                WATO.qs(".kk_onlybuttons .kk_gotowish",theModal).addEventListener('click', function(){
                    addToWishlist(theModal.dataset.id);
                    WATO.reload();
                });
    
                // Seite neu Laden
                WATO.qs(".kk_onlybuttons .kk_darkbutton",theModal).addEventListener('click', WATO.reload);

                // Localstorage schreiben dass dieses Fenster nicht mehr gezeigt werden soll
                WATO.qs("#kk_skip",theModal).addEventListener('click', function(e){
                    var thisCheckbox = e.target;

                    if(thisCheckbox.classList.contains('kk_checked')) {
                        removeClass(thisCheckbox, "kk_checked");
                        window.localStorage.removeItem("kk_cartmodalClosed");
                    }else{
                        addClass(thisCheckbox, "kk_checked");
                        setLS("kk_cartmodalClosed", true);
                    }
                });
            }
        }
    });

})(new window.WATO(), window);




// $('#kk_wishlist_overlay').foundation('reveal', 'open');
// $("#addedtocartrecommendationpopup").foundation().foundation("open")

// function addToWishlist(productId) {
//     fetchSend("wishlist/add", 'productCodePost=' + productId + '&qty=1');

    // fetch('https://www.hessnatur.com/de/wishlist/add', {
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: 'productCodePost=' + productId + '&qty=1&CSRFToken=' + window.ACC.config.CSRFToken
    // }).then(function() {

    //     console.log(">>> kk: product " + productId + " added");
    // }).catch(function(error) {

    //     console.log(">>> KK: error", error.toString());
    // });
// }
// function removeFromCart(productId, entryNumber) {
//     fetchSend("cart/update", 'entryNumber='+entryNumber+'&variantCode=' + productId + '&quantity=0');

//     // fetch('https://www.hessnatur.com/de/cart/update', {
//     //     method: 'post',
//     //     headers: {
//     //         'Content-Type': 'application/x-www-form-urlencoded'
//     //     },
//     //     body: 'entryNumber='+entryNumber+'&variantCode=' + productId + '&quantity=0&CSRFToken=' + window.ACC.config.CSRFToken
//     // }).then(function() {

//     //     console.log(">>> kk: product " + productId + " removed");
//     // }).catch(function(error) {

//     //     console.log(">>> KK: error", error.toString());
//     // });
// }



// ACC.cartWishlist.submitRemoveEntry($(this).closest("form"))
// removeFromCart(productId, this.closest(".js-update-entry-form").getAttribute('id').substring(14,16));