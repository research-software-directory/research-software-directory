FROM node:carbon

WORKDIR /app

COPY ./package.json .
RUN npm install

COPY ./gulpfile.js .

ENTRYPOINT ["node", "node_modules/gulp/bin/gulp.js", "watch"]