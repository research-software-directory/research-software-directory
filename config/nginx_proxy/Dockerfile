FROM nginx:1.13.12-alpine
RUN apk add --no-cache inotify-tools procps openssl
COPY ./start.sh /
COPY ./nginx.conf.template /
CMD sh /start.sh