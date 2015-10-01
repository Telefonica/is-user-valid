'use strict';

var express = require('express'),
    ldapProvider = require('../services/ldap-provider.js');


var router = express.Router();

function isAuthenticated(req, res, next) {
  
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
