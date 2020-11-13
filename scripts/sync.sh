#!/usr/bin/env bash

#Get current date
NOW="$(date +'%m-%d-%Y_%H-%M')"

# Path to a temporary directory
DIR=./igbo_api_db

# Path to the target dropbox directory
TARGET_DIR=/

# Name of the database
DB_URI=$1
DB_NAME=igbo_api

# Name of the compressed file
FILE="${DB_NAME}_${NOW}.tar.gz"

function mongodb_dump
{
  # Dump the database
  mongodump --uri $DB_URI -o $DIR

  if [ $? -eq 0 ]
  then
    echo "✅ MongoDB dump successful"
  else
    echo "🔴 MongoDB dump failed"
    exit 1
  fi

  # Compress
  tar -zcvf $FILE $DIR

  # Remove the temporary database dump directory
  rm -fr $DIR
}

mongodb_dump

readonly TOKEN=$2
readonly DIR=
BASENAME=$(basename $FILE)
if [ -f "$FILE" ]; then
# upload file to dropbox
CMD="upload $DIR/$BASENAME"
HTTP_CODE=$(curl -X POST -sL -w "%{http_code}" --output /dev/null https://content.dropboxapi.com/2/files/upload \
--header "Authorization: Bearer $TOKEN" \
--header "Dropbox-API-Arg: {\"path\": \"$DIR/$BASENAME\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}" \
--header "Content-Type: application/octet-stream" \
--data-binary @$FILE)
fi
echo $CMD
echo "Response code => $HTTP_CODE"

if [ $HTTP_CODE != "200" ]; then
  echo "🔴 Backup failed"
  exit 1
else
  echo "✅ Backup successful"
  exit 0
fi