var express = require('express');
var router = express.Router();
var db = require('../utill/DB');

/* GET users listing. */
router.get('/', function(req, res, next) {
	upload.getFiles(req.).then(function(data){
  		res.render('projects', { projects: data });

	});

});

module.exports = router;
