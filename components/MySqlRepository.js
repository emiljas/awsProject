var mysql = require("mysql");
var mySqlConfig = require('./mySqlConfig.js');

var pool  = mysql.createPool(mySqlConfig);

function MySqlRepository() {}

MySqlRepository.prototype.query = function(query, done) {
    pool.query(query, function(err, rows, fields){
        if(err)
            throw err;
        
        done(rows, fields, err);
    });
};

module.exports = MySqlRepository;