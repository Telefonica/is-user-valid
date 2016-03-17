'use strict';

var express = require('express'),
    ldapProvider = require('../services/ldap-provider.js'),
    auth = require('basic-auth'),
    logger = require('../logger'),
    config = require('../config');

var router = express.Router();

function isAuthenticated(req, res, next) {
  var credentials = auth(req);
  var clients = config.get('clients');

  if (!credentials || clients[credentials.name] === undefined ||
    clients[credentials.name].secret !== credentials.pass) {
    var error = new Error('Access denied');
    error.statusCode = 401;
    return next(error);
  }
  logger.info('Client authenticated', {clientId: credentials.name});
  return next();
}

function getEmail(req, res, next) {
  ldapProvider.validate(req.params.email, function(err, memberInfo) {
    if (err) {
      err.statusCode = 500;
      return next(err);
    }
    return res.end(JSON.stringify(memberInfo));
  });
}

function errorMiddleware(err, req, res, next) {
  logger.error(err);
  res.statusCode = err.statusCode;
  if (err.statusCode === 401) {
    res.setHeader('WWW-Authenticate', 'Basic realm="' + config.get('realm') + '"');
    return res.end('Access denied');
  } else {
    return res.end('Internal error when validating email. Try again later, please');
  }

}

//user-valid API -> emails
router.get('/is-user-valid/api/v1/emails/:email', isAuthenticated, getEmail, errorMiddleware);

/**
 * The exported API
 * @type {*}
 */
module.exports = router;
