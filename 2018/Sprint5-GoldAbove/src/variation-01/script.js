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

    console.log("Sprint 5 - Variant Code");

    document.documentElement.classList.add('wa-s5');

    // Check if short Description is < 3
    WATO.elem(".pds-cockpit__shortDescription", function(a_ShortDescription) {
        try {

            if (a_ShortDescription) {
                var $_ShortDescription = a_ShortDescription[0];

                if (WATO.qsa("li", $_ShortDescription).length > 3) {
                    $_ShortDescription.classList.add("wa-show-shortDesc");

                    WATO.qs(".wa-show-shortDesc").addEventListener("click", function(){
                        $_ShortDescription.classList.remove("wa-show-shortDesc");
                    });
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
                a_showMore[0].innerText = "Mehr Produktinformationen";
            }

        } catch(e) {
            console.log("POLL: js-pds-more-details:");
            console.log(e);
        }
    });


    WATO.elem(".productInfosItem", function(a_productInfos) {
        try {

            var $_productDescription = false,
                $_madeIn = false,
                $_material = false,
                $_quality = false,
                $_fitting = false;


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

                            var a_Materials = WATO.qsa("li.row", $_InfoBox),
                                insertHTML = '',
                                moreLink = false;

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

                            WATO.qs(".pds-cockpit__shortDescription").insertAdjacentHTML("afterend", insertHTML);

                            if (moreLink) {
                                WATO.qs(".wa-show-more").addEventListener("click", function(){
                                    WATO.qs(".js-pds-more-details").click();
                                });
                            }

                        } else if ($_h3.innerText === "Made in") {

                            $_madeIn = $_InfoBox;

                            if ($_InfoBox.innerText.indexOf("Deutschland") !== -1) {
                                WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-ger"></div>');

                            } else if (new RegExp("Bosnien Herzegowina|Griechenland|Bulgarien|Italien|Kroatien|Litauen|Mazedonien|Österreich|Polen|Portugal|Rumänien|Slowenien|Spanien|Tschechische Republik|Türkei|Ungarn|Weißrussland").test($_InfoBox.innerText)) {
                                WATO.qs(".js-badges-container").insertAdjacentHTML("beforeend", '<div id="wa-eu"></div>');
                            }
                        }  else if ($_h3.innerText === "Ausgezeichnete Qualität") {

                            $_quality = $_InfoBox;

                        } else if ($_h3.innerText === "Passform") {

                            $_fitting = $_InfoBox;

                        }

                    }
                }

                if ($_quality && $_madeIn) {

                    if ($_fitting) {
                        $_madeIn.parentNode.insertBefore($_quality, $_madeIn.nextSibling);
                    } else {
                        WATO.qs(".productInfoTop > .row").insertAdjacentHTML("beforeend", '<div id="wa-box"></div>');
                        WATO.qs("#wa-box").appendChild($_quality);
                    }

                    $_madeIn.insertAdjacentHTML("afterend", '<div id="wa-qualitySeal"></div>');

                } else if ($_fitting && $_quality && $_material) {

                    if ($_fitting) {
                        $_material.parentNode.insertBefore($_quality, $_material.nextSibling);
                    }

                    $_material.insertAdjacentHTML("afterend", '<div id="wa-qualitySeal"></div>');

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
    });

})(new window.WATO());
