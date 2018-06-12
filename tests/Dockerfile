FROM node:9.11.1-alpine
RUN mkdir /tests
WORKDIR /tests
COPY package.json yarn.lock /tests/
RUN npm install -g yarn
RUN yarn
COPY . /tests
RUN chmod 700 /tests/entrypoint.sh
CMD /tests/entrypoint.sh