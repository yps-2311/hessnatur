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

    // INIT MUTATION OBSERVER
    WATO.initObserver(function(error){

        console.log(error);
    });

    // FIND ELEMENT
    WATO.observer('.smoBoxContainer', function(smoBoxContainer){

        function addListener(object, listener, callback) {

            object.addEventListener(listener, callback);
        }

        function classContains(object, value) {

            return object.classList.contains('wa-' + value);
        }

        function manageClass(object, value, remove) {

            var _class = 'wa-' + value,
                _classList = object.classList;

            if(remove){

                _classList.remove(_class);
            } else {
                
                _classList.add(_class);
            }
        }

        function animate(badge, survey, callback) {
            
            jQuery('#wa-badge').animate({
                left: badge,
            }, 1000);

            jQuery("#wa-survey").animate({
                right: survey,
            }, 1000, function() {

                callback();
            });
        }

        smoBoxContainer[0].insertAdjacentHTML('afterend', 
            '<div id="wa-survey" class="wa-small wa-first">' + 
                '<div id="wa-pulse" class="wa-animated">1</div>' +
                '<div id="wa-badge" class="wa-animated"></div>' +
            '</div>'
        );

        var $waSurvey   = WATO.qs('#wa-survey'),
            $waPulse    = WATO.qs('#wa-pulse'),
            $waBadge    = WATO.qs('#wa-badge');

        // set pulse animation after 1500ms
        window.setTimeout(function(){

            manageClass($waPulse, 'pulse');
        }, 1500);

        // survery mouseover
        addListener($waSurvey, 'mouseover', function(){

            // remove class wa-first, hide wa-pulse element
            manageClass($waSurvey, 'first', true);

            // if(this.classList.contains('wa-small')){
            if(classContains(this, 'small')){

                manageClass($waBadge, 'fade-out', true);
                manageClass($waBadge, 'fade-in');
            }
        });

        // survery mouseout
        addListener($waSurvey, 'mouseout', function(){

            // if(this.classList.contains('wa-small')){
            if(classContains(this, 'small')){

                manageClass($waBadge, 'fade-in', true);
                manageClass($waBadge, 'fade-out');
            // } else if(this.classList.contains('wa-large')){
            } else if(classContains(this, 'large')){

                animate("-105", "-519", function() {
    
                    manageClass($waSurvey, 'large', true);
                    manageClass($waSurvey, 'small');
                    manageClass($waBadge, 'fade-out');
                });
            }
        });

        addListener($waSurvey, 'click', function(){

            manageClass($waSurvey, 'animate');

            animate("57", "0", function() {
    
                manageClass($waSurvey, 'small', true);
                manageClass($waSurvey, 'animate', true);
                manageClass($waSurvey, 'large');
            });
        });
    });

})(new window.WATO());
