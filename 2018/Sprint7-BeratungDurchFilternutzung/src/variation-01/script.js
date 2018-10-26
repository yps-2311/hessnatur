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

    // Nachrichten die nach Anwendung von Filtern und dem Reload angezeigt werden
    var msgArray = [
                '<b>Das passt:</b> Sie sehen nur noch Produkte, die auch auch in den von Ihnen gewählten Größen verfügbar sind.',
                '<b>Das ist uns wichtig:</b> Alle Farben entsprechen den höchsten derzeit möglichen ökologischen Standards.',
                '<b>Fair Fashion zu fairen Preisen:</b> Es werden nur noch Produkte in Ihren Preisvorstellungen angezeigt.',
                '<b>Wussten Sie das?</b> Die Materialien werden über das hauseigene Qualitätssicherungssystem kontinuierlich überprüft.',
                '<b>Sehr gut!</b> Sie sehen jetzt nur noch vegane Produkte.', 
                '<b>Sehr gut!</b> Sie haben erfolgreich Ihre Auswahl verfeinert.'
                ];
    
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
    function closeMaterialCTA() {
        // die "Anwenden" Buttons die unter den Materialien eingeblendet werden können,
        // werden hiermit geschlossen
        var openLayer = WATO.qs(".kk_arrowbox[style*=block]");
        if(openLayer){
            displayNone(openLayer);
        }
    }
    function closeAllFilters() {
        // Alle offenden Filter werden geschlossen
        var openFilter = WATO.qsa(".buttonTab.hover");
        if(openFilter.length > 0){
            for (var o = 0; o < openFilter.length; o++) {
                openFilter[o].click();
            }
            // openFilter.click();
        }
        closeMaterialCTA();
    }
    function setMessageRow(id) {
        // Die Zeile mit dem zuletzt angewanten Filter wird geschrieben
        var msg = WATO.qs(".kk_msg");
        if(msg){
            msg.innerHTML = '<div class="kk_msgRow">'+msgArray[id]+'</div>';
        }
    }
    function setFilterGreen(thisFilterLi) {
        // Von allen aktiven Filter-Inputs werden die Dropdown-Heads grün gefärbt
        if(thisFilterLi){
            thisFilterLi.classList.remove("kk_green");

            if(WATO.qs("input:checked", thisFilterLi) !== null){
                thisFilterLi.classList.add("kk_green");

                // Goal: Filter genutzt
                // pushIridionGoal("useFilter");
            }
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
    function clickInputFilter(e) {
        var thisTarget = e.target;
        if(thisTarget){

            // Die geklickten Filter werden je nach Typ ins Localstorage geschrieben
            switch (thisTarget.getAttribute("data-facet-code")) {
                case "FFfilterSize":
                    setLSFilterType("s");
                    break;
                case "colorgroup":
                    setLSFilterType("c");
                    break;
                case "price":
                    setLSFilterType("p");
                    break;
                case "FFvegan":
                    setLSFilterType("v");
                    break;
                default:
                    setLSFilterType("d");
                    break;
            }

            // Beim Klick auf eine Checkbox wird das jeweinige Dropdown-Head grün gefärbt
            var thisFilterLi = thisTarget.parentNode.parentNode.parentNode.parentNode; //thisTarget.closest(".h-pos-relative");

            if(thisFilterLi.classList.contains("dropdown-pane")){
                thisFilterLi = thisFilterLi.parentNode;
            }

            thisFilterLi.classList.remove("kk_green");

            if(WATO.qs("input:checked", thisFilterLi) !== null){
                thisFilterLi.classList.add("kk_green");
            }
            setFilterGreen(thisFilterLi);
        }
    }
    function getLeftpx(widthFilters, widthlistWrapper, inclMaterial) {
        
        console.log('navigator.userAgent.indexOf("MSIE"): ', navigator.userAgent.indexOf("MSIE"));
        if(navigator.userAgent.indexOf("MSIE") !== -1){
            widthFilters = widthFilters-100;
        }

        console.log('widthFilters: ', widthFilters);
        console.log('widthlistWrapper: ', widthlistWrapper);
        console.log('inclMaterial: ', inclMaterial);
        console.log('(widthFilters - widthlistWrapper - (inclMaterial ? 0 : 10)) - 10: ', (widthFilters - widthlistWrapper - (inclMaterial ? 0 : 10)) - 10);


        // Bei der Filter-Zeile "Material" müssen weitere 10px entfernt werden,
        // damit beim nach rechts scrollen der letzte Filter den richtigen Abstand zum Rand hat
        return ((widthFilters - widthlistWrapper - (inclMaterial ? 0 : 10)) ); //- 10
    }
    function buttonsFade(list, inclMaterial) {
        var listWrapper = list.parentNode;

        // console.log('listWrapper: ', listWrapper);
        // console.log('list.children.length: ', list.children.length);
        // console.log('inclMaterial: ', inclMaterial);
        
        if((158*(list.children.length - inclMaterial)) > (listWrapper.parentNode.offsetWidth - (inclMaterial ? 204 : 65))) {
            displayBlock(listWrapper.previousSibling.previousSibling);
            WATO.goalPush("showSlider");
        }else{
            displayNone(listWrapper.previousSibling.previousSibling);
        }
        displayNone(listWrapper.previousSibling);
    }
    function scrollBox(list, inclMaterial) {

        if(list){
            var listWrapper = list.parentNode,
                countFilters = list.children.length - inclMaterial, // Anzahl der Filter
                continueButton = listWrapper.previousSibling.previousSibling, // Weiterbutton
                backButton = listWrapper.previousSibling, // Zurückbutton
                widthFilters = (158*countFilters),  // Breite der Filter, eine Box ist 158px breit
                widthBox = listWrapper.parentNode.offsetWidth; // Breite des Divs indem die Filter liegen
                // AnwendenButtons = WATO.qsa("button.button", list);


                console.log('countFilters: ', countFilters);
                console.log('widthFilters: ', widthFilters);
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

                WATO.goalPush("klickScroll");

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
            setLSFilterType("m");

            closeAllFilters();

            var thisTargetParent = e.target.parentNode;
            
            if(thisTargetParent.classList.contains("productFilterLabel")){
                thisTargetParent = thisTargetParent.parentNode;
            }

            displayBlock(WATO.qs(".kk_arrowbox", thisTargetParent));

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

    // WATO.elem('.gridviewProductFilterDesktopWrapper .js-filter-form', function(filterformX){
    WATO.elem('.filterVariations', function(filterformX){
        
        console.log('filterformX: ', filterformX);

        if(filterformX){
            try {

                var alleFilterUl = filterformX[0], //WATO.qs(".filterVariations", filterform),
                    filterform = WATO.qs(".gridviewProductFilterDesktopWrapper .js-filter-form"),
                    ausgewaehlterNaviPunkt = WATO.qsa(".sidebarNav--nav .h-text-bold"),
                    breadcrumbLastPoint = WATO.qs(".breadcrumbs.h-no-margin >li:last-child span strong:first-child"),
                    ogTitleMeta = WATO.qs('meta[property="og:title"]');
                    
                    console.log('alleFilterUl: ', alleFilterUl);
                    console.log('ausgewaehlterNaviPunkt: ', ausgewaehlterNaviPunkt);
                    console.log('breadcrumbLastPoint: ', breadcrumbLastPoint);

                filterform.classList.add("kk_noMaterials");

                if(alleFilterUl){
                    var titleSeite = "",
                        interactButtons =   '<div class="kk_filterweiter"></div>'+
                                            '<div class="kk_filterzurueck"></div>';

                    if(ausgewaehlterNaviPunkt.length > 0){
                        titleSeite = ausgewaehlterNaviPunkt[ausgewaehlterNaviPunkt.length-1].innerHTML;
                    }else if(breadcrumbLastPoint){
                        titleSeite = breadcrumbLastPoint.innerHTML;
                    }else if(ogTitleMeta){
                        titleSeite = ogTitleMeta.getAttribute("content");
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
                    
                    scrollBox(alleFilterUl, WATO.qsa("#toggle_filter_FFmaterial").length);

                    window.onresize = function() {
                        // console.log("resize");

                        allScrollingToDefault();
                        closeAllFilters();

                        // Punchout
                        var current = window.innerWidth || document.body.clientWidth;
                        if(current <= 1024){                            
                            window.location.reload(true);
                            window.location.href = window.location.href;
                        }
                    };
                    

                    // Materialdropdown wird umpositioniert
                    WATO.elem('#toggle_filter_FFmaterial', function(material){
                        if(material){
                            try {
                                var materialDropdown = material[0],
                                    listElements = WATO.qsa("li label", materialDropdown),
                                    allMaterialFilterPoints = WATO.qsa(".column", materialDropdown);

                                filterform.classList.remove("kk_noMaterials");

                                // materialDropdown.parentNode.style.display = "none";
                                displayNone(materialDropdown.parentNode);

                                pFilter.insertAdjacentElement("afterend", materialDropdown);

                                materialDropdown.insertAdjacentHTML("beforebegin", interactButtons);

                                if(allMaterialFilterPoints.length > 0){
                                    for (var m = 0; m < allMaterialFilterPoints.length; m++) {
                                        var thisFilterPoint = allMaterialFilterPoints[m],
                                            thisFilterInput = WATO.qs("input.productFilterInput:checked", thisFilterPoint);

                                        if(thisFilterPoint.textContent.indexOf(titleSeite) !== -1){
                                            thisFilterPoint.parentNode.insertAdjacentElement("afterbegin", thisFilterPoint);
                                        }
                                        // Bereits angewante Filter sollen grün hinterlegt sein
                                        if(thisFilterInput){
                                            thisFilterPoint.style.backgroundColor = "#daeec6";

                                            // Goal: Materialfilter genutzt
                                            // pushIridionGoal("useMaterialFilter");
                                        }
                                        
                                    }
                                }

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

                    var alleFilterpunkte = WATO.qsa(".column.h-pos-relative", alleFilterUl);

                    // for (var k = 0; k < alleInputs.length; k++) {
                    //     alleInputs[k].addEventListener("click", clickInputFilter);
                    // }

                    for (var n = 0; n < alleFilterpunkte.length; n++) {
                        var thisFilter = alleFilterpunkte[n],
                            thisAllInputs = WATO.qsa("input.productFilterInput", thisFilter);

                        setFilterGreen(thisFilter);

                        for (var k = 0; k < thisAllInputs.length; k++) {
                            thisAllInputs[k].addEventListener("click", clickInputFilter);
                        }
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
                        // (sort ? sort.outerHTML : "")+
                    '</div>');

                
                if(ansicht){
                    WATO.qs(".kk_inforow").insertAdjacentElement("beforeend", ansicht);
                    ansicht.addEventListener("click", function(){
                        // Goal: Ansicht genutzt
                        WATO.goalPush("useProductView", true);
                    });
                }
                

                var veganDiv = WATO.qs(".kk_vegan", filterform),
                    nurVeganInput = WATO.qs("#kk_nurvegan", veganDiv);
                    // messageBox = WATO.qs(".kk_msg", filterform);

                if(sort){
                    veganDiv.insertAdjacentElement("afterend", sort);
                }

                // Zeile mit "nur Vegane Produkte anzeigen" wird nur einbeblendet wenn dieser Filter überhaupt vorhanden ist
                WATO.elem('#toggle_filter_FFvegan', function(toggle_filter_FFvegan){
                    if(toggle_filter_FFvegan){
                        try {
                            veganDiv.style.visibility = "visible";
        
                            // Nur Vegan 
                            nurVeganInput.addEventListener("change", function(){
                                try {
                                    // Goal: Veganfilter genutzt
                                    WATO.goalPush("useVeganFilter", true);

                                    setLSFilterType("v");
                                    WATO.qs("#desktop__filter_FFvegan_Ja", alleFilterUl).click();
                                    WATO.qs("button[data-toggle=toggle_filter_FFvegan]", alleFilterUl).click();
                                } catch (error) {
                                    console.log(error);
                                }
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

                // Nachrichten werden speziell nach den zuletzverwendeten Filtern angezeigt
                // außer man hat alle Filter zurückgesetzt
                if(window.location.search !== "?viewMode=model" && window.location.search !== ""){
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
                        case "v":
                        setMessageRow(4);
                            break;
                        case "d":
                        setMessageRow(5);
                            break;
                    }
                }

                
                

                // Alle Filter werden eingeklappt wenn man irgendwo hinklickt auf der Seite außer auf die Filter selbst
                WATO.qs("body").addEventListener("mouseup", function(e){
                    try {
                        var eventTarget = e.target,
                            parentObjektIsDropdownpane = e.target.closest(".dropdown-pane");
                        
                        if((eventTarget.classList && !eventTarget.classList.contains("buttonTab")) && // Reiter
                            (parentObjektIsDropdownpane === null || (parentObjektIsDropdownpane && parentObjektIsDropdownpane.getAttribute("id") === "toggle_filter_FFmaterial"))){ // Ausklapp-Dropdowns
                            
                            closeAllFilters();
                        }
                        closeMaterialCTA();

                    } catch (error) {
                        console.log(error);
                    }
                });

                filterform.parentNode.style.opacity = 1;


            } catch (error) {
                console.log(error);
            }
        }
    });

    WATO.goals();
    
    
})(new window.WATO(), window);
