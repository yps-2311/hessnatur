// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author FH
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    // function htmlDecode(input){
    //     if(input.length > 0){
    //         var e = document.createElement('div');
    //         e.innerHTML = input;
    //         return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    //     }else{
    //         return false;
    //     }
    // }

    /** EDITOR VARS */
    var DAMEN_AKTION_TEXT1 = "{{name=damenActionText1&desc=Dünner Text oberhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        DAMEN_AKTION_TEXT2 = "{{name=damenActionText2&desc=Dicker Text unterhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        DAMEN_AKTION_ICON = "{{name=damenActionIcon&desc=Icon vor dem Badge. Default: 15%-Icon&type=webarts.watt.editor.impl.ImageUrlEditor}}",

        HERREN_AKTION_TEXT1 = "{{name=herrenActionText1&desc=Dünner Text oberhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        HERREN_AKTION_TEXT2 = "{{name=herrenActionText2&desc=Dicker Text unterhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        HERREN_AKTION_ICON = "{{name=herrenActionIcon&desc=Icon vor dem Badge. Default: 15%-Icon&type=webarts.watt.editor.impl.ImageUrlEditor}}",

        HOME_AKTION_TEXT1 = "{{name=homeActionText1&desc=Dünner Text oberhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        HOME_AKTION_TEXT2 = "{{name=homeActionText2&desc=Dicker Text unterhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        HOME_AKTION_ICON = "{{name=homeActionIcon&desc=Icon vor dem Badge. Default: 15%-Icon&type=webarts.watt.editor.impl.ImageUrlEditor}}",

        BABY_AKTION_TEXT1 = "{{name=babyActionText1&desc=Dünner Text oberhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        BABY_AKTION_TEXT2 = "{{name=babyActionText2&desc=Dicker Text unterhalb des Badges&type=webarts.watt.editor.impl.TextEditor}}",
        BABY_AKTION_ICON = "{{name=babyActionIcon&desc=Icon vor dem Badge. Default: 15%-Icon&type=webarts.watt.editor.impl.ImageUrlEditor}}";
    
    /*
    console.log('BABY_AKTION_TEXT1: ', BABY_AKTION_TEXT1);
    console.log('BABY_AKTION_TEXT2: ', BABY_AKTION_TEXT2);
    console.log('BABY_AKTION_ICON: ', BABY_AKTION_ICON);

    console.log('HOME_AKTION_TEXT1: ', HOME_AKTION_TEXT1);
    console.log('HOME_AKTION_TEXT2: ', HOME_AKTION_TEXT2);
    console.log('HOME_AKTION_ICON: ', HOME_AKTION_ICON);

    console.log('HERREN_AKTION_TEXT1: ', HERREN_AKTION_TEXT1);
    console.log('HERREN_AKTION_TEXT2: ', HERREN_AKTION_TEXT2);
    console.log('HERREN_AKTION_ICON: ', HERREN_AKTION_ICON);

    console.log('DAMEN_AKTION_TEXT1: ', DAMEN_AKTION_TEXT1);
    console.log('DAMEN_AKTION_TEXT2: ', DAMEN_AKTION_TEXT2);
    console.log('DAMEN_AKTION_ICON: ', DAMEN_AKTION_ICON);
    */


    var PATHNAME = location.pathname,
        currentCategory = false, // current category

        boxTxtContent,
        boxBadgeUrl,
        segmentID,

        imgURL = 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/',
        badgeSaleUrl = imgURL+'overlay_sale.svg',
        badgeKundenfavoritUrl = 'https://media.hessnatur.com/kk/100Prozent/templates/icons/favorit.svg',
        badgeNeuUrl = imgURL+'overlay_neu.svg',
        badgeAktionUrl = imgURL+'overlay_15Prozent.svg',

        // Table with all messages to displaying
        messageByCat = {
            'damen': {
                'Aktion': [DAMEN_AKTION_ICON.length > 0 ? DAMEN_AKTION_ICON : badgeAktionUrl , DAMEN_AKTION_TEXT1 + '<br><b>'+ DAMEN_AKTION_TEXT2 +'</b>'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>In höchster Qualität</b>']
            },
            'herren': {
                'Aktion': [HERREN_AKTION_ICON.length > 0 ? HERREN_AKTION_ICON : badgeAktionUrl, HERREN_AKTION_TEXT1 + '<br><b>'+ HERREN_AKTION_TEXT2 +'</b>'],
                'Sale': [badgeSaleUrl, 'Bio-Mode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Mode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Mode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Mode aus Naturfasern<br><b>In höchster Qualität</b>']
            },
            'home': {
                'Aktion': [HOME_AKTION_ICON.length > 0 ? HOME_AKTION_ICON : badgeAktionUrl, HOME_AKTION_TEXT1 + '<br><b>'+ HOME_AKTION_TEXT2 +'</b>'],
                'Sale': [badgeSaleUrl, 'Gut für Mensch & Natur<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Gut für Mensch & Natur<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Gut für Mensch & Natur<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Gut für Mensch & Natur<br><b>In höchster Qualität</b>']
            },
            'baby': {
                'Aktion': [BABY_AKTION_ICON.length > 0 ? BABY_AKTION_ICON : badgeAktionUrl, BABY_AKTION_TEXT1 + '<br><b>'+ BABY_AKTION_TEXT2 +'</b>'],
                'Sale': [badgeSaleUrl, 'Bio-Kindermode aus Naturfasern<br><b>Jetzt zum reduzierten Preis</b>'],
                'Kundenfavorit': [badgeKundenfavoritUrl, 'Bio-Kindermode aus Naturfasern<br><b>Ein Topseller des Monats</b>'],
                'Neu': [badgeNeuUrl, 'Bio-Kindermode aus Naturfasern<br><b>Neu im Sortiment</b>'],
                'Allgemein': ['Nachhaltig', 'Bio-Kindermode aus Naturfasern<br><b>In höchster Qualität</b>']
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
                case "SO-006":
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

            var item = WATO.qsa('.breadcrumbs span');

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

    // function goalPush(key) {
    //     window.iridion.push(['goal', key]);
    // }

    function addClass(elem, thisclassname) {
        if(elem){
            elem.classList.add(thisclassname);
        }
    }
    function removeClass(elem, thisclassname) {
        if(elem){
            elem.classList.remove(thisclassname);
        }
    }

    function replaceClasses(selector){
        WATO.qsa(selector).forEach(function (el) {
            removeClass(el, 'kk-hidden');
            addClass(el, 'kk-visible');
        })
    }

    
    addClass(document.documentElement, 'kk-notifications-pds');

    function displyBadges() {
        WATO.elem(function () {
            try {
                return !!getCategory();
            }
            catch (e) {
                // console.log('error:', e);
            }
            return false;
        }, function (cat_found) {
            if (cat_found) {

                WATO.elem('.js-badges-container', function (badgesContainer) {
                    if (badgesContainer) {

                        badgesContainer = badgesContainer[0];

                        currentCategory = getCategory();

                        console.log('currentCategory 123: ', currentCategory);

                        removeElem('.kk-nachhaltig');
                        badgesContainer.insertAdjacentHTML('beforeend', '<span class="kk-nachhaltig">Nachhaltig</span>');

                        var badges = '', // list of badges linked to the product
                            idProduct;

                        WATO.elem('input[name="ff_id"]', function (inputId) {
                            if (inputId && currentCategory){

                                idProduct = inputId[0].value;
                                if (favProducts && favProducts.indexOf(idProduct) !== -1) {

                                    console.log('messageByCat: ', messageByCat);
                                    console.log('currentCategory: ', currentCategory);
                                    console.log('messageByCat[currentCategory]: ', messageByCat[currentCategory]);
                                    console.log('messageByCat[currentCategory][Kundenfavorit]: ', messageByCat[currentCategory]['Kundenfavorit']);

                                    badgesContainer.insertAdjacentHTML('beforeend', '<img class="kk-badge" src="' + messageByCat[currentCategory]['Kundenfavorit'][0] + '"/>');
                                    badges += 'Kundenfavorit ,';
                                }
                            }
                        });

                        WATO.qsa('img', badgesContainer).forEach(function (imgElem) {

                            //get type of currents badges
                            try {
                                var imgPath = imgElem.src.split('/'); // for exemple path of sale badge 'https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg' => result : overlay_sale.svg
                                // console.log('imgPath: ', imgPath);

                                imgPath = imgPath[imgPath.length - 1].split('_'); // get name of badge with extension 'overlay_sale.svg' => sale.svg
                                imgPath = imgPath[imgPath.length - 1].split('.'); // get name of badge => sale

                                badges += imgPath[0].toLowerCase() + ',';
                                // console.log('badges: ', badges);

                            } catch (e) {
                                // console.log(e);
                            }

                            addClass(imgElem, 'kk-hidden');

                        });

                        if (badges.includes('prozent')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Aktion'][0];
                            boxTxtContent = messageByCat[currentCategory]['Aktion'][1];

                            replaceClasses('.js-badges-container img:not(img[src*="Prozent"])');
                            segmentID = '32896';

                        } else if (badges.includes('sale')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Sale'][0];
                            boxTxtContent = messageByCat[currentCategory]['Sale'][1];
                            segmentID = '32895';

                            replaceClasses('.js-badges-container img:not(img[src*="sale"])');

                        } else if (badges.includes('Kundenfavorit')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Kundenfavorit'][0];
                            boxTxtContent = messageByCat[currentCategory]['Kundenfavorit'][1];
                            segmentID = '32894';

                            replaceClasses('.js-badges-container img:not(img[src*="favorit"])');

                        } else if (badges.includes('neu')) {
                            boxBadgeUrl = messageByCat[currentCategory]['Neu'][0];
                            boxTxtContent = messageByCat[currentCategory]['Neu'][1];
                            segmentID = '32892';


                            replaceClasses('.js-badges-container img:not(img[src*="neu"])');

                        } else {
                            boxBadgeUrl = messageByCat[currentCategory]['Allgemein'][0];
                            boxTxtContent = messageByCat[currentCategory]['Allgemein'][1];

                            addClass(WATO.qs('.kk-nachhaltig'), 'kk-hidden');
                            segmentID = '32893';

                            replaceClasses('.js-badges-container img');
                        }

                        removeClass(badgesContainer, 'kk-hidden');

                        boxBadgeUrl = boxBadgeUrl === 'Nachhaltig' ? '<div data-segment-id="'+ segmentID +'" class="kk-badge">' + boxBadgeUrl + '</div>' : '<img data-segment-id="'+ segmentID +'" class="kk-badge" src="' + boxBadgeUrl + '"/>';

                        if (window.innerWidth > 540) {
                            removeElem('.kk-box');
                            WATO.qs('.pds-cockpit__productName', badgesContainer.closest('.pds-cockpit__wrapper')).insertAdjacentHTML("afterend",
                                '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent + '</div></div>');
                        } else {
                            if (!badgeClosedCookie) {
                                WATO.elem('.kk_slider', function (pdsWrapper) {
                                    if (pdsWrapper) {
                                        pdsWrapper = pdsWrapper[0];
                                        removeElem('.kk-box');
                                        pdsWrapper.insertAdjacentHTML("afterend",
                                            '<div class="kk-box">' + boxBadgeUrl + '<div>' + boxTxtContent +
                                            '</div><img class="kk-btn-close" src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2021/ps08-einstiege-aus-anderen-kan%C3%A4len/close.svg"/></div>');

                                        WATO.qs('.kk-btn-close').addEventListener('click', function () {
                                            addClass(this.parentElement, 'slide-out');

                                            if (!badgeClosedCookieCounter) {
                                                WATO.setCookie('kk_ps08_close_badge_counter', '0', '', true);
                                            } else {
                                                badgeClosedCookieCounter = parseInt(badgeClosedCookieCounter) + 1;
                                                WATO.setCookie('kk_ps08_close_badge_counter', badgeClosedCookieCounter, '', true);
                                            }
                                            if (parseInt(badgeClosedCookieCounter) > 1) {
                                                WATO.setCookie('kk_ps08_close_badge', 'true', '', true);
                                            }
                                            var hiddenElem =  WATO.qs('.kk-hidden', badgesContainer);
                                            
                                            addClass(hiddenElem, 'kk-visible');
                                            removeClass(hiddenElem, 'kk-hidden');
                                            // goalPush('ps08_close_message');
                                        })
                                    }
                                })
                            } else {
                                replaceClasses('.pds-cockpit__badge');
                            }

                        }
                        // WATO.elem('.kk-badge:not(.kk-hidden)', function (badge) {
                        //     if (badge) {
                        //         console.log('observer: ', observer);
                        //         if(observer){
                        //             observer.observe(badge[0]);
                        //         }
                        //     }
                        // });
                        // WATO.elem('.kk-box', function (kkBox) {
                        //     if (kkBox) {
                        //         kkBox[0].addEventListener('click', function (e) {
                        //             goalPush('ps08_click_message');
                        //         })
                        //     }
                        // });

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
    // function removeElem(el){
    //     WATO.qs(el) !== null ? WATO.qs(el).remove() : console.log("can't remove it") ;
    // }
    function removeElem(el) {
        var thisElem = WATO.qs(el);
        if(thisElem){
            thisElem.parentNode.removeChild(thisElem);
        }
    }

    // Color change of the product
    WATO.ajax("reload?", function() {
        displyBadges();
    });

    // var observer = new window.IntersectionObserver(function (entries) {
    //     entries.forEach(function (entry) {
    //         if (entry.isIntersecting) {
    //             window.iridion.push(['segment', entry.target.dataset.segmentId]);
    //         }
    //     });
    // }, {
    //     root: null,
    //     rootMargin: "0px",
    //     threshold: 1
    // });

})(new window.WATO());
