#!/bin/sh
if [[ -z "${DOMAIN}" ]] || [ ! -f /cert/live/$DOMAIN/privkey.pem ]; then
    echo "\$DOMAIN not set, or key not found at /cert/live/\$DOMAIN/, cannot setup HTTPS"
    cat config/nginx.http.conf.template | sed s#{STATIC_FILES_URL}#$STATIC_FILES_URL#g > /etc/nginx/conf.d/default.conf
else
    echo "Configuring HTTPS for $DOMAIN"
    cat config/nginx.https.conf.template | sed s#{STATIC_FILES_URL}#$STATIC_FILES_URL#g | sed s#{DOMAIN}#$DOMAIN#g > /etc/nginx/conf.d/default.conf
fi

mkdir -p /run/nginx
nginx
mkdir /var/log/flask-uwsgi
touch /var/log/flask-uwsgi/flask-uwsgi.log
chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log
uwsgi --ini config/uwsgi.ini
