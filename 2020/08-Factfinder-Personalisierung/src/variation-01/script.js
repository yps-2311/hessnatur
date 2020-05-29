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

    // window.iridion.econda.push(["Sprint06", "V1"]);

    // function pushGoal(key, sendOnNextPageView){    
    //     if(sendOnNextPageView){
    //         window.iridion.push(['goal', key, '', true]);
    //     }else{
    //         window.iridion.push(['goal', key]);
    //     }
    // }
    // WATO.goalsFromCat();

    function getXHR(sendtype ,url, callback) {
        
        var XHR = new XMLHttpRequest();
    
        // Set up our request
        XHR.open(sendtype, url);
        
        // Add the required HTTP header for form data POST requests
        // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
        XHR.onreadystatechange = function() { // Call a function when the state changes.
            // console.log('this: ', this);
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                callback(this);
            }
        };
    
        // Finally, send our data.
        XHR.send();
    }

    console.log("Factfinder Test");

    WATO.elem('#search_form', function(search_form){
        if(search_form){
            search_form = search_form[0];

            var clone = search_form.cloneNode(true);

            clone.setAttribute('id','kk_newsearch');

            search_form.insertAdjacentHTML('afterend', 
                '<div id="kk_suggest_layer" class="suggest_layer">'+
                    '<div class="row search-results__list clearfix">'+
                        '<div class="search-results-container column small-6 -adjust-right">'+
                            '<div class="search-results__list--products">'+
                                '<div class="flyOut-headline -font-small search-results--inner-space h-no-margin-bottom">Produktvorschläge</div>'+
                                '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                                '<div id="kk_resultprods"></div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="search-results-container column small-6 -adjust-left">'+
                            '<ul class="search-results__list--content no-bullet">'+
                                '<li>'+
                                    '<div class="flyOut-headline -font-small search-results--inner-space h-no-margin-bottom">Kategorievorschläge</div>'+
                                    '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                                    '<ul id="kk_catvorschl" class="no-bullet search-results--inner-space">'+
                                        // '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?q=*%3Aproductgroup%3AHosen&amp;userInput=hose" title="Hosen" class="h-text-decoration-none-hover"><span class="h-text-decoration-underline">Hose</span>n<span class="suggestTextAmount"></span></a></span></li>'+
                                        // '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?q=*%3Aproductgroup%3AG%25C3%25BCrtel%252FHosentr%25C3%25A4ger&amp;userInput=hose" title="Gürtel/Hosenträger" class="h-text-decoration-none-hover">Gürtel/<span class="h-text-decoration-underline">Hose</span>nträger<span class="suggestTextAmount"></span></a></span></li>'+
                                    '</ul>'+
                                '</li>'+
                                '<li>'+
                                    '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer"><div class="flyOut-headline -font-small search-results--inner-space h-no-margin-bottom">Suchvorschläge</div><hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                                    '<ul id="kk_suchvorsch" class="no-bullet search-results--inner-space">'+
                                        '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/textillexikon/C/cargo-hose" title="Cargo-Hose" class="h-text-decoration-none-hover">Cargo-<span class="h-text-decoration-underline">Hose</span><span class="suggestTextAmount"></span></a></span></li>'+
                                        '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/textillexikon/F/flatfront-hose" title="Flatfront-Hose" class="h-text-decoration-none-hover">Flatfront-<span class="h-text-decoration-underline">Hose</span><span class="suggestTextAmount"></span></a></span></li>'+
                                        '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/textillexikon/M/marlene-hose" title="Marlene-Hose" class="h-text-decoration-none-hover">Marlene-<span class="h-text-decoration-underline">Hose</span><span class="suggestTextAmount"></span></a></span></li>'+
                                        '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?text=HOSE&amp;userInput=hose" title="HOSE" class="h-text-decoration-none-hover"><span class="h-text-decoration-underline">HOSE</span><span class="suggestTextAmount">(97 Produkte)</span></a></span></li>'+
                                    '</ul>'+
                                '</li>'+
                            '</ul>'+
                            '<div class="search-results__list--teaser search-results--inner-space">'+
                            '</div>'+
                        '</div>'+
                        '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                    '</div>'+
                    '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                    '<div class="show-results text-center">'+
                        '<a href="/de/search?text=hose" class="h-text-uppercase h-text-bold">Alle Ergebnisse für „hose” anzeigen</a>'+
                    '</div>'+
                '</div>'
            );

            var productsPlace = WATO.qs("#kk_resultprods", search_form.parentNode),
                kategorieVorschlaege = WATO.qs("#kk_catvorschl", search_form.parentNode),
                suchvorschlaege = WATO.qs("#kk_suchvorsch", search_form.parentNode);

            clone.addEventListener('keyup', function(e){
                e.preventDefault();

                var thisVal = e.target.value;

                if(thisVal.length > 2){
                    getXHR("GET","https://ffbackoffice.hessnatur.com/FF73-Query/Suggest.ff?username=hessnatur&password=d6648543b7ec3c456e38f93d7187a9d8&channel=LIVE-DE-Online-de&format=json&query="+thisVal, function(callbackContent) {
                        var responseJSON = JSON.parse(callbackContent.responseText);
                        console.log('responseJSON: ', responseJSON);

                        var prodMarkup = "",
                            katMarkup = "",
                            suchMarkup = "";

                        for (var i = 0; i < responseJSON.suggestions.length; i++) {
                            try {
                                var thisProd = responseJSON.suggestions[i];

                                if(thisProd.type === "productName"){
                                    var name = thisProd.name;
                                
                                    prodMarkup += '<ul class="prod_list no-bullet">'+
                                                        '<a href="/de'+thisProd.attributes.deeplink+'" title="'+name+'">'+
                                                        '<ul class="no-bullet h-list--horizontal search-results--inner-space">'+
                                                        '<li class="flyout-image">'+
                                                            '<img src="'+thisProd.image+'" alt="'+name+'" width="69px">'+
                                                        '</li>'+
                                                        '<li class="flyOut-item-headline">'+name+'</li>'+
                                                    '</ul>'+
                                                    '</a>'+
                                                    '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">';

                                }else if(thisProd.type === "category"){
                                    
                                    var searchquery = thisProd.searchParams.split("query=*")[1].split("&channel")[0];

                                    katMarkup += '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?q='+thisProd.name+searchquery+'&amp;userInput='+thisProd.name+'" title="Hosen" class="h-text-decoration-none-hover"><span class="h-text-decoration-underline">'+thisProd.name+'</span>n<span class="suggestTextAmount"></span></a></span></li>';

                                }
                            } catch (error) {
                                console.log('Error: ', error);
                            }
                        }

                        productsPlace.innerHTML = prodMarkup;

                        kategorieVorschlaege.innerHTML = katMarkup;

                        suchvorschlaege.innerHTML = suchMarkup;
                    });
                }
            });

            search_form.insertAdjacentElement('afterend', clone);

            
            
        }
    });
    

})(new window.WATO());



