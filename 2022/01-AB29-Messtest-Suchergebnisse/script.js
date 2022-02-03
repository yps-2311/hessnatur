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

	function pushProductGroupGoal(target){
		let product = target.closest('.gridviewProductItemWrapper.column.js-product-grid-item');
		let goalGroup = product.getAttribute('data-goal-name');
		//console.log('goalGroup:', goalGroup);
		if(goalGroup){
			// if(navigator.userAgent.indexOf('Mobile') === -1 && navigator.userAgent.indexOf('Android') === -1) {  <- mobile ausschließen fällt raus
				goalPush('kk-click-product-' + goalGroup, true);
				console.log('kk-click-product-' + goalGroup + 'pushed');
			//}
		}
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

	// Filter mobile
	WATO.elem('#productFilterMobile', function(filter){
		if(filter){
			filter[0].addEventListener('mousedown', function(event){
				var target = event.target;

				// console.log('target ',target);
				// console.log('target id ',target.id);
				// console.log('currentTarget: ',event.currentTarget);

				if(target.id === 'tabSort-label' || target.parentElement.id === 'tabSort-label'){
					goalPush('kk-selection-sort-expand');
					//console.log('test sort click');
				} else if(target.id === 'tabView-label' || target.parentElement.id === 'tabView-label'){
					goalPush('kk-selection-display');
					//console.log('test view click');
				} else if(target.id === 'tabFilter-label' || target.parentElement.id === 'tabFilter-label'){
					goalPush('kk-filter-used');
					//console.log('test filter click');
				}
			});
		}
	});

	/* Filter Bereich */ 
	WATO.elem('.js-filter-form', function(filterForms) {
		if(filterForms) {
			// Desktop = filterForms[1] and  Mobile = filterForms[0]

			//Sortierung aufklappen (Desktop)
			qsWithGoalOnEventListener('#desktop__sort', filterForms[1], ['kk-selection-sort-expand']);

			// Auswahl der Ansicht (Desktop)
			qsWithGoalOnEventListener('#desktop__viewmode_model', filterForms[1], ['kk-selection-display'], true);
			qsWithGoalOnEventListener('#desktop__viewmode_article', filterForms[1], ['kk-selection-display'], true);

			// Nutzung der Filter (Desktop)
			qsaWithGoalOnEventListener('.filterVariations .column a', filterForms[1], ['kk-filter-used']);
		}
	});


	/* Klick auf Produkt */
	WATO.elem('.js-product-grid', function(productGrid){
		if(productGrid){

			// set data attributes for the groups
			WATO.qsa('.gridviewProductItemWrapper.column.js-product-grid-item', productGrid[0], function(products){
				if(products){

					let j = 0;
					for(let i = 0; i < 20; i++){
							//console.log('modulo: ',i%4);
							
							if(i % 4 === 0) {
								j++
							}

							if(products[i]){
								products[i].setAttribute("data-goal-name", "group-"+j);
								//console.log(products[i]);
							}

					}
				}
			});

			productGrid[0].addEventListener('click', function(event){	
				
				let target = event.target;
				// console.log('target = ',target);
				// console.log('currentTarget: ',event.currentTarget);

				if(target.classList.contains('productImage-1' || 'productImage-2')){
					// console.log('Product img clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product-img', true);
					goalPush('kk-click-product', true);
					//console.log(target);
					pushProductGroupGoal(target);

				} else if(target.classList.contains('js-add-to-wishlist')){
					// console.log('addToWishlist');
					goalPush('kk-click-remember-product', true);
					pushProductGroupGoal(target);
				} else if(target.classList.contains('h-shape-circle' || 'productItemColor')){
					// console.log('Color clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product', true);
					pushProductGroupGoal(target);
				} else if(target.parentElement.classList.contains('js-prgLink' || 'productPrgWrapper')){
					// console.log('prgLink clicked');
					// console.log('Producut clicked');
					goalPush('kk-click-product', true);
					pushProductGroupGoal(target);

					if(target.getAttribute('role') === 'menuitem') {
						// console.log('menuItem clicked');
						goalPush('kk-click-product-size', true);
					}
				} 
			
			});


			productGrid[0].addEventListener('mouseover', function(event){
				if(event.target.classList.contains('h-shape-circle' || 'productItemColor')){
					goalPush('kk-hover-color');
				}
			});
		}
	});


})(new window.WATO());
