
/*
********** WICHTIG **********
* Folgendes Setup ist eine Weiterentwicklung
* diese ist NICHT live. Es handels sich sozusagen
* um eine Datei in der neue Funktionen für späteren
* Gebrauch getestet werden.
* 
* Denis Leno
*/



(function(window){

    function goalPush(key, sendOnNextPageView){
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }
    
    function docReady(callback) {
    	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    		callback();
    	} else {
    		document.addEventListener('DOMContentLoaded', callback);
    	}
	}

    try {

        var URL = document.URL;

        if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(URL)){
            // Startseite
            goalPush('page_home');
        }else if(URL.indexOf("/p/") !== -1){
            // Produktdetailseite
            goalPush('page_pds');
    
            var origOpen = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

                this.addEventListener("load", function() {

                    if(this.readyState === 4 && uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1){

                        goalPush('click_addToCart');
                    }
                }, false);

                origOpen.call(this, method, uri, async, user, pass);
            };

            
    
        }else if(
            URL.indexOf("/de/damen") !== -1 ||
            URL.indexOf("/de/herren") !== -1 ||
            URL.indexOf("/de/baby") !== -1 ||
            URL.indexOf("/de/home") !== -1 ||
            URL.indexOf("/de/sale") !== -1
        ){

            // Kategorie
            goalPush('page_cat');

            
            // function filterGenutzt(e){
            //     try {

            //         var pButton = e.target;
        
            //     if(!pButton.classList.contains("button")){
            //         pButton = pButton.parentNode;
            //     }
        
            //     // Nur Anwenden Button (nicht schließen Button)
            //     var anwendenButton = pButton.querySelector(".js-filter-apply");

            //     if(anwendenButton && !anwendenButton.classList.contains("hide")){
                    
            //         // Goal "allgemein" Filter genutzt
            //         goalPush("filter_genutzt", true);
                    
            //         // In Segment "Filter genutzt"
            //         window.iridion.push(["segment", "32780"]);
        
            //         var sAttr = pButton.getAttribute("data-yeti-box"), // Attribut zur identifikation des Filters
            //             sFilterType = "";
            //         if(sAttr){
            //             // Alle bekannten Filter werden hier einem Goal zugeordnet
            //             switch (sAttr) {
            //                 case "toggle_filter_FFassortment":
            //                     sFilterType = "sortiment";
            //                     break;
            //                 case "toggle_filter_FFproductgroup":
            //                     sFilterType = "kategorie";
            //                     break;
            //                 case "toggle_filter_colorgroup":
            //                     sFilterType = "farben";
            //                     break;
            //                 case "toggle_filter_FFfarbauspraegung":
            //                     sFilterType = "farbauspraegung";
            //                     break;
            //                 case "toggle_filter_FFfilterSize":
            //                     sFilterType = "groesse";
            //                     break;
            //                 case "toggle_filter_FFprice":
            //                     sFilterType = "preis";
            //                     break;
            //                 case "toggle_filter_FFpassform":
            //                     sFilterType = "passform";
            //                     break;
            //                 case "toggle_filter_material":
            //                     sFilterType = "material";
            //                     break;
            //                 case "toggle_filter_FFlaenge":
            //                     sFilterType = "laenge";
            //                     break;
            //                 case "toggle_filter_FFweite":
            //                     sFilterType = "weite";
            //                     break;
            //                 case "toggle_filter_FFbraFit":
            //                     sFilterType = "bhform";
            //                     break;
            //                 case "toggle_filter_FFvegan":
            //                     sFilterType = "vegan";
            //                     break;
            //                 default:
            //                     sFilterType = "unbekannt"; // ... außer es passt keines der oberen Goals
            //                     break;
            //             }
            //             goalPush("filter_"+sFilterType, true);
            //         }
            //     }
                    
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }

            // try {

            //     docReady(function(){

            //         // Alle einzelnen Filter-"Anwenden" Buttons geklickt
            //         var filterBestaetigenButtons = document.querySelectorAll('.gridviewProductFilterDesktopWrapper .dropdown-pane button');
            //         if(filterBestaetigenButtons.length > 0){
            //             for (var i = 0; i < filterBestaetigenButtons.length; i++) {
            //                 filterBestaetigenButtons[i].addEventListener("mousedown", filterGenutzt);
            //             }
            //         }

            //         // Filter zurücksetzen Button
            //         var filterTagReset = document.querySelector(".filterTagReset");
            //         if(filterTagReset){
            //             filterTagReset.addEventListener("click",function (){
            //                 goalPush("filter_zuruecksetzen", true);
            //             });
            //         }
                    
            //         // Sortierung geändert
            //         var sortChange = document.querySelector("#desktop__sort");
            //         if(sortChange){
            //             sortChange.addEventListener("change",function (){
            //                 goalPush("sortierung_geaendert", true);
            //             });
            //         }
            // 	});
                
            // } catch (error) {
            //     console.log(error);
            // }

        }else if(URL.indexOf("/de/cart") !== -1){

            // Warenkorb
            goalPush('page_cart');
        }else if(URL.indexOf("/register/guest-update") !== -1){
            
            // Gast Regestrierung
            goalPush('page_guest');
        }else if(URL.indexOf("/register") !== -1){

            // Neukunde Regestrierung
            goalPush('page_reg');
        }else if(URL.indexOf("/login") !== -1){

            // Login Regestrierung
            goalPush('page_signin');
    
            var wa_loginButtonInterval = setInterval(function(){
                var $wa_loginButton = window.document.querySelector("#loginForm .text-right .button");
                if($wa_loginButton){
                    clearInterval(wa_loginButtonInterval);
                    $wa_loginButton.addEventListener("click",function(){
                        goalPush('page_login');
                    });
                }
            },100);

            setInterval(function(){
                clearInterval(wa_loginButtonInterval);
            },5000);

        } else if (URL.indexOf("/merkzettel") !== -1) {
            // Merkzettel
            goalPush('click_merken');
            
        } else if(URL.indexOf("/addresses/add-delivery-address") !== -1){
            // Adresse
            goalPush('page_address');
            
        }else if(URL.indexOf("/payment/add-payment-method") !== -1){
            // Bezahungsart
            goalPush('page_pay');
            
        }else if(URL.indexOf("/summary") !== -1){
            // Zusammenfassung
            goalPush('page_sum');
            
            try{            	
            	docReady(function(){
            		var zahlart = window.document.querySelectorAll('#checkoutContentPanel > div > .row > div .h-smallOffset-bottom-inner');
            		
            		if(	zahlart.length !== 0 && 
            			zahlart[0].textContent.trim().toLowerCase().indexOf('rechnung') !== -1){

            			document.querySelector('button.success').addEventListener('click', function(){
            				window.iridion.push(["segment", "32785"]);
                		});
            		}
            	});
            } catch(error){}

        }else if(URL.indexOf("/checkout/orderConfirmation") !== -1){
            // Danke
            goalPush('page_conv');
    
            // // Revenue
            var wa_interval = setInterval(function(){

                try {
                    if(typeof window.emospro !== "undefined"){

                        var wa_price = 0,
                            wa_buyid = "";
    
                        if(window.emospro.billing && window.emospro.billing.length > 3){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.billing[3];
                            wa_buyid = window.emospro.billing[0];
                        }
                        if(wa_price === 0 && window.emospro.ec_Event && window.emospro.ec_Event.length > 0){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.ec_Event[0].price;
                        }
    
                        if(parseInt(wa_price) !== 0){
                            window.iridion.push(["revenue", wa_price, wa_buyid]);
                        }else{
                            goalPush('error_revenue');
                        }
                    }
                } catch (error) {
                    // console.log(error);
                    goalPush('error_revenue');
                }
            }, 100);

            setTimeout(function(){
                clearInterval(wa_interval);
            }, 3000);
        }
    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
    }
})(window);





// window.document.querySelector(".language-de").insertAdjacentHTML("beforeend", 
//     '<iframe><html><head><script>window.top.iridion = window.top.iridion || []; window.top.iridion.push(["revenue", 5.11, "N004708130"]);</script></head><body>test</body></html></iframe>'
// );

