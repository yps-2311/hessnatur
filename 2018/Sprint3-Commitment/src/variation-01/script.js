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

        function showLayer() {

            manageClass($waSurvey, 'hide');
            manageClass($waLayerBG, 'show');
            manageClass($waLayer, 'show');
        }

        function hideLayer() {

            manageClass($waLayerBG, 'show', true);
            manageClass($waLayer, 'show', true);
        }

        smoBoxContainer[0].insertAdjacentHTML('afterend', 
            '<div id="wa-survey" class="wa-small wa-first">' + 
                '<div id="wa-pulse" class="wa-animated">1</div>' +
                '<div id="wa-badge" class="wa-animated"></div>' +
                '<div id="wa-wrapper">' + 
                    '<h1>Hier</h1>' +
                    '<button type="button">klick</button>' +
                '</div>' +
            '</div>' +
            '<div id="wa-layer-bg"></div>' +
            '<div id="wa-layer">' + 
                '<div id="wa-layer-close">X</div>' +
            '</div>'
        );

        var $waSurvey         = WATO.qs('#wa-survey'),
            $waSurveyPulse    = WATO.qs('#wa-pulse', $waSurvey),
            $waSurveyBadge    = WATO.qs('#wa-badge', $waSurvey),
            $waSurveyButton   = WATO.qs('#wa-wrapper button', $waSurvey),
            $waLayerBG        = WATO.qs('#wa-layer-bg'),
            $waLayer          = WATO.qs('#wa-layer'),
            $waLayerClose      = WATO.qs('#wa-layer-close');

        // set pulse animation after 1500ms
        window.setTimeout(function(){

            manageClass($waSurveyPulse, 'pulse');
        }, 1500);

        /**
         * SURVERY EVENTS
         */
        // survery mouseover
        // addListener($waSurvey, 'mouseover', function(){

        //     // remove class wa-first, hide wa-pulse element
        //     manageClass($waSurvey, 'first', true);

        //     // if(this.classList.contains('wa-small')){
        //     if(classContains(this, 'small')){

        //         manageClass($waSurveyBadge, 'fade-out', true);
        //         manageClass($waSurveyBadge, 'fade-in');
        //     }
        // });

        // // survery mouseout
        // addListener($waSurvey, 'mouseout', function(){

        //     // if(this.classList.contains('wa-small')){
        //     if(classContains(this, 'small')){

        //         manageClass($waSurveyBadge, 'fade-in', true);
        //         manageClass($waSurveyBadge, 'fade-out');
        //     // } else if(this.classList.contains('wa-large')){
        //     } else if(classContains(this, 'large')){

        //         animate("-105", "-519", function() {
    
        //             manageClass($waSurvey, 'large', true);
        //             manageClass($waSurvey, 'small');
        //             manageClass($waSurveyBadge, 'fade-out');
        //         });
        //     }
        // });

        // addListener($waSurvey, 'click', function(){

        //     manageClass($waSurvey, 'animate');

        //     animate("57", "0", function() {
    
        //         manageClass($waSurvey, 'small', true);
        //         manageClass($waSurvey, 'animate', true);
        //         manageClass($waSurvey, 'large');
        //     });
        // });

        /**
         * LAYER EVENTS
         */
        // window.onscroll = function(){
        //     var top  = window.pageYOffset || document.documentElement.scrollTop
        // };

        addListener($waSurveyButton, 'click', function(){

            showLayer();
        });

        addListener($waLayerBG, 'click', function(){

            hideLayer();
        });

        addListener($waLayerClose, 'click', function(){

            hideLayer();
        });

    });

})(new window.WATO());
