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

	WATO.prototype.goalsPdpRed = function(){
        var _self = this;

        function klickGoal(GoalName, className) {
            _self.elem(className, function(element){
                if(element){
                    element[0].addEventListener('click', function(){
                        _self.goalPush(GoalName);
                    });
                }
            });
        }
        function completelookProduct() {
            _self.goalPush("completelookProduct", true);
        }

        // 1. Klick: Verfügbarkeit (nur in Control)
        klickGoal("s5_click_availability", 'a[data-open="availability-matrix"]');

        // 2. Klick: Mehr Produktdetails
        klickGoal("klick_produktdetails", 'a.js-pds-more-details');

        // 3. Klick: Complete the look (Verlinkung unter Bild)
        klickGoal("completelookanker", 'a.js-jump-complete-look');
        
        // 4. Klick: Produkt auf „Complete the look“ Section
        _self.elem('.pds-completeTheLookWrapper a', function(products){
            if(products){
                for (var i = 0; i < products.length; i++) {
                    products[i].addEventListener('click', completelookProduct);
                }
            }
        });

	};
	
})(window.WATO);