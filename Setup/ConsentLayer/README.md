# Consent Layer

## Usercentrics LocalStorage
Die Datei `./usercentrics.json` beinhaltet ein Beispiel der LocalStorage Variable von Usercentrics von dem Testsystem `https://sf.acc.hess-webshop-dev-760c.gcp.get-cloud.io/de/`.  

Eine LocalStorage Variable `ucConsent` wird nach einem Consent erstellt. Unter `consentTemplates` (Array) sind die jeweiligen Tools hinterlegt, dort findet man u.a. den Namen Iridion, aber auch die Anschrift, Name des Datenschutzbeauftragten usw.  

Jedes Tool hat eine `templateId` (Hash). Unter `consents` (Array) ist der jeweilige Status eines Tools als JSON Objekt hinterlegt. Jedes Objekt beinhaltet die `templateId`, worüber ein Matching mit Iridion möglich ist.  

Die Variable `consentStatus` (Boolean) gibt uns die Information über eine Einwilligung des Nutzers.  