#!/bin/bash
if [[ -z "${DOMAIN}" ]] || [ ! -f /cert/live/$DOMAIN/privkey.pem ]; then
    echo "WARNING: \$DOMAIN not set, or key not found at /cert/live/\$DOMAIN/, cannot setup HTTPS"
    cat /config/nginx.http.conf.template | sed s#{STATIC_FILES_URL}#$STATIC_FILES_URL#g > /etc/nginx/conf.d/default.conf
else
    echo "Configuring HTTPS for $DOMAIN"
    cat /config/nginx.https.conf.template | sed s#{STATIC_FILES_URL}#$STATIC_FILES_URL#g | sed s#{DOMAIN}#$DOMAIN#g > /etc/nginx/conf.d/default.conf
fi

echo "nginx starting"
nginx -g "daemon off;"
