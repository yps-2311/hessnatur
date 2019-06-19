(function() {
    var request = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

        this.addEventListener("loadend", function() {

            if (this.readyState === 4) {

                var respText = this.responseText;

                if (uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1 && respText) {
                    try {
                        var newDiv = document.createElement("div"),
                            existsLS = window.localStorage.getItem("kk_ctl");

                        newDiv.innerHTML = JSON.parse(respText).recommendationLayer;

                        var recoProducts = newDiv.querySelectorAll(".carousel-cell"),
                            productID = parseInt(document.querySelector('span[itemprop="productID"]').innerHTML),
                            recoArray = [],
                            reco = {},
                            maxLoops = recoProducts.length > 3 ? 3 : recoProducts.length;

                        for (var i = 0; i < maxLoops; i++) {
                            recoArray.push(parseInt(recoProducts[i].getAttribute("data-prid")));
                        }

                        if(existsLS){
                            reco = JSON.parse(existsLS);
                        }
                        
                        reco[productID] = recoArray;

                        window.localStorage.setItem("kk_ctl", JSON.stringify(reco));
                        
                    } catch (error) {
                        // console.log(error);
                    }
                }
            }

        }, false);

        request.call(this, method, uri, async, user, pass);
    };
})();