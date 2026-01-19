/*
 * !LOAD KEK OBJECT
 * @codekit-prepend "../vendor/KEK.js";
 * @prepros-prepend "../vendor/KEK.js";
 * 
 * OPTIONAL
 * @ codekit-append "pds.js"; 
 */

/**
 * @function
 * @author Max Mustermann
 * @namespace G
 * @name Global
 * @description
 */
(function(KEK) {
    "use strict";

    /**
     * @function observe
     * @memberOf KEK
     * @author Manuel Brückmann
     * @description MutationObserver für SPA-Elemente – feuert bei jedem Erscheinen
     *
     * @param { string } selector - CSS Selector des zu beobachtenden Elements
     * @param { function } callback - Wird bei jedem Erscheinen des Elements ausgeführt
     * @return { MutationObserver } - Observer-Instanz (zum Disconnecten)
     */
    KEK.prototype.observeElement = function(selector, callback) {
        const _self = this;
        const observer = new MutationObserver(function() {
            const el = _self.qs(selector);
            if (el && !el.hasAttribute('data-kek-init')) {
                el.setAttribute('data-kek-init', 'true');
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return observer;
    };

    //Base is a recommendation on Hessnatur

    /*
    KEK.prototype.MUSTERSPRINT = function(){

		KEK = this;
    
        // KEK.log
        KEK.log("KEK.log | log something");
    
        // KEK.elem
        KEK.log("KEK.elem | select #kk_insertion");
        KEK.elem('#kk_insertion', reco => {
            if(reco){
    
                // KEK.qs
                KEK.log("KEK.qs | select first div");
                KEK.qs('div');
    
                KEK.log("KEK.qs | select first div with parent");
                KEK.qs('div', reco[0].parentElement);
    
                // KEK.qsa
                KEK.log("KEK.qsa | select all divs");
                KEK.qs('div');
    
                KEK.log("KEK.qsa | select all divs with parent");
                KEK.qs('div', reco[0].parentElement);
    
                // KEK.ajax
                KEK.ajax('hessnatur.com/products', payload => {
                    KEK.log("KEK.ajax | method:open | get hessnatur.com/products payload", payload);
                }, { event: "loadend" });//payload könnte man eig immer mitnehmen
    
                KEK.ajax('hessnatur.com/products', payload => {
                    KEK.log("KEK.ajax | method:send | get hessnatur.com/products payload", payload);
                }, {event: "loadend", method: "send" });
    
                // KEK.insert
                KEK.log("KEK.insert | Take Reco and duplicate it");
                KEK.insert(reco[0], 'afterend', reco[0].cloneNode(true));
    
                // KEK.defineClass
                KEK.log("KEK.defineClas | Give the Reco a new class, called 'lurch'");
                KEK.defineClass(reco[0], "lurch");
    
                KEK.log("KEK.defineClass | Give the Reco a new class, called 'link'");
                KEK.defineClass(reco[0], "link");
    
                KEK.log("KEK.defineClass | Change the Recos 'link' Class to 'schmink' class");
                KEK.defineClass(reco[0], "link", "schmink");
            }
        });
    
        (async () => {
                KEK.poll({
                    wFor: '#kk_insertion',
                    aWy: () => console.log("anyway"),
                    hE: () => console.log("KEK.poll has error"),
                    cb: node => {
                        console.log("der node", node);
                    },
                    i: 1,
                    t_out: 100,
                    inst: "UX1337"
                });
    
                setTimeout(() => {
                    KEK.poll({
                        wFor: '#kk_insertion',
                        aWy: () => console.log("anyway"),
                        hE: () => console.log("KEK.poll has error"),
                        cb: node => {
                            console.log("der node", node);
                        },
                        i: 1,
                        t_out: 100,
                        inst: "UX1337"
                    });
                }, 2000);
    
                setTimeout(() => {
                    KEK.poll({
                        wFor: '#thrtnhn',
                        aWy: () => console.log("anyway"),
                        hT: () => console.log("KEK.poll found nothing"),
                        hE: () => console.log("KEK.poll has error"),
                        cb: node => {
                            console.log("der node", node);
                        },
                        i: 1,
                        t_out: 100,
                        inst: "UX1337"
                    });
                }, 2000);
        })();
	};

    */

	
})(window.KEK);
