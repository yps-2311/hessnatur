// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    // INIT MUTATION OBSERVER
    // WATO.initObserver(function(error){
    //     console.log(error);
    // });

    // FIND ELEMENT
    WATO.elem('.gridviewProductFilterDesktopWrapper .js-filter-form', function(filterformX){

        if(filterformX){
            try {

                var filterform = filterformX[0],
                    alleFilterWrapper = WATO.qsa(".filterRow", filterform),
                    alleFilterUl = WATO.qs(".filterVariations", filterform),
                    ausgewaehlterNaviPunkt = WATO.qsa(".sidebarNav--nav .h-text-bold");
                    
                // console.log('alleFilterWrapper: ', alleFilterWrapper);
                // console.log('filterform: ', filterform);
                // console.log('alleFilterUl: ', alleFilterUl);
                // console.log('ausgewaehlterNaviPunkt: ', ausgewaehlterNaviPunkt);

                if(alleFilterUl){
                    var titleSeite = "";
                    if(ausgewaehlterNaviPunkt.length > 0){
                        titleSeite = ausgewaehlterNaviPunkt[0].innerHTML;
                    }
                    alleFilterUl.insertAdjacentHTML("beforebegin", '<h2>'+titleSeite+'</h2>'+
                        '<p class="kk_info">Nutzen Sie die Filter, um schnell einen passenden Artikel zu finden:</p>'+
                        '<div class="kk_filterweiter"></div>'+
                        '<div class="kk_filterzurueck"></div>'+
                        '<div class="kk_filter"></div>');

                    var pFilter = WATO.qs(".kk_filter", filterform);
                    pFilter.insertAdjacentElement("afterbegin", alleFilterUl);

                    // Materialdropdown wird umpositioniert
                    WATO.elem('#toggle_filter_FFmaterial', function(material){
                        if(material){
                            var materialDropdown = material[0];
                            materialDropdown.parentNode.style.display = "none";
                            pFilter.insertAdjacentElement("afterend", materialDropdown);

                            // materialDropdown

                        }
                    });

                    var countFilters = WATO.qsa(".h-pos-relative", filterform).length -1, // -1 weil material rausgezogen wird
                        continueButton = WATO.qs(".kk_filterweiter", filterform),
                        backButton = WATO.qs(".kk_filterzurueck", filterform);

                    if(countFilters > 4) {
                        continueButton.addEventListener("click", function(){
                            alleFilterUl.style.left = "-"+((158*countFilters) - pFilter.offsetWidth)+"px";
                            continueButton.style.display = "none";
                            backButton.style.display = "block";
                        });
                        backButton.addEventListener("click", function(){
                            alleFilterUl.style.left = "0";
                            continueButton.style.display = "block";
                            backButton.style.display = "none";
                        });
                    }else{
                        continueButton.style.display = "none";
                    }


                    

                    


                }

                


                

                
            } catch (error) {
                console.log(error);
            }

           

            



        }

        // function pushGoal(key) {

        //     if(goalsSend.indexOf(key) === -1){

        //         goalsSend.push(key);

        //         /**
        //          * START QS
        //          */
        //         // WATO.qs('#wa-goals > li:last-child').insertAdjacentHTML('afterend', '<li style="list-style:none;">goal - ' + 's3_' + key + '</li>');
        //         // console.log("pushGoal: " + key);
        //         /**
        //          * END QS
        //          */
    
        //         window.iridion.push(['goal', 's3_' + key]);
        //     }
        // }

        // function addListener(object, listener, callback) {

        //     object.addEventListener(listener, callback);
        // }

        // function classContains(object, value) {

        //     return object.classList.contains('wa-' + value);
        // }

        // function manageClass(object, value, remove) {

        //     var _class = 'wa-' + value,
        //         _classList = object.classList;

        //     if(remove){

        //         _classList.remove(_class);
        //     } else {
                
        //         _classList.add(_class);
        //     }
        // }

        // function hideLayer() {

        //     pushGoal('uvps_closed');

        //     manageClass($waLayerBG, 'show', true);
        //     manageClass($waLayerBG, 'fade-out');
        //     manageClass($waLayer, 'fade-in', true);
        //     manageClass($waLayer, 'fade-out');
        // }


        


    });
})(new window.WATO());
