/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	WATO.prototype.globalCode = function(){
		// Punchout
		this.exclude("1024", function(){
			window.location.reload();
			window.location.href = window.location.href;
		});
	};

	WATO.prototype.goalPush = function(key, sendOnNextPageView){
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
		console.log('goalPush: ', key);
	};

	

// 	WATO.prototype.goalPush = function(key, sendOnNextPageView){

// 		if(sendOnNextPageView){
// 			window.iridion.push(['goal', key, '', true]);
// 		}else{
// 			window.iridion.push(['goal', key]);
// 		}
// 		// console.log('goalPush: ', key);
// 	};


// 	WATO.prototype.goals = function(){

// 		// console.log("global");

// 		var _self = this;

// 		function filterGenutzt(e){

// 			try {
// 				var pButton = e.target;
		
// 				if(!pButton.classList.contains("button")){
// 					pButton = pButton.parentNode;
// 				}

// 				// Nur Anwenden Button (nicht schließen Button)
// 				var tempButton = _self.qs(".js-filter-apply", pButton);
// 				if(tempButton && !tempButton.classList.contains("hide")){
					
// 					// Goal "allgemein" Filter genutzt
// 					_self.goalPush("filter_genutzt", true);
		
// 					// Für Iridion-Segments "Filter genutzt"
// 					window.iridion.push(["segment", "32780"]);
					
// 					var sAttr = pButton.getAttribute("data-yeti-box"), // Attribut zur identifikation des Filters
// 						sFilterType = "";
// 					if(sAttr){
// 						// Alle bekannten Filter werden hier einem Goal zugeordnet
// 						switch (sAttr) {
// 							case "toggle_filter_FFassortment":
// 								sFilterType = "sortiment";
// 								break;
// 							case "toggle_filter_FFproductgroup":
// 								sFilterType = "kategorie";
// 								break;
// 							case "toggle_filter_colorgroup":
// 								sFilterType = "farben";
// 								break;
// 							case "toggle_filter_FFfarbauspraegung":
// 								sFilterType = "farbauspraegung";
// 								break;
// 							case "toggle_filter_FFfilterSize":
// 								sFilterType = "groesse";
// 								break;
// 							case "toggle_filter_FFprice":
// 								sFilterType = "preis";
// 								break;
// 							case "toggle_filter_FFpassform":
// 								sFilterType = "passform";
// 								break;
// 							case "toggle_filter_FFmaterial":
// 								sFilterType = "material";
// 								break;
// 							case "toggle_filter_FFlaenge":
// 								sFilterType = "laenge";
// 								break;
// 							case "toggle_filter_FFweite":
// 								sFilterType = "weite";
// 								break;
// 							case "toggle_filter_FFbraFit":
// 								sFilterType = "bhform";
// 								break;
// 							case "toggle_filter_FFvegan":
// 								sFilterType = "vegan";
// 								break;
// 							default:
// 								sFilterType = "unbekannt"; // ... außer es passt keines der oberen Goals
// 								break;
// 						}
// 						_self.goalPush("filter_"+sFilterType, true);
// 					}
// 				}
// 			} catch (error) {
// 				_self.goalPush("wa_setup_monitoring");
// 				// console.log(error);
// 			}
// 		}
	
// 		// Alle einzelnen Filter-"Anwenden" Buttons geklickt
// 		_self.elem('.gridviewProductFilterDesktopWrapper .dropdown-pane button', function(pButtons){
// 			if(pButtons){
// 				try{

// 					for (var i = 0; i < pButtons.length; i++) {
// 						pButtons[i].addEventListener("mousedown", filterGenutzt);
// 					}

// 					var filterTagReset = _self.qsa(".filterTagReset");
// 					if(filterTagReset && filterTagReset.length > 0){
// 						filterTagReset[0].addEventListener("click",function (){
// 							_self.goalPush("filter_zuruecksetzen", true);
// 						});
// 					}

// 				} catch (error) {
// 					_self.goalPush("wa_setup_monitoring");
// 					// console.log(error);
// 				}

// 			}
// 		});

// 		// Sortierung geändert
// 		_self.elem('#desktop__sort', function(pSortieren){
// 			if(pSortieren){
// 				try{
// 					pSortieren[0].addEventListener("change",function (){
// 						_self.goalPush("sortierung_geaendert", true);
// 					});
// 				} catch (error) {
// 					_self.goalPush("wa_setup_monitoring");
// 					// console.log(error);
// 				}
// 			}
// 		});

// 		// Keine Ergebnisse nach filtern
// 		_self.elem('.searchTeaser--headline', function(searchTeaser){
// 			if(searchTeaser){
// 				try{
// 					if(searchTeaser[0].innerHTML.indexOf("Ihre Suche ergab leider keinen Treffer") !== -1){
// 						_self.goalPush("noSearchResults");
// 					}
// 				} catch (error) {
// 					_self.goalPush("wa_setup_monitoring");
// 					// console.log(error);
// 				}
// 			}
// 		});



// 	};




	
})(window.WATO);

