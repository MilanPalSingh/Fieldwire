var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
	// var mysql      = require('mysql');
	// var connection = mysql.createConnection({
	//   host     : 'localhost',
	//   user     : 'root',
	//   password : 'root',
	//   database : 'demo'
	// });

	// connection.connect();

	// connection.query('SELECT * from user', function(err, rows, fields) {
	//   if (!err)
	//     console.log('The solution is: ', rows);
	//   else
	//     console.log('Error while performing Query.');

	res.render('index', { title: 'Milan..' });
	// });

	// connection.end();



  

});

module.exports = router;
