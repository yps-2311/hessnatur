// load core and global js
// @codekit-prepend "../global/global.js";
// @ codekit-prepend "../../../debugging/enabled.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function(WATO) {
    "use strict";

	/*jshint loopfunc: true */

	WATO.ps03tweak(1);

	var locate = window.location;

	if(locate.pathname.indexOf("/p/") !== -1 && locate.search.indexOf("cs=see") !== -1){
		// Reco nach oben verschieben
		WATO.elem('.js-completeTheLookWrapper', function(ctl){
			if(ctl){
				WATO.qs('.pds__imageAndCockpitWrapper + .small-collapse > .small-12').insertAdjacentElement('beforebegin', ctl[0]);
			}
		});
	}
	
})(new window.WATO());