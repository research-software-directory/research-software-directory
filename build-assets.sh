#!/usr/bin/env bash

if ! which nvm
then curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 8
nvm use 8
npm install
node node_modules/gulp/bin/gulp.js build-production
rm -rf $NVM_DIR
rm -rf node_modules