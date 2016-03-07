'use strict';

var config = require('../config'),
    logger = require('../logger'),
    ldap = require('ldapjs');

var ldapConfig = config.get('ldap');

var client = ldap.createClient(ldapConfig.clientConfig);

if (ldapConfig.username && ldapConfig.password) {
  client.bind(ldapConfig.username, ldapConfig.password, function(err) {
    if (err) {
      logger.error('ERROR when binding to ldap server:', JSON.stringify(err));
    } else {
      logger.info('Binding to ldap server was successful');
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
      logger.error('ERROR when connecting to ldap server:', JSON.stringify(err));
      return cb(err, exists);
    }
    resp.on('searchEntry', function(entry) {
      exists = true;
    });
    resp.on('error', function(err) {
      logger.error('ERROR when connecting to ldap server:', JSON.stringify(err));
      return cb(err, exists);
    });
    resp.on('end', function(result) {
      if (result.status === 0) {
        return cb(null, exists);
      }
      logger.error('ERROR when searching in ldap server. Error status:', result.status);
      return cb(true, exists);
    });
  });
};

module.exports = {
  validate: validate
};
