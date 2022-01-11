// load core and global js
// @codekit-prepend "../global/global.js";
// @codekit-prepend "../assets/ouibounce.js";

/**
 * @function
 * @author Denis Leno
 * @namespace Template
 * @name Template-Exit-Intent-Layer
 * @description Template for Exit Intent Layer
 */

(function(WATO, window) {
    "use strict";

    function htmlDecode(input){
        if(input.length > 0){
            var e = document.createElement('div');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        }else{
            return false;
        }
    }

    function valideImgURL(url) {
        if(url.length > 0){
            return url.match(/^(http:\/\/|https:\/\/|\/).*\.(jpg|jpeg|png|svg).*/) !== null;
        }else{
            return false;
        }
    }

    /** EDITOR VARS */
    var IMG_IMAGE_LEFT = "{{name=ImageLeft&desc=Optimales Format: 298x430 Pixel&type=webarts.watt.editor.impl.ImageUrlEditor}}",
        TEXT_HEADLINE = "{{name=Headline&desc=Bitte die gewünschte Headline eingeben (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_SUBLINE = "{{name=Subline&desc=Bitte die gewünschte Subline eingeben. Dieser wird unterhalb der Headline positioniert (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_FLOWTEXT = "{{name=Text&desc=Bitte den gewünschten Text eingeben. Dieser wird unterhalb der Subline positioniert (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        DROPDOWN_NEWSLETTER_TRIGGER = "{{name=NewsletterONOFF&desc=Newsletter Eingabefeld wird angezeigt&type=webarts.watt.editor.impl.SelectEditor&values=on;off}}",
        TEXT_NEWSLETTER_BUTTON = "{{name=Newsletter_Button_Text&desc=Wenn Sie den Newsletter anzeigen können Sie den Text des Buttons ändern (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_FUSSNOTE = "{{name=Fussnote&desc=Sie können zusätzlichen Text als Fußnote angeben (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        DROPDOWN_BADGE_TRIGGER = "{{name=BadgeONOFF&desc=Badge über dem Bild wird angezeigt&type=webarts.watt.editor.impl.SelectEditor&values=on;off}}",
        TEXT_BADGE1 = "{{name=Badge_Text1&hint=max. 5 Zeichen&desc=Die Zeile des Badges hat nicht mehr Platz als 5 Zeichen (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        TEXT_BADGE2 = "{{name=Badge_Text2&desc=Dieser Text wird klein im Badge unter dem ersten Text angezeigt (optional)&type=webarts.watt.editor.impl.TextEditor}}",
        COLORPICKER_COLOR = "{{name=Badge_Background_Color&hint=#ff00000&hint=z.B. “green” ODER HTML-Farbcodes z.B. “#ff00000”&type=webarts.watt.editor.impl.ColorEditor}}",
        DROPDOWN_ALIGNMENT = "{{name=Badge_Alignment&desc=Ausrichtung des Textes im Badge&type=webarts.watt.editor.impl.SelectEditor&values=center;left;right}}",
        TEXT_COOKIENAME = "{{name=Cookiename&desc=Wenn man paralell mehrere Exit-intent-Layer nutzt sollten dessen Cookies sich unterscheiden (default: kk_modalclosed)&hint=kk_modalclosed&type=webarts.watt.editor.impl.TextEditor}}";
        

    // console.log('IMG_IMAGE_LEFT: ', IMG_IMAGE_LEFT);
    // console.log('TEXT_HEADLINE: ', TEXT_HEADLINE);
    // console.log('TEXT_SUBLINE: ', TEXT_SUBLINE);
    // console.log('TEXT_FLOWTEXT: ', TEXT_FLOWTEXT);
    // console.log('DROPDOWN_NEWSLETTER_TRIGGER: ', DROPDOWN_NEWSLETTER_TRIGGER);
    // console.log('TEXT_NEWSLETTER_BUTTON: ', TEXT_NEWSLETTER_BUTTON);
    // console.log('TEXT_FUSSNOTE: ', TEXT_FUSSNOTE);
    // console.log('DROPDOWN_BADGE_TRIGGER: ', DROPDOWN_BADGE_TRIGGER);
    // console.log('TEXT_BADGE1: ', TEXT_BADGE1);
    // console.log('TEXT_BADGE2: ', TEXT_BADGE2);
    // console.log('COLORPICKER_COLOR: ', COLORPICKER_COLOR);
    // console.log('DROPDOWN_ALIGNMENT: ', DROPDOWN_ALIGNMENT);
    

    function openModal() {

        if(!WATO.qs('.kk_template_modal')){

            var headline = htmlDecode(TEXT_HEADLINE),
                subline = htmlDecode(TEXT_SUBLINE),
                flowtext = htmlDecode(TEXT_FLOWTEXT),
                fussnote = htmlDecode(TEXT_FUSSNOTE),
                newsletterBoxOn = htmlDecode(DROPDOWN_NEWSLETTER_TRIGGER).toLowerCase().indexOf("on") !== -1,
                BadgeOn = htmlDecode(DROPDOWN_BADGE_TRIGGER).toLowerCase().indexOf("on") !== -1,
                badgeText1 = htmlDecode(TEXT_BADGE1),
                badgeText2 = htmlDecode(TEXT_BADGE2),
                badgeBackgroundColor = htmlDecode(COLORPICKER_COLOR) || "transparent",
                badgeAlignment = htmlDecode(DROPDOWN_ALIGNMENT).toLowerCase();

            // Modal wird eingebaut
            WATO.qs('body').insertAdjacentHTML('afterbegin', 
                '<div class="reveal-overlay kk_template_modal">'+
                    '<div id="availability-matrix" class="availability-matrix reveal" data-reveal="wlkcnt-reveal" data-close-on-click="true" data-animation-in="fade-in" '+
                    'data-animation-out="fade-out" role="dialog" aria-hidden="false" data-yeti-box="availability-matrix" data-resize="availability-matrix" style="display: block; top: 185px;" tabindex="-1">'+
                        '<div class="row">'+
                            '<div class="kk_left" '+(valideImgURL(IMG_IMAGE_LEFT) ? 'style="background-image: url('+IMG_IMAGE_LEFT+')" ' : '')+'>'+
                            (BadgeOn ?
                                '<div class="kk_badge" style="text-align: '+badgeAlignment+'; background-color: '+badgeBackgroundColor+';">'+
                                badgeText1+
                                (badgeText2 ? '<span>'+badgeText2+'</span>' : '')+
                                '</div>'
                            : '' )+
                            '</div>'+
                            '<div class="column kk_right">'+
                                (headline ? '<p>'+headline+'</p>' : '' )+
                                (subline ? '<h4>'+subline+'</h4>' : '' )+
                                (flowtext ? '<p>'+flowtext+'</p>' : '' )+
                                (newsletterBoxOn ?
                                    '<div class="kk_formspace"></div>'+
                                    '<small>Ich habe die <a href="/../datenschutz" target="_blank" rel="noopener noreferrer" class="text-link">Datenschutz-Information</a> '+
                                    'gelesen und stimme zu, dass zur Bestätigung meiner Angaben eine Nachricht an oben genannte E-Mail-Adresse verschickt wird.</small>'
                                : '' )+
                                (fussnote ? '<small>'+fussnote+'</small>' : '' )+
                            '</div>'+
                        '</div>'+
                        '<button class="close-button" data-close="" aria-label="Close reveal" type="button"><span aria-hidden="true">×</span></button>'+
                    '</div>'+
                '</div>'
            );

            var modal = WATO.qs('.kk_template_modal'),
                originalNL = WATO.qs('.footerNewsletterWrapper #newsletterRegistrationForm'),
                closeModal = function(){
                    var replacedNL = WATO.qs('#newsletterRegistrationForm', modal);

                    if(replacedNL){
                        // Buttonbeschriftung wird entfernt
                        WATO.qs('.newsletterRegistrationBtn', replacedNL).value = "";
        
                        replacedNL.setAttribute('action', replacedNL.getAttribute('action').replace("Exitintent-Anmeldung", "Footer-Anmeldung"));
        
                        // Verschoben
                        WATO.qs('.footerNewsletterWrapper .h-largeOffset-bottom-inner').insertAdjacentElement('afterend', replacedNL);
                    }

                    // Modal wird entfernt
                    modal.parentNode.removeChild(modal);
                };

            
            if(newsletterBoxOn){
            
                // poll on cta
                WATO.elem('.footerNewsletterWrapper #newsletterRegistrationForm .newsletterRegistrationBtn', function(cta){
                    if(!cta) return;

                    cta = cta[0];

                    // Buttonbeschriftung wird eingebaut in den Originalbutton
                    cta.value = htmlDecode(TEXT_NEWSLETTER_BUTTON);

                    // Beim erfolgreichen absenden wird eine Klasse gesetzt
                    originalNL.addEventListener('submit', function(){
                        WATO.elem('.js-newsletter-form-error.success', function(success){
                            if(success){
                                originalNL.classList.add('kk_success');
                                setTimeout(function(){
                                    closeModal();
                                }, 2000);
                            }
                        });
                    });

                    originalNL.setAttribute('action', originalNL.getAttribute('action').replace("Footer-Anmeldung", "Exitintent-Anmeldung"));

                    // Das Form aus dem Footer wird ins Modal verschoben
                    WATO.qs('.kk_formspace', modal).insertAdjacentElement('afterbegin', originalNL);
                    
                });
            }

            modal.addEventListener('click', function(e){
                if(e.target.classList.contains('kk_template_modal')){
                    closeModal();
                }
            });

            WATO.qs('.close-button', modal).addEventListener('click', closeModal);
        }
    }

    
    if(window.innerWidth > 779){

        WATO.elem(function () {
			return typeof window.ouibounce !== 'undefined';
		}, function(ouibounceReady){
			if(ouibounceReady){
				// Das Ouibounce-Script reagiert auf ein Exitintent 
				// beim verlassen des Cursors nach oben aus dem Browser
				window.ouibounce(false, {
					callback: openModal,
					aggressive: window.document.location.href.indexOf("dev") !== -1,
					cookieExpire: 30,
                    cookieName: htmlDecode(TEXT_COOKIENAME) || 'kk_modalclosed',
					timer: 0
				});
			}
		});

    }
})(new window.WATO(), window);