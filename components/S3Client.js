var s3 = require('s3');
var Uploader = require('s3-streaming-upload').Uploader;
var awsS3Options = require('./aws-s3-config.js');
var makePath = require('../utils/PathUtils.js').makePath; 

var client = s3.createClient({
	s3Options: awsS3Options
});

function S3Client(bucket) {
	this.bucket = bucket;

	this.upload = function(options) {
		var upload = new Uploader({
			bucket: this.bucket,
			accessKey: awsS3Options.accessKeyId,
			secretKey: awsS3Options.secretAccessKey,
			stream: options.stream,
			objectName: options.objectName,
			objectParams: {
				ACL: 'public-read'
			}
		});

		upload.on('completed', function(err, res) {
			if(options.oncompleted)
				options.oncompleted(err, res);
		});

		upload.on('failed', function(err) {
			if(options.onfailed)
				options.onfailed(err);
		});

		upload.on('error', function() {
			if(options.onerror)
				options.onerror(arguments);
		});
	};

	this.getUrl = function(objectName) {
		var url = makePath('https://s3-us-west-2.amazonaws.com',
							this.bucket,
							objectName);
		return url;
	};
}

module.exports = S3Client;