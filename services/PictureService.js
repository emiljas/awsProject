var SQSController = require("../components/SQSController.js");

function PictureService() {
    this.pictureSQSController = new SQSController();
    
}

PictureService.prototype.addPictureToProcessingQueue = function(albumId, pictureId, done) {
    var message = JSON.stringify({
        albumId: albumId,
        pictureId: pictureId
    });
    
    message = 'as';
    this.pictureSQSController.sendMessage(message, done);
};

module.exports = PictureService;