// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V0
 * @name Variation 00
 * @description
 */


(function(WATO) {
    "use strict";

    // window.iridion.econda.push(["SprintAB22", "V0"]);

    function pushSegment(key) {
		window.iridion.push(['segment', key]);
	}

    WATO.ab22goals();

	if(window.innerWidth <= 1023){
		pushSegment('32879');
	} else {
		pushSegment('32880');
	}

    window.addEventListener("orientationchange", function() {
        pushSegment('32881');
		WATO.reload();
	}, false);

})(new window.WATO());