/**
 * @function
 * @author Denis Leno
 * @namespace Activate
 * @name 
 * @description
 */

(function(){

    try {

        // if(document.cookie.indexOf("iridion_debug=true") !== -1){
        if(new RegExp(/.*hessnatur.com\/de\/.*\/p\/.*/).test(document.URL)){    

            var request = XMLHttpRequest.prototype.open;

            XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {this.addEventListener("loadend", function() {

                if (this.readyState === 4) {

                    if(uri.indexOf('https://www.hessnatur.com/de/cart/add') !== -1) {
                        // console.log("activate push");

                        // try {
                        //     // Minicart schnell ausbelden damit man es nicht beim AddToCart sieht
                        //     var pMiniCart = document.getElementById("miniCartDropdown");

                        //     if(pMiniCart){
                        //         pMiniCart.style.display = "none";

                        //         setTimeout(function(){
                        //             // Minicart wieder einblendbar machen
                        //             pMiniCart.style.display = "inherit";
                        //         }, 3000);
                        //     }
                        // } catch (error) {
                        //     // console.log(error);
                        // }

                        // In den Test
                        // window.iridion.push(["run", "1528721919728"]);

                        // MV, 16.07.2018, 100% Ausspielung
                        window.iridion.push(["run", "1531735624736"]);
                    }
                }
            }, false);

                request.call(this, method, uri, async, user, pass);
            };
        }
        // }
    } catch(error){}
})();