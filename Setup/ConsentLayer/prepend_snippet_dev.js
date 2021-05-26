(function(){

    try {

        var ucSettings = localStorage.getItem('ucSettings');
        
        if(ucSettings){
            
            ucSettings = JSON.parse(ucSettings);

            for(var containerId in ucSettings){

                var ucConsents  = ucSettings[containerId].ucConsents;
                var templates   = ucConsents.consentTemplates;
                var consents    = ucConsents.consents;
    
                for(var key in templates){

                    for(var version in templates[key]){
    
                        // get the template id out of the uc templates
                        if(templates[key][version].dataProcessor === "Iridion"){
    
                            // get the current consent status
                            for(var i = 0; i < consents.length; i++){
                                if(consents[i].templateId === key){

                                    if(!consents[i].consentStatus){
                                        console.log("stop iridion");
                                    } else {
                                        console.log("do not stop iridion");
                                    }
                                    return consents[i].consentStatus;
                                }
                            }
                            return true;
                        }
                    }
                }
            }
        }
    } catch(e){
        console.log(e);
    }
})();