// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    console.log("Hessnatur Reco Tweak - QS");

    // window.iridion.econda.push(["Sprint13", "V1"]);

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
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

    function pushGoal(key, sendOnNextPageView){    

        if(sendOnNextPageView){

            window.iridion.push(['goal', key, '', true]);
        } else {

            window.iridion.push(['goal', key]);
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

    function createNewReco() {

        var existsNewReco = WATO.qs("#kk_newreco"),
            isInDrag = false;

        if(existsNewReco){
            existsNewReco.parentNode.removeChild(existsNewReco);
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
                // console.log('recoSliderItems: ', recoSliderItems);

                try {
                    var recoClone = recoSliderItems[0].parentNode.cloneNode(true),
                        allItems = WATO.qsa(".productitem", recoClone),
                        newReco =  WATO.qs("#kk_reco"),
                        templs = window.localStorage.getItem("kk_recoproduct"),
                        lsReco = (templs ? templs.split(',') : false) || [];

                    // Attribute müssen entfernt werden, 
                    for (var i = 0; i < allItems.length; i++) {
                        allItems[i].removeAttribute("style");
                    }

                    // Geklonte Reco einfügen
                    newReco.innerHTML = recoClone.innerHTML;

                    // Galerie initialisieren
                    WATO.elem(function() {
                        return typeof jQuery !== "undefined" && typeof jQuery.fn.flickity !== "undefined";
                    }, function(isJquery){
                        if(isJquery){

                            try {

                                // Doku des Sliders: https://flickity.metafizzy.co/
                                var newjQReco = jQuery('#kk_reco');
                                newjQReco.flickity({
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

                                newjQReco.on('dragStart.flickity', function() {
                                    isInDrag = true;
                                });
                                newjQReco.on('dragEnd.flickity', function() {
                                    isInDrag = false;
                                });

                                // Klick eines Produktes der Reco
                                var recoWrapper = WATO.qs(".flickity-viewport", newReco);

                                if(recoWrapper){
                                    recoWrapper.addEventListener('mouseup', function(e){
                                        if(!isInDrag){
                                            pushGoal('click_reco_pds_top', true);
    
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
                                }

                                // Pfeile austauschen
                                var leftButton = WATO.qs(".flickity-prev-next-button", newReco),
                                    rightButton,
                                    orginalReco = WATO.qs("#ecRecommendationsContainer"),
                                    orgonalLeftButton = WATO.qs(".flickity-prev-next-button", orginalReco);
                                
                                if(leftButton){

                                    rightButton = leftButton.nextElementSibling;
                                    leftButton.innerHTML = orgonalLeftButton.innerHTML;

                                    // Slider Buttons genutzt
                                    leftButton.addEventListener('click', function(){
                                        pushGoal('click_recoarrow_pds_top');
                                    });

                                    if(rightButton){

                                        rightButton.innerHTML = orgonalLeftButton.nextElementSibling.innerHTML;

                                        rightButton.addEventListener('click', function(){
                                            pushGoal('click_recoarrow_pds_top');
                                        });
                                    }
                                }


                                /**
                                 * TWEAK
                                 */
                                var matchingProducts = {
                                        "weeks":[43309,47936,43319,50571,43311,43372,39996,47796,50042,45683,49151,45672,46361,39939,43309,50285,40745,47900,45671,45682,50463,49148,50231,49634,50472,43319,43449,40745,50036,47454,49975,50305,49146,43444,39996,50532,51288,32767,35092,44622],
                                        "month":[43309,47936,43309,49269,43319,48252,49579,45683,48251,50571,50181,43372,49577,39996,43311,48555,50042,49239,47796,49261,49146,46361,49355,49712,49148,49232,43311,50866,49578,49233,46594,40745,49625,50532,49148,49235,43311,39996,32767,32767]
                                    },
                                    productitems = WATO.qsa('#kk_newreco .productitem');

                                for(var i = 0; i < productitems.length; i++) {

                                    var img = WATO.qs('img', productitems[i]),
                                        src = img.getAttribute('src'),
                                        id  = 0;

                                    // wrap image for kk badges
                                    jQuery(img).wrap('<span class="kk-wrapper"/>');

                                    if(src){

                                        id = parseInt(src.replace(/.*\-([0-9]{5})\_.*/, '$1'));

                                        if(id !== 0){
                                            
                                            var matching      = "",
                                                matchingWeeks = matchingProducts.weeks.indexOf(id) !== -1,
                                                matchingMonth = matchingProducts.month.indexOf(id) !== -1,
                                                templateWeeks = '<div class="kk-badge kk-badge-fav">Kundenfavorit</div>',
                                                templateMonth = '<div class="kk-badge kk-badge-asked">Aktuell sehr gefragt</div>';
                                        
                                            // random badge?
                                            if(matchingWeeks && matchingMonth){

                                                if(Math.random() < 0.5){

                                                    matching = "weeks";
                                                } else {
                                                    
                                                    matching = "month";
                                                }
                                            } else if(matchingWeeks) {

                                                matching = "weeks";
                                            } else if(matchingMonth) {

                                                matching = "month";
                                            }

                                            if(matching !== ""){

                                                jQuery(productitems[i]).click(function(){
                                                    window.iridion.push(['segment', '32817']);
                                                }).find('.kk-wrapper').prepend(
                                                    matching === 'weeks' ? templateWeeks : templateMonth
                                                );
                                                // productitems[i].childNodes[0].insertAdjacentHTML('afterbegin',
                                                //     matching === 'weeks' ? templateWeeks : templateMonth
                                                // );
                                            }
                                        }
                                    }
                                }
                            } catch (error) {

                                console.log('Error: ', error);
                                pushGoal("wa_setup_monitoring");
                                pushGoal("wa_setup_monitoring1");
                            }
                        }
                    });

                } catch (error) {
                    
                    console.log('Error: ', error);
                    pushGoal("wa_setup_monitoring");
                }
            }
        });
    }

    WATO.sprint13goals();

    createNewReco();

    // Farbwechsel des Produkts
    WATO.ajax("reload?", function() {
        createNewReco();
    });
})(new window.WATO(), window);