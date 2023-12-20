#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
/bin/sh ./server_db_backup.sh
docker compose -f docker-compose.production-db.yml down -v
docker compose -f docker-compose.production.yml -p chilocabinet down -v
