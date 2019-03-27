#!/usr/bin/env bash

docker exec -i pgdev psql -U postgres -d dev < ${PWD}/docker-entrypoint-initdb.d/dump.sql