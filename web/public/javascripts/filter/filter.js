var getQueryStringValueByName = require('../utils/getQueryStringValueByName.js');
var ProgressIndicator = require('./ProgressIndicator.js');
var CHECKING_FOR_PICTURE_INTERVAL = 1500;

var $btnProcessPicture = $('#btnProcessPicture');

var progressIndicator = new ProgressIndicator({
    waitForProcessingMessage: "please wait while processing",
    animationInterval: 350,
    loaderCharCount: 5
});

progressIndicator.onAnimationChanged = function(animation) {
    $btnProcessPicture.html(animation);
};

$btnProcessPicture.click(function(){
    var albumId = getQueryStringValueByName('albumId');
    var pictureId = getQueryStringValueByName('pictureId');
    
    $.ajax({
        url: "/process",
        data: {
            albumId: albumId,
            pictureId: pictureId
        },
        error: function() {
            console.log(arguments);
        }
    }).done(function(data) {
        var result = JSON.parse(data);
        if(result.success === true) {
            progressIndicator.waitForProcessing();
            checkIfPictureProcessed(result.pictureUrl);
        }
    });
});

var $imgAfterProcessed;
function checkIfPictureProcessed(url) {
    if($imgAfterProcessed === undefined) {
        var img = new Image();
        img.id = "imgAfterProcessed";
        img.src = url;
        img.style.display = "none";
        $('#divAfterProcessed').append(img);
        $imgAfterProcessed = $('#imgAfterProcessed');
    }

    $imgAfterProcessed.attr('src', url);
    
    $imgAfterProcessed.one('load', function() {
        progressIndicator.done();
        $btnProcessPicture.hide();
        $imgAfterProcessed.show();
    }).one('error', function() {
        console.log('bad');
        setTimeout(function() { 
            checkIfPictureProcessed(url); 
        }, CHECKING_FOR_PICTURE_INTERVAL);
    }).each(function() {
        if(this.complete)
            $(this).load();
    });

}

