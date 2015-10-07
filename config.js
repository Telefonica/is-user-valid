'use strict';

var config = {
  'port': 5000,
  'realm': 'mycompany',
  'clients': {
    'client_id_A' : {
      'secret' : 'a',
      'company': 'A'
    },
    'client_id_B' : {
      'secret' : 'b',
      'company': 'B'
    }
  },
  'ldap': {
    'url': 'ldap://replicahi.hi.inet:389',
    'maxConnections': 5,
    'searchBase': 'o=TID',
    'filterFieldName': 'mail',
    'scope': 'sub',
    'attributes': 'mail'
  }
};

module.exports = config;
