#!/usr/bin/env bash

docker exec -i pdx-food-map psql -U postgres -d dev < ${PWD}/docker-entrypoint-initdb.d/dump.sql
