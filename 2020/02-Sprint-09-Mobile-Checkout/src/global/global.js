/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function (WATO) {
	"use strict";

	WATO.prototype.AB07_checkPATH = function (value) {
		return window.location.pathname.indexOf("/de/checkout/multi/" + value) !== -1;

	};

	WATO.prototype.AB07_sendGoal = function (goal) {
		window.iridion.push(['goal', goal]);
	};

	WATO.prototype.AB07_setClickGoal = function (selector, goal) {
		var _self = this;
		WATO.elem(selector, function (elem) {
			if (elem) {
				for (var i = 0; i < elem.length; i++) {
					elem[i].addEventListener('click', function () {
						_self.AB07_sendGoal(goal);
					});
				}
			}
		});
	};

	WATO.prototype.AB07_goals = function () {
		var _self = this;

		/**
		 * ROUTING
		 */
		// PAGE: LOGIN
		if (window.location.pathname === "/de/login/checkout") {

			_self.AB07_sendGoal('kk_ab09_pv_anmeldung');
			_self.AB07_setClickGoal('#guestRegisterForm .button', 'kk_ab09_click_konto');
			_self.AB07_setClickGoal('#account_guest .button', 'kk_ab09_click_gast');
			_self.AB07_setClickGoal('#loginForm .text-right .button', 'kk_ab09_click_login');

			// PAGE: IHRE DATEN (GAST)
		} else if (_self.AB07_checkPATH("register")) {
			_self.AB07_sendGoal('kk_ab09_pv_data');
			_self.AB07_setClickGoal('form .button.success', 'kk_ab09_click_cta_data');

			// PAGE: Adressen
		} else if (_self.AB07_checkPATH("addresses/add-delivery-address")) {
			_self.AB07_setClickGoal('form .button.success', 'kk_ab09_click_cta_address');

			// PAGE: Zahlungsart
		} else if (_self.AB07_checkPATH("payment/add-payment-method")) {
			_self.AB07_setClickGoal('form .button.success', 'kk_ab09_click_cta_payment');
			_self.AB07_setClickGoal('form .button.hollow', 'kk_ab09_click_back_to_address');
			_self.AB07_setClickGoal('#paymentDetailsForm input+label', 'kk_ab09_click_payment_option');


			// PAGE: Zusammenfassung
		} else if (_self.AB07_checkPATH("summary")) {
			_self.AB07_setClickGoal('form .button.success', 'kk_ab09_click_cta_buy_now');

			WATO.elem('form .button.hollow', function (editLinks) {
				if (editLinks) {
					editLinks[0].addEventListener('click', function () {
						_self.AB07_sendGoal('kk_ab09_click_edit_invoice');
					});
					editLinks[1].addEventListener('click', function () {
						_self.AB07_sendGoal('kk_ab09_click_edit_delivery');
					});
					editLinks[2].addEventListener('click', function () {
						_self.AB07_sendGoal('kk_ab09_click_edit_payment');
					});

				}
			});
		}

	};

})(window.WATO);

