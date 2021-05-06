// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

	/*jshint loopfunc: true */

	// window.iridion.econda.push(["SprintPS06", "V1"]);

	// function pushGoal(key, sendOnNextPageView){    
	// 	if(sendOnNextPageView){
	// 		window.iridion.push(['goal', key, '', true]);
	// 	}else{
	// 		window.iridion.push(['goal', key]);
	// 	}
	// }

	var htmlElement = document.documentElement;

	function addClass(elem, thisclassname) {
		if(elem){
			elem.classList.add(thisclassname);
		}
	}
	function removeClass(elem, thisclassname) {
		if(elem){
			elem.classList.remove(thisclassname);
		}
	}
	function removeInputClasses(deleteinput, searchResultList) {
		deleteinput.style.display = "none";
		removeClass(htmlElement, 'kk_settotop');
		removeClass(searchResultList, 'kk_showResults');
	}

	// Maximale Ausspielungsgröße 1024px
	if(window.innerWidth <= 1024){

		WATO.elem('#suggest_layer_off_canvas', function(searchResultList){
			if(searchResultList){
				searchResultList = searchResultList[0];
	
				var searchMask = WATO.qs('#offCanvasSearchWrapper', searchResultList.parentNode),
					searchInput = WATO.qs('.input-group-field', searchMask);
	
				console.log('searchMask: ', searchMask);
				if(searchMask){
					searchMask.insertAdjacentHTML('beforeend', 
						'<img class="kk_deleteinput" src="https://media.hessnatur.com/kk/2021/ab22-suche-mobile/deleteinput.svg">'
					);
				}
	
				var deleteinput = WATO.qs('.kk_deleteinput', searchMask);

				if(searchInput){
					// Placeholder des Inputfeldes
					searchInput.setAttribute('placeholder', 'Suchbegriff eingeben');

					// Eingabe ins Feld blendet ein X ein, dass zum löschen der Eingabe verwendet werden kann
					searchInput.addEventListener('keyup', function(e){
						if(e.target.value.length > 0){
							deleteinput.style.display = "block";
							// document.documentElement.classList.add('kk_settotop');
							addClass(htmlElement, 'kk_settotop');
							// searchResultList.classList.add('kk_showResults');
							addClass(searchResultList, 'kk_showResults');
						}else {
							// deleteinput.style.display = "none";
							// document.documentElement.classList.remove('kk_settotop');
							// searchResultList.classList.remove('kk_showResults');
							removeInputClasses(deleteinput, searchResultList);
						}
					});

					searchInput.addEventListener('focus', function(){
						document.documentElement.classList.add('kk_inputfocus');
					});
					searchInput.addEventListener('focusout', function(){
						document.documentElement.classList.remove('kk_inputfocus');
					});

					// Das besagte X zum löschen der Eingabe
					deleteinput.addEventListener('click', function(e){
						e.preventDefault();
						searchInput.value = "";
						removeInputClasses(deleteinput, searchResultList);
						// deleteinput.style.display = "none";
						// document.documentElement.classList.remove('kk_settotop');
						// searchResultList.classList.remove('kk_showResults');
					});
				}
				
				// Neues Suchicon einsetzen
				WATO.elem('.menu a[href="#search"]', function(searchIcon){
					if(searchIcon){
						searchIcon = searchIcon[0];
						searchIcon.insertAdjacentHTML('beforebegin', 
							'<a class="kk_search" href="#">'+
								'<img src="/_ui/responsive/common/images/icons/search.svg" alt="Suche" title="Suche">'+
							'</a>'
						);
						WATO.qs('.kk_search', searchIcon.parentNode).addEventListener('click', function(e){
							e.preventDefault();
							// Öffnet die Sucheingabe auf Tablet
							addClass(searchMask, 'kk_opensearch');
							searchInput.focus();
						});
					}
				});
				
				// Tablet: Suche schließen wenn man nicht direkt damit interagiert und irgendwo anders klickt
				window.document.documentElement.addEventListener('click', function(e){
					var thisTarget = e.target;
					if(!thisTarget.classList.contains('kk_search') && !thisTarget.parentNode.classList.contains('kk_search') && 
					!thisTarget.closest("#offCanvasSearchWrapper") && !thisTarget.closest("#suggest_layer_off_canvas")){
						removeClass(searchMask, 'kk_opensearch');
						searchInput.value = "";
						removeInputClasses(deleteinput, searchResultList);
						// searchMask.classList.remove('kk_opensearch');
						// deleteinput.style.display = "none";
						// document.documentElement.classList.remove('kk_settotop');
						// searchResultList.classList.remove('kk_showResults');
					}
				});
				
				// Sucheingabe und Suchergebnisse in den Header verschieben
				WATO.elem('#header > .column > .row', function(headerInner){
					if(headerInner){
						headerInner = headerInner[0];
						headerInner.insertAdjacentElement('afterbegin', searchResultList);
						headerInner.insertAdjacentElement('afterbegin', searchMask);
					}
				});
			}
		});
	}
})(new window.WATO(), window);