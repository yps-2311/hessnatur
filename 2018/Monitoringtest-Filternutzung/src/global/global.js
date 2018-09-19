/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";
    
	WATO.prototype.goalPush = function(key){
		// console.log('goal: ', key);
		window.iridion.push(['goal', key]);
	};
	
	// WATO.prototype.globalGoals = function(variante){

    //     var _self = this;

    //     // Goal Wunschliste hinzufügen
	// 	WATO.prototype.elem('#addToWishlistButton', function($addToWishlistButton){
	// 		if($addToWishlistButton){
	// 			$addToWishlistButton[0].addEventListener("click", function(){
	// 				_self.goalPush("click_merken");
	// 			});
	// 		}
    //     });
        
    //     var infoOpen = XMLHttpRequest.prototype.open;
    //     XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
    //         // console.log('uri: ', uri);
    //         this.addEventListener("loadend", function() {
    //             // Wenn Info zu Versandkosten geöffnet wird
    //             if(this.readyState === 4 && uri.indexOf("/de/component/shippingInformations") !== -1){

    //                 // UVPs und Flagge nur in V1 hinzufügen
    //                 if(variante === 1){
    //                     // Overlay für Versandkosten
    //                     _self.elem('.reveal-overlay:last-child .rteContainer h2', function($infoLayerH2){
    //                         if($infoLayerH2){
    //                             // Neuer Inhalt in den Overlay einbauen
    //                             $infoLayerH2[0].insertAdjacentHTML("afterend", 
    //                             '<div class="wa_layer">'+
    //                                 '<div>'+
    //                                     '<span>Versand nach Deutschland:</span><br>'+
    //                                     '<b>5,95 €</b>'+
    //                                 '</div>'+
    //                                 '<ul>'+
    //                                     '<li>Faire Lieferkette mit eigener Logistik</li>'+
    //                                     '<li>Klimaneutraler Versand mit DHL GoGreen</li>'+
    //                                     '<li>Versand mit 90% recyceltem Versandmaterial</li>'+
    //                                 '</ul>'+
    //                             '</div>');
    //                         }
    //                     });
    //                 }

    //                 // Goal in beiden Varianten
    //                 _self.goalPush("klick_versandkostenlayer");
    //             }
    //         }, false);
    //         infoOpen.call(this, method, uri, async, user, pass);
    //     };
	// };

	
	
})(window.WATO, window);

