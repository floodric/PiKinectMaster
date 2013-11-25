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


// socket has:
/*
 * connect(port, [host],[listener])     : this socket will connect on port to localhost, or host, and emit connect to listener
 * bufferSize                           : size if things yet to be written/read
 * setEncoding([encoding])              : see stream.setEncoding
 * end([data],[callback])               : if data, write data then end(), emit 'end' event to callback
 * destroy()                            : destroys socket, use only in error case
 * pause()                              : pauses reading/streaming if we need to process stuff
 * resume()                             : resumes reading/streaming after calling pause
 * setTimeout(timeout,[callback])       : will set timeout after timeout seconds, and will emit a 'timeout' event to the callback
 * setNoDelay([noDelay])                : disable buffering before sending data
 * setKeepAlive([enable][initialDelay]) : enable/disable keep-alive, set initial delay before probe is set
 * address()                            : returns port, family and address by OS
 * unref()                              : exit if this is only active active socket 
 * ref()                                : will not exit if this is the only active socket
 * remoteAddress                        : string rep of IP
 * remotePort                           : num rep of port
 * localAddress                         : string rep of local IP
 * localPort                            : num rep of port
 * bytesWritten                         : amount of bytes send
 * bytesRead                            : amount of bytes recieved 
 */

function talkToPi(message){
  var counter = 0;
  var socket = net.createConnection({port:4141,host:'71.61.180.150'},
    function(){
      console.log('client connected');
      piOnline = true;
      if(message) socket.write(message);
    }
  );

  // data listener
  socket.on('data', function(data){
    console.log('request '+data.toString());
    console.log(typeof(data));
    if(counter++ == 5){
      socket.end('ending game');
    } else {
      socket.write('pong');  
    }
  });


  socket.on('error',function(error){
    if(error.code == 'ECONNREFUSED'){
      console.log('pi not listening or down');
      socket.destroy() // dont continue using this socket
    } else {
      console.error(error);
      console.error(error.stack);
      socket.destroy() // dont continue using this socket
    }
  });
}

app.get('/', function(req,res){
  res.writeHead(200,{"Content-Type":"text/plain"});
  res.end("You reached me! you are home");
});

app.get('/boxes', function(req,res){
  talkToPi();
  res.writeHead(200,{"Content-Type":"text/plain"});
  if(piOnline){
    res.end("The Pi is listening!");
  } else {
    res.end("No pi, maybe refresh at some point?");
  }
});

app.get('/boxes/:message', function(req,res){
  talkToPi(req.params.message);
  res.writeHead(200,{"Content-Type":"text/plain"});
  if(piOnline){
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
