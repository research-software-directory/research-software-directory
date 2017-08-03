FROM mhart/alpine-node:8.2.1

WORKDIR /src

ADD ./package.json ./package.json
ADD ./tsconfig.json ./tsconfig.json
ADD ./tslint.json ./tslint.json
ADD ./public ./public
ADD ./src ./src

RUN (npm install)

#RUN (npm test)

RUN (npm start)

ENTRYPOINT ["/bin/sh"]
