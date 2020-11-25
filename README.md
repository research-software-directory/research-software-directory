[![Research Software Directory](https://img.shields.io/badge/rsd-Research%20Software%20Directory-00a3e3.svg)](https://www.research-software.nl/software/research-software-directory)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.1154130.svg)](https://doi.org/10.5281/zenodo.1154130)
![Admin tests](https://github.com/research-software-directory/research-software-directory/workflows/Admin%20tests/badge.svg)
![Frontend tests](https://github.com/research-software-directory/research-software-directory/workflows/Frontend%20tests/badge.svg)
![Backend tests](https://github.com/research-software-directory/research-software-directory/workflows/Backend%20tests/badge.svg)
![Integration Tests](https://github.com/research-software-directory/research-software-directory/workflows/Integration%20Tests/badge.svg)
[![Check Markdown links](https://github.com/research-software-directory/research-software-directory/workflows/Check%20Markdown%20links/badge.svg)](https://github.com/research-software-directory/research-software-directory/actions?query=workflow%3A%22Check+Markdown+links%22)

# Research Software Directory

## What is it?

The Research Software Directory is a content management system that is tailored to research software.

The idea is that institutes for whom research software is an important output, can run their own instance of the Research Software Directory. The system is designed to be flexible enough to allow for different data sources, database schemas, and so on. By default, the Research Software Directory is set up to collect data from GitHub, Zenodo, Zotero, as well as Medium blogs.

For each software package, a _product page_ can be created on the Research Software Directory if the software is deemed useful to others.

## What the Research Software Directory can do for you

The Research Software Directory:

1. presents software packages alongside the context necessary for visitors to understand how the software can help them
1. makes scientific impact of research software visible in a qualitative way
1. provides automatically generated citation metadata in a variety of reference manager file formats, for easy citation
1. improves findability of software packages by applying Search Engine Optimization techniques such as schema.org metadata. This helps search engines understand what a given software package is about, thus improving ranking of search results
1. provides aggregated insights through a metrics dashboard, helping to make more accurate and more timely business decisions
1. provides metadata about its software packages via [OAI-PMH](https://www.openarchives.org/pmh/), the standard protocol for metadata harvesting. Digital libraries and other services can use this feature to automatically update their records with data about the software packages published in the Research Software Directory.
1. provides all of its data via a JSON API
1. integrates with third-party services such as [Zotero](http://zotero.org/) (reference manager), [Zenodo](https://zenodo.org/) (archiving), GitHub (code development platform)

## Try it out

### Requirements

1. You'll need a minimum of about 3 GB free disk space to
store the images, containers and volumes that we will be making.
1. Linux OS (we use Ubuntu 18.04)
1. [docker](https://docs.docker.com/install/) (v19.03 or later)
1. [docker-compose](https://docs.docker.com/compose/install/) (v1.26 or later)
1. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (v2.21 or later)

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

1. [Contributing](/.github/CONTRIBUTING.md)
1. [Running an instance with your own data sources](/docs/configure.md)
1. [Entering your own data](/docs/instruction/README.md)
1. [Changing the look and feel](/docs/customize.md)
1. [Finding your way: Research Software Directory services](/docs/services.md)
1. [Documentation for developers](/docs/dev.md)
1. [Documentation for maintainers](/docs/maintaining.md)
1. [Hosting your instance online](/docs/hosting.md)
1. [Running an instance of the Research Software Directory in production](/docs/production.md)
1. [Security concerns](/docs/security.md)
