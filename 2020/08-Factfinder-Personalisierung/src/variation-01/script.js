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

    /*jshint loopfunc: true */

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

    var factfiderLogin = "username=hessnatur&password=d6648543b7ec3c456e38f93d7187a9d8&channel=LIVE-DE-Online-de&";

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
                                    '</ul>'+
                                '</li>'+
                                '<li>'+
                                    '<hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer"><div class="flyOut-headline -font-small search-results--inner-space h-no-margin-bottom">Suchvorschläge</div><hr class="color-medium-light-gray h-noneOffset-top-outer h-noneOffset-bottom-outer">'+
                                    '<ul id="kk_suchvorsch" class="no-bullet search-results--inner-space">'+
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
                        '<a id="kk_direktsuche" href="/de/search" class="h-text-uppercase h-text-bold"></a>'+
                    '</div>'+
                '</div>'
            );

            var searchLayer = WATO.qs("#kk_suggest_layer", search_form.parentNode),
                productsPlace = WATO.qs("#kk_resultprods", searchLayer),
                kategorieVorschlaege = WATO.qs("#kk_catvorschl", searchLayer),
                suchvorschlaege = WATO.qs("#kk_suchvorsch", searchLayer),
                direktsuche = WATO.qs("#kk_direktsuche", searchLayer),
                inputWait = false;

                function underlineAccordance(textString, searchText) {
                    var underlineStart = textString.toLowerCase().indexOf(searchText);
                    return (textString.substring(0, underlineStart) + '<span class="h-text-decoration-underline">' + textString.substring(underlineStart, (underlineStart+searchText.length)) + '</span>' + textString.substring((underlineStart+searchText.length), textString.length));
                }

            clone.addEventListener('keyup', function(e){
                e.preventDefault();

                inputWait = true;

                setTimeout(function(){

                    if(inputWait){

                        var thisVal = e.target.value.toLowerCase();

                        if(thisVal.length > 1){

                            getXHR("GET","https://ffbackoffice.hessnatur.com/FF73-Query/Suggest.ff?"+factfiderLogin+"format=json&query="+thisVal, function(callbackContent) {
                                var responseJSON = JSON.parse(callbackContent.responseText);
                                console.log('responseJSON: ', responseJSON);

                                var prodMarkup = "",
                                    katMarkup = "",
                                    suchMarkup = "",
                                    mengeDerErgebnisse = responseJSON.suggestions.length;

                                if(mengeDerErgebnisse > 0) {
                                    searchLayer.style.display = "block";

                                    for (var i = 0; i < mengeDerErgebnisse; i++) {
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
                                                
                                                var searchquery = thisProd.searchParams.split("query=*")[1].split("&channel")[0],
                                                    queryName = thisProd.name;

                                                katMarkup +=    '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?q='+queryName+searchquery+'&amp;userInput='+queryName+'" title="'+thisVal+'" class="h-text-decoration-none-hover">'+
                                                                underlineAccordance(queryName, thisVal)+
                                                                '<span class="suggestTextAmount"></span></a></span></li>';

                                            }else if(thisProd.type === "content"){
                                                
                                                suchMarkup += '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de'+thisProd.attributes.link+'" title="'+thisProd.name+'" class="h-text-decoration-none-hover">'+
                                                    underlineAccordance(thisProd.name, thisVal)+
                                                    '<span class="suggestTextAmount"></span></a></span></li>';

                                            }else if(thisProd.type === "searchTerm"){
                                                
                                                suchMarkup += '<li class="suggestRow"><span class="suggestTextQuery"><a href="/de/search?text='+thisProd.name.replace(/ /g, '+')+'&userInput='+thisVal+'" title="'+thisProd.name+'" class="h-text-decoration-none-hover">'+
                                                    underlineAccordance(thisProd.name, thisVal)+
                                                    '<span class="suggestTextAmount"> ('+thisProd.hitCount+' Produkte)</span></a></span></li>';

                                            }

                                            direktsuche.setAttribute('href', '/de/search?text='+thisVal);
                                            direktsuche.innerHTML = 'Alle Ergebnisse für „'+thisVal+'” anzeigen';
                                            
                                        } catch (error) {
                                            console.log('Error: ', error);
                                        }
                                    }

                                    productsPlace.innerHTML = prodMarkup;

                                    kategorieVorschlaege.innerHTML = katMarkup;

                                    suchvorschlaege.innerHTML = suchMarkup;

                                }else{
                                    searchLayer.style.display = "none";
                                }
                            });
                        }else{
                            searchLayer.style.display = "none";
                        }

                    }

                    inputWait = false;
                }, 300);

                
            });

            search_form.insertAdjacentElement('afterend', clone);
        }
    });

    var sitePathname = window.document.location.pathname;
    console.log('sitePathname: ', sitePathname);


    if(sitePathname.indexOf("/p/") !== -1){
        // PDS

        var produktID = sitePathname.split("/p/")[1];

        WATO.elem('h1.pds-cockpit__productName', function(h1){
            if(h1){
                getXHR("GET",'https://ffbackoffice.hessnatur.com/FF73-Indexer/Tracking.ff?event=click&'+factfiderLogin+'sid=s56784193202896&id='+produktID+
                            '&masterId='+produktID.substring(0,5)+'&title='+encodeURI(h1[0].textContent)+'&query=*&pos=24&origPos=1&origPageSize=48&page=1', function(callbackContent) { // &pos=24&origPos=103&page=1&origPageSize=48
                    console.log('callbackContent: ', callbackContent);
                });
            }
        });

        

    }else if(sitePathname.indexOf("/cart") !== -1){


        WATO.elem('.item__form', function(allProds){
            if(allProds){
                for (var j = 0; j < allProds.length; j++) {
                    var thisProd = allProds[j],
                        prodID = WATO.qs('input[name="variantCode"]', thisProd).value;
                        console.log('thisProd: ', thisProd);
                    
                    getXHR("GET",'https://ffbackoffice.hessnatur.com/FF73-Indexer/Tracking.ff?event=cart&'+factfiderLogin+'sid=s21599821818272&id='+prodID+'&masterId='+prodID.substring(0,5)+'&title='+encodeURI(WATO.qs('.cart__productname', thisProd).textContent)+'&count='+WATO.qs('.qty.input-group-field', thisProd).value+'&price='+WATO.qs(".price", thisProd).textContent.replace("€","").replace("*","").replace(",","."), function(callbackContent) { // &pos=24&origPos=103&page=1&origPageSize=48
                        console.log('callbackContent: ', callbackContent);
                        if(callbackContent.responseText.indexOf("The event was successfully tracked") !== -1){
                            // Goal korrekt abgeschickt
                            console.log("Goal korrekt abgeschickt");
                        }else{
                            // Goal ein Problem
                            console.log("Goal ein Problem");
                        }
                    });
                }
            }
        });



        


    }


            
    // https://ffbackoffice.hessnatur.com/FF73-Query/Search.ff?username=hessnatur&password=d6648543b7ec3c456e38f93d7187a9d8&channel=LIVE-DE-Online-de&page=1&productsPerPage=48&filterlineType=P&filtercategory_pathROOT%2Fdamen=damen-bekleidung&filtercategory_pathROOT%2Fdamen%2Fdamen-bekleidung=damen-bekleidung-strickjacken&filtercategory_pathROOT=damen&format=json&sid=s56784184194912&noArticleNumberSearch=false&noCampaign=false&catalog=true&navigation=true&idsOnly=false&duplicateFilter=colorvariantcode





    
    

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
