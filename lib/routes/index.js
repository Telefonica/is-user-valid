'use strict';

var express = require('express'),
    ldapProvider = require('../services/ldap-provider.js'),
    auth = require('basic-auth'),
    logger = require('../logger'),
    config = require('./../../config.js');

var router = express.Router();

function isAuthenticated(req, res, next) {
  var credentials = auth(req);

  if (! credentials || config.clients[credentials.name] === undefined || config.clients[credentials.name].secret !== credentials.pass) {
   res.statusCode = 401;
   res.setHeader('WWW-Authenticate', 'Basic realm="' + config.realm + '"');
   return res.end('Access denied');
  }
  logger.info('Client authenticated', {client_id: credentials.name});
  return next();
}

function getEmail(req, res) {
  ldapProvider.validate(req.params.email, function (err, memberInfo) {
    if (err) {
      res.statusCode = 500;
      return res.end('Internal error when validating email. Try again later, please');
    }
    return res.end(JSON.stringify(memberInfo));
  });
}

//user-user-valid API -> emails
router.get('/is-user-valid/api/v1/emails/:email', isAuthenticated, getEmail);


/**
 * The exported API
 * @type {*}
 */
module.exports = router;
