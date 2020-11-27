// load core and global js
// @ codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */

try {
    // window.iridion.econda.push(["SprintPS01", "V0"]);
} catch (error) {
    // console.log('Error: ', error);
}
try {
    // window.iridion.push(["segment", ((!window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1) ? "32812" : "32813")]);

    var isInteressent = !window.localStorage.getItem("kk_hasbought") && document.location.search.indexOf("show=neukunde") === -1;

    if ((!window.iridion.push(['hasSegment', "32812"])) && (!window.iridion.push(['hasSegment', "32813"]))) {
        window.iridion.push(["segment", (isInteressent ? "32812" : "32813")]);
    }
} catch (error) {
    console.log('Error: ', error);
}






// (function(WATO) {
//     "use strict";

//     window.iridion.econda.push(["Sprint10", "V0"]);

//     // WATO.sprint10goals();

// })(new window.WATO());