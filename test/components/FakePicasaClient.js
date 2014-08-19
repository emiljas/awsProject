FakePicasaClient.setPicture = function(picture) {
	FakePicasaClient.picture = picture;
};

function FakePicasaClient(accessToken) {
	this.accessToken = accessToken;

	this.getPicture = function(albumId, pictureId, done) {
		done(FakePicasaClient.picture);
	};
}


module.exports = FakePicasaClient;