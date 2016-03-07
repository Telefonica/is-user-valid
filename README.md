# is-user-valid

Really simple service to check if a user is valid in your ldap based on the user's email address.


## Installation

```sh
npm install is-user-valid
```
The above will install the app for listening at port 5000. That's the default port configured for development. You can change that and other settings as explained below.

## Configuration

```json
{
  "port": 5000,
  "realm": "mycompany",

  //List of clients that can access the API
  "clients": {
    "clientA" : {
        "secret" : "secretA",
        "company": "A"
    },
    "clientB" : {
        "secret" : "secretB",
        "company": "B"
    }
  },

  //ldap configuration
  "ldap": {
    //General configuration options
    "clientConfig": {
      "url": "ldap://replicahi.hi.inet:389",
      "timeout": 20000,
      "connectTimeout": 30000,
      "idleTimeout": 30000
    },
    //include username and password when you need to authenticate against the ldap server
    "username": "aaaa",
    "password": "bbbb",

    //ldap queries can be customized based on email domain
    "domains": {
      //default config. You should not remove it.
      "default" : {
        "searchBase": "o=TID",
        "filterFieldName": "mail",
        //Regex to select the part of the email address to be used when querying. It MUST be set.
        "filterFieldRegEx": "(.*)",
        "scope": "sub",
        "attributes": "mail",
      },
      "tid.es" : {
        "searchBase": "o=TID",
        "filterFieldName": "uid",
        "filterFieldRegEx": "([^@]*)",
        "scope": "sub",
        "attributes": "uid"
      }
    }
  }
}
```

## Running and using the app

```sh
 CONFIG_DIR=[path_to_your_config_file_dir] is-user-valid | tee -a [file_where_logs_will_be_stored] > /dev/null &
```
CONFIG_DIR is optional. Note that the content of the config files that are present in this directory will be merged with the config in lib/config/ of this repository (the default config). In case of setting the same attribute, your custom config will take precedence and will override default values.

Now, simply send you queries:

```
GET http://hostname:port/is-user-valid/api/v1/emails/user@domain.com
```

## Caveats

It is recommeded to add HTTPS support to protect HTTP Basic Auth passwords. You can do so for example by placing an nginx in front of the app.
