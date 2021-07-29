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

    // window.iridion.econda.push(["SprintPS01", "V1"]);

    function iridionProfile(thisName, thisvalue) {
		if(thisvalue){
			window.iridion.push(['profile', 'setValue', thisName, JSON.stringify(thisvalue)]);
		}else{
			return window.iridion.push(['profile', 'getValue', thisName]);
		}
	}

    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1,
        hessnaturLogo = "https://media.hessnatur.com/kk/100Prozent/ps01/boxlogo.svg?format=svg", //"https://www.hessnatur.com/medias/sys_master/images/images/hcc/hed/8967611056158/hessnatur-Logo-1c.svg",
        isPDS = window.document.location.pathname.indexOf("/p/") !== -1,
        // 3 Monate
        favProducts = [], //[43309,47936,43309,42668,47936,50518,22219,40738,70870,22215,47779,42678,47505,49306,49551,50205,40745,22838,50285,42483,50367,48305,50566,42962,42678,42384,50571,50204,43069,50532,50135,43311,50136,42746,99999,70870,50477,47589,50249,49049,48383,49609,50364,50701,48036,50522,50365,50256,50562,44477,48435,46272,45683,55280,50377,50562,50133,51264,42746,50132,43342,49321,47681,50258,70180,46272,42745,55280,22224,44699,98700,49149,42766,50476,49255,43328,49481,17646,49381,39939,42147,43342,50046,47387,51292,18424,50523,49036,48305,50447,47029,39996,20051,50214,38034,50238,50224,47039,47244,42384];
        sehrgefragtProducts = [];
        
    // console.log('alt favProducts: ', favProducts);
        
    // 14 Tage (Topseller DE_14Tage-20210111)
    // workaround ab 19
    // window.sehrgefragtProducts = [47936,43309,42668,50041,42746,70870,42384,49609,42678,49049,42747,22219,43319,50046,41739,49038,50377,49551,49597,48305,49046,49321,45683,42745,50964,22215,51264,50043,50038,50035,17646,55280,22224,50575,50562,16159,50493,18424,70180,42601,49255,43342,39996,51026,41741,48835,43069,44477,50311,50565,49598,51292,50041,36986,50181,50472,49837,48036,49692,46272,49839,49045,44699,42483,39996,44698,48306,42722,47039,49598,42600,48017,42144,49686,38034,48383,49688,50629,72010,51186,42127,44697,47022,49101,50472,50127,42129,49842,50046,50204,48435,46239,50128,50404,47387,50655,45532,45683,99999,50563];

    if(sessionStorage.getItem("kk_favForSession")){
        favProducts = JSON.parse(iridionProfile("favProducts"));
        sehrgefragtProducts = JSON.parse(iridionProfile("sehrgefragtProducts"));
    }else{
        WATO.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=131&csize=50&start=0&type=cs&widgetdetails=true", function(data) {
            favProducts = [];
            var allItems = JSON.parse(data).items;
            for (var i = 0; i < allItems.length; i++) {
                favProducts.push(parseInt(allItems[i].id));
            }
            iridionProfile("favProducts", favProducts);
            sessionStorage.setItem("kk_favForSession", true);
        });

        WATO.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=132&csize=50&start=0&type=cs&widgetdetails=true", function(data) {
            sehrgefragtProducts = [];
            var allItems = JSON.parse(data).items;
            for (var i = 0; i < allItems.length; i++) {
                sehrgefragtProducts.push(parseInt(allItems[i].id));
            }
            iridionProfile("sehrgefragtProducts", sehrgefragtProducts);
            sessionStorage.setItem("kk_favForSession", true);
        });
    }
   

    // Anpassung MV
    // Verstehe die Logik nicht. Habe diese nach Rücksprache mit Jenny angepasst. 
    // if ((!window.iridion.push(['hasSegment', "32812"])) && (!window.iridion.push(['hasSegment', "32813"]))) {
    //     window.iridion.push(["segment", (isInteressent ? "32812" : "32813")]);
    // }
    if(isInteressent){

        window.iridion.push(["segment", "32812"]);
    } else {
        
        window.iridion.push(["segment", "-32812"]);
        window.iridion.push(["segment", "32813"]);
    }
    
    // WATO.exclude(1024, WATO.reload);
    ;

    function checkForKachelClass(elem) {
        try {
            return elem.nextElementSibling ? elem.nextElementSibling.classList.contains('kk_kachel') : false;
        } catch (error) {
            return false;
        }
    }

    function init() {

        if(isPDS){

            // PDS
            var thisProductID = parseInt(window.location.pathname.split("/p/")[1].substring(0,5));

            WATO.elem('.small-12 > .small-collapse.medium-uncollapse.large-uncollapse', function(contentArea){

                if(contentArea){

                    var productInfo = contentArea[0];

                    productInfo.insertAdjacentHTML('afterbegin', 
                        '<div class="kk_quali">'+
                            '<h4 class="kk_hl">'+
                                '<span>Natürliche Qualität für Ihr Wohlbefinden</span>'+
                            '</h4>'+
                            '<div class="kk_natur">'+
                                'Naturfasern in höchster<br>Qualität'+
                            '</div>'+
                            '<div class="kk_stuecke">'+
                                'Besonderer Tragekomfort &<br>Verzicht auf Schadstoffe'+
                            '</div>'+
                            '<div class="kk_tropfen">'+
                                'Kleidung, die Mensch & Natur<br>gut tut'+
                            '</div>'+
                        '</div>'
                    );
        
                    var siegel = WATO.qs(".certificateWrapper", productInfo);

                    if(siegel){

                        siegel.parentNode.classList.add('kk_siegel');

                        var siegelOrganic = WATO.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]', siegel);

                        if(siegelOrganic){

                            siegelOrganic.setAttribute('src', 'https://media.hessnatur.com/kk/100Prozent/ps01/organic.jpg');
                        }
                    }
                }
            });

            // if(!isInteressent) {

            // Badges nur für Neukunde
            WATO.elem(function(){
                return favProducts.length > 0 && sehrgefragtProducts.length > 0;
            }, function(element){
                if(element){

                    if(favProducts.indexOf(thisProductID) !== -1){
                        window.document.documentElement.classList.add('kk_favorit');
                    }

                    if(sehrgefragtProducts.indexOf(thisProductID) !== -1){
                        WATO.elem('.js-price-container', function(priceContainer){
                            if(priceContainer){
                                priceContainer[0].insertAdjacentHTML('afterend', 
                                    '<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>'
                                );
                            }
                        });
                    }
                }
            });

            // }

            WATO.elem('.pds-cockpit__addProductWrapper', function(addToCartBox){
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

        } else {

            // Kategorieseite
            WATO.elem('footer', function(prodWrapper){

                if(prodWrapper){

                    var allProds = WATO.qsa(".js-product-grid > .gridviewProductItemWrapper");
                    
                    if(isInteressent && !WATO.qs('.kk_hoechstequali')) {

                        // Interessent
                        var prod6 = allProds[4] || allProds[allProds.length-2] || allProds[allProds.length-1],
                            prod9 = allProds[7],
                            prod15 = allProds[13],
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

                            var j = Math.floor(Math.random() * (i + 1)),
                                temp = all3boxes[i];

                            all3boxes[i] = all3boxes[j];
                            all3boxes[j] = temp;
                        }
                        
                        if(prod6 && !checkForKachelClass(prod6)){
                            prod6.insertAdjacentHTML('afterend', all3boxes[0]);
                        }
                        
                        if(prod9 && !checkForKachelClass(prod9)){
                            prod9.insertAdjacentHTML('afterend',  all3boxes[1]);
                        }

                        if(prod15 && !checkForKachelClass(prod15)){
                            prod15.insertAdjacentHTML('afterend',  all3boxes[2]);
                        }
                    }

                    // Neukunde
                    if(!isInteressent) {
                        WATO.elem(function(){
                            return favProducts.length > 0 && sehrgefragtProducts.length > 0;
                        }, function(element){
                            if(element){
                                var allProducts = WATO.qsa(".dropdown-pane");

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
                }
            });
        }
    }
    
    init();

    WATO.ajax('productListJSON?products', function(){

        init();
    });

})(new window.WATO(), window);




// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,i,r,s){var o,a=this||r,d=s||Date.now(),c=!1;return Date.now()-d>1e4?(n(!1),!1):("string"==typeof e?c=(o=t.querySelectorAll(e)).length>0:o=c=!0===e(),!0===c?n(o):setTimeout(a.elem.bind(null,e,n,i,a,d),i||20))},e.WATO.prototype.qs=function(e,n,i,r){var s=(n||t).querySelector(e);return s?"function"==typeof i&&i(s):"function"==typeof r&&r(),s},e.WATO.prototype.qsa=function(e,n,i,r){var s=(n||t).querySelectorAll(e);return s?"function"==typeof i&&i(s):"function"==typeof r&&r(),s},e.WATO.prototype.ready=function(e){(t.attachEvent?"complete"===t.readyState:"loading"!==t.readyState)?e():t.addEventListener("DOMContentLoaded",e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(i,r,s,o,a){this.addEventListener("loadend",(function(){4===this.readyState&&-1!==r.indexOf(e)&&"function"==typeof t&&t()}),!1),n.call(this,i,r,s,o,a)}},e.WATO.prototype.setCookie=function(e,n,i,r){var s=new Date;s.setDate(s.getDate()+365),t.cookie=e+"="+encodeURIComponent(n)+";"+(r?"":"expires="+s.toUTCString()+";")+"domain="+i+";path=/"},e.WATO.prototype.exclude=function(n,i){function r(){(e.innerWidth||t.body.clientWidth)<=n&&!s&&(s=!0,i())}var s=!1;r(),"function"==typeof i&&(e.onresize=function(){r()})},e.WATO.prototype.reload=function(){location.reload(),location.href=location.href.split("#")[0]},e.WATO.prototype.xhr_get=function(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.onload=function(){if(4===this.readyState&&this.status>=200&&this.status<400)try{t(this.response)}catch(e){t(!1)}else t(!1)},n.onerror=function(){t(!1)},n.send()}}(window,document),function(e,t){"use strict";function n(e,n){if(!n)return t.iridion.push(["profile","getValue",e]);t.iridion.push(["profile","setValue",e,JSON.stringify(n)])}var i=!t.localStorage.getItem("kk_hasbought")&&-1===document.location.search.indexOf("show=neukunde"),r="https://media.hessnatur.com/kk/100Prozent/ps01/boxlogo.svg",s=-1!==t.document.location.pathname.indexOf("/p/"),o=[],a=[];function d(e){try{return!!e.nextElementSibling&&e.nextElementSibling.classList.contains("kk_kachel")}catch(e){return!1}}function c(){if(s){console.log("isPDS: ",s);var n=parseInt(t.location.pathname.split("/p/")[1].substring(0,5));e.elem(".small-12 > .small-collapse.medium-uncollapse.large-uncollapse",(function(t){if(t){var n=t[0];n.insertAdjacentHTML("afterbegin",'<div class="kk_quali"><h4 class="kk_hl"><span>Natürliche Qualität für Ihr Wohlbefinden</span></h4><div class="kk_natur">Naturfasern in höchster<br>Qualität</div><div class="kk_stuecke">Besonderer Tragekomfort &<br>Verzicht auf Schadstoffe</div><div class="kk_tropfen">Kleidung, die Mensch & Natur<br>gut tut</div></div>');var i=e.qs(".certificateWrapper",n);if(i){i.parentNode.classList.add("kk_siegel");var r=e.qs('img[src="https://imgs7.hessnatur.com/is/content/HessNatur/Zertifikate/Zertifikat_GOTS.svg"]',i);r&&r.setAttribute("src","https://media.hessnatur.com/kk/100Prozent/ps01/organic.jpg")}}})),e.elem((function(){return o.length>0&&a.length>0}),(function(i){i&&(-1!==o.indexOf(n)&&t.document.documentElement.classList.add("kk_favorit"),-1!==a.indexOf(n)&&e.elem(".js-price-container",(function(e){e&&e[0].insertAdjacentHTML("afterend",'<div class="kk_gefragt"><b>Aktuell sehr gefragt!</b> Dieser Artikel verkauft sich schnell</div>')})))})),e.elem(".pds-cockpit__addProductWrapper",(function(e){e&&e[0].insertAdjacentHTML("afterend",'<div class="kk_cta_uvps"><ul><li>Kostenlose Rücksendung</li><li>14 Tage Rückgaberecht</li><li>Versand aller Pakete mit DHL</li></ul></div>')}))}else e.elem("footer",(function(t){if(t){var n=e.qsa(".js-product-grid > .gridviewProductItemWrapper");if(console.log("isInteressent: ",i),i&&!e.qs(".kk_hoechstequali")){for(var s=n[4]||n[n.length-2]||n[n.length-1],c=n[7],l=n[13],u=['<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_hoechstequali"><div><div class="kk_content"><img src="'+r+'"><h3>Qualität & Bewusstsein </h3><div>Verwendung kontrollierter Naturfasern</div><div>Höchste Qualität bei unseren Produkten</div><div>Mensch und Natur vor<br>Chemikalien schützen</div></div></div></div>','<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_nachteile"><div><div class="kk_content"><img src="'+r+'"><h3>Vorteile für Mensch & Natur</h3><div>Konsequente Einhaltung von Naturschutz und Fairness</div><div>Ein Herstellungsprozess mit ökologischer Verantwortung</div><div>Einhaltung des Umweltschutzes<br>(z.B. Abwasserkläranlagen)</div></div></div></div>','<div class="gridviewProductItemWrapper column js-product-grid-item kk_kachel kk_trage"><div><div class="kk_content"><img src="'+r+'"><h3>Tragekomfort & Verträglichkeit</h3><div>Verwendung von hautsympathischen Materialien</div><div>Verzicht auf belastende Chemikalien</div><div>Wertvolle Naturfasern<br>auf Ihrer Haut</div></div></div></div>'],f=u.length-1;f>0;f--){var p=Math.floor(Math.random()*(f+1)),h=u[f];u[f]=u[p],u[p]=h}s&&!d(s)&&s.insertAdjacentHTML("afterend",u[0]),c&&!d(c)&&c.insertAdjacentHTML("afterend",u[1]),l&&!d(l)&&l.insertAdjacentHTML("afterend",u[2])}i||e.elem((function(){return o.length>0&&a.length>0}),(function(t){if(t)for(var n=e.qsa(".dropdown-pane"),i=0;i<n.length;i++){var r=n[i],s=parseInt(r.getAttribute("id").substring(0,5));-1!==o.indexOf(s)&&r.classList.add("kk_fav"),-1!==a.indexOf(s)&&r.classList.add("kk_sehrgefragt")}}))}}))}sessionStorage.getItem("kk_favForSession")?(o=JSON.parse(n("favProducts")),console.log("1 favProducts: ",o),a=JSON.parse(n("sehrgefragtProducts")),console.log("1 sehrgefragtProducts: ",a)):(e.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=131&csize=50&start=0&type=cs&widgetdetails=true",(function(e){o=[];for(var t=JSON.parse(e).items,i=0;i<t.length;i++)o.push(parseInt(t[i].id));n("favProducts",o),sessionStorage.setItem("kk_favForSession",!0)})),e.xhr_get("https://widgets.crosssell.info/eps/crosssell/recommendations.do?aid=00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1&wid=132&csize=50&start=0&type=cs&widgetdetails=true",(function(e){a=[];for(var t=JSON.parse(e).items,i=0;i<t.length;i++)a.push(parseInt(t[i].id));n("sehrgefragtProducts",a),sessionStorage.setItem("kk_favForSession",!0)}))),i?t.iridion.push(["segment","32812"]):(t.iridion.push(["segment","-32812"]),t.iridion.push(["segment","32813"])),c(),e.ajax("productListJSON?products",(function(){c()}))}(new window.WATO,window);