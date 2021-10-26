// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";

    function pushGoal(key) {
        window.iridion.push(['goal', 's5_' + key]);
    }

    // Element entfernen
    function removeObject(el) {
        if(el){
            el.parentNode.removeChild(el);
        }
    }

    function getLastChildrens(obj) {
        // Gibt die Childrens des letzes Menüs zurück die nicht folgenden Klassen ensprechen
        var allLi = obj[obj.length-1].children,
            newLis = [];
        for (var k = 0; k < allLi.length; k++) {
            var thisLi = allLi[k];
            if(!thisLi.classList.contains(".h-text-decoration-none-hover") && 
                !thisLi.classList.contains(".h-text-uppercase") && 
                !thisLi.classList.contains(".is-drilldown-submenu-parent") && 
                !thisLi.classList.contains(".is-drilldown-submenu-item")){
                newLis.push(thisLi);
            }
        }
        return newLis;
    }

    // Breadcrumb wird umgebaut
    WATO.elem('.breadcrumbs.h-no-margin', function(breadcrumbs){
        if(breadcrumbs){
            // Die Originale aus der Desktopansicht wird an den Platz der Mobileansicht verschoben
            var originalBreadcrumb = breadcrumbs[0],
                allBreadcrumbLi = WATO.qsa("li", originalBreadcrumb);

            // Der erste Menüpunkt wird entfernt (in dem Fall Startseite)
            if(allBreadcrumbLi.length >= 3) {
                removeObject(allBreadcrumbLi[0]);
            }
            
            // Der Link der aktiven Kategorie soll nicht klickbar sein (zweite Zeile in fett)
            var temp = WATO.qs("a", allBreadcrumbLi[allBreadcrumbLi.length-1]);
            if(temp){
                temp.removeAttribute("href");
            }

            WATO.elem(".gridviewProductFilterMobileWrapper .breadcrumb--back", function(el){
                el[0].insertAdjacentHTML('afterend', originalBreadcrumb.innerHTML);
            });
        }
    });

    // Der Filter hat eine Mengenangabe diese wird umgebaut um sie desinersich anzupassen
    WATO.elem('#tabFilter-label strong', function(filter){
        if(filter){
            filter = filter[0];

            var filterInnerHTML = filter.innerHTML,
            filterCount0 = filter.innerHTML.indexOf('(0)') !== -1;

            filter.innerHTML = filterInnerHTML.replace("(","<span "+((filterCount0) ? 'style="display:none;"' : '' )+">").replace(")","</span>");
        }
    });

    WATO.elem('.gridviewProductFilterMobileWrapper .toggleFilter', function(afterBreadcrumb){
        if(afterBreadcrumb){
            afterBreadcrumb = afterBreadcrumb[0];

            // Slider einbauen
            afterBreadcrumb.insertAdjacentHTML('afterend', '<div class="kk_subfilters"><ul></ul></div>');

            // console.log('afterBreadcrumb: ', afterBreadcrumb);

            // Aktiviertes Menü
            WATO.elem('#offCanvasNavigation .js-drilldown-active', function(activeMenue){
                if(activeMenue){
                    // Die Untermenüpunkte
                    // console.log('activeMenue: ', activeMenue);

                    // var submenuQuery = ".is-submenu-item:not(.h-text-decoration-none-hover):not(.h-text-uppercase):not(.is-drilldown-submenu-parent)";

                    WATO.elem(function(){
                        // Warten bis untermenüpunkte vorhanden sind
                        return getLastChildrens(activeMenue).length > 0;
                    }, function(element){
                        if(element){

                            // var submenu = WATO.qsa(submenuQuery, activeMenue[activeMenue.length-1]);
                            var submenu = getLastChildrens(activeMenue),
                                newFilterbar = WATO.qs(".kk_subfilters ul", afterBreadcrumb.parentNode);

                            // console.log('submenu: ', submenu);
                            // console.log('newFilterbar: ', newFilterbar);
    
                            if(submenu && newFilterbar){
                                /*jshint loopfunc: true */

                                // Die geklonten Untermenüpunkte werden in den Slider eingebaut
                                for (var i = 0; i < submenu.length; i++) {
                                    var sub = submenu[i],
                                    sub_new = sub.cloneNode(true);

                                    sub.setAttribute('data-kkindex', i);
                                    sub_new.setAttribute('data-kkindex', i);
                                    sub_new.classList.add('kkindex');

                                    sub_new.onclick = function(){};

                                    sub_new.addEventListener('click', function(){
                                        pushGoal('subentry');

                                        var kkindex = this.getAttribute('data-kkindex');

                                        // console.log(this);
                                        // console.log(this.getAttribute('data-kkindex'));
                                        // console.log('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label');
                                        // console.log(WATO.qs('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label'));

                                        WATO.qs('li:not(.kkindex)[data-kkindex="'+kkindex+'"] label').click();
                                    });

                                    newFilterbar.insertAdjacentElement('beforeend', sub_new);
                                }
                            }else{
                                // ErrorGoal
                                pushGoal('setup');
                                // alert('polling timeout 4');
                            }
                        }
                        else {
                            pushGoal('setup');
                            // alert('polling timeout 3');
                        }
                    });
                }
                else {
                    pushGoal('setup');
                    // alert('polling timeout 2');
                }
            });
        }
        else {
            pushGoal('setup');
            // alert('polling timeout');
        }
    });

    WATO.elem('a[data-toggle="drop_pane_FFassortment"]', function(sortimentFilter){
        if(sortimentFilter) {
            sortimentFilter[0].parentNode.style.display = 'none';
        }
    });

    WATO.goalsFromCat();

})(new window.WATO());

