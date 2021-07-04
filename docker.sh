#!/bin/bash

#docker netowrk create --subnet=172.18.0.0/16 clusterduck

docker run \
-it --rm -d \
-v mongodb:/data/db \
-v mongodb_config:/data/configdb \
-p 27017:27017 \
--network clusterduck \
--ip 172.18.0.2 \
--name mongodb \
mongo


docker run \
-it --rm -d \
--mount type=bind,source=${PWD}/Library,target=/home/src \
-w /home/src \
--network clusterduck \
--name noteapi1 \
--ip 172.18.0.4 \
-p 5001:5001 \
node

docker exec noteapi1 npm install
docker exec -d noteapi1 node server.js

docker run \
-it --rm  -d \
--mount type=bind,source=${PWD}/UserServer,target=/home/src \
-w /home/src \
--network clusterduck \
--name noteapi \
--ip 172.18.0.3 \
-p 5000:5000 \
node

docker exec noteapi npm install
docker exec -d noteapi node server.js

docker run \
-it --rm  -d \
--mount type=bind,source=${PWD}/UI/library,target=/usr/share/nginx/html \
-p 80:80 \
--name noteUI \
nginx

exit
