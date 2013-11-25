var net = require('net');
var express = require('express'),
    cons = require ('consolidate'),
// routes = require('./routes/slash'),
// course = require('./routes/course'),
// update = require('./routes/update'),
// model = require('./model/model.js'),
    http = require('http'),
    path = require('path');

var app = express();
var piOnline = false;


var server = net.createServer(function(c){
  var counter = 0;
  console.log('server connected');
  c.on('end',function(){
    console.log('server disconnected');
    piOnline = false;
  });
  c.on('data', function(data){
    console.log('request '+data.toString());
    console.log(typeof(data));
    if(counter++ == 5){
      c.end('ending game');
    } else {
      c.write('pong');
    }
  });
  c.on('error',function(error){
    console.error(error);
    console.error(error.stack);
  });
});

server.listen(4141,"badhost", function(){
  console.log('listening');
  console.log(JSON.stringify(server.address()));
});


app.get('/', function(req,res){
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.end("You reached me! you are home");
});

app.get('/boxes', function(req,res){
  sockets.connect('http://' + piaddr);
  res.writeHead(200,{"Content-Type":"text/plain"});
  if(boxes.pi){
    res.end("The Pi is listening!");
  } else {
    res.end("No pi, maybe refresh at some point?");
  }
});
app.get('/:place', function(req,res){
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.end("You reached me! you are looking for "+req.params.place);
});

var PORT = 8888;
app.listen(PORT, function(){console.log('app also listening');});
