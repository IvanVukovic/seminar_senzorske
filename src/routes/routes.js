var express = require('express')
var router = express.Router()
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ='mongodb://localhost:27017/devices';
var devices = [];

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', new Date());
  next()
})

router.use(function(request, response, next){
	console.log(request.method, request.url);
	if (request.url === '/favicon.ico') {
		response.writeHead(200, {'Content-Type': 'image/x-icon'} );
		response.end();
		return;
	}
	next();
});

router.get('/addValue/', function (req, res) {
   req.query.date = new Date();
   // Use connect method to connect to the Server
   MongoClient.connect(url, function (err, db) {
     if (err) {
       console.log('Unable to connect to the mongoDB server. Error:', err);
     } else {
       console.log('Connection established to', url);
       UpdateData(db,req);
       AddDeviceToArray(req.query.name);
       db.close();
       res.end(req.query.name + " updated!")
     }
   });
})

router.get('/getDevices/', function(req,res){
  res.end(devices.toString());
})

router.get('/getValues/', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      var collection = db.collection(req.query.name);

      if(req.query.live == "on"){
        collection.find().limit(parseFloat(req.query.count))
         .sort({$natural: -1})
          .toArray(function(err, docs) {
            res.end(JSON.stringify(docs));
            for(var i = 0; i < docs.length; i ++){
              console.log(docs[i]);
            }
          });
      }else{
        collection.find({"date" : {"$gte": new Date(req.query.time)}})
        //.sort({$natural: -1})
         .limit(parseFloat(req.query.count))
           .toArray(function(err, docs) {
              res.end(JSON.stringify(docs.reverse()));
              for(var i = 0; i < docs.length; i ++){
                console.log(docs[i]);
              }
            });
      }

      db.close();
    }
  });
})

router.get('/dropCollection', function(req, res){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.end("nok");
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      if(db.collection(req.query.name).drop()){
        RemoveFromDevices(req.query.name);
        res.end("ok");
      }
      else {
        res.end("nok!");
      }
      db.close();
    }
  });
})

router.checkDevices = function(){
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', url);
      db.collections(function (err, collections) {
        collections.forEach(function(collection){
          devices.push(collection.s.name);
        })
        console.log(devices);
        });
      db.close();
    }
  });
}

var UpdateData = function(db, req) {
  var collection = db.collection(req.query.name);
  collection.insert(req.query);
}

var AddDeviceToArray = function(device){
  var bool = 0;
  for(var i = 0; i < devices.length; i++){
      if(devices[i] == device) bool = 1;
  }
  if(bool == 0)devices.push(device);
}

var RemoveFromDevices = function(device){
  for(var i = 0; i < devices.length;i++){
    if(devices[i] == device){
      devices.splice(i,1);
    }
  }
}
module.exports = router
