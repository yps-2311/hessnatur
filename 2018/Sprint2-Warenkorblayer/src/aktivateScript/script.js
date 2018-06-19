/**
 * @function
 * @author Denis Leno
 * @namespace Activate
 * @name 
 * @description
 */

try {
    // (function(window, document) {
    //     function getElemID(elemID){
    //         return document.getElementById(elemID);
    //     }
    //     if(document.cookie.indexOf("iridion_debug=true") !== -1){
    //         getElemID("addToCartButton").addEventListener("click", function(event){
    //             var pSize = getElemID("desc__size");
    //             if(pSize && pSize.value !== "" && event.target.getAttribute("disabled") === null){
    //                 // console.log("drin");
    //                 window.iridion.push(["run", "1528721919728"]);
    //             }    
    //         });
    //     }
    // })(window, window.document);

    // WATO.ajax('https://www.hessnatur.com/de/cart/add', function(){
    //     window.iridion.push(["run", "1528721919728"]);
    // });

    if(document.cookie.indexOf("iridion_debug=true") !== -1){
        console.log("to activate");
        var request = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(
            method,
            uri,
            async,
            user,
            pass
        ) {
            this.addEventListener(
                "loadend",
                function() {
                    if (this.readyState === 4) {
                        if (uri.indexOf('https://www.hessnatur.com/de/cart/add') !== -1) {
                            console.log("activate push");

                            try {
                                // Minicart schnell ausbelden damit man es nicht beim AddToCart sieht
                                var pMiniCart = document.getElementById("miniCartDropdown");

                                if(pMiniCart){
                                    pMiniCart.style.display = "none";

                                    setTimeout(function(){
                                        // Minicart wieder einblendbar machen
                                        pMiniCart.style.display = "inherit";
                                    }, 3000);
                                }
                            } catch (error) {
                                console.log(error);
                            }

                            // In den Test
                            window.iridion.push(["run", "1528721919728"]);
                        }
                    }
                },
                false
            );
            request.call(this, method, uri, async, user, pass);
        };
    }

} catch (error) {
    console.log(error);
}
