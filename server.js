var http = require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var router = require('./src/routes/routes.js')

router.get("/", function(req, res){
  res.sendFile(__dirname + "/web/index.html");
})

app.use('/', router);
app.use(express.static('web'));

var server = http.createServer(app).listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  router.checkDevices();
  console.log("Example app listening at http://%s:%s", host, port)

})
