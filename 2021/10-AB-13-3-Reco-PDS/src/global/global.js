/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO, window){
    "use strict";

	/*jshint loopfunc: true */

	WATO.prototype.ab13_3 = function(recoID){
		var _self = this;

		// function goalPush(key, sendOnNextPageView){
		// 	if(sendOnNextPageView){
		// 		window.iridion.push(['goal', key, '', true]);
		// 	}else{
		// 		window.iridion.push(['goal', key]);
		// 	}
		// }

		// Hier für Variante 1 - Topseller der Kategorie
		// <div id="ecRecommendationsContainer_134">Loading...</div>
		// <script type="text/javascript">
		// // Setup widget, load data and render using defined template
		// var widget = new econda.recengine.Widget({
		//    element: document.getElementById('ecRecommendationsContainer_134'),
		//    renderer: {
		//       type: 'template',
		//       uri: '/path/to/my/template.html'
		//    },
		//    accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
		//    id: '134'
		// });
		// widget.render();
		// </script>

		// Und hier für Variante 2 - Zusammen gekauft
		// <div id="ecRecommendationsContainer_133">Loading...</div>
		// <script type="text/javascript">
		// // Setup widget, load data and render using defined template
		// var widget = new econda.recengine.Widget({
		//    element: document.getElementById('ecRecommendationsContainer_133'),
		//    renderer: {
		//       type: 'template',
		//       uri: '/path/to/my/template.html'
		//    },
		//    accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
		//    id: '133'
		// });
		// widget.render();
		// </script>

		_self.elem('#ecRecommendationsContainer', function(crossSellingEconda){
			if(crossSellingEconda){

				// Reco-Wrapper wird neu erstellt
				// Attribute für die Initialisierung liegen im DOM
				crossSellingEconda[0].insertAdjacentHTML('beforebegin', 
					'<div id="kk_ecRecommendationsContainer" '+
					'class="flickity-productslider js-ecReco" '+
					'data-accountid="00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1" '+
					'data-wid="'+recoID+'" '+
					'data-count="20" '+
					'data-product="sku:'+_self.qs('meta[property="product:upc"]').getAttribute('content')+'">Loading...</div>'
				);

				// alter Wrapper wird entfernt
				crossSellingEconda[0].parentNode.removeChild(crossSellingEconda[0]);

				
				_self.elem(function(){
					return typeof window.econda !== "undefined" && typeof jQuery !== "undefined" && 
						typeof jQuery.fn.flickity !== "undefined";
				} , function(econdaRdy){
					if(econdaRdy){
						var e = usercentrics.getConsents("SJXtq4iOoZX");
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
								$(t).html(d),
								$(t).flickity(ACC.productSlider.getFlickityOptions())
							};
							var n = $("#ecRecommendationsAddToCart").length > 0 ? $("#ecRecommendationsAddToCart") : $("#kk_ecRecommendationsContainer")
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
	};
})(window.WATO, window);