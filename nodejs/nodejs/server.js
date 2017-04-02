/**
 * 
 */
var http = require("http"),
	url = require("url"),
	fs = require("fs"),
	mime = require("mime"),
	express = require("express");

var app = express();
var router = express.Router();

var data = [];
var dataObject = {data: [], data1: []};
var data_length = 10;

function updatedata(request, response) {
	var queryObject = url.parse(request.url,true).query;
	for (var param in queryObject){
		if (dataObject[param]) {
			if (dataObject[param].length > data_length) {		
				dataObject[param].shift();			
			}
			var value = parseFloat(queryObject[param]);
			if (Number.isFinite(value)) {
				var d = new Date();
				dataObject[param].push([d.getTime() - d.getTimezoneOffset()*60000, value]);
			} else {throw new Error("Wrong data value.");}			
		}
	}
	response.end();
	console.log(dataObject);
//	if (!queryObject.data) {throw new Error("Missing data param.");}
//	if (data.length > data_length) {		
//		data.shift();			
//	}
//	var value = parseFloat(queryObject.data);
//	if (Number.isFinite(value)) {
//		var d = new Date();
//		data.push([d.getTime() - d.getTimezoneOffset()*60000, value]);
//	} else {throw new Error("Wrong data value.");}
//	response.end();
//	console.log(data);	
}

function getdata(request, response) {
	console.log(dataObject);
	response.end(JSON.stringify(dataObject));
}

router.use(function(request, response, next){
	console.log(request.method, request.url);
	if (request.url === '/favicon.ico') {
		response.writeHead(200, {'Content-Type': 'image/x-icon'} );
		response.end();
		return;
	}	
	next();
});

router.get("/", function(request, response, next) {
	response.sendFile(__dirname + "/webroot/index.html", function(error) {
		if (error) {
		      next(new Error("index.html missing!"));
		}
	});
});
router.get("/updatedata", function(request, response) {
	updatedata(request, response);
});
router.get("/getdata", function(request, response) {
	getdata(request, response);
});

router.get("/reset", function(request, response) {
	dataObject.data = [];
	dataObject.data1 = [];
	response.end();
});

app.use(router);
app.use(express.static('webroot'));
app.use('*', function(request, response, next){
	var err = new Error();
	err.status = 404;
	next(err);
});

app.use(function(error, request, response, next){
	//response.redirect("error.html");  
    response.end();
	console.log('Wrong URL request: %s',request.url);
    console.log(error);
	return;	
});

var server = http.createServer(app).listen(8082);
console.log("Server running"); 
