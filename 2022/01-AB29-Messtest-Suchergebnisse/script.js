/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "/vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	function goalPush(key, nextPageSend){
		window.iridion.push(['goal', key, "", nextPageSend || false]);
	}

		
	//console.log('messtest-suchergebnisse executed!');


	/* Goals */

	// Klick in Suchfeld
	WATO.elem('#search_form_page', function(searchBar) {
		if(searchBar) {
			searchBar[0].addEventListener('click', function() {
				console.log('searchbar clicked');
				goalPush('kk-searchbar-clicked');
			});
		}
	});

	// Auswahl Sortierung aufklappen (Desktop)
	WATO.elem('#desktop__sort', function(desktopSort) {
		if(desktopSort) {
			//console.log(desktopSort);
			desktopSort[0].addEventListener('click', function() {
				console.log('desktopSort clicked');
				goalPush('kk-selection-sort-expand');
			});
		}
	});

	
	// // Auswahl Ansicht
	WATO.elem('.changeArticleView li', function(articleView) {
		if(articleView) {
			// articleView[0].addEventListener('click', function() {
			// 	console.log('articleView clicked');
			// 	goalPush('kk-selection-display');
			// });

			articleView.forEach(function(li) {
				li.addEventListener('click', function() {
					console.log('view changed');
					goalPush('kk-selection-display', true);
				});
			});
		}
	});


	// Nutzung der Filter / Klick auf einen Filter (Desktop)
	WATO.elem('.filterVariations .column', function(filterColumns) {
		if(filterColumns) {

			filterColumns.forEach(function(column) {
				column.addEventListener('click', function() {
					console.log('filter used');
					goalPush('kk-filter-used');
				});
			});	
		}
	});



	
	/* Klick auf Produkt */

	
	// Klick auf Produkt merken  (Soll es auch getrackt werden, wenn man nicht eingeloggt ist?)
	// WATO.elem('.gridviewProductItemWrapper a.wishList.js-add-to-wishlist', function(wishList) {
	// 	if(wishList) {
	// 		wishList.forEach(function(addToWishList) {
	// 			addToWishList.addEventListener('click', function() {
	// 				console.log('product added to wishlist');
	// 				goalPush('kk-click-remember-product', true);
	// 			});
	// 		});	
	// 	}
	// });


	// Klick auf Produktbild
	WATO.elem('.gridviewProductItemWrapper .productPrgWrapper.js-prgLink', function(productPictures) {
		if(productPictures) {
			productPictures.forEach(function(picture) {
				picture.addEventListener('click', function() {
					console.log('product picture clicked');
					goalPush('kk-click-product-img', true);
					goalPush('kk-product-clicked', true);
				});
			});	
		}
	});
	
	

	// Hovern über die Produktfarben (Desktop)
	WATO.elem('.gridviewProductItemWrapper .productItemColor img', function(productColors) {
		if(productColors) {
			productColors.forEach(function(color) {
				color.addEventListener('mouseover', function() {
					console.log('product color hoverd');
					goalPush('kk-hover-color', true);

					// Klick auf Produktgröße (nach hovern einer Farbe) (Desktop)
					WATO.elem('.productItemSizes .h-text-decoration-none-hover', function(sizes) {
						if(sizes) {
							sizes.forEach(function(size) {
								size.addEventListener('click', function() {
									console.log('product size clicked');
									// kk-click-product-img muss für diesen Fall irgendwie geblockt werden (feuert derzeit auch)
									goalPush('kk-click-product-size', true);
									goalPush('kk-product-clicked', true);
								});
							});
						}
					});
				});
				
				color.addEventListener('click', function() {
					console.log('product clicked');
					goalPush('kk-product-clicked', true);
				});
			});	
		}
	});

	// Klick auf Produkt Text / Preis
	WATO.elem('.gridviewProductItemWrapper .productItemColorContainer div', function(namesAndPrices) {
		if(namesAndPrices) {
			namesAndPrices.forEach(function(div) {
				div.addEventListener('click', function() {
					console.log('product clicked');
					goalPush('kk-product-clicked', true);
				});
			});	
		}
	});
	
	
	



})(new window.WATO());
