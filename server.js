var net = require('net');

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
