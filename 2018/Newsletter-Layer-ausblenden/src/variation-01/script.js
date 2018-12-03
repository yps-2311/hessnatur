// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";


    try {
        console.log("test");

        if(!window.localStorage.getItem('kk_hideLayer')){
            document.documentElement.classList.add('kk_hideLayer');

            WATO.elem('.reveal-overlay', function(overlay){
                if(overlay){
    
                    try {
                        overlay = overlay[0];
                        
                        console.log('overlay: ', overlay);
                        console.log('overlay.textContent.indexOf("NICHTS MEHR VERPASSEN!"): ', overlay.textContent.indexOf("NICHTS MEHR VERPASSEN!") !== -1);
                        
                        if(overlay.textContent.indexOf("NICHTS MEHR VERPASSEN!") !== -1){
                            window.localStorage.setItem('kk_hideLayer', 'true');

                            var closeButton = WATO.qs(".close-button", overlay);
                            if(closeButton){
                                console.log('WATO.qs(".close-button", overlay): ', closeButton);
                                closeButton.click();
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        }

    } catch (error) {
        console.log(error);
    }

})(new window.WATO());