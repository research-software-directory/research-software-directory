# build this container with
# docker build . --tag rsd/graphs
#
# then run the container with
# docker run --name rsd-graphs --detach --publish 8080:80 rsd/graphs
#
# localhost:8080 should then show the graphs website

FROM nginx:1.17.8-alpine

# default nginx configuration file is located at /etc/nginx/nginx.conf
# default nginx file hosting directory is /usr/share/nginx/html/

COPY src /usr/share/nginx/html
