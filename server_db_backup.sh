#!/bin/sh
echo $0
DIR=$(cd $(dirname $0); pwd)
echo $DIR
cd $DIR
source ./.env
docker compose -f docker-compose.production-db.yml exec -T db pg_dump -h 127.0.0.1 \
    -p 5432 -d $DB_NAME -U $DB_USER \
    -Fc -v --file=/var/lib/postgresql/chilocabinet.dump
BACKUP_FILE="${DIR}/postgresql/data/chilocabinet.dump"
if [ -e $BACKUP_FILE ]; then
    sudo cp $BACKUP_FILE /var
    /bin/sh ./server_db_backup_dump.sh
fi
