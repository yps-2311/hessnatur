/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
    "use strict";
    
    WATO.prototype.sprint10 = function(){
        var _self = this,
            imgPath = "https://dev.web-arts.de/hessnatur/2020/05-Sprint-10-Navigation-mobile/img/katimg/";

        function cleanMenuHeadline(ele) {
            if(ele){
                return ele.textContent.toLowerCase().trim().replace(" & ","_").replace("/","").replace("ä","ae").replace("ü","ue").replace("ö","oe").replace("ß","ss").replace(/ /g,"_").replace("✿","");
            }
        }

        _self.elem('#offCanvasNavigation > li:not([aria-label="Outdoor"]), #offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li:not(.h-text-bold):not([data-drilldown-back-levels]), #offCanvasNavigation > li:not([aria-label="Outdoor"]) > ul > li > ul > li:not(.h-text-bold):not([data-drilldown-back-levels])', function(firstHierarchy){ //:not(.h-text-bold)
            if(firstHierarchy){
                for (var i = 0; i < firstHierarchy.length; i++) {
                    try {
                        var thisMenuPoint = firstHierarchy[i],
                            // isLabel = thisMenuPoint.children,
                            tempHL = thisMenuPoint.parentNode.parentNode.parentNode.previousElementSibling,
                            tempHL2 = thisMenuPoint.parentNode.previousElementSibling,
                            // newHL = tempHL ? tempHL : thisMenuPoint.parentNode.previousElementSibling, //_self.qs('li.is-drilldown-submenu-back-item + li.is-drilldown-submenu-back-item, li.is-drilldown-submenu-back-item + .h-text-bold', thisMenuPoint.parentNode), // 'li[data-drilldown-back-levels="2"] + li[data-drilldown-back-levels="1"], li[data-drilldown-back-levels="1"] + .h-text-bold'
                            tempHeadlineText = "";

                        // Menüpunkte werden teilweise mit ihren Kategorie-Headlines definiert
                        // damit z.B. Jeans zu Männer oder Frauen zugeordnet werden können
                        // if(newHL && !thisMenuPoint.parentNode.getAttribute('id')){
                        //     tempHeadlineText = cleanMenuHeadline(newHL) + '_';
                        // }

                        if(tempHL && tempHL.textContent.trim().length > 0){
                            tempHeadlineText = cleanMenuHeadline(tempHL) + '_';
                        }
                        if(tempHL2){
                            tempHeadlineText += cleanMenuHeadline(tempHL2) + '_';
                        }
                        
                        // if(isLabel.length > 0 && isLabel[0].classList.contains('navNodeWrapper') && 
                        //    isLabel[0].children[0].classList.contains('prgRedirData')){
                        //     // Wenn ein input für diesen Menüpunkt existiert wird der eindeutige Value hiervon für den Dateinamen verwendet

                        //     thisMenuPoint.setAttribute('style', 'background-image: url("'+ imgPath + isLabel[0].children[0].getAttribute('value').toLowerCase().trim()+'.png")');
                        // }else{
                            // Alternativ wird der Text im Menüpunkt verwendet, erweitert um die Kategorie in der dieser sich befindet
                            var tempTitle = "",
                                isTitleInA = _self.qs("a", thisMenuPoint);

                            if(isTitleInA){
                                tempTitle = cleanMenuHeadline(isTitleInA);
                            }else{
                                tempTitle = cleanMenuHeadline(thisMenuPoint);
                            }

                            thisMenuPoint.setAttribute('style', 'background-image: url("' + imgPath + tempHeadlineText + tempTitle + '.png")');
                            console.log(tempHeadlineText + tempTitle);
                        // }

                        

                    } catch (error) {
                        console.log('Error: ', error);
                    }
                    
                }
            }
        });


    };
	
})(window.WATO);