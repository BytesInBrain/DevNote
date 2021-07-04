#!/bin/bash

# docker run \
# -it --rm -d \
# -v mongodb:/data/db \
# -v mongodb_config:/data/configdb \
# -p 27017:27017 \
# --network clusterduck \
# --name mongodb \
# mongo


docker run \
-it --rm -d \
--mount type=bind,source=${PWD}/,target=/home/src \
-w /home/src \
--network clusterduck \
--name noteapi \
-p 5000:5000 \
node