var fs = require('fs')
var http = require("http");
const StringDecoder = require('string_decoder').StringDecoder;


var httpServer = http.createServer(handleRequest);

function main() {
  httpServer.listen(8080);
  console.log('lsistening on 8080')
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
