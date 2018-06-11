/**
 * @function
 * @author Denis Leno
 * @namespace Activate
 * @name 
 * @description
 */

try {
    (function(window, document) {
        function getElemID(elemID){
            return document.getElementById(elemID);
        }
        if(document.cookie.indexOf("iridion_debug=true") !== -1){
            getElemID("addToCartButton").addEventListener("click", function(event){
                var pSize = getElemID("desc__size");
                if(pSize && pSize.value !== "" && event.target.getAttribute("disabled") === null){
                    // console.log("drin");
                    window.iridion.push(["run", "1528721919728"]);
                }    
            });
        }
    })(window, window.document);
} catch (error) {
    console.log(error);
}
