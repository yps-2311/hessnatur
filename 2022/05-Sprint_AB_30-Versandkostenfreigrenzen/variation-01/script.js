// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function(WATO) {
    "use strict";
    console.log("v1");

    async function init (){
        const location = window.location.pathname;

        if(location.includes('/p/')){
            
            try{

                let wrapper = await WATO.asyncElem('.kk_cta_uvps ul');
                console.log("wrapper", wrapper);
                wrapper = wrapper[0];

                console.log("wrapper", wrapper);

                wrapper.insertAdjacentHTML('beforeend', 
                '<li>Kostenloser Versand ab 100€</li>'
                );

            } catch(e){
                //push Error: Fail
            }
            
        } else if(location.includes('/cart')){
            
            try{

                let oldDeliv = await WATO.asyncElem('.column.small-12.text-right.h-text-muted.h-xsmallOffset-top-outer');
                oldDeliv = oldDeliv[0].parentElement;// identifier war sonst irgendwie unklar

                oldDeliv.insertAdjacentHTML('afterend', 
                '<div>Ich rede Zeug</div>'
                )

                console.log("oldDeliv",oldDeliv)

            } catch(e){
                //push Error: Fail
            }
            
        }
    }

    init();
    //.kk_cta_uvps
})(new window.WATO());
