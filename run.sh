#!/bin/sh
cat config/nginx.conf.template | sed s#{STATIC_FILES_URL}#$STATIC_FILES_URL#g > /etc/nginx/conf.d/default.conf

mkdir -p /run/nginx
nginx
mkdir /var/log/flask-uwsgi
touch /var/log/flask-uwsgi/flask-uwsgi.log
chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log
uwsgi --ini config/uwsgi.ini
