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

	// window.iridion.econda.push(["SprintAB22", "V1"]);

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
	function pushSegment(key) {
		window.iridion.push(['segment', key]);
	}

	// Maximale Ausspielungsgröße 1023px
	if(window.innerWidth <= 1023){

		pushSegment('32879');

		WATO.ab22goals();

		WATO.elem('#suggest_layer_off_canvas', function(searchResultList){
			if(searchResultList){

				searchResultList = searchResultList[0];
	
				var searchMask = WATO.qs('#offCanvasSearchWrapper', searchResultList.parentNode),
					searchInput = WATO.qs('.input-group-field', searchMask);
	
				// console.log('searchMask: ', searchMask);
				if(searchMask){
					searchMask.insertAdjacentHTML('beforeend', 
						'<img class="kk_deleteinput" src="https://media.hessnatur.com/kk/2021/ab22-suche-mobile/deleteinput.svg">'
					);

					// Wenn Suchbutton zum X wird kann es das Suchfeld schließen
					WATO.qs('.input-group-button', searchMask).addEventListener('click', function(e){
						if(!htmlElement.classList.contains('kk_settotop')){
							e.preventDefault();
							removeClass(searchMask, 'kk_opensearch');
						}
					});
				}
	
				var deleteinput = WATO.qs('.kk_deleteinput', searchMask);

				if(searchInput){
					// Placeholder des Inputfeldes
					searchInput.setAttribute('placeholder', 'Suchbegriff eingeben');

					// Eingabe ins Feld blendet ein X ein, dass zum löschen der Eingabe verwendet werden kann
					searchInput.addEventListener('keyup', function(e){
						if(e.target.value.length > 0){
							deleteinput.style.display = "block";
							addClass(htmlElement, 'kk_settotop');
							addClass(searchResultList, 'kk_showResults');
						}else {
							removeInputClasses(deleteinput, searchResultList);
						}
					});

					
					var focusOnSearchInput = false,
						innerHeight = window.innerHeight;

					searchInput.addEventListener('focus', function(){
						focusOnSearchInput = true;
						document.documentElement.classList.add('kk_inputfocus');
					});
					searchInput.addEventListener('focusout', function(){
						focusOnSearchInput = false;
						document.documentElement.classList.remove('kk_inputfocus');
					});

					window.addEventListener("resize", () => {
						if(focusOnSearchInput && innerHeight === window.innerHeight){
							document.documentElement.classList.remove('kk_inputfocus');
						}
					});

					// Das besagte X zum löschen der Eingabe
					deleteinput.addEventListener('click', function(e){
						e.preventDefault();

						searchInput.value = "";
						removeInputClasses(deleteinput, searchResultList);
						window.iridion.push(['goal', 'kk_ab22_del_inputfield']);
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
	} else {

		pushSegment('32880');
	}

	window.addEventListener("orientationchange", function() {
		pushSegment('32881');
		WATO.reload();
	}, false);
})(new window.WATO(), window);