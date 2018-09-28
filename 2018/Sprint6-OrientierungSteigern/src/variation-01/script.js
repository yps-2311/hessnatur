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

    console.log("sprint06");

    var URLpath = window.document.location.pathname;

    function getLocalstorage(name){
        // if(isLS){
        //     return window.localStorage.getItem(name);
        // }else{
        //     return window.sessionStorage.getItem(name);
        // }
        return window.localStorage.getItem(name) || window.sessionStorage.getItem(name);
    }
    function setLocalstorage(name, isLS){
        if(isLS){
            return window.localStorage.setItem(name, true);
        }else{
            return window.sessionStorage.setItem(name, true);
        }
    }

    function userIstImView(element, callback) {
        console.log('element: ', element);
        try {
            window.addEventListener("scroll", function(){
                if(doScroll){
                    doScroll = false;
        
                    setTimeout(function(){
                        doScroll = true;
                    }, 50);
        
                    try {
                        var offsetTop = element.getBoundingClientRect().top;
                        // bNachDerCTA = (Math.max(window.document.documentElement.clientHeight, window.innerHeight || 0)) >= zFormOffsetTop;
                        
                        console.log('offsetTop: ', offsetTop);
    
                        // if(offsetTop < 330 && offsetTop > -330){
        
        
                        // }
        
                    } catch (e){
                        console.log(e);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    var doScroll = true;


    if(URLpath === "/de/" || new RegExp("/de/(NEU|herren|damen|baby|home|sale)").test(URLpath)){
        // Startseite & Verteilerseite

        // Nudge geschlossen oder gesehen
        if(!getLocalstorage("kk_homeNudge")){

            // Nach X Sekunden eingeblendet
            // setTimeout(function(){

                WATO.elem('#search_form', function(suchfeld){
                    if(suchfeld){
                        console.log('suchfeld: ', suchfeld);


                        userIstImView(suchfeld[0], function(){
                            suchfeld[0].insertAdjacentHTML('beforebegin', 
                            '<div class="kk_nudgeLeft">'+
                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>×</span></button>'+
                                '<b>Wer suchet, der findet.</b>'+
                                '<p>Sie können ebenfalls Bestellnummern<br>aus unserem Katalog eingeben.</p>'+
                            '</ul>');
                            setTimeout(function(){
                                var nudge = WATO.qs(".kk_nudgeLeft");
                                nudge.style.opacity = 1;
                                // setLocalstorage("kk_homeNudge", false);
        
                                WATO.qs(".close-button", nudge).addEventListener('click', function(){
                                    nudge.style.opacity = 0;
                                    setTimeout(function(){
                                        nudge.style.display = "none";
                                        // setLocalstorage("kk_homeNudge", true);
                                    }, 1000);
                                });
                            }, 500);
                        });


                        
                    }
                });
            // }, 1500);
        }

    }else if(URLpath.indexOf("/p/") !== -1){
        // PDS


    }

    

    

    




})(new window.WATO(), window);