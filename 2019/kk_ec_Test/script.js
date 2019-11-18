/**
 * Custom-URL Tracking
 */
// window.iridion.tracking = window.controllerName || window.document.location.pathname;



/**
 * econdaX
 */
window.iridion.econdaX = window.iridion.econdaX || [];
window.iridion.econdaX = (function(window){
    "use strict";

    var data = [],
        emos3Status = false;

    function pushErrorGoal() {
        window.iridion = window.iridion || [];
        window.iridion.push(['goal', 'error_econda']);
    }

    function sendEcondaTracking(tracking) {
        try {
            console.log('window.emospro: ', window.emospro);
            console.log('window.emospro.siteid: ', window.emospro.siteid);
            console.log('window.emospro.content: ', window.emospro.content);

            data.push({
                siteID: window.emospro.siteid,
                content: window.emospro.content,
                abtest: [tracking]
            });

            console.log('emos3Status: ', emos3Status);
            if(emos3Status){
                for(var i = 0; i < data.length; i++){
                    window.emos3.send(data[i]);
                }
                data = [];
            }
        } catch(e) {
            console.log("error1: ", e);
            pushErrorGoal();
        }
    }

    function checkStatus() {
        if(typeof window.emos3 !== "undefined" && typeof window.emos3.send === "function" && 
            typeof window.emospro !== "undefined" && typeof window.emospro.siteid !== "undefined" && typeof window.emospro.content !== "undefined"){
            emos3Status = true;
            return true;
        }
        return false;
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

                if(checkStatus()){
                    sendEcondaTracking(tracking);
                } else {
                    var econdaInterval  = window.setInterval(function(){
                        console.log("econdaInterval");
                        if(checkStatus()){
                            clearInterval(econdaInterval);
                            sendEcondaTracking(tracking);
                        }
                    }, 20);
                }

            } catch(e) {
                console.log("error2: ", e);
                pushErrorGoal();
            }
        }
    };
})(window);

window.iridion.econdaX.push(["kk_ec_Test", "V1"]);



/** EXPERIMENTS **/
// Include into the variaton js
// window.iridion.econda.push([{
//     siteID: 1,
//     content: (siteTitle ? "HTML-Title/"+siteTitle: "content"),
//     abtest:  [ [testname, testvariante] ]
// }]);



// ALT
// window.iridion.tracking=window.controllerName||window.document.location.pathname,window.iridion.econda=window.iridion.econda||[],window.iridion.econda=function(i,o){"use strict";var t=[],e=!1;function r(){i.iridion=i.iridion||[],i.iridion.push(["goal","error_econda"])}function c(){try{for(var n=0;n<t.length;n++)i.emos3.send(t[n]);t=[]}catch(n){r()}}function n(){return void 0!==i.emos3&&"function"==typeof i.emos3.send&&(e=!0)}if(n())c();else var d=i.setInterval(function(){n()&&(clearInterval(d),c())},20);return{push:function(n){try{var i=o.title;t.push({siteID:1,content:i?"HTML-Title/"+i:"content",abtest:[n]}),e&&c()}catch(n){r()}}}}(window,document);



