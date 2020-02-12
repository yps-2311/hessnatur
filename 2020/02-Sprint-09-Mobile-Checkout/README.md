
#### JavaScript & CSS per Import implementieren ####
@import url("URLPLATZHALTER/src/variation-01/style.css");
jQuery.getScript("URLPLATZHALTER/src/variation-01/script.min.js", function(data, textStatus, jqxhr){});


#### jQuery über CDN einbinden ####
<script src="http://code.jquery.com/jquery-latest.min.js"></script>


#### JavaScript & CSS per Tag implementieren ####
<link rel="stylesheet" href="URLPLATZHALTER/src/global/global.css">
<link rel="stylesheet" href="URLPLATZHALTER/src/variation-01/style.css">

<script type="text/javascript" src="URLPLATZHALTER/src/global/global.min.js"></script>
<script type="text/javascript" src="URLPLATZHALTER/src/variation-01/script.min.js"></script>


#### JSDoc ####
Automatische Erstellung einer Dokumentation

01) npm install
02) grunt
