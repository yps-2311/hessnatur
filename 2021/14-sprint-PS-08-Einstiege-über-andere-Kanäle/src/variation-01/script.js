// load core and global js
//@prepros-prepend  "../global/global.js";

/**
 * @function
 * @author FH
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    var PATHNAME = location.pathname,
        currentCategory = false, // current category
        htmlTag = WATO.qs('html'),

        badges = '', // list of badges linked to the product
        boxTxtContent,
        boxBadgeUrl,

        // Table with all messages ti displaying
        messageByCat = {
            'baby': [
                {'Aktion': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Kindermode aus Naturfasern<br>15% Rabatt mit Code JUNIOR21']},
                {'Sale': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Kindermode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>']},
                {'Kundenfavorit': ['https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg', 'Bio-Kindermode aus Naturfasern<br><b>Unserer Topseller des Monats</b>']},
                {'Neu': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg', 'Bio-Kindermode aus Naturfasern<br><b>Neu im Sortiment</b>']},
                {'Allgemein': ['Nachhaltig', 'Bio-Kindermode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']}
            ],
            'home': [
                {'Aktion': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Gut für Mensch & Natur<br>15% sparen mit Code HOME21']},
                {'Sale': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Gut für Mensch & Natur<br><b>Jetzt zum reduzierten Preis</b>']},
                {'Kundenfavorit': ['https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg', 'Gut für Mensch & Natur<br><b>Unserer Topseller des Monats</b>']},
                {'Neu': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg', 'Gut für Mensch & Natur<br><b>Neu im Sortiment</b>']},
                {'Allgemein': ['Nachhaltig', 'Gut für Mensch & Natur<br><b>Optimale Preis/Leistung</b>']}
            ],
            'herren': [
                {'Aktion': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Mode aus Naturfasern<br>15% Rabatt mit Code OUTDOOR21']},
                {'Sale': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>']},
                {'Kundenfavorit': ['https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg', 'Bio-Mode aus Naturfasern<br><b>Unserer Topseller des Monats</b>']},
                {'Neu': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg', 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>']},
                {'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']}
            ],
            'damen': [
                {'Aktion': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Mode aus Naturfasern<br>15% Rabatt mit Code OUTDOOR21']},
                {'Sale': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg', 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>']},
                {'Kundenfavorit': ['https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg', 'Bio-Mode aus Naturfasern<br><b>Unserer Topseller des Monats</b>']},
                {'Neu': ['https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg', 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>']},
                {'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']}
            ]
        },

        badgeClosedCookie = WATO.getCookie('kk_ps08_close_badge'),

        /** favProducts */
        favProducts = getProfileValue("favProducts"),

        getCat = function (so_id) {
            var ret = '';
            switch (so_id) {
                case "SO-001":
                case "SO-015":
                case "SO-018":
                case "SO-020":
                case "SO-021":
                case "SO-030":
                case "SO-040":
                    ret = 'damen';
                    break;

                case "SO-002":
                case "SO-008":
                case "SO-016":
                case "SO-031":
                case "SO-041":
                    ret = 'herren';
                    break;

                case "SO-004":
                case "SO-032":
                case "SO-042":
                    ret = 'kids';
                    break;

                case "SO-005":
                    ret = 'baby';
                    break;

                case "SO-007":
                    ret = 'home';
                    break;
                default:
                    console.log('Category not found ...');
                    break;
            }
            return ret;
        };

    function getProfileValue(key, defaultValue) {
        if (!key) return;

        // TODO refactor
        if (defaultValue) {

            // fix escaping string
            return window.iridion.push(['profile', 'getValue', key, JSON.stringify(defaultValue)]);
        } else {

            return window.iridion.push(['profile', 'getValue', key]);
        }
    }

    function getCategory() {

        function checkPath(key) {
            return PATHNAME.indexOf(key) !== -1
        }

        var category = false;

        // TODO refactoring
        if (checkPath('damen')) {

            category = 'damen';
        } else if (checkPath('herren')) {

            category = 'herren';
        } else if (checkPath('home')) {

            category = 'home';
        } else if (checkPath('baby') || checkPath('junior')) {

            category = 'baby';
        }

        // product detail page?
        if (!category && checkPath('/p/')) {

            var item = document.querySelectorAll('.breadcrumbs span');

            if (item && item[1]) {

                item = item[1].textContent.toLowerCase();

                if (item === 'damen') {

                    category = 'damen';
                } else if (item === 'herren') {

                    category = 'herren';
                } else if (item === 'home') {

                    category = 'home';
                } else if (item === 'baby') {

                    category = 'baby';

                } else {
                    console.log('category not found');
                    WATO.elem(function () {
                        try {
                            category = window.pi.category_id;
                            return !!category;
                        }
                        catch (e) {
                        }
                        return false;
                    }, function (pi_found) {
                        if (pi_found) {
                            category = getCat(category);
                            console.log('category: ' + category);
                            // do nothing and its okay :D
                        }
                    });
                }
            }
        }

        return category;
    }

    function goalPush(key) {
        window.iridion.push(['goal', key]);
    }


    htmlTag.classList.add('kk-ps08');

    WATO.elem(function () {
        try {
            currentCategory = getCategory();
            return !!currentCategory;
        }
        catch (e) {
        }
        return false;
    }, function (cat_found) {
        if (cat_found) {
            WATO.elem('.js-badges-container', function (badgesContainer) {
                if (badgesContainer) {

                    badgesContainer = badgesContainer[0];

                    badgesContainer.insertAdjacentHTML('beforeend', '<span class="kk-nachhaltig">Nachhaltig</span>');

                    if (favProducts.indexOf(PATHNAME.split('/p/')[1].slice(0, 5).trim()) != -1) {
                        badgesContainer.insertAdjacentHTML('beforeend', '<img class="kk-badge" src="' + messageByCat[currentCategory][2]['Kundenfavorit'][0] + '"/>');
                        badges += 'Kundenfavorit ,';
                    }

                    if (!badgeClosedCookie) {
                        WATO.qsa('img:not(.kk-badge)', badgesContainer).forEach(function (imgElem) {
                            var imgPath = imgElem.src.split('/');
                            badges += imgPath[imgPath.length - 1].split('_')[1].split('.')[0].toLowerCase() + ',';
                            console.log('badges:', badges);
                            badgesContainer.classList.add('kk-hidden');
                        });


                        if (badges.includes('aktion')) {
                            boxBadgeUrl = messageByCat[currentCategory][0]['Aktion'][0];
                            boxTxtContent = messageByCat[currentCategory][0]['Aktion'][1];
                            WATO.qs('img[src*="aktion"]').classList.add('kk-hidden');
                        } else if (badges.includes('sale')) {
                            console.log('solde', currentCategory);
                            console.log('boxBadgeUrl', messageByCat[currentCategory][1]);
                            boxBadgeUrl = messageByCat[currentCategory][1]['Sale'][0];

                            boxTxtContent = messageByCat[currentCategory][1]['Sale'][1];
                            WATO.qs('img[src*="sale"]').classList.add('kk-hidden');
                        } else if (badges.includes('Kundenfavorit')) {
                            boxBadgeUrl = messageByCat[currentCategory][2]['Kundenfavorit'][0];
                            boxTxtContent = messageByCat[currentCategory][2]['Kundenfavorit'][1];
                            WATO.qs('img[src*="favorit"]').classList.add('kk-hidden');
                        } else if (badges.includes('neu')) {
                            boxBadgeUrl = messageByCat[currentCategory][3]['Neu'][0];
                            boxTxtContent = messageByCat[currentCategory][3]['Neu'][1];
                            WATO.qs('img[src*="neu"]').classList.add('kk-hidden');
                        } else {
                            boxBadgeUrl = messageByCat[currentCategory][4]['Allgemein'][0];
                            boxTxtContent = messageByCat[currentCategory][4]['Allgemein'][1];
                            WATO.qs('.kk-nachhaltig').classList.add('kk-hidden');
                        }

                        badgesContainer.classList.remove('kk-hidden');

                        boxBadgeUrl = boxBadgeUrl === 'Nachhaltig' ? '<div class="kk-badge">' + boxBadgeUrl + '</div>' : '<img class="kk-badge" src="' + boxBadgeUrl + '"/>';

                        if (window.innerWidth > 540) {
                            WATO.qs('.pds-cockpit__productName', badgesContainer.closest('.pds-cockpit__wrapper')).insertAdjacentHTML("afterend", '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent + '</div></div>');
                        } else {
                            WATO.elem('#kk_slider0', function (pdsWrapper) {
                                if (pdsWrapper){
                                    pdsWrapper = pdsWrapper[0];
                                    pdsWrapper.insertAdjacentHTML("afterend", '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent + '</div><img class="kk-btn-close" src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/close.svg"/> </div>');
                                    WATO.qs('.kk-btn-close').addEventListener('click', function (e) {
                                        console.log('badge closed');
                                        this.parentElement.classList.add('slide-out');
                                        WATO.setCookie('kk_ps08_close_badge', 'true', '', true);
                                        WATO.qs('.kk-hidden', badgesContainer).classList.remove('kk-hidden');
                                        goalPush('ps08_close_message');
                                    })
                                }
                            })

                        }

                    }

                }
            })
        }
    });


})(new window.WATO());
