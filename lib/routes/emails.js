'use strict';

var ldapProvider = require('../services/ldap-provider.js');

function isAuthenticated(req, res) { //TODO: add real security with basic auth
  return true;
}

function getEmail(req, res) {
  console.log (req.params.email);
  ldapProvider.validate(req.params.email, function (err, memberInfo) {
    return res.end(JSON.stringify(memberInfo));
  });
}

module.exports = {
  getEmail: getEmail
};
