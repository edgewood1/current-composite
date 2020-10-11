const https = require('https');
const url = require('url');
const arg = require('arg');
const proxy = require('koa-proxies');

/**
 * Koa middleware to delay requests that match the provided URL pattern. This will delay all
 * requests if the pattern is omitted.
 * @param {Object} options
 * @param {RegExp} options.url Regular expression url pattern of requests to delay
 * @param {number} [options.delay=1000] Milliseconds to delay the request (default 1000)
 * @param {string=} options.method HTTP verb to match when determining what requests to delay
 */
 

const args = arg({
  '--delay': Number,
  '--target': String,
  '--debug': Boolean,
}, {
  permissive: true,
});

const target = `https://localhost`
const host = url.parse(target).hostname;

const agentOptions = {
  host,
  port: 8085,
  rejectUnauthorized: false,
};
const agent = new https.Agent(agentOptions);
const options = {
  target,
  changeOrigin: true,
  agent,
  logs: true,
};
const middleware = [
  proxy('/', options),
];

 

// TODO: This is not available on web-dev-server.
module.exports = {
  middleware,
  debug: args['--debug'],
};