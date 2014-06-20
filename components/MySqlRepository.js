var mysql = require("mysql");
var mySqlConfig = require('./mysql-config.js');

var pool  = mysql.createPool(mySqlConfig);

function MySqlRepository() {}

MySqlRepository.prototype.mysql = mysql;

MySqlRepository.prototype.formatQuery = function (query, values) {
  if (!values) return query;
  return query.replace(/\:(\w+)/g, function (txt, key) {
    if (values.hasOwnProperty(key)) {
      return mysql.escape(values[key]);
    }
    return txt;
  }.bind(this));
};

MySqlRepository.prototype.query = function(query, done) {
    pool.query(query, function(err, rows, fields){
        if(err)
            throw err;
        
        done(rows, fields, err);
    });
};

module.exports = MySqlRepository;