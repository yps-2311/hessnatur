

// Doku zur Gallery: https://www.magictoolbox.com/magiczoom/integration/


jQuery(".pds-productImage__mzKeyVisualWrapper.show-for-large").after(
    '<div class="kk_pic" style="width: 300px;">'+
        '<img src="'+jQuery(".thumbnailContainer:nth-child(2)").attr("href")+'">'+ //<a href="'+jQuery(".thumbnailContainer:nth-child(2)").attr("href")+'" class="MagicZoom">
    '</div>'
);

jQuery(".thumbnailContainer").each( function(){
    var self = $(this);
    console.log('self: ', self);

    self.click(function() {
        // console.log('e.next().attr("href"): ', self.next().next().attr("href"));
        var nextPic = self.next().next();
        console.log('nextPic: ', nextPic);
        if(nextPic.attr("href").length <= 0){
            nextPic = jQuery(".thumbnailContainer").first();
        }
        // jQuery(".kk_pic").html('<a href="'+nextPic.attr("href")+'" class="MagicZoom"><img src="'+nextPic.attr("href")+'"></a>');
        jQuery(".kk_pic").html('<img src="'+nextPic.attr("href")+'">');
        // MagicZoom.refresh();
    });
});