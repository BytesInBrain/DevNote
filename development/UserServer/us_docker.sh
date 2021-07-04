#!/bin/bash
docker run \
-it --rm  -d \
--mount type=bind,source=${PWD},target=/home/src \
-w /home/src \
--network clusterduck_dev \
--name userapi_dev \
--ip 172.19.0.3 \
-p 5000:5000 \
node