// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    console.log("hallo1");

    var slideLeft = 0,
        stepNow = 1,
        lastPersonaSegment = "",
        alreadyParticipatedSurvey = false,
        questions = {
            q1: {
                c: 1,
                t: "c", // Type: checkbox
                q: "Für wen haben Sie heute bestellt?",
                a1: [1, "Bekleidung oder Accessoires für mein(e) Kind(er)"],
                a2: [2, "Bekleidung oder Accessoires für mich"],
                a3: [3, "Bekleidung oder Accessoires für meine/n Frau/Mann"],
                a4: [4, "Für mein Zuhause (Artikel wie Decken, Pflegemittel, Badtextilien, Bettwäsche etc.)"],
                a5: [5, "Für andere (Geschenke & Gutschein)"],
                h: 561
            },
            q2: {
                c: 2,
                t: "r", // Type: radio
                q: "Wie sind Sie ursprünglich auf Hessnatur aufmerksam geworden?",
                a1: [1, "Mir wurde Hessnatur von anderen empfohlen."],
                a2: [2, "Hessnatur kenne ich schon lange. So genau kann ich es nicht sagen, woher ich es kenne."],
                a3: [3, "Ich habe Werbung für Hessnatur im Internet oder in einer App gesehen."],
                a4: [4, "Hessnatur kenne ich über Social Media."],
                a5: [5, "Ich kenne Hessnatur von einem Flyer, einem Plakat oder aus einer Zeitschrift."],
                a6: [6, "Ich habe Hessnatur durch eine Google-Anfrage gefunden."],
                a7: [7, "Ich bin über einen Katalog aufmerksam geworden."],
                a8: [8, "Ich war bereits in einem Hessnatur-Geschäft."],
                a9: [9, 'Sonstiges: <input class="kk_input" type="text" value="">'],
                h: 696
            },
            q3: {
                c: 3,
                t: "c", // Type: checkbox
                q: "Warum kaufen Sie bei Hessnatur?",
                a1: [1, "Die Bio-Qualität der Textilien ist mir wichtig und Teil meines bewussten Lebensstils."],
                a2: [2, "Ich möchte einen Beitrag zu einem fairen Umgang mit den Produzenten leisten."],
                a3: [3, "Die ökologische Herstellung ist für mich ausschlaggebend."],
                a4: [4, "Die Mode bei Hessnatur spricht mich an."],
                a5: [5, "Ich finde es gut, dass Hessnatur ein lokales Unternehmen ist."],
                h: 561
            },
            q4: {
                c: 4,
                t: "r", // Type: radio
                z: "Wir haben noch 7 weitere Fragen, um Sie besser kennen zu lernen. Die Fragen entspringen einem Fragebogen aus der Wissenschaft und können uns helfen, Ihre Interessen und Erwartungen besser zu verstehen. Damit helfen Sie uns, Ihr Kauferlebnis noch besser zu machen.",
                q: "An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig…",
                a1: ["d", "Verantwortung zu haben und Karriere zu machen"],
                a2: ["s", "Spaß und Abwechslung zu haben und neue Erfahrungen zu sammeln"],
                a3: ["h", "mit netten Kolleginnen und Kollegen zusammen zu arbeiten"],
                a4: ["b", "einen sicheren Arbeitsplatz zu haben"],
                h: 620
            },
            q5: {
                c: 5,
                t: "r", // Type: radio
                q: "Stellen Sie sich vor, Sie haben im Lotto gewonnen und bauen ein neues Haus. Was wäre Ihnen dabei besonders wichtig?",
                a1: ["s", "Es sollte sich durch eine innovative Architektur vom Standard abheben"],
                a2: ["h", "Es sollte gemütlich und wohnlich sein"],
                a3: ["d", "Es sollte repräsentativ sein"],
                a4: ["b", "Es sollte wertbeständig und vernünftig gebaut sein"]
            },
            q6: {
                c: 6,
                t: "r", // Type: radio
                q: "Im Folgenden sind verschiedene Begriffsgruppen genannt. Bitte wählen Sie diejenige Gruppe aus, die Ihnen ganz spontan am ehesten zusagt und Ihrem Leben am meisten entspricht.",
                a1: ["h", "Harmonie, Geborgenheit, Fürsorge, Ruhe"],
                a2: ["s", "Spaß, Spontaneität, Neugier, Abenteuer"],
                a3: ["b", "Fleiß, Sicherheit, Zuverlässigkeit, Ordnung"],
                a4: ["d", "Leistung, Erfolg, Zielstrebigkeit, Effizienz "]
            },
            q7: {
                c: 7,
                t: "r", // Type: radio
                q: "Wichtige Entscheidungen treffen Sie meist…",
                a1: ["s", "spontan."],
                a2: ["h", "nach meinem Gefühl."],
                a3: ["d", "sofort nach einer Analyse der Situation."],
                a4: ["b", "mit Vorsicht und längerem Abwägen."]
            },
            q8: {
                c: 8,
                t: "r", // Type: radio
                q: "Stellen Sie sich vor, Sie kommen mit verschiedenen unbekannten Menschen ins Gespräch. Welche Eigenschaft hat die Person, mit der Sie sich am besten verstehen und mit der Sie sich eine Freundschaft vorstellen könnten?",
                a1: ["d", "Tatkraft und Durchhaltevermögen"],
                a2: ["h", "Herzlichkeit und Wärme"],
                a3: ["b", "Zuverlässigkeit und Beständigkeit"],
                a4: ["s", "Gute Laune, Witz und Humor"]
            },
            q9: {
                c: 9,
                t: "r", // Type: radio
                q: "In Ihrem Urlaubshotel werden verschiedene Freizeitveranstaltungen angeboten. Für welche entscheiden Sie sich?",
                a1: ["h", "Wellness und Massage"],
                a2: ["d", "Weinprobe mit exklusiven Weinen"],
                a3: ["b", "Das Animationsprogramm des Hotels"],
                a4: ["s", "Eine geführte Kletter-Tour"]
            },
            q10: {
                c: 10,
                t: "r", // Type: radio
                q: "Letzte Frage: Wie würden Sie Ihren bevorzugten Modestil beschreiben…",
                a1: ["b", "lege keinen Wert auf Mode"],
                a2: ["h", "bequem"],
                a3: ["s", "unkonventionell und kreativ"],
                a4: ["d", "klassisch modern"]
            }
        },
        personaAnswers = [];

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    function createAnswers(questJson, haveToShuffle){
        // var tempHTML = "";
        var tempArray = [],
            OthersAnswer = questJson.a9;

        for (var j = 1; j < 9; j++) {
            var thisAnswer = questJson["a"+j];

            if(typeof thisAnswer !== "undefined"){
                tempArray.push('<div data-type='+thisAnswer[0]+'>'+thisAnswer[1]+'</div>');
                // tempHTML += '<div data-type='+thisAnswer[0]+'>'+thisAnswer[1]+'</div>'
            } else {
                break;
            }
        }

        if(haveToShuffle){
            // Wenn die Reihenfolge gewürfelt sein soll
            shuffleArray(tempArray);
        }

        // Sonderfall Sonstiges
        if(OthersAnswer){
            tempArray.push('<div data-type='+OthersAnswer[0]+'>'+OthersAnswer[1]+'</div>');
        }

        return tempArray.join('');
    }

    function getQuestHTML(id){
        try {
            var questJson = questions[id],
                questionCount = questJson.c,
                questionAddon = questJson.z;
            
            return  '<div data-count="'+questionCount+'" data-height="'+(questJson.h || 0)+'">'+
                        (
                            questionCount === 1 ?
                            '<h3 class="kk_h3">Wunderbar, danke!</h3>'
                            :''
                        )+
                        '<i>Wählen Sie bitte die Antwort, die am ehesten auf Sie zutrifft.</i>'+
                        (
                            questionAddon ?
                            '<p>'+questionAddon+'</p>' : ''
                        )+  
                        '<b>Frage '+questionCount+': '+questJson.q+'</b>'+
                        '<div class="kk_interactions '+(questJson.t === "r" ? "kk_radios":"kk_checks")+'">'+
                            createAnswers(questJson, questionCount <= 3)+
                        '</div>'+
                        '<button class="button">Weiter</button>'+
                        '<span class="form-error">Bitte wählen Sie eine Antwort aus.</span>'+
                    '</div>';

        } catch (error) {
            console.log(error);
            return '';
        }
    }
    function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

    function goal(name, text) {
        window.iridion.push(['goal', name, text]);
    }

    function clickToActiveRadiobuttons(thisElement) {
        var thisTarget = thisElement.target,
            newActive = WATO.qs(".kk_active", thisTarget.parentNode.parentNode);
        if(newActive){
            newActive.classList.remove("kk_active");
        }
        if(!thisTarget.classList.contains("kk_input")){
            thisTarget.classList.add("kk_active");
        }else{
            thisTarget.parentNode.classList.add("kk_active");
        }
        
    }
    function clickToActiveCheckpoints(thisElement) {
        var thisTarget = thisElement.target;
        if(thisTarget.classList.contains("kk_active")){
            thisTarget.classList.remove("kk_active");
        }else{
            thisTarget.classList.add("kk_active");
        }
    }


    WATO.elem('section.js_backstopWrapper', function(wrapper){
        if(wrapper){
            wrapper = wrapper[0];
            wrapper.insertAdjacentHTML('afterbegin', 
                '<div class="row">'+
                    '<div class="kk_survey">'+ // column small-8 small-offset-2 
                        '<div class="kk_progress">'+
                            '<div class="kk_step">'+
                                'Frage <span>1</span>/10'+
                            '</div>'+
                            '<div class="kk_bar">'+
                                '<span></span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="kk_sliderborder">'+
                            '<div class="kk_slider">'+
                                (
                                    alreadyParticipatedSurvey ?
                                        '<div class="kk_lastslide">'+
                                            '<div>'+
                                                '<h3>Sie haben bereits an dieser Umfrage teilgenommen</h3>'+
                                                '<p>Mit Ihren Angaben haben Sie uns geholfen, uns zu verbessern und weiter zu entwickeln.</p>'+
                                            '</div>'+
                                        '</div>'
                                    :
                                    '<div class="kk_firstslide">'+
                                        '<h3>Haben Sie noch 3 Minuten Zeit?</h3>'+
                                        '<b>Wir würden Sie gerne näher kennen lernen.</b>'+
                                        '<p>Wenn Sie uns 10 schnelle Fragen beantworten, helfen Sie uns, besser zu werden.</p>'+
                                        '<button class="button">Ok, zeigen Sie mir die Fragen</button>'+
                                    '</div>'+
                                    getQuestHTML("q1")+
                                    getQuestHTML("q2")+
                                    getQuestHTML("q3")+
                                    getQuestHTML("q4")+
                                    getQuestHTML("q5")+
                                    getQuestHTML("q6")+
                                    getQuestHTML("q7")+
                                    getQuestHTML("q8")+
                                    getQuestHTML("q9")+
                                    getQuestHTML("q10")+
                                    '<div class="kk_lastslide">'+
                                        '<div>'+
                                            '<h3>Vielen Dank für Ihre Teilnahme!</h3>'+
                                            '<p>Mit Ihren Angaben helfen Sie uns, uns stetig zu verbessern und weiter zu entwickeln.</p>'+
                                        '</div>'+
                                    '</div>'
                                )+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );

            var slides = WATO.qsa(".kk_slider > div", wrapper),
                slideWrapper = slides[0].parentNode,
                slidesWidthTemp = WATO.qs(".kk_sliderborder", wrapper).offsetWidth - 40,
                slidesWidth = slidesWidthTemp > 956 ? 956 : slidesWidthTemp,
                nowContinue = true,
                thisBtn = function(){

                    if(nowContinue){

                        var clickedSlider = this.parentNode,
                        thisSliderHeight = clickedSlider.nextElementSibling.getAttribute("data-height");
                        
                        if(WATO.qs(".kk_active", clickedSlider) || clickedSlider.classList.contains("kk_firstslide")){

                            clickedSlider.classList.remove("kk_error");
                            
                            slideLeft = slideLeft + slidesWidth; // 956
                            slideWrapper.style.left = "-" + slideLeft + "px";
        
                            var progress = WATO.qs(".kk_progress", wrapper),
                                allActiveAnswers = WATO.qsa(".kk_active", clickedSlider);
        
                            // Die Progressbar einblenden,
                            // bzw. ausblenden für Startscreen und Dankescreen
                            if(stepNow > 1 && stepNow < 11){
                                progress.style.opacity = 1;

                                // Progressfortschritt
                                if(progress){
                                    WATO.qs(".kk_step span", progress).innerHTML = stepNow;
                                    WATO.qs(".kk_bar span", progress).style.width = (stepNow*10)+'%';
                                }
                            }else{
                                progress.style.opacity = 0;
                            }

                            if(thisSliderHeight && parseInt(thisSliderHeight) > 0){
                                var thisHeight = parseInt(thisSliderHeight);

                                clickedSlider.parentNode.parentNode.style.height = (thisHeight + (slidesWidth < 950 ? 150 : 0)) + "px";
                            }else{
                                clickedSlider.parentNode.parentNode.style.height = "535px";
                            }


                            var answersTypes = [];

                            for (var l = 0; l < allActiveAnswers.length; l++) {
                                var thisType = allActiveAnswers[l].getAttribute("data-type");
                                if(parseInt(thisType) > 0){
                                    // Eine Allgemeine Frage
                                    answersTypes.push(thisType);
                                }else{
                                    // Eine Persona Frage
                                    answersTypes = thisType;
                                    personaAnswers.push(thisType);
                                    
                                    break;
                                }
                            }
                            
                            if(answersTypes.length > 0){
                                console.log("---------");
                                console.log("Antwort: ", clickedSlider.getAttribute("data-count"));
                                console.log('answersTypes: ', answersTypes);
                                // console.log('personaAnswers: ', personaAnswers);
                                
                                var personaNow = [
                                    // NAME, MENGE, SEGMENT-ID
                                    ["stimulanz", 0, 32791],
                                    ["dominanz", 0, 32792],
                                    ["hedonist", 0, 32793],
                                    ["balance", 0, 32794]
                                ];
                                
                                for (var m = 0; m < personaAnswers.length; m++) {
                                    switch (personaAnswers[m]) {
                                        case "s":
                                            personaNow[0][1]++;
                                            break;
                                        case "d":
                                            personaNow[1][1]++;
                                            break;
                                        case "h":
                                            personaNow[2][1]++;
                                            break;
                                        case "b":
                                            personaNow[3][1]++;
                                            break;
                                    }
                                }
                                // console.log('personaNow: ', personaNow);
                                personaNow.sort(sortFunction);
                                console.log('personaNow: ', personaNow);

                                console.log('personaNow[3][1]: ', personaNow[3][1]);

                                // Mindestens eine personaspezifische Frage wurde beantwortet
                                if(personaNow[3][1] > 0){

                                    if(personaNow[2][1] !== personaNow[3][1]){

                                        var thisPersonaID = personaNow[3][2];
                                        console.log('Persona: ', personaNow[3][0]);
        
                                        // Wenn das Segment mit dem zuletzt gesetzten nicht übereinstimmt
                                        console.log('lastPersonaSegment !== thisPersonaID: ', lastPersonaSegment !== thisPersonaID);
                                        if(lastPersonaSegment !== thisPersonaID){
        
                                            // wird das letzte Segment gelöscht
                                            if(lastPersonaSegment !== ""){
                                                window.iridion.push(['removeSegment', String(lastPersonaSegment)]);
                                            }
            
                                            // und ein Neues gesetzt
                                            window.iridion.push(['segment', String(thisPersonaID)]);
        
                                            // Zum merken des zuletzt gesetzten wird es in die Variable gespeichert
                                            lastPersonaSegment = thisPersonaID;
                                        }

                                        goal("currentPersona", personaNow[3][0]);

                                    }else{
                                        // Wenn mehrere Personas gleich ausgeprägt sind wird indifferent geschickt

                                        if(lastPersonaSegment !== ""){
                                            window.iridion.push(['removeSegment', String(lastPersonaSegment)]);
                                        }

                                        window.iridion.push(['segment', '32796']);

                                        goal("currentPersona", 'indifferent');
                                    }
                                }
                                console.log('lastPersonaSegment: ', lastPersonaSegment);
                                
                                if(answersTypes[0] === "9"){
                                    answersTypes[0] = '9 '+encodeURI(WATO.qs(".kk_input", wrapper).value);
                                    console.log('encodeURI(WATO.qs(".kk_input", wrapper).value): ', encodeURI(WATO.qs(".kk_input", wrapper).value));
                                }
                                
                                // window.iridion.push(['goal', 'question'+clickedSlider.getAttribute("data-count"), answersTypes]);
                                goal('question'+clickedSlider.getAttribute("data-count"), answersTypes);

                                console.log("---------");
                            }

                            stepNow++;

                        }else{
                            console.log("error");
                            clickedSlider.classList.add("kk_error");
                        }

                        nowContinue = false;
                    }else{
                        setTimeout(function(){
                            nowContinue = true;
                        }, 1000);
                    }
                };

            for (var i = 0; i < slides.length; i++) {
                var thisSlide = slides[i],
                    answers = WATO.qsa(".kk_interactions > div", thisSlide),
                    continueBtn = WATO.qs(".button", thisSlide);

                // Jede Antwort wird auf eine feste Breite angepasst
                thisSlide.style.width = slidesWidth + "px";

                // Weiter
                if(continueBtn){
                    continueBtn.addEventListener('click', thisBtn);
                }

                // Anworten
                for (var j = 0; j < answers.length; j++) {
                    var thisAnswer = answers[j];

                    if(thisAnswer.parentNode.classList.contains("kk_radios")){
                        // Radiobuttons
                        thisAnswer.addEventListener('click', clickToActiveRadiobuttons);
                    }else{
                        // Checkpoints
                        thisAnswer.addEventListener('click', clickToActiveCheckpoints);

                    }
                }
            }
        }
    });

})(new window.WATO());