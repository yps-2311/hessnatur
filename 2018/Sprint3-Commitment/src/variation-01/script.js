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

    console.log("DA!");

    // INIT MUTATION OBSERVER
    // WATO.initObserver(function(error){
    //     console.log(error);
    // });

    // FIND ELEMENT
    WATO.elem('.smoBoxContainer', function(smoBoxContainer){

        function pushGoal(key) {

            if(goalsSend.indexOf(key) === -1){

                goalsSend.push(key);

                /**
                 * START QS
                 */
                WATO.qs('#wa-goals > li:last-child').insertAdjacentHTML('afterend', '<li style="list-style:none;">goal - ' + 's3_' + key + '</li>');
                console.log("pushGoal: " + key);
                /**
                 * END QS
                 */
    
                window.iridion.push(['goal', 's3_' + key]);
            }
        }

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
            }, 750);

            jQuery("#wa-survey").animate({
                right: survey,
            }, 750, function() {

                callback();
            });
        }

        function showLayer(content) {

            content = parseInt(content);

            // setStorage(false);
            setStorage('finished');

            var html            = '',
                headlineIndex   = content,
                segment         = false;

            if(content === 0){
                
                segment = 32774;
            } else if(content === 1) {

                segment = 32775;
            } else if(content === 2) {

                segment = 32776;

                // redirect to content
                content = 1;
                headlineIndex = 2;
            }

            manageClass($waSurvey, 'hide');
            manageClass($waLayerBG, 'show');
            manageClass($waLayer, 'fade-in');

            WATO.qs('h3', $waLayer).innerHTML = headlines[headlineIndex][0];
            WATO.qs('p', $waLayer).innerHTML = headlines[headlineIndex][1];

            for(var i = 0; i < 3; i++){
    
                html += '<div class="wa-uvp wa-animated wa-icon-' + uvps[content][i][0] + '">' + 
                    '<h3>' + uvps[content][i][1] + '</h3>' +
                    '<p>' + uvps[content][i][2] + '</p>' +
                '</div>';
            }

            $waLayerUVPs.innerHTML = html;

            if(segment){
                
                WATO.qs('#wa-goals > li:last-child').insertAdjacentHTML('afterend', '<li style="list-style:none;">segment - 32777</li>');
                WATO.qs('#wa-goals > li:last-child').insertAdjacentHTML('afterend', '<li style="list-style:none;">segment - ' + segment + '</li>');
                console.log("pushSegment: 32777");
                console.log("pushSegment: " + segment);

                window.iridion.push(['segment', '32777']);
                window.iridion.push(['segment', segment]);
            }

            window.setTimeout(function(){

                manageClass(WATO.qs('.wa-uvp:nth-child(1)'), 'fade-in');

                window.setTimeout(function(){

                    manageClass(WATO.qs('.wa-uvp:nth-child(2)'), 'fade-in');

                    window.setTimeout(function(){
                    
                        pushGoal('uvps_open');

                        manageClass(WATO.qs('.wa-uvp:nth-child(3)'), 'fade-in');
                    }, 500);
                }, 500);
            }, 500);
        }

        function hideLayer() {

            pushGoal('uvps_closed');

            manageClass($waLayerBG, 'show', true);
            manageClass($waLayerBG, 'fade-out');
            manageClass($waLayer, 'fade-in', true);
            manageClass($waLayer, 'fade-out');
        }

        function preload(images) {

            var temp = [];

            for (i = 0; i < images.length; i++) {

                temp[i] = new Image();
                temp[i].src = path + images[i] + '.png';
            }
        }

        function getStorage() {

            return window.localStorage.getItem('wa-survey');
        }

        function setStorage(value) {

            if(getStorage() !== 'finished'){

                window.localStorage.setItem('wa-survey', value);
            }
        }


        /**
         * START - ONLY FOR QS - START
         */
        smoBoxContainer[0].insertAdjacentHTML('afterend', 
            '<div id="wa-qs" style="border:1px solid black;padding:15px;position:fixed;top:15px;left:15px;z-index:99999999;background:#fff;">' +
                '<div id="wa-reset" style="cursor:pointer;text-align:center;line-height:25px;font-weight:bold;padding:0 15px;height:25px;background:red;color:#fff;">QS: Reset Layer</div>' +
                '<hr/>' +
                '<ul id="wa-goals" style="margin:0;"><li style="font-weight:bold;list-style:none;">Goals</li></ul>' +
            '</div>'
        );

        WATO.qs('#wa-reset').addEventListener('click', function(){

            window.localStorage.removeItem('wa-survey');
            
            alert("Storage wurde zurückgesetzt. Reload.");

            window.location.href = window.location.href;
            window.location.reload();
        });
        /**
         * END - ONLY FOR QS - END
         */



        if(getStorage() !== 'finished'){

            smoBoxContainer[0].insertAdjacentHTML('afterend', 
                '<div id="wa-survey" class="wa-small wa-first">' + 
                    (getStorage() === 'true' ? '<div id="wa-pulse" class="wa-animated">1</div>' : '') +
                    '<div id="wa-badge" class="wa-animated"></div>' +
                    '<div id="wa-arrow"></div>' +
                    '<div id="wa-wrapper">' + 
                        '<div class="wa-show">' + 
                            '<h3>Wie wichtig ist Ihnen<br/>Nachhaltigkeit in der Mode?</h3>' +
                            '<p class="wa-hide">Wir würden uns über eine kurze Antwort freuen. Falls Sie unsicher sind, klicken Sie<br/>auf den Text unterhalb der Auswahlmöglichkeiten.<p>' +
                            '<label>' + 
                                '<span class="wa-p">weniger wichtig</span>' +
                                '<span>' +
                                '<input id="wa-1" type="radio" name="wa-question" value="1">' +
                                '<label for="wa-1"></label>' + 
                                '</span>' +
                                '<span>' +
                                    '<input id="wa-2" type="radio" name="wa-question" value="2">' +
                                    '<label for="wa-2"></label>' + 
                                '</span>' +
                                '<span>' +
                                    '<input id="wa-3" type="radio" name="wa-question" value="3">' +
                                    '<label for="wa-3"></label>' + 
                                '</span>' +
                                '<span>' +
                                    '<input id="wa-4" type="radio" name="wa-question" value="4">' +
                                    '<label for="wa-4"></label>' + 
                                '</span>' +
                                '<span class="wa-p">sehr wichtig</span>' +
                            '</label>' +
                            '<div id="wa-link">' +
                                '<a href="javascript:void(0);">Ich weiß nicht, was Nachhaltigkeit<br/>in der Mode bedeutet</a>' +
                            '</div>' +
                            '<button data-target="next" type="button">Antwort absenden</button>' +
                        '</div>' +
                        // '<div class="wa-hide">' + 
                        //     '<h3>Ist Ihnen Nachhaltigkeit<br/>in der Mode wichtig?</h3>' +
                        //     '<button data-target="yes" type="button">Ja</button>' +
                        //     '<button data-target="no" type="button">Nein</button>' +
                        //     '<a href="javascript:void(0);">Ich weiß nicht, was Nachhaltigkeit<br/>in der Mode bedeutet</a>' +
                        // '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="wa-layer-bg"></div>' +
                '<div id="wa-layer" class="wa-animated">' + 
                    '<div id="wa-layer-close"></div>' +
                    '<h3></h3>' +
                    '<p></p>' +
                    '<div id="wa-uvps"></div>' +
                '</div>'
            );

            var uvps = [
                    [
                        ["1", "Großes Sortiment an<br/>Qualitäts-Mode", "Viele Produkte aus nachhaltigen<br/>Stoffen wie Bio-Baumwolle –<br/>hochwertig verarbeitet und<br/>in zeitlosem Design."],
                        ["4", "Kostenlose<br/>Rücksendung", "Sollte Ihnen ein Produkt<br/>einmal nicht gefallen, können<br/>Sie dies jederzeit umtauschen."],
                        ["5", "Vielfältige<br/>Zahlungsarten", "Bei uns können Sie zwischen<br/>Kauf auf Rechnung, Kreditkarte<br/>oder Paypal wählen."]
                    ],
                    [
                        ["1", "Mode, die Umwelt respektiert<br/>und Ressourcen schont", "Viele Produkte aus nachhaltigen<br/>Stoffen wie Bio-Baumwolle –<br/>hochwertig verarbeitet und in<br/>zeitlosem Design."],
                        ["2", "Klimaneutraler<br/>Versand", "Aus Liebe zur Umwelt verschicken<br/>wir Ihre Lieferung klimaneutral<br/>mit DHL GoGreen."],
                        ["3", "Faire Bedingungen auch<br/>im Produktionsland", "Wir sind Vorreiter für<br/>Verbesserung der sozialen<br/>Standards in der textilen<br/>Lieferkette."]
                    ]
                ],
                headlines = [
                    ["Danke für Ihr Feedback!", "Unabhängig von der Nachhaltigkeit können Sie sich<br/>bei uns auch auf folgende Services freuen:"],
                    ["Danke für Ihr Feedback!", "Schön, dass Ihnen Nachhaltigkeit auch so wichtig ist wie uns!<br/>Bei uns sind Sie an der richtigen Stelle."],
                    ["Danke für Ihr Feedback!", "Unsere hohen Ansprüche an die Nachhaltigkeit setzen<br/>wir folgendermaßen in die Tat um:"],
                ],
                goalsSend         = [],
                path              = "https://s3-eu-west-1.amazonaws.com/webarts/Hessnatur/2018/Sprint3/wa-",
                $waSurvey         = WATO.qs('#wa-survey'),
                $waSurveyPulse    = WATO.qs('#wa-pulse', $waSurvey),
                $waSurveyBadge    = WATO.qs('#wa-badge', $waSurvey),
                $waSurveyButtons  = WATO.qsa('#wa-wrapper button', $waSurvey),
                $waLayerBG        = WATO.qs('#wa-layer-bg'),
                $waLayer          = WATO.qs('#wa-layer'),
                $waLayerClose     = WATO.qs('#wa-layer-close', $waLayer),
                $waLayerUVPs      = WATO.qs('#wa-uvps', $waLayer);

            if($waSurveyPulse){

                // set pulse animation after 1500ms
                window.setTimeout(function(){
                    
                    manageClass($waSurveyPulse, 'fade-in');
                    
                    window.setTimeout(function(){
                        
                        manageClass($waSurveyPulse, 'fade-in', true);
                        manageClass($waSurveyPulse, 'pulse');
                    }, 1500);
                }, 1500);
            }

            /**
             * SURVERY EVENTS
             */
            // survery mouseover
            addListener($waSurvey, 'mouseover', function(){

                // if(this.classList.contains('wa-small')){
                if(classContains(this, 'small')){

                    pushGoal('layer_hover');

                    manageClass($waSurveyBadge, 'fade-out', true);
                    manageClass($waSurveyBadge, 'fade-in');
                } else {

                    if(!classContains($waSurveyBadge, 'fade-in')){

                        manageClass($waSurveyBadge, 'fade-out', true);
                        manageClass($waSurveyBadge, 'fade-in');
                    }
                }
            });

            // survery mouseout
            addListener($waSurvey, 'mouseout', function(){

                if(classContains($waSurvey, 'small') && !classContains($waSurvey, 'animate')){

                    manageClass($waSurveyBadge, 'fade-in', true);
                    manageClass($waSurveyBadge, 'fade-out');
                }
            });

            // document click
            addListener(document, 'click', function(event){

                if($waSurvey.classList.contains('wa-large')){

                    if(event.target.id !== "wa-arrow"){

                        var mouseStillOverSurvey    = false,
                            elementPath             = event.path || (event.composedPath && event.composedPath());

                        for(var i = 0; i < elementPath.length; i++){ 

                            if(elementPath[i].id === 'wa-survey'){

                                mouseStillOverSurvey = true;
                                break;
                            }
                        }

                        if(mouseStillOverSurvey){

                            return false;
                        }
                    }

                    // if(this.classList.contains('wa-small')){
                    if(classContains($waSurvey, 'small')){

                        manageClass($waSurveyBadge, 'fade-in', true);
                        manageClass($waSurveyBadge, 'fade-out');
                    // } else if(this.classList.contains('wa-large')){
                    } else if(classContains($waSurvey, 'large')){

                        animate("-105", "-564", function() {
            
                            pushGoal('layer_closed');

                            manageClass($waSurvey, 'large', true);
                            manageClass($waSurvey, 'small');
                            manageClass($waSurveyBadge, 'fade-out');
                        });
                    }
                }
            });

            addListener($waSurvey, 'click', function(){

                if(!$waSurvey.classList.contains('wa-large')){

                    // remove class wa-first, hide wa-pulse element
                    manageClass($waSurvey, 'first', true);
                    manageClass($waSurvey, 'animate');
    
                    animate("52", "0", function() {
            
                        pushGoal("layer_open");
    
                        manageClass($waSurvey, 'small', true);
                        manageClass($waSurvey, 'animate', true);
                        manageClass($waSurvey, 'large');
                    });
                }
            });

            /**
             * LAYER EVENTS
             */
            for(var i = 0; i < $waSurveyButtons.length; i++){

                addListener($waSurveyButtons[i], 'click', function(){
        
                    // var event = this.getAttribute('data-target');

                    // if(event === "next"){

                    // var $view       = WATO.qs('#wa-wrapper .wa-show', $waSurvey),
                    var $radios     = WATO.qsa('input[name="wa-question"]'),        // jshint ignore:line
                        validation  = false;
                    
                    /* jshint ignore:start */
                    for(var i = 0; i < $radios.length; i++){
                        
                        if($radios[i].checked){
                            
                            if($radios[i].value === '1'){

                                showLayer(0);
                                pushGoal('layer_question_1');
                            } else if($radios[i].value === '2'){

                                showLayer(0);
                                pushGoal('layer_question_2');
                            } else if($radios[i].value === '3'){

                                showLayer(1);
                                pushGoal('layer_question_3');
                            } else if($radios[i].value === '4'){

                                showLayer(1);
                                pushGoal('layer_question_4');
                            }

                            pushGoal('layer_send');

                            validation = true;
                            break;
                        }
                    }
                    /* jshint ignore:end */

                    if(!validation){

                        pushGoal('layer_send_error');
                        manageClass(WATO.qs('#wa-wrapper', $waSurvey), 'error');
                        return false;
                    }

                        // manageClass($view, 'show', true);
                        // manageClass($view, 'hide');
                        // manageClass($view.nextElementSibling, 'hide', true);
                        // manageClass($view.nextElementSibling, 'show');
                    // } else if(event === "yes"){

                    //     showLayer(0);
                    // } else {
                        
                    //     showLayer(1);
                    // }
                });
            }

            // showLayer(1);

            var $radios = WATO.qsa('input[name="wa-question"]');        // jshint ignore:line
            
            /* jshint ignore:start */
            for(var i = 0; i < $radios.length; i++){

                addListener($radios[i], 'click', function(){
    
                    for(var i = 0; i < $radios.length; i++){

                        $radios[i].parentNode.classList.remove('wa-selected');
                    }

                    this.parentNode.classList.add('wa-selected');

                    pushGoal('layer_question');
                });
            }

            addListener(WATO.qs('#wa-link a', $waSurvey), 'click', function(){

                showLayer(2);
            });

            // addListener($waLayerBG, 'click', function(){
            //     hideLayer();
            // });

            addListener($waLayerClose, 'click', function(){

                hideLayer();
            });

            preload([
                'badge',
                'layer',
                'icon-1',
                'icon-2',
                'icon-3',
                'icon-4',
                'icon-5'
            ]);
        } else {

            console.info("Die Umfrage wird nicht länger ausgespielt!");
        }

        if(getStorage() === null){

            setStorage(true);
        }
    });
})(new window.WATO());
