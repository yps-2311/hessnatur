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

	// window.iridion.econda.push(["SprintPS06", "V1"]);

	function pushGoal(key, sendOnNextPageView){    
		if(sendOnNextPageView){
			window.iridion.push(['goal', key, '', true]);
		}else{
			window.iridion.push(['goal', key]);
		}
	}

	var imgPath = 'https://imgs7.hessnatur.com/is/image/HessNatur/',
		categoryAffinity = window.iridion.push(['profile', 'getValue', 'categoryAffinity']) || "damen",
		data = {
			damen: {
				heroImg : 'hyb_redes_detail_main/T_Shirt_aus_reiner_Bio_Baumwolle-45385_21_1.jpg',
				ctl: [
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95', true],
						['/p/423840946', true, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95']
					],
				heroImgSlider : 'hyb_redes_detail_main/T_Shirt_aus_reiner_Bio_Baumwolle-45385_21_1.jpg',
				ctlSlider: [
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95', true],
						['/p/423840946', true, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95']
					]
			},
			herren: {
				heroImg : 'hyb_redes_detail_main/T_Shirt_aus_reiner_Bio_Baumwolle-45385_21_1.jpg',
				ctl: [
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95', true],
						['/p/423840946', true, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95']
					],
				heroImgSlider : 'hyb_redes_detail_main/T_Shirt_aus_reiner_Bio_Baumwolle-45385_21_1.jpg',
				ctlSlider: [
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95', true],
						['/p/423840946', true, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95'],
						['/p/423840946', false, 'T_Shirt_aus_reiner_Bio_Baumwolle-42384_09_7.jpg', 'T-Shirt aus reiner Bio-Baumwolle', '19,95']
					]
			}
		},
		selectedData = data[categoryAffinity],
		ctlHTML = '',
		sliderHTML = '';

	function getProd(productDataArray) {
		// link, sale, img, prodname, preis, fav
		return 	'<a href="'+productDataArray[0]+'" class="item__image'+(productDataArray[5] ? ' kk_fav' : '')+'">'+
					'<img src="'+imgPath+'generalfeed_large/'+productDataArray[2]+'">'+
					'<div class="item__desc h-smallOffset-top-outer">'+
						(productDataArray[1] ? '<img class="kk_sale" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" alt="">' : '')+
						'<h4 class="desc-name">'+productDataArray[3]+'</h4>'+
						'<div class="desc-price">'+
							'<span class="price full hide">undefined</span>'+
							'<span class="price hide">ab </span>'+
							'<span class="price special hide">'+productDataArray[4]+' €</span>'+
							'<span class="price show">'+productDataArray[4]+' €</span>'+
						'</div>'+
					'</div>'+
				'</a>';
	}

	for (var i = 0; i < selectedData.ctl.length; i++) {
		ctlHTML += '<div class="column small-4">'+
			getProd(selectedData.ctl[i])+
		'</div>';
	}
	for (var j = 0; j < selectedData.ctlSlider.length; j++) {
		sliderHTML += '<div class="productitem text-center small-8 medium-5 large-4 columns">'+
			getProd(selectedData.ctlSlider[j])+
		'</div>';
	}

	WATO.elem('#hero', function(hero){
		if(hero){
			hero[0].insertAdjacentHTML('afterend', 
				'<div id="kk_newctl" class="kk_ctl">'+
					'<h3 class="hn-headline large:hn-2xl hn-mb-4 hn-lg">Angesagte & Empfohlene looks</h3>'+
					'<div class="row">'+
						'<div class="small-5">'+
							'<img src="'+imgPath+selectedData.heroImg+'">'+
						'</div>'+
						'<div class="column small-7">'+
							'<div class="row">'+
								ctlHTML+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div id="kk_newSlider" class="kk_ctl">'+
					'<div class="row">'+
						'<div class="column small-9">'+
							'<h3 class="hn-headline large:hn-2xl hn-mb-4 hn-lg">Angesagte & Empfohlene looks</h3>'+
							'<div class="flickity-productslider js-ecReco" id="kk_reco">'+
								sliderHTML+
							'</div>'+
						'</div>'+
						'<div class="small-3">'+
							'<img src="'+imgPath+selectedData.heroImgSlider+'">'+
						'</div>'+
					'</div>'+
				'</div>'
			);

			var ctlProducts = WATO.qsa('#kk_newctl .item__image'),
				sliderProducts = WATO.qsa('#kk_newSlider .item__image');

			for (var j = 0; j < ctlProducts.length; j++) {
				ctlProducts[j].addEventListener('click', function(){
					pushGoal("ps06_ctl", true);
				});
			}
			for (var j = 0; j < sliderProducts.length; j++) {
				sliderProducts[j].addEventListener('click', function(){
					pushGoal("ps06_slider", true);
				});
			}


			setTimeout(function(){
				WATO.elem(function(){
					return typeof jQuery !== "undefined";
				}, function(isjq){
					if(isjq){
						// Doku https://flickity.metafizzy.co/
						jQuery("#kk_reco").flickity({
							// options
							draggable: true,
							cellAlign: 'left',
							contain: true,
							prevNextButtons: true,
							pageDots: false,
							percentPosition: true,
							setGallerySize: true
							// adaptiveHeight: true
						})
						// jQuery("#kk_reco").on('scroll.flickity', function( event, index ) {
						// 	console.log( 'Slide changed to ' + index );
						// });

					}
				});
			}, 10);
		}
	});
	

})(new window.WATO(), window);