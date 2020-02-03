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

    console.log("KK: 2020 - Hessnatur - Sprint 10");


    /**
     * CONSTANTEN
     */
    var PATH    = window.location.pathname,
        STORAGE = "KK10Skip";


    /**
     * HELPERS
     */
    function setStorage(value) {

        window.sessionStorage.setItem(STORAGE, value);
    }
    
    function getStorage() {

        return window.sessionStorage.getItem(STORAGE) === "true";
    }

    function checkPATH(value) {

        return PATH.indexOf("/de/checkout/multi/" + value) !== -1;
    }

    function addClass(value) {

        document.documentElement.classList.add("kk-" + value);
    }
    
    function removeClass(value) {
        
        document.documentElement.classList.remove("kk-" + value);
    }

    
    /**
     * INIT
     */
    // PAGE: LOGIN
    if(PATH === "/de/login/checkout"){

        console.log("PAGE: LOGIN");

        
    // PAGE: IHRE DATEN (GAST)
    } else if(checkPATH("register/guest-update")){

        console.log("PAGE: IHRE DATEN - GAST");

        // add css prefix
        addClass("guest");
        
        // skip next page
        setStorage(true);


    // PAGE: IHRE DATEN (NEUKUNDE)
    } else if(checkPATH("register")) {

        console.log("PAGE: IHRE DATEN - NEUKUNDE");
        
        // add css prefix
        addClass("register");
        
        // skip next page
        setStorage(true);
        

    // PAGE: Adressen
    }else if(checkPATH("addresses/add-delivery-address")){
        
        console.log("PAGE: Adressen");
        
        // skip page
        if(getStorage()){

            console.log("SHOW LOADER");

            setStorage(false);

            WATO.elem("body", function(body){

                if(body){

                    // https://loading.io/css/
                    body[0].insertAdjacentHTML('afterbegin',
                        '<div id="kk-loader">' +
                            '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
                        '</div>'
                    );
                }
            });

            WATO.elem('#addressForm .button[type="submit"]', function(CTA){

                if(CTA){

                    // send form
                    CTA[0].click();
                }
            });

            // loader fallback
            window.setTimeout(function(){
                WATO.qs('#kk-loader').remove();
            }, 4000);
        }


    // PAGE: Zahlungsart
    } else if(checkPATH("payment/add-payment-method")){
        console.log("PAGE: Zahlungsart");
        

    // PAGE: Zusammenfassung
    } else if(checkPATH("summary")){
        console.log("PAGE: Zusammenfassung");

    }



    /**
     * CSS Prefix 
     *
    document.documentElement.classList.add('specific-experiment-class');
    */


    /**
     * EXAMPLE - POLLING
     *
    WATO.elem(".btn-default", function(btnDefault) {

        if(btnDefault) {

        }
    });

    // POLLING MIT FUNKTION
    WATO.elem(function(){return window.numTest === 123;}, function(funcCallback) {

        if(funcCallback){

        }
    });
    */


    /**
     * EXAMPLE - MUTATION OBSERVER
     * 
     * MUSS ERST IN WATO AKTIVIERT WERDEN
     *
    // INIT MUTATION OBSERVER
    WATO.initObserver(function(error){

        console.log(error);
    });

    // FIND ELEMENT
    WATO.observer('.col-md-4', function(cols){

    });
    */


    /**
     * DOM READY
     *
    WATO.ready(function() {

    });
    */
})(new window.WATO());
