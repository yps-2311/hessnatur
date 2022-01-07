/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/*jshint loopfunc: true */
window.iridion = window.iridion || [];

/*
WATO.exclude(1023, function () {
	//WATO.setCookie('kk-exclude', 'true', '.hessnatur.com', true);
	console.log("reload");
	WATO.reload();
});
*/

//HTML Tag nach Variante..
(function(WATO){
	"use strict";

	if((/rv\:11\./).test(navigator.userAgent)){
        if(window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }
        if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
        HTMLCollection.prototype.forEach = Array.prototype.forEach;
        }
    }

	function pushGoal(key, value, sendOnNextPageView) {

		//console.log("push Goal", value);

		var props = ['goal', 'ps06_tweak_' + key];

		if(value){
			props.push(value);
		}
		if(sendOnNextPageView){
			props.push("");
			props.push(true);
		}

		window.iridion.push(props);
	}

	WATO.prototype.PS06_Tweak_Goals = function() {

		var WATO = this;

		WATO.elem("#ecRecommendationsContainer .flickity-slider", function (reco) {
			if (reco[0]) {
				reco[0].addEventListener('click', function(){
					pushGoal('click_original_slider', false, true);
				});
			}
		});
		
		var sendClickNavigation = false;

		// hover on navigation, desktop
		WATO.elem('#mainNavPrgRedirectionForm > ul > li:nth-child(7)', function(){

			var navElements=WATO.qsa('#mainNavPrgRedirectionForm > ul > li');

			if(navElements){

				for(var i = 0; i < navElements.length; i++){

					navElements[i].addEventListener('mouseenter', function(){
						

						window.setTimeout(function(){

							var activeNavElem = WATO.qs('#mainNavPrgRedirectionForm > ul > li.is-active');

							if(!sendClickNavigation && activeNavElem){

								sendClickNavigation = true;
								pushGoal('click_navigation');
							}
						}, 500);
					});
				}
			}
		});

		// click on navigation, mobile
		WATO.elem('#header .mobileNavigationContainer > li:nth-child(1) > a', function(mainNav){

			if(mainNav){

				for(var i = 0; i < mainNav.length; i++){

					mainNav[i].addEventListener('click', function(){

						pushGoal('click_navigation');
					});
				}
			}
		});

		WATO.elem("#search_form", function(searchForm){
			if(searchForm){
				searchForm[0].addEventListener("keydown",function(){
					pushGoal('search_form');
				})
			}
		});
	};

	WATO.prototype.PS06_Tweak_Categories = function(CATEGORY_AFFINITY) {

		var CATEGORIES = [
			["Shirts & Tops", "damen/desktop/shirts_tops.jpeg","damen/bekleidung/shirts-und-tops/c/damen-bekleidung-shirts-tops","damen/mobile/Shirts_Tops.png"],
			["Hosen", "damen/desktop/hosen.jpeg","de/damen/bekleidung/hosen/c/damen-bekleidung-hosen","damen/mobile/Hosen.png"],
			["Kleider", "damen/desktop/kleider.jpeg","damen/bekleidung/kleider/c/damen-bekleidung-kleider","damen/mobile/Kleider.png"],
			["Pullover", "damen/desktop/pullover.jpeg","damen/bekleidung/pullover/c/damen-bekleidung-pullover","damen/mobile/Pullover.png"],
			["Loungewear", "damen/desktop/loungewear.jpeg","damen/bekleidung/loungewear/c/damen-bekleidung-loungewear","damen/mobile/Loungewear.png"],
			["Outdoor", "damen/desktop/outdoor.jpeg","damen/bekleidung/outdoor/c/damen-bekleidung-outdoor","damen/mobile/Outwear.png"],
			["Jacken & Mäntel", "damen/desktop/jacken_maentel.jpeg","damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel","damen/mobile/Jacken_Mantel.png"]
		];

		if(CATEGORY_AFFINITY === "herren"){

			CATEGORIES = [
                ["Shirts", "herren/desktop/shirts.jpeg", "herren/bekleidung/shirts/c/herren-bekleidung-shirts", "herren/mobile/Shirts.png"],
                ["Jeans & Hosen", "herren/desktop/jeans_hosen.jpeg","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen", "herren/mobile/Jeans_Hosen.png"],
                ["Outdoor", "herren/desktop/outdoor.jpeg", "herren/bekleidung/outdoor/c/herren-bekleidung-outdoor", "herren/mobile/Outdoor.png"],//+
                ["Pullover & Strickjacken", "herren/desktop/pullover_strickjacken.jpeg", "herren/bekleidung/pullover-und-strickjacken/c/herren-bekleidung-pullover-strickjacken", "herren/mobile/Pullover.png"],
                ["Hemden", "herren/desktop/hemden.jpeg", "herren/bekleidung/hemden/c/herren-bekleidung-hemden", "herren/mobile/Hemden.png"]
            ];
		} else if(CATEGORY_AFFINITY === "baby"){

			CATEGORIES = [
                ["Shirts", "baby/desktop/shirts.jpeg","baby/bekleidung/shirts/c/junior-bekleidung-shirts","baby/mobile/Shirts.png"],
                ["Overalls", "baby/desktop/overalls.jpg","baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler","baby/mobile/Overall.png"],
                ["GOTS", "baby/desktop/gots.jpeg","baby/bekleidung/gots/c/lp-junior-gots","baby/mobile/GOTs.png"],
                ["Hosen", "baby/desktop/hosen.jpeg","baby/bekleidung/hosen/c/baby-bekleidung-hosen","baby/mobile/Hosen.png"],
                ["Jacken", "baby/desktop/jacken.jpeg","baby/bekleidung/jacken/c/baby-bekleidung-jacken","baby/mobile/Jacken.png"],
                ["Bodys", "baby/desktop/bodys.jpeg","baby/bekleidung/bodys/c/baby-bekleidung-bodys","baby/mobile/Bodys.png"],
                ["Kinderzimmer", "baby/desktop/kinderzimmer.jpeg","home/kinderzimmer/c/home-kinderzimmer","baby/mobile/Kinderzimmer.png"]
            ];
		} else if(CATEGORY_AFFINITY === "home"){

			CATEGORIES = [
                ["Bettwäsche", "home/desktop/bettwaesche2.jpg" /*bettwaesche.jpeg*/,"home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche","home/mobile/Bettwaesche2.jpg" /*Bettwaesche.png*/],
				["Wolldecken & Plaids", "home/desktop/wolldecken_plaids.jpeg","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids","home/mobile/Wolldecken.png"],
                ["Tischwäsche", "home/desktop/tischwaesche.jpeg","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche","home/mobile/Tischwaesche.png"],
                ["Handtücher", "home/desktop/handtuecher.jpeg","home/bad/badtextilien/c/home-bad-badtextilien","home/mobile/Handtuecher.png"],
                ["Bettlaken", "home/desktop/spannbetttuecher_laken2.jpg" /*"home/desktop/spannbetttuecher_laken.jpeg"*/,"home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken", "home/mobile/Spannbetttuecher2.jpg" /*"home/mobile/Spannbetttuecher.png"*/],
                ["Teppiche", "home/desktop/teppiche.jpeg","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche","home/mobile/Teppiche.png"],
				["Bademäntel", "home/desktop/bademaentel.jpeg","home/bad/bademaentel/c/home-bad-bademaentel","home/mobile/Bademaentel.png"]
            ];
		}

		return CATEGORIES;
	};

	WATO.prototype.PS06_Tweak = function(CATEGORY_AFFINITY, CATEGORIES, DATA, variation){

		if(!CATEGORY_AFFINITY || CATEGORY_AFFINITY === 1){
			CATEGORY_AFFINITY = "damen";
		}

		CATEGORY_AFFINITY = CATEGORY_AFFINITY.replace(/"/g, '');


		// var IMG_PATH = "https://media.hessnatur.com/kk/2021/ps06-startseite/";
		var DOMAIN = "https://www.hessnatur.com/de/";
		var WATO = this;

		var oldWidth = window.innerWidth || document.body.clientWidth;

		window.addEventListener('resize', function(){
			var newWidth= window.innerWidth || document.body.clientWidth;
			if(oldWidth >= 600 && newWidth < 600 || oldWidth < 600 && newWidth >= 600){
				WATO.reload();
			}
		});
	
		
		/*
		WATO.exclude(1023, function () {
			//WATO.setCookie('kk-exclude', 'true', '.hessnatur.com', true);
			console.log("reload");
			WATO.reload();
		});
		*/
	

		//sets count of items inside Popularity Slider
		// var MaxPopularityCounter = 6;
		//var MaxTendenciesCounter = 4;

		var userAlignment = CATEGORIES[0][1].split('/')[0];
		if(userAlignment === "baby"){
			userAlignment = "Kinder";
		}

		WATO.PS06_Tweak_Goals();

		function initFlickity(slide){
			var props = {
				cellAlign: 'left',
				contain: true,
				pageDots: false,
				groupCells: true
			};

			var myFlickity = new window.Flickity(slide, props);

			myFlickity.on('staticClick', function(event, pointer, cellElement, cellIndex){

				var type = cellElement.classList.contains('kk_productitem_tendency') ? 'product' : 'category';

				pushGoal('click_' + type + '_' + cellIndex, false, true);
				pushGoal('click_slider', false, true);
			});

		}
	
		function initKkHeadline(headlineId, headlineText, link, alignment){
			if(window.innerWidth < 600){
				return(
					'<div id="'+headlineId+'" class="lpmTeaser__headline column">'+
						'<p class="hn-headline hn-color-gray-800 kk_headline">'+headlineText+'</p>'+
					'</div>'
				);	
			} else if(window.innerWidth >= 600 && headlineId === "kk_popular_header"){
				return(
					'<div id="'+headlineId+'" class="lpmTeaser__headline --cell-padding">'+
						'<p class="hn-headline hn-color-gray-800 kk_headline">'+headlineText+'</p>'+
						'<div class="kk_furtherArticles kk_isDesktop kk_justify-content-end">'+
								'<a href='+link+'>'+
									'<span class="hn-button-link">Alle Artikel für '+alignment+'</span>'+
								'</a>'+
							'</div>'+
					'</div>'
				);	
				
			}
			 else{
				return(
					'<div id="'+headlineId+'" class="lpmTeaser__headline --cell-padding">'+
						'<p class="hn-headline hn-color-gray-800 kk_headline">'+headlineText+'</p>'+
					'</div>'
				);	
			}
			
		}
	
		function initKkSliderContainer(contentId){
			if(window.innerWidth < 600 && contentId === "kk_popularities_content"){
				return('<div id="'+contentId+'" class="kk_grid column">...Loading</div>');
			}else{
				return(
					'<div class="small-12 js-product-reference">'+
						'<div class="row js-productSliderWrapper h-LargeOffset-bottom-outer">'+ // h-xxLargeOffset-bottom-outer
							'<div class="small-12 h-no-padding-medium-down '+(window.innerWidth>600?"column":'')+'">'+
								'<div class="'+(window.innerWidth>600?"--cell-padding":'')+' kk_py-0">' +
									'<div class="flickity-productslider kk_slider" id="'+contentId+'">'+
										'...Loading'+
									'</div>'+
								'</div>' +
							'</div>'+
						'</div>'+
					'</div>'
				);
			}
		}
	
		function insertTendencies(items) {
			
			var result = '';
	
			for(var item in items){
				
			//var product = dataTendencies[category].response;
	
			if (/*product*/item /*&& product.availableAT && count < MaxTendenciesCounter*/) {
				

				var price = items[item].price/*.toFixed(2)*/;
				var prevPrice = items[item].price_prev;
				var link = items[item].deeplink/*permalink*/;
				var image = items[item].iconurl;
				var name = items[item].name;
				//var tendency = "Kundenfavorit";

				//var desc = link.split("/")[4].replaceAll('-','_');
				//var cardPara = image.split('/');
				//cardPara = cardPara[cardPara.length-1];
				//var imageUrl = 'https://imgs7.hessnatur.com/is/image/HessNatur/generalfeed_large/'+desc+'-'+cardPara+'.jpg';
	
				var isNormal =  "show";
				var isReduced =  "";
	
				if(!prevPrice){
					isReduced = "hide";
				}else{
					isNormal = "hide";
					prevPrice.toFixed(2);
					}
		
					/*
					var variants = ((variation === 2 && hasFavorite)? '<div class="kk_tendency-header kk_grid">'+
												'<div>'+
													tendency+
												'</div>'+
											'</div>':"");
					*/
		
					result = result.concat(
						'<div class="kk_productitem_tendency productitem text-center small-5 medium-5 large-3 columns" style="position: absolute; left: 0%;">'+
							//variants+
							'<a href=' + link + ' class="item__image"><img src=' + image/*Url*/ + '>'+
								'<div class="item__desc h-smallOffset-top-outer">'+
								/*
									'<div class="kk_badge kk_flex">' +
										mergedProducts + 
										'<span>&nbsp;&nbsp;</span>' +
									'</div>' +
									*/
									'<h4 class="item_desc desc-name">' + name + '</h4>' + 
									'<div class="desc-price kk_flex">' +
										'<span class="price ' + isReduced + ' special full ">'+prevPrice+' €</span>' +
										'<span class="' + isReduced + '">&nbsp;&nbsp;</span>' +
										'<span class="price hide" style="margin-left: 3px">ab </span>' +
										'<span class="price ' + isReduced + ' special">'+ price +'</span>' +
										'<span class="price light ' + isNormal + '">' + price + '</span>' +
										'<div class="product-basic-price basicPrice">' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</a>' +
						'</div>'
					);
				}
			}
			return result;
		}
		
		// function insertPopularities(element){
		// 	element.innerHTML = '';
				
		// 	if(window.innerWidth < 600){
		// 		for (var i in CATEGORIES){
		// 			if(MaxPopularityCounter && i < MaxPopularityCounter){
		// 				element.insertAdjacentHTML("beforeend",
		// 				'<div class="text-center small-4 medium-3 large-2 columns kk_l_0">' +
		// 					'<a href=' + DOMAIN + CATEGORIES[i][2] + ' class="item__image"><img placeholder="Artikel" src=' + IMG_PATH + CATEGORIES[i][3] + '>' +
		// 						'<div class="item__desc h-smallOffset-top-outer">' +
		// 							'<h4 class="kk_h4">' + CATEGORIES[i][0] + '</h4>' +
		// 						'</div>' +
		// 					'</a>' +
		// 				'</div>'
		// 				); 
		// 			}
					
		// 		}
		// 	}
		// 	else{
		// 		for (var j in CATEGORIES){
		// 			element.insertAdjacentHTML("beforeend",
		// 				'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">' +
		// 					'<a href=' + DOMAIN + CATEGORIES[j][2] + ' class="item__image"><img src=' + IMG_PATH + CATEGORIES[j][1] + '>' + 
		// 						'<div class="item__desc h-smallOffset-top-outer">' +
		// 							'<h4 class="kk_h4">' + CATEGORIES[j][0] + '</h4>'+
		// 						'</div>' +
		// 					'</a>' +
		// 				'</div>'
		// 			); 
		// 		}
		// 	}
		// }
	
		WATO.elem(".lpmHero", function (headline) {
	
			if (headline) {
				
				var ref = "";
				ref = ref.concat(DOMAIN, CATEGORY_AFFINITY,  "/c/", CATEGORY_AFFINITY);

				headline[0].insertAdjacentHTML("afterend",
					'<div class="lpmSeparator">&nbsp;</div>'+
					'<div id="kk_insertion">' +
						'<div class="lpmSeparator">&nbsp;</div>' +
						initKkHeadline("kk_Tendencies_header",(variation === 1 ? "NACHHALTIGE PRODUKTE FÜR SIE AUSGEWÄHLT" : userAlignment + ' Basics aus Bio-Baumwolle')) +
						initKkSliderContainer("kk_Tendencies_content") +
						// initKkHeadline("kk_popular_header","Beliebte Kategorien", ref, userAlignment) + // DL 03.12.21
						// '<div id="kk_chosen_user" class="kk_container">' + // DL 03.12.21
						// '</div>' + // DL 03.12.21
						// initKkSliderContainer("kk_popularities_content") + // DL 03.12.21
						'<div id="kk_chosen_user" class="kk_container">' +
							'<div class="kk_furtherArticles kk_isMobile kk_justify-content-center">' +
								'<a href=' + ref + '>' +
									'<span class="hn-button-link">Alle Artikel für ' + userAlignment + '</span>' + 
								'</a>' +
							'</div>' +
						'</div>' +
					'</div>'	
				);

				WATO.elem('.pusActionModule', function(pusActionModule){
					if(pusActionModule){
						
						// headline[0].insertAdjacentHTML('afterend', 
						// 	'<div class="lpmSeparator">&nbsp;</div>'
						// );

						var temp = pusActionModule[0].nextElementSibling;
						
						headline[0].insertAdjacentElement('afterend', pusActionModule[0]);
						headline[0].insertAdjacentElement('afterend', temp);
					}
				});
			}
		});


		// DL 03.12.21
		// WATO.elem('#kk_popularities_content',function(popularities){
		// 	if(popularities){

		// 		WATO.elem(function(){
		// 			return typeof window.Flickity !== "undefined";
		// 		}, function(){

		// 			popularities = popularities[0];

		// 			popularities.innerHTML = '';
		// 			popularities.style.opacity = "0";
		// 			insertPopularities(popularities);
					
		// 			WATO.elem(function(){
		// 				return 	WATO.qs('a > img', popularities).clientHeight > 0;
		// 			}, function(oneImgReady){
		// 				if(oneImgReady && window.innerWidth >= 600){
		// 					initFlickity(popularities);
		// 				} else{
		// 					//console.log('popularities.childNodes', popularities.childNodes);
		// 					popularities.childNodes.forEach(function(node,index){
		// 						node.addEventListener('click',function(){
		// 							//console.log(popularities.children[index],index,"chuldren");
		// 							pushGoal('click_category' + index, false, true);
		// 							pushGoal('click_slider', false, true);
		// 						})
		// 					})
		// 				}
		// 				popularities.style.opacity = "1";
		// 			});	
		// 		});
		// 	}
		// });

		var urlPathName = window.location.pathname.split('/');
		var econdaAccountID = '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-';
		var alreadyInitialized=false;

		// DL 03.12.21
		// var econdaId=96;
		// if(CATEGORY_AFFINITY === "herren")econdaId=93;
		// if(CATEGORY_AFFINITY === "baby")econdaId=94;
		// if(CATEGORY_AFFINITY === "home")econdaId=95;

		
		var econdaWidgetIds = {
				de: {
					accountID: 1,
					damen: 96,
					herren: 93,
					baby: 94,
					home: 95
				},
				ch: {
					accountID: 2,
					damen: 11,
					herren: 84,
					baby: 85,
					home: 86
				},
				at: {
					accountID: 3,
					damen: 88,
					herren: 80,
					baby: 81,
					home: 82
				}
			},
			econdaId = econdaWidgetIds[urlPathName[1]][CATEGORY_AFFINITY];

		econdaAccountID = econdaAccountID + econdaWidgetIds[urlPathName[1]].accountID;

		
		WATO.elem(function(){
			return (
				typeof window.econda !== "undefined" && 
				typeof window.econda.recengine !== "undefined" && 
				typeof window.econda.recengine.Widget !== "undefined"
			);
		},function(){

			WATO.ajaxCallback(`https://widgets.crosssell.info/eps/crosssell/recommendations/${econdaAccountID}.do?`, function (rawData) {

				if(alreadyInitialized){
					return;
				} else {
					alreadyInitialized=true
				}
	
				var data = JSON.parse(rawData.response),
				items=data.items;
			
				WATO.elem('#kk_Tendencies_content',function(slide){
					if(slide){
						slide=slide[0];

						slide.innerHTML = '';
						slide.style.opacity = "0";
						slide.insertAdjacentHTML("afterbegin", insertTendencies(items));
						
						WATO.elem(function(){
							return typeof window.Flickity !== "undefined" && WATO.qsa('a > img', slide)[items.length-1].clientHeight > 0;
						}, function(oneImgReady){

							if(oneImgReady){
								initFlickity(slide);
								slide.style.opacity = "1";
							}
						});
						
					}
				});
			});
	
			try{
				var widget = new window.econda.recengine.Widget({
					accountId: econdaAccountID,
					id: econdaId
				});
			
			widget.render();

			} catch (error) {
				console.log("error:",error);
			}
		});

		WATO.elem(".lpmSeparator", function(spaceing) {
			if(spaceing) {
				spaceing[1].style.display = "none";
			}
		});

		
	};
	
})(window.WATO);