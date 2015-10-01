'use strict';

var express = require('express'),
    ldapProvider = require('../services/ldap-provider.js'),
    auth = require('basic-auth'),
    config = require('./../../config.js');

var router = express.Router();

function isAuthenticated(req, res, next) {
  var credentials = auth(req);

  if (! credentials || config.clients[credentials.name].secret !== config.clients[credentials.pass]){
   res.statusCode = 401;
   res.setHeader('WWW-Authenticate', 'Basic realm="' + config.realm + '"');
   return res.end('Access denied');
  }
  return next();
}

function getEmail(req, res) {
  console.log (req.params.email);
  ldapProvider.validate(req.params.email, function (err, memberInfo) {
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
