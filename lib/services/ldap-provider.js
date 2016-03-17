'use strict';

var config = require('../config'),
    ldap = require('ldapjs');

var ldapConfig = config.get('ldap');

var client = ldap.createClient(ldapConfig.clientConfig);

if (ldapConfig.username && ldapConfig.password) {
  client.bind(ldapConfig.username, ldapConfig.password, function(err) {
    if (err) {
      throw(err);
    }
  });
}

var validate = function(email, cb) {
  //obtain email domain
  var parts = email.split('@');
  var emailDomain = parts[1];
  var domain = (typeof ldapConfig.domains[emailDomain] === 'undefined') ? 'default' : emailDomain;
  var re = new RegExp(ldapConfig.domains[domain].filterFieldRegEx);
  var result = re.exec(email);
  var filterValue = result[0];

  //apply query configuration for the email domain
  var opts = {
    scope: ldapConfig.domains[domain].scope,
    filter: ldapConfig.domains[domain].filterFieldName + '=' + filterValue,
    attributes: ldapConfig.domains[domain].attributes
  };
  var searchBase = ldapConfig.domains[domain].searchBase;

  //peform query
  client.search(searchBase, opts, function(err, resp) {

    var exists = false;

    if (err) {
      var error = new Error('Cannot connect to ldap server: ' + err);
      return cb(error);
    }
    resp.on('searchEntry', function(entry) {
      exists = true;
    });
    resp.on('error', function(err) {
      var error = new Error('An error happened during the ldap query: ' + err);
      return cb(error);
    });
    resp.on('end', function(result) {
      if (result.status === 0) {
        return cb(null, exists);
      }
      var error = new Error('Ldap query was unsuccessful: ' + err);
      return cb(error);
    });
  });
};

module.exports = {
  validate: validate
};
