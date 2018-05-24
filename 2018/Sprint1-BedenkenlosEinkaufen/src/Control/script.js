// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
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
    
    var uri = window.document.location.pathname;
    
    try {
        console.log("!!!! control !!!!");

        window.addEventListener("resize", function(){
            kickout(1024);
        }, false);
        kickout(1024);

        if(uri.indexOf("/de/cart") !== -1 || uri.indexOf("/p/") !== -1){
            console.log("1");

            // Globale Goals mit übergabe der Variante 0
            WATO.globalGoals(0);

            console.log("2");

            // Klick Goal auf InfoLayer geöffnet "Wieder öffnen Warum dauert die Lieferung so lange? Layer"
            WATO.elem('#avail_container .js-availability-info', function(element){

                console.log("3");
                if(element){
                    element[0].addEventListener("click", function(){

                        console.log("4");
                        WATO.goalPush("klick_openLayer");
                    });
                }
            });
        }
        
    } catch (error) {
        console.log(error);
    }
})(new window.WATO(), window);
