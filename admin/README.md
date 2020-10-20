# Admin interface

This is the admin user interface for the Research Software Directory. It can be used to add and update software items to
the directory. The admin interface requires credentials for users to see the admin interface.

TODO:

- add notes on how to do local development ([#349](https://github.com/research-software-directory/research-software-directory/issues/349))
- add notes on how to keep the dependencies updated, e.g. using `yarn audit` and `yarn outdated` ([#367](https://github.com/research-software-directory/research-software-directory/issues/367))

## Development setup

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using
scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app). Original documentation
[here](https://github.com/NLeSC/create-react-app/blob/master/packages/react-scripts/template/README.md).

### Prerequisites

1.  Install node version `^14.0`, e.g. using `nvm` (Node Version Manager, see https://github.com/nvm-sh/nvm#install-script):
    1.  `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash`
    1.  restart terminal
    1.  run `nvm install 14`
1.  (Optional) Install `jq` for processing JSON config files:

    ```shell
    sudo apt install jq
    ```

### Getting a local development build running

1.  Bring up the Research Software Directory as normal, except for the admin interface:

    ```shell
    cd research-software-directory

    docker-compose build && \
       docker-compose up -d && \
       docker-compose stop admin && \
       docker-compose logs --follow
    ```

1.  New terminal
1.  Get the IP addresses for the `auth` and `backend` services (Note `rsd_default` may be different for you if you
    changed `COMPOSE_PROJECT_NAME` in `.env`):

    ```shell
    # where is auth running?
    docker inspect $(docker-compose ps -q auth) | \
       jq .[0].NetworkSettings.Networks.rsd_default.IPAddress

    # where is backend running?
    docker inspect $(docker-compose ps -q backend) | \
       jq .[0].NetworkSettings.Networks.rsd_default.IPAddress
    ```

1.  `cd admin`
1.  Install yarn, `npm install -g yarn` (Note: there exists a similarly named package, Apache Hadoop YARN --please ignore
    that, it's something else)
1.  Install the `admin` service's dependencies: `yarn install`
1.  In `package.json`, update IP addresses for `/api` using `backend`'s IP and for `auth` using `auth`'s IP
1.  Start the admin service in a development server: `yarn start`. It will tell you where to go to check the `admin`
    interface (probably http://localhost:8000).

## Production setup: non-dockerized

To build the app for production run:

```bash
yarn build
```

The deployable app will build to the `./build/` directory.

## Production setup: dockerized

The Docker image should not be used on its own, as the code expects the [backend server](/backend) to be running at
`/api` and the [auth server](/auth-github) to be running at `/auth`.

The `rsd/admin` image should be used as part of a `docker-compose`, see
https://github.com/research-software-directory/research-software-directory:

```bash
cd research-software-directory
docker-compose build admin
```
