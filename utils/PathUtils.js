var PathUtils = {};

PathUtils.makePath = function() {
	var strs = Array.prototype.slice.call(arguments);
	return strs.join('/');
};

module.exports = PathUtils;