// var x = {
//     "suggestions": 
//     [{
//         "attributes": {
//             "masterId": "47589",
//             "basecode": "47589",
//             "price": "89.95",
//             "lineType": "P",
//             "deeplink": "/p/475891748",
//             "id": "47589"
//         },
//         "hitCount": 0,
//         "image": "https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_layer_thumb/Hose_Slim_Fit_aus_Bio_Baumwolle-47589_17_1.jpg",
//         "name": "Hose Slim Fit aus Bio-Baumwolle",
//         "searchParams": "/FF73-Query/Search.ff?text=Hose+Slim+Fit+aus+Bio-Baumwolle\u0026channel=LIVE-DE-Online-de",
//         "type": "productName"
//     }, {
//         "attributes": {
//             "masterId": "49363",
//             "basecode": "49363",
//             "price": "179.95",
//             "lineType": "P",
//             "deeplink": "/p/493631146",
//             "id": "49363"
//         },
//         "hitCount": 0,
//         "image": "https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_layer_thumb/Hose_aus_reinem_Bio_Leinen-49363_11_1.jpg",
//         "name": "Hose aus reinem Bio-Leinen",
//         "searchParams": "/FF73-Query/Search.ff?text=Hose+aus+reinem+Bio-Leinen\u0026channel=LIVE-DE-Online-de",
//         "type": "productName"
//     }, {
//         "attributes": {
//             "masterId": "46977",
//             "basecode": "46977",
//             "price": "59.95",
//             "lineType": "P",
//             "deeplink": "/p/469776948",
//             "id": "46977"
//         },
//         "hitCount": 0,
//         "image": "https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_layer_thumb/Hose_aus_Bio_Baumwolle_und_TENCEL_Modal-46977_69_1.jpg",
//         "name": "Hose aus Bio-Baumwolle und TENCEL\u0022Modal",
//         "searchParams": "/FF73-Query/Search.ff?text=Hose+aus+Bio-Baumwolle+und+TENCEL%27%27Modal\u0026channel=LIVE-DE-Online-de",
//         "type": "productName"
//     }, {
//         "attributes": {
//             "masterId": "49372",
//             "basecode": "49372",
//             "price": "89.95",
//             "lineType": "P",
//             "deeplink": "/p/493729348",
//             "id": "49372"
//         },
//         "hitCount": 0,
//         "image": "https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_layer_thumb/Kurze_Hose_aus_reiner_Bio_Baumwolle-49372_93_1.jpg",
//         "name": "Kurze Hose aus reiner Bio-Baumwolle",
//         "searchParams": "/FF73-Query/Search.ff?text=Kurze+Hose+aus+reiner+Bio-Baumwolle\u0026channel=LIVE-DE-Online-de",
//         "type": "productName"
//     }, {
//         "attributes": {
//             "masterId": "48698",
//             "basecode": "48698",
//             "price": "129.95",
//             "lineType": "P",
//             "deeplink": "/p/486989348",
//             "id": "48698"
//         },
//         "hitCount": 0,
//         "image": "https://imgs7.hessnatur.com/is/image/HessNatur/hyb_redes_layer_thumb/Hose_aus_Bio_Baumwolle_mit_Leinen-48698_93_1.jpg",
//         "name": "Hose aus Bio-Baumwolle mit Leinen",
//         "searchParams": "/FF73-Query/Search.ff?text=Hose+aus+Bio-Baumwolle+mit+Leinen\u0026channel=LIVE-DE-Online-de",
//         "type": "productName"
//     }, {
//         "attributes": {
//             "sourceField": "productgroup",
//             "parentCategory": ""
//         },
//         "hitCount": 0,
//         "image": "",
//         "name": "Hosen",
//         "searchParams": "/FF73-Query/Search.ff?text=*\u0026filterproductgroup=Hosen\u0026channel=LIVE-DE-Online-de",
//         "type": "category"
//     }, {
//         "attributes": {
//             "sourceField": "productgroup",
//             "parentCategory": ""
//         },
//         "hitCount": 0,
//         "image": "",
//         "name": "Gürtel/Hosenträger",
//         "searchParams": "/FF73-Query/Search.ff?text=*\u0026filterproductgroup=G%C3%BCrtel%2FHosentr%C3%A4ger\u0026channel=LIVE-DE-Online-de",
//         "type": "category"
//     }, {
//         "attributes": {
//             "link": "/textillexikon/C/cargo-hose"
//         },
//         "hitCount": 0,
//         "image": "",
//         "name": "Cargo-Hose",
//         "searchParams": "/FF73-Query/Search.ff?text=Cargo-Hose\u0026channel=LIVE-DE-Online-de",
//         "type": "content"
//     }, {
//         "attributes": {
//             "link": "/textillexikon/F/flatfront-hose"
//         },
//         "hitCount": 0,
//         "image": "",
//         "name": "Flatfront-Hose",
//         "searchParams": "/FF73-Query/Search.ff?text=Flatfront-Hose\u0026channel=LIVE-DE-Online-de",
//         "type": "content"
//     }, {
//         "attributes": {
//             "link": "/textillexikon/M/marlene-hose"
//         },
//         "hitCount": 0,
//         "image": "",
//         "name": "Marlene-Hose",
//         "searchParams": "/FF73-Query/Search.ff?text=Marlene-Hose\u0026channel=LIVE-DE-Online-de",
//         "type": "content"
//     }, {
//         "attributes": {},
//         "hitCount": 99,
//         "image": "",
//         "name": "HOSE",
//         "searchParams": "/FF73-Query/Search.ff?text=HOSE\u0026channel=LIVE-DE-Online-de",
//         "type": "searchTerm"
//     }, {
//         "attributes": {},
//         "hitCount": 1,
//         "image": "",
//         "name": "SOMMER HOSE DAMEN",
//         "searchParams": "/FF73-Query/Search.ff?text=SOMMER+HOSE+DAMEN\u0026channel=LIVE-DE-Online-de",
//         "type": "searchTerm"
//     }, {
//         "attributes": {},
//         "hitCount": 1,
//         "image": "",
//         "name": "STOFF HOSE",
//         "searchParams": "/FF73-Query/Search.ff?text=STOFF+HOSE\u0026channel=LIVE-DE-Online-de",
//         "type": "searchTerm"
//     }]
// }