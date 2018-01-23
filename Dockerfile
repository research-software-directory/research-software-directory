FROM python:3

WORKDIR /src

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 8.9.4

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

COPY package.json /src/
RUN npm install

COPY requirements.txt /src/
RUN pip3 install -r requirements.txt

COPY . /src
RUN node node_modules/gulp/bin/gulp.js build-production
RUN rm -rf $NVM_DIR
RUN rm -rf node_modules

RUN mkdir /var/log/flask-uwsgi
RUN touch /var/log/flask-uwsgi/flask-uwsgi.log
RUN chmod 666 /var/log/flask-uwsgi/flask-uwsgi.log

CMD [ "uwsgi", "--socket", "0.0.0.0:8000", "--processes", "5", "--master", "--wsgi-file", "entry.py" ]
EXPOSE 8000