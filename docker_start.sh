#!/bin/bash

mongorestore --host mongo --db=school-wallet school-wallet-dump
[ $? -ne 0 ] && echo "Can't restore data to mongo db" && exit 1

npm start