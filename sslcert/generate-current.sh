#!/bin/bash

curl -s -o server.pem http://local-ip.co/cert/server.pem
curl -s -o chain.pem http://local-ip.co/cert/chain.pem
cat server.pem chain.pem > ./default.crt
curl -s -o ./default.key http://local-ip.co/cert/server.key

echo "Done"

