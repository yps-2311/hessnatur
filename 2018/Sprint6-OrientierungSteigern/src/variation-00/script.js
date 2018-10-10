// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno / Michael Kloepping
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    console.log("sprint06 - V0");

    var URLpath = window.document.location.pathname,
        bChoseSize = false;

    
	function showErrorInfo(error){
		
//		console.log('try/catch error', error);
		
		pushIridionGoal('wa_setup_monitoring');
	}
    
	
	function pushIridionGoal(key){
		
//		console.log('pushIridionGoal: ', key);
		
		window.iridion.push(['goal', key]);
	}   

    // Startseite & Verteilerseite
    if(URLpath === "/de/" || new RegExp("/de/(NEU|herren|damen|baby|home|sale)").test(URLpath)){

    } else if(URLpath.indexOf("/p/") !== -1){
    	// PDS

    	WATO.elem('#desc__size', function(aSizeSelect){
    		
    		try{
    			if(aSizeSelect){

    				// Größenberater 
    				WATO.elem('#size_advisor', function(aSizeAdvisor){
    		    		try{
    		    			if(aSizeAdvisor){
    		    				
    		    				// Abfrage ob bereits eine Größe per default gewählt ist
    		    				if(aSizeSelect[0].value.length !== 0){
    		    					
    		    					bChoseSize = true;
    		    				}
    		    				// Event Listener bei Veränderung der Größenauswahl
    		    				aSizeSelect[0].addEventListener('change', function(event){
    		    					
    		    					if(event.currentTarget.value !== ""){

    		    						bChoseSize = true;
    		    					} else {
    		    						
    		    						bChoseSize = false;
    		    					}
    		    				});

    		    				// Add to Cart Button - Überprüft ob eine Größe vorausgewählt wurde
		    					WATO.elem('#addToCartButton', function(aAddToCart){
		        					try{
		        		    			if(aAddToCart){		        		    				
		        		    				aAddToCart[0].addEventListener('click', function(){
		        		    					if(!bChoseSize){
		        		    						pushIridionGoal('s6_show_size_error');
		        		    					}
		        		    				});
		        		    			}    			
		        		    		}catch(error){
		        		    			showErrorInfo(error);
		        		    		}
		        				});
		    					
		    					aSizeAdvisor[0].addEventListener('click', function(){
		    						pushIridionGoal('s6_click_size_advisor');
		    					});
    		    			}    			
    		    		}catch(error){
    		    			showErrorInfo(error);
    		    		}
    		    	});
    			}    			
    		}catch(error){
    			showErrorInfo(error);
    		}
    	});
    	
    	WATO.elem('.btn-simple-link.js-pds-more-details', function(aMoreDetails){
    		try{
    			if(aMoreDetails){
    				
    				aMoreDetails[0].addEventListener('click', function(){
						
    					pushIridionGoal('klick_produktdetails');
                    });
    			}
    		}catch(error){
    			
    			showErrorInfo(error);
    		}
    	});
    	
    } else if(URLpath.indexOf("/cart") !== -1){
    	
    }

})(new window.WATO(), window);