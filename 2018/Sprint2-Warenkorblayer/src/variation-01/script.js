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

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }
    function addClass(el,className){
		el.classList.add(className);
    }
    function removeClass(el,className){
		el.classList.remove(className);
    }

    function miniBasketClose(){
        // Minibasket nicht anzeigen
        WATO.elem('#miniCartDropdown', function(pMiniCartDropdown){
            if(pMiniCartDropdown){
                removeClass(pMiniCartDropdown[0], "wa_anzeigen");

                setTimeout(function(){
                    addClass(pMiniCartDropdown[0], "wa_anzeigen");
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

    // function neuenTabOeffnen(url){
    //     window.open(url, '_blank');
    // }

    // DOM-Element entfernen
    function removeItem(itemClass){
        var pItem = WATO.qs(itemClass);
        if(pItem){
            pItem.parentNode.removeChild(pItem);
        }
    }
    
    function setGeklickteProdute(produktID){ //callback

        var localSt = window.localStorage.getItem('wa_geklickteProdukte');
        if(localSt){
            // Update
            var alteEintraege = localSt.split(",");

            if(!alteEintraege.includes(produktID)){
                alteEintraege.push(produktID);
                window.localStorage.setItem('wa_geklickteProdukte', alteEintraege);
            }
            
        }else{
            // neu anlegen
            window.localStorage.setItem('wa_geklickteProdukte', [produktID]);
        }
        // callback();
    }

    function floatToPrice(floatzahl){
        return String((floatzahl).toFixed(2)).replace(".",",").toLocaleString('de-DE');
    }


    function layerEinbauen(){

        miniBasketClose();

        WATO.elem('body', function(pbody){
            if(pbody){

                try {

                    // Wenn schon ein Layer vorhanden ist wird dieser gelöscht
                    removeItem(".wa_overlay");
                    
                    pbody = pbody[0];
                    
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
                                var nProduktID = sProduktID.substr(0, 5);
                                sTheLook += '<div class="carousel-cell" data-prid="'+nProduktID+'">'+aCompleteTheLook[i].innerHTML+"</div>";
                            }
                        }

                        // GOAL WKLayer Complete the Look vorhanden
                        goalPush('wkLayerCTL');

                    }else{
                        // Wenn es KEIN "Complete the Look" gibt, wird Crossselling genutzt

                        sHeadline = "Andere Kunden kauften auch:";

                        var pCrossselling = WATO.qsa(".flickity-productslider .productitem", pbody);

                        for (var j = 0; j < pCrossselling.length; j++) {

                            var sProduktID = pCrossselling[j].getAttribute("data-productid"),
                                nProduktID = sProduktID.substr(0, 5);

                            sTheLook += '<div class="carousel-cell" data-prid="'+nProduktID+'">'+pCrossselling[j].innerHTML+"</div>";
                        }
                    }

                    // GOAL
                    var localSt = window.localStorage.getItem('wa_geklickteProdukte');
                    if(localSt){
                        var alteEintraege = localSt.split(","),
                            produktID = WATO.qs('input[name="ff_id"]', pbody).value;

                        for (var k = 0; k < alteEintraege.length; k++) {
                            var sImLayerGeklicktesProdukt = alteEintraege[k];
                            // Wenn die ProduktID im Array der geklickten Produkte vorkommt
                            if(sImLayerGeklicktesProdukt.indexOf(produktID) !== -1){
                                // Differenzierung zwischen Crossselling Produkt und Complete the Look-Produkt
                                if(sImLayerGeklicktesProdukt.indexOf("cs") !== -1){
                                    // CS-Produkt addToCart
                                    goalPush('csProduktAddToCart');
                                }else{
                                    // CtL-Produkt addToCart
                                    goalPush('clProduktAddToCart');
                                }
                            }
                        }
                    }

                    pbody.insertAdjacentHTML("beforeend", 
                        '<div class="reveal-overlay wa_overlay">'+
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
                            '</div>'+
                        '</div>');

                    var pNeueProdukte = WATO.qsa(".carousel-cell a", pbody);

                    for (var l = 0; l < pNeueProdukte.length; l++) {

                        pNeueProdukte[l].setAttribute("target","_blank");

                        pNeueProdukte[l].addEventListener("click", function(event) {
                            // event.preventDefault();

                            if(isCompleteTheLookVorhanden){
                                // GOAL WKLayer Complete the Look Produkt klick
                                goalPush('wkLayerCTLklick');
                            }else{
                                // GOAL WKLayer Crossselling Produkt klick
                                goalPush('wkLayerCSklick');
                            }

                            var pParentLink = event.target.closest(".carousel-cell"),
                                sKuerzel = isCompleteTheLookVorhanden ? "cl" : "cs"; // cs steht für Crossselling und cl für Complete the Look
                                // sUrlZumProdukt = WATO.qs("a", pParentLink).getAttribute("href");

                            if(pParentLink){

                                setGeklickteProdute(pParentLink.getAttribute("data-prid") + sKuerzel);
                                // , function(){
                                //     // Danach wird der User zum Produkt weitergeleitet
                                //     // neuenTabOeffnen(sUrlZumProdukt);
                                // });
                            }
                            // else{
                                // direkt weiterleiten
                                // window.location.href = WATO.qs("a", pParentLink).getAttribute("href");
                                // neuenTabOeffnen(sUrlZumProdukt);
                            // }
    
                            // return false;
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
                            aParent.contains("wa_weiter"))
                        {
                            pOverlay.style.display = "none";
                        }
                    });

                    // Galerie initialisieren
                    isJqueryReady(function(){
                        jQuery('.main-carousel').flickity({
                            // groupCells: true,
                            initialIndex: 0,
                            cellAlign: 'left',
                            contain: true,
                            imagesLoaded: !0,
                            dragThreshold: "10",
                            selectedAttraction: "0.08",
                            friction: "0.6",
                            pageDots: false,
                            groupCells: !0
                        });
                    });

                } catch (error) {
                    goalPush('error_sprint2');
                    // console.log(error);
                }

            }
        });
    }
    
    try {
        layerEinbauen();
        
    } catch (error) {
        goalPush('error_sprint2');
        // console.log(error);
    }

})(new window.WATO(), window);


/*
var script = document.createElement("script");
    script.src = "https://dev.web-arts.de/hessnatur/2018/Sprint2-Warenkorblayer/src/variation-01/script.min.js";
    document.head.appendChild(script);
    */