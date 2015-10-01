'use strict';

var config = require('./../../config.js'),
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
    if (err){
      console.log('ERROR connecting');
    }

    var exists = false;

    resp.on('searchEntry', function(entry) {
      exists = true;
    });
    resp.on('error', function(err) {
      console.error('error: ' + err.message);
    });
    resp.on('end', function(result) {
      if (result.status === 0) {
        return cb(null, exists);
//        client.unbind(function(err) {
//        });
      }
    });
  });
};

module.exports = {
  validate: validate
};
