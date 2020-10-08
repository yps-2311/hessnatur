// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace 100% for Sprint12
 * @name 100% for Sprint12
 * @description
 * Save Category of product added to cart on PDP 
 * Hide early + activate Sprint 12 on cart 
 */
(function (WATO) {
    "use strict";

    // if (document.URL.indexOf('/p/') !== -1) {
    //     // Productpage

        // console.log('PDS');

        var kk_pi_cat = false,
            getCat = function (so_id) {
                var ret = '';
                switch (so_id) {
                    case "SO-001":
                    case "SO-015":
                    case "SO-018":
                    case "SO-020":
                    case "SO-021":
                    case "SO-030":
                    case "SO-040":
                        ret = 'damen';
                        break;

                    case "SO-002":
                    case "SO-008":
                    case "SO-016":
                    case "SO-031":
                    case "SO-041":
                        ret = 'herren';
                        break;

                    case "SO-004":
                    case "SO-032":
                    case "SO-042":
                        ret = 'kids';
                        break;

                    case "SO-005":
                        ret = 'baby';
                        break;

                    case "SO-007":
                        ret = 'home';
                        break;
                    default:
                        ret = 'sonstiges';
                        break;
                }
                return ret;
            };



        WATO.elem(function () {
            try {
                kk_pi_cat = window.pi.category_id || window.basketTrackingObject.category_id;

                // console.log(kk_pi_cat);

                return !!kk_pi_cat;
            }
            catch (e) { }
            return false;
        }, function (pi_found) {
            if (pi_found) {
                // console.log('kk_pi_cat: '+kk_pi_cat);
                // do nothing and its okay :D
            }
        });

        WATO.ajax('cart/add', function () {
            try {
                var _ls = JSON.parse(localStorage.getItem('kk_cats') || '{}'),
                    // _group = window.emosSelectVariantEventPrototype.group.split('/')[0],
                    _group = getCat(kk_pi_cat),
                    _thisGroup = _ls[_group];
                    
                // console.log('_thisGroup: ', _thisGroup);
                // console.log(_group);

                if (_group !== '') {
                    if (!_thisGroup) {
                        _thisGroup = 1;
                    }
                    else {
                        _thisGroup++;
                    }

                    _ls[_group] = _thisGroup;

                    localStorage.setItem('kk_cats', JSON.stringify(_ls));
                }
            }catch (e) {
                // console.log('e: ', e);
            }
        });
    // }
    // else {
    //     // Cart
    //     document.head.insertAdjacentHTML('beforeend', '<style id="kk_hide">html{opacity: 0 !important}</style>');
    //     var kk_hide = WATO.qs('#kk_hide');

    //     // find bottom CTA so products a loaded
    //     WATO.elem('.h-mediumOffset-bottom-inner .button.success', function (bottomCTA) {
    //         if (bottomCTA) {
    //             var _products = WATO.qsa('.listing__table--item'),
    //                 _productCount = _products.length,
    //                 _min1oldPrice = false;

    //             // iterate all products and find savings
    //             for (var i = 0; i < _productCount; i++) {
    //                 var _thisProduct = _products[i],
    //                     _oldPrice = WATO.qs('.strikeValue', _thisProduct);

    //                 if (_oldPrice) {
    //                     // active Test
    //                     // window.iridion.push(['run', '939393152827']);

    //                     // 100% Ausspielung
    //                     window.iridion.push(['run', '949584067611']);
    //                     _min1oldPrice = true;

    //                     try {
    //                         window.iridion.push(['profile', 'setValue', 'hadStrikePrice', 'true']);
    //                     } catch (error) {
    //                     }

    //                     break;
    //                 }
    //             }

    //             if(!_min1oldPrice){
    //                 // Sprint 12 active Test
    //                 window.iridion.push(['run', '961003306345']);
    //             }

    //             kk_hide.innerHTML = '';
    //         }
    //     });

    //     setTimeout(function () {
    //         kk_hide.innerHTML = '';
    //     }, 5000);
    // }

})(new window.WATO());


// BKP
// !function(e){"use strict";if(-1!==document.URL.indexOf("/p/")){var a=!1;e.elem((function(){try{return!!(a=window.pi.category_id||window.basketTrackingObject.category_id)}catch(e){}return!1}),(function(e){})),e.ajax("cart/add",(function(){try{var e=JSON.parse(localStorage.getItem("kk_cats")||"{}"),t=function(e){var a="";switch(e){case"SO-001":case"SO-015":case"SO-018":case"SO-020":case"SO-021":case"SO-030":case"SO-040":a="damen";break;case"SO-002":case"SO-008":case"SO-016":case"SO-031":case"SO-041":a="herren";break;case"SO-004":case"SO-032":case"SO-042":a="kids";break;case"SO-005":a="baby";break;case"SO-007":a="home"}return a}(a),c=e[t];""!==t&&(c?c++:c=1,e[t]=c,localStorage.setItem("kk_cats",JSON.stringify(e)))}catch(e){}}))}else{document.head.insertAdjacentHTML("beforeend",'<style id="kk_hide">html{opacity: 0 !important}</style>');var t=e.qs("#kk_hide");e.elem(".h-mediumOffset-bottom-inner .button.success",(function(a){if(a){for(var c=e.qsa(".listing__table--item"),n=c.length,i=0;i<n;i++){var s=c[i];if(e.qs(".strikeValue",s)){window.iridion.push(["run","949584067611"]);break}}t.innerHTML=""}})),setTimeout((function(){t.innerHTML=""}),5e3)}}(new window.WATO);
