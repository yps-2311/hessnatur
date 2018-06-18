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

    
    function addClass(el,className){
		if (el.classList){
			el.classList.add(className);
		}else if(el.className){
			el.className += ' ' + className;
		}
    }
    function removeClass(el,className){
		if (el && el.classList){
			el.classList.remove(className);
		}else if(el && el.className){
			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');		
		}
    }
    // function kickout(breite){
	// 	if(window.innerWidth < breite){
    //         addClass(window.document.body, "wa_punchout");
	// 	}else{
    //         removeClass(window.document.body, "wa_punchout");
    //     }
    // }

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

    function layerEinbauen(){

        WATO.elem('body', function(pbody){
            if(pbody){

                try {
                    
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
                        sEndpreis = String(parseFloat(pEinzelpreis.value) * iMenge).replace(".",",");

                    if(aCompleteTheLook.length !== 0){
                        // Wenn es "Complete the Look" gibt

                        sHeadline = "Zum kompletten Outfit";

                        for (var i = 0; i < aCompleteTheLook.length; i++) {
                            sTheLook += '<div class="carousel-cell">'+aCompleteTheLook[i].innerHTML+"</div>";
                        }
                    }else{
                        // Wenn es KEIN "Complete the Look" gibt, wird Crossselling genutzt

                        sHeadline = "Andere Kunden kauften auch:";

                        var pCrossselling = WATO.qsa(".flickity-productslider .productitem", pbody);
                        for (var j = 0; j < pCrossselling.length; j++) {
                            sTheLook += '<div class="carousel-cell">'+pCrossselling[j].innerHTML+"</div>";
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
                                            '<div class="wa_attr"><b>GRÖßE:</b> '+pGroesse.value+'</div>'+
                                            '<div class="wa_attr"><b>MENGE:</b> '+iMenge+'</div>'+
                                            '<div class="wa_price">€ '+sEndpreis+'</div>'+
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

                    var pOverlay = WATO.qs(".wa_overlay", pbody);

                    console.log('pOverlay: ', pOverlay);

                    pOverlay.addEventListener("click", function(event) {
                        var aKlickElementKlassen = event.target.classList;
                        if(aKlickElementKlassen.contains("wa_overlay") || 
                            aKlickElementKlassen.contains("close-button") || 
                            aKlickElementKlassen.contains("wa_weiter")){
                            pOverlay.style.display = "none";
                        }
                    });

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
                    console.log(error);
                }

                

            }
        });
    }

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
    
    //imagePath = "https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/img/",
    // var imagePath = "https://s3-eu-west-1.amazonaws.com/webarts/Hessnatur/2018/Sprint1/",
    //     uri = window.document.location.pathname;
    
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


        if(!localStorage.getItem('wa_inSprint2')){
            localStorage.setItem('wa_inSprint2', 'true');
            layerEinbauen();
        }

        WATO.ajax('https://www.hessnatur.com/de/cart/add', function(){
            miniBasketClose();
            layerEinbauen();
        });


        // WATO.globalGoals(1);
        
    } catch (error) {
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