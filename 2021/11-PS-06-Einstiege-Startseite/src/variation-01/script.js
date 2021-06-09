// load core and global js
// @codekit-prepend "../global/global.js";

//@ code-kit append "request.min.js";
/**
 * @function
 * @author Christian Knoth
 * @namespace V1
 * @name Variation 01
 * @description
 * @info Slider Arrows sind seitens Hessnatur verändert worden, der Unterstrich bei "Alle Artikel für..." ist schwarz
 *  -> restliche Seite hält dies aber grau
 */
 (function (WATO) {
    "use strict";
    window.onresize=console.log("resizelol", document.body.innerWidth);
    document.addEventListener("resize", console.log("resize", document.body.innerWidth));

    function flexContainerAndResize(containerId){
        console.log("resize", document.body.innerWidth, "container",containerId);
        const vP=localStorage.getItem("Kk_Viewport");
        const container=jQuery(containerId+" .flickity-viewport .flickity-slider > div");
        var insertion='';

        if(document.body.innerWidth<=600 && vP=="isDesktop"){
            console.log("change to mobile");
            for(var i=0; i<container.length; i++){
                insertion=insertion.concat(
                '<div class="kk_productitem_popularity productitem text-center small-4 medium-3 large-2 columns">'+
                    container[i].innerHTML+
                    container[++i].innerHTML+
                '</div>'
                );
            }
            jQuery(containerId+" .flickity-viewport .flickity-slider").html(insertion);
        
            WATO.elem(containerId,function(newSlider){
                console.log("newslide", newSlider);
                initFlickity(newSlider[0]);
                localStorage.setItem("Kk_Viewport","isMobile");
            }); 
        }
        else if(document.body.innerWidth>600 && vP=="isMobile"){
            console.log("change to desktop");
            for(var j=0; j<container.length; j++){
                insertion=insertion.concat(
                '<div class="kk_productitem_popularity productitem text-center small-4 medium-3 large-2 columns">'+
                    container[j].innerHTML+
                '</div>'
                );
            }
            jQuery(containerId+" .flickity-viewport .flickity-slider").html(insertion);
        
            WATO.elem(containerId,function(newSlider){
                console.log("newslide", newSlider);
                initFlickity(newSlider[0]);
                localStorage.setItem("Kk_Viewport","isDesktop");
            }); 
        }

        var heightOfPopularitySlider = jQuery('.kk_productitem_popularity').height();
        jQuery("#kk_popularities_content .flickity-viewport").css("height", heightOfPopularitySlider+"px");
        
        
    }//

    function initFlickity(slide){
        const props={
            cellAlign: 'left',
            contain: true,
            pageDots: false
        }
        return new Flickity(slide,props);
    }

    function initKkHeadline(headlineId, headlineText){
        return(
            '<div id="'+headlineId+'" class="lpmTeaser__headline --cell-padding">'+
                '<p class="hn-headline hn-color-gray-800 hn-2xl large:hn-3xl">'+headlineText+'</p>'+
            '</div>'
        )
    }

    function initKkSliderContainer(contentId){
        return(
            '<div class="small-12 columns js-product-reference">'+
                '<div class="small-12 columns ">'+
                   '<div class="row js-productSliderWrapper h-xxLargeOffset-bottom-outer">'+
                       '<div class="column small-12 h-no-padding-medium-down">'+
                            '<div class="flickity-productslider kk_slider" id="'+contentId+'">'+
                                '...Loading'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>');
    }

    function insertHighlights(data) {

        var result = '';

        for(var category in data){
        var product = data[category]['response'];

        if (product) {
            
            var price=product['price'].toFixed(2);
            var prevPrice=product['price_prev'];
            var link=product['permalink'];
            var image=product['imageOnlyProduct'];
            var name=product['name'];

            var isNormal= "show";
            var isReduced= "";

            if(!prevPrice){
                isReduced="hide";
            }
            else{
                isNormal="hide";
                prevPrice.toFixed(2);
                }

               var mergedProducts='';
               var badges=data[category]['badges'];
               for(var index in badges){
                   mergedProducts+='<span class="kk_'+badges[index]+'">'+badges[index]+'</span><span>&nbsp;&nbsp;</span>';
                }

            result = result.concat(
                '<div class="kk_productitem_highlight productitem pro text-center small-5 medium-5 large-3 columns " style="position: absolute; left: 0%;">'+
                    '<a href='+link+' class="item__image"><img src='+image+'>'+
                         '<div class="item__desc h-smallOffset-top-outer">'+
                            '<div class="kk_badge kk_flex">'+
                                mergedProducts+
                            '</div>'+
                            '<h4 class="item_desc desc-name">'+ name +'</h4>'+
                            '<div class="desc-price kk_flex">'+
                                '<span class="price '+isReduced+' special full ">'+prevPrice+' €</span>'+
                                '<span class="'+isReduced+'">&nbsp;&nbsp;</span>'+
                                '<span class="price hide" style="margin-left: 3px">ab </span>'+
                                '<span class="price '+isReduced+' special">'+ price +' €</span>'+
                                '<span class="price light '+isNormal+'">'+ price+ ' €</span>'+
                                '<div class="product-basic-price basicPrice">'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</div>'
                );
            }
        }
        return result;
    }

    function insertPopularities(element){
        element[0].innerHTML='';
        var image='https://dev.web-arts.de/hessnatur/2021/11-PS-06-Einstiege-Startseite/src/variation-01/assets/popularity_filler.png';
        var link='https://www.hessnatur.com/de/damen/bekleidung/jacken-und-maentel/c/damen-bekleidung-jacken-maentel';
        
        for (var i=0;i<=7; i++){

            element[0].insertAdjacentHTML("afterbegin",
                '<div class="kk_productitem_popularity productitem text-center small-8 medium-5 large-2 columns " style="position: absolute; left: 0%;">'+
                    '<a href='+link+' class="item__image"><div class="kk_children_50"><img class="" src='+image+'></div>'+
                        '<div class="item__desc h-smallOffset-top-outer">'+
                            '<h4 class="hn-font bold">Kategorie '+i+'</h4>'+
                        '</div>'+
                    '</a>'+
                '</div>'
                    );
                
            }
            localStorage.setItem("Kk_Viewport","isDesktop");
        }

    var DATA={
        "damen":{
            "5126626ONE": {
                "badges": [
                    "neu",
                    "vegan",
                    "sales"
                ]  
                ,
                "response": {

                }
            },
            "5100536": {
                "badges": [
                    "neu",
                    "vegan",
                    "sales"
                ]  ,
                "response": {

                }
            },
            "5119730": {
                "badges": [
                    "neu",
                    "vegan",
                    "sales"
                ]  ,
                "response": {

                }
            },
            "5101809": {
                "badges": [
                    "neu",
                    "vegan",
                    "sales"
                ]  ,
                "response": {

                }
            },
            "5119501": {
                "badges": [
                    "neu",
                    "vegan",
                    "sales"
                ]  ,
                "response": {

                }
            }
        }
    },
    response=0;

    DATA=DATA.damen;
    WATO.elem(".lpmHero", function (headline) {

        if (headline) {


                headline[0].insertAdjacentHTML("afterend",
                    '<div id="kk_insertion">'+
                        '<div class="lpmSeparator">&nbsp;</div>'+
                        initKkHeadline("kk_highlights_header","Aktuelle Highlights")+
                        initKkSliderContainer("kk_highlights_content")+
                        initKkHeadline("kk_popular_header","Beliebte Kategorien")+
                        '<div id="kk_chosen_user" class="kk_container">'+
                            '<div><span class="hn-button-link kk_furtherArticles">Alle Artikel für Damen</span></div>'+
                        '<div/>'+
                        initKkSliderContainer("kk_popularities_content")+
                    '</div>');
        }
        });
        //TODO: Redundanz entfernen

    for(var id in DATA ){
        WATO.xhr_get("https://products.hessnatur.com/products/"+id, function (rawData) {

            var sku=rawData['products'][0]['sku'];
            DATA[sku].response=rawData['products'][0];
            response++;
        });
    }
    WATO.elem(function(){
        console.log(response, Object.keys(DATA).length, "objectkeys");
        return response===Object.keys(DATA).length;
    },
    function(done){
        if(done){
            WATO.elem(function(){
                return typeof window.Flickity !== "undefined";
            }, function(){        
                            WATO.elem('#kk_popularities_content',function(element){
                                if(element){
                                    insertPopularities(element);
                                        
                                    var slide=element[0];
                            
                                    initFlickity(slide);

                                    setTimeout(function(){
                                        flexContainerAndResize("#kk_popularities_content");
                                    }, 4000);
                                    $('window').resize(flexContainerAndResize("#kk_popularities_content"));
                                    //document.addEventListener('resize',flexContainerAndResize("#kk_popularities_content"));
                                    
                                }
                            });//first Slide
                
                            WATO.elem('#kk_highlights_content',function(element){
                                if(element){
                                    //removing Text: ...Loading
                                    element[0].innerHTML='';
                                    element[0].insertAdjacentHTML("afterbegin", insertHighlights(DATA));
                                    
                                    try {
                                            var slide=element[0];
                            
                                            initFlickity(slide);

                                            setTimeout(function(){
                                                var heightOfHighlightsSlider= jQuery('.kk_productitem_highlight').height();
                                                jQuery("#kk_highlights_content .flickity-viewport").css("height", heightOfHighlightsSlider+"px");
                                            }, 4000);//doku css alterntive


                                    }catch (error){
                                        console.log("Flickity failure: ", error);
                                    }
                                }
                            });//second slide
                });
            }//done
        });

        
    
        WATO.elem(".lpmSeparator", function(spaceing) {
            if(spaceing) {
            spaceing[1].style.display="none";
        }

    });

    /**
     * CSS Prefix 
     *
    document.documentElement.classList.add('specific-experiment-class');
    */

    /**
     * EXAMPLE - POLLING
     *
    WATO.elem(".btn-default", function(btnDefault) {

        if(btnDefault) {

        }
    });

    // POLLING MIT FUNKTION
    WATO.elem(function(){return window.numTest === 123;}, function(funcCallback) {

        if(funcCallback){

        }
    });
    */


    /**
     * EXAMPLE - MUTATION OBSERVER
     * 
     * MUSS ERST IN WATO AKTIVIERT WERDEN
     *
    // INIT MUTATION OBSERVER
    WATO.initObserver(function(error){

        console.log(error);
    });

    // FIND ELEMENT
    WATO.observer('.col-md-4', function(cols){

    });
    */


    /**
     * DOM READY
     *
    WATO.ready(function() {

    });
    */

    /**
     * EXAMPLE - Event
     *
    // with polling
    WATO.ev('#main-cta', 'click', function(){
        console.log("click it");
    });

    // without polling
    WATO.elem('#main-cta', function(elem){

        WATO.ev(elem[0], 'click', function(){
            console.log("click it");
        });
    });
    */

})(new window.WATO());