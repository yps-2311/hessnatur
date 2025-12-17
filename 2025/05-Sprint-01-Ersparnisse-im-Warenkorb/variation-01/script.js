// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace Variante1
 * @name Variation 01
 * @description 
 */

(function (KEK) {
	"use strict";

	fetch('https://latest---hess-webshop-live-894b-spa-silmlw7nqq-ey.a.run.app/api/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			operationName: 'getAllAvailabilities',
			variables: {
			code: '56322',
			lang: 'de',
			country: 'de'
			},
			query: `query getAllAvailabilities($code: String!, $lang: String!, $country: String!) {
				allAvailabilities(code: $code, lang: $lang, country: $country) {
					id
					styles {
					id
					name
					imgUrl
					sizes {
						id
						name
						availabilityIndex
						deliveryTime
						price {
						formattedValue
						currencyIso
						netValue
						__typename
						}
						__typename
					}
					__typename
					}
					__typename
				}
				}
				`
		})
	})
	.then(response => response.json())
	.then(responseData => {
		console.log(responseData);

		const produktData = responseData.data.allAvailabilities.styles[0];

		setTimeout(() => {

			KEK.elem('[data-testid="cartPage"] [class*="cart_cart-page__wrapper__cart-entries-list_"]', (cartWrapper) => {
				if(cartWrapper){
					console.log('cartWrapper: ', cartWrapper);
					
					KEK.insert(cartWrapper[0], 'beforeend', `<div class="CartEntry_cartEntry__detailsWrapper__ufzUb">
						<div class="CartEntry_cartEntry__detailsWrapper__image__3y1VY">
							<div>
								<a href="/de/strick-pullover-relaxed-aus-alpaka-mit-bio-baumwolle/p/5709717S">
									<div class="Media_media__xv333" data-testid="media">
										<figure>
											<div class="Media_wrapper__nAZUr">
												<img alt="${produktData.name}" 
													loading="lazy" 
													decoding="async" 
													data-nimg="fill" 
													class="Media_element__Q1DDR Media_fill__eMe2a" 
													style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;" 
													src="${produktData.imgUrl.replace("{{format}}", "webshop_product-small")}">
											</div>
										</figure>
									</div>
								</a>
							</div>
						</div>
						<div class="CartEntry_cartEntry__detailsWrapper__details__IFwWE">
							<div class="CartEntry_cartEntry__headline__JQKsM">
								Wollsocke aus reiner Bio-Merinowolle
							</div>
							<div class="CartEntry_cartEntry__detailsWrapper__details__subline__dnLuO">
								<div class="CartEntry_cartEntry__subline__JAHeL">Artikel 57097</div>
								<div class="CartEntry_cartEntry__detailsWrapper__details--detail__BsQu1">Farbe: Marine</div>
							</div>
							<div class="CartEntry_cartEntry__detailsWrapper__details__availability__UPqPX">
								<span class="ProductAvailability_available__zjuhf" data-testid="product-availability-deliveryTime-available">3-5 Werktage</span>
							</div>
							<div class="CartEntry_cartEntry__detailsWrapper__details__box__H2ZF2">
								<div class="CartEntry_cartEntry__detailsWrapper__details__size__zOaRA">
									Größe 
									<p>
										<select id="cart-entry-size-1" class="Select_special__bJJJ0">
											<option value="XS">XS</option>
											<option value="S">S</option>
											<option value="M">M</option>
											<option value="L">L</option>
											<option value="XL">XL</option>
											<option value="XXL">XXL</option>
										</select>
									</p>
								</div>
							</div>
							<div class="CartEntry_cartEntry__detailsWrapper__details__price__oo_cN">
								<div class="PriceLabel_priceRow__1sb0z">
									<span class="sr-only">Erhältlich für 167,99&nbsp;€ anstatt 239,99&nbsp;€</span>
									<div class="PriceLabel_priceRow__priceLabel--cartEntry__kJU_x PriceLabel_priceRow__priceLabel--discounted__rpPhy PriceLabel_priceRow__priceLabel--discounted--bold__0yqY5">
										<span aria-hidden="true" data-testid="price-label-discounted">
											<div>167,99&nbsp;€</div>
										</span>
									</div>
									<div class="PriceLabel_priceRow__priceLabel--cartEntry__kJU_x PriceLabel_priceRow__priceLabel--striked__F_I_p PriceLabel_priceRow__priceLabel--striked--cartEntry__wXUbx">
										<span aria-hidden="true" data-testid="price-label-striked">239,99&nbsp;€</span>
									</div>
									<div class="PriceLabel_priceRow__priceInfo--cartEntry__Rh3lR"></div>
								</div>
							</div>
							<div class="CartEntry_cartEntry__detailsWrapper__details__ecoPoints__lteLs">168 Eco Points</div>
						</div>
					</div>`);





				}
			});


		}, 1000);


	})
	.catch(error => console.error('Error:', error)); 



	

})(new window.KEK());