/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
* @function
* @author Denis Leno
* @namespace
* @name
* @description
*/

(function (WATO, window) {
	"use strict";

	/*jshint loopfunc: true */

	var timestamp = new Date().getTime();
	console.log('timestamp: ', timestamp);

	var econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f',
		UrlHref = window.location.href,
		UrlPathname = window.location.pathname;

	function getCompareString(categoryString) {
		var temp = 0,
			splitString = categoryString.productcategory.split("^^");
		if(UrlHref.indexOf(splitString[0].toLowerCase()) !== -1){
			temp = 2;
		}
		if(UrlHref.indexOf(splitString[1].toLowerCase()) !== -1){
			temp++;
		}
		return temp;
	}

	function compare(a, b) {
		var tempA = getCompareString(a),
			tempB = getCompareString(b);
			
		if (tempA < tempB) {
			return 1;
		}
		if (tempA > tempB) {
			return -1;
		}
		return 0;
	}

	function addClass(elem, thisclassname) {
		if(elem){
			elem.classList.add(thisclassname);
		}
	}

	function iridionProfile(thisName, thisvalue) {
		if(thisvalue){
			window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
		}else{
			return window.iridion.push(['profile', 'getValue', thisName]);
		}
	}

	function getSum(category) {
		var sum = 0;
		for (var x in category) {
			sum += category[x];
		}
		return sum;
	}

	if(UrlPathname === "/de/NEU"){
		// LP Kategorieseite NEU

		// Seite soll ausgeblendet werden
		addClass(window.document.documentElement, 'kk_hideneu');

		// Weiterleitung auf die Unterkategorie von NEU je nach Affinität des Benutzers, 
		// wenn keine Festgestellt wurde wird default "damen" ausgewählt
		var categoryAffinity = iridionProfile('categoryAffinity') || "damen";
		if(categoryAffinity){
			// Damen und Männer wird bekleidung vorausgewählt
			var secondKeyWord = "bekleidung";

			if(categoryAffinity === "junior"){
				categoryAffinity = "baby";

			}else if(categoryAffinity === "home"){
				categoryAffinity = "baby";
				secondKeyWord = "schlafzimmer";
			}
			console.log('categoryAffinity: ', categoryAffinity);
			console.log('secondKeyWord: ', secondKeyWord);

			// Weiterleitung je nach Affinität
			window.location.href = "https://www.hessnatur.com/de/"+categoryAffinity+"/"+secondKeyWord+"/kleidung/c/neu-"+categoryAffinity+"-"+secondKeyWord;
		}

	}else if(UrlPathname.indexOf("/c/neu-") !== -1){
		// Kategorieseite NEU

		console.log("1 Zeitvergangen in Sekunden: ", timestamp - new Date().getTime());

		// DataNeu zeigt die Mengen der in NEU befindlichen Produkte pro Unterkategorie
		// Stand: 22.02.2021
		// TODO: zum Teststart können die Daten nocheinmal aktualisiert werden.
		// Beim Besuch einer Unterkategorie-Seite werden automatisch die aktuellen Mengen in diesen Datensatz gespeichert
		var dataNeu = {
			Damen: {
				Bekleidung: 206,
				Basics: 52,
				Loungewear: 31,
				Waesche: 103,
				Outdoor: 34,
				Accessoires: 38
			},
			Herren: {
				Bekleidung: 77,
				Waesche: 23,
				Outdoor: 30
			},
			Junior: {
				"Baby-Bekleidung": 61,
				"Kinder-Bekleidung": 36,
				"Kinder-Waesche": 6,
				"Baby-Waesche": 5
			},
			Home: {
				Schlafzimmer: 37,
				Wohnzimmer: 79,
				Badezimmer: 6,
				Kinderzimmer: 20
			},
		},
		imgPath = "https://imgs7.hessnatur.com/is/image/HessNatur/generalfeed_small/",
		dataImg = {
			// Bilder für die Boxen der Unterkategorien
			Damen: {
				Bekleidung: 'Jeans_Lea_Slim_Fit_aus_Bio_Denim-51346_28_1',
				Basics: 'Shirt_aus_reiner_Bio_Baumwolle-51292_89_1',
				Waesche: 'Schlafhose_aus_reiner_Bio_Baumwolle-50949_29_1',
				Loungewear: 'Fleece_Sweatshirt_aus_reiner_Bio_Baumwolle-50713_04_1',
				Outdoor: '3_in_1_Jacke_Nature_Shell_aus_Bio_Baumwolle_mit_Bio_Merinowolle-51116_83_1',
				Accessoires: 'Jacquard_Schal_aus_reiner_Bio_Baumwolle-51237_33_1'
			},
			Herren: {
				Bekleidung: 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_42_1',
				Waesche: 'Joggpants_aus_reiner_Bio_Baumwolle-51167_82_1',
				Outdoor: 'Cargo_Hose_aus_Bio_Baumwolle_mit_Hanf-50747_16_1'
			},
			Junior: {
				"Baby-Bekleidung": 'Shirt_aus_reiner_Bio_Baumwolle-49588_94_1',
				"Kinder-Bekleidung": 'Kapuzenshirt_aus_reiner_Bio_Baumwolle-50803_48_1',
				"Kinder-Waesche": 'Jungs_Pyjama_aus_reiner_Bio_Baumwolle-49901_94_1',
				"Baby-Waesche": 'Langarmbody_aus_Bio_Baumwolle_mit_Bio_Merinowolle-50825_02_7'
			},
			Home: {
				Schlafzimmer: 'Satin_Bettwaesche_Leila_aus_reiner_Bio_Baumwolle-50658_21_1',
				Wohnzimmer: 'Wendeteppich_Follini_aus_reiner_Bio_Baumwolle-51269_41_7',
				Badezimmer: 'Frottee_Handtuch_aus_reiner_Bio_Baumwolle-47936_26_1',
				Kinderzimmer: 'Biber_Bettwaesche_aus_reiner_Bio_Baumwolle-50829_94_1'
			},
		},
		getDataFromProfile = iridionProfile('kategorieneu');
		console.log('getDataFromProfile: ', getDataFromProfile);

		console.log("2 Zeitvergangen in Sekunden: ", new Date().getTime() - timestamp);

		// Sind Daten schon vorhanden?
		if(getDataFromProfile){
			dataNeu = JSON.parse(getDataFromProfile);
		}else{
			// Datensatz ins Profile geschrieben
			iridionProfile('kategorieneu', dataNeu);
		}

		addClass(window.document.documentElement, 'kk_seiteneu');

		console.log("3 Zeitvergangen in Sekunden: ", new Date().getTime() - timestamp);

		WATO.elem('.js_backstopWrapper', function(underMenu){
			if(underMenu){
				console.log('underMenu: ', underMenu);

				console.log("4 Zeitvergangen in Sekunden: ", new Date().getTime() - timestamp);

				underMenu = underMenu[0];

				var selectedSecondLevelCategory = WATO.qs(".secondLevel .h-text-bold").textContent,
					selectedSubMenu = WATO.qsa("li:not(.secondLevel):not(.h-text-decoration-none)",WATO.qs("#mainNavPrgRedirectionForm ul ul ul .h-text-bold").parentNode.parentNode),
					sumDamen = getSum(dataNeu.Damen),
					sumHerren = getSum(dataNeu.Herren),
					sumJunior = getSum(dataNeu.Junior),
					sumHome = getSum(dataNeu.Home);

				WATO.qs('[href="/de/NEU"]').insertAdjacentHTML('afterend', 
					'<span class="kk_bubble">'+(sumDamen+sumHerren+sumJunior+sumHome)+'</span>'
				);

				underMenu.insertAdjacentHTML('afterbegin', 
					'<div id="kk_neuhead">'+
						'<div id="kk_neumenu">'+
							'<a href="/de/damen/bekleidung/c/neu-damen" '+(selectedSecondLevelCategory === "Damen" ? 'class="kk_bold"' : '')+'>Neu bei Damen<span class="kk_bubble">'+sumDamen+'</span></a>'+
							'<a href="/de/herren/bekleidung/c/neu-herren" '+(selectedSecondLevelCategory === "Herren" ? 'class="kk_bold"' : '')+'>Neu bei Herren<span class="kk_bubble">'+sumHerren+'</span></a>'+
							'<a href="/de/baby/bekleidung/c/neu-junior" '+(selectedSecondLevelCategory === "Junior" ? 'class="kk_bold"' : '')+'>Neu bei Junior<span class="kk_bubble">'+sumJunior+'</span></a>'+
							'<a href="/de/home/heimtextilien/c/neu-home" '+(selectedSecondLevelCategory === "Home" ? 'class="kk_bold"' : '')+'>Neu bei Home<span class="kk_bubble">'+sumHome+'</span></a>'+
						'</div>'+
						'<ul id="kk_neumenu2">'+
						'</ul>'+
						'</div>'+
					'</div>'
				);


				console.log("5 Zeitvergangen in Sekunden: ", new Date().getTime() - timestamp);

				var menu2 = WATO.qs("#kk_neumenu2", underMenu);

				for (var i = 0; i < selectedSubMenu.length; i++) {
					var subLabel = selectedSubMenu[i].cloneNode(true),
						selectedSubSub = WATO.qs(".h-text-bold", subLabel),
						subCategoryNameBox = WATO.qs(".prgRedirLink", subLabel),
						subCategoryNameText = subCategoryNameBox.textContent.replace("ä","ae");

					if(selectedSubSub){
						addClass(subLabel, 'kk_selected');

						var seoText = WATO.qs("#kk-headline, .footerSmoBoxWrapper h1");
						
						WATO.qs("label", subLabel).insertAdjacentHTML('beforeend', 
							'<div>' + (seoText ? seoText.textContent : 'Trends der Kategorie '+subCategoryNameBox.textContent ) +'</div>'
						);
					}

					subLabel.insertAdjacentHTML('afterbegin', 
						'<div class="kk_imgbox"><img src="'+imgPath+dataImg[selectedSecondLevelCategory][subCategoryNameText]+'.jpg"></div>'
					);

					subCategoryNameBox.insertAdjacentHTML('beforeend', 
						'<div class="kk_bubble">'+dataNeu[selectedSecondLevelCategory][subCategoryNameText]+'</div>'
					);

					subLabel.addEventListener('click', function(e){
						window.location.href = "https://www.hessnatur.com/de/c/"+WATO.qs("input.prgRedirData", e.target.closest(".thirdLevel")).getAttribute("value").replace("_nav","");
					});
					
					menu2.insertAdjacentElement('beforeend', subLabel);
				}
				console.log("6 Zeitvergangen in Sekunden: ", new Date().getTime() - timestamp);


				WATO.elem('.breadcrumbs li:last-child[itemprop="itemListElement"] strong:last-child', function(lastBreadcrumbLi){
					if(lastBreadcrumbLi){
						var siteproductCounter = parseInt(lastBreadcrumbLi[0].textContent.split("(")[1].split("A")[0]),
							selectedSubCategory = WATO.qs(".sidebarNav--nav .h-text-bold"),
							selectedLabel = WATO.qs(".kk_selected .kk_bubble", menu2);
		
						// Keine Filter gesetzt und aktuelle Produktmenge stimmt nicht mit gespeicherter überein
						if(selectedSubCategory && !WATO.qs(".filterTags")){

							var selectedSubCategoryText = selectedSubCategory.textContent.replace("ä","ae");

							if(dataNeu[selectedSecondLevelCategory][selectedSubCategoryText] !== siteproductCounter){
								// Data werden neu geschrieben
								dataNeu[selectedSecondLevelCategory][selectedSubCategoryText] = siteproductCounter;

								// Ausgewähltes Label wird mit aktuellem Bestand überschrieben
								if(selectedLabel){
									selectedLabel.innerHTML = siteproductCounter;
								}

								iridionProfile('kategorieneu', dataNeu);
							}
						}
					}
				});
			}
		});


	}else{
		// Restliche Kategorieseiten
		
		var variation = iridionProfile('customerType') || "Interessent",
			headerText = {
				Interessent: ['Neu bei uns eingetroffen', 'Lassen Sie sich von unseren neuen Outfits inspirieren.'],
				Neukunde: ['Neu Seit Ihrem letzten Besuch ', 'Im Bereich<span class="kk_cattype"></span>:'],
				Bestandskunde: ['Neuheiten passend zu Artikeln die Sie häufig kaufen:']
			},
			econdaWidgetIDs = {
				Interessent: 128,
				Neukunde: 129,
				Bestandskunde: 130
			},
			variationText = headerText[variation],
			position = '#productTilePrgRedirectionForm'.parentNode;

		if(variation === "Interessent"){
			position = ".gridviewProductItemWrapper:nth-child(8) > div";
		}

		WATO.elem(function(){
			return typeof window.econda !== "undefined" && typeof window.econda.recengine !== "undefined";
		}, function(isLoadedEconda){
			if(isLoadedEconda){

				WATO.ajax("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
					var data = JSON.parse(callbackData.response),
						items = data.items;

					WATO.elem(position, function(wrapperOfAllProducts){
						if(wrapperOfAllProducts){
							wrapperOfAllProducts[0].parentNode.insertAdjacentHTML('beforebegin', 
								'<div id="kk_crossprods" >'+
									'<div class="kk_chead">'+
										'<h5>'+variationText[0]+'</h5>'+
										'<span data-type="'+variation+'">'+variationText[1]+'</span>'+
									'</div>'+
									'<div class="kk_cbody"></div>'+
								'</div>'
							);
			
							if(variation === "neukunde"){
								WATO.elem('.opens-right > a.h-text-bold', function(categoryName){
									if(categoryName){
										WATO.qs(".kk_cattype").innerHTML = " "+categoryName[0].textContent;
									}
								});
							}

							items.sort(compare);

							var counter = 0,
								cbody = WATO.qs('.kk_cbody');

							for (var j = 0; j < items.length; j++) {
								var item = items[j],
									category = item.productcategory.split("^^"),
									mainCat = category[0],
									subCat = category[1];

								if(typeof items[j+1] !== "undefined" && item.productcategory !== items[j+1].productcategory){

									if(mainCat.indexOf("Baby") !== -1 || mainCat.indexOf("Kinder") !== -1){

										if (mainCat.indexOf("Baby") !== -1 || subCat.indexOf("Baby") !== -1) {
											subCat = 'assortment%3ABaby';
										}
										mainCat = 'junior';

									}else if(mainCat.indexOf("Loungewear") !== -1 || mainCat.indexOf("Damen") !== -1 ||
										mainCat.indexOf("Strümpfe") !== -1 || subCat.indexOf("BHs") !== -1 ||
										mainCat.indexOf("umstandsmode") !== -1){
											mainCat = 'damen';

											if (subCat.indexOf(" ") !== -1) {
												subCat = subCat.split(" ")[1];
											}
									}else if(mainCat.indexOf("Herren") !== -1){
										mainCat = 'herren';
									}
									
									cbody.insertAdjacentHTML('beforeend', 
										'<a class="kk_cprod" href="https://www.hessnatur.com/de/c/neu-'+
												mainCat.toLowerCase()+
												'?q=%3Anull-desc%3Aproductgroup%3A'+
												subCat.replace("/","%252F")+
												'&viewMode=model">'+
											'<div class="kk_cimg">'+
												'<img src="'+item.iconurl.replace("large","small")+'">'+
											'</div>'+
											'<div class="kk_title">Neue '+category[0].replace("Home","").replace("Wäsche/Strümpfe","").replace("Strümpfe/Hausschuhe","")+' '+category[1].replace("Overall","Overalls")+'</div>'+ // <span>X</span>
										'</a>'
									);

									counter++;

									if(counter >= 4){
										break;
									}
								}
							}
						}
					});

					// WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
					// 	if(cbody){
					// 		cbody = cbody[0];
							
							
					// 	}
					// });
				});

				try {
					var widget = new window.econda.recengine.Widget({
						accountId: econdaAccountID,
						id: econdaWidgetIDs[variation]
					});
					widget.render();
				} catch (error) {
					// console.log('Error: ', error);
				}
			}
		});
	}
})(new window.WATO(), window);