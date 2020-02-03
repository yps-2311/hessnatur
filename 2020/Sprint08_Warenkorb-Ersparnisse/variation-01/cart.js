// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    function price2Float(str) {
        return parseFloat(str.replace('€ ', '').replace('.', ',').replace(',', '.'));
    }

    // get localstorage category from add to cart (PDS 100%)
    var _ls = JSON.parse(localStorage.getItem('kk_cats')),
    _cats = Object.keys(_ls),
    _cat = '',
    _catCount = 0,
    upsellProds = {
        'herren': [
            // Ersparniss >= 20
            '4238409',
            // Ersparniss >= 10
            '4266889',
        ],
        'damen': [
            // Ersparniss >= 20
            '4260009',
            // Ersparniss >= 10
            '4266889',
        ],
        'baby': [
            // Ersparniss >= 20
            '4568785',
            // Ersparniss >= 10
            '36581',
        ],
        'kids': [
            // Ersparniss >= 20
            '3606218',
        ],
        'home': [
            // Ersparniss >= 20
            '4793601',
        ],
    };

    // find category with highest product add2cart
    for(var c = 0; c < _cats.length; c++) {
        var _key = _cats[c],
        _val = parseInt(_ls[_key]);

        if(_val > _catCount) {
            _cat = _key;
            _catCount = _val;
        }
    }

    var promoProd = upsellProds[_cat];

    // add blue alert at top
    WATO.elem('#hessnaturQuickAddForm', function(hessnaturQuickAddForm){
        if(hessnaturQuickAddForm) {
            hessnaturQuickAddForm[0].parentElement.insertAdjacentHTML('afterend', ''+
                '<div class="row">'+
                    '<div class="column small-12 large-10 large-offset-1">'+
                        '<div id="kk_cart_hint">Artikel im Warenkorb werden nicht reserviert.</div>'+
                    '</div>'+
                '</div>'
            );
        }
    });


    // find bottom CTA so products a loaded
    WATO.elem('.h-mediumOffset-bottom-inner .button.success', function(bottomCTA) {
        if(bottomCTA) {
            var _products = WATO.qsa('.listing__table--item'), 
            _productCount = _products.length,
            _youSaved = 0;

            // iterate all products and find savings
            for(var i=0; i < _productCount; i++) {
                var _thisProduct = _products[i],
                _oldPrice = WATO.qs('.strikeValue', _thisProduct);

                if(_oldPrice) {
                    var _newPrice = WATO.qs('.price', _thisProduct),
                    _oldPriceWrapper = _oldPrice.parentElement,
                    _save = price2Float(_oldPrice.textContent) - price2Float(_newPrice.textContent);

                    // sum savings
                    if(_save > 0) {
                        _youSaved += _save;
                    }

                    _oldPriceWrapper.classList.add('kk_price');
                    
                    _oldPriceWrapper.nextElementSibling.insertAdjacentHTML('afterend', ''+
                        '<div class="kk_save">€ '+_save.toFixed(2).replace('.', ',')+' Ersparnis</div>'
                    );

                    WATO.qs('img', _thisProduct).insertAdjacentHTML('afterend', ''+
                        '<span style="width: 100%;display: block;text-align: center;margin-top: -13px;">'+
                            '<img class="pds-cockpit__badge" src="https://imgs7.hessnatur.com/is/content/HessNatur/Overlays/overlay_sale.svg" style="margin: 0;">'+
                        '</span>'
                    );
                }
            }

            // decide which product will be shown
            var upsellIndex = 2;

            if(_youSaved >= 20) {
                upsellIndex = 0;
            }
            else if(_youSaved >= 10) {
                upsellIndex = 1;
            }
            var promo = promoProd[upsellIndex];

            // if product found get product info from API
            if(promo) {
                WATO.xhr_get('https://www.hessnatur.com/de/p/'+promo+'/json', false, function(data){
                    console.log(data);
                });
            }

            var sumPrices = WATO.qsa('.offset-price-left'),
            kk_sum = sumPrices[0],
            kk_total = sumPrices[1];

            // kk_sum.id="kk_sum";
            kk_sum.classList.add('discountPrice');
            kk_sum.insertAdjacentHTML('afterend', ''+
                '<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+(price2Float(kk_sum.textContent) + _youSaved).toFixed(2).replace('.', ',')+'*</div>'
            );
            
            WATO.qs('.btn-deliverycosts').insertAdjacentHTML('afterend', ''+
                '<br/>'+
                '<div class="kk_save" style="display: inline-block; color: #393939"><span style="font-weight:300">Sie sparen mit dieser Bestellung</span> € '+_youSaved.toFixed(2).replace('.', ',')+'</div>'
            );

            // kk_total.id="kk_total";
            kk_total.classList.add('discountPrice');
            kk_total.insertAdjacentHTML('afterend', ''+
                '<div class="column shrink price strikeValue h-no-padding-left h-xsmallOffset-bottom-inner h-smallOffset-left-outer kk_sums">€ '+(price2Float(kk_total.textContent) + _youSaved).toFixed(2).replace('.', ',')+'*</div>'
            );
            
        }
    });

    // function requestXML(URL, data, callback){

    //     var params = typeof data === 'string' ? data : Object.keys(data).map(
    //       function(k){ 
    //         return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    //       }
    //     ).join('&');
      
    //     var request = new XMLHttpRequest();
      
    //     request.open("POST", URL , true);
    //     request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    //     request.onload = function(){
    //       if (request.status >= 200 && request.status < 400 && request.responseText.length > 0) {
    //         callback(request);
    //       }
    //     };
    //     request.send(params);
    //   }
      
    //   requestXML("https://www.hessnatur.com/de/cart/add", { 
    //     productCodePost: '49865833130',
    //     ff_id: '49865833130',
    //     ff_masterId: '49865',
    //     ff_title: "Jeans Jasper Slim Fit aus Bio-Denim",
    //     ff_price: 129.95,
    //     qty: 1,
    //     CSRFToken: ACC.config.CSRFToken
    //   }, function(){
    //     // Wenn das Produkt dem WK hinzugefügt wurde wird die Seite neu geladen
    //   //  location.href=location.href.split('#')[0];
    //   //  location.reload();
    //   });

})(new window.WATO());
