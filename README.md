[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg)](https://www.research-software.nl/software/research-software-directory)
[![Build Status](https://travis-ci.org/research-software-directory/research-software-directory.svg?branch=master)](https://travis-ci.org/research-software-directory/research-software-directory)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1154130.svg)](https://doi.org/10.5281/zenodo.1154130)

This README file has the following sections:


- [What is the Research Software Directory?](#what-is-the-research-software-directory)
- [How do I enter data into an instance of the Research Software Directory?](#how-do-i-enter-data-into-an-instance-of-the-research-software-directory)
- [Documentation for developers](#documentation-for-maintainers)
- [Documentation for maintainers](#documentation-for-maintainers)


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

## Try it out

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
- ``git``: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

### Try it out, step 1/3: Fork and clone

Click the ``Fork`` button on
https://github.com/research-software-directory/research-software-directory/ to
fork to your own GitHub organization or GitHub profile, then:

```bash
git clone https://github.com/research-software-directory/research-software-directory.git
```

### Try it out, step 2/3: Configure

The research software directory is configured using a file with environment variables called `.env`.
An example config file (`.env.example`) is available, use it as a starting point.

```bash
cd research-software-directory
cp .env.example .env
```

The config file has some placeholder values (`changeme`); they must be set by editing the `.env` file.
Below are instructions on how to get the different tokens and keys.

* AUTH_GITHUB_ORGANIZATION
  1. Set to GitHub organization name which users should be member of to login to admin site
* AUTH_GITHUB_CLIENT_ID + AUTH_GITHUB_CLIENT_SECRET
  1. Goto https://github.com/settings/developers -> OAuth Apps -> New OAuth App
  2. Set Authorization callback url: http://localhost/auth/get_jwt (This assumes you will be doing local development; if you're planning to host your site online, replace http://localhost with the (https:// + domain) the site will be accessible on)
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
  
### Try it out, step 3/3: Start the complete stack using [docker-compose](https://docs.docker.com/compose/)

```bash
docker-compose --project-name rsd up --build
# shorthand:
docker-compose -p rsd up --build
```

After the Research Software Directory instance is up and running, we want to
start harvesting data from external sources such as GitHub, Zotero, Zenodo, etc.
To do so, open a new terminal and run

```bash
docker-compose --project-name rsd exec harvesting python app.py harvest all
```

You should see some feedback in the newly opened terminal. 

After the ``harvest all`` task finishes, several database collections should
have been updated, but we still need to use the data from those separate
collections and combine them into one document that we can feed to the frontend.
This is done with the ``resolve`` task, as follows:

```bash
docker-compose --project-name rsd exec harvesting python app.py resolve
```

By default, the ``resolve`` tasks runs every fifth minute anyway, so you could just wait for a bit, until you see some output scroll by that is generated by the ``rsd-harvesting`` container, something like:

```
rsd-harvesting     | 2018-07-11 10:30:02,990 cache_software [INFO] processing Xenon command line interface
rsd-harvesting     | 2018-07-11 10:30:03,013 cache_software [INFO] processing Xenon gRPC server
rsd-harvesting     | 2018-07-11 10:30:03,036 cache_software [INFO] processing xtas
rsd-harvesting     | 2018-07-11 10:30:03,059 cache_software [INFO] processing boatswain
rsd-harvesting     | 2018-07-11 10:30:03,080 cache_software [INFO] processing Research Software Directory
rsd-harvesting     | 2018-07-11 10:30:03,122 cache_software [INFO] processing cffconvert
rsd-harvesting     | 2018-07-11 10:30:03,149 cache_software [INFO] processing sv-callers

```

Open a web browser to verify that everything works as it should.

- [``http://localhost``](http://localhost) should show a local instance of the Research Software Directory
- [``http://localhost/admin``](http://localhost/admin) should show the Admin interface to the local instance of the Research Software Directory
- [``http://localhost/api/software``](http://localhost/api/software) should show a JSON representation of all software in the local instance of the Research Software Directory
- [``http://localhost/software/xenon``](http://localhost/software/xenon) should show a product page (here: Xenon) in the local instance of the Research Software Directory
- [``http://localhost/api/software/xenon``](http://localhost/api/software/xenon) should show a JSON representation of a product (here: Xenon) in the local instance of the Research Software Directory

---

## General workflow when making changes

Let's say you followed the steps above, and have a running instance of the
Research Software Directory. Now you may want to make some changes to bring the
frontend in line with your institute's branding. For example, you could follow
the steps outlined [here](docs/faq/how-do-i-change-the-font.md) to change the fonts.

Now the question is, after making your changes, how do you get to see them?
Here's how:

1. Go to the terminal where you started ``docker-compose``
1. Use Ctrl+C to stop the running instance of Research Software Directory
1. Check which docker containers you have with:

    ```
    docker-compose --project-name rsd ps
    # shorthand:
    docker-compose -p rsd ps
    ```

    For example, mine says:

    ```
    docker-compose -p rsd ps
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
    docker-compose --project-name rsd rm frontend
    # shorthand: 
    docker-compose -p rsd rm frontend
    ```

    List all docker images on your system:
    ```
    docker images
    ```
    
    Note that image names consist of whatever you entered as **--project-name**, followed by ``_``,
    followed by the service name. Remove as follows:

    ```
    docker rmi rsd_frontend
    ```
1. Make changes to the source code of the service whose container and image your just removed
1. Rebuild containers as necessary, using:

    ```
    docker-compose --project-name rsd up --build
    # shorthand:
    docker-compose -p rsd up --build
    ```

## Frequently Asked Questions

Refer to the Frequently Asked Questions for more detailed
answers to specific questions:

### Frontend

1. [How do I change the font?](docs/faq/how-do-i-change-the-font.md)
1. [How do I change the logo?](docs/faq/how-do-i-change-the-logo.md)
1. [How do I change the colors?](docs/faq/how-do-i-change-the-colors.md)

### Harvesting

1. [How do I change when data collection scripts run?](docs/faq/how-do-i-change-when-data-collection-scripts-run.md)

---

# Documentation for maintainers

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

1. Follow the notes from the 'For users' section above, and verify that it all works as it should.
1. Use GitHub's ``Draft a new release`` button [here](https://github.com/research-software-directory/research-software-directory/releases) to make a release.



