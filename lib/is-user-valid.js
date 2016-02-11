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

http.createServer(app).listen(config.get('port'), function() {
  logger.info('Express server listening on port %d', config.get('port'));
});
