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

    var textContent = "{{name=Headline&type=webarts.watt.editor.impl.TextBoxEditor}}",
        imgPath = "{{name=Image&type=webarts.watt.editor.impl.TextBoxEditor}}";

    WATO.elem(".lpmHero__wrapper .lpmHero__image", function(banner) {

        if(banner) {

            banner = banner[0];

            if(imgPath !== ""){

                banner.setAttribute('src', imgPath + '?width=640');
                banner.setAttribute('srcset', imgPath + '?width=640 640w, ' + imgPath + '?width=1024 1024w, ' + imgPath + '?width=1200 1200w, ' + imgPath + '?width=1440 1440w, ' + imgPath + '?width=1920 1920w');
            }

            document.documentElement.classList.add('kk-banner-show');
        }
    });

    WATO.elem('.lpmHero__headline.hn-headline', function(bannerContent){

        if(bannerContent){
            bannerContent[0].textContent = textContent;
        }
    });
})(new window.WATO());

