var expect = require('expect.js');
var PictureService = require('../../services/PictureService.js');
var FakeSQSController = require('../components/FakeSQSController.js');
var FakePicasaClient = require('../components/FakePicasaClient.js');

describe('PictureService', function() {
	var pictureService;
	var fakeSQSController;

	beforeEach(function() {
		pictureService = new PictureService();
		fakeSQSController = new FakeSQSController(PictureService.PictureSQSAddress);
		pictureService.injectPictureSQSController(fakeSQSController);
		pictureService.injectPicasaClient(FakePicasaClient);
	});

	afterEach(function() {
		fakeSQSController.emptyQueue();
	});

	it('read null from processing queue if queue is empty', function(done) {
		pictureService.readPictureFromProcessingQueue(function(picture) {
			expect(picture).to.equal(null);
			done();
		});
	});

	it('send picture to processing queue', function(done) {
		var info = {};
		
		expect(fakeSQSController.getMessageLength()).to.equal(0);
		pictureService.sendPictureToProcessingQueue(info, function() {
			expect(fakeSQSController.getMessageLength()).to.equal(1);
			done();
		});
	});

	it('read picture from processing queue', function(done) {
		var info = {};
		var expectedPicture = { pictureId: 123 };
		FakePicasaClient.setPicture(expectedPicture);

		pictureService.sendPictureToProcessingQueue(info, function() {
			pictureService.readPictureFromProcessingQueue(function(picture) {
				expect(picture.pictureId).to.equal(expectedPicture.pictureId);
				done();
			});
		});
	});

	it('generate picture s3 object name', function() {
		var picture = {
			albumId: 93,
			pictureId: 121,
			fileName: 'abc.png'
		};
		var objectName = pictureService.generatePictureS3ObjectName(picture);

		expect(objectName).to.equal('proccessedPictures/93/121/abc.png');
	});
});
