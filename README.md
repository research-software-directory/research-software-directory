[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg)](https://www.research-software.nl/software/research-software-directory)
[![Build Status](https://travis-ci.org/research-software-directory/research-software-directory.svg?branch=master)](https://travis-ci.org/research-software-directory/research-software-directory)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1154130.svg)](https://doi.org/10.5281/zenodo.1154130)

This README file has 3 sections, with documentation for [users](#for-users), for 
[developers](#for-developers), and for [maintainers](#for-maintainers).

# For users

The Research Software Directory is a content management system that is tailored
to software.

The idea is that institutes for whom research software is an important output,
can run their own instance of the Research Software Directory. The system is
designed to be flexible enough to allow for different data sources, database
schemas, and so on. By default, the Research Software Directory is set up to
collect data from GitHub, Zenodo, Zotero, as well as Medium blogs.

For each software package, a product page can be created on the Research
Software Directory if the software is deemed useful to others. While the content
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

## Try it out

Basically, these are the steps to get a copy of https://research-software.nl running locally (including data):

1. Clone this repo
1. Configure
1. Start the complete stack using ``docker-compose``

For details, see below.

**Try it out, step 1/3: Clone this repo**

Make sure to use the ``--recursive`` flag, because this repository has ``git submodules``.

```bash
git clone --recursive https://github.com/research-software-directory/research-software-directory.git
```

**Try it out, step 2/3: Configure**

The research software directory is configured using a file with environment variables called `.env`.
An example config file (`.env.example`) is available, use it as a starting point.

```bash
cd research-software-directory
cp .env.example .env
```

The config file has some place holder values (`changeme`) they must be set by editing the `.env` file.
Below are instructions how to get the different tokens and keys.

* AUTH_GITHUB_ORGANIZATION
  1. Set to GitHub organization name which users should be member of to login to admin site
* AUTH_GITHUB_CLIENT_ID + AUTH_GITHUB_CLIENT_SECRET
  1. Goto https://github.com/settings/developers -> OAuth Apps -> New OAuth App
  2. Set Authorization callback url: https://localhost/auth/get_jwt (replace localhost with the domain the site will be accessible on)
  3. Register application
     * Use Client ID as value for AUTH_GITHUB_CLIENT_ID
     * Use Client Secret as value for AUTH_GITHUB_CLIENT_SECRET
* GITHUB_ACCESS_TOKEN
  1. Goto https://github.com/settings/tokens
  2. Generate new token
  3. Select no scopes
  4. Use token as value for GITHUB_ACCESS_TOKEN
* ZOTERO_API_KEY
  1. https://www.zotero.org/settings/keys
  2. Create new private key
  3. Group permissions: Read Only
  4. Use api key as value for ZOTERO_API_KEY
* ZOTERO_LIBRARY
  1. The Zotero group identifier, for example `1689348` is the identifier for group https://www.zotero.org/groups/1689348/netherlands_escience_center
* JWT_SECRET
  1. Generate a random string (eg. `openssl rand -base64 32`) and use as value for JWT_SECRET
  
**Try it out, step 3/3: Start the complete stack using [docker-compose](https://docs.docker.com/compose/)**

```bash
docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --build
```

# For developers

## General workflow when making changes

Let's say you followed the steps above, and have a running instance of the
Research Software Directory. Now you may want to make some changes to bring the
frontend in line with your institute's branding. For example, you could follow
the steps outlined [here](faq/how-do-i-change-the-font.md) to change the fonts.

Now the question is, after making your changes, how do you get to see them?
Here's how:

1. Go to the terminal where you started ``docker-compose``
1. Use Ctrl+C to stop the running instance of Research Software Directory
1. Check which docker containers you have with:

    ```
    docker ps -a
    ```

    for example, mine says:

    ```
    CONTAINER ID        IMAGE                  COMMAND                   CREATED             STATUS                       PORTS               NAMES
    a570e0cc8ea8        certbot/certbot        "sh /certbot.sh"          3 minutes ago       Exited (1) 3 minutes ago                         tmpufoyhj4z6k_certbot_1
    b15cabf82f23        rsdnlesc/nginx_proxy   "/bin/sh -c 'sh /sta…"    3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_nginx_1
    5e7ab363a5ba        rsdnlesc/frontend      "/bin/sh -c 'sh -c \"…"   3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_frontend_1
    b7b24d3ce94b        rsdnlesc/tasks         "/bin/sh -c 'crond -…"    3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_tasks_1
    8703e87e709f        rsdnlesc/backend       "/bin/sh -c 'gunicor…"    3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_backend_1
    531a6d53430b        rsdnlesc/admin         "sh -c 'rm -rf /buil…"    3 minutes ago       Exited (0) 3 minutes ago                         tmpufoyhj4z6k_admin_1
    d90006bc24ff        mongo:3.6              "/mongo.sh --bind_ip…"    3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_mongo_1
    34739f47c066        rsdnlesc/auth-github   "/bin/sh -c 'gunicor…"    3 minutes ago       Exited (137) 7 seconds ago                       tmpufoyhj4z6k_auth_1
    ```

    Use ``docker rm`` to delete the container you want to update, e.g. the frontend container:

    ```
    docker rm tmpufoyhj4z6k_frontend_1
    ```

    Check which images you have with ``docker images``, remove by ID as appropriate:

    ```
    REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
    rsdnlesc/tasks         latest              9db08e8cee63        5 minutes ago       112MB
    rsdnlesc/nginx_proxy   latest              7464658d4907        5 minutes ago       22.2MB
    rsdnlesc/frontend      latest              1cf1300f8ff9        5 minutes ago       108MB
    rsdnlesc/backend       latest              db04aa6963f9        5 minutes ago       107MB
    rsdnlesc/auth-github   latest              35c7621b8bdf        5 minutes ago       106MB
    rsdnlesc/admin         latest              f5de3ab5f77a        6 minutes ago       26.3MB
    <none>                 <none>              f2ba918b63de        6 minutes ago       1.48GB
    python                 3.6-alpine          951c2507873b        3 days ago          88MB
    nginx                  alpine              920e5c5c8bed        3 days ago          18.6MB
    mongo                  3.6                 bbed8d0e01c1        13 days ago         368MB
    certbot/certbot        latest              aee207f30a81        3 weeks ago         116MB
    node                   8.11.1              78f8aef50581        2 months ago        673MB
    nginx                  1.13.12-alpine      ebe2c7c61055        3 months ago        18MB
    ```

    ```
    docker rmi 1cf1300f8ff9
    ```

1. We should rebuild (only) the docker container that we have updated. To do so, we can use ``docker rm`` followed by the name of the container to remove the old container, e.g. for the frontend container:

    ```
    docker rm tmpzed1arlrtr_frontend_1
    ```

1. And then build a new container, with new content, using:

    ```
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
    ```

## Frequently Asked Questions

Refer to the Frequently Asked Questions ([FAQ](faq/contents.md)) for more detailed
answers to specific questions:

1. [How do I change the font?](faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](faq/how-do-i-change-logo.md)
1. [How do I change the colors?](faq/how-do-i-change-the-colors.md)

## Admin interface

1. ...

## Scrapers
   
1. ...

# For maintainers

## Making a release

1. Update the submodules to the latest version that the remote knows about

    ```bash
    git submodule update --remote --merge
    # check the status
    git submodule status
    # if there are any SHAs preceded by a plus sign, you need
    # to git add them, e.g.
    git add db-dump 
    git commit -m "updated db-dump submodule to the latest version"
    ```

1. Gather information on submodules such that it will make it to Zenodo, e.g.

    ```bash
    git submodule status > submodules.sha.txt
    ```

1. Write the release notes, include the content of submodules.sha.txt
1. Update CITATION.cff
1. Generate the metadata file for Zenodo using [cffconvert](https://pypi.org/project/cffconvert/).

    ```bash
    pip install cffconvert
    cffconvert --outputformat zenodo --ignore-suspect-keys --outfile .zenodo.json
    ```
    ```bash
    # git add, commit, and push everything
    ```
1. Make sure that everything is pushed, and actually works if you follow the steps

    ```bash
    cd $(mktemp -d)
    git clone --recursive https://github.com/research-software-directory/research-software-directory.git .
    ```
    
1. Copy your env file into research-software-directory, or create a new one (see notes in 'For users' section above)
1. Run the stack

    ```bash
    docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --build
    ```
    
1. In a browser, open 
    - [``http://localhost``](http://localhost) (should show a local instance of the Research Software Directory)
    - [``http://localhost/admin``](http://localhost/admin) (should show the Admin interface to the local instance of the Research Software Directory)
    - [``http://localhost/api/software``](http://localhost/api/software) (should show a JSON representation of all software in the local instance of the Research Software Directory)
    - [``http://localhost/software/xenon``](http://localhost/software/xenon) (should show a product page (here: Xenon) in the local instance of the Research Software Directory)
    - [``http://localhost/api/software/xenon``](http://localhost/api/software/xenon) (should show a JSON representation of a product (here: Xenon) in the local instance of the Research Software Directory)

    verify that it all works as it should.

1. Use GitHub's ``Draft a new release`` button [here](https://github.com/research-software-directory/research-software-directory/releases) to make a release.






