var expect = require('expect.js');
var FakePicasaClient = require('./FakePicasaClient.js');

describe('FakePicasaClient', function() {
	it('returns the previously set picture', function(done) {
		var accessToken = '', pictureId = 5;
		FakePicasaClient.setPicture({pictureId: pictureId});
		var fake = new FakePicasaClient(accessToken);
		fake.getPicture(0, 0, function(picture) {
			expect(picture.pictureId).to.equal(pictureId);
			done();
		});
	});
});