// !function(e,t){"use strict";void 0===e.WATO&&(e.WATO=function(){}),e.WATO.prototype.elem=function(e,n,i,r,o){var a,l=this||r,s=o||Date.now(),u=false;if(Date.now()-s>2e4)return n(false),false;return"string"==typeof e?u=(a=t.querySelectorAll(e)).length>0:a=u=true===e(),true===u?n(a):setTimeout(l.elem.bind(null,e,n,i,l,s),i||20)},e.WATO.prototype.qs=function(e,n){return(n||t).querySelector(e)},e.WATO.prototype.qsa=function(e,n){return(n||t).querySelectorAll(e)},e.WATO.prototype.ajax=function(e,t){var n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(i,r,o,a,l){this.addEventListener("loadend",function(){4===this.readyState&&-1!==r.indexOf(e)&&t(r)},false),n.call(this,i,r,o,a,l)}},e.WATO.prototype.exclude=function(n,i){function r(){(e.innerWidth||t.body.clientWidth)<=n&&!o&&(o=true,i())}var o=false;r(),"function"==typeof i&&(e.onresize=function(){r()})}}(window,document),function(e){"use strict";e.prototype.goalPush=function(e,t){t?window.iridion.push(["goal",e,"",true]):window.iridion.push(["goal",e])},e.prototype.goalsFromCat=function(){var e=this;e.elem("#tabSort .changeArticleView label",function(t){t&&t[0].addEventListener("change",function(){e.goalPush("sortierung_geaendert")})}),e.elem("#tabFilter .js-filter-apply",function(t){t&&t[0].addEventListener("click",function(){e.goalPush("filter_genutzt")})})}}(window.WATO),function(e){"use strict";function t(e){window.iridion.push(["goal","s5_"+e])}function n(e){for(var t=e[e.length-1].children,n=[],i=0;i<t.length;i++){var r=t[i];r.classList.contains(".h-text-decoration-none-hover")||r.classList.contains(".h-text-uppercase")||r.classList.contains(".is-drilldown-submenu-parent")||r.classList.contains(".is-drilldown-submenu-item")||n.push(r)}return n}e.elem(".breadcrumbs.h-no-margin",function(t){if(t){var n=t[0],i=e.qsa("li",n);i.length>=3&&(r=i[0])&&r.parentNode.removeChild(r),e.qs("a",i[i.length-1]).removeAttribute("href"),e.elem(".gridviewProductFilterMobileWrapper .breadcrumb--back",function(e){e[0].insertAdjacentHTML("afterend",n.innerHTML)})}var r}),e.elem("#tabFilter-label strong",function(e){if(e){var t=(e=e[0]).innerHTML,n=-1!==e.innerHTML.indexOf("(0)");e.innerHTML=t.replace("(","<span "+(n?'style="display:none;"':"")+">").replace(")","</span>")}}),e.elem(".gridviewProductFilterMobileWrapper .toggleFilter",function(i){i?((i=i[0]).insertAdjacentHTML("afterend",'<div class="kk_subfilters"><ul></ul></div>'),e.elem("#offCanvasNavigation .js-drilldown-active",function(r){r?e.elem(function(){return n(r).length>0},function(o){if(o){var a=n(r),l=e.qs(".kk_subfilters ul",i.parentNode);if(a&&l)for(var s=0;s<a.length;s++){var u=a[s],c=u.cloneNode(true);u.setAttribute("data-kkindex",s),c.setAttribute("data-kkindex",s),c.classList.add("kkindex"),c.onclick=function(){},c.addEventListener("click",function(){t("subentry");var n=this.getAttribute("data-kkindex");e.qs('li:not(.kkindex)[data-kkindex="'+n+'"] label').click()}),l.insertAdjacentElement("beforeend",c)}else t("setup")}else t("setup")}):t("setup")})):t("setup")}),e.elem('a[data-toggle="drop_pane_FFassortment"]',function(e){e&&(e[0].parentNode.style.display="none")}),e.goalsFromCat()}(new window.WATO);