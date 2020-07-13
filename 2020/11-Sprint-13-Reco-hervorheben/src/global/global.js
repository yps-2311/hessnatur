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

    function pushGoal(key, sendOnNextPageView){    
        console.log('key: ', key);
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

    var windowHeight = (window.innerHeight || document.documentElement.clientHeight),
        // windowWidth = (window.innerWidth || document.documentElement.clientWidth),
        theRecoObj = false;

    // Check if user scrolled to Product Description
    function checkScrollDepth() {
        if(theRecoObj){
            var ecoWrapper = theRecoObj.getBoundingClientRect(),
                vertInView = (ecoWrapper.top <= windowHeight) && ((ecoWrapper.top + ecoWrapper.height) >= 0);
                // horInView = (ecoWrapper.left <= windowWidth) && ((ecoWrapper.left + ecoWrapper.width) >= 0);
            if (vertInView) { //&& horInView

                pushGoal('gesehen_orginal_reco');

                window.removeEventListener('scroll', checkScrollDepth);

                return true;
            }
            return false;
        }
    }

    WATO.prototype.sprint13goals = function(){
        var _self = this;

        _self.elem('#ecRecommendationsContainer .productitem', function(recoItem){
            if(recoItem){
                theRecoObj = recoItem[0].parentNode.parentNode;

                theRecoObj.addEventListener('click', function(){
                    window.iridion.push(['goal', 'click_reco_pds_orginal', '', true]);
                });
                
                var arrowButton = _self.qs(".flickity-prev-next-button", theRecoObj.parentNode);
                
                arrowButton.addEventListener('click', function(){
                    pushGoal("click_recoarrow_pds_orginal");
                });
                arrowButton.nextElementSibling.addEventListener('click', function(){
                    pushGoal("click_recoarrow_pds_orginal");
                });

                // Scroll Goal 
                if(!checkScrollDepth()){
                    window.addEventListener('scroll', checkScrollDepth);
                }
            }
        });

    }

	
})(window.WATO, window);