/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */
window.iridion = window.iridion || [];

(function(WATO){
	"use strict";

	WATO.prototype.PS06Category = function(CATEGORY_AFFINITY) {

		var CATEGORIES = [
			["Hosen", "damen/min/hosen.png","de/damen/bekleidung/hosen/c/damen-bekleidung-hosen"],
			["Jacken & Mäntel", "damen/min/jacken_maentel.png","damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel"],
			["Kleider", "damen/min/kleider.png","damen/bekleidung/kleider/c/damen-bekleidung-kleider"],
			["Loungewear", "damen/min/loungewear.png","damen/bekleidung/loungewear/c/damen-bekleidung-loungewear"],
			["Outdoor", "damen/min/outdoor.png","damen/bekleidung/outdoor/c/damen-bekleidung-outdoor"],
			["Pullover", "damen/min/pullover.png","damen/bekleidung/pullover/c/damen-bekleidung-pullover"],
			["Shirts & Tops", "damen/min/shirts_tops.png","damen/bekleidung/shirts-und-tops/c/damen-bekleidung-shirts-tops"]
		];

		if(CATEGORY_AFFINITY === "herren"){

			CATEGORIES = [
                ["Hemden", "herren/min/hemden.png","herren/bekleidung/hemden/c/herren-bekleidung-hemden"],
                ["Jeans & Hosen", "herren/min/jeans_hosen.png","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen"],
                ["Outdoor", "herren/min/outdoor.png","herren/bekleidung/jeans-und-hosen/c/herren-bekleidung-jeans-hosen"],
                ["Pullover & Strickjacken", "herren/min/pullover_strickjacken.png","herren/bekleidung/pullover-und-strickjacken/c/herren-bekleidung-pullover-strickjacken"],
                ["Shirts", "herren/min/shirts.png","herren/bekleidung/shirts/c/herren-bekleidung-shirts"]
            ];
		} else if(CATEGORY_AFFINITY === "baby"){

			CATEGORIES = [
                ["Bodys", "baby/min/bodys.png","baby/bekleidung/bodys/c/baby-bekleidung-bodys"],
                ["GOTS", "baby/min/gots.png","baby/bekleidung/gots/c/lp-junior-gots"],
                ["Hosen", "baby/min/hosen.png","baby/bekleidung/hosen/c/baby-bekleidung-hosen"],
                ["Jacken", "baby/min/jacken.png","baby/bekleidung/jacken/c/baby-bekleidung-jacken"],
                ["Kinderzimmer", "baby/min/kinderzimmer.png","home/kinderzimmer/c/home-kinderzimmer"],
                ["Overalls", "baby/min/overalls.png","baby/bekleidung/overalls/c/baby-bekleidung-overalls-strampler"],
                ["Shirts", "baby/min/shirts.png","baby/bekleidung/shirts/c/junior-bekleidung-shirts"]
            ];
		} else if(CATEGORY_AFFINITY === "home"){

			CATEGORIES = [
                ["Bademäntel", "home/min/bademaentel.png","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche"],
                ["Bettwäsche", "home/min/bettwaesche.png","home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche"],
                ["Handtücher", "home/min/handtuecher.png","home/bad/badtextilien/c/home-bad-badtextilien"],
                ["Spannbetttücher & Laken", "home/min/spannbetttuecher_laken.png","home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken"],
                ["Teppiche", "home/min/teppiche.png","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche"],
                ["Tischwäsche", "home/min/tischwaesche.png","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche"],
                ["Wolldecken & Plaids", "home/min/wolldecken_plaids.png","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids"]
            ];
		}

		return CATEGORIES;
	};

	WATO.prototype.PS06 = function(CATEGORY_AFFINITY, CATEGORIES, DATA, variation){

		var IMG_PATH = 'https://media.hessnatur.com/kk/2021/ps06-startseite/';
		var DOMAIN = 'https://www.hessnatur.com/de/';
		var WATO = this;

		function pushGoal(key, value) {

			console.log(">>> push goal", key, value);

			var props = ['goal', 'ps06_' + key];

			if(value){
				props.push(value);
			}

			window.iridion.push(props);
		}
		
		function pushSegment(key) {
			
			console.log(">>> push segment", key);
			window.iridion.push(['segment', key]);
		}

		function initFlickity(slide){ // , height, selector
			var props={
				cellAlign: 'left',
				contain: true,
				pageDots: false,
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
			)
		}
	
		function initKkSliderContainer(contentId){
			if(window.innerWidth<600 && contentId=="kk_popularities_content"){
				return('<div id="'+contentId+'" class="kk_grid">...Loading</div>')
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
	
			for(var category in dataHighlights){
				
			var product = dataHighlights[category]['response'];
	
			if (product) {
				var price=product['price'].toFixed(2);
				var prevPrice=product['price_prev'];
				var link=product['permalink'];
				var image=product['imageOnlyProduct'];
				var name=product['name'];
				var highlight="Kundenfavorit";

				var desc=link.split("/")[4].replaceAll('-','_');
				var cardPara=image.split('/')
				cardPara=cardPara[cardPara.length-1];
				var imageUrl='https://imgs7.hessnatur.com/is/image/HessNatur/generalfeed_large/'+desc+'-'+cardPara+'.jpg';
	
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
					var badges=dataHighlights[category]['badges'];
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
				}
			}
			return result;
		}
		
		function insertPopularities(element){
			element.innerHTML='';
				
			if(window.innerWidth<600){
				for (var i in CATEGORIES){
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
			else{
				for (var j in CATEGORIES){
					element.insertAdjacentHTML("afterbegin",
						'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">'+
							'<a href='+DOMAIN+CATEGORIES[j][2]+' class="item__image"><img class="" src='+IMG_PATH+CATEGORIES[j][1]+'>'+
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
				var furtherArticlesValue=CATEGORIES[0][1].split('/')[0];
					if(furtherArticlesValue=="baby"){
						furtherArticlesValue="Kinder";
					}

				headline[0].insertAdjacentHTML("afterend",
					'<div id="kk_insertion lpmTeaser --two grid --headline --align --fluffy">'+
						'<div class="lpmSeparator">&nbsp;</div>'+
						initKkHeadline("kk_highlights_header",(variation===1?"Aktuelle Highlights":"Shirts & Tops aus Bio-Baumwolle"))+
						initKkSliderContainer("kk_highlights_content")+
						initKkHeadline("kk_popular_header","Beliebte Kategorien")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isDesktop kk_justify-content-end column">'+
								'<a href='+DOMAIN+CATEGORY_AFFINITY+'/c/'+CATEGORY_AFFINITY+'>'+
									'<span class="hn-button-link">Alle Artikel für '+furtherArticlesValue+'</span>'+
								'</a>'+
							'</div>'+
						'</div>'+
						initKkSliderContainer("kk_popularities_content")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isMobile kk_justify-content-center">'+
								'<a href='+DOMAIN+CATEGORY_AFFINITY+'/c/'+CATEGORY_AFFINITY+'>'+
									'<span class="hn-button-link">Alle Artikel für '+furtherArticlesValue+'</span>'+
								'</a>'+
							'</div>'+
						'</div>');
				}
			});
	

		for(var id in DATA ){
			WATO.xhr_get("https://products.hessnatur.com/products/"+id, function (rawData) {
				try {
					var sku=rawData['products'][0]['sku'];
					DATA[sku].response=rawData['products'][0];
					response++;
				} catch (error) {
					console.log('Error: ', error);
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

