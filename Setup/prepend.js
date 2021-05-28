/**
 * Custom-URL Tracking
 */
window.iridion.tracking = window.controllerName || window.document.location.pathname;

/**
 * Econda
 * Include into the variaton js
 * window.iridion.econda.push([{
 *     siteID: 1,
 *     content: (siteTitle ? "HTML-Title/"+siteTitle: "content"),
 *     abtest:  [ [testname, testvariante] ]
 * }]);
 */
window.iridion.econda = window.iridion.econda || [];
window.iridion.econda = (function(window){
    "use strict";

    var data = [],
        emos3Status = false;

    function pushErrorGoal() {
        window.iridion = window.iridion || [];
        window.iridion.push(['goal', 'error_econda']);
    }

    function sendEcondaTracking() {

        try {
            for(var i = 0; i < data.length; i++){
                window.emos3.send(data[i]);
                // window.emosPropertiesEvent(data[i]);
            }
            data = [];
        } catch(e) {
            pushErrorGoal();
        }
    }

    function checkStatus() {
        if(typeof window.emos3 !== "undefined" && typeof window.emos3.send === "function"){
            emos3Status = true;
            return true;
        }
        return false;
    }

    if(checkStatus()){
        sendEcondaTracking();
    } else {

        var econdaInterval  = window.setInterval(function(){
            if(checkStatus()){
                clearInterval(econdaInterval);
                sendEcondaTracking();
            }
        }, 20);
    }

    return {
        push: function(tracking){
            try {
                data.push({
                    type :'event',
                    abtest: [tracking]
                });
                
                if(emos3Status){
                    sendEcondaTracking();
                }
            } catch(e) {
                pushErrorGoal();
            }
        }
    };
})(window);