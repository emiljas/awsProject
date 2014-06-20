var MySqlRepository = require("../components/MySqlRepository");

function UserRepository() {}

UserRepository.prototype = new MySqlRepository();

UserRepository.prototype.findByGoogleId = function(id, callback) {
    var sql = 
        'select u.id, u.email\
        from User u\
        join GoogleUser gu on gu.userId = u.id\
        where gu.id = :id';
    
    var query =this.formatQuery(sql, { id : id });
    
    this.query(query, function processResult(rows) {
        if (rows.length === 0)
            callback(null);
        else if(rows.length == 1) {
            var row = rows[0];

            callback({
                id: row[0],
                email: row[1],
                googleId: row[2]
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
        "insert into GoogleUser(id, userId)" +
        " values(:id, last_insert_id());";
    
    var values = {
        id: user.id,
        displayName : user.displayName,
        email : user.email
    };
    
    var query = this.formatQuery(sql, values);
    console.log(query);
    
    this.query(query, function() {
        callback();
    });
};

module.exports = UserRepository;