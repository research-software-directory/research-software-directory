FROM node:14-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.prod.json tslint.json /app/

RUN yarn install

COPY src /app/src/
COPY public /app/public/

RUN yarn build

FROM nginx:1.17.8-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html
