# is-user-valid

Really simple service to check if a user is valid in your ldap based on the user's email address.


## Installation

```sh
git clone 
cd is-user-valid
npm install
```
The above will run the app listening at port 5000. That's the default port configured for development. You can change that and other settings as explained below.

## Configuration

```javascript
var config = {
  'port': 5000, //port where the app listens
  'realm': 'mycompany', //name of realm for you campany, used for HTTP basic auth
  'clients': { //list of clients and passwords that give access to the API
    'client_id_A' : {
      'secret' : 'a',
      'company': 'A'
    },
    'client_id_B' : {
      'secret' : 'b',
      'company': 'B'
    }
  },
  'ldap': { //ldap configuration
    'url': 'ldap://replicahi.hi.inet:389',
    'maxConnections': 5, //recommended value so that ldap client handles reconnections, etc
    //you can customize the ldap query by setting following fields
    'searchBase': 'o=TID', 
    'filterFieldName': 'mail',
    'scope': 'sub',
    'attributes': 'mail'
  }
};
```

## Running and using the app

```sh
node lib/is-user-valid.js | tee -a path_to_file_where_logs_will_be_stored > /dev/null &
```

Now, simply send you queries: 

```
GET http://hostname:port/is-user-valid/api/v1/emails/user@domain.com
```

## Caveats

It is recommeded to add HTTPS support to protect HTTP Basic Auth Passwords. You can do so for example by placing an nginx in front of the app.