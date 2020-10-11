var https = require('https');
var url = require('url');
var arg = require('arg');
var proxy = require('koa-proxies');
/**
 * Koa middleware to delay requests that match the provided URL pattern. This will delay all
 * requests if the pattern is omitted.
 * @param {Object} options
 * @param {RegExp} options.url Regular expression url pattern of requests to delay
 * @param {number} [options.delay=1000] Milliseconds to delay the request (default 1000)
 * @param {string=} options.method HTTP verb to match when determining what requests to delay
 */
var args = arg({
    '--delay': Number,
    '--target': String,
    '--debug': Boolean,
}, {
    permissive: true,
});
var target = "https://localhost";
var host = url.parse(target).hostname;
var agentOptions = {
    host: host,
    port: 8085,
    rejectUnauthorized: false,
};
var agent = new https.Agent(agentOptions);
var options = {
    target: target,
    changeOrigin: true,
    agent: agent,
    logs: true,
};
var middleware = [
    proxy('/', options),
];
// TODO: This is not available on web-dev-server.
module.exports = {
    middleware: middleware,
    debug: args['--debug'],
};
//# sourceMappingURL=node3.js.map