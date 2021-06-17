/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

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
				pageDots: false
			};

			return new window.Flickity(slide,props);
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
					console.log('headerz', hasFavorite);
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
			console.log('Elementinnerpops', element);
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
			console.log(response, Object.keys(DATA).length, "objectkeys");
			return response===Object.keys(DATA).length;
		},
		function(done){
			if(done){

				WATO.elem('#kk_popularities_content',function(element){
					if(element){

						WATO.elem(function(){
							return typeof window.Flickity !== "undefined";
						}, function(){

							var popularities=element[0];

							popularities.innerHTML='';
							insertPopularities(popularities);

							try {
								WATO.elem(function(){
									console.log(WATO.qs('a > img', popularities).clientHeight,"height");
									return 	WATO.qs('a > img', popularities).clientHeight > 0;
								}, function(oneImgReady){
									if(oneImgReady&&window.innerWidth>=600){
										console.log("rdy popularities", popularities);
										initFlickity(popularities);
										
									}
								});	
							}catch (error){
								console.log("failure: ", error);
							}
						});
					}
				});

				WATO.elem('#kk_highlights_content',function(element){
					if(element){
						var slide=element[0];

						//removing Text: ...Loading
						slide.innerHTML='';
						slide.insertAdjacentHTML("afterbegin", insertHighlights(DATA));
						
						WATO.elem(function(){
							return typeof window.Flickity !== "undefined";
						}, function(){
	
							try {
								WATO.elem(function(){
									return 	WATO.qs('a > img', slide).clientHeight > 0;
								}, function(oneImgReady){
									console.log(oneImgReady,"imgrdy");
									if(oneImgReady){
										console.log("rdy");
										initFlickity(slide,'.kk_productitem_highlight',"#kk_highlights_content .flickity-viewport");
										
									}
								});
	
							}catch (error){
								console.log("failure: ", error);
							}
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

