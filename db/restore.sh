#!/usr/bin/env bash

docker exec -i pdxfood psql -U postgres -d dev < ${PWD}/docker-entrypoint-initdb.d/dump.sql