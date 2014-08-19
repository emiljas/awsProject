var s3 = require('s3');
var Uploader = require('s3-streaming-upload').Uploader;
var awsS3Options = require('./aws-s3-config.js');

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
			objectName: options.objectName
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

	this.getUrl = function(key, done) {
		var url = client.getPublicUrlHttp(this.bucket, key);
		done(url);
	};
}

module.exports = S3Client;