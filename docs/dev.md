
# Documentation for developers

## Try it out locally

Basically, the steps to get a copy of https://research-software.nl running locally (including data) are as follows:

1. Fork this repo to your own GitHub organization or GitHub profile and clone it
1. Configure
1. Start the complete stack using ``docker-compose``

For details, see below.

Make sure you have a Linux computer with ``docker``, ``docker-compose``, and
``git`` installed. Other operating systems might work but we develop exclusively
on Linux based systems. You can find the installation instructions for each tool
here:
- ``docker``: https://docs.docker.com/install/
- ``docker-compose``: https://docs.docker.com/compose/install/
- ``git``: ``sudo apt install git`` (see https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

You'll need a minimum of about 3 GB free disk space to
store the images, containers and volumes that we will be making.

Optionally, add yourself to the ``docker`` group following the instructions
[here](https://docs.docker.com/install/linux/linux-postinstall/) (our
documentation assumes that you did).

### Try it out, step 1/3: Fork and clone

Click the ``Fork`` button on
https://github.com/research-software-directory/research-software-directory/ to
fork to your own GitHub organization or GitHub profile, then:

```bash
git clone https://github.com/<your-github-organization>/research-software-directory.git
```

### Try it out, step 2/3: Configure

The research software directory is configured using a file with environment
variables called `rsd-secrets.env`. An example config file
(`rsd-secrets.env.example`) is available, use it as a starting point.

```bash
cd research-software-directory
cp rsd-secrets.env.example rsd-secrets.env
```

The `docker-compose` command looks for a configuration file called `.env`. Create
a symbolic link  named `.env` and let point to `rsd-secrets.env`:

```bash
ln -s rsd-secrets.env .env
```

The config file has some placeholder values (`changeme`); they must be set by
editing the `rsd-secrets.env` file. Below are instructions on how to get the
different tokens and keys.

#### ``COMPOSE_PROJECT_NAME``

This is a prefix that docker-compose uses in naming its images, containers, and
volumes in order to avoid name clashes. Its default value is ``rsd``.

#### ``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET``

These environment variables are used for authenticating a user, such that they
can be granted access to the admin interface to create, read, update, and delete
items in the Research Software Directory.

These are the steps to assign values:

1. Go to https://github.com/settings/developers
1. Click the ``New OAuth App`` button
1. Under ``Application name``, write something like _The Research Software
Directory's admin interface on localhost_
1. Under ``Homepage URL`` fill in some URL, for example, let it point to this
readme on GitHub. Despite the fact that it is a required field, its value is
not used as far as I can tell.
1. Optionally add a description. This is especially useful if you have multiple OAuth apps
1. The most important setting is the value for ``Authorization callback url``.
Set it to http://localhost/auth/get_jwt for now. We will revisit
``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET`` in the section about
deployment
[below](#make-your-instance-available-to-others-by-hosting-it-online-deployment)
1. Click ``Register application``
1. Assign the ``Client ID`` as value for ``AUTH_GITHUB_CLIENT_ID`` and assign
the ``Client Secret`` as value for ``AUTH_GITHUB_CLIENT_SECRET``

#### ``AUTH_GITHUB_ORGANIZATION``

Data is entered into the Research Software Directory via the admin interface.
Set ``AUTH_GITHUB_ORGANIZATION`` to the name of the GitHub organization whose
members should be allowed access to the admin interface. Most likely, it is the
name of the organization where you forked this repository to.

Note: members should make their membership of the GitHub organization public. Go
to
[https://github.com/orgs/&lt;your-github-organization&gt;/people](https://github.com/orgs/your-github-organization/people)
to see which users are a member of &lt;your-github-organization&gt;, and whether
their membership is public or not.

#### ``GITHUB_ACCESS_TOKEN``

To query GitHub's API programmatically, we need an access token. Here's how you can get one:

1. Go to https://github.com/settings/tokens
1. Click ``Generate new token``
1. Under ``Token description``, fill in something like _Key to programmatically retrieve information from GitHub's API_
1. Verify that all scopes are unchecked
1. Use token as value for ``GITHUB_ACCESS_TOKEN``

#### ``ZENODO_ACCESS_TOKEN``

To query Zenodo's API programmatically, we need an access token. Here's how you can get one:

1. Go to https://zenodo.org/account/settings/applications/tokens/new/
1. For name, fill in something like _Key to retrieve data from Zenodo_
1. Make sure all scopes are unselected
1. Click Create
1. Fill in the long string you get as value for ``ZENODO_ACCESS_TOKEN``

#### ``ZOTERO_LIBRARY``

When getting the references data from Zotero, this environment variable
determines which library on Zotero is going to be harvested. Go to
https://www.zotero.org/groups/ to see which Zotero groups you are a member of.
If you click on the ``Group library`` link there, the URL will change to
something like
https://www.zotero.org/groups/1689348/netherlands_escience_center/items, where
``1689348`` is the value you need to assign to ``ZOTERO_LIBRARY``.


#### ``ZOTERO_API_KEY``

To query Zotero's API programmatically, we need an API key. Here's how
you can get one:

1. https://www.zotero.org/settings/keys
1. Click ``Create new private key``
1. Type a description of the key, e.g. _API key to access library X on Zotero_
1. Under ``Personal library``, make sure only ``Allow library access`` is checked.
1. Under ``Default group permissions``, choose ``None``
1. Under ``Specific groups``, check ``Per group permissions``
1. Set ``Read only`` for the group that you want to harvest your references data from; verify that any other groups are set to ``None``
1. Click the ``Save Key`` button at the bottom of the page.
1. On the ``Key Created`` page, you will see a string of random character,
something like ``bhCJSBCcjzptBvd3fvliYOoE``. This is the key; assign it to
``ZOTERO_API_KEY``

#### ``BACKUP_CMD``

This environment variable is used for making a daily backup of the database with
software, people, projects, etc. As it is typically only used during deployment,
leave its value like it is for now; we will revisit it in the section about
deployment
[below](#make-your-instance-available-to-others-by-hosting-it-online-deployment).


#### ``JWT_SECRET``

<!-- This environment variable is used for ... TODO -->

The ``JWT_SECRET`` is simply a string of random characters. You can generate one
yourself using the ``openssl`` command line tool, as follows:

```bash
openssl rand -base64 32
```

Assign the result to ``JWT_SECRET``.

#### ``DOMAIN``, ``SSL_ADMIN_EMAIL``, and ``SSL_DOMAINS``

These environment variables are not relevant when you're running your instance
locally. Leave their values like they are in ``rsd-secrets.env.example`` for the
time being. We will revisit them in the section about deployment
[below](#make-your-instance-available-to-others-by-hosting-it-online-deployment).

### Try it out, step 3/3: Start the complete stack using [docker-compose](https://docs.docker.com/compose/)

```bash
# build all containers:
docker-compose build

# start the full stack using docker-compose:
docker-compose up -d

# see logging from all services with
docker-compose logs --follow

# or from a specific service only, e.g. backend
docker-compose logs --follow backend
```

After the Research Software Directory instance is up and running, we want to
start harvesting data from external sources such as GitHub, Zotero, Zenodo, etc.
To do so, open a new terminal and run

```bash
docker-compose exec harvesting python app.py harvest all
```

You should see some feedback in the newly opened terminal.

After the ``harvest all`` task finishes, several database collections should
have been updated, but we still need to use the data from those separate
collections and combine them into one document that we can feed to the frontend.
This is done with the ``resolve all`` task, as follows:

```bash
docker-compose exec harvesting python app.py resolve all
```

By default, the ``resolve all`` task runs every 10 minutes anyway, so you could just wait for a bit, until you see some output scroll by that is generated by the ``rsd-harvesting`` container, something like:

```
rsd-harvesting     | 2018-07-11 10:30:02,990 cache [INFO] processing software Xenon command line interface
rsd-harvesting     | 2018-07-11 10:30:03,013 cache [INFO] processing software Xenon gRPC server
rsd-harvesting     | 2018-07-11 10:30:03,036 cache [INFO] processing software xtas
rsd-harvesting     | 2018-07-11 10:30:03,059 cache [INFO] processing software boatswain
rsd-harvesting     | 2018-07-11 10:30:03,080 cache [INFO] processing software Research Software Directory
rsd-harvesting     | 2018-07-11 10:30:03,122 cache [INFO] processing software cffconvert
rsd-harvesting     | 2018-07-11 10:30:03,149 cache [INFO] processing software sv-callers

```

### Verifying the local installation

Open a web browser to verify that everything works as it should. Below are some things to check:

#### Frontend

- [``http://localhost``](http://localhost) should show the index page to the local instance of the Research Software Directory
- [``http://localhost/software/xenon``](http://localhost/software/xenon) should show a product page (here: Xenon) in the local instance of the Research Software Directory

#### Admin interface

- [``http://localhost/admin``](http://localhost/admin) should show the Admin interface to the local instance of the Research Software Directory

#### API

- [``http://localhost/api/mention``](http://localhost/api/mention) should show a JSON representation of all mentions in the local instance of the Research Software Directory
- [``http://localhost/api/organization``](http://localhost/api/organization) should show a JSON representation of all organizations in the local instance of the Research Software Directory
- [``http://localhost/api/project_cache``](http://localhost/api/project_cache) should show a JSON representation of all projects in the local instance of the Research Software Directory, with all references resolved
- [``http://localhost/api/project``](http://localhost/api/project) should show a JSON representation of all projects in the local instance of the Research Software Directory
- [``http://localhost/api/release``](http://localhost/api/release) should show a JSON representation of all releases in the local instance of the Research Software Directory
- [``http://localhost/api/software_cache``](http://localhost/api/software_cache) should show a JSON representation of all software in the local instance of the Research Software Directory, with all references resolved
- [``http://localhost/api/software/xenon``](http://localhost/api/software/xenon) should show a JSON representation of a product (here: Xenon) in the local instance of the Research Software Directory
- [``http://localhost/api/software``](http://localhost/api/software) should show a JSON representation of all software in the local instance of the Research Software Directory

The api endpoints also support the following query parameters:

- ``sort`` (e.g. ``sort=updatedAt``)
- ``direction`` (e.g. ``direction=desc``)
- ``limit`` (e.g. ``limit=3``)

Which can be combined in the usual way, e.g.

- [``http://localhost/api/mention?limit=3&direction=desc&sort=updatedAt``](http://localhost/api/mention?limit=3&direction=desc&sort=updatedAt) should return the 3 mentions that were updated most recently.

#### Citation

- [``http://localhost/cite/xenon?version=3.0.4&format=bibtex``](http://localhost/cite/xenon?version=3.0.4&format=bibtex) should return a reference manager file for software package Xenon version 3.0.4 in BibTeX format.

#### Graphs / metrics / insights

- [``http://localhost/graphs``](http://localhost/graphs) should show you some integrated statistics of all the packages in the local instance of the Research Software Directory

#### OAI-PMH

- [``http://localhost/oai-pmh?verb=ListRecords&metadataPrefix=datacite4``](http://localhost/oai-pmh?verb=ListRecords&metadataPrefix=datacite4) should return an XML document with metadata about all the packages that are in the local instance of the Research Software Directory, in DataCite 4 format.

#### Harvesting schedule

- [``http://localhost/schedule``](http://localhost/schedule) should return the cron job describing when each harvester is scheduled to run.

### Removing local state

The Research Software Directory stores its state in a couple of places. While
doing development, sometimes you need to clear the local state, therefore this
section lists some ways to clear such state. Be aware that running these
commands results in the **LOSS OF DATA**.

- Remove a docker container:

    ```
    # remove a container associated with a specific service from docker-compose.yml
    docker-compose rm <service name>

    # remove any container corresponding to any of the services defined in docker-compose.yml
    docker-compose rm
    ```

- Remove a docker image:

    ```
    # remove a specific image
    docker rmi <image name>
    ```

- Docker bind mounts store data in ``<project directory>/docker-volumes``, remove with:

    ```
    sudo rm -rf cert/ db/ letsencrypt/ oaipmh-cache/
    ```

- Docker static volumes store data. Refer to [/docker-compose.yml](/docker-compose.yml) to see which services use which volumes. Remove a volume with:

    ```
    # remove volumes that are not in use by any containers
    docker volume prune

    # or remove a specific volume
    docker volume rm <volume>
    ```

- Docker networks. By default, the services in [/docker-compose.yml](/docker-compose.yml) share a network named ``rsd_default``. Remove a network with

    ```
    # remove networks that are not in use by any containers
    docker network prune

    # or remove a specific network
    docker network rm <network>
    ```

- To remove Docker container, images, static volumes and networks in single step (bind mounts still need to be removed separately) with

    ```shell
    docker-compose down --rmi all -v
    ```