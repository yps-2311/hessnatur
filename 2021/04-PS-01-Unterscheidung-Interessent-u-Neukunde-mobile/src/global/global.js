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



    WATO.prototype.goProfile = function(thisName, thisvalue) {
		if(thisvalue){
			window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
		}else{
			return window.iridion.push(['profile', 'getValue', thisName]);
		}
	};

    WATO.prototype.ps01mobileSegment = function(){
		var _self = this;

		function doSomeSegment(id, key) {
			if(!key){
				window.iridion.push(["segment", id]);
			}else if(key === 1 && window.iridion.push(['hasSegment', id])){
				window.iridion.push(["removeSegment", id]);
			}else if(key === 2){
				return window.iridion.push(['hasSegment', id]);
			}
		}
		try {
			var variation = _self.goProfile('customerType') || "Interessent";

			if(variation === "Interessent"){
				// Interessent
				if(!doSomeSegment("32862", 2)){
					doSomeSegment("32862");
				}
			}else if(variation === "Neukunde"){
				// Neukunde
				if(!doSomeSegment("32863", 2)){
					doSomeSegment("32862", 1);
					doSomeSegment("32863");
				}
			}else if(variation === "Bestandskunde"){
				// Bestandskunde
				if(!doSomeSegment("32860", 2)){
					doSomeSegment("32862", 1);
					doSomeSegment("32863", 1);
					doSomeSegment("32860");
				}
			}
			
			// switch (_self.goProfile('categoryAffinity')) {
			// 	case "herren":
			// 		if(!doSomeSegment("32865", 2)){
			// 			doSomeSegment("32866", 1);
			// 			doSomeSegment("32867", 1);
			// 			doSomeSegment("32864", 1);
			// 			doSomeSegment("32865");
			// 		}
			// 		break;
			// 	case "baby":
			// 		if(!doSomeSegment("32866", 2)){
			// 			doSomeSegment("32865", 1);
			// 			doSomeSegment("32867", 1);
			// 			doSomeSegment("32864", 1);
			// 			doSomeSegment("32866");
			// 		}
			// 		break;
			// 	case "home":
			// 		if(!doSomeSegment("32867", 2)){
			// 			doSomeSegment("32866", 1);
			// 			doSomeSegment("32865", 1);
			// 			doSomeSegment("32864", 1);
			// 			doSomeSegment("32867");
			// 		}
			// 		break;
			// 	default: // damen
			// 		if(!doSomeSegment("32864", 2)){
			// 			doSomeSegment("32866", 1);
			// 			doSomeSegment("32867", 1);
			// 			doSomeSegment("32865", 1);
			// 			doSomeSegment("32864");
			// 		}
			// 		break;
			// }
		} catch (error) {
			// console.log('error: ', error);
		}
	};

    WATO.prototype.ps01mobile = function(variation){
        
        var _self = this,
            customerType = window.iridion.push(['profile', 'getValue', 'customerType']),
            isInteressent = customerType === false || customerType === "Interessent",
            hessnaturLogo = "https://media.hessnatur.com/kk/2021/ps01-mobile/boxlogo.svg", //"https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg", https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/boxlogo.svg
            isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
            favProducts = [], // Beliebteste Produkte der letzten 3 Monate
            sehrgefragtProducts = []; // Beliebteste Produkte der letzten 14 Tage

        // Nur für QS
        if(document.location.search.indexOf("show=neukunde") !== -1){
            isInteressent = false;
        }else if(document.location.search.indexOf("show=interessent") !== -1){
            isInteressent = true;
        }

        function iridionProfile(thisName, thisvalue) {
            if(thisvalue){
                window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
            }else{
                return window.iridion.push(['profile', 'getValue', thisName]);
            }
        }

        function goalPush(selector, key){
            _self.elem(selector, function(selectorElem){
                if(selectorElem){
                    selectorElem[0].addEventListener('click', function(){
                        window.iridion.push(['goal', key]);
                    });
                }
            });
		}
        
        if(sessionStorage.getItem("kk_favForSession")){
            favProducts = JSON.parse(iridionProfile("favProducts"));
            sehrgefragtProducts = JSON.parse(iridionProfile("sehrgefragtProducts"));
        }else{
            _self.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=131&csize=50&start=0&type=cs&widgetdetails=true", function(data) {
                favProducts = [];
                var allItems = JSON.parse(data).items;
                for (var i = 0; i < allItems.length; i++) {
                    favProducts.push(parseInt(allItems[i].id));
                }
                iridionProfile("favProducts", favProducts);
                sessionStorage.setItem("kk_favForSession", true);
            });
    
            _self.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=132&csize=50&start=0&type=cs&widgetdetails=true", function(data) {
                sehrgefragtProducts = [];
                var allItems = JSON.parse(data).items;
                for (var i = 0; i < allItems.length; i++) {
                    sehrgefragtProducts.push(parseInt(allItems[i].id));
                }
                iridionProfile("sehrgefragtProducts", sehrgefragtProducts);
                sessionStorage.setItem("kk_favForSession", true);
            });
        }
    
        function checkForKachelClass(elem) {
            try {
                return elem.nextElementSibling ? elem.nextElementSibling.classList.contains('kk_kachel') : false;
            } catch (error) {
                return false;
            }
        }

        function setBadgeToHead(allProds) {
            for (var k = 0; k < allProds.length; k++) {
                var isSaleBadge = _self.qs('.productBadgesWrapper img[src*="sale"], .productBadgesWrapper img[src*="Prozent"]', allProds[k]);
                if(isSaleBadge){
                    allProds[k].insertAdjacentElement('afterbegin', isSaleBadge.parentNode);
                }
            }
        }

        function getAllProducts() {
            return _self.qsa(".js-product-grid > .gridviewProductItemWrapper");
        }
    
        function init() {
    
            if(isPDS){
    
                // PDS
                var thisProductID = parseInt(window.location.pathname.split("/p/")[1].substring(0,5));
    
                _self.elem('.small-12 > .small-collapse.medium-uncollapse.large-uncollapse', function(contentArea){
    
                    if(contentArea){
    
                        var productInfo = contentArea[0];
    
                        productInfo.insertAdjacentHTML('afterbegin', 
                            '<div class="kk_quali">'+
                                '<h4 class="kk_hl">'+
                                    '<span>N</span>atürliche Qualität für Ihr Wohlbefinden'+
                                '</h4>'+
                                '<div class="kk_boxes">'+
                                    (variation === 1 ? 
                                        '<div class="kk_natur">'+
                                            'Naturfasern in höchster<br>Qualität'+
                                        '</div>'+
                                        '<div class="kk_stuecke">'+
                                            'Besonderer Tragekomfort &<br>Verzicht auf Schadstoffe'+
                                        '</div>'+
                                        '<div class="kk_tropfen">'+
                                            'Kleidung, die Mensch & Natur gut tut'+
                                        '</div>'
                                        :
                                        '<img src="https://media.hessnatur.com/kk/2021/ps01-mobile/iconsgroup.svg">'
                                    )+
                                '</div>'+
                            '</div>'
                        );
            
                        var siegel = _self.qs(".certificateWrapper", productInfo);
    
                        if(siegel){
    
                            siegel.parentNode.classList.add('kk_siegel');
    
                            var siegelOrganic = _self.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]', siegel);
    
                            if(siegelOrganic){
    
                                siegelOrganic.setAttribute('src', 'https://media.hessnatur.com/kk/2021/ps01-mobile/organic.jpg'); // https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ps01/organic.jpg
                            }
                        }
                    }
                });
    
                // if(!isInteressent) {
    
                // Badges nur für Neukunde
                _self.elem(function(){
                    return favProducts.length > 0 && sehrgefragtProducts.length > 0;
                }, function(element){
                    if(element){
    
                        if(favProducts.indexOf(thisProductID) !== -1){
                            window.document.documentElement.classList.add('kk_favorit');
                        }
    
                        if(sehrgefragtProducts.indexOf(thisProductID) !== -1){
                            _self.elem('.pds-cockpit__wrapper', function(cockpitWrapper){
                                if(cockpitWrapper){
                                    cockpitWrapper[0].insertAdjacentHTML('afterbegin', 
                                        '<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>'
                                    );
                                }
                            });
                        }
                    }
                });
    
                // }
    
                if(document.URL.indexOf('.com/ch/') !== -1 === -1){

                    _self.elem('.pds-cockpit__addProductWrapper', function(addToCartBox){
                        if(addToCartBox){
                            addToCartBox[0].insertAdjacentHTML('afterend', 
                                '<div class="kk_cta_uvps">'+
                                    '<ul>'+
                                        '<li>Kostenlose Rücksendung</li>'+
                                        '<li>14 Tage Rückgaberecht</li>'+
                                        '<li>Versand aller Pakete mit DHL</li>'+
                                    '</ul>'+
                                '</div>'
                            );
                        }
                    });

                    goalPush('#kk_infoTabs .kk_carousel[data="Produktbeschreibung"]', "kk17_Produktbeschreibung");
                    goalPush('#kk_infoTabs .kk_carousel[data="Passform"]', "kk17_Passform");
                }
            } else {
    
                // Kategorieseite
                _self.elem('footer', function(prodWrapper){
    
                    if(prodWrapper){
                        
                        var allProds = getAllProducts();
                        
                        if(isInteressent && !_self.qs('.kk_hoechstequali')) {

                            // Interessent
                            var prod6 = allProds[4] || allProds[allProds.length-2] || allProds[allProds.length-1],
                                prod11 = allProds[8],
                                prod16 = allProds[14],
                                all3boxes = [
                                    '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_hoechstequali">'+
                                        '<div>'+
                                            '<div class="kk_content">'+
                                                '<img src="'+hessnaturLogo+'">'+
                                                '<h3>Qualität & Bewusstsein </h3>'+
                                                '<div>Verwendung kontrollierter Naturfasern</div>'+
                                                '<div>Höchste Qualität bei unseren Produkten</div>'+
                                                '<div>Mensch und Natur vor<br>Chemikalien schützen</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>',
                                    '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_nachteile">'+
                                        '<div>'+
                                            '<div class="kk_content">'+
                                                '<img src="'+hessnaturLogo+'">'+
                                                '<h3>Vorteile für Mensch & Natur</h3>'+
                                                '<div>Konsequente Einhaltung von Naturschutz und Fairness</div>'+
                                                '<div>Ein Herstellungsprozess mit ökologischer Verantwortung</div>'+
                                                '<div>Einhaltung des Umweltschutzes<br>(z.B. Abwasserkläranlagen)</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>',
                                    '<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_trage">'+
                                        '<div>'+
                                            '<div class="kk_content">'+
                                                '<img src="'+hessnaturLogo+'">'+
                                                '<h3>Tragekomfort & Verträglichkeit</h3>'+
                                                '<div>Verwendung von hautsympathischen Materialien</div>'+
                                                '<div>Verzicht auf belastende Chemikalien</div>'+
                                                '<div>Wertvolle Naturfasern<br>auf Ihrer Haut</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'
                                ];
    
                            // Zufällige Reihenfolge
                            for (var i = all3boxes.length - 1; i > 0; i--) {
    
                                var ramdomValue = Math.floor(Math.random() * (i + 1)),
                                    temp = all3boxes[i];
    
                                all3boxes[i] = all3boxes[ramdomValue];
                                all3boxes[ramdomValue] = temp;
                            }
                            
                            if(prod6 && !checkForKachelClass(prod6)){
                                prod6.insertAdjacentHTML('afterend', all3boxes[0]);
                            }
                            
                            if(prod11 && !checkForKachelClass(prod11)){
                                prod11.insertAdjacentHTML('afterend',  all3boxes[1]);
                            }
    
                            if(prod16 && !checkForKachelClass(prod16)){
                                prod16.insertAdjacentHTML('afterend',  all3boxes[2]);
                            }
                        }
    
                        // Neukunde
                        if(!isInteressent) {
                            _self.elem(function(){
                                return favProducts.length > 0 && sehrgefragtProducts.length > 0;
                            }, function(element){
                                if(element){
                                    var allProducts = _self.qsa(".dropdown-pane");

                                    for (var k = 0; k < allProducts.length; k++) {
                
                                        var thisProd = allProducts[k],
                                            thisID = parseInt(thisProd.getAttribute('id').substring(0,5));
                                        
                                        if(favProducts.indexOf(thisID) !== -1) {
                                            thisProd.classList.add('kk_fav');
                                        }

                                        if(sehrgefragtProducts.indexOf(thisID) !== -1) {
                                            thisProd.classList.add('kk_sehrgefragt');
                                        }
                                    }
                                }
                            });
                        }

                        // Sale Badge wird nach oben rechts verschoben
                        setBadgeToHead(allProds);

                        setTimeout(function(){
                            setBadgeToHead(getAllProducts());
                        }, 1000);
                    }
                });
            }
        }
        
        init();
    
        _self.ajax('productListJSON?products', function(){
    
            init();
        });
    };
	
})(window.WATO, window);