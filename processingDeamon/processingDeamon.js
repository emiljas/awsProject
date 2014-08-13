var PictureService = require('../services/PictureService.js');
var waitTimeInMilliseconds = 1000;

var pictureService = new PictureService();

var processImage = function() {
    pictureService.readPictureFromProcessingQueue(function(picture) {
        if(picture !== null)
            processPicture(picture);

        nextAction();
    });
};

function processPicture(picture) {
    console.log(picture);
}

nextAction();

function nextAction() {
    setTimeout(function() { processImage(); }, waitTimeInMilliseconds);
}
