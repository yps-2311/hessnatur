/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
/* jshint loopfunc: true */

/**
 * @function
 * @author Denis Leno
 * @namespace
 * @name
 * @description
 */
(function (WATO, window) {
    "use strict";

    function startTheTestDirectly() {
        console.log("startTheTestDirectly");
        // window.iridion.push(['run', "982809542728"]);
    }

    if (!window.localStorage.getItem("kk_vskchanged")) {

        WATO.elem(function () {
            // return typeof window.econda !== "undefined" && typeof window.econda.recengine.Request !== "undefined";
            return typeof window.emos3 !== "undefined" && typeof window.emos3.emos_vid !== "undefined";
        }, function (element) {
            if (element) {

                // Ist das gesetzt und nicht leer, dann wurde in diesem browser bereits eine Zuweisung vorgenommen, kann auch über die Iridion-profile Variable geprüft werden
                // var request = new econda.recengine.Request();
                // request.getRecommendationServiceParameters()["p.cu:abtest"];

                // fetch('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/abtest?emvid=' + window.emos3.emos_vid)
                //     // .then((response) => response.json())
                //     .then((data) => console.log(data));




                WATO.xhr_post('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/abtest?emvid=' + window.emos3.emos_vid, "", function (callback) { // new econda.recengine.Request().getRecommendationServiceParameters().emvid
                console.log('callback: ', callback);
                    try {

                        if (callback && callback["cu:abtest"]) {

                            var textAndVariationFromEcondaARP = callback["cu:abtest"].split("/");

                            console.log('textAndVariationFromEcondaARP: ', textAndVariationFromEcondaARP);

                            if (textAndVariationFromEcondaARP[0] === "982809542728") {
                                // Wurde in diesem Test bereits einer Variante zugewiesen, laut Econda ARP

                                // window.kk17_id = textAndVariationFromEcondaARP[2];
                                // window.iridion.push(['run', textAndVariationFromEcondaARP[1]]);

                            } else {
                                startTheTestDirectly();
                            }
                        } else {
                            startTheTestDirectly();
                        }
                    } catch (error) {
                        startTheTestDirectly();
                    }
                });
            }
        });
    } else {
        startTheTestDirectly();
    }

})(new window.WATO(), window);
