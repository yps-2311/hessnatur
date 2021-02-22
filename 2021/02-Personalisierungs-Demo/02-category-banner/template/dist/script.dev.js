"use strict";

// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Template Sale Banner
 * @description
 */
(function (WATO, window) {
  "use strict";
  /** Template Variables **/

  var TP_POSITION = "{{name=Position&type=webarts.watt.editor.impl.TextBoxEditor}}",
      TP_HEADLINE = "{{name=Headline&type=webarts.watt.editor.impl.TextBoxEditor}}",
      TP_IMAGE = "{{name=Image&type=webarts.watt.editor.impl.TextBoxEditor}}",
      TP_UVP1 = "{{name=UVP1&type=webarts.watt.editor.impl.TextBoxEditor}}",
      TP_UVP2 = "{{name=UVP2&type=webarts.watt.editor.impl.TextBoxEditor}}",
      TP_UVP3 = "{{name=UVP3&type=webarts.watt.editor.impl.TextBoxEditor}}";
  console.log("kk >>> TP_POSITION", TP_POSITION);
  console.log("kk >>> TP_HEADLINE", TP_HEADLINE);
  console.log("kk >>> TP_IMAGE", TP_IMAGE);
  console.log("kk >>> TP_UVP1", TP_UVP1);
  console.log("kk >>> TP_UVP3", TP_UVP3);
  console.log("kk >>> TP_UVP3", TP_UVP3);

  if (document.URL.indexOf('kkSalePreview=true') !== -1) {
    console.log("kk >>> preview enabled");
    TP_POSITION = "6";
    TP_HEADLINE = "Tragekomfort & Verträglichkeit";
    TP_IMAGE = "https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/trage1.jpg";
    TP_UVP1 = "Verwendung von hautsympathischen Materialien";
    TP_UVP2 = "Verzicht auf belastende Chemikalien";
    TP_UVP3 = "Wertvolle Naturfasern auf Ihrer Haut";
  } // TODO get info from profile object


  var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1;
  /** Init function **/

  function init() {
    WATO.elem('footer', function (prodWrapper) {
      if (prodWrapper && isInteressent) {
        var allProds = WATO.qsa(".js-product-grid > .gridviewProductItemWrapper");
        TP_POSITION = parseInt(TP_POSITION) - 2;

        if (allProds.length > 4 && TP_POSITION > 2) {
          var position = allProds[TP_POSITION];

          if (position) {
            position.insertAdjacentHTML('afterend', '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel">' + '<div style="background-image: url(' + TP_IMAGE + ');">' + '<div class="kk_content">' + '<img src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/boxlogo.svg">' + '<h3>' + TP_HEADLINE + '</h3>' + '<div>' + TP_UVP1 + '</div>' + '<div>' + TP_UVP2 + '</div>' + '<div>' + TP_UVP3 + '</div>' + '</div>' + '</div>' + '</div>');
          }
        }
      }
    });
  }

  init();
  WATO.ajax('productListJSON?products', function () {
    init();
  });
})(new window.WATO(), window);