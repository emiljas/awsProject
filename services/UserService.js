var UserRepository = require("../repositories/UserRepository");

function UserService() {
    this.userRepository = new UserRepository();
}

UserService.prototype.findGoogleUserOrCreate = function(googleUser, callback) {
    this.findUserByGoogleId(googleUser.id, function(user) {
        if (user === null) {
            this.createGoogleUser(googleUser, function() {
                this.findUserByGoogleId(googleUser.id, callback);
            }.bind(this));
        }
        else
            callback(user);
    }.bind(this));
};

UserService.prototype.createGoogleUser = function(googleUser, callback) {
    this.userRepository.createGoogleUser(googleUser, callback);
};

UserService.prototype.findUserByGoogleId = function(googleId, callback) {
    this.userRepository.findByGoogleId(googleId, callback);
};

UserService.prototype.updateAccessToken = function(googleId, accessToken, callback) {
    this.userRepository.updateAccessToken(googleId, accessToken, callback);
};

module.exports = UserService;
