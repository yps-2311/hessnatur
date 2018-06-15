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
    function kickout(breite){
		if(window.innerWidth < breite){
            addClass(window.document.body, "wa_punchout");
		}else{
            removeClass(window.document.body, "wa_punchout");
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
                        pMenge = WATO.qs("#desc__amount", pbody),
                        sTheLook = "",
                        aCompleteTheLook = WATO.qsa(".pds-completeTheLookWrapper .productitem", pbody); 

                    
                    for (var i = 0; i < aCompleteTheLook.length; i++) {
                        sTheLook += '<div class="carousel-cell">'+aCompleteTheLook[i].innerHTML+"</div>";
                    }


                    pbody.insertAdjacentHTML("beforeend", 
                        '<div class="reveal-overlay wa_overlay" style="display: block;">'+
                            '<div class="reveal" data-reveal="8pd3zy-reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" style="display: block; top: 125px;" tabindex="-1">'+
                                
                                '<div class="wa_wrapper">'+
                                    '<button class="close-button" data-close="" aria-label="Close reveal" type="button">'+
                                        '<span aria-hidden="true">×</span>'+
                                    '</button>'+
                                    '<div class="row wa_content">'+
                                        '<div class="column small-3">'+
                                            '<div class="h3">Gute Wahl!</div>'+
                                            '<p>Der Artikel liegt in Ihrem Warenkorb.</p>'+
                                            '<img src="'+pBild.getAttribute("src")+'">'+
                                            '<p>'+pHeadline.textContent+'</p>'+
                                            '<div><b>FARBE:</b> '+pFarbe.textContent+'</div>'+
                                            '<div><b>GRÖße:</b> '+pGroesse.value+'</div>'+
                                            '<div><b>MENGE:</b> '+pMenge.value+'</div>'+
                                        '</div>'+
                                        '<div class="column small-9">'+
                                            '<div class="main-carousel">'+
                                                sTheLook+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row wa_footer">'+
                                        '<div class="column small-4">'+
                                            '<button href="/de/cart" class="button expanded pds-cockpit__addToCartButton js-add-to-cart-button">'+
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
                        if(event.target.classList.contains("wa_overlay")){
                            pOverlay.style.display = "none";
                        }
                    })

                    $('.main-carousel').flickity({
                        // options
                        cellAlign: 'left',
                        contain: true
                    });


                } catch (error) {
                    console.log(error);
                }

                

            }
        });
    }
    
    //imagePath = "https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/img/",
    var imagePath = "https://s3-eu-west-1.amazonaws.com/webarts/Hessnatur/2018/Sprint1/",
        uri = window.document.location.pathname;
    
    try {

        window.addEventListener("resize", function(){
            // kickout(1024);
        }, false);
        // kickout(1024);


        // Minibasket nicht anzeigen
        WATO.elem('#miniCartDropdown', function(pMiniCartDropdown){
            if(pMiniCartDropdown){                
                addClass(pMiniCartDropdown, "wa_nichtanzeigen");

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


            }
        });

        setTimeout(function(){
            layerEinbauen();
        }, 2000);

       


        


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