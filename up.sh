#!/bin/sh

set -e

./build.sh

docker-compose -f docker-compose.yml up --build