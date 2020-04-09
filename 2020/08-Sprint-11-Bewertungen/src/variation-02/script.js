// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */

(function(WATO) {
    "use strict";

    console.log(2);

    var greenThumb = '<img class="greenthumb" src="https://kk-ffm.s3.eu-central-1.amazonaws.com/loesdau/2020/sprint11/thumb.svg">';

    WATO.elem('#footer', function(element){
        if(element){
            var allProductRatings = WATO.qsa(".kategorie-artikelbewertung");

            for (var i = 0; i < allProductRatings.length; i++) {
                var thisRating = allProductRatings[i],
                    ratingText = WATO.qs(".bewertung-bewertung", thisRating);

                ratingText.innerHTML = "(" + ratingText.innerHTML.split("(")[1] + greenThumb;
                ratingText.parentNode.insertAdjacentHTML('afterend', 
                    '<tr><td colspan="2" class="kk_rating">'+
                        '94% positive Bewertungen'+
                    '</td></tr>'
                );

                thisRating.previousElementSibling.insertAdjacentElement('beforebegin', thisRating);
            }
        }
    });


    WATO.elem('#stage-rating', function(ratingLine){
        if(ratingLine){
            ratingLine = ratingLine[0];

            var link = WATO.qs("a", ratingLine),
                headline = WATO.qs("#productHeadline"),
                imgSrc = WATO.qs("img", link).getAttribute('src'),
                menge = link.textContent.match(/\d+/g),
                existsGreenThumb = "",
                ratingValue = "";

            link.innerHTML = '<img src="'+imgSrc+'"> ('+menge+') ' +
                '<div class="kk_positiv"></div>';
            
            headline.insertAdjacentElement('afterend', ratingLine);

            WATO.elem('#itemRating > p:last-child', function(itemRating){
                if(itemRating){
                    var prodRating = parseInt(itemRating[0].textContent.match(/\d+ \%/g)[0].replace("%","")),
                        positivBox = WATO.qsa(".kk_positiv"),
                        infobox = WATO.qs(".kk_box p b");

                    if(prodRating >= 90){
                        for (var i = 0; i < positivBox.length; i++) {
                            var thisPositivBox = positivBox[i]
                            thisPositivBox.innerHTML = prodRating + '% positive Bewertungen';
                            thisPositivBox.insertAdjacentHTML('beforebegin', greenThumb);
                            existsGreenThumb = greenThumb;
                        }
                    }

                    ratingValue = prodRating;
                    if(infobox){
                        infobox.insertAdjacentHTML('afterbegin', 
                            prodRating
                        );
                    }
                }
            });

            WATO.elem('#ratings h2.subline', function(subline){
                if(subline){
                    console.log('existsGreenThumb: ', existsGreenThumb);
                    subline[0].insertAdjacentHTML('afterend', 
                        '<div class="kk_positiv"><img src="'+imgSrc+'"> ('+menge+') '+existsGreenThumb+'</div>'
                    );
                }
            });

            function getXHR(sendtype ,url, callback) {
        
                var XHR = new XMLHttpRequest();
        
                // Set up our request
                XHR.open(sendtype, url);
                
                // Add the required HTTP header for form data POST requests
                // XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
                XHR.onreadystatechange = function() { // Call a function when the state changes.
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        // Request finished. Do processing here.
                        callback(this);
                    }
                };
        
                // Finally, send our data.
                XHR.send();
            }

            WATO.elem('.produkt-bewertungen', function(produktBewertungen){
                if(produktBewertungen){
                    produktBewertungen[0].insertAdjacentHTML('afterbegin', 
                        '<div class="kk_box">'+
                            '<h3>'+headline.textContent+'</h3>'+
                            '<p><b>'+ratingValue+'% der Kunden</b> haben ihren Kauf von „Pikeur Rollkragen Pullover von Sina“ positiv bewertet<br>'+
                            '<b>('+WATO.qs("#itemRating p:last-child").innerHTML.split("Kunden")[0].split("- ")[1]+' Kunden)</b></p>'+
                            '<span><img src="https://kk-ffm.s3.eu-central-1.amazonaws.com/loesdau/2020/sprint09/check.svg">Verifizierte Käufe</span>'+
                        '</div>'
                    );
                }
            });

            

            WATO.elem('.produkt-bewertungen-ueberschrift', function(bewertungen){
                if(bewertungen){
                    bewertungen[0].innerHTML = menge+" Bewertungen ansehen:";
                }
            });

            getXHR("GET", WATO.qs(".iframe-content").getAttribute("href"), function(response){
                console.log('response: ', response.responseText);
                
            });


        }
    });
    

})(new window.WATO());