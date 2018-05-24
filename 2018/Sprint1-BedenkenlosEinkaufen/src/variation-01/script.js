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
    function getLieferzeit(string){
        var _lieferZeit     = string.replace("Lieferbar in","").replace("einer Woche","eine Woche"),
            _lieferZeitZahl = _lieferZeit.replace("einer","1").replace("zwei","2").replace("drei","3").replace("vier","4").replace("fünf","5")
            .replace("sechs","6").replace("sieben","7").replace("acht","8").replace("neun","9").replace("zehn","10");
        
        return [_lieferZeit, _lieferZeitZahl];
    }

    function lieferzeitZeileEinbauen(uebergabeEvent, $wa_klappbar, $headlineZeit, $mengeWrapper){

        try {

            var $diesesInfobox;

            if(!uebergabeEvent){
                $diesesInfobox = WATO.qs("#avail_container > .label", $mengeWrapper);
            }else{
                $diesesInfobox = uebergabeEvent.target;
            }
            // console.log('$diesesInfobox: ', $diesesInfobox);
            
            var _lieferZeit = getLieferzeit($diesesInfobox.textContent)[0],
            _lieferZeitZahl = getLieferzeit($diesesInfobox.textContent)[1],
            _infoAusgeblendet = true;
            
            // console.log('_lieferZeit: ', _lieferZeit);
            // Timing Problem
            setTimeout(function(){

                // Ist die Statusbox vom System ausgeblendet, wenn ja unsere Infobox auch ausblenden
                if(typeof $diesesInfobox.getAttribute("style") !== "undefined"){
                    console.log('$diesesInfobox.style.display === "none": ', $diesesInfobox.style.display === "none");
                    if($diesesInfobox.style.display === "none"){
                        _infoAusgeblendet = false;
                    }
                }

                if( _lieferZeit.indexOf("Sofort lieferbar") === -1 && 
                    _lieferZeit.indexOf("Ausverkauft") === -1 && 
                    _lieferZeit !== "" &&
                    _infoAusgeblendet
                ){
                    // console.log(1);
                    if(!window.localStorage.getItem("wa_info")){
                        removeClass($wa_klappbar ,"wa_einkl");
                    }

                    $headlineZeit.textContent = _lieferZeit;

                    console.log('$diesesInfobox: ', $diesesInfobox);
                    $diesesInfobox.insertAdjacentHTML("afterend", 
                    '<span class="wa_lieferbarkeit">Lieferzeit: '+
                        _lieferZeitZahl+
                        '<span class="wa_oeffnenwarum">Warum dauert die Lieferung so lange?</span>'+
                    '</span>');

                    WATO.qs(".wa_oeffnenwarum", $mengeWrapper).addEventListener("click", function(){
                        removeClass($wa_klappbar ,"wa_einkl");
                        window.localStorage.removeItem("wa_info");

                        WATO.goalPush("klick_openLayer");
                    });
                }else{
                    // console.log(2);
                    addClass($wa_klappbar ,"wa_einkl");
                }

                // Versandkosten-Link fix
                WATO.elem('.btn-simple-link.js-reveal-ajax:not(.wa_listener)', function(element){
                    if(element){
                        // Damit der Listener nicht mehrfach gesetzt wird
                        addClass(element[0], "wa_listener");

                        // Bei klick wird die "ORIGINAL"-Funktion der Website neu auf den Link gesetzt
                        // Die Funktion ist lediglich von jQuery in JS umgebaut
                        element[0].addEventListener("click", function(e){
                            if(typeof window.ACC !== "undefined"){
                                e.preventDefault();
                                window.ACC.modals.loadAjaxModal(e.target.getAttribute("href"));
                            }
                        });
                    }
                });

            }, 200);

        } catch (error) {
            console.log(error);
        }
    }

    function direktUmschreiben(){
        // Direkt vom Hersteller - das "d" klein machen
        WATO.elem('.js-availability-delivery.warning', function($meldungenZurLieferung){
            if($meldungenZurLieferung){
                for (var k = 0; k < $meldungenZurLieferung.length; k++) {
                    var ZurLieferung = $meldungenZurLieferung[k],
                        statusText = ZurLieferung.textContent;

                    if(statusText.indexOf("Direkt") !== -1){
                        ZurLieferung.textContent = statusText.replace("Direkt","direkt");
                    }
                }
            }
        });
    }
    
    //imagePath = "https://dev.web-arts.de/hessnatur/2018/Sprint1-BedenkenlosEinkaufen/img/",
    var imagePath = "https://s3-eu-west-1.amazonaws.com/webarts/Hessnatur/2018/Sprint1/",
        uri = window.document.location.pathname,
        htmlInhaltUVPs = '<div class="wa_klima">'+
                            '<b>Klimaneutraler Versand</b>'+
                            '<p>Aus Liebe zur Umwelt verschicken wir Ihre Lieferung klimaneutral mit DHL GoGreen.</p>'+
                        '</div>'+
                        '<div class="wa_resyc">'+
                            '<b>Recyceltes Versandmaterial</b>'+
                            '<p>Unsere Pakete bestehen zu 90% aus recyceltem Papier und belasten die Umwelt deutlich weniger.</p>'+
                        '</div>'+
                        '<div class="wa_retoure">'+
                            '<b>Kostenlose & einfache Retoure</b>'+
                            '<p>Sollte Ihnen ein Produkt einmal nicht gefallen, können Sie dies jederzeit umtauschen. Der Retourenschein liegt Ihrer Bestellung bei.</p>'+
                        '</div>';
    
    try {

        window.addEventListener("resize", function(){
            kickout(1024);
        }, false);
        kickout(1024);

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
                                '<ul><li>Wir produzieren nicht auf Masse; Nachhaltigkeit steht im Fokus</li>'+
                                '<li>Faire Arbeitsbedingungen im Produktionsland</li>'+
                                '<li>Ressourcen werden geschont</li></ul>'+
                                '<p>Wenn Sie den Artikel bestellen möchten, empfehlen wir '+
                                'Ihnen, das bald zu tun, da er wegen erhöhter Nachfrage '+
                                'wahrscheinlich nicht mehr lange lieferbar sein wird.</p>'+
                                // '<p>Wir bitten Sie vielmals, diese Umstände zu entschuldigen!</p>'+
                                '<img src="'+imagePath+'team.png">'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                    );

                    var $warumInfobox = WATO.qs(".wa_warum"),
                        $wa_klappbar = $warumInfobox.parentNode,
                        $lieferzeitBox = WATO.qs("#avail_container > .label", $mengeWrapper[0]),
                        $headlineZeit = WATO.qs("h3 span", $warumInfobox);

                    // if($lieferzeitBox.className.indexOf("warning") !== -1){
                    //     removeClass($wa_klappbar ,"wa_einkl");
                    // }
    
                    // Infolayer schließen 
                    WATO.qs(".wa_close", $warumInfobox).addEventListener("click", function(){
                        addClass($wa_klappbar ,"wa_einkl");
                        window.localStorage.setItem("wa_info", "geschlossen");

                        WATO.goalPush("klick_closeLayer");
                    });

                    // lieferzeitZeileEinbauen(false, $wa_klappbar, $headlineZeit, $mengeWrapper[0]);
    
                    $lieferzeitBox.addEventListener('DOMSubtreeModified', function(e) {
                        // console.log('e: ', e);
                        lieferzeitZeileEinbauen(e, $wa_klappbar, $headlineZeit, $mengeWrapper[0]);
                    });


                }
            });
    
            // Die merken und CTA Zeile
            WATO.elem('.pds-cockpit__addProductWrapper', function($addProductWrapper){
                if($addProductWrapper){

                    // Wrapper für die bestellung inklusive box
                    $addProductWrapper[0].insertAdjacentHTML("afterend", 
                    '<div class="row">'+
                        '<div class="columns">'+
                            '<div class="wa_klapp">'+
                                '<h3>Für diese Bestellung inklusive:</h3>'+
                                htmlInhaltUVPs+
                            '</div>'+
                        '</div>'+
                    '</div>');
    
                    var $dieAusklappboxen           = WATO.qsa(".wa_klapp > div", $addProductWrapper[0].parentNode),
                        welcheBoxVoreingeblendet    = Math.floor(Math.random() * 3);

                    // console.log('$dieAusklappboxen: ', $dieAusklappboxen);

                    if($dieAusklappboxen){

                        // function oeffnenKlick(e){

                        //     var $dieseBoxGeklickt = e.target;
                        //     console.log('$dieseBoxGeklickt: ', $dieseBoxGeklickt);
                        // }

                        for (var i = 0; i < $dieAusklappboxen.length; i++) {
                            var $box = $dieAusklappboxen[i],
                                $pTag = WATO.qs("p", $box);
                            
                            // Feste höhe dieses Elements festlegen
                            $pTag.style.height = $pTag.offsetHeight + "px";
    
                            // Eine zufällige Box ausklappen
                            if($dieAusklappboxen[welcheBoxVoreingeblendet] !== $box) {
                                addClass($box, "wa_einklappen");
                            }
    
                            // Öffnen klick
                            $box.addEventListener("click", function($dieseBoxGeklickt){
                                // interaktion
                                WATO.goalPush("click_bestellbox");
                                                                
                                // Definition dass das geklickte Target auch die Box selbst und kein children ist
                                var $genauDieBox = $dieseBoxGeklickt.target;
                                if($genauDieBox.tagName !== "DIV"){
                                    $genauDieBox = $dieseBoxGeklickt.target.parentNode;
                                }

                                if($genauDieBox.className.indexOf("wa_einklappen") === -1){
                                    // wenns schon ausgeklappt ist wird es eingeklappt
                                    addClass($genauDieBox , "wa_einklappen");
                                }else{
                                    for (var k = 0; k < $dieAusklappboxen.length; k++) {
                                        var $dieseBox = $dieAusklappboxen[k];

                                        // Die angeklickte ausklappen beide anderen einklappen
                                        if($dieseBox !== $genauDieBox){
                                            addClass($dieseBox , "wa_einklappen");
                                        }else{
                                            removeClass($dieseBox , "wa_einklappen");
                                        }
                                    }
                                }
                            });
                        }
                        // $dieAusklappboxen.forEach(function($box){
                            
                        // });
                    }

                }
            });

            WATO.globalGoals(1);

            direktUmschreiben();

        }else if(uri.indexOf("/de/cart") !== -1){
            // WK

            direktUmschreiben();

            var isHover = false;

            WATO.elem('.yCmsContentSlot.h-largeOffset-bottom-outer', function($nebenZwischensumme){
                if($nebenZwischensumme){

                    // Umbau der Klassen damit das Originale Grid noch funktioniert
                    removeClass($nebenZwischensumme[0], "medium-6");
                    addClass($nebenZwischensumme[0], "medium-7");

                    // Bestellung inklusive Box unter den Produkten
                    $nebenZwischensumme[0].insertAdjacentHTML("afterbegin", 
                    '<div class="row">'+
                        '<div class="columns">'+
                            '<div class="wa_klapp wa_klappwk">'+
                                '<h3>Für die Bestellung inklusive:</h3>'+
                                '<div class="wa_flex">'+
                                    htmlInhaltUVPs+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>');

                    // Goal bei Mouseover über einer Sekunde abschicken
                    WATO.elem('.wa_klapp', function($wa_klapp){
                        if($wa_klapp){
                            $wa_klapp[0].addEventListener("mouseenter", function(){
                                isHover = true;
                                setTimeout(function(){
                                    if(isHover){
                                        WATO.goalPush("engagement_bestellbox");
                                    }
                                }, 1000);
                            });
                            $wa_klapp[0].addEventListener("mouseleave", function(){
                                isHover = false;
                            });
                        }
                    });

                    WATO.elem('.listing__table--item', function($alleProdukte){
                        if($alleProdukte){
                            console.log('$alleProdukte.length: ', $alleProdukte.length);
                            // console.log('$alleProdukteLieferzeit: ', $alleProdukteLieferzeit);
                            // console.log('$alleProdukteLieferzeit.length: ', $alleProdukteLieferzeit.length);
        
                            var pruefArray = [];
        
                            for (var j = 0; j < $alleProdukte.length; j++) {
        
                                var $produkteLieferzeit = WATO.qs(".js-availability-status",$alleProdukte[j]),
                                    statusText = $produkteLieferzeit.textContent;
                                
                                console.log('produkteLieferzeit: ', $produkteLieferzeit);
        
                                // Lieferzeit Textzeile angepasst, mit Ziffer statt ausgeschriebener Zahl
                                if(statusText.indexOf("sofort") === -1 && statusText.indexOf("Ausverkauft") === -1){
                                    $produkteLieferzeit.textContent = "Lieferzeit: " + getLieferzeit(statusText)[1];
                                }
        
                                // Alle Lieferzeiten werden in einen Array geschrieben
                                pruefArray.push(statusText);
                            }
        
                            console.log('pruefArray: ', pruefArray);
        
                            // Es wird geprüft ob die Lieferzeiten mindestens einen Unterschied zwischen den Produkten haben
                            if(!pruefArray.reduce(function(a, b){ return (a === b) ? a : NaN; })) {
        
                                WATO.elem('.js_backstopWrapper .large-10', function(element){
                                    if(element){
                                        console.log('js_backstopWrapper: ', element);
                                        element[0].insertAdjacentHTML("afterbegin", 
                                        '<div class="row">'+
                                            '<div class="wa_waHinweis">'+
                                                'Hinweis: Sofort lieferbare Artikel werden separat und zuerst geliefert.'+
                                            '</div>'+
                                        '</div>'
                                        );
                                        
                                        WATO.goalPush("show_meldung");
                                    }
                                });
                            }
                        }
                    });

                }
            });

            WATO.elem('.h-xLargeOffset-bottom-outer', function($nebenZwischensumme){
                if($nebenZwischensumme){
                    $nebenZwischensumme = $nebenZwischensumme[0];

                    // Umbau der Klassen damit das Originale Grid noch funktioniert
                    removeClass($nebenZwischensumme, "medium-6");
                    removeClass($nebenZwischensumme, "large-4");
                    addClass($nebenZwischensumme, "medium-5");
                    addClass($nebenZwischensumme, "large-3");
                }
            });

            WATO.globalGoals(1);
        }
        
    } catch (error) {
        console.log(error);
    }

    
})(new window.WATO(), window);
