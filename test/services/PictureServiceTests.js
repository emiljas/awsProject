var expect = require('expect.js');
var PictureService = require('../../services/PictureService.js');
var FakeSQSController = require('../../test/components/FakeSQSController.js');

describe('PictureService', function() {
    var pictureService;
    var fakeSQSController;

    beforeEach(function() {
        pictureService = new PictureService();
        fakeSQSController = new FakeSQSController(PictureService.PictureSQSAddress);
        pictureService.injectPictureSQSController(fakeSQSController);
    });

    it('read null from processing queue if queue is empty', function(done) {
        pictureService.readPictureFromProcessingQueue(function(picture) {
            expect(picture).to.equal(null);
            done();
        });
    });

    it('send picture to processing queue', function(done) {
        try {
            var albumId = 1, pictureId = 2;
            
            expect(fakeSQSController.getMessageLength()).to.equal(0);
            pictureService.sendPictureToProcessingQueue(albumId, pictureId, function() {
                expect(fakeSQSController.getMessageLength()).to.equal(1);
                done();
            });
        }
        finally {
            fakeSQSController.emptyQueue();
        }
    });

    it('read picture from processing queue', function(done) {
        try {
            var albumId = 1, pictureId = 2;

            pictureService.sendPictureToProcessingQueue(albumId, pictureId, function() {
                pictureService.readPictureFromProcessingQueue(function(picture) {
                    expect(picture.albumId).to.equal(albumId);
                    expect(picture.pictureId).to.equal(pictureId);
                    done();
                });
            });
        }
        finally {
            fakeSQSController.emptyQueue();
        }
    });
});
