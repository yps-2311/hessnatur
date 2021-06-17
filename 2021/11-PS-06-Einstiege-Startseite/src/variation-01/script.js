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
                "vegan"
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

    var CATEGORIES = [
        ["Hosen", "damen/min/hosen.png","de/damen/bekleidung/hosen/c/damen-bekleidung-hosen"],
        ["Jacken & Mäntel", "damen/min/jacken_maentel.png","damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel"],
        ["Kleider", "damen/min/kleider.png","damen/bekleidung/kleider/c/damen-bekleidung-kleider"],
        ["Loungewear", "damen/min/loungewear.png","damen/bekleidung/loungewear/c/damen-bekleidung-loungewear"],
        ["Outdoor", "damen/min/outdoor.png","damen/bekleidung/outdoor/c/damen-bekleidung-outdoor"],
        ["Pullover", "damen/min/pullover.png","damen/bekleidung/pullover/c/damen-bekleidung-pullover"],
        ["Shirts & Tops", "damen/min/shirts_tops.png","damen/bekleidung/shirts-und-tops/c/damen-bekleidung-shirts-tops"]
    ];

    console.log("CATEGORY_AFFINITY", CATEGORY_AFFINITY);

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
            
            

            CATEGORIES = [
                ["Hemden", "herren/min/hemden.png","herren/bekleidung/hemden/c/herren-bekleidung-hemden"],
                ["Jeans & Hosen", "herren/min/jeans_hosen.png","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen"],
                ["Outdoor", "herren/min/outdoor.png","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen"],
                ["Pullover & Strickjacken", "herren/min/pullover_strickjacken.png","herren/bekleidung/pullover-und-strickjacken/c/herren-bekleidung-pullover-strickjacken"],
                ["Shirts", "herren/min/shirts.png","herren/bekleidung/shirts/c/herren-bekleidung-shirts"]
            ];

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

            
            CATEGORIES = [
                ["Bodys", "baby/min/bodys.png","baby/bekleidung/bodys/c/baby-bekleidung-bodys"],
                ["GOTS", "baby/min/gots.png","baby/bekleidung/gots/c/lp-junior-gots"],
                ["Hosen", "baby/min/hosen.png","baby/bekleidung/hosen/c/baby-bekleidung-hosen"],
                ["Jacken", "baby/min/jacken.png","baby/bekleidung/jacken/c/baby-bekleidung-jacken"],
                ["Kinderzimmer", "baby/min/kinderzimmer.png","home/kinderzimmer/c/home-kinderzimmer"],
                ["Overalls", "baby/min/overalls.png","baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler"],
                ["Shirts", "baby/min/shirts.png","baby/bekleidung/shirts/c/junior-bekleidung-shirts"]
            ];
            
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

            CATEGORIES = [
                ["Bademäntel", "home/min/bademaentel.png","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche"],
                ["Bettwäsche", "home/min/bettwaesche.png","home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche"],
                ["Handtücher", "home/min/handtuecher.png","home/bad/badtextilien/c/home-bad-badtextilien"],
                ["Spannbetttücher & Laken", "home/min/spannbetttuecher_laken.png","home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken"],
                ["Teppiche", "home/min/teppiche.png","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche"],
                ["Tischwäsche", "home/min/tischwaesche.png","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche"],
                ["Wolldecken & Plaids", "home/min/wolldecken_plaids.png","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids"]
            ];
            
        }
    }

    WATO.PS06(CATEGORY_AFFINITY, CATEGORIES, DATA, 1);

})(new window.WATO());