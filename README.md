OAUTH2 API SERVER
==========================

Description
-----------
This is an API server protected by OAUTH2

Before you do anything
----------------------

Create an OKRA account and add client credentials

Regenerate ssl server certificate by running sslcert/generate-current.sh
This will enable access of the apiserver through https 
The URL will look like: https://YOUR-LOCAL-IP-HERE.my.local-ip.co:PORT

Create a file named .env with the following structure

```
ISSUER=<OKRA URL>
SCOPE=<scope name>
CLIENT_ID=<client id>
CLIENT_SECRET=<client secret>
DB_NAME=<mysql DB name>
DB_USER=<mysql user>
DB_PASSWORD=<mysql password>
DB_IP=<mysql IP address>
DB_PORT=<mysql port>
HTTP_SERVER_PORT=<http server port>
HTTPS_SERVER_PORT=<https server port>

```

Be sure to auth using OAUTH2 client credentials grant type before calling any API

Building from Source
--------------------

```
npm install
npm build
```

Installation
------------

```
npm install
node .
```

Development
------------

```
npm install
npm run dev
```

Accreditation
-------------
Patrick Waweru
