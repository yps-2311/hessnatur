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

    /**
     * EXAMPLE - Event
     *
    // with polling
    WATO.ev('#main-cta', 'click', function(){
        console.log("click it");
    });

    // without polling
    WATO.elem('#main-cta', function(elem){

        WATO.ev(elem[0], 'click', function(){
            console.log("click it");
        });
    });
    */
   
})(new window.WATO());
