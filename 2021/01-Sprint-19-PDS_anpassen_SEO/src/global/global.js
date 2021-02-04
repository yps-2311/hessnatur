/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
	"use strict";

	WATO.prototype.goalPush = function(key, sendOnNextPageView, value){
        if(window.iridion){
            if(sendOnNextPageView){
                window.iridion.push(['goal', key, '', true]);
            }else{
                window.iridion.push(['goal', key, (value || '')]);
            }
        }
    };

    WATO.prototype.sprint19goals = function(){

        var _self = this;

        function clickgoal(queryparameter, goalname, sendOnNextPageView) {
            _self.elem(queryparameter, function(element){
                if(element){
                    for (var i = 0; i < element.length; i++) {
                        element[i].addEventListener('click', function(){
                            _self.goalPush(goalname, sendOnNextPageView);
                        });
                    }
                }
            });
        }

        _self.ready(function(){

            // KK: PS19 - Klicks der Left Hand Navigation
            clickgoal(".sidebarNav ul a", "kk19_leftnavi", true);
            
            // KK: PS19 - Nutzung der Filter
            _self.elem('.gridviewProductFilterDesktopWrapper button', function(filter){
                if(filter){
                    for (var i = 0; i < filter.length; i++) {
                        filter[i].addEventListener('click', function(e){
                            if(!e.target.classList.contains('.hide') && !e.target.parentNode.classList.contains('.hide')){
                                _self.goalPush('kk19_usingfilter', true);
                            }
                        });
                    }
                }
            });

            // KK: PS19 - Klicks auf Banner (Katbanner)
            clickgoal(".js_backstopWrapper > .h-disp-block > a", "kk19_katbanner", true);
            
            // KK: PS19 - Klick auf eines der erste 6 Produkte
            _self.elem('.gridviewProductItemWrapper', function(products){
                if(products){
                    for (var i = 0; i < 6; i++) {
                        var thisProduct = products[i];
                        if(typeof thisProduct === "undefined"){
                            break;
                        }
                        if(!thisProduct.classList.contains('kk_kachel')){
                            thisProduct.addEventListener('click', function(){
                                _self.goalPush('kk19_first6prods', true);
                            });
                        }
                    }
                }
            });

            // KK: PS19 - Suchfeld Ende der Seite
            _self.elem('#search_form_page', function(bottomSearch){
                if(bottomSearch){
                    bottomSearch[0].addEventListener('submit', function(){
                        _self.goalPush('kk19_bottomsearch', true);
                    });
                }
            });
            
            // KK: PS19 - Button Weitere Artikel
            clickgoal(".js-more-results", "kk19_showmore", false);

            clickgoal(".shrink .changeArticleViewItem", "kk19_changeview", true);

            _self.elem('#desktop__sort', function(desktopSort){
                if(desktopSort){
                    desktopSort[0].addEventListener('change', function(){
                        _self.goalPush('kk19_sortchange', true);
                    });
                }
            });
            
            // KK: PS19 - Verweildauer des Besuchers
            var counter = 0,
                interval = setInterval(function(){

                counter = counter + 10;
                
                _self.goalPush('kk19_staysonpage', false, String(counter));
                
                if(counter >= 120){
                    clearInterval(interval);
                }
            }, 10000);
        });
    };


    WATO.prototype.sprint19 = function(variation) {
        
        window.iridion.econda.push(["Sprint19V2", variation]);

        document.documentElement.classList.add('kk-ab19');


        var WATO = this;

        WATO.sprint19goals();

        var cutTxt = function(tag) {

                var lineHeight          = window.getComputedStyle(tag)['line-height'],
                    truncateTextParts   = tag.innerHTML.split(' ');

                if (lineHeight === 'normal') {

                    lineHeight = 1.16 * parseFloat(window.getComputedStyle(tag)['font-size']);
                } else {

                    lineHeight = parseFloat(lineHeight);
                }

                while (3 * lineHeight < tag.clientHeight) {
                    truncateTextParts.pop();
                    tag.innerHTML = truncateTextParts.join(' ') + ' ...';
                }
            },
            checkUserAgent = function(str) {
                return navigator.userAgent.indexOf(str) !== -1;
            },
            clickOnChangeArticleViewItem = function(selector, changeView){

                WATO.qs('#kk-select .changeArticleViewItem.-icon-' + selector).addEventListener('click', function(event){
                    event.preventDefault();
                    WATO.qs('label[for="desktop__viewmode_' + selector + '"]', changeView).click();
                });
            },
            getImgWrapper = function(position, image){
                return '<div class="column small-12 large-6 kk-seo-img"><div class="kk-seo-' + position + '" style="background-image:url(' + image + ')"></div></div>';
            };

        var DESKTOP_DEVICE = !checkUserAgent('Mobile') && !checkUserAgent('Android');

        /** HEADER **/
        WATO.elem('.breadcrumb-productList', function(breadcrumb){

            if(breadcrumb){

                breadcrumb[0].parentNode.insertAdjacentHTML('beforebegin', 
                    '<div id="kk-header" style="height:100px;" class="row">' + 
                        '<div id="kk-headline" class="column ' + (!DESKTOP_DEVICE ? 'small-12' : '' ) + '"></div>' +
                        '<div id="kk-intro" style="display:none;" class="column ' + (!DESKTOP_DEVICE ? 'small-12' : '' ) + '">' + 
                            '<div>' + 
                                '<span></span>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );

                WATO.elem('.sidebarNav .h-text-decoration-none-hover.h-text-bold', function(headline){

                    if(headline){
                        WATO.qs('#kk-headline').textContent = headline[0].textContent;
                    }
                });

                WATO.ready(function(){

                    if(!WATO.qs('.sidebarNav .h-text-decoration-none-hover.h-text-bold')){
                        WATO.qs('#kk-headline').textContent = WATO.qs('.sidebarNav--headline').textContent;
                    }
                });
            }
        });

        WATO.elem('.breadcrumb-productList .js-filter-form', function(dropdownSort){

            if(dropdownSort){

                WATO.elem('.filterRow .shrink', function(changeView){

                    if(changeView){

                        changeView = changeView[0];

                        var isArticleActive = document.URL.indexOf('viewMode=article') === -1;

                        dropdownSort[0].insertAdjacentHTML('beforebegin', 
                            '<div id="kk-select" class="column large-3 shrink">' +
                                '<div class="filterWrapper">' +
                                    '<ul class="changeArticleView no-bullet h-list--horizontal">' + 
                                        '<li>Ansicht</li>' +
                                        '<li>' +
                                            '<label class="changeArticleViewItem -icon-model' + ( isArticleActive ? ' kk-article-active' : '' ) + '"></label>' +
                                        '</li>' +
                                        '<li>' +
                                            '<label class="changeArticleViewItem -icon-article' + ( !isArticleActive ? ' kk-model-active' : '' ) + '"></label>' +
                                        '</li>' +
                                    '</ul>' +
                                '</div>' +
                            '</div>'
                        );

                        clickOnChangeArticleViewItem('model', changeView);
                        clickOnChangeArticleViewItem('article', changeView);
                    }
                });
            }
        });


        /** SEO TXT **/
        WATO.elem('#js-foundation-sticky-left-navigation-data-anchor', function(prodContainer){

            if(prodContainer){

                // create kk root container
                prodContainer[0].parentNode.insertAdjacentHTML('afterend', 
                    '<div id="kk-seo" class="row">' +
                        '<div id="kk-more"></div>' + 
                        '<div class="columns small-12 large-9 large-offset-3"></div>' +
                    '</div>'
                );

                // get current SEO text
                WATO.elem('.footerSmoBoxWrapper .rteContainer', function(seoWrapper){

                    if(seoWrapper){

                        // get the first 3 product images
                        var savedSEOImages          = sessionStorage.getItem('kk19Images'),
                            firstVisitOnThisPage    = document.referrer.indexOf(location.pathname) === -1,
                            seoImages               = [];
                            
                        WATO.elem('.productPrgWrapper img.productImage-1', function(prodImages){

                            if(prodImages){

                                window.setTimeout(function(){

                                    var kkSEOImages = [];

                                    if(!firstVisitOnThisPage && savedSEOImages){
                                
                                        try {
                                            
                                            savedSEOImages = JSON.parse(savedSEOImages);

                                            savedSEOImages.forEach(function(img){
                                                kkSEOImages.push(img);
                                            });
                                        } catch(e) {
                                            console.log("kk >", e.toString());
                                        }
                                    } else {

                                        prodImages.forEach(function(img, index){
        
                                            if(index >= 3) return false;
        
                                            var src = img.getAttribute('src');
    
                                            seoImages.push(src);
                                            kkSEOImages.push(src);
                                        });

                                        if(seoImages.length > 0){
                                            sessionStorage.setItem('kk19Images', JSON.stringify(seoImages));
                                        }
                                    }

                                    var newHTML = '';

                                    // we need to wrap the text into seperate parts and add wrapper for product images
                                    seoWrapper[0].innerHTML.split('<h2>').forEach(function(container, index) {
                                        
                                        if(index === 0){

                                            WATO.elem('#kk-intro span', function(kkIntro){

                                                if(kkIntro){

                                                    kkIntro[0].parentNode.parentNode.parentNode.style.height = "215px";
                                                    kkIntro[0].parentNode.parentNode.style.display = "flex";
                                                    kkIntro[0].innerHTML = container;

                                                    // cut txt after 3 lines
                                                    cutTxt(WATO.qs('#kk-intro p'));

                                                    kkIntro[0].insertAdjacentHTML('afterend', 
                                                        '<a href="#kk-more">MEHR ERFAHREN</a>'
                                                    );
                                                }
                                            });
                                        }

                                        if(DESKTOP_DEVICE && index === 1 && kkSEOImages[0] || (!DESKTOP_DEVICE && index <= 2)){
                                            newHTML += getImgWrapper('left', kkSEOImages[0]);
                                            kkSEOImages.shift();
                                        }

                                        newHTML += '<div class="column small-12 large-6">';

                                        if(index !== 0) {
                                            newHTML += '<h2>';
                                        }
                                        
                                        newHTML += container; 
                                        newHTML += '</div>';

                                        if(DESKTOP_DEVICE && kkSEOImages[0] && (index === 0 || index === 2)){
                                            newHTML += getImgWrapper('right', kkSEOImages[0]);
                                            kkSEOImages.shift();
                                        }
                                    });
                                    
                                    WATO.qs('#kk-seo .columns').innerHTML = '<div class="row">' + newHTML + '</div>';
                                }, 500);
                            }
                        });
                    }
                });
            }
        });
    }
})(window.WATO);