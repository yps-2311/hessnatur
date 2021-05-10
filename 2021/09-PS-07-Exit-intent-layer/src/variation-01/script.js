// load core and global js
// @codekit-prepend "../global/global.js";
// @codekit-prepend "../assets/ouibounce.js";
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

	// window.iridion.econda.push(["SprintPS06", "V1"]);

	// function pushGoal(key, sendOnNextPageView){    
	// 	if(sendOnNextPageView){
	// 		window.iridion.push(['goal', key, '', true]);
	// 	}else{
	// 		window.iridion.push(['goal', key]);
	// 	}
	// }

	WATO.elem(function () {
		return typeof window.ouibounce !== 'undefined';
	}, function(ouibounceReady){
		if(ouibounceReady){

			// Das Ouibounce-Script reagiert auf ein Exitintent 
			// beim verlassen des Cursors nach oben aus dem Browser
			window.ouibounce(false, {
				callback: function () {

					// Modal wird eingebaut
					WATO.qs('body').insertAdjacentHTML('afterbegin', 
						'<div class="reveal-overlay kk_nlmodal">'+
							'<div id="availability-matrix" class="availability-matrix reveal" data-reveal="wlkcnt-reveal" data-close-on-click="true" data-animation-in="fade-in" data-animation-out="fade-out" role="dialog" aria-hidden="false" data-yeti-box="availability-matrix" data-resize="availability-matrix" style="display: block; top: 185px;" tabindex="-1">'+
								'<div class="row">'+
									'<div class="small-5">'+
										'<img src="https://media.hessnatur.com/kk/2021/ps07-exitintent/modalbg.jpg">'+
									'</div>'+
									'<div class="column small-7">'+
										'<p>Jetzt zum Newsletter anmelden</p>'+
										'<h4>10 € GUTSCHEIN sichern</h4>'+
										'<p>und über Angebote, Neuheiten & mehr<br>informiert werden.</p>'+
										'<div class="kk_formspace">'+
										'</div>'+
										'<small>Ich habe die <a href="/../datenschutz" target="_blank" rel="noopener noreferrer" class="text-link">Datenschutz-Information</a> gelesen und stimme zu, dass zur Bestätigung meiner Angaben eine Nachricht an unten genannte E-Mail-Adresse verschickt wird.<br><br>'+
										'(Gutschein einlösbar ab 49,- € Mindestbestellwert, 30 Tage gültig ab Erhalt).</small>'+
									'</div>'+
								'</div>'+
								'<button class="close-button" data-close="" aria-label="Close reveal" type="button"><span aria-hidden="true">×</span></button>'+
							'</div>'+
						'</div>'
					);

					var modal = WATO.qs('.kk_nlmodal'),
						originalNL = WATO.qs('.footerNewsletterWrapper #command');

					// Buttonbeschriftung wird eingebaut in den Originalbutton
					WATO.qs('.input-group-button', originalNL).value = "Jetzt anmelden";

					// Beim erfolgreichen absenden wird eine Klasse gesetzt
					originalNL.addEventListener('submit', function(){
						WATO.elem('.js-newsletter-form-error.success', function(success){
							if(success){
								originalNL.classList.add('kk_success');
							}
						});
					});

					// Das Form aus dem Footer wird ins Modal verschoben
					WATO.qs('.kk_formspace', modal).insertAdjacentElement('afterbegin', originalNL);

					// Beim schließen des Modals wird das Form wirder an seine ursprüngliche Position verschoben
					WATO.qs('.close-button', modal).addEventListener('click', function(){
						var replacedNL = WATO.qs('#command', modal);

						// Buttonbeschriftung wird entfernt
						WATO.qs('.input-group-button', replacedNL).value = "";

						// Verschoben
						WATO.qs('.footerNewsletterWrapper .h-largeOffset-bottom-inner').insertAdjacentElement('afterend', replacedNL);

						// Modal wird entfernt
						modal.parentNode.removeChild(modal);
					});
				},
				aggressive: true,
				cookieExpire: 10,
				timer: 0
			});
		}
	});
	
})(new window.WATO(), window);