#!/usr/bin/env bash

while ! nc -z -w1 nginx 80 ; do
    sleep 1
done

renew () {
    echo "Renewing certificate..."
    ( set -x; certbot renew --renew-hook  "cp -r /etc/letsencrypt/live/${DOMAIN}/*.pem /cert")
    if [ $? -ne 0 ]; then
        echo "WARNING: Certbot failed to renew certificate"
    fi
}

if [ ! -f /etc/letsencrypt/renewal/${DOMAIN}.conf ]; then
    echo "No existing certbot config found, creating new certificate..."
    #( set -x; certbot certonly --webroot -w /acme -n --agree-tos --email ${ADMIN_EMAIL} -d ${DOMAIN} --expand )
    ( set -x; certbot certonly --webroot -w /acme -n --agree-tos --email ${ADMIN_EMAIL} -d ${DOMAIN} -d www.${DOMAIN} -d test.${DOMAIN} -d software.esciencecenter.nl --expand )
    if [ $? -ne 0 ]; then
        echo "WARNING: Certbot failed to create certificate"
        exit 1
    else
        cp -r /etc/letsencrypt/live/${DOMAIN}/*.pem /cert
    fi
else
    renew
fi

(
    while true; do
        sleep 86400
        renew
    done
) &

RENEW_LOOP_PID=$!
trap "kill -SIGKILL ${RENEW_LOOP_PID}" SIGINT SIGTERM
wait ${RENEW_LOOP_PID}
