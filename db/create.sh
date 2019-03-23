#!/usr/bin/env bash

  docker run \
  --name pgdev \
  -e POSTGRES_PASSWORD=docker \
  -e POSTGRES_DB=dev \
  -p 5433:5432 \
  -d postgres:10.7 
  