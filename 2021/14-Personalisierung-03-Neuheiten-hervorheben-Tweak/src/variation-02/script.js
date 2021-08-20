// load core and global js
// @ codekit-prepend "../global/global.js";

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
	WATO.setSegmentByProfile();
    WATO.ps03globalgoals();

	var locate = window.location;

	if(locate.pathname.indexOf("/p/") !== -1 && locate.search.indexOf("ps03=true") !== -1){
		// Reco nach oben verschieben
		WATO.elem('.js-completeTheLookWrapper', function(ctl){
			if(ctl){
				WATO.qs('.pds__imageAndCockpitWrapper + .small-collapse > .small-12').insertAdjacentElement('beforebegin', ctl[0]);
			}
		});
	}
	
})(new window.WATO());