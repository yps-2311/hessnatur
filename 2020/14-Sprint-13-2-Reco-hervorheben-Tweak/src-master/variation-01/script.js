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

    window.iridion.econda.push(["Sprint13_2", "V1"]);

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

    function removeItem(element) {
        if(element){
            element.parentNode.removeChild(element);
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

                // var recoAlreadyExist = WATO.qs('#kk_newreco');

                // if(recoAlreadyExist){

                //     // remove reco
                //     recoAlreadyExist.parentNode.removeChild(recoAlreadyExist);
                // }

                topContent[0].insertAdjacentHTML('afterend', 
                    '<div id="kk_newreco" class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                        '<div class="column small-12 h-mediumOffset-bottom-outer">'+
                            '<div class="h4 text-center">Diese Produkte könnten Ihnen gefallen</div>'+
                        '</div>'+
                        '<div id="kk_placeForNewReco" class="column small-12 h-no-padding-medium-down">'+
                            'Loading...'+
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
                        allItems = WATO.qsa(".productitem", recoClone),
                        placeForNewReco =  WATO.qs("#kk_placeForNewReco"),
                        templs = window.localStorage.getItem("kk_recoproduct"),
                        lsReco = (templs ? templs.split(',') : false) || [];

                    // Attribute müssen entfernt werden, 
                    for (var i = 0; i < allItems.length; i++) {
                        allItems[i].removeAttribute("style");
                    }

                    try {
                        removeItem(WATO.qs("#kk_reco"));

                        // Geklonte Reco einfügen
                        console.log('placeForNewReco: ', placeForNewReco);
                        placeForNewReco.innerHTML = 
                            '<div id="kk_reco" class="flickity-productslider js-ecReco" data-wid="91" data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1"data-product="sku:4238489"data-count="20">'+
                                recoClone.innerHTML+
                            '</div>';

                        // Doku des Sliders: https://flickity.metafizzy.co/
                        var newjQReco = jQuery('#kk_reco');
                        
                        console.log('newjQReco: ', newjQReco);

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
                        var recoWrapper = WATO.qs("#kk_reco .flickity-viewport");

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
                        // var leftButton = WATO.qs(".flickity-prev-next-button", newReco),
                        //     rightButton,
                        //     orginalReco = WATO.qs("#ecRecommendationsContainer"),
                        //     orgonalLeftButton = WATO.qs(".flickity-prev-next-button", orginalReco);
                        
                        // if(leftButton){

                        //     rightButton = leftButton.nextElementSibling;
                        //     leftButton.innerHTML = orgonalLeftButton.innerHTML;

                        //     // Slider Buttons genutzt
                        //     leftButton.addEventListener('click', function(){
                        //         pushGoal('click_recoarrow_pds_top');
                        //     });

                        //     if(rightButton){

                        //         rightButton.innerHTML = orgonalLeftButton.nextElementSibling.innerHTML;

                        //         rightButton.addEventListener('click', function(){
                        //             pushGoal('click_recoarrow_pds_top');
                        //         });
                        //     }
                        // }
                        WATO.elem('#kk_reco .flickity-prev-next-button', function(leftButton){
                            if(leftButton){
                                leftButton = leftButton[0];
                                console.log('leftButton: ', leftButton);

                                var rightButton,
                                    orgonalLeftButton = WATO.qs("#ecRecommendationsContainer .flickity-prev-next-button");

                                rightButton = leftButton.nextElementSibling || false;

                                if(orgonalLeftButton){
                                    leftButton.innerHTML = orgonalLeftButton.innerHTML;
                                }

                                // Slider Buttons genutzt
                                leftButton.addEventListener('click', function(){
                                    pushGoal('click_recoarrow_pds_top');
                                });

                                if(rightButton){

                                    if(orgonalLeftButton){
                                        rightButton.innerHTML = orgonalLeftButton.nextElementSibling.innerHTML;
                                    }

                                    rightButton.addEventListener('click', function(){
                                        pushGoal('click_recoarrow_pds_top');
                                    });
                                }

                            }
                        });

                        
                        /**
                         * TWEAK
                         */
                        var matchingProducts = {
                                "weeks":[43309,50571,43311,47936,43319,39996,47796,43372,42678,33137,50042,43328,45737,45672,47900,46272,55280,50917,46361,47793,43342,45683,32967,47901,49975,40745,50472,39939,50562,43316,45671,22838,42132,17646,42483,40738,43322,45727,43441,43315,50231,50522,43449,50569,50036,45689,43012,43444,20023,40745,48169,49321,50305,50549,50255,50377,47454,50127,36986,47454,48435,45678,50456,48502,47029,49151,49046,47779,50532,49634,45682,39996,49584,43311,48554,45509,50298,46117,43319,49239,32886,47588,19136,49178,48933,50305,49148,36952,50532,50181,32767,49578,51288,48666,48991,44622,49024,51289,36992,32768],
                                "month":[43309,43319,47936,50571,43311,39996,43372,47796,45683,50042,45672,46361,43309,22219,49839,47936,39939,47793,49837,50472,45671,49269,43315,43316,40745,50285,48555,47900,17646,49239,43322,50463,50231,50522,49975,45727,49146,49237,50036,49148,45682,49321,40738,49151,43449,49321,48251,50181,49232,49634,36986,48702,20023,49261,40745,45678,42483,50549,49377,48156,49355,33137,43441,49046,50522,50305,50377,50456,50532,48502,47454,49626,49373,49148,43311,43311,47029,49584,47454,46117,39996,32886,50866,43444,43444,45509,49625,49151,49578,45683,51288,47454,49024,49235,32767,48666,43311,44622,32768,43309]
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
                        

                } catch (error) {
                    
                    console.log('Error: ', error);
                    pushGoal("wa_setup_monitoring");
                }
            }
        });
    }



    // Galerie initialisieren
    WATO.elem(function() {
        return typeof jQuery !== "undefined" && typeof jQuery.fn.flickity !== "undefined";
    }, function(isJquery){
        if(isJquery){
            createNewReco();
            WATO.sprint13goals();
        }
    });

    // Farbwechsel des Produkts
    WATO.ajax("reload?", function() {
        createNewReco();
    });
})(new window.WATO(), window);