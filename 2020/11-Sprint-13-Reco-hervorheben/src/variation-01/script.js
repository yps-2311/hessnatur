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

    window.iridion.econda.push(["Sprint13", "V1"]);

    function pushGoal(key, sendOnNextPageView){    
        if(sendOnNextPageView){
            window.iridion.push(['goal', key, '', true]);
        }else{
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

    WATO.sprint13goals();

    function createNewReco() {

        var existsNewReco = WATO.qs("#kk_newreco");

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
                        return typeof jQuery !== "undefined";
                    }, function(isJquery){
                        if(isJquery){
                            // console.log('isJquery: ', isJquery);
                            try {
                                // Doku des Sliders: https://flickity.metafizzy.co/
                                jQuery('#kk_reco').flickity({
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

                                // Klick eines Produktes der Reco
                                var recoWrapper = WATO.qs(".flickity-viewport", newReco);

                                recoWrapper.addEventListener('click', function(e){
                                    pushGoal('click_reco_pds_top', true);
                                });

                                // Pfeile austauschen
                                var leftButton = WATO.qs(".flickity-prev-next-button", newReco),
                                    rightButton = leftButton.nextElementSibling,
                                    orginalReco = WATO.qs("#ecRecommendationsContainer"),
                                    orgonalLeftButton = WATO.qs(".flickity-prev-next-button", orginalReco);
                                
                                leftButton.innerHTML = orgonalLeftButton.innerHTML;
                                rightButton.innerHTML = orgonalLeftButton.nextElementSibling.innerHTML;

                                // Slider Buttons genutzt
                                leftButton.addEventListener('click', function(){
                                    pushGoal('click_recoarrow_pds_top');
                                });
                                rightButton.addEventListener('click', function(){
                                    pushGoal('click_recoarrow_pds_top');
                                });

                                recoWrapper.addEventListener('mouseup', function(e){
                                    var newID = getProdID(e.target.closest("a.item__image").getAttribute('href'));
                
                                    if(lsReco.indexOf(newID) === -1){
                                        lsReco.push(newID);
                                    }
                                    window.localStorage.setItem("kk_recoproduct", lsReco);
                                });

                            } catch (error) {
                                // console.log('Error: ', error);
                                pushGoal("wa_setup_monitoring");
                            }
                        }
                    });

                } catch (error) {
                    // console.log('Error: ', error);
                    pushGoal("wa_setup_monitoring");
                }
            }
        });
    }

    createNewReco();

    // Farbwechsel des Produkts
    WATO.ajax("reload?", function() {
        createNewReco();
    });
    

})(new window.WATO(), window);




// // Send JSON data
// function getXHR(sendtype ,url, callback, data) {
        
//     var XHR = new XMLHttpRequest();

//     // Set up our request
//     XHR.open(sendtype, url);
    
//     // Add the required HTTP header for form data POST requests
//     // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//     XHR.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//     XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");

//     XHR.onreadystatechange = function() { // Call a function when the state changes.
//         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//             // Request finished. Do processing here.
//             callback(this);
//         }
//     };

//     // Finally, send our data.
//     XHR.send(data||true);
// }


// // Bsp.:
// getXHR("POST",'https://www.hessnatur.com/de/cart/updateVoucher', function(callbackContent) {
//     // var responseJSON = callbackContent.responseText;
//     // console.log('responseJSON: ', responseJSON);
// }, JSON.stringify(
//     {
//         "voucherCode":"ES15PF072020",
//         "CSRFToken":"f6b49b63-3b19-4169-b61c-1af026ead834"
//     }
// ));

// window.fetch('https://www.hessnatur.com/de/cart/updateVoucher').then (function (response) {
//     return response.json();
// }).then(function(data){
//     callback(data);
// }).catch(function(error){
//     console.error('Error:', error);
// });

// fetch('https://www.hessnatur.com/de/cart/updateVoucher',
// {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     method: "POST",
//     body: JSON.stringify(
//         {
//             "voucherCode":"ES15PF072020",
//             "CSRFToken":"f6b49b63-3b19-4169-b61c-1af026ead834"
//         }
//     )
// })
// .then(function(res){ console.log(res) })
// .catch(function(res){ console.log(res) })