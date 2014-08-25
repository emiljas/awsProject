var expect = require('expect.js');
var S3Client = require('../../components/S3Client.js');

describe('S3Client', function() {
	it('generate url by object name', function() {
		var s3Client = new S3Client('emil-project');
		var expected = 'https://s3-us-west-2.amazonaws.com/emil-project/qwe/rt/y.jpg';
		var url = s3Client.getUrl('qwe/rt/y.jpg');
		expect(url).to.equal(expected);
	});
});