var getQueryStringValueByName = require('../utils/getQueryStringValueByName.js');
var ProgressIndicator = require('./ProgressIndicator.js');


var $btnProcessPicture = $('#btnProcessPicture');
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
        if(data === "success") {
            var progressIndicator = new ProgressIndicator({
                waitForProcessingMessage: "please wait while processing",
                animationInterval: 350,
                loaderCharCount: 5
            });
            progressIndicator.onAnimationChanged = function(animation) {
                $btnProcessPicture.html(animation);
            };
            progressIndicator.waitForProcessing();
        }
    });
    
});
