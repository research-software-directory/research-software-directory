[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg?style=flat-square)](https://www.research-software.nl/software/research-software-directory)
[![Build Status](https://travis-ci.org/research-software-directory/research-software-directory.svg?branch=master)](https://travis-ci.org/research-software-directory/research-software-directory)

# For users

## Try it out

Basically, these are the steps to get a copy of https://research-software.nl running locally (including data):

1. clone this repo
1. create the environmental variables
1. start the complete stack using ``docker-compose``

For details, see below:

**Try it out step 1/3: clone this repo**

Make sure to use the ``--recursive``, we use ``git submodules``.

```bash
git clone --recursive https://github.com/research-software-directory/research-software-directory.git
```

**Try it out step 2/3: create the environment variables**

```bash
cd research-software-directory
cp .env.example .env
```

(edit .env)


AUTH_GITHUB_CLIENT_*
 - https://github.com/settings/developers -> oath app -> new oauth app 
 - client id -> AUTH_GITHUB_CLIENT_ID
 - secret -> AUTH_GITHUB_CLIENT_SECRET
 - Authorization callback url: https://localhost/auth/get_jwt
GITHUB_ACCESS_TOKEN: https://github.com/settings/tokens -> personal acces token -> generate new token (no need to edit permissions/scope?

ZOTERO_API_KEY
  - https://www.zotero.org/settings/keys
  - create new private key
  - group permissions: read only
  
**Try it out step 3/3: start the complete stack using ``docker-compose``**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

# For maintainers

## Making a release

1. Write the release notes
1. Gather information on submodules such that it will make it to Zenodo, e.g.

    ```bash
    git submodule status > submodules.sha.txt or the readme or something
    git add, commit, and push

1. Make sure that everything is pushed, and actually works if you follow the steps
    cd $(mktemp -d)
    git clone --recursive https://github.com/research-software-directory/research-software-directory.git .
    cd research-software-directory/
1. Copy your env file into research-software-directory, or create a new one (see notes in 'For users' section above)
1  Run the stack

    ```bash
    docker-compose --file docker-compose.yml up --build
    ```
    
1. In a browser, open 
    - http://localhost
    - http://localhost/admin
    - http://localhost/api/software
    
    verify that it all works as it should.







