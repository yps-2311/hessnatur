(function(window) {
    "use strict";

    var hostname = window.location.hostname;

    if(hostname.indexOf("sf.acc.hess-webshop-dev-760c") !== -1 && !window.iridion.push(['hasSegment', '32876'])){
        window.iridion.push(['segment', '32876']);
    }else if(hostname.indexOf("www.hessnatur.com") !== -1 && !window.iridion.push(['hasSegment', '32877'])){
        window.iridion.push(['segment', '32877']);
    }

})(window);