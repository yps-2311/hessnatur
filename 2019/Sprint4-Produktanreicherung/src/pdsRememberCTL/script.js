// (function() {

    var request = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {

        this.addEventListener("loadend", function() {

            if (this.readyState === 4) {

                var respText = this.responseText;

                if (uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1 && respText) {
                    try {
                        var newDiv = document.createElement("div");

                        newDiv.innerHTML = JSON.parse(respText).recommendationLayer;

                        var recoProducts = newDiv.querySelectorAll(".carousel-cell"),
                            productID = document.querySelector('span[itemprop="productID"]').innerHTML,
                            recoArray = [productID],
                            maxLoops = recoProducts.length > 3 ? 3 : recoProducts.length;

                        for (var i = 0; i < maxLoops; i++) {
                            recoArray.push(recoProducts[i].getAttribute("data-prid"));
                        }

                        window.localStorage.setItem("kk_ctl_"+productID, recoArray);
                        
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }, false);

        request.call(this, method, uri, async, user, pass);
    };
// });