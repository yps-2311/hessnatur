// load core and global js
// @codekit-prepend "../global/global.js";

// @code-kit append "request.min.js";
/**
 * @function
 * @author Christian Knoth
 * @namespace V2
 * @name Variation 02
 * @description
 */
 (function (WATO) {
    "use strict";

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
                "4238489": {
                    "badges": [
                        "vegan",
                        "kundenfavorit"
                    ],
                    "response": {}
                },
                "5055909": {
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
                "4538589": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4969329": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4969403": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4969719": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4581909": {
                    "badges": [
                        "sale"
                    ],
                    "response": {}
                },
                "4942717": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "5055989": {
                    "badges": [
                        "vegan"
                    ],
                    "response": {}
                },
                "4238409": {
                    "badges": [
                        "vegan",
                        "kundenfavorit"
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
                    "5072349": {
                        "badges": [
                            "vegan"
                        ],
                        "response": {}
                    },
                    "4655117": {
                        "badges": [
                            "vegan",
                            "sale"
                        ],
                        "response": {}
                    },
                    "4330917": {
                        "badges": [
                            "kundenfavorit"
                        ],
                        "response": {}
                    },
                    "4330982": {
                        "badges": [
                            "kundenfavorit"
                        ],
                        "response": {}
                    },
                    "4212672": {
                        "badges": [
                            "vegan"
                        ],
                        "response": {}
                    },
                    "3999604": {
                        "badges": [
                            "vegan",
                            "kundenfavorit"
                        ],
                        "response": {}
                    },
                    "4212898": {
                        "badges": [
                            "vegan",
                            "sale"
                        ],
                        "response": {}
                    },
                    "4212872": {
                        "badges": [
                            "sale"
                        ],
                        "response": {}
                    },
                    "4212865": {
                        "badges": [
                            "vegan",
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
                    },
                    "5093201": {
                        "badges": [
                            "vegan"
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
   
       WATO.PS06(CATEGORY_AFFINITY, CATEGORIES, DATA, 2);

})(new window.WATO());