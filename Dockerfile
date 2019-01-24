FROM node:8.9.4

RUN mkdir /app

WORKDIR /app

COPY index.html webpack.config.js package.json yarn.lock /app/
COPY src /app/src

RUN npm install yarn
RUN yarn install
RUN yarn build
EXPOSE 8080

# not how it should be, but this works at least:
CMD ["python", "-m", "SimpleHTTPServer", "8080"]
