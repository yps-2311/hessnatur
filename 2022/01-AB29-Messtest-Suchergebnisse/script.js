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
			// WATO.qs('#desktop__sort', filterForms[1] ,function(desktopSort) {
			// 	if(desktopSort) {

			// 		console.log(desktopSort);
			// 		desktopSort.addEventListener('click', function() {
			// 			console.log('desktopSort clicked');
			// 			goalPush('kk-selection-sort-expand');
			// 		});
			// 	}
			// });

			// Auswahl der Ansicht (Desktop & Mobile)

			qsWithGoalOnEventListener('#desktop__viewmode_model', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#desktop__viewmode_article', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#mobile__viewmode_model', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#mobile__viewmode_article', filterForms[1], ['kk-selection-display'], true);
			// addEventListenerToViewMode('#desktop__viewmode_model', filterForms[1]);
			// addEventListenerToViewMode('#desktop__viewmode_article', filterForms[1]);
			// addEventListenerToViewMode('#mobile__viewmode_model', filterForms[0]);
			// addEventListenerToViewMode('#mobile__viewmode_article', filterForms[0]);
		

			// Nutzung der Filter (Desktop)
			qsaWithGoalOnEventListener('.filterVariations .column', filterForms[1], ['kk-filter-used']);
			// WATO.qsa('.filterVariations .column', filterForms[1], function(filterColumns) {
			// 	if(filterColumns) {
			// 		filterColumns.forEach(function(column) {
			// 			column.addEventListener('click', function() {
			// 				console.log('filter used');
			// 				goalPush('kk-filter-used');
			// 			});
			// 		});	
			// 	}
			// });
				

		}
	});


	
	/* Klick auf Produkt */

	WATO.elem('.gridviewProductItemWrapper', function(products) {
		if(products) {
			products.forEach(function(product) {

				//console.log(product);

				// Klick auf Produktbild
				qsWithGoalOnEventListener('.productPrgWrapper.js-prgLink', product, ['kk-click-product-img', 'kk-product-clicked'], true);
				// WATO.qs('.productPrgWrapper.js-prgLink', product, function(productImg) {
				// 	if(productImg) {
				// 		productImg.addEventListener('click', function() {
				// 			console.log('product picture clicked');
				// 			goalPush('kk-click-product-img', true);
				// 			goalPush('kk-product-clicked', true);
				// 		});
				// 	}
				// });
				

				// Klick auf Produkt Text / Preis
				qsaWithGoalOnEventListener('.productItemColorContainer > div', product, ['kk-product-clicked'], true);
				// WATO.qsa('.productItemColorContainer > div', product, function(namesAndPrices) {
				// 	if(namesAndPrices) {

				// 		//console.log(namesAndPrices);
				// 		namesAndPrices.forEach(function(div) {
				// 			div.addEventListener('click', function() {
				// 				console.log('product clicked');
				// 				goalPush('kk-product-clicked', true);
				// 			});
				// 		});	
				// 	}
				// });

				// Farben
				//qsaWithGoalOnEventListener('.productItemColor img', product, 'click', ['kk-click-product-size', 'kk-product-clicked'], true);
				WATO.qsa('.productItemColor img', product, function(productColors) {
					if(productColors) {
						productColors.forEach(function(color) {
							
							// Klick auf Farbe
							color.addEventListener('click', function() {
								console.log('product clicked');
								goalPush('kk-product-clicked', true);
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
				qsaWithGoalOnEventListener('.productItemSizes .h-text-decoration-none-hover', product, ['kk-click-product-size', 'kk-product-clicked'], true);
				// WATO.qsa('.productItemSizes .h-text-decoration-none-hover', product, function(sizes) {
				// 	if(sizes) {
				// 		sizes.forEach(function(size) {
				// 			size.addEventListener('click', function() {
				// 				console.log('product size clicked');
				// 				goalPush('kk-click-product-size', true);
				// 				goalPush('kk-product-clicked', true);
				// 			});
				// 		});
				// 	}
				// });

				// Klick auf Produkt merken
				qsWithGoalOnEventListener('.whishList', product, ['kk-click-remember-product'], true);
				// WATO.qs('.whishList', product, function(addToWishList) {
				// 	if(addToWishList) {
				// 		//console.log(addToWishList);
				// 		addToWishList.addEventListener('click', function() {
				// 			console.log('product added to wishlist');
				// 			goalPush('kk-click-remember-product', true);
				// 		});
				// 	}
				// });

			});
		}
	});



})(new window.WATO());
