/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

    WATO.prototype.goalPush = function(key, sendOnNextPageView){
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    };

    WATO.prototype.sprint17goals = function(variante){
        var _self = this;

        function clickgoal(queryparameter, goalname) {
            _self.elem(queryparameter, function(element){
                if(element){
                    element[0].addEventListener('click', function(){
                        _self.goalPush(goalname);
                    });
                }
            });
        }

        clickgoal('div[data-share="Facebook"]', "kk17_facebook");
        clickgoal('div[data-share="Twitter"]', "kk17_twitter");
        clickgoal('div[data-share="Pinterest"]', "kk17_pinterest");
        clickgoal('a.starRatingWrapper', "kk17_bewertungen_anker");

        clickgoal('#ecRecommendationsContainer', "kk17_reco");

        _self.elem('#addToCartButton', function(addToCartButton){
            if(addToCartButton){
                addToCartButton[0].addEventListener('click', function(){
                    _self.elem('#sizeSelectReminder[aria-hidden="false"]', function(sizeSelectReminder){
                        if(sizeSelectReminder){
                            _self.goalPush('kk17_addtocart_withoutsize');
                        }
                    });
                });
            }
        });

        
        if(variante === 0){
            clickgoal('#accordion-rating-label', "kk17_rating");
            clickgoal('#accordion-rating .js_showAdditionalItems', "kk17_rating");

            clickgoal('#Produktbeschreibung-label', "kk17_Produktbeschreibung");
            clickgoal('#Ausgezeichnete_Qualitaet-label', "kk17_Ausgezeichnete_Qualitaet");
            clickgoal('#Passform-label', "kk17_Passform");
            clickgoal('#Made_In-label', "kk17_Made_In");
            clickgoal('#Pflege-label', "kk17_Pflege");
            clickgoal('#Material-label', "kk17_Pflege");
        }
    };

	
})(window.WATO, window);