#!/bin/bash

test_type=$1
[ -z "$test_type" ] && echo "Usage: gemini_test.sh update|test" && exit 1

docker-compose up -d --build

mongorestore --db=school-wallet school-wallet-dump
[ $? -ne 0 ] && echo "Error: can not restore mogno dump!" && exit 1

./node_modules/.bin/gemini $test_type

docker-compose down
