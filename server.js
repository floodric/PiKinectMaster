var http = require("http");

var basicOptions = {
  hostname: "rota.praetorian.com",
  path: "/rota/service/play.php?place=4",
  method: "GET",
  port: "80"
}

var interface = {
  "new":"",
  place:"location=%d", 
  move:"from=%d&to=%d",
  "status":""
}

function handleRequest(req,resp){
  console.log(req.headers);
  console.log("Request Received"+req.url);
  resp.writeHead(200, {"Content-Type": "text/plain"});
  resp.write(req.method+' is how you got here');
  resp.end();
}

http.createServer(handleRequest).listen(8888);

var req = http.request(basicOptions,function(resp){
            console.log(resp);
          });

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.write('data\n');
req.write('data\n');
req.end();
