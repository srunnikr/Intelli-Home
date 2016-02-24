// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

var temperature = 0;

// Static directory for html/css/js
app.use(express.static(__dirname + '/public/'));  

// Routing
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/about.html', function(req, res, next) {
	res.sendFile(__dirname + '/public/about.html');
});

app.get('help.html', function(req, res, next) {
	res.sendFile(__dirname + '/public/help.html');
});

io.on('connection', function(client) {  
  console.log('Client connected...');

  client.emit('welcomeUpdate');

  client.on('join', function(data) {
    console.log(data);
  });

  client.on('timer', function() {
    console.log("Received timer event");
  });

  // Sensor updates
  client.on('tempReading', function(data) {
    temperature = data;
    client.broadcast.emit('tempUpdate', temperature);
    console.log("temperature update sent to frontend");
  });

});

server.listen(3000, '192.168.1.2');  
