/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

(function(WATO){
    "use strict";

	/*jshint loopfunc: true */
	

	WATO.prototype.ab22goals = function(){
		var _self = this;

		function goalPush(key, sendOnNextPageView){
			if(sendOnNextPageView){
				window.iridion.push(['goal', key, '', true]);
			}else{
				window.iridion.push(['goal', key]);
			}
		}

		_self.elem('#search_form_off_canvas .input-group-field', function(element){
			if(element){
				console.log('element: ', element);
				element[0].addEventListener('click', function(){
					goalPush("kk_ab22_search_field");
				});
			}
		});
		_self.elem('#suggest_layer_off_canvas', function(element){
			if(element){
				console.log('element: ', element);
				element[0].addEventListener('click', function(e){
					console.log('e: ', e.target);
					goalPush("kk_ab22_search_link", true);
				});
			}
		});
	};
	
})(window.WATO, window);