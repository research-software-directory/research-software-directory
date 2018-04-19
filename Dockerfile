FROM node:8.2.1

#RUN mkdir /app
#
#WORKDIR /app
#
#RUN apt-get update
#RUN apt-get -y install nginx
#COPY ./nginx.conf /etc/nginx/sites-enabled/default
#
#COPY ./package.json /app
#COPY ./package-lock.json /app
#RUN npm install
#COPY ./tsconfig.json /app
#COPY ./tslint.json /app
#COPY ./src /app/src
#COPY ./public /app/public
#
#RUN npm run build
#
#CMD nginx -g "daemon off;"
