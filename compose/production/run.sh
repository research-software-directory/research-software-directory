#!/bin/sh
# This file is the entrypoint for Docker, do not run on your local system
rm /etc/nginx/sites-enabled/default
if [[ -z "${DOMAIN}" ]] || [ ! -f /cert/live/$DOMAIN/privkey.pem ]; then
    echo "\$DOMAIN not set, or key not found at /cert/live/\$DOMAIN/, cannot setup HTTPS"
    cp compose/production/config/nginx.http.conf.template /etc/nginx/conf.d/default.conf
else
    echo "Configuring HTTPS for $DOMAIN"
    cat compose/production/config/nginx.https.conf.template | sed s#{DOMAIN}#$DOMAIN#g > /etc/nginx/conf.d/default.conf
fi

mkdir -p /run/nginx
nginx
mkdir /var/log/flask-uwsgi
touch /var/log/flask-uwsgi/flask-uwsgi.log
chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log
uwsgi --ini compose/production/config/uwsgi.ini
