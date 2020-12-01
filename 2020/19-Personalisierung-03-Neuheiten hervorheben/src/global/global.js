/*
 * !LOAD WATO OBJECT
 * @codekit-prepend "../vendor/WATO.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
* @function
* @author Manuel Brueckmann
* @namespace
* @name Global Script for lookup customer type
* @description Prototype for requesting Econda ARP API for user profiles
*/

(function (WATO, window) {
	"use strict";


	// init the campaign overall
	function initCampaign() {
		// eg. trigger widget
		econdaWidget(sessionStorage.getItem('kk_targetGroup') !== undefined ? sessionStorage.getItem('kk_targetGroup') : 'interessent');

		// eg. trigger content, visual changes depending on design
		doCampaignStuff(sessionStorage.getItem('kk_targetGroup') !== undefined ? sessionStorage.getItem('kk_targetGroup') : 'interessent')
	}

	// placeholder for econda widget call and rendering to specific container
	function econdaWidget(widget){
		console.log("triggered econda widget: " + widget);
	}

	// placeholder for campaign stuff
	function doCampaignStuff(variation){
		console.log("triggered campagin visuals and content for: " + variation);
	}


	// get user classification, only once per session

	// already in session storage?
	if (!window.sessionStorage.getItem("kk_targetGroup")) {
	
		// 1. check if user is logged in > it's "neukunde" or "bestandskunde" then
		// TODO: Polling or DOM-Ready to check if form-wrapper is present
		if (document.getElementById("_loginComponentForm") === null) {  // form not present, so user is logged in
			
			// check if more than 1 order (ajax request to the my-account ajax content)
			WATO.xhr_get('https://www.hessnatur.com/de/my-account/orders', function(response){
				
				// amount of orders
				console.log('orders total: ', response.split("js_orderHistoryItem-").length); 
				
				if (response){

					// neukunde, only 0 or 1 order
					// TODO: what if js_orderHistoryItem is not available? Error then?
					if (response.split("js_orderHistoryItem-").length < 2) {
						
						sessionStorage.setItem('kk_targetGroup', 'neukunde');

					// bestandskunde, more than 1 order
					}else {
						
						sessionStorage.setItem('kk_targetGroup', 'bestandskunde');
					}

				}

				// init campaign (regardless if request was succesfull or not, fallback to 'interessent' then, next attempt will try again)
				initCampaign();

			});
				
		}else {

			// 2. if not, check if econda does know something about visitor
			// visitor is not logged in (which will be mainly the case)

			WATO.elem(function () {
				// check if econdas emos3 is available
				// due to this might take some time (async), wait for it

				console.log('window.emos3: ', window.emos3); // econda object
				console.log('window.emos3.emos_vid: ', window.emos3.emos_vid); // econda visitor id (shoud be always available, default)
				console.log('window.emos3.emos_cid: ', window.emos3.emos_cid); // econda customer id (only available if logged in and econda is not adblocked)

				return typeof window.emos3 !== "undefined" && (typeof window.emos3.emos_vid !== "undefined" || typeof window.emos3.emos_cid !== "undefined");

			}, function (emos_available) {
				
				if (emos_available) {

					// econda is available
					// ARP endpoint:	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid|emvid=
					//
					// Example queries:
					// Neukunden:		https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=de2c709c269261dbe7cf230465a205b1
					//					https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emvid=AXG7X26WccAN3yiAKoMG9Xw*UWd9pDAw
					// Bestandskunden:	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=c52d407f90b141afb905d6da8f228495			
					// Interessent: 	https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emvid=AXTjATsJh0ydB8cRFsQD8PFCiJUTldmy

					// build arp endpoint url by available profile id and request data
					console.log('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid));
					
					WATO.xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?' + (typeof window.emos3.emos_cid !== "undefined" ? 'emcid=' + window.emos3.emos_cid : 'emvid=' + window.emos3.emos_vid), function (response) {
					//WATO.xhr_get('https://services.crosssell.info/profileaccess/00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f/profiles/cgroup?emcid=c52d407f90b141afb905d6da8f228495', function (response) {

						console.log('response: ', response);

						if (response){
							if (response.indexOf('Bestandskunde') !== -1){
								// bestandskunde (highest priority, even if Neukunde is also present in response)
								sessionStorage.setItem('kk_targetGroup', 'bestandskunde');

							} else if (response.indexOf('Neukunde') !== -1 ) {
								// neukunde
								sessionStorage.setItem('kk_targetGroup', 'neukunde');
							}else {
								sessionStorage.setItem('kk_targetGroup', 'interessent');
							}
						}
					
						// init campaign (regardless if result is available or not)
						initCampaign();

					});
				}
			});
		}
	} else {
		initCampaign();
	}

})(new window.WATO(), window);
