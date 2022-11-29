/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){

	"use strict";

	WATO.prototype.s38_GOALS = function(){

		WATO = this;


		/**
		* @function goalPush
		*
		* @description push goal to iridion
		*
		* @param {string} key - String which matches iridion Goal key
		* @param {boolean} nextPageSend - Boolean, to decide if goal is pushed immediatly or on next page load
		*/
		function goalPush(key, nextPageSend){
			window.iridion.push(['goal', key, "", nextPageSend || false]);
		}	

		function getPar(el){
			// if(typeof el) {
				return el && el.parentElement;
			// }
		}

		const searchParent = (el, searchedParentClass, qsSelector) => {

			if(!el) { return }

			if(el.classList.value.indexOf(searchedParentClass) !== -1){//#endregion

				// if(WATO.qs('.kk-hidden', el)) {
				if(WATO.qs(qsSelector, el)) {
					goalPush('kk_click_vegan_product');
				}

				return;

			}	

			else searchParent(getPar(el), searchedParentClass, qsSelector);

		};

		function setVeganFilterListener(elSelector){
			WATO.elem(elSelector, function(productFilterList){
				if(productFilterList){
	
					productFilterList[0].addEventListener('click', function(event){
						let eventTarget = event.target;

						if(eventTarget.classList.value.indexOf('color-dark-gray h-text-normal') !== -1 || eventTarget.classList.value.indexOf('productFilterLabel') !== -1 || eventTarget.classList.value.indexOf('productFilterInput') !== -1){

							goalPush('kk_filter_vegan_set', true);
						}
					});
				}
			});
		}

		// set vegan filter goal / Desktop
		setVeganFilterListener('#toggle_filter_FFvegan .productFilterList > :first-child');

		// set vegan filter goal / Mobile
		setVeganFilterListener('#drop_pane_FFvegan ul.row > :first-child');

		// click vegan product goal (Search)(PLP)
		WATO.elem('.js_backstopWrapper .js-product-grid', function(productGrid){
			if(productGrid){
				productGrid[0].addEventListener('click', function(event){
					let eventTarget = event.target;

					searchParent(eventTarget, 'js-product-grid-item', '.productBadges img[src*="vegan"]');

				});
			}
		});

		// click vegan product goal (Reco Slider)
		WATO.elem('#kk_crossprods', function(productGrid){
			if(productGrid){
				productGrid[0].addEventListener('click', function(event){
					let eventTarget = event.target;

					searchParent(eventTarget, 'carousel-cell', '.kk_vegan');

				});
			}
		});

	}
	
})(window.WATO);