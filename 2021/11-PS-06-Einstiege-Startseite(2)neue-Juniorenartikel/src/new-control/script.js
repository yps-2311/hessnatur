// load core and global js
//@ codekit-prepend "../global/global.js";

//@code-kit append "request.min.js";
/**
 * @function
 * @author Christian Knoth
 * @namespace C
 * @name newControl
 * @description
 */
 (function (WATO) {
    "use strict";

    window.iridion.econda.push(["PS06_restart", "V0"]);

    WATO.PS06Goals();

})(new window.WATO());