[![Read the Docs](https://img.shields.io/readthedocs/pip.svg?style=flat-square)](http://researchsoftwaredirectory.readthedocs.io/en/latest/)
[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg?style=flat-square)](https://www.research-software.nl/software/research-software-directory)

# The Research Software Directory's landing page

Read the documentation on [Read The Docs](http://researchsoftwaredirectory.readthedocs.io/en/latest/).

**This repo uses git submodules.**

Here's the command to update all submodules to their latest version (assuming that's the ``master`` branch):

```bash
git submodule foreach git pull origin master
```




# Try it out

Basically, these are the steps to get a copy of https://research-software.nl running locally including data; for details see below:

1. clone this repo
1. create the environmental variables
1. start the complete stack using ``docker-compose``


## Clone this repo

Make sure to use the ``--recursive``, we use ``git submodules``.

```bash
git clone --recursive https://github.com/research-software-directory/research-software-directory.git
```

## create the environment variables

```bash
cd research-software-directory
cp .env.example .env
```

(edit .env)

```bash
# in each repo, create symlinks to the file containing the environmental
# variables.
ENV_VAR_FILE=.env
ln -s ../${ENV_VAR_FILE} auth-github/.env
ln -s ../${ENV_VAR_FILE} backend/.env
ln -s ../${ENV_VAR_FILE} frontend/.env
ln -s ../${ENV_VAR_FILE} tasks-nlesc/.env
```

## Start the complete stack using ``docker-compose``

```bash
docker-compose --file docker-compose.yml up --build
```


