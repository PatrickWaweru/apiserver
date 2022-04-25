OAUTH2 API SERVER
==========================

Description
-----------
This is an API server protected by OAUTH2

Before you do anything
----------------------

Create an OKRA account and add client credentials

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
SERVER_PORT=<server port>

```

Be sure to auth using OAUTH2 client credentials grant type before calling any API

Building from Source
--------------------

npm install
npm build

Installation
------------

npm install
node .

Development
------------

npm install
npm run dev

Accreditation
-------------
Patrick Waweru
