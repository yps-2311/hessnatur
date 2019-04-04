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
    
    WATO.elem('section.js_backstopWrapper', function(wrapper){
        if(wrapper){
            wrapper[0].insertAdjacentHTML('afterbegin', 
                '<div class="row">'+
                    '<div class="kk_survey">'+
                        '<div class="kk_sliderborder">'+
                            '<div class="kk_slider">'+
                                '<div class="kk_lastslide">'+
                                    '<div>'+
                                        '<h3>Die Umfrage ist beendet</h3>'+
                                        '<p>Vielen Dank, dass Sie Interesse haben, uns zu verbessern und weiterzuentwickeln.</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );
        }
    });

})(new window.WATO());