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
	
	


	// function trackProductGoals(){
	// 	const productGrid = WATO.qs('.js-product-grid');

	// 	//console.log('parent',productGrid);
	// 	WATO.qsa('.gridviewProductItemWrapper', productGrid, function(products) {
	// 		if(products) {

	// 			//console.log('products: ',products);

	// 			products.forEach(function(product) {
					
	// 				if(!product.classList.contains('listenerSet')){
	// 					// Klick auf Produktbild
	// 					qsWithGoalOnEventListener('.productPrgWrapper.js-prgLink', product, ['kk-click-product-img', 'kk-click-product'], true);
		
	// 					// Klick auf Produkt Text / Preis
	// 					qsaWithGoalOnEventListener('.productItemColorContainer > div', product, ['kk-click-product'], true);

	// 					// Farben
	// 					WATO.qsa('.productItemColor img', product, function(productColors) {
	// 						if(productColors) {
	// 							productColors.forEach(function(color) {
									
	// 								// Klick auf Farbe
	// 								color.addEventListener('click', function() {
	// 									console.log('product clicked');
	// 									goalPush('kk-click-product', true);
	// 								});
		
	// 								// Hover über Produktfarben (Desktop)
	// 								color.addEventListener('mouseenter', function() {
	// 									console.log('product color hoverd');
	// 									goalPush('kk-hover-color');
										
	// 								});
									
	// 							});	
	// 						}
	// 					});
		
	// 					// Klick auf Produktgröße (Desktop)
	// 					qsaWithGoalOnEventListener('.productItemSizes .h-text-decoration-none-hover', product, ['kk-click-product-size', 'kk-click-product'], true);
		
	// 					// Klick auf Produkt merken
	// 					qsWithGoalOnEventListener('.whishList', product, ['kk-click-remember-product'], true);

	// 					product.classList.add('listenerSet');
	// 				}
	// 			});
	// 		}
	// 	});
	// }


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
	WATO.elem('.js-product-grid', function(productGrid){
		if(productGrid){
			productGrid[0].addEventListener('click', function(event){			
				
				var target = event.target;

				//console.log('target = ',target);

				if(target.classList.contains('productImage-1' || 'productImage-2')){
					// console.log('Product img clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product-img', true);
					goalPush('kk-click-product', true);
				} else if(target.classList.contains('js-add-to-wishlist')){
					// console.log('addToWishlist');
					goalPush('kk-click-remember-product', true);
				} else if(target.classList.contains('h-shape-circle' || 'productItemColor')){
					// console.log('Color clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product', true);
				} else if(target.parentElement.classList.contains('js-prgLink' || 'productPrgWrapper')){
					// console.log('prgLink clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product', true);

					if(target.getAttribute('role') === 'menuitem') {
						// console.log('menuItem clicked');
						goalPush('kk-click-product-size', true);
					}
				} 
			
			});


			productGrid[0].addEventListener('mouseover', function(event){

				var target = event.target;
				//var currentTarget = event.currentTarget;

				// console.log('target = ',target);

				// if(target.getAttribute('role') === 'menuitem') {
				// 	console.log('menuItem hovered');
				// }
				//console.log('target classList: ',target.classList);
				// console.log('currentTarget: ', currentTarget);
				

				if(target.classList.contains('h-shape-circle' || 'productItemColor')){
					// console.log('Hover color Test!!!');
					goalPush('kk-hover-color');
				}
			});
		}
	});

	// WATO.ready(function(){
	// 	trackProductGoals();
	// });



	// WATO.elem('.button.js-more-results', function(moreResults){

	// 	//console.log('moreResults NodeList: ',moreResults);
	// 	if(moreResults){
	// 		moreResults[0].addEventListener('click', function(){
	// 			setTimeout(5000);
	// 			//console.log('more Results clicked  ', moreResults[0])
	// 			trackProductGoals();
	// 		});
	// 	}
	// });
	
	

	// WATO.elem('.gridviewProductItemWrapper', function(products) {
	// 	if(products) {
	// 		products.forEach(function(product) {

	// 			// Klick auf Produktbild
	// 			qsWithGoalOnEventListener('.productPrgWrapper.js-prgLink', product, ['kk-click-product-img', 'kk-click-product'], true);
				

	// 			// Klick auf Produkt Text / Preis
	// 			qsaWithGoalOnEventListener('.productItemColorContainer > div', product, ['kk-click-product'], true);

	// 			// Farben

				
	// 			WATO.qsa('.productItemColor img', product, function(productColors) {
	// 				if(productColors) {
	// 					productColors.forEach(function(color) {
							
	// 						// Klick auf Farbe
	// 						color.addEventListener('click', function() {
	// 							console.log('product clicked');
	// 							goalPush('kk-click-product', true);
	// 						});

	// 						// Hover über Produktfarben (Desktop)
	// 						color.addEventListener('mouseenter', function() {
	// 							console.log('product color hoverd');
	// 							goalPush('kk-hover-color');
								
	// 						});
							
	// 					});	
	// 				}
	// 			});

	// 			// Klick auf Produktgröße (Desktop)
	// 			qsaWithGoalOnEventListener('.productItemSizes .h-text-decoration-none-hover', product, ['kk-click-product-size', 'kk-click-product'], true);


	// 			// Klick auf Produkt merken
	// 			qsWithGoalOnEventListener('.whishList', product, ['kk-click-remember-product'], true);


	// 		});
	// 	}
	// });



})(new window.WATO());
