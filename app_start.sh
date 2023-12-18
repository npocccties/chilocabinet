#!/bin/sh
# バックエンドのコンテナ起動
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
if ! docker network ls | grep db_network > /dev/null 2>&1; then
    docker network create db_network
fi
docker compose -f docker-compose.production-db.yml up -d
docker container stop chilocabinet 2>&1 || true
docker compose -f docker-compose.production.yml up -d --build
/bin/sh ./server_db_restore.sh
