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
        }
    }
   
    WATO.PS06(CATEGORY_AFFINITY, CATEGORIES, DATA, 2);

})(new window.WATO());