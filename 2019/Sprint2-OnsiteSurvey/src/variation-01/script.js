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
                t: "c", // Type: checkbox
                q: "Für wen haben Sie heute bestellt?",
                a1: ["1", "Bekleidung oder Accessoires für mein(e) Kind(er)"],
                a2: ["2", "Bekleidung oder Accessoires für mich"],
                a3: ["3", "Bekleidung oder Accessoires für meine(n) Frau/Mann"],
                a4: ["4", "Für mein Zuhause (Artikel wie Decken, Pflegemittel, Badtextilien, Bettwäsche etc.)"],
                a5: ["5", "Für andere (Geschenke & Gutschein)"],
            },
            q2: {
                c: 2,
                t: "r", // Type: radio
                q: "Wie sind Sie ursprünglich auf Hessnatur aufmerksam geworden?",
                a1: ["1", "Mir wurde Hessnatur von anderen empfohlen."],
                a2: ["2", "Hessnatur kenne ich schon lange. So genau kann ich es nicht sagen, woher ich es kenne."],
                a3: ["3", "Ich habe Werbung für Hessnatur im Internet oder in einer App gesehen."],
                a4: ["4", "Hessnatur kenne ich über Social Media."],
                a5: ["5", "Ich kenne Hessnatur von einem Flyer, einem Plakat oder aus einer Zeitschrift."],
                a6: ["6", "Ich habe Hessnatur durch eine Google-Anfrage gefunden."],
                a7: ["7", "Ich bin über einen Katalog aufmerksam geworden."],
                a8: ["8", "Ich war bereits in einem Hessnatur-Geschäft."],
                a9: ["9", "Sonstiges:"]
            },
            q3: {
                c: 3,
                t: "c", // Type: checkbox
                q: "Warum kaufen Sie bei Hessnatur?",
                a1: ["1", "Die Bio-Qualität der Textilien ist mir wichtig und Teil meines bewussten Lebensstils."],
                a2: ["2", "Ich möchte einen Beitrag zu einem fairen Umgang mit den Produzenten leisten."],
                a3: ["3", "Die ökologische Herstellung ist für mich ausschlaggebend."],
                a4: ["4", "Die Mode bei Hessnatur spricht mich an."],
                a4: ["5", "Ich finde es gut, dass Hessnatur ein lokales Unternehmen ist."]
            },
            q4: {
                c: 4,
                t: "r", // Type: radio
                q: "An Ihrem Beruf und Ihrem Arbeitsplatz ist Ihnen besonders wichtig…",
                a1: ["d", "Verantwortung zu haben und Karriere zu machen"],
                a2: ["s", "Spaß und Abwechslung zu haben und neue Erfahrungen zu sammeln"],
                a3: ["h", "mit netten Kolleginnen und Kollegen zusammen zu arbeiten"],
                a4: ["b", "einen sicheren Arbeitsplatz zu haben"]
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
                        '<i>Wählen Sie bitte die Antwort, die am ehesten auf Sie zutrifft.</i>'+
                        '<b>Frage '+questionCount+': '+questJson.q+'</b>'+
                        '<div class="kk_interactions '+(questJson.t === "r" ? "kk_radios":"kk_checks")+'">'+
                            '<div data-type='+questJson.a1[0]+'>'+questJson.a1[1]+'</div>'+
                            '<div data-type='+questJson.a2[0]+'>'+questJson.a2[1]+'</div>'+
                            '<div data-type='+questJson.a3[0]+'>'+questJson.a3[1]+'</div>'+
                            '<div data-type='+questJson.a4[0]+'>'+questJson.a4[1]+'</div>'+
                        '</div>'+
                        '<button class="button">Weiter</button>'+
                        '<span class="form-error">Bitte wählen Sie eine Antwort aus.</span>'+
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
                var thisSlide = slides[i],
                    answers = WATO.qsa(".kk_interactions > div", thisSlide);

                // Weiter
                WATO.qs(".button", thisSlide).addEventListener('click', function(){

                    var clickedSlider = this.parentNode;

                    if(WATO.qs(".kk_active", clickedSlider) || clickedSlider.classList.contains("kk_firstslide")){

                        clickedSlider.classList.remove("kk_error");

                        slideLeft = slideLeft + 956;
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
                    }else{
                        console.log("error");
                        clickedSlider.classList.add("kk_error");
                    }
                });

                // Anworten
                for (var j = 0; j < answers.length; j++) {
                    var thisAnswer = answers[j];

                    if(thisAnswer.parentNode.classList.contains("kk_radios")){

                        thisAnswer.addEventListener('click', function(){

                            var newActive = WATO.qs(".kk_active", this.parentNode);
                            if(newActive){
                                newActive.classList.remove("kk_active");
                            }
                            this.classList.add("kk_active");
                        });

                    }else{

                        thisAnswer.addEventListener('click', function(){

                            console.log('this: ', this);
                            if(this.classList.contains("kk_active")){
                                this.classList.remove("kk_active");
                            }else{
                                this.classList.add("kk_active");
                            }

                        });

                    }
                    
                }
                
            }

        }
    });

})(new window.WATO());