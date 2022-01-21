/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "/vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";


	/* Hilfsfunktionen */

	function goalPush(key, nextPageSend){
		window.iridion.push(['goal', key, "", nextPageSend || false]);
	}

	function qsWithGoalOnEventListener(selector, parent, goals, nextPageSend) {
		WATO.qs( selector, parent ,function(element) {
			if(element) {
				element.addEventListener('click', function() {

					goals.forEach(function(goal) {
						goalPush(goal, nextPageSend || false);
					});					
				});
			}
		});
	}

	function qsaWithGoalOnEventListener(selector, parent, goals, nextPageSend) {
		WATO.qsa(selector, parent, function(elements) {
			if(elements) {
				elements.forEach(function(element) {
					element.addEventListener('click', function() {
						goals.forEach(function(goal) {
							goalPush(goal, nextPageSend || false);
						});
					});
				});	
			}
		});
	}


	/* Goals */

	/* Klick in Suchfeld */
	WATO.elem('#search_form_page', function(searchBar) {
		if(searchBar) {
			searchBar[0].addEventListener('click', function() {
				console.log('searchbar clicked');
				goalPush('kk-searchbar-clicked');
			});
		}
	});


	/* Filter Bereich */ 
	WATO.elem('.js-filter-form', function(filterForms) {
		if(filterForms) {
	
			// Desktop = filterForms[1] and  Mobile = filterForms[0]

			//Sortierung aufklappen (Desktop)
			qsWithGoalOnEventListener('#desktop__sort', filterForms[1], ['kk-selection-sort-expand']);

			// Auswahl der Ansicht (Desktop & Mobile)
			qsWithGoalOnEventListener('#desktop__viewmode_model', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#desktop__viewmode_article', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#mobile__viewmode_model', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#mobile__viewmode_article', filterForms[1], ['kk-selection-display'], true);

			// Nutzung der Filter (Desktop)
			qsaWithGoalOnEventListener('.filterVariations .column', filterForms[1], ['kk-filter-used']);

		}
	});


	
	/* Klick auf Produkt */

	WATO.elem('.gridviewProductItemWrapper', function(products) {
		if(products) {
			products.forEach(function(product) {

				// Klick auf Produktbild
				qsWithGoalOnEventListener('.productPrgWrapper.js-prgLink', product, ['kk-click-product-img', 'kk-click-product'], true);
				

				// Klick auf Produkt Text / Preis
				qsaWithGoalOnEventListener('.productItemColorContainer > div', product, ['kk-click-product'], true);

				// Farben
				WATO.qsa('.productItemColor img', product, function(productColors) {
					if(productColors) {
						productColors.forEach(function(color) {
							
							// Klick auf Farbe
							color.addEventListener('click', function() {
								console.log('product clicked');
								goalPush('kk-click-product', true);
							});

							// Hover über Produktfarben (Desktop)
							color.addEventListener('mouseenter', function() {
								console.log('product color hoverd');
								goalPush('kk-hover-color');
								
							});
							
						});	
					}
				});

				// Klick auf Produktgröße (Desktop)
				qsaWithGoalOnEventListener('.productItemSizes .h-text-decoration-none-hover', product, ['kk-click-product-size', 'kk-click-product'], true);


				// Klick auf Produkt merken
				qsWithGoalOnEventListener('.whishList', product, ['kk-click-remember-product'], true);


			});
		}
	});



})(new window.WATO());
