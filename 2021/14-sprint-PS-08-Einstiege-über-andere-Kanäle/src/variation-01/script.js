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

        boxTxtContent,
        boxBadgeUrl,

        badgeSaleUrl = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg',
        badgeKundenfavoritUrl = 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg',
        badgeNeuUrl = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg',

        // Table with all messages ti displaying
        messageByCat = {
            'baby': {
                'Aktion': [badgeSaleUrl, 'Bio-Kindermode aus Naturfasern<br>15% Rabatt mit Code JUNIOR21'],
                'Sale': [badgeSaleUrl, 'Bio-Kindermode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Kindermode aus Naturfasern<br><b>Unserer Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Kindermode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Kindermode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']
            },
            'home': {
                'Aktion': [badgeSaleUrl, 'Gut für Mensch & Natur<br>15% sparen mit Code HOME21'],
                'Sale': [badgeSaleUrl, 'Gut für Mensch & Natur<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Gut für Mensch & Natur<br><b>Unserer Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Gut für Mensch & Natur<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Gut für Mensch & Natur<br><b>Optimale Preis/Leistung</b>']
            },
            'herren': {
                'Aktion': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br>15% Rabatt mit Code OUTDOOR21'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Unserer Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']
            },
            'damen': {
                'Aktion': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br>15% Rabatt mit Code OUTDOOR21'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Unserer Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>Optimale Preis/Leistung</b>']
            }
        },

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
        },

        badgeClosedCookie = WATO.getCookie('kk_ps08_close_badge');

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

    /** favProducts */
    var favProducts = getProfileValue("favProducts");


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

                if (item === 'damen' || item === 'herren' || item === 'home' || item === 'baby') {

                    category = item;

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


    document.documentElement.classList.add('kk-ps08');

    WATO.elem(function () {
        try {
            currentCategory = getCategory();
            return !!currentCategory;
        }
        catch (e) {
            console.log('error:', e);
        }
        return false;
    }, function (cat_found) {
        if (cat_found) {
            WATO.elem('.js-badges-container', function (badgesContainer) {
                if (badgesContainer) {

                    badgesContainer = badgesContainer[0];

                    badgesContainer.insertAdjacentHTML('beforeend', '<span class="kk-nachhaltig">Nachhaltig</span>');

                    var badges = ''; // list of badges linked to the product

                    console.log(PATHNAME.split('/p/')[1].slice(0, 5));
                    console.log('favProducts', favProducts);

                    if (favProducts && favProducts.indexOf(PATHNAME.split('/p/')[1].slice(0, 5)) !== -1) {

                        badgesContainer.insertAdjacentHTML('beforeend', '<img class="kk-badge" src="' + messageByCat[currentCategory][2]['Kundenfavorit'][0] + '"/>');
                        badges += 'Kundenfavorit ,';
                    }

                    if (!badgeClosedCookie) {

                        WATO.qsa('img', badgesContainer).forEach(function (imgElem) {

                            //get type of currents badges
                            try {
                                var imgPath = imgElem.src.split('/'); // for exemple path of sale badge 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg' => result : overlay_sale.svg

                                imgPath = imgPath[imgPath.length - 1].split('_'); // get name of badge with extension 'overlay_sale.svg' => sale.svg
                                imgPath = imgPath[imgPath.length - 1].split('.');// get name of badge => sale

                                badges += imgPath[0].toLowerCase() + ',';

                            } catch (e) {
                                console.log(e);
                            }

                            console.log('badges:', badges);
                            badgesContainer.classList.add('kk-hidden');
                        });


                        if (badges.includes('aktion')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Aktion'][0];
                            boxTxtContent = messageByCat[currentCategory]['Aktion'][1];
                            WATO.qs('img[src*="aktion"]').classList.add('kk-hidden');
                        } else if (badges.includes('sale')) {
                            console.log('solde', currentCategory);
                            console.log('boxBadgeUrl', messageByCat[currentCategory][1]);
                            boxBadgeUrl = messageByCat[currentCategory]['Sale'][0];

                            boxTxtContent = messageByCat[currentCategory]['Sale'][1];
                            WATO.qs('img[src*="sale"]').classList.add('kk-hidden');
                        } else if (badges.includes('Kundenfavorit')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Kundenfavorit'][0];
                            boxTxtContent = messageByCat[currentCategory]['Kundenfavorit'][1];
                            WATO.qs('img[src*="favorit"]').classList.add('kk-hidden');
                        } else if (badges.includes('neu')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Neu'][0];
                            boxTxtContent = messageByCat[currentCategory]['Neu'][1];
                            WATO.qs('img[src*="neu"]').classList.add('kk-hidden');
                        } else {
                            boxBadgeUrl = messageByCat[currentCategory]['Allgemein'][0];
                            boxTxtContent = messageByCat[currentCategory]['Allgemein'][1];
                            WATO.qs('.kk-nachhaltig').classList.add('kk-hidden');
                        }

                        badgesContainer.classList.remove('kk-hidden');

                        boxBadgeUrl = boxBadgeUrl === 'Nachhaltig' ? '<div class="kk-badge">' + boxBadgeUrl + '</div>' : '<img class="kk-badge" src="' + boxBadgeUrl + '"/>';

                        if (window.innerWidth > 540) {
                            WATO.qs('.pds-cockpit__productName', badgesContainer.closest('.pds-cockpit__wrapper')).insertAdjacentHTML("afterend",
                                '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent + '</div></div>');
                        } else {
                            WATO.elem('#kk_slider0', function (pdsWrapper) {
                                if (pdsWrapper) {
                                    pdsWrapper = pdsWrapper[0];
                                    pdsWrapper.insertAdjacentHTML("afterend",
                                        '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent +
                                        '</div><img class="kk-btn-close" src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/close.svg"/> </div>');

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
