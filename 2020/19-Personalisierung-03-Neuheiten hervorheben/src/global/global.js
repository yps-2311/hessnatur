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

	WATO.exclude(1023, function(){
		WATO.setCookie('kkps03desk_exclude', 'true', ".hessnatur.com", false);
		WATO.reload();
	});

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

	function goalPush(key, sendOnNextPageView){
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}

	if(UrlPathname === "/de/NEU"){
		// LP Kategorieseite NEU

		goalPush("neu_overmenue", true);

		// Seite soll ausgeblendet werden
		addClass(window.document.documentElement, 'kk_hideneu');

		// Weiterleitung auf die Unterkategorie von NEU je nach Affinität des Benutzers, 
		// wenn keine Festgestellt wurde wird default "damen" ausgewählt
		var categoryAffinity = iridionProfile('categoryAffinity');
		console.log('categoryAffinity: ', categoryAffinity);

		// Damen und Männer wird bekleidung vorausgewählt
		var secondKeyWord = "bekleidung";

		if(categoryAffinity === "junior"){
			categoryAffinity = "baby";

		}else if(categoryAffinity === "home"){
			categoryAffinity = "home";
			secondKeyWord = "schlafzimmer";

		}else if(categoryAffinity !== "herren"){
			categoryAffinity = "damen";
		}

		console.log('categoryAffinity: ', categoryAffinity);
		console.log('secondKeyWord: ', secondKeyWord);

		// Weiterleitung je nach Affinität
		window.location.href = "https://www.hessnatur.com/de/"+categoryAffinity+"/"+secondKeyWord+"/kleidung/c/neu-"+categoryAffinity+"-"+secondKeyWord;
		

	}else if(UrlPathname.indexOf("/c/neu-") !== -1){
		// Kategorieseite NEU

		console.log("1 Zeitvergangen in ms: ", timestamp - new Date().getTime());

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
				Main: 'Jeans_Overall_aus_Bio_Baumwolle_mit_Leinen-50973_19_1',
				Bekleidung: 'Jeans_Lea_Slim_Fit_aus_Bio_Denim-51346_28_1',
				Basics: 'Shirt_aus_reiner_Bio_Baumwolle-51292_89_1',
				Waesche: 'Schlafhose_aus_reiner_Bio_Baumwolle-50949_29_1',
				Loungewear: 'Fleece_Sweatshirt_aus_reiner_Bio_Baumwolle-50713_04_1',
				Outdoor: '3_in_1_Jacke_Nature_Shell_aus_Bio_Baumwolle_mit_Bio_Merinowolle-51116_83_1',
				Accessoires: 'Jacquard_Schal_aus_reiner_Bio_Baumwolle-51237_33_1'
			},
			Herren: {
				Main: 'Langarmshirt_aus_reiner_Merinowolle-47772_26_1',
				Bekleidung: 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_42_1',
				Waesche: 'Joggpants_aus_reiner_Bio_Baumwolle-51167_82_1',
				Outdoor: 'Cargo_Hose_aus_Bio_Baumwolle_mit_Hanf-50747_16_1'
			},
			Junior: {
				Main: 'Fleece_Overall_aus_reiner_Bio_Baumwolle-39996_22_1',
				"Baby-Bekleidung": 'Shirt_aus_reiner_Bio_Baumwolle-49588_94_1',
				"Kinder-Bekleidung": 'Kapuzenshirt_aus_reiner_Bio_Baumwolle-50803_48_1',
				"Kinder-Waesche": 'Jungs_Pyjama_aus_reiner_Bio_Baumwolle-49901_94_1',
				"Baby-Waesche": 'Langarmbody_aus_Bio_Baumwolle_mit_Bio_Merinowolle-50825_02_7'
			},
			Home: {
				Main: 'Renforc__Bettwaesche_Rondo_aus_reiner_Bio_Baumwolle-49038_60_1',
				Schlafzimmer: 'Satin_Bettwaesche_Leila_aus_reiner_Bio_Baumwolle-50658_21_1',
				Wohnzimmer: 'Wendeteppich_Follini_aus_reiner_Bio_Baumwolle-51269_41_7',
				Badezimmer: 'Frottee_Handtuch_aus_reiner_Bio_Baumwolle-47936_26_1',
				Kinderzimmer: 'Biber_Bettwaesche_aus_reiner_Bio_Baumwolle-50829_94_1'
			},
		},
		getDataFromProfile = iridionProfile('kategorieneu');
		console.log('getDataFromProfile: ', getDataFromProfile);

		console.log("2 Zeitvergangen in ms: ", new Date().getTime() - timestamp);

		// Sind Daten schon vorhanden?
		if(getDataFromProfile){
			// Daten aus dem Profile laden
			dataNeu = JSON.parse(getDataFromProfile);
		}else{
			// Datensatz ins Profile geschrieben
			iridionProfile('kategorieneu', dataNeu);
		}

		addClass(window.document.documentElement, 'kk_seiteneu');

		console.log("3 Zeitvergangen in ms: ", new Date().getTime() - timestamp);

		WATO.elem('.headerWrapper', function(underMenu){
			if(underMenu){
				console.log('underMenu: ', underMenu);

				console.log("4 Zeitvergangen in ms: ", new Date().getTime() - timestamp);

				underMenu = underMenu[0];

				var selectedSecondLevelCategory = WATO.qs(".secondLevel .h-text-bold").textContent,
					selectedSubMenu = WATO.qsa("li:not(.secondLevel):not(.h-text-decoration-none)",WATO.qs("#mainNavPrgRedirectionForm ul ul ul .h-text-bold").parentNode.parentNode),
					sumDamen = getSum(dataNeu.Damen),
					sumHerren = getSum(dataNeu.Herren),
					sumJunior = getSum(dataNeu.Junior),
					sumHome = getSum(dataNeu.Home);

				// WATO.qs('[href="/de/NEU"]').insertAdjacentHTML('afterend', 
				// 	'<span class="kk_bubble">'+(sumDamen+sumHerren+sumJunior+sumHome)+'</span>'
				// );

				underMenu.insertAdjacentHTML('afterend', 
					'<div id="kk_neuhead">'+
						'<div id="kk_neumenu">'+
							'<a data-id="1" href="/de/damen/bekleidung/c/neu-damen" '+(selectedSecondLevelCategory === "Damen" ? 'class="kk_bold"' : '')+'>Neu bei Damen<span class="kk_bubble">'+sumDamen+'</span></a>'+
							'<a data-id="2" href="/de/herren/bekleidung/c/neu-herren" '+(selectedSecondLevelCategory === "Herren" ? 'class="kk_bold"' : '')+'>Neu bei Herren<span class="kk_bubble">'+sumHerren+'</span></a>'+
							'<a data-id="3" href="/de/baby/bekleidung/c/neu-junior" '+(selectedSecondLevelCategory === "Junior" ? 'class="kk_bold"' : '')+'>Neu bei Junior<span class="kk_bubble">'+sumJunior+'</span></a>'+
							'<a data-id="4" href="/de/home/heimtextilien/c/neu-home" '+(selectedSecondLevelCategory === "Home" ? 'class="kk_bold"' : '')+'>Neu bei Home<span class="kk_bubble">'+sumHome+'</span></a>'+
						'</div>'+
						'<ul id="kk_neumenu2">'+
						'</ul>'+
						'</div>'+
					'</div>'
				);

				console.log("5 Zeitvergangen in ms: ", new Date().getTime() - timestamp);

				var menu1 = WATO.qsa("#kk_neumenu a", underMenu.parentNode),
					menu2 = WATO.qs("#kk_neumenu2", underMenu.parentNode),
					currentProductCount = 0,
					isSomeSelected = false;

				for (var j = 0; j < menu1.length; j++) {
					menu1[j].addEventListener('click', function(e){
						goalPush("neu_menu1_"+e.target.getAttribute('data-id'), true);
					});
				}

				switch (selectedSecondLevelCategory) {
					case "Damen":
						currentProductCount = sumDamen;
						break;
					case "Herren":
						currentProductCount = sumHerren;
						break;
					case "Junior":
						currentProductCount = sumJunior;
						break;
					case "Home":
						currentProductCount = sumHome;
						break;
				}

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
						isSomeSelected = true;
					}

					subLabel.setAttribute('data-id', i);

					subLabel.insertAdjacentHTML('afterbegin', 
						'<div class="kk_imgbox"><img src="'+imgPath + dataImg[selectedSecondLevelCategory][subCategoryNameText]+'.jpg"></div>'
					);

					subCategoryNameBox.insertAdjacentHTML('afterbegin', 
						'<div class="kk_bubble">'+dataNeu[selectedSecondLevelCategory][subCategoryNameText]+'</div>'
					);

					subLabel.addEventListener('click', function(e){
						var thisTarget = e.target.closest(".thirdLevel");
						console.log('thisTarget: ', thisTarget);

						goalPush("neu_menu2_"+thisTarget.getAttribute('data-id'), true);
						window.location.href = "https://www.hessnatur.com/de/c/"+WATO.qs("input.prgRedirData", thisTarget).getAttribute("value").replace("_nav","");
					});
					
					menu2.insertAdjacentElement('beforeend', subLabel);
				}

				console.log("6 Zeitvergangen in ms: ", new Date().getTime() - timestamp);

				menu2.insertAdjacentHTML('afterbegin', 
					'<li class="thirdLevel'+(isSomeSelected ? "" : " kk_selected")+'" role="menuitem"><div class="kk_imgbox"><img src="'+imgPath + dataImg[selectedSecondLevelCategory].Main+'.jpg"></div>'+
						'<label class="navNodeWrapper">'+
							'<span class="prgRedirLink h-text-decoration-none-hover"><div class="kk_bubble">'+currentProductCount+'</div>Alle Neuheiten aus dem Bereich '+selectedSecondLevelCategory+'</span>'+
						'</label>'+
					'</li>');
				
				WATO.qs('li:first-child', menu2).addEventListener('click', function(){
					window.location.href = 'https://www.hessnatur.com/de/'+selectedSecondLevelCategory.toLowerCase()+'/bekleidung/c/neu-'+selectedSecondLevelCategory.toLowerCase();
				});

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
		
		var variation = iridionProfile('customerType') || "Interessent", // "Neukunde",
			headerText = {
				Interessent: ['Neu bei uns eingetroffen', 'Lassen Sie sich von unseren neuen Outfits inspirieren.'],
				Neukunde: ['Neu Seit Ihrem letzten Besuch ', 'Im Bereich<span class="kk_cattype"></span>:'],
				Bestandskunde: ['Neuheiten passend zu Artikeln, die Sie häufig kaufen:']
			},
			econdaWidgetIDs = {
				Interessent: 128,
				Neukunde: 129,
				Bestandskunde: 130
			},
			variationText = headerText[variation],
			position = '#productTilePrgRedirectionForm';

		if(variation === "Interessent"){
			position = ".js-product-grid > *:nth-child(8) > div"; // ".gridviewProductItemWrapper:nth-child(8) > div"
		}

		WATO.elem(function(){
			return typeof window.econda !== "undefined" && typeof window.econda.recengine !== "undefined";
		}, function(isLoadedEconda){
			if(isLoadedEconda){

				WATO.ajax("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
					var data = JSON.parse(callbackData.response),
						items = data.items;
					
					console.log('data: ', data);
					
					items.sort(compare);

					WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
						if(cbody){
							cbody = cbody[0];

							cbody.innerHTML = "";

							var counter = 0;

							for (var j = 0; j < items.length; j++) {
								var item = items[j],
									category = item.productcategory.split("^^"),
									mainCatLink = category[0],
									subCatLink = category[1],
									mainCatText = mainCatLink.replace("Home","").replace("Wäsche/Strümpfe","").replace("Strümpfe/Hausschuhe",""),
									subCatText = subCatLink.replace("Overall","Overalls");

								if(typeof items[j+1] !== "undefined" && 
									item.productcategory !== items[j+1].productcategory &&
									item.productcategory !== items[j+2].productcategory && 
									item.productcategory !== items[j+3].productcategory){

									if(mainCatLink.indexOf("Baby") !== -1 || mainCatLink.indexOf("Kinder") !== -1){

										if(subCatLink.indexOf("Baby Bettwäsche") !== -1){
											mainCatLink = "home";
											subCatLink = 'Baby%2520Bettw%25C3%25A4sche';
										}else if(subCatLink.indexOf("Baby-Bettwaren") !== -1){
											mainCatLink = "home";
											subCatLink = 'assortment%3ABaby';
										}else{
											if (mainCatLink.indexOf("Baby") !== -1 || subCatLink.indexOf("Baby") !== -1) {
												subCatLink = 'assortment%3ABaby';
											}
											mainCatLink = 'junior';
										}

									}else if(mainCatLink.indexOf("Loungewear") !== -1 || mainCatLink.indexOf("Damen") !== -1 ||
										mainCatLink.indexOf("Strümpfe") !== -1 || subCatLink.indexOf("BHs") !== -1 ||
										mainCatLink.indexOf("umstandsmode") !== -1){
											mainCatLink = 'damen';

											if (subCatLink.indexOf(" ") !== -1) {
												subCatLink = subCatLink.split(" ")[1];
											}
									}else if(mainCatLink.indexOf("Herren") !== -1){
										mainCatLink = 'herren';
									}

									if(subCatText.indexOf(mainCatText) !== -1){
										subCatText = subCatText.replace(mainCatText+"-", "").replace(mainCatText, "");
									}

									cbody.insertAdjacentHTML('beforeend', 
										'<a class="kk_cprod" href="https://www.hessnatur.com/de/c/neu-'+
												mainCatLink.toLowerCase()+
												'?q=%3Anull-desc%3Aproductgroup%3A'+
												subCatLink.replace("/","%252F")+
												'&viewMode=model">'+
											'<div class="kk_cimg">'+
												'<img src="'+item.iconurl.replace("large","small")+'">'+
											'</div>'+
											'<div class="kk_title">Neue '+
												mainCatText+
												' '+
												subCatText+
												'</div>'+ // <span>X</span>
										'</a>'
									);

									counter++;

									if(counter >= 4){
										break;
									}
								}
							}

							// Fix: Wenn Tests oder Ausspielungen wie der PS01 in die Produktliste Elemente einfügen
							// Kann es sein dass unser neuer Bereich nicht mehr an der korrekten Position steht.
							// Dieses wird hier behoben, indem es neu plaziert wird.
							if(WATO.qs(position).parentNode !== cbody.parentNode){
								WATO.qs(position).parentNode.insertAdjacentElement('beforebegin', cbody.parentNode);
							}
						}
					});
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

		WATO.elem(position, function(wrapperOfAllProducts){
			if(wrapperOfAllProducts){
				var wrapperOfAllProductsParent = wrapperOfAllProducts[0].parentNode;

				wrapperOfAllProductsParent.insertAdjacentHTML('beforebegin', 
					'<div id="kk_crossprods" >'+
						'<div class="kk_chead">'+
							'<h5>'+variationText[0]+'</h5>'+
							(variationText[1] ? '<span data-type="'+variation+'">'+variationText[1]+'</span>' : '')+
						'</div>'+
						'<div class="kk_cbody">'+
							'<div class="kk_cprod"><div class="kk-loader">' +
								'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
							'</div></div>'+
							'<div class="kk_cprod"><div class="kk-loader">' +
								'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
							'</div></div>'+
							'<div class="kk_cprod"><div class="kk-loader">' +
								'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
							'</div></div>'+
							'<div class="kk_cprod"><div class="kk-loader">' +
								'<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
							'</div></div>'+
						'</div>'+
					'</div>'
				);

				for (var k = 2; k < 8; k++) {
					var produkte = WATO.qs('.js-product-grid > .gridviewProductItemWrapper:nth-child('+k+')');
					produkte.setAttribute('data-id', (k-1));
					produkte.addEventListener('click', function(e){
						goalPush("cat_prod_first6");
						goalPush("cat_prod"+e.getAttribute('data-id'));
					});
				}
				

				// Fix: Wenn Tests oder Ausspielungen wie der PS01 in die Produktliste Elemente einfügen
				// Kann es sein dass unser neuer Bereich nicht mehr an der korrekten Position steht.
				// Dieses wird hier behoben, indem es neu plaziert wird.
				var crossprodsBody = WATO.qs('#kk_crossprods .kk_cbody');
				WATO.elem(function(){
					return wrapperOfAllProductsParent !== crossprodsBody.parentNode;
				}, function(element){
					if(element){
						wrapperOfAllProductsParent.insertAdjacentElement('beforebegin', crossprodsBody.parentNode);
					}
				});

				
			}
		});

		if(variation === "Neukunde" || variation === "neukunde"){
			WATO.elem('.opens-right > a.h-text-bold', function(categoryName){
				if(categoryName){
					WATO.elem('.kk_cattype', function(cattype){
						if(cattype){
							cattype[0].innerHTML = " "+categoryName[0].textContent;
						}
					});
				}
			});
		}

	}
})(new window.WATO(), window);