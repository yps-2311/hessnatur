// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    // WATO.elem('body', function(element){
    //     if(element){
    //         element[0].insertAdjacentHTML("afterbegin", '<img style="position:absolute; z-index: 1000; top: 91px; left:0; opacity: 0.5;" src="https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/img/2018-05-14-pds-2.png" >');
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
    
    var imagePath = "https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/img/",
        uri = window.document.location.pathname;
    
    try {

        console.log("im test");

        if(uri.indexOf("/p/") !== -1){
            // PDS

            WATO.elem('.align-middle.h-largeOffset-bottom-outer', function($mengeWrapper){
                if($mengeWrapper){
                    $mengeWrapper[0].insertAdjacentHTML("afterend", 
                    '<div class="row">'+
                        '<div class="columns wa_klappbar wa_einkl">'+
                            '<div class="wa_warum">'+
                                '<div class="wa_close"></div>'+
                                '<h3>Warum dauert die Lieferung <span>so lange</span>?</h3>'+
                                '<p>Lieber Kunde,<br>dieser Artikel ist aufgrund dieser Punkte nicht sofort lieferbar:</p>'+
                                '<ul><li>Wir produzieren nicht auf Masse;<br>Nachhaltigkeit steht im Fokus</li>'+
                                '<li>Faire Arbeitsbedingungen im Produktionsland</li>'+
                                '<li>Ressourcen werden geschont</li></ul>'+
                                '<p>Wenn Sie den Artikel bestellen möchten, empfehlen wir<br>'+
                                'Ihnen, das bald zu tun, da er wegen erhöhter Nachfrage<br>'+
                                'wahrscheinlich nicht mehr lange lieferbar sein wird.</p>'+
                                '<p>Wir bitten Sie vielmals, diese Umstände zu entschuldigen!</p>'+
                                '<img src="'+imagePath+'team.png">'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                    );
                    var $warumInfobox = WATO.qs(".wa_warum"),
                        $wa_klappbar = $warumInfobox.parentNode,
                        $lieferzeitBox = WATO.qs("#avail_container > .label", $mengeWrapper[0]),
                        $headlineZeit = WATO.qs("h3 span", $warumInfobox);
    
                    // console.log('$lieferzeitBox: ', $lieferzeitBox);
                    if($lieferzeitBox.className.indexOf("warning") !== -1){
                        removeClass($wa_klappbar ,"wa_einkl");
                    }
    
                    WATO.qs(".wa_close",$warumInfobox).addEventListener("click", function(){
                        addClass($wa_klappbar ,"wa_einkl");
                        window.localStorage.setItem("wa_info", "geschlossen");
                    });
    
                    $lieferzeitBox.addEventListener('DOMSubtreeModified', function(e) {
    
                        var $diesesInfobox = e.target,
                            _lieferZeit = $diesesInfobox.textContent.replace("Lieferbar in",""),
                            _lieferZeitZahl = _lieferZeit.replace("einer","1").replace("zwei","2").replace("drei","3").replace("vier","4").replace("fünf","5")
                            .replace("sechs","6").replace("sieben","4").replace("acht","8").replace("neun","9").replace("zehn","10");
    
                        if($diesesInfobox.className.indexOf("warning") !== -1){
    
                            if(!window.localStorage.getItem("wa_info")){
                                removeClass($wa_klappbar ,"wa_einkl");
                            }
    
                            $headlineZeit.textContent = _lieferZeit;
    
                            $diesesInfobox.insertAdjacentHTML("afterend", 
                            '<span class="wa_lieferbarkeit">Lieferzeit: '+
                                _lieferZeitZahl+
                                '<span class="wa_oeffnenwarum">Warum dauert die Lieferung so lange?</span>'+
                            '</span>');
    
                            WATO.qs(".wa_oeffnenwarum", $mengeWrapper[0]).addEventListener("click", function(){
                                removeClass($wa_klappbar ,"wa_einkl");
                                window.localStorage.removeItem("wa_info");
                            });
                        }else{
                            addClass($wa_klappbar ,"wa_einkl");
                        }
                    });
                }
            });
    
    
            WATO.elem('.pds-cockpit__addProductWrapper', function($addProductWrapper){
                if($addProductWrapper){
                    $addProductWrapper[0].insertAdjacentHTML("afterend", 
                    '<div class="row">'+
                        '<div class="columns">'+
                            '<div class="wa_klapp">'+
                                '<h3>Für die Bestellung inklusive:</h3>'+
                                '<div class="wa_klima wa_einklappen">'+
                                    '<b>Klimaneutraler Versand</b>'+
                                    '<p>Aus Liebe zur Umwelt verschicken wir Ihre Lieferung klimaneutral mit DHL GoGreen.</p>'+
                                '</div>'+
                                '<div class="wa_resyc wa_einklappen">'+
                                    '<b>Recycletes Versandmaterial</b>'+
                                    '<p>Unsere Pakete bestehen zu 90% aus recycletem Papier und belasten die Umwelt deutlich weniger.</p>'+
                                '</div>'+
                                '<div class="wa_retoure wa_einklappen">'+
                                    '<b>Kostenlose & einfache Retoure</b>'+
                                    '<p>Sollte Ihnen Ihnen ein Produkt ein mal nicht gefallen, können Sie dies jederzeit umtauschen. Der Retourenschein liegt Ihrer Bestellung bei.</p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>');
    
                    var $dieAusklappboxen = WATO.qsa(".wa_klapp > div", $addProductWrapper[0].parentNode);
    
                    // Einer der Zufälligen boxen aufklappen
                    removeClass($dieAusklappboxen[Math.floor(Math.random() * 3)] , "wa_einklappen");
    
    
                    $dieAusklappboxen.forEach(function($box){
                        $box.addEventListener("click", function($dieseBoxGeklickt){
    
                            $dieAusklappboxen.forEach(function(element){
                                addClass(element , "wa_einklappen");
                            });
                            removeClass($dieseBoxGeklickt.target.parentNode , "wa_einklappen");
                            removeClass($dieseBoxGeklickt.target , "wa_einklappen");
                        });
                    });
                }
            });
    
            var infoOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
                this.addEventListener("loadend", function() {
                    if(this.readyState === 4 && uri.indexOf("/de/component/shippingInformations") !== -1){
                        // console.log('uri: ', uri);
                        
                        WATO.elem('.reveal-overlay:last-child .rteContainer h2', function($infoLayerH2){
                            if($infoLayerH2){
                                // console.log('$infoLayerH2[0]: ', $infoLayerH2[0]);
                                $infoLayerH2[0].insertAdjacentHTML("afterend", 
                                '<div class="wa_layer">'+
                                    '<div>'+
                                        '<span>Versand nach Deutschland:</span><br>'+
                                        '<b>5,95 €</b>'+
                                    '</div>'+
                                    '<ul>'+
                                        '<li>Faire Lieferkette mit eigener Logistik</li>'+
                                        '<li>Klimaneutraler Versand mit DHL GoGreen</li>'+
                                        '<li>Versand mit 90% recycletem Altpapier</li>'+
                                    '</ul>'+
                                '</div>');
                            }
                        });
    
                    }
                }, false);
                infoOpen.call(this, method, uri, async, user, pass);
            };

        }else if(uri.indexOf("/de/cart") !== -1){
            // WK

            

        }



        



        
        
        
    } catch (error) {
        console.log(error);
    }
})(new window.WATO());
