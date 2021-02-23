/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */
(function(WATO, window){
	"use strict";

	WATO.prototype.kkab21 = function() {
		var that = this;
		var excludeCookieName = 'kk-exclude-ab21';

		// Punchout
		if (!that.getCookie(excludeCookieName)) {
			that.exclude(1023, function() {
				that.setCookie(excludeCookieName, 'true', '.hessnatur.com', true);
				that.reload();
			});
		}

		function iridionPushGoal(apiKey) {
			window.iridion = window.iridion || [];
			window.iridion.push(['goal', apiKey]);
		}

		// Pushes an Iridion goal on hover
		// The delay roughly matches the delay on hessnatur.com before a dropdown is displayed
		// Prefixes goalName with "kk_ab21_hover_", so goals should be setup that way in WATT
		function pushIridionGoalOnHover(selectorOrElement, goalName) {
			var element = typeof selectorOrElement === 'string' ? that.qs(selectorOrElement) : selectorOrElement;

			if (element) {
				var timeout;
				element.addEventListener('mouseover', function() {
					timeout = setTimeout(function() {
						iridionPushGoal('kk_ab21_hover_' + goalName);
					}, 350);
				});

				element.addEventListener('mouseout', function() {
					clearTimeout(timeout);
				});
			}
		}

		// Pushes an Iridion goal on click
		function pushIridionGoalOnClick(selector, goalName) {
			var element = that.qs(selector);

			if (element) {
				element.addEventListener('click', function() {
					iridionPushGoal(goalName);
				});
			}
		}

		that.ready(function() {
			var searchForm = that.qs('#search_form input');

			if (searchForm) {
				searchForm.addEventListener('focus', function() {
					iridionPushGoal('kk_ab21_search_click');
				});
			}

			pushIridionGoalOnHover('a[data-toggle="miniWishListDropdown"]', 'wishlist');
			pushIridionGoalOnHover('a[data-toggle="miniCartDropdown"]', 'cart');
			pushIridionGoalOnHover('a[data-toggle="myAccountDropdown"]', 'account');

			that.qsa('.navigation-main.show-for-large li').forEach(function(item) {
				pushIridionGoalOnHover(item, 'nav');
			});

			pushIridionGoalOnClick('#header a[href="https://www.hessnatur.com/magazin/"]', 'click_magazin');
			pushIridionGoalOnClick('#header a[href="/de/newsletter/registrierung?nlregsource=HeaderLink"]', 'click_newsletter');
			pushIridionGoalOnClick('#header a[href="https://www.hessnatur.com/corporate/"]', 'click_ueberuns');
		});
	};
})(window.WATO, window);
