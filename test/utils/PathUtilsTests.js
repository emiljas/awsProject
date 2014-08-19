var expect = require('expect.js');
var PathUtils = require('../../utils/PathUtils.js');

describe('PathUtils', function() {
	it('make path', function() {
		var result = PathUtils.makePath('root', 'parent', 'child', 'filename.ext');
		expect(result).to.equal('root/parent/child/filename.ext');
	});
});