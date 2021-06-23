/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/*jshint loopfunc: true */
window.iridion = window.iridion || [];

(function(WATO){
	"use strict";

	WATO.prototype.PS06Category = function(CATEGORY_AFFINITY) {

		//Name,  img-link mobile, URL, img-link desktop
		var CATEGORIES = [
			["Hosen", "damen/min/hosen.png","de/damen/bekleidung/hosen/c/damen-bekleidung-hosen","damen/desktop/Hosen.png"],
			["Jacken & Mäntel", "damen/min/jacken_maentel.png","damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel","damen/desktop/Jacken_Mantel.png"],
			["Kleider", "damen/min/kleider.png","damen/bekleidung/kleider/c/damen-bekleidung-kleider","damen/desktop/Kleider.png"],
			["Loungewear", "damen/min/loungewear.png","damen/bekleidung/loungewear/c/damen-bekleidung-loungewear","damen/desktop/Loungewear.png"],
			["Outdoor", "damen/min/outdoor.png","damen/bekleidung/outdoor/c/damen-bekleidung-outdoor","damen/desktop/Outwear.png"],
			["Pullover", "damen/min/pullover.png","damen/bekleidung/pullover/c/damen-bekleidung-pullover","damen/desktop/Pullover.png"],
			["Shirts & Tops", "damen/min/shirts_tops.png","damen/bekleidung/shirts-und-tops/c/damen-bekleidung-shirts-tops","damen/desktop/Shirts_Tops.png"]
		];

		if(CATEGORY_AFFINITY === "herren"){

			CATEGORIES = [
                ["Hemden", "herren/min/hemden.png", "herren/bekleidung/hemden/c/herren-bekleidung-hemden", "herren/desktop/Hemden.png"],
                ["Jeans & Hosen", "herren/min/jeans_hosen.png","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen", "herren/desktop/Jeans_Hosen.png"],
                ["Outdoor", "herren/min/outdoor.png", "herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen", "herren/desktop/Outdoor.png"],
                ["Pullover & Strickjacken", "herren/min/pullover_strickjacken.png", "herren/bekleidung/pullover-und-strickjacken/c/herren-bekleidung-pullover-strickjacken", "herren/desktop/Pullover.png"],
                ["Shirts", "herren/min/shirts.png", "herren/bekleidung/shirts/c/herren-bekleidung-shirts", "herren/desktop/Shirts.png"]
            ];
		} else if(CATEGORY_AFFINITY === "baby"){

			CATEGORIES = [
                ["Bodys", "baby/min/bodys.png","baby/bekleidung/bodys/c/baby-bekleidung-bodys","baby/desktop/Bodys.png"],
                ["GOTS", "baby/min/gots.png","baby/bekleidung/gots/c/lp-junior-gots","baby/desktop/GOTs.png"],
                ["Hosen", "baby/min/hosen.png","baby/bekleidung/hosen/c/baby-bekleidung-hosen","baby/desktop/Hosen.png"],
                ["Jacken", "baby/min/jacken.png","baby/bekleidung/jacken/c/baby-bekleidung-jacken","baby/desktop/Jacken.png"],
                ["Kinderzimmer", "baby/min/kinderzimmer.png","home/kinderzimmer/c/home-kinderzimmer","baby/desktop/Kinderzimmer.png"],
                ["Overalls", "baby/min/overalls.png","baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler","baby/desktop/Overall.png"],
                ["Shirts", "baby/min/shirts.png","baby/bekleidung/shirts/c/junior-bekleidung-shirts","baby/desktop/Shirts.png"]
            ];
		} else if(CATEGORY_AFFINITY === "home"){

			CATEGORIES = [
                ["Bademäntel", "home/min/bademaentel.png","home/bad/bademaentel/c/home-bad-bademaentel","home/desktop/Bademaentel.png"],
                ["Bettwäsche", "home/min/bettwaesche.png","home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche","home/desktop/Bettwaesche.png"],
                ["Handtücher", "home/min/handtuecher.png","home/bad/badtextilien/c/home-bad-badtextilien","home/desktop/Handtuecher.png"],
                ["Spannbetttücher & Laken", "home/min/spannbetttuecher_laken.png","home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken","home/desktop/Spannbetttuecher.png"],
                ["Teppiche", "home/min/teppiche.png","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche","home/desktop/Teppiche.png"],
                ["Tischwäsche", "home/min/tischwaesche.png","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche","home/desktop/Tischwaesche.png"],
                ["Wolldecken & Plaids", "home/min/wolldecken_plaids.png","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids","home/desktop/Wolldecken.png"]
            ];
		}

		return CATEGORIES;
	};

	WATO.prototype.PS06 = function(CATEGORY_AFFINITY, CATEGORIES, DATA, variation){
		if(!CATEGORY_AFFINITY){
			CATEGORY_AFFINITY = "damen";
		}

		//console.log(CATEGORIES, CATEGORY_AFFINITY,"jojoo");

		var IMG_PATH = 'https://media.hessnatur.com/kk/2021/ps06-startseite/';
		var DOMAIN = 'https://www.hessnatur.com/de/';
		var WATO = this;

		//sets count of items inside Popularity Slider
		var MaxPopularityCounter=6;
		var MaxHighlightsCounter=4;

		var userAlignment=CATEGORIES[0][1].split('/')[0];
			if(userAlignment==="baby"){
				userAlignment="Kinder";
			}

		function pushGoal(key, value) {

			//console.log(">>> push goal", key, value);

			var props = ['goal', 'ps06_' + key];

			if(value){
				props.push(value);
			}

			window.iridion.push(props);
		}


		function initFlickity(slide){ // , height, selector
			var props={
				cellAlign: 'left',
				contain: true,
				pageDots: false,
				groupCells: true
			};

			var myFlickity = new window.Flickity(slide, props);

			myFlickity.on('staticClick', function(event, pointer, cellElement, cellIndex){

				var type = cellElement.classList.contains('kk_productitem_highlight') ? 'product' : 'category';

				pushGoal('ps06_click_' + type + '_' + cellIndex);
			});

		}
	
		function initKkHeadline(headlineId, headlineText){
			return(
				'<div id="'+headlineId+'" class="lpmTeaser__headline --cell-padding">'+
					'<p class="hn-headline hn-color-gray-800 hn-2xl large:hn-3xl">'+headlineText+'</p>'+
				'</div>'
			);
		}
	
		function initKkSliderContainer(contentId){
			if(window.innerWidth<600 && contentId==="kk_popularities_content"){
				return('<div id="'+contentId+'" class="kk_grid">...Loading</div>');
			}else{
				return(
					'<div class="small-12 columns js-product-reference">'+
						'<div class="small-12 columns ">'+
						   '<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
							   '<div class="column small-12 h-no-padding-medium-down">'+
									'<div class="flickity-productslider kk_slider" id="'+contentId+'">'+
										'...Loading'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
				);
			}
		}
	
		function insertHighlights(dataHighlights) {
			
			var result = '';
			var count=0;
	
			for(var category in dataHighlights){
				
			var product = dataHighlights[category].response;
	
			if (product && product.availableAT && count < MaxHighlightsCounter) {


				var price=product.price.toFixed(2);
				var prevPrice=product.price_prev;
				var link=product.permalink;
				var image=product.imageOnlyProduct;
				var name=product.name;
				var highlight="Kundenfavorit";

				var desc=link.split("/")[4].replaceAll('-','_');
				var cardPara=image.split('/');
				cardPara=cardPara[cardPara.length-1];
				var imageUrl='https://imgs7.hessnatur.com/is/image/HessNatur/generalfeed_large/'+desc+'-'+cardPara+'.jpg';
				//console.log('imageUrl', imageUrl);
	
				var isNormal= "show";
				var isReduced= "";
				var hasFavorite=false;
	
				if(!prevPrice){
					isReduced="hide";
				}else{
					isNormal="hide";
					prevPrice.toFixed(2);
					}
		
					var mergedProducts='';
					var badges=dataHighlights[category].badges;
					for(var index in badges){
						if(badges[index]!=="kundenfavorit"){
							mergedProducts+='<span class="kk_'+badges[index]+'">'+badges[index]+'</span><span>&nbsp;&nbsp;</span>';
						}
						else{
							hasFavorite=true;
						}
					}
					var variants=((variation===2&&hasFavorite)?'<div class="kk_highlight-header kk_grid">'+
												'<div>'+
													highlight+
												'</div>'+
											'</div>':"");
		
					result = result.concat(
						'<div class="kk_productitem_highlight productitem pro text-center small-5 medium-5 large-3 columns " style="position: absolute; left: 0%;">'+
							variants+
							'<a href='+link+' class="item__image"><img src='+imageUrl+'>'+
								'<div class="item__desc h-smallOffset-top-outer">'+
									'<div class="kk_badge kk_flex">'+
										mergedProducts+
									'</div>'+
									'<h4 class="item_desc desc-name">'+ name +'</h4>'+
									'<div class="desc-price kk_flex">'+
										'<span class="price '+isReduced+' special full ">'+prevPrice+' €</span>'+
										'<span class="'+isReduced+'">&nbsp;&nbsp;</span>'+
										'<span class="price hide" style="margin-left: 3px">ab </span>'+
										'<span class="price '+isReduced+' special">'+ price +' €</span>'+
										'<span class="price light '+isNormal+'">'+ price+ ' €</span>'+
										'<div class="product-basic-price basicPrice">'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</a>'+
						'</div>'
					);
					count++;
				}
			}
			return result;
		}
		
		function insertPopularities(element){
			element.innerHTML='';
				
			if(window.innerWidth<600){
				for (var i in CATEGORIES){
					if(MaxPopularityCounter && i<MaxPopularityCounter){
						element.insertAdjacentHTML("afterbegin",
						'<div class="text-center small-4 medium-3 large-2 columns">'+
							'<a href='+DOMAIN+CATEGORIES[i][2]+' class="item__image"><img placeholder="Artikel" src='+IMG_PATH+CATEGORIES[i][1]+'>'+
								'<div class="item__desc h-smallOffset-top-outer">'+
									'<h4 class="kk_h4">'+CATEGORIES[i][0]+'</h4>'+
								'</div>'+
							'</a>'+
						'</div>'
						); 
					}
					
				}
			}
			else{
				for (var j in CATEGORIES){
					element.insertAdjacentHTML("afterbegin",
						'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">'+
							'<a href='+DOMAIN+CATEGORIES[j][2]+' class="item__image"><img class="" src='+IMG_PATH+CATEGORIES[j][3]+'>'+
								'<div class="item__desc h-smallOffset-top-outer">'+
									'<h4 class="kk_h4">'+CATEGORIES[j][0]+'</h4>'+
								'</div>'+
							'</a>'+
						'</div>'
					); 
				}
			}
		}
		
		var response=0;
	
		WATO.elem(".lpmHero", function (headline) {
	
			if (headline) {

				headline[0].insertAdjacentHTML("afterend",
					'<div id="kk_insertion lpmTeaser --two grid --headline --align --fluffy">'+
						'<div class="lpmSeparator">&nbsp;</div>'+
						initKkHeadline("kk_highlights_header",(variation===1?"Aktuelle Highlights":userAlignment+' Basics aus Bio-Baumwolle'))+
						initKkSliderContainer("kk_highlights_content")+
						initKkHeadline("kk_popular_header","Beliebte Kategorien")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isDesktop kk_justify-content-end column">'+
								'<a href='+DOMAIN+CATEGORY_AFFINITY+'/c/'+CATEGORY_AFFINITY+'>'+
									'<span class="hn-button-link">Alle Artikel für '+userAlignment+'</span>'+
								'</a>'+
							'</div>'+
						'</div>'+
						initKkSliderContainer("kk_popularities_content")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isMobile kk_justify-content-center">'+
								'<a href='+DOMAIN+CATEGORY_AFFINITY+'/c/'+CATEGORY_AFFINITY+'>'+
									'<span class="hn-button-link">Alle Artikel für '+userAlignment+'</span>'+
								'</a>'+
							'</div>'+
						'</div>');
				}
			});
	

		for(var id in DATA ){
			WATO.xhr_get("https://products.hessnatur.com/products/"+id, function (rawData) {
				try {
					var sku=rawData.products[0].sku;
					DATA[sku].response=rawData.products[0];
					response++;
				} catch (error) {
					//console.log('Error: ', error);
					pushGoal('fetch_error', error.toString());
				}
			});
		}
		WATO.elem(function(){
			//console.log(response, Object.keys(DATA).length, "objectkeys");
			return response===Object.keys(DATA).length;
		},
		function(done){
			if(done){

				WATO.elem('#kk_popularities_content',function(popularities){
					if(popularities){

						WATO.elem(function(){
							return typeof window.Flickity !== "undefined";
						}, function(){

							popularities=popularities[0];

							popularities.innerHTML='';
							insertPopularities(popularities);
							
							WATO.elem(function(){
								return 	WATO.qs('a > img', popularities).clientHeight > 0;
							}, function(oneImgReady){
								if(oneImgReady&&window.innerWidth>=600){
									initFlickity(popularities);
									
								}
							});	
							
						});
					}
				});

				WATO.elem('#kk_highlights_content',function(slide){
					if(slide){
						slide=slide[0];

						//removing Text: ...Loading
						slide.innerHTML='';
						slide.insertAdjacentHTML("afterbegin", insertHighlights(DATA));
						
						WATO.elem(function(){
							return typeof window.Flickity !== "undefined" && WATO.qs('a > img', slide).clientHeight > 0;
						}, function(oneImgReady){
							
							// WATO.elem(function(){
							// 	return 	WATO.qs('a > img', slide).clientHeight > 0;
							// }, function(oneImgReady){
							if(oneImgReady){
								//console.log("rdy");
								initFlickity(slide,'.kk_productitem_highlight',"#kk_highlights_content .flickity-viewport");
								
							}
							// });
						});
						
					}
				});//second slide
				
			}//done
		});

		WATO.elem(".lpmSeparator", function(spaceing) {
			if(spaceing) {
				spaceing[1].style.display="none";
			}
		});
	};
	
})(window.WATO);

