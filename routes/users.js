var express = require('express');
var router = express.Router();
var upload = require('../utill/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
	upload.getProjects().then(function(data){
  		res.render('projects', { projects: data });

	});

});

module.exports = router;
