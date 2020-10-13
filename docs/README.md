[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg)](https://www.research-software.nl/software/research-software-directory)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1154130.svg)](https://doi.org/10.5281/zenodo.1154130)

| Build status |
|---|
| ![Admin tests](https://github.com/research-software-directory/research-software-directory/workflows/Admin%20tests/badge.svg) |
| ![Frontend tests](https://github.com/research-software-directory/research-software-directory/workflows/Frontend%20tests/badge.svg) |
| ![Backend tests](https://github.com/research-software-directory/research-software-directory/workflows/Backend%20tests/badge.svg) |
| ![Integration Tests](https://github.com/research-software-directory/research-software-directory/workflows/Integration%20Tests/badge.svg) |

# Contents

- [What is the Research Software Directory?](#what-is-the-research-software-directory)
- [How do I enter data into an instance of the Research Software Directory?](#how-do-i-enter-data-into-an-instance-of-the-research-software-directory)
- [Documentation for developers](#documentation-for-developers)
    - [Try it out locally](#try-it-out-locally)
        - [Fork and clone](#try-it-out-step-13-fork-and-clone)
        - [Configure](#try-it-out-step-23-configure)
        - [Start the complete stack](#try-it-out-step-33-start-the-complete-stack-using-docker-compose)
        - [Verifying the local installation](#verifying-the-local-installation)
        - [Removing local state](#removing-local-state)
    - [Services of the Research Software Directory](#services-of-the-research-software-directory)
    - [Customize your instance of the Research Software Directory](#customize-your-instance-of-the-research-software-directory)
        - [General workflow when making changes](#general-workflow-when-making-changes)
    - [Make your instance available to others by hosting it online (deployment)](#make-your-instance-available-to-others-by-hosting-it-online-deployment)
        - [Configuring EC2](#configuring-ec2)
        - [Configuring IAM](#configuring-iam)
        - [Configuring S3](#configuring-s3)
    - [Notes on security](#notes-on-security)
- [Documentation for maintainers](#documentation-for-maintainers)
    - [Visualizing ``docker-compose.yml``](#visualizing-docker-composeyml)
    - [Making a release](#making-a-release)
    - [Pulling in changes from upstream using a three-way merge](#pulling-in-changes-from-upstream-using-a-three-way-merge)
    - [Updating a production instance](#updating-a-production-instance)

# What is the Research Software Directory?

The Research Software Directory is a content management system that is tailored
to software.

The idea is that institutes for whom research software is an important output,
can run their own instance of the Research Software Directory. The system is
designed to be flexible enough to allow for different data sources, database
schemas, and so on. By default, the Research Software Directory is set up to
collect data from GitHub, Zenodo, Zotero, as well as Medium blogs.

For each software package, a _product page_ can be created on the Research
Software Directory if the software is deemed useful to others. Here is an
example of what a product page may look like:

![/docs/images/20180627-webcapture-xenon.png](/docs/images/20180627-webcapture-xenon.png)

While the content
shown on the product page can be completely customized, by default it includes a
_Mentions_ section, which can be used to characterize the context in which the
software exists. The context may include links to scientific papers, but is
certainly broader than that: for example, there may be links to web applications
that demonstrate the use of the software, there may be links to videos on
YouTube, tutorials on readthedocs.io or Jupyter notebooks, or there may be links
to blog posts; really, anything that helps visitors decide if the software could
be useful for them.

The Research Software Directory improves findability of software packages,
partly because it provides metadata that helps search engines understand what
the software is about, but more importantly because of the human centered text
snippets that must be provided for each software package. After all, discovery
of a software package is often not so much about finding it but knowing that you
found it.

# How do I enter data into an instance of the Research Software Directory?

The process is described [here](/docs/instruction/README.md).

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

## Services of the Research Software Directory

The Research Software Directory is made of the following services

- [frontend](frontend/): Python web application which renders HTML pages for normal visitors
- [backend](backend/): Python web service for programmatic access to the directory data (software, projects, persons, organizations). Used by other services to fetch and set data.
- [reverse-proxy](reverse-proxy/): Web server responsible for combining all web based services behind a single domain and port. Also hosts the static files of other services for best performance and caching.
- [admin](admin/): React application for editing the data in the directory. Hosted by `reverse-proxy` service.
- [auth-github](auth-github/): Protects the `admin` service by forcing authentication with a GitHub account and authorization using GitHub organization membership.
- [nginx-ssl](https://hub.docker.com/r/rsdnlesc/docker-term-letsencrypt/): Responsible for encrypting (HTTPS) traffic from `reverse-proxy` service. Service is implemented in an [external repository](https://github.com/Tommos0/docker-term-letsencrypt).
- [backup](backup/): For backup, copies database to an S3 bucket every day. Only runs when configured.
- [database](database/): A Mongo database. Used by `backend` service to store data. Initializes with sample data when database is empty.
- [graphs](graphs/): Web page which shows metrics of directory. Hosted by `reverse-proxy` service.
- [harvesting](harvesting/): Scheduled jobs which periodicaly fetch external data. For example commits from GitHub and mentions from Zotero.

All these services are started in the [Docker compose file](docker-compose.yml). All services, except `nginx-ssl` have their own directory in the repository.

## Customize your instance of the Research Software Directory


Let's say you followed the steps above, and have a running instance of the
Research Software Directory. Now it is time to start customizing your Research
Software Directory. We have prepared some FAQs for customizations that are
common. For example, you can read up on the following topics:

1. [How do I change the colors?](docs/faq/how-do-i-change-the-colors.md)
1. [How do I change the font?](docs/faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](docs/faq/how-do-i-change-the-logo.md)
1. [How do I change when data collection scripts run?](docs/faq/how-do-i-change-when-data-collection-scripts-run.md)
1. [How do I empty the database?](docs/faq/how-do-i-empty-the-database.md)
1. [How do I make changes to the admin interface?](docs/faq/how-do-i-make-changes-to-the-admin-interface.md)
1. [How do I add properties to the data schema?](docs/faq/how-do-i-add-properties-to-the-data-schema.md)

It is suggested that you first do one or more of:

1. [How do I change the colors?](docs/faq/how-do-i-change-the-colors.md)
1. [How do I change the font?](docs/faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](docs/faq/how-do-i-change-the-logo.md)

Then, learn how to add properties to the schema:

1. [How do I add properties to the data schema?](docs/faq/how-do-i-add-properties-to-the-schema.md)

Finally, learn how to empty the database, such that you can replace the sample
data with your own:

1. [How do I empty the database?](docs/faq/how-do-i-empty-the-database.md)


### General workflow when making changes

After making your changes, here's how you get to see them:

1. Go to the terminal where you started ``docker-compose``
1. Use Ctrl+C to stop the running instance of Research Software Directory
1. Check which docker containers you have with:

    ```
    docker-compose ps
    ```

    For example, mine says:

    ```
    docker-compose ps
           Name                     Command                State     Ports
    ----------------------------------------------------------------------
    rsd-admin            sh -c rm -rf /build/* && c ...   Exit 0
    rsd-authentication   /bin/sh -c gunicorn --prel ...   Exit 0
    rsd-backend          /bin/sh -c gunicorn --prel ...   Exit 0
    rsd-database         /mongo.sh --bind_ip 0.0.0.0      Exit 137
    rsd-frontend         /bin/sh -c sh -c "mkdir -p ...   Exit 0
    rsd-nginx-ssl        /bin/sh -c /start.sh             Exit 137
    rsd-reverse-proxy    /bin/sh -c nginx -g 'daemo ...   Exit 137
    rsd-harvesting       /bin/sh -c crond -d7 -f          Exit 137
    ```

    Use ``docker-compose rm`` to delete container by their **service name**, e.g. the ``rsd-frontend`` container:

    ```
    docker-compose rm frontend
    ```

    List all docker images on your system:
    ```
    docker images
    ```

    Note that image names consist of the environment variable ``COMPOSE_PROJECT_NAME``, followed by ``/``,
    followed by the service name. Remove as follows:

    ```
    docker rmi rsd/frontend
    ```
1. Make changes to the source code of the service whose container and image you just removed
1. Rebuild containers as necessary, using:

    ```
    docker-compose build frontend
    docker-compose up -d frontend
    ```


## Notes on security

The Research Software Directory is set up as a collection of services such as ``backend``, ``frontend``, ``harvesting``, etc. To avoid one service interfering with another, each service is dockerized. In a sense, docker is a bit like object oriented programming: you have your data and methods together, and other methods don't have access to data unless you specifically said that is OK.

Let's say that an attacker succeeds in somehow escaping the containment of the docker environment. If you set up your instance on Amazon EC2/S3 as described in above, that may mean that they then have access to:

1. the Research Software Directory software
1. the collections in the Mongo database
1. the plaintext keys that are stored in ``rsd-secrets.env``

Note that it does not mean they will have access to any of the rest of your institute's web site, since that content is hosted on physically different machines, in a physically different location, with different networks, different credentials, and probably a login procedure that is more challenging than just username/password.

With regard to (1), that information is public anyway. Just ``git clone`` would be a much easier way to get that information. I guess the worst they could do here is make a change to the code and break the site. Or possibly, keep the website like it is but use the Amazon machine to start mining bitcoins in the background. If that would happen though, the usage graphs that Amazon provides would clearly show a change in behavior (from a spikey pattern directly related to the crontab file to a uniform pattern).

With regard to (2), that information is (by default) harvested from public sources, so not much to be gained there. A possible risk would be if the attacker aims to change the information displayed on the website, for example, pointing links to the wrong place, or changing the description of a software package. Other risks might be that they empty the database, or change data in such a way that the site no longer works.

With regard to (3), having access to some keys matters more than having access to others. Keys that don't matter so much are ``DOMAIN``, ``SSL_ADMIN_EMAIL``, ``SSL_DOMAINS``, ``ZOTERO_LIBRARY``. Those are not really secret anyway, they are more of a configuration value.

``AUTH_GITHUB_CLIENT_ID`` and ``AUTH_GITHUB_CLIENT_SECRET`` are only useful if the attacker is a member of ``AUTH_GITHUB_ORGANIZATION``. If they in fact are a member, having access to the id and secret does not give them much extra, because they already have direct access to the database service at that point (item 2 from the list above).

``GITHUB_ACCESS_TOKEN`` provides readonly access to GitHub's publicly available data, it's just used to increase the rate limit of GitHub's API.

``ZOTERO_API_KEY`` provides readonly access to your Zotero library, which is probably public information anyway. Again its main purpose is to increase the rate limit of allowed API usage.

If an attacker had access to ``BACKUP_CMD``, that could potentially lead to the loss of your backups. They could use the username and password to throw away any backups you have in that particular S3 bucket. (Note that you could make copies to another bucket if you wanted to, or set up a different backup mechanism altogether; it _might_ be possible to configure your S3 bucket such that you can write a backup file with the credentials from ``BACKUP_CMD``, but not delete them).

``JWT_SECRET`` is only used to have services talk to each other, but doesn't give an attacker any abilities that they would not already have, given that we assumed they have access to every service already.

A couple more remarks:

- Mongo has been in the news for mongo instances running on the internet without authentication (the default installation) leaking information. The Research Software Directory runs the Mongo instance in a private network wrapped by the token-protected backend service.

- Whoever is in charge of the Amazon machine needs to do the security updates of the host machine, in particular those updates that relate to the docker/docker-compose installation. Furthermore it's a good idea to also rebuild the docker images for each service, because then they get their respective updates.

- Also be aware that a service can have dependencies which may not be completely up to date, for example if the ``requirements.txt`` is outdated. This can have security implications.

- Regarding DDOS attacks, this is possible of course but not very likely in our opinion. However in such a case you would be charged more because there is more outbound traffic. You can mitigate it by setting a "budget exceeded" alarm on your usage.


# Documentation for maintainers

## Visualizing ``docker-compose.yml``

It is sometimes helpful to visualize the structure in the ``docker-compose.yml`` file.
Use https://github.com/pmsipilot/docker-compose-viz to generate a png image.

```
docker run --rm -it --name dcv -v $(pwd):/input pmsipilot/docker-compose-viz render -m image --output-file=docs/images/docker-compose.png docker-compose.yml
```

For example,

![/docs/images/docker-compose.png](/docs/images/docker-compose.png)

## Making a release

1. Write the release notes
1. Update CITATION.cff
1. Generate the metadata file for Zenodo using [cffconvert](https://pypi.org/project/cffconvert/).

    ```bash
    pip install --user cffconvert
    cffconvert --outputformat zenodo --ignore-suspect-keys --outfile .zenodo.json
    ```
    ```bash
    # git add, commit, and push everything
    ```

1. Make sure that everything is pushed

    ```bash
    cd $(mktemp -d)
    git clone https://github.com/research-software-directory/research-software-directory.git
    cd research-software-directory
    ```

1. Follow the notes from the ['For developers'](#documentation-for-developers) section above, and verify that it all works as it should.
1. Use GitHub's ``Draft a new release`` button [here](https://github.com/research-software-directory/research-software-directory/releases) to make a release.

## Pulling in changes from upstream using a three-way merge

Set ``UPSTREAM`` and ``DOWNSTREAM`` to the different sources you want to
three-way merge between, e.g.

```bash
UPSTREAM=https://github.com/research-software-directory/research-software-directory.git
DOWNSTREAM=https://github.com/process-project/research-software-directory.git
```

Then:

```bash
cd $(mktemp -d)
mkdir left middle right
cd left && git clone $UPSTREAM . && cd -
cd middle && git clone $DOWNSTREAM . && git branch develop && git checkout develop && cd -
cd right && git clone $DOWNSTREAM . && cd -
meld left middle right &
```

You should only make changes to the ``middle`` one. When you're done making your changes,

```bash
git add <the files>
git commit
git push origin develop
```

## Updating a production instance

Every now and then, the production instance needs to be updated, so the server
can get the latest security patches, and the Research Software Directory
software itself can be updated to include the latest features.

The steps below differentiate between the old and the new instance of the Research
Software Directory; the old instance has IP ``35.156.38.208``, the new one has
IP ``3.122.233.225``. Your IP addresses will likely be different.

1. Make a new Amazon instance by following the notes above. Some things to think about:
    - Reuse the existing security group.
    - Reuse the existing key pair.
    - Verify that you're allowed to ssh into the new instance.
1. Transfer the ``rsd-secrets.env`` file from the old instance to the new instance.

    ```shell
    $ cd $(mktemp -d)
    $ scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ubuntu@35.156.38.208:/home/ubuntu/rsd/rsd-secrets.env .
    $ scp -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ./rsd-secrets.env \
      ubuntu@3.122.233.225:/home/ubuntu/rsd/rsd-secrets.env
    ```
1. On the remote, create the symlink `.env` and let it point to `rsd-secrets.env`:

    ```shell
    cd ~/rsd
    ln -s rsd-secrets.env .env
    ```

1. Transfer files related to SSL certificates from the old instance to the new instance.

    ```shell
    # (on the new machine, remove the cert directory from
    # /home/ubuntu/rsd/docker-volumes/ if it exists)

    $ scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ubuntu@35.156.38.208:/home/ubuntu/rsd/docker-volumes/cert .

    $ scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
      ./cert \
      ubuntu@3.122.233.225:/home/ubuntu/rsd/docker-volumes/cert

    # on the new machine, change the owner of cert/ to 'root'
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@3.122.233.225
    $ cd /home/ubuntu/rsd/docker-volumes
      sudo chown -R root:root cert
    ```

1. Stop new additions to the database in the old research software
   directory instance by stopping the ``rsd-admin`` service.

    ```
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@35.156.38.208
    $ cd /home/ubuntu/rsd
    $ docker-compose stop rsd-admin
    ```

1. Create the backup files in the old Research Software Directory instance:

    ```
    # start an interactive shell in the backup container
    $ docker-compose exec backup /bin/sh

    # create the backup files in the container's /dump directory
    /app # mongodump \
      --host ${DATABASE_HOST} \
      --port ${DATABASE_PORT} \
      --db ${DATABASE_NAME} \
      --out /dump

    # leave the backup container
    exit

    # Copy the dump directory out of the docker container
    docker cp $(docker-compose ps -q backup):/dump/rsd /home/ubuntu/rsd/dump
    ```

1. Transfer the dumped json and bson files from the old to the new instance

    ```
    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
    ubuntu@35.156.38.208:/home/ubuntu/rsd/dump .

    scp -r -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem \
    ./dump/* ubuntu@3.122.233.225:/home/ubuntu/rsd/database/db-init/

    ```

1. Start the new Research Software Directory instance.

    ```
    $ ssh -i ~/.ssh/rsd-instance-for-nlesc-on-aws.pem ubuntu@3.122.233.225
    $ cd /home/ubuntu/rsd

    $ docker-compose build
    $ docker-compose up -d
    ```

1. Check [/CHANGELOG.md](/CHANGELOG.md) to see if you need to run any command to
   migrate data, e.g. when a collection has changed its schema.

1. Next, harvest all the data from external sources using:

    ```
    $ docker-compose exec harvesting python app.py harvest all
    $ docker-compose exec harvesting python app.py resolve all
    ```

1. In case the old instance had problems with harvesting of the mentions, you
   may need to retrieve all mentions, as follows:

    ```
    $ docker-compose exec harvesting python app.py harvest mentions --since-version 0
    ```

1. Check if the instance works correctly using a browser to navigate to
   the new instance's IP address.
1. If everything looks good, stop the Research Software Directory in the old instance

    ```
    $ docker-compose stop
    ```

1. Disassociate the ElasticIP address from the old instance.
1. Associate the ElasticIP address with the new instance.

As a final step, use the Amazon EC2 management console to ``Stop`` (not
``Terminate``) the old instance. This way, the old instance can still be
reactivated in case you need to get back to the old version.