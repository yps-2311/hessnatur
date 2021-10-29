// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation Damen
 * @description
 */
(function(WATO) {
    "use strict";

    function getProfileValue(key, defaultValue) {
        if(!key) return;

        // var profileArray = ['profile', 'getValue', key];

        // if(defaultValue){
        //     profileArray.push(JSON.stringify(defaultValue));
        // }

        // return window.iridion.push(profileArray);

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
    //     // Versuchen mit encoding zu verwenden
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
    var TEXT_HEADLINE = "{{name=Headline&desc=Bitte die gewünschte Headline eingeben (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_SLOGAN = "{{name=Slogan&desc=Bitte den gewünschten Slogan eingeben. Dieser wird unterhalb der Headline positioniert (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        IMG_PATH_DESKTOP = "{{name=Desktop_Image&desc=Bitte den Link für das Desktop-Image einfügen. Bitte darauf achten, dass die URL keine Parameter wie z.B. “?” oder sonstige Sonderzeichen enthält.&type=webarts.watt.editor.impl.ImageUrlEditor}}",
        IMG_PATH_MOBILE = "{{name=Mobile_Image&desc=Bitte den Link für das Mobile-Image einfügen. Bitte darauf achten, dass die URL keine Parameter wie z.B. “?” oder sonstige Sonderzeichen enthält.&type=webarts.watt.editor.impl.ImageUrlEditor}}",
        TEXT_BUTTON1 = "{{name=Button1_Text&desc=Bitte wählen Sie den Text für Button 1 (optional - bei Freilassen steht hier 'Damen')&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON1 = "{{name=Button1_Link&desc=Bitte fügen Sie den Link für Button 1 ein  (optional - bei Freilassen führt es zu 'Damen')&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON2 = "{{name=Button2_Text&desc=Bitte wählen Sie den Text für Button 2 (optional - bei Freilassen steht hier 'Herren')&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON2 = "{{name=Button2_Link&desc=Bitte fügen Sie den Link für Button 2 ein (optional - bei Freilassen führt es zu 'Herren')&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON3 = "{{name=Button3_Text&desc=Bitte wählen Sie den Text für Button 3 (optional - bei Freilassen steht hier 'Junior')&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON3 = "{{name=Button3_Link&desc=Bitte fügen Sie den Link für Button 3 ein (optional - bei Freilassen führt es zu 'Junior') &type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BUTTON4 = "{{name=Button4_Text&desc=Bitte wählen Sie den Text für Button 4 (optional - bei Freilassen steht hier 'Home')&type=webarts.watt.editor.impl.TextEditor}}",
        LINK_BUTTON4 = "{{name=Button4_Link&desc=Bitte fügen Sie den Link für Button 4 ein (optional - bei Freilassen führt es zu 'Home')&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BADGE = "{{name=Badge_Text&desc=Bitte wählen Sie den Text für den abgebildeten Badge (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_COLOR = "{{name=Badge_Color&hint=z.B. “green” ODER HTML-Farbcodes z.B. “#ff00000” &desc=Bitte wählen Sie die Farbe des Badges. Es können entweder Farben z.B. “green” ODER HTML-Farbcodes eingegeben werden z.B. “#ff00000” (optional).&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_POSITION = "{{name=Badge_Position&desc=Bitte wählen Sie die Position des Badges > Folgende Positionen sind auswählbar: (optional) left right&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_ALIGNMENT = "{{name=Elem_Alignment&desc=Bitte wählen Sie die Ausrichtung von Text und Buttons > Folgende Positionen sind auswählbar: (optional) left right center&type=webarts.watt.editor.impl.TextEditor}}";
    
    /** PROFILE */
    var KEY_DATA         = 'categoryAffinityData';
        // KEY_STATUS       = 'categoryAffinity';

    WATO.elem(".lpmHero__wrapper", function(wrapper) {

        if(wrapper) {

            wrapper = wrapper[0];

            if(TEXT_ALIGNMENT && TEXT_ALIGNMENT.length > 0){
                var alignment = htmlDecode(TEXT_ALIGNMENT).toLowerCase();
                if(alignment.indexOf("left") !== -1){
                    wrapper.classList.add('kk_alignment_left');
                }else if(alignment.indexOf("right") !== -1){
                    wrapper.classList.add('kk_alignment_right');
                }
            }

            // if(IMG_PATH_DESKTOP && IMG_PATH_MOBILE){

            // change background image
            wrapper.insertAdjacentHTML('afterbegin', 
                // DESKTOP
                ((IMG_PATH_DESKTOP.length > 0 && valideImgURL(IMG_PATH_DESKTOP)) ? '<img alt="20% auf Jacken und Mäntel" '+
                    'class="kk_heroimg lpmHero__image show-for-medium" sizes="(min-width: 1920px) 1920px, (min-width: 1440px) 1440px, '+
                    '(min-width: 1200px) 1200px, (min-width: 1024px) 1024px, (min-width: 640px) 640px, 100vw" '+
                    'src="'+IMG_PATH_DESKTOP+'?width=640" srcset="'+IMG_PATH_DESKTOP+'?width=640 640w, '+IMG_PATH_DESKTOP+'?width=1024 1024w, '+
                    IMG_PATH_DESKTOP+'?width=1200 1200w, '+IMG_PATH_DESKTOP+'?width=1440 1440w, '+IMG_PATH_DESKTOP+'?width=1920 1920w">' : '')+
                // MOBILE
                ((IMG_PATH_MOBILE.length > 0 && valideImgURL(IMG_PATH_MOBILE)) ? '<img alt="20% auf Jacken und Mäntel" '+
                'class="kk_heroimg lpmHero__image show-for-small-only" sizes="(min-width: 640px) 640px, (min-width: 375px) 375px, 100vw" src="' + IMG_PATH_MOBILE + 
                '?width=375" srcset="' + IMG_PATH_MOBILE + '?width=375 375w, ' + IMG_PATH_MOBILE + '?width=640 640w">' : '')
            );

            // var image = WATO.qsa('.lpmHero__image', wrapper);

            // if(image){

            //     // console.log('IMG_PATH_DESKTOP: ', IMG_PATH_DESKTOP);
            //     // console.log('valideImgURL(IMG_PATH_DESKTOP): ', valideImgURL(IMG_PATH_DESKTOP));
            //     if(IMG_PATH_DESKTOP.length > 0 && valideImgURL(IMG_PATH_DESKTOP)){
            //         image[0].setAttribute('src', IMG_PATH_DESKTOP + '?width=640');
            //         image[0].setAttribute('srcset', IMG_PATH_DESKTOP + '?width=640 640w, ' + IMG_PATH_DESKTOP + '?width=1024 1024w, ' + IMG_PATH_DESKTOP + '?width=1200 1200w, ' + IMG_PATH_DESKTOP + '?width=1440 1440w, ' + IMG_PATH_DESKTOP + '?width=1920 1920w');    
            //     }
                
            //     // console.log('IMG_PATH_MOBILE: ', IMG_PATH_MOBILE);
            //     // console.log('valideImgURL(IMG_PATH_MOBILE): ', valideImgURL(IMG_PATH_MOBILE));
            //     if(IMG_PATH_MOBILE.length > 0 && valideImgURL(IMG_PATH_MOBILE)){
            //         image[1].setAttribute('src', IMG_PATH_MOBILE + '?width=375');
            //         image[1].setAttribute('srcset', IMG_PATH_MOBILE + '?width=375 375w, ' + IMG_PATH_MOBILE + '?width=640 640w');
            //     }
            //     // hide early workaround
            //     document.documentElement.classList.add('kk-banner-show');
            // }
            // }


            // var haveSomeVariationsHL = false,
            //     haveSomeVariationsSlogan = false,
            //     isVariation = false;
            var headline = WATO.qs('.lpmHero__headline.hn-headline', wrapper),
                isHeadline = headline && TEXT_HEADLINE.length > 0,
                headlineText = isHeadline ? htmlDecode(TEXT_HEADLINE) : '',
                slogan = WATO.qs('.lpmHero__text', wrapper),
                isSlogan = slogan && TEXT_SLOGAN.length > 0,
                slodanText = isSlogan ? htmlDecode(TEXT_SLOGAN) : '';

            // if(isHeadline){
            //     if(headlineText.indexOf('~~~') !== -1){
            //         haveSomeVariationsHL = true;
            //     }
            // }
            // if(isSlogan){
            //     if(slodanText.indexOf('~~~') !== -1){
            //         haveSomeVariationsSlogan = true;
            //     }
            // }
            // if(haveSomeVariationsHL || haveSomeVariationsSlogan){
            //     var hasSegmentV1 = window.iridion.push(['hasSegment', "32903"]),
            //         hasSegmentV2 = window.iridion.push(['hasSegment', "32904"]),
            //         dice = (Math.random()>0.5);

            //     if (!hasSegmentV1 && !hasSegmentV2) {
            //         // Würfelung ob V1 oder V2
            //         window.iridion.push(["segment", (dice ? "32904" : "32903")]);
            //         isVariation = dice ? 0 : 1;
            //     }else if(hasSegmentV1){
            //         // Wenn der Benutzer wieder kommt und V1 ist
            //         isVariation = 0;
            //     }else if(hasSegmentV2){
            //         // Wenn der Benutzer wieder kommt und V2 ist
            //         isVariation = 1;
            //     }

            //     if(haveSomeVariationsHL){
            //         // Wenn es hier für die Headline Varianten gibt dann wird der Text gesplittet
            //         headlineText = headlineText.split('~~~')[isVariation];
            //     }
            //     if(haveSomeVariationsSlogan){
            //         // Wenn es hier für Slogan Varianten gibt dann wird der Text gesplittet
            //         slodanText = slodanText.split('~~~')[isVariation];
            //     }
            // }
            // console.log('isVariation: V', (isVariation+1));
            
            if(isHeadline){
                headline.innerHTML = headlineText;
            }

            if(isSlogan){
                slogan.innerHTML = slodanText;
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
                        }else if(a.indexOf("baby") !== -1 || a.indexOf("junior") !== -1 || a.indexOf("kinder") !== -1){
                            x = categoryAffinityData.baby;
                        }else if(a.indexOf("home") !== -1 || b.indexOf("zuhause") !== -1){
                            x = categoryAffinityData.home;
                        }

                        if(b.indexOf("herren") !== -1){
                            y = categoryAffinityData.herren;
                        }else if(b.indexOf("damen") !== -1){
                            y = categoryAffinityData.damen;
                        }else if(b.indexOf("baby") !== -1 || b.indexOf("junior") !== -1 || a.indexOf("kinder") !== -1){
                            y = categoryAffinityData.baby;
                        }else if(b.indexOf("home") !== -1 || b.indexOf("zuhause") !== -1){
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
        }
    });
})(new window.WATO());

// BKP
// !function(t,e){"use strict";void 0===t.WATO&&(t.WATO=function(){}),t.WATO.prototype.elem=function(t,n,i,r,o){var a,d=this||r,l=o||Date.now();return Date.now()-l>1e4?(n(!1),!1):!0===("string"==typeof t?(a=e.querySelectorAll(t)).length>0:!!(a=t()||!1))?n(a):setTimeout(d.elem.bind(null,t,n,i,d,l),i||20)},t.WATO.prototype.qs=function(t,n){return(n||e).querySelector(t)},t.WATO.prototype.qsa=function(t,n){return(n||e).querySelectorAll(t)},t.WATO.prototype.ready=function(t){(e.attachEvent?"complete"===e.readyState:"loading"!==e.readyState)?t():e.addEventListener("DOMContentLoaded",t)}}(window,document),function(t){"use strict";function e(t){var e=document.createElement("div");return e.innerHTML=t,0===e.childNodes.length?"":e.childNodes[0].nodeValue}function n(t){return null!==t.match(/^(http:\/\/|https:\/\/|\/).*\.(jpg|jpeg|png|svg).*/)}var i="{{name=Headline&desc=Bitte die gewünschte Headline eingeben (optional)&type=webarts.watt.editor.impl.TextEditor}}",r="{{name=Slogan&desc=Bitte den gewünschten Slogan eingeben. Dieser wird unterhalb der Headline positioniert (optional)&type=webarts.watt.editor.impl.TextEditor}}",o="{{name=Desktop_Image&desc=Bitte den Link für das Desktop-Image einfügen. Bitte darauf achten, dass die URL keine Parameter wie z.B. “?” oder sonstige Sonderzeichen enthält.&type=webarts.watt.editor.impl.ImageUrlEditor}}",a="{{name=Mobile_Image&desc=Bitte den Link für das Mobile-Image einfügen. Bitte darauf achten, dass die URL keine Parameter wie z.B. “?” oder sonstige Sonderzeichen enthält.&type=webarts.watt.editor.impl.ImageUrlEditor}}",d="{{name=Badge_Text&desc=Bitte wählen Sie den Text für den abgebildeten Badge (optional)&type=webarts.watt.editor.impl.TextEditor}}",l="{{name=Badge_Color&hint=z.B. “green” ODER HTML-Farbcodes z.B. “#ff00000” &desc=Bitte wählen Sie die Farbe des Badges. Es können entweder Farben z.B. “green” ODER HTML-Farbcodes eingegeben werden z.B. “#ff00000” (optional).&type=webarts.watt.editor.impl.TextEditor}}",s="{{name=Badge_Position&desc=Bitte wählen Sie die Position des Badges > Folgende Positionen sind auswählbar: (optional) left right&type=webarts.watt.editor.impl.TextEditor}}";t.elem(".lpmHero__wrapper",(function(w){if(w){w=w[0];var m=t.qsa(".lpmHero__image",w);m&&(o.length>0&&n(o)&&(m[0].setAttribute("src",o+"?width=640"),m[0].setAttribute("srcset",o+"?width=640 640w, "+o+"?width=1024 1024w, "+o+"?width=1200 1200w, "+o+"?width=1440 1440w, "+o+"?width=1920 1920w")),a.length>0&&n(a)&&(m[1].setAttribute("src",a+"?width=375"),m[1].setAttribute("srcset",a+"?width=375 375w, "+a+"?width=640 640w")),document.documentElement.classList.add("kk-banner-show"));var p=t.qs(".lpmHero__headline.hn-headline",w);p&&i.length>0&&(p.innerHTML=e(i));var u=t.qs(".lpmHero__text",w);u&&r.length>0&&(u.innerHTML=e(r)),d.length>0&&l.length>0&&w.insertAdjacentHTML("afterbegin",'<div class="kk_herobadge'+(-1!==s.indexOf("left")||-1!==s.indexOf("links")?" kk_left":" kk_right")+'" style="background-color:'+l+';">'+e(d)+"</div>");var h=[["{{name=Button1_Text&desc=Bitte wählen Sie den Text für Button 1 (optional - bei Freilassen steht hier 'Damen')&type=webarts.watt.editor.impl.TextEditor}}","{{name=Button1_Link&desc=Bitte fügen Sie den Link für Button 1 ein  (optional - bei Freilassen führt es zu 'Damen')&type=webarts.watt.editor.impl.TextEditor}}"],["{{name=Button2_Text&desc=Bitte wählen Sie den Text für Button 2 (optional - bei Freilassen steht hier 'Herren')&type=webarts.watt.editor.impl.TextEditor}}","{{name=Button2_Link&desc=Bitte fügen Sie den Link für Button 2 ein (optional - bei Freilassen führt es zu 'Herren')&type=webarts.watt.editor.impl.TextEditor}}"],["{{name=Button3_Text&desc=Bitte wählen Sie den Text für Button 3 (optional - bei Freilassen steht hier 'Junior')&type=webarts.watt.editor.impl.TextEditor}}","{{name=Button3_Link&desc=Bitte fügen Sie den Link für Button 3 ein (optional - bei Freilassen führt es zu 'Junior') &type=webarts.watt.editor.impl.TextEditor}}"],["{{name=Button4_Text&desc=Bitte wählen Sie den Text für Button 4 (optional - bei Freilassen steht hier 'Home')&type=webarts.watt.editor.impl.TextEditor}}","{{name=Button4_Link&desc=Bitte fügen Sie den Link für Button 4 ein (optional - bei Freilassen führt es zu 'Home')&type=webarts.watt.editor.impl.TextEditor}}"]];t.elem(".lpmHero__buttons .hn-button",(function(e){if(e){for(var n=function(t,e){if(t)return e?window.iridion.push(["profile","getValue",t,JSON.stringify(e)]):window.iridion.push(["profile","getValue",t])}("categoryAffinityData"),i=e[0].parentNode,r=0;r<h.length;r++){var o=h[r];0===o[0].length&&e[r]&&(o[0]=e[r].textContent),0===o[1].length&&e[r]&&(o[1]=e[r].getAttribute("href"))}h.sort((function(t,e){t=t[1].toLowerCase(),e=e[1].toLowerCase();var i=0,r=0;return-1!==t.indexOf("herren")?i=n.herren:-1!==t.indexOf("damen")?i=n.damen:-1!==t.indexOf("baby")||-1!==t.indexOf("junior")?i=n.baby:-1!==t.indexOf("home")&&(i=n.home),-1!==e.indexOf("herren")?r=n.herren:-1!==e.indexOf("damen")?r=n.damen:-1!==e.indexOf("baby")||-1!==e.indexOf("junior")?r=n.baby:-1!==e.indexOf("home")&&(r=n.home),i<r?1:i>r?-1:0})),i.innerHTML="";for(var a=0;a<h.length;a++)h[a][0].length>0&&h[a][1].length>0&&i.insertAdjacentHTML("beforeend",(2===a?'<br class="show-for-small-only">':"")+'<a href="'+h[a][1]+'" class="hn-button"> '+h[a][0]+"</a>");!function(){for(var e=t.qsa(".lpmHero__buttons a"),n=0;n<e.length;n++)e[n].addEventListener("click",(function(){window.iridion.push(["goal","kk_sale_home_click_btn",this.textContent,!0])}))}()}}))}}))}(new window.WATO);