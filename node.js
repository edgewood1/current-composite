var fs = require('fs')
var http = require("http");
const StringDecoder = require('string_decoder').StringDecoder;


var httpServer = http.createServer(handleRequest);
var httpServer2 = http.createServer();
function main() {
  httpServer.listen(8085);
  console.log('lsistening on 8082')
}

main()


function pageLoad(filepath, res){
  return fs.readFileSync(filepath,function(error,contents){
    return contents
  });
}

async function handleRequest(req, res) {
  switch (req.url) {
    case '/':
      res.end(await pageLoad('./dist/index.html', res))
    case '/bundle.js':
      res.end(await pageLoad('./dist/bundle.js', res))
  }
}
