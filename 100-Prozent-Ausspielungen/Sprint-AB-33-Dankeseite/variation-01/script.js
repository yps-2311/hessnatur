// load core and global js
// @ codekit-prepend "../global/global.js";
// @ prepros-prepend "../global/global.js";

/**
 * @function
 * @author AH
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    window.iridion.econda.push(["AB33", "V1"]);
    const insert = (el, where, insertion) => {
        return el && insertion && where && el["insertAdjacent" + (typeof insertion !== "string" ? "Element" : "HTML")](where, insertion);
    },
    getLength = (kkArray) => {
        return kkArray && kkArray.length || 0;
    },
    getElementClassList = (element) => {
        return element && element.classList;
    },
    addClass = (element, value) => {
        if (typeof(value) === 'string') {
            element && value && getElementClassList(element) && getElementClassList(element).add(value);
        } else if (Array.isArray(value)) {
            if (getLength(value) > 0) {
                for (let i = 0; i < getLength(value); i++) {
                    element && value && getElementClassList(element) && getElementClassList(element).add(value[i]);
                }
            }
        } 
    },
    removeClass = (element, value) => {
        element && value && getElementClassList(element) && getElementClassList(element).remove(value);
    },
    //preloadiamge function to prvent flickering
    preloadImage = (ImageUrl) => {
        var img=new Image();
        img.src=ImageUrl;
    },
    goalPush = (key) => {
        window.iridion.push(['goal', key]);
    };

    // insert Text above the 3 boxes
    WATO.elem('#guestRegisterForm', (confirmForm) => {
        if(confirmForm) {
            insert(confirmForm[0], 'afterend', 
            '<div class="kk_AB33_overviewtext">' +
            'Ihr 50€ Gutschein der Aktion wird Ihnen automatisch ' +
            'nach Ablauf der Rückgabefrist von 30 Tagen per Email zur Verfügung gestellt,' +
            ' sofern der Warenwert nach Abzug Ihrer zurückgesendeten Artikel mindestens 300€ beträgt.<br> Sie müssen hierfür nichts weiter unternehmen.' +
            '</div>');
        }
    });

    // insert new banner after end of parent node
    WATO.elem ('#trustedShopsBanner', (trustedBanner) => {
        const trustedBanners = trustedBanner[0].closest('.row');
        const trustedBannersParent = trustedBanners.parentElement;
        insert(trustedBanners, 'afterend',
        '<div class="row medium-6">' +
            '<div class="small-12 columns h-offset-bottom-inner kk-ab33-wrap">'+
                '<div class="kk_trustpilot">' +
                '<div>' +
                    '<div class="kk-header">Wie gut hat Ihnen der Einkauf bei hessnatur gefallen?</div>' +
                        '<div class="kk_stars_wrapper">' +
                            '<a class="kk_stars" href="https://de.trustpilot.com/review/www.hessnatur.com"target="_blank" > ' +
                            '<div data-value="stars-1"></div>' +
                                '<div data-value="stars-2"></div>' +
                                '<div data-value="stars-3"></div>' +
                                '<div data-value="stars-4"></div>' +
                                '<div data-value="stars-5"></div>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' 
        );
        // remove and add some classes for the bootstrap grid
        const wrapperCol = WATO.qs('.small-12.columns.xlarge-offset-1.xlarge-10.xxlarge-offset-2.xxlarge-8');
        removeClass(wrapperCol,'xxlarge-offset-2');
        addClass(wrapperCol,['xxlarge-offset-1', 'xxlarge-10']);
        addClass(trustedBannersParent, 'kk_row');
        const rowChilds = WATO.qsa('.row', trustedBannersParent);
        //check length to get the right elements
        if (getLength(rowChilds) > 5) {
            for (let i = 2; i < 5; i++) {
                removeClass(rowChilds[i], 'row');
                addClass(rowChilds[i], ['small-12', 'xlarge-4', 'medium-8', 'large-6']);
                if (i === 3) {
                    addClass(rowChilds[i],['xlarge-6', 'xxlarge-4']);
                    addClass(WATO.qs('.small-12',rowChilds[i]), 'h-offset-bottom-inner');
                }
            }
        }
        // change background url to get the different rating svg´s
        const imgURL = "https://media.hessnatur.com/kk/2023/ab33/"
        const stars = WATO.qsa('.kk_stars div', trustedBannersParent);
        let ratingSend = false;
        for (let i = 0; i < getLength(stars); i++) {
            const thisStar =  stars[i];
            WATO.ev(thisStar,'mouseenter', (ratingEnter) => { 
                    const ratingTarget = ratingEnter.target;
                if (ratingTarget.dataset.value) {
                    ratingTarget.parentElement.style.background = "url(" + imgURL + ratingTarget.dataset.value + ".svg) transparent no-repeat bottom center  / cover";
                }
            });
            // switch to 0 stars image when mouse leaves
            // WATO.ev(thisStar,'mouseleave', (ratingLeave) => {
            //     if (ratingLeave.target) {
            //         ratingLeave.target.parentElement.style.background = "url(" + imgURL + "stars-0.svg) transparent no-repeat bottom center  / cover";
            //     }
            // });

            //Goals
            //trustpilot click
            WATO.ev(thisStar,'click', (trustpilotClick) => {
                if (trustpilotClick && !ratingSend) {
                    ratingSend = true;
                    goalPush('click_trustpilot_' + trustpilotClick.target.dataset.value)
                    goalPush('click_thankyou_trustpilot');
                    window.iridion.push(["segment", "32925"]);
                }
            });
            //Preload image to prevent more flickering
            preloadImage(imgURL + 'stars-' + (i+1) + '.svg');
        }
        WATO.ab33();
    });

})(new window.WATO(),window);
