/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */


(function(WATO){
	"use strict";

	WATO.prototype.PS06 = function(variation){

		var WATO=this;

		function initFlickity(slide){
			const props={
				cellAlign: 'left',
				contain: true,
				pageDots: false
			}
			return new Flickity(slide,props);
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
			}
			else return(
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
				'</div>');
		}
	
		function insertHighlights(data) {
	
			var result = '';
	
			for(var category in data){
			var product = data[category]['response'];
	
			if (product) {
				var price=product['price'].toFixed(2);
				var prevPrice=product['price_prev'];
				var link=product['permalink'];
				var image=product['imageOnlyProduct'];
				var name=product['name'];
				var highlight="Kundenfavorit";
	
				var isNormal= "show";
				var isReduced= "";
	
				if(!prevPrice){
					isReduced="hide";
				}
				else{
					isNormal="hide";
					prevPrice.toFixed(2);
					}
	
				   var mergedProducts='';
				   var badges=data[category]['badges'];
				   for(var index in badges){
					   mergedProducts+='<span class="kk_'+badges[index]+'">'+badges[index]+'</span><span>&nbsp;&nbsp;</span>';
					}
				var variants=(variation===2?'<div class="kk_highlight-header kk_grid">'+
											'<div>'+
												highlight+
											'</div>'+
										'</div>':"")
	
				result = result.concat(
					'<div class="kk_productitem_highlight productitem pro text-center small-5 medium-5 large-3 columns " style="position: absolute; left: 0%;">'+
						variants+
						'<a href='+link+' class="item__image"><img src='+image+'>'+
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
			element[0].innerHTML='';
			var image='https://dev.web-arts.de/hessnatur/2021/11-PS-06-Einstiege-Startseite/src/variation-01/assets/popularity_filler.png';
			var link='https://www.hessnatur.com/de/damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel';
	
				
				if(window.innerWidth<600){
					for (var i=0;i<=5; i++){
						element[0].insertAdjacentHTML("afterbegin",
							'<div class="text-center small-4 medium-3 large-2 columns">'+
								'<a href='+link+' class="item__image"><div class="kk_children_50"><img class="" src='+image+'></div>'+
									'<div class="item__desc h-smallOffset-top-outer">'+
										'<h4 class="kk_h4">Kategorie '+i+'</h4>'+
									'</div>'+
								'</a>'+
							'</div>'
								); 
					}
				}
				else{
					for (var j=0;j<=5; j++){
						element[0].insertAdjacentHTML("afterbegin",
							'<div class="kk_productitem_popularity productitem text-center small-4 medium-3 kk-large-20 columns" style="position: absolute; left: 0%;">'+
								'<a href='+link+' class="item__image"><div class="kk_children_50"><img class="" src='+image+'></div>'+
									'<div class="item__desc h-smallOffset-top-outer">'+
										'<h4 class="kk_h4">Kategorie '+j+'</h4>'+
									'</div>'+
								'</a>'+
							'</div>'
								); 
					}
					initFlickity(element[0]);
					setTimeout(function(){
						var heightOfPopularitySlider = jQuery('.kk_productitem_popularity').height();
						console.log(heightOfPopularitySlider, "height");
						jQuery("#kk_popularities_content .flickity-viewport").css("height", heightOfPopularitySlider+"px");
					}, 4000);
				}
			}
	
		var DATA={
			"damen":{
				"5126626ONE": {
					"badges": [
						"neu",
						"vegan",
						"sales"
					]  
					,
					"response": {
	
					}
				},
				"5100536": {
					"badges": [
						"neu",
						"vegan",
						"sales"
					]  ,
					"response": {
	
					}
				},
				"5119730": {
					"badges": [
						"neu",
						"vegan",
						"sales"
					]  ,
					"response": {
	
					}
				},
				"5101809": {
					"badges": [
						"neu",
						"vegan",
						"sales"
					]  ,
					"response": {
	
					}
				},
				"5119501": {
					"badges": [
						"neu",
						"vegan",
						"sales"
					]  ,
					"response": {
	
					}
				}
			}
		},
		response=0;
	
		DATA=DATA.damen;
		WATO.elem(".lpmHero", function (headline) {
	
			if (headline) {
					headline[0].insertAdjacentHTML("afterend",
						'<div id="kk_insertion lpmTeaser --two grid --headline --align --fluffy">'+
							'<div class="lpmSeparator">&nbsp;</div>'+
							initKkHeadline("kk_highlights_header",(variation===1?"Aktuelle Highlights":"Shirts & Tops aus Bio-Baumwolle"))+
							initKkSliderContainer("kk_highlights_content")+
							initKkHeadline("kk_popular_header","Beliebte Kategorien")+
							'<div id="kk_chosen_user" class="kk_container">'+
								'<div class="kk_furtherArticles kk_isDesktop kk_justify-content-end column">'+
									'<span class="hn-button-link">Alle Artikel für Damen</span>'+
								'</div>'+
							'</div>'+
							initKkSliderContainer("kk_popularities_content")+
							'<div id="kk_chosen_user" class="kk_container">'+
								'<div class="kk_furtherArticles kk_isMobile kk_justify-content-center">'+
									'<span class="hn-button-link">Alle Artikel für Damen</span>'+
								'</div>'+
							'</div>'+
							'<div class="kk_contest kk_grid kk_isMobile column">'+
								'<div class="small-6">'+
									'<div class="kk_first_line">'+
										'Für Mamas und Papas'+
									'</div>'+
									'<div class="kk_second_line">'+
										'<div>Unser Dankeschön:</div>'+
										'<div>Lieblingsoutfit zu gewinnen.</div>'+
									'</div>'+
								'</div>'+
								'<div class="small-6 kk_flex kk_justify-content-center kk_align-items-center">'+
									'<a class="kk_second_line kk_text-white kk_bottom-border_white">Outfit gewinnen</a>'+
								'</div>'+
							'</div>'+
						'</div>');
					}
				});
	
		for(var id in DATA ){
			WATO.xhr_get("https://products.hessnatur.com/products/"+id, function (rawData) {
	
				var sku=rawData['products'][0]['sku'];
				DATA[sku].response=rawData['products'][0];
				response++;
			});
		}
		WATO.elem(function(){
			console.log(response, Object.keys(DATA).length, "objectkeys");
			return response===Object.keys(DATA).length;
		},
		function(done){
			if(done){
				WATO.elem(function(){
					return typeof window.Flickity !== "undefined";
				}, function(){        
								WATO.elem('#kk_popularities_content',function(element){
									if(element){
										insertPopularities(element);
									}
								});
					
								WATO.elem('#kk_highlights_content',function(element){
									if(element){
										//removing Text: ...Loading
										element[0].innerHTML='';
										element[0].insertAdjacentHTML("afterbegin", insertHighlights(DATA));
										
										try {
												var slide=element[0];
								
												initFlickity(slide);
	
												/*
												WATO.elem('.kk_productitem_highlight',function(highlightCards){
													WATO.elem("#kk_highlights_content .flickity-viewport", function(HighlightsViewport){
														//HighlightsViewport[0].style.height=highlightCards[0].style.height;
														console.log(highlightCards[0].style.height,"card",highlightsViewport[0].style.height,"vp");
													})
	
												})*/
	
												setTimeout(function(){
													var heightOfHighlightsSlider= jQuery('.kk_productitem_highlight').height();
													jQuery("#kk_highlights_content .flickity-viewport").css("height", heightOfHighlightsSlider+"px");
												}, 4000);
										}catch (error){
											console.log("Flickity failure: ", error);
										}
									}
								});//second slide
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

