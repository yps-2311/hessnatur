/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function (WATO) {
	"use strict";

	WATO.prototype.AB09_checkPATH = function (value) {
		return window.location.pathname.indexOf("/de/checkout/multi/" + value) !== -1;

	};

	WATO.prototype.AB09_sendGoal = function (goal) {
		window.iridion = window.iridion || [];
		window.iridion.push(['goal', goal]);
	};

	WATO.prototype.AB09_clickGoalElem = function (elem, goal, event) {
		var _self = this;
		elem.addEventListener(event || 'click', function () {
			_self.AB09_sendGoal(goal);
		});
	};

	WATO.prototype.AB09_clickGoalSelector = function (selector, goal, event) {
		var _self = this;
		_self.elem(selector, function (elem) {
			if (elem) {
				for (var i = 0; i < elem.length; i++) {
					_self.AB09_clickGoalElem(elem[i], goal, event);
				}
			}
		});
	};

	WATO.prototype.AB09_goals = function () {
		var _self = this;

		_self.elem('.progressTracker .progressTracker__Item a', function (progressSteps) {
			if (progressSteps) {

				// tag steps
				for (var i = 0; i < progressSteps.length; i++) {
					_self.AB09_clickGoalElem(progressSteps[i], 'kk_ab09_click_progress');

				}

			}
		});

		/**
		 * ROUTING
		 */
		// PAGE: LOGIN
		if (window.location.pathname === "/de/login/checkout") {

			_self.AB09_sendGoal('kk_ab09_pv_anmeldung');
			_self.AB09_clickGoalSelector('#guestRegisterForm .button', 'kk_ab09_click_konto');
			_self.AB09_clickGoalSelector('#account_guest .button', 'kk_ab09_click_gast');
			_self.AB09_clickGoalSelector('#loginForm .text-right .button', 'kk_ab09_click_login');

			// PAGE: IHRE DATEN
		} else if (_self.AB09_checkPATH("register")) {
			_self.AB09_sendGoal('kk_ab09_pv_data');
			_self.AB09_clickGoalSelector('form .button.success', 'kk_ab09_click_cta_data');

			_self.AB09_clickGoalSelector('#registerForm input', 'kk_ab09_interaction_invoice_data');
			_self.AB09_clickGoalSelector('#registerForm input', 'kk_ab09_interaction_invoice_data', 'keyup');


			// PAGE: Adressen
		} else if (_self.AB09_checkPATH("addresses/add-delivery-address")) {
			_self.AB09_clickGoalSelector('form .button.success', 'kk_ab09_click_cta_address');
			_self.AB09_clickGoalSelector('#addressForm .medium-10 > .h-smallOffset-bottom-outer input', 'kk_ab09_interaction_invoice');
			_self.AB09_clickGoalSelector('#additional--address input', 'kk_ab09_interaction_delivery');
			_self.AB09_clickGoalSelector('#addressForm .medium-10 > .h-smallOffset-bottom-outer input', 'kk_ab09_interaction_invoice', 'keyup');
			_self.AB09_clickGoalSelector('#additional--address input', 'kk_ab09_interaction_delivery', 'keyup');


			// PAGE: Zahlungsart
		} else if (_self.AB09_checkPATH("payment/add-payment-method")) {
			_self.AB09_clickGoalSelector('form .button.success', 'kk_ab09_click_cta_payment');
			_self.AB09_clickGoalSelector('form .button.hollow', 'kk_ab09_click_back_to_address');
			_self.AB09_clickGoalSelector('#paymentDetailsForm input+label', 'kk_ab09_click_payment_option');
			_self.AB09_clickGoalSelector('#paymentDetailsForm input', 'kk_ab09_click_payment_option');


			// PAGE: Zusammenfassung
		} else if (_self.AB09_checkPATH("summary")) {
			_self.AB09_clickGoalSelector('form .button.success', 'kk_ab09_click_cta_buy_now');

			_self.elem('form .button.hollow', function (editLinks) {
				if (editLinks) {
					_self.AB09_clickGoalElem(editLinks[0], 'kk_ab09_click_edit_invoice');
					_self.AB09_clickGoalElem(editLinks[1], 'kk_ab09_click_edit_delivery');
					_self.AB09_clickGoalElem(editLinks[2], 'kk_ab09_click_edit_payment');
				}
			});
		}

	};

})(window.WATO);

