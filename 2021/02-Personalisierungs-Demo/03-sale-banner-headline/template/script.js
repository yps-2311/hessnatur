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

    // function baseConverter(thisText) {
    //     // TODO: Versuchen mit encoding zu verwenden
    //     return thisText.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    // }
    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }

    // function checkURLImage(urlImage) {
    //     urlImage

    // }

    function valideImgURL(url) {
        return url.match(/^(http:\/\/|https:\/\/|\/).*\.(jpg|jpeg|png|svg).*/) !== null;
    }


    /** EDITOR VARS */
    var TEXT_HEADLINE = "{{name=Headline&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_SLOGAN = "{{name=Slogan&type=webarts.watt.editor.impl.TextEditor}}",
        IMG_PATH_DESKTOP = "{{name=Desktop_Image&type=webarts.watt.editor.impl.TextEditor}}",
        IMG_PATH_MOBILE = "{{name=Mobile_Image&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON1 = "{{name=Button1_Text&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON1 = "{{name=Button1_Link&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON2 = "{{name=Button2_Text&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON2 = "{{name=Button2_Link&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON3 = "{{name=Button3_Text&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON3 = "{{name=Button3_Link&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON4 = "{{name=Button4_Text&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON4 = "{{name=Button4_Link&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BADGE = "{{name=Badge_Text&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_COLOR = "{{name=Badge_Color&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_POSITION = "{{name=Badge_Position&type=webarts.watt.editor.impl.TextEditor}}";

    /** PROFILE */
    var KEY_DATA         = 'categoryAffinityData';
        // KEY_STATUS       = 'categoryAffinity';

    WATO.elem(".lpmHero__wrapper", function(wrapper) {

        if(wrapper) {

            wrapper = wrapper[0];

            if(IMG_PATH_DESKTOP && IMG_PATH_MOBILE){

                // change background image
                var image = WATO.qsa('.lpmHero__image', wrapper);

                if(image){

                    if(valideImgURL(IMG_PATH_DESKTOP)){
                        image[0].setAttribute('src', IMG_PATH_DESKTOP + '?width=640');
                        image[0].setAttribute('srcset', IMG_PATH_DESKTOP + '?width=640 640w, ' + IMG_PATH_DESKTOP + '?width=1024 1024w, ' + IMG_PATH_DESKTOP + '?width=1200 1200w, ' + IMG_PATH_DESKTOP + '?width=1440 1440w, ' + IMG_PATH_DESKTOP + '?width=1920 1920w');    
                    }
                    
                    if(valideImgURL(IMG_PATH_MOBILE)){
                        image[1].setAttribute('src', IMG_PATH_MOBILE + '?width=375');
                        image[1].setAttribute('srcset', IMG_PATH_MOBILE + '?width=375 375w, ' + IMG_PATH_MOBILE + '?width=640 640w');
                    }
                    // hide early workaround
                    document.documentElement.classList.add('kk-banner-show');
                }
            }

            // change headline
            var headline = WATO.qs('.lpmHero__headline.hn-headline', wrapper);

            if(headline && TEXT_HEADLINE.length > 0){
                headline.innerHTML = htmlDecode(TEXT_HEADLINE);
            }

            var slogan = WATO.qs('.lpmHero__text', wrapper);

            if(slogan && TEXT_SLOGAN.length > 0){
                slogan.innerHTML = htmlDecode(TEXT_SLOGAN);
            }

            // console.log('TEXT_BADGE: ', TEXT_BADGE);
            // console.log('TEXT_POSITION: ', TEXT_POSITION);

            if(TEXT_BADGE.length > 0 && TEXT_COLOR.length > 0){
                wrapper.insertAdjacentHTML('afterbegin', 
                    '<div class="kk_herobadge'+((TEXT_POSITION.indexOf("left") !== -1 || TEXT_POSITION.indexOf("links") !== -1) ? ' kk_left' : ' kk_right')+'"'+
                    (TEXT_BADGE ? ' style="background-color:'+TEXT_COLOR+';"' : '')+
                    '>'+htmlDecode(TEXT_BADGE)+'</div>'
                );
            }

            // console.log('TEXT_BUTTON1: ', TEXT_BUTTON1);
            // console.log('LINK_BUTTON1: ', LINK_BUTTON1);
            // console.log('TEXT_BUTTON2: ', TEXT_BUTTON2);
            // console.log('LINK_BUTTON2: ', LINK_BUTTON2);
            // console.log('TEXT_BUTTON3: ', TEXT_BUTTON3);
            // console.log('LINK_BUTTON3: ', LINK_BUTTON3);
            // console.log('TEXT_BUTTON4: ', TEXT_BUTTON4);
            // console.log('LINK_BUTTON4: ', LINK_BUTTON4);
            
            var allButtons = [[TEXT_BUTTON1, LINK_BUTTON1], [TEXT_BUTTON2, LINK_BUTTON2], [TEXT_BUTTON3, LINK_BUTTON3], [TEXT_BUTTON4, LINK_BUTTON4]];
            // console.log('allButtons: ', allButtons);


            WATO.elem('.lpmHero__buttons .hn-button', function(originalButtons){
                if(originalButtons){

                    var categoryAffinityData = getProfileValue(KEY_DATA),
                        buttonsWrapper = originalButtons[0].parentNode;

                    // console.log('categoryAffinityData: ', categoryAffinityData);

                    for (var i = 0; i < allButtons.length; i++) {
                        var thisButton = allButtons[i];
                        if(thisButton[0].length === 0 && originalButtons[i]){
                            thisButton[0] = originalButtons[i].textContent;
                        }
                        if(thisButton[1].length === 0 && originalButtons[i]){
                            thisButton[1] = originalButtons[i].getAttribute('href');
                        }
                    }

                    // console.log('allButtons: ', allButtons);

                    allButtons.sort(function(a, b) {

                        a = a[1].toLowerCase(),
                        b = b[1].toLowerCase();

                        var x = 0,
                            y = 0;

                        if(a.indexOf("herren") !== -1){
                            x = categoryAffinityData.herren;
                        }else if(a.indexOf("damen") !== -1){
                            x = categoryAffinityData.damen;
                        }else if(a.indexOf("baby") !== -1 || a.indexOf("junior") !== -1){
                            x = categoryAffinityData.baby;
                        }else if(a.indexOf("home") !== -1){
                            x = categoryAffinityData.home;
                        }

                        if(b.indexOf("herren") !== -1){
                            y = categoryAffinityData.herren;
                        }else if(b.indexOf("damen") !== -1){
                            y = categoryAffinityData.damen;
                        }else if(b.indexOf("baby") !== -1  || b.indexOf("junior") !== -1){
                            y = categoryAffinityData.baby;
                        }else if(b.indexOf("home") !== -1){
                            y = categoryAffinityData.home;
                        }

                        // a ist kleiner als b anhand von Sortierkriterien
                        if (x < y) {
                          return 1;
                        }
                        // a ist größer als b anhand der Sortierkriterien
                        if (x > y) {
                          return -1;
                        }
                        // a muss gleich b sein
                        return 0;
                    });
                    // console.log('allButtons: sort', allButtons);

                    buttonsWrapper.innerHTML = "";

                    for (var j = 0; j < allButtons.length; j++) {
                        if(allButtons[j][0].length > 0 && allButtons[j][1].length > 0){
                            buttonsWrapper.insertAdjacentHTML('beforeend', 
                                (j === 2 ? '<br class="show-for-small-only">' : '')+
                                '<a href="'+allButtons[j][1]+'" class="hn-button"> ' + allButtons[j][0] + '</a>'
                            );
                        }
                    }
                    setClickGoals();
                }
            });



            // parsing error
            // try {

            //     var categoryAffinity = getProfileValue(KEY_STATUS);

            //     console.log("categoryAffinity", categoryAffinity);

            //     // change buttons
            //     if(categoryAffinity){ //  && categoryAffinity !== 'damen'

            //         // Profile data
            //         var categoryAffinityData = getProfileValue(KEY_DATA);

            //         delete categoryAffinityData.lastVisit;

            //         console.log('categoryAffinityData: ', categoryAffinityData);

            //         // fix, clear categoryAffinityData object
            //         for(var category in categoryAffinityData){

            //             if(['damen', 'herren', 'baby', 'home'].indexOf(category) === -1){
            //                 delete categoryAffinityData[category];
            //             }
            //         }

            //         // NEW LINKS
            //         // https://www.hessnatur.com/de/sale/damen/c/sale-damen
            //         // https://www.hessnatur.com/de/sale/herren/c/sale-herren
            //         // https://www.hessnatur.com/de/sale/junior/c/sale-junior
            //         // https://www.hessnatur.com/de/sale/home/c/sale-home
            //         WATO.elem('.lpmHero__buttons', function(buttons){

            //             if(buttons){
            //                 console.log('buttons: ', buttons);

            //                 console.log('categoryAffinityData: ', categoryAffinityData);



            //                 buttons[0].innerHTML = Object.keys(categoryAffinityData)
            //                     .sort(function (a, b) {
            //                         return categoryAffinityData[b] - categoryAffinityData[a];
            //                     }).map(function(item, index){
            //                         console.log('item: ', item);
        
            //                         var br = '',
            //                             tempLink = '';
        
            //                         if(index === 2) {
            //                             br = '<br class="show-for-small-only">';
            //                         }
        
            //                         if(item === 'baby'){
            //                             item = 'junior';
            //                         }

            //                         tempLink = 'sale/' + item + '/c/sale-' + item;

            //                         if(TEXT_BUTTON1.length !== 0 && LINK_BUTTON1.length !== 0 && index === 0){
            //                             tempLink = LINK_BUTTON1;
            //                             item = TEXT_BUTTON1;
            //                         }
            //                         if(TEXT_BUTTON2.length !== 0 && LINK_BUTTON2.length !== 0 && index === 1){
            //                             tempLink = LINK_BUTTON2;
            //                             item = TEXT_BUTTON2;
            //                         }
            //                         if(TEXT_BUTTON3.length !== 0 && LINK_BUTTON3.length !== 0 && index === 2){
            //                             tempLink = LINK_BUTTON3;
            //                             item = TEXT_BUTTON3;
            //                         }
            //                         if(TEXT_BUTTON4.length !== 0 && LINK_BUTTON4.length !== 0 && index === 3){
            //                             tempLink = LINK_BUTTON4;
            //                             item = TEXT_BUTTON4;
            //                         }
        
            //                         return br + '<a href="'+tempLink+'" class="hn-button"> ' + item + '</a>';
            //                     }).join('');

            //                     setClickGoals();
            //                 }
            //             })
            //     } else {

            //         // set click events for control variation
            //         WATO.elem('.lpmHero__buttons', function(buttons){

            //             if(buttons){
            //                 setClickGoals();
            //             }
            //         });
            //     }
            // } catch(e) {
            //     console.log("KK >>> ", e.toString());
            // }
        }
    });
})(new window.WATO());