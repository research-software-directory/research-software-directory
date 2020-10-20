FROM node:14-alpine
RUN apk update && apk --no-cache add docker yarn
RUN mkdir /tests
WORKDIR /tests
COPY package.json yarn.lock /tests/
RUN yarn
COPY . /tests
RUN chmod 700 /tests/entrypoint.sh
CMD /tests/entrypoint.sh
