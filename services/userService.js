var mysql = require("mysql");
var mysqlConfig = require('./mysqlConfig.js');


function getX() {
    var connection = mysql.createConnection(mysqlConfig);

    connection.connect();

    connection.query('SELECT 1', function(err, rows) {
        console.log(err, rows);
    });

    connection.end();
}

module.exports = getX;