/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
* @function
* @author Manuel Brueckmann
* @namespace
* @name Global Script for lookup customer type
* @description Prototype for requesting Econda ARP API for user profiles
*/

(function (WATO, window) {
	"use strict";

	var customerType = 'interessent',
		econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f',
		UrlHref = window.location.href;

	function setCustomerType(newType){
		sessionStorage.setItem('kk_targetGroup', newType);
		customerType = "bestandskunde";
	}

	function getCompareString(categoryString) {
		var temp = 0,
			splitString = categoryString.productcategory.split("^^");
		if(UrlHref.indexOf(splitString[0].toLowerCase()) !== -1){
			temp++;
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

	// placeholder for campaign stuff
	function doCampaignStuff(variation){
		console.log("triggered campagin visuals and content for: " + variation);

		var headerText = {
			interessent: ['Neu bei uns eingetroffen', 'Lassen Sie sich von unseren neuen Outfits inspirieren.'],
			neukunde: ['Neu Seit Ihrem letzten Besuch ', 'Im Bereich<span class="kk_cattype"></span>:'],
			bestandskunde: ['Neuheiten passend zu Artikeln die Sie häufig kaufen:']
		},
		econdaWidgetIDs = {
			interessent: 128,
			neukunde: 129,
			bestandskunde: 130
		},
		variationText = headerText[variation],
		position = '#productTilePrgRedirectionForm';

		if(variation === "interessent"){

			position = ".gridviewProductItemWrapper:nth-child(8) > div";

		}



		WATO.elem(function(){
			return typeof window.econda !== "undefined" && typeof window.econda.recengine !== "undefined";
		}, function(isLoadedEconda){
			if(isLoadedEconda){

				WATO.ajax("widgets.crosssell.info/eps/crosssell/recommendations", function(callbackData){
					var data = JSON.parse(callbackData.response),
						items = data.items;

					console.log('data: ', data);

					WATO.elem('#kk_crossprods .kk_cbody', function(cbody){
						if(cbody){
							cbody = cbody[0];
							
							items.sort(compare);

							for (var j = 0; j < (items.length <= 4 ? items.length : 4); j++) { // (items.length <= 4 ? items.length : 4)
								var item = items[j],
									category = item.productcategory.split("^^"),
									mainCat = category[0],
									subCat = category[1];

								if(mainCat.indexOf("Baby") !== -1 || mainCat.indexOf("Kinder") !== -1){
									if (mainCat.indexOf("Baby") !== -1 || subCat.indexOf("Baby") !== -1) {
										subCat = 'assortment%3ABaby';
									}
									mainCat = 'junior';

								}else if(mainCat.indexOf("Loungewear") !== -1 || mainCat.indexOf("Damen") !== -1
									 || mainCat.indexOf("Strümpfe") !== -1 || subCat.indexOf("BHs") !== -1
									 || mainCat.indexOf("umstandsmode") !== -1){
									mainCat = 'damen';

									if (subCat.indexOf(" ") !== -1) {
										subCat = subCat.split(" ")[1];
									}
								}else if(mainCat.indexOf("Herren") !== -1){
									mainCat = 'herren';
								}

								if(window.location.href.indexOf(mainCat.toLowerCase()) !== -1){
									console.log("mainCat passt");
								}
								if(window.location.href.indexOf(subCat.toLowerCase()) !== -1){
									console.log("subCat passt");
								}
								console.log("---------------");
								
								cbody.insertAdjacentHTML('beforeend', 
									'<a class="kk_cprod" href="https://www.hessnatur.com/de/c/neu-'+
											mainCat.toLowerCase()+
											'?q=%3Anull-desc%3Aproductgroup%3A'+
											subCat.replace("/","%252F")+
											'&viewMode=model">'+
										'<div class="kk_cimg">'+
											'<img src="'+item.iconurl+'">'+
										'</div>'+
										'<div class="kk_title">Neue '+category[0].replace("Home","").replace("Baby","").replace("Wäsche/Strümpfe","").replace("Strümpfe/Hausschuhe","")+' '+category[1]+'</div>'+ // <span>X</span>
										// '<div>Vor X Tagen aktualisiert</div>'+
									'</a>'
								);
								
							}
							


						}
					});

					



				});

				var widget = new window.econda.recengine.Widget({
					accountId: econdaAccountID,
					id: econdaWidgetIDs[variation]
				});
				widget.render();
			}
		});

		


		WATO.elem(position, function(wrapperOfAllProducts){
			if(wrapperOfAllProducts){
				wrapperOfAllProducts[0].parentNode.insertAdjacentHTML('beforebegin', 
					'<div id="kk_crossprods" >'+
						'<div class="kk_chead">'+
							'<h5>'+variationText[0]+'</h5>'+
							'<span data-type="'+variation+'">'+variationText[1]+'</span>'+
						'</div>'+
						'<div class="kk_cbody">'+
							// '<div class="kk_cprod">'+
							// 	'<div class="kk_cimg">'+
							// 		'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Jeans_Lina_Skinny_Fit_aus_Bio_Denim-49685_29_7.jpg">'+
							// 	'</div>'+
							// 	'<div class="kk_title">Neue Shirts <span>9</span></div>'+
							// 	'<div>Vor 2 Tagen aktualisiert</div>'+
							// '</div>'+
							// '<div class="kk_cprod">'+
							// 	'<div class="kk_cimg">'+
							// 		'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Jeans_Lina_Skinny_Fit_aus_Bio_Denim-49685_29_7.jpg">'+
							// 	'</div>'+
							// 	'<div class="kk_title">Neue Shirts <span>9</span></div>'+
							// 	'<div>Vor 2 Tagen aktualisiert</div>'+
							// '</div>'+
							// '<div class="kk_cprod">'+
							// 	'<div class="kk_cimg">'+
							// 		'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Jeans_Lina_Skinny_Fit_aus_Bio_Denim-49685_29_7.jpg">'+
							// 	'</div>'+
							// 	'<div class="kk_title">Neue Shirts <span>9</span></div>'+
							// 	'<div>Vor 2 Tagen aktualisiert</div>'+
							// '</div>'+
							// '<div class="kk_cprod">'+
							// 	'<div class="kk_cimg">'+
							// 		'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Jeans_Lina_Skinny_Fit_aus_Bio_Denim-49685_29_7.jpg">'+
							// 	'</div>'+
							// 	'<div class="kk_title">Neue Shirts <span>9</span></div>'+
							// 	'<div>Vor 2 Tagen aktualisiert</div>'+
							// '</div>'+
						'</div>'+
					'</div>'
				);

				if(variation === "neukunde"){
					WATO.elem('.opens-right > a.h-text-bold', function(categoryName){
						if(categoryName){
							WATO.qs(".kk_cattype").innerHTML = " "+categoryName[0].textContent;
						}
					});
				}


			}
		});
	}

	// placeholder for econda widget call and rendering to specific container
	function econdaWidget(widget){
		console.log("triggered econda widget: " + widget);
	}

	// init the campaign overall
	function initCampaign() {
		// eg. trigger widget
		econdaWidget(sessionStorage.getItem('kk_targetGroup') !== undefined ? sessionStorage.getItem('kk_targetGroup') : 'interessent');

		// eg. trigger content, visual changes depending on design
		// doCampaignStuff(sessionStorage.getItem('kk_targetGroup') !== undefined ? sessionStorage.getItem('kk_targetGroup') : 'interessent');
		doCampaignStuff(customerType);

	}

	if(window.location.pathname.indexOf("/c/neu-") !== -1){
		// Kategorieseite NEU

		document.documentElement.classList.add('kk_seiteneu');

		WATO.elem('.js_backstopWrapper', function(underMenu){
			if(underMenu){
				underMenu = underMenu[0];

				var selectedSecondLevelCategory = WATO.qs(".secondLevel .h-text-bold").textContent,
					selectedSubMenu = WATO.qsa("li:not(.secondLevel):not(.h-text-decoration-none)",WATO.qs("#mainNavPrgRedirectionForm ul ul ul .h-text-bold").parentNode.parentNode),
					outdoorlink = selectedSecondLevelCategory === "Herren" ? "herren" : "damen";

				underMenu.insertAdjacentHTML('afterbegin', 
					'<div id="kk_neuhead">'+
						'<div id="kk_neumenu">'+
							'<a href="/de/damen/bekleidung/c/neu-damen" '+(selectedSecondLevelCategory === "Damen" ? 'class="kk_bold"' : '')+'>Neu bei Damen</a>'+
							'<a href="/de/herren/bekleidung/c/neu-herren" '+(selectedSecondLevelCategory === "Herren" ? 'class="kk_bold"' : '')+'>Neu bei Herren</a>'+
							'<a href="/de/'+outdoorlink+'/bekleidung/outdoor/c/neu-'+outdoorlink+'-outdoor">Neu bei Outdoor</a>'+
							'<a href="/de/baby/bekleidung/c/neu-junior" '+(selectedSecondLevelCategory === "Junior" ? 'class="kk_bold"' : '')+'>Neu bei Junior</a>'+
							'<a href="/de/home/heimtextilien/c/neu-home" '+(selectedSecondLevelCategory === "Home" ? 'class="kk_bold"' : '')+'>Neu bei Home</a>'+
						'</div>'+
						'<ul id="kk_neumenu2">'+

						'</ul>'+

						// '<div id="kk_neuteaser">'+
						// 	'<div class="kk_neubox">'+
						// 		'<div class="kk_neuleft">'+
						// 			'<div class="kk_neuimg">'+
						// 				'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Ringelshirt_aus_reiner_Bio_Baumwolle-48246_54_1.jpg">'+
						// 			'</div>'+
						// 			'<div>'+
						// 				'<b>Neu bei Damen</b>'+
						// 				'<span>Zuletzt vor 2 Tagen aktualisiert</span>'+
						// 			'</div>'+
						// 		'</div>'+
						// 		'<div class="kk_neuright">'+
						// 			'<div>'+
						// 				damenSubMenu.outerHTML+
						// 			'</div>'+
						// 		'</div>'+
						// 	'</div>'+
						'</div>'+
					'</div>'
				);

				var menu2 = WATO.qs("#kk_neumenu2", underMenu);

				for (var i = 0; i < selectedSubMenu.length; i++) {
					var subLabel = selectedSubMenu[i].cloneNode(true),
						selectedSubSub = WATO.qs(".h-text-bold", subLabel);

					console.log('subLabel: ', subLabel);
					console.log('selectedSubSub: ', selectedSubSub);

					if(selectedSubSub){
						subLabel.classList.add('kk_selected');
					}
					subLabel.insertAdjacentHTML('afterbegin', 
						'<img src="https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_list_main/Ringelshirt_aus_reiner_Bio_Baumwolle-48246_54_1.jpg">'
					);
					
					menu2.insertAdjacentHTML('beforeend', 
						subLabel.outerHTML
					);
					
				}

				
			}
		});


	}else{
		// Restliche Kategorieseiten

		// get user classification, only once per session

		// already in session storage?
		if (!window.sessionStorage.getItem("kk_targetGroup")) {
			
			WATO.elem('#myAccountDropdown a', function(firstLinkInHeader){
				if(firstLinkInHeader){

					// 1. check if user is logged in > it's "neukunde" or "bestandskunde" then
					if(firstLinkInHeader[0].getAttribute('href') === "/de/login/pw/request"){
						// Loggedin

						// check if more than 1 order (ajax request to the my-account ajax content)
						WATO.xhr_get('https://www.hessnatur.com/de/my-account/orders', function(response){
							
							// amount of orders
							console.log('orders total: ', response.split("js_orderHistoryItem-").length); 
							
							if (response){

								// neukunde, only 0 or 1 order
								// TODO: what if js_orderHistoryItem is not available? Error then?
								if (response.split("js_orderHistoryItem-").length < 2) {
									
									// sessionStorage.setItem('kk_targetGroup', 'neukunde');
									setCustomerType("neukunde");

								// bestandskunde, more than 1 order
								}else {
									
									// sessionStorage.setItem('kk_targetGroup', 'bestandskunde');
									setCustomerType("bestandskunde");
								}

							}

							// init campaign (regardless if request was succesfull or not, fallback to 'interessent' then, next attempt will try again)
							initCampaign();

						});

					}else{

						// 2. if not, check if econda does know something about visitor
						// visitor is not logged in (which will be mainly the case)

						WATO.elem(function () {
							// check if econdas emos3 is available
							// due to this might take some time (async), wait for it

							console.log('window.emos3: ', window.emos3); // econda object
							console.log('window.emos3.emos_vid: ', window.emos3.emos_vid); // econda visitor id (shoud be always available, default)
							console.log('window.emos3.emos_cid: ', window.emos3.emos_cid); // econda customer id (only available if logged in and econda is not adblocked)

							return typeof window.emos3 !== "undefined" && (typeof window.emos3.emos_vid !== "undefined" || typeof window.emos3.emos_cid !== "undefined");

						}, function (emos_available) {
							
							if (emos_available) {

								// econda is available
								// ARP endpoint:	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid|emvid=
								//
								// Example queries:
								// Neukunden:		https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=de2c709c269261dbe7cf230465a205b1
								//					https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emvid=AXG7X26WccAN3yiAKoMG9Xw*UWd9pDAw
								// Bestandskunden:	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=c52d407f90b141afb905d6da8f228495			
								// Interessent: 	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emvid=AXTjATsJh0ydB8cRFsQD8PFCiJUTldmy

								// build arp endpoint url by available profile id and request data
								console.log('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid));
								
								WATO.xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid), function (response) {
								//WATO.xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=c52d407f90b141afb905d6da8f228495', function (response) {

									console.log('response: ', response);

									if (response){
										if (response.indexOf('Bestandskunde') !== -1){
											// bestandskunde (highest priority, even if Neukunde is also present in response)
											// sessionStorage.setItem('kk_targetGroup', 'bestandskunde');
											setCustomerType("bestandskunde");

										} else if (response.indexOf('Neukunde') !== -1 ) {
											// neukunde
											sessionStorage.setItem('kk_targetGroup', 'neukunde');
											setCustomerType("neukunde");
										}else {
											sessionStorage.setItem('kk_targetGroup', 'interessent');
											setCustomerType("interessent");
										}
									}
								
									// init campaign (regardless if result is available or not)
									initCampaign();

								});
							}
						});

					}
				}
			});
		
		} else {
			initCampaign();
		}
	}

})(new window.WATO(), window);
