![TravisCIBadge](https://travis-ci.org/NLeSC/research-software-directory-admin.svg?branch=master)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) using scripts package [@nlesc/react-scripts](https://github.com/NLeSC/create-react-app). Original documentation [here](https://github.com/NLeSC/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Docker
- `docker build -f ./Dockerfile.dev . -t rsd-admin`

# Installation
- Clone repository
- Use node version `^8.0`, eg using [nvm](#install-node-using-nvm)
- Install dependencies: `npm install`
- Run tests `npm run test`
- Start app in dev server: `npm start`

To build:
- `npm run build`
- Will build to `[current directory]/build`

# Settings
- see `src/settings.ts`
- requires [backend](https://github.com/NLeSC/research-software-directory-backend)

### Install node using NVM
See https://github.com/creationix/nvm#install-script
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
- restart terminal
- run `nvm install 8`
