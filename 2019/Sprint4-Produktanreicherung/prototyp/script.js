
$.get( "/de/kleid-aus-reiner-bio-baumwolle/p/465961236", function( data ) {
    // console.log('data: ', data);

    // console.log('jQuery(data).find(".pds-completeTheLookWrapper .productitem"): ', jQuery(data).find(".pds-completeTheLookWrapper .productitem"));
    
    jQuery("#updateCartForm0").after(jQuery(data).find(".pds-completeTheLookWrapper .productitem"));

    jQuery("#updateCartForm0").after('<form id="kk_addform" class="row align-middle h-mediumOffset-bottom-outer quickAddWrapper" action="cart/quickAdd" method="post" _lpchecked="1">'+
        '<button type="submit" class="button textLink quickadd__button h-no-margin">Hinzufügen</button>'+
        '<input id="item__orderno" name="articleCode" class="h-no-margin-medium" placeholder="Artikelnummer" type="text" value="4511129"></div>'+
        '<input type="hidden" name="CSRFToken" value="d8426504-c8f3-4a9a-b1cd-6262a4177452">'+
    '</form>');

    jQuery("#kk_addform").submit(function(e){
        e.preventDefault();
        console.log("submit");
        console.log('e: ', e);

        // $.post("cart/quickAdd", function( data ) {
        //     console.log('data: ', data);
        // });

        $.post(
            "cart/quickAdd",
            jQuery("#kk_addform").serialize(),
            function( AddData, textStatus, jQxhr ){
                console.log('data: ', AddData);
                // $('#response pre').html( data );
                var x = jQuery(AddData).find("#updateCartForm1");
                jQuery("#updateCartForm0").after(x);
                console.log('jQuery("#updateCartForm1"): ', jQuery("#updateCartForm1"));
                // ACC.cartWishlist.startEditEntry(jQuery("#updateCartForm1"));
                jQuery("#toggleEdit_1").click(function(e){
                    e.preventDefault();
                    ACC.cartWishlist.startEditEntry($(this).closest("form"));
                });
            },
            'text'
        )


        return true;
    });
});



// 48346

// https://www.hessnatur.com/de/p/465961236/json

// function t(t) {
//     var i = t.data;
//     t.isDefaultPrevented() || (t.preventDefault(), e(t.target).ajaxSubmit(i))
//   }

//   <form id="addToCartForm" class="js-add-to-cart-form" action="/de/cart/add" method="post">
//     <button id="addToCartButton" class="button success expanded pds-cockpit__addToCartButton js-add-to-cart-button" type="submit" data-disabled="false">
//         <span class="pds-cockpit__addToCartButtonIconWrapper">In den Warenkorb</span>
//     </button>
//     <input type="hidden" name="productCodePost" value="483468940">
//     <input type="hidden" value="483468934" name="ff_id">
//     <input type="hidden" value="48346" name="ff_masterId">
//     <input type="hidden" value="Top aus Leinen mit Bio-Baumwolle" name="ff_title">
//     <input type="hidden" value="49.95" name="ff_price">
//     <input type="hidden" maxlength="3" size="1" id="qty" name="qty" class="qty" value="1">
//     <div>
//     <input type="hidden" name="CSRFToken" value="893c49ed-8977-44c4-b73f-ba1240f8609a">
//     </div>
// </form>

