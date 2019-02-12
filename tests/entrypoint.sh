#!/usr/bin/env sh

sleep 20

assert_service_available()
{
    if ! nc -z -w1 $1 $2; then
        echo "service $1:$2 not available"
        exit 1
    fi
}

docker ps

assert_service_available reverse-proxy 80
assert_service_available backend 5001
assert_service_available frontend 5004
assert_service_available auth 5002
assert_service_available graphs 8080
assert_service_available database 27017

yarn test