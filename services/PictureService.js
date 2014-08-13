var SQSController = require('../components/SQSController.js');
    
PictureService.PictureSQSAddress = 'https://sqs.us-west-2.amazonaws.com/983680736795/emilSQS';

function PictureService() {
    this.pictureSQSController = new SQSController(PictureService.PictureSQSAddress);
    this.injectPictureSQSController = function(controller) {
        this.pictureSQSController = controller;
    };

    this.sendPictureToProcessingQueue = function(albumId, pictureId, done) {
        var message = JSON.stringify({
            albumId: albumId,
            pictureId: pictureId
        });
        this.pictureSQSController.sendMessage(message, done);
    };

    this.readPictureFromProcessingQueue = function(done) {
        this.pictureSQSController.readMessage(function(message, body) {
            done(JSON.parse(body));
        });
    };
}

module.exports = PictureService;
