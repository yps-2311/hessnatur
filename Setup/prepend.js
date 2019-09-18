/**
 * Custom-URL Tracking
 */
window.iridion.tracking = window.controllerName || window.document.location.pathname;

/**
 * Econda
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
                // var siteTitle = document.title;
                // data.push({
                //     siteID: 1,
                //     content: (siteTitle ? "HTML-Title/" + siteTitle: "content"),
                //     abtest:  [tracking]
                // });
                data.push({
                    // siteID: 1,
                    // content: (siteTitle ? "HTML-Title/" + siteTitle: "content"),
                    abtest:  [tracking]
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


/** EXPERIMENTS **/
// Include into the variaton js
// window.iridion.econda.push([{
//     siteID: 1,
//     content: (siteTitle ? "HTML-Title/"+siteTitle: "content"),
//     abtest:  [ [testname, testvariante] ]
// }]);



// ALT
// window.iridion.tracking=window.controllerName||window.document.location.pathname,window.iridion.econda=window.iridion.econda||[],window.iridion.econda=function(i,o){"use strict";var t=[],e=!1;function r(){i.iridion=i.iridion||[],i.iridion.push(["goal","error_econda"])}function c(){try{for(var n=0;n<t.length;n++)i.emos3.send(t[n]);t=[]}catch(n){r()}}function n(){return void 0!==i.emos3&&"function"==typeof i.emos3.send&&(e=!0)}if(n())c();else var d=i.setInterval(function(){n()&&(clearInterval(d),c())},20);return{push:function(n){try{var i=o.title;t.push({siteID:1,content:i?"HTML-Title/"+i:"content",abtest:[n]}),e&&c()}catch(n){r()}}}}(window,document);