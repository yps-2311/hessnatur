try {
    var wa_uri = window.document.location.href,
        wa_path = window.document.location.pathname;

    window.iridion = window.iridion || [];

    if(wa_uri === "https://www.hessnatur.com/de/"){
        // Startseite
        window.iridion.push(['goal', 'page_home']);

    }else if(wa_path.indexOf("/p/") !== -1){
        // Produktdetailseite
        window.iridion.push(['goal', 'page_pds']);

        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
            this.addEventListener("load", function() {
                if(this.readyState === 4 && uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1){
                    window.iridion.push(['goal', 'click_addToCart']);
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
        window.iridion.push(['goal', 'page_cat']);

    }else if(wa_path.indexOf("/de/cart") !== -1){
        // Warenkorb
        window.iridion.push(['goal', 'page_cart']);

    }else if(wa_path.indexOf("/register/guest-update") !== -1){
        // Gast Regestrierung
        window.iridion.push(['goal', 'page_guest']);

    }else if(wa_path.indexOf("/register") !== -1){
        // Neukunde Regestrierung
        window.iridion.push(['goal', 'page_reg']);
        
    }else if(wa_path.indexOf("/login") !== -1){
        // Login Regestrierung
        window.iridion.push(['goal', 'page_signin']);

        var wa_loginButtonInterval = setInterval(function(){
            var $wa_loginButton = window.document.querySelector("#loginForm .text-right .button");
            if($wa_loginButton){
                clearInterval(wa_loginButtonInterval);
                $wa_loginButton.addEventListener("click",function(){
                    window.iridion.push(['goal', 'page_login']);
                });
            }
        },100);
        setInterval(function(){
            clearInterval(wa_loginButtonInterval);
        },5000);
        
    }else if(wa_path.indexOf("/addresses/add-delivery-address") !== -1){
        // Adresse
        window.iridion.push(['goal', 'page_address']);
        
    }else if(wa_path.indexOf("/payment/add-payment-method") !== -1){
        // Bezahungsart
        window.iridion.push(['goal', 'page_pay']);
        
    }else if(wa_path.indexOf("/summary") !== -1){
        // Zusammenfassung
        window.iridion.push(['goal', 'page_sum']);
        
    }else if(wa_path.indexOf("/checkout/orderConfirmation") !== -1){
        // Danke
        window.iridion.push(['goal', 'page_conv']);


        // Revenue
        var wa_interval = setInterval(function(){
            if(!!emospro && !!emospro.billing){
                var wa_price = 0;
                if(emospro.billing.length > 3){
                    clearInterval(wa_interval);
                    wa_price = emospro.billing[3];
                }else if(!!emospro.ec_Event.length > 0){
                    clearInterval(wa_interval);
                    wa_price = emospro.ec_Event[0].price;
                }

                if(wa_price > 0){
                    window.iridion.push(["revenue", wa_price, "revenue"]);
                }
            }
        }, 100);
        
    }
    
    
    
} catch (error) {
    // console.log(error);
}