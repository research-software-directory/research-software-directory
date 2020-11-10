# Admin interface

This is the admin user interface for the Research Software Directory. It can be used to add and update software items to
the directory. The admin interface requires credentials for users to see the admin interface.

TODO:

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
1.  Install yarn, `npm install -g yarn` (Note: there exists a similarly named package, Apache Hadoop YARN --please ignore
    that, it's something else)

### Getting a local development build running

1.  To login in to admin interface you need to set the authentication callback to `http://localhost:8000/auth/get_jwt` on [https://github.com/settings/developers](https://github.com/settings/developers)
1.  Start the services required by admin interface:

    ```shell
    cd research-software-directory
    docker-compose -f docker-compose.yml -f admin/docker-compose.dev.yml up
    ```

1.  New terminal
1.  `cd admin`
1.  Install the `admin` service's dependencies: `yarn install`
1.  Start the admin service in a development server: `yarn start`. It will tell you where to go to check the `admin`
    interface (http://localhost:8000).

The Docker containers started with `docker-compose` is a complete Research Software Directory instance on https://localhost including an admin interface. Any changes made to software/projects/etc. in the admin interface running on http://localhost:8000 will be saved in the instance and can be viewed there.

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
