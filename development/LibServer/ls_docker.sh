#!/bin/bash
docker run \
-it --rm  -d \
--mount type=bind,source=${PWD},target=/home/src \
-w /home/src \
--network clusterduck_dev \
--name noteapi_dev \
--ip 172.19.0.4 \
-p 5001:5001 \
node