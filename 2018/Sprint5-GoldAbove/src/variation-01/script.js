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

    console.log("Sprint 5 - Variant Code b");

    document.documentElement.classList.add('wa-s5');

    function klickDetails(){
        WATO.qs(".js-pds-more-details").click();
        goalPush("s5_click_plus");
    }

    function goalFlag(){
        goalPush("s5_hover_flag");
    }




    WATO.elem("a[data-open=availability-matrix]", function (oAvailMatrix){

        if (oAvailMatrix) {
            oAvailMatrix[0].addEventListener("click", function(){
                goalPush("s5_click_availability");
            });
        }
    });





    function goalPush(key){
        window.iridion.push(['goal', key]);
    }

    // Check if short Description is < 3
    WATO.elem(".pds-cockpit__shortDescription", function(a_ShortDescription) {
        try {

            if (a_ShortDescription) {
                var $_ShortDescription = a_ShortDescription[0];

                if (WATO.qsa("li", $_ShortDescription).length > 3) {
                    $_ShortDescription.classList.add("wa-show-shortDesc");

                    WATO.qs(".wa-show-shortDesc").addEventListener("click", function(){
                        $_ShortDescription.classList.remove("wa-show-shortDesc");

                        goalPush("s5_click_bullets");
                    });

                    goalPush("s5_manipulated_bullets");
                }
            }

        } catch(e) {
            console.log("POLL: pds-cockpit__shortDescription:");
            console.log(e);
        }
    });

    WATO.elem(".js-pds-more-details", function(a_showMore) {

        try {

            if (a_showMore) {
                a_showMore[0].addEventListener("click", function(){
                    goalPush("s5_more_details");

                });
                a_showMore[0].innerText = "Mehr Produktinformationen";
            }

        } catch(e) {
            console.log("POLL: js-pds-more-details:");
            console.log(e);
        }
    });


    // Polling the after element, because there was a timing error when polling the original elements
    WATO.elem('.js-product-detail-images', function(elem) {
        if(elem){        
            try {
                console.log("polled:");
                console.log(WATO.qsa(".productInfosItem").length);

                var a_productInfos = WATO.qsa(".productInfosItem"),
                    $_productDescription = false,
                    $_madeIn = false,
                    $_material = false,
                    $_quality = false,
                    $_fitting = false;
                
                console.log('a_productInfos: ', a_productInfos);

                if (a_productInfos) {

                    for (var i = 0; i < a_productInfos.length; i++) {

                        var $_InfoBox = a_productInfos[i],
                            $_h3 = WATO.qs(".h3", $_InfoBox);

                        console.log($_InfoBox);

                        if ($_h3 !== null) {

                            console.log($_h3.innerText);

                            if ($_h3.innerText === "Produktbeschreibung") {

                                $_productDescription = $_InfoBox;

                                $_productDescription.classList.add("wa-m-t");


                            } else if ($_h3.innerText === "Material") {

                                $_material = $_InfoBox;


                                $_material.classList.add("wa-desc-material");

                                var a_Materials = WATO.qsa("li.row", $_material),
                                    insertHTML = '',
                                    moreLink = false;

                                console.log(a_Materials.length);

                                    for (var x = 0; x < a_Materials.length; ++x) {
                                        if (x === 2) {
                                            moreLink = true;
                                            break;
                                        }
                                        insertHTML += a_Materials[x].outerHTML;
                                    }



                                    insertHTML = '<div id="wa-material">' +
                                        '<p>MATERIAL</p>' +
                                        '<ul>' +
                                        insertHTML +
                                        '</ul>' +
                                        (moreLink ? '<div class="wa-show-more">+ ' + (a_Materials.length - 2) + ' weitere <span></span></div>': '') +
                                        '</div>';

                                    if (WATO.qs(".pds-cockpit__shortDescription") !== null) {
                                        WATO.qs(".pds-cockpit__shortDescription").insertAdjacentHTML("afterend", insertHTML);
                                    } else {
                                        WATO.qs(".js-price-container").insertAdjacentHTML("afterend", insertHTML);
                                    }




                                    if (moreLink) {
                                        goalPush("s5_more_materials");
                                        WATO.qs(".wa-show-more").addEventListener("click", klickDetails);
                                    }


                                    

                            } else if ($_h3.innerText === "Made in") {

                                $_madeIn = $_InfoBox;

                                if ($_InfoBox.innerText.indexOf("Deutschland") !== -1) {
                                    WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-ger"></div>');

                                    WATO.qs("#wa-ger").addEventListener("mouseover", goalFlag);

                                } else if (new RegExp("Bosnien Herzegowina|Griechenland|Bulgarien|Italien|Kroatien|Litauen|Mazedonien|Österreich|Polen|Portugal|Rumänien|Slowenien|Spanien|Tschechische Republik|Türkei|Ungarn|Weißrussland").test($_InfoBox.innerText)) {
                                    WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-eu" class="tooltip-right" data-tt="'+$_InfoBox.innerText.replace("Made in", "")+'"></div>');

                                    WATO.qs("#wa-eu").addEventListener("mouseover", goalFlag);
                                }



                            }  else if ($_h3.innerText === "Ausgezeichnete Qualität") {

                                $_quality = $_InfoBox;




                            } else if ($_h3.innerText === "Passform") {

                                $_fitting = $_InfoBox;

                            }

                        }
                    }

                    console.log("a");


                    var setQuality = function($_element) {
                        console.log('$_element: ', $_element);
                        // Wenn keine Passform vorhanden ist, soll es unten stehen wie im Screenshot. Sind es jedoch nur 1 oder 2 Siegel, sollte es dennoch unterhalb der Qualitätsbox stehen.


                        if (!$_fitting && WATO.qsa(".column.shrink", $_quality).length >= 3) {
                            WATO.qs(".productInfoTop > .row").insertAdjacentHTML("beforeend", '<div id="wa-box"></div>');
                            console.log('WATO.qs(".productInfoTop > .row"): ', WATO.qs(".productInfoTop > .row"));
                            WATO.qs("#wa-box").appendChild($_quality);
                            console.log('WATO.qs("#wa-box"): ', WATO.qs("#wa-box"));
                        } else {
                            $_element.parentNode.insertBefore($_quality, $_element.nextSibling);
                        }

                        if($_element){
                            $_element.insertAdjacentHTML("afterend", '<div id="wa-qualitySeal"></div>');

                            console.log('WATO.qs("#wa-qualitySeal"): ', WATO.qs("#wa-qualitySeal"));

                            var pQualitySeal = WATO.qs("#wa-qualitySeal");
                            
                            pQualitySeal.addEventListener("click", function(){
                                goalPush("s5_click_quality");
                            });
    
                            pQualitySeal.addEventListener("mouseover", function(){
                                goalPush("s5_hover_quality");
                            });
                        }

                        
                    };

                    //goalPush("s5_engagement_details");
                    console.log('$_quality: ', $_quality);
                    console.log('$_madeIn: ', $_madeIn);
                    console.log('$_material: ', $_material);



                    if ($_quality && $_madeIn) {
                        setQuality($_madeIn);

                    } else if ($_quality && $_material) {
                        setQuality($_material);
                    }

                    if ($_madeIn) {
                        $_productDescription.parentNode.insertBefore($_madeIn, $_productDescription.nextSibling);
                    }

                    if ($_material) {
                        $_productDescription.parentNode.insertBefore($_material, $_productDescription.nextSibling);
                    }
                }

            } catch(e) {
                console.log("POLL: productInfosItem:");
                console.log(e);
            }
        }
    });

})(new window.WATO());