// { "cartPopup" : "\u003Cdiv class=\"row h-lineHeight-off\"\u003E\n\t\t\t\u003Cdiv class=\"column\"\u003E\n\t\t\t\t\u003Cdiv class=\"flyOut-headline h-no-margin-bottom\"\u003E\n\t\t\t\t\t\u003Cdiv class=\"h-smallOffset-bottom-inner color-alert error\"\u003EGeben Sie eine positive Zahl ein, um die Artikelmenge zu aktualisieren.\u003C\/div\u003E\n\t\t\t\t\tIhre zuletzt hinzugefügten Artikel\u003C\/div\u003E\n\t\t\t\u003C\/div\u003E\n\t\t\u003C\/div\u003E\n\t\t\u003Cdiv class=\"row collapse\"\u003E\n\t\t\t\u003Cdiv class=\"column\"\u003E\n\t\t\t\t\u003Chr class=\"color-medium-light-gray h-smallOffset-top-outer h-smallOffset-bottom-outer\"\u003E\n\t\t\t\u003C\/div\u003E\n\t\t\u003C\/div\u003E\n\t\u003Cdiv class=\"row collapse scrollContainer\"\u003E\n\t\t\t\u003Cdiv class=\"columns\"\u003E\n\t\t\t\t\u003Cdiv class=\"columns\"\u003E\n\t\t\t\t\t\u003Cdiv class=\"row\"\u003E\n\t\t\t\t\t\t\t\u003Cdiv class=\"columns\"\u003E\n\t\t\t\t\t\t\t\t\u003Cul class=\"no-bullet h-list--horizontal\"\u003E\n\t\t\t\t\t\t\t\t\t\u003Cli class=\"flyout-image\"\u003E\n\t\t\t\t\t\t\t\t\t\t\u003Ca href=\"\/de\/kleid-aus-reiner-bio-baumwolle\/p\/465961236\"\/\u003E\n\t\t\t\t\t\t\t\t\t\t\t\u003Cimg src=\"https:\/\/imgs7.hessnatur.com\/is\/image\/HessNatur\/hyb_redes_layer_thumb\/Kleid_aus_reiner_Bio_Baumwolle-46596_12_1.jpg\" alt=\"Kleid aus reiner Bio-Baumwolle\" title=\"Kleid aus reiner Bio-Baumwolle\"\/\u003E\n\t\t\t\u003C\/a\u003E\n\t\t\t\t\t\t\t\t\t\u003C\/li\u003E\n\t\t\t\t\t\t\t\t\t\u003Cli class=\"flyout-content\"\u003E\n\t\t\t\t\t\t\t\t\t\t\u003Ca href=\"#\" title=\"Löschen\" data-form-id=\"_miniCartRemoveEntryForm\" data-entry-number=\"0\"\n\t\t\t\t\t\t\t\t\t\t\t class=\"float-right -fontSize-small h-disp-inline-block h-text-decoration-none js-quick-remove-entry\"\u003E×\u003C\/a\u003E\n\t\t\t\t\t\t\t\t\t\t\u003Cdiv class=\"flyOut-item-headline\"\u003EKleid aus reiner Bio-Baumwolle\u003C\/div\u003E\n\t\t\t\t\t\t\t\t\t\t\u003Csmall class=\"-fontSize-xsmall -lineHeight-tight h-disp-block\"\u003E\n\t\t\t\t\t\t\t\t\t\t\tGröße: 36\u003Cbr\/\u003E\n\t\t\t\t\t\t\t\t\t\t\tFarbe: himmelblau (12)\u003Cbr\/\u003E\n\t\t\t\t\t\t\t\t\t\t\t1x\n\t\t\t\t\t\t\t\t\t\t\t\u003Cstrong class=\"float-right\"\u003E€ 89,95\u003C\/strong\u003E\n\t\t\t\t\t\t\t\t\t\t\u003C\/small\u003E\n\t\t\t\t\t\t\t\t\t\u003C\/li\u003E\n\t\t\t\t\t\t\t\t\u003C\/ul\u003E\n\t\t\t\t\t\t\t\u003C\/div\u003E\n\t\t\t\t\t\t\u003C\/div\u003E\n\t\t\t\t\t\t\u003Cdiv class=\"row collapse\"\u003E\n\t\t\t\t\t\t\t\u003Cdiv class=\"column\"\u003E\n\t\t\t\t\t\t\t\t\u003Chr class=\"color-medium-light-gray h-smallOffset-top-outer h-smallOffset-bottom-outer\"\u003E\n\t\t\t\t\t\t\t\u003C\/div\u003E\n\t\t\t\t\t\t\u003C\/div\u003E\n\t\t\t\t\t\u003C\/div\u003E\n\t\t\t\u003C\/div\u003E\n\t\t\u003C\/div\u003E\n\t\t\u003Cdiv class=\"row\"\u003E\n\t\t\t\u003Cdiv class=\"columns small-12 -lineHeight-medium\"\u003E\n\t\t\t\t\u003Cstrong\u003EGesamtsumme (\u003Cspan class=\"js-cart-total-unit-count\"\u003E1\u003C\/span\u003E Artikel): \u003Cspan class=\"float-right\"\u003E€ 89,95\u003C\/span\u003E\u003C\/strong\u003E\n\t\t\t\u003C\/div\u003E\n\t\t\t\u003Cdiv class=\"columns small-12 -fontSize-xsmall -lineHeight-medium h-xsmallOffset-bottom-outer\"\u003E\n\t\t\t\tinkl. MwSt., zzgl. Versandkosten\u003C\/div\u003E\n\n\t\t\t\u003Cdiv class=\"columns small-12\"\u003E\n\t\t\t\t\t\u003Ca href=\"\/de\/cart\" class=\"button expanded -padding-tight h-no-margin\"\u003EZum Warenkorb\u003C\/a\u003E\n\t\t\t\t\u003C\/div\u003E\n\t\t\t\u003C\/div\u003E\n\t\u003Cform id=\"_miniCartRemoveEntryForm\" class=\"hide\" action=\"\/de\/cart\/update\" method=\"post\"\u003E\u003Cinput type=\"hidden\" name=\"entryNumber\" value=\"\"\u003E\n\t\u003Cinput type=\"hidden\" name=\"quantity\" value=\"0\"\u003E\n\u003Cdiv\u003E\n\u003Cinput type=\"hidden\" name=\"CSRFToken\" value=\"893c49ed-8977-44c4-b73f-ba1240f8609a\" \/\u003E\n\u003C\/div\u003E\u003C\/form\u003E", "recommendationLayer": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n \n \u003Cdiv class=\"reveal openOnLoad\" id=\"addedtocartrecommendationpopup\" data-reveal data-close-on-click=\"true\" data-animation-in=\"fade-in\" data-animation-out=\"fade-out\"\u003E\n\t\u003Cdiv class=\"row alert callout\"\u003E\n\t\t\u003Cdiv class=\"columns small-12 h5 alternativeFont color-alert\"\u003EFehler\u003C\/div\u003E\n\t\t\n \u003Cp class=\" columns small-12 h-smallOffset-bottom-inner\"\u003EGeben Sie eine positive Zahl ein, um die Artikelmenge zu aktualisieren.\u003C\/p\u003E\n \u003Cbutton class=\"close-button\" data-close aria-label=\"Close reveal\" type=\"button\"\u003E\n\t\t\t\u003Cspan aria-hidden=\"true\"\u003E×\u003C\/span\u003E\n\t\t\u003C\/button\u003E\n\t\u003C\/div\u003E\n\u003C\/div\u003E\n\n \n \n" }