var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var fs = require('fs');
var url = require('url');
var socket = require('socket.io')();

var sockets = [];

io.on("connection", function (socket) {
	console.log("new socket connection");
});



//var favicon = require('serve-favicon');
// var app = express();
var rootDir = "public/";

app.set('port', process.env.PORT || 8080);



app.use('/', express.static(path.join(__dirname, rootDir )));

//app.use(favicon(__dirname + '/favicon.ico') );

app.get("/color", function (req,res) {

	console.log(req.query.num);
	io.sockets.emit("FLASH", req.query.num);
	res.send("thanks");
	
});

app.get('/', function (req, res) {
  res.sendFile(__dirname +  '/public/index.html');
});


server.listen(app.get('port'), function(){
  console.log("server listening on port " + app.get('port'));
});


