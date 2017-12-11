var mysql = require('mysql');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'123456',
	database:'test'
});

connection.connect(function(error){
	if(error){
		console.log('连接失败',error);
	}else{
		console.log('连接成功');
	}
});

exports.connection = connection;