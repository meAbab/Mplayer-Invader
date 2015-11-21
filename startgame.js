var http=require('http');
http.createServer(function(req,res){
res.writeHead(200,{'Content-Type':'text/html'});
res.end('firstgame1.html');
}).listen(1552,'127.0.0.1:1552');
console.log('Server running at http://localhost:1552/');
