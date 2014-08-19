var Stream = require('stream').Stream;
var request = require('request');
var gm = require('gm');
var PictureService = require('../services/PictureService.js');
var S3Client = require('../components/S3Client.js');
var waitTimeInMilliseconds = 1000;

var pictureService = new PictureService();
var s3Client = new S3Client('emil-project');

var executeAction = function() {
    pictureService.readPictureFromProcessingQueue(function(picture) {
        if(picture !== null)
            processPicture(picture);

        scheduleNextAction();
    });
};

function processPicture(picture) {
	var sourceStream = request(picture.url);
	var resultStream = new Stream();
	resultStream.writable = true;

	gm(sourceStream)
		.sepia()
		.stream(function(err, resultStream, stderr) {
		if(err)
			throw err;

		var objectName = pictureService.generatePictureS3ObjectName(picture);

		s3Client.upload({
			stream: resultStream,
			objectName: objectName,
			oncompleted: function() {
				console.log('picture \"' + picture.fileName + 
					        '\" processing completed');
			},
			onfailed: function(err) {
				console.log('picture \"' + picture.fileName + 
					        '\" processing failed', err);
			},
			onerror: function() {
				console.log('error', arguments);
			}
		});
	});
}

scheduleNextAction();

function scheduleNextAction() {
    setTimeout(function() { executeAction(); }, waitTimeInMilliseconds);
}
