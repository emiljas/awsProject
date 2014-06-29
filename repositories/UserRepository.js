var MySqlRepository = require("../components/MySqlRepository");

function UserRepository() {}

UserRepository.prototype = new MySqlRepository();

UserRepository.prototype.findByGoogleId = function(id, callback) {
    var sql = 
        'select u.id, u.email, gu.id as googleId, gu.accessToken, gu.refreshToken' +
        ' from User u' +
        ' join GoogleUser gu on gu.userId = u.id' +
        ' where gu.id = :id';
    
    var query = this.formatQuery(sql, { id : id });
    
    this.query(query, function processResult(rows) {
        if (rows.length === 0)
            callback(null);
        else if(rows.length == 1) {
            var row = rows[0];

            callback({
                id: row.id,
                email: row.email,
                googleId: row.googleId,
                accessToken: row.accessToken,
                refreshToken: row.refreshToken
            });
        }
        else
            throw new Error("duplicate googleId");
    });
};

UserRepository.prototype.createGoogleUser = function(user, callback) {
    var sql =
        "insert into User(displayName, email)" +
        " values(:displayName, :email);" +
        "insert into GoogleUser(id, userId, accessToken, refreshToken)" +
        " values(:id, last_insert_id(), :accessToken, :refreshToken);";
    
    var values = {
        id: user.id,
        displayName : user.displayName,
        email : user.email,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken
    };
    
    var query = this.formatQuery(sql, values);
    this.query(query, callback);
};

UserRepository.prototype.updateAccessToken = function(googleId, accessToken, callback) {
    var sql =
        "update GoogleUser" +
        " set accessToken = :accessToken" +
        " where id = :googleId";
        
        var values = {
            googleId: googleId,
            accessToken: accessToken
        };
        
        var query = this.formatQuery(sql, values);
        this.query(query, callback);
        
};

module.exports = UserRepository;