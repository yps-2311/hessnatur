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
        segmentID,

        badgeSaleUrl = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg',
        badgeKundenfavoritUrl = 'https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/favorit.svg',
        badgeNeuUrl = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_neu.svg',
        badgeAktionUrl = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_15Prozent.svg',

        // Table with all messages to displaying
        messageByCat = {
            'baby': {
                'Aktion': [badgeAktionUrl, 'Bio-Kindermode aus Naturfasern<br><b>15% Rabatt mit Code KIDS21</b>'],
                'Sale': [badgeSaleUrl, 'Bio-Kindermode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Kindermode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Kindermode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Kindermode aus Naturfasern<br><b>In höchster Qualität</b>']
            },
            'home': {
                'Aktion': [badgeAktionUrl, 'Gut für Mensch & Natur'],
                'Sale': [badgeSaleUrl, 'Gut für Mensch & Natur<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Gut für Mensch & Natur<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Gut für Mensch & Natur<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Gut für Mensch & Natur<br><b>In höchster Qualität</b>']
            },
            'herren': {
                'Aktion': [badgeAktionUrl, 'Bio-Mode aus Naturfasern'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>In höchster Qualität</b>']
            },
            'damen': {
                'Aktion': [badgeAktionUrl, 'Bio-Mode aus Naturfasern'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>In höchster Qualität</b>']
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

        badgeClosedCookie = WATO.getCookie('kk_ps08_close_badge'),
        badgeClosedCookieCounter = WATO.getCookie('kk_ps08_close_badge_counter');

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

                }
            }
        }

        if( !category && typeof window.basketTrackingObject !== "undefined" && window.basketTrackingObject.category_id){
            category = getCat(window.basketTrackingObject.category_id);
        }

        return category;
    }

    function goalPush(key) {
        window.iridion.push(['goal', key]);
    }

    function removeClass(selector){

        WATO.elem(selector, function (elem) {
            if (elem){
                Array.prototype.forEach.call(elem, function (el) {
                    el.classList.remove('kk-hidden');
                    el.classList.add('kk-visible');
                })
            }
        })

    }

    document.documentElement.classList.add('kk-ps08');

    function displyBadges() {
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

                        var badges = '', // list of badges linked to the product
                            idProduct;

                        WATO.elem('input[name="ff_id"]', function (inputId) {
                            if (inputId){

                                idProduct = inputId[0].value;
                                if (favProducts && favProducts.indexOf(idProduct) !== -1) {

                                    badgesContainer.insertAdjacentHTML('beforeend', '<img class="kk-badge" src="' + messageByCat[currentCategory]['Kundenfavorit'][0] + '"/>');
                                    badges += 'Kundenfavorit ,';
                                }
                            }
                        });




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

                            imgElem.classList.add('kk-hidden');
                        });



                        if (badges.includes('15prozent')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Aktion'][0];
                            boxTxtContent = messageByCat[currentCategory]['Aktion'][1];

                            removeClass('.js-badges-container img:not(img[src*="15Prozent"])');
                            segmentID = '32896';

                        } else if (badges.includes('sale')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Sale'][0];
                            boxTxtContent = messageByCat[currentCategory]['Sale'][1];
                            segmentID = '32895';

                            removeClass('.js-badges-container img:not(img[src*="sale"])');

                        } else if (badges.includes('Kundenfavorit')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Kundenfavorit'][0];
                            boxTxtContent = messageByCat[currentCategory]['Kundenfavorit'][1];
                            segmentID = '32894';

                            removeClass('.js-badges-container img:not(img[src*="favorit"])');

                        } else if (badges.includes('neu')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Neu'][0];
                            boxTxtContent = messageByCat[currentCategory]['Neu'][1];
                            segmentID = '32892';


                            removeClass('.js-badges-container img:not(img[src*="neu"])');

                        } else {
                            boxBadgeUrl = messageByCat[currentCategory]['Allgemein'][0];
                            boxTxtContent = messageByCat[currentCategory]['Allgemein'][1];
                            WATO.qs('.kk-nachhaltig').classList.add('kk-hidden');
                            segmentID = '32893';

                            removeClass('.js-badges-container img');
                        }

                        badgesContainer.classList.remove('kk-hidden');

                        boxBadgeUrl = boxBadgeUrl === 'Nachhaltig' ? '<div data-segment-id="'+ segmentID +'" class="kk-badge">' + boxBadgeUrl + '</div>' : '<img data-segment-id="'+ segmentID +'" class="kk-badge" src="' + boxBadgeUrl + '"/>';

                        if (window.innerWidth > 540) {
                            WATO.qs('.pds-cockpit__productName', badgesContainer.closest('.pds-cockpit__wrapper')).insertAdjacentHTML("afterend",
                                '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent + '</div></div>');
                        } else {
                            if (!badgeClosedCookie) {
                                WATO.elem('.kk_slider', function (pdsWrapper) {
                                    if (pdsWrapper) {
                                        pdsWrapper = pdsWrapper[0];
                                        pdsWrapper.insertAdjacentHTML("afterend",
                                            '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent +
                                            '</div><img class="kk-btn-close" src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/close.svg"/></div>');

                                        WATO.qs('.kk-btn-close').addEventListener('click', function (e) {
                                            this.parentElement.classList.add('slide-out');
                                            if (!badgeClosedCookieCounter) {
                                                WATO.setCookie('kk_ps08_close_badge_counter', '0', '', true);
                                            } else {
                                                badgeClosedCookieCounter = parseInt(badgeClosedCookieCounter) + 1;
                                                WATO.setCookie('kk_ps08_close_badge_counter', badgeClosedCookieCounter, '', true);
                                            }
                                            if (parseInt(badgeClosedCookieCounter) > 1) {
                                                WATO.setCookie('kk_ps08_close_badge', 'true', '', true);
                                            }
                                            WATO.qs('.kk-hidden', badgesContainer).classList.add('kk-visible');
                                            WATO.qs('.kk-hidden', badgesContainer).classList.remove('kk-hidden');
                                            goalPush('ps08_close_message');
                                        })
                                    }
                                })
                            } else {
                                removeClass('.pds-cockpit__badge');
                            }

                        }

                    }

                })
            }
        });
    }

    displyBadges();

    /**
     * Remove node
     * @param el
     */
    function removeElem(el){
        if (el){
            el.remove();
        }
    }

    // Color change of the product
    WATO.ajax("reload?", function() {
        removeElem( WATO.qs('.kk-box'));
        removeElem(WATO.qs('.kk-nachhaltig'));
        removeElem(WATO.qs('.kk-badge'));
        displyBadges();
    });

    var observer = new window.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {

                console.log('segment :', entry.target, entry.target.dataset.segmentId );
                window.iridion.push(['segment', entry.target.dataset.segmentId]);
                observer.disconnect();

            }
        });
    }, {
        root: null,
        rootMargin: "0px",
        threshold: 1
    });

    WATO.elem('.kk-badge', function (badge) {
        if (badge) {
            observer.observe(badge[0]);
        }
    });


})(new window.WATO());
