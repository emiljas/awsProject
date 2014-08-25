var getQueryStringValueByName = require('../utils/getQueryStringValueByName.js');
var ProgressIndicator = require('./ProgressIndicator.js');
var CHECKING_FOR_PICTURE_INTERVAL = 1500;


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
        var result = JSON.parse(data);
        if(result.success === true) {
            var progressIndicator = new ProgressIndicator({
                waitForProcessingMessage: "please wait while processing",
                animationInterval: 350,
                loaderCharCount: 5
            });
            progressIndicator.onAnimationChanged = function(animation) {
                $btnProcessPicture.html(animation);
            };

            console.log(result.pictureUrl);

            progressIndicator.waitForProcessing();

            checkIfPictureProcessed(result.pictureUrl);



        }
    });
});

function checkIfPictureProcessed(url) {
    $.get(url)
        .done(function() { 
            $('afterProcessedDiv').append("<img src='" + url + "' />");
        }).fail(function() { 
            console.log('fail');
            setTimeout(function() { 
                checkIfPictureProcessed(url); 
            }, CHECKING_FOR_PICTURE_INTERVAL);
        });
}

