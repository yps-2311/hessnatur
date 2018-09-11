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

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }

    function goalFlag(){
        goalPush("s5_hover_flag");
    }

    function showBullets($_SDParent) {
        $_SDParent.classList.remove("wa-show-shortDesc");
        goalPush("s5_click_bullets");
    }

    function showMoreMaterials() {
            WATO.qs(".js-pds-more-details").click();
            goalPush("s5_click_plus");
    }

    var setQuality = function($_element, $_fitting, $_quality) {
            if($_element){
                // Wenn keine Passform vorhanden ist, soll es unten stehen wie im Screenshot. Sind es jedoch nur 1 oder 2 Siegel, sollte es dennoch unterhalb der Qualitätsbox stehen.
                if (!$_fitting && WATO.qsa(".column.shrink", $_quality).length >= 3) {
                    WATO.qs(".productInfoTop > .row").insertAdjacentHTML("beforeend", '<div id="wa-box"></div>');

                    WATO.qs("#wa-box").appendChild($_quality);

                } else {
                    $_element.parentNode.insertBefore($_quality, $_element.nextSibling);
                }

                $_element.insertAdjacentHTML("afterend", '<div id="wa-qualitySeal"></div>');
            } else {
                WATO.qs(".productInfoTop > .row > .large-3").insertAdjacentHTML("afterbegin", '<div id="wa-qualitySeal"></div>');
            }
            var pQualitySeal = WATO.qs("#wa-qualitySeal");

            pQualitySeal.addEventListener("click", function(){
                goalPush("s5_click_quality");
            });

            pQualitySeal.addEventListener("mouseover", function(){
                goalPush("s5_hover_quality");
            });
        },
        tmp_set = false;




    WATO.elem("a[data-open=availability-matrix]", function (oAvailMatrix){

        if (oAvailMatrix) {
            oAvailMatrix[0].addEventListener("click", function(){
                goalPush("s5_click_availability");
            });
        }
    });



    // Check if short Description is < 3
    WATO.elem(".pds-cockpit__shortDescription", function(a_ShortDescription) {
        try {
            if (a_ShortDescription) {
                var $_ShortDescription = a_ShortDescription[0],
                    $_SDParent = $_ShortDescription.parentNode;

                if (WATO.qsa("li", $_ShortDescription).length > 3) {

                    $_SDParent.classList.add("wa-show-shortDesc");

                    $_ShortDescription.insertAdjacentHTML("afterend", '<div id="wa-trigger-show"></div>');

                    WATO.qs("#wa-trigger-show").addEventListener("click", function(){
                        showBullets($_SDParent);
                    });
                    $_ShortDescription.addEventListener("click", function(){
                        showBullets($_SDParent);
                    });

                    goalPush("s5_manipulated_bullets");
                }
            }

        } catch(e) {
            goalPush("health_shortDesc");
            //console.log("POLL: pds-cockpit__shortDescription:");
            //console.log(e);
        }
    });

    WATO.elem(".js-pds-more-details", function(a_showMore) {

        try {

            if (a_showMore) {

                a_showMore[0].innerText = "Mehr Produktinformationen";

                a_showMore[0].addEventListener("click", function(){
                    goalPush("s5_more_details");
                });
            }

        } catch(e) {
            goalPush("health_moreDetails");
            //console.log("POLL: js-pds-more-details:");
            //console.log(e);
        }
    });


    // Polling the after element, because there was a timing error when polling the original elements
    WATO.elem('.js-product-detail-images', function(elem) {
        if(elem){        
            try {
                //console.log("polled:");
                //console.log(WATO.qsa(".productInfosItem").length);

                var a_productInfos = WATO.qsa(".productInfosItem"),
                    $_productDescription = false,
                    $_madeIn = false,
                    $_material = false,
                    $_quality = false,
                    $_fitting = false,
                    $_sustainability = false;

                if (a_productInfos) {

                    for (var i = 0; i < a_productInfos.length; i++) {

                        var $_InfoBox = a_productInfos[i],
                            $_h3 = WATO.qs(".h3", $_InfoBox);

                        if ($_h3 !== null) {

                            if ($_h3.innerText === "Produktbeschreibung") {

                                $_productDescription = $_InfoBox;

                                $_productDescription.classList.add("wa-m-t");


                            } else if ($_h3.innerText === "Material") {

                                $_material = $_InfoBox;

                                $_material.classList.add("wa-desc-material");

                                var a_Materials = WATO.qsa("li.row", $_material),
                                    insertHTML = '',
                                    addable = 0,
                                    tmp_where = false;

                                    for (var x = 0; x < a_Materials.length; ++x) {


                                        var check_icon = WATO.qsa("span",a_Materials[x]).length;

                                        if (check_icon === 1) {

                                        //<img src="https://imgs7.hessnatur.com/is/content/HessNatur/Materialicons/Materialicon_baumwolle.svg" alt="100% <a target='_blank' href='https://www.hessnatur.com/magazin/textillexikon/baumwolle/'>Baumwolle</a>">
                                            WATO.qs("span", a_Materials[x]).insertAdjacentHTML('beforebegin', '<div class="column shrink"><img src="https://webarts.s3.amazonaws.com/Hessnatur/2018/Sprint5/divers.svg" width="36px"></div>');
                                        }


                                        if (x > 0 && a_Materials[x-1].innerText === a_Materials[x].innerText) {
                                            continue;
                                        } else {
                                            addable++;
                                        }

                                        if (addable > 2) {
                                            break;
                                        }

                                        insertHTML += a_Materials[x].outerHTML;

                                    }

                                    insertHTML = '<div id="wa-material">' +
                                        '<p>MATERIAL</p>' +
                                        '<ul>' +
                                        insertHTML +
                                        '</ul>' +
                                        (a_Materials.length - 2 > 0 ? '<div class="wa-show-more">+ ' + (a_Materials.length - 2) + ((a_Materials.length - 2 === 1) ? ' weiteres ' : ' weitere ' ) + ' <span></span></div>': '') +
                                        '</div>';


                                    if (WATO.qs("#wa-trigger-show") !== null) {
                                        tmp_where = "#wa-trigger-show";
                                    } else if (WATO.qs(".pds-cockpit__shortDescription") !== null) {
                                        tmp_where = ".pds-cockpit__shortDescription";
                                    } else {
                                        tmp_where = ".js-price-container";
                                    }
                                    WATO.qs(tmp_where).insertAdjacentHTML("afterend", insertHTML);

                                    if (a_Materials.length - 2 > 0) {
                                        goalPush("s5_more_materials");
                                        WATO.qs(".wa-show-more").addEventListener("click", showMoreMaterials);
                                    }

                            } else if ($_h3.innerText === "Made in") {

                                $_madeIn = $_InfoBox;

                                if ($_InfoBox.innerText.indexOf("Deutschland") !== -1) {
                                    WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-ger" class="tooltip-right" data-tt="Made in Germany"></div>');

                                    WATO.qs("#wa-ger").addEventListener("mouseover", goalFlag);


                                } else if (new RegExp("Belgien|Bulgarien|Dänemark|Estland|Finnland|Frankreich|Griechenland|Irland|Italien|Kroatien|Lettland|Litauen|Luxemburg|Malta|Niederlande|Österreich|Polen|Portugal|Rumänien|Slowakei|Slowenien|Spanien|Schweden|Tschechische Republik|Ungarn|Vereinigtes Königreich|Zypern").test($_InfoBox.innerText)) {
                                    WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-eu" class="tooltip-right" data-tt="'+$_InfoBox.innerText.replace("Made in", "")+'"></div>');

                                    WATO.qs("#wa-eu").addEventListener("mouseover", goalFlag);
                                }

                            }  else if ($_h3.innerText === "Ausgezeichnete Qualität") {

                                $_quality = $_InfoBox;

                            } else if ($_h3.innerText === "Passform") {

                                $_fitting = $_InfoBox;

                            } else if ($_h3.innerText === "Messbare Nachhaltigkeit") {
                                $_sustainability = $_InfoBox;
                            }

                        }
                    }

                    if ($_quality && $_madeIn) {

                        tmp_set = $_madeIn;

                    } else if ($_quality && $_material) {

                        tmp_set = $_material;

                    } else if ($_quality && $_sustainability) {

                        tmp_set = $_sustainability;

                    }
                    setQuality(tmp_set, $_fitting, $_quality);


                    if ($_madeIn) {
                        $_productDescription.parentNode.insertBefore($_madeIn, $_productDescription.nextSibling);
                    }

                    if ($_material) {
                        $_productDescription.parentNode.insertBefore($_material, $_productDescription.nextSibling);
                    }
                }

            } catch(e) {
                goalPush("health_main");
                //console.log("POLL: productInfosItem:");
                //console.log(e);
            }
        }
    });

})(new window.WATO());