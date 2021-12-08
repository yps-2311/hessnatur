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


		var IMG_PATH = "https://media.hessnatur.com/kk/2021/ps06-startseite/";
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
		var MaxPopularityCounter = 6;
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
						'<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
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
		
		function insertPopularities(element){
			element.innerHTML = '';
				
			if(window.innerWidth < 600){
				for (var i in CATEGORIES){
					if(MaxPopularityCounter && i < MaxPopularityCounter){
						element.insertAdjacentHTML("beforeend",
						'<div class="text-center small-4 medium-3 large-2 columns kk_l_0">' +
							'<a href=' + DOMAIN + CATEGORIES[i][2] + ' class="item__image"><img placeholder="Artikel" src=' + IMG_PATH + CATEGORIES[i][3] + '>' +
								'<div class="item__desc h-smallOffset-top-outer">' +
									'<h4 class="kk_h4">' + CATEGORIES[i][0] + '</h4>' +
								'</div>' +
							'</a>' +
						'</div>'
						); 
					}
					
				}
			}
			else{
				for (var j in CATEGORIES){
					element.insertAdjacentHTML("beforeend",
						'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">' +
							'<a href=' + DOMAIN + CATEGORIES[j][2] + ' class="item__image"><img src=' + IMG_PATH + CATEGORIES[j][1] + '>' + 
								'<div class="item__desc h-smallOffset-top-outer">' +
									'<h4 class="kk_h4">' + CATEGORIES[j][0] + '</h4>'+
								'</div>' +
							'</a>' +
						'</div>'
					); 
				}
			}
		}
	
		WATO.elem(".lpmHero", function (headline) {
	
			if (headline) {
				
				var ref = "";
				ref = ref.concat(DOMAIN, CATEGORY_AFFINITY,  "/c/", CATEGORY_AFFINITY);

				headline[0].insertAdjacentHTML("afterend",
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


// BKP
//!function(e,n){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,i,t,o,r){var a,s=this||o,d=r||Date.now();return Date.now()-d>1e4?(i(!1),!1):!0===("string"==typeof e?(a=n.querySelectorAll(e)).length>0:!!(a=e()||!1))?i(a):setTimeout(s.elem.bind(null,e,i,t,s,d),t||20)},e.WATO.prototype.qs=function(e,i,t,o){var r=(i||n).querySelector(e);return r?"function"==typeof t&&t(r):"function"==typeof o&&o(),r},e.WATO.prototype.qsa=function(e,i,t,o){var r=(i||n).querySelectorAll(e);return r?"function"==typeof t&&t(r):"function"==typeof o&&o(),r},e.WATO.prototype.ajaxCallback=function(e,n){var i=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(t,o,r,a,s){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==o.indexOf(e)&&"function"==typeof n&&n(this)}),!1),i.call(this,t,o,r,a,s)}},e.WATO.prototype.exclude=function(i,t){function o(){(e.innerWidth||n.body.clientWidth)<=i&&!r&&(r=!0,t())}console.log("exclude");var r=!1;o(),"function"==typeof t&&e.addEventListener("resize",(function(){o()}))},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_get=function(e,n,i){var t=new XMLHttpRequest;t.open("GET",e,!0),t.onload=function(){if(4===this.readyState&&this.status>=200&&this.status<400)try{var e=JSON.parse(this.response);n(e,i)}catch(e){n(!1)}else n(!1)},t.onerror=function(){n(!1)},t.send()}}(window,document),window.iridion=window.iridion||[],function(e){"use strict";function n(e,n,i){var t=["goal","ps06_tweak_"+e];n&&t.push(n),i&&(t.push(""),t.push(!0)),window.iridion.push(t)}/rv\:11\./.test(navigator.userAgent)&&(window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),window.HTMLCollection&&!HTMLCollection.prototype.forEach&&(HTMLCollection.prototype.forEach=Array.prototype.forEach)),e.prototype.PS06_Tweak_Goals=function(){var e=this;e.elem("#ecRecommendationsContainer .flickity-slider",(function(e){e[0]&&e[0].addEventListener("click",(function(){n("click_original_slider",!1,!0)}))}));var i=!1;e.elem("#mainNavPrgRedirectionForm > ul > li:nth-child(7)",(function(){var t=e.qsa("#mainNavPrgRedirectionForm > ul > li");if(t)for(var o=0;o<t.length;o++)t[o].addEventListener("mouseenter",(function(){window.setTimeout((function(){var t=e.qs("#mainNavPrgRedirectionForm > ul > li.is-active");!i&&t&&(i=!0,n("click_navigation"))}),500)}))})),e.elem("#header .mobileNavigationContainer > li:nth-child(1) > a",(function(e){if(e)for(var i=0;i<e.length;i++)e[i].addEventListener("click",(function(){n("click_navigation")}))})),e.elem("#search_form",(function(e){e&&e[0].addEventListener("keydown",(function(){n("search_form")}))}))},e.prototype.PS06_Tweak_Categories=function(e){var n=[["Shirts & Tops","damen/desktop/shirts_tops.jpeg","damen/bekleidung/shirts-und-tops/c/damen-bekleidung-shirts-tops","damen/mobile/Shirts_Tops.png"],["Hosen","damen/desktop/hosen.jpeg","de/damen/bekleidung/hosen/c/damen-bekleidung-hosen","damen/mobile/Hosen.png"],["Kleider","damen/desktop/kleider.jpeg","damen/bekleidung/kleider/c/damen-bekleidung-kleider","damen/mobile/Kleider.png"],["Pullover","damen/desktop/pullover.jpeg","damen/bekleidung/pullover/c/damen-bekleidung-pullover","damen/mobile/Pullover.png"],["Loungewear","damen/desktop/loungewear.jpeg","damen/bekleidung/loungewear/c/damen-bekleidung-loungewear","damen/mobile/Loungewear.png"],["Outdoor","damen/desktop/outdoor.jpeg","damen/bekleidung/outdoor/c/damen-bekleidung-outdoor","damen/mobile/Outwear.png"],["Jacken & Mäntel","damen/desktop/jacken_maentel.jpeg","damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel","damen/mobile/Jacken_Mantel.png"]];return"herren"===e?n=[["Shirts","herren/desktop/shirts.jpeg","herren/bekleidung/shirts/c/herren-bekleidung-shirts","herren/mobile/Shirts.png"],["Jeans & Hosen","herren/desktop/jeans_hosen.jpeg","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen","herren/mobile/Jeans_Hosen.png"],["Outdoor","herren/desktop/outdoor.jpeg","herren/bekleidung/outdoor/c/herren-bekleidung-outdoor","herren/mobile/Outdoor.png"],["Pullover & Strickjacken","herren/desktop/pullover_strickjacken.jpeg","herren/bekleidung/pullover-und-strickjacken/c/herren-bekleidung-pullover-strickjacken","herren/mobile/Pullover.png"],["Hemden","herren/desktop/hemden.jpeg","herren/bekleidung/hemden/c/herren-bekleidung-hemden","herren/mobile/Hemden.png"]]:"baby"===e?n=[["Shirts","baby/desktop/shirts.jpeg","baby/bekleidung/shirts/c/junior-bekleidung-shirts","baby/mobile/Shirts.png"],["Overalls","baby/desktop/overalls.jpg","baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler","baby/mobile/Overall.png"],["GOTS","baby/desktop/gots.jpeg","baby/bekleidung/gots/c/lp-junior-gots","baby/mobile/GOTs.png"],["Hosen","baby/desktop/hosen.jpeg","baby/bekleidung/hosen/c/baby-bekleidung-hosen","baby/mobile/Hosen.png"],["Jacken","baby/desktop/jacken.jpeg","baby/bekleidung/jacken/c/baby-bekleidung-jacken","baby/mobile/Jacken.png"],["Bodys","baby/desktop/bodys.jpeg","baby/bekleidung/bodys/c/baby-bekleidung-bodys","baby/mobile/Bodys.png"],["Kinderzimmer","baby/desktop/kinderzimmer.jpeg","home/kinderzimmer/c/home-kinderzimmer","baby/mobile/Kinderzimmer.png"]]:"home"===e&&(n=[["Bettwäsche","home/desktop/bettwaesche2.jpg","home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche","home/mobile/Bettwaesche2.jpg"],["Wolldecken & Plaids","home/desktop/wolldecken_plaids.jpeg","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids","home/mobile/Wolldecken.png"],["Tischwäsche","home/desktop/tischwaesche.jpeg","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche","home/mobile/Tischwaesche.png"],["Handtücher","home/desktop/handtuecher.jpeg","home/bad/badtextilien/c/home-bad-badtextilien","home/mobile/Handtuecher.png"],["Bettlaken","home/desktop/spannbetttuecher_laken2.jpg","home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken","home/mobile/Spannbetttuecher2.jpg"],["Teppiche","home/desktop/teppiche.jpeg","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche","home/mobile/Teppiche.png"],["Bademäntel","home/desktop/bademaentel.jpeg","home/bad/bademaentel/c/home-bad-bademaentel","home/mobile/Bademaentel.png"]]),n},e.prototype.PS06_Tweak=function(e,i,t,o){e&&1!==e||(e="damen"),e=e.replace(/"/g,"");var r="https://media.hessnatur.com/kk/2021/ps06-startseite/",a="https://www.hessnatur.com/de/",s=this,d=window.innerWidth||document.body.clientWidth;window.addEventListener("resize",(function(){var e=window.innerWidth||document.body.clientWidth;(d>=600&&e<600||d<600&&e>=600)&&s.reload()}));var l=i[0][1].split("/")[0];function c(e){new window.Flickity(e,{cellAlign:"left",contain:!0,pageDots:!1,groupCells:!0}).on("staticClick",(function(e,i,t,o){n("click_"+(t.classList.contains("kk_productitem_tendency")?"product":"category")+"_"+o,!1,!0),n("click_slider",!1,!0)}))}function p(e,n,i,t){return window.innerWidth<600?'<div id="'+e+'" class="lpmTeaser__headline column"><p class="hn-headline hn-color-gray-800 kk_headline">'+n+"</p></div>":window.innerWidth>=600&&"kk_popular_header"===e?'<div id="'+e+'" class="lpmTeaser__headline --cell-padding"><p class="hn-headline hn-color-gray-800 kk_headline">'+n+'</p><div class="kk_furtherArticles kk_isDesktop kk_justify-content-end"><a href='+i+'><span class="hn-button-link">Alle Artikel für '+t+"</span></a></div></div>":'<div id="'+e+'" class="lpmTeaser__headline --cell-padding"><p class="hn-headline hn-color-gray-800 kk_headline">'+n+"</p></div>"}function h(e){return window.innerWidth<600&&"kk_popularities_content"===e?'<div id="'+e+'" class="kk_grid column">...Loading</div>':'<div class="small-12 js-product-reference"><div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer"><div class="small-12 h-no-padding-medium-down '+(window.innerWidth>600?"column":"")+'"><div class="'+(window.innerWidth>600?"--cell-padding":"")+' kk_py-0"><div class="flickity-productslider kk_slider" id="'+e+'">...Loading</div></div></div></div></div>'}"baby"===l&&(l="Kinder"),s.PS06_Tweak_Goals(),s.elem(".lpmHero",(function(n){if(n){var i="";i=i.concat(a,e,"/c/",e),n[0].insertAdjacentHTML("afterend",'<div id="kk_insertion"><div class="lpmSeparator">&nbsp;</div>'+p("kk_Tendencies_header",1===o?"NACHHALTIGE PRODUKTE FÜR SIE AUSGEWÄHLT":l+" Basics aus Bio-Baumwolle")+h("kk_Tendencies_content")+p("kk_popular_header","Beliebte Kategorien",i,l)+'<div id="kk_chosen_user" class="kk_container"></div>'+h("kk_popularities_content")+'<div id="kk_chosen_user" class="kk_container"><div class="kk_furtherArticles kk_isMobile kk_justify-content-center"><a href='+i+'><span class="hn-button-link">Alle Artikel für '+l+"</span></a></div></div></div>")}})),s.elem("#kk_popularities_content",(function(e){e&&s.elem((function(){return void 0!==window.Flickity}),(function(){(e=e[0]).innerHTML="",e.style.opacity="0",function(e){if(e.innerHTML="",window.innerWidth<600)for(var n in i)n<6&&e.insertAdjacentHTML("beforeend",'<div class="text-center small-4 medium-3 large-2 columns kk_l_0"><a href='+a+i[n][2]+' class="item__image"><img placeholder="Artikel" src='+r+i[n][3]+'><div class="item__desc h-smallOffset-top-outer"><h4 class="kk_h4">'+i[n][0]+"</h4></div></a></div>");else for(var t in i)e.insertAdjacentHTML("beforeend",'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;"><a href='+a+i[t][2]+' class="item__image"><img src='+r+i[t][1]+'><div class="item__desc h-smallOffset-top-outer"><h4 class="kk_h4">'+i[t][0]+"</h4></div></a></div>")}(e),s.elem((function(){return s.qs("a > img",e).clientHeight>0}),(function(i){i&&window.innerWidth>=600?c(e):e.childNodes.forEach((function(e,i){e.addEventListener("click",(function(){n("click_category"+i,!1,!0),n("click_slider",!1,!0)}))})),e.style.opacity="1"}))}))}));var m="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1",u=96,k=!1;"herren"===e&&(u=93),"baby"===e&&(u=94),"home"===e&&(u=95),s.elem((function(){return void 0!==window.econda&&void 0!==window.econda.recengine&&void 0!==window.econda.recengine.Widget}),(function(){s.ajaxCallback(`https://widgets.crosssell.info/eps/crosssell/recommendations/${m}.do?`,(function(e){if(!k){k=!0;var n=JSON.parse(e.response).items;s.elem("#kk_Tendencies_content",(function(e){e&&((e=e[0]).innerHTML="",e.style.opacity="0",e.insertAdjacentHTML("afterbegin",function(e){var n="";for(var i in e)if(i){var t=e[i].price,o=e[i].price_prev,r=e[i].deeplink,a=e[i].iconurl,s=e[i].name,d="show",l="";o?(d="hide",o.toFixed(2)):l="hide",n=n.concat('<div class="kk_productitem_tendency productitem text-center small-5 medium-5 large-3 columns" style="position: absolute; left: 0%;"><a href='+r+' class="item__image"><img src='+a+'><div class="item__desc h-smallOffset-top-outer"><h4 class="item_desc desc-name">'+s+'</h4><div class="desc-price kk_flex"><span class="price '+l+' special full ">'+o+' €</span><span class="'+l+'">&nbsp;&nbsp;</span><span class="price hide" style="margin-left: 3px">ab </span><span class="price '+l+' special">'+t+'</span><span class="price light '+d+'">'+t+'</span><div class="product-basic-price basicPrice"></div></div></div></a></div>')}return n}(n)),s.elem((function(){return void 0!==window.Flickity&&s.qsa("a > img",e)[n.length-1].clientHeight>0}),(function(n){n&&(c(e),e.style.opacity="1")})))}))}}));try{new window.econda.recengine.Widget({accountId:m,id:u}).render()}catch(e){console.log("error:",e)}})),s.elem(".lpmSeparator",(function(e){e&&(e[1].style.display="none")}))}}(window.WATO);