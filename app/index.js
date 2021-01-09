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

// testing
const createFile = async () => {
  const b = await _data.create('test', 'newFile'); 
  console.log(b)
  return b;
}

const readFile = async () => {
  const b = await _data.read('test', 'newFile');
  console.log(b)
};

const updateFile = async () => {
  const data = 'hello'
  const b = await _data.update('test', 'newFile', data);
  console.log(b)
};

const appendFile = async () => {
  const data = 'hello2'
  const b = await _data.append('test', 'newFile', data);
  console.log(b)
};

const deleteFile = async () => {
  const b = await _data.delete('test', 'newFile');
  console.log(b)
};

const cycle = async() => {
  // await createFile();
  // await updateFile();
  // await appendFile();
  // await deleteFile();
}

cycle();
// define what the server does - it should repond to all requests with a string
// create server object - pass it a callback
// both req, res gets filled out every time a request comes in
// each time localhost gets hit - 
// req - lots of info re: what user is asking

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

// all server logic for the two servers
const unifiedServer = (req, res) => {
  
  // get url and parse it
  // true - call the query string module itself - these two modules work together
  // parse it as if you've sent it to query string module
  
  const  parsedUrl = url.parse(req.url, true);
  
  // get path from url aka /hello

  const path = parsedUrl.pathname;
  // gets rid of extraneous slashes - take off slashes from both sides
  // curl localhost:4000/hello/d returns only hello
  // 1 - PATH 
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  // 2 - METHOD
  //get http method - an object available on request object
  var method = req.method.toLowerCase();

  // get query string as an object
  // 3 - QUERY STRING --objects attached to the path...  
  const queryStringObj = parsedUrl.query; 

  // use a built in res object

  // get headers
  // 4 HEADERS  - HEADER IS AN object with info about the request, such as content-type, useragent, host, cookies? 
  const headers = req.headers

  // get the payload if there is any - we need stringdecoder library for this.
  // parameter: what kind of charset? utf-8
  const decoder = new StringDecoder('utf-8')
  // node deals with streams - bits of info coming in a little at a time
  // payloads come in this way.  we collect it.  when stream says we're end it, coalese it into a coherent thing.
  // string buffer will hold new data as it comes in. 
  let buffer = '';
  // this is an event listener when request object emits event 'data'
  // we grab the data and add it to the buffer
  req.on('data', (data) => {
    // use string decoder to add to buffer
    buffer += decoder.write(data);
  })
  // if there is no payload, then "end" still called - not 'data'
  // buffer initialized to empty string and we still send response
  req.on('end', () => {
    buffer += decoder.end();

    // choose the handler this request should go to.  
    // if one not found, use notFound handler
    // if path exists as a key on the handler object, then use it else 
    // this will hold the value of the chosen key
    // get teh right function to call
    //call it, passing in 1) data 2) function that contains status code + payload
    // payload is {name: samplehandler} statusCode is 400 // data - parsed stuff

    const chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;
    // if i post /sample, chosenHandler = routers[sample], which holds a method
    // so chosenHandler is a function that takes data + function that is called

    // construct data object to send handler

    const data = {
      trimmedPath, queryStringObj, method, headers, payload: helpers.parseJsonToObject(buffer)
    }

    // chosenHanlder = handlers.sample, handlers.ping, handlers.notFound
    // dynamic function word
    // pass in data + this function
    //
    // call chosen handler and send data + callback
    chosenHandler(data, (statusCode, payload) => {
      console.log('incoming payload 0 ----- ', payload)
        // use payload called bayck by handler or default to empy object
        statusCode =typeof(statusCode) == 'number' ? statusCode: 200; 
        payload = typeof(payload) === 'object' ? payload: {};
        // convert payload to a string


        const payloadString = JSON.stringify(payload);
    // formalize fact that we are returning JSON
    // we need to tell the user we are doing this.
    // so send the header-content type: applicationtypejson.
        res.setHeader('Content-Type', 'application/json')
        // return response
        res.writeHead(statusCode)
        res.end(payloadString);
        /// 
        console.log(headers)
        console.log(`requested path${trimmedPath} and method: ${method} + with these query strings ' ${JSON.stringify(queryStringObj)}`);
        console.log('payload', buffer)
    });

  })
}


const router = {
  'sample': handlers.sample, 
  'ping': handlers.ping,
  'users' : handlers.users
}

