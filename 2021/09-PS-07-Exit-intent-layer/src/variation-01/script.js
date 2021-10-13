// load core and global js
// @ codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function(WATO, window) {
    "use strict";

	/*jshint loopfunc: true */

	window.iridion.econda.push(["SprintPS07", "V1"]);

	function pushGoal(key, sendOnNextPageView){    
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}
	function goalClickEmail() {
		pushGoal("kk_ps07_click_email");
	}
	function goalClickCta() {
		pushGoal("kk_ps07_click_cta");
	}

	// WATO.elem('#myAccountLink .header-link-login-icon-text', function(headerUserLoggedIn){
	// 	if(headerUserLoggedIn){

	// 		// user is NOT logged in?
	// 		if(headerUserLoggedIn[0].textContent === "Einloggen"){

	// 		}
	// 	}
	// });
	

	if(window.innerWidth > 1023){

		WATO.ps07global(function(){

			if(!WATO.qs('.kk_nlmodal')){

				// Segment: Wollte Seite verlassen (exit intent)
				window.iridion.push(["segment", "32875"]);

				// Modal wird eingebaut
				WATO.qs('body').insertAdjacentHTML('afterbegin', 
					'<div class="reveal-overlay kk_nlmodal">'+
						'<div id="availability-matrix" class="availability-matrix reveal" data-reveal="wlkcnt-reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" data-yeti-box="availability-matrix" data-resize="availability-matrix" style="display: block; top: 185px;" tabindex="-1">'+
							'<div class="row">'+
								'<div class="kk_left">'+
									// '<img src="https://media.hessnatur.com/kk/2021/ps07-exitintent/modalbg.jpg">'+
									'<div class="kk_badge">10 €<span>Gutschein</span></div>'+
								'</div>'+
								'<div class="column kk_right">'+
									'<p>Jetzt zum Newsletter anmelden</p>'+
									'<h4>10 € GUTSCHEIN sichern</h4>'+
									'<p>und über Angebote, Neuheiten & mehr<br>informiert werden.</p>'+
									'<div class="kk_formspace">'+
									'</div>'+
									'<small>Ich habe die <a href="/../datenschutz" target="_blank" rel="noopener noreferrer" class="text-link">Datenschutz-Information</a> gelesen und stimme zu, dass zur Bestätigung meiner Angaben eine Nachricht an oben genannte E-Mail-Adresse verschickt wird.<br><br>'+
									'(Gutschein einlösbar ab 49,- € Mindestbestellwert, 30 Tage gültig ab Erhalt).</small>'+
								'</div>'+
							'</div>'+
							'<button class="close-button" data-close="" aria-label="Close reveal" type="button"><span aria-hidden="true">×</span></button>'+
						'</div>'+
					'</div>'
				);

				var modal = WATO.qs('.kk_nlmodal'),
					originalNL = WATO.qs('.footerNewsletterWrapper #newsletterRegistrationForm'),
					// cta = WATO.qs('.input-group-button', originalNL),
					inputField = WATO.qs('.input-group-field', originalNL),
					linkDatenschutz = WATO.qs('small .text-link', modal);

				// poll on cta
				WATO.elem('.footerNewsletterWrapper #newsletterRegistrationForm .newsletterRegistrationBtn', function(cta){
					if(!cta) return;

					cta = cta[0];

					var closeModal = function(status){
						// console.log("closeModal");
						var replacedNL = WATO.qs('#newsletterRegistrationForm', modal);

						if(status !== "success") {
							pushGoal("kk_ps07_close");
						}

						// Buttonbeschriftung wird entfernt
						cta.value = "";

						cta.removeEventListener('click', goalClickCta);
						inputField.removeEventListener('click', goalClickEmail);

						replacedNL.setAttribute('action', replacedNL.getAttribute('action').replace("Exitintent-Anmeldung", "Footer-Anmeldung"));

						// Verschoben
						WATO.qs('.footerNewsletterWrapper .h-largeOffset-bottom-inner').insertAdjacentElement('afterend', replacedNL);

						// Modal wird entfernt
						modal.parentNode.removeChild(modal);
					}

					// Buttonbeschriftung wird eingebaut in den Originalbutton
					cta.value = "Jetzt anmelden";
					cta.addEventListener('click', goalClickCta);

					inputField.addEventListener('click', goalClickEmail);

					modal.addEventListener('click', function(e){
						if(e.target.classList && e.target.classList.contains('kk_nlmodal')){
							pushGoal("kk_ps07_click_blur");
						}
					});
					linkDatenschutz.addEventListener('click', function(){
						pushGoal("kk_ps07_datenschutz");
					});

					// Beim erfolgreichen absenden wird eine Klasse gesetzt
					originalNL.addEventListener('submit', function(){
						WATO.elem('.js-newsletter-form-error.success', function(success){
							if(success){
								originalNL.classList.add('kk_success');
								setTimeout(function(){
									closeModal("success");
								}, 2000);
							}
						});
					});

					originalNL.setAttribute('action', originalNL.getAttribute('action').replace("Footer-Anmeldung", "Exitintent-Anmeldung"));

					// Das Form aus dem Footer wird ins Modal verschoben
					WATO.qs('.kk_formspace', modal).insertAdjacentElement('afterbegin', originalNL);

					// Beim schließen des Modals wird das Form wirder an seine ursprüngliche Position verschoben
					modal.addEventListener('click', function(e){
						if(e.target.classList.contains('kk_nlmodal')){
							closeModal();
						}
					});
					WATO.qs('.close-button', modal).addEventListener('click', closeModal);
				});
			}
		});
	}
})(new window.WATO(), window);