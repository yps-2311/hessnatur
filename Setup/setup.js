(function(window){
    try {
        var wa_uri = window.document.location.href,
            wa_path = window.document.location.pathname;
    
        // window.iridion = window.iridion || [];

        function goalPush(key){
            window.iridion.push(['goal', key]);
        }
    
        if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(wa_uri)){
            // Startseite
            goalPush('page_home');

        }else if(wa_path.indexOf("/p/") !== -1){
            // Produktdetailseite
            goalPush('page_pds');
    
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
                this.addEventListener("load", function() {
                    if(this.readyState === 4 && uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1){
                        goalPush('click_addToCart');
                    }
                }, false);
                origOpen.call(this, method, uri, async, user, pass);
            };
    
        }else if(wa_path.indexOf("/de/damen") !== -1 ||
                wa_path.indexOf("/de/herren") !== -1 ||
                wa_path.indexOf("/de/baby") !== -1 ||
                wa_path.indexOf("/de/home") !== -1 ||
                wa_path.indexOf("/de/sale") !== -1
                ){
            // Kategorie
            goalPush('page_cat');
    
        }else if(wa_path.indexOf("/de/cart") !== -1){
            // Warenkorb
            goalPush('page_cart');
    
        }else if(wa_path.indexOf("/register/guest-update") !== -1){
            // Gast Regestrierung
            goalPush('page_guest');
    
        }else if(wa_path.indexOf("/register") !== -1){
            // Neukunde Regestrierung
            goalPush('page_reg');
            
        }else if(wa_path.indexOf("/login") !== -1){
            // Login Regestrierung
            goalPush('page_signin');
    
            var wa_loginButtonInterval = setInterval(function(){
                var $wa_loginButton = window.document.querySelector("#loginForm .text-right .button");
                if($wa_loginButton){
                    clearInterval(wa_loginButtonInterval);
                    $wa_loginButton.addEventListener("click",function(){
                        goalPush('page_login');
                    });
                }
            },100);
            setInterval(function(){
                clearInterval(wa_loginButtonInterval);
            },5000);
            
        }else if(wa_path.indexOf("/addresses/add-delivery-address") !== -1){
            // Adresse
            goalPush('page_address');
            
        }else if(wa_path.indexOf("/payment/add-payment-method") !== -1){
            // Bezahungsart
            goalPush('page_pay');
            
        }else if(wa_path.indexOf("/summary") !== -1){
            // Zusammenfassung
            goalPush('page_sum');
            
        }else if(wa_path.indexOf("/checkout/orderConfirmation") !== -1){
            // Danke
            goalPush('page_conv');
    
            try {
                // Revenue
                var wa_interval = setInterval(function(){
                    if(typeof window.emospro !== "undefined"){
                        var wa_price = 0,
                            wa_buyid = "";
    
                        if(emospro.billing && emospro.billing.length > 3){
                            clearInterval(wa_interval);
                            wa_price = emospro.billing[3];
                            wa_buyid = emospro.billing[0];
                        }
                        if(wa_price === 0 && emospro.ec_Event && emospro.ec_Event.length > 0){
                            clearInterval(wa_interval);
                            wa_price = emospro.ec_Event[0].price;
                        }
                        // console.log('wa_price: ', wa_price);
                        // console.log('wa_buyid: ', wa_buyid);
    
                        if(parseInt(wa_price) > -1){
                            window.iridion.push(["revenue", wa_price, wa_buyid]);
                        }
                    }
                }, 100);
                setTimeout(function(){
                    clearInterval(wa_interval);
                }, 3000);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
})(window);