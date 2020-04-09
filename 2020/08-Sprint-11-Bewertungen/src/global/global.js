/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
    "use strict";

    /*jshint loopfunc: true */


    // var naviLvl1 = '#offCanvasNavigation > li:not([aria-label="Outdoor"])',
    //     naviLvl2 = '#offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li:not(.h-text-bold):not([data-drilldown-back-levels])',
    //     naviLvl3 = '#offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li > ul > li:not(.h-text-bold):not([data-drilldown-back-levels])';
    
    // function pushGoal(key, sendOnNextPageView){    
    //     if(sendOnNextPageView){
    //         window.iridion.push(['goal', key, '', true]);
    //     }else{
    //         window.iridion.push(['goal', key]);
    //     }
    // }
    // // function pushSegment(segment) {
    // //     window.iridion.push(['segment', String(segment)]);
    // // }

    // WATO.prototype.sprint10goals = function(){
    //     var _self = this;

    //     function clickGoals(classes, goalname) {
    //         _self.elem(classes, function(element){
    //             if(element){
    //                 element[0].addEventListener('click', function(){
    //                     pushGoal(goalname, true);
    //                 });
    //             }
    //         });
    //     }

    //     _self.ready(function(){
    //         try {
    //             var navi1 = _self.qsa(naviLvl1),
    //                 navi2 = _self.qsa(naviLvl2),
    //                 navi3 = _self.qsa(naviLvl3);

    //             for (var l = 0; l < navi1.length; l++) {
    //                 _self.qs("a", navi1[l]).addEventListener('touchend', function(e){
    //                     console.log("clicklevel1");
    //                     pushGoal("clicklevel1");

    //                     switch (e.target.parentNode.getAttribute('aria-label')) {
    //                         case "NEU":
    //                             pushGoal("click_neu");
    //                             break;
    //                         case "Damen":
    //                             pushGoal("click_damen");
    //                             break;
    //                         case "Herren":
    //                             pushGoal("click_herren");
    //                             break;
    //                         case "Junior":
    //                             pushGoal("click_junior");
    //                             break;
    //                         case "Home":
    //                             pushGoal("click_home");
    //                             break;
    //                         case "Sale":
    //                             pushGoal("click_sale");
    //                             break;
    //                     }
    //                 });
    //             }

    //             for (var m = 0; m < navi2.length; m++) {
    //                 var childLink2 = _self.qs("a", navi2[m]);
    //                 if(childLink2){
    //                     childLink2.addEventListener('touchend', function(e){
    //                         if(e.target.parentNode.classList.contains('is-submenu-item')){
    //                             console.log("clicklevel2");
    //                             pushGoal("clicklevel2");
    //                         }
    //                     });
    //                 }
    //             }

    //             for (var n = 0; n < navi3.length; n++) {
    //                 var childLink3 = _self.qs("a", navi3[n]);
    //                 if(childLink3){
    //                     childLink3.addEventListener('touchend', function(e){
    //                         if(e.target.parentNode.classList.contains('is-submenu-item')){
    //                             console.log("clicklevel3");
    //                             pushGoal("clicklevel3");
    //                         }
    //                     });
    //                 }
    //             }
    //         } catch (error) {
    //             // pushGoal("error_setup");
    //             window.iridion.push(['goal', 'error_setup', 1]);
    //             // console.log('Error: ', error);
    //         }
                
    //         clickGoals(".offCanvasLinks .h-text-decoration-none-hover", "click_anmelden");
    //         clickGoals('.offCanvasLinks a[title="Newsletter"]', "click_newsletter");
    //         clickGoals('.offCanvasLinks a[title="Über uns"]', "click_ueberuns");
    //         clickGoals('.offCanvasLinks a[title="Magazin"]', "click_magazin");
    //         clickGoals('.offCanvasLinks a[title="Stores"]', "click_stores");
    //     });
    // };
    
    // WATO.prototype.sprint10 = function(){
    //     var _self = this,
    //         imgPath = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/AB10/katimg/";

    //     function cleanMenuHeadline(ele) {
    //         if(typeof ele === "object"){
    //             // Zur korrekten URL Benennung werden alle Sonderzeichen ersetzt
    //             return ele.textContent.toLowerCase().trim().replace(" & ","_").replace("/","").replace("ä","ae").replace("ü","ue").replace("ö","oe").replace("ß","ss").replace(/ /g,"_"); // .replace("✿","")
    //         }
    //     }

    //     _self.ready(function(){
    //         // Navi Hierarchy
    //         var all3LevelHierarchy = _self.qsa( naviLvl1+','+   // Level 1
    //                                             naviLvl2+','+   // Level 2
    //                                             naviLvl3);      // Level 3
            
    //         for (var i = 0; i < all3LevelHierarchy.length; i++) {
    //             try {
    //                 var thisMenuPoint = all3LevelHierarchy[i],
    //                     tempHL = thisMenuPoint.parentNode.parentNode.parentNode.previousElementSibling,
    //                     tempHL2 = thisMenuPoint.parentNode.previousElementSibling,
    //                     tempHeadlineText = "";
                    
    //                 // Für Level 3 - Wenn ein Navi-Punkt eine Level3 Benennung hat wird dieser hier für die Benennung mitaufgenommen
    //                 // z.B. damen_bekleidung_hose wird hier damen aufgenommen
    //                 if(tempHL && tempHL.textContent.trim().length > 0){
    //                     tempHeadlineText = cleanMenuHeadline(tempHL) + '_';
    //                 }
    //                 // Für Level 2
    //                 // z.B. damen_bekleidung_hose wird hier bekleidung aufgenommen
    //                 if(tempHL2){
    //                     tempHeadlineText += cleanMenuHeadline(tempHL2) + '_';
    //                 }
    //                 // Bei Level 1 bleibt tempHeadlineText leer
                    
    //                 var isTitleInA = _self.qs("a", thisMenuPoint);

    //                 // Navi-Punkt-Titel
    //                 thisMenuPoint.setAttribute('style', 'background-image: url("' + imgPath + tempHeadlineText + 
    //                     cleanMenuHeadline((isTitleInA ? isTitleInA : thisMenuPoint)) + 
    //                     '.png")');

    //                 // console.log(tempHeadlineText + 
    //                 //     cleanMenuHeadline((isTitleInA ? isTitleInA : thisMenuPoint)));

    //             } catch (error) {
    //                 // pushGoal("error_setup");
    //                 window.iridion.push(['goal', 'error_setup', 3]);
    //                 // console.log('Error: ', error);
    //             }
                
    //         }
    //     });
    // };
	
})(window.WATO);