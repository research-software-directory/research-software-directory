#!/usr/bin/env bash

if [ ! -f /cert/privkey.pem ]; then
    echo "No SSL certificate found."
    echo "Generating self-signed certificate"
    ( set -x; openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj '/CN=*.'${DOMAIN}'/O=RSD./C=NL' -keyout /cert/privkey.pem -out /cert/fullchain.pem )
fi

envsubst '$$DOMAIN' < /nginx.conf.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;' &
NGINX_PID=$!

( while inotifywait -e close_write "/cert" ; do
    echo "sending SIGHUP to nginx"
    kill -SIGHUP ${NGINX_PID}
  done
) &
INOTIFY_PID=$!

trap "kill -SIGINT ${NGINX_PID} && kill -SIGKILL ${INOTIFY_PID}" SIGINT
trap "kill -SIGTERM ${NGINX_PID} && kill -SIGKILL ${INOTIFY_PID}" SIGTERM

wait ${INOTIFY_PID}
