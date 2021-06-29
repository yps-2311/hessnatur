// load core and global js
 //@codekit-prepend "../global/global.js";

//@code-kit append "request.min.js";
/**
 * @function
 * @author Christian Knoth
 * @namespace V1
 * @name Variation 01
 * @description
 */
 (function (WATO) {
    "use strict";

    // response > "damen" | "herren" | "baby OR junior" | "home"
    var CATEGORY_AFFINITY = window.iridion.push(['profile', 'getValue', 'categoryAffinity']);
    
    var DATA = {
        "5112713": {
            "badges": [
                "sale"
            ],
            "response": {}
        },
        "5112613": {
            "badges": [
                "sale"
            ],
            "response": {}
        },
        "5095603": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "5112500": {
            "badges": [
                "sale"
            ],
            "response": {}
        },
        "5107484": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "5108911": {
            "badges": [
                "sale"
            ],
            "response": {}
        },
        "5107789": {
            "badges": [
                "vegan"
            ],
            "response": {}
        },
        "5112109": {
            "badges": [
                "sale"
            ],
            "response": {}
        }
    };

    var CATEGORIES = WATO.PS06Category(CATEGORY_AFFINITY);

    if(CATEGORY_AFFINITY){
        if(CATEGORY_AFFINITY === "herren"){

            DATA = {
                "5078917": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5071619": {
                    "badges": [
                        "sale"
                    ],
                    "response": {}
                },
                "5071411": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4945077": {
                    "badges": [
                        "sale"
                    ],
                    "response": {}
                },
                "4945017": {
                    "badges": [
                    ],
                    "response": {}
                },
                "5076421": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5071461": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                }
            };
            

        } else if(CATEGORY_AFFINITY === "baby"){

            DATA = {
                "5079636": {
                    "badges": [
                    ],
                    "response": {}
                },
                "5122919": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5080922": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5080103": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "5127901": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "5127701": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5082502": {
                    "badges": [
                    ],
                    "response": {}
                },
                "5082125": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "5127801": {
                    "badges": [
                        "vegan",
                        "sale"
                    ],
                    "response": {}
                },
                "4959322": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4979284": {
                    "badges": [
                    ],
                    "response": {}
                },
                "4915101": {
                    "badges": [
                        "sale"
                    ],
                    "response": {}
                }
            };

            
        } else if(CATEGORY_AFFINITY === "home"){

            DATA = {
                "5047621": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4903824": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "5067416": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "3428401": {
                    "badges": [
                    ],
                    "response": {}
                },
                "4894370": {
                    "badges": [
                    ],
                    "response": {}
                },
                "5066737": {
                    "badges": [
                        "sale"
                    ],
                    "response": {}
                }
            };

        }
    }

    WATO.PS06(CATEGORY_AFFINITY, CATEGORIES, DATA, 1);

})(new window.WATO());