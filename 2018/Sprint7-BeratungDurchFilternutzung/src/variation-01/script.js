// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    // var urlSearch = window.location.search,
    var msgArray = [
                '<b>Das passt:</b> Sie sehen nur noch Produkte, die auch auch in den von Ihnen gewählten Größen verfügbar sind.',
                // '<b>Tipp:</b> Sie können auf der Artikel-Detailseite den Größenberater nutzen.',
                '<b>Das ist uns wichtig:</b> Alle Farben entsprechen den höchsten derzeit möglichen ökologischen Standards.',
                '<b>Fair Fashion zu fairen Preisen:</b> Es werden nur noch Produkte in Ihren Preisvorstellungen angezeigt.',
                '<b>Wussten Sie das?</b> Die Materialen werden über das hauseigene Qualitätssicherungssystem kontinuierlich überprüft.',
                '<b>Der Filter wurde erfolgreich angewendet:</b> Sie machen Ihre Auswahl leichter.'
                ];

    function closeAllFilters() {
        // Alle offenden Filter werden geschlossen
        var openFilter = WATO.qs(".buttonTab.hover");
        if(openFilter){
            openFilter.click();
        }
    }
    // function getMsgrow(wohin, id1, id2) {
    //     if(wohin){
    //         wohin.innerHTML =  '<div class="kk_msgRow">'+msgArray[id1]+'</div>'+
    //                             (id2 ? '<div class="kk_msgRow">'+msgArray[id2]+'</div>' : "");
    //     }
    // }
    function setMessageRow(id) {
        // Die Zeile mit dem zuletzt angewanten Filter wird geschrieben
        var msg = WATO.qs(".kk_msg");
        if(msg){
            msg.innerHTML = '<div class="kk_msgRow">'+msgArray[id]+'</div>';
        }
    }
    function clickInputFilter(e) {
        // Die geklickten Filter werden je nach Typ ins Localstorage geschrieben
        if(e.target){
            switch (e.target.getAttribute("data-facet-code")) {
                case "FFfilterSize":
                    setLSFilterType("s");
                    break;
                case "colorgroup":
                    setLSFilterType("c");
                    break;
                case "price":
                    setLSFilterType("p");
                    break;
                default:
                    setLSFilterType("d");
                    break;
            }
        }
    }
    function displayNone(elem) {
        if(elem){
            elem.style.display = "none";
            return elem;
        }
    }
    function displayBlock(elem) {
        if(elem){
            elem.style.display = "block";
            return elem;
        }
    }
    function setLSFilterType(typeString) {
        window.localStorage.setItem("kk_filterType",typeString);
    }
    function getLSFilterType(){
        var type = window.localStorage.getItem("kk_filterType");
        setLSFilterType("");
        return type;
    }
    function getLeftpx(widthFilters, widthlistWrapper, inclMaterial) {
        return ((widthFilters - widthlistWrapper - (inclMaterial ? 0 : 10)) - 10);
    }
    function buttonsFade(list, inclMaterial) {
        var listWrapper = list.parentNode;
        
        if((158*(list.children.length - inclMaterial)) > (listWrapper.parentNode.offsetWidth - 165)) {
            displayBlock(listWrapper.previousSibling.previousSibling);
        }else{
            displayNone(listWrapper.previousSibling.previousSibling);
        }
    }
    function scrollBox(list, inclMaterial) {

        if(list){
            var listWrapper = list.parentNode,
                countFilters = list.children.length - inclMaterial, // Anzahl der Filter
                continueButton = listWrapper.previousSibling.previousSibling, // Weiterbutton
                backButton = listWrapper.previousSibling, // Zurückbutton
                widthFilters = (158*countFilters),  // Breite der Filter, eine Box ist 158px breit
                widthBox = listWrapper.parentNode.offsetWidth; // Breite des Divs indem die Filter liegen
                
                // console.log('widthFilters: ', widthFilters);
                // console.log('widthBox: ', widthBox);

            // "data-step" wird true wenn es beim sliden mehr als ganz links und ganz rechts gibt
            // bedeutet: sollte der User sehr viele Filter und einen kleine Bildschirmbreite haben
            // wird nicht nur die Scrollfunktion eingebaut sondern auch ein Zwischenhalt
            listWrapper.setAttribute("data-step", "start"); // false

            // if(widthFilters > (widthBox - 165)) {

            var sliderZwischenstop = widthFilters > ((widthBox - 250) *2);

            // weiterbutton
            continueButton.addEventListener("click", function(){
                // var newLeft = ((widthFilters - listWrapper.offsetWidth - (inclMaterial ? 0 : 10)) - 10);
                var newLeft = getLeftpx(widthFilters, listWrapper.offsetWidth, inclMaterial);

                if(listWrapper.getAttribute("data-step") === "start" && sliderZwischenstop){ // false
                    newLeft = newLeft / 2;
                    listWrapper.setAttribute("data-step", "mid"); //true
                }else{
                    displayNone(continueButton);
                    listWrapper.setAttribute("data-step", "end"); // false
                }

                // Verschieben
                list.style.left = "-"+newLeft+"px";

                // Zurückbutton einblenden
                displayBlock(backButton);

                closeAllFilters();
            });

            // zurückbutton
            backButton.addEventListener("click", function(){
                var newLeft = 0;

                if(listWrapper.getAttribute("data-step") === "end" && sliderZwischenstop){ // false
                    newLeft = getLeftpx(widthFilters, listWrapper.offsetWidth, inclMaterial) / 2;
                    listWrapper.setAttribute("data-step", "mid"); // true
                }else{
                    displayNone(backButton);
                    listWrapper.setAttribute("data-step", "start"); // false
                }

                // Verschieben
                list.style.left = "-"+newLeft+"px";

                displayBlock(continueButton);

                closeAllFilters();
            });


            buttonsFade(list, inclMaterial);
            // if(widthFilters > (widthBox - 165)) {
            //     displayBlock(continueButton);
            // }else{
            //     // Weiterbutton wird ausgeblendet
            //     // continueButton.style.display = "none";
            //     displayNone(continueButton);
            // }
        }
    }
    function allScrollingToDefault() {
        WATO.elem('.kk_filter > ul, #toggle_filter_FFmaterial > ul', function(slider){
            if(slider){
                try {
                    var slider1 = slider[0],
                        slider2 = slider[1];
                    
                    if(slider1){
                        slider1.style.left = "0";
                        buttonsFade(slider1, 1);
                        // displayBlock(displayNone(slider1.parentNode.previousSibling).previousSibling);
                    }
                    if(slider2){
                        slider2.style.left = "0";
                        buttonsFade(slider2, 0);
                        // displayBlock(displayNone(slider2.parentNode.previousSibling).previousSibling);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }
    function clickMaterial(e) {
        try {
            // console.log("click material");

            setLSFilterType("m");

            closeAllFilters();

            var openLayer = WATO.qs(".kk_arrowbox[style*=block]");
            if(openLayer){
                displayNone(openLayer);
            }

            displayBlock(WATO.qs(".kk_arrowbox", e.target.closest(".column")));

        } catch (error) {
            console.log(error);
        }
    }

    function filterAnwenden() {
        var goFilter = WATO.qs("button[data-toggle=toggle_filter_FFmaterial]");
        if(goFilter){
            goFilter.click();
        }
    }
    
    WATO.elem('.gridviewProductFilterDesktopWrapper .js-filter-form', function(filterformX){

        if(filterformX){
            try {

                var filterform = filterformX[0],
                    alleFilterUl = WATO.qs(".filterVariations", filterform),
                    ausgewaehlterNaviPunkt = WATO.qsa(".sidebarNav--nav .h-text-bold"),
                    breadcrumbLastPoint = WATO.qs(".breadcrumbs.h-no-margin >li:last-child span strong:first-child");

                filterform.classList.add("kk_noMaterials");

                if(alleFilterUl){
                    var titleSeite = "",
                        interactButtons =   '<div class="kk_filterweiter"></div>'+
                                            '<div class="kk_filterzurueck"></div>';

                    if(ausgewaehlterNaviPunkt.length > 0){
                        titleSeite = ausgewaehlterNaviPunkt[0].innerHTML;
                    }else{
                        titleSeite = breadcrumbLastPoint.innerHTML;
                    }
                    alleFilterUl.insertAdjacentHTML("beforebegin", '<h2>'+titleSeite+'</h2>'+
                        '<p class="kk_info">Nutzen Sie die Filter, um schnell einen passenden Artikel zu finden:</p>'+
                        interactButtons+
                        '<div class="kk_filter"></div>');

                    var pFilter = WATO.qs(".kk_filter", filterform),
                        filterReihenfolge = ["FFpassform", "FFprice","colorgroup","FFfilterSize", "FFassortment", "FFproductgroup"]; // Reihenfolge ist von hinten nach vorne
                    
                    pFilter.insertAdjacentElement("afterbegin", alleFilterUl);

                    // Filterreihenfolge nach Konzept wechseln
                    for (var i = 0; i < filterReihenfolge.length; i++) {
                        var filterElement = WATO.qs("#toggle_filter_"+filterReihenfolge[i], alleFilterUl);
                        if(filterElement){
                            alleFilterUl.insertAdjacentElement("afterbegin", filterElement.parentNode);
                        }
                    }

                    scrollBox(alleFilterUl, 1);

                    window.onresize = function() {
                        // console.log("resize");

                        allScrollingToDefault();
                        closeAllFilters();
                    };
                    

                    // Materialdropdown wird umpositioniert
                    WATO.elem('#toggle_filter_FFmaterial', function(material){
                        if(material){
                            try {

                                var materialDropdown = material[0],
                                    listElements = WATO.qsa("li label", materialDropdown);

                                filterform.classList.remove("kk_noMaterials");

                                // materialDropdown.parentNode.style.display = "none";
                                displayNone(materialDropdown.parentNode);

                                pFilter.insertAdjacentElement("afterend", materialDropdown);

                                materialDropdown.insertAdjacentHTML("beforebegin", interactButtons);

                                scrollBox(WATO.qs(".productFilterList", materialDropdown) , 0);

                                for (var i = 0; i < listElements.length; i++) {
                                    var thisListLabel = listElements[i];

                                    thisListLabel.insertAdjacentHTML("afterend", 
                                    '<div class="kk_arrowbox"><button>Anwenden</button></div>');

                                    

                                    thisListLabel.addEventListener("click", clickMaterial);

                                    thisListLabel.nextSibling.addEventListener("click", filterAnwenden);
                                }
                                
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    });

                    var alleInputs = WATO.qsa("input.productFilterInput", alleFilterUl);

                    for (var k = 0; k < alleInputs.length; k++) {
                        alleInputs[k].addEventListener("click", clickInputFilter);
                    }
                }

                var countArticle = WATO.qs(".breadcrumbs strong:last-child"),
                    sort = WATO.qs(".breadcrumb-productList .js-filter-form"),
                    ansicht = WATO.qs("#toggleModel", filterform),
                    selectedFilters = WATO.qsa(".filterTag", filterform);
                
                filterform.insertAdjacentHTML("beforeend", 
                    '<div class="kk_msg row"></div>'+
                    '<div class="kk_inforow row">'+
                        (countArticle ? countArticle.textContent.replace("(", "").replace(")", "") : "")+
                        '<span class="kk_vegan"><input id="kk_nurvegan" type="checkbox" /><label for="kk_nurvegan">Nur vegane Produkte anzeigen</label></span>'+
                        (sort ? sort.outerHTML : "")+
                    '</div>');

                WATO.qs(".kk_inforow").insertAdjacentElement("beforeend", ansicht);

                var nurVeganInput = WATO.qs("#kk_nurvegan", filterform);
                    // messageBox = WATO.qs(".kk_msg", filterform);

                // Zeile mit "nur Vegane Produkte anzeigen" wird nur einbeblendet wenn dieser Filter überhaupt vorhanden ist
                WATO.elem('#toggle_filter_FFvegan', function(toggle_filter_FFvegan){
                    if(toggle_filter_FFvegan){
                        try {
                            WATO.qs(".kk_vegan", filterform).style.visibility = "visible";
        
                            // Nur Vegan 
                            nurVeganInput.addEventListener("change", function(){
                                try {
                                    WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).click();
                                    WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl).click();
                                } catch (error) {
                                    console.log(error);
                                }
                                // console.log("change");
                                // if(nurVeganInput.checked){
                                //     console.log("is checked");
                                //     // WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).checked = true;
                                //     WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).click();
            
                                //     console.log('WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl): ', WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl));
                                // }else{
                                //     console.log("is nicht checked");
                                    
                                //     WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).checked = false;
                                //     console.log('WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl): ', WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl));
                                // }
            
                                // console.log('WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl): ', WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl));
                            });
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });

                for (var j = 0; j < selectedFilters.length; j++) {
                    var filterChoice = selectedFilters[j].textContent.trim();
                    if(filterChoice === "Ja"){
                        // Filter "Vegan" ist gewählt
                        selectedFilters[j].textContent = "vegan";

                        nurVeganInput.checked = true;
                    }
                }

                // console.log("type: ", getLSFilterType());

                // "Filter-genutzt" Messages
                // if(urlSearch.indexOf("filterSize") !== -1){
                //     // Filter "Größe" ist gewählt
                //     getMsgrow(messageBox, 0); // , 1
                // }else if(urlSearch.indexOf("colorgroup") !== -1){
                //     // Filter "Farbe" ist gewählt
                //     getMsgrow(messageBox, 2);
                // }else if(urlSearch.indexOf("price") !== -1){
                //     // Filter "Preis" ist gewählt
                //     getMsgrow(messageBox, 3);
                // }else if(urlSearch.indexOf("material") !== -1){
                //     // Filter "Material" ist gewählt
                //     getMsgrow(messageBox, 4);
                // }else if(messageBox.textContent.length === 0 && urlSearch.indexOf("?q=") !== -1){
                //     // ein anderer Filter wurde gewählt
                //     getMsgrow(messageBox, 5);
                // }

                switch (getLSFilterType()) {
                    case "s":
                    setMessageRow(0);
                        break;
                    case "c":
                    setMessageRow(1);
                        break;
                    case "p":
                    setMessageRow(2);
                        break;
                    case "m":
                    setMessageRow(3);
                        break;
                    case "d":
                    setMessageRow(4);
                        break;
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
})(new window.WATO(), window);
