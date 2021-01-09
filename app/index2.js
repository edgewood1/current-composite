// node dependencies

const http = require('http');
const https = require('https');
const url = require('url'); // url library parses url client looking for
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
let _data = require('../lib/data');
var handlers = require('../lib/handlers');
var helpers = require('../lib/helpers')

// config file loaded
const nodeConfig = require('../lib/config')

// what is this? 
const { config } = require('process');
const { useImperativeHandle } = require('react');

// instantiate http server
const httpServer = http.createServer(function(req, res){
  unifiedServer(req, res);
});

// start the server, and have it listen on port 3000 / pass a callback that is fired when the listening begins.

const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}

// https server

httpServer.listen(nodeConfig.httpPort, function() {
  console.log(`listening on ${nodeConfig.httpPort} in ${nodeConfig.envName} mode`);
});

const httpsServer = https.createServer((httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
}));

httpsServer.listen(nodeConfig.httpsPort, function() {
  console.log(`listening on ${nodeConfig.httpsPort} in ${nodeConfig.envName} mode`);
});

const unifiedServer = (req, res) => {
 
  // curl localhost:4000/hello/d returns only hello
  // 1 - PATH 
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // 2 - METHOD
  var method = req.method.toLowerCase();
  // 3 - QUERY STRING --objects attached to the path...  
  const queryStringObj = parsedUrl.query; 
  console.log('here ---', queryStringObj)
  // 4 HEADERS  - HEADER IS AN object with info about the request, such as content-type, useragent, host, cookies? 
  const headers = req.headers

  // initialize decoder for recieving data
  const decoder = new StringDecoder('utf-8')
  let buffer = '';
  // add a listener for incoming data stored in buffer
  // what will be coming in? 
  req.on('data', (data) => buffer += decoder.write(data));
  // what to do when the data ends? 
  req.on('end', async() => {
    // end decoding into buffer
    buffer += decoder.end();
    // collect all your data
    // includes the buffer which we can send to a microservice
    const data = {
      trimmedPath, queryStringObj, method, headers, payload: helpers.parseJsonToObject(buffer)
    }
    // index the route you will use
    const chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : router.notFound;



    try {
      const response = await chosenHandler(data);
          // get status code from route object
          console.log('response', response)
          console.log(response[1]);
    let statusCode = response[0]
    // get "payload" from route object - what is payload? a simple response message object
    let payload = JSON.stringify(response[1]);
    // write both to the response
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(statusCode)
    res.end(payload);
    /// log it out
    console.log(headers)
    console.log(`requested path${trimmedPath} and method: ${method} + with these query strings ' ${JSON.stringify(queryStringObj)}`);
    console.log('payload', payload)

    } catch(err) {

      console.log(err)
    }
    
    

  });
}

  const router = {
    sample: handlers.sample,
    ping: handlers.ping,
    users: handlers.users,

  }

// server.listen(nodeConfig.port, () => console.log(`listening on ${nodeConfig.port} in ${nodeConfig.envName} mode`));
 
   