try {
    var wa_uri = window.document.location.href,
        wa_path = window.document.location.pathname;

    window.iridion = window.iridion || [];

    if(wa_uri === "https://www.hessnatur.com/de/"){
        // Startseite
        window.iridion.push(['goal', 'page_home']);
        console.log("Startseite");

    }else if(wa_path.indexOf("/p/") !== -1){
        // Produktdetailseite
        window.iridion.push(['goal', 'page_pds']);
        console.log("Produktdetailseite");

        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
            this.addEventListener("load", function() {
                if(this.readyState === 4 && uri.indexOf("https://www.hessnatur.com/de/cart/add") !== -1){
                    window.iridion.push(['goal', 'click_addToCart']);
                    console.log("add to Cart");
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
        console.log("Kategorie");

    }else if(wa_path.indexOf("/de/cart") !== -1){
        // Warenkorb
        window.iridion.push(['goal', 'page_cart']);
        console.log("Warenkorb");

    }else if(wa_path.indexOf("/register/guest-update") !== -1){
        // Gast Regestrierung
        window.iridion.push(['goal', 'page_guest']);
        console.log("Gast Regestrierung");

    }else if(wa_path.indexOf("/register") !== -1){
        // Neukunde Regestrierung
        window.iridion.push(['goal', 'page_reg']);
        console.log("Neukunde Regestrierung");
        
    // }else if(wa_path.indexOf("/login") !== -1){
        // Login Regestrierung
        // window.iridion.push(['goal', 'page_reg']);
        // console.log("Neukunde Regestrierung");
        
    }else if(wa_path.indexOf("/addresses/add-delivery-address") !== -1){
        // Adresse
        window.iridion.push(['goal', 'page_address']);
        console.log("Neukunde Regestrierung");
        
    }else if(wa_path.indexOf("/payment/add-payment-method") !== -1){
        // Bezahungsart
        window.iridion.push(['goal', 'page_pay']);
        console.log("Bezahungsart");
        
    }else if(wa_path.indexOf("/summary") !== -1){
        // Zusammenfassung
        window.iridion.push(['goal', 'page_sum']);
        console.log("Zusammenfassung");
        
    }else if(wa_path.indexOf("/checkout/orderConfirmation") !== -1){
        // Danke
        window.iridion.push(['goal', 'page_conv']);
        console.log("Danke");
        
    }
    
    
    
} catch (error) {
    console.log(error);
}