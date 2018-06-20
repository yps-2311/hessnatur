// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";


    // WATO.elem('body', function(element){
    //     if(element){
    //         element[0].insertAdjacentHTML("afterbegin", '<img style="position:absolute; z-index: 10000; top: 8px; left: -6px; opacity: 0.5;" src="https://dev.web-arts.de/hessnatur/2018/Sprint2-Warenkorblayer/img/2018-06-11-sprint-3-2.png" >');
    //     }
    // });

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }
    
    function addClass(el,className){
		// if (el.classList){
			el.classList.add(className);
		// }else if(el.className){
			// el.className += ' ' + className;
		// }
    }
    function removeClass(el,className){
		// if (el && el.classList){
			el.classList.remove(className);
		// }else if(el && el.className){
			// el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');		
		// }
    }
    // function kickout(breite){
	// 	if(window.innerWidth < breite){
    //         addClass(window.document.body, "wa_punchout");
	// 	}else{
    //         removeClass(window.document.body, "wa_punchout");
    //     }
    // }

    function miniBasketClose(){
        // Minibasket nicht anzeigen
        WATO.elem('#miniCartDropdown', function(pMiniCartDropdown){
            if(pMiniCartDropdown){
                addClass(pMiniCartDropdown[0], "wa_nichtanzeigen");

                setTimeout(function(){
                    removeClass(pMiniCartDropdown[0], "wa_nichtanzeigen");
                }, 6000);
            }
        });
    }

    function isJqueryReady(auszufuehrendeFunction){
		var isJquery = typeof jQuery;
		if(isJquery !== "undefined"){
			auszufuehrendeFunction();
			return isJquery;
		}else{
			var interv = setInterval(function(){
				if(isJquery !== "undefined"){
					clearInterval(interv);
					auszufuehrendeFunction();
					return isJquery;
				}
			}, 200);
		}
    }

    function neuenTabOeffnen(url){
        window.open(url, '_blank');
    }

    // DOM-Element entfernen
    function removeItem(itemClass){
        var pItem = WATO.qs(itemClass);
        if(pItem){
            pItem.parentNode.removeChild(pItem);
        }
    }
    
    function setGeklickteProdute(produktID, callback){
        console.log('produktID: ', produktID);

        var localSt = window.localStorage.getItem('wa_geklickteProdukte');
        if(localSt){
            // Update
            var alteEintraege = localSt.split(",");
            // console.log('alteEintraege: ', alteEintraege);

            // console.log('alteEintraege.contains(produktID): ', alteEintraege.includes(produktID));
            if(!alteEintraege.includes(produktID)){
                alteEintraege.push(produktID);
                window.localStorage.setItem('wa_geklickteProdukte', alteEintraege);
            }
            // console.log('window.localStorage.setItem(wa_geklickteProdukte, alteEintraege);: ', window.localStorage.getItem('wa_geklickteProdukte'));
            
        }else{
            // neu anlegen

            // console.log("neu");
            window.localStorage.setItem('wa_geklickteProdukte', [produktID]);
        }

        callback();
    }

    function floatToPrice(floatzahl){
        return String((floatzahl).toFixed(2)).replace(".",",").toLocaleString('de-DE');
    }


    function layerEinbauen(){

        console.log("layerEinbauen");

        miniBasketClose();

        WATO.elem('body', function(pbody){
            if(pbody){

                try {

                    // Wenn schon ein Layer vorhanden ist wird dieser gelöscht
                    removeItem(".wa_overlay");
                    
                    pbody = pbody[0];
                    // console.log('pbody: ', pbody);
                    
                    var pBild = WATO.qs("#zoom img", pbody),
                        pHeadline = WATO.qs("h1.pds-cockpit__productName", pbody),
                        pFarbe = WATO.qs(".show-for-large.js-color-name", pbody),
                        pGroesse = WATO.qs("#desc__size", pbody),
                        iMenge = parseInt(WATO.qs("#qty", pbody).value),
                        pEinzelpreis = WATO.qs('input[name="ff_price"]', pbody),
                        sTheLook = "",
                        sHeadline = "",
                        aCompleteTheLook = WATO.qsa(".pds-completeTheLookWrapper .productitem", pbody),
                        sEndpreis = "€ "+ floatToPrice(parseFloat(pEinzelpreis.value) * iMenge),
                        isCompleteTheLookVorhanden = aCompleteTheLook.length !== 0,
                        pStreichpreis = WATO.qsa(".js-price-container .strikeValue span", pbody);
                    
                    // wenn Streichpreis Anpassung des Preises
                    if(pStreichpreis.length > 0){
                        var floatStreichpreis = parseFloat(pStreichpreis[0].textContent.replace(",",".").replace("€",""));                        
                        sEndpreis = '<span class="price full">€ '+floatToPrice((parseFloat(floatStreichpreis) * iMenge))+' </span> '+
                                    '<span class="price special">'+sEndpreis+'</span>';
                    }

                    // Größe als Text der Auswahl übergeben nicht nur das Value des Dropdowns
                    pGroesse = WATO.qs('#desc__size option[value="'+pGroesse.value+'"]', pbody);
                    

                    if(isCompleteTheLookVorhanden){
                        // Wenn es "Complete the Look" gibt

                        sHeadline = "Zum kompletten Outfit";

                        for (var i = 0; i < aCompleteTheLook.length; i++) {

                            var sProduktID = aCompleteTheLook[i].getAttribute("data-productid");

                            if(sProduktID.length > 0){
                                sTheLook += '<div class="carousel-cell" data-prid="'+sProduktID.substr(0, 5)+'">'+aCompleteTheLook[i].innerHTML+"</div>";
                            }
                        }

                        // GOAL WKLayer Complete the Look vorhanden
                        goalPush('wkLayerCTL');

                    }else{
                        // Wenn es KEIN "Complete the Look" gibt, wird Crossselling genutzt

                        sHeadline = "Andere Kunden kauften auch:";

                        var pCrossselling = WATO.qsa(".flickity-productslider .productitem", pbody);

                        for (var j = 0; j < pCrossselling.length; j++) {

                            var sProduktID = pCrossselling[j].getAttribute("data-productid");

                            sTheLook += '<div class="carousel-cell" data-prid="'+sProduktID.substr(0, 5)+'">'+pCrossselling[j].innerHTML+"</div>";
                        }
                    }

                    // GOAL
                    var localSt = window.localStorage.getItem('wa_geklickteProdukte');
                    if(localSt){
                        var alteEintraege = localSt.split(","),
                            produktID = WATO.qs('input[name="ff_id"]', pbody).value;
                            // console.log('produktID: ', produktID);
                            // console.log('alteEintraege: ', alteEintraege);
                        
                            // produktID.substr(0,5)
                            // console.log('produktID.substr(0,5): ', produktID.substr(0,5));
                            // produktID.substr(6,7)
                            // console.log(' produktID.substr(6,7): ',  produktID.substr(6,7));

                        for (var k = 0; k < alteEintraege.length; k++) {
                            if(alteEintraege[k].indexOf(produktID) !== -1){ //.includes(produktID.substr(0,5))
                                // console.log("csProduktAddToCart");
                                // CS-Produkt addToCart
                                goalPush('csProduktAddToCart');
                            }else{
                                // console.log("clProduktAddToCart");
                                // CtL-Produkt addToCart
                                goalPush('clProduktAddToCart');
                            }
                        }
                    }

                    pbody.insertAdjacentHTML("beforeend", 
                        '<div class="reveal-overlay wa_overlay" style="display: block;">'+
                            '<div class="reveal" data-reveal="8pd3zy-reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" tabindex="-1">'+
                                
                                '<div class="wa_wrapper">'+
                                    '<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
                                        '<span aria-hidden="true">×</span>'+
                                    '</button>'+
                                    '<div class="row wa_content">'+
                                        '<div class="column small-3">'+
                                            '<div class="h3">Gute Wahl!</div>'+
                                            '<p>Der Artikel liegt in Ihrem Warenkorb.</p>'+
                                            '<img src="'+pBild.getAttribute("src")+'">'+
                                            '<div class="wa_produkttitle">'+pHeadline.textContent+'</div>'+
                                            '<div class="wa_attr"><b>FARBE:</b> '+pFarbe.textContent+'</div>'+
                                            '<div class="wa_attr"><b>GRÖßE:</b> '+pGroesse.textContent+'</div>'+
                                            '<div class="wa_attr"><b>MENGE:</b> '+iMenge+'</div>'+
                                            '<div class="wa_price item__desc">'+sEndpreis+'</div>'+
                                        '</div>'+
                                        '<div class="column small-9">'+
                                            '<div class="wa_headline">'+sHeadline+'</div>'+
                                            '<div class="main-carousel">'+
                                                sTheLook+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row wa_footer">'+
                                        '<div class="column small-4">'+
                                            '<button href="/de/cart" class="wa_weiter button expanded pds-cockpit__addToCartButton js-add-to-cart-button">'+
                                                '<span>Weiter einkaufen</span>'+
                                            '</button>'+
                                        '</div>'+
                                        '<div class="column small-4">'+
                                        '</div>'+
                                        '<div class="column small-4">'+
                                            '<a href="/de/cart" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button">'+
                                                '<span>Zum Warenkorb</span>'+
                                            '</a>'+
                                        '</div>'+
                                    
                                    '</div>'+
                                '</div>'+
                            
                                // '<div class="callout white">'+
                                //     '<div class="rteContainer">'+
                                //         '<h2>Versandinformationen</h2>'+
                                //         '<p>Wir liefern bestellte Ware nur innerhalb der Europäischen Union (EU), mit Ausnahme der Bundesrepublik Österreich, aus.</p>'+
                                //         '<div class="row">'+
                                //             '<ul class="small-6 columns pricing-list"><li>Deutschland<strong>€ 5,95</strong></li><li>Luxemburg<strong>€ 7,95</strong></li>'+
                                //                 '<li>Belgien<strong>€ 9,95</strong></li><li>Dänemark<strong>€ 9,95</strong></li><li>Frankreich<strong>€ 9,95</strong></li>'+
                                //             '</ul>'+
                                //         '</div>'+
                                //         '<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
                                //             '<span aria-hidden="true">×</span>'+
                                //         '</button>'+
                                //     '</div>'+
                                // '</div>'+
                            '</div>'+
                        '</div>');

                    // function closest(el, predicate) {
                    //     return predicate(el) ? el : (
                    //         el && closest(el.parentNode, predicate)
                    //     );
                    // }

                    var pNeueProdukte = WATO.qsa(".carousel-cell a", pbody);

                    for (var l = 0; l < pNeueProdukte.length; l++) {
                        pNeueProdukte[l].addEventListener("click", function(event) {
                            event.preventDefault();

                            if(isCompleteTheLookVorhanden){
                                // GOAL WKLayer Complete the Look Produkt klick
                                goalPush('wkLayerCTLklick');
                            }else{
                                // GOAL WKLayer Crossselling Produkt klick
                                goalPush('wkLayerCSklick');
                            }

                            // console.log('event.target: ', event.target);

                            var pParentLink = event.target.closest(".carousel-cell"),
                                sKuerzel = isCompleteTheLookVorhanden ? "cl" : "cs", // cs steht für Crossselling und cl für Complete the Look
                                sUrlZumProdukt = WATO.qs("a", pParentLink).getAttribute("href");

                            // console.log('pParentLink: ', pParentLink);

                            if(pParentLink){

                                setGeklickteProdute(pParentLink.getAttribute("data-prid") + sKuerzel , function(){
                                    // Danach wird der User zum Produkt weitergeleitet
                                    neuenTabOeffnen(sUrlZumProdukt);
                                });

                            }else{
                                // direkt weiterleiten
                                // window.location.href = WATO.qs("a", pParentLink).getAttribute("href");
                                neuenTabOeffnen(sUrlZumProdukt);
                            }
    
                            return false;
                        });
                    }
                    
                    

                    var pOverlay = WATO.qs(".wa_overlay", pbody);

                    // Layer schließen
                    pOverlay.addEventListener("click", function(event) {
                        var aKlickElementKlassen = event.target.classList,
                            aParent = event.target.parentNode.classList;

                        if(aKlickElementKlassen.contains("wa_overlay") || 
                            aKlickElementKlassen.contains("close-button") || 
                            aParent.contains("close-button") || 
                            aKlickElementKlassen.contains("wa_weiter") || 
                            aParent.contains("wa_weiter")){
                            pOverlay.style.display = "none";
                        }
                    });

                    // Galerie initialisieren
                    isJqueryReady(function(){
                        jQuery('.main-carousel').flickity({
                            // options
                            // groupCells: true,
                            initialIndex: 0,
                            cellAlign: 'left',
                            contain: true,
                            imagesLoaded: !0,
                            dragThreshold: "10",
                            selectedAttraction: "0.08",
                            friction: "0.6",
                            // arrowShape: "M43 7 51 15 21 45 100 45 100 56 21 56 51 86 43 94 0 50.5z",
                            pageDots: false,
                            groupCells: !0
                        });
                    });

                } catch (error) {
                    goalPush('error_sprint2');
                    console.log(error);
                }

                // WKLayer Complete the Look vorhanden
                // WKLayer Complete the Look Produkt klick
                // WKLayer Crossselling Produkt klick
                // CTL-Produkt addToCart
                // CS-Produkt addToCart

            }
        });
    }
    
    try {

        window.addEventListener("resize", function(){
            // kickout(1024);
        }, false);
        // kickout(1024);


        // Minibasket nicht anzeigen
        // WATO.elem('#miniCartDropdown', function(pMiniCartDropdown){
        //     if(pMiniCartDropdown){
        //         addClass(pMiniCartDropdown, "wa_nichtanzeigen");

                // Infolayer schließen 
                // WATO.qs(".wa_close", $warumInfobox).addEventListener("click", function(){
                //     addClass($wa_klappbar ,"wa_einkl");
                //     window.localStorage.setItem("wa_info", "geschlossen");

                //     WATO.goalPush("klick_closeLayer");
                // });

                // lieferzeitZeileEinbauen(false, $wa_klappbar, $headlineZeit, $mengeWrapper[0]);

                // $lieferzeitBox.addEventListener('DOMSubtreeModified', function(e) {
                //     lieferzeitZeileEinbauen(e, $wa_klappbar, $headlineZeit, $mengeWrapper[0]);
                // });
        //     }
        // });

        // setTimeout(function(){
        //     layerEinbauen();
        // }, 2000);

        // layerEinbauen();

        
        // WATO.elem('#addToCartButton', function(pAddToCartButton){
        //     if(pAddToCartButton){
        //         console.log('pAddToCartButton: ', pAddToCartButton);

        //         pAddToCartButton[0].addEventListener("click",function(){
        //             console.log("click");
        //             layerEinbauen();
        //         });
        //     }
        // });


        // if(!localStorage.getItem('wa_inSprint2')){
        //     localStorage.setItem('wa_inSprint2', 'true');
        // layerEinbauen();
        // }

        layerEinbauen();

        // WATO.ajax('https://www.hessnatur.com/de/cart/add', function(){
        // console.log("ajax");
        //     // miniBasketClose();
        //     layerEinbauen();
        // });


        // WATO.globalGoals(1);
        
    } catch (error) {
        goalPush('error_sprint2');
        console.log(error);
    }

    
})(new window.WATO(), window);


// console.log("test Sprint 1 t");

// if(localStorage.getItem('test') === "true"){

// try{

// var script = document.createElement("script");
// script.src = "https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/src/variation-01/script.min.js";
// document.head.appendChild(script);

// } catch (error) {
//         console.log(error);
// }

// }else{
// }