// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    // WATO.elem('.off-canvas-content', function(element){
    //     if(element){
    //         element[0].insertAdjacentHTML('afterbegin', 
    //             '<img style="position:absolute; top:0; left:0; z-index:2000; opacity:0.5;" src="https://dev.web-arts.de/hessnatur/2019/Sprint3.2-Mobile_Relevanz_erho%cc%88hen/img/01_eingeklappt.jpg">'
    //         );
    //     }
    // });

    // ACC.productDetail.selectColor = function(e) {
    //     console.log("productDetailselectColor");
    //     var t,
    //     i = e.data('variant-data'),
    //     n = e.find('select[name="item__color"]').val();
    //     $.each(i.colors, function (e, i) {
    //       if (i.colorCode === n) 
    //         return t = i,
    //       !1
    //     }),
    //     this.populateSizeData(e, t.sizes)
    // }
    //   ACC.productDetail.selectColor("66")

    WATO.elem('.h-largeOffset-bottom-outer.show-for-large', function(uvps){
        if(uvps){
            uvps = uvps[0];

            WATO.qs(".align-justify.h-xsmallOffset-bottom-inner", uvps.parentNode).insertAdjacentElement('beforebegin', uvps);

            Array.prototype.forEach.call(WATO.qsa(".pds-cockpit__shortDescription li", uvps),function(elem){
                elem.innerHTML = elem.innerHTML.replace("·", "").trim();

            });    
            
            var moreDetails = WATO.qs(".js-pds-more-details", uvps);

            if(moreDetails){
                moreDetails.innerHTML = "mehr Produktdetails";
                moreDetails.addEventListener('click', function(e){
                    e.preventDefault();
                    setTimeout(function(){
                        ACC.global.scrollToElement(jQuery(".accordion.productInfoAccordion"));
                    }, 700);
                });
            }

            
            
            
        }
    });
    
    WATO.elem('#addToWishlistForm', function(addToWishlistForm){
        if(addToWishlistForm){
            WATO.qs("#avail_container").insertAdjacentElement('beforebegin', addToWishlistForm[0]);
        }
    });

    WATO.elem('.breadcrumb--back a', function(breadcrumb){
        if(breadcrumb){
            breadcrumb[0].innerHTML = "zurück zu <b>„Kategorie“</b>";
        }
    });
    
    WATO.elem('.accordion-item:first-child .accordion-title', function(productInfo){
        if(productInfo){
            productInfo = productInfo[0];
            productInfo.insertAdjacentElement('afterend', WATO.qs(".pds-cockpit__articleNumber"));

            // WATO.elem('a[href="/de/groessenberatung"]', function(masstabelleLink){
            //     if(masstabelleLink){
            //         var passformInfos = masstabelleLink[0].parentNode.parentNode;
                    
            //         passformInfos.parentNode.parentNode.parentNode.style.display = "none";
                    
            //         productInfo.parentNode.insertAdjacentElement('beforeend', passformInfos);
            //     }
            // });

            var otherTabs = WATO.qsa(".accordion-item > a"),
                passform = false,
                material = false,
                pflege = false,
                ausgezeichneteQuali = false;

            for (var i = 0; i < otherTabs.length; i++) {
                var thisTab = otherTabs[i],
                    tabText = thisTab.textContent;
                if(tabText.indexOf("Ausgezeichnete Qualit") !== -1){
                    ausgezeichneteQuali = thisTab.parentNode;
                }else if(tabText.indexOf("Passform") !== -1){
                    passform = thisTab.parentNode;
                }else if(tabText.indexOf("Material") !== -1){
                    material = thisTab.parentNode;
                }else if(tabText.indexOf("Pflege") !== -1){
                    pflege = thisTab.parentNode;
                }
            }

            if(passform){
                productInfo.parentNode.insertAdjacentElement('beforeend', WATO.qs(".shrink + div", passform));
                passform.style.display = "none";
            }

            if(ausgezeichneteQuali){
                ausgezeichneteQuali.insertAdjacentElement('beforebegin', material);
            }

            if(material){
                var materialList = WATO.qs(".row > ul.no-bullet:last-child", material);
            
                if(pflege){
                    materialList.insertAdjacentElement('afterend', WATO.qs("ul.no-bullet", pflege));
                    pflege.style.display = "none";
                }
    
                materialList.insertAdjacentHTML('afterend', '<strong class="column small-12 h-text-uppercase kk_subline">Pflege</strong>');
    
                
                WATO.qs("a", material).innerHTML = "Material & Pflege";
            }

            WATO.elem('.footerBenefitWrapper', function(footerUVPs){
                if(footerUVPs && ausgezeichneteQuali){
                    var afterTheList = ausgezeichneteQuali.parentNode;
        
                    var socialmedia = WATO.qs(".pds-cockpit__sozialMediaShareWrapper"),
                        questions = socialmedia.previousElementSibling;
                    
                    afterTheList.insertAdjacentElement('afterend', socialmedia);
                    afterTheList.insertAdjacentElement('afterend', questions);

                    afterTheList.insertAdjacentElement('afterend', footerUVPs[0]);
                }
            });

            
        }
    });
    



})(new window.WATO(), window);
