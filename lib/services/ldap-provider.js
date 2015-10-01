'use strict';

var config = require('./../../config.js'),
    logger = require('../logger'),
    ldap = require('ldapjs');

var searchBase = config.ldap.searchBase;

var client = ldap.createClient({
  url: config.ldap.url,
  maxConnections: config.ldap.maxConnections,
});

var validate = function (email, cb) {
  var opts = {
    scope: config.ldap.scope,
    filter: config.ldap.filterFieldName+ '=' + email,
    attributes: 'mail'
  };
  client.search(searchBase, opts, function(err, resp) {

    var exists = false;

    if (err){
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
