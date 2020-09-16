/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 */
(function(WATO, window){
    "use strict";

    /*jshint loopfunc: true */

    function pushGoal(key, sendOnNextPageView){    
        // console.log('key: ', key);
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                    Element.prototype.webkitMatchesSelector;
    }
    
    if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    var windowHeight = (window.innerHeight || document.documentElement.clientHeight),
        // windowWidth = (window.innerWidth || document.documentElement.clientWidth),
        theRecoObj = false;

    // Check if user scrolled to Product Description
    function checkScrollDepth() {
        if(theRecoObj){
            var recoWrapper = theRecoObj.getBoundingClientRect(),
                vertInView = (recoWrapper.top <= windowHeight) && ((recoWrapper.top + recoWrapper.height) >= 0);
            if (vertInView) {

                pushGoal('gesehen_orginal_reco');

                window.removeEventListener('scroll', checkScrollDepth);

                return true;
            }
            return false;
        }
    }
    

    function getProdID(fromString) {
        try {
            return parseInt(fromString.match(/\d{5,9}/)[0].substring(0,5));
        } catch (error) {
            // console.log('Error: ', error);
            return 0;
        }
    }

    WATO.prototype.sprint13goals = function(){
        var _self = this,
            isInDrag = false,
            templs = window.localStorage.getItem("kk_recoproduct"),
            lsReco = (templs ? templs.split(',') : false) || [];
            console.log('lsReco: ', lsReco);

        _self.elem('#ecRecommendationsContainer .productitem', function(recoItem){
            if(recoItem){
                theRecoObj = recoItem[0].parentNode.parentNode;

                // theRecoObj.addEventListener('click', function(){
                //     pushGoal("click_reco_pds_orginal", true);
                // });
                
                var arrowButton = _self.qs(".flickity-prev-next-button", theRecoObj.parentNode),
                    goalKey = "click_recoarrow_pds_orginal";
                
                if(arrowButton){
                    arrowButton.addEventListener('click', function(){
                        pushGoal(goalKey);
                    });
                    arrowButton.nextElementSibling.addEventListener('click', function(){
                        pushGoal(goalKey);
                    });
                }

                _self.elem(function() {
                    return typeof jQuery !== "undefined";
                }, function(isJquery){
                    if(isJquery){
                        var oldReco = $("#ecRecommendationsContainer");

                        oldReco.on('dragStart.flickity', function() {
                            isInDrag = true;
                        });
                        oldReco.on('dragEnd.flickity', function() {
                            isInDrag = false;
                        });
                    }
                });


                theRecoObj.addEventListener('mouseup', function(e){
                    if(!isInDrag){
                        pushGoal('click_reco_pds_orginal', true);

                        try {
                            var newID = getProdID(e.target.closest("a.item__image").getAttribute('href'));

                            if(lsReco.indexOf(newID) === -1){
                                lsReco.push(newID);
                            }
                            window.localStorage.setItem("kk_recoproduct", lsReco);
                        } catch (error) {
                        }
                    }
                });

                // Scroll Goal 
                if(!checkScrollDepth()){
                    window.addEventListener('scroll', checkScrollDepth);
                }
            }
        });

        _self.ajax("/cart/add", function(){
            if(lsReco.indexOf(String(getProdID(window.location.pathname))) !== -1){
                pushGoal("addcart_recoprod");
            }
        });

    }

	
})(window.WATO, window);