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

	console.log("v8");

	WATO.prototype.PS06Category = function(CATEGORY_AFFINITY) {

		//Name,  img-link desktop, URL, img-link mobile
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
                ["Kinderzimmer", "baby/desktop/kinderzimmer.jpeg","home/kinderzimmer/c/home-kinderzimmer","baby/mobile/Kinderzimmer.png"],
            ];
		} else if(CATEGORY_AFFINITY === "home"){

			CATEGORIES = [
                ["Bettwäsche", "home/desktop/bettwaesche.jpeg","home/schlafzimmer/bettwaesche/c/home-schlafzimmer-bettwaesche","home/mobile/Bettwaesche.png"],
				["Wolldecken & Plaids", "home/desktop/wolldecken_plaids.jpeg","home/wohnzimmer-und-esszimmer/wohndecken-und-plaids/c/home-wohnzimmer-wohndecken-plaids","home/mobile/Wolldecken.png"],
                ["Tischwäsche", "home/desktop/tischwaesche.jpeg","home/wohnzimmer-und-esszimmer/tischwaesche/c/home-wohnzimmer-tischwaesche","home/mobile/Tischwaesche.png"],
                ["Handtücher", "home/desktop/handtuecher.jpeg","home/bad/badtextilien/c/home-bad-badtextilien","home/mobile/Handtuecher.png"],
                ["Bettlaken", "home/desktop/spannbetttuecher_laken.jpeg","home/schlafzimmer/spannbetttuecher-und-laken/c/home-schlafzimmer-spannbetttuecher-laken","home/mobile/Spannbetttuecher.png"],
                ["Teppiche", "home/desktop/teppiche.jpeg","home/wohnzimmer-und-esszimmer/teppiche/c/home-wohnzimmer-teppiche","home/mobile/Teppiche.png"],
				["Bademäntel", "home/desktop/bademaentel.jpeg","home/bad/bademaentel/c/home-bad-bademaentel","home/mobile/Bademaentel.png"]
            ];
		}

		return CATEGORIES;
	};

	WATO.prototype.PS06 = function(CATEGORY_AFFINITY, CATEGORIES, DATA, variation){
		if(!CATEGORY_AFFINITY || CATEGORY_AFFINITY===1){
			CATEGORY_AFFINITY = "damen";
		}

		console.log("#"+CATEGORY_AFFINITY+"#");
		CATEGORY_AFFINITY = CATEGORY_AFFINITY.replace(/"/g, '');
		console.log("#"+CATEGORY_AFFINITY+"#");

		//console.log("v8debug", "affinität="+CATEGORY_AFFINITY, "fertiger Link="+DOMAIN,CATEGORY_AFFINITY,"/c/",CATEGORY_AFFINITY);//v8debug affinität="damen" fertiger Link=undefined "damen" /c/ "damen"
		//console.log("#"+CATEGORY_AFFINITY+"#");//v8debug als concat affinität="damen" fertiger Link=undefined "damen"/c/"damen"
		//var hey=DOMAIN+CATEGORY_AFFINITY+"/c/"+CATEGORY_AFFINITY;
		//console.log("hey", hey);//hey undefined"damen"/c/"damen"

		//hhttp://ww.wasauchgimmer.de/damen/c/damen
		
		console.log('der String', CATEGORY_AFFINITY+"cool");

		var IMG_PATH = "https://media.hessnatur.com/kk/2021/ps06-startseite/";
		var DOMAIN = "https://www.hessnatur.com/de/";
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
			if(window.innerWidth<600){
				return(
					'<div id="'+headlineId+'" class="lpmTeaser__headline column">'+
						'<p class="hn-headline hn-color-gray-800 hn-2xl large:hn-3xl">'+headlineText+'</p>'+
					'</div>'
				);	
			} else{
				return(
					'<div id="'+headlineId+'" class="lpmTeaser__headline --cell-padding">'+
						'<p class="hn-headline hn-color-gray-800 hn-2xl large:hn-3xl">'+headlineText+'</p>'+
					'</div>'
				);	
			}
			
		}
	
		function initKkSliderContainer(contentId){
			if(window.innerWidth<600 && contentId==="kk_popularities_content"){
				return('<div id="'+contentId+'" class="kk_grid column">...Loading</div>');
			}else{
				return(
					'<div class="small-12 js-product-reference">'+
						'<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
							'<div class="small-12 h-no-padding-medium-down '+(window.innerWidth>600?"column":'')+'">'+
								'<div class="flickity-productslider kk_slider '+(window.innerWidth>600?"--cell-padding":'')+'" id="'+contentId+'">'+
									'...Loading'+
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
						'<div class="kk_productitem_highlight productitem text-center small-5 medium-5 large-3 columns" style="position: absolute; left: 0%;">'+
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
						element.insertAdjacentHTML("beforeend",
						'<div class="text-center small-4 medium-3 large-2 columns kk_l_0">'+
							'<a href='+DOMAIN+CATEGORIES[i][2]+' class="item__image"><img placeholder="Artikel" src='+IMG_PATH+CATEGORIES[i][3]+'>'+
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
					element.insertAdjacentHTML("beforeend",
						'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">'+
							'<a href='+DOMAIN+CATEGORIES[j][2]+' class="item__image"><img src='+IMG_PATH+CATEGORIES[j][1]+'>'+
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
				
				var ref="";
				ref=ref.concat(DOMAIN,CATEGORY_AFFINITY,"/c/",CATEGORY_AFFINITY);

				headline[0].insertAdjacentHTML("afterend",
					'<div id="kk_insertion lpmTeaser --two grid --headline --align --fluffy">'+
						'<div class="lpmSeparator">&nbsp;</div>'+
						initKkHeadline("kk_highlights_header",(variation===1?"Aktuelle Highlights":userAlignment+' Basics aus Bio-Baumwolle'))+
						initKkSliderContainer("kk_highlights_content")+
						initKkHeadline("kk_popular_header","Beliebte Kategorien")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isDesktop kk_justify-content-end">'+
								'<a href='+ref+'>'+
									'<span class="hn-button-link">Alle Artikel für '+userAlignment+'</span>'+
								'</a>'+
							'</div>'+
						'</div>'+
						initKkSliderContainer("kk_popularities_content")+
						'<div id="kk_chosen_user" class="kk_container">'+
							'<div class="kk_furtherArticles kk_isMobile kk_justify-content-center">'+
								'<a href='+ref+'>'+
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
					pushGoal('fetch_error', error.toString());
				}
			});
		}
		WATO.elem(function(){
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
							popularities.style.opacity="0";
							insertPopularities(popularities);
							
							WATO.elem(function(){
								return 	WATO.qs('a > img', popularities).clientHeight > 0;
							}, function(oneImgReady){
								if(oneImgReady&&window.innerWidth>=600){
									initFlickity(popularities);
									
									
								}
								popularities.style.opacity="1";
							});	
							
						});
					}
				});

				WATO.elem('#kk_highlights_content',function(slide){
					if(slide){
						slide=slide[0];

						slide.innerHTML='';
						slide.style.opacity="0";
						slide.insertAdjacentHTML("afterbegin", insertHighlights(DATA));
						
						WATO.elem(function(){
							return typeof window.Flickity !== "undefined" && WATO.qs('a > img', slide).clientHeight > 0;
						}, function(oneImgReady){

							if(oneImgReady){
								initFlickity(slide,'.kk_productitem_highlight',"#kk_highlights_content .flickity-viewport");
								slide.style.opacity="1";
							}
						});
						
					}
				});
			}//done
		});

		WATO.elem(".lpmSeparator", function(spaceing) {
			if(spaceing) {
				spaceing[1].style.display="none";
			}
		});
	};
	
})(window.WATO);

