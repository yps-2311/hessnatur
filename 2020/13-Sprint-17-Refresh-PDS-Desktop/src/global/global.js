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

        console.log('goalPush', key, sendOnNextPageView);
    };

    WATO.prototype.sprint17goals = function(variante){
        var _self = this;

        function clickgoal(queryparameter, goalname, sendOnNextPageView) {
            _self.elem(queryparameter, function(element){
                if(element){
                    element[0].addEventListener('click', function(){
                        _self.goalPush(goalname, sendOnNextPageView);
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
                for (var i = 0; i < addToCartButton.length; i++) {
                    addToCartButton[i].addEventListener('click', function(){
                        _self.elem('#sizeSelectReminder[aria-hidden="false"]', function(sizeSelectReminder){
                            if(sizeSelectReminder){
                                _self.goalPush('kk17_addtocart_withoutsize');
                            }
                        });
                    });
                }
            }
        });
        
        if(variante === 0){
            clickgoal('#read_reviews .h-text-uppercase', "kk17_rating");
            clickgoal('#send_review', "kk17_rating");

            clickgoal('.pds-productDescription__text .h-text-uppercase', "kk17_Produktbeschreibung");
            clickgoal('.certificateWrapper a', "kk17_Ausgezeichnete_Qualitaet", true);
            clickgoal('.productInfosItem a', "kk17_Made_In");
        }
    };

	
})(window.WATO, window);