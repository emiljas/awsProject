var SQSController = require('../components/SQSController.js');
var PicasaClient = require('../components/PicasaClient.js');
var S3Client = require('../components/S3Client.js');
var makePath = require('../utils/PathUtils.js').makePath;
    
PictureService.PictureSQSAddress = 'https://sqs.us-west-2.amazonaws.com/983680736795/emilSQS';

function PictureService() {
    this.pictureSQSController = new SQSController(PictureService.PictureSQSAddress);
    this.injectPictureSQSController = function(controller) {
        this.pictureSQSController = controller;
    };

    this.PicasaClient = PicasaClient;
    this.injectPicasaClient = function(Client) {
        this.PicasaClient = Client;
    };

    this.S3Client = S3Client;

    this.sendPictureToProcessingQueue = function(info, done) {
        var picasaClient = new this.PicasaClient(info.accessToken);
        var picture = picasaClient.getPicture(info.albumId, info.pictureId, function(picture) {
            picture.albumId = info.albumId;
            picture.pictureId = info.pictureId;
            var message = JSON.stringify(picture);
            this.pictureSQSController.sendMessage(message, done);
        }.bind(this));
    };

    this.readPictureFromProcessingQueue = function(done) {
        this.pictureSQSController.readMessage(function(message, body) {
            done(JSON.parse(body));
        });
    };

    this.generatePictureS3ObjectName = function(picture) {
        return makePath('proccessedPictures', 
                         picture.albumId, 
                         picture.pictureId, 
                         picture.fileName);
    };
}

module.exports = PictureService;
