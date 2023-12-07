#!/bin/sh
echo $0
DIR=$(cd $(dirname $0)/..; pwd)
echo $DIR
cd $DIR

docker compose -f docker-compose.dev-local.yml up -d && \
docker container exec -it chilocabinet-app sh -c 'npx prisma db seed'
