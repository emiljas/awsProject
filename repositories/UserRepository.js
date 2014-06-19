var MySqlRepository = require("../components/MySqlRepository");

function UserRepository() {}

UserRepository.prototype = new MySqlRepository();

UserRepository.prototype.findByGoogleId = function(googleId, callback) {
    var query = 'select top 1 id, email, googleId from User where googleId = ' + googleId;
    this.query(query, function(rows) {
        if (rows.length === 0) callback(null);
        else {
            var row = rows[0];

            callback({
                id: row[0],
                email: row[1],
                googleId: row[2]
            });
        }
    });
};

module.exports = UserRepository;