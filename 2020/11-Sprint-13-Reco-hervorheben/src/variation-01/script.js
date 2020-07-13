// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */


(function(WATO) {
    "use strict";

    // window.iridion.econda.push(["Sprint13", "V1"]);

    function pushGoal(key, sendOnNextPageView){    
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
            window.iridion.push(['goal', key]);
        }
    }

    WATO.sprint13goals();

    function isJqueryReady(auszufuehrendeFunction){
		var isJquery = typeof jQuery;
		if(isJquery !== "undefined"){
			auszufuehrendeFunction();
			return isJquery;
		}else{
			var interv = setInterval(function(){
				if(isJquery !== "undefined"){
					clearInterval(interv);
					auszufuehrendeFunction();
					return isJquery;
				}
			}, 200);
		}
    }

    // Markup für Wrapper der geklonten Reco
    WATO.elem('.pds__imageAndCockpitWrapper', function(topContent){
        if(topContent){
            topContent[0].insertAdjacentHTML('afterend', 
                '<div id="kk_newreco" class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                    '<div class="column small-12 h-mediumOffset-bottom-outer">'+
                        '<div class="h4 text-center">Diese Produkte könnten Ihnen gefallen</div>'+
                        '</div>'+
                        '<div class="column small-12 h-no-padding-medium-down ">'+
                            '<div class="flickity-productslider js-ecReco" id="kk_reco" data-wid="91" data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1"data-product="sku:4238489"data-count="20">'+
                            'Loading...'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );
        }
    });

    // Warten bis min ein Produkt geladen ist
    WATO.elem('.js-productSliderWrapper .productitem', function(recoSliderItems){
        if(recoSliderItems){

            try {
                var recoClone = recoSliderItems[0].parentNode.cloneNode(true),
                    allItems = WATO.qsa(".productitem", recoClone);

                // Attribute müssen entfernt werden, 
                for (var i = 0; i < allItems.length; i++) {
                    allItems[i].removeAttribute("style");
                }

                // Geklonte Reco einfügen
                WATO.qs("#kk_reco").innerHTML = recoClone.innerHTML;

                // Galerie initialisieren
                isJqueryReady(function(){
                    var newReco = jQuery('#kk_reco');

                    newReco.flickity({
                        initialIndex: 0,
                        cellAlign: 'left',
                        contain: true,
                        imagesLoaded: !0,
                        dragThreshold: "10",
                        selectedAttraction: "0.08",
                        friction: "0.6",
                        pageDots: false,
                        groupCells: !0
                    });

                    // Klick Goals
                    newReco.find(".flickity-viewport").click(function(){
                        pushGoal('click_reco_pds_top', true);
                    });
                    newReco.find(".flickity-prev-next-button, .flickity-prev-next-button").click(function(){
                        pushGoal('click_recoarrow_pds_top', false);
                    });

                });

            } catch (error) {
                console.log('Error: ', error);
            }
        }
    });
    

})(new window.WATO());