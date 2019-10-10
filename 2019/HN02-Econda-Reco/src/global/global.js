/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
    "use strict";
    
    WATO.prototype.goalPush = function(key, sendOnNextPageView){
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
        // console.log('goalPush: ', key);
    };

	// WATO.prototype.goalsFromCat = function(){
    //     var _self = this;

    //     // Sortierung geändert
    //     _self.elem('#tabSort .changeArticleView label', function(pSortieren){
    //         if(pSortieren){
    //             pSortieren[0].addEventListener("change",function (){
    //                 _self.goalPush("sortierung_geaendert");
    //             });
    //         }
    //     });

    //     // Filter genutzt
    //     _self.elem('#tabFilter .js-filter-apply', function(pSortieren){
    //         if(pSortieren){
    //             pSortieren[0].addEventListener("click",function (){
    //                 _self.goalPush("filter_genutzt");
    //             });
    //         }
    //     });

    // };
    
	
})(window.WATO);