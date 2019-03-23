#!/usr/bin/env bash

cat ${PWD}/docker-entrypoint-initdb.d/dump.sql | docker exec -i pgdev psql -U postgres -d dev