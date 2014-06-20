var UserRepository = require("../repositories/UserRepository");

function UserService() {
    this.userRepository = new UserRepository();
}

UserService.prototype.findGoogleUserOrCreate = function(googleUser, callback) {
    var user = this.findUserByGoogleId(googleUser.id, callback);
    
    if(user === null) {
        this.createGoogleUser(googleUser, function(){
            this.findUserByGoogleId(googleUser.id);
        }.bind(this));
    }
};

UserService.prototype.createGoogleUser = function(googleUser, callback) {
    this.userRepository.createGoogleUser(googleUser, callback);
};

UserService.prototype.findUserByGoogleId = function(googleId, callback) {
    this.userRepository.findByGoogleId(googleId, callback);
};

module.exports = UserService;