'use strict';

var config = {
  'port': 5000,
  'clients': [
    {
      'client_id': '1',
      'client_secret': 'a'
    },
    {
      'client_id': '2',
      'client_secret': 'b'
    }
  ],
  'ldap': {
    'url': 'ldap://replicahi.hi.inet:389',
    'maxConnections': 5,
    'searchBase': 'o=TID',
    'filterFieldName': 'mail',
    'scope': 'sub'
  }
};

module.exports = config;
