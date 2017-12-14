const express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var fs = require('fs');
var mysql = require('mysql');
var db = require('./db');
 

var AWS = require('aws-sdk');
var Jimp = require("jimp");



 
module.exports = {
  upload: function (files, name) {
      return new Promise(function(resolve, reject){
        console.log(files);
        if (!files)
          resolve('No files were uploaded.');
          var dir = 'public/images/'+name;

        dir= dir+'/';
        
        pushFileToServer(files, dir).then(function(data){
          // file uploade sucess push to DB;
          db.pushFile(name, data).then(function(data){
            resolve(data);
          });
          
        });
        
      }).catch(errorHandler);
  }
}
var pushFileToServer = function(file, dir){
    return new Promise(function(resolve, reject){
      let v=0;
      let promiseArray =[];
      let uniqueName = false;
      // version for the duplicate file name
      let version=1;
          
      AWS.config= {
        // hidden
      }
      var s3 = new AWS.S3();
      var bucketParams = {Bucket: 'demointerview007'};
      s3.createBucket(bucketParams);
      var s3Bucket = new AWS.S3( { params: {Bucket: 'myBucket'} } );

      
      // looping through all the files sent for upload
      while(file["sampleFile"+v]){

        let fname = dir+file["sampleFile"+v].name;
        fname = fname.substr(0, fname.lastIndexOf('.')) || fname;
        if (fs.existsSync(fname+'.png')) {
          while(!uniqueName){
            if (fs.existsSync(fname+version+'.png')) {
                // fname = fname  + version;
                version++;
            }else{
              uniqueName = true;
            }
          }
          fname = fname  + version;
        }


        let image = file["sampleFile"+v];
        let fileNmae = fname;

        // add to promised array and then resolve all to handle multiple file uploade.
        promiseArray.push( new Promise(function(res, rej){
          console.log(fname);
           file["sampleFile"+v].mv(fname+'.png', function(err) {
              if (err)
                res(err);
                

              // resize and store
       
              // open a file called "lenna.png" 
              Jimp.read(fname+'.png', function (err, lenna) {
                  if (err) throw err;
                  lenna.resize(100, 100)            // resize 
                       // .quality(60)                 // set JPEG quality 
                       // .greyscale()                 // set greyscale 
                       .write(fname+ "(100X100).png"); // save 
                  lenna.resize(2000, 2000)            // resize 
                       // .quality(60)                 // set JPEG quality 
                       // .greyscale()                 // set greyscale 
                       .write(fname+ "(2000X2000).png"); // save 
              });






              res(fname);
            });
        }));


// upload to S3
        
        // var data = {Key: fname, Body: image.data};
        var params = {Bucket: 'demointerview007', Key: fileNmae, Body: image.data};
        s3.upload(params, function(err, data) {
        // s3Bucket.putObject(data, function(err, data){
          if (err) 
            { console.log('Error uploading data: ', err); 
            } else {
              console.log('succesfully uploaded the image!');
            }
        });

        


// increse the v value
        v++;


      }
      Promise.all(promiseArray).then(function(data){
          console.log(data);
          resolve(data);
      });
    }).catch(errorHandler);

}
var errorHandler = function(e){
  reject(e);
}



