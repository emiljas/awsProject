var PictureSQSController = require('../components/PictureSQSController.js');

function PictureService() {
    this.pictureSQSController = new PictureSQSController();
}

PictureService.prototype.addPictureToProcessingQueue = function(albumId, pictureId, done) {
    var message = JSON.stringify({
        albumId: albumId,
        pictureId: pictureId
    });
    this.pictureSQSController.sendMessage(message, done);
};

module.exports = PictureService;
