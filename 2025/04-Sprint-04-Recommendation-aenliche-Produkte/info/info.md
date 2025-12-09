# Hessnatur: S4 - PDP Recommendation Ähnliche Artikel

## Link zum Ticket: https://app.asana.com/1/764572328486306/project/1208332833642930/task/1211754451002366?focus=true


## Reco Widget 202 ähnliche Artikel 
<div id="ecRecommendationsContainer_202>Loading...</div>
<script type="text/javascript">
// Setup widget, load data and render using defined template
var widget = new econda.recengine.Widget({
   element: document.getElementById('ecRecommendationsContainer_202'),
   renderer: {
      type: 'template',
      uri: '/path/to/my/template.html'
   },
   accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
   id: '202'
});
widget.render();
</script>




## Programmier Ansatz
- API Request nachbauen, un dann in Bestehende Reco integrieren, und Produkte tauschen. 
- Preisdarstellung manchmal konfus über die verscheidenen Objects 
- Innerhalb der Regel, werden Gleiche Produkte in unterschiedlichen Größen ausgewiesen -> Entscheidung diese zu deduplizieren  
- Produkte aus der Reco werden im Session Storage gecached um performanter zu werden 

## Zu Testen: 
- keine Produkt dopplungen
- Wishlist Funktion für verschiedene Countries 
- Performance, läsdt es ähnlich schnell wie die alte Reco 
-Klappt aktuell gut für: https://www.hessnatur.com/de/strick-pullover-regular-aus-bio-merinowolle-mit-kaschmir/p/5751696M?queryID=92af9603190ae205feeda4bf9281c2ed&objectID=id_5751606XXL&indexName=hna-product-de-de-styleCode
- Bei manchen Referenz Produkten kommt von Econda nicht genug zurück 

## OFFEN / TODO:
- **Wishlist-Button funktioniert nicht:** Die GUID für die Wishlist-API wird nicht korrekt ermittelt. Muss geprüft werden wo hessnatur die GUID speichert (Cookie, localStorage, sessionStorage, __NEXT_DATA__). Aktuell wird eine neue GUID generiert, aber die API akzeptiert diese möglicherweise nicht.

## TBD: 
- sollte der Produktlink gleich auf die Variantengröße Linken? Wäre eigenlich sehr komfortabel, dann müsste man den link ensprechend über die SKU modfizieren
- sollte man generell die entsprechenden größen anzeigen labeln? (nicht in diesem Test) 