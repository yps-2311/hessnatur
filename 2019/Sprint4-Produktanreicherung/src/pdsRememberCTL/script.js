(function() {
    var request = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

        this.addEventListener("loadend", function() {

            if (this.readyState === 4) {

                var respText = this.responseText;

                if (uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1 && respText) {
                    try {
                        var newDiv = document.createElement("div"),
                            existsLS = window.localStorage.getItem("kk_ctl"),
                            headlineCTL = document.querySelector('.ds_wrapper .ds_headline.h2').innerHTML.indexOf("Zum kompletten Outfit") !== -1;

                        if(headlineCTL){
                            newDiv.innerHTML = JSON.parse(respText).recommendationLayer;

                            var recoProducts = newDiv.querySelectorAll(".carousel-cell"),
                                productID = document.querySelector('span[itemprop="productID"]').innerHTML,
                                recoArray = [],
                                reco = {},
                                maxLoops = recoProducts.length > 3 ? 3 : recoProducts.length,
                                check = true;
    
                            for (var i = 0; i < maxLoops; i++) {
                                recoArray.push(parseInt(recoProducts[i].getAttribute("data-prid")));
                            }
    
                            // Nur wenn es das LS schon gibt
                            if(existsLS){
                                reco = JSON.parse(existsLS);

                                // Prüfung ob dieses Produkt bereits Teil eines Sets ist, wenn ja dann wird es nicht hinzugefügt
                                for (var key in reco) {
                                    var thisReco = reco[key];
                                    for (var j = 0; j < thisReco.length; j++) {
                                        if(String(thisReco[j]).indexOf(productID.substr(0,5)) !== -1){
                                            check = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if(check){
                                reco[parseInt(productID)] = recoArray;
    
                                window.localStorage.setItem("kk_ctl", JSON.stringify(reco));
                            }
                        }
                        
                    } catch (error) {
                        // console.log(error);
                    }
                }
            }

        }, false);

        request.call(this, method, uri, async, user, pass);
    };
})();