#!/bin/sh
mkdir /var/log/flask-uwsgi
touch /var/log/flask-uwsgi/flask-uwsgi.log
chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log
uwsgi --ini compose/production/flask/config/uwsgi.ini
