#!/usr/bin/env sh

test_service_available()
{
    if ! nc -z -w1 $1 $2; then
        echo "service $1:$2 not available"
        exit 1
    fi
}

test_service_available nginx 80
test_service_available backend 5001
test_service_available frontend 5004
test_service_available auth 5002

yarn test