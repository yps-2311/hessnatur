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

    // Element entfernen
    // function removeObject(el) {
    //     if(el){
    //         el.parentNode.removeChild(el);
    //     }
    // }


    WATO.elem('.pds-completeTheLookWrapper .productitem', function(completeTheLookWrapper){
        if(completeTheLookWrapper){
            var list = [];
            for (var i = 0; i < completeTheLookWrapper.length; i++) {
                list.push(completeTheLookWrapper[i].getAttribute("data-productid"));
            }
            console.log('list: ', list);
        }
    });


     function requestXML(URL, data, callback){

        var params = typeof data === 'string' ? data : Object.keys(data).map(
                function(k){ 
                    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                }
            ).join('&');

        var request = new XMLHttpRequest();
    
        request.open("POST", URL , true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        // request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.onload = function(){
            if (request.status >= 200 && request.status < 400 && request.responseText.length > 0) {
                callback(request);
            }
        };
        request.send(params);
    }


    console.log(1);

    function ajax_get(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log('responseText:' + xmlhttp.responseText);
                try {
                    var data = JSON.parse(xmlhttp.responseText);
                } catch(err) {
                    // console.log(err.message + " in " + xmlhttp.responseText);
                    return;
                }
                callback(data);
            }
        };
     
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    var thisArray = ["4511129", "4677989"];

    WATO.elem('#updateCartForm0', function(updateCartForm0){
        if(updateCartForm0){
            updateCartForm0[0].insertAdjacentHTML('afterend', 
                '<div class="kk_shopTheLook"></div>'
            );

            var thisSTL = WATO.qs(".kk_shopTheLook", updateCartForm0[0].parentNode);

            for (var j = 0; j < thisArray.length; j++) {
                
                ajax_get("https://www.hessnatur.com/de/p/"+thisArray[j]+"/json", function(data){
                    console.log('data: ', data);

                    var dropDownColor = '<select name="item__color" class="custom__select item__color">',
                        dropDownSize = '<select name="item__size" class="custom__select item__size">';

                    for (var k = 0; k < data.colors.length; k++) {
                        var colors = data.colors[k];

                        dropDownColor += '<option value="'+colors.colorCode+'" data-code="'+colors.code+'" selected="">'+colors.color+' ('+colors.colorCode+')</option>';
                    }

                    var firstSizes = data.colors[0].sizes;

                    for (var l = 0; l < firstSizes.length; l++) {
                        var thisSize = firstSizes[l];
                        dropDownSize += '<option value="'+thisSize.size+'" data-code="'+thisSize.code+'">'+thisSize.size+'</option>';
                    }

                    dropDownColor += '</select>';
                    dropDownSize += '</select>';

                    thisSTL.insertAdjacentHTML('beforeend', 
                        '<div class="carousel-cell is-selected" data-prid="'+data.code+'">'+
                            '<a href="'+data.url+'" class="item__image" target="_blank">'+
                                '<img src="'+data.colors[0].articleImageUrl+'" alt="'+data.name+'" title="'+data.name+'">'+
                                '<div class="item__desc h-smallOffset-top-outer">'+
                                    '<h4 class="desc-name">'+data.name+'</h4>'+
                                    '<div class="desc-price">'+
                                        '<span class="price">'+data.formattedPrice+'</span>'+
                                    '</div>'+
                                '</div>'+
                            '</a>'+
                            dropDownColor+
                            '<br></br>'+
                            dropDownSize+
                            '<button class="kk_addtoCart" data-prid="'+data.code+'">IN DEN WK</button>'+
                        '</div>'
                    );

                    WATO.qs(".kk_addtoCart", thisSTL).addEventListener('click', function(e){
                        e.preventDefault();
                        console.log("click");
                        // console.log('WATO.qs("#item__orderno"): ', WATO.qs("#item__orderno"));
                        // console.log('this.getAttribute("data-prid"): ', this.getAttribute("data-prid"));
                        // WATO.qs("#item__orderno").value = this.getAttribute("data-prid");
                        // WATO.qs(".quickadd__button").click();

                        requestXML("https://www.hessnatur.com/de/cart/add", { 
                            productCodePost: this.getAttribute("data-prid")+3640,
                            ff_id: this.getAttribute("data-prid")+3640,
                            ff_masterId: this.getAttribute("data-prid"),
                            ff_title: "Damen+Sandalette+aus+Leder",
                            ff_price: 149.00,
                            qty: 1,
                            CSRFToken: "d8426504-c8f3-4a9a-b1cd-6262a4177452"
                        }, function(req){
                            console.log('req: ', req);

                            location.reload();
                        });

                    });
                });
            }

            
            

        }
    });



})(new window.WATO(), window);