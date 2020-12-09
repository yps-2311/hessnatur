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

    WATO.prototype.goalPush = function(key, sendOnNextPageView, value){
        // console.log("goal: ", key);
        if(window.iridion){
            if(sendOnNextPageView){
                window.iridion.push(['goal', key, '', true]);
            }else{
                window.iridion.push(['goal', key, (value || '')]);
            }
        }
    };

    WATO.prototype.sprint19goals = function(){
        var _self = this;

        function clickgoal(queryparameter, goalname, sendOnNextPageView) {
            _self.elem(queryparameter, function(element){
                if(element){
                    for (var i = 0; i < element.length; i++) {
                        element[i].addEventListener('click', function(){
                            _self.goalPush(goalname, sendOnNextPageView);
                        });
                    }
                }
            });
        }

        // function pushSegment(segmentID) {
        //     // console.log('segmentID: ', segmentID);
        //     if (typeof window.iridion !== "undefined" && !window.iridion.push(['hasSegment', segmentID])) {
        //         window.iridion.push(['segment', segmentID]);
        //     }
        // }


        _self.ready(function(){
            // KK: PS19 - Klicks der Left Hand Navigation
            clickgoal(".sidebarNav ul a", "kk19_leftnavi", true);
            
            // KK: PS19 - Nutzung der Filter
            _self.elem('.gridviewProductFilterDesktopWrapper button', function(filter){
                if(filter){
                    for (var i = 0; i < filter.length; i++) {
                        filter[i].addEventListener('click', function(e){
                            if(!e.target.classList.contains('.hide') && !e.target.parentNode.classList.contains('.hide')){
                                _self.goalPush('kk19_usingfilter', true);
                            }
                        });
                    }
                }
            });

            // KK: PS19 - Klicks auf Banner (Katbanner)
            clickgoal(".js_backstopWrapper > .h-disp-block > a", "kk19_katbanner", true);
            
            // KK: PS19 - Klick auf eines der erste 6 Produkte
            _self.elem('.gridviewProductItemWrapper', function(products){
                if(products){
                    for (var i = 0; i < 6; i++) {
                        var thisProduct = products[i];
                        if(typeof thisProduct === "undefined"){
                            break;
                        }
                        if(!thisProduct.classList.contains('kk_kachel')){
                            thisProduct.addEventListener('click', function(){
                                _self.goalPush('kk19_first6prods', true);
                            });
                        }
                    }
                }
            });

            // KK: PS19 - Suchfeld Ende der Seite
            _self.elem('#search_form_page', function(bottomSearch){
                if(bottomSearch){
                    bottomSearch[0].addEventListener('submit', function(){
                        _self.goalPush('kk19_bottomsearch', true);
                    });
                }
            });
            
            // KK: PS19 - Button Weitere Artikel
            clickgoal(".js-more-results", "kk19_showmore", false);


            clickgoal(".shrink .changeArticleViewItem", "kk19_changeview", true);


            _self.elem('#desktop__sort', function(desktopSort){
                if(desktopSort){
                    desktopSort[0].addEventListener('change', function(){
                        _self.goalPush('kk19_sortchange', true);
                    });
                }
            });
            
            
            
            // KK: PS19 - Verweildauer des Besuchers
            var counter = 0,
                interval = setInterval(function(){

                counter = counter + 10;
                
                _self.goalPush('kk19_staysonpage', false, String(counter));
                // console.log('counter: ', counter);
                
                if(counter >= 120){
                    clearInterval(interval);
                }

            }, 10000);
        });
    };
	
})(window.WATO, window);