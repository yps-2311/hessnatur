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

    var slideLeft = 0,
        stepNow = 1,
        questions = {
            q1: {
                c: 1,
                q: "An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig…",
                a1: ["d", "Verantwortung zu haben und Karriere zu machen"],
                a2: ["s", "Spaß und Abwechslung zu haben und neue Erfahrungen zu sammeln"],
                a3: ["h", "mit netten Kolleginnen und Kollegen zusammen zu arbeiten"],
                a4: ["b", "einen sicheren Arbeitsplatz zu haben"]
            },
            q2: {
                c: 2,
                q: "Stellen Sie sich vor, Sie haben im Lotto gewonnen und bauen ein neues Haus. Was wäre Ihnen dabei besonders wichtig?",
                a1: ["s", "Es sollte sich durch eine innovative Architektur vom Standard abheben"],
                a2: ["h", "Es sollte gemütlich und wohnlich sein"],
                a3: ["d", "Es sollte repräsentativ sein"],
                a4: ["b", "Es sollte wertbeständig und vernünftig gebaut sein"]
            },
            q3: {
                c: 3,
                q: "Im Folgenden sind verschiedene Begriffsgruppen genannt. Bitte wählen Sie diejenige Gruppe aus, die Ihnen ganz spontan am ehesten zusagt und Ihrem Leben am meisten entspricht.",
                a1: ["h", "Harmonie, Geborgenheit, Fürsorge, Ruhe"],
                a2: ["s", "Spaß, Spontaneität, Neugier, Abenteuer"],
                a3: ["b", "Fleiß, Sicherheit, Zuverlässigkeit, Ordnung"],
                a4: ["d", "Leistung, Erfolg, Zielstrebigkeit, Effizienz "]
            },
            q4: {
                c: 4,
                q: "Wichtige Entscheidungen treffen Sie meist…",
                a1: ["s", "spontan."],
                a2: ["h", "nach meinem Gefühl."],
                a3: ["d", "sofort nach einer Analyse der Situation."],
                a4: ["b", "mit Vorsicht und längerem Abwägen."]
            }
        };

    function getQuestHTML(id){
        try {
            var questJson = questions[id],
                questionCount = questJson.c;            
            
            return  '<div data-count="'+questionCount+'">'+
                        (
                            questionCount === 1 ?
                            '<h3 class="kk_h3">Wunderbar, danke!</h3>'
                            :''
                        )+
                        '<i>'+questJson.q+'</i>'+
                        '<b>Frage '+questionCount+': An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig …</b>'+
                        '<div class="kk_radios">'+
                            '<div>'+questJson.a1[1]+'</div>'+
                            '<div>'+questJson.a2[1]+'</div>'+
                            '<div>'+questJson.a3[1]+'</div>'+
                            '<div>'+questJson.a4[1]+'</div>'+
                        '</div>'+
                        '<button class="button">Weiter</button>'+
                    '</div>';

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    WATO.elem('.loginWrapper', function(wrapper){
        if(wrapper){
            wrapper[0].insertAdjacentHTML('afterend', 
                '<div class="row">'+
                    '<div class="column small-8 small-offset-2 kk_survey">'+
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
                                // getQuestHTML("q5")+
                                // getQuestHTML("q6")+
                                // getQuestHTML("q7")+

                                // '<div>'+
                                //     '<h3>Wunderbar, danke!</h3>'+
                                //     '<i>Wählen Sie bitte die Antwort, die am ehesten auf Sie zutrifft.</i>'+
                                //     '<b>Frage 1: An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig …</b>'+
                                //     '<button class="button">Weiter</button>'+
                                // '</div>'+
                                // '<div>'+
                                //     '<h3>Wunderbar, danke!</h3>'+
                                //     '<i>Wählen Sie bitte die Antwort, die am ehesten auf Sie zutrifft.</i>'+
                                //     '<b>Frage 2: An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig …</b>'+
                                //     '<button class="button">Weiter</button>'+
                                // '</div>'+
                                // '<div>'+
                                //     '<h3>Wunderbar, danke!</h3>'+
                                //     '<i>Wählen Sie bitte die Antwort, die am ehesten auf Sie zutrifft.</i>'+
                                //     '<b>Frage 3: An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig …</b>'+
                                //     '<button class="button">Weiter</button>'+
                                // '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );

            var slides = WATO.qsa(".kk_slider > div"),
                slideWrapper = slides[0].parentNode;

            for (var i = 0; i < slides.length; i++) {
                var thisSlide = slides[i];

                WATO.qs(".button", thisSlide).addEventListener('click', function(){

                    slideLeft = slideLeft + 850;
                    slideWrapper.style.left = "-"+slideLeft+"px";

                    var progress = WATO.qs(".kk_progress");

                    if(stepNow > 1){
                        progress.style.opacity = 1;
                    }

                    if(progress){
                        WATO.qs(".kk_step span", progress).innerHTML = stepNow;
                        WATO.qs(".kk_bar span", progress).style.width = (stepNow*10)+'%';
                    }

                    stepNow++;
                });
                
            }



        }
    });

})(new window.WATO());