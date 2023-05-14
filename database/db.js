var mysql = require('mysql');
var connection =
mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'12345678',
	database:'person'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;