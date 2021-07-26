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

	WATO.ps03tweak(1);

	// Econda ID 134

	var locate = window.location;

	if(locate.pathname.indexOf("/p/") !== -1 && locate.search.indexOf("cs=see") !== -1){

		WATO.elem('.pds__imageAndCockpitWrapper + .small-collapse > .small-12', function(prodInfo){
			if(prodInfo){

				prodInfo[0].insertAdjacentHTML('beforebegin', 
					'<div class="small-12 columns js-product-reference">'+
						'<div class="small-12 columns">'+
							'<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
								'<div class="column small-12 h-mediumOffset-bottom-outer">'+
									'<div class="h4 text-center recommendation-headline">Ähnlich wie dieser Artikel</div>'+
								'</div>'+
								'<div class="column small-12 h-no-padding-medium-down">'+
									'<div id="kk_likethisproduct" '+
									'class="flickity-productslider js-ecReco" '+
									'data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f" '+
									'data-wid="134" '+
									'data-count="20" '+
									'data-product="sku:'+WATO.qs('meta[property="product:upc"]').getAttribute('content').substring(0,7)+'">'+
										'Loading...'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
				);
				
				WATO.elem(function(){
					return typeof window.econda !== "undefined" && typeof jQuery !== "undefined" && 
						typeof window.Flickity !== "undefined" && typeof window.usercentrics !== "undefined" && 
						typeof window.econda.recengine !== "undefined" && typeof window.econda.recengine.Widget !== "undefined"; // typeof jQuery.fn.flickity !== "undefined"
				} , function(econdaRdy){
					if(econdaRdy){
						var e = window.usercentrics.getConsents("SJXtq4iOoZX");
						if (null !== e && e.consentStatus) {
							var t = $("#completeTheLookRecommendationsAddToCart");
							if (t.length > 0)
								return;
							var i = {};
							i.horizontal = function(e, t, i) {
								for (var n = e.products, a = [], o = $("#ecRecommendationsAddToCart").length > 0, s = "", r = 0; r < n.length; r++) {
									var l = n[r]
										, c = void 0 !== l.oldprice
										, u = void 0 !== l.basicprice;
									s += '<div class="' + (o ? "carousel-cell" : "productitem text-center small-8 medium-5 large-3 columns") + '">',
									s += '<a href="' + l.deeplink + '" class="item__image">',
									s += '<img src="' + l.iconurl + '" />',
									s += '<div class="item__desc h-smallOffset-top-outer">',
									s += '<h4 class="desc-name">' + i.html(l.name) + "</h4>",
									s += '<div class="desc-price">',
									s += '<span class="price full ' + (c ? "show" : "hide") + '">' + l.oldprice + "</span>&nbsp;&nbsp;",
									s += '<span class="price ' + (c ? "show" : "hide") + '" style="margin-left: 3px">' + ACC.messages.productPriceFromClean + "</span>",
									s += '<span class="price special ' + (c ? "show" : "hide") + '">' + l.price + "</span>",
									s += '<span class="price ' + (c ? "hide" : "show") + '">' + l.price + "</span>",
									s += u ? '<div class="product-basic-price basicPrice">' + l.basicprice + "</div>" : "",
									s += "</div>",
									s += "</div>",
									s += "</a>",
									s += "</div>"
								}
								a.push(s);
								var d = a;
								$(t).html(d);
								// $(t).flickity(ACC.productSlider.getFlickityOptions())
								new window.Flickity(t, ACC.productSlider.getFlickityOptions());
							};
							var n = $("#kk_likethisproduct")
								, a = n.data("accountid")
								, o = n.data("wid")
								, s = n.data("product")
								, r = n.data("count")
								, l = new econda.recengine.Widget({
								element: n,
								renderer: {
									type: "function",
									rendererFn: i.horizontal
								},
								accountId: a,
								id: o,
								context: {
									products: [{
										id: s
									}]
								},
								chunkSize: r,
								empty: function(e) {
									this._onSuccessfulResponse(e)
								}
							});
							l.render()
						}
					}
				});
				// window.ACC.recommendation.init();
			}
		});
	}

})(new window.WATO(), window);