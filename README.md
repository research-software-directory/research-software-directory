[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg)](https://www.research-software.nl/software/research-software-directory)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1154130.svg)](https://doi.org/10.5281/zenodo.1154130)
![Admin tests](https://github.com/research-software-directory/research-software-directory/workflows/Admin%20tests/badge.svg)
![Frontend tests](https://github.com/research-software-directory/research-software-directory/workflows/Frontend%20tests/badge.svg)
![Backend tests](https://github.com/research-software-directory/research-software-directory/workflows/Backend%20tests/badge.svg)
![Integration Tests](https://github.com/research-software-directory/research-software-directory/workflows/Integration%20Tests/badge.svg)

# Research Software Directory

## What is it?

The Research Software Directory is a content management system that is tailored to research software.

The idea is that institutes for whom research software is an important output, can run their own instance of the Research Software Directory. The system is designed to be flexible enough to allow for different data sources, database schemas, and so on. By default, the Research Software Directory is set up to collect data from GitHub, Zenodo, Zotero, as well as Medium blogs.

For each software package, a _product page_ can be created on the Research Software Directory if the software is deemed useful to others.

## What the Research Software Directory can do for you

- Improves findability of software packages
- Includes metadata to help search engines understand what a given software package is about
- Harvests data from [Zotero](http://zotero.org/), [Zenodo](https://zenodo.org/), GitHub, as well as other sources, and presents software packages within their social and scientific context
- Promotes dissemination of software
- Modular system that is meant to be customizable, e.g. with respect to branding, database schemas, an so on
- Makes scientific impact visible in a qualitative way
- Helps decision-making based on metrics and graphs
- Provides metadata via [OAI-PMH](https://www.openarchives.org/pmh/), the standard protocol for metadata harvesting

## Try it out

### Requirements

- You'll need a minimum of about **3 GB free disk space** to
store the images, containers and volumes that we will be making.
- Make sure you have a Linux system with
  - [docker](https://docs.docker.com/install/) (v19.03 or later)
  - [docker-compose](https://docs.docker.com/compose/install/) (v1.26 or later)
  - [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (v2.21 or later)

### Instructions

To quickly get a running Research Software Directory up and running on your local machine do the following

1. Fork this repo to your own GitHub organization or GitHub profile and clone it
1. Start the complete stack using

    ```shell
    cp rsd-secrets.env.example .env
    docker-compose build
    docker-compose up
    ```
Go to [http://localhost](http://localhost) (disregard certificate warning) to see the Research Software Directory
website. You should be able to see all non-authenticated pages, but editing data or harvesting data from external
sources won't work. To bring up the website with all bells and whistles, read on in the next chapters.

## Use cases

- [Running an instance with your own data sources](/docs/configure.md)
- [Entering your own data](/docs/instruction/README.md)
- [Changing the look and feel](/docs/customize.md)
- [Contributing](/.github/CONTRIBUTING.md)
- [Maintaining](/docs/maintaining.md)
- [Finding your way: Research Software Directory services](/docs/services.md)
- [Hosting your instance online](/docs/hosting.md)
- [Security concerns](/docs/security.md)
