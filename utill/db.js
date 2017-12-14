var mysql = require('mysql');
var ImageResize = require('node-image-resize');
var fs = require('fs');

const connection =  mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'demo'
	  });
connection.connect();

module.exports = {
	

  // connection.connect();
  	show: function(){
		connection.query('SELECT * from user', function(err, rows, fields) {
		    if (!err)
		      console.log('The solution is: ', rows);
		    else
		      console.log('Error while performing Query.');
		});
	},
	pushFile: function(name, file){
      	return new Promise(function(resolve, reject){
			let sql = "INSERT INTO user (name, file) VALUES ?";
			let values = [];
			let value =[];
			let files =[];
			for(i in file){
				value=[];
				value.push(name);
				value.push(file[i]);
				values.push(value);
				files.push(file[i]);
			}

			// resizeImg(values);

			connection.query(sql, [values], function(err) {
			    if (!err)
			      console.log('update update ');
			    else
			      console.log('Error while update');
			    	
			    // conn.end();
			    // var q ="SELECT * from user WHERE name = '" + name+"'";
			    // connection.query(q , function(err, rows, fields){
		     //  		if (!err)
				   //    console.log('The solution is: ', rows);
				   //  else
				   //    console.log('Error while performing Query per user.');
			    	
			    	resolve([name, files]);
			    // });
			    
			});
		});

		
	},
	// get the projects from the DB
	getProjects: function(){
      	return new Promise(function(resolve, reject){
			connection.query("SELECT DISTINCT name from user", function(err, rows, fields){
				if (!err)
				      console.log('The solution is: ', rows);
				    else
				      console.log('Error while performing Query per user.');
			    	
			    resolve(rows);
			});
      	});
	},
	getFiles: function(name){
      	return new Promise(function(resolve, reject){
      		// let q = 
			connection.query("SELECT * from user WHERE name = '" + name+"'", function(err, rows, fields){
				if (!err)
				      console.log('The solution is: ', rows);
				    else
				      console.log('Error while performing Query per user.');
			    	
			    resolve(rows);
			});
      	});
	}
}



var resizeImg = function(files){
		for(f in files){
				let img = files[f][1];

				img = "/"+img+".png";
				console.log(img);

				let image = new ImageResize(img);
				image.loaded.then(function(){
				    image.smartResizeDown({
				        width: 200,
						height: 200
				    }).then(function () {
				        image.stream(function (err, stdout, stderr) {
				            var writeStream = fs.createWriteStream(img +'200x200.png');
				            stdout.pipe(writeStream);
				        });
				    });
				});
		}
	}

