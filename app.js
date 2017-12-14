var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./utill/upload');
var db = require('./utill/db');
var mkdirp = require('mkdirp');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// for file upload
const fileUpload = require('express-fileupload');
// default options
app.use(fileUpload());

app.use('/', index);
app.use('/projects', users);

app.use('/projects/:name', function(req, res) {
	// res.send(req.params.name);
    db.getFiles(req.params.name).then(function(data){
		
		console.log("from select");
		console.log(data);
		
		res.render('files', { name: data[0].name, files: data });

	});

});

	
  
// app.use('/upload', upload);

app.use(express.static('public'));

app.post('/upload', function(req, res) {

	// console.log(req.body.name);
	var dir = 'public/images/'+req.body.name;

	mkdirp(dir, function(err) { 

	    upload.upload(req.files, req.body.name).then(function(data){
    		
    		console.log("from select");
    		console.log(data);
    		
    		res.render('upload', { name: data[0], files: data[1] });

		});

	});

	
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
