/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	WATO.prototype.goalPush = function(key){
		console.log('goal: ', key);
		window.iridion.push(['goal', key]);
	};

	function versandkostenLayer() {
        var infoOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
            this.addEventListener("loadend", function() {
                // Wenn Info zu Versandkosten geöffnet wird
                if(this.readyState === 4 && uri.indexOf("/de/component/shippingInformations") !== -1){

                    this.goalPush("klick_versandkostenlayer");

                    // Der letzte offene Overlay
                    this.elem('.reveal-overlay:last-child .rteContainer h2', function($infoLayerH2){
                        if($infoLayerH2){
                            // Neuer Inhalt in den Overlay einbauen
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
    }
	
	WATO.prototype.globalGoals = function(){

		this.elem('#addToWishlistButton', function($addToWishlistButton){
			if($addToWishlistButton){
				$addToWishlistButton[0].addEventListener("click", function(){
					this.goalPush("click_merken");
				});
			}
		});

		versandkostenLayer();
	};

	
	
})(window.WATO);

