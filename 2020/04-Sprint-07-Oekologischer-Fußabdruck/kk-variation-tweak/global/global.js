/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function (WATO, _w) {
	"use strict";

	WATO.prototype.KK_AB07_BOX = function (ecoData, pds) {

		function formatValue(value) {
			var toRound = value > 999 ? 10 : 100,
				num_parts = (Math.round(value * toRound) / toRound).toString().split(".");
			num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			return num_parts.join(",");
		}

		var waterValue = formatValue(ecoData[0]),
			earthValue = formatValue(ecoData[1]),
			savings = [
				['water', waterValue + ' l', 'weniger <br/>Wasserverbrauch', '91% Einsparung von Wasser durch <br/>Verwendung von Regenwasser, im <br/>Boden gespeicherte Feuchtigkeit und <br/>Anwendung verbrauchsarmer <br/>Bewässerungsmethoden.'],
				['co2', '46 %', 'weniger <br/>CO2-Ausstoß', '46 % CO2 Einsparung durch weniger <br/>energieintensive Arbeitsmethoden im <br/>Bio-Anbau und den Verzicht auf <br/>Mineraldünger und Pestizide.'],
				['earth', earthValue + ' m²', 'mehr <br/>gesunde Erde', earthValue + ' m² mehr gesunde Erde durch <br/>Vermeidung von Pestiziden, <br/>künstlichen Düngemitteln und <br/>Entlaubungsmitteln.']
			];

		var savingsMarkup = '';

		for (var i = 0; i < savings.length; i++) {
			savingsMarkup += '<li><i class="kk07_eco__icon ' + savings[i][0] + '"></i><strong>' + savings[i][1] + '</strong>' + savings[i][2] + '</li>';
		}

		return {
			savings: savings,
			markup: '<div class="row kk07_header">' +
				'<div class="column">' +
				'<div>' +
				'<div class="kk07_headline">' +
				'<span>' +
				'Ökologische Ersparnis' +
				(pds ? '' : '<br/>durch diesen Einkauf') +
				'</span>' +
				(pds ? 'bei der Herstellung dieses Artikels.' : 'Durch Ihren Einkauf helfen Sie uns die Welt ein Stück besser zu machen.') +
				'</div>' +
				'<div>' +
				'<ul>' +
				savingsMarkup +
				'</ul>' +
				(pds ? '<a href="#kk07_ecological">mehr Infos</a>' : '') +
				'</div>' +
				'</div>' +
				'</div>' +
				'</div>'
		};
	};

	WATO.prototype.KK_AB07_PDS = function () {
		var savings,
			_self = this,
			windowHeight = (window.innerHeight || document.documentElement.clientHeight),
			ecoWrapper;

		function pushGoal(goal) {
			_w.iridion = _w.iridion || [];
			_w.iridion.push(['goal', goal]);
		}

		// Check if user scrolled to Product Description
		function checkScrollDepth() {
			var vertInView = (ecoWrapper.top <= windowHeight) && ((ecoWrapper.top + ecoWrapper.height) >= 0);
			if (vertInView) {

				window.iridion.push(['goal', 'kk07_eco_seen']);

				window.removeEventListener('scroll', checkScrollDepth);
			}
		}

		_self.exclude(1023, function () {
			_self.reload();
		});

		if (document.URL.indexOf('/p/') !== -1) {
			document.documentElement.classList.add('kk07B');

			_self.elem(function () {
				return !!_w.kk07_ecoData;
			}, function (run) {
				if (run) {

					var productInfo = JSON.parse(window.localStorage.getItem('kk_eco_products')) || {},
						ecoData = [_w.kk07_ecoData.water_savings_in_liter, _w.kk07_ecoData.clean_earth_consumption_in_square_meter],
						boxInfos = _self.KK_AB07_BOX(ecoData, true);

					savings = boxInfos.savings;

					productInfo[document.URL.match(/de\/.*\/p\/(\d+)/)[1]] = ecoData;
					window.localStorage.setItem('kk_eco_products', JSON.stringify(productInfo));


					_self.elem('.pds-cockpit__wrapper .align-justify', function (headerElem) {
						if (headerElem) {
							headerElem[0].insertAdjacentHTML('afterend', boxInfos.markup);
						}
					});


					_self.elem('.kk07_header', function(headerElement){
						if(headerElement){
							headerElement = headerElement[0];
							headerElement.addEventListener('click', function () {
								pushGoal('kk07_click_element');
							});
		
							_self.qs('a', headerElement).addEventListener('click', function (e) {
								e.preventDefault();
								pushGoal('kk07_click_more_info');
								jQuery("html, body").animate({ scrollTop: jQuery('#kk07_ecological').offset().top - 75 });
							});
						}
					});
					// var headerElement = _self.qs('.kk07_header');
					// headerElement.addEventListener('click', function () {
					// 	pushGoal('kk07_click_element');
					// });

					// _self.qs('a', headerElement).addEventListener('click', function (e) {
					// 	e.preventDefault();
					// 	pushGoal('kk07_click_more_info');
					// 	jQuery("html, body").animate({ scrollTop: jQuery('#kk07_ecological').offset().top - 75 });
					// });

					_self.elem('.js-pds-more-details', function(moreDet){
						if(moreDet){
							moreDet[0].addEventListener('click', function () {
								pushGoal('kk07_click_more_details');
							});
						}
					});

					// _self.qs('.js-pds-more-details').addEventListener('click', function () {
					// 	pushGoal('kk07_click_more_details');
					// });

					_self.elem('#kk07_ecological', function (ecoElem) {
						if (ecoElem) {
							ecoWrapper = ecoElem[0];
							_self.qs('.h3', ecoWrapper).innerHTML = '<strong>Ökologische Ersparnis:</strong> Im Vergleich zum <br/>konventionellen Baumwollanbau';

							Array.prototype.forEach.call(_self.qsa('.kk07_eco__point', ecoWrapper), function (ecoPoint, index) {
								for (var i = 1; i < 4; i++) {
									ecoPoint.children[i].innerHTML = savings[index][i];
								}
							});
							ecoWrapper.style.opacity = '1';

							if (!checkScrollDepth()) {
								window.addEventListener('scroll', checkScrollDepth);
							}
						}
					});

				}
			});
		}
	};

})(window.WATO, window);

