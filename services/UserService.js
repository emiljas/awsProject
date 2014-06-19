var UserRepository = require("../repositories/UserRepository");

function UserService() {
    this.userRepository = new UserRepository();
}

UserService.prototype.findByGoogleIdOrCreate = function(user, callback) {
    var afterCreateUser = function() {
        this.userRepository.findByGoogleId(user.googleId, function(googleUser) {
            callback(googleUser);
        });
    };
    
    var userNotExists = function() {
        this.userRepository.createUser(user, afterCreateUser);
    };
    
    this.userRepository.findByGoogleId(user.googleId, function(googleUser) {
        if (googleUser === null) userNotExists();
        else callback(googleUser);
    });
};

module.exports = UserService;