// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno / Michael Kloepping
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO, window) {
    "use strict";

    var URLpath = window.document.location.pathname,
        nDelayHome = 7500,
//        nDelayCat = 0,
        nDelaySizeAdvisor = 7500,
        nDelayProdInfo = 5000,
        nDelayCart = 7500,
        bChoseSize = false,
    	bSizeIsVisible = true,
    	bMoreDetailIsVisible = true,
    	bProdInfosIsVisible = false,
    	bCtaIsVisible = true,
    	bSizeSelectIsVisible = false,
    	sExcludeCookie = "iridion_1538128684835_exclude",
		nPunchout = 1024,
		bWaEclude = document.cookie.indexOf(sExcludeCookie+'=true') !== -1,
    	aNudgeName = {	'home'			: 'kk_nudgeHome',
    					'category'		: 'kk_nudgeCat',
    					'sizeadvisor' 	: 'kk_nudgeSizeadvisor',
    					'selectsize'	: 'kk_nudgeSelectSize',
    					'detail'		: 'kk_nudgePDPdetail',
    					'cart'			: 'kk_nudgeCart'};

    
    
    function getStorage(name){
    	
    	return window.localStorage.getItem(name) || window.sessionStorage.getItem(name);
    }
    
    function getLocalstorage(name){

    	return window.localStorage.getItem(name);
    }
    
    function setLocalstorage(name, isLS){
    	
        if(isLS){
            return window.localStorage.setItem(name, true);
        }else{
            return window.sessionStorage.setItem(name, true);
        }
    }
    
	function showErrorInfo(error){
		
//		console.log('try/catch error', error);
		
		pushIridionGoal('wa_setup_monitoring');
	}
    
	function removeNudge(oNudge){
		
		oNudge.classList.remove('wa-show-nudge');
		
		window.setTimeout(function(){
			oNudge.style.display = "none";
		}, 1100);
	}
	
	function pushIridionGoal(key){
		
		window.iridion.push(['goal', key]);
		
//		console.log('pushIridionGoal: ', key);
	}
	
	function excludeAndReload(){
		
		WATO.setCookie(sExcludeCookie, 'true', '.hessnatur.com', false, 365);
		
		window.location.reload(true);
        
        window.location.href = window.location.href; 
		
	}
	
	// Punchout
	WATO.exclude(nPunchout, function(){
		
		if(!bWaEclude){
			
			excludeAndReload();
		}
	});

    // Startseite & Verteilerseite
    if((URLpath === "/de/" || new RegExp("/de/(NEU|herren|damen|baby|home|sale)").test(URLpath)) && URLpath.indexOf("/p/") === -1 && URLpath.indexOf("/c/") === -1){
        
        // Nudge geschlossen oder gesehen
        if(!getStorage(aNudgeName.home)){

            // Nach X Sekunden eingeblendet
            

                WATO.elem('#search_form', function(suchfeld){
                	try{
                		var bUseSearch = false;
                		
                		if(suchfeld){

                            setTimeout(function(){
                            	
                            	if(!bUseSearch){
                            		suchfeld[0].insertAdjacentHTML('beforebegin', 
                                            '<div id="kk_nudgeSearch" ' + (WATO.qs('.row', suchfeld[0]).offsetWidth < 290 ? 'style="right: ' + WATO.qs('.row', suchfeld[0]).offsetWidth + 'px;"' : '') + '>'+
                                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>×</span></button>'+
                                                '<h4>Wer suchet, der findet.</h4>'+
                                                '<p>Sie k&ouml;nnen auch Artikelnummern in unserer Suche eingeben.</p>'+
                                            '</div>');
                            		
                                    suchfeld[0].parentNode.classList.add('wa-pos-relative');
                                    
                                    var nudge = WATO.qs("#kk_nudgeSearch");
                                    
                                    nudge.classList.add('wa-show-nudge');
                                    
									pushIridionGoal('s6_show_nudge_search');
                                    
                                    setLocalstorage(aNudgeName.home, false);

                                    window.addEventListener('resize', function(){

                                    	if(WATO.qs('.row', suchfeld[0]).offsetWidth < 290){
                                    	
                                    		nudge.style.right = WATO.qs('.row', suchfeld[0]).offsetWidth + 'px';
                                    	}
                                    });
            
                                    WATO.qs(".close-button", nudge).addEventListener('click', function(){
                                    	
                                    	removeNudge(nudge);
                                    	
                                    	setLocalstorage(aNudgeName.home, true);
                                    	
                                    	pushIridionGoal('s6_close_nudge_search');
                                    	
                                    });
                            	}
                            }, nDelayHome);
                            
                            WATO.qs('input', suchfeld[0]).addEventListener('focus', function(){
                            	
                            	var oNudgeSearch = WATO.qs('#kk_nudgeSearch');
                            	
                            	if( oNudgeSearch !== null){
                            		
                            		removeNudge(oNudgeSearch);
                            	}
                            	
                            	bUseSearch = true;
                            	
                                setLocalstorage(aNudgeName.home, true);
                            });
                        }
                	} catch(error){
                		
                		showErrorInfo(error);
                	}
                });
        }
    } else if(URLpath.indexOf("/c/") !== -1){
    	// Kategorie
    	
    	WATO.elem('.gridviewProductFilterDesktopWrapper form.js-filter-form', function(aFilterRow){
    		try{
    			if(aFilterRow){
    				
    				aFilterRow = aFilterRow[0];
    				
    				if(!getStorage(aNudgeName.category)){
    					
    					// Parent relativ setzen   					
    					aFilterRow.parentNode.classList.add('wa-pos-relative');
    					
    					aFilterRow.insertAdjacentHTML('beforebegin', 
                                '<div id="kk_nudgeCategory">'+
                                    '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
                                    '<h4>Nutzen Sie die Filter</h4>'+
                                    '<p>So finden Sie schneller einen Artikel, der zu Ihnen passt.</p>'+
                                '</div>');
    					
    					var oNudgeCategory = WATO.qs('#kk_nudgeCategory');
	    				
    					oNudgeCategory.classList.add('wa-show-nudge');
	    				
	    				pushIridionGoal('s6_show_nudge_filter');
						
						setLocalstorage(aNudgeName.category, false);
						
						WATO.qs(".close-button", oNudgeCategory).addEventListener('click', function(){
                        	
                        	removeNudge(oNudgeCategory);
                        	
                        	pushIridionGoal('s6_close_nudge_filter');
                        	
                        	setLocalstorage(aNudgeName.category, true);
                        	
                        });
    				}
    			}
    		} catch(error){
    			showErrorInfo(error);
    		}
    	});
    	
    	
    	
    } else if(URLpath.indexOf("/p/") !== -1){
    	// PDS
    	
    	WATO.elem('.breadcrumbs[itemprop="breadcrumb"] > li > a', function(aBreadcrumbLinks){
    		try{
    			if(aBreadcrumbLinks){
    				var sMoreLinks = '',
    					sMainCat = '',
    					sLinkText = '',
    					nCnt = 0;
    				
   				
    				Array.prototype.forEach.call(aBreadcrumbLinks, function(oBreadcrumbLink, idx){
    					
    					if(oBreadcrumbLink.getAttribute('title') !== null && oBreadcrumbLink.title.indexOf('Startseite') === -1 && idx !== 0 && nCnt < 2){
    						
    						if(sMainCat === ''){
    							
    							sMainCat = oBreadcrumbLink.title.toUpperCase();
    							
    							sMoreLinks += '<a class="kk_more_products textLink button" href="' + oBreadcrumbLink.href + '" target="_blank">Weitere Artikel aus ' + oBreadcrumbLink.title.toUpperCase() + '</a>';
    						} else {

    							sLinkText = oBreadcrumbLink.title.toUpperCase().replace(sMainCat, '');
    							
    							if(sLinkText.substring(0, 1) === " "){
    								
    								sLinkText = sLinkText.replace(/^\s+/, '');
    							}
    							
    							sLinkText = sLinkText.replace('--', '-');

    							sMoreLinks += '<a class="kk_more_products textLink button" href="' + oBreadcrumbLink.href + '" target="_blank">Weitere Artikel aus ' + sMainCat + '-' + sLinkText + '</a>';
    						}
    						nCnt++;
    					}
    				});
    				
    				if(sMoreLinks !== ''){
    					
    					WATO.elem('.pds-cockpit__wrapper .js-jump-references', function(aWrapper){
    						try{
    							if(aWrapper){
    								
    								aWrapper = WATO.qs('.pds-cockpit__wrapper');
    								
    								aWrapper.insertAdjacentHTML('beforeend', '<div id="wa-more-product-wrapper">' +
    																				sMoreLinks +
    																			'</div>');
    								
    								Array.prototype.forEach.call(WATO.qsa('#wa-more-product-wrapper a'), function(domLink){
    									
    									domLink.addEventListener('click', function(){
    										pushIridionGoal('s6_click_link_moreproducts_cockpit');
    									});
    								});
    							}
    						} catch(error){
    	                		
    	                		showErrorInfo(error);
    	                	}
    					});
    					
    					//add classes
    					WATO.elem('div.js-product-reference[data-componentid="CrossSelling"]', function(aCrossSelling){
    						try{
    							if(aCrossSelling){
    								aCrossSelling[0].insertAdjacentHTML('afterend', '<div id="wa-more-product-recos" class="small-12 columns">' +
    																					'<div class="row">' +
    																						'<div class="column small-12">' +
    																							'<div class="h3 text-center">Noch nicht das Richtige?</div>' +
    																						'</div>' +
    																						'<div class="column small-12">' +
    																							sMoreLinks +
																							'</div>' + 
    																					'</div>' +
    																				'</div>');
    								
    								Array.prototype.forEach.call(WATO.qsa('#wa-more-product-recos a'), function(domLink){
    									
    									domLink.addEventListener('click', function(){
    										
    										pushIridionGoal('s6_click_link_moreproducts_crossselling');
    									});
    								});
    							}
    						} catch(error){
    	                		
    	                		showErrorInfo(error);
    	                	}
    					});
    				}
    			}
    		} catch(error){
    			showErrorInfo(error);
    		}
    	});
    	
    	
    	
    	WATO.elem('#desc__size', function(aSizeSelect){
    		
    		try{
    			if(aSizeSelect){
    				
    				var nNavHeight 		= WATO.qs('div.headerWrapper').offsetHeight,
						nScrollPos 		= window.pageYOffset,
						nSelectPos 		= aSizeSelect[0].getBoundingClientRect().top + aSizeSelect[0].offsetHeight,
						nProdInfosPos	= 0,
						nMoreDetailPos 	= 0,
						bClickNudgeLink = false;

//					var nWinHeight 		= Math.max(window.document.documentElement.clientHeight, window.innerHeight || 0);

    				var showMoreProdInfos = function(){
    					
    					if(!bProdInfosIsVisible && !getStorage(aNudgeName.detail)){
    						
    						window.setTimeout(function(){
    							
    							WATO.elem('.btn-simple-link.js-pds-more-details', function(aMoreDetails){
    		    		    		try{
    		    		    			if(aMoreDetails && !bSizeSelectIsVisible){
    		    		    				
    		    		    				// Parent relativ setzen
    		    		    				aMoreDetails[0].classList.add('wa-pos-relative');
    		    		    				
    		    		    				aMoreDetails[0].insertAdjacentHTML('afterbegin', 
    	                                            '<div id="kk_nudgeProdDetail">'+
    	                                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
    	                                                '<h4>M&ouml;chten Sie mehr &uuml;ber das<br />Produkt erfahren?</h4>'+
    	                                                '<p>Klicken Sie auf "' + aMoreDetails[0].textContent.trim() + '", um mehr &uuml;ber Material und Hinweise zur Pflege zu erfahren.</p>'+
    	                                            '</div>');
    		    		    				
    		    		    				var oNudgeProdDetail = WATO.qs('#kk_nudgeProdDetail');
    		    		    				
    		    		    				oNudgeProdDetail.classList.add('wa-show-nudge');
    		    		    				
    		    		    				pushIridionGoal('s6_show_nudge_proddetails');
    		    							
    		    							setLocalstorage(aNudgeName.detail, false);
    		    							
    		    							WATO.qs(".close-button", oNudgeProdDetail).addEventListener('click', function(){
    	                                    	
    	                                    	removeNudge(oNudgeProdDetail);
    	                                    	
    	                                    	pushIridionGoal('s6_close_nudge_proddetails');
    	                                    	
    	                                    	setLocalstorage(aNudgeName.detail, true);
    	                                    	
    	                                    });
    		    							WATO.qs('#kk_nudgeProdDetail').addEventListener('click', function(event){
    		    								
    		    								if(event.currentTarget.getAttribute('id') !== null && event.currentTarget.id === 'kk_nudgeProdDetail'){
    		    									event.preventDefault();
        		    								event.stopPropagation();
    		    								}
    		    							});
    		    							aMoreDetails[0].addEventListener('click', function(){
    	                                    	
    	                                    	removeNudge(oNudgeProdDetail);
    	                                    });

    		    		    			}    			
    		    		    		}catch(error){
    		    		    			showErrorInfo(error);
    		    		    		}
    		    		    	});
        						
        						
        					}, nDelaySizeAdvisor);	
    					}
    				};

    				// Größenberater 
    				WATO.elem('#size_advisor', function(aSizeAdvisor){
    		    		try{
    		    			if(aSizeAdvisor){
    		    				
    		    				// Abfrage ob bereits eine Größe gewählt per default gewählt ist
    		    				if(aSizeSelect[0].value.length !== 0){
    		    					
    		    					bChoseSize = true;
    		    				}
    		    				// Event Listener bei Veränderung der Größenauswahl
    		    				aSizeSelect[0].addEventListener('change', function(event){

    		    					if(event.currentTarget.value !== ""){
    		    						
    		    						var oNudgeSelectSize = WATO.qs("#kk_nudgeSelectSize");
    		    						
    		    						if(oNudgeSelectSize !== null && oNudgeSelectSize.style.display !== "none" && navigator.userAgent.indexOf('Safari') !== -1){
    		    							
    		    							oNudgeSelectSize.style.display = "none";
    		    							 
    		    							oNudgeSelectSize.classList.remove('wa-show-nudge');
    		    							
    		    							bSizeSelectIsVisible = false;
    		    						}
    		    						
    		    						bChoseSize = true;
    		    					} else {
    		    						
    		    						bChoseSize = false;
    		    					}
    		    				});
    		    				
    		    				// Event Listener bei Veränderung der Größenauswahl
    		    				aSizeSelect[0].addEventListener('click', function(event){
    		    					
    		    					if(event.currentTarget.value !== ""){
    		    						
    		    						var oNudgeSelectSize = WATO.qs("#kk_nudgeSelectSize");
    		    						
    		    						if(oNudgeSelectSize !== null && oNudgeSelectSize.style.display !== "none"){
    		    							
    		    							oNudgeSelectSize.style.display = "none";
    		    							 
    		    							oNudgeSelectSize.classList.remove('wa-show-nudge');
    		    							
    		    							bSizeSelectIsVisible = false;
    		    						}
    		    					}
    		    				});   		    				
    		    				window.addEventListener('scroll', function(){
    		    					nScrollPos = window.pageYOffset + nNavHeight;
    		    					
    		    					if(nScrollPos >= nSelectPos && bSizeIsVisible){
    		    						bSizeIsVisible = false;
    		    						
    		    					} else if(!bSizeIsVisible && nScrollPos < nSelectPos){
    		    						
    		    						bSizeIsVisible = true;
    		    					}
    		    					
    		    					if(nScrollPos >= nMoreDetailPos && bMoreDetailIsVisible){
    		    						
    		    						bMoreDetailIsVisible = false;
    		    						
    		    						var nudgeProdDetail = WATO.qs('#kk_nudgeProdDetail');
    		    						
    		    						if(nudgeProdDetail !== null && nudgeProdDetail.classList.contains('wa-show-nudge')){
    		    							
    		    							removeNudge(nudgeProdDetail);
    		    						}
    		    						
    		    					} else if(!bMoreDetailIsVisible && nScrollPos < nMoreDetailPos){
    		    						
    		    						bMoreDetailIsVisible = true;
    		    					}
    		    					
    		    					
    		    					if(nScrollPos >= nProdInfosPos && !bProdInfosIsVisible){
    		    						
    		    						bProdInfosIsVisible = true;
    		    					}
    		    				});
    		    				
    		    				if(!getStorage(aNudgeName.sizeadvisor)){
    		    					
    		    					// Timeout für die Anzeige der Box
    		    					window.setTimeout(function(){
    		    						
    		    						if(!bChoseSize && bSizeIsVisible && !bSizeSelectIsVisible){
    		    							
    		    							if(window.getComputedStyle(aSizeAdvisor[0].parentNode).display !== 'none'){
    		    								
    		    								// Parent relativ setzen
	    		    							aSizeAdvisor[0].parentNode.classList.add('wa-pos-relative');
	    		    							
	    		    							aSizeAdvisor[0].insertAdjacentHTML('beforebegin', 
	    	                                            '<div id="kk_nudgeSizeAdvisor">'+
	    	                                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
	    	                                                '<h4>Unsicher, welche Gr&ouml;&szlig;e<br />die richtige ist?</h4>'+
	    	                                                '<p>Mit unserem Gr&ouml;&szlig;enberater finden Sie leicht Ihre richtige Passform und m&uuml;ssen nichts doppelt bestellen. Die Umwelt wird es Ihnen danken!</p>'+
	    	                                            '</div>');
	    		    							
	    		    							var oNudgeSizeAdvisor =  WATO.qs("#kk_nudgeSizeAdvisor");
	    		    							
	    		    							oNudgeSizeAdvisor.classList.add('wa-show-nudge');
	    		    							
	    		    							pushIridionGoal('s6_show_nudge_sizeadvisor');
	    		    							
	    		    							setLocalstorage(aNudgeName.sizeadvisor, false);
	
	    	                                    WATO.qs(".close-button", oNudgeSizeAdvisor).addEventListener('click', function(){
	    	                                    	
	    	                                    	removeNudge(oNudgeSizeAdvisor);
	    	                                    	
	    	                                    	setLocalstorage(aNudgeName.sizeadvisor, true);

	    	                                    	pushIridionGoal('s6_close_nudge_sizeadvisor');
	    	                                    	
	    	                                    	showMoreProdInfos();
	    	                                    });
	    	                                    
	    	                                    aSizeAdvisor[0].addEventListener('click', function(){
	    	                                    	
	    	                                    	removeNudge(oNudgeSizeAdvisor);
	    	                                    	
	    	                                    	showMoreProdInfos();
	    	                                    });
    		    							} else if(!getStorage(aNudgeName.detail)) {
    		    								
    		    								showMoreProdInfos();
    		    							}
    			    					} else {
    			    						showMoreProdInfos();	
    			    					}
    		    					}, nDelayProdInfo);
    		    					
    		    				} else if(!getStorage(aNudgeName.detail)){
    		    					
    		    					showMoreProdInfos();
    		    				}
    		    				
    		    				
    		    				// Nudge Select Size
    		    				if(!getStorage(aNudgeName.selectsize)){
    		    					WATO.elem('#addToCartButton', function(aAddToCart){
    		        					try{
    		        		    			if(aAddToCart){
    		        		    				
    		        		    				aAddToCart[0].addEventListener('mouseenter', function(){

    		        		    					if(!bChoseSize && !getLocalstorage(aNudgeName.selectsize)){
    		        		    						
    		        		    						bSizeSelectIsVisible = true;
    		        		    						
    		        		    						var oNudgeSelectSize =  WATO.qs("#kk_nudgeSelectSize"),
    		        		    							oNudgeProdDetail = WATO.qs("#kk_nudgeProdDetail"),
    		        		    							oNudgeSize = WATO.qs('#kk_nudgeSizeAdvisor');
    		        		    						
    		        		    						if(oNudgeProdDetail !== null && oNudgeProdDetail.style.display !== "none"){
    		        		    							 
    		        		    							oNudgeProdDetail.style.display = "none";
    		        		    						}
    		        		    						if(oNudgeSize !== null && oNudgeSize.style.display !== "none"){
   		        		    							 
    		        		    							oNudgeSize.style.display = "none";
    		        		    						}
    		        		    						
    		        		    						if(oNudgeSelectSize === null){
    		        		    						
    		        		    							// Parent relativ setzen
        		        		    						aSizeSelect[0].parentNode.classList.add('wa-pos-relative');
        		        		    						
        		        		    						if(window.getComputedStyle(aSizeAdvisor[0].parentNode).display !== 'none'){
        		        		    							
        		        		    							aSizeSelect[0].insertAdjacentHTML('beforebegin', 
            		    	                                            '<div id="kk_nudgeSelectSize">'+
            		    	                                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
            		    	                                                '<h4>Bitte w&auml;hlen Sie eine Gr&ouml;&szlig;e aus.</h4>'+
            		    	                                                '<p>Sollten Sie noch unsicher sein, welche Gr&ouml;&szlig;e die richtige ist, nutzen Sie gerne unseren <a href="#" id="wa-size-advisor">Gr&ouml;&szlig;enberater</a>.</p>'+
            		    	                                            '</div>');
        		        		    							
        		        		    							WATO.qs('#wa-size-advisor').addEventListener('click', function(event){
            		    		    								
            		    		    								event.preventDefault();
            		    		    								
            		    		    								removeNudge(oNudgeSelectSize);
            		    		    								
            		    		    								pushIridionGoal('s6_click_nudge_sizeadvisor_link');
            		    		    								
            		    		    								bClickNudgeLink = true;
            		    		    								
            		    		    								aSizeAdvisor[0].click();
            		    		    								
            		    		    								bSizeSelectIsVisible = false;
            		    		    							});
        		        		    							
        		        		    						} else {
        		        		    							
        		        		    							aSizeSelect[0].insertAdjacentHTML('beforebegin', 
            		    	                                            '<div id="kk_nudgeSelectSize">'+
            		    	                                                '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
            		    	                                                '<h4>Bitte w&auml;hlen Sie eine Gr&ouml;&szlig;e aus.</h4>'+
            		    	                                                '<p>Um das Produkt in den Warenkorb zu legen, w&auml;hlen sie bitte die gew&uuml;nschte Gr&ouml;&szlig;e aus.</p>'+
            		    	                                            '</div>');
        		        		    						}
        		    		    							
        		    		    							oNudgeSelectSize =  WATO.qs("#kk_nudgeSelectSize");
        		    		    							
        		    		    							oNudgeSelectSize.classList.add('wa-show-nudge');
        		    		    							
        		    		    							pushIridionGoal('s6_show_nudge_size');
        		    		    							
        		    		    							setLocalstorage(aNudgeName.selectsize, false);

        		    	                                    WATO.qs(".close-button", oNudgeSelectSize).addEventListener('click', function(){
        		    	                                    	
        		    	                                    	removeNudge(oNudgeSelectSize);
        		    	                                    	
        		    	                                    	bSizeSelectIsVisible = false;
        		    	                                    	
        		    	                                    	pushIridionGoal('s6_close_nudge_size');
        		    	                                    	
        		    	                                    	setLocalstorage(aNudgeName.selectsize, true);
        		    	                                    });
    		        		    							
    		        		    						} else {
    		        		    							
    		        		    							oNudgeSelectSize.style.display = 'block';
    		        		    							
    		        		    							oNudgeSelectSize.classList.add('wa-show-nudge');
    		        		    						}
    		        		    					}
    		        		    				});
    		        		    				
    		        		    				aAddToCart[0].addEventListener('click', function(){
    		        		    					
    		        		    					if(WATO.qs('#kk_nudgeSelectSize') !== null && WATO.qs('#kk_nudgeSelectSize').classList.contains('wa-show-nudge')){
    		        		    						
    		        		    						removeNudge(WATO.qs('#kk_nudgeSelectSize'));
    		        		    					}
    		        		    					
    		        		    					if(!bChoseSize){
    		        		    						pushIridionGoal('s6_show_size_error');
    		        		    					}
    		        		    				});
    		        		    			}    			
    		        		    		}catch(error){
    		        		    			showErrorInfo(error);
    		        		    		}
    		        				});
    		    				}
    		    				
    		    				aSizeAdvisor[0].addEventListener('click', function(){
    		    					
    		    					if(!bClickNudgeLink){
    		    						pushIridionGoal('s6_click_size_advisor');	
    		    					}
    		    					
    		    					bClickNudgeLink = false;
		    					});
    		    			}    			
    		    		}catch(error){
    		    			showErrorInfo(error);
    		    		}
    		    	});

    				// Link Mehr Produktdetails
    				WATO.elem('.btn-simple-link.js-pds-more-details', function(aMoreDetails){
    		    		try{
    		    			if(aMoreDetails){
    		    				nMoreDetailPos = aMoreDetails[0].getBoundingClientRect().top + aMoreDetails[0].offsetHeight;
    		    			}    			
    		    		}catch(error){
    		    			showErrorInfo(error);
    		    		}
    		    	});
    				
    				// Sektion Produktdetails
    				WATO.elem('.productInfosItem', function(aProdInfos){
    		    		try{
    		    			if(aProdInfos){
    		    				nProdInfosPos = aProdInfos[0].getBoundingClientRect().top;
    		    			}    			
    		    		}catch(error){
    		    			showErrorInfo(error);
    		    		}
    		    	});
    			}    			
    		}catch(error){
    			showErrorInfo(error);
    		}
    	});

    } else if(URLpath.indexOf("/cart") !== -1){
        // Warenkorb
    	
    	// Nudge geschlossen oder gesehen
        if(!getStorage(aNudgeName.cart)){
        	
        	WATO.elem('a.button.success', function(aCTA){
        		try{
        			if(aCTA){
        				
        				var nNavHeight 		= WATO.qs('div.headerWrapper').offsetHeight,
							nScrollPos 		= window.pageYOffset,
							nCtaTopHeight	= aCTA[0].offsetHeight,
							nCtaTopPos 		= aCTA[0].getBoundingClientRect().top;
        				
        				if(nScrollPos +  nNavHeight >= nCtaTopPos + nCtaTopHeight){
        					
							bCtaIsVisible = false;
						}
        				
        				window.addEventListener('scroll', function(){
	    					nScrollPos = window.pageYOffset + nNavHeight;
	    					    					
	    					if(nScrollPos >= nCtaTopPos + nCtaTopHeight && bCtaIsVisible){
	    						bCtaIsVisible = false;
	    						
	    					} else if(!bCtaIsVisible && nScrollPos < nCtaTopPos){
	    						
	    						bCtaIsVisible = true;
	    					}
	    				});
        				
        				
        				// Timeout für die Anzeige der Nudge
    					window.setTimeout(function(){

    						if(bCtaIsVisible){
    							// Parent relativ setzen
    							aCTA[0].parentNode.classList.add('wa-pos-relative');
    							
    							
    							aCTA[0].insertAdjacentHTML('beforebegin', 
                                        '<div id="kk_nudgeCart_top">'+
                                            '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
                                            '<h4>Flexibel zuhause entscheiden</h4>'+
                                            '<p>Mit <b>Kauf auf Rechnung</b> haben Sie 14 Tage Zeit, die Ware anzuprobieren. Sollte Ihnen etwas nicht passen oder gefallen, können Sie einfach unseren <b>kostenlosen Retouren-Service</b> nutzen.</p>'+
                                        '</div>');

    							var oNudgeCartTop =  WATO.qs("#kk_nudgeCart_top");
    							
    							oNudgeCartTop.classList.add('wa-show-nudge');

                                WATO.qs(".close-button", oNudgeCartTop).addEventListener('click', function(){
                                	
                                	removeNudge(oNudgeCartTop);
                                	
                                	pushIridionGoal('s6_close_nudge_cart');
                                	
                                	setLocalstorage(aNudgeName.cart, true);

                                });
                               
	    					} else {
	    						aCTA[1].parentNode.classList.add('wa-pos-relative');
	    						
	    						aCTA[1].insertAdjacentHTML('beforebegin', 
                                        '<div id="kk_nudgeCart_bottom">'+
                                            '<button class="align-right close-button js-actionbar-close" type="button" data-close=""><span>&times;</span></button>'+
                                            '<h4>Flexibel zuhause entscheiden</h4>'+
                                            '<p>Mit <b>Kauf auf Rechnung</b> haben Sie 14 Tage Zeit, die Ware anzuprobieren. Sollte Ihnen etwas nicht passen oder gefallen, können Sie einfach unseren <b>kostenlosen Retouren-Service</b> nutzen.</p>'+
                                        '</div>');
	    						
	    						var oNudgeCartBottom =  WATO.qs("#kk_nudgeCart_bottom");
	    						
	    						oNudgeCartBottom.classList.add('wa-show-nudge');
	    						
	    						WATO.qs(".close-button", oNudgeCartBottom).addEventListener('click', function(){
	    							
	    							removeNudge(oNudgeCartBottom);
	    							
	    							pushIridionGoal('s6_close_nudge_cart');
	    							
	    							setLocalstorage(aNudgeName.cart, true);
	                             });
	    					}

    						pushIridionGoal('s6_show_nudge_cart');
							
							setLocalstorage(aNudgeName.cart, false);
    						
    					}, nDelayCart);
        			}
        		} catch(error){
	    			showErrorInfo(error);
	    		}
        	});
        }
    }

})(new window.WATO(), window);