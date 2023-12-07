#!/bin/sh
echo $0
DIR=$(cd $(dirname $0)/..; pwd)
echo $DIR
cd $DIR

docker container exec -it chilocabinet-app sh -c 'npx prisma db seed'
