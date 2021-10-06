/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * @codekit-prepend "../assets/ouibounce.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
    "use strict";

	/*jshint loopfunc: true */

	WATO.prototype.ps07global = function(callback){

		var _self = this;

		// function goalPush(key, sendOnNextPageView){
		// 	if(sendOnNextPageView){
		// 		window.iridion.push(['goal', key, '', true]);
		// 	}else{
		// 		window.iridion.push(['goal', key]);
		// 	}
		// }

		// _self.exclude(1023, function(){
		// 	_self.setCookie('kkps03desk_exclude', 'true', ".hessnatur.com", false);
		// 	_self.reload();
		// });
		
		_self.elem(function () {
			return typeof window.ouibounce !== 'undefined';
		}, function(ouibounceReady){
			if(ouibounceReady){

				// console.log("aggressive", false);

				// Das Ouibounce-Script reagiert auf ein Exitintent 
				// beim verlassen des Cursors nach oben aus dem Browser
				window.ouibounce(false, {
					callback,
					aggressive: false,
					cookieExpire: 30,
					timer: 0
				});
			}
		});

		

	};
	
})(window.WATO, window);