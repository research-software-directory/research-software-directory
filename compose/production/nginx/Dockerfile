FROM nginx:1.12

COPY ./compose/production/nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN chown nginx /entrypoint.sh

COPY ./compose/production/nginx/config /config
RUN chown -R nginx /config

RUN mkdir -p /run/nginx
RUN chown nginx /run/nginx

ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 8000