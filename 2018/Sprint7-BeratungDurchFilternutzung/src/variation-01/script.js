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

    function closeAllFilters() {
        var openFilter = WATO.qs(".buttonTab.hover");
        if(openFilter){
            openFilter.click();
        }
    }

    // FIND ELEMENT
    WATO.elem('.gridviewProductFilterDesktopWrapper .js-filter-form', function(filterformX){

        if(filterformX){
            try {

                var filterform = filterformX[0],
                    // alleFilterWrapper = WATO.qsa(".filterRow", filterform),
                    alleFilterUl = WATO.qs(".filterVariations", filterform),
                    ausgewaehlterNaviPunkt = WATO.qsa(".sidebarNav--nav .h-text-bold"),
                    breadcrumbLastPoint = WATO.qs(".breadcrumbs.h-no-margin >li:last-child span strong:first-child");
                    
                // console.log('alleFilterWrapper: ', alleFilterWrapper);
                // console.log('filterform: ', filterform);
                // console.log('alleFilterUl: ', alleFilterUl);
                // console.log('ausgewaehlterNaviPunkt: ', ausgewaehlterNaviPunkt);

                filterform.classList.add("kk_noMaterials");


                function scrollBox(list, inclMaterial) {
                    
                    console.log('list: ', list);
                    console.log('list.children: ', list.children);

                    if(list){
                        var listWrapper = list.parentNode,
                            countFilters = list.children.length - inclMaterial, //WATO.qsa(".h-pos-relative", list).length -1, // -1 weil material rausgezogen wird
                            continueButton = listWrapper.previousSibling.previousSibling, //WATO.qs(".kk_filterweiter", alleFilterUl),
                            backButton = listWrapper.previousSibling, //WATO.qs(".kk_filterzurueck", alleFilterUl);
                            widthFilters = (158*countFilters);

                            // console.log('widthFilters: ', widthFilters);
                            // console.log('listWrapper: ', listWrapper);
                            // console.log('listWrapper.offsetWidth: ', listWrapper.parentNode.offsetWidth);
                        
                        // Erst bei mehr als 4 Filtern wird eine Scrollfunktion benötigt
                        if(widthFilters > (listWrapper.parentNode.offsetWidth - 110)) { //countFilters > 4
                            continueButton.addEventListener("click", function(){
                                list.style.left = "-"+(widthFilters - listWrapper.offsetWidth - (inclMaterial ? 0 : 10))+"px";
                                continueButton.style.display = "none";
                                backButton.style.display = "block";
                                closeAllFilters();
                            });
                            backButton.addEventListener("click", function(){
                                list.style.left = "0";
                                continueButton.style.display = "block";
                                backButton.style.display = "none";
                                closeAllFilters();
                            });
                        }else{
                            // Weiterbutton wird ausgeblendet
                            continueButton.style.display = "none";
                            console.log("else");
                        }
                    }
                    
                }




                if(alleFilterUl){
                    var titleSeite = "";
                    if(ausgewaehlterNaviPunkt.length > 0){
                        titleSeite = ausgewaehlterNaviPunkt[0].innerHTML;
                    }else{
                        titleSeite = breadcrumbLastPoint.innerHTML;
                    }
                    alleFilterUl.insertAdjacentHTML("beforebegin", '<h2>'+titleSeite+'</h2>'+
                        '<p class="kk_info">Nutzen Sie die Filter, um schnell einen passenden Artikel zu finden:</p>'+
                        '<div class="kk_filterweiter"></div>'+
                        '<div class="kk_filterzurueck"></div>'+
                        '<div class="kk_filter"></div>');

                    var pFilter = WATO.qs(".kk_filter", filterform);
                    pFilter.insertAdjacentElement("afterbegin", alleFilterUl);

                    scrollBox(alleFilterUl, 1);
                    

                    // Materialdropdown wird umpositioniert
                    WATO.elem('#toggle_filter_FFmaterial', function(material){
                        if(material){
                            var materialDropdown = material[0],
                                listElements = WATO.qsa("li label", materialDropdown),
                                goFilter = WATO.qs("button[data-toggle=toggle_filter_FFmaterial]", materialDropdown);

                            filterform.classList.remove("kk_noMaterials");

                            materialDropdown.parentNode.style.display = "none";
                            pFilter.insertAdjacentElement("afterend", materialDropdown);

                            materialDropdown.insertAdjacentHTML("beforebegin", 
                                '<div class="kk_filterweiter"></div>'+
                                '<div class="kk_filterzurueck"></div>');

                            scrollBox(WATO.qs(".productFilterList", materialDropdown) , 0);

                            for (var i = 0; i < listElements.length; i++) {
                                var thisListLabel = listElements[i];

                                thisListLabel.insertAdjacentHTML("afterend", 
                                '<div class="kk_arrowbox"><button>Anwenden</button></div>');

                                thisListLabel.addEventListener("click", function(e){
                                    // e.preventDefault();
                                    console.log("click material");

                                    closeAllFilters();

                                    var openLayer = WATO.qs(".kk_arrowbox[style*=block]");
                                    if(openLayer){
                                        openLayer.style.display = "none";
                                    }
                                    e.target.nextSibling.style.display = "block";

                                });

                                thisListLabel.nextSibling.addEventListener("click", function(e){
                                    // e.preventDefault();
                                    console.log("click anwenden");
                                    WATO.qs("input", e.target.parentNode.parentNode).checked = true;

                                    // WATO.qs(".button[data-toggle=toggle_filter_FFmaterial]", materialDropdown).click();
                                    // console.log('goFilter: ', WATO.qs(".button[data-toggle=toggle_filter_FFmaterial]", materialDropdown));
                                    goFilter.click();
                                    // filterform.submit();
                                });
                            }
                        }
                    });

                }


                var countArticle = WATO.qs(".breadcrumbs strong:last-child"),
                    sort = WATO.qs(".breadcrumb-productList .js-filter-form"),
                    ansicht = WATO.qs("#toggleModel", filterform),
                    selectedFilters = WATO.qsa(".filterTag", filterform);
                
                filterform.insertAdjacentHTML("beforeend", 
                    '<div class="kk_inforow row">'+
                        countArticle.textContent.replace("(", "").replace(")", "")+
                        '<span><input id="kk_nurvegan" type="checkbox" /><label for="kk_nurvegan">Nur vegane Produkte anzeigen</label></span>'+
                        sort.outerHTML+
                    '</div>');

                WATO.qs(".kk_inforow", filterform).insertAdjacentElement("beforeend", ansicht);

                var nurVeganInput = WATO.qs("#kk_nurvegan", filterform);

                
                for (var j = 0; j < selectedFilters.length; j++) {
                    if(selectedFilters[j].textContent.trim() === "Ja"){
                        selectedFilters[j].textContent = "vegan";

                        nurVeganInput.checked = true;
                    }
                }

                nurVeganInput.addEventListener("change", function(){
                    console.log("change");
                    if(nurVeganInput.checked){
                        console.log("is checked");
                        WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).checked = true;
                        console.log('WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl): ', WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl));
                    }else{
                        console.log("is nicht checked");
                        
                        WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).checked = false;
                        console.log('WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl): ', WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl));
                    }

                    WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl).click();
                        console.log('WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl): ', WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl));
                        
                });



                


                
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
