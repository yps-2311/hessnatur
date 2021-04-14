// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation Damen
 * @description
 */
(function(WATO) {
    "use strict";

    function getProfileValue(key, defaultValue) {
        if(!key) return;

        // TODO refactor
        if(defaultValue){

            // fix escaping string
            return window.iridion.push(['profile', 'getValue', key, JSON.stringify(defaultValue)]);
        } else {

            return window.iridion.push(['profile', 'getValue', key]);
        }
    }

    function setClickGoals() {

        var links = WATO.qsa('.lpmHero__buttons a');
        
        for(var i = 0; i < links.length; i++){

            links[i].addEventListener('click', function(){

                window.iridion.push(['goal', 'kk_sale_home_click_btn', this.textContent, true]);
            });
        }
    }

    function baseConverter(thisText) {
        // TODO: Versuchen mit encoding zu verwenden
        return thisText.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    }

    // function checkURLImage(urlImage) {
    //     urlImage

    // }

    /** EDITOR VARS */
    var TEXT_HEADLINE = "{{name=Headline&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_SLOGAN = "{{name=Slogan&type=webarts.watt.editor.impl.TextEditor}}",
        IMG_PATH_DESKTOP = "{{name=DesktopImage&type=webarts.watt.editor.impl.TextEditor}}",
        IMG_PATH_MOBILE = "{{name=MobileImage&type=webarts.watt.editor.impl.TextEditor}}";

    /** PROFILE */
    var KEY_DATA         = 'categoryAffinityData',
        KEY_STATUS       = 'categoryAffinity';

    WATO.elem(".lpmHero__wrapper", function(wrapper) {

        if(wrapper) {

            wrapper = wrapper[0];

            if(IMG_PATH_DESKTOP && IMG_PATH_MOBILE){

                // change background image
                var image = WATO.qsa('.lpmHero__image', wrapper);

                if(image){

                    image[0].setAttribute('src', IMG_PATH_DESKTOP + '?width=640');
                    image[0].setAttribute('srcset', IMG_PATH_DESKTOP + '?width=640 640w, ' + IMG_PATH_DESKTOP + '?width=1024 1024w, ' + IMG_PATH_DESKTOP + '?width=1200 1200w, ' + IMG_PATH_DESKTOP + '?width=1440 1440w, ' + IMG_PATH_DESKTOP + '?width=1920 1920w');
                    
                    image[1].setAttribute('src', IMG_PATH_MOBILE + '?width=375');
                    image[1].setAttribute('srcset', IMG_PATH_MOBILE + '?width=375 375w, ' + IMG_PATH_MOBILE + '?width=640 640w');

                    // hide early workaround
                    document.documentElement.classList.add('kk-banner-show');
                }
            }

            // change headline
            var headline = WATO.qs('.lpmHero__headline.hn-headline', wrapper);

            if(headline && TEXT_HEADLINE.length > 0){
                console.log('TEXT_HEADLINE: ', TEXT_HEADLINE);
                headline.innerHTML = baseConverter(TEXT_HEADLINE);
            }

            var slogan = WATO.qs('.lpmHero__text', wrapper);

            if(slogan && TEXT_SLOGAN.length > 0){
                console.log('TEXT_SLOGAN: ', TEXT_SLOGAN);
                slogan.innerHTML = baseConverter(TEXT_SLOGAN);
            }

            // parsing error
            try {

                var categoryAffinity = getProfileValue(KEY_STATUS);

                console.log("categoryAffinity", categoryAffinity);

                // change buttons
                if(categoryAffinity && categoryAffinity !== 'damen'){

                    // Profile data
                    var categoryAffinityData = getProfileValue(KEY_DATA);

                    delete categoryAffinityData.lastVisit;

                    // fix, clear categoryAffinityData object
                    for(var category in categoryAffinityData){

                        if(['damen', 'herren', 'baby', 'home'].indexOf(category) === -1){
                            delete categoryAffinityData[category];
                        }
                    }

                    // NEW LINKS
                    // https://www.hessnatur.com/de/sale/damen/c/sale-damen
                    // https://www.hessnatur.com/de/sale/herren/c/sale-herren
                    // https://www.hessnatur.com/de/sale/junior/c/sale-junior
                    // https://www.hessnatur.com/de/sale/home/c/sale-home
                    WATO.elem('.lpmHero__buttons', function(buttons){

                        if(buttons){

                            buttons[0].innerHTML = Object.keys(categoryAffinityData)
                                .sort(function (a, b) {
                                    return categoryAffinityData[b] - categoryAffinityData[a];
                                }).map(function(item, index){
        
                                    var br = '';
        
                                    if(index === 2) {
                                        br = '<br class="show-for-small-only">';
                                    }
        
                                    if(item === 'baby'){
                                        item = 'junior';
                                    }
        
                                    return br + '<a href="sale/' + item + '/c/sale-' + item + '" class="hn-button"> ' + item + '</a>';
                                }).join('');

                                setClickGoals();
                            }
                        })
                } else {

                    // set click events for control variation
                    WATO.elem('.lpmHero__buttons', function(buttons){

                        if(buttons){
                            setClickGoals();
                        }
                    });
                }
            } catch(e) {
                console.log("KK >>> ", e.toString());
            }
        }
    });
})(new window.WATO());