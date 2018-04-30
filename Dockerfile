FROM node:8.2.1

RUN mkdir /app

WORKDIR /app

RUN npm install -g yarn
COPY ./package.json /app
RUN yarn
COPY ./tsconfig.json /app
COPY ./tslint.json /app
COPY ./src /app/src
COPY ./public /app/public

RUN yarn build

CMD yarn start
