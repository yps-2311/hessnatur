"use strict";

// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Max Vith
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
  "use strict";

  console.log("update 0815");
  /**
   * CSS Prefix 
   *
  document.documentElement.classList.add('specific-experiment-class');
  */
  //    window.iridion.econda.push(["Sprint19Messtest", "V1"]);

  WATO.sprint19goals();

  var cutTxt = function cutTxt(tag) {
    var lineHeight = window.getComputedStyle(tag)['line-height'],
        truncateTextParts = tag.innerHTML.split(' ');

    if (lineHeight === 'normal') {
      lineHeight = 1.16 * parseFloat(window.getComputedStyle(tag)['font-size']);
    } else {
      lineHeight = parseFloat(lineHeight);
    }

    while (3 * lineHeight < tag.clientHeight) {
      truncateTextParts.pop();
      tag.innerHTML = truncateTextParts.join(' ') + ' ...';
    }
  };
  /** HEADER **/


  WATO.elem('.breadcrumb-productList', function (breadcrumb) {
    if (breadcrumb) {
      console.log(WATO.qs('.sidebarNav--headline').textContent);
      breadcrumb[0].parentNode.insertAdjacentHTML('beforebegin', '<div id="kk-header" class="row">' + '<div id="kk-headline" class="column"></div>' + '<div id="kk-intro" class="column">' + '<div>' + '<span></span>' + '<a href="#kk-more">MEHR ERFAHREN</a>' + '</div>' + '</div>' + '</div>');
      WATO.elem('.sidebarNav--headline', function (headline) {
        if (headline) {
          WATO.qs('#kk-headline').textContent = headline[0].textContent;
        }
      });
    }
  });
  /** BADGES **/

  var CLASS_MODIFIED = 'kk-modified',
      productsEdited = 0;
  WATO.elem('body', function (body) {
    if (body) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function () {
          var products = WATO.qsa('.gridviewProductItemWrapper:not(.kk-modified)');

          if (productsEdited < products.length) {
            products.forEach(function (product) {
              if (!product.classList.contains(CLASS_MODIFIED)) {
                product.classList.add(CLASS_MODIFIED);
                var icons = WATO.qsa('.productBadges img', product),
                    iconImagePath = '',
                    iconHTML = '';
                icons.forEach(function (icon) {
                  iconImagePath += icon.getAttribute('src');
                });

                if (iconImagePath !== '') {
                  if (iconImagePath.indexOf('_neu') !== -1) {
                    iconHTML = '<span><b>NEU</b></span>';
                  }

                  if (iconImagePath.indexOf('_vegan') !== -1) {
                    iconHTML += '<span class="kk-vegan"><b>VEGAN</b></span>';
                  }
                } // Ich setze diesen Container immer, damit nth-child greifed und wir ggfs. alles
                // auf eine Höhe setzen können 


                var prodItem = WATO.qs('.productItemColorContainer', product);

                if (prodItem) {
                  prodItem.insertAdjacentHTML('afterbegin', '<div class="kk-icons column small-12">' + iconHTML + '</div>');
                }
              }
            });
          }
        });
      }).observe(document.body, {
        attributes: true,
        childList: true,
        characterData: true
      });
    }
  });
  WATO.elem('.breadcrumb-productList .js-filter-form', function (dropdownSort) {
    if (dropdownSort) {
      WATO.elem('.filterRow .shrink', function (changeView) {
        if (changeView) {
          changeView = changeView[0];
          var isArticleActive = document.URL.indexOf('viewMode=article') === -1;
          dropdownSort[0].insertAdjacentHTML('beforebegin', '<div id="kk-select" class="column large-3 shrink">' + '<div class="filterWrapper">' + '<ul class="changeArticleView no-bullet h-list--horizontal">' + '<li>Ansicht</li>' + '<li>' + '<label class="changeArticleViewItem -icon-model' + (isArticleActive ? ' kk-article-active' : '') + '"></label>' + '</li>' + '<li>' + '<label class="changeArticleViewItem -icon-article' + (!isArticleActive ? ' kk-model-active' : '') + '"></label>' + '</li>' + '</ul>' + '</div>' + '</div>');
          WATO.qs('#kk-select .changeArticleViewItem.-icon-model').addEventListener('click', function (event) {
            event.preventDefault();
            WATO.qs('label[for="desktop__viewmode_model"]', changeView).click();
          });
          WATO.qs('#kk-select .changeArticleViewItem.-icon-article').addEventListener('click', function (event) {
            event.preventDefault();
            WATO.qs('label[for="desktop__viewmode_article"]', changeView).click();
          });
        }
      });
    }
  });
  /** SEO **/

  WATO.elem('#js-foundation-sticky-left-navigation-data-anchor', function (prodContainer) {
    if (prodContainer) {
      // create kk root container
      prodContainer[0].parentNode.insertAdjacentHTML('afterend', '<div id="kk-seo" class="row">' + '<div id="kk-more"></div>' + '<div class="columns small-12 large-9 large-offset-3"></div>' + '</div>'); // get current SEO text

      WATO.elem('.footerSmoBoxWrapper .rteContainer', function (seoWrapper) {
        if (seoWrapper) {
          var newHTML = ''; // we need to wrap the text into seperate parts and add wrapper for product images

          seoWrapper[0].innerHTML.split('<h2>').forEach(function (container, index) {
            if (index === 0) {
              WATO.elem('#kk-intro span', function (kkIntro) {
                if (kkIntro) {
                  kkIntro[0].innerHTML = container; // cut txt after 3 lines

                  cutTxt(WATO.qs('#kk-intro p'));
                }
              });
            }

            if (index === 1) {
              newHTML += '<div class="column small-6 kk-seo-img"><div class="kk-seo-left"></div></div>';
            }

            newHTML += '<div class="column small-6">';

            if (index !== 0) {
              newHTML += '<h2>';
            }

            newHTML += container;
            newHTML += '</div>';

            if (index === 0 || index === 2) {
              newHTML += '<div class="column small-6 kk-seo-img"><div class="kk-seo-right"></div></div>';
            }
          });
          WATO.qs('#kk-seo .columns').innerHTML = '<div class="row">' + newHTML + '</div>'; // get the first 3 product images

          WATO.elem('.productPrgWrapper img.productImage-1', function (prodImages) {
            if (prodImages) {
              var kkSEOImages = WATO.qsa('.kk-seo-img');
              prodImages.forEach(function (img, index) {
                if (index >= 3) return false;

                if (kkSEOImages[index]) {
                  kkSEOImages[index].children[0].style.backgroundImage = 'url(' + img.getAttribute('src') + ')';
                }
              });
            }
          });
        }
      });
    }
  });
})(new window.WATO());