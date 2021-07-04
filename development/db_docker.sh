#!/bin/bash

#docker netowrk create --subnet=172.18.0.0/16 clusterduck

docker run \
-it --rm -d \
-v mongodb:/data/db \
-v mongodb_config:/data/configdb \
-p 27017:27017 \
--network clusterduck_dev \
--ip 172.19.0.2 \
--name mongodb \
mongo