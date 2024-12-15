FROM node:14-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY src /app/src/
COPY public /app/public/

RUN npm run build

FROM nginx:1.17.8-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist /usr/share/nginx/html
