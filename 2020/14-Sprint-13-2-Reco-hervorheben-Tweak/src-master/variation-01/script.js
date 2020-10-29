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
                        placeForNewReco.innerHTML = 
                            '<div id="kk_reco" class="flickity-productslider js-ecReco" data-wid="91" data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1"data-product="sku:4238489"data-count="20">'+
                                recoClone.innerHTML+
                            '</div>';

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
                                "weeks":[43309,50571,47936,43311,47900,42678,43319,33137,39996,45737,47901,43328,22219,46272,43372,55280,47793,23127,50562,45672,45671,22838,22215,44351,49975,43012,43342,46361,48169,42483,47701,43316,40745,47796,50255,39939,43449,40745,48435,17646,45727,36986,45683,48702,50522,49046,45689,50231,22838,20023,50426,50036,50237,50472,50569,43444,36952,50305,42139,40738,50042,50333,43441,47454,50532,47029,49001,47779,49381,47454,43315,50549,46117,50377,50298,50187,45509,50532,49634,50456,49151,50305,47588,49584,39996,50303,32767,32886,33137,48933,49178,50289,45682,50326,51288,48666,44622,49578,36992,32768],
                                "month":[43309,47936,43319,50571,43311,39996,43372,47796,45683,42678,45672,50042,46361,22219,47900,45737,32967,55280,46272,47793,39939,45671,50562,47901,43316,40745,50472,49837,33137,43315,17646,49975,43309,22224,50285,50231,43322,45727,50036,50463,43449,50522,42483,40738,48702,49321,36986,40745,49151,43012,45678,45682,49148,20023,50518,49634,49046,50549,48435,48555,43441,49232,22838,50305,50522,49239,50377,47454,48156,48502,50456,47779,47029,50181,43444,49146,46117,43311,49584,39996,45509,47454,50298,47454,32886,50532,50532,49148,47588,49578,49178,51288,48933,32767,49024,48666,44622,36992,32768,43309]
                            },
                            productitems = WATO.qsa('#kk_newreco .productitem'),
                            firstSlideWithBadge = false;

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

                                        jQuery(productitems[i]).children("a").click(function(){
                                            window.iridion.push(['segment', '32817']);
                                        }).find('.kk-wrapper').prepend(
                                            matching === 'weeks' ? templateWeeks : templateMonth
                                        );

                                        jQuery(".kk-badge").click(function(){
                                            pushGoal("kk132_badgeclick");
                                        });
                                    }

                                    if(i < 5 && matching !== ""){
                                        firstSlideWithBadge = true;
                                    }else if(i > 4 && !firstSlideWithBadge && matching !== "") {
                                        var firstProductWithBadge = WATO.qs("a", productitems[i]);

                                        firstProductWithBadge.insertAdjacentElement('afterend', WATO.qs("a", productitems[0]));
                                        productitems[0].insertAdjacentElement('afterbegin', firstProductWithBadge);

                                        firstSlideWithBadge = true;
                                    }
                                }
                            }
                        }
                    } catch (error) {

                        // console.log('Error: ', error);
                        pushGoal("wa_setup_monitoring");
                        pushGoal("wa_setup_monitoring1");
                    }
                        

                } catch (error) {
                    
                    // console.log('Error: ', error);
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