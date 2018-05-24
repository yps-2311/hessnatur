(function(window){

    function goalPush(key){
        window.iridion.push(['goal', key]);
    }

    try {

        var URL = document.URL;

        if(new RegExp(/.*hessnatur.com\/de\/?($|((\?|\#).*))/).test(URL)){
            // Startseite
            goalPush('page_home');
        }else if(URL.indexOf("/p/") !== -1){
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
    
        }else if(
            URL.indexOf("/de/damen") !== -1 ||
            URL.indexOf("/de/herren") !== -1 ||
            URL.indexOf("/de/baby") !== -1 ||
            URL.indexOf("/de/home") !== -1 ||
            URL.indexOf("/de/sale") !== -1
        ){

            // Kategorie
            goalPush('page_cat');
        }else if(URL.indexOf("/de/cart") !== -1){

            // Warenkorb
            goalPush('page_cart');
        }else if(URL.indexOf("/register/guest-update") !== -1){
            
            // Gast Regestrierung
            goalPush('page_guest');
        }else if(URL.indexOf("/register") !== -1){

            // Neukunde Regestrierung
            goalPush('page_reg');
        }else if(URL.indexOf("/login") !== -1){

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
            
        }else if(URL.indexOf("/addresses/add-delivery-address") !== -1){
            // Adresse
            goalPush('page_address');
            
        }else if(URL.indexOf("/payment/add-payment-method") !== -1){
            // Bezahungsart
            goalPush('page_pay');
            
        }else if(URL.indexOf("/summary") !== -1){
            // Zusammenfassung
            goalPush('page_sum');
            
        }else if(URL.indexOf("/checkout/orderConfirmation") !== -1){
            // Danke
            goalPush('page_conv');
    
            // Revenue
            var wa_interval = setInterval(function(){

                try {
                    if(typeof window.emospro !== "undefined"){

                        var wa_price = 0,
                            wa_buyid = "";
    
                        if(window.emospro.billing && window.emospro.billing.length > 3){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.billing[3];
                            wa_buyid = window.emospro.billing[0];
                        }
                        if(wa_price === 0 && window.emospro.ec_Event && window.emospro.ec_Event.length > 0){
                            clearInterval(wa_interval);
                            wa_price = window.emospro.ec_Event[0].price;
                        }
    
                        if(parseInt(wa_price) !== 0){
                            window.iridion.push(["revenue2", wa_price, wa_buyid]);
                        }else{
                            goalPush('error_revenue');
                        }
                    }
                } catch (error) {
                    // console.log(error);
                    goalPush('error_revenue');
                }
            }, 100);

            setTimeout(function(){
                clearInterval(wa_interval);
            }, 3000);
        }
    } catch (error) {
        // console.log(error);
        goalPush('error_setup');
    }
})(window);