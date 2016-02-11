'use strict';

var express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routes = require('./routes'),
    logger = require('./logger'),
    expressDomain = require('express-domaining'),
    expressTracking = require('express-tracking'),
    expressLogging = require('express-logging'),
    enableTerminate = require('server-terminate'),
    config = require('./config');

// Default logging level. It can be overridden by configuration.
logger.setLevel('INFO');
logger.format = logger.formatters.json;

// Operation name (for logging purposes)
var OP = 'is-valid';

var app = express();
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(expressDomain(logger));
app.use(expressTracking({op: OP}));
app.use(expressLogging(logger));

app.use('/', routes);

var server = http.createServer(app);
// Allow the server to gracefully finish connections without waiting for
// keep-alive connections that are not being used
enableTerminate(server);
server.listen(config.get('port'), function() {
  logger.info('is-user-valid server listening', server.address());
});

function orderedShutdown() {
  logger.debug('ordered shutdown');
  server.terminate(function onTerminated() {
    process.exit(0);
  });
}

process.on('SIGTERM', orderedShutdown);
process.on('SIGINT', orderedShutdown);
process.on('uncaughtException', function() {
  process.exit(2);
});
