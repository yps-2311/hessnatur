// load core and global js
//@codekit-prepend "../global/global.js";

//@code-kit append "request.min.js";
/**
 * @function
 * @author Christian Knoth
 * @namespace V2
 * @name Variation 02
 * @description
 */
 (function (WATO) {
    "use strict";

    window.iridion.econda.push(["PS06_restart", "V2"]);

       // response > "damen" | "herren" | "baby OR junior" | "home"
       var CATEGORY_AFFINITY = window.iridion.push(['profile', 'getValue', 'categoryAffinity']);
       var DATA = {
        "4968529": {
            "badges": [
                "vegan",
                "sale"
            ],
            "response": {}
        },
        "4887317": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "4260009": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "4968803": {
            "badges": [
                "vegan",
                "sale"
            ],
            "response": {}
        },
        "4961117": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "4623989": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "4968929": {
            "badges": [
                "vegan",
                "sale"
            ],
            "response": {}
        },
        "5129217": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "4969219": {
            "badges": [
                "vegan",
                "sale",
                "kundenfavorit"
            ],
            "response": {}
        }
    };

   
    var CATEGORIES = WATO.PS06Category(CATEGORY_AFFINITY);
       //console.log("CATEGORY_AFFINITY", CATEGORY_AFFINITY);
   
    if(CATEGORY_AFFINITY){
        if(CATEGORY_AFFINITY === "herren"){
            
        DATA = {
            "4238488": {
                "badges": [
                    "vegan",
                    "kundenfavorit"
                ],
                "response": {}
            },
            "5077317": {
                "badges": [
                    "vegan"
                ],
                "response": {}
            },
            "4538509": {
                "badges": [
                    "vegan"
                ],
                "response": {}
            },
            "4942717": {
                "badges": [
                    "vegan"
                ],
                "response": {}
            }
        };


        } else if(CATEGORY_AFFINITY === "baby"){


            DATA = {
                "4330917": {
                    "badges": [
                        "new"
                    ],
                    "response": {}
                },
                "5177323": {
                    "badges": [
                        "new"
                    ],
                    "response": {}
                },
                "5172729": {
                    "badges": [
                        "new"
                    ],
                    "response": {}
                },
                "5080785": {
                    "badges": [
                        "vegan",
                        "new"
                    ],
                    "response": {}
                },
                "5072641": {
                    "badges": [
                        "new"
                    ],
                    "response": {}
                }
            };
            
        } else if(CATEGORY_AFFINITY === "home"){

            DATA = {
                "4793626": {
                    "badges": [
                        "vegan",
                        "kundenfavorit"
                    ],
                    "response": {}
                },
                "4703915": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4904609": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "3698625": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "1842425": {
                    "badges": [
                        "vegan",
                        "kundenfavorit"
                    ],
                    "response": {}
                },
                "5066501": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                }/*,
                "5093201": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                }*/
            };               
        }
    }
   
    WATO.PS06(CATEGORY_AFFINITY, CATEGORIES, DATA, 2);

})(new window.WATO());