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

	window.iridion.econda.push(["SprintPS03", "V1"]);

	WATO.ps03setSegment();
	WATO.ps03desktop();

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

    function ajax(url, callback) {
        var request = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, uri, async, user, pass) {

            this.addEventListener("loadend", function () {
                var _that = this;
                if (_that.readyState === 4) {
                    
                    if (uri.indexOf(url) !== -1) {

                        if (typeof callback === "function") {
                            callback(_that);
                        }
                    }
                }
            }, false);

            request.call(this, method, uri, async, user, pass);
        };
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
		var categoryAffinity = WATO.goProfile('categoryAffinity');

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


		// Weiterleitung je nach Affinität
		window.location.href = "https://www.hessnatur.com/de/"+categoryAffinity+"/"+secondKeyWord+"/kleidung/c/neu-"+categoryAffinity+"-"+secondKeyWord;
		

	}else if(UrlPathname.indexOf("/c/neu-") !== -1){
		// Kategorieseite NEU

		// DataNeu zeigt die Mengen der in NEU befindlichen Produkte pro Unterkategorie
		// Stand: 05.03.2021
		// TODO: zum Teststart können die Daten nocheinmal aktualisiert werden.
		// Beim Besuch einer Unterkategorie-Seite werden automatisch die aktuellen Mengen in diesen Datensatz gespeichert
		var dataNeu = {
			Damen: {
				Bekleidung: 145,
				Basics: 64,
				Loungewear: 31,
				Waesche: 103,
				Outdoor: 50,
				Accessoires: 45
			},
			Herren: {
				Bekleidung: 108,
				Waesche: 23,
				Outdoor: 43
			},
			Junior: {
				"Baby-Bekleidung": 65,
				"Kinder-Bekleidung": 36,
				"Kinder-Waesche": 6,
				"Baby-Waesche": 5
			},
			Home: {
				Schlafzimmer: 42,
				Wohnzimmer: 82,
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
				"Baby-Waesche": 'Erstlingspaket_Wollfrottee_aus_reiner_Bio_Merinowolle-46117_01_1'
			},
			Home: {
				Main: 'Renforc__Bettwaesche_Rondo_aus_reiner_Bio_Baumwolle-49038_60_1',
				Schlafzimmer: 'Satin_Bettwaesche_Leila_aus_reiner_Bio_Baumwolle-50658_21_1',
				Wohnzimmer: 'Wendeteppich_Follini_aus_reiner_Bio_Baumwolle-51269_41_7',
				Badezimmer: 'Frottee_Handtuch_aus_reiner_Bio_Baumwolle-47936_26_1',
				Kinderzimmer: 'Biber_Bettwaesche_aus_reiner_Bio_Baumwolle-50829_94_1'
			},
		},
		getDataFromProfile = WATO.goProfile('kategorieneu');

		// Sind Daten schon vorhanden?
		if(getDataFromProfile){
			// Daten aus dem Profile laden
			dataNeu = JSON.parse(getDataFromProfile);
		}else{
			// Datensatz ins Profile geschrieben
			WATO.goProfile('kategorieneu', dataNeu);
		}

		addClass(window.document.documentElement, 'kk_seiteneu');

		WATO.elem('.headerWrapper', function(underMenu){
			if(underMenu){

				underMenu = underMenu[0];

				var selectedSecondLevelCategory = "",
					sumDamen = getSum(dataNeu.Damen),
					sumHerren = getSum(dataNeu.Herren),
					sumJunior = getSum(dataNeu.Junior),
					sumHome = getSum(dataNeu.Home);

				try {
					var temp = window.location.pathname.replace("/de/","").split("/")[0].split("/")[0];
					selectedSecondLevelCategory = temp.substring(0, 1).toUpperCase() + temp.substring(1);
					selectedSecondLevelCategory = selectedSecondLevelCategory === "Baby" ? "Junior" : selectedSecondLevelCategory;
				} catch (error) {
					// console.log('Error: ', error);
				}

				var isSubMenu = WATO.qs("#mainNavPrgRedirectionForm ul ul ul .h-text-bold");

				if(isSubMenu){
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

					var selectedSubMenu = WATO.qsa("li:not(.secondLevel):not(.h-text-decoration-none)", isSubMenu.parentNode.parentNode),
						menu1 = WATO.qsa("#kk_neumenu a", underMenu.parentNode),
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

						subLabel.setAttribute('data-id', (i+1));

						subLabel.insertAdjacentHTML('afterbegin', 
							'<div class="kk_imgbox"><img src="'+imgPath + dataImg[selectedSecondLevelCategory][subCategoryNameText]+'.jpg"></div>'
						);

						subCategoryNameBox.insertAdjacentHTML('afterbegin', 
							'<div class="kk_bubble">'+dataNeu[selectedSecondLevelCategory][subCategoryNameText]+'</div>'
						);

						subLabel.addEventListener('click', function(e){
							var thisTarget = e.target.closest(".thirdLevel");

							goalPush("neu_menu2_"+thisTarget.getAttribute('data-id'), true);
							window.location.href = "https://www.hessnatur.com/de/c/"+WATO.qs("input.prgRedirData", thisTarget).getAttribute("value").replace("_nav","");
						});
						
						menu2.insertAdjacentElement('beforeend', subLabel);
					}

					menu2.insertAdjacentHTML('afterbegin', 
						'<li class="thirdLevel'+(isSomeSelected ? "" : " kk_selected")+'" role="menuitem"><div class="kk_imgbox"><img src="'+imgPath + dataImg[selectedSecondLevelCategory].Main+'.jpg"></div>'+
							'<label class="navNodeWrapper">'+
								'<span class="prgRedirLink h-text-decoration-none-hover"><div class="kk_bubble">'+currentProductCount+'</div>Alle Neuheiten aus dem Bereich '+selectedSecondLevelCategory+'</span>'+
							'</label>'+
						'</li>');
					
					WATO.qs('li:first-child', menu2).addEventListener('click', function(){
						goalPush("neu_menu2_alleprods", true);
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

									WATO.goProfile('kategorieneu', dataNeu);
								}
							}
						}
					});
				}
			}
		});


		WATO.elem('.searchTeaser--headline', function(searchTeaser){
			if(searchTeaser){
				if(searchTeaser[0].textContent.indexOf("keinen Treffer") !== -1){
					goalPush("neu_no_results");
				}
			}
		});


	}else{
		// Restliche Kategorieseiten
		
		var variation = WATO.goProfile('customerType') || "Interessent", // "Neukunde",
			headerText = {
				Interessent: ['<span>Neu</span> bei uns eingetroffen', 'Lassen Sie sich von unseren neuen Outfits inspirieren.'],
				Neukunde: ['<span>Neu</span> Seit Ihrem letzten Besuch'], //, 'Im Bereich<span class="kk_cattype"></span>:'
				Bestandskunde: ['Neuheiten passend zu Artikeln, die Sie häufig kaufen: <span class="kk_floatright">Neu</span>']
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

				ajax("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
                    try {
                        var data = JSON.parse(callbackData.response),
                            items = data.items;
                        
                        items.sort(compare);

                        WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
                            if(cbody){
                                cbody = cbody[0];

                                cbody.innerHTML = "";

                                var counter = 0;

                                try {
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
                                            item.productcategory !== items[j+3].productcategory&&
                                            subCatLink.indexOf("Reinigungsmittel") === -1){
        
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
                                            }else if(mainCatLink.indexOf("Home") !== -1){
                                                mainCatLink = 'home';
                                                subCatLink = "";
                                            }
                                            
        
                                            if(subCatText.indexOf(mainCatText) !== -1){
                                                subCatText = subCatText.replace(mainCatText+"-", "").replace(mainCatText, "");
                                            }
        
                                            cbody.insertAdjacentHTML('beforeend', 
                                                '<a data-id="'+(counter+1)+'" class="kk_cprod" href="https://www.hessnatur.com/de/c/neu-'+
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
        
                                            WATO.qs('.kk_cprod:last-child', cbody).addEventListener('click', function(e){
                                                var thisTarget = e.target.classList.contains('kk_cprod') ? e.target : e.target.closest(".kk_cprod");
                                                if(typeof thisTarget.getAttribute('data-id') !== "undefined"){
                                                    goalPush("cat_prod"+thisTarget.getAttribute('data-id'), true);
                                                }
                                            });
        
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
                                } catch (error) {
                                    // console.log('Error: ', error);
                                }
                            }
                        });
                    } catch (error) {
                        // console.log('Error: ', error);
                    }
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